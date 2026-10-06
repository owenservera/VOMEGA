// MP21-P2 — structural extraction. MP21-G2 ("same HEAD produces the same extracted
// structural fact set", with zero invented facts) is checked on a synthetic tree where every
// expected fact is known in advance, and on the real repository against facts read by hand.
import { describe, expect, test } from "bun:test";
import { canonicalize } from "../../ratchet/src/canonical.ts";
import { hashBytes } from "../src/anchor.ts";
import { buildExtraction, OP_STATUS, PORT_STATUS, REGISTRATION, ROUTABLE_KINDS, type Extraction } from "../src/extract.ts";
import { CLAIM_CLASSES, FactSet, RULES, type Fact } from "../src/facts.ts";
import { readTree, repoRoot } from "../src/git.ts";
import { buildInventory, type TreeEntry } from "../src/inventory.ts";

// ---------------------------------------------------------------- fixtures

const META = { repository: "example.test/o/r", commit: "c".repeat(40), scope: "base" };

function entry(path: string, text: string): TreeEntry {
  const bytes = new TextEncoder().encode(text);
  return { path: `base/${path}`, mode: "100644", blob: hashBytes(bytes).slice(7, 47), bytes };
}

const manifest = (over: Record<string, unknown> = {}) => JSON.stringify({
  manifestVersion: "1", id: "x.demo", version: "0.1.0", description: "A demo plugin.", entry: "src/index.ts",
  publisher: { keyId: "", signature: "" },
  contributions: {
    contract: [
      { kind: "contract", id: "demo.read", version: "1", risk: "READ", doc: "Reads a row." },
      { kind: "contract", id: "demo.ghost", version: "1", risk: "MUTATION" },
    ],
    engine: [{ kind: "engine", id: "demo.derive", version: "1" }],
    schema: [{ kind: "schema", id: "demo.row", version: "1", fields: [{ name: "id", type: "string", required: true }] }],
  },
  dependencies: [{ ref: "contract:store.get@1", range: "1.x" }],
  capabilities: { requested: ["port:store.get@1", "port:store.unused@1", "host.clock"], justification: "Reads the store." },
  runtime: { tier: "worker-thread", budget: { cpuMs: 10 } },
  contentHash: "",
  ...over,
}, null, 2);

const INDEX = `import { definePlugin } from "@x/shim";
import { HOST } from "@x/contracts";
import type { Row } from "./types.ts";
const DERIVE = "demo.derive@1";
async function portCall(ctx: any, op: string, payload: unknown) { return ctx.port.call(op, payload); }
export const def = definePlugin({
  ops: {
    "demo.read@1": async (p: Row, ctx: any) => portCall(ctx, "store.get@1", p),
    [DERIVE]: async (_p: unknown, ctx: any) => ctx.port.call(HOST.audit, {}),
    "demo.extra@1": async (p: any, ctx: any) => ctx.port.call(p.op, {}),
  },
});
`;

function tree(over: Record<string, string> = {}): TreeEntry[] {
  const files: Record<string, string> = {
    "plugins/demo/plugin.json": manifest(),
    "plugins/demo/src/index.ts": INDEX,
    "plugins/demo/src/types.ts": `export interface Row { id: string }\n`,
    "plugins/demo/test/demo.test.ts": `import { def } from "../src/index.ts";\nconst op = "demo.read@1";\nconst other = "not.an.op@1";\n`,
    "plugins/demo/test/fixtures/ghost/plugin.json": JSON.stringify({ id: "x.ghost", entry: "src/index.ts", contributions: { contract: [{ id: "ghost.op", version: "1" }] } }),
    "contracts/package.json": JSON.stringify({ name: "@x/contracts" }),
    "contracts/src/port.ts": `export const HOST = { audit: "host.audit@1" } as const;\nexport type Risk = "READ" | "MUTATION";\nexport interface Call { op: string; deadlineMs?: number }\nexport const KINDS = ["a", "b"] as const;\n`,
    ...over,
  };
  return Object.entries(files).map(([path, text]) => entry(path, text));
}

function extract(entries: TreeEntry[] = tree()): Extraction {
  return buildExtraction(entries, buildInventory(entries, META));
}

const fact = (x: Extraction, id: string): Fact | undefined => x.facts.find((f) => f.id === id);

// ---------------------------------------------------------------- determinism (MP21-G2)

