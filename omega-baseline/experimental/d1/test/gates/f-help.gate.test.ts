// Phase F — grounded contextual help + minimal Reflection (D1-050..059B).
import { describe, expect } from "bun:test";
import { commandDigest, currentCommand, digest, digestText, dispatch, extractReflection, help, project, REFLECTION_BOUNDARY, reflectionSources } from "../../src/index.ts";
import type { HelpAnswer, HelpQuestion, ReflectionGraph, SourceFile } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { ambiguous, says, start } from "./_helpers.ts";

const QUESTIONS: HelpQuestion[] = ["what-is-provider", "which-accounts", "why-choose", "what-is-capability", "what-leaves-boundary", "what-is-simulated", "why-ready"];
const CAP = "experimental/d1/declarations/prompt.send.capability.json";

function mutate(sources: SourceFile[], path: string, fn: (j: Record<string, unknown>) => void): SourceFile[] {
  return sources.map((s) => {
    if (s.path !== path) return s;
    const j = JSON.parse(s.text) as Record<string, unknown>;
    fn(j);
    return { path: s.path, text: JSON.stringify(j, null, 2) + "\n" };
  });
}
function pointerGet(text: string, pointer: string): unknown {
  let cur: unknown = JSON.parse(text);
  for (const seg of pointer.split("/").slice(1).map((x) => x.replaceAll("~1", "/").replaceAll("~0", "~"))) cur = (cur as Record<string, unknown>)[seg];
  return cur;
}
const groundedOnReflection = (a: HelpAnswer, item: string) => a.claims.some((c) => c.grounds.some((g) => g.kind === "reflection" && g.item === item));
const executed = () => {
  let s = says(ambiguous(), "use Work");
  s = dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(s)!) });
  return dispatch(dispatch(s, { type: "commit" }), { type: "execute" });
};

