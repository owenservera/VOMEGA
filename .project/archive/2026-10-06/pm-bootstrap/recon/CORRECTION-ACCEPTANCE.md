# PM owner correction — acceptance record

Status: **ACCEPTED (owner disposition 2026-10-06: accept with a small final correction pass — pass applied)**.
Authority: [PM-CORRECTION-FIRST-FIVE-ONLY.md](../PM-CORRECTION-FIRST-FIVE-ONLY.md) is definitive.

## Timeline of checks

| Check | Who | Outcome |
| --- | --- | --- |
| C7 dogfood, first run | fresh worker, views only | 12/15 — selection rationale, evidence pointers and task/proof descent missing |
| C7 gap fixes | integrator | all three rendered |
| C8 independent review | reviewer who wrote nothing | accept-with-changes — 4 required changes (orphan view, orphan check, register supersession, unknown-id guard) |
| C8 fixes | integrator | all applied |
| **C7 dogfood, rerun (fresh worker)** | fresh worker, views only | **14/15, zero fallbacks — criterion ≥14 MET** |
| Owner review | Owen | accept with a four-item final correction pass |
| Final pass | integrator + two doc writers | all four items applied (below) |

## C7 — final fresh-worker result (measured)

A worker with no prior context, given only the nine generated views, answered **14 of 15** questions
fully, opening **no file outside the permitted set**. Criterion ≥14: **met**.

The single PARTIAL was Q15 (how PM scope can expand): the views labelled scope as owner-directed and
pointed at `scope.json`, but never stated the expansion mechanism inline. A one-sentence
"How PM scope expands" section was added to `SELECTED-PROGRAMS.md` **after** this run (owner-only
edit of `scope.json`; PM cannot add or propose; `pm:check` enforces agreement). That addition is not
re-verified by a third run — the measured score stands at 14/15.

## C8 — independent review result

PASS: no decisioning logic in PM code (grep-verified); managed set derived only from `scope.json`;
five complete dossiers; 25 phases all gated; MP21-G3 / MP56-G4 cross-program unlocks explicit;
estimates match the directive §13 across all 25 phases; machine projection freshness enforced
(hand-edit demonstrated caught, exit 1). Attacks held: adding MP-61 → `OUT_OF_SCOPE_PROGRAM`;
a `priorityScore` field → strict-schema rejection.

Required changes, all applied: delete the stale pre-correction 67-program `generated/PORTFOLIO.md`;
add `PROJECTION_ORPHAN` so a stale view can never persist; supersede `PROGRAM-REGISTER.md` to
reference-only (README pointer corrected); fail `UNKNOWN_MANAGED_PROGRAM` for a fabricated scope id.

Accepted limitation: widening `scope.json` with a matching, well-formed file cannot be distinguished
from an owner edit by any machine — the boundary is procedural (git history + `scope.json`), which is
deliberate for an owner-decided scope.

## Owner review disposition — four final changes

1. **Stale PM instructions** → `ZCODE-BOOTSTRAP-PROMPT.md` and `ZCODE-PM-TEAM.md` rewritten
   (five-only custodial mission, non-authority list, current system, next work, falsifier);
   `SYSTEM-DESIGN.md` rewritten to the implemented system (67-portfolio, frontier and ranking views
   removed); `EVOLUTION-RULES.md` rewritten with the "Portfolio ranking" section removed; `README.md`
   rewritten to the five-only model with the 67-hierarchy diagram, scope statement and document index
   corrected. Every rewritten doc carries a lineage banner naming the correction as superseding.
2. **Misleading evidence state** → `UNPROVEN 5` is gone. The views now separate the four dimensions:
   **Canonical state** (META-TRACKER) · **PM plan resolution** (PHASED etc.) · **Execution** (not
   linked — no phase scheduled into the Ratchet) · **PM evidence coverage** (`NO_LINKED_PROOF`,
   explicitly "whether PM holds a linked proof record — not a claim about the project's evidence
   state"). `evidenceState` was renamed `pmEvidenceCoverage` in the code and its tests.
3. **Dogfood gate** → rerun by a genuinely fresh worker: 14/15, zero fallbacks (above).
4. **This record** → updated after the rerun, as required.

## Verification at close

- `bun run pm:test` — 21 pass / 0 fail
- `bun run pm:check` — ok, exit 0 (1 warning: MP-60 P5 E5 decomposition-review flag)
- `bun run omega:quick` — 62 pass / 0 fail / 1,622 assertions (baseline unchanged)
- `bun run ratchet drift` — 6/6 facts green
- Generated views: SELECTED-PROGRAMS, ROADMAP (25 phases), DEPENDENCIES (25 gates),
  ESTIMATES, five PROGRAMS dossiers, portfolio.json — all freshness- and orphan-checked.

## Next work (per owner disposition)

PM-system design is **frozen**. The next engagement is **deep MP-21 design** — building on the MP-21
dossier, which now defines deterministic SourceAnchors, claim classes, manifest/runtime parity,
extracted-vs-suggested separation and migration safety. No further PM infrastructure.