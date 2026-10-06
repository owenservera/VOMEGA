# D1 Midstream Correction Addendum — Reflection/Wiki Scope and Parallel Workstreams

Status: **HISTORICAL MIDSTREAM CORRECTION — REQUIREMENTS FOLDED INTO PRIMARY D1 DOCS**  
Date: 2026-10-06  
Applies to: `.project/deliverables/D1-START-HERE.md`, `D1-FIRST-RELEASE-SPEC.md`, and `D1-ATOMIC-TASKS.md`

## Current standing

This document is retained as provenance for the correction. The Reflection/Migrator requirements and parallel-workstream sequencing correction have now been folded into `D1-START-HERE.md`, `D1-FIRST-RELEASE-SPEC.md`, and `D1-ATOMIC-TASKS.md`. A resumed executor should read the primary D1 documents; this addendum explains why those requirements exist.

## Purpose

Continue the current D1 build. Do **not** restart it.

This addendum corrects one underspecified part of D1 and one sequencing implication.

The governing Meta Tracker defines the first major internal checkpoint as a convergence of the simulator/product twin **plus a minimal Reflection / Reflection Graph / Wiki / Migrator slice**. The original D1 pack reduced that requirement too far into generic semantic help metadata.

The intent of this correction is therefore:

1. preserve all useful D1 work already completed or underway;
2. add the missing minimum source-bound self-knowledge path;
3. keep live Provider/Account work independent and parallel rather than treating it as a serial “D2” after D1;
4. preserve the actual next core product convergence: the first real Floating Command Box release.

This document overrides narrower wording in the D1 pack where there is a conflict. It does not otherwise broaden D1.

---

## 1. Keep the existing D1 mission

The primary D1 proof remains:

```
blank synthetic Ω
→ register synthetic Claude Work
→ register synthetic Claude Personal
→ ordinary-language prompt request
→ truthful Account ambiguity
→ resolve by text or click
→ same semantic command digest
→ READY only when valid
→ contextual explanation
→ governed virtual execution
→ explicitly SIMULATED prompt.send
→ simulated evidence
→ deterministic replay
```

Do not discard or rewrite working implementation merely to accommodate this addendum.

---

## 2. Correction: contextual help must exercise minimal Reflection

The previous D1 wording allowed contextual help to be generated directly from semantic registry/World metadata.

That is insufficient for the integration checkpoint defined in `.project/META-TRACKER.md`.

For D1 completion, the contextual Wiki/help path must minimally exercise:

```
actual D1 source / structural declarations
→ source-bound extraction
→ minimal Reflection descriptor/graph
→ join with active World / interpretation state
→ contextual Wiki/help projection
```

The point is **not** to finish the full self-description program.

The point is to prove that at least the D1 capability slice can explain itself from source-bound structural truth rather than from a separately authored help database.

### Minimum Reflection scope

Only the structures necessary to explain the D1 journey are required.

At minimum, extract or derive source-bound structural records for:

- `prompt.send` capability;
- its required parameters/slots;
- the D1 virtual realization;
- relevant Provider/Account semantic types;
- relevant consequence/evidence semantics;
- the semantic action(s) used by the UI for Account selection;
- source anchors/digests sufficient to bind those records to actual D1 implementation artifacts.

Do not require all 24 existing plugins to migrate.

Do not require a final Reflection ABI.

Do not promote a D1 extraction format into constitutional architecture.

---

## 3. Correction: add a minimal Reflection Graph

D1 must have a small read-only graph or equivalent structural representation that can answer the D1 explanatory questions from extracted/source-bound facts.

Minimum useful relationships include the equivalent of:

- Capability → parameters;
- Capability → realization;
- Capability → consequence/effect metadata;
- realization → evidence class;
- semantic action → affected semantic field;
- structural item → source anchor/digest.

Exact graph schema is open.

The graph is descriptive only.

It must **not** grant:

- authority;
- availability;
- live Provider truth;
- Account authentication;
- proof maturity beyond its evidence.

Description ≠ authority ≠ availability ≠ proof.

---

## 4. Correction: include a bounded Migrator/extractor slice

The D1 checkpoint should exercise MP-21 at MVP scale.

Implement the smallest read-first extraction/migration utility necessary to:

1. inspect the D1 source/structural declarations;
2. extract structurally provable Reflection facts;
3. attach source anchors/digests;
4. report missing or ambiguous reflection facts;
5. emit the minimal Reflection representation consumed by D1 help/Wiki;
6. avoid silently editing unrelated source or manifests.

This may be a script, build step, test utility, or bounded runtime component.

It must be safe and deterministic enough to rerun.

It must not fabricate missing semantics.

If the extractor cannot prove a claim from source/declared structure, the claim remains missing/unknown or is supplied by an explicitly classified authored semantic record—not inferred into truth.

---

## 5. Correction: contextual Wiki acceptance criteria

The D1 contextual help/Wiki must now satisfy all of these:

