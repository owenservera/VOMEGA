# Five autonomous computers — benchmark-driven Semantic SDK acceleration

> **⚓ Rule 1 governance update, 2026-10-11:** [Machine ↔ Human is the sole semantic learning loop](../RULE_1_MACHINE_HUMAN_COEVOLUTION.md). The five computer missions below are PROVISIONAL historical design drafts, not independent/ordered workstreams or finalized launch instructions. Any future split must feed the same canonical Machine/Human discrepancy → SDK/compiler/runtime improvement circuit; no five-session plan should be launched from these unreviewed prompts.


**Launch model:** exactly five user-sent master prompts. Each COMPUTER clones VOMEGA, receives the same operator-provided `07_OMEGA_full.zip` seed, can independently spawn its own bounded sub-agents, and delivers a fully runnable/gradable candidate after a substantial autonomous run. No forced 21/23/28 simultaneous sessions. Keep one reviewed main; short-lived worktrees only.

## Five launch links

1. [C1 — TS core, compiler, golden files](01_CORE_PORT_AND_GOLDENS.md)
2. [C2 — Independent red-team and B1 command fidelity](02_INDEPENDENT_REDTEAM_AND_REFEREE.md)
3. [C3 — Declarative capabilities, generated Wiki and B4 change velocity](03_DECLARATIVE_EXTENSIBILITY_AND_CHANGE_VELOCITY.md)
4. [C4 — Floating command box, typing policies, accessibility](04_FLOATING_COMMAND_BOX_UX.md)
5. [C5 — Full-stack V1, A2A profile, B2 context and B3 handoff](05_FULLSTACK_INTEGRATION_AND_HANDOFF_BENCHMARKS.md)

Each link is the **full prompt**, not just a label. Send the corresponding document URL as the sole master task to one computer, accompanied by the original archive `07_OMEGA_full.zip` if the archive's contents have not been committed to GitHub. The original ZIP is REQUIRED to reproduce source-based claims. As of this commit, the previously staged repo path only included introductory documents; it was not the complete source import. Missing local ZIP/source must be reported as SOURCE_BLOCKED.

## What the uploaded archive actually contains

- Run A complete Python core, fixture, declarations, variants, scoring scripts and eight scored variants.
- Run B's actual `runB_executed/run.py` and `raw.md`, plus Run A's `cross_runB.py`. This **supersedes** the older staging note that Run B code was missing.
- `benchmarks/00_MASTER_SESSION_INTEGRATION.md` and B1–B4. All five **explicitly say SCAFFOLD** and mostly enumerate future sections; the benchmark hypotheses are not observed benchmark wins.
- Research, context, prior art and historical patches. Historical patch files are evidence, not blind apply instructions.

Run B's code reads `runB_executed/omega_core_fixture_v1.json` which is not an entry in the uploaded ZIP. To execute, copy the immutable `runA/fixture.json` to that name in an isolated temporary worktree, check that its canonical JSON SHA-256 is `16e242c5f56cc1015d51279320d6015de9e871a8ab88b1cc2de1c3f633ec4b7f`, then record the scratch modification and run results. Run A's `cross_runB.py` contains hard-coded author-machine paths; do not confuse unmodified script portability with a verified benchmark.

## Independent assessment and what is retained

| Benchmark | Retained hypothesis | Strengthening requirement | Current evidence |
| --- | --- | --- | --- |
| B1 Command fidelity | Ω deterministic reading vs champion LLM as tool interpreter; hybrid rephraser | Severity-weighted false READY, correct abstention, hidden genuinely blind prompts, held-out safety | **DESIGN / NOT EXECUTED** as a B1 competition |
| B2 Agent context | Compiled capsules vs vector DB retrieval | Include strong grep and code-mode champions, build and refresh cost, mutation-driven staleness checks | **DESIGN / NOT EXECUTED** |
| B3 Handoff fidelity | Contract vs plain A2A, scratchpad and native | Same model payload, independent verifier, transport-vs-meaning-vs-authority separation, adversarial fault injection | **DESIGN / NOT EXECUTED** |
| B4 Change velocity | Declarative vs idiomatic TS twin | Independent behavioral equivalence proof, matched model/budget, blind mixed tasks, account for compiler costs | **DESIGN / NOT EXECUTED** |

B4 is the **decisive dogfood claim**, B1 is the **safety gate**, B2 is the **memory/context architecture test**, and B3 is the **trust-bearing communication test**. None may be claimed won on the basis of mock tests written by a participating builder.

## Universal acceptance gates

1. Prove exact source provenance and public source fixtures; no private holdout disclosure to subject sessions.
2. Keep referee/oracle separate from implementations; use mutations to ensure tests detect incorrect behavior.
3. A semantic digest is NOT an authority grant. Every ambiguous READY, stale reading, modified target account or lacking consent MUST block effects. Provider/account configuration remains read-only; only mock providers.
4. Report MEASURED/ESTIMATED/UNKNOWN. Thresholds are preregistered before observing results; a lost comparison is published as a lost comparison.
5. Every computer exports a source repository/ZIP, runnable tests, provenance, scorecard.json, failures.jsonl, complete capability packs including blocked and retired states, and full README. Human operator collects five artifacts; integration referee selects interoperable winners.
6. Respect Universal Elephant DNA's transport neutrality. A2A omega-contract is a versioned profile to validate, not a foundational cognitive primitive.

## Mission allocation and dependency handling

C1–C5 **can all launch immediately** because each should build a standalone proof slice from the same frozen source. C4 and C5 use local adapters, not a wait for a winner from C1. After all five deliver, run an integration/adjudication wave that imports actual winners and proves the combined V1's semantic and permission invariants. Do not confuse an agent's internal sub-agent count with the number of master prompts you send.

## Cross-repository availability

This README and five master prompts are committed to VOMEGA GitHub. The uploaded ZIP's complete original code and benchmark files are not silently assumed to be there. Publishing the full source archive remains a separate explicitly verifiable Git import step; do not report it complete based on these prompt links alone.
