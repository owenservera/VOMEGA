# Ω Benchmarks — Master Guide: Adding Benchmarks to the Session Waves

**Status:** SCAFFOLD · **Set:** [00 Master](00_MASTER_SESSION_INTEGRATION.md) · [B1](B1_COMMAND_FIDELITY.md) · [B2](B2_AGENT_CONTEXT.md) · [B3](B3_HANDOFF_FIDELITY.md) · [B4](B4_CHANGE_VELOCITY.md)
**Owner:** Owen · **Referee:** Run A (Claude) · **Session engine:** Z.ai full-stack web-app agent, GLM 5.3 Flash, many parallel sessions
**Inputs:** [OMEGA_CONTEXT_PACK_v2](../OMEGA_CONTEXT_PACK_v2.md), [Run A report](../runA/RUN_A_REPORT.md), fixture `omega-core-fixture-v1` (`16e242c5…`)

## Purpose
Prove, with numbers a sceptic would accept, that Ω's self-contained, deterministic approach outperforms the tools people use today for multi-agent work: an LLM as command interpreter, a vector database as agent context, free-text agent handoffs, and conventional codebases edited by agents. The four benchmarks are built *while* the five V1 experiments run, so every session wave produces product and evidence together.

## Audience
Owen (operator who launches sessions), Run A (referee who builds harnesses and scores), and GLM 5.3 Flash sessions (who receive per-session packs derived from these docs).

## Tone and style rules (apply to all five documents)
- Plain, direct English; short sentences; British/US neutral spelling as in the existing 07 set.
- Every number carries an evidence label: **MEASURED**, **ESTIMATED** (method stated) or **UNKNOWN**.
- Targets are written as *pre-registered* claims with an explicit falsifier.
- Every external claim cites a source (URL + quote, or repo path + line).
- Tables for anything compared across arms; numbered lists for procedures.
- No credentials, no live provider calls; mock providers and localhost only.

## Table of contents
1. Purpose and the four claims
2. Roles
3. Independence and anti-gaming rules
4. Wave plan
5. Session pack anatomy
6. Approach cards and diversity
7. Asset flow between sessions
8. Submission and referee procedure
9. Pre-registration and freezing
10. Turn-value tactics for GLM 5.3 Flash
11. Scorecard and decision gates
12. Security and evidence rules
13. Open questions
- Appendix A — Stage plan for this document set
- Appendix B — Terminology and style sheet
- Appendix C — Pre-registration sheet (template)

---

## 1 Purpose and the four claims
*Scope:* The one-paragraph case for benchmarking now, and the four headline claims in one table: B1 command fidelity (Ω vs LLM interpreter), B2 agent context (capsules vs vector DB), B3 handoff fidelity (omega-contract vs free-text A2A and shared memory), B4 change velocity (Ω twin vs conventional twin). Links to each spec.

## 2 Roles
### 2.1 Subject sessions
*Scope:* Sessions that build the thing under test (E1–E5 product work and Ω-arm tasks). What they may and may not see.
### 2.2 Champion sessions
*Scope:* Sessions whose only job is to make a baseline as strong as possible (tuned prompts, retrieval, chunking). Why champions exist and how they are rewarded.
### 2.3 Blind writers
*Scope:* Sessions that write held-out test data without seeing the grammar or code, standing in for real users.
### 2.4 Harness builders
*Scope:* Sessions that build benchmark tooling (B3 relay harness, B4 conventional twin) under referee review.
### 2.5 Referee (Run A)
*Scope:* Freezes harnesses, generates golden files, scores every submission, publishes the scorecard. Never builds a subject it scores without a second check.
### 2.6 Operator (Owen)
*Scope:* Launches sessions with the right pack, returns outputs, approves pre-registrations and gates.

## 3 Independence and anti-gaming rules
*Scope:* Builders never grade their own work; blind writers never see the grammar; held-out sets are never shown to subject sessions; harness versions are hashed into every result; ≥5 runs per condition; real tokenizer for token counts; how leakage is detected and what voids a result.

## 4 Wave plan
### 4.1 Wave 1 (now): 28 sessions
*Scope:* Table of E1 ×8, E2 ×10, E3 ×5, blind writers ×4, twin builder ×1, LLM-interpreter champions ×2 — with outputs each must produce.
### 4.2 Wave 2: after the E1 winner
*Scope:* E4 ×6, B4 control arm ×5, vector-DB champions ×2, B3 relay-harness builder ×1.
### 4.3 Wave 3: V1 assembly and the benchmark run
*Scope:* E5 ×2, then all four benchmarks executed on V1 and one scorecard published.
### 4.4 Dependencies and critical path
*Scope:* What blocks what; the minimum path to the V1 gate; what can slip without blocking.

## 5 Session pack anatomy
*Scope:* The fixed structure every session pack follows: header (session ID, role, wave), context excerpt, task, approach card, inputs (golden files, checker), gates the session must pass before replying, output contract (repo/zip layout), `scorecard.json` schema, and rules. Includes a filled example pack for one E2 red-team session.

