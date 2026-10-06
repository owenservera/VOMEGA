# PM Portfolio Analysis — Deliverables, Design Intensity, and Maturity

Status: ANALYSIS LAYER — NON-DECISIONING
Branch: work/pm/design-intensity-67
Date: 2026-10-06

This layer analyzes all 67 canonical Meta Programs without adding them to PM managed scope.

It exists to answer a different question from effort estimation:

> Is this work difficult because it is large/complex but conceptually understood, or because the project still needs a real design cycle to discover the right answer?

It must never choose which program enters active PM scope, rank product strategy, or activate work. The five managed PM programs remain whatever the owner explicitly places in `.project/pm/scope.json`.

## 1. Two orthogonal dimensions

### Engineering complexity

The existing E0–E5 scale answers:

> How difficult/coupled is this likely to be to implement?

### Design intensity

The new D1–D5 scale answers:

> How much genuine design/brainstorming/experimentation is required before implementation can be treated as straightforward?

- **D1 — Straightforward.** The desired behavior and architecture are already substantially known; the challenge is implementation/test discipline.
- **D2 — Bounded design.** A local implementation choice or interface needs comparison, but the governing semantics are clear.
- **D3 — Substantive design cycle.** Several credible shapes exist; explicit alternatives, prototypes and falsifiers should precede commitment.
- **D4 — Foundational design.** The choice affects multiple programs or durable boundaries. Independent hypotheses, interface experiments and cross-program review are required.
- **D5 — Frontier / state-of-the-art design.** The project does not yet possess a sufficiently proven answer, the space contains deep tradeoffs or novel combinations, and the best result may require research-grade experimentation rather than ordinary architecture work.

A task may be E5/D1: large but conceptually straightforward.
A task may be E2/D5: little code, but a load-bearing conceptual decision.

Do not collapse E and D into one score.

## 2. Five-level maturity taxonomy

All programs may be described against the same maturity ladder, but they are **not required to have exactly five phases**.

- **M1 — Functional truth.** Smallest real/provable slice establishing the mechanism or falsifying the hypothesis.
- **M2 — Functional core.** Useful bounded implementation with explicit contracts and evidence.
- **M3 — Integrated / robust.** Works across the intended product path, failures and adjacent consumers.
- **M4 — Generalized / adaptive.** Handles materially different cases, scale, drift, optimization or self-maintenance.
- **M5 — State of the art.** Frontier form: unusually capable, adaptive, generalized, efficient or self-improving while preserving Ω truth/authority/sovereignty boundaries.

A program can stop at M2 or M3 if further maturity does not earn its cost.

## 3. Global seven design-heavy areas

These are the current **golden reference cases** for the design-intensity system. They are not a strategic priority ranking. They are the places where a wrong conceptual choice has unusually broad downstream consequences.

### 1. Canonical semantic substrate and World

Representative programs: MP-06, MP-07, MP-26, with consequences into MP-34/35.

Why it is design-heavy:
Provider, Account, Model, Session, Capability, Realization, consequence, evidence, defaults, availability, time and identity must remain distinct while still composing into one usable World. Errors here propagate into language, routing, help, UI, Reflection, execution and persistence.

Expected design intensity: **D5**.

### 2. Human language → canonical command semantics

Representative programs: MP-08, MP-09, MP-10, MP-11, MP-16, MP-17.

Why it is design-heavy:
Ω must preserve ambiguity, support revision, grounding, defaults and semantic edits, remain deterministic where required, permit bounded probabilistic proposal, and generalize beyond AI without letting language become authority.

Expected design intensity: **D5**.

### 3. Authority, durable Work, external-effect truth and recovery

Representative programs: MP-31, MP-32, MP-33, MP-38, MP-39, MP-41.

Why it is design-heavy:
The system must distinguish intent, permission, attempt, observation, completion, uncertainty and recovery across crashes and worker/provider replacement. Retry/idempotency/compensation and durable Work semantics become existential once Ω performs real external effects.

Expected design intensity: **D5**.

### 4. Provider / Account / Session reality, routing and drift

Representative programs: MP-24 through MP-30.

Why it is design-heavy:
External webapps change independently. Ω must know which Account it is affecting, isolate provider-specific realization knowledge, route without hidden retargeting, preserve freshness, and survive drift without letting selectors become product truth.

Expected design intensity: **D4–D5**.

### 5. Self-description, plugin boundaries, Forge and governed evolution

Representative programs: MP-18, MP-19, MP-21, MP-22, MP-23, MP-36, MP-37, MP-38, MP-39.

