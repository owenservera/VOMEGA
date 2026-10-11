# Claude v0.2 Z.ai Development System — Technical Assessment and Incorporation Plan

**Inspection date:** 2026-10-11. This evaluation separates architecture, lab-process instrumentation, and actual proven execution. Original uploaded ZIP: `greenfield-omega-team-pack-v0.2.zip`. Nothing in the archive is evidence of a live Z.ai Full-Stack or ZCode subagent run.

## Executive judgment

The v0.2 team runner is a **credible prototype of an auditable experiment process**, not yet a demonstrated autonomous multi-agent full-stack laboratory. Its best novel operational contribution is making *experiment integrity itself executable* rather than trusting agent narratives: append-only hash-chained ledger, strict sequencing, canary/source-write fences, preregistration, blind evaluator staging, encrypted delayed holdouts, deterministic selection, and cross-validation by the cockpit. These are worth selectively adopting into common lab practices. The core Claude Elephant architecture is separate: capsule-first, stateless default, epoch-anchored cognition and citation proof; it remains a competing **proposal**, not a canonical project architecture.

**Local validation:** `node --test outputs/claude/kernel/kernel.test.mjs` → 32/32 pass; `node --test team/tools/team.test.mjs team/tools/e2e.test.mjs` → 29/29 pass, including one full synthetic CLI round. These **61 passing tests prove local contract/test harness behavior only**, not separate real AI contexts, actual parallelism, webapp/browser capability, credible token metering, hidden holdout independence in live operation, or accepted product development speedup.

**Source integrity:** `team/TEAM-MANIFEST.json` lists 146 hash-matching files. `outputs/claude/MANIFEST.json` lists 33 entries: 32 match; `outputs/claude/kernel/journal.mjs` mismatches. This must be flagged before a release is called VERIFIED/PORTABLE. It may be packaging drift; do not quietly rewrite the original manifest or conclude malicious intent.

## Architecture versus process separation

**Architecture folder** contains: ECP v0.2 high-level design, transport semantics, source basis/capsule lifecycle, write and trust boundaries, fault/threat matrix, technical tradeoffs and falsifiers, invention candidates, message schemas, architecture kernel and event traces. Those are the actual Claude approach and its mechanical proof-of-concept, including architecture-specific protocol semantics.

**Claude Z.ai development-system folder** contains: team charter, two-turn round pipeline, child arm isolation, rubric/oracle design, fixed C1–C8 seed task sequencing, cockpit specification, role prompts, SDK-free Node experiment/test tools, schemas, synthetic fixtures, sealed oracles and historical `BUILD_SEQUENCE.md`. These are methods and implementation scaffolds for running a laboratory; they are NOT the architecture's defining ECP protocol. The original archive should be referenced by digest as provenance.

**Common development requirements** should ingest only proven, technology-neutral operating practices. Do not transplant Claude's fixed task list, chosen Next.js/Prisma assumptions, Track A/B identities, human oracle-key gate, or two-turn closure law wholesale into the other authors' independent Z.ai sessions. Doing so would pre-choose parts of the architecture/development strategy we explicitly left open.

## Strengths that should become shared candidate practices

