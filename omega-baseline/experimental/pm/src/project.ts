// PM projector — read-only. Assembles the managed five from .project/pm/data/programs/,
// projects canonical meaning from .project/meta-tracker.json, derives plan/evidence state,
// and renders the owner-directed views (SELECTED-PROGRAMS, five dossiers, ROADMAP,
// DEPENDENCIES, ESTIMATES, machine portfolio). It owns no execution/proof state: that
// stays with the ratchet, referenced live at check time and never stored here.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { canonicalize, digest, short } from "../../ratchet/src/canonical.ts";
import { entryBlockState, entryIntent, milestoneSatisfied, pmEvidenceCoverage, planResolution } from "./derive.ts";
import type { BuildPlan } from "./schema.ts";
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
  buildPlan: join(ROOT, ".project/pm/build-plan.json"),
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
  /** Whether PM holds a linked proof record for this program — NOT the project's evidence state. */
  pmEvidenceCoverage: string;
  /** Whether this program is linked to an execution/proof system (Ratchet). "not linked" until a phase is scheduled. */
  executionLink: string;
  phaseCount: number;
  gateCount: number;
  ungatedPhases: string[];
  needsReview: string[];
  evidencePointers: { date: string; kind: string; ref: string }[];
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
  counts: { programs: number; planResolution: Record<string, number>; pmEvidenceCoverage: Record<string, number>; ungatedPhases: number; needsReview: number };
  crossProgramGates: { id: string; program: string; statement: string; consumers: string[] }[];
  /** Owner-authored build plan, projected with derived gate state. PM never authors or reorders it. */
  buildPlan: {
    sourceDirective: string;
    status: string;
    rationale: string;
    waves: {
      id: string;
      name: string;
      state: string;
      objective: string;
      authorization: string;
      entries: {
        program: string;
        range: string;
        intent: string;
        emphasis: string;
        blockState: string;
        targetGate: string | null;
        targetGateStatus: string | null;
        holdAfter: string | null;
        resumeWhen: string[];
        note: string;
      }[];
    }[];
    milestones: {
      id: string;
      name: string;
      satisfied: boolean;
      requiredGates: { gate: string; status: string }[];
      unlocksWave: string;
      waveAuthorization: string;
      note: string;
    }[];
    lateMaturity: { program: string; phases: string[]; condition: string }[];
    interoperability: { requirement: string; note: string } | null;
  };
  programs: PortfolioProgram[];
}

