# WS-REG — Registry, Capability & Availability State

**Mission.** Make Provider, Account, Session, Capability and Realization distinct durable records whose derived state is the only source for what the UI, help and validator may claim (design §7, §11–12, §22).

**Milestones touched:** M2, M4, M7  
**Falsifiers owned / served:** F5, F6 (state side), N-1/N-2 continuity claims  
**First moves:** REG-01 schemas alongside CMD-01; REG-05 unblocks CMD-06.

## Scope

In scope:

- Candidate Vault namespaces/schemas incl. net-new Account
- Append-only relationship writer
- Pure capability-state derivation and availability state machine
- Release WorldModel producer
- Restart continuity semantics (stale until revalidated)

Out of scope:

- Personal knowledge graph
- Conversation history import

## Interfaces

- **Consumes** observations/evidence from PRV
- **Provides** WorldModel to CMD; state to SHL-07, HLP-01, CMD-06

## Working principles

- Provider ≠ Account ≠ Session; sessions are never persisted as live.
- Disconnect is a revision, never deletion.
- Prior evidence is never displayed as current availability.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [REG-01](#reg-01) | M2 | Provider/Account/Session/Capability record kinds | CMD-01 | M |
| [REG-03](#reg-03) | M2 | Capability state derivation | REG-01 | M |
| [REG-05](#reg-05) | M2 | Release WorldModel producer | REG-01 | M |
| [REG-02](#reg-02) | M4 | Account relationship writer | REG-01 | M |
| [REG-06](#reg-06) | M4 | Restart continuity for relationships | REG-02 | M |
| [REG-07](#reg-07) | M4 | Replace providers.session.start stub | REG-01 | S |
| [REG-08](#reg-08) | M4 | Inspection surface for relationships | REG-02 | S |
| [REG-04](#reg-04) | M7 | Availability state machine + resolving actions | REG-03, PRV-05 | M |

## Task cards

### REG-01

**Provider/Account/Session/Capability record kinds** · M2 Command nucleus · size M · depends on CMD-01

Define candidate, versioned Vault namespaces/schemas: provider (known), account (user relationship, identity evidence refs, label, default flag), session (transient, never persisted as live), capability-state, realization (reuse vivim-providers realization rows). Account is net-new: no Account concept exists in contracts or plugins today.

Acceptance:

- [ ] Schemas documented and validated
- [ ] Account and Session are distinct record kinds

Proof: Unit tests

### REG-03

**Capability state derivation** · M2 Command nucleus · size M · depends on REG-01

Pure derivation (like providers registry derive) distinguishing provider-known, account-available, observed, verified realization, currently healthy, stale/unknown.

Acceptance:

- [ ] Derivation is pure and tested on fixture states
- [ ] Empty registry ⇒ no available capabilities

Proof: Unit tests; F5 input

### REG-05

**Release WorldModel producer** · M2 Command nucleus · size M · depends on REG-01

Produce the grounding WorldModel (accounts, providers, capabilities, release ops, frames) from registry state instead of composition config catalogs; extend or wrap vivim.mind.

Acceptance:

- [ ] mind/lens snapshot includes account entities from Vault
- [ ] Determinism: same state ⇒ same WorldModel

Proof: mind tests + new tests

### REG-02

**Account relationship writer** · M4 Registration through command · size M · depends on REG-01

Append-only register / relabel / set-default / disconnect revisions with evidence refs; disconnect is a revision, not deletion; all through law-gated ops.

Acceptance:

- [ ] Writer ops routed through the command registry
- [ ] History preserved across disconnect/reconnect

Proof: Vault integration tests

### REG-06

**Restart continuity for relationships** · M4 Registration through command · size M · depends on REG-02

Relationships and prior evidence survive full process exit; on boot every capability is stale/unknown until revalidated, so prior evidence is never shown as live.

Acceptance:

- [ ] Fresh-process test: Account present, state stale until revalidation
- [ ] §23 continuity claims verified-local

Proof: CLI subprocess tests

### REG-07

**Replace providers.session.start stub** · M4 Registration through command · size S · depends on REG-01

Today it returns `sess_${Date.now()}` / INITIALIZED with no persisted binding. Replace with a transient session tied to an Account binding observation, with expiry.

Acceptance:

- [ ] No session can exist without a fresh account binding
- [ ] Stub removed from release composition

Proof: providers tests

### REG-08

**Inspection surface for relationships** · M4 Registration through command · size S · depends on REG-02

CLI `accounts list --json`, `capabilities --json`; vault.verify covers the new namespaces.

Acceptance:

- [ ] CLI outputs match registry
- [ ] verify passes with new ns

Proof: CLI tests

### REG-04

**Availability state machine + resolving actions** · M7 Capability projection & availability truth · size M · depends on REG-03, PRV-05

States: available, available-but-stale, verifying, needs-login, account-ambiguous, temporarily-unavailable, drifted, unsupported, unknown. Freshness windows per provider; each non-available state maps to the smallest resolving command (reconnect, choose other account, why?).

Acceptance:

- [ ] Each state reachable in tests
- [ ] Resolving action is a registry command

Proof: Unit + live checks; F6

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
