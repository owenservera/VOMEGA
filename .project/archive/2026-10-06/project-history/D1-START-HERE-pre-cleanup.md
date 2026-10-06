# D1 — ChatGPT Work Start Here

Status: **OWNER-SELECTED FIRST BUILD DELIVERABLE**  
Date: 2026-10-06  
Scope: first executable development release; **not** the public Windows beta.

## Mission

Build **D1 — Executable First-Release Semantic Twin**.

D1 is the smallest executable artifact that turns the current first-release design into running, falsifiable product behavior without pretending that simulated provider behavior is live.

The required journey is:

```
blank synthetic Ω
→ register Claude Work through ordinary language
→ register Claude Personal through ordinary language
→ ask Claude to explain a payload
→ preserve Account ambiguity
→ resolve the Account by typing OR clicking
→ both paths converge on the same semantic command
→ command becomes READY only when structurally valid
→ contextual help explains the active semantic objects
→ virtual governed prompt.send executes
→ explicitly SIMULATED evidence is emitted
→ the complete session replays deterministically
```

Read these before implementation:

1. [D1 release specification](D1-FIRST-RELEASE-SPEC.md)
2. [D1 atomic task list](D1-ATOMIC-TASKS.md)
3. [D1 execution acceleration directive](D1-EXECUTION-ACCELERATION-DIRECTIVE.md) — bounded operating rules that fold the acceleration review into the existing Ratchet/claim/proof system; not a second PM layer.
4. [VOMEGA SITREP](../SITREP.md)
5. [First Product Release Design](../../seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md)
6. [Invariants](../../seed-docs/INVARIANTS.md)
7. [Proof and Maturity](../../seed-docs/PROOF-AND-MATURITY.md)
8. [Semantic Data Engine](../../seed-docs/SEMANTIC-DATA-ENGINE.md)
9. [MVP Visualization Sandbox](../../seed-docs/MVP-VISUALIZATION-SANDBOX.md)
10. [Automated Semantic Experiments](../../seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md)
11. [D1 midstream correction / provenance](D1-MIDSTREAM-CORRECTION-ADDENDUM.md) — retained as the record of why Reflection/Migrator was added; its requirements are now folded into the primary D1 spec/tasks.

The seed documents define intent and protected distinctions. This D1 pack defines the **current bounded deliverable and build order**. It does not promote candidate Lab architecture into Ω constitutional law.

## What you are authorized to do

Implement D1 end to end. Refactor the baseline where needed. Add tests, fixtures, experimental runtime code, a developer-facing UI, scripts, evidence, and project-control updates required for D1.

You may change the task decomposition if implementation reality proves a better decomposition, but preserve the D1 acceptance gates and record why.

Do not modify authentication, provider credentials, model/provider configuration, subscriptions, or external accounts. Do not perform live provider submission in D1. Do not call simulated evidence live.

Use existing baseline mechanisms where they are useful. Harvest before inventing. Do not rewrite the working deterministic interpreter merely to fit a preferred architecture.

## Build rule

Work atomically from `D1-ATOMIC-TASKS.md`.

For each task:

- self-checkout and register the session;
- start from the Ratchet packet and named red gate;
- verify dependencies;
- implement one bounded outcome;
- add or update the smallest proof;
- run relevant tests;
- record material evidence/failure;
- promote only from current probe truth;
- obtain independent review;
- commit coherently and release the task claim.

Parallelize only tasks with genuinely disjoint write surfaces or explicit interfaces. If a gate already expresses the behavior, do not create another prose design pass unless the design-intensity system says the work genuinely needs one.

## Executable task control (added 2026-10-06)

The D1 definition of done now exists as code: 80 gates in `omega-baseline/experimental/d1/test/gates/`, tagged by task ID and run by the ratchet (`.project/ratchet/OPERATING.md`). Task state is computed from those gates, the ratchet lock and independent reviews. It is not written by hand here or in STATUS. From `omega-baseline/`: `bun run ratchet next` gives the next task packet, `bun run ratchet fanout --n 4` gives parallel tasks with disjoint write surfaces, and `bun run ratchet status` gives current state. Design and rationale: `.project/ratchet/DESIGN.md`.

## Definition of done

D1 is done only when all release gates in the specification pass, including:

- corpus U1 no longer produces false READY;
- two valid Claude Accounts remain visibly ambiguous without an explicit/default rule;
- typed and clicked correction produce the same canonical command digest;
- an obsolete interpretation revision cannot overwrite a newer one;
- `prompt.send` executes only through a virtual realization;
- every execution receipt is unambiguously marked `SIMULATED`;
- replay of a pinned complete journey produces the same semantic/evidence identity;
- the D1 capability slice is minimally self-describing: source-bound structural facts are extracted into a read-only Reflection representation, joined with active World/interpretation state, and projected into contextual Wiki/help without a parallel authoritative help database;
- the artifact can be launched by another developer with one documented command;
- existing named baseline tests remain green or any unrelated pre-existing blocker is explicitly preserved.

## Stop conditions

Stop and surface the evidence instead of guessing if D1 requires:

- live browser/provider access;
- an owner decision listed in `.project/DECISIONS.md`;
- auth/provider/model configuration changes;
- weakening an invariant or proof boundary;
- calling fixture/simulated behavior live;
- destructive repository history changes.

Otherwise, continue autonomously until D1 is runnable and evidenced.

## Relationship to parallel work and the next product convergence

D1 deliberately leaves live Provider/Account execution outside its own completion claim, but that live-reality path may advance **in parallel** under the Meta Tracker; it is not a mandated serial “D2”.

After D1, the next core **product convergence** is MP-02 + MP-03: the actual Floating Command Box first product release/end-to-end journey. That convergence draws from D1, minimal Reflection/Wiki, independent live Provider/Account proof, authority/evidence semantics, product surface, local continuity, packaging, and Truth. Do not serialize those workstreams unless evidence demands it.

The 67-program Meta Tracker remains the whole-program context; D1 is only one evidence-bearing integration slice.
