# LOCK-D-CANDIDATE — Reflection ABI read-only audit (SKW / SKW-L1)

Status: BOUNDED read-only increment. Source NOT modified. Budget: <=8 tool calls.

Basis:
- `seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md` (state: ACTIVE HYPOTHESIS, started 2026-10-05).
- `omega-baseline/plugins/*/plugin.json` (24 manifests; `vivim-nlcl-pure/` has no plugin.json).
- Deep reads: `vivim-nlcl`, `vivim-providers`, `vivim-mind`.

Classification tags: PROVEN_STRUCTURAL / DECLARED / INFERRED_SAFE / CANDIDATE_SEMANTIC / COMMENTARY / CONFLICT.

---

## (a) Plugin / declared-op inventory (from plugin.json)

Manifest shape (observed, all manifests): `manifestVersion:"1"`, `id` (dotted, e.g. `vivim.nlcl`),
`version`, `description`, `entry`, `publisher{keyId,signature}` (empty in baseline), `contributions{}`,
`dependencies[]`, `capabilities{requested[],justification}`, `runtime{tier,budget{cpuMs,memMB}}`,
`contentHash` (empty string in baseline).

Contribution kinds observed: `engine`, `contract`, `schema`.

| Plugin dir | manifest id | contribution kinds (ids) | requested ports | deps | anchor |
|---|---|---|---|---|---|
| discovery-healing | — | (not read) | — | — | `omega-baseline/plugins/discovery-healing/plugin.json` |
| discovery-inference | — | (not read) | — | — | `.../discovery-inference/plugin.json` |
| discovery-mapping | — | (not read) | — | — | `.../discovery-mapping/plugin.json` |
| discovery-observation | — | (not read) | — | — | `.../discovery-observation/plugin.json` |
| discovery-perception | — | (not read) | — | — | `.../discovery-perception/plugin.json` |
| discovery-verification | — | (not read) | — | — | `.../discovery-verification/plugin.json` |
| forge-author | — | (not read) | — | — | `.../forge-author/plugin.json` |
| law-stub | — | (not read) | — | — | `.../law-stub/plugin.json` |
| provider-browser | — | (not read) | — | — | `.../provider-browser/plugin.json` |
| provider-email-file | — | (not read) | — | — | `.../provider-email-file/plugin.json` |
| provider-llm | — | (not read) | — | — | `.../provider-llm/plugin.json` |
| vivim-agent | — | (not read) | — | — | `.../vivim-agent/plugin.json` |
| vivim-chat | — | (not read) | — | — | `.../vivim-chat/plugin.json` |
| vivim-credentials | — | (not read) | — | — | `.../vivim-credentials/plugin.json` |
| vivim-director | — | (not read) | — | — | `.../vivim-director/plugin.json` |
| vivim-intent | — | (not read) | — | — | `.../vivim-intent/plugin.json` |
| vivim-kernel-lens | — | (not read) | — | — | `.../vivim-kernel-lens/plugin.json` |
| vivim-law | — | (not read) | — | — | `.../vivim-law/plugin.json` |
| vivim-mind | `vivim.mind` | engine: `mind.snapshot@1`, `mind.query@1`, `control.bootstrap@1`, `control.describe@1`, `mind.portrait@1` | `port:law.registry@1`, `port:vault.query@1`, `port:vault.getmany@1`, `port:vault.verify@1` | `[]` | `.../vivim-mind/plugin.json` |
| vivim-nlcl | `vivim.nlcl` | engine: `nlcl.interpret@1` | `port:mind.snapshot@1` | `[]` | `.../vivim-nlcl/plugin.json` |
| vivim-nlcl-pure | (no plugin.json) | n/a | n/a | n/a | `omega-baseline/plugins/vivim-nlcl-pure/` |
| vivim-providers | `vivim.providers` | contract: `providers.registry@1` (READ), `providers.realization.get@1` (READ), `providers.session.start@1` (MUTATION); schema: `providers.registry-entry@1` (9 fields) | `port:vault.append@1`, `vault.get@1`, `vault.query@1`, `port:law.registry@1` | `contract:vault.append@1`, `vault.get@1`, `vault.query@1`, `law.registry@1` | `.../vivim-providers/plugin.json` |
| vivim-run | — | (not read) | — | — | `.../vivim-run/plugin.json` |
| vivim-steward | — | (not read) | — | — | `.../vivim-steward/plugin.json` |
| vivim-vault | — | (not read) | — | — | `.../vivim-vault/plugin.json` |

Rows marked "(not read)" are PROVEN_STRUCTURAL only at directory/manifest existence level; op-level
contents are out of this increment's read budget. Do not treat them as empty.

PROVEN_STRUCTURAL: op identity in manifests is `<id>@<version>`; engine contributions carry `doc`
prose but no typed risk ("engines declare no risk BY KIND"); `contract` carries typed `risk`
(READ / MUTATION; and see mind doc referencing EXTERNAL_MUTATION as recipe data).

---

## (b) Proposed Reflection node/edge representation (from §6, §7)

Node families (candidate): CorePrimitive, Plugin, Pack, Capability, Command, Contract, Engine,
Provider, Realization, Surface, Schema, Parameter, Configuration, SemanticConcept, State,
EvidenceKind, AuthorityRequirement, LanguageFrame, Parser, VisualRole, Interaction, Test/Falsifier,
SourceSymbol.

Mapping of the observed baseline manifest into the candidate graph:

