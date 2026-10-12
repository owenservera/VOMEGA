# RUN NOTE — Run C: WikiCore Verbs and Self-Runtime

**RUN ID:** C
**Run date and pinned repo commit:** 2026-10-12 · `1199b38c1fd174e997c92b22d18d8c20c952eb9e` (equals `origin/main` at run time)
**Fixture pinned at:** blob `d846b2e0c18be831b62f5deae0fa325779576021`, sha256 `fe0c651e…a386d5`, 1001 bytes, working tree clean
**Agent/model and context restrictions:** ZCode session (`opencode-acct-3/space-bunny-free`), single context, no access to arms A/B/D or their results. `runs/A-2026-10-12/` existed on disk and was deliberately **not read**. `LEGACY_ALIGNMENT_MAP.md` deliberately not read (blind-discovery arm).
**WORKING ARTIFACT OR CODE LINK:** [`README.md`](README.md) in this directory — 5 research probes plus 2 evidence files, regenerable with two commands. Main deliverable: `probe/groundtruth.mjs` (compiler + execution witnesses) and `probe/compare.mjs` (the three-surface comparison).

---

## QUESTION / HYPOTHESIS

Which **operations** — not nouns or schemas — must exist for a system to inspect, explain, relate, challenge and update its own knowledge?

Three competing positions, tested against one planted discrepancy:

- **H0 (control) — no protocol.** Standard tools (`rg`, `git`, `tsc`, `node`) plus a source-pinned index. Nothing else.
- **H1 — verb-led.** A small menu of verbs mirroring what a developer already does by hand.
- **H2 — predicate-led.** Composable three-valued predicates `enforced` / `witnessed` / `exists` over (subject, property).

---

## WHAT I ACTUALLY DID

1. **Established ground truth first** (`probe/groundtruth.mjs`). Compiled the fixture with `tsc 7.0.2 --strict`, typechecked a caller that *deliberately violates* the fixture's documented precondition, typechecked a **control** caller containing a real type error, then executed the compiled module.
2. Built a source-pinned index over the fixture (`probe/index.mjs`) — sha256 pin, symbols, doc claims, call edges.
3. Built both vocabularies as real code over that same substrate (`probe/v1-verbs.mjs`, `probe/v2-predicates.mjs`).
4. Ran the four required questions — **symbol, explanation, relationship, contradiction** — through all three surfaces and scored them (`probe/compare.mjs`).

---

## TEST EVIDENCE — TESTED (exact witness)

**The fixture contains a planted contract that nothing enforces.** Line 17 declares *"count is a nonnegative safe integer. Not enforced."*

| Witness | Result |
|---|---|
| `tsc 7.0.2 --strict` on caller with `repeat(-1)`, `repeat(2.5)`, `repeat(NaN)` | **exit 0 — all three accepted.** Precondition is not type-enforced. |
| **CONTROL:** same compiler, caller with a real type error | exit 1, `TS2322: Type 'number' is not assignable to type 'string'` — the checker was live, so the exit 0 above means something |
| Runtime `repeat(-1)` | `[]` — 0 emissions, **no error** |
| Runtime `repeat(NaN)` | `[]` — 0 emissions, **no error** |
| Runtime `repeat(2.5)` | `[0, 1, 2]` — **3 emissions from a fractional request** |
| Runtime `repeat(0.5)` | `[0]` — **1 emission** |
| Runtime `repeat(3.7)` | `[0, 1, 2, 3]` — **4 emissions** |
| Emitted JS body | `(count, emit) { for (let i = 0; i < count; i++) emit(i); }` — guard scan: `false` |

**The finding beyond the planted one:** fractional counts **silently round up to `ceil(n)`**. `repeat(2.5)` yields three values, `repeat(3.7)` yields four. Nothing throws, nothing warns. A caller asking for "2.5 items" receives 3 — and a caller passing a negative or `NaN` receives a silent empty result that is indistinguishable from `repeat(0)`.

---

## MACHINE ↔ HUMAN SIGNAL (Decision 3)

