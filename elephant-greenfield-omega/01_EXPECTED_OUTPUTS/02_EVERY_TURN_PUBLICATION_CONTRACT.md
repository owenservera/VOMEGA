# MUST-PUBLISH: All Capability Packs, Every Turn, Regardless of Maturity

**Normative. Overrides any earlier rule that a capability pack is exported only after it passes maturity gates.**

## What "every turn" means
- **Agent development turn:** one bounded top-level controller/independent development-session cycle resulting in tool activity, design change, experiment, decision, blockage, or newly observed evidence. Before the top-level session declares its turn complete or launches its next turn, it must **publish** that session's portfolio snapshot.
- **Research round:** a preregistered multi-arm experiment epoch; at round close the controller publishes a consolidated snapshot from each participating track and a signed or provisional comparison. An individual agent may have multiple turns within a round.
- **Child/subagent work:** every child returns a candidate-pack/evidence delta at its own completion (or crash-recovery tombstone) to its parent. A child does not forge the parent release; the next parent turn closure publishes its attributable contents.
- **No-work or blocked turn:** still publish a versioned heartbeat manifest carrying the *complete existing pack catalog*, status and reason for zero delta.

This means: **end of every top-level turn AND every research round, for each participating independent lab and each A/B/C track**, whether a pack is only a concept, still being written, failing, blocked, rejected, retired or fully verified. If a proposal-specific lab has not yet launched, label it NOT_STARTED; do not invent its publications.

## Mandatory release behavior
1. Enumerate **ALL** registered candidate/experimental/mature/rejected/retired packs owned by this track; never silently drop an unchanged or failed entry.
2. Freeze a turn ID, source/parent SHA, originating proposal and lab session identity, evidence-intake basis and status of actual child executions.
3. For each pack publish identity, exact pack version/hash, maturity and operational status, purpose and boundaries, change since prior turn (including unchanged), owner/lineage, artifact locations/content, evidence/test status, measured/estimated/unknown costs, dependencies and blocking questions.
4. Preserve still-incomplete content (e.g. draft spec, partial implementation, failing tests and reproducer) in the *released pack*, with explicit status. An empty 'pack' placeholder with no actual substance is not proof of an implemented capability; it is a valid DISCOVERED hypothesis only when its proposed claim/test are concrete.
5. Publish the complete portfolio manifest/index, its immutable references, and new/changed pack materials to durable reachable storage (Git commit+refs or equivalent verifiable artifact store). Link to actual content, not only a self-score or conversation.
6. Publish a delta/change log: added, changed, unchanged, split, merged, paused, blocked, rejected, retired; retain lineage aliases and previous versions.
7. Sign/attest where tooling supports it, audit hashes independently, preserve secret-sanitized logs and report exactly which uploads failed.
8. Include at least one accessible operator-facing summary and a machine-inspectable inventory. Format is flexible; data semantics are fixed.
9. Independent evaluation may arrive later; **do not delay publication** awaiting VERIFIED status. Reopen/correct scores via a new version with traceable evidence. Publication is not certification.
10. Mark the turn **UNPUBLISHED/BLOCKED** if export or manifest verification fails. Do not claim the turn published or proceed to a new turn as though it did. Implement retry and local durable staging; recover without dropping evidence.

## Allowed efficiency optimizations
No demand to duplicate gigabytes or produce a separate ZIP for every single model message. A turn-level immutable portfolio snapshot can reference **content-addressed existing pack versions**, including unchanged entries. Changed or first-time packs must export their actual applicable source/doc/test material. Use hash-verified links and a compact index. This rule is about completeness and transferability, not wasteful full repacking.

## Required logical publication fields (not a prescribed file format)
- publisher/session identity, lab and track; design proposal anchor ID;
- turn and round; publication timestamp; previous publication ID/hash;
- exact Git/seed/experiment/evidence intake hashes;
- full list of pack IDs and versions with maturity and running status;
- real attachments/replay recipes and integrity checks;
- cases that passed, failed, were not run, or could not be assessed;
- cost and token observability source and unknowns;
- evidence access/privacy classification and permitted handoff audience;
- rollback/reconstruction pointer and unresolved discrepancies;
- judge/certification status when already available, otherwise PENDING.

## Outside-agent publication test
A separate agent, given only the current publication (plus declared public dependencies), must be able to list **all** owned packs, retrieve the actual incomplete/complete materials, understand which are not yet working, compare to previous publication, and attempt the claimed reproduction without asking the original model chat. The test may fail for an immature pack's functionality, but must not fail because the immature pack was never exported.

## No metric laundering
Published does not mean finished, stable, independent, novel or useful. Report immature/failed content truthfully. Do not publish empty artificial packs to hit a target count. A turn with zero discovered packs still publishes its truthful full portfolio and why; publication count never substitutes for accepted functionality.

## Live migration
Do not rewrite or restart active Round 1 jobs to meet this contract. At the next safe controller checkpoint, snapshot existing pack candidates and mark unverified historical artifacts appropriately; **from that checkpoint forward** enforce turn-close publication. Before the transition, legacy turns without complete packs must be labelled NOT AUDITED, not retroactively passed.
