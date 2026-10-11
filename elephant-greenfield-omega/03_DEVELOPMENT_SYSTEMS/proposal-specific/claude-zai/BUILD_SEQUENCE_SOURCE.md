# BUILD_SEQUENCE — shortest path 0 → E0 → E1 → E2 on Windows

**Status:** `DESIGN`. Estimates are working-day ranges for one engineer plus AI workers; they are guesses, not measurements. Every "verify" step must produce a saved artifact.

## 0. Smallest demonstrator that is useful even if E2 (or E1) loses

**`ecp capsule` + `ecp verify-citations` + the epoch guard.** A command that builds a deterministic, secret-scanned, commit-anchored context pack for any domain, and a command that checks any AI's file/line/quote claims against a commit. Both help ordinary E0 workers on any project; both already exist as library code in `kernel/capsule.mjs`. If the Elephant hypothesis dies, this is what survives.

## 1. Stages and gates

| Stage | Work | Est. | Exit / gate | Verification artifact |
|---|---|---|---|---|
| **S0 Census** | Read-only machine census (§3); owner decisions (§4) | 0.5 d | inventory saved | `G0-machine-census.json` |
| **S1 Switchboard CLI** | Wrap `kernel/` as `ecp` CLI with file-queue transport; `init/consult/status/node/lease/accept/cancel`; add F33/F35/F36 tests; run full suite on Windows | 1–2 d | kernel suite green **on Windows** | test log `node --test outputs\claude\kernel\kernel.test.mjs` |
| **S2 Seed + task bank** | Seed repo: `product/` (core/exec/ui stubs), `ecp/manifests/*.json`, `ecp/contracts.json`, acceptance tests for T1, executable task cards + seeded-defect oracles (graders only); pin `GREENFIELD_BASE_SHA`; clone `arms/e0..e2` with separate `.git`, caches, journals | 1–2 d | **G0** | `G0-task-bank.json`, seed SHA, clone hashes |
| **S3 E0 build** | Workers do T1–T4 in arm e0 via worktrees; consults go through switchboard (always fallback) for intent logging | 2–4 d | **G1**: ≥ 1 accepted slice with evidence bundle | `G1-e0-report.md` |
| **S4 First real adapter** | One harness, PREFIX mode: probe capabilities, read-only verification (WRITING_AND_TRUTH §6), capsule boot, calibration suite (generated from seed), one real REVIEW with verified citations; residency nonce; cancel behaviour; usage capture | 1–2 d | adapter `ADAPTER_VERIFIED` | adapter matrix row + journal excerpt |
| **S5 E1** | Arm e1 runs T1–T8 with E1-S; rebuild on epochs; drills 1–8 (FLUSH_RECOVERY §11); optional E1-P on a second clone if the harness supports verified resume | 2–4 d | **G2** | `G2-e1-report.md` |
| **S6 E2** | Second node (different harness or same harness, separate session/handle); concurrent consults; disagreement records; mixed epochs; crash/degrade drills | 1–2 d | **G3** | `G3-e2-report.md` |
| **S7 Compare** | Blind grading; scorecard; decision rules (EXPERIMENT §7) | 1–2 d | **G4** | `G4-blind-scorecard.csv`, `G4-decision.md` |

**Total:** ~10–19 working days for the pilot. The Tauri UI (T3) is in S3; if Tauri tooling is unavailable, T3 is recorded `UI_BLOCKED` and the core is proven via CLI, per the product brief.

**Stop points:** after S1 if the kernel fails on Windows; after S4 if no harness passes read-only verification (stop at `MOCK_TESTED`, report blockers); after S5 if E1-S ≤ B on every pilot metric (skip E2, keep §0 demonstrator).

## 2. Exact command verification points (PowerShell 7)

```powershell
git --version                         # record; ≥ 2.40 expected (unverified requirement)
node --version                        # ≥ v20
node --test .\outputs\claude\kernel\kernel.test.mjs      # expect "# pass 32" "# fail 0"
node .\outputs\claude\kernel\demo.mjs                    # regenerates traces; diff against committed traces
git -C arms\e1 rev-parse HEAD         # equals GREENFIELD_BASE_SHA before S5
git -C arms\e1 worktree list          # before and after each task
git -C arms\e1 status --porcelain     # empty before integration
```
Trace determinism check: the six `traces/*.trace.txt` must regenerate byte-identically (fixed clock, RNG and Git dates). A difference means the kernel's behaviour changed.

## 3. Windows / CLI feasibility audit

Nothing below has been verified on the target machine. The census records each cell as `verified`, `unsupported`, or `unknown` with the evidence file.

| Capability needed | Why | How to verify safely |
|---|---|---|
| Non-interactive single prompt with JSON output | adapter `consult` | run `--help`, then one prompt on a toy dir with no source |
| Session id returned + resume by id | E1-P, residency nonce test | open, ask nonce, exit, resume, ask nonce without re-injection |
| Fork | FORK mode | only if documented; otherwise `unsupported` |
| Tool denial / read-only mode | Elephant admission | request a write; confirm denial + `git status` clean |
| Cancel | `remote_stop` | start long prompt, send cancel, observe process/API |
| Usage / token metrics | cost model | compare reported usage on two prompts of known size |
| Model identity per call | L3 drift detection | output metadata |
| Context window disclosure | budget | docs + empirical "repeat nonce at position X" |

Harness notes (from general knowledge as of mid-2026 — **treat every item as UNVERIFIED until the census confirms it**): Claude Code is believed to offer a print/headless mode with JSON output, session resume by id, and permission modes that restrict tools; Codex CLI is believed to offer a non-interactive exec mode and sandbox settings; OpenCode is believed to offer a non-interactive run mode with session selection; ZCode and Grok CLI capabilities are unknown. **No flags are written here on purpose.**

Census script outline (to write in S0; must not read auth/config directories):
```powershell
$tools = 'git','node','claude','codex','opencode','zcode','grok'
$out = foreach ($t in $tools) {
  $c = Get-Command $t -ErrorAction SilentlyContinue
  [pscustomobject]@{ tool=$t; path=$c.Source; version=$(if ($c) { (& $t --version 2>&1 | Select-Object -First 1) } else { $null }) }
}
$out | ConvertTo-Json | Set-Content .\reports\G0-machine-census.json
# then, per tool present:  & $t --help > .\reports\help\$t.txt   (help text only)
```

## 4. Owner decisions required (blocking)

| Before | Decision |
|---|---|
| S2 | Seed contents; contract registry ids; whether stage 3 (larger codebase) is in scope |
| S4 | Which provider may receive which source; which harness hosts Elephants; read-only mechanism accepted |
| S5 | Regime P allowed? allowlists; `scope_protected` exceptions; worker concurrency; token/$ caps; reviewer identities |
| S6 | Second node harness/provider; max queue per node; `epoch_policy=same` required for T5? |
| S7 | Grader identity; pre-registration frozen |

## 5. Repository layout (proposal)

```
greenfield-omega/
  seed/                      read-only baseline repo
  arms/e0|e1|e2/             independent clones: product/, ecp/manifests, ecp/contracts.json
  arms/*/ecp/{inbox,outbox,escrow,journal.jsonl}   gitignored, local
  worktrees/<arm>/<task>-<worker>/
  experiment/                this pack (read-only during trials)
  reports/                   sanitized evidence, census, scorecards
  local/                     capsules, raw transcripts (retention-limited)
```
