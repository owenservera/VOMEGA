# 2026-10-11 source recovery and replay — second-pass technical audit

## What is actually in custody
The original ZAI ZIP `workspace-2f993dc5-7532-422d-add2-ea23c8507dcc.zip` (SHA-256 `0a05399ef9bb75a7f91517f81a0150d95bafc2fa4ee7088278d734fca57f46e0`), original Claude TAR `workspace-a02a20e7-5def-4484-9e94-39e1dd2fcc12 (1).tar` (SHA-256 `3cf8ad709730822d62859a2045156b136715c38c47046da0c5b553b1a30f5297`), and the previously curated **191-file** research export `elephant-research-artifacts-2026-10-11.zip` (SHA-256 `ac59160805deb53cdafb39d504ccf9cb299dd4c07ebe0d1867103f8337596b5d`) were recovered from the owner's ChatGPT file library during this second pass.

They are **not automatically available to external ZAI streams**, and the binaries are not committed to this public GitHub repository. Original workspace archives contain `.env`, `.git`, runtime DB/cache and history; do not republish raw archive trees. The curated export includes author-reported experiment traces and raw-response records; provenance and privacy/license review still precede any public mirror.

## New portable handoff (private local transfer)
- `Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip`
- SHA-256: `a917fa57c24c84150fa61d8ab493f54d495306cd9350026bdfb3820b1cfaa62a`
- Inside: `dogfood-zai/source/` holds **191 original files**, `source/ARTIFACT-MANIFEST.json` includes verified hashes, `SOURCE_INDEX.json` classifies each one across 11 discoverable source families, `source-preflight.mjs` and `source-preflight.test.mjs` are executable, plus `README.md`, `DOGFOOD_FIRST_TURN.md`, `LOCAL_TEST_EVIDENCE.json`, `VERIFY_RESULT.json`.
- Manifest SHA-256 (pin independently): `ab1439f91faec30d4e10c949fdc83052926e68a5871a884dbae4f079457e6030`.
- **Local ownership:** deliver that private handoff ZIP into the ZAI session workspace/attach it explicitly. A repository link to this document is not access to the ZIP.

PowerShell SHA check **before** extracting a local downloaded handoff ZIP:

```powershell
$expected = 'a917fa57c24c84150fa61d8ab493f54d495306cd9350026bdfb3820b1cfaa62a'
$actual = (Get-FileHash '.\Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'Seed ZIP hash mismatch; STOP' }
Expand-Archive '.\Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip' -DestinationPath '.\elephant-dogfood' -Force
node .\elephant-dogfood\dogfood-zai\source-preflight.mjs --expected-manifest-sha256 ab1439f91faec30d4e10c949fdc83052926e68a5871a884dbae4f079457e6030 --run-tests --out .\elephant-dogfood\preflight.json
```

The verifier is Node stdlib, reads only the extracted seed, hashes all expected files, rejects missing/extra/tampered/unsafe/symlink entries, and optionally runs the **mock-only** Claude kernel test suite. It does **not** install dependencies, initiate model sessions, publish artifacts or validate the complete ZAI web app.

## Measured local results (not remote agent claims)
- Original curated export SHA-256 verified against prior repo catalog.
- Curated `ARTIFACT-MANIFEST.json`: all **191/191** entries verified, total **1,008,790 source/evidence bytes**.
- Claude isolated kernel suite: **32 passed, 0 failed**, `node --test claude/claude-ecp-lab/runs/r1-b1-capsule-epoch/kernel-copy/kernel.test.mjs`. These are synthetic/mock fault-oracle tests; no live Elephant was tested.
- New intake verifier: **5 passed, 0 failed** synthetic tests (intact, tampering, extra files, traversal, absent file, malicious pin). Tested on Linux Node.js v22.16.0. Windows portability requires owner-side replay.
- ZAI Next app source: **NOT BUILT**; export is a selective code subset without a complete Next project/lockfile/dependency tree.
- Real ZAI streams, persistent contexts, quantitative productivity advantage: **NOT VERIFIED**.

## Code family reuse shortlist
1. **Claude ECP kernel + independent fault tests** (`claude/claude-ecp-lab/runs/r1-b1-capsule-epoch/kernel-copy/`): D0 replay can be established immediately; candidate for capsule, journal, stale detection and provenance utility extraction. Keep mock label.
2. **ZAI deterministic interpretation pipeline** (`zai/src/lib/factory/{lexer,interpret,ground,declarations}.ts`): adapt only after reconstructing import graph, explicit command law, target fixtures and fresh pre/post tests. The reported `nlcl` basis is not itself independently verified by this bundle.
3. **ZAI corpus/source harvest** (`zai/src/lib/factory/{corpus,extract,bootstrap,record-types}.ts`): possible source-anchored semantic toolkit. Requires DB/runtime dependency isolation and measured source recall.
4. **Claude publication portfolios** (`claude/claude-ecp-lab/publications/turn-{1,2,3}/PORTFOLIO.json`): release-shape precedent, **not** certification of the historical results.
5. **Claude ECP adapters and probe runners** (`claude/src/lib/ecp/`, `claude/claude-ecp-lab/runs/`): inspect carefully; some code may connect to providers. Never run such scripts automatically as part of source verification.

## Release boundaries
Keep the existing [all-state every-turn publication law](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md). Publication requires a durable accessible Git/artifact reference to **all packs**, including failures and immatures; this ZIP and local smoke report are source intake evidence, **not an agent turn publication**. Initial stream runs must be marked NOT_STARTED until real session IDs, receipts and their first complete publication exist. Preserve the original frozen E0/E1/E2 cohorts and active general ZAI tracks.
