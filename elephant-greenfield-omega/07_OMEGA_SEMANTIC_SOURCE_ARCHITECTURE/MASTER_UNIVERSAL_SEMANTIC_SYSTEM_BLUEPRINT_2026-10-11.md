---
title: "Ω Universal Semantic System — Master Vision, Architecture & Build Blueprint"
subtitle: "A source-native, self-describing semantic protocol, compiler, knowledge fabric, governed runtime and autonomous evolution laboratory"
author: "VOMEGA — consolidated owner direction and engineering synthesis"
date: "2026-10-11"
version: "1.0 — build-grade research charter; implementation choices explicitly provisional"
---

# Executive mandate

**Build a sovereign, source-native semantic system in which adding a protocol-conformant file can add intelligible, addressable knowledge and potentially new capabilities across the entire environment—without hardcoding the domain into the kernel, manually editing a central ontology, or granting that file authority to execute merely because it describes executable code.**

The scope is **anything digital and its physical/technical foundations**: mathematical ideas, algorithms, programming languages, compiler operations, SQL, data infrastructures, networks, operating systems, file formats, CPUs/GPUs, semiconductor manufacturing, hardware interfaces, cloud stacks, applications, Photoshop filters, agents, protocols, AI systems and future unknown disciplines. The system is not tasked with pre-seeding all of this. Its primary artifact is an **evolution mechanism** that accepts unfamiliar knowledge, turns it into well-typed semantic records, connects it to existing meaning, produces coherent machine/human representations, and learns from observable discrepancies.

This specification is a handoff for a senior interdisciplinary builder. It describes the desired behavior, architectural boundaries, conceptual contracts, worked examples, integration surfaces, experimental program, acceptance criteria, and unresolved research decisions. It is not a claim that these capabilities are already built. **Target:** a new PhD-level engineering lead should be able to reconstruct the project's design intent and organize the initial implementation without reading the entire VOMEGA archive. The precise remaining 5% is primarily deployment-specific evidence, source code, owner decisions at still-open boundaries, and experimentally selected implementations.

## Ten statements that must survive every redesign

1. **The protocol lives in source and semantic artifacts, not in a prepopulated database.** Indexes are compiled, disposable, verifiable projections of source-bound meaning.
2. **The kernel describes itself under the same protocol it defines.** A small, independently checkable bootstrap root breaks the apparent self-reference cycle; self-description is not self-certification.
3. **The semantic domain is open-world.** Unknown domains, technical layers and relations can be defined by extension; the fundamental grammar and identity/evidence/authority rules are small and bounded.
4. **A conformant new file participates in global discovery automatically, but not global execution automatically.** Discovery, admission, verification, environment availability and effect authorization are different gates.
5. **One canonical semantic meaning, many representations.** Machine IR, plain-language reading, source-grounded Wiki, UX visuals, agent capsules and physical search indexes are related projections, not independent authorities.
6. **The compiler produces a typed, versioned semantic intermediate representation (Semantic IR) before any physical-index selection.** A logical graph is useful, but a graph database is not mandatory.
7. **The indexing architecture is itself semantically described.** The system can say which index answers which query, what it costs, what it omits and why it was selected; it may propose alternatives and test them without silently replacing its trusted core.
8. **The only meaningful semantic improvement loop is observed human↔machine/source/intent discrepancy.** LLMs, fuzzers, simulations and benchmarks generate hypotheses and falsifiers; they do not automatically become oracles.
9. **Human intention and authorization remain sovereign.** Neither an LLM, a source file, a semantic ID, a proof, a plugin nor a compiled cache grants authority to affect the outside world.
10. **The system is built by small, falsifiable experiments and independently accepted artifacts.** A good diagram, large agent count, high token volume, benchmark cherry-picking or exhaustive feature inventory is not evidence of product progress.

## Decision and evidence status legend

- **OWNER DIRECTED** — explicitly articulated design intent in the conversation or current owner decision record; does not necessarily choose a mechanism.
- **PROTECTED INVARIANT** — important inherited rule whose alteration requires explicit decision, negative/positive test evidence and migration.
- **CANDIDATE CONTRACT** — concrete interface offered to enable experimentation; not yet ratified as a stable wire format.
- **EXPERIMENTAL RESULT** — measured in a named fixture/environment; not general product proof.
- **OPEN RESEARCH** — trade-off requiring representative workload and independent test.
- **NOT IMPLEMENTED** — described as desired functionality only.

**Hierarchy in this greenfield:** latest scoped owner decisions and safe, source-pinned observations take precedence over older, contradictory prose. The current greenfield decision corpus is `elephant-greenfield-omega/CANONICAL_DEVELOPMENT_CORPUS.md` and batches; **older D1/Ratchet product planning is reference for this greenfield rather than binding runtime architecture**. The existing MVP north star remains a product target, not evidence of implemented behavior. Details and links are in the source register at the end.

# Part I — Problem, motivation and target experience

## 1. What existing development paradigms get wrong

Modern digital systems have knowledge scattered across source files, ASTs, APIs, documentation, SDKs, package registries, OS state, agents, devices, bug reports, specifications, telemetry, standards, external services and users' minds. A compiler may understand types but not the user's intention; a database may store relationships but not their semantics; an LLM may describe an algorithm but not whether the installed implementation supports the claimed parameters; a plugin can advertise an action without proving its effect; a Wiki can describe code that no longer exists.

Today's systems repeatedly translate meaning without preserving an authoritative relationship between **the thing**, **its description**, **its realization**, **its environment**, **the user's intended use**, **the observed outcome** and **the evidence for each claim**. VOMEGA's proposed answer is a source-native semantics layer with independent evidence and effect governance.

The system is emphatically **not** (a) an LLM-backed giant glossary, (b) a static catalog of 1,000 commands, (c) an entirely new general-purpose programming language replacing TypeScript/Rust/SQL, (d) one centralized graph database, (e) an unrestricted agent with live access to everything it can describe, or (f) a documentation generator. Those may be surfaces or supporting subsystems, but not the organizing abstraction.

## 2. North-star experience: add a file, gain intelligible capability

Imagine a user or engineer drops `sql_select.semantic.ts` into an approved workspace. It contains ordinary TypeScript implementation (or a well-defined wrapper over SQL), parameter definitions, dependencies, algorithm/semantics claims and Ω protocol declarations. The system:

1. notices the new file and records exact content identity, provenance and origin;
2. parses the source **without executing it**; validates syntax and the source-native Ω declaration;
3. discovers exported symbols, parameter shapes, observable static facts and declared semantic meaning;
4. reconciles declarations with AST/types, imports, tests and approved dependency versions;
5. resolves known concepts (`database`, `relation`, `query`, `projection`) and preserves newly introduced concepts as proposed nodes if they cannot yet be verified;
6. compiles a canonical semantic IR and a stable publication/snapshot identity;
7. updates appropriate **derived** projections: compact dependency graph, SQL/exact index, full-text search, code navigation, Wiki, intent/command vocabulary and agent-readable capability inventory;
8. records consumers and invalidation dependencies so a subsequent source edit cascades correctly;
9. determines applicability to the *actual* user environment (DB dialect, connection, credentials, permissions, version and capability support), with `UNKNOWN` when unobserved;
10. lets the user ask “what does this do, where can I use it, what does it touch, what are alternatives?” and obtain a source-grounded explanation;
11. only if a compatible realization is independently verified and authorized, allows an explicit guarded dispatch and records real receipt/evidence;
12. feeds any difference among declared behavior, machine interpretation, human reading and observed behavior back into the **same** semantic experiment loop.

**The file's structural knowledge can propagate globally on admission. Its operational power cannot propagate by assertion.** A protocol-conformant file is a semantic contribution; it is not a signed permission slip.

## 3. Four progressively stronger meanings of “the whole system knows it”

- **Indexed:** it is addressable; the system can retrieve the packet and exact source anchors.
- **Understood structurally:** its type/contracts and relationships are checked, queryable and explainable. Claims still carry maturity.
- **Grounded contextually:** actual environment, versions, dependencies and available realizations are checked for a particular user/task.
- **Operationally admitted:** the selected realization has sufficient behavioral evidence, sandbox/permissions/consent and an active, non-stale dispatch gate.

Do not call all four “installed.” This separation is one of the system's primary truth features.

## 4. Product and research relationship

The long-term VIVIM-Ω proposition is **human expression ↔ canonical meaning ↔ governed execution** within a user-owned digital environment. User-facing modalities—floating command box, canvas, CLI, browser controls, SDK, MCP, future devices—are replaceable views on the same semantic layer. The current owner MVP north star (`mvp/NORTH-STAR.md`, 2026-10-11) is a command-first floating interface, supported initially by an effectively empty infinite 3D development canvas with an expandable contextual Wiki. In the first product the user can register existing AI providers/accounts, choose targets, fan out prompts and retain local activity; reading responses in provider browsers is sufficient. This **does not** mean the universal Semantic SDK requires Chrome/Chromium, Tauri or any browser to compile a pure semantic file. UI/browser/E2E work is required only when relevant to specific product behavior or human-comprehension evidence.

The separate **Elephant greenfield development system** explores long-lived/reconstructable domain cognition and parallel agents. The latest owner decisions explicitly direct embedding the single semantic human/machine experiment loop **inside Elephant development**, not operating a detached SDK “phase after Elephant” nor importing older product/Ratchet authority as greenfield law. The integration is a live research obligation, not a completed implementation.

# Part II — The unified conceptual architecture

## 5. The entire stack in one schematic

