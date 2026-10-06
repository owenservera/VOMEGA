// MP21-P1 — source inventory + identity. The MP21-G1 statement ("repeated scan yields
// stable deterministic identities") is checked twice: on synthetic trees, where each way an
// identity could churn is exercised on purpose, and on the real repository at HEAD.
import { describe, expect, test } from "bun:test";
import { canonicalize } from "../../ratchet/src/canonical.ts";
import { hashBytes } from "../src/anchor.ts";
import { roleOf, surfaceOf } from "../src/classify.ts";
import { normalizeRemote, readTree, repoRoot } from "../src/git.ts";
import { buildInventory, duplicateAnchorIds, type Inventory, type TreeEntry } from "../src/inventory.ts";
import { locateDeclarations, locateManifestSymbols } from "../src/symbols.ts";

// ---------------------------------------------------------------- fixtures

const META = { repository: "example.test/o/r", commit: "c".repeat(40), scope: "base" };

function entry(path: string, text: string): TreeEntry {
  const bytes = new TextEncoder().encode(text);
  return { path: `base/${path}`, mode: "100644", blob: hashBytes(bytes).slice(7, 47), bytes };
}

const MANIFEST = JSON.stringify({
  manifestVersion: "1", id: "x.demo", version: "0.1.0", entry: "src/index.ts",
  contributions: {
    contract: [{ kind: "contract", id: "demo.read", version: "1", risk: "READ" }, { kind: "contract", id: "demo.write", version: "1", risk: "MUTATION" }],
    schema: [{ kind: "schema", id: "demo.row", version: "1", fields: [] }],
  },
}, null, 2);

const INDEX = `export const NS = "demo";
interface Row { id: string }
function helper(r: Row): string { return r.id; }
export const def = { ops: { "demo.read@1": (r: Row) => helper(r) } };
`;

function tree(index = INDEX, manifest = MANIFEST): TreeEntry[] {
  return [
    entry("plugins/demo/plugin.json", manifest),
    entry("plugins/demo/src/index.ts", index),
    entry("plugins/demo/test/demo.test.ts", `import { def } from "../src/index.ts";\n`),
    entry("plugins/demo/test/fixtures/ghost/plugin.json", `{ "id": "x.ghost", "entry": "src/index.ts", "contributions": {} }`),
  ];
}

const ids = (inv: Inventory) => inv.anchors.map((a) => a.id);
const anchor = (inv: Inventory, id: string) => inv.anchors.find((a) => a.id === id)!;

// ---------------------------------------------------------------- identity (MP21-G1)

describe("identity is deterministic", () => {
  test("the same tree yields byte-identical inventories", () => {
    expect(canonicalize(buildInventory(tree(), META))).toBe(canonicalize(buildInventory(tree(), META)));
  });

  test("input order does not reach the output", () => {
    const forward = buildInventory(tree(), META);
    const reversed = buildInventory(tree().reverse(), META);
    expect(reversed.digest).toBe(forward.digest);
  });

  test("anchor ids are unique and carry no commit, hash or line", () => {
    const inv = buildInventory(tree(), META);
    expect(duplicateAnchorIds(inv)).toEqual([]);
    expect(ids(inv)).toContain("declaration:base/plugins/demo/src/index.ts#def");
    expect(ids(inv)).toContain("manifest:base/plugins/demo/plugin.json#contract:demo.read@1");
    expect(ids(buildInventory(tree(), { ...META, commit: "d".repeat(40) }))).toEqual(ids(inv));
  });
});

