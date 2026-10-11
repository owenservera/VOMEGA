# Legacy Intelligence Alignment Map — Expected Discoveries, Not Prescribed Implementations

> **PHASE 0 TARGET CLARIFICATION:** The principal early purpose is **SDK + Elephant operating protocol self-understanding**, using the full development toolchain as a self-test corpus ([SDK self-hosting](SDK_SELF_HOSTING_DOGFOOD.md)). Core [visual-language machine↔human↔3D parity and safe customization](CORE_VISUAL_LANGUAGE.md) are essential in that end-to-end loop, not a deferred visual polish phase. This does not prescribe the legacy solution architecture.


**Status:** OWNER-DIRECTED EVALUATION LENS / EXPECTATIONS, NOT A FIXED ARCHITECTURE, MANDATORY MODULE SET OR IMPLEMENTED GYM FEATURE. **Date:** 2026-10-11.

## Owner's intent

The user expects genuinely exploratory Elephant Gym experiments, over time, to **discover some useful version of most of these capabilities**. We keep previous implementations and designs as *reference examples and reusable experimental baselines*. The reference library should reveal **blind spots and missing capability classes**, not reward imitation of old designs. A new architecture that achieves the same outcome through a different mechanism qualifies. Some historic ideas may be rejected with evidence, merged together, or shown unnecessary.

This is a **coverage lens** for reviewers and independent Elephants, not a list of ten compulsory construction tasks or ten standing teams. Keep the [four owner-approved launch rules](LAUNCH_POLICY.md), the [infinite 3D/real-time parity target](INITIAL_STATE.md), the [existing intake/feeder](FEEDER_REUSE.md), and [one Machine ↔ Human learning loop](MACHINE_HUMAN_SIGNAL.md). Research hypotheses do not become canon without independent evidence and review.

## Ten expected capability classes and reference assets

