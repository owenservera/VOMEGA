# FLUSH_RECOVERY — boot, calibrate, reconcile, flush, rotate, fork, rebuild, recover

**Status:** algorithms `DESIGN`; the parts marked ✔ are exercised in `kernel/` (`SIMULATED_TEST`).
**Ground rule:** model context is opaque. Nothing in this document claims that hidden turns were erased unless the mechanism *cannot* have retained them (a fresh process or fresh fork). Where a harness lacks a capability, the algorithm degrades to a rebuild and records the weaker guarantee.

---

## 1. Layers, redefined

| Layer | v0.1 | v0.2 | Durable? | Who may change it |
|---|---|---|---|---|
| Canonical | Git + artifacts + tests + evidence | unchanged | yes | integrator (fast-forward) |
| Manifest + contract registry | versioned in Git | unchanged, plus `contracts:` globs that drive CONTRACT staleness | yes | owner, via normal review |
| Capsule (was "resident snapshot") | ordered pack at a SHA | built from **commit blobs**, deterministic `pack_sha`, per-build `nonce` | rebuildable | switchboard (deterministic) |
| Wave delta | appended verified deltas | **deleted for v0.2** (ADR-04); in-domain epoch ⇒ rebuild | – | – |
| Transaction | per request | per request; *physically disposable* in FORK/PREFIX | no | – |
| Notes | candidates with validity predicate | unchanged; promotion is a separate gated act (§9) | yes once approved | reviewer + owner |

## 2. Session modes and what each can honestly guarantee

| Mode | How a request is served | Transaction isolation | Flush | Persistence value | Requires |
|---|---|---|---|---|---|
| **FORK** | Fork a calibrated base session per request; discard fork | *Structural*, if the fork is real | no-op | resident capsule reuse without pollution | harness fork **verified** by probe |
| **PREFIX** (default) | Fresh call each time: capsule as cached prefix + question | *Structural*: nothing carries over except the provider cache of identical prefix bytes | no-op | none beyond cache economics | nothing (works with any stateless API/CLI) |
| **APPEND** (E1-P variant) | One growing session; each request is a new turn | **None.** Earlier turns remain visible | **= rotate** | accumulated interaction context (the hypothesis under test) | resume support **verified** by nonce test |

The ordering FORK > PREFIX > APPEND for *hygiene* is by construction; the ordering for *answer quality* is unknown and is what H3 measures (`EXPERIMENT.md`).

## 3. BUILD (capsule) ✔

```
build(repo, sha K, manifest M):
  require commit K exists
  for entry in ls-tree(K) sorted by path:
      skip unless inManifest(M, path)
      exclude (journal reason) if symlink | non-blob | policy-denied path | binary
      bytes ← cat-file blob K:path            # never the working tree
      if secretScan(bytes) hits → ABORT whole build (SECRET_DETECTED); emit nothing
      total += |bytes|; if total > M.max_bytes → ABORT (CAPSULE_OVER_BUDGET)
  header ← "ECP-CAPSULE domain=… manifest_version=… commit=K"
  pack_sha ← sha256(header ‖ files)          # deterministic, nonce excluded
  nonce ← 64 random bits; text ← header ‖ "CAPSULE-NONCE "+nonce ‖ files
  return {pack_sha, nonce, nonce_sha, files[{path, blob, bytes}], excluded[]}
```
Token budget: bytes are used in the kernel. A real adapter replaces the byte budget with the harness tokenizer count **when one is verifiable**, else keeps bytes with a 4 bytes/token conservative ratio and state `UNKNOWN_CAPACITY`.

## 4. BOOT + CALIBRATE ✔ (scripted)

