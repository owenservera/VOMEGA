# META-WORKSTREAM GROUNDING PACK
## Current machine, accounts, CLIs, Daintree, ZCode, and concurrency facts

**Status:** Grounding document for setup design — not yet the final setup plan  
**Date:** 2026-10-06  
**Primary environment:** Windows  
**Primary project context:** VIVIM Ω / VOMEGA development, principally `github.com/owenservera/BCP-dev`

---

## 1. Purpose

This document is the single pre-design source for the development meta-workstream.

Its job is to capture the resources that already exist, the current capabilities of Daintree and ZCode, the worker CLIs that can be placed underneath them, the account/model resources already authenticated, the concurrency already demonstrated, and the architectural boundaries that must not be violated.

The next step should design the actual operating setup from these facts. It should **not** rediscover or replace working authentication, provider configuration, or account routing.

The desired end state is a local development machine capable of launching the maximum useful number of independent workstreams in parallel while keeping each workstream isolated, observable, reviewable, steerable, and recoverable.

---

## 2. Non-negotiable constraints

1. **Preserve existing authentication and provider configuration.** Existing accounts are already installed/logged in and should be consumed, not rebuilt.
2. **Do not rewrite ZCode provider configuration merely to make orchestration easier.**
3. **Do not expose, duplicate, copy, or centralize credentials unnecessarily.**
4. **Daintree is the outer worktree/workspace authority.** It should own task worktree creation, lifecycle, visibility, review, and cleanup.
5. **Worker runtimes are workers, not competing macro-orchestrators.** ZCode, Claude Code, Codex, Grok Build, and OpenCode can use internal subagents, but they should not independently create sibling worktrees when Daintree already owns isolation.
6. **One mutable implementation task = one Daintree-managed worktree.**
7. **Git state, tests, diffs, artifacts, and durable evidence outrank agent claims.**
8. **The system must remain provider-agnostic.** A worker or model is replaceable; project truth is not tied to a provider.
9. **The setup must be reproducible without secrets.** Every manual setup decision should eventually be representable as secret-free machine-readable Windows reproduction instructions.
10. **Concurrency must be bounded by evidence.** More agents are useful only while the machine, provider quotas, review capacity, and Git isolation remain healthy.
11. **Do not make Grok Bots a required execution dependency.** Grok Bot credits are currently exhausted; the operating system must function without them.
12. **Avoid orchestration duplication.** Prefer one authority for each layer rather than multiple systems trying to manage the same lifecycle.

---

## 3. Layer model

The intended operating model is:

```text
Human / Owen
    │
    ▼
Daintree
    │  macro-orchestration
    │  projects / worktrees / terminals / fleet state / review / intervention
    │
    ├──────────────┬──────────────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼              ▼
 ZCode          OpenCode       Claude Code      Codex       Grok Build
 worker          worker          worker          worker        worker
/runtime        /provider       /runtime         /runtime      /runtime
    │
    └── each worker may use its own bounded internal subagents where useful
         but remains inside the Daintree-assigned worktree
```

Grok Bots, when credits are available again, can sit **above or beside Daintree as a thin supervisory/governance plane**, but they are not required for coding or ordinary execution.

---

## 4. Known account and model resources

### 4.1 Protected ZCode/OpenCode-backed 1M-context pool

Five independent provider targets were explicitly configured and must be treated as protected existing resources:

| Lane | Provider/account label | Known model | Context | Constraint |
|---|---|---|---:|---|
| 1 | `Owen` | `space bunny free` | 1M | Do not alter provider config |
| 2 | `OpenCode acct 2` | `space bunny free` | 1M | Do not alter provider config |
| 3 | `OpenCode acct 3` | `space bunny free` | 1M | Do not alter provider config |
| 4 | `OpenCode acct 4` | `space bunny free` | 1M | Do not alter provider config |
| 5 | `OpenCode acct 5` | `space bunny free` | 1M | Do not alter provider config |

These were described as independent execution resources making their own API calls.

**Important:** Do not assume these five labels are directly addressable by every CLI. They are known to exist in the ZCode/provider setup. The setup design must discover the safe invocation/pinning mechanism without modifying the existing provider definitions.

### 4.2 OpenRouter

A later working state used:

```text
openrouter/auto
```

