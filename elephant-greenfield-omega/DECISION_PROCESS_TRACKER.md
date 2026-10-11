# ⚓ VOMEGA Development Decision Process Tracker

**State:** ACTIVE / REVIEWING IN REVERSE CHRONOLOGICAL BATCHES · **Created:** 2026-10-11 · **Scope:** development/documentation corpus across `.project/` and `elephant-greenfield-omega/`.

This is a **blank operational decision-intake tracker**, not a retroactive list of decisions, a second product PM, or a new executive authority. Existing owner decisions remain effective in their original sources (e.g. `.project/DECISIONS.md` and [Rule 1](07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md)); **none was automatically imported or rewritten as a new decision**. Its purpose is to surface what deserves deliberation, what can be tested, and where explicit Owen guidance is needed.

**Reviewed Batch 01 (2026-10-11):** 6 adjudications presented; 4 AGREE responses (including one qualified), 2 UNANSWERED with substantive owner comments; 3 open follow-up items, 0 lab decisions. The batch source and exact comments are in [Batch 01 receipt](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md). No assistant proposal is considered ratified without the submitted user response.

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
| DECQ-0001 | Outer cleanup scope: MVP and other obvious candidate roots | OWEN_GUIDANCE, DOCUMENTARY_RECONCILIATION | NEEDS_DELIBERATION | [REV-004 Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) | `UNANSWERED` + exact comment `Yes plus MVP or other obvious candidate` | Specify inclusion and safe source/code boundary |
| DECQ-0002 | Reclassify product/Ratchet as historical for this greenfield | OWEN_GUIDANCE, DOCUMENTARY_RECONCILIATION | NEEDS_DELIBERATION | [REV-005 Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) | `UNANSWERED` + exact comment `Product and ratchet are historical only this greenfieldis` | Resolve canonical hierarchy; check actual consumers before moves |
| DECQ-0003 | Internalize active Elephant labs into core dev learning process | LAB, DELIBERATION, OWEN_GUIDANCE | NEEDS_DELIBERATION | [REV-006 Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) | `AGREE` qualified; full comment preserved in batch | Distinguish common feedback/evidence intake vs shared runtime orchestration |

## Reviewed batches (owner responses, not inferred history)

| Batch | Status | Reviewed cards | Decision dispositions | Cursor |
| --- | --- | --- | --- | --- |
| [2026-10-11 Batch 01](DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_01.md) | SUBMITTED | REV-001 to REV-006 | REV-001/002/003 AGREED; REV-006 AGREED_WITH_QUALIFICATION; REV-004/005 UNANSWERED_WITH_GUIDANCE, not approved | Batch 02, older 2026-10-11 decisions |

The tracker **began blank** and is now populated solely by the submitted Batch 01 feedback. Other historical owner decisions continue to apply in their primary source files; this ledger has not imported or ratified them automatically.

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
- [Product decisions](../.project/DECISIONS.md) remain existing source of owner-selected product choices and open owner boundaries. This tracker must not overwrite them.
- [Proposal intake and revisions](02_ARCHITECTURE_PROPOSALS/PROPOSAL_INTAKE_AND_REVISION_RULES.md) continue tracking proposal versions and independent architecture experiments.
- [Elephant DNA decision log](05_UNIVERSAL_ELEPHANT_DNA/decision_log.md) remains a scoped research classification ledger, not an imported owner-decision list.
- [Ratchet operating procedure](../.project/ratchet/OPERATING.md) remains the D1 task/verification authority; this tracker cannot promote its gates.

**No proposed decision has been accepted by creating this file.** Add future questions only when requested or actually surfaced by a scoped review, with origin and authority explicit.
