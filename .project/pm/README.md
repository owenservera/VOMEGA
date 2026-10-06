# VOMEGA PM — five selected accelerator programs

Status: **operating, owner-scoped, non-decisioning**.

PM manages exactly the five programs named in [scope.json](scope.json): **MP-21, MP-54, MP-55, MP-56, MP-60**. It may deepen those selected programs; it may not choose/rank/add/remove programs or set product/release priority.

## Active source surfaces

- [scope.json](scope.json) — owner-owned managed set.
- [build-plan.json](build-plan.json) — owner-authored waves/holds/milestone overlay.
- `data/programs/*.json` — dossiers/phases/gates for the five.
- [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md) — implemented PM semantics.
- [EVOLUTION-RULES.md](EVOLUTION-RULES.md) — deepen only when it creates execution leverage.
- `generated/` — deterministic projections; never hand-edit.
- `portfolio-analysis/` — read-only 67-program deliverable/design-intensity analysis; never scope/priority authority.

From `omega-baseline/`: `bun run pm`, `bun run pm:check`, `bun run pm:test`.

## Boundary to execution

PM stops above atomic work. Once acceptance is stateable, implementation/proof belongs to Ratchet/tasks. The acceleration-pack findings are already integrated into `../deliverables/D1-EXECUTION-ACCELERATION-DIRECTIVE.md` and `../ratchet/OPERATING.md`; PM does not need another acceleration subsystem.

The historical first-five seed, correction/setup directives, ZCode PM team/bootstrap docs, reconnaissance and dated reviews are preserved under `../archive/2026-10-06/pm-bootstrap/`. A few machine-referenced original paths remain as archival tombstones.
