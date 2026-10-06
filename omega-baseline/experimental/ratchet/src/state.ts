// Task state is COMPUTED, never asserted. Inputs: the task graph, the lock,
// the latest probe, artifact checks, claims. Output: one view per task.
//
//   SUPERSEDED  lock says so, with a reason
//   REGRESSED   a promoted gate is now red or has vanished (highest priority)
//   DONE        every proof promoted/present AND an independent review accepted
//   PROVEN      every proof promoted/present; awaiting independent review
//   BLOCKED     some dependency is not PROVEN/DONE/SUPERSEDED
//   CLAIMED     dependencies satisfied, active lease held
//   OPEN        dependencies satisfied, unclaimed   (→ frontier)
//
// D1-ATOMIC-TASKS.md uses OPEN | CLAIMED | BLOCKED | DONE | SUPERSEDED; PROVEN
// and REGRESSED are added because "green but unreviewed" and "was green, now
// red" are exactly the states prose status could not represent.
import type { ClaimsFile, Claim } from "./claims.ts";
import { activeClaim, claimants } from "./claims.ts";
import type { Lock } from "./lock.ts";
import { acceptedIndependentReview, authorizedDigests } from "./lock.ts";
import type { GateObservation, Observed, ProbeResult } from "./probe.ts";
import type { ArtifactProof, RatchetSpec } from "./spec.ts";
import type { Task, TaskGraph } from "./taskgraph.ts";

export type TaskState = "OPEN" | "CLAIMED" | "BLOCKED" | "PROVEN" | "DONE" | "SUPERSEDED" | "REGRESSED";

export interface GateView {
  key: string;
  name: string;
  file: string;
  observed: Observed | "absent" | "unprobed";
  promoted: boolean;
  /** Promoted, but the gate file changed since promotion → needs re-review. */
  specChanged: boolean;
  message?: string;
}

export interface ArtifactView { proof: ArtifactProof; ok: boolean; reason?: string }

export interface TaskView {
  id: string;
  phase: string;
  outcome: string;
  acceptance: string;
  deps: string[];
  criticality: number;
  unblocks: number;
  state: TaskState;
  frontier: boolean;
  gates: GateView[];
  artifacts: ArtifactView[];
  /** No executable gate and no artifact proof: the first job is to write the falsifier. */
  missingProof: boolean;
  promotable: string[];   // gate keys green in probe but not yet promoted
  claim: Claim | null;
  notes: string[];
}

export interface StateInputs {
  graph: TaskGraph;
  spec: RatchetSpec;
  lock: Lock;
  probe: ProbeResult | null;
  claims: ClaimsFile;
  artifacts: (a: ArtifactProof) => { ok: boolean; reason?: string };
  fileDigest: (repoRel: string) => string | null;
  now: Date;
}

