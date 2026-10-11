# Elephant Lab End-State — Shape, Not Components
**Normative operating contract · 2026-10-11 · documentation-only**

## Intent
We deliberately **do not predesign the eventual Elephant System's component list**. Three independent engineering/research ecosystems (A, B, C) discover, implement, falsify, and improve the necessary capabilities through real experimentation. Each independently produces a **portable portfolio of capability packs**. The mature system may be composed of some, all, or none of the candidate packs after separate interoperability and system-level proof.

The intended deliverable is not "three clever documents", nor "one monolithic implementation from each team", nor a menu of predetermined subsystems. It is **three coherent, independently reconstructable bodies of engineering work**, with verifiable pack boundaries and explicit source/provenance/contract evidence, from which superior complete Elephant systems can be evaluated and assembled.

**A = resident cognition first; B = reconstructability/context economy first; C = reuse proven tools and standards first.** These remain research orientations, not prescribed architecture choices. C-Design continues exactly one **closed A/B round behind** when accessing A/B design evidence, with a separate C-Benchmark operator allowed to see frozen current-round submissions after lock and an independent Truth evaluator required to certify results.

## The three structural scales (fixed shape, free contents)

**Scale 1 — Track habitat / independently operating portfolio.** Each track owns its own research assumptions, design lineage, active candidate implementation(s), suite of produced artifacts, execution/recovery instructions, pack index, verification evidence, and attributable costs. It can continue experimentation or reconstruct the eligible current version **without reading the others' private current-round work**. A, B and C remain distinguishable until evidence supports cross-track selection. Shared substrate is permitted only when equally accessible, justified and provenance-controlled; a shared hidden service must not masquerade as track self-sufficiency.

**Scale 2 — Capability pack (the exchange and selection unit).** A pack is the *smallest coherent, independently useful contribution* the discovering track can defend. It can hold code, docs, schemas, operational procedures, service/API endpoints, context material, CLI utilities, models, tests, data/fixtures, traces, novel mechanism designs, tool integrations, or other artifacts **as actually needed**. Some packs are research/verification contributions rather than runtime components; state that clearly. No arbitrary file quota, folder layout, implementation language, API framework, process model, or preapproved pack name. A useful capability may span many modules; do not split it to satisfy an artificial size rule.

**Scale 3 — Composed system / reference realization.** Each track maintains a runnable *reference composition* or verifiable equivalent showing how its available packs solve a meaningful slice of Greenfield Ω and Elephant research. That reference composition is an integration proof, **not** a mandate that every pack only makes sense inside the track's whole system. The final best-of-breed system remains emergent; the lab tests pack compositions, compatibility boundaries and measurable behavior before promoting an assembly.

## Universal obligations (independent of chosen artifact forms)

**S1 — Declare a falsifiable capability.** Describe the external outcome, conditions where it matters, non-goals, limitations, and a concrete observation proving it works or fails. Do not describe a file tree as the capability.

**S2 — Declare identity, lineage and trust.** Stable pack identity and version; originating track, round and arm; relevant source/evidence epoch, hashes, license/third-party origins, authoring/runtime model claims when verifiable; status and known open issues. Every major claim traces to reproducible evidence or is explicitly tentative.

**S3 — Bound dependencies and operating authority.** Make environmental assumptions, inputs, external services, permission needs, data restrictions, version requirements, and side effects inspectable. No undocumented access to a track's private context, hidden secrets or ongoing worker worktrees. Minimize external dependency burden but do not ban justified dependencies.

**S4 — Specify its observable contract, not a mandatory technology.** Describe how it is used or evaluated, expected inputs/outputs or other interactions, errors/failure states, idempotency where relevant, version/compatibility expectations, and security boundaries. A conceptual/rule/evaluation pack may expose a documented method and reproduction recipe instead of an API. When the pack actually has a runtime interface, document its invocable surface exactly.

**S5 — Make verification portable.** A different model, agent or human should be able to re-run the relevant check with declared inputs and environment. Include acceptance and falsifier evidence, source/test/fixture identities, reproduction sequence, negative cases and output signatures where applicable. A failed experiment can be a valuable **negative-result pack** if the failure and boundaries are honestly reproducible.

