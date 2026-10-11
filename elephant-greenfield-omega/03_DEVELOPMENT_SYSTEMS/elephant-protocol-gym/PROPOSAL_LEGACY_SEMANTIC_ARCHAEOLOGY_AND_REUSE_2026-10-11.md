# Proposal — Legacy Semantic Archaeology and Experimental Reuse for Elephant Gym

**Status:** DESIGNER REVIEW PROPOSAL — NOT APPROVED, NOT IMPLEMENTED, NOT A GYM LAUNCH POLICY CHANGE  
**Date:** 2026-10-11  
**Scope:** Read-only source archaeology of (A) MP-21 Reflection Migrator, (B) pure TypeScript NLCL, and (C) Automated Semantic Experimentation/Phase 0 toolchains.  
**Intended reader:** Elephant Gym designer and independent reviewers.  
**Source:** VOMEGA main, source and test files inspected on 2026-10-11. Historical results are explicitly attributed and were **not independently rerun** in this assessment.  
**Change requested by this proposal:** None. No subsystem merge, approved architecture, dependency, execution permission, new permanent team, or canon promotion follows from its presence.

## 1. Decision summary

**Recommendation: recover experiments and useful primitives, not the old architecture.** The most valuable combined opportunity is making the SDK and Elephant development protocols their *own testable semantic subject*: an Elephant asks about its real source and tools, sees a source-bound machine meaning and human/Wiki/spatial explanation, executes a separately permitted local test, discovers a discrepancy, and proposes a falsifiable improvement.

Three candidate baselines already exist in VOMEGA:

1. **MP-21 Reflection Migrator:** source inventory, structural fact extraction, source anchors, dependency graph, query layer and reported local tests.
2. **Pure TypeScript NLCL:** 17 symbolic lexical families, scanner, frames, grounding, traceable interpretations, alternatives, projections and an explicit known-failure corpus.
3. **Semantic experimentation:** a rich research specification, scenario/mutation methodology, early runner contracts, a mock Phase 0 test harness, recorded adversarial corpora, and a small Live/Experiment/Change prototype.

**Recommended disposition:** MP-21 = REPLAY / COMPARE / ADAPT CANDIDATE; NLCL = COMPARATIVE INTERPRETER AND CORPUS; Experimentation = REUSE TEST METHODS / CORPORA, COMPETE ON HARNESS DESIGN.

These are **proposals for Gym designer consideration**, not a mandatory integration sequence.

## 2. Current Gym anchors — controlling requirements

The proposal is subordinate to:

- [Canonical launch policy](LAUNCH_POLICY.md): D1 existing feeder plus simple/real code, D2 replaceable automation, D3 genuine Machine ↔ Human learning signal every run, D4 exploratory freedom within truth/safety/evidence and reviewed canon change.
- [SDK self-hosting dogfood](SDK_SELF_HOSTING_DOGFOOD.md): the SDK must expose the semantics and capabilities of its own toolchain and Elephant operating protocol; real source, honest Wiki, safe test invocation and independently witnessed discrepancy.
- [Initial state](INITIAL_STATE.md): effectively infinite 3D canvas, initially a floating command/text box, version-pinned Machine ↔ Human ↔ spatial parity. Headless experiments are permitted.
- [Core visual language](CORE_VISUAL_LANGUAGE.md): high-density, machine-decodable visual intelligence; customizable glyph/theme/layout must not change canonical command, effects, authority or conceal material information.
- [Symbolic intake](SYMBOLIC_LANGUAGE_INTAKE.md): the 17-family historical grammar is an optional experiment/control, not a proven universal command language.
- [Legacy alignment map](LEGACY_ALIGNMENT_MAP.md): L01–L10 are a reviewer coverage lens, **not** ten mandatory modules or prescribed answers.
- [Existing automation](AUTOMATION_REUSE.md), [feeder](FEEDER_REUSE.md), [run review](REVIEW.md) and [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md): reuse evidence-bearing inputs, compare Machine/Human meaning within one learning loop, and publish honestly.

