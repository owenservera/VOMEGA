# CHANGELOG — team program v0.1 → v0.2

Each row is a defect found by reading or running v0.1, how it reproduces, and the fix. Test ids refer to `tools/team.test.mjs` / `e2e.test.mjs`.

| # | Defect in v0.1 | Reproduction | Fix (v0.2) | Test |
|---|---|---|---|---|
| 1 | Every arm came out tainted | `fence snapshot` ran before BRIEF/ARM_RESULT existed, so their later creation counted as writes | provision → plant → snapshot order enforced; snapshot refuses without BRIEF.md and .canary; ARM_RESULT/WRITES exempt | I-series |
| 2 | `ledger verify` mutated the ledger | verify on a file with a torn tail truncated it | read-only parser; torn tails and lock files are reported, only `emit` writes | L-series |
| 3 | Journal failed its own verify | append a body containing a `Date` or an `undefined` array element; the stored line differs from the hashed body | `append()` normalises the body via JSON round-trip (kernel + vendored copy) | P1, kernel tests |
| 4 | Labels (isolation, independence, verdict) were chosen by the agent | nothing computed them | `census.mjs derive` computes them from evidence files; `round.mjs freeze` refuses a disagreeing manifest | C1–C2 |
| 5 | Oracle was not hidden | oracle tests lived in the controller's own context | oracles authored outside the run, AES-256-GCM sealed, key supplied by the human after `ARMS_SEALED`; `ORACLE_UNSEALED` ledgered; marker scan for copies | S1–S4 |
| 6 | Scores and selection were judgment | rubric points were all agent-assigned | 75 of 100 points computed by `evalkit`; selection basis fixed in the manifest (`mechanical` when independence is DEGRADED); `select.mjs` takes margin/basis only from the manifest | R-series, E-series |
| 7 | Fence hashed only seed, controller and arms | a stray file in the round root was invisible | whole-round-directory hashing, seed Git HEAD/status, `step` mode for per-arm attribution | I-series |
| 8 | Canary scan missed bare secrets and symlinks | copy only the 24-hex part of a canary | scan matches token and bare hex; flags tampered own canary and any symlink | I-series |
| 9 | Run order always favoured the same arm | sequential arms in fixed order | Williams-design counterbalance (`round.mjs order`) | R-series |
| 10 | Selection could be re-tuned after scores | margin passed on CLI | margin/basis from frozen manifest; override needs a reason and is printed; ledger lint `MARGIN_CHANGED_AFTER_SCORING` | S-series |
| 11 | Sorting not reproducible in the Cockpit port | `localeCompare` | code-unit comparison; conformance vectors for canon, chain, select | K0 |
| 12 | Evidence points self-assigned | narrative claims accepted | `evalkit join` audits: output files exist, claims backed, WRITES matches, contradicted "all tests pass" zeroes the criterion | E-series |
| 13 | E2E scored every entrant 0/0 | child `node --test` inherited `NODE_TEST_CONTEXT` and printed nothing parseable | `childEnv()` strips it; unparseable TAP is flagged, counts 0/0 | e2e |
| 14 | Hidden C3 oracle let a mutant survive | torn tail not truncated on open | added O04/O04b; all 18 mutants killed | owner-side |
| 15 | Track B claimed value without a consultant | consults were self-written | `consult.mjs` + census-derived adapter (LIVE / SUB-AGENT / SCRIPTED); SCRIPTED ⇒ first screen says cognitive hypothesis UNTESTED | C-series |
| 16 | Closure report could omit the bad news | page one was hand-written | `round.mjs check` writes the first screen; `--closure` requires it verbatim | R-series |
| 17 | Prompt was one long turn | oracle key and arms in one context | two-turn round with `AWAITING ORACLE KEY` stop | P3 |
| 18 | Stale hashes / copies drifting | prompt file and `00_START_PROMPT_ZAI.md` could differ | test P3 enforces identical text; P1 enforces vendored lib parity | P1, P3 |

## Not fixed (stated limits)

* A read that leaves no copy is invisible to canaries; under SIMULATED isolation the evaluator wrote the entrants, so blinding is formal only.
* Mutant-validated oracles show zero survivors among the owner's mutants, not absence of defects.
* The first prompt has not been dry-run on z.ai itself; behaviour of that platform is unmeasured.
