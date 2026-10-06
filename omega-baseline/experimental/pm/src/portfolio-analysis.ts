// Portfolio-analysis reader.
// This is deliberately separate from PM managed scope. It reads the canonical 67-program map
// and a non-authoritative analysis of each program's three critical deliverables.
//
// The analysis can expose design intensity and maturity targets. It cannot select, activate,
// prioritize or add programs to .project/pm/scope.json.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { paths, type Tracker } from "./project.ts";

export const DESIGN_INTENSITY = ["D1", "D2", "D3", "D4", "D5"] as const;
export const MATURITY_LEVEL = ["M1", "M2", "M3", "M4", "M5"] as const;

const Deliverable = z.strictObject({
  rank: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string().min(3),
  designIntensity: z.enum(DESIGN_INTENSITY),
  maturityTarget: z.enum(MATURITY_LEVEL),
});
export type PortfolioDeliverable = z.infer<typeof Deliverable>;

const ProgramAnalysis = z.strictObject({
  id: z.string().regex(/^MP-\d{2}$/),
  deliverables: z.tuple([Deliverable, Deliverable, Deliverable]),
});
export type ProgramAnalysis = z.infer<typeof ProgramAnalysis>;

export interface PortfolioAnalysisReport {
  programs: ProgramAnalysis[];
  problems: string[];
}

export const analysisPaths = {
  deliverables: join(paths.root, ".project/pm/portfolio-analysis/PROGRAM-DELIVERABLES.tsv"),
  designSystem: join(paths.root, ".project/pm/portfolio-analysis/DESIGN-INTENSITY-SYSTEM.md"),
};

const EXPECTED_HEADER = [
  "id",
  "d1", "d1_design", "d1_maturity",
  "d2", "d2_design", "d2_maturity",
  "d3", "d3_design", "d3_maturity",
];

export function parseDeliverableTsv(text: string): PortfolioAnalysisReport {
  const problems: string[] = [];
  const rows = text.replace(/\r\n/g, "\n").trim().split("\n");
  if (!rows.length) return { programs: [], problems: ["ANALYSIS_EMPTY"] };

  const header = rows.shift()!.split("\t");
  if (JSON.stringify(header) !== JSON.stringify(EXPECTED_HEADER)) {
    problems.push(`ANALYSIS_HEADER expected ${EXPECTED_HEADER.join("|")} got ${header.join("|")}`);
  }

  const programs: ProgramAnalysis[] = [];
  for (const [offset, line] of rows.entries()) {
    const cols = line.split("\t");
    const lineNo = offset + 2;
    if (cols.length !== EXPECTED_HEADER.length) {
      problems.push(`ANALYSIS_COLUMNS line ${lineNo}: expected ${EXPECTED_HEADER.length}, got ${cols.length}`);
      continue;
    }
    const [id,d1,d1d,d1m,d2,d2d,d2m,d3,d3d,d3m] = cols;
    const candidate = {
      id,
      deliverables: [
        { rank: 1 as const, title: d1, designIntensity: d1d, maturityTarget: d1m },
        { rank: 2 as const, title: d2, designIntensity: d2d, maturityTarget: d2m },
        { rank: 3 as const, title: d3, designIntensity: d3d, maturityTarget: d3m },
      ],
    };
    const parsed = ProgramAnalysis.safeParse(candidate);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) problems.push(`ANALYSIS_INVALID line ${lineNo} ${issue.path.join(".")}: ${issue.message}`);
      continue;
    }
    programs.push(parsed.data);
  }
  return { programs, problems };
}

export function validatePortfolioAnalysis(programs: ProgramAnalysis[], tracker: Tracker): string[] {
  const problems: string[] = [];
  const canonical = new Set(tracker.programs.map((p) => p.id));
  const seen = new Set<string>();

  for (const p of programs) {
    if (!canonical.has(p.id)) problems.push(`ANALYSIS_UNKNOWN_PROGRAM ${p.id}`);
    if (seen.has(p.id)) problems.push(`ANALYSIS_DUPLICATE_PROGRAM ${p.id}`);
    seen.add(p.id);
    if (p.deliverables.map((d) => d.rank).join(",") !== "1,2,3") problems.push(`ANALYSIS_BAD_RANKS ${p.id}`);
  }

  for (const id of canonical) if (!seen.has(id)) problems.push(`ANALYSIS_MISSING_PROGRAM ${id}`);
  return problems;
}

export function loadPortfolioAnalysis(): PortfolioAnalysisReport {
  const tracker = JSON.parse(readFileSync(paths.tracker, "utf8")) as Tracker;
  const parsed = parseDeliverableTsv(readFileSync(analysisPaths.deliverables, "utf8"));
  return { programs: parsed.programs, problems: [...parsed.problems, ...validatePortfolioAnalysis(parsed.programs, tracker)] };
}

export function byId(programs: ProgramAnalysis[], id: string): ProgramAnalysis {
  const found = programs.find((p) => p.id === id);
  if (!found) throw new Error(`program analysis not found: ${id}`);
  return found;
}
