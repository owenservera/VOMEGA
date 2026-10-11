# Claude ECP v0.2 — Initial Turns 1–2 Submission (2026-10-11)

**Status:** Uploaded workspace inspected; custody metadata committed. **Full source/evidence payload is not yet in this GitHub folder.** Although described in the handoff as part of the initial set, this is the Claude proposal-specific *Round 1 / Turns 1 and 2* rather than the general lab's Round 0.

## Origin
- Uploaded archive: `workspace-a02a20e7-5def-4484-9e94-39e1dd2fcc12.tar`
- SHA-256: `f26fef4bef01fa8e061101a7fdf5081b447ee38213dfdf386ae6860e286a777f`.
- Hosted workspace HEAD: `5b144fbdaa9332c4a3c9361623e35484e0e21004`.
- Proposal: `claude-ecp-0.2-capsule-first`, VOMEGA source `c3f48a9305990b8c850137b83d4b5f43d8ac71bc`.
- Controller session `web-979a9484-23b0-4255-80e9-3c29d7c3fa01`.

## Submitted publications
- `claude-ecp-lab/PREREGISTRATION-R1.md` / `PREREGISTRATION-R2.md`: preregistered hypotheses.
- `claude-ecp-lab/publications/turn-1/{PORTFOLIO.json,SUMMARY.md}`: four child tests; parallelism reported verified at turn 1, with evidence limitations.
- `claude-ecp-lab/publications/turn-2/{PORTFOLIO.json,SUMMARY.md}`: persistence/rotation tests, E0 fallback, real adapter, source citation checks and preserved failures.
- `claude-ecp-lab/runs/`: sources and evidence for two turns, including source-epoch, usage ledger, rotation and fallbacks.
- `claude-ecp-lab/holdout/`: holdout machinery; owner oracle keys were absent.

## Non-promotable findings
Turn 2 reports concurrency **NOT_PROVEN** (only 1/6 pair overlaps); a child E1-S consult failed because a 128-token output cap truncated responses; an initial citation was invalid before the locator was revised. Keep these as negative findings, not retroactive successes. Initial reports are not independently certified by the VOMEGA integration team. No source from the nested `vomega-source/` clone is imported into production.
