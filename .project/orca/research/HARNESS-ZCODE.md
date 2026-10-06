# Harness research — ZCode

## VOMEGA machine reality

Current VOMEGA environment records:
- ZCode desktop 3.14.4.7912 installed on Windows;
- bundled CLI reported 0.16.9 and is invoked through Node;
- no standalone `zcode` PATH command was observed;
- at least six bounded ZCode workers were observed once through the existing ZCode environment;
- five configured provider lanes exist under the historical names Owen and OpenCode acct 2–5; their individual simultaneous live reachability has not been proven.

## Orca stable integration

Orca v1.4.220 labels ZCode **Deep integration**.

However, Orca has a specific hard requirement:

> the `zcode` executable Orca launches must include the interactive TUI.

Orca's own stable source contains a pre-launch interactive-capability probe because:
- `zcode --version` and `doctor` do not distinguish a build with TUI from one without it;
- the desktop application's bundled runtime can lack `@zcode/tui`;
- that bundled shape may work headlessly but fail as an interactive Orca terminal agent.

### Consequence

The existing desktop-bundled CLI is **not enough** for Orca adoption.

Bootstrap must install/build/locate a separate TUI-capable ZCode CLI and prove:

```text
zcode
→ opens interactive session outside Orca
→ opens interactive session inside Orca
→ receives an Orca prompt
→ completes a bounded task
→ participates in an Orca Dispatch
```

Do this without replacing or rewriting the ZCode desktop application's provider/account configuration.

## Official ZCode capabilities relevant to VOMEGA

Current ZCode docs describe:
- isolated-context subagents;
- foreground parallel subagents and background subagents;
- custom subagents with model/thinking/tool permissions;
- AGENTS.md injection for normal subagents;
- plugins bundling skills, commands, subagents, MCP servers and hooks;
- user/plugin hooks around session/model/tool/stop events;
- MCP servers managed by ZCode.

### VOMEGA use

ZCode is a strong **task-local team harness**.

Inside one Orca Dispatch, a ZCode worker may fan out to its own subagents. The parent ZCode session remains the Orca worker of record and must:
- preserve the Orca Task/Dispatch identity;
- own the final files/evidence for that Dispatch;
- summarize child work;
- send one authoritative `worker_done`.

Subagents do not become separate VOMEGA task owners unless Orca itself dispatches them as separate workers.

## Configuration boundary

Do not:
- copy ZCode provider secrets into Orca;
- change the five historical provider lanes merely to satisfy Orca;
- assume provider names equal Orca accounts;
- enable/modify hooks/plugins/MCP globally during initial Orca proof.

Orca integration should adapt to the currently working ZCode configuration.

## Setup proof

1. obtain TUI-capable `zcode` CLI;
2. confirm PATH precedence and version;
3. launch interactive TUI outside Orca;
4. inspect that existing provider config remains visible without mutation;
5. add/enable ZCode in Orca;
6. launch a read-only/manual bounded probe;
7. test write task in disposable worktree;
8. test supervised Orca Dispatch;
9. test one ZCode subagent inside that Dispatch;
10. compare provider/auth/config files before/after for unexpected mutation.

## Open questions

- Does the standalone TUI CLI read exactly the same provider/account state as the desktop install?
- Can the five configured lanes be explicitly selected per ZCode session, or are they only visible to ZCode's own router?
- Does Orca stable expose ZCode model/account identity in receipts?
- Does Orca orchestration support ZCode worker-start cleanly despite stable examples not naming it?
- How do ZCode session-resume semantics interact with Orca worker retain/release?
