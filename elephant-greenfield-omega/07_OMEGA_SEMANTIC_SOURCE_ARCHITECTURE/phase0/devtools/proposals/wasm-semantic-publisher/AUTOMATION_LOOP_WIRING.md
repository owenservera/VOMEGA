# Automation Lab Wiring — from a typed correction to a tested semantic-compiler improvement

> **Rule 1 precedence:** [Machine ↔ Human correspondence drives the semantic learning loop](../../../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md). All candidate changes in this factory should trace to an observed or clearly simulated intent/source/representation discrepancy and replay through the shared Machine/Human core; this is ONE continuously evolving effort.


**Status:** conceptual topology and executable-lab blueprint. **NOT RUN.** This document describes how to accelerate the *last stage* of a broader LLM-native automation factory; it does not impose Wasm/TypeScript constraints on upstream Elephant/agent teams.

## The end-to-end circuit

```text
HUMAN / SCRIPTED INPUT
  text box ──▶ Wasm interpret+render(current contract) ────▶ provisional Plain Reading
     │                        │                              + source-linked live Wiki
   Enter                      └─ revision/alternatives/proof status
     │
     ▼
ONE immutable semantic publication (content hash + source/contract epoch)
   ├─▶ Machine view: raw versioned envelope
   ├─▶ Human view: render envelope only; same meaning/id
   └─▶ developer feedback "not what I meant" -> proposed correction
                                            │
                                            ▼
CASE INTAKE + TRUST LABELS  ──▶ EXPERIMENT DESIGN / HEURISTIC MINIMIZER
 {input, observed, expected?,           │
  source/engine, why, cohort}            ├─ Elephant source-grounded research
                                        ├─ candidate grammar / compiler modifications
                                        ├─ candidate rendering/wording modifications
                                        ├─ candidate entity resolution rules
                                        └─ candidate Wiki dependencies/templates
                                            │
                                            ▼
COMPILE candidate → versioned IR/contract image or Wasm module
                                            │
                                            ▼
DATA-ONLY / SANDBOXED COMPETITOR RUNNER ──▶ 1K..N microcases in DOM-free Wasm batch
                                            │
                                            ▼
INDEPENDENT ORACLE / NEGATIVE CONTROLS / HELD-OUT CORPUS
   status; exact args/payload; false READY; reading completeness;
   human-fact parity; wiki-source integrity; latency/cost/throughput
                                            │
                                     ┌──────┴──────┐
                                     ▼             ▼
                                  FAIL/PARK    PASS CANDIDATE
                                  immutable         │
                                  witness           ▼
                                             Change Lab impact
                                             contract/wiki/test delta
                                                    │
                                                    ▼
                                               reviewer/GATE
                                                    │
                                                    ▼
                                    atomic activate in LAB (not production)
                                      new version/rollback pointer
                                                    │
                                                    ▼
                            Live Lab reloads; same text, fresh reading+Wiki
```

### Where the three existing tools connect

| Existing tool | Reads | Writes | New proposed bridge |
| --- | --- | --- | --- |
| Ω Live Lab (Phase 0 devtools) | Phase 0 Python engine and its source hashes | Typed observation, correction proposal, mock effects under existing gate | Add a replaceable **Wasm publisher adapter** in parallel; compare UI-derived publications to Python reference. Do **not** silently swap the interpreter. |
| Ω Experiment Runner | Explicit `USER_PROPOSED_NOT_INDEPENDENTLY_VERIFIED` cases and data-only candidate answers | PASS/FAIL witness for declared fixture cases | Import canonical publisher envelopes + compiler revision + batch outputs; continue data-only intake until isolated execution is available |
| Ω Change Lab | `omega.osl` declarations, source provenance, current tests | Source-linked Wiki facts and conservative dependency impact | Consume the same compiled Wiki fact graph as the Wasm publisher, track source-scoped invalidation, reject false documentation |
| Elephant product/harvest/worker teams | Provenance and source-bound proposals | Bounded candidate code/contract variants and complete packs | Propose and challenge grammar/reading/wiki changes; never grant publication authority, mutate evaluator holdouts or override permission gates |
| Independent referee (new role, not necessarily a sixth computer) | Frozen reference, counterexamples, holdouts, candidate results | Verified scorecard + decision / impact map | Unbiased compare; approve candidate for **lab** activation only with cited evidence |

