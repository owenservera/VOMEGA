// pack.os-taxonomy end-to-end: boot compositions/os.json on the real µhost with
// real law + Vault and drive capability ops through the gate. Execution stays
// off (execute:false as shipped), so this proves routing, law gating, consent
// and planning — not OS effects (those need a Windows run).
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { bootWithRecovery, compileComposition, ensureVault } from "@vivim/omega-host";
import type { BootedHost } from "@vivim/omega-host";
import type { CompositionSpec, PortResult } from "@vivim/omega-contracts";
import { omegaTmp } from "@vivim/omega-platform";

const ROOT = join(import.meta.dir, "../../..");
let host: BootedHost;

beforeAll(async () => {
  const SPEC = join(ROOT, "compositions/os.json");
  const spec = JSON.parse(readFileSync(SPEC, "utf-8")) as CompositionSpec;
  const root = omegaTmp("omega-os-test", `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(root, { recursive: true, force: true });
  const vaultDir = join(root, "vault");
  mkdirSync(vaultDir, { recursive: true });
  const shipped = JSON.parse(JSON.stringify(spec));
  shipped.entries.find((e: { id: string }) => e.id === "vivim.vault").config.dataDir = join(root, "vault-data");
  const { rootKey } = ensureVault(vaultDir);
  const { buildDir } = compileComposition(shipped, join(SPEC, ".."), vaultDir, rootKey);
  const booted = await bootWithRecovery(vaultDir, join(buildDir, "recipe.json"));
  if (!booted.host) throw new Error(`boot failed: ${booted.report.reason}`);
  host = booted.host;
}, 90_000);
afterAll(async () => { await host?.shutdown().catch(() => {}); }, 20_000);

async function ok<T>(op: string, payload: unknown): Promise<T> {
  const r: PortResult = await host.router.callAsRoot(op, payload);
  if (!r.ok) throw new Error(`${op}: ${r.error} ${r.detail ?? ""}`);
  return r.value as T;
}

describe("os composition through the real host", () => {
  test("catalog lists every capability", async () => {
    const r = await ok<{ count: number }>("os.catalog.list@1", {});
    expect(r.count).toBe(291);
  });
  test("READ capability routes without consent and returns a dry-run plan", async () => {
    const r = await ok<{ outcome: string; executed: boolean; body: string }>("os.r.power.battery.status@1", {});
    expect(r.executed).toBe(false);
    expect(r.outcome).toBe("dry-run");
    expect(r.body).toContain("Win32_Battery");
  });
  test("MUTATION capability is allowed (journaled) and planned", async () => {
    const r = await ok<{ outcome: string; params: Record<string, unknown> }>("os.m.personalize.color-mode.set@1", { params: { mode: "dark" } });
    expect(r.outcome).toBe("dry-run");
    expect(r.params).toEqual({ mode: "dark" });
  });
  test("EXTERNAL_MUTATION capability requires its own consent; granting it does not unlock others", async () => {
    const first = await host.router.callAsRoot("os.x.files.recycle-bin.empty@1", {});
    expect(first.ok).toBe(false);
    if (first.ok) return;
    expect(first.error).toBe("REFUSED");
    const consentId = /consent required: (consent_[0-9a-f]+)/.exec(first.detail ?? "")?.[1];
    expect(consentId).toMatch(/^consent_[0-9a-f]+$/);
    await ok("law.consent.grant@1", { consentId });
    const second = await ok<{ outcome: string }>("os.x.files.recycle-bin.empty@1", {});
    expect(second.outcome).toBe("dry-run");
    const other = await host.router.callAsRoot("os.x.power.device.shutdown@1", {});
    expect(other.ok).toBe(false);
  });
  test("invalid params are refused with an explanation, nothing planned", async () => {
    const r = await ok<{ outcome: string; code: string }>("os.m.display.brightness.set@1", { params: { level: 400 } });
    expect(r.outcome).toBe("refused");
    expect(r.code).toBe("INVALID_PARAMS");
  });
  test("plan op exposes the exact argv", async () => {
    const r = await ok<{ plan: { argv: string[] } }>("os.catalog.plan@1", { capability: "sound.volume.mute" });
    expect(r.plan.argv.slice(0, 2)).toEqual(["powershell.exe", "-NoProfile"]);
  });
});
