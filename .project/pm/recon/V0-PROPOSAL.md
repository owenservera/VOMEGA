# PM v0 — Implementation Proposal (Wave B, rev 2)

Status: **PROPOSAL — revised after independent review.** Grounded in Wave A recon
([recon/WAVE-A.md](recon/WAVE-A.md)) and the current repo/runtime at HEAD `93075cf`.
Owner: `PMC-LEAD`. Review: `PMC-TRU` (verdict in §11) — rev 2 applies every required change.

This is deliberately small. It implements the *only* thing recon found not already present:
a machine-readable decomposition graph over existing owners, with a validator that makes
non-duplication mechanical rather than declarative.

## 0. Changelog (rev 1 → rev 2)

| Review finding | Change |
| --- | --- |
| Stored `sourceHead` contradicted its own cut | removed from the seed; provenance is generated only (§3.1, §4) |
| §6 defects had no fields to live in | added program-level `gaps[]` and phase `needsReview` (§3.1) |
| `effort` truncated ranges (`E1–E2`, `E4–E5`) | `effort` is now the **grade string** verbatim (§3.1) |
| soft/program-level deps dropped; MP-67 deps unresolvable | added `softDeps[]` distinct from `blockedBy[]`; carried as a **fifth** gap (§3.1, §6) |
| `taskRef` cross-namespace, unexercised; `workPackages` empty | single namespace declared (`tasks[].id`); `workPackages` **cut from v0** (§2, §3.1) |
| "validator fails on seed/tracker disagreement" was false | reworded: missing key fails; hint mismatch **warns** (§1, §3.2) |
| maturity derivation ambiguous / collapsed plan vs proof | **split into two derived dimensions** `planResolution` + `evidenceState` (§3.2) |
| "enforced by schema" was a name blacklist | parsing is **strict on unknown keys**; limitation stated (§3.1) |
| `consumers` rule contradicted its example | rule reconciled: `consumers` may reference phase **or** gate (§3.1) |
| v0 could not exercise its own headline claim | v0 scope narrowed explicitly; fixtures exercise the runnable falsifiers (§2, §5, §8) |

Also adopted (optional): the derived level `PROVEN-SLICE` is renamed **`EVIDENCED`** to end the
vocabulary collision with META-TRACKER's `PROVEN-SLICE` state.

### rev 2 → rev 3 (implementation review + dogfood)

After v0 was implemented, a fresh independent `PMC-TRU` pass reviewed the code and a separate fresh
"worker" pass tested the generated portfolio for orientation value. Changes:

| Finding | Change |
| --- | --- |
| **`pm:check` was RED on the shipped commit** — the committed projection embeds `sourceHead`, and committing advances HEAD, so it was permanently "stale" | the volatile HEAD is now neutralized before the freshness comparison (`stripVolatileHead*`); a test asserts HEAD-independence while seed drift is still caught |
| `pm:test` could pass while `pm:check` was red | added freshness/HEAD tests; `workPackages` rejection test added |
| `schema.ts` comment overclaimed non-duplication as absolute | corrected: the guard is a **name** blacklist; free-text fields (`outcome`, `statement`, `softDeps`) are unguarded prose |
| §5 item 8 disagreed with §2 (no ratchet read) | resolved by a **live, non-stored** reference: `pm:check` prints the ratchet's computed counts/head from `.project/evidence/d1-ratchet.json`; nothing is stored. Linkage (`taskRef`) stays deferred to v0.1 |
| `validate` claimed "never throws" but dereferenced `tracker.programs` | made defensive |
| Dogfood: a fresh worker could not answer "why does each program exist" | the portfolio table now renders a **Purpose (why it exists)** column, projected from the canonical tracker (not the seed) |

## 1. What v0 is, in one sentence

A **decomposition seed** keyed by existing `MP-xx` program IDs, plus a **reference-integrity
validator** and a **generated portfolio view**, living in `omega-baseline/` (the only buildable
workspace — there is no root `package.json`).

