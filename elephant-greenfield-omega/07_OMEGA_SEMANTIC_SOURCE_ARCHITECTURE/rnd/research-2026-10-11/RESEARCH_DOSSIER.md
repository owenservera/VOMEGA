# Ω Universal Semantic System — Independent Technical R&D Dossier

**Research date:** 2026-10-11  
**Purpose:** Pre-computed literature, engineering alternatives, experiments and falsifiers for Claude Opus to perform architectural synthesis **without spending its remaining quota on broad internet exploration**.  
**Status:** RESEARCH / HYPOTHESES / BOUNDED AST SPIKE; no production SDK or normative wire protocol has been ratified.  
**Companion authoritative conceptual charter:** [Master Blueprint](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md).  
**Scope and precedence:** Latest owner direction: language-agnostic semantic capability space, protocol-conformant code files, self-described and eventually self-hosted kernel, compiler to compact, rebuildable knowledge structures, and experimentally selected storage. Semantic SDK and human/machine/Wiki feedback should be embedded into the independent Elephant development system. Greenfield work does not inherit old D1/Ratchet authority by accident.

## 0. The research conclusion in 90 seconds

1. **This is not merely an ontology or database**. The nearest prior-art combination is: a language workbench (Spoofax/MPS/Racket), a typed extensible IR (MLIR), a source-indexing protocol (SCIP), a self-describing shape/type system (JSON Schema/CUE/SHACL), a reproducible incremental build graph (Salsa/Nix), and independently governed capability interfaces (WIT/OPA-like policy boundaries). Sources [S01]–[S19]. These are analogies and candidates, not proof that plugging the systems together produces Ω.
2. **A strict separation between DECLARED, EXTRACTED, VERIFIED, AVAILABLE and AUTHORIZED is non-negotiable.** TypeScript source with `export const omegaSpec = {...}` establishes that an author declared a contract, not that the corresponding function implements the declared meaning. For arbitrary programs, full behavioral equivalence is undecidable in general. A good architecture represents this epistemic limit as data, with test/proof obligations rather than pretending to auto-verify everything.
3. **An open-world semantic model can have a very small closed bootstrap interpreter.** Unknown identifiers and future types are representable without requiring a core code change. However, unknown types must not silently become executable, type-safe or globally true. This is the two-level resolution of the apparent “no bounds / hard contracts” contradiction.
4. **Logical graph does not imply graph database.** The semantic IR may need attributed, typed, versioned *claims* and relationships, including n-ary/hyperedge-like operations with named roles. Physical views should be chosen by measured queries. SQLite+FTS, compressed dictionaries/adjacency, RDF/SPARQL, Datalog, KV/content-addressed blobs and vector retrieval solve materially different problems. There is no evidence yet that one wins all important workloads.
5. **The protocol should be self-describing before the compiler is self-hosting.** Metaschemas, reflective node descriptions, and bootstrap syntax are attainable early; implementing the entire compiler in its own language is a separate, higher-risk proof requirement. Compiling two independent implementations to an identical IR is a stronger early falsifier than an internal renderer checking itself.
6. **Make one closed learning loop, not sequential stages.** In the first working thin slice, added source yields (i) typed machine meaning, (ii) readable intention/consequences/Wiki, and (iii) an explicit discrepancy experiment record. The human-readable projection is a test instrument, not a documentation phase postponed until the compiler is complete.
7. **Recommended research baseline—not an architectural ratification:** source-native TypeScript declaration + TypeScript Compiler API frontend → small canonical typed semantic IR → content-addressed evidence snapshots → at least two independently reconstructible read views → source-derived Wiki/human machine projection → no execution. That is the cheapest credible test of the claimed multiplier.

## 1. Correctly frame the thing being designed

### 1.1 The core problem

Given a new source artifact *A* in any digital domain, how does a previously unaware installation of Ω (a) distinguish structure from claims, (b) extract the contract that A asserts, (c) locate it relative to existing meaning, (d) identify dependencies, types, units and consequences, (e) expose the knowledge to other components consistently, (f) check what has actually been proven, (g) selectively make any realization available in a particular environment, and (h) preserve reconstructibility without a manually updated canonical database?

The underlying invention target is an **extensible, reflective, source-native semantic language and compiler**. It is not a complete enumeration of all commands or protocols. The architecture must permit a future type never considered by its designers while still having a precise way to say “unknown”, “incompatible”, “unverified”, or “not authorized.”

### 1.2 A file cannot magic new execution into existence

Four distinct meanings of 'adding a file makes the system know it':

| Level | Observable outcome | Required proof | Not implied |
|---|---|---|---|
| L1 semantic discovery | Globally queryable new concept, self-description, relations, provenance | Parser + validation + stable ID + index rebuild | True description |
| L2 capability description | Typed params, effects, preconditions, math/algorithm references, explicit source symbols | Structural/type/effect checks, independent human projection | Implemented functionality |
| L3 environment availability | Concrete provider/device/application and versions satisfy binding requirements | Environment-specific compatibility and live observation where applicable | User consent |
| L4 governed execution | Deterministically selected and authorized realization, accountable effect evidence | Policy/consent + version/session binding + real action-specific proofs | Semantic truth about all downstream effects |

