# RUN NOTE — Arm B — Semantic Compiler and Human/Machine Boundary

> Round 0, independent arm. Executed 2026-10-12. This run read
> [`SYMBOLIC_LANGUAGE_INTAKE.md`](../../SYMBOLIC_LANGUAGE_INTAKE.md) as embedded
> in its assembled prompt. Per that document's **DISCLOSURE RULE**, any result
> touched by it is **LEGACY-SEEDED REUSE**. Concretely: the *symbol* research
> informed nothing here — this run compiled the pinned TypeScript fixture
> directly. No result below is a blind discovery *about symbols*; the compiler
> and boundary findings are **blind discoveries**. No blind discovery of legacy
> content is claimed, and none was reconstructed.

```text
RUN ID: B
Run date and pinned repo commit: 2026-10-12, commit 1199b38c1fd174e997c92b22d18d8c20c952eb9e
Agent/model and context restrictions: opencode / claude-sonnet-4-5 (GLM-class free
  harness agent) in a single isolated session. Read-only on the repo; all output in
  runs/B-2026-10-12-compiler-boundary/. No branch, no commit, no merge, no external
  effect, no network. Did not read other arms' prompts or results.

QUESTION / HYPOTHESIS:
  Can a version-pinned semantic fact be published ONCE and rendered into TWO mutually
  source-linked projections (machine + human), with a deliberate source mutation making
  stale meaning visible — and does that require a real frontend/backend split?

WHAT I ACTUALLY DID:
  Built one dependency-free TypeScript/JS program (sempub.mjs, ~230 lines) that does
  static intake -> one immutable digested publication -> two projections, plus a verifier.
  Ran six phases against the pinned fixture. Actually executed the fixture to obtain
  behavioural witnesses. Mutated the source and hand-drifted a projection as negative
  controls. Caught two real bugs in my own tool mid-run (see WHAT SURPRISED).

WORKING ARTIFACT OR CODE LINK:
  elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/runs/B-2026-10-12-compiler-boundary/
  (sempub.mjs, run-b-experiment.mjs, human.md, machine.json, machine-human-signal.json,
  RECEIPT.txt, SHA256SUMS.txt, README.md). UNTRACKED, UNCOMMITTED — main not modified.

TEST EVIDENCE: TESTED + OBSERVED. Exact witnesses in RECEIPT.txt.
  - P2 verify on pristine source: 9/9 checks PASS, both pre-witness and post-witness.
  - P3 execution: repeat(3)->[0,1,2]; repeat(-1)->[]; repeat(2.5)->[0,1,2]; none threw.
  - P4 mutation MAX_RETRIES 3->5: file sha mismatched; stale facts = ["const.MAX_RETRIES"]
    only; fn.add/fn.repeat/fn.classify/fn.accumulate unaffected. Digest changed
    571ac017d0a9... -> b8c42993004a...
  - P5 negative control: hand-drift flipping enforces_declared_precondition false->true
    in human.md only was NOT caught by the digest check. FORGED digest WAS caught.
  - P5b: regenerate-and-compare caught the hand drift at char 2957.

MACHINE <-> HUMAN SIGNAL (Decision 3):
  source/task: fixture/001-semantic-basics.ts (sha256 fe0c651e...386d5) @ 1199b38; task =
    publish one pinned meaning and project it twice.
  machine meaning: publication pub_571ac017d0a9e864, digest 571ac017d0a9e864...; 5 facts;
    evidence mix 1 DECLARED (fn.repeat) + 4 DERIVED, later 4 OBSERVED with witnesses.
  human reading: the author wrote "count is a nonnegative safe integer. Not enforced."
    above repeat(); running it, -1 and 2.5 are accepted silently and 2.5 emits three
    values. The comment states an intention, not a guarantee.
  comparison: OBSERVED_DISCREPANCY. The DECLARED precondition is contradicted by
    OBSERVED behaviour. Both projections agree on identity, signature, source lines
    and digest.
  evidence status: first-party execution. NOT independent referee proof; NOT a general
    correctness claim.
  next test: independent second implementation of intake, same pinned source, compare
    the derived DECLARED set.

WHAT SURPRISED OR FAILED:
  1. NEGATIVE RESULT (the valuable one): digest binding is NECESSARY BUT NOT SUFFICIENT
     for projection fidelity. A view can be falsified by hand while still carrying the
     correct publication digest; the digest attests WHICH publication a view claims,
     not that the view still faithfully renders it. Only a forged digest was caught.
     Re-render-and-compare closed the hole at trivial cost.
  2. My canonical form silently dropped the structural `kind` field, so the human view
     rendered every function as "an exported constant named `repeat`, type `undefined`,
     value `undefined`" — confidently wrong, and invisible to the digest because the
     digest covered the lossy form. Structural fields must survive canonicalization.
  3. My first drift experiment was a NO-OP: the anchor string matched 0 occurrences
     because witnesses render as pretty-printed JSON, so I nearly reported a false
     negative as a discovery. Now guarded by an assertion that refuses to report it.
  4. Static compilation alone CANNOT produce an accurate human view of this fixture:
     the only material fact (is the contract enforced?) is invisible without execution.
     The backend needs a witness channel, not just a parser.

RELEVANT EXPECTED BEHAVIOR(S): E03 (accurate wiki), E05 (detect staleness/contradiction),
  E06 (preserve meaning across projections), E08 (know what is available vs merely
  declared). E03/E06 PARTIALLY met; E05 MET for source mutation, FAILED for hand drift
  until regeneration was added.

PROTOCOL / SDK / ELEPHANT CANDIDATE (all PROPOSED, none ratified):
  - A publication is the ONLY front/back boundary; projections are pure functions of it.
    No formal frontend/backend service split is justified by any constraint observed here.
  - Every fact carries an evidence class (DECLARED/DERIVED/OBSERVED) that is part of the
    canonical digest, so both views inherit the same honesty.
  - Per-fact source slices, not whole-file hashing, for staleness. Locality preserved:
    1 mutation -> exactly 1 stale fact out of 5.
  - Projection verification = deterministic re-render + byte compare. A digest grep is
    a necessary smoke check, not a fidelity check.
  - Canonicalization must be total: any field a projection reads must be inside the digest.

OTHER PLAUSIBLE APPROACH (worth retaining):
  - A2, separate compiler service + renderer over an immutable publication.json, kept as
    the arrangement to test once trust boundaries or concurrency actually matter. It buys
    isolation this fixture never needed and costs a serialization boundary.
  - A3, pure interpret-to-IR with no stored artifact, retained as the replay model: the
    compile step is pure, so a fresh process reproduces byte-identical projections.

SMALLEST NEXT FALSIFYING TEST:
  Mutate the BODY of repeat (not a constant literal) and assert the verifier localises
  staleness to fn.repeat alone. That tests the line-slicing logic on the case the current
  mutation did NOT cover, and it is ~5 lines against the existing harness.

UNKNOWN OR BLOCKED:
  - Whether two independent intake implementations derive the same DECLARED set. UNKNOWN.
  - Multi-file, cross-file relationship staleness. UNKNOWN, untested.
  - Whether the 17-family symbolic lexer is a better intake. NOT TESTED; out of Arm B scope.
  - Real-code cohort (Decision 1): NOT RUN. Only the controlled fixture was used. The
    private 191-file bundle was not supplied, so REAL_SOURCE_UNAVAILABLE for this run.
  - Decision 2 comparison: existing automation was NOT replayed. I built a ~230-line
    program without first testing whether the Phase 0 Python runner already did this.
    That is a real process failure — D2 says discover -> select -> replay -> reuse. My
    reuse discipline was weak here and the reviewer should weigh this result accordingly.
  - Cost/telemetry (time, tokens) NOT measured; the loop ran in one pass.

SELF-CERTIFICATION / AUTHORITY:
  Nothing here is self-certified. No canon change is proposed as ratified. No external
  effect occurred or was authorized. Publication and projections are artifacts; the
  correctness of the compiler itself rests on 9 in-process checks, not an independent referee.
```

