# DESK — cross-thread message board (contract)

Owner of this infrastructure: the DEVops thread. Every team thread reads this file.

## Topology

- **CoS (Chief of Staff) thread** sends directives and receives replies. It never edits code.
- **Team threads** (devdrain, devops, pm, council) do their work in their own threads.
- **These files plus git are the only cross-thread channel.** ZCode cannot push a message
  into another conversation; each team thread polls its own inbox via its own recurring
  automation (one automation per thread).

## Checkout

Absolute path: `C:\0-BlackBoxProject-0\VOMEGA` (Git Bash: `/c/0-BlackBoxProject-0/VOMEGA`).
Never use the orca worktree.

## Files and ownership (one writer per file → no locks)

| File | Written only by |
| --- | --- |
| `inbox/<team>.jsonl` | CoS |
| `replies/<team>.jsonl` | that team |

Teams: `devdrain`, `devops`, `pm`, `council`. Append with `>>` only; never rewrite,
reorder or truncate a JSONL file. One JSON object per line.

## Directive schema (inbox lines)

```json
{"id":"D-20261007-001","ts":"<UTC ISO>","from":"cos","to":"<team>","priority":"P1|P2|P3",
 "deadline":"<UTC ISO|null>","reply_expected_by":"<UTC ISO|null>","subject":"...",
 "directive":"<full text>","evidence_required":["..."],"supersedes":"<id|null>"}
```

Id rule: `D-<YYYYMMDD>-<NNN>` where NNN = (line count of that inbox before appending) + 1,
zero-padded to 3.

## Reply schema (replies lines)

```json
{"id":"R-<YYYYMMDD>-<NNN>-1","in-reply-to":"<directive id>","ts":"<UTC ISO>","team":"<team>",
 "status":"DONE|BLOCKED|PARTIAL|NACK","result":"...",
 "evidence":[{"path":"...","observed":"..."}],"blockers":[],"claim":"<claim file>","commits":["<hash>"]}
```

| Status | Meaning |
| --- | --- |
| DONE | directive fully executed; evidence attached |
| PARTIAL | some of it done; remainder and reason stated |
| BLOCKED | could not proceed; `blockers` says on what/whom |
| NACK | wrong, owner-reserved or out of lane — say why; never retried |

## Idempotence

A directive is processed ⇔ its `id` appears as `"in-reply-to"` in that team's replies
file. Process each directive exactly once; exactly one reply line per directive.
A newer directive that `supersedes` an older one does not erase the older line.

## Warnings

- Never `git clean -fd`, `git stash`, `git reset --hard` or `git checkout -- .` while team
  threads are live — the tree holds other threads' in-flight changes.
- Stage only your own paths; never `git add -A` on a shared tree.
- Push/merge to GitHub, auth, spend and provider/model configuration are Owen-owned.
