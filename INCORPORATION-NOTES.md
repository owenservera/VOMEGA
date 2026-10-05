# Incorporation notes — first-release roadmap pack

Date: 2026-10-05. Source: `.incoming/owen-attach-190120/` (owner attachment).
Repository HEAD at incorporation: `94a3bb0`. Nothing was committed.

## Outcome

The whole pack is on disk in the locations its own patch names, byte-identical
to the patch. No conflicts. Nothing in `seed-docs/` was touched, and no existing
`omega-baseline/` file was modified; the only baseline additions are one new
test file and one new fixture.

The pack was already unpacked into place when this session started. This
session verified it against the patch rather than re-applying it, then added
the pointers and this note.

## What landed where

| Pack file | Repository location |
| --- | --- |
| `README-2.md` | `.project/roadmap/README.md` |
| `ROADMAP-1.md` | `.project/roadmap/ROADMAP.md` |
| `TASKS.md` | `.project/roadmap/TASKS.md` |
| `BASELINE-HARVEST-ASSAY.md` | `.project/roadmap/BASELINE-HARVEST-ASSAY.md` |
| `PROOF-TRACEABILITY.md` | `.project/roadmap/PROOF-TRACEABILITY.md` |
| `WS-*.md` (8 loose files) | `.project/roadmap/workstreams/` |
| `WS-REL-release-lifecycle.md` (in the patch and zip only, not a loose file) | `.project/roadmap/workstreams/` |
| `release-use-corpus.test.ts` | `omega-baseline/plugins/vivim-nlcl/test/` |
| `release-use-corpus.json` | `omega-baseline/plugins/vivim-nlcl/test/fixtures/` |

Placement follows the patch. `.project/` is the right home because the roadmap
describes itself as an operational plan and revisable evidence, not seed intent;
`seed-docs/` stays reserved for the seed. The `-1` / `-2` suffixes on the loose
files are download artefacts; the patch gives the canonical names used here.

Edits made by this session:

- `.project/SITREP.md`: appended a "First-release roadmap update" section
  pointing to the roadmap and to this note. Existing text is unchanged.
- `.project/COMMONS.md`: added one row for this incorporation task.
- `INCORPORATION-NOTES.md`: this file.

## The patch

`VOMEGA-first-release-roadmap.patch` contains 16 new-file diffs and nothing
else: it does not modify any existing file.

- `git apply --check` (forward) refuses, only because every target file already
  exists in the working directory.
- `git apply -R --check` passes, which means every one of the 16 files on disk
  equals the patch's content exactly.

The patch was therefore not re-applied and nothing was forced. The nested zip
holds the same 16 files and was not extracted again.

## Corpus test wiring

The test and fixture sit in the existing `vivim-nlcl` test directory, which is
their clear home: the test imports the plugin's interpreter and Bun discovers
it without any configuration change.

Runs in this session, on Linux with Bun 1.4.2:

| Command (from `omega-baseline/`) | Result |
| --- | --- |
| `bun test plugins/vivim-nlcl` | 49 pass, 0 fail, 205 assertions, 2 files (31 existing + 18 corpus) |
| `bun run omega:quick` | 62 pass, 0 fail, 1,622 assertions, 7 files (unchanged from the SITREP figure) |

Known gaps in the corpus run as `test.failing` by design, so "0 fail" means
those cases still fail as expected, not that the release grammar is complete.
The corpus test is not part of `omega:quick`; it is reached by
`bun test plugins/vivim-nlcl`, `omega:test:plugins` and `omega:test`.

## Deferred

- **Roadmap adoption (task OPS-01).** The pack's README says two edits to
  existing truth were "intentionally not made": Commons rows for M0–M3, and
  replacing SITREP's prose "Next actions" with task IDs. They are still not
  made. All 74 tasks remain `open`, including CMD-02, whose corpus has landed
  but has not been independently reviewed.
- **Semantic test lane (task TRU-02).** No `omega:semantic` script was added
  and `omega:quick` was not widened; `package.json` is unchanged.
- **Windows re-verification.** The pack's README asks for the corpus to be
  re-verified on the Windows Bun 1.4.2 launcher before a claim is recorded.
  This session ran on Linux, so that check is outstanding and
  `evidence/bootstrap.json` was not updated.
- **Independent review.** `AGENTS.md` requires independent review for code
  changes. The corpus test is new code that this session ran but did not
  review; it is routed to the Truth room in the Commons row.
- **Broad suite.** `omega:test` / `omega:gate` were not run. Their known
  historical failures are neither affected nor repaired by this pack.
- **Commit.** All of the above is uncommitted.

## Things to know

- The roadmap README says it was derived from a baseline review "at commit
  `769544e`". That object does not exist in this repository (history is the
  single commit `94a3bb0`). The new files apply and the tests pass here, but
  line references in the assay were not re-checked against this tree.
- `.incoming/` is untracked and not ignored. It holds duplicates of everything
  above plus the patch and zip, so a `git add -A` would commit a second copy.
  It was left in place; delete it or ignore it before committing.
- The `.project/COMMONS.md` row for the Elephant Context Network plan and the
  `.daintree-prompts/` directory belong to other sessions and were not touched.
  `seed-docs/ELEPHANT-CONTEXT-NETWORK.md` is unmodified.
