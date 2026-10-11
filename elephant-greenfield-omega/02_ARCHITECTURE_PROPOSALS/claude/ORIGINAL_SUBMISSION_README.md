# outputs/claude — first-pass architect submission (Greenfield Ω, E0 → E1 → E2)

**Role:** claude-architect, written without seeing the other submissions · **Date:** 2026-10-11 · **Protocol:** ECP v0.2 (proposal)
**What is real here:** a 32-test simulated kernel (real Git, real journal, scripted model adapters) and six deterministic event traces. **What is not:** any live model session, any measurement, any speedup, the product itself.

## Reading order

| # | File | One-line purpose |
|---|---|---|
| 1 | `ARCHITECTURE.md` | Roles, components, topologies, state machines, invariants, 18 ADRs, six flows |
| 2 | `ECP_SPEC.md` | v0.2 grammar, validation order, statuses, idempotency, citations, disagreements, adapter rules |
| 3 | `FLUSH_RECOVERY.md` | Capsule build, boot/calibrate, flush ≡ rotate, reconcile, crash/session/provider recovery |
| 4 | `WRITING_AND_TRUTH.md` | Truth hierarchy, authority matrix, worktrees, patch escrow, integration, real read-only |
| 5 | `FAULT_MATRIX.md` | 46 faults: 33 simulated oracles, 3 open gaps, 10 live drills |
| 6 | `TRADEOFFS.md` | Transport, session substrate, routing, topology, wave vs rebuild |
| 7 | `EXPERIMENT.md` | Arms and controls (A, B, R, C, E1-S, E1-P, E2-S, F), metrics, cost model, falsifiers |
| 8 | `INVENTION_CANDIDATES.md` | 12 mechanisms with prior-art families; no novelty claimed; disclosure warning |
| 9 | `BUILD_SEQUENCE.md` | S0–S7 with estimates, gates, Windows verification points, owner decisions |
| 10 | `SELF_CRITIQUE.md` | Strongest case against Elephants, smallest falsifying test, charter objections, risks |
| – | `kernel/`, `traces/`, `schemas/` | Reference implementation, generated traces, JSON Schemas |
| – | `submission.json` | Machine-readable summary per `prompts/RESPONSE_CONTRACT.md` |

## Five positions that depart from the pack

1. **An Elephant is a capsule + adapter + ledger, not a chat.** Default session mode is stateless per request; persistent sessions are a measured variant (E1-P). This makes "flush" honest: a no-op or a rotation, never a claim of erasure.
2. **Staleness is computed by the wrapper twice** — at dispatch and on arrival — from Git, with path classes (NONE / PERIPHERAL / CONTRACT / DIVERGED). CONTRACT staleness fails closed for review-type requests.
3. **Findings must quote the source**, and the switchboard checks the quote against the blob. Two nodes disagreeing produces an open record that only a test can close; there is no consensus.
4. **Fewer mechanisms:** no wave layer, no router node, no Elephant→Elephant calls, no FLUSH command, 4 model-facing kinds instead of 15.
5. **The experiment as chartered can't separate capsule value, protocol value, persistence value and extra compute** — and Mini is too small to test throughput fairly. Added arms and a context-pressure stage fix that.

## Run

```
node --test outputs/claude/kernel/kernel.test.mjs   # from the pack root; expect 32 pass, 0 fail
node outputs/claude/kernel/demo.mjs                 # regenerates traces/ byte-identically
```
Verified on Linux (Node 22.22, Git 2.43). Not yet run on Windows.

## Claim labels used throughout

`DESIGN` · `SIMULATED_TEST` · `LIVE_TEST` (none) · `MEASURED` (none) · `SPECULATION`. Pack labels map as: `MOCK_VERIFIED` ≈ `SIMULATED_TEST`; nothing here reaches `ADAPTER_VERIFIED`.
