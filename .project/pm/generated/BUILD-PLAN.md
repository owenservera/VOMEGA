# BUILD-PLAN — owner-selected waves

> **Generated — do not hand-edit.** PM manages exactly the five owner-selected programs; the other 62 meta programs stay canonical in `.project/meta-tracker.json` and appear here only as external references.
>
> Source HEAD `65ecc7f` · seed digest `854f282c02c3` · regenerate: `bun run pm` · validate: `bun run pm:check` · scope: `.project/pm/scope.json` (owner-directed; see `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md`).

> **Owner-authored coordination state.** This records what Owen selected to execute, where to stop, and which convergence point opens the next fan-out. The dependency graph says what *can* happen; this says what was *chosen*. PM never ranks, scores, reorders, or recommends a next step — a "recommended next" is deliberately not rendered.

Status: **OWNER-AUTHORED — coordination overlay, not decisioning** · Directive: `.project/pm/PM-BUILD-PLAN-WAVES-SETUP.md`

Rationale: The phase roadmap records what exists and what technically depends on what. The build plan records what the owner selected to execute now, where to stop, and what convergence point opens the next fan-out. Both layers stay separate: the dependency graph is factual, the build plan is owner coordination state.

## ACCEL-W1 — Independent foundations

Start all five accelerator programs in parallel but execute only their independent slices. Concentrate build capacity on the two substrate-producing lines (MP-21 structural self-knowledge, MP-56 trace-to-fixture); use MP-54 and MP-60 to define and validate consumer requirements before their deeper dependencies exist.

Authorization: **OWNER-SELECTED**

| Program | Execute | Intent | Emphasis | Gate state | Target gate | Hold after | Resume when |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MP-21 | MP21-P1 → MP21-P3 | continue | PRIMARY | UNBLOCKED | MP21-G3 (TBD) | — | — |
| MP-56 | MP56-P1 → MP56-P4 | continue | HIGH | UNBLOCKED | MP56-G4 (TBD) | — | — |
| MP-55 | MP55-P1 → MP55-P2 | execute, then **HOLD** | NORMAL | UNBLOCKED | MP55-G2 (TBD) | MP55-P2 | MP21-G3 |
| MP-54 | MP54-P1 → MP54-P1 | execute, then **HOLD** | NORMAL | UNBLOCKED | MP54-G1 (TBD) | MP54-P1 | MP21-G3 |
| MP-60 | MP60-P1 → MP60-P1 | execute, then **HOLD** | NORMAL | UNBLOCKED | MP60-G1 (TBD) | MP60-P1 | MP21-G3 |

- MP-21: Main structural spine. Additional capacity and independent review preferentially here. MP21-G3 is the unlock consumed by MP-54 P2, MP-55 P3 and MP-60 P2.
- MP-56: Second substrate line. Synthetic traces first; do not block this line on live Provider traces.
- MP-55: Stop at the reproducible-capsule boundary; hold structural enrichment.
- MP-54: Thin slice only. P1 must extend or reuse the existing Ratchet packet mechanism rather than create a second context system.
- MP-60: Requirements-only: produce the impact-query acceptance corpus and feed those requirements into MP-21 graph design. Do not build a second source parser or structural graph before MP21-G3.

## ACCEL-W2 — Integration fan-out

Turn independently proven primitives into one interoperable development-acceleration system rather than five separate tools. Later MP-21 phases must not block consumers of MP21-G3.

Authorization: **WAITING FOR ACCEL-M1**

| Program | Execute | Intent | Emphasis | Gate state | Target gate | Hold after | Resume when |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MP-21 | MP21-P4 → MP21-P5 | continue | NORMAL | BLOCKED | — | — | — |
| MP-54 | MP54-P2 → MP54-P3 | continue | NORMAL | BLOCKED | — | — | MP21-G3, MP55-G2 |
| MP-55 | MP55-P3 → MP55-P4 | continue | NORMAL | BLOCKED | — | — | MP21-G3 |
| MP-56 | MP56-P5 → MP56-P5 | continue | LOW | BLOCKED | — | — | — |
| MP-60 | MP60-P2 → MP60-P3 | continue | NORMAL | BLOCKED | — | — | MP21-G3, MP56-G4 |

- MP-21: Continue gap/migration proposals and continuous compliance where justified.
- MP-54: Source-aware bundle, then evidence/failure enrichment.
- MP-55: Structural enrichment, then the cross-agent diagnostic packet.
- MP-56: Continuous harvesting only where useful real or synthetic observations exist. Do not manufacture trace volume merely to execute the phase.
- MP-60: Static structural impact graph, then runtime/test-observed edges when MP56-G4 output is available.

## ACCEL-W3 — Operational acceleration *(seeded for later; not currently authorized)*

Operationalize the acceleration system. Seeded as later owner-plan content; not executable until earlier milestone conditions are satisfied.

Authorization: **OWNER-SELECTED**

| Program | Execute | Intent | Emphasis | Gate state | Target gate | Hold after | Resume when |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MP-21 | MP21-P5 → MP21-P5 | continue | LOW | BLOCKED | — | — | — |
| MP-54 | MP54-P4 → MP54-P4 | continue | NORMAL | BLOCKED | — | — | — |
| MP-55 | MP55-P5 → MP55-P5 | continue | NORMAL | BLOCKED | — | — | — |
| MP-56 | MP56-P5 → MP56-P5 | continue | LOW | BLOCKED | — | — | — |
| MP-60 | MP60-P4 → MP60-P4 | continue | NORMAL | BLOCKED | — | — | — |

- MP-21: Compliance hardening / incremental use.
- MP-54: Adaptive context selection.
- MP-55: Automatic capture/minimization.
- MP-56: Continuous harvesting as evidence justifies.
- MP-60: Affected-test selection. MP60-P5 is explicitly NOT in this wave.

## Convergence milestones

**ACCEL-M1 — Core accelerator substrates available** — NOT SATISFIED

- [ ] MP21-G3 — TBD
- [ ] MP54-G1 — TBD
- [ ] MP55-G2 — TBD
- [ ] MP56-G4 — TBD
- [ ] MP60-G1 — TBD

Unlocks ACCEL-W2: WAITING FOR ACCEL-M1

## Late maturity (explicitly not in any current wave)

- **MP-54** MP54-P5 — Measured optimization, after A/B evidence that bundles improve a validated work metric.
- **MP-60** MP60-P5 — Predictive impact/concurrency only after enough real history exists, its E4-E5 decomposition review occurs, and acceleration measurement shows it earns continuation.

## Shared interoperability requirement

The five programs must not create five identity/evidence universes. Compatible references are required for at least: SourceAnchor/source digest, EntityRef, TaskRef, GateRef, TestRef, FailureRef, TraceRef, FixtureRef, EvidenceRef, repository revision/HEAD.

This is a compatibility requirement, not one giant shared schema. MP-60 P1 should help define consumer queries before MP-21 P3 freezes a graph shape.

