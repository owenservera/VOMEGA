# Elephant Context Network — Development Acceleration Hypothesis

## Status

**OPTIONAL / EXPERIMENT-DRIVEN DEVELOPMENT ACCELERATION HYPOTHESIS**

This document preserves a previously developed DevOps concept for empirical testing.

It does **not** prescribe:
- a fixed number of long-context sessions;
- permanent session identities;
- a permanent partition of the repository;
- a particular model/provider;
- ZCode as the only orchestration substrate;
- full-source residency as the final implementation;
- a fixed refresh cadence;
- a fixed protocol/schema;
- a fixed service catalog;
- a permanent “elephant” role;
- or a particular memory architecture.

The hypothesis is:

> **A distributed layer of long-lived, large-context cognitive domain sessions may materially reduce rediscovery, improve review quality, and accelerate development by maintaining rich contextual models of the project that ordinary workers can query, challenge, and submit artifacts to for review.**

The term **elephant** is a working metaphor for these long-context cognitive nodes.

The project should test whether the pattern earns its cost.

---

# 1. Why this hypothesis exists

Modern coding agents repeatedly pay a large reconstruction tax.

A fresh worker commonly needs to rediscover:
- architecture;
- semantic invariants;
- file relationships;
- historical decisions;
- failure modes;
- active experiments;
- implementation conventions;
- product intent;
- current test reality;
- cross-domain consequences.

Large-context sessions create the possibility of retaining far more of that project model continuously.

The core acceleration hypothesis is not merely:

> “put the whole repo in context.”

It is:

> **maintain distributed, reasoning-rich contextual models of project domains so workers can access already-contextualized intelligence instead of repeatedly rebuilding understanding from raw files.**

This is closer to a cognitive service layer than to ordinary retrieval.

---

# 2. Canonical truth remains outside the elephant

An elephant is never canonical project truth.

The authoritative basis remains:
- Git/repository state;
- current source files;
- tests;
- deterministic build/runtime evidence;
- current project truth artifacts;
- live external evidence where relevant.

An elephant is a **derived cognitive representation** of those sources.

Therefore:

**elephant context ≠ repository truth**

**elephant conclusion ≠ proof**

**elephant confidence ≠ authority**

**elephant memory ≠ canonical project state**

An elephant may be extremely useful while still being stale or wrong.

Every design experiment should preserve that distinction.

---

# 3. The conceptual topology

A possible topology is:

```
                    REPOSITORY / PROJECT TRUTH
                              │
                     refresh / reconcile
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
   Elephant A            Elephant B          Elephant C
   domain model          domain model        domain model
   large context         large context       large context
          │                   │                   │
          └────────── query / review / compare ──┘
                              │
                       ordinary workers
                  Codex / Claude / ZCode / others
```

The actual number of nodes, domains, models, and routing mechanism are experiment variables.

A future implementation may not use persistent chat sessions at all if another mechanism reproduces the same value more efficiently.

---

# 4. Domain-first versus function-first topology

Two broad partition strategies were identified.

## Domain-first

Each elephant maintains a coherent project domain, for example:

- core/runtime/contracts;
- Provider/Account/browser realization;
- semantic command system / interaction;
- product/UI/release design;
- Vault/data/continuity;
- DevOps/testing/project truth.

Advantages may include:
- less duplicated source;
- richer local causal understanding;
- clearer refresh ownership;
- easier reasoning over tightly coupled code.

Risks may include:
- boundary blindness;
- cross-domain coordination overhead;
- uneven context pressure.

## Function-first

Elephants specialize by cognitive service, for example:
- architecture reviewer;
- code reviewer;
- historical reasoning;
- test/falsifier expert;
- planning/impact analyst.

Advantages may include specialized reasoning behavior.

Risks may include:
- every node needing much of the same repository;
- heavy duplication;
- weaker persistent domain models;
- greater context synchronization cost.

### Current conceptual preference

**Domain-first with selective overlap at high-risk boundaries** appears promising, but this is a hypothesis to test, not a mandated topology.

