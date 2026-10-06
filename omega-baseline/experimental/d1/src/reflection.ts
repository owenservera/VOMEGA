// Minimal source-bound Reflection: extractor/Migrator slice + read-only graph
// (D1-055..059B). STUB.
//
// Rules the gates enforce:
//   - only sources inside REFLECTION_BOUNDARY are read; anything else is a gap
//   - every item carries an anchor {path, digest of the exact source text, JSON pointer}
//   - facts are copied from the source at the pointer, never inferred
//   - a missing structural fact is reported in `gaps`, never filled in
//   - the graph is frozen (read-only) and descriptive: no authority, availability or proof
import type { ReflectionGraph, SourceFile } from "./contract.ts";
import { declarationSources } from "./declarations.ts";
import { notImplemented } from "./not-implemented.ts";

/** D1-055: what the extractor may read and which claim classes it may emit. */
export const REFLECTION_BOUNDARY = {
  inputs: ["experimental/d1/declarations/*.json"],
  claimClasses: ["capability", "parameter", "realization", "action", "consequence", "evidence-class", "semantic-type"],
} as const;

/** The real D1 sources the product twin reflects over. */
export function reflectionSources(): SourceFile[] {
  return declarationSources();
}

export function extractReflection(sources: SourceFile[]): ReflectionGraph {
  return notImplemented("D1-057", `extractReflection(${sources.length} source(s))`);
}
