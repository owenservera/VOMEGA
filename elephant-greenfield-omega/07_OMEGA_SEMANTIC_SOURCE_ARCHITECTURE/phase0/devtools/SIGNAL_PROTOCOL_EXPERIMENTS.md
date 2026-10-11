# Experimental internal languages & signal protocols — research map

**2026-10-11 | STATUS: EXPLORATION DESIGN; nothing here is ratified Ω language syntax or an implemented compiler feature.**  
**Anchor first:** [Semantic SDK → Compiler → Runtime](../../SDK_COMPILER_RUNTIME_ANCHOR.md).  
**Method first:** [headless test-driven loop](FAST_TDD_NO_BROWSER_LOOP.md).  
**Interop candidate:** [WebAssembly final-stage publisher](proposals/wasm-semantic-publisher/README.md) is one replaceable realization; not a mandatory protocol or whole-system design.

## Why “many, many signal protocols” is a useful lab concept

Do not prematurely assume that the optimal LLM-native internal language is natural-language English, JSON, XML, RDF, A2A, a sequence of special tokens, a visual symbol system or any one new Ω dialect.

Treat a **signal protocol** as a versioned encoding or interaction rule for **a semantic fact, intent, explanation, source reference, state transition or exchange**. It may encode the same typed meaning in different ways for different consumers: human, smaller/faster language model, expert Elephant, compiler, browser UI, or machine verifier.

To be comparable, a candidate must declare: `what it denotes`, `what it cannot denote`, `how it is read/rendered`, `its source and revision basis`, `which invariants are retained`, `how ambiguity/unknown is signalled`, and `how to independently check the round-trip`. **No encoding can grant execution authority merely by being expressive.**

## Core invariant: one semantic meaning, experimental representations

```text
NATURAL INPUT / SOURCE FACT / AGENT SIGNAL
                │
                ▼
       compiled typed semantic IR       ◀── stable, versioned SDK anchor
                │
       ┌────────┴──────────────────────────────────────────────────┐
       ▼                   ▼                ▼             ▼       ▼
  Human sentence        Wiki facts      UI language   AI native   compact binary
  / Plain Reading        / context     / visual cue    capsule     / diff
       │                   │                │             │       │
       └───────────────────┴────────────────┴─────────────┴───────┘
                                   │
                         test denotation and loss
                                   │
                                   ▼
               accept / reject / defer / experimental only
```

Human/Machine can **publish precisely one canonical record**, but their *presentation bytes* differ. The fact/provenance/effect set and publication identity must be invariant across projections. A renderer must never create a new semantic fact by embellishment.

## Experiment families — not a fixed ontology

| ID | Family | Representative candidate protocols | Primary research question |
| --- | --- | --- | --- |
| SP01 | Typed intent | slot graph, declarative AST, decision lattice, constrained NL | Can the same user phrase always map to an unambiguous typed meaning or explicit alternatives? |
| SP02 | Grammar/resolution | template grammar, parser combinators, generated tables, segment-boundary annotations | Can we stop account/prompt swallowing without losing valid input coverage? |
| SP03 | Plain Reading | short declarative form, first-person action, progressive consequence disclosure, editable structured sentence | Which wording best lets different humans identify the actual target, payload and effect? |
| SP04 | Explanation/why | rule IDs, proof tree, minimal witness, causal counterfactual, source-span graph | Can a human/agent identify **why** an interpretation was produced with little context? |
| SP05 | Auto-Wiki | contract fact graph, code reference map, executable examples, linked provenance, editorial annotations | Can every statement be kept current after source/grammar changes? |
| SP06 | UI meaning signals | state icons, negative-intent choices, chips, predictive correction, revision colors, ambiguous-path visualizations | Can users detect/correct semantic misunderstanding earlier, not merely faster? |
| SP07 | AI-native exchange | typed work capsule, constrained decoding schema, handoff diff, linked evidence packet | Which encoding most faithfully preserves meaning across different model families? |
| SP08 | Self-knowledge | source-addressed code facts, semantic dependency graph, model capability manifest, wiki/contract reflection | Can the system truthfully describe what it can do at the current source revision? |
| SP09 | Context and memory | compact references, incremental updates, reconstructible context capsules, evidence-first recall | Does compression reduce tokens without dropping the facts needed for correct decisions? |
| SP10 | Confidence and disagreement | possible readings, uncertainty state, contradiction signal, adjudication request | Does the protocol expose uncertainty rather than silently choosing? |
| SP11 | Effects, permission and provenance | explicit effect annotations, display-consent binding, taint/authority separation, source staleness | Can the verifier prove no signal or model answer silently authorizes execution? |
| SP12 | Symbolic/visual notation | source-bound glyphs, short tags, color/shape encodings, progressive detail | Can experts and newcomers recover identical semantics without opaque visual assumptions? |
| SP13 | Agent/lab measurement | counterexample frame, scorecard schema, coverage signal, drift map, reproducible seed | Can agents compare real experiments with minimal coordination overhead and no metric laundering? |
| SP14 | Transport-neutral packaging | native binary, structured JSON, typed envelope, selective disclosure, A2A/MCP adapters | Is meaning preserved independent of envelope, transport, encoding and implementation? |
| SP15 | Cross-language semantics | locale-neutral IDs, translation-linked templates, culturally stable consequences | Can a new natural language render the same verified meaning without altering semantic authority? |
| SP16 | Protocol evolution | version negotiation, migration witnesses, feature gates, reversible rollbacks, compiled-delta update | Can one language improve without corrupting existing publications or downstream consumers? |

