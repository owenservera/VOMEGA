// Reads a tree straight from Git objects, never from the working directory. A scan is
// therefore pinned to a commit by construction: uncommitted edits, checkout line endings
// and untracked files cannot leak into it.
import type { ScanMeta, TreeEntry } from "./inventory.ts";

function git(cwd: string, args: string[], stdin?: Uint8Array): Uint8Array {
  const r = Bun.spawnSync(["git", ...args], { cwd, stdin: stdin ?? "ignore", stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr.toString().trim()}`);
  return r.stdout;
}

const text = (b: Uint8Array) => new TextDecoder().decode(b);

export function repoRoot(cwd: string): string {
  return text(git(cwd, ["rev-parse", "--show-toplevel"])).trim();
}

/**
 * `host/owner/repo` from a remote URL, so the https and ssh forms of one remote agree and
 * no credential embedded in a URL is ever copied into an artifact.
 */
export function normalizeRemote(url: string): string {
  const trimmed = url.trim().replace(/\.git$/, "").replace(/\/+$/, "");
  const scp = /^[^@/\s]+@([^:/\s]+):(.+)$/.exec(trimmed);
  if (scp) return `${scp[1]}/${scp[2]}`.toLowerCase();
  const web = /^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]*@)?([^/]+)\/(.+)$/i.exec(trimmed);
  if (web) return `${web[1]}/${web[2]}`.toLowerCase();
  return "local";
}

export function repositoryName(root: string): string {
  try {
    return normalizeRemote(text(git(root, ["config", "--get", "remote.origin.url"])));
  } catch {
    return "local";
  }
}

export function readTree(root: string, rev: string, scope: string): { entries: TreeEntry[]; meta: ScanMeta } {
  const commit = text(git(root, ["rev-parse", "--verify", `${rev}^{commit}`])).trim();
  const listing = text(git(root, ["ls-tree", "-r", "-z", "--full-tree", commit, ...(scope ? ["--", scope] : [])]));
  const blobs = listing.split("\0").filter(Boolean).flatMap((line) => {
    const tab = line.indexOf("\t");
    const [mode, type, oid] = line.slice(0, tab).split(" ");
    return type === "blob" ? [{ path: line.slice(tab + 1), mode: mode!, blob: oid! }] : [];
  });

  // One process for every blob. Output per object: "<oid> blob <size>\n<bytes>\n".
  const out = git(root, ["cat-file", "--batch"], new TextEncoder().encode(blobs.map((b) => b.blob).join("\n") + "\n"));
  const entries: TreeEntry[] = [];
  let at = 0;
  for (const b of blobs) {
    const eol = out.indexOf(10, at);
    const [oid, type, size] = text(out.subarray(at, eol)).split(" ");
    if (oid !== b.blob || type !== "blob") throw new Error(`git cat-file: unexpected header for ${b.path}`);
    const start = eol + 1;
    const end = start + Number(size);
    entries.push({ ...b, bytes: out.slice(start, end) });
    at = end + 1;
  }
  return { entries, meta: { repository: repositoryName(root), commit, scope } };
}
