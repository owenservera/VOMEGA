// Unit tests for the ratchet engine itself (ordinary tests, not gates).
import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalize, digest } from "../src/canonical.ts";
import { activeClaim, claim, parseTtl, release } from "../src/claims.ts";
import type { ClaimsFile } from "../src/claims.ts";
import { runFact } from "../src/drift.ts";
import { parseGateTitle } from "../src/gate.ts";
import { acceptedIndependentReview, authorizedDigests, emptyLock, gateKey } from "../src/lock.ts";
import type { Lock } from "../src/lock.ts";
import { planFanout, surfacesOverlap } from "../src/packet.ts";
import { observationsFrom, parseJUnit } from "../src/probe.ts";
import type { ProbeResult } from "../src/probe.ts";
import { appendLedger, parseBunSummary, readLedger, verifyLedger } from "../src/project.ts";
import type { RatchetSpec } from "../src/spec.ts";
import { computeStates, rankFrontier } from "../src/state.ts";
import { parseDeps, parseTaskMarkdown } from "../src/taskgraph.ts";

const ROOT = join(import.meta.dir, "../../../..");

const MD = `# T
## Phase A — first
| ID | Outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| X-001 | base | — | ok |
| X-002 | left | X-001 | uses \`a|b\` pipe |
| X-003 | right | X-001 | ok |
## Phase B — second
| ID | Outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| X-004 | join | X-002,X-003 | ok |
## Notes
| X-999 | not a task | — | outside phases |
`;

function spec(tasks: RatchetSpec["tasks"] = {}): RatchetSpec {
  return {
    schema: "ratchet.spec/0", id: "x", title: "X", evidenceClass: "SIMULATED", taskSource: "t.md", graphOut: "g.json",
    gateDirs: [], testCwd: ".", lock: "l.json", claims: "c.json", board: "b.md", evidence: "e.json", ledgerDir: ".local",
    baseline: [], packet: { readFirst: [], stopConditions: [], invariants: [] }, tasks,
  };
}
function probeOf(gates: Array<[string, string, "pass" | "fail"]>): ProbeResult {
  return {
    schema: "ratchet.probe/0", spec: "x", head: "h", bun: "1", platform: "p", exitCode: 0,
    totals: { tests: gates.length, gates: gates.length, pass: 0, fail: 0, skip: 0 },
    gates: gates.map(([task, name, status]) => ({ key: gateKey(task, name), task, name, file: "f.test.ts", status })),
    silentFiles: [], outputTail: "", digest: "d",
  };
}
function promote(lock: Lock, task: string, name: string, by = "impl"): void {
  lock.promoted[gateKey(task, name)] = { task, name, file: "f.test.ts", specDigest: "s", by, head: "h", at: "t" };
}
const none: ClaimsFile = { schema: "ratchet.claims/0", claims: [] };
function views(lock: Lock, probe: ProbeResult | null, s = spec(), claims = none) {
  return computeStates({
    graph: parseTaskMarkdown(MD, "t.md"), spec: s, lock, probe, claims,
    artifacts: () => ({ ok: true }), fileDigest: () => "s", now: new Date("2026-10-06T00:00:00Z"),
  });
}
const st = (vs: ReturnType<typeof views>, id: string) => vs.find((v) => v.id === id)!.state;

describe("canonical digests", () => {
  test("key order does not change the digest; values do", () => {
    expect(canonicalize({ b: 1, a: [2, { d: 3, c: 4 }] })).toBe('{"a":[2,{"c":4,"d":3}],"b":1}');
    expect(digest({ a: 1, b: 2 })).toBe(digest({ b: 2, a: 1 }));
    expect(digest({ a: 1 })).not.toBe(digest({ a: 2 }));
  });
  test("rejects non-finite numbers and explicit undefined in arrays", () => {
    expect(() => canonicalize({ a: Number.NaN })).toThrow();
    expect(() => canonicalize([undefined])).toThrow();
    expect(canonicalize({ a: undefined, b: 1 })).toBe('{"b":1}');
  });
});