```text
  DIGITAL REALITY + USER WORLD + ORIGINAL SOURCE/EVIDENCE
  TS/Rust/SQL/docs/APIs/protocols/math/app filters/hardware/device specs
                         |            |
                         |       natural-language user intent
                         v            v
  +-------------------------------------------------------------------+
  | FILE-NATIVE Ω SEMANTIC SOURCE PROTOCOL                             |
  | symbols, types, operations, contracts, relations, claims, evidence |
  | kernel/encoding/indexing implementations describe THEMSELVES here  |
  +-------------------------------------------------------------------+
                        |              ^
                        v              | proposed verified evolution
  +-------------------------------------------------------------------+
  | SMALL BOOTSTRAP / COMPILER SDK                                      |
  | parse → anchors → symbols → imports → type/effect check → link     |
  | → canonicalize → semantic IR → immutable publication              |
  +-------------------------------------------------------------------+
                       |                  |
       +---------------+--------+         +-----------------------------+
       v                        v                                       v
  CANONICAL SEMANTIC IR   PROVENANCE/EVIDENCE                     INTENT RESOLUTION
  typed objects/edges    contradictions/unknowns                World/alternatives
  signatures/constraints source and tests                       canonical command
       |                        |                                       |
       +------------+-----------+------------------+--------------------+
                    |
     +--------------+----------------------------------------------+
     | REBUILDABLE, VERSION-BOUND PROJECTIONS (0..N)                |
     | packed graph | relational | FTS | vectors | columnar | Wiki |
     | agent capsule | visual intent | dependency index | context |
     +--------------+----------------------------------------------+
                    |                           |
                    v                           v
       SELF-DESCRIBING QUERY PLANNER      HUMAN ↔ MACHINE PROJECTIONS
       evidence-backed backend choice    single publication/why trace
                    |                           |
                    v                           v
       READ / EXPLAIN / SIMULATE       DISCREPANCY / INTENT FEEDBACK
                    |                           |
                    v                           v
       AUTHORIZE → REALIZE → RECEIPT   EXPERIMENT → FALSIFY → REVIEW
       (separate effect security)      → revised semantic source
```

This is a **logical architecture**, not a mandate for a microservice topology. It may run as a small portable process and a few immutable files in its first instantiation.

## 6. Five planes with distinct truth boundaries

### Plane A — Authored, observed and external reality

Original version-pinned source, hardware/application environments, personal World/Vault, external standards, observed tests and human intentions. No one “universal DB” is authoritative for all realities: a user account fact has different custody than a C++ compiler fact, which differs from a manufacturer's data sheet.

### Plane B — Source-native semantic definitions

Protocol-conformant modules and pinned external documents declare or evidence semantic meanings. The source carries symbolic identity, typed contracts and provenance. It can describe the compiler, index implementations, user capabilities, algorithms, mathematics, physical process stages and source types. The protocol is a **meaning/interchange layer**; it does not require all algorithms to be expressed in a custom DSL.

### Plane C — Canonical semantic computation

The kernel/compiler emits typed Semantic IR and immutable publication snapshots. Stable semantic identity, definition version, file hash and publication hash remain different identities. Semantic claims can be `SOURCE_DECLARED`, `MECHANICALLY_EXTRACTED`, `BEHAVIOR_OBSERVED`, `INDEPENDENTLY_ADJUDICATED`, `CONTRADICTED` or `UNKNOWN` without changing identity.

### Plane D — Materialized knowledge and representations

Compiled graph/text/SQL/binary/vector indexes are **caches or read models**; context-aware query results and machine/human/Wiki/UI renderings have exact source/snapshot lineage. A vector nearest neighbor is a retrieval hypothesis, not a verified semantic relation.

### Plane E — Work, effects and feedback

Governed runtime resolves targets/realizations, checks authority/consent/policy and creates attributable Work receipts. Human/machine discrepancies, source mismatches and observed behavior feed one experiment loop. Promotion does not mean “LLM agrees”; it means a candidate passes independent falsifiable gates.

## 7. What is and is not universal

The **domain** is unbounded: no closed list of languages, files, protocols, applications, chips or processes. The **mechanisms** are bounded: parseable carriers, local identity rules, finite type and effect checks, reproducible compilation, explicit exceptions, named evidence states and proven effect gates. The protocol must support `Unknown`, conflicts, partial extraction, incompatible version and undecidable claims as ordinary results. It must never claim that syntax checking alone establishes deep algorithmic equivalence, formal correctness or live availability.

In an open-world knowledge system, missing facts mean **not known**, not false. An explicit closed-world constraint may be used *inside a named bounded context* (for example, “this exact enum has three values”), but is never assumed globally. Newly found relationships need evidence, and adding a new domain vocabulary must not require recompiling the kernel's hardcoded list of topic categories.

# Part III — Kernel, protocol and language semantics

## 8. What “kernel is the source code” actually means

The kernel is **a minimal implementation plus self-describing protocol-compliant source**. It specifies and implements enough behavior to read and check its own semantic declarations. This is stronger than keeping a README about the kernel, but weaker than the logically impossible claim that a system can prove its own correctness by declaring it.

**Proposed immutable bootstrap responsibilities (candidate, not finalized implementation language):**

1. decode the carrier and check syntax and schema/profile version;
2. identify content, semantic symbols, definition revisions and signatures;
3. establish namespace/scope/import/linking rules and deterministic conflict handling;
4. enforce a small structural type vocabulary and effect/constraint rules;
5. retain exactly anchored source and evidence classes;
6. normalize canonical semantics and produce reproducible semantic publication identity;
7. emit and reconstruct portable canonical IR with explicit unknowns;
8. validate read-only projection integrity and exact snapshot binding;
9. distinguish file import, semantic interpretation and executable authorization;
10. reject dangerous/unresolved state without silently upgrading trust.

This list should be minimized by independent reference implementations; do not embed SQL, OpenAI providers, Windows, UI widgets, rendering themes, graph storage engines, hardware device lists, application names or domain-specific grammar into the constitutional root.

### 8.1 The bootstrap cycle, precisely

1. A minimal bootstrap interpreter B0 recognizes a finite invariant syntax/primitive definition set P0.
2. The same P0 has an Ω-conformant source declaration `omega/kernel.semantic.ts` or equivalent carrier.
3. B0 reads that source, obtains an internally meaningful description of its own supported operations, and publishes a self-model.
4. Independent implementation B1 reads the same conformance suite and canonical packets; B0 and B1 must agree on semantic results and reject deliberately mutated definitions.
5. Revised compiler K1 can be compiled from its conformant source and recompile its own semantic packet; compare its outputs to an independently frozen checker, rather than treating the new compiler's self-report as proof.
6. Any change to foundational interpretation requires a versioned migration, dual-run differential evidence and an independent promotion decision.

**Self-description is a property to measure; self-proof is not assumed.** Formal proof of restricted portions may be added later, never inferred from mere recursion.

## 9. A minimal open-world meta-vocabulary

The initial vocabulary is intentionally small and extensible. The labels below are **candidate semantic classes**, not final syntax or a forced node storage schema.

| Meta concept | Required meaning | Typical examples |
|---|---|---|
| `Symbol` / `Entity` | an addressable thing with stable identity and scope | user object, SQL table, CPU instruction, app API |
| `Type` | validity/shape of values and operations | `Image`, `Float`, `Table<Row>`, `Voltage` |
| `Relation` | typed reference among semantic subjects | dependsOn, implements, realizes, derivesFrom, contradicts |
| `Operation` | action/transform with signature and effects | SQL SELECT, TCP route, image blur, create file |
| `Algorithm` / `Transform` | reproducible logical/mathematical procedure | convolution, sort, query planning, DFT |
| `Constraint` | predicate that narrows permissible meaning | unit, range, type, precondition, postcondition |
| `Realization` | concrete mechanism of a semantic capability | TypeScript function, DB query, API call, hardware opcode |
| `Context` / `Environment` | scoped applicability and observed resources | OS, app version, installed GPU, account |
| `Claim` / `Evidence` | asserted fact + witness/maturity/uncertainty | specification line, test trace, measured latency |
| `Publication` / `Event` | frozen interpretation and its history | compilation snapshot, corrected reading, receipt |

Do **not** code these as a single mandatory class tree. Types/operations may also be objects within their own domain; typed n-ary relations, qualification over time and hyperedges should be representable without silently flattening qualifiers. Definitions can be extended using new typed predicates and domain packs.

## 10. Semantic identity rules

Four identities are mandatory and must not collapse:

- **Concept identity** — stable name for what a thing means (`capability:db.select` or `concept:gaussian-convolution`). It must not embed current risk class, backend choice, user account or platform.
- **Source/version identity** — exact bytes, dependency digest, author basis, extracted spans and declaration revision. Updating code does not automatically redefine all concept identities.
- **Publication identity** — digest over an agreed canonical meaning snapshot, checked compilation context and relevant source/reference versions; independent from UI rendering. Different meaning must not alias the same publication.
- **Execution identity/permit** — short-lived, scoped, one-use authority and Work receipt bound to current world, target, selected realization, policy and user consent. A publication digest alone never grants it.

Namespacing must avoid untrusted packages seizing established identities; identifiers must be collision-resistant or locally scoped with explicit ownership. Aliases, deprecated IDs, forks, merges, and semantic breaking changes need migration/lineage records. Reference bindings to *external* artifacts must specify a retrieval policy and pinned version; raw URLs without trustworthy content digest or explicit staleness are insufficient for immutable compilation.

## 11. Type, effect, math and algorithm contracts

A universal capability record must be able to express a typed signature, parameter defaults and units, structured errors, preconditions, postconditions, declared side effects, reversibility or compensating behavior, static/dependency requirements and source evidence. It must distinguish mathematically specified semantics from implementation-specific approximations. Exact/approximate/handoff **fidelity** and observed/verified **maturity** are separate axes.

Math must be modeled as more than prose. Candidate contracts include formula/AST notation with declared symbol types and units, numeric domain and precision/rounding assumptions, shape constraints, invariants, optimization objective, error bounds, deterministic/nondeterministic flags, random seeds, algorithm variants and hardware-specific approximations. The first implementation may carry opaque source-backed formulas rather than verify arbitrary math; it must label unverifiable portions accurately. General theorem proving or equivalence checking is a separate research problem.

**Examples:** a Gaussian blur may have `sigma` in pixel units, kernel support/radius, boundary policy, color-space interpretation, separable approximation and output shape; an SQL SELECT may be read-only against a particular connection but can still move sensitive data across a network; a CPU fabrication step has process materials, temperatures, equipment, metrology tolerances and safety/licensing provenance, not an executable local command.

## 12. File-native source protocol and ingestion

A protocol contribution should be possible as:

- TypeScript source with statically inspectable Ω declarations adjacent to actual exported implementation;
- language-neutral sidecar/manifest referencing exact code symbols and hashes;
- standalone semantic data packet or documentation extract with no executable implementation;
- dynamically observed system/application capability **as an observation**, not a fabricated source implementation.

**Default candidate for greenfield experiments:** TypeScript with static literal definitions or a strongly typed API, because the owner has indicated TS as the default greenfield implementation language. This is a preference, not a constraint on future Rust/C/SQL/EDA/firmware carriers. To preserve no-dependency portability, try a minimal self-contained reader before requiring a large framework; a real AST/type checker is necessary to graduate from string scanning to production conformance.

