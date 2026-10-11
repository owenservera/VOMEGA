# Ω Development Loop — Live Lab / Experiment Runner / Change Lab

> **Conceptual correction (Rule 1, 2026-10-11):** [Machine ↔ Human co-evolution](../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md) governs this earlier v0.1 PRD. These tools are **one** feedback loop; representation, source and intent mismatches drive changes to the SDK/compiler/runtime as well as to Wiki and UI. The original prototype scope below remains accurately labelled; its three panels do not imply three ordered project phases.


**Revision:** R0-v0.1 · **State:** implemented first-pass loopback prototype, mock-only; not production SDK and not an automated agent sandbox.
**Parent:** `phase0/` integration lab; this extension does not replace the Phase 0 interface, oracle, gate or source fixture.

## 1. Product requirements

**User promise:** A developer types any text in the floating command box and sees an intelligible deterministic interpretation, a source-backed wiki panel for the interpreted capability, and the exact effects/ambiguities. When it is wrong the developer records an explicit correction, runs data-only regression comparisons, and sees which declarations/tests/wiki pages could be affected by a proposed change.

**North-star workflow:** typed input → live reading (same Phase 0 runtime) → optional correction capture (marked USER_PROPOSED) → case comparison → source-change impact preview → fresh wiki source projection. A correction is not a trusted reference answer until separately reviewed. No external providers, credentials, real execution or deployment services.

### Three mutually compatible tools

| Tool | User action | Ground truth | Output | Deliberate limits |
| --- | --- | --- | --- | --- |
| Live Lab | Type, inspect, choose and confirm a mock command | Phase 0 `Lab.interpret` and `Lab.authorize/dispatch` | Reading, alternatives, trace, mock receipt, timing | Only original finite fixture semantics; no human comprehension proof |
| Experiment Runner | Capture expected correction; submit candidate **responses** as JSON | User proposal with provenance + separately reviewed frozen cases | PASS/FAIL per field, refusal-all check, consequence coverage | Does **not** run candidate scripts; cases not auto-promoted to verified or hidden sets |
| Change Lab / Wiki | Inspect capability or preview a changed consequence | Parsed original `vendor/runA/omega.osl` and known golden vectors | Params/consequences/templates/help; source SHA, affected wiki pages and tests | Dependency graph conservative and declared; no full-codebase static analysis |

### Requirements and acceptance criteria

- **L1** Every `input` change increments an interpreter revision, disables the previous confirm button and discards stale async results. **Acceptance:** quick typing never permits old preview to dispatch. Lab v0 includes app-side serialized calls and Phase 0 server validation; real browser E2E remains to be run.
- **L2** Reading and wiki are shown together, linked to declaration/capability/source SHA. Wiki projections are explicitly labeled *declared, not proven*. **Acceptance:** recognized send action yields `cap:prompt.send` wiki with `prompt`, `account`, consequences and template source lines.
- **L3** Known competing parses block direct confirmation. An alternative selection must pass through Phase 0's `choose` and new preview, not arbitrary client selected command. **Acceptance:** `tell chatgpt personal account balance please` gets no direct executable preview.
- **E1** A developer can capture input, observed state, proposed correction and feedback. **Acceptance:** saved case has immutable id, source hash, and `USER_PROPOSED_NOT_INDEPENDENTLY_VERIFIED` label.
- **E2** Data-only evaluator detects wrong READY, omitted egress warning, and over-rejection. **Acceptance:** positive READY case with candidate UNKNOWN fails, as does wrong account or missing consequence. No subprocess calls or candidate code execution.
- **C1** Source change causes live runtime to reject old session until recompilation/restart, while wiki shows current source with a stale label. **Acceptance:** change `consequence leaves-this-computer` to `stays-here`; wiki changes, stale-source detected and old runtime interpretation blocked.
- **C2** Simulated contract edits show affected capabilities, wiki pages and golden cases plus unmapped risks. No simulated edit writes to `omega.osl`. **Acceptance:** the change above mentions send capability/wiki and tests, and is labeled not safe to execute/publish.
- **S1** No external provider calls. Same short-lived, one-use Phase 0 gate for confirmations; source version and account/session/policy snapshot verified at dispatch. **Acceptance:** user can produce a mock receipt only from a current valid preview; server delegates to trusted Phase 0 Lab.
- **S2** Loopback-only server with strict Host, Origin and CSRF; body limit 32KiB, no arbitrary file retrieval or executable candidate submissions. Corrections stored only in local ignored `.local/`, never silently pushed to GitHub.

