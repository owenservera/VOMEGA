# ROUND PROTOCOL — one round = two turns (v0.2)

A round is a fixed pipeline. Each step has an **entry condition**, an **action** (a tool command wherever one exists), an **exit artifact**, and a **ledger event**. A step that cannot complete is never skipped: the controller records an `INCIDENT` or `GATE{status:"BLOCKED"}`, finishes what is safe, and stops. The executable form of this page is `team/tools/e2e.test.mjs`: if the two disagree, the test wins and this page has a bug.

All commands run from the workspace root (`./omega-lab`), with the pack at `pack/`. Ledger: `node pack/team/tools/ledger.mjs emit ledger <TYPE> '<json>'`; every body carries `"round":"R<n>"`. `node pack/team/tools/round.mjs status .` tells you at any moment where the round is and what comes next; it also lints the ledger against this protocol.

## State machine

```
TURN A:  OPEN → CENSUS → FREEZE → PROVISION → LAUNCH → (arms) → COLLECT → VERIFY → ARMS_SEALED → COCKPIT v0
                                                                                   └─ STOP: AWAITING ORACLE KEY
TURN B:  [human: unseal C<k> <key>] → PROBES → STAGE → UNSEAL → RUN → JUDGE → COMMIT → JOIN → SELECT
         → ASSIMILATE (A, then B) → CONSOLIDATE → INGEST → CHECK → CLOSE → STOP: wait for "continue"
any step: INCIDENT → (FROZEN if LEDGER/SECRET) → human decides
```

**Why the split.** The arms' evidence is hashed into the ledger (`GATE ARMS_SEALED`) before the oracle key exists anywhere in the conversation. That makes "the arms could not have seen the hidden tests" true even when one agent plays every role. With `oracle.mode = SEALED_KEY_IN_PROMPT` the round may run in one turn, but the first screen then says the agent could have opened the oracle early.

## Steps

