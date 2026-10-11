# Source anchors and live-compatibility notes (checked 2026-10-11)

## Historical VOMEGA Elephant origin

- Archived concept: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/seed-process/ELEPHANT-CONTEXT-NETWORK.md
- Archived implementation experiment: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/seed-process/ELEPHANT-CONTEXT-NETWORK-PLAN.md
- Orca integration: https://github.com/owenservera/VOMEGA/blob/main/.project/archive/2026-10-06/tooling/orca/CONTEXT-AND-ELEPHANTS.md
- MP-66 design map: https://github.com/owenservera/VOMEGA/blob/main/.project/pm/portfolio-analysis/DESIGN-CYCLE-MAP.md
- PM anti-overengineering policy: https://github.com/owenservera/VOMEGA/blob/main/.project/pm/EVOLUTION-RULES.md

The original October 5 plan records: no Elephant active/instantiated; full source residency, topology, provider/model, context refresh and schema were hypotheses. This pack similarly makes no claims of live setup.

## External standards and mechanics

- Git worktrees (official): https://git-scm.com/docs/git-worktree — linked worktrees enable isolated task source checkout, branch distinction and cleanup. This pack still prefers a single main per experiment arm.
- Agent Client Protocol overview (up-to-date source; inspect version): https://github.com/agentclientprotocol/agent-client-protocol/blob/main/docs/protocol/v2/overview.mdx — JSON-RPC2 communication; session/new, session/resume, session/prompt and streaming notifications for the **external agent client protocol**, NOT an ECP API.
- Agent Client Protocol schema: https://github.com/agentclientprotocol/agent-client-protocol/blob/main/docs/protocol/v2/schema.mdx — check actual adapter version negotiation and capabilities, never assume every harness supports every optional method.
- MCP specification: https://modelcontextprotocol.io/specification — optional tools/resources transport, not a substitute for Elephant freshness policy.

## Capability warnings

Provider CLI commands, headless session continuity, fork, prompt caching, read-only mode, rates and usable model context windows change over time and must be re-probed locally before use. The code in `tools/ecp` is **mock-only**. External product/browser service names in historical VOMEGA artifacts are not evidence of functioning account integrations in the new experiment.
