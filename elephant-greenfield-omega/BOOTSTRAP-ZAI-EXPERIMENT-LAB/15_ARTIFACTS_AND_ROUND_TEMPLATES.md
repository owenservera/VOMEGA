# Required Round Artifacts and Reporting Templates (Specifications, Not Code)

The real laboratory implements its own durable artifact formats and validators. These descriptions are minimum semantic requirements, not executable schemas.

## Project Intake Record

Record seed name, source/hash/commit, permissions, ignored sensitive material, build environment and package versions, working deterministic tests, benchmark tasks/fixtures, baseline failures, lock-date, allowed output scope, owner approval and evaluation criteria. If an item is unverified, say so.

## Capability Matrix

One row per capability: named host/platform, exact version/model, experiment run proving it, outcome PROVEN/LIMITED/FAILED/UNKNOWN, observed behavior, artifact/log reference, time and fallback. Required rows: source import/export, shell/test access, independent subagents, context isolation, workspace isolation, concurrent overlap, session resume, token usage, compaction, context control, persistence, Git and browser test.

## Round Manifest

Unique round ID; experiment objective; frozen seed SHA; master A and B current candidate IDs; chosen E-level E0/E1/E2; four-plus preregistered arm IDs and hypotheses; model/tool/seed/permission budgets; timing; evaluator assignment; test/holdout fixture hashes; exact measure definitions; excluded confounders. Every started child references one manifest entry.

## Arm Execution Record

Arm ID and master; test theory versus null hypothesis; child session ID, parent, runtime/model and version; workspace identity and source base; prompt boundary hash; start/end; concrete source changes and commit/diff; model/tool events and token ledger references; tests actually run, outputs/errors, cancellation/retries, external I/O; evaluator finding; failure/blocked reason. Preserve before/after evidence and masks for private data.

## ECP Transaction Record

Request/response IDs, parent/worker/Elephant identities, source basis, operation, artifact hashes, deadline and request status, model response, claims, path/line references, independent citation validity, suggested test and execution result, freshness and scope warnings, token/latency usage and fallback. The record must distinguish a *proposed* patch from a *merged and verified* change.

## Context Epoch Ledger

Node ID, domain/manifest version, pack SHA, pack and incorporated commits, pending in-domain and cross-domain changes, load time, active session identity, context occupancy measured/estimated, wave delta size, flush/compact/rotation events, calibration score and known unavailable material. Rebuild from this ledger must be repeatable without original chat.

## Evaluator Scorecard

Reference preregistered metrics. Actual accepted task outcomes, independent test evidence, useful correctness/defect recall, failures, false positives, wall time, waiting/overhead, token provenance, quality-adjusted throughput and cost, confidence/limitations. Compare A1/A2/B1/B2 and E-level baselines; show both gains and regressions. Judges report any grading conflicts.

## Two independent Master Assimilation Notes

A and B each deliver: their pre-round hypothesis, what four arms actually proved, **separate ADOPT/ADAPT/REJECT/DEFER** decisions, links to evidence, integration patches/tests, own candidate version and changelog, novel insight candidates, competing assumptions that remain, known weaknesses, and **two next-arm theories each**. Each note is written before the author reads the other master’s new assimilation note.

## Round Closure and Next Round

Controller publishes: four qualifying-arm evidence check, live concurrency proof, independent grader signoff, current main SHA, two runnable approach versions, consolidated common utility state, accepted regression suite, cost totals and unknown fields, failures and unresolved disagreements, next four preregistered experiments. Include explicit status COMPLETE / INCOMPLETE / BLOCKED and why. No undocumented claim of self-improvement.

## Storage convention

Keep these records in one versioned project documentation/evidence directory with stable IDs; store large transcripts, model responses, screenshots and sample data in access-controlled local artifact storage with hashes and bounded retention. On consolidated Git main, retain manifests, schema docs, source, sanitized scorecards, necessary test fixtures, two approach candidates and reproducible evidence pointers. Prefer short-lived worktrees for active experiments; never require permanent branches for master ownership.

## Additional Track C artifact contract (2026-10-11)

Persist: prior-round C design intake SHA and access attestations; C1 and C2 isolated worker records and code/test/log evidence; C runnable release SHA + dependencies and license/version checklist; native-vs-tool comparison records; frozen A/B/C candidate submissions, common benchmark/hidden fixture hashes, latency and observed/estimated/UNKNOWN token measurements; benchmark operator ID separately from C-Design; independent Truth signoff; longitudinal A/B/C scores with E-level and C age/feature compatibility; separate A/B next-round tool adoption or prior-code repair decisions. Never backfill missing C experiments and never rewrite original A/B manifests. See 19/20/21/22 docs and prompts/05_C_ROLES_AND_TRI_TRACK_ROUND_CLOSE.md.

## Pack evidence is not a fixed artifact inventory

Files 23 through 26 supersede any interpretation that every track or capability pack must emit an identical artifact or component list. Each track should provide an inspectable released portfolio and reference composition. A pack uses whatever code, tools, API, docs, experiments or tests its actual function requires while satisfying the portable identity, provenance, contract, dependencies, evidence, economics, lifecycle and interoperability questions in file 25. No invented packs or mandatory file counts. The original round execution, isolation, verification and token observability requirements remain.
