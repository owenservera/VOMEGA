# ZCode PM Team — Charter and Operating Model

Status: **REVISED 2026-10-06 — UNDER THE OWNER CORRECTION**

This revision supersedes the earlier charter that treated PM as a 67-program
planner, ranker and portfolio engine. That charter is withdrawn.

The definitive instrument is
[`.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md`](PM-CORRECTION-FIRST-FIVE-ONLY.md).
The managed set and authority rules are recorded in
[`.project/pm/scope.json`](scope.json). Where this charter and the correction
ever appear to differ, the correction wins.

---

## 1. Single mission

> **Implement, maintain, and progressively deepen the planning/execution
> representation for the five selected programs (MP-21, MP-54, MP-55, MP-56,
> MP-60).**

This is a **custodial, planning and implementation** mandate.

It is explicitly **not**:

- strategy;
- portfolio governance;
- product management authority;
- roadmap selection authority;
- resource-allocation authority across VOMEGA;
- a replacement for Owen.

The team turns a scope the owner already chose into a plan that is well
understood, well phased, dependency-aware, estimable, maintainable, and
eventually decomposable into executable atomic work. That is the whole job.

---

## 2. The five programs

Scope is fixed at exactly five. The selection is already made, and it was made
because each is expected to be a **development multiplier** across the broader
VOMEGA build — not merely a product dependency.

| ID | Name | Why it is in scope |
|---|---|---|
| **MP-21** | Self-Knowledge Reflection Migrator / auto-Wiki migration tool | Converts the corpus into source-bound structural understanding — the foundation every other accelerator queries. |
| **MP-54** | Automatic Context Bundles | Uses that understanding plus task/Git state to hand a fresh worker exactly the bounded context it needs. |
| **MP-55** | Failure Capsules | Turns failures into reproducible debugging packets so failures cost time once, not repeatedly. |
| **MP-56** | Trace → Fixture | Harvests runtime traces into deterministic replayable fixtures and regression assets. |
| **MP-60** | Runtime dependency / impact graph + test selection | Converts structure and observed runtime/test evidence into impact analysis and affected-test selection. |

The other 62 meta programs stay canonical in `.project/META-TRACKER.md` and may
appear in PM output **only** as external references or dependencies — never as
a dossier, phases, gates, estimates or tasks.

---

## 3. Explicit non-authority

The PM team is never a decisioning team. It must not:

- choose which meta programs matter most;
- rank the 67 programs;
- decide the next five;
- add another meta program to PM scope;
- remove one of the selected five;
- set product, MVP or release priority;
- reinterpret the final VOMEGA vision;
- change canonical program meaning;
- autonomously schedule or activate programs;
- convert a planning observation into project authority.

**Allowed** (implementation mechanics of the PM machinery, and decomposition
depth *inside* an already-selected program):

- JSON vs SQLite for PM data;
- how to render a dependency view;
- how to validate gate references;
- how to structure a Program Dossier;
- how to link to Ratchet without duplicating state.

**Forbidden** (any of these, even if it looks well-evidenced):

- "MP-61 should now enter active scope."
- "MP-54 is more important than MP-21."
- "MP-25 should replace MP-56."
- "The portfolio should prioritize provider work next."
- "These three programs should be deferred."
- "We should change the first-release mission."

The team may surface facts — *MP54-P2 is blocked by MP21-G3*, *MP60-P5 is E4–E5
and needs decomposition*, *this gate regressed*, *this phase lacks a proof
definition*. It may never convert such a fact into the decision above it.

Only Owen, or another explicitly authorized owner-level process, changes the
selected set. Scope expands only by explicit owner instruction recorded in
`scope.json`.

---

## 4. Team functions — checkpoints, not standing agents

These are **checklists and checkpoints**. They are not permanent agents and
there is no standing roster beyond the two below. ZCode may combine or split
them; ZCode runtime capabilities must be inspected, never assumed.

**Standing staffing:**

1. **Integrator** — keeps the PM representation coherent, small, and correctly
   separated from META-TRACKER (canonical identity) and Ratchet (execution and
   proof). Measures PM-system overhead.
2. **Independent Reviewer** — did not write the change under review. Challenges
   rather than restates; samples program mappings, tests gate behaviour, and
   hunts false completion and false precision.

