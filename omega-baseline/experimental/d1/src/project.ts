// Pure semantic projector (Phase E, D1-040/041/051). STUB.
// The projection is the ONLY thing a surface consumes. It must be a pure
// function of state and must never parse raw language. Changing `treatment`
// may change `presentation` and nothing else.
import type { D1State, Projection } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export interface ProjectOptions { treatment?: "compact" | "detailed" | string }

export function project(state: D1State, opts: ProjectOptions = {}): Projection {
  return notImplemented("D1-041", `project(revision ${state.active}, treatment ${opts.treatment ?? "default"})`);
}