The importer must never `import()` or evaluate an untrusted TypeScript module merely to discover its metadata. Compilation-time read != execution-time privilege. Static declarations can be signed or hashed separately from executable modules; static extraction must explain what is structurally verified and what is only declared.

### 12.1 Illustrative file: TypeScript SQL capability

The following is **proposed syntax**, not a frozen SDK API or evidence of a SQL driver. It shows how logic, contracts, domain relations and realization bindings coexist while remaining statically discoverable.

```ts
// sql_select.semantic.ts — ILLUSTRATIVE ONLY
import { semantic } from "@omega/protocol";

export const Select = semantic.operation({
  id: "capability:db.select",
  revision: "1.0.0",
  summary: "Retrieve a typed projection of rows from a relation",
  inputs: {
    relation: { type: "ref:db.relation" },
    projection: { type: "list:db.column" },
    predicate: { type: "optional:db.predicate" }
  },
  returns: { type: "db.result-set" },
  relationships: [
    { kind: "uses", target: "concept:relational-algebra.selection" },
    { kind: "uses", target: "concept:relational-algebra.projection" }
  ],
  effects: ["reads:database", "may:transfer-data"],
  requires: ["capability:db.connection", "dialect:compatible"],
  evidence: [{ kind: "source-declared", anchor: "sql_select.semantic.ts#Select" }]
});

// Ordinary application logic. The compiler may establish signatures and
// symbol linkage; behavioral proof needs independent tests and observation.
export async function selectRows(
  adapter: ReadonlyDbAdapter, query: SafeSelectPlan
): Promise<ReadonlyArray<Record<string, unknown>>> {
  return adapter.executeSelect(query);
}

export const SelectBinding = semantic.realization({
  implements: "capability:db.select",
  entrypoint: "selectRows",
  fidelity: "claimed-exact",
  environment: { requires: ["db-adapter:compatible"] },
  admission: "UNVERIFIED_CANDIDATE"
});
```

The `@omega/protocol` symbol here stands for a future declarative interface; **do not make the protocol depend on importing/executing a runtime npm package**. An AST compiler could statically recognize this form, or replace it after experiment with a better carrier.

### 12.2 Required importer outcomes

Every ingestion produces a **receipt** stating: `ADMITTED`, `CANDIDATE`, `QUARANTINED`, `REJECTED`, or `PARTIAL`; exact source digest; recognized profile and symbols; unresolved references; semantic/structural claim classes; derived publication ID or explicit absence; affected dependency/index/Wiki consumers; test status; and any execution restrictions. Missing import, ambiguous ID ownership, incompatible signature or source/metadata mismatch cannot silently produce `READY_FOR_EXECUTION`.

## 13. The universal discovery and automatic evolution system

Do not seed 1,000 arbitrary entries to simulate universality. Seed **the rules for discovering, checking and representing any entry** plus a small, deliberately heterogeneous conformance corpus. The discovery controller can accept a user instruction such as “add this documentation,” “incorporate these commands,” or “20 LLM workers investigate storage/CPU instruction semantics for five hours.” Model activity is bounded by an actual scheduler with leases, source budgets, cancellation, trace and budget accounting—not by a prompt saying “pretend to work for five hours.”

**Candidate discovery loop:** ingest original source → classify carrier/rights/version → extract deterministic facts → assign candidate identities → retrieve existing concepts → detect synonyms/equivalence/conflicts → ask independent LLM workers for *proposed* relationships and tests → link real source citations → issue falsifier tasks → run allowed static/dynamic checks → adjudicate → publish candidate/admitted revisions → propagate versioned projection invalidations → capture user/machine discrepancies.

Discovery must support arbitrary source types via pluggable extractors and parsers with explicit capability and trust claims. Unknown binary formats or vendor-proprietary documents may remain opaque, externally linked, license-constrained or not permitted to ingest. “Unbounded” means the conceptual ontology and extensibility mechanism are not closed; it does not imply unlimited access, physical possibility, licensing, runtime capability or safe permission.

## 14. Core self-description and protocol upgrades

Kernel `parse`, `link`, `canonicalize`, `emitIR`, `explain`, `planProjection` and `verifyProjection` should themselves appear as semantic operations with source linkage, effects (`PURE_READ`, `WRITE_BUILD_ARTIFACT` etc.), dependencies and falsifiers. A system query such as “why does semantic ID creation normalize Unicode?” should resolve a versioned design claim and the check that enforces it.

Protocol extension supports new domain predicates without a kernel edit. A **meta-protocol change** (e.g., a new representation of identity, types or canonical bytes) has elevated cost: version-bump the profile, compile old/new in parallel, retain migration mappings, challenge with independent implementations and negative fixtures, and ensure old artifacts remain readable or explicitly blocked. Do not allow any newly loaded file to override the root validator or authority state machine.


# Part IV — Compiler, Semantic IR and compaction

## 15. Compiler responsibilities and stable interfaces

The compiler is not simply AST→graph serialization. It is the point where **source claims, implementation structure, context and semantic contracts are checked and made explicit**. A single **logical** IR format is proposed, independent of carrier language and data store. Multiple parsers and coders may target it.

**Compiler passes, minimum candidate order**:

1. **Inventory:** identify sources, carrier profile, binary/text classification, source revision, external-reference policy and license/security restrictions.
2. **Parse:** decode original language with an appropriate parser; capture AST/symbols and exact source anchors. Return partial/unsupported rather than guess for syntaxes beyond the extractor.
3. **Extract:** obtain structural exports, types, annotations, comments and discovered dependencies with classified origins; never conflate string literals with semantic declarations.
4. **Normalize:** canonical source representation, namespace rules, canonical identifiers, units and data types; reject ambiguous identities or unsupported normalization.
5. **Resolve:** link imports and references against pinned namespace/version environment; mark intentionally external/unknown edges.
6. **Check:** validate types, signatures, effects, declared policy constraints, relation arities and source–declaration agreements. Differentiate static validation from semantic/behavioral verification.
7. **Construct IR:** typed nodes, edges, n-ary relation event objects, claims, uncertainty, context constraints and source proof anchors; preserve cycles where meaningful.
8. **Canonicalize:** produce deterministic topology-independent logical form, domain-separated digest and source-bound dependency publication; control ordering and Unicode/number semantics explicitly.
9. **Project:** materialize one semantic snapshot into machine-readable packet, understandable reading, Wiki, agent exchange, query indexes and impact map.
10. **Publish:** produce signed/hashed where supported, immutable manifest with versions, incomplete states, negative results and source/evidence custody.

Passes must expose typed diagnostics with spans, severity, class (`PARSE`, `TYPE`, `UNRESOLVED`, `SEMANTIC`, `EVIDENCE`, `EFFECT`, `STALENESS`, `PROJECTION`, `SECURITY`) and recoverability. Early rejection must not discard useful safe partial extraction. All outputs require input and compiler-profile identity.

**Candidate pure API** (deliberately independent from current Python Phase 0 interface):

```ts
type CompileRequest = {
  sourceSet: SourceArtifactRef[];              // exact digests, no wildcard internet fetch
  protocolProfile: VersionedRef;
  compilerProfile: VersionedRef;
  externalRefs: "pinned-only" | "allow-stale-as-unknown";
  worldSnapshot?: VersionedRef;               // only for environment-bound projections
};

type CompileResult = {
  status: "ACCEPTED" | "PARTIAL" | "REJECTED";
  semanticIR?: ImmutableIRRef;
  publication?: ImmutablePublicationRef;
  sourceManifest: SourceManifestRef;
  diagnostics: Diagnostic[];
  claimClasses: ClaimMaturitySummary;
  affectedConsumers: SemanticId[];
};

compile(req: CompileRequest): CompileResult;
project(ir: ImmutableIRRef, profile: ProjectionProfile): ProjectionReceipt;
query(snapshot: ImmutableIRRef, request: SemanticQuery): QueryResult;
explain(queryOrCommand: Ref, snapshot: ImmutableIRRef): HumanReading;
```

Do not assume `compile` can always produce a trustworthy `ACCEPTED` IR for unrestricted arbitrary programs: undecidable behavior, dynamic reflection, native code, macros, network state and external hardware are unavoidable. These cases must be partial/opaque until appropriate evidence arrives. **Static file conformance is achievable; perfect behavioral understanding of arbitrary code is not.**

## 16. IR logical data model (candidate typed hypergraph)

A practical logical envelope should handle:

- **Nodes** — concepts, types, operations, transforms, source symbols, realizations, worlds, contexts, constraints, claims, observations, events, protocols, deployments, tests, indexes, queries and planners.
- **Edges** — versioned, qualified relations (`implements`, `dependsOn`, `partOf`, `mapsTo`, `requires`, `produces`, `derivesFrom`, `conflictsWith`, `provenBy`, `validIn`, `changedBy`, `realizedAs`, etc.). New relation predicates are ordinary semantic definitions.
- **N-ary assertions** — e.g., “A provides B in environment C subject to constraint D at time T, according to source S”; avoid lossy conversion to a simple A→B arrow.
- **Typed values** — numeric types and ranges, structured records, units, formulas, qualified literals, content refs, sets/maps/sequences and uncertainties.
- **Claim/evidence pairs** — a fact is asserted with a source and epistemic class; contradicted claims remain expressible side by side.
- **Observed world snapshots** — state is never permanently baked into global concept identity. Time/version/target matter.

**Candidate IR shape** (JSON for readability; not the chosen compact encoding):

```json
{
  "profile": "omega-ir/candidate-1",
  "source_set": "digest:SOURCE_SET_HASH",
  "symbols": [
    {"id":"capability:db.select","kind":"Operation","rev":"1.0.0"},
    {"id":"concept:relational-algebra.projection","kind":"Algorithm"}
  ],
  "assertions": [
    {"subject":"capability:db.select",
     "predicate":"semantic:uses",
     "object":"concept:relational-algebra.projection",
     "claim":"declared",
     "source":"anchor:sql_select.semantic.ts#Select"}
  ],
  "effects": [
    {"subject":"capability:db.select","kind":"reads:database",
     "status":"DECLARED_NOT_OBSERVED"}
  ],
  "unresolved": [],
  "compiler_profile": "digest:COMPILER_BUILD_AND_RULES"
}
```

