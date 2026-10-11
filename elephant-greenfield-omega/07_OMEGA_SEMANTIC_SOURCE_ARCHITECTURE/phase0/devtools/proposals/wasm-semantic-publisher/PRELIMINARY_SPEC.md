# Preliminary specification — Ω WebAssembly Semantic Publishing Kit

> **NON-NORMATIVE HISTORICAL PROPOSAL (clarified 2026-10-11):** All Wasm-only hot-path, binary and no-Node/no-Python constraints described below are **candidate booster design choices, not shared runtime requirements**. Reuse the live-parity/wiki/publication experiments independent of implementation. [Current initial-state design](../../../../03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/INITIAL_STATE.md) · [booster candidate](../../../../03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/WASM_BOOSTER.md).


> **Rule 1 precedence:** [ONE Machine ↔ Human learning loop](../../../../RULE_1_MACHINE_HUMAN_COEVOLUTION.md). This Wasm/TS kit is a proposed realization *inside* a co-evolving SDK/compiler/runtime + representations loop, not a separate late phase. Observed human/machine/Wiki/intended-meaning discrepancies directly generate versioned SDK/compiler/runtime candidate experiments.


**Spec revision:** PROPOSAL-0.1 · **Status:** DESIGN / OPEN FOR CHALLENGE / NOT IMPLEMENTED.  
**Parent architecture:** [Phase 0 experimental reference](../../../README.md) and [current 3-tool PRD](../../PRD_AND_DESIGN.md). These remain running baselines and must not be rewritten by adopting this draft.  
**Applies to:** last hot stage of the LLM-native development automation loop, not necessarily the final shipped Ω application.

## 0. Outcome / minimal proof of concept

Build a portable, static, dependency-free-at-runtime **semantic input-and-publication surface** whose computational core is WebAssembly, authored from TS-family source or generated from a typed TS-owned semantic IR. A developer can type an ordinary-language intent and watch an **immediate deterministic Plain Reading** and **source-linked Wiki facts** for the current interpretation. Enter freezes the exact candidate revision and emits one immutable semantic publication. **Machine** reveals the canonical raw record; **Human** renders that same record for inspection and correction.

A fast lab can feed huge input/grammar-variant corpora into the identical Wasm interpreter **without UI rendering**. Agent-proposed compiler, grammar, vocabulary, label or Wiki changes stay in independently verifiable candidate releases until a referee proves sufficient invariants. This is a *closed-loop experimental accelerator*, not an LLM auto-executor.

### Non-goals for first slice

No full Ω MVP redesign; no real external provider integration; no browser automation; no model inference inside the per-keystroke path; no global Elephant runtime rewrite; no complete static-analysis Wiki for all arbitrary source; no claim of zero bytes of JS; no npm/Node/Python **runtime**. Build-time tooling outside the shipped final stage is permitted and must be reproducible.

## 1. Proposed ownership boundaries

| Layer | Proposed responsibility | Allowed technology |
| --- | --- | --- |
| Upstream Elephant / automation factory | Generate source-grounded candidate rules, experiments, critics, scorecards, artifacts | Anything effective, with independent evaluation and proper isolation |
| Source/contract compiler | Convert reviewed declarations + rule maps into versioned semantic IR, grammar tables, Plain Reading templates, Wiki fact graph and source trace map | Experimental compiler/agents/build tools; NOT required in browser hot path |
| Static dev kit assets | Provide input, keyboard events, mode switch, immutable publication inspector and Wiki viewport | HTML, CSS, tiny browser JS bridge generated from TS when practical |
| Wasm semantic kernel | Load versioned compiled contract; interpret; render; validate; emit canonical publication; batch evaluate; provide structural Wiki facts | WebAssembly; no imported provider/network/clock authority |
| Host bridge | DOM events, UTF-8 buffers and bounded Wasm calls; update Human view; persist/export or copy bytes when asked | Browser APIs only; minimal audited JS; no dependencies |
| Separate gate, if actions are ever demoed | Explicit intent selection, preview binding, consent and mock permission check | Existing Phase 0 mock gate as external reference; NOT the publication operation |

