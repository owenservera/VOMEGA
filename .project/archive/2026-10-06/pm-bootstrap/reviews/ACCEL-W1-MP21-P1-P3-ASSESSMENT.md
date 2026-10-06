# ACCEL-W1 Assessment — MP-21 P1/P2/P3

Status: **PM / INDEPENDENT ARCHITECTURAL ASSESSMENT — ADOPT IMPLEMENTATION, DO NOT PROMOTE GATES YET**
Date: 2026-10-06
Reviewed commits:
- `7951f68fcf19cf5612de3cc358b4e3e55c0b8895` — MP21-P1
- `65ecc7f6f8e7ddb4723627e90a0b0ec18f7d3cc6` — MP21-P2
- `fd30d425eb4b6197bcc524ed7a341ccd035acc7b` — MP21-P3

## Executive disposition

The three commits are a coherent implementation of the **MP-21 portion of ACCEL-W1**.

They are **not completion of ACCEL-W1 as a whole**. MP-56, MP-55, MP-54 and MP-60 remain open/unclaimed in the current STATUS.

Recommendation:

> **ADOPT the P1/P2/P3 implementation as the provisional Reflection substrate. Keep MP21-G1/G2/G3 at TBD until independent proof review. Do not freeze the P3 graph/query contract until a real consumer or MP-60 P1 acceptance corpus validates it.**

The code generally respects the program boundaries:
- read-only over product source;
- commit-pinned;
- deterministic by construction;
- extracted fact ≠ inferred fact ≠ commentary;
- opacity/unknown is an output;
- graph is descriptive, not authoritative;
- consumers can query a serialized artifact without reparsing source.

## P1 — Source inventory + identity

Verdict: **strong implementation; ready for independent gate review.**

What it gets right:
- reads Git objects at a pinned revision rather than the mutable working tree;
- SourceAnchor identity separates stable-ish identity from version evidence;
- commit/contentHash/spanHash/range are observations, not identity fields;
- classification is explicit and deterministic;
- duplicate anchor identities are testable;
- parsing uses the TypeScript parser rather than text grep for declarations;
- no source mutation.

Important boundary:
- file/symbol identity is path/name based, so moves and renames change refs. The implementation explicitly documents this rather than pretending rename-stability exists.

Gate assessment:
- MP21-G1 appears technically plausible from the implementation and tests;
- it still requires a reviewer independent of the author before promotion.

## P2 — Structural extraction

Verdict: **strong, appropriately conservative implementation; ready for independent gate review.**

What it gets right:
- claim classes are part of every fact;
- no CANDIDATE_SEMANTIC class is available to the extractor;
- INFERRED_SAFE facts require a named deterministic rule;
- unsourced facts are rejected;
- manifest↔runtime op parity is explicit;
- requested/called port parity is explicit;
- dynamic registration and unresolved/dynamic calls are surfaced as unknowns instead of guessed through;
- cross-plugin implementations remain attributed rather than collapsed;
- fixture manifests are intentionally excluded from product semantic facts;
- the artifact explicitly lists surfaces it does not yet extract.

This is especially important because it prevents "coverage pressure" from turning into invented semantics.

Known incompleteness is honest:
- config parsing;
- code-level schemas;
- visual contracts beyond shapes;
- semantic registries;
- source comments;
- non-contract type shapes;
- dynamic imports.

Those omissions mean P2 is not a complete Reflection system. They do not invalidate P2's bounded structural claim.

Gate assessment:
- MP21-G2 appears technically plausible;
- keep TBD until independent review reproduces determinism and samples extracted facts against source.

## P3 — Reflection Graph + query API

Verdict: **good provisional substrate; do not freeze or promote G3 yet.**

Strengths:
- the serialized graph is self-contained;
- query consumers need no parser, Git access or filesystem access;
- every node/edge retains claim class and source anchors;
- dependency direction is explicit per relation;
- the test suite fails if a graph relation appears without a declared dependency direction;
- impact, dependency, affected-test, bundle-file-set and explanation queries exist;
- revision identity is exposed to consumers;
- graph build checks inventory/extraction lineage.

