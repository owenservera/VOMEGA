#!/usr/bin/env bun
// pm — validate and project the PM decomposition seed.
//
//   bun run pm                 regenerate .project/pm/generated/*
//   bun run pm:check           validate references + fail if generated output is stale
//
// PM owns no program meaning and no execution/proof state. This validator makes the
// non-duplication boundary mechanical: a banned meaning key, a dangling program/gate ref
// or a stale hand-edited projection is a failure, not a warning.
import { existsSync, readFileSync } from "node:fs";
import { Events, Seed, bannedProgramKeys } from "./schema.ts";
import type { Seed as SeedT, Events as EventsT } from "./schema.ts";
import { planResolution } from "./derive.ts";
import { gitHead, paths, projectSource, writeProjection } from "./project.ts";
import type { Tracker } from "./project.ts";

interface Report {
  problems: string[];
  warnings: string[];
}

const MP_RE = /^MP-\d{2}$/;
const GATE_RE = /^MP(\d{2})-G\d+$/;
const PHASE_RE = /^MP(\d{2})-P\d+$/;

const digitsOf = (id: string): string => id.replace(/^MP-?/, "").replace(/\D/g, "").slice(-2);

/** Pure validation over raw parsed JSON. Returns every problem and warning; never throws. */
export function validate(rawSeed: unknown, rawEvents: unknown, tracker: Tracker): Report & { seed?: SeedT; events?: EventsT } {
  const problems: string[] = [];
  const warnings: string[] = [];

  // 1. program-meaning keys before schema parsing, so the reason is precise.
  for (const p of bannedProgramKeys(rawSeed)) {
    problems.push(`BANNED_KEY ${p} — program meaning belongs to .project/meta-tracker.json, not the PM seed`);
  }

  // 2. strict schema (rejects any unknown key, including a banned one not pre-scanned).
  const parsedSeed = Seed.safeParse(rawSeed);
  if (!parsedSeed.success) {
    for (const i of parsedSeed.error.issues) problems.push(`SEED_INVALID ${i.path.join(".") || "$"}: ${i.message}`);
  }
  const parsedEvents = Events.safeParse(rawEvents);
  if (!parsedEvents.success) {
    for (const i of parsedEvents.error.issues) problems.push(`EVENTS_INVALID ${i.path.join(".") || "$"}: ${i.message}`);
  }
  if (!parsedSeed.success || !parsedEvents.success) return { problems, warnings };

  const seed = parsedSeed.data;
  const events = parsedEvents.data;
  const trackerIds = new Set(tracker.programs.map((p) => p.id));

  // 3. program keys, and per-program id shapes.
  const gateIds = new Set<string>();
  const phaseIds = new Set<string>();
  for (const [pid, prog] of Object.entries(seed.programs)) {
    if (!MP_RE.test(pid)) problems.push(`BAD_PROGRAM_ID "${pid}" — expected MP-xx`);
    if (!trackerIds.has(pid)) problems.push(`UNKNOWN_PROGRAM ${pid} — not in .project/meta-tracker.json`);
    for (const g of prog.gates) {
      const m = GATE_RE.exec(g.id);
      if (!m) problems.push(`BAD_GATE_ID ${pid}.${g.id} — expected MPxx-Gn`);
      else if (m[1] !== digitsOf(pid)) problems.push(`GATE_PREFIX ${g.id} does not belong to ${pid}`);
      if (gateIds.has(g.id)) problems.push(`DUPLICATE_GATE ${g.id}`);
      gateIds.add(g.id);
    }
    for (const ph of prog.phases) {
      const m = PHASE_RE.exec(ph.id);
      if (!m) problems.push(`BAD_PHASE_ID ${pid}.${ph.id} — expected MPxx-Pn`);
      else if (m[1] !== digitsOf(pid)) problems.push(`PHASE_PREFIX ${ph.id} does not belong to ${pid}`);
      if (phaseIds.has(ph.id)) problems.push(`DUPLICATE_PHASE ${ph.id}`);
      phaseIds.add(ph.id);
    }
  }

  // 4. reference resolution. blockedBy/exitGates must be gates; consumers may be phase or gate.
  for (const [pid, prog] of Object.entries(seed.programs)) {
    for (const ph of prog.phases) {
      for (const ref of ph.blockedBy) if (!gateIds.has(ref)) problems.push(`DANGLING_GATE_REF ${ph.id} blockedBy -> ${ref}`);
      for (const ref of ph.exitGates) if (!gateIds.has(ref)) problems.push(`DANGLING_GATE_REF ${ph.id} exitGates -> ${ref}`);
    }
    for (const g of prog.gates) {
      for (const ref of g.consumers) if (!gateIds.has(ref) && !phaseIds.has(ref)) problems.push(`DANGLING_CONSUMER_REF ${g.id} consumers -> ${ref}`);
    }
  }

  // 5. evidence events.
  for (const e of events.events) {
    if (!trackerIds.has(e.program)) problems.push(`UNKNOWN_PROGRAM ${e.program} (evidence event)`);
    if (e.gate && !gateIds.has(e.gate)) problems.push(`DANGLING_GATE_REF evidence ${e.program} -> ${e.gate}`);
  }

  // 6. warnings — derived-vs-hint, and the audit gaps the seed deliberately carries.
  for (const [pid, prog] of Object.entries(seed.programs)) {
    const derived = planResolution({ phases: prog.phases });
    if (prog.maturityHint && prog.maturityHint !== derived) {
      warnings.push(`HINT_MISMATCH ${pid}: maturityHint ${prog.maturityHint} but derived ${derived}`);
    }
    const ungated = prog.phases.filter((ph) => ph.exitGates.length === 0).map((ph) => ph.id);
    if (ungated.length) warnings.push(`UNGATED_PHASES ${pid}: ${ungated.join(", ")}`);
    const review = prog.phases.filter((ph) => ph.needsReview).map((ph) => ph.id);
    if (review.length) warnings.push(`NEEDS_REVIEW ${pid}: ${review.join(", ")} (decomposition review required)`);
  }

  return { problems, warnings, seed, events };
}

