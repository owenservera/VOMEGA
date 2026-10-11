# Optional Development Booster: WebAssembly Semantic Publisher

**Status:** RESEARCH CANDIDATE, NOT REQUIRED / NOT IMPLEMENTED AS PROPOSED. **Owner correction (2026-10-11):** reuse today's established full Human–Machine parity and publishing research; remove the WebAssembly requirement and make it a **potential development booster kit**.

## What to retain

The detailed [publisher design](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/README.md), [original intent/choices](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/PROPOSAL_AND_DECISIONS.md), [automation feedback wiring](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/AUTOMATION_LOOP_WIRING.md) and [benchmarks](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/BENCHMARKS_AND_EXPERIMENTS.md) already define an important and reusable target: live Plain Reading, source-derived Wiki, Enter-to-publish immutable semantic snapshots, full Machine/Human parity, independent human-intent checks, staleness controls and rapid falsifiable feedback. These obligations belong to the **shared Rule 1 experiment**, regardless of technology.

## What changes

The proposal-specific **Wasm kernel, AssemblyScript or other TS-family-to-Wasm compiler, all-Wasm semantic hot path, no-Node/no-Python runtime constraint, Wasm binary packaging and batch-Wasm replay** are optional experimental techniques, **not canonical Gym/SDK requirements**. Existing original research stays preserved as a historically scoped proposal; this newer owner direction supersedes only its technology prescription. The [infinite 3D canvas and real-time parity manifold](INITIAL_STATE.md) are the common interactive target.

## Potential booster experiments

A Wasm module might accelerate deterministic parsing, compilation, canonical serialization, source-derived semantic indexes or high-volume DOM-free replay. Compare it to a behavior-equivalent lean TypeScript/JavaScript baseline and the existing Python Phase 0 reference where viable. Measure real setup/build time, Unicode/bridge overhead, hot and cold performance, binary size, source maps, maintenance, correctness, full-loop accepted-correction time, source/Wiki fidelity and parity outcomes. Count end-to-end costs and negative results, not just compute microbenchmarks.

WebAssembly does not natively drive the browser DOM; host glue is required. Standard TypeScript compilation does not automatically emit Wasm. A self-contained HTML demo does not establish Wasm superiority.

## Promotion boundary

Use the existing feeder, Experiment Runner, Change Lab and [Gym review policy](LAUNCH_POLICY.md). Wasm may be kept, improved, rejected or replaced on experiment evidence; no model gets to ratify it into shared canon. No verified Wasm performance advantage or shipped shared spatial runtime is claimed here.