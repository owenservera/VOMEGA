# PRD v0.1 — Three connected development acceleration tools

## Objective
Close one demonstrable loop: type → inspect a deterministic Plain Reading + live wiki → capture corrected intent → compare candidate behavior → preview source/wiki/test impact → retest. Do not broaden the SDK until this loop is measurably helpful.

## Contracts

All views use `capability_id`, `input_revision`, `source_hash`, `declaration_revision`, `observed_state`, `expected_state` and evidence refs. Semantic hash ≠ displayed interpretation binding ≠ executable authorization. A missing/unverified source or stale input blocks effects.

**Live Lab:** phase0 `Lab.interpret(session,input,revision)` returns reading, trace, alternatives and optional trusted preview. Show wiki for `state.capability`. Input edits immediately invalidate old preview. `Lab.choose` is the only alternative selection path. `Lab.authorize` + `dispatch` remain the exclusive mock effect path.

**Experiment Runner:** `case = {id,input,expected,observed,feedback,source_hash,expected_provenance:USER_PROPOSED_NOT_INDEPENDENTLY_VERIFIED,status:PROPOSED}`. Compare data-only candidate responses to expected status/capability/args and mandatory consequence rendering. A candidate rejecting every READY must fail positive controls. Preserve losing evidence and regression-class dedup. Do not run arbitrary submitted scripts on a host.

**Change Lab:** parsed ΩSL source links capability → param/consequence/say/hear templates → declared wiki page → goldens referencing that capability. Relate records as DECLARED/OBSERVED/INFERRED, never treat inferred absences as safe. Preview a consequence edit without mutating source. List impacted docs/tests and explicit unknown cross-capability dependencies. Source mutation invalidates loaded Phase 0 snapshot; old approvals cannot be reused.

## Test acceptance

L1: `tell chatgpt personal account balance please` shows multiple candidates; no direct confirmation until explicit choice.
L2: `ask claude work to explain this error` displays `cap:prompt.send`, exact prompt and external consequence; a corresponding source-derived wiki exists.
L3: changing input after preview or changing the declaration must invalidate old confirmation.
E1: captured user correction remains PROPOSED and source-anchored, not an automatic truth label.
E2: comparing a reject-all candidate to a valid READY case fails.
E3: wrong account or missing consequence also fails.
C1: previewing a source change updates impacted wiki page and affected test references, without touching the source.
C2: changing source on disk marks wiki runtime mismatch; the old interpreter refuses stale source.
S1: no real provider calls; no candidate process execution; ignored local corrections not committed.
S2: POST protected with loopback host/origin/CSRF, input size ceilings, no filesystem browsing.

## Measurements

**Benchmark A: Live typing.** Per-event client interpretation-to-display latency p50/p95, server parse latency, visible reading churn, stale response rate, error/correction burden, no unauthorized mock receipts. Mark accessibility and human comprehension NOT_RUN until browser/participant tests exist.

**Benchmark B: Wiki coherence.** Declaration coverage %, source freshness and stale count, docs updated per change, affected known tests detected, source-vs-observed claims, impact recall/precision from controlled mutations. A source-derived page is DECLARED_NOT_PROVEN, not verified behavior. Independent behavior/wiki coherence is a later gate.

## Current scope

v0.1 includes a mocked three-column UI, a read-only declaration projection, user-proposed correction intake, data-only candidate comparison, change preview and local metrics. No full compiler, generic repo dependency mining, sealed evaluator, untrusted execution sandbox or production SDK claim.

## Publication and evidence honesty

Eight local unit tests passed against the exact original Run A source through a small test adapter. Merged HTTP testing, browser appearance, Windows PowerShell execution, live agent benchmarks and production provider handling are **NOT_RUN**. Source archive and original Phase 0 artifacts remain unchanged. Publishing this PRD does **not** mean the v0.1 source ZIP was pushed; import and remote verification remain required.
