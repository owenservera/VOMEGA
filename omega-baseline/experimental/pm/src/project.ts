// PM projector — read-only. Reads the decomposition seed, the canonical program map and
// the evidence events, and emits a portfolio projection. It owns no state: program meaning
// is read from .project/meta-tracker.json, plan/evidence are derived, and execution/proof
// state stays with the ratchet. Hand-editing generated output is a detected error.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { canonicalize, digest, short } from "../../ratchet/src/canonical.ts";
import { evidenceState, planResolution } from "./derive.ts";
import type { Events, Seed } from "./schema.ts";

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
  counts?: { metaPrograms?: number };
  programs: TrackerProgram[];
}

const ROOT = join(import.meta.dir, "../../../.."); // repo root

export const paths = {
  root: ROOT,
  seed: join(ROOT, ".project/pm/data/programs.json"),
  events: join(ROOT, ".project/pm/data/evidence-events.json"),
  tracker: join(ROOT, ".project/meta-tracker.json"),
  outJson: join(ROOT, ".project/pm/generated/portfolio.json"),
  outMd: join(ROOT, ".project/pm/generated/PORTFOLIO.md"),
};

export function gitHead(cwd = ROOT): string {
  const r = Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"], { cwd, stdout: "pipe", stderr: "pipe" });
  return r.exitCode === 0 ? r.stdout.toString().trim() : "unknown";
}

export interface Portfolio {
  schema: "vomega-pm-portfolio/0";
  sourceHead: string;
  seedDigest: string;
  note: string;
  counts: {
    programs: number;
    seeded: number;
    planResolution: Record<string, number>;
    evidenceState: Record<string, number>;
  };
  gates: { program: string; id: string; statement: string; status: string; consumers: string[] }[];
  programs: {
    id: string;
    name: string;
    purpose: string;
    canonicalState: string | null;
    priority: string | null;
    planResolution: string;
    evidenceState: string;
    seeded: boolean;
    phaseCount: number;
    gateCount: number;
    gapCount: number;
    ungatedPhases: string[];
    needsReview: string[];
    phases: { id: string; name: string; outcome: string; effort: string; loc: unknown; softDeps: string[]; blockedBy: string[]; exitGates: string[] }[];
    gaps: { id: string; kind: string; statement: string }[];
  }[];
}

export function buildPortfolio(seed: Seed, tracker: Tracker, events: Events, sourceHead: string): Portfolio {
  const counts = { programs: tracker.programs.length, seeded: 0, planResolution: {} as Record<string, number>, evidenceState: {} as Record<string, number> };

  const programs = tracker.programs.map((p) => {
    const s = seed.programs[p.id];
    const phases = s?.phases ?? [];
    const plan = planResolution({ phases });
    const ev = evidenceState(events.events, p.id);
    if (s) counts.seeded++;
    counts.planResolution[plan] = (counts.planResolution[plan] ?? 0) + 1;
    counts.evidenceState[ev] = (counts.evidenceState[ev] ?? 0) + 1;
    return {
      id: p.id,
      name: p.name,
      purpose: p.purpose,
      canonicalState: p.state ?? null,
      priority: p.priority ?? null,
      planResolution: plan,
      evidenceState: ev,
      seeded: Boolean(s),
      phaseCount: phases.length,
      gateCount: (s?.gates ?? []).length,
      gapCount: (s?.gaps ?? []).length,
      ungatedPhases: phases.filter((ph) => ph.exitGates.length === 0).map((ph) => ph.id),
      needsReview: phases.filter((ph) => ph.needsReview).map((ph) => ph.id),
      phases: phases.map((ph) => ({
        id: ph.id,
        name: ph.name,
        outcome: ph.outcome,
        effort: ph.effort,
        loc: ph.loc,
        softDeps: ph.softDeps,
        blockedBy: ph.blockedBy,
        exitGates: ph.exitGates,
      })),
      gaps: (s?.gaps ?? []).map((g) => ({ id: g.id, kind: g.kind, statement: g.statement })),
    };
  });

  const gates = Object.entries(seed.programs).flatMap(([pid, s]) =>
    (s.gates ?? []).map((g) => ({ program: pid, id: g.id, statement: g.statement, status: g.status, consumers: g.consumers ?? [] })),
  );

  return {
    schema: "vomega-pm-portfolio/0",
    sourceHead,
    seedDigest: digest(seed),
    note: "Projection only. Program meaning is canonical in .project/meta-tracker.json; plan/evidence are derived; execution/proof state is owned by the ratchet. Do not hand-edit.",
    counts,
    gates,
    programs,
  };
}

