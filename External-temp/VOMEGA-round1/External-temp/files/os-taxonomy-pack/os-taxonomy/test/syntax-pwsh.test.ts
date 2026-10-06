// Every rendered realization (and verify probe) must parse as PowerShell —
// checked with the real parser, nothing executed. Runs when VIVIM_PWSH is set.
import { expect, test } from "bun:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { byId, REALIZATIONS } from "../src/db.ts";
import { plan, wrapScript } from "../src/plan.ts";
import { runArgv } from "../src/execute.ts";

const PWSH = process.env["VIVIM_PWSH"];
(PWSH ? test : test.skip)("all rendered scripts parse", async () => {
  const scripts: Record<string, string> = {};
  for (const r of REALIZATIONS.windows!) {
    const cap = byId.get(r.capability)!;
    const params: Record<string, unknown> = {};
    for (const p of cap.params) {
      params[p.name] = p.type === "enum" ? p.enum![0] : p.type === "integer" || p.type === "percent" ? Math.max(1, p.min ?? 1)
        : p.type === "boolean" ? true : p.type === "path" ? "~\\Documents\\a b.txt" : p.type === "url" ? "https://example.com"
        : p.name === "drive" ? "E:" : p.name === "packageId" ? "Example.App" : p.name === "host" ? "example.com" : p.pattern ? "Example" : "it's \u2019x";
    }
    // render this specific realization by forcing preference order
    const others = REALIZATIONS.windows!.filter((x) => x.capability === r.capability);
    const saved = others.map((x) => x.preference);
    others.forEach((x) => (x.preference = x === r ? 0 : 9));
    try {
      const p = plan(cap.id, params, { allowElevation: true });
      scripts[r.id] = p.script;
      if (r.verify) scripts[r.id + "#verify"] = wrapScript(r.verify.replace(/\{\{(\w+)\}\}/g, "'E:'"));
    } finally { others.forEach((x, i) => (x.preference = saved[i]!)); }
  }
  const file = join(tmpdir(), `vivim-os-scripts-${Date.now()}.json`);
  writeFileSync(file, JSON.stringify(scripts));
  const checker = `$s = Get-Content -Raw -LiteralPath '${file}' | ConvertFrom-Json; $bad = @(); foreach ($p in $s.PSObject.Properties) { $e = $null; [void][System.Management.Automation.Language.Parser]::ParseInput($p.Value, [ref]$null, [ref]$e); if ($e.Count) { $bad += ($p.Name + ': ' + $e[0].Message) } }; @{ ok = $true; value = @{ checked = @($s.PSObject.Properties).Count; bad = $bad } } | ConvertTo-Json -Compress -Depth 4`;
  const r = await runArgv([PWSH!, "-NoProfile", "-NonInteractive", "-Command", checker], 120_000);
  expect(r.outcome).toBe("completed");
  const v = r.value as { checked: number; bad: string[] };
  console.log(`parsed ${v.checked} scripts`);
  expect(v.bad).toEqual([]);
  expect(v.checked).toBeGreaterThanOrEqual(REALIZATIONS.windows!.length);
}, 180_000);