describe("the fact set is deterministic", () => {
  test("the same tree yields byte-identical extractions, whatever the input order", () => {
    expect(canonicalize(extract())).toBe(canonicalize(extract()));
    expect(extract(tree().reverse()).digest).toBe(extract().digest);
  });
});

// ---------------------------------------------------------------- claim classes

describe("each fact carries the class its source supports", () => {
  const x = extract();

  test("manifest statements are DECLARED and prose is COMMENTARY", () => {
    expect(fact(x, "declared-as(plugin:x.demo)")).toMatchObject({
      claimClass: "DECLARED",
      value: { version: "0.1.0", entry: "src/index.ts", runtimeTier: "worker-thread", contentHashPresent: false, publisherSigned: false },
    });
    expect(fact(x, "described-as(plugin:x.demo)")?.claimClass).toBe("COMMENTARY");
    expect(fact(x, "documented-as(contribution:x.demo/contract:demo.read@1)")).toMatchObject({ claimClass: "COMMENTARY", value: "Reads a row." });
    expect(fact(x, "has-field(contribution:x.demo/schema:demo.row@1 -> field:x.demo/schema:demo.row@1/id)")).toMatchObject({ claimClass: "DECLARED", value: { type: "string", required: true } });
    expect(fact(x, "depends-on(plugin:x.demo -> op:store.get@1)")?.value).toEqual({ range: "1.x" });
    expect(fact(x, "requests-capability(plugin:x.demo -> capability:host.clock)")?.claimClass).toBe("DECLARED");
  });

  test("a literal registration is PROVEN_STRUCTURAL; one reached by a rule is INFERRED_SAFE and names the rule", () => {
    expect(fact(x, "registers-op(plugin:x.demo -> op:demo.read@1)")).toMatchObject({ claimClass: "PROVEN_STRUCTURAL", anchors: ["op-registration:base/plugins/demo/src/index.ts#demo.read@1"] });
    expect(fact(x, "registers-op(plugin:x.demo -> op:demo.derive@1)")).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "same-file-const" });
    expect(fact(x, "declares-op(plugin:x.demo -> op:demo.read@1)")).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "routable-kind", value: { kind: "contract", risk: "READ" } });
    expect(fact(x, "calls-port(plugin:x.demo -> op:store.get@1)")).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "local-wrapper-forwarding" });
    expect(fact(x, "calls-port(plugin:x.demo -> op:host.audit@1)")).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "imported-const" });
  });

  test("imports resolve to files, workspace packages or external modules", () => {
    const from = "file:base/plugins/demo/src/index.ts";
    expect(fact(x, `imports(${from} -> file:base/plugins/demo/src/types.ts)`)).toMatchObject({ claimClass: "PROVEN_STRUCTURAL", value: { typeOnly: true } });
    expect(fact(x, `imports(${from} -> package:@x/contracts)`)).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "workspace-package-name" });
    expect(fact(x, `imports(${from} -> module:@x/shim)`)?.claimClass).toBe("PROVEN_STRUCTURAL");
  });

  test("contract vocabularies and shapes are read from the declarations", () => {
    expect(fact(x, "has-members(symbol:base/contracts/src/port.ts#Risk)")?.value).toEqual(["READ", "MUTATION"]);
    expect(fact(x, "has-members(symbol:base/contracts/src/port.ts#KINDS)")?.value).toEqual(["a", "b"]);
    expect(fact(x, "has-shape(symbol:base/contracts/src/port.ts#Call)")?.value).toEqual([
      { name: "op", optional: false, type: "string" }, { name: "deadlineMs", optional: true, type: "number" },
    ]);
  });

  test("a test file is linked only to ops that are actually declared or registered", () => {
    const mentions = x.facts.filter((f) => f.predicate === "mentions-op").map((f) => f.object);
    expect(mentions).toEqual(["op:demo.read@1"]);
  });

  test("files belong to the nearest product manifest; fixture manifests yield no plugin or op", () => {
    expect(fact(x, "part-of(file:base/plugins/demo/src/types.ts -> plugin:x.demo)")?.rule).toBe("file-under-manifest-directory");
    expect(x.facts.filter((f) => canonicalize(f).includes("x.ghost") || canonicalize(f).includes("ghost.op"))).toEqual([]);
  });
});

// ---------------------------------------------------------------- invariants over every fact

