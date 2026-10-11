# Automation Reuse — Decision 2

**Status: OWNER-DIRECTED; 2026-10-11.** Reuse everything useful from the existing VOMEGA development automation toolkit, keep tools replaceable, and let experiments improve or replace them when justified. This is an integration rule, not a mandate to use every tool or a declaration that the toolkit is production-ready.

## Why

The Gym is intended to accelerate learning about semantics, not spend its early experiments rebuilding infrastructure we already have. Before proposing a new source interpreter, wiki renderer, experiment runner, correction recorder or test harness, inspect the existing asset and determine whether it can answer the immediate experimental question. Reuse should be *evidence-based*: an old tool may be a valuable control even if it is unsuitable as the final implementation.

## Existing automation sources to offer as optional test instruments

1. **[Live Lab, Experiment Runner, Change Lab](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/README.md)** — an experimental Python 3.10+ local-only v0.1.1 implementation, with typed interpretation, Plain Reading, source-wiki projection, source freshness, proposed human correction cases, impact previews and data-only evaluation. Its tests are mock-oriented; the full application/browser and wider runtime claims require independent replay. It is a concrete reusable **baseline**, not a mandatory dependency or a prescribed final backend.
2. **[Phase 0 base lab](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/README.md)** — original semantic interpreter, fixtures, source hashes, synthetic/deterministic checks and no-real-effect mock constraints.
3. **[Devtools PRD](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/PRD_AND_DESIGN.md), [evidence](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/EVIDENCE.md), [fast test policy](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/FAST_TDD_NO_BROWSER_LOOP.md)** — previous experiments, measured limitations and test selection. Browser checks are neither mandatory nor forbidden; use them when they measure a real UI behavior.
4. **[Portable semantic publisher proposal](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/README.md)** — optional competing TypeScript/Wasm research design, explicitly NOT IMPLEMENTED as the proposed final stage; do not smuggle it in as default production technology.
5. **[Existing Elephant dogfood and feeder](FEEDER_REUSE.md)** — source custody/preflight, inventory, reusable ECP/DNA/Claude artifacts and source-to-experiment intake. Reuse this source path too, rather than setting up parallel discovery.

## What each run should do

**Discover → select → replay if possible → reuse, adapt or challenge.** Before investing in a duplicate tool, note what already exists and its source/proof status. If a suitable reusable component runs, record its exact test, versions, result and limitations. For a replacement, explain the specific deficiency and what improvement a comparable trial would measure. If it is unavailable or incompatible, proceed with a smaller local test and mark it unavailable. No agent must use Python, Wasm, a browser, or the current UI.

The strongest first-loop probes are: (a) can a human-readable interpretation and the machine publication refer to the same pinned semantic meaning; (b) can a real human correction be captured as a proposed discrepancy, not automatically treated as ground truth; (c) can a source edit make the old wiki/interpretation visibly stale; (d) can an experimental candidate be replayed without arbitrary code execution or falsely elevated to verified. Do not turn these example probes into fixed backend methods.

## What improvement means

Optimize the **whole learning loop**: setup friction, reproducibility, semantic correctness, source/wiki coherence, correction clarity, inference/context cost, replay speed, regression detection, portability and independent handoff. Distinguish measured from estimated or unknown. A smaller or faster implementation that drops traceability, uncertainty or permission separation is not automatically better.

Agents may propose new tool combinations, minimal adapters, replacement components or complete rethinks, but each should have one falsifiable benefit and a comparison to an existing control when feasible. The toolchain itself should become a **self-describing SDK capability** only through verified source/contract/evidence, not by writing a flattering wiki entry.

## Boundaries

- Do not modify existing active Z.ai/Claude runs, frozen cohort data or preserved historical evidence to make the Gym's comparisons easier.
- Do not automatically execute untrusted candidate code or external provider actions.
- Preserve original toolkit and test results; changes are local/disposable until independently reviewed.
- Source feeder, experiment runner, wiki and human interface remain **replaceable**; no new universal tool dispatcher is required yet.
- Keep the [every-turn capability publication](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md), with all maturity states and failures, when conducting actual Elephant development turns.

## Decision record

The user explicitly selected: “Reuse everything useful from the existing development automation toolkit, keep it replaceable, and let experiments improve or replace it when justified.” This is the operative direction. Which tool is used in which test, and which becomes SDK canon, remains open pending real evidence.