```
boot(adapter, capsule):
  caps ← adapter.probe_capabilities()           # fork/resume/cancel/usage: verified|unsupported|unknown
  mode ← FORK if caps.fork=verified else PREFIX  # APPEND only when the arm variant is E1-P
  session ← adapter.open(capsule.text, read_only_policy)
calibrate(adapter, capsule, suite):
  ask "repeat CAPSULE-NONCE"                     # residency (critical)
  ask "quote product/__ecp_nonexistent__.ts"     # must answer NOT_IN_PACK (critical; hallucination tripwire)
  ask 5–8 domain questions with regex-gradable answers derived from the capsule commit
      (e.g. "Which TargetStatus values are terminal?" → /accepted.*rejected.*cancelled.*timed_out/)
  passed ← all critical ✓ ∧ score ≥ θ (θ = 0.8 starting point; calibrate)
  register(node, status = passed ? READY : QUARANTINED)
```
Calibration questions are generated from the commit by the operator script (`BUILD_SEQUENCE.md` S4) and frozen per manifest version, so all arms and generations face identical suites.

## 5. FLUSH

* **FORK / PREFIX:** a flush is a no-op. There is no transaction state to discard. The kernel still records `txn_count` per generation.
* **APPEND:** `flush(node) := rotate(node)` (§6). The pack's "selective flush" is not offered because no harness surveyed in v0.1 documents verifiable erasure of hidden turns, and "compaction" summaries are *new* content, not erasure.
* **Isolation probe** ✔: every envelope carries a fresh `TXN-<random>` canary. `probe(node)` asks the node to list canaries it remembers. Any recalled canary ⇒ `isolation = LEAKY` (proof of retention). No recall ⇒ `NO_LEAK_OBSERVED`, journaled with `guarantee: NOT_PROVEN` — a model can retain and not repeat. When `LEAKY ∧ txn_count ≥ txn_budget` the node becomes `ROTATION_DUE` and is not routable (F28).

## 6. ROTATE (blue/green) ✔

```
rotate(node, K' = arm main):
  cap' ← build(K', manifest); sess' ← boot(adapter, cap'); cal' ← calibrate(…)
  if not cal'.passed: keep old generation routable if its basis is tolerable, else node unusable → E0 fallback; STOP
  journal NODE_ROTATED{generation g+1, pack_sha', incorporated K'}   # atomic route flip
  in-flight requests dispatched to g complete and are labelled g     # F27
  close(old session) → confirmed | uncertain (journaled)
```
Never route to an uncalibrated replacement (`CALIBRATION_REQUIRED`).

## 7. RECONCILE on epoch advance

Triggered by `COMMIT_ACCEPTED`, which already lists `stale_nodes` with class.

| Class for node | Default action | Before the rebuild completes |
|---|---|---|
| NONE | nothing | – |
| PERIPHERAL | rebuild when idle or at the next wave boundary (batch: at most one rebuild per node per N accepted commits, N=3 starting point) | ASK/REVIEW proceed, stamped `STALE_ADVISORY` |
| CONTRACT | rebuild immediately | sensitive kinds refused (`STALE_BASIS`); ASK proceeds stamped |
| DIVERGED | quarantine; rebuild from arm main | refused |

Why rebuild instead of appending a delta (ADR-04): at Prompt Fanout Mini scale the capsule is tens of KB, so rebuild + calibration costs roughly one consult; appending a delta puts two versions of a file into one context, which is exactly the "old vs new contract" confusion T7 is designed to catch. The trade-off is measured, not assumed (`EXPERIMENT.md` §5, metric `rebuild_cost / consult_cost`).

## 8. RECOVER

### 8.1 Switchboard process crash ✔
```
on start:
  acquire <journal>.lock; if held by a live pid → refuse (JOURNAL_LOCKED); dead pid → take over, journal STALE_LOCK_BROKEN
  if last line partial → truncate to last newline, journal TORN_TAIL_DISCARDED{bytes, sha256}
  verify hash chain → else refuse (JOURNAL_CORRUPT); operator restores from backup copy
  fold events → nodes, requests, lease, epoch
  for each RECORDED-without-TERMINAL: journal TERMINAL{UNKNOWN_TERMINAL}
  every READY node → DETACHED (adapters are process-local)
  for each DETACHED node:
     PREFIX/FORK: re-open with the same capsule commit, ask nonce → attach(residencyVerified) or rotate
     APPEND: try resume(handle); nonce WITHOUT re-injection → attach; else rotate
```

