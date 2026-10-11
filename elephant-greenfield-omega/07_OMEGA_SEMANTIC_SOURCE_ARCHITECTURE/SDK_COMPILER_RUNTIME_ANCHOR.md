# ⚓ Ω Semantic SDK → Compiler → Runtime: development anchor

**Date:** 2026-10-11  
**Status:** OWNER-DIRECTED ORDER OF WORK / scoped research anchor; specific implementation, DSL, Wasm toolchain and Ω product architecture **NOT FROZEN**.  
**Scope:** the Semantic SDK R&D and its LLM-native automated development laboratory. Do **not** promote this file into Universal Elephant DNA or overwrite the existing MVP north star, frozen fixture, source custody or other active Elephant workstreams.

## 0. The ordering matters more than the implementation fashion

**First nail down the semantic SDK, its contract compiler and its runtime. THEN optimize the internal language and its projections: intent, Wiki, UI/Plain Reading, self-knowledge, agent-native interchange, explanation, context/memory, visual signals, and further signal protocols.**

This is not a claim that language experiments cannot be researched in parallel. Agents may design hundreds of candidate encodings early; **they cannot define the foundational runtime semantics by accident**. Competing language/protocol variants must conform to a stable, small, versioned semantic kernel contract to be fairly compared.

```text
              ANCHOR PHASE (prove the engine, not the presentation)
    typed declarations → compiler/checker → versioned semantic IR
                                               │
                                               ▼
                                  deterministic runtime
                              interpret / render / verify / freeze
                              canonical semantic identity + evidence
                                               │
                            independently reproduced conformance gate
                                               │
                                               ▼
                      stable minimal testable contract/ABI
                                               │
                  ┌────────────────────────────┼──────────────────────────┐
                  ▼                            ▼                          ▼
          LANGUAGE EXPERIMENTS           AUTOMATION LAB              OBSERVABILITY
    intent/wiki/UI/agent-native/etc.   batch variants + referee   traces+metrics+packs
                  │                            │                          │
                  └────────────────────────────┴──────────────────────────┘
                                               │
                                     measured promotion only
```

The **engine** must be trustworthy enough to compare language variants before optimizing the language. The compiler, renderer and runtime belong in the foundational SDK; the particular human wording, Wiki presentation and signal alphabets are revisioned experimental projections.

## 1. Anchor deliverable: smallest useful semantic SDK

The minimum SDK is a library/ABI with explicit, replaceable stages:

1. **Contract source and parser:** revisioned declarations for capability IDs, typed fields, account/provider/model/session distinctions, consequences, rendering templates, recognition rules, provenance and permitted environment assumptions. Unknown declaration features fail compilation rather than becoming implicit code defaults.
2. **Compiler:** deterministic compilation to typed IR, stable concept/field IDs, recognition grammar/decision table, deterministic Plain Reading templates, a source-reference map and explicit proof obligations. Compiler diagnostic failures have machine-readable codes and source spans.
3. **Runtime:** consume a *compiled* contract and an environment snapshot; `interpret(input, revision, contract)` returns candidates, exact payload spans, status, missing fields, alternative interpretations, consequences and derivation trace. Runtime does not load a model, choose permissions or call providers.
4. **Renderer / inverse verifier:** render a declared meaning as a complete readable Plain Reading, then independently check parsing, identity, consequence coverage and non-collision within a stated scope. A verified narrow domain is valid; claims of unrestricted natural-language correctness are not.
5. **Canonical identity and publication:** versioned canonical encoding for `{capability,args}` and a separately revision-bound semantic publication containing status, input, rendered reading, trace and source basis. Machine/Human views are *projections of one immutable publication*, never two conflicting sources of truth.
6. **Safety boundary:** a semantic digest is identity, not permission. Ambiguous READY/unknown/partial interpretations cannot cause effects. A later independent mock approval gate checks exact display, consent, source/environment/account/session/policy revisions and one-use authorization at dispatch.
7. **Test interface:** run the identical contract/interpret/render/verify implementation in headless batch and interactive mode; export witnesses, independent comparison data, fixture/source/compiler revision and status.

Minimal Wiki/why source anchors can be included in this foundational contract to prove traceability. **Do not conflate providing truthful anchors with optimizing the Wiki language or its UI.**

### Anchor gate — do not call it nailed until