**Important:** Current code in `phase0/devtools/` is a Python-backed prototype; this proposal does not change that implementation or relabel its test evidence. The Wasm publisher should be a new candidate under a dedicated experimental adapter until conformant.

## Fast micro-loop design: three nested timescales

### Inner loop: every keystroke, current accepted contract

- Input event -> monotonic revision -> Wasm interpret -> deterministic reading + source-linked Wiki selection.
- Precompute and cache `(contractHash, capabilityId) → WikiFactGraph`; on input, update only changed meaning/facts. Do not rebuild the whole Wiki for each character.
- Suppress stale asynchronous results. Show `Current source`, `Input rev`, `READY/NEEDS_CHOICE/...`, candidate alternatives. If the interpreter is slow, keep explicit `EVALUATING` rather than display a previous result as current.
- Human sees readable semantics; Machine can expose canonical output for developers. Both are projections of one in-memory candidate snapshot.
- Enter freezes the exact input/contract revision into a publication. New input starts a new snapshot; no automatic tool execution.

### Middle loop: candidate refinement after a correction or source edit

- The human correction is an **expectation proposal**, not an accepted golden truth. Save the full case with reason: wrong account, payload swallowed, missing consequence, poor Plain Reading, ambiguous options, Wiki mismatch.
- Case classifier extracts a minimal reproducible example; add neighboring positive controls (the phrase SHOULD parse) and negative controls (must abstain or ask).
- Agents fan out **inside their owning computer** to alternative grammar, resolver, template and Wiki-graph strategies; publish every attempted candidate including failures.
- Compiler generates a versioned contract image. Optimize rebuild granularity: e.g., rewrite a `say` template without rebuilding recognizer, but keep source hash and proof cohort coherent. This is a hypothesis to test, not an unconditional feature.
- Evaluate in a **single long-running Wasm instance** on batched cases where feasible. Avoid launching subprocesses/browser pages for each utterance. Send one bulk batch through JS↔Wasm or a non-browser Wasm host, collect compact status/digest/reading/trace counters and sample witnesses. Measure cost of conversion and setup, not just inner parse.
- Run a source-independent oracle and sealed hostile cases under independent custody. An LLM can suggest candidate expected meanings, but cannot secretly overwrite them after seeing results.
- Feed failures to Change Lab's declared/observed graph; compute which capability, reading template, Wiki fragment and tests changed. If a dependency is only INFERRED, maintain an uncertainty flag rather than skipping other tests.
- Promote only tested candidate images to a **LAB cohort**; keep prior contract available for rollback and A/B side-by-side sessions. Avoid rewriting the historical Run A fixture/engine.

### Outer loop: repository and Elephant publication

- Record every candidate with source/contract hashes, experiment intent, status, cohort, logs, evaluator version, environment, total wall time (including compile+validation), false-execution counts and rollback source.
- At end of each top-level agent turn, publish the full all-maturity portfolio (DISCOVERED, PARTIAL, FAILED, BLOCKED, VERIFIED, RETIRED, UNCHANGED), not only winners, in the existing `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md` format. The in-browser Enter snapshot is a per-input semantic artifact; it **does not replace** controller-turn release.
- Main branch remains consolidated; short-lived worktrees allowed. Owner approval required for modifying active contracts beyond the experimental lab or real providers.

## Example correction and challenge matrix

**Known historical case:** `tell chatgpt personal account balance please`. Run A can report READY with competing parses. Under the proposed Wasm kit, direct effect remains blocked. A human selects "account balance please" as payload and creates `USER_PROPOSED` case.

Candidate strategies and checks:

| Arm | Change | Likely positive | Must catch |
| --- | --- | --- | --- |
| A Reference | Existing deterministic grammar | Frozen 39 corpus + 140 READY; existing generated utterance cohorts | Ambiguous READY *warning* mistaken for safe execution |
| B Conservative resolver | Preserve more target/payload alternatives | Fewer silent mistakes | Over-rejecting valid commands (refuse-everything) |
| C Boundary-aware grammar | Rework target vs payload segmentation | Better phrasing coverage | Lost `please`, account/model drift, changed quotes |
| D UI disambiguation | Show structured choices rather than silently deciding | Lower correction steps for humans | Confirm enabled on unresolved alternatives |
| E Wiki-derived explanation | Show matched `hear` line and source-backed `why` | Better explainability | Stale source anchors or invented documentation |
| F Wasm compiler strategy | Optimize IR tables/rebuild/hot path | Lower total iteration time | Language/Unicode divergence from Python baseline |

