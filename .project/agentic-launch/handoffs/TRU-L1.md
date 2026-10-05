# TRU-L1 — Independent verification of Locks A–D + EXP baseline (+ Lock E)

Status: **INDEPENDENT REVIEW COMPLETE.** Reviewer TRU-L1 is independent of SDW-L1, LNC-L1,
VFX-L1, SKW-L1, EXP-L1, PRV-L1. No product code, config, or git state touched; no candidate
artifact modified. Exactly this one file written.

Scope: challenge each candidate against the TRU-L1 falsifier list. This is a *candidate*
disposition (safe to use / not safe to freeze), not a freeze.

Independent source checks performed (beyond the artifacts/handoffs):
- `omega-baseline/plugins/*/plugin.json`: 24 manifests; `contentHash` is `""` in **all 24**.
- `prompt.send`: **0** occurrences in any `plugin.json` and **0** in `omega-baseline/plugins/*/src`.
- `omega-baseline/plugins/vivim-nlcl-pure/plugin.json`: **does not exist** (confirmed).
- `omega-baseline/plugins/vivim-nlcl/test/fixtures/release-use-corpus.json`: 17 cases / 9
  categories confirmed; `U1` confirmed false-READY defect (`expect.statusNot:["ok"]`,
  `baseline:"fail"`, `task:"CMD-06"`); `A1/A2` ambiguity pass; `R1` replay pass; `P1/P3/P4/P5`,
  `O1`, `O2`, `G1` confirmed `baseline:"fail"`; `S1` consent gate pass.
- `vivim-nlcl-pure/src/types.ts`: `RiskClass` is scalar; `OpView.provider` is a plugin id
  (comment "plugin id offering it"), i.e. not an external AI Provider.

## Findings

| Claim challenged | Evidence | Severity | Falsifier | Disposition needed |
|---|---|---|---|---|
| LOCK-A F1–F5 can currently prove Provider≠Account≠Model and fixture≠live. | The falsifiers (esp. F2/F4, false-READY / unavailable routing) execute against the interpretation validator. That validator is known-weak: corpus `U1` is a verified false-READY (`status:"ok"` with a required account unresolved, CMD-06). F2/F4 would pass/fail on a validator that already mislabels unresolved-required. | **High** | Unresolved required field marked READY | Pin or fix the validator (CMD-06) *before* F2/F4 can yield valid evidence; record as an explicit precondition in LOCK-A. |
| LOCK-A `source:"fixture"` guarantees fixture≠live. | Tag + "SYNTHETIC FIXTURE" note and F4 are present (good), but no runtime-sourced world exists to compare against, and load-time enforcement of `source` is itself an open question in LOCK-A. | Medium | Fixture presented as live evidence | Enforce `source` structurally at the loader; run F4 against a non-fixture world before any freeze. |
| LOCK-A identity excludes risk/policy. | Id rules correctly exclude account/model/availability/risk. But the `Account` record embeds `defaultFor` (policy) and the world also has a separate top-level `defaults` block — two default sources with no stated precedence. | Medium | Semantic ID tied to risk/policy; hidden/prior default overriding explicit target | Keep default/policy out of identity; define a single precedence between `Account.defaultFor` and `world.defaults`; any auto-resolution must emit a visible note. |
| `prompt.send` is a usable/registered capability behind the candidates. | Verified: **0** occurrences in 24 manifests and **0** in plugin src. It appears only as release-corpus `expect.op` and as design text (LOCK-D classifies it CANDIDATE_SEMANTIC). | Medium | Wiki/Reflection claim not traceable to source | No candidate may treat `prompt.send` as live; LOCK-D's CANDIDATE_SEMANTIC labeling is correct and must propagate downstream. |
| EXP-BASELINE `falseReadyRate` / `wrongTargetRate` are computable now. | The formulas require a "required field" notion. The corpus encodes `expect`/`statusNot` but no required-slot metadata; the required set would come from a capability/parameter spec that does not exist yet. | Medium | Unresolved required field marked READY | Source required-field metadata from a capability spec before treating these two metrics as meaningful; otherwise false-READY detection is ad hoc. |
| EXP-BASELINE metrics cover hidden/prior default override of an explicit target. | E1/E2/A2 present and verified (A2: priors rank but do not decide). MM-02/MM-04 guard metamorphic forms but are **proposed, not run**. | Low | Hidden/prior default silently overriding explicit target | Keep A2 as baseline evidence; run MM-02/MM-04 before claiming override coverage. |
| LOCK-C rule 6 (late revision must not overwrite newer) is established. | Rule is asserted as hard. But the EXP runner has no late-result/ordering test and the corpus is single-input (EXP open Q2 admits this). | Medium | Late revision overwrite | Add multi-revision corpus entries + an explicit late-result suppression test; until then the assertion is unbacked. |
| LNC/LOCK-B quoted-provider routing (corpus case 4) is baseline evidence. | Release corpus contains quoted payloads but **no** quoted-routing-target case; case 4 is additive/proposed. | Low | Quoted payload altering route | Label case 4 as proposed; back it with MM-03 (quoted-payload invariant) when run. |
| LOCK-C keeps UI from owning meaning / parsing language. | Rules 1–7 are strong: UI must not parse, click is a semantic edit + revalidate, handles are stable IDs (not spans), presentation gestures never change meaning. | Low (satisfied) | UI-owned meaning | Keep. Note LOCK-C is still unreconciled with the existing VisualSpec. |
| LOCK-C is reconciled with the existing projector. | LOCK-C says it *should* be reconciled with VSX-01..12 but open Q7 (extend vs replace the existing `VisualSpec`) is undecided; `project.ts` emits only token annotations today. | Medium | UI-owned meaning / semantic-ID drift | Decide extend-vs-replace before any projector implementation; do not freeze LOCK-C as a wire format. |
| LOCK-D manifest/parity claims are traceable to source. | Core claims independently re-verified: `contentHash:""` in all 24 manifests; `prompt.send` absent; `vivim-nlcl-pure` has no `plugin.json`. The `vivim-mind` (requested-only) vs `vivim-providers` (both channels) drift claim was not re-verified within budget. | Low | Wiki/Reflection claim not traceable to source | No blocking action. Treat the per-manifest dual-channel claim as a read-only lead pending a targeted re-check. |
| LOCK-E presents transport as live evidence. | Assay explicitly reconnaissance-only: no submit, no login/config, no profile; account identity marked UNKNOWN; F-A..F-E define an evidence contract. No live proof is claimed. | Low (honest) | Fixture presented as live evidence | Preserve the recon boundary; TRU-05 + consent envelope must land before any live observation. |

