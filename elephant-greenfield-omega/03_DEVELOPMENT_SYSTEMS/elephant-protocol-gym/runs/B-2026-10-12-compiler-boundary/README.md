# Arm B — Semantic Compiler and Human/Machine Boundary: working artifact

**Status: EXECUTED 2026-10-12.** This directory is the real, executed output of
[Arm B](../../../RUN_B_COMPILER_BOUNDARY.md). It is evidence, not a proposal.
Nothing here was merged, ratified or authorized; no branch was created and
`main` was not modified.

## What this experiment actually asked

Can a version-pinned semantic fact be **published once** and rendered into **two
mutually source-linked projections** (machine + human), with a **deliberate
source mutation making the stale meaning visible**?

## Reproduce

```bash
cd runs/B-2026-10-12-compiler-boundary
node run-b-experiment.mjs        # node 24.x, zero dependencies
```

`source.ts` is the pinned Gym fixture, byte-identical to
`fixture/001-semantic-basics.ts` at commit `1199b38`
(sha256 `fe0c651e…386d5`).

## Files

| File | What it is |
|---|---|
| `sempub.mjs` | The compiler. Dependency-free intake, publication, two projections, verifier. |
| `run-b-experiment.mjs` | Six-phase driver producing every receipt below. |
| `human.md` | Human projection (Plain Reading + evidence labels). |
| `machine.json` | Machine projection. Both render the **same** publication. |
| `machine-human-signal.json` | Decision 3 signal receipt. |
| `RECEIPT.txt` | Full transcript of the run. |
| `SHA256SUMS.txt` | Custody for every artifact here. |

## The three candidate arrangements

Derived from constraints, not aesthetics. Constraint pressure came from the
[launch policy](../../../LAUNCH_POLICY.md) D1–D4, [initial state](../../../INITIAL_STATE.md)
("do not assume they must be separate network services, a browser, a database,
WASM"), and [Decision 3](../../../MACHINE_HUMAN_SIGNAL.md) (evidence classes must
be visible in both views).

**A1 — Single portable program, publication as the only boundary (TESTED).**
`source → facts → PUBLICATION (frozen, digested) → {machine, human}`. One process,
no service, no database. *This is what was built and executed.* The frontend/backend
split is not a process boundary at all; it is the **publication→projection**
boundary, and both projections are pure functions of one immutable object.

**A2 — Separate compiler service and renderer (PROPOSED, not built).**
A backend owns parsing and writes an immutable `publication.json` artifact; a
frontend consumes only that artifact and never reads source. Stronger isolation,
but it adds a serialization boundary and a staleness question the single program
does not have. *Not falsified here — untested.* The experiment gives no evidence
against it; it only shows A1 suffices at fixture scale.

**A3 — Pure interpret-to-IR, projections computed on demand (PROPOSED, not built).**
`interpret(source) → IR`, both views computed fresh per query, no stored artifact.
Maximally replayable. Cost: recomputes meaning on every view and makes
"which meaning was this page generated from" a harder question to answer later.

**Finding: TESTED.** A1 satisfies the brief at fixture scale with ~230 lines and
zero dependencies. **A formal frontend/backend split is not yet justified by any
observed constraint.** The brief's permission to conclude exactly this is taken.
A2/A3 remain open, not rejected.

## What "compiled / interpreted / projected / authorized" meant here

- **Compiled** — `extractFacts` deterministically reads source text into facts with
  exact byte ranges. No model, no inference.
- **Interpreted** — the *author's* doc comments. These are carried as `DECLARED`
  and can never self-upgrade.
- **Projected** — `projectMachine` / `projectHuman`, pure functions of the
  publication. Neither re-reads source.
- **Authorized** — **nothing was authorized and nothing occurred.** The only
  execution was running the local fixture module to observe behavior the author
  had already declared. No external effect, no account, no network, no write
  outside this directory.

## Known limitations (stated, not hidden)

1. The intake is a line scanner, **not a TypeScript parser**. It handles this
   fixture's shape and will mis-handle nested generics, decorators, classes,
   multi-line signatures and JSDoc type annotations.
2. Witnesses are **first-party** — this process ran the code. That is observed
   behavior, not independent referee proof, and not a general correctness claim.
3. Only one mutation (a constant's literal) was tested. Function-body,
   signature and cross-file mutations are untested.