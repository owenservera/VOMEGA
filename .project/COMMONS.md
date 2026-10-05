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

Owner: ChatGPT design session. Status: claimed; documentation only.

Bounded file ownership: `seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md` (new), a related-design link in `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`, and this Commons entry. No implementation or roadmap task adoption is claimed.

Research handoff: preserve owner requirements separately from candidate visual treatments; map to WS-SHL and the shared command model. Next action: record the initial blueprint, unresolved design questions and smallest usability experiments.
