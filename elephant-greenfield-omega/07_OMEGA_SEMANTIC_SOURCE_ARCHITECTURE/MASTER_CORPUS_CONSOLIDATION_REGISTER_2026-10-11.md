# ⚓ Master corpus consolidation register — radial scan v0.1

**Date:** 2026-10-11. **Status:** PROPOSAL / NOT IMPLEMENTED / NOT RATIFIED. This is a research consolidation and decision register, not an assertion that adapters or tests already exist.

## Governing rule and temporal weighting

**Most recent explicit owner decision wins over earlier proposals when they conflict**, unless the owner explicitly reopens it. Recency does not override measured falsification, security invariants or explicit source truth. Rule 1 (2026-10-11) is the governing *single Machine ↔ Human semantic learning circuit*: SDK/compiler/runtime and Human/Machine projections co-evolve; the experiment factory is the same circuit. Neither a sequential SDK-first program nor an isolated UI-first program is valid. Earlier material is preserved as hypotheses, comparators or provenance rather than erased.

Scoring for proposal adoption (0–100, preliminary design review, not measured ROI): **40** alignment with latest owner decisions; **20** semantic/corpus coherence and single authority; **15** falsifiability and evidence; **10** portability/dependency discipline; **10** speed-of-learning potential; **5** integration/reuse. Hard veto for silent semantic drift, invented execution authority, source laundering, or mandatory browser/Node/Python in the proposed final-stage runtime. A recent decision is not an automatic code-selection decision: candidate realization remains open until tested. The P0/P1/P2 priority and ADOPT/ADAPT/EXPERIMENT/RESOLVE statuses below are qualitative application of these criteria; no numeric proposal score is claimed without an actual scoring worksheet.

## What 'one internally consistent master corpus' means

The target is a **single versioned logical corpus**, not necessarily one giant physical file/database. Each corpus item carries: stable ID; kind (declaration, source fact, semantic fixture, intent observation, interpretation, publication, representation, discrepancy, proposed change, test, negative result, approval, evidence); source anchor and hash; author/agent and observation provenance; timestamp/decision order; schema/engine/profile/World versions; maturity and authority class; dependencies and contradictions; accepted/superseded/rejected state. Conflicts are explicit, never silently rewritten. Raw source and frozen test evidence remain immutable; materialized views and indexes can be rebuilt. No model-generated claim becomes an oracle by repetition.

### Minimum linking spine (candidate, not frozen wire schema)

`source_revision -> declaration_id -> compiler_profile -> interpretation_case -> immutable_semantic_snapshot -> {machine_projection,human_projection,wiki_projection} -> discrepancy_case -> experiment_id -> candidate_patch -> referee_evidence -> promotion_decision`.

**Invariants:** one snapshot identity for Machine/Human; independent intended-meaning evidence; explicit ambiguity/unknown; effect and source parity; publication is not permission; account/provider/model/session distinguished; simulator != human; source facts != commentary; no new authoritative registry; all revisions reproducible. The 'only learning signal' is an observed Machine ↔ Human/source/intent discrepancy within this loop; external harvests and agent ideas enter as candidate inputs or evidence, never self-justifying semantic improvements.

## Evidence precedence / conflict resolution

1. Latest explicit owner directive for design intent (2026-10-11 Rule 1, TS/Wasm final-stage dev kit, no mandatory Chromium; MVP architecture open).
2. Protected invariants and independently reproducible source/runtime evidence for factual correctness and safety.
3. Accepted, versioned decisions and current executable contracts within their own scopes (D1/Ratchet versus SDK research).
4. Independently replayed benchmarks with fixtures, code, environment and hashes.
5. Source-reported evidence, proposals and agent analyses, each marked as such.
6. Archived/historical designs: useful source of ideas but no silent authority over recent decisions.

When recent intent conflicts with an older implementation, **do not claim the implementation has changed**: mark divergence, propose an adapter/test, then seek evidence. When two current source contracts conflict, do not select one merely by timestamp; test semantic equivalence, record a versioned disposition and preserve negative results.

## Consolidated 40 wiring proposals

Columns: disposition is **proposal**, priority qualitative, recency class 1 = latest owner-aligned 2026-10-11, 2 = earlier source reused under latest rule, 3 = unverified external report. Source paths are repo-relative unless explicitly labeled.

