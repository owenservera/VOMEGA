# Semantic Design Decision Board — Questions We Have Not Finished Answering

**Role:** evergreen view of unresolved research and owner choices. **Board status:** ACTIVE FIRST PASS; entries are NOT owner approvals. **Last reviewed:** 2026-10-11.

## How to read this board

It is legitimate for a design to be understandable even where its implementation is unknown. We state agreed objectives in [01](01_AGREED_STATE.md), protect important truth boundaries in [05](05_PRINCIPLES_AND_CONTRACTS.md), and record here the decisions that research or explicit guidance must still settle. A question may stay open while other experiments proceed.

This board is **not a second authority register**. The already established [VOMEGA decision-process tracker](../../DECISION_PROCESS_TRACKER.md) handles LAB, DELIBERATION, OWEN_GUIDANCE and owner approval, with original source references. When any item here requires an actual decision, link the corresponding DECQ/REV record there. This board is a readable semantic-design working view for collaborators who need to know *what is unsettled and how to investigate it*.

Each SQ identifier is permanent. Do not reuse it for a new subject. Change status in place and link the experiment or explicit guidance responsible; Git maintains revisions. A test result is evidence, not an owner decision.

## Working classifications

- **OPEN_LAB:** alternatives can be tested without choosing a governing rule.
- **NEEDS_DELIBERATION:** tradeoff needs written comparisons or reconciliation.
- **NEEDS_OWNER:** requires normative scope, priority, UX meaning or approval; agents cannot decide it.
- **DIRECTION_RECORDED:** the owner has set the direction, but the mechanism is unresolved.
- **CANDIDATE_SELECTED_FOR_TRIAL:** one option is being built for evaluation only.
- **DECIDED_LINKED:** a real scoped decision with external authority link exists; not synonymous with implemented.
- **DEFERRED:** not blocking a named next milestone.
- **SUPERSEDED:** replaced by a cited later question/decision.

Implementation status should be separately NOT_STARTED, PROTOTYPE, TESTED_IN_COHORT, VERIFIED_FOR_SCOPE or BLOCKED. Status and evidence must not be inferred from the presence of a document.

## Immediate board — closest to our first fixture

### SQ-001 — What is the minimum semantic unit?
**State:** OPEN_LAB. **Why:** comments attach naturally to files/functions, but program knowledge includes statements, types, relations, invariants and behavior across files.

**Options:** file-level annotations, symbol-level claims, statement/source-span claims, or a mixture with relationships. **Cheapest probe:** describe an add function, a stateful loop and an inter-file dependency; compare ability to identify the smallest wrong claim after a source mutation. **Decision needed:** candidate granularity and anchor stability for the initial compiler. **Links:** [source narrative](02_SOURCE_TO_MEANING.md), [blueprint §10–16](../MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md).

### SQ-002 — Where should semantic meaning be encoded?
**State:** OPEN_LAB. **Why:** header, footer, inline comments, typed declarations and external manifests create different tradeoffs in readability, tooling compatibility and drift.

**Options:** comment-first, statically inspectable declarations, sidecar, generated-only or hybrid. **Cheapest probe:** same TypeScript fixture, identical claims, four encodings, no execution of source during extraction; compare compile/reconstruction costs and source-edit failure modes. **Owner direction already available:** do not replace ordinary TypeScript; everything else OPEN.

### SQ-003 — How exhaustive should Track A be?
**State:** OPEN_LAB. **Why:** adding words can improve comprehension or amplify false certainty.

**Options:** a broad standardized claim matrix; task-specialist annotations; staged depth with explicit unknowns. **Cheapest probe:** blind novice and model comprehension plus contradiction probes on several archetypes. **Rule:** Track A is a rich *reference candidate*, never automatically ground truth.

### SQ-004 — What constitutes acceptable semantic compression?
**State:** OPEN_LAB. **Why:** token savings may shift costs into later inference, retrieval or mistakes.

**Options:** exact invertibility for required fields, task-sufficient reconstruction, conditional-on-demand fidelity. **Cheapest probe:** three packed formats and no-annotation baseline on explaining, changing and diagnosing a file; report missing effects and unknowns separately from compression ratio. **Constraint:** required authority/provenance/uncertainty cannot silently vanish.

