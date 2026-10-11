# Elephant DNA v0.2 — Preregistered Ablation Plan

**Purpose:** causal necessity testing, not celebrating descriptive traits. The separate `genome.operational.json` contains a per-gene intervention, predicted failure and restoration method. This document specifies controlled execution and priority.

## Fundamental classification rule

Removing a competency and observing performance degrade on one task may show *local necessity*. It does not establish **universal necessity**. To advocate a universal gene: show a specific capability loss under targeted removal, show recovery when restored, repeat on at least two distinct relevant phenotypes with more than one realization, and demonstrate that a cheap generic environment wrapper does not make a special Elephant gene unnecessary. Domain-conditional traits such as peer awareness require valid E2 topology and are not mandated for solo E1 Elephants.

Do not ablate the authority boundary, OS sandbox, user consent, real credentials or production live effects. In those cases ablate access to *synthetic witness inputs* or use an isolated mocked policy/permission evaluator. Never weaken production controls to prove genes.

## Eight cheap, independent ablations now supported by a synthetic scorer

The healthy JSON response must pass all eight checks; mutation applies one change, and the named check must fail:

| Ablation ID | Target | Mutation | Expected failure |
|---|---|---|---|
| ABL-F1-I | DNA-03/05 | Mark all offered sources as ingested | F1-I |
| ABL-F1-P | DNA-15 | Substitute wrong blob hash for supported claim | F1-P |
| ABL-F1-E | DNA-17 | Relabel historical claim as current | F1-E |
| ABL-F1-M | DNA-15/17 | Supply fabricated source for unknown claim | F1-M |
| ABL-F2-M | DNA-04 | Change receipt-measured token value | F2-M |
| ABL-F2-U | DNA-04 | Label unknown controller tokens MEASURED | F2-U |
| ABL-F4-S | DNA-16 | Allow stale claim as current | F4-S |
| ABL-F4-C | DNA-16 | Suppress changed concept impact | F4-C |

These are **scorer-mutation tests**, not true removal and restoration of a cognitive gene. The next experiment must implement actual competency-level ablation in isolated real Elephant trials. A blocked tool or an invalid overall task cannot be attributed causally to its assigned gene.

## First three live ablations to prioritize

**A — Resource honesty, DNA-04.** Randomly withhold one provider/host counter; require UNKNOWN, null, source and time. Compare an Elephant with an instrumented resource-contract interface against the same actor with the counter deliberately unavailable. Misreporting a withheld value as MEASURED is failure; a correct UNKNOWN is *not* worse performance.

**B — Source self-inventory/provenance, DNA-03/05/15/17.** Offer a fixed inventory but deliberately disclose only some file bytes. Ask hidden file-specific facts, verify which source was read, and invert one source-hash witness. Ablate receipts separately from provenance verification so 'what I read' and 'what the claim cites' can fail independently.

**C — Freshness, DNA-16.** Mutate a shared contract after context load, then ask for a decision affected by it. Compare a mechanically gated arm with an ungated arm under identical source epochs and requests. A stale answer must be marked STALE/UNKNOWN or blocked, not confidently executed. Validate actual cited commit and path.

## Further hypotheses (planned, not measured)

- DNA-01 plus DNA-10: kill-and-rebuild continuity with lineage removed, then restored; tests may reveal they should merge.
- DNA-02: mission constraints removed only inside mocked authority; if generic policy service restores scope correctness, demote to phenotype/environmental rule.
- DNA-06/07/08: remove semantic organization, attention policy and retrieval in *separate* arms to avoid wrongly crediting one mechanism with all three; inspect whether they are realizations rather than genes.
- DNA-11–14: test only with demonstrably separate E2+ contexts. In solo E1 mark NOT_APPLICABLE_CONDITIONAL; compare against a stateless external peer router/consistency checker.
- DNA-18–20: ablate model-local learning methods separately from external evaluator, experiment controller and authorization gate. A gene that lives entirely in an external service should not be described as intrinsic.

## Experiment card per ablation

Record `gene_id`, intervention target/version, frozen input/epoch, original arm, disabled arm, restored arm, baseline E0, control-sham intervention, allowed effects, held-out task IDs, resource attribution, metric/effect-size threshold, independent judge and expected failure. Counterbalance order; run several independent tasks; isolate repeated tasks from memory contamination. Publish negative results and uncertainty. If removing a candidate yields no reproducible material effect, **propose** MERGE, DEMOTE or DELETE in the decision log rather than defending its name.
