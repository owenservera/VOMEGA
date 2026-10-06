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

## PM roadmap-system claim — 2026-10-06

Owner request: "Setup your team first so you go faster." The ZCode PM team is claimed against `.project/pm/` to implement and maintain the expandable PM roadmap system over the canonical 67-program map (charter: `.project/pm/ZCODE-PM-TEAM.md`; mission: `.project/pm/ZCODE-BOOTSTRAP-PROMPT.md`).

- Owner: ZCode PM team (ZCode session, main worktree, route `openrouter/auto`). Source HEAD `93075cf`; local == `origin/main`; tree clean.
- Scope: PM development machinery only. No D1 task, roadmap task, product code, auth/provider/model config or git history touched. Recon wave is read-only.
- Round: recon (charter Wave A) — instantiate the team, measure current runtime/repo reality, map duplication risks against META-TRACKER / `meta-tracker.json`, roadmap `TASKS.md`, Ratchet `specs/`, and `D1-ATOMIC-TASKS.json`, and have Truth challenge the design before any implementation is frozen.
- Expected handoff: `.project/pm/TEAM-INSTANCE.md` (team instantiation), `.project/pm/recon/WAVE-A.md` (integrated findings + independent challenge), then a short v0 implementation proposal in `.project/pm/recon/V0-PROPOSAL.md`.
- Truth: PM state is a projection; META-TRACKER, source, tests and evidence outrank it. Recon claims are findings, not frozen design.

Route event: new objective → Coordination (this entry); verification gaps → Truth + Product, recorded as they arise. No agent is alive merely because a document names it.

### PM Wave A complete — 2026-10-06

Charter Wave A (understand) ran as four bounded read-only subagents (`PMC-CUR`, `PMC-AUT`, `PMC-DEP`, `PMC-TRU`), all completed 20–33 s, no repo writes except the consolidation. Findings integrated in `.project/pm/recon/WAVE-A.md`; team instance in `.project/pm/TEAM-INSTANCE.md`.

Headline: the register is faithful to canonical (no material drift, 4 minor gaps); first-five gate refs are all defined and arithmetic exact, with 4 real defects (unowned TraceRef↔EntityRef identity mapping; MP-60 P5 E4–E5 without the §7 decomposition review; 9 of 25 phases ungated; diagram omits MP-55 P3→MP21-G3); five MATERIAL duplication risks against existing owners; substrate recommendation is a small TS validator/projector over existing JSON in `omega-baseline/`. Independent Truth challenge: the PM layer is justified **only as a thin generated projection**; risk is a new prose authority with a third status vocabulary.

Disposition: staffing reduced to `PMC-LEAD` + `PMC-TRU` with curator/automation/dependency as on-demand bounded mandates. Wave B direction (not frozen): PM owns no program meaning or execution/proof state; maturity derived; the reference/drift validator is the load-bearing artifact; estimates published only where a decision is pending.

Truth: recon findings, not frozen design. `meta-tracker.json` generation status and the register's claimed seed HEAD `e843241` remain unverified.

### PM Wave B proposal + independent review — 2026-10-06

`PMC-LEAD` wrote the v0 implementation proposal (`.project/pm/recon/V0-PROPOSAL.md`, rev 1). Independent bounded `PMC-TRU` review returned **accept-with-changes** with 10 required changes; rev 2 applies all of them. Material corrections: the seed's stored `sourceHead` was removed (it was the rot instrument the design had proposed to drop); `effort` now preserves grade ranges (`E4–E5`); maturity was split into two derived dimensions (`planResolution` + `evidenceState`) instead of one collapsible enum; `workPackages`/`taskRef` linkage was cut from v0 and the "proves the Ratchet boundary" claim narrowed accordingly; soft/program-level deps were added as `softDeps[]` and carried as a fifth defect.

Next action: claim and implement v0 (`pm:check` + `bun test`), then obtain the `PMC-TRU` implementation review. Nothing is frozen until that review lands. Proposal is evidence, not architecture.

### PM v0 implemented — 2026-10-06

Implemented the reviewed v0 proposal (rev 2). New code under `omega-baseline/experimental/pm/`: `src/schema.ts` (strict zod seed/events schema; program-meaning keys rejected), `src/derive.ts` (derived `planResolution` + `evidenceState`), `src/project.ts` (read-only projector + Markdown/JSON rendering), `src/check.ts` (validator CLI + freshness check), `test/pm.test.ts` (25 tests). Seed at `.project/pm/data/programs.json` for the first five (MP-21/54/55/56/60); events at `.project/pm/data/evidence-events.json`. Generated projection at `.project/pm/generated/PORTFOLIO.md` + `portfolio.json`. Scripts added: `pm`, `pm:check`, `pm:test`.

