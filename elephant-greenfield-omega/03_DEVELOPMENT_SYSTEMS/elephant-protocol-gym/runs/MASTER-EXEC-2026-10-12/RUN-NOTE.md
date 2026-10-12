# RUN NOTE — MASTER-EXEC-2026-10-12

**What this run is.** An execution pass over the assembled master
`built/FULL_DRY_RUN_PROMPT_ALL.md` (218,245 bytes, sha256 `8a8bc525…2f97a129`).

**What this run is NOT.** It is not an arm. It is not a four-arm study. It is not
Round 2. Per the master's own rule at line 5, *a session that has read all four
arm prompts is no longer an independent arm*. This session read all four arm
briefs and all four Round-0 run notes. Every statement here about arm behaviour
is therefore **PROCESS_REHEARSAL**, and is reported as such.

What it legitimately does is the work the master assigns to *no arm*: custody of
the master itself, Decision 1 (feeder/custody), Decision 2 (existing-automation
control), and the Section 18 claim-vs-code obligations — none of which any arm
exercised.

**Disclosures required by the material read.**
- Sections 18 (`SYMBOLIC_LANGUAGE_INTAKE.md`) and 19 (`LEGACY_ALIGNMENT_MAP.md`)
  were read. Per their own disclosure rule, results touching them are
  **LEGACY-SEEDED REUSE**, not blind discovery. Applies to §4 below.
- This run is **not** independent of Round 0 and makes no new arm claim.

**Date:** 2026-10-12 · **Commit:** `1199b38c1fd174e997c92b22d18d8c20c952eb9e`
(= `origin/main`, = the commit all four arms pinned) · **Node:** v24.11.1

---

## TLDR — the one finding that changes a decision

**The Round-1 synthesis recorded `REAL_SOURCE_UNAVAILABLE, unanimously … Decision 1
was not exercised by anyone`, and routed Benchmark R1 onward as blocked on real
source. That blocker is misdiagnosed.**

`Benchmark R1` names its corpus as `omega-baseline/plugins/vivim-nlcl-pure`:
`symbols.ts`, `lexer.ts`, `types.ts`. **Those files are in this repository, tracked
in git, and byte-identical to the pinned commit.** 12/12 cohort files verified,
zero uncommitted drift. The genuinely unavailable artifact is the *owner-private*
191-file ZIP, which is a different thing and is correctly reported
`UNAVAILABLE_NOT_SUPPLIED`.

Benchmark R1 is therefore **not blocked on source**. It remains unrun for the
reason it should be: it needs n ≥ 3 cold readers × 2 arms, which is agent budget,
not source access.

---

## 1. What I actually did (all executable, all reproduced below)

| # | Obligation | Instrument | Result |
|---|---|---|---|
| 1 | Master custody | `custody-check.mjs` | **26/26 `CUSTODY_OK`** |
| 2 | Instrument validity | `custody-negative-control.mjs` | **6/6 controls discriminate** |
| 3 | Decision 1 — feeder/custody | `real-source-custody.mjs` | **`REAL_SOURCE_COHORT_CUSTODY_OK`**, 12/12, 0 drift |
| 4 | Decision 2 + §18 S1 | `symbolic-s1.mjs` | **9/9 claims verified**, 4/4 negative controls hold, mutation discriminates |
| 5 | Prior-round custody | reviewer scripts | **PASS 6/6 · PASS 3/3 · W7 VERIFIED** |
| 6 | §23–26 protocol backbone | `protocol-backbone/tools/validate.mjs` | **`ok:true`** — 9 cards, 19 assets, 19 crosswalk, 4 profiles, 0 errors; tests 2/2 |

Nothing in `main` was modified. Nothing in the master, the seed, or any arm's run
directory was edited. All new files are under `runs/MASTER-EXEC-2026-10-12/`.

---

## 2. Master custody — 26/26, and the checker is proven able to fail

Every one of the 26 embedded sections was re-hashed from disk and compared to the
master's claim, and the embedded body was byte-compared to the source (not merely
the hash — a master that *claims* a correct hash over a corrupted body would
otherwise pass).

```
26 sections · 26 sha256 match · 26 byte-count match · 26 bodies match
verdict: ALL_26_SECTIONS_CUSTODY_OK
```

