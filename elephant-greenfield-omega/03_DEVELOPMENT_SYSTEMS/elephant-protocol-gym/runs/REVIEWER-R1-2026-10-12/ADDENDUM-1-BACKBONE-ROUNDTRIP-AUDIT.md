# ADDENDUM 1 — Roundtrip Mapping Audit of the Protocol Backbone

**Status: AUDIT EXECUTED. Quality gate 1 of the crosswalk has a verdict. No canon ratified, no card corrected, no profile authorized.**

Companion to [`ROUND1-REVIEWER-SYNTHESIS.md`](ROUND1-REVIEWER-SYNTHESIS.md), which stays the review
of the four arms. This addendum covers a different object: the *contract reference* that the
REVIEWER slice is the only slice to receive (§19–22), auditing it against §22's own quality gate.

**Date:** 2026-10-12 · **Repo commit:** `1199b38c1fd174e997c92b22d18d8c20c952eb9e` ·
**Author:** reviewer (no arm harness imported) · **Gate:** `crosswalk.json` →
`quality_gates[0]`

---

## 1. The gate, and what was actually done

> **"Independent round-trip reviewer can enumerate original preconditions, state transitions,
> unknown behaviors, failure paths and permissions from compact contract plus refs, or report
> missing mapping."** — `protocol-backbone/crosswalk.json`

One full original protocol was audited: the SDK self-hosting obligation and the two owner-directed
documents it composes with.

| Role | Document | Card(s) |
|---|---|---|
| audited original | `SDK_SELF_HOSTING_DOGFOOD.md` | `epg.semantic.selfhosting` |
| audited original | `UNIVERSAL_SEMANTIC_GOVERNANCE.md` | `epg.governance.universal` |
| audited original | `CORE_VISUAL_LANGUAGE.md` | `epg.visual.parity` |

Method, and its limits stated up front: the three originals were read **in full before the card was
opened**, then **44 obligations** were enumerated by hand across the gate's five categories, then
each was checked against parsed card JSON. The machine-checked part is deliberately narrow —
**counts and field presence**, because those are falsifiable. "Does this card express obligation X"
in prose terms is **reviewer judgement, labelled PROPOSED**, and is kept out of the pass/fail set.
A phrase-absence search over JSON is reported as a **heuristic**, never as a finding.

Enumeration: 11 preconditions · 7 state transitions · 6 unknown behaviors · 13 failure paths ·
7 permissions.

## 2. Result — TESTED

**Verdict: the mapping is honestly labelled and under-disclosed.** Every card says
`PARTIAL_MAPPING` and the backbone validator emits nine `PARTIAL_MAPPING` warnings. Nothing here
accuses the backbone of concealing loss — the README states plainly that it is "an index + contract
normalization" whose refs preserve what was deliberately not transcribed, and that is exactly what
it is. The finding is about **granularity**: a consumer holding the cards learns *that* something
was dropped, never *what*.

| ID | Check | Original | Cards | Effect on round-trip enumeration |
|---|---|---|---|---|
| **F-01** | capability inventory | **8** discoverable capability groups | **0** fields matching `/capabilit/i` | The eight groups cannot be named from contract alone |
| **F-02** | visual probe set | **7** mandatory probes V1–V7 | **0** probe fields, no probe ids | The source's own named falsifier set is unrecoverable |
| **F-03** | INTERFACE_GOVERNED criteria | **9** numbered criteria | **4** gates | Discovery/Read/Propose/Act/Test/Parity/Replay/Provenance/No-bypass cannot each be checked off |
| **F-04** | U-stage reachability | **6** U0–U5 stages | 6 phases — but in a card the self-hosting card does not compose | see below |
| **F-05** | fault injection path | acceptance item 4 mandates a deliberate wrong statement + minimal repro | only `epg.visual.parity` has a `negative_mutation` phase | the negative path that makes the positive path trustworthy is what the contract drops |
| **F-06** | is the gap declared? | — | **3** `unmapped_requirements` strings for 3 sources | **6** clusters found; see §3 |

