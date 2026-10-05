// pack.os-taxonomy — frames.ts
// Language data for the command box: every capability as an nlcl-pure OpFrame
// (shape-compatible, declared locally so the pack has no dependency on the
// language engine). Consumed by roadmap task CMD-03 (frames as contributed data).
import type { Capability, ParamSpec } from "./types.ts";

export interface FrameSlotLike {
  role: string; kind: "entity" | "text" | "content" | "enum" | "rest";
  preps?: string[]; entityTypes?: string[]; enumValues?: string[];
  required?: boolean; patient?: boolean; payloadKey?: string;
}
export interface OpFrameLike {
  op: string; verbs: string[]; title: string; family: "/" | "?" | "∆" | "-" | "+";
  slots: FrameSlotLike[]; reading: string; examples: string[];
}

const PREPS: Record<string, string[]> = {
  path: ["in", "at", "from"], destination: ["to", "into"], location: ["in", "under"], level: ["to", "at"],
  minutes: ["for", "in", "after"], steps: ["by"], newName: ["to", "as"], target: ["to", "for"], name: ["called", "named"],
  query: ["for", "about"], engine: ["on", "with", "using"], text: ["saying"], ssid: ["to"],
};

function slotFor(p: ParamSpec, i: number): FrameSlotLike {
  const base = { role: p.name, required: p.required, payloadKey: p.name };
  if (p.type === "enum") return { ...base, kind: "enum", enumValues: p.enum, preps: PREPS[p.name], patient: i === 0 };
  if (p.entity && p.type !== "path") return { ...base, kind: "entity", entityTypes: [p.entity], preps: PREPS[p.name], patient: i === 0 };
  if (p.type === "text" || p.name === "query") return { ...base, kind: i === 0 ? "content" : "rest", patient: i === 0 };
  return { ...base, kind: "text", preps: PREPS[p.name], patient: i === 0 };
}

function family(c: Capability): OpFrameLike["family"] {
  if (c.effect === "observe" || c.effect === "reveal") return "?";
  if (c.effect === "destroy") return "-";
  if (c.effect === "create") return "+";
  if (c.effect === "adjust" || c.effect === "modify") return "∆";
  return "/";
}

export function framesFor(caps: Capability[]): OpFrameLike[] {
  return caps.map((c) => ({
    op: c.op,
    verbs: [...new Set(c.verbs.map((v) => v.toLowerCase()))],
    title: c.title,
    family: family(c),
    slots: c.params.map(slotFor),
    reading: c.params.length ? `${c.title} (${c.params.map((p) => `{${p.name}}`).join(", ")})` : c.title,
    examples: c.examples,
  }));
}