export function computeStates(inp: StateInputs): TaskView[] {
  const { graph, spec, lock, probe, claims, now } = inp;
  const obsByKey = new Map<string, GateObservation>((probe?.gates ?? []).map((g) => [g.key, g]));
  const gatesByTask = new Map<string, Map<string, GateView>>();

  const viewFor = (task: string, key: string, name: string, file: string): GateView => {
    const byKey = gatesByTask.get(task) ?? new Map<string, GateView>();
    gatesByTask.set(task, byKey);
    let v = byKey.get(key);
    if (!v) {
      v = { key, name, file, observed: probe ? "absent" : "unprobed", promoted: false, specChanged: false };
      byKey.set(key, v);
    }
    return v;
  };
  for (const o of probe?.gates ?? []) {
    const v = viewFor(o.task, o.key, o.name, o.file);
    v.observed = o.status;
    if (o.message !== undefined) v.message = o.message;
  }
  for (const [key, p] of Object.entries(lock.promoted)) {
    const v = viewFor(p.task, key, p.name, p.file);
    v.promoted = true;
    if (!obsByKey.has(key) && probe) v.observed = "absent";
  }
  // C1: a gate file that no longer matches its authorized digest (the initial
  // anchor, or the newest explicit spec-change) has changed — whether or not
  // any of its gates was ever promoted. Promoted gates in un-anchored files
  // fall back to the digest recorded at promotion.
  const anchors = authorizedDigests(lock);
  for (const byKey of gatesByTask.values()) {
    for (const v of byKey.values()) {
      if (Object.prototype.hasOwnProperty.call(anchors, v.file)) {
        const cur = inp.fileDigest(v.file);
        if (cur !== anchors[v.file]) v.specChanged = true; // changed, vanished or unexpectedly reappeared
      } else if (v.promoted) {
        const cur = inp.fileDigest(v.file);
        v.specChanged = cur !== null && cur !== lock.promoted[v.key]!.specDigest;
      }
    }
  }

  const views = new Map<string, TaskView>();
  for (const id of topo(graph)) views.set(id, evaluate(graph.tasks.find((x) => x.id === id)!));
  return graph.tasks.map((t) => views.get(t.id)!);

  function evaluate(t: Task): TaskView {
    const binding = spec.tasks[t.id];
    const gates = [...(gatesByTask.get(t.id)?.values() ?? [])].sort((a, b) => (a.key < b.key ? -1 : 1));
    const artifacts: ArtifactView[] = (binding?.artifacts ?? []).map((proof) => ({ proof, ...inp.artifacts(proof) }));
    const notes: string[] = [];
    const promotable = gates.filter((g) => !g.promoted && g.observed === "pass").map((g) => g.key);
    const missingProof = gates.length === 0 && artifacts.length === 0;
    const claim = activeClaim(claims, t.id, now);

    const deps = t.deps.map((d) => views.get(d)!);
    const depsOk = deps.every((d) => d.state === "PROVEN" || d.state === "DONE" || d.state === "SUPERSEDED");

    let state: TaskState;
    if (lock.superseded[t.id]) {
      state = "SUPERSEDED";
      notes.push(`superseded: ${lock.superseded[t.id]!.reason}`);
    } else if (probe && gates.some((g) => g.promoted && g.observed !== "pass")) {
      state = "REGRESSED";
      for (const g of gates.filter((x) => x.promoted && x.observed !== "pass")) notes.push(`REGRESSED ${g.key} (${g.observed})`);
    } else {
      const gatesOk = gates.every((g) => g.promoted && (probe ? g.observed === "pass" : true));
      const artifactsOk = artifacts.every((a) => a.ok);
      const proven = !missingProof && gatesOk && artifactsOk;
      if (proven && !depsOk && gates.length === 0) {
        state = "BLOCKED"; // an artifact alone cannot run ahead of the work it summarizes
      } else if (proven) {
        const review = acceptedIndependentReview(lock, t.id, claimants(claims, t.id));
        state = review ? "DONE" : "PROVEN";
        if (!review && (lock.reviews[t.id]?.length ?? 0) > 0) notes.push("latest review is not an independent accept");
        if (!depsOk) notes.push("proven ahead of its dependencies");
      } else if (!depsOk) {
        state = "BLOCKED";
      } else {
        state = claim ? "CLAIMED" : "OPEN";
      }
    }
    for (const g of gates.filter((x) => x.specChanged)) notes.push(`SPEC_CHANGED ${g.key} (re-review)`);
    if (promotable.length) notes.push(`PROMOTE_PENDING ${promotable.length}`);
    if (missingProof) notes.push("MISSING_PROOF: write the falsifier first");
    return {
      id: t.id, phase: t.phase, outcome: t.outcome, acceptance: t.acceptance, deps: t.deps,
      criticality: t.criticality, unblocks: t.unblocks,
      state, frontier: state === "OPEN", gates, artifacts, missingProof, promotable, claim, notes,
    };
  }
}

function topo(graph: TaskGraph): string[] {
  const byId = new Map(graph.tasks.map((t) => [t.id, t]));
  const done = new Set<string>();
  const out: string[] = [];
  const visit = (id: string) => {
    if (done.has(id)) return;
    done.add(id);
    for (const d of byId.get(id)!.deps) visit(d);
    out.push(id);
  };
  for (const t of graph.tasks) visit(t.id);
  return out;
}

/** Gates tagged with task ids that the graph does not contain: surfaced, never silently dropped. */
export function orphanGates(graph: TaskGraph, probe: ProbeResult | null, lock: Lock): string[] {
  const known = new Set(graph.tasks.map((t) => t.id));
  const keys = new Set<string>([...(probe?.gates ?? []).map((g) => g.key), ...Object.keys(lock.promoted)]);
  return [...keys].filter((k) => !known.has(k.split("::")[0]!)).sort();
}

export function summarize(views: TaskView[]): Record<TaskState, number> & { total: number; frontier: number; missingProof: number } {
  const s = { OPEN: 0, CLAIMED: 0, BLOCKED: 0, PROVEN: 0, DONE: 0, SUPERSEDED: 0, REGRESSED: 0, total: views.length, frontier: 0, missingProof: 0 };
  for (const v of views) {
    s[v.state]++;
    if (v.frontier) s.frontier++;
    if (v.missingProof) s.missingProof++;
  }
  return s;
}

/** Order the frontier: regressions first (never frontier, handled separately), then critical path, then unblock count. */
export function rankFrontier(views: TaskView[]): TaskView[] {
  return views
    .filter((v) => v.frontier)
    .sort((a, b) => b.criticality - a.criticality || b.unblocks - a.unblocks || (a.id < b.id ? -1 : 1));
}
