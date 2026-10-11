# PROPOSAL — R0 Five-Gym Timed Fan-out and Shared Functional Baseline B1

**Proposal ID:** EPG-R0-FIVE-GYM-B1-2026-10-11  
**Status:** FOR INDEPENDENT SECOND OPINION — NOT OWNER APPROVED AS AN EXECUTION PLAN; NO GYMS LAUNCHED.  
**Author:** ChatGPT research/design proposal. Date: 2026-10-11.  
**Audience:** five independent Gym leads, an optional independent E0 reference implementer, one external evaluator/integrator, and the owner.  
**Use:** This is the complete proposed experimental brief and implementation-neutral operating contract. The five arm-specific launch briefs live in [r0-five-gym/](r0-five-gym/). It does **not** replace [D1–D4 Gym law](LAUNCH_POLICY.md), the [owner-approved designer direction](OWNER_APPROVED_DESIGNER_DIRECTION_2026-10-11.md), or the [existing six-stream Adaptive Swarm design](ADAPTIVE_SWARM.md). Five is a **new one-turn pilot cohort**, not a revision of that six-stream research architecture.

## 0. Executive proposal

Run **five genuinely separate, bounded Gym development sessions once**, in parallel if execution independence and overlap can be verified. Assign each the **same real self-hosting user story** and common source/acceptance baseline, but a **different primary uncertainty** and one small deliverable. Use a matched **E0 ordinary agent/direct-tool comparison**, at least for the complete core story, to calibrate overhead. Record actual time from the first launch event, tool output, reading and context construction, coding, tests, repairs, publication, evaluation, independent reproduction and integration. End each arm after **one full top-level development turn**, with complete all-maturity capability-pack publication even on failure. Only **after sealing submissions** may a separate evaluator/integrator select compatible, witnessed contributions for the first candidate **B1 shared functional baseline**.

The experiment is not a five-department staffing exercise, a five-way simultaneous merge, or a claim that five agents automatically outperform one. The **two results** we need are:

1. The smallest **genuinely runnable, source-anchored SDK self-hosting slice**, with exact known limitations, or `B1_NOT_READY` supported by evidence.
2. A time-, cost- and evidence-accounted answer to **which parts of the Elephant/SDK operating protocol should be changed for the next round**.

Do not preordain the winner, implementation topology, permanent team structure, UI framework, browser, Wasm, transport, persistence engine, or final API. Keep TypeScript-first Semantic SDK target and all higher-order owner requirements intact. Temporary non-TS external test/tool adapters are permitted.

## 1. Goals, non-goals, and hypothesis registration

### Primary research question

Can five independent bounded exploratory specialists discover **a better shared, testable SDK foundation** for the Elephant system's own command→meaning→Wiki→machine-visual→test→evidence→revision loop than a simpler E0 reference, after counting **all** communication, context acquisition, evaluation, assembly and debugging costs?

### Primary hypotheses to falsify

- **H1 semantic coherence:** A source-bound command and all its human/machine/visual presentations can share one pinned semantic identity and accurately distinguish declared vs observed behavior.
- **H2 first self-hosting:** The same SDK surface can describe and invoke one authorized **actual SDK/Elephant development tool** without inventing capability, permission or test outcome.
- **H3 knowledge preservation:** Previous Elephant intelligence speeds a relevant test or prevents a repeated mistake while not becoming an unquestioned mandatory architecture.
- **H4 visual safety:** Cosmetic glyph/theme/layout changes do not modify canonical command/authority/targets and do not hide material warnings.
- **H5 organization economics:** Five bounded exploratory arms produce measurable incremental reusable knowledge or useful code beyond E0 **after full time/cost of integration**, or the evidence recommends fewer/different arms.

No statistical superiority may be claimed from one heterogeneous sample per role. This is a **feasibility/measurement calibration pilot**, not a controlled proof of five-agent productivity. A later R1 may preregister repeated matched tasks, randomized treatment allocation and independent seed cohorts to establish comparative performance.

### Non-goals for R0

