// Replay bundle, runner and semantic diff (D1-070..073). STUB.
// A bundle pins the World fixture, versions and the semantic action log
// (inputs, edits, consent, commit, execute) — never interpreter outputs, which
// replay recomputes. See session.ts run() for the fold primitive.
import type { D1State, ReplayBundle, ReplayResult, SemanticDifference } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export function bundle(state: D1State): ReplayBundle {
  return notImplemented("D1-070", `bundle(${state.log.length} actions)`);
}

export function replay(b: ReplayBundle): ReplayResult {
  return notImplemented("D1-071", `replay(${b.actions.length} actions)`);
}

/** Differences by semantic path (e.g. "command.account") before prose or pixels. */
export function semanticDiff(a: D1State, b: D1State): SemanticDifference[] {
  return notImplemented("D1-073", `semanticDiff(${a.active}, ${b.active})`);
}
