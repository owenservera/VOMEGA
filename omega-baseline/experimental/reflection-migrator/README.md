# Reflection Migrator (MP-21)

Read-only tooling that turns the Ω source tree into source-bound, reproducible self-knowledge.
Program dossier and phases: `.project/pm/generated/PROGRAMS/MP-21.md`. Design seed:
`seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`. This is development machinery and a
hypothesis, not Ω architecture.

## State

| Phase | State | Gate |
| --- | --- | --- |
| MP21-P1 Source inventory + identity | implemented, awaiting independent review | MP21-G1 not yet marked satisfied |
| MP21-P2 Structural extraction | not started | MP21-G2 |
| MP21-P3 Reflection Graph + query API | not started | MP21-G3 |

Gate status lives in `.project/pm/data/programs/MP-21.json` and changes only after a reviewer
who did not write the code has checked the evidence.

## Use

From `omega-baseline/`:

```sh
bun run reflect verify                              # MP21-G1 check: two scans identical, anchor ids unique; exit 0/1
bun run reflect inventory --out ../.local/reflection/inventory.json
bun run reflect inventory --rev <commit> --scope omega-baseline
bun run reflect:test
```

A scan reads Git objects at `--rev`, never the working directory. Uncommitted edits are
therefore invisible to it by design; commit first, or the scan describes the previous commit.

## P1 decisions

These answer the three open questions the dossier left on MP21-P1.

**Identity.** A `SourceAnchor.id` is `<kind>:<path>#<symbol>` and nothing else. Commit,
`contentHash` (whole file), `spanHash` (the symbol's own text) and line `range` describe the
observed version. Shifting lines, editing another symbol, reordering manifest contributions or
moving to a new commit leaves every id unchanged; `spanHash` tells a consumer whether the
symbol itself changed. A file move does change the id of its declarations: path-independent
identity for plugins, contributions and operations is the EntityRef, which is P3 work.

**Parser (REF-01).** The TypeScript compiler's parser, syntax only (`createSourceFile`,
`parseJsonText`), pinned at 5.9.3 as a dev dependency. `Bun.Transpiler.scan` was tried first
and rejected: it erases type-only exports, and the contracts surface is mostly interfaces and
type aliases. The same AST serves P2's op-registration and schema extractors.

**Surfaces classified now versus later.** P1 classifies by path only (`src/classify.ts`), plus
`plugin-entry`, which a manifest's own `entry` field names. Op registration, schemas, config
parsing, language frames and visual contracts are facts inside files and are left to the P2
extractors. Every file also carries a `role` (`source`, `test`, `fixture`) so fixture manifests
are never counted as product plugins.

**Unknowns.** Anything the scan cannot establish is listed in `unknowns` with a reason
(unparseable source, a manifest without an id, an `entry` naming a file outside the tree).

## Baseline at `10a8beb`

495 files in `omega-baseline/`; 45 `plugin.json` files, of which 27 are product manifests and
18 are test fixtures; 3,534 anchors (495 file, 221 manifest, 2,818 declaration); 0 unclassified
files; 3 unknowns, all fixture manifests whose `entry` file is deliberately absent.

## Limits

- `spanHash` starts at the declaration and excludes its leading comment, so a doc-comment edit
  changes `contentHash` but not `spanHash`.
- Only top-level declarations and export statements are anchored. Members, object-literal keys
  (such as `ops: { "x@1": … }`) and nested declarations are P2.
- No type checker runs, so re-exports are recorded by name and not resolved to their origin.
- Nothing here is a fact about behavior: an anchor says where a name is declared, not what it does.
