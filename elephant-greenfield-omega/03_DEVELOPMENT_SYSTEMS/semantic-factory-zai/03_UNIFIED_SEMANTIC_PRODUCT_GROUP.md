# 03 — Unified Semantic Product Elephant Group (USPEG)

**Status:** Proposed target organization and experimental design, not existing implemented infrastructure. The unifying obligation is non-negotiable: **one semantic reality, many projections**. Number of resident sessions, file allocation, indexes, storage engines and precise protocols are experiment variables, not frozen architecture.

## Outcome contract

At the end of the seven-round Windows MVP exercise, the product must (a) implement the smallest genuine useful command journey, and (b) have an operational, automated source-grounded semantic library that can absorb the eligible frozen historical corpus, preserve evidence/negative findings/unused knowledge, retrieve it for later questions, and reconcile it with current source without silently promoting historical evidence into executable product truth.

The second outcome is not optional stretch work or an unbounded feature backlog. The library is built incrementally from R1 and acceptance-tested independently of the visible app. Conversely, a complete library cannot substitute for functional MVP proof.

## Cohesive group, not four competing brains

Four logical stewardship portfolios, to be allocated to one or more Elephant sessions experimentally:

1. **Library/Lineage** — concepts, source anchors, provenance, cross-repository identity resolution, capability graphs, causal links, failed approaches, experiment outcomes, corpus health and query services.
2. **Language/Compiler** — natural utterances, the existing 17 lexer symbol families, lexical spans, frames/grammar, candidate semantics, grounding and alternatives, canonical USE command, deterministic compilation, revision identity and tests.
3. **Visual/Interaction** — revision-bound VisualSpec, annotations, negative-intent frontier, progressive capability UI, user correction controls, semantic-edit parity, lifecycle/evidence projection, accessibility and real-time latency.
4. **Reflection/Self-Knowledge** — source-native schema and plugin introspection, relationships, contextual Wiki projection, explanation, availability/freshness and source-derived coverage tests.

These are stewardship responsibilities, **not separate canonical stores, interpreters, or parallel products**. Cross-cutting truth is expressed through stable semantic IDs, versioned contract/evidence artifacts and explicit epoch bases. A session may own multiple portfolios; a portfolio may be split into Elephants. Z.ai must benchmark cohesive residency versus federated residency and a durable source-grounded semantic exchange layer.

## One semantic pipeline

```
text / symbolic notation / UI semantic edit
  -> token spans + grammar/language pack
  -> candidate meanings (not premature top-1)
  -> World-grounded identities (Provider != Account != Model != Session)
  -> candidate canonical command and missing fields
  -> validation + consequence + authority + consent requirements
  -> committed immutable USE command; virtual or authorized real realization
  -> evidence events and World/Work evolution
  -> VisualSpec + contextual Wiki projections over the SAME semantic identities
```

Symbol family examples: `/`, `@`, `#`, `!`, `?`, `+`, `-`, `&`, `$`, `*`, `%`, `∆`, `✓`, `=`, `^`, `~`, `→`. These glyphs are existing lexer-level families; complete compositional semantics are not assumed. In particular `!` cannot silently bypass required consent and `~` cannot force ambiguous targets into READY. Historical `?` introspection should connect to the source-derived Wiki, not invent a second knowledge authority.

## Five different evidence/truth planes

1. **Historical immutable basis**: archived permitted repository trees, hashes, tests, traces, issues, docs and run observations. Can prove what a historical artifact said/did, not current product capability.
2. **Harvested candidate intelligence**: structured extracted claims and associations, with witnesses, conflicting interpretations and uncertainty.
3. **Reconciled semantic library**: content-addressed definitions, normalized concepts, crosswalks, negative knowledge, experiments, alternative architectures and source references; status remains explicit.
4. **Current source-native operational declarations**: VOMEGA installed/loaded capability definitions, parameters, valid realizations, programmatic Reflection and compiler contracts at a pinned Git/runtime basis.
5. **Current runtime truth**: live World/Account/session state, authority and evidence observations; an assertion about a source file never proves actual browser submission.

