# Arm C acceptance criteria

The session goal was literally "Contiue", which states no requirement and cannot be
verified. This file fixes the bar: **Arm C is complete when `probe/verify-acceptance.mjs`
exits 0.** Every criterion below traces to a literal line of
[`RUN_C_WIKICORE_SELF_RUNTIME.md`](../../RUN_C_WIKICORE_SELF_RUNTIME.md) or
[`REVIEW.md`](../../REVIEW.md) — none are invented here.

```bash
node probe/verify-acceptance.mjs     # exit 0 = complete; non-zero names the failures
```

Criteria are marked **[EVIDENCE]** (checked against executed artifacts, a live
subprocess, or a JSON file a prior run produced) or **[TEXT]** (structural — weaker,
and labelled as such rather than dressed up as proof).

## R — REVIEW.md compact RUN NOTE contract (15)

All **14** template fields from `REVIEW.md:39–52` must appear in the run note using the
contract's own wording, not a paraphrase. R16 asserts this verifier enforces exactly the
fields REVIEW.md declares.

## M — Mission criteria (19)

| ID | Prompt line | Requirement |
|---|---|---|
| M1 | :11 | Repo commit pinned, and still matches live HEAD |
| M2 | :11 | Fixture pinned by blob + sha256 |
| M3 | :11 | Seed + fixture read; fixture actually compiled and executed |
| M4 | :13 | Proposes **operations**, not a schema/noun catalogue |
| M5 | :13 | No long verb list presented as approved; nothing ratified |
| M6 | :15 | Self-runtime thesis: what the compiler knows, evidence, unknowns |
| M7 | :15 | Boundary "I describe a capability" vs "I can execute it now" defined |
| M8 | :15 | No self-proof / omniscience overclaim |
| M9 | :17 | TWO competing vocabularies, separately implemented, both ran |
| M10 | :17 | No-protocol control retained as a genuine control |
| M11 | :17 | Symbol / explanation / relationship / contradiction all answered |
| M12 | :17 | Answers carry provenance, not bare values |
| M13 | :3 | Historical `?` and `=` compared to the new proposal |
| M14 | :19 | Tested and untested results explicitly labelled |
| M15 | :19 | Next observation that would falsify the **favoured** approach |
| M16 | :19 | Findings mapped to the Elephant capability pack |
| M17 | :21 | No ontology / plugin registry / persistence machinery |
| M18 | :21 | **No main edits** — HEAD unchanged, all output untracked |
| M19 | seed:12 | Blind-discovery exclusions disclosed, not silently relied on |

## X — Reproducibility (3)

X1 every TESTED numeric claim is present in the evidence JSON · X2 README gives exact
regeneration commands · X3 all run artifacts exist and are non-empty.

## What passing does and does not mean

**Means:** the run executed the Arm C mission, produced the contracted deliverable, and
every claim in it traces to regenerable evidence.

**Does not mean:** the three proposed operations (`exists`, `witnessed`, `enforced`) are
ratified canon. They are PROPOSED and require the Round 1 reviewer and the decision
tracker. M5 asserts the run does not claim otherwise.

## Known limits of this verifier

- 8 criteria are **[TEXT]** — string checks. They catch a missing field, not a
  dishonest sentence. M7 and M14 in particular confirm wording, not comprehension.
- **M19 is a disclosure check, not a proof of non-reading.** It confirms the note
  *declares* the exclusions; it cannot prove what entered the context window.
- The verifier is itself untrusted tooling. A future reviewer should spot-check rather
  than take 37/37 at face value — especially since this run's own harness produced
  three false results before being fixed (see "WHAT SURPRISED OR FAILED").