# Identical greenfield Ω product challenge: Prompt Fanout Mini

This is a **real tiny product slice** with deliberate cross-cutting dependencies, not an unbounded reimplementation of old Ω. Purpose: create the same objective tests for E0/E1/E2 and exercise architecture review, execution, UI, permissions, failure handling, and evolving contracts.

## Functional brief (frozen before run)

Build a Windows-first local application of Ω: a small floating input panel in which a user types a prompt, chooses registered targets, previews the fan-out and submits the same content to multiple targets. It displays interpretable target state, cancel/error status and a deterministic event trail. Start with **three local fake provider adapters** named Alpha, Beta, Gamma (replaceable with OpenAI, Claude, Gemini webapp interfaces in a later separate experiment). **No response reading, scraping, credentials, browser sign-in automation, or external transmission in this first slice.**

Minimal runtime:
1. Pure, testable core module accepting `{command_id, prompt, target_ids, dry_run}` and returning canonical validated plan; reject blank input and unknown targets.
2. Provider protocol interface with three deterministic fake adapters simulating accepted, delayed and failed outcomes. Idempotency by command and target; cancellation signals; bounded retry policy.
3. Event stream: submitted / accepted / rejected / cancelled / timed_out; every event tied to command and target and monotonic sequence or comparable ordered metadata.
4. One minimal Windows-visible UI, **prefer Tauri 2** if the tooling is available; otherwise prove the core in a testable local CLI/TUI first and record UI blocked status rather than falsifying completion.
5. Visual transparency: user can tell what Ω interpreted, what is pending, what executed and what was skipped. No silent action on ambiguous/unsafe commands.
6. Tests including 3-target fanout, idempotent retries, one offline target, one delayed target, cancellation race, restart replay and deterministic command interpretation.

## Feature/task slices for controlled experiment

- **T1 — Contract/core:** command parser, target registry, structured events, deterministic tests.
- **T2 — Execution:** fanout scheduler, timeout, cancellation and idempotency. Depends on T1 interfaces.
- **T3 — Surface:** floating panel or demonstrable UI with prompt, target choices, preflight, live state. Depends on T1+T2.
- **T4 — Failure injection:** duplicate execution, reordering, interrupted process, stale adapters, provider failure. Cross-cuts T1–T3.
- **T5 — Migration:** change command schema (add `run_id`, rename one status) and update all clients/tests. Cross-domain context challenge.
- **T6 — Maintainability:** fresh worker fixes a deliberately seeded semantic bug in unfamiliar component. Benchmark discovery/review cost.

## Definition of accepted product value

A slice counts only when (a) testable artifact is present, (b) tests pass, (c) independent reviewer confirms behavior against acceptance criteria, (d) change is integrated into arm's main, (e) no security/semantic regression fails, (f) logs show objective runtime proof. A UI screenshot alone is insufficient.

## Experiment structure

Start from one hash `GREENFIELD_BASE_SHA` containing product brief and minimal empty scaffolding. Clone the same baseline into `arms/e0`, `arms/e1`, `arms/e2`; separate OS processes, provider sessions and persistent context stores. Use identical task cards, defect injections, budget accounting, and acceptance graders. Within one arm, branch only short-lived task worktrees; integrate accepted work to **one arm-specific main**. Do not merge experimental arms during measurement.

## Product-vs-protocol separation

- `product/` = the app, changed by worker teams.
- `ecp/` = the orchestration experiment, independent of product runtime.
- `evidence/` = graded results and unfiltered execution hashes.
- `fixtures/` = stable task and fault-injection cases.

**Do not claim three external providers are integrated** when only mock adapters run. External provider automation must be a separate, permission-aware experiment with direct user action and confirmed capabilities.
