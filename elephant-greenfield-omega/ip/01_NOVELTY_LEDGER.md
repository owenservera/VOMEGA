# Technical IP research ledger — hypotheses, NOT novelty or patent opinions

**Objective:** discover mechanisms with a concrete technical effect: fewer verified rebuilds, smaller context drift, lower token/time cost at equal quality, safer code transitions, cross-domain bug reduction. Patentability requires qualified legal counsel and prior-art search. Generic multi-agent discussion, RAG, caching, memory summaries, or Git diffs alone are unlikely to be novel.

| Candidate | Distinctive mechanism to investigate | Measurable technical effect | Probable prior art / risk |
|---|---|---|---|
| N01 Epoch-stamped cognition | Output stamp calculated externally from Git domain paths/ancestry and source manifest, attached to each model finding | stale-source detection recall | versioned retrieval, database MVCC, AI provenance |
| N02 Context causal invalidator | Dependency graph + changed-blob fingerprints choose nodes/knowledge claims for selective rebuild | refresh savings at equal recall | incremental build systems, cache invalidation |
| N03 Transaction pollution barrier | Fork resident context per request, isolate ephemeral artifacts, promote only verified commits/notes | lower long-context reasoning drift | session forks, cache prefixes, memory compaction |
| N04 Reproducible cognition capsule | Model-agnostic manifest+ordered pack+calibration protocol reconstitutes lost specialist session | recovery rate and calibration parity | reproducible builds, agent checkpoints |
| N05 Dynamic cognitive partitioner | Split/merge domains based on measured request graph, context quality, overlap and queue cost | validated throughput per occupied token | graph partitioning, load balancing, shard management |
| N06 Cross-node contradiction falsifier | Convert incompatible epoch-grounded assertions into executable source/test discriminators | bug-detection recall, time to resolve | debate agents, proof obligations, test generation |
| N07 Cognition-aware routing | Joint choose retrieve/context-pack/resident-node/two-node by expected verified benefit vs latency/freshness/occupancy | accepted-value per cost | multiarmed bandits, expert routing, RAG retrieval |
| N08 Evidence-gated memory promotion | Deterministic source-anchor validity predicate enforces survivability of notes across code changes | stale memory defects | provenance graphs, data lineage, guarded RAG |
| N09 Versioned patch escrow | Specialist candidate code is an immutable artifact bound to base SHA, file allowlist and independent verification before commit | unauthorized changes prevented | Git workflows, secure agent sandboxes |
| N10 Wave-latched cognition | Stable source epochs + batched reconciliation and predictive prefetch of selected changed domains | refresh overhead vs stale exposure | MVCC snapshots, incremental replication |
| N11 Context ROI accounting | Track avoided worker discovery, false positives and cached-prefix costs per cognitive domain | selection of economically worthwhile nodes | cost-based optimizers, inference routers |
| N12 Degraded cognitive topology | Explicit E2→E1→E0 fallback with claim provenance and test guarantees preserved | throughput under provider failures | fault-tolerant microservices, circuit breakers |
| N13 Relevance-reserve allocator | Optimize occupied domain tokens + transaction reserve based on measured accuracy vs pressure, not max occupancy | recall vs context budget | prompt optimization, memory allocation |
| N14 Worker-to-specialist service discovery | Structured request types tied to domain ownership, Git diffs and task intent | fewer irrelevant reads / questions | agent registries, expert systems |
| N15 Behavioral cognition calibration | Versioned benchmark suite tests actual retained source understanding after every rotation | silently corrupted memory detected | regression testing, model evals |

## Required research for each candidate

- Write a precise claim-style mechanism in steps with input/output/state, not marketing language.
- Search patents, papers, GitHub repos and standards for at least five closest examples; record URLs/publication priority dates, overlap and differences.
- Build minimum proof comparing an alternative, measure effects and costs.
- Record claim status: `HYPOTHESIS / PRIOR_ART_PENDING / PROTOTYPED / FALSIFIED / DIFFERENTIATED / COUNSEL_REVIEW`.
- Record practical open-source distribution/licensing risks and whether a paper/public disclosure could affect future protection strategy. Consult an IP professional **before public disclosure of any specific potentially patentable mechanism**.

## Top three recommended investigation themes

1. **Source-anchored epoch validity plus selective knowledge invalidation** (N01+N02+N08).
2. **Disposable high-context transaction forks with reproducible model-neutral reconstruction** (N03+N04+N15).
3. **Cost-aware dynamic cognitive partitioning/routing judged on *verified outcomes*** (N05+N07+N11).

No novelty score should be labeled objectively high until prior art establishes material differences.
