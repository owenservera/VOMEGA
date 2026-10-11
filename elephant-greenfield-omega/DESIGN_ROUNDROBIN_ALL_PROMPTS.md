# All independent launch prompts — Greenfield Ω Elephant trial

Issue one model-specific brief per first-pass session. Keep submissions blind until judge round.

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


---

# PASTE INTO CODEX — executable protocol engineer

You are building the smallest RUNNABLE kernel for a **new greenfield Ω Elephant experiment**, E0=0, E1=1, E2=2 concurrent cognitive nodes. Do not edit the existing VOMEGA project or claim that any long-lived AI sessions are connected. Work in your own designated experiment branch/worktree. First inspect this pack: `01_MASTER_CHARTER.md`, `02_GREENFIELD_OMEGA_PRODUCT.md`, `protocol/*`, `tools/ecp/*` if present. You are a competing first-pass designer; do not read other providers' deliverables until synthesis.

Our hypothesis is that a source-grounded, persistent context specialist will improve measured development throughput compared with repeated source reconstruction. The real tiny Ω challenge is Windows-first local prompt fanout to three MOCK adapters, with command plan, accepted/failed/cancelled visual states, idempotency, restart evidence and tests; no real browser access or sign-in in v0. Compare identical E0/E1/E2 tasks from one common Git baseline.

**Prioritize executable contracts over architecture theater.** Produce a minimal Node.js/TypeScript or Rust kernel (choose by portability/fastest verified execution) with: versioned JSON envelopes; unique request IDs and stable idempotency keys; local event journal/replay; node registry 0-2; source SHA/manifests; mechanically computed staleness; per-node queue deadlines; lifecycle and partial failures; read-only Elephant adapter interface; fake session adapter; first real provider adapter seam but NO invented provider flags; context pack hashing and exclusions; transaction flush (true isolation or explicit rebuild), restart calibration; code proposal as text artifact, not direct main edit; falsifier tests including duplicate response, stale epoch, boundary mismatch and crash. Build one greenfield product feature that exercises these services.

Deliver a runnable `npm test` or `node --test` path, a demo CLI sequence and a clear file tree. Write at least one event trace for E0, E1 and E2. Simulate two Elephant services concurrently with delays and opposite opinions on a changed shared contract; assert that the coordinator returns separate claims and a disagreement record, never fabricated consensus. If it cannot enforce a claimed property at runtime, mark it `UNIMPLEMENTED` and write a failing or skipped test with rationale.

**Hard constraints:** no network calls without explicit permission, no account credential reads, no unapproved source modification, no fake 'production ready' claims. Do not rely on external dependencies unless demonstrably available; prefer standard library. No Elephants directly mutate code; optional patch proposal must be allowlisted, independently applied in worker worktree, tested, and reviewed by a separate identity. Source/testing/commit truth takes precedence over model output. Keep main consolidated; short-lived worktrees only.

Also provide (a) a decision log with alternative transports; (b) a reasoned protocol schema; (c) measurements for initial test harness; (d) proposed acceptance benchmark, including fresh one-shot same-pack control; (e) at least 10 testable invention candidate mechanisms and how prior art might defeat each; (f) precise missing substrate capabilities to probe on Windows. Output in `outputs/codex/`. Explain which existing code/tests were run with real output; do not claim a live provider model was used unless proven.


---

# PASTE INTO ZCODE — Windows operationalization / multi-session control

Act as the Windows-native operations lead for a NEW GREENFIELD Ω trial of zero→one→two simultaneous Elephant cognitive sessions. Start read-only: detect installed versions and actual help text of ZCode, OpenCode, Claude Code, Codex, Grok, Node/Bun/Git and related ACP/MCP support, if present. **Never print or overwrite provider credentials/auth configs.** Theoretical support does not equal tested support. This task is independent of other models' submissions.

The underlying Ω product test is a minimal floating Windows prompt box that prepares and fans out one prompt to three MOCK provider adapters, with real status feedback, cancellation, retries and deterministic test evidence. We must keep this product identical across E0 (direct worker/source only), E1 (one high-context Elephant) and E2 (two concurrent domain Elephants). The Elephant protocol must support worker↔Elephant query/review/patch-proposal; Elephant↔Elephant routed cross-domain review; epoch source validity; context flush/rotation/rebuild; failed sessions, stalled queues and fallback. True code writes occur only in worker-owned disposable Git worktrees; Elephant patches are candidate artifacts.