function invariants(x: Extraction, anchorIds: Set<string>): void {
  for (const f of x.facts) {
    expect(CLAIM_CLASSES).toContain(f.claimClass);
    expect(f.anchors.length).toBeGreaterThan(0);
    expect(f.anchors.filter((a) => !anchorIds.has(a))).toEqual([]);
    if (f.claimClass === "INFERRED_SAFE") expect(Object.keys(RULES)).toContain(f.rule!);
    else expect(f.rule).toBeUndefined();
  }
  expect(new Set(x.facts.map((f) => f.id)).size).toBe(x.facts.length);
}

describe("no fact without a source, no inference without a named rule", () => {
  test("holds on the synthetic tree", () => {
    const entries = tree();
    const inv = buildInventory(entries, META);
    const x = buildExtraction(entries, inv);
    invariants(x, new Set([...inv.anchors, ...x.anchors].map((a) => a.id)));
  });

  test("the fact collector refuses unsourced facts and rule-less inferences", () => {
    const set = new FactSet();
    expect(() => set.add({ claimClass: "DECLARED", subject: "plugin:a", predicate: "p", anchors: [] })).toThrow();
    expect(() => set.add({ claimClass: "INFERRED_SAFE", subject: "plugin:a", predicate: "p", anchors: ["file:a"] })).toThrow();
  });

  test("suggested meaning is not a class an extractor can emit", () => {
    expect(CLAIM_CLASSES as readonly string[]).not.toContain("CANDIDATE_SEMANTIC");
  });
});

// ---------------------------------------------------------------- conflict, parity, unknowns

describe("disagreement and opacity are outputs", () => {
  test("two manifests claiming one plugin id produce a CONFLICT that keeps both values, and separate parity rows", () => {
    const twin = tree({ "plugins/twin/plugin.json": manifest({ version: "9.9.9", entry: "src/none.ts", contributions: {} }) });
    const x = extract(twin);
    const conflict = fact(x, "declared-as(plugin:x.demo)")!;
    expect(conflict.claimClass).toBe("CONFLICT");
    expect((conflict.value as { conflicting: unknown[] }).conflicting.length).toBe(2);
    expect(conflict.anchors.length).toBe(2);
    const rows = x.parity.filter((p) => p.plugin === "x.demo");
    expect(rows.map((p) => p.ops.length)).toEqual([4, 0]);
    expect(rows[1]!.registration).toBe(REGISTRATION.missing);
  });

  test("manifest ↔ runtime parity names every case", () => {
    const p = extract().parity.find((r) => r.plugin === "x.demo")!;
    expect(Object.fromEntries(p.ops.map((o) => [o.op, o.status]))).toEqual({
      "demo.derive@1": OP_STATUS.both,
      "demo.extra@1": OP_STATUS.implementedOnly,
      "demo.ghost@1": OP_STATUS.declaredOnly,
      "demo.read@1": OP_STATUS.both,
    });
    expect(Object.fromEntries(p.ports.map((o) => [o.op, o.status]))).toEqual({
      "host.audit@1": PORT_STATUS.calledOnly,
      "store.get@1": PORT_STATUS.both,
      "store.unused@1": PORT_STATUS.requestedOnly,
    });
    expect(p.registration).toBe(REGISTRATION.static);
    expect(p.dynamicPortCalls).toBe(1);
  });

  test("a non-literal op is reported with its line, and dynamic registration is named as such", () => {
    expect(extract().unknowns).toContainEqual({ path: "base/plugins/demo/src/index.ts", reason: "line 10: port call whose op is not a literal" });
    const spread = extract(tree({ "plugins/demo/src/index.ts": `import { more } from "./types.ts";\nexport const def = definePlugin({ ops: { ...more, "demo.read@1": () => 1 } });\n` }));
    const p = spread.parity.find((r) => r.plugin === "x.demo")!;
    expect(p.registration).toBe(REGISTRATION.dynamic);
    expect(spread.unknowns.map((u) => u.reason)).toContain("line 2: ops contains a spread");
  });

  test("an op declared by one plugin and registered by another is attributed, not merged", () => {
    const provider = tree({
      "plugins/impl/plugin.json": manifest({ id: "x.impl", contributions: {}, capabilities: { requested: [] }, dependencies: [] }),
      "plugins/impl/src/index.ts": `export const def = definePlugin({ ops: { "demo.ghost@1": () => 1 } });\n`,
    });
    const ghost = extract(provider).parity.find((r) => r.plugin === "x.demo")!.ops.find((o) => o.op === "demo.ghost@1")!;
    expect(ghost).toEqual({ op: "demo.ghost@1", status: OP_STATUS.declaredOnly, registeredElsewhereBy: ["x.impl"] });
  });

  test("what is deliberately not extracted is listed in the artifact", () => {
    expect(extract().notExtracted.map((n) => n.surface)).toContain("config parsing");
  });
});

