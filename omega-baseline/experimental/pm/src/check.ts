#!/usr/bin/env bun
// pm — validate and project the owner-managed PM scope.
//
//   bun run pm            regenerate .project/pm/generated/*
//   bun run pm:check      validate references + scope, and fail if any generated view is stale
//
// Authority (owner correction, PM-CORRECTION-FIRST-FIVE-ONLY.md): PM manages EXACTLY the five
// programs declared in .project/pm/scope.json. It has no decisioning authority — it never
// chooses, ranks, adds, drops, activates or redesigns programs. A program file outside scope,
// a scope program with no file, a dangling reference, or a hand-edited generated view is a
// FAILURE, not a warning.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Events, ProgramFile, Scope, BuildPlan, bannedRootKeys } from "./schema.ts";
import type { Events as EventsT, ProgramFile as ProgramFileT, Scope as ScopeT, BuildPlan as BuildPlanT } from "./schema.ts";
import { buildPortfolio, gitHead, paths, renderViews, stripVolatileHead, stripVolatileHeadMd, writeViews } from "./project.ts";
import type { ManagedSet, Portfolio } from "./project.ts";
import type { Tracker } from "./project.ts";

interface RawFile { name: string; raw: unknown }

interface Report {
  problems: string[];
  warnings: string[];
  set?: ManagedSet;
  events?: EventsT;
  scope?: ScopeT;
}

const GATE_RE = /^MP(\d{2})-G\d+$/;
const PHASE_RE = /^MP(\d{2})-P\d+$/;
const digitsOf = (id: string): string => id.replace(/^MP-?/, "").replace(/\D/g, "").slice(-2);

/**
 * Pure validation over raw parsed JSON. Enforces: strict schema, scope == file set exactly,
 * reference integrity across the managed set, external references that are real but unmanaged,
 * and evidence events that only concern managed programs.
 */