describe("Phase F — Reflection and contextual help", () => {
  gate("D1-050", "capability help is grounded on the declaration source, not authored text", () => {
    const a = help(ambiguous(), "what-is-capability");
    const g = a.claims.flatMap((c) => c.grounds).filter((x) => x.kind === "reflection");
    expect(g.length).toBeGreaterThan(0);
    for (const x of g) if (x.kind === "reflection") expect(x.anchor.path).toMatch(/^experimental\/d1\/declarations\//);
  });

  gate("D1-051", "active Account ambiguity ranks why-choose first", () => {
    expect(project(ambiguous()).help[0]).toBe("why-choose");
  });

  gate("D1-052", "every canonical journey question answers with grounded claims", () => {
    const s = executed();
    for (const q of QUESTIONS) {
      const a = help(s, q);
      expect(a.question).toBe(q);
      expect(a.claims.length).toBeGreaterThan(0);
      for (const c of a.claims) expect(c.grounds.length).toBeGreaterThan(0);
    }
  });

  gate("D1-052", "which-accounts answers from the current World", () => {
    const s = ambiguous();
    const a = help(s, "which-accounts");
    const records = a.claims.flatMap((c) => c.grounds).filter((g) => g.kind === "world").map((g) => (g.kind === "world" ? g.record : ""));
    for (const acct of s.world.accounts) expect(records).toContain(acct.id);
  });

  gate("D1-053", "removing the capability from the sources removes help claims about it", () => {
    const without = reflectionSources().filter((s) => s.path !== CAP);
    const a = help(ambiguous(), "what-is-capability", extractReflection(without));
    expect(groundedOnReflection(a, "prompt.send@1")).toBe(false);
    expect(a.unknowns.join(" ")).toContain("prompt.send@1");
  });

  gate("D1-054", "SIMULATED explanation is grounded on the actual receipt", () => {
    const s = executed();
    const a = help(s, "what-is-simulated");
    expect(a.claims.some((c) => c.grounds.some((g) => g.kind === "state" && g.field.startsWith("receipt")))).toBe(true);
    expect(a.claims.map((c) => c.text).join(" ")).toMatch(/not|never/i);
  });

  gate("D1-055", "extraction boundary is declared and enforced", () => {
    expect(REFLECTION_BOUNDARY.inputs.length).toBeGreaterThan(0);
    const g = extractReflection([{ path: "plugins/vivim-law/src/index.ts", text: "export const x = 1;" }]);
    expect(g.items).toEqual([]);
    expect(g.gaps.some((x) => /boundary/i.test(x.missing))).toBe(true);
  });

  gate("D1-056", "anchors bind to exact source digests; changed source changes the binding", () => {
    const src = reflectionSources();
    const g1 = extractReflection(src);
    const cap = g1.items.find((i) => i.id === "prompt.send@1")!;
    expect(cap.anchor.path).toBe(CAP);
    expect(cap.anchor.digest).toBe(digestText(src.find((s) => s.path === CAP)!.text));
    expect(extractReflection(reflectionSources()).digest).toBe(g1.digest);
    const g2 = extractReflection(mutate(src, CAP, (j) => { j["summary"] = "changed"; }));
    expect(g2.items.find((i) => i.id === "prompt.send@1")!.anchor.digest).not.toBe(cap.anchor.digest);
  });

  gate("D1-057", "extractor emits capability, required parameters, realization and action facts", () => {
    const g = extractReflection(reflectionSources());
    const ids = g.items.map((i) => `${i.kind}:${i.id}`);
    for (const want of ["capability:prompt.send@1", "realization:d1-virtual.prompt.send@1", "action:account.select@1"]) expect(ids).toContain(want);
    const params = g.items.filter((i) => i.kind === "parameter" && g.edges.some((e) => e.from === "prompt.send@1" && e.to === i.id && e.rel === "has-param"));
    const req = params.filter((p) => p.facts["required"] === true).map((p) => p.facts["name"]).sort();
    expect(req).toEqual(["account", "prompt"]);
  });

  gate("D1-057", "every reflected fact is copied from its anchor, never invented", () => {
    const src = reflectionSources();
    const g = extractReflection(src);
    for (const item of g.items) {
      const file = src.find((s) => s.path === item.anchor.path);
      expect(file).toBeDefined();
      const at = pointerGet(file!.text, item.anchor.pointer) as Record<string, unknown> | undefined;
      const anchor = at && typeof at === "object" ? (at as Record<string, unknown>) : undefined;
      for (const [k, v] of Object.entries(item.facts)) {
        // A fact whose key is absent from the anchor is fabricated; it must fail, not be skipped.
        expect(anchor && k in anchor).toBe(true);
        expect(anchor![k]).toEqual(v);
      }
    }
  });

  gate("D1-058", "Reflection Graph is read-only and links capability to params, realization and consequence", () => {
    const g: ReflectionGraph = extractReflection(reflectionSources());
    expect(g.readOnly).toBe(true);
    expect(Object.isFrozen(g)).toBe(true);
    expect(Object.isFrozen(g.items)).toBe(true);
    for (const rel of ["has-param", "realized-by", "has-consequence"]) expect(g.edges.some((e) => e.from === "prompt.send@1" && e.rel === rel)).toBe(true);
    const { digest: d, ...rest } = g;
    expect(d).toBe(digest(rest));
  });

  gate("D1-059", "help is driven by Reflection + World + active state together", () => {
    const a = help(ambiguous(), "why-choose");
    const kinds = new Set(a.claims.flatMap((c) => c.grounds.map((g) => g.kind)));
    for (const k of ["reflection", "world", "state"]) expect(kinds.has(k as "world")).toBe(true);
  });

  gate("D1-059A", "making account optional in the source changes the why-choose answer", () => {
    const base = extractReflection(reflectionSources());
    const drifted = extractReflection(mutate(reflectionSources(), CAP, (j) => {
      (j["params"] as Array<Record<string, unknown>>).find((p) => p["name"] === "account")!["required"] = false;
    }));
    const s = ambiguous();
    expect(digest(help(s, "why-choose", drifted))).not.toBe(digest(help(s, "why-choose", base)));
  });

  gate("D1-059B", "a missing structural fact is reported as a gap, not filled in", () => {
    const g = extractReflection(mutate(reflectionSources(), CAP, (j) => { delete j["consequence"]; }));
    expect(g.gaps).toContainEqual({ subject: "prompt.send@1", missing: "consequence" });
    expect(g.edges.some((e) => e.from === "prompt.send@1" && e.rel === "has-consequence")).toBe(false);
  });
});

void start;
