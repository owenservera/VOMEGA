# Development environment census

Observed 2026-10-05 on the owner's Windows machine during bootstrap;
authentication/configuration inspected read-only. Version and configuration
presence do not prove subscription, model, or provider health.

This is a dated census of one machine, not project architecture. Later
observations supersede individual rows without rewriting them:

- ZCode route and measured concurrency (2026-10-05, after this census):
  `agentic-launch/STATUS.md`. The route is `openrouter/auto`; the five lanes
  described below were never individually probed.
- Claude Code was later observed at 2.1.289 and Grok Build at 1.0.46.
- A separate shared Linux box (Daintree 0.41.0, Claude Code, Grok Build, Codex,
  OpenCode, Kilo) is described in `dev-machine/HARNESS-MATRIX.md`.
- Daintree and ZCode are separate habitats. Daintree does not launch, supervise
  or manage ZCode.

| Capability | Observed status | Safe route / limits |
| --- | --- | --- |
| Git | 2.51.2.windows.1; one worktree, main, clean seed f03905e | origin owenservera/VOMEGA; worktrees available |
| GitHub CLI | authenticated as repository owner | coherent normal push permitted; no history rewrite |
| Node | 24.11.1 | CLI/help and existing Node SQLite conformance lane |
| Bun | executable available; subsequent execution reports 1.4.2 | owner added Bun to PATH; bun.exe discoverable; inherited shell still selects old pnpm shim for bare bun, launcher selects executable |
| Codex | 0.160.0, active executor | session tools, specialists, shell, web and browser tools exposed |
| Claude Code | alternate executable 2.1.258; local auth status logged in | PATH shims broken; `.local/bin/claude.exe`; model execution untested |
| ZCode desktop | 3.14.4.7912 installed | no running process observed during census |
| ZCode bundled CLI | 0.16.9; help and doctor --json return successfully | invoke through Node; no zcode PATH command |
| Chrome | installed version metadata 154.0.8037.93 | automation tools exposed; provider transport/auth binding untested |
| TypeScript/build | TS source executes with Bun; alternate global tsc reports 7.0.2 | no seeded tsconfig/typecheck/build pipeline; global ESLint shim broken; no claim of full static validation |

Initial Bun file metadata/install reported 1.3.14, while subsequent commands
reported 1.4.2. This session did not upgrade Bun; record the execution version
with each proof rather than treating metadata as a permanent fact.

Five configured lanes: Owen, OpenCode acct 2, 3, 4 and 5. Each enabled lane has
Space Bunny Free enabled with a configured 1,048,576 context window. Credentials
are present and distinct. Limits/authentication/live inference were not tested.
Their status is **configured; live reachability unknown**, not available capacity
proven by a successful request. No endpoint or credential values are stored here.

Safe alternate commands:

```powershell
& "$env:USERPROFILE\.local\bin\claude.exe" --version
node 'C:\Program Files\ZCode\resources\glm\zcode.cjs' --help
node 'C:\Program Files\ZCode\resources\glm\zcode.cjs' doctor --json
```

ZCode help exposes prompts, app-server, resumable sessions, goals, workflows,
skills/plugins/MCP and permission modes. Headless prompts default to yolo;
choose an explicit mode for a later task. Claude exposes print/JSON, worktrees,
agents and MCP. Its model/gateway settings prevent assuming direct Pro routing.

Installed capabilities include GitHub, browser/computer-use, document tools,
agent roles and skill libraries; this Codex session exposes code reviewers,
workers, filesystem/shell and web tools. ZCode has memory, SessionStart hooks,
custom agents/skills and plugin registrations; registration and cached skills
do not establish MCP/browser health. An old BCP observatory plugin is optional
prior tooling, not an inherited organization. No new orchestration platform,
subscription, global PATH repair, auth flow or provider reconfiguration was added.

Use deterministic local tools and bounded specialists now. Route work to Claude
or ZCode after the specific mode/model availability is evidenced. For the live
browser follow-up, inspect existing transport before installing an extension or
launching a new profile; preserve unknown Account identity as unknown.
