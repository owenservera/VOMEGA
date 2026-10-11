# Elephant Protocol Gym — One-page Run Review

> **Adaptive-swarm experiments:** If this run belongs to [ADAPTIVE_SWARM.md](ADAPTIVE_SWARM.md), record stream identity, source epoch, frozen vs current MVP objective distinction, observed self-state vs self-report, requirement→evidence gap, actual trial, alternative topology proposal, marginal cost and independent referee/owner status. Publish *all* maturity packs even for unchanged or blocked streams.


> **SELF-HOSTING/VISUAL WITNESS:** In a run concerning the Elephant's own SDK, include the actual tool invocation/witness, source-linked Wiki claim, command meaning, machine visual representation, human/spatial depiction and resulting tested discrepancy. When user-customizable visual style changes, document whether command digest, semantic-edit chain, explicit effects, authority and material information visibility are preserved. See [core visual language](CORE_VISUAL_LANGUAGE.md) and [self-dogfood](SDK_SELF_HOSTING_DOGFOOD.md).


> **Alignment review after independent trials:** Compare emergent findings with the [ten historical capability classes](LEGACY_ALIGNMENT_MAP.md), using evidence labels rather than completion percentages. Mark which results were **blind discoveries** versus **legacy-seeded reuse**, and record useful novel capabilities not in the map. Do not grade an agent on reproducing old implementation details.


> **Symbolic language experiments:** When a run uses legacy command glyphs, name the exact TS implementation and pinned source; distinguish lexical recognition, frame/grounded interpretation, canonical publication, Human/Wiki/3D projection and authorized execution. Report any meaning collisions, Unicode aliases and safety differences. See [symbol intake](SYMBOLIC_LANGUAGE_INTAKE.md).


> **Canonical review authority:** [LAUNCH_POLICY.md](LAUNCH_POLICY.md). Treat locally developed protocols and toolkits as proposals unless admitted through documented review. Independent experiments may redesign anything within operational truth/safety/feedback/evidence safeguards.


> **Decision 3 acceptance:** Each run note requires a Machine ↔ Human Signal section with source/task, machine view, ordinary-language human view, observed agreement/discrepancy/unknown, witness and one learning consequence. See [signal rule](MACHINE_HUMAN_SIGNAL.md). A purely speculative proposal must say NOT_RUN rather than claiming an observed discrepancy.


> **Decision 2 comparison:** Record whether an existing tool was reused, replayed, adapted, replaced or unavailable. Name its version, proof limits, and the measurable reason to change it. See [automation reuse](AUTOMATION_REUSE.md).


> **Decision 1 comparison:** Each run identifies whether it used the controlled fixture, a verified real-code cohort, or both; records feeder source/version/preflight evidence; and treats inaccessible private code as unavailable, not an invisible successful input. See [feeder reuse map](FEEDER_REUSE.md).

**Status:** template and review procedure, not evidence of an executed Gym run.

## The compact RUN NOTE

Copy the following into each session's final output. Short prose is preferred; **no invented numbers**.

\`\`\`text
RUN ID: A / B / C / D
Run date and pinned repo commit:
Agent/model and context restrictions:
QUESTION / HYPOTHESIS:
WHAT I ACTUALLY DID:
WORKING ARTIFACT OR CODE LINK (or NONE):
TEST EVIDENCE: TESTED / OBSERVED / PROPOSED / NOT_RUN; exact witness:
MACHINE ↔ HUMAN SIGNAL: source/task; machine meaning; human reading; comparison; evidence status; next test:
WHAT SURPRISED OR FAILED:
RELEVANT EXPECTED BEHAVIOR(S): E01..E10 (or proposed new)
PROTOCOL / SDK / ELEPHANT CANDIDATE:
OTHER PLAUSIBLE APPROACH:
SMALLEST NEXT FALSIFYING TEST:
UNKNOWN OR BLOCKED:
\`\`\`

If a run is a genuine Elephant top-level development turn, publish the existing mandatory **all-state capability portfolio** as well. This note is only a short review surface and must not replace the inherited publication contract.

## Reviewer instructions — avoid groupthink

1. Keep all four raw notes and any executable artifacts separate until comparison; isolate the sessions during first run.
2. Extract the **observed differences**, not shared phrasing. Flag copied assumptions, unsupported results and missing source/version evidence.
3. For each proposal mark: **REUSE EXISTING**, **SMALL TEST NEXT**, **OPEN QUESTION**, **REJECT WITH EVIDENCE**, or **NEEDS OWNER DECISION**. A model's confidence or number of agreeing sessions is not a quality metric.
4. Compare ordinary-source baseline against any enhanced method on correctness, source provenance, reconstruction, stale/unknown handling, human comprehension, and total time/tokens where observed. Use UNKNOWN where cost telemetry is absent.
5. Move at most a few chosen hypotheses into the next **shared CORE_SEED** with explicit rationale. Keep dissent and negative evidence available. Do not silently freeze WikiCore methods, serialization, frontend/backend topology, Elephant routing or runtime.
6. For **ratification**, route actual owner choice through the existing [decision process](../../DECISION_PROCESS_TRACKER.md); update the [evergreen design record](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/README.md) with proper status, and preserve experiment sources and artifacts according to the standing [publication law](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md).

## Round sequence

**Round 0:** independent short dry runs (A/B/C/D) from the exact same seed/fixture revision. **Round 1:** reviewer synthesizes *new* unresolved contrasts and one repeatable benchmark, without averaging the designs. **Round 2:** optional new four arms or 2–3 targeted rebuttal experiments against a frozen holdout. Each round can be stopped early if no new evidence emerges. Compare before escalating complexity.

## What not to do

Do not start a permanent four-team hierarchy from one dry run. Do not commission a full frontend, backend and datastore solely because they have separate headings. Do not conflate a method name with a verified behavior. Do not use an agent's generated expected answers as an independent ground truth. Do not describe model-context protocol adaptation as parameter fine-tuning. Do not claim a staged prompt is a live session.

The Gym is succeeding if it exposes which **few contracts and tiny tools** are worth writing next — and makes its own protocol less speculative with each iteration.