**Your specialty:** make the proposed system launchable, observable and recoverable on THIS Windows environment. Provide a truthful compatibility matrix for each installed harness: launch method, headless execution, session resume/fork, session IDs, isolation/read-only capability, prompt/reply interface, streaming, cancellability, context capacity/token usage (measured or unknown), auth-preserving behavior and model/provider availability. Probe with safe no-write tests only; reject a harness feature until verified. Design a common harness adapter that does not require shared CLI semantics. Prefer direct CLI/file/JSONL harness for proof before installing new coordination infrastructure.

Produce: `WINDOWS_CENSUS.md`, `ADAPTER_MATRIX.md`, `LAUNCH_PLAN.ps1` (idempotent, dry-run-first, safe paths), `RUNBOOK.md`, `SESSION_RESTART_PLAYBOOK.md`, `LOG_SCHEMA.json`, `E0_E1_E2_DEMO.md`, `FAILURE_DRILLS.md`, `MEASUREMENTS.md`, `COUNTERDESIGN.md`. Specify user-visible statuses for node booting, healthy, stale, flushing, waiting, throttled, unavailable, retired; how an operator sees who wrote code and which Elephant answered. Include example PowerShell invocation patterns **only after detecting actual installed CLI syntax**; otherwise mark them pseudocode.

Design file system roots, naming, local journals, backups/rotation, clean-up commands with preview, and how main remains untouched until reviewed integration. Model a boot crash, account rate limit and Windows restart mid-consult. Specify how to run one true Elephant session and then TWO simultaneously, and how to prove a session was reused rather than merely re-prompted with the same context. If the environment cannot support session persistence, offer cached-prefix/stateless alternative and mark comparison implications.

No unattended cross-account credential switching, no browser provider UI interaction in the first slice, no permanent workstream branches. Optimize for rapid validated product progress, not dozens of daemons. Save deliverables to `outputs/zcode/`. Include explicit STOP points and minimum viable first proof.


---

# PASTE INTO OPENCODE — transport, routing, context-economics designer

You are an independent engineer designing a **greenfield** Elephant communication and economics layer for Ω. There is no existing live ECP. The study compares E0 conventional development, E1 with one resident cognitive node, and E2 with two concurrent complementary cognitive nodes. Use the identical Prompt Fanout Mini scope in `02_GREENFIELD_OMEGA_PRODUCT.md`: Windows-first prompt input and three LOCAL MOCK provider targets, event status, retry, cancellation and visual interpretability. No real browser-provider automation, credentials or response ingestion in v0. Do not read other session submissions before producing your design.

**Optimize for lowest coordination and context cost while preserving accuracy.** Challenge the claim that giant resident contexts are useful. Compare persistent session, stateless cached prefix, retrieval+fresh reasoning, deterministic source graph, compact context bundle, and hybrid forms. Distinguish long-context window from actual retained attention/quality. Propose a quantitative decision model for routing a request to direct source lookup, E1/E2, both nodes or a cheaper bundle using domain match, freshness, queue, expected utility and deadline. Design backend-agnostic envelopes, event streams and adapters; differentiate ECP from external Agent Client Protocol and Model Context Protocol.

Implement or specify a traceable E0/E1/E2 local protocol demo with durable journal, basis stamp, deterministic route decisions, request dedupe, cancellation, timeout/fallback, two-node disagreement output and context rebuild. Every Elephant is read-only by default. Optional code generation is a patch artifact routed to worker-owned worktree and independent review.

Deliver in `outputs/opencode/`: `ECP_TRANSPORT_OPTIONS.md`, `ROUTER_ALGORITHM.md` (formulas/pseudocode, adversarial routing cases), `CONTEXT_ECONOMICS.md` (break-even and caching models, wall time/tokens), `STATEFUL_VS_STATELESS.md`, `ADAPTER_DISCOVERY.md`, `BUDGETED_TEST_PLAN.md`, `MINIMAL_IMPLEMENTATION.md`, `NOVELTY_HYPOTHESES.md`, `SELF_FALSIFIER.md` and one runnable proof if tools allow. Include operational preconditions specific to installed OpenCode version detected from local help, not invented flags or models.

