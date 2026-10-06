// Unit tests for the PM core under the owner correction: scope == managed set exactly,
// strict program-file schema, cross-file reference integrity, derived state, views.
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pmEvidenceCoverage, planResolution } from "../src/derive.ts";
import type { EvidenceEvent, Phase, ProgramFile } from "../src/schema.ts";
import { buildPortfolio, paths, renderViews, stripVolatileHead, stripVolatileHeadMd } from "../src/project.ts";
import type { Tracker } from "../src/project.ts";
import { validate } from "../src/check.ts";

// ---------------------------------------------------------------- fixtures

function phase(id: string, over: Partial<Phase> = {}): Phase {
  return {
    id,
    name: "p",
    objective: "why this phase exists",
    outcome: "what exists when it is done",
    effort: "E2",
    loc: { band: "M", range: [100, 200], confidence: "LOW" },
    blockedBy: [],
    softDeps: [],
    exitGates: [id.replace(/P\d+$/, "G1")],
    risks: [],
    openQuestions: [],
    sources: [],
    needsReview: false,
    ...over,
  };
}

function programFile(id: string, over: Partial<ProgramFile> = {}): ProgramFile {
  const n = id.replace("-", "");
  return {
    schema: "vomega-pm-program/1",
    id,
    dossier: {
      explanation: "what it is",
      problem: "why it exists",
      objectives: ["o1", "o2", "o3", "o4"],
      visionContribution: "grounds pillar 4: durable Work/proof/continuity",
      boundaries: ["not a thing it must not become"],
      successConditions: ["observable outcome"],
      falsifiers: ["evidence that would redirect it"],
      sources: ["seed-docs/VISION.md"],
    },
    externalDependencies: [],
    phases: [phase(`${n}-P1`)],
    gates: [{ id: `${n}-G1`, producingPhase: `${n}-P1`, statement: "condition", evidence: "proof", status: "TBD", consumers: [] }],
    gaps: [],
    ...over,
  };
}

const raw = (f: ProgramFile) => ({ name: `${f.id}.json`, raw: JSON.parse(JSON.stringify(f)) });

const TRACKER: Tracker = {
  programs: [
    { id: "MP-21", name: "Migrator", purpose: "purpose text", state: "DESIGN", priority: "NOW" },
    { id: "MP-54", name: "Bundles", purpose: "purpose text" },
    { id: "MP-67", name: "Scorecard", purpose: "measurement" },
  ],
};
const SCOPE = { schema: "vomega-pm-scope/0", managedPrograms: ["MP-21", "MP-54"] };
const noEvents = { schema: "vomega-pm-events/0", events: [] };

// ---------------------------------------------------------------- derivation

describe("planResolution", () => {
  test("each shape maps to exactly one level", () => {
    const p = phase("MP21-P1");
    const shapes: { input: Parameters<typeof planResolution>[0]; want: string }[] = [
      { input: { phases: [] }, want: "REGISTERED" },
      { input: { phases: [phase("MP21-P1", { exitGates: [] })] }, want: "SEEDED" },
      { input: { phases: [p] }, want: "PHASED" },
      { input: { phases: [p], workPackages: [{ taskRef: null }] }, want: "DECOMPOSED" },
      { input: { phases: [p], workPackages: [{ taskRef: "D1-001" }] }, want: "EXECUTABLE" },
    ];
    for (const { input, want } of shapes) expect(planResolution(input)).toBe(want);
  });
});

describe("pmEvidenceCoverage", () => {
  const ev = (kind: EvidenceEvent["kind"]): EvidenceEvent => ({ program: "MP-21", date: "2026-10-06", kind, ref: "x" });
  test("recon does NOT link proof; proof does; regression wins; never reads as a project claim", () => {
    expect(pmEvidenceCoverage([], "MP-21")).toBe("NO_LINKED_PROOF");
    expect(pmEvidenceCoverage([ev("source-inspected")], "MP-21")).toBe("NO_LINKED_PROOF");
    expect(pmEvidenceCoverage([ev("proof")], "MP-21")).toBe("PROOF_LINKED");
    expect(pmEvidenceCoverage([ev("proof"), ev("regressed")], "MP-21")).toBe("REGRESSION_REPORTED");
    expect(pmEvidenceCoverage([{ ...ev("proof"), program: "MP-54" }], "MP-21")).toBe("NO_LINKED_PROOF");
  });
});