describe("task graph", () => {
  test("parses phases, deps, escaped pipes; ignores rows outside phases", () => {
    const g = parseTaskMarkdown(MD, "t.md");
    expect(g.tasks.map((t) => t.id)).toEqual(["X-001", "X-002", "X-003", "X-004"]);
    expect(g.tasks[1]!.acceptance).toContain("`a|b`");
    expect(g.tasks[3]!.deps).toEqual(["X-002", "X-003"]);
    expect(g.tasks[0]!.criticality).toBe(3);
    expect(g.tasks[0]!.unblocks).toBe(3);
  });
  test("ranges, unknown deps and cycles", () => {
    expect(parseDeps("D1-012..014, D1-059A")).toEqual(["D1-012", "D1-013", "D1-014", "D1-059A"]);
    expect(() => parseTaskMarkdown(MD.replace("| X-004 | join | X-002,X-003", "| X-004 | join | X-777"), "t")).toThrow(/unknown/);
    expect(() => parseTaskMarkdown(MD.replace("| X-001 | base | —", "| X-001 | base | X-004"), "t")).toThrow(/cycle/);
  });
  test("the real D1 task list compiles", () => {
    const g = parseTaskMarkdown(readFileSync(join(ROOT, ".project/deliverables/D1-ATOMIC-TASKS.md"), "utf8"), "d1");
    expect(g.tasks.length).toBe(77);
    expect(g.tasks.find((t) => t.id === "D1-005")!.deps).toEqual(["D1-003", "D1-004"]);
    expect(g.tasks.find((t) => t.id === "D1-059A")!.deps).toEqual(["D1-059"]);
  });
});

describe("computed state", () => {
  test("open gates leave tasks OPEN/BLOCKED; promoted green gates make them PROVEN", () => {
    const lock = emptyLock("x");
    const probe = probeOf([["X-001", "a", "pass"], ["X-002", "b", "fail"], ["X-003", "c", "fail"], ["X-004", "d", "fail"]]);
    let v = views(lock, probe);
    expect(st(v, "X-001")).toBe("OPEN");
    expect(v.find((x) => x.id === "X-001")!.promotable).toEqual([gateKey("X-001", "a")]);
    expect(st(v, "X-002")).toBe("BLOCKED");
    promote(lock, "X-001", "a");
    v = views(lock, probe);
    expect(st(v, "X-001")).toBe("PROVEN");
    expect(rankFrontier(v).map((x) => x.id)).toEqual(["X-002", "X-003"]);
  });
  test("a promoted gate that goes red or vanishes is REGRESSED", () => {
    const lock = emptyLock("x");
    promote(lock, "X-001", "a");
    expect(st(views(lock, probeOf([["X-001", "a", "fail"]])), "X-001")).toBe("REGRESSED");
    expect(st(views(lock, probeOf([])), "X-001")).toBe("REGRESSED");
  });
  test("DONE needs an accept from someone who neither promoted nor claimed", () => {
    const lock = emptyLock("x");
    promote(lock, "X-001", "a", "impl");
    const probe = probeOf([["X-001", "a", "pass"]]);
    lock.reviews["X-001"] = [{ by: "impl", verdict: "accept", head: "h", at: "t" }];
    expect(st(views(lock, probe), "X-001")).toBe("PROVEN");
    const claims: ClaimsFile = { schema: "ratchet.claims/0", claims: [{ task: "X-001", by: "rev", at: "t", expires: "2000-01-01T00:00:00Z" }] };
    lock.reviews["X-001"]!.push({ by: "rev", verdict: "accept", head: "h", at: "t" });
    expect(st(views(lock, probe, spec(), claims), "X-001")).toBe("PROVEN");
    expect(st(views(lock, probe), "X-001")).toBe("DONE");
    expect(acceptedIndependentReview(lock, "X-001")?.by).toBe("rev");
  });
  test("C2/D8: label case/whitespace variance does not defeat independence", () => {
    const lock = emptyLock("x");
    promote(lock, "X-001", "a", "impl");
    const probe = probeOf([["X-001", "a", "pass"]]);
    lock.reviews["X-001"] = [{ by: "  Impl ", verdict: "accept", head: "h", at: "t" }];
    expect(st(views(lock, probe), "X-001")).toBe("PROVEN");
    lock.reviews["X-001"]!.push({ by: "Reviewer", verdict: "accept", head: "h", at: "t" });
    expect(st(views(lock, probe), "X-001")).toBe("DONE");
  });
  test("tasks with no proof are flagged, and artifact-only tasks cannot run ahead of deps", () => {
    const v = views(emptyLock("x"), probeOf([]));
    expect(v.find((x) => x.id === "X-001")!.missingProof).toBe(true);
    const s = spec({ "X-002": { surface: ["a"], artifacts: [{ path: "x" }] } });
    expect(st(views(emptyLock("x"), probeOf([]), s), "X-002")).toBe("BLOCKED");
  });
  test("superseded tasks satisfy dependents", () => {
    const lock = emptyLock("x");
    lock.superseded["X-001"] = { by: "o", reason: "merged", at: "t" };
    const v = views(lock, probeOf([]));
    expect(st(v, "X-001")).toBe("SUPERSEDED");
    expect(st(v, "X-002")).toBe("OPEN");
  });
});

