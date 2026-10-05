# Provider Lab Strategy — Live Provider Conformance, Shadow Observation, and Healing

## Status

**STRONG STRATEGIC HYPOTHESIS / DEVELOPMENT ACCELERATOR**

This document captures an approved development strategy for the Provider / Account / Browser / Routing / Healing problem space.

It is **not** a declaration that a Chrome extension, side panel, mirror UI, selector strategy, protocol path, or current provider should become permanent Ω product architecture.

The goal is to create an environment in which provider work can be discovered, exercised, falsified, repaired, and verified against real external behavior at very high speed.

## Core idea

Use one or more local Chrome extensions in developer mode as an instrumented **Provider Lab**.

For a supported provider such as ChatGPT, Claude, Gemini, or another web application, the Lab may present a provider-specific control surface that mirrors the provider's usable capability surface closely enough that a developer or user can operate the provider through the Lab.

The objective is not pixel-perfect cloning.

The objective is **semantic and functional parity**:

> Can the Lab expose and exercise the provider capabilities that actually matter, using the same provider knowledge, realization, evidence, testing, and healing machinery that Ω could later invoke from other surfaces?

Provider-native labels, menu structures, model choices, settings, and interaction concepts may be mirrored where doing so improves fidelity, discovery, testing, or human understanding.

Visual imitation has no independent architectural value.

## Why this may accelerate development

The Lab compresses several normally separate activities into one live environment:

**provider exploration → capability discovery → semantic characterization → realization → execution → evidence → conformance testing → drift detection → repair → verification**

A developer can test immediately against a real authenticated provider session instead of waiting for a larger Ω product shell to exist.

The Lab therefore acts as a fast experimental substrate for:
- provider capability mapping;
- account/session characterization;
- browser realization;
- provider-specific UI/protocol knowledge;
- live execution;
- conformance tests;
- regression;
- drift detection;
- self-healing research;
- provider-specific failure/recovery behavior;
- second-provider/generalization falsification.

## The Lab is not the product authority

The extension is an experimental surface.

It must not become a second semantic system or a hidden provider-specific product architecture.

Where practical, a Provider Lab action should invoke the same underlying semantic capability and realization machinery that another Ω surface could invoke later.

Conceptually:

```
Provider Lab mirror ─┐
Universal Prompt ────┤
Agent / Work ────────┤
Composition ─────────┼→ semantic capability
future surface ──────┘        ↓
                       provider realization
                              ↓
                        real provider
```

Nothing important should exist only because the mirror needs it unless it is clearly classified as Lab-only instrumentation.

## Provider-specific semantic twin

A provider-specific mirror should be understood as a **semantic twin** of the provider's usable capability surface.

It may expose:
- conversation creation/navigation;
- model or mode selection;
- message composition/submission;
- attachments;
- stop/regenerate/retry;
- search;
- projects/workspaces;
- account-relevant controls;
- provider-specific tools;
- settings or menus relevant to capability behavior;
- other observed provider-native capabilities.

The Lab should not assume that similarly named provider features are the same semantic capability.

Provider-native concepts remain provider knowledge until evidence supports a more general semantic mapping.

## Shadow Observation

The Lab should be capable of observing the owner's **normal real interactions** with supported provider pages as an independent validation channel.

The user may interact directly with ChatGPT, Claude, Gemini, or another supported provider while the Lab remains in **Shadow** mode.

The observer should attempt to characterize:
- what interaction occurred;
- what provider state existed before;
- what meaningful state transition followed;
- what UI/control identity was involved;
- what observable network/runtime/browser consequences occurred where appropriate;
- which known semantic capability, if any, explains the interaction;
- whether the currently known realization predicts the observed outcome.

Normal provider usage thereby becomes live evidence.

## Four useful operating modes

### SHADOW
The person uses the provider normally.

The Lab observes and:
- validates known behavior;
- discovers unknown interactions;
- detects drift;
- accumulates real usage evidence.

### CONTROL
The person operates the provider through the Lab mirror.

The Lab invokes the provider capability/realization machinery and observes the external result.

### CONFORMANCE
The Lab deliberately exercises known capabilities in safe test contexts and compares observed results against expected semantic outcomes.

### HEALING LAB
The team deliberately introduces or encounters realization failure/drift, then tests:

**detect → characterize → propose repair → test → verify → probation → promote or reject**

These modes may evolve. The important distinction is between passive human observation, controlled execution, deliberate conformance, and repair experimentation.

## Real interaction traces as validation

A successful manual action can act as a **live reference example** for the same semantic capability.

For example:

```
manual attach-file + send
        ↓
observed successful outcome
        ↓
semantic characterization
        ↓
automated realization performs same capability
        ↓
compare semantic outcomes
```

The comparison need not require identical clicks, DOM paths, network traffic, or provider internals.

The meaningful question is whether the same intended capability produced the relevant equivalent external state/result under the correct account/session and authority conditions.

This creates a path toward differential validation between:
- human-native provider interaction;
- Lab-controlled interaction;
- Ω-controlled interaction.

## Continuous conformance and drift

Real usage can continuously challenge the provider model.

A previously verified realization may still execute successfully while the provider changes:
- menu hierarchy;
- labels;
- DOM structure;
- accessibility structure;
- state transitions;
- network behavior;
- completion signals;
- model lists;
- session/account indicators;
- other provider-specific affordances.

The Lab should be able to distinguish, where evidence allows:
- conforming behavior;
- harmless change;
- meaningful drift;
- degraded realization;
- broken realization;
- unknown behavior.

A realization that still works today may nevertheless become higher-risk when observed behavior diverges from its known basis.

## Passive capability discovery

