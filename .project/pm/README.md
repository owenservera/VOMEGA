# VOMEGA Project Management Design

> **ACTIVE OWNER CORRECTION — READ FIRST:** [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md). The PM system currently manages **only MP-21, MP-54, MP-55, MP-56 and MP-60**. It is not a 67-program portfolio decisioning system and has no authority to choose, rank, add, remove or prioritize meta programs.

Status: **OPERATING — FIVE OWNER-SELECTED PROGRAMS ONLY**  
Revised: 2026-10-06 under the owner correction [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) (definitive)  
Scope of record: [scope.json](scope.json) — owner-owned; only Owen changes it  
Source program map (canonical, 67 programs): `../META-TRACKER.md` / `../meta-tracker.json`

## Why this folder exists

VOMEGA has a canonical map of 67 meta programs, a first-release roadmap, D1 atomic tasks, Ratchet proof state and launch/status surfaces. Those artifacts answer different questions. This folder holds the **planning layer for the five programs the owner selected** — MP-21, MP-54, MP-55, MP-56, MP-60 — from dossier and phase plan down to the point where work descends into the Ratchet's executable tasks and proof gates.

PM is a selected-program execution-planning layer. It has **no decisioning authority**: it never chooses, ranks, adds, drops, activates or prioritizes programs, and never sets product, MVP or release priority.

```text
META-TRACKER — 67 canonical programs
        ↓  owner selects five
PM ACTIVE SCOPE — MP-21 · MP-54 · MP-55 · MP-56 · MP-60
        ↓
Program Dossier → Phases → Dependency Gates → (when execution is selected) work packages → tasks → proof
        ↓
Ω Proof Ratchet — atomic execution and proof (external owner)
```

Depth is earned, not uniform: a phase stays a hypothesis until evidence or a pending decision justifies deepening it.

## Authority boundary

This PM design is a coordination layer, not project truth.

```text
Invariants / proof boundaries
        ↓
Observed source + tests + evidence
        ↓
Owner-selected mission
        ↓
META-TRACKER — what programs exist
        ↓
PM roadmap — how programs are decomposed / related
        ↓
Ratchet / task systems — computed execution and proof state
        ↓
Agents / tools / worktrees
```

The PM layer must never redefine a program silently, make an unproven claim true, turn an estimate into a commitment, or become the only place important project state exists.

## Documents

- [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) — **the definitive scope correction**: five programs only, no decisioning authority.
- [PM-BUILD-PLAN-WAVES-SETUP.md](PM-BUILD-PLAN-WAVES-SETUP.md) — **owner-selected Wave 1 → ACCEL-M1 → Wave 2 build-plan setup directive**; records execution shape without giving PM decisioning authority.
- [scope.json](scope.json) — the managed set of record; owner-owned, enforced by `pm:check`.
- [ZCODE-BOOTSTRAP-PROMPT.md](ZCODE-BOOTSTRAP-PROMPT.md) — the entry prompt for a fresh ZCode session on PM work.
- [ZCODE-PM-TEAM.md](ZCODE-PM-TEAM.md) — the custodial team charter and success criterion.
- [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md) — the operating design of the implemented system.
- [EVOLUTION-RULES.md](EVOLUTION-RULES.md) — rules for deepening phases without ceremony.
- [FIRST-FIVE-SEED.md](FIRST-FIVE-SEED.md) — the original five-phase seed the current roadmaps derive from.
- [PROGRAM-REGISTER.md](PROGRAM-REGISTER.md) — **superseded as a PM artifact (2026-10-06 owner correction)**: kept as reference-only context. Canonical 67-program meaning lives in `../META-TRACKER.md`; PM manages only the five programs in [scope.json](scope.json).

## Working with it

From `omega-baseline/`: `bun run pm` regenerates the views, `bun run pm:check` validates scope, schema, references and projection freshness (must exit 0), `bun run pm:test` runs the suite. The generated views live in `generated/` and are never hand-edited.

## Why the first five were selected

The first five are not the most important product programs. They were selected because they are **development multipliers**: if successful, they should accelerate work across many of the other 62 programs.

They are:

- **MP-21 Reflection Migrator** — turns repository structure into source-bound machine-readable self-knowledge.
- **MP-54 Automatic Context Bundles** — gives a fresh worker the smallest useful task context.
- **MP-55 Failure Capsules** — makes failures portable and reproducible across workers/models.
- **MP-56 Trace → Fixture** — converts observed behavior into durable deterministic test assets.
- **MP-60 Impact Graph / test selection** — connects changes to likely effects and the smallest high-confidence evidence loop.

The dependency conclusion was equally important: these five should not become five independent metadata systems. MP-21 should provide structural identities; MP-54 and MP-60 should consume them. MP-55 and MP-56 can begin independently and later enrich that shared graph/evidence substrate.

## Scope

PM manages exactly the five programs in [scope.json](scope.json). The other 62 meta programs remain canonical in META-TRACKER and may appear here only as **external references or dependencies** — never as managed PM records. Adding a program requires an explicit owner instruction; `pm:check` fails if scope and files disagree.

## What remains TBD

The five programs' planning is a **first pass**. Phase objectives, gates, risks and open questions are hypotheses to be refined by source inspection and prototypes; estimates are LOW-confidence priors. Nothing here is authority over product direction, program selection, or the canonical meaning of a program.
