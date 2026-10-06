// Unit tests for the PM core: derivation, strict schema, reference validation, projection.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { evidenceState, planResolution } from "../src/derive.ts";
import type { EvidenceEvent, Phase } from "../src/schema.ts";
import { buildPortfolio, paths, projectSource, renderPortfolioMd, stripVolatileHead, stripVolatileHeadMd } from "../src/project.ts";
import type { Tracker } from "../src/project.ts";
import { validate } from "../src/check.ts";

// ---------------------------------------------------------------- fixtures

function phase(over: Partial<Phase> = {}): Phase {
  return {
    id: "MP21-P1",
    name: "p",
    outcome: "o",
    effort: "E2",
    loc: { band: "M", range: [100, 200], confidence: "LOW" },
    blockedBy: [],
    softDeps: [],
    exitGates: ["MP21-G1"],
    needsReview: false,
    ...over,
  };
}

const tracker: Tracker = {
  programs: [
    { id: "MP-21", name: "Migrator", purpose: "purpose text", state: "DESIGN", priority: "NOW" },
    { id: "MP-54", name: "Bundles", purpose: "purpose text" },
  ],
};

function seedWith(programs: Record<string, unknown>) {
  return { schema: "vomega-pm/0", programs };
}
const noEvents = { schema: "vomega-pm-events/0", events: [] };

// ---------------------------------------------------------------- derivation

describe("planResolution", () => {
  test("no phases => REGISTERED", () => expect(planResolution({ phases: [] })).toBe("REGISTERED"));
  test("any incomplete phase => SEEDED", () => {
    const p = phase({ exitGates: [] });
    expect(planResolution({ phases: [p] })).toBe("SEEDED");
  });
  test("all phases complete, no work packages => PHASED", () => {
    expect(planResolution({ phases: [phase()] })).toBe("PHASED");
  });
  test("work package without a task ref => DECOMPOSED", () => {
    expect(planResolution({ phases: [phase()], workPackages: [{}] })).toBe("DECOMPOSED");
  });
  test("work package with a resolvable task ref => EXECUTABLE", () => {
    expect(planResolution({ phases: [phase()], workPackages: [{ taskRef: "D1-001" }] })).toBe("EXECUTABLE");
  });
  test("each shape maps to exactly one level", () => {
    const shapes: { p: Parameters<typeof planResolution>[0]; want: string }[] = [
      { p: { phases: [] }, want: "REGISTERED" },
      { p: { phases: [phase({ loc: undefined as never })] }, want: "SEEDED" },
      { p: { phases: [phase()] }, want: "PHASED" },
      { p: { phases: [phase()], workPackages: [{ taskRef: null }] }, want: "DECOMPOSED" },
      { p: { phases: [phase()], workPackages: [{ taskRef: "X-1" }] }, want: "EXECUTABLE" },
    ];
    for (const { p, want } of shapes) expect(planResolution(p)).toBe(want);
  });
});

describe("evidenceState", () => {
  const ev = (kind: EvidenceEvent["kind"]): EvidenceEvent => ({ program: "MP-21", date: "2026-10-06", kind, ref: "x" });
  test("no events => UNPROVEN", () => expect(evidenceState([], "MP-21")).toBe("UNPROVEN"));
  test("recon (source-inspected) does NOT promote", () => expect(evidenceState([ev("source-inspected")], "MP-21")).toBe("UNPROVEN"));
  test("a proof event => EVIDENCED", () => expect(evidenceState([ev("proof")], "MP-21")).toBe("EVIDENCED"));
  test("a regression wins over proof", () => expect(evidenceState([ev("proof"), ev("regressed")], "MP-21")).toBe("REGRESSED"));
  test("events for another program are ignored", () => expect(evidenceState([{ ...ev("proof"), program: "MP-54" }], "MP-21")).toBe("UNPROVEN"));
});

// ---------------------------------------------------------------- validation

