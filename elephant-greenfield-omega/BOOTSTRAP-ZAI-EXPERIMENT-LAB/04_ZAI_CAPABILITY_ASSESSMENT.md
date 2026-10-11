# Z.ai Full-Stack and ZCode: Capability Reality Assessment

**Research basis: public Z.ai/ZCode primary pages consulted 2026-10-11.** Web interfaces and entitlements may change; verify inside the actual logged-in environment before treating a feature as operational. The named `Z.ai Full-Stack` web app mode and `ZCode Agent` are related but **not interchangeable**.

## Supported by official public material

- Z.ai's chat agent UI visibly lists **Full-Stack** as a mode: https://chat.z.ai/?mode=agent . Z.ai's GLM-4.5 launch describes an agent-assisted full-stack site creation experience, frontend/backend/database capabilities, and iterative prompting: https://z.ai/blog/glm-4.5 . This is a description of product functionality, **not** proof of arbitrary shell access, worktrees, resumable external sessions, native four-way subagent fanout, or precise per-child token telemetry.
- ZCode Agent is Z.ai's coding environment and integrates workspace files, terminal, Git, browser interaction and long-horizon execution: https://zcode.z.ai/en/docs/welcome . ZCode documentation states a built-in `general-purpose` subagent receives its **own isolated context** and can use tools, and `Explore` is read-only. Multiple foreground subagents can run in parallel. Background subagents are supported; custom subagents are beta/user-level and **cannot spawn subagents** themselves: https://zcode.z.ai/en/docs/subagents . Therefore the controller must spawn the four workers directly rather than asking a subagent to recurse.
- ZCode Usage Stats include local app token breakdown and Coding Plan quota/model usage, but public docs do not demonstrate round/arm/child-cost event attribution out of the box: https://zcode.z.ai/en/docs/usage-stats . Treat dashboard totals as corroboration, not a replacement for our ledger.
- ZCode automatic context compaction reserves output/buffer, so a nominal 1M context may compact around 966K tokens. The context meter breakdown may be locally estimated and differ from totals: https://zcode.z.ai/en/docs/configuration . `/compact` is an explicit command, not evidence of a controllable flush API: https://zcode.z.ai/en/docs/commands .
- ZCode can use built-in browser automation for UI workflows and screenshot-based verification: https://zcode.z.ai/en/docs/browser-use . Browser use is not proof that a backend agent actually performed independent execution.
- ZCode Goal Mode can continue multi-round work within budget bounds, but is not an isolated competition controller by itself: https://zcode.z.ai/en/docs/goal .

## Unverified for hosted Z.ai Full-Stack

Whether a Full-Stack project exports a complete repository with Git history; whether it permits multiple separately running AI tasks; whether those tasks have independent contexts/sessions/permissions; whether it can create multiple actual worktrees; whether token usage is exposed per API call; whether model sessions support resume, fork, prompt caching or state reconstitution; whether it can run unattended benchmark batches; whether its database persists across platform restarts; and whether it has enough compute/runtime resources to support four concurrent sandboxes. **Each is a probe, not an assumption.**

Do not infer functionality from a marketing phrase such as “full stack,” from screenshots, or from an unrelated package. An npm package named `z-ai-web-dev-sdk` exists, but its existence does not establish the hosted web agent's runtime privileges, telemetry, or task fan-out: https://www.npmjs.com/package/z-ai-web-dev-sdk . Validate installed packages and any credentials handling rather than blindly installing or relying on community-sourced snippets.

## Recommended two-plane architecture

**Presentation/control plane:** hosted Z.ai Full-Stack, *if available*, builds the dashboard, workflow screens, documentation browser and live proof views. **Experiment execution plane:** use the same hosted environment only when it proves separate subagent contexts, writable isolation, terminal/test execution and token accounting. Otherwise integrate a local verified ZCode/CLI runner through an explicitly documented transport and permissions boundary; verify it before asserting it exists. A cockpit that cannot dispatch live execution must report **OBSERVE ONLY**.

## Mandatory capability census: results must be demonstrated

Assess repo import/export; unrestricted read/write of a dedicated lab folder; ability to run tests and a local server; Git support; process-level isolation and worktrees; simultaneous four sessions; independent subagent IDs and transcripts; permission controls and read-only Elephant mode; live streaming status; cancellation; resume/rotation; usage counters; provider quotas; restart persistence; and artifact export. Each row requires **PROVEN / LIMITED / UNAVAILABLE / UNKNOWN**, direct proof link, observation time, version, and fallback. Protect all credentials; do not display them or write them into logs.

## First selection gate

- If four isolated model-driven workers, real writable worktrees and instrumented run evidence are **PROVEN** in hosted Full-Stack, run the entire laboratory there.
- If full-stack UI is proven but any required execution property is missing, use the hosted experience for UI and an external verified executor for real experiments.
- If the hosted mode cannot persist or export its own source/evidence, create the portable local laboratory first, and treat hosted UI as optional.
- If even local runner/session isolation cannot be proven, stop after Round 0 and publish the blocked capability report; do not synthesize imaginary experiments.
