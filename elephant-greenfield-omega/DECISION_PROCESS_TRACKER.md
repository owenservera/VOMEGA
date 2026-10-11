# ⚓ VOMEGA Development Decision Process Tracker

**State:** ACTIVE / REVIEWING IN REVERSE CHRONOLOGICAL BATCHES · **Created:** 2026-10-11 · **Scope:** development/documentation corpus across `.project/` and `elephant-greenfield-omega/`.

This is a **blank operational decision-intake tracker**, not a retroactive list of decisions, a second product PM, or a new executive authority. Existing owner decisions remain effective in their original sources (e.g. `.project/DECISIONS.md` and [Rule 1](07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md)); **none was automatically imported or rewritten as a new decision**. Its purpose is to surface what deserves deliberation, what can be tested, and where explicit Owen guidance is needed.

**Reviewed Batches 01–03 (2026-10-11):** 18 adjudications presented: 16 agreements (10 submitted explicitly in Batches 01–02, six selected visibly in screenshots for Batch 03) and two UNANSWERED with original owner comments (Batch 01). Batch 03 comments are partially cropped; their visible language is preserved with uncertainty, not silently completed. **No laboratory result, code implementation or archive migration is implied.** [Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) · [Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) · [Batch 03 screenshot receipt](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) · [Master TODO](MASTER_TODO.md).

## Decision process / paths

| Path | Input and purpose | Valid output | Next routing | Authority |
| --- | --- | --- | --- | --- |
| **LAB** | Falsifiable unknown; competing semantic implementations, protocol variants, performance or usability hypotheses | Reproducible experiment pack, comparison, negative controls, `MEASURED/NOT_RUN/UNKNOWN` classification and a **recommendation**, not a normative decision | DELIBERATION, additional LAB or explicitly blocked | Experimental evidence only |
| **DELIBERATION** | Architectural alternatives, policy/precedence conflicts, integration/reuse/archiving trade-offs, disputed evidence | Option matrix, source anchors, effects, dissent, contradiction register, decision-ready recommendation or request for new LAB | LAB when evidence missing; OWEN_GUIDANCE when direction/authority required | Advisory only; preserve alternatives |
| **OWEN_GUIDANCE** | Scope choice, intent, normative rules, strategic priority, irreversible/high-impact action, contested source-of-truth changes | Exact owner statement, scope, date, whether final/provisional, sources superseded, implementation boundaries | RECORDED decision → implementation planning; otherwise LAB/DELIBERATION | **Owner decision within stated scope**, subject to safety and source truth |
| **DOCUMENTARY_RECONCILIATION** | Resolve older docs versus newer decisions and identify archive chunks | Source-pinned KEEP_ACTIVE / ARCHIVE_FOR_REVIEW / MERGE / DEFER proposal with dependency check | DELIBERATION or OWEN_GUIDANCE for unresolved authority; bounded archive migration when already authorized | Follows canonical development corpus; never invent owner consent |

**Paths are not stages.** An item may go LAB → DELIBERATION → LAB repeatedly or receive Owen guidance immediately. An agent cannot turn a test result, a vote or an interpretation of silence into an owner decision. For the Semantic SDK, all experiments and deliberations must feed the same Rule 1 Machine ↔ Human learning loop, not separate parallel semantic authorities.

## Minimal statuses

`INTAKE` → `NEEDS_LAB` / `LAB_RUNNING` / `NEEDS_DELIBERATION` / `DELIBERATING` / `NEEDS_OWEN` / `AWAITING_EVIDENCE` → `DECISION_RECORDED` / `DEFERRED` / `SUPERSEDED` / `CLOSED_NO_DECISION`.

The status `DECISION_RECORDED` **requires** an actual decision source and named authority; when implementation is separately needed, retain `implementation_status: NOT_STARTED | IN_PROGRESS | VERIFIED | BLOCKED` without conflating it with the decision. `NEEDS_OWEN` must never be auto-cleared by agent consensus.

## Intake schema (proposed, not frozen product API)

```yaml
id: DECQ-0001
question: <short single choice or contradiction>
scopes: [<product | elephant-rd | semantic-sdk | corpus-cleanup | pm | ...>]
paths: [LAB, DELIBERATION, OWEN_GUIDANCE]
status: INTAKE
origin: <chat | source-doc | lab-case | agent | issue>
source_refs: []  # exact paths and source hashes when available
owner_guidance_ref: null  # never inferred
latest_explicit_owner_decision_ref: null
options: []
contradictions: []
experimental_evidence_refs: []
proposed_disposition: null
actual_decision: null
actual_decider: null
actual_decision_date: null
supersedes: []
implementation_refs: []
implementation_status: NOT_STARTED
reviewer_notes: null
```

**Priority/precedence:** latest explicit owner guidance weighs highest **within its subject scope**; protected invariants, observable source/runtime truth and permission boundaries still hold. A newer agent document does not supersede an earlier owner instruction without explicit owner direction. Preserve original paths and lineage when documents are archived.

## Active queue — only after submitted interview

