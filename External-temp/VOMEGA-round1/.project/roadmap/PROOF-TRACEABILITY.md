# Proof Traceability — Release Claims → Tasks → Evidence

Every claim the first release makes must trace
**desired outcome → owning task → test/observation → evidence level → falsifier**
(`PROOF-AND-MATURITY.md`). The machine-readable ledger is intended to be
`.project/evidence/release.json` (TRU-01); this file is its map. That ledger does
not exist yet, so every claim below is currently `unproven` at its required
level, and the only committed evidence ledger is `.project/evidence/bootstrap.json`.

The claims (§1) and falsifiers (§2) are the release's proof obligations and
should survive replanning. The "Owning tasks" and "Turns green at" columns are
one decomposition of how to meet them and may change with the roadmap.

Evidence levels: **F** fixture · **VL** verified-local · **ML** manual-live ·
**AL** automated-live · **D** differential · **U** ordinary-user session.

## 1. Proof matrix (design §23)

| # | Claim | Owning tasks | Required level | Proof mechanism |
| --- | --- | --- | --- | --- |
| I-1 | Installs on intended Windows target | REL-03 | U | Clean VM install/uninstall record |
| I-2 | Launches reliably | REL-02, REL-04 | VL | Packaged boot test, repeated |
| I-3 | Box summoned and dismissed | SHL-02, SHL-08 | U | Walkthrough + automated hotkey test |
| I-4 | No global dev configuration needed | REL-03 | U | VM without Bun/Node/PATH changes |
| C-1 | Ordinary language → explicit semantic commands | CMD-03…07 | VL | Corpus (paraphrase category) |
| C-2 | Material ambiguity shown | CMD-06, SHL-03 | VL | Corpus (ambiguity) + VisualSpec tests |
| C-3 | Invalid/unavailable requests never silently execute | CMD-06, GOV-04 | VL + AL | Corpus (unknown), F3 |
| C-4 | Setup uses the same command system | CMD-07, REG-02 | VL | Registration commands in registry; F1 |
| C-5 | UI actions and typed equivalents converge | CMD-08, SHL-04 | VL | Parity harness digests; F2 |
| P-1 | Register release-supported Provider Accounts | REG-02, PRV-04, PRV-09 | AL | Live registration per provider |
| P-2 | Account identity prevents silent target switching | PRV-05, PRV-12, CMD-10 | AL | Switch/logout/second-account falsifiers; F4 |
| P-3 | Credentials not unnecessarily captured | PRV-04, GOV-05 | VL + review | Redaction tests + capture audit |
| P-4 | Stale/unavailable represented honestly | REG-04, REG-06 | AL | Stale-on-boot, browser-closed tests; F6 |
| K-1 | Capabilities appear because known/available | REG-03, SHL-07 | VL | Empty-registry ⇒ no chips; F5 |
| K-2 | Unavailable state explainable | REG-04, HLP-05 | VL | Each state has explanation |
| K-3 | `prompt.send` consistent across providers | PRV-09, TRU-09 | AL | Same command/receipt shape for both; F8 |
| L-1 | Prompt sent through real provider webapp | PRV-07, PRV-09 | AL | Receipt with conversation/message identity |
| L-2 | Intended Provider and Account evidenced | PRV-07, GOV-05 | AL | Receipt bound to fresh account binding |
| L-3 | External submission/result observed | PRV-07, PRV-08 | AL + D | Completion signal; manual-vs-automated differential |
| L-4 | Disconnected/stale realization cannot report fresh success | PRV-05, GOV-04 | AL | F6, F10 |
| N-1 | Relationship & state survive restart | REG-06, REL-06 | VL | Fresh-process tests |
| N-2 | Prior evidence distinct from live availability | REG-06, REG-04 | VL | Stale-until-revalidated test |
| H-1 | Help reflects current truth | HLP-01, HLP-02 | VL | Registry-mutation tests |
| H-2 | "What can I do?" from actual state | HLP-03 | VL | Corpus O2 + state-change test |
| H-3 | Help cannot invent capabilities or grant authority | HLP-04, GOV-03 | VL | F7 property test |

## 2. Falsifiers (design §24)

| ID | Falsifier (release is wrong if…) | Test owner | Turns green at |
| --- | --- | --- | --- |
| F1 | Ordinary setup requires a separate settings architecture | CMD-07, REG-02 | M4 |
| F2 | A UI button does something with no semantic command | CMD-08, SHL-04 | M3 (current surface), re-run M10 |
| F3 | Model output directly causes consequential execution | CMD-06, CMD-11, GOV-03 | M2 (no model), M8 (if edge built) |
| F4 | Two Accounts confused without visible ambiguity | PRV-12, CMD-10 | M4 |
| F5 | UI advertises capability without verified realization | REG-03, SHL-07 | M7 |
| F6 | Disconnected browser/provider shown as live | PRV-05, REG-04 | M1 (transport), M7 (UI) |
| F7 | Help claims unsupported capabilities/state | HLP-04 | M8 |
| F8 | Provider-1 semantics need parallel architecture for provider 2/3 | PRV-09, TRU-09 | M6 |
| F9 | User cannot see interpretation before/during execution | SHL-03, SHL-06 | M5 |
| F10 | Click sequence treated as success without target/result identity | PRV-07, GOV-05 | M5 |

## 3. Determinism categories (design §16)

| Category | Corpus cases today | Status | Owning task |
| --- | --- | --- | --- |
| Paraphrase equivalence | P1–P5 | 1/5 pass | CMD-04 |
| Explicit-target precedence | E1–E2 | 2/2 pass | CMD-10 extends with standing defaults |
| Ambiguity preservation | A1–A2 | 2/2 pass | CMD-06 keeps it through validation |
| Unknown capability | U1–U2 | 1/2 pass (U1 defect) | CMD-06 |
| Replay | R1 | pass (N1) | CMD-12 adds digest + state-ref replay |
| Authority separation | S1 | pass (projection only) | GOV-03 adds NL-cannot-consent tests |
| Deterministic UI parity | — | not testable in nlcl | SHL-04 harness |

## 4. release.json claim shape (TRU-01)

```json
{
  "id": "L-2",
  "claim": "Intended Provider and Account are evidenced for prompt.send",
  "source": "FIRST-PRODUCT-RELEASE-DESIGN §23 Live execution",
  "requiredLevel": "automated-live",
  "status": "unproven",
  "ownerTasks": ["PRV-07", "GOV-05"],
  "falsifiers": ["F10"],
  "evidence": [],
  "lastReviewed": null
}
```

`evidence[]` entries record command, environment (OS, Bun version, browser
version), date, result digest and a sanitized summary — never raw prompts,
responses, credentials or browser state.
