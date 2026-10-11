# Initial Audit — Formalize-Now Decisions and Archive Candidate Register

**Observation basis:** GitHub tree `df58f8886097fcbfc9ba862a58a75b363e258dbe` (2026-10-11), 391 tracked blobs below `elephant-greenfield-omega/`, ~1.81 MB of Git object file sizes, 59 exact-content duplicate SHA groups including empty placeholders, repeated synthetic fixture sets and copied architectural materials. This is a Git-file audit, NOT an independent live runtime or all-doc line-by-line audit. The 191-file private dogfood handoff is separately reported and NOT visible in the public repo.

## Findings grounded in current paths

| ID | Observation | Classification | Action |
| --- | --- | --- | --- |
| F01 | `mvp/NORTH-STAR.md` defines v0.5 product; `00_CORE_BASELINE/02_GREENFIELD_OMEGA_SEED.md` freezes a smaller three-MOCK Alpha/Beta/Gamma benchmark. The product shell is an initially empty effectively infinite 3D canvas with floating text box, while full Windows packaging is deferred in dev. | FORMALIZE_NOW | Keep separate versioned contracts; add a source-pinned v0.5 read-only snapshot; never rescore original E0/E1/E2 using new target. |
| F02 | `README.md` is titled edition v0.1; `PROJECT_START_HERE.md` points to five new layers and explicitly treats the old root protocol as O1 prior art. | FORMALIZE_NOW | Put canonical entrypoint at the top of legacy README; preserve old deep links until session-safe migration. |
| F03 | `02_ARCHITECTURE_PROPOSALS/README.md` says Claude is “not yet submitted” in its early list but later acknowledges its real imported v0.2 submission. | FORMALIZE_NOW | Fix stale summary; add stale-metadata detection in R1. No alteration of the Claude architecture. |
| F04 | `03_DEVELOPMENT_SYSTEMS/proposal-specific/` accounts for 195 tracked files; the imported `claude-zai/runtime/pack/outputs/claude/` includes identical blobs also owned in `02_ARCHITECTURE_PROPOSALS/claude/`. Repeated `sample-round-k2/k3/k4` fixtures include byte-identical evidence. | ARCHIVE_CANDIDATE | First determine which are immutable release snapshots or fixtures; no blind deduplication of provenance/holdouts. Move/link only after replay and manifest proof. |
| F05 | `BOOTSTRAP-ZAI-EXPERIMENT-LAB/` remains active compatibility material for original general Z.ai R1, though `03_DEVELOPMENT_SYSTEMS/general-zai-lab/` is the new navigational home. | LEGACY_ACTIVE_COMPAT | Keep path stable; migrate only on witnessed safe controller checkpoint. |
| F06 | `01_MASTER_CHARTER.md`, `protocol/`, `tools/ecp/`, `prompts/`, `operations/`, `outputs/` largely predate neutral shared-baseline organization and belong to O1's history/prototype. | ARCHIVE_CANDIDATE | Add explicit O1 path/authority alias, consumer census and tested archive redirect; keep executable harness discoverable. |
| F07 | `04_TURN_PUBLICATIONS/ARTIFACT-CATALOG.md` indexes original ZIP/TAR and private portable 191-file handoff; `SOURCE_CUSTODY_AND_REPLAY.md` distinguishes source custody and 32 synthetic Claude tests from live proof. | FORMALIZE_NOW | One consolidated *discovery* view that links existing manifests; private bytes stay private. No false Git-hosted source claims. |
| F08 | `01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md` requires all-state pack publication every top-level turn. `04_TURN_PUBLICATIONS/TURN_RELEASE_FIELDS_AND_LIFECYCLE.md` details field semantics. | CANONICAL_KEEP | Preserve one normative rule; link field reference as supporting semantics, not a competing publisher. |
| F09 | `05_UNIVERSAL_ELEPHANT_DNA/` contains candidate genome + schemas + synthetic validation; actual model introspection and live independent trials are not thereby proven. | EXPERIMENTAL_KEEP | Formalize measurement witness/unknown semantics as cross-track test requirements; do NOT ratify 20 traits or specific implementation. |
| F10 | `03_DEVELOPMENT_SYSTEMS/semantic-factory-zai/06_SEVEN_ROUND_PRODUCT_AND_LIBRARY_GATES.md` aims at wider product flow including future live webapps; `04_TURN_PUBLICATIONS/STOPPING-AND-ASSIMILATION-RULE.md` explicitly rejects mandatory ten-round completion of current ZAI/Claude research streams. | FORMALIZE_NOW | Mark semantic roadmap as one track's proposed milestones, not global requirement or published proof. Harvest meaningful turns immediately. |

## Formalize NOW (minimum useful precision)