The most dangerous confusion is L1→L4. A source file is potentially malicious *at discovery time*. **Do not import or evaluate contributed TypeScript to read its metadata.** Use static AST extraction and reject/hold opaque computed values. Code is not a proof of its own specification.

### 1.3 Noninterchangeable semantic objects

| Object | Distinct identity | What it proves |
|---|---|---|
| `SemanticConcept` | Stable domain identity | A concept is addressable, not that it is true |
| `Declaration` | Versioned author/source ID | Author asserted a statement |
| `SourceArtifact` | Hash of exact bytes, source locator, rights | What bytes were inspected |
| `SemanticIRPublication` | Domain-separated hash of complete normalized IR and version | What machine meaning was compiled |
| `EvidenceClaim` | Evidence record + witness, cohort, time | Degree/class of support; never direct authority |
| `Realization` | Concrete program/provider binding ID + hash | Possible implementation, not availability |
| `EnvironmentObservation` | User installation/device/account epoch | What was observed in that environment |
| `AuthorityGrant` | Scope/subject/consent/policy binding | Whether effects are permitted |
| `ExecutionReceipt` | Attempt/effect/reconciliation identity | Evidence of observed outcome |
| `Projection` | IR publication + projection profile | View of the same meaning, not new truth |

**Prohibition:** Do not derive durable concept ID from version, provider, physical database, risk score or latest policy state. Do not collapse model/provider/account/session. Do not collapse confidence/proof, fidelity/maturity, or semantic identity/execution permit.

## 2. Prior art by capability, with specific adaptation implications

### 2.1 Language definition, composition, and compiler IR

**MLIR** defines extensible dialect namespaces for operations, types, attributes and transformations; its dialect-conversion system has explicit targets, legality and type conversion [S01][S02]. **Transferable idea:** decouple what an operation means from how it lowers to a concrete execution substrate; permit higher-level mathematical and hardware semantics. **Mismatch:** MLIR is oriented toward program representation and compiler transformation, not source-anchored global knowledge, provenance, user intent or independent execution authority. Do not declare “Ω = MLIR”. Prefer a thin Ω IR inspired by its operation/region/type/effect modularity; measure when actual MLIR becomes economically useful.

**Spoofax** includes syntax definitions, static semantics via scope graphs, and program transformation [S03][S04]. **Transferable idea:** composing language meaning requires explicit name binding, scope, constraints and transformations. **Mismatch:** heavy language-workbench integration and tooling overhead; its compiler-generation model is not a drop-in answer to in-file TS annotations. Compare a scope-graph-inspired resolver to hand-maintained symbol maps on actual cross-file ambiguous names.

**MPS** stores and edits programs as abstract syntax trees rather than relying on a parser; it permits multiple human projections for a concept [S05]. **Transferable idea:** one canonical semantic object with different human presentations, including non-text/math/3D. **Mismatch:** existing text files, TypeScript workflow and conventional developer editors are explicit constraints. MPS is excellent counterdesign evidence, not an automatic choice for source carrier.

**Racket's language facilities** show a language can create readers, syntax expanders and module languages [S06]. **Transferable idea:** language definition can be layered and bootstrapped from a small core. **Mismatch:** dynamic macro expansion often executes compile-time code. An Ω ingest path must not implicitly execute contributed source; Racket is a pattern for controlled language extension, not a literal safe TS importer.

**Tree-sitter** produces incrementally updateable syntax trees, with robust editor-friendly parsing [S07]. **TypeScript compiler API** exposes the TS program, AST, symbols and type checker [S08]. **SCIP** provides a language-agnostic source code intelligence index of definitions and references, distinct from semantic concepts [S09]. **Combined recommendation:** use native TS analysis to establish TS types and AST symbols; use Tree-sitter for future polyglot structural adapters; keep SCIP as an interoperability layer for source navigation. None determines the *real-world* meaning of a function named `gauss`.

**Watch:** The TypeScript compiler API wiki explicitly warns that its described API covers TS 6.0 and earlier and that TS 7.1 will have a completely different API [S08]. Pin TS and hide the frontend behind adapter conformance tests; do not make the TypeScript compiler's internal AST format Ω's public semantic protocol.

### 2.2 Self-description, constraint solving and interface exchange

**JSON Schema 2020-12** provides a self-describing meta-schema, a close precedent for having the kernel's *descriptions* validate descriptions of themselves [S10]. **CUE** uses unification and constraints over structured data, and its implementation reference explicitly distinguishes declarative evaluation from operational semantics [S11]. **Dhall** is a deliberately constrained, normalizing configuration language [S12]. **SHACL** treats constraints as shapes graphs which themselves are RDF graphs and can validate data graphs [S13]. These support describing valid data and schemas but do not in themselves prove arbitrary program effect claims. A candidate combined design: JSON Schema-like shape layer for protocol structural envelopes; a richer typed/constraint layer for units, types and effects; optional SHACL graph conformance for RDF exchange.