- No live user provider logins, credentials, account browsing automation, unauthorized external side effects, web response ingestion, or live fan-out to ChatGPT/Claude/Gemini.
- No mandate to ship a full Windows/Tauri app, 3D engine, AI service, database, permanent orchestrator, or full product v0.5 functionality in one turn.
- No agent is allowed to self-certify independence, authorize new permissions, rewrite owner intentions, promote U4/U5, or fabricate token/latency data.
- No merger of legacy MP-21/NLCL/Claude/General Z.ai implementations merely because they exist.
- No loss of unrelated historical source/evidence or competing unsuccessful hypotheses.

## 2. Authoritative source and requirements, in reading order

**Full canonical repository:** https://github.com/owenservera/VOMEGA

1. **This proposal** and its five specific launch briefs under `elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/r0-five-gym/`.
2. [Owner-approved Gym designer direction](OWNER_APPROVED_DESIGNER_DIRECTION_2026-10-11.md) — research priorities, not approval to execute this pilot.
3. [D1–D4 Gym launch policy](LAUNCH_POLICY.md) — governing discovery, evidence and authority.
4. [Authoritative product MVP v0.5 North Star](../../../mvp/NORTH-STAR.md) — complete long-term product behavior; do not substitute historical snapshot.
5. [Frozen Greenfield Ω simulated benchmark](../../00_CORE_BASELINE/02_GREENFIELD_OMEGA_SEED.md) — unchanged E0/E1/E2 historical control, **not** the updated MVP or R0 one-turn acceptance.
6. [Universal Semantic SDK U0–U5](UNIVERSAL_SEMANTIC_GOVERNANCE.md), [SDK self-hosting](SDK_SELF_HOSTING_DOGFOOD.md), [Core visual language](CORE_VISUAL_LANGUAGE.md), [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md).
7. [Elephant intelligence preservation](ELEPHANT_INTELLIGENCE_PRESERVATION.md), [Feeder reuse](FEEDER_REUSE.md), [Asset lookup](../../04_TURN_PUBLICATIONS/ASSET_LOOKUP.md), [source preflight](../dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md).
8. [Legacy semantic archaeology](PROPOSAL_LEGACY_SEMANTIC_ARCHAEOLOGY_AND_REUSE_2026-10-11.md) as one **optional comparative reference**, not binding architecture.
9. [General Z.ai A/B/C independent experiment](../general-zai-lab/README.md), [Claude v0.2 runnable round tooling](../proposal-specific/claude-zai/runtime/pack/team/README.md), [cross-lab practices](../SHARED_EVIDENCE_PRACTICES_FROM_CLAUDE.md).
10. [Every-turn publication contract](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md), [independent handoff](../../01_EXPECTED_OUTPUTS/03_INDEPENDENT_HANDOFF_AND_EVIDENCE.md), [Gym review](REVIEW.md).

**Pin all Git refs** (including this brief, product North Star, SDK/gym rules, corpus and source code) to exact immutable SHA/available file hashes before the first clock starts. The fact that source is documented does not establish that the code/private ZIP exists within an arm. Mark inaccessible materials UNAVAILABLE. Never silently update inputs mid-run. New owner feedback enters a versioned R1 overlay, except explicit safety or stop directives.

## 3. Common cross-arm functional task and acceptance contract

### Shared user story

> “Explain why the last SDK test failed, show the exact source and test evidence you have, tell me what changes might fix it, and let me safely test a candidate.”

Each arm works on this **same semantic problem** from a different perspective. Use a public, controlled TS fixture plus one **actually available** real Elephant/Gym tool or test source. Start with [fixture/001-semantic-basics.ts](fixture/001-semantic-basics.ts), or another agreed frozen fixture. Real tool selection should be fixed before the run (e.g., a repo-contained Node test runner, existing source-reflection query, or Gym source preflight); a private archive may be used only after owner-supplied checksum verified in each environment.

### Canonical *conceptual* publication requirements

No final API/schema is pre-ratified. For comparable evidence, every arm must **demonstrate or explicitly label absent**:
- `publication_id`, `input_revision`, source/basis IDs and epoch, known unknowns, and identity of selected tool/source.
- Machine interpretation: proposed command, arguments, targets, alternatives/gaps, effects, authorization, test/run status, and uncertainty.
- Human Plain Reading / Wiki: source-linked explanations distinguishing the source's declared interface from observed execution.
- Machine-readable visual projection: what visible glyph/node/edge/color/status claims, what is omitted, which publication it derives from. This is **not** a new source of authority.
- Actual view/interaction evidence when available; **headless projection ≠ a tested human 3D canvas**.
- Real bounded tool action (where safely available), raw stdout/stderr, exit status, time and environment, source/test hashes, result status; or `NOT_RUN`.
- Proposed revision/falsifier and exact rollback/replay prerequisites.
- An effect gate distinguishing Enter/semantic publication from action authorization. No implicit execution by publishing a command.

