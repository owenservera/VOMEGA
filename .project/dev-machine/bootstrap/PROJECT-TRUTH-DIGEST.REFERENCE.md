# VOMEGA project-truth digest

Captured 2026-10-05 23:52 CEST. Source: **HEAD `325be8929a5222232b8fce08ea79063f086705e1`** (main = origin/main, "docs: register complete meta-program tracker in Commons", committed 23:25 CEST).
Read: META-TRACKER.md, meta-tracker.json, agentic-launch/STATUS.md, SITREP.md, REALITY.md, COMMONS.md (+ grep of FIRST-WAVE.md, roadmap/TASKS.md, release-use-corpus.json). Everything else is unread.

## How to use the control surfaces
- `META-TRACKER.md` / `meta-tracker.json` = layer 1, the complete program map: **67 meta programs (MP-01..67) + 31 acceleration hypotheses (DA-01..31)**. The JSON keys are `programs[] {id,name,purpose,state,priority,owners,notes}`. Priority mix: 15 "NOW", plus about 9 "NOW/*" variants, and the rest NEXT/LATER/OPTIONAL. §5 lists the active convergence set (7 simulator threads + 4 live-path threads).
- `agentic-launch/STATUS.md` is the **only** mutable launch-state surface (claimed/running/completed). Claim format: owner/session/tool, source HEAD, worktree, status, expected handoff. On completion, record commit, tests, reviewer, proof level and downstream trigger.
- `roadmap/` = first-release task cards (74 tasks, M0–M10). `COMMONS.md` = coordination register and history (not current runtime inventory). `seed-docs/` is above all of these.
- Lanes (SDW/LNC/VFX/SKW/EXP/PRV/RTE/DEV/TRU) are ownership boundaries, not the program list.

## STATUS one-liner
The first fan-out is complete. DEV-L1 ran ≥6 bounded ZCode workers on `openrouter/auto` (model router-selected/unknown) **on Windows**. Locks A–D are candidates, the EXP baseline is a candidate, PRV (Lock E) is recon only, and RTE is ready/queued. TRU-L1 found everything safe as a candidate and **nothing safe to freeze**. No product code has changed and no live provider evidence exists.

## Known defects / gaps (repo evidence)
| Defect | Evidence |
|---|---|
| **False-READY (CMD-06 / corpus U1)** | `plugins/vivim-nlcl/test/fixtures/release-use-corpus.json` U1 `"send 'x' to Gemini"` → status `ok` with the required account slot unresolved. It is pinned as baseline `fail`, not fixed. Lock A falsifiers F2/F4 are invalid until it is fixed. |
| **prompt.send absent** | 0 occurrences in all 24 plugin manifests and plugin src. It exists only as design/corpus expectation. |
| **contentHash empty** | Empty in all 24 manifests, so source-anchor binding is unmet (blocks Lock D Phase-B). |
| Late-result revision protection | Designed (Lock C rule 6) but not evidenced. The corpus is single-input and there is no multi-revision runner. |
| `source:"fixture"` enforcement | Asserted, not evidenced (no runtime-sourced World). |
| Two default sources | `Account.defaultFor` vs `world.defaults` have no stated precedence. |
| EXP metrics | `falseReadyRate` / `wrongTargetRate` cannot be computed without a required-field spec. |
| Locks | A/B/C/D are CANDIDATE, E is RECON. None are frozen. VisualSpec extend-vs-replace is unresolved. |
| Runtime | Browser/provider is fixture replay. No Account binding. Durable Work is absent. Web root endpoints are unguarded. The broad suite is blocked (missing tooling/watchdog). |
| Harness note | Unbounded heavy background workers stalled; bounded (≤8 tool calls) workers completed. |

## Box verification at this HEAD (Linux, Bun 1.4.2)
- `omega:setup` ok; `omega:quick` **62 pass / 0 fail** (1622 expects). This matches the Windows-recorded 62/0.
- `bun test plugins/vivim-nlcl` **49 pass / 0 fail** (U1 passes because the defect is pinned, not because it is fixed).

## Ranked unblocked bounded tasks (dependency readiness)
Detail is in `first-wave-candidates.json`. Ranks 1–9 are ready now; rank 10 is wave 2.

1. **LNC-02 — CMD-06 false-READY fix.** This is the choke point, with a measurable red→green on U1. It has a single writer on the validator contract.
2. **SDW-02 — W1–W6 fixture Worlds + source-tagged loader + default-precedence rule.** Publish the precedence rule first, and LNC-02 consumes it.
3. **EXP-02 — required-field metadata + multi-revision corpus + late-result suppression test.** Additive; this makes the metrics computable.
4. **SKW-02 — Reflection Migrator slice 1** (read-only extractor + digests + graph + gap report, extracted vs inferred). It does not write manifests.
5. **TRU-05 — live-proof protocol.** No dependencies; it gates PRV live work.
6. **RTE-02 — GOV-06 web trust-boundary assay** (read-only).
7. **DEV-02 — thin worktree dispatch + run ledger.** Daintree/ZCode are absent on Linux.
8. **PRV-02 — Lock E Account-evidence contract draft** (no live attach).
9. **VFX-02 — VisualSpec extend-vs-replace memo + projector signature.** The implementation waits on LNC-02.
10. *(wave 2)* **EXP-03 — executable Ω Simulator skeleton** to SIMULATED prompt.send. Depends on 1–3.

Concurrency constraints:
- LNC-02 and SDW-02 share the precedence contract, so SDW should publish it first or both should take it from the doc.
- VFX implementation must wait on LNC-02.
- Everything else uses disjoint write sets under `omega-baseline/experimental/<lane>/` and `.project/agentic-launch/handoffs/`.