**WIT / WebAssembly Component Model** defines versioned interfaces and imports/exports independent of source languages [S14]. This is an apt *realization ABI* model, not a universal semantics model. Attach a WIT interface to a validated realization while keeping the domain concept independent of WASM/Windows/Adobe. WIT's package, interface and world constructs are an especially relevant reference for how multiple contributions interoperate.

**Protocol Buffers** offers schema-defined compact binary data and explicit unknown-field retention in binary form. Its documentation warns that converting to JSON can lose unknown fields [S15]. An Ω compact IR must either guarantee lossless unknown extension fields or reject/lift them explicitly. This matters more than shaving 30% from index size.

### 2.3 Global identity, relationships and evidence

**JSON-LD 1.1** maps structured JSON keys to linked-data identifiers and graph meaning [S16]. **RDF 1.2** is a 2026 *Candidate Recommendation Snapshot*, not to be casually called a finalized Recommendation [S17]. **SHACL 1.2** has an October 8, 2026 *Working Draft* [S18]. **PROV-O** provides interoperable entities/activities/agents and derivation provenance [S19].

Candidate Ω adaptation: give concepts durable URN/IRI-like IDs, represent assertions separately from verified facts, attach claim IDs to provenance, express n-ary operations as nodes with input/output/effect roles, and expose standards-compatible JSON-LD/RDF projections if they pass loss tests. Do not insist that RDF triples directly encode every typed AST statement, algorithm or runtime effect. Do not let a graph entailment regime implicitly upgrade a contested claim into verified authority.

**OpenTelemetry semantic conventions** publish machine-readable definitions with explicit lifecycle/stability classes [S20]. Useful for the *governance of evolving terms*: deprecations, schema versions, lifecycle, registry contracts. But telemetry conventions are observation vocabulary, not general executable semantics.

### 2.4 Knowledge computation, rewrite optimization, incremental maintenance

**Soufflé/Datalog** expresses typed relations and recursive rules; the engine compiles those rules [S21]. It could implement dependency closure, transitive impact and constrained rule inference efficiently. Beware negation semantics, cyclic rules, closed-world assumptions, incremental updates and explaining which rules justified a derived edge. Do not require every Ω domain to be reduced to pure Datalog.

**Salsa** tracks dependencies among on-demand incremental computations [S22]. **Nix derivations** characterize reproducible outputs from pinned inputs [S23]. Together suggest one of the highest-leverage mechanisms: source file hash + compiler version + protocol version + imported dependency digests + profile + environment assumptions → exact rebuilt index and view artifacts. Distinguish artifact hash from stable concept identity. Build results, not model conversations, are the durable cross-agent medium.

**Equality saturation/e-graphs (`egg`)** compactly represent equivalent expressions and rewrite alternatives [S24]. Particularly interesting for algebraic identities, optimizable dataflow, compiler lowering and alternative descriptions. **Hard condition:** e-class equivalence must be grounded in trusted rewrite rules/theorems (including types, units, IEEE float behavior, errors, side effects), not asserted by an LLM. This is a specialized algorithm plugin, not the canonical global knowledge store.

### 2.5 Storage and query systems

**SQLite/FTS5** supports local transactional indexing and full-text search [S25]; **Oxigraph** supports RDF datasets and SPARQL [S26]; **DuckDB/Parquet** is optimized for scans, projections and analytical workloads [S27]; **RocksDB** is a persistent ordered KV store [S28]. Evaluate functional parity, build freshness and total cost; raw benchmark times across differently cached/query-equipped implementations are incomparable.

**Open Policy Agent/Rego** separates policy evaluation from enforcement [S29]. The useful lesson is conceptual: policy may answer whether a specific action is allowed; actual runtime must enforce that decision on a fresh, bound execution preview and cannot rely on source declaration as permission.

### 2.6 Domain-specific reality check: Photoshop

Adobe Photoshop's official UXP documentation describes a high-level DOM API and `batchPlay`, which accepts `actionJSON` descriptors for commands and returns results [S30]. This validates the demand for an **application-specific command adapter** in Ω, but not that every application command is public or scriptable. A filter would need (1) semantic algorithm and parameters, (2) declared visual meaning, (3) Photoshop realization using supported API/version, (4) compatible target document/layer state, (5) effects and reversibility, (6) user authorization, (7) observed fidelity. Do not encode a Photoshop `batchPlay` descriptor as the global identity of Gaussian convolution.

## 3. Architecture tournament: eight substantively different approaches

No scores in this table are measured. “Best for” is a research prediction requiring the named falsifier.

