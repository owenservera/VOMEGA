# VOMEGA Meta Program Tracker

Status: **CANONICAL PROGRAM MAP / CURRENT STATE INDEX**  
Date: 2026-10-05  
Purpose: one place to see the **complete VOMEGA program**, not just the current release roadmap or the nine local-agent ownership lanes.

---

## 0. What this tracker is

VOMEGA currently has three different planning layers that must not be confused:

1. **Meta programs** — the complete set of important product, architecture, laboratory, research, release and development-system programs described across the seed.
2. **Execution ownership lanes** — SDW, LNC, VFX, SKW, EXP, PRV, RTE, DEV, TRU. These are temporary low-handoff agent ownership boundaries.
3. **Release tasks** — CMD/PRV/REG/GOV/SHL/HLP/REL/TRU/OPS task IDs in `.project/roadmap/`, scoped to the first public release.

This file is layer **1**.

### Authority and openness rule

The meta map preserves important possibilities; it does **not** prescribe the path.

Only explicit product/constitutional invariants and protected Lab/proof boundaries constrain strategy. Everything else — meta-program decomposition, execution lanes, Locks, roadmap milestones, task IDs, sequencing, agent/model assignment, worktree topology, orchestration tools and development habitats — is a **current hypothesis or coordination aid** and may be merged, split, reordered, replaced or retired when evidence supports a better approach.

The owner-selected first-release shape is the current product mission, not constitutional architecture. It may be changed explicitly by the owner; implementation strategy remains open.

Daintree and ZCode are separate development habitats. Daintree can manage Git worktrees and the CLI agents it actually supports; it does **not** launch, supervise or manage ZCode. ZCode runs its own sessions/workers. If both are used, they coordinate through Git, task artifacts and evidence rather than a parent/child control relationship.

A meta program may:
- span several execution lanes;
- contain many roadmap tasks;
- have no first-release task because it is deferred;
- be an experiment rather than a product subsystem;
- disappear, merge or split as evidence changes.

The nine launch workstreams are therefore **not** the complete VOMEGA workstream list.

---

## 1. Status vocabulary

| Status | Meaning |
| --- | --- |
| **PROVEN-SLICE** | a bounded useful part has current evidence |
| **ACTIVE** | implementation/proof is currently justified |
| **CANDIDATE** | design/artifact exists but is not frozen/proven |
| **READY** | sufficiently defined to start when capacity/dependencies allow |
| **RECON** | evidence gathering / characterization only |
| **DESIGN** | substantial design exists, implementation not yet established |
| **DEFERRED** | intentionally outside the current release/critical path |
| **EXPERIMENT** | optional hypothesis that must earn continuation |
| **HISTORICAL-EVIDENCE** | prior evidence/benchmark, not current product truth |
| **BLOCKED** | cannot progress truthfully until named dependency closes |

Priority:
- **NOW** — current convergence/critical-path work.
- **PARALLEL** — useful independent work that can run without blocking NOW.
- **NEXT** — expected after current locks/proof.
- **LATER** — important destination program but not first-release work.
- **OPTIONAL** — accelerator/hypothesis only when measured need exists.

---

# 2. Complete major-program map

## A. Product, MVP and release

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-01 | **Product Release Gym / product selection** | Continuously choose the smallest genuinely useful, provable product slice and re-rank the plan from evidence. | ACTIVE operational doctrine; initial Gym run exists. | NOW / recurring | DEV + TRU + owner | Run at milestone exits or major falsifiers; does not reopen owner-selected product shape casually. |
| MP-02 | **First Product Release — Floating Command Box** | Ship the small Windows box where setup, routing, help and `prompt.send` all use one semantic command system. | DESIGN selected by owner; no product shell yet. | NOW | VFX + LNC + SDW + RTE + PRV | Depends on semantic twin plus real provider/account proof. |
| MP-03 | **First-release end-to-end product journey** | Install → register Account → see capability → command → consent → real send → evidence → restart/continue. | DESIGN / roadmap M0–M10. | NOW | all lanes, TRU gates | The public release claim is only as mature as the weakest live seam. |
| MP-04 | **Packaging / Installer / Windows lifecycle** | Ordinary user can install, launch, update/recover and run without developer tooling. | DESIGN / absent product implementation. | NEXT | RTE | Packaging spike should happen before late polish. |
| MP-05 | **Product Instance / sovereign exit / reconstruction** | Preserve user-owned instance identity, export, restore, migration, replacement and recoverability. | Partial Vault evidence; whole-instance continuity OPEN. | LATER, with release subset | SDW + RTE + TRU | First release needs sane local product location/restart; full sovereign exit is broader. |

