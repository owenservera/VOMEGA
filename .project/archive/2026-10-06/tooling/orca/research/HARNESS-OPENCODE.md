# Harness research — OpenCode

## VOMEGA machine reality

Existing machine notes record OpenCode 1.18.34 on the shared Linux environment and historical OpenCode/ZCode provider experimentation on Windows.

The five configured lanes named Owen and OpenCode acct 2–5 should **not** be reclassified as five Orca OpenCode accounts without proof. They are configured provider-capacity facts from the existing environment.

## Orca stable integration

Orca v1.4.220 lists OpenCode as:
- built-in agent;
- auto-setup;
- status-aware;
- usable by structured orchestration (`opencode`, `opencode2` IDs are documented).

Stable Orca recognizes OpenCode headless `run` semantics.

Newer Orca `main` has significantly deeper OpenCode PTY/startup-prompt/plugin plumbing. That deeper code is not a stable v1.4.220 requirement.

### Stable model-selection rule

In v1.4.220 orchestration docs, OpenCode uses the model from **its own configuration**. Do not design initial routing around Orca selecting an arbitrary OpenCode model per Dispatch.

Newer `main` can conditionally support per-launch model selection after capability/version checks; treat that as future capability.

## Current OpenCode docs vs VOMEGA version

Current OpenCode public docs include newer v2 service architecture:
- local clients can share a background service;
- `--standalone` can create a private service;
- agents/subagents and permissions are configurable;
- model/provider selection is a harness concern.

VOMEGA currently has an older observed OpenCode 1.x binary in one environment.

Therefore:
- **do not upgrade OpenCode as part of Orca bootstrap**;
- first prove current installed OpenCode with Orca stable;
- only evaluate v2 migration as a separate change if it materially improves isolation/routing.

## Parallelism concern

A shared OpenCode backend can blur process/session attribution if multiple workers share service state.

For VOMEGA this becomes a proof question:
- can multiple Orca OpenCode Dispatches run concurrently with clean session/task attribution using current installed OpenCode?
- if not, does a per-worker/private-service mode solve it without breaking existing provider configuration?

Do not set `--standalone` globally until that interaction is tested against the actual version and Orca launcher.

## Task-local subagents

OpenCode's own agent/subagent system may be used inside one Orca Dispatch.

Top-level rule:
- Orca owns the cross-harness Task and Dispatch;
- OpenCode owns its internal agent execution;
- the parent OpenCode worker owns the final result and `worker_done`.

## Permissions

Orca's global Manual-first bootstrap takes precedence as the initial proving posture.

Keep OpenCode's own permission configuration intact. Do not automatically rewrite `opencode.json` to make Orca easier to operate.

## Setup proof

1. locate current OpenCode binary/version on target Windows host;
2. inspect auth/config presence read-only;
3. launch current OpenCode outside Orca;
4. launch through Orca in Manual mode;
5. run a read-only bounded task;
6. run a disposable-worktree edit + deterministic test;
7. run as supervised Orca worker;
8. run two OpenCode workers concurrently and check attribution/session isolation;
9. inspect whether Orca status is accurate;
10. only then consider private/standalone backend or version upgrade.

## Open questions

- Is Windows target currently OpenCode v1, v2, or both?
- Can Orca stable surface enough OpenCode session identity to map all five provider-capacity lanes?
- Does parallel current-version OpenCode use a shared state server?
- Which of the five configured provider lanes are actually reachable from the OpenCode harness versus only ZCode?
