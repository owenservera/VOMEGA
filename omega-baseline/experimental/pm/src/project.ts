// PM projector — read-only. Assembles the managed five from .project/pm/data/programs/,
// projects canonical meaning from .project/meta-tracker.json, derives plan/evidence state,
// and renders the owner-directed views (SELECTED-PROGRAMS, five dossiers, ROADMAP,
// DEPENDENCIES, ESTIMATES, machine portfolio). It owns no execution/proof state: that
// stays with the ratchet, referenced live at check time and never stored here.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { canonicalize, digest, short } from "../../ratchet/src/canonical.ts";
import { evidenceState, planResolution } from "./derive.ts";
import type { Dossier, Events, Gate, Gap, ManagedSet, Phase, ProgramFile } from "./schema.ts";

export interface TrackerProgram {
  id: string;
  name: string;
  purpose: string;
  state?: string;
  priority?: string;
  owners?: string;
  notes?: string;
}
export interface Tracker {
  programs: TrackerProgram[];
}

const ROOT = join(import.meta.dir, "../../../.."); // repo root

export const paths = {
  root: ROOT,
  scope: join(ROOT, ".project/pm/scope.json"),
  programsDir: join(ROOT, ".project/pm/data/programs"),
  events: join(ROOT, ".project/pm/data/evidence-events.json"),
  tracker: join(ROOT, ".project/meta-tracker.json"),
  outDir: join(ROOT, ".project/pm/generated"),
};

export const VIEW_FILES = [
  "SELECTED-PROGRAMS.md",
  "ROADMAP.md",
  "DEPENDENCIES.md",
  "ESTIMATES.md",
  "portfolio.json",
] as const;

export function gitHead(cwd = ROOT): string {
  const r = Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"], { cwd, stdout: "pipe", stderr: "pipe" });
  return r.exitCode === 0 ? r.stdout.toString().trim() : "unknown";
}

export interface PortfolioProgram {
  id: string;
  name: string;
  purpose: string;
  canonicalState: string | null;
  canonicalPriority: string | null;
  canonicalNotes: string | null;
  dossier: Dossier;
  planResolution: string;
  evidenceState: string;
  phaseCount: number;
  gateCount: number;
  ungatedPhases: string[];
  needsReview: string[];
  externalDependencies: { ref: string; reason: string }[];
  phases: Phase[];
  gates: Gate[];
  gaps: Gap[];
}

export interface Portfolio {
  schema: "vomega-pm-portfolio/1";
  sourceHead: string;
  seedDigest: string;
  managedScope: string[];
  note: string;
  counts: { programs: number; planResolution: Record<string, number>; evidenceState: Record<string, number>; ungatedPhases: number; needsReview: number };
  crossProgramGates: { id: string; program: string; statement: string; consumers: string[]; external: boolean }[];
  programs: PortfolioProgram[];
}