Never flatten these planes into one trust score. The semantic library may query them together, but every response retains origin, maturity and verification date/epoch.

## A common semantic node contract (logical, implementation open)

A semantic node needs `semantic_id`, `kind`, `definition_revision`, `source_anchors[]`, `lineage[]`, `relations[]`, `claims[]`, `validation`, `maturity`, `historical_or_current`, `fidelity`, `last_reconciled_at`, `current_source_epoch`, `known_gaps[]`. Source anchors prefer immutable blob/symbol identifiers, with lines as human navigation hints. Natural-language aliases, grammar frames and visual roles reference that ID; they do not define a second identity.

A command-capability coverage query should be able to traverse:

`human phrase -> recognition -> family/grammar -> canonical intent -> entity grounding -> capability schema -> realization -> required authority -> visual preview -> outcome evidence -> Wiki explanation -> source/test basis`.

Absent links must be visible as gaps. The graph must not fabricate an edge merely to produce a pretty comprehensive map.

## Product Elephant decisions and Harvest authority

Product Elephants issue targeted `HARVEST_REQUEST` with current gap, product source epoch, expected output and falsifier; choose `ADAPT / REJECT / DEFER / MORE_EVIDENCE` after source checks. They also maintain the *systematic corpus coverage* contract so unused intelligence gets preserved. The blanket read-all inventory is a standing Product Group demand, but promotion to actionable canonical semantics is always demand/evidence driven.

Harvesters never instruct coding workers. Coding workers only converse with their assigned Product Elephant gateway (plus authorized local tools for their own worktree/tests). Domain-to-domain questions return through Product Elephant communication with source-epoch stamps and shared semantic IDs. Disputes are recorded rather than resolved by consensus vote.

## Semantic coherence gates

- Every meaningful UI state-changing action maps to the same command path as typed/semantic forms; geometry-only UI gestures are excluded when they do not change product semantics.
- A click that changes command meaning produces a semantic edit against an interpretation revision, not a hidden direct API call.
- One source-native capability declaration should expose typed fields, required entities, effects, evidence expectations and self-description that can generate UI/Wiki projections. This is a target; current source may require a Reflection migration path.
- No discrepancy between symbolic and natural-language meaning for declared-equivalent inputs.
- Unknown words, missing Account, stale session or provider reality are not quietly transformed into READY.
- The Wiki cannot override current source/World truth; its explanations carry provenance and freshness.
- Negative-intent candidates come from the shared candidate set, not a second shadow interpreter.

## Semantic query acceptance (must be testable by R7)

On a pinned frozen corpus and current source epoch, a fresh independent agent with no prior chat should be able to ask e.g.:

- How does historical `@` reference grounding differ from present Ω Account grounding?
- Which old user journeys generated real observations versus mocked tests?
- What did the earlier provider action programs require as preconditions?
- What is the current source symbol for `prompt.send` and what remains SIMULATED?
- Which historical visual feedback concepts are not yet mapped to the current compiler?
- Which archived alternative was rejected, and with what source evidence?
- If a command field changes, what compiler, visual, Wiki and test nodes are affected?

Scoring must check exact anchors, confidence calibration, relevant counterexamples, current-vs-historical separation, useful abstentions and end-to-end query time. A 100%-ingested source archive with poor answers **fails** the semantic library objective.

## Non-expansion constraints

This work should extend the existing `seed-docs/SEMANTIC-DATA-ENGINE.md`, `SEMANTIC-RUNTIME-LAB.md`, `COMMAND-VISUAL-LANGUAGE-DESIGN.md`, `SELF-DESCRIBING-RUNTIME-WIKI.md`, `omega-baseline/plugins/vivim-nlcl-pure/`, D1 and Reflection migration. It must not introduce a second interpreter, policy engine, permanent PM, authoritative legacy registry or manually authored Wiki database. Z.ai may propose a different architectural boundary only through an independently benchmarked experiment and explicit owner-decision escalation.