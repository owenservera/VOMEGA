# VOMEGA product loop — ten bounded teams, one build

Status: OWNER-SELECTED OPERATING DESIGN (2026-10-09); **not** a claim that ten ZCode threads or automations have been launched.
Entry: root `AGENTS.md` → `.project/SITREP.md` → current Ratchet task/proof state. Setup: `zcode-setup/LAUNCH-PRODUCT-LOOP.md`.
Scope: accelerate the selected D1 executable semantic twin toward the smallest installable Windows floating command box; progressively improve the *existing* development automation as measured friction warrants. D1 simulation is not a live Provider release.

## Non-negotiable design

- **One product, one `main`, one Ratchet, one DESK.** This is a team allocation/experiment protocol, not a second PM, roadmap, capability registry, interpreter, Reflection graph or task queue.
- **Demand-pulled learning.** Historic `vivim-final`, `edge-pwa`, `vivim-omega` are a read-only knowledge reserve. Index source pointers cheaply, but extract/adapt/inject only when a current task, failing behavior or bounded experiment needs it. Do **not** import historic journeys, requirements, methods, tests or code wholesale.
- **Make useful MVP progress each cycle.** A finished release behavior or proven gate outranks team activity, speculative design, generic research and council ceremonies.
- **Independent observations are not product decisions.** Simulation results, UX opinions, Reflection claims and historic test results are hypotheses/evidence. Current Omega law, current source, tests, owner consent and proof gates determine adoption. A/B simulation never constitutes actual human validation or live Provider proof.
- **Bounded autonomous work.** Teams are logical standing missions with repeated fresh bounded agent runs, not ten unbounded high-context processes. Start at safe machine/model capacity, benchmark, then expand. Different accounts of `space-bunny-free` are one model family, not independent corroboration.
- **One writer per actual write surface.** Worktree isolation for product writers; test isolation for simulations; the shared DESK primary checkout stays stable. Review by a separate agent is automated review, not human review.
- Keep Provider ≠ Account ≠ Model ≠ Session, Capability ≠ Realization, intent ≠ execution, consent ≠ prose, Reflection/evidence ≠ authority, fixture ≠ live. Auth/model/provider configuration, expenditure, R-2/RD-8/RD-10 and consequential live actions remain Owen-reserved.

## The ten execution lanes

The ten lanes **include existing DEV and DEVops**; they are not ten additional management organizations. CoS coordinates via the existing DESK; existing PM (the five owner-selected acceleration programs) and COUNCIL (genuine contested D4/D5 questions) remain event-driven support, not extra standing product-build headcount.

| ID / DESK key | Standing mission | First bounded work / direct product benefit | Permitted write focus |
|---|---|---|---|
| 01 `devdrain` | Core DEV / deterministic command truth | Fresh Ratchet `D1-034` committed revision and `D1-020` synthetic registration; dispatch disjoint workers only | Ratchet packet-assigned code |
| 02 `execution` | Capability realizations / attempts / receipts | `D1-063` virtual `prompt.send`; verify consent→READY prerequisite and route upstream blocker rather than bypass | `experimental/d1/src/execute.ts` when claimed |
| 03 `semantic` | Historic semantic intelligence + bounded experimentation | Demand-led harvest of *one* current semantic/UX ambiguity or missing operation; present reuse/adapt/reject test | Read-only legacy refs, local experiments; code only after a DEV-owned task claim |
| 04 `visual` | User experience + visual semantic compiler language | Interpretive feedback for unresolved language, account routing, consequences and consent, using the *current projection* | `experimental/d1/src/ui.ts` only when task ownership is assigned |
| 05 `sim-a` | Human simulation A, control / observation | Matched synthetic user goals against baseline without source knowledge | Isolated simulator artifacts, no product writes |
| 06 `sim-b` | Human simulation B, treatment / exploration | Same goals/World/seeds, candidate visual treatment; counterbalanced A/B crossover | Isolated simulator artifacts, no product writes |
| 07 `evidence` | Replay, failure minimization and durable learning | Make A/B sequences reproducible through `session.run`; after prerequisites, `D1-070…075`, MP-55/56 *when useful* | Test/capsule/replay scopes under bounded claimed task |
| 08 `provider-lab` | Provider, Account and Session reality / drift | Synthetic conformance against current contracts; no live provider contact absent authorizations | Read-only / local synthetic fixtures |
| 09 `windows` | Integrated executable UI / Windows installability | Close `D1-082` runnable twin once prerequisites unlock; then smallest Tauri v2 Windows installable path | Launcher/app-shell scope, never semantic law |
| 10 `devops` | Isolation, machine capacity, safe integration and evidence truth | Prove DEV and new lanes do not corrupt each other's work; release gates, logs and push readiness | Existing DEVops/DESK infra; no product-code edits |

**Design choice:** no dedicated always-on *process design*, PM expansion or generic archaeology team. CoS, PM and Council continue in their existing roles. Unclaimed write surfaces remain unmodified.

## The shared product loop

