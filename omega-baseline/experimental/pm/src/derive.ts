// Derived PM state. Nothing here is stored: plan resolution and evidence state are
// functions of the seed and the append-only evidence events, so they cannot silently
// drift from the plan. Execution/proof state is NOT derived here — the ratchet owns it.
import type { BuildEntry, EvidenceEvent, EvidenceState, Milestone, Phase, PlanLevel } from "./schema.ts";

/** Structural input to plan resolution. v0 seeds omit workPackages; v0.1 adds them. */
export interface PlanInput {
  phases: Phase[];
  /** Present only once a program is scheduled; each entry may carry a resolvable ratchet taskRef. */
  workPackages?: { taskRef?: string | null }[];
}

/** A phase is complete when it has a grade, a size band and at least one exit gate. */
export function isCompletePhase(p: Phase): boolean {
  return Boolean(p.effort) && Boolean(p.loc) && p.exitGates.length > 0;
}

/**
 * Plan resolution, highest predicate that holds. "Rough" is not a judgement call:
 * a phase either passes the mechanical completeness test or it does not.
 */
export function planResolution(p: PlanInput): PlanLevel {
  const phases = p.phases ?? [];
  if (phases.length === 0) return "REGISTERED";
  if (!phases.every(isCompletePhase)) return "SEEDED";
  const wps = p.workPackages ?? [];
  if (wps.length === 0) return "PHASED";
  if (wps.some((w) => Boolean(w.taskRef))) return "EXECUTABLE";
  return "DECOMPOSED";
}

/**
 * PM evidence COVERAGE — not the project's evidence state. It answers one narrow question:
 * "does PM hold a linked proof record for this program?" and is deliberately incapable of
 * reading as "this program is unproven". The project's actual state lives in the canonical
 * tracker; execution/proof state lives in the ratchet. Neither is derived here.
 */
export function pmEvidenceCoverage(events: EvidenceEvent[], programId: string): EvidenceState {
  const mine = events.filter((e) => e.program === programId);
  if (mine.some((e) => e.kind === "regressed")) return "REGRESSION_REPORTED";
  if (mine.some((e) => e.kind === "proof")) return "PROOF_LINKED";
  return "NO_LINKED_PROOF";
}

// ---------------------------------------------------------------- build plan derivation

export const GATE_SATISFIED = "SATISFIED";

/**
 * BLOCKED vs HOLD — the distinction the owner directive requires.
 * BLOCKED: a required technical gate on the entry's start phase is unsatisfied.
 * HOLD: the owner chose a stopping boundary, so deeper work is intentionally not selected
 * even though it may be technically possible. Neither state says "start now": PM never
 * chooses a next phase.
 */
export type EntryBlockState = "BLOCKED" | "UNBLOCKED";
export type EntryIntent = "CONTINUE" | "EXECUTE_THEN_HOLD";

export function entryIntent(entry: BuildEntry): EntryIntent {
  return entry.holdAfter ? "EXECUTE_THEN_HOLD" : "CONTINUE";
}

export function entryBlockState(
  entry: BuildEntry,
  blockedByOf: (phaseId: string) => string[],
  gateStatus: (gateId: string) => string,
): EntryBlockState {
  return blockedByOf(entry.startAt).some((g) => gateStatus(g) !== GATE_SATISFIED) ? "BLOCKED" : "UNBLOCKED";
}

/** A milestone is satisfied only when EVERY required gate is SATISFIED. It never mutates gate state. */
export function milestoneSatisfied(m: Milestone, gateStatus: (gateId: string) => string): boolean {
  return m.requiredGates.length > 0 && m.requiredGates.every((g) => gateStatus(g) === GATE_SATISFIED);
}
