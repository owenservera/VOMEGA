# VOMEGA

VIVIM-Ω is a local, sovereign semantic operating environment under active development. The current first-product mission is a small floating Windows command box where setup, routing, help and the first external capability, `prompt.send`, all travel through one explicit semantic command system.

## Fresh session

Do not read the repository as a documentation corpus.

1. Read [AGENTS.md](AGENTS.md).
2. Read [.project/SITREP.md](.project/SITREP.md).
3. If implementing D1, use the Ratchet packet/task and [.project/deliverables/D1-START-HERE.md](.project/deliverables/D1-START-HERE.md).
4. Read broader seed/design material only when the task changes a semantic/product contract or the packet points to it.

The durable product core is indexed in [seed-docs/README.md](seed-docs/README.md). Historical planning, bootstrap and tooling material lives under [.project/archive/](.project/archive/README.md) and is evidence, not current instruction.

## Current executable baseline

From Windows:

```powershell
.\scripts\omega.ps1 setup
.\scripts\omega.ps1 quick
.\scripts\omega.ps1 status
```

From `omega-baseline/` with Bun available:

```sh
bun run omega:setup
bun run omega:quick
bun run ratchet status
```

`omega:quick` proves only its named local slice. Fixture/simulated behavior is never live Provider proof. Current evidence and limitations are in [.project/REALITY.md](.project/REALITY.md).
