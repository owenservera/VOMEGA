# WS-HLP — Contextual Wiki / Help

**Mission.** Provide live, contextual help as a source-native projection of the installed Ω Reflection Graph plus real registry, command and evidence state — never an authority, never a second documentation database, and never a source of invented facts (design §13; `seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md`).

**Milestones touched:** M2 (orientation recognizer), M7, M8  
**Falsifiers owned / served:** F7  
**First moves:** HLP-03 at M2 (corpus O2), the rest after M7.

## Scope

In scope:

- Self-description / Reflection ABI integration with the plugin contribution system
- Help knowledge model derived from installed source-native contribution metadata, registry/frames/state and evidence
- Ephemeral Wiki pages projected from the Reflection Graph rather than authored/stored as documentation
- Deterministic context selection while typing
- Grounded 'what can I do?'
- Help-grounding and reflection-completeness falsifiers
- Why-unavailable, explain-interpretation and exact-source links

Out of scope:

- Generic chatbot help panel
- Model-authored capability claims

## Interfaces

- **Consumes** CMD-08 registry, REG-04 state, SHL-03 VisualSpec
- **Provides** help topics to the shell

## Working principles

- Every help statement cites its source record, runtime state, evidence or exact source anchor.
- Public plugin behavior must be reflectable by construction; Wiki files/README files are never required runtime inputs.
- Structural facts come from executable declarations/schemas/manifests; inline comments may enrich but never override them.
- A model may phrase help but must pass a claim checker (HLP-04).
- Reflection metadata is descriptive only and can never grant capability, availability or authority.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [HLP-03](#hlp-03) | M2 | 'What can I do?' grounded answer | CMD-07, REG-03 | S |
| [HLP-05](#hlp-05) | M7 | Explain interpretation & why-unavailable | REG-04, SHL-03 | S |
| [HLP-01](#hlp-01) | M8 | Help knowledge model | CMD-08, REG-04 | M |
| [HLP-02](#hlp-02) | M8 | Deterministic context selector | HLP-01, SHL-03 | S |
| [HLP-04](#hlp-04) | M8 | Help-grounding falsifier | HLP-01 | M |

## Task cards

### HLP-03

**'What can I do?' grounded answer** · M2 Command nucleus · size S · depends on CMD-07, REG-03

Recognize orientation questions (corpus O2 currently 'unknown') and answer strictly from capability state.

Acceptance:

- [ ] Corpus O2 promoted
- [ ] Answer changes when registry changes (test)

Proof: Corpus + unit tests

### HLP-05

**Explain interpretation & why-unavailable** · M7 Capability projection & availability truth · size S · depends on REG-04, SHL-03

Inline 'Why?' for availability states and interpretation choices.

Acceptance:

- [ ] Each non-available state has an explanation

Proof: UI/unit tests

### HLP-01

**Help knowledge model** · M8 Contextual Wiki · size M · depends on CMD-08, REG-04

Derive help topics from concepts glossary, command registry, frames/examples, current registry state and known limitations. No free-form authored capability claims.

Acceptance:

- [ ] Every help item references its source (registry id, frame, state)

Proof: Unit tests

### HLP-02

**Deterministic context selector** · M8 Contextual Wiki · size S · depends on HLP-01, SHL-03

Map interpretation status/gaps/target to relevant help topics as the user types.

Acceptance:

- [ ] 'add another Claude' shows Provider/Account/registration topics

Proof: Unit tests

### HLP-04

**Help-grounding falsifier** · M8 Contextual Wiki · size M · depends on HLP-01

Property test: mutate registry/evidence, assert help never mentions a capability/account/state absent from them; any model phrasing passes a claim checker.

Acceptance:

- [ ] F7 green

Proof: Property tests

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)


## Owner architecture refinement — source-native self-description (2026-10-05)

The Contextual Wiki is now explicitly part of the Ω self-knowledge architecture rather than a separately authored help subsystem.

Canonical design: [Self-Describing Runtime & Source-Native Contextual Wiki](../../../seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md).

### Core boundary

A minimal **Reflection ABI / completeness obligation** may need to live at the plugin/manifest/core boundary so every installed contribution becomes inspectable automatically. This is narrower than moving the Wiki or `vivim.mind` into the constitutional core.

Candidate core responsibilities:

- bind reflected semantic identity to exact plugin version/content hash;
- expose a read-only reflection snapshot/query;
- verify that all routable/configurable/public plugin behavior is represented;
- preserve source anchors and version lineage;
- prevent reflection metadata from granting authority.

Wiki page generation, relevance ranking, natural-language explanation and rendering remain replaceable derived lenses.

### No parallel documentation store

A plugin installation should automatically add its Plugin/Capability/Command/Schema/Configuration/Source nodes and relationships to the Reflection Graph. No Wiki page, README, help JSON or separate documentation file is required.

### Roadmap impact

HLP-01 should be implemented as a **Reflection Graph → help projection**, not as a separately curated knowledge model.

HLP-02 should rank graph nodes from the active interpretation/validation/execution context.

HLP-04 should additionally falsify missing reflected public behavior and invented source relationships.

A new implementation task should be carved with the core/plugin-boundary owner for the Reflection ABI and completeness gate before final HLP-01 implementation. Exact task ownership/ID remains for Coordination to assign.


## Owner design refinement — Reflection migration utility (2026-10-05)

The existing codebase should be brought toward source-native Wiki compliance through the design in [Self-Knowledge Reflection Migrator](../../../seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md).

Important boundary:

- the migration utility is a development/build conformance tool;
- runtime Wiki consumes compiled/installed Reflection + live state;
- runtime should not reparsed the repository on each help request;
- the utility defaults read-only and distinguishes extracted structural facts from candidate semantic suggestions.

The local-agent `REF-01…REF-12` tasks are a roadmap seed. HLP implementation should coordinate with whichever workstream owns the Reflection ABI/core boundary.