1. **Executable ledger events, not retrospective prose.** `ledger.mjs` hash-chains events; `round.mjs` checks status/ordering and records incidents. Adapt as a *minimum trustworthy event interface*, not a forced Node implementation. Add explicit per-turn `PORTFOLIO_PUBLISHED`, `PACK_REGISTERED`, `PACK_STATE_CHANGED`, `PACK_EXPORT_FAILED` semantics. Protect operator/user secrets, rotate logs and verify storage durability/clock provenance.
2. **Freeze experiments before results.** The manifest binds the acceptance suite, task cohort, run order, resource budget, oracle integrity and selection rule to a dated immutable hash. A later change needs a new cohort/version; never silently adjust score to favor a contender. Preserve Windows and provider capability census evidence.
3. **Claim-strength derivation from raw proof.** `census.mjs` derives isolation/independence labels rather than trusting agent claims. Preserve distinct states `SCRIPTED / PROCESS_REHEARSAL / REAL_CHILD_CONTEXT / OS_CONFINED / VERIFIED_PARALLEL` with appropriately tested canary, process, workspace and timing evidence. Actual Z.ai subagent context must be inspected separately from filesystem isolation.
4. **Explicit isolation probes and write fences.** `isolation.mjs` plants canaries, checks unexpected changes and scans leaks; good defense-in-depth, but **not** a replacement for OS sandbox, tool ACLs or safe symlink resolution. A canary cannot detect a silent unauthorized read. Use separate runtimes as primary controls; use canaries/fences as challenge tests.
5. **Independent evaluation sequencing.** `evalkit.mjs` freezes probes before seeing submissions, stages anonymized entrant outputs and separates hidden oracle, raw output and narrative claims. A separate evaluator/context must still be proven; pseudo-blinding in a shared model history is not genuine independence. C-Benchmark may operate tests but never self-certify under the established three-track contract.
6. **Mechanically reproducible selection.** `select.mjs` applies fixed margin criteria and reports ties/no-eligible; retain raw dimensions, Pareto and confidence alongside any score. Penalize incomplete evidence, and include complete setup+token+model/refresh costs. Do not use code LOC as a generic tie-breaker where correctness/maintainability risk dominates.
7. **Controller recovers from durable state.** A canonical ledger+manifest lets the agent determine open steps after a lost chat or crash. Do not treat a resumed narrative as evidence of old jobs. Record `UNKNOWN_TERMINAL` and appropriate idempotence/replay tests.
8. **Cockpit independently revalidates evidence.** Its K0–K8 design tests independent chain and selection implementations against conformance vectors, then ingests actual persisted data. This is more valuable than four animated agents with fake metrics. Make full-stack, streaming and browser tests real and use tested transport (AG-UI/OTel only when justified).
9. **Negative-result integrity.** The toolkit has malformed-ledger, incomplete-artifact and counterfeit proof fixtures. Promote fixtures as reusable benchmark methods, while keeping any previous raw simulation clearly SAMPLE and not real production evidence.
10. **Clear staged capability labels.** The submission consistently distinguishes `DESIGN`, `SIMULATED_TEST`, `LIVE_TEST`, `MEASURED`, and makes adapted context semantics explicit. Keep those warnings with every exported pack; they pair naturally with mandatory all-maturity publication.
11. **Human-custodied oracle separation.** Encryption and delayed release make useful contamination controls when a genuinely independent owner controls key material. Allow an independently pre-registered hidden holdout runner instead of requiring humans to paste keys for every turn; no key may be invented or silently derived.
12. **Source-based consult accounting.** `consult.mjs` records actual Git anchors and outcomes; extend to real adapter/model request IDs, distributed traces and provider tokens. `SCRIPTED` consults remain mechanics tests only.

## High-priority deficiencies and corrections

**P0 — This is a two-track, two-turn runner, not the current six-arm general lab.** Original A Lean vs B Network, A1/A2/B1/B2, with per-round two manual turns. It lacks the additional one-round-lagged ecosystem C track, C1/C2, independent three-way benchmark role and immutable knowledge embargo. Under new organization, use the program as Claude's **proposal-specific developmental harness**, not the live general Z.ai governing protocol. For future proposal-specific sessions two internal variants with four arms are fine, but do not name them general A/B or claim C exists. Introduce C only when separately executed and measured.

**P0 — Every-turn pack publication missing.** Original Turn A ends in `AWAITING ORACLE KEY` and Turn B emits final closure. Neither universally guarantees complete pack export at EACH bounded top-level turn; the old nine-output closure list is not an all-state capability inventory. Add an independent `PUBLISH_TURN` closure to every turn, including Turn A (pre-oracle), Turn B, stopped/blocked turns, and a parent reconciliation of failed child pack deltas. A no-work turn still publishes a complete status index; immutable refs can avoid copying unchanged blobs. Publication is independent of test score.

**P0 — Missing owner-only oracle keys.** ZIP contains sealed AES-GCM oracles but **no** `OWNER_ONLY_ORACLE_KEYS.txt`; that is intentional by the author. The prescribed Turn B commands cannot decrypt the supplied oracles without legitimately supplied owner keys. Do not brute-force keys, reinterpret cipher blobs as proof, or fabricate results. Provide a safe alternative with independent judge-owned fresh holdouts precommitted before submissions lock, or ask the real owner to supply keys directly to a controlled evaluator outside contestant contexts. Until then the sealed-oracle branch is BLOCKED.

**P0 — Real subagent isolation is unproven.** `e2e.test.mjs` runs four scripted code variants sequentially; `census` has tests for evidence labeling but no real Z.ai child handles or overlapping session intervals in these files. Before promoting a real multiagent trial require four separately created model contexts, actual process/tool attribution, fresh canary privacy test, workspace/OS confinement limits and concurrent overlap evidence.

**P0 — The architecture manifest has a hash mismatch.** Recompute/repair new clean distribution manifests as separately versioned artifacts; preserve original mismatch and both hashes in import report. Do not silently bless its original `MANIFEST.json`. Rerun both test suites after relocation and all planned modifications.

**P1 — Fixed C1–C8 is a benchmark task bank, not the eventual system inventory.** The runner preordains eight components and single-choice round assignments. This is acceptable as a **controlled seed Ω task suite** but conflicts with our end state of emergent capability packs. Separate seed-task IDs from released pack identities. P/Q authors choose, split, merge and retire packs discovered in their research. Do not require a C1–C8 final architecture.

