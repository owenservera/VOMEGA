import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { analysisPaths, byId, loadPortfolioAnalysis, parseDeliverableTsv, validatePortfolioAnalysis } from "../src/portfolio-analysis.ts";
import { paths, type Tracker } from "../src/project.ts";

describe("67-program portfolio analysis", () => {
  const tracker = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;
  const report = loadPortfolioAnalysis();

  test("covers all 67 canonical programs exactly once", () => {
    expect(report.problems).toEqual([]);
    expect(report.programs).toHaveLength(67);
    expect(new Set(report.programs.map((p) => p.id)).size).toBe(67);
    expect(report.programs.map((p) => p.id).sort()).toEqual(tracker.programs.map((p) => p.id).sort());
  });

  test("every program has exactly three criticality-ordered deliverables", () => {
    for (const p of report.programs) {
      expect(p.deliverables).toHaveLength(3);
      expect(p.deliverables.map((d) => d.rank)).toEqual([1, 2, 3]);
      expect(new Set(p.deliverables.map((d) => d.title)).size).toBe(3);
    }
  });

  test("design intensity and maturity use independent D1-D5 and M1-M5 vocabularies", () => {
    for (const p of report.programs) {
      for (const d of p.deliverables) {
        expect(d.designIntensity).toMatch(/^D[1-5]$/);
        expect(d.maturityTarget).toMatch(/^M[1-5]$/);
      }
    }
  });

  test("analysis does not mutate or mirror managed PM scope", () => {
    const scope = JSON.parse(readFileSync(paths.scope, "utf8"));
    expect(scope.managedPrograms).toEqual(["MP-21", "MP-54", "MP-55", "MP-56", "MP-60"]);
    expect(report.programs).toHaveLength(67);
  });

  test("analysis TSV exposes no autonomous selection/priority fields", () => {
    const header = readFileSync(analysisPaths.deliverables, "utf8").split(/\r?\n/, 1)[0]!.toLowerCase();
    for (const banned of ["priorityscore", "recommendednext", "selected", "activate", "schedule", "ownerdecision", "optimalorder", "autorank"]) {
      expect(header).not.toContain(banned);
    }
  });

  test("the seven golden design-heavy areas contain load-bearing D5 reference deliverables", () => {
    const golden: Array<[string,string]> = [
      ["MP-06", "Canonical semantic object model"],       // semantic substrate + World
      ["MP-08", "Composable language contribution model"],// language -> command semantics
      ["MP-31", "Release authority matrix"],              // authority / Work / effect truth
      ["MP-25", "Account identity/binding evidence"],      // provider/account/session reality
      ["MP-18", "Reflection ABI minimum"],                 // self-description / evolution
      ["MP-05", "Product Instance identity contract"],     // sovereign continuity / memory
      ["MP-14", "Semantic visual vocabulary"],             // human semantic interaction
    ];
    for (const [id, title] of golden) {
      const p = byId(report.programs, id);
      const d = p.deliverables.find((x) => x.title === title);
      expect(d, `${id} missing golden deliverable ${title}`).toBeDefined();
      expect(d?.designIntensity).toBe("D5");
    }
  });

  test("large-looking work is not automatically classified as design-heavy", () => {
    expect(byId(report.programs, "MP-04").deliverables[0]!.designIntensity).toBe("D2");
    expect(byId(report.programs, "MP-51").deliverables[0]!.designIntensity).toBe("D2");
    expect(byId(report.programs, "MP-52").deliverables[0]!.designIntensity).toBe("D2");
    expect(byId(report.programs, "MP-59").deliverables[0]!.designIntensity).toBe("D2");
  });

  test("small but irreversible conceptual contracts may be D5", () => {
    expect(byId(report.programs, "MP-05").deliverables[0]!.designIntensity).toBe("D5");
    expect(byId(report.programs, "MP-06").deliverables[0]!.designIntensity).toBe("D5");
    expect(byId(report.programs, "MP-26").deliverables[0]!.designIntensity).toBe("D5");
    expect(byId(report.programs, "MP-31").deliverables[0]!.designIntensity).toBe("D5");
    expect(byId(report.programs, "MP-33").deliverables[0]!.designIntensity).toBe("D5");
  });

  test("M5 is available as the state-of-the-art target but is not mandatory for every top-three list", () => {
    const all = report.programs.flatMap((p) => p.deliverables);
    expect(all.some((d) => d.maturityTarget === "M5")).toBe(true);
    expect(byId(report.programs, "MP-04").deliverables.every((d) => d.maturityTarget !== "M5")).toBe(true);
    expect(byId(report.programs, "MP-06").deliverables[2]!.maturityTarget).toBe("M5");
  });
});

describe("analysis parser failure cases", () => {
  const tracker = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;

  test("missing canonical programs are rejected", () => {
    const text = readFileSync(analysisPaths.deliverables, "utf8");
    const rows = text.trim().split(/\r?\n/);
    const parsed = parseDeliverableTsv([rows[0], ...rows.slice(1).filter((r) => !r.startsWith("MP-67\t"))].join("\n"));
    const problems = [...parsed.problems, ...validatePortfolioAnalysis(parsed.programs, tracker)];
    expect(problems.some((p) => p === "ANALYSIS_MISSING_PROGRAM MP-67")).toBe(true);
  });

  test("invalid D/M labels fail parsing", () => {
    const text = [
      "id\td1\td1_design\td1_maturity\td2\td2_design\td2_maturity\td3\td3_design\td3_maturity",
      "MP-01\ta\tD9\tM2\tb\tD2\tM3\tc\tD3\tM5",
    ].join("\n");
    const parsed = parseDeliverableTsv(text);
    expect(parsed.problems.some((p) => p.startsWith("ANALYSIS_INVALID"))).toBe(true);
  });
});
