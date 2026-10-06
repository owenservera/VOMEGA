# Project Commons and workstream rooms

Current objective and proof: SITREP.md and evidence/bootstrap.json. **Canonical program context: `.project/META-TRACKER.md` (67 major programs + 31 accelerator hypotheses).** This file is
the small coordination register. Heads are accountable for handoffs, not permanent
authority. A fresh executor claims an open row and updates owner/status/evidence
before editing. A completed session agent is not an active background worker.

How to read this file: the table is the live register. Every dated section below
it is an append-only handoff record, true when written. Later sections supersede
earlier ones; nothing below the table is a current instruction. Current launch
state is `agentic-launch/STATUS.md`. The four rooms (Coordination, Research,
Product/DevOps, Truth) are bootstrap-era routing vocabulary, not the program map,
not departments, and not standing ownership. Current work may route directly by
meta program, temporary workstream, task, or another evidence-driven grouping.

| Work | Owner / accountable room | Status | Dependency / verification / handoff |
| --- | --- | --- | --- |
| D1 executable semantic twin | unclaimed; next executor derives routing from current need | **selected / paused; incomplete** | prior Work/Codex claim stopped before substantive implementation; branch consolidated into `main`; resume from `.project/deliverables/D1-START-HERE.md`; D1-001..089 plus folded-in Reflection/Migrator tasks/gates |
| Ω Proof Ratchet + D1 executable spec | Claude (Opus 5.5) chat session seeded it; integration/hardening by ZCode on `work/d1-ratchet-integration` / Coordination + Truth | hardened + independently reviewed 2026-10-06; **recommendation: ADOPT WITH REMAINING LIMITATIONS**; not yet merged to `main` | `.project/ratchet/DESIGN.md`, `.project/ratchet/REVIEW-2026-10-06.md`, directive `.project/RATCHET-ROUND1-INTEGRATION-DIRECTIVE.md`; 80 D1 gates, probe truth 15/80 green (12 tasks PROVEN incl. artifact-only D1-001, 0 DONE); engine tests 24/0; C1 pre-promotion anchoring added + tested; 10 engine defects fixed (D1–D10 in the review doc); `omega:quick` 62/0/1622 and `vivim-nlcl` 49/0 unchanged; `check --strict` clean; Round1 harvested as `.project/evidence/round1-cloud-habitat.json` (tree verified content-identical to main); next: owner decides merge, then `bun run ratchet next` |
| Seed/product selection | release_gym / Research | complete | all 22 seed docs read; RELEASE-GYM.md |
| Baseline/environment audit | baseline_audit + environment_census / Research | complete | REALITY.md, ENVIRONMENT.md; model execution unverified |
| Install/scripts/continuity truth | Codex bootstrap / Product + Coordination | complete | locked install, launcher append/read/verify/status and quick proof succeed |
| Local selected-vault slice | local_continuity / Product | complete; handed off | host recipe, local composition, CLI and tests; fresh relative-path proof passes |
| Independent code review | review_bootstrap / Truth | approved | final diff, timeout reaping, relative Windows paths and evidence boundaries |
| Independent TS review | review_typescript / Truth | limited; handed off | full review stopped on missing lint tooling; timeout/types findings corrected; no full typecheck claim |
| Browser/account transport experiment | PRV-L1 (ZCode worker) / Research | reconnaissance done 2026-10-05; live part unclaimed | `omega-baseline/experimental/provider-lab/LOCK-E-ASSAY.md`: document-and-path inventory, three transport families compared, no attach, no observation. Live metadata read is blocked on a live-proof protocol (roadmap TRU-05) and a consent boundary; Account stays unknown |
| Elephant Context Network architecture plan | Claude Code architecture session / Research | plan drafted 2026-10-05; hypothesis not activated | docs/architecture/ELEPHANT-CONTEXT-NETWORK-PLAN.md; doc only, no code, no lane reserved or probed; next: Coordination decides the Phase 0 gate, Truth reviews the plan |
| First-release roadmap pack incorporation | Claude Code incorporation session / Coordination | landed and committed 2026-10-05; task rows never adopted, and adoption is optional (see `roadmap/README.md`) | roadmap/ (16 files) and NLCL release-use corpus test+fixture match the owner's patch byte-for-byte; `bun test plugins/vivim-nlcl` 49/0 and `omega:quick` 62/0 on Linux Bun 1.4.2; details in ../INCORPORATION-NOTES.md; next: claim OPS-01 to adopt task rows, Truth reviews the corpus test, re-verify on the Windows launcher |
| Meta-coherence pass | Claude Code session / Coordination + Truth | complete 2026-10-06 | documentation and project-control corpus only; no product code. Report: `META-REVIEW-2026-10-06.md`. Re-ran `omega:quick` 62/0 and `bun test plugins/vivim-nlcl` 49/0 on Windows Bun 1.4.2 |
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
### Launch runtime-resource correction — 2026-10-05

