// pack.os-taxonomy — db.ts
// Loads, validates and indexes the taxonomy database. Pure: no clock, no IO
// beyond the static JSON imports. Same data ⇒ same indexes (determinism).
import taxonomyJson from "../data/taxonomy.json" with { type: "json" };
import capabilitiesJson from "../data/capabilities.json" with { type: "json" };
import windowsJson from "../data/realizations/windows.json" with { type: "json" };
import corpusJson from "../data/coverage-corpus.json" with { type: "json" };
import type { Capability, Realization, Taxonomy, ParamType } from "./types.ts";

export const TAXONOMY = taxonomyJson as unknown as Taxonomy;
export const CAPABILITIES = capabilitiesJson as unknown as Capability[];
export const REALIZATIONS: Record<string, Realization[]> = { windows: windowsJson as unknown as Realization[] };
export const COVERAGE = corpusJson as unknown as {
  inventoryVersion: string; description: string;
  tasks: Array<{ task: string; phrasing: string; capability: string; params: Record<string, unknown> }>;
};

const CAP_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*){2,3}$/;
const PARAM_TYPES: ParamType[] = ["string", "text", "integer", "percent", "boolean", "enum", "path", "url"];
const RISK_LETTER = { READ: "r", MUTATION: "m", EXTERNAL_MUTATION: "x" } as const;

export const byId = new Map<string, Capability>(CAPABILITIES.map((c) => [c.id, c]));
export const byOp = new Map<string, Capability>(CAPABILITIES.map((c) => [c.op, c]));

/** Realizations for a capability on a platform, preferred first. */
export function realizationsFor(capability: string, platform: string): Realization[] {
  return (REALIZATIONS[platform] ?? []).filter((r) => r.capability === capability).sort((a, b) => a.preference - b.preference);
}

/** Integrity check over the whole database. Returns problems; empty = valid. */
export function validateDatabase(): string[] {
  const errs: string[] = [];
  const domains = new Set(TAXONOMY.domains.map((d) => d.id));
  const seen = new Set<string>();
  for (const c of CAPABILITIES) {
    const where = `capability ${c.id}`;
    if (!CAP_ID.test(c.id)) errs.push(`${where}: id violates <domain>.<object>.<action> grammar`);
    if (seen.has(c.id)) errs.push(`${where}: duplicate id`);
    seen.add(c.id);
    if (!domains.has(c.domain) || c.id.split(".")[0] !== c.domain) errs.push(`${where}: unknown or mismatched domain ${c.domain}`);
    const eff = TAXONOMY.effects[c.effect];
    if (!eff) errs.push(`${where}: unknown effect ${c.effect}`);
    else {
      if (eff.risk !== c.risk) errs.push(`${where}: risk ${c.risk} ≠ effect-derived ${eff.risk}`);
      if (eff.consent !== c.consent) errs.push(`${where}: consent ${c.consent} ≠ effect-derived ${eff.consent}`);
    }
    if (c.op !== `os.${RISK_LETTER[c.risk]}.${c.id}@1`) errs.push(`${where}: op ${c.op} does not encode risk/id`);
    if (!c.title || !c.summary) errs.push(`${where}: title/summary required`);
    if (c.verbs.length === 0) errs.push(`${where}: at least one verb required`);
    if (c.examples.length === 0) errs.push(`${where}: at least one example required`);
    if (c.inverse && !byId.has(c.inverse)) errs.push(`${where}: inverse ${c.inverse} does not exist`);
    const names = new Set<string>();
    for (const p of c.params) {
      if (names.has(p.name)) errs.push(`${where}: duplicate param ${p.name}`);
      names.add(p.name);
      if (!PARAM_TYPES.includes(p.type)) errs.push(`${where}: param ${p.name} unknown type ${p.type}`);
      if (p.type === "enum" && (!p.enum || p.enum.length === 0)) errs.push(`${where}: enum param ${p.name} has no values`);
      if (p.pattern) { try { new RegExp(p.pattern); } catch { errs.push(`${where}: param ${p.name} bad pattern`); } }
    }
  }
  for (const [platform, list] of Object.entries(REALIZATIONS)) {
    const rids = new Set<string>();
    for (const r of list) {
      const where = `realization ${r.id}`;
      if (rids.has(r.id)) errs.push(`${where}: duplicate id`);
      rids.add(r.id);
      const cap = byId.get(r.capability);
      if (!cap) { errs.push(`${where}: unknown capability`); continue; }
      if (r.platform !== platform) errs.push(`${where}: platform mismatch`);
      const pnames = new Set(cap.params.map((p) => p.name));
      const text = JSON.stringify(r.spec);
      for (const m of text.matchAll(/\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g)) {
        if (!pnames.has(m[1]!)) errs.push(`${where}: placeholder {{${m[1]}}} is not a parameter of ${cap.id}`);
      }
      for (const [pn, map] of Object.entries(r.paramMap ?? {})) {
        const p = cap.params.find((x) => x.name === pn);
        if (!p) { errs.push(`${where}: paramMap for unknown param ${pn}`); continue; }
        for (const v of p.enum ?? []) if (!(v in map)) errs.push(`${where}: paramMap ${pn} lacks value ${v}`);
      }
      if (r.strategy === "builtin-map") {
        const p = cap.params.find((x) => x.name === r.spec["param"]);
        const map = r.spec["map"] as Record<string, unknown> | undefined;
        for (const v of p?.enum ?? []) if (!map || !(v in map)) errs.push(`${where}: builtin-map lacks ${v}`);
      }
    }
  }
  for (const t of COVERAGE.tasks) if (!byId.has(t.capability)) errs.push(`coverage task '${t.task}': unknown capability ${t.capability}`);
  return errs;
}

/** Coverage statistics for a platform (uses only data — no execution claims). */
export function coverage(platform: string) {
  const preferred = new Map<string, Realization>();
  for (const r of REALIZATIONS[platform] ?? []) if (r.preference === 1) preferred.set(r.capability, r);
  const fid = { exact: 0, approximate: 0, handoff: 0 } as Record<string, number>;
  for (const r of preferred.values()) fid[r.fidelity] = (fid[r.fidelity] ?? 0) + 1;
  const tasks = COVERAGE.tasks.map((t) => ({ ...t, fidelity: preferred.get(t.capability)?.fidelity ?? "none" }));
  const tf = { exact: 0, approximate: 0, handoff: 0, none: 0 } as Record<string, number>;
  for (const t of tasks) tf[t.fidelity] = (tf[t.fidelity] ?? 0) + 1;
  const evidence = { authored: 0, "verified-local": 0, regressed: 0 } as Record<string, number>;
  for (const r of REALIZATIONS[platform] ?? []) evidence[r.evidence] = (evidence[r.evidence] ?? 0) + 1;
  return {
    platform,
    capabilities: CAPABILITIES.length,
    realized: preferred.size,
    realizationFidelity: fid,
    inventory: { tasks: tasks.length, byFidelity: tf, actionableShare: tasks.length ? (tasks.length - tf["none"]!) / tasks.length : 0, exactShare: tasks.length ? tf["exact"]! / tasks.length : 0 },
    evidence,
  };
}
