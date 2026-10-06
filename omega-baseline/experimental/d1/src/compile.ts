// Interpretation → registration / draft / edit, and draft → canonical
// UseCommand (Phases C and D semantics). STUB.
//
// Expected approach (harvest first): adapt plugins/vivim-nlcl-pure — map the
// D1 World to an nlcl WorldModel (accounts as entities, prompt.send@1 as an op
// with a capability-contributed frame), call interpret(), then lift the
// Interpretation into an InterpretationResult. Do not rewrite the interpreter
// to fit a preferred architecture; the corpus already proves explicit-target
// precedence, ambiguity preservation and replay on it.
import type { Interpretation, WorldModel } from "../../../plugins/vivim-nlcl-pure/src/index.ts";
import type { D1State, InterpretationResult, UseCommand, Validation, World } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

/** D1-021/025: project a D1 World into the interpreter's grounding target. */
export function toInterpreterWorld(world: World): WorldModel {
  return notImplemented("D1-025", `toInterpreterWorld(${world.id})`);
}

/** D1-020..028: interpret revision `n` of the session against the current World. Pure. */
export function interpretRevision(state: D1State, n: number): InterpretationResult {
  return notImplemented("D1-021", `interpretRevision(revision ${n}: ${JSON.stringify(state.revisions[n - 1]?.text ?? "")})`);
}

/** D1-024/027: fold draft + semantic edits into the candidate canonical command (null if no draft). */
export function currentCommand(state: D1State): UseCommand | null {
  return notImplemented("D1-024", `currentCommand(active revision ${state.active})`);
}

/**
 * D1-029: deterministic command identity. Must exclude presentation provenance
 * (edit `via`, the revision number of a correction) so typed and clicked
 * corrections converge, and must include World basis, capability, route and
 * params so semantically different commands never collide.
 * It must also exclude `authority.decision`: consent is given FOR a digest, so
 * granting consent cannot change the identity it was granted for.
 */
export function commandDigest(cmd: UseCommand): string {
  return notImplemented("D1-029", `commandDigest(${cmd.capability})`);
}

/** D1-005/061: READY law over the session's current command (includes authority state). */
export function validation(state: D1State): Validation {
  return notImplemented("D1-005", `validation(active revision ${state.active})`);
}

/** Optional helper for tests and tools: the raw interpreter output for one revision. */
export function rawInterpretation(state: D1State, n: number): Interpretation {
  return notImplemented("D1-025", `rawInterpretation(${n})`);
}
