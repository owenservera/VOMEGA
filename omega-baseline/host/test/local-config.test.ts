import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import type { CompositionSpec } from "@vivim/omega-contracts";
import { omegaTmp } from "@vivim/omega-platform";
import { compileComposition, ensureVault, verifyRecipeSignature } from "../src/index.ts";

test("compile binds the selected vault dataDir before signing without mutating the spec", () => {
  const dir = resolve(mkdtempSync(omegaTmp("omega-local config-")));
  try {
    const specDir = join(import.meta.dir, "../../compositions");
    const email: CompositionSpec = JSON.parse(readFileSync(join(specDir, "email.json"), "utf8"));
    const spec: CompositionSpec = {
      name: "local-config-test",
      entries: email.entries.filter((e) => e.id === "vivim.law" || e.id === "vivim.vault"),
    };
    const vaultEntry = spec.entries.find((e) => e.id === "vivim.vault")!;
    vaultEntry.config = { dataDir: "${VAULT}/vault-data", untouched: { value: "${VAULT}" } };
    const original = JSON.stringify(spec);
    const vaultDir = join(dir, "selected vault");
    const { rootKey } = ensureVault(vaultDir);
    const { recipe } = compileComposition(spec, specDir, relative(process.cwd(), vaultDir), rootKey);
    expect(recipe.composition.find((e) => e.id === "vivim.vault")?.config).toEqual({
      dataDir: join(vaultDir, "vault-data"), untouched: { value: "${VAULT}" },
    });
    expect(JSON.stringify(spec)).toBe(original);
    expect(verifyRecipeSignature(recipe)).toBe(true);
    recipe.composition.find((e) => e.id === "vivim.vault")!.config!.dataDir = join(dir, "other");
    expect(verifyRecipeSignature(recipe)).toBe(false);

    for (const dataDir of ["${TMP}/omega-local-fixture/vault-data", "./custom-data"]) {
      vaultEntry.config = { dataDir };
      const compiled = compileComposition(spec, specDir, vaultDir, rootKey).recipe;
      expect(compiled.composition.find((e) => e.id === "vivim.vault")?.config?.dataDir).toBe(dataDir);
    }
  } finally {
    const rel = relative(resolve(omegaTmp()), dir);
    if (!rel.startsWith("omega-local config-") || rel.includes(sep) || rel.startsWith("..")) {
      throw new Error(`refusing to remove unexpected scratch path: ${dir}`);
    }
    rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
