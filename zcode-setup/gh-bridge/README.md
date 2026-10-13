# Oracle ↔ GitHub bridge — bootstrap v0.1

Status: **safe bootstrap only**. No remote command execution. No automatic ChatGPT event trigger is configured by this repository.

External ChatGPT stream ownership and a minimal public operation/evidence index are described in [the external-streams visibility contract](../../.project/staff/external/README.md). Those event records document what was reported or verified; they do not grant DESK dispatch authority or wake an idle ZCode chat.

## Purpose and current ZCode integration

This is a tiny external transport feeding the *existing* ZCode company machinery rather than another orchestration service.

- GitHub source: \`zcode-setup/gh-bridge/tasks/*.json\` on \`owenservera/VOMEGA\` main.
- Receiver: dependency-free Node 20+ \`bridge.mjs\`; \`once\` does \`git fetch\`, **not** \`git pull\`, merge, reset or checkout. Dirty active worktrees stay intact.
- Local inbox: \`.local/gh-bridge/inbox/<id>.json\`. Each envelope records the source commit and SHA-256 and is de-duplicated by immutable task ID.
- Chief of Staff/Oracle owns reviewing this inbox and, if appropriate, issuing a directive through the existing \`.project/staff/DESK\` protocol. The bridge never writes into team inboxes. An idle ZCode session may not wake merely from a new file.
- Receipt: \`.local/gh-bridge/outbox/<id>-<outcome>.json\`; local only in v0.1. An acknowledgment is **not** verified execution.
- Public VOMEGA repo task content is **untrusted**. No shell command, code, credential, or privileged task can be executed by the bridge.

## First Windows test (manual bootstrap)

From your primary VOMEGA checkout, previously documented as \`C:\0-BlackBoxProject-0\VOMEGA\`, in PowerShell:

\`\`\`powershell
cd C:\0-BlackBoxProject-0\VOMEGA
git status --short
git pull --ff-only
node --test .\zcode-setup\gh-bridge\bridge.test.mjs
node .\zcode-setup\gh-bridge\bridge.mjs scan --ref HEAD
node .\zcode-setup\gh-bridge\bridge.mjs status
node .\zcode-setup\gh-bridge\bridge.mjs ack smoke-001 RECEIVED
\`\`\`

Expect \`INTAKE smoke-001\` and a local receipt. Repeat \`scan\` to verify dedupe. If pull refuses because the local checkout is dirty or diverged, **do not force, stash, clean or reset active work**. Ask Chief/DEVops to reconcile; this bridge itself only needs fetch after it is installed.

## Opt into automatic polling

\`\`\`powershell
.\zcode-setup\gh-bridge\Install-Watcher.ps1
.\zcode-setup\gh-bridge\Install-Watcher.ps1 -Apply
Get-ScheduledTask -TaskName VOMEGA-Oracle-GitHub-Intake
\`\`\`

Windows Task Scheduler then runs roughly every minute when the machine is awake and able to run the task. It fetches new task manifests, validates them, and stores them locally. It **never executes their text**. Uninstall with:

\`\`\`powershell
.\zcode-setup\gh-bridge\Install-Watcher.ps1 -Remove -Apply
\`\`\`

## Return channel: use supported GitHub PR events in Work

ChatGPT Work supports **event-triggered tasks on supported GitHub pull-request activity**, not arbitrary commit/push webhooks. In ChatGPT **Work**, connect/authorize GitHub under Settings > Apps. Create a new event-triggered task monitoring \`owenservera/VOMEGA\` PR activity, with this suggested instruction:

> On supported PR activity in owenservera/VOMEGA, only handle PRs explicitly labeled \`oracle-report:\` in their title. Inspect actual changed files and evidence. Distinguish self-reported completion from independently verified tests. Notify me with results, blockers and recommended next actions. Do not merge, approve execution, change credentials, or expose private data.

Review its Trigger, Condition, and Prompt, and approve it in Work. It is a separate Work task, **not** an inbound webhook for an existing pinned chat.

In v0.1, Oracle/DEVops should create a sanitized result PR manually. Automatic publication of reports requires authenticating the local GitHub client and choosing a private control repo; avoid publishing local logs or secrets into this public repository.

## Gates

- **G0:** pull, validate, intake, dedupe, local receipt (this commit).
- **G1:** confirm current Oracle intake/wake mechanism. Chief retains sole DESK directive-writing authority.
- **G2:** move sensitive controls to a **private control repo**; add message authentication, replay defense and task ACLs.
- **G3:** sanitized PR result publisher plus Work PR-trigger, mobile notification, delivery verification.
- **G4:** only then consider scoped autonomous execution, isolated runtime and explicit high-risk approvals.

Do not mutate Ratchet, PM projections, ZCode global config, model provider credentials, or other agents' DESK files as part of bridge setup.