Supersedes the earlier launch shorthand `five ZCode lanes → SDW/LNC/VFX/SKW/EXP` as a capacity assumption.

Owner reports ZCode now uses OpenRouter Auto (`openrouter/auto`). The five previously configured Space Bunny accounts remain historical/configuration evidence, not guaranteed current worker slots. DEV must discover actual safe concurrency and effective routed models at runtime. Logical task slots A–E remain useful, but they are not provider-account identities.

`STATUS.md` is the only mutable launch-state surface; historical Commons entries are not current runtime inventory.
## DEV-L1 launch preflight — 2026-10-05

Coordination request: owner directed remote sync + DEV-L1 preflight + capacity-driven first-wave dispatch. Owner is the launch authority; DEV is the temporary executor, not permanent master.

Owner / accountable room: DEV / Coordination (ZCode session `sess_673eb8fa-9703-4e47-9e12-ca871b3dab57`).

Source HEAD: local fast-forwarded `88165de..dffbbe9` (`dffbbe91cc7d3458bcefd8db86de9df5e6bb13fe`); clean tree; single worktree. Note: remote has `refs/heads/main` only — there is no `master` ref.

Preflight result (read-only; no provider/model/auth change):

- ZCode current route confirmed `openrouter/openrouter/auto` (ListModels `[current]`; cli `model_usage` provider=openrouter, model=openrouter/auto, variant=enabled, mode=yolo).
- Concrete resolved underlying model is **not exposed** by the harness -> recorded as router-selected/unknown, per MODEL-ROUTING policy.
- **Measured safe concurrency >=6** concurrent independent ZCode workers on the route (probe rounds of 4 then 6; all completed; all recorded on openrouter/auto). Ceiling not established; no throttle at 6. This supersedes the historical five-lane assumption.
- Reachable harnesses: Codex `0.160.0`; Claude Code `2.1.289`; Grok Build `1.0.46` (binary runs, not configured); Bun 1.4.2; Node v24.11.1.
- Historical Space Bunny lanes remain selectable configuration, not current scheduling topology.

Evidence: `.local/dev-l1-preflight-2026-10-05.json` (gitignored). Sanitized summary committed with the STATUS.md launch-state update.

Dispatch: capacity-driven first wave on measured >=6 capability. See "DEV-L1 first-wave dispatch" below for roster and per-task routed-model record. TRU-L1 queued for the first freed slot or a separate harness rather than exceeding measured capacity.

Truth: preflight proves reachability and measured concurrency only. It does not claim any dispatched worker succeeded, that the five Space Bunny accounts are live, or that openrouter/auto is a fixed model. Fixture/simulated results must not be reported as live provider evidence.

### DEV-L1 first-wave dispatch — 2026-10-05

Dispatched 6 concurrent ZCode workers on the measured >=6 capacity (route `openrouter/auto`; concrete underlying model not exposed -> router-selected/unknown for every task). Logical task slots, not provider accounts.

| Task | Workstream | Handoff artifact | First deliverable | Routed model (harness-observed) |
| --- | --- | --- | --- | --- |
| SDW-L1 | Semantic Data & World | handoffs/SDW-L1.md | Lock A | ZCode / openrouter/auto (unknown resolved) |
| LNC-L1 | Language & Command Compiler | handoffs/LNC-L1.md | Lock B | ZCode / openrouter/auto (unknown resolved) |
| VFX-L1 | Visual Feedback & Sandbox | handoffs/VFX-L1.md | Lock C | ZCode / openrouter/auto (unknown resolved) |
| SKW-L1 | Self-Knowledge & Wiki | handoffs/SKW-L1.md | Lock D (read-only) | ZCode / openrouter/auto (unknown resolved) |
| EXP-L1 | Semantic Lab & Experiments | handoffs/EXP-L1.md | scenario runner + metrics | ZCode / openrouter/auto (unknown resolved) |
| PRV-L1 | Provider Reality Lab | handoffs/PRV-L1.md | Lock E (read-only assay) | ZCode / openrouter/auto (unknown resolved) |

Each worker: read-only infra, no provider/auth change, no git writes, disjoint write sets (new `omega-baseline/experimental/<ws>/` dirs + own handoff file; LNC additionally within vivim-nlcl/nlcl-pure source). TRU-L1 independent review is queued for the first freed slot or a separate harness (Codex 0.160.0 / Claude Code 2.1.289 available) rather than exceeding measured capacity.

Merge queue: DEV integrates worker handoffs and new-file artifacts; no worker commits. Integration and independent review follow fan-in on Locks A-D + EXP baseline.