This is intentionally a neutral **semantic graph-like object model**; do not freeze RDF, LPG, OWL, JSON-LD or a bespoke hypergraph before lossless mapping tests. JSON-LD and SHACL can be useful interop/validation projection targets; neither alone defines the entire semantic execution law. MLIR is relevant prior art for extensible dialect/operation IR and multiple forms of one meaning, but Ω does not automatically inherit its SSA or compiler requirements.

## 17. Two-way compiler laws and metamorphic properties

To make the language testable, distinguish several kinds of “round trip”:

1. **Source semantic recompilation:** `compile(source, pinned profile)` produces the same canonical semantic publication after file-order or irrelevant serialization changes. A meaningful contract change changes the correct revision/publication IDs.
2. **IR→index→IR:** decode a physical projection and reconstruct the fields required by its declared fidelity profile. A store may be a *partial index* so long as its omissions are declared and remaining information remains recoverable from the authoritative publication/source. Never claim full IR reconstruction from a deliberately lossy vector index.
3. **IR→reading→IR:** for supported canonical machine-readable human language (“Plain Reading”), reconstruct the same relevant semantic fields; free natural prose cannot guarantee perfect invertibility.
4. **IR→Wiki/agent→semantic comparison:** required meaning and uncertainty/effects must be preserved; representation compression is permitted only under a declared sufficiency contract.
5. **New/old compiler dual-run:** independently implemented decoders must accept/reject identical conformance cases and account for intended version changes.

Essential transformations for testing: reorder declarations, rename private code locals, add irrelevant comments, split source across files, change a dependency version, change a semantic parameter, reverse direction of a relation, omit an effect, introduce two accounts with the same provider, mutate Unicode normalization, inject malformed external references, change environment availability. Every transformation requires an expected semantic delta classification.

## 18. Compact encoding strategy without choosing bytes prematurely

Compaction is a **measured implementation concern**, distinct from whether IR is semantically expressive. Candidate tactics:

- dictionary encode frequently repeated symbols, predicates, files and evidence classes;
- assign deterministic local ordinal IDs within a publication while preserving stable global IDs;
- store adjacency in packed typed arrays or compressed sparse row variants;
- content-address identical immutable subgraphs across revisions;
- varint numeric IDs where useful; keep fixed widths where random access wins;
- use binary shards by semantic neighborhood, hot/cold access pattern or source boundary;
- isolate human strings, code/formula blobs, provenance and time-series evidence into addressable sidecars;
- cache separately typed exact-match, reverse-edge, transitive/dependency, search and vector read models;
- include per-shard version, checksum, compatibility profile, completeness mask, rebuild recipe and invalidation fanout.

A compact graph entry **must not silently erase**: original semantic identity, source lineage, constraints, units, effect claims, contradicting evidence, alternative interpretations or invalidation reasons. What a query needs may be spread across compiled shards, but the planner and manifest must know how to rehydrate it. Provenance and context can be compressed structurally; they must not be omitted from the truth-bearing representation.

Keep binary encoding candidate options open: canonical JSON (easy debug), CBOR or similar binary interchange (versioned deterministic profile), FlatBuffers/Cap'n Proto/Arrow-like zero-copy data, custom symbol dictionary/adjacency packing, memory-mapped sharded data. No “fastest” claim without matched hardware and workloads. Size-only benchmarks are inadequate if indexing delays, memory page faults, update storms or package dependency cost dominate.

## 19. Physical storage is not logical knowledge

Logical knowledge uses typed semantic assertions; physical persistence is a **portfolio choice**. The same published IR may be read through different backends, each with a declared preservation contract.

| Candidate family | Good hypothesis to test | Known tension |
|---|---|---|
| Flat compressed document | portable snapshot, tiny artifact, reproducible reset | full-load/decompression and updates |
| SQLite + indexed edges + FTS | transactional state/exact filters/inverted text queries | graph traversal joins/index bloat and mutable snapshot rules |
| Packed adjacency / dictionary shards | immutable local dependency traversals | updates/rebuild, flexible metadata and secondary indexes |
| Content-addressed KV (e.g., redb/LMDB/RocksDB-like) | shards, blob custody, incremental changes | high-level queries/joins must be built separately |
| RDF/SPARQL engine | standardized graph semantics and interop | storage/query complexity, lossless n-ary/context mapping |
| Columnar (DuckDB/Parquet/Arrow) | experiment analytics, large scans, history | not a default low-latency mutable transaction store |
| Full-text/vector indexes | source/content retrieval and semantic neighbors | relevance ≠ semantic correctness; incremental cohesion |
| Hybrid / adaptive query planner | select appropriate read model per workload | reconciliation, consistency, complexity, index explosion |

Architecture experiments must count **all components**: physical bytes, indexes, daemon footprint, startup, read/write contention, build time, invalidation/rebuild, crash recovery, semantics fidelity, security surface, dependency installation, and migration/reversal. Cost on lower-end Windows laptops matters; a sophisticated cluster architecture is not automatically better for a local-first product.

### 19.1 Existing exploratory measurement — limited by design

The standalone conversation-handoff `omega-semantic-meta-compiler-v0.4` package includes an experimental Python standard-library IR adapter; compressed JSON, SQLite and packed adjacency projections; self-describing TS architecture sample; and 13 passing reported tests. One synthetic test used 10,000 fictional nodes, 30,000 edges and 250 neighbor/two-hop lookup bundles:

| Projection | Reported bytes | Median load/connect | Median query bundle |
|---|---:|---:|---:|
| gzip JSON | 208,825 | 107 ms | 1.25 ms |
| SQLite incl. indexes/optional FTS | 8,982,528 | 0.43 ms | 12.04 ms |
| packed adjacency | 368,491 | 14.5 ms | 2.52 ms |

This is **EXPERIMENTAL RESULT, NOT BACKEND ADOPTION**. The access methods are not apples-to-apples; Python call overhead, different load/connect semantics and optional FTS without FTS workload invalidate simplistic rankings. Scale, actual hardware, p95/p99, write/update economics, multi-domain real corpora and independent replay remain untested. The repo committed a dated design **decision record**; the standalone code was **not** committed there as of that record.

## 20. Semantic Architecture Descriptor: architecture is itself data

Every index, compiler pass, encoder, planner, parser and runtime realization should be described in the same semantic source framework. A **Semantic Architecture Descriptor** (SAD; candidate) captures:

- global semantic identity, implementation source/symbol/version hash and owner;
- domain and IR versions supported, query families accepted, loss/completeness profile;
- dependencies and platform requirements, licensing, security and update semantics;
- runtime tunables: cache size, partition shape, compression profile, indexing modes;
- expected workload and where it is **not** suitable;
- evidence: benchmark cohort, warm/cold conditions, units, uncertainty, cost, measured/estimated/unknown state;
- current deployment and compatibility observations;
- trigger for invalidation and recommended rebuild/rollback;
- alternative candidate and promotion decision lineage.

**Example self-explanation:** “This user's laptop uses the packed adjacency index for dependency traversal, while local SQLite handles exact mutable state. These representations were built from publication P at source SHA S. A comparable test measured X/Y under benchmark B; update impact is unknown and therefore the planner will not use this path for a write-sensitive operation.” Such an answer must be grounded in actual deployment/benchmark receipts, not self-referential marketing prose.

**Meta-optimization path:** observe performance/projection discrepancy → propose new SAD/configuration → construct shadow read models → replay representative queries and human explanations → independently compare correctness/effects/costs → publish a decision → activate under a reversible versioned profile. Never let an agent replace the trusted interpreter, authorization gate or canonical source in its own unchecked trial.

# Part V — Semantic intelligence, context, runtime and UX

## 21. Global semantic knowledge versus user-specific World

A digital concept may be globally understood and still irrelevant or unavailable on a user's machine. Distinguish:

**Global semantic layer:** documented concepts, technologies, algorithms, command signatures, file formats and relationships with source/evidence lineage. A Photoshop filter's general math and interface can exist here.

**Local environment layer:** actual OS, GPU/CPU features, installed apps, version, accounts, connected databases, active services, policy, permitted resources, performance constraints and current observations. The system must use stale/unknown when it has not checked the relevant instance.

**User World layer:** durable user-owned objects, workspaces, preferences, files, projects, history, permissions and activity evidence.

**Task context:** ephemeral, query-derived subset assembled for a user purpose; does not itself create new durable world truth or consent.

**Derived capability state:** for capability C and environment E at time T, answer separately `KNOWN`, `COMPATIBLE`, `REALIZATION_AVAILABLE`, `EVIDENCE_MATURE`, `AUTHORIZED` and `CURRENTLY_EXECUTABLE`. This can differ across machines/accounts/projects without changing C's ID.

### 21.1 Context resolution questions (minimum)

For any candidate operation ask: What does the user want? Which capability/target/version? What other capabilities/data dependencies? Which source claims justify availability? Which realization is compatible with this user environment? Which preconditions are satisfied? What could be changed or exposed? What policy or consent is required? Which pieces remain unknown? What negative alternative interpretation would materially change the result?

An app-specific command such as “apply that Photoshop Gaussian Blur at radius 4 to this layer” must not imply the user's Photoshop has a supported invocation interface. It may map to: a real compatible application integration, a documented manual/handoff workflow, a compatible image transformation engine outside Photoshop, or an unsupported/unknown state. The system must explain fidelity and account for copyright/license constraints on harvested vendor code/documents.

## 22. The governed interpretation and command runtime

The command path has two separable branches: (a) **interpreting and explaining a potential action** and (b) **authorized execution**. Natural language, LLM output, compiled graph state, semantic ID and source claims belong on the first side. Effects cross the boundary only through explicit capability/realization selection, current World/policy checks and consent as needed.

```text
input revision + pinned semantic snapshot + World
   → candidates / spans / partial information / alternatives
   → type-checked canonical command candidate
   → deterministic Plain Reading + consequence projection
   → exact source/display binding and environment validation
   → explicit target/realization/routing decision
   → separately scoped authority check / user consent
   → short-lived one-use execution permission
   → dispatch and observed receipt / Work state
   → evidence and reconciliation
```

Important identity separations from VOMEGA: **Provider ≠ Account ≠ Model ≠ Session**; **Capability ≠ Realization**; **Intent ≠ Execution**; **Consequence ≠ Permission**; **Routing ≠ Authority**; **Fidelity ≠ Evidence maturity**; **Semantic snapshot hash ≠ executable permit**. Runtime security policy may evolve without changing semantic capability identity.