**S6 — Provide bounded recoverability.** Explain how to instantiate, inspect, update, rollback, and retire the pack as appropriate; distinguish what is durable from ephemeral context. A knowledge-bearing pack must declare where its truth comes from, how validity is checked and how to rebuild after loss of the original model session.

**S7 — Expose real economics.** Record observed/estimated/unknown token usage, calls, time, setup/refresh/maintenance, required agents, external services, data transfer and failure costs in the dimensions applicable to this pack. A pack without a relevant metering source marks it UNKNOWN, never zero.

**S8 — Remain independently evaluable.** The pack cannot rely on the originating Elephant/worker being online to *explain what it does*. Verification may require documented external dependencies, but not undocumented personal conversation history. A non-runtime pack must include an independently interpretable experiment, argument or method.

**S9 — State composition capability honestly.** If it claims interoperability, identify its required neighbors, boundaries, version constraints, adaptation cost, precedence on overlapping behavior and proof of integration. If not yet composed, label STANDALONE/UNTESTED; don't force every contribution into an API.

**S10 — Permit future replacement.** Preserve known contracts and incompatibilities across versions, document rollback/migration implications, and distinguish hard guarantees from provisional ideas. Replacement must not silently override project source truth.

**S11 — Preserve safety and integrity.** Do not package credentials, secret session traces, private provider captures or privileged write capability as portable context. Protect against source-epoch spoofing, fake agent independence, overstated concurrency, and unverified execution.

**S12 — Enable transfer of understanding.** Another agent given only the pack and declared public dependencies should be able to explain its operating purpose, interrogate its assumptions, inspect evidence, and decide whether to reuse, repair, reject or supersede it. The documentation can be any form that makes this possible; no compulsory file count or naming scheme.

## What is expressly **not** decided
- Which system capabilities, subsystems or microservices should exist; their number, size, names or ownership.
- Whether the ultimate ECP transport uses A2A, MCP, local IPC, CLI, a new protocol, or multiple boundaries.
- Whether context should reside in persistent sessions, rebuildable prefixes, retrieval, checkpointed graphs or an approach not yet imagined.
- Which programming language, database, UI stack, framework, deployment topology or runtime scheduler to choose.
- Whether an individual useful pack is code, an API, a design, a test method, a protocol, a tool, an adapter, or a hybrid.
- Which track's pack ultimately wins; whether final integration assembles A+B+C or yields a new approach.
- Arbitrary per-round counts of accepted packs. A failed, documented investigation may be more valuable than a meaningless packaged component.

## Boundary of prescription
We **do** require a common ability to interrogate packs and evidence; we **do not** require an identical internal architecture, single metadata syntax, transport or folder shape. A thin normalized *exchange view* can translate each pack's native materials into capabilities/claims, dependencies, verification, usage and lifecycle. Only proof-critical semantics are non-negotiable. The laboratory must discover the lowest-friction actual representation and test interoperability instead of prematurely manufacturing a comprehensive platform.

## End-state acceptance
A portfolio qualifies only if a separate agent can (1) locate its declared packs and their status, (2) choose a claimed capability without consulting original sessions, (3) reconstruct or examine it under declared constraints, (4) reproduce material claims, (5) identify unknowns and dependencies, (6) compare it fairly with other packs, and (7) integrate it or explain why it should not be integrated. Each mature track must also demonstrate a real reference composition solving meaningful Greenfield Ω tasks. The final composed system is a **subsequent experimental result**, not a predetermined sum of all packages.

For interaction with original round gates see 24-26 and the live prompt at prompts/06_END_STATE_PACK_SHAPE_HOT_INJECTION.md.

## Additional release invariant: no hidden immature packs, no round-only publications

Every bounded top-level development turn MUST create a discoverable immutable snapshot of the track's **complete** capability pack portfolio. All statuses are included, even failed, only proposed, blocked, retired and unchanged; actual pack content or verified immutable older-version pointers must be available for outside examination. The lab does not wait for independent verification or round close before publication. Child workers return pack/evidence deltas for parent release. Pack design, internal artifact types and eventual subsystem inventory remain unrestricted. See ../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md. An unpublished turn is not a successfully published turn.
