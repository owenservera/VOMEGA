# Project Commons and workstream rooms

Current objective and proof: SITREP.md and evidence/bootstrap.json. This file is
the small coordination register. Heads are accountable for handoffs, not permanent
authority. A fresh executor claims an open row and updates owner/status/evidence
before editing. A completed session agent is not an active background worker.

| Work | Owner / accountable room | Status | Dependency / verification / handoff |
| --- | --- | --- | --- |
| Seed/product selection | release_gym / Research | complete | all 22 seed docs read; RELEASE-GYM.md |
| Baseline/environment audit | baseline_audit + environment_census / Research | complete | REALITY.md, ENVIRONMENT.md; model execution unverified |
| Install/scripts/continuity truth | Codex bootstrap / Product + Coordination | complete | locked install, launcher append/read/verify/status and quick proof succeed |
| Local selected-vault slice | local_continuity / Product | complete; handed off | host recipe, local composition, CLI and tests; fresh relative-path proof passes |
| Independent code review | review_bootstrap / Truth | approved | final diff, timeout reaping, relative Windows paths and evidence boundaries |
| Independent TS review | review_typescript / Truth | limited; handed off | full review stopped on missing lint tooling; timeout/types findings corrected; no full typecheck claim |
| Browser/account transport experiment | next session claimant / Research | queued | finish local proof; metadata-only transport discovery, Account unknown preserved |
| Elephant Context Network architecture plan | Claude Code architecture session / Research | plan drafted 2026-10-05; hypothesis not activated | docs/architecture/ELEPHANT-CONTEXT-NETWORK-PLAN.md; doc only, no code, no lane reserved or probed; next: Coordination decides the Phase 0 gate, Truth reviews the plan |
| First-release roadmap pack incorporation | Claude Code incorporation session / Coordination | landed 2026-10-05; not yet adopted or committed | roadmap/ (16 files) and NLCL release-use corpus test+fixture match the owner's patch byte-for-byte; `bun test plugins/vivim-nlcl` 49/0 and `omega:quick` 62/0 on Linux Bun 1.4.2; details in ../INCORPORATION-NOTES.md; next: claim OPS-01 to adopt task rows, Truth reviews the corpus test, re-verify on the Windows launcher |
| Historical broad-suite repair | unclaimed / Product | blocked | missing tooling/examples/fixtures; first concrete blocker watchdog import |
| Remote sync + bunfig triage | remote_sync_triage / Product | complete; pushed | fast-forwarded to f69bcb9; omega-baseline/bunfig.toml isolated-linker pin committed+pushed (b3e7420; ghost.test.ts assumes per-package links); external drop External-temp/*.zip verified fully implemented (all 16 files content-identical to HEAD in loose/nested/patch layers) then deleted, folder kept; post-pull omega:setup clean, omega:quick 62/62, pulled vivim-nlcl corpus test 18/18 |

## Coordination room

Head this session: Codex bootstrap. Request/handoff format: date, task, owner,
status, dependency/blocker, concrete evidence, next action. New objectives route
here; resolve conflicting file ownership before dispatch. No irreversible or
credential/configuration work is authorized by assigning a task.

## Research room

Heads for this cycle: baseline_audit, release_gym, environment_census; their read
passes are complete. Carry forward questions in DECISIONS.md. Route research or
competing architecture hypotheses here; prefer the smallest discriminating
experiment. Next head must claim the queued browser transport task explicitly.

## Product / DevOps room

Head this cycle: Codex bootstrap; local_continuity handed off its completed files.
Root owns package/lock, launcher and project docs. Failures route here
with reproduction, and to Truth when they weaken a claim. No global tool repair.
Use existing Bun rather than replacing broken PATH shims. Repeated missing-source
errors do not justify rebuilding historical machinery without product need.

## Truth / verification room

Heads this cycle: review_bootstrap and review_typescript, independent of the
implementation worker. Challenge claims against evidence; root runs supported
proofs. Quick proof, broad tests, live provider proof and release readiness are
separate statuses. Failed checks route a concrete request to Product, then await
the resulting diff and targeted rerun. Record final findings and their disposition
before commit. No automatic background observer is implied by these rules.

Final cycle handoff: local proof is 62/62 across seven files; independently
reviewed code and actual launcher commands pass. The first quick attempt exposed
missing browser fixture and driver CI wrappers; the final quick scope names only
self-contained tests, while broad failures remain visible. A Windows relative
path failure discovered by launcher smoke was reproduced in a subprocess test
and fixed by resolving the selected vault at CLI entry. No active agent or
scheduled task is left implied after this session; claim the next queued task.

## Visual command feedback design — 2026-10-05

Coordination request: owner asked to begin documenting the real-time natural-language command feedback design, including interactive icons and other visual tooling.

Owner: ChatGPT design session. Status: initial draft committed; documentation only, handed off.

Bounded file ownership: `seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md` (new), a related-design link in `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`, and this Commons entry. No implementation or roadmap task adoption is claimed.

Research / Product handoff: [initial blueprint](../seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md) committed at `a1e3298d1549b2b66a16d8810ac29333ddb05141`; first-release design cross-link added. Owner requirements are distinguished from candidate visual treatments. Next action: WS-SHL / Research compare minimal interaction treatments, reconcile with existing command/session/VisualSpec contracts, and test Account correction, assumptions, scope and accessibility. No implementation task has been adopted by this documentation change.

Truth handoff: checked against current first-release scope and repository instructions; Windows commands and fan-out remain future design probes, not new release prerequisites. Documentation/link verification only; no code, runtime tests, live provider proof or usability validation claimed. No active background worker is implied.

### Customization follow-up — 2026-10-05

Coordination request: owner requires the visual system to adhere to reprogrammability and customization principles; swapping icon libraries must be simple.

Owner: ChatGPT design session. Status: documented and handed off. Bounded ownership: the command visual language design and this Commons entry.

Product / Research handoff: section 13 of the visual language design now records replaceable presentation and interaction mappings, semantic invariants, portable preferences, and a concrete two-library replacement experiment. Commit: `a0dfbd2fb133e362abc98b2f2502acde6935eccc`. Next action: validate the replacement boundary in the first visual prototype; implementation mechanism remains open.

Truth: documentation change only; no icon integration, runtime behavior or customization tests claimed.


## Semantic Runtime Laboratory design — 2026-10-05

Coordination request: owner clarified that the command/visual work needs a standalone, expandable laboratory database for taxonomy, language-to-machine interpretation, deterministic executables, virtual Ω runtime tests, UI feedback experiments, and structured landing of harvested knowledge — without requiring VIVIM itself.

Owner: ChatGPT design session. Status: initial architecture document committed; documentation only.

Bounded file ownership: `seed-docs/SEMANTIC-RUNTIME-LAB.md`, seed index cross-link, visual-language cross-link, and this Commons entry.

Research / Product handoff: the design treats nearly all Lab intelligence as versioned/composable artifacts assembled into pinned Lab Profiles: taxonomy, language, interpretation pipeline, grounding/defaulting, command/capability, World fixtures, deterministic executables, visual/interaction packs, corpus/evaluators, harvest records and governance state. A tiny non-reprogrammable kernel is reserved for identity/lineage, append-only evidence, module loading, isolation, deterministic replay, promotion/rollback and constitutional boundary enforcement.

Truth handoff: this is a development-lab hypothesis, not a claim that the architecture exists or that SQLite/pack formats are selected product architecture. The document explicitly separates Lab adoption from VOMEGA product adoption and preserves evidence ≠ authority, intent ≠ execution, capability ≠ realization, confidence ≠ proof. First proof should be a narrow standalone vertical slice using existing NLCL corpus material, simulated Provider/Account Worlds, deterministic virtual executables, and two replaceable visual/icon treatments.


## Self-describing runtime / source-native Wiki — 2026-10-05

Coordination request: owner merged the Semantic Runtime Lab concept into Ω self-knowledge and required that the realtime Wiki be generated from the system itself rather than maintained as a parallel documentation layer. Plugins should automatically wire their Wiki/self-knowledge contribution when installed.

Owner: ChatGPT design session. Status: architecture design committed; documentation only.

Bounded files: `seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md`, Semantic Runtime Lab cross-link, Contextual Wiki workstream refinement, seed index and this Commons entry.

Architecture handoff: proposed invariant is **if Ω can load it, Ω can explain it**. A narrow core/plugin-boundary Reflection ABI should require every public/routable/configurable contribution to expose machine-readable self-description bound to exact plugin version/content hash. Source-native typed declarations and runtime schemas provide structural truth; linked inline comments may enrich explanations but cannot override permissions, risk, availability, authority or evidence.

Derived layer: a read-only Reflection Graph is assembled automatically from installed contributions plus live registry/evidence. Contextual Wiki pages are not stored documents; they are ephemeral projections of graph nodes/relationships and current semantic state. Realtime interpretation supplies the semantic IDs used to rank the currently relevant pages/links.

Product/DevOps next: Coordination should assign a small cross-boundary task to assay the existing `PluginManifest`, contribution `doc` fields, kernel graph/lens machinery and Forge validators, then design the smallest additive Reflection ABI + completeness gate. Do not build a separate Wiki content service.

Truth: architecture remains a hypothesis. No Reflection ABI, Wiki projection, completeness gate or source-link pipeline is claimed implemented. Reflection must stay descriptive only; self-knowledge ≠ authority, source commentary ≠ evidence, description ≠ availability.

## Semantic interaction consolidation / visualization sandbox roadmap seed — 2026-10-05

Coordination request: owner asked to absorb the best lessons from the new `External-temp` OS-taxonomy candidate and `harvests/old-vivim/symbolic`, deepen the semi-designed UI system, articulate the full data→NCL/NLCL→command→visual→Wiki chain, define automated refinement experiments, and design a utility that migrates existing source into self-knowledge/Reflection compliance.

Owner: ChatGPT design session. Status: design documentation landed; **no runtime/code implementation and no External-temp patch application**.

New seed designs:

- `seed-docs/SEMANTIC-DATA-ENGINE.md`
- `seed-docs/MVP-VISUALIZATION-SANDBOX.md`
- `seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md`
- `seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`

Core refinements were also applied to Invariants, Conceptual Model, Proof & Maturity, First Product Release, Command Visual Language, Semantic Runtime Lab, Self-Describing Runtime Wiki and the CMD/SHL/HLP workstream notes.

Harvest disposition:

- old `lang.ts`, `types.ts`, `interpret.ts`, `recognize.ts`, `grammar.ts` are byte-identical to current baseline copies — provenance/research value, no re-import needed;
- old self-knowledge/symbolic notes reinforce Wiki-as-projection, plugin-native self-description and `?` introspection;
- large SVG chat is research evidence only; historical claims conflicting with current invariants are not adopted;
- OS taxonomy is a high-value Lab/generalization benchmark: harvest capability/realization separation, typed params, fidelity/evidence maturity, coverage corpus and deterministic planning;
- do not canonize risk-in-op identity (`os.r/m/x.*`) or treat all 305 authored Windows realizations as verified.

Architecture handoff: the primary design path is now **source-native semantics → Reflection/Semantic Data Engine → World → InterpretationSession/NCL → UseCommand/validation → VisualSpec → contextual Wiki**. Provider ≠ Account ≠ Model ≠ Session. Consequence ≠ authority. Fidelity ≠ evidence maturity. Semantic identity should not encode current policy.

Local-agent roadmap seeds:

- `VSX-01…VSX-12` — three-provider MVP Visualization Sandbox;
- `EXP-01…EXP-12` plus `EXP-A…EXP-G` — automated semantic/language/visual/Wiki experiments;
- `REF-01…REF-12` — Reflection Migrator and codebase compliance.

Coordination should reconcile these into the live roadmap rather than treating the seed IDs as automatically adopted.

Truth: documentation/design evidence only. No VisualSpec vNext implementation, sandbox renderer, Reflection extractor, Wiki runtime, Model routing implementation, provider automation, Windows realization verification, or experiment engine is claimed complete.

## Local agentic team launch overlay — 2026-10-05

Owner request: read the complete current design/project corpus and derive the development workstreams, dependencies and parallel execution shape as the seed launch for the owner's local agentic teams.

Status: team-launch design landed; no local agent is claimed/running by this documentation change.

Canonical launch entry: `.project/agentic-launch/README.md`.

Launch overlay:
- `STATUS.md` — compact current launch state;
- `WORKSTREAMS.md` — nine ownership boundaries: SDW, LNC, VFX, SKW, EXP, PRV, RTE, DEV, TRU;
- `DEPENDENCY-GRAPH.md` — Locks A–E, critical paths and waves;
- `FIRST-WAVE.md` — initial fan-out over five ZCode lanes + Codex + Claude Code;
- `TEAM-PROMPTS.md` — fresh-session prompts for each head;
- `launch-manifest.json` — machine-readable topology/triggers.

Key execution decision: retain existing CMD/REG/SHL/HLP/PRV/GOV/REL/TRU/OPS roadmap task IDs as release/proof references, but regroup execution ownership around newer low-handoff boundaries. The simulated semantic product twin (SDW/LNC/VFX/SKW/EXP) can advance independently of live Provider execution (PRV/RTE).

Five interface locks coordinate fan-in:
- Lock A: semantic IDs/entity relations (SDW);
- Lock B: UseCommand + validation outcomes (LNC);
- Lock C: VisualSpec vNext (VFX);
- Lock D: minimal Reflection Graph (SKW);
- Lock E: live Provider/Account evidence contract (PRV).

Default first occupancy if healthy: five ZCode lanes → SDW/LNC/VFX/SKW/EXP; Codex → DEV launch + PRV reconnaissance if safe; Claude Code → independent TRU review. RTE takes the first suitable free executor. Allocation is dynamic, not hierarchy.

Git policy: no permanent workstream branches. Use short-lived task worktrees only when concurrent writes require isolation; one integration queue; delete task branch/worktree after accepted merge.

Truth: this launch overlay is operational design, not proof that ZCode lanes are reachable or that any team has begun execution. DEV-L1 must verify lane health read-only before dispatch; do not alter provider/auth/model configuration.
## Grok Build / SuperGrok added to local execution mix — 2026-10-05

Owner is installing Grok Build and requested current SuperGrok research plus integration into the local model/harness routing mix.

Current external research: Grok Build is now a first-class coding harness candidate with headless JSON, ACP, worktrees, subagents, workflows, Agent Dashboard, skills/plugins/hooks/MCP, memory, AGENTS.md support, and Claude Code compatibility. Current xAI flagship is Grok 4.7.

Routing disposition: Grok 4.7 joins GPT-6.1 Sol and Claude Opus 5.5 as a premium/frontier-quality workhorse. Astra/Fable remain scarce adjudicators. Grok Build joins ZCode/Codex/Claude Code as a candidate local harness only after read-only local verification.

Usage caution: paid SuperGrok uses one shared weekly pool across products, including Build. Large Grok workflows can fan out heavily and must start with bounded agent budgets until pool cost is measured.

Updated: `.project/agentic-launch/MODEL-ROUTING.md`, `launch-manifest.json`, and `FIRST-WAVE.md`.

Truth: installation/reachability is not yet claimed by repository evidence. DEV must verify `grok version` and `grok inspect` locally; do not modify Grok auth/global config during preflight.