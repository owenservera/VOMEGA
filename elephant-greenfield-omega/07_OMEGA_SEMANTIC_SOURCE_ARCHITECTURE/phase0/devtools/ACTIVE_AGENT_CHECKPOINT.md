# Active-agent checkpoint: first nail semantic SDK, compiler and runtime

**Date:** 2026-10-11  
**Use:** paste or link to a currently running Work/Claude/Z.ai agent at its next safe checkpoint. This is a *scope correction*, not a request to delete artifacts, reset active branches or invalidate completed tests.

## Paste-ready instruction

> **Immediate priority update — please adopt at your next safe checkpoint.**  
> Read the repo's [SDK_COMPILER_RUNTIME_ANCHOR.md](../../SDK_COMPILER_RUNTIME_ANCHOR.md), [FAST_TDD_NO_BROWSER_LOOP.md](FAST_TDD_NO_BROWSER_LOOP.md), and [SIGNAL_PROTOCOL_EXPERIMENTS.md](SIGNAL_PROTOCOL_EXPERIMENTS.md).
>
> Our first anchor is the **Semantic SDK, contract compiler and deterministic runtime**. Prove source identity, typed semantic interpretation, render/parse/verify, ambiguity blocking, revision binding, canonical single-publication Machine/Human parity, and independently reproducible regressions **headlessly and test-first**. Only once that narrow foundation is stable should we optimize experimental internal languages/protocols: Wiki, visual UI, intent, self-knowledge, agent-native handoffs and encoding variants.
>
> **Do not require Chrome, Chromium or Playwright at this stage.** Stop spending effort installing/detecting browser binaries or creating a `browser_check.py` harness as a prerequisite. A browser E2E test is OPTIONAL and may remain `UI_VISUAL_NOT_RUN`. Preserve any useful existing test scripts/evidence instead of deleting or falsifying them.
>
> Run focused compiler/interpreter/runtime/publishing unit and property tests first. Each bug starts as a failing regression with negative and valid controls. Test the UI state machine with synthetic typing/Enter/mode-switch events and data-only Wiki facts; inspect optional visuals later. Avoid browser rendering in high-volume candidate sweeps.
>
> The current Phase 0 Python implementation is a **reference comparator**, not the desired shipped runtime. The proposed final-stage target is a small TS-family/Wasm semantic kernel with no Node/Python **runtime** and a minimal DOM host bridge if a browser view is used. This choice remains *experimental*: first establish a stable semantic contract and measure Wasm versus alternatives, do not invent a TS/Wasm port or rewrite the baseline prematurely.
>
> Design the fast autonomous loop to trial **many diverse signal protocol variants** against the same fixed SDK meaning and independent checker. Never optimize by weakening correctness, over-rejecting valid commands, or changing frozen expected results. Publish all tested and failed candidates, scores, source hashes and capability packs per the existing every-turn contract.
>
> At your current turn end, publish an actual headless test result, a short risk/blocked summary, and the next smallest falsifiable experiment. Mark UI visual validation as NOT_RUN if necessary. **Do not interpret this as a request to finalize the five Z.ai missions or freeze Ω MVP architecture.**

## Done at this checkpoint when

- Agent's plan no longer lists installing/browser-detecting Chromium/Chrome/Playwright as required.
- Current Phase 0 runtime is tested with commands that already exist (e.g. `python3 lab.py verify`); an eventual Wasm kernel has its own *headless* tests rather than a fictional command.
- Any existing `browser_check.py` remains an optional, later-tier artifact, or is explicitly superseded without deleting evidence.
- TDD test cases and failure witnesses are included; source/fixture hashes and actual measured results are recorded.
- A source-grounded protocol-experiment plan is attached to the **SDK anchor** without claiming signal languages already optimized.

This checkpoint document is a guidance update, **not evidence that a running external agent saw or complied with it**.