**Important:** A standard browser requires JS to access the DOM from Wasm. The kit has a *pure Wasm semantics core*, not an unsupported claim of an all-Wasm browser UI. Standard TypeScript compiles to JavaScript, not automatically to Wasm; compiler approach is a measured candidate (AssemblyScript is TS-like, not full TypeScript).

## 2. Logical components and contract

```text
Elephants / coding agents / harvesters / experiment designers
        │ proposals with origin, source hash and expected meaning
        ▼
Candidate declarations + tests ──▶ compiler/build ──▶ signed? versioned contract image
        │                                 │                   │
        ▼                                 ▼                   ▼
Independent evaluator + hidden cases   Wiki fact graph   Wasm lab (atomic activate)
        │                                             ┌────────┴────────┐
        │                                    LIVE: typed text          BATCH: arrays
        │                                      edit revision           1K...N cases
        │                                             │                  │
        │                                    interpret + render ◀──── same core
        │                                             │                  │
        │                               Plain Reading + live Wiki      │
        │                                             │                  │
        │                                        Enter freezes ◀────────┘
        │                                             │
        └─ accepts/rejects proposed version      ONE canonical publication
                                                      │
                                            ┌─────────┴────────┐
                                            ▼                  ▼
                                          MACHINE            HUMAN
                                          raw bytes          rendered facts
                                          same ID / source / meaning / status
```

### Proposed kernel interface (semantic signatures, not implemented API)

- `loadContract(contractBytes, contractHash)`: rejects malformed/source-incoherent declarations, returns compiled contract revision; never mutates current active revision until successful verification.
- `interpret(inputUtf8, revision, envSnapshotId, contractRevision)`: returns typed status `READY | NEEDS_CHOICE | NEEDS_INFO | INVALID | UNKNOWN`; source spans, candidates, exact account/provider/model IDs, alternatives, consequence flags and derivation trace. A READY result with unresolved alternatives is **not executable**.
- `render(candidateId, contractRevision)`: returns deterministic Plain Reading bytes, source-linked Wiki fact references and any 'why' trace. No model-generated improvisation.
- `verify(candidateId, renderedBytes, contractRevision)`: round-trip, injectivity/completeness obligations and deterministic source/authority-agnostic semantic validation within its stated coverage. If the proof is incomplete, marks proof NOT_VERIFIED rather than fabricating success.
- `freeze(inputRevision, candidateId, contractRevision)`: returns canonical immutable publication snapshot, or a valid non-executable blocked-status publication. No effect authorization occurs.
- `batchEvaluate(contractRevision, inputBatchBytes)`: applies the SAME interpret/render/verify path as interactive usage, with no HTML/DOM per item; returns compact results and witnesses.
- `wikiFacts(capabilityId, sourceRevision)`: returns declared parameters, consequences, Plain Reading template, proof status, tests and stable provenance anchors. Rendering them is a host concern, but truth originates in the contract.

The actual ABI might use pointer/length buffers or a packed arena. Benchmark allocations and JS↔Wasm boundary crossings; do not freeze ABI before experiment.

## 3. The typing / Enter / choice state machine

**Typing:** On each edit, increment `input_revision`; clear any prior actionable preview; run the interpreter asynchronously or in a bounded time slice. An older result cannot update a newer input revision. The visible sentence and Wiki facts must carry matching contract/source revisions and must update together. Prefix ambiguity is a normal intermediate state, not a parser failure.

**Preview:** Display exact command consequence, bound provider/account/model/session when known, quoted payload without reinterpretation, alternative meanings, missing fields and why-trace. Wiki panel selects the currently inferred capability and shows only facts derived from the matching declaration revision, plus clearly marked not-proven notes.

**Enter:** Atomically freeze `(input_revision, exact input bytes, selected candidate or unresolved status, contract_revision, source_hash, reading, wiki facts/links, trace)`. Publication returns an immutable canonical record plus its content hash. It is allowed to publish `NEEDS_CHOICE` or `UNKNOWN` to the experiment ledger; this is **not** an executable READY command. Prevent pressing Enter twice from silently upgrading semantics or permissions.