| # | Step | Action (tool) | Exit artifact | Ledger |
|---|---|---|---|---|
| A0 | **OPEN** | Create `rounds/R<n>/`. R0: self-test, then `round.mjs tree-hash pack`. Later rounds: read the previous closure, `NEXT_ROUND_PLAN.md` and pending decisions; `ledger.mjs verify ledger` must pass first | round dir | `ROUND_OPENED{pack_tree_sha256}` (R0) |
| A1 | **CENSUS** | `census.mjs probe rounds/R<n>` (R0 full; later rounds re-probe and `persist-check`), then the four agent protocols (sub-agent nonce, parallel overlap, cross-read, evaluator fresh context), then `census.mjs derive rounds/R<n>` | `CENSUS.json` (with `derived`), `census/*.txt` | `CENSUS_RECORDED{derived}`, `GATE CENSUS_OK` |
| A2 | **SEED** | R0: seed product root from scratch. Later rounds: per track, the previous track main **tag** (never a working tree). Git commit; seed is read-only afterwards | `seed/` @ SHA | – |
| A3 | **FREEZE** | `round.mjs order R<n> <arms…>` → fill the manifest (template in `team/templates/`) → `round.mjs freeze . R<n>`. Freeze validates the schema, refuses labels that disagree with the census, checks acceptance and sealed-oracle hashes, and **commits** manifest/acceptance/oracle hashes, margin, basis and run order | `round-manifest.json` | `GATE MANIFEST_FROZEN` (PASSED or BLOCKED with errors) |
| A4 | **PROVISION** | Per arm: `arms/<id>/product/` = seed copy without `.git`; `BRIEF.md` from `templates/ARM_BRIEF.md`; Track B: `consult.mjs init`. **Then** `isolation.mjs plant` **then** `isolation.mjs fence … snapshot` (the tool refuses to snapshot an unprovisioned arm) | arm dirs, `controller/canaries.json`, `fence.snapshot.json` | – |
| A5 | **LAUNCH / ARMS** | In `run_order`: `ARM_STARTED` → arm works (sub-agent if census proved it; else a labelled `PHASE{role:"arm"}`) → sequential: `isolation.mjs fence … step <id>` → copy to `evidence/R<n>/<id>/` → `ARM_FINISHED`. Parallel: launch all, no `step` | `ARM_RESULT.json`, `WRITES.json`, `out/*`, (`process/*` Track B) | `ARM_STARTED` (before), `ARM_FINISHED{status,claim,evidence[]}` |
| A6 | **VERIFY** | `isolation.mjs report rounds/R<n>` (canary scan + fence check + strength statement + blind spots + per-arm `isolation_ok`) | `isolation-report.json` | `ISOLATION_CHECKED{ok,tainted}` |
| A7 | **ARMS_SEALED** | `round.mjs seal-arms . R<n>` hashes `evidence/R<n>/`. Refused if an oracle was already unsealed | – | `GATE ARMS_SEALED{evidence_tree_sha256}` |
| A8 | **COCKPIT v0** (R0; later: increments) | Controller builds or extends the Cockpit (`06_…`); K1–K7 against `./fixtures` + vectors | `cockpit/e2e-R<n>-turnA.txt` | – |
| A9 | **STOP A** | `round.mjs status .` must say `AWAITING ORACLE KEY` | printed status | – |
| B0 | **RESUME** | `ledger.mjs verify ledger`, `round.mjs status .`, `census.mjs persist-check rounds/R<n>` | `census/persist-check.txt` | – |
| B1 | **PROBES** | `PHASE{role:"evaluator"}`; evaluator writes 3–5 edge probes **from the contract only**; `evalkit.mjs commit-probes` | `controller/probes/*.test.mjs` | `GATE PROBES_COMMITTED` |
| B2 | **STAGE** | `evalkit.mjs stage . R<n>`: blinded copies (`b-xxxxxxxx`), protocol files and `process/` stripped, arm ids/track words redacted | `controller/eval-staging/`, `controller/blind-map.json` | – |
| B3 | **UNSEAL** | `seal.mjs unseal <sealed> controller/oracle-unsealed/<C> --key …`; then `isolation.mjs report … --oracle <dir>` (oracle-copy scan) | unsealed oracle | `ORACLE_UNSEALED{component,sealed_sha256,key_fingerprint}` |
| B4 | **RUN** | `evalkit.mjs run . R<n> <C> --acceptance … --oracle … --probes …`: acceptance, oracle, probes, LOC per entrant | `evals/<blind>.<C>.{json,*.txt}` | – |
| B5 | **JUDGE** | Evaluator, from staging only: `criteria.maintainability` (0–10), `penalties[]`, notes | edited eval files | – |
| B6 | **COMMIT** | `evalkit.mjs commit . R<n>` freezes `evals/` (tree hash) | `eval-commit.json` | `EVAL_RECORDED{phase:"committed"}` |
| B7 | **JOIN** | `evalkit.mjs join . R<n>`: refuses if `evals/` changed; de-blinds; audits each `ARM_RESULT.json` (evidence points); simplicity from LOC median; totals | `evaluation.json`, `audit/*.json` | `EVAL_RECORDED{phase:"joined"}` |
| B8 | **SELECT** | `select.mjs evaluation.json --manifest round-manifest.json` twice; identical bytes | `selection.json` | `GATE SELECTION_APPLIED`, `SELECTION_RECORDED{input_sha256,decisions}` |
| B9 | **ASSIMILATE** | Track A master phase, then Track B (`templates/MASTER_PROMPT.md`); each records the other track's tree hash before and re-checks it after | `track-x/main@track-x-R<n>`, `PROVENANCE.md`, `learnings.jsonl`, `NEXT_VARIANTS.md` | `PHASE{role:"master"}`, `ASSIMILATED{track,tag}`, `LEARNING_RECORDED`, `GATE TRACK_MAIN_GREEN` |
| B10 | **CONSOLIDATE** | Copy `pack/team/tools` (minus `consult.mjs`) + `schemas` → `consolidated/`; run `team.test.mjs` + `e2e.test.mjs` there | `consolidated/` + test output | `CONSOLIDATED` |
| B11 | **INGEST** | Cockpit ingests the workspace; its chain verdict/head must equal `ledger.mjs verify` (K8) | `cockpit/e2e-R<n>.txt` | `GATE COCKPIT_INGEST` |
| B12 | **CHECK + CLOSE** | `NEXT_ROUND_PLAN.md`; `round.mjs check . R<n>`; closure report embeds `reports/R<n>-firstscreen.md` verbatim; `round.mjs check … --closure reports/R<n>-closure.md` | closure report | `ROUND_CLOSED{status: allowed_status}` |

## Gates (a gate is a ledger `GATE` event with `status: PASSED | BLOCKED`)

| Gate | Passes when | Checked by |
|---|---|---|
| `CENSUS_OK` | every capability in `census.mjs` has a status; `derived` is present | agent + `census.mjs derive` |
| `MANIFEST_FROZEN` | schema-valid; labels equal the census derivation; acceptance and sealed-oracle hashes match; run order is the counterbalanced one; ledger verifies | `round.mjs freeze` (emits it) |
| `ARMS_SEALED` | `ISOLATION_CHECKED` exists and no oracle has been unsealed; evidence tree hashed | `round.mjs seal-arms` (emits it) |
| `PROBES_COMMITTED` | probe files hashed before staging exists | `evalkit.mjs commit-probes` (emits it) |
| `ISOLATION_CLEAN` | report `ok` (otherwise tainted arms are excluded, the round continues) | `isolation.mjs report` |
| `SELECTION_APPLIED` | `select.mjs --manifest` reproduces `selection.json` byte-for-byte | agent `cmp`; `round.mjs check` re-verifies |
| `TRACK_MAIN_GREEN` | each track main passes the accumulated frozen suite | master phases |
| `COCKPIT_INGEST` | ingest count = ledger count; chain verdict and head agree with `ledger.mjs verify` | Cockpit K7/K8 |
| `LEDGER_VERIFIED` | `ledger.mjs verify` exit 0 (read-only since v0.2) | `round.mjs check` |

