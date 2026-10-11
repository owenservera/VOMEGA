# TRADEOFFS — transport, session substrate, routing, topology

**Status:** `DESIGN` comparisons; choices marked "v0.2" are what the kernel and build sequence assume. None of the alternatives is ruled out permanently — each has a reversal trigger.

## 1. The real question is not "which protocol" but "where does state live"

Every transport option below can carry the same ECP envelope. What differs is (a) who holds session state, (b) how many processes the operator must keep alive on Windows, (c) whether a worker in *any* harness can reach it. Since workers run inside heterogeneous harnesses (Claude Code, Codex, ZCode, OpenCode, Grok), the lowest common denominator is **a shell command that reads/writes files**.

## 2. Transport options

| Option | Worker reachability | Operator burden (Windows) | Durability | Concurrency | Debuggability | Verdict |
|---|---|---|---|---|---|---|
| **T1 In-process library + CLI over a file queue** (`ecp/inbox/*.json` → switchboard → `ecp/outbox/*.json`) | Any harness with a shell tool | 1 long-lived switchboard process per arm, no ports | Files + journal | Switchboard serializes journal; per-node queues inside | `type` / `Get-Content` on JSON | **v0.2 choice** |
| T2 CLI per invocation (no long-lived process) | Any shell | None | Journal | Lock contention across workers; adapters can't hold sessions | Good | Fine for E0/PREFIX only; breaks APPEND and in-flight cancel |
| T3 Local service (named pipe / loopback HTTP) | Needs a client shim per harness | Service install, port/ACL, auth | Same journal | Native | Needs tooling | Upgrade path if T1 latency is a problem |
| T4 MCP server exposing `ecp_consult` as a tool | Only harnesses with MCP client configured | MCP config per harness (touches harness configs) | Same journal | Per MCP client | Tool-call logs | Optional facade in P2 for MCP-native workers; never the only path |
| T5 ACP as the ECP transport | Only ACP-speaking agents | ACP client implementation | Agent-side | Session-oriented | ACP logs | **Rejected as ECP carrier**: ACP is client↔agent; use it *inside an adapter* to drive an Elephant harness where verified |

Reversal trigger for T1→T3: file-queue round-trip overhead > 1 s p95 *or* > 5% of median consult wall time, measured in G2.

## 3. File-queue design (T1, `DESIGN`)

```
arms/e1/ecp/
  inbox/<worker>/<request-id>.json      # worker writes atomically: write .tmp then rename
  outbox/<worker>/<request-id>.json     # switchboard writes atomically; result or terminal error
  journal.jsonl, journal.jsonl.lock
  escrow/<sha256>.diff
  capsules/<domain>/<pack_sha>.txt      # local only, gitignored
```
* Worker CLI: `ecp consult --file req.json --wait 180` → polls outbox; on timeout it does **not** retry with the same key silently; it prints the request id.
* Per-worker inbox directories allow a Windows ACL per worker identity later (authenticating `from`).
* Rename-into-place is atomic on NTFS within a volume; the switchboard ignores `*.tmp`.

## 4. Session substrate (ADR-01)

| Substrate | Pollution | Recovery | Cost profile | Proves "resident value"? | v0.2 |
|---|---|---|---|---|---|
| Persistent APPEND session | grows; un-flushable | resume or rebuild; resume must be proven by nonce | low marginal input if the harness keeps state server-side; unknown | yes — this *is* the hypothesis | experimental variant **E1-P** |
| Verified FORK of a base session | none per request | refork from base; base rebuild on epoch | base load once; fork cost harness-specific | partially (base residency) | preferred when verified |
| **Stateless PREFIX** (capsule re-sent, provider prompt cache) | none | trivial | capsule tokens each call × cache discount *d* (provider-specific, unknown until measured) | no persistence — isolates capsule value | **default** |
| Retrieval + fresh reasoning (index, top-k files) | none | trivial | small | no | control (arm B variant) |
| Deterministic source graph / static analysis | n/a | n/a | near zero | no | control F |

Key consequence: E1-S and the pack's "control C" (fresh session with the same pack each consult) differ **only** by switchboard machinery (stamps, citation checks, calibration, disagreement records). That is deliberate — it separates *capsule value*, *protocol value* and *persistence value* into three measurable deltas (`EXPERIMENT.md` §2).

## 5. Routing

| Option | Pros | Cons | v0.2 |
|---|---|---|---|
| **Deterministic manifest ownership** | zero cost, reproducible, testable | misses semantic cross-domain impact unless worker asks both | **yes** |
| Dependency-table expansion (path → dependents → owners) | catches more cross-domain IMPACT | needs a maintained import graph | P2 (cheap with `tsc --listFiles`/import scan) |
| LLM router | flexible | non-reproducible, extra latency/tokens, another thing to validate | only if mis-route > 10% |
| Cost/benefit router (N07) | economically principled | needs measured priors that don't exist yet | P3, after G4 data |

## 6. Topology choices for E2

| Option | Pros | Cons | v0.2 |
|---|---|---|---|
| **Two domains, overlapping contract references** (`contracts` / `execution-surface`) | real boundary; shared contract makes both stale together | overlap costs tokens twice | **yes** |
| Two replicas of one domain, different providers | tests provider diversity | not a domain split; confounds H2 | separate experiment |
| One mixed node + one critic node | cheap | critic is just a reviewer; doesn't test residency | rejected for E2 |

## 7. Wave deltas vs rebuild (ADR-04)

| | Append wave delta | **Rebuild capsule** |
|---|---|---|
| Cost per epoch | small | capsule load + calibration |
| Correctness risk | old and new file versions coexist in context | none beyond normal |
| Implementation | delta ordering, compaction, "which version wins" rules | already implemented |
| Reversal trigger | – | rebuild cost > 25% of median consult cost **and** T7 shows no version confusion with deltas |

## 8. What I did *not* choose, and the strongest case for it

* **A local daemon with MCP + ACP from day one.** Strongest case: it's where tooling is heading and gives streaming/progress for free. Why not now: three more failure surfaces, harness-config mutation, and nothing in the experiment needs streaming. Revisit after G2.
* **Persistent sessions as default.** Strongest case: if accumulated Q&A genuinely improves answers, PREFIX throws that away. Why not default: it can't be flushed, rebuilt identically, or audited; E1-P keeps the hypothesis alive under measurement.
* **A knowledge graph instead of raw source capsules.** Strongest case: smaller, structured, diffable. Why not now: building and validating the graph is itself a project; at Mini scale raw source fits comfortably.
