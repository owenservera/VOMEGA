# LOCK-B CANDIDATE — LNC / L1 first increment

Status: CANDIDATE (design-only). No product code touched. Scope is bounded to the
semantic gap between today's NLCL and the release's `prompt.send` USE command.

Evidence base (read this increment):
- `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md` — target product promise and USE command.
- `omega-baseline/plugins/vivim-nlcl-pure/src/types.ts` — public language contract.
- `omega-baseline/plugins/vivim-nlcl-pure/src/recognize.ts` — dedicated recognizers.

---

## (a) Current NLP / NLCL gap map

What NLCL is today (evidence: `types.ts`, `recognize.ts`):

- It is a **mail/automation command language**. Recognizers cover help, entity
  query, teaching (`teach X means send`), director rules, receive simulation,
  inbox shortcut (`recognize.ts:44-359`).
- Grounding targets are `EntityView` of type `contact | message | rule`
  (`types.ts:19-26`, `ground.ts`). There is **no Provider, Account, Model, or
  Session entity type**.
- `OpView` carries a flat `provider: string` (plugin id) (types.ts:16) — that
  is the *plugin* that implements an op, **not** an external AI Provider
  (ChatGPT/Claude/Gemini). `Provider ≠ Account ≠ Model ≠ Session` (design §28)
  has no representation.
- Interpretation output is `IR` (intent/family/slots/payload) plus a deterministic
  `VisualSpec` projection (types.ts:92-102, 318-331). Reusable, but its slots are
  `entity | text | content | enum | rest` (types.ts:165) — no routing dimension.

Gap bullets (what is missing for the release slice):

- **No `prompt.send` capability.** No frame/recognizer maps ordinary language to
  an external prompt dispatch. `message.send@1` is internal mail, not it.
- **No routing dimension.** No slot kind / IR field can carry
  Provider → Account → (optional) Model as a resolution chain.
- **No addressee-first phrasing.** `OpsFrame.verbs` assume verb-first
  ("send … to X"). Release language is addressee-first in many cases
  ("Ask my work Claude to …", "Ask ChatGPT what this error means").
- **No external-target ambiguity model.** Grounding ranks contact matches
  (`EntityMatch`), but nothing comparably preserves Provider/Account ambiguity
  or applies explicit-target precedence ("work Claude" must beat a default
  personal account — design §16).
- **No false-READY guard.** Nothing today withholds a READY state when a target
  is unresolved. A wrong/stale Account could read as resolved.
- **No quotation handling for provider/model names.** `lexer` has quotes for
  literal payloads only; `"Claude"` as a *named routing target* is not a concept.
- **No correction contract.** `CorrectionPrior` exists for entity grounding
  (types.ts:217-223), but there is no semantic-correction path for "I meant
  work, not personal."
- **Model is not a first-class optional dimension** (design §28 requires the
  semantic design to admit it without an opaque provider-specific escape hatch).

---

## (b) Candidate UseCommand v0 — fields (design-only, not frozen)

Proposed canonical shape, layered on the existing `IR` rather than replacing it
(execution still goes through `payload` re-derivation):

| Field | Required | Meaning | Notes |
|---|---|---|---|
| `intent` | yes | `prompt.send@1` (candidate id) | new op id, distinct from `message.send@1` |
| `provider` | yes | external AI Provider (ChatGPT / Claude / Gemini) | resolves to a known registered Provider |
| `account` | yes | account under that Provider | may be `null` while unresolved |
| `model` | no | optional model/mode under the account | `null` = provider/account default; never silently invented |
| `payload` | yes | the prompt text (or a context ref) | text or deferred `contextRef` |
| `realization` | resolved later | browser/session realization | not chosen at interpretation time |
| `authority` | derived | consent gate from op risk | interpretation **never** grants it (design §16) |

Unresolved choices left open in v0 (deliberately not decided here):

- Whether `model` is a slot on the same IR or a sub-record.
- Whether Provider/Account are `EntityView`s of new types or new dedicated views.
- Where defaulting policy lives (world vs priors) and whether it emits a visible
  `note` when it auto-resolves a single valid account (design §6 requires the
  user never unknowingly lose which account was chosen).
- The exact new `RiskClass`/gate for `prompt.send` (likely `EXTERNAL_MUTATION`).
- Whether `prompt.send` reuses `message.send` IR shape as a superset or is a
  separate frame family.

---

## (c) Validation outcomes (incl. false-READY avoidance)

Design-level validation targets for this increment (not yet executed):

- **Paraphrase equivalence** — "ask Claude this" / "send this to Claude" /
  "use Claude for this" / "have Claude answer this" must converge to one
  canonical `prompt.send` with the same Provider/Account (design §16).
- **Explicit-target precedence** — "work Claude" must not be overridden by a
  default personal account.
- **Ambiguity preservation** — two equally plausible accounts with no policy
  ⇒ status `ambiguous`, not a silent pick.
- **False-READY avoidance (primary):** a command must **not** reach `ready`
  while Provider or Account is unresolved or stale. Proposed rule: READY requires
  `provider != null && account != null && status ∈ {ok}`. Any unresolved or
  stale routing field forces `partial`/`ambiguous`, surfaces the gap, and offers
  choices — never a spinner-then-execute.
- **Unknown capability** — an unavailable operation must be explained with valid
  alternatives, never fabricated (design §16, falsifier 5).
- **Authority separation** — interpretation cannot create permission; consent is
  a later, separate gate (design §22).
- **Deterministic UI parity** — typed and clicked paths reach the same canonical
  command.

---

## (d) Revision / session contract

- **Additive only.** New op id, new slot/entity concepts and new recognizer are
  added; existing `message.send@1`, rule, teach, receive and inbox behavior is
  preserved unchanged. No product code modified in this increment.
- **Determinism preserved (N1):** same input + world + priors + `NCLL_VERSION`
  ⇒ same interpretation. Any new defaulting must be a pure function of world
  state and emit a visible note when it acts.
- **Versioning:** bump the language version when the new recognizer/frame lands;
  keep observation `v` discipline in `WorldModel`.
- **Session/revision:** each interpretation carries `worldV` + `nlclVersion`;
  corpus cases must be replayable against a pinned world fixture. A failed case
  opens a CapabilityGap/Truth note; do not silently skip.
- **Ownership:** edits to product files require a separately claimed Commons
  task and independent review (AGENTS.md). This increment owns only the two new
  docs below.

---

## (e) Six corpus cases to add

Proposed additive corpus (new file, see handoff for path). Each case pins input,
world fixture, expected status, expected canonical, and must-fail checks:

1. **Addressee-first** — "Ask my work Claude to summarize this" ⇒
   `prompt.send@1`, provider=Claude, account=work, READY only if work resolves.
2. **Model routing** — "Ask ChatGPT using the fast model what this error means"
   ⇒ provider=ChatGPT, model=fast, account resolved; model omitted ⇒ default,
   never invented.
3. **Explicit-target precedence** — "Send this to work Claude" with default
   personal account configured ⇒ account=work_WINS (must not default to personal).
4. **Quoted Provider/Model names** — `use "Claude" for this` / `ask "Gemini"
   about this` ⇒ quoted token recognized as a routing target, not literal payload.
5. **Orientation collision** — a phrase that could read as product orientation
   vs. a prompt dispatch (e.g. "what can Claude do?") ⇒ must not silently become
   a `prompt.send`; resolves to help/orientation or preserves ambiguity.
6. **Correction** — after ambiguity, "I meant personal, not work" ⇒ correction
   applies to the pending `prompt.send` target; new canonical reflects personal,
   with a recorded correction prior (mirror `CorrectionPrior` semantics).