## Verdict on the brief's central question

The brief explicitly permits concluding that no formal frontend/backend split is
needed yet. **The experiment supports that conclusion at fixture scale** — but
with one honest qualifier: the backend boundary that *is* load-bearing is not a
service boundary, it is the **witness channel**. Static parsing cannot tell you
whether `repeat` enforces its declared contract; only executing it can. So the
minimum viable "backend" is intake **plus** a way to obtain behavioural evidence,
not a separate networked compiler.

Second qualifier, and the one the reviewer should press on: I did not follow
Decision 2's reuse discipline. I built before replaying the existing Phase 0
toolkit, so this run cannot claim the design beats the existing control. That is
a real gap in the evidence, stated rather than papered over.

## Honesty ledger

| Claim | Label |
|---|---|
| 9/9 verifier checks pass on pristine source | TESTED (this process) |
| `repeat(2.5)` emits `[0,1,2]` | OBSERVED (this process ran it) |
| Mutation localises to exactly 1 of 5 facts | TESTED (this process) |
| Digest check misses hand drift | TESTED negative result |
| Re-render catches hand drift | TESTED (char 2957) |
| Compiler is correct in general | UNKNOWN — not tested, one fixture |
| This beats the existing Phase 0 toolkit | UNKNOWN — control never replayed |
| Any canon change is warranted | PROPOSED only, needs review |