export function buildPortfolio(set: ManagedSet, scope: string[], tracker: Tracker, events: Events, sourceHead: string): Portfolio {
  const managed = new Set(scope);
  const counts = { programs: scope.length, planResolution: {} as Record<string, number>, evidenceState: {} as Record<string, number>, ungatedPhases: 0, needsReview: 0 };
  const byId = new Map(tracker.programs.map((p) => [p.id, p]));

  const programs: PortfolioProgram[] = scope.map((id) => {
    const file = set.programs[id]!;
    const canonical = byId.get(id);
    const plan = planResolution({ phases: file.phases });
    const ev = evidenceState(events.events, id);
    counts.planResolution[plan] = (counts.planResolution[plan] ?? 0) + 1;
    counts.evidenceState[ev] = (counts.evidenceState[ev] ?? 0) + 1;
    const ungated = file.phases.filter((ph) => ph.exitGates.length === 0).map((ph) => ph.id);
    const review = file.phases.filter((ph) => ph.needsReview).map((ph) => ph.id);
    counts.ungatedPhases += ungated.length;
    counts.needsReview += review.length;
    return {
      id,
      name: canonical?.name ?? `UNRESOLVED ${id}`,
      purpose: canonical?.purpose ?? "UNRESOLVED — id not found in meta-tracker.json",
      canonicalState: canonical?.state ?? null,
      canonicalPriority: canonical?.priority ?? null,
      canonicalNotes: canonical?.notes ?? null,
      dossier: file.dossier,
      planResolution: plan,
      evidenceState: ev,
      phaseCount: file.phases.length,
      gateCount: file.gates.length,
      ungatedPhases: ungated,
      needsReview: review,
      externalDependencies: file.externalDependencies,
      phases: file.phases,
      gates: file.gates,
      gaps: file.gaps,
    };
  });

  const prefixOf = (id: string): string => id.replace("-", "") + "-"; // "MP-21" -> "MP21-"
  const crossProgramGates = programs.flatMap((p) => {
    const own = prefixOf(p.id);
    return p.gates
      .filter((g) => g.consumers.some((c) => !c.startsWith(own)))
      .map((g) => ({ id: g.id, program: p.id, statement: g.statement, consumers: g.consumers }));
  });

  return {
    schema: "vomega-pm-portfolio/1",
    sourceHead,
    seedDigest: digest({ scope, programs: [...scope].sort().map((id) => set.programs[id]) }),
    managedScope: scope,
    note: "Projection of the five owner-selected programs only. Canonical meaning is read from .project/meta-tracker.json; plan/evidence are derived; execution/proof state is owned by the ratchet and referenced live at check time. Do not hand-edit.",
    counts,
    crossProgramGates,
    programs,
  };
}

const cell = (s: string): string => s.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
const locText = (loc: Phase["loc"]): string => `${loc.range[0]}-${loc.range[1]} (${loc.band}, ${loc.confidence})`;
const dashes = (a: string[]): string => (a.length ? a.join(", ") : "—");

const PROVENANCE = (pf: Portfolio): string =>
  [
    "> **Generated — do not hand-edit.** PM manages exactly the five owner-selected programs; the other 62 meta programs stay canonical in `.project/meta-tracker.json` and appear here only as external references.",
    ">",
    `> Source HEAD \`${pf.sourceHead}\` · seed digest \`${short(pf.seedDigest)}\` · regenerate: \`bun run pm\` · validate: \`bun run pm:check\` · scope: \`.project/pm/scope.json\` (owner-directed; see \`.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md\`).`,
  ].join("\n");

