# Harness research — Grok Build

## VOMEGA machine reality

Existing machine records:
- Grok Build 1.0.46 was live on the shared Linux environment;
- model `grok-4.7` was observed there at the time of that census;
- auth lived in the existing Grok home and is protected from incidental reconfiguration.

Machine observations are dated facts, not guarantees of current model availability.

## Orca stable integration

Orca v1.4.220 includes Grok as a built-in agent with **auto-setup**.

Stable source also contains a Grok session option catalog:
- model discovery through `grok models`;
- launch-time model selection;
- reasoning-effort levels;
- mid-session model/effort commands.

This is stronger than generic terminal compatibility, but local Windows proof is still required before VOMEGA relies on all of it.

Orca stable orchestration group addressing includes `@grok`.

## Official Grok Build capabilities relevant to VOMEGA

Current xAI material describes:
- interactive terminal agent;
- plan/review flow;
- headless mode;
- AGENTS.md;
- skills;
- plugins;
- hooks;
- MCP;
- parallel subagents;
- subagents in worktrees;
- sandboxed execution.

That means Grok has substantial internal orchestration of its own.

## VOMEGA nesting rule

When Grok Build is an Orca worker:
- Orca owns the top-level Task/Dispatch;
- Grok may use subagents internally;
- internal Grok worktrees must not create hidden top-level ownership;
- the parent Grok process collects evidence and sends the single Dispatch outcome.

Avoid starting with “Grok orchestrates Orca which orchestrates Grok”. Keep the direction explicit.

## Permissions

Do not force Grok's always-approve/autonomous mode during bootstrap.

Use:
- Orca Manual permission posture;
- existing Grok config;
- plan/review or normal approval behavior for early write tests.

Increase autonomy after the worktree + evidence boundary is proven.

## Setup proof

1. verify `grok` executable/version/login;
2. run `grok models` read-only and record only non-secret model metadata;
3. launch in Orca Manual mode;
4. run read-only probe;
5. run disposable-worktree edit/test;
6. run supervised Orca Dispatch;
7. test Orca status detection and question/failure lifecycle;
8. test one Grok subagent within a Dispatch;
9. verify Grok model/effort launch controls in stable binary;
10. verify Windows hook behavior on the actual machine before depending on it.

## Routing prior

Grok Build is valuable as:
- independent implementation lane;
- alternate research/review path;
- autonomous bounded builder;
- diversity source when other harnesses converge incorrectly.

Measure it rather than assigning a permanent department.