| Arm | Conceptual architecture | Best plausible property | Main liability | Earliest fair falsifier |
|---|---|---|---|---|
| A | **TS-native semantic capsule**: literal `omegaSpec`, AST+TypeChecker, independent JSON-like IR | Thin source-native implementation and ordinary IDE workflow | TS-specific frontend; restricted static contract may feel duplicative | Two independent TS implementations produce identical meaning and Wiki from same file |
| B | **Language workbench**: Spoofax/Statix-like meta grammar + scope graph | Formal composition, name resolution, grammar growth | Setup and editor integration costs | Introduce two conflicting namespaces/overloaded symbols with clear diagnostics |
| C | **MLIR dialect core**: extensible typed ops and lowering | Math/algorithms, multi-domain lowering and transform legality | May overfit compiler IR to knowledge assertions | Represent an unverified HTTP claim and its provenance without fake executable semantics |
| D | **RDF/SHACL-first**: JSON-LD + graph shapes + SPARQL | Linked-data interoperability, open-world identifiers | Complexity of source/AST/algorithms and per-claim truth levels | Round trip parameter order, source byte anchors, typed effects, contradictions losslessly |
| E | **Datalog relation core**: typed facts + incremental rules | Impact closure, dependency derivation, traceable inference | Open world, nonmonotonic change and rich programs may be awkward | Conflicting evidence/temporal revisions with explanations and rollback |
| F | **Content-addressed typed capsules** with pluggable projections | Portable reconstruction, source identity, local/offline independent stores | Needs custom semantics and query plan; temptation to reinvent everything | Rebuild after deleting all views; compare two implementations byte-for-byte |
| G | **Schema/interface-first**: WIT/Protobuf/CUE/JSON Schema | Versioned interfaces, constrained contracts, compact exchange | Behavioral semantics, provenance and algorithm meaning remain outside IDL | Import an algorithm + uncertain source evidence without calling it a valid component |
| H | **New Ω DSL, eventually self-hosted** | Maximum domain-level expressiveness and code/knowledge unity | Highest grammar, tooling, security and bootstrap risk | Add one domain without editing parser/compiler and beat TS-first on change cost |

**Recommended minimum-cost tournament:** implement A and F together as a reference *composite* baseline. Build **one independent alternative** drawn from D or B. Preserve C, E, G, H as conditional specializations until benchmarks identify concrete unmet needs. Claude should produce at least two rival counterarchitectures without reading a scored recommendation first, if independent creativity is part of the study.

## 4. What the semantic protocol minimally needs (provisional, not normative)

### 4.1 The bootstrap fixed point

A kernel cannot derive *every* validation rule solely from itself without an externally trusted interpretation of some starting syntax. Define a small **Stage-0 interpreter** specifying: byte encoding, lexical structure, parser, primitive types, canonical serialization, symbol identity, version negotiation, evaluation/validation semantics, errors, effect prohibition at discovery, and how a signed/versioned protocol upgrade is admitted. Then express the richer Stage-1 schemas, operations, constraints and even Stage-0 descriptions *in* its own format. This is **reflective self-description**.

Self-hosting requires a subsequent proof: compiled Stage-1 implementation can independently recompile itself and pass conformance without borrowing the old implementation's answers. A two-implementation bootstrap may have a hidden “trusting trust” problem unless builds and artifacts are independently checked. Research as an explicit trust-root, not mystical self-origin.

### 4.2 Candidate primitive semantic records

Core carriers: `Entity`, `Kind`, `Declaration`, `Claim`, `Relation`, `Operation`, `Type`, `Constraint`, `Effect`, `SourceAnchor`, `Provenance`, `Version`, `Evidence`, `Realization`, `EnvironmentObservation`, `PolicyReference`, `Projection` and `Discrepancy`. A universal logical syntax does *not* imply these must be hard-coded enum variants. Prefer minimal tagged envelopes and extensible semantic type declarations; define first-order operators for address, membership, relation, claims, type checking and transform composition. Domain words such as SQL, image, CPU, transport and fabrication remain optional modules.

A true n-ary operation needs named, typed roles. Example: `GaussianConvolution` operates on `ImageTensor`, `sigma`, `boundaryCondition`, `colorSpace`, `precision` and returns `ImageTensor` with semantics qualified by treatment of edges. A triple `image -> gaussian` is insufficient. In networking, a `Route` differs from the process of propagating routes, from a routing-table entry, from an HTTP endpoint, and from a policy allowing outbound traffic. Ontology collision prevention is a major objective.

### 4.3 Source contract considerations

TS candidate (illustrative; no stable API ratification):

```ts
export const omegaSpec = {
  id: 'urn:omega:query.sql.filter.v1',
  kind: 'Operation',
  meaning: 'Filter rows using a predicate',
  entry: 'filterRows',
  parameters: [{name:'rows',type:'Relation<Row>'}, {name:'predicate',type:'Predicate<Row>'}],
  effects: ['read:in-memory'],
  relations: [{kind:'specializes',to:'urn:omega:relational.selection'}],
  evidence: 'SOURCE_DECLARED_UNVERIFIED'
} as const satisfies OmegaCapability; // type-only dependency is not runtime evidence
export function filterRows(...) { ... }
```

**Scanner may mechanically establish**: constant metadata structure, referenced source symbol exists, syntactic and type-level signature under pinned compiler, source-span/hash, known references and unresolved references. **Cannot establish without extra evidence**: a pure/side-effect-free implementation, correct SQL semantics, no thrown errors, actual Gaussian blur, vendor API compatibility, user permission, performance, or full real-world consequences. Require concrete witnesses appropriate to each claim.