function locText(loc: unknown): string {
  const l = loc as { band?: string; range?: number[] } | undefined;
  if (!l || !l.range) return "?";
  return `${l.range[0]}-${l.range[1]} (${l.band})`;
}

/** Escape a value for a Markdown table cell so "|" or a newline inside text cannot break the table. */
const cell = (s: string): string => s.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");

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

/** Neutralize the volatile HEAD line in generated Markdown. The seed digest line stays, so seed drift is still caught. */
export function stripVolatileHeadMd(md: string): string {
  return md.split("\n").filter((l) => !l.startsWith(HEAD_LINE_PREFIX)).join("\n");
}

export function renderPortfolioMd(pf: Portfolio): string {
  const lines: string[] = [];
  lines.push("# PM Portfolio (generated)");
  lines.push("");
  lines.push("> **Projection only.** Do not edit by hand. Program meaning is canonical in `.project/meta-tracker.json`; plan resolution and evidence state are derived; execution/proof state belongs to the ratchet.");
  lines.push(">");
  lines.push(`> Source HEAD \`${pf.sourceHead}\``);
  lines.push(`> seed digest \`${short(pf.seedDigest)}\` · regenerate: \`bun run pm\` · validate: \`bun run pm:check\``);
  lines.push("");
  lines.push("## Counts");
  lines.push("");
  lines.push(`- programs: **${pf.counts.programs}** · seeded: **${pf.counts.seeded}** · registered-only: **${pf.counts.programs - pf.counts.seeded}**`);
  lines.push(`- plan resolution: ${Object.entries(pf.counts.planResolution).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
  lines.push(`- evidence state: ${Object.entries(pf.counts.evidenceState).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
  lines.push("");
  lines.push("## Portfolio");
  lines.push("");
  lines.push("| ID | Program | Purpose (why it exists) | Plan | Evidence | Phases | Gates | Gaps | Ungated |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const p of pf.programs) {
    lines.push(`| ${p.id} | ${cell(p.name)} | ${cell(p.purpose)} | ${p.planResolution} | ${p.evidenceState} | ${p.phaseCount} | ${p.gateCount} | ${p.gapCount} | ${p.ungatedPhases.length || ""} |`);
  }
  lines.push("");
  lines.push("## Cross-program gates");
  lines.push("");
  lines.push("| Gate | Program | Status | Statement | Consumers |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const g of pf.gates) {
    lines.push(`| ${g.id} | ${g.program} | ${g.status} | ${cell(g.statement)} | ${g.consumers.join(", ")} |`);
  }
  lines.push("");
  lines.push("## Seeded program detail");
  lines.push("");
  for (const p of pf.programs.filter((x) => x.seeded)) {
    lines.push(`### ${p.id} — ${p.name}`);
    lines.push("");
    lines.push(`Plan **${p.planResolution}** · evidence **${p.evidenceState}** · canonical state (tracker): \`${p.canonicalState ?? "n/a"}\``);
    lines.push("");
    lines.push("| Phase | Name | Outcome | Effort | LOC | Blocked by | Exit gates | Soft deps |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const ph of p.phases) {
      const blocked = ph.blockedBy.length ? ph.blockedBy.join(", ") : "—";
      const gatesText = ph.exitGates.length ? ph.exitGates.join(", ") : "**none**";
      const soft = ph.softDeps.length ? ph.softDeps.join(", ") : "—";
      lines.push(`| ${ph.id} | ${cell(ph.name)} | ${cell(ph.outcome)} | ${ph.effort} | ${locText(ph.loc)} | ${blocked} | ${gatesText} | ${cell(soft)} |`);
    }
    lines.push("");
    if (p.gaps.length) {
      lines.push("**Carried gaps:**");
      lines.push("");
      for (const g of p.gaps) lines.push(`- \`${g.id}\` (${g.kind}) — ${g.statement}`);
      lines.push("");
    }
  }
  return lines.join("\n") + "\n";
}

export function projectSource(seed: Seed, tracker: Tracker, events: Events, sourceHead: string): { json: string; md: string; canonical: string } {
  const pf = buildPortfolio(seed, tracker, events, sourceHead);
  return { json: JSON.stringify(pf, null, 2) + "\n", md: renderPortfolioMd(pf), canonical: canonicalize(pf) };
}

export function writeProjection(text: { json: string; md: string }): void {
  mkdirSync(dirname(paths.outJson), { recursive: true });
  writeFileSync(paths.outJson, text.json);
  writeFileSync(paths.outMd, text.md);
}
