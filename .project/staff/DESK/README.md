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

Existing teams: `devdrain`, `devops`, `pm`, `council`. The optional product-loop lanes `execution`, `semantic`, `visual`, `sim-a`, `sim-b`, `evidence`, `provider-lab`, `windows` are registered in [the lane roster](../../../zcode-setup/product-loop-lanes.json). Registration does NOT mean that a thread or automation has started.

For each additional lane, CoS is the sole writer of `inbox/<lane>.jsonl` and the team is sole writer of `replies/<lane>.jsonl`. New teams write only `status/<lane>.jsonl`; the original shared `status/board.jsonl` remains a legacy feed that new teams must not append to. CoS may read all status files. `node zcode-setup/init-product-loop.mjs --apply` creates missing empty files only; never truncates live logs. [Launch guide](../../../zcode-setup/PRODUCT-LOOP-LAUNCH.md) and [operating design](../PRODUCT-LOOP.md) describe the boundaries.

Append with `>>` only; never rewrite,
reorder or truncate a JSONL file. One JSON object per line.

## Directive schema (inbox lines)

```json
{"id":"D-20261007-001","ts":"<UTC ISO>","from":"cos","to":"<team>","priority":"P1|P2|P3",
 "deadline":"<UTC ISO|null>","reply_expected_by":"<UTC ISO|null>","subject":"...",
 "directive":"<full text>","evidence_required":["..."],"supersedes":"<id|null>"}
```

Pacing: every directive is processed **the moment it is seen**, as fast as the work
allows. `deadline` and `reply_expected_by` are **optional overdue alarms, never
schedules** — nobody waits for, schedules toward, or defers to them; CoS normally sends
them as `null`. `priority` only orders work when several directives are pending.

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

## Parsing rule (malformed lines)

Readers MUST parse JSONL **one line at a time** and **skip** any line that fails to
parse — note it in your reply or log, never act on it. Because files are append-only,
a malformed line stays forever; the fix is a new directive whose `supersedes` names the
bad id (e.g. `D-20261007-003` supersedes the malformed `D-20261007-002`). The
ChiefOfStaff validates every line with a JSON encoder before appending; teams do the
same for their replies.

## Idempotence

A directive is processed ⇔ its `id` appears as `"in-reply-to"` in that team's replies
file. Process each directive exactly once; exactly one reply line per directive.
A newer directive that `supersedes` an older one does not erase the older line.

## Warnings

- Never `git clean -fd`, `git stash`, `git reset --hard` or `git checkout -- .` while team
  threads are live — the tree holds other threads' in-flight changes.
- Stage only your own paths; never `git add -A` on a shared tree.
- Push/merge to GitHub, auth, spend and provider/model configuration are Owen-owned.