describe("C1 pre-promotion spec anchoring", () => {
  const probe = () => probeOf([["X-001", "a", "fail"]]);
  const compute = (lock: Lock, cur: string | null) =>
    computeStates({
      graph: parseTaskMarkdown(MD, "t.md"), spec: spec(), lock, probe: probe(), claims: none,
      artifacts: () => ({ ok: true }), fileDigest: () => cur, now: new Date("2026-10-06T00:00:00Z"),
    });
  const gateOf = (vs: ReturnType<typeof compute>, id: string) => vs.find((v) => v.id === id)!.gates[0]!;

  test("an anchored, unpromoted gate whose file changed is SPEC_CHANGED", () => {
    const lock = emptyLock("x");
    lock.anchors["f.test.ts"] = "s";
    expect(gateOf(compute(lock, "s"), "X-001").specChanged).toBe(false);
    expect(gateOf(compute(lock, "WEAKENED"), "X-001").specChanged).toBe(true);
  });

  test("a vanished anchored file is SPEC_CHANGED (deletion never reads as done)", () => {
    const lock = emptyLock("x");
    lock.anchors["f.test.ts"] = "s";
    expect(gateOf(compute(lock, null), "X-001").specChanged).toBe(true);
  });

  test("an explicit spec-change records lineage and re-authorizes the new digest", () => {
    const lock = emptyLock("x");
    lock.anchors["f.test.ts"] = "s";
    lock.specChanges.push({ file: "f.test.ts", by: "w", reason: "split gate", at: "t", from: "s", to: "WEAKENED" });
    expect(authorizedDigests(lock)["f.test.ts"]).toBe("WEAKENED");
    expect(gateOf(compute(lock, "WEAKENED"), "X-001").specChanged).toBe(false);
    expect(gateOf(compute(lock, "s"), "X-001").specChanged).toBe(true); // reverting is also a change
  });

  test("an authorized deletion is not drift, an unexpected present file is", () => {
    const lock = emptyLock("x");
    lock.anchors["f.test.ts"] = "s";
    lock.specChanges.push({ file: "f.test.ts", by: "w", reason: "retired", at: "t", from: "s", to: null });
    expect(authorizedDigests(lock)["f.test.ts"]).toBeNull();
    expect(gateOf(compute(lock, null), "X-001").specChanged).toBe(false);
    expect(gateOf(compute(lock, "s"), "X-001").specChanged).toBe(true);
  });
});

describe("claims", () => {
  test("leases expire, renew, and block other claimants", () => {
    const f: ClaimsFile = { schema: "ratchet.claims/0", claims: [] };
    const t0 = new Date("2026-10-06T00:00:00Z");
    claim(f, "X-1", "a", t0, parseTtl("1h"));
    expect(() => claim(f, "X-1", "b", t0, parseTtl("1h"))).toThrow(/claimed by a/);
    expect(activeClaim(f, "X-1", new Date("2026-10-06T02:00:00Z"))).toBeNull();
    claim(f, "X-1", "b", new Date("2026-10-06T02:00:00Z"), parseTtl("30m"));
    release(f, "X-1", "b", new Date("2026-10-06T02:10:00Z"));
    expect(activeClaim(f, "X-1", new Date("2026-10-06T02:11:00Z"))).toBeNull();
    expect(parseTtl("2d")).toBe(172_800_000);
  });
});

describe("fan-out", () => {
  test("surface overlap is prefix-based and unknown surfaces conflict", () => {
    expect(surfacesOverlap(["a/b/"], ["a/b/c.ts"])).toBe(true);
    expect(surfacesOverlap(["a/b.ts"], ["a/bc.ts"])).toBe(false);
    expect(surfacesOverlap(["src/**/*.ts"], ["src/x.ts"])).toBe(true);
    expect(surfacesOverlap([], ["x"])).toBe(true);
  });
  test("wildcard surfaces conflict with the concrete files they can match (D1)", () => {
    expect(surfacesOverlap(["src/foo*.ts"], ["src/foobar.ts"])).toBe(true);
    expect(surfacesOverlap(["src/foo*.ts"], ["other/foo1.ts"])).toBe(false);
  });
  test("picks disjoint frontier tasks", () => {
    const lock = emptyLock("x");
    promote(lock, "X-001", "a");
    const probe = probeOf([["X-001", "a", "pass"], ["X-002", "b", "fail"], ["X-003", "c", "fail"]]);
    const disjoint = spec({ "X-002": { surface: ["l.ts"] }, "X-003": { surface: ["r.ts"] } });
    expect(planFanout(views(lock, probe, disjoint), disjoint, 4).map((v) => v.id)).toEqual(["X-002", "X-003"]);
    const shared = spec({ "X-002": { surface: ["m.ts"] }, "X-003": { surface: ["m.ts"] } });
    expect(planFanout(views(lock, probe, shared), shared, 4).length).toBe(1);
  });
});

