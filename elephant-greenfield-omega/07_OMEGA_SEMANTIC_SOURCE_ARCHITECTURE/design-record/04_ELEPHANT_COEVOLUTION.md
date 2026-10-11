# Elephants as Learners, Consumers and Tests of Semantic Intelligence

**Role:** living research narrative. **Status:** OWNER_DIRECTION for embedding this research in Elephant; concrete cognition, memory and allocation mechanisms OPEN. **Last reviewed:** 2026-10-11.

## Why the semantic work and Elephant work belong together

The Elephant project seeks durable, reconstructable knowledge and expert behavior across substantial software-building work. Its challenge is not simply to obtain large context windows. A model may have access to thousands of files and still misunderstand which matter, overlook a stale dependency, repeat work another agent already finished or confidently act on an outdated explanation.

The Semantic SDK experiment addresses the same problem from the source-code side. It asks how a program can explain what its parts mean, how the parts are connected and what evidence supports those descriptions. Elephants let us observe whether those representations improve the work of AI developers rather than just producing attractive diagrams or convenient search results. Their real tasks can reveal which semantic distinctions are indispensable.

This is why the source-first laboratory is an instrument for improving both projects. We start with one file and progressively complex code neighborhoods. In each step we observe not only whether a wiki is correct, but whether a fresh Elephant can understand, navigate, modify and reason from it. The Elephant may request missing facts or find contradictions; those requests and failures become new semantic learning signals.

## What an Elephant is — and what is still unknown

For this research, an Elephant is an expert-like context resource capable of receiving bounded knowledge, performing tasks, preserving or reconstructing relevant memory, and handing off attributable findings. One realization could be a persistent LLM conversation; another could be an agent repeatedly rebuilt from immutable packs and selected indexes. Neither is assumed universal.

The existing Universal Elephant DNA research separates **DNA** (general, testable cognitive capabilities) from **phenotype** (the specialist domain or task) and **realization** (the underlying agents, models, stores, protocols and tools). Our semantic fixture can exercise DNA candidates such as source attribution, detection of unknowns, accurate memory reconstruction and responsible disagreement. The same DNA can be tested in a semantic-code phenotype or a different technical domain.

We should not claim that the system already has a durable cognitive genome, perfect long-term memory or reliable self-knowledge. Those remain hypotheses to measure. Large model context is available capacity, not evidence that meaning is retained faithfully.

## What source-based knowledge may change about an Elephant's workspace

Today an agent may ingest a whole directory, a summary of that directory, search hits or a previous agent's prose. Each choice has costs. A semantically indexed source set could instead offer alternate *views of the same code*: exact source, maximal explanatory text, compact typed relationships, a set of relevant dependency neighborhoods, a human-oriented wiki, a recent-changes timeline and explicit unresolved requests.

For a task touching one function, the best payload might include the function body, affected caller list and effect constraints. For a cross-cutting refactor, a broader graph and history could matter more. For design research, reasons and competing alternatives may matter more than every line of code. We do not know the optimal context strategy, so we make it adjustable and test its consequences.

The system may eventually know not just which files an Elephant has, but which are fresh, how much of each was actually consulted, which claims it can reproduce correctly, which dependent modules have changed, what requests it has made to peers and where its understanding conflicts with another agent's. These are candidate *observables*, not claims of mind-reading. A token count alone cannot establish comprehension.

## A concrete cross-Elephant example

One Elephant receives a maximal description of a small API. Another receives ordinary source plus retrieval tools. A third receives a compressed semantic capsule referencing symbols, evidence and unknowns. All three are asked to identify the function enforcing a constraint, explain its failure modes and modify a dependent caller without introducing an unapproved side effect.

We compare actual code changes, test results, false claims, missed dependencies, clarification requests, time, tokens and ability to say what remains unknown. A fourth independent referee checks source and behavioral results; it does not accept any Elephant's self-report as an oracle. If a compact capsule fails because it omits an important condition, that becomes a specific feedback case for source annotations, packing policy or retrieval behavior.

A second experiment sends a task between two specialized Elephants. Can the recipient rebuild the relevant understanding from a publication without sharing the entire predecessor's conversation? Does it know what was observed, what was guessed and what needs verification? Does a handoff between models preserve identity and conflict information? The answer may differ by task, context size and model family.

## Context-allocation variables worth exploring

Experiments should vary file-level versus symbol-level splitting; thematic grouping versus dependency neighborhoods; preloaded source versus on-demand retrieval; verbal context versus typed records; maximal versus compressed description; frequency of snapshot refresh; time-aware invalidation; overlapping expertise versus strict partitioning; and redundant agent work used for genuine independent verification.

Other valuable variables are source-change velocity, cross-herd dependency exposure, request routing, confidence or evidence labels, long-lived versus fresh contexts, cross-model transport, specialist handoff quality and the amount of reference information each Elephant can request before acting. The semantic SDK may offer a context packager or a query API, but the final packaging algorithm must emerge from results.

These dimensions interact. Reducing context tokens can increase retrieval calls; tighter domain specialization can increase coordination burden; duplicating knowledge can make an expert resilient but wasteful. We should examine Pareto tradeoffs instead of optimizing one scalar model-utilization score.

## Communication and publication

Every Elephant-produced explanation, design or code patch is a **candidate contribution**. It should point to exact source or evidence when making factual claims. Its outgoing pack should preserve identity, source epochs, unresolved dependencies, rejected alternatives and actual tests. The established rule that every top-level development turn publishes an all-maturity portfolio remains in force, even for failed or blocked work.

A source-native semantic identity might help different Elephants refer to the same code element. A query or change-request packet might identify required source versions and explain what facts were omitted. These are attractive directions but remain interface candidates until interoperability and fidelity are verified.

## What success means

The practical goal is that Elephants improve software development outcomes with less hidden guesswork: faster correct navigation, fewer stale edits, stronger independent reconstruction, clearer cross-team dependencies and cheaper recovery from context loss. We must measure against ordinary agents given code and common search tools, not merely compare one specialized semantic pack to an artificially constrained baseline.

The first result may show that over-verbalization helps novices but distracts expert models, or that compressed symbols reduce transfer cost yet lose human intent. Either outcome would be useful. The laboratory is designed to find the boundary, not prove a preferred architecture.

See [the live learning experiment](03_FEEDBACK_AND_EXPERIMENTS.md), [source walkthrough](02_SOURCE_TO_MEANING.md), [open Elephant questions](06_DECISION_BOARD.md), [Universal Elephant DNA](../../05_UNIVERSAL_ELEPHANT_DNA/README.md), and [standing publication outputs](../../01_EXPECTED_OUTPUTS/README.md).