export function renderViews(pf: Portfolio): Record<string, string> {
  const out: Record<string, string> = {};

  // 1. SELECTED-PROGRAMS.md
  const s: string[] = ["# PM — Selected Programs", "", PROVENANCE(pf), ""];
  s.push(`Managed set: **${pf.managedScope.join(", ")}** — ${pf.counts.programs} programs. Plan resolution: ${Object.entries(pf.counts.planResolution).map(([k, v]) => `${k} ${v}`).join(" · ")}. Evidence: ${Object.entries(pf.counts.evidenceState).map(([k, v]) => `${k} ${v}`).join(" · ")}.`);
  s.push("");
  s.push("PM has no decisioning authority: it does not choose, rank, add, drop, activate or redesign programs. Scope changes only by explicit owner instruction recorded in `.project/pm/scope.json`.");
  s.push("");
  s.push("| ID | Program | Why it exists (canonical) | Canonical state | Plan | Evidence | Phases | Gates |");
  s.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const p of pf.programs) {
    s.push(`| ${p.id} | ${cell(p.name)} | ${cell(p.purpose)} | ${cell(p.canonicalState ?? "—")} | ${p.planResolution} | ${p.evidenceState} | ${p.phaseCount} | ${p.gateCount} |`);
  }
  s.push("");
  out["SELECTED-PROGRAMS.md"] = s.join("\n") + "\n";

  // 2. ROADMAP.md — all 25 phases
  const r: string[] = ["# PM — Roadmap (managed five)", "", `All ${pf.programs.reduce((n, p) => n + p.phaseCount, 0)} phases across the managed five. Effort is engineering complexity, not calendar time; LOC is a planning prior, never a productivity target.`, ""];
  for (const p of pf.programs) {
    r.push(`## ${p.id} — ${p.name}`, "");
    r.push("| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |");
    r.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const ph of p.phases) {
      r.push(`| ${ph.id} | ${cell(ph.name)} | ${cell(ph.objective)} | ${ph.effort} | ${locText(ph.loc)} | ${dashes(ph.blockedBy)} | ${ph.exitGates.length ? ph.exitGates.join(", ") : "**none**"} | ${cell(dashes(ph.softDeps))} | ${ph.needsReview ? "**decomposition review**" : ""} |`);
    }
    r.push("");
  }
  out["ROADMAP.md"] = r.join("\n") + "\n";

  // 3. DEPENDENCIES.md — gate graph
  const d: string[] = ["# PM — Dependency gates (managed five)", "", "Narrow gates, not whole-program serialization. A consumer is unlocked when its named gate is satisfied — the producing program does not have to be complete.", ""];
  d.push("| Gate | Program | Producing phase | Status | Statement | Consumers |");
  d.push("| --- | --- | --- | --- | --- | --- |");
  for (const p of pf.programs) for (const g of p.gates) {
    d.push(`| ${g.id} | ${p.id} | ${g.producingPhase} | ${g.status} | ${cell(g.statement)} | ${g.consumers.join(", ")} |`);
  }
  d.push("");
  d.push("## Cross-program unlocks", "");
  for (const g of pf.crossProgramGates) d.push(`- **${g.id}** (${g.program}) → ${g.consumers.join(", ")} — ${g.statement}`);
  d.push("");
  d.push("## External references (outside PM scope — never managed here)", "");
  const ext = pf.programs.flatMap((p) => p.externalDependencies.map((e) => ({ ...e, program: p.id })));
  for (const e of ext) d.push(`- ${e.program} → \`${e.ref}\`: ${e.reason}`);
  if (!ext.length) d.push("- none");
  d.push("");
  out["DEPENDENCIES.md"] = d.join("\n") + "\n";

  // 4. ESTIMATES.md
  const e: string[] = ["# PM — Estimates (managed five)", "", "Ranges with confidence. Estimates are hypotheses refined by evidence (source inspection, prototypes); they are never targets and never grade a worker. E5 phases require a decomposition review before direct execution.", ""];
  for (const p of pf.programs) {
    e.push(`## ${p.id} — ${p.name}`, "");
    e.push("| Phase | Effort | Implementation LOC | Confidence | Review |");
    e.push("| --- | --- | --- | --- | --- |");
    let lo = 0, hi = 0;
    for (const ph of p.phases) {
      e.push(`| ${ph.id} ${cell(ph.name)} | ${ph.effort} | ${ph.loc.range[0]}–${ph.loc.range[1]} (${ph.loc.band}) | ${ph.loc.confidence} | ${ph.needsReview ? "required (E5)" : ""} |`);
      lo += ph.loc.range[0];
      hi += ph.loc.range[1];
    }
    e.push(`| **total** | — | **${lo}–${hi}** | LOW | ${p.needsReview.length ? "P5 decomposition review outstanding" : ""} |`);
    e.push("");
  }
  out["ESTIMATES.md"] = e.join("\n") + "\n";

  // 5. Program dossiers
  for (const p of pf.programs) {
    const o: string[] = [`# ${p.id} — ${p.name}`, "", PROVENANCE(pf), ""];
    o.push(`**Canonical (META-TRACKER):** purpose — ${p.purpose}`, `**Canonical state:** ${p.canonicalState ?? "—"}`, `**Canonical priority:** ${p.canonicalPriority ?? "—"}`, "");
    o.push("## Explanation", "", p.dossier.explanation, "");
    o.push("## Problem — why this program exists", "", p.dossier.problem, "");
    o.push("## Objectives", "");
    p.dossier.objectives.forEach((x, i) => o.push(`${i + 1}. ${x}`));
    o.push("");
    o.push("## Final Ω vision contribution", "", p.dossier.visionContribution, "");
    o.push("## Boundaries / anti-goals", "");
    for (const b of p.dossier.boundaries) o.push(`- ${b}`);
    o.push("");
    o.push("## Success conditions", "");
    for (const x of p.dossier.successConditions) o.push(`- ${x}`);
    o.push("");
    o.push("## Falsifiers / open questions", "");
    for (const x of p.dossier.falsifiers) o.push(`- ${x}`);
    o.push("");
    o.push("## Phases", "");
    o.push("| Phase | Objective | Effort | LOC | Blocked by | Exit gates |");
    o.push("| --- | --- | --- | --- | --- | --- |");
    for (const ph of p.phases) {
      o.push(`| ${ph.id} ${cell(ph.name)} | ${cell(ph.objective)} | ${ph.effort} | ${locText(ph.loc)} | ${dashes(ph.blockedBy)} | ${ph.exitGates.join(", ")} |`);
    }
    o.push("");
    for (const ph of p.phases) {
      if (!ph.risks.length && !ph.openQuestions.length) continue;
      o.push(`**${ph.id} — ${ph.name}**`, "");
      for (const x of ph.risks) o.push(`- risk: ${x}`);
      for (const x of ph.openQuestions) o.push(`- open question: ${x}`);
      o.push("");
    }
    o.push("## Exit gates", "");
    o.push("| Gate | Producing phase | Status | Statement | Evidence expected | Consumers |");
    o.push("| --- | --- | --- | --- | --- | --- |");
    for (const g of p.gates) o.push(`| ${g.id} | ${g.producingPhase} | ${g.status} | ${cell(g.statement)} | ${cell(g.evidence)} | ${g.consumers.join(", ")} |`);
    o.push("");
    if (p.externalDependencies.length) {
      o.push("## External dependencies (outside PM scope — referenced only)", "");
      for (const x of p.externalDependencies) o.push(`- \`${x.ref}\` — ${x.reason}`);
      o.push("");
    }
    if (p.gaps.length) {
      o.push("## Carried gaps", "");
      for (const g of p.gaps) o.push(`- \`${g.id}\` (${g.kind}) — ${g.statement}`);
      o.push("");
    }
    o.push("## Sources", "");
    for (const src of p.dossier.sources) o.push(`- ${src}`);
    o.push("");
    out[`PROGRAMS/${p.id}.md`] = o.join("\n") + "\n";
  }

  // 6. machine-readable projection
  out["portfolio.json"] = JSON.stringify(pf, null, 2) + "\n";
  return out;
}

const HEAD_LINE_PREFIX = "> Source HEAD `";

/** Neutralize the volatile HEAD in generated JSON, so a committed projection is not "stale" merely because HEAD advanced. */
export function stripVolatileHead(jsonText: string): string {
  try {
    const o = JSON.parse(jsonText) as { sourceHead?: string };
    o.sourceHead = "";
    return JSON.stringify(o, null, 2) + "\n";
  } catch {
    return jsonText;
  }
}

/** Neutralize the volatile HEAD line in generated Markdown. Seed digest and every other line still compare. */
export function stripVolatileHeadMd(md: string): string {
  return md.split("\n").filter((l) => !l.startsWith(HEAD_LINE_PREFIX)).join("\n");
}

export function writeViews(contents: Record<string, string>): void {
  for (const [rel, text] of Object.entries(contents)) {
    const target = join(paths.outDir, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
}