### 2.1 F-04 is conditional, and a hypothesis I had to retract

My first reading of the composition graph was that the governance card was **unreachable** from
`epg.semantic.selfhosting` — its first authority source is `UNIVERSAL_SEMANTIC_GOVERNANCE.md`, yet
`modules` lists only `epg.visual.parity`, `epg.publication.allturn`, `epg.research.library`, and
the `epg.governance.universal` card composes *self-hosting*, not the reverse.

Checking the profiles before writing it up retired that as a defect: profile **`exploratory-five`**
composes all six cards including `epg.governance.universal`. So a **profile-driven** consumer
reaches the full ladder; a **card-only forward-resolution** consumer does not. Recorded as
`conditional`, not `material`. The asymmetric edge may well be intentional — it is a governance card
standing over a semantic one — and the reviewer does not get to decide that.

### 2.2 Heuristics (reported, not gated)

`NOT_RUN` semantics **are** carried by the cards (`execution_receipt`, `change_receipt`).
"negative control / adversarial" appears in **no** card, despite being both a Phase 0 corpus
requirement and this round's single most transferable lesson (§9 item 1 of the synthesis).
"No second release ledger" appears in no card either. Both are phrase searches: absence of a string
is weak evidence, and they are listed as leads, not findings.

## 3. Why F-06 is the one that matters

The three crosswalk entries are honest — `old/semantic`, `old/universal`, `old/visual`, all
`PARTIAL_MAPPING` — and each carries exactly **one** `unmapped_requirements` string. This audit
produced **six** distinct unnormalised clusters from the same three documents.

That is the failure mode this corpus already named: **an instrument's failure looks exactly like a
clean result.** A validator that checks "is every card labelled PARTIAL_MAPPING?" returns green, and
the backbone's own test suite passes 2/2 — while the label itself carries no information about *what*
to go read. The existing `unmapped_requirements` field was built for precisely this disclosure and
is being used at a coarser granularity than the round warrants.

## 4. Machine ↔ Human signal (Decision 3)

| Field | Content |
|---|---|
| **Source / task** | `crosswalk.json` `quality_gates[0]`; three originals; three cards; commit `1199b38` |
| **Machine meaning** | Deterministic counts: 8→0 capability fields, 7→0 probe fields, 9→4 gates, 6 U-stages present but edge-asymmetric, 6 clusters found vs 3 declared gap strings |
| **Human reading** | "The backbone tells you it is incomplete, but not what it left behind, so nobody is prompted to go and get it" |
| **Comparison** | **OBSERVED_DISCREPANCY** — the machine side is a granularity claim; the human side is a loss-recovery claim. Both are true, and the current declaration satisfies only the first |
| **Evidence status** | **TESTED** for every count (parsed card JSON + source sections, three consecutive identical runs). **PROPOSED** for the judgement that these six clusters are the material ones. **NOT_RUN**: no real experiment was run; no card was modified |
| **Learning consequence** | `PARTIAL_MAPPING` is a necessary and insufficient label — the same shape as the round's digest finding (register item 1). The fix is naming the clusters, not relabelling the card |

## 5. The audit's own failure, recorded because it is the third one

The first run of `backbone-roundtrip-audit.mjs` exited **1** with
`anchors_resolve_in_sources: false`. One of my 44 obligation anchors — O39, the glyph-collision
failure path — was a **misquote**: the source says `must not implicitly mean independently verified
success`, and I had written `may not`. The anchor control caught it before any finding was reported.

