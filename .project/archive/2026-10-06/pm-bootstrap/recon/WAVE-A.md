# PM Recon — Wave A (understand)

Status: **RECON FINDINGS** — evidence, not frozen design. Consolidated by `PMC-LEAD`.
Date: 2026-10-06 · Source HEAD: `93075cf` (local == `origin/main`) · Route: `openrouter/openrouter/auto`.

Four bounded, read-only subagents ran concurrently per charter Wave A. Each had a ≤8–10 tool-call
budget and returned findings only; no subagent wrote to the repo. All four completed (20–33 s each),
consistent with the recorded harness behaviour that *bounded* workers finish where unbounded ones stall.

| Slot | Mandate | Verdict (verbatim, condensed) |
| --- | --- | --- |
| `PMC-CUR` | Validate the 67-program register vs canonical | "Register faithful at identity/meaning level; no material drifts; 4 minor gaps." |
| `PMC-AUT` | Duplication risk + minimal substrate | "Markdown/JSON seeds + small TS validator/projector; PM references, Ratchet computes." |
| `PMC-DEP` | Audit first-five gates/estimates | "Internally coherent; no undefined gate refs; 4 real defects + 2 diagram-vs-table contradictions." |
| `PMC-TRU` | Adversarial challenge | "Justified only as a thin generated projection — and as scoped it is not that." |

---

## A. Program register fidelity (`PMC-CUR`)

**Count:** canonical defines exactly 67 (`meta-tracker.json` `counts.metaPrograms: 67`, array MP-01…MP-67);
register covers MP-01…MP-67 contiguously — no extras, no omissions.

**Names/explanations:** verbatim copies of canonical `name`/`purpose` (sampled 20+ across all families).
Only cosmetic drift: MP-28 ``Live `prompt.send` realization`` rendered without backticks.

**Families:** map 1:1 onto canonical domains A–G with identical boundary ranges; labels are renamed
("Provider reality" vs "Real providers, routing and external reality") — MINOR.

**Objectives:** every row has canonical purpose (part 1) + generic slice template (part 2, self-declared
generic) + canonical `notes` verbatim (part 3). Part 3 never empty, program-specific for all 67.

**Maturity:** exactly MP-21/54/55/56/60 SEEDED, all 62 others TBD — matches design.

**Minor gaps (all MINOR, none material):**
1. The "Final Ω vision" statement is **PM-authored framing**, not cited from canonical or `seed-docs`
   (the task brief attributed it to `README.md` §"Final Ω vision", which does not exist).
2. The "Contribution to final Ω vision" column is PM interpretation (permitted by the register's own
   disclaimer, but it is interpretation, not evidence).
3. The register **omits canonical `state` and `priority`** per program — deliberate, but means it cannot
   be read for maturity/priority and is not a full projection of the canonical row.
4. Family label renaming (above).
5. Claimed source HEAD `e843241` **unverified** in this read-only pass.

## B. State ownership, duplication risk, substrate (`PMC-AUT`)

**Existing state owners (who already owns what):**

| State kind | Owner | Kind |
| --- | --- | --- |
| Program identity/meaning | `META-TRACKER.md` (canonical prose) + `meta-tracker.json` (projection) | prose / projection |
| First-release task status | `roadmap/TASKS.md` + `roadmap/workstreams/WS-*.md` | prose |
| Live claim/execution summary | `agentic-launch/STATUS.md` + `COMMONS.md` | prose (known to disagree) |
| Atomic task/acceptance | `deliverables/D1-ATOMIC-TASKS.md` → `.json` (`ratchet.taskgraph/0`) | prose → generated |
| Computed execution/proof state | `omega-baseline/experimental/ratchet/specs/d1/spec.json` + gates + ledger | computed |
| Evidence class | `seed-docs/PROOF-AND-MATURITY.md` + `spec.evidenceClass` | canonical / projected |
| HEAD/provenance | Git + ratchet `lock.anchors` | computed |
| Dependency edges | roadmap "Depends on" + D1 `tasks[].deps` (ratchet computes BLOCKED) | prose / computed |

**Duplication risks:** five MATERIAL — program meaning, execution state, proof state, first-release tasks,
dependency edges — plus MINOR evidence vocabulary, maturity enum, HEAD bookkeeping. The design's own §12
already names the program-meaning anti-pattern; the risk is that §3's "mandatory program fields" land it anyway.

**Substrate recommendation:** **Markdown/JSON seeds + a small TypeScript validator/projector**, living in
`omega-baseline/` (the only buildable workspace — there is **no root `package.json`**; Bun + zod + `bun test`
already there; Ratchet is already spec-driven JSON + tests). SQLite rejected for v0 (unreviewable, ownerless,
duplicates git provenance); TS-in-memory rejected (loses diffable lineage). v0 does **not** need its own task IDs,
its own proof/execution state, restated meanings, a UI or a database.

