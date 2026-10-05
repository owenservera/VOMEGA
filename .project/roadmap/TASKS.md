# Task Index — First Release

Index of every roadmap task by milestone. Full cards (description, acceptance, proof) live in the workstream files. Status column is maintained by claimants; initial status is `open`.

Totals: 74 tasks across 9 workstreams.

## M0 — Roadmap adoption & proof plumbing

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| OPS-01 | Adopt roadmap into Commons | [OPS](workstreams/WS-OPS-coordination-devops.md) | — | S | open |
| OPS-02 | Parallel-track isolation plan | [OPS](workstreams/WS-OPS-coordination-devops.md) | OPS-01 | S | open |
| OPS-03 | Verify executor lanes before dispatch | [OPS](workstreams/WS-OPS-coordination-devops.md) | — | S | open |
| OPS-04 | Milestone exit ritual = Release Gym cycle | [OPS](workstreams/WS-OPS-coordination-devops.md) | — | S | open |
| TRU-01 | Release proof ledger | [TRU](workstreams/WS-TRU-truth-verification.md) | — | S | open |
| TRU-02 | Named semantic regression lane | [TRU](workstreams/WS-TRU-truth-verification.md) | — | S | open |
| TRU-03 | Falsifier suite skeleton F1–F10 | [TRU](workstreams/WS-TRU-truth-verification.md) | TRU-01 | M | open |
| TRU-06 | Independent review at every milestone exit | [TRU](workstreams/WS-TRU-truth-verification.md) | — | S | open |
| TRU-07 | Static typecheck lane for touched packages | [TRU](workstreams/WS-TRU-truth-verification.md) | — | M | open |

## M1 — Transport & Account evidence (read-only)

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| TRU-05 | Live-proof protocol | [TRU](workstreams/WS-TRU-truth-verification.md) | — | M | open |
| PRV-01 | Read-only transport inventory | [PRV](workstreams/WS-PRV-provider-account-transport.md) | OPS-01 | S | open |
| PRV-02 | Transport harvest bench + decision RD-1 | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-01 | M | open |
| PRV-03 | Minimal transport spike (metadata only) | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-02, TRU-05 | M | open |
| PRV-04 | Account identity characterization — provider 1 | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-03 | M | open |
| PRV-05 | Account-binding falsifiers | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-04 | M | open |

## M2 — Command nucleus

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| TRU-04 | Determinism corpus gate | [TRU](workstreams/WS-TRU-truth-verification.md) | CMD-02 | S | open |
| CMD-01 | Finalize nucleus harvest disposition | [CMD](workstreams/WS-CMD-command-nucleus.md) | — | S | open |
| CMD-02 | Determinism corpus seed (landed in review) | [CMD](workstreams/WS-CMD-command-nucleus.md) | — | S | open |
| CMD-03 | Frames as contributed language data (RD-5) | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-01 | M | open |
| CMD-04 | Addressee grammar + surface.assist retirement | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-03 | M | open |
| CMD-05 | Candidate USE command representation | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-01 | M | open |
| CMD-06 | Deterministic validator / normalizer | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-05, REG-05 | M | open |
| CMD-07 | Release command families | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-03 | M | open |
| CMD-08 | Single command/action registry | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-05 | M | open |
| CMD-09 | Interpretation session API | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-06 | M | open |
| REG-01 | Provider/Account/Session/Capability record kinds | [REG](workstreams/WS-REG-registry-capability-state.md) | CMD-01 | M | open |
| REG-03 | Capability state derivation | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-01 | M | open |
| REG-05 | Release WorldModel producer | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-01 | M | open |
| GOV-01 | Release composition | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | CMD-01 | M | open |
| GOV-02 | Risk classes for release commands | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | CMD-08 | S | open |
| HLP-03 | 'What can I do?' grounded answer | [HLP](workstreams/WS-HLP-contextual-wiki.md) | CMD-07, REG-03 | S | open |

## M3 — Floating shell contract

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| GOV-06 | Close web-surface trust boundary | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | — | M | open |
| GOV-07 | Shell principal | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | GOV-06 | S | open |
| SHL-01 | Shell framework harvest + decision RD-6 | [SHL](workstreams/WS-SHL-floating-shell.md) | OPS-02 | M | open |
| SHL-02 | Floating box spike on mocked interpret API | [SHL](workstreams/WS-SHL-floating-shell.md) | SHL-01 | M | open |
| SHL-03 | VisualSpec projector | [SHL](workstreams/WS-SHL-floating-shell.md) | CMD-06 | M | open |
| SHL-04 | UI-parity & command-completeness harness | [SHL](workstreams/WS-SHL-floating-shell.md) | CMD-08, SHL-02 | M | open |
| SHL-05 | Shell ↔ host channel (RD-7) | [SHL](workstreams/WS-SHL-floating-shell.md) | GOV-06, SHL-01 | M | open |
| REL-02 | Packaging spike: Bun host + worker plugins | [REL](workstreams/WS-REL-release-lifecycle.md) | — | M | open |

