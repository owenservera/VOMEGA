# EVALUATION, SELECTION, ASSIMILATION, LEARNINGS (v0.2)

**Design goal:** make as much of the score as possible **mechanical**, meaning computed by tools from frozen tests, so that a degraded evaluator (the same agent that played the arms) has little room to steer the outcome. Whatever stays judgment is labelled as judgment and kept out of selection when independence is DEGRADED.

## 1. Inputs, what is hidden, and in what order things happen

| Input | Evaluator sees | When |
|---|---|---|
| Contract + frozen acceptance files (hashes committed at `MANIFEST_FROZEN`) | yes | always; `evalkit run` refuses an acceptance file whose hash was not committed |
| **Edge probes** written by the evaluator **from the contract** | yes (authors them) | committed (`GATE PROBES_COMMITTED`) **before** staging exists; `evalkit stage` refuses otherwise |
| **Hidden oracle** (sealed in the pack, authored outside the run) | yes, after unsealing | only after `GATE ARMS_SEALED`, with the key the human supplies in turn B; `ORACLE_UNSEALED` is ledgered; `evalkit run` refuses an unsealed-mode oracle without it |
| Entrant code and raw outputs | `controller/eval-staging/<blind_id>/{product,out}` | after `stage`: ids are `b-` + 8 hex of `sha256(round\|arm\|salt)`; `BRIEF.md`, `ARM_RESULT.json`, `WRITES.json`, `.canary`, `process/`, `node_modules/`, `.git/` stripped; arm ids, `arms/<id>` paths and "track a/b" words redacted in text files |
| `ARM_RESULT.json` narratives | only by the tool, after `evalkit commit` | `evalkit join` audits them mechanically (§2, evidence) |
| Other rounds' scores | no | – |

**Stated limits of blinding.** Style fingerprints cannot be removed. Under SIMULATED isolation the evaluator *wrote* the entrants, so blinding is a formality. That is exactly why selection then runs on the mechanical sub-score only.

## 2. Rubric (0–100 per entrant per component)

| Criterion | Pts | Computed by | Kind |
|---|---:|---|---|
| Frozen acceptance | 30 | `evalkit run`: passed/total × 30. `tests_passed` = all acceptance tests passed (and no acceptance penalty) | **mechanical** |
| Hidden oracle | 25 | `evalkit run`: passed/total × 25 | **mechanical** (independently authored when sealed) |
| Edge probes | 15 | `evalkit run`: passed/total × 15 | evaluator-authored tests |
| Simplicity | 10 | `evalkit join`: `clamp(0, 10, round(5 + 5·(median − loc)/median))` over entrants of that component with loc > 0; loc = 0 → 0. LOC = non-blank, non-comment lines of non-test code under the component's `paths` (`evalkit loc`) | **mechanical** |
| Evidence quality | 10 | `evalkit join` → `audit`: 3 × share of `commands_run` whose output file exists · 3 × share of LIVE_RUN/MEASURED claims backed by an existing file (3 if there are only lower-level claims) · 2 if `files_changed` = `WRITES.json` · 2 if `limitations` is non-empty. **0** if `ARM_RESULT.json` is missing or invalid, or if any "all tests pass"-style claim is contradicted by the evaluator's acceptance run | **mechanical** |
| Maintainability | 10 | the evaluator: can a fresh reader state what the code does from tests and names alone, in ≤ 5 sentences, correctly? Integer 0–10, mandatory (`evalkit commit` refuses null) | **judgment** |

* `score` = sum of all six. `score_mechanical` = acceptance + oracle + simplicity + evidence (max 75).
* **Anti-gaming penalties** (written by the evaluator in `penalties[]` before commit; each zeroes its criterion at join; an `acceptance` penalty also sets `tests_passed:false`): test deletion/weakening inside the product, hard-coded oracle-looking constants, network calls, secret-looking strings, behaviour that special-cases test inputs.
* A criterion the evaluator cannot evaluate scores 0 with a note, never a guess. A suite with no parseable TAP summary counts 0/0 and is flagged in `notes`.

## 3. Files

* `evals/<blind_id>.<C>.json`: schema `team/schemas/eval.schema.json`. Mechanical fields are written by `evalkit run`; the evaluator adds `criteria.maintainability`, `penalties`, `notes`, `independence_notes`.
* `eval-commit.json` + `EVAL_RECORDED{phase:"committed", evals_tree_sha256}`. After this, any change to `evals/` makes `join` refuse (record an INCIDENT; never "fix" a score).
* `evaluation.json`: written by `evalkit join` — per (arm, component): `score`, `score_mechanical`, `criteria`, `tests_passed`, `isolation_ok` (from `isolation-report.json`), `loc_non_test`, `loc_median`, `evidence[]`, `audit_flags[]`. `audit/<arm>.json` holds the evidence breakdown.

## 4. Selection (`team/tools/select.mjs`)

