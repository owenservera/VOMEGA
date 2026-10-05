# EXP-L1 — Handoff (Semantic Experiment Baseline, first increment)

Status: **DONE (baseline definition only). No product code changed, no config changed, new files only.**
Date: 2026-10-05
Owner this increment: EXP-L1 (bounded). Downstream owners named below.

## What was delivered

Definition of the EXP baseline scenario-runner shape, corpus-run mapping, semantic diff
format, baseline metric definitions, metamorphic candidates, and VisualSpec consume format.
No grammar was promoted; the release corpus was not mutated.

## Artifact paths

- `omega-baseline/experimental/lab-scenarios/EXP-BASELINE.md` — the EXP-L1 definition (a–f).
- Design source read: `seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md` (§3–13, 19, 26, 27).
- Release corpus (unmodified): `omega-baseline/plugins/vivim-nlcl/test/fixtures/release-use-corpus.json`
- Existing runner/test: `omega-baseline/plugins/vivim-nlcl/test/release-use-corpus.test.ts`
- Interpretation engine: `omega-baseline/plugins/vivim-nlcl-pure` (`interpret`, `emptyWorld`, `DEFAULT_FRAMES`)

## Baseline facts established (evidence, not authority)

- Corpus: 17 cases / 9 categories; `baseline:fail` cases run as `test.failing` (no silent drift).
- Confirmed baseline positives: `U1` false-ready (`status:"ok"` with unresolved required account);
  `A1`/`A2` ambiguity preserved (priors rank, never decide); `R1`/`S1` replay + consent gate hold.
- Confirmed baseline gaps (tasks already tagged in corpus): `P1/P3/P4/P5` (CMD-04 addressee-first),
  `O1` verb collision `have`→prompt.send (CMD-07), `O2` help phrase (HLP-03), `G1` no registration
  family (CMD-07), `U1` validator weakness (CMD-06).

## Open questions

1. Does a `RevisionResult` need the full raw `Interpretation` retained, or is the normalized
   `handles[]` projection sufficient for diffs? (Lean: keep raw for audit, diff on handles.)
2. `time-to-honesty` requires multi-revision scenarios; current corpus is single-input. Should the
   runner synthesize revisions from metamorphic transforms, or must the corpus gain explicit
   `revisions[]`? (Lean: explicit revisions, per §4.)
3. VisualSpec `readyState` enum must be reconciled with engine `status` values before any VFX work.
4. Metric thresholds: `false-ready` target "effectively zero" is unquantified; needs a number.

## Downstream triggers (route via Commons; do not auto-start)

- **SDW** (semantic/design workstream): consume `EXP-BASELINE.md §(a),(c),(d)` to pin the Lab
  Profile and diff/metric engines (EXP-A/C/D). May not alter baseline; candidates only.
- **LNC** (language/NCL): owns CMD-04/06/07 adaptation candidates. Trigger: run P1/P3/P4/P5, U1,
  O1, G1 through the runner and submit diff evidence; promotion requires labels (§16).
- **VFX** (visual): consume `§(f)` VisualSpec format and metrics list; frozen `semanticInputDigest`
  is a hard precondition — no variant may change handles.
- **SKW** (skill/wiki): consume `§(f).wikiPrimary` and §19 Wiki invariance; Wiki falsifier §15
  still needs a runner hook.
- **TRU** (truth/verification): must independently review the metric definitions in `§(d)` and the
  falsifiers in `§27` before any promotion decision is honored; EXP-L1 is lab evidence only.

## Guardrails honored

No product-code rewrite; no git writes; no config changes; new files only. Independent review of
the metric definitions is required before downstream use. Nothing here grants promotion authority.
