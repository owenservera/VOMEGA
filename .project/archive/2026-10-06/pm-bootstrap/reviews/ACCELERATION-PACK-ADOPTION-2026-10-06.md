# Acceleration Pack Adoption Review — 2026-10-06

Status: **ADOPTION / RELOCATION RECORD — NOT A NEW OPERATING LAYER**  
Grounded main: `c0dd6c035ecf6d013f5a2f5b23dc9ef1bebfee52`  
Integration branch: `work/pm/acceleration-adherence-20261006`

## Purpose

This record explains how the owner-supplied seven-document acceleration pack was integrated into the VOMEGA structures already present on current `main`.

The pack contained useful engineering and execution findings, but as a standalone artifact it would have created another documentation/PM wrapper around systems that already existed.

The adoption rule was therefore:

> preserve the useful constraints and concrete engineering findings; relocate each one into the existing authority surface that already owns it; reject duplicate organization.

This file is a historical disposition/audit record. Agents should follow the linked active documents, not treat this review as a new command layer.

## Existing authority surfaces retained

| Concern | Existing owner |
| --- | --- |
| product intent / invariants | `seed-docs/` |
| canonical 67-program meaning | `.project/META-TRACKER.md` / `meta-tracker.json` |
| five selected accelerator programs | `.project/pm/` |
| selected accelerator waves / holds | `.project/pm/build-plan.json` |
| D1 bounded product deliverable | `.project/deliverables/` |
| D1 tasks / gates / promotion / review | `.project/ratchet/` |
| current worker identity/write surface | `.project/agentic-launch/claims/` |
| material cross-session handoff | `.project/COMMONS.md` |
| proof | source + tests + evidence + independent review |

No new authority surface was created.

## Disposition by acceleration theme

### Proof velocity — ADOPTED into D1/Ratchet

Retained:

- implementation sessions should normally move an executable falsifier rather than create more prose;
- regressions outrank new frontier work;
- gate strengthening is first-class engineering;
- green means the actual claimed behavior, not a proxy.

Active homes:

- `../deliverables/D1-EXECUTION-ACCELERATION-DIRECTIVE.md`
- `../ratchet/OPERATING.md`
- root `AGENTS.md`

Not adopted:

- a standalone proof-velocity department or scorekeeping role.

### Flow / critical path — ADOPTED into D1/Ratchet

Retained:

- one temporary owner for the active critical-spine task;
- fan out only genuinely disjoint work;
- use excess model capacity for review/hardening/harvest/failure reproduction;
- small coherent integration with re-checks;
- speculative blocked-task work only when current proven/main behavior can genuinely satisfy its gates.

Active homes:

- D1 execution directive;
- Ratchet operating guide;
- DEV team prompt.

Not adopted:

- permanent "spine runner" or "fan-out implementer" job classes;
- artificial worker-count targets.

### Harvest / reuse — ADOPTED

Retained:

- assay existing implementation before invention;
- D1 interpreter work must inspect/adapt `vivim-nlcl-pure`;
- D1 Reflection/help work must consume/adapt the provisional Reflection Migrator before creating a second general parser/identity system;
- material reuse gets an explicit reuse/adapt/wrap/port/reimplement/reject disposition.

Active homes:

- D1 execution directive;
- Ratchet operating guide.

Not adopted:

- a separate harvest registry for every task.

### Context economy — ADOPTED as packet-first behavior

Retained:

- Ratchet packet + red gate + directly named source is the default D1 context;
- broader context is pulled only when the task demonstrates it is needed;
- repeated missing context is evidence to improve packets;
- Elephant remains a hypothesis until reconstruction/review cost is measured as a bottleneck.

Active homes:

- root `AGENTS.md`;
- PM evolution rules;
- D1 directive;
- dev-agent registration.

Not adopted:

- mandatory full-project rereads;
- an Elephant/context network as a prerequisite;
- T0/T1/T2 bureaucracy as a second context system.

### Truth at speed — ADOPTED into Ratchet/TRU

Retained:

- independent reviewers read the implementation and the gate source;
- review runs verification independently;
- cheap adversarial mutations/sabotage are encouraged for load-bearing gates;
- weak placeholder/constant/substr gates must be hardened;
- simulated/fixture remains distinct from live proof.

Active homes:

- Ratchet operating guide;
- TRU team prompt;
- D1 directive.

Not adopted:

- review ceremony that exists independently of an actual proof claim.

## Concrete D1 findings retained

The following pack findings were preserved as engineering obligations in the existing D1/Ratchet system:

