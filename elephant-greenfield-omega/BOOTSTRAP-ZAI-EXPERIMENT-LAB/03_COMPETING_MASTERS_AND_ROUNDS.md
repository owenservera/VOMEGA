# Dual-Master Competition and Four-Arm Research Engine

## Non-negotiable topology

There is one coordinating experiment controller, two persistent **master approaches**, at least four context-isolated experiment executors per round (normally A1, A2, B1, B2), and an independent evaluator. A master is a *candidate architecture and its living strategy*; it is not an Elephant. A master retains lineage and code/interface evolution, while experimental workers receive bounded context and run in separate workspaces/sessions.

Master A starts with a **resident-first cognitive service**: durable domain manifests, long-lived context, carefully isolated transactions, quick contextual consultation and deliberate refresh. Master B starts with a **rebuildable/context-bundle-first service**: stateless/ephemeral sessions or prefixed contexts, strong deterministic retrieval/epoch rules, aggressive context economy and repeatable reconstruction. Both must implement the same externally visible ECP operations and the same greenfield product task contracts. Their internal design may diverge substantially; neither is permanently favored.

## Every round: minimum viable fan-out

- A1 and A2 test distinct, explicitly predeclared theories under Master A. B1 and B2 do the same under Master B. More arms are allowed; fewer than four **real, attributable execution attempts** fails the round requirement. If any arm cannot be started, record it as BLOCKED and do not report the round as complete.
- Each arm gets its own task/session identity, clean context boundary, writable disposable worktree or equivalent isolated sandbox, frozen baseline commit, provider/model attribution where available and resource budget. Initial tasks and scoring criteria are fixed before outcomes are visible.
- Start arms concurrently when verified substrate concurrency is available. Preserve start/stop overlap evidence; a sequential execution of four independent sessions can inform correctness but **does not prove parallel fan-out**.
- A common blinded evaluator checks outputs using deterministic test results, independently reproduced behaviors, provenance and predeclared scoring. Masters do not grade their own arms.
- Immediately after grading, Master A and Master B **independently** receive the same results, separately rank the four experiments, choose accepted mechanisms and reject unsafe or uneconomic ones, explain why, and produce their own next executable candidate. Only then exchange cross-master critiques; neither is allowed to simply copy the other's entire design.
- Preserve two current, runnable approach implementations, two decision histories, and two distinct research priorities at close. Store candidate implementations/components in a shared repository with paths/namespaces rather than permanent owned branches; use ephemeral branches/worktrees only for experiment tasks.

## Per-round clocks and checkpoints

**1. Hypothesis registration:** each master supplies its two competing variations and expected effects; the controller freezes conditions, budget, seed and benchmarks. **2. Isolation proof:** launch four separately identified contexts and verify read/write boundaries. **3. Actual execution:** source modifications, real model/tool use, tests, trace and metering. **4. Adversarial evaluation:** verify behavior on withheld challenges and inspect falsifiers. **5. Independent master assimilation:** A chooses and collapses A's learnings into A-next; B separately chooses and collapses B's learnings into B-next. **6. Cross-pollination:** masters may adopt only individual reproducible mechanisms with provenance; avoid full homogenization. **7. Consolidate:** one integration authority merges accepted common utilities and both current variants onto main with traceable artifact IDs. **8. Next round:** record at least four concrete new experiments and exactly what uncertainty each resolves.

## Avoiding fake diversity

Independent contexts must not see each other's confidential prompts or current code before evaluation. Vary mechanisms, not decorative agent titles. Minimum experiment variation each round should include a persistence/flush theory, a routing/consultation theory, an observability or cost theory, and a failure/verification theory; these may be assigned differently to A/B. At least one challenger arm should seriously attempt to falsify a presumed Elephant benefit or advocate simpler E0 behavior.

The master strategies must remain genuinely competing: preserve different implementations, failure modes, resource budgets, and theoretical positions. Both are permitted to conclude that no Elephant is economically justified for a task category. Maintain a pairwise learning matrix per round: adopted by A, adopted by B, rejected by A, rejected by B, and still unresolved.

## Controls for fair comparisons

For direct E0/E1/E2 comparisons, keep task cards, source baseline, tests, environment, model class and time budget as equal as possible. When the exact same task is reused, account for evaluator and agent contamination; rotate task variants and use blinded holdouts. Record model mismatches and provider quota effects. Measure bootstrap and refresh work rather than making Elephant setup free. A faster but less reliable arm loses quality-adjusted performance credit.

## Stop and failover behavior

If actual multi-agent execution cannot be proven on Z.ai Full-Stack, do not run staged simulations labeled real. Either move the execution plane to a verified local harness while keeping the webapp as UI, or end the round with the precise blocker and a recovery plan. Any unavailable Elephant should trigger an honestly labeled E0/context-bundle fallback; never hide a configuration mismatch as a successful Elephant answer. Keep maximum token/runtime/concurrency limits to avoid unbounded iteration.
