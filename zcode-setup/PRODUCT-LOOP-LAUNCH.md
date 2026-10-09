# ZCode launch — ten-team product loop (2026-10-09)

Authoritative scope and team ownership: `../.project/staff/PRODUCT-LOOP.md`.
DESK transport contract: `../.project/staff/DESK/README.md`.
Existing ZCode specifics: `TEAM-AND-COMMS.md` and `ROUTING-AND-SETUP.md`. **No new orchestrator, workflow runner or PM.**

## Reality first

The reviewed repo head is `c74cf5b` (2026-10-09). It documents five original sessions (CoS + DEV, DEVops, PM, COUNCIL). It does not prove that any new team is running, that ten distinct models are available, or that local `main` is clean. Check `git status`, remote HEAD, `CronList` **inside each actual ZCode thread**, and current Ratchet probe. The old shared ten-minute governor is historical; the current configuration uses one heartbeat automation per ZCode team thread with event-driven DESK watchers. Never recreate or double-schedule the deleted governor.

**Existing team keys / threads:** `devdrain`, `devops`, `pm`, `council`. The Chief of Staff is the sole dispatcher for all DESK inboxes.
**New lane keys:** `execution`, `semantic`, `visual`, `sim-a`, `sim-b`, `evidence`, `provider-lab`, `windows`. These are eight new logical missions, not automatically enabled sessions.

## Bootstrap (idempotent, no scheduler or config changes)

From the primary VOMEGA checkout, first preview:

```powershell
node zcode-setup/init-product-loop.mjs
```

If the dry run is acceptable, initialize **only missing** per-team DESK inbox/replies/status files:

```powershell
node zcode-setup/init-product-loop.mjs --apply
```

This uses `zcode-setup/product-loop-lanes.json` (a **routing roster**, not task/PM status). It does not edit existing messages, rewrite ZCode configuration, start automations, touch credentials, or create branches. Stage new files explicitly when needed, not `git add -A`. Note: the existing `status/board.jsonl` is a legacy multiwriter feed; new teams instead append to `status/<team>.jsonl` and the CoS reads/combines both. Do not rewrite the shared file while legacy threads are live.

For each new lane, open a separate ZCode thread with this repository as its workspace and provide the appropriate lane key and mission from the roster. **Set the model in ZCode's actual thread model picker** if required; putting a model name in a prompt does not select it. One thread → at most one existing-style recurring heartbeat, with a bounded DESK inbox poll; verify `CronList` before creating anything. Watchers are opportunistic, heartbeat is fallback; verify that both actually dispatch, because previous watchers failed to re-arm.

## Paste into the existing Chief of Staff thread

> OWNER DIRECTIVE — VOMEGA PRODUCT LOOP. Read `.project/staff/PRODUCT-LOOP.md`, `zcode-setup/PRODUCT-LOOP-LAUNCH.md`, and the current DESK README. Keep the existing CoS, DEV, DEVops, PM, COUNCIL and Ratchet; do not duplicate the old governor. Inspect local git, ZCode automations, pending inbox/replies, disk capacity, model availability, Ratchet raw frontier and active claims. Delegate lane bootstrapping to DEVops. Start new lanes `semantic`, `visual`, `sim-a`, `sim-b` first; continue DEV and DEVops. Only start `execution`, `evidence`, `windows`, `provider-lab` after isolated write/test surfaces and real throughput are verified. Assign the first bounded task named in PRODUCT-LOOP; ask every new team for one actual, evidence-backed result. CoS never edits product code. Prioritize D1 `034/020/063` and an executable synthetic interaction; do not initiate live Provider actions or alter owner auth/model configuration. Publish measured readiness, not assumed liveness.

## Paste into *each* new team thread (substitute its lane key)

> You are VOMEGA lane `<lane-key>`, a dedicated recurring **bounded product mission**, not a new project authority. Read `AGENTS.md`, `.project/staff/PRODUCT-LOOP.md`, `.project/staff/DESK/README.md`, `zcode-setup/product-loop-lanes.json` (your own entry), and any task-specific Ratchet packet. Your only cross-thread channel is DESK: read `inbox/<lane-key>.jsonl` one line at a time, act once per directive id, reply exactly once in `replies/<lane-key>.jsonl`, and append start/final/blocked events to `status/<lane-key>.jsonl`. Be honest about limitations. First inspect your active ZCode automation; retain only one heartbeat in this thread. Never overwrite/reorder/truncate shared logs, edit another team's inbox, change credentials or configure provider models. Run one bounded falsifier/experiment at a time, and produce evidence rather than prose. Code edits require a Ratchet ownership decision from DEV/CoS and an isolated short-lived worktree. No second tracker, no historic-journey migration, no false live proof. If the product surface is unavailable, exercise the actual D1 reducer/projection or report blocked truthfully. Begin with the first-work item for your lane and respond with pinned HEAD, result, evidence and next blocker.

## First dispatches and handoffs

| To | Real, bounded first action |
|---|---|
| `devdrain` | Re-probe D1, claim `D1-034` or `D1-020` (highest eligible disjoint packet), make reviewed code progress |
| `execution` | Probe `D1-063` preconditions, especially the prior consent→READY problem; implement virtual execution only if dependency resolved/claim granted |
| `semantic` | Inspect one current unresolved-language UX problem and the smallest useful legacy test/method reference; propose a discriminating D1 experiment |
| `visual` | Show the unresolved text span and a grounded correction via existing Projection/Actions, baseline vs a UI-only alternative; no new parser |
| `sim-a` | Run initial matched control tasks on current D1 semantic API, pin World/build, record real observations |
| `sim-b` | Run same scenarios with alternate treatment where renderable, otherwise publish treatment-not-runnable; separate observer and cross-over design |
| `evidence` | Reproduce a user-simulation finding using existing `session.run`, then serve replay/MP-55/56 when actual need arises |
| `provider-lab` | Produce synthetic Provider/Account freshness and switch conformance matrix; no unauthorised live browser action |
| `windows` | Inspect `D1-082` prerequisites and make smallest executable twin integration plan/prototype in a claimed surface; don't build a parallel app |
| `devops` | Verify disk, multi-worktree isolation, DESK append routing, ZCode heartbeat liveness, secrets hygiene and safe scoped commits |

**Pilot success:** at least one accepted red→green D1 gate **and** one genuinely reproducible synthetic user finding evaluated on both baseline and candidate/blocked treatment, with an independent follow-up. If there is no executable treatment, state `NOT-RUNNABLE` and unblock `D1-082` rather than invent results. Do not flood DEV with ten near-duplicate reports.

## Integration discipline

The DESK primary checkout is shared. CoS writes inboxes only; every team writes its own replies/status. Product code authors use **short-lived disjoint worktrees** and a DEV-allocated packet. One integration owner serializes Ratchet lock/claim/projection mutations; independent reviewer does not write the implementation. Stage precise paths; no `git add -A`, stash, reset, clean or force push over another lane's work.

Push is delegated through the existing CoS → DEVops readiness path with current-head and secret checks. New work may not silently update the five owner-selected PM programs or the mission. The new lanes may be scaled down when the machine, account limits or verified task supply makes parallelism counterproductive.
