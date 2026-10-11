# 04 — Autonomous Workflow, Tool and Protocol Evolution

**This is a mandate to experiment and invent infrastructure**, not merely permission to adjust prompts. The lab's first-order objective is to improve the speed, cost, quality, fidelity and reliability of its own Elephant-enabled product development process while delivering validated product milestones.

## Incentive and operating loop

Every significant delay, repeated confusion, stale mental-model failure, harvest miss, conflicting ownership claim, invalid citation, context rebuild, worker overreach, failed review and product defect may open a **Friction Signal**:

`observed_event -> attributed friction + baseline -> concrete improvement hypothesis -> smallest candidate tool/protocol -> offline microbenchmark -> controlled real-task trial -> independent scoring -> pack publication -> retain / revise / retire`.

A candidate tool is not approved merely because it has code and unit tests. It must improve **net verified product throughput** or a recognized hard correctness/reliability constraint after including training, compute, tokens, maintenance, setup and failure recovery. Publish negative and ambiguous results.

The controller is free to build utilities, CLIs, adapters, schemas, schedulers, profilers, interactive diagnostics, semantic indexes, context-pack compilers, cache layers and protocol revisions. No particular framework or language is imposed. Reuse mature local/GitHub tools when they outperform custom code; benchmark their limitations. No automatic updates to authentication, model/provider accounts or live effect policy.

## Hypothesis discovery areas (not an obligatory product backlog)

**Allocation and source intelligence**
- Deterministic file inventory; AST/symbol extractor; co-change/dependency graph; concept-cluster allocation; primary owner + counted overlapping contract mirrors; per-file complexity/cost estimator; automatic partition rebalance; conflict hotspot detector; source/negative-knowledge coverage verifier.
- Experiment with file-locality vs functional ownership vs anticipated-demand partitioning. Evaluate retrieval/recall cross-domain, duplicate token expense and cross-Elephant traffic.

**Context ingress and egress**
- Hash-validating incremental reader; token-aware ordered pack compiler; file priority scheduler; calibrated context occupancy and hidden-window uncertainty; source-to-fact distiller; variable-fidelity context packets; just-in-time evidence snippets; validated compressed memory notes; delta epochs; prefix-cache adapter; resumable ingestion; background index builder; rebuild and rotation protocol.
- Compare verbatim resident source vs AST+hot snippets vs tiered storage vs reconstructable prefix. Transport ingestion receipts never count as cognitive understanding.

**Inter-Elephant protocols**
- Source-epoch aware ECP requests; bounded peer consultation, multi-hop budget/fanout/deadlines, request dedupe, disagreement packets and falsifiers, subscription to changed contracts, short semantic artifact exchange vs transcript exchange, issue-on-demand broadcast, congestion-aware routing, backpressure and multi-round protocol optimization.
- Treat messages as typed evidence with causal chain, not instructions to override charter. Measure false shared assumptions and unsupported peer claims.

**Product-model fidelity and narrow coding**
- Product Model Revision compiler; worker task slicer; source-symbol impact detector; generated allowlist and lease checker; conformance oracle; preflight contract simulator; stale-basis detector; automatic tests-from-declarations; trace->fixture and failure minimizer; independent source/Elephant disagreement report; safe rollback and merge evidence assembler.
- Compare helpful code suggestions against contamination of resident product Elephants. Source/test evidence still outranks Elephant text.

**Semantic library and product crosslinks**
- Historical semantic extractor, ontology matcher, contradictory-lineage preserver, provenance and maturity scorer, corpus-level knowledge coverage tests, source-native Reflection exporter, contextual query retrieval, symbol family/frame test generator, negative-intent falsifier miner, visual/Wiki projection smoke tests, product-gap-to-harvest request synthesizer.

**Observability and reliability**
- End-to-end request journaling, queue telemetry, throughput dashboard, cold rebuild tester, chaos/fault harness, session-loss drills, token cost normalization, semantic fidelity probe, reproducible experiments, tamper checks and pack portfolio exporter.

## Research freedom and protection against tool overbuild

No fixed final subsystem list: the categories above are opportunity spaces. A new tool starts as an independently disposable candidate. The controller may choose different candidates entirely. The lab should record an explicit *build-or-reuse* decision and forecast payback across remaining round(s) / future workloads before spending significant effort.

Suggested experiment budget policy: protect the current product's critical path; reserve **some measured capacity** each round for method improvements; dynamically increase only where objective friction measurements support payback. Avoid requiring a new tool every round or prescribing a fixed percentage. A candidate can be rejected early if a simpler script or protocol change solves the same problem.

Short-lived experimentation worktrees are allowed; no standing worker-owned product branches. Protocol changes are versioned and negotiated; incompatible ECP changes use adapter tests and do not silently break live Elephants. The shared product `main` changes only after independent verification and authorized integration.

## Four test stages for every candidate pack

1. **Local correctness:** deterministic fixtures, input/output boundaries, permission enforcement, tamper and negative controls.
2. **Reproducible microbenchmark:** frozen source, task and budgets; compare against simple existing mechanism; repeat enough to expose variability.
3. **Representative end-to-end test:** real narrowly scoped product/harvest task, actual Elephant model/context and independent judge; test source freshness and accepted outcome, not just speed.
4. **Survival and transfer:** run with source epoch changes, lost sessions, slow/failed peer, independent clean-room consumer; record setup cost and recovery time.

Status flow `DISCOVERED -> PROTOTYPED -> BENCHMARKED -> INTEGRATED_TRIAL -> VERIFIED_FOR_SCOPE / REJECTED / PAUSED / SUPERSEDED`. Every status publishes an actual pack, not just an empty title; claim certainty is separate from status.

## Concrete friction-to-tool examples

- Product Elephants repeatedly request the same historical symbol rules. Candidate: `historical-semantic-query-cache` with source basis + changed-file invalidation. Test cache hit latency AND stale-citation rate.
- Workers frequently make edits inconsistent with a Product Elephant's assumptions. Candidate: `product-model-to-task-packet-compiler` plus a strict preflight conformance suite. Measure rejected incorrect edits and net latency, not number of generated packet fields.
- One harvest Elephant spends most of its time forwarding source to another. Candidate: dependency-aware partitioner or shared cold contract cache. Test less duplication with no missed cross-domain dependencies.
- Post-merge code changes silently invalidate Wiki answers. Candidate: Reflection coverage and epoch invalidator. Test whether changed command fields cause updated source-backed Wiki responses.
- A context session becomes bloated and stale. Candidate: incremental delta + rotation comparator. Test fidelity and recovery versus full rebuild.

## Per-turn mandatory publication

At the end of **every top-level development turn and every experiment round**, publish the complete versioned portfolio of tool/protocol/corpus/semantic/product candidate packs, including untouched, partial, failing, blocked and retired packs, with real material and verifiable links. Child agents return evidence deltas to parent. An empty-work turn still publishes an honest heartbeat. Export failure marks the turn UNPUBLISHED/BLOCKED. Publishing a pack never certifies its quality. This preserves VOMEGA's existing `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md`.
