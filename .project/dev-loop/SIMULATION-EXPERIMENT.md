# Synthetic users and A/B experiments — minimal execution contract

Read `../staff/PRODUCT-LOOP.md`. This is an implementation guide for two **independent test teams**, not an authored set of canonical user journeys or a new backlog.

## Test the product that exists

Start with `omega-baseline/experimental/d1/src/session.ts` (`run`, `dispatch`, `say`) and `project.ts`, the actual W0–W5 synthetic Worlds, current UI renderer where supported, and checked-in D1 gates. At `c74cf5b`, `ui.ts` is implemented for several presentation gates; `execute.ts`, `replay.ts`, `launch.ts` still contain named stubs. A/B teams must label features unreachable, not fabricate outcomes. Simulated actors cannot claim live usability or authenticated Provider success.

## One matched comparison

- **Question:** Does highlighting unresolved text and presenting a grounded correction action reduce user correction steps **without** increasing incorrect READY / wrong target?
- **Baseline A:** current accepted UI/projection at pinned commit.
- **Treatment B:** one UI-only presentation variant over the **same projection and command semantics**. No hidden command parser, no fixture manipulation, no silent Account selection, no changes to consent or validation.
- **Conditions:** same pinned code/World/account identities, actor goal, semantic outcome rubric and scenario seed. Account for order effects using random assignment then cross-over, including a plain-language control that should remain READY.
- **Population:** at least three clearly different user behavior styles (novice, impatient, changing-mind), with actors unaware of the acceptance criteria or internals. Evaluators are separate agent contexts; two agents on the same model family are not independently corroborating models.
- **Outcomes:** `goal_completed`, `correct_target`, `false_ready`, `correction_actions`, `unresolved_visible`, `consent_bounded`, `simulation_labeled`, `unsupported`. Prefer direct state assertions to agent sentiment. No claim of statistical significance from a handful of simulated actors.

## Minimal local result envelope

Store raw test sessions under ignored `.local/sim/<lane>/<run-id>/`, not in public tracked JSONL; do not record secrets, provider session content, or real user prompts. A sanitized finding can be routed in DESK reply/evidence or existing Ratchet gate/capsule.

```json
{
  "schema": "vomega.synthetic-finding/1",
  "build": "<pinned commit sha>",
  "evidenceClass": "SIMULATED",
  "lane": "sim-a",
  "world": "W2",
  "goal": "Choose the correct Account for a prompt",
  "treatment": "baseline",
  "seed": "case-01",
  "actions": [],
  "observed": {},
  "expected": {},
  "category": "BUG",
  "reproduction": "<deterministic command/test path>",
  "existingTask": null,
  "proposedAction": "reproduce-first"
}
```

An observed result is **not** independently verified until a second context reproduces it against the pinned version. Categorize `BUG | UX_HYPOTHESIS | PRODUCT_GAP | UNKNOWN | DUPLICATE`. For subjective UX, preserve the raw observation and name what the test could *not* establish.

## Handoff rule

The simulator teams never edit product code, tests, Ratchet locks, owner directives or PM. They return a compact finding to the CoS via DESK. CoS routes confirmed existing-law failures to DEV/Evidence, a UI-only hypothesis to Visual, and any product-scope or semantic-law change to Owen. Evidence workers may turn it into MP-55 failure capsules / MP-56 regression fixtures **only if reproduction is valuable**. A green treatment does not auto-promote itself.

Retest the exact sequence after a reviewed code change. Keep the baseline outcome, changed build SHA, and regression check together. If the evaluator and actor disagree, label the episode `UNKNOWN` until adjudicated; do not score improvement by vote.
