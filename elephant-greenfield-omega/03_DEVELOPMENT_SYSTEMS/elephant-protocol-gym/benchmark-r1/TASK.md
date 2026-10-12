# R1 TASK — cross-file silent-divergence recall (one fixed task, two arms)

**Status: PREPARED, NOT RUN.** No cold reader has been dispatched. This file defines the
task; it is not a result and nothing here has been measured.

You are a cold reader. You are given **pinned real source** and one fixed question. Your job
is to find where what the source **declares** differs from what it **does** — including
places where the difference is silent.

---

## Your corpus (identical for every trial)

`omega-baseline/plugins/vivim-nlcl-pure` at the pinned commit recorded in the manifest.
Read the source yourself with ordinary tools: open, read, search, and **run it** with Node
(these are TypeScript files; Node 24 runs `.ts` directly with no build step).

Cohort fingerprint (verify it, do not trust it):

```
f052ca28f10437ca3c35632ea76dd47c32acc27031fa4cf20ef7377e3edeb30e
```

If the fingerprint does not match what your manifest says, **stop and report that**. A run
against unpinned source is not comparable to anything.

---

## The question, identical for both arms

> Find every place in this source where a **declaration** and the **actual behaviour**
> disagree, or where something is declared but **cannot be checked by executing anything**.
> For each finding give: the location, the declaration (quoted), what you observed by
> running it, and how you ran it.

You are not told how many findings exist. Do not pad, and do not stop at the first one.

---

## What counts

A finding needs **both** halves: a quoted declaration **and** an observed behaviour. A
declaration you merely disagree with is not a finding. A behaviour you merely find
surprising, with nothing declared to contrast it against, is not a finding either.

If something is declared but is **not executable** — a type-level guarantee, a doc claim no
runtime path can confirm or refute — that counts, and saying "this cannot be checked by
running it" is a finding in itself.

---

## Output shape

Return JSON matching `SCHEMA.json`. Every finding needs a location, the quoted
declaration, the observation, and the command that produced the observation.

**If you ran something, give the command and its real output. If you did not run it, say
so.** A pasted transcript is not evidence of execution, and Round 0 showed exactly why: an
arm reported `executed: true` for 42 probes, and nothing in the artifact could tell a real
run from a confabulated one.

---

## Rules

1. **No other trial material.** Do not read another cold reader's output, a capsule, or any
   prior run note. If you were handed a handoff capsule (arm C only), say so in
   `read_a_capsule` and label your findings accordingly — a finding you inherited is not a
   finding you discovered.
2. **Read-only.** Do not modify the cohort. If you need to mutate something to test it,
   copy it to your own scratch directory first and say that you did.
3. **Label provenance.** Each finding is `discovered_by_execution`, `discovered_by_reading`,
   or `inherited_from_capsule`.
4. **Do not guess a count.** There is a known number the oracle can derive; finding it is
   the measurement. Asserting a count you did not verify is worse than leaving it unknown.
5. **UNKNOWN is a valid answer.** An honest "I could not determine this" beats a confident
   wrong one, and is scored as honest rather than incorrect.

---

## The two arms

**Arm A — baseline.** Source plus ordinary read/search/execute tools. Nothing else.

**Arm C — capsule.** Identical source access, identical task, **plus** a bounded handoff
capsule from a prior reader. The capsule MUST machine-declare what it did *not* establish.
That section is the point of the arm, not an afterthought: in Round 0 the most useful part
of a handoff artifact was the region it disclaimed.

n ≥ 3 cold readers per arm. Same model family across all of them, so their agreement is
**not** independent corroboration and no statistical claim is supportable.

---

## Scoring (not visible to you)

An executable oracle derives ground truth by running the source, so scoring never inherits
an agent's mistakes. Scored on:

- **recall** of declared-vs-actual findings (may gate — deterministic)
- **false-attribution rate**, i.e. findings credited to the wrong origin (may gate)
- **self-reported probe count vs actual tokens** (DESCRIPTIVE ONLY in the first run)
- **self-report accuracy on regions you could not parse** (DESCRIPTIVE ONLY)

**Timing and token subscores may not gate in the first run.** Round 0 produced a 4000 ms
timeout that reported a property of the *source* when it was a property of the *machine*,
and a reviewer's fix then reproduced the same error through a timing slope. A wall-clock
predicate is only a gate if it is calibrated against a stated envelope that is re-verified
on the day.

**Falsifies "capsules do not help"** if capsule recall exceeds baseline on real source.
**Confirms it** if the arms re-converge at parity. Arm D's capsule-vs-baseline comparison
saturated at 4/4 vs 4/4 on a two-file toy corpus, which supports no claim in either
direction — this is the test that could settle it.