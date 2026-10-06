// Ratchet spec: the one config file that binds a deliverable's prose task list
// to its executable gates, write surfaces, artifacts and projections.
// All paths in a spec are repository-root relative and use forward slashes.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export interface ArtifactProof {
  /** Repo-relative path that must exist. */
  path: string;
  /** Optional substring that must appear in the file. */
  contains?: string;
  /** Optional dotted JSON path that must resolve to a non-null value. */
  jsonPath?: string;
}

export interface TaskBinding {
  /** Write surface: repo-relative paths or globs this task may edit. Used for fan-out disjointness. */
  surface: string[];
  /** Extra files a worker should read for this task (paths only, never pasted corpora). */
  readFirst?: string[];
  /** Non-test proofs (meta tasks: code maps, notes, evidence summaries). */
  artifacts?: ArtifactProof[];
  /** Free-form hint shown in the packet. Hints are coordination aids, not authority. */
  hint?: string;
}

export interface BaselineCommand { id: string; cwd: string; argv: string[] }

export interface RatchetSpec {
  schema: "ratchet.spec/0";
  id: string;
  title: string;
  /** Evidence class of every gate in this spec. D1 is SIMULATED by construction. */
  evidenceClass: "SIMULATED" | "FIXTURE" | "VERIFIED-LOCAL";
  taskSource: string;
  graphOut: string;
  /** Directories (repo-relative) holding gate tests. Bun runs them from `testCwd`. */
  gateDirs: string[];
  testCwd: string;
  lock: string;
  claims: string;
  board: string;
  evidence: string;
  facts?: string;
  ledgerDir: string;
  baseline: BaselineCommand[];
  /** Tasks proven by the completion record itself (excluded from the completion precondition). */
  completionTasks?: string[];
  packet: { readFirst: string[]; stopConditions: string[]; invariants: string[] };
  tasks: Record<string, TaskBinding>;
}

export interface Repo { root: string; spec: RatchetSpec; specPath: string }

/** Find the repository root: the nearest ancestor holding both `.project/` and `omega-baseline/`. */
export function findRoot(from = process.cwd()): string {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, ".project")) && existsSync(join(dir, "omega-baseline"))) return dir;
    const up = dirname(dir);
    if (up === dir) throw new Error(`ratchet: no VOMEGA root (with .project/ and omega-baseline/) above ${from}`);
    dir = up;
  }
}

export const DEFAULT_SPEC = "omega-baseline/experimental/ratchet/specs/d1/spec.json";

export function loadRepo(opts: { root?: string; spec?: string } = {}): Repo {
  const root = opts.root ?? findRoot();
  const specPath = opts.spec ?? DEFAULT_SPEC;
  const spec = JSON.parse(readFileSync(join(root, specPath), "utf8")) as RatchetSpec;
  if (spec.schema !== "ratchet.spec/0") throw new Error(`ratchet: ${specPath} is not a ratchet.spec/0 file`);
  return { root, spec, specPath };
}

export function abs(repo: Repo, rel: string): string {
  return join(repo.root, rel);
}

export function readJsonPath(value: unknown, path: string): unknown {
  let cur: unknown = value;
  for (const seg of path.split(".").filter(Boolean)) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

export function checkArtifact(root: string, a: ArtifactProof): { ok: boolean; reason?: string } {
  const p = join(root, a.path);
  if (!existsSync(p)) return { ok: false, reason: `missing ${a.path}` };
  const text = readFileSync(p, "utf8");
  if (a.contains !== undefined && !text.includes(a.contains)) return { ok: false, reason: `${a.path} lacks "${a.contains}"` };
  if (a.jsonPath !== undefined) {
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { return { ok: false, reason: `${a.path} is not JSON` }; }
    const v = readJsonPath(parsed, a.jsonPath);
    if (v === undefined || v === null) return { ok: false, reason: `${a.path} has no ${a.jsonPath}` };
  }
  return { ok: true };
}
