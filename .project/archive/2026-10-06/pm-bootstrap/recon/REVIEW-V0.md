# PM v0 — Implementation review + dogfood

Status: **REVIEW RECORD** (evidence, not architecture). Date: 2026-10-06.
Reviewed at commit `56fe9c4`. Reviewers: independent bounded `PMC-TRU` (implementation) and a
separate fresh "worker" (orientation dogfood). Consolidated by `PMC-LEAD`.

## 1. Implementation review (`PMC-TRU`) — verdict: accept-with-changes

Sharpest finding, and it was a real bug: **`pm:check` was red on the shipped commit.** The
generated projection embedded `sourceHead`, and committing the projection advanced HEAD, so the
committed artifact was permanently "stale" — the freshness gate could never pass after its own
commit. Worse, `pm:test` did not catch it, because the shipped-seed test called `validate` only and
never exercised freshness.

| # | Finding | Severity | Disposition |
| --- | --- | --- | --- |
| 1 | `pm:check` red on the committed tree (volatile HEAD embedded) | MATERIAL | **Fixed.** The volatile HEAD is neutralized before comparison (`stripVolatileHead` / `stripVolatileHeadMd`); seed digest still compared. Test asserts HEAD-independence *and* that seed drift still shows. |
| 2 | `pm:test` could pass while `pm:check` was red | MATERIAL | **Fixed.** Freshness/HEAD tests and a `workPackages`-rejection test added; suite now 29 tests. |
| 3 | `schema.ts` comment overclaimed non-duplication as absolute | MATERIAL | **Fixed.** Comment now states the guard is a *name* blacklist; free-text fields (`outcome`, `statement`, `softDeps`) are unguarded prose. |
| 4 | §5 item 8 disagreed with §2 (no ratchet read implemented) | MINOR | **Resolved.** `pm:check` now reads `.project/evidence/d1-ratchet.json` **live** and prints a reference line (counts + head); nothing is stored, so it cannot fork ratchet state. `taskRef` linkage stays deferred to v0.1. |
| 5 | `validate` claimed "never throws" but dereferenced `tracker.programs` | MINOR | **Fixed.** Made defensive (`?? []`). |
| 6 | `cell()` escaped `|` but not newlines | MINOR | **Fixed.** Newlines collapsed; test added. |

Confirmed OK by the review (not just asserted by tests): dangling-gate-ref and banned-key falsifiers
genuinely fail the CLI; `planResolution` is total and MP-21 re-derives to PHASED by hand; reconnaissance
does **not** promote evidence state (all five correctly UNPROVEN); nothing writes to the ratchet or
`meta-tracker.json`.

**Residual known limitations (accepted, recorded — not fixed in v0):**
- Duplicate JSON object keys collapse silently in `JSON.parse`, so a doubly-defined program is
  undetectable (duplicate gate/phase ids *are* caught).
- `softDeps[]` is unvalidated prose by design; it records honest-but-weak dependencies (e.g. MP-67).
- The top two plan levels (`DECOMPOSED`/`EXECUTABLE`) are exercised only in unit tests, never shipped,
  because `workPackages` is rejected by the v0 schema.

## 2. Dogfood — fresh-worker orientation (`PMC-TRU`-independent, portfolio-only)

A fresh worker was given **only** `.project/pm/generated/PORTFOLIO.md` and asked the nine success-criterion
questions.

**Score: 1 of 9 fully answerable; 4 partial; 4 not answerable.**

- ANSWERED — which programs are deeply planned vs high-level (the counts cell + per-row plan column).
- PARTIAL — what the programs are (names yes, **purpose no**); what blocks a phase (gates shown, but every
  status is `TBD`); what is parallel (derivable from empty `Blocked by`, not stated); effort/LOC (only for
  the five, with band as a weak confidence proxy).
- NOT ANSWERABLE — which phase matters **now** (no "selected program" / active-phase notion); what evidence
  proves state (a blanket `UNPROVEN`); where work descends into executable tasks (phases are the floor); what
  changed and why (no delta field).
- Verdict: "cheaper than reading the corpus? Yes, but insufficient alone… good map, no legend and no
  'you are here'."

**Adopted in v0:** the portfolio table now renders a **Purpose (why it exists)** column, projected from
`meta-tracker.json` (read, not restated) — the single highest-value orientation fix.

## 3. v0.1 backlog (from the two reviews; not yet built)

Ordered by the reviews' own priority:

1. **"Now" / active-work view** — a frontier/next-action projection so Q3/Q4/Q8 are locatable. Likely a
   `frontier` view computed from open gates + unblocked phases, still without storing state.
2. **Evidence pointers** — replace blanket `UNPROVEN` with the referring event refs (and, when they exist,
   ratchet/ledger references), so Q7 has an answer.
3. **Plan delta / changelog** — record what changed in the plan and why (lineage), so Q9 has an answer.
4. **Gate metadata** — `owner`/`acceptor`/`evidence` columns on gates so a block can be located.
5. **`taskRef` linkage (v0.1 proper)** — allow `workPackages` once a program is scheduled, making
   `DECOMPOSED`/`EXECUTABLE` reachable and satisfying the Ratchet foreign-key half of the contract.
6. **Duplicate-key detection** — scan raw seed text for duplicate program keys before `JSON.parse`.

Each waits for evidence that it earns its keep; item 1 is the most defensible next step.

## 4. Truth / limits

- Both reviews are bounded, read-only passes; the dogfood is a genuine fresh-reader test but a single
  sample, and its "cheaper than the corpus" judgement is a self-assessment, not a measurement.
- The PM system still owns no program meaning and no execution/proof state; nothing here changes that.