An **experiment packet** must contain input bytes, source/contract hashes, expected or adjudication-needed outcome, actual author implementation response, public regressions, private holdout receipt (not its contents), candidate ID, fixed measurement setup and stop conditions.

### One hypothetical run: no fictional benchmarks

1. C2 (independent referee) creates a held-out payload/target boundary test and freezes its hash.
2. C1 or any semantic worker edits a candidate resolver in an isolated worktree.
3. Build returns `contractHash=B`; baseline still `contractHash=A`.
4. Test thousands of cases with both A and B, record exact false READY/over-reject counts and total elapsed time; report `UNKNOWN` for any unavailable cost metric.
5. Change Lab reports that `cap:prompt.send` is affected, along with the relevant Plain Reading and Wiki facts, and flags missing static-analysis edges.
6. Reviewer accepts or rejects version B for the *experimental lab*. One atomic swap updates all new input views; snapshots from A are still replayable and labeled old.
7. The same text typed again yields a B-version interpretation and B-version Wiki. The old A publication never mutates.
8. Agent publishes winner, loser, counterexample and rollback as full capability-pack evidence. No real external provider receives a prompt.

**Near-instant means replay and feedback can be machine-speed**, not that a human-proposed rule is instantly safe for release. Compile/proof/independent-review latency is measured separately and may dominate.

## Candidate operation surfaces

**Wasm semantic functions** (names illustrative): `loadContract`, `evaluateText`, `renderReading`, `renderWikiFacts`, `freezePublication`, `batchEvaluate`, `compareSnapshots`.

**Host UI**: text box, live Plain Reading, source revision, capability status, semantic alternatives, expandable "Why?", source-linked Wiki, Machine/Human switch, Enter-to-publish, copy/export canonical bytes, correction capture. All commands in two modes use one frozen publication; screen reader text is also generated from same facts.

**Candidate intake**: immutable ZIP/repo source with `manifest.json`, binary/module hash, compiler version, adapter schema, `scorecard.json`, `counterexamples.jsonl`, tests and full capability packs. Treat untrusted candidate execution as unsafe until a real isolated runner is available; retain data-only import in the meantime.

**Batch harness**: corpus batches with deterministic ordering and seed; typed buffer/length ABI; warm and cold runs; structured result buffer and compact summary; mutation negative controls; reproducible recording of hardware/runtime, source and compiler outputs.

## What would make this architecture fail

- Compiling candidate grammar takes longer than incremental Python/JS evaluation and dominates experiment turn time.
- JS↔Wasm memory copying or string handling makes interactive update slower or less correct.
- The proposed TS-family Wasm toolchain cannot maintain source-to-Wiki trace fidelity.
- A Wiki renderer updates visually but presents stale or unverified assertions.
- Fast variant search memorizes public fixtures and increases held-out silent false READY.
- Publication modes agree on an ID but not on all meaning-carrying fields.
- Safety blocks everything and is misleadingly scored as a win.
- Running a Wasm module in a browser does not automatically make external candidate code sandboxed or permission-safe.

If falsified, keep the **one-source/two-view publication invariant** while replacing the implementation strategy (e.g. lean TypeScript JS hot path). A proven portable behavior contract is more important than Wasm ideology.

## Early milestone and exit gate

One executable **mock-only** Wasm input kernel, one text box, one live Plain Reading, one matching Wiki fragment, one Enter snapshot, Machine/Human parity check, one correction feedback packet, one 1,000+ case DOM-free batch check, one source change with version invalidation, and one independently reproduced regression. All results must be measured and labeled; no premature product claim.

This milestone is **PROPOSED**, **NOT BUILT** by this documentation-only commit. See [benchmarks](BENCHMARKS_AND_EXPERIMENTS.md) for how to choose the next architecture.
