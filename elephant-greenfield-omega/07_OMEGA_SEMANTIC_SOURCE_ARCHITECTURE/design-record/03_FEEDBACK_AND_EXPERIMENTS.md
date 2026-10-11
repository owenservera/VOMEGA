# The Semantic Learning Laboratory

**Role:** evergreen R&D method, not a report of successful runs. **Status:** OWNER_DIRECTION for the two-track method and Rule 1; CANDIDATE for protocols, metrics and implementation details. **Last reviewed:** 2026-10-11.

## Why we explore by making meaning excessive

A normal software project often begins by deciding the abstractions, implementation architecture and database before it has evidence that those choices improve what matters. Here the design space is too broad. We want a semantic programming layer, a wiki compiler, a compiler/runtime, human intent interpretation, portable representations and better model cognition, but we do not know how much explicit language any particular task needs. Designing an elegant minimal schema before seeing those tradeoffs would risk constraining discovery.

Our working method starts at the opposite extreme. Track A tries to provide unusually complete and intelligible descriptions of a small body of real source code. It identifies symbols and relationships, narrates what operations do, explains constraints and side effects, annotates confidence and evidence, and builds a navigable wiki. It is intentionally expensive so that we can observe whether information is redundant, essential or useful only for certain audiences.

Track B uses the same source tasks to explore compressed alternatives. It can remove compiler-derivable statements, invent compact semantic notations, normalize repeating relationships, share indexes across files or retrieve additional context only when needed. Some models may prefer the uncompressed view; others may build better solutions from compact task-specific packages. The objective is not necessarily to find a final shortest format. It is to discover a family of representations and a principled way to select among them.

## Track A — maximize expression without fabricating knowledge

The maximal reference should expose the known programming archetype, symbol identity, type and signature, plain-language purpose, algorithm summary, input/output assumptions, expected and exceptional behavior, effects, mutation, dependencies, examples, evidence, potential intent vocabulary, alternatives, source anchors and relevant context. It should indicate unmeasured, unknown, inapplicable or contradicted fields rather than filling each field with plausible sounding prose.

The “maximal” view is not gold truth merely because it is long. It can contain incorrect developer assertions or confident model guesses. A separate referee must evaluate claims against the source and independently observed behavior. We retain the raw assertions and their critique as useful data: it is valuable to know which kinds of sentences repeatedly mislead an LLM or human reviewer.

## Track B — several simultaneous hypotheses

Independent variants can test removing information derivable from AST/types, moving repetition into shared file headers, replacing prose with normalized predicates, shifting some claims into generated sidecars, graph-neighborhood encoding, on-demand wiki generation, capsule-style agent handoffs, or no annotations at all. A candidate may be more compressed physically but require expensive inference during use. Another candidate may be larger but dramatically reduce errors during edits. The benchmark must count lifecycle cost, not only source length.

One variant should preserve human-friendly prose; another should optimize for machine retrieval; another should optimize for a limited context window. These are competing hypotheses, not a mandated sequence from verbose to compact. New surprising strategies may be proposed by models, but must face the same external referee and controls.

## One feedback circuit, not detached benchmark factories

The existing Rule 1 says the Semantic SDK, compiler, runtime, wiki and human/machine representations co-evolve in **one observable discrepancy loop**. A person finds a misleading description; a model loses an important condition during handoff; a changed source invalidates a wiki page; a command interpreter chooses the wrong target. Each is a feedback case with a pinned input and source, expected outcome with provenance, actual machine meaning, human rendering, observed mismatch and suggested remedy.

The experiment factory can propose competing changes to grammar, extraction, source description, compression, indexing, retrieval, renderer or agent context. It then compiles and replays the affected cases, independently checks them and records acceptance, rejection or unresolved status. A plausible candidate is never elevated to a better design merely because the proposing model scored itself highly.

The wiki and live human explanation are **measurement instruments** as well as product features. Without them, important misinterpretations stay hidden inside machine representations. Conversely, a beautifully consistent machine/wiki pair may both misrepresent what the user intended; intent truth and actual behavior still need separate witnesses.

## Comparison design and controls

Start with a source-only control (normal TypeScript plus ordinary navigation tools), an excessively described version, and at least three meaningfully different compressed variants. Use the same pinned code, type checker where appropriate, fixed task instructions, identical access policy and comparable compute reporting. Held-out cases should include errors, source mutations, ambiguous instructions, cross-file navigation, missing data and deliberately misleading comments. Counterbalance task order when involving humans, and isolate agent contexts so answers are not leaked by earlier trials.

Ask participants to explain code, find relevant symbols, predict effects, diagnose a change, safely implement a small revision, identify uncertainty and reconstruct a wiki entry. Blind the reconstruction worker to Track A’s answer and do not let a model generate its own ground-truth grading scheme. Include normal controls and adversarial counterexamples to expose overconfidence.

## How we measure useful compression

Token/byte savings matter, but they are insufficient. We should report explanation correctness, evidence precision, graph relationship fidelity, unknown-state preservation, wiki/source freshness, dependency discovery, intent grounding, false-safe command rates, reconstruction time, compute/time cost, and human correction burden. Cross-Elephant handoff needs additional measures: what was understood, what was omitted, what was duplicated, what needed to be requested again and whether the recipient could accurately identify gaps.

“Semantic reconstruction distance” is a proposed family of metrics: how much extra work, time, tokens, retrieval, clarification and error occur when recovering task-relevant meaning from a compressed representation. It does not yet have one mathematically accepted universal definition. We should report its constituent observables separately before proposing a composite score.

An experiment wins only under named task conditions and with uncertainty stated. A representation that works for pure arithmetic might fail for asynchronous effects or unfamiliar domain semantics. An untested claim must be marked UNKNOWN, not benchmarked as a success.

## Reproducible lab packets and publication

Each trial should preserve the exact fixture and revision, representation variant, transformation/diff, declared model and prompt context, tokenizer/hardware observations where known, expected tasks, test cases, validation receipt, machine and wiki outputs, discrepancies, independent referee result, metrics and negative outcomes. Existing Elephant publication requirements still apply: all-maturity capability packs appear at the end of every development turn regardless of whether they are completed, blocked or failed.

A candidate may be promising without being admitted to the shared SDK. “Research result,” “design decision,” “implemented code” and “production verified” are four different statements. Release notes must distinguish them.

## Experimental sequence, not a stage-gate roadmap

A good first session builds the ordinary TypeScript fixture and exercises a few archetypes. A second creates the maximal source-linked description and the two visible projections. A third deliberately changes code and tests whether claims become stale. The next comparison pits no annotation against inline verbose comments, normalized comments and generated sidecars. Then transfer the resulting knowledge to fresh Elephant contexts with tasks they have not seen. Only after observing actual tradeoffs do we decide whether to formalize special syntax or optimization rules.

This sequence is deliberately flexible: a model may discover a better or cheaper discriminating test. The stable requirement is **falsifiability and source-grounded feedback**, not allegiance to a specific testing tool or schedule.

Links: [source walkthrough](02_SOURCE_TO_MEANING.md), [Elephant integration](04_ELEPHANT_COEVOLUTION.md), [decision board](06_DECISION_BOARD.md), [existing runnable Phase 0](../phase0/README.md), [Rule 1](../RULE_1_MACHINE_HUMAN_COEVOLUTION.md).