// ---------------------------------------------------------------- the real repository

describe("the repository at HEAD", () => {
  const root = repoRoot(import.meta.dir);
  const scan = () => {
    const { entries, meta } = readTree(root, "HEAD", "omega-baseline");
    const inventory = buildInventory(entries, meta);
    return { entries, inventory, extraction: buildExtraction(entries, inventory) };
  };
  const { entries, inventory, extraction: x } = scan();
  const providers = "omega-baseline/plugins/vivim-providers";

  test("MP21-G2: two independent extractions are byte-identical", () => {
    expect(canonicalize(scan().extraction)).toBe(canonicalize(x));
  });

  test("every fact cites existing anchors and every inference names a rule", () => {
    invariants(x, new Set([...inventory.anchors, ...x.anchors].map((a) => a.id)));
  });

  test("the routable-kind rule still matches routableOps() in the contracts source", () => {
    const source = new TextDecoder().decode(entries.find((e) => e.path === "omega-baseline/contracts/src/manifest.ts")!.bytes);
    const body = source.slice(source.indexOf("export function routableOps"));
    expect(body).toContain(`for (const kind of ${JSON.stringify([...ROUTABLE_KINDS]).replaceAll(",", ", ")} as const)`);
  });

  // Hand-checked against plugins/vivim-providers/{plugin.json,src/index.ts} at 10a8beb.
  test("hand-checked facts for vivim.providers are present with the right class and anchor", () => {
    for (const op of ["providers.registry@1", "providers.realization.get@1", "providers.session.start@1"]) {
      expect(fact(x, `registers-op(plugin:vivim.providers -> op:${op})`)).toMatchObject({
        claimClass: "PROVEN_STRUCTURAL", anchors: [`op-registration:${providers}/src/index.ts#${op}`],
      });
    }
    expect(fact(x, "declares-op(plugin:vivim.providers -> op:providers.session.start@1)")?.value).toEqual({ kind: "contract", risk: "MUTATION" });
    expect(fact(x, "calls-port(plugin:vivim.providers -> op:vault.query@1)")).toMatchObject({ claimClass: "INFERRED_SAFE", rule: "local-wrapper-forwarding" });
    expect(x.facts.filter((f) => f.predicate === "has-field" && f.subject === "contribution:vivim.providers/schema:providers.registry-entry@1").length).toBe(9);
    const p = x.parity.find((r) => r.plugin === "vivim.providers")!;
    expect(p.ops.every((o) => o.status === OP_STATUS.both)).toBe(true);
    expect(p.ports.find((o) => o.op === "vault.append@1")?.status).toBe(PORT_STATUS.requestedOnly);
  });

  test("hand-checked cross-plugin facts hold", () => {
    const send = x.parity.find((r) => r.plugin === "pack.domain-email")!.ops.find((o) => o.op === "message.send@1")!;
    expect(send.status).toBe(OP_STATUS.declaredOnly);
    expect(send.registeredElsewhereBy).toContain("provider.email.file");
    expect(fact(x, "declared-as(plugin:vivim.law)")?.claimClass).toBe("CONFLICT");
    expect(fact(x, "has-members(symbol:omega-baseline/contracts/src/manifest.ts#RiskClass)")?.value).toEqual(["EXTERNAL_MUTATION", "MUTATION", "READ"]);
    expect(fact(x, "frames-op(frame:omega-baseline/plugins/vivim-nlcl-pure/src/frames.ts#message.send@1 -> op:message.send@1)")?.claimClass).toBe("PROVEN_STRUCTURAL");
  });

  test("no fixture plugin leaks into the fact set, and prompt.send is still absent from source", () => {
    expect(x.facts.filter((f) => f.subject.startsWith("plugin:ghost") || f.object?.startsWith("plugin:ghost"))).toEqual([]);
    expect(x.facts.filter((f) => f.object?.startsWith("op:prompt.send"))).toEqual([]);
  });
});
