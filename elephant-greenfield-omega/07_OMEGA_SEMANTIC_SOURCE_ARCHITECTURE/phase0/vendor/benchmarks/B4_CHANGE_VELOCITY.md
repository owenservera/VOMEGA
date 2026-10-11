# B4 — Change Velocity: Ω-Declarative Twin vs Conventional Twin

**Status:** SCAFFOLD · **Written in:** Stage 5 · **Set:** [00 Master](00_MASTER_SESSION_INTEGRATION.md) · [B1](B1_COMMAND_FIDELITY.md) · [B2](B2_AGENT_CONTEXT.md) · [B3](B3_HANDOFF_FIDELITY.md) · [B4](B4_CHANGE_VELOCITY.md)
**Referee:** Run A · **Timing:** Wave 1 (twin builder, Ω arm) → Wave 2 (control arm)

## 1 Purpose and claim
*Scope:* The claim that agents make correct changes to an Ω-declarative codebase with fewer tokens and turns, and with no regressions escaping, compared with an identical-behaviour conventional TypeScript codebase. This is the decisive test of the LLM-native codebase claim (doc 13 §12).

## 2 Hypotheses and pre-registered targets
*Scope:* H1 success rate(Ω) ≥ success(conventional); H2 tokens(Ω) ≤ 50% of conventional; H3 escaped regressions = 0 on the Ω twin; H4 fewer turns and less wall time.

## 3 Arms
### 3.1 Ω twin
*Scope:* ΩSL-mini declarations + compiler + proofs (Run A base, plus E1 TS core).

### 3.2 Conventional twin
*Scope:* Same behaviour in idiomatic TypeScript without declarations or proofs, built by a twin-builder session and verified behaviour-equal on the golden files.

### 3.3 Agent
*Scope:* GLM 5.3 Flash sessions with identical tool access per arm; ≥5 runs per task per arm.

## 4 Datasets
### 4.1 Task bank
*Scope:* Add a capability, change a reading's wording, fix a seeded bug, answer an architecture question, rename a label concept; each with an executable acceptance test.

### 4.2 Seeded bugs
*Scope:* Bug library with known fixes, hidden from agents.

### 4.3 Equivalence proof
*Scope:* Both twins produce identical results on the 417-state and 70,000-utterance golden files before the run starts.

## 5 Task protocol
*Scope:* Assign tasks to sessions per arm, collect diffs, run acceptance tests and the full regression suite, record tokens, turns and time.

## 6 Metrics
*Scope:* Exact definitions: task success, tokens to correct change (real tokenizer), turns, wall time, escaped regressions (failures found by the referee's full suite but not by the session), localization accuracy.

## 7 Harness
*Scope:* Components: twin repos, task cards, acceptance tests, regression suite, token/turn logger, harness SHA-256.

## 8 Fairness and threats to validity
*Scope:* Threats: twin quality bias, task selection favouring declarations, session-to-session variance, learning effects; mitigations (twin built by a separate session, mixed task types, ≥5 runs, randomised order).

## 9 Build plan inside the waves
*Scope:* Wave 1: twin builder ×1 and E3 sessions as the Ω arm; Wave 2: control arm ×5 on the conventional twin with the same task cards.

## 10 Reporting and acceptance
*Scope:* Scorecard rows for B4 and pass/fail per target.

## 11 Open questions
*Scope:* Whether E3's capability tasks are enough or extra task types are needed; how to log tokens inside Z.ai sessions.

---
*Scaffold. Body written in Stage 5 (see the stage plan in the Master guide, Appendix A).*