export function buildPortfolio(set: ManagedSet, scope: string[], tracker: Tracker, events: Events, buildPlan: BuildPlan | null, sourceHead: string): Portfolio {
  const managed = new Set(scope);
  const counts = { programs: scope.length, planResolution: {} as Record<string, number>, pmEvidenceCoverage: {} as Record<string, number>, ungatedPhases: 0, needsReview: 0 };
  const byId = new Map(tracker.programs.map((p) => [p.id, p]));

  const programs: PortfolioProgram[] = scope.map((id) => {
    const file = set.programs[id]!;
    const canonical = byId.get(id);
    const plan = planResolution({ phases: file.phases });
    const ev = pmEvidenceCoverage(events.events, id);
    counts.planResolution[plan] = (counts.planResolution[plan] ?? 0) + 1;
    counts.pmEvidenceCoverage[ev] = (counts.pmEvidenceCoverage[ev] ?? 0) + 1;
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
      pmEvidenceCoverage: ev,
      executionLink: "not linked (no phase scheduled into the Ratchet)",
      phaseCount: file.phases.length,
      gateCount: file.gates.length,
      ungatedPhases: ungated,
      needsReview: review,
      evidencePointers: events.events.filter((e) => e.program === id).map((e) => ({ date: e.date, kind: e.kind, ref: e.ref })),
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

  // Owner build plan, projected. Gate state is READ from the program files; the plan itself is
  // never reordered, re-scored, or completed by PM, and no next-phase recommendation is produced.
  const gateStatusOf = (gateId: string): string => {
    for (const prog of Object.values(set.programs)) {
      const g = prog.gates.find((x) => x.id === gateId);
      if (g) return g.status;
    }
    return "UNKNOWN";
  };
  const blockedByOf = (phaseId: string): string[] => {
    for (const prog of Object.values(set.programs)) {
      const p = prog.phases.find((x) => x.id === phaseId);
      if (p) return p.blockedBy;
    }
    return [];
  };
  const milestones = (buildPlan?.milestones ?? []).map((m) => {
    const satisfied = milestoneSatisfied(m, gateStatusOf);
    return {
      id: m.id,
      name: m.name,
      satisfied,
      requiredGates: m.requiredGates.map((gate) => ({ gate, status: gateStatusOf(gate) })),
      unlocksWave: m.unlocksWave,
      waveAuthorization: satisfied
        ? `${m.id} SATISFIED — ${m.unlocksWave} is owner-authorized by this plan.`
        : `WAITING FOR ${m.id}`,
      note: m.note,
    };
  });
  const authFor = (waveId: string): string => {
    const m = milestones.find((x) => x.unlocksWave === waveId);
    return m ? m.waveAuthorization : "OWNER-SELECTED";
  };
  const buildPlanProjection = buildPlan
    ? {
        sourceDirective: buildPlan.sourceDirective,
        status: buildPlan.status,
        rationale: buildPlan.rationale,
        waves: buildPlan.waves.map((w) => ({
          id: w.id,
          name: w.name,
          state: w.state,
          objective: w.objective,
          authorization: authFor(w.id),
          entries: w.entries.map((e) => ({
            program: e.program,
            range: `${e.startAt} → ${e.executeThrough}`,
            intent: entryIntent(e),
            emphasis: e.emphasis,
            blockState: entryBlockState(e, blockedByOf, gateStatusOf),
            targetGate: e.targetGate ?? null,
            targetGateStatus: e.targetGate ? gateStatusOf(e.targetGate) : null,
            holdAfter: e.holdAfter ?? null,
            resumeWhen: e.resumeWhen,
            note: e.note,
          })),
        })),
        milestones,
        lateMaturity: buildPlan.lateMaturity,
        interoperability: buildPlan.interoperability ?? null,
      }
    : { sourceDirective: "", status: "NONE — no owner build plan recorded", rationale: "", waves: [], milestones: [], lateMaturity: [], interoperability: null };

  return {
    schema: "vomega-pm-portfolio/1",
    sourceHead,
    seedDigest: digest({ scope, programs: [...scope].sort().map((id) => set.programs[id]) }),
    managedScope: scope,
    note: "Projection of the five owner-selected programs only. Canonical meaning is read from .project/meta-tracker.json; plan/evidence are derived; execution/proof state is owned by the ratchet and referenced live at check time. The build-plan section is OWNER-AUTHORED state, projected verbatim with derived gate state — PM never authors, ranks or reorders it. Do not hand-edit.",
    counts,
    crossProgramGates,
    buildPlan: buildPlanProjection,
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
  s.push(`Managed set: **${pf.managedScope.join(", ")}** — ${pf.counts.programs} programs.`);
  s.push("");
  s.push("| Dimension | Reading |");
  s.push("| --- | --- |");
  s.push(`| PM plan resolution | ${Object.entries(pf.counts.planResolution).map(([k, v]) => `${k} ${v}`).join(" · ")} — how deep PM plans each program |`);
  s.push(`| PM evidence coverage | ${Object.entries(pf.counts.pmEvidenceCoverage).map(([k, v]) => `${k} ${v}`).join(" · ")} — whether PM holds a **linked proof record**; *not* a claim about the project's evidence state |`);
  s.push("| Execution | not linked — no managed phase is scheduled into the Ratchet |");
  s.push("");
  s.push("Canonical state and real evidence live outside PM: current program state is read from `.project/meta-tracker.json`; execution and proof are owned by the Ω Proof Ratchet.");
  s.push("");
  s.push("## How PM scope expands");
  s.push("");
  s.push("**Only the owner (Owen) changes the managed set**, by editing `.project/pm/scope.json` and recording the instruction (see [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) §19). PM cannot add, remove, rank or propose a program: `pm:check` fails if scope and program files disagree (`OUT_OF_SCOPE_PROGRAM`, `MISSING_PROGRAM`, `UNKNOWN_MANAGED_PROGRAM`), and no view, score or suggestion changes scope. A newly added program earns a full dossier before it receives phases or gates.");
  s.push("");
  s.push("## Why these five (owner decision, not PM's)");
  s.push("");
  s.push("The owner selected these five as **development multipliers**: they accelerate work across many other programs rather than serving a single product dependency. MP-21 turns repository structure into source-bound machine-readable self-knowledge; MP-54 and MP-60 consume those stable identities (bundles and impact queries) instead of reparsing the repo; MP-55 and MP-56 convert failures and observed behavior into portable, reproducible test assets that feed MP-60. The selection is recorded in `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md` §1 and §4; PM did not choose it and cannot revisit it.");
  s.push("");
  s.push("## How work descends into execution and proof");
  s.push("");
  s.push("Phases are planning units. When a phase is selected for execution it descends: phase → work package → task → atomic task → proof. The executable layer in this repository is the **Ω Proof Ratchet** (`omega-baseline/experimental/ratchet/`), which computes task/gate/proof state from a spec and is the atomic execution/proof owner; `pm:check` references its state live and PM never stores a copy. No managed phase is currently scheduled into Ratchet tasks, so no phase below is claimed as running — a green plan is not execution.");
  s.push("");
  s.push("| ID | Program | Canonical state (META-TRACKER) | PM plan | Execution | PM evidence coverage | Phases | Gates |");
  s.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const p of pf.programs) {
    s.push(`| ${p.id} | ${cell(p.name)} | ${cell(p.canonicalState ?? "—")} | ${p.planResolution} | not linked | ${p.pmEvidenceCoverage} | ${p.phaseCount} | ${p.gateCount} |`);
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
    o.push(`**Canonical state (META-TRACKER):** ${p.canonicalState ?? "—"}`, `**PM plan resolution:** ${p.planResolution} (how deep PM plans this program)`, `**Execution link:** ${p.executionLink}`, `**PM evidence coverage:** ${p.pmEvidenceCoverage} (whether PM holds a linked proof record — not the project's evidence state)`, `**Why it exists (canonical):** ${p.purpose}`, "");
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
    o.push("## Evidence pointers", "");
    o.push(`- canonical identity/state/priority: \`.project/meta-tracker.json\` (program row, read live at generation time)`);
    for (const ev of p.evidencePointers) o.push(`- ${ev.date} ${ev.kind} — \`${ev.ref}\``);
    o.push(`- **PM evidence coverage:** ${p.pmEvidenceCoverage} — evidence events live in \`.project/pm/data/evidence-events.json\`; only a \`proof\` event links one. This says nothing about whether the program is proven: canonical state is in \`.project/meta-tracker.json\`, and execution/proof state is owned by the Ω Proof Ratchet (\`omega-baseline/experimental/ratchet/\`), referenced live by \`pm:check\` and never stored here.`);
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

  // BUILD-PLAN.md — the owner-authored execution overlay, projected with derived gate state.
  if (pf.buildPlan.waves.length) {
    const b: string[] = ["# BUILD-PLAN — owner-selected waves", "", PROVENANCE(pf), ""];
    b.push("> **Owner-authored coordination state.** This records what Owen selected to execute, where to stop, and which convergence point opens the next fan-out. The dependency graph says what *can* happen; this says what was *chosen*. PM never ranks, scores, reorders, or recommends a next step — a \"recommended next\" is deliberately not rendered.");
    b.push("");
    b.push(`Status: **${pf.buildPlan.status}** · Directive: \`${pf.buildPlan.sourceDirective}\``);
    b.push("");
    b.push(`Rationale: ${pf.buildPlan.rationale}`);
    b.push("");
    for (const w of pf.buildPlan.waves) {
      b.push(`## ${w.id} — ${w.name}${w.state === "seeded-later" ? " *(seeded for later; not currently authorized)*" : ""}`, "");
      b.push(w.objective, "");
      b.push(`Authorization: **${w.authorization}**`, "");
      b.push("| Program | Execute | Intent | Emphasis | Gate state | Target gate | Hold after | Resume when |");
      b.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
      for (const e of w.entries) {
        const tg = e.targetGate ? `${e.targetGate} (${e.targetGateStatus})` : "—";
        const intent = e.intent === "EXECUTE_THEN_HOLD" ? "execute, then **HOLD**" : "continue";
        b.push(`| ${e.program} | ${e.range} | ${intent} | ${e.emphasis} | ${e.blockState} | ${tg} | ${e.holdAfter ?? "—"} | ${e.resumeWhen.join(", ") || "—"} |`);
      }
      b.push("");
      for (const e of w.entries) if (e.note) b.push(`- ${e.program}: ${e.note}`);
      b.push("");
    }
    if (pf.buildPlan.milestones.length) {
      b.push("## Convergence milestones", "");
      for (const m of pf.buildPlan.milestones) {
        b.push(`**${m.id} — ${m.name}** — ${m.satisfied ? "SATISFIED" : "NOT SATISFIED"}`, "");
        for (const g of m.requiredGates) b.push(`- [${g.status === "SATISFIED" ? "x" : " "}] ${g.gate} — ${g.status}`);
        b.push("");
        b.push(`Unlocks ${m.unlocksWave}: ${m.waveAuthorization}`, "");
      }
    }
    if (pf.buildPlan.lateMaturity.length) {
      b.push("## Late maturity (explicitly not in any current wave)", "");
      for (const l of pf.buildPlan.lateMaturity) b.push(`- **${l.program}** ${l.phases.join(", ")} — ${l.condition}`);
      b.push("");
    }
    if (pf.buildPlan.interoperability) {
      b.push("## Shared interoperability requirement", "", pf.buildPlan.interoperability.requirement, "", pf.buildPlan.interoperability.note, "");
    }
    out["BUILD-PLAN.md"] = b.join("\n") + "\n";
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