- **Source/task:** `repeat(count, emit)` at `fixture/001-semantic-basics.ts:18`, pin `fe0c651e…`.
- **Machine meaning:** `enforced(repeat, "count is a nonnegative safe integer")` → **FALSE**. `typeSystemEnforces = false`, `runtimeHasGuard = false`, `throws_on = false` for every violating input.
- **Human reading:** *"`repeat` says it wants a whole non-negative number. It doesn't check. Give it 2.5 and it will hand you three things without complaining."*
- **Comparison:** machine and human agree, and agree with the executed behaviour. **No discrepancy found — and that itself is the point: agreement here required an execution witness, not a reading of the comment.**
- **Evidence status:** TESTED (tsc + node execution, reproducible by the commands in `README.md`).
- **Next test:** see falsifier below.

---

## WHAT SURPRISED OR FAILED

**The most important result of this run is a failure of my own tooling, not a property of the fixture.**

My first comparison run reported `contradictionFound: false`. That was wrong. The cause: my symbol-index regex used `([^)]*)` to capture parameters, which cannot match `repeat`'s nested `(value: number) => void`. The parser silently skipped the declaration, so every query returned `NOT_FOUND`, and a *tooling failure rendered as a negative research finding*.

Had I not cross-checked against ground truth I would have reported "no contradiction found under any vocabulary" — a confident, entirely fabricated result.

A second self-inflicted error: I had inverted `typeEnforced` (`exitCode === 0` was read as "enforced", when exit 0 means the compiler *accepted* the violations). That produced a false `verdict: "claim appears enforced"` — the exact opposite of the truth. Two earlier harness defects (a `TS2307` module-resolution failure reported as a rejection; precondition violations conflated with a real type error) also produced misleading verdicts before being fixed.

**Conclusion this forces:** a self-runtime must report its own parse coverage as a first-class, checkable fact. Every one of these failures was *silent* and all three pointed the same direction — toward a clean bill of health. This is concrete evidence for the E08 behaviour ("know what is actually available vs merely declared") rather than an argument for it.

---

## WHAT THE THREE SURFACES ACTUALLY SCORED

| Criterion | H0 no-protocol | H1 verbs | H2 predicates |
|---|---|---|---|
| Surfaced the contradiction | **NO** | YES | YES |
| Attached provenance (sha256 pin) | YES | YES | YES |
| Separated CLAIM from WITNESS | **NO** | YES | YES |
| Could enumerate its own unknowns | **NO** | implicit (a string) | **explicit, 4 listed** |

**H0 fails at the central question.** `rg -n repeat` finds the token; it cannot know the doc comment contradicts the behaviour. A human *can* notice — but only by already knowing that doc comments lie. The no-protocol control is adequate for *retrieval* and inadequate for *self-knowledge*, which is a cleaner statement of the thesis than I expected going in.

**H1 and H2 tied on three of four criteria.** They differed only on whether unknowns are *enumerable*. I expected the predicate form to win broadly; it did not. Reporting that honestly rather than manufacturing a win for my favoured design is the point of running a control.

### Orphans found
`classify`, `accumulate` and `MAX_RETRIES` are declared and never referenced in the file. `MAX_RETRIES` is the interesting one: it reads as though it relates to `repeat`, and nothing relates them. Nothing in the fixture establishes a connection, and no witness supports one.

---

## THE BOUNDARY: "I describe" vs "I can execute now"

This was the mission's core question. Empirically:

- **"I describe a capability"** = a `CLAIM` exists (a doc comment, a declaration, a signature).
- **"I can execute it now"** = a `WITNESS` exists (a tool actually produced it).

The single operation that makes this boundary mechanical is **`enforced(subject, precondition)`** — it is not any introspection verb. It requires *two independent witnesses* (type level and runtime level) and returns a three-valued result.

**Proposed admission rule:** every capability the system advertises carries one of `WITNESSED` / `UNKNOWN` / `NOT_IMPLEMENTED`. **Never two-valued.** A capability with no witness is `UNKNOWN`, and `UNKNOWN` is not permitted to render as `TRUE`.

### Comparison with the historical `?` and `=` (Arm C's assigned prior art)

Source-inspected from `SYMBOLIC_LANGUAGE_INTAKE.md`: `?` = *query/interrogate*, `=` = *assert/define/teach*.

The historical pair has **assert** and **query**, but no third operation that distinguishes *asserted* from *verified*. That gap is precisely what `repeat` exploits: `=` establishes the contract by assertion, `?` retrieves it, and neither can report that nothing ever checked it. The prior art already half-anticipates this — it records that `✓` is "accept a consent/action card, **NOT proof of verified behavior**" — but carries that caution as prose about a glyph rather than as an operation. `enforced` promotes it to a first-class queryable predicate.

