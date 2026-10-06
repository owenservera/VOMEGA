// Small journey helpers shared by gate files. They only call the D1 port.
import type { D1State, InterpretationResult, World } from "../../src/index.ts";
import { dispatch, initialState, loadNamedWorld, loadWorld, readWorldFile, say } from "../../src/index.ts";

export const WORK = "account:claude-work";
export const PERSONAL = "account:claude-personal";
export const PROMPT = "Ask Claude to explain this error: build failed";

export function world(id: string, patch: Record<string, unknown> = {}): World {
  if (!Object.keys(patch).length) return loadNamedWorld(id);
  return loadWorld({ ...(readWorldFile(id) as object), ...patch });
}

export function start(id: string, patch: Record<string, unknown> = {}): D1State {
  return initialState(world(id, patch));
}

export function says(s: D1State, ...texts: string[]): D1State {
  for (const t of texts) s = say(s, t);
  return s;
}

/** W2 at the ambiguous pre-choice point of the canonical journey. */
export function ambiguous(): D1State {
  return says(start("W2"), PROMPT);
}

/** A synthetic interpretation result, for reducer-only gates that must not depend on the interpreter. */
export function synthetic(s: D1State, kind: InterpretationResult["kind"], extra: Partial<InterpretationResult> = {}): InterpretationResult {
  return { revision: s.active, worldDigest: s.world.digest, kind, interpreterVersion: "synthetic-test", ...extra };
}

export function deliver(s: D1State, r: InterpretationResult): D1State {
  return dispatch(s, { type: "interpretation", result: r });
}

/** Same value with every object's keys in reverse order (to prove key order is irrelevant). */
export function reversedKeys<T>(v: T): T {
  if (Array.isArray(v)) return v.map(reversedKeys) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).reverse().map((k) => [k, reversedKeys((v as Record<string, unknown>)[k])])) as T;
  return v;
}
