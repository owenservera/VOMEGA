# Writing code, worktree ownership, patch proposals, review, integration

## Position

Elephants generally **think/review**, workers **write/test**. We should separately test whether Elephant-generated code improves outcomes when the session already holds rich context. Do not solve code authorship by giving Elephants silent access to main.

## Permissions (default)

| Actor | Inspect product files | Generate patch text | Write worker files | Execute tests | Merge to main |
|---|---|---|---|---|---|
| Owner | Yes | Yes | Via normal workflow | Yes | Yes |
| Coordinator | Read metadata / as authorized | No | No | Can dispatch | No direct autopromote |
| E0 worker | Own worktree | Yes | **Own only** | Own sandbox | No |
| E1/E2 worker | Own worktree | Yes | **Own only** | Own sandbox | No |
| Elephant | Approved domain snapshot | **Optional candidate only** | **Never by default** | Read-only simulated/analysis only | Never |
| Independent reviewer | Read and inspect | Findings / proposed fix | Separate review worktree if assigned | Yes | Approves for owner/integrator |
| Integrator | All reviewed diffs | Can resolve conflicts | Integration workspace | Yes | Yes per approved policy |

## Worker path

`TASK_ASSIGNED` → isolated worktree from arm main base → optional `ECP_ASK/REVIEW` → coding → local tests → full diff/README and test artifacts → Elephant impact review (optional) → independent human/agent tests → integrator fast-forward/cherry-pick under serialized main lease → post-merge checks → publish `COMMIT_ACCEPTED` epoch event.

Worktrees are **short-lived task isolation**, not enduring departmental branches. Main has one consolidation line **per experiment arm**; do not mix E0/E1/E2 main while benchmarking. Avoid shared mutable paths across worktrees. Run `git status --porcelain` and verify base SHA before application/merge. Stale patches must be rebased and re-tested rather than force-applied.

## Elephant-authored patch path (optional test)

1. Worker issues `PROPOSE_PATCH` with `allow_code_proposals=true`, file allowlist, base SHA, desired invariant, tests and risk.
2. Elephant returns **candidate diff as data**, not filesystem mutations. Wrapper rejects paths outside allowlist, path traversal, symlink escapes, binary/sensitive assets, oversized diffs and patches altering policy, tests or CI without explicit scope.
3. Worker reviews candidate, chooses apply or reject in its own disposable worktree; independent validation checks tests and behavior.
4. Reviewer must differ from patch author. Only integrator advances main. Record Elephant attribution and that model-generated patch did/did not survive.
5. If the provider/harness makes true read-only impossible, do not run an Elephant in that harness until OS-level isolation is installed and verified.

## Merge conflicts and simultaneous tasks

Coordinator allocates file/path claim leases as **advisory scheduling**, backed by actual Git merge conflict detection; leases expire with monotonic deadline and are not authority to overwrite files. Disjoint work may proceed concurrently; connected contract changes require explicit serialization or an interface freeze. When two workers touch same contract, isolate, choose a winning patch, rebuild/rebase losing work, rerun impacted tests and update both Elephants after accepted merge.

## Committed-source rule

No Elephant reconciliation of raw worker branch code. Worker prototypes can arrive as *transaction artifacts* for review only. The canonical epoch advances only on accepted main commit with test evidence. This protects resident knowledge from abandoned experiments.

## Evidence bundle for every accepted code change

`task_id`, `experiment_arm`, `worker_id`, `harness/model`, `base_sha`, `head_sha`, `changed_paths`, `diff_sha`, `test_commands`, `test_results`, `independent_reviewer`, `integration_commit`, `timestamps`, `elephant_requests_used`, `resolved_findings`, `unresolved_risks`, `manual_edits`. Include no credentials or raw secrets.

## Explicitly test competing code-writing regimes

- W: worker-only implementation; Elephant consult/review.
- P: Elephant generates patch suggestion, worker applies/tests.
- R: Elephant used as direct worker in disposable worktree (experimental violation of default separation) with complete context rotation afterwards and extra costs reported. No dual-use claim without comparing resident-quality decay.

A version that merely generates more code but increases defects or revision costs loses.