**Machine view:** export the record's canonical structured bytes and display its ID.  
**Human view:** interpret **those same frozen bytes** through a deterministic, escaped renderer into Plain Reading, active Wiki excerpt, consequence and evidence, with identical publication ID/status/source. The renderer MUST NOT evaluate a fresh candidate or write a second, diverging semantic record.

**Correction:** `This is not what I meant` starts a new proposed case referencing the original publication ID and expected alternative meaning. It NEVER patches the immutable publication nor auto-accepts a changed golden expected result. The independent evaluator may later accept/deny the proposal.

**Action (outside this kit's first slice):** Explicit selection/confirmation and current permission-bound approval occur *after* publication and in a separate trusted mock gate. Never treat Enter, a semantic digest, A2A payload or a readable Wiki as action permission.

## 4. Machine/Human sameness must be formal

The two modes cannot literally output identical bytes if one outputs JSON and the other outputs HTML. The **shared invariant** is *one canonical record*, not byte-for-byte identical UIs:

1. `publication_id` and `publication_digest` are computed once from canonical bytes and displayed unchanged in BOTH projections.
2. `status`, `capability`, `args`, `alternatives`, `effects`, `source basis`, `reading`, `wiki facts`, `trace` and `proof flags` are materialized in that record; no projection adds asserted semantics.
3. Human prose is generated from declared templates/facts (escaped, not model free-form) and bound to their field/source IDs. Editor commentary is labelled USER_PROPOSED or EDITORIAL_UNVERIFIED, not truth.
4. Selecting a different mode NEVER reruns recognition, changes a grammar revision, alters a field, or creates a new publication.
5. Changing text, target selection or contract after Enter creates **another** publication/revision; previously emitted records remain replayable.
6. Verify Human fact coverage from the canonical record; detect hidden consequence, wrong account, false statement, missing source anchor and misleading partial states as parity failures.

Use distinct **semantic command digest** (identity only), **publication digest** (frozen status/reading/facts/source identity) and **execution permit** (only minted by a separate authority-aware gate). The suggested digest domain is versioned SHA-256 over restricted canonical UTF-8 JSON; finalize its exact Unicode, set ordering and escaping algorithm after TS/Wasm/Python cross-tests.

## 5. Proposed publication record and Wiki model

See [illustrative candidate JSON](PUBLICATION_ENVELOPE_CANDIDATE.json). Required conceptual fields:

```text
Publication:
  schema_version, event_id, input_revision, raw_input/hash, source_revision,
  compiled_contract_hash, active_grammar_version, status,
  command {capability_id, args} | null, alternatives[], missing[],
  consequences[], plain_reading {text, template_id, coverage},
  wiki {selected_capability, facts[], source_refs[], missing_claims[]},
  derivation_trace[], proof {round_trip, injection, completeness, freshness},
  semantic_digest | null, publication_digest, effects_authorized=false,
  evidence_provenance and privacy classification
```

Canonical content must **exclude its own digest** when hashing to avoid recursion. A unique event ID/clock, if useful, is metadata separate from the deterministic semantic content digest; timestamp/nonce cannot contaminate command identity. Persist with content-addressed anchors. Handle arbitrary sensitive prompt text cautiously and default to LOCAL_ONLY rather than public GitHub push.

A `WikiFact` is a typed claim with `id`, `capability_id`, `source_file`, `source_range`, `source_revision`, `claim_type` (DECLARED / OBSERVED / INFERRED / EDITORIAL), `value`, `verifier_status` and `dependencies[]`. DECLARED does not mean independently behavior-verified; INFERRED is never used to prove coverage or eliminate tests. The Wiki viewport is a fast projection of already compiled/cached facts and live semantic selection—**not a whole new LLM-generated wiki on every keystroke**.

## 6. Fast-change and source-version lifecycle

- Draft declarations/config in an isolated candidate workspace; source and proposal lineage are explicit.
- Precompute the grammar tables, rendering templates, consequence index, wiki facts and dependency graph.
- Build candidate Wasm module or load a new validated contract image (two competing strategies).
- Independently verify frozen public fixtures, unseen adversarial cases, source trace completeness and unsafe ambiguity.
- Activate a new `contract_revision` atomically **only after experiment acceptance**; invalidate uncommitted previews and rebind new facts to the new source hash. Keep old revisions available for replay/rollback.
- Both `Machine` and `Human` must consume the identical active or frozen snapshot, not whichever compilation finishes last.
- Incomplete or unsafe variants remain published as candidate packs with FAILURE/BLOCKED lineage, not silently discarded.

**Candidate compiler tuning is fast experimentation, not real-time autonomous permission to rewrite the production grammar.** Correctness gates may take longer than a UI frame; the lab should show a truthful pending status while continuing to display the last verified revision as such.

## 7. Portability and build constraints

### Shipped minimum

- Static HTML/CSS; tiny audited browser JS bridge (which may be compiled from TypeScript upstream); `.wasm` semantic engine; versioned declaration/contract image if external.
- No `node`, `python`, npm, cloud API, framework, database or OS daemon required to **use** the published final-stage kit.
- The browser must run fully disconnected once loaded. Static serving may be needed for browser security/MIME rules; a single-file embedded-Wasm option is *experimental*, not guaranteed.
- Batch mode must run Wasm with a minimal host outside the browser as well; its portability under a browser Worker, WASI runner or another host is to be tested, not assumed.

### Candidate source/build strategy (OPEN)

A) AssemblyScript (TypeScript-like constrained subset) → Wasm, with very small host bridge.  
B) TypeScript-managed typed declarations / IR → generated Wasm grammar data/kernel, keeping authored semantics TS-family.  
C) Any smaller provably equivalent Wasm encoding that is reproducibly emitted from the same declared source, subject to monolingual-source constraints.