**Non-negotiable distinctions:** source ≠ behavior; declaration ≠ observation; confidence ≠ validation; validation ≠ authority; machine/human parity ≠ correct user intent; simulated evidence ≠ live evidence. Enter may freeze a draft semantic publication, but does not by itself execute an external effect. Do not infer final SDK API, storage, browser, Wasm, Git transport, or team structure from this proposal.

## 3. Archaeology A — MP-21 Reflection Migrator

**Source:**
- [README and execution instructions](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/README.md)
- [Inventory](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/inventory.ts), [source extractor](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/extract-source.ts), [structural extraction](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/extract.ts)
- [Facts and evidence classes](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/facts.ts), [graph](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/graph.ts), [parser-free query API](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/src/query.ts)
- [Inventory tests](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/test/inventory.test.ts), [extraction tests](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/test/extract.test.ts), [consumer scenarios](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/reflection-migrator/test/consumer.test.ts)

### Source-inspected capabilities

- Reads blobs from a selected Git commit; classifies files, roles, exports, manifest declarations and structural relationships. Emits deterministic digests and source anchors.
- Uses the TypeScript 5.9.3 syntax parser according to its README, rather than executing source; detects selected op registrations, imports, calls, frames, contract types and manifest/runtime parity.
- Labels facts PROVEN_STRUCTURAL, DECLARED, INFERRED_SAFE, COMMENTARY or CONFLICT; keeps rules and original supporting anchors; exposes unknown and unextracted surfaces.
- Produces a self-contained versioned Reflection Graph with nodes, edges, source anchors, claim classes, unknowns and parity findings.
- The query-only consumer can resolve references, retrieve supporting files, explain dependency paths, find downstream impact and affected tests without parsing source or calling Git.

The README reports **55 local tests** for phases P1–P3; its independent gates remain pending. Its historical scan at commit 65ecc7f reported 495 product-tree files and 112 distinct declared operations; **these are not current Gym totals**. The three consumer scenarios model possible bundle/impact/enrichment clients; they do not prove those future clients already exist.

### Limitations and failure surfaces

- **Freshness:** the scanner reads Git objects (default HEAD), *not uncommitted working-tree edits*. A live Wiki must label the scanned revision and refuse to claim the current editor buffer is reflected when it is not. This is a primary falsifier for Elephant self-editing.
- **Scope:** top-level declarations only; no TypeScript type-checker resolution; selected literal imports/calls; dynamic operations and some config/visual/semantic registrations remain unknown. Graph reachability is not behavioral causality.
- **Identity:** file/symbol identities depend on path; moves can change references, and line/commit/hash are version attributes rather than a universal semantic identity.
- **Runtime:** extraction uses Bun, Git and TypeScript parsing, whereas the graph-query consumer is parser-free. Reuse of its *artifact* is distinct from embedding its extractor into the portable SDK.
- **Verification:** unit tests and README claims are source-inspected historical evidence; no test run or independent external acceptance was performed as part of this proposal.

**Candidate use:** build Reflection artifacts as replaceable tooling inputs; compare them against direct AST/type-checker strategies and source-native semantic declarations. Preserve provenance and unknowns; challenge the graph schema, freshness mechanics and extraction coverage. Do not make a separate authored Wiki database authoritative.

## 4. Archaeology B — pure TypeScript NLCL