## M4 — Registration through command

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| PRV-06 | Provider pack boundary | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-04, REG-01 | M | open |
| PRV-12 | Account ↔ browser-profile mapping (RD-2) | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-04 | M | open |
| CMD-10 | Defaulting policy | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-06, REG-02 | S | open |
| REG-02 | Account relationship writer | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-01 | M | open |
| REG-06 | Restart continuity for relationships | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-02 | M | open |
| REG-07 | Replace providers.session.start stub | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-01 | S | open |
| REG-08 | Inspection surface for relationships | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-02 | S | open |
| REL-01 | Product instance location on Windows | [REL](workstreams/WS-REL-release-lifecycle.md) | — | S | open |

## M5 — First live prompt.send

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| PRV-07 | prompt.send realization — provider 1 | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-06, GOV-04 | L | open |
| PRV-08 | Minimal Shadow reference + differential | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-07 | M | open |
| CMD-12 | Replay and 'why this target' explanation | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-05, GOV-04 | M | open |
| GOV-03 | Consent contract | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | GOV-02 | M | open |
| GOV-04 | Execution envelope (Work-lite) | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | GOV-01 | M | open |
| GOV-05 | Evidence & receipt schema + retention default (RD-8) | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | GOV-04 | M | open |
| GOV-08 | Refusal & failure explanations | [GOV](workstreams/WS-GOV-authority-execution-evidence.md) | GOV-04, CMD-06 | S | open |
| SHL-06 | Command lifecycle display | [SHL](workstreams/WS-SHL-floating-shell.md) | SHL-05, GOV-04 | S | open |

## M6 — Second-provider falsification

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| TRU-09 | Second-provider falsification report | [TRU](workstreams/WS-TRU-truth-verification.md) | PRV-09 | S | open |
| PRV-09 | Provider 2 (Claude Web): identity + prompt.send | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-07 | L | open |

## M7 — Capability projection & availability truth

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| PRV-10 | Drift fingerprint + 'realization drifted' state | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-07 | M | open |
| REG-04 | Availability state machine + resolving actions | [REG](workstreams/WS-REG-registry-capability-state.md) | REG-03, PRV-05 | M | open |
| SHL-07 | State-derived chips | [SHL](workstreams/WS-SHL-floating-shell.md) | REG-04, SHL-05 | S | open |
| HLP-05 | Explain interpretation & why-unavailable | [HLP](workstreams/WS-HLP-contextual-wiki.md) | REG-04, SHL-03 | S | open |

## M8 — Contextual Wiki

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| CMD-11 | Optional probabilistic edge (conditional) | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-06, CMD-13 | M | open |
| CMD-13 | Corpus growth from real phrasing | [CMD](workstreams/WS-CMD-command-nucleus.md) | CMD-02 | M | open |
| HLP-01 | Help knowledge model | [HLP](workstreams/WS-HLP-contextual-wiki.md) | CMD-08, REG-04 | M | open |
| HLP-02 | Deterministic context selector | [HLP](workstreams/WS-HLP-contextual-wiki.md) | HLP-01, SHL-03 | S | open |
| HLP-04 | Help-grounding falsifier | [HLP](workstreams/WS-HLP-contextual-wiki.md) | HLP-01 | M | open |

## M9 — Third provider (conditional)

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| PRV-11 | Provider 3 (Gemini Web) — conditional | [PRV](workstreams/WS-PRV-provider-account-transport.md) | PRV-09, OPS-04 | L | open |

## M10 — Release hardening & RC

| ID | Task | WS | Depends on | Size | Status |
| --- | --- | --- | --- | --- | --- |
| TRU-08 | Release readiness audit | [TRU](workstreams/WS-TRU-truth-verification.md) | REL-07 | M | open |
| SHL-08 | Keyboard-first & accessibility pass | [SHL](workstreams/WS-SHL-floating-shell.md) | SHL-06 | S | open |
| REL-03 | Installer, signing, update decision | [REL](workstreams/WS-REL-release-lifecycle.md) | REL-02, SHL-01 | L | open |
| REL-04 | Single instance, autostart, tray | [REL](workstreams/WS-REL-release-lifecycle.md) | REL-03 | S | open |
| REL-05 | First-run journey & ordinary-user test | [REL](workstreams/WS-REL-release-lifecycle.md) | REL-03, HLP-04 | M | open |
| REL-06 | Crash & restart recovery | [REL](workstreams/WS-REL-release-lifecycle.md) | GOV-04, REG-06 | M | open |
| REL-07 | Release evidence pack | [REL](workstreams/WS-REL-release-lifecycle.md) | TRU-01 | S | open |

## Startable now (no dependencies)

OPS-01, OPS-03, OPS-04, TRU-01, TRU-02, TRU-05, TRU-06, TRU-07, CMD-01, CMD-02, GOV-06, REL-01, REL-02
