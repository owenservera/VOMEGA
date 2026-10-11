# Elephant Dogfood ZAI — Source-First Self-Hosting Lab

**Status: PREPARED / NOT LAUNCHED.** This is an independent development-system track, not a new Elephant architecture, a mutation of the frozen baseline, or a claim that the historical archives are available in Git.

## Objective
Start ZAI sessions from **actual existing Elephant executable artifacts and toolkits** as the initial source tree. Require them to run, test, benchmark, repair, extend and challenge those assets, returning portable capability packs usable by a fresh session. The Elephant is both the system under test and the consumer of improvements. Reject prose-only reinvention when a relevant executable exists; no claim of reuse without an execution trace.

## Mandatory reading
1. `../../PROJECT_START_HERE.md` and `../../00_CORE_BASELINE/README.md`
2. `../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md`
3. `../../04_TURN_PUBLICATIONS/ARTIFACT-CATALOG.md`, `2026-10-11-INGESTED-RESULTS.md` and `STOPPING-AND-ASSIMILATION-RULE.md`
4. `../../05_UNIVERSAL_ELEPHANT_DNA/README.md` and the operational registry
5. `../semantic-factory-zai/README.md` and actual available source assets
6. `SEED_REGISTRY.json`, `STREAM_STARTER.md`; run `node inventory.mjs` from this folder.

## Source vs knowledge
- **Executable seed:** current files physically available, hashable, with verified command and environment.
- **Candidate source:** implementation in a retrieved archive or a published immutable pack; becomes executable seed only after custody, sanitization and verification.
- **Knowledge input:** reports, protocols, DNA hypotheses, simulation evidence and historical catalogs. Never label these as runnable code.
- **Unavailable:** archival objects only described by metadata. Do not reconstruct or claim imported code from an index alone.

## Proposed independent experiment arms
- **D0 — Reuse-only:** exercise existing executable assets with no substantive source changes; baseline for portability and reproducibility.
- **D1 — Repair/adapt:** smallest observable code changes to make selected toolkits useful, without new framework commitments.
- **D2 — Integrate/compose:** make two or more independent packs interoperate, with explicit versioned contract boundaries.
- **D3 — Competing implementation:** replace one bottleneck only when independent evaluation justifies it.

Start with one small utility and all four arms on frozen inputs before scaling streams. Stream count, orchestrator, transport, storage and implementation are experimentally selected, not baseline DNA.

## Every-turn pipeline
Inventory and hash → freeze seed cohort → sandbox and replay tests → state hypothesis and experimental arm → develop → run independent checks → export *all* maturity states → publish immutable full portfolio → compare to D0 → re-enter only selected proven assets as a new seed cohort.

Publication authority is the existing `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md`; do not create a competing release contract. Use `04_TURN_PUBLICATIONS` for actual releases and link from its registry when authentic identifiers exist.

## Gates
Each run must distinguish MOCK/SYNTHETIC, AUTHOR_REPORTED and INDEPENDENTLY_REPRODUCED. Mark metrics MEASURED, ESTIMATED or UNKNOWN with the witness. Freeze commit SHA, file hashes, license, secrets classification, tool versions, effective permissions, original tests and dataset. Work in isolated disposable worktrees; no persistent ownership branches. Do not alter provider credentials, billing, configuration, or external accounts. Never silently promote speculative DNA to operational law.

## Initial acceptance
1. Inventory lists executable seeds, documented candidates, missing bundles and source hashes without claiming unavailable files exist.
2. At least one pre-existing tool runs unmodified and yields a captured baseline.
3. At least one changed tool version passes a reproducible test with a measurable comparison or an honest null/negative result.
4. A fresh independent agent can reconstruct and inspect *all* packs from the per-turn release, including failures.

**Run locally:** `node elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/dogfood-zai/inventory.mjs`.
