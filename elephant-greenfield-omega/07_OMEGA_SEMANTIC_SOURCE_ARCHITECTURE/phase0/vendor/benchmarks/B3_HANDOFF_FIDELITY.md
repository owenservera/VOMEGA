# B3 — Handoff Fidelity: omega-contract vs Free-Text A2A and Shared Memory

**Status:** SCAFFOLD · **Written in:** Stage 4 · **Set:** [00 Master](00_MASTER_SESSION_INTEGRATION.md) · [B1](B1_COMMAND_FIDELITY.md) · [B2](B2_AGENT_CONTEXT.md) · [B3](B3_HANDOFF_FIDELITY.md) · [B4](B4_CHANGE_VELOCITY.md)
**Referee:** Run A · **Timing:** Wave 2 (relay harness) → Wave 3 (run)

## 1 Purpose and claim
*Scope:* The claim that tasks passed across agent hops keep their exact intent, and that every corruption is detected, when they travel as A2A tasks with the omega-contract extension, compared with plain-text A2A and a shared memory pad, at acceptable overhead.

## 2 Hypotheses and pre-registered targets
*Scope:* H1 end-to-end intent preservation = 100% for omega-contract; H2 corruption detection = 100% vs < 100% for baselines; H3 latency overhead ≤ 1.2× native; H4 confirm or refute the prior internal 1.14× latency / 3.4× bytes claim.

## 3 Arms
### 3.1 A2A + omega-contract
*Scope:* Reading, command, digest, basis, trace and ambiguity list carried on every hop; receiver re-parses and re-digests.

### 3.2 A2A plain text (baseline)
*Scope:* Same transport, intent carried as free text.

### 3.3 Shared memory pad (baseline)
*Scope:* Agents read and write a common scratchpad, the pattern used by popular multi-agent frameworks.

### 3.4 Native in-process binding
*Scope:* Same data model without A2A envelope, for overhead comparison.

## 4 Datasets
### 4.1 Task set
*Scope:* Commands drawn from the 140 READY space and V1 capabilities.

### 4.2 Fault library
*Scope:* Paraphrase drift per hop, tampered reading, tampered digest, stale basis, bidi and confusable characters, missing extension, unknown version; red-team hits from E2.

### 4.3 Topologies
*Scope:* Chain of 5 hops, fan-out 1→4, fan-in 4→1.

## 5 Task protocol
*Scope:* Run each task through each arm and topology with and without injected faults; LLM relays (GLM 5.3 Flash) rephrase at each hop where the arm allows; record final state and detection events.

## 6 Metrics
*Scope:* Exact definitions: intent preservation (final digest = origin digest), detection rate, false-alarm rate, bytes and tokens per hop, p50/p95 latency per hop and end to end.

## 7 Harness
*Scope:* Components: localhost A2A server/client, relay agents, fault injector, verifier, metrics collector; reuses the T2 prototype from the Qwen pack once available.

## 8 Fairness and threats to validity
*Scope:* Threats: baselines given no verification by design, LLM relay variance, localhost latency not representative; mitigations.

## 9 Build plan inside the waves
*Scope:* Wave 2 relay-harness builder ×1; E2 red-team hits feed the fault library; T2 extension spec and code; run in Wave 3.

## 10 Reporting and acceptance
*Scope:* Scorecard rows for B3 and pass/fail per target.

## 11 Open questions
*Scope:* A2A spec version pinning, signature scheme (HMAC stand-in vs JWS), whether to include an MCP-tasks arm.

---
*Scaffold. Body written in Stage 4 (see the stage plan in the Master guide, Appendix A).*
