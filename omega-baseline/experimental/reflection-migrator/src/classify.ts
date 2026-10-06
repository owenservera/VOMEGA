// File classification by path (MP21-P1). Purely mechanical: a rule either matches the
// path or the file is reported `unclassified` — nothing is guessed from content here.
//
// Content-level surfaces from the migrator doc §5 (op registration, schemas, config
// parsing, language frames, visual contracts) are facts INSIDE files, so they belong to
// the P2 extractors, not to this table. The one content-derived surface is `plugin-entry`,
// which a manifest's own `entry` field names (see inventory.ts).

export const ROLES = ["source", "test", "fixture"] as const;
export type Role = (typeof ROLES)[number];

export const SURFACES = [
  "manifest", "package", "contract", "plugin-entry", "plugin-source", "runtime-source",
  "surface-source", "composition", "genome", "experimental", "doc", "repo-config", "unclassified",
] as const;
export type Surface = (typeof SURFACES)[number];

/** Fixtures and tests are real files but not product declarations; consumers must be able to tell. */
export function roleOf(path: string): Role {
  const segments = path.split("/");
  if (segments.includes("fixtures")) return "fixture";
  if (segments.includes("test") || /\.test\.[cm]?[jt]sx?$/.test(path)) return "test";
  return "source";
}

const RULES: Array<[RegExp, Surface]> = [
  [/(^|\/)plugin\.json$/, "manifest"],
  [/(^|\/)package\.json$/, "package"],
  [/^experimental\//, "experimental"],
  [/\.md$/, "doc"],
  [/^contracts\//, "contract"],
  [/^(plugins|packs)\//, "plugin-source"],
  [/^(host|shim|shims|platform|sdk|testkit)\//, "runtime-source"],
  [/^surfaces\//, "surface-source"],
  [/^compositions\//, "composition"],
  [/^genome\//, "genome"],
  [/^[^/]+$/, "repo-config"],
];

/** `path` is relative to the scan scope (e.g. `plugins/vivim-law/plugin.json`). */
export function surfaceOf(path: string): Surface {
  for (const [pattern, surface] of RULES) if (pattern.test(path)) return surface;
  return "unclassified";
}
