# 01 — Permanent use-case charter and topology

## Mission, differentiated from the first experiment

Design, build and continuously refine the **Elephant ecosystem** by forcing it to operate under the hardest ordinary workload it is intended to solve: heterogeneous, frequently changing source repositories plus a live product architecture. The harvest result is a useful by-product. The infrastructure product is a family of measured, portable capability packs.

The first **application-specific utility** is constructing an evidence-grounded candidate semantic knowledge corpus for VOMEGA's human-facing command execution system. The more useful the candidate outputs are to real VOMEGA implementation, the stronger the training signal for Elephant infrastructure optimization.

Two orthogonal clocks:

- **Finite Full Read Cohort C0:** freeze Git SHAs; every independent experimental main reads every eligible source file at that frozen basis; publish a complete immutable coverage certificate and comparative benchmark. Cohort ends at that point, even if some design ideas are immature. Failed experiments remain visible.
- **Permanent service clock:** after C0, operate on committed deltas, new task questions, release milestones, new source repos and periodic rematerialization. Future C1, C2, etc. are separate cohorts with their own frozen basis and predeclared experiments.

## Logical topology — supply chain with a closed loop

```
SOURCE-OF-TRUTH LAYER
  historical repos @ pinned SHAs               VOMEGA @ current approved epoch
           |                                                |
  [Ingest/inventory/coverage]                  [Current source ingest/delta feed]
           |                                                |
  H1/H2/... Harvest Elephants            P1/P2/... Product Source Elephants
     discover, connect, falsify                  hold current mental model,
     historic candidate knowledge                dependencies, proof and gaps
          \                                          /
           \-- ECP-H controlled offers/challenges --/
                              |
         Source-aligned arbitration / proof / feedback queue
                              |
           Existing VOMEGA DEV / Ratchet / UI / Semantic Lab
                              |
                 result/falsifier/rejection/patch proof
                              |
          Feedback back into both Elephant populations
                              |
             Z.ai capability optimizer + experiment judge
                              |
      portable versioned Elephant ecosystem capability packs
```

There must be **no privileged direct Harvester→product-code write route**. The Product Source Elephant is a *source-aware evaluator* of harvest proposals, not a substitute for actual tests. The Z.ai lab can test changes to its own orchestration source inside isolated experimental worktrees.

## Roles

- **ZAI-MAIN:** one truly independent top-level controller per experiment arm. Owns frozen cohort, budgets, launch, internal rounds, objectively audited closure and per-turn portfolio publication. Can launch workers/Elephants through actually available and proven tools. Cannot claim children that were not launched.
- **ALLOCATOR:** deterministic source inventory and graph + candidate partitioner. Proposed AI decisions are explanatory/advisory. A manifest specifies exactly one primary owner per eligible file *within each experimental main*; overlapping shared-contract snapshots are explicitly counted.
- **HARVEST ELEPHANT (H):** domain-resident long-context service for assigned historical source; produces anchored semantic offers and answers targeted questions. Read-only to legacy repo and product.
- **PRODUCT SOURCE ELEPHANT (P):** domain-resident, freshly synchronized understanding of current VOMEGA source/mental model; evaluates offers for fit, duplication, conflicts, missing product behavior and executable falsifiers. Read-only to VOMEGA.
- **ROUTER:** matches query/contract/dependency to nodes, records hop/latency/queue/cost and falls back to direct-source retrieval when blocked.
- **INGRESS/EGRESS ENGINE:** turns exact file blobs into inspectable resident packets; issues receipts; distills separate fact/claim/unknown outputs with anchors.
- **INDEPENDENT TRUTH JUDGE:** source-anchor verifier, withheld questions, falsifier/test rerun, security and budget reviewer; never accepts self-score as verification.
- **DEV CONSUMER:** existing VOMEGA implementing worker, Ratchet and Product Loop, which decide whether any offer deserves implementation.

## Separation of authority

1. Current source + tests + actual evidence outrank all model memory.
2. Historical source knowledge is historical evidence. Preserve historical commit identity and relevance, not automatic relevance to present VOMEGA.
3. Product Elephant advice is independently verifiable against product HEAD; it does not choose scope/roadmap on behalf of owner.
4. Harvest feedback is allowed to revise a candidate; published previous versions remain content-addressed and inspectable.
5. Elephants may create `PATCH_PROPOSAL` artifacts only in a quarantine output. Their role does not grant edit/merge authority.
6. Core baseline context is a **mental-model seed**, not a claim that all files have been absorbed. The seed includes VOMEGA `AGENTS.md`, `.project/SITREP.md`, `seed-docs/INVARIANTS.md`, `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`, `seed-docs/SEMANTIC-DATA-ENGINE.md`, `seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md`, and the live D1 compiler/projection declarations.

## Optimize infrastructure, not mythology

The terms *Elephant*, *resident*, *memory*, *knows*, *read* and *absorbed* each need measured operational meaning. Provider hidden session state is not directly inspectable. A session reported healthy without source-basis checks is not fresh; full bytes transferred without a check are not evidence of comprehension; 1M context advertised without runtime probe is not 1M usable working memory.

## First testable product journey

"Ask my work Claude account to summarize this" must be representable with natural language and, as an optional visible aid, symbolic notation. The system identifies capability, Provider, exact Account, optional Model, payload and relevant context; preserves unknown and competing interpretations; signals consequence and consent; sends only through an explicitly governed realization; reports attempted vs completed vs uncertain; lets a click or phrase correct the SAME underlying semantic command. All tests begin with synthetic Worlds and virtual execution. Live-provider proof remains a separate gated track.