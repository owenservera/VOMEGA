# Run A — Machine ↔ Human Signal (Decision 3 receipt)

**Status: partially witnessed.** One discrepancy is independently witnessed; the other half of
the comparison is honestly `UNKNOWN` because no independent human participated. Splitting them
is the point of this receipt — collapsing them would score my own prose as human evidence.

---

## Signal 1 — source prose vs witnessed behaviour — `OBSERVED_DISCREPANCY`

**1. Subject.** `fixture/001-semantic-basics.ts`, sha256 `fe0c65…86d5`, at commit `1199b38`.
Claim under test: the file's own doc comment, *"Declared expectation: count is a nonnegative
safe integer."*

**2. Machine reading (what the tools establish).**
- TypeChecker: `repeat(count: number, emit: (value: number) => void): void`. Establishes
  arity, types, export status. Establishes **nothing** about the domain of `count`.
- Executed witnesses (`exp1`): 7 of 11 probe inputs violate the stated precondition. Every one
  either returned normally with different behaviour or never returned. **Zero produced a
  diagnostic.**

**3. Human reading (ordinary language, no technical vocabulary).**
*"The file says it wants a whole number of zero or more, and it says plainly that this is not
being checked. If you hand it something else it will not stop you — it will just quietly do
something, or keep going, and you would not get told."*

**4. Comparison.** **AGREEMENT, and it is independently witnessed.** The human sentence above
and the machine table disagree in exactly the way the author predicted: a stated rule and an
unenforced behaviour. This comparison needs no human tester, because both sides are properties
of the artifact — the prose is in the file, the behaviour is in the execution log. The
witness is `exp1-results.json`.

**5. Feedback.** The author's prose was *correct*. The interesting part is that it could not
have been derived from the type, could not have been enforced by the compiler, and could not
have detected its own staleness after an edit. Honesty in a comment is a human contribution
that no machine channel reproduces. Challenged hypothesis: "a description generator could have
produced that warning." It could not — the generator would have had to already know the rule,
and nothing in the source states it except the comment.

---

## Signal 2 — machine meaning vs human understanding — `UNKNOWN`

**1. Subject.** Does an ordinary reader, given only the source, predict `classify(NaN)` correctly?

**2. Machine reading.** `classify` returns `"negative" | "zero" | "positive"`. Executed:
`classify(NaN)` returns `"positive"` (`exp4`).

**3. Human reading.** *My own* ordinary-language reading: NaN is "not a number", so a careful
reader expects either an error or some explicit "not applicable" result. I expected the union
to be incomplete. This expectation is **mine, not a human participant's**.

**4. Comparison.** **INSUFFICIENT EVIDENCE — deliberately not scored.** My expectation and my
observation agree (both say the union is misleading), but I am the same party on both sides.
`MACHINE_HUMAN_SIGNAL.md` is explicit that an agent's own proposed answer is not independent
verification, and the review template says a purely speculative claim must say `NOT_RUN`
rather than claiming an observed discrepancy. The *machine-side* fact is `OBSERVED`
(`classify(NaN) === "positive"`). The *human-side* fact does not exist yet.

**5. Feedback.** This is the honest gap in Run A. Getting a real signal needs one of: a human
participant answering a comprehension question, a held-out corpus with known reader
misconceptions, or an independent Elephant that was not shown this note. Any of those is
`UNKNOWN` for this arm. **I did not run it, and no result below should be read as if I had.**

---

## Receipt summary

| Signal | Machine side | Human side | Outcome | Witness |
|---|---|---|---|---|
| 1 — prose vs behaviour | witnessed | witnessed (artifact prose, not a person) | `OBSERVED_DISCREPANCY` | `exp1-results.json` |
| 2 — meaning vs comprehension | witnessed | **absent** | `UNKNOWN` | `exp4-results.json` |

**Decision 3 acceptance self-assessment.** The rule requires the machine reading, the human
reading and the comparison to be *actually visible*, and permits `UNKNOWN/INCONCLUSIVE` and
`NOT_RUN` outcomes. Signal 1 satisfies this on independently witnessed grounds. Signal 2 is
declared `UNKNOWN` rather than dressed up. No simulated human judgement is presented as
evidence anywhere in this run.

**No permission claim.** Nothing here authorises execution, mutation or effect. Every probe ran
in a disposable temp directory against a local copy; the shared fixture and main were not
modified.