# Handoff — LNC-L1 (LNC / Lock B first increment)

## Status

BOUNDED design increment complete. **No product code modified, no config
changed, no git writes.** Two new docs added (see artifacts). No implementation
attempted. This is a candidate contract for the `prompt.send` USE command and an
additive corpus proposal, intentionally not frozen.

## Artifacts (new files, both created this increment)

- `omega-baseline/experimental/lnc-l1/LOCK-B-CANDIDATE.md` — gap map, candidate
  UseCommand v0 fields, validation outcomes incl. false-READY avoidance,
  revision/session contract, and the six corpus cases.
- `.project/agentic-launch/handoffs/LNC-L1.md` — this handoff.

Read for this increment (not modified):
- `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`
- `omega-baseline/plugins/vivim-nlcl-pure/src/types.ts`
- `omega-baseline/plugins/vivim-nlcl-pure/src/recognize.ts`
(directory listing of `.../src/` also read: frames, grammar, ground, index,
interpret, lexer, project, symbols, text.)

## Exact corpus changes proposed

No existing corpus file was located in this bounded pass, so the proposal is
**additive, not a modification of a known file**:

- Proposed new corpus file:
  `omega-baseline/experimental/lnc-l1/corpus/prompt-send.v0.yaml` (path is a
  proposal — owner to confirm the real corpus location before landing).
- Six cases to add (details in LOCK-B-CANDIDATE.md §e):
  1. Addressee-first ("Ask my work Claude to summarize this").
  2. Model routing ("Ask ChatGPT using the fast model …").
  3. Explicit-target precedence (work must beat default personal).
  4. Quoted Provider/Model names (`"Claude"` as routing target, not payload).
  5. Orientation collision ("what can Claude do?" must not become prompt.send).
  6. Correction ("I meant personal, not work").
- Each case must assert: expected `status`, expected `canonical`, expected
  provider/account/model, and must-fail (false-READY) checks.

## Open questions

- Where does the real NLCL corpus live, and what is its schema? (Not found in
  the bounded read set.)
- Provider/Account as new `EntityView` types vs. new dedicated view records?
- Does `prompt.send` reuse `message.send@1` IR shape or a new frame family?
- Where does default-account policy live (world vs `BehaviorPriors`), and how is
  auto-resolution surfaced as a visible note?
- What `RiskClass`/gate does `prompt.send` get (likely `EXTERNAL_MUTATION` +
  consent)?
- Is `Model` a slot on the IR or a sub-record (design §28 requires admitting it
  without an opaque escape hatch)?

## Downstream triggers

- **VFX (visual projection):** extend `VisualSpec` (types.ts:318-331) to project
  Provider/Account/Model chips and a routing ambiguity picker, reusing
  `VisualSlotCard`/`VisualEntityChip`. Must never show a READY/routing target
  that is unresolved or stale.
- **EXP (experiments):** wire the six corpus cases into the automated semantic
  experiment harness; track wrong-target rate, false-READY rate, ambiguity
  honesty, semantic stability across keystrokes, typed/clicked parity.
- **RTE (runtime/realization):** define the governed `prompt.send` realization
  boundary (browser transport, account/session evidence) behind the resolved
  canonical command. Interpretation → READY does not imply authority or
  execution; realization selection and consent are separate stages.

## Coordination note (AGENTS.md routing)

New objective + design candidate → Coordination room; open corpus questions →
Research; this increment is research/design and touched no product code, so no
independent code review is required yet. Any future edit to
`omega-baseline/plugins/vivim-nlcl-pure/src/**` must claim a Commons task,
assign explicit file ownership, and pass independent review before landing.
