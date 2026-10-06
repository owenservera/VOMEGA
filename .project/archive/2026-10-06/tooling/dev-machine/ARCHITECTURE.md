# Development-machine architecture

**Status:** current experiment snapshot, not project law.  
**Authority:** `.project/META-TRACKER.md` + explicit invariants/proof boundaries outrank this file.

## Meta grounding

The development system exists to increase **validated product progress**. Its structure is replaceable.

Daintree, ZCode, direct CLI workers, worktrees, run ledgers, dispatch scripts and reviewer patterns are mechanisms under test. Keep them only while evidence shows they help.

The map preserves possibilities; it does not prescribe the path.

## Observed tools and the corrected boundary

### Daintree

On the shared Linux box, Daintree 0.41.0 is live and has evidenced:

- Git worktree visibility/lifecycle;
- supported CLI-agent PTY launch;
- Review Hub;
- project/worktree interaction.

Daintree does **not** launch, supervise or manage ZCode.

### ZCode

ZCode is a separate execution substrate. On Windows it has historically demonstrated at least six concurrent bounded workers on `openrouter/auto`.

Its sessions/subagents are managed by ZCode itself, not by Daintree.

### Coexistence

If both are useful at the same time, coordinate them through durable surfaces:

```
project goal / current evidence
          │
          ├── Daintree → Git worktrees + supported CLI agents + Review Hub
          │
          └── ZCode    → independent ZCode workers/sessions

shared coordination = Git + task artifacts + STATUS + tests/evidence
```

A Git worktree may be created with raw Git or Daintree and then opened independently by another tool. That does not make the creating tool the manager of the other runtime.

## Current safe isolation pattern

When concurrent writes would collide, the current default is:

```
bounded claim/task
→ disposable worktree
→ implement
→ relevant proof
→ independent challenge when consequence/load warrants it
→ integrate
→ remove disposable worktree
```

This is a safety pattern, not a requirement that every task have a worktree or that every review use a different provider.

No permanent branch-per-lane. Lanes are temporary ownership vocabulary.

## Thin durable machinery

The useful tool-neutral pieces currently kept outside any habitat are:

- environment/health checks;
- task/evidence references;
- optional disposable-worktree helpers;
- secret-free run observations;
- integration helpers;
- Windows reconstruction notes.

They must not become a second orchestration platform.

## Concurrency

Use measured evidence, not a fixed org chart.

Current evidence includes:

- Windows ZCode: ≥6 bounded workers in a prior launch;
- Linux Daintree: multiple worktrees and supported CLI panels evidenced;
- unbounded heavy ZCode background work stalled while bounded work completed.

Any numeric default in helper scripts is a conservative script setting, not project policy. Increase, decrease or bypass it from current machine/provider/review capacity.

## Non-goals

- No permanent master scheduler.
- No mandatory Daintree→ZCode hierarchy.
- No requirement that Daintree or ZCode survive as the eventual solution.
- No model or harness permanently owns a workstream.
- No automatic frontier-model spend.
- No development machinery promoted to project truth merely because it works today.
