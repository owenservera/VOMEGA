# FAULT_MATRIX — 46 edge cases, expected behaviour, test oracle

**Legend — Oracle status:** `SIM ✔` = automated test in `kernel/kernel.test.mjs` (test name starts with the id) passes against scripted adapters and real Git · `LIVE` = needs a real harness/provider; drill specified, not run · `OPEN` = known gap, behaviour not yet enforced.
Run: `node --test outputs/claude/kernel/kernel.test.mjs` → 32 tests, 0 failures (Linux, Node 22.22, Git 2.43; not yet run on Windows).

## A. Transport, journal, idempotency

| ID | Fault | Expected behaviour | Oracle | Status |
|---|---|---|---|---|
| F01 | Elephant session lost mid-request (E2 node B) | B → `MODEL_ERROR`, contributes 0 findings; request `PARTIAL`, `topology_effective=e1`, `degraded=true` | assert statuses + empty findings | SIM ✔ |
| F02 | Model slower than deadline, remote keeps running | `DEADLINE_EXCEEDED`, `fallback=E0_DIRECT_SOURCE`; later answer journaled as `LATE_RESULT` only; terminal unchanged | one LATE_RESULT, last TERMINAL still DEADLINE_EXCEEDED | SIM ✔ |
| F03 | Same request submitted twice concurrently | One adapter call, one TERMINAL, identical results | `adapter.calls==1`, terminals==1 | SIM ✔ |
| F04 | Same idempotency key, different payload | `IDEMPOTENCY_KEY_CONFLICT`, original result untouched | rejects | SIM ✔ |
| F05 | Switchboard dies after REQUEST_RECORDED, before TERMINAL | Restart writes `UNKNOWN_TERMINAL`; same key returns it; **no re-dispatch** | adapter.calls stays 1 | SIM ✔ |
| F06 | Crash mid-append leaves partial journal line | Truncate to last newline, journal `TORN_TAIL_DISCARDED{bytes,sha256}`, chain valid | verify().ok | SIM ✔ |
| F07 | Journal edited after the fact | Refuse to open: `JOURNAL_CORRUPT` | throws | SIM ✔ |
| F31 | Second switchboard process on same arm journal; stale lock after crash | Live owner → `JOURNAL_LOCKED`; dead pid → takeover + `STALE_LOCK_BROKEN` | throws / event | SIM ✔ |
| F32 | Responses arrive out of order (B before A) | Each matched by node within request; ordering irrelevant to result | covered by F13 (different delays) | SIM ✔ (indirect) |
| F33 | Disk full during append | Append throws → request cannot be recorded → caller gets error before dispatch; no un-journaled dispatch | inject ENOSPC via fs mock | OPEN (no test yet) |

## B. Topology, routing, capacity

| ID | Fault | Expected | Oracle | Status |
|---|---|---|---|---|
| F14 | E2 request, one node not registered | `PARTIAL`, effective e1, missing node `UNAVAILABLE` | assert | SIM ✔ |
| F17 | Queue overflow on one node | `OVER_CAPACITY` immediately; no unbounded wait | statuses `[COMPLETED, COMPLETED, OVER_CAPACITY]` with cap 1 | SIM ✔ |
| F25 | Registering beyond 0/1/2 | `TOPOLOGY_VIOLATION`; E0 consult → `FALLBACK_DIRECT_SOURCE` | throws / status | SIM ✔ |
| F26 | Rebuilt/new node fails calibration | `QUARANTINED`, never routed, 0 adapter calls | assert | SIM ✔ |
| F29 | Switchboard restart with registered nodes | Nodes `DETACHED` → `UNAVAILABLE`; re-attach only with residency verified | throws `RESIDENCY_UNVERIFIED` | SIM ✔ |
| F30 | Artifacts owned by no manifest, no `domains` | `UNROUTABLE`, E0 fallback | status | SIM ✔ |
| F34 | Bad routing: artifact belongs to domain B but worker names A | A answers with `not_examined`/HANDOFF finding; post-hoc mis-route label in scorecard | reviewer label | LIVE |

## C. Epochs and staleness

| ID | Fault | Expected | Oracle | Status |
|---|---|---|---|---|
| F08 | Peripheral in-domain commit since capsule | `STALE_ADVISORY`, exact `unincorporated_paths` | paths == `[product/core/plan.ts]` | SIM ✔ |
| F09 | Contract file changed since capsule | REVIEW → `STALE_BASIS`, 0 adapter calls; ASK → `STALE_ADVISORY` with `CONTRACT` | assert | SIM ✔ |
| F10 | Shared contract changed (E2) | `COMMIT_ACCEPTED.stale_nodes` lists both nodes as CONTRACT | assert | SIM ✔ |
| F11 | Epoch advances while request in flight | `stale_on_arrival=true`, `arm_main_at_arrival ≠ arm_main_at_dispatch`, `STALE_ADVISORY` | assert | SIM ✔ |
| F12 | Worker base off main; capsule built off main | `BASE_DIVERGED`; rotate refuses off-main capsule | assert | SIM ✔ |
| F15 | E2 nodes on different epochs, `epoch_policy=same` | `MIXED_EPOCH` (no dispatch); `any` → proceeds, stamped per node | assert | SIM ✔ |
| F35 | Windows case-insensitive path aliasing (`product/TESTS/x.ts` evades `**/tests/**`) | Must be treated as protected | case-folded glob match on win32 | **OPEN** — globs are case-sensitive today |
| F36 | Rename of a contract file (`git diff --no-renames` shows delete+add) | Both old and new paths reported; CONTRACT if either matches | fixture with `git mv` | OPEN (logic present, untested) |
| F37 | Model claims its context is fresh / "I have the latest code" | Ignored; basis is wrapper-computed only | by construction: no model field maps to `basis` | SIM ✔ (structural) |

