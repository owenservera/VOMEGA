# Ω Semantic Publisher Lab — TS-family / WebAssembly final-stage proposal

> **SUPERSEDING OWNER TECHNOLOGY CLARIFICATION (2026-10-11):** The *parity, live Plain Reading/Wiki, Enter-publication, source revision and test methodology* in this historical proposal remain reusable. Its **required WebAssembly kernel and no-Node/no-Python final-stage realization are no longer requirements**; WebAssembly is now a [replaceable Gym development booster candidate](../../../../03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/WASM_BOOSTER.md). The common interactive substrate is an [effectively infinite 3D canvas with a shared human–machine real-time execution manifold and full semantic parity](../../../../03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/INITIAL_STATE.md). Preserve the original proposal below as dated design history, not current canon.


> **⚓ RULE 1 — clarification:** [Semantic SDK/compiler/runtime and Human/Machine representations co-evolve in ONE loop](../../../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md). Wiki/UI/intent/self-knowledge/AI-native protocols provide the feedback that changes the SDK. Wasm is a replaceable candidate implementation of the shared observation/publication utility, not a later independent optimization stage.


**Status: DESIGN PROPOSAL / DELIBERATING / NOT IMPLEMENTED / NOT APPROVED.**  
**Date:** 2026-10-11 · **Scope:** a *single experimental component* of the LLM-native development-automation supercharging toolkit, **not** a final Ω product/MVP architecture decision.

## Start here

1. [Original idea, refinements, open choices](PROPOSAL_AND_DECISIONS.md) — separates owner's direction from assistant recommendations.
2. [Preliminary technical specification](PRELIMINARY_SPEC.md) — narrow portable final-stage runtime, live text box, Machine/Human parity and source-derived Wiki.
3. [Automation lab wiring and near-immediate refinement loop](AUTOMATION_LOOP_WIRING.md) — how Elephant/agent experiments would compile, replay, score and safely promote a better interpretation.
4. [Benchmarks and falsification](BENCHMARKS_AND_EXPERIMENTS.md) — independent live interpretation, wiki coherence and batch acceleration measurements; safety gates.
5. [Illustrative machine publication record](PUBLICATION_ENVELOPE_CANDIDATE.json) — **example data, not a ratified schema, implementation, or validated digest**.

## Baseline: what already exists

The [Phase 0 laboratory](../../../README.md) has a Python reference engine and mock authorization tests; the [three-tool first-pass](../../README.md) has source-linked Live Lab, Experiment Runner and Change Lab with a Python backend. They are **existing experimental baselines**, NOT evidence that this TypeScript/WebAssembly final-stage runtime exists or works. Keep them available for differential evaluation; do not rewrite vendor sources or relabel historical tests.

## Precise proposed boundary

The outer factory (Elephants, agents, source-harvesting, experimentation, compilers, code-gen, indexers, evaluation) may use the strongest available development tools. The **last hot stage**—free-form typing → declared semantic candidate → human-readable Plain Reading + source-grounded Wiki → Enter freezes one publication → one Machine representation / one Human rendering—targets a small WebAssembly kernel plus static HTML/CSS and the smallest necessary browser DOM bridge.

**No Node.js runtime; no Python runtime; no third-party UI framework; no runtime package install.** Build-time tools *upstream* are not prohibited. Pure Wasm cannot directly manipulate a browser DOM; a minimal JS/compiled-TS host bridge is technically required for standard HTML input/rendering. The output architecture should isolate that bridge and let the same semantic engine run without UI in batch.

## Owner's primary constraint: one publication, two views

Machine presents the canonical structured record. Human renders that **very same frozen record** as a Plain Reading and per-capability Wiki projection. Neither mode can insert facts, silently change meaning or publish a different command/status/authority. Human feedback creates a *new proposed correction case*; it does not alter the prior record. Enter publishes even NEEDS_CHOICE, NEEDS_INFO, INVALID, UNKNOWN as explicit non-executable statuses; authorization for an effect is a separate step.

### Publication vs certification

Publishing a packet is not executing a command, accepting a regression expectation, updating production grammar, or certifying a capability. The established [Elephant all-state every-turn publication contract](../../../../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md) remains authoritative for lab/controller releases; this experimental in-browser publication contract does not replace it.

## What is NOT decided

Whether the runtime core is compiled from AssemblyScript, TS-driven generation of a Wasm grammar engine, or another replaceable compile strategy; binary packaging (embedded/offline vs static served); performance thresholds; grammar storage and update mechanism; how much human annotation belongs in the Wiki. All are experimental questions, **not frozen MVP law**.

**No Wasm module, browser UI, candidate performance or "near-instant tuning" claim is included in this proposal commit.** Read the falsifiable tests before building.