ZCode was demonstrated running **at least six concurrent bounded workers** through this route. The underlying concrete routed model was not necessarily exposed.

This means the machine currently has two useful facts that must not be collapsed into one:

- a protected five-lane `space bunny free` 1M-context resource pool; and
- a separate demonstrated ZCode/OpenRouter Auto path that has already sustained at least six bounded concurrent workers.

The setup must inspect which paths are simultaneously usable in the current installed configuration rather than assuming one replaced the other.

### 4.3 OpenAI / Codex

Known user resource:

- ChatGPT Plus
- Codex CLI installed
- User now confirms tools/accounts are already logged in and ready

Codex is a worker runtime, not a source of project authority.

### 4.4 Anthropic / Claude Code

Known user resource:

- Claude Pro
- Claude Code installed
- Previously active on the project
- User now confirms tools/accounts are already logged in and ready

Claude Code is a worker runtime, not a source of project authority.

### 4.5 Grok Build

Known resource:

- Grok Build CLI installed
- User now confirms tools/accounts are logged in and ready
- Grok Build can operate interactively, headlessly, and over ACP
- Grok Build can itself use parallel subagents and worktrees, but Daintree should remain the outer worktree authority

### 4.6 GitHub

Known project source:

- `github.com/owenservera/BCP-dev`

Daintree can integrate with GitHub and can import an existing `gh` CLI credential rather than requiring a separately pasted GitHub token. The exact current `gh` login should be verified, not recreated.

### 4.7 Grok Bots

Known state:

- Grok Bots were intended as an economical supervisory/setup/governance plane.
- They were not intended to be the primary coding workers.
- Credits ran out before setup was completed.
- Therefore the local operating system must now be buildable and usable without Grok Bot participation.

---

## 5. CLI and runtime inventory

### Daintree

**Role:** Macro-orchestration habitat and worktree authority.

Current upstream release observed: **v0.38.0, 2026-09-25**.

Daintree describes itself as a local orchestration layer for supervising roughly **3–10 concurrent CLI agents** across isolated Git worktrees.

Relevant capabilities:

- automatic worktree isolation
- panel grid for multiple live agent terminals
- agent-state intelligence
- Pilot cross-project fleet view
- fleet broadcasting: one prompt to N agents
- per-agent prompt edits before broadcast
- context injection via CopyTree
- worktree dashboard
- dev-server lifecycle per worktree
- embedded previews
- Review Hub
- aggregate/cross-worktree change review
- GitHub and GitLab forge integration
- notification center
- terminal recipes
- workflow/DAG automation with approval gates
- action palette
- MCP control surface
- authorization tiers, audit log, and idempotent MCP operations
- supervision primitives for agents Daintree did not itself launch
- plugins and plugin-supplied agent MCP tools
- Daintree Assistant
- up to three concurrent Assistant sessions per project in recent releases
- resource governance for CPU/memory/idle/battery pressure
- restoration/persistence of project windows and agent sessions

Daintree explicitly supports or advertises launch integration with:

- Claude Code
- OpenCode
- Codex
- Grok
- Gemini CLI
- Aider
- Goose
- Cursor Agent
- GitHub Copilot CLI
- Amp
- Crush
- Qwen Code
- Kimi Code
- others

For this system, only already-available workers should be included initially; support for other agents is not a reason to install them.

Useful Daintree-specific artifact:

```text
.daintree/recipes/*.json
```

Recipes are tracked, parameterized agent-launch configurations and are suitable for eventually making the manual setup repeatable.

Recent MCP/worktree primitives include post-create readiness and bounded waiting for PR detection across multiple worktrees. A current release can wait for a PR across up to 32 worktrees; this is **not** evidence that 32 simultaneous coding agents is the intended operating load.

### ZCode

**Role:** High-capability worker/runtime and potentially the strongest single inner-loop agent environment.

Current official open-source version observed: **v3.14.3, 2026-09-23**.

ZCode includes desktop, browser, terminal, Agent CLI/runtime, plugins, skills, MCP, hooks, subagents, and background task machinery.

Primary user configuration:

```text
~/.zcode/cli/config.json
```

MCP:

- stdio servers
- HTTP servers
- legacy SSE
- tools registered before first model request
- CLI commands to list/status/connect/disconnect MCP servers
- standalone `mcp.json` / `.mcp.json` files outside enabled plugins are not automatically discovered by the current CLI

