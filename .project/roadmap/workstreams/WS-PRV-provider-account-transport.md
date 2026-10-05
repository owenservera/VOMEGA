# WS-PRV — Provider / Account / Browser Transport (Provider Lab)

**Mission.** Establish real browser transport to user-owned provider sessions, prove which Account is active, and realize `prompt.send` with evidence — provider 1 first, then a materially different provider 2 (design §8, §10–12, §18–19).

**Milestones touched:** M1 (critical path), M4, M5, M6, M7, M9  
**Falsifiers owned / served:** F4, F6, F8, F10  
**First moves:** PRV-01 today (read-only), then PRV-02 bench; TRU-05 must land before the first live observation.

## Scope

In scope:

- Transport inventory, harvest bench and spike
- Account identity characterization and binding falsifiers
- Provider packs (provider-specific knowledge behind a shared boundary)
- prompt.send realization, receipts, minimal Shadow differential
- Drift fingerprints

Out of scope:

- Provider Lab mirror UI in the product (§19)
- Attachments and provider projects (§21); model selection beyond what prompt.send needs (§7, §10)
- Automatic repair without human review
- Any AI-API execution leg (PRODUCT-ANCHOR V1)

## Interfaces

- **Provides** observations and AccountEvidence to REG-02/REG-04; realization to GOV-04
- **Consumes** live-proof protocol (TRU-05); consent and attempt envelope (GOV-03/04)

## Working principles

