# VOMEGA SITREP — current state

Date: 2026-10-06. This file is current state only; previous long SITREP/history is preserved in the archive.

## Mission

VOMEGA is a sovereign personal semantic operating environment. The owner-selected first public product is the floating Windows command box defined in `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`.

The selected first build deliverable is **D1 — Executable First-Release Semantic Twin**: a runnable synthetic journey proving registration, Account ambiguity, deterministic command compilation, typed/clicked semantic parity, contextual help, virtual governed execution, explicitly SIMULATED evidence and replay. D1 is not the public beta and does not prove live Provider behavior.

## Protected truth

Read `seed-docs/INVARIANTS.md` and `seed-docs/PROOF-AND-MATURITY.md` before changing load-bearing semantics. Core distinctions include Provider ≠ Account ≠ Model ≠ Session; Capability ≠ Realization; intent ≠ execution; consequence ≠ authority; evidence ≠ authority; World ≠ Surface; confidence ≠ proof; simulation ≠ live evidence.

Auth/provider/model configuration remains read-only unless Owen explicitly directs otherwise.

## Proven / observed now

- Local Vault continuity/isolation + real local law: verified-local by the existing bootstrap evidence / `omega:quick` slice.
- Existing `vivim-nlcl-pure` deterministic interpreter has useful verified-local behavior and a pinned release corpus; known gaps remain.
- Ratchet exists as executable D1 task/gate/proof machinery.
- Reflection Migrator MP21-P1/P2/P3 is implemented and verified locally; MP21-G1/G2/G3 still require independent review/consumer evidence before promotion.
- Prior bounded multi-agent concurrency was observed; it is a dated development fact, not a required topology.

## Not proven / still red

- No live Provider/Account evidence has been promoted.
- No live `prompt.send` proof exists.
- D1 is incomplete; use Ratchet state, not prose percentages.
- D1 false-READY/required-field work and many downstream gates remain implementation work.
- The negative-intent frontier is a D5 design hypothesis with an experiment defined; it is not a D1 completion gate.

## Documentation/PM consolidation disposition

The acceleration ZIP has been fully dispositioned into current operating docs. Remaining acceleration obligations are **code/tests/gates/experiments**, not another PM/documentation pass.

Completed doc-only inputs include:

- `deliverables/D1-CODE-MAP.md` — factual interpreter map for D1-002;
- `deliverables/D1-REFLECTION-HARVEST-MAP.md` — Phase-F reuse mapping;
- `live-proof/LIVE-PROOF-PROTOCOL.md` — candidate TRU-05 evidence contract;
- `live-proof/OWEN-DECISION-BRIEF.md` — R-2/RD-8/RD-10 owner boundary brief;
- acceleration execution discipline is folded directly into root `AGENTS.md`, `ratchet/OPERATING.md`, PM evolution rules and D1 Start Here; the temporary integration directive is archived.

Historical/bootstrap/tool/harness material is under `.project/archive/` and is not default reading.

## Current execution entry points

| Need | Current source |
| --- | --- |
| fresh agent | root `AGENTS.md` |
| D1 mission | `deliverables/D1-START-HERE.md` |
| D1 task/proof truth | `ratchet/OPERATING.md`, Ratchet CLI/probe/board/evidence |
| current worker claims | `agentic-launch/claims/` |
| daily drift/build guidance | `build-guidance/DRIFT-ASSESSMENT.md`; local telemetry on `ops/local-state` |
| five selected accelerator programs | `pm/scope.json`, `pm/build-plan.json`, generated PM views |
| whole-program map | `META-TRACKER.md` / `meta-tracker.json` |
| actual code evidence/limitations | `REALITY.md` + tests/evidence |
| owner decisions/open boundaries | `DECISIONS.md`, `live-proof/OWEN-DECISION-BRIEF.md` |

## Next work is implementation

For D1: run Ratchet, take a red frontier task, implement to its gate, independently review, repeat. The near-term semantic spine remains declaration-derived required fields / false-READY correction and downstream command/world/session integration. For Phase F, use the Reflection harvest map rather than building another parser.

For the independent live path: no live submission until Owen resolves/accepts the boundaries in the decision brief; then start with the read-only Account/session falsifier in the live-proof protocol.