Plugins can contribute:

- skills
- commands
- MCP servers
- other packaged runtime capabilities

#### ZCode subagents/background work

Current source implements a real child-session lifecycle rather than a simple prompt fan-out:

- foreground or background subagents
- child session IDs
- isolated agent profiles
- working-directory and workspace-root binding
- tool allow/deny policy
- output files
- task registry
- completion/failure state
- stop/wait operations
- message delivery/resume behavior
- parent-session completion notifications
- activity/inactivity supervision

This is useful for **inner-task parallelism**.

It should not replace Daintree's responsibility for outer worktree isolation.

#### ZCode Browser Use

Browser Use is an official built-in plugin.

Relevant characteristics:

- semantic browser control rather than only screenshots/pixel clicks
- Playwright-style DOM snapshot → locator → action workflow
- Desktop integrated-browser backend
- opt-in CLI-managed headless CDP backend
- controlled and user tab registries
- screenshots requested when visual evidence is needed
- `web-gui-tester` workflow for black-box GUI testing

This is useful when a setup action exists only behind a web UI.

#### ZCode Computer Use

The current ZCode tool architecture exposes Computer Use through the same shared `node_repl` host family used by Browser Use.

The exact native bridge is distribution-specific and must be verified on the installed build before relying on it.

An open-source compatibility implementation following the ZCode surface documents capabilities including:

- list applications/windows
- inspect application/accessibility state
- click
- drag
- type
- scroll
- set UI value
- keyboard commands
- request access
- stop computer control

The compatibility implementation lacks direct equivalents for generic `perform_action`, `select_text`, and clipboard `paste`; element selection, typing, value-setting, and keyboard fallback are expected.

For the current manual setup, Computer Use is an **exception path**, not the main path. Prefer direct configuration/CLI operations whenever they exist.

---

## 6. Worker-specific automation surfaces

### 6.1 OpenCode

Relevant current CLI capabilities:

```text
opencode
opencode run ...
opencode serve
opencode attach ...
opencode models
opencode agent ...
opencode auth ...
```

Useful run controls include:

- `--model provider/model`
- `--agent`
- `--dir`
- `--session`
- `--continue`
- `--fork`
- `--file`
- `--format json`
- `--auto`
- attach a run to an existing `opencode serve` instance

OpenCode can create primary agents and subagents with permission-specific profiles.

Design implication:

- OpenCode is highly scriptable.
- Its existing authentication/provider state must remain protected.
- If used as a Daintree worker, Daintree owns the worktree and OpenCode receives that worktree as its working directory.
- A long-lived `opencode serve` may reduce repeated MCP cold-start overhead, but this is an optimization to test, not an assumption.

### 6.2 Claude Code

Relevant automation surfaces:

```text
claude
claude -p "..."
claude --continue
claude --resume ...
claude mcp ...
```

Useful headless controls include:

- text / JSON / stream-JSON output
- `--max-turns`
- model selection
- permission mode
- explicit allowed/disallowed tools
- resume/continue session
- programmatic Agent SDK use

Current Claude Code feature surface also includes:

- `CLAUDE.md`
- skills
- subagents
- agent teams
- hooks
- MCP
- plugins
- code intelligence

Agent teams coordinate multiple independent Claude Code sessions with shared tasking and peer-to-peer messaging.

Design implication:

- Claude Code can create substantial nested parallelism.
- Under Daintree, internal subagents/teams are acceptable only when they do not defeat Daintree's outer isolation and observability.
- Do not use Claude's own worktree creation as the default when Daintree already assigned a worktree.

### 6.3 Codex CLI

Known current use:

```text
codex
codex exec ...
codex mcp ...
```

Codex can operate non-interactively and under sandbox/approval policies.

OpenAI's current guidance distinguishes several integration levels:

- CLI for direct work
- Codex SDK for new programmatic automation
- app server for deeper integration involving auth/history/approvals/streamed events
- older Codex MCP-server integration remains documented for existing integrations but is no longer the preferred new automation surface

Design implication:

- For Daintree, ordinary Codex CLI execution is sufficient initially.
- Do not add a new Codex orchestration service unless it solves a measured problem.
- Daintree already has Codex-aware session restoration and subagent visibility features.

