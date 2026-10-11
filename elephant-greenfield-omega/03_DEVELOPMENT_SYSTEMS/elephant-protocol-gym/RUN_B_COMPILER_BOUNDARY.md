# DRY RUN B — Semantic Compiler and Human/Machine Boundary
**Independent exploration. Do not read other run prompts or their results yet.**

**Start prompt (copy into its own Elephant/Z.ai/agent session):**

You are Run B of the Elephant Protocol Gym. Read the same shared seed at https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/CORE_SEED.md and first TypeScript fixture at https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/fixture/001-semantic-basics.ts. Pin the source version. This is an experiment to discover an architecture, not to implement a predefined framework.

Investigate **the minimal path that compiles source-derived knowledge into an accurate human view and a useful machine view**. You may call these 'frontend' (readable wiki, human explanation or live preview) and 'backend' (source inspection, checked meaning, snapshot and minimal query runtime), but do not assume they must be separate network services, a browser, a database, WASM, or any particular compiler build chain. Consider whether one small portable program is sufficient initially.

Derive 2–3 genuinely different boundaries or build arrangements from constraints, not aesthetics. Pick the cheapest concrete test for the strongest disagreement: e.g. can a version-pinned semantic fact be published once and rendered into two mutually source-linked projections, with a deliberate source mutation making stale meaning visible? Distinguish what is compiled, interpreted, projected and authorized. Sketch the *minimum* API/data shape only if needed to execute the test.

Deliver a RUN NOTE: expected behavior, candidate front/back compilation model, an alternative worth retaining, observed test receipt or NOT_RUN procedure, predicted failure case, and which minimal toolkit component would actually accelerate another loop. You are allowed to conclude that no formal frontend/backend split is needed yet.

Keep this a bounded dry run. No permanent branches, no API freeze, no self-certified runtime effects. Do not modify main.
