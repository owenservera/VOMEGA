# Canonical Elephant Protocol Gym Launch Policy

**Status:** OWNER-CONFIRMED decisions 1–4. **Scope:** Elephant Protocol Gym (EPG) exploratory development. **Effective:** 2026-10-11. **Implementation state:** PREPARED, NOT LAUNCHED. **Authority:** explicit owner answers in the four-step October 11 interview, incorporated without claiming evidence of live sessions.

## Purpose

Use many small, independent Elephant experiments to discover how a self-describing semantic SDK, its wiki/compiler/runtime and the Elephant development system should evolve together. Start with observable expectations and real feedback, not a frozen implementation. The Gym improves the *surrounding protocol, tooling, knowledge and evaluation loop*, not the underlying LLM weights. The governing [Machine ↔ Human Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md) remains in force.

## Four approved operating rules

**D1 — Reuse the existing feeder; test small and real source in parallel.** The tiny, ordinary TypeScript fixture provides a controlled experiment, while existing verified Elephant code/toolkits supply realistic complexity. Use [feeder discovery, custody and replay](FEEDER_REUSE.md) rather than inventing another ingestion pipeline. Private source is only available when explicitly supplied and integrity-checked. Inaccessible code must be marked UNAVAILABLE.

**D2 — Reuse useful automation; keep it replaceable.** Offer the existing [Live Lab, Experiment Runner, Change Lab, Phase 0 tests and related toolkits](AUTOMATION_REUSE.md) as reusable assets and comparison controls. Elephants may adapt, compose or replace them when a falsifiable experiment justifies doing so. No mandatory Python/Wasm/browser/database/UI stack follows from reuse.

**D3 — Every run exposes a Machine ↔ Human learning signal.** Every experiment must make visible a source/intent basis, the machine's actual or proposed interpretation, a human-readable account, what agrees/disagrees or remains unknown, its witness and a next test. See [signal definition](MACHINE_HUMAN_SIGNAL.md). A simulated human judgment is labelled simulated. A model's self-report does not count as independent proof. The implementation can be a short note, test, CLI, wiki, UI or another honest representation.

**D4 — Maximum experimental freedom within shared boundaries.** Elephants can challenge and redesign method vocabularies, semantic encodings, data contracts, compiler boundaries, runtime organization, source descriptions, feedback representation, orchestration, indexing, memory, agent communication, automation and experiment designs. No specific internal protocol or toolkit API is permanently frozen by this policy. **Non-negotiable boundaries:** preserve source truth and provenance; separate claims from verified behavior; preserve human intent and authorization for external effects; expose the D3 feedback signal; publish inspectable evidence, uncertainty and failures; keep independent evaluation; isolate experiments and avoid affecting live/shared source or accounts without permission. A local experimental fork may challenge even the suitability of these rules, but cannot silently relax operational safety or rewrite independent ground truth. Changes to shared Gym/SDK/Elephant **canon require documented review and appropriately scoped owner decision** through the [existing decision tracker](../../DECISION_PROCESS_TRACKER.md). Successful local trials do not automatically become universal law.

## Launch contract — intentionally small

Give each independent session the *same pinned* [CORE_SEED](CORE_SEED.md), the same [fixture](fixture/001-semantic-basics.ts), this policy, available verified real-source references through D1, and its **own** [Run A/B/C/D prompt](README.md). Do not expose other arms' emerging conclusions before initial independent runs. Let each arm choose methods and optional existing tools under D2/D4. Use disposable workspaces and minimize dependencies; no standing team branch or prescribed final component topology. A short dry run is sufficient to start learning.

At turn close, present the short [run note](REVIEW.md): hypothesis, real inputs, what ran/was merely proposed, source/version, machine-human signal, failed or contradictory observations, candidate reuse/redesign, smallest next falsifying test and remaining unknowns. Actual Elephant development turns **also** follow the existing [all-maturity capability pack publication](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md); this short note is not a substitute.

## Promotion and self-hosting

A proposal is not a decision; an experiment is not a production result; an agreed design is not evidence it is implemented. Compare candidate changes against ordinary source and/or existing tool behavior when meaningful. Record versioned improvements and negatives, keep alternatives discoverable and improve the shared seed **only after review**. Once admitted, the *approved semantic contracts and tooling capabilities* should become eligible for source-grounded SDK/Elephant self-description, subject to the same verification rules as any other source. No claim of self-certification or automatic permission arises.

## What remains open

WikiCore primitives, annotation syntax, logical IR, compilation topology, physical indexes, self-runtime shape, UI implementation, model choice, context allocation, experiment fan-out and timing are **research variables**, not directives. The ten [expected behaviors](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/09_EXPECTED_BEHAVIORS.md) are candidate observable outcome families, not mandated ten software modules. Existing detailed proposals are optional evidence/reference, never secretly imposed on all arms.

## Editorial rule

This is the single short **operative Gym launch policy**. Edit it in place for new explicit owner decisions; retain the four detailed decision documents as explanatory references and preserve Git lineage. New agent-produced hypotheses belong in run reports and the [evergreen design decision board](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/06_DECISION_BOARD.md), not silently in this governing text.

**Decision sources:** D1, D2, D3 and D4 were expressly selected by the owner in the October 11 interview; D4 exact wording: “Give Elephants maximum freedom to redesign their protocols, methods and toolkits within the core truth, safety, feedback and evidence rules. Shared canon changes require review.”