# Run C artifacts — WikiCore verbs and self-runtime

Executable evidence for [RUN_NOTE.md](RUN_NOTE.md). Everything here is regenerable from the
pinned fixture with the commands below. No claim in the run note depends on anything not
reproducible from this directory.

## Reproduce

```bash
cd runs/C-2026-10-12
node probe/groundtruth.mjs       # compile + typecheck (incl. control) + execute the fixture
node probe/compare.mjs           # run the 4 questions through H0/H1/H2 and score
node probe/verify-acceptance.mjs # Arm C is complete only when this exits 0
```

`groundtruth.mjs` must run first — `compare.mjs` reads `evidence/groundtruth.json` and
fails loudly if it is absent. The compiler path defaults to the global TypeScript install;
override with `TSC_JS=/path/to/typescript/lib/tsc.js` if yours differs.

**Toolchain this run actually used:** node 24.11.1 · tsc 7.0.2 · rg 14.1.0 · git 2.51.2.

## Layout

| Path | What it is |
|---|---|
| `RUN_NOTE.md` | The deliverable, in the `REVIEW.md` compact format |
| `ACCEPTANCE.md` | The fixed, prompt-derived completion checklist |
| `probe/groundtruth.mjs` | Establishes what is mechanically true vs what the doc comments claim |
| `probe/index.mjs` | Source-pinned index: symbols, doc claims, call edges, honest `limits` |
| `probe/v1-verbs.mjs` | **H1** — verb-led introspection surface |
| `probe/v2-predicates.mjs` | **H2** — composable three-valued predicates |
| `probe/compare.mjs` | Harness: 4 questions × 3 surfaces, scored |
| `probe/verify-acceptance.mjs` | 37 acceptance criteria traced to prompt lines; exit 0 = complete |
| `evidence/groundtruth.json` | Raw compiler + execution witnesses |
| `evidence/comparison.json` | Raw per-question answers and scores |
| `probe/.gt-build/` | Scratch: compiled fixture + callers. Regenerated, safe to delete |

## Expected output

`compare.mjs` prints:

```json
{
  "surfacedContradiction": "v0=NO  v1=YES  v2=YES",
  "attachesProvenance":    "v0=YES  v1=YES  v2=YES",
  "separatesClaimFromWitness": "v0=NO  v1=YES  v2=YES",
  "canEnumerateUnknowns":  "v0=NO  v1=YES  v2=YES"
}
```

If `surfacedContradiction` reads `v0=YES`, **stop and investigate** — either the fixture
changed or the control is broken. That row is the whole experiment.

## Scope limits — read before trusting

These are stated in code (`index.limits`) and repeated here because they bound the result:

- The index is a **balanced-delimiter scanner, not a TypeScript AST.** No type inference.
- **Single file only.** `RELATE(repeat)` returns no edges; that is a verified true negative
  (positive control: `accumulate → add` *is* detected), not a silent failure.
- **No cost/time telemetry.** UNKNOWN, deliberately not estimated.
- **Fixture cohort only.** No real-code cohort was attempted.
- **No canvas rendering.** Visual parity is NOT_RUN.