# Second pass: source-first controls and go/no-go

**Scope:** this is a technical audit/implementation increment to the dogfood track, not a replacement Elephant architecture and not a retroactive modification of active ZAI rounds.

| Prior gap | Second-pass remedy | Remaining limitation |
| --- | --- | --- |
| Missing source custody | Recovered two originals and verified curated 191-file portable subset | Original workspaces contain private state; owner must explicitly hand off curated bundle |
| Mixed documentation/executable registry | Per-file hashes + 11-family SOURCE_INDEX in handoff; actual mock baseline established | Source index is in private handoff ZIP, not GitHub mirror |
| Directory `inventory.mjs` didn't hash every child | Separate exact-manifest `source-preflight.mjs` rejects missing, altered or extra files | `inventory.mjs` remains a low-cost discovery scan, not custody proof |
| Claimed reusable tool without real baseline | Claude kernel mock suite independently replayed: 32/32 pass | Not live LLM / Elephant evidence |
| Unbounded proposed experimental arms | Gate D1/D2/D3 behind observed D0 and failure reproduction; separate ZAI streams with isolated snapshots | Four-arm experiments and actual model sessions not launched |
| Exports only understood by original conversation | One portable source seed archive, explicit PIN/SHA, README, prompt, JSON evidence and startup commands | External session must receive actual ZIP; link to GitHub docs alone is insufficient |
| Every-turn publication specified but not operationally demonstrated | Mandatory turn-close portfolio remains inherited; require external fresh-agent replay test | No genuine stream turn published yet |

## Minimum first development gate
An independent ZAI stream obtains the exact private handoff; validates ZIP SHA and manifest pin; runs the synthetic D0 suite; inventories every source family; declares a bounded D1 hypothesis; and publishes its complete turn portfolio with real immutable artifact references. Without those proofs the status remains PREPARED/NOT_LAUNCHED.

## Split product evolution from framework self-improvement
- **Product capabilities:** NL→command interpretation, source corpus, runtime execution/consent, visual feedback and bounded UI.
- **Elephant support capabilities:** journal/capsule memory, context continuity, source inventory, provenance, pack discovery/replay and peer exchange.
- **Research capabilities:** fitness tests, lineage, honest introspection, E0/E1/E2 controls and independent adjudication.

Do not count support infrastructure as MVP user functionality. Demand a measured consumption path: which existing task got more correct, faster, cheaper or more reproducible? Every pack gets a concrete reuse target and falsifier. Architectural independence remains intact; self-hosting must not favor O1 or Claude a priori.
