# Elephant Lab R0/R1 Static Cleanup — Observed Results

**Date:** 2026-10-11. **Frozen source:** `ecd015c38b9d7e1e3b0946119e6e32119bd03b4a`. **Scope:** only `elephant-greenfield-omega/`; no edits or proposed cleanup outside this folder. **Method:** GitHub recursive Git tree + inspection of 16 first-level/track entry markdown documents and their local link targets. No live Z.ai or local Windows process introspection.

## R0 — static source census (completed)

- **396 Git-tracked files** under the lab at the frozen HEAD; **186 Markdown** and **111 JSON**.
- **58 duplicate groups with nonempty content** across Git object SHA, representing 103 additional tracked copies and 277,822 extra file-level bytes (not Git storage waste: Git deduplicates identical blobs). A separate empty-content group exists.
- **32 duplicate groups touch both** `02_ARCHITECTURE_PROPOSALS/claude/` and the imported `claude-zai/runtime/pack/`, including a full architecture/kernel mirror. These preserve historical compatibility; do not erase one version unless imports/manifests/tests and rollback all pass.
- **23 repeated-fixture groups** involve `team/fixtures/sample-round*`; identical JSON by itself does not prove the sample rounds are semantically redundant.
- [Private source custody](../03_DEVELOPMENT_SYSTEMS/dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md) remains separate from the Git file census; its 191 curated files are not part of the 396 tracked files.

**R0 gate:** PASS for **Git-tree inventory only**. **NOT RUN:** local running-session consumer census, private artifact re-check, source build/test execution, exhaustive dependency analysis. Therefore **R0 session-safe archive gate is NOT PASSED**.

## R1 — primary read-path check (partially completed)

Sixteen primary navigation/track-entry Markdown documents were inspected, covering canonical starts, 00–06 layer entrypoints, proposal authors, general Z.ai, proposal-specific, dogfood, and semantic factory. Their **117 relative Markdown links** resolved to existing paths in the Git tree; **0 unresolved** in that specific sample. This is NOT a whole-tree or fragment-anchor/link-at-runtime test.

**Authority correction implemented in this pass:**
1. `README.md` retains its O1 v0.1 text but its “OPEN THIS FIRST”/“First useful actions” headings are explicitly labeled historical O1, not the canonical current Elephant Lab starting point.
2. `PROJECT_START_HERE.md` identifies a minimal read path and links to the single 04 artifact lookup, separating current lab-wide norms from candidate implementations and old launch material.
3. `04_TURN_PUBLICATIONS/ASSET_LOOKUP.md` and `ASSET_DISCOVERY.json` provide one discoverable asset index, resolving Git source vs private source and synthetic vs live limits.
4. The general Z.ai README remains compatible; its intended A/B/C real-fanout experiment design is no longer phrased as independently verified runtime activity.
5. `06_REVIEW_AND_CONSOLIDATION/README.md` distinguishes actual static R0/R1 observations from proposed full R2–R8 testing.

**R1 gate:** PARTIAL. Sixteen read-path documents are checked, but no blind fresh-agent retrieval/authority comprehension trial has run, and other Markdown files may still contain stale text. Do not claim whole-lab contradiction elimination.

## Duplication disposition — hold, do not silently archive

| Candidate | Reason to inspect | Blocking gate |
| --- | --- | --- |
| Imported Claude architecture mirror under `03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/runtime/pack/outputs/claude/` | Duplicate Git blobs with primary architecture plus native runner imports | Original manifest hash mismatch; freeze exact import tree and replay tests before any dedup |
| `team/fixtures/sample-round-k2/k3/k4/` | Many repeated fixture blobs | Prove fixture generation and independent test expectations; preserve lineage |
| Root `protocol/`, `prompts/`, `operations/`, `tools/ecp/` | O1-first-era root location | Live and static dependency census, aliasing and mock replay |
| `BOOTSTRAP-ZAI-EXPERIMENT-LAB/` | Original general Z.ai bootstrap still linked by active-compatible process docs | Verify controller checkpoint and consumer migration; no known remote session inventory |
| Root `outputs/*/.gitkeep` | Historical model-output directories with empty placeholders | Confirm no tooling expects persistent empty directories |

**Decision:** retain exact existing paths; improve labeling and discovery now. Actual moves/deletions require the original [archive proof and rollback gate](INITIAL_AUDIT_AND_DISPOSITION.md). There is no evidence for safe destructive consolidation yet.

## Next smallest high-value tests

1. Ask an independent context-empty agent to answer eight questions from [review round R8](REVIEW_SEQUENCE.md) using **only Elephant Lab docs**; record retrieval steps and incorrect authority assumptions.
2. On a clean Windows checkout, replay the O1, Claude mock, DNA and dogfood verification commands in [ASSET_DISCOVERY.json](../04_TURN_PUBLICATIONS/ASSET_DISCOVERY.json); attach actual stdout, versions and exit codes.
3. Read actual known active controller/worktree IDs before migrating legacy paths. If unknown, mark BLOCKED rather than deleting.
4. Only then propose a surgical reviewed archive cutover with lineage aliases and rollback commit.

**Out-of-scope:** whole-project VOMEGA cleanup, `mvp/`, `.project/`, or production runtime modifications.