**Non-duplication contract:** PM *references and projects*; Ratchet *computes and owns*. PM owns exactly one new
thing — the decomposition graph (program → phase → cross-program gate → work package) keyed by existing `MP-xx`
IDs — and stores no program meaning. For executable work it stores only a foreign key to task/gate and reads
state from Ratchet. On disagreement, Ratchet wins and PM is corrected.

## C. First-five gate/estimate audit (`PMC-DEP`)

**OK:** all rough totals equal the exact sum of phase bands (MP-21 4,800–9,600; MP-55 2,500–5,100;
MP-56 3,350–7,250; MP-54 2,550–5,450; MP-60 5,300–12,450). **No referenced gate is undefined** — every
dependency gate (MP21-G3, MP55-G2, MP56-G4, etc.) is defined as a phase exit gate. Critical unlocks confirmed:
MP21-G3 widest fan-out (3 consumers), MP56-G4 second.

**Defects:**
- **MATERIAL — rules-vs-data:** MP-60 P5 is graded **E4–E5**; EVOLUTION-RULES §7 requires a decomposition
  review for any E5 phase. No such review is recorded. Single clearest operating-rule violation.
- **MATERIAL (risk) — shared-identity convergence not gated:** ArtifactRef has **no consumer** in any of the
  five designs; MP-56 defines a local "event identity" and MP-55 a failure "signature" while MP-60 P3 must join
  traces to the MP-21 graph — **no gate owns the TraceRef↔EntityRef/SourceAnchor mapping.** This is literally
  SYSTEM-DESIGN §12's "five different identity systems" anti-pattern, asserted away rather than designed away.
- **MINOR — 9 of 25 phases have no exit gate** (MP-55 P3/P4; MP-56 P3/P5; MP-54 P3/P4; MP-60 P1/P3/P5).
  MP-60 P1 ("should influence MP-21 design") has no observable exit at all.
