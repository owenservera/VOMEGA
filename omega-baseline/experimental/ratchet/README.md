# experimental/ratchet

Executable build control for VOMEGA deliverables: gates, computed task state, worker packets, fan-out, drift facts and generated projections. Design: `.project/ratchet/DESIGN.md`. How to use: `.project/ratchet/OPERATING.md`.

| Path | Purpose |
| --- | --- |
| `src/gate.ts` | `gate(task, name, body)` for `bun:test` (ratchet/probe modes) |
| `src/taskgraph.ts` | Markdown task tables → dependency graph with critical-path weights |
| `src/probe.ts` | Runs gates with the JUnit reporter → per-gate observations |
| `src/state.ts` | Computed task states (OPEN … DONE, REGRESSED) |
| `src/lock.ts`, `src/claims.ts` | Promotions/reviews/supersessions; lease claims |
| `src/packet.ts` | Worker packets and disjoint fan-out |
| `src/project.ts` | Board, evidence summary, hash-chained local ledger |
| `src/drift.ts` | Executable facts asserted by project documents |
| `src/cli.ts` | `bun run ratchet …` |
| `specs/d1/` | D1 spec (bindings, write surfaces, artifacts) and its lock |
| `specs/facts.json` | Drift facts |

Experimental and replaceable. Zero dependencies beyond Bun and `node:*`. No workspace or lockfile change.