## B. Semantic core and simulated product twin

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-06 | **Semantic Data Engine / canonical semantic substrate** | Provider, Account, Model, Capability, Realization, consequences, evidence maturity and semantic IDs form one coherent substrate. | **CANDIDATE Lock A**; not frozen. | NOW | SDW | False-READY defect and default/source rules block freeze. |
| MP-07 | **World / Registry / capability & availability state** | A versioned World honestly says what exists, what is available, what is stale/unknown and what can ground commands. | Baseline registry verified-local but no real Account; candidate fixture World defined. | NOW | SDW | Materialize W1–W6, required-field metadata, fixture/live source enforcement. |
| MP-08 | **Human Semantic Execution Language — NCL/NLCL** | Ordinary expression becomes explicit canonical meaning while preserving ambiguity. | Strong verified-local baseline in wrong domain; **Lock B candidate** for release slice. | NOW | LNC | Adapt frames/grounding; do not replace proven interpreter without evidence. |
| MP-09 | **USE command compiler / validator / defaulting** | Interpretation becomes a deterministic, replayable command with READY only when structurally valid. | CANDIDATE; **CMD-06 false-READY is current choke point**. | NOW | LNC + SDW | Fix U1; explicit > standing default > single valid > ask. |
| MP-10 | **InterpretationSession / realtime revision semantics** | Every keystroke is versioned; corrections are semantic edits; old async results cannot overwrite newer input. | DESIGN / candidate; no multi-revision proof. | NOW | LNC + EXP | Needs explicit revision corpus and late-result suppression test. |
| MP-11 | **Semantic Runtime Laboratory / Ω Simulator** | Run a standalone deterministic miniature Ω: World → interpretation → command → virtual execution → evidence, independent of live providers and product runtime. | **DESIGN ONLY; first-wave pieces exist but executable Lab does not.** | **NOW** | EXP + SDW + LNC + VFX + SKW + RTE | This is the common simulated universe that enables broad parallel work. |
| MP-12 | **MVP Visualization Sandbox / semantic product twin** | Visually replay the complete first-product interaction to **SIMULATED prompt.send** with truthful ambiguity and Wiki. | DESIGN + Lock C candidate; no full executable sandbox. | **NOW** | VFX + EXP + SDW + LNC + SKW | Built on MP-11, not a UI-only mock. |
| MP-13 | **Virtual executables / simulated evidence** | The simulator can execute commands against synthetic Worlds and emit deterministic fake-but-explicit evidence. | DESIGN; not implemented for release slice. | NOW | EXP + RTE | `prompt.send` virtual realization must be clearly simulated; add second unrelated command later as generalization test. |
| MP-14 | **Command Visual Language / semantic interaction protocol** | User can see what Ω interpreted, what is unresolved and what will happen; clicks edit semantics rather than hidden UI state. | Rich DESIGN; no product implementation. | NOW | VFX | Uses semantic handles; presentation/icon library remains replaceable. |
| MP-15 | **VisualSpec vNext / projector** | All UI surfaces receive one deterministic semantic projection and never reparse language. | **CANDIDATE Lock C; extend-vs-replace unresolved.** | NOW | VFX + LNC | Must reconcile current VisualSpec/project.ts before freezing wire format. |
| MP-16 | **Automated Semantic Experiments** | Competing language/grounding/visual/Wiki designs run against pinned scenarios with semantic diffs and falsifiers. | EXP baseline candidate; no full experiment engine. | NOW / PARALLEL | EXP + TRU | Build scenario, diff and metric engines; required-field metadata currently missing for some metrics. |
| MP-17 | **Cross-domain semantic generalization** | Prove the semantic system is not secretly AI-specific by exercising unrelated capabilities. | DESIGN benchmark path. | PARALLEL / later | EXP + SDW + TRU | OS taxonomy is benchmark evidence, not MVP scope. |

