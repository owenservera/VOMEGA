# PASTE INTO CLAUDE — chief protocol architect / consistency specialist

You are the independent lead systems architect for a NEW GREENFIELD Ω experiment. There are NO live Elephants yet, and you must not claim there are. Do not reconstruct the old VOMEGA or propose a broad multi-year platform. Design an implementable **zero to two concurrent Elephant** cognitive protocol from first principles, using the attached charter, product brief, existing ECP draft, and historical inspiration as hypotheses to critique. Your response competes independently with Codex, ZCode, OpenCode and Grok designs; do not seek or read their solutions on first pass.

**Hypothesis to test:** maintained high-context AI cognition can improve validated development speed by allowing workers to consult deep domain models rather than each rebuilding project knowledge. A long chat is not an Elephant unless it has source-basis manifests, lifecycle, protocol, policy, recovery, and measured utility. Start with E0 no Elephant, E1 one command/execution Elephant, E2 two complementary Elephants (command/contracts and execution/UI). All arms implement identical Prompt Fanout Mini: local Windows floating prompt input, target selection, deterministic preflight, fanout to three *mock* provider adapters, status transparency, cancellation, retries, events and tests. No external browser sign-in automation or provider response ingestion in v0.

## Your mandate

Take the strongest architectural position **and challenge our assumptions**. Design how 0/1/2 nodes operate including: sources and authority; synchronous and asynchronous worker messaging; cross-Elephant reasoning; dynamic domain overlap; source basis, snapshot epochs, invalidation and mixed-epoch consistency; resident/wave/transaction context isolation; exact flush vs rotation semantics; recovery from lost provider sessions; code-generation vs direct-write boundaries; artifact submission and proof; resource accounting; cycle prevention; queueing, cancellation and timeouts. Be rigorous about model context being opaque. If a proposed flush cannot erase earlier hidden turns, label it non-guaranteed and specify a rebuild/fork alternative. Treat all model output as advisory, even when persuasive.

**Do not merely restate the supplied ECP design.** Improve, replace or delete mechanisms where you can justify it. Name at least 12 architectural decisions with alternatives and measurable consequences. Formalize the state machine and invariants. Give sequence diagrams or textual event traces for E0 normal, E1 review, E2 conflicting reviews, E2 node crash, epoch change while a request is in flight, and patch-proposal acceptance. Define what must be atomic vs what may be eventually consistent.

## Minimum deliverables

1. `ARCHITECTURE.md`: role and authority model, components, exact E0/E1/E2 topologies, lifecycle and all message flows.
2. `ECP_SPEC.md`: versioned request/response grammar; ids; idempotency; epoch; payload/citation; status; error; cancellation; provenance; validation semantics.
3. `FLUSH_RECOVERY.md`: algorithms for boot, calibrate, reconcile, flush, rotate, fork, rebuild, and loss recovery; realistic handling where provider APIs lack capabilities.
4. `WRITING_AND_TRUTH.md`: worktree ownership, code-generation proposal mode, author/reviewer separation, integration semantics and human control.
5. `FAULT_MATRIX.md`: at least 20 edge cases, expected response and test oracle.
6. `TRADEOFFS.md`: contrast minimal script/file transport vs ACP/MCP/local service without silently choosing the most elaborate.
7. `EXPERIMENT.md`: baselines against direct source retrieval, identical one-shot pack, context bundles and source/static tests; primary acceptance metrics and falsifiers.
8. `INVENTION_CANDIDATES.md`: mechanisms that *might* be novel, precise algorithms, differentiators, probable prior-art families, and experiments demonstrating distinct technical effect; do not assert patentability.
9. `BUILD_SEQUENCE.md`: actual shortest 0→E0→E1→E2 Windows implementation with estimates, gates, exact command verification points; identify smallest demonstrator that is useful even if E2 loses.
10. `SELF_CRITIQUE.md`: the strongest argument that Elephants are unnecessary and the smallest test that could prove you wrong.

Require machine-verifiable acceptance tests. Make clear where design stops and implementation begins. The source repo and test results remain authority, not any model session. No arbitrary mutation of credentials. Avoid permanent branches. Use distinct task worktrees only. Declare assumptions where available CLI capabilities are unverified. If coding is available, implement the smallest durable adapter-neutral kernel with automated fault tests in an isolated workspace, rather than creating a thousand lines of boilerplate. Save output in `outputs/claude/` and follow `prompts/RESPONSE_CONTRACT.md` if files are available.