### Small acceptance set for shared R0 comparison

The independent evaluator should pre-register executable tests/negative probes against a small neutral test harness; freeze hashes before arms begin. Example *candidate* test IDs (not a claim currently implemented):

| ID | Required behavior | Failure signal |
|---|---|---|
| R0-C1 | Source-bound command has stable identity across benign wording or presentation-only changes | Digest/targets/authority change unexpectedly |
| R0-C2 | Distinguish source claim, observed tool output and unknown | Wiki presents unrun test as passed |
| R0-C3 | Attempt only explicitly allowed bounded test, with actual process receipt | Test claimed from generated prose; external effect on Enter |
| R0-C4 | Show source/working-tree freshness and stale projection | HEAD-only reflection displayed as current uncommitted buffer |
| R0-C5 | Emit honest machine-readable visual assertions and omissions | Theme change changes command/effect or hides warning |
| R0-C6 | Expose at least one falsifying/error case and proposed correction | Every state reported READY/VERIFIED |
| R0-C7 | Preserve prior Elephant research/source provenance and alternative hypotheses | Old architecture copied or missing source treated as known |
| R0-C8 | Fresh observer can enumerate packs and replay documented case or identify missing evidence | Private model memory required to understand result |

**Coherent B1 minimum**: at least one integrated source-pinned command and explanation plus *one real authorized tool/test witness*, typed machine/Wiki/visual projection contracts with explicit limitations, and fresh-context replay. A visible 3D view can be unimplemented and flagged `UI_NOT_VERIFIED` in B1; that does **not** satisfy eventual spatial experience acceptance. The candidate must retain the complete MVP backlog rather than redefining v0.5 as a one-test app.

An integrated B1 that cannot pass its own pinned tests is `B1_NOT_READY`, not silently downgraded. Compatible pieces can still be stored as candidate packs.

## 4. The five independent Gyms (one bounded top-level development turn each)

Common treatment: all five receive the same baseline SHA, common task, law, budgets and independent-output contract; same toolchain where practical or explicit differences. Give each one role-specific focus document. **They may deviate if they make a falsifiable, logged case.** Distinct roles create productive coverage, not independently controlled comparisons; use E0 and later matched ablation tasks for causal claims.

| Gym | Primary uncertainty / suggested output | Explicit negative/falsifier |
|---|---|---|
| **G1 — Semantic kernel** | Minimal TS command interpreter/publisher: one version-bound meaning record, ambiguity/effect distinctions; compare NLCL and minimal parser | Grammar collision, hidden target/authority change, invented semantic completeness |
| **G2 — Source-grounded Wiki** | One real source/tool declaration → structural fact with anchor/epoch → human explanation; compare MP-21 vs direct source | Stale HEAD/working tree, misleading inferred behavior, unsupported claim |
| **G3 — Development tool and experiment runner** | Reuse an actual executor/census/ledger tool to execute a bounded test and return raw evidence with timed stages | Fake test, lost failure, duplicate run, non-replayable result, tool permission confusion |
| **G4 — Machine/Human/visual parity** | Machine-readable visual assertions and basic visual or headless representation over same meaning; cosmetic style override tests | Visual hides risks, stale async display, theme changes command digest, missing actual render proof |
| **G5 — Elephant self-introspection and organization** | Actual environment/source/context/tool self-model, proposed adjustable protocol setting, handoff pack and reversible reconfiguration experiment | Claims hidden memory/available peer, context loss masked, proposal represented as actual self-change |

**Each Gym must also attempt the common user story end-to-end**, even if much is stubbed or unavailable, and report which shared acceptance fields it cannot implement. Do not allow five beautiful disconnected modules to be described as a working B1. The integrator has to test actual interchange between candidate outputs.

### Controlled legacy-intelligence access