## C. Self-description, Wiki and migration

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-18 | **Self-Describing Runtime / Reflection ABI** | If Ω can load a public capability, Ω can inspect and explain it from source-bound structural truth. | **CANDIDATE Lock D**; strongest first-wave traceability; not implemented as ABI. | NOW / PARALLEL | SKW + SDW + RTE | All 24 current manifests have empty `contentHash`; source binding unmet. |
| MP-19 | **Reflection Graph** | Derive a read-only graph of Plugin/Capability/Command/Schema/Source/etc. from actual loaded structure. | Candidate node/edge design + manifest inventory only. | NOW / PARALLEL | SKW | Must stay descriptive; live state joins later. |
| MP-20 | **Contextual Wiki / realtime help** | Generate Glance/Explain/Inspect help from Reflection + World + interpretation, with no parallel Wiki database. | DESIGN; no runtime Wiki. | NEXT after minimal Reflection | SKW + VFX | Same semantic handles as UI; grounded claim provenance required. |
| MP-21 | **Self-Knowledge Reflection Migrator / auto-Wiki migration tool** | Read the existing codebase, extract structurally provable Reflection, identify gaps, propose safe migrations, and verify compliance. | **DESIGN; SKW-L1 performed only the first read-only audit slice. Utility does not exist.** | **PARALLEL / high leverage** | SKW + DEV + TRU | REF-01…REF-12 program; read-only default; LLM suggestions never masquerade as extracted facts. |
| MP-22 | **Source-native semantic declarations & completeness gate** | New/modified public behavior is self-describing by construction and cannot silently bypass Reflection. | DESIGN. | NEXT | SKW + RTE + future Forge | Requires SourceAnchor/content digest and contribution helpers. |
| MP-23 | **Automatic plugin self-knowledge wiring** | Installing a plugin immediately adds capability/config/source knowledge to Reflection/Wiki without authored Wiki files. | DESIGN / synthetic proof specified. | NEXT / later | SKW + future Forge | EXP-12 synthetic zero-doc plugin is key falsifier. |

## D. Real providers, routing and external reality

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-24 | **Provider Lab** | Instrument real provider behavior in Shadow / Control / Conformance / Healing modes and turn messy live reality into reusable knowledge. | STRONG HYPOTHESIS; PRV-L1 reconnaissance only. | PARALLEL | PRV + TRU | Development Lab, not product authority. |
| MP-25 | **Browser transport & Account identity** | Attach to a real user-controlled provider session and truthfully identify Provider + Account + freshness. | **RECON Lock E** only; no live attach. | **NOW critical external path** | PRV + TRU | TRU-05 live-proof protocol + consent/evidence boundary before live observation. |
| MP-26 | **Provider/Account/Model routing** | Route among valid Providers, Accounts and optional Models without hidden defaults or silent retargeting. | Candidate semantics; no live Account binding. | NOW | SDW + LNC + PRV | Model ≠ Provider ≠ Account ≠ Session. |
| MP-27 | **Provider packs / realization boundary** | Isolate provider-specific URLs, identity signals, steps and completion signals behind shared semantic capabilities. | DESIGN / baseline evidence. | NEXT | PRV | First provider is proving realization; provider 2 must falsify abstractions. |
| MP-28 | **Live `prompt.send` realization** | One real prompt goes through the selected Account with attempt/result evidence and no false success. | UNPROVEN; `prompt.send` absent from current manifests/src. | NEXT after transport + GOV | PRV + RTE + TRU | Must first become a real source-native capability and governed realization. |
| MP-29 | **Provider drift detection / conformance / healing** | Detect changed external behavior, mark realization drifted, diagnose/repair under governance, and verify repair. | Baseline healing lifecycle exists; release provider integration not built. | LATER release M7+ | PRV + TRU | Healing is general capability hypothesis, not selector hacks as architecture. |
| MP-30 | **Second/third-provider falsification** | Force shared semantics to survive materially different providers. | DESIGN / release roadmap. | NEXT after provider 1 | PRV + TRU | Claude second; Gemini conditional. |

