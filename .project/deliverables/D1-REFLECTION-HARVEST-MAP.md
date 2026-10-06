# D1 Phase F ↔ Reflection Migrator harvest map

Claim class: **harvest disposition / integration design**  
Date: 2026-10-06  
Scope: D1-055…D1-059B only

The Reflection Migrator already implements a source-bound inventory, structural fact
extractor, graph and parser-free query layer. D1 Phase F must harvest that work instead of
creating a second general Reflection parser or identity universe.

Current shared substrate:
`omega-baseline/experimental/reflection-migrator/`

Current D1 Phase-F seam:
`omega-baseline/experimental/d1/src/reflection.ts` +
`omega-baseline/experimental/d1/src/help.ts`

The shared Migrator's MP21-P1/P2/P3 implementation is **verified-local but not independently
promoted**. Its graph shape is explicitly not frozen. D1 is therefore a real consumer and
falsifier, not a license to treat the current graph as product law.

## Disposition by D1 task

| D1 task | Shared mechanism to harvest | Disposition | Required adaptation / boundary |
| --- | --- | --- | --- |
| D1-055 extraction boundary | Migrator classification, explicit extraction scope and opacity-as-output discipline | **ADAPT** | D1 has a narrower declaration-scoped input boundary. Keep it explicit rather than expanding D1 to the whole repository just because the Migrator can scan it. |
| D1-056 source anchor / content digest | Migrator `SourceAnchor` identity, file `contentHash`, symbol `spanHash`, revision lineage | **ADAPT / WRAP** | D1 declaration JSON may need JSON-pointer addressing. Preserve one source identity lineage; add an adapter field rather than minting unrelated identities. |
| D1-057 extractor | Migrator extraction pipeline, provenance discipline, explicit unknowns/conflicts | **WRAP / ADAPT** | D1 fact *kinds* (capability/parameter/realization/action/consequence/evidence/semantic-type) and Migrator epistemic *claim classes* are orthogonal dimensions. Do not collapse them. |
| D1-058 graph | Migrator serialized graph + parser/Git/filesystem-independent `src/query.ts` | **ADAPT** | D1 may project a smaller consumer view, but refs should resolve through the same shared identity substrate wherever possible. |
| D1-059 contextual help | `loadGraph`, `resolve`, `filesOf`, `explain` style queries | **WRAP** | Help joins Reflection + current World + active semantic handles. Help must not parse source or become an authored authoritative capability database. |
| D1-059A drift grounding | revision/content digests, anchor lineage, graph reconstruction | **REUSE / ADAPT** | Source/declaration change must alter/invalidate the dependent help claim. Do not silently serve a stale explanation. |
| D1-059B gaps | Migrator `unknowns`, conflicts and explicit "not extracted" surfaces | **REUSE** | Missing structure stays missing/unknown. No model-generated completion becomes structural truth. |

## Critical semantic mismatch to preserve

The current D1 stub uses:

```ts
claimClasses: [
  "capability", "parameter", "realization", "action",
  "consequence", "evidence-class", "semantic-type"
]
```

Those names are **fact families**, not epistemic proof classes.

The shared Migrator uses classes such as:

- `PROVEN_STRUCTURAL`
- `DECLARED`
- `INFERRED_SAFE`
- `COMMENTARY`
- `CONFLICT`

A correct integration carries both:

```text
what kind of fact is this?
×
what epistemic basis supports it?
```

Do not rename one dimension into the other.

## Consumer rule

D1 may request missing graph/query relations from the shared Migrator as consumer feedback.
It should not answer a missing query by installing its own general TypeScript parser.

The preferred flow is:

```text
source/declaration
→ shared source identity + provenance
→ shared or adapted structural graph
→ D1 bounded consumer view
→ World/session join
→ contextual help
```

This makes D1 a second-use test for MP-21 rather than a fork.

## Non-authority boundary

Reflection remains descriptive. Neither the shared graph nor D1 help may establish:

- current availability;
- selected Account authenticity;
- authority/consent;
- execution success;
- evidence maturity;
- live-provider proof.

Those require current World/evidence/authority sources.

## What remains implementation work

This document deliberately does **not** turn the Phase-F gates green.

The next coding worker must still:

- implement D1's adapter/extractor/query integration;
- prove stable source binding;
- implement the graph consumer path;
- make source removal/drift invalidate help;
- prove gaps stay explicit;
- run the D1 gates and obtain independent review.

No additional design document is required unless implementation exposes a concrete semantic
mismatch not covered here.
