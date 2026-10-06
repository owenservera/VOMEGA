# Dependency Graph & Parallel Execution Plan

> **Interpretation rule:** dependencies and Locks describe the best current interoperability hypothesis. A Lock freezes a boundary only long enough to coordinate work; it does not freeze architecture and remains falsifiable/revisable.

Status: **TEAM-LAUNCH DESIGN**  
Parent: [README.md](README.md)

## 1. The two product paths

The launch deliberately separates two paths that eventually meet.

### Semantic product twin

```
SDW semantic identities / fixture Worlds
        ↓
LNC command compiler / validator
        ↓
VFX VisualSpec / sandbox
       ↙            ↘
SKW Wiki          EXP experiments
```

This path is fully local and can advance immediately.

### Live product realization

```
PRV transport / Account identity
        ↓
SDW durable Provider/Account/Model state
        ↓
LNC validated prompt.send
        ↓
RTE authority / execution / evidence
        ↓
PRV provider realization
        ↓
RTE native shell / release
```

This path crosses live external reality and requires stronger evidence.

TRU gates claims on both.

DEV coordinates both without owning their architecture.

---

## 2. Dependency DAG

```
                  ┌──────────────┐
                  │ DEV preflight│
                  └──────┬───────┘
                         │
        ┌────────────────┼────────────────────────────┐
        │                │                            │
        ▼                ▼                            ▼
 ┌────────────┐    ┌────────────┐               ┌────────────┐
 │ SDW v0     │    │ LNC assay  │               │ PRV assay  │
 │ semantics  │    │ + corpus   │               │ transport  │
 └─────┬──────┘    └─────┬──────┘               └─────┬──────┘
       │                 │                            │
       │           ┌─────┴──────┐                     │
       │           │            │                     │
       ▼           ▼            ▼                     ▼
 ┌────────────┐ ┌───────────┐ ┌────────────┐   ┌────────────┐
 │ SDW Worlds │ │ UseCommand│ │ LNC frames │   │ Account ID │
 └─────┬──────┘ └─────┬─────┘ └─────┬──────┘   │ evidence   │
       │              │              │          └─────┬──────┘
       └───────┬──────┘              │                │
               ▼                     ▼                │
         ┌──────────────┐       ┌────────────┐         │
         │ LNC validator│◄──────│ WorldModel │         │
         └──────┬───────┘       └────────────┘         │
                │                                       │
        ┌───────┼────────────────┐                      │
        │       │                │                      │
        ▼       ▼                ▼                      │
 ┌──────────┐ ┌────────────┐ ┌────────────┐            │
 │ VisualSpec│ │ Session/rev│ │ RTE command│            │
 │ vNext     │ │ semantics  │ │ boundary   │            │
 └────┬─────┘ └─────┬──────┘ └─────┬──────┘            │
      │             │              │                   │
      ▼             └──────┬───────┘                   │
 ┌──────────┐              │                           │
 │ VFX UI   │              ▼                           │
 │ sandbox  │        ┌──────────────┐                  │
 └────┬─────┘        │ simulated    │                  │
      │              │ prompt.send  │                  │
      │              └──────────────┘                  │
      │                                               │
      ▼                                               ▼
 ┌────────────┐                                ┌──────────────┐
 │ SKW Wiki   │                                │ PRV live     │
 │ projection │                                │ prompt.send  │
 └────┬───────┘                                └──────┬───────┘
      │                                               │
      └───────────────────┬───────────────────────────┘
                          ▼
                    ┌──────────────┐
                    │ RTE product  │
                    │ integration  │
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐
                    │ native MVP   │
                    └──────────────┘

EXP consumes outputs at every semantic/sandbox level.
TRU independently verifies every promotion boundary.
SKW Reflection extraction can start before SDW but joins SDW IDs before product adoption.
```

---

## 3. Work that can start with zero product dependencies

This list was the input to the first wave (executed 2026-10-05, design artifacts only; see `STATUS.md`). It remains a fair description of which work has no product dependency.

### SDW

- semantic identity/record assay;
- Provider/Account/Model/Capability v0;
- fixture-World schema;
- OS-taxonomy comparison.

### LNC

- current compiler/corpus assay;
- addressee/Model grammar design;
- UseCommand candidate shape;
- current defect reproduction.

### VFX

- current VisualSpec/projector audit;
- renderer architecture;
- visual variant sketches against frozen fixture JSON.

VFX may use a temporary fixture contract while SDW/LNC finalize the real candidate.

