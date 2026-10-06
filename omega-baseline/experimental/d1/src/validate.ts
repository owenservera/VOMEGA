// READY law (D1-004, D1-005, D1-006). STUB.
//
// A command is READY only if every field required by the selected capability /
// realization is resolved and compatible, no material ambiguity remains, the
// World version is valid for the decision, and authority permits commitment.
// Required fields must be DERIVED from declarations/*.capability.json — not a
// second hand-written list (the Reflection gates will catch duplication).
import type { Interpretation } from "../../../plugins/vivim-nlcl-pure/src/index.ts";
import type { Validation, World } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export interface FieldRules { capability: string; required: string[]; optional: string[] }

/** D1-004: required/optional fields for a capability, derived from its declaration. */
export function requiredFields(capability: string): FieldRules {
  return notImplemented("D1-004", `requiredFields(${capability})`);
}

/**
 * D1-005: validate a raw interpreter result against the declared required
 * fields. This is the fix for corpus case U1 (nlcl reports status "ok" while
 * the required account slot is unresolved). `world` is optional so the
 * existing corpus WorldModel cases can be validated too.
 */
export function validateInterpretation(interp: Interpretation, world?: World): Validation {
  return notImplemented("D1-005", `validateInterpretation(${JSON.stringify(interp.input)}${world ? `, ${world.id}` : ""})`);
}
