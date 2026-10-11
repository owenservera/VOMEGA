# Test-driven feedback loop — choose headless or browser tests by the learning signal

**2026-10-11 · Status: UPDATED / supersedes previous categorical no-browser checkpoint.**  
**Governing rule:** [⚓ Machine ↔ Human co-evolution](../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md).  
**Note:** Original no-browser instruction and test pyramid are preserved in Git history; this is a correction of scope, not deletion of experimental evidence.

## The test target is ONE loop, not separate phases

**Input → SDK/compiler/runtime interpretation → one canonical snapshot → Machine/Human projections → difference relative to intent/source/reader → candidate revision → replay and independent verification → new observable snapshot.**

Tests are the **instruments and safety referees of this same feedback circuit**. They don't become a separate "first perfect the kernel" program; nor do we spend engineering cycles installing a UI test tool to verify purely textual parser semantics.

A **UI/Wiki mismatch is often the key learning signal** driving a grammar/compiler/runtime change. Browser-based tests are therefore legitimate and may be the fastest way to reveal it. The agent report of reducing rapid-typing queue delay (demo median 540→26 ms, devtools p95 681→37 ms, five trials per arm) is **EXTERNALLY REPORTED**, not independently reproduced in this turn; preserve its patch and source/bench context, then compare against the corrected baseline. The slowdown could not have been inferred from parser-only timing.

## Pick the cheapest authentic evidence for the question

| Question / feedback | Best first test | Browser required? |
| --- | --- | --- |
| Grammar consumes wrong payload words | Compiler/runtime headless unit test + real Machine/Human reading witness | No |
| Machine JSON vs Human Plain Reading disagree | Canonical record round-trip + renderer facts/HTML AST projection and independent fact comparison | No |
| Wiki source anchor changed | Source hash/provenance diff, projected Wiki fact coherence, semantic expectation | No |
| One input edit invalidates prior permission | State-machine replay plus existing mock gate; optionally real DOM race test | No for core, optional for UI |
| Live sentence displays stale or flickering meaning | Actual browser typing/test instrumentation; runtime trace | **Yes when assessing real display behavior** |
| Accessibility, layout, tap/keyboard correction | Browser/human testing | Yes |
| Agent-native capsule loses intended meaning | Data-only multi-agent reconstruction and semantic comparison | No |
| Thousands of variant replays | Same compiled engine, headless batch, independent corpus and negative controls | No |
| What text do real people understand? | Consent-based human tasks and explicit comprehension annotation | Human evaluation; browser often useful |

**Neither ban nor require Chromium/Chrome/Playwright globally.** It is fine if unavailable on a workstation: report `UI_VISUAL_NOT_RUN` and continue checks that can genuinely run; don't claim browser fidelity from headless-only results. If a browser is already installed, use it on a clearly relevant feedback question; preserve CSP and avoid weakening protections to make tests pass.

## Test-driven step for each semantic feedback case

1. Freeze exactly what was **observed**: typed text, Machine command/status, Human Plain Reading/Wiki/actual screen comprehension, source+contract hash, revision and trust label for the expected meaning.
2. Name the **discrepancy** between intended / interpreted / rendered / source truth. A paired Machine/Human view can both be wrong about intent; do not mark mere parity as correctness.
3. Create one **failing reproduction** anchored to that discrepancy, one positive case and at least one negative/mutant control. The test may run with a headless renderer, browser or both, depending on the actual failure.
4. Generate competing corrections from this SAME feedback case: grammar/parser, compiler IR, runtime, Wiki source projection, word choice or UI signal may all be plausible. Do not assume the fix location.
5. Replay candidates automatically against public, held-out/adversarial and historical regression cases. Each run produces Machine raw record and the semantically faithful Human projection (rendered or data-only structured facts); check intent alignment with appropriate evidence and verify safety.
6. Compare true end-to-end turnaround and safety, not isolated parse speed. Report source revisions, denominator, actual test environment, simulated/human ground truth, failed attempts and over-rejection.
7. Activate only a verified lab candidate, update Wiki/explanation and runtime together, retain old immutable publications for replay/rollback. Publish all candidate packs at turn close including failures.

## Current reference and portable proposal

Phase 0's Python interpreter and devtools remain an existing experimental reference; its tests and the agent's browser findings are useful baseline signals, not migration instructions. The proposed final-stage TS-family/Wasm kit remains **NOT_IMPLEMENTED**; upstream agents/build/test tools have no monolingual runtime restriction. Its hot path aims to have no Python/Node runtime dependency and uses a tiny audited DOM bridge for a browser Human view. Verify language-specific fidelity and Unicode behavior rather than assuming Wasm is faster.

## Headless event-trace example

The same representation feedback can be tested before browser layout checks:

```json
{
  "case": "dual-view-stale-revision/1",
  "events": [
    {"type":"edit","rev":1,"text":"ask claude"},
    {"type":"edit","rev":2,"text":"ask claude work to hello"},
    {"type":"interpret_finished","rev":1},
    {"type":"interpret_finished","rev":2},
    {"type":"enter","rev":2},
    {"type":"view","mode":"Machine"},
    {"type":"view","mode":"Human"}
  ],
  "expected": {
    "published_revision":2,
    "one_publication":true,
    "mode_switch_reinterprets":false,
    "effects_authorized":false,
    "source_facts_revisions_match":true
  }
}
```

**This is an illustrative test-case shape, not executed evidence.** The actual application implementation may use another representation.

## Acceptance for one genuine improvement

One observed Machine/Human discrepancy is reproduced, fixed in the responsible component, replayed through the **full** Machine+Human semantic interface, independently checked with both valid and adversarial controls, published as a new experimental revision, and accompanied by explicit evidence. No extra software-install hurdle can be introduced unless the test signal truly requires it.

The test suite is an **instrument of the one learning loop**, not a first/second/third project plan.
