// Structural extraction (MP21-P2): joins the P1 inventory, the product manifests and the
// per-file source extraction into one claim-classed fact set plus manifest↔runtime parity.
// Deterministic by construction: no clock, no environment, sorted output, and every fact
// carries the anchors it was read from. What is not extracted is listed, not implied.
import { posix } from "node:path";
import type ts from "typescript";
import { digest, type Json } from "../../ratchet/src/canonical.ts";
import { anchorId, byString, hashText, type AnchorKind, type SourceAnchor } from "./anchor.ts";
import { extractSource, type SourceFacts, type Span } from "./extract-source.ts";
import { FactSet, ref, type Fact } from "./facts.ts";
import type { FileRecord, Inventory, TreeEntry, Unknown } from "./inventory.ts";
import { scriptKindOf } from "./symbols.ts";

export const EXTRACTION_SCHEMA = "vomega-reflection-extraction/1";

/** Kinds that make an op routable. Mirrors routableOps(); a test pins it to that source. */
export const ROUTABLE_KINDS = ["contract", "engine", "provider"] as const;

export const OP_STATUS = {
  both: "DECLARED+IMPLEMENTED",
  declaredOnly: "DECLARED, IMPLEMENTATION NOT FOUND",
  implementedOnly: "IMPLEMENTED, NOT DECLARED",
} as const;
export const REGISTRATION = {
  static: "STATIC",
  dynamic: "DYNAMIC — NEEDS EXPLICIT REFLECTION PROVIDER",
  none: "NO definePlugin CALL IN ENTRY",
  missing: "ENTRY FILE NOT IN TREE",
} as const;
export const PORT_STATUS = {
  both: "REQUESTED+CALLED",
  requestedOnly: "REQUESTED, CALL NOT FOUND",
  calledOnly: "CALLED, NOT REQUESTED",
} as const;

export interface PluginParity {
  plugin: string;
  manifest: string;
  registration: (typeof REGISTRATION)[keyof typeof REGISTRATION];
  ops: Array<{ op: string; status: string; registeredElsewhereBy: string[] }>;
  ports: Array<{ op: string; status: string }>;
  /** Port calls in this plugin's source whose op could not be reduced to a literal. */
  dynamicPortCalls: number;
}

export interface Extraction {
  schema: typeof EXTRACTION_SCHEMA;
  repository: string;
  commit: string;
  scope: string;
  inventoryDigest: string;
  facts: Fact[];
  /** Anchors minted by P2 (op registrations, port calls, language frames). P1 anchors stay in the inventory. */
  anchors: SourceAnchor[];
  parity: PluginParity[];
  unknowns: Unknown[];
  /** Surfaces this version deliberately does not extract. Absence of a fact here proves nothing. */
  notExtracted: Array<{ surface: string; reason: string }>;
  counts: Record<string, number>;
  digest: string;
}

const NOT_EXTRACTED: Extraction["notExtracted"] = [
  { surface: "config parsing", reason: "config readers are imperative code; no mechanical rule yet separates a config key from any other property read" },
  { surface: "code-level schemas", reason: "only manifest `schema` contributions are read; schemas built in TypeScript or Zod are not" },
  { surface: "visual contracts", reason: "VisualSpec types are covered only as contract shapes; no projection or role map is extracted" },
  { surface: "semantic registries", reason: "provider, command and capability registries are runtime data, not source declarations" },
  { surface: "source comments", reason: "no structured-comment convention exists in the tree to harvest as COMMENTARY" },
  { surface: "fixture manifests", reason: "plugin.json files under test fixtures are inventoried but yield no plugin, op or contribution facts" },
  { surface: "non-contract type shapes", reason: "interface fields and string vocabularies are extracted for contracts/ only" },
  { surface: "dynamic imports", reason: "only static import/export-from statements produce import facts" },
];

const decoder = new TextDecoder("utf-8", { fatal: true });
const isObject = (v: unknown): v is Record<string, Json> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

interface Plugin { id: string; manifestPath: string; dir: string; entry?: string; anchor: string }

