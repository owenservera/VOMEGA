// MP21-P3 — Reflection Graph + query API, tested the way a consumer uses it.
//
// MP21-G3 asks that "an external consumer (MP-54 bundle or MP-60 impact query) resolves
// stable entity refs and relations from the graph alone". So after the graph is built and
// serialized once, every assertion below goes through `loadGraph(json)` from src/query.ts —
// the module MP-54/55/60 import — and nothing here reads source or calls an extractor.
// The three consumer scenarios stand in for programs that do not exist yet; they show the
// graph can answer their kind of question, not that those programs work.
import { describe, expect, test } from "bun:test";
import { canonicalize } from "../../ratchet/src/canonical.ts";
import { hashBytes } from "../src/anchor.ts";
import { buildExtraction } from "../src/extract.ts";
import { readTree, repoRoot } from "../src/git.ts";
import { buildGraph } from "../src/graph.ts";
import { buildInventory, type TreeEntry } from "../src/inventory.ts";
import { DEPENDENT_END, loadGraph, type ReflectionIndex } from "../src/query.ts";

function serialize(entries: TreeEntry[], meta: { repository: string; commit: string; scope: string }): string {
  const inventory = buildInventory(entries, meta);
  return canonicalize(buildGraph(inventory, buildExtraction(entries, inventory)));
}

// ---------------------------------------------------------------- a small known graph

function entry(path: string, text: string): TreeEntry {
  const bytes = new TextEncoder().encode(text);
  return { path: `base/${path}`, mode: "100644", blob: hashBytes(bytes).slice(7, 47), bytes };
}
const pluginJson = (id: string, ops: string[], ports: string[]) => JSON.stringify({
  id, version: "1.0.0", entry: "src/index.ts",
  contributions: { contract: ops.map((op) => ({ kind: "contract", id: op.split("@")[0], version: "1", risk: "READ" })) },
  dependencies: [], capabilities: { requested: ports.map((p) => `port:${p}`) },
});
const SMALL: TreeEntry[] = [
  entry("plugins/store/plugin.json", pluginJson("x.store", ["store.get@1"], [])),
  entry("plugins/store/src/index.ts", `import { open } from "./db.ts";\nexport const def = definePlugin({ ops: { "store.get@1": () => open() } });\n`),
  entry("plugins/store/src/db.ts", `export function open() { return 1; }\n`),
  entry("plugins/store/test/store.test.ts", `import { def } from "../src/index.ts";\n`),
  entry("plugins/reader/plugin.json", pluginJson("x.reader", ["reader.show@1"], ["store.get@1"])),
  entry("plugins/reader/src/index.ts", `export const def = definePlugin({ ops: { "reader.show@1": (p: any, ctx: any) => ctx.port.call("store.get@1", p) } });\n`),
  entry("plugins/reader/test/reader.test.ts", `const op = "reader.show@1";\n`),
  entry("plugins/island/plugin.json", pluginJson("x.island", ["island.ping@1"], [])),
  entry("plugins/island/src/index.ts", `export const def = definePlugin({ ops: { "island.ping@1": () => 1 } });\n`),
];
const small = loadGraph(serialize(SMALL, { repository: "example.test/o/r", commit: "c".repeat(40), scope: "base" }));
const refs = (steps: Array<{ ref: string }>) => steps.map((s) => s.ref);

