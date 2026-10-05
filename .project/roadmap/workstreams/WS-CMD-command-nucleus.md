# WS-CMD — Command Nucleus & Semantic Interaction

**Mission.** Turn ordinary language into an explicit, validated USE command — deterministically, visibly and replayably — so setup, help and `prompt.send` all travel one path (design §3–6, §9, §15–16).

**Milestones touched:** M2 (primary), M4, M5, M8, M10  
**Falsifiers owned / served:** F1, F2 (registry side), F3, corpus categories of §16  
**First moves:** CMD-01 → CMD-03 → CMD-04 and CMD-05 in parallel; the seed corpus (CMD-02) is already landed.

## Scope

In scope:

- Adapting `vivim-nlcl-pure`/`vivim-nlcl` to release frames and account grounding
- Candidate `use/0` representation, digest and canonical rendering
- Deterministic validator and outcomes (ready / needs-choice / needs-info / unknown / unavailable / refused)
- Single command/action registry
- Interpretation session API (CLI first, shell second)
- Determinism corpus ownership

Out of scope:

- Freezing a grammar or JSON schema (§4)
- Model-first interpretation unless CMD-11's gate is met
- Execution and realization (GOV/PRV)

## Interfaces

- **Consumes** WorldModel from REG-05; risk/consent from law (GOV-02)
- **Provides** UseCommand + validation outcome to GOV-04; VisualSpec input to SHL-03; registry to SHL-04 and HLP-01

## Working principles