It owns **no program meaning and no execution/proof state**. Plan resolution and evidence state are
*derived*, not stored. A missing program key fails validation; a `maturityHint` that disagrees with
the derived plan resolution **warns** and names both values.

## 2. Scope — what v0 proves, and what it explicitly does not

v0's honest claim is narrower than rev 1's. v0 proves:

- six banned meaning keys are rejected (strict schema);
- every seed program key exists in `meta-tracker.json`;
- intra-seed gate references resolve (a deliberately dangling ref fails);
- the first-five roadmaps render into a portfolio view without restating program meaning.

v0 does **not** prove the Ratchet foreign-key half of the non-duplication contract, because
`workPackages` is cut (§3.1) and no honest work package exists yet for the first-five accelerators
(they are accelerator programs, not D1 product tasks). That half is deferred to v0.1, when a program
is actually scheduled. This is stated so nothing reads as proven that is not.

## 3. Data model

### 3.1 The one new editable seed — `.project/pm/data/programs.json`

```jsonc
{
  "schema": "vomega-pm/0",
  // NOTE: no sourceHead here. Provenance is generated (see §4), never hand-edited.
  "programs": {
    "MP-21": {                                     // key MUST exist in meta-tracker.json
      "maturityHint": "SEEDED",                    // optional; mismatch with derived value WARNS
      "phases": [
        {
          "id": "MP21-P1",
          "name": "Source inventory + identity",
          "outcome": "SourceAnchor, content digest, file/symbol/plugin/schema/test identities, provenance classes",
          "effort": "E2",                          // grade STRING verbatim; ranges like "E4–E5" survive
          "loc": { "band": "M", "range": [600, 1100], "confidence": "LOW" },
          "blockedBy": [],                         // GATE refs only (e.g. ["MP21-G1"])
          "softDeps": [],                          // informational program/phase refs; NOT blocking
          "exitGates": ["MP21-G1"],
          "needsReview": false                     // true where a rule requires a decomposition review
        }
      ],
      "gates": [
        {
          "id": "MP21-G1",
          "statement": "repeated scan yields stable deterministic identities",
          "proof": "TBD",
          "consumers": ["MP21-P2", "MP54-P2", "MP60-P2"],  // phase OR gate refs
          "status": "TBD"                          // TBD | OPEN | SATISFIED | REGRESSED | SUPERSEDED
        }
      ],
      "gaps": [
        { "id": "MP21-GAP-1", "kind": "open-question", "statement": "..." }
      ]
      // workPackages: CUT from v0 (see §2). Returns in v0.1 with a resolvable tasks[].id.
    }
  }
}
```

Schema rules (strict parsing — unknown keys are rejected, not ignored):

- Banned keys anywhere: `name`, `explanation`, `objectives`, `purpose`, `state`, `priority`.
  **Limitation (stated honestly):** this is a *name-based* blacklist. A meaning field smuggled under
  `rationale`/`description` would pass; the guard is name-based, not semantic. A semantic check is
  out of scope for v0.