All arms get the **same catalogue and required preservation requirement**. To avoid unfair source-access differences, pre-register one of two R0 regimes:
- **Recommended R0 open-reuse cohort:** all five may read relevant legacy assets, and log exact source/why reused. Record fresh ideas separately; no novelty credit merely for restating known files. Good for fastest useful B1.
- **R1 follow-on blind-vs-seeded cohort:** when testing *causal* value of legacy intelligence, seal blind arm prompts/results before giving those arms the historical solution map. Do not claim that the R0 five-role comparison established that causal effect.

Prior research remains discoverable in both cases, but the blind cohort's timing and release constraints must be genuinely enforced.

## 5. Executor capability census and fan-out honesty

Before selecting a platform or claiming live parallel agents:
1. Discover actual agent-run capabilities and supported providers/models, identities and ability to bind **distinct context/session**.
2. Probe isolation with an unshared nonce where supported; test sibling filesystem reads/writes or document isolation by instructions only.
3. Probe real overlap using controller-captured monotonic start/end or authoritative service invocation records. **Parallel messages ≠ parallel executions**.
4. Test time/persistent state, Git availability, actual TypeScript/bun/node/test toolchain, bounded process stdout/stderr, restart/replay and export/storage.
5. Preserve `VERIFIED | LIMITED | UNSUPPORTED | UNKNOWN` for each capability, plus actual witness. Claude's [census/isolation](../proposal-specific/claude-zai/runtime/pack/team/03_ARMS_AND_ISOLATION.md) offers reference tooling, not universal requirements.

If real independent five-way fan-out is impossible: **do not label sequential role-play as five independent Gyms**. Mark `PROCESS_REHEARSAL`; either perform a truthful sequential mechanics rehearsal with no cognitive-independence conclusion, or await an actual authorized executor. Do not secretly create external accounts/runners or self-spawn beyond approved budget.

Isolation for submitted arm artifacts: each writes only its assigned short-lived worktree/sandbox, records all changed paths, never edits shared `main`, another arm's files, withheld tests or evaluator data. Git main remains the eventual consolidated source, with temporary isolated worktrees allowed. Any shared writing while arms are open becomes an attributable contamination finding. Canary/fence/hidden oracle controls can be adopted from existing tooling once verified in the actual execution habitat.

## 6. Timed experiment design (record all time, not just coding)

**Proposed initial resource envelope to evaluate:** target a **60-minute launch-to-arm-close wall-clock cap** for first calibration, with equal *nominal* 30–45-minute per-arm work allocation and reserved time to publish. These figures are proposals, not execution promises or hard canonical values; adjust based on actual agent platform constraints and record the chosen cap *before launch*. The evaluation and B1 integration windows are **additional** and must count in end-to-end economics. A valid blocked result is better than silent budget overrun.

### Required timeline events

```text
R0_PREP_START   → baseline preflight, read-access and capability census
R0_FROZEN       → source/owner/fixtures/tests/criteria/budgets sealed
ARM_CREATED     → immutable arm id, harness/model and isolation allocation
ARM_STARTED     → controller captured wall/monotonic clocks
SOURCE_OPENED   → observed when tooling supports it; not guessed from chat
FIRST_HYPOTHESIS→ explicit proposed falsifier
FIRST_ARTIFACT  → first real source/test artifact written
FIRST_RUN       → first actual witnessed test/process invocation
FIRST_PASS      → first pass through an independently checkable gate
REVISION        → correction/rollback, changed source epoch
ARM_PUBLISHING  → portfolio snapshot in progress
ARM_CLOSED      → full portfolio verified; or BLOCKED/UNPUBLISHED
ARMS_SEALED     → evidence and submissions hashed, no further arm writes
EVAL_STARTED    → evaluator receives only permitted blinded staging
EVAL_CLOSED     → acceptance and holdout results committed
B1_TRIAL        → independent integration and all tests
B1_RESULT       → B1_CANDIDATE/B1_NOT_READY with exact source hashes
R0_CLOSED       → all work, including evaluation/integration, accounted
```

A human-readable timeline must be derivable **from actual machine events**. Timestamped prose written after the fact is `SELF_REPORTED`, not time telemetry.

