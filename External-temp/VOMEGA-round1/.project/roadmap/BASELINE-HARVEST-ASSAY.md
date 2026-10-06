# Baseline Harvest Assay for the First Release

Review date 2026-10-05, repository commit `769544e` (seed `f03905e` lineage).
Method: read all seed docs and `.project/` truth; inspected plugin manifests and
sources; installed with `bun install --frozen-lockfile --ignore-scripts`; ran
suites individually; ran two small interpreter spikes. Environment: Linux, Bun
1.3.14 — **not** the owner's Windows/Bun 1.4.2 machine, so every result below
is `verified-local (Linux)` until re-run through `scripts/omega.ps1`.

This applies `HARVEST-FIRST-ENGINEERING.md` to the baseline itself before any
new subsystem is designed.

## 1. Suite evidence gathered in this review

| Suite | Result | Notes |
| --- | --- | --- |
| `omega:quick` | 62 pass / 0 fail, 1,622 assertions | Matches bootstrap.json |
| plugins/vivim-nlcl | 31 pass (49 with new corpus) | Deterministic interpreter + manifest |
| plugins/vivim-mind | 41 pass | WorldModel producer |
| plugins/vivim-intent | 24 pass | Intent rows, four-state resolution |
| plugins/vivim-director | 38 pass | resolve.classify, teach, rules |
| plugins/vivim-providers | 6 pass | Registry derivation |
| plugins/vivim-credentials | 15 pass | Redaction policy |
| plugins/provider-llm | 22 pass | Simulator (not on release path) |
| plugins/discovery-verification | 25 pass | Realization promotion lifecycle |
| plugins/discovery-healing | 19 pass | Healing lifecycle (later drift work) |
| surfaces/web | 22 pass | Boots `compositions/console.json` |
| plugins/vivim-chat | 30 pass / 1 fail | Unhandled error from absent import fixtures |
| plugins/provider-browser | 0 / 3 | Absent `fixtures/browser/session-fixture.json` |
| surfaces/mcp | timeouts | Uses law-stub/echo (absent example plugins) |

Implication: a much larger offline regression net than `omega:quick` already
exists for the semantic layer (TRU-02 turns it into a named lane).

## 2. Release need → baseline asset → disposition

| Release need (design §) | Baseline asset | What it already does | Gap for the release | Disposition |
| --- | --- | --- | --- | --- |
| Deterministic interpretation (§4–6) | `vivim-nlcl-pure` (~2.2k LOC, zero deps) | Pure pipeline scan→lex→recognize→frame-match→ground→resolve→project; N1 determinism; IR with slots, alternatives, confidence, canonical text, reading; gaps; suggestions; stage trace; teachable lexicon; priors that rank but never decide | Frames are compiled constants for email ops; no addressee grammar; `surface.assist` captures "ask"; required-slot status defect (U1) | **ADAPT** (CMD-03/04/06/07) |
| Grounding target (§7, §13) | `vivim-mind` `mind.snapshot@1` | Derives WorldModel from law registry + Vault evidence; read-only lens | Entities are contacts/messages; ops come from composition config | **ADAPT** → release lens (REG-05) |
| Real-time projection (§6, §14) | nlcl-pure `VisualSpec` types | Slot cards, entity chips, risk badges, suggestions, gaps as types | No projector implementation found | **REUSE types, implement** (SHL-03) |
| Drafts / confirm (§17) | `PendingIntent` type; `vivim.intent` rows (UNDERSTOOD / AMBIGUOUS / REFUSED / EXECUTED) | Durable intent objects, per-step attenuated delegation | Heavier than a command draft; Work-oriented | **EVALUATE** (RD-11) |
| Help (§13) | nlcl `recognizeHelp`, frame examples, `control.describe` | "help", "what can you do", capability search by verb | "what can I do?" unknown; not grounded in account state | **ADAPT** (HLP-01/03) |
| Authority / consent (§5, §22) | `vivim-law` | law.check, consent grants, forbidden overlay, risk classes, journal into Vault | Release risk mapping; consent UX contract | **REUSE** (GOV-02/03) |
| Canonical state (§20, §23) | `vivim-vault` + local composition | SQLite/CAS/Merkle changelog, verify, isolation, restart proof | New namespaces | **REUSE** |
| Provider registry (§7, §12) | `vivim-providers` | Pure derivation of realization rows + liveness; statuses DRAFT/TESTING/PROMOTED/DEGRADED/REQUIRES_REDISCOVERY | **No Account concept anywhere in contracts or plugins**; `session.start` returns `sess_${Date.now()}` with no binding | **ADAPT registry; NEW Account; REPLACE session stub** (REG-01/07) |
| Realization promotion (§12) | `discovery-verification` | Standard promotion lifecycle | Live evidence inputs | **ADAPT** |
| Drift/repair (§12) | `discovery-healing` | Healing lifecycle | Provider drift signals | **EVIDENCE now, ADAPT at M7** |
| Structural evidence (§23) | `credential.redact@1` | Versioned redaction before Vault append | Receipt schema | **REUSE** (GOV-05) |
| Browser realization (§10) | `provider-browser` | Fixture replay; four fail-closed bars (fence, session attached, realization promoted, parser pinned) | `sim:true`, email domain, no live transport | **EVIDENCE ONLY** — reuse the bar pattern, not the plugin |
| Shell backend (§2, §3) | `surfaces/web` `/api/interpret`, `/execute`, `/consent` | Keystroke interpret + execute + consent over HTTP/socket | Root principal, no auth/origin restriction, unspecified listen host | **ADAPT after GOV-06** |
| Headless parity harness (§15–16) | `surfaces/cli` | Real host public API, cold process proof | `interpret`/`use` subcommands | **REUSE** (CMD-09) |
| Warm path (§2 latency) | `surfaces/daemon` | Pool, cache | Unverified warm behavior | **EVALUATE** (SHL-05) |
| Model leg | `provider-llm` | Simulator by default | V1 boundary forbids API execution leg | **REJECT for release path** |
| Conversation import | chat parsers | Pure export parsers | Not a release need | **DEFER** |