Because a verifier that has only ever returned PASS demonstrates nothing, the
checker is itself tested against four inverted properties:

| Control | Inverted property | Observed |
|---|---|---|
| P1 | none (unmutated) | `ALL_26_SECTIONS_CUSTODY_OK` |
| P2 | none (banner cases included) | `ALL_26_SECTIONS_CUSTODY_OK` — no false alarm |
| N1 | a source file's bytes changed | `CUSTODY_BROKEN` ✓ |
| N2 | an embedded body edited only | `CUSTODY_BROKEN` ✓ |
| N3 | a claimed sha256 falsified | `CUSTODY_BROKEN` ✓ |
| N4 | a source file deleted | `CUSTODY_BROKEN` ✓ |

**6/6 discriminate.** The green result is meaningful.

### 2.1 A real deviation the sha256 alone would have hidden

Sections 18 and 19 embed a `DISCLOSURE RULE` banner that **is not in the source
files** (`grep -c 'DISCLOSURE RULE'` → 0 in both). The assembler prepends it for
sections declared `disclose: true` (`tools/build-full-dry-run-prompt.mjs:96`).

This is *not* corruption — it is intended. But it has a precise consequence worth
recording: **for those two sections the `sha256` attests the source file while the
rendered body differs from it.** An agent that verifies custody by hashing alone
would conclude "verbatim" and be wrong about 2 of 26 sections. The verifier
therefore classifies it explicitly as
`DISCLOSURE_BANNER_PREPENDED_BY_ASSEMBLER` rather than loosening the comparison.

---

## 3. Decision 1 — the real-source cohort exists and is pinned

All four arms skipped the real cohort. The synthesis treated that as
`REAL_SOURCE_UNAVAILABLE`. Executing Decision 1 properly separates two different
things the arms conflated:

| Artifact | Status |
|---|---|
| `omega-baseline/plugins/vivim-nlcl-pure` (12 files, in-repo) | **`REAL_SOURCE_COHORT_CUSTODY_OK`** |
| `Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip` (owner-private, 191 files) | `UNAVAILABLE_NOT_SUPPLIED` |

The in-repo cohort is tracked and **byte-identical to `1199b38`** for all 12 files
(verified by hashing `git show <sha>:<path>` output, not by a path-filtered
`git diff` — that can print nothing while a file has changed).

Cohort fingerprint: `f052ca28f10437ca3c35632ea76dd47c32acc27031fa4cf20ef7377e3edeb30e`

So Decision 1 was not "unavailable" — it was **unexercised**. The distinction
matters: one blocks the experiment, the other just describes an omission.

---

## 4. Decision 2 + Section 18 — the existing control, actually run (LEGACY-SEEDED)

The synthesis marked L02 (pure TS NLCL) `UNOBSERVED` and Decision 2 `PARTIAL at
best — no arm established that a new instrument beats an existing control`. No arm
ran the NLCL. Section 18 makes nine specific, checkable claims about that code;
this run executed the real module and tested them.

**Result: all nine claims verified against executing code.**

| # | Claim in Section 18 | Observed |
|---|---|---|
| C1 | `symbols.ts` declares the 17 families | **17** ✓ |
| C2 | counting `FAMILY_GLYPHS` does *not* give 17 | **18** ✓ |
| C3 | all 17 family glyphs are lexable | 0 lost ✓ |
| C3b | every advertised glyph maps to a *declared* family | 0 orphan, 0 unlexable ✓ |
| C4 | aliases `∆/Δ` and `✓/✔` normalise | 4/4 ✓ |
| C5 | `-> => → >` are arrow tokens | 4/4 ✓ |
| C6 | `@name /cmd #tag $var` attach | 4/4 ✓ |
| C7 | a quoted glyph stays literal, gains no family | 0 leaked ✓ |
| C8 | `D-217` source label present | present ✓ |

C2 deserves emphasis because it is the master warning against a specific mistake,
and it is easy to get wrong: `FAMILY_GLYPHS` has **18** entries because `Δ` and `✔`
are aliases, while `SYMBOL_FAMILIES` has **17**. Counting the glyph list yields 18.

### 4.1 My own instrument had the blind spot this corpus is about

The mutation control deletes one family and re-runs the identical detector.
The first version produced:

```
[FAIL] mutant/C1   16        <- count broken, good
[PASS] mutant/C3   0 lost    <- NOT broken: my test could not see the deletion
```

C3 walks `SYMBOL_FAMILIES` asking "is each declared family lexable?" — it is
**self-referential**. It can only fail when a declared family is *unlexable*, never
when a family is *removed*. A green C3 was therefore partly unfalsifiable.

Adding C3b (every advertised glyph must map to a declared family) closed it:
`mutant/C3b` now reports `orphan:~; unlexable:~->none`.

This is L11 — *instrument failure masquerading as a clean result* — caught in my
own instrument, in the same class the synthesis attributes to three Round-0 arms.
It is recorded here rather than quietly fixed, because the fix is the finding.

### 4.2 Limits — stated, not buried

- This exercises the **lexical layer only**. `interpret.ts`, `ground.ts`,
  `recognize.ts` and `project.ts` were verified for *custody*, not executed.
  L02 therefore moves `UNOBSERVED → PARTIAL`, not to "verified".
- Section 18's larger semantic claims (complete composition, grounding, parity)
  are **untested here**. The intake doc's own honesty labels still stand.
- **LEGACY-SEEDED REUSE**: the claims under test come from the seeded document.
  This verifies the *document is accurate about the code*; it does not independently
  confirm the code is *good*.

---

## 5. Prior-round custody — the existing evidence still reproduces

```
reviewer-witness.mjs --check   → PASS (6/6 executable predicates)
negative-control.mjs           → PASS (3/3 discriminating mutants flip)
dts-mutation-check.mjs         → W7 VERIFIED
```

Round 0 / Round 1 evidence is intact at this commit and re-runnable. My results
build on it rather than restating it.

---

## 5b. Sections 23–26 — protocol backbone still validates

The backbone embedded as sections 23–26 was re-executed rather than assumed:

```
node protocol-backbone/tools/validate.mjs
→ { ok: true, protocol_cards: 9, assets: 19, crosswalk_entries: 19,
    composition_profiles: 4, errors: [], warnings: [9 × PARTIAL_MAPPING] }
node --test protocol-backbone/tools/validate.test.mjs   → 2 pass, 0 fail
```

The 9 warnings are **deliberate honesty labels**, not defects: every card is marked
`PARTIAL_MAPPING; source narrative remains necessary`, i.e. no card claims to
replace its source. The second test specifically asserts the validator does *not*
silently treat partial mappings as complete. This is the state described in the
master's own section headers ("candidate", "not a ratified runtime") and it holds.

## 6. Honest status correction — the master's header is now false

`built/FULL_DRY_RUN_PROMPT_ALL.md` line 3 states:

> **Status: PREPARED, NOT RUN.** No agent session has executed this prompt.

**That is no longer accurate.** Four arms ran on 2026-10-12, the Round-1 reviewer
synthesis ran, and this pass ran. The accurate status is:

> **EXECUTED IN PART.** Round 0 (arms A–D) and Round 1 (reviewer synthesis) were
> executed on 2026-10-12 in `runs/`. This master remains the *reference* assembly
> for launching new arms; it is not a description of an unrun experiment.
> `ALL` slice = reference master, never an arm input.

I did **not** edit the master. It says of itself "do not edit here", it is
untracked build output, and rewriting a launch artifact's header is an
owner-facing act, not an agent's. Recording it here instead.

---

## 7. What is still genuinely unexecuted

| Item | Status after this run |
|---|---|
| Arms A–D (Round 0) | executed, independently; **not re-run here and should not be** |
| Round 1 reviewer synthesis | executed; scripts reproduce |
| Master custody | **executed (26/26)** |
| Decision 1 in-repo cohort | **executed (12/12)** |
| Decision 1 owner-private ZIP | `UNAVAILABLE_NOT_SUPPLIED` — genuinely blocked |
| Decision 2 control replay | **executed at the lexical layer** |
| §23–26 protocol backbone | **executed — `ok:true`, 9 cards / 19 crosswalk / 4 profiles, tests 2/2** |
| L02 semantic composition / grounding | **NOT_RUN** — needs `interpret`/`ground`/`recognize` probes |
| **Benchmark R1** (cross-file silent-divergence recall) | **NOT_RUN.** Corpus now pinned and available; blocked only on n≥3 cold readers × 2 arms of agent budget |
| L06 visual / 3D parity (V1–V7) | **NOT_RUN** — untouched, no renderer exists |
| U0–U5 governance graduation | **NOT_RUN** — no domain is claimed at U4 |
| Cost / token telemetry for this round | **UNKNOWN** — not instrumented |

