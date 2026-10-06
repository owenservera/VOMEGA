# PM Correction Directive — First Five Only, No Decisioning Authority

Status: **OWNER-DIRECTED CORRECTION — DEFINITIVE PM SCOPE**
Date: 2026-10-06
Assessed main: `b4ed79d1c775079cdce4628fe899f61c163fb4ea`

Applies to:
- `.project/pm/`
- `omega-baseline/experimental/pm/`
- generated PM projections
- the ZCode PM team and any future PM automation

This directive supersedes any interpretation of the PM system that treats it as a whole-portfolio decision engine, portfolio-ranking team, 67-program planner, or autonomous strategy function.

---

## 0. The correction in one sentence

> **The PM system exists only to deeply plan, maintain, and progressively decompose the five already selected programs: MP-21, MP-54, MP-55, MP-56, and MP-60. It has no authority to choose, rank, add, drop, activate, prioritize, or redesign the other 62 meta programs.**

The 67-program Meta Tracker remains the complete program map.

The PM system is a **selected-program execution-planning layer**, not a program-selection layer.

---

# 1. Fixed scope

The PM system contains only these five selected programs:

1. **MP-21 — Self-Knowledge Reflection Migrator / auto-Wiki migration tool**
2. **MP-54 — Automatic Context Bundles**
3. **MP-55 — Failure Capsules / reproducible debugging packets**
4. **MP-56 — Trace → Fixture / regression harvesting**
5. **MP-60 — Runtime dependency / impact graph + test selection**

These five were already selected because they are expected to be **development multipliers** across the broader VOMEGA build.

That selection is an owner decision already made.

The PM team is not asked to revisit it.

---

# 2. Explicit non-authority

The PM team is **never** a decisioning team.

It must not:

- choose which meta programs matter most;
- rank the 67 programs;
- decide the next five;
- add another meta program to PM scope;
- remove one of the selected five;
- decide product priorities;
- decide MVP scope;
- reinterpret the final VOMEGA vision;
- change canonical program meaning;
- select release scope;
- change owner decisions;
- assign permanent organizational ownership;
- decide model/provider/tool strategy beyond PM implementation mechanics;
- convert a planning observation into project authority;
- use scores to autonomously schedule or prioritize the broader program.

The PM team may make **implementation decisions about the PM machinery itself** where needed, but never strategic program-selection decisions.

Examples of allowed decisions:
- JSON vs SQLite for PM data;
- how to render a dependency view;
- how to validate gate references;
- how to structure a Program Dossier;
- how to link to Ratchet without duplicating state.

Examples of forbidden decisions:
- "MP-61 should now enter active scope";
- "MP-54 is more important than MP-21";
- "MP-25 should replace MP-56";
- "the portfolio should prioritize provider work next";
- "these three programs should be deferred";
- "we should change the first-release mission."

Only Owen, or another explicitly authorized owner-level process, can change the selected PM program set.

---

# 3. Relationship to the 67-program Meta Tracker

`.project/META-TRACKER.md` remains the canonical complete program map.

The PM system may read it for:

- canonical MP identity;
- canonical name;
- canonical short purpose;
- current state;
- current priority;
- notes;
- dependency context;
- understanding how the selected five fit into VOMEGA.

But the PM system must **not project all 67 into its own managed portfolio**.

The other 62 programs remain outside PM scope.

They may be referenced only as external dependencies/context.

Example:

`MP54-P5 depends on evidence discipline from MP-67`

is allowed as a cross-reference.

Creating an MP-67 PM roadmap, dossier, phases, scores, ranking, or task structure is not allowed unless Owen explicitly adds MP-67 to PM scope.

Correct model:

```text
META-TRACKER
  67-program universe
        │
        │ owner selects
        ▼
PM ACTIVE SCOPE
  MP-21
  MP-54
  MP-55
  MP-56
  MP-60
        │
        ▼
deep roadmap / dependencies / estimates / tasks / proof
```

The PM system is a **zoomed-in planning instrument for explicitly selected programs**.

---

# 4. Why these five are in PM scope

These five were chosen because they can improve the development lifecycle across many other VOMEGA efforts.

They are not merely product dependencies.

They form a development-acceleration system:

```text
MP-21 Reflection Migrator
  source-bound structural understanding
         │
         ├───────────────→ MP-54 Context Bundles
         │
         └───────────────→ MP-60 Impact Graph / Test Selection

MP-55 Failure Capsules
         │
         ▼
MP-56 Trace → Fixture
         │
         └───────────────→ durable runtime/test knowledge
                                  │
                                  ▼
                                MP-60

Ratchet / execution system
  consumes bounded context, tasks and proof gates
```

