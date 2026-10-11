# COMPUTER 4 — Live Typing UI, Human Confirmation, and Accessibility

Mission ID: C4. Build the best **locally runnable full-stack web V1 command box** that demonstrates a visible governed interpretation, with independent sub-agent UI strategies and a blinded UX/hard-gate evaluator. Do not wait for another computer: use a locally pinned Run A reference and design an adapter so a stronger TS port can be substituted.

## Required source / bootstrap

Clone https://github.com/owenservera/VOMEGA and read elephant-greenfield-omega/PROJECT_START_HERE.md, 01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md, 05_UNIVERSAL_ELEPHANT_DNA, and 07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/README.md. The repository's previous 07 staging commit DOES NOT itself contain all Run A/B benchmark source files. The operator-provided **07_OMEGA_full.zip** is the canonical additional input. Locate or obtain that exact archive; inspect and SHA-256-manifest it before any benchmark. It contains runA/engine.py, osl.py, proofs.py, fixture.json, omega.osl, variants.osl, runB_executed/run.py, Run A cross_runB.py, and benchmarks/B1..B4 scaffolds. If absent, search actual repository first, then return SOURCE_BLOCKED with exact missing paths; DO NOT hallucinate golden files, clone another unrelated source, or claim measured outcomes. Do not treat the benchmark documents as completed evidence.

## Operating contract (applies to your whole computer)

You are ONE independent autonomous GLM 5.3 Flash computer mission, not one tiny chat task. You may create bounded local sub-agents/worktrees, run for a substantial session, and iterate through design → code → independent tests → counterexamples → fix → retest. Allocate internal specialists yourself, record their independence and conflicts, avoid shared permanent branches, and assemble ONE finished clean result. Do not depend on other computers being finished. Never edit existing Elephant frozen benchmarks or the universal DNA canon. Preserve every original source byte. Do not touch real provider credentials, live sessions or outside APIs; local mock providers only. Use zero unapproved effectful execution. No fabricated latency, tokens, agent counts, or scorecards. Label each numerical outcome MEASURED/ESTIMATED/UNKNOWN, with machine, code commit, command, denominator and logs.

Create one self-contained deliverable under .project/deliverables/semantic-sdk-five-computers/<your-computer-id>/ or an equivalent exportable ZIP, containing README.md, source, tests, run.ps1 (Windows) plus cross-platform runner, scorecard.json, provenance.json, failures.jsonl, capability-packs/ (including blocked/unchanged), and NEXT.md. Capture complete shell stdout and stderr. Independently replay against a frozen fixture where appropriate. Keep public development fixtures distinct from evaluator-only holdouts. Publish a complete all-maturity capability-pack portfolio at the end of every meaningful turn; do not silently skip unfinished items. Commit only your owned, non-sensitive output to a short-lived branch/worktree or export a ZIP; no competing long-lived owner branches and no unapproved merge to main. Follow the existing Lab's publication contract. Acceptance requires runnable artifacts and independent local reproducer, not a convincing design memo.

## Semantic safety invariants

Provider != Account != Model != Session; Capability != realization; evidence != authority. Readings are deterministic, re-parsed, complete and collision-tested, but the semantic digest alone MUST NOT authorize execution. Known competing parses or a stale/revised display block the action; the executor separately verifies exact shown reading, frozen command, source/grammar revision, target account/session epoch, permissions/consent and effects at dispatch. Quoted text remains payload. No production credentials or real external provider calls.


## Work sequence

1. Clone VOMEGA, verify original archive, run the Python Run A baseline; define a small typed boundary: interpret(input, env snapshot), preview(candidate, display revision), confirm(preview ID), and mock-execute. Do not let UI call a model output as an action. Track state revision on EVERY edit and invalidate previous confirmation.
2. Fan out UI policies inside this computer: immediate updates, debounce, stable prefix, pause-to-commit, prediction+confirmation, and hybrid. Keep the same command semantics across approaches and select by observed workload, not taste.
3. Implement simple responsive floating command input on a mostly empty infinite-canvas-like web surface; accessible keyboard-only flow, visible deterministic reading, why trace/help, alternative candidate choices, prompt payload highlighting, account/provider/model identity and "words leave computer" warning. Keyboard users must never be trapped; test screen reader announcement ordering.
4. Add history and repeat with fresh read/confirm, workspace open, label customization, help compiled from declaration (if compiler cannot produce it, report truthful fallback), and stop pending mock send. Provider/account settings remain read-only; no real login credentials; mock providers only; localhost development.
5. Script keystroke replay with ambiguous prefixes, rapid edits, paste, IME composition, quotes, aliases, provider/account changes, and slow interpreter response. Record input-to-displayed-reading p50/p95, number of meaning changes, visual churn/flicker, stale preview rejection, confirmation correctness, keyboard and accessibility test outcomes.
6. Demonstrate attack: input produces READY+ambiguous; UI must offer explicit alternatives and block run. Changing any text after seeing a reading must refuse previously cached confirmation. A mock provider response cannot authorize the next action.
7. Export a standalone installable dev web app + mock adapters, local no-key server if needed, and contracts for later Tauri integration without adding Windows-native runtime now.

## Deliverable

Working app, scripted UI benchmark and accessibility test logs, six policy scorecards and chosen winner, end-to-end confirmation-gate tests, demo screenshots or recording if available, and C4 scorecard. Preserve negative outcomes and indicate whenever a dependency is stubbed.

## Reject

No fake provider integration; no "live semantics" if screen displays stale language; no invisible parse corrections; no reuse of old user approval on history repeat.
