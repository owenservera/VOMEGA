# Reflection Migrator (MP-21)

Read-only tooling that turns the Ω source tree into source-bound, reproducible self-knowledge:
an inventory with stable identities, a set of claim-classed structural facts, and a queryable
graph that other programs load instead of parsing source themselves.

Program dossier and phases: `.project/pm/generated/PROGRAMS/MP-21.md`. Design seed:
`seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`. This is development machinery and a
hypothesis, not Ω architecture. It never writes to source and never accepts its own output.

## State

| Phase | State | Gate |
| --- | --- | --- |
| MP21-P1 Source inventory + identity | implemented, verified locally | MP21-G1 awaiting independent review |
| MP21-P2 Structural extraction | implemented, verified locally | MP21-G2 awaiting independent review |
| MP21-P3 Reflection Graph + query API | implemented, verified locally | MP21-G3 awaiting independent review |
| MP21-P4 Gap + migration proposals | not started (Wave 2) | MP21-G4 |
| MP21-P5 Continuous compliance | not started (Wave 2) | MP21-G5 |

Gate status lives in `.project/pm/data/programs/MP-21.json` and changes only after a reviewer
who did not write the code has checked the evidence. "Verified locally" means the commands
below pass on this repository; it is not a claim about any other tree.

## Use

From `omega-baseline/`:

```sh
bun run reflect verify      # G1/G2/G3 preconditions: repeat scans identical at every layer; exit 0/1
bun run reflect:test        # 55 tests, including the three consumer scenarios
bun run reflect parity      # manifest ↔ runtime differences per plugin manifest
bun run reflect graph --out ../.local/reflection/graph.json

bun run reflect resolve providers.session.start@1 --graph ../.local/reflection/graph.json
bun run reflect impact  plugins/vivim-vault/src/db.ts --depth 2
bun run reflect deps    plugin:vivim.providers
bun run reflect tests   plugins/vivim-vault/src/db.ts --depth 1
bun run reflect find    op vault.
```

A scan reads Git objects at `--rev` (default `HEAD`), never the working directory. Uncommitted
edits are invisible to it by design; commit first, or the scan describes the previous commit.
The graph is a derived artifact (about 6 MB); build it into the ignored `.local/` directory
and do not commit it.

## For consumers (MP-54, MP-55, MP-60)

Import `src/query.ts` and give it a parsed `graph.json`. That module depends only on the
graph's types — no parser, no Git, no file system — so a consumer never needs a second parser.

```ts
import { loadGraph } from "../reflection-migrator/src/query.ts";
const ix = loadGraph(await Bun.file(".local/reflection/graph.json").text());

ix.describes                      // { repository, commit, scope } every answer refers to
ix.normalize("vault.get@1")       // "op:vault.get@1" — also accepts repo paths and plugin ids
ix.resolve(ref)                   // node, claims, edges in and out, resolved anchors
ix.filesOf(ref)                   // sorted paths behind an entity (basis for a bundle file set)
ix.impact(ref, { maxDepth })      // transitive dependents, nearest first, each with its edge
ix.dependencies(ref)              // the reverse direction
ix.affectedTests(ref)             // test files among the dependents
ix.explain(steps, target)         // the edge chain that reached a result
```

**Entity references** are `<kind>:<name>`:

| Kind | Example | Stable while |
| --- | --- | --- |
| `plugin` | `plugin:vivim.providers` | the manifest keeps its `id` |
| `op` | `op:vault.get@1` | the op keeps its id and version |
| `contribution` | `contribution:vivim.providers/contract:providers.registry@1` | plugin id, kind, id, version |
| `field` | `field:vivim.providers/schema:providers.registry-entry@1/status` | the field keeps its name |
| `frame` | `frame:<path>#message.send@1` | the frames file is not moved |
| `file`, `symbol` | `file:<path>`, `symbol:<path>#<name>` | the file is not moved or the name changed |
| `package`, `module`, `capability` | `package:@vivim/omega-contracts` | the name |