The current Phase 0 lab already demonstrates **bounded mock-only** preview/authorization/dispatch patterns and an independent fixture-specific oracle. Those are reusable experiments, not proof of general live authorization. Its older Python prototype, finite fixture, source hash and browser UI must not be retroactively described as a full TS Universal Semantic Compiler.

## 23. One canonical publication, many honest renderings

The semantic SDK produces **one immutable canonical semantic snapshot** for a given checked input/source/world basis. Machine JSON, human Plain Reading, contextual Wiki, visual intent indicators and agent-native capsules must be linked to that same identity. Representation may differ; **meaning, ambiguity, uncertainty, consequences and provenance must not drift**.

A user typing in the floating text box sees immediately what the machine presently understands: target, Provider/Account/Model where applicable, action, arguments, required information, source confidence, effect warnings, current availability, alternatives and why. The Wiki panel shows source-grounded structural facts, known behavioral evidence, relevant relationships and source updates, not unreviewed commentary stated as truth. An agent sees the typed IR/source anchors and exact same publication identity.

### 23.1 The single semantic feedback case

For each meaning-relevant observation record:

- user-declared or reviewed intended meaning **with origin**, if known;
- machine interpretation/candidates, exact input revision and source/World versions;
- human-readable projection and what a tester *actually* understood;
- source truth claims and observed runtime/realization behavior;
- mismatch type, falsifier, witnesses and confidence/proof classification;
- proposed compiler, ontology, runtime, Wiki, agent-format or UI patch;
- independent replay verdict, promotion and rollback lineage.

A perfect IR↔Wiki parity check can still produce the wrong user meaning. Conversely, a model's own invented “expected intent” is not reliable ground truth. This dual-failure perspective is **Rule 1** of the current semantic project.

## 24. Negative intent signal: make wrong interpretations inexpensive

Use the *same* compiler candidate manifold to identify plausible and consequential alternative interpretations while a user is typing. Highlight the alternative most worth ruling out early, not merely the second-ranked likelihood. A selection can differ by scope, account, model, target, payload, timing, side effect or current availability. Estimate correction cost, ambiguity, probable downstream divergence and interruption cost. This is a candidate evaluator/projection **not a second hidden interpreter**, and it never chooses or authorizes effects by itself.

A test may compare two UI protocols on preregistered human tasks: comprehension of target/consequence, time-to-correct, downstream rework, false positives and distraction. Simulated humans are useful test generators but not substitutes for real-user comprehension evidence.

## 25. Reflection: the source-native self-knowledge and Wiki mechanism

The existing Reflection Migrator design is the bridge from legacy code to protocol conformance: **audit → extract → map → propose → verify**, retaining symbol-level source anchors. It may establish structural facts (registered operation, export, parameter type), propose semantic summaries and relationships, and identify gaps between manifest and runtime. It must not fabricate proof of behavior or rewrite user intent.

A source change should produce an **impact graph**: changed symbol → affected declarations/contracts → semantic IR nodes/edges → query indexes → Wiki pages/agent capsules/visual behaviors → tests → realizations requiring revalidation. Precise impact may initially be conservative: invalidating too much is a performance concern; showing stale certainty is a correctness failure.

The “Wiki compiler” is not a separate authoring system. It derives understandable text, examples, change explanations and source links from the same published semantic meaning. Where source facts are incomplete, it explicitly says so.

## 26. Agent / Elephant integration — in the core learning loop

An **Elephant** is a candidate long-lived or reconstructable expert context resource whose competence must be measured, not assumed. It can ingest semantic snapshots, request missing context, propose domain facts and reusable capability packs, communicate with other Elephants and preserve a versioned memory/evidence basis. Stable chat sessions are one possible realization, not the only legitimate architecture.

The owner has decided to **embed** the semantic SDK/human↔machine loop in Elephant development. The proposed minimal integration:

1. source/pack ingress becomes a versioned semantic contribution with exact source/evidence receipt;
2. each Elephant can query the same source-grounded canonical IR through a read-only, scope-bounded semantic gateway;
3. each task packet names exact semantic snapshot, source corpus version, relevant context and known coverage gaps;
4. Elephant messages preserve uncertainty, relationship/evidence links, dependency requests and alternative hypotheses;
5. a child agent's submitted code/doc/change becomes a **candidate** contribution, not authoritative new source truth;
6. a human/agent explanation of a capability is compared with what the kernel compiled and what the source actually establishes;
7. independent referee workers preserve different custody and controls; they cannot rewrite the expected results of the tests they grade;
8. the controller publishes all owned capability packs at the end of each top-level development turn **regardless of maturity**, including failed, blocked and negative knowledge;
9. a fresh Elephant session must be able to reconstruct a useful supported competence level from publications and pass held-out probes without relying on the same persistent model memory;
10. the semantic registry and the Elephant communication protocol remain **interop candidates** until conformance, cost and fidelity are measured.

Do not require a new chat platform, A2A bus, permanent swarm, model-specific context size or a complete central knowledge database to run the first slice. The research baseline compares normal coding agents/tools (E0), one independently effective Elephant (E1) and two genuinely distinct collaborating Elephants (E2). Report full lifecycle cost, token measurements where observed, and UNKNOWN where instrumentation lacks them.

## 27. Domain-scale extensibility examples

### 27.1 An HTTP route/protocol module

A protocol pack expresses request/response types, methods, status codes, routing semantics, caching, security and applicable versions. A particular server implementation binds its local routes and handlers as realizations. The system can ask which APIs handle a route, what schemas it accepts, what data it touches and whether that server is actually running. Protocol semantics do not imply network access to arbitrary hosts.

### 27.2 A Photoshop filter module

A filter pack expresses the operation's math, input image mode, kernel parameters, constraints, likely computational cost, output characteristics, numerical equivalence/approximation and specific application command mapping. It distinguishes vendor-documented UI actions, supported automation APIs, licensed code and independent algorithm implementations. At runtime it checks the installed app/version and permission path before claiming the user can “pull the filter.”

### 27.3 A semiconductor fabrication module

A domain pack models design→RTL→logic synthesis→place and route→mask generation→lithography→etch/deposition→implant→metrology→packaging→test as a *qualified conceptual process graph*, not as a control recipe for actual equipment. It can add physical units, process constraints, toolchains, compliance, material/equipment identities and evidence of applicability. Production control is a distinct high-consequence realization that requires industrial-grade verification, access controls and human/environmental safeguards; a semantic declaration is insufficient.

### 27.4 A CPU instruction or ABI module

The concept/operation graph links ISA instructions, type widths, register effects, memory ordering, traps, calling conventions, compiler lowering and microarchitectural performance claims. Compiler implementations are pinned to versions; CPU availability is based on observed hardware/OS state, not merely the abstract ISA definition. Side-channel and privilege-sensitive operations must retain effect/authority distinctions.

### 27.5 A new unknown digital domain

A new file can introduce unfamiliar domain classes, parameters and relations using the universal vocabulary. If the compiler cannot classify a relation, it can preserve a namespace-scoped typed candidate rather than rejecting all content or inventing a nearby domain label. It creates structured discovery questions and tests; the wider semantic network can reference the candidate before the entire new domain is modeled, while marking unresolved portions precisely.

## 28. Privacy, licensing and content custody

User-owned source, device state, account metadata and activity can include secrets or private data. Default import is local-first; external LLM fanout needs explicit origin, destination, data-minimization and user policy. Never assume a public repository license permits wholesale reproduction of commercial API docs, software code, proprietary hardware models or user-private source. Each intake receipt should carry license/access constraints, retention policy, source location and any restrictions on index/export/projection. The system must support saying “I know that such an object exists but cannot ingest/distribute/execute its contents.”

A content hash ensures byte identity, not source authenticity, a valid license, semantic truth or permission to execute. A signature may establish an attested author key, but trust still depends on policy, source custody and independent checks.


# Part VI — Evolution laboratory, testing and scientific method

## 29. Development philosophy: one vertically integrated learning loop

This is **not** a sequential program of first perfecting the SDK, then designing the human Wiki, then automating experiments, then integrating the Elephants. From the very first capability the compiler should produce canonical machine meaning **and** faithful human-readable explanation; discrepancies from users, sources, runtime and agents should generate the next experiment. The same loop gets richer as independent components mature.

The smallest useful loop is a code-defined operation with one typed argument and explicit effect → compiler source anchor → canonical meaning → deterministic human reading and Wiki fragment → test of user/agent understanding → discrepancy → proposed code/semantic patch → independent replay. It should run fully headless for the pure compiler path. Visual and browser tests join when the hypothesis involves human comprehension, revision racing or real UI behavior. A pure language test should never be blocked on setting up a specific browser.

All learning events require a provenance origin (`USER_PROPOSED`, `SOURCE_DECLARED`, `TEST_OBSERVED`, `AGENT_SIMULATED`, `INDEPENDENTLY_ADJUDICATED`, etc.). Generated fixtures may detect inconsistency but do not, by their own generation, establish intended semantics. Preserve negative results and variants, not only the winning candidate.

## 30. Required integrated laboratory surfaces

The lab has multiple tools, **not multiple competing truths**:

- **Source/Protocol Lab:** parse, link, test the self-describing bootstrap, generate IR and compare independent implementations.
- **Discovery Factory:** ingest unfamiliar sources, dispatch domain-oriented extraction and relationship hypotheses, test candidates and preserve evidence/unknowns.
- **Compaction/Index Lab:** generate 0..N physical projections of one IR, measure integrity, footprint, update economics, lookup latency and rehydration fidelity.
- **Runtime/Authority Lab:** run mock or isolated bounded realizations with current permit/target/source binding and negative mutation schedules.
- **Machine↔Human Lab:** produce live Plain Reading + Wiki + machine trace from the same publication and capture actual semantic discrepancies.
- **Elephant/Agent Lab:** distribute exact context packets, use expert workers to propose capability packs, test independent egress and fresh-context reconstruction.
- **Architecture Meta-Lab:** let descriptors propose self-configuration changes and benchmark them in shadow without auto-promotion.

Each lab component must export its read model, inputs, complete source identity, exact test cohort, results and maturity; it must not maintain a second semantic truth. Share interfaces and frozen fixtures, but protect independent evaluator custody and genuinely separate experimental conditions.

