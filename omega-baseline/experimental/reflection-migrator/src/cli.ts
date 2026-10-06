// reflect — Reflection Migrator CLI (MP-21). Read-only over source; the only thing it can
// write is the artifact named by --out.
//
//   bun run reflect inventory [--rev HEAD] [--scope omega-baseline] [--out <file>]
//   bun run reflect verify    [--rev HEAD] [--scope omega-baseline]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { canonicalize, short } from "../../ratchet/src/canonical.ts";
import { readTree, repoRoot } from "./git.ts";
import { buildInventory, duplicateAnchorIds, type Inventory } from "./inventory.ts";

function option(args: string[], name: string, fallback: string): string {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1]! : fallback;
}

function scan(args: string[]): Inventory {
  const root = repoRoot(process.cwd());
  const { entries, meta } = readTree(root, option(args, "rev", "HEAD"), option(args, "scope", "omega-baseline"));
  return buildInventory(entries, meta);
}

function summary(inv: Inventory): string {
  const lines = [
    `${inv.repository} @ ${inv.commit.slice(0, 12)} scope=${inv.scope || "."}`,
    `digest ${short(inv.digest)}  tree ${short(inv.treeDigest)}`,
    ...Object.keys(inv.counts).sort().map((k) => `  ${k.padEnd(26)} ${inv.counts[k]}`),
  ];
  return lines.join("\n");
}

const [command = "", ...args] = process.argv.slice(2);

if (command === "inventory") {
  const inv = scan(args);
  console.log(summary(inv));
  for (const u of inv.unknowns) console.log(`  unknown: ${u.path} — ${u.reason}`);
  const out = option(args, "out", "");
  if (out) {
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(resolve(out), canonicalize(inv) + "\n");
    console.log(`wrote ${out}`);
  }
} else if (command === "verify") {
  // MP21-G1: two independent scans of one commit must be byte-identical, and every
  // anchor id must be unique.
  const [a, b] = [scan(args), scan(args)];
  const identical = canonicalize(a) === canonicalize(b);
  const duplicates = duplicateAnchorIds(a);
  console.log(summary(a));
  console.log(identical ? "repeat scan: IDENTICAL" : `repeat scan: DIFFERENT (${short(a.digest)} vs ${short(b.digest)})`);
  console.log(duplicates.length === 0 ? "anchor ids: UNIQUE" : `anchor ids: ${duplicates.length} DUPLICATE\n  ${duplicates.join("\n  ")}`);
  process.exit(identical && duplicates.length === 0 ? 0 : 1);
} else {
  console.error("usage: reflect <inventory|verify> [--rev <rev>] [--scope <dir>] [--out <file>]");
  process.exit(2);
}