### 6.4 Grok Build

Relevant current modes:

```text
grok
grok -p "..."
grok inspect --json
grok models
grok mcp ...
grok plugin ...
grok agent ... stdio
grok agent ... serve
```

Headless mode supports:

- single prompt
- explicit model
- explicit session ID
- resume / continue
- explicit working directory
- plain / JSON / streaming JSON output

Grok Build also supports:

- AGENTS.md
- plugins
- hooks
- skills
- MCP
- plan/review/approval loop
- parallel subagents
- internal worktree integration
- ACP server mode over stdio or WebSocket

Design implication:

- Grok Build is one of the easiest workers to place behind automation because it has both headless and ACP surfaces.
- Its internal worktree machinery should be disabled/avoided for Daintree-managed tasks unless there is a deliberate nested-isolation experiment.

### 6.5 Git and GitHub CLI

Core infrastructure:

```text
git
git worktree ...
gh ...
```

Daintree should be the ordinary human-facing manager of worktree lifecycle, but raw Git remains the underlying authority.

`gh` should be treated as the preferred GitHub command-line authentication/integration surface if already logged in.

---

## 7. Worktree ownership rule

The most important operating boundary is:

```text
Daintree workspace/project
    └── task worktree
          └── one primary worker session
                └── optional inner subagents
```

A worker may fan out analysis/review/test activity internally, but all mutations for that Daintree task should resolve back into its assigned worktree.

Avoid this by default:

```text
Daintree worktree A
    └── worker
         ├── creates worktree B
         ├── creates worktree C
         └── creates worktree D
```

That creates two competing sources of worktree truth and weakens review/cleanup/ownership.

If nested worker-created worktrees are ever tested, they should be an explicit experiment with a named owner and cleanup protocol.

---

## 8. Concurrency facts already established

### Confirmed

1. Five independent named 1M-context `space bunny free` provider targets exist in the ZCode environment.
2. A later ZCode/OpenRouter Auto path sustained **at least six concurrent bounded workers**.
3. Daintree is explicitly designed for supervising **3–10 concurrent CLI agents** as its normal local-fleet use case.
4. Daintree can run multiple worktrees and many terminal panels.
5. Recent Daintree builds permit **up to three concurrent Daintree Assistant sessions per project**.
6. ZCode itself can run background subagents with persistent task/session state.
7. Claude Code can run subagents and agent teams.
8. Grok Build can run parallel subagents.
9. Codex and OpenCode can be launched non-interactively.
10. All principal worker tools are now said by the user to be installed and logged in.

### Not yet established

- Machine RAM/CPU threshold at which 8–10 Daintree worktrees plus agents becomes counterproductive.
- Simultaneous quota/rate-limit behavior across all provider accounts.
- Whether all five named ZCode provider targets can be explicitly pinned from automated launches without config mutation.
- Whether the five-account pool and `openrouter/auto` can be exploited simultaneously.
- Safe number of concurrent Claude Code sessions under the current Claude Pro limits.
- Safe number of concurrent Codex sessions under the current ChatGPT/Codex entitlement.
- Safe number of concurrent Grok Build sessions under the current account entitlement.
- Whether multiple ZCode desktop/CLI sessions share any local lock, broker, or helper limitation.
- Exact Daintree recipe syntax needed for each local worker on this machine.
- Which worker emits the best machine-readable state for Daintree supervision.

Therefore the setup should discover the **actual concurrency envelope** rather than inventing one.

---

## 9. Likely immediate outer workstream envelope

The architectural target should be **outer Daintree workstreams first, inner worker fan-out second**.

A sensible design target is to make **8–10 outer workstreams possible** because that aligns with Daintree's stated operating envelope, then benchmark downward or upward from evidence.

This is not yet a command to launch ten implementation agents. It is the capacity the setup should try to support cleanly.

Nested subagents should not be counted as equivalent outer workstreams because they may share:

- the same worktree
- the same provider account
- the same context authority
- the same review owner
- the same machine bottleneck

---

## 10. Meta-workstreams that can be independent

The final setup design should be able to launch independent workstreams such as these without collision.

### A. Environment and capability census

Read-only.

Deliver:

- versions
- executable paths
- login health
- config locations
- current models/providers
- MCP health
- plugin/skill inventory
- safe machine-readable launch commands

### B. Daintree integration verification

Own Daintree-specific setup only.

Deliver:

- project registration
- worker definitions
- launch recipes
- worktree creation/cleanup proof
- agent-state detection proof
- review flow proof
- notification proof
- GitHub/`gh` integration proof

### C. ZCode execution-pool verification

Protect provider config.

Deliver:

- current version
- working provider/model list
- invocation method for each named lane if safely addressable
- `openrouter/auto` health
- subagent/background-task test
- Browser Use health
- Computer Use health
- concurrency evidence

### D. OpenCode execution verification

Protect auth/provider config.

Deliver:

- CLI health
- models
- noninteractive JSON execution
- server/attach viability
- Daintree terminal-state compatibility
- safe per-worktree launch recipe

### E. Claude Code execution verification

Deliver:

- CLI health
- headless/streamed execution
- resume behavior
- Daintree state detection
- internal subagent/team behavior inside one assigned worktree
- safe recipe

### F. Codex execution verification

Deliver:

- CLI health
- noninteractive execution
- approval/sandbox behavior
- resume behavior
- Daintree Codex session awareness
- safe recipe

### G. Grok Build execution verification

Deliver:

- CLI health
- `grok inspect --json`
- headless JSON/streaming run
- ACP viability
- Daintree state detection
- explicit proof that Daintree can retain outer worktree ownership
- safe recipe

### H. Git/worktree truth lane

Read/write only to test branches/worktrees.

Deliver:

- branch naming convention
- worktree root convention
- collision checks
- cleanup behavior
- stale-worktree recovery
- integration/review rules
- proof that workers do not touch the main checkout unexpectedly

### I. Evidence/observability lane

Deliver:

- canonical task ID
- worktree ID/path
- worker runtime/session ID
- provider/model when knowable
- start/end timestamps
- git base/head SHA
- tests/checks
- diff
- result state
- blocker/failure
- reviewer disposition

### J. Resource/concurrency benchmark lane

Deliver empirical limits rather than guesses:

- 2 workers
- 4 workers
- 6 workers
- 8 workers
- 10 workers

Measure:

- CPU
- memory
- terminal responsiveness
- Daintree responsiveness
- provider throttling
- model latency
- failures/timeouts
- review backlog

Do not benchmark by allowing agents to edit the same files.

### K. Context/memory acceleration experiment

This preserves the existing **Elephant** hypothesis without prematurely committing to an implementation.

Hypothesis:

- reserve one or more very-large-context sessions as contextualized repo/truth memory
- distribute source/context across them
- let active workers query them for architectural comparisons, impact analysis, proposed-change review, and repo-grounded correction
- evaluate value before making them a permanent system layer

Questions to test:

- whether a maintained 1M-context session materially improves worker quality
- how source should be partitioned
- how context rotation works
- how workers query the memory session
- whether the memory session becomes stale
- how proposals are checked against repository truth
- how much latency/token overhead it introduces
- whether several specialized "elephants" outperform one monolithic one

This remains an acceleration hypothesis, not a prerequisite.

---

## 11. Context and truth hierarchy

The system should distinguish these layers:

```text
Repository + Git + tests + durable evidence
    ↓
Project instructions / canonical docs
    ↓
Daintree task/worktree state
    ↓
Worker session context
    ↓
Worker output / claims
```

A large-context worker or Elephant can be an excellent retrieval/reasoning surface, but it is not canonical merely because it remembers more.

For VIVIM Ω specifically, durable product and architecture truth must remain reconstructable from the repository and evidence rather than existing only in a model session.

---

## 12. Daintree vs ZCode responsibility split

### Daintree owns

- project/workspace registration
- outer task partitioning
- Git worktree lifecycle
- worker terminal launch
- worktree-to-worker association
- fleet state
- human intervention surface
- prompt broadcast when useful
- task-level context injection
- dev-server association
- review
- integration visibility
- terminal/worktree cleanup
- cross-project operational view

### ZCode owns when selected as worker

- reasoning inside its assigned task
- local repo exploration
- code edits inside its assigned worktree
- shell/tool use
- Browser Use
- Computer Use when needed
- its own task-local subagents/background agents
- task-local plugins/skills/MCP
- verification requested by the task

