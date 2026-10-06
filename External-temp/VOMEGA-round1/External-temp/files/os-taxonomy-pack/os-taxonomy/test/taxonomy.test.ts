// pack.os-taxonomy — pure tests: database integrity, plan rendering, safety, coverage.
import { describe, expect, test } from "bun:test";
import { CAPABILITIES, COVERAGE, REALIZATIONS, TAXONOMY, byId, coverage, validateDatabase } from "../src/db.ts";
import { plan, psLiteral, PlanError } from "../src/plan.ts";
import { framesFor } from "../src/frames.ts";

const decode = (argv: string[]) => Buffer.from(argv[argv.length - 1]!, "base64").toString("utf16le");

describe("database integrity", () => {
  test("validateDatabase finds no problems", () => { expect(validateDatabase()).toEqual([]); });
  test("every domain is used and every capability is realized on windows", () => {
    for (const d of TAXONOMY.domains) expect(CAPABILITIES.some((c) => c.domain === d.id)).toBe(true);
    const realized = new Set(REALIZATIONS.windows!.map((r) => r.capability));
    expect(CAPABILITIES.filter((c) => !realized.has(c.id)).map((c) => c.id)).toEqual([]);
  });
  test("every inventory task resolves to a capability with a windows realization", () => {
    const c = coverage("windows");
    expect(c.inventory.byFidelity["none"]).toBe(0);
    expect(c.inventory.actionableShare).toBe(1);
  });
  test("every realization renders for its capability's example-shaped params", () => {
    const failures: string[] = [];
    for (const r of REALIZATIONS.windows!) {
      const cap = byId.get(r.capability)!;
      const params: Record<string, unknown> = {};
      for (const p of cap.params) {
        if (!p.required) continue;
        params[p.name] = p.type === "enum" ? p.enum![0] : p.type === "integer" || p.type === "percent" ? (p.min ?? 1) || 1
          : p.type === "boolean" ? true : p.type === "path" ? "~\\Documents\\example.txt" : p.type === "url" ? "https://example.com"
          : p.name === "drive" ? "E:" : p.name === "name" ? "Example" : p.name === "packageId" ? "Example.App" : "example";
      }
      try { plan(cap.id, params, { allowElevation: true }); } catch (e) { failures.push(`${r.id}: ${(e as Error).message}`); }
    }
    expect(failures).toEqual([]);
  });
});

describe("plans are exact, deterministic and inspectable", () => {
  test("dark mode", () => {
    const p = plan("personalize.color-mode.set", { mode: "dark" });
    expect(p.op).toBe("os.m.personalize.color-mode.set@1");
    expect(p.body).toContain("if ('dark' -eq 'light')");
    expect(p.verifyArgv).toBeDefined();
    expect(decode(p.argv)).toContain("ConvertTo-Json -Compress");
  });
  test("determinism: same input ⇒ byte-identical plan", () => {
    expect(JSON.stringify(plan("files.item.rename", { path: "~\\a.txt", newName: "b.txt" })))
      .toBe(JSON.stringify(plan("files.item.rename", { path: "~\\a.txt", newName: "b.txt" })));
  });
  test("enum values map to platform values", () => {
    expect(plan("display.projection.set", { mode: "duplicate" }).body).toContain("'\"' + '/clone' + '\"'");
    expect(plan("power.plan.set", { plan: "balanced" }).body).toContain("'SCHEME_BALANCED'");
  });
  test("~ paths become Join-Path against the user profile", () => {
    expect(plan("files.folder.open", { path: "~\\Projects" }).body).toContain("(Join-Path $env:USERPROFILE 'Projects')");
  });
  test("keys and repeat", () => {
    expect(plan("sound.volume.up", { steps: 3 }).body).toBe("Send-VivimKey 0xAF 3; 'sent'");
    expect(decode(plan("input.emoji.open", {}).argv)).toContain("keybd_event");
    expect(plan("windows.active.snap", { side: "left" }).targetsForeground).toBe(true);
  });
  test("uri parameters are percent-encoded", () => {
    expect(plan("apps.store.search", { query: "a&b c" }).body).toContain("query=a%26b%20c");
  });
  test("builtin-map dispatch", () => {
    expect(plan("apps.builtin.open", { app: "calculator" }).body).toContain("'calc.exe'");
  });
});

describe("safety: values never become code", () => {
  test("single quotes (incl. typographic) are doubled inside literals", () => {
    expect(psLiteral("it's")).toBe("'it''s'");
    expect(psLiteral("it\u2019s")).toBe("'it\u2019\u2019s'");
  });
  test("injection attempt stays a literal", () => {
    const evil = "x'; Remove-Item C:\\ -Recurse; '";
    const body = plan("input.clipboard.set", { text: evil }).body;
    expect(body).toContain("'x''; Remove-Item C:\\ -Recurse; '''");
  });
  test("unknown parameters, bad types, ranges and relative paths are refused", () => {
    const code = (f: () => unknown) => { try { f(); return "none"; } catch (e) { return (e as PlanError).code; } };
    expect(code(() => plan("display.brightness.set", { level: 140 }))).toBe("INVALID_PARAMS");
    expect(code(() => plan("display.brightness.set", { level: 50, extra: 1 }))).toBe("INVALID_PARAMS");
    expect(code(() => plan("files.item.open", { path: "relative\\x.txt" }))).toBe("INVALID_PARAMS");
    expect(code(() => plan("web.url.open", { url: "javascript:alert(1)" }))).toBe("INVALID_PARAMS");
    expect(code(() => plan("network.host.ping", { host: "a; calc" }))).toBe("INVALID_PARAMS");
    expect(code(() => plan("nope.nope.nope", {}))).toBe("UNKNOWN_CAPABILITY");
  });
  test("admin-only capabilities refuse without allowElevation", () => {
    try { plan("maintenance.system-files.repair", {}); throw new Error("should refuse"); }
    catch (e) { expect((e as PlanError).code).toBe("NEEDS_ELEVATION"); }
  });
  test("elevation falls through to a non-admin alternative when one exists", () => {
    expect(plan("network.wifi.toggle", { state: "off" }).strategy).toBe("uri");
    expect(plan("network.wifi.toggle", { state: "off" }, { allowElevation: true }).strategy).toBe("run");
  });
  test("opening a file refuses executables", () => {
    expect(plan("files.item.open", { path: "C:\\x.pdf" }).body).toContain("refusing to launch an executable");
  });
  test("risk classes: destructive, session-ending and network capabilities need consent", () => {
    for (const id of ["files.item.delete", "files.recycle-bin.empty", "power.device.shutdown", "apps.app.uninstall", "web.url.open", "network.wifi.password"]) {
      expect(byId.get(id)!.risk).toBe("EXTERNAL_MUTATION");
    }
    expect(byId.get("power.battery.status")!.risk).toBe("READ");
  });
});

describe("language frames", () => {
  test("one frame per capability, ops match, enum slots carry values", () => {
    const f = framesFor(CAPABILITIES);
    expect(f.length).toBe(CAPABILITIES.length);
    const dm = f.find((x) => x.op === "os.m.personalize.color-mode.set@1")!;
    expect(dm.slots[0]!.enumValues).toEqual(["dark", "light"]);
  });
});

test("coverage report (informational)", () => {
  const c = coverage("windows");
  console.log(JSON.stringify({ capabilities: c.capabilities, fidelity: c.realizationFidelity, inventory: c.inventory, tasks: COVERAGE.tasks.length }));
  expect(c.inventory.exactShare).toBeGreaterThan(0.5);
});
