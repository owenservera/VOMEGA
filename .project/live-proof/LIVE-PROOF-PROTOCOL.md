# Live Provider / Account proof protocol — TRU-05 candidate

Claim class: **proof protocol candidate**  
Date: 2026-10-06  
Status: **READY FOR OWNER-BOUNDARY DECISIONS; NO LIVE EXPERIMENT AUTHORIZED**

This protocol defines what may count as live Provider/Account evidence. It does not authorize
browser automation, provider submission, credential access or content retention.

It exists so the live Provider path can begin with a falsifiable evidence contract rather
than deciding what "live" means after an experiment succeeds.

## 1. Hard distinctions

The following never count as live Provider/Account proof:

- fixture HTML or captured pages;
- simulated Provider responses;
- localhost/provider-lookalike services;
- a selector resolving on a fixture;
- a browser process merely being open;
- a Provider brand/logo being visible;
- a model/agent assertion about which Account is selected;
- historical screenshots or stale cookies;
- successful submission without evidence of the target Account/session.

Live evidence must bind an observation to a real user-controlled external Provider surface
and identify what was actually observed, when, through which realization, against which
Account/session basis.

## 2. Evidence rungs

### L0 — fixture / simulated

Useful for deterministic development. Never live.

### L1 — manual-live structural observation

A human-supervised, read-only observation against the real provider UI/session with:

- Provider identity;
- observable Account identity signal(s);
- session/freshness basis;
- timestamp;
- realization/tool version;
- exact observation class;
- no claim beyond what was observed.

### L2 — automated-live structural observation

The same structural facts are reproduced through the intended bounded transport and survive
the falsifiers below.

### L3 — live governed attempt/result evidence

Only after the owner/TOS/consent boundaries are satisfied:

- immutable command/attempt identity;
- selected Provider + Account + Session basis;
- consequence/consent record;
- realization identity;
- attempt timestamp;
- positive evidence of submission/attempt;
- target verification where knowable;
- observed result evidence or explicit uncertainty/failure.

A disappearing process, elapsed time or absence of an error is not completion proof.

### L4 — differential / drift evidence

The same contract is exercised after controlled Account/session/Provider state changes so the
system demonstrates it can detect changes rather than merely replay a happy path.

## 3. Default retention posture

Until Owen changes RD-8:

> **structural receipts only**

Do not durably retain prompt/response content for live-proof work.

A structural receipt may include:

- content digest where meaningful;
- byte/character length;
- MIME/content class;
- command/evidence IDs;
- timestamps;
- Provider/Account/Session refs;
- realization/tool version;
- status/failure category;
- source selectors/signals used for the observation, where safe and non-secret.

Never commit cookies, tokens, auth headers, local profile secrets or raw credential material.

## 4. Account evidence contract

An Account claim needs at least:

1. Provider identity;
2. a provider-native or independently corroborated Account signal;
3. the session/profile basis from which it was observed;
4. observation timestamp and freshness/expiry assumption;
5. the method used to derive the AccountRef;
6. a switch/expiry falsifier proving the signal changes or becomes unknown when reality changes.

A display label alone is weak evidence. Prefer multiple independent structural signals where
the Provider exposes them.

If the Account cannot be identified safely, the honest output is `Account = unknown`.

## 5. Session/freshness contract

Provider, Account and Session remain distinct.

Evidence must state whether the session is:

- observed-current;
- stale/expired;
- switched;
- unknown;
- unavailable.

A known Account with an unknown/stale Session cannot be projected as currently available merely
because the Account record exists.

## 6. Minimum read-only experiment

After Owen approves the legal/terms boundary for this observation class:

1. attach only to an already user-controlled session;
2. perform no prompt submission and no state-changing provider action;
3. collect the minimum structural signals needed for Provider + Account + Session/freshness;
4. emit a local structural receipt;
5. change/switch/expire the relevant session state under human control;
6. repeat and prove the Account/session claim changes or becomes unknown;
7. remove local temporary raw observations after reducing them to the allowed receipt.

This experiment proves only observation/identity/freshness.

It does not prove `prompt.send`.

## 7. Required falsifiers

The protocol is inadequate if any of these can occur without being detected:

- switch Provider Account but Ω reports the old Account;
- session expires but Ω reports fresh/available;
- two Accounts collapse to one identity;
- Provider, Account, Model or Session are conflated;
- a selector/path survives while its semantic meaning changed;
- fixture/simulated evidence satisfies a live gate;
- a submission is attempted against a different Account than the committed command;
- a failed/uncertain attempt is reported as completed;
- a stale observation can overwrite a newer one.

Provider-specific falsifiers should be added as evidence appears.

## 8. Live prompt.send prerequisites

No live `prompt.send` experiment is authorized until all are true:

- Owen's R-2 terms-of-service/legal position allows the chosen experiment;
- RD-8 retention posture is decided or the structural-only default is explicitly accepted;
- RD-10 consent scope is decided or per-send consent default is explicitly accepted;
- Provider + Account + Session identity evidence has passed the switch/expiry falsifiers;
- the command is structurally valid and bound to an immutable revision;
- an attempt/evidence envelope exists before the external effect;
- simulated/fixture paths cannot satisfy the live gate;
- the owner is present for the first consequential experiment.

## 9. Receipt minimum

A machine-readable live receipt should be able to answer:

- what exact claim is being made?
- what Provider / Account / Session basis was observed?
- what command/attempt/revision is this evidence bound to?
- what realization produced it?
- what happened, and at what evidence maturity?
- what did **not** get observed?
- what retention policy was used?
- what falsifier/replay can challenge it?

The exact schema remains implementation work.

## 10. Promotion rule

A live claim is promoted only from actual evidence after independent review.

A successful experiment does not silently broaden the permission scope, retention scope,
supported Provider list, or product architecture.