| ID | Wiring | Source | Proposed disposition | Priority | Recency class | Implementation consistency condition |
|---|---|---|---|---|---|---|
| R01 | One canonical feedback case | Rule 1; Phase 0 | ADOPT | P0 | 1 | Freeze intent, interpreted, rendered, source facts and discrepancy as linked evidence; no independent semantic change signal. |
| R02 | Semantic Runtime Lab profile adapter | seed-docs/SEMANTIC-RUNTIME-LAB.md | ADAPT | P0 | 2 | Versioned experiment profile references the same corpus; no second experiment registry. |
| R03 | Automated semantic candidate tournament | seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md | ADAPT | P0 | 2 | Pin baseline/candidates, scenarios, falsifiers, promotion results; candidate cannot rewrite evaluator. |
| R04 | Pure TS NLCL differential comparator | omega-baseline/plugins/vivim-nlcl-pure/src/index.ts | ADAPT | P0 | 2 | Compare meaning and traces via adapter; not presumed equivalent to Run A. |
| R05 | Reflection fact provenance | omega-baseline/experimental/reflection-migrator/src/facts.ts | ADAPT | P0 | 2 | Preserve fact class and source anchors; never promote inferred facts to executable authority. |
| R06 | Live Lab corrections as observations | 07/phase0/devtools/README.md | ADAPT | P0 | 2 | Capture proposed correction, provenance and current revision; label unadjudicated. |
| R07 | Machine/Human one-publication parity | Rule 1; Wasm publisher proposal | ADOPT | P0 | 1 | Same frozen semantic identity and fact/effect set; independent projection loss test. |
| R08 | Independent oracle and holdouts | 07/phase0/HOLDOUT_PROTOCOL.md | ADOPT | P0 | 2 | Holdouts external to candidate workspace; preserve valid controls and false READY. |
| R09 | Negative intent frontier | seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md | ADAPT | P0 | 2 | Expose plausible divergent intent, never grant authority or invent interpretation. |
| R10 | Source-native contextual Wiki | seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md | ADAPT | P0 | 2 | Project source-grounded knowledge, no second manually maintained Wiki truth store. |
| R11 | Visual semantic language | seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md | EXPERIMENT | P1 | 2 | Measure human comprehension and detection of misinterpretation, not cosmetic preference alone. |
| R12 | Reflection migrator conformance | seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md | ADAPT | P1 | 2 | Audit/extract/propose/verify; source authority not generated commentary. |
| R13 | Source-span extraction | omega-baseline/experimental/reflection-migrator/src/extract-source.ts | ADAPT | P1 | 2 | Map source spans to Wiki facts; distinguish dynamic/opaque source. |
| R14 | NLCL World grounding | omega-baseline/plugins/vivim-nlcl-pure/src/index.ts | ADAPT | P1 | 2 | Explicit provider/account/model/session and World revision; compare without assuming identity. |
| R15 | One typed meaning / many projections | Rule 1; command visual language | ADOPT | P0 | 1 | UI, Wiki, machine capsule derive from one immutable snapshot. |
| R16 | Unified Semantic Product Elephant Group | semantic-factory-zai/03_UNIFIED_SEMANTIC_PRODUCT_GROUP.md | ADAPT | P1 | 2 | Knowledge/evidence library contributes facts and candidates; no second product brain. |
| R17 | D1 capability declarations | omega-baseline/experimental/d1/declarations/ | ADAPT | P1 | 2 | Conformance-map capability IDs, args and consequences; preserve source versions. |
| R18 | Existing Ω SDK schema | omega-baseline/sdk/src/schema.ts | COMPARE | P1 | 2 | Schema compatibility matrix; Zod is not runtime dependency for proposed pure Wasm hot path. |
| R19 | Ratchet proof gates |  .project/ratchet/OPERATING.md | ADAPT | P1 | 2 | Promote accepted changes with existing proof gates; no second Ratchet. |
| R20 | Product loop team evidence |  .project/staff/PRODUCT-LOOP.md | ADAPT | P1 | 2 | Semantic/visual/simulation teams feed one observation intake; simulation is not human proof. |
| R21 | Elephant all-turn capability publication | 01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md | ADOPT | P1 | 2 | Research release per turn, including immature and negative packs; distinct from semantic snapshot. |
| R22 | Source custody and hash manifest | 00_CORE_BASELINE/03_SOURCE_MAP_AND_TRUTH_POLICY.md | ADOPT | P0 | 2 | Each feedback case binds source hash, compiler version, World and projection revision. |
| R23 | ECP cognition-worker handoff | protocol/02_ECP_V0_SPEC.md | COMPARE | P2 | 2 | Transport-neutral evidence exchange; no automatic command execution authority. |
| R24 | Elephant DNA self-model | 05_UNIVERSAL_ELEPHANT_DNA/README.md | EXPERIMENT | P2 | 2 | Telemetry versus self-report; no claims of verified state from agent narrative. |
| R25 | MVP Wiki and workspace demands | mvp/NORTH-STAR.md | INFORM | P2 | 2 | Use as task corpus; do not freeze dev-kit runtime or product architecture. |
| R26 | Stale typing queue fix | Agent report, local patch not verified here | VERIFY | P0 | 3 | Replay patched/unpatched queue; no speed claims transferred to Wasm without same baseline. |
| R27 | Wasm final-stage kit | 07/phase0/devtools/proposals/wasm-semantic-publisher/PRELIMINARY_SPEC.md | EXPERIMENT | P0 | 1 | TS-owned semantics; portable Wasm hot path, tiny host bridge; no Node/Python runtime; build tools allowed. |
| R28 | No duplicate authorities | Rule 1; source Wiki; product loop | ADOPT | P0 | 1 | One semantic case/corpus, no parallel Wiki registry/interpreter authority/PM. |
| R29 | Competing semantic contract sources | Run A; NLCL; D1; Ω SDK | RESOLVE | P0 | 2 | Differential adapters, mismatch inventory and explicit versioned selection; do not silently merge schemas. |
| R30 | Experiment-to-product authority | Rule 1; Ratchet; publication contract | ADOPT | P0 | 1 | Experiment evidence never self-promotes to product law, consent or executable effects. |
| R31 | D1 versus Ratchet canonical JSON | experimental/d1/src/digest.ts; experimental/ratchet/src/canonical.ts | RESOLVE | P0 | 2 | Different undefined behavior: establish portable canonical-byte normative vectors before cross-runtime digest reuse. |
| R32 | D1 Node crypto versus pure Wasm | experimental/d1/src/digest.ts; Wasm proposal | RESOLVE | P0 | 1 | Node crypto remains D1 reference, not final-stage Wasm runtime dependency; benchmark portable hashing. |
| R33 | Browser TDD policy | 07/phase0/devtools/FAST_TDD_NO_BROWSER_LOOP.md | ADOPT | P0 | 1 | Headless tests default when authentic; real browser optional for actual visual/comprehension signal; no mandatory Chromium. |
| R34 | Phase 0 Python reference | 07/phase0/README.md | RETAIN_REFERENCE | P0 | 1 | Keep immutable comparator and replay evidence; no Python shipped in TS/Wasm final-stage hot path. |
| R35 | Public corpus versus private holdout | 07/phase0/HOLDOUT_PROTOCOL.md | ADOPT | P0 | 2 | Public golden rows are not blind; sealed evaluator independent and report contamination. |
| R36 | Runtime and permission separation | D1 contract; Rule 1; Phase 0 | ADOPT | P0 | 1 | Semantic publication is not authorization; bind revision, source, account/session and explicit one-use approval. |
| R37 | Source/knowledge claims vs interpretation | Reflection facts; Semantic Factory | ADOPT | P0 | 2 | Keep proven structural, declared, inferred, commentary, conflict separate in machine and human projection. |
| R38 | Source-reported versus replayed benchmark | 07/phase0 evidence; external agent report | ADOPT | P0 | 2 | MEASURED, SOURCE_REPORTED, ESTIMATED, UNKNOWN, NOT_RUN; no fabricated evidence. |
| R39 | SDK portability versus MVP architecture | Rule 1; MVP North Star; Wasm proposal | ADOPT | P0 | 1 | Dev automation hot path can be pure Wasm without constraining eventual Windows/Tauri product. |
| R40 | Same corpus across languages | Rule 1; signal protocol experiments | ADOPT | P0 | 1 | Every signal protocol version must round-trip meaning/effects/source and log loss or abstention. |

