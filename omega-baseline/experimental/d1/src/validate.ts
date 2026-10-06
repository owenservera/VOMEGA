// READY law. D1-004 IMPLEMENTED; D1-005/D1-006 still stubbed.
//
// A command is READY only if every field required by the selected capability /
// realization is resolved and compatible, no material ambiguity remains, the
// World version is valid for the decision, and authority permits commitment.
// Required fields are DERIVED from declarations/*.capability.json — never a
// second hand-written list (the Reflection gates will catch duplication).
import type { Interpretation } from "../../../plugins/vivim-nlcl-pure/src/index.ts";
import type { Validation, World } from "./contract.ts";
import { capabilityDecl } from "./declarations.ts";
import { notImplemented } from "./not-implemented.ts";

export interface FieldRules { capability: string; required: string[]; optional: string[] }

/** A capability id with no declaration has no knowable field rules; say so loudly. */
export class DeclarationError extends Error {
  constructor(public readonly code: string, message: string) {
    super(`${code}: ${message}`);
    this.name = "DeclarationError";
  }
}

/**
 * D1-004: required/optional fields for a capability, derived from its
 * declaration. The declaration is the single source: this function reads
 * `required` off each declared param and never names a field itself. A
 * Capability that is not declared is an error rather than an empty rule set —
 * "nothing required" would silently make an unknown command look satisfiable.
 */
export function requiredFields(capability: string): FieldRules {
  const decl = capabilityDecl(capability);
  if (!decl) throw new DeclarationError("CAPABILITY_UNDECLARED", `no capability declaration for "${capability}"`);
  return {
    capability: decl.id,
    required: decl.params.filter((p) => p.required).map((p) => p.name),
    optional: decl.params.filter((p) => !p.required).map((p) => p.name),
  };
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