describe("query API on a known graph", () => {
  test("bare paths and ops normalize to entity refs; unknown input does not", () => {
    expect(small.normalize("plugins/store/src/db.ts")).toBe("file:base/plugins/store/src/db.ts");
    expect(small.normalize("base/plugins/store/src/db.ts")).toBe("file:base/plugins/store/src/db.ts");
    expect(small.normalize("store.get@1")).toBe("op:store.get@1");
    expect(small.normalize("x.store")).toBe("plugin:x.store");
    expect(small.normalize("nothing.here")).toBeUndefined();
  });

  test("impact follows dependents across files, plugins, ops and tests", () => {
    const impact = refs(small.impact("file:base/plugins/store/src/db.ts"));
    expect(impact).toContain("file:base/plugins/store/src/index.ts"); // imports it
    expect(impact).toContain("plugin:x.store");                        // is made of it
    expect(impact).toContain("op:store.get@1");                        // registered by that plugin
    expect(impact).toContain("plugin:x.reader");                       // calls that op
    expect(impact).toContain("op:reader.show@1");
    expect(impact).toContain("file:base/plugins/reader/test/reader.test.ts"); // names the downstream op
    expect(impact.filter((r) => r.includes("island"))).toEqual([]);    // unrelated plugin stays out
  });

  test("a test file is located in a plugin without the plugin depending on it", () => {
    const test = "file:base/plugins/store/test/store.test.ts";
    expect(small.edges({ from: test, relation: "located-in" }).map((e) => e.to)).toEqual(["plugin:x.store"]);
    expect(small.impact(test)).toEqual([]);
    expect(small.affectedTests("file:base/plugins/store/src/db.ts")).toEqual([
      "file:base/plugins/store/test/store.test.ts", "file:base/plugins/reader/test/reader.test.ts",
    ]);
  });

  test("dependencies is the reverse direction, and depth bounds both", () => {
    expect(refs(small.dependencies("plugin:x.reader"))).toContain("file:base/plugins/store/src/db.ts");
    expect(refs(small.dependencies("plugin:x.island")).filter((r) => r.includes("store"))).toEqual([]);
    expect(small.impact("file:base/plugins/store/src/db.ts", { maxDepth: 1 }).every((s) => s.depth === 1)).toBe(true);
    expect(refs(small.impact("file:base/plugins/store/src/db.ts", { relations: ["imports"] }))).toEqual(["file:base/plugins/store/src/index.ts", "file:base/plugins/store/test/store.test.ts"]);
  });

  test("every reached entity can be explained by a chain of edges with claim classes", () => {
    const steps = small.impact("file:base/plugins/store/src/db.ts");
    const chain = small.explain(steps, "plugin:x.reader");
    expect(chain.map((e) => e.relation)).toEqual(["part-of", "declares-op", "calls-port"]);
    expect(chain.map((e) => e.claimClass)).toEqual(["INFERRED_SAFE", "INFERRED_SAFE", "PROVEN_STRUCTURAL"]);
  });

  test("an entity resolves to anchors with path, commit and content hash", () => {
    const anchors = small.anchorsOf("op:store.get@1");
    expect(anchors.map((a) => a.id)).toContain("op-registration:base/plugins/store/src/index.ts#store.get@1");
    expect(anchors.every((a) => a.commit === "c".repeat(40) && a.contentHash.startsWith("sha256:"))).toBe(true);
    expect(small.filesOf("op:store.get@1")).toEqual([
      "base/plugins/reader/plugin.json", "base/plugins/reader/src/index.ts", "base/plugins/store/plugin.json", "base/plugins/store/src/index.ts",
    ]);
  });

  test("answers name the revision they describe, and other schemas are refused", () => {
    expect(small.describes.commit).toBe("c".repeat(40));
    expect(small.isCurrent("d".repeat(40))).toBe(false);
    expect(() => loadGraph(JSON.stringify({ schema: "something-else/9" }))).toThrow();
  });
});

// ---------------------------------------------------------------- the real repository

