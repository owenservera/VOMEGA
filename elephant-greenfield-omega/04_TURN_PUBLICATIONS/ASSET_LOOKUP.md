# Find an Elephant Lab Asset — Active Discovery Index

**Scope:** this subproject only. The [machine-readable asset index](ASSET_DISCOVERY.json) enumerates 14 asset families and 37 verified Git paths at commit `ecd015c38b9d`. An indexed path means that Git contains the file; it does **not** mean a model session or external provider is running. See [current publication proof status](CURRENT_PUBLICATION_INDEX.md).

| Need | Authoritative location | Actual proof/custody |
| --- | --- | --- |
| Product target and frozen experiment | [v0.5 read-only mirror](../00_CORE_BASELINE/04_MVP_V0_5_PRODUCT_NORTH_STAR.md) and [mock-only frozen cohort](../00_CORE_BASELINE/02_GREENFIELD_OMEGA_SEED.md) | Product intent ≠ test cohort ≠ implementation |
| Every-turn full pack inventory | [Publication law](../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md) and [release fields](TURN_RELEASE_FIELDS_AND_LIFECYCLE.md) | Required contract; check actual releases separately |
| ECP minimal simulated implementation | [O1 mock toolkit](../tools/ecp/README.md) | Git source/tests; no real Elephant/session evidence |
| Claude cognitive architecture and kernel | [Independent Claude proposal](../02_ARCHITECTURE_PROPOSALS/claude/README.md) | Git source and simulated tests; duplicated compatible runtime mirror remains pinned |
| Claude's experiment harness | [Claude Z.ai development runner](../03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/README.md) | Synthetic tests and original manifest mismatch; no authenticated Z.ai session claimed |
| DNA and honest self-report probes | [Universal DNA](../05_UNIVERSAL_ELEPHANT_DNA/README.md) | Research candidate and deterministic fixtures only |
| Semantic command and corpus designs | [Semantic Factory](../03_DEVELOPMENT_SYSTEMS/semantic-factory-zai/README.md) | Schemas/examples in Git; reported Next source in separate private archive |
| Existing toolkits for dogfood seeding | [Dogfood source custody](../03_DEVELOPMENT_SYSTEMS/dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md) | 191-file private handoff must be supplied, SHA checked; NOT downloadable from Git |
| General Z.ai live-compat startup | [General Z.ai launcher](../03_DEVELOPMENT_SYSTEMS/general-zai-lab/README.md) | Retained instructions, remote live state unverified here |
| Turn/round intake and negative results | [Evidence catalog](ARTIFACT-CATALOG.md) and [ingested results](2026-10-11-INGESTED-RESULTS.md) | Some author-reported, some mock independently replayed, not blanket certification |

**Direct source handling:** consult `ASSET_DISCOVERY.json` for exact repo-relative files, source commit blob digests and suggested test commands. The indexed 191-file handoff is NOT stored in GitHub. Never equate a reference to that ZIP with access to its bytes, and never copy original private workspaces to a public repo.

**No new publisher:** This is a lookup layer, not another pack type or publication process. Every-turn releases still use the [normative contract](../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md). Historical failures, retired packs and negative results must remain discoverable.
