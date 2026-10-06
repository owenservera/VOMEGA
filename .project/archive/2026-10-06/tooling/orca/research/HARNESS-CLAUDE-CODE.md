# Harness research — Claude Code

## VOMEGA machine reality

Existing records:
- Claude Code 2.1.258 was observed on the Windows machine through an alternate executable path during the earlier census;
- Claude Code 2.1.289 was later observed live on the shared Linux environment;
- authentication/config is protected from incidental modification.

Re-probe current Windows version/path during Orca bootstrap.

## Orca stable integration

Orca v1.4.220 treats Claude Code as a first-class/deep integration:
- automatically uses existing `~/.claude`;
- worktree-aware launch;
- status hook;
- usage/rate-limit visibility;
- multi-account hot-swap;
- subagent/team child rows;
- agent hooks/memory surfaces.

Orca also exposes **Claude Agent Teams** as a distinct optional agent integration, disabled by default.

## Claude internal parallelism

Claude Code has:
- isolated subagents;
- hooks;
- skills/plugins/MCP;
- Agent Teams with separate sessions and peer coordination.

This gives VOMEGA two possible scales:

```text
Orca Task/Dispatch
    ↓
single Claude worker
    ↓
Claude subagents / optional Agent Team
```

### Policy

Keep Claude Agent Teams **disabled during the first Orca bootstrap**.

Reason:
- VOMEGA first needs clean cross-harness Task/Dispatch provenance;
- nested teams add another ownership/message topology;
- we should enable them later only for a task class where their peer coordination is demonstrably useful.

Ordinary Claude subagents can be tested earlier as task-local compute.

## Account handling

Use the existing Claude login first.

Do not hot-swap/create more accounts just to prove Orca. Account management is a later capacity feature.

## Permissions

Orca's default Claude launch may prefill `--dangerously-skip-permissions`.

VOMEGA initial posture:
- Orca Manual;
- preserve Claude's existing permission/security settings;
- do not make “dangerously skip” the global baseline.

## Setup proof

1. verify executable/path/version and login;
2. confirm Orca reads existing Claude identity;
3. launch read-only Manual probe;
4. launch disposable-worktree edit/test;
5. launch supervised Orca Dispatch;
6. test blocking question + coordinator reply;
7. test one Claude subagent inside a Dispatch;
8. verify parent owns final `worker_done`;
9. inspect Orca usage/account state;
10. only after top-level proof, separately experiment with Claude Agent Teams.

## Routing prior

Claude Code is a strong candidate for:
- architecture-sensitive implementation;
- difficult cross-cutting reasoning;
- independent critique/review;
- long-context or specification-heavy work.

This is a routing prior, not permanent authority.