Verification: `bun run pm:test` 25 pass / 0 fail; `bun run pm` regenerates; `bun run pm:check` ok with 5 warnings (the carried audit gaps: 9 ungated phases across MP-54/55/56/60, and MP-60 P5 needsReview). `bun run ratchet drift` all 6 facts green (STATUS/SITREP mutex preserved). Projection: 67 programs, 5 seeded, 62 REGISTERED, MP-21 PHASED (all five phases gated), 4 SEEDED, 16 gates, all evidence UNPROVEN.

Note: PM owns no program meaning and no execution/proof state; the seed carries the audit's defects as explicit gaps rather than fixing them silently. Independent `PMC-TRU` implementation review still outstanding.

### PM v0 review + dogfood — 2026-10-06

Independent bounded `PMC-TRU` implementation review of commit `56fe9c4`: **accept-with-changes**. It found a real bug — `pm:check` was red on the shipped commit because the committed projection embedded `sourceHead` and committing advances HEAD — plus an overclaiming schema comment, a §5/§2 disagreement, and minor robustness defects. All required changes applied: volatile HEAD neutralized in the freshness comparison (with a test), `pm:check` now prints a live non-stored ratchet reference, schema comment corrected, `validate` made defensive, newline escaping added. Suite now 29 tests.

Dogfood: a separate fresh worker given only `generated/PORTFOLIO.md` answered just 1 of 9 success-criterion questions fully. Adopted the highest-value fix — a **Purpose (why it exists)** column projected from the canonical tracker. The remaining orientation gaps (a "now/active" view, evidence pointers, plan delta, gate metadata, `taskRef` linkage) are recorded as the v0.1 backlog in `.project/pm/recon/REVIEW-V0.md`.

Verified: `pm:test` 29 pass / 0 fail; `pm:check` green post-commit (5 warnings = carried gaps); `omega:quick` 62/0/1622; `ratchet drift` 6/6. Truth: v0 proves reference integrity, strict-schema rejection and a stable projection — it does not prove the ratchet `taskRef` linkage (deferred to v0.1) and does not make any PM state authoritative.

### Orca bootstrap Gate 0 census — 2026-10-06

Claim: ORCA (execution substrate). Ran `.project/orca/BOOTSTRAP.md` Gate 0 only, read-only. Output: `.project/orca/CENSUS-2026-10-06.md`.

**Starting assumption falsified.** Orca was already installed and already executed on this machine today at 05:41–05:53, before the bootstrap began, so no true "pre-Orca" baseline was capturable. Census is a pre-bootstrap-session census with Orca's prior side effects recorded explicitly.

Two blockers for Gate 1, both owner-reserved:

**D1 — version pin.** Bootstrap pins Orca v1.4.220; installed build is **1.4.221** (`FileVersion 1.4.221`), staged by `orca-updater\installer.exe` at 05:18 — an auto-update, not a pinned install. Gate 1's prohibition is explicit, so this needs a decision, not a silent proceed.

**D2 — duplicated Codex credential.** The 05:41 session copied `~/.codex/auth.json` into Orca's appdata **byte-identically** (matching SHA-256), and the credential is additionally embedded as an `authJson` string in `system-default-auth.json` and `shared-runtime-auth-provenance.json` — ≥4 on-disk copies total. This happened as Orca's default onboarding, i.e. *before* Gate 2's Manual posture could exist. SITREP reserves credential changes to Owen.

Checked and found clean: the owner's `~/.codex/config.toml` was **not** substantively rewritten — Orca's copy differs only by rewriting `[hooks.state.'…']` paths to its own home; key/section sets otherwise identical. `HEAD` == `origin/main` (`3ccaf2c`), 0/0, one worktree, no stashes.

Gate 4 re-scoped: the blocker is smaller than recorded. Bundled ZCode CLI 0.16.9 *has* a TUI (`zcode tui`; "with no command opens the full-screen TUI") — only the PATH command is missing, so a controlled `zcode.cmd` shim may suffice with no standalone download and no desktop replacement. Hypothesis, unproved.

Evidence discipline: presence/version/hash only. No credential, token or endpoint value was written to any artifact. Noted that `orca-runtime.json` holds a live runtime `authToken` and `orca-e2ee-keypair.json` exists — both sensitive, never to be committed.

Next action: owner decides D1 and D2. No executor running; Gates 1–10 not started.

## PM owner-correction executed — 2026-10-06

Owner directive [PM-CORRECTION-FIRST-FIVE-ONLY.md](pm/PM-CORRECTION-FIRST-FIVE-ONLY.md) (assessed `b4ed79d`) is definitive: PM manages **exactly five** programs (MP-21/54/55/56/60), holds **no decisioning authority**, and v0.1 feature expansion is frozen. Applied at HEAD `3ccaf2c`:

- **Scope correction (C1):** managed set declared in `.project/pm/scope.json` (owner-owned; expansion only by explicit owner instruction) and enforced by `pm:check` — a program file outside scope, or a scope program with no file, FAILS. The 67-program portfolio view is gone; the other 62 appear only as external references (`EXTERNAL_REF_IS_MANAGED` guard: managed programs connect by gate, not by reference).
- **Dossiers + phases (C2/C3):** five program files authored in parallel by five bounded workers (disjoint write surfaces, ≤10 tool calls each), normalized to schema `vomega-pm-program/1` (dossier: explanation / problem / 4–8 objectives / vision contribution grounded in VISION pillars / boundaries / success conditions / falsifiers / sources; 25 phases, every phase exit-gated — the 9 formerly ungated phases got deliberate gates MP54-G3/G4, MP55-G3/G4, MP56-G3/G5, MP60-G1/G3/G5; MP60-P5 carries the E5 decomposition-review flag).
- **Evidence correction (C5):** no blanket "UNPROVEN 67" — evidence state is derived for the five only; execution/proof state stays with the Ratchet, referenced live at check time and never stored.
- **Views (C6):** `generated/SELECTED-PROGRAMS.md`, `ROADMAP.md` (25 phases), `DEPENDENCIES.md` (gate graph + external references), `ESTIMATES.md`, five `PROGRAMS/MP-XX.md` dossiers, and `portfolio.json` (machine projection), all freshness-checked.
- **Feature freeze (C0):** the v0.1 backlog is parked; no frontier/ranking/task-generation work.

Verification: `pm:test` 20 pass / 0 fail (incl. scope-violation and managed-set tests); `pm:check` ok (1 warning = the legitimate MP60-P5 E5 flag); `omega:quick` 62/0/1622; `ratchet drift` 6/6. Remaining: C7 fresh-worker dogfood (target ≥14/15) and C8 independent review before PM evolution resumes. Note: another session's Orca-research entry follows above; no conflict — PM touched only `.project/pm/**`, `.project/agentic-launch/STATUS.md` and this entry.

### Orca Gates 1–4 executed — 2026-10-06

Owner decisions applied: **D1 amend pin to Orca 1.4.221** (BOOTSTRAP amended); **D2 leave the duplicated Codex credential in place**, record the boundary, mutate no auth.

**Gate 1 PASS.** Desktop runs (pid 14956, 6 Electron processes); `orca status --json` exits 0 with `runtime.state: ready`; CLI and desktop resolve to the *same* runtime (`20d24b7f…`, identical pid). VOMEGA was already registered by the earlier 05:41 session. Its base ref was **unset** (`upstream: null`) — a genuine Gate 1 failure — now set to `origin/main`. `remoteUpdateSupport.automatic: true`, so the pin can drift again on any Orca update.

**Gate 2 PARTIAL — item 1 is a hard precondition, not a formality.** Safe now: `claudeAgentTeamsMode: off`, no managed accounts (System default only), no secrets in repo config, no `.env` in `.worktreeinclude`, all `experimental*` false. But **Agent Permissions → Manual has no CLI or RPC path** (Orca's own installed guides say so), and shipped `agentDefaultArgs` are bypass/auto-approve for every agent — `claude: --dangerously-skip-permissions`, `codex: --dangerously-bypass-approvals-and-sandbox`, `gemini: --yolo`, and more — with `agentCmdOverrides` empty and **no per-call argument forwarding** on `worktree create --agent`. Consequence: *any agent launched through Orca today would run with sandbox and approval checks disabled.* Gates 5–9 blocked until Owen sets Manual in the GUI. `agentStatusHooksEnabled: true` (installed offline into claude/codex/gemini/qwen/antigravity; `droid: error`).

**Gate 3 PASS** — run without any agent, which Gate 2 permits (it gates agent *launch*). Disposable worktree `gate3-probe` branched from `origin/main` (`3f3b3dfe`), clean, own branch; a harmless write landed **only** in the worktree; **external Git visibility works** (`git worktree list` sees it despite Orca's UI-level `externalWorktreeVisibility: hide`); removed cleanly — directory gone, git pruned, no orphan branch, `childWorktreeIds: []`.

**Gate 4 BLOCKED — and this corrects my own earlier claim.** A `zcode.cmd` shim at `~\.local\bin\zcode.cmd` makes bare `zcode` resolve with full user-scope inheritance (343 skill lines, 46 plugins; `doctor --json` clean), but **there is no TUI**: both bare `zcode` and `zcode tui` fail with `Cannot find package '@zcode/tui'`. The Gate 0 census inferred a working TUI from `--help`; that inference was wrong and is retracted in the census. The bundle ships `packages/` (plugins) only — no `node_modules`, no `@zcode/tui`. Headless `zcode -p --mode plan` works. Gate 4 step 1 still needs a genuinely TUI-capable standalone build; that is an acquisition decision. Also blocks Gate 5E/8, since Orca launches TUI agents and its `defaultTuiAgent` is `opencode`.

Rollback position clean: **no agent was ever launched through Orca**, no harness auth/provider config mutated (only the repo base ref set). PM workstream untouched throughout — commits staged by explicit path, never `add -A`/`stash`, to avoid sweeping concurrent PM edits.
