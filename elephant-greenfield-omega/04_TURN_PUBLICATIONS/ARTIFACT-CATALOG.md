# Elephant artifact discovery catalog — incoming research batch 2026-10-11

**Status: inventory/catalogued, NOT a GitHub-hosted binary artifact mirror.** This catalog identifies original incoming artifacts exactly. Source inventories and verification evidence must remain discoverable if research is stopped after any turn.

| Track / stage | Original received archive | Distinct high-value bundles | Claims/evidence |
| --- | --- | --- | --- |
| ZAI semantic factory, first published turn | `workspace-2f993dc5-7532-422d-add2-ea23c8507dcc.zip` | `src/lib/factory/`, `src/app/api/`, `src/components/factory/`, `upload/elephant_semantic_factory_v2_extracted/elephant_semantic_factory_v2/{schemas,examples,MANIFEST.json}`, `worklog.md` | local simulated command journey and anchored semantic corpus |
| Claude proposal-specific ECP Round 1, turns 1–3 | `workspace-a02a20e7-5def-4484-9e94-39e1dd2fcc12 (1).tar` | `src/lib/ecp/`, `claude-ecp-lab/publications/turn-{1,2,3}/PORTFOLIO.json`, `claude-ecp-lab/PREREGISTRATION-R{1,2,3}.md`, `claude-ecp-lab/runs/*`, `worklog.md` | persistence, citation, staleness and negative recall battery |

## Navigation by purpose

| Looking for | ZAI location (inside ZIP root folder) | Claude location (inside TAR root) |
| --- | --- | --- |
| Natural-language interpretation and deterministic grounding | `src/lib/factory/{lexer,interpret,ground,declarations}.ts` | not the main ECP focus |
| Source-anchored semantic library | `src/lib/factory/{corpus,extract,bootstrap,record-types}.ts` | `src/lib/ecp/omega-repo.mjs` |
| Simulation journal/consent | `src/lib/factory/ecp.ts`, `src/app/api/commands/route.ts` | `src/lib/ecp/kernel/{journal,kernel}.mjs` |
| Context capsules / session persistence | in-app pack and ECP journal prototype | `src/lib/ecp/kernel/{capsule,escrow}.mjs`, `src/lib/ecp/session-store.mjs`, `src/lib/ecp/append-adapter.mjs` |
| Model calls and usage ledger | not independently verified in received ZAI turn | `src/lib/ecp/{consult,live-adapter}.mjs`; `claude-ecp-lab/runs/r1-a2-usage-ledger/` |
| Recall battery and blind probes | R1–R7 gate UI; no equivalent hidden-defect evidence claimed | `claude-ecp-lab/runs/r3-a2-recall-battery/`, `runs/r3-b2-cost-census/` |
| Rotation, staleness, epoch tests | virtual world/command fixtures | `claude-ecp-lab/runs/{r2-b2-rotation,r3-b1-rotation-live}/` |
| Full versioned capability portfolio | `/api/packs`, factory DB and source toolkit; archive lacks independently mirrored release | `claude-ecp-lab/publications/turn-{1,2,3}/PORTFOLIO.json` |

**Safety/custody:** Archive extraction must exclude nested `.git`, `.env`, credentials, ephemeral `db/custom.db`, generated caches, personal session contents, and redundant cloned `vomega-source` snapshots from any public publication. The originals should be preserved intact in user-controlled restricted storage; public code or a sanitized bundle is a separate release operation.

**Discovery invariant:** A round is not required for ingestion. A single complete turn with source, findings and receipts can be indexed and made reusable; never gate harvesting on completion of a ten-round program.

## Sanitized portable export (prepared during intake)

- Filename: `elephant-research-artifacts-2026-10-11.zip`
- SHA-256: `ac59160805deb53cdafb39d504ccf9cb299dd4c07ebe0d1867103f8337596b5d`
- 191 files: 56 ZAI semantic-factory source/docs and 135 Claude ECP source/portfolios/preregistrations/probes/evidence files; includes `ARTIFACT-MANIFEST.json` with per-file SHA-256 values.
- The portable export was delivered with the conversation. **It is not yet hosted by GitHub; it cannot be retrieved from this index alone.** It is a curated subset, not the originals or a complete mirror of every file in the experimental workspaces.

## 2026-10-11 second-pass custody update

The previously indexed archives were **recovered from the owner's file library** and a private, validated **191-file** source-first dogfood handoff was produced. This does not make binary files public GitHub assets. The private handoff `Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip` has SHA-256 `a917fa57c24c84150fa61d8ab493f54d495306cd9350026bdfb3820b1cfaa62a`, exact source manifest SHA-256 `ab1439f91faec30d4e10c949fdc83052926e68a5871a884dbae4f079457e6030`, 191 curated files, an 11-family source index, a read-only preflight and first-turn ZAI instructions. A locally independent **mock-only** Claude kernel replay passed 32/32 tests and the intake checker passed 5/5 synthetic tests. The ZAI partial Next code was not built. Full source custody/replay: [dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md](../03_DEVELOPMENT_SYSTEMS/dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md). Externally running ZAI sessions must receive the actual archive; catalog links alone do not provide its bytes.
