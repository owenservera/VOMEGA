// Contextual Wiki/help: Reflection + World + active semantic state (D1-050..054, D1-059). STUB.
// No separately authored help database may be authoritative. Every claim must
// carry at least one ground; anything that cannot be grounded goes to `unknowns`.
import type { D1State, HelpAnswer, HelpQuestion, ReflectionGraph } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export function help(state: D1State, question: HelpQuestion, reflection?: ReflectionGraph): HelpAnswer {
  void reflection;
  return notImplemented("D1-052", `help(${question}, revision ${state.active})`);
}
