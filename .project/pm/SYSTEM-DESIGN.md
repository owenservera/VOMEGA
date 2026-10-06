# Expandable Project Roadmap System — Design

Status: **DESIGN ONLY**  
Purpose: define the future PM tracker before building it.

## 1. Design goal

Create one expandable planning system that can represent all 67 meta programs at their appropriate current resolution, while allowing any one program to deepen gradually into phases, dependency gates, work packages, tasks, atomic tasks and executable proof.

The central requirement is **variable resolution**.

A program that is years away may need only:
- explanation;
- objectives;
- final-vision contribution;
- current state;
- important dependencies.

A program entering active execution may need:
- five or more phases;
- explicit phase exit gates;
- effort/LOC estimates;
- cross-program dependencies;
- work packages.

A program under implementation may eventually need:
- task graph;
- write surfaces;
- claims/leases;
- executable acceptance gates;
- evidence;
- regression state.

Do not force atomic task decomposition across all 67.

## 2. Hierarchy

```text
Vision
└── Meta Program (MP-xx)
    ├── explanation
    ├── objectives
    ├── final-vision contribution
    ├── roadmap state
    ├── Program Phase (P1..Pn)
    │   ├── outcome
    │   ├── scope
    │   ├── effort grade
    │   ├── estimated LOC band
    │   ├── entry dependencies
    │   ├── exit gate(s)
    │   └── evidence expectation
    ├── Cross-program Gate (MPxx-Gn)
    └── Work Package / Initiative
        └── Task
            └── Atomic Task
                └── Proof / Evidence Gate
```

The hierarchy is conceptual. The implementing team may choose files, JSON, SQLite, a local web UI or another representation after inspecting the current repository and ZCode capabilities.

## 3. Mandatory program fields

Every one of the 67 programs must always have:

- **ID** — canonical `MP-xx`.
- **Name** — from META-TRACKER.
- **Explanation** — plain-language statement of what the program is.
- **Objectives** — explicit outcomes the program seeks.
- **Final-vision contribution** — why the program exists in the final Ω story, in words.
- **Canonical source** — META-TRACKER / evidence references.
- **Current evidence/state** — projection/reference, never hand-invented truth.
- **Roadmap maturity** — REGISTERED / SEEDED / PHASED / DECOMPOSED / EXECUTABLE / PROVEN-SLICE / RETIRED.
- **Dependencies** — program or gate references where meaningful.
- **Open questions / falsifiers**.
- **Last reviewed source HEAD**.

A program does not need phase/task detail merely because these fields exist.

## 4. Roadmap maturity model

### REGISTERED
Program exists with meaning, objectives and vision mapping. No phase plan.

### SEEDED
A provisional phase shape exists, but estimates/dependencies may still be rough.

### PHASED
High-level phases have outcomes, effort grades, LOC bands and exit gates.

### DECOMPOSED
One or more phases contain concrete work packages/tasks.

### EXECUTABLE
Tasks are connected to deterministic acceptance/proof where appropriate.

### PROVEN-SLICE
A bounded program outcome has current evidence.

### RETIRED / SUPERSEDED
Program or decomposition was replaced, with lineage and reason.

Maturity is not linear completion of the entire program. A program can have a proven slice while later phases remain TBD.

## 5. Default five-phase planning frame

Five phases are the preferred **first planning lens**, not constitutional structure.

A useful default:
1. **Foundation / identity** — establish the minimum primitives and boundaries.
2. **Core capability** — make the central mechanism work.
3. **Integration / graph / enrichment** — connect to shared project/system reality.
4. **Operationalization** — make it useful in real development/product loops.
5. **Continuous / scaled form** — automate, measure and evolve.

Programs may merge, split or add phases when evidence warrants it. Preserve old decomposition lineage.

## 6. Dependency gates

Dependencies must reference a **specific gate**, not merely another large program whenever possible.

Bad:
> MP-54 depends on MP-21.

Better:
> MP-54 Phase 2 is blocked by MP21-G3: stable queryable Reflection identities.