## E. Authority, Work, data, runtime and extensibility

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-31 | **Authority / consent / refusal** | Natural language never grants permission; every consequential operation has explicit scoped authority or refusal. | Law verified-local; release consent contract not implemented. | NOW / NEXT | RTE + TRU | Consequence ≠ authority. |
| MP-32 | **Execution envelope / evidence / receipts (Work-lite)** | Persist attempt before effect and distinguish executing/completed/failed/uncertain with structural evidence. | DESIGN; durable Work absent. | NEXT before live send | RTE + TRU | No blind retry after uncertain external effect. |
| MP-33 | **Durable Work / Agency / Attention / background continuity** | Consequential delegated outcomes survive worker/process replacement and can continue/recover honestly. | **DEFERRED for first release; destination-critical; durable Work absent.** | LATER | RTE + SDW + TRU | Work ≠ worker; scheduler/pools are not durable Work. |
| MP-34 | **Vault / canonical local data / continuity** | User-owned durable state, provenance and history survive restart and isolation. | **PROVEN-SLICE** locally for Vault/CLI continuity. | ACTIVE foundation | SDW + RTE + TRU | Expand only as new release records require it. |
| MP-35 | **Memory / context / self-knowledge freshness** | Durable memory remains distinct from task context; derived context is attributable/fresh/recomputable. | Partial concepts/legacy mechanisms; broad destination program. | LATER / cross-cutting | SDW + SKW | Do not create a second source of truth. |
| MP-36 | **Plugins / compositions / contribution boundaries** | Replaceable capabilities enter through explicit contracts without secret first-party paths. | Strong baseline exists; needs new semantic/Reflection integration. | ACTIVE foundation | SDW + RTE + SKW | Everything replaceable except minimal constitutional obligations. |
| MP-37 | **Forge / governed self-extension** | Ordinary users/Ω can create, modify, compose and repair governed plugins/capabilities through normal admission/proof. | DEFERRED long-horizon. | LATER | RTE + SKW + DEV + TRU | Reflection completeness should eventually be generated/enforced by Forge. |
| MP-38 | **Governed evolution / compatibility / rollback** | Ω can change itself with lineage, impact awareness, verification and recovery without self-authorizing constitutional change. | DESIGN principle / partial baseline mechanisms. | LATER | RTE + TRU + SDW | Ordinary evolution ≠ constitutional change. |
| MP-39 | **Runtime / constitution / resource governance / failure semantics** | Minimal trusted substrate enforces non-bypassable boundaries, resource/failure truth and replacement. | Baseline host/law verified-local slice; historical gates incomplete. | ACTIVE foundation | RTE + TRU | Revalidate K0/K1; do not move product semantics into core casually. |
| MP-40 | **Surfaces / spatial environment / Canvas** | Multiple replaceable surfaces project one semantic World; later spatial/canvas experience does not become canonical truth. | DEFERRED from first release. | LATER | VFX + SDW | Floating shell is first surface, not final environment. |

## F. Truth, research and evidence

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-41 | **Truth / proof ledger / falsifiers / maturity** | Every important claim has an evidence level, owner, falsifier and independent review. | TRU-L1 active review demonstrated; release ledger/falsifier suite still roadmap work. | NOW / continuous | TRU | Fixture ≠ live; promotion is proof, not confidence. |
| MP-42 | **Harvest-First Engineering / Harvest Bench** | Search baseline/history/ecosystem before expensive invention; assay candidates as reuse/adapt/wrap/port/evidence/reject. | ACTIVE doctrine; PRV-L1 used it. | continuous | every owner; DEV/R&D coordinate | Not a link-dump research department. |
| MP-43 | **Historical VIVIM / BCP knowledge mining** | Reuse old proofs, failures, mechanisms and destination reasoning without inheriting old organization or law. | Available external knowledge mine. | PARALLEL on demand | owning lane + TRU | Time-sensitive facts must be refreshed. |
| MP-44 | **OS taxonomy / non-AI benchmark corpus** | Stress semantic/reflection/visual systems against hundreds of non-AI capabilities. | HISTORICAL/EXTERNAL benchmark; not adopted product scope. | PARALLEL after core Lab | EXP + SDW + SKW | 291 capabilities / 305 Windows realizations are authored evidence, not live proof. |
| MP-45 | **Benchmarks / performance / architecture falsifiers** | Re-measure runtime/resource/latency claims only when decision-relevant. | Historical benchmark corpus exists. | on demand | TRU + RTE + DEV | Old numbers are evidence, not guarantees. |

## G. Development system and local agent factory

