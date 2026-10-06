# Harness and routing design

**Status:** current inventory + conversation-derived routing policy. No harness is permanently assigned to a workstream.

## 1. Worker pool

The execution pool must include:

- **ZCode**
- **OpenCode**
- **Codex**
- **Grok Build**
- **Claude Code**

They are not interchangeable labels for the same thing. Each may expose different agent behavior, context, tools, permissions, session models, model routes and cost/usage constraints.

## 2. Current evidenced/configured facts

From existing VOMEGA machine documentation:

- Windows has ZCode installed and a bundled CLI available through Node.
- A prior Windows launch observed at least six bounded ZCode workers on `openrouter/auto`.
- Five lanes are configured: Owen, OpenCode acct 2, OpenCode acct 3, OpenCode acct 4 and OpenCode acct 5.
- Each configured lane has Space Bunny Free enabled with a configured 1,048,576-context window.
- Those five lanes were not individually proven as five simultaneous live routes.
- Claude Code, Codex and Grok Build have been observed in the development environments recorded in `../ENVIRONMENT.md` and `../dev-machine/HARNESS-MATRIX.md`.
- OpenCode is also part of the recorded tool pool.
- Authentication/provider/model configuration is read-only unless explicitly changed by Owen.

These facts should be re-probed at Orca bootstrap time rather than assumed fresh forever.

## 3. Routing dimensions

A coordinator/router should select capacity using observable dimensions such as:

| Dimension | Question |
| --- | --- |
| Capability | Can this harness perform the required tool/action pattern? |
| Context | How much repository/domain context is required? |
| Consequence | How costly is a wrong change? |
| Independence | Would a second provider/harness materially improve review? |
| Availability | Is the harness/account currently usable? |
| Capacity | How many bounded workers can actually complete probes now? |
| Cost | Can abundant/free capacity do the work adequately? |
| Latency | Is fast turnaround more valuable than maximum depth? |
| Write collision | Does this task require isolated worktree ownership? |
| Evidence need | What test/observation must the worker be able to produce? |
| Observed performance | Which harness has actually performed best for this task class? |

## 4. Initial priors, not fixed assignments

Conversation-derived starting priors:

| Harness | Initial use hypothesis |
| --- | --- |
| ZCode | complex autonomous/team workflows, sessions/subagents, broad project tasks |
| OpenCode | abundant general worker capacity, repetitive implementation/research/test/docs |
| Codex | precision implementation, debugging, refactors, technical escalation |
| Claude Code | architecture-sensitive analysis, implementation and independent critique |
| Grok Build | additional autonomous implementation/research/review capacity and independent second path |

These are hypotheses to measure. The system should be allowed to discover that a different harness wins for a task category.

## 5. Capacity model

Do not model the machine as “five workers”.

A better abstraction is:

```text
CAPACITY POOL
├── configured OpenCode/Space Bunny lanes
│   ├── Owen
│   ├── acct 2
│   ├── acct 3
│   ├── acct 4
│   └── acct 5
├── ZCode runtime/session capacity
├── Codex capacity
├── Claude Code capacity
├── Grok Build capacity
└── future/other validated harnesses
```

Accounts are scheduling resources, not identities of departments.

## 6. Frontier escalation

Use the cheapest/most abundant adequate route first.

Escalate when one or more are true:
- repeated bounded failure;
- architectural consequence is high;
- subtle debugging exceeds lower-tier performance;
- an independent frontier review has high expected value;
- context/analysis demand exceeds the current route;
- user explicitly asks for a scarce/frontier model.

Do not auto-spend merely because a frontier route exists.

## 7. Runtime record

Where observable, a task/run record should distinguish:

```text
task_id
role
harness
router
provider
account
model
session
worktree
branch
context_bundle
started_at
ended_at
outcome
evidence_refs
review_refs
```

Unknown values remain unknown. If a router hides the model, record `router-selected/unknown`.

## 8. What Orca must not do

Orca integration must not:
- rewrite existing account credentials;
- normalize all harnesses to a lowest-common-denominator workflow;
- hide which harness/account/model actually performed a task when observable;
- make model selection an Orca-only opaque decision without evidence/logging;
- reserve the five configured accounts as permanent long-lived worker identities;
- infer capacity from configuration alone.