When the owner performs a provider interaction the Lab does not yet understand, it should be possible to record it as an **unknown interaction / capability candidate** rather than forcing an immediate interpretation.

A useful discovery loop is:

**manual use → observation → interaction cluster → candidate capability → semantic characterization → realization candidate → falsifier → live verification**

This lets ordinary provider use expand the provider knowledge map without pretending every click is already understood.

## Usage-weighted capability coverage

Provider feature inventories alone do not tell the team what matters.

Shadow observation can reveal which provider capabilities are actually used frequently, occasionally, rarely, or never during normal work.

This should inform MVP and engineering prioritization while respecting privacy and avoiding the false inference that low historical use means low future value.

The team should be able to distinguish:
- theoretical provider capability coverage;
- verified capability coverage;
- live capability coverage;
- **useful / observed capability coverage**.

## Privacy and capture discipline

Continuous observation must not imply indiscriminate content logging.

Default toward **structural and semantic evidence** rather than full raw content capture.

Where possible, useful evidence may include:
- interaction type;
- provider/control identity;
- state before/after;
- timestamps;
- content type;
- size/length;
- hashes/digests where useful;
- capability mapping;
- account/session evidence;
- result state;
- failure/drift metadata.

Do not persist raw prompt text, response content, uploaded document contents, credentials, secrets, or unrelated personal data merely because the browser can observe them.

Content-level capture should be purposeful, scoped, local, attributable, and enabled only when the experiment genuinely requires it.

The exact privacy implementation remains a design problem, but the Lab should be safe enough to leave running during ordinary real use.

## Provider knowledge produced by the Lab

Over time, the Lab may accumulate evidence about:

- provider surfaces;
- capability candidates;
- provider-native labels and concepts;
- controls and menus;
- state transitions;
- account/session signals;
- models/modes;
- browser/profile requirements;
- DOM/accessibility/network/runtime observations;
- manual interaction traces;
- automated interaction traces;
- successful and failed realizations;
- recovery paths;
- drift history;
- repair attempts;
- verification evidence;
- usage frequency;
- unresolved contradictions.

This is **provider knowledge**, not automatically canonical Ω semantics.

## Shared substrate versus provider packs

The Lab should actively test what is genuinely reusable across providers.

A useful conceptual separation is:

```
Provider Lab
  shared observation / evidence / testing / drift / healing substrate
        ↓
provider-specific knowledge / realization packs
        ├─ ChatGPT
        ├─ Claude
        ├─ Gemini
        └─ future / unknown provider
```

This is a hypothesis to test, not a mandatory code layout.

Provider-specific quirks should not be promoted into shared semantics merely to make the first provider easy.

## Second-provider and third-provider falsification

The first working provider is weak evidence for a general abstraction.

A materially different second provider should challenge every important shared boundary.

A third provider can help distinguish:
- genuine common capability;
- accidental similarity between two providers;
- provider-specific behavior masquerading as platform architecture.

The team should record when supporting a new provider requires changing shared machinery rather than only provider-specific knowledge. Those changes are valuable architectural evidence.

## Deliberate breakage and healing experiments

The Provider Lab should make it cheap to test recovery before real provider drift forces the issue.

Possible experiments may intentionally invalidate:
- selectors;
- control assumptions;
- parser expectations;
- state transitions;
- provider labels;
- protocol knowledge;
- timing assumptions;
- session conditions;
- realization metadata.

The objective is not to demonstrate clever self-healing.

The objective is to characterize which failures can be:
- detected;
- diagnosed;
- safely repaired;
- verified;
- promoted;
- rolled back;
- or must remain human-reviewed/unsupported.

## Side panel, DevTools, and other surfaces

A clean provider mirror and an engineering instrumentation surface solve different problems.

The project may explore:
- a user/developer-facing extension side panel for provider interaction;
- a DevTools-style surface for raw observations, traces, selectors, capability mappings, tests, drift, and healing;
- background extension components;
- external local tooling where browser-extension boundaries are insufficient.

These are candidate Lab mechanisms, not product requirements.

## Evidence flow into Ω

The Lab should generate artifacts that can inform Ω without granting the Lab authority over Ω.

Useful promoted outputs may include:
- semantic capability definitions;
- provider knowledge;
- verified realization behavior;
- account/session evidence requirements;
- test cases;
- recorded falsifiers;
- drift signatures;
- recovery strategies;
- provider-specific configuration;
- proof of reusable boundaries.

Promotion into Ω should occur because the mechanism or knowledge survived evidence and generalization pressure, not because it was convenient in the Lab.

## Development-system opportunity

The current heterogeneous development pool can exploit this environment aggressively.

Independent workers may separately:
- characterize UI behavior;
- inspect protocol/network behavior;
- map semantic capabilities;
- design tests;
- attack account/session identity assumptions;
- implement provider realizations;
- red-team healing;
- independently review another worker's mapping.

Codex, Claude Code, ZCode lanes, and deterministic tests can cross-check one another.

The Lab should reduce the cost of disagreement because competing hypotheses can be tested quickly against real provider behavior.

## Success criterion

The Provider Lab succeeds when it makes the provider subsystem faster to understand and safer to evolve.

The strongest result is not a beautiful extension.

It is a development environment where:

**normal human use + controlled execution + automated conformance + drift observation + healing experiments**

all improve the same provider knowledge and realization system.

If the Lab stops increasing validated development speed, provider coverage, proof quality, generality, or recovery capability, its design should be reconsidered.

## Constitutional rule

**LAB speed > architectural ceremony, but evidence quality > cleverness.**

The Provider Lab may move quickly and use ugly instrumentation.

It may not silently redefine Ω's canonical semantics, authority, evidence rules, or product architecture.

The Lab is where mechanisms earn the right to graduate.