## 3. Interpreter spike (2026-10-05)

A candidate `prompt.send@1` frame (patient content slot + account entity slot
with `to/using/with/on/via`) was injected into nlcl-pure and run against a
world with `claude-work`, `claude-personal` and `chatgpt-personal` accounts.
The seed corpus now encodes these results permanently.

| Case | Expected (design §16) | Observed | Verdict |
| --- | --- | --- | --- |
| send 'review this' to work Claude | prompt.send / claude-work | ok, claude-work, prompt "review this" | ✅ |
| send 'review this' to work claude, with prior favouring personal | explicit wins | claude-work | ✅ precedence |
| send 'review this' to claude | ambiguous, both shown | ambiguous, alternatives both @1.00 | ✅ preservation |
| same, with strong personal prior | still ambiguous | ambiguous | ✅ priors don't decide |
| summarize this with Gemini | no fabrication | unknown, no op | ✅ |
| send 'x' to work claude | consent gate projected | effects gate `consent` | ✅ authority separation |
| same input twice | identical | byte-identical JSON | ✅ replay/N1 |
| ask work Claude '…' / ask chatgpt '…' | prompt.send | captured by `surface.assist` | ❌ CMD-04 |
| use work Claude for '…' / have work Claude answer '…' | prompt.send / claude-work | addressee consumed as prompt; account unresolved | ❌ CMD-04 |
| send 'x' to Gemini (not registered) | refuse / needs choice | **status `ok` with required account null** | ❌ defect → CMD-06 |
| what accounts do I have? | orientation | misread as prompt.send ("have") | ❌ CMD-07 |
| what can I do? | grounded help | unknown | ❌ HLP-03 |
| add my ChatGPT account | registration | unknown | ❌ CMD-07 |

Reading: the hard semantic properties (precedence, ambiguity, no fabrication,
determinism, consent projection) already hold; the failures are grammar
coverage and one status defect. That supports **ADAPT** over a new interpreter
and supports deterministic-first for RD-4, pending real-phrasing data (CMD-13).

## 4. Net-new work the baseline cannot supply

1. Account as a first-class relationship with identity evidence.
2. Real browser transport and provider packs.
3. Live `prompt.send` realization, receipts and execution envelope.
4. Availability state machine with freshness.
5. The Windows floating shell, its channel, packaging and installer.
6. Single command/action registry and UI-parity harness.

## 5. External harvest still owed (not done in this review)

- Browser transport families (PRV-02): Playwright/puppeteer CDP attach patterns,
  MV3 `chrome.debugger`, native messaging hosts, and open-source multi-provider
  chat extensions — license/provenance per `HARVEST-FIRST-ENGINEERING.md`.
- Provider-specific prompt submission and completion detection techniques
  (PRV-07/09).
- Windows floating-window frameworks (SHL-01).
- Bun packaging of worker-thread plugins (REL-02).
- Historical BCP-dev `docs/destination` provider/account/routing studies for
  identity-binding falsifiers (`HISTORICAL-KNOWLEDGE-MAP.md`).
