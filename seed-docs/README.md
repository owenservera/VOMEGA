# VIVIM-Ω — Fresh Autonomous Build Seed

This directory is a fresh project seed for a new autonomous VIVIM-Ω build.

Start with **START-HERE.md**.

## Reading the seed after bootstrap (added 2026-10-06)

Bootstrap has run. The seed still carries product intent, but its documents do not all have the same standing, and some bootstrap-era facts in them have been overtaken by evidence. The project's authority ladder is in `../.project/META-TRACKER.md`; current state starts at `../.project/SITREP.md`.

| Standing | Documents |
| --- | --- |
| Durable intent and invariants. These constrain the work | `VISION.md`, `INVARIANTS.md`, `PROOF-AND-MATURITY.md`, `PRODUCT-ANCHOR.md`, `PROJECT-CONTEXT.md`, `AUTONOMY.md`, `AGENTS.md` (product direction and guardrail sections) |
| Owner-selected current mission. Owen may change it; mechanism is open | `FIRST-PRODUCT-RELEASE-DESIGN.md` |
| Vocabulary, coverage and method guidance. Not schema, not org chart | `CONCEPTUAL-MODEL.md`, `PRODUCT-JOURNEYS.md`, `WORKSTREAM-LANDSCAPE.md`, `RESEARCH-FRONTIER.md`, `KNOWN-REALITY-AND-OPEN-FRONTIER.md`, `BUILD-FOCUS.md`, `HARVEST-FIRST-ENGINEERING.md`, `HISTORICAL-KNOWLEDGE-MAP.md` |
| Lab and design hypotheses. Owner-directed in what they aim at, candidate in everything they propose | `SEMANTIC-RUNTIME-LAB.md`, `SEMANTIC-DATA-ENGINE.md`, `MVP-VISUALIZATION-SANDBOX.md`, `AUTOMATED-SEMANTIC-EXPERIMENTS.md`, `COMMAND-VISUAL-LANGUAGE-DESIGN.md`, `SELF-DESCRIBING-RUNTIME-WIKI.md`, `SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`, `PROVIDER-LAB-STRATEGY.md` |
| Development-system hypotheses. Optional, experiment-driven | `DEVELOPMENT-ACCELERATION-HYPOTHESES.md`, `ELEPHANT-CONTEXT-NETWORK.md`, `ZCODE-CAPABILITY-SPACE.md` |
| Historical records | `CODEX-BOOTSTRAP-START-HERE.md` (the bootstrap ran on 2026-10-05), `BENCHMARKS.md` |

Bootstrap-era facts that later evidence superseded. They are left in place as written, and should be read as history:

- **"Five Space Bunny lanes" as the execution pool** (`AGENTS.md`, `AUTONOMY.md`, `PROJECT-CONTEXT.md`, `CODEX-BOOTSTRAP-START-HERE.md`, `ZCODE-CAPABILITY-SPACE.md`, `ELEPHANT-CONTEXT-NETWORK.md`, `DEVELOPMENT-ACCELERATION-HYPOTHESES.md`). ZCode now routes through `openrouter/auto`; the five accounts were never individually probed. Capacity is measured at each launch.
- **Codex as the bootstrap executor.** Done. No executor holds a standing role.
- **"Required development organization at bootstrap"** (`AGENTS.md`): four coverage areas with heads and a Commons. The bootstrap created that minimal coverage. It is coverage guidance, not a permanent department structure; the same document says the project may split, merge, replace or retire workstreams.
- **The floating command box as "one candidate"** (`BUILD-FOCUS.md` §1, `CODEX-BOOTSTRAP-START-HERE.md`). Owen has since selected it as the first-release mission.
- **Daintree.** It appears nowhere in the seed. It is a separate development habitat that manages Git worktrees and the CLI agents it supports. It does not launch, supervise or manage ZCode.