Potential metadata strategies to compare: exported literal const, decorators, JSDoc pragma, co-located sidecar, custom TS tagged template, generated AST reflection, interface schemas. Benchmark change ergonomics, compile time, trust, editor support, failure quality and churn. Consider avoiding annotations that are computed dynamically at module load.

### 4.4 Suggested IR envelope shape

```json
{
 "ir_version": "omega-research/0",
 "publication_id": "sha256:...",
 "source_set": [{"uri":"repo:path","sha256":"...","compiler":"ts@PINNED"}],
 "concepts": [{"id":"urn:omega:query.sql.filter.v1","kind":"Operation","status":"DECLARED_UNVERIFIED"}],
 "claims": [{"id":"claim:...","subject":"urn:omega:query.sql.filter.v1","predicate":"has-meaning","value":"Filter rows using a predicate","origin":"AUTHOR_DECLARED","source_anchor":"...","verification":"NOT_RUN"}],
 "relations": [{"from":"urn:omega:query.sql.filter.v1","kind":"specializes","to":"urn:omega:relational.selection","resolution":"PENDING"}],
 "representations": {"machine":"...","human":"...","wiki":"..."},
 "diagnostics": []
}
```

Illustrative only. Missing representation references can be generated from the same publication; do not redundantly canonicalize the renderings as separate truth. Preserve empty/unknown/contradicted distinction, unicode policy and floating-point unit/canonicalization semantics.

### 4.5 Meta architecture descriptor

Describe the compiler and its derived physical views as ordinary **candidate semantic artifacts** with `inputIrVersion`, `outputViewVersion`, `supportedQueries`, `lossGuarantee`, `storageEngine`, `indexBuildHash`, `runtimeDependencies`, `observedCosts`, `hardwareProfile`, `freshnessPolicy`, `rollbackPlan`, `testEvidence` and `executionAuthority = NONE`. The engine can propose a better descriptor and build a shadow index, but cannot let its own benchmark certify itself. Independent consumers must reproduce parity.

## 5. Focused experiments to run before Claude selects an architecture

### E0 — Self-description fixed-point / bootstrap
Build a minimal protocol metaschema and represent that metaschema in the protocol. Independent Rust/TS/Python or two sufficiently independent implementation paths validate the same fixture. Counterexample: deliberate disagreement on Unicode normalization, map key ordering, unknown keyword, duplicate property, infinity/NaN and recursive type. **Pass:** same result and diagnostics on held-out fixtures; no circular trust assertion.

### E1 — Drop one file, discover safely
Place `sql.semantic.ts` into a watched fixture directory. Perform AST-only ingestion; never evaluate arbitrary top-level statements. Emit semantic publication, human description and Wiki from the same checked IR. **Pass:** capability discoverable in exact and relation queries, with status DECLARED_UNVERIFIED. Deliberately include malicious top-level expression and computable metadata value; neither executes or gets silently admitted.

### E2 — Proof of meaning vs simple syntax
Make the file's implementation return the input unchanged but claim “Gaussian blur.” Type-check succeeds; deterministic semantic publisher must still label the claim unverified. Add independent held-out image test with nonuniform pixels and positive sigma. **Pass:** declared-vs-observed discrepancy recorded; corrected semantic/effect contract versioned; no automatic claim promotion.

### E3 — Untouched domain
Introduce an unfamiliar fabrication operation, a CPU instruction, a route policy, and an entirely fictitious but syntactically valid type. **Pass:** structural intake and coherent UNKNOWN/UNSUPPORTED status without changing core parser; precise refusal to execute unsupported realization; discoverable conceptual links once sourced. **Fail:** schema upgrade for every new kind, fabrication invented as software call, fictional concept automatically accepted as fact.

### E4 — Incremental dependency graph
A depends on B and C, D on C, and unrelated E. Mutate C; measure exactly which semantic publications and Wiki pages change, with hashes; mutate formatting of C only; compare semantic hash vs source hash and rebuild behavior. **Pass:** sound (not necessarily minimal) invalidation; source provenance updates even if meaning hash unchanged; unchanged unrelated E read view matches old publication.

### E5 — Cross-index equivalence
Same 100/10k/100k/1M concept and mixed graph datasets compile to SQLite, packed adjacency, JSON gzip, RDF store and optional KV; read back IR and queries. Exact-named relations, typed parameters, provenance, unknown extension fields, contradictory claims and stable ID identity must survive. **Pass:** independently reconstructed normalized semantics equal; test discrepancies are reported, not fixed by dropping attributes.

### E6 — Cross-surface semantic parity
For each candidate interpretation, derive machine record, Plain Reading, Wiki summary and UI labels from the **same immutable publication**. Have an independent human/agent reconstruction test: given reading, reconstruct correct capability, target, parameters, effects, ambiguities and provenance. **Pass:** no missing material consequences; human comprehension failure captured even when projections agree on an incorrect interpretation.

### E7 — Authorization separation
Source file declares `effects: ['none']` but includes file/network writes. Static scanner should block suspicious load-time code and dynamic analyzer must falsify unsupported pure claims. No source declaration grants any permission. Replay, stale state, changed provider/account and ambiguities fail mock execution. **Pass:** no receipt for rejected input, and valid fully authorized mock control succeeds exactly once.