1. cross-platform Ratchet taskgraph digest should normalize CRLF/LF;
2. D1-002 must prove a substantive interpreter code map, not a substring placeholder;
3. D1-004/005/006 remain the high-value false-READY semantic spine;
4. D1-016/017 are cheap World edge-case closures;
5. D1-020…023 registration must use the semantic command path;
6. D1-074…077 metrics must be recomputed from real scenario/replay data and demonstrate that they can fail;
7. executable coverage is required for explicit-target precedence, Session identity separation where applicable, Reflection non-authority, and source/realization drift invalidation.

These are attached to existing tasks/gates. There is no second acceleration backlog.

## Dispatch prompts — converted from roles to functions

The pack's useful dispatch specializations remain available as temporary functions:

- critical-spine implementation;
- disjoint off-spine implementation;
- independent review;
- harvest assay;
- gate hardening / sabotage;
- live-proof protocol design;
- acceleration experiment measurement.

They were **not** installed as eight permanent agents, departments or owners.

Existing DEV/TRU/PM/worker structures may perform these functions as needed.

## Scorecard / measurement — adopted without new bureaucracy

Useful acceleration measures may be recorded where the work already lives:

- probe green count;
- disjoint frontier width;
- critical-path depth;
- claim → first verification;
- claim → promotion;
- promotion → independent review;
- regressions;
- mutation kill/survival;
- extra context required beyond a packet.

No persistent scorecard file, daemon or reporting department was added.

New measurement infrastructure must first identify a measured bottleneck and prove it cannot be handled cheaply by existing claims/evidence/Commons.

## PM changes

PM remains:

- exactly five managed programs: MP-21, MP-54, MP-55, MP-56, MP-60;
- non-decisioning;
- owner-scoped;
- above atomic execution;
- separate from Ratchet proof state.

Added PM rules are deliberately narrow:

- planning should terminate in executable evidence;
- design intensity controls design ceremony;
- D4/D5 work must end in discriminating experiments/prototypes/falsifiers, not prose alone;
- new development machinery requires a measured bottleneck and a smallest reversible experiment;
- context economy does not justify widening PM scope.

No generated PM view was hand-edited.

## Agent-registration cleanup

The latest `main` had just introduced a lightweight session-claim protocol.

The integration aligns older root/launch instructions to it:

- session claim = who/what/where/current session;
- Ratchet claim = D1 task lease;
- STATUS = major execution summary, not every tiny task;
- Commons = material result/blocker/handoff, not duplicate registration;
- tests/evidence/review = truth.

This removes redundant "update STATUS + Commons on every claim" behavior.

## New owner concept added during integration: Negative Intent Signal Engine

During this integration the owner added a separate product-semantic concept:

> expose the full plausible intent manifold internally and continuously identify the highest-value plausible wrong interpretation whose early correction would minimize downstream correction steps.

This is documented in:

- `../../../seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md`.

It is **not** an acceleration-PM concept and does not expand managed PM scope.

It is mapped across existing product programs:

- MP-08 — candidate semantic space;
- MP-09 — canonical compiler/validator remains primary;
- MP-10 — revision-bound counterfactual frontier;
- MP-14 — visual counterfactual correction;
- MP-15 — deterministic projection;
- MP-16 — experiments/evolutionary ranking;
- MP-17 — cross-domain falsification.

The key invariant is that the negative-intent engine is **not a second interpreter**. It evaluates candidates produced by the same semantic pipeline and optimizes early-correction leverage.

The concept is classified D5/frontier. D1 preserves useful candidate/revision/correction evidence but does not gain a new generalized-engine completion gate.

## Deliberately rejected additions

This integration does **not** create:

- `.project/acceleration/`;
- five permanent acceleration departments/axes;
- eight permanent dispatch roles;
- another task/status registry;
- a central scheduler;
- a new dashboard;
- a heartbeat/worker daemon;
- a permanent acceleration scorecard bureaucracy;
- a required Elephant deployment;
- a second Reflection system;
- a second intent parser;
- automatic PM decisioning;
- automatic program selection/ranking;
- a generalized negative-intent engine as a D1 blocker.

## Acceptance

This adoption is maximally adherent when:

- the useful pack instructions are reachable from normal worker entrypoints;
- every instruction lives under an existing authority surface;
- PM remains five-program/non-decisioning;
- Ratchet remains D1 task/proof authority;
- claims remain lightweight;
- generated projections remain generated;
- D1 implementation defaults to executable falsifiers;
- D4/D5 work still receives real design cycles;
- the new negative-intent concept is preserved as a D5 semantic hypothesis with an explicit experiment;
- no parallel management system has been introduced.

If future evidence shows that one of these mechanisms needs dedicated infrastructure, build the smallest proven missing mechanism then. Do not preserve this review's organizational shape merely because it exists.
