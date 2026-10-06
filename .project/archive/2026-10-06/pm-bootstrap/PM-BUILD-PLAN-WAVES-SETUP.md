# PM Setup Directive — Owner-Selected Build Plan / Waves Layer

Status: OWNER-DIRECTED SETUP INSTRUCTION — ADD THIS LAYER, DO NOT ADD DECISIONING
Date: 2026-10-06
Source HEAD reviewed: 81113aa60b78722a044032db61cf51ab609de44e

Applies to:
- .project/pm/
- omega-baseline/experimental/pm/
- generated PM views

This directive adds one missing planning layer to the existing five-program PM system:

> an owner-selected execution/build plan over the already-defined phases

It does not authorize PM to choose work, rank programs, sequence strategy autonomously, widen scope, or create a scheduler.

## 1. Why this layer is needed

The current PM system already represents the five selected programs, deep Program Dossiers, five phases per program, phase objectives/outcomes, effort grades, LOC estimates/confidence, hard dependencies, soft dependencies, exit gates, cross-program unlocks, risks/open questions, and external dependencies.

That answers:

> What exists and what technically depends on what?

It does not yet cleanly record:

> Which independent phases does the owner want executed now, which should stop after a bounded point, what convergence milestone should trigger the next fan-out, and where should build capacity be concentrated?

Do not force this information into softDeps, risks, or dossier prose.

Add a separate owner build-plan layer.

## 2. Authority boundary

The build plan is owner-authored / owner-approved coordination state.

PM may:
- store it;
- validate references;
- render it;
- show which owner-selected entries are blocked/unblocked by existing gates;
- show when all conditions of an owner-defined milestone are satisfied;
- project it into human- and machine-readable views.

PM may not:
- invent a build plan;
- choose the next phase;
- rank the five programs;
- infer strategic priority from LOC or effort;
- start work merely because a phase is unblocked;
- alter wave membership;
- move a phase between waves;
- add another program;
- create an optimal order;
- convert dependency facts into strategy;
- automatically rewrite the plan from an LLM recommendation.

The build plan answers:

> What did Owen select as the current execution shape?

not:

> What does PM think should happen next?

## 3. New conceptual hierarchy

FINAL FIVE
→ Program Dossiers
→ Phase Roadmap
→ Dependency Graph
→ OWNER-SELECTED BUILD PLAN / WAVES
→ Work Packages
→ Tasks
→ Atomic Tasks / Ratchet
→ Proof

The dependency graph remains factual.

The build plan is an owner coordination overlay over that graph.

## 4. Minimal data model

Prefer one small owner-owned file, for example:

.project/pm/build-plan.json

Suggested conceptual fields:

- schema
- status
- authority
- sourceDirective
- rationale
- waves[]
- milestones[]

Each wave should contain:
- id
- name
- objective
- entries[]

Each wave entry should contain:
- program
- startAt
- executeThrough
- emphasis
- optional holdAfter
- resumeWhen[]
- optional note

Each milestone should contain:
- id
- name
- requiredGates[]
- unlocksWave
- optional note

Do not add:
- priorityScore
- recommendedNext
- optimalOrder
- autoRank
- autonomous scheduling fields

## 5. Required primitives

### Wave

A group of owner-selected phase ranges that may execute concurrently.

### Wave entry

Represents what one selected program should do during that wave.

### Emphasis

Use only:
- PRIMARY
- HIGH
- NORMAL
- LOW

This is not a score. It tells the execution team where additional capacity/review attention should go within an owner-selected wave.

### Build milestone

A conjunction of existing program gates defining an owner-selected convergence point.

A build milestone is not a new proof gate.

Example:

MP21-G3
AND MP54-G1
AND MP55-G2
AND MP56-G4
AND MP60-G1
→ ACCEL-M1 satisfied

### HOLD versus BLOCKED

The system must distinguish:

BLOCKED
= cannot proceed because a required technical gate is unsatisfied

HOLD
= owner chose not to proceed yet even if technically possible

This distinction is essential.

## 6. Initial owner-selected build plan

Record the following as the initial build-plan seed.

# Wave 1 — Independent foundations

Purpose:

> Start all five accelerator programs in parallel, but execute only the independent slices. Concentrate build capacity on the two substrate-producing lines: MP-21 structural self-knowledge and MP-56 trace→fixture. Use MP-54 and MP-60 primarily to define and validate consumer requirements before their deeper dependencies exist.

### MP-21 — PRIMARY

Execute:

MP21-P1 → MP21-P2 → MP21-P3 → MP21-G3

Wave-1 target:

MP21-G3 SATISFIED — stable queryable Reflection identities / graph exist.

This is the main structural spine. Additional capacity and independent review should preferentially go here.

### MP-56 — HIGH

Execute:

MP56-P1 → MP56-P2 → MP56-P3 → MP56-P4 → MP56-G4

Wave-1 target:

MP56-G4 SATISFIED — trace → fixture → replay reproduces the pinned property.

Use synthetic traces first. Do not block this line on live Provider traces.

### MP-55 — NORMAL

Execute:

MP55-P1 → MP55-P2 → MP55-G2

Then HOLD structural enrichment.

Resume deeper work after MP21-G3.

Wave-1 target:

MP55-G2 SATISFIED — a fresh worktree reproduces the selected failure under declared prerequisites.

### MP-54 — NORMAL / thin

Execute:

MP54-P1 → MP54-G1

Then HOLD.

P1 must extend or reuse the existing Ratchet packet mechanism rather than create a second context system.

Resume P2 only after MP21-G3.

Wave-1 target:

MP54-G1 SATISFIED — a fresh worker can begin a bounded task without broad project reread.

### MP-60 — NORMAL / requirements-only

Execute:

MP60-P1 → MP60-G1

Then HOLD.

P1 should produce the actual impact-query acceptance corpus and feed those requirements into MP-21 graph design.

Do not build a second source parser or structural graph before MP21-G3.

Wave-1 target:

MP60-G1 SATISFIED — impact question set has a named acceptance corpus.

## 7. Convergence milestone ACCEL-M1

Define:

ACCEL-M1 — Core accelerator substrates available

Satisfied only when all are true:
- MP21-G3 = SATISFIED
- MP54-G1 = SATISFIED
- MP55-G2 = SATISFIED
- MP56-G4 = SATISFIED
- MP60-G1 = SATISFIED

This is an owner-defined coordination milestone, not a new technical proof claim.

When satisfied, Wave 2 becomes available under the recorded owner plan.

PM may display:

> ACCEL-M1 SATISFIED — Wave 2 is owner-authorized by this plan.

PM must not independently change Wave 2 contents.

## 8. Wave 2 — Integration fan-out

Once ACCEL-M1 is satisfied:

### MP-21

Continue P4 and P5 where justified.

Do not allow later MP-21 phases to block consumers of MP21-G3.

### MP-54

Execute:
- P2 Source-aware bundle
- P3 Evidence/failure enrichment

Inputs:
- MP21-G3
- MP55-G2 as enrichment input

### MP-55

Execute:
- P3 Structural enrichment
- P4 Cross-agent diagnostic packet

Input:
- MP21-G3

### MP-56

Proceed to P5 Continuous harvesting only where useful real or synthetic observations exist.

Do not manufacture trace volume merely to execute the phase.

### MP-60

Execute:
- P2 Static structural impact graph
- P3 Runtime/test-observed edges when MP56-G4 output is available

Inputs:
- MP21-G3
- MP56-G4

Wave-2 purpose:

> Turn independently proven primitives into one interoperable development-acceleration system rather than five separate tools.

## 9. Wave 3 — Operational acceleration

Seed this as later owner-plan content, not immediately executable until earlier milestone conditions are satisfied.

Current shape:
- MP-21: compliance hardening / incremental use
- MP-54: P4 Adaptive context selection
- MP-55: P5 Automatic capture/minimization
- MP-56: P5 continuous harvesting as evidence justifies
- MP-60: P4 Affected-test selection

Do not execute MP60-P5 in this wave.

## 10. Late maturity

Later maturity work:
- MP-54 P5 measured optimization
- MP-60 P5 predictive impact/concurrency only after enough real history exists, its E4–E5 decomposition review occurs, and acceleration measurement can determine whether it earns continuation.

MP60-P5 should remain explicitly late.

## 11. Shared interoperability requirement

The five programs must not create five identity/evidence universes.

Before significant divergence, ensure compatible references for at least:
- SourceAnchor / source digest
- EntityRef or equivalent
- TaskRef
- GateRef
- TestRef
- FailureRef
- TraceRef
- FixtureRef
- EvidenceRef
- repository revision / HEAD

This does not require one giant shared schema.

The requirement is interoperability.

Example:

MP-55 capsule says affected EntityRef X.
MP-21 resolves EntityRef X.
MP-54 includes EntityRef X in task context.
MP-60 asks what EntityRef X affects.
MP-56 links FixtureRef F to behavior exercising X.

