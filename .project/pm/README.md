# VOMEGA Project Management Design

> **ACTIVE OWNER CORRECTION — READ FIRST:** [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md). The PM system currently manages **only MP-21, MP-54, MP-55, MP-56 and MP-60**. It is not a 67-program portfolio decisioning system and has no authority to choose, rank, add, remove or prioritize meta programs.

Status: **DESIGN SEED — NOT YET A PM APPLICATION OR EXECUTION AUTHORITY**  
Created: 2026-10-06  
Source program map: `../META-TRACKER.md` / `../meta-tracker.json`  
Source HEAD when seeded: `e843241436f9983b1a385d48449878ce58e8c2a4`

## Why this folder exists

VOMEGA now has a canonical map of 67 meta programs, a first-release roadmap, D1 atomic tasks, Ratchet proof state, launch/status surfaces and several development-acceleration hypotheses. Those artifacts answer different questions, but there is no single expandable planning layer that can represent the whole program from vision-level intent down to executable work without collapsing all of those distinctions.

This folder designs that missing layer.

The intended future system should let the project move coherently through:

```text
Ω final vision
  ↓
67 Meta Programs
  ↓
program objectives + vision contribution
  ↓
high-level phases
  ↓
cross-program dependency gates
  ↓
work packages / initiatives
  ↓
tasks
  ↓
atomic tasks
  ↓
proof gates / evidence
```

The system must remain expandable: most of the 67 programs should stay high-level until evidence justifies deeper decomposition.

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

- [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md) — full design for the expandable PM/roadmap system.
- [PROGRAM-REGISTER.md](PROGRAM-REGISTER.md) — **superseded as a PM artifact (2026-10-06 owner correction)**: kept as reference-only context. Canonical 67-program meaning lives in `../META-TRACKER.md`; PM manages only the five programs in [scope.json](scope.json).
- [FIRST-FIVE-SEED.md](FIRST-FIVE-SEED.md) — five-phase roadmap, effort grades, LOC bands and dependency gates for MP-21, MP-54, MP-55, MP-56 and MP-60.
- [ZCODE-PM-TEAM.md](ZCODE-PM-TEAM.md) — the agent team/functions that should implement, maintain and evolve the future tracker.
- [ZCODE-BOOTSTRAP-PROMPT.md](ZCODE-BOOTSTRAP-PROMPT.md) — a complete first prompt for the ZCode team.
- [EVOLUTION-RULES.md](EVOLUTION-RULES.md) — rules for expanding from 67 programs to phases, work packages and atomic tasks without creating planning bureaucracy.

## Why the first five were selected

The first five are not the most important product programs. They were selected because they are **development multipliers**: if successful, they should accelerate work across many of the other 62 programs.

They are:

- **MP-21 Reflection Migrator** — turns repository structure into source-bound machine-readable self-knowledge.
- **MP-54 Automatic Context Bundles** — gives a fresh worker the smallest useful task context.
- **MP-55 Failure Capsules** — makes failures portable and reproducible across workers/models.
- **MP-56 Trace → Fixture** — converts observed behavior into durable deterministic test assets.
- **MP-60 Impact Graph / test selection** — connects changes to likely effects and the smallest high-confidence evidence loop.

The dependency conclusion was equally important: these five should not become five independent metadata systems. MP-21 should provide structural identities; MP-54 and MP-60 should consume them. MP-55 and MP-56 can begin independently and later enrich that shared graph/evidence substrate.

## What remains TBD

The other 62 meta programs are deliberately registered but not decomposed into five phases yet.

That is a feature, not missing work.

The PM team should deepen a program only when:
1. it becomes strategically relevant;
2. there is enough evidence to make decomposition useful;
3. dependencies can be stated honestly;
4. effort/LOC estimates would aid a decision;
5. deeper planning will reduce uncertainty or handoff cost rather than manufacture ceremony.

The map preserves possibilities; it does not prescribe the path.
