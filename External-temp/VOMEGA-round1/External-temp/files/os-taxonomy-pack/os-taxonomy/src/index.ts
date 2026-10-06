// pack.os-taxonomy — index.ts (plugin wiring)
// The VIVIM OS capability taxonomy as an installable Ω plugin.
//
//   os.catalog.list@1      {domain?, tier?, query?}    → capability summaries        READ
//   os.catalog.describe@1  {capability}                → capability + realizations   READ
//   os.catalog.plan@1      {capability, params?}       → exact plan, never executes  READ
//   os.catalog.frames@1    {}                          → language frames (nlcl)      READ
//   os.catalog.coverage@1  {}                          → coverage statistics         READ
//   os.<r|m|x>.<capability>@1  {params?, dryRun?}      → plan (+ execution)          risk per capability
//
// One routed op per capability means the LAW gates each capability on its own
// risk and consent is granted per capability (consent ids hash principal+op).
// Execution happens only when the signed composition config says execute:true
// AND the payload is not a dry run; otherwise the op returns the plan. Non-READ
// attempts are ledgered in vault ns "os" BEFORE the effect (attempt → outcome),
// carrying digests rather than raw parameters.
import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext, OpHandler } from "@vivim/omega-shim";
import { createHash, randomUUID } from "node:crypto";
import { CAPABILITIES, TAXONOMY, byId, coverage, realizationsFor } from "./db.ts";
import { plan, PlanError, type PlanOptions } from "./plan.ts";
import { framesFor } from "./frames.ts";
import { runArgv } from "./execute.ts";
import type { Capability } from "./types.ts";

export const OS_NS = "os";

interface OsConfig { platform: string; osVersion?: string; execute: boolean; allowElevation: boolean; timeoutMs: number; verify: boolean }

export function parseConfig(raw: Record<string, unknown> | undefined): OsConfig {
  const c = raw ?? {};
  const platform = typeof c["platform"] === "string" ? c["platform"] : "windows";
  if (platform !== "windows") throw new Error(`pack.os-taxonomy: no realization set for platform '${platform}' (available: windows)`);
  const osVersion = c["osVersion"] === undefined ? undefined : String(c["osVersion"]);
  if (osVersion !== undefined && !["10", "11"].includes(osVersion)) throw new Error("pack.os-taxonomy: osVersion must be '10' or '11'");
  const timeoutMs = c["timeoutMs"] === undefined ? 60_000 : Number(c["timeoutMs"]);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 3_600_000) throw new Error("pack.os-taxonomy: timeoutMs out of range");
  return { platform, osVersion, execute: c["execute"] === true, allowElevation: c["allowElevation"] === true, timeoutMs, verify: c["verify"] !== false };
}

function obj(payload: unknown, op: string): Record<string, unknown> {
  if (payload === undefined || payload === null) return {};
  if (typeof payload !== "object" || Array.isArray(payload)) throw new Error(`${op}: payload must be an object`);
  return payload as Record<string, unknown>;
}

const digest = (v: unknown) => "sha256:" + createHash("sha256").update(JSON.stringify(v ?? null)).digest("hex");

function planOpts(cfg: OsConfig): PlanOptions {
  return { platform: cfg.platform, osVersion: cfg.osVersion, allowElevation: cfg.allowElevation };
}

function summary(c: Capability) {
  return { id: c.id, op: c.op, domain: c.domain, title: c.title, tier: c.tier, effect: c.effect, risk: c.risk, params: c.params.map((p) => p.name) };
}

function refusal(e: unknown) {
  if (e instanceof PlanError) return { outcome: "refused", code: e.code, reason: e.message, ...(e.detail ? { detail: e.detail } : {}) };
  throw e;
}

async function ledger(ctx: PluginContext, id: string, data: Record<string, unknown>): Promise<number> {
  const r = await ctx.port.call("vault.append@1", { ns: OS_NS, id, data, meta: { type: "os-attempt" } });
  if (!r.ok) throw new Error(`pack.os-taxonomy: attempt ledger write failed (${r.error}: ${r.detail ?? ""}) — refusing to act unrecorded`);
  return (r.value as { rev: number }).rev;
}

