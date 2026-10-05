// The D-351 parity rule, scoped to compositions/os.json (the repo-wide net is
// currently blocked by absent historical example plugins): every routed op's
// manifest risk must classify identically in LAW_POLICY_V1.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LAW_POLICY_V1, classifyRisk } from "../../../plugins/vivim-law/src/policy.ts";

test("os composition: manifest risk === law classification for every routed op", () => {
  const m = JSON.parse(readFileSync(join(import.meta.dir, "../plugin.json"), "utf-8"));
  const mismatches = (m.contributions.contract as Array<{ id: string; version: string; risk: string }>)
    .map((c) => ({ op: `${c.id}@${c.version}`, manifest: c.risk, law: classifyRisk(LAW_POLICY_V1, `${c.id}@${c.version}`) }))
    .filter((r) => r.manifest !== r.law);
  expect(mismatches).toEqual([]);
});
