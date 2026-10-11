# Benchmark plan — live interpretation, Human/Machine parity, Wiki coherence and lab speed

**Status:** PRE-REGISTRATION DRAFT / NO NEW WASM MEASUREMENTS / ALL NUMERICAL TARGETS PROPOSED UNTIL TESTED.  
**Source baseline:** [current PRD and evidence](../../PRD_AND_DESIGN.md); [Phase 0 original corpus and mock gate](../../../README.md). Existing Python and devtools experiments are comparator results, not Wasm results. Keep independently verified results separate from author-scored values.

## Why these are distinct axes

The owner identified **two product-development benchmarks**:

- **B-LIVE:** As a person types an ordinary-language command, does the interpreter show the correct, comprehensible, timely sentence and the right choices/consequences?
- **B-WIKI:** For the currently displayed interpretation, does the Wiki panel truthfully explain the exact declared source, parameters, consequences, why-trace and impacted tests, staying synchronized under edits?

These cannot be reduced to a single score. A correct sentence with false Wiki is a failure; a correct Wiki whose display lags the input is also a failure.

Two enabling experiments are separate, not substitutions for the above: **B-PARITY** (same canonical publication in Machine/Human modes) and **B-VELOCITY** (candidate refinement throughput and end-to-end effort). Safety correctness remains a veto, not a tradeable speed metric.

## General experimental method

For each metric record: `fixture_id`, `seed`, `source_sha`, `contract_sha`, `wasm_sha`, `host/browser/runtime versions`, `hardware`, `warm_or_cold`, `sample_count`, `elapsed_ms`, `result_category`, `raw_witness_location`, `evaluator_revision`. Report MEASURED, ESTIMATED (with formula) or UNKNOWN; missing counter = UNKNOWN, never zero.

Run on both frozen source-generated test cases and separate independently authored realistic/adversarial utterances. Document language coverage and account/provider fixtures. Public golden files are for development; held-out cases stay with referee. Aggregate by error class as well as by text count to avoid near-duplicate floods.

## B-LIVE: edit → correct visible meaning

**Experimental arms:** Phase 0 original reference, Phase 0 devtools current Python bridge, Wasm candidate with minimal host bridge, conventional lean JS/TS comparator (same declared semantics where possible). Compare exact meaning before optimizing event policy.

**Cases:** prefix buildup one keystroke at a time; rapid edit; typing pause; paste; deletion; IME composition; quoted provider names; `please` kept inside payload; provider/account aliases; model/provider mismatch; single and multi-account fan-out; `NEEDS_CHOICE`; forged reading tail; invisible Unicode; changed contract during typing; reversed asynchronous completions.

**Metrics** (all defined with observable start/stop):

- `edit_to_current_reading_ms p50/p95/p99`: browser input event timestamp to DOM commit of reading **for the same revision and contract**; log stale response suppression separately.
- `interpret_compute_ms` and `bridge_overhead_ms`: isolate Wasm kernel vs host and Unicode buffer conversions.
- `revision_freshness_rate`: number of on-screen interpretation updates matching newest input revision / all displayed updates; false fresh displays must be zero at acceptance.
- `meaning_accuracy`: adjudicated command semantics correct / adjudicated cases. Report separately READY, choice, invalid and unknown.
- `false_ready_rate` and `unsafe_effect_count`: wrong semantics returned READY and any effect without full consent. An ambiguity warning alone does not zero false READY; actual execution must be blocked by an independent gate.
- `correction_steps`, `choice_success`, `reading_churn` and `visual_flicker`: scripted traces with explicit rules; judge comprehensibility through real participant tasks, not Flesch-Kincaid alone.
- `comprehension_accuracy`: participants identifying exact target, payload and consequence before consent / randomized human tasks; report participant/task denominator and uncertainty.

**Falsifying controls:** an intentionally delayed response, a dropped `please`, a suppressed ambiguity flag, a mismatched account, a stale revision showing current, and "always UNKNOWN". The harness must detect them. If it doesn't, the benchmark itself is untrusted.

## B-WIKI: what is displayed vs source truth

A linked Wiki panel is part of the user's visible semantic verifier; it does not become an independent AI explanation authority. Benchmark it as follows:

- `declared_fact_coverage`: declared capabilities/parameters/consequences/templates/why-lines with correct source-anchored Wiki facts / total expected declared facts in the pinned contract. A declaration-backed page is labelled DECLARED, not behavior-proven.
- `source_basis_match`: rendered facts whose source hash/range resolves to current/explicitly frozen revision / all displayed grounded facts.
- `projection_parity`: facts in Human Wiki with matching canonical Machine fields/IDs / all assertive Human facts; no omitted consequence or account.
- `impact_recall`: preregistered affected Wiki pages/tests identified after a source mutation / all independently identified affected pages/tests.
- `impact_precision`: verified affected outputs among tool-flagged outputs; do not reward falsely declaring everything affected.
- `stale_fact_events`: current-labelled fact with stale source revision; should be zero for certified claims.
- `false_documentation_assertions`: UI/Wiki promising a behavior that no checked declaration/source supports. Editorial claims must have a visible UNVERIFIED status.
- `wiki_update_ms p50/p95`: source/contract activation to current marked Wiki facts being visible; separate "candidate compile" duration from "UI projection" duration.

