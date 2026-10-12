# Team comms — two layers, one recommendation each

**Date:** 2026-10-12 · **Author:** lab-ops · **Path:** `DELIBERATION` — nothing here is ratified.
**Related:** [DECISION_PROCESS_TRACKER.md](../DECISION_PROCESS_TRACKER.md) DECQ-0002, DECQ-0010, DECQ-0011, DECQ-0012 · [protocol registry](protocol-backbone/README.md)

"Team comms" names **two unrelated systems** in this repository. Conflating them is the first thing to avoid, so they are separated here and given separate recommendations.

---

## Layer 1 — Elephant ↔ Elephant, inside the labs

**What exists:** the ECP (Elephant Consult Protocol). Two versions claim design-of-record (see [DECQ-0011](DELIBERATION_ELEPHANT_DEFINITION_2026-10-12.md)). Claude's v0.2 ships real logic — including two genuine authority constraints, **F23** (an `elephant:*` id may not originate a request) and **F24** (it may not review an accepted commit) — plus `anchors[].quote` verification against the blob.

**Why it is not real enforcement:** all of it lives inside a *simulated* kernel nobody runs. `claude/README.md:22` states zero live model runs and zero speedup evidence. So the repository's only machine-enforced authority constraint is not in production.

**What was built instead (Phase 4, committed):** actor separation is now enforced on **real runs**, at the fleet level, by `protocol-backbone/tools/registry.mjs`:

- a reviewing or adjudicating pass may not share an `actor` with the arms it judges;
- a run declaring `BLIND_DISCOVERY` may not share an `actor` with any other registered run.

This is the same discipline as F23/F24, applied to artifacts that exist. Two tests prove it fires.

**The limit, stated plainly:** this catches a false declaration and a reused actor. It **cannot** detect undisclosed reading. Arm D read 60 lines of arm B's run note before designing its traps and *disclosed it*; nothing machine-checkable would have caught that if it had not. **That failure mode needs disclosure, not a validator**, and no amount of checking closes it. Claiming otherwise would be the exact overreach this project forbids.

**One finding worth recording:** the first version of this check fired on the fleet's own receipts, because I had logged `lab-ops` as the actor for *reproduction* passes — re-running arms B and C entry points to verify their claims. A later actor reproducing someone's work is the opposite of contamination; it is the independent check the receipt exists to support. The fix was to model reproduction events out of the exposure comparison, not to loosen the rule. The check found a genuine ambiguity in the data model rather than a genuine violation.

**Recommendation: BUILD, here, now.** Enforce F23/F24-style separation on real receipts. Consider promoting Claude's `anchors[].quote` idea — "a line number alone cannot be checked for meaning; a quote can" — into the receipt contract, so every claim's witness is anchored to quoted text rather than a mutable line number. **Not done: it is an owner choice about which ECP grammar governs (DECQ-0011).**

---

## Layer 2 — the ZCode staff lanes

**What exists:** `.project/staff/` — six named roles (Owen, CoS, DEV, DEVops, PM, COUNCIL), ten allocation "lanes", the RACI, the DESK append-only JSONL protocol, five heartbeat automations, a watcher convention, and a `ops/local-state` telemetry branch.

**What is actually enforced: nothing.** Verified 2026-10-12:

| Mechanism | Enforcement | State |
|---|---|---|
| Ratchet (gates, leases, reviewer separation) | **code** | intact but unused since 2026-10-09; board projection stale |
| DESK protocol + one-writer rule | prose only | no validator exists; a malformed directive is permanently stuck in every inbox |
| RACI | prose only | `RACI.md:31` itself says it "grants no authority by itself" |
| Ten-lane roster | prose + a `mkdir` script | `init-product-loop.mjs` creates empty files only |
| Five heartbeats | outside git | live in ZCode's scheduler, not reproducible from the repo |
| Watchers | prose only | a pasted Bash one-liner; recorded failure: a watcher was not re-armed and a directive sat ~5 h |
| Stuck detection | prose only | commissioned 2026-10-09, **no code exists** |
| Cost guard / TEAM-HALT | **absent** | zero hits repository-wide |
| `ops/local-state` telemetry | none, and **no snapshot exists** | published once, 2026-10-06 |

Last real DESK traffic was **2026-10-09**.

**Recommendation: DO NOT BUILD — reconcile instead.**

Three reasons, in order of weight:

1. **It is historical for greenfield.** REV-007 (`CANONICAL_DEVELOPMENT_CORPUS.md:6`) makes D1/Ratchet and the staff documents *historical reference*, explicitly "not its governing build authority". Building new coordination on a substrate the owner has already scoped out would be building on a deprecated base.
2. **It is not needed for the labs' own work.** The Gym operates through slices, receipts and a registry — none of which touch DESK, RACI or the lanes. Adding a comms layer there would be building a second coordination system beside the first, which `INVARIANTS.md` warns against ("Forge is an extension mechanism, not a second authority system").
3. **Nearly every mechanism is prose-only, so "building" it means inventing a substrate that does not exist yet** — a substantially larger decision than a comms improvement, and one that should not be taken by an agent.

**What *should* happen instead:** a documentation reconciliation pass that records, for each mechanism above, whether it is LIVE, HISTORICAL or ABANDONED — so the next reader does not mistake an unwritten-down dead system for a working one. That is `DOCUMENTARY_RECONCILIATION`, which the tracker permits an agent to do without a new decision, and it does not invent authority.

**If Owen wants a live team surface for the labs specifically,** that is a *new, small* thing and should be scoped separately: a single append-only, hash-chained lab ledger with one writer, reusing the proven shape from `claude-zai/runtime/pack/team/tools/` (`round.mjs`, `ledger.mjs` — hash-chained, fsync'd, single-writer). Do not retrofit DESK.

---

## Summary

| Layer | Recommendation | Status now |
|---|---|---|
| Elephant ↔ Elephant | **Build** — actor separation enforced on real receipts | Done and committed; F23/F24 equivalent now real |
| ZCode staff lanes | **Do not build — reconcile the docs** | Nothing enforced; historical for greenfield since REV-007 |
| Shared discipline beneath both | Already landed: witness provenance, bound-before-reporting, artifact custody, negative controls | Enforced by the lab validators |

**Still yours to decide:** DECQ-0011 (which ECP grammar governs), and whether `anchors[].quote` should become part of the receipt witness contract.