| ID | Question | Path | Status | Evidence/source | Owen guidance | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| DECQ-0001 | Include `mvp/` and clearly relevant external development docs | DOCUMENTARY_RECONCILIATION | OWNER_DECISION_RECORDED / IMPLEMENTATION_NOT_STARTED | [REV-008 Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) | Explicit AGREE expands review scope. | Inventory candidates and consumer/commit lineage; no unreviewed code moves |
| DECQ-0002 | Product/Ratchet authority within greenfield | DOCUMENTARY_RECONCILIATION | OWNER_DECISION_RECORDED / DOC_CONFLICT_NOT_YET_RECONCILED | [REV-007 Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) | Explicit AGREE: historical/reference for greenfield. Use commit dates and commits as key signals. | Correct older corpus authority language in a scoped, evidence-preserving follow-up |
| DECQ-0003 | Internalize Elephant experiments and Rule 1 SDK loop | LAB, DELIBERATION | OWNER_DIRECTION_RECORDED / IMPLEMENTATION_UNRESOLVED | [REV-009 & REV-012 Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) | Both AGREE: core Elephant dev integration and SDK embedding. | [TODO-001](MASTER_TODO.md) and [TODO-004](MASTER_TODO.md), retain independent controls |
| DECQ-0004 | Meaning of unfinished "we first" after SDK embedding | OWEN_GUIDANCE | NEEDS_OWEN | [REV-012 Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) | Verbatim phrase "Embedded into the elephants system, we first" is incomplete. | Ask a narrow clarification in a subsequent interview without prescribing a stage |

| DECQ-0005 | TypeScript default and threshold for alternate runtimes | LAB, DELIBERATION | OWNER_DIRECTION_RECORDED / TEST_PENDING | [REV-013 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | Visible Agree + `TS is our mono unless ... significantly boost dev` | [TODO-007](MASTER_TODO.md) |
| DECQ-0006 | Whether browser testing is currently out of scope or just not to be discussed | OWEN_GUIDANCE | NEEDS_CLARIFICATION | [REV-014 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | Visible Agree plus ambiguous `No mention rowser that is stage now +100` | [TODO-008](MASTER_TODO.md) |
| DECQ-0007 | Multi-stream capability/evidence intake, incremental standardization | LAB, DELIBERATION | OWNER_DIRECTION_PARTIAL / DESIGN_OPEN | [REV-015/016 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | Both Agree; comments obscured or truncated | [TODO-009](MASTER_TODO.md), [TODO-010](MASTER_TODO.md) |
| DECQ-0008 | Use conceptual Elephant DNA with unspecified Claude reference | DELIBERATION | NEEDS_CLARIFICATION | [REV-017 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | Agree; visible text `with mments the Claude` ambiguous | [TODO-011](MASTER_TODO.md) |
| DECQ-0009 | Semantic SDK as Wiki compiler embedded in Elephant | LAB, DELIBERATION, OWEN_GUIDANCE | OWNER_DIRECTION_RECORDED / DESIGN_OPEN | [REV-018 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | Agree; `I would reframe, the semantic sdk concept is the wiki compiler (Todo:` cropped | [TODO-012](MASTER_TODO.md), [TODO-001](MASTER_TODO.md) |

## Reviewed batches (owner responses, not inferred history)

| Batch | Status | Reviewed cards | Decision dispositions | Cursor |
| --- | --- | --- | --- | --- |
| [2026-10-11 Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) | SUBMITTED | REV-001 to REV-006 | REV-001/002/003 AGREED; REV-006 AGREED_WITH_QUALIFICATION; REV-004/005 UNANSWERED_WITH_GUIDANCE | Batch 02 |
| [2026-10-11 Batch 02](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md) | SUBMITTED | REV-007 to REV-012 | Six AGREE; REV-007,009,012 include binding qualifications; no migration authorized | Batch 03 |
| [2026-10-11 Batch 03](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_03.md) | SCREENSHOT_REVIEW_EVIDENCE | REV-013 to REV-018 | Six visibly selected AGREE; cropped/ambiguous comments separately flagged; original form payload unavailable | **Batch 04: earlier Elephant experiment/design decisions** |

The tracker started blank and is populated only from submitted user adjudications. Original historical decisions remain sourced in their original locations. **Later owner-confirmed greenfield precedence overrides the earlier assistant's characterization of product/Ratchet as coequal greenfield authority; old documents have not yet been rewritten or archived under that correction.**

## Operating actions

1. **Capture**, without making a decision: add a numbered question, exact source refs, options and consequence of deferral.
2. **Classify** into LAB, DELIBERATION, OWEN_GUIDANCE or documentary reconciliation. Multiple paths allowed.
3. **Investigate** through the existing Elephant experimental tracks, Ratchet proof gates or review mechanisms; do not launch a new lab merely to populate the tracker.
4. **Escalate** one clear decision-ready question to Owen only when an actual owner choice is necessary. Provide a recommended default and an **Other / custom guidance** choice.
5. **Record decision** only from explicit guidance or correctly scoped standing authority; link the existing source rather than duplicating policy as free text.
6. **Implement separately**, using existing D1/Ratchet or agent-session procedures; cite verification or blockers. Only then close the corresponding tracker item.
7. **Archive safely** if a decision displaces instructions; use dated `.archive` review chunks and old→new SHA map; live experiments remain protected.

## Boundaries and relationship to existing files

- [Canonical Development Corpus](CANONICAL_DEVELOPMENT_CORPUS.md) governs active-versus-archive documentation and authority navigation.
- [Historical product decisions](../.project/DECISIONS.md) remain original source evidence about prior product choices; this tracker must not overwrite them or silently treat them as newly approved greenfield rules.
- [Proposal intake and revisions](02_ARCHITECTURE_PROPOSALS/PROPOSAL_INTAKE_AND_REVISION_RULES.md) continue tracking proposal versions and independent architecture experiments.
- [Elephant DNA decision log](05_UNIVERSAL_ELEPHANT_DNA/decision_log.md) remains a scoped research classification ledger, not an imported owner-decision list.
- [Historical Ratchet operating procedure](../.project/ratchet/OPERATING.md) remains reference/evidence for the old D1 implementation, **not governing authority for this greenfield** following REV-007. Do not change its historical gates or running consumers through this tracker.

**Recorded approvals arose from the owner's submitted review batches, not from creating the tracker.** Every future item must include the explicit source and decision scope; proposed engineering approaches remain proposed.
