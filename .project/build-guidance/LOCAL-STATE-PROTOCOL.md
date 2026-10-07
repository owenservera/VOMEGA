# Local State Protocol

Status: **ACTIVE LIGHTWEIGHT BRIDGE TO DAILY BUILD GUIDANCE**

The daily reviewer can inspect GitHub but cannot see an unpushed Windows worktree. This protocol provides one compact bridge without creating a second task tracker.

## Roles

### Ordinary development workers

Continue using:
- the existing development-agent claim;
- Ratchet task claim when applicable;
- normal branch/worktree;
- proof/tests/review.

Do **not** maintain a second per-agent status system.

### Local controller / orchestrator

One local controller that can see the VOMEGA worktrees publishes a compact aggregate snapshot to:

- branch: `ops/local-state`
- path: `.project/build-guidance/local-state.json`

The snapshot is observational only. It does not authorize, prioritize, merge, kill or reassign work.

## When to publish

Publish when practical:

- at the start of the local build day;
- after a material dispatch/fan-out change;
- when a worker becomes materially blocked;
- after a significant merge/integration;
- before the local controller stops.

Do not publish minute-by-minute heartbeats.

A snapshot older than 24 hours is considered **stale** for daily guidance and should be labeled as such.

## Snapshot fields

Use the schema in `local-state.schema.json`.

Minimum useful content:

- generatedAt;
- observer/controller identity;
- repository root and observed `origin/main`;
- each visible worktree:
  - path;
  - branch;
  - HEAD;
  - clean/dirty;
  - ahead/behind when known;
  - last commit timestamp;
  - claim IDs/statuses visible in that worktree;
  - current task/program refs when recoverable;
  - blocker;
  - next concrete action;
- explicit list of local-only/unpushed risks;
- commands actually run for Ratchet/PM/tests, with exit status if observed.

Do not include secrets, tokens, provider credentials, prompt contents from private services, or large logs.

## Publishing rule

The local-state branch is a **telemetry branch**, not an integration branch.

- never merge `ops/local-state` into `main`;
- never use it as source code authority;
- only the snapshot path should change there;
- rewrite/update it freely as current telemetry;
- Git history is enough for prior snapshots.

If the local controller cannot publish, local work continues; the daily reviewer must then mark local visibility as LOW confidence rather than inventing state.

## How daily guidance uses it

The reviewer compares:

```
local worktree HEAD/claims
        ↕
remote branches/PRs
        ↕
main + Ratchet + PM + proof
```

Typical useful findings:

- "worker is active locally but branch was never pushed";
- "remote says task open, local agent already has a green gate but has not promoted/pushed";
- "two local worktrees overlap the same write surface";
- "main advanced under a long-running worker";
- "agent is implementing a downstream task that its dependency still blocks";
- "local worker stopped but claim remains ACTIVE."

The correction should normally be the smallest one: push, rebase, review, promote, release a stale claim, or reassign to the current critical frontier.
