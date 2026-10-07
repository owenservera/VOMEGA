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

Mechanism (current, 2026-10-06): the sweep runs **inside the 10-minute governor
automation** (`automation-2c7bbcf3`, `*/10 * * * *`) — the drain (§ of
24X7-DEV-LOOP.md) and the sweep share one governor run, so the sweep fills exactly
the window where the drain legitimately idles and no second lock is needed. A run
that ends without either drained work or a sweep result has failed its duty.

Fallback (if the teams are ever split): a standalone recurring automation every 30
minutes (`*/30 * * * *`) running this §3 sweep with the §2 devops lock and the
read-only coordination rule against a fresh governor lock.

Unattended runs must never block on an interactive confirmation. Verify the
mechanism with CronList. Owner controls: change cadence or delete at any time.

## 7. Standing system-health facts (measured, per sweep)

| Fact | Measured | Value |
| --- | --- | --- |
| baselines | 2026-10-06 19:55:53Z (first sweep) | omega:quick 62/0 (5.98s) · ratchet check green after projection regen · d1:gates **exit 1** — D1-006's two side-effect-green gates unpromoted (PROMOTE_PENDING ×2; routed to the dev loop, not an ops defect) · vivim-nlcl 49/0 |
| environment | 2026-10-06 19:55Z | bun 1.4.2 · git 2.51.2.windows.1 · node v24.11.1 · codex.cmd LIVE · claude OAuth expired (owner reports fixed; CLI probe still fails 19:55Z — surfaced) · grok no key |
| main vs origin | 2026-10-06 19:55Z | **10 ahead** 0 behind; unpushed commits inventoried (owner decides push) |
| ratchet | 2026-10-06 19:55Z | 24/80 green @ bc226dc-line; DONE 5 · PROVEN 14 · OPEN 10 · BLOCKED 48; D1-026 CLAIMED (in-flight preserved) |
| outcome | 2026-10-06 19:55:53Z | **YELLOW** — projections stale (regenerated in-sweep), d1:gates exit 1 (routed), 10 unpushed (surfaced) |