### E8 — Storage tournament
Matched hardware, real corpus plus adversarial generated data. Measure cold start, incremental insert/update/delete, p50/p95/p99 exact lookup, 2-hop/6-hop dependency query, contradictory-claim query, temporal source/history query, full-text, hybrid retrieval, disk/RSS, build cost, migration, crash corruption and rebuilding from zero. **Do not select a database by a single synthetic size/time run.** Every optimized backend must return the same ground-truth answers.

### E9 — Measured semantic ROI / conventional twin
Same five independent tasks on the Ω experimental path and a conventional TS/SQLite/typed-API baseline. Match implementation effort, model budget, source corpus and QA. Measure validated accepted task outcomes per lifecycle cost, correction steps, time-to-first-correct-intent, downstream maintenance effect and ability of a second consumer to reuse meaning. Count tokens only from actual counters. **Gate:** favorable tradeoff with honest uncertainty, not more generated artifacts.

### E10 — Elephant integration
Make two *genuinely separate* Elephant workers request and exchange version-pinned semantic packets with full source and evidence. Simulate missing/expired knowledge and contradictory statements. **Pass:** peer distinguishes advertised expertise from evidence, no invented cross-context memory, and its human Wiki and machine summary refer to the same frozen source. Preserve full per-turn capability-pack publication even when unfinished or rejected.

### E11 — Self-modifying architecture / rollback
Represent database strategy and compiler transformation as meta-descriptions, generate shadow candidate, compare under independent fixed evaluator, record mechanism version and resource budget, and intentionally regress a query. **Pass:** failed candidate remains discoverable with evidence but never replaces known-good code/index; rollback restores original known-good semantics; execution law remains fixed outside candidate runtime.

## 6. Bounded laboratory executed for this dossier

The companion `prototype/extract.mjs` is a **research spike** using the TypeScript compiler's AST API without importing contributed modules. It accepts **literal** `omegaSpec` objects (with a limited `as const`/`satisfies` unwrapping), detects top-level unsupported constructs, requires a referenced exported function, computes distinct source-bytes and semantic-content SHA-256 digests, and emits per-file statuses.

`examples/` provides SQL row filtering, Gaussian blur, an unknown domain, deliberately dynamic metadata and a malicious top-level file-write attempt. The Gaussian function intentionally **does not blur**. If compilation alone were treated as semantic verification, the system would be wrong; the test checks the status is still DECLARED_UNVERIFIED.

The test suite `python -m unittest discover -s tests -v` comprises ten bounded tests: static SQL intake, formatting stability, dynamic-metadata rejection, top-level side-effect blocking without importing source, unfamiliar domain status, duplicate identity, file-order stability, SQLite cache reconstruction, false semantic correctness claim, and basic resource guards. **Observed in this environment: 10/10 pass** on Node 22.16.0 / Python 3.13.5 with locally installed TypeScript (no external network required). Results in `results/unittest.txt`.

**What this DOES NOT prove:** full TS type checking, behavior extraction, semantic equivalence of arbitrary source, dynamically imported module safety, all possible top-level side effects, source-to-runtime correspondence, robust Unicode/canonical format, sandbox strength, large-scale indexing, correctness of declared effects, real user meaning, compilation without external dependencies or browser/Windows compatibility. In fact the scanner intentionally has a narrow whitelist of top-level syntactic constructs; a production scanner must have stronger, formally reviewed boundaries. Output is for research only and must not be loaded as a trusted plugin.

## 7. Critical failure modes Claude should actively search for

1. **Self-reference illusion:** “the protocol defines itself” hides the actual trusted parser/checker implementation.
2. **Unverified semantic laundering:** a function name/comment/LLM claim is displayed as observed reality.
3. **False type/effect parity:** a `pure` annotation conflicts with file/network writes, nondeterminism, exception behavior or aliasing.
4. **Context-erasure:** a semantic action is confused with a provider-specific realization (Photoshop filter vs Gaussian convolution).
5. **Index becoming authority:** a fast stale cache overrides the current source artifact or user's World.
6. **Cross-platform instability:** UTF-16/UTF-8, floats, NaN, negative zero, dates, case fold or path conventions change semantic hashes.
7. **Graph identity collision:** IRIs are treated as true equivalence across unrelated ontologies, or ambiguously scoped names merge.
8. **Unknown field loss:** binary→JSON intermediary discards future-version semantics.
9. **Over-generalization:** an allegedly universal `Operation` cannot represent multi-party transactions, uncertain observations, analog physical manufacturing or temporal semantics.
10. **Capability ≠ permission collapse:** the act of adding a file activates device, browser, filesystem or network effects.
11. **Meta-experiment evaluator contamination:** candidate model edits the scoring harness or declares its own success.
12. **Accidental ecosystem lock-in:** TypeScript AST, browser, Chromium, WASM, Rust, MLIR or one database is frozen as constitutional law before comparison.
13. **Closed-world inference leakage:** absence of a fact becomes global falsehood when it merely means unknown.
14. **Cost blind spots:** source ingestion, compiler build, repair and index synchronization outweigh theoretical query-speed benefits.
15. **Mismatched human/machine projection:** UI/Wiki silently omits uncertainty, destination, data egress, consent or side effects.
16. **Context explosion:** 20 agents duplicate knowledge harvest instead of exchanging small source-pinned packets; high token throughput masquerades as useful work.
17. **Unlicensed harvest:** external code/data/documents are copied into canonical corpus without rights/attribution, instead of storing citations and extracted structural facts.
18. **Bootstrap conflation:** declaring the kernel's operation set in itself is mistaken for compiling its own implementation or independently verifying it.