- Every `programs` key must match an `id` in `meta-tracker.json`.
- `blockedBy` and `exitGates` refs must resolve to a **gate** in the seed (cross-program refs use the
  producer's `MPxx-Gn` ID). `consumers` may resolve to a phase **or** a gate.
- `softDeps` are never required to resolve — they record the honest-but-weak dependency the audit
  found (e.g. an MP-67 dependency that has no gate yet) without pretending it is a gate.
- No `workPackages` key in v0.

v0 ships the seed populated for the **first five** (`MP-21/54/55/56/60`) from `FIRST-FIVE-SEED.md`,
carrying the audit's defects as explicit `gaps`/`needsReview` (§6), and leaves the other 62 programs
absent (⇒ derived REGISTERED).

### 3.2 Derived state — two dimensions, never collapsed

`SYSTEM-DESIGN.md` §9 already forbids collapsing plan state and proof state. So v0 derives **two**
attributes instead of one "maturity" value (this replaces the seed design's single maturity enum;
recorded as a design change with lineage):

**`planResolution`** (linear, plan-side — highest predicate that holds):

| Level | Mechanical predicate |
| --- | --- |
| `REGISTERED` | no seed entry, or an entry with no phases |
| `SEEDED` | `phases.length > 0` but not all phases are complete |
| `PHASED` | `phases.length > 0` **and every phase** has `effort` + `loc` + ≥1 `exitGate` |
| `DECOMPOSED` | `PHASED` and ≥1 work package *(unreachable in v0)* |
| `EXECUTABLE` | `DECOMPOSED` and ≥1 work package with a resolvable `taskRef` *(unreachable in v0)* |

"Rough" is eliminated: a phase is either complete by the mechanical test or it is not. `DECOMPOSED`
and `EXECUTABLE` are distinguished solely by the presence of `taskRef` — and both are unreachable in
v0, which is honest rather than pretending.

**`evidenceState`** (evidence-side — independent of plan resolution):

| State | Mechanical predicate |
| --- | --- |
| `UNPROVEN` | no evidence event, or only non-proof events |
| `EVIDENCED` | ≥1 evidence event with `kind === "proof"` |
| `REGRESSED` | an evidence event of kind `regressed` *(vocabulary reserved; unused in v0)* |

`EVIDENCED` (not `PROVEN-SLICE`) avoids colliding with META-TRACKER's state vocabulary. Execution
state (`OPEN`/`CLAIMED`/`BLOCKED`/`PROVEN`/`DONE`/`REGRESSED`) is **referenced from Ratchet**, never
derived or stored here.

### 3.3 Evidence events (minimal provenance)

`.project/pm/data/evidence-events.json` — append-only `{program, gate?, date, kind, ref}` where
`kind ∈ {source-inspected, prototype-landed, dependency-changed, proof, regressed}`. Only `proof`
promotes `evidenceState` to `EVIDENCED`. Empty in v0 except events recon produced.

## 4. Components (the whole of v0)

| Path | Role |
| --- | --- |
| `.project/pm/data/programs.json` | the only new editable seed (first five populated) |
| `.project/pm/data/evidence-events.json` | append-only provenance events (may be empty) |
| `omega-baseline/experimental/pm/src/schema.ts` | strict zod schema + referential-integrity rules |
| `omega-baseline/experimental/pm/src/derive.ts` | `planResolution` + `evidenceState` functions |
| `omega-baseline/experimental/pm/src/project.ts` | read-only projector → portfolio.md/.json |
| `omega-baseline/experimental/pm/src/check.ts` | validator CLI; non-zero on dangling ref or unknown key |
| `omega-baseline/experimental/pm/test/pm.test.ts` | `bun test` coverage + fixtures (§8) |
| `.project/pm/generated/PORTFOLIO.md` + `portfolio.json` | generated; carry `sourceHead` + `seedDigest`; never hand-edited |
| `omega-baseline/package.json` (existing) | add `pm` and `pm:check` scripts |

Six new files + one generated pair. `sourceHead` and `seedDigest` exist **only** in `generated/*`.

## 5. What v0 must prove (bootstrap prompt's 10 required capabilities)

1. ingest/reference all 67 canonical programs — projector reads `meta-tracker.json`; every ID appears
2. expose explanation/objectives/vision contribution per program — **by reference**, never restated
3. distinguish intentionally-TBD from phased — derived `planResolution`
4. represent the first-five roadmaps — phases, outcomes, effort grade strings, LOC bands + confidence, gates
5. validate broken/unknown references — `pm:check` non-zero on a dangling gate ref or unknown key
6. human-readable portfolio/program/dependency view — `generated/PORTFOLIO.md`
7. machine-readable representation — `generated/portfolio.json`
8. reference Ratchet/task proof state without duplicating — `pm:check` reads
   `.project/evidence/d1-ratchet.json` **live** and prints a one-line reference (gate counts + head);
   nothing is stored in the projection, so it cannot fork ratchet state. Foreign-key **linkage**
   (`taskRef`) remains deferred to v0.1 (§2) — reference works, linkage does not yet
9. preserve source HEAD/provenance — generated `sourceHead` + `seedDigest`
10. pass independent review — `PMC-TRU` reviews the implementation, not just the proposal

## 6. Known gaps carried, not silently fixed

Recorded in the seed (`gaps` / `needsReview`), not hidden:

1. **TraceRef↔EntityRef/SourceAnchor mapping is unowned** (`PMC-DEP` MATERIAL) → MP-56/MP-60 `gaps`.
2. **MP-60 P5 graded `E4–E5` without the EVOLUTION-RULES §7 decomposition review** → `needsReview: true`
   on that phase (grade preserved verbatim as `"E4–E5"`).
3. **9 of 25 phases have no exit gate** → allowed as `exitGates: []`; projector flags ungated phases.
4. **Parallelization diagram omits MP-55 P3→MP21-G3** → recorded as a `gap` on MP-21/MP-56; per-program
   tables taken as truth.
5. **Soft/program-level deps (incl. MP-67) bypass the gate rule** (`PMC-DEP` MINOR) → modelled as
   `softDeps[]`, recorded as the fifth gap.

## 7. Review, migration, versioning

- **Review:** `PMC-TRU` independently reviews the implementation against §5 and the non-duplication
  contract; review is a step by a slot that did not write the code.
- **Versioning:** `schema: vomega-pm/0`; a bump is a recorded change with reason and lineage.
- **Migration:** none — nothing pre-existing is modified except adding two npm scripts.
- **Regeneration:** `generated/*` is always regenerated from `meta-tracker.json` + seed + events;
  hand-edits are a detected error, not a source.

## 8. Falsifiers, and the fixtures that exercise them

| # | Falsifier | Runnable test shipped in v0 |
| --- | --- | --- |
| 1 | `pm:check` must fail on a dangling **gate** ref | fixture seed with a phantom `MP21-G999` → expect non-zero |
| 2 | `pm:check` must reject a banned meaning key | fixture seed adding `purpose` → expect non-zero (strict parse) |
| 3 | a `kind:"proof"` event must yield `EVIDENCED` | fixture event file → expect derived state `EVIDENCED` |
| 4 | `planResolution` must be total and unambiguous | table test over one shape per level; assert exactly one level per shape |
| 5 | a future worker's fixed query set answers faster from the portfolio than from the docs | **not runnable in v0** — must be measured in Wave D dogfood or the falsifier is cut |

Falsifier 5 is kept as an explicit *deferred measurement*, not claimed as passing.

## 9. Explicitly deferred (not v0)

Register-as-parallel-authority; stored execution/proof status; per-program estimates for the 62
uninspected programs; `workPackages`/`taskRef` linkage (v0.1); UI/dashboard; SQLite; task generation;
atomic-task integration; context bundles; impact graph; Ratchet spec emission. Each waits for evidence.

## 10. Next action

Claim v0 in `STATUS.md`/`COMMONS.md`, implement §4, run `pm:check` + `bun test`, then obtain the
`PMC-TRU` implementation review in §7. Nothing is frozen until that review lands.

## 11. Independent review record (rev 1)

`PMC-TRU`, 2026-10-06, bounded read-only pass. Verdict: **accept-with-changes**. Ten required changes,
all applied in rev 2 (see §0). The reviewer's sharpest points, preserved:

- the stored review-HEAD was the exact rot instrument the design had proposed to drop;
- the schema could not represent two of the four defects it claimed to carry;
- effort ranges (`E1–E2`, `E4–E5`) were silently truncated to a single value;
- "validator fails on seed/tracker disagreement" was false as designed (only warn);
- maturity derivation was neither total nor unambiguous (DECOMPOSED/EXECUTABLE collapsed; "rough" undefined);
- v0 had cut `workPackages` and evidence events such that its headline Ratchet-linkage claim was vacuous.

Optional suggestions adopted: rename the derived level to `EVIDENCED`; keep the "answers faster than the
docs" test as a deferred measurement rather than a claimed pass.
