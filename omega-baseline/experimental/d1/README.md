# experimental/d1 — D1 executable specification and port

D1 is the owner-selected first build deliverable (`.project/deliverables/D1-START-HERE.md`). This directory holds its **definition of done as code**: 80 gates under `test/gates/`, one gate group per atomic task, plus the port the gates call.

Everything here is **SIMULATED**: synthetic Worlds, a virtual realization, no Provider, Account, browser or model contact.

## Layout

| Path | Status |
| --- | --- |
| `src/contract.ts` | D1 Port v0 — interface hypothesis (a Lock), replaceable with its gates |
| `src/world.ts` | implemented: loader, provenance enforcement, identity, compatibility |
| `src/session.ts` | implemented: reducer core (revisions, stale suppression, edits, action log) |
| `src/evidence.ts` | implemented: live-evidence predicate |
| `src/digest.ts`, `src/declarations.ts` | implemented |
| `src/validate.ts` | stub — Phase A (D1-004..006) |
| `src/compile.ts` | stub — Phases C/D semantics (D1-020..029, 034) |
| `src/project.ts`, `src/ui.ts` | stubs — Phase E |
| `src/reflection.ts`, `src/help.ts` | stubs — Phase F |
| `src/execute.ts` | stub — Phase G |
| `src/replay.ts`, `src/metrics.ts` | stubs — Phase H |
| `src/launch.ts` | stub — D1-082 (`bun run d1`) |
| `declarations/` | source-native capability/realization/action declarations (Reflection input) |
| `worlds/W0..W5.json` | synthetic fixture Worlds |
| `scenarios/d1-scenarios.json` | metrics corpus |

Each stub throws `NotImplemented[D1-xxx]`, so a red gate names the task that owns it. Start with `cd omega-baseline && bun run ratchet next`.

## Port rules the gates enforce

- The UI dispatches `Action`s only. Typed and clicked Account choices are both `edit` actions and must yield the same `commandDigest`.
- `commandDigest` excludes presentation provenance (`edit.via`, correction revision numbers) and `authority.decision`. It includes World basis, capability, route and params.
- Consent exists only as an explicit `consent` action bound to a command digest. Prose never grants it.
- Receipts carry `evidenceClass: "SIMULATED"` and none of `LIVE_ONLY_KEYS`. `isLiveEvidence` must reject them.
- Required fields come from `declarations/`, and help claims come from extracted Reflection plus World plus state. There is no authored help database.
