# VOMEGA Drift Assessment

Status: **ACTIVE DAILY ASSESSMENT METHOD**

Purpose: detect the smallest high-value correction that keeps build activity aligned with owner-selected intent, executable proof and current repository truth.

Drift is not "difference from a static plan." VOMEGA is allowed to evolve. Drift exists when **observed work, proof, coordination or repository state diverges from the current authoritative/selected surfaces in a way that wastes build capacity, hides risk, or delays evidence**.

## 1. Comparison layers

Every assessment compares five layers separately:

1. **Intent** — current owner-selected mission/scope/build plan.
2. **Execution** — claims, worktrees, branches, open tasks and actual code changes.
3. **Proof** — tests, Ratchet gates, PM gates, review and evidence.
4. **Integration** — what is on `main`, what is only on branches/local worktrees, and what is stale/diverged.
5. **Projection** — SITREP, boards, generated PM views and handoff surfaces.

Never collapse these into one progress percentage.

## 2. Drift classes

### D-A — Mission / scope drift
Work is outside the current owner-selected mission, PM-managed scope, or explicit build slice.

Examples:
- a worker starts a new meta program;
- live Provider work begins while D1-only constraints apply;
- an agent changes product semantics without a D4/D5 design trigger.

### D-B — Critical-path drift
Available capacity is spent away from a materially more valuable unblocked dependency.

Examples:
- low-leverage polish while a task that unlocks dozens of downstream gates remains open;
- MP21-G3 awaits review while dependent acceleration work is blocked.

### D-C — Proof drift
Implementation/artifacts exist but proof state has not caught up, or proof claims outrun observed evidence.

Examples:
- code-map exists but its Ratchet artifact gate remains open;
- implementation is "verified locally" but independent review is still absent;
- a green generated suite is mistaken for semantic completion.

### D-D — Projection drift
Generated/status surfaces describe an older repository state or disagree with source truth.

Examples:
- Ratchet board probe HEAD differs materially from current `main`;
- generated PM view is stale;
- SITREP says an artifact is complete while task state says it is missing.

### D-E — Integration drift
Useful work exists off-main, in stale branches, or only locally without an explicit integration path.

Examples:
- branch is ahead and forgotten;
- worktree has commits not pushed;
- a merged branch is kept as if active;
- local changes are invisible to the daily reviewer.

### D-F — Coordination drift
Claims, write surfaces or agent assignments are stale, overlapping or misleading.

Examples:
- an ACTIVE claim has no corresponding live worker;
- two agents are changing the same critical file without coordination;
- an agent is running but has no claim;
- a blocked worker continues consuming capacity.

### D-G — Architecture / duplication drift
Work creates a second source of truth or duplicate subsystem instead of reusing the selected/proven mechanism.

Examples:
- second interpreter instead of harvesting `vivim-nlcl-pure`;
- second Reflection parser instead of using MP-21;
- second task tracker beside Ratchet.

### D-H — Evidence-quality drift
The project is producing activity without stronger falsifiers, tests, replay, review or external observation.

Examples:
- repeated docs/PM cleanup after acceptance is already stateable;
- many commits with no movement in proof state;
- gate weakened to make progress appear green.

### D-I — Local/remote visibility drift
The local machine and GitHub tell materially different stories.

Examples:
- local agents are active but remote claims/branches show no work;
- remote branch is old while local HEAD moved;
- unpushed dirty work could be lost or duplicated.

## 3. Severity

Use four severities:

- **S0 INFO** — difference is expected; no correction needed.
- **S1 WATCH** — small divergence; monitor or fold into normal work.
- **S2 CORRECT** — likely wasting capacity or obscuring proof; correction should enter today's plan.
- **S3 STOP** — risks invalid work, duplicated architecture, false proof, destructive integration or violation of owner boundaries. Stop the affected lane before continuing.

Severity is based on **cost of continuing wrong**, not on how visually large the diff is.

## 4. Confidence

Every material drift finding gets a confidence:

- **HIGH** — directly observed from source/Git/proof machinery.
- **MEDIUM** — strong inference from multiple current surfaces.
- **LOW** — likely but missing local/runtime evidence.

Never silently upgrade LOW/MEDIUM inference into fact.

## 5. Build-guidance ranking

After drift detection, rank candidate actions by:

```
guidance leverage
= dependency unlock
× proof gain
× user-visible/product relevance
× reversibility
÷ collision/risk/cost
```

This is a qualitative decision aid, not a permanent numeric score.

Prefer, in order:

1. regressions or S3 drift;
2. stale/mismatched proof that can cheaply be reconciled;
3. critical-path tasks that unlock many blocked tasks;
4. independent review that unlocks downstream programs;
5. disjoint parallel frontier work;
6. maintenance/cleanup only when it removes an observed blocker.

Do not create work merely to occupy idle agents.

## 6. Daily assessment procedure

### A. Establish current truth
Read current `main` HEAD and commits since the prior review. Inspect open PRs and all non-main branches.

### B. Reconcile local state
Read `ops/local-state:.project/build-guidance/local-state.json` when present and fresh. Compare local worktrees/claims/dirty state/last activity to remote branches and current claims.

### C. Reconcile executable state
For D1, inspect Ratchet board/evidence/probe provenance. For the selected accelerator programs, inspect PM build plan, evidence events and gate state.

### D. Detect drift
Evaluate D-A through D-I. Do not report categories with no meaningful finding.

### E. Find the leverage frontier
Identify:
- one critical-spine action;
- any review/proof action that cheaply unlocks work;
- up to two disjoint fan-out actions that will not collide.

### F. Produce dispatch guidance
Give no more than three primary dispatch cards unless the owner asks for a full fan-out plan.

## 7. Daily report shape

### Build state
- current HEAD and time window;
- commits/PRs/branches/local worktrees that changed;
- proof delta, not just code delta.

### Drift
For each material item:

```
[severity] [class] finding
Expected:
Observed:
Why it matters:
Correction:
Confidence:
```

### Build guidance
Three maximum:

```
1. <task/lane> — <agent type>
Why now:
Write surface:
Stop when:
Proof:
Collision/dependency:
```

### Owner decisions
Only list decisions that genuinely block consequential work. Do not turn ordinary implementation choices into owner escalations.

## 8. Anti-metrics

Do not use these as progress by themselves:

- number of commits;
- lines changed;
- number of agents;
- docs produced;
- "green" test command without understanding expected failures;
- claims marked COMPLETE;
- branch count.

Preferred signals are:
- red → green falsifier;
- gate promoted/reviewed;
- blocker removed;
- dependency unlocked;
- replay/evidence strengthened;
- integrated user-relevant behavior;
- uncertainty retired.
