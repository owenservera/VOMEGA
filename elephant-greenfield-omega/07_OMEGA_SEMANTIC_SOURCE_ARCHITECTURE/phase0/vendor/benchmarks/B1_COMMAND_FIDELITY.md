# B1 — Command Fidelity: Ω vs an LLM as Interpreter

**Status:** SCAFFOLD · **Written in:** Stage 2 · **Set:** [00 Master](00_MASTER_SESSION_INTEGRATION.md) · [B1](B1_COMMAND_FIDELITY.md) · [B2](B2_AGENT_CONTEXT.md) · [B3](B3_HANDOFF_FIDELITY.md) · [B4](B4_CHANGE_VELOCITY.md)
**Referee:** Run A · **Timing:** Wave 1 (datasets, champions) → Wave 3 (run)

## 1 Purpose and claim
*Scope:* The claim that a deterministic, grammar-first interpreter executes fewer wrong commands, faster, cheaper and reproducibly than an LLM doing tool-calling over the same capability schemas, and the honest counter-claim about coverage of out-of-grammar phrasing.

## 2 Hypotheses and pre-registered targets
*Scope:* H1 silent wrong = 0 for Ω vs > 0 for the LLM; H2 Ω identical results across 10 repeats; H3 Ω p95 latency ≥100× lower; H4 Ω+rephraser matches LLM coverage at 0 silent wrong. Each with target, falsifier and evidence label.

## 3 Arms
### 3.1 Ω deterministic core
*Scope:* The Run A engine (Python) and the E1 TypeScript winner, V5-will wording.

### 3.2 LLM interpreter (baseline)
*Scope:* GLM 5.3 Flash acting as tool-caller over MCP-style schemas emitted from the same declarations; champion-tuned prompt, optional constrained JSON output.

### 3.3 Ω + LLM rephraser (hybrid)
*Scope:* The LLM may only rewrite input into Ω's controlled language; Ω then parses, renders and proves. ML never emits commands.

### 3.4 Champion rules
*Scope:* What champions may change (prompt, examples, schema descriptions, decoding) and may not (test data, scoring).

## 4 Datasets
### 4.1 Generated set
*Scope:* Run A's 20,556 hear-generated utterances plus the 49,545 hostile-prompt set, with oracle commands.

### 4.2 Red-team set
*Scope:* Confirmed adversarial utterances from E2 sessions, deduplicated by class.

### 4.3 Blind held-out set
*Scope:* Utterances from blind writers who never see the grammar; labelled by a second blind pass plus referee adjudication.

### 4.4 Contamination controls
*Scope:* How held-out data is kept from subject and champion sessions; versioning `B1/<kind>/vN`.

## 5 Task protocol
*Scope:* Step-by-step run: load frozen harness, feed each utterance to each arm, collect result JSON, repeat 10× for determinism, record latency per call; how the LLM arm is run inside a session without API keys.

## 6 Metrics
*Scope:* Exact definitions: silent-wrong rate, correct-ask rate on ambiguous inputs, exact-match accuracy, coverage (non-UNKNOWN on in-scope intents), determinism, p50/p95 latency, cost per 1,000 commands, tokens per command (real tokenizer).

## 7 Harness
*Scope:* Components and file formats: utterance JSONL, result JSONL per arm, scorer script, harness SHA-256; reuse of Run A's `cross.py` and `proofs.py`.

## 8 Fairness and threats to validity
*Scope:* Threats: baseline under-tuned, held-out leakage, label ambiguity in blind data, latency measured on different hardware, GLM sampling temperature; mitigations for each.

## 9 Build plan inside the waves
*Scope:* Which sessions produce which asset: E2 red team (adversarial set), blind writers ×4 (held-out), LLM champions ×2 (baseline prompt), E1 (TS engine for in-browser latency), E4 (UI latency); when the run happens.

## 10 Reporting and acceptance
*Scope:* Scorecard rows for B1, pass/fail against each pre-registered target, and the required wording when Ω loses a metric (coverage).

## 11 Open questions
*Scope:* Labelling disagreements on blind data, whether a stronger LLM baseline is available, temperature setting for the LLM arm.

---
*Scaffold. Body written in Stage 2 (see the stage plan in the Master guide, Appendix A).*