The families above are **initial experimental axes** and may be subdivided, merged or rejected with evidence. Do not encode these labels as compulsory compiler keywords. Test unseen combinations as compositional protocol bundles, not only one dimension at a time. Useful protocols may be composite (e.g. source-backed Wiki + agent-capsule deltas + Plain Reading alternatives).

## Candidate experiment card (data contract proposal)

Each proposed variant is associated with a small versioned manifest:

```text
protocol_id, version, family, parent_variant_id, maturity
hypothesis, target_consumer, what_meaning_is_encoded, loss_bound
input_format, output_format, grammar_or_transform_reference
source_hash, compiler_hash, semantic_contract_hash
denotation_and_inverse_checker, known_unsupported_states
safety_invariants, ambiguity_policy, provenance_references
public_fixture_ids, hidden_fixture_receipt, mutation_controls
comparators, observed_results, costs, confidence, regressions
publication_content_hash, rollback_to, approval_status
```

The [sample manifest](SIGNAL_PROTOCOL_CANDIDATE_V0.json) is illustrative: no scores are measured and no syntax is frozen. For candidate languages that are intentionally lossy (e.g. tiny visual badge), report *exactly which facts are omitted*, and prevent that lossy projection from becoming the sole executable meaning or canonical publication.

## Fast experiment scheduling without changing foundational semantics

**Phase A — establish anchor:** prove compiler/runtime contracts; preserve source/fixture identity and independent scorer. Protocol ideation can proceed in isolated scratch repositories but produces design-only packs.

**Phase B — rapid protocol sweeps:** start with inexpensive bounded mutations of a *single surface* (reading template, candidate choice layout, Wiki fact projection, explanation encoding). Generate many variants upstream, compile once per candidate or load delta images, run all candidates over **the same** accepted SDK kernel and corpus. Collect compact counters, failed witnesses and reconstruction hashes; **do not launch Chrome or render HTML for each variant**.

**Phase C — high-signal combinations:** test promising pairings (e.g. SP02 grammar resolver × SP10 ambiguity signal × SP03 reading), keeping matched cohorts and independent hidden cases. Avoid selecting apparent winners only from public generated templates.

**Phase D — human/agent fidelity:** only then add participating humans, agent-to-agent relays, UI comprehension, wiki navigation and codebase task efficacy. Independently judge end-to-end corrections, true token cost and source freshness, rather than assuming shorter encodings are better.

**Phase E — lab promotion:** passing a benchmark allows an *experimental cohort version*, not an unreviewed production protocol. Preserve losers, counterexamples and rollback; update dependent Wiki facts and test maps in one traceable change.

Useful selection algorithms include budgeted tournament, successive halving, targeted adversarial mining and Pareto tracking, **but** the method itself should be compared and all candidates scored on the same required safety metrics. Do not use search to alter frozen expected outputs post-hoc.

## Two customer benchmarks plus two engineering benchmarks

The primary experience benchmarks remain:

1. **Live semantic comprehension:** accuracy, ambiguity surfacing, correction steps, latency of current Plain Reading and effect understanding by real humans.
2. **Wiki coherence:** grounded fact coverage, source hash/range validity, behavior/documentation agreement, stale fact rate and impacted-test discovery.

Engineering support:

3. **Machine/Human parity:** a single canonical publication has two faithful projections, no extra/omitted effects, exact same ID and revisions.
4. **Protocol improvement throughput:** independently verified correct variants per unit wall time and resource, *including* compile, replay, reviewer, failed attempts and source/wiki sync work.

For each candidate, use an immutable experimental cohort and report `MEASURED | ESTIMATED | UNKNOWN`. An error rate of zero without unseen adversarial tests or a sufficiently broad denominator proves little. Always run “reject everything” and “accept everything” as controls alongside silent misparse mutants.

## Starter micro-experiments (after anchor)

- **MP-01 Target/payload boundary:** replay `tell chatgpt personal account balance please`, plus new adversarial phrases, with account/quoting changes. Goal: lose no payload bytes; show alternatives; never authorize ambiguous READY.
- **MP-02 Consequence coverage:** change `leaves-this-computer` to `stays-here` in a *candidate* declaration, then assert compiler invalidates reading, Wiki, fixtures and publication rev consistently.
- **MP-03 Source-backed reflection:** introduce one new capability. Require runtime support, compiler diagnostics, generated Wiki facts and tests to refer to same version; record unsupported compiler constructs as `COMPILER_GAP`.
- **MP-04 One-record two-mode proof:** enter while typing stops, freeze record and switch Machine↔Human 100 times in a deterministic event simulator; unchanged ID, fields, effects, source, no new interpreter call.
- **MP-05 Agent capsule round-trip:** encode the same typed semantic statement in JSON/native/proposed compact capsule, round-trip and measure semantic loss vs actual bytes/tokens. Independent reader blinded to encoding changes.
- **MP-06 Fast variation factory:** synthesize a batch of 1,000 candidate wording/resolution variants *only if feasible*, cap budget beforehand, compile and test against the same corpus with negative controls. Report all variant outcomes and **actual** total wall time rather than promising a target throughput.

Numbers in these micro-experiments are **proposed cohort sizes**, not evidence that they were run or that Wasm can achieve any target throughput.

## Promotion vetoes and reversible evolution

Never promote a protocol candidate if it changes semantic meaning without a declared migration, enables any unauthorized effect, changes historical publication records, hides ambiguity, omits consequences in the Human view, labels unsourced Wiki prose as checked fact, produces unverifiable compressed capsules, leaks hidden fixtures/real user prompts, or has only self-reported results.

The **core SDK remains small and replaceable**; the optimal internal language remains an empirical question. A signal protocol winning one consumer/workload does not automatically become universal Elephant DNA or required transport.
