// reflect — Reflection Migrator CLI (MP-21). Read-only over source; the only thing it can
// write is the artifact named by --out.
//
// Build (reads Git objects at --rev, default HEAD; --scope defaults to omega-baseline):
//   bun run reflect inventory|extract|graph [--rev <rev>] [--scope <dir>] [--out <file>]
//   bun run reflect parity
//   bun run reflect verify
// Query (add --graph <file> to answer from a serialized graph instead of scanning):
//   bun run reflect find <kind> [text]
//   bun run reflect resolve <ref|path|op>
//   bun run reflect impact  <ref|path|op> [--depth <n>]
//   bun run reflect deps    <ref|path|op> [--depth <n>]
//   bun run reflect tests   <ref|path|op> [--depth <n>]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { canonicalize, short } from "../../ratchet/src/canonical.ts";
import { buildExtraction, OP_STATUS, PORT_STATUS, REGISTRATION, type Extraction } from "./extract.ts";
import { readTree, repoRoot } from "./git.ts";
import { buildGraph, type ReflectionGraph } from "./graph.ts";
import { buildInventory, duplicateAnchorIds, type Inventory } from "./inventory.ts";
import { loadGraph, ReflectionIndex, type Step } from "./query.ts";

type Artifact = Inventory | Extraction | ReflectionGraph;

const [command = "", ...rest] = process.argv.slice(2);
const flags = new Map<string, string>();
const positional: string[] = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i]!.startsWith("--")) flags.set(rest[i]!.slice(2), rest[++i] ?? "");
  else positional.push(rest[i]!);
}
const flag = (name: string, fallback = "") => flags.get(name) ?? fallback;

function scan(): { inventory: Inventory; extraction: Extraction; graph: ReflectionGraph } {
  const { entries, meta } = readTree(repoRoot(process.cwd()), flag("rev", "HEAD"), flag("scope", "omega-baseline"));
  const inventory = buildInventory(entries, meta);
  const extraction = buildExtraction(entries, inventory);
  return { inventory, extraction, graph: buildGraph(inventory, extraction) };
}

function index(): ReflectionIndex {
  return flag("graph") ? loadGraph(readFileSync(resolve(flag("graph")), "utf8")) : new ReflectionIndex(scan().graph);
}

function summary(of: Artifact): string {
  return [
    `${of.schema}  ${of.repository} @ ${of.commit.slice(0, 12)} scope=${of.scope || "."}`,
    `digest ${short(of.digest)}`,
    ...Object.keys(of.counts).sort().map((k) => `  ${k.padEnd(52)} ${of.counts[k]}`),
  ].join("\n");
}

function write(artifact: Artifact): void {
  const out = flag("out");
  if (!out) return;
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(resolve(out), canonicalize(artifact) + "\n");
  console.log(`wrote ${out}`);
}

function target(ix: ReflectionIndex): string {
  const entity = ix.normalize(positional[0] ?? "");
  if (entity !== undefined) return entity;
  console.error(`no entity matches "${positional[0] ?? ""}" in the graph at ${ix.describes.commit.slice(0, 12)}`);
  return process.exit(1);
}

function printSteps(ix: ReflectionIndex, steps: Step[]): void {
  console.log(`at ${ix.describes.commit.slice(0, 12)}: ${steps.length} entit${steps.length === 1 ? "y" : "ies"}`);
  for (const s of steps) console.log(`  ${String(s.depth).padStart(2)}  ${s.ref}   [${s.via!.relation}, ${s.via!.claimClass}]`);
}

const depth = flags.has("depth") ? { maxDepth: Number(flag("depth")) } : {};