describe("probe parsing", () => {
  test("reads Bun JUnit, decodes entities, keeps only gates", () => {
    const xml = `<testsuites><testsuite name="a">
      <testcase name="[D1-001] ok &amp; &quot;fine&quot;" classname="g" file="a.test.ts" line="3" />
      <testcase name="[D1-002] red" classname="g" file="a.test.ts" line="4"><failure type="Error" message="NotImplemented[D1-002]: x">trace</failure></testcase>
      <testcase name="plain test" classname="g" file="a.test.ts" line="5" />
      <testcase name="[D1-003] skipped" classname="g" file="a.test.ts" line="6"><skipped /></testcase>
    </testsuite></testsuites>`;
    const cases = parseJUnit(xml);
    expect(cases.map((c) => c.status)).toEqual(["pass", "fail", "pass", "skip"]);
    const gates = observationsFrom(cases, (f) => `dir/${f}`);
    expect(gates.map((g) => g.key)).toEqual(['D1-001::ok & "fine"', "D1-002::red", "D1-003::skipped"]);
    expect(gates[1]!.message).toContain("NotImplemented[D1-002]");
    expect(gates[0]!.file).toBe("dir/a.test.ts");
  });
  test("gate titles", () => {
    expect(parseGateTitle("[D1-059A] drift")).toEqual({ task: "D1-059A", name: "drift" });
    expect(parseGateTitle("nope")).toBeNull();
  });
  test("bun summary parsing", () => {
    expect(parseBunSummary(" 62 pass\n 0 fail\n 1622 expect() calls\nRan 62 tests across 7 files.")).toEqual({ pass: 62, fail: 0, expects: 1622, tests: 62 });
  });
});

describe("ledger and drift", () => {
  const dir = mkdtempSync(join(tmpdir(), "ratchet-"));
  test("ledger is hash-chained and tamper-evident", () => {
    const p = join(dir, "ledger.jsonl");
    appendLedger(p, "probe", "h", { n: 1 });
    appendLedger(p, "promote", "h", { n: 2 });
    expect(verifyLedger(readLedger(p)).ok).toBe(true);
    writeFileSync(p, readFileSync(p, "utf8").replace('"n":1', '"n":9'));
    expect(verifyLedger(readLedger(p))).toEqual({ ok: false, badAt: 1 });
  });
  test("facts: counts, json counts and mutex", () => {
    mkdirSync(join(dir, "m/a"), { recursive: true });
    mkdirSync(join(dir, "m/b"), { recursive: true });
    writeFileSync(join(dir, "m/a/plugin.json"), '{"contentHash": ""}');
    writeFileSync(join(dir, "m/b/plugin.json"), '{"contentHash": "abc"}');
    writeFileSync(join(dir, "c.json"), JSON.stringify({ cases: [{ b: "fail" }, { b: "pass" }, { b: "fail" }] }));
    writeFileSync(join(dir, "s1.md"), "D1 is CLAIMED");
    writeFileSync(join(dir, "s2.md"), "nothing running");
    const base = { claim: "c", assertedBy: ["x.md"] };
    expect(runFact(dir, { ...base, id: "a", probe: { kind: "count-files", glob: "m/*/plugin.json" }, expect: 2 }).ok).toBe(true);
    expect(runFact(dir, { ...base, id: "b", probe: { kind: "count-files-matching", glob: "m/*/plugin.json", pattern: '"contentHash":\\s*""' }, expect: 2 }).observed).toBe(1);
    expect(runFact(dir, { ...base, id: "c", probe: { kind: "json-count", file: "c.json", path: "cases", where: { b: "fail" } }, expect: { min: 2 } }).ok).toBe(true);
    expect(runFact(dir, { ...base, id: "d", probe: { kind: "mutex", a: { file: "s1.md", pattern: "CLAIMED" }, b: { file: "s2.md", pattern: "nothing running" } } }).ok).toBe(false);
  });
});