---

## 8. Machine ↔ Human signal (Decision 3)

- **Subject:** `built/FULL_DRY_RUN_PROMPT_ALL.md`, 26 embedded sections, at
  commit `1199b38`.
- **Machine reading:** all 26 sections resolve to their attested sources; 2 render
  with an assembler-injected banner absent from source.
- **Human reading:** the master is a faithful, checksummed copy of the Gym canon
  **except** that two reviewer-gated sections carry an extra disclosure line the
  original files do not contain.
- **Comparison:** **OBSERVED_DISCREPANCY** — a checksum-level check and a
  human-level check disagree on "verbatim" for 2 of 26 sections. Evidence class:
  executable, reproducible, with 6/6 discriminating negative controls.
- **Consequence:** a custody protocol that verifies by hash alone will
  **over-report** fidelity on any assembler-decorated section. This is a concrete
  instance of REVIEW.md's "a proposal is not a decision" applied to *custody*:
  `sha256_match` and `rendered_body_identical` are two different claims and must
  be reported as two.

---

## 9. Proposal register (REVIEW.md instruction 3)

| # | Proposal | Disposition | Reason |
|---|---|---|---|
| 1 | Correct the synthesis's `REAL_SOURCE_UNAVAILABLE` → in-repo cohort available | **REJECT WITH EVIDENCE** (the original claim) / **CORRECTION** | 12/12 custody OK at pin; see §3 |
| 2 | Report `sha256_match` and `rendered_body_identical` separately | **SMALL TEST NEXT** | Already implemented in `custody-check.mjs`; costs one field |
| 3 | Never write a per-family "is it lexable" test without its removal-detecting twin | **REUSE EXISTING** (adopt now) | C3/C3b; §4.1 |
| 4 | Re-label L02 from `UNOBSERVED` | **OPEN QUESTION** | Only the lexical layer ran; PARTIAL is defensible, "verified" is not |
| 5 | Fund Benchmark R1 | **NEEDS OWNER DECISION** | Needs agent budget, not source |
| 6 | Any change to `CORE_SEED`, vocabularies, topology or the master itself | **NEEDS OWNER DECISION** | Nothing here ratifies anything |

---

## 10. Smallest next falsifying test

**Run `interpret()` on a pinned input and compare its candidate set against the
same `WorldModel` twice with one ground-truth difference.** It is the smallest
step that moves L02 from lexical truth to semantic truth, needs no agent budget,
no browser, and reuses only `real-source-custody.mjs` as a guard.

Second, if agent budget is authorised: **Benchmark R1**, whose corpus is now
pinned and whose only missing input is cold readers.

---

## 11. Reproduce

```bash
cd runs/MASTER-EXEC-2026-10-12
node custody-check.mjs --json            # expect ALL_26_SECTIONS_CUSTODY_OK
node custody-negative-control.mjs        # expect 6/6, NEGATIVE CONTROL PASS
node real-source-custody.mjs             # expect REAL_SOURCE_COHORT_CUSTODY_OK
node symbolic-s1.mjs                     # expect S1_CLAIMS_VERIFIED_AND_DETECTOR_DISCRIMINATES

# prior-round custody
cd ../REVIEWER-R1-2026-10-12
node reviewer-witness.mjs --check        # expect PASS (6/6)
node negative-control.mjs                # expect PASS (3/3)
node dts-mutation-check.mjs              # expect W7 VERIFIED

# sections 23-26 protocol backbone
cd ../../protocol-backbone
node tools/validate.mjs                  # expect "ok": true, 9 cards, 0 errors
node --test tools/validate.test.mjs      # expect 2 pass, 0 fail
```

Machine-readable outputs: `custody-check-output.json`,
`real-source-custody-output.json`, `symbolic-s1-output.json`.

**Standing caveat, applied to this note too:** one process, one machine, one
moment. A green run here is evidence that these checks passed *now*, not that the
system is correct.