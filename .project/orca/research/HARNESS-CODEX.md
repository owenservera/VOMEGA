# Harness research — Codex

## VOMEGA machine reality

Existing machine records:
- Codex 0.160.0 observed as an active executor on Windows;
- Codex 0.160.0 observed authenticated on the Linux box, with a temporary usage limit during one census;
- existing auth is not to be rewritten as an incidental Orca setup action.

## Orca stable integration

Orca v1.4.220 describes Codex as one of its deepest integrations:
- reads the system `~/.codex` login;
- account-aware launch;
- usage/rate-limit visibility;
- Orca-managed additional accounts can have isolated homes;
- nested Codex Task subagents can be represented as child rows;
- restart preserves account identity;
- native Windows and optional WSL routing are supported.

VOMEGA default remains **native Windows**. WSL is an available escape hatch, not a baseline dependency.

## Account design

The initial setup should use the existing **System default** Codex identity.

Do not create extra Orca-managed Codex accounts during bootstrap unless Owen explicitly wants account expansion.

This preserves:
- existing working login;
- fewer moving parts;
- clear before/after proof of config safety.

Later, Orca's isolated extra-account homes may be useful for capacity/rate-limit management.

## Sandbox / approvals

Codex has its own sandbox and approval model. Orca also has an agent-permission launch posture.

Do not conflate them.

Initial proof policy:
- Orca Agent Permissions: Manual;
- Codex: retain its existing safe sandbox/approval configuration;
- prefer workspace-write or narrower where the task allows;
- do not use dangerous full access merely because the worker is in a Git worktree.

A worktree prevents branch/file collisions; it does not protect the rest of the machine.

## Codex subagents

Codex may spawn task subagents. Treat them as child compute of one Orca Dispatch unless Orca itself assigned separate top-level Tasks.

The parent Codex worker remains responsible for:
- child coordination;
- final diff;
- tests;
- evidence;
- `worker_done`.

## MCP correction

Codex can **consume MCP servers** through current configuration.

Do not design VOMEGA around Codex CLI acting as the top-level MCP orchestration server. Current Codex evolution has removed/changed older CLI MCP-server patterns; Orca is the intended cross-harness control layer here.

## Setup proof

1. verify Codex version and existing login outside Orca;
2. ensure Orca sees System default account without copying credentials;
3. launch Manual/read-only task;
4. launch workspace-write task in disposable worktree;
5. verify usage/account display is informational only;
6. test supervised `worker-start --agent codex`;
7. test explicit failure and `worker_done --outcome failed`;
8. test one nested Codex subagent and verify parent attribution;
9. test retain/release/restart behavior;
10. verify no unexpected `~/.codex` mutation beyond normal Codex runtime bookkeeping.

## Routing prior

Codex is a strong candidate for:
- precision implementation;
- difficult debugging;
- refactors;
- test repair;
- independent technical review.

This is a prior to measure, not a permanent role.
