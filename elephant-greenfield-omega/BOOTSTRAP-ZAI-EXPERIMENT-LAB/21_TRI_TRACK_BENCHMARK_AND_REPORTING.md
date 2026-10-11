# Tri-track benchmarking and impartial publication specification

## Two views, to avoid false conclusions
**Matched current-round benchmark** compares A[n], B[n] and C[n] frozen candidate releases on the *same* fixture/task contract with the *same* model/tool resource constraints when practical. C may be one round behind in design inputs; its score must show that age, missing features and partial eligibility. Distinct source feature versions or incomplete E-level support make the row PARTIAL or INCOMPARABLE, never a secretly normalized 'winner'.

**Longitudinal research scorecard** plots each track against its own prior versions and against the E0 fresh-worker control, with its exact evidence-intake round and infrastructure burden. This distinguishes benefits of reuse from the informational disadvantage of C's intentional lag.

## Critical independent evaluation boundary
C-Benchmark operator may **run** the common suite and draft a public result, but must not be permitted to edit the scored implementation, hidden fixtures, evaluation rules or weights. Truth-evaluator is a **different verified session** with independent access to fixtures, is responsible for reproducing selected cases, vetting traces and signing or rejecting scores. C-Design is a third distinct context with NO read access to current A/B artifacts until next round. If these separations cannot be enforced, label scores **UNVERIFIED PROVISIONAL**.

## Freeze contract for each benchmark
Preregister: round ID; each candidate's source SHA, framework versions and feature coverage; source cohort and Ω seed commit; exact acceptance assertions and hidden fixture digests; evaluator identity; E0/E1/E2 level and actual Elephant session IDs; runtime OS, model/version, budget, context capacity, retries, cache state and allowed network; objective and negative tests; scoring calculation; stop/abort rules. After submissions freeze, the operator can execute but cannot change these conditions to rescue a favored candidate. A repair becomes a new version/new benchmark row.

## Mandatory measurement families
**Correctness:** accepted functional milestones, held-out integration tests, seeded invariant violations, defect recall/false-positive rate, security/isolation checks and source citation validity.

**Speed:** time-to-first-verified-edit, accepted-feature completion wall-clock, full round duration, coordination/bench/review overhead; concurrency verified by overlapping timestamps. Do not confuse sum of child active time with real elapsed time.

**Model economics:** input/output/cache/reasoning tokens where actual provider counters exist, exact source of measurement vs estimate vs UNKNOWN, tool calls and latencies, direct spending if recorded, load/flush/rebuild costs, wasted retries, quality-adjusted accepted output per total lifecycle budget.

**Cognitive integrity:** independent-context canaries, stale source epoch rejection, successful session destruction/rebuild/calibration, two concurrent nodes where E2 is claimed, distinct multi-agent identities, correct cancellation and idempotence, restart consistency, disputed claim falsifiers.

**Framework burden:** install and cold-start times, additional services, transitive packages, license/security issues, portability, adapter LOC, documentation and upgrade effort, rollback cost.

**Status:** CERTIFIED / PROVISIONAL / PARTIAL / INCOMPARABLE / FAILED / NOT_RUN. Report unknown values as unknown, NEVER zero.

## Reporting and scores
Display **raw outcome dimensions and Pareto tradeoffs**, then a preregistered composite only as secondary. A quality-defective quick submission is not faster accepted software. Include absolute values, run/sample N, distributions where enough data, actual logs, repeatability, limitations and any source/provider/model mismatch. Do not claim statistical significance from tiny samples.

For each comparison row: round, track A/B/C/E0, version SHA, C evidence-intake version, age gap, source fixture/seed SHA, E-level capability, runnable status, tests passed and hidden failures, time, measured/missing tokens, model/tool versions, dependency/operations overhead, evaluator attestation and artifact links.

Round publication comprises:
1. Original four A/B experiment records **plus** separate C1/C2 records, preserving original A/B completion status.
2. Frozen A/B/C candidate hashes and feature coverage matrix.
3. Executed tri-track result table with E0 anchoring and explicit comparability markers.
4. Truth-signed or provisional verdict and exact reproduction/evidence digests.
5. Prior-art/tool decision ledger and accepted/rejected components.
6. A and B's **separate next-round** decisions to repair prior code or adapt next hypotheses using C's tested results.
7. Longitudinal public scoreboard and raw sanitized evidence links, never keys/unredacted conversations.

Suggested output under the greenfield experimental project: evidence/rounds/RNN/ and evidence/scoreboards/TRACKS.md, with large raw/private logs stored outside Git and sha256 pointers committed. Keep one consolidated main and disposable experimental worktrees.

## Publication blocker examples
False parallelism, missing child IDs, self-scoring, current A/B design leaked to C, mutated holdouts, tool adapter without runnable proof, comparability not disclosed, fabricated/zeroed unknown tokens, framework overhead omitted, and an E2 claim based on one session. A/B's original Round 1 may close while C is blocked; DO NOT fake a completed three-track cycle.

## Additional end-state evidence layers

Evaluate pack-level functionality, portability and stated contracts separately from system-level benchmark throughput. Composition of released packs across tracks is a new controlled experiment; capture adapter effort, dependency conflicts, source-epoch risks, setup and lifecycle cost, and whole-system regressions. Never add high individual pack scores and declare an integrated winner. Keep the strong E0/E1/E2 baselines and independent Truth evaluator. See files 23 through 26.
