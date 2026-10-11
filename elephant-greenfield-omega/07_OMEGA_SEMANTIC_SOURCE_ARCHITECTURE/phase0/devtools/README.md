# Ω Development Tools — Live Lab · Experiment Runner · Change Lab

**Status: v0.1 local prototype tested; full source package not yet committed here.** This is an additive toolset for the already-published [Phase 0 integration lab](../README.md); no real provider integration or new execution authority.

## What exists in the v0.1 source package

1. **Live Lab:** live source-grounded interpretation, readable sentence, alternatives, trace, correction capture and delegate-to-Phase-0 mock confirmation.
2. **Experiment Runner:** human-proposed cases with provenance, JSON response comparison (no candidate code execution), wrong READY and reject-all checks. Proposed feedback is never silently promoted into verified truth.
3. **Change Lab:** parsed ΩSL declarations produce an explainable wiki; change a consequence in a *preview* to see affected capabilities, pages and known tests. Source hash drift causes the old runtime to reject while wiki shows the changed source.

The first-pass implementation comprises `core.py`, `app.py`, `dashboard.html`, `run.ps1`, `tests/test_devtools.py`, full PRD/design and an evidence ledger. It is available as the owner-conversation artifact `omega-devtools-v0.1.zip` and a machine-readable source manifest; **the code files are not in this remote directory yet**. The public repository does not currently have them, and cloning this GitHub directory alone cannot run the new UI. That import is a separate pending step.

## Local installation after obtaining the ZIP

Extract `devtools/` into `elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/` beside `runtime.py`, `oracle.py`, `vendor/runA/` and `goldens/`.

From `phase0/`:

```sh
python -m devtools.app --port 8770
python -m unittest discover -s devtools/tests -v
```

Open `http://127.0.0.1:8770`. Windows: from `devtools`, run `./run.ps1`. The server uses Python standard library and delegates all mock approvals to Phase 0 Lab. No credentials required.

## Evidence

Local prototype tests: 8 passed using the original Run A interpreter via a bounded test adapter. **NOT_RUN:** merged Phase 0 HTTP integration, actual browser visual behavior/accessibility, Windows execution, user comprehension, head-to-head time-to-fix comparisons. Do not advertise those as successful.

## Two independent benchmarks

- **Live interpretation:** input→DOM reading p50/p95, stale-response discard, reading churn, ambiguous-READY action blocking, user correction steps.
- **Wiki coherence:** capability coverage, source hash freshness, declared vs observed evidence, impact recall/precision, stale/unsupported docs and test selection accuracy.

These are separate evaluations, not one combined subjective score. Measured fields require denominators, commands, environment and source hash. Source parsing alone never proves runtime correspondence.

Source-of-truth for verified runtime behavior is still `phase0/runtime.py`; declaring a new action cannot bypass the known finite oracle or issue a permit. Five Z.ai master prompts remain provisional.
