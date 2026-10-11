# ⚓ Ω semantic meta-compiler — architecture/index research v0.4

**Date:** 2026-10-11  
**Authority:** OWNER-DIRECTED ARCHITECTURAL INTENT; physical indexing and encoding NOT RATIFIED.  
**Parent:** [SDK/compiler/runtime anchor](../../SDK_COMPILER_RUNTIME_ANCHOR.md), [Rule 1](../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md).

## Design decision

The semantic kernel is protocol-conformant source code that also describes its own interfaces, algorithms, constraints, relationships, and interpretation. The compiler takes annotated source plus pinned evidence into an intermediate representation (**Semantic IR**) that can be expressed as typed nodes/relations/claims without committing to any physical database. That IR, plus source lineage and identity, is compiled into 0..N *rebuildable* read models—graph, relational, search, columnar, vector, packed binary—according to measured workload needs. Physical indexes are caches/projections, never independent authorities for meaning.

The index/codec/compiler/planner architecture itself must be visible in the same semantic system. Each candidate backend is modeled with a versioned **Semantic Architecture Descriptor**: identity/source digest, supported IR versions, preserved and unsupported semantics, dependencies, query workload, tunable options, performance and memory evidence, hardware context, tested correctness, invalidation/rollback, state and explicit known unknowns. Self-description is not proof of implementation correctness. An autonomous experiment controller may propose and benchmark changed descriptors but may not silently update the trust kernel or activate an executable effect.

Kernel bootstrap is deliberately small and independently testable: parsing, symbol identity, types/effects, canonicalization, linking, source/provenance, versioning, and checked projection. This does NOT freeze the eventual carrier language, normative binary encoding, graph theory (RDF/property graph/hypergraph), storage engine, query planner or deployment topology.

## Core invariants

1. Every physical view is reconstructible from pinned semantic source and immutable evidence. No manual DB edits establish global semantic truth.
2. An added protocol-conformant source file can introduce unfamiliar domain concepts, but source declarations remain SOURCE_DECLARED until independently checked.
3. One canonical semantic snapshot produces Machine/Human/Wiki/agent projections; discrepancies feed the **same** Rule 1 learning and experiment circuit.
4. Stable concept ID != source revision digest != IR publication ID != runtime execution permit.
5. Unresolved imports, incompatible annotations, contradictory claims, unsupported effect contracts, and stale indexes remain explicit. Lossy knowledge compression never silently drops them.
6. A knowledge graph is a *logical relationship model*; it need not be a graph database. Storage can be hybrid.
7. Runtime availability depends on actual user environment and compatibility; knowledge does not grant permission to execute.

## Research matrix (not an endorsement)

- Embedded transactional tables + FTS (SQLite): exact lookup, indexed edges, mutable evidence.
- Immutable typed adjacency and dictionary-coded packets: compact local traversals/read-only shards.
- KV/content-addressed store: write/update and blob identity.
- Standards-based graph/SPARQL (e.g. Oxigraph): linked-data semantics and graph reasoning.
- Columnar/analytical (e.g. DuckDB/Parquet/Arrow): longitudinal experiments and large scans.
- Specialized lexical/embedding/vector indexes: retrieval (approximate similarity does not prove a fact).
- Composite planners: benchmark routing among projections; account for synchronization/invalidation cost.

## Experiments and promotion gates

E0 self-hosted architecture description; E1 canonical deterministic IR; E2 independent cross-index semantic reconstruction/parity; E3 cold/warm/query/disk/memory scaling; E4 incremental invalidation; E5 source-derived mixed-domain real corpus; E6 complex graph, full text, similarity and time; E7 adversarial contradictions/unknown/effect overclaims; E8 introspection of why a query chose a backend; E9 shadow-built, rollback-safe meta-optimization.

Promotion gates: structural conformance; independent semantic round-trip; executable effect/permission verification; representative multi-machine workload performance; witnessed meta-rationale and rollback. No auto-promotion from one synthetic benchmark.

## Initial exploratory evidence — NOT A SELECTION

A local standalone **v0.4 proof pack** was prepared with a frozen copy of the earlier source-native v0.3 scanner, an introspectable TypeScript meta-architecture file, Python standard-library reference IR, three disposable indexes (gzip JSON, SQLite, packed adjacency), and 13 passing tests. Tests include cross-backend lookup parity, full IR reconstructibility from SQL/packed layouts, source digest change, stale-index rejection, architecture self-description, mixed SQL/gaussian declarations, and no executed TypeScript.

One synthetic microbenchmark (Python 3.13.5, no independent hardware replication) reported for **10,000 fictional nodes, 30,000 fictional edges, 250 exact-neighbor/two-hop bundles**:
- compressed JSON: 208,825 bytes, build 105 ms, median load 107 ms, median bundle 1.25 ms;
- SQLite incl. indexes and optional FTS: 8,982,528 bytes, build 251 ms, median connect 0.43 ms, median bundles 12.04 ms;
- packed adjacency: 368,491 bytes, build 95 ms, median load 14.5 ms, median bundles 2.52 ms.

All answered tested queries correctly. Results are *not apples-to-apples runtime deployment* (in-memory-loaded Python representations vs Python/SQLite calls; optional FTS size but no FTS workload), are not evidence of external source truth, and are not a design decision. Reproduce on user Windows hardware and mixed real corpus before selection. Query p95/99, memory, update rates and other backends remain untested.

**Disposition:** typed logical IR = *candidate foundation*; one physical store = **UNDECIDED**; self-describing meta architecture = *accepted design intent, experimental implementation*. The standalone v0.4 proof package is currently a conversation handoff artifact, not published into this GitHub directory.