## 8. Decision questionnaire for Claude (do NOT assume answers)

- Q01 Is source-native TS literal annotation the initial authoring syntax, or should TS metadata be generated from an independent schema? Compare round-trip and refactoring ergonomics.
- Q02 What exactly is the minimal Stage-0 trust kernel? Which semantic primitives cannot be moved out safely?
- Q03 Are first-class *claims with provenance* more fundamental than first-class nodes or operations?
- Q04 What meaning is intentionally outside static analysis, and what minimum additional witness upgrades it?
- Q05 What type-system core captures named roles, units, effect sets, variance, refinement predicates, partial/unknown states and extensibility without being a general theorem prover?
- Q06 Can MLIR's dialect legality and lowering map cleanly to a global knowledge system, or does it induce category errors?
- Q07 Which scope/name resolver should be reused? What is the semantics of re-exports, import cycles and namespace conflicts?
- Q08 How to represent conflicting or temporally superseded claims without mutating old evidence?
- Q09 What exactly is the normalization algorithm (RFC 8785 or tested alternative) for mixed TS/Rust/Python, including floats?
- Q10 How is an unknown future protocol version preserved and surfaced to callers without executing it?
- Q11 How to prove source→IR→compressed view→source-semantic reconstruction invariants across two independent implementations?
- Q12 When is a graph, relation, hypergraph/event, Datalog or proof tree a necessary semantic primitive versus a derived view?
- Q13 Which queries should be optimized at local 16GB Windows scale and later distributed herd scale? Who sets the representative corpus?
- Q14 When is Wasm Component Model/WIT worth introducing as a realization interface? Could direct TS functions suffice for the first slice?
- Q15 What are explicit failure and unknown states at every API boundary? Do they survive Wiki and agent projections?
- Q16 What makes a human-readable explanation semantically *complete*, and who independently judges it?
- Q17 Can the architecture learn new domain meaning without manual taxonomy expansion but without automatically endorsing fabricated concepts?
- Q18 Who is permitted to change the kernel/protocol itself, and how are sealed referee tests kept independent of LLM workers?
- Q19 How much measured benefit is required before self-optimizing index selection is worth complexity?
- Q20 What are the smallest two truly different implementations needed to disprove an architecture-specific illusion?

## 9. Deliverable specification for Claude's *thinking phase*

Ask Claude to return **one design decision memo** with: (a) architecture A/B/C with honest alternatives; (b) minimal independently checked kernel; (c) self-description bootstrap and type/effect model; (d) compiler/IR/source-pack contract; (e) semantic fact, graph and index boundaries; (f) 3 cross-domain worked packets including SQL, Photoshop, CPU or routing; (g) executable acceptance tests and negative controls; (h) storage and query tournament policy; (i) Elephant SDK integration wiring; (j) a decision ledger `RATIFIED / RECOMMENDED / EXPERIMENTAL / UNKNOWN`. Give concrete pseudocode only where it helps falsify a design; don't ask Claude to repeat this literature review.

**Cost saving:** Attach/point Claude to this dossier, `SOURCES.json` and `CLAUDE_CONTEXT_HANDOFF.md`; avoid loading all earlier seed docs or ten skill manuals into context unnecessarily. The master blueprint remains the single architecture intent reference; this dossier is independent prior-art evidence and experiments, **not replacement owner decisions**.

## 10. Bibliographic evidence ledger

All references below are primary specifications, official project docs, or first-party repository pages accessed or located on 2026-10-11. **Vendor assertions are descriptions of their own systems**, not independent measured validation of suitability for Ω. Exact version status must be pinned when used in implementation or norms. Entries [S01]–[S30] map to the machine-readable `SOURCES.json` in this package.