export function validate(rawFiles: RawFile[], rawEvents: unknown, scopeRaw: unknown, tracker: Tracker): Report {
  const problems: string[] = [];
  const warnings: string[] = [];

  const scopeParsed = Scope.safeParse(scopeRaw);
  if (!scopeParsed.success) {
    for (const i of scopeParsed.error.issues) problems.push(`SCOPE_INVALID ${i.path.join(".") || "$"}: ${i.message}`);
    return { problems, warnings };
  }
  const scope = scopeParsed.data;
  const managed = new Set(scope.managedPrograms);
  const trackerIds = new Set((tracker.programs ?? []).map((p) => p.id));
  for (const id of managed) if (!trackerIds.has(id)) problems.push(`UNKNOWN_MANAGED_PROGRAM ${id} — declared in scope.json but not in meta-tracker.json`);

  // 1. schema per file (canonical meaning keys are banned at file root; dossier owns meaning).
  const parsed: { name: string; file: ProgramFileT }[] = [];
  for (const f of rawFiles) {
    for (const p of bannedRootKeys(f.raw)) problems.push(`BANNED_KEY ${f.name}.${p} — canonical tracker fields are read from meta-tracker.json, never stored in PM`);
    const r = ProgramFile.safeParse(f.raw);
    if (!r.success) for (const i of r.error.issues) problems.push(`PROGRAM_INVALID ${f.name} ${i.path.join(".") || "$"}: ${i.message}`);
    else parsed.push({ name: f.name, file: r.data });
  }

  // 2. scope == managed set, exactly.
  const seen = new Map<string, string>();
  for (const { name, file } of parsed) {
    if (!managed.has(file.id)) problems.push(`OUT_OF_SCOPE_PROGRAM ${file.id} (${name}) — PM manages only ${scope.managedPrograms.join(", ")}`);
    if (name !== `${file.id}.json`) problems.push(`FILE_ID_MISMATCH ${name} claims ${file.id}`);
    if (seen.has(file.id)) problems.push(`DUPLICATE_PROGRAM ${file.id} (also in ${seen.get(file.id)})`);
    else seen.set(file.id, name);
  }
  for (const id of managed) if (!seen.has(id)) problems.push(`MISSING_PROGRAM ${id} — declared in scope.json but has no program file`);

  // 3. evidence events.
  const parsedEvents = Events.safeParse(rawEvents);
  if (!parsedEvents.success) for (const i of parsedEvents.error.issues) problems.push(`EVENTS_INVALID ${i.path.join(".") || "$"}: ${i.message}`);

  if (problems.length || parsed.length !== managed.size) return { problems, warnings, scope };

  // From here the managed set is complete, so cross-file references are checkable.
  const set: ManagedSet = { programs: {} };
  for (const { file } of parsed) set.programs[file.id] = file;

  const gateIds = new Set<string>();
  const phaseIds = new Set<string>();
  const gateOwner = new Map<string, string>();
  const phaseOwner = new Map<string, string>();
  for (const [pid, prog] of Object.entries(set.programs)) {
    for (const g of prog.gates) {
      const m = GATE_RE.exec(g.id);
      if (!m) problems.push(`BAD_GATE_ID ${pid}.${g.id}`);
      else if (m[1] !== digitsOf(pid)) problems.push(`GATE_PREFIX ${g.id} does not belong to ${pid}`);
      if (gateIds.has(g.id)) problems.push(`DUPLICATE_GATE ${g.id}`);
      gateIds.add(g.id);
      gateOwner.set(g.id, pid);
    }
    for (const ph of prog.phases) {
      const m = PHASE_RE.exec(ph.id);
      if (!m) problems.push(`BAD_PHASE_ID ${pid}.${ph.id}`);
      else if (m[1] !== digitsOf(pid)) problems.push(`PHASE_PREFIX ${ph.id} does not belong to ${pid}`);
      if (phaseIds.has(ph.id)) problems.push(`DUPLICATE_PHASE ${ph.id}`);
      phaseIds.add(ph.id);
      phaseOwner.set(ph.id, pid);
    }
  }

  for (const [pid, prog] of Object.entries(set.programs)) {
    for (const ph of prog.phases) {
      for (const ref of ph.blockedBy) if (!gateIds.has(ref)) problems.push(`DANGLING_GATE_REF ${ph.id} blockedBy -> ${ref}`);
      for (const ref of ph.exitGates) if (!gateIds.has(ref)) problems.push(`DANGLING_GATE_REF ${ph.id} exitGates -> ${ref}`);
    }
    for (const g of prog.gates) {
      if (!phaseIds.has(g.producingPhase)) problems.push(`DANGLING_PHASE_REF ${g.id} producingPhase -> ${g.producingPhase}`);
      else if (phaseOwner.get(g.producingPhase) !== pid) problems.push(`GATE_OWNER ${g.id} produces from ${g.producingPhase} but is declared in ${pid}`);
      for (const ref of g.consumers) if (!gateIds.has(ref) && !phaseIds.has(ref)) problems.push(`DANGLING_CONSUMER_REF ${g.id} consumers -> ${ref}`);
    }
    for (const ext of prog.externalDependencies) {
      if (!trackerIds.has(ext.ref)) problems.push(`UNKNOWN_EXTERNAL_REF ${pid} -> ${ext.ref} (not in meta-tracker.json)`);
      if (managed.has(ext.ref)) problems.push(`EXTERNAL_REF_IS_MANAGED ${pid} -> ${ext.ref} — managed programs must be referenced by gate, not as external dependencies`);
    }
    const ungated = prog.phases.filter((ph) => ph.exitGates.length === 0).map((ph) => ph.id);
    if (ungated.length) warnings.push(`UNGATED_PHASES ${pid}: ${ungated.join(", ")}`);
    const review = prog.phases.filter((ph) => ph.needsReview).map((ph) => ph.id);
    if (review.length) warnings.push(`NEEDS_REVIEW ${pid}: ${review.join(", ")} (E5 decomposition review before execution)`);
  }

  if (parsedEvents.success) {
    for (const e of parsedEvents.data.events) {
      if (!managed.has(e.program)) problems.push(`EVENT_OUT_OF_SCOPE ${e.program} — PM evidence events concern the managed five only`);
      if (e.gate && !gateIds.has(e.gate)) problems.push(`DANGLING_GATE_REF evidence ${e.program} -> ${e.gate}`);
    }
  }

  return { problems, warnings, set, events: parsedEvents.success ? parsedEvents.data : undefined, scope };
}