`round.mjs check` also reports **integrity findings**: `MANIFEST_CHANGED_AFTER_FREEZE`, `EVIDENCE_CHANGED_AFTER_ARMS_SEALED`, `SELECTION_NOT_REPRODUCED`, `PACK_MODIFIED`, `CLOSURE_REPORT_FIRST_SCREEN_MISSING_OR_EDITED`, and every ledger **lint** violation (`EVENT_BEFORE_OPEN`, `ARM_BEFORE_FREEZE`, `FINISH_WITHOUT_START`, `VERIFY_BEFORE_ALL_FINISHED`, `UNSEAL_BEFORE_ARMS_SEALED`, `EVAL_BEFORE_VERIFY`, `SELECTION_BEFORE_EVAL`, `ASSIMILATION_BEFORE_SELECTION`, `MARGIN_CHANGED_AFTER_SCORING`, `CLOSED_INCOMPLETE`, `EVENT_AFTER_CLOSE`, `OVERLAPPING_ROUNDS`, duplicates). Any finding makes `allowed_status` = `ABORTED or FROZEN`.

## Budgets (defaults; stated in the manifest `budget`, never exceeded silently)

* **Arm budget:** tool calls and/or minutes, stated in each brief. Overrun → arm stopped, partial result collected, `INCIDENT{kind:"BUDGET"}`.
* **Evaluator budget:** same order as one arm. Most evaluation is now tool work (`evalkit`), so the evaluator's own budget goes to probes and the maintainability judgment.
* **Turn budget:** stop at a step boundary with enough reserve to print `round.mjs status .`. An unfinished turn is *not* a closed round: the next turn resumes from the ledger. `ROUND_CLOSED{status:"ABORTED"}` is for rounds that cannot continue or that the human stops.

## Stop / continue

After turn A the controller waits for `unseal C<k> <key>`; after turn B it waits for `continue`. Other accepted inputs: `status`, `rerun <component>`, `stop`, `margin <x>` (next round, before freeze), `decision: <text>` (recorded as `HUMAN_DECISION`). Anything else is answered, not acted on.

## Incidents (freeze rules)

| Kind | Trigger | Action |
|---|---|---|
| `SECRET` | scanner hit (the ledger refuses such bodies) | purge file, record sanitized INCIDENT, freeze round, ask human |
| `ISOLATION` | canary leak, seed/brief edit, outside or cross-arm write, oracle copy | taint arm(s) via `isolation-report.json`; continue; report |
| `LEDGER` | `ledger.mjs verify` fails | freeze everything, do not append, report first bad seq |
| `BUDGET` | arm or turn exceeds budget | stop arm, collect partial |
| `CLAIM` | LIVE_RUN/MEASURED without evidence, or a claim contradicted by evaluator-run output | evidence points 0 (`evalkit audit`), downgrade to `SPECULATION` in reports |
| `INDEPENDENCE` | evaluator saw identities/narratives before commit | mark round `UNBLINDED`, exclude its selection until rerun |
| `TOOL` | a pack tool refuses or fails | record its stderr; do not work around the refusal by hand |

## Round roadmap (default; changed only by `HUMAN_DECISION`)

| Round | Focus | Components | Oracle |
|---|---|---|---|
| **R0** | Spine and smoke test | C1 | `C1.oracle.sealed` (key withheld) |
| **R1** | Contract + journal | C3 (+ C1 only to extend an R0 tie) | `C3.oracle.sealed`; C1 oracle **burned** → public regression |
| **R2** | Execution | C2 | controller-authored, or a new sealed oracle supplied by the owner |
| **R3** | Change under pressure | C5, C7 | same; Track B may add E2-S if R1–R2 justify it |
| **R4** | Surface + Cockpit integration | C4 | same |
| **R5** | Maintenance + adversarial | C6, C8 | seeded bug and injection planted by the controller in **copies** of each main |
| **R6** | Freeze and compare | all | no new arms; `FINAL-COMPARISON.md` under the pre-registered rule (`04_…` §7) |

**Burn rule.** Once unsealed, an oracle is no longer hidden. From the next round it joins the accumulated public regression suite, and it never again earns `oracle` points as a hidden test. Rounds without a sealed oracle must say `oracle_mode: CONTROLLER_AUTHORED` on page one (and under SIMULATED isolation those points measure little).

Component definitions: `05_TRACKS_AND_COMPONENTS.md`. Contracts: `team/contracts/`.
