# Ecosystem protocol and framework radar
Research snapshot 2026-10-11. Verify exact installed versions and API signatures at experiment time. These are candidates, **not approved dependencies**.

## Key architectural boundaries
A2A and MCP are not rivals for the same interface: A2A specializes in **agent-to-agent** task communication and artifact exchange; MCP focuses on **model-to-tools/data** capabilities. ACP (Agent Client Protocol) addresses editor-to-agent integration. AG-UI streams agent-user interaction into the frontend. OpenTelemetry exposes instrumented operations and usage. LangGraph/Temporal manage workflow state and durability, which is **not** the same as preserving effective model context.

| Candidate | Potential Elephant benefit | Critical limitation to test | Minimal experimental comparison | Official upstream |
| --- | --- | --- | --- | --- |
| A2A (Agent2Agent) | Agent discovery, task state, messages, file/data parts, artifacts, streaming and push | Cannot itself verify distinct hidden LLM sessions, Git epoch truth or token meters | ECP request/task/response mapping vs native local bus, with retry/cancel/latency and artifact provenance | https://a2a-protocol.org/latest/specification/ |
| MCP | Tool schemas, resource access, standard Elephant consult/status/review entry points | Does not itself guarantee Elephant residency or cross-node correctness | ECP-consult-as-tool vs direct local call; explicit schema validation and auth | https://blog.modelcontextprotocol.io/posts/2026-07-28/ |
| ACP (Agent Client Protocol) | IDE/client integration to coding agents | Not agent-to-agent consultation protocol | CLI worker vs ACP-compatible editor dispatch with worktree IDs and explicit approval | https://github.com/agentclientprotocol/agent-client-protocol |
| AG-UI | Structured streaming of tool, run, state and subagent events to live cockpit | Real UI events cannot substitute for real child runs | Native event frontend vs AG-UI adapter across actual model/tool events | https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/concepts/events.mdx |
| OpenTelemetry GenAI | Traces, parent-child spans, model operation and token usage semantics | Provider may omit tokens; field stability/version must be verified | Native ledger vs OTel GenAI emitted spans, cache/reasoning subsets, retry reconciliation | https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-token-metrics.md |
| LangGraph | Checkpoints, thread-scoped durable execution state and stores | Workflow checkpoint is not a guarantee of semantically valid refreshed model context | Forced crash / restore vs minimal native reconstructor | https://docs.langchain.com/oss/python/langgraph/persistence |
| Temporal | Durable workflow event history, retries, replay, long-running jobs | Extra service/runtime and idempotence obligations may outweigh benefit | Mid-flight crash/restart/retry vs persisted local queue with same idempotent effect test | https://docs.temporal.io/ |

Official A2A latest specification references release **1.0.0** as of this research; older 0.3.0 search results may mislead. MCP had a major **2026-07-28** specification with stateless-core evolution, so do not assume old MCP session behavior. OpenTelemetry GenAI specifications indicate some conventions remain in development; freeze exact metric fields to upstream version and do not sum subset counters into totals twice.

## Required tool experiment card
Every proposed adoption records:
1. The **measured pain point**, existing native approach and why this tool might help.
2. Primary official docs URL, spec/SDK version, last-checked date, license, maintenance and security status.
3. Exact protocol boundary and custom ECP features that **must remain custom**.
4. The environment/test harness/proven local availability, install time, dependencies, running services and platform constraints (especially Windows).
5. Two independent isolated trials when a combination is evaluated; for a given trial, same fixture and native control, model and token/latency budgets.
6. An adversarial condition: duplicate events, cancellation, stale epoch, schema mismatch, broken auth, lost token report, disconnection, incompatible version or hard context reset.
7. Quantitative engineering savings net of all integration/refresh/recovery/cold-start/maintenance overhead; accepted-output quality must not fall.
8. Clear ADOPT / ADAPT / REJECT / DEFER decision with source/test evidence and reversible migration steps.

## Suggested progression
R1 C1 tests **A2A minimal adapter versus local ECP protocol**; R1 C2 tests **OpenTelemetry GenAI versus native token ledger**, adding MCP exposure as a separately evidenced bonus. After A/B R1 closes, C R2 evaluates what truly hurts (possibly MCP, LangGraph checkpoint/recovery or AG-UI). Temporal only if long-running reliability and restart failure are empirically important. ACP only if editor/coding-agent integration is a measured bottleneck.

The best solution may combine **A2A at remote-agent boundary + MCP at tool boundary + ECP-specific source/epoch semantics** without installing any full agent orchestration framework.
