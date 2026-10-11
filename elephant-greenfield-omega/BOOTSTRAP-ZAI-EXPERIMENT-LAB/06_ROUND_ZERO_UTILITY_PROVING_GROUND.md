# Round 0: Utility Proving Ground — The System Must Build and Test Its Own Tools

**Round 0 is a real engineering round, not a planning workshop.** The four arms below must be dispatched into four proven separate agent execution contexts and write/execute a small, testable utility slice each. All begin from a frozen common seed and the same minimal control surface. The purpose is to establish the essential utilities before running E1/E2 experiments. The tested utilities may be merged on main only after independent proof; experiments themselves must be isolated.

## R0-A1 — Isolation and launcher proof (Master A)

Theory: genuine child-agent identity and workspace isolation can be enforced with a thin orchestrator and verified objectively. Build a minimal launcher/adapter for the available environment; spawn a real child that receives a task, reads only a permitted workspace and writes a harmless tagged artifact, then capture its session ID, parent ID, process/runtime identity if available, start/stop times and artifacts. Challenge by attempting to read a sibling-only canary file and write outside its permitted directory. Fail if contamination or undisclosed shared conversation occurs. Verify two children are alive simultaneously; aim for all four.

**Pass:** independent context, run and workspace identities; separate outputs; denied cross-workspace access; traceable parent/child links; reproduced overlap evidence. A single model request masquerading as four roles fails.

## R0-A2 — Token, cost and event telemetry proof (Master A)

Theory: source-grounded telemetry can be captured per model call and attributed to an experiment arm without requiring invasive scraping. Create the minimum instrumented call wrapper and event journal, with separate `run`, `arm`, `session`, `parent`, `turn` and `call` identities. Record provider-reported prompt/completion/cached/reasoning tokens when available; record model/provider and event timestamp. Prove actual call counts reconcile with totals and distinguish provider measurement from estimates. Correlate task events with test outcomes and elapsed wall time. Privacy filter logs by default.

**Pass:** real executed model calls; auditable raw usage where exposed; estimated versus measured flag for every metric; no claims of exact cost if model pricing/usage absent; aggregate ledger balances; a basic visible dashboard or report.

## R0-B1 — Git epochs, contexts and flushing proof (Master B)

Theory: an Elephant-like contextual view can be deterministically reconstructed from a manifest plus source snapshot and verified delta rather than depending on a fragile permanent chat. Build a minimal manifest/snapshot/hash and ledger, then execute a real model consultation against a versioned source domain. Apply a verified change in a disposable branch/worktree, show a mechanically determined stale warning before refresh, and demonstrate a flush/rotate/rebuild operation that retains critical invariants without retaining disposable conversation clutter.

**Pass:** reproducible epoch hash and source anchors; stale response flagged from Git, not model self-report; clean reset with recovery proof; no promotion of unmerged proposal to trusted memory.

## R0-B2 — Full-stack dogfood dashboard and deterministic proof (Master B)

Theory: the execution lab becomes more reliable when it must explain itself through an actual running UI and tests from the first round. Build the smallest functional full-stack lab cockpit: create a round, register exactly four arms, display child identities and event/tokens status, attach a test artifact and show passed/failed/unknown truthfully. Include a backend persistence test, UI/browser interaction test, and proof the displayed data came from the stored ledger rather than constants or screenshots. If the hosted platform lacks required back-end controls, document a live external execution adapter rather than mocking subagents as real.

**Pass:** running application with persisted round and event data, real API/database round-trip, browser-visible audit trail, and restart/reload consistency.

## Sequence and prerequisite handling

Before dispatch, the top-level agent may build an **ultra-thin bootstrap**: read-only seed inventory, isolated workspace allocation, unique IDs, and a durable trace destination. This must be simple enough to produce independently of the experiments and is itself audited. Then launch A1/A2/B1/B2 in four distinct child contexts. If prerequisites are missing, record the first genuine attempt/failure and repair the executor; re-run the four arms from fresh contexts, never reclassify a failed unexecuted arm as successful.

The four tasks probe different theories and produce mergeable utilities. One master may inspect the other side's results only **after** scores are locked; each must independently decide what to reuse or reject. On close, A-next and B-next should both be runnable candidates and should each have a separately written plan for Round 1.

## Round 0 independent referee test matrix

- Execute four calls and verify four distinct attributable child-context handles; try to detect child transcript leakage with private canary questions. Verify actual concurrency overlap, not just a scheduling screenshot.
- Deliberately throw an error in one child, cancel another, hit a timeout in a third; confirm clear statuses and cleanup without corrupting unaffected jobs.
- Force context refresh after a source delta; show an old response cannot claim current authority. Resume/rebuild after controller restart with ledger reconciled.
- Re-run the same seeded deterministic task and compare reproducibility. Verify captured usage adds up; any unexposed metrics are explicitly `unknown` rather than zero.
- Confirm backend state survives page reload and that UI state tracks the real event log, not merely demo fixture data.
- Confirm no writes touched the seed original, sibling workers, provider credentials, or main before reviewed integration.

## Round 0 release gate

No transition to E1 until a child harness, durable event journal, source-basis checking, read-only consultation and an actual working task/product test have all been proven. No transition to E2 until E1 is shown correct under refresh, cancellation, stale-epoch conditions and independent comparison with E0. Round 0 documentation is not completion; the associated evidence and execution traces are required.