// ---------------------------------------------------------------- scope + validation

describe("scope enforcement", () => {
  test("managed set exactly equals scope: clean", () => {
    const r = validate([raw(programFile("MP-21")), raw(programFile("MP-54"))], noEvents, SCOPE, TRACKER);
    expect(r.problems).toEqual([]);
  });

  test("a program file outside scope fails", () => {
    const r = validate([raw(programFile("MP-21")), raw(programFile("MP-54")), raw(programFile("MP-25"))], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("OUT_OF_SCOPE_PROGRAM MP-25"))).toBe(true);
  });

  test("a scope program with no file fails", () => {
    const r = validate([raw(programFile("MP-21"))], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("MISSING_PROGRAM MP-54"))).toBe(true);
  });

  test("a managed id that is not a real canonical program fails", () => {
    const r = validate(
      [raw(programFile("MP-21")), raw(programFile("MP-54"))],
      noEvents,
      { schema: "vomega-pm-scope/0", managedPrograms: ["MP-21", "MP-99"] },
      TRACKER,
    );
    expect(r.problems.some((p) => p.startsWith("UNKNOWN_MANAGED_PROGRAM MP-99"))).toBe(true);
  });

  test("a canonical tracker field at file root is banned", () => {
    const f = JSON.parse(JSON.stringify(programFile("MP-21")));
    f.state = "usurped from the tracker";
    const r = validate([raw(f), raw(programFile("MP-54"))], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("BANNED_KEY"))).toBe(true);
  });
});

describe("reference integrity", () => {
  test("a dangling cross-program gate ref fails", () => {
    const f = programFile("MP-54");
    f.phases[0]!.blockedBy = ["MP21-G999"];
    const r = validate([raw(programFile("MP-21")), raw(f)], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.includes("DANGLING_GATE_REF"))).toBe(true);
  });

  test("a gate cannot produce from another program's phase", () => {
    const f = programFile("MP-54");
    f.gates[0]!.producingPhase = "MP21-P1";
    const r = validate([raw(programFile("MP-21")), raw(f)], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("GATE_OWNER"))).toBe(true);
  });

  test("an external reference to a MANAGED program fails — managed programs connect by gate", () => {
    const f = programFile("MP-54");
    f.externalDependencies = [{ ref: "MP-21", reason: "wrong channel" }];
    const r = validate([raw(programFile("MP-21")), raw(f)], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("EXTERNAL_REF_IS_MANAGED"))).toBe(true);
  });

  test("an external reference must be a real tracker id", () => {
    const f = programFile("MP-54");
    f.externalDependencies = [{ ref: "MP-99", reason: "not a program" }];
    const r = validate([raw(programFile("MP-21")), raw(f)], noEvents, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("UNKNOWN_EXTERNAL_REF"))).toBe(true);
  });

  test("an external reference to an unmanaged real program is allowed", () => {
    const f = programFile("MP-54");
    f.externalDependencies = [{ ref: "MP-67", reason: "measurement discipline, referenced only" }];
    const r = validate([raw(programFile("MP-21")), raw(f)], noEvents, SCOPE, TRACKER);
    expect(r.problems).toEqual([]);
  });

  test("an evidence event outside the managed scope fails", () => {
    const events = { schema: "vomega-pm-events/0", events: [{ program: "MP-67", date: "2026-10-06", kind: "proof", ref: "x" }] };
    const r = validate([raw(programFile("MP-21")), raw(programFile("MP-54"))], events, SCOPE, TRACKER);
    expect(r.problems.some((p) => p.startsWith("EVENT_OUT_OF_SCOPE"))).toBe(true);
  });
});