The PM team's job is to **fully flesh out this selected five-program system**.

---

# 5. What "fully flesh out" means

For each of the five selected programs, the PM team must build and maintain a complete Program Dossier plus an expandable roadmap.

Every selected program must contain:

1. canonical identity reference;
2. clear explanation;
3. problem / why it exists;
4. program-specific objectives;
5. final Ω vision contribution;
6. boundaries / anti-goals;
7. success conditions;
8. falsifiers / open questions;
9. relevant source references;
10. major dependencies;
11. five high-level phases;
12. per-phase objectives;
13. per-phase effort grade;
14. per-phase LOC estimate range;
15. estimate confidence;
16. entry dependencies;
17. exit gates;
18. cross-program unlocks;
19. known gaps;
20. eventual work-package/task decomposition;
21. eventual atomic-task/proof linkage when execution is selected.

The PM system must support increasing detail over time.

---

# 6. Required hierarchy for each selected program

Each selected MP should evolve through this structure:

```text
SELECTED META PROGRAM
      │
      ▼
PROGRAM DOSSIER
      │
      ├── explanation
      ├── problem
      ├── objectives
      ├── vision contribution
      ├── boundaries
      ├── success conditions
      ├── falsifiers
      ├── sources
      └── current reality
      │
      ▼
HIGH-LEVEL PHASES
      │
      ├── outcome
      ├── effort grade
      ├── LOC estimate
      ├── confidence
      ├── dependency gates
      └── exit gates
      │
      ▼
WORK PACKAGES
      │
      ▼
TASKS
      │
      ▼
ATOMIC TASKS
      │
      ▼
EXECUTABLE PROOF / RATCHET
```

The team should not jump to atomic tasks before the higher-level program structure is coherent.

---

# 7. Program Dossier protocol

Each of the five must have the following.

## A. Canonical identity

Projected from `.project/meta-tracker.json`:

- ID;
- name;
- short purpose;
- current canonical state;
- current canonical priority;
- notes;
- owner/routing hints.

PM does not override these.

## B. Explanation

A plain-language explanation of what the program is.

Target:
- 2–5 short paragraphs;
- specific enough to distinguish the program from adjacent concepts;
- useful to a fresh worker;
- no generic filler.

## C. Problem / why it exists

State the persistent problem the program solves.

The explanation must answer:

> What continues to cost us time, truth, or capability if this program does not exist?

## D. Objectives

Program-specific outcomes.

Target:
- 4–8 objectives;
- concrete and falsifiable where possible;
- no generic "improve X" wording.

## E. Final Ω vision contribution

For each selected MP, explain in words how it advances the durable VIVIM-Ω destination.

Ground this in:
- `seed-docs/VISION.md`;
- `seed-docs/PRODUCT-ANCHOR.md`;
- relevant design documents.

Use the durable vision pillars:
- human semantic execution;
- personal semantic world;
- governed action;
- durable Work/proof/continuity;
- governed self-extension/evolution;
- replaceable intelligence/realizations;
- sovereignty;
- surfaces as projections;
- composable extensibility;
- capability multipliers.

The prose must be program-specific.

## F. Boundaries / anti-goals

State what the program must not become.

## G. Success conditions

Program-level observable outcomes.

## H. Falsifiers / open questions

Evidence that could redirect, reduce, split, merge, or retire part of the current design.

## I. Source references

Every major claim should point to relevant source/design/evidence paths.

---

# 8. Five-phase protocol

Each of the five selected programs should have an initial five-phase roadmap.

Five phases are a planning frame, not permanent architecture.

A preferred pattern:

1. **Foundation / identity**
2. **Core capability**
3. **Integration / enrichment**
4. **Operationalization**
5. **Continuous / scaled form**

Each phase must include:

- phase ID;
- name;
- objective;
- expected outcome;
- effort grade;
- estimated implementation LOC;
- estimated test/evidence LOC where useful;
- estimate confidence;
- blocked-by gates;
- soft dependencies;
- exit gate(s);
- downstream consumers/unlocks;
- known risks;
- open questions;
- source references.

Phases may later split or merge with lineage.

---

# 9. Effort grading

Use:

- E0 — trivial
- E1 — small
- E2 — moderate
- E3 — substantial
- E4 — large
- E5 — program-scale

Effort measures engineering complexity/coupling, not elapsed time.

If a phase is E5, review decomposition before direct execution.

---

# 10. LOC estimation

LOC is a planning prior, not a productivity target.

Use ranges and confidence.

Suggested bands:

- XS: <150
- S: 150–500
- M: 500–1,500
- L: 1,500–4,000
- XL: 4,000–10,000
- XXL: >10,000

For each phase, where useful distinguish:

- implementation LOC;
- test/evidence LOC;
- config/data/generated fixture volume.

Generated fixture/data volume should not inflate implementation estimates.

Never grade workers by LOC delivered.

---

# 11. Dependency gate protocol

Prefer narrow gates over whole-program serialization.

Bad:

> MP-54 depends on MP-21.

Correct:

> MP54-P2 is blocked by MP21-G3: stable queryable Reflection identities exist.

Required gate fields:

- gate ID;
- producing program;
- producing phase;
- statement;
- evidence/proof needed;
- status;
- consumer phases;
- regression/supersession history.

This preserves parallelism.

---

# 12. Current first-five dependency shape

The PM team should preserve and refine the following current dependency logic.

## MP-21

Can begin immediately.

Major unlock:

**MP21-G3 — stable queryable Reflection identities / graph**

Consumers:
- MP54-P2;
- MP55-P3;
- MP60-P2.

## MP-55

P1/P2 can proceed independently.

P3 enrichment depends on:
- MP21-G3.

Later automatic minimization benefits from:
- MP56 normalization primitives.

## MP-56

P1/P2/synthetic P3 can proceed independently.

Live trace harvesting requires actual live trace sources.

Major unlock:

**MP56-G4 — trace → fixture → deterministic replay**

This materially strengthens:
- MP60-P3;
- later MP55 automation;
- regression harvesting.

## MP-54

P1 can proceed immediately using Ratchet/Git/task state.

P2 depends on:
- MP21-G3.

P3 benefits from:
- MP55 reproducible capsules.

P4 benefits from:
- MP60 runtime/impact information.

## MP-60

P1 query design can begin immediately.

P2 depends on:
- MP21-G3.

P3 strongly benefits from:
- MP56-G4.

P4 affected-test selection requires:
- usable structural graph;
- sufficient test/coverage evidence.

---

# 13. Current first-five phase seed

The existing first-five phase design remains the starting point.

## MP-21 — Reflection Migrator

### P1 — Source inventory + identity
Effort: E2
LOC: 600–1,100
Gate: deterministic stable source identities

### P2 — Structural extraction
Effort: E4
LOC: 1,800–3,500
Gate: same HEAD produces same extracted structural fact set

### P3 — Reflection Graph + query API
Effort: E3
LOC: 900–1,800
Gate: stable external entity resolution and relation query

### P4 — Gap + migration proposals
Effort: E3
LOC: 800–1,700
Gate: extracted fact and suggested meaning remain mechanically distinct

### P5 — Continuous compliance
Effort: E3
LOC: 700–1,500
Gate: structural drift/completeness check works without becoming source authority

## MP-55 — Failure Capsules

### P1 — Failure envelope
Effort: E1–E2
LOC: 300–650

### P2 — Reproducible capsule
Effort: E2
LOC: 600–1,200

### P3 — Structural enrichment
Effort: E2
LOC: 350–750
Hard dependency: MP21-G3

### P4 — Cross-agent diagnostic packet
Effort: E2
LOC: 450–900

### P5 — Automatic capture/minimization
Effort: E3
LOC: 800–1,600

## MP-56 — Trace → Fixture

### P1 — Trace/event contract
Effort: E1–E2
LOC: 250–550

### P2 — Normalize + privacy reduce
Effort: E3
LOC: 700–1,500

### P3 — Fixture generation
Effort: E3
LOC: 700–1,500

### P4 — Replay + regression
Effort: E3
LOC: 800–1,700

### P5 — Continuous harvesting
Effort: E3–E4
LOC: 900–2,000

## MP-54 — Context Bundles

### P1 — Thin task/Git bundle
Effort: E1–E2
LOC: 300–700

### P2 — Source-aware bundle
Effort: E2–E3
LOC: 550–1,100
Hard dependency: MP21-G3

### P3 — Evidence/failure enrichment
Effort: E2
LOC: 450–950

### P4 — Adaptive context selection
Effort: E3
LOC: 800–1,700

### P5 — Measured optimization
Effort: E2
LOC: 450–1,000

## MP-60 — Impact Graph / Test Selection

### P1 — Impact query model
Effort: E1
LOC: 200–450

### P2 — Static structural impact graph
Effort: E3–E4
LOC: 1,200–2,800
Hard dependency: MP21-G3

### P3 — Runtime/test-observed edges
Effort: E4
LOC: 1,200–2,800
Strong dependency: MP56-G4