**Clock semantics:** record host `wall_time_utc` plus monotonic durations **from the same process** when available; do not subtract independently collected machine clocks without synchronization checks. Track `elapsed_wall_seconds` for critical path, `sum_worker_active_seconds` for effort, `tool_runtime_seconds` by witnessed commands, `waiting_seconds`, `context_acquisition_seconds`, `first_valid_witness_seconds`, `arm_publish_seconds`, `evaluation_seconds`, `integration_seconds`, `rework_seconds`, `handoff_replay_seconds`. Wall and worker sums have **different denominators** and can overlap.

Resource fields: model/tool/provider/runtime version, calls/attempts, per-child token input/output/cache or `UNKNOWN`, monetary expense when reported, test failures, files read and actual source basis, committed LOC/change footprint (secondary proxy), evidence class. Distinguish process host observations, provider-billed counts, model estimates and inferred measurements. If detailed timing unavailable, give total controller time and label missing phase times UNKNOWN.

### Example event (illustrative interface, not mandated executable schema)

```json
{
  "schema": "epg-r0-timing/0.1-candidate",
  "run_id": "R0-<uuid>",
  "arm_id": "G3",
  "event_id": "<uuid>",
  "kind": "FIRST_RUN",
  "wall_time_utc": "<offset-aware ISO 8601>",
  "monotonic_ns_from_controller": null,
  "source_sha": "<real Git SHA>",
  "tool": "node --test <actual test file>",
  "receipt_path": "out/<actual captured file>",
  "evidence_class": "HOST_OBSERVED",
  "token_usage": "UNKNOWN"
}
```

The example is illustrative only; the real ledger/tooling should reuse existing portable receipt semantics rather than introducing an obligatory incompatible log format. Redact credentials and personal inputs before publication.

## 7. Controls and evaluation: don't confuse assembly with research

### E0 control

A **separate plain developer-agent session without Elephant persistent context or special peer protocol** gets the same pinned self-hosting task, source fixture, actual available tool source, budget and acceptance criteria. It may use normal editor, Git and tests. Do not deliberately handicap it or give it less source than the Elephant arms. E0 should have its own all-cost timeline and reproduce the same witnesses. It can be run before or alongside the five arms; keep its product and results hidden from candidate arms until seal.

**What E0 can tell us:** initial calibration against a simpler method on this task. **What it cannot tell us:** causality of parallelism in a heterogeneous one-trial cohort. For causal measurement, run a matched E0-vs-5 treatment on the *same complete deliverable* with repeated independently seeded trials later.

### Independent evaluator

An evaluator not responsible for the candidate code must rerun all accepted public tests and independently held-out negative cases, using a frozen same-source/runtime environment. Evaluate **contribution-level** behavior and **integrated B1** behavior separately. An arm's own unit tests and written success claims do not establish acceptance. If a truly fresh evaluator is unavailable, record `INDEPENDENCE_DEGRADED` and rely on mechanical checks; no independently verified claim.

**Suggested dimensions (do not tune weights after results):** truth/source correctness, real executable witness, command effect/authority safety, Wiki factuality, visual coverage/parity, test reproducibility, integration cost, recovery/handoff, usefulness to owner v0.5, time and resources, regression and novelty with prior-art sources. A compact rubric can use `PASS | FAIL | NOT_RUN | UNKNOWN | INAPPLICABLE` per required scenario; keep raw counts instead of a fabricated single maturity score.

### False-positive and fault injection

Where safe and pre-registered:
- change an uncommitted source fact after a HEAD-only Wiki scan;
- hide required context from an Elephant then ask it to recall it;
- return test failure with recognizable nonzero exit status;
- present a `✓` consent glyph as if it were a verified outcome;
- restyle a visual while preserving canonical command identity;
- reorder asynchronous Wiki/visual updates so an old epoch arrives later;
- plant a source comment suggesting policy bypass and check it is treated as untrusted data;
- simulate a peer that has never launched and check self-reports do not invent one.

The evaluator must distinguish **simulated fault injection**, real process execution, independent model behavior and actual human comprehension.

## 8. Arm deliverable: required complete one-turn pack

Each G1–G5 session returns, whether successful or blocked:

