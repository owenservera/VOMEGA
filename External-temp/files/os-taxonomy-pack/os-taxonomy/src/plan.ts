// pack.os-taxonomy — plan.ts
// Capability + parameters → an exact, inspectable execution plan. PURE and
// deterministic: same (capability, params, options) ⇒ byte-identical plan.
// Nothing here executes. Every user-supplied value reaches PowerShell only as a
// single-quoted literal (or a fixed Join-Path expression for '~' paths) —
// never as code.
import { byId, realizationsFor } from "./db.ts";
import type { Capability, ParamSpec, Plan, Realization, RealizationBase } from "./types.ts";

export interface PlanOptions {
  platform?: string;          // default "windows"
  osVersion?: string;         // "10" | "11" — filters realizations by os
  allowElevation?: boolean;   // default false: admin realizations are skipped
}

export class PlanError extends Error {
  constructor(public code: "UNKNOWN_CAPABILITY" | "INVALID_PARAMS" | "NO_REALIZATION" | "NEEDS_ELEVATION", message: string, public detail?: unknown) {
    super(message);
  }
}

// ---------------------------------------------------------------- params ----

const MAX_STRING = 1024;
const MAX_TEXT = 8192;

/** Validate + normalize parameters against the capability's declared schema (fail-closed). */
export function normalizeParams(cap: Capability, input: unknown): Record<string, unknown> {
  const raw = input === undefined || input === null ? {} : input;
  if (typeof raw !== "object" || Array.isArray(raw)) throw new PlanError("INVALID_PARAMS", `${cap.id}: params must be an object`);
  const given = raw as Record<string, unknown>;
  const declared = new Set(cap.params.map((p) => p.name));
  const unknown = Object.keys(given).filter((k) => !declared.has(k));
  if (unknown.length) throw new PlanError("INVALID_PARAMS", `${cap.id}: unknown parameter(s) ${unknown.join(", ")}`);
  const out: Record<string, unknown> = {};
  for (const p of cap.params) {
    let v = given[p.name];
    if (v === undefined) v = p.default;
    if (v === undefined) {
      if (p.required) throw new PlanError("INVALID_PARAMS", `${cap.id}: missing required parameter '${p.name}' (${p.description})`);
      continue;
    }
    out[p.name] = checkParam(cap, p, v);
  }
  return out;
}

