# Launch Workstreams — Ownership Boundaries for Local Agent Teams

Status: **TEAM-LAUNCH DESIGN**  
Parent: [README.md](README.md)

The current release roadmap remains the proof/task reference. This document regroups its work for concurrent execution after the semantic/UI/self-knowledge design expansion.

---

## SDW — Semantic Data & World

### Mission

Own the semantic identities and runtime World that every higher layer consumes.

SDW answers:

> What things exist, how are they distinct, what relationships/state are valid, and what bounded World does interpretation ground against?

### Owns

- Provider / Account / Model / Session / Capability / Realization semantic distinctions;
- stable semantic identity conventions;
- MVP fixture Worlds;
- Provider→Account→Model relationships;
- capability schemas and parameters;
- consequence facets;
- realization fidelity and evidence-maturity vocabulary;
- defaults as user-owned semantic state;
- World projection used by the command compiler;
- registry/state derivation;
- storage independence of semantic IDs.

### Existing roadmap mapping

- REG-01 — record kinds;
- REG-03 — capability-state derivation;
- REG-05 — release WorldModel producer;
- REG-02/06/07/08 — later durable Account/session relationship work;
- parts of CMD-05 where the command refers to semantic IDs;
- VSX-02 from the Visualization Sandbox design.

### First deliverables

1. **MVP semantic contract v0**
   - Provider;
   - Account;
   - Model;
   - Capability;
   - Realization;
   - consequence;
   - fidelity;
   - evidence maturity.

2. **Named synthetic Worlds**
   - blank;
   - one Account per Provider;
   - two Claude Accounts;
   - Model-routing World;
   - unavailable combination;
   - stale relationship.

3. **World adapter proposal**
   - map current `WorldModel` to the MVP semantic contract without freezing the long-term schema.

### Does not own

- NLP grammar;
- VisualSpec rendering;
- Wiki prose;
- provider browser implementation;
- authority decisions.

### Primary consumers

LNC, VFX, SKW, EXP, RTE.

---

## LNC — Language & Command Compiler

### Mission

Turn human expression into explicit semantic commands deterministically enough that setup, routing, help and `prompt.send` share one path.

LNC answers:

> What did the person mean, which semantic fields are known or unresolved, and is the resulting command structurally valid?

### Owns

- NCL/NLCL pipeline;
- contributed language frames;
- lexicon/aliases;
- addressee grammar;
- Provider / Account / Model language grounding;
- candidate `UseCommand`;
- deterministic validator/normalizer;
- defaulting rules;
- interpretation revision/session semantics;
- canonical rendering and digest;
- replay/explanation of why a target was selected;
- corpus regression for command meaning.

### Existing roadmap mapping

- CMD-01…CMD-13;
- TRU-04 is an external gate, not LNC ownership;
- VSX-03 session harness;
- Model-routing refinement from the updated CMD workstream.

### First deliverables

1. Current compiler gap map against the new MVP semantics.
2. Candidate `UseCommand` route fields:
   - capability;
   - Provider;
   - Account;
   - optional Model;
   - parameters/payload;
   - context refs;
   - consequence/authority refs;
   - revision/world refs.
3. Addressee-first + orientation collision plan.
4. InterpretationSession revision contract.
5. Extended scenario/corpus cases for Model routing and quoted payload boundaries.

### Does not own

- semantic entity persistence;
- Provider/browser execution;
- visual styling;
- authority grants.

### Primary consumers

VFX, EXP, RTE, SKW.

---

## VFX — Visual Feedback & MVP Sandbox

### Mission

Make the machine's semantic interpretation visible, correctable and learnable before execution.

VFX answers:

> What should the person see right now, and how can a visual interaction modify meaning without creating hidden UI state?

### Owns

- VisualSpec vNext candidate;
- semantic handles;
- token/phrase annotations;
- Provider / Account / Model route representation;
- unresolved-choice representation;
- consequence/evidence projections;
- semantic interaction reducer;
- floating-box product simulator;
- compact/expanded states;
- visual treatment packs;
- icon-role mappings;
- revision stability/flicker behavior;
- developer semantic inspector for the sandbox.

### Existing roadmap mapping

- SHL-02/03/04 conceptually;
- SHL-06/07 later product integration;
- VSX-01…VSX-12;
- current `VisualSpec` and `project.ts` are the starting substrate.

### First deliverables

1. Current VisualSpec/projector gap assay.
2. VisualSpec vNext candidate using SDW/LNC semantic handles.
3. Three render variants over the same fixture state:
   - annotated sentence;
   - compact semantic strip;
   - hybrid.