| Contract | Answer we must fix now | Deliberately left open |
| --- | --- | --- |
| **Product vs benchmark** | v0.5 product acceptance vs immutable mock-seed E0/E1/E2 test, with links and version/epoch stamps | Which modules/stack realize final Windows app |
| **Canonical read order** | `PROJECT_START_HERE.md`, `00`, `01` first; `02` hypothesis; `03` actual lab; `04` receipts; `05` candidate DNA; no O1 leak | Final proposed architecture |
| **Source truth** | owner product intent and source code/runtime/test evidence have distinct authority; snapshots can be stale | Model context memory store |
| **Identity/privilege** | distinct Provider, Account, Model, Session, Workspace, Command, Pack, Experiment, Elephant, Proposal; user consent required | Browser automation/adapters/transports |
| **Deterministic action** | proposed action, validation/ambiguity, preview, permission, execution and observed outcome differentiated | NL parser and visual presentation framework |
| **Publication** | all-state pack index at EVERY top-level development turn; exact source, content and truth status; previous version always retrievable | Serialization/storage format if semantics and retrieval tests pass |
| **Measurement** | per-number witness + MEASURED/ESTIMATED/UNKNOWN; unknown ≠ 0; simulate ≠ real; offered source ≠ deeply understood | Metric transport and vendor-specific metering |
| **Artifacts** | hashes, physical retrieval, protected/private source, runnable vs candidates, replay command and evidence | Packaging/layout implementation |
| **Research independence** | E0/E1/E2 count vs A/B/C strategy vs author proposals vs Z.ai sessions not conflated | Number of worthwhile actual parallel sessions |
| **Cleanup safety** | original paths pinned, live consumers accounted for, references/redirects and rollback before move | Timing and physical archive destination |

## Do NOT formalize as universal law yet

Specific O1 ECP v0 wire format; Claude capsule-first approach; residence over rebuild; fixed A/B/C controller architecture outside general lab; universal 20-gene implementation requirement; hardcoded context window or token percentages; mandatory Next/Prisma/Node/Tauri implementation inside every research track; one fixed source-harvest or storage stack; guaranteed full-provider webapp automation; a mandatory seven/ten-round completion; assumed patentable novelty.

## Proposed disposition — no file moves performed

**KEEP ACTIVE:** `PROJECT_START_HERE.md`, `00_CORE_BASELINE/`, `01_EXPECTED_OUTPUTS/`, `02_ARCHITECTURE_PROPOSALS/`, `03_DEVELOPMENT_SYSTEMS/` track entrypoints, `04_TURN_PUBLICATIONS/` registers, `05_UNIVERSAL_ELEPHANT_DNA/` explicitly candidate, and this review folder.

**KEEP WITH EXPLICIT LEGACY AUTHORITY:** `README.md`, `01_MASTER_CHARTER.md`, `02_GREENFIELD_OMEGA_PRODUCT.md`, `00_LAUNCH_PROMPTS.md`, `protocol/`, `prompts/`, `experiments/`, `operations/`, `tools/ecp/`, `schemas/`, `run-mock.ps1` while any live launcher or referenced test consumes them.

**ARCHIVE CANDIDATE AFTER AUDITED CUTOVER:** `BOOTSTRAP-ZAI-EXPERIMENT-LAB/` *after active general Z.ai has consumed new redirect*, redundant Claude implementation snapshots *after hash/provenance and replay*, repeated fixture clones if generatable and pinned, legacy model-specific output placeholders, superseded round-robin prompts and manifest exports. Keep immutable metadata/retrieval and never break replay by assuming byte-identical implies disposable.

**PRIVATE EXTERNAL:** owner ZIP/TAR archives and 191-file private handoff; Git catalogs link provenance only. Do not upload raw archives/cookies/secrets to public Git.

**UNDECIDED:** actual live session identities, consumer references and required preservation horizon; clean Windows replay of all candidate tools; whether duplicate fixture copies encode intentionally distinct round identity; current model/agent operation claims. These require R0/R4/R5 evidence.

## Mandatory evidence before each archive move

Record `old_path, new_path_or_private_uri, blob_sha, parent_commit, producer, last_live_consumer, inbound_links, metadata/provenance, review_owner, approval, integrity_check, replay_command, pre/post_result, alias_or_redirect, rollback_commit`. A candidate without this record is NOT archived. Preserve historic negative results and immutable portfolio visibility.

## First actionable cleanup order

1. Correct live misleading navigation only (no file moves).
2. Pin v0.5 source snapshot and make benchmark/product separation undeniable.
3. Build exact dependency/link graph; capture running session checkpoint.
4. Prove smallest source/tool/pack discovery and replay in a clean context.
5. Draft a migration PR with archive manifest and reversible redirects after the above gates.

**Current result:** research program + preliminary assessment only; no archive migration, hosted agent, real provider integration, or full cold-start R8 study has been performed.
