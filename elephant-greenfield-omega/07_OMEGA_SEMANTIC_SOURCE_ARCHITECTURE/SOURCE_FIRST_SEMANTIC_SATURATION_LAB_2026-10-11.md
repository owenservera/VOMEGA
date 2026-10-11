# Source-First Semantic Saturation & Compression Laboratory
**2026-10-11 | owner-directed R&D method | implementation NOT FROZEN**

## Executive instruction — HOW we now explore
Start with an **ordinary, executable TypeScript file** demonstrating recognizable programming archetypes. Do not reinvent functions, variables, constants, loops, types, imports, errors, or compiler semantics. Make that source **maximally self-describing** at first: explicit identity, intent, purpose, source anchors, inputs/outputs, effects, constraints, relations, provenance, negative cases, examples, uncertainty, dependencies, human reading, machine interpretation, wiki and indexing. Deliberately over-verbalize and over-index. Simultaneously run independently measured experiments removing, encoding, deriving, rearranging, and contextually restoring meaning. Let competing models/Elephants discover compression and representation strategies. Promote only evidence-backed changes.

**In short:** SOURCE → SEMANTIC SATURATION → CANONICAL CHECKED MEANING → MULTIPLE HUMAN/MACHINE VIEWS → DISCREPANCIES → PARALLEL COMPRESSION / RECONSTRUCTION EXPERIMENTS → REPLAY / ADJUDICATE → VERSIONED IMPROVEMENT. This is the practical operating method inside [Rule 1](RULE_1_MACHINE_HUMAN_COEVOLUTION.md), not a second learning system or a sequential phase gate.

This method is central to *how* the research proceeds. It does not supersede the [master semantic vision](MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md), the [SDK/compiler/runtime anchor](SDK_COMPILER_RUNTIME_ANCHOR.md), Elephant DNA, independent proposals, or existing executed evidence. It reduces speculative architectural debate by supplying shared executable experiments and explicit falsification criteria.

## I. The first visual unit: a single file
Open `001-semantic-basics.ts` in an editor. Ordinary TypeScript remains executable even if the entire semantic layer is ignored. The following comments are **illustrative candidate syntax** and not an accepted grammar:

```ts
/**
 * @semantic.file experiment.001.basic
 * @purpose Demonstrate ordinary computational archetypes
 * @meaningScope arithmetic, repetition, branching, state
 * @status CANDIDATE
 * @evidence SOURCE_DECLARED
 */
/** @semantic.constant execution.maxRetries
 *  @intent Bound the number of attempts
 */
const MAX_RETRIES = 3;

/**
 * @semantic.symbol math.add
 * @archetype pure-function
 * @intent Combine two numbers into their sum
 * @inputs a: first number; b: second number
 * @output arithmetic sum; @effects none
 * @invariant does not mutate caller state
 * @example add(2,3) -> 5
 * @why reusable arithmetic operation
 * @sourceEvidence function body (requires checker)
 */
function add(a: number, b: number): number { return a + b; }

/**
 * @semantic.symbol iteration.repeat
 * @intent Perform an observable operation count times
 * @effect writes to console
 * @constraint count must be a nonnegative safe integer (DECLARED, NOT ENFORCED BELOW)
 */
function repeat(count: number): void {
  for (let i = 0; i < count; i++) console.log(i);
}
/* @semantic.footer candidate links: math.add -> arithmetic; iteration.repeat -> iteration */
```

**The deliberate false-consistency probe above matters:** the repeat contract declares a count constraint that the function does not enforce. The system MUST reveal it as an unverified/contradicted declaration, not silently turn it into a proven invariant. Likewise, `@effects none` for `add` is subject to defined static-analysis scope, not universal formal proof.

Initial tri-view: LEFT = executable source with semantic inline/header/footer; MIDDLE = live canonical machine interpretation and uncertainty/provenance; RIGHT = automatically regenerated human-readable wiki, capability relations, examples and why-trace. Editing `a + b` to `a * b` should invalidate old addition claims and downstream publications. The three displays must bind to the same pinned source/semantic snapshot; typing updates must distinguish draft from committed publication.

