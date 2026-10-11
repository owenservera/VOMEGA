# The Current Shared Design

**Role:** primary evergreen source-of-record narrative. **Revision status:** PROVISIONAL_SYNTHESIS with explicitly marked OWNER_DIRECTION and inherited invariants. **Scope:** Semantic SDK and its Elephant integration. **Last reviewed:** 2026-10-11.

## An overview for all audiences

We want ordinary source code to carry far more intelligible meaning than it currently carries in most software projects, without destroying what makes ordinary source code useful. Functions, variables, loops, types, modules and compilation are already established, working inventions. We begin there. The unfamiliar layer is a way for humans and machines to understand what those elements mean, how they relate, what evidence supports descriptions of them, what their consequences are and how that meaning should change as the program changes.

The first experiment is intentionally unsophisticated in one respect: the source file is **over-described**. Rather than trying to be elegant, brief or compressed, we try to make it exceptionally hard for a reader or model to misunderstand what each code element is and does. Each meaningful fact is anchored to the source, each unverified interpretation is labelled, and a reader can navigate from a function to its reason for existing, its inputs, effects, dependencies, tests and human-readable explanation. We learn what kinds of description actually help. Then independent experiments compress, remove or reorganize that information while preserving measurable usefulness.

This is not merely an automatic documentation writer. Its longer-term aim is a semantic compiler and runtime that can derive several honest views from a common, versioned understanding: machine representation, live plain-language interpretation, wiki, capability discovery, developer navigation, agent context and guarded runtime commands. Each view should be useful in its own right, yet accountable to the same source and snapshot.

We expect this experiment to teach us about **Elephants** as much as it teaches us about annotated code. A long-context expert agent might operate better with verbose knowledge, carefully compressed knowledge, selected graph neighborhoods or an on-demand reconstruction service. We do not know the optimal balance. A source-first, measurable laboratory allows the agents to discover and challenge the balance, not simply accept a context packing strategy imposed in advance.

## The statements we can presently stand behind

**F-01 — Respect executable source. [OWNER_DIRECTION]** Our first fixture is an ordinary TypeScript file, using familiar programming archetypes and real executable behavior. We are not proposing to replace TypeScript or redesign basic programming primitives. TypeScript is the initial experimental carrier, not a forever constraint across all languages.

**F-02 — Self-description begins deliberately verbose. [OWNER_DIRECTION]** At the start we maximize intelligible, structured semantic explanation and indexing instead of optimizing for token count or pretty syntax. This gives us a rich reference with which to explore. “Verbose” does not authorize invented or misleading facts.

**F-03 — Compression is empirical. [OWNER_DIRECTION]** A second track tests how little explicit information is necessary for correct explanations, navigation, editing, intent grounding and agent work. Its outputs compete on effectiveness, not just byte count. It may discover that the best encoding differs by audience and task.

**F-04 — One joined meaning-and-feedback effort. [OWNER_CONFIRMED, scoped Rule 1]** Semantic SDK/compiler/runtime, human-readable wiki and UI, machine-readable representation, intent interpretation and the automation laboratory co-evolve. We do not finish a theoretical kernel and bolt on human understanding later. They appear together in the smallest useful slice. See [Rule 1](../RULE_1_MACHINE_HUMAN_COEVOLUTION.md).

**F-05 — Source-linked explanations, not a second authoritative wiki. [PROVISIONAL_SYNTHESIS, consistent with current blueprint]** The wiki and other views should be regenerated from or explicitly linked to the source-bound canonical meaning and its evidence. When source changes, stale representations must be detected. How comprehensive an automatic wiki can be is still unproven.

**F-06 — Preserve the difference between description and truth. [PROTECTED_INVARIANT]** A function comment says what someone claims; parser output says what a specific static analysis derived; a test says what was observed under defined conditions; an agent explanation is a proposal unless independently checked. Agreement between explanations does not prove correct user intention or runtime behavior.

