# DevOps team — keeping the development system healthy

Status: **ACTIVE** (owner-directed, 2026-10-06)
Claim: [`../agentic-launch/claims/20261006-1701-devops-team-zcode.md`](../agentic-launch/claims/20261006-1701-devops-team-zcode.md)
Companions: [24X7-DEV-LOOP.md](24X7-DEV-LOOP.md) (builds the product), [DESIGN-COUNCIL.md](DESIGN-COUNCIL.md) (decides contested design).

## 1. What the devops team is

The dev team works **in** the system (D1 tasks); the design council decides **contested
choices**; the devops team works **on** the system: the substrate every other worker
depends on. Its mission in one sentence: **the dev team never loses velocity to
infrastructure** — gates stay green or honestly red, the environment does not drift
silently, evidence stays honest, and release readiness is always measurable.

Like the rest of the loop family it is a **mechanism, not a standing organization**:
the roster exists only inside a sweep and leaves its state in Git, the ratchet,
`.local/ops/` and Commons.

## 2. Roster (per sweep, launched fresh)

| Slot | ZCode subagent | Question it answers | Write surface |
| --- | --- | --- | --- |
| OPS-LEAD | governor session itself | routing, arbitration, closeout, event routing per AGENTS.md | `.project/dev-loop/**`, STATUS/Commons/claims |
| OPS-INT — integrator | `verifier` or `general-purpose` | do the proven baselines still pass at current HEAD? | read-only probes; fixes only with the dev-team gate discipline (below) |
| OPS-ENV — environment steward | `general-purpose` | has the machine drifted? (bun, git, gh, harness voices, locks, disk) | `.local/ops/**` (ignored); material deltas to Commons |
| OPS-REL — release steward | `general-purpose` | how far from a coherent, honest release is main? | read-only probes + reports |

Rules:

- Every sweep runs under the devops lock `.local/dev-loop/devops.lock` (same
  discipline as the governor's lock). One sweep at a time.
- **Coordination with the dev loop**: if `.local/dev-loop/governor.lock` is fresh
  (< 10 minutes), the sweep runs **read-only** (probes + checks, no fixes, no
  commits) and defers any bounded fix to the next run — the dev team owns the tree
  while it is draining.
- Slots are separate subagent contexts. OPS-INT must not fix what it probed without
  a second context reviewing the fix; a fix is a code change and takes the same
  red→green + independent-review discipline as any dev-team cycle.

## 3. The sweep (one pass, ~5 minutes)

OPS-INT — **integration baselines** (from `omega-baseline/`):

```sh
bun run omega:quick        # the named local slice — the only broad claim allowed
bun run ratchet check      # lock/anchor integrity, SPEC_CHANGED / GATE_VANISHED
bun run ratchet probe      # raw gate truth at HEAD; is the recorded probe stale?
bun run d1:gates           # D1 executable gate suite
bun test plugins/vivim-nlcl  # interpreter baseline (49 pass)
```

- Any red is either a **regression** (route to the dev loop immediately —
  regressions outrank frontier work) or a **known gap** (record, never "fix" by
  weakening). Never edit a gate to make a sweep pass.
- `omega:test` / `omega:gate` are **reported, never run to green**: they are blocked
  on omitted historical inputs (AGENTS.md). The sweep reports their blocked state
  verbatim; claiming them restored without the historical inputs is a Truth event.

OPS-ENV — **environment drift** (record to `.local/ops/env-<date>.json`, local only):

- `bun --version`, `git --version`, `node --version` against the recorded facts in
  `.project/ENVIRONMENT.md`;
- harness voice probes (codex/claude/grok one-shots) — updates the council's
  standing availability table when changed (§6 of DESIGN-COUNCIL.md);
- **provider availability probe** (owner directive 2026-10-07):
  `bun .project/dev-loop/provider-probe.mjs` — at most once per 24 h (last-run
  timestamp = final line of `.local/ops/provider-probe.log`); per-route PASS/FAIL
  against the table in [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md), **including the
  per-model sweep of both 8317 families** (claude ×18, gpt ×9 — a `/v1/models` listing is not
  availability: 5 listed claude models 404 at generation, fable-5-1/5 are 429 credits-blocked).
  Model-selection results feed [MODEL-SELECTION.md](MODEL-SELECTION.md). A NEW
  fail (a previously-passing route or model) is a Truth AND Product event with a Commons
  row; a known fail (grok routing absent at the proxy, fable credits, the 5 unroutable
  claude models, kilocode endpoint down) is recorded standing state, never re-reported as
  news. Probes report, never repair.
- stale locks (`.local/dev-loop/*.lock` older than 60 minutes), `.local/` growth;
- anything auth/provider/model-shaped that needs repair is **routed to Owen**
  (read-only rule), never fixed.

OPS-REL — **release readiness** (report only):

- local main vs `origin/main` (ahead/behind), inventory of **unpushed commits**
  (report to Owen; the loop never pushes);
- ratchet board truth: DONE/PROVEN/OPEN/BLOCKED counts, probe freshness, any
  REGRESSED task;
- evidence honesty spot-check: every committed evidence summary traceable to a
  command someone actually ran this date; fixture/simulated results never labelled
  live.

## 4. Sweep outcomes (exactly one)

| Outcome | Meaning | Action |
| --- | --- | --- |
| GREEN | baselines pass, no drift, readiness unchanged | one-line record in `.local/ops/`; Commons only if material |
| YELLOW (drift) | environment or readiness changed | record + Commons row; no fix without the gate discipline |
| RED (regression) | a baseline broke at current HEAD | route to the dev loop as the next claim (regressions outrank frontier); Truth + Product event |
| BLOCKED | sweep could not run (lock contention, missing tool) | factual record of why; retry next cadence |

## 5. Boundaries (inherited and devops-specific)

- Never push to origin; never repair auth/credentials/provider/model
  configuration; never touch spend (Owen-reserved, AGENTS.md).
- Never weaken, skip or delete a gate; never claim `omega:test`/`omega:gate`
  restored while historical inputs are missing; never report simulated as live.
- No unbounded background subagents — each OPS slot is one bounded task
  (measured harness fact: bounded workers complete, unbounded heavy ones stall).
- The sweep does **not** do D1 task work, pick tasks, or convene the council on its
  own initiative — it surfaces, the governor routes.

## 6. Automation registration (recreate from here)

Mechanism (**fold-in applied 2026-10-07T09:14Z** by the devops standing thread,
claim `../agentic-launch/claims/20261007-0916-devops-standing-thread-zcode.md`):
the sweep runs **inside the 10-minute governor automation**
(`automation-2c7bbcf3-18a4-4d0d-848a-d7691d0f908c`, `*/10 * * * *`) as prompt step
3b — after the drain ends, at most one sweep per run, throttled to one sweep per
30 minutes (the last line of `.local/ops/sweeps.log` is the throttle record), voice
probes throttled to once per 24h (the probe dates in DESIGN-COUNCIL.md §6 tell),
reds matched against the §7 standing facts (a red matching recorded standing state
is YELLOW; only a new red is RED), and a run that ends with **neither drained work
nor a sweep result** (fresh sweep, or a one-line "sweep throttled" record when the
drain idled) has failed its duty. No second lock is needed — the sweep shares the
governor run's own stampede discipline; if the worktree is dirty with in-flight
changes the drain did not create, the sweep runs read-only and records BLOCKED.

The PM sweep rides the same automation as prompt step 3c with its own
`.local/pm/pm.lock` guard (PM-TEAM.md §5). Standing-thread hosts coexist with the
automation clauses via the locks: the PM team has a standing thread
(`20261007-0911-pm-team-thread4-zcode`) and the devops team has this one
(`20261007-0916-devops-standing-thread-zcode`); the automation clause covers the
sweeps whenever no standing thread is alive.

Fallback (if the family automation is ever split): a standalone recurring
automation every 30 minutes (`*/30 * * * *`) running this §3 sweep with the §2
devops lock and the read-only coordination rule against a fresh governor lock.

Unattended runs must never block on an interactive confirmation. Verify the
mechanism with CronList plus the sweeps.log rows it produces. Owner controls:
change cadence or delete at any time.

## 7. Standing system-health facts (measured, per sweep)

| Fact | Measured | Value |
| --- | --- | --- |
| baselines | 2026-10-07 09:33:36Z (standing-thread sweep, read-only mode) | omega:quick 62/0 (10.64s) · ratchet check **SKIPPED** (dirty in-flight tree; projection regen deferred to a clean window) · ratchet status 37/80 green, **REGRESSED 0**, probe fresh @ `74b36f6` · d1:gates **exit 1** — 11 expected-red gates: 006×2/016/017/062×2 match the known-red set, D1-033/D1-041×2/D1-045/D1-051 are frontier-owned reds (no regression) · vivim-nlcl 49/0 |
| environment | 2026-10-07 09:33Z | bun 1.4.2 · git 2.51.2.windows.1 · node v24.11.1 (unchanged) · voices: probes throttled 24h — table current 2026-10-07 (codex LIVE; claude CLI OAuth expired but **API route LIVE** via wired `claude-code-oauth` provider; grok no key and no proxy routing — Owen-reserved) |
| main vs origin | 2026-10-07 09:33Z | **21 ahead** 0 behind; unpushed commits inventoried (owner decides push) |
| ratchet | 2026-10-07 09:33Z | 37/80 green @ `74b36f6`; DONE 7 · PROVEN 16 · OPEN 11 · BLOCKED 43 · REGRESSED 0 · frontier: D1-063, D1-041, D1-033, D1-029, D1-050, D1-020, D1-055, D1-006 |
| outcome | 2026-10-07 09:33:36Z | **YELLOW** — readiness changed (24/80→37/80 board advance, 21 unpushed); d1:gates exit 1 is the recorded known-red class; no regression |
| coordination | 2026-10-07 09:13–09:15Z | governor-lock handover observed while an automation run was dispatching: a live session governor's lock stamp was 28 min old (past the 20-min stampede window) and then changed hands to a "chief-of-staff" governor (`gov-run-20261007-cos`). No double-run harm confirmed, but the risk is real → step-0 **lock-touch rule** amended into 24X7-DEV-LOOP.md §3 and the automation prompt (touch the lock's mtime during long runs). Routed by claim `20261007-0916-devops-standing-thread-zcode`; **adopted in practice 09:24:54Z** (CoS lock touched, "live CoS run, lock-touch"). |
| fold-in | 2026-10-07 09:14Z | OPS (3b) + PM (3c) sweep clauses applied to `automation-2c7bbcf3` — gap from closeout 20261006-1701 closed. Verified: clauses live in the prompt (CronList, runCount 39); 09:23Z run stampede-exited correctly (CoS lock fresh); the §3 sweep procedure itself executed by the standing thread at 09:33:36Z (read-only mode). First automation-carried OPS sweep pending the first idle window (sweeps.log throttle defers it until ~10:03Z). |
| providers | 2026-10-07 09:43Z probe / 09:46Z per-model sweep (PM thread 4, owner directive) | 15 providers wired in `~/.zcode/v2/provider_config.json` (9 enabled, 6 disabled); full inventory + probe method: [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md). LIVE: claude-code-oauth (11/18 models generation-PASS — fable-5-1/5 credits-blocked 429, 5 listed models 404), codex-oauth (9/9 PASS incl. gpt-6-sol), 6446 proxy ×5 keys (200; latency varies 1.5–13.7s), openrouter (models + free gen). FAIL: grok-build-oauth — proxy serves **no grok models** (routed to Owen, report-only). kilocode 5380 unreachable (disabled, consistent). Daily probe (route + per-model sweep) runs in step 3b with a 24h throttle; log `.local/ops/provider-probe.log`; selection: [MODEL-SELECTION.md](MODEL-SELECTION.md). |