## II. Two coordinated tracks (plus an independent referee)
### Track A — maximum expression / maximal indexing
Produce a generous, structured, source-anchored knowledge reference for every applicable code element, file, relation and capability. No premature token budget. Candidate coverage: identity/aliases/scope; type/signature; purpose/why; operational semantics and algorithm; inputs/output/range/units; pre/postconditions; invariants; effects/mutation/errors; control flow; data flow; imports/exports; producer/consumers; dependency graph; trust/provenance; expected behaviors and negative cases; examples; security and authority; environment requirements; exceptions/conflicts/unknowns; user intents and alternatives; human explanation; agent-native meaning; tests/observations; change history/invalidation; index locality and retrieval paths.

Do NOT require every field on every symbol. Explicitly differentiate NOT_APPLICABLE, UNKNOWN, NOT_TESTED, DECLARED, MECHANICALLY_DERIVED, OBSERVED, CONTRADICTED and VERIFIED_ABSENT. Avoid verbosity-as-confidence: an extensive invented narrative is worse than sparse truthful evidence. Label model-generated explanations as hypotheses until independently corroborated.

### Track B — compression / competing encodings
Keep the same executable semantics and pinned tests. Candidates independently explore:
1. remove facts directly reconstructable from TS AST/types;
2. convert repetitive prose to a normalized symbol/relationship grammar;
3. deduplicate file-wide header, inline and footer metadata;
4. use stable scoped symbol references, external manifests or generated indexes;
5. canonicalize typed semantic IR and reconstruct wiki/agent/intent projections;
6. create task-dependent context views rather than one universal short form;
7. encode program concepts as graph neighborhoods and dependency cutsets;
8. adaptively retain explicit meaning only where semantic inference is ambiguous or unsafe;
9. try alternate agent-native capsules and measured cross-elephant handoffs;
10. test fully derived / zero-annotation baseline.

Each is a **candidate**, not a foreordained sequence to a shortest syntax. Compression can be lossy only when the loss is explicitly declared and acceptable for a specified task; never silently discard safety, identity, authority or unknown-state distinctions.

### Independent referee
Track A is NOT automatically ground truth. Frozen source, reference compiler/types, observable tests, mutation tests, held-out queries, and independent human/agent judgments adjudicate claims. Blind reconstruction tasks must hide Track A wording from the respondent, otherwise comparisons are circular.

## III. Design variables intentionally OPEN
Comment annotations vs inline declarations vs sidecar files vs generated-only metadata; header/footer/inline placement; encoding convention and alias syntax; canonical serialization and stable identity/versioning; TS-parser/compiler choice; effect analysis depth; index engine(s); physical storage; embedded vs external wiki; context packing and retrieval; WASM and UI delivery; cross-language adapter strategy; LLM choices; caching; incremental invalidation. Research these by changing **one identifiable variable per comparable run** when feasible; allow broader exploratory variants with full provenance. An existing TS file must remain legible and buildable without the semantic layer.

## IV. Source/compiler/runtime and data contract
Minimal *candidate* record: `source_id`, `source_hash`, `symbol_anchor`, `semantic_id`, `definition_version`, `claim_id`, `claim`, `claim_status`, `evidence_refs`, `derivation_method`, `confidence_if_estimated`, `dependencies`, `validation_results`, `publication_id`, `projection_profile`, `unknowns`, `invalidated_by`. Compiler emits checked typed semantic IR; projections are rebuildable and version-bound. Source file does not become an execution permission. Runtime dispatch remains independently governed by user intent, verified environment and explicit authorization. Self-description is not self-certification; bootstrap checks require an external witness.

Facts must have source and scope: `MEASURED | ESTIMATED | UNKNOWN` for quantities with witness and cohort. Preserve source identity, semantic identity, file content hash, definition revision and snapshot publication as separate concepts. Generic source-based insight and domain/intent claims must not be conflated.

## V. The first fixture suite
The first file (and eventually fixture folder) should cover constants, primitive variables, immutable/mutable state, pure/impure functions, parameters/return values, arithmetic and comparison, if/else/switch, loops, recursion, arrays/maps/objects, classes/interfaces/generics, imports/exports, async/promises/events, exceptions, types, dependency composition, side effects, access controls and potentially ambiguous user intent. Start tiny and expand breadth without entangling the business logic.

Negative fixtures: contradictory annotation vs code, undocumented side effect, renamed symbol, move across files, stale wiki, changed signature, unsafe type coercion, import/version drift, conflicting semantic identities, Unicode and scope collisions, deleted dependencies, hallucinated relation, ambiguous intent, and absent permissions. Include examples of discoverable-but-not-authorized capabilities.