## D. Content, citations, adversarial input

| ID | Fault | Expected | Oracle | Status |
|---|---|---|---|---|
| F13 | Two nodes, contradictory verdicts on one subject | One OPEN disagreement, both positions, falsifiers; **no `consensus` field** | assert | SIM ✔ |
| F18 | Secret pattern in request payload; secret in committed source | `POLICY_DENIED` with 0 adapter calls; capsule build aborts `SECRET_DETECTED` | assert | SIM ✔ |
| F19 | Dirty working tree / `.env` present at capsule build | Capsule from commit blobs only; deterministic `pack_sha`; nonce differs per build | assert | SIM ✔ |
| F20 | Hallucinated citation (wrong quote, nonexistent file) | Findings `INVALID` (`quote_mismatch`, `not_found_at_basis`); request `CITATION_INVALID` | assert | SIM ✔ |
| F21 | Prompt injection in artifact; model returns `actions` / extra fields | Fields stripped and listed in `unrecognized_fields`; nothing executed; repo HEAD and status unchanged | git status empty | SIM ✔ |
| F38 | Citation correct but claim wrong (quote exists, inference false) | Still `VERIFIED` — **citation ≠ truth**; caught only by tests/review; counted as false positive | reviewer label | LIVE (by design limitation) |
| F39 | Prompt-injection in source file inside the capsule (T8) | Model must not change verdict/output contract; evaluated by T8 hidden check | T8 grader | LIVE |

## E. Code authority and integration

| ID | Fault | Expected | Oracle | Status |
|---|---|---|---|---|
| F22 | Elephant patch: outside allowlist / protected test path / symlink / binary / stale base | Each rejected with named violation; valid patch `ESCROWED_UNVERIFIED`, stored, worktree untouched | assert | SIM ✔ |
| F23 | PROPOSE_PATCH without allowlist; request `from: elephant:*` | `INVALID_ENVELOPE` | throws | SIM ✔ |
| F24 | Non-FF commit, stale fencing token, reviewer = worker, Elephant as reviewer, tests failed, double lease | Each refused with named code | throws | SIM ✔ |
| F40 | Elephant harness can write files despite "read-only" | Elephant not admitted for that harness | WRITING_AND_TRUTH §6 verification | LIVE |

## F. Lifecycle, isolation, provider

| ID | Fault | Expected | Oracle | Status |
|---|---|---|---|---|
| F16 | Worker cancels | `CANCELLED`; `remote_stop` truthfully `confirmed/attempted/unsupported` | assert `unsupported` | SIM ✔ |
| F27 | Rotation while request in flight; rotation without calibration | Answer labelled old generation; uncalibrated rotation refused | assert | SIM ✔ |
| F28 | APPEND session retains previous transactions | Canary recalled → `LEAKY`, `ROTATION_DUE` past budget; FORK → `NO_LEAK_OBSERVED` with `guarantee: NOT_PROVEN` | assert | SIM ✔ (scripted recall) |
| L1 | Provider rate limit | `MODEL_ERROR{RATE_LIMITED}`, no in-request retry, coordinator backoff | live drill | LIVE |
| L2 | Context exhaustion / provider "too long" | `MODEL_ERROR{CONTEXT}` → shrink manifest or split domain | live drill | LIVE |
| L3 | Provider silently swaps model version mid-arm | Adapter records model id per call; change ⇒ recalibrate, flag arm | compare model ids in journal | LIVE |
| L4 | Auth expiry during run | `MODEL_ERROR{AUTH}`; operator re-auth in harness's own config; never read by kernel | live drill | LIVE |
| L5 | Windows sleep/restart mid-consult | FLUSH_RECOVERY §8.4 path | live drill | LIVE |
| L6 | Antivirus/indexer locks journal file | append throws → request not recorded → error to caller | live drill on Windows | LIVE |

**Summary:** 46 cases. 33 have simulated oracles (F01–F31 as direct tests, F32 indirectly via F13, F37 structurally), 3 are OPEN gaps (F33, F35, F36), 10 are LIVE drills (F34, F38–F40, L1–L6). The 32 automated tests are F01–F31 plus one E1 happy-path test. OPEN items block G2, not G0/G1.
