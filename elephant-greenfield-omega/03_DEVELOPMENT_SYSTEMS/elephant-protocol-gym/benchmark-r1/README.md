# Benchmark R1 — prepared apparatus

**Status: PREPARED, NOT RUN. BLOCKED on owner budget.** No cold reader has been dispatched.
Nothing in this directory is a result.

---

## What is here

| File | Role | State |
|---|---|---|
| `oracle.mjs` | Executable ground truth, derived by RUNNING the cohort | `--check` PASS (5 items); 5/5 negative controls discriminate |
| `TASK.md` | The one fixed task both arms answer | prepared |
| `README.md` | This file | — |

Missing and required before launch: `SCHEMA.json` (the answer shape), the two arm task
payloads, and the capsule for arm C. The capsule cannot be written until at least one
baseline trial exists, because a capsule summarising nothing is not a capsule.

---

## Verify it

```bash
cd elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/benchmark-r1
node oracle.mjs --check              # ORACLE SELF-CHECK: PASS
node oracle.mjs --negative-control   # 5/5 controls discriminate
node oracle.mjs                      # print derived ground truth
```

The oracle mutates the cohort during `--negative-control` and restores it in a `finally`.
Verify with `git status --short omega-baseline/plugins/vivim-nlcl-pure/` afterwards — it
must be empty. This has been checked after every run so far.

---

## Ground truth, derived by execution

Five items. These are *facts about the pinned source*, not claims about the readers:

- **GT1** — 18 glyph entries, 17 declared families, but only 16 glyphs ARE declared
  families. Two glyphs (`Δ`, `✔`) are aliases that lex to `∆` and `✓`; one declared family
  (`→`) has no single-glyph entry because it is spelled multi-character. **Neither 18 nor
  17 is the family count**, which is the point.
- **GT2** — `src/types.ts` exports **zero** runtime values, so its declared guarantees are
  type-level only and cannot be confirmed or refuted by executing anything.
- **GT3** — every advertised glyph lexes to a declared family (18/18), and `→` is declared
  but unreachable from any single glyph.
- **GT4** — a quoted glyph stays a `quote` token and gains no family.
- **GT5** — the alias glyphs normalise to canonical families on lexing.

GT1 and GT3 together are the kind of cross-file, silently-declared detail that distinguishes
a real cold reader from one that pattern-matched on the obvious.

---

## Three things this build got wrong, recorded because they will recur

**The negative controls initially tested nothing.** Node caches ES modules, so a mutated
cohort re-imported in the same process returned the *original* module. Every mutation
silently did nothing, the detectors correctly reported PASS, and the controls then
concluded "the detector is broken" when the detector was fine. Fixed by running each probe
in a child process.

**The mutant anchors were single-quoted against a double-quoted source.** Three of four
controls mutated nothing for the same reason and reported the same false conclusion. Fixed
by an explicit `mutate()` that throws if the anchor is absent or the file did not change —
a mutant that does not apply tests nothing.

**The control then found a real gap in my own detector.** I had asserted a "surplus of 2"
because "Δ/∆ and ✔/✓ are both alias pairs". That was wrong: the measured surplus is 1, with
16 declared glyphs, 2 aliases and 1 glyph-less family. The detector now asserts the
composition and the invariant `glyphs_that_are_declared + declared_without_glyph ===
families`, which is what actually binds the numbers together.

Each of these is the Round-0 failure mode — an instrument that produces a clean-looking
result while testing nothing — arriving from a new direction, in code written to prevent it.

---

## What this benchmark cannot tell you

- **Nothing about the readers, yet.** No trial has run.
- **Not independent implementations.** All cold readers will be one model family, so their
  agreement is not corroboration and no statistical claim is supportable.
- **Not a capsule verdict.** Arm D's toy-corpus result was 4/4 vs 4/4 — saturated, supporting
  no claim in either direction. R1 can settle it on real source; it has not.
- **Not a self-hosting result.** It measures divergence recall on one module. It says
  nothing about whether an Elephant can explain or govern its own operating protocol.

---

## Launch requirements

1. `SCHEMA.json` and the two arm payloads written.
2. At least one baseline trial run, then the arm C capsule written from its honest output —
   including a machine-readable statement of what it did **not** establish.
3. n ≥ 3 cold readers per arm.
4. Owner authorisation for the compute. **Not granted.**