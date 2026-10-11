# Headless-first, test-driven fast loop — no browser prerequisite

**2026-10-11 · Status: scoped development-process design / NOT an assertion that the future Wasm compiler exists.**  
**Authority:** [SDK → compiler → runtime anchor](../../SDK_COMPILER_RUNTIME_ANCHOR.md). Applies to the Semantic SDK/automation lab only; it does not replace global Elephant publication/evidence requirements.

## Immediate correction to the observed developer process

A currently running computer was observed checking for Playwright, Chrome and Chromium, then starting `browser_check.py` as an early milestone. **Stop treating a browser as a dependency for this stage.** Do not install browser binaries, alter the host, build screenshot test infrastructure, or block progress on Playwright/Chromium when semantic compiler/runtime tests can operate headlessly.

The code in `phase0/` and `phase0/devtools/` is an existing *Python-backed experimental baseline*. Keep it for comparative replay. This policy does **not** tell an ongoing agent to rewrite it prematurely into TS/Wasm or claim work it hasn't done.

### Correct test pyramid and order

| Order | Test level | Minimal mechanism | Browser needed? | Decisive failure example |
| --- | --- | --- | --- | --- |
| 0 | Inventory / source hygiene | manifest, hash, exact fixture and contract version | **NO** | changed source masquerades as same revision |
| 1 | Contract parser/compiler | declaration fixtures + expected diagnostics | **NO** | unknown required capability silently accepted |
| 2 | Pure semantic kernel | interpret/render/parse/digest, property tests and fuzz seeds | **NO** | payload words swallowed / wrong account READY |
| 3 | Static proof obligations | independent oracle + mutation of consequences, reading and ambiguity | **NO** | altered reading still produces accepted digest |
| 4 | Publication representation | canonical bytes + data-only Human projection / Wiki facts | **NO** | Machine and Human assert different consequences |
| 5 | Runtime state machine | simulated typing, Enter freeze, revision races, missing/choice statuses | **NO** | stale input is published as current |
| 6 | Benchmark/batch | same kernel on fixture-generated and independently held-out text | **NO** | high throughput but false-READY regressions |
| 7 | Minimal UI smoke | static document/script correctness, DOM/event bridge adapter fakes or tiny host; optional manual browser | **OPTIONAL** | keyboard Enter publishes old revision |
| 8 | Real browser visual/accessibility | Playwright/Chromium or human tests when available | **LATER / OPT-IN** | visual reading hides account/consequence |

**Gate is allowed to say UI_VISUAL_NOT_RUN.** A missing browser is **not** a failed semantic SDK stage and never justifies hiding a compiled-core success. Conversely, passing unit tests is not proof of visual correctness: report both honestly.

## Red → green → refactor → benchmark, for every change

1. **Define the invariant and pin the evidence basis**: which `source_sha`, `declaration_sha`, `fixture_id`, compiler revision, environment snapshot and expected behavior?
2. **Write a failing test first**, ideally a minimized counterexample with exact input bytes, intended command, observed command, alternatives and expected status. Never silently amend an original fixture to make it green.
3. **Create a negative control** that intentionally drops words, swaps account, removes consequence, erases ambiguity or misstates Wiki source; ensure the verifier rejects it. Also add a **positive control** to catch always-reject systems.
4. **Implement the smallest change** in a short-lived candidate branch/worktree, with a bounded experimental budget. Do not rewrite unrelated GUI code.
5. **Run focused tests headlessly** until green. Then run all contract/compiler/runtime/public-golden tests, ambiguity/authorization checks, and independent held-out comparisons under evaluator control.
6. **Measure after correctness**: warm/cold latency and throughput, changed semantic fields, regeneration costs, false READY/over-reject counts, source/wiki parity and end-to-end time to a *verified improvement*; report the complete measurement command and denominator.
7. **Inspect failures and change impact**: identify affected capability IDs, declaration spans, Wiki facts, documentation, wire format and tests. Source-linked Wiki facts update only with correct revision; editorial copy remains explicitly unverified.
8. **Publish the complete evidence portfolio**: accepted/rejected/blocked candidate files, replay command, actual scorecard, negative controls and unchanged packs. Candidate discovery is publishable even when testing fails.
9. **Promote or revert explicitly**: only an independent accepted result becomes a new lab contract revision; prior frozen records remain replayable, no product law changes without review.