| ID | Meta program | What it exists to make true | Current state | Priority | Execution owner(s) | Main dependencies / notes |
| --- | --- | --- | --- | --- | --- | --- |
| MP-46 | **Local Agentic Development System** | Many local agents can work in parallel, hand off through Git/artifacts, and integrate without owner reconstructing everything manually. | **PROVEN first launch slice:** ≥6 bounded ZCode workers completed first wave. | NOW / continuous | DEV + TRU | Bounded workers succeeded; unbounded heavy background agents stalled. |
| MP-47 | **Workstream/dependency/Lock orchestration** | Enable temporary low-handoff coordination through explicit, falsifiable interface hypotheses rather than waiting for whole subsystems. | ACTIVE; Locks A–E candidate/recon. | NOW | DEV | Lanes and Locks are coordination devices, not permanent architecture; a Lock stabilizes interoperability long enough to work and remains replaceable by evidence. |
| MP-48 | **Model routing / heterogeneous intelligence pool** | Use abundant models for work and scarce frontier models for mature review/adjudication; record actual routed model when known. | ACTIVE policy; ZCode currently `openrouter/auto`; concrete model hidden. | continuous | DEV + TRU | Harness ≠ router ≠ model. |
| MP-49 | **ZCode / OpenRouter Auto execution substrate** | Use measured ZCode concurrency/workflows safely without assuming historical provider-account topology. | ACTIVE; ≥6 bounded concurrency verified. | NOW | DEV | Keep config read-only; bounded tasks currently outperform unbounded background workers. |
| MP-50 | **Codex / Claude Code specialist integration** | Use separate harnesses for implementation/integration/review where diversity adds value. | Reachable; not yet deeply benchmarked in new launch. | PARALLEL | DEV + TRU | Cross-provider review preferred for load-bearing contracts. |
| MP-51 | **Grok Build / Grok model integration** | Add Grok as both model resource and execution harness without mistaking harness capability for free capacity. | Binary reachable, not configured/benchmarked. | PARALLEL experiment | DEV + TRU | Shared SuperGrok usage pool; measure output per allowance. |
| MP-52 | **Daintree execution habitat evaluation** | Test whether Daintree usefully manages Git worktrees, Review Hub and supported CLI-agent panels without creating a new source of project truth. | LIVE on the Linux box and available for assay; adoption remains an experiment, not strategy law. | **PARALLEL high-value experiment** | DEV + TRU | Daintree does not launch/manage ZCode. Evaluate Daintree and ZCode as separate habitats that may coexist through shared Git/task/evidence surfaces. Retain either only while it improves validated progress. |
| MP-53 | **Development Reality Layer / Dev Black Box** | Capture minimal local structural development events that can power context, debugging, regressions and throughput learning. | EXPERIMENT hypothesis only. | OPTIONAL when bottleneck measured | DEV + TRU | Privacy/local retention first; potential multiplier. |
| MP-54 | **Automatic Context Bundles** | Give fresh workers compact task-specific context derived from current repo reality. | EXPERIMENT hypothesis. | OPTIONAL / likely before Elephant | DEV | Compare against ordinary repo reading and elephant residency. |
| MP-55 | **Failure Capsules / reproducible debugging packets** | Package failure, environment, changed files and evidence so another worker can reproduce quickly. | EXPERIMENT hypothesis. | OPTIONAL high-value | DEV + TRU | Candidate companion to simulator/EXP. |
| MP-56 | **Trace → Fixture / regression harvesting** | Turn live/provider/runtime behavior into privacy-reduced deterministic fixtures and tests. | DESIGN hypothesis, strongly complementary to Provider Lab + Lab. | PARALLEL when live traces exist | DEV + EXP + PRV + TRU | One of the strongest bridge mechanisms. |
| MP-57 | **Dynamic worker/model routing** | Route tasks to harness/model based on measured task fit, capacity, cost and evidence—not permanent roles. | Manual policy exists; automated router absent. | OPTIONAL / later | DEV + TRU | Need task/result attribution data first. |
| MP-58 | **Hypothesis arenas / independent shadow validation** | Run competing solutions or independent reviews on uncertain load-bearing choices and let evidence decide. | Method available manually; no framework needed yet. | PARALLEL on high uncertainty | DEV + TRU | Do not duplicate routine work. |
| MP-59 | **Disposable experimental universes** | Cheap isolated repos/worktrees/compositions/worlds for agents to try risky alternatives without contaminating main. | Concept partly provided by Git worktrees + semantic simulator; no generalized system. | PARALLEL / grow from need | DEV + EXP | Daintree may supply much of physical isolation. |
| MP-60 | **Runtime dependency / impact graph + test selection** | Know what a change affects and run the smallest high-confidence evidence loop without weakening merge/release gates. | EXPERIMENT hypothesis. | OPTIONAL | DEV + TRU | Reflection graph may eventually provide product-side structural input. |
| MP-61 | **Failure minimization / bisect / regression localization** | Automatically shrink and locate failing changes/inputs/traces. | EXPERIMENT hypothesis. | OPTIONAL | DEV + TRU | Valuable once failure volume increases. |
| MP-62 | **Continuous fault injection / live architectural falsifiers** | Deliberately kill/break sessions, providers, selectors, workers, resources and projections to test truthful recovery. | DESIGN hypothesis; some release falsifiers planned. | PARALLEL as subsystems appear | TRU + EXP + PRV + RTE | Must be bounded and disposable. |
| MP-63 | **Provider-pack hot reload / reproducible environments / build-test acceleration** | Shrink code→evidence loops without weakening correctness. | EXPERIMENT portfolio. | OPTIONAL | DEV + PRV + TRU | Includes hot reload, one-command envs, cache/sharding, affected-test selection. |
| MP-64 | **Automatic Session Chronicle / development knowledge promotion** | Create evidence-derived durable handoffs and promote only useful development knowledge. | Partial manually through Commons/handoffs; automation absent. | PARALLEL after need | DEV + TRU | Do not trust self-summary alone. |
| MP-65 | **Interactive Development Cockpit / congestion awareness** | See and control agents/worktrees/failures/queues when concurrency makes coordination expensive. | Custom cockpit DEFERRED; Daintree now candidate solution. | OPTIONAL / assay Daintree first | DEV | Avoid building a dashboard if Daintree solves it. |
| MP-66 | **Elephant Context Network** | Test persistent epoch-aware large-context domain cognition as consult/review/onboarding service. | EXPERIMENT plan only; no node launched. | OPTIONAL after measured context bottleneck | DEV + TRU | Fresh worker + context bundle + one-shot pack are mandatory comparison arms. |
| MP-67 | **Acceleration Scorecard** | Measure whether any DevOps accelerator improves validated product progress rather than activity. | DESIGN hypothesis. | continuous as accelerators activate | DEV + TRU | Retire machinery that does not earn its cost. |

