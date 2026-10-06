# Development Agent Registration & Self-Reporting Protocol

Status: **ACTIVE LIGHTWEIGHT OPERATING RULE**
Date: 2026-10-06

This protocol applies to any development agent that performs substantive work in VOMEGA: implementation, test creation, integration, refactoring, build/release work, or independent review that may produce repository changes.

The purpose is minimal operational visibility:

> Before meaningful work begins, the project should be able to answer **who is doing what, since when, from which repository state, and roughly where they intend to write**.

This is coordination, not governance.

A registration does **not**:
- authorize the work;
- select product priority;
- grant architectural authority;
- reserve a program permanently;
- prove the work is correct;
- replace PM, Ratchet, gate/proof state, or independent review;
- imply the agent is still running after its session ends.

## 1. Minimal operating loop

Every development agent follows this loop:

1. **Self-checkout**
2. **Register**
3. **Work**
4. **Update if materially changed**
5. **Self-report and close**

Keep it small. Do not build an orchestration system around this protocol until measured coordination friction justifies one.

## 2. Self-checkout

Before registration, an agent may perform the minimum read-only inspection needed to understand repository state and formulate its claim.

At minimum inspect:

- current local HEAD;
- current `origin/main` or authoritative remote head;
- current branch/worktree;
- whether the worktree has uncommitted changes;
- current `.project/agentic-launch/STATUS.md`;
- current active claim files relevant to the intended write surface;
- the PM/Ratchet/task artifact if the work was dispatched from one.

Rules:

- If clean and simply behind, update safely before starting substantive work.
- If dirty or diverged, preserve existing work and report it; do not blindly reset/pull over someone else's changes.
- Do not alter provider/auth/model configuration as part of checkout.
- Do not treat an old claim file as proof that a worker is still alive; read its status and timestamps.

## 3. Mandatory registration

Before the first substantive repository write or implementation action, create a claim file under:

`.project/agentic-launch/claims/`

File name:

`YYYYMMDD-HHMM-<short-work-slug>-<agent-label>.md`

Use UTC when practical. Exact naming is less important than uniqueness and readability.

An orchestrator/coordinator may create the claim on behalf of a dispatched worker. The worker must verify that it accurately describes the task before proceeding.

### Required claim fields

Every active claim contains:

- **Claim ID**
- **Status**
- **Registered at**
- **Last updated**
- **Agent / harness**
- **Model**, if exposed; otherwise `unknown/router-selected`
- **Source HEAD**
- **Branch / worktree**
- **Work**
- **Program / phase / task refs**, when applicable
- **Expected write surface**
- **Expected handoff / proof**
- **Dependencies / blockers**

Keep each field short. This is not a design document.

