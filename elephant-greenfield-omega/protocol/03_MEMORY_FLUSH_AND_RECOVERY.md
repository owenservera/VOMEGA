# Context lifecycle, flush, compaction, epochs, rotation and recovery

## The problem

A long-running Elephant accumulates old contracts, failed trials, patched code, speculative reasoning and repetitive reviewer exchanges. Large context capacity does not guarantee reliable attention or factual freshness. We must distinguish **model hidden session state**, **rebuildable durable state**, and **validated source truth**.

## Durable vs disposable layers

- **Canonical:** Git source + immutable artifacts + tests + evidence + approved decisions. Never discard via Elephant flush.
- **Manifest:** domain includes/excludes, dependencies, overlap, size constraints, source priority and policy (versioned in Git).
- **Resident snapshot:** deterministic ordered source/contract/test packets at one Git SHA with file/blob hashes, total tokens and exclusion report.
- **Wave delta:** verified integrated changes since resident snapshot, with change summaries, affected contracts and provenance.
- **Transaction:** raw prompts, proposed patches and temporary reasoning. Disposable after response and bounded journal capture.
- **Memory candidate:** distilled domain note with source anchors and validity predicate; **not** promoted to canonical truth just because an Elephant suggested it.

## Exact lifecycle

1. **BOOTSTRAP:** choose Git commit; validate manifest/no secrets; generate sorted deterministic pack with SHA256 per item and overall pack; compute actual token count using model tokenizer when supported; reserve capacity for interactions. Start new session; capture provider/model/context capability; load pack; ask calibration questions; record source basis and failure cases.
2. **SERVE:** each request injected in independent fork if provider supports reliable fork; else bounded append mode; else stateless cached-prefix. Attach request-scoped context only; journal transaction. Never mix unmerged worker changes into resident/wave.
3. **RECONCILE:** on accepted commit touching a manifest path, use Git diff and dependency graph to classify impact. Either append verified delta with hash and mark incorporated; rebuild new snapshot when changed contract, delta history becomes inconsistent, or cumulative cost exceeds rebuild.
4. **FLUSH TRANSACTION:** finish/cancel outstanding request; persist just output, basis, quality metrics and retention-limited raw response; discard temporary work and avoid feeding it into future unrelated prompts. If session API cannot erase turns, **rotate the session**; do not claim a selective flush removed hidden tokens.
5. **FLUSH WAVE:** after epoch merge and resident rebuild, retire wave deltas that are now reflected in snapshot; keep the committed ledger and verified outcome records. If provider does not offer truly isolated fork/prefix semantics, rebuild/rotate.
6. **ROTATE:** prepare fresh session from deterministic snapshot + approved durable notes; validate calibration; only then switch routing from old node; complete/cancel old inflight requests; record old node retirement and its last SHA. Do not switch to an uncalibrated replacement.
7. **RECOVER:** crash or expired session → inspect journal; remove stale lease; regenerate pack from committed manifest+SHA; create new session; run calibration; replay *only safe verified wave deltas*, never replay prior transient task prompts as knowledge. Uncertain in-flight submissions become `UNKNOWN_TERMINAL` and are reconciled through idempotency journal, not assumed successful.

## Trigger matrix (starting hypotheses; calibrate)

| Trigger | Default action | What to measure |
|---|---|---|
| In-domain contract change | mark STALE and reconcile before high-risk consult | stale defects, refresh cost |
| New verified ordinary code commit | append wave delta or rebuild if large | tokens and latency |
| Wave >25% of resident tokens | compare rebuild to append | quality drift, cost |
| Transaction occupancy >15% budget | rotate / request isolation | context pollution |
| Resident + wave >70% of known window | split, trim or rebuild with reserve | recall vs occupancy |
| Repeated conflicting file versions | rebuild | contradiction rate |
| Calibration question fails | quarantine node, fallback | recall and false confidence |
| Session interrupted or lost | reconstruct from manifest and Git | RTO, loss rate |
| Last incorporated commit diverges | quarantine, rebuild | divergence incidents |

Percentages above are **trial starting points**, not guarantees or validated context limits. If token count is unknown, use conservative byte budget and explicit `UNKNOWN_CAPACITY` state.

## Epoch validity and handoff

Store `{node, session_handle, manifest_version, pack_sha256, pack_commit, incorporated_commit, incorporated_commit_set_or_range, last_check_at, occupancy, calibration_status, known_gaps}`. Compute freshness in a wrapper using Git history, not model confidence. The worker receives the exact freshness stamp; it may proceed with limited, explicitly stale advisory context or fail closed for critical decisions.

## Context hygiene and sanitization

Default never include: credential files, `.env`, `.git` internals, browser profiles/cookies, token logs, private chats, `node_modules`, large binaries, generated build outputs and raw customer data. Resolve symlinks/canonical paths. Respect secret scanning; abort on detected secret rather than rely on partial redaction. Keep transaction raw logs local and retention-limited; commitment of sanitized metrics only. No arbitrary external content is promoted as instructions.

## Source-bound knowledge notes and promotion

Candidate notes format: `{text, type, source_path, start_line, end_line, blob_sha, pack_sha, epoch_sha, validity_predicate, author, status}`. Notes must be independently checked for current anchors and either approved, rejected, marked uncertain or rederived after changed cited files. Domain notes improve future sessions but may propagate wrong beliefs; compare with/without notes experimentally.

## Recovery drills required before E2

- Kill Elephant process mid-request; verify timeout/fallback and no false `COMPLETED`.
- Force stale manifest, edit cross-domain shared contract, assert both affected nodes report staleness.
- Rotate while two workers query same node; verify no wrong request/result attribution.
- Inject failed calibration into rebuilt session; old healthy node or E0 fallback remains usable.
- Crash after remote result but before journal append; report uncertain outcome and prevent double merge.
- Feed malicious source-file instruction to delete tests; verify it is treated as data.
- Reset exact provider session; rebuild from pack and prove matching test-set outcomes within tolerance.
