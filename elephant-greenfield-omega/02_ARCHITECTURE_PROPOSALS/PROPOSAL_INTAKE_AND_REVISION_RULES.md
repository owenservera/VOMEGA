# Architecture Author Intake and Versioned Revisions

## Entry
Receive a proposal from a genuinely independent model author/context. Verify its actual source materials, author/session identity (where supported), stated dependencies and which common baseline version was provided. Assign a stable proposal ID; use author-readable folder name but avoid collisions if several designs come from one model.

## Interpretability gate
External Z.ai agent must be able to:
1. Explain proposed causal advantage over plain E0 retrieval and rival architectures.
2. Trace how the architecture handles one and two genuine contextual Elephant sessions, stale source, disagreement and graceful fallback.
3. Determine what assumptions require proof and how a minimal slice could falsify them.
4. Identify exactly what is a suggested architecture and what is a hard common safety constraint.
5. Start bounded implementation or tool experiments without asking the author to restate its missing undocumented chat.

These are checks on *testability*, not mandatory API names or module inventories. Weak proposals can be published in DISCOVERED maturity while clarification is requested.

## Revisions
A proposal has versions with recorded decision/change ledger. A revised proposal never overwrites the architecture anchor used for an already-frozen experiment. The dedicated Z.ai lab may use newer proposal versions as optional future input if its lineage is recorded; it must not silently redefine past tests.

## Separate builder assignment
A newly accepted proposal launches a **new independent top-level Z.ai Full-Stack agent session** with its own workspace, child-agent controller, metering/evidence store and every-turn pack publication. It is seeded with common baseline + deliverable rules + that proposal's immutable version only. Do not automatically inject competing proposals or general Z.ai implementation artifacts. The controller may later consume **released** evidence under preregistered cross-lab fairness rules.

## Architectures may lose
Rejected, disproven, merged, or superseded approaches are still part of the publication inventory with evidence and historical reproducibility. There is no requirement that every proposal remain viable at the end; their findings may survive as independently valuable packs.
