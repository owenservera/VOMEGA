# WRITING_AND_TRUTH — who writes code, who decides what is true

**Status:** policy `DESIGN`; the epoch guard, escrow and authorship checks are `SIMULATED_TEST` (F21–F24).

## 1. Truth hierarchy

1. **Arm main at epoch K** + the test results and evidence bundles that admitted each commit.
2. **Journal** — what was asked, of whom, on which basis, what came back, what was accepted.
3. **Approved notes** — only because they are committed into the repo and re-verified each epoch.
4. **Elephant output** — always `authority: advisory_unverified`, including VERIFIED citations.

Consensus between nodes never moves anything up this list. A disagreement is resolved only by a test or a source read recorded as evidence.

## 2. Authority matrix (enforced vs procedural)

| Actor | Read product | Generate patch text | Write files | Run tests | Approve | Advance main | Enforced by |
|---|---|---|---|---|---|---|---|
| Worker | own worktree @ base | yes | **own worktree only** | own sandbox | no | no | worktree ownership (procedural) + path claims |
| Elephant | its capsule | **only via PROPOSE_PATCH, into escrow** | **never** | never | **never** | never | no write tools + OS isolation (§6); kernel rejects Elephant as reviewer (F24) |
| Reviewer | all | findings only | own review worktree | yes | yes | no | kernel: reviewer ≠ worker, ∉ patch_authors, ∉ elephants (F24) |
| Integrator | all | conflict resolution only | integration workspace | yes | – | **yes** | fenced lease + fast-forward-only (F24) |
| Coordinator | metadata | no | no | dispatch only | no | no | procedural |
| Switchboard | Git objects | no | escrow dir + journal only | no | no | records only | code (F21: worktree clean after hostile response) |

## 3. Worktree lifecycle

```
TASK_ASSIGNED(task, worker, base=arm main K)
  git worktree add ../wt/<task>-<worker> -b task/<task>-<worker> K     # illustrative; verify on machine
  path-claim lease (coordinator; advisory, monotonic expiry)
  … consult (optional) · edit · test …
  submit: diff (K..head), evidence bundle (§7)
  reviewer in separate worktree → verdict
  integrator: lease → rebase onto current main if needed → re-run tests → FF → acceptCommit → release
  worktree removed after acceptance or abandonment (preview first; never force-delete with uncommitted work)
```
Rules: one writer per worktree; no shared mutable paths between worktrees; `git status --porcelain` empty and base SHA re-checked before integration; stale patches are rebased **and re-tested**, never force-applied. Branches are task-scoped and deleted after integration — no departmental branches.

## 4. Code-writing regimes (H4)

| Regime | Who writes | Elephant output | Default? |
|---|---|---|---|
| **W** | worker | consult/review findings | **yes** |
| **P** | worker applies Elephant diff from escrow | diff as data → escrow → worker → reviewer | opt-in per task (`patch.allowlist`) |
| **R** | Elephant session acts as a worker in a disposable worktree | n/a | **not in v0.2.** Only as a separately labelled experiment after W/P data exists; the session is rotated afterwards and cannot serve as an Elephant for that task's review. |

Regime P mechanics (✔ F22): the switchboard validates the diff (allowlist, protected paths, binary/mode/symlink/rename, added-line secrets, size), runs `git apply --check` against a **temporary index** at the worker's base (no worktree touched), stores it content-addressed with a `wx` write (immutable), and returns `ESCROWED_UNVERIFIED`. The worker decides to apply. Attribution follows the diff: `patch_authors` is carried into `COMMIT_ACCEPTED`, so "did the Elephant patch survive?" is answerable from the journal.

Protected by default: tests, CI, `ecp/**` (manifests, registry), `package.json`, `Cargo.toml`, `tauri.conf.json`. A patch touching them needs `scope_protected: true`, which is an operator decision per task.

## 5. Integration semantics

* Single linear `main` per arm; fast-forward only; one lease holder at a time; every acceptance carries the current fencing token. A stale token (integrator that lost the lease and came back) is refused.
* `acceptCommit` requires `head_sha = sha`, `tests_passed = true`, worker, reviewer, reviewer independence. The *content* of the tests is not the kernel's business; the evidence bundle's `test_artifact` hash makes it auditable.
* Each acceptance emits the epoch event that drives reconciliation; **uncommitted or rejected work never reaches a capsule** (capsules read commit blobs).
* Merge conflicts: the losing task rebases and re-tests; if both touched a contract, the coordinator freezes the interface or serializes the tasks; both E2 nodes rebuild after the winning commit.

## 6. Making "read-only" real for Elephants (not prompt text)

Ranked options for Windows, cheapest first; an Elephant may only run in a harness where one is **verified**:

1. **No-tool invocation**: call the model through an API or a harness mode that exposes no file/shell tools at all (PREFIX via API is the simplest). Verification: request a file write in the prompt; confirm no tool call is possible (harness reports no tools) and `git status` is unchanged.
2. **Harness permission mode** that denies edit/bash tools. Verification as above plus attempt a denied tool and capture the denial in the harness log. *Flag names are unverified until probed locally.*
3. **Separate Windows user** without write ACL on arm directories, running the harness against a **read-only export** of the capsule (not the repo). Verification: `icacls` shows no write; attempted write fails.
4. **Windows Sandbox / container** with only the capsule mounted read-only.

If none can be verified for a harness, that harness is **not used as an Elephant** (pack rule, kept).

## 7. Evidence bundle (one per accepted change)

```json
{
  "schema": "omega-evidence-v0.2", "arm": "e1", "task_id": "T2", "replication_id": "rep-1",
  "worker": "worker:w1", "worker_harness": "unknown", "worker_model": "unknown",
  "base_sha": "…", "head_sha": "…", "integration_commit": "…", "diff_sha256": "…",
  "changed_paths": ["product/exec/fanout.ts"],
  "test_commands": ["node --test product/exec"], "test_artifact_sha256": "…", "tests_passed": true,
  "reviewer": "reviewer:r1", "review_verdict": "approve", "review_findings_resolved": 2,
  "patch_authors": [], "escrow_ids": [],
  "ecp_requests": ["r-t2-0001", "r-t2-0002"], "elephant_findings_acted_on": ["r-t2-0001/f-1"],
  "disagreements": [], "fallbacks": 0, "manual_edits": true,
  "timestamps": { "assigned": "…", "first_correct_edit": "…", "submitted": "…", "accepted": "…" },
  "unresolved_risks": [], "claim_level": "PRODUCT_ACCEPTED"
}
```
No credentials, no raw prompts; prompts are referenced by request id and live in the local journal under retention policy.

## 8. Human control points

The owner decides, before the relevant gate: transmitting source to a provider; which harnesses may host Elephants; whether regime P is allowed and with which allowlists; `scope_protected` exceptions; worker concurrency; resource caps; who reviews; promotion of notes; any change to manifests or the contract registry; and any G4 promotion. The coordinator may pause an arm at any time; any high-risk invariant breach (secret in a capsule, Elephant write, untraceable merge, false proof claim) freezes the arm and reverts it to E0 operation without deleting evidence.
