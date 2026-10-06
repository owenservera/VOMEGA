// Execution-path proof with a real PowerShell (pwsh) — runs only when VIVIM_PWSH
// points at a pwsh binary. Proves the wrapper, -EncodedCommand transport, JSON
// result framing, failure capture, injection safety and the timeout ⇒ uncertain
// rule. It does NOT prove Windows-specific cmdlets/effects (needs Windows).
import { describe, expect, test } from "bun:test";
import { plan, powershellArgv, wrapScript } from "../src/plan.ts";
import { runArgv } from "../src/execute.ts";

const PWSH = process.env["VIVIM_PWSH"];
const d = PWSH ? describe : describe.skip;
const swap = (argv: string[]) => [PWSH!, ...argv.slice(1).filter((a) => a !== "-ExecutionPolicy" && a !== "Bypass")];

d("execution path through real PowerShell", () => {
  test("time.now.show returns a structured value", async () => {
    const r = await runArgv(swap(plan("time.now.show", {}).argv), 30_000);
    expect(r.outcome).toBe("completed");
    expect(typeof r.value).toBe("string");
  });
  test("thrown errors come back as failed with the message", async () => {
    const r = await runArgv(swap(powershellArgv(wrapScript("throw 'boom'"))), 30_000);
    expect(r.outcome).toBe("failed");
    expect(r.error).toBe("boom");
  });
  test("an injection payload is data, not code", async () => {
    const evil = "x'; Write-Output PWNED; '";
    const r = await runArgv(swap(powershellArgv(wrapScript(`$t = ${"'" + evil.replace(/'/g, "''") + "'"}; $t`))), 30_000);
    expect(r.value).toBe(evil);
  });
  test("timeout is reported as uncertain, never success", async () => {
    const r = await runArgv(swap(powershellArgv(wrapScript("Start-Sleep -Seconds 20; 'late'"))), 1500);
    expect(r.outcome).toBe("uncertain");
  });
  test("planned file creation really creates the file", async () => {
    const p = `/tmp/vivim-os-${Date.now()}.txt`;
    const pl = plan("files.file.create", { path: "C:\\placeholder.txt", text: "hi" });
    const body = pl.body.replaceAll("'C:\\placeholder.txt'", `'${p}'`);
    const r = await runArgv(swap(powershellArgv(wrapScript(body))), 30_000);
    expect(r.outcome).toBe("completed");
    expect(await Bun.file(p).text()).toBe("hi");
  });
});
