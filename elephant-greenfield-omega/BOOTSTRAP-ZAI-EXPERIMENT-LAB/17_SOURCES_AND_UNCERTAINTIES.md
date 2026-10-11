# Research Sources, Claims and Uncertainties

**Checked:** 2026-10-11. Prioritize official documentation and direct runtime proofs over videos, marketing and third-party claims. This file states bounded public claims, not account-specific entitlements.

## Z.ai hosted full-stack

- Z.ai agent entry shows a **Full-Stack** mode: https://chat.z.ai/?mode=agent . Official description of full-stack coding agent and its frontend/backend/database ambitions: https://z.ai/blog/glm-4.5 . **Not established by these pages:** direct Git worktree APIs, true separate autonomous child runtimes, per-child tokens, persistent 1M session allocation, arbitrary shell, four-way parallelism, source export, or automatic long-term experiment orchestration in hosted Full-Stack.
- Z.ai API platform: https://z.ai/model-api . Existence of an API product is not proof that hosted Full-Stack’s private runner is programmable through that API or that a selected billing plan exposes all required event fields.
- `z-ai-web-dev-sdk` npm package: https://www.npmjs.com/package/z-ai-web-dev-sdk . Package existence and API wrappers must not be conflated with built-in hosting infrastructure. Assess current code, provenance, package license and supported use before choosing it.

## ZCode: known first-party capabilities

- ZCode general introduction / long-horizon engineering: https://zcode.z.ai/en/docs/welcome .
- Independent-context subagents, foreground/background behavior, beta custom agents, no subagent recursion, user-level definition caveats: https://zcode.z.ai/en/docs/subagents .
- App usage totals and Coding Plan model/quota statistics: https://zcode.z.ai/en/docs/usage-stats . These are **not assumed** to satisfy custom hierarchical per-arm event attribution.
- Context settings and early auto-compaction; local context meter is approximate: https://zcode.z.ai/en/docs/configuration .
- `/compact` availability: https://zcode.z.ai/en/docs/commands . Does not prove hard-flush semantics.
- Browser automation for frontend verification: https://zcode.z.ai/en/docs/browser-use .
- Goal mode and quota-bounded multiround execution: https://zcode.z.ai/en/docs/goal . Does not replace independent isolation, experiment pre-registration or external referee.
- ZCode open-source client/CLI repository: https://github.com/zai-org/ZCode . Prefer inspecting installed version and license before implementation. Documentation may evolve quickly.

## Other design lineage

- Existing VOMEGA archival hypothesis: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/seed-process/ELEPHANT-CONTEXT-NETWORK.md .
- Existing architecture plan: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/seed-process/ELEPHANT-CONTEXT-NETWORK-PLAN.md .
- Existing greenfield pack: https://github.com/owenservera/VOMEGA/tree/main/elephant-greenfield-omega . The old mock tests illustrate deterministic contracts; they do not prove live model execution.
- ZCode context/Orca archive: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/tooling/orca/CONTEXT-AND-ELEPHANTS.md .

## Remaining capability questions for the agent to answer with tests

1. Which concrete environment is available today: hosted Full-Stack, ZCode desktop, ZCode Web, API or external runner?
2. Can it spawn **four real independent child contexts** concurrently, preserve IDs and restrict writes?
3. Can it trace per-child/provider/token usage, not merely aggregate daily plan usage?
4. What exactly does its automatic compaction do to live session context, and can contexts be independently reconstructed?
5. Does a hosted project have durable filesystem, database, source export and Git operations?
6. Which provider/session fork/resume/cache operations are actually supported, and what do they cost?
7. How many concurrent calls/workspaces can current user entitlements tolerate before throttling?
8. Can a single seed mini-product be independently built/reviewed and fairly compared under E0/E1/E2?

Record direct response/artifact evidence before resolving these questions. A public website description is not a substitute for a live capability proof.