### SQ-005 — What is the smallest canonical semantic representation?
**State:** OPEN_LAB / NEEDS_DELIBERATION. **Why:** durable meaning needs identity, versions and links, but a giant upfront ontology would obstruct experiments.

**Options:** typed JSON claim records, typed logical graph, normalized relation tables, intermediate hybrid. **Cheapest probe:** lossless representation of conflicting comments, n-ary environment-dependent effects and a source mutation; verify deterministic reserialization and reconstruction. **Not decided:** byte format, node schema, graph database.

### SQ-006 — What evidence is required to assert a claim?
**State:** OPEN_LAB with PROTECTED truth distinctions. **Why:** static derivation, model speculation, observed behavior and user intent differ.

**Options to test:** evidence class taxonomy and independent verifier interface; tiered validation by claim kind. **Cheapest probe:** intentionally false constraint on a loop and stale side-effect comment; require precise contradiction or UNKNOWN rather than confident acceptance. **Needs review:** vocabulary and promotion gates, not whether uncertainty should exist.

### SQ-007 — What identity survives a source refactor?
**State:** OPEN_LAB. **Why:** moving or renaming code changes anchors, but does not always change the capability’s meaning.

**Options:** content/AST identity, namespaced declared ID, stable semantic ID with source lineage and aliases. **Cheapest probe:** rename, extract, move, fork and semantic mutation; test collision and dependency invalidation behavior. **Boundary:** never conflate concept, source revision, publication and permission.

### SQ-008 — How do we detect and update stale wiki/context?
**State:** OPEN_LAB. **Why:** source changes must not leave authoritative-looking cached explanations.

**Options:** dependency graph invalidation, content-addressed regeneration, versioned reads and explicitly stale views. **Cheapest probe:** add→multiply change, import-version change and renamed symbol; inspect human/wiki/agent impacts against actual source. **No assumption:** all derived material must be eagerly recomputed.

### SQ-009 — Which semantic expressions best serve humans and machines?
**State:** OPEN_LAB. **Why:** readable prose and compact typed knowledge are not identical.

**Options:** shared IR with profiles, plain-reading grammar, explanation templates plus optional prose, task-specific capsules. **Cheapest probe:** counterbalanced human comprehension and blind machine reconstruction tests, including contradictory intentions. **Constraint:** one snapshot identity with declared projection omissions.

### SQ-010 — What is the minimum self-describing bootstrap kernel?
**State:** OPEN_LAB. **Why:** a system cannot independently certify its own protocol merely by reading its own declarations.

**Options:** tiny static checker plus rich host compiler, multiple independent tiny readers, formalized restricted core. **Cheapest probe:** independent implementations accept and reject the same hostile fixtures; compare semantic publications. **Blocked by:** initial claim/identity contracts.

## Cross-cutting, still-open architectural choices

### SQ-011 — What makes Elephant context selection effective?
**State:** OPEN_LAB / DIRECTION_RECORDED for Elephant embedding. **Alternatives:** full source, maximal descriptions, graph neighborhoods, compact capsules, on-demand retrieval and adaptive mixtures. **Cheapest probe:** equal-budget fresh-agent tasks across at least two domains; measure code correctness, missing knowledge, time and cross-herd transfer. **Original guidance:** Elephant embedding is owner-directed; packaging strategy is not.

### SQ-012 — Which Elephant memory and communication structure works?
**State:** OPEN_LAB. **Alternatives:** long-lived sessions, reconstructable snapshot experts, distributed publications and mixed approaches. **Cheapest probe:** blind fresh-context handoff, stale-update challenge and negative control against plain search. **Boundary:** DNA, phenotype and realization remain distinct.

### SQ-013 — What should the first visual semantic surface contain?
**State:** OPEN_LAB / OWNER_DIRECTION on text-centric first experience. **Alternatives:** three-pane source/machine/wiki lab, small floating interpreter, optional graph/3D canvas inspection. **Cheapest probe:** comprehension/error localization and latency under incremental edits. **Boundary:** don't require Chrome/Chromium or a full Windows app for a headless compiler test; browser testing may be chosen when useful.