This is the third time in this review that an instrument measured the instrument (§2.2 of the
synthesis: W5's probe, W6's `1e9`, then the reviewer's own timing slope). The pattern is now
consistent enough to state as a rule for this corpus: **enumerate-by-hand claims need an executable
anchor, or they are prose.** Every enumerated obligation here carries a literal substring that must
resolve in the source it was read from; if the document changes underneath, the audit fails loudly
instead of describing a document that is no longer there.

## 6. Controls

| Control | Purpose | Result |
|---|---|---|
| `anchors_resolve_in_sources` | all 44 anchors still exist in their source documents | **PASS** (after the O39 correction) |
| `positive_control_findings_nonempty` | an audit finding **nothing** is a broken checker, not a perfect mapping | **PASS** — zero findings exits 1 |
| `negative_control_detector_can_fail` | mutating a source must break an anchor | **PASS** — removing one line flips the detector |
| `negative_control_gate_count_detector` | stripping a card's gates must change the count | **PASS** — 4 → 0 |
| `negative_control_source_count_detector` | a source-section count must track the source | **PASS** |

Three consecutive runs returned identical verdicts and finding counts.

## 7. Proposal register (additions to synthesis §8)

Per `REVIEW.md` instruction 3. **None is promoted.** These concern the backbone contract, not the
four arms, so they do not disturb the round's conclusions.

| # | Proposal | Origin | Disposition | Reviewer's reason |
|---|---|---|---|---|
| 11 | Name the 8 capability groups in the self-hosting card, or list them in `unmapped_requirements` | this audit | **SMALL TEST NEXT** | Schema-level, no new semantics; a list field makes the inventory checkable |
| 12 | Carry probe ids V1–V7 on the visual card | this audit | **SMALL TEST NEXT** | The source's falsifiers are the cheapest thing in the backbone to preserve |
| 13 | Map the 9 INTERFACE_GOVERNED criteria onto the 4 governance gates, and declare the remaining 5 | this audit | **SMALL TEST NEXT** | 9→4 is currently invisible to any consumer |
| 14 | Add `epg.governance.universal` to the self-hosting card's `modules` | this audit | **OPEN QUESTION** | The profile already closes the path; asymmetry may be intentional |
| 15 | Make `unmapped_requirements` name clusters rather than state "something remains" | this audit | **SMALL TEST NEXT** | F-06 is the whole finding; the field exists for this |
| 16 | Give "negative control" a card field | this audit | **SMALL TEST NEXT** | Phase 0 requires it; the round independently proved it matters |
| 17 | Whether any card field changes | — | **NEEDS OWNER DECISION** | Card changes are canon changes; routed to §11 |

## 8. What this audit does not claim

- **Not a defect finding against the backbone.** It does what the README says it does, and the
  validator passes. The disagreement is about disclosure granularity, not correctness.
- **Not completeness of the reviewer's own obligation set.** 44 obligations is one reader's
  enumeration; a second reviewer would produce a different 44. Only the counts and the six
  named clusters are claimed.
- **Not a canon change.** No card, crosswalk entry, profile or source was modified. `main` is
  untouched; the four arms' artifacts remain untracked as their own notes declare.
- **Round 0 is unaffected.** Nothing here reopens a synthesis §1–§9 conclusion. The audit is about
  the contract reference, which is not an arm input at all.

## 9. Custody and reproduction

```
runs/REVIEWER-R1-2026-10-12/
  ADDENDUM-1-BACKBONE-ROUNDTRIP-AUDIT.md   this document
  backbone-roundtrip-audit.mjs             the audit + its five controls
  backbone-roundtrip-output.json           its output
  backbone-roundtrip-stderr.txt            empty on a clean run
```

```bash
cd runs/REVIEWER-R1-2026-10-12
node backbone-roundtrip-audit.mjs   # expect exit 0, 6 findings, 5/5 controls
node ../../protocol-backbone/tools/validate.mjs      # expect ok:true, 9 PARTIAL_MAPPING warnings
node --test ../../protocol-backbone/tools/validate.test.mjs   # expect 2/2 pass
```

Same caveat as the parent synthesis: this is one fresh reviewer, one machine, one moment. The audit
says what one careful reader could not enumerate from the contract. It does not say nobody could.