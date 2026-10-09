# VOMEGA team and communications setup

Written 2026-10-07. This is a record of how the team and comms were actually set up in ZCode, including the limits we hit. It is not a claim that every piece is finished or verified.

**2026-10-09 extension:** the ten-team operating allocation is in [PRODUCT-LOOP](../.project/staff/PRODUCT-LOOP.md), with [new-lane ZCode setup](PRODUCT-LOOP-LAUNCH.md) and a [machine-readable routing roster](product-loop-lanes.json). This is a historical record of the original working threads, not a live-status source for additional teams. Existing DESK and one-automation-per-thread behavior remain unchanged.

Workspace: `C:\0-BlackBoxProject-0\VOMEGA`
At the time of writing: local `main` is `3113386`, **40 commits ahead** of `origin/main` (`7ce9e32`), 0 behind. A push of that backlog was authorized to DEVops; confirmation that it landed is not in this document.

## 1. Why this shape

ZCode cannot deliver a message into another conversation. That was checked against the installed client (`C:\Program Files\ZCode\resources\glm\zcode.cjs`) and the configuration guide. `RespondToCoordinator` only works from a subagent back to the session that spawned it. `ReadSessionContext` is read-only. Automations start a new run; they do not inject text into an existing owner-started thread. Hooks fire only on events inside a session that is already running (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, and so on). None of them wakes an idle thread because a file changed.

So the only durable channel between threads is **files in one shared checkout**.

## 2. Who is who

| Role | Where it lives | What it does |
| --- | --- | --- |
| Owen | the person | Direction, scope, priorities. Auth, spend, mission, invariants stay his. Veto on merge/push. |
| Chief of Staff | this ZCode thread | Routes Owen's directives down and team results up. Does not edit product code or docs. Owns merge/push **decisions** (delegated 2026-10-07) and must have the evidence before deciding. |
| DEV | its own thread | Builds D1, one Ratchet task at a time, red to green, then a separate reviewer. |
| DEVops | its own thread | Test baselines, regressions, environment, provider/model availability, release readiness, the desk files, and the local-state snapshot for the daily external review. Does not change product code or gates. |
| PM | its own thread | Keeps the PM projection of five owner-scoped programs (MP-21, MP-54, MP-55, MP-56, MP-60) in sync with measured truth. Never decides scope or priority. |
| COUNCIL | its own thread | Contested design questions. Rulings are recommendations, never authority. |

The chart is in `.project/staff/RACI.md` (commit `27100ef`). The charter is `.project/staff/CHIEF-OF-STAFF.md`. The merge delegation is recorded in that charter as section 9 (commit `d860997`).

Every thread must open at `C:\0-BlackBoxProject-0\VOMEGA`. There is a second worktree under `C:\Users\VIVIM.inc\orca\workspaces\VOMEGA\...` that is stale and must not be used.

## 3. The desk (the only cross-thread channel)

