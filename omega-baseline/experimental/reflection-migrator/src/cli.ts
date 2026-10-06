// reflect — Reflection Migrator CLI (MP-21). Read-only over source; the only thing it can
// write is the artifact named by --out.
//
//   bun run reflect inventory [--rev HEAD] [--scope omega-baseline] [--out <file>]
//   bun run reflect extract   [--rev HEAD] [--scope omega-baseline] [--out <file>]
//   bun run reflect parity    [--rev HEAD] [--scope omega-baseline]
//   bun run reflect verify    [--rev HEAD] [--scope omega-baseline]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { canonicalize, short } from "../../ratchet/src/canonical.ts";
import { buildExtraction, OP_STATUS, PORT_STATUS, REGISTRATION, type Extraction } from "./extract.ts";
import { readTree, repoRoot } from "./git.ts";
import { buildInventory, duplicateAnchorIds, type Inventory } from "./inventory.ts";

function option(args: string[], name: string, fallback: string): string {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1]! : fallback;
}

function scan(args: string[]): { inventory: Inventory; extraction: Extraction } {
  const root = repoRoot(process.cwd());
  const { entries, meta } = readTree(root, option(args, "rev", "HEAD"), option(args, "scope", "omega-baseline"));
  const inventory = buildInventory(entries, meta);
  return { inventory, extraction: buildExtraction(entries, inventory) };
}

function summary(of: Inventory | Extraction): string {
  return [
    `${of.schema}  ${of.repository} @ ${of.commit.slice(0, 12)} scope=${of.scope || "."}`,
    `digest ${short(of.digest)}`,
    ...Object.keys(of.counts).sort().map((k) => `  ${k.padEnd(52)} ${of.counts[k]}`),
  ].join("\n");
}

function write(args: string[], artifact: Inventory | Extraction): void {
  const out = option(args, "out", "");
  if (!out) return;
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(resolve(out), canonicalize(artifact) + "\n");
  console.log(`wrote ${out}`);
}

const [command = "", ...args] = process.argv.slice(2);

if (command === "inventory" || command === "extract") {
  const artifact = scan(args)[command === "inventory" ? "inventory" : "extraction"];
  console.log(summary(artifact));
  for (const u of artifact.unknowns) console.log(`  unknown: ${u.path} — ${u.reason}`);
  if ("notExtracted" in artifact) for (const n of artifact.notExtracted) console.log(`  not extracted: ${n.surface} — ${n.reason}`);
  write(args, artifact);
} else if (command === "parity") {
  // Everything that is not a plain match, per plugin. A report of facts, not a verdict:
  // a pack that declares ops for others to implement is expected to appear here.
  for (const p of scan(args).extraction.parity) {
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
  // MP21-G1 / MP21-G2: two independent scans of one commit must be byte-identical for the
  // inventory and for the extracted fact set, every anchor id must be unique, and every
  // fact must cite anchors that exist.
  const [a, b] = [scan(args), scan(args)];
  const sameInventory = canonicalize(a.inventory) === canonicalize(b.inventory);
  const sameExtraction = canonicalize(a.extraction) === canonicalize(b.extraction);
  const all: Inventory = { ...a.inventory, anchors: [...a.inventory.anchors, ...a.extraction.anchors] };
  const duplicates = duplicateAnchorIds(all);
  const known = new Set(all.anchors.map((x) => x.id));
  const dangling = a.extraction.facts.filter((f) => f.anchors.length === 0 || f.anchors.some((x) => !known.has(x)));
  console.log(summary(a.inventory));
  console.log(summary(a.extraction));
  console.log(`inventory repeat scan: ${sameInventory ? "IDENTICAL" : "DIFFERENT"}`);
  console.log(`extraction repeat scan: ${sameExtraction ? "IDENTICAL" : "DIFFERENT"}`);
  console.log(duplicates.length === 0 ? "anchor ids: UNIQUE" : `anchor ids: ${duplicates.length} DUPLICATE\n  ${duplicates.join("\n  ")}`);
  console.log(dangling.length === 0 ? "fact anchors: ALL RESOLVE" : `fact anchors: ${dangling.length} fact(s) cite a missing anchor\n  ${dangling.map((f) => f.id).join("\n  ")}`);
  process.exit(sameInventory && sameExtraction && duplicates.length === 0 && dangling.length === 0 ? 0 : 1);
} else {
  console.error("usage: reflect <inventory|extract|parity|verify> [--rev <rev>] [--scope <dir>] [--out <file>]");
  process.exit(2);
}
