# ⚓ Ω Semantic SDK, Compiler & Runtime — ONE Machine ↔ Human learning effort

**Date:** 2026-10-11 · **Revision:** owner correction / Rule 1 consolidation.  
**Authority:** [RULE 1 — Machine ↔ Human is the semantic learning engine](RULE_1_MACHINE_HUMAN_COEVOLUTION.md). This document replaces the previous **sequential** “first finish SDK / then languages” ordering. Historical earlier revision remains in Git history.  
**Scope:** Semantic SDK, compiler, runtime and LLM-native development-automation laboratory. Specific implementations, runtime, DSL, Ω MVP architecture and five-computer briefs remain **NOT FROZEN**.

## One effort, one learning signal

**There are not three stages of the project.** The SDK/semantic compiler/runtime, the Human/Machine representations (Wiki, UI, intent, self-knowledge, agent-native encodings), and the experimentation engine are **parts of a single co-evolving learning loop**.

> The **only source of semantic improvement signals** is what becomes observable when the machine's structured understanding is projected into comprehensible Human and machine-readable representations and compared with intended meaning, underlying source, other agents and real observed behavior. The experiment runner is the automation of that exact discrepancy → proposed fix → re-evaluation circuit.

Human ↔ Machine does not mean identical JSON and HTML bytes. It means one content-addressed canonical meaning/publication and two faithful representations, with discrepancies and uncertainty explicitly observed. Source-linked Wiki, readably rendered intent, live UI, AI-native communication and self-knowledge are **sensors**, not post-release cosmetics.

This includes two forms of observation: (a) Machine and Human projections disagree (omitted consequence, stale Wiki, wrong explanation); (b) both projections faithfully communicate the *wrong* interpretation relative to the person's expressed intention. The second requires separate ground-truth provenance; mere projection parity is not natural-language correctness.

## One continuous architecture

```text
human input / agent purpose / source-derived fact
                        │
                        ▼
               semantic SDK + compiler
          typed declarations → checked IR
                        │
                        ▼
              deterministic runtime
       interpretation · alternatives · why trace
                        │
                        ▼
             ONE canonical publication
                        │
         ┌──────────────┴─────────────────┐
         ▼                                ▼
  Machine representation          Human representation
  raw structured semantics        Plain Reading · Wiki · UI
  source/proof/agent signals       explanation · self-knowledge
         │                                │
         └──────────────┬─────────────────┘
                        ▼
          observed discrepancy / learning signal
        (human expectation, source contradiction,
         cross-agent loss, stale fact, UI confusion)
                        │
                        ▼
             autonomous experiment loop
      design variant → compile → replay M/H → compare
        independent evidence and safety gates
                        │
                 accept / reject / hold
                        │
                        └──────▶ SDK / compiler / runtime
                                        ↑
                                new meaning publication
```

The loop can start with **one tiny semantic capability** and grow; it does not wait for a supposedly complete SDK. Every semantic capability the compiler can process should be explainable through the same canonical Machine/Human interface from its first implementation.

## Smallest integrated unit of work

For a specific typed input and pinned source:

1. Compile or load the candidate typed semantic contract.
2. Produce actual machine meaning, ambiguity/status, source/derivation and complete consequence.
3. Render a Human Plain Reading and a source-grounded Wiki fragment from **that meaning**.
4. Make Human or simulated-agent expectations explicit; compare intended, machine and rendered understandings; record the mismatch and who asserted it.
5. Feed that **one discrepancy record** into the automated experiment engine, which proposes fixes to whichever component is actually responsible—grammar, compiler, runtime, rendering/Wiki/UI or agent-native encoding.
6. Re-run both Machine **and** Human paths on the same corpus for each candidate. Include positive and negative controls, source lineage, independent/referee checks, and memory/agent information-loss tests where relevant.
7. Publish the accepted/rejected delta with full evidence, immutable old publication, new contract/version if applicable and reversible rollback.

A short pure-semantic regression from a fuzzer becomes a candidate case **inside this shared difference/representation loop**, not a separate objective or a second competing automation track.

## What must exist together in the initial slice

