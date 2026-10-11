# Three Independent Portfolios → Emergent Elephant System

## Guiding tension
Requiring completely unrelated outputs makes eventual integration impossible. Requiring one central component roadmap makes all tracks variations of the same design. The experiment therefore standardizes **claims, evidence, authority and exchange**, while allowing discoveries, decomposition and implementation to diverge freely.

Think in *portfolios*, not predetermined modules. Each track owns its own coherent suite, which may naturally produce capability packs as certain solutions stabilize. It also holds work-in-progress material that is not yet suitable to package. C can import standards; A/B can import proven C techniques only after round close under existing information embargo.

## Isolation is both cognitive and operational

**Design independence:** A, B, C evolve their own hypotheses, decisions, and codebases/reference compositions; A/B assimilation decisions happen independently. No controller may force agreement on a shared decomposition or preferred stack. Similarity is allowed when independently justified with evidence, but copying without attribution or independent tests is not a distinct result.

**Source/workspace independence:** pack development in permission-limited sandboxes and short-lived worktrees. Explicit owner for writes; no running agent touches others' active worktree. Shared Git main is an integration ledger, not a place for concurrent unreviewed edits. Copying or adopting specific released material is an explicit versioned action with origin/license preserved.

**Knowledge independence:** agents receive only permitted frozen evidence and pack exports, not privileged origin chat. C's design context at Rn sees locked A/B R(n-1), never A/B Rn source; C's benchmark operator may see frozen Rn candidates after submission lock without sharing implementation source with C-Design. Independent judge holds unexposed tests.

**Operational independence:** a pack must declare services, process state, expected credentials/sandbox limits and external interfaces; 'self-contained' does not mean zero dependencies. Tests should include a clean working environment, failure/restart, and missing-dependency response as appropriate.

**Evaluation independence:** an origin author may propose a test, but only independent reexecution/evidence review can certify material claims. C runs the comparison pipeline but does not issue final verdicts on itself.

## Portfolios should be legible at three levels

**Track-level overview** expresses the strategy, main unresolved hypotheses, observable achievements, evidence and pack map. It must be enough for an external agent to find relevant parts, not a grand unverified project narrative.

**Pack-level exchange** exposes bounded useful claims, invoke/replay semantics (as applicable), interfaces and dependency constraints, source/evidence lineage, maturity and measured costs. No obligation to generate a redundant set of files if a single source fulfills the contract.

**System-level reference composition** shows a runnable or otherwise directly verifiable set of cooperating track packs that addresses the shared Ω seed and lab requirements. The reference integration must not be treated as proof each constituent is independently portable; run a separate extraction test.

## Emergent boundary discovery
A component boundary is *discovered* when a measured group of behaviors coheres. Ask: (a) does this solve a usefully describable problem? (b) can another party consume or evaluate it without reconstructing unrelated track history? (c) can it change without unduly breaking neighbors? (d) can its critical evidence be reproduced? If 'no', it may be too broad, too fragmented, too coupled, or not ready. Let experimental evidence decide, not names or predeclared pack counts.

A track may:
- Split a candidate pack into better independently testable boundaries;
- Merge highly entangled candidates where separation imposes cost;
- Retire a pack after a negative external reproduction;
- Fork a documented implementation for a falsification experiment while retaining lineage;
- Release non-runtime evidence packs when they materially resolve a technical uncertainty;
- Replace an original implementation with a proven third-party package under the same declared capability claim;
- Declare unresolved overlap with another track rather than pretending compatibility.

## Integration is its own falsifiable experiment

For every proposed composed system, document which **pack versions** are selected, the reason for each selection, interface contracts, ordering/side-effects, dependencies, adapter changes, shared evidence and expected emergent behavior. Exercise in a clean, isolated integration environment. Test not just happy path but contradictions, stale epochs, out-of-domain requests, context loss, duplicate/cancel/retry, access control, token-metered latency and failure recovery where applicable. Measure integration cost, bridge code, runtime complexity, interoperability losses and security surface.

The resulting best-of-breed system is NOT just the leaderboard's individually top-scoring pack for each claimed ability. Local winners may be jointly incompatible, redundant or fragile. Select **Pareto-optimal assemblies** based on actual composition performance. Keep the best standalone source available even when a different variant proves a better integration choice.

## Compatible overlap without forced consensus
Different tracks may solve the same underlying problem in incompatible ways. The pack exchange should represent overlap as equivalence candidates or competitors only when the **externally verified behavior** matches. Do not align designs around invented universal interfaces just to make a comparison table prettier. Protocol adapters should cost no more than their observed value; retain native alternatives.

## Collaboration timing and course correction
At closed Rn the independent evaluator certifies (or disputes) pack claims and system-level benchmark results. At R(n+1), A and B independently inspect verified C[n] offerings, can adopt parts to repair their previous runnable reference, or use them to test next hypotheses. C's design team sees A/B[n] only as its new prior-round evidence. None must consume all other packs. This preserves distinct exploration yet permits rapid transfer of *proven* wins.

## Anti-goals
Do not demand identical folder trees, machine-readable schema types, fixed API count, a separate microservice per ability, a full reference implementation for every raw discovery, uniform dependency choices, permanent branch ownership, forced selection every round, or prespecified final assembly.

## Practical success test
Hand an outside agent a selected released pack or a complete track release **without access to the originating sessions or restricted worktrees**. Ask it to identify capabilities and limitations, prepare the environment, reproduce the published test, safely invoke or analyze the pack, estimate integration effort and recover from one induced failure. Failures become concrete next-round hypotheses. This test is more valuable than an attractive static architecture diagram.