### Central review finding: planned consumer feedback arrived too late

The owner build plan intentionally started MP-60 P1 in Wave 1 so its impact-query acceptance corpus could shape MP-21 P3 **before the graph/query contract hardened**.

MP-60 P1 is still unclaimed.

P3 therefore derived its initial graph/query shape from the PM dossiers and same-author stand-in scenarios rather than from a real MP-60 acceptance corpus.

The implementation correctly acknowledges this and states:

> graph shape is not frozen.

That is the correct disposition.

Required before MP21-G3 promotion:
- preferably MP60-P1 supplies its named impact-query acceptance corpus and validates the current query contract; **or**
- a real MP54-P2 / MP60-P2 consumer uses the serialized graph and demonstrates the gate wording directly.

Do not require a redesign if the current API already satisfies those consumers. The missing item is independent consumer evidence, not evidence that the implementation is wrong.

### Secondary hardening note

`loadGraph()` currently validates the graph schema version but does not independently recompute/verify the graph digest, anchor closure or edge/node closure on load.

The graph builder/tests validate those properties at creation time, so this is not a P3 rejection.

Before the graph becomes a durable artifact consumed across processes/worktrees, consider a lightweight `verifyGraph()` or strict loader so a stale/corrupt/tampered graph fails closed rather than being trusted because its schema string matches.

This is a hardening recommendation, not a blocker for provisional adoption.

## Wave-plan conformance

The current ACCEL-W1 owner plan says:

- MP-21: P1 → P3, PRIMARY;
- MP-56: P1 → P4, HIGH;
- MP-55: P1 → P2 then HOLD;
- MP-54: P1 then HOLD;
- MP-60: P1 then HOLD.

Observed state after these three commits:

| Entry | Planned Wave-1 target | Observed |
|---|---|---|
| MP-21 | MP21-G3 | P1/P2/P3 implemented; G1/G2/G3 TBD independent review |
| MP-56 | MP56-G4 | unclaimed |
| MP-55 | MP55-G2 | unclaimed |
| MP-54 | MP54-G1 | unclaimed |
| MP-60 | MP60-G1 | unclaimed |

Therefore:

> **ACCEL-W1 is in progress, not complete.**

And:

> **ACCEL-M1 is not closeable yet even if MP21-G3 passes review, because four other required gates remain open.**

## Architecture / integration assessment

The implementation satisfies the most important structural principle of the first-five strategy:

> MP-54, MP-55 and MP-60 should consume one source-bound Reflection substrate rather than build independent parsers/identity systems.

The query module is explicitly isolated from parser/Git/filesystem machinery. This is the right direction.

The first real integration test should now be one of:
1. MP-60 P1 acceptance corpus evaluated against the P3 query API;
2. MP-54 source-aware bundle reading a serialized graph;
3. MP-55 failure enrichment resolving refs through the same graph.

A consumer gap should be fed back into MP-21 as a graph/query requirement rather than solved with another parser.

## Effort-estimate observation

Not a recalibration decision yet, but record the evidence:

- P1 landed roughly in the expected implementation-size neighborhood once tests/tooling are included.
- P2 and especially P3 appear to have required materially less implementation code than the original broad LOC priors, because the implementation deliberately constrained extraction/query scope.

This is useful future calibration evidence, but no PM estimate model change is authorized by this review.

## Final disposition

**ADOPT WITH REVIEW HOLD.**

- Keep all three commits.
- Do not revert or redesign P1/P2/P3 pre-emptively.
- Keep MP21-G1/G2/G3 = TBD until independent review.
- Do not freeze the P3 graph/query ABI.
- Run MP-60 P1 early enough to validate/extend the query contract.
- Add real-consumer evidence before MP21-G3 promotion if practical.
- Continue the other four ACCEL-W1 entries in parallel.

This assessment reviews the MP-21 implementation slice only. It does not declare ACCEL-W1 or ACCEL-M1 complete.