| Element | Minimum first-loop responsibility | Maturity gate |
| --- | --- | --- |
| Contract compiler / SDK | Typed capability/args/consequence + versioned source and grammar identity | Independent reproducibility and mutation tests |
| Deterministic runtime | Interpret input, preserve spans, surface alternatives, render/verify | No silently lost payload, wrong READY effect or identity drift |
| One canonical publication | Freeze exact input/status/meaning/source/reading/Wiki reference | Human and Machine see same publication ID, no mode re-evaluation |
| Machine projection | Raw structured view for agents, oracles and comparators | Canonical data integrity and reconstruction |
| Human projection | Live understandable reading, capability/source Wiki, visible why/alternatives | Traceable facts, no false certainty; user truth provenance |
| Discrepancy capture | Human correction or explicitly labelled simulated expectation, screenshot/trace/source IDs when appropriate | Proposed claim, not automatically certified ground truth |
| Experiment factory | Generate competing compiler/rule/presentation revisions, replay both views headlessly or interactively | Independent controls, preserved negative results and source versions |
| Safety gate | Separate publication from permission; reject unresolved ambiguity/staleness and replay | No unauthorized mock effect; valid positive controls execute in mock only |

Do not force a broad UI framework to achieve the small Human view; the portable Wasm final-stage publisher remains a candidate implementation. Do not rewrite proven historical Python reference. Test compiler and data structures headlessly; use browser checks when relevant to live typing, display fidelity or accessibility. The external agent's reported rapid-typing queue speedup is a reason to keep a genuine browser signal available, not a reason to require browser setup for pure compiler tests.

## What "learning" means, and what tests do

**Learning direction** comes from discrepancies exposed in the Machine↔Human loop. Different agents, source harvesters, simulated humans or end users may supply hypotheses or expected outcomes, but each is recorded with provenance (USER_PROPOSED, AGENT_SIMULATED, SOURCE_DECLARED, BEHAVIOR_OBSERVED, INDEPENDENTLY_ADJUDICATED). A generated test's own expected answer is not automatically true.

**Regression and safety tests** preserve historical behavior and invalidate unsafe/faulty alternatives. They are critical referees, not a separate invention pipeline. Passing old golden files is neither sufficient nor necessarily required for a versioned deliberate semantic expansion; migration must be explicit and reviewed.

The objective is **correct semantic improvements per full loop wall time**, with correctness, comprehensibility, Wiki/source truth, cross-agent reconstruction and safety gating. Do not optimize isolated parser time at the cost of a slower or untrustworthy feedback loop.

## No premature technology or stage restrictions

- The upstream Elephant lab may use Python, Node, TS, LLMs, browsers, scripts, compilers, indexers and multiple agents when they help.
- The *candidate final-stage* kit may target a portable TS-family-authored Wasm kernel and static HTML/CSS with a minimal audited DOM bridge; no Node/Python **shipped runtime**. This is a candidate, not a required product implementation.
- **Chrome/Chromium/Playwright are neither prerequisites nor forbidden tools.** Their real UI test findings can be important; browser tests are chosen to answer questions that need a browser.
- Keep the Phase 0 mock reference and former benchmark evidence intact; do not claim an unbuilt Wasm module, end-to-end autonomous tuning loop, visual parity benchmark win or final five-computer launch.
- Frozen benchmark fixtures remain historical controls. Universal Elephant DNA and wider Ω MVP architecture remain separate.

## Immediate acceptance experiment

One typed intent → canonical dual representation → discrepancy (actual human correction or labelled simulation) → autonomous candidate fix → recompiled SDK/runtime → same input and Wiki reprojected → independent controls and measured end-to-end cost → new version or recorded failed candidate. **That is the smallest closed learning loop** and the proper target for accelerated R&D.

Related research designs: [headless and browser tests chosen by signal](phase0/devtools/FAST_TDD_NO_BROWSER_LOOP.md), [signal-protocol experiment families](phase0/devtools/SIGNAL_PROTOCOL_EXPERIMENTS.md), [portable Wasm publisher proposal](phase0/devtools/proposals/wasm-semantic-publisher/README.md). All actual implementations must publish complete all-maturity capability packs per the standing Elephant contract.
