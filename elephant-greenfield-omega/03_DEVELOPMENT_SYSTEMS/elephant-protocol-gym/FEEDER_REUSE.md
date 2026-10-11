# Gym Input Feeder — Reuse Existing Source Infrastructure

**Decision 1 (2026-10-11): OWNER_DIRECTION — incorporate both the small controlled fixture and real Elephant code; reuse the already designed feeder/intake system.** This is an integration map, not a new pipeline, feeder daemon, schema or proof of live availability.

## What the user means by "pull all of number one in"
The Gym must use the existing source discovery, recovered-artifact custody, preflight verification and published-capability lookup, rather than asking teams to create another source harvester. Agents may first experiment on the same minimal TypeScript fixture **and** select a verified, available real-source cohort. Both approaches may run in parallel and remain comparable when their inputs, tasks and budgets are pinned. Agents must be allowed to propose improvements to the existing feeder after observing friction.

## Existing source feeder / custody chain (reuse these components)
1. **Find assets:** [Elephant asset lookup](../../04_TURN_PUBLICATIONS/ASSET_LOOKUP.md) and [machine discovery registry](../../04_TURN_PUBLICATIONS/ASSET_DISCOVERY.json). Treat the registry as a historic source-pinned index, not proof of currently executable code. The normal entry point is [Dogfood Z.ai](../dogfood-zai/README.md) and its [seed registry](../dogfood-zai/SEED_REGISTRY.json).
2. **Inspect source locally:** [inventory.mjs](../dogfood-zai/inventory.mjs) is cheap discovery. Do not confuse it with proof that every file is intact.
3. **Check provenance and runnable custody:** [source custody and replay](../dogfood-zai/SOURCE_CUSTODY_AND_REPLAY.md) documents the private 191-file portable handoff, hashes, classification and exact owner-side verification command. [source-preflight.mjs](../dogfood-zai/source-preflight.mjs) and its [tests](../dogfood-zai/source-preflight.test.mjs) implement a tamper-aware local validation path.
4. **Reproduce existing tools before replacing them:** [dogfood decisions](../dogfood-zai/DOGFOOD_PASS2_DECISIONS.md) specify D0 unchanged replay before D1 repair, D2 compose or D3 competitor. Existing synthetic Claude ECP kernel, O1 ECP tools, semantic factory sources and DNA scorer may become research subjects when actually available and safely runnable.
5. **Publish and refeed:** use [every-turn all-maturity publication](../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md), [turn publications](../../04_TURN_PUBLICATIONS/README.md) and traceable sources. Fresh Elephants should be able to reconstruct a new candidate; no privately held work is magically accessible from its catalog entry.

These are **capabilities of the feeder ecosystem**, not a claim that a single central feeder API exists or that a Z.ai session has access to the owner's private ZIP. The design and implementation of automated continuous feeder orchestration may be explored, but should not be presupposed.

## Two inputs, one research purpose
- **Controlled fixture:** [001-semantic-basics.ts](fixture/001-semantic-basics.ts). Small and immediately public; isolates compiler, explanation, wiki and contradiction behavior.
- **Real code:** Select a repo-available source/toolkit from the existing seed registry and replay baseline, OR attach the separately provided private `Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip` and verify the archive SHA-256 (`a917fa57c24c84150fa61d8ab493f54d495306cd9350026bdfb3820b1cfaa62a`) and manifest SHA-256 (`ab1439f91faec30d4e10c949fdc83052926e68a5871a884dbae4f079457e6030`) using the documented preflight. Never copy unsanitized original archives to public Git.

When a real source is inaccessible, **do not invent it or stall**; run the controlled arm, mark REAL_SOURCE_UNAVAILABLE, name the missing artifact precisely and state what the real-source run would test. If a mock toolkit is selected, say MOCK rather than production.

## What each independent Gym session should know
Receive the same shared seed, pinned fixture and its own RUN prompt. In addition, receive this feeder integration map and *only the verified available source cohort necessary for that session's experiment*. Preserve independence: do not give Run A the other runs' conclusions or leak their private tests. A clean, ordinary-source-only control is still required even where enhanced source/capsule inputs are available.

Source provenance, sanity checks, cross-language ingestion, updated indexes, feeder-produced semantic observations, dependency selection and context packs are legitimate experimental *outputs*. None is predeclared a mandatory SDK implementation. If a team discovers a better feeder method, it proposes a bounded differential trial against existing preflight/replay rather than creating another unaccountable source of truth.

## First successful handoff
A run names (1) exact pinned fixture/source, (2) where it came from and whether checks ran, (3) what semantic behavior it tested, (4) whether the result came from tiny fixture, real code or both, and (5) any discrepancy, suggested tool improvement or blocked input. The first round is successful even if it only clarifies which tool should be reused next. The user has not yet approved a concrete new feeder implementation.

## What remains open
Automated feeder scheduling, semantic pre-processing, source selection, adaptive chunking, live synchronization, cross-herd routing and protocol representation remain lab variables. A larger feeder should be evidence-led, not designed just because source custody and indexing already exist.