export function buildExtraction(entries: TreeEntry[], inventory: Inventory): Extraction {
  const facts = new FactSet();
  const unknowns: Unknown[] = [];
  const files = new Map(inventory.files.map((f) => [f.path, f]));
  const p1 = new Set(inventory.anchors.map((a) => a.id));
  const texts = new Map<string, string>();
  for (const e of entries) {
    const file = files.get(e.path);
    if (!file || (file.surface !== "manifest" && file.surface !== "package" && scriptKindOf(e.path) === undefined)) continue;
    try { texts.set(e.path, decoder.decode(e.bytes)); } catch { /* reported by the inventory */ }
  }
  const json = (path: string): Record<string, Json> | undefined => {
    const text = texts.get(path);
    if (text === undefined) return undefined;
    try {
      const v = JSON.parse(text) as Json;
      if (isObject(v)) return v;
    } catch { /* fall through */ }
    unknowns.push({ path, reason: "not a JSON object; no facts extracted" });
    return undefined;
  };

  // P2 anchors: several spans of one (kind, path, symbol) are one anchor.
  const spans = new Map<string, { kind: AnchorKind; file: FileRecord; symbol: string; sf: ts.SourceFile; spans: Span[] }>();
  const mint = (kind: AnchorKind, file: FileRecord, symbol: string, sf: ts.SourceFile, span: Span): string => {
    const id = anchorId(kind, file.path, symbol);
    const entry = spans.get(id) ?? { kind, file, symbol, sf, spans: [] };
    entry.spans.push(span);
    spans.set(id, entry);
    return id;
  };
  const lineOf = (sf: ts.SourceFile, pos: number) => sf.getLineAndCharacterOfPosition(pos).line + 1;

  // ---------------------------------------------------------------- manifests
  const plugins: Plugin[] = [];
  const declaredOps = new Map<string, Map<string, string[]>>(); // manifest path → op → anchors (two manifests may claim one id)
  const requestedPorts = new Map<string, Set<string>>();

  for (const file of inventory.files) {
    if (file.surface !== "manifest" || file.role !== "source") continue;
    const m = json(file.path);
    const id = m && str(m["id"]);
    const anchor = id === undefined ? undefined : anchorId("manifest", file.path, `plugin:${id}`);
    if (!m || id === undefined || !anchor || !p1.has(anchor)) continue; // the inventory already reported why
    const dir = posix.dirname(file.path);
    const entry = str(m["entry"]) === undefined ? undefined : posix.join(dir, str(m["entry"])!);
    const plugin: Plugin = { id, manifestPath: file.path, dir, entry, anchor };
    plugins.push(plugin);
    const self = ref.plugin(id);
    declaredOps.set(file.path, new Map());
    requestedPorts.set(file.path, new Set());

    const runtime = isObject(m["runtime"]) ? m["runtime"] : {};
    const publisher = isObject(m["publisher"]) ? m["publisher"] : {};
    const declared: Record<string, Json> = {
      contentHashPresent: str(m["contentHash"]) !== undefined && m["contentHash"] !== "",
      publisherSigned: str(publisher["signature"]) !== undefined && publisher["signature"] !== "",
    };
    for (const key of ["version", "manifestVersion", "entry", "granularity", "internalSeams", "extractionCandidate", "generality"]) {
      if (m[key] !== undefined) declared[key] = m[key]!;
    }
    if (runtime["tier"] !== undefined) declared["runtimeTier"] = runtime["tier"]!;
    if (runtime["budget"] !== undefined) declared["runtimeBudget"] = runtime["budget"]!;
    facts.add({ claimClass: "DECLARED", subject: self, predicate: "declared-as", value: declared, anchors: [anchor] });
    facts.add({ claimClass: "PROVEN_STRUCTURAL", subject: self, predicate: "declared-in", object: ref.file(file.path), anchors: [anchor] });
    if (str(m["description"])) facts.add({ claimClass: "COMMENTARY", subject: self, predicate: "described-as", value: m["description"]!, anchors: [anchor] });
    if (entry !== undefined && files.has(entry)) facts.add({ claimClass: "DECLARED", subject: self, predicate: "entry-module", object: ref.file(entry), anchors: [anchor] });

    const contributions = isObject(m["contributions"]) ? m["contributions"] : {};
    for (const kind of Object.keys(contributions)) {
      const list = contributions[kind];
      if (!Array.isArray(list)) continue;
      for (const c of list) {
        if (!isObject(c)) continue;
        const cid = str(c["id"]);
        const version = str(c["version"]);
        const cAnchor = cid !== undefined && version !== undefined ? anchorId("manifest", file.path, `${kind}:${cid}@${version}`) : undefined;
        if (cid === undefined || version === undefined || !cAnchor || !p1.has(cAnchor)) continue;
        const contribution = ref.contribution(id, kind, cid, version);
        const value: Record<string, Json> = {};
        for (const key of Object.keys(c)) if (key !== "doc" && key !== "fields") value[key] = c[key]!;
        facts.add({ claimClass: "DECLARED", subject: self, predicate: "contributes", object: contribution, value, anchors: [cAnchor] });
        if (str(c["doc"])) facts.add({ claimClass: "COMMENTARY", subject: contribution, predicate: "documented-as", value: c["doc"]!, anchors: [cAnchor] });
        if (Array.isArray(c["fields"])) {
          for (const f of c["fields"]) {
            if (!isObject(f) || str(f["name"]) === undefined) continue;
            const { name, ...rest } = f;
            facts.add({ claimClass: "DECLARED", subject: contribution, predicate: "has-field", object: ref.field(contribution, name as string), value: rest, anchors: [cAnchor] });
          }
        }
        if ((ROUTABLE_KINDS as readonly string[]).includes(kind)) {
          const op = `${cid}@${version}`;
          const ops = declaredOps.get(file.path)!;
          ops.set(op, [...(ops.get(op) ?? []), cAnchor]);
          const opValue: Record<string, Json> = { kind };
          if (c["risk"] !== undefined) opValue["risk"] = c["risk"]!;
          facts.add({ claimClass: "INFERRED_SAFE", rule: "routable-kind", subject: self, predicate: "declares-op", object: ref.op(op), value: opValue, anchors: [cAnchor] });
        }
      }
    }

    for (const d of Array.isArray(m["dependencies"]) ? m["dependencies"] : []) {
      const target = isObject(d) ? str(d["ref"]) : undefined;
      if (target === undefined) continue;
      const object = target.startsWith("contract:") ? ref.op(target.slice("contract:".length)) : ref.capability(target);
      facts.add({ claimClass: "DECLARED", subject: self, predicate: "depends-on", object, value: { range: (d as Record<string, Json>)["range"] ?? null }, anchors: [anchor] });
    }
    const capabilities = isObject(m["capabilities"]) ? m["capabilities"] : {};
    for (const requested of Array.isArray(capabilities["requested"]) ? capabilities["requested"] : []) {
      if (typeof requested !== "string") continue;
      if (requested.startsWith("port:")) {
        requestedPorts.get(file.path)!.add(requested.slice("port:".length));
        facts.add({ claimClass: "DECLARED", subject: self, predicate: "requests-port", object: ref.op(requested.slice("port:".length)), anchors: [anchor] });
      } else {
        facts.add({ claimClass: "DECLARED", subject: self, predicate: "requests-capability", object: ref.capability(requested), anchors: [anchor] });
      }
    }
    if (str(capabilities["justification"])) {
      facts.add({ claimClass: "COMMENTARY", subject: self, predicate: "justifies-capabilities-as", value: capabilities["justification"]!, anchors: [anchor] });
    }
  }

  // Nearest product-manifest directory owns a file.
  const byDepth = [...plugins].sort((a, b) => b.dir.length - a.dir.length || byString(a.dir, b.dir));
  const pluginOf = (path: string) => byDepth.find((p) => path.startsWith(`${p.dir}/`));

  // ---------------------------------------------------------------- workspace packages
  const packages: Array<{ name: string; path: string }> = [];
  for (const file of inventory.files) {
    if (file.surface !== "package" || file.role !== "source") continue;
    const name = str(json(file.path)?.["name"]);
    if (name === undefined) continue;
    packages.push({ name, path: file.path });
    facts.add({ claimClass: "DECLARED", subject: ref.pkg(name), predicate: "declared-in", object: ref.file(file.path), anchors: [anchorId("file", file.path)] });
  }
  packages.sort((a, b) => b.name.length - a.name.length || byString(a.name, b.name));
  const byPackageDepth = [...packages].sort((a, b) => b.path.length - a.path.length || byString(a.path, b.path));
  const packageOf = (path: string) => byPackageDepth.find((p) => path !== p.path && path.startsWith(`${posix.dirname(p.path)}/`));

  // ---------------------------------------------------------------- source files
  const registered = new Map<string, Map<string, string[]>>(); // manifest path → op → anchors
  const called = new Map<string, Set<string>>();
  const dynamicCalls = new Map<string, number>();
  const registration = new Map<string, PluginParity["registration"]>();
  const testLiterals: Array<{ file: FileRecord; texts: Set<string> }> = [];

  const sources = new Map<string, SourceFacts>();
  for (const file of inventory.files) {
    const text = texts.get(file.path);
    if (text !== undefined && scriptKindOf(file.path) !== undefined) sources.set(file.path, extractSource(file.path, text));
  }
  const resolveRelative = (from: string, specifier: string): string | undefined => {
    const base = posix.join(posix.dirname(from), specifier);
    return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, base.replace(/\.js$/, ".ts")].find((c) => files.has(c));
  };
  const workspacePackage = (specifier: string) => packages.find((p) => specifier === p.name || specifier.startsWith(`${p.name}/`));
  /** The string an imported const (or one member of it) is bound to, if exactly one declaration provides it. */
  const importedConst = (from: string, specifier: string, name: string, member: string | undefined): string | undefined => {
    const pkg = specifier.startsWith(".") ? undefined : workspacePackage(specifier);
    const target = specifier.startsWith(".") ? resolveRelative(from, specifier) : undefined;
    const candidates = target !== undefined ? [target]
      : pkg ? inventory.files.filter((f) => f.role === "source" && f.path.startsWith(`${posix.dirname(pkg.path)}/`)).map((f) => f.path) : [];
    const found = candidates.flatMap((path) => {
      const bound = sources.get(path)?.consts.get(name);
      const value = member === undefined ? bound : isObject(bound) ? bound[member] : undefined;
      return typeof value === "string" ? [value] : [];
    });
    return found.length === 1 ? found[0] : undefined;
  };

  for (const file of inventory.files) {
    const src = sources.get(file.path);
    if (!src) continue;
    const fileAnchor = anchorId("file", file.path);
    const owner = pluginOf(file.path);
    if (owner) {
      // A plugin is made of its source files; its tests and fixtures sit beside it without being part of it.
      facts.add({ claimClass: "INFERRED_SAFE", rule: "file-under-manifest-directory", subject: ref.file(file.path), predicate: file.role === "source" ? "part-of" : "located-in", object: ref.plugin(owner.id), anchors: [fileAnchor, owner.anchor] });
    }

    const pkgOwner = packageOf(file.path);
    if (pkgOwner) {
      facts.add({ claimClass: "INFERRED_SAFE", rule: "file-under-package-directory", subject: ref.file(file.path), predicate: file.role === "source" ? "part-of" : "located-in", object: ref.pkg(pkgOwner.name), anchors: [fileAnchor, anchorId("file", pkgOwner.path)] });
    }

    // imports — one fact per (file, target); type-only only if every statement is.
    const targets = new Map<string, { typeOnly: boolean; rule?: "workspace-package-name" }>();
    for (const imp of src.imports) {
      let target: string | undefined;
      let rule: "workspace-package-name" | undefined;
      if (imp.specifier.startsWith(".")) {
        const hit = resolveRelative(file.path, imp.specifier);
        if (hit) target = ref.file(hit);
        else unknowns.push({ path: file.path, reason: `relative import "${imp.specifier}" resolves to no file in the tree` });
      } else {
        const pkg = workspacePackage(imp.specifier);
        target = pkg ? ref.pkg(pkg.name) : ref.module(imp.specifier);
        rule = pkg ? "workspace-package-name" : undefined;
      }
      if (target === undefined) continue;
      const seen = targets.get(target);
      targets.set(target, { typeOnly: (seen?.typeOnly ?? true) && imp.typeOnly, rule });
    }
    for (const [target, t] of targets) {
      facts.add({ claimClass: t.rule ? "INFERRED_SAFE" : "PROVEN_STRUCTURAL", rule: t.rule, subject: ref.file(file.path), predicate: "imports", object: target, value: { typeOnly: t.typeOnly }, anchors: [fileAnchor] });
    }

    if (file.role === "test") testLiterals.push({ file, texts: new Set(src.stringLiterals.map((s) => s.text)) });
    if (file.role !== "source") continue;

    // An op named by an imported const is looked up where the import points; the rest stay dynamic.
    const portCalls = [...src.portCalls];
    const dynamic = [...src.dynamic];
    for (const site of src.pending) {
      const op = importedConst(file.path, site.specifier, site.imported, site.member);
      if (op === undefined) dynamic.push(site);
      else portCalls.push({ start: site.start, end: site.end, op, rule: "imported-const" });
    }
    for (const d of dynamic) unknowns.push({ path: file.path, reason: `line ${lineOf(src.sf, d.start)}: ${d.what}` });

    if (owner) {
      for (const call of portCalls) {
        const a = mint("port-call", file, call.op, src.sf, call);
        (called.get(owner.manifestPath) ?? called.set(owner.manifestPath, new Set()).get(owner.manifestPath)!).add(call.op);
        facts.add({ claimClass: call.rule ? "INFERRED_SAFE" : "PROVEN_STRUCTURAL", rule: call.rule, subject: ref.plugin(owner.id), predicate: "calls-port", object: ref.op(call.op), anchors: [a] });
      }
      dynamicCalls.set(owner.manifestPath, (dynamicCalls.get(owner.manifestPath) ?? 0) + dynamic.filter((d) => d.what.includes("port")).length);
      if (file.path === owner.entry) {
        const dynamicRegistration = dynamic.some((d) => !d.what.includes("port") && !d.what.includes("language frame"));
        registration.set(owner.manifestPath, !src.hasDefinePlugin ? REGISTRATION.none : dynamicRegistration ? REGISTRATION.dynamic : REGISTRATION.static);
        const ops = registered.get(owner.manifestPath) ?? new Map<string, string[]>();
        registered.set(owner.manifestPath, ops);
        for (const site of src.registeredOps) {
          const a = mint("op-registration", file, site.op, src.sf, site);
          if (!ops.get(site.op)?.includes(a)) ops.set(site.op, [...(ops.get(site.op) ?? []), a]);
          facts.add({ claimClass: site.rule ? "INFERRED_SAFE" : "PROVEN_STRUCTURAL", rule: site.rule, subject: ref.plugin(owner.id), predicate: "registers-op", object: ref.op(site.op), anchors: [a] });
        }
      }
    }

    for (const frame of src.frames) {
      const a = mint("language", file, frame.op, src.sf, frame);
      facts.add({ claimClass: "PROVEN_STRUCTURAL", subject: ref.frame(file.path, frame.op), predicate: "frames-op", object: ref.op(frame.op), value: frame.value, anchors: [a] });
    }

    if (file.surface === "contract") {
      const declaration = (symbol: string) => anchorId("declaration", file.path, symbol);
      for (const v of src.vocabularies) {
        if (p1.has(declaration(v.symbol))) facts.add({ claimClass: "PROVEN_STRUCTURAL", subject: ref.symbol(file.path, v.symbol), predicate: "has-members", value: v.members, anchors: [declaration(v.symbol)] });
      }
      for (const s of src.shapes) {
        if (p1.has(declaration(s.symbol))) facts.add({ claimClass: "PROVEN_STRUCTURAL", subject: ref.symbol(file.path, s.symbol), predicate: "has-shape", value: s.fields, anchors: [declaration(s.symbol)] });
      }
    }
  }

  // ---------------------------------------------------------------- tests ↔ ops
  const knownOps = new Set<string>();
  for (const ops of [...declaredOps.values(), ...registered.values()]) for (const op of ops.keys()) knownOps.add(op);
  for (const { file, texts: literals } of testLiterals) {
    for (const op of [...literals].filter((t) => knownOps.has(t)).sort(byString)) {
      facts.add({ claimClass: "INFERRED_SAFE", rule: "string-literal-equals-known-op", subject: ref.file(file.path), predicate: "mentions-op", object: ref.op(op), anchors: [anchorId("file", file.path)] });
    }
  }

  // ---------------------------------------------------------------- parity
  const registrars = new Map<string, string[]>();
  const idOf = new Map(plugins.map((p) => [p.manifestPath, p.id]));
  for (const [manifest, ops] of registered) for (const op of ops.keys()) registrars.set(op, [...(registrars.get(op) ?? []), manifest]);
  const parity: PluginParity[] = plugins.map((p) => {
    const declared = declaredOps.get(p.manifestPath)!;
    const mine = registered.get(p.manifestPath) ?? new Map<string, string[]>();
    const requested = requestedPorts.get(p.manifestPath)!;
    const calls = called.get(p.manifestPath) ?? new Set<string>();
    return {
      plugin: p.id,
      manifest: p.manifestPath,
      registration: p.entry === undefined || !files.has(p.entry) ? REGISTRATION.missing : registration.get(p.manifestPath) ?? REGISTRATION.none,
      ops: [...new Set([...declared.keys(), ...mine.keys()])].sort(byString).map((op) => ({
        op,
        status: declared.has(op) && mine.has(op) ? OP_STATUS.both : declared.has(op) ? OP_STATUS.declaredOnly : OP_STATUS.implementedOnly,
        registeredElsewhereBy: [...new Set((registrars.get(op) ?? []).filter((x) => x !== p.manifestPath).map((x) => idOf.get(x)!))].sort(byString),
      })),
      ports: [...new Set([...requested, ...calls])].sort(byString).map((op) => ({
        op,
        status: requested.has(op) && calls.has(op) ? PORT_STATUS.both : requested.has(op) ? PORT_STATUS.requestedOnly : PORT_STATUS.calledOnly,
      })),
      dynamicPortCalls: dynamicCalls.get(p.manifestPath) ?? 0,
    };
  }).sort((a, b) => byString(a.plugin, b.plugin) || byString(a.manifest, b.manifest));

  // ---------------------------------------------------------------- assemble
  const anchors: SourceAnchor[] = [...spans.entries()].map(([id, e]) => {
    const ordered = [...e.spans].sort((a, b) => a.start - b.start);
    return {
      id, extractionKind: e.kind, repository: inventory.repository, commit: inventory.commit, path: e.file.path,
      contentHash: e.file.contentHash, symbol: e.symbol,
      spanHash: hashText(ordered.map((s) => e.sf.text.slice(s.start, s.end)).join("\n")),
      range: { startLine: lineOf(e.sf, ordered[0]!.start), endLine: lineOf(e.sf, ordered[ordered.length - 1]!.end) },
    };
  }).sort((a, b) => byString(a.id, b.id));

  const list = facts.list();
  unknowns.sort((a, b) => byString(a.path, b.path) || byString(a.reason, b.reason));
  const counts: Record<string, number> = { facts: list.length, anchors: anchors.length, unknowns: unknowns.length, plugins: plugins.length };
  const bump = (key: string) => (counts[key] = (counts[key] ?? 0) + 1);
  for (const f of list) {
    bump(`class:${f.claimClass}`);
    bump(`predicate:${f.predicate}`);
  }
  for (const p of parity) {
    bump(`registration:${p.registration}`);
    for (const o of p.ops) bump(`op:${o.status}`);
    for (const o of p.ports) bump(`port:${o.status}`);
  }

  const body = {
    schema: EXTRACTION_SCHEMA as typeof EXTRACTION_SCHEMA,
    repository: inventory.repository, commit: inventory.commit, scope: inventory.scope, inventoryDigest: inventory.digest,
    facts: list, anchors, parity, unknowns, notExtracted: NOT_EXTRACTED, counts,
  };
  return { ...body, digest: digest(body) };
}
