# VFX-L1 — Handoff (VisualSpec vNext / Lock C, first increment)

## Status

- **DONE (design-only, bounded).** First VFX/Lock C increment produced.
- One mandatory artifact written; no product code modified, no git writes, no config changes.
- No implementation of a projector, sandbox, variant engine, or Wiki projection was attempted.
- No usability, provider-connectivity or execution claim is made.

## Artifact paths

- `omega-baseline/experimental/mvp-sandbox/LOCK-C-CANDIDATE.md` — VisualSpec vNext
  candidate + `Handle` model; projector gap map; how Variants A/B/C differ over one
  frozen fixture; explicit Provider/Account/Model/capability/payload/unresolved/
  consequence separation; the no-parse / no-hidden-routing rule.
- This handoff: `.project/agentic-launch/handoffs/VFX-L1.md`.

Source inputs read (not modified):
- `seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md`
- `seed-docs/MVP-VISUALIZATION-SANDBOX.md`

Baseline referenced (read-only, not edited):
- `omega-baseline/plugins/vivim-nlcl-pure/src/types.ts`
- `omega-baseline/plugins/vivim-nlcl-pure/src/project.ts`

## Key findings (evidence leads, not authority)

- The baseline already defines a *preliminary* VisualSpec type, but `project.ts` only
  emits token annotations + coarse effect previews.
- Provider/Account/Model identity, semantic-handle IDs, revision identity, typed
  payload, validation/unresolved state, multi-facet consequence, evidence maturity and
  Wiki refs are not yet projected strongly enough for the MVP visual product.
- `surfaces/web` is a server-authoritative production path; reuse its patterns, do not
  inherit its execution behavior into the floating-box sandbox.
- The seed's own roadmap already names VSX-01..VSX-12; Lock C should be reconciled with
  those IDs, not treated as a parallel model.

## Open questions

1. Which annotations stay visible during typing vs only after a pause? (debounce open)
2. Do resolved objects remain annotated prose, or become optional chips?
3. Which consequence facets fit in the compact surface, which require expanded view?
4. How are overlapping scope / negation / nested relationships shown without clutter?
5. Which icon family best communicates device vs service vs Account vs locality?
6. Handle identity encoding: opaque stable IDs vs role-qualified IDs — needs decision
   before VSX-04.
7. Reconciliation point: is VisualSpec vNext an **extension** of the existing type or a
   **replacement**? (documents propose evolution; needs an explicit decision)
8. Where does the payload/instruction boundary originate — parser output or projector
   post-processing? (must be semantic system, never the UI)
9. Latency/debounce target — unmeasured; must come from experiments, not taste.

## Downstream triggers

For **EXP** (experiments / automated semantic experiments):
- Trigger once a pure VisualSpec vNext projector exists: run the frozen fixture
  (World C + `Ask Claude Work using Model B: explain this error`) through all three
  variants and measure semantic correctness, ambiguity honesty, unresolved-field
  timing, semantic flicker, correction parity, Wiki relevance, accessibility labels,
  projection latency.
- Falsifier set to instrument: wrong Account hiding behind a familiar logo; hidden
  default; ambiguity erased by an invisible prior; late revision overwriting newer;
  typed-vs-clicked divergence; UI parsing language itself.

For **SKW** (semantic knowledge / Wiki projection):
- Trigger once handles are emitted: rank Wiki topics from active handles + Reflection
  graph — no arbitrary text search, no hand-authored Wiki files.
- Priority rule to verify: on ambiguity, "Why Ω needs a choice" outranks generic
  Provider info; clicking a handle makes that handle the primary context.

## Next bounded increments (proposed, not started)

1. VSX-01 reality assay → confirm/refine the gap map against live `types.ts`/`project.ts`.
2. Decide question 7 (extend vs replace) → then VSX-04 pure projector.
3. Emit handles for the frozen fixture only, then hand to EXP/SKW.

## Constraints honored

- Max 8 tool calls; only 2 docs read per the brief.
- New files only; no product code, no git writes, no config edits.
- No full implementation attempted.