Directory: `.project/staff/DESK\`

| Path | Who writes it |
| --- | --- |
| `inbox\<team>.jsonl` | Chief of Staff only |
| `replies\<team>.jsonl` | That team only |
| `status\board.jsonl` | Any team, append-only |
| `README.md` | DEVops (the contract) |

Teams: `devdrain`, `devops`, `pm`, `council`.

One writer per inbox and per replies file, so the desk itself needs no lock. Append with `>>` only. Never rewrite a JSONL in place.

A directive is one JSON object per line:

- `id` — `D-YYYYMMDD-NNN` (line count of that inbox, plus 1)
- `ts`, `from` (`cos`), `to`, `priority` (`P1`/`P2`/`P3`)
- `deadline`, `reply_expected_by` — optional overdue alarms, **not schedules**. Teams ignore them for pacing (commit `5498fa5`).
- `subject`, `directive` (full text, never a pointer to a file the desk just edited)
- `evidence_required`, `supersedes`

A reply:

- `id` — `R-YYYYMMDD-NNN-k`
- `in-reply-to`, `ts`, `team`
- `status` — `DONE`, `BLOCKED`, `PARTIAL`, or `NACK`
- `result`, `evidence` (`path` + `observed`), `blockers`, `claim`, `commits`

A directive is done when its id appears as `in-reply-to` in that team's replies file. Do not process it again.

`NACK` means the directive is wrong, owner-reserved, or out of lane. The desk relays it; the team does not retry it.

Readers must parse JSONL **one line at a time** and skip lines that do not parse. This exists because directive `D-20261007-002` was written with unescaped quotes and is still sitting as a bad line in each inbox (append-only, so it stays). A later directive names the bad id in `supersedes`. The desk now builds every line with a JSON encoder and checks it parses before appending. Rule committed in `f92cbec`.

Status board: the instant a team reads a directive it appends `{team, ts, directive, phase, note, model?}`. `phase` is `start`, then `final` or `blocked`. That is the live picture of what each team is doing.

Never `git clean -fd` or `git stash` while team threads are live. These files are tracked project record, not scratch. They live under `.project\` on purpose, not under `.local\` (which is gitignored).

## 4. How fast messages move

Polling every 2–5 minutes was too slow. The faster path is a background shell in each thread:

- Loop every 3 seconds.
- Exit when the line count of the watched files changes, or after about 570 seconds.
- Run it with the Bash tool, `run_in_background: true`, timeout 600000 ms.
- A background command re-invokes the thread when it exits, so a new line wakes the thread within about 3 seconds.
- Waiting costs no model turns.
- On exit (`CHANGE` or `IDLE`): do the work, then start the watcher again before the turn ends.
- Only one watcher at a time.

Chief of Staff watches `replies\*.jsonl` and `status\board.jsonl`.
Each team watches its own `inbox\<team>.jsonl`.

The first watcher also watched the inboxes and woke on its own outgoing posts. Watch replies (or your own inbox) only.

Each thread also keeps **one** recurring automation as a heartbeat, because a background watcher dies if the app restarts:

| Thread | Automation | Cadence |
| --- | --- | --- |
| DEV | `automation-b1ca7c15-f333-44e7-bbbc-369485130454` | 2 min |
| DEVops | `automation-6a2b7413-a602-4427-89eb-a59bd5d2ed1b` | 5 min |
| PM | `automation-a081625c-968d-40df-876d-69a75113ddfe` | 5 min |
| COUNCIL | `automation-31b1e625-9a3a-4c58-a0b7-bfa9bb7ac085` | 5 min |
| Chief of Staff | `automation-60ceab66-07ed-4729-b9ca-bc5fdcb39459` | 15 min, fallback only |

An automation runs inside the thread that created it. A thread can own only one. Creating a second from a thread that already has one fails with "Cannot create a scheduled task inside a session that already belongs to a scheduled task." Fold new duties into the existing prompt instead.

The old 10-minute governor (`automation-2c7bbcf3-…`) was deleted on 2026-10-07 so this thread could own the relay. Its commits remain in git. Its run history in the automations UI does not.

There are no artificial deadlines. Priority only orders work when several directives are waiting. A directive with no reply 15 minutes after `ts` is treated as stalled and surfaced once.

## 5. What each team actually does

### DEV

Protocol: `.project\dev-loop\24X7-DEV-LOOP.md` and `.project\ratchet\OPERATING.md`.

From `omega-baseline\`:

1. Inbox first.
2. Take `.local\dev-loop\governor.lock` if it is older than 20 minutes. Touch it at least every 10 minutes. Remove it when done. If someone else holds a fresh lock, exit.
3. `git fetch`; fast-forward only if clean and behind. Never reset over another thread's dirty files.
4. `bun run ratchet status` (probe first if the board says stale), then `bun run ratchet next`.
5. Up to 8 cycles: claim → verify red → implement only in the packet write surface → verify green → promote → `bun run ratchet sync` → commit only those files plus ratchet projections.
6. A **separate** verifier subagent reviews. Apply `bun run ratchet review` only after the implementer has finished. Never use the implementer's label.
7. Regressions before new frontier work. If the red stub lives outside the write surface, release the claim and report BLOCKED. Do not edit across surfaces.
8. One claim file per run under `.project\agentic-launch\claims\`.

Never weaken, skip, or delete a gate. Never edit a gate file to make it pass. A stricter gate is a spec change in its own commit plus a fresh review.

Labels used: `dev-impl-<run>`, `dev-trv-<run>`. Older `gov-impl-*` / `gov-trv-*` labels are from before DEV owned the lane. Orphaned uncommitted work from cancelled Chief of Staff dispatches was handed to DEV in `D-20261007-001`.

### DEVops

Protocol: `.project\dev-loop\DEVOPS-TEAM.md`.

Sweep (from `omega-baseline\`), at most one if the last line of `.local\ops\sweeps.log` is older than 30 minutes:

- `bun run omega:quick`
- `bun run ratchet check`
- `bun run ratchet status` (probe only if stale **and** the tree is clean)
- `bun run d1:gates`
- `bun test plugins/vivim-nlcl` (49 pass expected; one known timing flake)
- bun / git / node vs `.project\ENVIRONMENT.md`
- `git fetch` and ahead/behind

Voice probes and `bun .project\dev-loop\provider-probe.mjs` at most once per 24 hours.

One outcome: GREEN, YELLOW (known gap), RED (a **new** failure → route to DEV), or BLOCKED. If other threads have uncommitted work, probes only — do not regenerate projections, do not stage their files.

`omega:test` and `omega:gate` stay blocked on missing historical inputs. Never claim them restored.

DEVops also owns:

- the DESK files and `README.md`
- `.project\dev-loop\PROVIDER-AVAILABILITY.md` (dark list + measured routes)
- the local snapshot on branch `ops/local-state` at `.project\build-guidance\local-state.json` (telemetry only; never merge that branch into `main`)
- executing a push **only** when the Chief of Staff sends `PUSH-AUTHORIZED` and names the commit range

### PM

Protocol: `.project\dev-loop\PM-TEAM.md`.

`bun run pm:check`, `bun run pm:test` (47 pass expected), `bun run ratchet status` as truth. Reconcile claims vs `STATUS.md`. Refresh `team.json` `measured`. Lock: `.local\pm\pm.lock`.

Never hand-edit `.project\pm\generated\`, `scope.json`, or `build-plan.json`. Never turn a PM warning into implementation work.

### COUNCIL

Protocol: `.project\dev-loop\DESIGN-COUNCIL.md`.

Same brief to every live voice. Minimum two independent **families** (not two models on one route). Rulings are recommendations. Record disagreements. Refusing to decide is valid. NACK task selection, re-litigation of Owen's decisions, and owner-reserved topics.

Voices that have actually answered in this setup:

- Codex: `codex.cmd exec -s read-only` from `.local\dev-loop\scratch` (Windows: use `codex.cmd`, not `codex`)
- Claude via `http://127.0.0.1:8317` even when the `claude` CLI sign-in is expired
- In-session read-only subagent — counts as the **same family** as the session model
- Grok: was dark (no key, no proxy route). Owen later said Grok is working. Re-probe before treating it as a third family; do not assume from this sentence.

