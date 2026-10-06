// Regenerate plugin.json and compositions/os.json from the database.
//   bun run packs/os-taxonomy/scripts/generate.ts
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildComposition, buildManifest } from "../src/manifest.ts";
import { validateDatabase } from "../src/db.ts";

const errs = validateDatabase();
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
const PACK = join(import.meta.dir, "..");
writeFileSync(join(PACK, "plugin.json"), JSON.stringify(buildManifest(), null, 2) + "\n");
writeFileSync(join(PACK, "../../compositions/os.json"), JSON.stringify(buildComposition(), null, 2) + "\n");
console.log("wrote plugin.json and compositions/os.json");
