# Operating process — current safe defaults

**Status:** revisable operating guidance under `.project/META-TRACKER.md`, not a permanent org chart.

## Roles are functions, not permanent actors

| Function | Current examples | Responsibility |
| --- | --- | --- |
| Product authority | Owen | Product-direction choices, auth/spend/irreversible decisions |
| Coordination | human, temporary agent, script, or other tool | Select next evidence-bearing work and resolve collisions |
| Daintree habitat | Daintree | Git worktrees, Review Hub, supported CLI-agent panels |
| ZCode habitat | ZCode | Independent ZCode sessions/workers; high-throughput work when useful |
| Direct worker | Claude / Codex / Grok / OpenCode / others | Bounded implementation/research/review |
| Truth surfaces | repo + tests/evidence + current STATUS | Durable state |

There is no required Grok Bot Chief-of-Staff role. Grok Bots may be used as a thin control plane when useful/available, but the project must not depend on them.

**Daintree does not launch, supervise or manage ZCode.**

## Constitutional/process boundaries

- Preserve explicit product invariants and evidence distinctions.
- Do not mutate auth/credentials/provider wiring as an incidental setup step.
- Fixture/simulated evidence is never reported as live.
- Repository/evidence state outranks agent self-report.
- Irreversible, security/privacy, spend and product-authority choices escalate to Owen.

## Current efficiency defaults

These are defaults, not laws:

1. Prefer bounded tasks with clear evidence/stop conditions.
2. Persist useful context in repo artifacts rather than depending on one session.
3. Use disposable worktrees when concurrent writers would otherwise collide.
4. Use the cheapest/most abundant adequate worker; escalate scarce models where expected value is high.
5. For consequential changes, prefer an independent challenge/review. Cross-provider review is useful when it adds real independence, not as ceremony.
6. Retire coordination machinery that does not improve validated progress.

## HARNESS ≠ ROUTER ≠ MODEL ≠ ACCOUNT

Record all four when observable. If a router hides the underlying model, write `router-selected/unknown`. Never guess.

No model family permanently owns a workstream.

## Isolation and integration

Current safe pattern:

- one claimed writer for a shared contract at a time;
- independent tasks may use separate disposable worktrees;
- main remains the durable integration branch;
- tests/evidence follow the claim being made, not a universal ritual.

## Runtime state

`.project/agentic-launch/STATUS.md` records current launch state when that overlay is in use.

On claim, record enough to avoid collisions. On completion, record the concrete artifact/commit, evidence, residual risks and downstream trigger.

Do not infer that a lane, worker, Daintree panel, ZCode session or bot is alive merely because a document names it.

## When to escalate to Owen

- destructive/irreversible action;
- credential/auth mutation;
- spend/subscription change;
- material security/privacy tradeoff;
- product-authority choice that evidence alone cannot resolve.