- Interpretation is not authority; validation never trusts interpreter status alone (defect U1).
- Priors rank, never decide (corpus A2).
- Every new phrasing failure becomes a corpus case before it is fixed.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [CMD-01](#cmd-01) | M2 | Finalize nucleus harvest disposition | — | S |
| [CMD-02](#cmd-02) | M2 | Determinism corpus seed (landed in review) | — | S |
| [CMD-03](#cmd-03) | M2 | Frames as contributed language data (RD-5) | CMD-01 | M |
| [CMD-04](#cmd-04) | M2 | Addressee grammar + surface.assist retirement | CMD-03 | M |
| [CMD-05](#cmd-05) | M2 | Candidate USE command representation | CMD-01 | M |
| [CMD-06](#cmd-06) | M2 | Deterministic validator / normalizer | CMD-05, REG-05 | M |
| [CMD-07](#cmd-07) | M2 | Release command families | CMD-03 | M |
| [CMD-08](#cmd-08) | M2 | Single command/action registry | CMD-05 | M |
| [CMD-09](#cmd-09) | M2 | Interpretation session API | CMD-06 | M |
| [CMD-10](#cmd-10) | M4 | Defaulting policy | CMD-06, REG-02 | S |
| [CMD-12](#cmd-12) | M5 | Replay and 'why this target' explanation | CMD-05, GOV-04 | M |
| [CMD-11](#cmd-11) | M8 | Optional probabilistic edge (conditional) | CMD-06, CMD-13 | M |
| [CMD-13](#cmd-13) | M8 | Corpus growth from real phrasing | CMD-02 | M |

## Task cards

### CMD-01

**Finalize nucleus harvest disposition** · M2 Command nucleus · size S · depends on nothing

Ratify the dispositions in BASELINE-HARVEST-ASSAY.md for nlcl-pure, vivim-mind, vivim-intent, director resolve.classify, chat resolve and the web interpret/execute API; record in DECISIONS.md (RD-4, RD-11).

Acceptance:

- [ ] Disposition per component recorded
- [ ] RD-4 and RD-11 decided or explicitly deferred with trigger

Proof: Decision record

### CMD-02

**Determinism corpus seed (landed in review)** · M2 Command nucleus · size S · depends on nothing

The seed corpus `plugins/vivim-nlcl/test/fixtures/release-use-corpus.json` + test records 17 cases (8 pass / 7 known gaps + 1 defect + coverage check) against nlcl-pure 0.1.0. Extend toward ≥60 cases spanning all §16 categories, multiple worlds (0/1/2 accounts per provider, stale/unknown states) and registration/orientation families.

Acceptance:

- [ ] Corpus ≥60 cases; every §16 category ≥5 cases
- [ ] Known gaps reference owning tasks

Proof: Corpus test output

### CMD-03

**Frames as contributed language data (RD-5)** · M2 Command nucleus · size M · depends on CMD-01

Replace compiled DEFAULT_FRAMES-only matching with frames supplied by capability contributions/registry and carried in the WorldModel (versioned), keeping N1: same (text, world, version) ⇒ same interpretation. Remove the corpus test's frame injection.

Acceptance:

- [ ] prompt.send and release families defined as data, not nlcl code
- [ ] N1 determinism tests still pass
- [ ] Corpus no longer mutates DEFAULT_FRAMES

Proof: nlcl + corpus suites

### CMD-04

**Addressee grammar + surface.assist retirement** · M2 Command nucleus · size M · depends on CMD-03

Support addressee-first forms ('ask X …', 'have X answer …', 'use X for …', 'X: …', 'send this to X') so the account is grounded and the rest becomes the prompt. Exclude surface.assist (LLM edge) from the release frames so 'ask' is not captured by a probabilistic pseudo-intent.

Acceptance:

- [ ] Corpus P1, P3, P4, P5 promoted to pass
- [ ] No regression in existing nlcl tests

Proof: Corpus output

### CMD-05

**Candidate USE command representation** · M2 Command nucleus · size M · depends on CMD-01

Introduce a versioned *candidate* `use/0` representation derived from IR: capability, provider, account, parameters, context refs, routing choice, authority requirement, realization ref, evidence expectation; canonical text rendering and a stable digest for replay. Explicitly marked non-frozen.

Acceptance:

- [ ] Pure constructor IR→UseCommand with digest stable across runs
- [ ] Doc comment cites §4 'do not freeze'

Proof: Unit tests

### CMD-06

**Deterministic validator / normalizer** · M2 Command nucleus · size M · depends on CMD-05, REG-05

Validate UseCommand against capability registry and account state; produce outcomes ready / needs-choice / needs-info / unknown / unavailable / refused. Never trust interpreter status alone (defect U1: nlcl returns 'ok' with a required slot unresolved).

Acceptance:

- [ ] Corpus U1 promoted to pass
- [ ] Invalid/unavailable commands cannot reach execution (unit + F3)

Proof: Corpus + unit tests

### CMD-07

**Release command families** · M2 Command nucleus · size M · depends on CMD-03

Frames + handlers for orientation (show providers/accounts/capabilities, explain state), provider/account (register, list, set default, refresh, disconnect), capability (list, describe, why-unavailable, invoke) and help. Resolve verb collisions ('what accounts do I have' ≠ prompt.send).

Acceptance:

- [ ] Corpus O1, G1 promoted to pass
- [ ] Each family appears in the command registry (CMD-08)

Proof: Corpus output

### CMD-08

**Single command/action registry** · M2 Command nucleus · size M · depends on CMD-05

One registry enumerating every product-state-changing action: command id, parameters, authority requirement, realization, evidence expectation. UI, CLI, help and tests read from it; nothing else may change product state.

Acceptance:

- [ ] Registry exported and consumed by CLI
- [ ] Completeness test enumerates UI actions vs registry (used by SHL-04)

Proof: Unit test; F2 harness input

### CMD-09

**Interpretation session API** · M2 Command nucleus · size M · depends on CMD-06

Host-side API for per-keystroke interpret, choose-alternative, fill-missing, confirm/cancel; drafts stored as PendingIntent-style rows; stage trace exposed. Reachable from CLI first (headless), shell later.

Acceptance:

- [ ] CLI `interpret` and `use` subcommands drive the full path
- [ ] Draft → confirm → law check → execution handoff traced

Proof: CLI process tests

### CMD-10

**Defaulting policy** · M4 Registration through command · size S · depends on CMD-06, REG-02

Order: explicit target > standing user default > single valid candidate (auto, but displayed) > ask. Priors/corrections may rank alternatives, never decide between equally valid accounts (corpus A2 already shows this holds in nlcl).

Acceptance:

- [ ] Corpus cases for each rule pass
- [ ] Selection always visible in interpretation output

Proof: Corpus output

### CMD-12

**Replay and 'why this target' explanation** · M5 First live prompt.send · size M · depends on CMD-05, GOV-04

Given a command digest and the referenced state snapshot, reproduce the resolution and explain account/realization choice.

Acceptance:

- [ ] Replay of recorded prompt.send yields identical resolution
- [ ] Explanation lists the decisive rule (explicit/default/single/choice)

Proof: Unit + integration test

### CMD-11

**Optional probabilistic edge (conditional)** · M8 Contextual Wiki · size M · depends on CMD-06, CMD-13

Only if real-phrasing coverage is below target: a model may propose candidate canonical text/IR which must re-enter the deterministic validator. Tests prove model output cannot execute, select an unseen account, or create authority.

Acceptance:

- [ ] Decision recorded with coverage data
- [ ] If built: F3 holds with adversarial model outputs

Proof: Adversarial tests

### CMD-13

**Corpus growth from real phrasing** · M8 Contextual Wiki · size M · depends on CMD-02

Collect owner dogfood phrasings (text only, consented, no provider content) and add failures as corpus cases before fixing.

Acceptance:

- [ ] ≥100 real phrasings evaluated; pass rate reported
- [ ] New gaps filed as tasks

Proof: Corpus report

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
