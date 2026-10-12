# MASTER-EXEC-2026-10-12

Execution pass over the assembled master `built/FULL_DRY_RUN_PROMPT_ALL.md`.

## Scope and honest labelling

**This directory is not an arm.** The master's own header forbids using the `ALL`
slice as an arm input, and this session read all four arm briefs and all four
Round-0 run notes. Claims here about arm behaviour are **PROCESS_REHEARSAL**.

What it does do is the work the master assigns to **no arm**: custody of the
master itself, Decision 1, Decision 2, and Section 18 claim-vs-code verification.

Sections 18 and 19 were read, so results touching them are **LEGACY-SEEDED
REUSE** per those documents' own disclosure rule.

Nothing in `main`, the master, the shared seed, or any other run directory was
modified.

## Files

| File | What it is |
|---|---|
| `RUN-NOTE.md` | **Start here.** Findings, limits, proposal register. |
| `custody-check.mjs` | Re-hashes all 26 embedded sections + byte-compares bodies |
| `custody-negative-control.mjs` | Proves the checker can fail (6 controls) |
| `real-source-custody.mjs` | Decision 1 — cohort custody at the pinned commit |
| `symbolic-s1.mjs` | Decision 2 + §18 S1 — claim-vs-code replay of the real lexer |
| `*.json` | Machine-readable outputs |

## Headline result

Master custody **26/26 OK**. The Round-1 synthesis recorded
`REAL_SOURCE_UNAVAILABLE` for the cohort Benchmark R1 names; that cohort is
**in this repo, git-tracked, and byte-identical to the pinned commit (12/12)**.
The genuinely unavailable artifact is the separate owner-private 191-file ZIP.
Benchmark R1 is blocked on agent budget, not on source.

## Reproduce

```bash
bash reproduce.sh          # runs everything below, then the prior-round custody checks
```

Or individually:

```bash
node custody-check.mjs --json     # ALL_26_SECTIONS_CUSTODY_OK
node custody-negative-control.mjs # 6/6, NEGATIVE CONTROL PASS
node real-source-custody.mjs      # REAL_SOURCE_COHORT_CUSTODY_OK
node symbolic-s1.mjs              # S1_CLAIMS_VERIFIED_AND_DETECTOR_DISCRIMINATES
```

Requires Node ≥ 22 (runs `.ts` directly; verified on v24.11.1) and git. No
network, no credentials, no writes outside this directory.