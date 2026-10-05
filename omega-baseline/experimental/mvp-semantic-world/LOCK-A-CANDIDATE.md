# LOCK A CANDIDATE — MVP Semantic World (SDW / Lock A)

Status: **CANDIDATE / NOT FROZEN** — first increment artifact (SDW-L1).
Basis: `seed-docs/SEMANTIC-DATA-ENGINE.md` §4–§11, §17, §21; `seed-docs/INVARIANTS.md`
(Provider/Account/Model/Session separations); current code `omega-baseline/plugins/vivim-nlcl-pure/src/types.ts`.
This document does not freeze wire syntax. It names the smallest semantic slice that the
MVP sandbox must represent before any interpreter/projector work.

## (a) Current-code gap map

Current code (`vivim-nlcl-pure/src/types.ts`) is an **interpretation-layer contract**, not a
semantic-world contract. Observed gaps versus the target slice:

| Target concept (SEMANTIC-DATA-ENGINE) | Current code | Gap |
|---|---|---|
| Provider as durable entity | `OpView.provider: string` (route origin only) | No Provider record: no title/aliases/providerClass/provenance. Provider is an opaque string on an op. |
| Account as durable relationship | absent | No Account record at all. Cannot represent ChatGPT Personal vs Claude Work. |
| Model as first-class routing choice | absent | No Model record; cannot select/route a model. |
| Capability ≠ op | `CapabilityView.capability: string`, `provider: string`, `status` | Capability still fused to a plugin/provier id; no parameters, concepts, consequence, language, realizations. |
| Capability ≠ Realization | absent | No Realization record; no fidelity / evidenceMaturity separation. |
| Consequence dimensions | `RiskClass` (READ/MUTATION/EXTERNAL_MUTATION/ENGINE) | Single scalar risk label; no orthogonal mutability/externality/sensitivity/dataTransfer/reversibility/visibility. |
| Stable semantic identity | `EntityView.id` = `"contact:peter-miller"` etc. | Entity ids are ad-hoc strings; no enforced rule that identity excludes policy/availability/evidence. |
| World as versioned immutable snapshot | `WorldModel.v: number`, `t` | World mixes durable structure + ops + priors + warnings; not stage-separated (source-native vs derived), no explicit worldVersion digest beyond `v`. |
| Session ≠ Account | `FocusView.sessionId`, `pendingIntents` | Session exists but no explicit link to a route (account/model) nor revision guard. |
| Route as semantic edit | `modifiers` on `IR` only | No `route.provider/account/model` triple that a UI click can set/clear and revalidate. |
| VisualSpec vNext | `VisualSpec` (flat) | No semantic handles on elements; no route/validation/handle structure. |

Consequence for Lock A: the MVP must **add** a semantic-world record layer beside the
existing interpretation types, not mutate `types.ts`. Provider/Account/Model/Capability/
Realization are new; `OpView.provider` and `RiskClass` become **derive-from** links, not authority.

## (b) Candidate record / interface field lists

Conceptual shapes only; field spelling is not frozen (mirrors SEMANTIC-DATA-ENGINE §5).
All ids are `SemanticId` strings following the identity rules in that doc §4.

### Provider
- `id: SemanticId` — `provider:chatgpt` (no account, no model, no availability)
- `title: string` — `"ChatGPT"`
- `aliases: string[]`
- `providerClass: string`
- `provenance: SourceRef[]`

### Account
- `id: SemanticId` — `account:<stable-local-id>` (no session)
- `provider: SemanticId` — owning provider
- `userLabel: string` — `"Personal"` / `"Work"`
- `aliases: string[]`
- `identityEvidence: EvidenceRef[]`
- `state: "known" | "stale" | "needs-login" | "unknown"`
- `defaultFor?: SemanticId[]`

### Model
- `id: SemanticId` — `model:<provider>/<provider-native-or-local-id>`
- `provider: SemanticId`
- `providerNativeId?: string`
- `title: string`
- `aliases: string[]`
- `capabilityRefs: SemanticId[]`
- `evidence: EvidenceRef[]`
- Invariant: Model ≠ Provider, Model ≠ Account, Model ≠ Session; model id does not imply account availability.

### Capability
- `id: SemanticId` — `capability:prompt.send` (no provider/platform, no risk class)
- `title: string`
- `summary: string`
- `concepts: SemanticId[]`
- `parameters: ParameterSpec[]`
- `language: LanguageRef[]`
- `consequence: ConsequenceSpec` (derived declaration, orthogonal facets)
- `expectedEvidence: EvidenceKindRef[]`
- `related: SemanticId[]`
- `inverse?: SemanticId`
- `source: SourceAnchor[]`

### Realization
- `id: SemanticId` — `realization:<provider-or-platform>/<capability>/<version>`
- `capability: SemanticId`
- `targetDomain: SemanticId[]`
- `implementation: SourceAnchor[]`
- `fidelity: "exact" | "approximate" | "handoff"`
- `evidenceMaturity: "authored" | "verified-local" | "automated-live" | "regressed" | "unknown"`
- `preconditions: Condition[]`
- `compatibility: Constraint[]`
- Invariant: Realization ≠ Capability (identity does not replace it); fidelity and evidenceMaturity are independent.

Supporting (not new authority, referenced above):
- `ConsequenceSpec` — orthogonal facets `mutability`, `externality`, `sensitivity`, `dataTransfer`, `reversibility`, `visibility` (doc §6).
- `Route` — `{ provider?: SemanticId; account?: SemanticId; model?: SemanticId; realization?: SemanticId }`.
- `InterpretationSession` — `{ sessionId, activeRevision, revisions[], selectedAlternatives[], worldVersion, lastStableCommand? }` (doc §11). Session ≠ Account.

