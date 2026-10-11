# Core Visual Language — Machine-Human-Spatial Parity and Reprogrammable Intelligence

**Status:** OWNER-DIRECTED CORE GYM/SDK R&D OBJECTIVE; semantic interface and proof obligations specified, implementation/protocol schema OPEN and NOT VERIFIED. Date 2026-10-11.

## Why this is core, not decoration

Elephants are deliberately learning by observing, explaining, testing and revising their own SDK, operating protocols and development tools through the **Machine ↔ Human** meaning loop. A high-density **visual intelligence language** is therefore an essential experimental instrument. It must make complex source, execution, context, knowledge, relationships, uncertainty, faults and protocol behavior understandable at interactive speed while retaining a machine-readable representation of **exactly the facts asserted on screen**.

The shared human-facing substrate is the [effectively infinite 3D canvas / real-time execution manifold](INITIAL_STATE.md), beginning with a floating text box and progressively revealed objects. A lab may evaluate its visual components in 2D, headlessly or via text-first controls, but the resulting data model must remain usable in the spatial manifold. Reuse the existing detailed [Command Visual Language](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md), [Negative Intent](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md), [SVG symbolic research](https://github.com/owenservera/VOMEGA/blob/main/harvests/old-vivim/symbolic/chat-SVG%20Symbolic%20Communication%20Design.txt), [17-family symbolic language](SYMBOLIC_LANGUAGE_INTAKE.md), [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md) and existing [parity benchmarks](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/proposals/wasm-semantic-publisher/BENCHMARKS_AND_EXPERIMENTS.md). This doc does not supersede their detailed research or invent another canonical parser.

## Three distinct but linked representations

1. **Canonical machine meaning:** a versioned semantic command/knowledge/evidence graph with stable identity, source and World/agent-context epochs, argument/target slots, authorization scope, lifecycle, evidence, uncertainty, alternative interpretations and observable event history.
2. **Machine-readable visual meaning:** a *derived, typed projection* of the same pinned publication into visual assertions and affordances (which facts a node, edge, color, glyph, position, animation, opacity or disclosure actually claims). Machine/Elephant can inspect this projection without image recognition or reverse-engineering pixels. This view is not a second semantic authority and cannot directly grant effects.
3. **Human-perceptible visual language:** high-density 3D shapes, icons, typography, clusters, spatial relationships, motion, color and progression that communicate those same assertions with progressive disclosure. Human prose/Wiki explanations must remain available, especially when visual encodings are ambiguous or inaccessible.

A renderer's output is not assumed equal to the machine-readable visual specification: **test that actual interactive UI states faithfully realize the declared projection**. Text-only/headless tests can verify semantic projection invariants; actual view and human-comprehension tests are separate. A pretty node is not independent evidence of correct semantics.

## Visual intelligence vectors to discover and test

Candidate dimensions include **source identity** (file/function/LOC, trust), **Elephant loaded context** (selected/omitted/current/stale, provenance, updates over time), **semantic meaning** (target, capability, arguments, alternatives), **dependency graph** (internal and cross-Elephant), **agent messages and protocol handoffs**, **execution lifecycle** (draft, compiled, gated, running, witnessed, failed), **authority/risk**, **evidence confidence vs independent proof**, **semantic divergence/negative intent**, **knowledge freshness**, **impact radius**, **capability availability vs advertised capability**, **version/timeline**, **repair cost**, **communication latency**, **unknowns**, and **simulation/live separation**.

The visual language is designed for **high information density without false precision**. It should reveal signal through composition, hierarchy, zoom and progressive disclosure, rather than adding visual labels indiscriminately. No single color, glyph, 3D placement or motion is prescribed as the canonical representation. Explicitly encode unknowns and unavailable evidence. Semantic colors/icons used in visual research are hypotheses requiring comprehension and accessibility tests.

## Personal reprogramming: appearance may change, meaning may not silently change

People must be able to change icon packs, glyph mappings, palettes, contrast, size, shapes, geometry, arrangement, depth, grouping, animation, labels and disclosure rules. **Visual customization is data**, not a silent rewrite of parsed meaning. A valid style/theme/layout transformation must:

- Preserve the same underlying `publication_id` and digest, source/World epochs, semantic object IDs, command capability, grounded targets/slots, permission/effect status, evidence class, alternatives and temporal state.
- Keep required material consequences, ambiguity, safety and stale-source warnings discoverable and understandable at the needed moment. A style that hides required warnings behind a non-obvious control **fails**, even if canonical machine bytes remain unchanged.
- Preserve typed binding between visual affordances and **semantic-edit actions**. A user click/drag on a meaning-bearing element must create an explicit semantic edit to the selected command revision and trigger fresh interpretation/validation/publication; it may not directly dispatch a hidden API call. Presentation-only gestures (pan, zoom, move, rotate, cosmetic grouping) must not alter the command digest or executable action chain.
- Restrict reprogrammable styling to rendering/interaction policy; if the user wants to change the *meaning* of a glyph, classify it as a proposed language/semantic mapping edit, require an explicit versioned review, and test the resulting command chain.
- Handle deliberate collision: e.g., the glyph `✓` may be drawn for user consent, but must not implicitly mean independently verified success; `!` cannot confer execution authority; `~` cannot force ambiguous interpretation to READY. Distinguish machine evidence from a visual metaphor.

**Critical law: visual reprogramming does not break machine command chains.** This is stronger than identical digests: the visible consequence, action discoverability and operator ability to correct must also survive; changed UI controls must still route through the same validated semantic action path.

## Proposed conceptual Visual Projection Receipt (NOT a frozen API)

For each rendered state, agents should be able to reconstruct:
- `semantic_basis`: pinned publication ID/digest, contract/source/World/context epochs, input revision and whether draft, frozen or historical.
- `visual_revision`: renderer build, theme/layout/icon-pack version and user customization provenance.
- `assertions`: each visible fact's semantic ID, field/value/status/evidence/uncertainty, representation channel, source anchor and any intentional omission/disclosure contract.
- `affordances`: each interactive gesture/control's semantic action or presentation-only role, required gate, affected revision, dependencies and allowed outcomes.
- `observations`: whether the projection/render stayed current, conflicts detected, visual-to-machine edits, actual gated tool receipts and a trusted checker result.
- `limitations`: what cannot currently be represented, rendered, sensed or independently judged.

This is a measurement receipt, **not another runtime source of truth**. Do not mandate specific serialized JSON fields, storage, UI framework or graphical engine before testing. A projection that asserts a source fact with no witness is DECLARED/UNKNOWN, not VERIFIED.

## Mandatory experimental probes and falsifiers

**V1 — Semantic invariance under theming:** take a frozen publication and change palettes, icons, labels, 3D positions, grouping, size and visualization library. Assert identical canonical semantic digest and stable binding of required consequences and ambiguities. Inject a malicious/mistaken style hiding a consequence: checker must detect a human-facing loss even if canonical bytes are stable.

**V2 — Interaction-chain invariance:** perform the same semantic edit using typing, an explicit meaning chip, a menu, a spatial object drag and a machine agent action where supported. Compare resulting command meaning/status and authorization boundaries; trace event to machine command. Presentation-only pan/zoom/rearrangement must yield **no command mutation**.

**V3 — Real-time version coherence:** type rapidly, reorder async completion, update source/capability/context revisions mid-flight, then switch Human/Machine/visual modes. No stale interpretation, node or Wiki fact may masquerade as current. Enter freezes one revision and later appearance edits do not rewrite its identity.

**V4 — High-density fidelity and comprehension:** represent a realistic Elephant context/dependency/communication snapshot at low, medium and high detail. Test that an unfamiliar person and a fresh agent can correctly identify observed vs inferred dependencies, freshness, requests, blockers, possible misunderstanding, trust and impact **without unsupported certainty**. Measure reading time, errors, corrected mistakes and unused ornament.

**V5 — Symbolic collision and safe effects:** swap glyph/icon libraries; render `✓`, `!`, `~`, routing arrows and status badges. Ensure meanings remain explicit, consent remains scoped, and no visual can execute unauthorized effects or misstate proof.

**V6 — Reprogramming falsification:** generate user-driven or agent-proposed visual changes, including breaking versions (dropped handlers, invisible required state, incorrect callback, symbol remap). Run semantic digest, action replay, accessibility, comprehension and negative controls. Reject/rollback failing visual packs without modifying the canonical record.

**V7 — Cross-Elephant same truth:** publish one session/source context with dependency, handoff and evidence state; separate Elephant reconstructs the machine visual spec and checks it against a human's spatial view and source/witness. Unknown/inaccessible data must remain explicitly unknown.

Run these through the [existing automated experiments](AUTOMATION_REUSE.md); compare theme variants and visual languages without adding an extra permanent renderer-specific experiment bureaucracy. Preserve synthetic vs real, author-reported vs independently reproduced, and missing telemetry.

## SDK dogfood linkage — core learning vehicle

The [Phase 0 SDK self-hosting objective](SDK_SELF_HOSTING_DOGFOOD.md) specifically requires Elephants to inspect *their own* source/context/protocol/test results by issuing commands and receiving Wiki + visual signals. Visual changes become a **first-class self-improvement target**, evaluated alongside compiler and agent protocol changes in the same feedback loop, not later UI polishing.

A minimum tangible vertical slice:
1. Command: “Explain why my last SDK test failed.”
2. Machine: structured test command/result, code revision, source/witness, affected dependency, uncertainty and possible explanation.
3. Human: source-linked Wiki and Plain Reading that make the result understandable.
4. Spatial: one visible 3D object/relationship that faithfully maps to the same test case, source revision, failure and candidate repair.
5. User reprograms that visual (e.g., icon/colors/layout) without changing meaning or action digest; replays a semantic edit and an appearance-only interaction.
6. Independent tester asserts machine↔human↔visual meaning parity, discovers an injected wrong/hiding visualization, and records actual outcome and capability pack.

This *defines a falsifiable target*, not proof the current implementation can run it. A single-HTML experimental shell may render the tiny slice while the TypeScript SDK/compiler and its actual tool adapters remain source-owned and replaceable. WebAssembly stays optional.

## Decision boundaries

Core to the research is **visual language parity, truthful high-density signal, safe human reprogramming, and a bidirectional machine-readable visual interpretation**. The literal VisualSpec schema, icon taxonomy, color scheme, spatial graph representation, engine (WebGL/WebGPU/CSS/SVG), animation and compile/bundle mechanics remain experimental. Reuse, test, improve or replace the existing design under the [four owner decisions](LAUNCH_POLICY.md) and document any proposed changes to canon for review.

**Never claim parity from one view alone**. The system must be able to expose why it rendered a fact, how the user can correct it, what the renderer actually did, and whether the underlying command and execution chain remained unchanged.
