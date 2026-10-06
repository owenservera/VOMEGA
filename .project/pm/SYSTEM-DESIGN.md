# PM System Design — Five Selected Programs

Status: **OPERATING DESIGN (revised 2026-10-06 under the owner correction)**.
Authority: [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) is definitive.
This design describes the system that is actually implemented in `omega-baseline/experimental/pm/`.

Superseded: the earlier version of this document described a 67-program portfolio planner with
frontier views, candidate-next-work ranking and portfolio prioritization. Those capabilities are
forbidden. Where this document and the correction disagree, the correction wins.

## 1. What PM is

PM is a **selected-program execution-planning layer**: it makes five already-selected programs
extraordinarily well understood, phased, dependency-aware, estimable and eventually decomposable
into executable work.

PM is **not** a program-selection layer and has **no decisioning authority**. It never chooses,
ranks, adds, drops, activates, prioritizes or redesigns programs, and never decides product, MVP or
release priority. Scope changes only by explicit owner instruction recorded in
[scope.json](scope.json).

The 67-program map remains canonical in `.project/META-TRACKER.md`. PM reads it for identity and
meaning only; the other 62 programs may appear as external references, never as managed records.

## 2. Authority boundary

```text
invariants / proof boundaries          (protected, above PM)
observed source + tests + evidence     (outranks PM)
owner-selected mission + PM scope      (owner; scope.json)
META-TRACKER — which programs exist    (canonical meaning)
PM — phases, gates, dossiers, estimates (the five only)
Ratchet / task engine — execution, proof, claims (external owner)
agents / models / habitats             (resources)
```

## 3. The hierarchy, for one managed program

```text
PROGRAM (MP-21/54/55/56/60)
  └── Program Dossier            explanation · problem · objectives · vision
      │                         contribution · boundaries · success
      │                         conditions · falsifiers · sources
      ├── Phase (P1..P5)         objective · outcome · effort · LOC band+confidence
      │                         blocked-by gates · soft deps · exit gates
      │                         risks · open questions · sources · review flag
      ├── Gate (Gn)              producing phase · statement · evidence
      │                         status · consumers
      └── External dependencies  referenced-only (never managed)
```

Above that roadmap sits one **owner-authored overlay**, deliberately not derived:

```text
DEPENDENCY GRAPH  (factual: what can happen)
        ↓
OWNER BUILD PLAN  (owner-authored: selected ranges, holds, waves, milestones)
        ↓
Ratchet           (execution + proof, once a phase is selected)
```

`build-plan.json` records waves, per-program phase ranges with emphasis, owner-chosen hold points,
resume conditions, and convergence milestones computed as the conjunction of existing gates. PM
validates its references and renders it; PM never authors, ranks, reorders, scores or completes it,
and never renders a "recommended next".

Phases descend to work packages, tasks and atomic tasks **only when execution is selected**, and
that layer belongs to the Ratchet. PM never mints task IDs.

Five phases is the default first planning lens, not constitutional structure: Foundation/identity →
Core capability → Integration/enrichment → Operationalization → Continuous/scaled form. Phases may
split or merge with preserved lineage.

## 4. The four state dimensions (never collapsed)

1. **Canonical state** — read from `.project/meta-tracker.json` (META-TRACKER). Never stored in PM.
2. **PM plan resolution** — derived structurally: `REGISTERED` (absent) → `SEEDED` (a phase is
   incomplete) → `PHASED` (every phase has effort, LOC and an exit gate) → `DECOMPOSED`/`EXECUTABLE`
   (work packages exist and link a resolvable task ref; unreachable in v0 by design).
3. **Execution state** — owned by the Ratchet, referenced live at check time, never stored.
4. **PM evidence coverage** — `NO_LINKED_PROOF` / `PROOF_LINKED` / `REGRESSION_REPORTED`: whether PM
   holds a *linked proof record*. It is deliberately worded so it cannot be read as a claim that the
   project is unproven; reconnaissance (`source-inspected`) never links proof.

## 5. Dossier protocol (required per managed program)

Canonical identity reference (projected) · explanation (2–5 paragraphs) · problem/why it exists ·
4–8 program-specific objectives · final-Ω vision contribution naming the VISION pillars it grounds
in · boundaries/anti-goals · success conditions · falsifiers and open questions · source references.

## 6. Phase protocol

Per phase: id · name · objective · expected outcome · effort grade · LOC band + range + confidence ·
blocked-by gates · soft dependencies · exit gate(s) · risks · open questions · sources ·
needs-review flag. Every phase carries an exit gate; a phase without one is a visible warning.

## 7. Effort and LOC

Effort grades E0–E5 measure engineering complexity, not calendar time. An E5 phase requires a
decomposition review before direct execution (MP-60 P5 is flagged `needsReview`). LOC bands
(XS <150, S 150–500, M 500–1500, L 1500–4000, XL 4000–10000, XXL >10000) are size priors with
confidence. LOC is never a target and never grades a worker.

## 8. Dependency gates

Dependencies reference a specific gate, not a program: `MP54-P2 ← MP21-G3`. Gate fields: id,
producing phase, statement, evidence expected, status, consumers. This preserves parallelism —
consumers may start once their gate is satisfied, without the producer program being complete.
Managed programs connect by gate; non-managed programs appear only as external references.

## 9. Mechanical enforcement

`bun run pm:check` fails (exit non-zero) on: a program file outside scope (`OUT_OF_SCOPE_PROGRAM`);
a scope program with no file (`MISSING_PROGRAM`); a scope id that is not a real canonical program
(`UNKNOWN_MANAGED_PROGRAM`); any schema violation (`PROGRAM_INVALID`, `BANNED_KEY`); dangling gate or
consumer references; a managed program referenced as external (`EXTERNAL_REF_IS_MANAGED`); an
evidence event for a program outside scope; and any generated view that is stale, missing or orphaned
(`PROJECTION_STALE` / `PROJECTION_MISSING` / `PROJECTION_ORPHAN`).

## 10. Generated views (the durable data model)

`SELECTED-PROGRAMS.md` · `ROADMAP.md` (all phases) · `DEPENDENCIES.md` (gate graph + external refs) ·
`ESTIMATES.md` · `PROGRAMS/MP-xx.md` (five dossiers) · `BUILD-PLAN.md` (owner-authored waves) ·
`portfolio.json` (machine projection, including the build-plan projection).
They are generated and freshness-checked; hand-editing one is an error, not a source.

There is no frontier view, no ranking, no "candidate next work" list and no portfolio score — those
would be decisioning features, and decisioning is forbidden.

## 11. Anti-patterns (do not)

- Treat PM as a 67-program planner, ranker, portfolio engine or strategy function.
- Add, remove, rank, activate or prioritize programs; convert an observation into authority.
- Maintain a second editable copy of program meaning, task status, or execution/proof state.
- Project all 67 programs as managed records; materialize external references as programs.
- Pre-create speculative atomic tasks; use LOC as productivity; use "percent complete".
- Hand-edit generated views; store a stale view; let a summary cell outrank source/tests/evidence.

## 12. Evolution

Deepen a phase when planning resolution creates leverage; prefer gates over whole-program
serialization; preserve lineage on every change; hand the executable layer to the Ratchet. See
[EVOLUTION-RULES.md](EVOLUTION-RULES.md). The PM system must earn its keep under MP-67.