---

# 3. Development-acceleration portfolio — complete subtrack inventory

MP-53…MP-67 group the highest-leverage themes above, but the seed preserves **31 distinct accelerator hypotheses**. None should disappear from project visibility merely because they are not active.

| # | Accelerator hypothesis | Parent / likely meta program | Current disposition |
| --- | --- | --- | --- |
| DA-01 | Development Reality Layer / Dev Black Box | MP-53 | experiment only |
| DA-02 | Automatic Context Bundles | MP-54 | experiment only |
| DA-03 | Failure Capsules | MP-55 | experiment only |
| DA-04 | Human Demonstration → Candidate Test / Workflow | MP-56 / MP-62 | experiment only |
| DA-05 | Golden-Path Miner | MP-56 / MP-64 | experiment only |
| DA-06 | Regression Harvesting | MP-56 | experiment only |
| DA-07 | Development Friction Detector | MP-67 | experiment only |
| DA-08 | Dynamic Worker Routing | MP-57 | experiment only |
| DA-09 | Independent Agent Shadow Validation | MP-58 | method available manually |
| DA-10 | Hypothesis Arena | MP-58 | method available manually |
| DA-11 | Disposable Experimental Universes | MP-59 | partial via worktrees; general system absent |
| DA-12 | Runtime Dependency / Impact Graph | MP-60 | experiment only |
| DA-13 | Live Architectural Falsifiers | MP-62 | partial release falsifiers planned |
| DA-14 | Automatic Harvest Trigger | MP-42 / MP-67 | experiment only |
| DA-15 | Contract / Falsifier Scaffold Generator | MP-41 / MP-62 | experiment only |
| DA-16 | Trace → Fixture / Synthetic Replay | MP-56 | high-value bridge; not implemented |
| DA-17 | Automated Test Selection / Change Impact | MP-60 / MP-63 | experiment only |
| DA-18 | Failure Minimization | MP-61 | experiment only |
| DA-19 | Automated Bisect / Regression Localization | MP-61 | experiment only |
| DA-20 | Continuous Fault Injection | MP-62 | experiment only |
| DA-21 | Hot-Reload Provider Packs / Extensions | MP-63 | experiment only |
| DA-22 | One-Command Reproducible Environments | MP-63 | experiment only |
| DA-23 | Automatic Session Chronicle | MP-64 | partial manual equivalent exists |
| DA-24 | Tiny Human Intent Annotation | MP-53 / MP-64 | experiment only |
| DA-25 | Development Knowledge Promotion | MP-64 | experiment only |
| DA-26 | Usage-Derived Product Opportunity Mining | MP-01 / MP-53 | experiment only |
| DA-27 | Interactive Development Cockpit | MP-65 | assay Daintree before building |
| DA-28 | Queue / Congestion Awareness | MP-65 / MP-67 | measure first |
| DA-29 | Build / Test Cache and Sharding | MP-63 | measure first |
| DA-30 | Acceleration Scorecard | MP-67 | should gate all accelerator adoption |
| DA-31 | Elephant Context Network | MP-66 | explicit experiment ladder exists |

