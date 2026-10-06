// Phase H — replay and experiments (D1-070..077).
import { describe, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bundle, commandDigest, currentCommand, dispatch, replay, runScenarioSuite, semanticDiff } from "../../src/index.ts";
import type { D1State, Scenario } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { ambiguous, says } from "./_helpers.ts";

const scenarios = (JSON.parse(readFileSync(join(import.meta.dir, "../../scenarios/d1-scenarios.json"), "utf8")) as { scenarios: Scenario[] }).scenarios;
const journey = (who: "Work" | "Personal"): D1State => {
  let s = says(ambiguous(), `use ${who}`);
  s = dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(s)!) });
  return dispatch(dispatch(s, { type: "commit" }), { type: "execute" });
};
const byCat = (c: Scenario["category"]) => scenarios.filter((s) => s.category === c);

describe("Phase H — replay and experiments", () => {
  gate("D1-070", "replay bundle pins World, versions and the semantic action log", () => {
    const b = bundle(journey("Work"));
    expect(b.schema).toBe("d1.replay/0");
    expect(b.world.provenance.class).toBe("synthetic-fixture");
    for (const k of ["registry", "interpreter", "realization"] as const) expect(typeof b.versions[k]).toBe("string");
    expect(b.actions.some((a) => a.type === "interpretation")).toBe(false);
    expect(b.actions.map((a) => a.type)).toEqual(expect.arrayContaining(["input", "consent", "commit", "execute"]));
    expect(b.expected.commandDigest).toMatch(/^sha256:/);
  });

  gate("D1-071", "replay runs a bundle with no interactive reconstruction", () => {
    const b = bundle(journey("Work"));
    const r = replay(JSON.parse(JSON.stringify(b)));
    expect(r.finalLifecycle).toBe("completed-simulated");
  });

  gate("D1-072", "complete journey replays to identical command and evidence digests", () => {
    const b = bundle(journey("Work"));
    const r1 = replay(b), r2 = replay(b);
    expect(r1).toEqual(r2);
    expect(r1.commandDigest).toBe(b.expected.commandDigest);
    expect(r1.evidenceDigest).toBe(b.expected.evidenceDigest);
  });

  gate("D1-073", "semantic diff names semantic fields first", () => {
    const d = semanticDiff(journey("Work"), journey("Personal"));
    expect(d.map((x) => x.path)).toContain("command.account");
    expect(d.find((x) => x.path === "command.account")).toMatchObject({ before: "account:claude-work", after: "account:claude-personal" });
    expect(d.some((x) => x.path === "command.capability")).toBe(false);
  });

  gate("D1-074", "canonical suite reports zero false READY", () => {
    expect(byCat("false-ready").length).toBeGreaterThan(0);
    expect(runScenarioSuite(scenarios).metrics.falseReadyRate).toBe(0);
  });

  gate("D1-075", "explicit-target suite reports zero wrong target", () => {
    expect(byCat("explicit-target").length).toBeGreaterThan(0);
    expect(runScenarioSuite(scenarios).metrics.wrongTargetRate).toBe(0);
  });

  gate("D1-076", "ambiguity is preserved wherever it is expected", () => {
    expect(byCat("ambiguity").length).toBeGreaterThan(0);
    expect(runScenarioSuite(scenarios).metrics.ambiguityHonesty).toBe(1);
  });

  gate("D1-077", "revision-stability scenarios score 1", () => {
    expect(byCat("revision").length).toBeGreaterThan(0);
    expect(runScenarioSuite(scenarios).metrics.revisionStability).toBe(1);
  });
});
