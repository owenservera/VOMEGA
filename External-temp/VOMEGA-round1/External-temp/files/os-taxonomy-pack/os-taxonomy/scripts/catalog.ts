// Render CATALOG.md (human-readable index) from the database.
//   bun run packs/os-taxonomy/scripts/catalog.ts
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPABILITIES, TAXONOMY, coverage, realizationsFor } from "../src/db.ts";

const cov = coverage("windows");
const L: string[] = [
  `# ${TAXONOMY.name} — Catalog`, "",
  `Taxonomy ${TAXONOMY.taxonomyVersion}. ${TAXONOMY.status}`, "",
  `**${cov.capabilities} capabilities** in ${TAXONOMY.domains.length} domains · Windows: ${cov.realizationFidelity["exact"]} exact, ${cov.realizationFidelity["approximate"]} approximate, ${cov.realizationFidelity["handoff"]} hand-off (preferred realization). Average-user inventory: ${cov.inventory.tasks} tasks, ${Math.round(cov.inventory.actionableShare * 100)}% actionable, ${Math.round(cov.inventory.exactShare * 100)}% exact. All realizations are \`authored\` — none verified on Windows yet.`, "",
  "Legend — risk: **R** read · **M** reversible change (journaled) · **X** consent required. Fidelity: ✅ exact · ≈ approximate · ↗ hand-off (opens the right place for the user).", "",
];
for (const d of TAXONOMY.domains) {
  const caps = CAPABILITIES.filter((c) => c.domain === d.id);
  L.push(`## ${d.title} (${caps.length})`, "", d.summary, "", "| Capability | Say it like | Params | Risk | Windows |", "| --- | --- | --- | --- | --- |");
  for (const c of caps) {
    const r = realizationsFor(c.id, "windows")[0];
    const f = r ? ({ exact: "✅", approximate: "≈", handoff: "↗" } as Record<string, string>)[r.fidelity] + ` ${r.strategy}${r.elevation === "admin" ? " (admin)" : ""}` : "—";
    const risk = { READ: "R", MUTATION: "M", EXTERNAL_MUTATION: "X" }[c.risk];
    L.push(`| \`${c.id}\`<br>${c.title} | ${c.examples[0]} | ${c.params.map((p) => p.name + (p.required ? "" : "?")).join(", ") || "—"} | ${risk} | ${f} |`);
  }
  L.push("");
}
writeFileSync(join(import.meta.dir, "../CATALOG.md"), L.join("\n"));
console.log("wrote CATALOG.md");
