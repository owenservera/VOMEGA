# Ten Core Expected Behaviors — The Capability Contract

**Role:** evergreen expectation register and guiding design canon candidate.
**Scope:** Ω Semantic SDK + WikiCore + Self-Runtime + Elephant co-learning.
**Status:** OWNER_DIRECTION for formalizing expectations; the ten formulations are PROVISIONAL_SYNTHESIS FOR INTERVIEW, not individually owner-ratified.
**Last edited:** 2026-10-11. **Editing owner:** this document; use [07](07_EDITING_PROTOCOL.md) and [06](06_DECISION_BOARD.md).

## Why expectations precede architecture

We can agree on what the system ought to do without yet knowing which file layout, grammar, graph store, execution engine or model performs it best. These expectations are *outcome vectors*: behaviors a person or independently configured agent can observe and test. They also become standardized benchmark families and optimization objectives for the Elephant Lab. They are neither slogans nor an implementation shopping list. The method is to give each expectation one permanent ID, a plain-language meaning, a minimal demonstration, an observable failure mode, and evidence/decision status.

We start with ten to make the canon understandable. Ten is a first-pass grouping, not an arbitrary upper bound on actual capabilities. A behavior may be supported by several methods, and a method may help several behaviors. The relationship between expectation and method is recorded and tested, not assumed.

## E01 — Understand its source [PROVISIONAL_SYNTHESIS]

A newly admitted, conventional TypeScript file should be structurally understandable without having to rewrite its code into a proprietary DSL. At minimum, the system should identify files, functions, variables, constants, types, control flow and dependencies within the limits of its parser. It should distinguish actual structure, author declarations and inferred business meaning.

**Demonstration:** import the first fixture and generate anchored symbol/type/control-flow observations, then deliberately confuse it with unsupported syntax. **Failure:** a guessed structural fact is presented as compiler-verified. **Measurements:** structural coverage, precision, parser limits and setup cost. **Open:** which source carriers and smallest supported archetypes.

## E02 — Describe itself [PROVISIONAL_SYNTHESIS]

The system should be able to provide an intelligible, up-to-date explanation of its own supported capabilities, components, limitations, versions and interdependencies. In time that description should include the semantic reader, compiler, indexers and runtime themselves—not only external application code. This is a progressive self-hosting goal, not permission to trust a system's claims about its own correctness.

**Demonstration:** ask which component generated a wiki entry and which checks it performed; inspect source and independent receipts. **Failure:** invented capabilities or a self-certifying verification claim. **Measurements:** completeness, evidence quality and independent reconstruction.

## E03 — Generate its own Wiki [PROVISIONAL_SYNTHESIS]

A human should be able to ask for a readable description of a function, file, capability or system area. The generated account should contain purpose, behavior, examples, connections, evidence and known gaps in language suited to its reader. It must remain bound to current source/semantic versions; generated prose is not a second independent authority.

**Demonstration:** generate wiki for the first fixture, change the source, compare old/new and expose stale paragraphs. **Failure:** an obsolete or invented explanation appears current. **Measurements:** coverage, comprehensibility, supported-fact precision and update latency.

## E04 — Navigate its knowledge [PROVISIONAL_SYNTHESIS]

A reader or agent should find definitions, usage sites, dependent files, related behaviors, evidence trails and reasons for decisions. The system should not require a person to know where a particular file is or what a concept was originally named before looking for it.

**Demonstration:** from a high-level intent locate a relevant function and its dependent callers across two files. **Failure:** silent confusion of lexical similarity with verified dependency. **Measurements:** retrieval precision/recall, path correctness and time.

## E05 — Detect change and contradictions [PROVISIONAL_SYNTHESIS]

The system should recognize edits that could change meaning, distinguish structural from semantic changes where possible, invalidate affected readings, and explain why claims disagree with source, tests or other evidence. It need not solve arbitrary program equivalence.

**Demonstration:** change an add operation into multiplication and keep the old description; trigger contradiction, stale-state tracking and impact navigation. **Failure:** a broken claim retains verified status. **Measurements:** mutation sensitivity, false alarms, staleness latency and impact recall.

## E06 — Translate meaning between representations [PROVISIONAL_SYNTHESIS]

