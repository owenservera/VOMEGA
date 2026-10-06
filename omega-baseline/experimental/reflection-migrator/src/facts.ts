// Claim-classed structural facts (MP21-P2). A fact is `subject —predicate→ object` plus an
// optional literal `value`, the anchors it was read from, and its claim class. The class is
// part of the record, so an extracted fact can never be confused with suggested meaning:
// P2 emits no CANDIDATE_SEMANTIC facts at all.
import { canonicalize, type Json } from "../../ratchet/src/canonical.ts";
import { byString } from "./anchor.ts";

/** Classes from the migrator doc §9 that an extractor may emit. */
export const CLAIM_CLASSES = ["PROVEN_STRUCTURAL", "DECLARED", "INFERRED_SAFE", "COMMENTARY", "CONFLICT"] as const;
export type ClaimClass = (typeof CLAIM_CLASSES)[number];

export interface Fact {
  id: string;
  claimClass: ClaimClass;
  subject: string;
  predicate: string;
  object?: string;
  value?: Json;
  /** SourceAnchor ids. Never empty: a fact without a source is not emitted. */
  anchors: string[];
  /** Required for INFERRED_SAFE: the name of the deterministic rule in RULES. */
  rule?: string;
}

/** Every inference rule P2 may apply. Each is mechanical and stated in full. */
export const RULES = {
  "routable-kind": "A contract, engine or provider contribution makes the op `<id>@<version>` routable (contracts/src/manifest.ts routableOps).",
  "path-classification": "A file's role and surface come from the path patterns in classify.ts; `plugin-entry` comes from a manifest's `entry` field.",
  "file-under-manifest-directory": "A file whose path is under the directory of a product plugin.json is part of that plugin if it is a source file, and located in it if it is a test or fixture; the nearest such directory wins.",
  "file-under-package-directory": "A source file whose path is under the directory of a package.json is part of that package if it is a source file, and located in it otherwise; the nearest such directory wins.",
  "same-file-const": "An identifier or `X.member` expression is replaced by the string literal a top-level `const` in the same file binds it to.",
  "imported-const": "An imported identifier or `X.member` expression is replaced by the string literal that the single top-level `const` of that name binds it to in the imported relative module or workspace package.",
  "local-wrapper-forwarding": "A function in the same file forwards one of its parameters as the op of a port call, and is called with a string literal in that position.",
  "string-literal-equals-known-op": "A string literal in a test file is character-for-character equal to an op that a product manifest declares or a plugin registers.",
  "workspace-package-name": "An import specifier equal to (or under) the `name` in a package.json in the tree refers to that package.",
} as const;
export type RuleName = keyof typeof RULES;

// ---------------------------------------------------------------- entity references
// One spelling per kind of thing, used by every fact. These are the EntityRefs P3 exposes.

export const ref = {
  plugin: (id: string) => `plugin:${id}`,
  op: (op: string) => `op:${op}`,
  contribution: (pluginId: string, kind: string, id: string, version: string) => `contribution:${pluginId}/${kind}:${id}@${version}`,
  field: (contribution: string, name: string) => `field:${contribution.slice("contribution:".length)}/${name}`,
  frame: (path: string, op: string) => `frame:${path}#${op}`,
  file: (path: string) => `file:${path}`,
  symbol: (path: string, name: string) => `symbol:${path}#${name}`,
  pkg: (name: string) => `package:${name}`,
  module: (specifier: string) => `module:${specifier}`,
  capability: (name: string) => `capability:${name}`,
};

export function kindOfRef(entity: string): string {
  return entity.slice(0, entity.indexOf(":"));
}

// ---------------------------------------------------------------- collection

export type FactInput = Omit<Fact, "id">;

/**
 * Collects facts keyed by (predicate, subject, object). Seeing the same statement again
 * merges its anchors. Seeing it with a different value or class is two sources disagreeing:
 * the fact becomes CONFLICT and keeps every value — it is never silently resolved.
 */
export class FactSet {
  private readonly byId = new Map<string, Fact & { values: Json[] }>();

  add(input: FactInput): void {
    if (input.anchors.length === 0) throw new Error(`fact without a source anchor: ${input.predicate} ${input.subject}`);
    if (input.claimClass === "INFERRED_SAFE" && !input.rule) throw new Error(`INFERRED_SAFE fact without a rule: ${input.predicate}`);
    const id = `${input.predicate}(${input.subject}${input.object === undefined ? "" : ` -> ${input.object}`})`;
    const value = input.value === undefined ? null : input.value;
    const existing = this.byId.get(id);
    if (!existing) {
      this.byId.set(id, { ...input, id, anchors: [...input.anchors], values: [value] });
      return;
    }
    for (const a of input.anchors) if (!existing.anchors.includes(a)) existing.anchors.push(a);
    if (!existing.values.some((v) => canonicalize(v) === canonicalize(value))) existing.values.push(value);
    if (existing.values.length > 1) existing.claimClass = "CONFLICT";
    else if (CLAIM_CLASSES.indexOf(input.claimClass) < CLAIM_CLASSES.indexOf(existing.claimClass)) {
      // The same statement established two ways keeps the stronger class and its rule.
      existing.claimClass = input.claimClass;
      existing.rule = input.rule;
    }
  }

  list(): Fact[] {
    return [...this.byId.values()]
      .map(({ values, ...fact }) => {
        const out: Fact = { ...fact, anchors: [...fact.anchors].sort(byString) };
        if (values.length > 1) {
          out.value = { conflicting: [...values].sort((a, b) => byString(canonicalize(a), canonicalize(b))) };
          delete out.rule;
        }
        return out;
      })
      .sort((a, b) => byString(a.id, b.id));
  }
}
