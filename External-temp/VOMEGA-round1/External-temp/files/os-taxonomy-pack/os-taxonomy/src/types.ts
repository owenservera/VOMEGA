// pack.os-taxonomy — types.ts
// The shapes of the VIVIM OS capability taxonomy. Zero runtime imports.
// Capability = platform-neutral, human-friendly meaning (the global library).
// Realization = one platform's way of performing it (Windows today).

export type RiskClass = "READ" | "MUTATION" | "EXTERNAL_MUTATION";
export type Effect =
  | "observe" | "present" | "adjust" | "create" | "modify" | "session-pause"
  | "destroy" | "session-end" | "system" | "network" | "reveal" | "physical";
export type Tier = "core" | "common" | "occasional";
export type ParamType = "string" | "text" | "integer" | "percent" | "boolean" | "enum" | "path" | "url";
export type Strategy = "uri" | "launch" | "run" | "powershell" | "keys" | "builtin-map";
export type Fidelity = "exact" | "approximate" | "handoff";
export type Elevation = "none" | "admin";

export interface ParamSpec {
  name: string;
  type: ParamType;
  required: boolean;
  description: string;
  enum?: string[];
  min?: number;
  max?: number;
  unit?: string;
  default?: unknown;
  pattern?: string;
  entity?: string; // grounding entity type for the language layer (file, app, printer, wifi-network …)
}

export interface Capability {
  id: string;          // <domain>.<object>.<action>
  domain: string;
  op: string;          // os.<r|m|x>.<id>@1 — the routed Ω op
  risk: RiskClass;
  consent: "none" | "confirm";
  title: string;
  summary: string;
  effect: Effect;
  tier: Tier;
  verbs: string[];
  examples: string[];
  params: ParamSpec[];
  inverse?: string;
  privacy: "none" | "personal" | "sensitive";
  portability: "universal" | "desktop" | "platform-specific";
  related?: string[];
}

export interface RealizationBase {
  strategy: Strategy;
  spec: Record<string, unknown>;
  fidelity: Fidelity;
  elevation: Elevation;
  os: string[];
  note?: string;
  verify?: string;
  paramMap?: Record<string, Record<string, string>>;
  targetsForeground?: boolean;
}

export interface Realization extends RealizationBase {
  id: string;            // <platform>:<capability>[#n]
  capability: string;
  platform: string;
  preference: number;    // 1 = preferred
  evidence: "authored" | "verified-local" | "regressed";
}

export interface Domain { id: string; title: string; summary: string }

export interface Taxonomy {
  taxonomyVersion: string;
  name: string;
  status: string;
  domains: Domain[];
  effects: Record<Effect, { risk: RiskClass; consent: "none" | "confirm"; meaning: string }>;
  [k: string]: unknown;
}

export interface Plan {
  capability: string;
  op: string;
  platform: string;
  realizationId: string;
  strategy: Strategy;
  fidelity: Fidelity;
  elevation: Elevation;
  targetsForeground: boolean;
  note?: string;
  params: Record<string, unknown>;
  body: string;            // human-readable PowerShell body (what will run)
  script: string;          // full wrapped script
  argv: string[];          // exact process invocation
  verifyArgv?: string[];
}