if (command === "inventory" || command === "extract" || command === "graph") {
  const built = scan();
  const artifact: Artifact = command === "inventory" ? built.inventory : command === "extract" ? built.extraction : built.graph;
  console.log(summary(artifact));
  for (const u of artifact.unknowns) console.log(`  unknown: ${u.path} — ${u.reason}`);
  if ("notExtracted" in artifact) for (const n of artifact.notExtracted) console.log(`  not extracted: ${n.surface} — ${n.reason}`);
  write(artifact);
} else if (command === "parity") {
  // Everything that is not a plain match, per manifest. A report of facts, not a verdict:
  // a pack that declares ops for others to implement is expected to appear here.
  for (const p of scan().extraction.parity) {
    const lines = [
      ...(p.registration === REGISTRATION.static ? [] : [`  registration: ${p.registration}`]),
      ...p.ops.filter((o) => o.status !== OP_STATUS.both).map((o) => `  op   ${o.op}: ${o.status}${o.registeredElsewhereBy.length ? ` (registered by ${o.registeredElsewhereBy.join(", ")})` : ""}`),
      ...p.ports.filter((o) => o.status !== PORT_STATUS.both).map((o) => `  port ${o.op}: ${o.status}`),
      ...(p.dynamicPortCalls ? [`  ${p.dynamicPortCalls} port call(s) with a non-literal op`] : []),
    ];
    console.log(`${p.plugin}  [${p.manifest}]  (${p.ops.length} op(s), ${p.ports.length} port(s))${lines.length ? "" : "  all matched"}`);
    for (const line of lines) console.log(line);
  }
} else if (command === "verify") {
  // MP21-G1 / G2 / G3 preconditions: two independent scans of one commit are byte-identical
  // at every layer, anchor ids are unique, and every fact cites anchors that exist.
  const [a, b] = [scan(), scan()];
  const same = (key: "inventory" | "extraction" | "graph") => canonicalize(a[key]) === canonicalize(b[key]);
  const all: Inventory = { ...a.inventory, anchors: [...a.inventory.anchors, ...a.extraction.anchors] };
  const duplicates = duplicateAnchorIds(all);
  const known = new Set(all.anchors.map((x) => x.id));
  const dangling = a.extraction.facts.filter((f) => f.anchors.length === 0 || f.anchors.some((x) => !known.has(x)));
  for (const artifact of [a.inventory, a.extraction, a.graph]) console.log(summary(artifact));
  for (const key of ["inventory", "extraction", "graph"] as const) console.log(`${key} repeat scan: ${same(key) ? "IDENTICAL" : "DIFFERENT"}`);
  console.log(duplicates.length === 0 ? "anchor ids: UNIQUE" : `anchor ids: ${duplicates.length} DUPLICATE\n  ${duplicates.join("\n  ")}`);
  console.log(dangling.length === 0 ? "fact anchors: ALL RESOLVE" : `fact anchors: ${dangling.length} fact(s) cite a missing anchor\n  ${dangling.map((f) => f.id).join("\n  ")}`);
  process.exit(same("inventory") && same("extraction") && same("graph") && duplicates.length === 0 && dangling.length === 0 ? 0 : 1);
} else if (command === "find") {
  const ix = index();
  for (const n of ix.find({ kind: positional[0], contains: positional[1] })) console.log(n.ref);
} else if (command === "resolve") {
  const ix = index();
  const r = ix.resolve(target(ix))!;
  console.log(`${r.node.ref}   at ${ix.describes.commit.slice(0, 12)}`);
  for (const c of r.node.claims) console.log(`  ${c.predicate} [${c.claimClass}${c.rule ? `: ${c.rule}` : ""}] ${JSON.stringify(c.value ?? null).slice(0, 160)}`);
  for (const e of r.outgoing) console.log(`  —${e.relation}→ ${e.to}   [${e.claimClass}${e.rule ? `: ${e.rule}` : ""}]`);
  for (const e of r.incoming) console.log(`  ←${e.relation}— ${e.from}   [${e.claimClass}${e.rule ? `: ${e.rule}` : ""}]`);
  for (const a of r.anchors) console.log(`  @ ${a.path}${a.range ? `:${a.range.startLine}-${a.range.endLine}` : ""}  ${a.extractionKind}${a.symbol ? ` ${a.symbol}` : ""}  ${short(a.contentHash)}`);
} else if (command === "impact" || command === "deps") {
  const ix = index();
  printSteps(ix, command === "impact" ? ix.impact(target(ix), depth) : ix.dependencies(target(ix), depth));
} else if (command === "tests") {
  const ix = index();
  const tests = ix.affectedTests(target(ix), depth);
  console.log(`at ${ix.describes.commit.slice(0, 12)}: ${tests.length} test file(s) structurally reachable`);
  for (const t of tests) console.log(`  ${t}`);
} else {
  console.error("usage: reflect <inventory|extract|graph|parity|verify|find|resolve|impact|deps|tests> … (see the header of src/cli.ts)");
  process.exit(2);
}