## 31. Cross-cutting benchmark suite (minimum named cohorts)

The following **C0–C16** suite should become a machine-readable registry of reproducible acceptance cases. Initial targets are design criteria, not claims of completed tests.

| Cohort | Question / adversarial test | Must demonstrate |
|---|---|---|
| C0 — Root bootstrap | Can the kernel parse/describe its own exact source? | Independent parser agrees; semantic self-description is truthful but not self-certified |
| C1 — New domain | Can an unseen namespace introduce a domain class and operation? | No hardcoded registry edit; new concept remains addressable and appropriately uncertain |
| C2 — File-native cascade | Add `sql_select.semantic.ts` | Source→IR→search→Wiki→agent inventory→dependency propagation with same publication |
| C3 — Cross-carrier | Represent equivalent concept using TS + neutral packet + a second AST/parser | Declared loss/equivalence profile, explain disagreements; no fake equivalence |
| C4 — Stable identity | Reorder files/comments versus real semantic edits | Meaning-preserving changes do not mutate semantic identity; meaning changes update correct revision/hash |
| C5 — Structural conformance | Incorrect symbol/signature, cyclic dependency, unknown predicate | Typed diagnostics and safe partial state, zero invented executable effect |
| C6 — Evidence collision | Independent sources disagree about the same fact | Both retained; conflict and source/time scope exposed to human and machine |
| C7 — Index reconstruction | JSON, SQLite, packed graph build from same IR | Query parity, complete or explicitly partial round-trip, stale index blocked |
| C8 — Incremental mutation | Edit one leaf, type, shared contract or codec | Correct dependency invalidation; no silent partial-revision mixing |
| C9 — Environment | Known universal capability on incompatible app/device | Explain global knowledge versus local compatibility and authorization |
| C10 — App algorithm | Gaussian blur variant/radius/boundary modes | Typed math/parameters; vendor binding is separately verified; no false exactness |
| C11 — Human projection | Mutate a consequence or target without changing Wiki output | Discrepancy detected; candidate regression attached to exact publication |
| C12 — Intent ambiguity | Two accounts/providers or multiple plausible targets | Explicit alternatives, no unauthorized READY and correction evidence |
| C13 — Dispatch security | Stale permit, changed target, replay, concurrent cancellation | Zero unauthorized effects; valid positive mock controls execute once |
| C14 — Fresh Elephant | New agent with same pack but no prior session memory | Measured context comprehension/retrieval/evidence parity with known gaps |
| C15 — Meta architecture | Change storage profile through candidate descriptor | Shadow rebuild, matched query parity, independent reviewer, rollback |
| C16 — Real workload | Mixed source documents/code/tests and actual user machine | p50/95/99 and cold-start, memory, update, correctness, proof/economics reporting |

For every cohort include positive controls, deliberately broken variants, external or holdout controls where appropriate, exact source/fixture hashes, maturity status and negative outcomes. A test that just accepts every command or rejects every command cannot score as a semantic success; paired valid/invalid controls are mandatory. Fake worker sessions and simulated timing claims must be labelled, not blended with live runs.

## 32. Storage and encoding tournament: experiments before selection

**Stage hypothesis categories, not project phases:** participants can test them in parallel while the small SDK loop keeps running.

- **Correctness/fidelity:** representation of source claims, n-ary relationships, contradictions, temporal context, constraints, effects and permission boundary; independent decode/query parity.
- **Computational footprint:** total bytes, load/decode, p50/p95/p99 warm and cold latency, resident/peak memory, flash wear/write amplification, cold rebuild.
- **Incremental change:** cost of one source edit, shared type edit, source deletion, dependency repair, cross-namespace version change, plus reader consistency during rebuild.
- **Query expressivity:** exact ID, reverse link, neighborhood, transitive multi-hop reachability, high-degree graph, type-constrained join, JSON/document retrieval, keyword text, rank/embedding, temporal history and nested contextual query.
- **Scientific repeatability:** source+IR hashes, indexed payload measurements, standardized query language subset, controlled warmup, independent checker, hardware baseline and confidence bands.
- **Integration cost:** binary sizes, package ecosystem, stability, startup process count, OS/runtime portability, debugging, observability, licensing and rollback safety.

**Minimum workload sizes:** 2k / 10k / 100k / 1m semantic objects and a separate *real mixed-domain corpus*; avoid extrapolating from one synthetic tree with simple three-edge graph topology. Mix sparse/high-degree/cyclic graphs, repeated literals, large evidence blobs, frequent and bursty updates. Capture workload characteristics before tuning an index. Compare a conventional baseline with a proposed optimized design under matched query semantics and equipment.

**Decision criterion:** no unconditional winner. A multi-backend plan is acceptable if it earns enough demonstrable value to justify synchronization, invalidation and maintenance. Conversely, the minimalist embedded-store baseline should win if advanced hybrids do not add measured utility. An architecture descriptor can be accepted **for a named workload** and rejected for another.

## 33. Security and failure model

Assume hostile or simply erroneous inputs may arrive through repo files, JSON/YAML, parser plugins, LLM-authored “fixes,” specification websites, app extensions, model packets and malformed binary indexes. Examples and mandatory mitigations:

- **Prompt injection in documents:** treat external text as data; model workers cannot elevate authority through embedded instructions.
- **Executable loader abuse:** do not execute a TypeScript module during static semantic extraction; run permitted behavioral checks only in separately governed isolation.
- **Supply-chain tampering:** pin commits/packages, validate source digest/license and maintain dependency provenance; a checksum proves identity, not goodness.
- **Identity/scope collision:** reject duplicate IDs with incompatible ownership/revision or make conflicts explicit, no last-writer-wins semantics for canonical knowledge.
- **Malicious self-description:** declared side effects or permissions are not enforced truth; check independent implementation/effect runtime boundary.
- **Stale indexes/source races:** pin publication and world epochs, check at final dispatch, invalidate all affected read models or fall back conservatively.
- **Unauthorized authority escalation:** a plugin cannot grant itself privileges via `effects: []`, `trusted: true`, a semantic hash or a test written by the plugin author.
- **Codec/parser ambiguity:** reject duplicate-map keys, invalid Unicode, unstable float/NaN encoding, cyclic value handling without reference semantics, canonical-hash divergence and resource bombs.
- **Expensive queries/unbounded discovery:** enforce CPU/memory/time/node/recursion/network budgets, worker cancellation and partial results.
- **Sensitive sources:** default local-only ingestion, scoped egress review, provenance and redaction; do not ship user-private material into public knowledge packs.
- **Irreversible external action:** explicit Work/permit, idempotency keys where possible, receipts and reconciliation on uncertain completion rather than blind retry.
- **Compromised experiment controller:** candidates cannot modify hidden holdouts or the independent arbiter that certifies them; promotion is a separate gate.

A first lab can use **read-only, mock-only** execution and still exercise many semantic laws. Do not claim that the full security story is complete because a mock test passes.

## 34. Evidence and maturity contract

Every relevant claim reports at least `claim`, `source/author`, `scope`, `timestamp/epoch`, `basis`, `status`, `confidence_if_model_estimated`, `witnesses`, `falsifier`, `contradictions`, `dependencies`, and `consumer-impact`. Keep these separate:

- **Source facts:** structurally extracted; not necessarily behavioral truth.
- **Specifications:** desired contract; not implementation proof.
- **Observed tests:** witnessed in a bounded fixture, host and substrate.
- **Historical evidence:** worked in old code or third-party implementation; not proof of this deployment.
- **LLM hypotheses:** candidates supported or rejected after source/test review.
- **Independent adjudication:** reproducible reviewer evidence, never implicit in model consensus.
- **Unknown/contradicted:** valid final interim states. No requirement to guess for appearance of completeness.

For engineering maturity preserve distinctions such as `CHARACTERIZED`, `MECHANIZED`, `VERIFIED_LOCAL`, `AUTOMATED_LIVE`, `INTEGRATED`, `PRODUCTIZED` and `SOVEREIGN_EVOLVABLE`, with linked evidence. A compiler-file test does **not** promote a Photoshop application integration to “works in Photoshop.” A trusted CPU datasheet does **not** prove that an OS permits a certain opcode to run in the current process.

# Part VII — Concrete build plan and repositories

## 35. First vertical implementation target (mandatory thin slice)

A fresh team should initially implement **one** exact source-native capability through the whole semantic learning loop. Use `capability:db.select` or `capability:image.gaussian_blur` as a canonical mixed algorithm/effect exemplar, together with one self-described kernel/index operation. The target is not a complete SQL driver or Photoshop connector. It is this reproducible sequence:

```text
1. add protocol-compliant TypeScript file (one operation + one realization)
2. static scan/parser extracts exact AST symbols, annotations and source anchors
3. compiler checks version/identity/signatures/effects/relations
4. canonical IR is emitted reproducibly, preserving claimed-vs-verified status
5. one small index is rebuilt automatically from that IR (JSON first is fine)
6. machine response lists exact operation, arguments, source, uncertainty
7. human Plain Reading and generated Wiki show the same publication/effects
8. deliberate source mutation produces a specific M/H or evidence discrepancy
9. candidate correction is proposed, independently retested and recorded
10. an Elephant agent retrieves the same capability/uncertainty from the pack
11. simulated runtime refuses effect without fresh permit/valid World/target
12. repeat from clean checkout with no prior database and no model memory
```

**Definition of done for this vertical slice:** two independent builders can run it from clean source, obtain equivalent semantic identity/snapshots, read an accurate Wiki without a hand-maintained registry, reproduce intentional failures, inspect all source/evidence links, and prove that no data-only file grants execution authority. No browser or native desktop app is required for this pure semantic slice. Later UI-bound tests should run with an actual browser environment when their behavior needs visual verification.

## 36. Suggested minimum modules (candidate file structure)

The following structure is an implementation sketch, not a directory mandate. Locate in the active Semantic SDK/Elephant research area and preserve current active labs and source custody.

