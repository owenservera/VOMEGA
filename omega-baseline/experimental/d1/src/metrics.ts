// Scenario suite metrics (D1-074..077). STUB.
// falseReadyRate and wrongTargetRate must be 0 on the canonical suite;
// ambiguityHonesty and revisionStability must be 1.
import type { Scenario, ScenarioReport } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export function runScenarioSuite(scenarios: Scenario[]): ScenarioReport {
  return notImplemented("D1-074", `runScenarioSuite(${scenarios.length} scenarios)`);
}
