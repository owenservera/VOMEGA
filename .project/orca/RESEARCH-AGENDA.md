# Orca research agenda

**Status:** queued for the next phase. No external research was performed to create this seed.

The research should answer whether current Orca can satisfy VOMEGA's execution-control requirements **as it exists now**, especially on Windows.

## 1. Identity and freshness

- What is the canonical Orca repository/product?
- Current release/version/date?
- License?
- Active maintenance level?
- Windows support status?
- Installer/update path?
- Known breaking changes in recent releases?

## 2. Harness support

For each of:
- ZCode
- OpenCode
- Codex
- Grok Build
- Claude Code

determine:
- officially supported, generic terminal-compatible, community-supported, or unsupported;
- launch method;
- resume/session support;
- native chat vs terminal/PTY support;
- subagent visibility;
- prompt injection/automation support;
- status detection;
- account/model awareness;
- limitations/issues on Windows.

Do not infer “supported” from a logo or a process name.

## 3. Orchestration primitives

Verify whether current Orca actually provides:
- coordinator concept;
- task objects;
- dependency DAG;
- dispatch ownership;
- durable worker identity;
- blocking ask/reply;
- worker completion protocol;
- escalation;
- decision/approval gates;
- retained workers;
- programmatic/CLI control;
- API/MCP surface;
- autonomous creation of workers/worktrees.

For each, record source + version + local proof plan.

## 4. Worktrees and integration

Research:
- worktree lifecycle;
- branch naming;
- base branch behavior;
- shared directories/dependencies;
- merge/rebase/conflict handling;
- review/diff UI;
- cleanup;
- handling of simultaneous writers;
- repo-local config such as `orca.yaml`;
- Windows shell semantics.

## 5. Operator control surface

Can Owen:
- see all running projects/worktrees/agents;
- distinguish working/waiting/question/failed/done;
- inspect logs/output;
- interrupt/redirect a worker;
- send follow-up prompts;
- compare diffs;
- approve/reject;
- merge/integrate;
- identify which harness/account/model was used;
- manage remote hosts if desired later?

## 6. Routing and capacity

Determine what Orca itself can route versus what VOMEGA must add:
- harness selection;
- account selection;
- model selection;
- quotas/rate limits;
- concurrency limits;
- CPU/RAM pressure;
- priority queues;
- retry/backoff;
- cost awareness;
- frontier escalation;
- dynamic reassignment.

## 7. Context system fit

Research how Orca handles:
- project instructions;
- per-task context;
- context injection;
- persistent sessions;
- retained workers;
- agent-to-agent messages;
- sending files/diffs to another worker;
- MCP/skills/plugins;
- long-context sessions.

Map this to MP-54 Automatic Context Bundles and the Elephant hypothesis without duplicating canonical project state.

## 8. Evidence/provenance

Can Orca expose enough machine-readable history to reconstruct:
- task;
- owner;
- harness;
- worktree/branch;
- prompts/messages;
- timestamps;
- outcome;
- diff/commit;
- review;
- failure/escalation?

Identify what must remain in VOMEGA's own evidence/run ledger.

## 9. Security/config safety

Verify:
- credential storage;
- whether Orca reads or rewrites existing harness configs;
- shell execution permissions;
- MCP/tool permissions;
- secrets exposure in logs;
- account switching behavior;
- isolation between worktrees/sessions;
- update/telemetry behavior.

## 10. Community reality

Search:
- GitHub issues/discussions;
- Reddit/X/community reports where useful;
- recent Windows reports;
- multi-agent scale reports;
- ZCode/OpenCode/Grok-specific reports;
- concurrency/resource failure modes;
- abandoned/experimental features;
- real workflows beyond demos.

Separate primary-source capability from anecdotal experience.

## 11. Output format

The research phase should end with:

1. **Capability matrix** — REQUIRED / AVAILABLE / PARTIAL / ABSENT / UNKNOWN.
2. **Windows fit report**.
3. **Harness integration matrix**.
4. **Risk register**.
5. **Architecture corrections** to this folder.
6. **Exact ORCA-BOOT-01 implementation plan**.
7. **Go / adapt / reject recommendation** supported by evidence.
