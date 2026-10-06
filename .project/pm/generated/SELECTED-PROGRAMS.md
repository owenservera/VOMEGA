# PM — Selected Programs

> **Generated — do not hand-edit.** PM manages exactly the five owner-selected programs; the other 62 meta programs stay canonical in `.project/meta-tracker.json` and appear here only as external references.
>
> Source HEAD `5a1df80` · seed digest `854f282c02c3` · regenerate: `bun run pm` · validate: `bun run pm:check` · scope: `.project/pm/scope.json` (owner-directed; see `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md`).

Managed set: **MP-21, MP-54, MP-55, MP-56, MP-60** — 5 programs. Plan resolution: PHASED 5. Evidence: UNPROVEN 5.

PM has no decisioning authority: it does not choose, rank, add, drop, activate or redesign programs. Scope changes only by explicit owner instruction recorded in `.project/pm/scope.json`.

## Why these five (owner decision, not PM's)

The owner selected these five as **development multipliers**: they accelerate work across many other programs rather than serving a single product dependency. MP-21 turns repository structure into source-bound machine-readable self-knowledge; MP-54 and MP-60 consume those stable identities (bundles and impact queries) instead of reparsing the repo; MP-55 and MP-56 convert failures and observed behavior into portable, reproducible test assets that feed MP-60. The selection is recorded in `.project/pm/PM-CORRECTION-FIRST-FIVE-ONLY.md` §1 and §4; PM did not choose it and cannot revisit it.

## How work descends into execution and proof

Phases are planning units. When a phase is selected for execution it descends: phase → work package → task → atomic task → proof. The executable layer in this repository is the **Ω Proof Ratchet** (`omega-baseline/experimental/ratchet/`), which computes task/gate/proof state from a spec and is the atomic execution/proof owner; `pm:check` references its state live and PM never stores a copy. No managed phase is currently scheduled into Ratchet tasks, so no phase below is claimed as running — a green plan is not execution.

| ID | Program | Why it exists (canonical) | Canonical state | Plan | Evidence | Phases | Gates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MP-21 | Self-Knowledge Reflection Migrator / auto-Wiki migration tool | Read the existing codebase, extract structurally provable Reflection, identify gaps, propose safe migrations, and verify compliance. | DESIGN; SKW-L1 performed only the first read-only audit slice. Utility does not exist. | PHASED | UNPROVEN | 5 | 5 |
| MP-54 | Automatic Context Bundles | Give fresh workers compact task-specific context derived from current repo reality. | EXPERIMENT hypothesis. | PHASED | UNPROVEN | 5 | 5 |
| MP-55 | Failure Capsules / reproducible debugging packets | Package failure, environment, changed files and evidence so another worker can reproduce quickly. | EXPERIMENT hypothesis. | PHASED | UNPROVEN | 5 | 5 |
| MP-56 | Trace → Fixture / regression harvesting | Turn live/provider/runtime behavior into privacy-reduced deterministic fixtures and tests. | DESIGN hypothesis, strongly complementary to Provider Lab + Lab. | PHASED | UNPROVEN | 5 | 5 |
| MP-60 | Runtime dependency / impact graph + test selection | Know what a change affects and run the smallest high-confidence evidence loop without weakening merge/release gates. | EXPERIMENT hypothesis. | PHASED | UNPROVEN | 5 | 5 |