```text
semantic-source/
  kernel/                # small self-conformant protocol, parser profile, types/effects
  bootstrap/             # normative fixtures and independent checkers
  carriers/              # TS static AST adapter; later neutral/SQL/Rust/docs
  contracts/             # versioned protocol envelopes, typed diagnostics, schema tests
  compiler/              # symbol linking, constraint passes, normalization, canonical IR
  ir/                    # typed logical model + canonical bytes profile + codec adapters
  source-intake/         # source classification, licensing, provenance, extractors
  indexers/              # JSON, SQLite, packed graph ... disposable projections
  query/                 # exact/relation/search/context planning and query receipts
  world/                 # environment applicability + task context; no global-policy fusion
  projections/           # machine, Plain Reading, Wiki, agent capsule, visual semantics
  runtime/               # preview/permit/dispatch; mock real effects first
  discovery/             # source-/LLM-assisted proposal and evidence workers
  experiments/           # shared discrepancy cases and independent test cohorts
  meta/                  # index/compiler self-description, profile trials and rollback
  elephant-adapter/      # snapshot/capability-pack/context/feedback interchange
  examples/              # SQL, Gaussian, HTTP, CPU/fabrication conceptual cases
  evidence/              # immutable receipts and independent adjudication
```

The package must expose a **small read-only core API** first. Individual codegen targets and physical stores must not fork semantic identity law. Formal typed contracts should keep source compilation separate from query/index rebuild, and keep both separate from authorization and effects. An experimental module can be replaced through adapters, not by changing meaning in secret.

## 37. Public SDK and exchange API proposal

Keep the stable concepts minimal and expressive. The precise naming below is **CANDIDATE**:

```ts
interface OmegaSemanticSDK {
  inspect(source: SourceRef): SourceInspection;
  compile(set: SourceRef[], profile: CompileProfile): CompileResult;
  validate(packet: SemanticPacketRef, profile: ValidationProfile): ValidationReport;
  get(symbol: SemanticId, snapshot: SnapshotRef): SemanticRecord | Unknown;
  relations(id: SemanticId, filter?: RelationQuery): RelationResult;
  find(input: SearchQuery, scope: ContextScope): SearchResult;
  explain(subject: SemanticId | CommandRef, snapshot: SnapshotRef): Explanation;
  available(id: SemanticId, world: WorldSnapshotRef): ApplicabilityReport;
  impact(change: SourceChange, snapshot: SnapshotRef): ImpactReport;
  index(profile: IndexProfile, ir: ImmutableIRRef): IndexBuildReceipt;
  introspect(component: SemanticId): ArchitectureDescription;
  emitPack(snapshot: SnapshotRef, scope: PackScope): PortableCapabilityPack;
}
```

Anything that authorizes or dispatches effects belongs to **separately permissioned interfaces**, never to `get`/`find`/`compile`. Consider `interpret(...)`, `preview(...)`, `authorize(...)`, `dispatch(...)` as a governed runtime extension with an independent security conformance suite.

### 37.1 Query result obligations

A semantic query must identify: snapshot and environment scope; whether the result is complete, partial, stale or unknown; which projections answered; any fallback; exact source/evidence refs; confidence and maturity; consistency mode; elapsed/cost if measured; and the reproducible query/planner profile. A smart planner may choose SQLite for exact context filters and a packed adjacency map for relations, but cannot silently combine incompatible source versions.

### 37.2 What to persist

The minimum durable artifacts are **source references and permitted original bytes, protocol/profile versions, canonical IR publications, event/evidence receipts and enough index manifests to rebuild projections**. Caches/index files may be regenerated. User Work/history and account data are separately durable with user custody rules. Do not duplicate all private source into public model-memory exports. Enforce age/retention and rights where appropriate.

## 38. A practical experiment sequence for a parallel 20-worker team

The controller should allocate **hypotheses**, not twenty agents writing the same code. Example independent work lanes:

- **Kernel & independent checker:** two alternative minimal bootstrap implementations; each challenged by withheld malformed cases.
- **File-native sources:** AST-based TS extraction versus a declarative sidecar; prove symbol binding and no execution.
- **Canonical IR:** typed graph/events and deterministic byte encoding; adversarial identity/number/Unicode tests.
- **Physical projection tournament:** JSON/packed, SQLite/FTS, and a graph/RDF candidate each tested under shared fixtures with distinct reviewer.
- **Human/Wiki/intent:** Plain Reading and source-linked Wiki, plus semantic mismatch cases and actual comprehension protocol.
- **Agent/Elephant adapter:** snapshot/packs handoff, context reconstruction and provenance fidelity.
- **Context/effect referee:** source/effect boundary, mock permits, stale/replay prevention, negative test corpus.
- **Discovery domain pilots:** SQL/API, media math, network protocols, CPU/EDA; each adds a genuine novel domain and falsifier.

Each lane can fan out *internally* where independent experiments make sense, but may not duplicate expensive review merely to create utilization. Let a controller assign a five-hour compute budget only through actual model-account/token/rate limits, explicit external-data policy, lease expiry and cancellation. Failed calls, retries, cold context, code review, integration and validation count toward true throughput economics.

Every top-level Elephant development turn publishes **all owned packs regardless of maturity**: candidate ideas, partial work, failing examples, negative knowledge, current status, exact source SHA, evidence, dependency and cost measurements. An export is not proof of correctness. Do not overwrite past releases to hide failures or rewrite competing proposal results. Use short-lived isolated worktrees with integration to one reviewed main, not permanent model-owned branches.

## 39. Major deliverables and handoff gates

| Deliverable | Owner-type | Observable output | Cannot be claimed complete until |
|---|---|---|---|
| D-A: Source-native kernel contract | protocol/compiler | versioned core primitives and self-description fixture | independent bootstrap agrees, mutation failures shown |
| D-B: TS file-native importer | source/compiler | AST-based `.semantic.ts` extraction without module execution | source symbols/types/effects linked; invalid imports rejected safely |
| D-C: Canonical IR | compiler/IR | portable typed snapshot + identity spec | cross-process deterministic outputs, cycle/unknown/claim support |
| D-D: M/H publisher + Wiki | semantic UX | one publication machine/human/Wiki and discrepancy record | corrupt target/consequence causes detectable failure |
| D-E: Dynamic discovery intake | knowledge | documentation/source→candidate concept→evidence | novel domain accepted without kernel category edit |
| D-F: Rebuildable indexes | storage/index | 2+ independently decodable read models | query fidelity/invalidation proven; no prepopulated DB required |
| D-G: Architecture meta-description | meta-lab | queryable backend/codec planner descriptions | claimed limitations, environment and evidence accurately surfaced |
| D-H: Mock runtime guard | security/runtime | preview/permit/dispatch and receipts | replay, mutation, incorrect authority negative gates pass |
| D-I: Elephant bridge | agent/research | portable source/snapshot pack and request/result protocol | fresh-session recovery, source/proof gaps honestly reported |
| D-J: Evaluation/decision dossier | independent lab | controlled cost/accuracy table and accepted/rejected decisions | multiple real workloads; no false winner from one synthetic run |
| D-K: Product boundary integration | product team | floating command box uses source-linked semantic capability | same meaning/authority as SDK, actual UX and environment validation |

Each deliverable should provide runnable reproduction commands, machine manifest, source fixture hashes, tests, independent check status, Windows compatibility status, measured/unknown performance and a concise failures ledger. Scope the experiment before tool/framework selection; write one falsifier per claimed advantage.

## 40. Day-zero and immediate engineering instructions

An engineer starting from this document should:

1. **Establish the actual repository epoch** and preserve existing evidence/active agent work. Read greenfield `PROJECT_START_HERE.md`, `CANONICAL_DEVELOPMENT_CORPUS.md`, current Rule 1, the semantic SDK anchor, current `MASTER_TODO.md`, and the owner MVP target. Do not equate archival dates with owner decision timestamps.
2. **Record project status honestly.** The Phase 0 Python fixture/mock lab and existing v0.1–v0.4 handoff prototypes are experiments, not the current live universal SDK. Before reusing previous experimental code, verify actual file availability, SHA, tests and rights.
3. **Make a new bounded claim/experiment** for exactly one file-native capability and its machine/human semantic output; select source/canonical facts and holdout expectations.
4. **Build the minimal parser and independent checker in parallel.** Keep the core vocabulary tiny and require exact malformed-case witnesses.
5. **Complete a no-database cold rebuild.** Delete all indexes, recompile the same source pack into IR/projections, query from a clean process, compare semantic publication digests.
6. **Demonstrate one source edit cascade.** Change a parameter effect or dependency and show correct IR, search, Wiki, agent and stale-projection impact—without manual registry editing.
7. **Run a boundary probe:** file declares an executable operation but runtime lacks installed target or explicit authority. System may explain; it must refuse actual effect.
8. **Embed the feedback into an Elephant task.** An independent agent reads the pack, explains the feature, asks a semantic question or proposes a mismatch; a reviewer can reproduce the case without that agent's session.
9. **Publish evidence and negative results** in the agreed Elephant all-state pack publication; then evaluate which new experiment will most cheaply reduce uncertainty.
10. **Only after the first vertical proof**, run matched storage/codec comparisons and add the next heterogeneous domain. Do not freeze a binary format or graph engine as a prerequisite to completing the first one-capability loop.

This is a **preferred first slice**, not a claim that the whole program must wait sequentially; independent source harvest and competing storage prototypes can run concurrently provided they do not silently establish competing authorities.

## 41. Architecture open questions and decision triggers

| Unresolved question | Why it matters | Cheapest decision-producing test |
|---|---|---|
| How much syntax should Ω own? | bespoke DSL may be expressive but costly | TS statically inspectable declaration vs sidecar vs tiny DSL on same semantic cohort |
| What is the minimal self-hosting bootstrap? | trusted code size and recursion | two independent bootstrap implementations + mutation tests |
| What exact IR graph formalism? | n-ary/time/context/logic expressivity | represent SQL, Gaussian, HTTP, CPU process and contradictory evidence losslessly |
| What canonical byte/hash profile? | cross-language identity/determinism | Python, TS and a third decoder with adversarial Unicode/numeric/map cases |
| What math verification is feasible? | claim strength and resource cost | units/ranges/invariants first, then bounded property/metamorphic tests |
| What global vs workspace naming policy? | collision, provenance and portability | conflicting namespace/package import across two workspaces |
| Which index mix wins? | latency/memory/update maintenance | common real + synthetic workloads with independent query oracle |
| How does discovery handle unverifiable docs? | hallucination and copyright exposure | unfamiliar vendor PDF/doc with missing citations and conflicting versions |
| What can an LLM change autonomously? | safe evolution and source ownership | shadow candidate affecting docs vs parser vs authority boundary |
| Which agent protocol is enough? | portability and vendor independence | fresh Elephant context transfer vs ordinary retrieve-on-demand baseline |
| How to measure human semantic parity? | Rule 1 is not just string equality | counterbalanced comprehension tests and negative consequence mutations |
| How much should product UI depend on semantics? | no privileged UI command path | same capability triggered by text, button and CLI, compare receipts |
| How far can runtime capability discovery go? | installed APIs vary, external apps are volatile | 1 read-only app integration + manual-live vs automated-live differentiation |
| How to version evolving protocol primitives? | independent clients, old packs and rollback | old/new runtime dual-read and observed migration divergence |