describe("validate", () => {
  test("clean seed has no problems", () => {
    const r = validate(seedWith({ "MP-21": { phases: [phase()], gates: [{ id: "MP21-G1", statement: "s", consumers: ["MP21-P1"] }] } }), noEvents, tracker);
    expect(r.problems).toEqual([]);
  });

  test("a banned meaning key fails", () => {
    const r = validate(seedWith({ "MP-21": { purpose: "duplicated meaning", phases: [] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.startsWith("BANNED_KEY"))).toBe(true);
  });

  test("an unknown unknown-key fails strict parsing", () => {
    const r = validate(seedWith({ "MP-21": { mystery: 1, phases: [] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.startsWith("SEED_INVALID"))).toBe(true);
  });

  test("a program absent from the canonical tracker fails", () => {
    const r = validate(seedWith({ "MP-99": { phases: [] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.startsWith("UNKNOWN_PROGRAM"))).toBe(true);
  });

  test("a dangling gate reference fails", () => {
    const r = validate(seedWith({ "MP-21": { phases: [phase({ exitGates: ["MP21-G999"] })] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.includes("DANGLING_GATE_REF"))).toBe(true);
  });

  test("a dangling consumer reference fails", () => {
    const r = validate(seedWith({ "MP-21": { phases: [], gates: [{ id: "MP21-G1", statement: "s", consumers: ["MP54-P9"] }] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.includes("DANGLING_CONSUMER_REF"))).toBe(true);
  });

  test("a gate whose prefix mismatches its program fails", () => {
    const r = validate(seedWith({ "MP-21": { phases: [], gates: [{ id: "MP54-G1", statement: "s" }] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.startsWith("GATE_PREFIX"))).toBe(true);
  });

  test("a maturityHint that disagrees with the derived value warns but does not fail", () => {
    const r = validate(seedWith({ "MP-21": { maturityHint: "PHASED", phases: [phase({ exitGates: [] })] } }), noEvents, tracker);
    expect(r.problems).toEqual([]);
    expect(r.warnings.some((w) => w.startsWith("HINT_MISMATCH"))).toBe(true);
  });

  test("an evidence event for an unknown gate fails", () => {
    const events = { schema: "vomega-pm-events/0", events: [{ program: "MP-21", gate: "MP21-G7", date: "2026-10-06", kind: "proof", ref: "x" }] };
    const r = validate(seedWith({ "MP-21": { phases: [phase()] } }), events, tracker);
    expect(r.problems.some((p) => p.includes("DANGLING_GATE_REF evidence"))).toBe(true);
  });

  test("a workPackages key is rejected in v0 (strict schema)", () => {
    const r = validate(seedWith({ "MP-21": { phases: [phase()], workPackages: [{ taskRef: "D1-001" }] } }), noEvents, tracker);
    expect(r.problems.some((p) => p.startsWith("SEED_INVALID"))).toBe(true);
  });
});

// ---------------------------------------------------------------- projection

describe("projection", () => {
  test("is deterministic for the same input", () => {
    const seed = { schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase()], gates: [{ id: "MP21-G1", statement: "s", consumers: [] }], gaps: [] } } };
    const a = renderPortfolioMd(buildPortfolio(seed as never, tracker, noEvents as never, "head"));
    const b = renderPortfolioMd(buildPortfolio(seed as never, tracker, noEvents as never, "head"));
    expect(a).toBe(b);
  });

  test("counts cover every canonical program, registered-only ones included", () => {
    const pf = buildPortfolio({ schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase()] } } } as never, tracker, noEvents as never, "head");
    expect(pf.counts.programs).toBe(2);
    expect(pf.counts.seeded).toBe(1);
    expect(pf.counts.planResolution.REGISTERED).toBe(1);
  });

  test("escapes pipes so a table cell cannot break the table", () => {
    const seed = { schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase({ name: "a | b" })] } } };
    const md = renderPortfolioMd(buildPortfolio(seed as never, tracker, noEvents as never, "head"));
    expect(md).toContain("a \\| b");
  });

  test("escapes newlines so a multi-line value cannot break the table", () => {
    const seed = { schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase({ name: "a\nb" })] } } };
    const md = renderPortfolioMd(buildPortfolio(seed as never, tracker, noEvents as never, "head"));
    expect(md).toContain("a b");
    expect(md).not.toContain("a\nb");
  });

  test("renders a purpose column read from the canonical tracker", () => {
    const seed = { schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase()] } } };
    const md = renderPortfolioMd(buildPortfolio(seed as never, tracker, noEvents as never, "head"));
    expect(md).toContain("Purpose (why it exists)");
    expect(md).toContain("purpose text");
  });

  test("a committed projection is not stale merely because HEAD advanced", () => {
    const seed = { schema: "vomega-pm/0", programs: { "MP-21": { phases: [phase()] } } };
    const a = projectSource(seed as never, tracker, noEvents as never, "aaaaaaa");
    const b = projectSource(seed as never, tracker, noEvents as never, "bbbbbbb");
    expect(stripVolatileHead(a.json)).toBe(stripVolatileHead(b.json));
    expect(stripVolatileHeadMd(a.md)).toBe(stripVolatileHeadMd(b.md));
    // A seed change still shows through the surviving digest line.
    const c = projectSource({ schema: "vomega-pm/0", programs: {} } as never, tracker, noEvents as never, "aaaaaaa");
    expect(stripVolatileHeadMd(a.md)).not.toBe(stripVolatileHeadMd(c.md));
  });
});

// ---------------------------------------------------------------- real seed

describe("shipped seed", () => {
  test("validates clean against the canonical tracker", () => {
    const tracker2 = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;
    const seed = JSON.parse(readFileSync(paths.seed, "utf8"));
    const events = JSON.parse(readFileSync(paths.events, "utf8"));
    const r = validate(seed, events, tracker2);
    expect(r.problems).toEqual([]);
    expect(r.seed?.programs && Object.keys(r.seed.programs).length).toBe(5);
  });

  test("carries the audit's ungated phases and the E5 review flag", () => {
    const seed = JSON.parse(readFileSync(paths.seed, "utf8")) as { programs: Record<string, { phases: { exitGates: string[]; needsReview: boolean }[] }> };
    const ungated = Object.values(seed.programs).flatMap((p) => p.phases.filter((ph) => ph.exitGates.length === 0));
    expect(ungated.length).toBe(9);
    expect(seed.programs["MP-60"]!.phases.some((ph) => ph.needsReview)).toBe(true);
  });
});
