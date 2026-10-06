# PM owner correction — acceptance record (C7 + C8)

Status: **ACCEPTANCE EVIDENCE** for `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md`.
Date: 2026-10-06 · Reviewed at merge `3f3b3df` · Both checks ran as bounded, read-only subagents.
This file is the durable record; the fix commits follow it.

## C7 — fresh-worker dogfood

A fresh worker (no project context) was given **only** the generated views
(SELECTED-PROGRAMS, ROADMAP, DEPENDENCIES, ESTIMATES, five PROGRAMS dossiers) and asked the
correction's 15 orientation questions. It opened no other project file.

**First-pass score: 12/15** (target ≥14). Zero NOT-ANSWERABLE; three PARTIAL:

| # | Gap | Fix applied |
| --- | --- | --- |
| Q1 | Why *these* five (views said only "owner-directed") | `SELECTED-PROGRAMS.md` now carries "Why these five (owner decision, not PM's)" — the development-multiplier rationale with its recording directive cited |
| Q12 | Where evidence for current state lives | every dossier now has an **Evidence pointers** section: canonical row source, dated evidence events, current derived state, and the named Ratchet as execution/proof owner |
| Q13 | How work descends into tasks/proof | `SELECTED-PROGRAMS.md` now carries "How work descends into execution and proof" — names the Ω Proof Ratchet as the executable layer and states honestly that no managed phase is scheduled into Ratchet tasks |

The worker's two remaining suggestions (prerequisite availability; sequencing guidance across the
five) are **recorded, not built** — PM has no authority to sequence, and the owner correction froze
feature expansion. They belong to a future owner decision.

**Re-scored expectation: 15/15** with the fixes above (Q1/Q12/Q13 move to ANSWERED).

## C8 — independent review

An independent reviewer (wrote nothing) verified the correction's §22 acceptance criteria by
reading code/data and running `pm:test` + `pm:check`, plus live attacks.

**Verdict: accept-with-changes.** PASS: no decisioning logic anywhere (grep-verified); scope derived
only from `scope.json` (never from META-TRACKER); five complete dossiers; 25 gated phases; MP21-G3 /
MP56-G4 relationships explicit; all five P1 starts visible as unblocked; estimates match §13 exactly
(all 25 verified); machine projection freshness enforced (hand-edit demonstrated caught, exit 1).
Attacks: adding MP-61 → `OUT_OF_SCOPE_PROGRAM`; a `priorityScore` field → strict-schema rejection.

**Required changes (all applied):**

| # | Finding | Fix |
| --- | --- | --- |
| 1 | Stale pre-correction `generated/PORTFOLIO.md` still shipped ("programs: 67", "UNPROVEN 67") and no check could see it | deleted; and `pm:check` now **fails on orphan files** under `generated/` not produced by the current projector (`PROJECTION_ORPHAN`) |
| 2 | `.project/pm/PROGRAM-REGISTER.md` still materialized all 67 as an active register | superseded with a lineage-preserving banner (reference-only context; canonical meaning stays in META-TRACKER); `README.md` pointer corrected |
| 3 | Orphan views could silently persist | orphan scan added to `pm:check` (see #1) |
| 4 | A fabricated managed id (e.g. MP-99) in scope.json would render "UNRESOLVED" instead of failing | `validate()` now fails with `UNKNOWN_MANAGED_PROGRAM` when a managed id is not in `meta-tracker.json` (tested) |

**Accepted limitation (documented, not fixable by code):** widening `scope.json` *with* a matching
well-formed file cannot be distinguished from an owner edit by any machine — the expansion rule is
procedural (scope.json expansionRule, directive §19, git history). This is inherent to owner-decided
scope and is recorded in scope.json.

## Truth / limits

- Both checks are single-sample, bounded, read-only passes at merge `3f3b3df`; the dogfood re-score
  after the fixes is an expectation, not a re-run.
- No PM decisioning authority was exercised: the fixes above render facts the correction already
  states; none of them selects, ranks or prioritizes anything.
- After the fixes: `pm:test` 21/0, `pm:check` ok (1 warning = MP60-P5 E5 decomposition-review flag),
  10 generated views, stale orphan gone.
