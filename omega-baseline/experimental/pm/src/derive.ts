// Derived PM state. Nothing here is stored: plan resolution and evidence state are
// functions of the seed and the append-only evidence events, so they cannot silently
// drift from the plan. Execution/proof state is NOT derived here — the ratchet owns it.
import type { EvidenceEvent, EvidenceState, Phase, PlanLevel } from "./schema.ts";

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
 * Evidence state, independent of plan resolution. Only a `proof` event promotes to
 * EVIDENCED; reconnaissance (`source-inspected`) never does.
 */
export function evidenceState(events: EvidenceEvent[], programId: string): EvidenceState {
  const mine = events.filter((e) => e.program === programId);
  if (mine.some((e) => e.kind === "regressed")) return "REGRESSED";
  if (mine.some((e) => e.kind === "proof")) return "EVIDENCED";
  return "UNPROVEN";
}