function capabilityHandler(cap: Capability): OpHandler {
  return async (payload: unknown, ctx: PluginContext) => {
    const cfg = parseConfig(ctx.config);
    const p = obj(payload, cap.op);
    const params = "params" in p ? p["params"] : Object.fromEntries(Object.entries(p).filter(([k]) => k !== "dryRun"));
    let pl;
    try { pl = plan(cap.id, params, planOpts(cfg)); } catch (e) { return { capability: cap.id, executed: false, ...refusal(e) }; }
    const view = { capability: cap.id, op: cap.op, title: cap.title, risk: cap.risk, realization: pl.realizationId, strategy: pl.strategy, fidelity: pl.fidelity, elevation: pl.elevation, targetsForeground: pl.targetsForeground, note: pl.note, params: pl.params, body: pl.body };
    if (p["dryRun"] === true || !cfg.execute) {
      return { ...view, executed: false, outcome: "dry-run", reason: p["dryRun"] === true ? "dry run requested" : "execution disabled in composition config (execute:false)" };
    }
    const attemptId = `attempt:${randomUUID()}`;
    const consequential = cap.risk !== "READ";
    if (consequential) {
      await ledger(ctx, attemptId, { state: "executing", capability: cap.id, op: cap.op, realization: pl.realizationId, paramNames: Object.keys(pl.params), paramsDigest: digest(pl.params), startedAt: Date.now() });
    }
    const res = await runArgv(pl.argv, cfg.timeoutMs);
    let verified: unknown = undefined;
    if (res.outcome === "completed" && cfg.verify && pl.verifyArgv) {
      const v = await runArgv(pl.verifyArgv, Math.min(cfg.timeoutMs, 30_000));
      verified = v.outcome === "completed" ? v.value : { unknown: v.error };
    }
    if (consequential) {
      await ledger(ctx, attemptId, { state: res.outcome, capability: cap.id, op: cap.op, realization: pl.realizationId, finishedAt: Date.now(), ms: res.ms, exitCode: res.exitCode, valueDigest: digest(res.value), ...(res.error ? { error: res.error.slice(0, 500) } : {}) });
    }
    return {
      ...view, executed: true, outcome: res.outcome,
      ...(res.value !== undefined ? { value: res.value } : {}), ...(res.error ? { error: res.error } : {}),
      ...(verified !== undefined ? { verified } : {}), ...(consequential ? { attemptRef: { ns: OS_NS, id: attemptId } } : {}),
      handoff: pl.fidelity === "handoff" ? "opened for the user; the change itself is not claimed" : undefined,
    };
  };
}

const ops: Record<string, OpHandler> = {
  "os.catalog.list@1": (payload: unknown) => {
    const p = obj(payload, "os.catalog.list@1");
    const q = typeof p["query"] === "string" ? p["query"].toLowerCase() : null;
    const rows = CAPABILITIES.filter((c) =>
      (p["domain"] === undefined || c.domain === p["domain"]) && (p["tier"] === undefined || c.tier === p["tier"]) &&
      (!q || c.id.includes(q) || c.title.toLowerCase().includes(q) || c.verbs.some((v) => v.includes(q))));
    return { taxonomyVersion: TAXONOMY.taxonomyVersion, count: rows.length, domains: TAXONOMY.domains, capabilities: rows.map(summary) };
  },
  "os.catalog.describe@1": (payload: unknown, ctx: PluginContext) => {
    const p = obj(payload, "os.catalog.describe@1");
    const cap = byId.get(String(p["capability"]));
    if (!cap) return { outcome: "unknown", reason: `unknown capability ${String(p["capability"])}` };
    const cfg = parseConfig(ctx.config);
    return { capability: cap, realizations: realizationsFor(cap.id, cfg.platform) };
  },
  "os.catalog.plan@1": (payload: unknown, ctx: PluginContext) => {
    const p = obj(payload, "os.catalog.plan@1");
    try { return { outcome: "planned", plan: plan(String(p["capability"]), p["params"], planOpts(parseConfig(ctx.config))) }; }
    catch (e) { return refusal(e); }
  },
  "os.catalog.frames@1": () => ({ taxonomyVersion: TAXONOMY.taxonomyVersion, frames: framesFor(CAPABILITIES) }),
  "os.catalog.coverage@1": (_p: unknown, ctx: PluginContext) => coverage(parseConfig(ctx.config).platform),
};
for (const cap of CAPABILITIES) ops[cap.op] = capabilityHandler(cap);

export const def = definePlugin({
  onInit: (ctx: PluginContext) => {
    const cfg = parseConfig(ctx.config); // fail-closed on bad config at boot
    ctx.log(`pack.os-taxonomy up — taxonomy ${TAXONOMY.taxonomyVersion}, ${CAPABILITIES.length} capabilities, platform ${cfg.platform}, execute=${cfg.execute}, allowElevation=${cfg.allowElevation}`);
  },
  ops,
});

startPlugin(def);
