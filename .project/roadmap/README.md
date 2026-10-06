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

## Adoption (optional; not done)

The pack originally proposed two edits to adopt itself: Commons rows for M0–M3
(task OPS-01) and replacing SITREP's "Next actions" with task IDs. Neither was
made, and neither is required. The later owner correction (task IDs and
milestones are a decomposition, not a mandatory path) means SITREP now points at
evidence and the program map instead of a task list. Adopt task rows only if a
team finds them useful.

## State of this roadmap on 2026-10-06

- The Status column in `TASKS.md` has not been maintained: every task still says
  `open`. That is accurate against each card's full acceptance criteria, but it
  hides partial evidence. `agentic-launch/STATUS.md` records what exists.
- Partial evidence so far: CMD-02 (17-case seed corpus landed; the ≥60-case
  acceptance is not met); OPS-03 (the ZCode route was probed and ≥6 workers
  measured, but the per-lane table the card asks for was not written because the
  five lanes are no longer the topology); PRV-01 (document-and-path inventory
  done; the card's command-output proof is not).
- `.project/evidence/release.json` (TRU-01) and the live-proof protocol (TRU-05)
  do not exist yet. Files that cite them describe intended artifacts.
- ID namespaces collide. Roadmap IDs are `CMD/PRV/REG/GOV/SHL/HLP/REL/TRU/OPS-nn`.
  The seed uses `EXP-01…12`, `EXP-A…G`, `VSX-01…12`, `REF-01…12`. The launch used
  `<LANE>-L1`. The dev-machine reference queue invented `LNC-02`, `SDW-02`,
  `EXP-02`, `EXP-03`, `PRV-02` and others, and its `PRV-02`, `EXP-02` and `EXP-03`
  mean something different from the roadmap and seed items with the same names.
  Cite an ID together with its source file.

## Source file added with this roadmap

`omega-baseline/plugins/vivim-nlcl/test/release-use-corpus.test.ts` and
`.../fixtures/release-use-corpus.json` — the seed determinism corpus (task
CMD-02). 17 release cases + a coverage check; known gaps run as
`test.failing` so a fix forces promotion. Verified: `bun test plugins/vivim-nlcl`
→ 49 pass / 0 fail (31 existing + 18 corpus) on Bun 1.3.14 (Linux); re-verify on
the Windows Bun 1.4.2 launcher before recording a claim.

Windows re-verification, 2026-10-06: `bun test plugins/vivim-nlcl` → 49 pass /
0 fail / 205 assertions on Windows Bun 1.4.2 (9 corpus cases pass, 8 pinned
known gaps run as `test.failing`).