**Source:**
- [Package and core](https://github.com/owenservera/VOMEGA/tree/main/omega-baseline/plugins/vivim-nlcl-pure)
- [Lexer](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/lexer.ts), [symbols](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/symbols.ts), [frames](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/frames.ts), [grammar](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/grammar.ts)
- [Interpretation pipeline](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/interpret.ts), [grounding](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/ground.ts), [types](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/types.ts), [feedback projection](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/project.ts)
- [Unit suite](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl/test/nlcl.test.ts), [release test](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl/test/release-use-corpus.test.ts), [release corpus](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl/test/fixtures/release-use-corpus.json)

### Source-inspected capabilities

The exported operation is **interpret(input, world)**. Its implemented source flow is scan → lex → modifier parse → dedicated recognizers → frame match → entity grounding → candidate resolution → projection. Output includes a typed intent/IR, source token spans, alternatives, gap explanations, suggestions, stage traces, human reading and effect previews.

- The lexer recognizes the historical **17 command-symbol families** (/, @, #, !, ?, +, -, &, $, *, %, ∆, ✓, =, ^, ~, →), arrow aliases, attached references, quoted content, and Unicode glyph variants. Lexical recognition is **not** proof of complete compositional semantics.
- Framing, aliases and world-relative grounding are separated conceptually; the package declares a pure zero-external-import design. Domain-specific default frames remain tied to previous VIVIM examples.
- The old engine exposes ambiguity and unresolved fields rather than only a final parsed string. Projection includes risk/consent previews, but **a preview or glyph never authorizes execution**.
- Its frame set is mutable in tests, and ordered special recognizers take precedence over generic frames; both are legitimate design variables and potential sources of cross-experiment contamination.

### Known, explicit negative evidence

The historical first-release USE corpus has **17 cases, 10 marked baseline pass and 7 marked baseline fail**, spread across paraphrase, explicit target, ambiguity, unknown capability, replay, orientation, registration and help. The failure-marked tests deliberately use expected-failure mode, which can keep the suite green while recording known deficits. Treat the labels as historical expectations, not a fresh runtime measurement.

Known examples:
- Addressee-first and alternate phrasings have failing cases (P1, P3, P4, P5).
- Orientation/help collisions (O1, O2) and account registration (G1) have failing cases.
- U1, “send 'x' to Gemini,” is marked pass for the **downstream D1 non-ready invariant**, although the historical EXP baseline reports the **NLCL interpreter's own status can still be 'ok'** with an unresolved required Account. These are different test claims and must not be conflated.
- Separately, the renderer's historical '! skip confirmation card' wording must **not** be promoted to authority bypass. The ✓ consent glyph cannot mean independent verification merely because a visual pack depicts it that way.

**Candidate use:** benchmark the existing TS lexer and interpreter against a fresh minimal parser and an LLM-assisted interpretation strategy over the same source/World/effect contracts. Compare language, glyph and spatial semantic inputs against one versioned meaning record, including ambiguous or partial states. Keep grammar, World representation, frame topology, readiness rule and canonical command identity experimentally open.

## 5. Archaeology C — automated experimentation and development tools

**Source:**
- [Automated Semantic Experiments specification](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md)
- [Semantic Runtime Lab proposal](https://github.com/owenservera/VOMEGA/blob/main/seed-docs/SEMANTIC-RUNTIME-LAB.md)
- [EXP-BASELINE design and semantic diff](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/experimental/lab-scenarios/EXP-BASELINE.md)
- [Phase 0 prototype](https://github.com/owenservera/VOMEGA/tree/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0), [recorded evidence](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/evidence/summary.json), [golden manifest](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/goldens/manifest.json)
- [Live / Experiment / Change developer tools](https://github.com/owenservera/VOMEGA/tree/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools), [implementation limits](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/EVIDENCE.md), [test policy](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/phase0/devtools/FAST_TDD_NO_BROWSER_LOOP.md)
- [Gym self-hosting candidate cases DG-01–DG-10](corpus/self-hosting-cases.json)

### What is implemented versus proposed

- **Design only:** broad composable Lab Profiles, future taxonomy/database architecture, mutation families, semantic-churn/time-to-honesty/false-ready metrics, visual treatment tournaments, negative-intent experiments and independent promotion methodology. No complete one-piece automation platform is established by these specs.
- **Existing tests and corpus:** NLCL release corpus with expected negatives, and a historical Phase 0 mock laboratory with pinned goldens, independent finite response checking, generated hostile input sets, and explicit source/evidence envelopes.
- **Existing runnable prototype:** Python standard-library-based Live/Experiment/Change tools provide typed interpretation through an adapter, source Wiki projections, proposed user-correction capture, change-impact previews and **data-only candidate scoring**, with historical evidence of eight local unit tests. Actual integrated UI/browser behavior and external effects were not certified by this.
- **Current Gym corpus:** DG-01–DG-10 specify source/Wiki contradiction, stale HEAD, bounded test execution, Elephant handoff, visual restyling, hidden consequences, cosmetic vs semantic edits, stale projections, protocol improvement and glyph collision. The corpus explicitly says PROPOSED_NOT_EXECUTED.

### Recorded Phase 0 historical benchmark (not reproduced here)

The stored Phase 0 evidence summary identifies an **EXPERIMENTAL_MOCK_ONLY** cohort:
- 70,101 generated utterances: 20,556 frozen and 49,545 extra hostile.
- A reference candidate passed 179/179 public finite vectors.
- Run A's extra hostile cohort recorded 803 wrong interpretations and 758 wrong-but-READY interpretations by the report's defined predicate.
- The cohort was derived from the Run A grammar; it is not an unbiased Run A-versus-Run B competition. Wrong-but-READY is a parsing/command result, **not evidence that an external side effect occurred**.
- Private holdouts, full Windows execution, human comprehension and browser visual certification were absent or not run in the referenced summary.

**Candidate use:** lift the measurement practices and labeled failure corpus into competing, minimal harness designs; keep the Python prototype as one **replaceable control**, not a required SDK backend. Demand genuinely independent adjudication for candidate improvements.

### Particularly useful metrics to preserve

- Wrong-target and false-ready rates, with separate denominators and effect classification.
- Ambiguity honesty and **time-to-honesty** during partial typing.
- **Semantic churn**: stable, created, resolved, invalidated and unexpectedly flipping semantic handles across revisions.
- Semantic-preserving metamorphic tests: benign paraphrase, explicit target precedence, quoted content isolation, loss of disambiguators, local correction, visual theme/icon-pack swap and prose-renderer swap.
- Source/Wiki freshness and unsupported-claim rate; consequence visibility; required visual handles; semantic parity across projections.
- Total time and cost to reach independently adjudicated improvement, including setup, context loading, corrections and replay.
- Leakage/overfitting checks: held-out cases and blinded discovery compared separately from legacy-seeded reuse.

## 6. Recommended comparison design — not a mandated build plan

Keep two **epistemically distinct** modes:
1. **Blind discovery arms:** same pinned goals, permitted fixture/real source and evidence rules, but **without** exposure to the legacy implementation or detailed legacy solution map. Novel outcomes are measured before comparing to L01–L10.
2. **Reuse/challenge arms:** deliberately inspect and use MP-21/NLCL/legacy experiment designs; compete on identical inputs and independently held-out tests. Do not reward copying known internals as an original discovery.

At minimum maintain an ordinary TypeScript source-only control, one historical-asset-enabled arm and an independent evaluator. Additional free-form arms may be launched without imposing a specific fixed team count, optimizer or runtime.

### Six proposed microexperiments

| ID | Question | Inputs / comparison | Primary falsifier |
| --- | --- | --- | --- |
| A1 | Does source Reflection improve self-explanation? | Same TypeScript fixture and real Elephant source; direct source reading vs MP-21 graph vs source + verbose semantic declarations | More unsupported facts, no task-quality improvement, or greater total work for equal correctness |
| A2 | Can a live Wiki remain honest during editing? | Uncommitted source mutation, pinned HEAD graph and alternative freshness strategy | Working-tree change is presented as already included in committed Reflection |
| B1 | Is legacy NLCL superior to a minimal or model-assisted compiler? | Same pinned World/tool registry, paraphrases, typed revisions, symbols and known negatives | No measured quality/latency/clarity gain; regressions on known cases |
| B2 | Are natural, symbolic and spatial commands truly one meaning? | Equivalent intended command through prose, /, @, → and controlled spatial gesture | Changed target/effects/uncertainty/authority or symbol collision without explanation |
| C1 | Can generated mutation accelerate honest compiler improvements? | Public cases, metamorphic relations, mutations, withheld adversarial set and independent referee | Apparent local win creates more false-ready, wrong-target, semantic churn or holdout failures |
| C2 | Can Wiki and visual languages change without changing command chains? | Same publication rendered under two icon/layout/wording packs; stale async ordering; hidden consequence mutant | Changed command digest/effect/authority, stale view accepted, or material warning hidden |

Every microexperiment must report source/version, what **actually ran**, Machine and Human interpretations, any spatial/visual signal used, disagreement/unknown, witnesses, limitations, a concrete falsifier and what the result would change. **Simulated human judgments are not real user studies.**

### Strong combined dogfood task

**“Find the command interpreter's readiness bug, explain it with real source anchors, identify related tests, propose the smallest correction, run an authorized local test, and show what changed.”**

The candidate must:
1. Resolve actual parser/validator source and commit or working-tree epoch; distinguish the source fact from a claimed behavior.
2. Interpret the human's command with explicit gaps, possible alternatives, tool availability and prospective effects.
3. Publish **one** revision-bound machine meaning with an honest Human/Wiki reading and a visual/spatial projection or headless parity receipt.
4. Run only a separately permitted local deterministic test, capturing **real process output and exit status**; no invented success.
5. Report the observed discrepancy and whether the correction is an unverified proposal or independently reproduced improvement.
6. Regenerate or flag stale interpretation, Wiki and visual information; compare candidate changes against public plus held-out negatives.
7. Package enough source, hypotheses, failures, metrics and witness information that a fresh independent Elephant can replay or falsify the finding.

Success does not require the old MP-21 and NLCL to be mechanically wired together. An independently discovered equivalent, demonstrably better mechanism is equally valid.

## 7. Suggested candidate architecture for comparison ONLY

**One possible topology, not an owner-approved blueprint:**

- Existing source feeder and permitted real-source/test cohorts supply versioned code, operating protocols, test commands and execution capability declarations.
- Reflection-style structural extraction provides **descriptive**, evidence-classified, source-anchored facts and a disposable query index.
- NLCL or a competitor proposes revision-bound candidate commands, gaps, grounded references and interpretation trace.
- The new Semantic SDK publishes one version- and effect-aware semantic meaning record (API/schema deliberately OPEN).
- Machine record, Human Plain Reading/Wiki and visual/spatial objects are independently compared against that same publication and stated omissions; agreement **does not prove** correct intended meaning.
- Authorized development-tool execution returns actual bounded evidence.
- An independent experiment referee scores discrepancies, counterexamples and whole-loop cost and proposes a small reviewed improvement.

**Single HTML file / TS boundary:** investigate compiling a lightweight disposable HTML test surface from TypeScript while keeping Git/AST scanning, test execution and other privileged tooling behind separately permissioned, replaceable adapters. A self-contained demo must not pretend it contains unavailable compiler or OS capabilities. No mandatory Chrome/Chromium, Python, Bun-in-browser or Wasm runtime follows. Choose headless for semantic truth and real UI tests when examining typing latency, visibility, interaction and spatial affordances.

## 8. Evaluation and decision protocol

For each candidate, preserve a compact evidence record:

| Field | Required meaning |
| --- | --- |
| Source ID | Repository, commit or working-tree epoch, exact file/path and hash where possible |
| Asset claim | Functionality inspected in code, historically reported, actually rerun, or purely proposed |
| Experimental question | One falsifiable hypothesis, baseline/control and alternative |
| Scenario cohort | Fixture/real source, public/holdout split, provenance and leakage constraints |
| Observed result | Raw machine record, human/Wiki projection, visual semantic receipt if applicable, process/test witness |
| Metrics | MEASURED / ESTIMATED / UNKNOWN; environment, denominator and version |
| Risk and unknowns | Untested dynamic behavior, source freshness, confidence/authority mismatch, unsafe effects |
| Disposition | REUSE, ADAPT, COMPETE, DEFER, REJECT or MORE_EVIDENCE, with independent review rationale |
| Reproduction | Exact commands, bounded inputs, hashes, fixtures, output digests and failure counterexamples |

No source comment, model confidence, apparent visual agreement or historical green test grants canon status. The full per-turn all-maturity capability-pack contract still applies to actual Elephant development turns.

## 9. Designer questions requiring experiments rather than immediate answers

1. Can MP-21's parser-free query interface expose sufficient source knowledge for a fast, portable TypeScript SDK without inheriting its graph schema?
2. Which source identities remain useful across uncommitted edits, file moves, refactoring and versioned Elephant context transfers?
3. What is the minimum *independently testable* semantic fact needed for machine explanation, novice Wiki reading and successful agent edits?
4. Which NLCL lexical pieces outperform a new minimal grammar, and which merely preserve domain-specific historical assumptions?
5. What contract cleanly separates interpretability, completeness, readiness, consent, authorization and independent behavioral evidence?
6. How should one canonical publication support source code, natural-language instructions, symbolic glyphs and spatial edits while retaining distinct expressed user intent?
7. Can renderer/style changes be freely reprogrammed while preserving visible consequences, usable affordances and machine-decodable semantic parity?
8. What is the smallest reproducible automation loop that captures *true* compiler/Wiki/UI discrepancies without standing up the old large virtual Lab?
9. How should a model-generated candidate test be proposed, independently checked and promoted without overfitting or oracle leakage?
10. Which legacy tools reduce **whole-loop** elapsed effort and errors, rather than only appearing fast in isolated parser timings?

## 10. Proposed near-term designer disposition

**For review, not execution authorization:**
- **Offer MP-21 P1–P3 as a comparator**; replay exact local tests and query API where available; add an explicit HEAD-versus-editor-buffer freshness falsifier.
- **Offer NLCL pure TS as a comparator**; keep its 17 symbols, interpretation API and real expected-failure corpus discoverable, but do not turn its confidence statuses or dangerous glyph meanings into SDK law.
- **Offer the experiment spec, corpus and Phase 0 mock runner as measurement inputs**; select the smallest rigorous harness through comparison, not heritage.
- **Ask for at least one independently refereed, self-hosting vertical-slice witness** that spans source → interpreted command → Human/Wiki/visual meaning → permitted test → actual evidence → proposed correction.
- **Preserve independent blind arms, novel alternatives and negative findings.** The designer may reject any suggested topology after evidence-based comparison.

**No files other than this proposal should be changed as a consequence of reading it.** The Gym designer decides what to test, adapt, reject or promote under [LAUNCH_POLICY.md](LAUNCH_POLICY.md).

## 11. Evidence boundary and handoff

This archaeology used VOMEGA repository files, documented tests, fixtures and stored historical evidence. **It did not rerun Bun, Python, UI, Windows or held-out benchmarks, and did not independently certify the historical counts.** Descriptions of “implemented” refer to source-inspected modules; descriptions of “verified-local” refer to earlier recorded evidence; future capability schemas and multi-arm topologies remain proposals.

**Recommended sharing order:** this document → [Gym README](README.md) → [launch policy](LAUNCH_POLICY.md) → [self-hosting target](SDK_SELF_HOSTING_DOGFOOD.md) → [legacy alignment](LEGACY_ALIGNMENT_MAP.md), then drill into the referenced source/tests. Designers should not read this as an instruction to merge legacy architectures into the active Gym.