MP-60 P1 should help define consumer queries before MP-21 P3 freezes a graph shape.

## 12. Required PM implementation changes

Add only the minimum support required.

### Data

Add one owner-owned build-plan artifact, preferably:

.project/pm/build-plan.json

### Validation

Validate:
- referenced programs are in managed scope;
- referenced phases exist;
- referenced gates exist;
- wave IDs are unique;
- milestone IDs are unique;
- milestone unlocked-wave refs exist;
- phase ranges do not refer outside their selected program;
- emphasis uses the coarse enum;
- forbidden decisioning fields are rejected.

Do not validate whether the plan is optimal.

### Generated view

Add one generated view:

.project/pm/generated/BUILD-PLAN.md

It should show:
- current wave;
- wave entries;
- START / CONTINUE / HOLD intent;
- emphasis;
- current gate status;
- hold/resume conditions;
- convergence milestone status;
- next recorded wave.

Optional machine projection may live in existing generated JSON or a dedicated generated JSON if cleaner.

### Tests

Add tests proving:
1. out-of-scope program fails;
2. unknown phase fails;
3. unknown gate fails;
4. unknown wave/milestone link fails;
5. forbidden score/ranking fields fail under strict schema;
6. HOLD is distinct from BLOCKED;
7. milestone is satisfied only when every required gate is SATISFIED;
8. milestone satisfaction does not mutate program gate state;
9. PM does not choose a next phase when multiple entries are available;
10. generated build plan is deterministic for the same inputs.

## 13. Required BUILD-PLAN view

A useful shape:

CURRENT OWNER BUILD PLAN
ACCEL-W1 — Independent foundations

MP-21: P1 → P2 → P3, PRIMARY
MP-56: P1 → P2 → P3 → P4, HIGH
MP-55: P1 → P2 then HOLD, NORMAL
MP-54: P1 then HOLD, NORMAL
MP-60: P1 then HOLD, NORMAL

CONVERGENCE ACCEL-M1

[ ] MP21-G3
[ ] MP54-G1
[ ] MP55-G2
[ ] MP56-G4
[ ] MP60-G1

Wave 2 authorization:
WAITING FOR ACCEL-M1

After all five gates satisfy:

ACCEL-M1 — SATISFIED

Wave 2 available under the existing owner build plan:
- MP-21 P4/P5
- MP-54 P2/P3
- MP-55 P3/P4
- MP-56 P5 when useful
- MP-60 P2/P3

Do not render recommended next.

## 14. Relationship to Ratchet

The build plan stops above atomic execution.

PM build plan:
wave → selected phase range → milestone

Then selected phase deepens:
work packages → tasks → Ratchet atomic tasks → proof

Do not make waves themselves Ratchet tasks.

## 15. Do not build broader PM automation now

This directive does not authorize:
- background PM caretaker automation;
- scheduled maintenance;
- autonomous gate watchers;
- automatic execution-packet launching;
- autonomous ZCode workflow dispatch;
- portfolio recommendations;
- automatic phase start;
- priority scoring;
- capacity allocation engines.

The immediate goal is only to represent the current owner-selected build shape faithfully.

## 16. Acceptance criteria

Complete when:
- one owner-owned build-plan artifact exists;
- it contains Wave 1, ACCEL-M1, Wave 2 and later-wave intent from this directive;
- all five selected programs are represented;
- no other program is managed;
- hard dependency state remains sourced from existing gates;
- HOLD and BLOCKED are distinct;
- emphasis is represented without numeric ranking;
- ACCEL-M1 is computed as the conjunction of its five existing gates;
- PM cannot invent or choose another wave;
- generated BUILD-PLAN.md clearly communicates the fan-out;
- validation/tests pass;
- no broader automation or decisioning machinery is introduced.

## 17. Final instruction to the PM team

Do not redesign the five programs.

Do not choose a different sequence.

Do not expand PM.

Do not build a scheduler.

Implement the smallest missing representation necessary to faithfully record and project this already owner-selected execution plan:

> Wave 1: fan out the independent foundations, with MP-21 as the primary spine and MP-56 as the second major substrate; hold MP-54/55/60 at their independent boundaries.

> ACCEL-M1: wait for MP21-G3 + MP54-G1 + MP55-G2 + MP56-G4 + MP60-G1.

> Wave 2: fan out the integration work unlocked by those substrates.

The dependency graph tells us what can happen.

This build plan records what Owen has chosen to happen.
