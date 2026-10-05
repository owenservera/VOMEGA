# pack.os-taxonomy — VIVIM OS Capability Taxonomy

A **platform-neutral, human-friendly library of everyday operating-system
capabilities**, with **Windows as the first implementation**. Installed as an Ω
plugin, every capability becomes a routed, law-gated, plannable and (when
enabled) executable operation that the floating command box, CLI, MCP or agents
can call through the same path.

```
capability (global meaning)          realization (one platform's way)
files.recycle-bin.empty      ──────▶ windows: powershell  Clear-RecycleBin -Force
display.brightness.set{level} ─────▶ windows: powershell  WmiSetBrightness …
display.night-light.settings ──────▶ windows: uri         ms-settings:nightlight   (hand-off)
                             ──────▶ macos:   (future file data/realizations/macos.json)
```

## What is in the database

| | |
| --- | --- |
| Capabilities | **291** across **25 domains** (power, display, sound, media, network, devices, files, storage, apps, windows, input, personalize, a11y, privacy, security, accounts, time, language, notify, capture, web, search, updates, system, maintenance) |
| Windows realizations | **305** (preferred: 173 exact · 10 approximate · 108 hand-off) |
| Average-user inventory | **164** typical tasks → capability; 100% actionable, 68% exact |
| Evidence | every realization is `authored` — **none executed on Windows yet** |

Source of truth is JSON in `data/` (diffable, reviewable):

- `data/taxonomy.json` — domains, effect→risk/consent table, tiers, param types, strategies, fidelity and evidence vocabularies
- `data/capabilities.json` — the global library (id, title, verbs, examples, typed params, effect, risk, inverse, privacy, portability)
- `data/realizations/windows.json` — Windows implementations (strategy, spec, fidelity, elevation, OS versions, param maps, verify probes, notes)
- `data/coverage-corpus.json` — the average-user task inventory used as the coverage yardstick

Derived: `plugin.json`, `../../compositions/os.json` (`scripts/generate.ts`),
`CATALOG.md` (`scripts/catalog.ts`), `dist/os-taxonomy.sqlite`
(`scripts/build-sqlite.ts` — tables, FTS search, `capability_platform` view).

## Design rules

1. **Capability ≠ realization.** Ids are `<domain>.<object>.<action>` and never
   mention a platform. A platform contributes a realization file; nothing else changes.
2. **Risk comes from the effect**, not from taste: observe→READ;
   present/adjust/create/modify/session-pause→MUTATION (allowed, journaled);
   destroy/session-end/system/network/reveal/physical→EXTERNAL_MUTATION (consent).
3. **One op per capability**: `os.<r|m|x>.<capability>@1`. Ω consent ids hash
   (principal, op), so consenting to "empty recycle bin" does not consent to "shut down".
   The risk letter in the op lets the law classify by prefix (policy 1.9.0).
4. **Honest fidelity.** `handoff` opens the right place for the user and VIVIM
   never claims the change happened; `approximate` (e.g. volume via key steps) says so.
5. **Values never become code.** Every parameter is type/range/pattern-checked
   and reaches PowerShell only as a single-quoted literal (typographic quotes
   included) or a fixed `Join-Path $env:USERPROFILE` expression for `~` paths.
6. **Fail closed.** Unknown params, admin-only realizations without
   `allowElevation`, executables via `files.item.open` → refused with a reason.
7. **Attempt before effect.** Non-READ executions write an attempt row to vault
   ns `os` before running and an outcome row after (digests, not raw values).
   A timeout is `uncertain`, never success.

## Using it

```sh
bun run omega:cli call os.catalog.list@1 '{"domain":"display"}' --composition compositions/os.json
bun run omega:cli call os.catalog.plan@1 '{"capability":"personalize.color-mode.set","params":{"mode":"dark"}}' …
bun run omega:cli call os.m.personalize.color-mode.set@1 '{"params":{"mode":"dark"}}' …   # dry-run unless execute:true
```

Shipped config is safe: `execute:false`. To act on a Windows machine, set
`execute:true` (and optionally `osVersion`, `allowElevation`, `timeoutMs`) in the
signed composition. Keyboard realizations (`targetsForeground`) act on the
focused window — the floating box must hide and return focus first.

## Proof status

| Claim | Status |
| --- | --- |
| Database integrity, derived manifest/composition, SQLite | verified-local (tests) |
| Boots on real host; law gates READ/MUTATION/EXTERNAL; per-capability consent | verified-local (`test/e2e.test.ts`) |
| All 305 scripts + 3 verify probes parse as PowerShell | verified with pwsh 7.4 parser (`VIVIM_PWSH=… bun test`) |
| Execution wrapper, JSON framing, failure capture, injection safety, timeout⇒uncertain | verified with pwsh 7.4 on Linux |
| Windows-specific effects of each realization | **unproven** — needs a Windows run per realization (promote `evidence` to `verified-local`) |
