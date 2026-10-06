// Unit tests for the PM core under the owner correction: scope == managed set exactly,
// strict program-file schema, cross-file reference integrity, derived state, views.
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { entryBlockState, entryIntent, milestoneSatisfied, pmEvidenceCoverage, planResolution } from "../src/derive.ts";
import type { EvidenceEvent, Phase, ProgramFile } from "../src/schema.ts";
import { buildPortfolio, paths, renderViews, stripVolatileHead, stripVolatileHeadMd } from "../src/project.ts";
import type { Tracker } from "../src/project.ts";
import { validate, validateBuildPlan } from "../src/check.ts";

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
    null,
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
    const a = renderViews(buildPortfolio({ programs: { "MP-21": programFile("MP-21") } }, ["MP-21"], TRACKER, { schema: "vomega-pm-events/0", events: [] }, null, "aaaaaaa"));
    const b = renderViews(buildPortfolio({ programs: { "MP-21": programFile("MP-21") } }, ["MP-21"], TRACKER, { schema: "vomega-pm-events/0", events: [] }, null, "bbbbbbb"));
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

// ---------------------------------------------------------------- build plan (owner-authored)

const PLAN_SET = { programs: { "MP-21": programFile("MP-21"), "MP-54": programFile("MP-54") } };

function planIndexes() {
  const managed = new Set(["MP-21", "MP-54"]);
  const phaseOwner = new Map<string, string>();
  const gateIds = new Set<string>();
  for (const [pid, prog] of Object.entries(PLAN_SET.programs)) {
    for (const ph of prog.phases) phaseOwner.set(ph.id, pid);
    for (const g of prog.gates) gateIds.add(g.id);
  }
  return { managed, phaseOwner, gateIds, programIds: new Set(["MP-21", "MP-54", "MP-67"]) };
}

function plan(over: Record<string, unknown> = {}) {
  return {
    schema: "vomega-pm-buildplan/1",
    status: "OWNER-AUTHORED",
    authority: { whoAuthors: "Owen (owner) only" },
    sourceDirective: ".project/pm/PM-BUILD-PLAN-WAVES-SETUP.md",
    rationale: "test",
    waves: [
      {
        id: "ACCEL-W1",
        name: "Foundations",
        state: "selected",
        objective: "fan out",
        entries: [{ program: "MP-21", startAt: "MP21-P1", executeThrough: "MP21-P1", targetGate: "MP21-G1", emphasis: "PRIMARY", holdAfter: "MP21-P1", resumeWhen: [], note: "" }],
      },
      {
        id: "ACCEL-W2",
        name: "Integration",
        state: "selected",
        objective: "integrate",
        entries: [{ program: "MP-54", startAt: "MP54-P1", executeThrough: "MP54-P1", emphasis: "NORMAL", resumeWhen: ["MP21-G1"], note: "" }],
      },
    ],
    milestones: [{ id: "ACCEL-M1", name: "substrates available", requiredGates: ["MP21-G1"], unlocksWave: "ACCEL-W2", note: "" }],
    lateMaturity: [],
    ...over,
  };
}

describe("build plan validation", () => {
  test("a clean plan validates", () => {
    expect(validateBuildPlan(plan(), ...Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>]).problems).toEqual([]);
  });

  test("1. an out-of-scope program fails", () => {
    const p = plan();
    p.waves[0]!.entries[0]!.program = "MP-61";
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("BUILD_PLAN_OUT_OF_SCOPE"))).toBe(true);
  });

  test("2. an unknown phase fails", () => {
    const p = plan();
    p.waves[0]!.entries[0]!.startAt = "MP99-P1";
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("UNKNOWN_PHASE"))).toBe(true);
  });

  test("3. an unknown gate fails", () => {
    const p = plan();
    p.waves[0]!.entries[0]!.targetGate = "MP21-G9";
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("UNKNOWN_GATE"))).toBe(true);
  });

  test("4. an unknown milestone->wave link fails", () => {
    const p = plan();
    p.milestones[0]!.unlocksWave = "ACCEL-W9";
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("UNKNOWN_WAVE_REF"))).toBe(true);
  });

  test("5. a forbidden decisioning field fails under the strict schema", () => {
    const p = plan();
    (p.waves[0]!.entries[0] as unknown as Record<string, unknown>).priorityScore = 99;
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("BUILD_PLAN_INVALID"))).toBe(true);
  });

  test("a phase from another program cannot be used as an entry boundary", () => {
    const p = plan();
    p.waves[0]!.entries[0]!.executeThrough = "MP54-P1";
    expect(validateBuildPlan(p, ...(Object.values(planIndexes()) as [Set<string>, Map<string, string>, Set<string>, Set<string>])).problems.some((x) => x.startsWith("PHASE_PROGRAM_MISMATCH"))).toBe(true);
  });
});