## (c) Synthetic World fixture schema sketch (JSON)

Fixture ≠ live. Fields marked `fixture:` are synthetic and MUST NOT be read as observed
provider truth (doc §10, falsifier 6). Schema sketch:

```json
{
  "schemaVersion": "world/0",
  "worldVersion": "fixture-w1@1",
  "note": "SYNTHETIC FIXTURE — not observed product truth",
  "source": "fixture",
  "providers": [
    { "id": "provider:chatgpt", "title": "ChatGPT", "aliases": ["gpt", "openai"], "providerClass": "chat", "provenance": [] }
  ],
  "accounts": [
    { "id": "account:chatgpt-personal", "provider": "provider:chatgpt", "userLabel": "Personal",
      "aliases": ["personal"], "identityEvidence": [], "state": "known", "defaultFor": ["capability:prompt.send"] }
  ],
  "models": [
    { "id": "model:chatgpt/fixture-large", "provider": "provider:chatgpt",
      "providerNativeId": "fixture-large", "title": "Fixture Large", "aliases": [],
      "capabilityRefs": ["capability:prompt.send"], "evidence": [], "fixture": true }
  ],
  "capabilities": [
    { "id": "capability:prompt.send", "title": "Send prompt", "summary": "Send a prompt across a provider boundary.",
      "concepts": ["concept:provider", "concept:account", "concept:model", "concept:external-transfer"],
      "parameters": [], "language": [], "consequence": { "externality": "network", "dataTransfer": "user-content" },
      "expectedEvidence": [], "related": [], "source": [] }
  ],
  "availability": [
    { "capability": "capability:prompt.send", "provider": "provider:chatgpt",
      "account": "account:chatgpt-personal", "model": "model:chatgpt/fixture-large", "available": true }
  ],
  "defaults": { "provider": "provider:chatgpt", "account": "account:chatgpt-personal", "model": null },
  "focus": { "sessionId": "session:fixture-1", "inputRevision": 0, "selectedTarget": null }
}
```

Availability is a `capability × Provider × Account × Model` join, kept separate from any
identity. The same interpreter must not care whether this world came from a fixture or from
evidence-backed runtime state (doc §10).

## (d) The six named MVP Worlds (with the incompatible Account/Model case)

Synthetic fixtures only. W4 is the required incompatible Account/Model case.

- **W1 `fixture-w1-baseline`** — Providers ChatGPT, Claude, Gemini. Accounts: ChatGPT Personal,
  Claude Work, Claude Personal, Gemini Personal. Provider-scoped fixture models per provider.
  Capability `prompt.send`. All routes compatible. Default set.
- **W2 `fixture-w2-no-accounts`** — Providers + models present, **zero accounts registered**.
  `prompt.send` has no valid account relationship → validation `needs-info`. Proves Account ≠ Provider.
- **W3 `fixture-w3-model-optional`** — Provider exposes **no fixture models**; account known.
  `route.model` absent and valid. Proves Model is a routing choice, not a mandatory identity.
- **W4 `fixture-w4-incompatible-account-model`** — **REQUIRED INCOMPATIBLE CASE.** Account
  `account:claude-work` (provider `provider:claude`) combined with a selected model
  `model:gemini/fixture-pro` (provider `provider:gemini`). The route is inconsistent:
  the interpreter must surface it as `unavailable`/needs-choice, never silently coerce or
  drop one side. Proves Account ≠ Model and provider-scoping of Model.
- **W5 `fixture-w5-stale-account`** — Account `state: "stale"` (and a second `"needs-login"`).
  Availability for that account is unknown/refused; other accounts unaffected. Proves
  availability ≠ identity and evidence state ≠ identity.
- **W6 `fixture-w6-empty`** — **Empty-but-valid world**: no providers, no accounts, no models.
  Interpretation must be empty/valid and debuggable (cf. `WorldModel.warnings`), not mysterious.
  Proves the interpreter requires no hidden provider truth.

## (e) Falsifiers (prove Provider≠Account≠Model≠Session and fixture≠live)

These are the smallest experiments that could invalidate Lock A (doc §21, INVARIANTS
"small falsifiers"). Each must be expressible against the fixtures above.

1. **F1 — Provider≠Account:** Load W2 (no accounts) yet keep `provider:chatgpt` present.
   If `prompt.send` still routes, Account was collapsed into Provider → Lock A wrong.
2. **F2 — Account≠Model & Account≠Session:** Load W4 (Claude Work + Gemini model). If the
   route validates as ready, or the UI hides the conflict, Account/Model/Session separations
   are collapsed → Lock A wrong.
3. **F3 — Provider≠Model:** Load W3 (account, no models). If a null `route.model` is treated
   as an error, Model is being forced as provider identity → Lock A wrong.
4. **F4 — fixture≠live:** Point the interpreter at both W1 (fixture) and a runtime-sourced
   world with identical structure. If any observable (reading, canonical, validation,
   VisualSpec/Wiki identity) differs when only `source` differs, fixtures were treated as
   observed truth → Lock A wrong.
5. **F5 — Session≠Account:** Replay the same pinned input+world across two `sessionId`s.
   If command identity depends on the session rather than the route/revision, Session became
   an account-level identity → Lock A wrong.

Determinism guard (supports F4/F5): same input revision + same World snapshot + same language
artifacts + same registry + same validator + same projector ⇒ same command + VisualSpec +
Wiki topic ids (doc §19).

## Open (not decided here)

- Exact `SemanticId` wire syntax; digest function for `worldVersion` / `command`.
- Whether `availability` is stored or purely derived at query time.
- How `OpView`/`RiskClass` map onto Capability/Realization/Consequence (derive direction).
- VisualSpec vNext handle structure (doc §12) — deferred to a later lock.
