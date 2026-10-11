# Windows-first startup runbook — zero destructive commands

## Step A: preparation and inspection

Use PowerShell 7 on Windows. Open in an EMPTY new folder distinct from VOMEGA. Extract this pack to a project folder (e.g. `C:\dev\greenfield-omega-elephants`). Do not place credentials in the folder. Run `git --version`, `node --version`, `Get-Command opencode,zcode,claude,codex,grok -ErrorAction SilentlyContinue | Select-Object Name,Source` and read supported CLI help; do not dump auth config. This pack assumes no specific provider flag works until verified on your machine.

Read `README.md`, `00_LAUNCH_PROMPTS.md`, charter, product and protocol. Run simulation:

```powershell
node --test .\tools\ecp\ecp.test.mjs
node .\tools\ecp\ecp.mjs demo
```

Simulation does not call an LLM, create product code or modify the existing repository.

## Step B: controlled source roots

Create ONE clean Git seed repo for new product; pin `GREENFIELD_BASE_SHA`. Replicate to **three arm repos** with independent `.git`, `node_modules`, caches and memory stores. Avoid global tool state spilling across arms. In each arm keep one linear `main`, plus disposable worktrees for bounded worker tasks. For fair trials use seed commits and frozen task cards; do not copy solution patches between arms.

Recommended layout:

```
greenfield-omega/
  seed/                # read-only baseline
  arms/e0/             # one arm main + disposable worktrees
  arms/e1/
  arms/e2/
  experiment/          # this pack; prompts, schemas, harness
  local/               # machine-only session state, ignored
  reports/             # sanitized evidence; avoid secrets
```

`git worktree add -b task/T1 ..\worktrees\T1 <base-sha>` is an **illustrative standard Git pattern**; use a branch name valid in the arm repo and verify Git worktree list before use. Do not run force cleanup. See official Git worktree documentation in `reference/SOURCES.md`.

## Step C: independent design round-robin

Create five isolated sessions. Paste each specialized `prompts/*.md` (read `00_LAUNCH_PROMPTS.md`). Request first submissions in separate output folders; no one alters the seed baseline or sees other model first-pass ideas. Run judge after all five first submissions are captured.

## Step D: E0 (actual build)

Use one or more workers, assigned task-isolated worktrees. Require one accepted product slice with tests and source-grounded review. Save per-task times, tokens, worktree/commit IDs, results and failure artifacts. Use no Elephant context or output.

## Step E: E1

1. Verify a **real** provider session resume behavior in a safe read-only probe; capture available API/CLI and model facts.
2. Build a deterministic domain pack from an accepted repo commit and manifest with hard exclusions; hash and calibrate.
3. Start one Elephant in isolated read-only environment; request `STATUS/ASK/REVIEW`; correlate the response and epoch. Require real persisted session handle evidence; fallback if unsupported.
4. Have worker implement same next-class task, consult when relevant, run tests, submit for independent review, integrate accepted commit.
5. Reconcile or rebuild Elephant and run stale-case/flush drills. Log load and refresh costs.

## Step F: E2

Launch two separately identified, truly concurrent domain sessions. Test simultaneous bounded consults, shared-contract change, split epoch, contradictory claims, timeout of B while A responds, and healthy fallback to E1/E0. After verified merge, reconcile each affected node independently. Do not count as true E2 if requests are merely serialized into one model context.

## Step G: cleanup and report

Stop sessions gracefully and record uncertain requests. Preview local candidate caches for cleanup; do not delete source, accepted evidence, or provider credentials. Leave immutable first-pass model outputs and a concise G4 decision describing winner, loses, reasons, uncertainty, and source/commit evidence.

## Warning labels

`DESIGN_ONLY`: concept not tested; `MOCK_VERIFIED`: deterministic simulation only; `ADAPTER_VERIFIED`: actual session transport tested; `PRODUCT_ACCEPTED`: behavior + tests + independent review; `MEASURED_GAIN`: controlled multi-run evidence and uncertainty. These statuses cannot be substituted for each other.