**On-demand bounded mandates** (spawned per task, with an explicit write
surface, then closed):

3. **Dossier curation** — for each of the five: canonical identity projection,
   explanation, problem, 4–8 program-specific objectives, vision contribution,
   boundaries, success conditions, falsifiers, source references, current
   reality. Factual fidelity only; no re-authoring of program meaning.
4. **Dependency-gate modelling** — prefer narrow gates over whole-program
   serialization (`MP54-P2 blocked by MP21-G3`, not "MP-54 depends on MP-21").
   Preserve parallelism; keep external MPs visibly marked as external.
5. **Estimates** — effort grade E0–E5 (engineering complexity, not elapsed
   time) and LOC ranges with stated confidence. Distinguish implementation LOC
   from test/evidence LOC and generated fixture volume. Never grade a worker by
   LOC delivered; never treat LOC as productivity or completion.
6. **Execution descent (Ratchet boundary)** — decide *when* a phase may become
   work packages and tasks; avoid premature atomic decomposition; project task
   and proof state from Ratchet rather than copying editable state.
7. **System maintenance** — validator, schema, generated views, tests,
   migration/versioning, drift detection against META-TRACKER. The validator
   must fail if the managed set ever contains a program not listed in
   `scope.json`.

---

## 5. Operating discipline

**Claim before editing.** Update `.project/agentic-launch/STATUS.md` and add an
entry in `.project/COMMONS.md` before changing anything.

**Bounded parallelism with explicit write surfaces.** Give each parallel worker
an explicit list of files it owns and preserve every other worker's changes.
Independent research and review may run in parallel; editing workers may not
collide.

**Independent review is mandatory** for every code change and every load-bearing
schema change, by someone who did not write it.

**Four state dimensions, never collapsed.** Every view and every claim keeps
these distinct:

1. **Canonical state** — projected from META-TRACKER, never overwritten.
2. **PM plan resolution** — PM-owned planning depth for the five.
3. **Execution state** — Ratchet/task system, external owner of atomic
   execution and proof.
4. **PM evidence coverage** — pointers to real tests/evidence, plus whether PM
   has linked enough of it.

Never reduce these to a single percentage, a single "UNPROVEN 67", or a global
percent complete. Program truth is never inferred from the absence of PM-local
events.

**Keep it small.** No dashboard, generalized scheduler, or portfolio ranking as
a precondition. Build the smallest representation that can evolve safely.
Preserve lineage when a plan changes.

---

## 6. Escalation to the owner

Escalate to Owen for:

- any change to the selected program set (adding, removing, swapping);
- product, MVP or release direction or priority;
- reinterpretation of the final vision or canonical program meaning;
- changes to protected invariants in `seed-docs/INVARIANTS.md` or
  `seed-docs/PROOF-AND-MATURITY.md`;
- destructive or irreversible operations;
- auth / provider / model configuration;
- spend, subscriptions, or paid services;
- material privacy or security tradeoffs.

**Everything else** is decided by evidence plus independent challenge. Absence
of an escalation path is not an escalation.

---

## 7. Falsifier for the PM system itself (MP-67)

MP-67 is the anti-bureaucracy clause that applies to this team before it
applies to anything else:

> **If maintaining the PM system costs more coordination than it removes,
> simplify it or retire it.**

Measure this honestly — onboarding time, duplicate edits avoided, stale-state
incidents, planning overhead, dependency mistakes. If the PM layer cannot answer
the questions in §8 more cheaply than reading the source corpus, it has not
earned its keep. The PM team is not exempt from the rule it applies elsewhere.

---

## 8. Success criterion

Give a fresh agent **only** the PM outputs and directly linked sources. It must
be able to answer, from PM outputs alone:

1. Why were these five selected?
2. What does each program do?
3. Why does each one exist?
4. What are its objectives?
5. How does it contribute to the final Ω vision?
6. What is its phase structure?
7. Which phases can start now?
8. What gates block the others?
9. What can run in parallel?
10. What are the effort/LOC estimates and their confidence?
11. What is the canonical current state?
12. Where does real evidence actually live?
13. How does work descend from roadmap into proof?
14. What is explicitly outside PM authority?
15. How can PM scope expand?

Target: at least 14 of 15 fully answerable. Anything the team cannot make
answerable is either unfinished PM work or an overreach — diagnose which.