A five-protocol design (panel, challenge, round-robin, vote, judge), a router, and circuit breakers were specified in a directive to COUNCIL (`D-20261007-009`). This guide does not claim that design is implemented.

## 6. Models — what was measured, and what was wrong

Measured 2026-10-07 (provider probe, not a guarantee for later):

- Codex/GPT family: 9 of 9 generation probes passed
- Claude family: 11 of 18 passed. Fable models returned 429 (credits). Five older Claude ids returned 404.
- Five `space-bunny-free` routes (owen + opencode accounts 2–5) and OpenRouter free: passed
- Grok: failed earlier the same day (`unknown provider for model`); Owen later reported it working

Pinned subagent proof: a dispatch with model `opencode-acct-2/space-bunny-free` reported that id back (`SPACE-BUNNY-ROUTING-OK`). An older session (`sess_1b835b37-057c-4892-a5c1-a26c6402d6f9`) had **not** found a per-agent model binding and found only `space-bunny-free` usable on the OpenCode Zen HTTP API; other "free" Zen models failed outside OpenCode. Treat that as a dated probe, not current law.

Corrections, stated because earlier messages in this thread were wrong:

- The standard Agent tool schema in this session was later confirmed by the teams to have **no** model argument. A model id inside a prompt does not switch the model. Do not document a fallback ladder as if persona text selects a model.
- Automatic session-model fallback was **observed once** in the Chief of Staff thread (a switch from `space-bunny-free` to `claude-opus-5-5`). It is not a tested guarantee, and there is no config field in the ZCode configuration guide for it.
- Thread model picks are Owen's. Do not re-pin them from the desk.

