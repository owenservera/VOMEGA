# WS-OPS — Coordination & DevOps Throughput

**Mission.** Keep parallel work safe and the roadmap revisable with the minimum machinery that measurably helps (CODEX-BOOTSTRAP 'do not overbuild DevOps').

**Milestones touched:** M0, recurring  
**Falsifiers owned / served:** —  
**First moves:** OPS-01 and OPS-03 immediately.

## Scope

In scope:

- Commons adoption and claim protocol
- Track isolation and file ownership
- Executor-lane verification
- Milestone-exit Release Gym cycles

Out of scope:

- Dashboards, schedulers or orchestration daemons without a measured bottleneck

## Interfaces

- Coordinates all workstreams; routes failures per AGENTS.md

## Working principles

- Accelerators must show validated throughput gains (DEVELOPMENT-ACCELERATION-HYPOTHESES).

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [OPS-01](#ops-01) | M0 | Adopt roadmap into Commons | — | S |
| [OPS-02](#ops-02) | M0 | Parallel-track isolation plan | OPS-01 | S |
| [OPS-03](#ops-03) | M0 | Verify executor lanes before dispatch | — | S |
| [OPS-04](#ops-04) | M0 | Milestone exit ritual = Release Gym cycle | — | S |

## Task cards

### OPS-01

**Adopt roadmap into Commons** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

Add one Commons row per active milestone (M0–M3 initially) and state the claim protocol: a session claims a task ID, records owner/status/evidence, and releases it on handoff. Link SITREP to `.project/roadmap/README.md`.

Acceptance:

- [ ] COMMONS.md lists M0–M3 rows with accountable room and task-ID ranges
- [ ] SITREP 'Next actions' references roadmap task IDs instead of prose

Proof: Doc review by a second executor

### OPS-02

**Parallel-track isolation plan** · M0 Roadmap adoption & proof plumbing · size S · depends on OPS-01

Define worktree/branch and file-ownership boundaries so PRV (browser spike), CMD (language core) and SHL (shell spike) can run concurrently without editing the same files. Root keeps package.json/bun.lock and launcher.

Acceptance:

- [ ] Ownership table in COMMONS: PRV owns new provider-webapp plugin dir + lab dir; CMD owns plugins/vivim-nlcl*/ and new command module; SHL owns new shell dir
- [ ] Merge order rule recorded (CMD contracts land before SHL consumes them)

Proof: Two concurrent sessions complete without conflicting edits

### OPS-03

**Verify executor lanes before dispatch** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

Run one bounded, non-sensitive request per configured lane (ZCode Space Bunny lanes, alternate Claude) in an explicit permission mode; record reachable/unreachable. Configuration stays read-only.

Acceptance:

- [ ] ENVIRONMENT.md lane table updated to 'live-verified' or 'unreachable' with date
- [ ] No credential/config file modified (git diff + config mtime check)

Proof: Recorded command, exit code and response digest per lane

### OPS-04

**Milestone exit ritual = Release Gym cycle** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

At every milestone exit run the BUILD-FOCUS Release Gym loop against the remaining roadmap: re-rank, record contradictions, update ROADMAP.md 'Current position' and RELEASE-GYM.md. This is the mechanism that keeps the roadmap revisable.

Acceptance:

- [ ] RELEASE-GYM.md gains one dated cycle entry per milestone exit
- [ ] Any re-ordering of milestones is recorded with the evidence that caused it

Proof: Gym entry exists for each closed milestone

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