Truth: dispatch proves only that 6 workers started concurrently on the route. It does not claim any worker's output is correct, merged, or live-provider-valid.

### DEV-L1 first-wave results + fan-in — 2026-10-05

All six bounded first-wave workers completed (28-49s each) and produced a candidate artifact plus handoff each; independent TRU-L1 review followed. All ran on ZCode route `openrouter/auto` (concrete resolved model not exposed). No product code, config or git state was touched by any worker; all artifacts are new files under `omega-baseline/experimental/` and `.project/agentic-launch/handoffs/`.

Artifacts:
- SDW-L1 -> LOCK-A-CANDIDATE.md (Provider/Account/Model/Capability/Realization records, world/0 fixture schema, 6 MVP Worlds, F1-F5 falsifiers)
- LNC-L1 -> LOCK-B-CANDIDATE.md (UseCommand v0, validation outcomes, revision/session contract, 6 corpus cases)
- VFX-L1 -> LOCK-C-CANDIDATE.md (VisualSpec vNext candidate, Handle model, 3 variants, no-parse rules)
- SKW-L1 -> LOCK-D-CANDIDATE.md (24-manifest inventory, Reflection node/edge, parity findings; source read-only)
- EXP-L1 -> EXP-BASELINE.md (scenario-runner shape, diff format, metric definitions, metamorphic candidates)
- PRV-L1 -> LOCK-E-ASSAY.md (transport inventory, Harvest-First A/B/C comparison, account hypothesis, falsifiers; recon only)

Independent TRU-L1 verdict (handoffs/TRU-L1.md): all six artifacts are SAFE AS CANDIDATES; **none is safe to freeze.** Load-bearing findings:
- Lock A's own falsifiers (F2/F4) run against the interpretation validator, which has a verified false-READY defect (corpus `U1`, CMD-06). Fix/pin the validator before Lock A falsifier evidence is valid.
- `prompt.send` has 0 occurrences in all 24 plugin manifests and in plugin src — it is design/corpus expectation only, not a registered capability (Lock D's CANDIDATE_SEMANTIC label is correct).
- `contentHash` is empty in all 24 manifests -> source-anchor binding unmet; blocks Lock D source-anchor/Phase-B.
- Late-revision-overwrite prevention (Lock C rule 6) and `source:"fixture"` enforcement are asserted, not evidenced (single-input corpus, no runtime-sourced world).
- EXP `falseReadyRate`/`wrongTargetRate` are not computable without a required-field/capability spec.
- Account `defaultFor` vs world `defaults` have two default sources with no stated precedence.

Dispatcher note (harness behavior, evidence not guess): unbounded heavy background subagents stalled (no artifacts, calls ceased); bounded workers (<=8 tool calls) on the same route all completed. First-wave tasks must stay explicitly budgeted.

Next bounded steps (need Commons claims; not started): (1) PRODUCT/Truth: fix or pin the CMD-06 validator defect, then rerun Lock A F2/F4; (2) SDW: materialize world/0 fixtures W1-W6 + source-tagged loader; (3) resolve Account.defaultFor vs world.defaults precedence; (4) EXP: add multi-revision corpus + required-field metadata; (5) PRV: no live observation until TRU-05 + consent envelope; (6) decide VisualSpec extend-vs-replace.

Truth: these are design/candidate artifacts and a candidate-level review. No lock is frozen, no product code changed, no live provider evidence exists.


## Complete meta-program tracker — 2026-10-05

Owner correction: the nine agentic-launch workstreams are execution ownership lanes, not the complete program list.

Canonical whole-program map: `.project/META-TRACKER.md`; machine-readable companion: `.project/meta-tracker.json`.

The tracker was reconstructed from the current seed, project truth, release roadmap/workstream charters, agentic-launch files, first-wave handoffs/candidates, and Elephant plan. It currently records 67 major meta programs plus all 31 development-acceleration hypotheses.

Use the meta tracker to answer **what important programs exist**. Use `.project/agentic-launch/STATUS.md` to answer **what is currently claimed/running/completed**. Use `.project/roadmap/` for **first-release task cards/proof obligations**. Seed intent/invariants remain above all three.

No new permanent departments are created by the meta tracker.

## D1 execution claim — 2026-10-06

Owner request: execute D1 autonomously through completion. Coordination: Codex integrates; Product: bounded validator and World workers, integration owner owns session/UI/replay; Truth: independent final review. Source HEAD and origin/main both `26ec6dfc6cbe301b6c48ee04c7a0d35a23c52468`. Existing `/workspace/VOMEGA` has uncommitted work and is left untouched. Auth/provider/model configuration stays read-only. Verification failures route here to Truth + Product with concrete evidence.