The system should be free to:
- split;
- merge;
- rotate;
- retire;
- temporarily duplicate;
- or reassign elephant domains based on measured load and value.

---

# 5. Three context layers

A useful conceptual distinction from prior design work is to separate three kinds of elephant context.

## Resident context

The durable domain corpus the elephant is expected to maintain.

Possible contents:
- relevant source;
- contracts;
- architecture/context docs;
- current project truth;
- tests;
- known failure cases;
- domain history;
- important external/provider evidence;
- cross-domain interface summaries.

This is the elephant's maintained cognitive model.

## Wave context

Changes and active concerns introduced during the current development wave or epoch.

Examples:
- recent merged patches;
- currently active experiments;
- newly discovered failures;
- changed interfaces;
- temporary architectural questions.

Wave context allows the elephant to reason about current movement without immediately rebuilding its entire resident corpus.

## Transaction context

Short-lived material supplied for one request.

Examples:
- proposed patch;
- entire modified file;
- implementation plan;
- failing trace;
- alternative architecture;
- test output;
- worker question.

Transaction context should normally be discardable after the service request unless its content is later promoted into resident/wave knowledge.

These layers are conceptual, not storage-format requirements.

---

# 6. Epoch-aware cognition

One of the most important ideas is **epoch validity**.

A long-context session can become dangerously persuasive while reasoning from stale source.

Therefore an elephant response should be attributable to a known project basis.

Conceptually, each elephant should know something equivalent to:

- repository commit/epoch;
- domain snapshot version;
- incorporated change range;
- known unincorporated changes;
- relevant evidence timestamp.

A response should be able to communicate:

> “This assessment is based on repository epoch X and domain refresh Y.”

If the requested artifact depends on newer state, the elephant should:
- refresh;
- request the missing delta;
- explicitly limit its claim;
- or mark the answer stale.

The implementation can vary.

The invariant is that **staleness must remain visible and testable**.

---

# 7. Cognitive Work Waves

A previously discussed operating model was a wave-based cycle.

Conceptually:

```
stable project epoch
      ↓
elephants contextualized
      ↓
workers fan out
      ↓
implementation / research / experiments
      ↓
worker artifacts reviewed / verified
      ↓
accepted changes converge in Git
      ↓
new project epoch
      ↓
affected elephants reconcile / refresh
      ↓
next wave
```

This may help bound synchronization cost and reduce continuous context churn.

However, the project should test alternatives:
- continuous delta ingestion;
- event-driven refresh;
- on-demand refresh;
- partial domain refresh;
- session rotation;
- complete reconstruction.

“Wave” is a useful mental model, not a required scheduler.

---

# 8. Elephant service model

The elephant should be treated as a **service provider to workers**, not simply a chat room.

The initial candidate service catalog discussed includes:

## Consult
Answer domain questions from already-maintained context.

Examples:
- “Where should this capability live?”
- “What other code depends on this contract?”
- “Why was this boundary created?”
- “Which invariant does this proposal threaten?”

## Artifact Review
Receive a full file, patch, design, or proposal and compare it against the maintained project model.

Example:

> Here is the updated file and intended behavior. Compare it against the domain. Find contradictions, missed dependencies, architectural regressions, and test gaps.

## Artifact Repair
Produce a corrected candidate artifact based on the domain model.

The result remains a proposal requiring normal verification.

## Impact Analysis
Estimate affected files, contracts, tests, product behavior, and neighboring domains.

## Design Validation
Evaluate a design against current implementation reality, invariants, and known failures.

## Dependency / Trace Analysis
Explain relationships across source, contracts, tests, and runtime paths.

## Debugging
Interpret failure capsules or logs using the surrounding domain model.

## Historical Reasoning
Explain how the current state evolved and which previous attempts/failures are relevant.

## Reconciliation
Absorb verified changes and update the maintained cognitive domain model.

## Knowledge Extraction
Produce compact, evidence-linked context artifacts useful to workers or other elephants.