- It explains `prompt.send` using the minimal Reflection representation.
- It can point back to a source-bound structural identity/anchor for the capability.
- It explains the relevant required fields without maintaining a parallel hand-authored parameter list.
- It joins Reflection with current World/interpretation state to explain why two Accounts create ambiguity.
- It explains consequence/evidence state without conflating those with authority.
- It explains `SIMULATED` from actual execution/evidence metadata.
- If the reflected capability/parameter/realization is removed or invalidated at source, the generated current help changes or fails honestly.
- A renderer/theme/icon change cannot alter reflected semantic facts.
- Model-generated prose, if used, may summarize grounded claims only; it cannot invent capability, Account, authority, availability, or evidence facts.

A hardcoded FAQ that happens to contain correct prose does not satisfy D1.

---

## 6. Add these tasks to the active D1 backlog

Do not renumber or invalidate existing completed D1 tasks. Append these tasks or their implementation-equivalent.

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-055 | Define minimal D1 Reflection extraction boundary | D1-010,D1-024 | Exact D1 structural inputs and allowed claim classes documented/tested |
| D1-056 | Add source anchor/content digest mechanism for D1 reflected items | D1-055 | Same source produces stable binding; changed source invalidates/changes binding |
| D1-057 | Implement read-only D1 Reflection extractor/Migrator slice | D1-055,D1-056 | Extracts D1 capability/parameter/realization/action facts; no fabricated claims |
| D1-058 | Materialize minimal Reflection Graph | D1-057 | D1 semantic structures and source anchors queryable/read-only |
| D1-059 | Drive contextual Wiki/help from Reflection + World + active semantic handles | D1-051,D1-058 | D1 help has no parallel authoritative capability/parameter truth |
| D1-059A | Add source-removal/structural-drift grounding test | D1-059 | Removing/changing reflected structure changes/fails help honestly |
| D1-059B | Record extraction gaps explicitly | D1-057 | Missing structural facts appear as missing/unknown, not model inference |

Existing D1-050 through D1-054 remain useful, but should be interpreted as the **projection side** of this source-bound path rather than a standalone help subsystem.

If some of these outcomes already exist because the implementation organically went further than the original task wording, record the evidence and mark the corresponding added task done rather than reimplementing it.

---

## 7. D1 completion gate correction

Add the following to the D1 Definition of Done:

> The D1 capability slice is minimally self-describing: source-bound structural truth for the D1 command/capability path is extracted into a read-only Reflection representation, and contextual Wiki/help is projected from Reflection joined with current World/interpretation state. No separately authored Wiki database is required for the D1 journey.

And add these automated proof gates:

1. Source-bound reflected identities/digests are deterministic.
2. Reflection extraction is read-only for unrelated product source.
3. Removing or changing a required reflected structural fact invalidates or changes the corresponding help claim.
4. Reflection does not grant authority, availability, Account authentication, or evidence maturity.
5. D1 Wiki/help still passes the original semantic grounding tests.

---

## 8. What this correction does NOT add to D1

Do **not** expand D1 into:

- full repository Reflection;
- migration of every plugin;
- final Reflection ABI;
- full self-knowledge engine;
- live browser/provider observation;
- authenticated real Accounts;
- real provider submission;
- Windows installer;
- durable Work;
- Forge;
- Canvas;
- generalized healing.

The scope remains the smallest executable integration checkpoint that exercises the relevant program boundaries honestly.

---

## 9. Important sequencing correction: live Provider work is parallel, not “the next deliverable”

Do not interpret the original D1 “After D1” section as a mandated serial roadmap.

The Meta Tracker explicitly defines an **independent live-reality path**:

```
MP-41 live-proof protocol
→ MP-25 read-only browser transport + Account identity
→ MP-31/32 consent + attempt/evidence envelope
→ MP-28 real prompt.send
```

This work may proceed in parallel with D1 when capacity and owner constraints allow.

It must not block the simulator/product twin.

The simulator must not be reported as live provider proof.

The live Provider path is a proof/workstream feeding the product, not by itself the next core product deliverable.

---

## 10. Product convergence after D1

The next core product convergence remains:

**MP-02 + MP-03 — the actual First Product Release / Floating Command Box and its end-to-end product journey.**

That product release should integrate evidence from multiple workstreams, including:

- D1 semantic simulator/product-twin work;
- minimal Reflection/Wiki work;
- independent real Provider/Account proof;
- authority/evidence semantics;
- real product surface;
- local persistence/restart continuity;
- packaging/installability;
- Truth/release evidence.

Do not serialize these into a simplistic subsystem ladder unless evidence demands it.

The project rule remains:

> Track the whole destination; execute only the next evidence-bearing slice.

---

## 11. Midstream instruction to the current builder

Continue from your current state.

1. Do not reset, revert, or restart D1.
2. Identify which new Reflection/Migrator outcomes are already implicitly satisfied.
3. Add only the missing work.
4. Preserve useful current branches/worktrees/commits.
5. Keep the D1 simulated/live boundary unchanged.
6. Keep architecture choices provisional.
7. Update the D1 evidence summary to state explicitly how MP-18, MP-19, MP-20 and MP-21 were exercised.
8. Complete D1 only when both the original gates and this addendum's gates pass.

If this addendum conflicts with an implementation detail, preserve the proof obligation and choose the smallest coherent mechanism.

If it conflicts with an invariant, evidence, or newer owner decision, the higher-authority source wins and the conflict must be recorded rather than silently resolved.