## VI. Measurable scorecard / compression economics
For each fixture/version/agent/model run record:
- bytes, source LOC, semantic LOC and tokenizer-specific token counts; preparation and storage cost;
- semantic claim coverage and precision (supported, contradicted, unknown); graph edge recall/precision;
- ability to reconstruct required meaning from compressed representation; exact vs task-sufficient recovery;
- end-user explanation correctness and comprehension; wiki/source drift and invalidation latency;
- intent-to-command grounding, uncertainty preservation, alternatives, false READY and false authority rates;
- cross-file retrieval and navigation success; downstream edit/repair quality; regression and mutation detection;
- incremental compilation/refresh wall time and compute; context packing/retrieval/inference cost;
- cross-agent handoff success, duplication, knowledge loss and recovery time;
- **full-loop** wall time and correct accepted improvements per unit compute / human review.

Define **semantic reconstruction distance** operationally per task as the observable extra steps, tokens, latency, errors and evidence needed to recover required meaning from a candidate versus a validated maximal reference. No universal single number is presumed. A smaller file can be *worse* if repeated retrieval/inference exceeds the saved tokens or causes critical omissions. Compare Pareto frontiers, not a single subjective elegance score.

## VII. Elephant-system co-optimization: an experiment, not an assumption
This lab is also a dogfood instrument for Elephant cognition. Independently vary: source chunk granularity; file-to-elephant assignment; thematic neighborhoods vs dependency neighborhoods; durable memory saturation; cross-herd dependency exposure; publication cadence; capsule schema; retrieval policy; overlap/replication vs specialist division; context size and budget; source freshness and update timelines; claim provenance; information-loss controls; dependency-request scheduling; disagreement/referee protocol; short vs verbose handoffs; and model assignment. Observe where rich semantic source helps Elephants outperform ordinary context loading, and where it burdens them. Track both local usefulness and herd-level comprehension of codebase, work requests, stale dependencies and emerging design opportunities.

Keep three layers distinct: **DNA** = testable general cognitive competencies; **phenotype** = domain-specific expertise (e.g., semantic reviewer or code harvester); **realization** = concrete tools/models/indexes/files. No current Elephant architecture, context allocation algorithm or transport is ratified merely by succeeding on one fixture. Existing architectures and Z.ai streams remain independent test subjects.

## VIII. Experimental loop with explicit publication
1. Select pinned fixture + task + model/cohort + source hashes + reference observations.
2. Maximal Track A produces claim-indexed self-description, source citations, machine snapshot and human wiki (including unknowns).
3. Independent referee probes accuracy and labels assertions; report false claims, not just omissions.
4. Parallel Track B variants compress different dimensions; record exactly what was removed, derived, normalized, shared or externalized.
5. Blind agents/humans reconstruct, explain, navigate, modify and diagnose the same pinned program using their assigned representation only.
6. Execute syntax/type/runtime/mutation/round-trip tests where appropriate, alongside comprehension and interpretation tests; reject unsafe inference.
7. Compare correctness, lost information, costs, context budgets and full feedback-loop duration; retain failures and surprising variants.
8. Promote narrow, reversible, evidence-backed protocol/SDK changes. Re-project the same machine/human publication and repeat. Always record whether the run is actual, simulated, author-reported or pending.
9. At **every development turn**, publish all-maturity capability-pack inventory and immutable evidence/references using the established `01_EXPECTED_OUTPUTS` and `04_TURN_PUBLICATIONS` laws; don't overwrite historical results.

## IX. First practical increments (not a locked roadmap)
**E0: source file + baseline.** Write one executable TS archetype file and unit tests; measure unannotated AST extraction. **E1: saturation.** Author maximal self-description and claim/evidence index, with checked wiki and machine view; detect deliberately contradictory declarations. **E2: three orthogonal compressions.** Dedup AST facts, normalize relations, and generate on-demand task-specific context; compare to a no-annotation control. **E3: mutation/invalidation.** Change `add` to multiply and rename a symbol; replay all views and consumers. **E4: elephant handoffs.** Compare full source, maximal descriptions, and compressed capsules on tasks across independent agent contexts. **E5: auto-experiments.** Have agents propose new encodings based on observed mismatch without redefining the referee. Use small, reproducible experiments; scale only on positive evidence.

