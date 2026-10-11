# INVENTION_CANDIDATES — mechanisms that *might* be novel

**Status:** hypotheses. **No patentability or novelty claim is made.** "Prototyped (sim)" means a working simulation exists in `kernel/`; it says nothing about prior art.

> **Disclosure warning.** The pack's lineage points at a public GitHub repository (`reference/SOURCES.md`). Committing or pushing this file — or the kernel code that embodies these mechanisms — to a public repository is a public disclosure that can affect future patent rights in many jurisdictions. Get advice from an IP professional **before** publishing if protection is a goal. Keep this submission in a private location until then.

Each candidate: claim-style steps · technical effect to measure · nearest prior-art families · search queries · experiment · status. Mapping to the pack's ledger (N01–N15) is given.

---

### IC-01 Dual-stamp epoch validity for model findings (N01, N10)
**Steps.** (1) At dispatch, compute for node *n* the set Δ = `diff(incorporated_sha(n), main)` ∩ manifest(n), classify into NONE / PERIPHERAL / CONTRACT / DIVERGED using manifest contract globs; (2) gate sensitive request kinds on class; (3) on response arrival, recompute Δ' against the *then-current* main; (4) attach both stamps and `stale_on_arrival = (Δ' ≠ Δ)` to every finding set; (5) the model's own statements about freshness are never mapped into the stamp.
**Effect.** Stale-advice exposure detected even when the epoch moves during inference. Metric: stale-claim rate with vs without arrival re-stamp on T7.
**Prior art.** MVCC snapshot reads; optimistic concurrency validation; versioned RAG / "as-of" retrieval; cache validation headers (ETag). **Likely overlap is high on the concept;** possible distinction is the *path-class* gate tied to declared contracts and applied to generative output.
**Queries.** "language model output provenance commit hash staleness"; "retrieval augmented generation version snapshot validation at response time"; "optimistic concurrency validation LLM".
**Status.** Prototyped (sim) — F08, F09, F11.

### IC-02 Commit-blob capsule with residency nonce (N04, N15)
**Steps.** (1) Build the context pack exclusively from object-store blobs of a commit, sorted, with a deterministic digest excluding a per-build random nonce; (2) embed the nonce in the pack; (3) calibration must reproduce the nonce; (4) after a claimed session resume, the node must reproduce the nonce **without** re-injection for the session to be classified as reused; otherwise it is classified as re-prompted.
**Effect.** Distinguishes genuine session reuse from silent re-prompting; prevents working-tree contamination. Metric: misclassified resumes in drills.
**Prior art.** Reproducible builds; canary tokens; "needle in a haystack" evals; liveness challenges / nonces in authentication protocols.
**Queries.** "nonce challenge verify language model context retention session resume"; "deterministic context pack from version control commit".
**Status.** Prototyped (sim) — F19, F26, F29.

### IC-03 Transaction canary isolation probe (one-sided erasure test) (N03)
**Steps.** (1) Insert a fresh random canary into each request; (2) after *k* requests or before reuse, ask the node to enumerate canaries; (3) any recall = proof of cross-transaction retention → mark LEAKY and schedule rotation by budget; (4) absence is recorded as NOT_PROVEN, never as isolated.
**Effect.** Measurable, honest isolation status for opaque sessions. Metric: leak rate per session mode.
**Prior art.** Membership-inference tests; canary exposure metrics for memorization (e.g. "secret sharer" style); honeytokens.
**Queries.** "canary exposure context isolation chat session"; "detect cross-request context leakage language model agent".
**Status.** Prototyped (sim) — F28.

### IC-04 Quote-anchored findings with subject-keyed disagreement → falsifier obligation (N06, N08)
**Steps.** (1) Require each finding to carry `subject` from a versioned contract registry, a verdict from a closed set, a check, and anchors with literal quotes; (2) verify quotes against blobs at the node's basis; (3) group findings across independent nodes by subject; incompatible verdicts create an OPEN record holding both positions, their bases and proposed checks; (4) the record can only close with test evidence bound to a commit.
**Effect.** Converts multi-model disagreement into executable work rather than debate; lowers hallucinated-citation acceptance. Metrics: invalid-citation catch rate; time-to-resolution; defects found via disagreements.
**Prior art.** Debate/critique multi-agent systems; attribution/citation verification for RAG (quote matching); proof obligations; differential testing.
**Queries.** "multi-agent disagreement generate test case resolve"; "verify citation quote substring source document LLM"; "contract registry verdict aggregation code review agents".
**Status.** Prototyped (sim) — F13, F20.

### IC-05 Fenced epoch guard coupling integration events to cognition invalidation (N12)
**Steps.** (1) Only a lease holder with the current fencing token may advance main, fast-forward only, with evidence (tests passed, reviewer ∉ authors ∪ model nodes); (2) the same atomic journal event computes and records which cognitive nodes became stale and with which class; (3) rebuilds are scheduled from that event.
**Effect.** No integration path bypasses invalidation; no model can approve. Metric: untraceable merges = 0; staleness detection latency.
**Prior art.** Fencing tokens (distributed locks); merge queues; branch protection; CI-triggered cache invalidation.
**Status.** Prototyped (sim) — F10, F24. Novelty likely low; value is in combination.

### IC-06 Patch escrow with temporary-index apply check and attribution to acceptance (N09)
**Steps.** Model diff → policy validation (allowlist, protected globs, binary/mode/rename, added-line secrets) → `apply --check` against the requester's base using a throwaway index → content-addressed write-once storage → worker applies → reviewer ≠ author → acceptance event records `patch_authors`.
**Effect.** Model-authored code never touches a tree without a human/worker step; survival of model patches is measurable.
**Prior art.** Suggested-changes workflows; sandboxed agent PRs; signed commits; content-addressed stores.
**Status.** Prototyped (sim) — F22, F24. Novelty likely low.

### IC-07 Generation-labelled answers across blue/green cognitive rotation
**Steps.** Snapshot node identity (generation, pack, basis) at dispatch; rotation builds and calibrates g+1 before flipping routes; answers from g are labelled g.
**Effect.** No mis-attribution of advice to a newer knowledge state. Metric: attribution errors in rotation drills.
**Prior art.** Blue/green deployment; request pinning to versions.
**Status.** Prototyped (sim) — F27. Novelty likely low.

### IC-08 Contract-closure staleness from manifests (N02)
**Steps.** Manifests declare `contracts` globs shared across domains; any change to a contract path marks *every* node referencing it CONTRACT-stale; extend with import-graph closure (P2).
**Effect.** Cross-domain invalidation without semantic analysis. Metric: missed cross-domain staleness on T5.
**Prior art.** Incremental build systems (Bazel/Buck dependency invalidation); schema registries.
**Status.** Prototyped (sim, without import-graph) — F10.

### IC-09 Degraded-topology labelling per answer (N12)
`topology_planned` vs `topology_effective` + `degraded` on every result so scorecards can't attribute E1-quality answers to E2. Prior art: circuit breakers, partial results in federated queries. Status: prototyped (sim) — F01, F14.

### IC-10 Calibration-parity reconstruction test (N04, N15)
After rebuild from capsule, run the frozen calibration suite; accept the node as "the same Elephant" only within |Δscore| ≤ ε of its previous generation. Prior art: model regression evals; canary deploy metrics. Status: design (scripted calibration only).

### IC-11 Context ROI ledger and router (N07, N11)
Per (domain, kind, task class): record consult cost, acted-on findings, reviewer-confirmed value, false positives; route new requests to {direct source, capsule bundle, E1, both} by expected verified value per unit cost, with exploration. Prior art: contextual bandits, inference routers, cost-based optimizers. Status: hypothesis; needs pilot data.

### IC-12 Anchor-predicate note survival (N08)
Notes persist only while all their quoted anchors still verify at the current epoch; re-verification triggered by commit events touching anchor paths. Prior art: data lineage, provenance-aware caches, "guarded" memory in agent frameworks. Status: design.

## Recommended investigation order

1. **IC-01 + IC-08 + IC-12** (epoch-anchored validity across findings and memory) — clearest technical effect, cheapest to measure on T7.
2. **IC-02 + IC-03 + IC-10** (verifiable residency and isolation for opaque sessions) — addresses a real gap: no current harness *proves* resume or erasure.
3. **IC-04** (disagreement → falsifier) — only if E2 survives.

For each: write the claim steps as above, collect ≥ 5 closest references with dates, run the comparison experiment, and record status `HYPOTHESIS → PRIOR_ART_PENDING → PROTOTYPED → FALSIFIED | DIFFERENTIATED → COUNSEL_REVIEW`.