4. Floating-box simulator that performs no real provider action.
5. Click/typed semantic-equivalence proof.

### Does not own

- parsing raw language;
- Provider/Account truth;
- real provider model inventory;
- Wiki fact authority;
- product execution.

### Primary consumers

EXP, RTE, owner/product review.

---

## SKW — Self-Knowledge, Reflection & Contextual Wiki

### Mission

Make Ω structurally incapable of exposing public behavior it cannot inspect and explain.

SKW answers:

> What does this loaded system know about itself, where does that fact come from, and what explanation is relevant now?

### Owns

- Reflection ABI proposal;
- source anchors;
- Reflection Graph;
- reflection completeness;
- existing-code Reflection Migrator;
- source-native semantic declaration migration;
- contextual Wiki projection;
- Wiki topic ranking;
- explicit introspection route, including exploration of the historical `?` family;
- structural/live/historical/commentary/generated claim distinctions;
- source-linked help.

### Existing roadmap mapping

- HLP-01…HLP-05;
- REF-01…REF-12;
- portions of existing `vivim.mind`/control describe assays;
- Reflection-related core boundary design.

### First deliverables

1. Read-only current-code reflection audit.
2. Deterministic Reflection node/edge extraction for manifests + registered ops.
3. Source-anchor convention.
4. Minimal graph capable of explaining the MVP fixture capability.
5. Contextual Wiki projector over semantic handles.
6. Completeness-gap report.

### Does not own

- runtime authority;
- capability truth independent from source/runtime;
- UI semantic meaning;
- hand-authored Wiki pages.

### Primary consumers

VFX, EXP, RTE, Forge/evolution later.

---

## EXP — Semantic Lab & Automated Experiments

### Mission

Turn language/UI/self-knowledge design into replayable evidence rather than opinion.

EXP answers:

> Did this candidate make semantic behavior better across the corpus, what did it break, and what evidence supports promotion?

### Owns

- Lab Profile execution for the MVP semantic slice;
- scenario runner;
- experiment artifacts;
- semantic diff;
- metamorphic mutation engine;
- counterexample mining;
- wrong-target metric;
- false-ready metric;
- ambiguity-honesty metric;
- semantic-churn metric;
- visual batch rendering;
- Wiki grounding/relevance tests;
- negative knowledge / rejected candidates;
- OS-taxonomy generalization benchmark.

### Existing roadmap mapping

- EXP-01…EXP-12;
- EXP-A…EXP-G;
- CMD-13 supplies real-phrasing input but LNC owns the command corpus semantics;
- parts of TRU-02/04 are verification inputs, not EXP self-approval.

### First deliverables

1. Run current release corpus through a reusable scenario runner.
2. Semantic diff representation.
3. MVP scenario-set format.
4. Baseline metrics.
5. Mutation/metamorphic suite.
6. Experiment runner capable of comparing two language or VisualSpec variants.

### Does not own

- deciding product truth by score alone;
- final review of its own experiment engine;
- authority;
- live Provider evidence.

### Primary consumers

LNC, VFX, SKW, SDW, TRU.

---

## PRV — Provider Reality Lab

### Mission

Close the gap between semantic product claims and real browser/provider behavior.

PRV answers:

> Can Ω actually reach the user's existing Provider relationship, prove which Account is active, execute a provider capability and observe the result truthfully?

### Owns

- transport inventory and harvest;
- browser/profile/session characterization;
- Account identity evidence;
- Provider-specific semantic knowledge;
- provider realization packs;
- live `prompt.send`;
- Shadow/manual reference traces;
- conformance;
- drift;
- recovery/healing experiments;
- second-provider falsification;
- provider-specific Model discovery evidence.

### Existing roadmap mapping

- PRV-01…PRV-12;
- Provider Lab strategy;
- later REG-04 evidence inputs;
- later GOV-05 receipt inputs.

### First deliverables

1. Read-only transport inventory.
2. Transport Harvest Bench.
3. Provider-1 Account identity evidence hypothesis.
4. Minimal metadata-only transport spike when safe.
5. Evidence contract that SDW/RTE will later consume.

### Does not own

- canonical capability semantics;
- generic command grammar;
- visual UI;
- authority policy;
- declaring fixture state live.

### Primary consumers

SDW, RTE, TRU, later EXP.

---

## RTE — Runtime, Authority, Native Shell & Release

### Mission

Turn validated semantic commands into governed product behavior and package the resulting product without collapsing the semantic/UI boundaries.

RTE answers:

> How does a validated command cross the trusted execution boundary, and how is the real Windows product installed, invoked and recovered?

### Owns