Artifacts per run: source fixture and hashes; annotation/encoding variant; checker + tests; typed IR and canonical snapshot; human wiki; graph/index dump; prompts and model/version; independent reconstruction answers; quantitative result table; false/unknown claims; source-to-claim diff; accepted/rejected design decision; all-maturity capability pack. Never invent metrics or claim unexecuted tests.

## X. Corollary register — preserved research, not abandoned
- **Universal source-native kernel**: source describes its own semantics; indexes are rebuildable projections, not an authoritative prepopulated DB. Bootstrap independently verified.
- **Open-world extensibility**: adapt to unfamiliar languages, domains, hardware, APIs, databases and future unknown knowledge; don't hardcode domain universe.
- **One canonical meaning, many projections**: source-grounded human wiki, live interpretation, UI feedback, AI-native representations and machine IR represent one versioned publication.
- **Single Machine↔Human learning circuit / Rule 1**: discrepancy drives experiments, including simulated expectations and cross-agent reconstruction, with provenance.
- **Natural language interpreter**: distinguish live draft preview from committed canonical publish; preserve typed spans, alternatives, uncertainty, provenance and user's authority.
- **Semantic runtime / command law**: no silent effects, no authorization from annotations or agents, no READY for unresolved ambiguity.
- **Self-knowledge and code-as-wiki**: automatic code-derived documentation, capability discovery and updates on change; claims require derivation/validation.
- **Incremental compiler / indexer**: source identity, symbol dependencies, context-aware read models, diff/invalidation and accountable query planning.
- **LLM-native dev automation**: high-volume independent model experiments plus mutation, simulation, blind refutation and fast replay; don't mistake agreeable LLM prose for evidence.
- **Elephant DNA and memory**: explicit reconstruction and handoff economics, long-lived knowledge, agent cohorts, source epochs, request propagation and bounded context consumption.
- **Previous Phase 0 / Z.ai / R1AB evidence**: preserve unchanged as historical controls; distinguish reported results from reproduced results; no implied production-ready status.
- **MVP surface vs platform**: floating typed command/intent, minimal dev canvas, visual interpretation and wiki as a demonstrator; no premature browser, UI kit, platform or DB requirement.
- **Archival/custody and no lost thinking**: existing proposals, decisions, open questions, round outputs and negative findings remain discoverable. New method governs experiments, not retrospective erasure.

## XI. Questions for models to discover, not answer by decree
What is the minimum non-derivable semantic declaration per archetype? When are repeated natural-language claims more useful than normalized symbols? Can the same indexed facts explain code to a novice and coordinate Elephants? Which context representations preserve intent under constrained budgets? How robust is reconstruction across languages and models? What makes a semantic claim *stable* through refactors? Can agents propose a better annotation/index structure without biasing their own tests? Does on-demand regeneration beat keeping always-on saturated source? What compression breaks discoverability, uncertainty, provenance or downstream mutation detection? Which human-readable forms reveal errors fastest? Where do models discover surprising but independently valid novel formats?

**Adoption criterion:** outperform plain conventional TypeScript plus normal tooling on a blinded, reproducible task suite in at least one important dimension, without regressing execution safety, truthfulness, and maintainability. **Stop condition:** if verbose semantics becomes costly decoration, return to source-only and retain only independently demonstrated value.

## XII. Authority and reading order
Read: [Master blueprint](MASTER_UNIVERSAL_SEMANTIC_SYSTEM_BLUEPRINT_2026-10-11.md) → [Rule 1](RULE_1_MACHINE_HUMAN_COEVOLUTION.md) → **this experiment-first HOW** → [SDK anchor](SDK_COMPILER_RUNTIME_ANCHOR.md) → [Phase 0 tooling](phase0/devtools/README.md). Elephant-specific teams should also read [canonical development corpus](../CANONICAL_DEVELOPMENT_CORPUS.md), [DNA](../05_UNIVERSAL_ELEPHANT_DNA/README.md), [every-turn publication contract](../01_EXPECTED_OUTPUTS/README.md) and [turn publications](../04_TURN_PUBLICATIONS/README.md). The master vision governs WHAT and boundaries; this file defines the currently owner-directed experimental HOW. Exact syntax, backend, transport, UI, source carrier and optimizers remain open.
