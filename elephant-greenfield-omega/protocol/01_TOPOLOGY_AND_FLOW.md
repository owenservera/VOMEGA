# Topology and protocol flow, E0 → E1 → E2

## Invariants across all arms

Repository/Git + build/test/runtime are authority; provider sessions are not. Task coordinator assigns one source workspace owner at a time. Shared main is integrated serially. No worker must wait for an Elephant beyond a finite deadline. Elephants must return source basis and evidence pointers or uncertainty, not pronouncements.

## E0: 0 elephants

```
Owner → Task queue → Worker(s) → Git worktrees → Tests/independent review → arm-main
                    ↑           ↕
            task context pack  local source/tools
```
- `consult` routes to `FALLBACK_DIRECT_SOURCE`, not an invented Elephant. There is no domain-resident model session.
- Worker reads source, uses static tools, edits its own worktree, tests, submits change. Log reconstruction time and quality.
- Use the **same worker/model**, where available, for E1 and E2; track or normalize extra Elephant tokens/latency.

## E1: 1 elephant

```
Git main → immutable domain pack → [Elephant A: read-only resident] ← epoch reconciler
                                       ↕ REQUEST/RESPONSE
Owner → Task queue → Worker(s) ↔ ECP wrapper → advisory result
                          ↓                ↘ E0 fallback on timeout/stale
                  own worktree → tests/review → arm-main
```
- Choose `command+execution` as one coherent initial domain because T1/T2/T4 share contracts. The Elephant's corpus is not all of `product/` by default; its domain manifest is observable and adjustable.
- Worker may submit `ASK`, `REVIEW`, `IMPACT`, `TRACE`, `EXTRACT`, `PROPOSE_PATCH`.
- Retain zero client-facing model authority beyond producing a candidate artifact.

## E2: 2 elephants, **simultaneous**, with explicit boundary

```
                   Git + accepted evidence @epoch K
                        ↓               ↓
                  domain pack A    domain pack B
                        ↓               ↓
             Elephant A (core)   Elephant B (surface/execution)
                        ↘          ↙
                   ECP coordination layer
                       ↑         ↓
                  Workers / Task queue
                      ↓
        isolated code edits → tests/review → arm-main
```
- Start with `E-A: command/contracts` and `E-B: executor/surface` with **overlapping canonical contract references** but separate resident context.
- A worker can ask both concurrently when impact crosses boundary; results remain separate and provenance-tagged.
- Cross-consult strategy v0: coordinator issues two requests and collects responses; **no autonomous infinite Elephant→Elephant chains**. Later enable one delegated call with hop limit 1, fanout limit 2 and shared deadline, if it pays.
- On contradiction: disagreement record `{claimA, claimB, source_basis, disputed_contract, proposed_falsifier}` and independent proof. Never merge opinions.
- If B dies, E2 degrades to E1 or E0; topology and degraded result are logged rather than silently labeling a request E2.

## Call sequence (simplified)

1. Worker sends `HELLO`/capability requirement or task envelope. Router computes domain match, basis, freshness, load and deadline.
2. Router returns `ROUTE` with target node, expected source basis and confidence in routing; MAY request two nodes or E0 fallback.
3. Wrapper validates request identity, allowed artifacts, size, secrets policy, timeout and idempotency key.
4. `REQUEST` is persisted in a local append-only journal before dispatch. At-least-once transport is tolerated through dedupe.
5. Elephant executes bounded consult; emits `ACK`, optional `PROGRESS` and terminal `RESULT`, `REJECT`, `STALE`, `TIMEOUT`, `CANCELLED` or `ERROR`.
6. Wrapper verifies schema, epoch, required source anchors and outstanding task status; journal writes terminal decision.
7. Worker uses advice, edits code, runs tests. Any `PATCH_PROPOSAL` goes via quarantined artifact review and worker application.
8. Verified merge yields an epoch-change event. Affected Elephants move `FRESH→STALE/RECONCILING→FRESH`; unmerged changes never enter resident truth.

## Message states

`CREATED → ACCEPTED → RUNNING → (COMPLETED | REJECTED | STALE | TIMEOUT | CANCELLED | ERROR)`.
No other transitions. Terminal states cannot be overwritten; retries share the same idempotency key and return the original terminal result. An execution attempt can be superseded with a new request ID, preserving the causal link.

## Lifecycle states

`UNINITIALIZED → BOOTSTRAPPING → CALIBRATING → READY → (STALE | BUSY | DEGRADED | FLUSHING | REBUILDING) → READY`. `RETIRED` is terminal. Calibration tests are required after bootstrap/rebuild. READY does not imply canonical correctness; it indicates a correctly based, responding node.

## Design tradeoffs to settle experimentally

- Single remote session vs reconstructable cached prefix.
- Contextual resident source vs generated evidence-linked semantic graph.
- Synchronous blocking consult vs asynchronous hint/review.
- One mixed-domain Elephant vs two specialized Elephants.
- LLM-driven routing vs deterministic domain matching then optional escalation.
- Near-constant refresh vs epoch/wave batching.
- Two different model providers vs same model replicated.
