# Elephant Protocol Gym — One-page Run Review

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