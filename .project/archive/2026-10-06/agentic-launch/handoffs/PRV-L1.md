# PRV-L1 — Provider Browser Transport reconnaissance handoff

Workstream: WS-PRV (Provider / Account / Browser Transport / Provider Lab).
Increment: PRV-L1 / **Lock E** — bounded read-only reconnaissance.
Date: 2026-10-05. Executor lane: recon (no submission, no install, no config, no git write).

## Status

**COMPLETE (reconnaissance only).** No live transport was established, no
provider session attached, no prompt submitted, no login/account/config state
changed. One new artifact added; otherwise read-only.

Produced an inventory + Harvest-First assay + falsifier set + a *deferred* live
experiment plan. This satisfies the reconnaissance half of PRV-01 (WS-PRV) but
does **not** satisfy PRV-01's live acceptance boxes (no command/output proof yet).

## Artifact paths

- `omega-baseline/experimental/provider-lab/LOCK-E-ASSAY.md` — the assay (inventory, family comparison, account hypothesis, falsifiers, deferred plan).
- `.project/agentic-launch/handoffs/PRV-L1.md` — this handoff.

## What was read (bounded)

- `seed-docs/PROVIDER-LAB-STRATEGY.md`
- `.project/ENVIRONMENT.md`
- structural listing/grep only of: `omega-baseline/plugins/provider-browser`, `vivim-providers`, `provider-llm`, `provider-email-file`, `omega-baseline/experimental/lab-scenarios`, `.project/roadmap/workstreams/WS-PRV-provider-account-transport.md`, `.project/agentic-launch/`.

## Key facts established

1. Chrome 154 metadata present; a logged-in **default** Chrome is not an
   attachable CDP target on 136+ — any CDP path needs a **dedicated profile**.
2. In-repo provider transport surface exists (`provider-browser/session.ts`,
   `vivim-providers/registry.ts`) but holds **no proven live authenticated session**.
3. Browser tooling is *exposed*, not *proven healthy*; transport/auth binding untested.
4. Three viable families: (A) CDP + dedicated profile, (B) MV3 `chrome.debugger`,
   (C) MV3 content scripts + native messaging → local Ω host.
5. Account identity hypothesis: identity comes from the **browser profile/session**,
   not the executor lane; treat as UNKNOWN until evidenced.

## Open questions

- Is any browser automation binding actually live on this machine?
- Which Chrome profile owns a real provider session, and does it differ from a dedicated lab profile?
- Does the local Ω host already expose a native-messaging endpoint?
- Does machine policy permit `chrome.debugger`?
- Do the 5 configured lanes have any bearing on web-app account identity? (assumed orthogonal, unproven)

## Downstream triggers

- **SDW (Shadow Observation):** blocked on a proven attach (PRV-03). Family C
  (content scripts + native messaging) is the closest fit to structural/semantic
  Shadow evidence; needs TRU-05 + consent envelope before any observation.
- **RTE (Routing/Realization):** PRV-07 `prompt.send` must not start until GOV-04
  attempt envelope lands; this increment deliberately stopped at metadata read.
- **TRU (Truth/live-proof):** **TRU-05 must land before the first live
  observation.** The falsifiers F-A…F-E in LOCK-E-ASSAY.md are the evidence
  contract TRU should expect (before/after state, timestamp, transport/profile,
  sanitized account-indicator source).
- **RD-1 decision (PRV-02):** harvest bench must disposition families A/B/C/D and
  record a falsifiable rationale in DECISIONS.md; this assay is the input, not the decision.

## Next safe action

PRV-03 minimal transport spike on a **separate** VIVIM Chrome profile, metadata
and account-indicator read only, once TRU-05 + consent envelope are in place.
No extension install, native-messaging config, or default-profile attach until
approved separately.
