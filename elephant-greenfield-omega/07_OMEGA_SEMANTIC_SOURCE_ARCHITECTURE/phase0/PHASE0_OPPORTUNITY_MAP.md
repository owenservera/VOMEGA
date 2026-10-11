# Phase 0 opportunity map — NOT_FROZEN



Measured Phase 0 source replay, public comparison and local gate/HTTP tests; no sealed evaluation or production proof.



Qualitative priority: safety first, portability next, then falsifiable acceleration and UX/context value. Not a measured ROI ranking.



Recommended five computers remain distinct. Ranking is work priority, not a new count of parallel sessions. Each computer can organize its own experiments; no session has been launched. Existing master prompts are unchanged.



## 1. C2 — Independent ambiguity, authorization and candidate referee



**Demonstrated gap:** 758 wrong-but-READY Run A extra cases; original diagnostic flag does not block execution. Candidate code execution remains blocked.

**Evidence:** `evidence/cross-comparison.json`, `goldens/false-ready-regressions.jsonl.gz`, `tests/test_gate.py`, `evaluator.py`

**Value:** Prevent semantic uncertainty or transport metadata from authorizing effects; make other computers safely comparable.

**Independence / dependencies:** Start now from frozen raw sources and public vectors; separate evaluator custody from candidate builders.

**Ambitious alternative:** Ambitious alternative: a small state-machine/model-checking referee plus disposable OS sandbox instead of another parser-focused red team. Compare with adversarial property tests.

**Cheapest falsifiable experiment:** Implement isolated data/command intake and model the preview→permit→receipt state transitions; attempt corruption, timeout, concurrent replay and reject-everything candidates.

**Acceptance:** Zero unauthorized receipts across at least 100 preregistered mutation schedules; every seeded fault caught; valid controls execute exactly once; untrusted runner cannot read a mounted secret sentinel or use network.

**Negative controls:** Permit = semantic digest; Removed dispatch snapshot check; Always reject candidate; Candidate tries network/host-file read.

**Effort ESTIMATED:** 3–6 engineer-days. Method: One isolated runner + state model + roughly six fault strata; excludes third-party security audit.

**Risk:** False confidence from public tests; sandbox escape or holdout leakage.

**Integration friction:** Medium: requires OS isolation capability and agreed wire contract.

**Available now:** `runtime.Lab`, `evaluator.evaluate`, `oracle.check`, `goldens/manifest.json`

**Unknowns:** Available sandbox substrates on five computers; Who controls sealed evaluator custody.

**Change allocation when:** If isolated execution cannot be deployed, keep grading data-only and prioritize an external referee environment.



## 2. C1 — Portable semantic compiler with independent differential proof



**Demonstrated gap:** Working core is Python; TypeScript only covers the browser. Partial provenance and grammar evolution remain unproved.

**Evidence:** `vendor/runA/engine.py`, `goldens/public.jsonl`, `goldens/reachable.jsonl`, `canonical-check.mjs`

**Value:** An SDK usable in the Windows/browser stack with source-bound deterministic readings and reproducible semantics.

**Independence / dependencies:** Can begin from frozen goldens immediately; never wait for C2 to invent the whole runtime.

**Ambitious alternative:** Ambitious alternative: generate a language-neutral IR and parser tables from declarations, emitting TS or WASM, versus hand-porting the Python interpreter.

**Cheapest falsifiable experiment:** Port six capabilities behind interpret/render/parseReading; compare byte-exact results and digests against the fixture and all reachable states; measure registry and input-length growth.

**Acceptance:** 179 public vectors and 417 state readings match, all 70,101 generated rows receive separately reported fidelity/ambiguity results, no additional unflagged false READY, Unicode rejection agrees across runtimes. Preserve all known failures instead of training them away silently.

**Negative controls:** Reordered set changes digest; Dropped consequence; UTF-16/UTF-8 hash mismatch; Default account injected silently.

**Effort ESTIMATED:** 4–8 engineer-days. Method: Compiler/recognizer port + renderer inverse + cross-runtime fixtures, not full production SDK.

**Risk:** Replicating original parser bugs; claiming stronger grammar coverage than observed.

**Integration friction:** Medium: explicit adapter schemas and canonical encoding are available; existing internal state shapes need normalization.

**Available now:** `INTERFACE_V1.md`, `goldens/manifest.json`, `checker.py`, `canonical-check.mjs`

**Unknowns:** Best grammar compilation strategy; Whether full source spans can be retained economically.

**Change allocation when:** If table-driven generation materially reduces mutation cost with equivalent safety, prioritize IR over a line-for-line port.



## 3. C3 — Declaration evolution and a credible B4 conventional twin



**Demonstrated gap:** Six-capability independent checker is hard-coded; no proof declarations make correct changes cheaper. compileHelp is absent.

**Evidence:** `oracle.py`, `vendor/runA/omega.osl`, `vendor/benchmarks/B4_CHANGE_VELOCITY.md`, `interface.json`

**Value:** Test the central development acceleration claim before expanding the semantic platform.

**Independence / dependencies:** Use current Python twin now; future TS twin equivalence is a comparison gate, not a prerequisite to drafting blinded tasks.

**Ambitious alternative:** Ambitious alternative: typed TS capability objects with generated reflection and property tests instead of a bespoke DSL. Include source-to-capsule compilation as an optional third arm.

