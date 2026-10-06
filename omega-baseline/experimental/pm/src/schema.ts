// PM v0 seed schema.
//
// Strict by construction: unknown keys are rejected and the named program-meaning keys
// (name/explanation/objectives/purpose/state/priority/notes/owners) are refused at program
// level, so a *named* meaning field cannot be stored here — those belong to
// .project/meta-tracker.json, which stays canonical.
//
// LIMITATION (honest): the guard is a NAME blacklist, not a semantic one. Meaning can still be
// written into free-text decomposition fields — phases[].outcome, gates[].statement,
// gaps[].statement and softDeps[] — none of which is checked. Those fields describe decomposition,
// and the independent review accepts them as prose, but this is not proof that no meaning is
// duplicated. Do not read it as such.
import { z } from "zod";

/** Effort grade, optionally a range: "E2", "E1-E2", "E4–E5". */
export const EFFORT_PATTERN = /^E[0-5]([–-]E[0-5])?$/;

export const PLAN_LEVELS = ["REGISTERED", "SEEDED", "PHASED", "DECOMPOSED", "EXECUTABLE"] as const;
export type PlanLevel = (typeof PLAN_LEVELS)[number];

export const EVIDENCE_STATES = ["UNPROVEN", "EVIDENCED", "REGRESSED"] as const;
export type EvidenceState = (typeof EVIDENCE_STATES)[number];

export const EVIDENCE_KINDS = ["source-inspected", "prototype-landed", "dependency-changed", "proof", "regressed"] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const LOC_BANDS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

/** Keys that would duplicate canonical program meaning. Checked at program level (phases legitimately have a `name`). */
export const BANNED_KEYS = ["name", "explanation", "objectives", "purpose", "state", "priority", "notes", "owners"] as const;

const Loc = z.strictObject({
  band: z.enum(LOC_BANDS),
  range: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

const Phase = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  outcome: z.string().min(1),
  effort: z.string().regex(EFFORT_PATTERN, "effort must be a grade like E2 or E1-E2"),
  loc: Loc,
  blockedBy: z.array(z.string()).default([]),
  softDeps: z.array(z.string()).default([]),
  exitGates: z.array(z.string()).default([]),
  needsReview: z.boolean().default(false),
});
export type Phase = z.infer<typeof Phase>;

const Gate = z.strictObject({
  id: z.string().min(1),
  statement: z.string().min(1),
  proof: z.string().min(1).default("TBD"),
  consumers: z.array(z.string()).default([]),
  status: z.enum(["TBD", "OPEN", "SATISFIED", "REGRESSED", "SUPERSEDED"]).default("TBD"),
});
export type Gate = z.infer<typeof Gate>;

const Gap = z.strictObject({
  id: z.string().min(1),
  kind: z.enum(["open-question", "defect", "diagram-correction", "risk"]),
  statement: z.string().min(1),
});
export type Gap = z.infer<typeof Gap>;

const Program = z.strictObject({
  /** Optional; compared against derived plan resolution. A mismatch WARNS, it never fails. */
  maturityHint: z.enum(PLAN_LEVELS).optional(),
  phases: z.array(Phase).default([]),
  gates: z.array(Gate).default([]),
  gaps: z.array(Gap).default([]),
  // workPackages is intentionally absent in v0 (see .project/pm/recon/V0-PROPOSAL.md section 2).
});
export type ProgramSeed = z.infer<typeof Program>;

export const Seed = z.strictObject({
  schema: z.literal("vomega-pm/0"),
  programs: z.record(z.string(), Program),
});
export type Seed = z.infer<typeof Seed>;

const EvidenceEvent = z.strictObject({
  program: z.string().min(1),
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

/**
 * Scan for banned meaning keys at the root and at each program object. Strict parsing
 * already rejects them; this exists only to produce a precise, actionable reason.
 * It deliberately does NOT descend into phases/gates, where `name` is structural.
 */
export function bannedProgramKeys(raw: unknown): string[] {
  const out: string[] = [];
  if (!raw || typeof raw !== "object") return out;
  const root = raw as Record<string, unknown>;
  const banned = BANNED_KEYS as readonly string[];
  for (const k of Object.keys(root)) if (banned.includes(k)) out.push(`$.${k}`);
  const programs = root.programs;
  if (programs && typeof programs === "object") {
    for (const [id, p] of Object.entries(programs as Record<string, unknown>)) {
      if (p && typeof p === "object") {
        for (const k of Object.keys(p as Record<string, unknown>)) if (banned.includes(k)) out.push(`$.programs.${id}.${k}`);
      }
    }
  }
  return out;
}