Ledger: `.project\dev-loop\PROVIDER-AVAILABILITY.md`. Selection notes: `.project\dev-loop\MODEL-SELECTION.md`. Probe script: `.project\dev-loop\provider-probe.mjs` (commit `74edbd8`, dark-list follow-up `3113386`). Keys stay in `~\.zcode\v2\provider_config.json`. Never commit key material; the availability file should not even keep key prefixes.

## 7. Chief of Staff loop

1. Read new lines on `status\board.jsonl` and `replies\*.jsonl`.
2. Tell Owen what each team is doing and what changed. One line per team, then the news.
3. If a reply is blocked on another team, append one directive to that team's inbox (JSON-encoded, `deadline` null).
4. Flag owner-reserved items; do not decide them.
5. Merge/push: wait for a DEVops readiness report (range, dirty tree, baselines, proof honesty, secrets, sensitive paths). Authorize an exact range or hold. DEVops pushes; this thread does not.
6. Re-arm the reply watcher before the turn ends.
7. Record relayed reply ids in `.local\staff\desk-relayed.txt` so the 15-minute fallback does not repeat them.

This thread does not dispatch builders, run sweeps, or edit product files. Setup writes in `zcode-setup\` and desk inbox appends are the exception used to install the desk itself.

## 8. Failure modes already hit

- **Dirty tree.** Promoting or committing from one thread can sweep another thread's uncommitted ratchet lock. DEV stopped rather than commit D1-029 without its code. Rule: if the lock or claims file is dirty with someone else's claim, do not promote.
- **Orphan work.** Cancelled dispatches from this thread left `gov-impl-r18` / `gov-impl-r19` claims and a `compile.ts` diff. DEV was given them explicitly (`D-20261007-001`) and adopted D1-029 (`60a2066`).
- **Vacuous gates.** D1-016 and D1-017 looked green because consent-required masked freshness and realization. Reviewer rejected them. COUNCIL upheld that. DEV then tightened the gates (`d20d605`): authority forced to `allowed`, plus a positive control. Gate edits are spec changes.
- **Stalled queues.** Directives piled up faster than 5-minute pollers cleared them. Watchers plus "act on receipt" are the fix. A 15-minute silence is a stall to surface, not a schedule.
- **Bad JSON.** Hand-built shell strings with quotes. Use a JSON encoder.
- **Lock lies.** A lock file's timestamp, not a document, says whether a worker is alive.
- **Second checkout.** Orca worktree does not see this desk.

## 9. Rebuild checklist

1. Open four ZCode threads in `C:\0-BlackBoxProject-0\VOMEGA`: DEV, DEVops, PM, COUNCIL. Paste the standing prompt for each (section 5). Confirm each creates or folds exactly one automation.
2. Confirm `.project\staff\DESK\` inboxes, replies, `status\board.jsonl`, and `README.md`.
3. In each team thread, start one background watcher on its inbox (section 4).
4. In the Chief of Staff thread, start one watcher on replies and the board, and keep the 15-minute relay automation.
5. Post one directive per team. Confirm exactly one reply line each, with a matching `in-reply-to`.
6. Post a second directive. Confirm a `start` line appears on the board before the work finishes.

## 10. Canonical files

- `.project\staff\CHIEF-OF-STAFF.md`
- `.project\staff\RACI.md`
- `.project\staff\DESK\README.md`
- `.project\staff\DIRECTIVES\20261007-command-model.md`
- `.project\dev-loop\24X7-DEV-LOOP.md`
- `.project\dev-loop\DEVOPS-TEAM.md`
- `.project\dev-loop\PM-TEAM.md`
- `.project\dev-loop\DESIGN-COUNCIL.md`
- `.project\dev-loop\PROVIDER-AVAILABILITY.md`
- `.project\dev-loop\MODEL-SELECTION.md`
- `.project\build-guidance\LOCAL-STATE-PROTOCOL.md`
- `.project\agentic-launch\claims\CLAIM-TEMPLATE.md`
- `AGENTS.md`