### Neither should own

- hidden global project truth that cannot be reconstructed
- unilateral rewriting of credentials/provider configs
- untracked mutation of unrelated worktrees
- implicit authority to merge because an agent says a task is complete

---

## 13. Manual setup information we should gather before changing anything

The next setup step should begin with a **read-only census** and record:

```text
where.exe daintree / app installation path
zcode version
opencode --version
claude --version
codex --version
grok --version
git --version
gh --version
node --version
pnpm --version
bun --version
```

Also record, without secrets:

- executable path
- current working-shell requirements
- config path
- authentication status
- session-store path
- available provider/model labels
- available MCP servers
- available plugins/skills
- Daintree detected-agent status
- whether Daintree can launch the binary
- whether Daintree correctly detects running/waiting/completed state
- whether the worker accepts an explicit working directory
- whether the worker can run headlessly
- whether the worker has structured output
- whether the worker can resume a session
- whether the worker creates worktrees by itself
- whether that behavior can be disabled or simply avoided

This census should **not print token/key contents**.

---

## 14. Decisions deliberately deferred

The grounding facts are sufficient to design the system, but these choices should be made only after the read-only census and small verification runs:

- exact number of Daintree outer lanes
- which worker is default
- whether ZCode or OpenCode gets the largest share of routine tasks
- whether `openrouter/auto` or pinned account lanes are preferable for specific workloads
- how the five named accounts are selected programmatically
- whether Daintree Assistant should be a primary dispatcher or only an operator aid
- whether ACP is useful for Grok Build or ordinary terminal launching is enough
- whether OpenCode should use a persistent `serve` process
- whether Codex needs any integration beyond direct CLI launching
- whether Claude agent teams add value inside a Daintree worktree
- whether ZCode Computer Use belongs in ordinary setup or only recovery/GUI-exception tasks
- whether Elephant/context servers earn a permanent role
- exact concurrency ceiling
- exact escalation policy to rare frontier models

---

## 15. Design criteria for the next step

The eventual setup is successful only if it can demonstrate all of the following:

1. Daintree can create an isolated worktree from the intended base.
2. Daintree can launch at least one instance of every selected worker into the correct worktree.
3. Each worker receives the intended task/context without changing unrelated provider configuration.
4. Daintree can tell whether a worker is running, waiting, blocked, or finished.
5. Worker sessions can be steered/interrupted/resumed where the worker supports it.
6. Two or more independent tasks can mutate different worktrees without collision.
7. A finished task can be reviewed as a concrete diff with tests/evidence.
8. Failed/abandoned worktrees can be cleaned safely.
9. The main checkout remains clean.
10. At least six concurrent bounded workers can be reproduced without loss of control, matching the already observed ZCode concurrency floor.
11. The system can then scale toward Daintree's 8–10 practical outer-workstream target and measure where the actual machine/account boundary occurs.
12. No setup step requires Grok Bot credits.
13. No setup step requires re-authenticating an already-working account.
14. Every important manual setting can be recorded into a future reproducible recipe/instruction without storing secrets.

---

## 16. Current best architectural hypothesis

The strongest current hypothesis is:

```text
DAINTREE
local macro-orchestration + worktree authority
        │
        ├── ZCode lanes
        │     ├── protected named provider lanes where addressable
        │     └── OpenRouter Auto where appropriate
        │
        ├── OpenCode lanes
        │
        ├── Claude Code lanes
        │
        ├── Codex lanes
        │
        └── Grok Build lanes
              │
              └── optional bounded task-local subagents
```

Daintree provides **horizontal isolation and supervision**.

Each worker provides **vertical intelligence and task-local agentic depth**.

The important optimization problem is therefore not "which agent framework wins?" It is:

> How many genuinely independent, well-grounded, reviewable workstreams can this machine sustain at once, and which already-authenticated worker/provider resource should receive each kind of task?

That is the question the setup should answer empirically.

---

## 17. Research anchors

### Daintree

- Repository / README: https://github.com/daintreehq/daintree
- Vision: https://github.com/daintreehq/daintree/blob/develop/docs/vision.md
- Releases: https://github.com/daintreehq/daintree/releases
- Changelog: https://github.com/daintreehq/daintree/blob/develop/CHANGELOG.md
- Feature curation: https://github.com/daintreehq/daintree/blob/develop/docs/feature-curation.md
- Agent/project conventions and tracked recipes: https://github.com/daintreehq/daintree/blob/develop/CLAUDE.md

