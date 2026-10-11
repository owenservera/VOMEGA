# ARMS AND ISOLATION (v0.2)

## 1. Workspace and arm layout

```
omega-lab/
  pack/                         READ-ONLY copy of this pack (tree hash recorded at R0 ROUND_OPENED; re-checked at close)
  fixtures/                     make-sample.mjs output (sample rounds, K2–K4 variants, conformance vectors)
  ledger/ledger.jsonl           hash-chained team ledger
  rounds/R<n>/
    round-manifest.json  CENSUS.json  census/  isolation-report.json  evaluation.json  selection.json  NEXT_ROUND_PLAN.md
    seed/                       read-only product root for this round (Git; R1+: previous track-main tag per track)
    controller/                 OFF LIMITS to arms: canaries.json, .canary, fence.snapshot.json, fence.steps.jsonl,
                                probes/, eval-staging/, blind-map.json, oracle-unsealed/
    evals/  audit/              evaluator outputs (written in turn B)
    arms/R<n>-A1/ …             one directory per arm:
      BRIEF.md                  written by the controller BEFORE plant/snapshot; arms must not edit it
      .canary                   planted by isolation.mjs; never read, copy or edit
      product/                  the arm's product tree (seed copy + its work). The ONLY part the evaluator grades
      out/                      raw captured command output referenced by ARM_RESULT.json (redacted copy is graded)
      process/                  Track B only: consults.jsonl (consult.mjs). Stripped from evaluator staging
      WRITES.json               {"files":[…paths relative to the arm dir, no globs…]}
      ARM_RESULT.json           schema: team/schemas/arm-result.schema.json (paths relative to the arm dir)
  evidence/R<n>/<arm>/          controller's COPY after the arm finishes (sealed at GATE ARMS_SEALED)
  track-a/ track-b/             main/ (Git, tagged track-x-R<n>), learnings.jsonl, LEARNINGS.md
  consolidated/  cockpit/  reports/
```

## 2. Arm rules (pasted into every brief)

1. Write only inside your own arm directory. Declare every created or changed file in `WRITES.json`. `ARM_RESULT.json` and `WRITES.json` themselves need no declaration; `product/.git` is not hashed.
2. Do not open `seed/` for writing, `controller/`, other arms, other rounds, or `pack/team/oracle/`. If your tools make that impossible to avoid, say so in `limitations` instead of doing it.
3. Never read, copy, print or transform `.canary`. Never edit `BRIEF.md`.
4. Capture the raw output of every command you cite into `out/` and reference it by its arm-relative path. A pasted summary is not evidence.
5. Claims use claim levels. `LIVE_RUN` needs a raw output file; `MEASURED` needs a script and its output. A claim that the evaluator's run contradicts zeroes your evidence points.
6. State what you could not do. An empty `limitations` list costs evidence points.
7. Do not grade yourself, compare yourself to other arms, or mention other arms or tracks in `product/`.
8. Stop at your budget. Partial honest work beats finished-looking guesses.
9. Track B only: consult machinery and logs live in `process/`. `product/` must not import or mention it, which keeps the evaluator track-blind.

## 3. Isolation strength — derived, never asserted

`census.mjs derive` computes the labels from evidence files by fixed rules, and `round.mjs freeze` refuses a manifest that disagrees:

| Level | Rule (all inputs need an existing evidence file) | What the report may claim |
|---|---|---|
| `PROCESS_SEPARATED` | `subagents` + `subagent_separate_context` (nonce test) + `cross_read_denied` (attempted from inside a sub-agent) | "Isolation enforced by environment" |
| `SHARED_FS_HONOR_SYSTEM` | `subagents` + `subagent_separate_context`, but sibling reads succeed | "Isolation by instruction, verified only by canaries and fences; absence of findings is weak evidence" |
| `SIMULATED` | anything less | "Sequential role-play; scores measure the approach prompts, not independent runs" |

Further derived labels: `independence` (FULL only with a verified `evaluator_fresh_context`), `arms_execution` (parallel only with verified overlap), `track_b_adapter` (LIVE / SUB-AGENT / SCRIPTED), `selection_basis` (`mechanical` unless independence is FULL), and the page-one verdict `MEASURED-CAPABLE` vs `PROCESS REHEARSAL`.

**Run order under sequential execution.** In a single context, later arms inherit what earlier arms did. `round.mjs order` assigns a Williams-design order per round: arms are interleaved by track, and over four rounds each arm goes first once and each ordered pair occurs once. That evens out first-order carry-over across the programme instead of always favouring the same slot. The manifest must carry this order.

## 4. Independence of evaluator and masters

* The evaluator receives only: the frozen manifest and contract, the acceptance tests, the unsealed oracle (turn B), the committed probes, and `controller/eval-staging/<blind_id>/` (`product/` + redacted `out/`). It must not open `controller/blind-map.json`, `evidence/`, or any `ARM_RESULT.json` before `evalkit commit`.
* With `independence: DEGRADED` (same agent), the evaluator runs in a `PHASE{role:"evaluator"}` with a written reset. Selection then uses `score_mechanical` only (acceptance + oracle + simplicity + evidence audit), so the judgment-based criteria cannot decide a winner.
* Track masters assimilate in separate `PHASE{role:"master"}` events. Each records the other track's tree hash at the start and re-checks it at the end (a write fence; reads remain invisible).