Do not accidentally introduce a second semantic implementation in the JS bridge; it may render DOM and relay bytes, not decide command authority or invent Wiki facts. Benchmark Wasm initialization, memory use, encoding, per-call crossing, cold/warm performance and cross-platform reproducibility before choosing a compiler.

## 8. One complete illustrative demonstration

Input as typed:

```text
tell chatgpt personal account balance please
```

The existing Run A fixture is known to have a competing target/payload boundary interpretation. In the new *proposed* runtime:

1. Typing produces provisional candidate meanings and their deterministic Plain Readings.
2. Status carries `ambiguity.blocking = true`; consequence stays explicit.
3. Wiki panel highlights the `cap:prompt.send` grammar slots and exactly which `hear` rule matched, with source anchors.
4. Enter freezes a **non-executable** publication; Human and Machine share ID and alternative list.
5. Developer marks: `account balance please` is payload, not a target account phrase; this creates a user-proposed experiment case.
6. Elephant workers synthesize competing grammar/rule or UI-choice revisions. They replay original golden fixture, hidden independent cases and this case.
7. The evaluator rejects candidates that erase words, silently pick a different account, drop a consequence, or reject every valid request.
8. Only a proven accepted candidate becomes the active lab contract; the same input now yields a re-versioned record and updated Wiki fact linkage.
9. Impact graph identifies affected tests/reading templates/Wiki pages, and the result is archived alongside negative attempts. No real provider is contacted.

The qualitative flow is proposed; no timing or success rate for this entire loop has been measured.

## 9. Interface acceptance / fail-closed criteria

- `sameInput + sameContract + sameSnapshot` gives the same semantic content and deterministic plain wording (excluding explicitly separate event metadata).
- At publication, `Human` and `Machine` share **one** record ID and semantic status; a mutated view can be detected and never becomes authority.
- Every source/Wiki fact comes from the pinned contract/source revision. Unverified editorial text remains marked.
- A stale typing result may not replace the current reading; a stale Wiki fact may not be shown as current.
- An ambiguity or failed round-trip can still yield a non-executable diagnostic record; there is no implicit execute side-effect path.
- In batch, no DOM work, no web requests, no provider accounts, no permission tokens. Batch and interactive must agree on the same fixtures.
- All quantitative performance, throughput and improvement claims require instrumented replay and comparison to the Phase 0 reference and a conventional JS/TS control.

**Read [automation lab wiring](AUTOMATION_LOOP_WIRING.md) and [benchmarks](BENCHMARKS_AND_EXPERIMENTS.md) before promoting any design choice.**
