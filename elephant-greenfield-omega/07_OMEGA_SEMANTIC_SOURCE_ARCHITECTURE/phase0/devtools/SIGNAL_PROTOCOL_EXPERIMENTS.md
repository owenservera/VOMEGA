# Experimental internal languages & signal protocols — research map

**2026-10-11 | STATUS: EXPLORATION DESIGN; nothing here is ratified Ω language syntax or an implemented compiler feature.**  
**Rule 1:** [Machine ↔ Human co-evolution is the only semantic learning loop](../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md). The SDK/compiler/runtime and Human/Machine representations are developed **together**, not in sequential stages.  
**Method:** [test-driven loop with browser checks when they provide a signal](FAST_TDD_NO_BROWSER_LOOP.md).  
**Interop candidate:** [WebAssembly final-stage publisher](proposals/wasm-semantic-publisher/README.md) is one replaceable realization; not a mandatory protocol or whole-system design.

## Why “many, many signal protocols” is a useful lab concept

Do not prematurely assume that the optimal LLM-native internal language is natural-language English, JSON, XML, RDF, A2A, a sequence of special tokens, a visual symbol system or any one new Ω dialect.

Treat a **signal protocol** as a versioned encoding or interaction rule for **a semantic fact, intent, explanation, source reference, state transition or exchange**. It may encode the same typed meaning in different ways for different consumers: human, smaller/faster language model, expert Elephant, compiler, browser UI, or machine verifier.

To be comparable, a candidate must declare: `what it denotes`, `what it cannot denote`, `how it is read/rendered`, `its source and revision basis`, `which invariants are retained`, `how ambiguity/unknown is signalled`, and `how to independently check the round-trip`. **No encoding can grant execution authority merely by being expressive.**

## Core invariant: one published meaning per revision, with representations that generate learning signals

```text
NATURAL INPUT / SOURCE FACT / AGENT SIGNAL
                │
                ▼
       compiled typed semantic IR       ◀── versioned, co-evolving SDK anchor
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
       FEEDBACK CASE → fix grammar/compiler/runtime AND/OR projection
                  → replay all representations → accept/reject
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

## Continuous loop: protocol experiments ARE SDK/compiler learning

The previous “Phase A establish SDK, Phase B vary representations, Phase C combine” formulation is **superseded**. The representations supply the only semantic learning signals that warrant changing the compiler and runtime. There is no independent phase of optimizing Wiki/intent/AI-native language after a finished core.

**For every iteration:** (1) present current machine meaning and Human Plain Reading/Wiki/self-knowledge/agent representation; (2) observe discrepancy versus intended meaning, source evidence, communication or comprehension; (3) create a provenance-labelled feedback case; (4) generate candidate compiler, parser, runtime **and/or** representation changes; (5) replay the exact Machine/Human view contract with public and held-out tests; (6) independently validate safety and truth; (7) accept a new experimental version or publish a rejected counterexample. Return immediately to observation.

**Fast protocol sweeps:** agents may synthesize many variants of a reading, resolver, semantic IR, source/wiki mapping, AI-native capsule or negative-intent signal from the same feedback case. Replay without DOM where possible, but the headless Human projection **must express the same fact set** that the human interface would render. Use real-browser/human checks where the observed discrepancy is about timing, layout, choice clarity, accessibility or comprehension.

**Cross-family experiments:** SP02 grammar resolver × SP10 ambiguity reporting × SP03 reading are a **single candidate hypothesis** if together they close the observed discrepancy. Compare alternatives using the same cohort. Compiler and runtime contracts themselves may change through explicit revisioned migrations when representational feedback proves the old model insufficient; never quietly mutate old frozen source or reinterpret an old publication.

**Review and activation:** independent negative and positive controls guard accepted changes; they do not generate an unrelated roadmap. Every turn publishes the full all-state pack set including rejected and blocked candidate experiments. Promotion is to a versioned *lab cohort*, not automatically to production/Universal DNA.

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
