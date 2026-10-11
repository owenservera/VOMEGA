# Capability Pack Acceptance, Evidence and Maturity

## Purpose
Specify **proof obligations**, not a compulsory internal artifact inventory. A pack may be a runtime library, server, CLI, workflow, protocol, test method, design investigation, teaching/diagnostic tool or other coherent contribution. The minimum materials depend on its actual claims; absence of irrelevant file categories is never a failure.

## Native output freedom; normalized exchange questions
Each track may organize its native files and tools as needed. The common exchange surface must let a different agent ask:
1. **What is this?** Stable identity/version, observable problem solved, intended boundaries, non-goals and current status.
2. **Where does it come from?** Track, research/round/arm origin, source/decision lineage, upstream components/licenses and exact eligible knowledge epoch.
3. **What must exist to use/evaluate it?** Dependencies, model accounts or services, hardware/runtime version where relevant, allowed privileges, data/privacy assumptions, prohibited side effects.
4. **How does it behave?** Interface or method, input/output and error semantics, state transitions, authentication and runtime limits as applicable.
5. **Why believe it?** Test/reproduction evidence, measured results, negative tests, source hashes, independent evaluator attestation and known limitations.
6. **What does it cost?** Setup, request, token/call, latency, context loading/recovery, memory/compute and ongoing operations; distinguish unknown from zero.
7. **How can it evolve or leave?** Version policy, migration/rollback, replaceability and failure consequences.
8. **What else can use it?** Demonstrated integrations, exposed constraints, contractual compatibility, conflicts and adapters; unknown combinations marked untested.

A pack's own documentation may satisfy multiple questions at once. The laboratory can generate a discoverable machine-readable catalog **from** those authoritative materials, but the catalog is not proof. A tool is not required to expose an API when its natural boundary is a repeatable methodology.

## State model (maturity is claimed only when evidenced)
- **DISCOVERED:** an identified possible capability or uncertainty; specific tests not yet complete.
- **EXPERIMENTAL:** at least one real attempt, versioned input/output and explicit limitations.
- **VERIFIED:** an outside evaluator replicated the named functionality or reasoning result at the stated source/version conditions.
- **PORTABLE:** the reproduction/usage test succeeds in a clean, independently provisioned compatible environment using only declared dependencies and the exported pack.
- **COMPOSED:** has passed a separate integration test with at least one other released capability under declared constraints.
- **RETIRED/REJECTED:** evidence shows obsolete, incompatible, unsafe or not worth cost, with reason and replacement or counterexample.

This is not necessarily linear: a valuable standalone discovery can be VERIFIED and intentionally never COMPOSED. Do not equate 'COMPOSED' with superior quality; do not claim PORTABLE after merely running it in origin workspace.

## Evidence tiers
**Claimed:** narrative/model assertion only. **Observed:** originating tool or test events attached. **Replicated:** independent test or reviewer. **Proven for scope:** replicated and matched to frozen acceptance conditions, with failures/coverage disclosed. Never infer universal proof from a limited fixture. Version every claim to its evidence.

For opaque model-backed behavior, preserve enough logs, source hashes, effective session identities, context epochs and task fixtures to reproduce or bound the claim; never publish sensitive inputs or tokens. If the model/provider makes exact reproduction impossible, label the limitations and run controlled repeated tests.

## Pack-level acceptance checklist — applied only to claims it makes
- Can another agent consume the package *without reading original model chats*?
- Does it have a verifiable identifying version and source/assumption basis?
- Does the supported operation/method actually work on at least one relevant case?
- Was at least one falsifying/negative case tested where safety or correctness demands it?
- Can it fail safely or report unsupported inputs honestly?
- Are runtime write scope, external I/O, user/provider data permissions known?
- Are cost/resource claims measured, estimated or unavailable clearly?
- Is it distinguishable from a wrapper that simply delegates the actual solution to undocumented external services?
- If reused from outside, are upstream protocol versions, licensing, security and maintenance assumptions explicit?
- If composable, has the purported interoperation been tested rather than guessed?
- Can it be rebuilt, replaced or downgraded with documented effects?
- Does an independent judge accept the stated maturity and evidence scope?

No one test or file suffices for every pack class. A pure study or negative-result pack demonstrates that its research method, observations and falsifier can be independently evaluated; it need not export a binary.

## Required track-level deliverables at each closed round (without pack quotas)
Each track must leave:
- A versioned independently inspectable **portfolio snapshot** of its strategy, current reference realization, candidate and verified capabilities, gaps and major source/evidence basis.
- All newly released packs or clear explanation that no contribution yet qualified; never fabricate a pack to satisfy a count.
- All completed experiments, failures, numerical and missing cost fields and decisions about whether/how pack boundaries changed.
- Exact linkage from experiments to revisions, accepted/rejected mechanisms and next questions; A/B independent assimilation and C's lag rule apply.
- Runnable/inspectable reference composition evidence at the maturity claimed, with step-by-step clean-room reproduction.
- A discoverable route from any track-level capability claim to its pack/evidence source, without relying on live memory.

The format/filename of these materials is up to the builder as long as they can be audited and consumed. Existing mandatory experiment-arm counts and independent judgement remain unchanged.

## Portfolio-level graduation test
Independently bootstrapped auditor receives only a frozen track release, the common Ω task contract and declared outside dependencies. It must:
1. Determine available capabilities without a private explanation;
2. Select one useful pack;
3. Run/examine it as intended and reproduce its scoped evidence;
4. Remove/hide origin-specific session and workspace state;
5. Recover or safely fail after one relevant change/fault;
6. Locate current/retired competing implementations and their trade-offs;
7. Integrate a suitable pack with another released pack, **if** interoperability was claimed;
8. Produce a truthful machine/human-readable gap report.

A track only graduates when it demonstrates meaningful Ω/ECP value under independent test. Three beautiful portfolios with no actual useful behavior are not the sought end state.

## Benchmark consequence
Keep **pack-level evaluations** (does claimed bounded functionality work, costs and interoperability) separate from **system-level comparisons** (does an assembly or track reference deliver accepted software faster/better?). C operates benchmarks; independent Truth signs. Do not add pack scores to assert system throughput: integration and overlap can change the outcome completely.

## Normative clarification (2026-10-11): every pack EVERY turn irrespective of maturity

The earlier language concerning newly released or qualified packs is **not** a publication gate. Every operating A/B/C track and independently launched proposal-specific development session MUST publish its ENTIRE existing pack portfolio at the end of EACH top-level development turn, including DISCOVERED, EXPERIMENTAL, BLOCKED, FAILED, PAUSED, VERIFIED, PORTABLE, COMPOSED, REJECTED, RETIRED and UNCHANGED items. Pack content, even drafts, partial implementations and failing test results, must be retrievable and versioned. Unchanged packs may reuse verified immutable content-addressed references. Publication alone makes **no** claim of verification. A controller with zero current packs still publishes its truthful zero-pack inventory. See ../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md; that contract governs any conflicting older wording about maturity, pack counts or round-only release.
