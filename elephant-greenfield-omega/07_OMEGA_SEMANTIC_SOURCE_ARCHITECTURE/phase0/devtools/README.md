# Ω Development Tools · Live Lab + Experiment Runner + Change Lab

> **Proposed next experiment; NOT_FROZEN and NOT IMPLEMENTED:** [Zero-runtime-dependency TS-family/Wasm final-stage publisher](proposals/wasm-semantic-publisher/README.md), [technical spec](proposals/wasm-semantic-publisher/PRELIMINARY_SPEC.md), [near-instant lab wiring](proposals/wasm-semantic-publisher/AUTOMATION_LOOP_WIRING.md) and [separate live/Wiki/parity/velocity benchmarks](proposals/wasm-semantic-publisher/BENCHMARKS_AND_EXPERIMENTS.md). Current devtools remain Python-backed and experimental; this is a sibling research candidate, not a runtime migration.


An **additive**, local-only, standard-library Python 3.10+ extension to the existing [Phase 0 lab](../README.md). Reuses its original semantic interpreter, source hashes, one-use mock authorization and provider-account snapshot validation. No real provider calls and no arbitrary candidate code execution.

## Start

From `phase0/`:

```sh
python -m devtools.app --port 8770
# open http://127.0.0.1:8770
python -m unittest discover -s devtools/tests -v
```

Windows PowerShell, from the `devtools/` folder:

```powershell
.\run.ps1
```

The UI has three adjacent panels: **Live Lab** (typed input, instant deterministic Plain Reading, alternatives, correction capture and existing mock confirmation), **Source Wiki / Change Lab** (declaration/parameters/consequences, source SHA, test references, non-destructive consequence impact preview), and **Experiment Runner** (locally proposed regression cases and data-only candidate scorecards).

### Demonstration

Type `tell chatgpt personal account balance please`. The original parser recognizes competing meanings and must block direct confirmation; choose an alternative if appropriate. Click **This isn't what I meant**, describe the intended interpretation, and **Capture proposed regression**. This records your expectation as *unverified user proposal*, not a certified test. In Experiment Runner, supply candidate responses keyed by the case ID to detect missing fields, wrong READY and over-rejection. Change Lab can preview replacing `leaves-this-computer` with `stays-here`: the affected wiki and relevant tests are listed, but source is not edited.

To test actual source freshness, change one consequence line in the local *working copy* of `vendor/runA/omega.osl` while the server runs. The wiki will reflect the new declaration and report `runtime_source_fresh: false`; the interpreter will reject stale source and old confirmations. Restore the file and restart the server. **Do not do this in a tracked working tree without a disposable worktree.**

## Evidence and limitations

Assets `dashboard.html`, `ui.js` and `style.css` are served as same-origin files with a restrictive Content Security Policy (no inline script/style). A mock-adapter HTTP smoke tested the assets and JSON routes, but not the actual full Phase 0 runtime integration.

`core.py` is read-only except for proposed correction records under ignored `.local/`. The data-only evaluator does not run shells, agent outputs or imported code. Wiki is a *structural source projection*, not a full production contract compiler. It does not prove all runtime/wiki equivalences. Server timings and UI timings are separate metrics; browser p95 covers both queue and render. Tests cover the original Run A interpreter through a test adapter; Phase 0 integration and UI browser tests should be separately rerun in the actual merged repository before promoting.

See [PRD and design](PRD_AND_DESIGN.md). Existing Phase 0 tests and publication requirements remain in force. The new tools do not imply completion of B1–B4 or implementation of new Z.ai prompts.
