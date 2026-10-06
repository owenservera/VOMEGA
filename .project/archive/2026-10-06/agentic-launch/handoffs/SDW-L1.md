# SDW-L1 — Semantic Data World, Level 1 handoff

Status: **COMPLETE (bounded first increment / Lock A candidate).** No product code,
config, or git state was modified. New files only.

## Artifacts produced

- `omega-baseline/experimental/mvp-semantic-world/LOCK-A-CANDIDATE.md` — Lock A candidate:
  (a) current-code gap map, (b) Provider/Account/Model/Capability/Realization record field
  lists, (c) synthetic World fixture JSON schema sketch, (d) six named MVP Worlds incl. the
  required incompatible Account/Model case (W4), (e) five falsifiers (F1–F5) proving
  Provider≠Account≠Model≠Session and fixture≠live.
- `.project/agentic-launch/handoffs/SDW-L1.md` — this handoff.

## Inputs read (evidence)

- `seed-docs/SEMANTIC-DATA-ENGINE.md` (semantic planes, stable identity, records §5,
  consequence §6, fidelity/maturity §7, World §10, session §11, MVP slice §17, falsifiers §21).
- `seed-docs/INVARIANTS.md` (semantic separations table; canonicality; consequence dimensions;
  self-description).
- `omega-baseline/plugins/vivim-nlcl-pure/src/types.ts` (current interpretation-layer contract;
  `WorldModel`, `OpView`, `CapabilityView`, `RiskClass`, `VisualSpec`).

## Interfaces produced (candidate, not frozen)

- Conceptual records: `Provider`, `Account`, `Model`, `Capability`, `Realization`
  (field lists in LOCK-A-CANDIDATE.md §b), plus referenced `ConsequenceSpec`, `Route`,
  `InterpretationSession`.
- Fixture schema `world/0` with `worldVersion`, `source: "fixture"`, and separate
  `availability` join (`capability × provider × account × model`).
- Named Worlds: `fixture-w1-baseline`, `fixture-w2-no-accounts`, `fixture-w3-model-optional`,
  `fixture-w4-incompatible-account-model`, `fixture-w5-stale-account`, `fixture-w6-empty`.
- Falsifiers F1–F5 + determinism guard.

No TypeScript was written; the above are field lists / JSON sketches only, per SDW-L1 scope.

## Gap findings (headline)

Current `types.ts` is an interpretation contract, not a semantic-world contract:
no Account, no Model, no Realization; Capability is fused to a plugin/provider id and to a
scalar `RiskClass`; World mixes durable structure with derived ops/priors. Lock A adds a
separate semantic-world layer beside `types.ts`; do not mutate `types.ts` to carry it.

## Open questions

- Exact `SemanticId` wire syntax and digest scheme for `worldVersion` / command digest.
- `availability`: stored vs purely derived at query time.
- Mapping direction from existing `OpView.provider` / `RiskClass` into Capability/Realization/
  Consequence (derive-from, not authority).
- VisualSpec vNext semantic-handle structure (SEMANTIC-DATA-ENGINE §12) — later lock.
- Where fixtures live physically (JSON vs JSONL) and how `source: "fixture"` is enforced.

## Downstream triggers (do not infer any are alive)

- **LNC (language/NCL/NLCL):** consume Capability `language` contributions + `EntityView`
  grounding; must not read provider truth from the language layer.
- **VFX (visual/VisualSpec):** build VisualSpec vNext on `Route` + semantic handles; a UI
  click becomes a `Route` semantic edit that revalidates (doc §14), never private UI state.
- **SKW (self-knowledge / contextual Wiki):** Wiki topics keyed by `SemanticId`; must not
  restate parameter schemas manually (falsifier 2) and must not infer meaning from pixels.
- **EXP (experiments / Semantic Runtime Lab):** adopt the six fixtures as scenario inputs;
  run F1–F5 as the smallest falsifiers; record promotion/rejection without promoting
  experiment state to product truth.

## Next bounded step (suggested, not done)

Materialize `world/0` fixtures for W1–W6 as JSON under
`omega-baseline/experimental/mvp-semantic-world/fixtures/` and a `source`-tagged loader,
then run F1–F5 against the existing interpreter to record real pass/fail evidence before
any Lock A freeze. Requires a new bounded claim in Commons.
