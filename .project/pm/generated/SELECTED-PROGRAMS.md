# PM — Selected Programs

> **Generated — do not hand-edit.** PM manages exactly the five owner-selected programs; the other 62 meta programs stay canonical in `.project/meta-tracker.json` and appear here only as external references.
>
> Source HEAD `65ecc7f` · seed digest `854f282c02c3` · regenerate: `bun run pm` · validate: `bun run pm:check` · scope: `.project/pm/scope.json` (owner-directed; see `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md`).

Managed set: **MP-21, MP-54, MP-55, MP-56, MP-60** — 5 programs.

| Dimension | Reading |
| --- | --- |
| PM plan resolution | PHASED 5 — how deep PM plans each program |
| PM evidence coverage | NO_LINKED_PROOF 5 — whether PM holds a **linked proof record**; *not* a claim about the project's evidence state |
| Execution | not linked — no managed phase is scheduled into the Ratchet |

Canonical state and real evidence live outside PM: current program state is read from `.project/meta-tracker.json`; execution and proof are owned by the Ω Proof Ratchet.

## How PM scope expands

**Only the owner (Owen) changes the managed set**, by editing `.project/pm/scope.json` and recording the instruction (see [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) §19). PM cannot add, remove, rank or propose a program: `pm:check` fails if scope and program files disagree (`OUT_OF_SCOPE_PROGRAM`, `MISSING_PROGRAM`, `UNKNOWN_MANAGED_PROGRAM`), and no view, score or suggestion changes scope. A newly added program earns a full dossier before it receives phases or gates.

## Why these five (owner decision, not PM's)

The owner selected these five as **development multipliers**: they accelerate work across many other programs rather than serving a single product dependency. MP-21 turns repository structure into source-bound machine-readable self-knowledge; MP-54 and MP-60 consume those stable identities (bundles and impact queries) instead of reparsing the repo; MP-55 and MP-56 convert failures and observed behavior into portable, reproducible test assets that feed MP-60. The selection is recorded in `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md` §1 and §4; PM did not choose it and cannot revisit it.

## How work descends into execution and proof

Phases are planning units. When a phase is selected for execution it descends: phase → work package → task → atomic task → proof. The executable layer in this repository is the **Ω Proof Ratchet** (`omega-baseline/experimental/ratchet/`), which computes task/gate/proof state from a spec and is the atomic execution/proof owner; `pm:check` references its state live and PM never stores a copy. No managed phase is currently scheduled into Ratchet tasks, so no phase below is claimed as running — a green plan is not execution.

| ID | Program | Canonical state (META-TRACKER) | PM plan | Execution | PM evidence coverage | Phases | Gates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MP-21 | Self-Knowledge Reflection Migrator / auto-Wiki migration tool | DESIGN; SKW-L1 performed only the first read-only audit slice. Utility does not exist. | PHASED | not linked | NO_LINKED_PROOF | 5 | 5 |
| MP-54 | Automatic Context Bundles | EXPERIMENT hypothesis. | PHASED | not linked | NO_LINKED_PROOF | 5 | 5 |
| MP-55 | Failure Capsules / reproducible debugging packets | EXPERIMENT hypothesis. | PHASED | not linked | NO_LINKED_PROOF | 5 | 5 |
| MP-56 | Trace → Fixture / regression harvesting | DESIGN hypothesis, strongly complementary to Provider Lab + Lab. | PHASED | not linked | NO_LINKED_PROOF | 5 | 5 |
| MP-60 | Runtime dependency / impact graph + test selection | EXPERIMENT hypothesis. | PHASED | not linked | NO_LINKED_PROOF | 5 | 5 |

