# ORCA-BOOT-01 — staged execution-substrate proof

**Baseline:** Orca v1.4.220  
**Status:** not executed.

## Purpose

Validate that Orca can become VOMEGA's current heterogeneous execution control plane **on Owen's real Windows machine** without turning runtime status into project truth or damaging existing harness/provider configuration.

A successful install is not acceptance.

## Prerequisites

- Orca v1.4.220 running;
- VOMEGA registered;
- Agent Permissions = Manual;
- disposable worktree create/remove proven;
- Claude, Codex, Grok Build and OpenCode individually probed;
- separate TUI-capable standalone ZCode CLI proven outside and inside Orca;
- sanitized before-state for relevant auth/config files;
- Experimental orchestration enabled only after basic harness launch proof.

## Stage A — runtime truth

Pass if:
- `orca status --json` works;
- repo/worktree IDs are stable enough for commands;
- worktree create/show/remove works;
- commands operate on the expected host/repo;
- no repo/history damage.

## Stage B — five harness probes

Each harness must complete one bounded task through Orca:

| Harness | Minimum proof |
| --- | --- |
| Claude Code | launch → task → observable result |
| Codex | launch → task → observable result |
| Grok Build | launch → task → observable result |
| OpenCode | launch → task → observable result |
| ZCode | **TUI-capable CLI** launch → task → observable result |

For each record:
- executable/path/version;
- harness;
- model/router/account only when actually observable;
- worktree;
- permissions;
- outcome;
- evidence.

## Stage C — pairwise parallel writers

Run at least two simultaneous isolated writers.

Pass if:
- they edit separate worktrees/write sets;
- no prompt/session crossover;
- results are independently inspectable;
- each worker's provenance is reconstructable.

## Stage D — supervised two-worker Run

Use Orca structured orchestration.

Required:
1. `run-create`;
2. at least two Tasks;
3. at least one real dependency or explicit independence;
4. two Dispatches on different harnesses;
5. a worker question via Orca ask/reply;
6. a heartbeat or equivalent liveness observation;
7. one successful `worker_done`;
8. one deliberate failed `worker_done`;
9. coordinator processes both;
10. workers retained/released deliberately.

This proves lifecycle semantics before full fan-out.

## Stage E — nested-agent provenance

At least two different harnesses use an internal subagent/team mechanism.

Pass if:
- Orca still has exactly one top-level Dispatch owner per parent task;
- child work is summarized by the parent;
- final files/evidence are attributable;
- no child silently claims a separate top-level VOMEGA task.

Claude Agent Teams are **not required**. Ordinary subagents are sufficient.

## Stage F — full heterogeneous campaign

Use one real but bounded VOMEGA objective with tasks matched to harness strengths.

All five harness families participate in the same campaign.

Required behaviors:

### 1. Self-contained Tasks
Each has:
- target;
- change;
- constraints;
- ownership;
- dependencies;
- acceptance;
- provenance;
- handoff.

### 2. Real dependency
At least one task is blocked on another task or a decision gate.

### 3. Independent review
At least one meaningful artifact is reviewed by a different harness/worker.

### 4. Context consultation
At least one worker uses a Context Bundle or retained context/Elephant experiment.

### 5. Failure/escalation
At least one controlled failure/blocker is surfaced explicitly.

### 6. Fan-in
Coordinator either:
- produces coherent integration + evidence;
- or refuses integration with a precise blocker.

### 7. Config integrity
After campaign:
- compare auth/provider/config state to before-state;
- distinguish normal runtime bookkeeping from material reconfiguration;
- no secrets entered Git;
- historical provider lanes were not silently rewritten.

## Acceptance

ORCA-BOOT-01 passes only if all are true:

1. VOMEGA remains authority.
2. All five harness families work through Orca in the proven integration mode.
3. ZCode uses a TUI-capable standalone CLI, not a falsely assumed desktop bundle.
4. Cross-harness Task/Dispatch ownership is unambiguous.
5. Concurrent writes are isolated.
6. dependency/gate behavior is visible.
7. worker questions/failures are surfaced.
8. completion requires explicit lifecycle outcome plus VOMEGA acceptance evidence.
9. nested harness agents preserve parent Dispatch provenance.
10. independent review works.
11. fan-in is reconstructable.
12. no material auth/provider configuration damage occurs.
13. Owen can understand which workers are running, blocked, reviewing and settled from Orca plus durable repo state.
14. concurrency/resource use is acceptable on the actual machine.

## Failure taxonomy

Record failures as:
- Orca stable limitation;
- Orca bug;
- stable-vs-main gap;
- Windows limitation;
- harness integration limitation;
- TUI/session limitation;
- provider/account limitation;
- VOMEGA task-design problem;
- permission/sandbox problem;
- resource/concurrency problem.

Do not lower the acceptance criterion silently. Change the design explicitly.