Example:

    Claim ID: 20261006-0715-mp56-trace-contract-zcode
    Status: ACTIVE
    Registered at: 2026-10-06T07:15:00Z
    Last updated: 2026-10-06T07:15:00Z
    Agent / harness: ZCode worker
    Model: router-selected / unknown
    Source HEAD: 43dbe1e
    Branch / worktree: work/mp56/trace-contract
    Work: Implement MP56-P1 canonical trace contract and deterministic normalization tests.
    Program / phase / task refs: MP-56 / MP56-P1
    Expected write surface: omega-baseline/experimental/trace-fixture/**; targeted package scripts/tests if needed
    Expected handoff / proof: implementation commit + targeted tests + exact gaps for MP56-P2
    Dependencies / blockers: none known

## 4. Status vocabulary

Use only these lightweight states:

- **CLAIMED** — registered/dispatched, substantive work not yet begun.
- **ACTIVE** — currently being worked.
- **BLOCKED** — cannot continue without a named dependency/input.
- **PAUSED** — intentionally stopped; no active worker should be inferred.
- **HANDED_OFF** — work transferred to another explicit claim/session.
- **COMPLETE** — bounded claimed work finished and handed off.
- **ABANDONED** — claim intentionally ended without completion.

A session ending means the claim must not remain ACTIVE merely because the file was forgotten.

## 5. Write-surface rule

The expected write surface is a collision-avoidance hint, not ownership law.

Before expanding materially beyond it:

1. check active claims;
2. update the claim;
3. coordinate if the new surface overlaps another active worker.

Small incidental changes such as a package script or narrow shared type may be recorded after discovery if they do not create a conflict.

Do not use registration to lock broad directories such as `omega-baseline/**` unless the work genuinely requires that scope.

## 6. Relationship to PM, Ratchet and gates

This protocol is an operational visibility layer only.

If PM says a phase is selected, the agent should reference that phase.

If Ratchet requires a task claim, the Ratchet claim is still required.

If a proof gate requires independent review, this registration does not satisfy it.

Think of the layers as:

    PM / owner plan         → why this slice is selected
    Ratchet/task claim      → executable task/proof ownership where applicable
    Dev-agent registration → who is currently doing the work and where
    Tests/evidence/review   → whether the resulting claim is true

Do not infer one layer from another.

For Ratchet-tracked D1 work, the **session claim + Ratchet task claim are sufficient at start**. Do not also create duplicate STATUS and Commons registrations for the same short-lived task. STATUS changes only when a major slice materially changes; Commons records the material result/blocker/handoff.

A session may name a short sequential run of intended Ratchet tasks, but an implementation worker should normally hold **one active Ratchet task claim at a time**. This keeps write-surface ownership and review lineage legible without creating extra files.

## 7. Material-change update

Update the claim when any of these changes materially:

- objective;
- branch/worktree;
- major write surface;
- status;
- blocker;
- handoff target.

Do not update it for every file edit, test run, or thought.

The goal is high-level reconstructability, not activity logging.

## 8. Mandatory stop / handoff report

Before a development agent stops, it must:

1. set its claim to a non-ACTIVE terminal/intermediate state;
2. record the final commit/branch or artifact;
3. record tests/evidence actually run;
4. record known failures/blockers;
5. record the next concrete handoff;
6. append a concise handoff to `.project/COMMONS.md` when the work produced a material result or blocker.

For Ratchet/D1 work, build the closing chronicle from observed facts where practical: commit(s), files changed, probe/task state before and after, gates promoted/reviewed, failures preserved, and next action. Keep interpretation short; the claim is not a retrospective essay.

Minimum Commons handoff:

- date/time;
- claim ID;
- what was attempted;
- resulting commit/artifact;
- proof/tests actually observed;
- unresolved issue/blocker;
- next action.

Do not write “done” when only implementation landed and proof/review remains.

## 9. Commons versus claims versus STATUS

These surfaces answer different questions:

### `claims/`
Per-agent/session operational registration.

> Who is working on what right now or what happened to that specific claim?

### `agentic-launch/STATUS.md`
Compact project-level execution summary.

> Which major slices are claimed/open/blocked/complete?

STATUS need not contain every short-lived agent if that detail lives correctly in `claims/`.

### `COMMONS.md`
Durable cross-session handoff/history.

> What material result, blocker, request or handoff should the next agent know?

Do not turn Commons into a token-by-token activity stream.

## 10. Independent reviewers also register

A reviewer that performs a bounded independent gate/proof review should register a claim too.

Its write surface may be only:

- review/evidence artifact;
- gate/evidence record if authorized;
- test additions.

The reviewer must not share the implementation claim ID or masquerade as the original worker. Independence should be visible from the records.

## 11. Concurrent agents

For parallel work:

- each worker gets its own claim file;
- avoid multiple workers editing the same claim file;
- coordinate overlapping write surfaces before edits;
- use short-lived branches/worktrees when collision risk warrants it;
- merge/integrate using the project's current integration practice;
- close stale claims promptly.

A parent/orchestrator may dispatch multiple claims, but each meaningful worker unit must remain individually identifiable.

## 12. No hidden workers

If an agent or subagent performs substantive implementation or review whose output may affect the repository, it should be represented by a claim or explicitly named as a bounded subworker inside the parent claim.

Tiny ephemeral helpers that only summarize/read and produce no independent repository result do not need separate claim files.

The test is:

> Would another developer reasonably need to know that this worker is modifying, reviewing, or materially shaping repository work?

If yes, register it.

## 13. Current deliberately-light boundary

For now, do **not** add:

- a central scheduler;
- heartbeat daemons;
- automatic stale-worker killing;
- a database;
- agent leasing services;
- dashboards;
- a parallel acceleration organization or permanent role hierarchy;
- a second task/status registry;
- mandatory minute-by-minute updates;
- automatic PM decisions;
- automatic merge authority.

If this file-based protocol becomes a bottleneck, measure the friction first. Then MP-53 / MP-65 or another selected accelerator can automate the smallest proven need.

## 14. Agent start checklist

Before substantive work:

- [ ] Self-check repository/remote/worktree state.
- [ ] For D1, read the bounded execution directive and use the Ratchet packet as the default context bundle.
- [ ] Read current STATUS and relevant active claims.
- [ ] Read the assigned PM/Ratchet/task source if applicable.
- [ ] Create or verify my claim file.
- [ ] Record source HEAD and intended write surface.
- [ ] Only then begin substantive work.

Before stopping:

- [ ] Update claim state.
- [ ] Record commit/artifact and actual tests/evidence.
- [ ] Record blocker/uncertainty honestly.
- [ ] Add material Commons handoff.
- [ ] Make clear whether any worker remains active.

This protocol should stay cheaper than the coordination failures it prevents.