---

## RELEVANT EXPECTED BEHAVIOR(S)

**E02** explain capabilities and limits · **E05** detect contradictions/staleness · **E08** know what is actually available vs merely declared. **E05 was demonstrated; E08 was demonstrated the hard way, by failing it first.**

## PROTOCOL / SDK / ELEPHANT CANDIDATE

**PROPOSED — 3 operations, not a 12-verb catalogue.** A 12-verb WikiCore list is what the Arm C prompt warns against, and nothing here justifies it.

1. `exists(subject)` — is it there, and at which pin
2. `witnessed(subject, behaviour)` — closed-world: only what a witness produced
3. `enforced(subject, precondition)` — the CLAIM/WITNESS separator, two-witness, three-valued

Plus one admission predicate: `can_execute_now(operation)`.

If admitted, these belong in the Elephant capability pack as **candidate** knowledge. They are **not** ratified canon and require the Round 1 reviewer and the decision tracker.

## OTHER PLAUSIBLE APPROACH

A single opaque `?` query returning structured output — fewer concepts, no menu to design, and the prior art's actual shape. Also credible: keeping V1's five verbs, which are simpler and scored nearly as well. **H1 remains a live contender, not a rejected alternative.**

## SMALLEST NEXT FALSIFYING TEST

**Targeting my own favoured design (H2).** `enforced` requires *executing* code to produce its runtime witness. So test: **given a precondition that is violated only at runtime, can `enforced` answer without execution — from source and type information alone?** If it cannot, then `enforced` is a *test* operation, not a *self-knowledge* operation, and the self-runtime claim collapses: the system cannot introspect its own contract without doing the thing the contract governs.

That is one function, one doc comment, one static-analysis pass. It is the cheapest experiment that can kill my favoured approach.

**Secondary:** re-run all three surfaces against a second fixture with a *different* defect class (stale doc, dead export, cross-file claim). If V1 matches V2, the predicate machinery is unjustified complexity.

---

## UNKNOWN OR BLOCKED

- **Cross-file analysis: not implemented.** `RELATE(repeat)` returns no edges. This is a *true negative*, verified by a positive control (`accumulate → add` is detected), not a silent parser failure — the exact failure mode described above.
- **No TypeScript AST.** The global TypeScript 7.0.2 install ships only the CLI bundle (`tsc.js`), with no API module, so the index is a balanced-delimiter scanner rather than a compiler AST. Recorded in `index.limits` so it can be discounted.
- **Cost/time telemetry: UNKNOWN.** No measurement taken; I will not estimate one.
- **Real-code cohort: NOT ATTEMPTED** (Decision 1). This run used the controlled fixture only. Per the feeder rule, that is declared rather than passed off as a successful real-source input.
- **Visual projection: minimal.** A machine-readable assertion for the contradiction is in `evidence/comparison.json`. No 3D canvas rendering was produced; parity claims are **NOT_RUN**, not passed.

## GOVERNANCE RECORD

- **Decision 1 (feeder):** fixture only; no new ingestion pipeline invented.
- **Decision 2 (automation):** reused existing tooling — `tsc 7.0.2`, `node 24.11.1`, `rg 14.1.0`, `git 2.51.2`. **Nothing was replaced.** No new evaluation backend.
- **Decision 3 (signal):** section above.
- **U-level:** **U1 (Explainable)** for this run's tooling — introspection and source-linked explanation exist and are witnessed. Not U2: no typed proposed edits exist. Not U4: nothing here governs the SDK's own changes.
- **Blind discovery:** yes for the vocabulary design; `SYMBOLIC_LANGUAGE_INTAKE.md` was the assigned prior art and its use is disclosed. `LEGACY_ALIGNMENT_MAP.md` and other arms were not read.
- **Evidence labels:** `repeat` contradiction and the `ceil` behaviour are **TESTED**. The three-operation vocabulary is **PROPOSED**. Cross-file capability and canvas parity are **NOT_RUN**.

---

**Status: RUN EXECUTED, NOT A PRODUCT RESULT.** This note is evidence from one arm on one 32-line file. It is not a ratified protocol, and the Round 1 reviewer must not treat the three operations above as approved canon.