Deterministic, model-free, and parameterised **only by the frozen manifest** (`--manifest`). A CLI margin or basis that differs from the manifest is refused unless `--override "<reason>"` is given, and the override is printed in the output.

1. Eligible = `tests_passed ∧ isolation_ok ∧ evidence ≠ ∅ ∧ 0 ≤ basis-score ≤ 100`.
2. Group by **(track, component)**; never compare across tracks.
3. The top eligible entrant wins only if it leads the runner-up by **≥ margin** (inclusive). Otherwise `TIE_CARRY_BOTH`, carrying every entrant within the margin of the top.
4. One eligible entrant → `SINGLE_ENTRANT` (selected, flagged "no alternative faced"). None → `NO_ELIGIBLE`.
5. **Basis:** `total` (`score`) when independence is FULL; `mechanical` (`score_mechanical`) when DEGRADED. The basis is fixed in the manifest by the census, before any score exists.
6. Structural errors throw rather than decide: a non-finite margin, duplicate (arm, component) rows, an arm listed under the wrong track or round. Sorting uses code-unit comparison (not `localeCompare`), so the Cockpit's TypeScript port reproduces it exactly (`fixtures/vectors/select.vectors.json`).
7. The output carries `input_sha256` (canonical hash of the evaluation), `basis`, `margin` and `margin_source`. `SELECTION_APPLIED` = byte-identical re-run. `round.mjs check` re-runs it at close.

**Why a margin.** With one evaluation per arm and LLM-written code, a 2-point difference is noise. Carrying both variants costs one arm next round; discarding the better one on noise cannot be undone.

## 5. Assimilation (per track master, separate phase)

For each component of that track:
* `SELECTED` → copy the winner's `product/` files for that component into `track-x/main`.
* `SINGLE_ENTRANT` → copy; `PROVENANCE.md` line `UNCHALLENGED`.
* `TIE_CARRY_BOTH` → keep both under `variants/<component>/<arm>/`. Main keeps the **lower-LOC** variant as the working default (recorded, not "best"). The next round's brief extends both.
* `NO_ELIGIBLE` → nothing enters main.

Then run the **accumulated suite** on `track-x/main`: every acceptance file so far plus every **burned** oracle. Save the raw output and tag `track-x-R<n>`. Integration fixes stay within the track and are listed in `ASSIMILATED{integration_changes}`. A substantial rewrite of an entrant's component flags it `RE-EVALUATE` next round. `PROVENANCE.md`: file → component → arm → round → score → status → eval file sha256.

## 6. Learnings

A track master promotes a learning only if it validates against `team/schemas/learning.schema.json` (`validate.mjs`): one falsifiable sentence, evidence paths, applicability, `revisit_if`. Sources are arm `learnings[]`, evaluator notes, audit flags and incidents. Filters: the learning appears in ≥ 1 raw evidence file (not only a narrative); it does not restate the brief; and its kind is one of technique / pitfall / measurement / decision / tooling. Lifecycle `ACTIVE → SUPERSEDED | REFUTED`; a refutation needs new evidence and its own `LEARNING_RECORDED`. Learnings flow forward into the **same track's** next briefs only. The other track's learnings stay invisible until R6.

Learning book: `track-x/learnings.jsonl` + generated `track-x/LEARNINGS.md` (grouped by kind, with ACTIVE/SUPERSEDED/REFUTED counts).

## 7. Cross-track comparison (R6) — pre-registered now, so it cannot be tuned later

* **Same instruments for both mains:** the full accumulated suite (all acceptance files + all burned oracles), plus any final sealed oracle the owner supplies, evaluated blind with `evalkit`.
* **Unit of analysis:** components C1–C8 (paired: A-main vs B-main per component).
* **Primary outcome:** per-component difference in `score_mechanical` (or `score` if every counted round was FULL independence). Differences within the margin count as ties and are dropped.
* **Decision rule:** "Track B adds validated value" only if a one-sided exact sign test over the non-tied components gives p ≤ 0.05 in B's favour (that is: 5/5, 6/6, 7/7, or ≥ 7/8 wins), **and** Track B's total cost (tool calls or minutes, whichever is recorded for both) is ≤ 1.5 × Track A's. The symmetric rule applies to "Track A is sufficient". With fewer than 5 non-tied components the result is **"insufficient evidence"**.
* **Claim level:** `MEASURED` only if every counted round was labelled `MEASURED-CAPABLE`. Otherwise the comparison is reported as descriptive statistics of a **process rehearsal**, with no decision.
* **Power, stated plainly:** with at most 8 paired units this design can only detect a near-uniform advantage. A null result is not evidence of equivalence.
* Also report: LOC, test counts, oracle escapes, cost, and Track-B-specific overhead from `consult.mjs stats` (consults, findings acted on, false positives, verified citation rate, stale warnings). Apply `outputs/claude/EXPERIMENT.md` §7 only where the data's claim level supports it.
