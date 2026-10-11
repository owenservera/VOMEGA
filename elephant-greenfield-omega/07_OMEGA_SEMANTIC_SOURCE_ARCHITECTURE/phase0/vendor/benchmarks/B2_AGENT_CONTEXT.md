# B2 — Agent Context: Compiled Capsules vs a Vector Database

**Status:** SCAFFOLD · **Written in:** Stage 3 · **Set:** [00 Master](00_MASTER_SESSION_INTEGRATION.md) · [B1](B1_COMMAND_FIDELITY.md) · [B2](B2_AGENT_CONTEXT.md) · [B3](B3_HANDOFF_FIDELITY.md) · [B4](B4_CHANGE_VELOCITY.md)
**Referee:** Run A · **Timing:** Wave 2 (champions, question bank) → Wave 3 (run on V1)

## 1 Purpose and claim
*Scope:* The claim that agents answer questions about a codebase as accurately with Ω's compiled capsules and navigation graph, on a fraction of the context tokens, and never from stale context, compared with vector-DB retrieval, agentic grep and code-mode loading.

## 2 Hypotheses and pre-registered targets
*Scope:* H1 accuracy(capsules) ≥ accuracy(best baseline); H2 tokens(capsules) ≤ 25% of the best baseline's; H3 staleness errors = 0 for capsules vs > 0 for the vector DB after code mutations; H4 fewer agent turns. Each with target, falsifier and label.

## 3 Arms
### 3.1 Vector DB (baseline)
*Scope:* Local, offline embedding index over the V1 repo, top-k chunks; champion-tuned chunking, k and embedding model.

### 3.2 Agentic grep (baseline)
*Scope:* Agent uses keyword search and file reads only.

### 3.3 Code-mode / whole-file (baseline)
*Scope:* Agent loads files or uses a code-execution tool surface, per the published code-mode MCP pattern.

### 3.4 Ω capsules
*Scope:* Bounded capsules fetched by stable ID, plus the compiled navigation graph and basis hash.

### 3.5 Champion rules
*Scope:* What vector-DB and code-mode champions may tune; equal tool budgets across arms.

## 4 Datasets
### 4.1 Subject
*Scope:* The V1 repo produced by Wave 3 (frozen commit).

### 4.2 Question bank
*Scope:* Questions whose answers are derived by the compiler and confirmed by executing tests (impact sets, consequences, rule provenance, ownership); categories and sizes.

### 4.3 Mutation set
*Scope:* Scripted code changes applied after indexing to measure staleness.

### 4.4 Contamination controls
*Scope:* Question bank hidden from champions; answer keys hashed.

## 5 Task protocol
*Scope:* Index build, question loop per arm, mutation round, re-ask, grading; turn and token accounting.

## 6 Metrics
*Scope:* Exact definitions: answer accuracy (exact/graded), context tokens per question (real tokenizer), turns, wall time, staleness error rate, retrieval recall@k for the vector DB.

## 7 Harness
*Scope:* Components: indexer per arm, question JSONL, grader (test-execution based), mutation scripts, token counter, harness SHA-256.

## 8 Fairness and threats to validity
*Scope:* Threats: questions biased toward what capsules contain, under-tuned retrieval, embedding model quality offline, grader circularity; mitigations (test-execution keys, champion tuning, mixed question sources).

## 9 Build plan inside the waves
*Scope:* Wave 2 vector-DB champions ×2; question-bank writers; V1 repo from E5; capsule emitter from the compiler; where the embedding model comes from if sessions cannot host one.

## 10 Reporting and acceptance
*Scope:* Scorecard rows for B2 and pass/fail per target.

## 11 Open questions
*Scope:* Offline embedding model availability in sessions; question categories; capsule size budget.

---
*Scaffold. Body written in Stage 3 (see the stage plan in the Master guide, Appendix A).*