### 8.2 Provider session lost / expired
Adapter error ⇒ node answer `MODEL_ERROR`; the request degrades (`PARTIAL` or fallback). Operator or coordinator runs `rotate`. Nothing from the lost session is replayed: transient prompts are never knowledge.

### 8.3 Crash after the remote answered but before `TERMINAL`
Result is lost to the kernel; recovery marks `UNKNOWN_TERMINAL`. Because Elephants never write code and patches only exist after escrow (which happens before `TERMINAL`), the worst case is a duplicate *advisory* call on retry; there is no double merge path (merges go through the fenced epoch guard).

### 8.4 Windows restart mid-consult
Equivalent to 8.1 + 8.2. The lock pid is dead after reboot, so takeover is automatic and journaled. Long-running harness processes are assumed dead; sessions are re-verified via nonce.

### 8.5 Account rate limit
Adapter maps provider throttling to `MODEL_ERROR` with `reason: RATE_LIMITED` and a backoff hint; the switchboard does not retry within the same request (deadline would be consumed invisibly). The coordinator may retry with a new key after the hint. Repeated throttling across 3 consecutive requests ⇒ operator marks node `UNAVAILABLE` and the arm runs degraded (recorded).

## 9. Notes (durable domain knowledge)

Candidate: `{text, subject, anchors[{path,start_line,end_line,quote}], validity_predicate, author_node, generation, epoch}`. Validity predicate v0.2 = *all anchors still VERIFIED at the current epoch*. Promotion requires: predicate true now, a reviewer ≠ author approves, and the note is added to the manifest's `notes/` path **by a normal commit** (so it becomes canonical input to the next capsule build and goes through review). On any epoch where a note's anchor changes, the note is re-verified and dropped from the next capsule if it fails. Notes are an *ablation factor* in the experiment (with vs without) because they can propagate wrong beliefs.

## 10. Capability gaps and the fallback chosen

| Harness lacks… | Consequence | Fallback |
|---|---|---|
| fork | no FORK mode | PREFIX |
| resume | no APPEND variant; E1-P not runnable on that harness | report E1-P `NOT_RUNNABLE`, don't simulate it |
| cancel | `remote_stop: unsupported` | local abort only; LATE_RESULT accounting |
| usage metrics | tokens `unknown` | measure bytes in/out; mark cost estimates `ESTIMATED` |
| read-only enforcement | cannot run as an Elephant | do not run that harness as an Elephant until OS isolation is verified (`WRITING_AND_TRUTH.md` §6) |
| context size disclosure | `UNKNOWN_CAPACITY` | byte budget at 50% of the smallest plausible window |

## 11. Drills (must pass before E2; ✔ = simulated in kernel)

1. ✔ Kill a node mid-request → no false COMPLETED (F01).
2. ✔ Kill the switchboard between RECORDED and TERMINAL → UNKNOWN_TERMINAL, no re-dispatch (F05).
3. ✔ Torn journal tail (F06) · tampered journal (F07) · second writer (F31).
4. ✔ Shared contract change → both nodes CONTRACT-stale (F10).
5. ✔ Rotate with a request in flight → answer keeps generation g (F27).
6. ✔ Rebuild that fails calibration → quarantined, never routed (F26).
7. ✔ Hostile instructions inside an artifact and hostile response fields → nothing executed (F21).
8. LIVE: reset a real provider session, rebuild from capsule, rerun calibration suite, compare scores within tolerance (|Δscore| ≤ 0.1).
9. LIVE: APPEND session canary leak measured over 20 transactions.
