# Owner proposal, assistant considerations, and decisions still open

**Disposition:** proposal recorded for deliberation, not a product architecture ratification. Applies solely to the final-stage semantic publishing kit inside the dev automation loop.

## A. Owner's proposal — recorded intent

- The LLM-native Ω automation factory should accelerate development through repeated Elephant- and agent-generated experiments, potentially thousands of semantic variations as fast as machines can evaluate them.
- **Only the final stage of the loop is constrained**, not the whole lab or its upstream compilation/analysis tools.
- The developer should see a **text box** and, during typing, a **natural-language interpretation understandable to non-engineers**, with a linked **live source-derived Wiki panel**.
- When the user presses **Enter**, the current declared/verified interpretation is the publication boundary.
- There are **Machine** and **Human** modes. Both must publish **exactly the same semantic content**; Machine is raw structured format, Human is the readable rendering.
- The last-stage kit should be as pure, small, portable and dependency-free as possible. The runtime target is **WebAssembly**; **no Node or Python runtime**; TypeScript-family language is preferred for authored application logic. Python or other tools upstream may help analyze/optimize during development.
- The wider Ω MVP architecture is explicitly **NOT set in stone**. This research is about a dev-automation accelerator, not locking the product stack.

The bullets above record the owner's intended direction; no claim is made that these capabilities have been implemented or benchmarked.

## B. Assistant's preliminary technical recommendations — hypotheses

1. **One immutable canonical publication envelope, two read-only projections.** A Machine/Human mode switch never recomputes semantics or changes its publication ID. Rendered text/Wiki explain structured facts but have no independent authority.
2. **Two runtime paths on one engine:** an event-driven interactive path for keystroke responsiveness and a batched, DOM-free Wasm evaluation path for high-throughput experiment sweeps. Compare results byte-for-byte for shared fixtures.
3. **Compile/change upstream; interpret fast downstream.** Upstream LLM work may alter a candidate declaration or source index; a checked/compiled contract and precomputed Wiki facts enter the Wasm sandbox atomically. Do **not** call an LLM for every keystroke or regenerate every Wiki page per character.
4. **Enter freezes/publishes; it does not execute.** An unresolved parse remains published as NEEDS_CHOICE/INVALID/etc.; explicit resolution and fresh permission are distinct events. No ready-but-ambiguous effect.
5. **Safe rapid tuning is a controlled experiment**, not self-modifying interpretation: correction → hypothesis → candidate grammar/template → concurrent replays → independent oracle & negative controls → promote/rollback with revision invalidation.
6. **Thin host adapter:** HTML/CSS and a small JS bridge are needed for browser DOM events; semantic evaluation and publication serialization should stay inside Wasm where practical. No UI framework or service runtime required to run the final static kit. Do not call a JS-only interpreter "pure WebAssembly".
7. **Human Wiki coherence is a measured property** rather than an aesthetic promise: each fact must point to an exact source declaration/revision or be labelled an editorial hypothesis; drift blocks verified claims.

## C. Technical facts and portability constraints

- WebAssembly is designed to execute alongside a JavaScript browser host and presently does not directly operate browser DOM APIs. See [MDN WebAssembly concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts) and [MDN WebAssembly JS API](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Using_the_JavaScript_API).
- AssemblyScript compiles a **variant/subset** of TypeScript to Wasm; not all regular TS language semantics are supported. It is a **candidate** build-time compiler, not a decision or runtime dependency. See [AssemblyScript introduction](https://www.assemblyscript.org/introduction.html).
- "Pure Wasm" here means the **semantic hot kernel and canonical publication implementation**, not the absence of browser UI glue. Measure and disclose JS↔Wasm copying/encoding overhead. Avoid falsely claiming unrestricted TypeScript can be compiled directly to Wasm by standard `tsc`.

## D. Non-decisions / targeted experiments

| Question | Candidate alternatives | Test before deciding |
| --- | --- | --- |
| How to build Wasm from TS-family source? | AssemblyScript subset; declaration IR → Wasm compiler; other compiler-generated module | Language compatibility, correct strings/Unicode, source mapping, tooling footprint and independent reproducibility |
| How to change grammar rapidly? | Load a new precompiled declaration image; incremental grammar tables; compile fresh module | Full compile+prove+activate latency, cache invalidation, replay safety |
| How does Wiki update? | Cached fact graph + dependency invalidation; recompute affected projection | Source trace coverage, update delay, omissions and false promises |
| Where is the canonical record serialized? | Wasm-owned encoder (preferred hypothesis); host-owned restricted encoder with independent check | Byte identity across batch/interactive hosts, corrupted data rejection |
| Offline distribution | Static local origin; embedded Wasm in single HTML; local file bootstrap | Actual browser support, CSP, security and artifact portability |
| UI layout | Floating box + side Wiki; compact switcher + expandable Wiki; three-pane developer mode | Keyboard flow, readability, update churn and capture time |
| What is 'nearly instantaneous'? | Explicit measured latency budgets, no assumed number | p50/p95/p99 from edit→visible meaning, correction→tested candidate, candidate→published revision |

## E. Decisions explicitly deferred

Do not freeze the five Z.ai computer assignments, the Ω v0.5 product UI, a new universal Elephant DNA, an A2A dependency, any full-stack framework, or a production-ready semantic compiler based on this first-stage note. Continue comparing with Python Phase 0 under identical fixtures. Any apparent gain must have provenance, reproducer, actual denominator and neutral comparison.

**Maturity: DISCOVERED/DESIGN.** Neither Wasm validation nor real human comprehension has yet been performed in this proposal.
