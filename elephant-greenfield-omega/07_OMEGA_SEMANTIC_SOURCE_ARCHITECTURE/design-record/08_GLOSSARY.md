# Shared Language — Semantic SDK and Elephant Research

**Role:** evergreen translation aid for mixed audiences. **Status:** explanatory, with candidate terms labelled. **Last reviewed:** 2026-10-11.

A useful shared design needs stable language, especially when the same word means different things to programmers, model researchers and product designers. These explanations are not themselves formal type definitions. If formal meaning is adopted, link a normative schema and keep this accessible wording aligned.

**Executable source.** The real code a standard compiler or interpreter uses. We begin with ordinary TypeScript. Semantic explanation does not replace code execution.

**Programming archetype.** A familiar kind of code construct or activity — such as a function, loop, variable, conditional, class, type or dependency. Our project reuses rather than redefines these.

**Self-describing source.** Code plus source-linked meaning, evidence and relationships sufficient for useful machine and human interpretation. It can contain comments or declarations, but also facts derived from standard code analysis.

**Semantic SDK.** The prospective toolkit for inspecting, compiling, validating, querying and explaining source-bound meaning. Its final API, packaging and runtime remain open.

**Semantic compiler.** An instrument that reads source and semantic claims, checks what it can, links identities and emits a versioned, queryable interpretation. It is not merely a pretty-comment formatter.

**Semantic runtime.** The component that interprets or uses checked meaning and may prepare governed operations. Runtime execution authority is a distinct gate; “understood” does not mean “authorized.”

**Semantic claim.** A specific assertion about a code element, relation, intention or environment, with source/scope and evidence classification. A comment saying “this function never throws” is a declaration, not automatic proof.

**Source anchor.** A precise reference to a location or symbol within a named source revision. Anchors can change during a refactor without every conceptual identity changing.

**Concept/semantic identity.** A stable reference to what something means within a defined namespace/scope. It is separate from a current filename and current source hash.

**Source revision.** The exact bytes or versioned source/dependency state from which a claim was made. A source edit must be observable.

**Semantic publication / snapshot.** A version-bound representation of checked meaning, status, source lineage and diagnostics. It can be projected into different views without changing identity.

**Semantic IR.** “Intermediate representation” — a typed machine form between source analysis and views or indexes. One logical IR is an architectural direction; the final structure is still under research.

**Projection.** A representation generated from the semantic snapshot, such as wiki, machine packet, dependency map, human reading or agent context. Its allowed omissions should be explicit.

**Wiki compiler / code-as-wiki.** The envisioned method of generating human-understandable, navigable explanations from source-grounded meaning. It should detect stale claims, not simply produce prose once.

**Semantic saturation / Track A.** The deliberate first-pass over-description and over-indexing of source, with provenance and unknowns. Verbosity is a research instrument, not a claim of correctness.

**Semantic compression / Track B.** Experiments that remove, normalize, encode, share or dynamically derive source knowledge while measuring task-specific meaning preservation and cost.

**Reconstruction.** The process of recovering required information from a compressed view, source, index or handoff packet. Its success depends on the task and the fidelity promise.

**Semantic reconstruction distance.** Candidate measurement family for extra work, tokens, time, retrieval, clarification and errors needed to recover required meaning. Not currently a formal universal metric.

**Machine ↔ Human loop / Rule 1.** One continuous feedback circuit: source and intent become checked meaning; the meaning becomes machine and human views; mismatches become testable improvements. The wiki/UI and experiment runner are not separate later projects.

**Semantic discrepancy.** A mismatch among declared meaning, machine interpretation, human reading, user intention, source facts or observed behavior. A discrepancy is a research signal, not necessarily proof of which side is wrong.

**Provenance.** Where a claim came from and why it is believed: source bytes, developer declaration, model proposal, observation, independent check, human correction or other traceable evidence.

**UNKNOWN.** Meaning or evidence has not been established within the stated scope. It must not be quietly converted into “false,” “absent” or “ready.”

**Open-world.** New domains, concepts and relations can be introduced without the core compiler hardcoding every possible subject. Unknown information is expected.

**Index / materialized view.** A searchable or query-optimized form of underlying meaning, potentially plain JSON, SQL, a packed graph or another format. Such indexes should be rebuildable and not silently redefine the source.

**Dependency invalidation.** Finding which claims, wiki entries, indexes and agent packets are affected by a source change and marking or recomputing them appropriately.

**Intent grounding.** Connecting a human instruction to specific typed operations, targets, conditions and alternatives. Merely assigning a plausible sentence is not equivalent to understanding the intended consequence.

**Effect / authorization.** An effect is a potential change to the outside world or state; authorization is the fresh permission to perform it. A code file's existence or semantic annotation does not provide permission.

**Elephant.** A candidate expert-like memory/context resource used for durable or reconstructable agent cognition, collaboration and handoff. A persistent chat is one realization, not the definition.

**Elephant DNA.** A proposed collection of observable, reusable cognitive competencies. It differs from phenotype (specialization) and realization (specific agents, models, storage and transport).

**Capability pack.** A versioned deliverable carrying a capability or hypothesis with its evidence, maturity state and portable references. Even blocked, failed and incomplete work must be truthfully published under the standing Elephant policy.

**Blind referee.** A checker or independent evaluator that does not receive the answer being reconstructed and is not controlled by the candidate under test.

**Falsifiable experiment.** A test with explicit inputs, competing predictions, controls and an outcome that could disprove a hypothesis. A plausible model response alone does not meet this standard.

**Source of record.** The current coherent account of design direction, evidence state and known unknowns, maintained in stable paths and updated with traceable revisions. It is not the same thing as immutable historical experiment evidence.

**OWNER_DIRECTION vs OWNER_CONFIRMED.** The former indicates a clearly expressed intended approach; the latter requires a directly linked explicit, scoped approval. The distinction and other editing states are defined in [07](07_EDITING_PROTOCOL.md).

For a grounded narrative, go back to [01](01_AGREED_STATE.md). For research and unmade choices, see [06](06_DECISION_BOARD.md).