# LOCK E — Provider Transport Assay (read-only reconnaissance)

Status: reconnaissance only. No profile, extension, flag, config, credential, or
login state was created or changed. No prompt was submitted. New file only.

Date: 2026-10-05. Scope bounded to PRV-01 landing zone (`.project/roadmap/workstreams/WS-PRV-provider-account-transport.md`).
Evidence class: document-and-path inventory, not live transport proof.

---

## (a) Read-only inventory — existing Chrome / provider transport paths

| Path | What exists on disk | Attachable today? | Profile / permission constraints | Evidence |
| --- | --- | --- | --- | --- |
| Installed Chrome | version metadata 154.0.8037.93 | Untested | Chrome 136+ ignores `--remote-debugging-port` on the *default* profile; a logged-in default Chrome is **not** an attachable CDP target | `.project/ENVIRONMENT.md` (Chrome row) |
| `omega-baseline/plugins/provider-browser/` | `src/index.ts`, `src/session.ts`, `src/parsers.ts`, plugin.json | No (source, no driver) | Declares provider-browser realization surface; tests `browser-falsifier.test.ts`, `m13-containment.test.ts`, `parsers.test.ts` | file listing |
| `omega-baseline/plugins/vivim-providers/` | `src/registry.ts`, `src/index.ts` | No | Provider registry / pack boundary, no live transport | file listing |
| `omega-baseline/plugins/provider-llm/`, `provider-email-file/` | plugin dirs | No | Non-browser provider legs | file listing |
| Host | `omega-baseline/host/src` with `@vivim` deps | No | Candidate native-messaging / local host endpoint, not verified | file listing |
| Harvest archive | `harvests/old-vivim/**` (symbolic, lang.ts, command system) | No | Historical VIVIM mechanisms; technique evidence only | grep hit |
| Codex/Claude/ZCode browser tooling | exposed per census | **Unknown** | Exposed ≠ healthy; registration does not prove MCP/browser health | `.project/ENVIRONMENT.md` |
| Extension in developer mode | none observed | n/a | No extension installed or launched | census |

Key constraint already recorded: **`provider transport/auth binding untested`** and
`Chrome 136+ ignores remote-debugging switches on the default profile`.
No CDP endpoint, native-messaging host registration, or user-owned provider
session binding is currently *proven* to exist.

---

## (b) Harvest-First comparison of candidate transport families

Doctrine: `HARVEST-FIRST-ENGINEERING.md` — search for working prior art before
inventing. Task is identical across families: attach → read page metadata →
detect account indicator. Disposition vocabulary: reuse / adapt / wrap / port /
behavioral / evidence / reject (per PRV-02).

| Family | Mechanism | Pros | Cons / blockers | Harvest disposition (pre-live) |
| --- | --- | --- | --- | --- |
| **A. Attachable CDP into dedicated profile** | Launch a *separate* Chrome profile with a debugging port; Playwright/puppeteer `connectOverCDP` class | Mature OSS; full CDP; deterministic; no extension install | Requires a dedicated profile + log-in *in that profile*; default-profile attach blocked on 136+; new profile may not own the user's existing session | **adapt** (Playwright/puppeteer is reusable; must NOT touch default profile) |
| **B. MV3 extension + `chrome.debugger`** | Extension attaches debugger to a tab it can see, incl. user's real profile | Works against the *user's own* logged-in tab without a new profile; no port flag | `chrome.debugger` is a broad permission surface; MV3 service-worker lifecycle; policy/consent + banner; needs extension install | **evidence-first** then likely **port**; harvest OSS MV3 technique, do not copy unclear-license source |
| **C. MV3 content scripts + native-messaging host → local Ω host** | Extension reads DOM/events, relays structural evidence to local host over native messaging | Least invasive to page runtime; structural/semantic evidence fits privacy discipline; no raw content required | Needs native-messaging manifest registration (config change — deferred); host plumbing unverified; per-browser install | **adapt/wrap** — closest match to Ω host + Shadow Observation model |
| **D. Existing VIVIM / BCP transport evidence** | `provider-browser/session.ts`, `vivim-providers/registry.ts`, old-vivim harvest, former BCP observatory plugin | In-repo semantic/realization surface; prior art for observation | No evidence it ever held a live, authenticated provider session; BCP plugin is "optional prior tooling, not inherited organization" | **evidence** (design clues only; reject as inherited authority) |