## 6 Approach cards and diversity
*Scope:* How parallel sessions get deliberately different strategies (seed, technique, constraint), how cards are allocated per experiment, and how diversity is measured so that fan-out is not wasted on duplicates.

## 7 Asset flow between sessions
*Scope:* The diagram and table of which session outputs become which benchmark inputs (red-team hits → B1 adversarial set and B3 fault injections; E3 sessions → B4 Ω arm; E4 UI → B1 in-browser latency; V1 repo → B2 subject). Asset naming and versioning.

## 8 Submission and referee procedure
*Scope:* How Owen returns a session's output (repo URL, zip or pasted files), the folder layout under `07…/benchmarks/runs/`, the referee's scoring steps, turnaround, and how disputes or reruns are handled.

## 9 Pre-registration and freezing
*Scope:* What is frozen before a wave starts (targets, falsifiers, datasets, harness hash), who signs off, how a change is recorded, and why a missed target is reported rather than reframed.

## 10 Turn-value tactics for GLM 5.3 Flash
*Scope:* How to get maximum value per turn from a fast, weaker model: runnable self-checks in every pack, red tests to turn green, one bounded deliverable per session, strict output contract, no open-ended design asks, retry policy, and what to do when a session drifts.

## 11 Scorecard and decision gates
*Scope:* The single scorecard format across B1–B4 (per-arm metrics, evidence labels, pass/fail vs pre-registered targets), and the gates it drives: E1 winner selection, wave-2 launch, V1 gate, and what happens if Ω loses a benchmark.

## 12 Security and evidence rules
*Scope:* No credentials or live providers; mock providers only; auth/provider/model configuration read-only; no private archives published; how evidence labels and citations are enforced in session outputs.

## 13 Open questions
*Scope:* Offline embedding model availability in sessions (B2), whether a stronger LLM is available as an extra B1 baseline, session output size limits, and how real-user utterances could later replace blind-writer data.

## Appendix A — Stage plan for this document set

| Stage | Writes | Notes |
|---|---|---|
| 1 | Scaffold of all five documents (this) | Done |
| 2 | B1 Command Fidelity, all sections | |
| 3 | B2 Agent Context, all sections | |
| 4 | B3 Handoff Fidelity, all sections | |
| 5 | B4 Change Velocity, all sections | |
| 6 | Master §1–6 | Roles, rules, waves, pack anatomy, approach cards |
| 7 | Master §7–13 | Asset flow, referee procedure, freezing, tactics, scorecard, security, open questions |
| 8 | Appendix C pre-registration sheet, filled for B1–B4; consistency check across all five docs | Final stage |

The work fits in 8 stages, so it finishes before the 10-stage maximum.

## Appendix B — Terminology and style sheet

| Term | Definition |
|---|---|
| **Arm** | One condition in a benchmark (e.g. "Ω", "vector DB"). |
| **Subject** | The system an arm runs on. |
| **Champion** | A session whose job is to make a baseline arm as strong as possible. |
| **Blind writer** | A session that writes held-out data without seeing Ω's grammar or code. |
| **Referee** | Run A: freezes harnesses, scores, publishes. |
| **Harness** | Frozen scoring code; its SHA-256 is recorded in every result. |
| **Golden file** | Referee-generated expected outputs (readings, digests, states) used for self-checks and scoring. |
| **Held-out set** | Test data never shown to subject sessions. |
| **Silent wrong** | A result that would execute a command different from the user's intent without being flagged as ambiguous. |
| **Staleness error** | An answer based on context that no longer matches the source. |
| **Pre-registration** | Targets, falsifiers, datasets and harness hash frozen before a run. |
| **Approach card** | The strategy assigned to one parallel session to force diversity. |
| **Wave** | A batch of sessions launched together. |
| **E1–E5** | The five V1 product experiments (TS port, red team, add capability, live typing box, V1 assembly). |
| **B1–B4** | The four benchmarks. |
| **Scorecard** | The single published results table across benchmarks. |

**Naming:** session IDs `W<wave>-<experiment or benchmark>-<nn>` (e.g. `W1-E2-07`, `W1-B1C-01` for a B1 champion). Asset IDs `<benchmark>/<kind>/<version>` (e.g. `B1/heldout/v1`). Run folders `benchmarks/runs/<session-id>/`.

**Formatting:** headings numbered `1`, `1.1`; procedures as numbered lists; metric definitions in tables with columns *ID · Metric · Definition · Unit · Label*.

## Appendix C — Pre-registration sheet (template)
*Scope:* One row per benchmark hypothesis: ID, claim, metric, target, falsifier, dataset version, harness hash, sign-off date. Filled in Stage 8.

---
[Stage 1 of 8 complete: scaffold and stage plan created for all five documents. Ready for Stage 2.]
