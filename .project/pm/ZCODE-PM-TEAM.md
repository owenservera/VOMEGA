# ZCode PM Team — Charter and Operating Model

Status: **SEED TEAM DESIGN — FUNCTIONS MAY REORGANIZE**

## Mission

Implement, maintain and evolve the expandable PM roadmap designed in this folder so VOMEGA can preserve the full 67-program destination while planning only the resolution justified by current evidence.

The team is responsible for the development-management system, not for deciding Ω product truth.

Its eventual product is a trustworthy project-management layer capable of moving from:

`67 meta programs → phases → dependency gates → work packages → tasks → atomic tasks → proof state`

without duplicating source/tests/evidence or manufacturing bureaucracy.

## First principle

**Build the minimum PM core first.**

Do not begin with:
- a polished dashboard;
- a generalized scheduler;
- automatic assignment;
- thousands of generated tasks;
- a new database of project truth;
- AI-generated percentage completion.

First prove:
1. all 67 programs can be represented coherently;
2. program explanation/objectives/vision mapping stay tied to canonical sources;
3. phases/gates can be added incrementally;
4. the first five seeded roadmaps can be represented;
5. lower-level Ratchet/task state can be referenced without duplication.

## Team functions

These are responsibilities, not permanent agents. ZCode may combine/split them based on actual runtime capability and workload.

### 1. PM Systems Lead / Integrator
Owns coherence of the PM system design and integration.
Responsibilities:
- maintain schema/system boundaries;
- arbitrate duplication between PM, META-TRACKER and Ratchet;
- integrate reviewed changes;
- keep implementation small;
- measure PM-system overhead.

### 2. Program Curator / Vision Mapper
Owns semantic fidelity of the 67-program register.
Responsibilities:
- verify program explanation/objectives against canonical docs;
- preserve final-vision mappings;
- detect drift when META-TRACKER changes;
- propose program merge/split/supersession only with rationale.

### 3. Dependency & Estimation Analyst
Owns phase/gate modeling, effort grades and LOC estimates.
Responsibilities:
- prefer gate dependencies over whole-program serialization;
- maintain uncertainty/confidence;
- update estimates from observed implementation;
- identify critical unlock gates and parallelism.

### 4. Execution Decomposer / Ratchet Bridge
Owns the boundary from roadmap to executable work.
Responsibilities:
- define when phases become work packages/tasks;
- avoid premature atomic decomposition;
- map selected work into Ratchet/equivalent task graphs;
- ensure task state/proof is projected rather than copied.

### 5. PM Automation Engineer
Implements the durable PM representation, validation and projections.
Responsibilities:
- choose the smallest suitable technical substrate after repo/runtime inspection;
- deterministic parsing/validation;
- generated views;
- local-first operation;
- tests;
- migration/versioning.

### 6. Truth / Independent Reviewer
Challenges claims and PM-system behavior.
Responsibilities:
- ensure roadmap state does not outrank evidence;
- sample-check program mappings;
- test dependency/gate behavior;
- catch false completion/false precision;
- independently review load-bearing schema changes.

## ZCode use

At startup the team must inspect the actual ZCode runtime rather than assume capabilities from seed docs.

Use native capabilities where they materially help:
- dynamic workflows;
- parallel subagents;
- persistent tasks;
- project memory;
- Git;
- background jobs;
- skills;
- hooks;
- MCP;
- browser/UI testing later if a UI exists.

Do not alter provider/auth/model configuration incidentally.

Repository files, Git, tests and evidence remain durable truth. ZCode memory is derived cognition.

## Recommended first workflow

### Wave A — understand
Parallel:
- one worker validates the 67-program canonical register;
- one reads current PM/Ratchet/task surfaces and maps duplication risks;
- one reviews the first-five dependency design;
- one inspects actual ZCode capabilities and proposes the minimum implementation substrate;
- Truth worker independently challenges the proposed model.

### Wave B — design freeze for v0
Converge on:
- minimal schema;
- source references;
- roadmap-maturity vocabulary;
- phase/gate model;
- effort/LOC representation;
- projection boundaries;
- migration/versioning strategy.

Do not freeze long-term architecture.

### Wave C — PM core implementation
Implement only enough to:
- ingest/register all 67;
- preserve explanation/objectives/vision mapping;
- represent first-five phases/gates/estimates;
- validate references;
- render useful human + machine projections;
- link to Ratchet state where appropriate.

### Wave D — dogfood
Use the PM system to manage its own next development slice and one non-PM VOMEGA program.

Measure:
- onboarding time;
- duplicate edits avoided;
- stale-state incidents;
- planning overhead;
- dependency mistakes;
- usefulness to fresh agents.

### Wave E — evolve
Only then consider:
- UI/dashboard;
- automatic dependency visualization;
- task-generation assistance;
- atomic-task integration;
- context bundles;
- impact graphs;
- automated maintenance.

## Communication / durable outputs

Use repo artifacts for durable decisions.

Every meaningful PM-system change should leave:
- what changed;
- why;
- source/evidence;
- affected program/schema;
- migration/compatibility impact;
- tests/review;
- unresolved issues.

Avoid chat-only architecture.

## Authority / escalation

Escalate to Owen for:
- changing owner-selected product direction;
- material redefinition of final vision;
- changes to protected invariants;
- destructive/irreversible operations;
- auth/provider/model configuration;
- spend/subscriptions;
- material privacy/security tradeoffs.

Everything else may be decided through evidence and independent challenge.

## Team success criterion

A fresh agent should be able to enter the repo and answer, without reconstructing the whole project manually:

- What are the 67 programs and why do they exist?
- Which are deeply planned versus intentionally TBD?
- Which phase of a selected program matters now?
- What gate blocks it?
- What can proceed in parallel?
- What is the rough effort/LOC with what confidence?
- What evidence proves current state?
- Where does selected work descend into executable tasks?
- What changed in the plan and why?

If the PM system cannot answer these more cheaply than reading the whole corpus, it has not earned its keep.