**P1 — Framework choice unverified.** The Cockpit doc assumes Next.js + Prisma + SQLite from observed session comments, but the included pack does not prove hosted Z.ai capability, run commands or installed versions. Test actual full-stack substrate, browser, database persistence and export; select technology after machine census. Native Node tools depend on `sh` for some census probes and need Windows-safe execution and quoting checks.

**P1 — Tool usage observability incomplete.** `consult.mjs` tracks number of consults/findings and stale-use flags, not provider-reported input/output/cache/reasoning tokens at every parent/child model call or true billing. Roll out a cross-call usage ledger with quality flags and include failed/timeout costs, parent-child rollup, provider quotas and full integration overhead. Never treat unavailable tokens as zero.

**P1 — Structural fairness limitations.** Synthetic oracles do not demonstrate independent evaluator behavior. A two-track score with A no-cognition vs B consulted cognition also changes total model compute; source-pack controls, same-pack fresh model reviewer, and task pressure/scale comparisons are necessary to attribute gains to residency rather than extra inference. Set E0/E1/E2 genuine cognitive count explicitly, and incorporate a project complexity-pressure stage beyond Prompt Fanout Mini as Claude proposes.

**P1 — Workspace and source integration.** Team's `track-a/main` and `track-b/main` and per-arm Git repos are legitimate isolated benchmarking artifacts, but never let them become permanent 'owned branches' on VOMEGA main. Import only independently accepted pack releases/candidate snapshots through reviewed integration with single consolidated main; preserve temporary repo states by SHA refs/artifacts. Do not automatically consolidate `consult.mjs` if proposal-specific, as the author already correctly noted.

**P2 — Excess process overhead.** Fixed two-turn human-key protocol, large matrices, and rigid steps may slow the smallest useful initial slice. Measure orchestration wall time, system startup and judge cost before enforcing every mechanism. Keep bounded automated alternatives for hosted runtimes that cannot safely use shell or encrypted oracles.

## Fit to revised organization

| Content received | Correct home | Decision |
| --- | --- | --- |
| Claude `outputs/claude` ECP docs, architecture specs, schema, simulated kernel | `02_ARCHITECTURE_PROPOSALS/claude/` | Import core architecture; preserve original source truth and simulation labels |
| Claude team charter, R0–R6 plans, child-arm/evaluator schemas, selectors, encrypted oracles, fixtures, Z.ai prompt and tools | `03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/runtime/pack/team/` | Import **development system**, not architecture; do not activate automatically |
| Architecture-specific `BUILD_SEQUENCE.md` and live launch notes | `03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/` | Preserve as proposal implementation plan, not universal baseline |
| Selected cross-lab practices | `03_DEVELOPMENT_SYSTEMS/SHARED_EVIDENCE_PRACTICES_FROM_CLAUDE.md` | Adapt as source-neutral requirements, not code enforcement |
| Complete-upload archive provenance, SHA and integrity issues | `03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/IMPORT_REPORT.md` | Immutable attribution and limitation record |
| Every-turn all-state publication requirements | `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md`; Claude dev overlay | Use as higher-precedence shared law; apply at safe checkpoint |
| Original A/B/C general lab | `03_DEVELOPMENT_SYSTEMS/general-zai-lab/` | Existing Round 1 untouched |

## Suggested first Claude-specific Z.ai development tests

1. **Boot and verify packaging** on the actual execution OS, rerunning 61 local source tests, identifying mismatched original manifest and verifying successful native development-tool operation without changing creds.
2. **Publish all-status Turn 0 portfolio** even before oracle release: architecture capsule/verifier, journal, protocol proposal and orchestration toolkit as appropriate with honest statuses, all source content and known failed/untested fields. No maturity gate.
3. **Prove four live subagents** and source/workspace confinement before accepting the program's multi-agent claims. The supplied scripted fixture proves only process rehearsal.
4. **Resolve holdout custody** using genuine owner-supplied keys or independently controlled fresh tests; no fabricated key and no postponement of the all-pack publication while waiting.
5. **Run matched O1-vs-Claude architecture tests** after both have independent builder evidence, including E0 source-pack controls, E1-S/E1-P distinctions, E2 only when real contexts exist; do not presume the smaller Ω seed proves context economics.
6. **Bootstrap live full-stack observability** only after actual substrate census and a minimal journal/API/UI round-trip; keep tested K0–K8 conformance vectors where still applicable and label assumptions.
7. **Extract useful capability packs naturally** rather than declaring that C1–C8 are the end-state package list. Independent agents should be able to retrieve even rejected or partial packs from EVERY completed turn.

## Recommendation

Adopt Claude's **evidence integrity discipline** aggressively, keep its **capsule-first ECP v0.2** as a genuine competing architecture, and **do not universalize the v0.2 turn-by-turn team choreography**. The best immediate deployment is a **separate Claude Z.ai proposal lab** seeded with the uploaded runner, layered under the shared per-turn publication and isolated-fan-out contracts. This preserves original authorship and enables a causal comparison of our initial ECP hypothesis against a distinctive alternative.