**Mutation cases:** change egress consequence; change provider/model compatibility; rename a capability; remove a `say` template; change a `hear` rule; change a rule explanation; drop source trace; reorder source without semantic change; modify a test only; introduce a deliberately missing dependency edge.

**Controls:** orphan Wiki page, stale Wiki after source change, false "words stay here" statement, disappearing declared model constraint, invented template help, and all-capabilities impact explosion. A benchmark that only checks source SHA, without behavioral truth testing, is insufficient.

## B-PARITY: one publication, two projections

Prerequisite: Machine raw bytes must be canonical and round-trip parsable. Freeze a single record, then switch views repeatedly without invoking `interpret` or allocating a new semantic command. Test:

1. Same `publication_id`, `publication_digest`, source rev, status and choice/alternatives in both views.
2. Every Human semantic assertion maps to a canonical record field and source anchor; no ungrounded new intent.
3. Rendering must escape input text safely and preserve exact quoted payload bytes; bidi, confusables and controls follow versioned explicit rejection/label policy.
4. Switching mode may not create an effect, infer a missing account or grant permission.
5. Editing a field after Enter creates a new publication; old frozen bytes and historical version remain identical.
6. Digest verifier independently changes one field at a time (effect, account, status, reading, source hash, Wiki fact) and must detect mutation.

**Hard acceptance:** exactly zero parity discrepancies in preregistered cohorts and **zero unauthorized mock effects**, with dataset size and limits published. A zero discrepancy over only a trivial 10-case sample is not general proof.

## B-VELOCITY: loop automation and thousands of experiments

Measure three distinct latencies:

- `single_batch_compute`: one built Wasm module executes a fixed N-utterance batch, with all input/output copying included.
- `proposal_to_full_score`: a grammar/render/Wiki variation enters the pipeline → compile+verify+replay+impact report; includes cold/warm build time, failures and evaluator time.
- `accepted_correction_time`: observed human correction → review-adjudicated candidate promoted into an experimental cohort with no regressions; includes human/agent time and rejected variants.

Report throughput in `cases/s`, `tested_variants/min`, `verified_revisions/day` only with actual wall times and fixed denominators. Also capture peak memory, Wasm binary size, startup time, UI frame drops, compilation cache hit/miss and result-file bytes. **High throughput that increases wrong READY is not a win**.

Arms: (1) Phase 0 Python reference batch, (2) straightforward lean TS/JS batch, (3) TS-family Wasm candidate, (4) optional optimized Wasm grammar tables. Use same corpus and artifact boundary, compare warm and cold, record clocks and hardware, run repeated trials, and report negative outcomes. Evaluate candidate compile costs, not just per-utterance runtime.

**Minimum conceptual smoke target, not measured:** DOM-free processing of at least 1,000 cases in one batch through the same kernel as the live UI, followed by a 10,000+ item stress cohort if feasible. Any `20ms` or `million cases/sec` claim remains a hypothesis until hardware/browser and measurement methodology are recorded.

## Security and evidence veto matrix

| Negative injection | Expected disposition |
| --- | --- |
| Competing parses while status says READY | May publish diagnostic/ambiguous record; **no effect authorization** |
| Enter with incomplete input | Publishes NEEDS_INFO/CHOICE diagnostic, not a selected command |
| Old input revision finishes last | Cannot replace current text/meaning/Wiki as current |
| Consequence changed after publication | Previous publication remains immutable; new contract revision needed |
| Edited account/session/policy after display | Any later mock permission grant invalidates |
| Corrupt Machine JSON vs readable view | Parity FAIL, no trusted certification |
| Untrusted HTML embedded in input | Render as text; never execute injected markup |
| Developer changes expected result to pass candidate | Reject unless separately adjudicated with provenance |
| Candidate refuses all cases | Wrong on positive controls |
| Missing Wiki source edge | UNKNOWN/INCOMPLETE coverage, cannot claim no impact |

## Relationship to existing benchmark families

- **B1 Command Fidelity:** semantic correctness vs strong parser/model alternatives. B-LIVE is the human editing/rendering slice, not a replacement for B1.
- **B2 Agent Context:** benefit of compiled capsules and source-grounded retrieval. Wiki source graph is relevant input but not evidence of B2 performance.
- **B3 Handoff Fidelity:** versioned publication envelopes can be routed via any tested carrier; A2A is a candidate carrier, not mandatory semantics.
- **B4 Change Velocity:** B-VELOCITY's end-to-end compiler/correction loop should be directly comparable to an independently built behavior-equivalent conventional TS twin. This is the strongest falsifier of the claimed development-supercharging gain.

## Benchmark-release requirements

Each arm publishes its source/hash, exact input corpus, code and run command, scorecard.json, failure-case witnesses, derivation/Wiki delta report, full turn-pack inventory, and explicit `NOT_RUN`/UNKNOWN for missing arms. **Promotion must never hide rejected candidates or reinterpret an author's reported result as independently measured.**

**Current status:** All proposed **Wasm-specific** scores NOT_RUN. Existing Phase 0 measurements belong to its own cohorts, and the two-axis prototype PRD contains definitions rather than proof of WebAssembly speed or human comprehension.
