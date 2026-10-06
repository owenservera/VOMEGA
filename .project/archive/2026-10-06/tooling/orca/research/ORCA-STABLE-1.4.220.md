# Orca stable baseline — v1.4.220

## Identity

- Canonical repo: `stablyai/orca`.
- License: MIT.
- Stable baseline for VOMEGA: `v1.4.220`, released 2026-10-04.
- Platforms advertised by the project: macOS, Windows and Linux.
- VOMEGA target: native Windows first.

## Stable orchestration model

The stable orchestration reference explicitly defines:

| Primitive | Stable meaning |
| --- | --- |
| Run | durable namespace + coordinator inbox; does not place/schedule workers |
| Task | work item with spec, dependencies and status |
| Dispatch | one authoritative attempt of one Task on a terminal |
| Worker | supervised agent process attached to a Dispatch |
| Message | durable coordinator/worker inbox item |
| Question/reply | blocking worker→coordinator interaction |
| Heartbeat | liveness signal; not completion |
| worker_done | explicit terminal outcome with task + dispatch identity |
| Decision gate | coordinator-owned decision that blocks a task |

This is materially stronger than “launch several terminals”.

### Important semantics

- lifecycle authority comes from the active Dispatch;
- copied task IDs, terminal titles or provider transcripts do not themselves authorize completion;
- `worker_done` requires explicit `succeeded` or `failed`;
- a settled worker can be released or retained;
- timeout/absence is not proof of process death;
- dependency DAGs are supported;
- questions and escalations are first-class messages.

This maps well to VOMEGA's existing distinction between evidence and assertion.

## Experimental status

The orchestration UI/CLI is documented as **Experimental** and must be enabled under Settings → Experimental.

VOMEGA interpretation:
- acceptable for the development factory;
- must be wrapped by repo/evidence truth;
- no project invariant should depend on Orca retaining a particular command shape;
- after upgrades, bootstrap should query the installed binary's own skill/reference text rather than trust website docs.

## Worker launch / routing

Stable `worker-start` can select an Orca agent ID. Stable documentation explicitly names Claude, Codex, OpenCode and others; Grok also has orchestration group addressing and a built-in agent definition. ZCode is a supported built-in agent but needs local validation in the supervised worker path.

Stable per-launch model/effort override is strongest for selected agents such as Claude and Codex. In stable:
- OpenCode should be treated as using its own configured model;
- ZCode/Grok model selection should remain harness-owned unless locally proven otherwise.

A newer Orca `main` has deeper OpenCode per-launch model/prompt plumbing. VOMEGA will not depend on it while pinned to v1.4.220.

## Worktrees

Orca worktrees provide:
- isolated Git checkout/branch;
- terminals and agent session surfaces;
- tracked workspace status/comments;
- review/diff workflow;
- optional setup/archive hooks;
- independent or parent/child lineage.

VOMEGA default:
- independent task → top-level worktree from repo default base;
- stacked work only when dependency actually requires branch lineage;
- worktree is collision isolation, not a security boundary.

## orca.yaml

Relevant stable keys:
- `scripts.setup`
- `scripts.archive`
- `setupAgentStartupPolicy`
- `issueCommand`
- `defaultTabs`
- `worktree.sharedDirectories`
- `environmentRecipes`

### Windows shell rule

On native Windows, `orca.yaml` setup runs as **.cmd by default**. Choosing PowerShell as the interactive terminal does not make the setup script PowerShell.

A leading POSIX `#!` opts into Git Bash only when configured/available.

VOMEGA consequence:
- do not paste PowerShell into `scripts.setup`;
- do not add a setup hook until the exact VOMEGA dependency bootstrap is verified;
- `setupAgentStartupPolicy: wait-for-setup` is useful once a real setup script exists.

## Shared directories and copied ignored files

`worktree.sharedDirectories` links existing gitignored directories back to the primary checkout. On Windows Orca prefers directory junctions.

Therefore **do not blindly share `node_modules`, caches, vaults or state**. Shared contents can be modified across worktrees.

`.worktreeinclude` creates private copies of listed ignored files/directories, but VOMEGA should not use it to replicate credentials by default.

## Permission posture

Stable supported-agent docs warn that Orca defaults new supported agents toward their bypass/auto-approval flag.

VOMEGA overrides this operationally:
1. initial Orca global agent permission mode = **Manual**;
2. prove each harness;
3. autonomous/bypass modes only for bounded trusted work where the harness's own sandbox/permission model is understood;
4. never treat worktree isolation as sandboxing.

## Usage/account visibility

Stable docs show:
- Claude + Codex deep account switching/usage;
- OpenCode usage visibility;
- other stable tracking varies by harness.

Usage data comes from local agent state and is not authoritative billing/provider truth.

## Stable-vs-main ledger

| Area | v1.4.220 | main observation | VOMEGA policy |
| --- | --- | --- | --- |
| orchestration core | present | present/evolving | use stable |
| ZCode deep integration/TUI check | present | present | use stable |
| OpenCode worker/status | present | present | use stable |
| deeper OpenCode startup/plugin/prompt plumbing | partial | materially richer | do not require |
| Grok model/effort catalog | present | present/evolving | use only after local probe |
| Windows setup shell rules | present | present | design to stable |

## Upgrade rule

Upgrade Orca only when:
- current stable blocks a required capability;
- the newer version has a specific relevant fix/capability;
- source/release notes are reviewed;
- ORCA-BOOT smoke tests are rerun after upgrade.
