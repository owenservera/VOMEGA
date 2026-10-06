# WS-GOV — Authority, Execution Envelope & Evidence

**Mission.** Ensure only valid, consented commands execute, every external attempt is recorded before it happens, and outcomes (including uncertainty) are truthful and replayable (design §5, §11, §17, §22–24).

**Milestones touched:** M2, M3, M5  
**Falsifiers owned / served:** F3, F6, F10  
**First moves:** GOV-06 can start immediately (independent of providers); GOV-01/02 with CMD-01.

## Scope

In scope:

- Release composition and grants
- Risk classes and consent contract
- Execution envelope (attempt → observing → completed/failed/uncertain)
- Receipt schema and retention default
- Web-surface trust boundary and shell principal
- Refusal explanations

Out of scope:

- Durable background Work engine (§21)
- Generalized orchestration

## Interfaces

- **Consumes** validated UseCommand (CMD-06), realization (PRV-07)
- **Provides** consent/lifecycle events to SHL-06; receipts to REG and TRU

## Working principles

- Natural language cannot mint authority.
- No blind retry; uncertain until reconciled.
- Fix the open web API before any shell connects to it.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [GOV-01](#gov-01) | M2 | Release composition | CMD-01 | M |
| [GOV-02](#gov-02) | M2 | Risk classes for release commands | CMD-08 | S |
| [GOV-06](#gov-06) | M3 | Close web-surface trust boundary | — | M |
| [GOV-07](#gov-07) | M3 | Shell principal | GOV-06 | S |
| [GOV-03](#gov-03) | M5 | Consent contract | GOV-02 | M |
| [GOV-04](#gov-04) | M5 | Execution envelope (Work-lite) | GOV-01 | M |
| [GOV-05](#gov-05) | M5 | Evidence & receipt schema + retention default (RD-8) | GOV-04 | M |
| [GOV-08](#gov-08) | M5 | Refusal & failure explanations | GOV-04, CMD-06 | S |

## Task cards

### GOV-01

**Release composition** · M2 Command nucleus · size M · depends on CMD-01

Define `compositions/release.json`: law, vault, credentials (redact only), world lens, nlcl, command session, providers, provider-webapp realization — explicit grants, no simulators, no sim:true paths, no stale work.* grants.

Acceptance:

- [ ] Composition boots via host and passes status
- [ ] Composition matrix test: no grant without a live provider plugin

Proof: Boot test

### GOV-02

**Risk classes for release commands** · M2 Command nucleus · size S · depends on CMD-08

Classify each registry command: local reads (READ), relationship writes (MUTATION), prompt.send (EXTERNAL_MUTATION, consent-gated), registration observation (READ of external state).

Acceptance:

- [ ] Law check results match classification in tests

Proof: law tests

### GOV-06

**Close web-surface trust boundary** · M3 Floating shell contract · size M · depends on nothing

Current web API exposes root calls/consent without auth or origin restriction and unspecified listen host. Bind loopback only, per-install token, origin check, non-root shell principal, before any shell talks to it.

Acceptance:

- [ ] Unauthenticated request refused
- [ ] Listen address loopback-only (test)

Proof: web tests extended

### GOV-07

**Shell principal** · M3 Floating shell contract · size S · depends on GOV-06

Shell acts as a user principal with release-scoped grants; CLI root remains a developer surface.

Acceptance:

- [ ] Shell cannot call ops outside release registry

Proof: law tests

### GOV-03

**Consent contract** · M5 First live prompt.send · size M · depends on GOV-02

Consent requests are produced by law and rendered by surfaces; scope per (account, capability) with revocation; decide RD-10 (per-send vs standing). Natural-language text can never mint consent.

Acceptance:

- [ ] F3/authority-separation tests: NL 'I consent' does not grant
- [ ] Revocation takes effect on next command

Proof: law + integration tests

### GOV-04

**Execution envelope (Work-lite)** · M5 First live prompt.send · size M · depends on GOV-01

Persist an attempt record before any external effect: command digest, account binding ref, realization, consent ref; states executing → observing → completed / failed / uncertain. No blind retry; uncertain until reconciled.

Acceptance:

- [ ] Kill during execution ⇒ 'uncertain' after restart, never success
- [ ] Attempt record links receipt

Proof: Crash test; F6/F10

### GOV-05

**Evidence & receipt schema + retention default (RD-8)** · M5 First live prompt.send · size M · depends on GOV-04

Structural receipt: provider, account evidence ref, conversation/message identity, timestamps, length/digest, realization version. Raw prompt/response persistence is an owner decision (RD-8); default structural-only, redaction via credential.redact.

Acceptance:

- [ ] Receipt schema validated
- [ ] No raw content persisted under default policy (test)

Proof: Unit tests + redaction review

### GOV-08

**Refusal & failure explanations** · M5 First live prompt.send · size S · depends on GOV-04, CMD-06

Law refusal, unknown capability, account mismatch, drift and uncertain effects produce explained outcomes with next actions.

Acceptance:

- [ ] Each refusal path has a rendered explanation in tests

Proof: Integration tests

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
