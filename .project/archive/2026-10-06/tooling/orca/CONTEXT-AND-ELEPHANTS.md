# Context Bundles and Elephant sessions under Orca

**Status:** development-acceleration hypothesis, not runtime fact.

The canonical concept remains `../../seed-docs/ELEPHANT-CONTEXT-NETWORK.md`.

This document describes how that hypothesis should interact with the Orca execution layer if/when tested.

## 1. Two different context mechanisms

### Context Bundle

A task-scoped package designed to minimize reconstruction cost for a fresh worker.

Likely contents:
- task contract;
- relevant source identities/files;
- architecture/invariant excerpts;
- dependent decisions;
- current tests/evidence;
- recent failure capsule or trace;
- known non-goals;
- pointers back to canonical sources.

A bundle is a projection. It is never the source of truth.

### Elephant

A retained long-context session holding a bounded domain deeply enough to provide high-value comparison, critique and retrieval.

Possible domains:
- architecture/invariants;
- current codebase subsystem;
- product/project truth;
- provider reality/evidence;
- selected large workstream.

An Elephant is cognition, not canon.

## 2. Interaction pattern

```text
worker proposal / question
          │
          ▼
bounded context request
          │
     ┌────┴─────┐
     ▼          ▼
Context Bundle  Elephant
     │          │
     └────┬─────┘
          ▼
advice / contradiction / evidence pointer
          │
          ▼
worker decides + implements
          │
          ▼
tests/evidence/review
```

Elephants should normally advise workers rather than edit worker-owned worktrees directly.

## 3. Example services to test

Rank value empirically rather than assuming all are useful:

1. architecture contradiction detection;
2. code-change impact review;
3. locating hidden constraints across a large source partition;
4. proposed-diff critique before implementation;
5. reviewer context acceleration;
6. onboarding a fresh worker from a bounded domain;
7. comparing two competing implementations against the same context;
8. tracing a failure to relevant prior decisions/files;
9. synthesizing candidate context bundles for a task;
10. detecting stale context and requesting refresh.

## 4. Boundaries

An Elephant must not:
- declare architectural truth merely from memory;
- replace repository lookup where precise source evidence matters;
- own an entire department permanently;
- silently edit shared files;
- become a hidden approval gate;
- hoard a provider lane when measured value is low;
- preserve stale context indefinitely.

## 5. Rotation and freshness

Research/testing should determine:
- ideal domain size;
- token occupancy threshold;
- refresh policy;
- when to rotate/rebuild a session;
- whether to assign one or multiple providers per domain;
- whether worker→Elephant requests should include full files, diffs or compact bundles;
- latency/congestion limits as worker count grows.

No “20 sessions” number is architectural law. It is a stress-test hypothesis.

## 6. Evaluation

Each Elephant service should be measured against a baseline without it.

Candidate metrics:
- worker setup/context-reconstruction time;
- bugs/contradictions caught pre-merge;
- duplicate investigation avoided;
- token/latency cost;
- false constraints introduced;
- stale-context incidents;
- reviewer turnaround;
- amount of canonical repo evidence cited in advice.

Retain only services that improve validated progress.