Why it is design-heavy:
Ω eventually needs to inspect, explain, extend and repair itself without creating a second authority, granting generated behavior privilege, or letting self-modification rewrite constitutional boundaries. Reflection, plugin contracts, source identity, admission, compatibility and rollback must line up.

Expected design intensity: **D5**.

### 6. Sovereign Product Instance, data continuity and memory

Representative programs: MP-05, MP-34, MP-35, with MP-38 compatibility implications.

Why it is design-heavy:
The difficult question is not simply where bytes are stored. It is what identity, lineage, references, content, inference, relationships and reconstructability must survive restart, export, migration, replacement and conflicting/aging knowledge.

Expected design intensity: **D5**.

### 7. Human semantic interaction / visual language / multi-surface projection

Representative programs: MP-02, MP-12, MP-14, MP-15, MP-20, MP-40.

Why it is design-heavy:
The user must see what Ω thinks they mean, what remains unresolved, what will happen, what requires authority, and what actually happened—without learning internal architecture. Visual choices must remain projections of semantics and work across compact, accessible and later spatial surfaces.

Expected design intensity: **D4–D5**.

## 4. Top-three deliverable rule

Every canonical MP receives exactly three deliverables ordered by **criticality within that program**, not by portfolio priority.

Each deliverable records:

- rank: 1, 2, 3;
- title;
- outcome;
- design intensity D1–D5;
- maturity target M1–M5.

The three deliverables are intended to expose the real spine of the program. They should not be generic "design / build / test" placeholders.

## 5. Design-cycle trigger

A deliverable should receive a deliberate design cycle when any of these are true:

- design intensity is D4 or D5;
- it changes a cross-program semantic identity or authority boundary;
- two or more credible architectures remain unresolved;
- the first implementation could accidentally become permanent architecture;
- success depends on an unproven abstraction surviving a materially different second case;
- failure semantics, migration, rollback, privacy or sovereignty cannot be added safely after the fact;
- the deliverable is small in LOC but large in irreversible conceptual commitment.

A design cycle should normally include:
1. problem statement and invariants;
2. at least two materially different candidate shapes where credible;
3. known prior art / harvested baseline;
4. explicit falsifiers and discriminating experiments;
5. prototype/spike where implementation evidence matters;
6. independent review;
7. recorded disposition and unresolved uncertainty.

D1–D2 work normally does not require this ceremony.
D3 uses a bounded version.
D4–D5 should default to it unless there is already strong prior evidence.

### Design-cycle output discipline

A D4/D5 label is not permission to produce unlimited prose. The useful output is reduced uncertainty plus an executable discriminator that implementation can consume.

Prefer durable outputs such as:

- competing minimal prototypes;
- a typed/interface contract with explicit alternatives still open;
- a pinned acceptance corpus;
- an executable falsifier or mutation;
- a short decision record tied to experimental evidence.

For D1–D2 work, if the desired behavior and acceptance gate already exist, implementation/test work is normally the next action.

For D4–D5 work, the cycle is complete only when evidence has narrowed the choice enough to execute or has falsified the proposed direction.

### Negative-intent frontier as a D5 reference case

The [Negative Intent Signal Engine](../../../seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md) is a current D5 semantic-design case spanning MP-08/09/10/14/15/16.

The difficult question is not whether Ω can show a second interpretation. It is how to preserve the full plausible semantic manifold, identify the counterfactual whose **early** correction avoids the greatest downstream semantic cost, expose it without excessive interruption, and evolve that ranking from evidence without creating a second interpreter or silent authority.

Before freezing this design, require competing ranking approaches, correction-distance metrics, a revisioned A/B/C experiment (baseline vs top-N vs negative frontier), at least one non-AI case and independent review.

## 6. Tests this analysis layer must pass

The machine-readable 67-program analysis is valid only if:

- all 67 canonical IDs appear exactly once;
- each program has exactly three ordered deliverables;
- ranks are exactly 1, 2, 3;
- every deliverable has D1–D5 and M1–M5;
- no analysis record changes PM managed scope;
- no record contains autonomous selection fields such as priorityScore, recommendedNext, selected, activate, schedule or ownerDecision;
- the seven golden design areas have at least one representative D5 deliverable;
- known straightforward implementation programs are allowed to remain below D4;
- design intensity is not derived mechanically from LOC or engineering effort;
- M5 always means state-of-the-art/frontier maturity, not merely "continuous maintenance."

The analysis may inform an owner decision later. It cannot make that decision.