Gate fields:
- gate ID;
- producing program/phase;
- statement that must become true;
- proof/evidence required;
- consumers unlocked;
- status: TBD / OPEN / SATISFIED / REGRESSED / SUPERSEDED;
- source/evidence refs.

This permits parallel work before a full program is complete.

## 7. Effort grades

Effort grades estimate engineering difficulty/coordination, not elapsed calendar time.

| Grade | Meaning | Typical shape |
| --- | --- | --- |
| **E0 — trivial** | small doc/config/query change | one bounded edit |
| **E1 — small** | localized implementation | few files, low coupling |
| **E2 — moderate** | coherent small subsystem/slice | multiple files/tests |
| **E3 — substantial** | cross-cutting subsystem | several contracts/integrations |
| **E4 — large** | major capability with multiple interfaces | significant integration/review |
| **E5 — program-scale** | broad uncertain system or multiple subsystems | should usually be split before execution |

A high-level phase may be E4 even if every atomic task is E0–E2.

## 8. LOC estimates

LOC is a **size prior**, never a target or proof of progress.

Each phased item should record:
- implementation LOC band;
- test/evidence LOC band where material;
- optionally docs/config/data band;
- confidence: LOW / MEDIUM / HIGH;
- basis: analogous code, current repo inspection, or rough prior.

Recommended bands:
- XS: <150 LOC
- S: 150–500
- M: 500–1,500
- L: 1,500–4,000
- XL: 4,000–10,000
- XXL: >10,000 — should trigger decomposition review

Generated data, vendored code and large fixture payloads should be reported separately so they do not distort estimates.

## 9. Status versus evidence

The tracker should display at least four distinct dimensions:

1. **Plan state** — TBD / seeded / phased / decomposed.
2. **Execution state** — unclaimed / claimed / blocked / active, where a task system exists.
3. **Proof state** — unproven / candidate / proven-slice / regressed.
4. **Evidence class** — fixture / verified-local / manual-live / automated-live / differential, or the current canonical vocabulary.

Never collapse these into one “percent complete.”

A program can be:
- fully planned but unproven;
- poorly planned but have a proven slice;
- actively executed but blocked at a proof gate.

## 10. Relationship to Ratchet

Ratchet is already a useful model for atomic execution/proof.

The PM roadmap should eventually hand a sufficiently decomposed phase/work package to an execution system like Ratchet, rather than reimplementing leases/gates/regression logic.

```text
PM system:
vision → program → phase → dependency gate → work package

Ratchet/task engine:
work package → task → atomic task → gate → proof → regression
```

The boundary may evolve, but duplicated state must be avoided.

## 11. Views the future tracker should support

The core data should generate multiple projections:

- **67-program portfolio** — all programs, maturity and strategic state.
- **Dependency map** — cross-program gates and unlocks.
- **Program detail** — explanation, objectives, vision mapping, phases.
- **Acceleration portfolio** — MP-46..67 with measured benefit.
- **MVP view** — only programs/phases contributing to current release.
- **Frontier view** — unblocked high-leverage work.
- **Evidence view** — proven/unproven/regressed claims.
- **Estimation view** — effort/LOC by program/phase with uncertainty.
- **Atomic execution view** — linked Ratchet/task state where available.

The UI is replaceable. The durable data model matters more.

## 12. Planning anti-patterns

Do not:
- turn 67 programs into 67 active workstreams;
- pre-create thousands of atomic tasks;
- infer activity from documentation;
- use LOC as productivity;
- use “percent complete” without evidence semantics;
- let a PM database replace Git/tests/evidence;
- create duplicate program meanings separate from META-TRACKER;
- create five different identity systems for Reflection, context, failure, trace and impact work;
- freeze the five-phase frame when a different decomposition is better.

## 13. Evolution target

The long-term PM system should become capable of:

```text
change in evidence or project reality
        ↓
affected programs/phases identified
        ↓
dependencies/gates recalculated
        ↓
candidate next work ranked
        ↓
context packet generated
        ↓
atomic work executed/proven
        ↓
proof updates roadmap state
```

It should assist decision-making, not autonomously grant product authority.
