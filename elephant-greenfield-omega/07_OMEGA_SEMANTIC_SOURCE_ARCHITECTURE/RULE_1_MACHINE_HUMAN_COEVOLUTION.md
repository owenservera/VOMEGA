# ⚓ RULE 1 — Machine ↔ Human is the semantic learning engine

**Date:** 2026-10-11  
**Status:** OWNER-DIRECTED RESEARCH RULE / SINGLE CO-EVOLUTION EFFORT. Exact compiler, grammar, Wasm realization, UI, data formats, MVP product architecture and final five-computer briefs remain **OPEN**.  
**Scope:** Ω Semantic SDK + compiler + runtime + internal language/Wiki/UI/self-knowledge + LLM-native experimentation lab, *all as ONE feedback loop*. This is not a rewrite of Universal Elephant DNA or historical frozen fixture truth.

## Rule 1 — operative formulation

> **The only source of improvement signals for the Ω Semantic SDK, compiler and runtime is the observed Machine ↔ Human meaning loop. Wiki, live UI, intent explanations, source-grounded self-knowledge and AI-native language are not downstream features; they are the instruments that expose meaning, failure, uncertainty and missing capability. The experiment factory is the automation of this SAME feedback loop.**

No sequential program of "finish SDK" → "experiment" → "later build representations". There is one continuously closed circuit. The semantic engine may begin as a very small testable slice; representations and discrepancy detection must exist in that **same first slice**, so its behavior can be learned from immediately.

```text
HUMAN INPUT / AGENT INTENT / CODE-BOUND KNOWLEDGE
       │                          │
       └──────────────┬───────────┘
                      ▼
               SEMANTIC COMPILER
             typed source + contracts
                      ▼
              SEMANTIC SDK RUNTIME
         intent / ambiguity / trace / source basis
                      ▼
       ONE CANONICAL SEMANTIC SNAPSHOT
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
       MACHINE VIEW          HUMAN VIEW
    raw typed meaning       readable meaning
    structured evidence     Plain Reading + Wiki
    agent-native signals    UI + self-explanation
           │                     │
           └──────────┬──────────┘
                      ▼
            REPRESENTATION FEEDBACK
    intended ↔ interpreted ↔ rendered ↔ source reality
    ambiguity, missing facts, comprehension, information loss
                      ▼
           AUTOMATED EXPERIMENT FACTORY
       classify delta → generate competing fixes
       compile candidates → replay same M/H loop
       referee tests & side-effect safety → accept/reject
                      │
                      └─────────────▶ SDK / compiler / runtime
                                           (new version)
```

**Machine = Human** means *one meaning, one immutable publication identity, two faithfully aligned representations*. It does **not** mean identical HTML and JSON bytes, nor does it mean a perfectly consistent pair is necessarily correct about what the person intended.

## A learning signal and its origin

Every proposed change to the semantic kernel or a representation is linked to an **observed semantic discrepancy** from the Machine/Human loop, for example:

- **Intent mismatch:** user expected account X or words Y, but the machine interpreted another target/payload.
- **Human comprehension mismatch:** a person (or explicitly labelled simulation) reads the explanation and expects a consequence different from the canonical command.
- **Machine loss:** a compressed capsule, AI-native message, intermediate AST or symbolic coding cannot reconstruct required meaning.
- **Wiki/source discrepancy:** the rendered Wiki claims behavior or provenance that the current declaration/runtime does not support; or the runtime cannot expose the facts needed to explain its behavior.
- **Ambiguity/unknown signal:** the runtime cannot identify an intended meaning without alternatives or additional data; the representation does not disclose this.
- **Self-knowledge gap:** system-derived capability/Wiki facts omit an existing runtime behavior, overstate an unsupported one, or are stale after a source change.
- **Interaction mismatch:** a revision race, stale reading, hidden consequence or ineffective correction control prevents a person from understanding/repairing an interpretation.
- **Agent-native communication loss:** meaning preserved for a machine but misunderstood by another agent or a human reader, including omissions and incorrect reconstruction.

A purely synthetic regression or model-derived test **becomes a candidate learning signal only when expressed as one of these semantic-representation discrepancies with a witness and trust label**. Benchmarks, fuzzers, proof tests and safety gates help *detect and judge* those discrepancies, but they are not independent unrelated programs that decide the engine's product meaning.

### Critical guardrail — parity does not prove intention

If Machine says "send to account A" and Human accurately says "send to account A", parity passes, **but both can still disagree with what the user intended ("account B")**. Thus maintain *three distinct fields*: (1) declared/user-proposed intended meaning, with provenance, (2) observed machine semantics and (3) what Human projection actually communicates. Correspondence tests check (2)↔(3); learning can also be driven by (1)↔(2)/(3). No LLM guesses become established user intent without appropriate review.

## Unit of learning: Semantic Feedback Case (candidate schema)

A single case is attached to the **same immutable publication** in both modes:

```json
{
  "schema": "omega-feedback-case/PROPOSED-0.1",
  "case_id": "EXAMPLE_ONLY",
  "publication_id": "EXAMPLE_ONLY",
  "source_revision": "PINNED_SHA_REQUIRED",
  "input_revision": 1,
  "observed_machine": {
    "command": {"capability": "cap:prompt.send", "args": {}},
    "status": "NEEDS_CHOICE",
    "alternatives": [],
    "effects": []
  },
  "observed_human": {
    "plain_reading": "EXAMPLE_ONLY",
    "wiki_fact_refs": [],
    "what_reader_understood": "UNKNOWN"
  },
  "expected_intent": {
    "status": "USER_PROPOSED_NOT_VERIFIED",
    "meaning": null,
    "provenance": "USER_CORRECTION_OR_EXPLICIT_LABELLED_SIMULATION"
  },
  "discrepancy": {
    "class": "NEEDS_ADJUDICATION",
    "machine_human_parity": "UNKNOWN",
    "intended_vs_observed": "UNKNOWN",
    "reproducer": "REQUIRED"
  },
  "proposed_revision": null,
  "referee_verdict": "NOT_RUN"
}
```

**This is an illustrative shape**, not a frozen API. A case can originate in an interactive human typing box, an offline agent transcript, a synthetic test, a benchmark mutation, a Wiki source change or a protocol handoff, but all enter **the same** meaning/representation-discrepancy intake. Human feedback is authoritative only about the user's expressed intention, not automatically about safe execution or what the compiled code actually does.

## A SINGLE automated learning cycle

1. **Input/observe:** Human text, machine-generated intent or code-sourced facts enter the *current* compiler/runtime with pinned source/contract revision.
2. **Dual presentation:** Same semantic snapshot publishes Machine raw structured facts and Human-readable Plain Reading/Wiki/UI facts. Wiki fact authorship, source and certainty are visible. Enter freezes a **publication**, never auto-runs an effect.
3. **Compare:** Human judgement where present, scripted expected output or independent cross-agent reconstruction identifies actual discrepancies. Distinguish semantic error, explanation-only error, missing source/Wiki fact, UI latency/staleness, inability to represent a new concept, or invalid oracle.
4. **Propose:** LLM-native Elephant workers propose **competing minimal changes**. A fix may target the declaration language, compiler IR, parser/resolver, runtime, Wiki fact projection, UI representation, or agent signal protocol; do not privilege a layer in advance.
5. **Experiment automatically:** Compile each candidate, replay the same full feedback loop over public + independently held-out cases, positive controls and known counterexamples; machine-runner batch skips DOM rendering but must produce/verifiably preserve the same Human semantic projection facts.
6. **Judge/record:** Independent checker validates intended/canonical/rendered correspondence, consequence inclusion, no wrong READY authorization, source/wiki basis and regressions. Record measured cost and failures. “Reject everything” fails positive controls. Adjudicate truth of expected meaning separately.
7. **Close the loop:** Accept only for an experimental cohort/version, atomically activate, refresh Machine and Human together, retain prior immutable publication and rollback. The next observation is the learning input for the next iteration.

**No separate "phase 3 optimization" or "phase 2 experimentation".** The experiment factory is the repeated automated execution of steps 1–7.

## Performance objective

Minimize **wall-clock time and machine resources per independently validated semantic improvement**, not solely parser nanoseconds, number of tests, or number of generated variants. The published record lets humans inspect a failure; headless repetitions let machines test thousands without drawing thousands of pages.

Reported axes are coupled but separately measurable: semantic correctness, correct communication to humans/agents, Wiki/source coherence, confirmed corrections, unsafe effect prevention, and time from discrepancy → tested revision → new valid publication. A Wasm kernel is **a candidate optimization** of this inner loop, not a reason to exclude helpful Python/Node tooling upstream or productive browser checks.

## Existing source and evidence

- The Python Phase 0 compiler/recognizer/mock runtime is the **historical experimental comparison baseline**.
- The three-tool Live Lab / Experiment Runner / Change Lab are *existing pieces of the same intended learning circuit*, not independent project goals. Their v0.1.1 evidence does not certify a fully automated self-improving loop.
- The recent separate agent reports a rapid-typing queue fix and independently reported browser timings. Preserve that as attributed experimental evidence; do not rewrite it into new measured benchmark proof without importing and reproducing the patch and cohort.
- The Wasm publisher is a proposed **portable realization** of the common Machine/Human core utility. The runtime language, compiler strategy, and exact ABI remain undecided.

## Non-negotiable constraints

- One frozen semantic publication, two read-only Machine/Human projections; no mode switch can silently change meaning or approval.
- Distinguish **meaning identity**, **display binding**, and **independent effect authorization**. Semantic publication ≠ execution.
- Stale revision/known competing parse cannot silently become a permitted action; keep exact source/fixture/contract lineage.
- Corrections and agent hypotheses are labelled until independently adjudicated. A passing unit test is not proof of what every human meant; human comprehension requires real-user evidence or clear simulated status.
- All candidate packs, positive/negative results and still-blocked hypotheses appear in existing per-turn Elephant publication records. Do not drop failed variants.
- Keep current product architecture and the five-computer allocations unfrozen until observation supports a decision.
- **Do not require or prohibit Chromium/Playwright as an SDK development rule.** Choose browser tests when measuring real UI event handling, accessibility or layout; choose headless tests when measuring pure semantics and throughput. The reported browser queue findings are an example of why banning a testing tool is counterproductive.

## Immediate smallest discriminating experiment

One actual typed utterance → frozen Machine/Human snapshot → a human correction *or explicitly simulated counterexample* → an agent-proposed grammar or intent/reading change → changed compiler/runtime version → automated replay of both machine and human projections → independent guards → one newly published lab snapshot with clear improvement or rejected counterexample. Preserve all witness hashes and human feedback provenance.

**Status:** RULE 1 is the owner's organizing requirement. This single-loop architecture is still being designed; implementation of the complete automated learning circuit is NOT_VERIFIED.
