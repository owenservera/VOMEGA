# Scorecard and launch gates

## Task-level record (one line per task × arm × repetition)

| Key | Required |
|---|---|
| `arm`, `task_id`, `replication_id`, `baseline_sha` | yes |
| `worker_model`, `worker_harness`, `elephant_models`, `harness_versions` | yes/unknown |
| `start_utc`, `first_correct_edit_utc`, `submitted_utc`, `accepted_utc` | yes if milestone reached |
| `task_points_accepted`, `independent_reviewer`, `tests_passed`, `defects_escaped` | yes |
| `worker_tokens_in/out`, `elephant_tokens_in/out`, `cache_read/write` | measured or unknown |
| `worker_time`, `elephant_wait_time`, `maintenance_time`, `human_operator_time` | yes/estimate flagged |
| `consultations`, `stale_warnings`, `fall_back_count`, `failed_reviews`, `false_positives` | yes |
| `commit_sha`, `diff_sha256`, `test_artifact`, `audit_log` | yes for accepted task |

Templates: `schemas/task-result.example.json`, `schemas/ecp-request.schema.json` (structural contract), `schemas/ecp-response.schema.json`.

## Model comparison matrix (assign blind score 0-5 each)

| Criterion | Weight |
|---|---:|
| Readiness of executable E0/E1/E2 kernel | 20 |
| Source/epoch/consistency correctness | 15 |
| Context flush and session recovery realism | 15 |
| Code modification controls + testability | 15 |
| Measurable throughput/fairness controls | 15 |
| Minimal Windows operational burden | 10 |
| Novel, falsifiable technical mechanism candidates | 10 |

Weights sum to 100. Reviewer must record evidence (file/test IDs) for each score, not only impressions.

## Gate checklist

- G0: Frozen task bank, seeded tests, available worker models/harnesses, exact environment snapshot, 3 branch-isolated arm roots.
- G1: E0 clean build with accepted first feature, instrumented logs, reliable `main` integration.
- G2: E1 one resident node, explicit source pack, bounded requests, fake+one verified real transport, rotate/rebuild, read-only proof, independently checked findings.
- G3: E2 both simultaneously usable, in-domain/cross-domain routing, disagreement record, mixed epochs detected, cancellation, rate limiting, crash and recovery drills.
- G4: Repeat baseline tests, blind grading, measure net improvement including Elephant load/refresh and model costs, kill/promotion disposition.

## Required phase outputs

`G0-machine-census.json`, `G0-task-bank.json`, `G1-e0-report.md`, `G2-e1-report.md`, `G3-e2-report.md`, `G4-blind-scorecard.csv`, `G4-decision.md`, `NOVELTY-LEDGER.csv`.

Never declare G2 complete merely because the deterministic fake adapter tests pass; G2 requires ONE **actual live, resumed** provider session, with source basis and isolated context confirmed. G3 requires TWO real concurrently alive sessions, not fake mock identities.
