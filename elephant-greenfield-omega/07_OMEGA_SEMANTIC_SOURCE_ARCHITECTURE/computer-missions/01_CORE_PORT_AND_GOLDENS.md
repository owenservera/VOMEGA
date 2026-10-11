# COMPUTER 1 — Semantic Compiler, TypeScript Core, Golden Reference

Mission ID: C1. Deliver the **best working browser-compatible semantic SDK kernel**, not just a transliteration. Within this ONE computer, fan out bounded competing implementation branches (direct port, grammar-generated parser, data-driven AST, and minimal dependency version). Have a separate verifier agent score finalists. Select a single winner with reproducible evidence.

## Required source / bootstrap

Clone https://github.com/owenservera/VOMEGA and read elephant-greenfield-omega/PROJECT_START_HERE.md, 01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md, 05_UNIVERSAL_ELEPHANT_DNA, and 07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/README.md. The repository's previous 07 staging commit DOES NOT itself contain all Run A/B benchmark source files. The operator-provided **07_OMEGA_full.zip** is the canonical additional input. Locate or obtain that exact archive; inspect and SHA-256-manifest it before any benchmark. It contains runA/engine.py, osl.py, proofs.py, fixture.json, omega.osl, variants.osl, runB_executed/run.py, Run A cross_runB.py, and benchmarks/B1..B4 scaffolds. If absent, search actual repository first, then return SOURCE_BLOCKED with exact missing paths; DO NOT hallucinate golden files, clone another unrelated source, or claim measured outcomes. Do not treat the benchmark documents as completed evidence.

## Operating contract (applies to your whole computer)

You are ONE independent autonomous GLM 5.3 Flash computer mission, not one tiny chat task. You may create bounded local sub-agents/worktrees, run for a substantial session, and iterate through design → code → independent tests → counterexamples → fix → retest. Allocate internal specialists yourself, record their independence and conflicts, avoid shared permanent branches, and assemble ONE finished clean result. Do not depend on other computers being finished. Never edit existing Elephant frozen benchmarks or the universal DNA canon. Preserve every original source byte. Do not touch real provider credentials, live sessions or outside APIs; local mock providers only. Use zero unapproved effectful execution. No fabricated latency, tokens, agent counts, or scorecards. Label each numerical outcome MEASURED/ESTIMATED/UNKNOWN, with machine, code commit, command, denominator and logs.

Create one self-contained deliverable under .project/deliverables/semantic-sdk-five-computers/<your-computer-id>/ or an equivalent exportable ZIP, containing README.md, source, tests, run.ps1 (Windows) plus cross-platform runner, scorecard.json, provenance.json, failures.jsonl, capability-packs/ (including blocked/unchanged), and NEXT.md. Capture complete shell stdout and stderr. Independently replay against a frozen fixture where appropriate. Keep public development fixtures distinct from evaluator-only holdouts. Publish a complete all-maturity capability-pack portfolio at the end of every meaningful turn; do not silently skip unfinished items. Commit only your owned, non-sensitive output to a short-lived branch/worktree or export a ZIP; no competing long-lived owner branches and no unapproved merge to main. Follow the existing Lab's publication contract. Acceptance requires runnable artifacts and independent local reproducer, not a convincing design memo.

## Semantic safety invariants

Provider != Account != Model != Session; Capability != realization; evidence != authority. Readings are deterministic, re-parsed, complete and collision-tested, but the semantic digest alone MUST NOT authorize execution. Known competing parses or a stale/revised display block the action; the executor separately verifies exact shown reading, frozen command, source/grammar revision, target account/session epoch, permissions/consent and effects at dispatch. Quoted text remains payload. No production credentials or real external provider calls.


## Work sequence

1. Inventory entire user-supplied archive, recording Run A/B source, fixture hashes and actual runnable entrypoints. Re-run Python baseline before any TS work. Run B's run.py expects omega_core_fixture_v1.json; make a recorded *scratch copy* from Run A fixture for independent reproduction, never silently alter the source archive. Assess Run B comparison by re-executing source rather than trusting reported numbers.
2. Freeze a read-only public golden corpus: all 140 enumerated READY commands, all reachable 417 distinct states IF and ONLY IF fresh replay obtains that count, plus generated utterances with expected output, canonical digest, reading, ambiguity alternatives, provenance and input hash. Count actual rows and deduplicate by stable key; do not assume exactly 70,000, since reported 20,556 + 49,545 = 70,101. Keep any evaluator-private corpus outside subject branches.
3. Build a cross-language conformance schema and an independent oracle that verifies normalized representations, Unicode handling, quoted payloads, model/account identities, partial states, stale reading revisions, and all declared consequences. Don't grade using only a translation of the code you are testing.
4. Port interpreter/renderer/semantic digest/trace to TypeScript for browser and Node, with no real provider adapters. Preserve all reference semantics unless an explicitly versioned, documented v2 changes them. Distinguish a reference-compatible port from a hardened v2 candidate.
5. Property/fuzz testing: rendering→parsing, injectivity, completeness, ambiguous READY blocking, no silent parsing under hostile input, and semantic-vs-execution token distinction. Include the deliberately failing V4 completeness mutation.
6. Benchmark correctness FIRST; then cold build, render+parse+digest p50/p95, bundle size, memory and dependency load on matched hardware. Winner cannot trade correctness for speed. Compile a tiny registry/docs projection and show deterministic builds from the same declaration.

## Deliverable

A runnable ESM/TS package and browser demo import; test-vectors/public/ with measured corpus manifest; independent Python/TS differential harness; scorecard C1; source + dependency manifest, conformance schema, gate failure evidence, dependency/license analysis, production-readiness NOT_CLAIMED. Export the golden corpus for C2–C5, but do not expose private held-out cases or mutate historical reference artifacts.

## Reject

No empty modules, fake tests, unpinned string digests, skipping partial states, silently dropping ambiguity fields, hiding failures or claiming that 140 finite cases are general language correctness. Claim "ready for integration" only if clean-machine reproducibility passes.