Provisional read (to be decided live, RD-1): family **A** gives fastest falsifiable
attach proof; family **C** best matches the Shadow/Structural evidence doctrine;
family **B** is the only way to observe the user's *real* logged-in tab.
These are competing hypotheses, not a decision.

---

## (c) Account identity hypothesis

Hypothesis (unproven): the account active in a browser transport is determined
**not** by the Codex/Claude/ZCode lane, but by the **browser profile / cookie
jar** the transport attaches to. Removing passwords (§8) means the browser
relationship — existing authenticated session — is the identity source.

Corollaries to test:
- Lane credentials (5 configured lanes) are orthogonal to the *web app* account
  seen by a provider page.
- A dedicated VIVIM profile (family A) will show a **different (or no)** account
  than the user's default Chrome until logged in there.
- An extension attaching to the user's real tab (family B) reveals the user's
  **actual** provider account with no credential entry.

Standing rule: **preserve unknown Account identity as unknown** until evidence
names it. Never infer subscription/model/provider health from installation.

---

## (d) Freshness / expiry / switch falsifiers (Account binding)

Falsifiers that would break the "browser profile = account" hypothesis:

- **F-A (switch):** same transport, same profile, account indicator changes after
  an external re-login → profile alone is not sufficient identity; session token
  is. *Falsifies profile-as-identity.*
- **F-B (expiry/unfresh):** an indicator captured at time T reads logged-in but at
  T+Δ the provider page shows signed-out / consent wall → account evidence is
  **stale**; any AccountEvidence must carry a freshness timestamp. *Falsifies
  assume-logged-in-without-recapture.*
- **F-C (multi-account):** one profile exposes >1 selectable workspace/account →
  single indicator is ambiguous; binding needs provider-native account selector
  identity, not just "logged in".
- **F-D (silent drift):** realization still "succeeds" while the account
  indicator silently changes (provider reassigns to a different workspace) →
  success signal is independent of account correctness.
- **F-E (dedicated-profile mismatch):** family A profile shows a *different*
  account than family B (real tab) → transport choice itself changes the
  observed identity; must be ledgered.

Each falsifier must record: before-state, after-state, timestamp, transport,
profile, and sanitized account-indicator source (structural only — no credentials,
no cookies).

---

## (e) Minimum safe live experiment plan (LATER — not executed in this increment)

Preconditions: TRU-05 live-proof protocol landed; explicit consent + attempt
envelope (GOV-03/04); owner present; structural evidence only.

1. **PRV-03 minimal transport spike (metadata only).**
   Family A: launch a **separate** VIVIM Chrome profile (never the default),
   attach via `connectOverCDP`-class client, read only: page URL host, title,
   presence/absence of an account-indicator *selector*, and logged-in boolean.
   No prompt, no click that mutates provider state, no content capture.
2. **Family C feasibility check.** Determine, read-only, whether a native-messaging
   host registration would be required (flag as a config change to be approved
   separately) and whether the local Ω host already exposes an endpoint.
3. **Account identity capture (PRV-04).** On the dedicated profile, record
   structural account indicators with timestamps; explicitly mark identity
   **UNKNOWN** until a named indicator is evidenced.
4. **Run falsifiers F-A…F-E** as bounded observations; each writes a sanitized
   receipt to `.local/` (ignored); commit only sanitized summaries.
5. **No mutation.** `prompt.send` is out of scope for this increment (PRV-07,
   depends on GOV-04). Stop at metadata/indicator read.
6. **Stop conditions:** any credential prompt, any default-profile attach attempt,
   any consent wall, or any ambiguity in account identity → halt and record.

Explicitly deferred: extension install (family B), native-messaging config,
provider 2/3, mirror UI, attachments.

---

## Open questions / risks

- Is any browser automation binding actually *live*, or only exposed? (unknown)
- Which Chrome profiles exist and which owns a real provider session? (uninspected)
- Does the local Ω host already accept a native-messaging channel? (unverified)
- Does `chrome.debugger` policy permit attach on this machine? (untested)