### Headless simulator contract

Use deterministic streams of events rather than a browser as the primary UI test oracle:

```json
{
  "fixture": "typing-prefix-and-stale-reply/1",
  "contract_hash": "resolved-at-runtime",
  "events": [
    {"kind":"edit","revision":1,"text":"ask claude"},
    {"kind":"edit","revision":2,"text":"ask claude work to explain this error"},
    {"kind":"completion","for_revision":1},
    {"kind":"completion","for_revision":2},
    {"kind":"enter","for_revision":2},
    {"kind":"switch_mode","to":"Machine"},
    {"kind":"switch_mode","to":"Human"}
  ],
  "expected": [
    "rev1 is never displayed as the current rev2 meaning",
    "one canonical frozen rev2 publication is emitted",
    "the two views never call interpret again or change the publication id",
    "enter confers no effect permission"
  ]
}
```

This is a **proposed test vector format**, not a claim that event runner is already coded. Independent implementation should verify revision ordering, callback cancellation, state flags, content hashes and generated Wiki references. If DOM bridge behavior must be checked, call it with a stubbed event target/document. Browser screenshots remain optional later.

## Testing thousands of protocol variations without UI overhead

- Build a common `evaluateOne(contractRev, inputBytes, env)` semantics function used by interactive and batch calls.
- Batch runs do not allocate DOM nodes, create screenshots or spawn an OS process per input. Evaluate many input records per loaded engine instance; separate warm parse time from compile/rebuild/verification time.
- Represent candidates with *declarative deltas* on a stable semantic IR where possible (grammar template, account resolver, quote policy, explanation template, Wiki fact projection, encoding, channel negotiation).
- Store only compact counters and failing witnesses by default, with reproducible seeds/source hashes; provide a replay-on-demand to inspect representative cases in Human UI.
- Keep independent holdout/negative controls outside the proposing model's context and maintain comparability of input cohorts across candidates.
- Explore strategies with bounded experiments (e.g. successive halving) but preserve losing results and prevent repeated overfitting to public goldens.
- Measure **wall time to independently verified improvement** across build+test+review, not just raw Wasm nanoseconds; Wasm can lose to lean TS/JS, and such a negative result is valuable.

## Strict runtime scope vs development-tool freedom

The proposed last-stage artifact may be `.wasm` plus static HTML/CSS and a tiny browser host bridge; it must not require **Python/Node runtimes, Chrome, Playwright, npm, UI frameworks, or a network service** for core semantic evaluation. The browser UI necessarily needs a DOM host bridge; never claim pure Wasm directly manipulates HTML.

**Upstream is unrestricted** within security/license/evidence constraints: source research, Python reference replay, TS compilers, Node-based build tools, simulations, independent test runners, graph engines and Elephant agents may be used. Only the **published final-stage kit** has the strict portability target. Maintain `NOT_BUILT` until a real module, launcher and hashes exist.

## No-browser verification commands: status contract

Use commands actually present in each candidate repository; examples for the **current Python reference** only:

```sh
# Current experimental reference, NOT the forward portable runtime:
cd elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0
python3 lab.py verify
python3 -m unittest discover -s devtools/tests -v
```

For a future TS-family/Wasm kernel, expose a **single** documented headless test entrypoint (using an available Wasm host/driver) with no browser dependency. Do not advertise a new `npm test`/script that has not been created.

### Gate summary for any agent

**Build compiler + semantic core → make regression tests pass → freeze semantics and publication parity → measure variant throughput → only then consider visual browser checks.** Do not report required Chrome/Chromium setup as an SDK prerequisite. Flag UI_VISUAL_NOT_RUN separately and continue on independently testable work.

**Status of this note:** design/process rule only. It does not certify a test run; see actual `phase0/evidence/` for measured reference cohorts.
