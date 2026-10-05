# VOMEGA

VIVIM-Ω is a local semantic operating environment under active development.
The first executable slice stores local records through the existing host, law
and Vault, then recovers them in a fresh process. Each selected vault owns its
data. The browser/provider anchor remains unproven.

On Windows, from this repository:

```powershell
.\scripts\omega.ps1 setup
.\scripts\omega.ps1 quick
.\scripts\omega.ps1 status
.\scripts\omega.ps1 cli call vault.append@1 '{"ns":"notes","id":"welcome","data":{"text":"Continue here"}}' --vault ../.local/my-world --no-daemon --json
.\scripts\omega.ps1 cli call vault.get@1 '{"ns":"notes","id":"welcome"}' --vault ../.local/my-world --no-daemon --json
.\scripts\omega.ps1 cli call vault.verify@1 '{}' --vault ../.local/my-world --no-daemon --json
```

The launcher finds an existing Bun executable and scopes PATH to that invocation.
It changes no global tool or provider configuration. Relative vault paths above
are resolved from `omega-baseline/`. Vaults contain private signing keys as well
as user state; keep them in ignored or external directories.

With working Bun on PATH, other environments can run:

```sh
cd omega-baseline
bun run omega:setup
bun run omega:quick
bun run omega:cli --help
```

The default CLI uses `compositions/local.json`: real local law and canonical
storage, with no provider simulator or missing example plugins. It is a trusted
root-principal developer surface. This slice does not implement natural-language
interaction, a visual environment, durable Work, or authenticated provider action.

`omega:quick` runs compiler binding, Vault, policy and local CLI regressions.
`omega:test` and `omega:gate` run the broad baseline suite, which still fails on
omitted historical support files. These are different proof claims. Absent old
tooling commands were retired rather than replaced with successful placeholders.
The quick slice explicitly excludes browser tests needing missing captures and
driver-parity tests needing missing CI scripts. Warm-daemon behavior is unverified;
the continuity proof and examples use `--no-daemon`.

Fresh sessions start at [.project/SITREP.md](.project/SITREP.md). Product intent
lives in [seed-docs/START-HERE.md](seed-docs/START-HERE.md); current decisions,
evidence, environment and ownership live in `.project/`.