## Unsupported / overstated claims (plain)

- **"Locks A–D falsifiers/metrics can currently generate valid evidence" — unsupported.** They
  depend on a validator independently shown to fail false-READY (`U1`) and on required-field
  metadata that does not exist yet. The falsifier *designs* are sound; their *executability* is not.
- **"Late-revision overwrite is prevented" — asserted, not evidenced** (single-input corpus, no
  ordering test).
- **"fixture ≠ live is enforced" — asserted, not enforced/tested**; a runtime-sourced world does
  not yet exist.
- **"`prompt.send` is a capability" — unsupported** (verified absent from manifests and src); it is
  a design target and a corpus expectation only.

## Verdict — candidate safety (not a freeze)

- **LOCK A — SAFE AS CANDIDATE; NOT safe to freeze.** The Provider/Account/Model/Session separation
  and fixture/live intent are well-specified, but its own falsifiers cannot run validly until the
  weak validator (CMD-06) is addressed and default precedence / `source` enforcement are resolved.
- **LOCK B — SAFE AS CANDIDATE.** Genuinely additive, no product code touched, false-READY rule
  proposed (not enforced). Corpus path and required-field source remain unconfirmed.
- **LOCK C — SAFE AS CANDIDATE.** Strong no-parse / no-hidden-routing / stable-handle rules. Not
  reconciled with the existing `VisualSpec` (extend-vs-replace open); late-overwrite asserted only.
- **LOCK D — SAFE AS CANDIDATE; strongest traceability.** Core claims independently verified;
  honest CANDIDATE_SEMANTIC labeling of `prompt.send`; no source-anchor overreach.
- **EXP BASELINE — SAFE AS CANDIDATE (lab evidence only).** Metric definitions are sound in
  principle; two of four are not computable without required-field metadata and a multi-revision
  corpus. No promotion authority claimed.
- **LOCK E (extra) — SAFE AS CANDIDATE.** Reconnaissance only; no live-transport claim; falsifier
  evidence contract is a reasonable input for TRU-05.

No candidate is safe to freeze. None of the candidates granted promotion authority; this review
grants none either.