## Explicit contradiction register (must be resolved before claiming one implemented corpus)

- **C01: Sequential versus co-evolution.** Rule 1 supersedes old 'SDK first, representation later' language. Keep old documents as historical; don't rebuild split roadmaps.
- **C02: Parallel registries.** Phase 0 Live Lab, Semantic Runtime Lab, Semantic Factory and Reflection must emit compatible evidence into one logical corpus, not become rival semantic authorities.
- **C03: Run A versus NLCL versus D1 versus SDK.** Not established semantically identical. Keep source-specific IDs and adapters until independent differential tests prove equivalence or intentional differences.
- **C04: D1/Ratchet canonicalization.** Both sort JSON keys, but D1 top-level undefined serializes differently from Ratchet's explicit throw. Establish canonical-byte vectors, Unicode and number cases, and a portable hash before declaring a shared identity ABI.
- **C05: No Node runtime versus existing Node-backed D1.** Dev kit restriction applies to proposed final-stage TS/Wasm hot path, not archival comparators or upstream build tools.
- **C06: Browser prohibition versus UI feedback.** Latest corrected policy permits browser testing when the signal requires actual display, but never mandates Chromium/Chrome for parser/headless corpus loops.
- **C07: Publication versus authorization.** Semantic snapshot, Elephant turn pack, Ratchet promotion and one-use consent are distinct event kinds, linked but never conflated.
- **C08: Reflection truth versus generated Wiki.** Source-grounded structural facts and authored commentary must retain different evidence classes. No source-free Wiki assertions as executable facts.
- **C09: Agent simulations versus human comprehension.** Synthetic agents are valid regression probes, not proof of human understanding. Human metrics remain UNKNOWN until genuine human testing.
- **C10: Wasm proposal versus selected product architecture.** Wasm is a falsifiable hot-path experiment, not a mandate for the final Windows MVP architecture.
- **C11: Public test contamination.** Published 70,101-row replay data are developer-visible; they cannot be used as sealed proof of generalization.
- **C12: Latency attribution.** The agent-reported stale-request queue fix must be incorporated as a comparator baseline before attributing gains to Wasm.

