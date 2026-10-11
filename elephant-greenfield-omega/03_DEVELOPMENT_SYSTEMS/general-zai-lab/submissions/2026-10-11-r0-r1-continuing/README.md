# General Z.ai Lab — Round 0 Closure and Round 1 Continuation (2026-10-11)

**Status:** Uploaded workspace inspected; custody metadata committed. **Full source/evidence payload is not yet in this GitHub folder.**

## Origin
- Uploaded archive: `workspace-e0619ab6-376d-450b-b064-1c2ab07ac6d0.tar`
- SHA-256: `552e63785ffbe9e1cca11d2a8fa39dfde0778f655b0b2f98034527eee53fcd05`.
- Workspace HEAD: `d15e6737dab5f752d6460f9bf9ffe9b3b1f9055e` (independent hosted workspace).
- Frozen mini-product seed: `c7fc6c262ae62a0afa126bc72303957962edbb28`.

## Submitted Round 0 evidence
- `lab/evidence/round-0-manifest.json`: preregistration and four real child arms.
- `lab/arms/R0-A1/`: isolation launcher, worktree/canary checks; submitted evaluator result 19/19.
- `lab/arms/R0-A2/`: per-model call telemetry, budgets and rollups; evaluator result 12/12.
- `lab/arms/R0-B1/`: deterministic epoch/flush and real session-boundary checks; evaluator result 10/10.
- `lab/arms/R0-B2/`: persisted mini-cockpit, restart and browser evidence; evaluator result 8/8.
- `lab/evidence/evaluation-round-0.md`: independent evaluator reports all four suites rerun.
- `lab/evidence/round-0-closure.md`: submitted controller closure; concurrency and isolation qualifiers.
- `download/ROUND-0-CLOSURE-REPORT.md`: operator-facing report.

## Continuing content also present
- `lab/arms/R1-A1`, `R1-A2`, `R1-B1`, `R1-B2`, `R1-C1`, `R1-C2`: follow-on experimental rounds.
- `lab/masters/`: independent Master A/B assimilation and next-round plans.
- `lab/trackC/`: lagged challenger methodology and experiments.
- `lab/portfolio/`: capability-pack portfolio and requirements.

Claims above are preserved as submissions, not promoted into verified VOMEGA source. The original tar includes full hosted-app material, nested Git data, `.env`, runtime DBs and duplicate workspaces; a complete sanitized import should stage experiment files rather than overwrite VOMEGA product files.