### P4 — Affected-test selection
Effort: E3
LOC: 900–1,900

### P5 — Predictive impact/concurrency
Effort: E4–E5
LOC: 1,800–4,500
Requires decomposition review before execution.

These estimates remain hypotheses and should be refined after source inspection/prototyping.

---

# 14. Correct the current PM implementation

The current implementation projects all 67 programs.

That must change.

## Keep

- validator machinery;
- first-five phase/gate schema;
- effort/LOC representation;
- generated projections;
- dependency validation;
- Ratchet separation;
- review/dogfood discipline.

## Change

The PM managed dataset and generated PM portfolio should contain only:

- MP-21;
- MP-54;
- MP-55;
- MP-56;
- MP-60.

The system may still validate those IDs against `.project/meta-tracker.json`.

The other 62 must not appear as managed PM records.

If a generated view wants to show context such as:
> "external dependency MP-67"

that is allowed as a reference only.

It must not materialize MP-67 as a PM-managed program.

---

# 15. Remove portfolio-wide decisioning features

Do not implement or retain PM features whose purpose is to autonomously choose among the 67.

Specifically do not add:

- portfolio ranking across all 67;
- automatic next-program selection;
- priority scoring across all 67;
- "top programs" algorithms;
- autonomous program activation;
- automatic owner/program scope expansion;
- 67-program frontier scheduling;
- global percent complete;
- AI strategy recommender that changes scope.

A PM view may show relationships among the selected five.

It may not decide their strategic order unless Owen explicitly provides an ordering rule.

Even within the five, the system should represent dependencies and current execution readiness, not substitute its own strategy judgment.

---

# 16. Correct the evidence model

Do not show "UNPROVEN 67."

The PM system should only show evidence/state for the selected five.

For each selected five, separate:

1. **canonical program state** — referenced from META-TRACKER;
2. **roadmap resolution** — PM-owned planning depth;
3. **execution state** — Ratchet/task system when linked;
4. **evidence pointers** — direct references to tests/evidence;
5. optional **PM coverage** — whether PM has linked sufficient evidence.

Do not infer program truth from absence of PM-local events.

---

# 17. Source of final-vision mapping

For the selected five, vision mappings must be deeply grounded.

Read at minimum:

- `seed-docs/VISION.md`;
- `seed-docs/PRODUCT-ANCHOR.md`;
- `seed-docs/DEVELOPMENT-ACCELERATION-HYPOTHESES.md`;
- `seed-docs/AUTONOMY.md`;
- `seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md` for MP-21;
- relevant Reflection/Wiki documents for MP-21;
- relevant Ratchet/context/failure/trace/impact documents for MP-54/55/56/60;
- `.project/META-TRACKER.md`.

Each vision contribution must explain how that accelerator makes the final Ω build more achievable or durable.

This is not a generic statement that "DevOps helps."

---

# 18. Team charter correction

The ZCode PM team has exactly one mission:

> **Implement, maintain, and progressively deepen the planning/execution representation for the five selected programs according to this protocol.**

It is a custodial/planning/implementation team.

It is not:
- strategy;
- portfolio governance;
- product management authority;
- roadmap selection authority;
- resource-allocation authority across VOMEGA;
- a replacement for Owen.

The team may surface facts such as:

- "MP54-P2 is blocked by MP21-G3";
- "MP60-P5 is E4–E5 and should be decomposed";
- "the LOC estimate was low compared with observed implementation";
- "a gate regressed";
- "this phase lacks a proof definition."

It may not turn those observations into unauthorized decisions like:

- "therefore MP-56 should be deprioritized";
- "therefore MP-61 should be added";
- "therefore the product roadmap should change."

---

# 19. Expansion protocol

The PM scope may expand only through an explicit owner instruction.

If Owen later says:

> Add MP-25 to PM.

then the PM team may:

1. read MP-25's relevant source corpus;
2. create its full Program Dossier;
3. seed phases/estimates/dependency gates;
4. integrate it with the selected-program dependency graph;
5. evolve its roadmap toward executable work.

Until that explicit instruction exists, the selected set is exactly five.

---

# 20. Immediate correction sequence

## C0 — freeze PM feature expansion

Stop v0.1 feature development.

Do not add dashboard/frontier/task-generation/portfolio-ranking features.

## C1 — scope correction

Change PM managed scope from 67 to exactly five.

Generated PM outputs should no longer list all 67 as managed records.

## C2 — fully author the five Program Dossiers

For each selected MP:

- explanation;
- problem;
- objectives;
- vision contribution;
- boundaries;
- success conditions;
- falsifiers;
- source references;
- current canonical state;
- current dependency context.