### SQ-014 — When should the runtime make a command READY?
**State:** NEEDS_DELIBERATION, with PROTECTED authority split. **Alternatives:** conservative deterministic grammar and typed binding, richer probabilistic interpretation plus confirmation, hybrid resolver. **Cheapest probe:** ambiguous target, changed user intent, Unicode confusables, source epoch mutation and missing permissions in mock-only mode. **Constraint:** interpretation and dispatch approval remain separate.

### SQ-015 — Which physical indexing and storage strategy is best?
**State:** DEFERRED for first fixture / OPEN_LAB for scale. **Alternatives:** direct JSON, SQLite, packed graph, content-addressed stores, vectors or portfolio. **Cheapest probe:** matched navigation, query and update workloads with exact required-fields verification. **Do not decide from:** one small-file speed test.

### SQ-016 — How far should formal checking reach?
**State:** OPEN_LAB. **Alternatives:** structural checks, bounded effects/invariants, property testing, verified restricted arithmetic, stronger formal proof on select classes. **Cheapest probe:** deliberately incorrect contracts and minimal mutations; report false proof claims. **Constraint:** never imply complete behavioral understanding of arbitrary TypeScript.

### SQ-017 — Which mechanisms may an Elephant automatically rewrite?
**State:** NEEDS_DELIBERATION and potentially NEEDS_OWNER when authority expands. **Alternatives:** purely proposed doc changes, shadow compiler candidates, reversible experimental index changes, guarded approved code changes. **Cheapest probe:** no-effect sandbox, independently checked candidate and precise rollback. **Boundary:** a model proposal never self-authorizes runtime effects or changes its own referee.

### SQ-018 — What would justify moving beyond TypeScript?
**State:** OPEN_LAB with owner preference for TS default. **Alternatives:** keep TS all through first slice, Wasm publishing, Rust or another kernel adapter, multi-language frontends targeting a shared IR. **Cheapest probe:** matched portability/maintainability/runtime measurements on same semantic contract, including setup cost. **No current freeze:** Wasm, Rust, browser or UI framework.

### SQ-019 — What is the earliest defensible promotion milestone?
**State:** NEEDS_DELIBERATION. **Alternatives:** reliable single-file semantic claim loop, cross-file wiki and invalidation, cross-Elephant blind reconstruction, limited safe runtime mock. **Cheapest probe:** name a small, falsifiable acceptance suite and run it from a clean checkout with independent checker. **Boundary:** capability pack publication, verified behavior and owner approval are different things.

### SQ-020 — How should speculative discoveries become shared design?
**State:** DIRECTION_RECORDED for editable evergreen documentation, mechanism OPEN. **Alternatives:** formal review PR, owner interview after lab report, delegated narrow technical adoption under constraints. **Cheapest probe:** trial one small change end-to-end using [07](07_EDITING_PROTOCOL.md) and the existing [decision tracker](../../DECISION_PROCESS_TRACKER.md). **Never:** label model consensus as owner approval.

## Short decision-ready format

For any SQ item, append an investigation in the relevant lab or existing decision tracker with: exact question, current claimed direction, competing hypotheses, why it matters, source/evidence references, cheapest discriminating test, results with scope and unknowns, recommendation, authority required, decision source (if any), implementation status, rollback. If the question remains open, leave its state OPEN_LAB or NEEDS_DELIBERATION and keep the work moving on nonblocking fixtures.

## Near-term sequencing without premature freezing

Start by investigating SQ-001, SQ-002, SQ-003, SQ-006 and SQ-008 together on the simplest executable TypeScript source and wiki views. Use those results to guide SQ-004, SQ-005, SQ-007 and SQ-009. Introduce SQ-011/012 in parallel as controlled Elephant handoffs. The other items are intentionally visible so promising agent-discovered directions do not disappear. This ordering is a suggestion based on dependencies, not a stage-gate restriction.

**Revision protocol:** never overwrite an open question with an unlinked final answer. Add a source for the deciding experiment or owner direction, update status, adjust [01](01_AGREED_STATE.md) and the affected concept chapter, and retain previous evidence through Git and original immutable releases.