Meaning should pass through typed machine records, source annotations, human explanations, agent capsules and compact indexes with declared fidelity. Every projection should name its source publication and omissions, and identify when reconstruction needs the original source.

**Demonstration:** compress a description, ask a fresh agent to reconstruct required behavior and unknowns, then compare with independent ground truth. **Failure:** hidden loss of effects, identities or uncertainty. **Measurements:** exact/task-sufficient reconstruction, cost and loss cases.

## E07 — Interpret human intent [PROVISIONAL_SYNTHESIS]

Given human language, the system should show its current best interpretation in ordinary words and in a structured candidate meaning, including ambiguous alternatives and possible consequences. A draft preview and a committed publication must not be confused. Describing a potential action is not authorization to execute it.

**Demonstration:** deliberately ambiguous instructions that could refer to two accounts, files or operations; require visible alternatives rather than confident wrong targets. **Failure:** a wrong or unsafe READY assertion. **Measurements:** grounding accuracy, false certainty, correction steps, full-loop latency.

## E08 — Know its operational state [PROVISIONAL_SYNTHESIS]

The system should distinguish what is merely described, indexed, implemented, verified, currently available in a named environment and explicitly authorized. It should say when it does not know. Operational introspection should describe checked runtime facts where observable, not magically know external state.

**Demonstration:** a declared capability with absent dependency and no consent is discoverable but not executable. **Failure:** a semantic declaration grants effect authority. **Measurements:** correct admission/availability classifications and authority separation.

## E09 — Improve its representations [PROVISIONAL_SYNTHESIS]

The development system should generate or discover competing descriptions, encodings, indexes and context policies, test them fairly, and preserve both winning and failed results. Accepted improvements must have reproducible evidence and a reversible revision path. Optimization should include correctness, explanation quality, maintainability, and total time/cost.

**Demonstration:** compare plain source, saturated annotations and several compressed variants on blind tasks. **Failure:** an agent promotes an impressive but self-graded result. **Measurements:** correct accepted improvement per full-loop time/compute and regressions.

## E10 — Transfer knowledge between Elephants [PROVISIONAL_SYNTHESIS]

A fresh or specialized Elephant should be able to reconstruct a bounded useful understanding of the source and its relationships from publications and requests, state what it has not seen and cooperate with peers without silently losing provenance or conflicts.

**Demonstration:** hand a task from one source-reading agent to another using a source-pinned capsule, then test on withheld code changes. **Failure:** recipient invents missing context or treats a stale pack as current. **Measurements:** handoff reconstruction, fresh-context success, missing-knowledge honesty and collaboration cost.

## The expectation-to-method boundary

These E-identifiers are intended to be *stable behavioral targets*. They do not settle whether the method is named \`wiki.describe\`, \`runtime.inspect\`, \`semantic.query\` or something more efficient. Possible mappings into a WikiCore verb system are candidates in [10](10_WIKICORE_METHODS.md); self-runtime semantics are in [11](11_SELF_RUNTIME.md). No module names, protocols or runtime APIs are frozen by this table.

## Evidence rubric and acceptance

For every expectation report: DEFINED (what a successful behavior means); DEMONSTRATED_IN_FIXTURE; REPRODUCED_INDEPENDENTLY; GENERALIZED_TO_NEW_COHORT; and any OBSERVED_REGRESSION. These are **evidence levels**, not promotion decisions. Current evidence for these *ten exact expected behaviors as one integrated system* is NOT YET VERIFIED. Prior Phase 0 specific tests and R1AB author-reported/replayed cohorts remain independently sourced; don't retroactively claim E01–E10 passed.

A first-pass benchmark may cover only 3–4 expectations so long as gaps are explicit. A fresh revision may regroup expectations without reusing or deleting IDs: record the lineage and update their test mappings.

## Owner review

We should decide whether these ten are the right **top-level grouping**, particularly whether E02/E08 should merge under self-knowledge, whether E06/E10 should remain separately measurable, and whether **self-runtime** deserves a distinct expectation beyond E08. See interview [14](14_INTERVIEW_ROUND_01.md). Approval should reference an explicit owner answer, not the mere creation of this page.