## 5. Canary, fence and oracle-copy protocol (what the tools do)

1. **Provision → plant → snapshot.** `fence … snapshot` refuses an arm without `BRIEF.md` and `.canary`. (v0.1 snapshotted before the briefs were written, so every arm came out tainted.)
2. `plant` writes `CANARY-<arm>-<24 hex>` per arm, plus a controller canary in `controller/.canary`, and the map in `controller/canaries.json`.
3. `scan` greps every arm tree for other arms' tokens **and their bare 24-hex secret**. It flags tampered own canaries and any symlink.
4. `fence snapshot` / `step <arm>` / `check` hash the **whole round directory** (v0.1 hashed only seed, controller and arms, so stray files in the round root were invisible), and record seed Git `HEAD` and `status`. Findings:
   * `SEED_MODIFIED`, `SEED_GIT_CHANGED`, `OUTSIDE_ARMS`, `BRIEF_MODIFIED`: definite escapes;
   * `CROSS_ARM_WRITE` (step mode): attributed to the arm that just ran, with the victim named;
   * `unattributed`: an undeclared change inside an arm;
   * `writes_problems`: globs, absolute paths or traversal in `WRITES.json`.
   In `step` mode every finding is attributed to the arm whose window it fell in. In a single window, an unattributable escape taints every arm (fail closed).
5. `report` merges scan and fence (and, in turn B, `--oracle <dir>`: any arm file containing an `ORACLE-MARKER-…` string from the unsealed oracle) into `isolation-report.json`, with per-arm `isolation_ok`. `evalkit join` takes `isolation_ok` from this file only.

**Known blind spots** (printed in every report):

| Blind spot | Consequence |
|---|---|
| A read that leaves no copy is invisible | Canaries catch careless copies only |
| Writes outside the round dir are not fenced by `isolation.mjs` | `evidence/`, `track-*/` and `pack/` are covered instead by `ARMS_SEALED`, the master tree-hash checks and `PACK_MODIFIED` |
| Any process can read `controller/` | Under SHARED_FS/SIMULATED this is honour-system |
| Hard links and transformed copies of canaries | Not detected |
| `node_modules/` and `.git/` inside arms | Not hashed (seed Git is checked via HEAD + status) |
| Parallel runs | Escapes outside arm dirs cannot be attributed and taint every arm |

## 6. Track B arms: how consults are made

Track B arms use `pack/team/tools/consult.mjs`, a thin harness over the ECP v0.2 kernel. Consults go into a hash-chained journal (`process/consults.jsonl`), and every anchored citation `{path,start_line,end_line,quote}` is verified by the kernel's `verifyFinding` against the arm's product **commit**:

```
consult.mjs init <arm>                         # product/ becomes a Git repo (baseline commit)
consult.mjs commit <arm> "<msg>"               # citations are verified at a commit, never a working tree
consult.mjs log <arm> '{"regime":"plan-review","kind":"REVIEW","adapter":"SCRIPTED","question":"…","findings":[…]}'
consult.mjs outcome <arm> F1 acted|false_positive|ignored "<note>"   # records whether the anchored files moved (stale_at_use)
consult.mjs stats <arm>                        # paste into ARM_RESULT.ecp_usage
```

| Adapter | When (census-derived) | What results may claim |
|---|---|---|
| `LIVE` | a separate model session proven reachable from the environment | `LIVE_RUN` (still advisory; citations kernel-verified) |
| `SUB-AGENT` | sub-agents with a passed nonce test | `LIVE_RUN` for the consult mechanics; cognitive findings advisory |
| `SCRIPTED` | otherwise; the arm writes the "consultant's" answer itself | `SIMULATED`, protocol mechanics and overhead only. **The first screen says "Track B cognitive hypothesis UNTESTED".** Any cognitive-value claim is downgraded |

## 7. Failure handling inside a round

| Event | Controller action |
|---|---|
| Arm never starts | `ARM_FINISHED{status:"NOT_RUN"}`; component loses that entrant |
| `ARM_STARTED` without `ARM_FINISHED` on recovery | `round.mjs status` lists it under `unknown_terminal`; emit `ARM_FINISHED{status:"UNKNOWN"}`. Never assume it finished |
| Arm produced no `ARM_RESULT.json` | Evaluator scores from files; evidence points 0 (`NO_SELF_REPORT`) |
| Arm modified seed / brief / another arm | Taint the responsible arm via the report; restore the seed from Git; INCIDENT |
| Both arms of a track fail a component | `NO_ELIGIBLE`; the component re-runs next round with a different variant brief |
| Platform loses state between turns | `round.mjs status .` reconstructs the position from the ledger; anything not in the ledger, `rounds/`, `evidence/` or `track-*/` did not happen |