## Cross-Elephant Consultation
Ask another domain node for context when a question crosses a boundary.

## Onboarding
Provide a fresh worker with a domain-aware briefing rather than raw file lists.

This catalog should be **tested and ranked empirically**.

Do not assume every service is valuable.

The team should discover:
- which services reduce cycle time;
- which improve correctness;
- which duplicate ordinary retrieval;
- which create congestion;
- which cause context pollution.

---

# 9. Worker → elephant submission protocol

Workers should be able to submit more than simple questions.

Candidate submission forms include:

### REFERENCE
Pointers to repo files/commits when the elephant can access current source directly.

### PATCH
A compact diff against a known epoch.

### FULL ARTIFACT
Entire file, design document, trace, or other artifact when local context matters.

### MIXED PACKET
References plus patch plus intent plus evidence.

A useful conceptual request may include:

- task/objective;
- target domain;
- repository epoch;
- changed artifact(s);
- intended behavior;
- assumptions;
- current tests/evidence;
- requested service;
- desired output form.

The exact wire format should emerge from testing.

The objective is **low transaction cost**, not protocol ceremony.

---

# 10. Example high-value review loop

A central use case discussed earlier is:

```
worker implements change
        ↓
worker submits patch/full file + intent
        ↓
domain elephant compares against resident context
        ↓
elephant returns:
  - contradictions
  - affected dependencies
  - missed invariants
  - test gaps
  - suggested corrections
        ↓
worker revises
        ↓
deterministic tests / independent verification
        ↓
accepted change merges
        ↓
elephant later reconciles verified new epoch
```

The important property is that the reviewer begins already contextualized.

The project should measure whether this materially outperforms:
- fresh-agent review;
- ordinary RAG/retrieval;
- static analysis alone;
- repeated full-context bundle creation.

---

# 11. Elephants should generally not be workers

A useful boundary hypothesis is:

> **Keep resident cognitive nodes primarily in consult/review/reconcile roles rather than using them as ordinary implementation workers.**

Why:
- active implementation introduces large amounts of transient task context;
- long-lived contexts may become polluted by abandoned approaches;
- worker activity can obscure the stable domain model;
- mutation authority becomes harder to reason about.

The default model should therefore be:

**elephant advises → worker changes → tests/evidence adjudicate**

But this is an experiment variable.

If implementation inside elephant sessions proves consistently superior without degrading resident context quality, the boundary can change.

---

# 12. Context pollution and forgetting

A very large context is not automatically a good context.

Potential failure modes include:
- irrelevant historical detail dominating reasoning;
- abandoned designs remaining salient;
- duplicated versions of files;
- stale summaries competing with current source;
- transient worker artifacts accumulating indefinitely;
- token pressure degrading retrieval/attention;
- false synthesis across contradictory epochs.

Experiments should test:
- explicit resident/wave/transaction separation;
- garbage collection;
- session rotation;
- selective reconstruction;
- stale artifact removal;
- structured context manifests;
- prioritization/attention hints;
- compressed but reconstructable domain packets.

The goal is **high-quality contextual cognition**, not maximum token occupancy.

---

# 13. Full source residency is a hypothesis

The motivating idea is that very large contexts may allow substantial or complete source domains to remain loaded.

Do not prematurely decide that literal full-source residency is always best.

Test alternatives such as:
- full source;
- source + selective history;
- source + compact dependency maps;
- source with generated domain index;
- compressed semantic summaries plus exact hot files;
- hierarchical context;
- retrieval into a persistent resident model;
- rotating source windows.

The important question is:

> **Which representation gives the best reasoning quality per unit of context, refresh cost, and latency?**

---

# 14. Context sizing experiments

The project should empirically characterize:

- reasoning quality versus resident token occupancy;
- degradation near context limits;
- ideal reserve for worker-submitted artifacts;
- how much transient context can be tolerated;
- when a domain should split;
- whether duplicated boundary files improve review quality;
- whether very large files should be resident or referenced;
- whether old history should be summarized or retained verbatim.

