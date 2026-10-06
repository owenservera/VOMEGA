# Negative Intent Signal Engine — Counterfactual Intent Frontier and Early-Correction Learning

Status: **OWNER-DIRECTED DESIGN CONCEPT / D5 DESIGN CYCLE REQUIRED**  
Added: 2026-10-06  
Scope: semantic interpretation, realtime revision semantics, visual projection and automated semantic experiments  
Primary existing programs: MP-08, MP-09, MP-10, MP-14, MP-15, MP-16  
Not a new PM-managed program. Not a second interpreter. Not execution authority.

## 1. Core idea

Ω should not merely ask:

> What is the best interpretation of the user's words right now?

It should simultaneously ask:

> What is the most important plausible way this interpretation could be wrong **right now**, and can we expose that divergence early enough that correcting it costs less than correcting it later?

The runtime intent compiler continues to produce candidate semantic interpretations from the current input revision and World.

Alongside it, a **Negative Intent Signal Engine** evaluates the same candidate space counterfactually.

Its job is to identify the **negative intent frontier**: the plausible alternative interpretation, missing distinction, or counterfactual semantic branch whose early exposure yields the highest immediate information and the largest reduction in expected downstream correction work.

"Negative" does **not** mean negative sentiment, refusal, prohibition or a user saying no.

It means:

> a high-value falsifier of the currently leading interpretation.

The engine is designed to make semantic error cheap while it is still shallow.

## 2. Why this matters

Realtime language interpretation is path-dependent.

A small wrong assumption made early can propagate through:

- target grounding;
- Account selection;
- Provider or Model routing;
- payload/scope boundaries;
- defaults;
- consequence projection;
- authority requirements;
- execution planning;
- visual explanation;
- contextual Wiki/help;
- downstream Work and evidence.

If the system waits until the command is nearly committed before surfacing the wrong branch, the user may need several corrections and the runtime may need to invalidate/recompute many dependent fields.

If the most consequential alternative is exposed at the first revision where it becomes discriminable, one small semantic correction can prevent an entire wrong branch from developing.

The target is therefore not merely "more ambiguity shown."

The target is:

> **maximum useful negative signal at the earliest useful revision, with minimum interruption and minimum eventual correction distance.**

## 3. Relationship to the runtime intent compiler

The Negative Intent Signal Engine must not become a rival language system.

Conceptually:

```text
input revision + World
        ↓
runtime interpretation pipeline
        ↓
candidate semantic manifold
        ├── leading / currently selected interpretation
        ├── plausible alternatives
        ├── unresolved branches
        ├── rejected / invalid candidates with reasons
        └── dependency / consequence projections
        ↓
canonical compiler + validator
        ↓
candidate command / unresolved state

same candidate manifold
        ↓
NEGATIVE INTENT SIGNAL ENGINE
        ↓
counterfactual divergence frontier
        ↓
highest-value early negative signal(s)
        ↓
VisualSpec / interaction projection
        ↓
explicit semantic edit, dismissal, confirmation or continued typing
        ↓
new input revision / recomputation
```

The engine reads candidate semantics and their provenance.

It does **not**:

- reparse the user's prose independently;
- create hidden UI routing truth;
- grant authority;
- execute;
- turn probability into proof;
- silently replace the compiler's selected interpretation;
- hide ambiguity because one candidate scores highly;
- make a provider/account/model choice merely because it predicts the user is likely to choose it.

If the compiler currently collapses the candidate set too early, that is a compiler/observability limitation to fix. Do not solve it by building a second parser inside this engine.

## 4. The intent manifold

For one input revision, define the **candidate intent manifold** as the inspectable set of semantically plausible interpretations that survive far enough in the current pipeline to be meaningful competitors or falsifiers.

A candidate may differ from the leading interpretation in one or more dimensions:

- capability/action;
- Provider;
- Account;
- Model;
- Session;
- target object;
- payload;
- scope;
- relation;
- sequence/dependency;
- negation;
- default source;
- consequence/effect;
- authority requirement;
- realization;
- temporal reference;
- unresolved reference such as "this", "it", "the other one";
- unknown/unsupported interpretation.

The manifold should preserve provenance:

- which words/spans contributed;
- which language/frame rule proposed it;
- which World fact grounded or rejected it;
- which default/prior affected ranking;
- which validation rule failed;
- which revision first made the branch possible;
- which revision first made it distinguishable from the current leader.

The system does not need to show the whole manifold to the user.

The whole manifold is primarily an **internal semantic and experimental surface**.

## 5. The negative intent frontier

