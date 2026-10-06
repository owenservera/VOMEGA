// Source inventory (MP21-P1): every file in scope at one commit, classified, hashed, and
// bound to stable SourceAnchors. The result is a derived build artifact — it carries no
// timestamp, machine path or ordering accident, so the same commit yields the same bytes.
import { posix } from "node:path";
import { digest } from "../../ratchet/src/canonical.ts";
import { anchorId, byString, hashBytes, type SourceAnchor } from "./anchor.ts";
import { roleOf, surfaceOf, type Role, type Surface } from "./classify.ts";
import { locateDeclarations, locateManifestSymbols, scriptKindOf, type LocatedSymbol } from "./symbols.ts";

export const INVENTORY_SCHEMA = "vomega-reflection-inventory/1";

/** One blob as stored in Git. `path` is relative to the repository root. */
export interface TreeEntry {
  path: string;
  mode: string;
  blob: string;
  bytes: Uint8Array;
}

export interface FileRecord {
  path: string;
  role: Role;
  surface: Surface;
  blob: string;
  contentHash: string;
  bytes: number;
}

/** Something the scan could not establish. Explicit so a gap is never mistaken for absence. */
export interface Unknown {
  path: string;
  reason: string;
}

export interface Inventory {
  schema: typeof INVENTORY_SCHEMA;
  repository: string;
  commit: string;
  scope: string;
  files: FileRecord[];
  anchors: SourceAnchor[];
  /** Declared-name → exported flag and syntax kinds, keyed by anchor id (declaration anchors only). */
  declarations: Record<string, { exported: boolean; declKinds: string[] }>;
  unknowns: Unknown[];
  counts: Record<string, number>;
  /** Digest of (path, contentHash) pairs only: equal across commits that leave the scope untouched. */
  treeDigest: string;
  /** Digest of everything above. Two scans of one commit must agree on it (MP21-G1). */
  digest: string;
}

export interface ScanMeta {
  repository: string;
  commit: string;
  /** Repository-relative directory the scan is limited to, without trailing slash; "" for the whole tree. */
  scope: string;
}

const decoder = new TextDecoder("utf-8", { fatal: true });

export function buildInventory(entries: TreeEntry[], meta: ScanMeta): Inventory {
  const prefix = meta.scope === "" ? "" : `${meta.scope}/`;
  const rel = (path: string) => path.slice(prefix.length);
  const sorted = [...entries].filter((e) => e.path.startsWith(prefix)).sort((a, b) => byString(a.path, b.path));

  const files: FileRecord[] = [];
  const anchors: SourceAnchor[] = [];
  const declarations: Inventory["declarations"] = {};
  const unknowns: Unknown[] = [];
  const texts = new Map<string, string>();
  const entryFiles = new Set<string>();

  for (const e of sorted) {
    const record: FileRecord = {
      path: e.path, role: roleOf(rel(e.path)), surface: surfaceOf(rel(e.path)),
      blob: e.blob, contentHash: hashBytes(e.bytes), bytes: e.bytes.length,
    };
    files.push(record);
    if (e.mode === "120000") {
      unknowns.push({ path: e.path, reason: "symbolic link; target not followed" });
      continue;
    }
    if (record.surface === "unclassified") unknowns.push({ path: e.path, reason: "no classification rule matches this path" });
    if (record.surface !== "manifest" && scriptKindOf(e.path) === undefined) continue;
    try {
      texts.set(e.path, decoder.decode(e.bytes));
    } catch {
      unknowns.push({ path: e.path, reason: "not valid UTF-8; symbols not extracted" });
    }
  }

  const base = (file: FileRecord) => ({ repository: meta.repository, commit: meta.commit, path: file.path, contentHash: file.contentHash });
  const push = (file: FileRecord, kind: "manifest" | "declaration", item: LocatedSymbol): string => {
    const id = anchorId(kind, file.path, item.symbol);
    anchors.push({ id, extractionKind: kind, ...base(file), symbol: item.symbol, spanHash: item.spanHash, range: item.range });
    return id;
  };

  for (const file of files) {
    anchors.push({ id: anchorId("file", file.path), extractionKind: "file", ...base(file) });
    const text = texts.get(file.path);
    if (text === undefined) continue;
    if (file.surface === "manifest") {
      const manifest = locateManifestSymbols(file.path, text);
      for (const item of manifest.items) push(file, "manifest", item);
      for (const problem of manifest.problems) unknowns.push({ path: file.path, reason: problem });
      if (manifest.entry !== undefined) entryFiles.add(posix.join(posix.dirname(file.path), manifest.entry));
    } else {
      const located = locateDeclarations(file.path, text);
      for (const item of located.items) {
        declarations[push(file, "declaration", item)] = { exported: item.exported, declKinds: item.declKinds };
      }
      for (const problem of located.problems) unknowns.push({ path: file.path, reason: problem });
    }
  }

  // A manifest names its own entry module; that is a declared fact, so the file is
  // reclassified. An entry that names no file in scope is reported, not ignored.
  const known = new Map(files.map((f) => [f.path, f]));
  for (const path of [...entryFiles].sort(byString)) {
    const file = known.get(path);
    if (file) file.surface = "plugin-entry";
    else unknowns.push({ path, reason: "a manifest `entry` names this file, but it is not in the scanned tree" });
  }

  anchors.sort((a, b) => byString(a.id, b.id));
  unknowns.sort((a, b) => byString(a.path, b.path) || byString(a.reason, b.reason));

  const counts: Record<string, number> = { files: files.length, anchors: anchors.length, unknowns: unknowns.length };
  const bump = (key: string) => (counts[key] = (counts[key] ?? 0) + 1);
  for (const f of files) {
    bump(`role:${f.role}`);
    bump(`surface:${f.surface}`);
    if (f.surface === "manifest") bump(`manifest:${f.role}`);
  }
  for (const a of anchors) bump(`anchor:${a.extractionKind}`);

  const body = {
    schema: INVENTORY_SCHEMA as typeof INVENTORY_SCHEMA,
    repository: meta.repository, commit: meta.commit, scope: meta.scope,
    files, anchors, declarations, unknowns, counts,
    treeDigest: digest(files.map((f) => [f.path, f.contentHash])),
  };
  return { ...body, digest: digest(body) };
}

/** Anchor ids must be unique or they are not identities. Returns the offenders. */
export function duplicateAnchorIds(inventory: Inventory): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const a of inventory.anchors) (seen.has(a.id) ? dup : seen).add(a.id);
  return [...dup].sort(byString);
}