### ZCode

- Repository: https://github.com/zai-org/ZCode
- README: https://github.com/zai-org/ZCode/blob/main/README.en.md
- Agent CLI/runtime README: https://github.com/zai-org/ZCode/blob/main/apps/zcode-cli/README.md
- Browser Use plugin: https://github.com/zai-org/ZCode/blob/main/apps/zcode-cli/packages/browser-use-plugin/README.md
- Subagent runtime implementation: https://github.com/zai-org/ZCode/blob/main/apps/zcode-cli/packages/core/src/subagent/runner.ts

### OpenCode

- CLI: https://opencode.ai/docs/cli/
- Agents: https://opencode.ai/docs/agents/

### Claude Code

- CLI reference: https://docs.anthropic.com/en/docs/claude-code/cli-usage
- Setup: https://docs.anthropic.com/en/docs/claude-code/getting-started
- Current feature architecture: https://code.claude.com/docs/

### Grok Build

- Overview: https://docs.x.ai/build/overview
- CLI reference: https://docs.x.ai/build/cli/reference
- Open-source runtime: https://github.com/xai-org/grok-build
- Headless mode: https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/14-headless-mode.md
- ACP/agent mode: https://github.com/xai-org/grok-build/blob/main/crates/codegen/xai-grok-pager/docs/user-guide/15-agent-mode.md

### Codex

- Repository: https://github.com/openai/codex
- OpenAI developer documentation: https://developers.openai.com/
- OpenAI Docs MCP: https://developers.openai.com/learn/docs-mcp

---

## 18. Canonical short-form inventory

```yaml
host:
  os: Windows
  setup_mode: manual-first
  auth_state: "user confirms principal tools are installed/logged in"

project:
  primary_repo: "github.com/owenservera/BCP-dev"
  product: "VIVIM Ω / VOMEGA"

outer_orchestrator:
  name: Daintree
  version_researched: "0.38.0"
  role:
    - worktree_authority
    - terminal_fleet
    - context_injection
    - review
    - state_visibility
    - intervention
    - resource_governance
  normal_concurrency_target: "3-10 CLI agents"

workers:
  - ZCode
  - OpenCode
  - Claude Code
  - Codex CLI
  - Grok Build

zcode:
  version_researched: "3.14.3"
  features:
    - plugins
    - skills
    - mcp
    - hooks
    - browser_use
    - computer_use_surface
    - subagents
    - background_tasks
  config: "~/.zcode/cli/config.json"

protected_model_lanes:
  - { provider: "Owen", model: "space bunny free", context: "1M" }
  - { provider: "OpenCode acct 2", model: "space bunny free", context: "1M" }
  - { provider: "OpenCode acct 3", model: "space bunny free", context: "1M" }
  - { provider: "OpenCode acct 4", model: "space bunny free", context: "1M" }
  - { provider: "OpenCode acct 5", model: "space bunny free", context: "1M" }

additional_route:
  provider_model: "openrouter/auto"
  demonstrated_concurrency: ">=6 bounded ZCode workers"
  concrete_routed_model: "not always exposed"

other_accounts:
  openai:
    plan: "ChatGPT Plus"
    worker: "Codex CLI"
  anthropic:
    plan: "Claude Pro"
    worker: "Claude Code"
  xai:
    worker: "Grok Build"
  github:
    repo: "owenservera/BCP-dev"
    preferred_cli: "gh"

temporarily_unavailable_control_plane:
  grok_bots:
    reason: "credits exhausted"
    required_for_operation: false

invariants:
  - preserve_existing_auth
  - preserve_provider_configs
  - daintree_owns_outer_worktrees
  - workers_stay_inside_assigned_worktree
  - evidence_over_agent_claims
  - secret_free_reproducibility
  - benchmark_concurrency
  - no_grok_bot_dependency

deferred_hypothesis:
  elephant_context_memory:
    status: "test, do not pre-commit"
    idea: "reserve large-context sessions as intelligent repo/truth memory services"
```

---

**End of grounding pack.**
