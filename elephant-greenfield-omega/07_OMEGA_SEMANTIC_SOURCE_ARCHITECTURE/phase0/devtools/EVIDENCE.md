# Devtools v0.1 execution evidence

- **Source tested:** stand-alone devtools source plus exact `runA/engine.py`, `osl.py`, `omega.osl`, `fixture.json` extracted from supplied `07_OMEGA_full.zip`. The original Phase 0 runtime is referenced by API, not redistributed in this test snapshot.
- **Executed command:** `cd phase0 && python -m unittest discover -s devtools/tests -v`.
- **Local results:** Eight test methods passed: source projection, runtime-derived interpretation and ambiguous block, changed consequence impact, source-change stale signal, proposed-case provenance, runner false-READY/over-reject controls, conservative impact baseline and invalid-payload rejection.
- **Scope of test:** real Run A interpreter behind a purpose-built test adapter, not the complete Phase 0 HTTP gateway. The adapter does not grant real execution authority. Existing Phase 0 gate controls were inspected on GitHub and must be rerun in the merged tree.
- **Additional measured smoke:** local loopback HTTP server with an injected Run A test adapter served HTML/JS/CSS and completed interpret, impact, capture, evaluate routes; invalid CSRF returned HTTP 403. **This did not use the actual full Phase 0 runtime.**
- **NOT_RUN:** actual Phase 0 gate / HTTP integration in this execution environment; browser visual interaction, screen reader evaluation, Windows PowerShell execution, human comprehension panel, and independently measured acceleration vs baseline.
- **Source safety:** no production API keys or provider calls. Candidate evaluator accepts data-only responses.
- **Publication:** file hashes and actual Git references must be filled only after publication and remote reread. A local ZIP is not equivalent to GitHub push.

- **Integrated HTTP acceptance added:** `tests/test_http_integration.py` exercises real `runtime.Lab` mock confirmation, single-use rejection, ambiguous-block, wiki, impact, case comparison, CSRF and asset availability. It is expected to **SKIP** when the complete Phase 0 `runtime.py` is absent (as in the local standalone source snapshot); it has not yet been run against the complete GitHub clone.