The Lab documents use strong words inside their own scope: "constitutional kernel", "the reflective obligation is constitutional", "scope lock", "revision law". Those describe the discipline a Lab proposes for itself. They become product law only if `INVARIANTS.md` says so.

The root contains a substantial Ω implementation baseline because the new project needs real code, tests, fixtures, contracts, gates, and prior evidence to inspect.

The root-facing project guidance has deliberately been rewritten so that the old Ω development program does not become the new project's organization or roadmap.

## Seed documents

Read these in this order:

1. **START-HERE.md** — documentation map and fresh-project rules.
2. **VISION.md** — the durable five-to-ten-year product proposition.
3. **PRODUCT-ANCHOR.md** — the first tangible beta route: a persistent VIVIM environment with real provider webapp capabilities.
4. **INVARIANTS.md** — known semantic and constitutional guardrails.
5. **PROJECT-CONTEXT.md** — product history, sovereignty, and how to interpret the corpus.
6. **BUILD-FOCUS.md** — investigation and engineering focus, not a roadmap.
7. **AGENTS.md** — autonomous operating mandate.
8. **AUTONOMY.md** — authority to create the development organization and change Ω.

## Strategic solution design

The seed intentionally embeds strategic design principles across the core documents rather than adding another architecture manual. The autonomous builder is expected to favor capability multipliers, upgradeable engines, replaceable realizations, measurable leverage, and evidence-earned abstraction—and to resist one-off solutions that quietly become the architecture.

## ZCode development substrate

`ZCODE-CAPABILITY-SPACE.md` records the current ZCode execution and extension capabilities relevant to this autonomous build. The fresh project should inspect the actual installed runtime, then use the available native and extension surfaces to design its own development/DevOps environment rather than importing an old agent organization.

## What is inherited

The implementation tree is inherited as a starting substrate.

The detailed `docs/` corpus is inherited as a body of evidence and prior reasoning.

Neither is automatically the blueprint.

Distinguish law, evidence, design candidates, historical decisions, implementation detail, archaeology, and program planning.

## The fresh-project premise

The new autonomous project must derive its own:

- architecture;
- development organization;
- work decomposition;
- roadmap;
- tooling;
- validation strategy;
- implementation choices.

There is intentionally no inherited ZCode/OpenCode team structure here.

## The product anchor

The first tangible route is deliberately concrete:

**persistent VIVIM environment → real provider webapp → human expression → semantic intent → governed action → browser realization → evidence → continuity**

The route is a product wedge.

The long-term destination is the sovereign semantic operating environment described in **VISION.md**.

## Evidence and benchmarks

`BENCHMARKS.md` is retained as historical measured evidence from the seeded implementation lineage.

It is not a current performance contract or roadmap.

The new project should re-measure important claims against current reality.

## Current clean repository layout

The repository root intentionally contains two major directories:

```
omega-baseline/   current Ω implementation baseline/evidence source
seed-docs/        fresh autonomous-build context and bootstrap guidance
```

The current baseline itself includes source/configuration areas such as:

```
contracts/
host/
platform/
plugins/
packs/
compositions/
genome/
sdk/
shim/
shims/
surfaces/
testkit/
package.json
bun.lock
```

Historical BCP-dev `docs/`, old project-management machinery, and several implementation-only historical folders are intentionally not copied into this clean repository.

Inspect what is actually present rather than reconstructing omitted folders merely because historical material references them.

## Rule of interpretation

> **Seed inherited truths, not inherited solutions.**

Preserve the durable product meaning.

Challenge the mechanisms.

## Expanded a priori knowledge layer

The seed also contains seven deliberately non-prescriptive context documents:

- **CONCEPTUAL-MODEL.md** — shared vocabulary, explicitly not a schema.
- **KNOWN-REALITY-AND-OPEN-FRONTIER.md** — epistemic status and unresolved questions.
- **PRODUCT-JOURNEYS.md** — user outcomes that architecture must eventually serve.
- **WORKSTREAM-LANDSCAPE.md** — expected problem domains, not an organization chart.
- **RESEARCH-FRONTIER.md** — areas where deep research/experimentation is likely to matter.
- **PROOF-AND-MATURITY.md** — honest evidence ladder and MVP proof discipline.
- **HISTORICAL-KNOWLEDGE-MAP.md** — how to mine BCP-dev without inheriting its accidental structure.

The seed documents together define the problem space, accumulated knowledge, constraints, aspirations, evidence, and unresolved questions. They do **not** prescribe the solution architecture, organization, implementation sequence, or technical mechanism unless a genuine invariant requires it.

The clean VOMEGA repository intentionally does **not** contain the historical `docs/` corpus. Historical material remains available in BCP-dev through the knowledge map. Likewise, implementation-only folders omitted from `omega-baseline/` should not be assumed present because older seed text names them.

## Provider Lab strategy

**PROVIDER-LAB-STRATEGY.md** records a preferred experimental strategy for accelerating the Provider / Account / Browser / Routing / Healing workstream.

It proposes an instrumented local Chrome-extension Provider Lab that can combine provider-specific semantic mirrors, real human-use shadow observation, live control, conformance testing, drift detection, and healing experiments.

The Lab is explicitly a development environment, not a new source of Ω authority or a commitment to Chrome-extension product architecture.


## Harvest-first engineering

**HARVEST-FIRST-ENGINEERING.md** defines a program-wide doctrine: before substantial invention, search for existing working implementations, tests, failures, protocols, extension behavior, libraries, historical VIVIM/BCP mechanisms, and other evidence that can materially accelerate the work.

The doctrine does not mandate reuse. It requires informed invention.

Meaningful candidates should be dispositioned as **reuse directly / adapt / wrap / port / behavioral reimplementation / research-only / reject**, with provenance, licensing, security, and Ω-fit considered at a depth proportional to the risk and expected engineering cost.


## Development acceleration hypotheses

**DEVELOPMENT-ACCELERATION-HYPOTHESES.md** is an optional idea portfolio for reducing development cycle time and reconstruction cost.

It includes candidate mechanisms such as a local Development Reality Layer / Dev Black Box, automatic context bundles, failure capsules, human-demonstration-to-test compilation, regression harvesting, friction detection, dynamic worker routing, hypothesis arenas, disposable experiment universes, runtime impact graphs, fault injection, session chronicles, product-opportunity mining, and acceleration measurement.

These are **not requirements**. They should be activated only against measured bottlenecks and retained only when evidence shows useful leverage.

## First bootstrap executor — historical

The initial bootstrap was run on 2026-10-05. **CODEX-BOOTSTRAP-START-HERE.md** is retained as a historical execution record, not a current entry point. Codex does not hold a standing role, and the historical five-Space-Bunny topology is superseded as runtime guidance.

For current execution, start from `../.project/SITREP.md`, `../.project/META-TRACKER.md`, and `../.project/agentic-launch/STATUS.md`. The Meta Tracker preserves the complete 67-program map plus 31 accelerator hypotheses; current executors are selected by task/evidence/capacity rather than inherited bootstrap topology.

## First product release design

**FIRST-PRODUCT-RELEASE-DESIGN.md** is the owner-directed design target for the first VIVIM-Ω product release.

It defines the concrete first-release experience: a small floating Windows command box where the user can register Provider Accounts through natural language, see evidence-backed capabilities appear as relationships are established, invoke those capabilities through the same semantic command system, receive real-time interpretation/disambiguation feedback, and access contextual Wiki/help grounded in actual capability/account state.

The first external capability is **prompt.send** against a known supported Provider Account.

This document is more concrete than `PRODUCT-ANCHOR.md` but remains a first-release design, not permanent Ω architecture.

The seed now contains **23 documents**.

## Elephant context network hypothesis

