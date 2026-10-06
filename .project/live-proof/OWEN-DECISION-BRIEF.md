# Owen decision brief — live Provider path

Claim class: **owner-decision brief**  
Date: 2026-10-06  
Status: **OPEN — defaults below are conservative operating stops, not owner decisions**

The live Provider path can proceed to read-only design/fixture work without these decisions,
but a real external experiment must stop at the boundaries below.

## R-2 — provider terms / web-UI automation position

Decision needed before live submission and before any observation technique that raises a
provider-policy concern.

Candidate positions:

1. **No automation against provider web UI.**
   - Lowest policy risk.
   - Blocks the browser-mediated product hypothesis for that Provider unless another supported
     user-controlled interface exists.

2. **Read-only / metadata observation only while policy is evaluated.**
   - Permits identity/freshness research with no prompt submission.
   - Recommended interim posture where allowed by the provider terms and local law.

3. **Controlled user-owned browser automation within a reviewed allowed scope.**
   - Enables the intended real capability path.
   - Must document the allowed action classes, rate/behavior constraints and stop conditions.

Current operating stop: **no live submission**.

## RD-8 — prompt/response content retention

### A. Structural receipts only — current default / recommended first release

Retain IDs, digests/lengths, timestamps, routing/evidence metadata and failure classes.
Do not durably retain raw prompt/response content solely for proof.

Pros: least privacy surface; sufficient for many transport/evidence tests.  
Cons: weaker forensic replay of content-specific failures.

### B. Explicit opt-in bounded content capture

Retain a specific prompt/response sample for a named experiment with scope, expiry and deletion.

Pros: stronger debugging.  
Cons: adds sensitive-data lifecycle and consent requirements.

### C. Durable content as canonical user data

Only appropriate if the product explicitly chooses to retain it in the sovereign Vault as
user-owned product data, not as accidental developer telemetry.

This is a larger product decision and should not be smuggled in through Provider Lab evidence.

Current operating default: **A — structural receipts only**.

## RD-10 — prompt.send consent scope

### A. Per-send consent — current default / recommended initial proof

Every consequential send is authorized against the concrete immutable command revision,
Provider, Account and consequence preview.

### B. Bounded standing consent

Possible later scope:
`Account × capability × consequence class × time/expiry × optional destination constraints`.

A material target/payload/consequence change invalidates the standing match and requires fresh
authorization.

### C. Broad standing consent

Not recommended for the first live proof; too easy to convert interpretation/defaulting errors
into authorized external effects.

Current operating default: **A — per-send**.

## Smallest safe decision sequence

1. Decide R-2 for the intended first Provider and experiment class.
2. Confirm RD-8 structural-only receipt default or choose a stricter explicit alternative.
3. Confirm RD-10 per-send default for the first consequential proof.
4. Run TRU-05 read-only Account/session falsifier before any `prompt.send`.
5. Review evidence, then separately authorize the first live send experiment.

## Required re-consent falsifier

Whatever consent model is selected, this must remain true:

> changing the committed target Account, payload, material consequence, realization basis or
> command digest cannot inherit authorization accidentally.

If a candidate standing-consent design fails that test, reject it.
