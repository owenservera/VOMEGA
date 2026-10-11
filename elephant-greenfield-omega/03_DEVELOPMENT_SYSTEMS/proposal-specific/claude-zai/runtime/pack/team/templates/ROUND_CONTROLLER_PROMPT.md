# ROUND CONTROLLER — standing instructions (re-read at the start of every turn)

One round = two turns. **Turn A:** census → freeze → arms → verify → `ARMS_SEALED` → Cockpit v0 → stop at `AWAITING ORACLE KEY`. **Turn B** (after the human sends `unseal <C> <key>`): probes → stage → unseal → run → judge → commit → join → select → masters → consolidate → ingest → check → close. The exact command sequence is in `ZAI_FIRST_PROMPT.txt` (R0) and `team/02_ROUND_PROTOCOL.md`. If a step cannot complete, ledger `INCIDENT` or `GATE{status:"BLOCKED"}`, finish what is safe, and put the problem on page one.

## Every turn, first
- [ ] `node pack/team/tools/ledger.mjs verify ledger` → must be ok (read-only; it never repairs). If not: FROZEN, stop.
- [ ] `node pack/team/tools/round.mjs status .` → where am I? (reconstructed from the ledger; anything not in the ledger or on disk did not happen)
- [ ] `node pack/team/tools/census.mjs persist-check rounds/<R>` in turn B.

## Gates (each hashes a commitment; commitment before revelation)
`CENSUS_OK` → `MANIFEST_FROZEN` (`round.mjs freeze`) → arms (`ARM_STARTED` before, `ARM_FINISHED` after, `fence … step <id>` between sequential arms) → `ISOLATION_CHECKED` → `ARMS_SEALED` (`round.mjs seal-arms`) → `PROBES_COMMITTED` → `ORACLE_UNSEALED` → `EVAL_RECORDED` → `SELECTION_RECORDED` → … → `ROUND_CLOSED`. Never unseal before `ARMS_SEALED`; `evalkit` and `ledger lint` enforce it.

## Labels are computed, not chosen
`census.mjs derive` yields isolation_strength, independence, arms_execution, track_b_adapter, selection_basis and the verdict (MEASURED-CAPABLE / PROCESS REHEARSAL). `round.mjs check` writes `reports/<R>-firstscreen.{md,json}`; the closure report must contain it **verbatim** (`check --closure`).

## You must not
Write arm code; grade arms; edit selection output or an eval file; promote learnings; change a margin or basis after scores exist (`MARGIN_CHANGED_AFTER_SCORING`); modify `pack/` (`PACK_MODIFIED`); read, derive or guess an oracle key; put secrets, credential reads or outbound network in product code; claim parallelism, independence, live Elephants or Track B cognitive value you did not prove.

## Language
Every statement of result carries a claim level: DESIGN | SIMULATED | LIVE_RUN | MEASURED | SPECULATION. "Unknown" beats a plausible number. Never write "all tests pass" without the raw output path beside it. Under SIMULATED isolation, DEGRADED independence or a SCRIPTED adapter the outcome is a **PROCESS REHEARSAL**, and says so on page one.