- **MINOR — soft/program-level deps bypass the gate rule** (e.g. "MP60 P3 useful", "MP67 measurement
  discipline"). MP-54 P5 and MP-60 P5 are gated on MP-67, which has no phase plan or gates.
- **MINOR — gate/band metadata not carried:** §6 wants proof/status/consumers/source refs per gate; §8 wants
  per-item LOC confidence/basis. Seeds carry a one-line statement and a single global LOW–MEDIUM confidence line.

**Contradictions:**
- Diagram omits MP-55 P3's hard edge to MP21-G3 (drawn unlocking only MP-54 P2 and MP-60 P2).
- Soft edges (MP-54 P4→MP60 P3, MP-56 P5→MP55, →live traces) absent from the diagram.
- `MP21-G3` framed two ways: strategy header "Queryable Reflection Graph / stable structural identities" vs
  gate statement "external consumer can resolve stable entity refs and relations."

## D. Adversarial challenge (`PMC-TRU`)

**Verdict:** The PM layer is justified **only as a thin, generated projection** over state that already exists —
and as scoped it is not that. Most "mandatory program fields," the maturity vocabulary and the dependency column
duplicate META-TRACKER / DECISIONS / Ratchet / roadmap. The only genuinely new element is phase/gate/estimate
detail for 5 of 67 programs — a small extension to META-TRACKER plus FIRST-FIVE-SEED, not a new system. The
"references, never owns" boundary is **unenforceable policy with no mechanical validator**, so it will erode.

**Strongest objections:**
1. **Necessity (HIGH):** Ratchet §1 already diagnosed this pain with data (49/51 docs: commits; six design docs
   and no executable artifact). The PM design answers with seven more documents. Failure mode: PM becomes another
   surface to reconcile and the docs-commit ratio does not fall.
2. **Triple status vocabulary (HIGH):** META-TRACKER has a status+priority set; Ratchet computes
   REGRESSED/DONE/PROVEN/BLOCKED/CLAIMED/OPEN/SUPERSEDED; PM adds REGISTERED/SEEDED/PHASED/… `PROVEN-SLICE`
   appears in two vocabularies with different generation rules. This reproduces the very STATUS-vs-SITREP
   disagreement Ratchet §1 flagged.
3. **Field duplication with no drift mechanism (HIGH):** Explanation/Objectives/State/Dependencies/Falsifiers/HEAD
   all overlap existing owners; the design cites Ratchet's `check`/`SPEC_CHANGED` as a model but proposes **no
   equivalent probe**. Silent fork is the concrete failure mode.
4. **False precision becomes commitment (MED-HIGH):** E0–E5 and LOC bands for 62 uninspected programs get quoted
   as targets; EVOLUTION-RULES §6 having to forbid grading agents by LOC-vs-estimate is evidence the pressure is real.
5. **"Uneven resolution" has no tripwire (MED):** nothing measures the maturity distribution, so both over-planning
   all 67 and planning none are invisible.
6. **Team is ceremony at current scale (MED-HIGH):** six standing functions + a 5-way fan-out to maintain 67
   transcribed rows, 5 roadmaps and an unchosen substrate re-runs the "long on design, short on executable
   evidence" pattern.

**What survives:** the hierarchy as *named, addressable* concept; **gate-level dependency** (`MP54-P2 ← MP21-G3`)
as a real improvement over META-TRACKER's coarse notes; handing the executable layer to Ratchet; variable
resolution / "map preserves possibilities"; the §12 anti-patterns; the MP-67 self-retirement clause (but it must
be made mechanical); honesty about DESIGN-ONLY status.

**Falsifiers proposed for the PM system itself:** (1) onboarding cost vs reading META-TRACKER+SITREP+roadmap+REALITY;
(2) a drift validator that re-derives program fields and exits non-zero on divergence; (3) maturity-distribution
snapshot with every level above REGISTERED linked to a dated evidence event; (4) estimate staleness — revision-or-explicit-hold
rate after each evidence event; (5) `docs:`-commit ratio (baseline ≈ 96%) must fall.

**Cuts proposed:** drop the separate maturity vocabulary (derive it); drop stored `Last reviewed source HEAD`;
publish LOC/effort only when a decision is pending; make the register a projection of `meta-tracker.json`, not a
parallel source; cut the team to one integrator + one independent review step; replace the 5-way recon fan-out with
one schema + validator + generated view.

---

## E. Convergence and disposition (`PMC-LEAD`)

All four agents point the same way, independently:

- **The durable value is small and mechanical:** a machine-readable **decomposition graph** (program → phase →
  gate → work package) keyed to existing `MP-xx` IDs, plus a **drift/reference validator**, plus **generated views**
  that read existing owners. That is the only thing not already present.
- **The dominant risk is a new prose authority:** a parallel register, a third status vocabulary and stored
  estimates with no validator. This must be designed out, not disclaimed away.
- **First-five data is sound on arithmetic and gate references**, but carries four real defects, the sharpest being
  the unowned TraceRef↔EntityRef identity mapping and the unreviewed E5 phase.

**Direction for Wave B (v0 design freeze) — proposed, not yet frozen:**
1. PM **owns no program meaning and no execution/proof state.** It stores a decomposition seed keyed by `MP-xx`,
   and only references Ratchet/roadmap task IDs.
2. **Maturity becomes derived**, not a fourth hand-edited vocabulary.
3. **A validator is the load-bearing artifact**, not the prose. v0 succeeds only if `pm:check` fails on a dangling
   `MP-xx`/task ref or on divergence between the seed and `meta-tracker.json`.
4. **Estimates are published only where a decision is pending**; no numbers for the 62 uninspected programs.
5. **Team staffing reduced for this scale:** `PMC-LEAD` (integrator, sole writer) + `PMC-TRU` (independent review
   step). Curator/Automation/Dependency become checklists and on-demand slots, not standing agents.
6. **The four first-five defects are carried into the seed as known gaps**, not silently fixed: E5 review for
   MP-60 P5, TraceRef↔EntityRef mapping ownership, the 9 ungated phases, and the diagram's missing MP-55 P3 edge.

**Not adopted at recon:** building the prose/system-design layer as an editable authority; a PM database; a UI;
per-program estimates for uninspected programs; a five-way standing team.

## F. Open questions (carried to Wave B)

1. Should the register carry canonical `state`/`priority` (or cite the tracker) so registration is never mistaken
   for maturity? (`PMC-CUR`)
2. Where should the "Final Ω vision" text be sourced from, or should PM label its framing as PM-authored? (`PMC-CUR`)
3. Are MP55-G3/G4, MP56-G3/G5, MP54-G3/G4, MP60-G1/G3/G5 intentionally absent, or were exit gates dropped? (`PMC-DEP`)
4. Which gate owns the TraceRef↔EntityRef/SourceAnchor mapping MP-60 P3 needs? (`PMC-DEP`)
5. Is "MP60 P3 useful" a real gate dependency to promote to a named `MP60-Gn`? (`PMC-DEP`)
6. Is `meta-tracker.json` generated from `META-TRACKER.md` or hand-maintained? If hand-maintained, PM validation
   must treat them as two peers, not source/projection. (`PMC-AUT` — **UNVERIFIED**)
7. Should the maturity-distribution tripwire and the onboarding-cost falsifier be implemented in v0 or deferred? (`PMC-TRU`)

## G. Truth / limits of this pass

- All findings are from bounded read-only recon at HEAD `93075cf`. None is a frozen design decision.
- `meta-tracker.json` regeneration status, the register's claimed seed HEAD `e843241`, and whether
  `PROGRAM-REGISTER.md` duplicates `META-TRACKER` content beyond names/notes were **not** verified.
- No subagent wrote to the repo; this file is the only Wave A write, by `PMC-LEAD`.
