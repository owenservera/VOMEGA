# Full-Stack Experiment Cockpit — UX and Honest Visibility

## Screen 1: Launch and seed

Select an immutable project seed, inspect its build/test readiness, define a round budget and experimental hypotheses, view available model/executor capabilities and preview exactly which four child contexts will be created. Show environment and sensitive-data preflight status before enabling execution. A one-click launch only becomes enabled after isolation capabilities are proven; otherwise explain the missing proof and the verified fallback path.

## Screen 2: Live experiment room

Four distinct arm cards arranged under Master A and Master B; each shows task, subagent/runtime identity, model, context lineage, worktree, start time, current state, latest durable event, live token status, remaining budget, test progress and source changes. A compact live timeline exposes overlapping execution periods so true parallelism is visually inspectable. Do not display animated progress without corresponding real events. Clearly distinguish QUEUED, RUNNING, BLOCKED, FAILED, TIMED_OUT, CANCELLED, DONE-UNVERIFIED and ACCEPTED.

## Screen 3: Elephant cognitive console

Shows E0/E1/E2 configuration, active Elephant count, domain allocations, true session identities, loaded snapshot hashes, incorporated Git epoch, context capacity, current occupancy and estimated headroom, queued consultations, stale citations, consult outcomes, flush/rotation events and fallback rate. For E2, visualize actual cross-node consultations and unresolved disagreements. An Elephant card is not considered ACTIVE without a successful real model consultation tied to a valid epoch.

## Screen 4: Evidence and experiment comparison

For every arm, let the operator open actual test logs, patches, model/tool events, token provenance, browser recordings/screenshots when available, errors, and evaluator decisions. Present the pre-registered hypothesis beside measured outcome. A/B master comparison should expose correctness, verified throughput, token economics, failure recovery and confounders—not just a one-number champion badge.

## Screen 5: Master learning and next-round planner

Show two independent “learned from this round” documents, each with ADOPT/ADAPT/REJECT/DEFER choices and exact evidence links. Show both runnable master approach versions, their lineage and the four proposed next-round experiments. After a master absorbs a rival mechanism, record the transfer and guard test. Refrain from silently converging designs.

## Screen 6: Controls and safety

Pause/resume round, cancel child/arm, disable model lane, throttle quota, request evidence export, inspect uncommitted changes, review proposed patch, begin a *verified* context rotation, and fallback to E0 with explicit operator visibility. Read-only view should require no privileged tokens. Actions should have permission checks and confirmation for potentially destructive changes, especially any access to the source project's original directory.

## Visual language

Communicate machine versus model actions visibly, borrowed from Ω's interpreted-command language: separate iconography for deterministic tools, real model sessions and inferences; a discrete freshness marker (current, behind, unknown); progress justified by actual persisted events; accessible contrast; non-color cues for failures; compact summary expanding into evidence; no decorative telemetry. Unknown values show “unknown”—not `0` or invented estimates. UI stays usable on desktop, with compact mobile read-only view when feasible.

## Acceptance test

An independent user must be able to answer from the running UI: (1) which four children actually ran and whether they overlapped; (2) what each spent; (3) what tests passed; (4) what Elephant source epoch was used; (5) which candidate master approaches were updated; (6) what failed and why; and (7) what will be tested next. All key values must map back to durable backend records.