describe("identity survives ordinary edits", () => {
  const before = buildInventory(tree(), META);
  const DEF = "declaration:base/plugins/demo/src/index.ts#def";
  const NS = "declaration:base/plugins/demo/src/index.ts#NS";

  test("shifting lines moves the range, not the identity or the span hash", () => {
    const after = buildInventory(tree(`// a new header comment\n\n${INDEX}`), META);
    expect(ids(after)).toEqual(ids(before));
    expect(anchor(after, DEF).range!.startLine).toBe(anchor(before, DEF).range!.startLine + 2);
    expect(anchor(after, DEF).spanHash).toBe(anchor(before, DEF).spanHash);
    expect(anchor(after, DEF).contentHash).not.toBe(anchor(before, DEF).contentHash);
  });

  test("editing one symbol changes only that symbol's span hash", () => {
    const after = buildInventory(tree(INDEX.replace(`"demo"`, `"demo2"`)), META);
    expect(anchor(after, NS).spanHash).not.toBe(anchor(before, NS).spanHash);
    expect(anchor(after, DEF).spanHash).toBe(anchor(before, DEF).spanHash);
  });

  test("reordering contributions keeps every manifest identity", () => {
    const m = JSON.parse(MANIFEST);
    m.contributions.contract.reverse();
    expect(ids(buildInventory(tree(INDEX, JSON.stringify(m, null, 2)), META))).toEqual(ids(before));
  });

  test("content outside the scope does not change the tree digest", () => {
    const outside: TreeEntry = { ...entry("x", "y"), path: "elsewhere/x" };
    expect(buildInventory([...tree(), outside], META).treeDigest).toBe(before.treeDigest);
  });
});

// ---------------------------------------------------------------- classification

describe("classification", () => {
  test("role separates product declarations from tests and fixtures", () => {
    expect(roleOf("plugins/demo/plugin.json")).toBe("source");
    expect(roleOf("plugins/demo/test/demo.test.ts")).toBe("test");
    expect(roleOf("testkit/test/fixtures/ghosts/ghost-liar/plugin.json")).toBe("fixture");
  });

  test("surface comes from path rules, and an unmatched path stays unclassified", () => {
    expect(surfaceOf("plugins/demo/plugin.json")).toBe("manifest");
    expect(surfaceOf("contracts/src/manifest.ts")).toBe("contract");
    expect(surfaceOf("surfaces/cli/src/cli.ts")).toBe("surface-source");
    expect(surfaceOf("somewhere/new/thing.bin")).toBe("unclassified");
  });

  test("a manifest's entry module is classified from the manifest, and a fixture manifest stays a fixture", () => {
    const inv = buildInventory(tree(), META);
    const file = (p: string) => inv.files.find((f) => f.path === `base/${p}`)!;
    expect(file("plugins/demo/src/index.ts").surface).toBe("plugin-entry");
    expect(file("plugins/demo/test/fixtures/ghost/plugin.json")).toMatchObject({ surface: "manifest", role: "fixture" });
    expect(inv.counts["manifest:source"]).toBe(1);
    expect(inv.counts["manifest:fixture"]).toBe(1);
  });
});

// ---------------------------------------------------------------- explicit unknowns

describe("what cannot be established is reported, never guessed", () => {
  test("an entry that names no scanned file is an unknown", () => {
    const inv = buildInventory(tree(), META);
    expect(inv.unknowns).toContainEqual({
      path: "base/plugins/demo/test/fixtures/ghost/src/index.ts",
      reason: "a manifest `entry` names this file, but it is not in the scanned tree",
    });
  });

  test("a malformed manifest yields problems and no invented symbols", () => {
    expect(locateManifestSymbols("plugin.json", `[1, 2]`).items).toEqual([]);
    const noId = locateManifestSymbols("plugin.json", `{ "contributions": { "contract": [{ "id": "a" }], "engine": {} } }`);
    expect(noId.items).toEqual([]);
    expect(noId.problems).toEqual([
      "manifest has no string `id`",
      "contributions.contract[0] has no string id/version",
      "contributions.engine is not an array",
    ]);
  });

  test("a contribution declared twice is one identity plus a reported problem", () => {
    const twice = `{ "id": "x", "contributions": { "contract": [{ "id": "a", "version": "1" }, { "id": "a", "version": "1" }] } }`;
    const found = locateManifestSymbols("plugin.json", twice);
    expect(found.items.map((i) => i.symbol)).toEqual(["contract:a@1", "plugin:x"]);
    expect(found.problems).toEqual(["contribution contract:a@1 is declared more than once"]);
  });

  test("syntax errors and undecodable bytes are surfaced", () => {
    expect(locateDeclarations("a.ts", "export const = ;").problems.length).toBe(1);
    const bad: TreeEntry = { path: "base/host/src/bad.ts", mode: "100644", blob: "0".repeat(40), bytes: new Uint8Array([0xff, 0xfe, 0x00]) };
    expect(buildInventory([bad], META).unknowns).toEqual([{ path: bad.path, reason: "not valid UTF-8; symbols not extracted" }]);
  });
});