// ---------------------------------------------------------------- views

describe("views", () => {
  const pf = buildPortfolio(
    { programs: { "MP-21": programFile("MP-21"), "MP-54": programFile("MP-54") } },
    ["MP-21", "MP-54"],
    TRACKER,
    { schema: "vomega-pm-events/0", events: [] },
    "head",
  );

  test("portfolio contains exactly the managed set", () => {
    expect(pf.programs.map((p) => p.id)).toEqual(["MP-21", "MP-54"]);
    expect(pf.counts.programs).toBe(2);
  });

  test("all six view kinds are produced", () => {
    const keys = Object.keys(renderViews(pf));
    expect(keys).toContain("SELECTED-PROGRAMS.md");
    expect(keys).toContain("ROADMAP.md");
    expect(keys).toContain("DEPENDENCIES.md");
    expect(keys).toContain("ESTIMATES.md");
    expect(keys).toContain("portfolio.json");
    expect(keys.filter((k) => k.startsWith("PROGRAMS/")).length).toBe(2);
  });

  test("a committed view is not stale merely because HEAD advanced", () => {
    const a = renderViews(buildPortfolio({ programs: { "MP-21": programFile("MP-21") } }, ["MP-21"], TRACKER, { schema: "vomega-pm-events/0", events: [] }, "aaaaaaa"));
    const b = renderViews(buildPortfolio({ programs: { "MP-21": programFile("MP-21") } }, ["MP-21"], TRACKER, { schema: "vomega-pm-events/0", events: [] }, "bbbbbbb"));
    expect(stripVolatileHead(a["portfolio.json"]!)).toBe(stripVolatileHead(b["portfolio.json"]!));
    expect(stripVolatileHeadMd(a["SELECTED-PROGRAMS.md"]!)).toBe(stripVolatileHeadMd(b["SELECTED-PROGRAMS.md"]!));
  });
});

// ---------------------------------------------------------------- shipped data

describe("shipped managed set", () => {
  const tracker = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;
  const scope = JSON.parse(readFileSync(paths.scope, "utf8"));
  const events = JSON.parse(readFileSync(paths.events, "utf8"));
  const files = readdirSync(paths.programsDir).filter((f) => f.endsWith(".json")).sort()
    .map((name) => ({ name, raw: JSON.parse(readFileSync(join(paths.programsDir, name), "utf8")) }));

  const r = validate(files, events, scope, tracker);

  test("validates clean against the canonical tracker", () => {
    expect(r.problems).toEqual([]);
  });

  test("manages exactly the five owner-selected programs", () => {
    expect(r.scope?.managedPrograms).toEqual(["MP-21", "MP-54", "MP-55", "MP-56", "MP-60"]);
    expect(Object.keys(r.set?.programs ?? {}).length).toBe(5);
  });

  test("all 25 phases are represented and gated", () => {
    const programs = Object.values(r.set?.programs ?? {});
    expect(programs.reduce((n, p) => n + p.phases.length, 0)).toBe(25);
    expect(programs.every((p) => p.phases.every((ph) => ph.exitGates.length > 0))).toBe(true);
  });

  test("every dossier is complete per the correction protocol", () => {
    for (const p of Object.values(r.set?.programs ?? {})) {
      expect(p.dossier.objectives.length).toBeGreaterThanOrEqual(4);
      expect(p.dossier.objectives.length).toBeLessThanOrEqual(8);
      expect(p.dossier.visionContribution.length).toBeGreaterThan(80);
      expect(p.dossier.boundaries.length).toBeGreaterThan(0);
      expect(p.dossier.falsifiers.length).toBeGreaterThan(0);
      expect(p.dossier.sources.length).toBeGreaterThan(0);
    }
  });

  test("MP-60 P5 carries the E5 decomposition-review flag", () => {
    const p5 = r.set?.programs["MP-60"]!.phases.find((ph) => ph.id === "MP60-P5");
    expect(p5?.needsReview).toBe(true);
  });
});
