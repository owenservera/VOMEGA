# Principles, Boundaries and Candidate Contracts

**Role:** evergreen technical constitution in readable language. **Status:** combination of PROTECTED_INVARIANT, OWNER_DIRECTION and explicitly labelled CANDIDATE interfaces. **Last reviewed:** 2026-10-11.

## What a semantic system can and cannot know

A compiler can establish syntax, some type properties and certain structural dependencies. Tests can demonstrate a behavior for a particular input and environment. A developer can explain intention, but that explanation might be outdated or wrong. An LLM can propose likely meaning, but its confidence is not external proof. A user's command can express intention, but it may be ambiguous. The system must preserve these differences rather than flattening them into one apparently certain “fact.”

This makes **evidence classification** more important than a particular annotation language. A first-pass claim might be DECLARED, MECHANICALLY_DERIVED, BEHAVIOR_OBSERVED, INDEPENDENTLY_ADJUDICATED, UNKNOWN, CONTRADICTED or NOT_APPLICABLE. Quantitative findings additionally require MEASURED, ESTIMATED or UNKNOWN with a named cohort and witness. These labels are conceptual candidates for representation syntax; their epistemic distinctions are protected.

## P-01 — Source is fundamental, but not the only reality [PROTECTED_INVARIANT]

Source code is the executable artifact we begin with. Its own facts, hash, authorship, dependencies and exact version must remain inspectable. Yet user intention, machine environment, API availability, external specifications and behavioral observations are other realities with their own provenance. A code comment cannot overwrite a user correction or claim a live service exists merely because a function references it.

## P-02 — Ordinary language constructs stay ordinary [OWNER_DIRECTION]

We piggyback on established syntax, ASTs, types and standard compilers. The semantic layer should not require a new replacement language to represent an addition function, loop or class. We may choose annotations, sidecars, typed declarations or generated-only meaning, but none of these should silently change TypeScript execution or parse untrusted source by evaluating it.

## P-03 — Explicit meaning is initially maximized, then questioned [OWNER_DIRECTION]

We first over-verbalize and index with care. We then remove/restructure representations only where independent tests show that the required meaning can still be recovered under named tasks. The raw baseline source and richer reference remain available for falsification. Compression may yield different outputs for novice documentation, code navigation and agent handoff.

## P-04 — Identity, source revision, meaning publication and execution authority are different [PROTECTED_INVARIANT]

A stable concept name answers “which idea or capability?” A source revision answers “which exact bytes, declarations and dependencies?” A publication answers “which checked meaning snapshot?” An execution permit answers “who may perform this particular effect in which environment now?” Reusing one ID for all of these would cause stale knowledge and unsafe effects. Their concrete ID formats and hashing bytes are still open.

## P-05 — One accountable meaning, multiple views [PROTECTED_INVARIANT within Rule 1]

The human wiki, live plain-language reading, UI hints, machine representation and Elephant-facing contexts should identify the source-bound semantic snapshot they portray. Each view may omit fields under a declared purpose and fidelity contract, but cannot silently reverse, invent or upgrade important meaning. Rendering two mutually consistent views is not a proof that the original interpretation matched the human's intention.

## P-06 — Unknown remains a first-class result [PROTECTED_INVARIANT]

Open-world knowledge is not a finite list of all domains and capabilities. New relations can enter as scoped, typed candidates, rather than requiring the core to know every future API, math method, manufacturing process or device. Missing information is UNKNOWN rather than false unless a specific bounded domain explicitly provides a closed-world rule. Inference must label assumptions and provenance.

## P-07 — Discoverability is not admissibility or permission [PROTECTED_INVARIANT]

Adding a file may permit static extraction and global discovery after validation. That does not imply its behavior has been verified, its dependencies are available or its actions are authorized. The runtime must distinguish conceptual understanding, local realization, environmental availability, policy and explicit consent. A model cannot grant external authority by producing the right JSON or annotation.

## P-08 — Self-description is not self-certification [PROTECTED_INVARIANT]

Eventually the semantic protocol should describe its own compiler, indexes and query methods. That recursion requires a small trusted starting point and independent checkers so the system cannot certify an unsafe change simply by rewriting its self-description. Cross-implementation differential tests and versioned migration evidence matter more than elegant self-referential diagrams.

## P-09 — Indexes are replaceable projections [CANDIDATE architectural direction]

Our logical semantic records should not depend on a specific graph database, SQL engine, vector store or binary storage format. We want a checked intermediate representation and rebuildable projections for search, graph navigation, wiki, context and analytics. A vector similarity hit is a retrieval hypothesis, not a verified semantic relationship. The optimal physical backend remains an experiment.

## P-10 — Feedback is about discrepancy, not agreement scores [PROTECTED_INVARIANT within Rule 1]

The learning loop starts when meaning differs from intention, source, observed behavior, wiki interpretation, human comprehension or agent reconstruction. Models and simulators can generate possible explanations and tests; independent witnesses and controls must evaluate them. Fast iteration is valuable only when the final accepted improvements are correct and reproducible.

## Candidate logical compiler contract [CANDIDATE; not an API freeze]

Conceptually, an inspector reads a pinned set of source files without executing them. An extractor produces symbols and exact anchors. A resolver links imports and known external references. A checker evaluates types, declarations, evidence and contradictions. A canonicalizer emits a versioned semantic snapshot with diagnostics and declared unknowns. Projection functions then produce wiki, reading, search and agent packets, each with fidelity and source provenance.

This is a logical decomposition, not a mandate for separate packages or sequential network services. One tiny prototype might put it all in a single TypeScript program and JSON file. The minimal feedback circuit should operate as soon as the first function is understood; we do not wait for a full general-purpose semantic compiler to exist.

### Candidate record, in plain language

A semantic claim needs a subject, predicate, typed value, source/symbol anchors, claim status, evidence reference, source revision and scope. Where relevant it needs definition identity, dependencies, version, conflicting claims and affected projections. Machine consumers should be able to request missing fields. The exact wire schema and canonical bytes are undecided.

### Candidate operation boundaries

A read-only inspection call returns structural and semantic facts with diagnostic severity. A compile call returns ACCEPTED, PARTIAL or REJECTED and explains what was checked. A projection call generates a specified view from an immutable snapshot. A query call retrieves information while disclosing missing coverage. A runtime interpretation call may preview potential meaning and alternatives, but only a separate, fresh effect gate can approve dispatch in an explicitly selected world.

No implementation should claim that general arbitrary-program behavior is fully and automatically verifiable. Reflection, dynamic evaluation, native libraries, network effects and user intention exceed what syntax alone can prove. Safe partial output is better than pretending to universal certainty.

## How principles may change

Principles marked OWNER_DIRECTION can be revised by later explicit owner guidance. PROTECTED_INVARIANT items require an explicit design decision, cited consequences, safety review where relevant, and regression/migration evidence. CANDIDATE mechanisms may be challenged freely by independent experiments. Never silently turn a successful local test into universal law. The active open questions and cheapest discriminating tests live in [06](06_DECISION_BOARD.md).

For deep formal definitions, consult the [universal blueprint](../MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md); for actual engineering references, consult the [existing SDK anchor](../SDK_COMPILER_RUNTIME_ANCHOR.md) and [Phase 0 experiments](../phase0/README.md).