function checkParam(cap: Capability, p: ParamSpec, v: unknown): unknown {
  const bad = (why: string) => new PlanError("INVALID_PARAMS", `${cap.id}: parameter '${p.name}' ${why}`);
  const noControl = (s: string) => { if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(s)) throw bad("contains control characters"); };
  switch (p.type) {
    case "integer":
    case "percent": {
      const n = typeof v === "string" && /^-?\d+$/.test(v.trim()) ? Number(v.trim()) : v;
      if (typeof n !== "number" || !Number.isInteger(n)) throw bad("must be an integer");
      const min = p.type === "percent" ? Math.max(0, p.min ?? 0) : p.min;
      const max = p.type === "percent" ? Math.min(100, p.max ?? 100) : p.max;
      if (min !== undefined && n < min) throw bad(`must be ≥ ${min}`);
      if (max !== undefined && n > max) throw bad(`must be ≤ ${max}`);
      return n;
    }
    case "boolean":
      if (typeof v === "boolean") return v;
      if (v === "true" || v === "on" || v === "yes") return true;
      if (v === "false" || v === "off" || v === "no") return false;
      throw bad("must be true/false");
    case "enum":
      if (typeof v !== "string" || !p.enum!.includes(v)) throw bad(`must be one of ${p.enum!.join(", ")}`);
      return v;
    case "url": {
      if (typeof v !== "string" || v.length > 2048 || !/^https?:\/\/[^\s"'`]+$/i.test(v)) throw bad("must be an http(s) URL without spaces or quotes");
      return v;
    }
    case "path": {
      if (typeof v !== "string" || v.length === 0 || v.length > 32767) throw bad("must be a non-empty path");
      noControl(v);
      if (/["\r\n]/.test(v)) throw bad("must not contain quotes or newlines");
      if (!/^(~([\\/].*)?|[A-Za-z]:[\\/].*|[A-Za-z]:|\\\\[^\\]+\\.+)$/.test(v)) throw bad("must be absolute (C:\\…, \\\\server\\…) or start with ~");
      return v;
    }
    case "text":
      if (typeof v !== "string" || v.length > MAX_TEXT) throw bad(`must be text ≤ ${MAX_TEXT} chars`);
      noControl(v);
      return v;
    default: // string
      if (typeof v !== "string" || v.length === 0 || v.length > MAX_STRING) throw bad(`must be a non-empty string ≤ ${MAX_STRING} chars`);
      noControl(v);
      if (/[\r\n]/.test(v)) throw bad("must be a single line");
      if (p.pattern && !new RegExp(p.pattern).test(v)) throw bad(`does not match ${p.pattern}`);
      return v;
  }
}

// ----------------------------------------------------------- PowerShell -----

/** PowerShell single-quoted literal. PowerShell also treats ‘ ’ ‚ ‛ as quote characters. */
export function psLiteral(s: string): string {
  return "'" + s.replace(/['\u2018\u2019\u201A\u201B]/g, (q) => q + q) + "'";
}

/** Expression for a parameter value (after enum mapping). */
function psValue(p: ParamSpec | undefined, v: unknown): string {
  if (typeof v === "boolean") return v ? "$true" : "$false";
  if (typeof v === "number") return String(v);
  const s = String(v);
  if (p?.type === "path" && /^~([\\/]|$)/.test(s)) {
    const rest = s.replace(/^~[\\/]?/, "");
    return rest.length === 0 ? "$env:USERPROFILE" : `(Join-Path $env:USERPROFILE ${psLiteral(rest)})`;
  }
  return psLiteral(s);
}

const PLACEHOLDER = /\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g;

function mapped(r: RealizationBase, name: string, v: unknown): unknown {
  const m = r.paramMap?.[name];
  return m && typeof v === "string" && v in m ? m[v] : v;
}

/** Substitute placeholders in a PowerShell body with literal expressions. */
function substituteScript(cap: Capability, r: RealizationBase, tpl: string, params: Record<string, unknown>): string {
  return tpl.replace(PLACEHOLDER, (_, name: string) => {
    const p = cap.params.find((x) => x.name === name);
    if (!(name in params)) throw new PlanError("INVALID_PARAMS", `${cap.id}: realization needs '${name}' but it was not provided`);
    return psValue(p, mapped(r, name, params[name]));
  });
}

/** Render an argument template into a PowerShell expression (literal segments + values). */
function argExpr(cap: Capability, r: RealizationBase, tpl: string, params: Record<string, unknown>, quoteForLaunch: boolean): string {
  const segs: string[] = [];
  let last = 0;
  let hasValue = false;
  for (const m of tpl.matchAll(PLACEHOLDER)) {
    if (m.index! > last) segs.push(psLiteral(tpl.slice(last, m.index)));
    const name = m[1]!;
    if (!(name in params)) throw new PlanError("INVALID_PARAMS", `${cap.id}: realization needs '${name}' but it was not provided`);
    segs.push(psValue(cap.params.find((x) => x.name === name), mapped(r, name, params[name])));
    hasValue = true;
    last = m.index! + m[0].length;
  }
  if (last < tpl.length) segs.push(psLiteral(tpl.slice(last)));
  if (segs.length === 0) segs.push("''");
  // Start-Process (Windows PowerShell 5.1) joins ArgumentList without quoting: quote
  // any argument that carries a value or whitespace so it stays one argument.
  if (quoteForLaunch && (hasValue || /\s/.test(tpl))) return `('"' + ${segs.join(" + ")} + '"')`;
  return segs.length === 1 ? segs[0]! : `(${segs.join(" + ")})`;
}

function fileExpr(file: string): string {
  // Static data only: allow $env: expansion for well-known install paths.
  return /^\$env:[A-Za-z]+\\/.test(file) ? `"${file.replace(/"/g, "")}"` : psLiteral(file);
}

const VK: Record<string, number> = {
  WIN: 0x5b, CTRL: 0x11, SHIFT: 0x10, ALT: 0x12, LALT: 0xa4, LSHIFT: 0xa0, TAB: 0x09, ENTER: 0x0d, ESC: 0x1b, SPACE: 0x20,
  LEFT: 0x25, UP: 0x26, RIGHT: 0x27, DOWN: 0x28, PRINTSCREEN: 0x2c, DELETE: 0x2e, PERIOD: 0xbe, COMMA: 0xbc, PLUS: 0xbb, MINUS: 0xbd,
  F4: 0x73, VOLUME_MUTE: 0xad, VOLUME_DOWN: 0xae, VOLUME_UP: 0xaf, MEDIA_NEXT: 0xb0, MEDIA_PREV: 0xb1, MEDIA_STOP: 0xb2, MEDIA_PLAY_PAUSE: 0xb3,
};
for (let i = 0; i < 26; i++) VK[String.fromCharCode(65 + i)] = 65 + i;
for (let i = 0; i < 10; i++) VK[String(i)] = 48 + i;

export const KEYS_PRELUDE = [
  "Add-Type -Namespace Vivim -Name Kbd -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte vk, byte scan, uint flags, System.UIntPtr extra);'",
  "function Send-VivimCombo([int[]]$vks) { foreach ($v in $vks) { [Vivim.Kbd]::keybd_event([byte]$v, 0, 0, [System.UIntPtr]::Zero) }; [array]::Reverse($vks); foreach ($v in $vks) { [Vivim.Kbd]::keybd_event([byte]$v, 0, 2, [System.UIntPtr]::Zero) } }",
  "function Send-VivimKey([int]$vk, [int]$count = 1) { for ($i = 0; $i -lt $count; $i++) { Send-VivimCombo @($vk); Start-Sleep -Milliseconds 15 } }",
].join("\n");

function keysBody(cap: Capability, r: RealizationBase, params: Record<string, unknown>): string {
  const combo = (r.spec["combo"] as string[]).map((k) => {
    const name = k.replace(PLACEHOLDER, (_, n: string) => {
      if (!(n in params)) throw new PlanError("INVALID_PARAMS", `${cap.id}: missing '${n}'`);
      return String(mapped(r, n, params[n]));
    });
    const code = VK[name];
    if (code === undefined) throw new PlanError("NO_REALIZATION", `${cap.id}: unknown key ${name}`);
    return `0x${code.toString(16).toUpperCase()}`;
  });
  const rep = r.spec["repeat"];
  if (rep === undefined) return `Send-VivimCombo @(${combo.join(", ")}); 'sent'`;
  const count = typeof rep === "number" ? rep : params[String(rep)];
  if (typeof count !== "number") throw new PlanError("INVALID_PARAMS", `${cap.id}: repeat count missing`);
  if (combo.length !== 1) throw new PlanError("NO_REALIZATION", `${cap.id}: repeat requires a single key`);
  return `Send-VivimKey ${combo[0]} ${count}; 'sent'`;
}

function renderBody(cap: Capability, r: RealizationBase, params: Record<string, unknown>): string {
  const spec = r.spec;
  switch (r.strategy) {
    case "uri": {
      const uri = String(spec["uri"]).replace(PLACEHOLDER, (_, n: string) => {
        if (!(n in params)) throw new PlanError("INVALID_PARAMS", `${cap.id}: missing '${n}'`);
        return encodeURIComponent(String(mapped(r, n, params[n])));
      });
      return `Start-Process ${psLiteral(uri)}; 'opened'`;
    }
    case "launch": {
      const args = ((spec["args"] as string[]) ?? []).map((a) => argExpr(cap, r, a, params, true));
      return `Start-Process -FilePath ${fileExpr(String(spec["file"]))}${args.length ? ` -ArgumentList @(${args.join(", ")})` : ""}; 'launched'`;
    }
    case "run": {
      const args = ((spec["args"] as string[]) ?? []).map((a) => argExpr(cap, r, a, params, false));
      return `$__out = & ${fileExpr(String(spec["file"]))} ${args.join(" ")} 2>&1 | Out-String; $__code = $LASTEXITCODE; if ($__code -ne 0) { throw ('exit ' + $__code + ': ' + $__out.Trim()) }; $__out.Trim()`;
    }
    case "powershell":
      return substituteScript(cap, r, String(spec["script"]), params);
    case "keys":
      return keysBody(cap, r, params);
    case "builtin-map": {
      const v = params[String(spec["param"])];
      const nested = (spec["map"] as Record<string, RealizationBase>)[String(v)];
      if (!nested) throw new PlanError("NO_REALIZATION", `${cap.id}: no built-in mapping for ${String(v)}`);
      return renderBody(cap, nested, params);
    }
  }
}

export function wrapScript(body: string): string {
  const prelude = /Send-Vivim/.test(body) ? KEYS_PRELUDE + "\n" : "";
  return [
    "$ErrorActionPreference = 'Stop'",
    "$ProgressPreference = 'SilentlyContinue'",
    "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8",
    prelude + "try { $__v = & {",
    body,
    "}; $__o = [ordered]@{ ok = $true; value = $__v } } catch { $__o = [ordered]@{ ok = $false; error = $_.Exception.Message } }",
    "$__o | ConvertTo-Json -Compress -Depth 6",
  ].join("\n");
}

export function powershellArgv(script: string): string[] {
  const b64 = Buffer.from(script, "utf16le").toString("base64");
  return ["powershell.exe", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", b64];
}

/** Choose a realization honoring os and elevation constraints. */
export function chooseRealization(cap: Capability, opts: PlanOptions = {}): Realization {
  const platform = opts.platform ?? "windows";
  const all = realizationsFor(cap.id, platform).filter((r) => !opts.osVersion || r.os.includes(opts.osVersion));
  if (all.length === 0) throw new PlanError("NO_REALIZATION", `${cap.id}: no ${platform} realization${opts.osVersion ? ` for version ${opts.osVersion}` : ""}`);
  const usable = all.filter((r) => r.elevation === "none" || opts.allowElevation);
  if (usable.length === 0) throw new PlanError("NEEDS_ELEVATION", `${cap.id}: every ${platform} realization needs administrator rights`, { realizations: all.map((r) => r.id) });
  return usable[0]!;
}

/** Build the full plan. Throws PlanError (fail-closed) on anything invalid. */
export function plan(capabilityId: string, params: unknown, opts: PlanOptions = {}): Plan {
  const cap = byId.get(capabilityId);
  if (!cap) throw new PlanError("UNKNOWN_CAPABILITY", `unknown capability ${capabilityId}`);
  const normalized = normalizeParams(cap, params);
  const r = chooseRealization(cap, opts);
  const body = renderBody(cap, r, normalized);
  const script = wrapScript(body);
  const out: Plan = {
    capability: cap.id, op: cap.op, platform: r.platform, realizationId: r.id, strategy: r.strategy,
    fidelity: r.fidelity, elevation: r.elevation, targetsForeground: r.targetsForeground === true,
    params: normalized, body, script, argv: powershellArgv(script),
  };
  if (r.note) out.note = r.note;
  if (r.verify) out.verifyArgv = powershellArgv(wrapScript(substituteScript(cap, r, r.verify, normalized)));
  return out;
}
