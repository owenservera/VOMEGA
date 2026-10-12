# ROUND 1 REVIEWER — Synthesis and Adjudication of the Four-Arm Dry Run

**Status: REVIEW EXECUTED. No canon ratified. No arm result promoted.**

**Reviewer role executed:** the `REVIEWER` slice of `built/FULL_DRY_RUN_PROMPT_REVIEWER.md`,
which was `PREPARED, NOT RUN` until this document. Per `REVIEW.md` the reviewer *compares
notes; it does not re-run an arm*, so this document adjudicates the four arms' evidence and
adds one independent referee pass of its own — clearly separated in §2 — that no arm authored.

**Date:** 2026-10-12 · **Repo commit reviewed:** `1199b38c1fd174e997c92b22d18d8c20c952eb9e`
(`origin/main` at review time) · **Fixture:** `fe0c651e…a386d5`, 1001 bytes, byte-identical
across A, B, C and the reviewer.

---

## 1. What was reviewed

| Arm | Run note | sha256 (16) | Independence label |
|---|---|---|---|
| A — Source first, meaning second | `runs/A-2026-10-12/RUN_NOTE.md` | `de55cb9e4f8b4f29` | blind discovery |
| B — Semantic compiler / human-machine boundary | `runs/B-2026-10-12-compiler-boundary/RUN-NOTE.md` | `2cf943dcf3fb98d2` | blind discovery on the compiler; **LEGACY-SEEDED** on symbols (self-disclosed) |
| C — WikiCore verbs and self-runtime | `runs/C-2026-10-12/RUN_NOTE.md` | `a5fe5cc35bc436ce` | blind discovery (assignment prior art disclosed) |
| D — Self-optimization / automation toolkit | `runs/D-2026-10-12-elephant-toolkit/RUN-NOTE.md` | `006c90466f84bc3a` | **independence violation, self-disclosed** — see §5.4 |

All four ran against the same pinned fixture from the same seed. Independence held well
enough to be useful and was honestly reported where it did not break: **all three
independent arms (A, B, C) explicitly declined to read each other's results**, C states it
saw A's directory on disk and did not open it, and D discloses an accidental `head -60` of
B's run note. That is the behaviour this corpus was built to elicit, and it is worth saying
so plainly: the honesty rate was high.

**Not a four-arm study in the statistical sense.** D's four cold readers are four contexts
of **one model family**, D says so itself, and no arm ran against real repo source. Treat
Round 0 as *four honest qualitative probes*, not a measurement.

---

## 2. The reviewer's own referee pass

Every claim below — mine included — otherwise rests on arms trusting themselves and each
other. The reviewer's standing is only different if it re-derives something. So it did — with
fresh code, in `runs/REVIEWER-R1-2026-10-12/`, importing nothing from any arm:

| Artifact | What it does | Result |
|---|---|---|
| `reviewer-witness.mjs` | 6 executable predicates (W1, W3, W4, W5, W6, W7) re-deriving the claims A, B and C all reported, from source and execution rather than from any arm's JSON | `--check` → **PASS (6/6)**, stable over 5 consecutive runs |
| `negative-control.mjs` | Mutates the corpus to *invert* each property and confirms the predicates flip | **PASS — 3/3 discriminating mutants flip** |
| `dts-mutation-check.mjs` | Runs the real TypeScript compiler on `add` + body-mutated and signature-mutated variants and byte-compares the emitted `.d.ts` | **W7 VERIFIED**, control OK |

### 2.1 What the reviewer independently confirms