- Read-only before any submission; unknown Account stays unknown.
- Never ask for provider passwords when the browser relationship can be used (§8).
- Structural evidence only by default (PROVIDER-LAB-STRATEGY privacy discipline).
- Shared modules contain no provider names; every shared change for provider 2 is ledgered.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [PRV-01](#prv-01) | M1 | Read-only transport inventory | OPS-01 | S |
| [PRV-02](#prv-02) | M1 | Transport harvest bench + decision RD-1 | PRV-01 | M |
| [PRV-03](#prv-03) | M1 | Minimal transport spike (metadata only) | PRV-02, TRU-05 | M |
| [PRV-04](#prv-04) | M1 | Account identity characterization — provider 1 | PRV-03 | M |
| [PRV-05](#prv-05) | M1 | Account-binding falsifiers | PRV-04 | M |
| [PRV-06](#prv-06) | M4 | Provider pack boundary | PRV-04, REG-01 | M |
| [PRV-12](#prv-12) | M4 | Account ↔ browser-profile mapping (RD-2) | PRV-04 | M |
| [PRV-07](#prv-07) | M5 | prompt.send realization — provider 1 | PRV-06, GOV-04 | L |
| [PRV-08](#prv-08) | M5 | Minimal Shadow reference + differential | PRV-07 | M |
| [PRV-09](#prv-09) | M6 | Provider 2 (Claude Web): identity + prompt.send | PRV-07 | L |
| [PRV-10](#prv-10) | M7 | Drift fingerprint + 'realization drifted' state | PRV-07 | M |
| [PRV-11](#prv-11) | M9 | Provider 3 (Gemini Web) — conditional | PRV-09, OPS-04 | L |

## Task cards

### PRV-01

**Read-only transport inventory** · M1 Transport & Account evidence (read-only) · size S · depends on OPS-01

Enumerate browser control paths already present on the owner machine (installed Chrome 154 metadata, Codex/Claude browser tools, existing extensions, debugging policy). Chrome 136+ ignores remote-debugging switches on the default profile, so a logged-in default Chrome is not an attachable CDP target.

Acceptance:

- [ ] Inventory table: path, attachable?, profile constraints, permissions, evidence
- [ ] No profile, extension or flag changed

Proof: Commands + outputs recorded (sanitized)

### PRV-02

**Transport harvest bench + decision RD-1** · M1 Transport & Account evidence (read-only) · size M · depends on PRV-01

Assay at least three families against the same task (attach, read page metadata, detect account indicator): (a) CDP into a dedicated VIVIM Chrome profile (Playwright/puppeteer connectOverCDP class), (b) MV3 extension with chrome.debugger, (c) MV3 extension content scripts + native-messaging host to the local Ω host. Harvest open-source multi-provider extensions for technique evidence only unless licensing is clear.

Acceptance:

- [ ] HARVEST disposition per candidate (reuse/adapt/wrap/port/behavioral/evidence/reject)
- [ ] RD-1 decided with falsifiable rationale and recorded in DECISIONS.md

Proof: Bench notes + live metadata read per candidate

### PRV-03

**Minimal transport spike (metadata only)** · M1 Transport & Account evidence (read-only) · size M · depends on PRV-02, TRU-05

Implement the chosen transport just far enough to attach to the VIVIM browser context and report provider page metadata (origin, title, logged-in indicator presence) to the Ω host. No content capture, no submission.

Acceptance:

- [ ] Host receives a structural observation record with observedAt and transport id
- [ ] Closing the browser makes the next observation fail, not return cached data

Proof: manual-live evidence entry in release.json

### PRV-04

**Account identity characterization — provider 1** · M1 Transport & Account evidence (read-only) · size M · depends on PRV-03

For ChatGPT Web, characterize which structural signals identify the logged-in Account (account menu identity, workspace/org, plan indicator), their stability across reload/navigation, and how a switch/logout manifests. Define the stored form (salted digest + display label chosen by user) so raw identifiers are not persisted unnecessarily.

Acceptance:

- [ ] Signal table with stability evidence across ≥3 sessions
- [ ] Proposed AccountEvidence shape with redaction rule
- [ ] RD-3 threshold proposal for provider 1

Proof: manual-live observations under TRU-05

### PRV-05

**Account-binding falsifiers** · M1 Transport & Account evidence (read-only) · size M · depends on PRV-04

Automate: switch account in the browser → binding becomes mismatch; logout → needs-login; browser closed → no fresh evidence; evidence older than freshness window → stale.

Acceptance:

- [ ] Four falsifiers pass against the real provider
- [ ] Binding never silently re-targets

Proof: automated-live evidence; F4/F6 partially green

### PRV-06

**Provider pack boundary** · M4 Registration through command · size M · depends on PRV-04, REG-01

Define the provider-specific knowledge pack (URL patterns, identity signals, prompt.send steps, completion signals, drift fingerprints) as data + small strategy code behind the shared realization boundary. Shared code may not contain provider names.

Acceptance:

- [ ] Pack for provider 1 loads through the boundary
- [ ] Lint/test: no provider literal in shared modules

Proof: Unit tests + review

### PRV-12

**Account ↔ browser-profile mapping (RD-2)** · M4 Registration through command · size M · depends on PRV-04

Two Accounts of one provider usually cannot be simultaneously active in one profile. Decide and prove the mapping (one VIVIM profile per Account, provider account switcher, or explicit reconnect) and its UX cost.

Acceptance:

- [ ] RD-2 decided with live evidence for two Claude or two ChatGPT accounts
- [ ] Selecting Account B never executes in Account A's session

Proof: automated-live evidence; F4

### PRV-07

**prompt.send realization — provider 1** · M5 First live prompt.send · size L · depends on PRV-06, GOV-04

Harvest first, then implement compose → submit → observe submission (conversation/message identity) → observe completion signal → structural receipt. Fail closed when account binding is not fresh and matching.

Acceptance:

- [ ] Real prompt sent through ChatGPT Web with receipt bound to the selected Account
- [ ] Account mismatch or stale binding refuses before submission

Proof: automated-live evidence; F10 green for provider 1

### PRV-08

**Minimal Shadow reference + differential** · M5 First live prompt.send · size M · depends on PRV-07

Observe one manual send structurally and compare with the automated prompt.send outcome (same semantic state transition, same account). Structural evidence only.

Acceptance:

- [ ] Differential record: manual-live vs automated-live equivalent
- [ ] Divergences recorded as provider knowledge

Proof: differential evidence entry

### PRV-09

**Provider 2 (Claude Web): identity + prompt.send** · M6 Second-provider falsification · size L · depends on PRV-07

Repeat PRV-04/05/07 for Claude Web. Every change to shared machinery (not the pack) is logged in the abstraction-change ledger with the evidence that forced it.

Acceptance:

- [ ] prompt.send live for Claude with account evidence
- [ ] Abstraction-change ledger with ≥1 reviewed entry or explicit 'no shared change needed'

Proof: automated-live evidence; F8 evaluated

### PRV-10

**Drift fingerprint + 'realization drifted' state** · M7 Capability projection & availability truth · size M · depends on PRV-07

Record the observed basis of each verified realization (control identities, completion signal shape). A mismatch before or during execution marks the capability drifted rather than executing blindly.

Acceptance:

- [ ] Injected selector/label change yields 'drifted' without false success
- [ ] Drift record stored with evidence

Proof: fault-injection test + live check

### PRV-11

**Provider 3 (Gemini Web) — conditional** · M9 Third provider (conditional) · size L · depends on PRV-09, OPS-04

Only if the M6 Gym cycle shows a third provider materially increases confidence. Same acceptance as PRV-09.

Acceptance:

- [ ] Gym decision recorded
- [ ] If built: live prompt.send with account evidence

Proof: automated-live evidence

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
