# Orca bootstrap — revised setup

**Target:** Owen's Windows development machine  
**Pinned baseline:** Orca v1.4.220  
**Goal:** establish a safe heterogeneous execution control plane over ZCode, OpenCode, Codex, Grok Build and Claude Code without disturbing working auth/provider configuration.

## Gate 0 — Preserve machine truth

Before installation/configuration:

1. record VOMEGA local `HEAD`, `origin/main`, dirty state and worktrees;
2. read `AGENTS.md`, `.project/SITREP.md`, `.project/ENVIRONMENT.md`, `.project/dev-machine/`, and this folder;
3. record current harness executable/version/invocation;
4. record auth/config **presence only**, never secrets;
5. hash or otherwise snapshot sensitive config metadata if useful for before/after mutation detection;
6. do not repair/upgrade any harness yet.

Output: sanitized pre-Orca census.

## Gate 1 — Install pinned Orca

Install **v1.4.220 Windows build**, not an arbitrary nightly/main build.

Verify:
- desktop starts;
- `orca status --json` succeeds;
- CLI and desktop refer to the same running runtime;
- VOMEGA repo can be registered;
- repo base ref is `origin/main`.

Do not enable experimental orchestration yet.

## Gate 2 — Set safe global posture before agent launch

In Orca:

1. Settings → Agents → Agent Permissions → **Manual**.
2. Do not enable Claude Agent Teams yet.
3. Do not import/copy secrets into repo configuration.
4. Do not add account duplicates just because Orca supports hot-swap.
5. Do not add `.env` to `.worktreeinclude` by default.

Reason: Orca's supported-agent defaults otherwise tend toward bypass/auto-approval modes, and a worktree is not a security sandbox.

## Gate 3 — Register VOMEGA and prove worktree mechanics

Add the existing VOMEGA checkout as the primary repo.

Prove:
- list/show repo;
- create independent disposable worktree from default base;
- run harmless command;
- inspect diff/status;
- archive/remove cleanly;
- external Git worktree visibility if needed.

Do not add complicated `orca.yaml` hooks yet.

### Initial orca.yaml posture

During proof, prefer **no setup script** until actual dependency bootstrap is validated.

If/when added, remember:
- native Windows `scripts.setup` is **.cmd syntax** by default;
- PowerShell terminal selection does not change this;
- a POSIX shebang opts into Git Bash;
- `setupAgentStartupPolicy: wait-for-setup` is preferred once setup is real.

Avoid blindly sharing `node_modules` or stateful caches; shared directories are linked back to the primary checkout.

## Gate 4 — Resolve the ZCode TUI prerequisite

This is the first known blocker.

Current VOMEGA records show ZCode desktop's bundled CLI path but no standalone `zcode` PATH command.

Orca needs a TUI-capable `zcode`.

Procedure:
1. obtain a standalone distribution/build of ZCode CLI that carries the TUI;
2. do **not** uninstall/replace the desktop app;
3. do **not** rewrite provider/account configuration;
4. put the standalone CLI on PATH in a controlled way;
5. run `zcode --version`;
6. prove bare `zcode` opens an interactive session outside Orca;
7. only then expose it to Orca.

If the standalone CLI does not inherit the existing provider config, stop and document the boundary rather than migrating secrets automatically.

## Gate 5 — Harness probes, one at a time

Order is chosen for diagnosability, not importance:

### 5A Claude Code
- executable/version/auth;
- Orca recognizes existing account;
- read-only Manual task;
- disposable-worktree edit/test;
- status/usage observation.

### 5B Codex
- executable/version/auth;
- System default identity;
- read-only Manual task;
- disposable-worktree edit/test;
- status/usage observation.

### 5C Grok Build
- executable/version/auth;
- model listing metadata;
- Manual read-only task;
- edit/test;
- verify Orca status/model controls.

### 5D OpenCode
- executable/version/auth/config;
- Manual read-only task;
- edit/test;
- two-session attribution test later;
- **no version migration during this gate**.

### 5E ZCode
- standalone TUI-capable CLI;
- Manual read-only task;
- edit/test;
- one internal subagent test.

For every harness record exact command/path/version and whether Orca launched the expected binary.

## Gate 6 — Pairwise concurrency

Before all-five fan-out:
- Claude + Codex simultaneous worktrees;
- Grok + OpenCode;
- ZCode + one other harness.

Verify:
- separate worktrees/write sets;
- correct terminal/session attribution;
- no prompts delivered to wrong worker;
- no unexpected auth/provider changes;
- CPU/RAM acceptable.

## Gate 7 — Enable Orca Experimental orchestration

Now enable Settings → Experimental.

Read the **installed binary's** current guide:

```text
orca skills get orchestration --full
```

This installed reference outranks website examples when flags differ.

Prove a two-worker supervised Run:
- Run;
- two Tasks;
- two Dispatches;
- one worker question;
- one `worker_done succeeded`;
- one deliberate `worker_done failed`;
- coordinator processes inbox;
- retain/release.

## Gate 8 — Prove nested harness agents

One at a time:
- ZCode subagent;
- Claude subagent;
- Codex subagent;
- Grok subagent;
- OpenCode subagent if current version supports the intended pattern.

Invariant:
> child work remains attributable to one parent Orca Dispatch.

Keep Claude Agent Teams disabled until ordinary nested subagents are proven.

## Gate 9 — ORCA-BOOT-01 full campaign

Run [ORCA-BOOT-01.md](ORCA-BOOT-01.md).

Only after it passes may project docs call Orca the **validated current execution substrate**.

## Gate 10 — Automation posture

After the proof:
- selectively move trusted task classes from Manual toward higher autonomy;
- preserve harness-native sandbox/permission boundaries;
- define maximum concurrency from measurement;
- begin empirical harness routing;
- only then test Elephant reservations/context services.

## Rollback

At any point:
- preserve Git work;
- stop Orca workers through positive lifecycle evidence;
- leave harness credentials/config intact;
- remove Orca-specific disposable worktrees if safe;
- VOMEGA remains executable through the direct harnesses.

Orca is a control plane, not a single point of project survival.