| # | Claim | Origin | Reviewer verdict |
|---|---|---|---|
| W1 | `repeat`'s declared precondition is unenforced **and silent**: `-1`→0, `NaN`→0, `2.5`→3, `0.5`→1, `3.7`→4 emissions, none throwing | A, B, C, D | **CONFIRMED** |
| W3 | `classify(NaN) === "positive"` — inside the declared union, outside common sense | A | **CONFIRMED** |
| W4 | `MAX_RETRIES` has the file's most rigid type (literal `3`) and is referenced nowhere | A, C | **CONFIRMED** (1 textual occurrence: its own declaration) |
| W5 | `repeat` is not atomic — a throwing callback leaves delivered values with no rollback | A exp5 | **CONFIRMED**, with a correction below |
| W7 | Mutating `add`'s body `a + b`→`a * b` leaves the emitted `.d.ts` **byte-identical** (`4e64755a…`), while mutating the signature changes it (`6706fe52…`) | A exp2 | **CONFIRMED** — now by compiler invocation, with a working negative control |

### 2.2 Where the reviewer's own first answer was wrong

This is recorded because it is the corpus's central lesson, and because the reviewer's
instruments reproduced the very failure it was reviewing.

- **W5 was wrong about its own probe.** The original predicate asserted `partialAt(1)`
  delivers 1 value; the callback pushes *and then* throws, so it delivers 2. The predicate
  was measuring the probe, not `repeat`. Corrected, and re-derived from the source.
- **W6 was wrong twice about `1e9`.** First call: "non-terminating". False — it returns in
  ~3.2 s. Second attempt: bound it with `Promise.race` + `AbortController`. Also false — a
  synchronous loop starves the event loop, so the abort callback can never fire; the
  instrument measured its own 200M guard counter. Third attempt, process-level hard bound:
  sound, and it exposed something the arms got wrong — see §3.
- **W6 was then wrong a third time, in the reviewer's own fix — and this is the most
  instructive failure in this document.** The corrected version gated W6 on a *timing slope*
  (`t(1e8)/t(1e7)` within 8–12). Calibrated on an idle machine it read 10.3 and passed. Under
  load, three consecutive runs read **12.6, 15.1 and 13.5** and failed — because the 1e7
  sample is short enough (30–90 ms) to be dominated by scheduler noise while the 1e8 sample
  is long enough to absorb it. The slope was not measuring the source.
  **This is the identical error as §2.3, committed by the reviewer who wrote §2.3.** The fix:
  predicates now assert only *deterministic* properties (exact emission counts; the two hard
  bounds, which are robust because the true costs are ~8 hours and infinite, not minutes).
  Timing is **reported, not gated**. Verified stable across five consecutive runs.

**The general rule this yields — and the reviewer's most transferable finding:** *a predicate
that gates on wall-clock must be calibrated against a stated, re-verified envelope; anything
short of that is descriptive.* Three arms hit this class of error from the parser side; the
reviewer hit it from the timing side. It is one failure, not five.

### 2.3 The reviewer's one substantive correction to an arm

**Arm A exp1 recorded `repeat(1e9)` as "did not return" within a 4000 ms bound. That is a
threshold artefact, not a source fact.**

Reviewer measurement on this machine, same fixture, same Node v24.11.1:

| `count` | emissions | wall time |
|---|---|---|
| 1e7 | 10,000,000 | **31.3 ms** |
| 1e8 | 100,000,000 | **320.5 ms** |
| 1e9 | 1,000,000,000 | **3189.0 ms** ← *returns, 711 ms inside the bound* |
| 2e9 | 2,000,000,000 | **6884.3 ms** |

`1e9` **satisfies the author's declared contract** and still misses a 4-second budget by
under a second. Whether it "returns" is therefore a fact about the machine's load at that
moment, not about the code. The defensible claim is the *shape*: emission count equals the
integer count exactly, cost is linear at **~3.2 ns per emission**, and **no value of count
is ever refused** — `2^53` would cost ~8 hours and `Infinity` never returns. Arm A's own
framing ("the contract is necessary and not sufficient") survives and is in fact
strengthened; only its threshold framing does not.

