# RUN NOTE — Elephant Protocol Gym, Run A

```text
RUN ID: A
Run date and pinned repo commit:
  2026-10-12 · VOMEGA 1199b38c1fd174e997c92b22d18d8c20c952eb9e (main, origin/main)
  Fixture: elephant-protocol-gym/fixture/001-semantic-basics.ts
  sha256 fe0c651e51936074346c7dcabfef52785783e5a3d87f110c8365952b40a386d5 (1001 bytes)

Agent/model and context restrictions:
  ZCode agent, run inside the single assembled Arm A slice
  (built/FULL_DRY_RUN_PROMPT_A.md, 83,222 bytes, 11 sections).
  Restriction: I held ONLY the Arm A slice. Arms B/C/D were not in context.
  Contamination disclosure: before this run, while auditing that assembler's
  audience gating, I ran whole-line greps across RUN_B/C/D to prove no arm text
  leaked into the Arm A build. That returned only the three shared boilerplate
  preamble lines ("Mandatory common canon", "Independent exploration…", "Start
  prompt…"), which also appear in RUN_A itself. I did not read any other arm's
  task text, and the leakage audit found none. LEGACY-SEEDED REUSE: none —
  I did not open LEGACY_ALIGNMENT_MAP.md, protocol-backbone/*, or the timed
  five-Gym pack. All results below are BLIND DISCOVERIES.

QUESTION / HYPOTHESIS:
  What is the smallest credible path from one conventional source file to a
  truthful, self-describing file?
  Hypothesis under test: the machine-readable layer (types, AST, declarations) is
  the natural carrier of a file's meaning, and adding meaning there is cheap.
  Prediction: a description derived from the type surface should detect a
  body-only semantic mutation.

WHAT I ACTUALLY DID:
  Built a disposable workspace under runs/A-2026-10-12/ and ran five executable
  experiments against a copy of the pinned fixture.
  1. extract-facts.mjs — mechanical fact extraction via the TypeScript
     compiler API typeChecker, deliberately separating CODE_DERIVED facts from
     AUTHOR_ASSERTION comments.
  2. exp1 — 11 input classes against repeat(), each in an isolated child process
     with a 4000 ms hard bound.
  3. exp2 — mutated add() from + to *, then re-derived the description through a
     type channel (.d.ts emit) and an execution channel, and compared.
  4. exp3 — placed the identical claim "Returns the sum of a and b" in three
     placements (plain control / doc comment / digest-bound sidecar) and asked
     which can signal its own staleness after the mutation.
  5. exp4 — tested whether classify()'s declared return union is exhaustive.
  6. exp5 — tested whether repeat() fails atomically when emit throws.
  Wrote SATURATION_DESCRIPTION.md (evidence-classed description) and
  MACHINE_HUMAN_SIGNAL.md (Decision 3 receipt).
  I did NOT read, edit, or execute anything in the shared seed, main, or the
  other arms' prompts.

WORKING ARTIFACT OR CODE LINK (or NONE):
  elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/runs/A-2026-10-12/
    extract-facts.mjs            SATURATION_DESCRIPTION.md
    exp1-precondition.mjs  exp1-results.json     MACHINE_HUMAN_SIGNAL.md
    exp2-mutation.mjs       exp2-results.json     RUN_NOTE.md
    exp3-placement.mjs      exp3-results.json     sidecar.baseline.sem.json
    exp4-classify.mjs       exp4-results.json     sidecar.mutated.sem.json
    exp5-partial-effect.mjs exp5-results.json     facts-baseline.json
  Reproduce: node extract-facts.mjs baseline.ts ; node exp1-precondition.mjs ;
  node exp2-mutation.mjs ; node exp3-placement.mjs ; node exp4-classify.mjs ;
  node exp5-partial-effect.mjs   (each prints JSON and/or sidecar files)

TEST EVIDENCE: TESTED / OBSERVED — exact witness:
  OBSERVED — exp2-results.json. Mutation `return a + b;` → `return a * b;`.
    Emitted .d.ts is BYTE-IDENTICAL before and after:
      add(a: number, b: number): number  (unchanged)
    Executed add(i,10) for i=0..4:
      before [10,11,12,13,14]   after [0,10,20,30,40]
    Both versions typecheck clean under --strict.
    => The type layer did NOT detect the mutation. Hypothesis REJECTED.
  OBSERVED — exp1-results.json. 7 of 11 inputs violate repeat()'s stated
    precondition; ZERO produced a diagnostic. -1 → 0 emissions, returns
    normally. 2.7 → 3 emissions (ceil behaviour). 0.4 → 1 emission. NaN → 0.
    2^53 and Infinity → did not return.
    Separately: 1e9 SATISFIES the contract and still did not return in 4000 ms,
    so the two failure modes are not the same set: 5 of the 7 violations
    returned normally, 2 never returned, and the largest legal input is a
    third, distinct way this function misbehaves.
    (Figure corrected from "6 of 11" after verify-run-note.mjs re-derived 7;
     the original count was my own arithmetic error, caught by the sweep.)
  OBSERVED — exp5-results.json. repeat() is NOT ATOMIC: a callback throwing at
    value 1, 2 or 99 leaves 1, 2 and 99 values already delivered. Partial effect,
    no rollback. Nothing in the file declares this.
  OBSERVED — exp4-results.json. classify(NaN) returns "positive" — inside the
    declared union, semantically false. Type-conformance checking passes it.
  TESTED — exp3-results.json. Same claim in three placements:
    plain control : detects mutation NO, detects unenforced precondition NO
    doc comment   : detects mutation NO, detects unenforced precondition YES
    digest sidecar: detects mutation YES, detects unenforced precondition NO
  NOT_RUN: any real-source cohort. NOT_RUN: any human comprehension test.

MACHINE ↔ HUMAN SIGNAL:
  See MACHINE_HUMAN_SIGNAL.md. Two signals, deliberately not merged.
  Signal 1 (source prose vs witnessed behaviour) — OBSERVED_DISCREPANCY,
    independently witnessed, no human participant needed: the file asserts a
    nonnegative-integer precondition; execution shows it is never enforced and
    never signalled. Witness exp1-results.json.
  Signal 2 (machine meaning vs human comprehension) — UNKNOWN. The machine-side
    fact (classify(NaN) === "positive") is OBSERVED, but the human side does not
    exist: my own expectation is not an independent human judgment, and I decline
    to score my own prose as one. Witness exp4-results.json.
  Next test for Signal 2: hand this file to one reader who has not seen the note
    and ask them to predict classify(NaN) before executing it.

WHAT SURPRISED OR FAILED:
  The disconfirming observation is exp2, and it is the core result: the entire
  machine-readable surface of the file is invariant under a change that inverts
  its arithmetic. This is not a subtle limitation — it is the design of every
  type system. E05 in 09_EXPECTED_BEHAVIORS.md asks for exactly this
  demonstration ("change an add operation into multiplication and keep the old
  description"). Run at fixture scale, the type channel answers no.
  Three things surprised me by failing, all recorded rather than hidden:
  1. MY OWN EXTRACTOR LIED FIRST. v1 read export status off symbol flags and
     reported all four plainly-exported functions as private. That is exactly
     E01's stated failure mode — "a guessed structural fact presented as
     compiler-verified" — committed by the measuring instrument. Fixed to read
     the statement modifier; re-run clean.
  2. exp1 v1 attributed a "RangeError: Invalid array length" to repeat() at
     count=2^53. It was my own array collector overflowing. v2 removed the
     RangeError and then hung forever, implying non-termination without ever
     witnessing it. v3 runs each case in a bounded child process, so
     "did not return" is now a witnessed fact rather than an inference.
  3. exp3 v1 compared a doc comment that did not exist (only repeat() is
     documented in the shipped fixture) and reported null === null as
     "comment unchanged" — a vacuous true. v2 authors the claim explicitly and
     asserts it was found before trusting the comparison.
  All three are the same error the fixture is built to expose: mistaking the
  instrument's behaviour for a fact about the source. I hit it three times.

RELEVANT EXPECTED BEHAVIOR(S): E01..E10 (or proposed new)
  E05 — Detect change and contradictions. DEMONSTRATED_IN_FIXTURE, NEGATIVE
    RESULT. The canonical E05 demonstration is exactly exp2, and the type
    channel fails it. Not a regression — E05 is unverified generally; this is
    the first fixture-scale negative datum.
  E01 — Understand its source. DEMONSTRATED_IN_FIXTURE, with a self-caught
    failure (see WHAT SURPRISED). Structural extraction works; the discipline of
    labelling it CODE_DERIVED is the part that mattered, because my first
    version got it wrong.
  E06 — Translate meaning between representations. NOT_RUN, but exp3 is a first
    fixture-scale comparison of three representations of one claim, and it shows
    each loses a different thing.
  E02, E03, E04, E07, E08, E09, E10 — NOT addressed.
  PROPOSED NEW, not numbered: a source file's "meaning completeness" is not a
    property of its type layer. Candidate label: TYPE_LAYER_BEHAVIOUR_BLINDNESS
    — a file can be fully described by its declarations and still have every
    behavioural claim about it unverified. I propose this as a candidate
    evidence class, not as canon.

PROTOCOL / SDK / ELEPHANT CANDIDATE:
  PROPOSED, no syntax invented, no authority granted, nothing ratified.
  Candidate 1 — a WITNESS LINK, not a new annotation language. Each behavioural
    claim carries (source digest, probe id, probe result, timestamp). The value
    is not the prose; it is that the claim can be re-executed and shown stale.
    EXP3 shows a digest alone is not enough: binding proves WHICH source a claim
    was written against, never whether it is true of that source. Digest plus
    executed probe is the smallest pair that survives exp1, exp2 and exp4.
  Candidate 2 — an EVIDENCE-CLASSED CLAIM RECORD. My SATURATION_DESCRIPTION.md
    works, and works because every line carries one of five labels
    (CODE_DERIVED / OBSERVED / AUTHOR_ASSERTION / INFERENCE / UNKNOWN). That
    labelling is what let me delete nothing and re-derive sections independently,
    and it is what let me catch my own three false facts. Candidate for an SDK
    self-description record — as data, not as a wiki sentence.
  Candidate 3 — an EFFECT-ATOMICITY CHECK as a standing property, prompted by
    exp5. The Gym's non-negotiable boundary protects external effects; a
    callback-driven API that can deliver a partial effect before failing is
    exactly the shape that boundary should catch. This is a checkable property
    (does a throwing callee leave observable partial state?) and belongs in the
    toolkit regardless of which semantic architecture wins.
  REJECTED: any claim that a type-level or AST-level description can serve as a
    file's self-description. exp2 and exp4 refute it on this fixture.

OTHER PLAUSIBLE APPROACH:
  Approach P2 (tested, exp3) — digest-bound sidecar metadata. Detects staleness
    after any edit, cheaply and without execution. Cost: a second artifact with
    its own drift and lifecycle, and it still cannot tell whether a claim is true.
  Approach P1 (tested, exp3) — meaning authored as doc comments. Zero new
    infrastructure, and it is the only placement that carried a human being's
    honest warning ("Not enforced"). Cost: a comment is carried by the very edit
    that falsifies it and cannot signal its own staleness; after exp2 the file
    still says "Returns the sum of a and b" while returning a product.
  P0 plain-source control: never wrong, never right. Required by the seed; it is
    the baseline both of the above must beat, and on truthfulness-at-zero-cost
    neither currently does.
  A third way I did not test and would not claim: inferring behaviour statically
    (symbolic execution). exp1 and exp5 suggest it would find the ceiling
    behaviour and the missing atomicity, but that is PROPOSED, not evidenced.

SMALLEST NEXT FALSIFYING TEST:
  Re-run exp2 with exactly one change — a source digest pinned into the comment
  itself — and check whether a digest inside P1 makes the comment placement
  detect staleness. If it does, P1 and P2 collapse into one approach and the
  "witness link" candidate gets cheaper. If it does not, the comment placement is
  strictly worse than the sidecar and should be deprecated for machine claims.
  This is a two-file, ten-minute experiment that discriminates between my two
  surviving candidates, which is the point of running it.

UNKNOWN OR BLOCKED:
  UNKNOWN — no real-source cohort. REAL_SOURCE_UNAVAILABLE: I ran the controlled
    fixture only. I did not verify the private 191-file bundle and did not select
    a repo-available real cohort. Every result is fixture-scale and must not be
    read as a real-code result (D1).
  UNKNOWN — human comprehension. No human participant; Signal 2 is UNKNOWN.
  UNKNOWN — whether 1e9 would return given unbounded time. I bounded at 4000 ms
    and report non-return within that bound, not eternal non-termination.
  UNKNOWN — generalization. One fixture, one mutation, one language. Every
    finding here is DEMONSTRATED_IN_FIXTURE at best.
  NOT REPLAYED — D2 automation. I used the TypeScript compiler API 6.0.3 (from
    the npx cache) and plain node execution. I did NOT replay the Python Live
    Lab / Experiment Runner / Change Lab, so I have no baseline comparison
    against them and cannot claim mine is better — only that it answered the
    immediate question with no server, no browser and no persistent state.
  INFERRED, NOT READ — the U0-U5 graduation stage. UNIVERSAL_SEMANTIC_GOVERNANCE.md
    was not in the Arm A slice and I did not open it. My judgment is that the
    fixture sits at U0 (ordinary source, not enrolled in any command interface),
    but that is inference from the seed's brief description, not a reading.
  NOT CLAIMED — fine-tuning, self-certification, live session, or any capability
    of the SDK. This run conditioned protocol and tooling only.
```

---

## Reviewer flags

- **Independent of the other arms:** yes, with one disclosed exception in the header
  (a leakage-audit grep before the run, which returned no arm content).
- **Blind discovery:** yes. `LEGACY_ALIGNMENT_MAP.md` was not opened. If a reviewer finds
  any result here that matches a historical solution, that is a coincidence worth noting.
- **Self-certification:** none claimed. Signal 2 is left `UNKNOWN` rather than scored
  against my own expectation.
- **Would I trust this run's own instruments?** No — I caught three of them failing, and
  each correction is in the note rather than quietly patched.