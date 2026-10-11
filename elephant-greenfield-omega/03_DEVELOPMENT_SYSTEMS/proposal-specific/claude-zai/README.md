# Claude-Specific Z.ai Development Program (Submitted v0.2)

**Status: imported executable process prototype; independent Claude-specific Z.ai session NOT launched or verified.** This directory is a development system, not the architecture itself. See `../../../../02_ARCHITECTURE_PROPOSALS/claude/` for Claude's ECP v0.2 cognitive architecture. See `ASSESSMENT_AND_MIGRATION.md` for transfer-worthy practices, defects and required adaptation to the current project organization.

## Preserved source

`runtime/pack/team/` is the original v0.2 two-track program, including event journal, round controller, census, isolation guards, blind evaluation, selection, acceptance tests, sealed holdouts, schemas, and synthetic fixtures. `runtime/pack/outputs/claude/` is an **execution-compatibility dependency** for the team's `consult.mjs` and other scripts, not an additional architecture proposal. Original author source paths are preserved inside this isolated runtime mirror so imported tests can be run without rewriting the submission. `runtime/pack/ZAI_FIRST_PROMPT.txt` and `runtime/pack/TEAM_START_HERE.md` are the original operational launch artifacts; they MUST be read under the revised `LIVE_BOOTSTRAP_OVERLAY.md` and common every-turn publication rule. No Z.ai app/session is claimed to be running.

## Verify locally (only inside a dedicated disposable experiment workspace)

From `runtime/pack/`, with Node 20+ and Git available:

- `node --test outputs/claude/kernel/kernel.test.mjs` (32 simulated architecture tests in the original upload)
- `node --test team/tools/team.test.mjs team/tools/e2e.test.mjs` (29 process tests; synthetic CLI round)

Local unpacked-upload verification on Linux, Node 22.16.0: 32/32 and 29/29 passed. **Not a live-Z.ai run.** The original `outputs/claude/MANIFEST.json` has an unmatched `kernel/journal.mjs` hash. `team/TEAM-MANIFEST.json` matched 146 entries, but it is still not a claim of independent child execution. The user-provided ZIP did NOT include owner-only AES-GCM oracle keys, so the original human `unseal C1 <key>` step is blocked until a legitimate owner supplies keys or an independent evaluator provides a separate sealed holdout.

## Adapt, don't blindly run the old instructions

1. Before the original R0 command protocol, freeze the updated shared baseline and **Claude's one proposal version**. Keep this dedicated session independent from existing general Z.ai A/B/C Round 1.
2. Probe real Z.ai subagent/runtime capabilities. Four scripted example arms or a process rehearsal do not satisfy the real isolated context and fan-out requirement.
3. Add a **complete capability-pack publication after each top-level turn**, including original Turn A before oracle unsealing, Turn B, stop/block turns, and every later bounded turn. Keep ALL pack states and prior immutable versions; publication is separate from independent grading.
4. Treat fixed C1–C8 labels as **benchmark fixture IDs**, never as the required final Elephant capability inventory.
5. Retain Claude's capsule-first/stateless ECP thesis as the main architectural anchor, test genuine competing variants and explicit deviations. C within the general lab is a different experimental program; do not relabel Claude's two internal arms as general A/B/C.
6. Apply real model token accounting (or UNKNOWN), hidden evaluator custody, OS-level write permissions, source-epoch guards, honest cancellation/restart, and cross-platform operational tests before calling the program production-ready.
7. Export the current pack portfolio after each turn using the common `01_EXPECTED_OUTPUTS` contract, not just the previous nine Round B closure deliverables.

**Launch:** see `LIVE_BOOTSTRAP_OVERLAY.md` and the architecture-independent shared launcher `../SESSION_BOOTSTRAP_TEMPLATE.md`. No real runner has been started by this import.
