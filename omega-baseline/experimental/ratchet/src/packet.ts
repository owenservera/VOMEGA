// Task packets: everything a fresh worker (Codex, Claude Code, ZCode, a human)
// needs to move ONE task from red to green, derived from repo state rather than
// a coordinator's memory. A packet names the failing gates, the write surface,
// the files to read, the verify command and the stop conditions. Paths only —
// never pasted corpora.
import type { RatchetSpec } from "./spec.ts";
import type { TaskView } from "./state.ts";
import { rankFrontier } from "./state.ts";

export interface Packet {
  task: string;
  phase: string;
  outcome: string;
  acceptance: string;
  state: string;
  deps: string[];
  surface: string[];
  readFirst: string[];
  failingGates: Array<{ key: string; file: string; observed: string; message?: string }>;
  artifacts: Array<{ path: string; ok: boolean; reason?: string }>;
  missingProof: boolean;
  hint?: string;
  commands: { verify: string; promote: string; release: string };
  stopConditions: string[];
  invariants: string[];
}

const RATCHET = "bun run ratchet";

export function buildPacket(view: TaskView, spec: RatchetSpec): Packet {
  const b = spec.tasks[view.id];
  const p: Packet = {
    task: view.id,
    phase: view.phase,
    outcome: view.outcome,
    acceptance: view.acceptance,
    state: view.state,
    deps: view.deps,
    surface: b?.surface ?? [],
    readFirst: [...new Set([...spec.packet.readFirst, ...(b?.readFirst ?? [])])],
    failingGates: view.gates
      .filter((g) => !(g.promoted && g.observed === "pass"))
      .map((g) => ({ key: g.key, file: g.file, observed: g.observed, ...(g.message !== undefined ? { message: g.message } : {}) })),
    artifacts: view.artifacts.map((a) => ({ path: a.proof.path, ok: a.ok, ...(a.reason !== undefined ? { reason: a.reason } : {}) })),
    missingProof: view.missingProof,
    commands: {
      verify: `${RATCHET} verify ${view.id}`,
      promote: `${RATCHET} promote --task ${view.id} --by <your-label>`,
      release: `${RATCHET} release ${view.id} --by <your-label>`,
    },
    stopConditions: spec.packet.stopConditions,
    invariants: spec.packet.invariants,
  };
  if (b?.hint !== undefined) p.hint = b.hint;
  return p;
}

export function renderPacket(p: Packet, spec: RatchetSpec): string {
  const L: string[] = [];
  L.push(`# ${p.task} — ${p.outcome}`);
  L.push("");
  L.push(`Deliverable: ${spec.title} · phase ${p.phase} · computed state **${p.state}** · evidence class **${spec.evidenceClass}**`);
  L.push("");
  L.push(`**Acceptance (prose source):** ${p.acceptance}`);
  L.push("");
  L.push(`**Depends on:** ${p.deps.length ? p.deps.join(", ") : "nothing"}`);
  if (p.hint) { L.push(""); L.push(`**Hint (coordination aid, not authority):** ${p.hint}`); }
  L.push("");
  L.push("## Definition of done (executable)");
  L.push("");
  if (p.missingProof) {
    L.push("This task has **no executable gate**. First add one `gate(\"" + p.task + "\", ...)` test that fails today and expresses the acceptance above, then make it pass.");
  } else {
    L.push("The task is done for you when every gate below passes in probe mode and the artifacts exist:");
    L.push("");
    for (const g of p.failingGates) L.push(`- \`${g.key}\` — ${g.file} (now: ${g.observed}${g.message ? `; ${g.message.replace(/\s+/g, " ").slice(0, 160)}` : ""})`);
    for (const a of p.artifacts) L.push(`- artifact \`${a.path}\` — ${a.ok ? "present" : a.reason}`);
    if (p.failingGates.length === 0 && p.artifacts.every((a) => a.ok)) L.push("- all proofs already green: promote, then request independent review");
  }
  L.push("");
  L.push("## Write surface (edit only these unless you record why)");
  L.push("");
  for (const s of p.surface.length ? p.surface : ["(unspecified — treat as conflicting with every other task)"]) L.push(`- \`${s}\``);
  L.push("");
  L.push("## Read first (paths only)");
  L.push("");
  for (const r of p.readFirst) L.push(`- \`${r}\``);
  L.push("");
  L.push("## Loop");
  L.push("");
  L.push("```sh");
  L.push("cd omega-baseline");
  L.push(`${p.commands.verify}      # probe this task's gates (raw truth)`);
  L.push("# implement until verify is green; do not weaken or delete a gate to get there");
  L.push(`${p.commands.promote}   # ratchet the green gates (they must stay green forever)`);
  L.push("bun run ratchet sync            # refresh board + evidence projections");
  L.push("```");
  L.push("");
  L.push("A different worker reviews: `bun run ratchet review " + p.task + " --by <other-label>`. Reviewers who promoted or claimed the task are rejected by the tool.");
  L.push("");
  L.push("## Stop conditions");
  L.push("");
  for (const s of p.stopConditions) L.push(`- ${s}`);
  L.push("");
  L.push("## Distinctions that must survive");
  L.push("");
  for (const s of p.invariants) L.push(`- ${s}`);
  L.push("");
  return L.join("\n");
}

/** Surface prefixes: the literal path part before the first wildcard. */
export function surfacePrefix(glob: string): string {
  const i = glob.search(/[*?[{]/);
  return (i < 0 ? glob : glob.slice(0, i)).replace(/\/+$/, "");
}

const isGlob = (s: string): boolean => /[*?[{]/.test(s);

/** Could these two declared surfaces name a common file? Unknown ⇒ conflict (conservative). */
function pairOverlaps(x: string, y: string): boolean {
  if (x === "" || y === "") return true;
  const px = surfacePrefix(x);
  const py = surfacePrefix(y);
  if (px === "" || py === "" || px === py || px.startsWith(py + "/") || py.startsWith(px + "/")) return true;
  // A wildcard surface may match the other surface's file or its literal prefix.
  const gx = isGlob(x) ? new Bun.Glob(x) : null;
  const gy = isGlob(y) ? new Bun.Glob(y) : null;
  try {
    if (gx && (gx.match(y) || gx.match(px))) return true;
    if (gy && (gy.match(x) || gy.match(py))) return true;
  } catch {
    return true; // an unparseable pattern conflicts with everything
  }
  return false;
}

export function surfacesOverlap(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return true; // unknown surface conflicts with everything
  for (const x of a) for (const y of b) if (pairOverlaps(x, y)) return true;
  return false;
}

/** Greedy fan-out: highest-criticality frontier tasks whose write surfaces are pairwise disjoint. */
export function planFanout(views: TaskView[], spec: RatchetSpec, n: number): TaskView[] {
  const chosen: TaskView[] = [];
  for (const v of rankFrontier(views)) {
    if (chosen.length >= n) break;
    const s = spec.tasks[v.id]?.surface ?? [];
    if (chosen.every((c) => !surfacesOverlap(s, spec.tasks[c.id]?.surface ?? []))) chosen.push(v);
  }
  return chosen;
}