function readJson(path: string, label: string): unknown {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

/**
 * Validate the OWNER build plan against the managed set. It checks references and shape only —
 * never whether the plan is optimal, sensible, or could be improved. Decisioning fields are
 * rejected by the strict schema; this function proves no reference dangles.
 */
export function validateBuildPlan(
  raw: unknown,
  managed: Set<string>,
  phaseOwner: Map<string, string>,
  gateIds: Set<string>,
  programIds: Set<string>,
): { problems: string[]; plan?: BuildPlanT } {
  const problems: string[] = [];
  const parsed = BuildPlan.safeParse(raw);
  if (!parsed.success) {
    for (const i of parsed.error.issues) problems.push(`BUILD_PLAN_INVALID ${i.path.join(".") || "$"}: ${i.message}`);
    return { problems };
  }
  const plan = parsed.data;

  const waveIds = new Set<string>();
  for (const w of plan.waves) {
    if (waveIds.has(w.id)) problems.push(`DUPLICATE_WAVE ${w.id}`);
    waveIds.add(w.id);
    for (const e of w.entries) {
      if (!managed.has(e.program)) problems.push(`BUILD_PLAN_OUT_OF_SCOPE ${w.id} → ${e.program} — PM manages only ${[...managed].join(", ")}`);
      if (!programIds.has(e.program)) problems.push(`UNKNOWN_PROGRAM ${w.id} → ${e.program}`);
      for (const [field, phaseId] of [["startAt", e.startAt], ["executeThrough", e.executeThrough], ["holdAfter", e.holdAfter]] as const) {
        if (!phaseId) continue;
        if (!phaseOwner.has(phaseId)) problems.push(`UNKNOWN_PHASE ${w.id} ${e.program} ${field} → ${phaseId}`);
        else if (phaseOwner.get(phaseId) !== e.program) problems.push(`PHASE_PROGRAM_MISMATCH ${w.id} ${e.program} ${field} → ${phaseId} belongs to ${phaseOwner.get(phaseId)}`);
      }
      if (e.targetGate && !gateIds.has(e.targetGate)) problems.push(`UNKNOWN_GATE ${w.id} ${e.program} targetGate → ${e.targetGate}`);
      for (const r of e.resumeWhen) {
        if (!gateIds.has(r) && !programIds.has(r)) problems.push(`UNKNOWN_RESUME_REF ${w.id} ${e.program} resumeWhen → ${r}`);
      }
    }
  }

  const milestoneIds = new Set<string>();
  for (const m of plan.milestones) {
    if (milestoneIds.has(m.id)) problems.push(`DUPLICATE_MILESTONE ${m.id}`);
    milestoneIds.add(m.id);
    for (const g of m.requiredGates) if (!gateIds.has(g)) problems.push(`UNKNOWN_GATE ${m.id} requiredGates → ${g}`);
    if (!waveIds.has(m.unlocksWave)) problems.push(`UNKNOWN_WAVE_REF ${m.id} unlocksWave → ${m.unlocksWave}`);
  }

  for (const l of plan.lateMaturity) {
    if (!managed.has(l.program)) problems.push(`BUILD_PLAN_OUT_OF_SCOPE lateMaturity → ${l.program}`);
    for (const ph of l.phases) {
      if (!phaseOwner.has(ph)) problems.push(`UNKNOWN_PHASE lateMaturity ${l.program} → ${ph}`);
      else if (phaseOwner.get(ph) !== l.program) problems.push(`PHASE_PROGRAM_MISMATCH lateMaturity ${l.program} → ${ph}`);
    }
  }

  return { problems, plan };
}

const sameText = (a: string, b: string): boolean => a.replace(/\r\n/g, "\n") === b.replace(/\r\n/g, "\n");

function printRatchetReference(): void {
  const p = join(paths.root, ".project/evidence/d1-ratchet.json");
  if (!existsSync(p)) return;
  try {
    const r = JSON.parse(readFileSync(p, "utf8")) as {
      spec?: string;
      probe?: { head?: string; totals?: { pass?: number; gates?: number } };
      summary?: Record<string, number>;
    };
    const t = r.probe?.totals ?? {};
    const s = r.summary ?? {};
    process.stdout.write(
      `ref ratchet:${r.spec ?? "?"} @ ${r.probe?.head ?? "?"} — ${t.pass ?? "?"}/${t.gates ?? "?"} gates green; ` +
        `DONE ${s.DONE ?? 0} · PROVEN ${s.PROVEN ?? 0} · OPEN ${s.OPEN ?? 0} · BLOCKED ${s.BLOCKED ?? 0} ` +
        `(execution/proof owner — referenced live, never stored)\n`,
    );
  } catch {
    /* a malformed evidence file is not the PM layer's failure to raise */
  }
}

export function main(argv: string[]): number {
  const cmd = argv[0] ?? "project";
  const check = cmd === "check" || argv.includes("--check");
  const tracker = readJson(paths.tracker, "meta-tracker") as Tracker;
  const scopeRaw = readJson(paths.scope, "scope");
  const eventsRaw = readJson(paths.events, "events");
  const rawFiles: RawFile[] = readdirSync(paths.programsDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((name) => ({ name, raw: JSON.parse(readFileSync(join(paths.programsDir, name), "utf8")) }));

  const report = validate(rawFiles, eventsRaw, scopeRaw, tracker);
  for (const w of report.warnings) process.stdout.write(`warn ${w}\n`);

  const problems = [...report.problems];

  // Owner build plan (optional): validate references against the managed set; never judge it.
  let buildPlan: BuildPlanT | null = null;
  if (report.set && report.scope) {
    const managed = new Set(report.scope.managedPrograms);
    const phaseOwner = new Map<string, string>();
    const gateIds = new Set<string>();
    for (const [pid, prog] of Object.entries(report.set.programs)) {
      for (const ph of prog.phases) phaseOwner.set(ph.id, pid);
      for (const g of prog.gates) gateIds.add(g.id);
    }
    const programIds = new Set((tracker.programs ?? []).map((p) => p.id));
    if (existsSync(paths.buildPlan)) {
      const bp = validateBuildPlan(readJson(paths.buildPlan, "build-plan"), managed, phaseOwner, gateIds, programIds);
      problems.push(...bp.problems);
      buildPlan = bp.plan ?? null;
    }
  }

  if (report.set && report.events && report.scope) {
    const pf: Portfolio = buildPortfolio(report.set, report.scope.managedPrograms, tracker, report.events, buildPlan, gitHead());
    const contents = renderViews(pf);
    if (!check) {
      writeViews(contents);
      process.stdout.write(`wrote ${Object.keys(contents).length} generated file(s) under .project/pm/generated/\n`);
    } else {
      const fresh = new Set(Object.keys(contents));
      const walk = (dir: string, prefix: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(join(dir, e.name), `${prefix}${e.name}/`) : [`${prefix}${e.name}`],
        );
      for (const found of walk(paths.outDir, "")) {
        const foundRel = found.replace(/\\/g, "/");
        if (!fresh.has(foundRel)) problems.push(`PROJECTION_ORPHAN generated/${foundRel} — not produced by the current projector; a stale view must never persist (delete it, then run: bun run pm)`);
      }
      for (const [name, freshContent] of Object.entries(contents)) {
        const target = join(paths.outDir, name);
        const norm = (t: string): string => (name.endsWith(".json") ? stripVolatileHead(t) : stripVolatileHeadMd(t));
        if (!existsSync(target)) problems.push(`PROJECTION_MISSING generated/${name} — run: bun run pm`);
        else if (!sameText(norm(readFileSync(target, "utf8")), norm(freshContent))) problems.push(`PROJECTION_STALE generated/${name} — run: bun run pm`);
      }
    }
  }

  if (check) printRatchetReference();

  if (problems.length) {
    for (const p of problems) process.stdout.write(`FAIL ${p}\n`);
    process.stdout.write(`pm ${cmd}: ${problems.length} problem(s)\n`);
    return 1;
  }
  process.stdout.write(`pm ${cmd}: ok (${report.warnings.length} warning(s))${check ? "" : ", views regenerated"}\n`);
  return 0;
}

if (import.meta.main) process.exit(main(process.argv.slice(2)));