- **[S01]** [MLIR dialects and extensible operations](https://mlir.llvm.org/getting_started/Glossary/) — official. Dialect namespaces, operations, types, attributes and multi-level IR; not knowledge provenance.
- **[S02]** [MLIR dialect conversion](https://mlir.llvm.org/docs/DialectConversion/) — official. Conversion legality, patterns and type converter; no claim-level evidence contract.
- **[S03]** [Spoofax language designer workbench](https://spoofax.dev/) — official. Syntax, Statix static semantics, scope graphs and term transformations.
- **[S04]** [Spoofax NaBL2 name binding](https://www.metaborg.org/en/latest/source/langdev/meta/lang/nabl2/reference.html) — official. Namespace-qualified declarations and references; older documentation.
- **[S05]** [MPS 2026.1 basic concepts](https://www.jetbrains.com/help/mps/basic-notions.html) — official. AST-persistent projectional languages, concepts and editors.
- **[S06]** [Racket creating languages](https://docs.racket-lang.org/guide/languages.html) — official. Layered readers, expanders, and module languages.
- **[S07]** [Tree-sitter documentation](https://tree-sitter.github.io/tree-sitter/) — official. Incremental syntax trees, error recovery, polyglot parser ecosystem.
- **[S08]** [TypeScript compiler API wiki](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) — official. AST, Program, TypeChecker, compiler API; warns TS 7.1 different API.
- **[S09]** [SCIP Code Intelligence Protocol](https://github.com/scip-code/scip) — official. Language-neutral code navigation symbols and source references, not semantic truth.
- **[S10]** [JSON Schema specification](https://json-schema.org/specification) — standard. Meta-schema validates itself, structural and validation vocabularies.
- **[S11]** [CUE implementation reference](https://github.com/cue-lang/cue/blob/master/doc/ref/impl.md) — official. Declarative constraints and unification, not general side-effect semantics.
- **[S12]** [Dhall documentation](https://docs.dhall-lang.org/) — official. Constrained programmable configuration and normalization.
- **[S13]** [W3C SHACL Recommendation](https://www.w3.org/TR/shacl/) — standard. RDF shape constraints and validation reports. Recursion behavior not generally defined.
- **[S14]** [WebAssembly WIT interface type format](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md) — official. Interface/package/world imports/exports; realization ABI, not global semantics.
- **[S15]** [Protocol Buffers unknown fields](https://protobuf.dev/programming-guides/editions/) — official. Unknown fields retained in binary, but JSON conversion can discard them.
- **[S16]** [W3C JSON-LD 1.1 Recommendation](https://www.w3.org/TR/json-ld11/) — standard. JSON-based linked data and global semantic identifiers.
- **[S17]** [W3C RDF 1.2 Concepts Candidate Recommendation](https://www.w3.org/TR/rdf12-concepts/) — candidate-standard. 2026 Candidate Recommendation Snapshot, not final W3C Recommendation.
- **[S18]** [W3C SHACL 1.2 Core Working Draft October 2026](https://www.w3.org/TR/2026/WD-shacl12-core-20261008/) — working-draft. Recent draft may alter design; do not treat as stable recommendation.
- **[S19]** [W3C PROV-O Recommendation](https://www.w3.org/TR/prov-o/) — standard. Entities activities agents and provenance relationships.
- **[S20]** [OpenTelemetry semantic convention groups](https://opentelemetry.io/docs/specs/semconv/general/semantic-convention-groups/) — official. Machine-readable semantic attribute groups, stability and deprecation.
- **[S21]** [Souffle Datalog language](https://souffle-lang.org/datalog-language) — official. Typed relations, clauses, recursion and generated query execution.
- **[S22]** [Salsa incremental computations](https://docs.rs/salsa/latest/salsa/index.html) — official. Tracked functions and dependency invalidation; Rust ecosystem.
- **[S23]** [Nix derivations and reproducible outputs](https://github.com/NixOS/nix/blob/master/doc/manual/source/store/derivation/index.md) — official. Input/output derivations and content-addressed build semantics.
- **[S24]** [egg equality saturation ACM 2026](https://doi.org/10.1145/3815481) — peer-reviewed. E-graphs compact equivalent expressions; requires correct rewrite conditions.
- **[S25]** [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html) — official. Embedded full-text virtual tables; only one of several required query families.
- **[S26]** [Oxigraph Rust docs](https://docs.rs/oxigraph/latest/oxigraph/store/struct.Store.html) — official. RDF store, SPARQL and transactions; separate RocksDB feature.
- **[S27]** [DuckDB Parquet documentation](https://duckdb.org/docs/current/data/parquet/overview) — official. Columnar scans with projections and filters; analytics specialization.
- **[S28]** [RocksDB documentation](https://rocksdb.org/docs/) — official. Persistent ordered key/value storage and LSM data structures.
- **[S29]** [Open Policy Agent and Rego](https://www.openpolicyagent.org/docs) — official. Policy decisions decoupled from enforcement; authorization still runtime job.
- **[S30]** [Adobe Photoshop UXP batchPlay](https://developer.adobe.com/photoshop/uxp/ps_reference/media/batchplay/) — official. Adobe actionJSON descriptors and versioned app-specific execution options.
- **[S31]** [Dafny verification-aware programming](https://dafny.org/dafny/DafnyRef/DafnyRef) — official. Contracts, program proofs, and source to verified compilation.
- **[S32]** [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/info/rfc8785/) — standard-informational. Deterministic JSON serialization with explicit restrictions.
- **[S33]** [GitHub Linguist languages.yml](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml) — official. Language/file extension classifier. Not sufficient to infer execution semantics.
- **[S34]** [JetBrains MPS language composition](https://www.jetbrains.com/mps/concepts/) — official. Editable AST and projections without textual parsing.
- **[S35]** [OCaml ppx deriving](https://github.com/ocaml-ppx/ppx_deriving) — official. Type-directed generation via annotations; hygiene concerns.