**This does not diminish Arm A.** A got the direction right and its honesty rules said so
(`UNKNOWN`: "I bound the probe at 4000 ms and report non-return within that bound, not
eternal non-termination"). Arm A labelled the bound correctly and a reviewer still had to
measure it to catch it. That is precisely the E08 problem in miniature, and it is why the
witness predicates are executable rather than prose.

---

## 3. The convergence, stated as one claim — and its exact limit

All four arms, working from one identical 32-line file, independently found:

1. a declared contract that no channel enforces;
2. that fractional inputs are silently answered as `ceil(n)` rather than rejected;
3. that the type layer is blind to behaviour;
4. that the failure mode is **silence** — no diagnostic in any violating case.

A, B and C reached this through unrelated instruments (TypeChecker facts + execution; a
digest-bound publication pipeline; a three-vocabulary comparison), and D's four cold readers
found it 4/4 **with and without** an evidence capsule. Reviewer-witnessed. This is the
strongest result Round 0 produced, and it is a result about **instruments, not about agents**:
given ordinary read/execute tools, they converge without having been told to.

**The limit, stated because it is easy to overclaim:** convergence on a 32-line file with
**one known planted defect and a header comment that literally says "Intentional research
note"** is weak evidence of general competence. D says it plainly: "all four traps were found by
every trial. The corpus saturated." A, working the same saturation from the other direction,
titles its artifact *Saturation Description* and lists what to delete next — but A has not
yet run that subtraction. Both agree the fixture has told us what it was built to tell us and
no more. **Nothing here estimates recall on real source.** Every arm said so; this review
endorses that.

---

## 4. Divergence — the observed differences, per `REVIEW.md` instruction 2

Shared phrasing is ignored. These are the places the arms genuinely disagreed or covered
different ground.

| Contrast | A | B | C | D | Reviewer's reading |
|---|---|---|---|---|---|
| **What the round is for** | saturate a description, then subtract | publish one meaning into two projections | choose a *vocabulary* of operations | choose a *handoff payload* | A/B are compile-side, C is interface-side, D is evidence-side. Not competing; **composable** |
| **The load-bearing object** | the `.d.ts` (and its uselessness) | the immutable publication + digest | the predicate `enforced` | the oracle | each arm found the thing its own lens makes load-bearing |
| **Strongest negative result** | type surface unchanged by body mutation | digest binding is **necessary but not sufficient** for projection fidelity | own parser silently reported "no contradiction" | capsule did **not** help; laundering detector **falsely accused** correct agents | all four are the *same* lesson in different clothing: **an instrument's failure looks exactly like a clean result** |
| **Cost telemetry** | none | none | none, refused to estimate | tokens measured; probe counts are self-reports, n=2 | **UNKNOWN** for the round. D's baseline spread (15k–42k) exceeds the between-arm gap |
| **Real-source cohort** | not attempted | not attempted | not attempted | not attempted | **REAL_SOURCE_UNAVAILABLE, unanimously.** Decision 1 was not exercised by anyone |
| **Prior-art reuse** | none | symbols (disclosed) | symbol intake as assigned prior art (disclosed) | none | two arms are seeded-reuse on symbols only; **no arm claims legacy-seeded reuse of the compiler result** |

**One disagreement the reviewer sides against Arm D.** D counts `oracle.mjs` as measurement
apparatus, not a booster, so its run built "one" booster. The reviewer agrees the *count* is
a judgement call and notes that D raised it unprompted, which is the right instinct. The
reviewer's further note: an oracle that derives ground truth by executing the source is the
single most valuable artifact D produced, and it is the one artifact D is least likely to
carry forward, because it is not a "booster" and Arm D optimises for boosters.

---

## 5. Honest weaknesses found by the reviewer

### 5.1 The whole round ran on one toy file
Every arm used the same 32-line fixture. Not one used a real repo cohort. `LEGACY_ALIGNMENT_MAP`
criterion 1 warns that MP-21 reads **Git objects at a pinned revision, not the working tree** —
and since nothing here used real source, that trap was never approached, let alone hit.

### 5.2 Decision 2 (automation reuse) failed as a process in one arm and was untested in three
- **B discloses a real process failure**, and deserves credit for saying so: it built a
  ~230-line program without first replaying the Phase 0 runner, which is exactly the
  discover → select → replay → reuse order Decision 2 mandates. B asks the reviewer to weigh
  its result accordingly. **The reviewer does.**
- **D did not invoke the Phase 0 / Live / Experiment / Change toolkits** and correctly labels
  this an *unused opportunity* rather than a finding.
- **A and C reused stock tooling** (`tsc`, `rg`, `node`, `git`) but did not compare against
  an existing in-repo instrument.

So: **no arm established that a new instrument beats an existing control.** Decision 2 is
**PARTIAL at best** across the round.

### 5.3 Cost and time are UNKNOWN for three arms and uninformative for the fourth
`REVIEW.md` instruction 4 requires time/token comparison where observed and UNKNOWN otherwise.
Round 0 produces **UNKNOWN**, with D's n=2 token figures descriptive only. No claim about
efficiency is available.

### 5.4 Arm D's independence violation — assessed
D read the first 60 lines of B's run note before authoring its own source file, and disclosed
it prominently rather than burying it. The reviewer accepts the assessment: the exposure was
to B's *results on the fixture*, D's three extra traps live in a file no other arm had, and
the four cold readers received none of it — **so the sealed trials stand**. What carries the
caveat is D's own choice and placement of traps. Recorded, not disqualifying.

### 5.5 Every arm's central evidence is self-asserted
`executed: true` in an artifact proves nothing about what any agent did. D names this as the
run's central limitation and cannot fix it within its design. **The reviewer cannot fix it
either** — which is why §2 exists, and why the status vocabulary in §9 is the highest-value
carry-forward from Round 0.

---

## 6. Expected-behaviour coverage (E01–E10)

Labels follow `09_EXPECTED_BEHAVIORS.md`. "Demonstrated" means an executable witness exists
in the run, not that the behaviour is generally achieved.

| ID | Behaviour | Round-0 status | Evidence |
|---|---|---|---|
| E01 | Understand its source | **DEMONSTRATED (narrow, unevenly)** | A and B enumerated the same 5 exports with correct signatures; C's published evidence answers the symbol question for **`repeat` only** (one query, not an inventory); D's 4 readers enumerated **9/9** across two files with correct digests 4/4 |
| E02 | Describe itself | **PARTIAL** | C's three operations explain capabilities and limits; no arm described itself to a *user* |
| E03 | Generate its own Wiki | **PARTIAL** | B's `human.md` projection, 9/9 checks; falsified in fidelity (see E05) |
| E04 | Navigate its knowledge | **NOT_RUN** | C's cross-file analysis is not implemented. Within-file edges *are* detected (`accumulate → add`, with a working positive control); `RELATE(repeat)` returns no edges because `repeat` genuinely has none — a verified *true* negative, not a silent parser failure. D competency #2 (retrieving dependencies) explicitly NOT PROBED |
| E05 | Detect change and contradictions | **DEMONSTRATED, then BOUNDED** | the round's best result — and A's exp2 shows the *type* channel fails it outright; D's booster catches semantic staleness |
| E06 | Translate meaning across representations | **PARTIAL** | B: two projections agree on identity/signature/digest; disagreement not tested across languages |
| E07 | Interpret human intent | **NOT_RUN** | no arm addressed it; Arm C's brief warned against a 12-verb catalogue |
| E08 | Know its operational state | **DEMONSTRATED THE HARD WAY** | three independent silent tooling failures (C's regex, C's inverted `typeEnforced`, D's laundering detector) all pointed toward a clean bill of health |
| E09 | Improve its representations | **NOT_RUN** | no arm iterated on its own output; A proposes a subtraction pass it did not perform |
| E10 | Transfer knowledge between Elephants | **PARTIAL, and honestly empty** | D transferred a capsule between agents — but both readers re-derived everything anyway; **no knowledge was actually carried** |

**E08 is the round's real find.** Three separate arms independently discovered that a broken
instrument reports success. That is a capability class the corpus does not yet name.

---

## 7. Legacy coverage map (L01–L10)

Per `LEGACY_ALIGNMENT_MAP` "After each round": `COVERED_WITH_EVIDENCE / PARTIAL / UNOBSERVED /
CONTRADICTED / REJECTED_WITH_EVIDENCE / NOT_APPLICABLE`. Coverage is not a percentage and
does not mean shipping.

| ID | Round-0 status | Basis |
|---|---|---|
| L01 Reflection Migrator (source inventory, anchored facts) | **COVERED_WITH_EVIDENCE (by a new route)** | all four arms produced source-pinned, checkable, human-readable facts. **Note:** achieved without MP-21; A/B/C each rebuilt a minimal extractor. Per the map's own guidance, *"a new architecture that achieves the same outcome through a different mechanism qualifies"* |
| L02 Pure TS NLCL (command interpretation, ambiguity) | **UNOBSERVED** | no arm interpreted natural-language input. The fixture is code, not commands |
| L03 Automated semantic experiments | **COVERED_WITH_EVIDENCE** | A: 5 pinned experiment scripts + results, with a body-only mutation and a regression guard. Textbook baseline-vs-candidate on identical pinned scenarios |
| L04 Negative intent signal | **NOT_APPLICABLE** | no intent was misinterpreted in this round |
| L05 Semantic runtime laboratory | **PARTIAL** | D's oracle is a real, resettable, executable scenario with SIMULATION labels absent but explicit predicates; no world/intent/action replay |
| L06 Command visual language | **UNOBSERVED** | C states plainly: no 3D rendering produced, parity claims **NOT_RUN**. Correctly declared |
| L07 D1 truth/execution gates | **PARTIAL** | the round demonstrated gate *thinking* (declared vs enforced vs witnessed) but ran no D1 gate and touched no live path |
| L08 Self-describing runtime wiki | **PARTIAL** | B's publication→projection chain is a working instance; but fidelity is **bounded by §9 item 1** |
| L09 SVG symbolic communication | **NOT_APPLICABLE** | out of scope; B and C inspected the 17-family intake as prior art only |
| L10 Historical BCP-dev source-map | **NOT_APPLICABLE** | never approached |

### 7.1 L11+ — capability classes the round discovered that the map does not contain

These are **not** forced into L01–L10. This is the "capture newly discovered capability
classes (L11+) instead of forcing them into the original ten" instruction.

- **L11 — Instrument failure masquerading as a clean result.** Three arms hit it unprompted:
  C's regex silently returned `NOT_FOUND` and would have reported "no contradiction under
  any vocabulary"; C's inverted `typeEnforced` reported the exact opposite of the truth; D's
  laundering detector accused two correct agents at a 100% false-positive rate. **The class
  is: a self-knowledge system must be able to report the coverage and validity of its own
  instruments, or it will report success while broken.** This is E08 sharpened from a
  behaviour into a design requirement.
- **L12 — Provenance of a *witness*, not just of a *source*.** Every arm's central evidence is
  `executed: true`, which is unfalsifiable from the artifact. Distinguishing "I ran this" from
  "someone told me they ran this" is a separate axis from source custody, and D's
  SELF_WITNESSED / CAPSULE_ATTRIBUTED / INDEPENDENTLY_REPRODUCED is the first concrete
  proposal for it.
- **L13 — Scoped negative disclosure as high-value interface.** D's finding that the capsule's
  *disclaimed* region was where both cold readers looked first. What an artifact does **not**
  establish turned out to be more actionable than what it does. No legacy class covers this.
- **L14 — Contract-shape blindness of static tooling.** A's `.d.ts` result generalised by D:
  four value-contract violations type-check clean. The gap is not "types are weak" — it is that
  **a type surface has a specific blind spot for value domains and nobody notices because the
  blind spot is invisible.** Related to but distinct from L07.

---

## 8. Proposal decision register

`REVIEW.md` instruction 3. A model's confidence and the number of agreeing sessions are not
quality metrics; **no proposal below is promoted on agreement count.**

| # | Proposal | Origin | Disposition | Reviewer's reason |
|---|---|---|---|---|
| 1 | Digest binding is sufficient for projection fidelity | B (implicit) | **REJECT WITH EVIDENCE** | B's own P5: a view was falsified by hand while carrying the correct digest. Necessary, not sufficient. Re-render-and-compare closes it at trivial cost. **This is the round's cleanest negative result** |
| 2 | A handoff claim carries a machine-checkable witness-provenance status | D | **SMALL TEST NEXT** | Directly attacks §5.5, the round's central limitation. Cheap, and makes reviewer rejection possible without re-running work |
| 3 | A capsule must publish what it did **not** establish, machine-readably | D | **SMALL TEST NEXT** | L13; the disclaimed region was measurably the most-used part of the artifact |
| 4 | "A capsule improves cold-reader accuracy" | D (tested) | **REJECT WITH EVIDENCE — at fixture scale only** | 4/4 vs 4/4, and 0/4 laundering. D is right that this must stay an open question on real source; the reviewer keeps that restriction |
| 5 | Substring-based laundering detection over a whole answer | D (tested) | **REJECT WITH EVIDENCE** | False positives at 100% on agents that were *refuting* the defect. Any future detector needs a regression case of an agent correctly criticising a defect |
| 6 | The three-operation vocabulary `exists` / `witnessed` / `enforced` | C | **OPEN QUESTION** | H1 (verbs) and H2 (predicates) **tied on three of four criteria**; H1 is simpler and C says it is a live contender. Not adjudicable on n=1 fixture. Do **not** freeze WikiCore |
| 7 | A formal frontend/backend service split for projections | B (tested) | **REJECT WITH EVIDENCE — at fixture scale** | No observed constraint required it. But the boundary that *is* load-bearing is the **witness channel**: static parsing cannot answer "is this contract enforced?" B says this plainly and it is the most useful architectural finding of the round |
| 8 | Runtime assertions so violated contracts throw at the call site | D (proposed, not tried) | **SMALL TEST NEXT** | D's own note: this removes the whole class of silent divergence rather than making it easier to notice. It was rejected only because it would destroy the traps under test |
| 9 | The 17-family symbolic lexer as the intake mechanism | B (not tested) | **OPEN QUESTION** | Not tested by anyone; out of all four briefs |
| 10 | Any protocol, vocabulary, topology or artefact count change | — | **NEEDS OWNER DECISION** | Nothing in Round 0 ratifies anything. Routed to §11 |

---

## 9. What goes into the next shared CORE_SEED — at most a few, with rationale

`REVIEW.md` instruction 5: move at most a few, keep dissent available, do not silently
freeze WikiCore methods, serialization, topology, routing or runtime. **Four items:**

1. **The silent-instrument rule.** Any tool that produces a negative or clean result must
   report its own parse coverage and run at least one positive control. *Rationale:* three
   independent arms failed this way; it is the single most transferable lesson and it costs
   one assertion. *Dissent preserved:* B argues the digest+re-render pair already covers its
   case; D argues the booster's `--selftest` already covers its. Both true and narrower.
2. **Witness provenance as a required status vocabulary** (proposal 2). *Rationale:* the
   round's central unverifiable claim; without it no artifact in `runs/` can be safely reused.
3. **Bound-before-reporting discipline.** Any timing or resource claim states its bound and
   the measurement that would falsify it. **No predicate gates on wall-clock** unless it is
   calibrated against a stated, re-verified envelope; below that it is descriptive. *Rationale:*
   §2.3 and §2.2 — a 4000 ms threshold produced a claim about the source that was about the
   machine, and the reviewer's own fix then reproduced the same error via a timing slope.
   *Dissent preserved:* A already labelled the bound correctly and was still misread; the rule
   is cheap but clearly not sufficient on its own.
4. **`REAL_SOURCE_UNAVAILABLE` must be re-declared, not inherited.** *Rationale:* four arms
   unanimously skipped the real cohort, so Round 0 says nothing about real code. Declaring it
   once at seed level prevents it being quietly forgotten.

**Explicitly NOT frozen:** the three-operation vocabulary, the publication/digest format, the
projections' topology, the booster count, the fixture's status as "the" corpus.

---

## 10. One repeatable Round-1 benchmark

`REVIEW.md` round sequence: Round 1 synthesises *new unresolved contrasts and one repeatable
benchmark*, without averaging the designs. Exactly one, chosen because it is the only claim the
round actually produced that is both falsifiable and currently unmeasured:

> **BENCHMARK R1 — Cross-file silent-divergence recall.**
> Fixed task, pinned real source (`omega-baseline/plugins/vivim-nlcl-pure`: `symbols.ts`,
> `lexer.ts`, `types.ts`), n ≥ 3 cold readers per arm, two arms only:
> **(a) baseline** = source + ordinary read/search/execute tools;
> **(b) capsule** = identical access plus a bounded handoff capsule that MUST machine-declare
> what it did not establish.
> Score, against an executable oracle that derives ground truth by running the source:
> planted-declared-vs-actual recall, false-attribution rate (claims credited to the wrong
> origin), self-reported probe count vs tokens, and unparsed-region self-report accuracy.
> **Falsifies "capsules do not help"** if capsule recall exceeds baseline there; **confirms**
> it if the arms re-converge at parity.
>
> **Mandatory measurement discipline**, inherited from §2.2/§2.3: the timing and token
> subscores are **descriptive only** in the first run. Gate only on the recall and
> false-attribution subscores, which are deterministic. Anyone tempted to gate on the token
> gap should re-read the `1e9` correction first — and must publish the envelope they
> calibrated against, re-verified on the day.

Why this one: it is Arm D's own smallest next falsifying test, it is the only open question
the round produced that a real-source corpus can settle, and it reuses D's oracle, booster
and task with no new tooling. It simultaneously produces the first genuine measurement of
E10 — whether knowledge actually transfers, which Round 0 could not show.

**Not run. Cost not estimated. Requires owner go-ahead.**

---

## 11. Ratification routing — nothing here is canon

`REVIEW.md` instruction 6 routes owner choice through
`elephant-greenfield-omega/DECISION_PROCESS_TRACKER.md`. This review records **no decision**.

| Item needing owner authority | Path | Why it is not the reviewer's to close |
|---|---|---|
| Whether the four Run-0 notes enter shared canon | `OWEN_GUIDANCE` | archive disposition is explicitly not an agent's call |
| Whether to fund Benchmark R1 | `OWEN_GUIDANCE` | cost/scope/priority |
| Whether the fixture is retired as a corpus | `DELIBERATION` | saturated, but the four traps are load-bearing for L11/L14; retiring is not obviously right |
| Vocabularies, publication format, topology, booster count | `LAB` then `DELIBERATION` | evidence insufficient, n=1 fixture, no real source |

---

## 12. Custody and reproduction

```
runs/REVIEWER-R1-2026-10-12/
  ROUND1-REVIEWER-SYNTHESIS.md      this document
  reviewer-witness.mjs              6 predicates, independent of all arms
  reviewer-witness-output.json      its output
  negative-control.mjs              proves the predicates can fail
  dts-mutation-check.mjs            compiler-level verification of Arm A's central claim
  ADDENDUM-1-BACKBONE-ROUNDTRIP-AUDIT.md   the §22 contract-reference audit (separate object)
  backbone-roundtrip-audit.mjs      roundtrip audit + its 5 controls
  backbone-roundtrip-output.json    its output
```

Reproduce every reviewer claim:

```bash
cd runs/REVIEWER-R1-2026-10-12
node reviewer-witness.mjs --check        # expect PASS (6/6)
node negative-control.mjs                # expect PASS (3/3 mutants flip)
node dts-mutation-check.mjs              # expect W7 VERIFIED
node backbone-roundtrip-audit.mjs        # expect exit 0, 6 findings, 5/5 controls
```

Nothing in `runs/` is committed. `main` was not modified by this review. All arm artifacts are
UNTRACKED and UNCOMMITTED, as their own notes declare.

**The reviewer's own verification is no more authoritative than a single party's.** It is one
fresh process on one machine at one moment — which is, precisely, the caveat this document
just applied to Arm A's `1e9`.