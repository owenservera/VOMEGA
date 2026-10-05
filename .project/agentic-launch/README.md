# Local Agentic Team Launch — VOMEGA

Status: **OWNER-DIRECTED TEAM-LAUNCH SEED**  
Date: 2026-10-05

This directory is the execution overlay for launching the local VOMEGA development teams.

It does **not** replace:

- `seed-docs/` product intent and architecture;
- the existing `.project/roadmap/` task IDs and release proof matrix;
- Git/source/tests/runtime evidence;
- the owner-selected first-release product shape.

It reorganizes the current work into team ownership boundaries that reduce handoffs and maximize safe parallel development.

## Launch objective

The immediate program has two coupled but separately executable goals.

### A. Build the semantic product twin

Make the complete first-product interaction visible and experimentally refinable without waiting for live browser execution:

```
floating-box simulation
→ NLP/NCL/NLCL
→ explicit semantic meaning
→ Provider / Account / Model routing
→ prompt.send candidate
→ deterministic validation
→ VisualSpec
→ contextual Wiki
→ simulated submission boundary
```

This is the **MVP Visualization Sandbox**.

### B. Close the live-reality seam in parallel

Independently prove:

```
real browser transport
→ real Provider
→ real Account identity
→ prompt.send realization
→ governed attempt
→ observed external outcome
→ evidence
```

The simulated product twin must not pretend to prove B.

The live Provider work must not dictate the semantic/UI architecture merely because it is externally coupled.

## Why this overlay exists

The current roadmap has good release coverage, but its nine lanes were created before the newer work on:

- Semantic Data Engine;
- VisualSpec vNext;
- MVP Visualization Sandbox;
- automated semantic experiments;
- Reflection ABI;
- source-native contextual Wiki;
- Reflection Migrator;
- Model as a first-class routing dimension;
- OS-taxonomy harvest/generalization benchmark.

For team execution, the new work is better grouped around **change ownership boundaries**, not milestone labels.

The existing task IDs remain valid references and evidence obligations.

## Program map versus launch lanes

The complete VOMEGA program is tracked in [../META-TRACKER.md](../META-TRACKER.md). It currently enumerates the major product, architecture, laboratory, provider, runtime, research and development-system programs, including programs intentionally deferred from the first release.

The nine workstreams in this directory are **execution ownership lanes only**. They are deliberately fewer and broader than the meta-program map.

## Launch documents

Read in this order:

1. [STATUS.md](STATUS.md) — current launch state, claims and first fan-in checkpoint.
2. [WORKSTREAMS.md](WORKSTREAMS.md) — team missions, ownership boundaries and existing-roadmap mapping.
3. [DEPENDENCY-GRAPH.md](DEPENDENCY-GRAPH.md) — critical paths, dependency contracts and parallelism.
4. [FIRST-WAVE.md](FIRST-WAVE.md) — the first dispatch across the local execution pool.
5. [TEAM-PROMPTS.md](TEAM-PROMPTS.md) — ready-to-use head-of-workstream bootstrap prompts.
6. [MODEL-ROUTING.md](MODEL-ROUTING.md) — current OpenAI/Anthropic model hierarchy, scarcity policy, and workstream routing.
7. [launch-manifest.json](launch-manifest.json) — machine-readable launch topology.

## Canonicality and freshness

The launch overlay deliberately separates **policy/topology** from **live runtime state**.

Use these sources for different questions:

- `../META-TRACKER.md` — canonical map of **what programs exist** across VOMEGA; not a runtime claim surface.
- `STATUS.md` — **only mutable launch-state surface**: who has claimed what, current runtime pool observations, blockers, current fan-in readiness.
- `launch-manifest.json` — machine-readable topology, workstream ownership, interface locks, routing policy defaults and triggers. It is not proof that a model/harness is currently reachable.
- `MODEL-ROUTING.md` — model/harness selection policy and current external research. It is not the current account quota/availability ledger.
- `FIRST-WAVE.md` — launch procedure and bounded first tasks. It must consume runtime discoveries from STATUS rather than treating historical provider wiring as fixed capacity.
- `SITREP.md` — project-level summary and pointers. It should not duplicate detailed per-agent launch state.
- `COMMONS.md` — durable handoffs/history. Historical entries may describe earlier runtime assumptions and should not be mistaken for current STATUS.

### Fresh-check rule

Before a fresh local agent interprets contradictions among launch documents:

1. record local `HEAD`;
2. compare it with `origin/main`;
3. inspect local uncommitted work;
4. if the checkout is clean and behind, fast-forward before diagnosing documentation inconsistency;
5. if it is dirty/diverged, preserve the work and report the divergence rather than pulling blindly.

A finding about a missing link, task state, model or harness is valid only against the exact source HEAD it read.

### Runtime-resource rule