**Every edge and claim carries a claim class** (`PROVEN_STRUCTURAL`, `DECLARED`,
`INFERRED_SAFE`, `COMMENTARY`, `CONFLICT`) and its `SourceAnchor`s. An `INFERRED_SAFE` item
names one of the rules in `src/facts.ts` `RULES`. Nothing is ever emitted as suggested meaning.

**The graph shape is not frozen.** Schema `vomega-reflection-graph/1` was designed from the
MP-54/55/60 dossiers because no MP-60 P1 acceptance corpus existed yet. Relations a consumer
needs and cannot find should be requested here as a gap, not rebuilt elsewhere.

## Decisions

**Identity (P1).** A `SourceAnchor.id` is `<kind>:<path>#<symbol>` and nothing else. Commit,
`contentHash` (whole file), `spanHash` (the symbol's own text) and line `range` describe the
observed version. Shifting lines, editing another symbol, reordering manifest contributions or
moving to a new commit leaves every id unchanged.

**Parser (P1, REF-01).** The TypeScript compiler's parser, syntax only, pinned at 5.9.3.
`Bun.Transpiler.scan` was tried first and rejected: it erases type-only exports, and the
contracts surface is mostly interfaces and type aliases.

**Classification (P1).** By path only (`src/classify.ts`), plus `plugin-entry`, which a
manifest's own `entry` field names. Every file has a `role` (`source`, `test`, `fixture`), and
fixture manifests never produce plugin, op or contribution facts.

**Extraction scope (P2).** Extracted: manifest declarations, contributions and schema fields;
op registration in `definePlugin`; port calls; static imports; contract vocabularies and
interface shapes; language frames typed `OpFrame[]`; test files naming a known op. Listed in
the artifact as *not extracted*: config parsing, code-level schemas, visual contracts, semantic
registries, source comments, non-contract type shapes, dynamic imports. This answers the
dossier's open question on config: no mechanical rule separates a config key from any other
property read today, so config needs an explicit declaration before it can be extracted.

**Opacity is an output (P2).** A non-literal op, a spread in `ops`, or an unresolvable import
is listed in `unknowns` with its line. Two manifests that disagree produce a `CONFLICT` that
keeps both values.

**Dependency direction (P3).** `src/query.ts` `DEPENDENT_END` states, per relation, which end
is affected when the other changes. A test fails if the graph gains a relation the table does
not name, so a new edge cannot be silently ignored by impact queries.

## Findings at `65ecc7f`

These are facts the tool read, not judgments about what should change.

- 495 product-tree files; 27 product manifests and 18 fixture manifests; 26 distinct plugin ids.
- Two product manifests declare the id `vivim.law` (`plugins/law-stub` and `plugins/vivim-law`).
- 124 op declarations across the manifests (112 distinct ops): 93 registered by the same manifest's entry; 31
  declared with no registration in that plugin, all in the three packs, of which 7 are
  registered by another plugin. No op is registered without being declared.
- Ports: 51 requested and called, 6 requested with no call found, 10 called and not requested
  with a `port:` prefix (several are host ops the manifest requests without that prefix; no
  rule states the two spellings are equivalent, so they are not matched).
- 2 port calls whose op is computed at runtime (`vivim-agent`, `vivim-director`).
- `contentHash` is empty and the publisher signature is absent in every product manifest.
- `prompt.send` appears in no product manifest or registration.

## Limits

- `spanHash` starts at the declaration and excludes its leading comment.
- Only top-level declarations are symbols. Class members and nested functions are not.
- No type checker runs: re-exports are recorded by name, and an import of a workspace package
  becomes an edge to the package, not to the file that defines the imported name. Impact
  through a package is therefore an over-approximation.
- Impact is structural reachability, not proof that behavior changes. A test that reaches a
  plugin only at runtime (through a booted host) is not linked unless it names an op literally.
- `mentions-op` matches whole string literals only, in test files only.
- A file move changes the refs of its `file`, `symbol` and `frame` entities.
- The three consumer scenarios in `test/consumer.test.ts` stand in for MP-54, MP-55 and MP-60,
  which do not exist yet. They show the graph answers that kind of question from the
  serialized artifact alone; they are not those programs' acceptance tests.
