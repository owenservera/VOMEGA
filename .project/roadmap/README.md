# First-Release Build Roadmap — Index

Derived 2026-10-05 from a full read of `seed-docs/` (with
`FIRST-PRODUCT-RELEASE-DESIGN.md` as the target), `.project/` truth, and a
hands-on review of `omega-baseline/` at commit `769544e`.

**Status: operational plan, revisable evidence — not product law.** Seed intent
and invariants constrain this plan; this plan constrains nothing in the seed.
Per `BUILD-FOCUS.md` the Release Gym re-ranks it at every milestone exit
(task OPS-04). The owner-selected product shape is the **current release mission**, not constitutional architecture. The owner may change it explicitly. Sequence, decomposition, mechanism, tools and strategy remain open to evidence.

Task IDs and milestones are a useful current decomposition, not a mandatory path. Agents may propose merges, splits, replacement tasks or reordered milestones when they preserve proof obligations and record the evidence for the change.

## Read in this order

| File | Job |
| --- | --- |
| [ROADMAP.md](ROADMAP.md) | Release thesis, current position, milestones M0–M10 with exit gates, critical path, parallel tracks, open decisions, risks |
| [BASELINE-HARVEST-ASSAY.md](BASELINE-HARVEST-ASSAY.md) | What in `omega-baseline/` serves each release need, test evidence gathered in this review, the NLCL spike, and harvest dispositions |
| [PROOF-TRACEABILITY.md](PROOF-TRACEABILITY.md) | §23 proof matrix, §24 falsifiers and §16 determinism categories → owning tasks, tests and evidence level |
| [TASKS.md](TASKS.md) | Index of all tasks by milestone (ID, title, workstream, deps, size) |
| [workstreams/](workstreams/) | One charter per workstream with full task cards (description, acceptance, proof) |

## Workstreams

| ID | Workstream | Landscape coverage | Accountable room |
| --- | --- | --- | --- |
| [CMD](workstreams/WS-CMD-command-nucleus.md) | Command nucleus & semantic interaction | Semantic Interaction | Product + Research |
| [PRV](workstreams/WS-PRV-provider-account-transport.md) | Provider / Account / browser transport (Provider Lab) | Provider / Account / Browser / Routing | Research → Product |
| [REG](workstreams/WS-REG-registry-capability-state.md) | Registry, capability & availability state | World / Data / Memory | Product |
| [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | Authority, execution envelope & evidence | Authority / Work | Product + Truth |
| [SHL](workstreams/WS-SHL-floating-shell.md) | Floating Windows shell | Surfaces / Human Experience | Product |
| [HLP](workstreams/WS-HLP-contextual-wiki.md) | Contextual Wiki / Help | Human Experience | Product |
| [REL](workstreams/WS-REL-release-lifecycle.md) | Packaging, install & lifecycle | Runtime / Product lifecycle | Product / DevOps |
| [TRU](workstreams/WS-TRU-truth-verification.md) | Truth & verification | Verification / Reality | Truth |
| [OPS](workstreams/WS-OPS-coordination-devops.md) | Coordination & DevOps throughput | Development-system effectiveness | Coordination |

Workstreams are coverage areas, not departments (`WORKSTREAM-LANDSCAPE.md`).
Merge or split them when evidence warrants.

## Using the task system

- Task IDs are `<WS>-<nn>`. A session **claims** a task in `COMMONS.md` before
  editing, records owner/status/evidence, and hands off explicitly (AGENTS.md).
- Status vocabulary: `open → claimed → in-review → done` plus `blocked` and
  `superseded`. A task is `done` only when its acceptance criteria and proof are
  met and an independent reviewer agrees (TRU-06).
- Evidence levels follow `PROOF-AND-MATURITY.md`: fixture, verified-local,
  manual-live, automated-live, differential. A task's proof column says which
  level is required; anything lower is not completion.
- Sizes are relative effort for an agent-assisted executor — S ≈ ≤1 day,
  M ≈ 2–4 days, L ≈ 1–2 weeks — not schedule commitments.
- Workstream files hold the authoritative task cards; `TASKS.md` is the index.
  Change both together.

## Adoption (two small edits to existing truth, intentionally not made here)

1. `COMMONS.md`: add rows for M0–M3 (task OPS-01).
2. `SITREP.md`: replace prose "Next actions" with task IDs PRV-01…PRV-03,
   CMD-01…CMD-03, TRU-01…TRU-02.

## Source file added with this roadmap

`omega-baseline/plugins/vivim-nlcl/test/release-use-corpus.test.ts` and
`.../fixtures/release-use-corpus.json` — the seed determinism corpus (task
CMD-02). 17 release cases + a coverage check; known gaps run as
`test.failing` so a fix forces promotion. Verified: `bun test plugins/vivim-nlcl`
→ 49 pass / 0 fail (31 existing + 18 corpus) on Bun 1.3.14 (Linux); re-verify on
the Windows Bun 1.4.2 launcher before recording a claim.
