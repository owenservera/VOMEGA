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
| DECQ-0010 | Which definition governs "an Elephant" (4 incompatible candidates) | DELIBERATION → OWEN_GUIDANCE | DELIBERATION_RECORDED / **NEEDS_OWEN** | [Lab deliberation 2026-10-12](03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/DELIBERATION_ELEPHANT_DEFINITION_2026-10-12.md) | Four definitions coexist unreconciled: cognitive role / entity / reloadable node / capsule+ledger. The sharpest conflict: node and capsule both say a single session is NOT an Elephant, so Round-0 arms were workers. | Choose a definition, or authorize operating on the conservative compatible reading |
| DECQ-0011 | Which ECP grammar is design-of-record (v0.1 vs v0.2) | DELIBERATION → OWEN_GUIDANCE | DELIBERATION_RECORDED / **NEEDS_OWEN** | [Same deliberation](03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/DELIBERATION_ELEPHANT_DEFINITION_2026-10-12.md) | `protocol/02_ECP_V0_SPEC.md` (v0.1, 14 commands) and `claude/ECP_SPEC.md` (v0.2, supersedes "for this submission only") both claim it. v0.2's anchor-quote verification is the valuable part and is currently submission-scoped. | Name the design-of-record, or keep both scoped |
| DECQ-0012 | Whether unattended / elastic swarm execution is permitted | OWEN_GUIDANCE | **NEEDS_OWEN** (safety-scoped) | [Same deliberation](03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/DELIBERATION_ELEPHANT_DEFINITION_2026-10-12.md) | `01_MASTER_CHARTER.md:31` excludes "unbounded 24/7 unattended execution"; `ADAPTIVE_SWARM.md` + launch manifest prepare exactly that. | **Blocks the adaptive swarm.** Keep `PREPARED_NOT_LAUNCHED` until answered |

### Owner endorsement of lab recommendations — 2026-10-12

Owen approved the lab-ops recommendations. **This endorsement is recorded precisely, because an endorsement of a *stance* is not a *decision* on the underlying question, and this tracker must not let the two blur together.**

**Endorsed as operating practice (these are now settled):**

| # | Recommendation | Resulting status |
|---|---|---|
| E1 | Do **not** build the ZCode staff-lane comms layer; reconcile the documents instead (mark each mechanism LIVE / HISTORICAL / ABANDONED) | **OWNER_ENDORSED — DO NOT BUILD.** Layer-2 comms stays out of scope. See [COMMS_LAYERS_2026-10-12.md](03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/COMMS_LAYERS_2026-10-12.md) |
| E2 | Hold all four Elephant definitions open and **operate on the conservative compatible reading meanwhile**: an Elephant is *at least* a bounded cognitive role and *never* holds authority; a session qualifies as an Elephant only when its capsule/epoch basis and contamination state are declared; reconstruction must be demonstrable | **OWNER_ENDORSED — CONSERVATIVE READING IS THE OPERATING STANCE.** DECQ-0010 remains **OPEN** as a definition question |
| E3 | Keep the adaptive swarm `PREPARED_NOT_LAUNCHED` | **OWNER_ENDORSED — HOLD.** DECQ-0012 remains **OPEN**; nothing was permitted or forbidden |
| E4 | Leave everything unratified and unpromoted; Round 0 results stay evidence, not canon | **OWNER_ENDORSED** |
| E5 | Ship the lab operations layer (receipts, registry, custody, provenance, bound-before-reporting, actor separation) on a branch, not main | **OWNER_ENDORSED — DELIVERED** on `labs/elephant-lab-operations` (`6d79f03`…`eb61e39`) |

**Explicitly NOT closed by this endorsement**, because no recommendation was made on them:

- **DECQ-0010 (which definition governs)** — E2 endorses a *holding* position. All four candidates remain live and available.
- **DECQ-0011 (which ECP grammar is design-of-record)** — no recommendation was offered; E2's reading depends on capsule/epoch declaration, which is v0.2-flavoured but was not put to the owner as a choice.
- **DECQ-0012 (unattended/elastic swarm execution)** — E3 endorses *not launching yet*. It is not a grant of permission and not a prohibition.
- **DECQ-0002 (Ratchet for greenfield)** — the question was reframed, not answered. Ratchet is intact but unused since 2026-10-09; it remains the only machine-enforced coordination layer, so greenfield currently has none.
- **The autonomy sentence** — no recommendation existed to approve. Lab-ops continued to operate on the narrow default (assemble, verify, backfill, route; commit to a branch; launch no arms). This remains an open request to Owen.

**Recorded by:** lab-ops · **Status of this entry:** `OWNER_ENDORSED` (recommendations) · `NEEDS_OWEN` (underlying questions) · **Nothing here ratifies a protocol, promotes an arm result, or creates authority.**

### DECQ-0002 — evidence gathered 2026-10-12 (DOCUMENTARY_RECONCILIATION, not a decision)

**This entry records verified facts to reduce the scope of the outstanding owner choice. It decides nothing and clears no `NEEDS_OWEN`.**

The open question is whether Ratchet governs greenfield or is historical reference. The evidence narrows it: **the machinery is intact and usable; it has simply not been used since 2026-10-09, and its own board projection is now stale.**

| Check | Observed 2026-10-12 | Consequence |
|---|---|---|
| `omega-baseline/experimental/ratchet/src/cli.ts` | **exists** | Ratchet is not broken or missing; `bun run ratchet` is runnable |
| `scripts/omega.ps1` (cited by `ratchet/OPERATING.md:3`) | **exists** | An earlier note claiming this path was absent was **wrong**; do not repeat it |
| Commits touching `.project/ratchet/` or the ratchet source since 2026-10-09 | **0** | Dormant, not deleted |
| `D1-BOARD.md` recorded probe HEAD | `ef9497329e67`; task list `db0cdd956eb7` | Stale against every commit since |
| Repo HEAD when last checked | `d51089adb255` (was `1199b38` at the 2026-10-11 corpus pass) | Board counts (59/95 gates green, 54 promoted) are **not current truth** |
| Commits since 2026-10-09 | all Elephant Protocol Gym work | The active workstream has not used Ratchet at all |

**What this changes for whoever works next.** Ratchet is the *only* machine-enforced coordination layer in this repository — gate promotion, regression priority, reviewer separation by label, gate anchoring, and expiring claim leases all live there. Every other coordination mechanism (DESK, RACI, the lane roster, heartbeats, stuck detection, cost control, session claims, build-guidance telemetry) is prose-only, and the `ops/local-state` telemetry branch currently contains no snapshot. So the greenfield Elephant work is currently operating with **no enforced coordination layer at all**.

That inverts the obvious reading. The live question is not "should we retire Ratchet?" but **"should greenfield adopt the existing Ratchet loop, or build lab-local enforcement instead?"** The Elephant labs now have lab-local enforcement (a run registry with re-hashed artifact custody, negative controls, and receipts that require a witness-provenance field) — but it is scoped to the Gym and does nothing for cross-team coordination.

**Owner choice still required.** Which authority governs greenfield execution: (a) revive Ratchet as the governing loop, (b) keep it historical and treat lab-local enforcement as the greenfield mechanism, or (c) something else. **Not decided here.** Note that (a) and (b) are not mutually exclusive in practice, since Ratchet's lease and reviewer-separation mechanics are precisely what a lab fleet lacks.

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
