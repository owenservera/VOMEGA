# WS-REL — Packaging, Install & Lifecycle

**Mission.** Make VIVIM installable and recoverable on Windows for an ordinary user without developer tooling, with continuity across restarts and crashes (design §20, §23 installation/continuity, §27).

**Milestones touched:** M3 (packaging spike), M4, M10  
**Falsifiers owned / served:** Installation and continuity claims I-1…I-4, N-1  
**First moves:** REL-02 spike during M3.

## Scope

In scope:

- Product-instance location
- Packaging spike for Bun host + worker plugins
- Installer, signing, update decision
- Single instance/autostart/tray
- Crash/restart recovery
- First-run journey and ordinary-user tests
- Release evidence pack

Out of scope:

- Auto-update infrastructure beyond the decision
- Cross-platform builds

## Interfaces

- **Consumes** everything; **provides** packaged artifacts and U-level evidence to TRU

## Working principles

- Retire packaging risk early (REL-02 at M3).
- No global PATH/tool changes for ordinary users.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [REL-02](#rel-02) | M3 | Packaging spike: Bun host + worker plugins | — | M |
| [REL-01](#rel-01) | M4 | Product instance location on Windows | — | S |
| [REL-03](#rel-03) | M10 | Installer, signing, update decision | REL-02, SHL-01 | L |
| [REL-04](#rel-04) | M10 | Single instance, autostart, tray | REL-03 | S |
| [REL-05](#rel-05) | M10 | First-run journey & ordinary-user test | REL-03, HLP-04 | M |
| [REL-06](#rel-06) | M10 | Crash & restart recovery | GOV-04, REG-06 | M |
| [REL-07](#rel-07) | M10 | Release evidence pack | TRU-01 | S |

## Task cards

### REL-02

**Packaging spike: Bun host + worker plugins** · M3 Floating shell contract · size M · depends on nothing

Early risk spike: package host + plugins (bundled Bun vs `bun build --compile`) and prove worker-thread plugin compartments, SQLite and signing work from the packaged form on Windows.

Acceptance:

- [ ] Packaged binary boots release composition and passes status
- [ ] RD-9 recorded

Proof: Packaged-run log

### REL-01

**Product instance location on Windows** · M4 Registration through command · size S · depends on nothing

Default vault under the user's local app data, keys never in repo, dev-vault migration path; relative/explicit vault selection preserved for developers.

Acceptance:

- [ ] Fresh install creates instance at default path
- [ ] Existing --vault semantics unchanged

Proof: CLI tests

### REL-03

**Installer, signing, update decision** · M10 Release hardening & RC · size L · depends on REL-02, SHL-01

Installer for the shell + host; code signing; update channel decision; no global dev tooling or PATH changes required.

Acceptance:

- [ ] Clean Windows VM install/uninstall
- [ ] §23 installation claims verified

Proof: VM test record

### REL-04

**Single instance, autostart, tray** · M10 Release hardening & RC · size S · depends on REL-03

Optional autostart, tray presence, single-instance enforcement, hotkey conflict handling.

Acceptance:

- [ ] Second launch focuses existing box

Proof: Manual test record

### REL-05

**First-run journey & ordinary-user test** · M10 Release hardening & RC · size M · depends on REL-03, HLP-04

Script the §27 eleven-step journey; run with ≥2 non-developer users on clean machines; record friction.

Acceptance:

- [ ] All 11 steps completed by test users
- [ ] Findings triaged into tasks

Proof: Session notes (structural)

### REL-06

**Crash & restart recovery** · M10 Release hardening & RC · size M · depends on GOV-04, REG-06

Host or browser dies mid-prompt.send ⇒ uncertain state on restart with reconciliation path; relationships intact.

Acceptance:

- [ ] Fault-injection tests pass

Proof: Fault tests

### REL-07

**Release evidence pack** · M10 Release hardening & RC · size S · depends on TRU-01

Assemble release.json evidence, per-provider support statement, known limitations, and reproducible commands.

Acceptance:

- [ ] Pack complete and linked from README

Proof: Pack review

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