## 2. Information model

```
Capability: {id, revision, line, params[], consequences[], say[], hear[]}
SourceWiki: {status: DECLARED_NOT_PROVEN, capability, source_hash, declaration, tests, provenance, derived}
Observation: {input_revision, state, reading, alternatives, source_hash, preview?, wiki?}
ProposedCase: {id, input, expected, observed, feedback, source_hash, expected_provenance, status}
CandidateResponse: {state, reading} // DATA ONLY; no shell/network access
Comparison: {case_id, status: PASS|FAIL, diff, expected_provenance, candidate_executed: false}
Impact: {from_hash, to_hash, changed_capabilities, consequence_changes, wiki_pages, tests_first, unmapped_risks}
```

Use source SHA-256 for wiki/edit provenance and the existing domain-separated Phase 0 digest for commands and display. They **must not** be conflated. The wiki currently refers to the declaration text's SHA, while runtime snapshots use the broader source fingerprint; this deliberate difference must be resolved by an explicit source manifest before a production compiler.

## 3. Interaction layout

Three synchronized columns: **Intention/Live** (input, Plain Reading, candidates, confirmation and correction), **Origin/Wiki/Change** (declared capability, source lines, possible impact), **Experiment Runner** (proposed cases and candidate result comparison). Responsive to narrow screens; accessible controls and semantic live region. True screen reader/browser testing not yet performed.

The two evaluation axes are separate:

### A. Live interpretation benchmark

Input-to-visible-reading latency in milliseconds (client `performance.now` after input until DOM content assigned), server `interpret()` duration, p50/p95, stale-response displays (target zero), reading churn per input event, false-READY effect count (target zero), percent of meaningful tested input sequences with desired clarification, plus human comprehension in future supervised trials. Count denominators and input text revision/hash; no phantom token or cost estimates.

### B. Wiki coherence benchmark

Source-declared capability coverage (`source wiki` pages / total declared capabilities), source hash match, impacted-page detection recall on preregistered edits, tests detected by capability id, stale-wiki events, false documentation assertions, drift between documented consequence and actual mock behavior under independent tests. Current parser only attests structural source coverage; **semantic behavior coherence and all-code dependency completeness remain UNKNOWN**.

### Cross-cutting security gates

Consequence omitted, stale preview, replayed permit, source changed, account/session changed, unresolved ambiguity and explicit consent missing all block simulated side effect. Phase 0's existing gate tests remain authoritative for those assertions. The developer tools do not substitute a security proof.

## 4. Integration contracts

Run the new server separately from the existing Phase 0 demo:

```
python -m devtools.app --port 8770
```

Routes (same-origin, local-only): `GET /`, `/api/bootstrap`, `/api/metrics`, `/api/cases`; `POST /api/interpret`, `/api/choose`, `/api/confirm`, `/api/wiki`, `/api/capture`, `/api/evaluate`, `/api/impact`. Every POST carries Phase 0-style session and CSRF. Confirm delegates without modification to existing `Lab.authorize` and `Lab.dispatch`.

A failed `source_hash` validation is shown as blocked, never as a current interpretation. Updated wiki entries may display with `runtime_source_fresh: false`, and no existing preview can be reauthorized. A compiled declarative wiki with editorial layers is beyond v0.1.

## 5. Scope and phased roadmap

- **v0.1 included:** source-projection wiki; mock Live Lab; local correction capture; data-only candidate comparison; proposed consequence impact; basic local metrics; existing runtime's approval gate.
- **v0.2 next:** independently curated regression queue, measured per-case coverage, variant comparisons, stronger source-dependency graph, real browser keyboard+screen reader tests, source watcher without restart while maintaining source revision safety.
- **v0.3 later:** isolated untrusted candidate runner, sealed evaluator corpus, source-grounded wiki diff and editorial review, real PR feedback, rich graph visualization, and B1–B4 controlled experiments.

**Not claimed:** full compiler-generated Wiki from all code; live visual verification; real provider integration; running candidates in a sandbox; permanent regression promotion without review; actual time-to-correct improvement. These need separate experiment evidence.

## 6. Source and publication policy

Commit only read-only tooling code/docs/tests. Keep `.local/` user corrections out of Git. Never upload real prompt payloads, account keys, external source archives or secret holdout corpora by default. Do not edit `vendor/` source from tools. Keep five Z.ai computer instructions provisional until independent experiments justify allocating work. This is an extension of the Phase 0 lab, not a competing publication system; report unrun claims as NOT_RUN.
