# LOCK-C-CANDIDATE — VisualSpec vNext / VFX first increment

Status: **CANDIDATE / DESIGN-ONLY**. No product code touched. Derived from
`seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md` and `seed-docs/MVP-VISUALIZATION-SANDBOX.md`.
No implementation, no frozen schema, no usability or execution claim.

Scope lock (C): the floating Windows box, natural-language configuration + command,
deterministic interpretation, Provider/Account/Model routing, explicit visual
feedback, contextual Wiki, validated `prompt.send`, SIMULATED pre-execution boundary.

---

## (a) Current projector gap map

Baseline reality (`omega-baseline/plugins/vivim-nlcl-pure/src/types.ts`, `src/project.ts`):

- Defined but under-projected: `WorldModel`, `IR`/`IRSlot`, token annotations, effects,
  suggestions, gaps, `StageTrace`, and a **preliminary VisualSpec** shallow type.
- `project.ts` emits only **token annotations** and **coarse effect previews**.
- Not expressed strongly enough for MVP:
  - Provider / Account / Model identity as distinct, ordered roles;
  - semantic handles with stable IDs (not character spans) as interaction targets;
  - interpretation session + monotonic revision + World version identity;
  - typed parameters / literal prompt payload boundary;
  - validation state + unresolved-choice set as first-class projection;
  - multi-facet consequence (single READ/MUTATION/EXTERNAL badge is too coarse);
  - expected evidence / maturity representation;
  - contextual Wiki refs derived from active handles;
  - permitted semantic-interaction action list.
- `surfaces/web` has a semantic API path (snapshot/interpret/execute/socket) but is a
  server-authoritative production path, not the intended floating-box visual product;
  learn from it, do not inherit its execution behavior.
- No variant engine: one projector is not yet separable from presentation treatment.

Gap summary in one line: the projector carries **token-level surface** but not the
**entity-role, route, validation, consequence and evidence semantics** the MVP must show.

---

## (b) VisualSpec vNext candidate + semantic-handle model

Candidate, **not frozen**. Shape follows the sandbox hypothesis and the design doc's
projection-contract information needs. The projector is **pure**: validated semantic
state → projection. It is never execution authority.

```ts
type Handle = { id: string; kind: HandleKind; label: string; sourceRefs: string[] }

type HandleKind =
  | "provider" | "account" | "model" | "capability"
  | "parameter" | "payload" | "consequence"
  | "validation" | "realization"

type VisualSpecVNext = {
  schemaVersion: string
  session:   { id: string; revision: number; worldVersion: string }   // revision is monotonic
  input:     { text: string; annotations: Annotation[] }
  interpretation: {
    status: string; canonical: string | null; reading: string | null
    confidence: number; stageSummary: string[]
  }
  command: {
    capability?: Handle
    provider?:   Handle
    account?:    Handle
    model?:      Handle
    parameters:  VisualParameter[]      // each parameter carries origin + sourceRefs
    payload?:    VisualPayload          // literal content boundary, inspectable
    realization?: Handle                // expanded/expert only
  }
  validation: { state: string; unresolved: Choice[]; warnings: VisualNotice[] }
  consequences:       ConsequenceProjection[]   // facets, not one badge
  evidenceExpectation: EvidenceProjection[]     // expected vs observed, maturity
  wiki:  { primary?: WikiTopicRef; related: WikiTopicRef[] }
  interactions: SemanticInteraction[]           // permitted semantic actions only
}
```

Handle model rules:

- Every meaningful visual object carries a stable `Handle.id`; the renderer
  **cannot invent or substitute an ID**. Interaction targets are IDs, not spans.
- Fields may exist **without source spans**; multiple spans may feed one handle, and
  one span may touch several fields. Span/offset is display metadata, never identity.
- `sourceRefs` link to input-revision-tied spans and to canonical semantic references.
- Each `Handle` carries an accessible `label` so meaning survives icon replacement.
- The renderer consumes the projection and **nothing more semantic**.

Annotation vocabulary (candidate, experimental styling): solid underline =
assigned interpretation; dashed enclosure = materially unresolved; light bracket =
payload/scope boundary; inline identity marker; temporary focus outline; muted
unclaimed text. Meaning is stable even if treatment is re-skinned.

---

## (c) How the three variants differ over ONE frozen fixture

Frozen fixture (single, held constant across all variants):

- World C — ambiguous Claude: `ChatGPT · Personal`, `Claude · Work`, `Claude · Personal`, `Gemini · Personal`.
- Input: `Ask Claude Work using Model B: explain this error`
- Same validated semantic state and the **same `VisualSpecVNext`** for every variant.
- Same per-keystroke revision trace; same late-result suppression.

