> **Canonical 2026-10-11 entrypoint:** [PROJECT_START_HERE.md](PROJECT_START_HERE.md). This file preserves the earlier v0.1 O1 study. [Bounded review & consolidation program](06_REVIEW_AND_CONSOLIDATION/README.md) and [source-pinned v0.5 MVP target](00_CORE_BASELINE/04_MVP_V0_5_PRODUCT_NORTH_STAR.md) clarify present navigation and future cleanup; the old paths remain compatible with live sessions.

# GREENFIELD Ω — Elephant Protocol Research & Build Pack

**Edition:** 2026-10-11 / v0.1 / standalone, implementation-oriented hypothesis.
**Scope:** compare E0 (zero Elephants), E1 (one), E2 (two concurrently active). Fresh Ω codebase, not a modification of legacy VOMEGA. This folder is the experiment starter, not evidence that any provider sessions are connected.

## O1 v0.1 historical read order — not the current lab start

1. **`00_LAUNCH_PROMPTS.md`** — launch sequence and the complete model-specific design challenges.
2. `01_MASTER_CHARTER.md` — why the experiment exists, what success means, scope and falsifiers.
3. `02_GREENFIELD_OMEGA_PRODUCT.md` — identical product challenge across E0/E1/E2.
4. `protocol/` — protocol state machine, envelopes, flushing, code writing, authority and recovery.
5. `experiments/` — controlled experiments, instrumentation, scorecards, gates and runbooks.
6. `operations/` — Windows-first implementation and session / Git / dispatch procedures.
7. `prompts/` — ready-to-paste prompts for Claude, Codex, ZCode, OpenCode, Grok; also worker, Elephant and synthesis roles.
8. `tools/ecp/` — standard-library Node.js **simulation harness** proving basic request/response state, staleness, idempotency, flush/rotation, permissions, and journaling; **not** a real model integration.
9. `ip/` — novelty hypotheses, prior-art search and evidence discipline; **not** legal patentability conclusions.

## Historical O1 experiment actions (optional; not universal lab instructions)

- Open `00_LAUNCH_PROMPTS.md` and issue the provider-specific briefs to independent sessions.
- Compare designs **before** sharing their answers, using `prompts/JUDGE_SYNTHESIS.md`.
- Run `node --test tools/ecp/ecp.test.mjs` and `node tools/ecp/ecp.mjs demo` for the **deterministic simulation**.
- Pick one harness adapter and prove real resume, read-only permissions, model identity, context behavior, cancellation and response capture before attempting E1.
- Commit one source baseline; clone three identically seeded experiment arms. Do not allow experiments to share writable product files.

## What this pack does NOT claim

- No real AI sessions have been started, no agents have been authenticated, and no provider-specific command-line syntax is assumed valid without machine verification.
- There is no confirmed speedup, no verified novel/patentable claim, and no live Tauri build.
- `tools/ecp` exercises deterministic contracts using a mock Elephant; production transports/ACL/context compaction need implementation and measurement.

## Single-home navigation

| Question | Source |
|---|---|
| What does the project test and why? | `01_MASTER_CHARTER.md` |
| What is the exact greenfield build? | `02_GREENFIELD_OMEGA_PRODUCT.md` |
| How does E0/E1/E2 differ? | `protocol/01_TOPOLOGY_AND_FLOW.md` |
| How do messages and decisions flow? | `protocol/02_ECP_V0_SPEC.md` |
| What happens when the context fills / expires? | `protocol/03_MEMORY_FLUSH_AND_RECOVERY.md` |
| Who can edit source? | `protocol/04_CODE_WRITING_AND_GIT.md` |
| How is this measured without cheating? | `experiments/01_DESIGN_AND_CONTROLS.md`, `02_SCORECARD.md` |
| How to run it on Windows? | `operations/01_WINDOWS_RUNBOOK.md` |
| What IP should be investigated? | `ip/01_NOVELTY_LEDGER.md` |

## Lineage

Based on VOMEGA's original `ELEPHANT-CONTEXT-NETWORK.md` (archived October 6, 2026), `ELEPHANT-CONTEXT-NETWORK-PLAN.md`, Orca context notes and October 2026 MP-66 experiment direction. The present pack is a **new greenfield proposal**, not an adopted architecture of the existing VOMEGA repo. Historical pointers in `reference/SOURCES.md`.

## PROJECT REORGANIZATION (2026-10-11): START HERE

**[Open the canonical project guide](PROJECT_START_HERE.md).** Shared neutral core baseline, mandatory all-maturity every-turn capability-pack publication, independently authored architecture proposals, and development systems (the existing general Z.ai A/B/C lab plus a separate full Z.ai session for EACH genuinely submitted unique proposal) now have their own locations.

This older v0.1 README and original protocol/mock harness remain as historical **O1 (ours) proposal material**, not as the universal prescribed architecture for Claude or others. Do not move active Round 1 worktrees or treat these new docs as evidence that a separate Z.ai session has already launched. See [full turn release contract](01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md) and [turn publication index](04_TURN_PUBLICATIONS/CURRENT_PUBLICATION_INDEX.md).