function readJson(path: string, label: string): unknown {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

const sameText = (a: string, b: string): boolean => a.replace(/\r\n/g, "\n") === b.replace(/\r\n/g, "\n");

export function main(argv: string[]): number {
  const cmd = argv[0] ?? "project";
  const check = cmd === "check" || argv.includes("--check");
  const tracker = readJson(paths.tracker, "meta-tracker") as Tracker;
  const rawSeed = readJson(paths.seed, "seed");
  const rawEvents = readJson(paths.events, "events");

  const report = validate(rawSeed, rawEvents, tracker);
  for (const w of report.warnings) process.stdout.write(`warn ${w}\n`);

  const problems = [...report.problems];
  if (report.seed && report.events) {
    const head = gitHead();
    const fresh = projectSource(report.seed, tracker, report.events, head);
    if (!check) {
      writeProjection(fresh);
      process.stdout.write(`wrote ${paths.outMd.replace(paths.root, ".")} and ${paths.outJson.replace(paths.root, ".")}\n`);
    } else {
      // A hand-edited projection is a failure: generated output is not a source.
      if (!existsSync(paths.outMd) || !sameText(readFileSync(paths.outMd, "utf8"), fresh.md)) problems.push(`PROJECTION_STALE ${paths.outMd.replace(paths.root, ".")} — run: bun run pm`);
      if (!existsSync(paths.outJson) || !sameText(readFileSync(paths.outJson, "utf8"), fresh.json)) problems.push(`PROJECTION_STALE ${paths.outJson.replace(paths.root, ".")} — run: bun run pm`);
    }
  }

  if (problems.length) {
    for (const p of problems) process.stdout.write(`FAIL ${p}\n`);
    process.stdout.write(`pm ${cmd}: ${problems.length} problem(s)\n`);
    return 1;
  }
  process.stdout.write(`pm ${cmd}: ok (${report.warnings.length} warning(s))${check ? "" : ", projection regenerated"}\n`);
  return 0;
}

if (import.meta.main) process.exit(main(process.argv.slice(2)));