**Cheapest falsifiable experiment:** Build a conventional behavior-equivalent twin independently, then run preregistered changes: add capability, rename entity, change consequence, fix bug, update model compatibility.

**Acceptance:** Twins pass the same frozen behavior suite before comparison; at least five repeats per task per arm with matched model/budget; zero escaped authorization regressions; report tokens only with real counters and report a loss honestly.

**Negative controls:** Changed declaration with stale wiki; Cosmetic-only easy task bank; Compiler cost excluded; Underpowered conventional twin.

**Effort ESTIMATED:** 5–10 engineer-days. Method: Two implementations, five task categories, instrumentation and repeated trials; dependent on model access.

**Risk:** Biased tasks and unequal implementation quality manufacture acceleration.

**Integration friction:** High: evaluator extensions must be independent, and new declarations must not silently change the frozen fixture.

**Available now:** `vendor/runA`, `checker.py`, `candidate manifest shape`, `SOURCE_MANIFEST.json`

**Unknowns:** Real token counters in Z.ai sessions; Independent twin quality and reviewer availability.

**Change allocation when:** If conventional typed declarations win, retain source-grounded contracts but drop the custom DSL as a requirement.



## 4. C4 — Ambiguity-first command UI and human comprehension



**Demonstrated gap:** Loopback flow passes; browser rendering, Windows runtime, accessibility and human understanding are unverified. Many generated inputs are flagged ambiguous.

**Evidence:** `web/app.ts`, `server.py`, `tests/test_http.py`, `evidence/cross-comparison.json`

**Value:** Make account selection, exact payload and consequences understandable with minimal correction steps.

**Independence / dependencies:** Use current bridge and mock snapshot; no real provider or finalized core port required.

**Ambitious alternative:** Ambitious alternative: structured editable sentence chips plus live alternative-meaning previews, compared with free text and a single confirmation card.

**Cheapest falsifiable experiment:** Run browser automation and Windows installation first; then compare text-card versus structured choice UX on account/payload-boundary cases with consenting human participants.

**Acceptance:** All dispatch-blocking tests remain green; keyboard-only completion and narrow viewport pass; no confirmation survives edits; preregister human error/correction measures and report denominator and uncertainty. No comprehension claim without people.

**Negative controls:** Ambiguity shown as warning with active confirm; Hidden consequence behind disclosure; Default target preselected; Stale preview after fast typing.

**Effort ESTIMATED:** 3–7 engineer-days. Method: Two UI variants + browser/Windows checks + small participant study; recruitment excluded.

**Risk:** Decorative UI masks incomplete semantics; opaque alternatives overwhelm users.

**Integration friction:** Low to medium: existing local endpoints work; choice flow supports only complete single-account partials.

**Available now:** `web`, `server.py`, `runtime.Lab.choose`, `run.ps1`, `setup.ps1`

**Unknowns:** Participant recruitment; Windows Python/browser availability; Which choice presentation users understand.

**Change allocation when:** If structured editing reduces errors substantially, favor it over expanding unrestricted parsing.



## 5. C5 — Source-fresh context and lossless handoff economics



**Demonstrated gap:** No B2/B3 execution, no generated help/capsules, no measured relay overhead or token savings. Transport must not carry authority.

**Evidence:** `INTERFACE_V1.md`, `vendor/benchmarks/B2_AGENT_CONTEXT.md`, `vendor/benchmarks/B3_HANDOFF_FIDELITY.md`, `evidence/B2.json`, `evidence/B3.json`

**Value:** Let later agents consume the source faithfully and cheaply while keeping current-state execution checks local.

**Independence / dependencies:** Starts from current source hashes and public vectors; use local synthetic relays until external experiments are separately authorized.

**Ambitious alternative:** Ambitious alternative: a content-addressed source graph queried by grep/code mode with a simple JSON envelope, versus compiled capsules plus A2A extension. Do not assume A2A is necessary.

**Cheapest falsifiable experiment:** Answer a blinded mixed source question bank before/after mutations using grep, whole-file, vector and capsule arms; separately pass identical commands through native JSON versus typed envelope hops with injected faults.

**Acceptance:** Zero stale answers on declared source-mutation safety subset, 100% detection of seeded digest/basis faults, valid control acceptance, true token/wall-time/build-refresh costs; no authority accepted from envelope alone. B2/B3 wins require matched full arms.

**Negative controls:** Old capsule hash with new code; Valid digest and absent permit; Relay drops consequence; Grep baseline denied useful files.

**Effort ESTIMATED:** 4–9 engineer-days. Method: Four retrieval arms, mutation questions, two relay transports and counters; embedding/model provisioning excluded.

**Risk:** Combining context and relay work grows scope; token measurement may be unavailable.

**Integration friction:** Medium: identities exist but source-grounded help is absent; split into two bounded experiments inside the one computer.

**Available now:** `source_hash()`, `oracle.digest`, `goldens/public.jsonl`, `evaluator.py`

**Unknowns:** Offline embedding availability; Meaning-preserving relay metrics with real models; Real context/token witnesses.

**Change allocation when:** If context retrieval dominates the bottleneck, defer A2A and use simple envelopes until a transport advantage is measured.



## Allocation gate



Review the replay results and remaining blockers with Owen before writing final five-computer prompts. The first shared dependency is a versioned interchange contract and source fixture; it is available now. The second is an independent sealed evaluator and safe candidate execution environment; it is not available yet. Do not let that absence turn public conformance into certification.
