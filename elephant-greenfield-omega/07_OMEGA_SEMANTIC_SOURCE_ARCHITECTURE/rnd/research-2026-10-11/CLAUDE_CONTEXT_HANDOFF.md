# CLAUDE OPUS — Ω Core Architecture Thinking Handoff

**Purpose:** This file is the minimal token-efficient entry point. I have done the broad source research and a bounded TypeScript AST experiment. Your assignment is to **decide between architectures and design the proposed core**, not redo primary-source collection.

## Authority to read

1. **Owner/master design intent:** https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md
2. **Independent research:** `RESEARCH_DOSSIER.md` (≈5,600 words), supporting first-party bibliographic catalog `SOURCES.json` (35 primary references).
3. **Bounded empirical falsifier:** `prototype/extract.mjs`, `examples/*`, `tests/test_research_spike.py`, `results/unittest.txt`.
4. **Governing greenfield correction:** the semantic SDK's Machine↔Human learning loop is embedded into Elephant development, with shared semantics but genuinely independent experiment/evaluator contexts. Historical VOMEGA product Ratchet is not automatically greenfield build law.

## Main finding you must challenge

The cheapest likely test architecture combines **AST-extracted source-native declarations + a tiny Stage-0 interpreter + canonical typed versioned Semantic IR + explicit claim/evidence objects + rebuildable storage projections + source-linked human machine projections + independently authorized execution later**. This is a *candidate baseline*, not a design order. MLIR/Spoofax/MPS, RDF/SHACL, Datalog, Schema/WIT and a new self-hosted DSL are alternatives/specializations. See eight-arm matrix in the dossier.

**Do not let this candidate anchor bias you:** independently invent two rival credible architectures with equal-depth technical detail before ranking any solution.

## Research results and constraints

- MLIR: extensible typed multi-level operations and lowering, not a provenance engine.
- Spoofax/MPS/Racket: actual language workbenches and reflection; potential cost/fit problems with ordinary `.ts` files.
- TypeScript Compiler API and Tree-sitter: structural parser tools, not automatic understanding of runtime behavior. **TypeScript 6-era Compiler API has a documented upcoming 7.1 breaking change**; hide adapter behind pinned contract.
- JSON Schema meta-schema and SHACL shapes: real self-description precedents; neither verifies arbitrary source meaning or runtime effects.
- JSON-LD/RDF/PROV-O: global identity, graph exchange and provenance; RDF 1.2 is CR and SHACL 1.2 is October 2026 Working Draft.
- WIT/Protobuf: realization interface and compact exchange. Protobuf binary retains unknown fields but JSON conversion can lose them.
- Salsa/Nix/SCIP: on-demand incremental rebuild, reproducible source-bounded artifacts and symbol navigation.
- Soufflé/Datalog and e-graphs: specialized reasoning and rewrite engines, not a reason to turn all knowledge into inference or equality claims.
- SQLite+FTS/Oxigraph/DuckDB/RocksDB: different workload families; choose *after* matched semantic parity and end-to-end benchmark.
- Photoshop UXP actionJSON/batchPlay: application-specific binding layer, not universal identity of a math operation.

## Lab evidence: do not overstate

The static AST-only spike was tested with **10/10 passing bounded tests** on Node 22.16.0 / Python 3.13.5 with an installed TypeScript package. It extracts literal `omegaSpec` without importing source, separates source and semantic digests, rejects dynamic metadata, blocks top-level expressions in this whitelist, allows an unfamiliar kind as DECLARED_UNVERIFIED, catches duplicate IDs, and reconstructs a disposable SQLite index from source. **It does not type-check the implementation or prove behavior.** A deliberately false Gaussian blur implementation remains “unverified”; that is an intentional positive result of the honesty contract, not a correct filter.

No LLM 20-worker research deployment, true semantic compiler, real runtime execution, independent two-compiler proof, industrial sandbox, or representative database benchmark was run. Existing historical v0.4 synthetic benchmark must not be promoted to a physical backend decision.

## Ten hard architecture questions

1. Precisely define immutable meaning: concepts vs claims vs proofs vs runtime acts.
2. What is the minimum Stage-0 parser/type/effect/identity/security boundary? How is Stage-1 self-description bootstrapped without circular certification?
3. What exactly may an unfamiliar type contribute, and when is it merely syntactically accepted versus type-safe, trusted or executable?
4. Which API preserves source symbol/byte provenance through transformations and projections?
5. How does full type/effect/units/algorithm description work for SQL, HTTP, Photoshop and hardware fabrication with no per-domain kernel changes?
6. Is a typed hypergraph logical IR actually necessary, or would a claim log + projections be superior?
7. How to prove binary/SQL/RDF/graph indexes are lossless with explicit unknown extension fields and contradictions?
8. How to stop source import, model proposals, graph entailments and self-optimizing experiments from granting authority?
9. How to integrate from Day 1 with the same immutable Machine/Human/Wiki/discrepancy/Elephant learning publication?
10. What falsifiable, cheapest integrated vertical slice distinguishes this design from a competent conventional AST+metadata+SQLite tool?

## Expected output (one architecture decision pack, not implementation theatre)

**A.** Three full alternative architectures with a costed decision matrix and technical counterexamples. **B.** Smallest defensible kernel plus explicit semantics/protocol/IR (use concrete TS and JSON examples). **C.** Independently testable self-description/bootstrap story (metaschema not confused with self-hosting). **D.** Source-native file ingestion → checked IR → typed knowledge → dual projection → feedback case → rebuildable index. **E.** Runtime effect/permission separation and environment realization binding. **F.** 2–3-week experimental sequence with exact failures, sound baselines and go/no-go thresholds. **G.** Open technical decisions that must be settled by experiment and items already fixed by owner.

When using research, cite `[Sxx]` and exact URL from `SOURCES.json`; don't spend tokens re-explaining each source. If you disagree with an inference, distinguish `FACT / INTERPRETATION / NEW PROPOSAL / UNKNOWN`. Label all timing/cost figures measured, estimated or unknown; don't invent throughput or cite tests not executed.

**First instruction:** Read dossier sections 0, 3, 4, 5 and 7 before the full rest; do not preload 35 websites. Draft competing architectures and their strongest falsifiers before selecting a favorite.