The project no longer assumes that a historical provider/account layout equals current execution capacity.

DEV discovers the current effective local pool at launch:

- harness;
- effective model or router;
- available concurrency;
- quota/allowance information when safely observable;
- permissions/modes;
- whether the worker can actually complete a bounded probe.

Provider/auth/model configuration remains read-only unless the owner explicitly requests a change.

## The nine launch workstreams

| ID | Workstream | Core responsibility |
| --- | --- | --- |
| SDW | Semantic Data & World | Provider/Account/Model/Capability identity, World, registry, fixtures, consequences |
| LNC | Language & Command Compiler | NCL/NLCL, UseCommand, grounding, validation, revision/session semantics |
| VFX | Visual Feedback & Sandbox | VisualSpec vNext, semantic interactions, floating-box simulator, visual variants |
| SKW | Self-Knowledge & Wiki | Reflection ABI/migration, Reflection Graph, Wiki projection and source grounding |
| EXP | Semantic Lab & Experiments | scenario runner, mutations, semantic diff, metrics, replay, experiment evidence |
| PRV | Provider Reality Lab | browser transport, Account identity, provider realizations, live conformance |
| RTE | Runtime, Authority & Release | authority/execution/evidence, native shell bridge, packaging and recovery |
| DEV | Development System & Integration | lane health, dispatch, isolation, merge queue, context/handoff automation |
| TRU | Truth & Independent Verification | independent review, falsifiers, proof ledger, claim maturity and veto findings |

These are **work ownership boundaries**, not permanent departments or constitutional components.

They may split, merge or disappear when the work changes.

## Four organizational rules

### 1. Heads own outcomes, not branches

No permanent department/workstream branch.

A workstream head is accountable for:

- current objective;
- task decomposition;
- bounded dispatch;
- dependency handoffs;
- proof;
- fresh-agent continuity.

Branches/worktrees, when necessary, are **short-lived task isolation**, deleted after integration.

### 2. Product implementation and Truth stay independent

A worker must not be the final reviewer of its own consequential architectural/code change.

TRU can generate tests and findings, but it does not become the implementation owner.

### 3. The repository is the durable team memory

ZCode sessions, Codex context, Claude context and future elephant sessions are derived cognition.

Durable decisions, interfaces, tests, evidence and status belong in the repository.

### 4. Maximum useful parallelism, not maximum agents

Parallelize when teams have independent write sets or explicit interface contracts.

Serialize when work would otherwise cause:

- competing edits to the same contract;
- hidden semantic divergence;
- repeated merge repair;
- contention on one browser Account/profile;
- reviewer congestion.

## Shared semantic spine

All product-facing teams converge on:

```
source-native semantic declarations
        ↓
Reflection / Semantic Data Engine
        ↓
World
        ↓
InterpretationSession
        ↓
NCL/NLCL
        ↓
UseCommand
        ↓
validation / defaulting
        ↓
VisualSpec
      ↙          ↘
floating UI      contextual Wiki
        ↓
governed execution boundary
        ↓
realization / evidence
```

A team may implement a piece of this spine.

It may not create a private parallel semantic path.

## Initial local execution pool

Current candidate pool:

- ZCode using the owner's current configured route (currently reported as `openrouter/auto`);
- local Codex;
- local Claude Code;
- Grok Build once installation/reachability is verified;
- deterministic Git/Bun/test/browser tooling;
- historically configured Space Bunny provider accounts, which are evidence of prior configuration rather than assumed current worker slots.

Treat all provider/model configuration as read-only.

DEV must measure actual reachable concurrency and effective routed model behavior before dispatch. The logical workstream topology is independent of provider-account count or which tool/model performs a task.

## Launch philosophy

The first launch should establish enough team machinery to make parallel product progress immediately.

Do not first build:

- a large dashboard;
- a permanent agent hierarchy;
- an elephant network;
- a development event warehouse;
- a generalized scheduler;
- a new project-management application.

Those remain optional accelerators triggered by measured bottlenecks.

## First success criterion

The team launch is successful when independent local agents can concurrently advance the semantic twin and live-provider proof, hand results through explicit contracts, receive independent verification, and integrate without the owner manually reconstructing who changed what or why.

The first product checkpoint is:

> The complete three-provider MVP interaction can be replayed visually in the sandbox from blank state through a fully compiled **SIMULATED prompt.send**, with generated contextual Wiki and truthful ambiguity.

The parallel external checkpoint is:

> A real browser/provider transport and Account identity seam is characterized strongly enough to define what live product evidence must later replace the sandbox fixtures.

## Start

A coordinator/bootstrap executor should now read [FIRST-WAVE.md](FIRST-WAVE.md), run the preflight, and dispatch the independent tasks.

No owner clarification is required for ordinary reversible implementation choices covered by the seed.
