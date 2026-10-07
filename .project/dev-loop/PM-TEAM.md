# PM team — always-on projection reconciliation

Status: **ACTIVE** (owner-directed, 2026-10-06)
Claim: [`../agentic-launch/claims/20261006-1932-pm-team-always-on-zcode.md`](../agentic-launch/claims/20261006-1932-pm-team-always-on-zcode.md)
Companions: [24X7-DEV-LOOP.md](24X7-DEV-LOOP.md) · [DEVOPS-TEAM.md](DEVOPS-TEAM.md) · [DESIGN-COUNCIL.md](DESIGN-COUNCIL.md)

## 1. What the PM team is

The standing PM law (`.project/pm/README.md`, `team.json` rules) is unchanged and
binding: **PM is projection, not truth**; it manages exactly the five owner-scoped
programs (MP-21, MP-54, MP-55, MP-56, MP-60); it never chooses, ranks, adds or
removes programs and never sets product priority; source/tests/evidence outrank PM;
Ratchet owns computed execution/proof; PM stops above atomic work.

The always-on PM team is the mechanism that keeps that projection **alive**: a
recurring sweep that reconciles the PM surfaces with measured truth, runs the PM
self-checks, and routes discrepancies — so the five programs' state in PM never
silently drifts from what the dev loop actually proved.

## 2. Roster (per sweep, launched fresh; mirrors team.json banding)

| Slot | Runtime | Role | Write surface |
| --- | --- | --- | --- |
| PM-LEAD | governor session (or a dedicated bounded subagent when the dev loop holds the tree) | run the sweep, arbitrate, route events | `.project/pm/team.json` (measured/status facts), `.local/pm/**`, STATUS/Commons rows |
| PM-TRU | bounded `verifier` subagent | adversarial check that the projection matches truth; must not have written what it checks | read-only + report |
| PMC-CUR / PMC-AUT / PMC-DEP | on demand only | dossier curation / decomposition / estimates | read-only (analysis) |

## 3. The sweep (one pass, ~2 minutes)

From `omega-baseline/`:

```sh
bun run pm:check     # PM self-check (needs-review warnings are records, not failures)
bun run pm:test      # PM deterministic tests (47 pass expected)
bun run ratchet status   # truth reference: gate/task counts at HEAD
```

Then reconcile (bounded reads):

- active claims (`.project/agentic-launch/claims/`) vs the active-claims table in
  `STATUS.md` — stale or missing rows are corrected;
- `build-plan.json` waves/holds vs the ratchet board's DONE/PROVEN/OPEN/BLOCKED
  counts and any NEEDS_REVIEW warnings (e.g. MP-60 P5 decomposition review);
- `data/programs/*.json` dossier gate state vs measured evidence — deepen a dossier
  only when evidence actually moved (record the evidence commit);
- `team.json` `measured` block + `runtimeVerified` — update to this sweep's real
  values.

Outcome recorded in `.local/pm/sweeps.log` (git-ignored); a Commons row only when
material (drift found and routed, or a milestone/hold state change).

## 4. Hard boundaries (inherited, restated because they are the point)

- Never hand-edit `generated/` — regenerate via `bun run pm` tooling only.
- Never edit `scope.json` or `build-plan.json` (owner-authored; read-only to PM).
- Never do D1/Ratchet task work, never claim code tasks, never touch
  auth/credentials/provider/model configuration.
- Never convert a PM warning into work without routing it (Truth + Product per
  AGENTS.md) — PM surfaces, the dev loop executes.
- Claim-before-edit; disjoint write surfaces; load-bearing PM changes get
  independent review (PM-TRU).

## 5. Registration (recreate from here)

- Current (2026-10-07): the PM thread owns its own automation
  `automation-a081625c-968d-40df-876d-69a75113ddfe` (`*/5 * * * *`). Each run
  answers unanswered directives in `.project/staff/DESK/inbox/pm.jsonl` (one reply
  line each in `replies/pm.jsonl`, contract `.project/staff/DESK/README.md`), then
  runs the §3 sweep only if the last `.local/pm/sweeps.log` line is >30 min old and
  `.local/pm/pm.lock` is not fresh (<20 min). There is no fallback carrier: the
  family governor `automation-2c7bbcf3` that held the earlier step-3c fold-in is
  **paused** (owner directive 2026-10-07; each team now runs in its own thread).
- Recreate (if this thread's automation is lost): one recurring automation in the
  PM thread with the same prompt and cadence. One automation per thread; it never
  creates further automations.

## 6. Standing facts (measured, per sweep)

| Fact | Measured | Value |
| --- | --- | --- |
| pm:check | 2026-10-07 09:15Z | ok (1 warning: NEEDS_REVIEW MP-60 P5 decomposition review) |
| pm:test | 2026-10-07 09:15Z | 47 pass / 0 fail / 743 expect() |
| ratchet reference | 2026-10-07 09:15Z | 37/80 green; DONE 7 · PROVEN 16 · OPEN 11 · BLOCKED 43 · REGRESSED 0 @ 8a7300f (probe run this sweep; board unchanged by docs-only commits since) |
| team.json runtimeVerified | 2026-10-07 09:15Z | true (standing thread 4 sweep) |