---

# 4. How the nine agent execution lanes map onto the meta programs

The nine lanes are intentionally broad owners, not a replacement for the map above.

| Lane | Primary meta programs | Important secondary programs |
| --- | --- | --- |
| **SDW** | MP-06, MP-07, MP-14, MP-26, MP-34, MP-35 | MP-05, MP-18, MP-36, MP-38 |
| **LNC** | MP-08, MP-09, MP-10 | MP-12, MP-14, MP-16, MP-26 |
| **VFX** | MP-02, MP-12, MP-14, MP-15, MP-20, MP-40 | MP-03 |
| **SKW** | MP-18, MP-19, MP-20, MP-21, MP-22, MP-23 | MP-36, MP-37 |
| **EXP** | MP-11, MP-13, MP-16, MP-17, MP-44, MP-56, MP-59, MP-62 | MP-12, MP-23 |
| **PRV** | MP-24, MP-25, MP-27, MP-28, MP-29, MP-30 | MP-26, MP-56, MP-63 |
| **RTE** | MP-04, MP-05, MP-31, MP-32, MP-33, MP-39 | MP-34, MP-36, MP-37, MP-38 |
| **DEV** | MP-01, MP-46…MP-67 | all programs as coordination consumers |
| **TRU** | MP-41, MP-45, MP-67 | independent challenge across every meta program |

A program may have more than one owner because the boundary itself is what is being integrated.

---

# 5. What is actually active now

The immediate active convergence set is deliberately much smaller than the complete map.

## NOW — semantic simulator/product-twin convergence

1. **MP-09 — validator / false-READY**
   - fix or pin CMD-06 / corpus U1;
   - establish required-field semantics.

2. **MP-07 — materialize fixture Worlds**
   - W1–W6;
   - one deterministic default source/precedence;
   - structural fixture/live provenance.

3. **MP-10 + MP-16 — multi-revision runner**
   - explicit revisions;
   - late-result suppression;
   - semantic diff/replay.

4. **MP-11 + MP-13 — executable Ω Simulator**
   - pinned synthetic World;
   - interpretation;
   - validated UseCommand;
   - virtual `prompt.send`;
   - simulated evidence;
   - deterministic replay.

5. **MP-15 + MP-12 — VisualSpec + product twin**
   - decide extend-vs-replace;
   - pure projector;
   - semantic handles;
   - floating-box simulation over the same state.

6. **MP-18/19 — minimal Reflection**
   - source-bound graph shape;
   - resolve content digest/source-anchor path for MVP slice.

7. **MP-20/21 — Wiki + Migrator**
   - Migrator audit/extract/graph for the MVP slice;
   - Wiki projected from Reflection + active handles;
   - no authored Wiki database.

These seven threads can proceed largely in parallel once interface contracts are explicit.

## NOW — independent live-reality path

8. **MP-41 — TRU-05 live-proof protocol**
9. **MP-25 — read-only browser transport + Account identity**
10. **MP-31/32 — consent + attempt/evidence envelope**
11. **MP-28 — real prompt.send only after the above**

The live path must not block the simulator/product twin.

The simulator must not be reported as live provider proof.

---

# 6. First major integration checkpoint

