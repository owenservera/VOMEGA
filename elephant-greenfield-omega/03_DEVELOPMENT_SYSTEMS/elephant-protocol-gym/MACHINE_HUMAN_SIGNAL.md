# Decision 3 — Machine ↔ Human Signal in Every Gym Run

**Decision status:** OWNER-DIRECTED, 2026-10-11.
**Exact direction:** "Every Elephant Gym experiment must expose a Machine ↔ Human learning signal, while leaving its implementation open."

## Why this is a core condition

The Gym is an experimental way for the Semantic SDK and the Elephant system to learn together. An experiment that only generates implementation ideas or passes an isolated code test may still be useful, but it must show **what that result teaches us about the correspondence between machine meaning and human understanding**. This preserves the existing [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md) as one learning circuit rather than introducing competing optimization loops.

The signal does not have to be a real end-user correction in every first-round dry run. It may be a machine/human discrepancy, an explicit unknown, a contradiction between the source and a readable explanation, a source-staleness observation, a cross-Elephant loss of meaning, or a *tested agreement* over a narrow task. An experiment with no observed mismatch must still describe the attempted challenge, the compared representations and why its outcome is limited. An agent's invented expectation does not become independent ground truth.

## Minimal signal receipt — conceptual, not an API mandate

Every independent run must record:
1. **Subject:** exact source, task, intent, artifact or protocol element, with version/snapshot where available.
2. **Machine reading:** what the system/agent interpreted, extracted or predicted, including unknowns.
3. **Human reading:** a concise ordinary-language account of the same meaning and its expected consequence.
4. **Comparison:** observed agreement, discrepancy or insufficient evidence, with origin of expectations.
5. **Feedback:** what this teaches the experiment, what hypothesis it challenges and the smallest next test.

This can be a short paragraph, test output, JSON evidence, text diff, CLI display, generated wiki view, UI trace or another independently inspectable artifact. **No specific schema, UI, technology, human tester, WikiCore verb or backend is required at this stage.**

## Applying to the four current Gym arms

- **Run A — Source and meaning:** compare a source-derived fact with its human explanation, including the intentionally false `repeat` contract; discover what makes the discrepancy detectable.
- **Run B — Compilation and projections:** produce candidate machine and human views of one pinned fact, deliberately mutate source or version, and show whether the two projections remain appropriately bound.
- **Run C — WikiCore and self-runtime:** ask a candidate method about its own capability and compare machine-readable status with the human claim. Distinguish DECLARED, VERIFIED and UNKNOWN.
- **Run D — Elephant toolkit/context:** transfer an explanation between contexts, compare the reconstructed machine concept with a readable summary and independent source evidence; report information loss or correctly preserved uncertainty.

These are **examples, not required designs**. Arms may discover better feedback probes.

## Use what's already built; keep it replaceable

The [existing Live/Experiment/Change toolkit](AUTOMATION_REUSE.md) already has draft interpretation, Plain Reading, source wiki, correction capture and data-only comparison, so reuse it when appropriate. Its mock evidence is not generalized proof. Another method is welcome if it exposes a clearer signal or performs better on a fair test. The [feeder](FEEDER_REUSE.md) supplies actual versioned source when available. Neither toolset becomes a mandatory implementation stack.

## What must not happen

- Don't silently replace a person's stated intention with an LLM's guess.
- Don't score a model's own proposed answer as independent verification.
- Don't count machine/wiki agreement as proof of correct real-world behavior.
- Don't assert that an experiment had a real human tester if it only used an explicitly labelled simulated expectation.
- Don't confuse a feedback receipt with permission to execute an effect.
- Don't mark a run as meeting Decision 3 unless the machine reading, human reading and comparison are actually visible.

## First-round acceptance

Every run note includes one **Machine ↔ Human Signal** section. An outcome can be OBSERVED_DISCREPANCY, TESTED_AGREEMENT, UNKNOWN/INCONCLUSIVE or NOT_RUN; each includes the evidence class. The reviewer considers whether the signal discriminates among research hypotheses, not whether the run claims a positive result.

This rule belongs to the shared experimental protocol and eventually informs the SDK's own self-description of learning results. How the protocol serializes or projects signals remains OPEN_LAB.

Related: [CORE_SEED](CORE_SEED.md), [REVIEW](REVIEW.md), [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md), [Living Design](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/README.md).