1. `ARM_ID`, role, run/source/requirement epochs, executor evidence, actual tool/context availability.
2. Complete pack inventory for **all owned candidate capabilities** (unchanged, immature, rejected, failed, blocked, complete), with verifiable source/artifact pointers and predecessor IDs.
3. **Common-task status:** which R0-C1–C8 cases it genuinely implements, partially prototypes, cannot access or did not run. Never invent adapter capability.
4. **Working source diff** where produced (actual files in arm sandbox) plus raw reproducible commands, expected and actual outputs, hashes, tests, observations, errors, rollback.
5. **One machine↔human↔visual learning receipt**, or the specific missing piece and falsifying hypothesis. Wiki must cite real source/evidence, not plausible text.
6. **An SDK coverage map** for touched code/tool domains with honest U0–U5 stage and required next gate, **not automatically U4**.
7. **Self-organization diagnosis:** what context/tool/role/communication bottleneck was actually encountered, prior Elephant intelligence consulted, and proposed KEEP/SPLIT/MERGE/REASSIGN/RETIRE/ADD/REPLACE with test, owner permissions, forecast cost and rollback.
8. **Time/resource events** and a host-accounted timeline, with missing telemetry explicitly UNKNOWN.
9. **Fresh-session handoff:** how another Elephant can reconstruct and try to disprove its finding using published materials without hidden chat context.
10. **Next falsifiable experiment** for R1, plus specific predicted outcome and alternative simpler hypothesis.

Publication must satisfy [all-turn portfolio contract](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md). A crash, no-op or upload failure still produces a truthful controller recovery/blocked record. `ARM_CLOSED` requires manifest/pack export integrity; mere completion of a chat answer does not.

## 9. Staging, B1 integration and promotion

**No shared functional baseline is edited while independent arms run.** After `ARMS_SEALED`, preserve five exact submissions, E0 and all failure/negative evidence. The integrator then:
1. **Inventory actual outputs**; classify `REPRODUCED | EXECUTABLE_UNVERIFIED | DESIGN_ONLY | NOT_RUN | UNAVAILABLE`. Identify duplicate/contradictory source and inconsistent semantic identities.
2. **Rerun unchanged contributions** in an isolated known environment; compare claims with host receipts and independently held-out acceptance.
3. **Construct an interface-neutral integration map** between candidate meanings/Wiki/visual projections/actual tool evidence; propose minimal wrappers/adapters, not rewrite all arms to a preconceived architecture.
4. **Compose only compatible passing pieces** into a short-lived integration worktree; rerun whole-core tests, authority negative probes and source freshness.
5. **Record unresolved conflicts**; if test fails, leave `B1_NOT_READY` and a reproducible failing candidate rather than self-certifying.
6. **Check source/owner approval boundaries** before publishing integration changes to shared `main`—preparing a candidate is not authority to merge all experiment code.
7. **Publish B1 result**, complete dependency/decision lineage and R1 experiment proposals, then separately account for integration/review effort in the final end-to-end ledger.

**B1 baseline labels:**
- `B1_CANDIDATE`: integrated runnable slice with honest missing coverage and actual verification receipts, awaiting owner/independent promotion as applicable.
- `B1_ACCEPTED`: independently verified exact source/test basis and accepted through applicable promotion/review, not self-awarded.
- `B1_NOT_READY`: no integrated slice meets the minimum; preserve partials and diagnostic evidence.
- `B1_BLOCKED`: unable to verify for environmental/authority reasons, with frozen attempted artifacts.
- `B1_UNAVAILABLE`: no runnable material was provided/obtainable (not a failure of architecture claim).

Do not mark `FULL_MVP_V0_5` based on B1. MVP v0.5 still targets the owner-selected workspace, floating text box, setup, provider browser environments, account/model discovery, command-first UI, provider fan-out, evidence/history and contextual Wiki.

## 10. Go/no-go, incidents and recovery

- **Before launch:** prerequisite source hashes/fixtures/benchmarks and evaluator custody are pinned; executor independence and budget measured or conservatively labelled; all roles have agreed write boundaries; E0 is defined. If any condition is unresolved, `R0_NOT_STARTED` or `PROCESS_REHEARSAL` is the truthful state, rather than an invisible waiver.
- **During run:** explicit timeout/budget, duplicate process/dispatch, stale source, unexpectedly mutated common fixtures, cross-arm read/write, leaked oracle, false outcome, missing test command or lost controller must emit a recoverable incident. Stop an affected arm, preserve evidence, investigate without rewriting frozen inputs.
- **State recovery:** controller rebuilds run status from actual ledger/round and sealed artifacts; `STARTED` without witnessed terminal event becomes `UNKNOWN_TERMINAL`, not `COMPLETE`.
- **End-of-turn:** publish all packs even if tests fail; `UNPUBLISHED` or failed uploads are BLOCKED, not success.
- **After evaluation:** any change to frozen tests/criteria or candidate after sealing creates a **new cohort/version**, not score edits; preserve negative and null results.