**ELEPHANT-CONTEXT-NETWORK.md** preserves the previously developed “elephant” DevOps acceleration concept: persistent large-context cognitive domain services that workers can query and submit artifacts to for contextual review.

The document intentionally preserves rich conceptual detail—resident/wave/transaction context, epoch validity, Cognitive Work Waves, candidate services, worker submission modes, dynamic topology, congestion, contradictions, context pollution, and experiment ladders—while deferring implementation decisions until measured testing.

Elephants are never canonical truth. Git, source, tests, runtime evidence, and current project truth remain authoritative.

The seed now contains **24 documents**.

## Semantic runtime laboratory

**SEMANTIC-RUNTIME-LAB.md** records the owner-directed design for a standalone VOMEGA language-to-execution testing laboratory: a modular local knowledge engine for taxonomies, language rules, interpretation pipelines, command/capability definitions, virtual Worlds, deterministic executables, visual/interaction packs, corpora, harvested knowledge, experiments, evidence, and promotion history.

The Lab is designed to run without the VIVIM product runtime. It composes pinned **Lab Profiles** so competing NLP, grounding, executable, and visual designs can be replayed against the same scenarios. Everything outside a deliberately tiny constitutional kernel is intended to remain versioned, replaceable, configurable, and experimentally evolvable.

The seed now contains **25 documents**.

## Self-describing runtime and source-native Wiki

**SELF-DESCRIBING-RUNTIME-WIKI.md** merges the self-knowledge architecture, plugin contribution model, Contextual Wiki and Semantic Runtime Lab around one stronger requirement: loaded Ω capabilities must be self-describing by construction.

The proposed core primitive is a narrow Reflection ABI/completeness obligation. Executable declarations, schemas, manifests, source anchors, registry state and evidence derive a read-only Reflection Graph; Wiki pages and realtime relevant links are ephemeral projections of that graph. Plugins require no separate Wiki/README/help files to become understandable, and reflection metadata never grants authority.

The seed now contains **26 documents**.

## Semantic data engine

**SEMANTIC-DATA-ENGINE.md** consolidates the shared semantic substrate behind Reflection, World state, NCL/NLCL interpretation, validated commands, visual projection and the contextual Wiki.

It incorporates the strongest lessons from the external OS-taxonomy candidate without importing its architecture wholesale: stable semantic identity, Capability ≠ realization, typed parameters, explicit realization fidelity, explicit evidence maturity, and multidimensional consequence semantics. It also adds Model as a routing identity distinct from Provider, Account and Session.

## MVP visualization sandbox

**MVP-VISUALIZATION-SANDBOX.md** defines the development-only semantic twin of the first product: a floating command-box simulation over ChatGPT / Claude / Gemini fixture Worlds, Account registration/configuration, optional Model routing, `prompt.send`, per-keystroke interpretation, VisualSpec vNext, semantic correction, contextual Wiki and a clearly simulated pre-execution boundary.

The sandbox is intended to settle the interaction contract before real provider/browser automation obscures UI and semantic design errors.

## Automated semantic experiments

**AUTOMATED-SEMANTIC-EXPERIMENTS.md** defines an experiment system for NCL/NLCL, grounding, defaulting, Model/Account routing, semantic churn, VisualSpec variants, ambiguity affordances and Wiki relevance.

It favors pinned Profile comparisons, corpus-first regression, semantic diffing, false-ready/wrong-target metrics, metamorphic tests and explicit promotion evidence.

## Self-knowledge Reflection Migrator

**SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md** defines a read-first development utility for converting the existing Ω codebase toward source-native Reflection/Wiki compliance.

It scans manifests, contracts, op registration, schemas, config, language contributions, visual contracts and tests; extracts structurally provable facts with exact source anchors; identifies gaps/conflicts/duplication; proposes migration changes; and eventually verifies completeness. It is not a Wiki database and does not invent semantics to reach coverage.

The seed now contains **30 documents**. (Count as of that addition; the directory holds 31 Markdown files on 2026-10-06.)
