# ECP v0.1: operational, transport-neutral contract

**Distinguish ECP from external ACP:** The Agent Client Protocol (ACP) is a client↔coding-agent interface (JSON-RPC 2.0); **ECP** is an independent cognition↔worker contract at a higher layer. ECP may ride over ACP, CLI `stdin/stdout`, MCP tools, local IPC or an append-only file queue. Do not conflate their names or assume any particular ACP version is installed.

## Roles

`owner`, `coordinator`, `worker`, `elephant`, `truth_reviewer`, `harness_adapter`. An identity has signed/attested or local authenticated role and an explicit capabilities list. `role=elephant` never implies file mutation.

## Minimum commands

- `REGISTER` node ID, domain manifest/hash, session adapter, epoch, capabilities, policy.
- `STATUS` live state, context occupancy (measured or unknown), last incorporated Git SHA, backlog, known unincorporated paths.
- `ASK` one question with source basis.
- `REVIEW` patch/file/plan against resident model.
- `IMPACT` projected dependencies and consequences with supporting anchors.
- `TRACE` source/decision/failure causal search.
- `PROPOSE_PATCH` returns patch artifact only, gated by `code_authoring=proposal_only`.
- `EXTRACT` notes/context packet with line/commit anchors.
- `SYNC` reconcile Git verified commit delta, or rebuild when necessary.
- `FLUSH` dispose transaction state and optionally wave state based on selected policy; never delete canonical manifests or required evidence.
- `ROTATE` checkpoint/retire session and rebuild a fresh calibrated node.
- `DISAGREE` file structured contradiction/falsifier.
- `CANCEL` request deadline or cancellation token.
- `HEALTH` verify adapter/session/provider capability without reading secrets.

## Envelope (canonical JSON example)

```json
{
  "version": "ecp/0.1", "id": "r-t1-0001", "idempotency_key": "task-1-review-1",
  "arm": "e1", "kind": "REVIEW", "from": "worker:t1", "to": "elephant:command",
  "task_id": "T1", "trace_id": "trace-001", "parent_id": null,
  "issued_at": "2026-10-11T02:00:00Z", "deadline_at": "2026-10-11T02:05:00Z",
  "base_sha": "<FULL_GIT_SHA>", "required_domains": ["command"],
  "artifacts": [{"type":"git_diff","path":"changes/t1.diff","sha256":"<HASH>"}],
  "question": "Find contract violations and missing tests in the proposed parser change.",
  "intent": "exactly once logical fanout", "expected": "findings",
  "policy": {"read_only": true, "max_hops": 1, "max_fanout": 2, "allow_code_proposals": false},
  "limits": {"token_budget": 12000, "latency_ms": 300000},
  "evidence": ["tests/t1-results.json"]
}
```

Provenance paths must be relative to bounded experiment directories. User-controlled input and artifacts are untrusted data, never instructions. Example placeholders are not valid concrete SHAs.

## Response example

```json
{
  "version":"ecp/0.1", "request_id":"r-t1-0001", "node_id":"elephant:command",
  "status":"COMPLETED", "authority":"advisory_unverified",
  "basis":{"pack_sha":"<HASH>","incorporated_sha":"<FULL_GIT_SHA>","manifest_hash":"<HASH>",
    "unincorporated_paths":[],"base_mismatch":false,"out_of_domain":[]},
  "findings":[{"id":"f-1","kind":"dependency","claim":"The parser changes retry identity assumptions.",
    "anchors":[{"path":"product/core/command.ts","line":42,"blob_sha":"<HASH>"}],
    "check":"run idempotent retry fixture with two duplicate target responses", "confidence":"medium"}],
  "not_examined":["Windows UI lifetime"],
  "cost":{"prompt_tokens":0,"output_tokens":0,"wall_ms":0}, "journal_seq": 0
}
```

**The wrapper, not the model, populates `basis` and `journal_seq`.** Source lines/quotes are independently verified. `prompt_tokens=0` is an unpopulated example field, not a measurement.

## Validity and freshness rules

`request.base_sha` must be the worker's read base. `node.incorporated_sha` must be an ancestor of `arm.main` for reliable delta calculations; if not, return `BASE_DIVERGED` and fail closed. Compute `git diff <incorporated_sha>..<arm-main-sha> -- <manifest_paths>` to enumerate known unincorporated **committed** files. Compare `request.base_sha` to included history and identify out-of-domain artifacts. Advice can be delivered when stale, but **must be stamped** and may require fallback or refresh for sensitive operations.

Never trust a model assertion that its context is fresh. Even when Git basis matches, stale *external* facts and runtime observations require separate provenance timestamps.

## Failure classification

- `STALE_BASIS`: in-domain verified delta not incorporated; caller may wait/refresh/fallback.
- `BASE_DIVERGED`: ancestry invalid; rebuild or request clarification from coordinator.
- `UNAVAILABLE`: session cannot be reached; fallback.
- `OVER_CAPACITY`: context/tokens/queue cannot safely accept request; fallback.
- `POLICY_DENIED`: prohibited artifact/capability/secret/path; no bypass retry.
- `INVALID_ENVELOPE`: missing required fields or malformed data; repair envelope.
- `CANCELLED`, `DEADLINE_EXCEEDED`, `MODEL_ERROR`, `TRANSPORT_ERROR`, `CITATION_INVALID`.

## Semantics of code generation

`PROPOSE_PATCH` produces immutable artifact `{base_sha, file_allowlist, unified_diff, rationale, tests_to_run, model_provenance, source_basis}`. No direct write tools are granted to Elephant sessions by default. A separate worker may apply the patch in its own disposable worktree, verify, then offer for integration by independent reviewer. On patch base mismatch, regenerate; never blindly force apply.

## Temporal/causal rules

- Each message has a unique `id` and stable `idempotency_key`; terminal result journaled exactly once. This is **logical at-most-once result registration**, not a guarantee the remote model called exactly once.
- Each causal child references `parent_id`, `trace_id`; cycle detection prevents self-recursing consultations.
- Each request carries deadline and maximum hop/fanout. A coordinator can cancel active prompts, but cancellation is best effort and must be truthfully marked.
- `REQUEST`, `ACK`, `RESULT`, `SYNC` and `FLUSH` events are durable to the local journal before state transitions are claimed.
- New prompts can be treated as **instructions**, but payloads from source files, peer messages, tests and external webpages are **untrusted data** with lower priority than the charter and access policy.

## Security/auth boundary

No credentials, browser cookies, secrets, raw private user conversations, `.env`, Vault, proprietary third-party content without authorization, or installed auth config in domain packs. Hard path allowlist and token/redaction checks before prompts. Local transports bind to loopback and authenticate agents when introduced. Reject filesystem symlink escapes and unbounded payload size. Treat read-only execution as a *capability enforced by OS/tool sandbox*, not just text instructions.