## One-corpus implementation acceptance checklist

1. Every item is uniquely addressable and provenance/version-bound; a conflict is represented explicitly.
2. Machine and Human project from the same frozen semantic publication and independent parity checks can detect missing meaning, effects and source links.
3. The oracle can distinguish projection parity from actual intent correctness, and candidate rejection cannot win by rejecting everything.
4. All compiler/runtime/protocol variants run against the same public corpus plus independently held-out evaluations; record all regressions and negative results.
5. A correction in Human/Wiki/agent projection creates a typed discrepancy case, linked to source and exact candidate changes; changes replay both projections and semantic tests.
6. Reflection/Elephant/D1/SDK research do not silently create a second authoritative semantic registry or product promotion lane.
7. Source hashes, approval context, World/account/session revisions and publication IDs are validated at the authorization boundary.
8. Portable Wasm kit builds/runs without Node/Python runtime; browser is optional for authentic visual testing; no provider credentials or live effects.
9. Agent capability packs publish every turn with maturity/provenance, distinct from semantic publication and product promotion.
10. Corpus is rebuildable from immutable sources and a replay log; cross-runtime canonical-byte conformance is green before shared digest use.

## Fast next experiment (proposed)

Select six representative capabilities. Construct a corpus adapter for Run A, pure TS NLCL and D1. Attach Reflection facts and a Wiki/Human projector to each *without merging incompatible meanings*. Generate deliberate wrong-account, quoted-payload, missing-consequence, stale-revision and misleading-reading cases. Freeze one semantic snapshot per revision; compare machine facts, human reading, independent intended labels and source anchors. Run candidate repairs through public replay, sealed holdout and permission state-machine tests. Measure semantic error, wrong-but-READY, projection loss, correction distance, latency and total candidate throughput separately. Only then decide whether table-driven matcher/Wasm gives genuine speed or portability advantage.

## Scan coverage and limits

Second radial pass used GitHub default-branch code search and targeted full-file reads of Rule 1, SDK anchor, TDD policy, Wasm preliminary spec, signal protocols, Phase 0 README/devtools, Semantic Runtime Lab, Automated Semantic Experiments, source-native Wiki, Negative Intent Engine, Visual Language, Reflection Migrator and source, NLCL, SDK schema, D1 contract/digest, Ratchet canonicalizer/operating guide, Semantic Factory, ECP, Elephant DNA, MVP North Star and product-loop documents. **Not** a repository-wide line-by-line proof, full test run, verified current working-tree scan, or confirmation that historical uploads are still available. Some earlier uploaded archives have expired; request re-upload only if their original bytes are needed for a later source-level reconciliation. This register is a proposal review surface, not a deployment report.