| ID | Reference / evidence maturity | What an emerging Gym should eventually demonstrate | Evidence of equivalent discovery |
| --- | --- | --- | --- |
| L01 | [MP-21 Reflection Migrator](https://github.com/owenservera/VOMEGA/tree/main/omega-baseline/experimental/reflection-migrator) — **implemented P1–P3; README reports 55 local tests; independent gates pending** | Reliable source inventory, anchored structural facts, dependency/impact queries for self-description | Read-only source extraction, reproducible source identities and a human-readable fact with independently checkable trace; no invented behavioral proof |
| L02 | [Pure TypeScript NLCL](https://github.com/owenservera/VOMEGA/tree/main/omega-baseline/plugins/vivim-nlcl-pure/src) — **source-present interpreter/lexer, broader runtime parity unverified** | Machine-understandable natural/symbolic command interpretation with ambiguity and deterministic traces | Pinned inputs and Worlds yield inspectable candidate semantics, gaps, and human explanation; parity/negative examples measured |
| L03 | [Automated Semantic Experiments](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md) — **design proposal** | Fast repeatable hypothesis/mutation/regression cycles across semantics, Wiki and UI | Baseline-vs-candidate replay on identical pinned scenarios and independently held-out failures; score includes effort, latency and fidelity |
| L04 | [Negative Intent Signal Engine](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md) — **design proposal** | Identify the most consequential plausible misunderstanding early enough to reduce later correction work | Controlled trial of early counterfactual feedback vs plain alternatives, reporting correction steps/errors and unnecessary interruptions |
| L05 | [Semantic Runtime Laboratory](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/SEMANTIC-RUNTIME-LAB.md) — **design proposal** | Composable, resettable, truthful virtual scenarios that make interpretation and execution consequences testable | Reproducible world/intent/action replay with independent witnesses and explicit simulation labels; alternative implementations compared |
| L06 | [Command Visual Language](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md) — **design proposal** | Human-readable real-time visual interpretation, editing, consequence preview and spatial feedback aligned with machine meaning | Source/revision-pinned visual and machine view parity, deliberate stale/incorrect visual state caught, correction is semantic not hidden API call |
| L07 | [D1 Truth/Execution Gates](https://github.com/owenservera/VOMEGA/tree/main/omega-baseline/experimental/d1) — **80 specified gates; repository contains implemented reducer/World parts AND intentional NotImplemented stubs; simulated only** | Distinguish a meaningful parsed command, current World, authorization, effects and independently verifiable outcome | Wrong READY/stale dispatch/consent bypass are blocked; synthetic receipts never called live evidence; actual passing tests explicitly named |
| L08 | [Self-Describing Runtime Wiki](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md) — **owner-directed design, stronger constitution proposals not ratified** | Source/runtime-grounded, contextual, automatically maintained self-knowledge rather than separate hand-authored truth | Wiki claim ↔ source/evidence/loaded-state links; unsupported claims and stale updates detected |
| L09 | [SVG Symbolic Communication](https://github.com/owenservera/VOMEGA/blob/main/harvests/old-vivim/symbolic/chat-SVG%20Symbolic%20Communication%20Design.txt) — **historical exploratory research, not verified system** | Effective compact symbols/geometry for command meaning, ambiguity, routing, state and comprehension in the 3D manifold | Human comprehension + machine/spatial fidelity tests comparing glyph, plain text and hybrid representations, with overload/consent collisions |
| L10 | [Historical BCP-dev source-map references](https://github.com/owenservera/BCP-dev/tree/main/docs) — **external historical discovery target, not individually audited in this pass** | Safely discover useful past algorithms, failures and decisions; reconcile with current sources without granting old work authority | Provenanced asset selection and a demonstrated improvement or justified rejection after replay; actual access/licensing and evidence checked |

These are **ten observations we hope the Gym will converge toward**, not ten named software packages it must ship. For example, L01 and L08 may naturally become one source-to-knowledge capability, while L03 and L05 may merge into one experiment/replay environment. L04 and L06 may be different aspects of one realtime correction surface.

## How to use this map without contaminating experiments

**Before first independent run:** give each agent the governing seed, verified inputs and its own problem. The map may be supplied as **broad outcome coverage** to a reviewer, but do not expose reference implementations, named solutions or benchmark expected outputs to an agent in a *blind discovery trial* unless that trial is explicitly the **reuse-baseline arm**. Keep two valid modes:

- **Independent discovery:** ask what missing capability the experiment exposed; compare findings against this map only **after** the run.
- **Reuse/challenge:** intentionally seed an agent with a historical implementation or design and measure whether it reuses, adapts, replaces or rejects it under a pinned comparator.

Neither mode is superior universally. Clearly label which mode was used, so copying a known design isn't scored as independent discovery.

**After each round:** reviewer maps observed outcomes and failures to L01–L10 as *COVERED_WITH_EVIDENCE / PARTIAL / UNOBSERVED / CONTRADICTED / REJECTED_WITH_EVIDENCE / NOT_APPLICABLE*. Coverage is not an invented percentage and does not mean feature shipping. Capture newly discovered capability classes (L11+) instead of forcing them into the original ten. Measure actual total learning efficiency and surprise, not how closely a diagram matches prior research.

**Periodic convergence review:** ask which historic capability classes keep resurfacing independently; which old code already gives a superior control; which capabilities are missing for the next real end-to-end slice; which attractive old ideas fail held-out tests; and whether source/wiki, runtime/truth and visual/manifold views are maintaining full semantic parity. Only scope-appropriate owner-reviewed findings enter shared SDK/Gym canon.

## First-priority practical comparisons — not mandatory order

1. **MP-21 vs new source/meaning strategy:** use its reported `bun run reflect verify`, `bun run reflect:test` and query API as a *local baseline to independently replay*, not as certified evidence in this pass. Critical nuance: MP-21 reads Git objects at a pinned revision, not uncommitted working-tree edits; live Wiki experiments must avoid silently displaying old facts as current.
2. **NLCL vs new command semantic compiler:** compare the actual `interpret(input, world)` and 17-family lexical/grammar implementation with any newly proposed TS SDK interpretation; see [symbol intake](SYMBOLIC_LANGUAGE_INTAKE.md).
3. **Existing automated-experiments design vs fresh lab loop:** reuse its mutation families and pinned-profile discipline without assuming its proposed schema is already executable. Run the same small semantic/Wiki/parity case suite against conventional and novel methods.

## Feeder and publication

This register is **not a new harvester**. Discovery and custody flow through the existing [feeder](FEEDER_REUSE.md), experiments through [replaceable existing tools](AUTOMATION_REUSE.md) where appropriate, and results through the existing [run review](REVIEW.md) and [all-maturity publication contract](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md). No automatic conversion from “referenced,” “implemented,” “locally reported test,” or “discovered again” to **owner-approved canon**.

The intended success is not *“we rebuilt ten legacy systems.”* It is *“we developed a simpler, independently evidenced Gym/SDK capability set that satisfies the important purposes those earlier systems anticipated—and discovered things they did not.”*
