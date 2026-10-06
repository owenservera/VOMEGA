// PM program-file schema — vomega-pm-program/1.
//
// Owner correction (PM-CORRECTION-FIRST-FIVE-ONLY.md): PM manages EXACTLY five programs
// and must carry a full Program Dossier for each. So, unlike v0, meaning fields ARE owned
// here — but only for the managed five, and only in `dossier.*`. The canonical tracker
// fields (name/purpose/state/priority/owners/notes) stay canonical and are read from
// .project/meta-tracker.json, never duplicated in these files.
//
// One file per managed program, in .project/pm/data/programs/. The managed set itself is
// declared in .project/pm/scope.json and enforced by the validator: a program file outside
// scope, or a scope program with no file, is a failure.
import { z } from "zod";

/** Effort grade, optionally a range: "E2", "E1-E2", "E4–E5". */
export const EFFORT_PATTERN = /^E[0-5]([–-]E[0-5])?$/;

export const PLAN_LEVELS = ["REGISTERED", "SEEDED", "PHASED", "DECOMPOSED", "EXECUTABLE"] as const;
export type PlanLevel = (typeof PLAN_LEVELS)[number];

export const EVIDENCE_STATES = ["NO_LINKED_PROOF", "PROOF_LINKED", "REGRESSION_REPORTED"] as const;
export type EvidenceState = (typeof EVIDENCE_STATES)[number];

export const EVIDENCE_KINDS = ["source-inspected", "prototype-landed", "dependency-changed", "proof", "regressed"] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const LOC_BANDS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

/**
 * Canonical-tracker fields that must not be duplicated into a PM program file. Meaning
 * fields (explanation/objectives/vision) are NOT banned any more — the owner correction
 * requires them in the dossier — but they live only under `dossier.*`.
 */
export const BANNED_KEYS = ["name", "purpose", "state", "priority", "owners", "notes"] as const;

const Loc = z.strictObject({
  band: z.enum(LOC_BANDS),
  range: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

const Phase = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  objective: z.string().min(1),
  outcome: z.string().min(1),
  effort: z.string().regex(EFFORT_PATTERN, "effort must be a grade like E2 or E1-E2"),
  loc: Loc,
  blockedBy: z.array(z.string()).default([]),
  softDeps: z.array(z.string()).default([]),
  exitGates: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),
  needsReview: z.boolean().default(false),
});
export type Phase = z.infer<typeof Phase>;

const Gate = z.strictObject({
  id: z.string().min(1),
  producingPhase: z.string().min(1),
  statement: z.string().min(1),
  evidence: z.string().min(1),
  status: z.enum(["TBD", "OPEN", "SATISFIED", "REGRESSED", "SUPERSEDED"]).default("TBD"),
  consumers: z.array(z.string()).default([]),
});
export type Gate = z.infer<typeof Gate>;

const Dossier = z.strictObject({
  explanation: z.string().min(1),
  problem: z.string().min(1),
  objectives: z.array(z.string()).min(4).max(8),
  visionContribution: z.string().min(1),
  boundaries: z.array(z.string()).min(1),
  successConditions: z.array(z.string()).min(1),
  falsifiers: z.array(z.string()).min(1),
  sources: z.array(z.string()).min(1),
});
export type Dossier = z.infer<typeof Dossier>;

const Gap = z.strictObject({
  id: z.string().min(1),
  kind: z.enum(["open-question", "defect", "diagram-correction", "risk"]),
  statement: z.string().min(1),
});
export type Gap = z.infer<typeof Gap>;

const ExternalDependency = z.strictObject({
  /** A META-TRACKER program id that is NOT in managed scope; referenced only, never managed. */
  ref: z.string().min(1),
  reason: z.string().min(1),
});
export type ExternalDependency = z.infer<typeof ExternalDependency>;

export const ProgramFile = z.strictObject({
  schema: z.literal("vomega-pm-program/1"),
  id: z.string().regex(/^MP-\d{2}$/),
  dossier: Dossier,
  externalDependencies: z.array(ExternalDependency).default([]),
  phases: z.array(Phase).min(1),
  gates: z.array(Gate),
  gaps: z.array(Gap).default([]),
});
export type ProgramFile = z.infer<typeof ProgramFile>;

export const Scope = z.object({
  schema: z.literal("vomega-pm-scope/0"),
  managedPrograms: z.array(z.string().regex(/^MP-\d{2}$/)).min(1),
});
export type Scope = z.infer<typeof Scope>;

const EvidenceEvent = z.strictObject({
  program: z.string().regex(/^MP-\d{2}$/),
  gate: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kind: z.enum(EVIDENCE_KINDS),
  ref: z.string().min(1),
});
export type EvidenceEvent = z.infer<typeof EvidenceEvent>;

export const Events = z.strictObject({
  schema: z.literal("vomega-pm-events/0"),
  events: z.array(EvidenceEvent).default([]),
});
export type Events = z.infer<typeof Events>;

/** Assembled managed set: validated program files keyed by id. */
export interface ManagedSet {
  programs: Record<string, ProgramFile>;
}

/**
 * Canonical-tracker fields must not leak into a program file. Strict parsing already
 * rejects unknown keys; this scan exists only to produce a precise, actionable reason.
 * It checks the file root only — `dossier.*` legitimately owns meaning fields, and
 * `phases[].name` is structural.
 */
export function bannedRootKeys(raw: unknown): string[] {
  const out: string[] = [];
  if (!raw || typeof raw !== "object") return out;
  const banned = BANNED_KEYS as readonly string[];
  for (const k of Object.keys(raw as Record<string, unknown>)) if (banned.includes(k)) out.push(`$.${k}`);
  return out;
}