// ---------------------------------------------------------------- declarations

describe("declarations", () => {
  test("type-only, non-exported, default and re-exported names are all located", () => {
    const src = [
      `export interface Shape { a: string }`,
      `type Local = number;`,
      `export default function main() {}`,
      `export { a as b } from "./x.ts";`,
      `export * from "./y.ts";`,
      `export const { p, q: [r] } = obj;`,
    ].join("\n");
    const found = Object.fromEntries(locateDeclarations("m.ts", src).items.map((d) => [d.symbol, d.exported]));
    expect(found).toEqual({ "*:./y.ts": true, Local: false, Shape: true, b: true, default: true, main: true, p: true, r: true });
  });

  test("a name declared more than once in a file is one identity", () => {
    const merged = locateDeclarations("m.ts", `export interface X { a: 1 }\nconst gap = 0;\nexport const X = 1;`).items.find((d) => d.symbol === "X")!;
    expect(merged.declKinds).toEqual(["InterfaceDeclaration", "VariableDeclaration"]);
    expect(merged.range).toEqual({ startLine: 1, endLine: 3 });
  });
});

// ---------------------------------------------------------------- the real repository

describe("the repository at HEAD", () => {
  const root = repoRoot(import.meta.dir);
  const scanHead = () => {
    const { entries, meta } = readTree(root, "HEAD", "omega-baseline");
    return buildInventory(entries, meta);
  };
  const inv = scanHead();

  test("MP21-G1: two independent scans are byte-identical", () => {
    expect(canonicalize(scanHead())).toBe(canonicalize(inv));
  });

  test("every anchor is unique and points at a scanned file with that file's hash", () => {
    expect(duplicateAnchorIds(inv)).toEqual([]);
    const hashes = new Map(inv.files.map((f) => [f.path, f.contentHash]));
    expect(inv.anchors.filter((a) => hashes.get(a.path) !== a.contentHash)).toEqual([]);
  });

  test("known source facts are located where the source has them", () => {
    const providers = "omega-baseline/plugins/vivim-providers";
    expect(ids(inv)).toContain(`manifest:${providers}/plugin.json#plugin:vivim.providers`);
    expect(ids(inv)).toContain(`manifest:${providers}/plugin.json#contract:providers.session.start@1`);
    expect(inv.declarations[`declaration:${providers}/src/index.ts#def`]).toEqual({ exported: true, declKinds: ["VariableDeclaration"] });
    expect(inv.declarations["declaration:omega-baseline/contracts/src/manifest.ts#PluginManifest"]?.exported).toBe(true);
    expect(inv.files.find((f) => f.path === `${providers}/src/index.ts`)?.surface).toBe("plugin-entry");
  });

  test("nothing in scope is left unclassified", () => {
    expect(inv.counts["surface:unclassified"] ?? 0).toBe(0);
  });
});

describe("repository naming", () => {
  test("https and ssh forms of one remote agree, and credentials are dropped", () => {
    expect(normalizeRemote("https://github.com/Owner/Repo.git")).toBe("github.com/owner/repo");
    expect(normalizeRemote("git@github.com:Owner/Repo.git")).toBe("github.com/owner/repo");
    expect(normalizeRemote("https://user:token@github.com/Owner/Repo")).toBe("github.com/owner/repo");
    expect(normalizeRemote("C:/some/local/path")).toBe("local");
  });
});
