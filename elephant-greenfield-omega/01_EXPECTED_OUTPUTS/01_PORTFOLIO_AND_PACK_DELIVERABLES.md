# The Required Shape of a Track's Deliverables

## Product, research and implementation are all possible outputs
Every architecture author produces a versioned independent **design proposal** with explicit idea, novelty alternatives, invariants, unknowns and falsifiers. Every developing Z.ai lab produces a real **track portfolio** of discovered capability packs and a reconstructable reference composition where supported. A portfolio may contain implementations, reference UIs, documents, APIs, CLI tools, protocols, tests, evidence packages, reproducible failures, design methods and third-party integrations. It chooses its own pack boundaries and internal format.

**Do NOT define the list of packs in advance.** A pack is the smallest coherent independently useful capability/claim that a different agent can exercise, inspect or falsify. A broad pack may span a complex service; a verified methodological discovery may consist entirely of reproducible evidence and documentation. Each category must be honest about what it can actually do.

## Questions every published pack must answer
1. What **specific behavior/finding** is claimed, what is excluded and what problem motivated it?
2. Who produced it, for which proposal/track/arm/round/turn, with which immutable source and evidence basis?
3. What files/inputs/services/permissions or context identities are required, with which trusted origins and licenses?
4. How is it used, tested or evaluated, and what actual contract, data, errors or side effects exist?
5. Which successful/failed tests, objective traces, confidence, contradictions and external replications are attached?
6. Which token, runtime, context-load/flush/recovery, dependency, maintenance and monetary costs are **measured**, estimated or unknown?
7. How does an outside worker reconstruct, update, replace, rollback or abandon it?
8. Which other packs or outside runtimes does it demonstrably interoperate with; where is composition untested or contradicted?

A manifest/index may point to immutable versioned blobs rather than duplicating unchanged files in each turn, but must be sufficient for an outside agent to obtain and evaluate the **actual pack content**. A link to the originating agent chat alone is never sufficient.

## Maturity is a factual state, never a publishing gate
DISCOVERED, EXPERIMENTAL, VERIFIED, PORTABLE, COMPOSED, RETIRED and REJECTED (and explicitly BLOCKED/PAUSED execution statuses) can **all be published**. A pack can remain DISCOVERED for many turns, keep the same unchanged version, or regress after contradiction. Publication completeness and maturity are **orthogonal**. Claiming VERIFIED requires independent evidence; publication alone never upgrades status.

## Three different granularities
- **Pack:** portable proof/utility for one emergently bounded capability.
- **Portfolio:** all currently owned packs (including immature, failed and unchanged) + track hypothesis/decisions and current runnable reference where possible.
- **Assembly:** actual tested composition of selected versions, with measured interface friction, regressions and full integration cost.
Comparing only the individual winning packs is not enough to choose a working complete system.

## Lifecycle
New idea -> register pack identity/status as soon as it becomes an owned candidate -> preserve experiments and lineage -> revise/merge/split/retire as evidence develops -> publish full portfolio inventory each turn -> independently hand off and verify -> compose only when integration works. Never erase negative results or history.
