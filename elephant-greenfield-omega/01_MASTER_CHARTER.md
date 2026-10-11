# Master charter — from zero to two concurrent Elephants

## Vision

Ordinary AI development repeatedly reconstructs architecture, intent, historical evidence, constraints, and dependencies from the same files. Our hypothesis is that **already-contextualized cognitive specialists** can answer, challenge, review, and repair worker plans at substantially lower *total verified development cost* than repeated context reconstruction. These are not agents with elevated authority. They are maintained, high-context cognitive services that exchange structured evidence with workers and each other.

An **Elephant** is a domain-scoped, long-context reasoning node with: (a) an exact source/commit basis; (b) a context manifest and reloadable snapshot; (c) traceable memory promotion; (d) a request/response contract; (e) a versioned state of freshness and contamination; (f) an explicit no-authority or tightly bounded patch-author mode. A long chat alone is NOT an Elephant.

The experiments must answer five distinct questions:
1. **Resident value:** does reuse of a contextualized session beat a fresh session supplied with the same domain pack?
2. **Coordination value:** does a second domain Elephant catch cross-boundary defects without wasting time/tokens?
3. **Operational viability:** can model sessions be resumed/rebuilt/flushed deterministically enough to be dependable services?
4. **Build impact:** can this increase **validated feature throughput**, reduce rework and time-to-first-correct-edit?
5. **Novel mechanism:** can we identify useful technical inventions in epoch-aware cognition, dynamic partitioning, delta application, evidence-governed promotion, and coordination? Novelty is unknown until prior art is examined.

## Three experimental arms

- **E0:** zero Elephants; same worker models, tool access, codebase, tests, task complexity, and allowed clock time. Ordinary source retrieval, static tooling and small context packs are permitted.
- **E1:** exactly one live Elephant; consult/review/refresh/flush/rebuild; workers still write and verify. Evaluate read-only cognition first, optional patch-author extension separately.
- **E2:** exactly two simultaneously usable Elephants, complementary domains, explicit boundary paths, concurrent calls, cross-consult and contradiction reports. Same fundamental worker and resource budget accounting.

## Desired results (targets, NOT forecasts)

- **Primary experimental stretch goal:** ≥25% less wall-clock time per accepted unit of product value than E0, **without** lower quality or increased unresolved defects; assess uncertainty rather than treating one run as definitive.
- **Secondary stretch:** ≥30% lower worker context-reconstruction time on repeated domain tasks.
- **Safety constraints:** 0 secrets in context packs; 0 unapproved direct Elephant modifications to main; 100% response basis stamps; 100% detected in-domain stale fixture cases; no unchecked Elephant advice counted as verified evidence.
- **Discipline:** evidence over claims; measure resource consumption and model overhead; if E1/E2 loses, retain the useful individual components and do not claim the network won.

## Out-of-scope for first comparative wave

New OAuth account tooling; production provider screen scraping; user data ingestion; self-modifying access policy; permanent team-branch ownership; unbounded 24/7 unattended execution; production deployment of two-way browser access; building a massive orchestration platform; claiming patentability. Product features beyond the common brief require explicit treatment as post-experiment variation.

## Hard invariants

A1. `main`+tests+runtime evidence are canonical; cognition is derived and fallible.
A2. All cross-agent artifacts carry experiment arm, task, Git base SHA, identity/capability, and timestamp.
A3. Elephants cannot silently edit workers' source trees or approve their own change.
A4. Exactly 0/1/2 Elephant sessions are active in E0/E1/E2; a controller and workers do not count as Elephants unless they maintain resident domain context.
A5. A worker has a finite request deadline, and fallback to E0 must remain usable.
A6. Context leaks, credentials in packs, unbounded conversation retention and irreversible auto-merge fail closed.
A7. Session compaction, flush, fork and reconstruction may never be represented as *lossless* unless actually proven.
A8. Three arms start from identical commits and matching product acceptance criteria, and receive no cross-arm solution leakage.
A9. Distinguish hypotheses, designs, simulated proof, live proof, and measured conclusions in every report.
A10. Optimize useful installed capability, not code volume, architecture complexity, or agent activity.

## Build team expected to challenge this plan

Claude: systems architecture and failure/consistency; Codex: executable minimal protocol and tests; ZCode: Windows operationalization/harness orchestration; OpenCode: transport + economics + reproducibility; Grok: adversarial simplification, counterexamples and alternate design. These are independent research lenses, not model stereotypes or fixed allocations. Swap lanes after measured trials.

## Decision gates

**G0:** baseline product contract, tests and metrics fixed; harness inventory read-only verified.
**G1:** E0 completes useful product acceptance at starting commit.
**G2:** E1 consult/resume/flush/rebuild works; wrapper verifies epoch/status and worker executes at least one accepted change.
**G3:** E2 concurrent requests, cross-domain impact, disagreement, simultaneous refresh, and fault injection prove manageable.
**G4:** controlled throughput comparison and invention ledger independently reviewed. No promote until G4 evidence is committed.