The team may prioritize these questions based on measured blocking dependencies, not theoretical elegance. Any decision document must give alternatives, expected advantage, counter-hypothesis, independent witness, rollback and recorded authority class.

# Part VIII — Success criteria, anti-goals and handoff

## 42. “95%-context” build acceptance: what success would look like

This section translates the overall ambition into observable milestones. A competent builder has enough context to start from this document if they can answer these questions and run the associated tests:

1. Can an unknown domain be added as source-native protocol-conformant data/code **without a kernel taxonomy edit**?
2. Can the original source and precise declared logic/algorithms/parameters/effects be linked to the emitted meaning?
3. Does the kernel expose its own checked semantic description without claiming to independently prove itself?
4. Can two implementations compile the same source into equivalent semantic meaning with stable identity?
5. Can deleting the physical DB/indexes and rebuilding reproduce supported queries and projections?
6. Can the system support different store backends and say what each preserves or approximates?
7. Does a source edit correctly invalidate a depended-on Wiki/search/agent/IR artifact?
8. Can a user tell global concept knowledge apart from availability of a specific installed app/device/account?
9. Do machine and human projections carry one publication and reveal important target/effect ambiguities?
10. Do source, user, agent and observation-derived claims retain distinct evidence and trust labels?
11. Can a model-proposed relation or tool be admitted as a candidate without silently becoming factual or executable authority?
12. Can a verified, currently compatible realization execute only after a separate guarded permission decision, with replay refusal and receipts?
13. Can a fresh Elephant reconstruct bounded actionable knowledge and reveal what it did **not** ingest or understand?
14. Does a storage/meta-optimization experiment improve measured workload performance without changing meaning or bypassing a reviewer?
15. Can the complete system report end-to-end reproducibility and total lifecycle costs rather than just tool call counts?

**First practical milestone:** items 1–5, 7, 9–11 and a *mock-only* version of 12 on two dissimilar domains. That would be strong evidence of the architecture's core hypothesis. The rest graduate through progressively harder independent experiments and real substrate observations.

## 43. What the system should intentionally refuse to pretend

- It does not “know everything” because it can store arbitrary labels.
- It cannot derive full semantics of every executable program by static inspection; it can represent known, declared and unknown parts honestly.
- It cannot make vendor features available simply by harvesting documentation or adding a source-native adapter.
- It cannot execute an arbitrary plugin because the plugin is protocol-compliant.
- It cannot make a mutable cache canonical just because it serves most queries.
- It cannot learn verified user intention exclusively from model predictions or similarity search.
- It cannot prove a processor or fabrication recipe is safe merely by validating units and constraints.
- It cannot claim production-ready maturity from synthetic tests, even many of them.
- It cannot treat a model's capability-pack publication as validation, nor rename simulator outputs “live.”
- It should not demand one architecture when a measured hybrid is superior—or demand a hybrid when one simple file/embedded store suffices.

## 44. Important prior work and how to use it

This specification **supersedes no source code** and does not silently ratify any older provisional architecture. It consolidates owner conceptual intent through 2026-10-11 and maps older work into a buildable hypothesis. The following source map explains which repository artifacts a new engineer should open when specific details become relevant:

| File/area | Why relevant | Status for this greenfield |
|---|---|---|
| `elephant-greenfield-omega/CANONICAL_DEVELOPMENT_CORPUS.md` | current development navigation and precedence | active navigation/owner history |
| `elephant-greenfield-omega/DECISION_INTERVIEW_BATCHES/2026-10-11_BATCH_02.md` (+ later batches) | owner ratified scope, Elephant integration, precedence | scope-specific owner decisions |
| `elephant-greenfield-omega/MASTER_TODO.md` | single greenfield integration queue | active queue, not autonomous PM law |
| `elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md` | one M/H/source discrepancy learning circuit | governing semantic research rule |
| `.../SDK_COMPILER_RUNTIME_ANCHOR.md` | SDK/compiler/runtime/projected meaning loop | current corrected research anchor |
| `.../rnd/META_COMPILER_SELF_DESCRIBING_STORAGE_DECISION_2026-10-11.md` | newest self-describing kernel/IR/index decision | owner intent; physical store undecided |
| `.../phase0/` | exact Python mock/oracle/fixtures and comparative data | bounded experiments and failure witnesses |
| `.../phase0/devtools/` | live interpretation/Wiki/experiment prototype | mock-only v0.1.1, not production |
| `.../MASTER_CORPUS_CONSOLIDATION_REGISTER_2026-10-11.md` | single logical corpus, provenance/projection rules | proposal; wire details open |
| `elephant-greenfield-omega/00_CORE_BASELINE/` | neutral Elephant baseline and frozen fanout cohort | independent experiment reference |
| `elephant-greenfield-omega/01_EXPECTED_OUTPUTS/` | all-state pack publishing, proof, handoff | normative for Elephant sessions |
| `elephant-greenfield-omega/05_UNIVERSAL_ELEPHANT_DNA/` | proposed general context cognition tests/genes | hypothesis, not compulsory runtime |
| `mvp/NORTH-STAR.md` | floating-box v0.5 user-facing target | product target, not current implementation |
| `seed-docs/VISION.md` / `INVARIANTS.md` / `CONCEPTUAL-MODEL.md` | enduring Ω sovereignty and semantic separations | valuable inherited product reference |
| `seed-docs/SEMANTIC-DATA-ENGINE.md` | source Reflection, World and projection data planes | candidate architecture to reconcile |
| `seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md` | existing-code AST/source extraction pathway | reuse blueprint/evidence, not new authority |
| `seed-docs/SEMANTIC-RUNTIME-LAB.md` | prior modular lab/profile rationale | historical/candidate design |
| `seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md` | counterfactual early correction | experimental UI/intent hypothesis |
| `seed-docs/PROOF-AND-MATURITY.md` | honest fixture vs live claims | inherited evidence law |
| `omega-baseline/sdk/`, `omega-baseline/plugins/vivim-nlcl-pure/` | existing source/tests for real adapter assessment | historical/existing implementation evidence |

Prior **local standalone handoff** artifacts from this conversation, not automatically in GitHub: `omega-semantic-evolution-kernel-v0.1` (candidate discovery SQLite prototype), `omega-semantic-protocol-v0.2` (bootstrap vocabulary/validator), `omega-file-native-semantic-v0.3` (inert TS scanner and cross-domain examples), `omega-semantic-meta-compiler-v0.4` (three index backends and benchmark). These are potentially useful test fixtures, but their existence does not equate to integration, standardization or independent certification. Check actual source and run tests before reuse.

### 44.1 Applicable external prior art (compare rather than copy)

- W3C JSON-LD 1.1: globally identified linked data interchange. https://www.w3.org/TR/json-ld11/
- W3C SHACL: RDF graph constraint/shape validation; useful bounded validation analogy. https://www.w3.org/TR/shacl/
- MLIR Language Reference: extensible typed operations/dialects, multiple equivalent IR forms and lowering. https://mlir.llvm.org/docs/LangRef/
- WebAssembly Component Model / WIT: portable interface contracts independent of guest implementation; WIT does not by itself describe algorithm behavior or grant authority. https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md
- SQLite FTS5: embedded full-text retrieval. https://www.sqlite.org/fts5.html
- Oxigraph: RDF graph/SPARQL implementation, research candidate. https://github.com/oxigraph/oxigraph
- DuckDB Parquet/Apache Arrow: scan-oriented and columnar projection formats. https://duckdb.org/docs/stable/data/parquet/overview and https://arrow.apache.org/docs/format/Columnar.html

No external reference is a mandate to adopt a particular engine, ontology, wire encoding or vendor stack. Each must be tested against Ω's source-fidelity, semantic-identity, provenance, portability, footprint and update requirements.

## 45. Reader's final one-page design contract

**The source is semantic.** The system's meaningful code and data carry protocol-conformant descriptions of identity, interfaces, behavior claims, math, constraints, relationships, dependencies and source/evidence. The kernel's own source conforms to this contract.

**The compiler is the bridge.** It uses a small checkable bootstrap to extract and type that source, preserve what is known and unknown, produce canonical versioned Semantic IR and one exact meaning publication. It cannot assert more proof than static extraction and evidence permit.

**The indexes are replaceable.** Graph relationships are logically first-class; actual storage may be flat files, relational, adjacency, search, vector, columnar or hybrid. Indexes may be compact, sharded and purpose-specific, but their reconstruction, fidelity and invalidation are tested. The engine can describe the choices and evidence for its own storage/query architecture.

**The environment is real.** Knowing a Photoshop filter, database command, HTTP protocol or silicon algorithm globally is distinct from being able to use it on this user's machine, account or device. Context resolution proves compatibility where possible and says UNKNOWN otherwise.

**The human stays in control.** Machine and human explanations derive from one publication. Uncertainty, incorrect targets and consequences are visible. Capabilities are distinct from verified realizations; semantic meaning is distinct from policy/permissions; a file, model or index can never authorize its own effects.

**The system learns experimentally.** Source mismatches, user corrections, machine↔human discrepancies, adversarial tests and runtime observations feed the same learning circuit, embedded in the Elephant development system. New versions are reproducible and falsifiable. Agents propose; independent tests and explicit promotion decide.

**The end state is an evolving semantic substrate.** A user can add unfamiliar digital knowledge in code, documents or observed environments; the platform develops new, appropriately qualified semantic reach without rewriting the core, while the user's digital World stays sovereign, explainable, governed and portable.

---

**Document disposition:** consolidated design and build blueprint, revision 1.0, 2026-10-11. It is sufficiently specific to launch architecture experiments and a first vertical implementation. It is **not** a ratified binary protocol, product release, complete domain ontology, authorization implementation, independent proof of the kernel, or selected storage engine. Any future update should include an explicit changelog, source/owner decision references, differences from these invariants and the tests that now support each changed assumption.