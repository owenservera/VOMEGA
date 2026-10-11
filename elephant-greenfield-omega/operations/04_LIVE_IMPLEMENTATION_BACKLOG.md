# Minimal operationalization backlog, with evidence gates

The included mock harness proves only elementary contracts. This backlog lists the concrete machinery still needed to make the protocol **actually functional with AI sessions** and greenfield code development. Do not call E1/E2 live until completed.

## P0: launch-readiness (no Elephant)

- P0.1: provenance + action journal persisted to durable append-only JSONL; replay nonterminal states as `UNKNOWN_TERMINAL`; dedupe across process restart. Test power-loss simulation.
- P0.2: task IDs, arm identities, worker ownership, immutable first-pass submissions and output attribution. Test three source arms cannot cross-read answer caches.
- P0.3: create seeded clean Ω repo with `product/` core/adapter/UI stub and acceptance scripts (T1 first); freeze baseline and task bank before starting all arms.
- P0.4: full task timing and model usage instrumentation, independent reviewer contract, command proof collection.

## P1: first real Elephant

- P1.1: read-only provider adapter probe and resume/cancel/stop behavior with account untouched; label unsupported features.
- P1.2: git anchored deterministic pack builder, sorted source file list, blob hashes, hard path exclusion, symlink rejection, secret scan and size/token budget. Test key-file denial.
- P1.3: context session boot calibration with 5 source-specific questions and negative tests; persist session handle and pack ledger locally.
- P1.4: deadline-bound ECP envelope, schema check, journal, actual request/result, citation validation against commit blobs, stale basis computed from git.
- P1.5: worker T1/T2 code lifecycle and Elephant REVIEW after a real patch with independent verifier.
- P1.6: flux management: STALE status, sync verified delta, rotation/new session + calibration, crash recovery and E0 fallback.

## P2: two truly concurrent Elephants

- P2.1: two independently addressable sessions with different packs, overlapping contracts and verifiable parallel in-flight requests.
- P2.2: deterministic relevant-domain routing based on manifest path ownership plus dependency table; E2 fallback on unavailable node.
- P2.3: two-claim contradiction object + independent test/falsifier, version misalignment warning, no implicit consensus.
- P2.4: limits: max 2 nodes, one in-flight call per node initially, hop count, shared deadline, cancellation and provider backpressure.
- P2.5: accepted shared-contract migration updates both relevant manifests/ledger positions and recalibrates before high-risk consult.
- P2.6: evaluation run repeats tasks with E0/E1/E2, blind scorer and cost/latency baselines.

## P3: only if proved valuable

Adaptive domain splitter/merger, implicit knowledge graph, predictive reload, context cache optimizer, node-to-node RPC, persistent router service, model-specific compaction, candidate patch author mode, automated novelty invention extraction. All are possible future experiments, not dependencies for P0-P2.

## Level-of-evidence definitions

`DESIGNED` = described; `MOCK_TESTED` = local simulation tests; `LIVE_ADAPTER_TESTED` = real AI session invoked; `INTEGRATED` = accepted product code + tests; `BENCHMARKED` = replicated matched comparison; `PROVED_USEFUL` = sustained adjusted benefit. Promoting code to a higher level without evidence is a protocol incident.
