# Consistency, backpressure, failures, privacy and adversarial tests

## Consistency model

Canonical truth is **single-writer integration per experiment arm**, eventual cognition after verified merge. An Elephant response is consistent with its explicit `incorporated_sha`, not necessarily the current HEAD. A two-node response is a **set of separately stamped claims**, not one atomic collective snapshot. The coordinator may request a common epoch for cross-domain high-risk reviews, or flag mixed-epoch results. Consensus never overrides source/tests.

## Required fault matrix

| Fault | Detection | Required behavior |
|---|---|---|
| Elephant down/timeout | health/timeout | E0 fallback, record degraded arm |
| API rate limit | explicit error/backoff | bounded retry; no unbounded wait |
| Response duplicated | idempotency key | one logical terminal result; account for actual remote cost |
| Response out of order | correlation ID / journal sequence | match correct task and preserve ordering |
| Elephant stale on changed contract | Git-derived path delta + dependency hints | mark stale, refresh or constrain |
| Two Elephants disagree | separate findings with source anchors | disagreement record + falsifier |
| Prompt injected via source/doc | lower-trust boundary | ignore hostile instructions; no tool escalation |
| Context exhaustion | measured budget / provider error | rotate/rebuild; fallback |
| Worktree collision | path claims + Git conflict | serialize or rebase; no forced overwrite |
| Missing/failed citation | wrapper source verification | mark finding unverified or reject |
| Bad domain routing | out-of-domain detection | hand off to proper node or E0 |
| Secrets in payload | scanning + hard exclusions | fail closed and log sanitized error |
| Patch writes hidden policy | file allowlist/review | reject and quarantine |
| Provider service unavailable | adapter probe | degrade with truthfully marked partial evidence |

## Queue and cancellation

In E2, a maximum of two active Elephant nodes is a topology invariant, not a maximum number of outstanding messages. Set per-node concurrency according to measured actual session behavior; **default serialized requests per node** to avoid cross-contamination. Enforce deadline, queue length cap, max fanout=2 and consult hop limit=1. `CANCELLED` only means local cancellation was issued; remote stop is confirmed separately.

## Security footnotes

- Verify model/provider context size, pricing and retention policies before putting complete source into a third-party service; authorization required for confidential code.
- Credentials and auth configuration are read-only; do not log secrets or share one account session concurrently if unsafe.
- Respect user confirmation for external irreversible actions. No live account browser automation in the first product scope.
- Local files used as protocol input must be validated before tool invocation; robust implementations need OS isolation, not prompts alone.
- Persistent log must have bounded retention and a safe cleanup command that does NOT delete canonical source/evidence.

## Stop / rollback policy

If high-risk invariant fails (secret escape, Elephant direct main edit, untraceable merge, false proof claim), freeze corresponding arm and return to E0 without deleting evidence. Document exactly which state was restored and which outstanding requests are uncertain.