describe("consumers of the real graph", () => {
  const root = repoRoot(import.meta.dir);
  const build = (rev: string) => {
    const { entries, meta } = readTree(root, rev, "omega-baseline");
    return serialize(entries, meta);
  };
  const json = build("HEAD");
  const ix: ReflectionIndex = loadGraph(json);
  const P = "omega-baseline/plugins";

  test("the serialized graph is deterministic and self-contained", () => {
    expect(build("HEAD")).toBe(json);
    const cited = new Set<string>();
    for (const n of ix.graph.nodes) for (const a of [...n.anchors, ...n.claims.flatMap((c) => c.anchors)]) cited.add(a);
    for (const e of ix.graph.edges) for (const a of e.anchors) cited.add(a);
    expect([...cited].filter((a) => !(a in ix.graph.anchors))).toEqual([]);
    expect(ix.graph.edges.filter((e) => !ix.has(e.from) || !ix.has(e.to))).toEqual([]);
  });

  test("every relation in the graph has a stated dependency direction", () => {
    expect([...new Set(ix.graph.edges.map((e) => e.relation))].filter((r) => !(r in DEPENDENT_END))).toEqual([]);
  });

  // MP-60-style question: "I am changing the vault plugin's entry module; what is downstream?"
  // Expected members hand-checked at 10a8beb: vivim-providers calls vault.query@1/vault.get@1
  // through its portCall wrapper, and its test file names providers.registry@1.
  test("impact query: a known source change resolves the expected downstream set", () => {
    const start = ix.normalize("plugins/vivim-vault/src/index.ts")!;
    const steps = ix.impact(start);
    const reached = new Set(refs(steps));
    for (const expected of ["plugin:vivim.vault", "op:vault.get@1", "op:vault.query@1", "plugin:vivim.providers", "op:providers.registry@1", `file:${P}/vivim-providers/test/providers.test.ts`]) {
      expect(reached.has(expected)).toBe(true);
    }
    // Several shortest chains exist (the manifest also declares the dependency); any one is a valid explanation.
    const chain = ix.explain(steps, "plugin:vivim.providers").map((e) => e.relation);
    expect(chain.slice(0, 2)).toEqual(["entry-module", "declares-op"]);
    expect(["calls-port", "depends-on", "requests-port"]).toContain(chain[2]!);
    expect(ix.edges({ from: "plugin:vivim.providers", to: "op:vault.query@1", relation: "calls-port" }).length).toBe(1);
    // vault.test.ts imports ../src/db.ts directly (and not the entry module), so it is one
    // step from db.ts and absent from the direct importers of index.ts.
    const db = ix.normalize("plugins/vivim-vault/src/db.ts")!;
    expect(ix.affectedTests(db, { maxDepth: 1 })).toContain(`file:${P}/vivim-vault/test/vault.test.ts`);
    expect(ix.affectedTests(start, { maxDepth: 1 })).toEqual([]);
    // A leaf change stays small: only a test file's own declarations depend on it.
    expect(ix.impact(`file:${P}/vivim-providers/test/providers.test.ts`).filter((s) => !s.ref.startsWith("symbol:"))).toEqual([]);
  });

  // MP-54-style question: "which files does a worker need for a task on this op?"
  test("bundle query: an op resolves to a deterministic, digest-pinned file set", () => {
    const bundle = (index: ReflectionIndex) => {
      const op = index.normalize("providers.session.start@1")!;
      const owners = index.edges({ to: op, relation: "registers-op" }).map((e) => e.from);
      const paths = new Set([...index.filesOf(op), ...owners.flatMap((o) => index.edges({ to: o, relation: "part-of" }).map((e) => e.from.slice("file:".length)))]);
      return [...paths].sort().map((path) => ({ path, contentHash: index.graph.anchors[`file:${path}`]!.contentHash }));
    };
    const first = bundle(ix);
    expect(first.map((f) => f.path)).toEqual(expect.arrayContaining([
      `${P}/vivim-providers/plugin.json`, `${P}/vivim-providers/src/index.ts`, `${P}/vivim-providers/src/registry.ts`, `${P}/vivim-providers/test/providers.test.ts`,
    ]));
    expect(bundle(loadGraph(build("HEAD")))).toEqual(first);
  });

  // MP-55-style question: "a test failed; which entities does it touch, by reference?"
  test("enrichment query: a failing test path resolves to entity refs with source anchors", () => {
    const failing = ix.normalize("plugins/vivim-providers/test/providers.test.ts")!;
    expect(ix.roleOf(failing)).toBe("test");
    expect(ix.edges({ from: failing, relation: "located-in" }).map((e) => e.to)).toContain("plugin:vivim.providers");
    expect(ix.edges({ from: failing, relation: "mentions-op" }).map((e) => e.to)).toContain("op:providers.registry@1");
    const anchor = ix.anchorsOf("op:providers.registry@1").find((a) => a.extractionKind === "op-registration")!;
    expect(anchor).toMatchObject({ path: `${P}/vivim-providers/src/index.ts`, commit: ix.describes.commit, symbol: "providers.registry@1" });
  });

  test("entity refs are stable across commits that do not touch the product source", () => {
    // 10a8beb is the commit before this tool existed; product plugins are unchanged since.
    let earlier: ReflectionIndex;
    try {
      earlier = loadGraph(build("10a8bebbdda776de2a8c2a35699505e049e02b68"));
    } catch {
      return; // a shallow clone without that commit cannot run this comparison
    }
    const product = (index: ReflectionIndex) => index.graph.nodes.filter((n) => ["plugin", "op", "contribution", "field", "frame"].includes(n.kind)).map((n) => n.ref);
    expect(product(ix)).toEqual(product(earlier));
    const symbols = (index: ReflectionIndex) => index.find({ kind: "symbol", contains: "omega-baseline/contracts/" }).map((n) => n.ref);
    expect(symbols(ix)).toEqual(symbols(earlier));
    expect(earlier.describes.commit).not.toBe(ix.describes.commit);
  });
});
