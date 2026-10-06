# ORCA-BOOT-01 — execution substrate proof

**Status:** proposed acceptance test; not yet executed.

## Purpose

Prove the thing VOMEGA actually needs from Orca:

> one bounded VOMEGA objective can be decomposed, routed across heterogeneous agent harnesses, executed safely in parallel, reviewed, evidenced and integrated without Orca becoming project truth or disturbing existing provider configuration.

A successful install or a screen full of agents is **not** acceptance.

## Test shape

Use one real but bounded VOMEGA task set with independent enough write surfaces to permit meaningful fan-out.

The proof should exercise all five harness families at least once:

- ZCode
- OpenCode
- Codex
- Grok Build
- Claude Code

The exact task assigned to each should be chosen from capability fit rather than artificial symmetry.

## Required behaviors

### A. Decomposition

A coordinator function produces bounded task contracts containing:
- target;
- change;
- constraints;
- ownership;
- dependencies;
- observable acceptance;
- authority/provenance;
- handoff requirements.

### B. Isolation

At least two simultaneous writing workers operate without unsafe shared-checkout collision.

Expected default: disposable worktrees/workspaces where needed.

### C. Heterogeneous dispatch

All five harness families complete at least one bounded probe/task in the same overall run or controlled proof campaign.

Record:
- harness;
- account/router/model when observable;
- start/end/outcome;
- evidence.

### D. Dependency

At least one task cannot complete until another task's artifact/evidence exists.

The dependency must be visible and respected rather than handled only through human memory.

### E. Question / escalation

At least one worker raises a blocking uncertainty or failure and the system routes it to the appropriate coordinator/owner/reviewer rather than silently guessing.

### F. Independent review

At least one consequential artifact is reviewed by a worker/harness that did not author it.

### G. Context consultation

At least one task uses a bounded Context Bundle or Elephant-style retained context consultation.

The advisory output must not be accepted merely because it came from a large-context session.

### H. Explicit completion

Completion means:
- artifact exists;
- required evidence exists;
- acceptance checks are evaluated;
- handoff is durable.

Agent prose like “done” is insufficient.

### I. Fan-in

The run produces a coherent integration result or a precise refusal to integrate with blockers stated.

### J. No configuration damage

Verify after the run:
- existing ZCode/OpenCode/Codex/Grok Build/Claude Code auth/provider settings were not silently rewritten;
- symbolic account routes remain intact;
- no secrets entered the repository.

## Acceptance criteria

ORCA-BOOT-01 passes only if:

1. VOMEGA remains the authority surface.
2. Five harness families are evidenced as usable through the chosen Orca operating pattern.
3. Concurrent writes are isolated safely.
4. Dependency ordering works.
5. worker uncertainty/failure is surfaced.
6. independent review occurs.
7. explicit evidence, not self-report, decides completion.
8. fan-in produces a reconstructable result.
9. no provider/auth configuration is damaged.
10. the operator can see enough state to understand what is running, blocked, reviewing and complete.
11. the proof is reproducible from committed docs plus sanitized observations.

## Failure is useful

If Orca cannot satisfy an item, classify the cause:

- Orca lacks the primitive;
- adapter/configuration missing;
- harness limitation;
- Windows limitation;
- repo/process limitation;
- provider/account limitation;
- task design error.

Do not hide a failed requirement by weakening the acceptance criterion after the fact. Revise the architecture explicitly if the evidence shows a better design.
