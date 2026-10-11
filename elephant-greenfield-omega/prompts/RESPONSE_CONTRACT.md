# Unified submission contract for independent architect round robin

Each model's **first pass** must be saved separately, before discussing alternatives or adapting the initial conclusion.

## Required machine-readable `submission.json`

```json
{
  "submission_version":"omega-elephants/submission-v0.1",
  "author_role":"claude-architect",
  "submitted_at":"ISO8601",
  "source_basis":"GREENFIELD_BASE_SHA or design_only",
  "design_id":"string",
  "recommended_topology":"e0-first|e1-first|e2-first|hybrid",
  "accepted_assumptions":[], "rejected_assumptions":[],
  "core_components":[], "protocol_changes":[],
  "lifecycle_mechanism":"string", "code_writing_policy":"string",
  "known_unverified_provider_features":[],
  "security_boundaries":[], "tests_proposed":[],
  "smallest_demonstrable_slice":"string",
  "estimated_mechanism_costs":[], "falsifiers":[],
  "invention_hypotheses":[], "open_questions":[],
  "files_created":[], "commands_run":[], "tests_run":[], "limitations":[]
}
```

Do not fabricate `submitted_at` or SHA; set to `unknown` if unavailable and explain. Alongside JSON, add main proposal Markdown, architectural diagrams, exact examples and runnable code where assigned. Distinguish claim types: `DESIGN`, `SIMULATED_TEST`, `LIVE_TEST`, `MEASURED`, `SPECULATION`.

## Rules

- No model may update the initial master charter in first pass.
- No model may cite another contestant's answer as evidence in first pass.
- Saved logs carry model/harness/version where known, otherwise `unknown`.
- Cost forecasts are assumptions until measured; state uncertainties.
- Every design includes a plausible minimal fallback E0.
- Source tests/verification override persuasive text.