### SKW

- Reflection Migrator audit mode;
- manifest/op/source-anchor extraction;
- current self-description gap inventory.

### EXP

- scenario runner over the current release corpus;
- semantic-diff format;
- metric definitions.

### PRV

- read-only browser transport inventory;
- external harvest;
- Account-identity evidence research.

### RTE

Only the independent pieces:

- web trust-boundary assay;
- shell framework harvest;
- packaging spike research;
- authority/consequence mapping review.

### TRU

- proof ledger;
- falsifier skeleton;
- regression lane;
- independent review templates.

---

## 4. Interface locks that unlock the next wave

The project should avoid waiting for “complete” subsystems.

Instead, agree on small interface locks. A Lock is a temporary interoperability agreement: stable enough for parallel work, explicitly falsifiable, and replaced when better evidence appears. The letters A–E and their producers are the current proposal; a team may redraw the boundaries. As of 2026-10-06, A–D are unfrozen design candidates and E is reconnaissance.

### Lock A — semantic IDs + MVP entity relations

Produced by SDW.

Must answer:

- how Provider, Account and Model are separately identified;
- how Account references Provider;
- how Model references Provider;
- how capability is referenced;
- how synthetic vs observed state is marked.

Unlocks:

- LNC final route fields;
- VFX semantic handles;
- SKW semantic-node mapping;
- EXP scenario expectations.

### Lock B — candidate UseCommand + validation outcomes

Produced by LNC with SDW.

Must answer:

- command route fields;
- unresolved representation;
- revision/world refs;
- READY/needs-choice/needs-info/unavailable/refused semantics.

Unlocks:

- VisualSpec projector;
- semantic interaction reducer;
- simulated submission envelope;
- RTE execution contract.

### Lock C — VisualSpec vNext candidate

Produced by VFX.

Must expose:

- semantic handles;
- route;
- validation;
- consequences;
- Wiki refs;
- interactions;
- revision.

Unlocks:

- full sandbox;
- visual experiments;
- eventual native shell.

### Lock D — minimal Reflection Graph

Produced by SKW.

Must expose:

- semantic node identity;
- source anchor;
- relationships;
- claim class;
- query by semantic handle.

Unlocks:

- auto-generated contextual Wiki;
- Reflection completeness experiments.

### Lock E — live Account evidence contract

Produced by PRV, challenged by TRU.

Must answer:

- what evidence identifies Provider;
- what evidence identifies Account;
- freshness/expiry;
- ambiguity/switch behavior;
- how the product represents unknown.

Unlocks:

- durable Account relationship implementation;
- live `prompt.send`;
- truthful availability state.

---

## 5. Critical path to the visualization sandbox

The shortest path is:

```
DEV preflight
→ SDW Lock A
→ LNC Lock B
→ VFX Lock C
→ VFX sandbox
→ SKW Lock D / Wiki
→ EXP replay + comparison
→ owner visual/design review
```

Important parallelism:

- SKW Lock D begins before A and reconciles IDs later.
- EXP begins before B with the existing corpus.
- VFX renderer work begins before B using a frozen temporary fixture.
- SDW and LNC iterate through explicit contract handoffs rather than one team waiting for the other to “finish.”

No live Provider dependency exists on this path.

---

## 6. Critical path to real prompt.send MVP

```
PRV transport inventory
→ PRV Account evidence
→ SDW durable Account/Model state
→ LNC validation/defaulting
→ RTE authority/attempt/evidence envelope
→ PRV Provider-1 realization
→ TRU automated-live proof
→ VFX/RTE native shell integration
→ Provider-2 falsification
→ packaging/release
```

The visualization sandbox reduces risk on the interaction half of this path but does not shorten live external proof by pretending fixtures are real.

---

## 7. Parallelization waves

### Wave 0 — launch substrate

Run concurrently where possible:

- DEV lane health + isolation;
- TRU proof/regression setup.

No product team waits for a perfect orchestrator.

### Wave 1 — maximum independent fan-out

Concurrent:

1. SDW semantic contract + fixture design.
2. LNC compiler/corpus/UseCommand assay.
3. VFX VisualSpec/projector audit and renderer scaffold.
4. SKW read-only Reflection extraction.
5. EXP scenario runner + semantic diff.
6. PRV transport/account evidence assay.
7. RTE trust/shell/packaging research.

This is the highest-parallelism phase.

### Wave 2 — contract convergence

Concurrent clusters:

**Cluster Semantic**
- SDW Lock A;
- LNC Lock B;
- EXP contract tests.

**Cluster Experience**
- VFX Lock C;
- SKW Lock D;
- EXP rendering/Wiki tests.

**Cluster Live**
- PRV Lock E;
- RTE authority/execution envelope;
- TRU live-proof protocol.

The clusters communicate through the five locks, not shared prose interpretation.

### Wave 3 — full sandbox

Parallel:

- VFX simulator;
- LNC InterpretationSession;
- SKW contextual Wiki;
- EXP mutation/variant runs;
- TRU falsifier runs.

SDW mostly stabilizes fixture/World compatibility.

PRV continues independently.

### Wave 4 — product bridge

Parallel where write sets allow:

- durable Account relationships;
- native shell channel;
- consent/evidence envelope;
- Provider-1 `prompt.send`;
- product availability projection;
- Reflection runtime compilation.

### Wave 5 — falsification and release

- Provider 2;
- drift/stale-state;
- native shell;
- packaging;
- ordinary-user test;
- release proof audit.

---

## 8. What should never block what

### Live provider work must not block

- language corpus work;
- VisualSpec;
- sandbox UI;
- Reflection Migrator;
- Wiki projection;
- semantic experiment infrastructure.

### Native shell framework must not block

- the sandbox;
- VisualSpec;
- interaction semantics.

The sandbox may run as the fastest convenient local dev surface.

### Full Reflection migration must not block

- MVP Wiki proof.

Migrate only the MVP slice first.

### Full OS taxonomy must not block

- anything in MVP.

Use it only as a benchmark/stress corpus.

### Elephant context network must not block

- first-wave team execution.

Trigger a one-node experiment only after measured context reconstruction friction.

---

## 9. Shared-resource serialization

Parallelism is unsafe around some resources.

### Browser / live Account

Only one worker should control the same browser profile/Account at a time unless the experiment explicitly tests concurrency.

PRV owns scheduling.

### Core contract files

If two teams need the same foundational contract file:

1. agree on interface lock;
2. one team writes the contract;
3. other team consumes through adapter/stub;
4. integration happens through review.

Do not concurrently rewrite a central contract.

### Main branch integration

One merge queue.

No force pushes.

A completed worktree is not “done” until:

- relevant tests run;
- independent review occurs where required;
- merge conflict impact is understood;
- post-merge targeted checks run.

---

## 10. Short-lived worktree rule

No permanent workstream branches.

Create a task worktree only when concurrent writing makes it useful.

Suggested local naming:

```
.worktrees/<task-id>/
```

with a disposable local task branch.

After accepted integration:

- merge/fast-forward/cherry-pick according to current repo policy;
- run post-merge proof;
- delete worktree;
- delete task branch.

Workstream identity lives in Commons/launch state, not Git branch topology.

---

## 11. Review topology

### Normal bounded change

Implementer → deterministic tests → TRU review → integration.

### Load-bearing semantic contract

At least:

- implementation owner;
- one independent architecture/consumer review;
- TRU falsifier review.

### High-uncertainty architecture

Use a hypothesis arena:

```
same evidence capsule
→ independent proposals
→ smallest discriminating experiment
→ EXP comparison
→ TRU challenge
→ integrate winner / retain uncertainty
```

Do not merge competing architectures by compromise when one can be falsified.

---

## 12. Promotion boundaries

A team may land experimental code without declaring product proof.

Use labels conceptually equivalent to:

```
DESIGN
EXPERIMENTAL
FIXTURE-VERIFIED
VERIFIED-LOCAL
MANUAL-LIVE
AUTOMATED-LIVE
PRODUCT
```

TRU owns the evidence-level claim.

An implementer owns making the mechanism work.

---

## 13. Dependency failure behavior

When a dependency is late:

- do not idle the team automatically;
- use an adapter/fixture if semantics are sufficiently bounded;
- switch to tests/falsifiers;
- harvest prior art;
- attack another independent task in the same workstream.

When an interface is genuinely unknowable without the dependency, record the blocker and release the executor lane.

---

## 14. Replanning triggers

Re-run dependency allocation when:

- an interface lock changes materially;
- a falsifier turns red;
- Provider 2 breaks shared semantics;
- more than one team repeatedly edits the same files;
- merge/review queue becomes the bottleneck;
- a lane/tool proves unavailable;
- experiment results show a workstream boundary is wrong;
- owner changes product scope.

The team topology is an optimization, not architecture law.