## C3 — fully reconcile the five phase plans

For all 25 phases:

- ensure each phase has a clear objective/outcome;
- effort grade;
- LOC estimate;
- confidence;
- dependency gates;
- exit gates;
- consumers/unlocks;
- risks/open questions.

Resolve currently known ungated-phase gaps deliberately.

## C4 — dependency graph

Produce a clean selected-five dependency graph.

External MPs may appear only as referenced context/dependencies.

## C5 — evidence correction

Remove blanket global evidence claims.

Link selected-five canonical state/evidence honestly.

## C6 — generate useful views

Required:

- selected-five overview;
- five detailed Program Dossiers;
- phase roadmap;
- dependency-gate view;
- effort/LOC view;
- eventual task/proof linkage view where available.

## C7 — dogfood

Give a fresh worker only the PM outputs and direct linked sources.

The worker should be able to answer:

1. Why were these five selected?
2. What does each do?
3. Why does each exist?
4. What are each program's objectives?
5. How does each support final Ω?
6. What phase structure does each have?
7. Which phases can start now?
8. What gates block others?
9. What can proceed in parallel?
10. What are effort/LOC estimates and confidence?
11. What is canonical current state?
12. Where is actual evidence?
13. Where does work descend into tasks/proof?
14. What is explicitly outside PM authority?
15. How can PM scope expand?

Target: at least 14/15 fully answerable.

## C8 — independent review

Reviewer verifies:
- exactly five managed programs;
- no autonomous program-selection logic;
- no 67-program ranking/decisioning;
- five complete dossiers;
- program-specific objectives;
- grounded final-vision mappings;
- all 25 phases represented;
- dependency gates coherent;
- estimates preserved/refined with lineage;
- evidence state honest;
- Ratchet remains external execution/proof authority.

Only then resume PM evolution.

---

# 21. Required generated outputs

The corrected PM system should generate, at minimum:

1. **SELECTED-PROGRAMS.md**
   - exactly five programs
   - concise purpose/current state/roadmap depth

2. **PROGRAMS/**
   - MP-21.md
   - MP-54.md
   - MP-55.md
   - MP-56.md
   - MP-60.md
   - full Program Dossiers

3. **ROADMAP.md**
   - all 25 phases
   - effort
   - LOC
   - dependencies
   - exit gates

4. **DEPENDENCIES.md**
   - cross-program gate graph

5. **ESTIMATES.md**
   - effort/LOC ranges/confidence
   - later actual-vs-estimate learning

6. **machine-readable projection**
   - same semantic content for tooling

Exact paths are implementation choices.

---

# 22. Acceptance criteria

The correction is complete when:

## Scope

- PM manages exactly 5 programs.
- Those IDs are MP-21, MP-54, MP-55, MP-56, MP-60.
- No other MP is materialized as a managed PM program.
- Other MPs may appear only as references/dependencies.

## No decisioning

- no PM code selects programs;
- no PM code ranks the 67;
- no PM code activates/deactivates program scope;
- no PM team charter grants strategic decision authority;
- scope changes require explicit Owen instruction.

## Program understanding

For all five:
- explanation complete;
- problem statement complete;
- 4–8 program-specific objectives;
- final-vision mapping complete;
- boundaries complete;
- success conditions complete;
- falsifiers/open questions complete;
- source refs complete.

## Roadmap depth

For all five:
- 5 phases each;
- 25 total phases;
- each phase has outcome/objective;
- effort grade;
- LOC estimate;
- confidence;
- dependency information;
- exit gate or explicit reason why no gate exists.

## Dependency clarity

- MP21-G3 relationships explicit;
- MP56-G4 relationships explicit;
- safe parallel starts visible;
- external dependencies clearly marked as external references.

## Truth integrity

- canonical current state projected, not overwritten;
- no blanket false "UNPROVEN 67";
- PM plan state distinct from execution/proof/evidence;
- Ratchet remains atomic proof owner where linked.

## Orientation

Fresh-worker dogfood ≥14/15 questions fully answerable.

---

# 23. Final instruction to the ZCode PM team

Do not widen scope.

Do not decide strategy.

Do not choose programs.

Do not rank the 67.

Do not invent the next roadmap.

Your job is narrower and deeper:

> **Take the five programs Owen already selected and make them extraordinarily well understood, well phased, dependency-aware, estimable, maintainable, and eventually decomposable to executable atomic work.**

The 67-program Meta Tracker tells us the universe.

Owen selects what enters PM scope.

The PM team turns that selected scope into a high-quality executable roadmap.

That is the boundary.
