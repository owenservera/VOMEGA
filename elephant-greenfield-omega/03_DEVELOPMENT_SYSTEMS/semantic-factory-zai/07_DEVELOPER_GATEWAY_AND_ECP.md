# 07 — Product-Gated Developer Team and ECP Experiments

## Guiding promise

Coding agents may write **only narrowly bounded changes**. Their sole AI conversational counterpart for product/architecture/task instructions is their assigned Product Virtualization Elephant or its authenticated gateway. They can read the exact permitted source, inspect compile/test/runtime outputs and issue structured discrepancy reports. They cannot chat with Harvest Elephants, other worker minds, untrusted webpages as decision authorities or independently choose product scope. The constraint is enforced by tools/permissions, not merely instructions.

The Product Group's shared mental model must be externally materialized enough to be falsifiable. Otherwise this arrangement could magnify hallucinations. The model should expose pinned source commits, symbols, behavior contracts, read gaps, dependency relationships, rejected approaches and the verification basis. A human/independent evaluator can challenge Product Group conclusions by direct source checks.

## Product Model Revision (PMR)

Each Product Elephant / semantic stewardship session references a versioned PMR with:

- `pmr_id`, `git_sha`, `manifest_sha`, `semantic_contract_pack_sha`, `world_fixture_or_runtime_basis`, `source_epoch`, `domains`, `known_source_gaps`;
- current canonical semantic IDs and relations, implementation state, current test evidence, disputed/unknown claims, cross-Elephant agreement status;
- `last_calibration`, conformance probes, `current_ready_state` (fresh/stale/degraded), and exact immutable cited source.

The PMR is an **auditable model artifact**, not product runtime authority. Concurrent Elephants can carry differently scoped PMRs but must expose incompatibility at shared contract seams.

## Narrow Dev Work Packet (DWP)

A coding assignment should contain, at minimum:

`packet_id`, `round`, `ratchet_link`, `product_elephant_id`, `pmr_id`, `product_base_sha`, `goal`, `user_observable_contract`, `allowed_paths`, `allowed_symbols`, `forbidden_paths`, `dependency_refs`, `tests_required`, `held_out_acceptance_refs`, `effects_allowed`, `time_budget`, `scope_escalation_channel`, `completion_evidence_requirements`, `lease_ttl`, `reviewer_id`.

The gateway ensures only the valid leased worker can use the packet. The OS/tooling grants that worker write permission only inside its disposable worktree and allowlist. It can run explicit approved tools/tests. `allowed_symbols` is advisory unless mechanically enforceable; path boundary is enforced and test gates detect semantic violations. Changing policy/test files requires separate review scope. All worker calls and outputs are recorded by packet and source epoch.

A worker receives **only the subset of the Product model necessary for its scoped contract**, plus source anchors and context queries permitted under ECP. No need to preload the entire product into coding workers. On discovering a missing dependency, the worker emits `BLOCKED_DEPENDENCY`/`CONTRACT_CONTRADICTION`/`TEST_FAILURE`/`SOURCE_BASIS_STALE`; it does not quietly expand files or ask the Harvester to make an architectural choice.

## Controlled conversation topology

```
Harvest Elephant <-> [ECP-H + evidence gateway] <-> Product Semantic Group
                                                        |
                                                [DWP + ECP-P gateway]
                                                        |
                                Narrow Coding Worker <-> permitted source+tests
                                                        |
                                     Patch artifact + discrepancy + results
                                                        |
                          Product review -> independent truth judge -> integrator
                                                        |
                                     accepted Git epoch -> refresh Product group
```

A communication gateway may batch requests, compress responses or build semantic packets, but must preserve source anchors, question, response, maturity, model/epoch/trace, missing evidence and open contradictions. It cannot turn a speculative historical offer into a mandatory coding instruction.

## Proposed ECP extension messages (subject to experiment)

- `PRODUCT_MODEL_GET`: return scoped PMR, freshness and explicit unknowns.
- `HARVEST_NEED`: Product Elephant asks for a historical concept, variant, failure lesson or source-linked behavior, with target gap and falsifier.
- `HARVEST_OFFER`: historical Elephant returns anchored candidate knowledge, alternatives, conflicts and not examined.
- `HARVEST_FEEDBACK`: Product Elephant reports accepted-as-hypothesis / needs evidence / rejected / validated current behavior with exact basis.
- `SEMANTIC_CONTRACT_CHANGE`: accepted new/changed source contract impacts other Product Elephants and downstream views.
- `DEV_PACKET_ISSUED`: source-bound immutable DWP issued with strict write scope.
- `DEV_GAP`: coding agent declares missing contract, stale basis, impossible scope, failed tests or uncertainty.
- `DEV_PATCH_SUBMITTED`: diff + test evidence + explicit out-of-scope check.
- `EVALUATION_RESULT`: independent checks and all failures; not model vote.
- `SOURCE_EPOCH_ACCEPTED`: main-integrated commit triggers invalidate/reconcile across Product group and semantic library.
- `CAPABILITY_PACK_RELEASE`: published, independently content-addressed pack inventory and status.

Retain existing ECP `REGISTER`, `STATUS`, `ASK`, `REVIEW`, `IMPACT`, `TRACE`, `SYNC`, `ROTATE`, `DISAGREE`, `HEALTH`, etc. No requirement to invent duplicate transport; ECP is higher-layer message semantics, not synonymous with ACP/MCP/CLI transport. Hop, fanout, deadline and queue pressure remain bounded. Peer context is untrusted evidence. At-most-once logical result registration is not guaranteed exactly-once model execution.

## Fidelity test matrix

- **Contract obedience:** correct behavior delivered under constraints; no unauthorized path writes.
- **Model accuracy:** Product Elephant's proposed source/test claims independently verified against Git.
- **Worker challenge usefulness:** genuine contradictions sent back rather than silently papered over.
- **Outcome fidelity:** UI vs natural vs symbolic equivalence and correct authority, provider/account selection and attempted/completed state.
- **Scope efficiency:** minimal productive changed code, no repeated rediscovery, review/merge/rework time.
- **Fault recovery:** Elephant stale/timeout, worker reconnect, canceled lease, rejected patch, concurrent contract update.

Experiment to discover whether one central Product gateway should deliver packets, or typed domain gateways with a shared PMR consistency service. One strict default conversation interface is required; physical implementation is open.

## Merge and changefeed

Only independent verification and an authorized integrator advance the canonical product main. No permanent branches owned by Elephants or departments. Experiments may have temporary independent mains; workers use short-lived isolated worktrees. An accepted commit emits a source epoch change and exact changed-symbol paths; affected PMRs and semantic-library claims become stale until reconciled. No Elephant loads unmerged code as resident product truth, though it may inspect a patch temporarily in a review transaction.