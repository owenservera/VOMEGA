# Run D — Elephant Self-Optimization and Automation Toolkit

Round 0, Arm D. Executed 2026-10-12 at commit `1199b38`. **Independent blind-discovery run.**
Read `RUN-NOTE.md` first — it contains a disclosed independence violation and an honest
six-competency coverage table.

## What this run did

Asked whether a compact self-describing **evidence capsule** beats **ordinary code + normal
read/search tools** when a fresh Elephant context must understand source — in accuracy, in
laundering risk, and in cost.

It **executed** the comparison rather than planning it: four genuinely isolated cold-reader
subagents (2 baseline, 2 capsule), one fixed task, identical source access, scored against an
independent executable oracle.

## Headline result

**The hypothesis failed, and that is the finding.** Both arms scored **4/4 trap recall** and
**4/4 correct source digests**. The capsule did not improve accuracy on this corpus — and,
unexpectedly, it caused **no laundering either** (0/4).

The corpus saturated, so the comparison is *uninformative*, not favourable. What actually carried
information was whether the handoff artifact was **mechanically checkable** and whether anyone
noticed its own defects. Both capsule readers noticed; neither was harmed.

## Three real findings

1. **Self-reported evidence is unfalsifiable.** Every answer asserts `executed: true` with pasted
   command/output. Nothing distinguishes a context that ran 42 probes from one that confabulated a
   transcript. My own first scoring pass produced a **false result** from hand-comparing two JSON
   shapes.
2. **My own booster was wrong before it was right.** v1 flagged 2/2 correct agents as laundering.
   Both had quoted the defective hash *in order to refute it* and independently computed the right
   one. Substring matching cannot tell copying a defect from criticizing a defect. Fixed, with a
   regression self-test. Reported because a false accusation at 100% rate on correct agents is the
   worst failure mode this kind of checker has.
3. **Contracts are enforced at *no* layer.** Independently reproduced from a cold reader's report:
   `tsc --strict` flags only repeat's arity/void; all four planted value-contract violations
   (`retryBudget(-5)`, `summarizeBuckets([])`, `mean([])`, `fastClassify(0)`) type-check clean.

## Reproduce everything

```bash
node oracle.mjs --check                                   # -> PASS (4/4 traps + control)
node booster/witness-check.mjs --selftest                 # -> PASS (5/5 discrimination cases)
node booster/witness-check.mjs --staleness                # -> PASS (stale pin detected)
node booster/witness-check.mjs                            # scores the 4 frozen trials
node publish-pack.mjs                                      # regenerates CAPABILITY-PACK.json
```

Node v24 runs the `.ts` fixtures directly. **Windows gotcha:** dynamic-importing an absolute `.ts`
path throws `ERR_UNSUPPORTED_ESM_URL_SCHEME` unless you pass a `file://` URL
(`pathToFileURL(p).href`). Several cold readers hit this.

## The one booster

`booster/witness-check.mjs` — dependency-free, no network. Three checks: trap recall, source-digest
agreement, and whether a capsule defect was **adopted as the answer's own fact** (never free prose).

**It cannot verify that any agent executed code.** It always returns
`EXECUTION_UNVERIFIABLE_BY_THIS_CHECKER` for that, and says so in its own output.

## Honest limits

- **n=2 per arm.** No statistical claim is supportable. Baseline's internal spread (15k–42k tokens)
  exceeds the between-arm gap.
- **All four readers are the same model family** — four contexts, not four independent
  implementations. Their agreement is **not** independent corroboration.
- **Two toy files.** Nothing here estimates recall or cost on real source.
- **Competencies #2 (dependency retrieval) and #3 (peer knowledge-seeking) were not probed.**
- **The project lead read part of Run B's results before designing the traps** (disclosed in
  `RUN-NOTE.md`). The four cold-reader trials are sealed and unaffected; the lead's own trap design
  is not.
- **Not certified, not promoted, not canon.** Judge status: PENDING.

## Files

| Path | What |
|---|---|
| `RUN-NOTE.md` | The deliverable, in `REVIEW.md` template form |
| `TASK.md`, `SCHEMA.json` | The fixed task + answer shape |
| `source/001-semantic-basics.ts` | Byte-identical copy of the pinned Gym fixture |
| `source/002-consumer.ts` | Second file, authored by Run D |
| `coldreaders/{B1,B2,C1,C2}.json` | Four raw answers (40–50 KB each) |
| `evidence/UPSTREAM-HANDOFF-CAPSULE.json` | The capsule payload (bounded, has a deliberate defect) |
| `evidence/telemetry.json` | Cost/quality; two cost sources kept deliberately separate |
| `evidence/machine-human-signal.json` | Decision 3 receipt |
| `evidence/booster-witness-check-output.txt` | Booster execution receipt |
| `evidence/compile-time-enforcement-probe.txt` | tsc witness |
| `oracle.mjs` | Independent executable ground truth |
| `booster/witness-check.mjs` | The one booster |
| `CAPABILITY-PACK.json` | Turn-close all-state publication (computed hashes) |
