# WS-SHL — Floating Windows Shell

**Mission.** Deliver the small, quiet, summonable box that projects interpretation, choices, capability state and help — and never owns business logic or a privileged execution path (design §2–3, §6, §14, §17).

**Milestones touched:** M3, M5, M7, M10  
**Falsifiers owned / served:** F2, F5 (UI side), F9  
**First moves:** SHL-01 harvest/spike in parallel with M1; SHL-02 against a mocked session API.

## Scope

In scope:

- Framework decision and spike
- VisualSpec projector and rendering
- UI-parity/command-completeness harness
- Authenticated shell↔host channel
- Lifecycle display, state-derived chips, keyboard/accessibility

Out of scope:

- Pixel polish ahead of truth (AGENTS.md)
- Settings application (§21)
- Lab mirror UI

## Interfaces

- **Consumes** session API (CMD-09), VisualSpec (SHL-03), registry (CMD-08), state (REG-04)
- **Provides** user choices back as registry commands only

## Working principles

- The shell renders VisualSpec and emits registry commands — nothing else.
- Pure representation gestures (drag/resize) are exempt; state changes are not (§3).
- Mocked state is allowed only to test the interaction contract (§25-B).

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [SHL-01](#shl-01) | M3 | Shell framework harvest + decision RD-6 | OPS-02 | M |
| [SHL-02](#shl-02) | M3 | Floating box spike on mocked interpret API | SHL-01 | M |
| [SHL-03](#shl-03) | M3 | VisualSpec projector | CMD-06 | M |
| [SHL-04](#shl-04) | M3 | UI-parity & command-completeness harness | CMD-08, SHL-02 | M |
| [SHL-05](#shl-05) | M3 | Shell ↔ host channel (RD-7) | GOV-06, SHL-01 | M |
| [SHL-06](#shl-06) | M5 | Command lifecycle display | SHL-05, GOV-04 | S |
| [SHL-07](#shl-07) | M7 | State-derived chips | REG-04, SHL-05 | S |
| [SHL-08](#shl-08) | M10 | Keyboard-first & accessibility pass | SHL-06 | S |

## Task cards

### SHL-01

**Shell framework harvest + decision RD-6** · M3 Floating shell contract · size M · depends on OPS-02

Compare Tauri v2, plain WebView2 host, Electron and any Bun-native webview against: global hotkey, frameless always-on-top compact/expanded window, transparency, footprint, IPC to the Bun host, signing/installer, update. Reuse knowledge from prior Tauri v2 shell work where relevant.

Acceptance:

- [ ] Disposition per candidate; RD-6 decided
- [ ] Spike proving hotkey + always-on-top on Windows

Proof: Spike recording/log

### SHL-02

**Floating box spike on mocked interpret API** · M3 Floating shell contract · size M · depends on SHL-01

Summon/dismiss, compact and expanded states, text entry, renders interpretation (status, target, capability, choices, help slot) from a mocked endpoint implementing the session API contract.

Acceptance:

- [ ] Interaction contract demo on Windows
- [ ] No business logic in the shell

Proof: Manual walkthrough + screenshots

### SHL-03

**VisualSpec projector** · M3 Floating shell contract · size M · depends on CMD-06

nlcl-pure defines VisualSpec/VisualSlotCard/VisualRiskBadge types but no projector implementation was found. Implement pure projectVisual(interpretation, world, validation) shared by host and shell.

Acceptance:

- [ ] Pure, deterministic, unit tested
- [ ] Shell renders only VisualSpec

Proof: Unit tests

### SHL-04

**UI-parity & command-completeness harness** · M3 Floating shell contract · size M · depends on CMD-08, SHL-02

Every clickable element emits a registry command id + params; harness proves clicking and typing the equivalent reach the same command digest; enumerates UI actions vs registry.

Acceptance:

- [ ] F2 green: no UI action without a registry command
- [ ] Parity test for ≥5 actions

Proof: Harness output

### SHL-05

**Shell ↔ host channel (RD-7)** · M3 Floating shell contract · size M · depends on GOV-06, SHL-01

Authenticated loopback HTTP/WebSocket or named pipe; start host if absent; reconnect handling. Measure warm path (currently unverified).

Acceptance:

- [ ] Shell drives real CLI-equivalent path against local host
- [ ] Warm-path latency recorded

Proof: Integration test + benchmark

### SHL-06

**Command lifecycle display** · M5 First live prompt.send · size S · depends on SHL-05, GOV-04

Show interpreting → understood → needs choice → ready → needs consent → executing → observing → completed / refused / failed / uncertain.

Acceptance:

- [ ] Each state rendered from host events, not timers

Proof: UI test

### SHL-07

**State-derived chips** · M7 Capability projection & availability truth · size S · depends on REG-04, SHL-05

Provider/Account/capability chips come only from projection state; empty registry shows none; stale/needs-login styles reflect REG-04.

Acceptance:

- [ ] F5 green: no chip without verified realization

Proof: UI test

### SHL-08

**Keyboard-first & accessibility pass** · M10 Release hardening & RC · size S · depends on SHL-06

Full flow without mouse; screen-reader labels; focus returns to previous app on dismiss.

Acceptance:

- [ ] Checklist passed on Windows

Proof: Manual test record

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