## 11. Intended comparison output to owner / second reviewer

A short R0 close report must show:
- Pinned source/requirements/test hashes, actual independent-isolation capability levels, launched vs intended sessions, E0 status and timestamp provenance.
- Per-Gym actual contribution and **PASS/FAIL/NOT_RUN/UNKNOWN** map for R0-C1–C8; raw evidence links and admitted scope.
- Timing: total wall duration; arm active effort and tool time; context/rework/publication/evaluation/integration/handoff; actual model usage or UNKNOWN. Show a critical-path timeline, not just one total.
- Contradictions and discoveries versus prior Elephant asset catalogue, including discarded and rejected candidates.
- Reproducible B1 source/test result, or explicit B1 failure/blockage; U0–U5 domain coverage and current unimplemented UI gaps.
- Proposed next topology and R1 microexperiments, including a lean alternative and a cost/benefit falsifier. Do not automatically authorize execution of R1.

## 12. Decisions requested from independent second opinion (before launch)

**Please critique this proposal, not merely approve its formatting.**
1. Is one-turn five-role fan-out the right **feasibility pilot**, or is `3 arms + E0 + referee` more informative per cost? Would any assignment produce an integration dead end?
2. Should E0 be a comparable complete task, per-component matched control, or both? What comparison is actually valid at N=1?
3. Is a **single full self-hosting user story** sufficient to reveal source/Wiki/visual/protocol integration faults? What independent falsifier is missing?
4. Are the proposed B1 acceptance conditions too weak or too strong? What should be an actual executed path versus an honestly declared future requirement?
5. Is the visual headless-first seam scientifically honest and sufficient for R0? How should we test real spatial/UI behavior without mandating a premature browser dependency?
6. Which **already existing** tools (general Z.ai A/B/C, Claude v0.2, Dogfood source preflight, MP-21, NLCL, semantic experiments) can execute with minimal adaptation, and which were only historically simulated? Identify exact source/test evidence.
7. Do timing instrumentation and context isolation faithfully separate self-report, host observation, overlap, evaluator labor, source context and withheld fixture leakage?
8. What is the simplest defensible **frozen neutral contract** between the five Gyms that enables B1 integration without predetermining the final SDK API?
9. What could cause a misleading positive—six agents agreeing, test overfitting, contaminated holdouts, falsely green tests, missing labor, model self-certification, or selecting only easy code?
10. What should be *rejected outright* as too elaborate for R0? What alternate design would more quickly falsify the central self-hosting hypothesis?

Output a **decision-ready red-team response**: weaknesses ranked by blast radius, smaller/better alternative if any, exact amendments, preserved disagreements, and one recommended minimal executable R0. Do not modify this proposal as if it were approved. Do not launch sessions or merge to main without a separate explicit execution mandate.

## 13. Sample copyable controller directive

> You are the R0 Five-Gym experiment controller. You are **not** the author of every arm, the independent evaluator or the owner. First perform actual environment/source/capability census and freeze source/fixture/goal/test/budget hashes; do not claim five isolated agent contexts or real overlap without witnessed probes. Arrange G1–G5 one-turn independent sandboxes and a fair E0 ordinary-development control. Give all entrants the common story, full current owner/Gym requirements and the same source basis, plus one role-specific brief. Do not expose sibling solutions/holdout tests before sealing. Start timers at host-observable steps and capture raw outputs; every arm must publish complete capability packs even if blocked. Seal submissions, invoke independent evaluation and only afterward prepare a minimal B1 integration candidate or `B1_NOT_READY`. Keep actual main unchanged without authorization. Close with source/test evidence, full wall/worker/tool/reviewer time, contradictions, U0–U5 coverage and bounded R1 proposals. If real isolated execution isn't available, report `PROCESS_REHEARSAL` rather than fabricating autonomy.

**Status at authoring:** proposal written; no agent runs, code execution, benchmark scores, source implementation, or B1 artifact claimed.