1. **Actual build:** each tester pins `main` (commit SHA) and an explicitly synthetic World, actor instructions and treatment. Do not test a made-up UI or claim unimplemented execution exists.
2. **Explore:** A/B actors attempt goals through the product or existing semantic API (pre-UI). Actors must not see test expectations, source code, compiler internals or each other's transcripts. Observer/evaluator contexts are separate.
3. **Assay:** record goal, action sequence, initial World, build/treatment, observed/expected state, and the smallest executable reproducer; classify `BUG` (violates existing law), `UX_HYPOTHESIS`, `PRODUCT_GAP`, `UNKNOWN` or `DUPLICATE`. Do not label subjective dislike as a bug.
4. **Deduplicate and validate:** independent rerun on pinned code; include negative controls, guard against over-refusal/false READY/wrong Account, stale revision and consent leakage. Reject fabricated outcomes.
5. **Route:** verified bug to existing Ratchet/task owner; truly new product/authority proposal to CoS for Owen decision; a bounded presentation treatment to visual/UI team if within current scope. MP-55 capsules and MP-56 trace→fixture are optional existing consumers; not automatic new gate factories.
6. **Fix:** a single claimed worker changes only their packet surface, runs red→green with separate review and joins `main` through existing integration; no ten-way write race.
7. **Retest:** same pinned failure on new build plus fresh adjacent exploration; A/B results measured with actual task completion, wrong target, false READY, corrections, clarity and steps. No model-vote-as-proof.

**Experiment hygiene:** Matched initial World, goal, task difficulty, evaluator rubric and seeds. Randomize assignment and cross over A/B roles to reduce persona/model artifacts. Safety invariants are hard constraints, never traded away for UX conversion. Baseline/treatment are labels, not grant of authority or two concurrent semantic kernels.

## Semantic injection rule (no archaeology project)

A current DEV/UI/Evidence task may issue a `semantic` DESK question identifying (a) problem, (b) target source seam/gate, (c) what proof would change the decision. The lab may inspect specific prior code/tests/protocol experiments or an existing source index, then returns a **small candidate**: pinned source references, fact vs inference, method, failure lessons, small synthetic experiment, verdict `ADAPT`/`REJECT`/`LATER`. If adapted, source-native D1 declaration/contract/language data plus current gates own the implementation. MP21 Reflection identity/graph is reused, not cloned. Never transfer old journeys or undocumented claims to new product authority.

## UI / visual semantic language rule

Represent *the interpreted command*, not a fake chatbot or a second UI-owned interpretation. Visual grammar must expose: interpreted action; Provider/Account/Model distinctness; ambiguity and alternative intents; unresolved text span; readiness / reason; consequences; consent; virtual vs live maturity; result/uncertainty. Text and clicks emit the same `Action`/semantic edit to the same reducer; visual treatment cannot alter `UseCommand` or authority. Begin with one interaction change (unresolved remainder feedback) before building a complete design system.

## Acceptance gates / operational limits

- Current D1 board at `c74cf5b` reports **59/95** gates green at probe `ef94973`, 8 open frontier, 0 regressions. Re-probe locally before dispatch: checked-in board is not current runtime truth.
- High leverage frontier: `D1-063`, `D1-034`, `D1-050`, `D1-020`, `D1-045`, `D1-055`, `D1-048`, `D1-062`. Verify each at current HEAD; `D1-063` has an observed prior consent→READY upstream dependency and must not work around it.
- Earliest integrated demonstration: user expresses prompt → chooses correct Account by text or click → explicit consent → immutable command → **virtual** execution with SIMULATED receipt → deterministic replay. No live Provider claim.
- Launch initially 4 new team missions (`semantic`, `visual`, `sim-a`, `sim-b`) and existing DEV/DEVops. Expand the other four new missions only after the tester-to-Ratchet feedback loop works and local resource probes permit it.
- 24/7 is a *service objective*, not a promise of uninterrupted ZCode background agents: automation health must be measured (last start/result, watcher re-arm, queue latency). If capacity is exhausted, park exploration, not DEV's critical path.
- No hand edits to generated Ratchet boards or PM views; no new PM-managed programs or a second tracker. Program `MP-21/54/55/56/60` scope and owner build plan remain unchanged.

## Five metrics worth reporting

1. End-to-end synthetic user-goal completion (and evidence maturity).
2. Wrong-target rate / false-READY rate and other serious semantic regressions.
3. Median correction actions and abandonment/blocked attempts by treatment.
4. New **independently reproduced and deduplicated** findings that reached a reviewed fix.
5. Ratchet critical-path blockers cleared and the time from finding to integrated proof.

No credit for agent count, commits, docs, speculative simulations, or sheer number of test cases.

## Canonical existing system (do not replace)

- DESK protocol: `.project/staff/DESK/README.md`. Initial team setup: `zcode-setup/TEAM-AND-COMMS.md`.
- Code and proofs: `.project/ratchet/OPERATING.md`, `.project/ratchet/D1-BOARD.md` (generated), `omega-baseline/experimental/d1/`.
- Reflection reuse: `.project/deliverables/D1-REFLECTION-HARVEST-MAP.md`, `omega-baseline/experimental/reflection-migrator/`.
- Current PM accelerators: `.project/pm/scope.json`, `.project/pm/build-plan.json`. Do not extend owner-selected PM scope for this team change.
- Live-proof holds: `.project/live-proof/OWEN-DECISION-BRIEF.md`, `.project/live-proof/LIVE-PROOF-PROTOCOL.md`.

This document supersedes the *team-shape/priority recommendations* in prior planning; it does not replace source truth, tests, or owner law.
