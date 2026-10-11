# Ω SDK cross-computer interface — candidate v0 (pre-implementation)

**Status:** proposed interchange boundary for Phase 0; not ratified compiler schema. Work must independently validate it against the original Run A source before freezing version 1. Five computers may implement alternative engines behind this adapter without duplicating the entire harness.

## Stable function boundaries

- `compile(declarations, fixture, opts)` returns `{registry, grammar_version, source_hash, diagnostics}` or a typed compile failure.
- `interpret(input, env, compiled)` returns an ordered set of candidate commands, a status, exact source spans, partial fields, alternatives, why-trace, and a monotonic input revision. An ambiguous interpretation is **not** effect-authorized.
- `render(candidate, compiled)` returns the exact deterministic displayed reading with consequences, source version and per-field derivation anchors.
- `parseReading(reading, compiled)` reparses with the pinned declaration set; semantic digest comparison is necessary but insufficient for execution.
- `createPreview(candidate, reading, snapshot)` freezes a display revision, exact display digest, command digest, target identities, permission scope, environment/session epoch and expiry.
- `authorize(preview, explicitConsent, nowSnapshot)` returns a one-shot mock approval only when all bindings match, alternatives are resolved and consent is appropriate; old approvals never authorize repeats.
- `dispatchMock(approved, input)` verifies consumed approval, records idempotent event and returns an immutable mock receipt; no production integrations.
- `compileHelp(declarations)` yields source-grounded help/Wiki projections, marked incomplete where unsupported.

## Candidate envelope to refine

```json
{
  "schema": "omega-semantic-candidate/0",
  "input_revision": 1,
  "status": "NEEDS_CHOICE",
  "candidates": [],
  "selected": null,
  "ambiguity": {"blocking": true, "alternatives": []},
  "reading": {"text": "", "source_hash": "", "render_revision": 1},
  "semantic_digest": null,
  "display_binding": null,
  "execution_approval": null,
  "why_trace": [],
  "evidence": {"class": "UNKNOWN", "witnesses": []}
}
```

The sample is **illustrative**, not an approved schema. Select language-neutral canonical encoding and domain/version separation experimentally; avoid JavaScript vs Python serialization mismatches. SDK *semantic identity* hash and execution authorization have different purposes. Consent-bound tokens should be opaque, short-lived, one-time, non-replayable and checked server-side even in a mock demo.

## Integration package required from each computer

`README.md`, `manifest.json` with source SHA, `scorecard.json`, `tests/`, `run.ps1`, cross-platform run command, `failure-cases.jsonl`, `capability-packs/` and a `compatibility.json` declaring exactly which functions/schemas are implemented and which are BLOCKED. Source code should be inspectable without a custom model. Include all test inputs and denominators for MEASURED values.

## Evaluation priorities

1. Correctness and no silent effectful misparse; explicit rejection tests are non-negotiable.
2. Independent oracle reproduces baseline and can fail deliberately mutated implementations.
3. Full run path latency and cost on matched tests.
4. Source-provenance and extensibility; docs/projections not claiming absent capabilities.
5. Usability, readability by actual participants where possible (do not replace human testing with Flesch-Kincaid).

Do not freeze a single package runtime or A2A transport as the universal Elephant DNA. A2A omega-contract is a proposed interop adapter tested independently.
