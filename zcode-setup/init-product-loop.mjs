#!/usr/bin/env node
// Idempotent DESK file initialization. NO ZCode scheduling, auth, code edits or status claims.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const roster = JSON.parse(readFileSync(join(home, "zcode-setup/product-loop-lanes.json"), "utf8"));
const apply = process.argv.includes("--apply");
const known = new Set(["devdrain", "devops", "pm", "council"]);
const names = new Set();
if (roster.schema !== "vomega.product-loop-lanes/1" || !Array.isArray(roster.lanes)) throw Error("Unexpected roster");
for (const lane of roster.lanes) {
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(lane.key) || names.has(lane.key)) throw Error("Invalid/duplicate lane key");
  names.add(lane.key);
}
const desk = join(home, ".project/staff/DESK");
if (!existsSync(join(desk, "README.md"))) throw Error("DESK contract not found: use VOMEGA primary checkout");
let missing = 0;
for (const lane of roster.lanes) {
  if (known.has(lane.key)) continue; // Never modify existing lane files.
  for (const [subdir, name] of [["inbox", lane.key], ["replies", lane.key], ["status", lane.key]]) {
    const dir = join(desk, subdir);
    const target = join(dir, name + ".jsonl");
    if (existsSync(target)) { console.log("KEEP " + target); continue; }
    missing++;
    console.log((apply ? "CREATE " : "WOULD CREATE ") + target);
    if (apply) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(target, "", { flag: "wx" }); // Must not truncate any live messages.
    }
  }
}
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", newLanes: roster.lanes.filter(l => !known.has(l.key)).length, missingFiles: missing, schedulesCreated: 0 }));
