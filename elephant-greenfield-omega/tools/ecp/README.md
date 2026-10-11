# ECP deterministic mock harness

Node 20+ built-in dependencies only. Run from the pack root:

```
node --test tools/ecp/ecp.test.mjs
node tools/ecp/ecp.mjs demo
```

What tests prove **in simulation**: E0 fallback, E1 basis-stamped advisory result, two distinct E2 mock nodes with contradictory findings, timeout/fallback, duplicate request idempotency, rejected unauthorized code proposal, synthetic stale epoch warning, simulated sync/rotation calibration requirement, source pack path exclusions. It also includes `gitBasis(repo, baseSha, manifestPaths)` to compute a real Git-derived changed-path list when wired by an adapter, but the demo does **not** invoke or validate that bridge. A real live provider session, actual model context flushing, OS-enforced read-only sandbox, source-citation validation, actual cancellation, durable restart journal, and true product build are **NOT implemented**. Do not treat these tests as proof those features work.

Next engineering milestones: write disk-backed journal and replay, connect Git change detector, implement a real provider-neutral adapter with tested resume/permissions, implement manifest/tokenizer and signed input validation, run T1/T2 product tasks, add two-node concurrent context freshness test with actual commits and blind graders. Do NOT promote mock green tests to E1/E2 complete.
