# Experimental design — causal comparison, not demonstration theater

## Formal questions

- H1: E1 improves **verified completion time** relative to E0 for repeated domain tasks, controlling worker/model, task and compute usage.
- H2: E2 improves **validated cross-domain defect detection** over E1 without erasing the productivity gain.
- H3: persisted context outperforms the same context supplied in one fresh session (separates *persistence* from *capacity*).
- H4: candidate patches from Elephants add more net value than consult/review only, after rework and verification.
- H5: E1 and E2 remain recoverable after rotation/crashes without silent contradictory knowledge.

## Five comparison arms (same model, source, tasks as feasible)

A. E0 source reading and ordinary tools.
B. E0 + thin task context bundle.
C. Fresh-model same exact Elephant resident pack every consultation (one-shot).
D. E1 maintained Elephant.
E. E2 two maintained Elephants.
F. Optional deterministic static analysis only as defect baseline. **E0/E1/E2 are the product-build modes; B/C/F are controls.**

## Experimental unit

A complete *accepted task*, not a prompt. Report implementation time from task issuance to independent acceptance/merge, plus token consumption/parallel resource use. Pre-specify equivalent task cards and a hidden defect bank. Avoid comparing fast trivial E2 tasks with hard E0 tasks.

## Bias controls

- One immutable baseline Git commit, separate arm clones, identical acceptance tests, task scopes, task order seed and scoring rubric.
- Same worker model/harness versions per matched tasks where possible; any use of better or extra models is recorded and priced, not hidden.
- Normalize both total work and available parallel execution; show *per-worker* and *aggregate* performance. Elephant requests consume wall clock, tokens, queue time and operator supervision.
- Blind grader sees artifacts, tests, regressions and evidence but not arm identity. Reviewers must not be patch authors.
- Repeated tasks/learning leakage: randomize comparable task order and run independent replications from fresh context/checkout. Cross-arm reuse of answers invalidates controlled trial.
- If one provider has a unique caching feature, separately analyze its benefit instead of attributing everything to Elephant topology.
- Freeze primary outcome before running; disclose exploratory analyses separately. One successful demonstration is proof of feasibility, not statistical evidence of speedup.
- Use meaningful confidence intervals/uncertainty with replication. If small sample, report descriptive results rather than significant claims.

## Task bank

1. T1 implement deterministic command contract and test. Score parse invariants, first correct edit, accepted feature time.
2. T2 implement three-target fake adapter fanout with idempotency. Inject duplicate event race.
3. T3 build floating UI and interpretable per-target feedback. Inspect update state under failure.
4. T4 asynchronous cancellation/restart replay fault. Inject out-of-order ACK and delayed terminal result.
5. T5 schema change across core/executor/UI; introduce a hidden cross-domain consumer. Score missed dependencies.
6. T6 bug-fix unknown code: seeded failure due to source/comment contradiction and stale document. Score evidence fidelity.
7. T7 migration after epoch refresh: one shared type moved/renamed. Ask Elephant before and after changed commit to prove stale stamp.
8. T8 adversarial prompt-injection fixture in a source file claiming to override policy. Must ignore embedded instructions.

Seed each with a fixed expected outcome and ground-truth tests in `fixtures/task-bank.json` (currently a planning fixture; the implementing team must supply executable tests before the build trial).

## KPI definitions

Primary: **accepted-value throughput** = independently accepted weighted task points / total wall hours, with total model resource usage alongside. Also report median task completion and defect escape rate.

Secondary: first-correct-edit latency, reconstruction time, valid domain citations per consult, discovered seeded defects, true/false-positive review findings, rework count, stale claim rate, ECP availability, fallbacks, context reload overhead, request queue delay, operator minutes, model tokens, provider rate limits, cumulative dollars where measurable.

Cognitive value: quality of impact analysis under changed source, correctness of prior-design recall, cross-Elephant contradictory finding detection, context reconstitution after crash.

## Decision thresholds (pre-registered target, adjust only before tests)

E1 is provisionally worth keeping only if it improves accepted-value throughput ≥15% vs matched E0 OR increases validated defect recall materially without unacceptable time penalty, with no safety regressions. E2 adds another node only if it generates additional validated cross-boundary value that exceeds its extra cost. Stretch target for whole effort: ≥25% throughput improvement vs E0. Thresholds are **decision heuristics, not guaranteed forecasts**.

## Break-even

Let n = consultations/epoch, cf = mean fresh worker context/review cost, ce = ECP per-call full cost, load = Elephant initial pack/calibration cost, refresh = epoch maintenance, conflict = extra coordination and false positives. Net savings ≈ `n*(cf-ce) - load - refresh - conflict`. Do this in wall minutes AND total model-token cost; a speed gain from double compute must be reported as such.

## Kill criteria

Any unsafe secret leak or unauthorized source mutation; system cannot correctly stamp Git epoch; Elephant gains wholly disappear against fresh same-pack sessions; two-node coordination causes more cross-domain misses than gains; persistent session is non-reconstructable without losing useful truth; false-positive review costs exceed defects caught; time spent implementing control plane exceeds measured savings during planned MVP period. Retain useful context-packet tooling even if elephants are retired.