- An independent evaluator can clean-clone, compile the finite fixture, exercise Run A-derived public vectors, and reproduce raw witnesses (39 corpus entries, 140 READY and 417 state cohort are historical baselines to **verify**, not acceptance proof by themselves).
- A distinct referee/oracle catches deliberately changed command target, omitted consequence, lost payload, wrong prompt boundary, forgotten alternatives, incorrect canonical digest, stale source or forged reading.
- The runtime **blocks effects**, including a READY result with known competing readings; positive valid controls work, so “always reject” cannot pass.
- A repeatable headless, no-browser path validates lexical parsing, typed AST/IR, compiler obligations, rendering and canonical Machine/Human record parity.
- Compiler errors identify unrepresentable declarations. Adding a capability and changing a consequence trigger the correct contract/version, reading/proof invalidation and source impact without manually editing an unrelated wiki.
- API/ABI and source/evidence semantics are versioned with compatibility and rollback tests. Browser-host details and Wasm implementation strategy remain replaceable.
- An independent team can execute the pinned fixture+candidate and explain which metrics are MEASURED versus NOT_RUN/UNKNOWN. Historical Run A's author-generated corpora are not a blind natural-language benchmark.

**Gate does not require:** Chromium, Chrome, Playwright, web deployment, working real provider integrations, full human UI, production-grade Wiki, fully evolved internal language, A2A transport, or speculative million-case throughput. These are optional downstream trials and cannot block the correctness-first SDK foundation.

## 2. Second order: aggressively optimize signal protocols / internal language

Once the narrow anchor contract holds, iterate over **families of signal protocols**, not merely cosmetic English rewrites. Candidate axes include intent recognition grammar and canonical intermediate representations; explanation/why; readable Plain Reading; Wiki source-linking; UI live meaning and correction affordances; agent-native capsules and exchanges; self-knowledge and code lineage; ambiguity and negative intent; symbolic/visual signal vocabulary; progressive disclosure/compression; context and staleness signals.

Each experiment uses a **shared meaning contract** and exports `candidate_semantics, reading, wiki_facts, source_revision, statuses, traces, costs, negative_controls`. It can alter an internal language scheme if it versions its migration and proves equivalent meaning on preserved cohorts, rather than silently replacing the SDK foundation.

Evaluate semantic correctness, composability, source/proof fidelity, human comprehension, model efficiency and end-to-end verified engineering velocity. **The fastest per-token or per-parse encoding is not necessarily the fastest development loop.**

## 3. Three nested feedback loops

- **Inner deterministic loop:** per keystroke or batch item, compile-once/interpret/render/trace from the *currently accepted* contract, no LLM on each key and no UI renderer required for batch. Enter freezes a diagnostic/ready publication, not an action.
- **Middle TDD experiment loop:** red failing test → one semantic/rule/reading/Wiki hypothesis → candidate compile → public and independently held-out positive/negative/mutation tests → scorecard + explicit failures → measured acceptance/rollback into a *lab* contract revision.
- **Outer Elephant development loop:** agents source-ground proposals and alternative protocols, comparison tracks run fairly, independent referee judges, all-maturity capability packs (including failures/unchanged) are published per `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md`. Product/API law is not silently advanced by self-reported benchmark wins.

See [FAST_TDD_NO_BROWSER_LOOP.md](phase0/devtools/FAST_TDD_NO_BROWSER_LOOP.md) and [SIGNAL_PROTOCOL_EXPERIMENTS.md](phase0/devtools/SIGNAL_PROTOCOL_EXPERIMENTS.md).

## 4. Wasm and the monolingual TS direction

Owner preference for the *final-stage lab publisher*: compact, portable WebAssembly semantic computation with a TypeScript-family authored source wherever feasible, no Python/Node **runtime**, no third-party browser UI framework, and only a minimal DOM bridge where a browser UI exists. **This is a candidate realization, not a constraint on the upstream experiments or the SDK's semantic ABI.** Standard TypeScript emits JavaScript; a TS-like Wasm compiler (e.g. AssemblyScript) is one experimental candidate and must be checked against actual semantic and Unicode behavior.

Python Phase 0 remains a historical independent comparator, not a forward production-language commitment. Chrome/Chromium/Playwright are optional *later* end-to-end checks; requiring them now to validate core semantics is premature.

## 5. Change-control / truth

**Frozen:** historical fixture and original source custody, independently identified source SHA/contract IDs, effect safety law, output provenance/evidence, complete per-turn pack publication.  
**Versioned/experimental:** grammar syntax, compiler strategy, text encoding, Wasm vs other runtime, Wiki language, signal protocols, UI layout, agent exchange format, vector/index stores.  
**NOT asserted:** production capability, human comprehension superiority, best signal alphabet, best toolchain, speed gains not measured, final five-computer mission assignments.

This anchor replaces *priority ordering*, not historical architecture documents, active implementations, other-author experiments or the wider Ω product's architecture choices.
