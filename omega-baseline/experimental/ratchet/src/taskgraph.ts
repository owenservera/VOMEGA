// Task graph compiler. The atomic-task Markdown stays the human source of
// intent; this module derives a machine graph from it deterministically. The
// graph is a projection: regenerate it, never hand-edit it, and let
// `ratchet check` fail when the committed JSON is stale.
import { digestText } from "./canonical.ts";

export interface Task {
  id: string;
  phase: string;        // "A"
  phaseTitle: string;   // "establish executable truth"
  outcome: string;
  deps: string[];
  acceptance: string;
  /** Longest dependency chain from this task to any sink (critical-path weight). */
  criticality: number;
  /** Number of tasks transitively waiting on this one. */
  unblocks: number;
}

export interface TaskGraph {
  schema: "ratchet.taskgraph/0";
  source: { path: string; digest: string };
  tasks: Task[];
}

const PHASE_RE = /^##\s+Phase\s+([A-Z])\s+[—–-]\s+(.+?)\s*$/;
const ROW_RE = /^\|\s*([A-Z][A-Z0-9]*-\d{3}[A-Z]?)\s*\|(.*)\|\s*$/;
const ID_RE = /^[A-Z][A-Z0-9]*-\d{3}[A-Z]?$/;

export function parseTaskMarkdown(markdown: string, sourcePath: string): TaskGraph {
  const raw: Omit<Task, "criticality" | "unblocks">[] = [];
  let phase = "", phaseTitle = "";
  for (const line of markdown.split(/\r?\n/).map((l) => l.trimEnd())) {
    const p = PHASE_RE.exec(line);
    if (p) { phase = p[1]!; phaseTitle = p[2]!; continue; }
    if (line.startsWith("## ")) { phase = ""; phaseTitle = ""; continue; }
    const r = ROW_RE.exec(line);
    if (!r || !phase) continue;
    const cols = splitRow(r[2]!);
    if (cols.length < 3) throw new Error(`taskgraph: malformed row for ${r[1]}: expected outcome | deps | acceptance`);
    const [outcome, depsCol, ...rest] = cols;
    raw.push({ id: r[1]!, phase, phaseTitle, outcome: outcome!, deps: parseDeps(depsCol!), acceptance: rest.join(" | ") });
  }
  if (raw.length === 0) throw new Error(`taskgraph: no phase tables found in ${sourcePath}`);
  return finalize(raw, { path: sourcePath, digest: digestText(markdown) });
}

/** Split table cells on pipes that are not escaped and not inside backticks. */
function splitRow(body: string): string[] {
  const cells: string[] = [];
  let cur = "", tick = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]!;
    if (ch === "`") tick = !tick;
    if (ch === "|" && !tick && body[i - 1] !== "\\") { cells.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

export function parseDeps(col: string): string[] {
  const c = col.trim();
  if (c === "" || c === "—" || c === "-" || c === "–") return [];
  const out: string[] = [];
  for (const part of c.split(/[,\s]+/).filter(Boolean)) {
    const range = /^([A-Z][A-Z0-9]*)-(\d{3})\.\.(\d{3})$/.exec(part);
    if (range) {
      const [, ns, a, b] = range;
      for (let n = Number(a); n <= Number(b); n++) out.push(`${ns}-${String(n).padStart(3, "0")}`);
      continue;
    }
    if (!ID_RE.test(part)) throw new Error(`taskgraph: unparseable dependency "${part}"`);
    out.push(part);
  }
  return out;
}

function finalize(raw: Omit<Task, "criticality" | "unblocks">[], source: TaskGraph["source"]): TaskGraph {
  const byId = new Map<string, Omit<Task, "criticality" | "unblocks">>();
  for (const t of raw) {
    if (byId.has(t.id)) throw new Error(`taskgraph: duplicate task ${t.id}`);
    byId.set(t.id, t);
  }
  const dependents = new Map<string, string[]>();
  for (const t of raw) {
    for (const d of t.deps) {
      if (!byId.has(d)) throw new Error(`taskgraph: ${t.id} depends on unknown ${d}`);
      dependents.set(d, [...(dependents.get(d) ?? []), t.id]);
    }
  }
  const crit = new Map<string, number>();
  const visiting = new Set<string>();
  const longest = (id: string): number => {
    const known = crit.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) throw new Error(`taskgraph: dependency cycle through ${id}`);
    visiting.add(id);
    const kids = dependents.get(id) ?? [];
    const v = kids.length === 0 ? 1 : 1 + Math.max(...kids.map(longest));
    visiting.delete(id);
    crit.set(id, v);
    return v;
  };
  const reach = (id: string, seen = new Set<string>()): Set<string> => {
    for (const k of dependents.get(id) ?? []) if (!seen.has(k)) { seen.add(k); reach(k, seen); }
    return seen;
  };
  const tasks: Task[] = raw.map((t) => ({ ...t, criticality: longest(t.id), unblocks: reach(t.id).size }));
  return { schema: "ratchet.taskgraph/0", source, tasks };
}

export function topoOrder(graph: TaskGraph): string[] {
  const done = new Set<string>();
  const out: string[] = [];
  const byId = new Map(graph.tasks.map((t) => [t.id, t]));
  const visit = (id: string) => {
    if (done.has(id)) return;
    done.add(id);
    for (const d of byId.get(id)!.deps) visit(d);
    out.push(id);
  };
  for (const t of graph.tasks) visit(t.id);
  return out;
}