A 1M-token model should not automatically be filled to 1M tokens.

Reserve capacity may itself be valuable.

---

# 15. Dynamic topology and load balancing

The elephant network should be allowed to evolve.

Signals that may justify splitting a node:
- context saturation;
- high query latency;
- growing domain divergence;
- recurrent boundary mistakes;
- too much transaction context;
- overloaded request queue.

Signals that may justify merging:
- low utilization;
- excessive cross-elephant consultation;
- highly coupled domains;
- duplicated resident context.

Signals that may justify temporary replicas:
- release-critical review bursts;
- high-risk migrations;
- independent verification needs.

This is a dynamic resource-allocation problem, not an org chart.

---

# 16. Admission control and congestion

Long-context nodes may become bottlenecks.

Potential controls to test:
- request queues;
- priority classes;
- batching;
- duplicate-query suppression;
- worker-side prefiltering;
- context-cache hits;
- fan-out limits;
- timeout/fallback to fresh workers;
- replica nodes;
- circuit breakers.

A worker should not block indefinitely because “the elephant knows more.”

The network must be allowed to degrade gracefully.

---

# 17. Cross-elephant reasoning

Some work necessarily crosses domain boundaries.

Candidate approaches:
- worker queries multiple elephants independently;
- primary elephant asks another elephant;
- coordinator assembles responses;
- temporary shared review session receives domain packets;
- boundary-specific overlapping elephant.

Cross-node reasoning should be tested carefully because it can multiply latency and congestion.

The objective is not maximum conversation.

It is minimum coordination cost for materially better decisions.

---

# 18. Contradictions and disagreement

Elephants may disagree.

That is useful evidence.

Do not force silent consensus.

A disagreement should be resolvable through:
- current source;
- tests;
- runtime evidence;
- explicit project decisions;
- targeted experiment;
- human authority when appropriate.

Possible useful output:

> Core elephant predicts this is safe. Provider elephant predicts it breaks Account identity. The disputed dependency is X. Run falsifier Y.

The network should surface contradictions rather than averaging them away.

---

# 19. Relationship to automatic context bundles

Automatic Context Bundles and elephants solve different problems.

### Context bundle
A compact task-specific package assembled for a fresh worker.

### Elephant
A maintained long-context cognitive model that can reason over a domain across many transactions.

They may complement each other.

An elephant could:
- generate a context bundle;
- critique a generated bundle;
- identify missing context;
- provide domain-specific onboarding.

A context bundle may also be a fallback when an elephant is stale or unavailable.

---

# 20. Relationship to Development Reality Layer

A Development Reality Layer could become a useful input to elephants.

Potential signals:
- actual files touched;
- test failures;
- runtime traces;
- active objectives;
- browser/provider observations;
- worker attempts;
- resolved bugs;
- friction patterns.

However raw telemetry should not flood long-context nodes.

A promotion/filtering mechanism should decide which development observations deserve resident or wave context.

The elephant network should consume **useful project evidence**, not every recorded event.

---

# 21. Relationship to Harvest-First Engineering

Elephants may accelerate harvest work by remembering:
- previously evaluated repositories;
- rejected approaches;
- licensing constraints;
- prior implementation comparisons;
- known ecosystem patterns.

But an elephant's memory of a third-party project is not current evidence.

Time-sensitive or externally changing facts still require refresh.

---

# 22. Relationship to current heterogeneous development pool

The current development environment includes:
- Codex;
- Claude Code;
- ZCode;
- five independently configured Space Bunny Free lanes with large context windows;
- deterministic local tooling.

This makes the elephant hypothesis unusually testable.

Possible experiments may reserve some large-context lanes as elephants while other systems act as workers.

Do **not** assume:
- all five lanes are live;
- Space Bunny is the best elephant model;
- elephants must run on ZCode;
- each provider lane should map to one elephant;
- every elephant should use the same model.

Model/provider diversity itself may be an experiment variable.

