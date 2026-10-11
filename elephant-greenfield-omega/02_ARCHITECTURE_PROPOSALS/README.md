# 02 — Independent Architecture Proposals

Each architecture proposal is a **separate authorial hypothesis**, NOT a development system, a research-arm label, a maturity-certified implementation, or a mandatory final component plan. This folder hosts initial and revised proposals from different model sessions. New author entries are added when they actually submit material; no speculation presented as another author's work.

## Structure
- [ours](ours/README.md): the existing assistant-authored greenfield Elephant/ECP architectural hypothesis assembled from the legacy docs.
- [claude](claude/README.md): independently submitted Claude ECP v0.2 capsule-first proposal, source kernel and documented evidence limitations; imported but not live-product-certified.
- [others](others/README.md): conventions for further separate authors; create one folder per actual independently identifiable proposal rather than one combined 'others' design.

## Required author proposal shape (not a prescribed component list)
The author must provide: independent problem interpretation; its own end-state vision and technical thesis; major invariants and decisions made vs left open; behavior from E0 to E1 to E2; communications and context/flush/recovery hypotheses; who may write code; how tests and provenance establish authority; potential failure/novelty hypotheses; falsifying experiments; what it expects to gain in useful validated development throughput; an initial bounded implementation plan; how to distinguish its core idea from alternatives; and version/lineage/unknowns.

It should be sufficiently definite that an *unrelated Z.ai builder* can run experiments to prove or disprove the architectural thesis, without importing the author's original conversation state.

## Genuine independence
Give each new author only **00_CORE_BASELINE + 01_EXPECTED_OUTPUTS + this author charter** as the common brief. Do not silently supply our ECP candidate as 'the answer.' Authors may cite publicly visible alternative protocols as evidence, but their initial proposal should be distinguishable and preserve full provenance.

Every authoring development turn also emits a versioned design/capability inventory, even when early, incomplete or challenged, under 01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md. This is not a claim of a working product.

## Release to independent developer
Once a proposal meets minimum interpretability criteria, allocate a *separate full Z.ai development session* and bounded workspace via 03_DEVELOPMENT_SYSTEMS/proposal-specific. Its exact proposal version/hash becomes the **architectural anchor**. One controller/session per accepted unique proposal. Do not combine Claude, ours and others into the same interactive Z.ai thread. Cross-session exchanges occur only through released, referenced packs and independently verified benchmarks.

**Do not conflate this author list with the general Z.ai lab's A/B/C strategy tracks or with E0/E1/E2 Elephant count.**

## Real Claude v0.2 submission received (2026-10-11)

The [Claude proposal](claude/README.md) is no longer a placeholder: the user's uploaded ECP v0.2 capsule-first design, source-message schemata, kernel and six mechanical traces are imported under Claude's author folder. Claude's Z.ai **team-management** source (round controller, scripts, oracles, fixtures, evaluators) is deliberately *not* housed here; it is isolated under [proposal-specific/claude-zai](../03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/README.md). The exact import and manifest mismatch are documented in that development system. No live Claude-specific Z.ai session or validated productivity speedup is claimed.