- release composition;
- consequence→authority policy mapping;
- consent;
- execution envelope;
- attempt-before-effect discipline;
- receipts/failure/uncertain outcomes;
- shell principal and authenticated shell↔host channel;
- native floating-shell framework;
- packaging/runtime spike;
- installer/update/lifecycle;
- crash/restart recovery;
- native integration of stabilized VisualSpec.

### Existing roadmap mapping

- GOV-01…GOV-08;
- SHL-01/05/06/08 and final native integration;
- REL-01…REL-07.

### First deliverables that can start now

1. Close/characterize current web-surface trust boundary (GOV-06).
2. Shell-framework harvest/spike plan (SHL-01).
3. Packaging spike plan (REL-02).
4. Consequence/authority mapping assay against new multidimensional consequence design.

### Deliberately waits for stabilized inputs

Native product-shell semantic integration waits for:

- LNC validated command contract;
- VFX VisualSpec evidence;
- SDW route identities;
- PRV real Account/transport evidence for live execution.

### Does not own

- NCL interpretation;
- semantic identity;
- provider-specific realization knowledge;
- Wiki facts.

---

## DEV — Development System & Integration

### Mission

Maximize validated parallel throughput while keeping the development system disposable, observable and reconstructable.

DEV answers:

> Which work can safely run now, where should it run, how will it be isolated, and how does it get merged without creating coordination debt?

### Owns

- executor/lane health;
- ZCode workflow orchestration;
- task capsules;
- temporary worktree lifecycle;
- write-set collision detection;
- merge/integration queue;
- deterministic post-merge gates;
- Commons/SITREP continuity;
- lightweight context bundles;
- measured routing of work across ZCode/Codex/Claude;
- triggers and handoffs;
- congestion observation.

### Existing roadmap mapping

- OPS-01…OPS-04;
- selected development-acceleration hypotheses;
- no product task ownership.

### First deliverables

1. Verify executor lanes without changing configuration.
2. Adopt the launch overlay into Commons.
3. Implement/encode short-lived task isolation.
4. Create reusable ZCode fan-out/fan-in workflow only if the installed runtime proves the documented capability.
5. Establish one merge/review queue.
6. Record worker/tool outcome evidence for later routing.

### Does not own

- architecture by virtue of coordination;
- permanent master status;
- product semantics.

---

## TRU — Truth & Independent Verification

### Mission

Independently challenge every material claim before it becomes project truth or release proof.

TRU answers:

> What is actually proven, what is only fixture/simulated/authored, and what would falsify this claim?

### Owns

- proof ledger;
- evidence level;
- independent review;
- falsifier suite;
- semantic regression gate;
- static checks for touched code;
- adversarial tests;
- source/runtime claim reconciliation;
- promotion objections/veto findings;
- second-provider falsification review;
- release-readiness audit.

### Existing roadmap mapping

- TRU-01…TRU-09.

### First deliverables

1. Update proof ledger for the new semantic sandbox claims.
2. Establish named semantic regression lane.
3. Define sandbox-specific falsifiers:
   - false-ready;
   - hidden Account/Model switch;
   - UI-only semantic action;
   - Wiki unsupported claim;
   - late-revision overwrite;
   - fixture presented as live.
4. Independently review first-wave contracts from SDW/LNC/VFX/SKW/EXP.

### Does not own

- implementing the product change it reviews;
- deciding owner product preferences;
- silently blocking work without a concrete falsifier/evidence gap.

---

# Shared handoff contract

Every workstream handoff should contain:

```
objective
source commit
files/artifacts changed
semantic/interface outputs
assumptions
known unknowns
tests/evidence run
failures
dependency requests
next consumer
```

For a contract change, add:

```
old shape
new shape
compatibility impact
consumers searched
migration required
falsifier
```

# Trigger matrix

| Event | Automatically involve |
| --- | --- |
| New/changed semantic entity | SDW + LNC + SKW + EXP + TRU |
| New language/frame behavior | LNC + EXP + TRU; VFX if visible |
| New visible semantic interaction | VFX + LNC + EXP + TRU |
| New public plugin capability | SKW + SDW + TRU |
| Reflection completeness gap | SKW + owning implementation stream |
| Provider/account/browser observation | PRV + SDW; TRU if promoted |
| Provider drift/failure | PRV + TRU; RTE if product execution affected |
| New consequential execution behavior | RTE + TRU + SDW consequence semantics |
| Packaging/native-shell issue | RTE + DEV; TRU at proof boundary |
| Repeated coordination/context friction | DEV; test accelerator before permanence |
| Architectural disagreement with material consequences | DEV creates hypothesis arena; EXP/TRU evaluate |
