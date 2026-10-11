# SELF_CRITIQUE — the case against Elephants, and against this design

## 1. The strongest argument that Elephants are unnecessary

The useful content of an Elephant is its capsule: a curated, current, scoped slice of the codebase. Everything else is cost. A worker given that same capsule at task start (arm B) has the same knowledge with **no** queueing, **no** second model, **no** staleness window between the node's basis and the worker's base, and **no** translation loss between "what the Elephant understood" and "what the worker needs". Provider prompt caching already makes re-sending the same prefix cheap, which removes the economic reason to keep a session warm. Persistent sessions make things worse over time: they accumulate stale turns that cannot be erased, which is exactly the failure the charter's own A7 forbids hiding. What remains is "a second opinion from a fresh reviewer", and a fresh reviewer with the same token budget (arm R) is an ordinary, well-understood practice. On a 2–5 kLOC product, the worker can read everything anyway.

In that framing, ECP is retrieval + caching + code review with extra ceremony, and the honest outcome is: **keep the capsule builder and the citation verifier; delete the runtime.**

### The smallest test that could prove me wrong
Pilot arms **B vs E1-S vs E1-P** on **T5 (schema migration with a hidden consumer) and T7 (contract change after snapshot)**, 2 variants each, one replication:
* If E1-S finds ≥ 1 more seeded cross-domain defect than B in ≥ 3 of 4 runs **at ≤ 1.5× tokens**, consultation adds value beyond context.
* If E1-P beats E1-S on verified findings per 1k tokens by ≥ 20% with no rise in stale claims, persistence adds value beyond consultation.
Cost: ~1–2 days after S4. If neither happens, stop building the runtime.

## 2. Where this design could be wrong

1. **Stateless-first may discard the very thing being tested.** If accumulated interaction context (questions asked, answers reviewed) is what makes a specialist good, PREFIX can't show it. Mitigation: E1-P exists and is measured. Residual risk: E1-P on a harness with weak resume may under-perform for reasons unrelated to persistence.
2. **Quote-anchored citations can be gamed.** A model can quote real text and draw a false inference (F38). VERIFIED might give workers false confidence. Mitigation: VERIFIED is labelled "text exists", precision is measured; but the label may still be over-trusted.
3. **Subject-keyed disagreement depends on shared vocabulary.** Two nodes describing the same issue under different subjects produce no disagreement record; the same subject with different meaning produces a false one. The contract registry helps but is a new artifact to maintain.
4. **Rebuild-on-epoch may be expensive at larger scale.** ADR-04 is justified at Mini scale; at 50 kLOC with frequent commits, wave deltas or partial rebuilds may be necessary.
5. **Heuristic secret scanning is weak.** It catches obvious tokens; it will miss custom formats. Fail-closed on a hit doesn't help on a miss.
6. **The file-queue transport adds latency and another directory of state** that can be corrupted by antivirus or sync tools on Windows (L6).
7. **Deterministic routing will under-route.** Workers may not know a change crosses domains, which is the case E2 is meant to catch. Import-graph expansion (P2) is not built.
8. **The kernel was only run on Linux.** Windows path, lock and fsync semantics differ; F35 is a known Windows-specific hole.
9. **Calibration suites can be overfit.** Regex-graded questions test recall of facts, not reasoning quality.

## 3. Objections to the master charter

1. **"≥ 25% wall-clock improvement" on Mini is not a fair test** of the premise (`EXPERIMENT.md` §1, item 1). Use Mini for mechanics and defect recall; add a context-pressure stage for throughput.
2. **E1 conflates three hypotheses** (capsule, protocol, persistence). Add arms B and E1-P; add R for compute matching.
3. **G2 as written requires a "live, resumed provider session".** Under a stateless-first design, resume is not required for a working Elephant. Proposed G2: "a live adapter + capsule reconstitution verified by nonce + read-only verified"; resume becomes the E1-P sub-gate.
4. **A7 should be stronger.** Not only "never represent compaction/flush as lossless", but "never represent a negative leakage probe as proof of isolation".
5. **The 0/1/2 invariant should count quarantined nodes.** Otherwise an arm can quietly cycle replacements.
6. **"Elephant may author candidate patches"** should not be in the first comparative wave at all; regime P adds a variable to every task it touches. Run it as a separate labelled comparison after W.
7. **The decision gates have no stop rule for E0 winning early.** Add: if the pilot's E1-S ≤ B on every metric, skip E2.

## 4. Numbered risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | No harness passes read-only verification | medium | blocks E1 | PREFIX via API with no tools; stop at MOCK_TESTED if none |
| R2 | Source sent to a provider without authorization | low | high | owner decision before S4; capsule scan; journal of what was sent (pack_sha) |
| R3 | Measured "gain" is compute, not context | high | misleading result | arm R; report tokens with every number |
| R4 | Tiny n produces noise read as signal | high | wrong decision | descriptive reporting; pre-registration; replications only after pilot |
| R5 | Operator overhead exceeds savings | high at Mini scale | cost | log operator minutes; kill criterion |
| R6 | Workers ignore staleness stamps | medium | stale defects | stale-claim metric; CONTRACT fail-closed |
| R7 | Provider model changes mid-arm | medium | confound | record model id per call; recalibrate |
| R8 | Cross-arm leakage via shared caches or human memory | medium | invalid trial | separate clones/caches; operator ≠ grader |
| R9 | Hallucinated-but-quoted findings over-trusted | medium | defects | precision metric; reviewer training |
| R10 | Journal/escrow corrupted by Windows file tooling | low | lost evidence | lock + hash chain; exclude dirs from AV/sync |
| R11 | Contract registry drifts from code | medium | false/missed disagreements | registry under ecp/ protected paths + review |
| R12 | Public disclosure of IP candidates | medium | lost option | keep private; counsel first |
| R13 | Control-plane work grows beyond the slice | high | waste | ADR deletions; P3 items stay out |
| R14 | E2 sessions are not really concurrent (serialized by account/provider) | medium | invalid E2 | verify overlapping timestamps in journal |
| R15 | Byte-based budget mis-estimates tokens | medium | context overflow | tokenizer counts when verifiable; 50% headroom |

## 5. What would change my recommendation

* E1-P clearly beating E1-S → make APPEND the default for that harness, add rotation by measured drift instead of budget.
* Live harness offering verifiable context editing → reinstate a real FLUSH.
* Context-pressure stage showing B degrading with size while E1-S doesn't → the Elephant premise holds where it was supposed to, regardless of Mini results.