describe("HOLD vs BLOCKED, milestone conjunction, no decisioning", () => {
  const entry = { program: "MP-21", startAt: "MP21-P1", executeThrough: "MP21-P1", targetGate: "MP21-G1", emphasis: "PRIMARY" as const, holdAfter: "MP21-P1", resumeWhen: [], note: "" };
  const blockedBy = () => ["MP21-G1"];

  test("6. HOLD (owner choice) is distinct from BLOCKED (unsatisfied gate)", () => {
    expect(entryIntent(entry)).toBe("EXECUTE_THEN_HOLD");
    expect(entryBlockState(entry, blockedBy, () => "TBD")).toBe("BLOCKED");
    expect(entryBlockState(entry, blockedBy, () => "SATISFIED")).toBe("UNBLOCKED");
  });

  test("7. a milestone is satisfied only when EVERY required gate is SATISFIED", () => {
    const m = { id: "ACCEL-M1", name: "n", requiredGates: ["MP21-G1", "MP54-G1"], unlocksWave: "ACCEL-W2", note: "" };
    expect(milestoneSatisfied(m, () => "SATISFIED")).toBe(true);
    expect(milestoneSatisfied(m, (g) => (g === "MP21-G1" ? "SATISFIED" : "TBD"))).toBe(false);
  });

  test("8. milestone evaluation does not mutate gate state", () => {
    const statuses = new Map([["MP21-G1", "SATISFIED"], ["MP54-G1", "TBD"]]);
    const m = { id: "ACCEL-M1", name: "n", requiredGates: ["MP21-G1", "MP54-G1"], unlocksWave: "ACCEL-W2", note: "" };
    milestoneSatisfied(m, (g) => statuses.get(g) ?? "UNKNOWN");
    expect([...statuses]).toEqual([["MP21-G1", "SATISFIED"], ["MP54-G1", "TBD"]]);
  });

  test("9. PM renders no recommended next, rank or score even with several available entries", () => {
    const pf = buildPortfolio(PLAN_SET as never, ["MP-21", "MP-54"], TRACKER, { schema: "vomega-pm-events/0", events: [] } as never, plan() as never, "head");
    const md = renderViews(pf)["BUILD-PLAN.md"]!;
    // No decisioning column in any table header, and no "Next:"/"Recommended:" instruction line.
    for (const line of md.split("\n")) {
      if (!line.startsWith("|")) continue;
      expect(line).not.toMatch(/\b(rank|score|priority|weight|order)\b/i);
    }
    expect(md).not.toMatch(/^\s*(next|recommended|start now|do next)\b.*:/im);
    // The owner's emphasis enum is the only ordering signal, and it is coarse and non-numeric.
    expect(md).toContain("PRIMARY");
    expect(md).toContain("Gate state");
  });

  test("10. the generated build plan is deterministic for the same inputs", () => {
    const mk = () => renderViews(buildPortfolio(PLAN_SET as never, ["MP-21", "MP-54"], TRACKER, { schema: "vomega-pm-events/0", events: [] } as never, plan() as never, "head"))["BUILD-PLAN.md"];
    expect(mk()).toBe(mk());
  });
});

describe("shipped owner build plan", () => {
  const raw = JSON.parse(readFileSync(paths.buildPlan, "utf8"));
  const tracker = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;
  const files = readdirSync(paths.programsDir).filter((f) => f.endsWith(".json")).sort()
    .map((name) => ({ name, raw: JSON.parse(readFileSync(join(paths.programsDir, name), "utf8")) }));
  const r = validate(files, { schema: "vomega-pm-events/0", events: [] }, JSON.parse(readFileSync(paths.scope, "utf8")), tracker);
  const phaseOwner = new Map<string, string>();
  const gateIds = new Set<string>();
  for (const [pid, prog] of Object.entries(r.set?.programs ?? {})) {
    for (const ph of prog.phases) phaseOwner.set(ph.id, pid);
    for (const g of prog.gates) gateIds.add(g.id);
  }
  const checked = validateBuildPlan(raw, new Set(["MP-21", "MP-54", "MP-55", "MP-56", "MP-60"]), phaseOwner, gateIds, new Set(tracker.programs.map((p) => p.id)));

  test("validates clean against the managed set", () => {
    expect(checked.problems).toEqual([]);
  });

  test("records Wave 1, ACCEL-M1, Wave 2 and later-wave intent", () => {
    const p = checked.plan!;
    expect(p.waves.map((w) => w.id)).toEqual(["ACCEL-W1", "ACCEL-W2", "ACCEL-W3"]);
    expect(p.milestones.map((m) => m.id)).toEqual(["ACCEL-M1"]);
    expect(p.milestones[0]!.requiredGates).toEqual(["MP21-G3", "MP54-G1", "MP55-G2", "MP56-G4", "MP60-G1"]);
    expect(p.waves[0]!.entries.map((e) => e.program).sort()).toEqual(["MP-21", "MP-54", "MP-55", "MP-56", "MP-60"]);
    expect(p.waves[2]!.state).toBe("seeded-later");
  });

  test("MP-60 P5 is late maturity, in no wave", () => {
    const p = checked.plan!;
    const inWaves = p.waves.flatMap((w) => w.entries.map((e) => `${e.program}:${e.startAt}-${e.executeThrough}`)).join(" ");
    expect(inWaves).not.toContain("MP60-P5");
    expect(p.lateMaturity.some((l) => l.program === "MP-60" && l.phases.includes("MP60-P5"))).toBe(true);
  });
});