Quantify extra orchestration cost; state unknown values as variables. Identify when E2 should intentionally lose to E0 and when a second Elephant should be retired, merged, or specialized. Show errors for stale epoch, prompt injection through artifacts, dead sessions, mismatched domains and simultaneous requests. Write exact acceptance predicates. Do not invent speedups, user data, model behavior, or patent claims.


---

# PASTE INTO GROK — independent adversarial inventor / simplification review

You are the deliberately adversarial fifth architect for a greenfield Ω cognitive-development experiment comparing E0=0, E1=1 and E2=2 simultaneous Elephants. Work independently; do not look at other designs before first submission. You are being asked to *invalidate weak assumptions* and create better options, not endorse Elephants.

An Elephant is a large-context session with rebuildable source pack, explicit Git basis, resident/wave/transaction context, versioned queries and finite fallback. Workers build a fixed local Windows-first Prompt Fanout Mini with three MOCK adapters, deterministic command parser, retries, cancellation, event stream and optional floating UI. E1 workers consult one Elephant; E2 workers can consult two domain Elephants; code edits belong in worker worktrees and source/tests decide truth.

Challenge 20 assumptions. Specifically attack: persistence superiority, model recall under long contexts, source freshness, context contamination, a second Elephant's value, apparent speedups created by unequal compute budgets, advice laundering, fake review independence, circular cross-node discussions, Git-delta misclassification, stale citations, API session continuity, transport fragility, risks to source confidentiality, and whether this is just named RAG or hierarchical agents.

Design an alternate minimal solution (perhaps zero Elephants + excellent context bundles and source-indexing), then design **one experiment that fairly pits it against E1/E2**. Include adversarial seeded-defect tasks and hidden challenge injections. Propose at least ten precise potentially inventive technical mechanisms but map each to likely known prior art (multi-agent orchestration, RAG, cache invalidation, distributed systems, event sourcing, versioned knowledge graphs, request routers, session summaries). Do not assert novelty before verification; suggest patent-search queries and concrete distinctive technical effects. Favor ideas that would survive even if persistent million-token sessions do not.

Deliver `KILL_SHOTS.md`, `ALTERNATE_ARCHITECTURE.md`, `FAULT_INJECTION_TESTS.md`, `RESEARCH_GAPS.md`, `NOVEL_IP_CANDIDATES.md`, `FAIR_TRIAL.md`, `REJECTION_CRITERIA.md`, `BEST_VIABLE_CORE.md` in `outputs/grok/`. Be explicit about falsifiers and what result would cause deletion of each layer. If coding tools are available, implement a counterexample fixture demonstrating stale hallucinated citation or misleading throughput. Never modify the shared main or credentials. Record which claims you actually proved.


---

# PASTE INTO INDEPENDENT JUDGE — cross-model design synthesis

You are the design judge for the GREENFIELD Ω Elephant experiment. You have the frozen original charter and five independent first-pass model submissions (Claude, Codex, ZCode, OpenCode, Grok). **Do not automatically pick the most elaborate or most unanimous design.** Record source attribution for each idea. Compare each submission against fixed E0/E1/E2 acceptance criteria and the local Windows tool inventory. Distinguish supported test results, design claims and speculation. Demand counterexamples before promoting any claim. Keep disagreements visible; do not synthesize incompatible contracts by averaging them.

Build: (1) one requirements/coverage table with all must-have interfaces and failure modes; (2) a decision matrix scoring clarity, smallest time to test, provider-neutrality, measurable performance, reconcilability, code-authority safety, context flush correctness, interoperability, operational burden, and innovation; (3) strongest elements from each model, credited; (4) unresolved contradictions and a discriminating experiment for each; (5) a **single minimal canonical v0.2** protocol, only when justified; (6) patch list for the supplied baseline pack; (7) first four product tasks and exact exit gates; (8) a compact prior-art investigation plan; (9) financial/token and timing estimates expressed as ranges/unknowns; (10) explicit instructions for stopping the Elephant effort if E0 wins.

After the first round, organize one adversarial debate with at most two counter-rounds, asking model specialists to attack proposed resolutions. Demand running evidence in final decision record. Do not deploy outside working folder, alter credentials or merge to main without authorized integrator. Return files under `outputs/judging/` and a go/no-go recommendation with reasons.