The first major internal product-development checkpoint is **not** “all subsystems finished.”

It is this replayable simulated journey:

```
blank synthetic Ω
→ "add my Claude account"
→ register Claude Work fixture
→ register Claude Personal fixture
→ optional Model fixture
→ "Ask Claude: explain this error"
→ truthful Account ambiguity
→ user selects Work by text or click
→ same semantic command digest
→ contextual Wiki explains the choice
→ command becomes READY only when valid
→ virtual execution envelope
→ SIMULATED prompt.send
→ simulated evidence receipt
→ deterministic replay / time travel
```

This checkpoint simultaneously exercises:

- MP-06 Semantic Data Engine;
- MP-07 World;
- MP-08/09 language + command;
- MP-10 revisions;
- MP-11 simulator;
- MP-12 sandbox;
- MP-13 virtual executable;
- MP-14/15 visual semantics;
- MP-16 experiments;
- MP-18/19 Reflection;
- MP-20 Wiki;
- MP-21 Migrator;
- MP-31/32 consequence/execution/evidence semantics in simulated form;
- MP-41 Truth.

That is why the simulator is a parallel-development multiplier rather than merely a UI prototype.

---

# 7. Explicitly important but not current release blockers

Do **not** let these disappear, but do not let them delay the simulator/live-`prompt.send` convergence:

- MP-33 Durable Work / background agency;
- MP-35 full memory/context system;
- MP-37 Forge;
- MP-38 generalized self-evolution;
- MP-40 Canvas/spatial environment;
- MP-53 Development Reality Layer;
- MP-54 Context Bundles;
- MP-65 custom development cockpit;
- MP-66 Elephant Context Network;
- broad OS taxonomy adoption;
- generalized provider healing;
- third provider unless second-provider evidence says it matters.

These remain tracked rather than silently dropped.

---

# 8. Promotion / creation rule

A fresh agent may propose a new meta program only when:

1. the problem is not already covered above;
2. it is persistent enough that hiding it as a task would lose important context;
3. its relation to the first release or long-horizon product is stated;
4. an owning lane or explicit unowned state is named;
5. it has a proof/falsifier or a clear experiment;
6. it does not merely rename one of the 31 acceleration hypotheses.

A meta program can be merged, split, retired or superseded.

Do not create a new permanent agent department merely because a new meta program appears.

---

# 9. Source coverage

This tracker was reconstructed from the full current corpus under:

- `seed-docs/`;
- `.project/`;
- `.project/roadmap/`;
- `.project/agentic-launch/`;
- `docs/architecture/ELEPHANT-CONTEXT-NETWORK-PLAN.md`;
- current first-wave handoffs and candidate Lock artifacts.

Key specialized source programs include:

- `FIRST-PRODUCT-RELEASE-DESIGN.md`;
- `SEMANTIC-DATA-ENGINE.md`;
- `SEMANTIC-RUNTIME-LAB.md`;
- `MVP-VISUALIZATION-SANDBOX.md`;
- `AUTOMATED-SEMANTIC-EXPERIMENTS.md`;
- `COMMAND-VISUAL-LANGUAGE-DESIGN.md`;
- `SELF-DESCRIBING-RUNTIME-WIKI.md`;
- `SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`;
- `PROVIDER-LAB-STRATEGY.md`;
- `HARVEST-FIRST-ENGINEERING.md`;
- `DEVELOPMENT-ACCELERATION-HYPOTHESES.md`;
- `ELEPHANT-CONTEXT-NETWORK.md`;
- `WORKSTREAM-LANDSCAPE.md`;
- `RESEARCH-FRONTIER.md`;
- `PROOF-AND-MATURITY.md`.

If this tracker and a narrower execution file disagree about **what exists as a program**, update this tracker.

If they disagree about **what is currently claimed/running**, `.project/agentic-launch/STATUS.md` is authoritative for launch runtime state.

If they disagree about **product intent/invariants**, the seed documents remain authoritative.

---

# 10. Meta rule

> **Track the whole destination; execute only the next evidence-bearing slice.**

> **The map preserves possibilities; it does not prescribe the path.**

Except for explicit invariants and Lab/proof boundaries, architecture, work decomposition, sequencing, team topology, tools, models and orchestration remain falsifiable hypotheses.

The tracker exists so VOMEGA does not lose major programs merely because current execution deliberately narrows the active work.
