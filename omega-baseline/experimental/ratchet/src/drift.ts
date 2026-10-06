// Drift: claims that project documents make about the repository, written as
// executable probes. When code changes a fact, the probe fails and names the
// document that is now wrong — instead of a later meta-review finding it.
// A failing fact is information, not a verdict: either the document or the
// fact file is updated, with a reason, in the same change.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readJsonPath } from "./spec.ts";

export type Expect = number | { min?: number; max?: number };

export type FactProbe =
  | { kind: "count-files"; glob: string }
  | { kind: "count-files-matching"; glob: string; pattern: string; flags?: string }
  | { kind: "json-count"; file: string; path: string; where?: Record<string, unknown> }
  | { kind: "mutex"; a: { file: string; pattern: string }; b: { file: string; pattern: string } };

export interface Fact {
  id: string;
  claim: string;
  /** Documents that assert this claim and must change if it stops being true. */
  assertedBy: string[];
  probe: FactProbe;
  expect?: Expect;      // not used by mutex
}

export interface FactsFile { schema: "ratchet.facts/0"; facts: Fact[] }

export interface FactResult { id: string; claim: string; ok: boolean; observed: number | string; expected: string; assertedBy: string[] }

function matches(e: Expect, n: number): boolean {
  if (typeof e === "number") return n === e;
  return (e.min === undefined || n >= e.min) && (e.max === undefined || n <= e.max);
}

function show(e: Expect | undefined): string {
  if (e === undefined) return "n/a";
  if (typeof e === "number") return `= ${e}`;
  return [e.min !== undefined ? `≥ ${e.min}` : "", e.max !== undefined ? `≤ ${e.max}` : ""].filter(Boolean).join(" and ");
}

function scan(root: string, glob: string): string[] {
  return [...new Bun.Glob(glob).scanSync({ cwd: root, dot: false })]
    .map((f) => f.replaceAll("\\", "/"))
    .filter((f) => !f.includes("node_modules/"))
    .sort();
}

export function runFact(root: string, f: Fact): FactResult {
  const base = { id: f.id, claim: f.claim, assertedBy: f.assertedBy };
  const p = f.probe;
  switch (p.kind) {
    case "count-files": {
      const n = scan(root, p.glob).length;
      return { ...base, ok: matches(f.expect ?? 0, n), observed: n, expected: show(f.expect) };
    }
    case "count-files-matching": {
      const re = new RegExp(p.pattern, p.flags ?? "");
      const n = scan(root, p.glob).filter((file) => re.test(readFileSync(join(root, file), "utf8"))).length;
      return { ...base, ok: matches(f.expect ?? 0, n), observed: n, expected: show(f.expect) };
    }
    case "json-count": {
      const full = join(root, p.file);
      if (!existsSync(full)) return { ...base, ok: false, observed: "file missing", expected: show(f.expect) };
      const arr = readJsonPath(JSON.parse(readFileSync(full, "utf8")), p.path);
      if (!Array.isArray(arr)) return { ...base, ok: false, observed: `${p.path} not an array`, expected: show(f.expect) };
      const n = arr.filter((x) => Object.entries(p.where ?? {}).every(([k, v]) => (x as Record<string, unknown>)[k] === v)).length;
      return { ...base, ok: matches(f.expect ?? 0, n), observed: n, expected: show(f.expect) };
    }
    case "mutex": {
      const hit = (s: { file: string; pattern: string }) => {
        const full = join(root, s.file);
        return existsSync(full) && new RegExp(s.pattern, "m").test(readFileSync(full, "utf8"));
      };
      const a = hit(p.a), b = hit(p.b);
      return { ...base, ok: !(a && b), observed: a && b ? "both assertions present" : "consistent", expected: "not both" };
    }
  }
}

export function runFacts(root: string, file: FactsFile): FactResult[] {
  if (file.schema !== "ratchet.facts/0") throw new Error("ratchet: facts file is not ratchet.facts/0");
  return file.facts.map((f) => runFact(root, f));
}
