# Run A artifacts — Elephant Protocol Gym, 2026-10-12

Independent dry-run arm A. Nothing here is canon, and nothing here was launched,
promoted or merged. The shared seed, fixture, launch policy and main branch were
not modified.

## Read in this order

| File | What it is |
|---|---|
| **`RUN_NOTE.md`** | The deliverable. Compact note in the `REVIEW.md` template. Start here. |
| `SATURATION_DESCRIPTION.md` | Deliberately verbose source description, every line evidence-classed. |
| `MACHINE_HUMAN_SIGNAL.md` | Decision 3 receipt. Two signals, one honestly `UNKNOWN`. |
| `baseline.ts` | Byte-identical copy of the pinned fixture, for reproducible runs. |

## Experiments

Each writes a JSON result file and prints it. All read `baseline.ts`, compile with the
TypeScript compiler API and execute under Node.

```bash
node extract-facts.mjs baseline.ts   # CODE_DERIVED facts vs AUTHOR_ASSERTION comments
node exp1-precondition.mjs           # does repeat() enforce its stated precondition?  -> OBSERVED
node exp2-mutation.mjs               # does a type-level description survive a body mutation? -> TESTED
node exp3-placement.mjs              # plain / comment / digest-sidecar, same claim   -> TESTED
node exp4-classify.mjs               # is classify()'s return union exhaustive?        -> OBSERVED
node exp5-partial-effect.mjs         # does repeat() fail atomically?                  -> OBSERVED
```

## Verify the note itself

```bash
node verify-run-note.mjs   # 26 checks; re-derives every number RUN_NOTE.md asserts
```

The sweep is deliberately adversarial toward its own note: it re-counts the exp1 input
classes rather than trusting the prose, asserts the exp3 comment was actually found
(guarding the earlier null==null vacuous pass), and cross-checks that all five
experiments recorded the same pinned fixture digest. It caught a real error — the note
originally said "6 of 11" precondition violations when the correct count is 7 — which is
recorded in the note rather than quietly patched.

## Custody

- Commit `1199b38c1fd174e997c92b22d18d8c20c952eb9e` (main, synced to origin/main)
- Fixture sha256 `fe0c651e51936074346c7dcabfef52785783e5a3d87f110c8365952b40a386d5`, 1001 bytes
- Compiler API `typescript@6.0.3`, Node v24.11.1

## Limits, stated up front

Fixture-scale only. **REAL_SOURCE_UNAVAILABLE** — no real-source cohort was run. No
human comprehension participant, so one Decision 3 signal is `UNKNOWN` rather than scored.
The Python Live Lab / Experiment Runner / Change Lab were not replayed, so this run has no
baseline comparison against them and does not claim to beat them.