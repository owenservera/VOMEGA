# WS-HLP — Contextual Wiki / Help

**Mission.** Provide live, contextual help that is a projection of real registry, command and evidence state — never an authority and never a source of invented facts (design §13).

**Milestones touched:** M2 (orientation recognizer), M7, M8  
**Falsifiers owned / served:** F7  
**First moves:** HLP-03 at M2 (corpus O2), the rest after M7.

## Scope

In scope:

- Help knowledge model derived from registry/frames/state
- Deterministic context selection while typing
- Grounded 'what can I do?'
- Help-grounding falsifier
- Why-unavailable and explain-interpretation

Out of scope:

- Generic chatbot help panel
- Model-authored capability claims

## Interfaces

- **Consumes** CMD-08 registry, REG-04 state, SHL-03 VisualSpec
- **Provides** help topics to the shell

## Working principles

- Every help statement cites its source record.
- A model may phrase help but must pass a claim checker (HLP-04).

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