- Plugin node ← manifest `id` + `version` + `description`.
- Contribution node: `engine`→Engine, `contract`→Contract, `schema`→Schema.
- Parameter nodes ← `schema.fields[]` (`name`,`type`,`required`).
- Edge `contributes` : Plugin → Contribution (from `contributions{}`).
- Edge `dependsOn` : Plugin → `dependencies[].ref` (`contract:*`, version `range`).
- Edge `requires` : Plugin → `capabilities.requested[]` (`port:*`).
- Edge `governedBy`/risk attribute : Contract.risk.
- Edge `sourceAt` : Contribution → SourceSymbol (design §8) — NOT present in baseline manifests.
- Edge `emitsEvidence`, `availableThrough`, `configuredBy`, `realizes`, `interpretedBy`,
  `testedBy`, `derivedFrom`: candidate; no baseline manifest field populates them.

Node identity recommendation: stable id = `<manifestId>:<contributionId>@<version>`; bind to
`contentHash` per §8. Baseline `contentHash` is empty → binding unproven.

---

## (c) Manifest ↔ implementation parity findings

1. PROVEN_STRUCTURAL — `plugin.json` is the only self-description at contribution level; it exposes
   identity/kind/version and (for contracts) risk, but not source anchor, semantic concepts,
   typed I/O for engine/contract kinds, authority requirement, evidence expectation, config
   surface, lifecycle, or examples.
2. PROVEN_STRUCTURAL — `contentHash` is `""` in all three deep-read manifests, so the §8 requirement
   "bind description to the exact loaded artifact/content hash" is UNMET at baseline.
3. PROVEN_STRUCTURAL — dual channel for consumed ports: `dependencies[]` (`ref:"contract:..."`)
   AND `capabilities.requested[]` (`"port:..."`). `vivim-providers` populates both in parallel;
   `vivim-mind` populates `requested` (4 ports) while `dependencies` is `[]`. Same plugin relies on
   two representations of what it needs → drift risk between the two lists.
4. CONFLICT (structural, not semantic) — `vivim-mind` requests `port:sdk.vault.verify@1`-class
   evidence ports and performs derivation with no declared `dependencies`, while `vivim-providers`
   mirrors the identical ports into `dependencies`. Consistency rule not enforced by manifest schema.
5. COMMENTARY / DECLARED — risk semantics split: engines have no risk by kind; risk is Contract
   data. `vivim.mind` doc asserts "risk is CONTRACT-kind data (sdk validator law)". This is a
   declaration in a `doc` string; the enforcement point is claimed in prose, not proven here.
6. CANDIDATE_SEMANTIC — `prompt.send` (the §26 canonical existing capability and the §5/§13/§14
   worked example) has NO `prompt.send` occurrence in any `omega-baseline/plugins/*/plugin.json`
   (grep empty). The design's anchor capability is aspirational relative to the baseline manifests.
   It must be sourced from a repo symbol/manifest update, not assumed present.
7. PROVEN_STRUCTURAL — `publisher{keyId,signature}` empty across deep-read manifests; provenance/
   generality evidence referenced in §23 is not populated at baseline.
8. INFERRED_SAFE — `runtime.tier` (`worker-thread`) + `budget` map to the §9 isolation/tier
   reflection node; safe as structural metadata only, grants nothing.

---

## (d) Minimal `prompt.send` graph fixture (candidate, no Wiki file)

Illustrative fixture shape for the first proof (§26), to be instantiated ONLY if/when a
`prompt.send` declaration exists in source. Not a claim of existence.

```
nodes:
  plugin:v
  capability:prompt.send@1   kind=Capability  title="Send a prompt"
  param:prompt.send@1:account  type=ref(account) required=true
  param:prompt.send@1:prompt   type=string        required=true
  concept:provider, concept:account, concept:external-transfer
  authority:externalMutation
  evidence:submission.attempted, submission.observed, response.observed
  source:pending>contentHash#promptSend
edges:
  plugin --contributes--> capability:prompt.send@1
  capability --accepts--> param:account
  capability --accepts--> param:prompt
  capability --requires--> authority:externalMutation
  capability --emitsEvidence--> evidence:submission.attempted
  capability --emitsEvidence--> evidence:submission.observed
  capability --emitsEvidence--> evidence:response.observed
  capability --relatedTo--> concept:provider, account, external-transfer
  capability --sourceAt--> source:pending>contentHash#promptSend
```

Every node above except plugin/capability identity is CANDIDATE_SEMANTIC and requires a real
declaration + content hash before it may be presented as PROVEN_STRUCTURAL.

---

## (e) Completeness gaps vs §11 gate

- Routable completeness — engine/contract ids exist, but no manifest field proves each routable op
  has a reflection node; UNPROVEN.
- Parameter completeness — only `schema` kind exposes typed fields; engine/contract params live in
  `doc` prose only; schema-not-reused-at-runtime is unverifiable read-only.
- Configuration completeness — no config-key surface in manifests; §9 config exists as prose inside
  `vivim.mind` description; UNPROVEN.
- Capability completeness — `requested[]` present; provided capabilities only implied by ids;
  linkage UNPROVEN.
- Effect completeness — risk only on Contract; engine effects absent; PARTIAL.
- Evidence completeness — no `evidence`/expected-evidence field anywhere; UNPROVEN.
- Source completeness — no symbol/range/hash populated (`contentHash:""`); UNPROVEN.
- UI completeness — no surface/interaction contribution kind observed; UNPROVEN.

Downstream implication: baseline manifests satisfy Phase A only partially. §23 Phase A (derive from
what exists) is feasible for Plugin/Contract/Engine/Schema/Parameter/deps/requested; Phases B–E
(source anchors, typed semantics, code-first, completeness gate, Forge enforcement) are OPEN.
