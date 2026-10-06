// Manifest/composition are derived from the database — drift fails here.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildComposition, buildManifest } from "../src/manifest.ts";
import { parseManifest, validateManifest } from "@vivim/omega-sdk";

const PACK = join(import.meta.dir, "..");
describe("derived artifacts", () => {
  test("plugin.json equals the generated manifest (run scripts/generate.ts)", () => {
    expect(JSON.parse(readFileSync(join(PACK, "plugin.json"), "utf-8"))).toEqual(buildManifest());
  });
  test("compositions/os.json equals the generated composition", () => {
    expect(JSON.parse(readFileSync(join(PACK, "../../compositions/os.json"), "utf-8"))).toEqual(buildComposition());
  });
  test("manifest passes the sdk validator", () => {
    const parsed = parseManifest(readFileSync(join(PACK, "plugin.json"), "utf-8"));
    if (!parsed.ok) throw new Error(parsed.errors.join("; "));
    expect(validateManifest(parsed.value)).toEqual([]);
  });
});
