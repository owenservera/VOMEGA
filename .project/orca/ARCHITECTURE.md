# Orca target architecture

**Status:** intended operating design; Orca-specific mechanics require research/proof.

## 1. Core boundary

Orca is a **replaceable execution control plane**.

It may coordinate work, but it may not become the authority for what VOMEGA is, what must be built, whether a claim is true, or whether a result is accepted.

```text
                     OWEN
                       │
                       ▼
        ┌───────────────────────────┐
        │ VOMEGA authority surfaces│
        │ seed / meta / PM / truth │
        │ goals / invariants       │
        │ evidence / acceptance    │
        └─────────────┬─────────────┘
                      │
                      ▼
        ┌───────────────────────────┐
        │           ORCA            │
        │ execution control plane   │
        │                           │
        │ task dispatch             │
        │ isolation/worktrees       │
        │ runtime lifecycle         │
        │ visibility / steering     │
        │ fan-out / fan-in          │
        └──────┬────┬────┬────┬────┘
               │    │    │    │
       ┌───────┘    │    │    └────────┐
       ▼            ▼    ▼             ▼
    ZCode       OpenCode Codex     Grok Build
                                      │
                                      └── plus Claude Code
```

The exact Orca primitives used to realize the center box are **RESEARCH / PROOF REQUIRED**.

## 2. Ownership matrix

| Layer | Owns | Must not own |
| --- | --- | --- |
| Owen / VOMEGA authority | product direction, explicit owner choices, invariant changes, spend/auth/security escalation | routine worker scheduling |
| Seed / Meta / PM / roadmap | what exists, why it matters, decomposition, dependencies, proof obligations | live runtime claims unless evidenced |
| Orca | intended execution topology, workspace/worktree isolation, worker launch/visibility, dispatch, fan-out/fan-in, operator steering | product truth, model truth, acceptance by assertion |
| Harness | one execution environment's agent/session capabilities | VOMEGA authority |
| Router/provider/model/account | intelligence/capacity | task ownership semantics |
| Git/tests/evidence | durable result and proof surfaces | strategic intent by themselves |
| Elephant/context session | advisory context, comparison, critique, retrieval | canonical truth, final acceptance |

## 3. Required separations

Preserve the project's existing semantic discipline:

```text
HARNESS ≠ ROUTER ≠ PROVIDER ≠ ACCOUNT ≠ MODEL ≠ SESSION ≠ WORKER ROLE
TASK STATE ≠ PROOF
AGENT CLAIM ≠ EVIDENCE
CONTEXT ≠ AUTHORITY
ORCHESTRATION ≠ PROJECT TRUTH
```

When observable, every run should record the distinct dimensions rather than flattening them into “the agent”.

## 4. Execution roles

Roles are dynamic functions, never permanent identities.

### Coordinator

Responsible for:
- reading the current VOMEGA objective and proof obligations;
- decomposing bounded work;
- exposing dependencies;
- selecting candidate harness/capacity;
- detecting collisions;
- requesting review or escalation;
- fan-in and handoff quality.

Normally the coordinator should avoid becoming the main coding worker when that would reduce independent review or create a bottleneck.

### Worker

A worker:
- owns a bounded task/write set;
- works in an isolated environment when collision risk warrants it;
- produces artifacts, tests and evidence;
- reports uncertainty/failure explicitly;
- does not promote its own result to project truth.

### Reviewer / challenger

For consequential changes:
- independent from the author where practical;
- checks the actual diff/result/evidence;
- may be cross-harness or cross-provider when independence adds value;
- does not add ceremony where deterministic proof is stronger and sufficient.

### Elephant

A retained long-context advisory session:
- holds a bounded context domain;
- answers questions and compares proposals to context;
- can challenge architectural or code consistency;
- does not directly become the durable memory layer.

See `CONTEXT-AND-ELEPHANTS.md`.

## 5. Atomic dispatch contract

Every meaningful dispatch should be representable with:

```text
TARGET
Exact subsystem/files/environment.

CHANGE
Concrete requested outcome.

CONSTRAINTS
Invariants, do-not-touch surfaces, security/auth limits.

OWNERSHIP
What this worker may edit and what other workers own.

DEPENDENCIES
Inputs/gates that must exist before completion.

OBSERVABLE ACCEPTANCE
Tests, artifacts, evidence or external observations required.

AUTHORITY / PROVENANCE
Which VOMEGA objective/task authorized the work.

HANDOFF
Result, residual risk, downstream trigger.
```

The Orca integration should adapt to this contract, not the reverse.

## 6. Topology principle

Do not encode:
- one permanent master agent;
- one harness per department;
- one account per role;
- one worktree per long-lived lane;
- mandatory frontier-model use;
- a fixed number of workers.

Instead:

```text
task requirements
   ↓
context + consequence + independence need
   ↓
current capacity / quota / latency / cost
   ↓
candidate harness + model/account
   ↓
isolated execution where needed
   ↓
evidence
   ↓
integration
```

## 7. Authority failure conditions

Orca adoption is invalid if it causes any of the following:

- provider credentials/config are mutated incidentally;
- a runtime status is treated as evidence of correctness;
- Orca state becomes the only durable record of a task;
- worker self-report replaces tests/evidence;
- the five Space Bunny lanes become a hardcoded organization chart;
- ZCode/OpenCode/Codex/Grok Build/Claude Code are forced into false equivalence;
- an Orca limitation dictates VOMEGA product architecture;
- context sessions become unreviewed canonical truth.
