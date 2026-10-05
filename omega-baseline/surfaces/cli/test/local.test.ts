import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { omegaTmp } from "@vivim/omega-platform";
import { parseRecipe, verifyRecipeSignature } from "@vivim/omega-host";

const CLI = join(import.meta.dir, "../src/cli.ts");
const CHILD_TIMEOUT_MS = 20_000;

interface CallDocument<Value> {
  op: string;
  result: { ok: boolean; value?: Value; error?: string; detail?: string };
}

function scratch(): string {
  return resolve(mkdtempSync(omegaTmp("omega-local test-")));
}

function cleanup(dir: string): void {
  const rel = relative(resolve(omegaTmp()), resolve(dir));
  if (!rel.startsWith("omega-local test-") || rel.includes(sep) || rel.startsWith("..")) {
    throw new Error(`refusing to remove unexpected scratch path: ${dir}`);
  }
  rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

async function runCli<Value = unknown>(vault: string, args: string[]): Promise<{ code: number; doc: CallDocument<Value> }> {
  // Use the running Bun executable, including when PATH points to another shim.
  // Each command has a fresh process and shuts down before the next starts.
  const proc = Bun.spawn([process.execPath, "run", CLI, ...args, "--vault", vault, "--no-daemon", "--json", "--deadline", "5000"], {
    stdin: "ignore", stdout: "pipe", stderr: "pipe",
  });
  const output = [new Response(proc.stdout).text(), new Response(proc.stderr).text()] as const;
  let timer: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error(`CLI exceeded ${CHILD_TIMEOUT_MS}ms: ${args[0]} ${args[1] ?? ""}`));
    }, CHILD_TIMEOUT_MS);
  });
  try {
    const [stdout, stderr, code] = await Promise.race([
      Promise.all([...output, proc.exited]),
      deadline,
    ]);
    if (!stdout.trim()) throw new Error(`CLI exited ${code} without JSON: ${stderr}`);
    return { code, doc: JSON.parse(stdout) };
  } finally {
    clearTimeout(timer!);
    // Reap before the caller removes its scratch store, including on timeout or
    // stream/JSON errors. Draining both pipes leaves no outstanding readers.
    if (proc.exitCode === null) proc.kill("SIGKILL");
    await proc.exited;
    await Promise.allSettled(output);
  }
}

describe("local CLI continuity and selected-store isolation", () => {
  test("fresh process appends; fresh processes read and verify; a second vault is empty", async () => {
    const dir = scratch();
    const a = join(dir, "store A");
    const b = join(dir, "store B");
    const selectedA = relative(process.cwd(), a);
    const selectedB = relative(process.cwd(), b);
    try {
      const data = { text: "persisted through a full process exit", count: 1 };
      const appended = await runCli<{ rev: number; cid: string }>(selectedA, ["call", "vault.append@1", JSON.stringify({ ns: "local", id: "continuity", data })]);
      expect(appended.code).toBe(0);
      expect(appended.doc.result.ok).toBe(true);
      expect(appended.doc.result.value?.rev).toBe(1);

      const pinned = parseRecipe(readFileSync(join(a, "recipe.pinned"), "utf8"));
      expect(pinned.name).toBe("local");
      expect(pinned.composition.map((e) => e.id)).toEqual(["vivim.law", "vivim.vault"]);
      expect(pinned.composition.find((e) => e.id === "vivim.vault")?.config?.dataDir).toBe(join(a, "vault-data"));
      expect(verifyRecipeSignature(pinned)).toBe(true);
      expect(existsSync(join(a, "vault-data", "canonical.sqlite"))).toBe(true);

      const read = await runCli<{ data: unknown; cid: string }>(selectedA, ["call", "vault.get@1", '{"ns":"local","id":"continuity"}']);
      expect(read.code).toBe(0);
      expect(read.doc.result.value?.data).toEqual(data);
      expect(read.doc.result.value?.cid).toBe(appended.doc.result.value?.cid);

      const verified = await runCli<{ ok: boolean; entries: number }>(selectedA, ["call", "vault.verify@1"]);
      expect(verified.code).toBe(0);
      expect(verified.doc.result.value?.ok).toBe(true);
      expect(verified.doc.result.value?.entries).toBe(1);

      const isolated = await runCli(selectedB, ["call", "vault.query@1", '{"ns":"local"}']);
      expect(isolated.code).toBe(0);
      expect(isolated.doc.result.value).toEqual([]);
      const verifiedB = await runCli<{ ok: boolean; entries: number }>(selectedB, ["call", "vault.verify@1"]);
      expect(verifiedB.code).toBe(0);
      expect(verifiedB.doc.result.value?.entries).toBe(0);
      expect(verifiedB.doc.result.value?.ok).toBe(true);
    } finally {
      cleanup(dir);
    }
  }, 110_000);

  test("real law refuses external mutation without consent and unknown operations", async () => {
    const dir = scratch();
    const vault = join(dir, "store");
    const target = join(dir, "refused copy");
    try {
      const refused = await runCli(vault, ["call", "vault.roundtrip@1", JSON.stringify({ targetDir: target })]);
      expect(refused.code).toBe(1);
      expect(refused.doc.result.ok).toBe(false);
      expect(refused.doc.result.error).toBe("REFUSED");
      expect(refused.doc.result.detail).toMatch(/consent required.*consent_[0-9a-f]{16}/i);
      expect(existsSync(target)).toBe(false);

      const unknown = await runCli(vault, ["call", "no.such.op@1"]);
      expect(unknown.code).toBe(1);
      expect(unknown.doc.result.error).toBe("REFUSED");
      expect(unknown.doc.result.detail).toContain("no routed implementation");
    } finally {
      cleanup(dir);
    }
  }, 50_000);
});
