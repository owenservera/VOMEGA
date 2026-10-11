# Elephant Gym Initial State — Infinite 3D Canvas, Shared Execution Manifold, Full Parity

**Status:** OWNER-DIRECTED DESIGN; IMPLEMENTATION NOT VERIFIED. The four [approved Gym rules](LAUNCH_POLICY.md) remain controlling. This is an evergreen synthesis of **existing research**, not a new semantic API.

## The substrate is an infinite 3D canvas

The common **human-facing development substrate is an effectively infinite 3D canvas**, initially empty except for a floating command/text box. The source of this direction is the [existing v0.5 north star](../../00_CORE_BASELINE/04_MVP_V0_5_PRODUCT_NORTH_STAR.md), which explicitly defines the empty infinite canvas, progressive disclosure of Wiki/drawers and deferred Windows packaging. “Infinite” means extensible navigation, not infinite computational capacity. Independent Gym test runners can be headless or use other implementations; they need not each run a browser/3D renderer.

The **human–machine real-time execution manifold** is one inspectable spatial, temporal and semantic environment shared by the human and the machine. Input, intent, semantic objects, source/version, Elephant context, knowledge, uncertainty, choices, effects and runtime state should have a coherent representation there. Moving through the canvas or choosing Machine/Human mode should never silently change the semantic identity or authority of an action.

## Reuse today's established parity contract

The [Machine ↔ Human Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md) already defines **one meaning, one immutable publication, multiple aligned projections**. [Original publisher proposal and decisions](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/PROPOSAL_AND_DECISIONS.md) and [benchmark research](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/BENCHMARKS_AND_EXPERIMENTS.md) provide the detailed method. We **reuse** these instead of inventing another parity schema.

**Full parity means:** at each supported versioned semantic snapshot, Machine structured meaning, Human Plain Reading/Wiki and visible spatial objects assert the **same** identity, targets, args, relationships, consequences, alternatives, uncertainty, source basis, authority and relevant temporal/execution state. Views can display different detail, but must declare omissions, never invent/upgrade meaning or silently omit material consequences. Per-projection agreement is NOT proof that either view captured the human's intended meaning; keep expressed intention separately.

**Real-time manifold:** typing or spatial interaction updates a *draft* machine interpretation plus a human-readable interpretation and relevant Wiki. Revision tagging rejects stale late completions. Enter freezes the then-current source-bound semantic publication (including explicit incomplete/ambiguous status). It does **not** execute an external effect. Subsequent authorization and actual execution are separate state transitions with visible, independently verifiable receipts. This preserves *shared real-time execution observability* rather than unsafe implicit execution.

**One feedback circuit:** human-intent vs machine interpretation vs human understanding vs source/runtime/witness is the Rule 1 learning signal. Parity disagreements, source/wiki drift, stale spatial representations, revision races, missing effects or uncertainty, and agent context loss are experimental feedback—not a second downstream UI project.

## Preserve and extend the established benchmark families

Use the existing [B-LIVE/B-WIKI/B-PARITY/B-VELOCITY research](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/BENCHMARKS_AND_EXPERIMENTS.md) **without requiring Wasm**.

- **B-LIVE:** current input revision produces correct, intelligible, timely meaning; stale previews never appear current.
- **B-WIKI:** visible claims are source linked, uncertainty-labeled and invalidated on relevant source changes.
- **B-PARITY:** Machine/Human switches retain identical publication ID/digest/source/status, choices, target and effect meaning; no projection creates permission; revisions create new publications; deliberate mutation is caught.
- **B-VELOCITY:** end-to-end time to tested/improved correction, build/replay throughput and lifecycle cost; speed cannot excuse unsafe semantic changes.

**Canvas parity extensions (proposed controls):** spatial movement/relabeling must not alter canonical identity or authority; a spatial node cannot depict an effect as complete without a matching witnessed state; historical/frozen/current nodes cannot be confused; an injected wrong source link or outdated spatial fact should be detected. Preserve the benchmark's negative controls and independent oracle. The [current Phase 0 Live/Experiment/Change tools](AUTOMATION_REUSE.md) remain a comparison baseline, not proof of full spatial parity.

## TypeScript, HTML and WebAssembly boundaries

The Semantic SDK is TypeScript-first. A single self-contained HTML artifact may be a rapid-build experimental output for the first interactive canvas lab; it is not the editable SDK source of truth and does not satisfy the canvas requirement merely by displaying a flat text box. The first canvas slice may be visually minimal; canvas engine, renderer, build system, spatial graph and persistence remain open experimental choices.

**WebAssembly is NOT required** in the semantic hot path, shared substrate or SDK. The old Wasm proposal is valuable prior research and now an [optional developer booster kit](WASM_BOOSTER.md) which can compete against existing lean TS/JS and Python implementations. Do not impose no-Node/no-Python constraints on every lab.

## First proposed acceptance, NOT RUN

A tiny real canvas shell (initially floating input only) produces revision-linked Machine and Human draft views; Enter freezes one publication; spatial/Human/Machine views preserve that snapshot's meaningful facts; one deliberate stale/mutated representation produces a witnessed discrepancy; no effect occurs without a separate gate. An independent headless trial can replay the publication and detect parity without the 3D view. All these are **targets**, not achieved results.

The original [four independent Gym runs](README.md) and [all-maturity publication law](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md) remain intact. Lab methodology is open, while the shared canvas experience and full-parity goal are owner-directed.