| | Variant A — annotated sentence | Variant B — compact semantic strip | Variant C — hybrid |
|---|---|---|---|
| Where meaning lives | In/under the natural-language line | Text stays clean; compiled route beneath | Minimal inline marks + route chips beneath |
| Provider/Account/Model | Inline markers on the phrase itself | `[Claude] [Work] [Model B]` route row | inline provider marker + chips row |
| Unresolved choice | Dashed enclosure on the word | `[Account ?]` chip in route row | dashed inline + `[Account ?]` chip |
| Payload boundary | Bracket region on `explain this error` | payload shown as bounded strip segment | bracket inline + payload chip |
| Effect/state line | Suffix annotation + state line | `Ready · sends prompt externally ›` | both, kept minimal |
| Cost | Highest inline density during typing | Zero inline noise; route consolidated | Balanced; moderate density |
| Risk | Annotation clutter / flicker on current word | Divorce of text from its route | Two places to scan |

Invariants across ALL three (sandbox §32 constraints):

- no variant hides material ambiguity; Provider and Account never merge;
- confidence never implies verification; no external execution is claimed;
- canonical command is identical; no UI-only action; no hidden routing;
- a consequential data-transfer marker is always present;
- no Wiki file is required for explanation.

---

## (d) Explicit separation: Provider / Account / Model / capability / payload / unresolved / consequence

These are independent dimensions and must never collapse into one readiness signal.
An understood command can be unavailable; an authorized action can fail; a provider
logo proves neither Account identity nor connectivity.

- **Provider** — external service identity (ChatGPT / Claude / Gemini). Strongest,
  brand-level marker. A logo alone is not proof of Account or connectivity.
- **Account** — the user's relationship with that Provider. Subordinate to Provider,
  individually identifiable, user label primary (`Claude · Work`). Identity stays
  stable while status changes: "Needs login" is added **beside** the Account, never
  replacing its identity with an unexplained warning glyph.
- **Model** — a Provider-scoped routing choice. Rendered as a route option (chip),
  never as a Provider or an Account. Optional/selected route dimension.
- **Capability** — what Ω is asked to do (`prompt.send`). Separate from who does it.
- **Payload** — literal content sent; its instruction-vs-payload boundary is
  inspectable. `Send Claude: 'delete the old draft'` — the quoted text is payload for
  Claude, not a local deletion request.
- **Unresolved** — legitimately missing/ambiguous material, surfaced as an explicit
  choice with origin; must never be hidden by a prior/default invisible to the user.
- **Consequence** — multi-facet, not one badge: external data transfer, destructive
  local effect, secret reveal, network interaction, physical effect, session-ending
  effect, authority/consent requirement, realization fidelity, evidence maturity.
  For `prompt.send` the key facet is: *prompt content is transferred to Provider X
  through Account Y using Model Z*.

Ordering is a relationship, not a collapse:

```
Provider → Account → Model (optional) → Capability
```

Plus orthogonal: authority/consent, consequence facets, evidence maturity.

---

## (e) Rule: UI must not parse raw language or hold hidden routing state

Hard rules (map to sandbox §35 falsifiers):

1. The UI must **not parse** provider/account/model names, capability words, payload
   boundaries, or scope/negation itself. Interpretation and validation come from the
   shared semantic system; the renderer projects results only.
2. The UI must **not hold hidden routing truth**. A click that changes meaning is a
   **semantic edit** against the session, followed by recompile + revalidate:

   ```
   click Claude Work → route.account = account:claude-work
   click another Model → route.model = model:<id>
   ```

3. Typed and clicked corrections must converge on **the same semantic field** and
   produce equivalent command digests under identical context.
4. Presentation gestures (move/resize) are outside command semantics and must never
   change canonical meaning.
5. The visual layer owns no inventory (Provider/Account/Model), capability schemas,
   route validity, consequence semantics, or Wiki truth — it projects them.
6. Editing a new draft while a command runs must not silently retarget the running
   command; late results from older revisions must never overwrite newer ones.
7. Selecting a handle may expose identity/alternatives/state/actions but must **not**
   execute. Interpretation selection is not execution consent.

---

## Separation of concerns / what Lock C is NOT

- NOT product code, NOT a frozen wire format, NOT a UI framework choice.
- NOT an authority engine, NOT real provider execution, NOT a usability proof.
- A design candidate to be reconciled with the existing VisualSpec projector
  (roadmap VSX-01..VSX-12), then proven in the sandbox before native shell work.