The engine derives a smaller frontier from the full manifold.

A frontier candidate is interesting when it has a strong combination of:

1. **Plausibility** — it is a credible interpretation under the current words and World.
2. **Semantic divergence** — it differs materially from the leading interpretation.
3. **Downstream consequence** — choosing the wrong branch would change important later semantics or effects.
4. **Correction depth** — fixing it later would require more semantic edits, invalidations or restarts than fixing it now.
5. **Immediacy** — the distinction can be usefully exposed at the current revision.
6. **Discriminability** — a small user signal/action can distinguish the branches.
7. **Persistence risk** — if left unchallenged, the wrong branch is likely to persist and accumulate dependent meaning.
8. **Interaction cost** — the signal can be surfaced without disrupting normal expression disproportionately.

The highest-ranked negative is not necessarily the second-highest compiler candidate.

A lower-probability alternative can deserve earlier exposure if it would be very expensive or consequential to correct later.

Likewise, a close alternative may deserve no interruption if later correction is trivial and harmless.

## 6. Correction distance

The engine needs an explicit notion of **semantic correction distance**.

For a candidate semantic state `S` and intended state `T`, correction distance is not text edit distance.

It is the minimum meaningful semantic work required to converge from `S` to `T`.

Candidate units include:

- one explicit semantic field edit;
- one grounding replacement;
- one scope-boundary edit;
- one dependency invalidation/recompute;
- one revalidation;
- one authority re-evaluation;
- one execution-plan invalidation;
- one external-effect recovery step if commitment was already allowed.

A simple first implementation may use a weighted semantic-edit count.

A more mature implementation may use a dependency graph over the canonical command and World bindings.

The important comparison is:

```text
correction cost if challenged now
vs.
expected correction cost if the wrong branch survives N more semantic commitments
```

This yields **early-correction leverage**.

## 7. Candidate objective function

The exact function is a design hypothesis, not product law.

A useful conceptual form is:

```text
negativeSignalUtility =
    plausibility
  × materialDivergence
  × downstreamConsequence
  × expectedFutureCorrectionCost
  × discriminabilityNow
  × persistenceRisk
  × informationGain
  ------------------------------------------------
    interruptionCost
  + correctionCostNow
  + signalLatency
  + instabilityPenalty
```

Alternative formulations should compete experimentally.

The engine does not need calibrated probabilities in its first form. Components may be ordinal or rule-derived.

The optimization target is not "show more negatives."

It is:

> **prevent expensive wrong semantic trajectories with the smallest, earliest useful correction signal.**

## 8. "Tip of the manifold"

The **tip of the manifold** is the current revision's smallest high-value frontier where a tiny clarification can prevent the largest avoidable semantic divergence.

Examples:

### Account

User types:

> Ask Claude to summarize this.

Current World contains Claude Work and Claude Personal.

The compiler may keep Account unresolved.

The negative frontier should not merely restate "ambiguous."

It should identify the discriminating choice with the highest correction leverage and expose it at the Account-bearing phrase:

> Work or Personal?

If a standing default tentatively selects Work, the highest-value negative may be:

> Not Personal?

or an equivalent neutral visual affordance showing that another materially valid Account remains.

### Capability collision

User types:

> Have Claude…

If `have` can begin an orientation question or an addressee-first prompt command, the engine can expose the collision at the earliest revision where both remain plausible rather than allowing one frame to harden invisibly.

### Scope

User types:

> Ask Claude to explain "use Work instead"

The negative frontier may be the possibility that `Work` is being incorrectly interpreted as a routing correction instead of quoted payload.

Expose the payload/scope boundary immediately.

### Consequential local command

User types:

> Delete the old project…

Two plausible target folders remain.

Even if one target ranks much higher, the alternative may carry enormous negative utility because late correction after execution would be impossible or costly.

## 9. User-facing projection

The UI should not dump a ranked N-best list on every keystroke.

The internal engine may expose the whole frontier to experiments and debugging, while the visual projection uses progressive disclosure.

Candidate treatments:

- a quiet alternate interpretation marker on the relevant phrase;
- a small counterfactual handle such as "Work?" / "Personal?";
- a subtle "could also mean…" disclosure;
- an alternate target ghost/chip visible only when materially divergent;
- a consequence-sensitive warning when the alternate changes an external effect;
- a one-tap semantic correction that edits the canonical semantic field rather than hidden UI state.

The visual system should normally expose **one highest-value negative**.

Expose several only when the alternatives are genuinely co-equal and the user must choose among them.

The signal must be tied to:

- the current input revision;
- the exact semantic field(s) that diverge;
- the source phrase/span where possible;
- the candidate alternative;
- the reason it matters;
- the correction action.

Late negative signals from obsolete revisions must be suppressed like any other late interpretation result.

## 10. Evolutionary optimization

The engine should improve from correction episodes and experimental evidence.

A correction episode can record:

- revision sequence;
- leading interpretation at each revision;
- candidate manifold snapshot/digest;
- negative frontier emitted;
- whether the user inspected, ignored, dismissed or selected it;
- explicit semantic edit eventually made;
- revision at which the correction occurred;
- semantic fields invalidated by the correction;
- downstream revalidation/recomputation caused;
- whether an earlier frontier candidate would have predicted the correction;
- interruption cost / unnecessary signal;
- final command/evidence outcome.

From these episodes the evaluator may optimize:

- which divergences deserve early exposure;
- how early a signal becomes useful rather than noisy;
- which semantic dimensions create expensive late corrections;
- which visual treatment yields fast low-friction correction;
- which candidate-ranking features generalize across domains.

This is evolutionary in the experimental sense:

```text
baseline policy
→ generate candidate ranking/projection variants
→ replay against pinned scenarios + real correction episodes
→ compare falsifiers/metrics
→ promote only evidence-supported improvements
→ preserve rollback
```

A learned policy is still a proposal/ranker.

It does not become semantic authority merely because it performs well.

## 11. Learning boundaries

Evolution must not create hidden personalized truth.

Allowed inputs may include:

- current text revision;
- current World;
- candidate semantics and provenance;
- explicit user corrections;
- prior explicit selections/defaults;
- experimentally measured correction outcomes;
- semantic dependency/correction-cost structure.

Guardrails:

- explicit current instruction outranks learned prior;
- a learned prior may rank but must not silently collapse materially valid ambiguity;
- confidence is not proof;
- personalization must remain inspectable/resettable where it affects interpretation;
- correction data should remain local/sovereign by default;
- no engagement-maximization objective;
- no optimization that suppresses warnings merely because users often dismiss them;
- consequence/authority boundaries cannot be learned away.

## 12. Runtime data needs

The engine benefits from a candidate-level structure such as:

```ts
type IntentCandidate = {
  id: string
  revision: string
  semanticStateRef: string
  status: "candidate" | "unresolved" | "invalid" | "selected"
  provenance: ProvenanceRef[]
  sourceSpans?: SpanRef[]
  groundingRefs?: SemanticRef[]
  validationFindings?: FindingRef[]
  consequenceRefs?: SemanticRef[]
}

type NegativeIntentSignal = {
  revision: string
  primary: string
  counterfactual: string
  divergentFields: SemanticId[]
  firstDivergenceRevision?: string

  correctionCostNow?: number
  expectedLaterCorrectionCost?: number
  earlyCorrectionLeverage?: number

  discriminatingAction?: SemanticEdit
  explanationRefs: SemanticRef[]

  scoreComponents: Record<string, number | string>
  policyVersion: string
}
```

These are conceptual shapes, not frozen contracts.

The engine should reference canonical semantic IDs rather than duplicate command state.

## 13. Experiment metrics

The Lab / MP-16 experiment system should add metrics such as:

### Time to useful negative signal

How many input revisions elapse between the first point a material wrong branch is detectable and the first useful signal?

Lower is better only if unnecessary-signal rate remains acceptable.

### Early-correction capture

Among corrections the user eventually makes, how often was the corrected semantic branch present on the earlier negative frontier?

### Correction-step reduction

```text
late semantic edit steps - early semantic edit steps
```

Measure actual dependency invalidations as well as direct user gestures when possible.

### Avoided invalidation cost

How much recomputation/revalidation/re-consent/recovery would an early correction have avoided?

### Unnecessary negative-signal rate

How often does the engine surface a counterfactual that the user neither chooses nor benefits from seeing?

### Negative-signal precision by consequence

Separate harmless alternatives from materially consequential target/scope/authority/effect differences.

### Frontier stability

Does the projected negative thrash between alternatives on adjacent revisions without meaningful new evidence?

### Stale-signal safety

Can an old revision's negative signal appear on or mutate a newer revision? Target: never.

### Semantic-path convergence

Does selecting the counterfactual through the UI produce the same canonical semantic state as making the equivalent correction in text?

## 14. Required scenario classes

Add counterfactual/negative-frontier cases around:

- two valid Accounts;
- explicit target versus standing default;
- Provider versus Account versus Model versus Session;
- quoted payload containing routing words;
- capability/frame collision;
- unresolved pronoun/reference;
- scope ambiguity;
- negation;
- stale/unavailable target;
- high-consequence target divergence;
- late correction that invalidates several dependent fields;
- typed versus clicked correction;
- obsolete async result;
- a case where the second-ranked candidate should **not** be surfaced because correction is cheap;
- a case where a lower-ranked candidate **should** be surfaced because later correction is expensive.

The last two are critical. They distinguish the negative-intent engine from an ordinary N-best UI.

## 15. Falsifiers

Reject or redesign the approach if evidence shows any of the following:

1. It needs a second parser or language truth system to function.
2. It increases user interruptions without reducing late correction work.
3. It merely displays the compiler's top-N candidates with no correction-leverage advantage.
4. The "negative" ranking becomes another confidence score presented as certainty.
5. Learned ranking silently suppresses materially valid ambiguity.
6. The engine causes route/target changes without an explicit semantic edit.
7. Stale frontier results can affect a newer revision.
8. The engine materially increases latency/flicker on ordinary typing.
9. Early signals do not reduce semantic edit distance or downstream invalidation.
10. The optimizer overfits the first-release Account domain and fails unrelated semantic domains.
11. Consequence or authority concerns become conflated with semantic identity.
12. The visual layer starts recomputing or inventing candidate semantics.

## 16. Smallest useful experiment

Do not build the generalized engine first.

Use the existing semantic Lab and revision corpus.

### Arm A — baseline

Current compiler/validator/VisualSpec behavior.

### Arm B — top-N exposure

Show the ordinary second-ranked candidate when ambiguity exists.

### Arm C — negative-frontier policy

Rank candidates by a simple hand-authored early-correction-leverage heuristic.

Run all three against the same revisioned scenarios.

Minimum test set:

- Claude Work vs Personal;
- explicit target overriding a default;
- quoted payload with Provider/Account words;
- one frame/capability collision;
- one high-consequence non-AI target ambiguity.

Measure:

- first useful signal revision;
- correction steps;
- invalidated semantic fields;
- unnecessary signals;
- final canonical correctness;
- visual disruption.

The concept earns deeper implementation only if Arm C beats both baseline and ordinary top-N exposure on correction burden without unacceptable interruption.

## 17. D1 relationship

D1 does **not** need the generalized evolutionary engine to complete.

D1 should, however, avoid destroying the information the future engine needs.

Where practical, preserve:

- revisioned candidate semantics;
- unresolved alternatives;
- explicit semantic edits;
- candidate/selection provenance;
- semantic diff/replay;
- source spans/handles;
- downstream invalidation information.

D1's Account ambiguity and correction scenarios are useful seed cases for the first bounded experiment.

Do not turn this concept into a new D1 completion gate unless the owner explicitly selects that change.

## 18. Relationship to existing VOMEGA programs

### MP-08 — Human Semantic Execution Language

Must expose candidate semantic possibilities and provenance sufficiently for counterfactual evaluation.

### MP-09 — compiler / validator / defaulting

Remains the canonical command compiler/validator. The negative engine challenges its leading path; it does not replace it.

### MP-10 — InterpretationSession

Owns revision identity, late-result suppression and semantic edits. Negative signals are revision-bound derived state.

### MP-14 — Command Visual Language

Owns how the highest-value negative is communicated and corrected without creating hidden state.

### MP-15 — VisualSpec

Should carry the projected negative frontier as semantic projection data rather than make surfaces re-run interpretation.

### MP-16 — Automated Semantic Experiments

Owns comparative evaluation, mutation/scenario generation, metrics and evidence-based evolution of the negative-ranking policy.

### MP-17 — Cross-domain generalization

Tests whether the mechanism works beyond AI Provider/Account routing.

## 19. Design-cycle requirement

This concept is D5 because several plausible architectures exist and a poor choice could permanently bias how Ω exposes uncertainty.

Before freezing a contract:

1. map what candidate information the current interpreter actually preserves;
2. define at least two materially different frontier-ranking approaches;
3. define correction-distance metrics;
4. build the bounded Arm A/B/C experiment above;
5. test at least one non-AI domain;
6. test noise/interruption failure modes;
7. obtain independent review;
8. record what remains unresolved.

The first implementation is an experiment, not architecture law.

## 20. Product principle

The product should evolve toward this behavior:

> Ω does not wait until it is confidently wrong.

> It continuously searches the plausible semantic space for the cheapest early opportunity to falsify its own leading interpretation.

> The best correction is the one surfaced just before the wrong branch becomes expensive.