**F-07 — Exploration stays open. [OWNER_DIRECTION]** We do not freeze comment syntax, a semantic graph database, binary format, LLM, context method, header/footer layout, WASM target, UI or browser requirements merely because they appear in an example. Competing designs are valuable if they can be measured and their differences explained.

**F-08 — Source-native, reconstructable semantic knowledge. [PROVISIONAL_SYNTHESIS; architectural direction]** The target is to keep authoritative source and independently attributable facts available, compile them into a typed semantic representation and rebuild search, graph, wiki and other indexes as needed. This is a design direction, not proof that one logical IR is already implemented.

**F-09 — Elephant integration is a central experiment. [OWNER_CONFIRMED for embedding; realization OPEN]** The semantic learning loop belongs within Elephant development rather than a detached downstream SDK project. Agent memory, context allocation, handoff, cross-herd dependencies and source freshness become test subjects. Existing distinct Elephant experiments are not automatically replaced.

**F-10 — Interpretation does not grant authority. [PROTECTED_INVARIANT]** Understanding, indexing, simulating, proposing and executing are different activities. A semantic file, generated wiki, agent interpretation or apparent compiler success does not give permission to affect an external environment. Runtime realization requires separate valid context and authorization.

**F-11 — Documentation itself must be editable and accountable. [CURRENT_OWNER_DIRECTION]** We maintain stable evergreen pages as the coherent source of record; link actual decisions, keep speculative questions visible, edit in place and preserve versions through Git. We should not need to re-derive the whole vision from chat sessions every time we add an experiment.

## One possible future experience — not a claim of implementation

A developer opens one normal source file. Beside it, a semantic pane explains what each block does, what other files depend on it, whether an explanation is inferred or verified, and what has changed. A live wiki pane assembles a navigable account of the local and wider program. An agent sees a machine projection that preserves source identity and uncertainty instead of a flat prose dump. A modification triggers selective invalidation and re-evaluation. Human corrections and failed agent reconstructions become experimental cases.

In a later product-facing setting, the same underlying machinery might interpret a command while someone is typing and explain its meaning before submission. The interpretation may present alternatives or explicitly say UNKNOWN. Submission and action authorization remain separate. The visual surface may be a small text box, a canvas, an IDE, a CLI or a future interface. The first experiment need not build all of them.

## What is explicitly not yet settled

There is no agreed final annotation language, canonical byte encoding, universal ontology, database selection, formal verification completeness, semantic equivalent of a whole compiler, agent allocation algorithm, model leaderboard or runtime deployment target. The opening fixture does not prove these designs; the entire point is to create conditions in which their relative merits can be learned.

A source-derived fact may be cheap to reconstruct mechanically, but a business rationale, subjective intention or external permission may remain irreducibly contextual. We should not expect one compressed representation to serve all tasks, nor one agent to infer all meaning with certainty. We should not assert that long contexts automatically imply better cognition or that more semantically dense comments are always helpful.

The current open choices live in [06 — Decision board](06_DECISION_BOARD.md). See [05 — Principles](05_PRINCIPLES_AND_CONTRACTS.md) for boundaries that must be maintained while exploring them.

## What would count as progress

Our first credible result is an executable TypeScript fixture, a truthful maximal semantic account, a deterministic machine view, a readable wiki, and a demonstrable discrepancy when the code and its claims disagree. We should then be able to compare at least several compressed representations against a plain-source baseline with independent tests. A fresh Elephant should reconstruct a useful understanding without privileged access to the reference answer. We must report failures and total compute/human cost, not just token savings.

**Editing note:** Retain stable F identifiers. A change to an F-statement that changes design authority or meaning must reference a decision-board item and the original owner decision where one exists. Do not use agreement-sounding wording to elevate PROVISIONAL_SYNTHESIS to OWNER_CONFIRMED. See [07](07_EDITING_PROTOCOL.md).