Existing provider/auth configuration remains read-only.

---

# 23. Service value ranking

The prior design explicitly rejected assuming the elephant's best services in advance.

The project should measure service value.

Possible metrics:
- worker onboarding time reduced;
- review defects found;
- missed cross-file dependencies found;
- regressions prevented;
- implementation revisions avoided;
- time to architecture decision;
- duplicate research avoided;
- tokens spent versus fresh-session alternatives;
- latency;
- human intervention;
- false-positive review findings;
- stale-answer incidents.

Each service can earn a disposition such as:
- high-value default;
- valuable only for high-risk work;
- domain-specific;
- redundant;
- too expensive;
- harmful/context-polluting.

---

# 24. Experiment ladder

A small empirical progression may be more useful than immediately creating a full network.

### Experiment A — One elephant, one domain
Load a coherent domain deeply.

Compare fresh-worker versus elephant-assisted answers/reviews.

### Experiment B — Worker artifact review
Have a worker submit real patches/files.

Measure defects/dependencies found and revision cost.

### Experiment C — Epoch refresh
Change the domain after the elephant is contextualized.

Test stale detection and refresh strategies.

### Experiment D — Two elephants
Split two coupled domains.

Test boundary queries and cross-domain review.

### Experiment E — Wave
Run several workers against a stable epoch, reconcile verified changes, refresh affected elephants.

Measure synchronization cost versus benefit.

### Experiment F — Context pressure
Increase resident and transaction context until quality degrades.

Characterize useful operating ranges.

### Experiment G — Service ranking
Compare Consult, Review, Impact Analysis, Debugging, Onboarding, and other services.

This sequence is illustrative, not mandatory.

---

# 25. Critical falsifiers

The hypothesis should be rejected, narrowed, or redesigned if evidence shows:

1. fresh workers plus ordinary retrieval perform as well at lower cost;
2. elephant answers frequently become dangerously stale;
3. refresh cost consumes most of the saved time;
4. context pollution causes persistent reasoning errors;
5. cross-elephant coordination becomes a major bottleneck;
6. long-lived sessions cannot be maintained reliably;
7. workers over-trust elephant conclusions despite contrary evidence;
8. full-source residency provides no advantage over compact context bundles;
9. domain partitioning hides important cross-cutting consequences;
10. the system creates more orchestration overhead than validated throughput.

---

# 26. Important success criteria

The elephant hypothesis is valuable if it measurably enables workers to:

- start meaningful work faster;
- make fewer architecture-context mistakes;
- catch more cross-file/cross-domain consequences;
- perform better code/design review;
- avoid rediscovering historical failures;
- produce stronger patches with fewer correction rounds;
- preserve high-quality project understanding across sessions;
- scale parallel development without every worker loading the whole project independently.

The goal is not persistent chats.

The goal is **persistent useful cognition over project reality**.

---

# 27. Anti-patterns

Do not:
- treat elephant sessions as canonical truth;
- fill context windows merely because capacity exists;
- keep stale code in resident context without epoch metadata;
- allow elephants to silently edit/commit by default;
- predefine a permanent domain topology before testing;
- make every worker query every elephant;
- preserve every conversation indefinitely;
- confuse high token count with high contextual quality;
- force a service catalog that experiments show has low value;
- create a complex messaging/orchestration platform before one elephant proves value;
- let elephant maintenance delay first-product delivery.

---

# 28. Conceptual summary

The hypothesis can be summarized as:

> **A distributed, epoch-aware network of persistent large-context cognitive domain services may act as an intelligent project-memory layer for development workers.**

The nodes maintain rich derived models of current project domains.

Workers can query them, submit whole artifacts or patches, request review/impact/debugging help, and receive reasoning grounded in already-resident context.

Verified repository reality remains authoritative.

The topology, protocol, refresh method, context representation, model choice, node count, service catalog, and implementation substrate are all deliberately deferred to experiment.

**Preserve the concept. Test the mechanism. Promote only measured leverage.**
