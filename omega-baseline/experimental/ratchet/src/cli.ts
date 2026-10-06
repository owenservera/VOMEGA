#!/usr/bin/env bun
// ratchet — executable build control for VOMEGA deliverables.
//
//   bun run ratchet <command> [options]        (from omega-baseline/)
//
// Observation:  graph · probe · status · verify · drift · check
// Work:         next · packet · fanout · claim · release
// Ratchet:      promote · review · supersede · complete
// Projection:   board · evidence · baseline · sync · ledger
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { canonicalize, digestText, short } from "./canonical.ts";
import { claim, claimants, parseTtl, readClaims, release, writeClaims } from "./claims.ts";
import type { FactsFile } from "./drift.ts";
import { runFacts } from "./drift.ts";
import { authorsOf, authorizedDigests, gateKey, normalizeLabel, readLock, writeLock } from "./lock.ts";
import type { Lock } from "./lock.ts";
import { buildPacket, planFanout, renderPacket } from "./packet.ts";
import { gitDirty, gitHead, runProbe } from "./probe.ts";
import type { ProbeResult } from "./probe.ts";
import type { BaselineRun } from "./project.ts";
import { appendLedger, buildEvidence, parseBunSummary, readLedger, renderBoard, verifyLedger } from "./project.ts";
import type { Repo } from "./spec.ts";
import { abs, checkArtifact, loadRepo } from "./spec.ts";
import { computeStates, orphanGates, rankFrontier, summarize } from "./state.ts";
import type { TaskView } from "./state.ts";
import type { TaskGraph } from "./taskgraph.ts";
import { parseTaskMarkdown } from "./taskgraph.ts";

interface Args { _: string[]; flags: Record<string, string | true> }

function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=", 2) as [string, string | undefined];
      if (v !== undefined) out.flags[k] = v;
      else if (argv[i + 1] !== undefined && !argv[i + 1]!.startsWith("--")) out.flags[k] = argv[++i]!;
      else out.flags[k] = true;
    } else out._.push(a);
  }
  return out;
}

class Usage extends Error {}
const str = (a: Args, k: string): string | undefined => (typeof a.flags[k] === "string" ? (a.flags[k] as string) : undefined);
const need = (a: Args, k: string): string => {
  const v = str(a, k);
  if (!v) throw new Usage(`--${k} is required`);
  return v;
};

// ---------------------------------------------------------------- context

function graphOf(repo: Repo): TaskGraph {
  const src = readFileSync(abs(repo, repo.spec.taskSource), "utf8");
  return parseTaskMarkdown(src, repo.spec.taskSource);
}

function probePath(repo: Repo): string {
  return join(repo.root, repo.spec.ledgerDir, "last-probe.json");
}
function ledgerPath(repo: Repo): string {
  return join(repo.root, repo.spec.ledgerDir, "ledger.jsonl");
}

function lastProbe(repo: Repo): ProbeResult | null {
  const p = probePath(repo);
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as ProbeResult) : null;
}

function probe(repo: Repo, quiet = false): ProbeResult {
  if (!quiet) process.stderr.write(`ratchet: probing ${repo.spec.gateDirs.join(", ")} …\n`);
  const r = runProbe(repo);
  mkdirSync(dirname(probePath(repo)), { recursive: true });
  writeFileSync(probePath(repo), JSON.stringify(r, null, 2) + "\n");
  appendLedger(ledgerPath(repo), "probe", r.head, { digest: r.digest, totals: r.totals, silentFiles: r.silentFiles, exitCode: r.exitCode });
  return r;
}

function fileDigest(repo: Repo) {
  return (rel: string): string | null => {
    const p = abs(repo, rel);
    // Normalize CRLF so a gate file's digest is the same on a fresh Windows checkout
    // (core.autocrlf=true) as in the repository — otherwise every anchor would drift.
    return existsSync(p) ? digestText(readFileSync(p, "utf8").replace(/\r\n/g, "\n")) : null;
  };
}

/** All files under the spec's gate dirs (gate tests AND their shared helpers/support). */
function anchorFiles(repo: Repo): string[] {
  const out = new Set<string>();
  for (const dir of repo.spec.gateDirs) {
    for (const f of new Bun.Glob("**/*").scanSync({ cwd: join(repo.root, dir) })) {
      const rel = `${dir}/${f.replaceAll("\\", "/")}`;
      try { if (statSync(abs(repo, rel)).isFile()) out.add(rel); } catch { /* skip */ }
    }
  }
  return [...out].sort();
}

/** Digests of every gate/spec file currently on disk (repo-relative path → digest). */
function gateFileDigests(repo: Repo): Record<string, string> {
  const fd = fileDigest(repo);
  const out: Record<string, string> = {};
  for (const f of anchorFiles(repo)) {
    const d = fd(f);
    if (d !== null) out[f] = d;
  }
  return out;
}

/**
 * C1 anchor drift, per gate/spec file: an anchored file is `changed` or
 * `vanished` when its on-disk digest differs from the authorized digest;
 * `unanchored` lists gate files that were never anchored (new spec files).
 */
function anchorDrift(repo: Repo, lock: Lock): { changed: string[]; vanished: string[]; unanchored: string[] } {
  const authorized = authorizedDigests(lock);
  const fd = fileDigest(repo);
  const changed: string[] = [];
  const vanished: string[] = [];
  for (const [file, want] of Object.entries(authorized)) {
    const cur = fd(file);
    if (want === null) { if (cur !== null) changed.push(file); }        // authorized deleted but present
    else if (cur === null) vanished.push(file);                          // present at anchor, now gone
    else if (cur !== want) changed.push(file);
  }
  const onDisk = new Set(anchorFiles(repo));
  const unanchored = [...onDisk].filter((f) => !Object.prototype.hasOwnProperty.call(authorized, f)).sort();
  return { changed: changed.sort(), vanished: vanished.sort(), unanchored };
}

function states(repo: Repo, pr: ProbeResult | null, now = new Date()): { graph: TaskGraph; views: TaskView[] } {
  const graph = graphOf(repo);
  const views = computeStates({
    graph,
    spec: repo.spec,
    lock: readLock(abs(repo, repo.spec.lock), repo.spec.id),
    probe: pr,
    claims: readClaims(abs(repo, repo.spec.claims)),
    artifacts: (a) => checkArtifact(repo.root, a),
    fileDigest: fileDigest(repo),
    now,
  });
  return { graph, views };
}

function findTask(views: TaskView[], id: string): TaskView {
  const v = views.find((x) => x.id === id);
  if (!v) throw new Usage(`unknown task ${id}`);
  return v;
}

const out = (x: unknown) => process.stdout.write((typeof x === "string" ? x : JSON.stringify(x, null, 2)) + "\n");

/** Compare a checked-out file's text to freshly generated text, ignoring CRLF (Windows core.autocrlf). */
const sameText = (fileText: string, generated: string): boolean => fileText.replace(/\r\n/g, "\n") === generated;

/** Drop environment-volatile fields so a projection's state-bearing content can be compared across HEAD/bun/platform. */
function stripVolatile(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stripVolatile);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      if (k === "digest" || k === "head" || k === "bun" || k === "platform") continue;
      out[k] = stripVolatile(val);
    }
    return out;
  }
  return v;
}

// ---------------------------------------------------------------- commands

type Cmd = (repo: Repo, a: Args) => number;

const commands: Record<string, { help: string; run: Cmd }> = {
  graph: {
    help: "graph [--check]           derive the task graph JSON from the task Markdown (check: fail if committed JSON is stale)",
    run(repo, a) {
      const g = graphOf(repo);
      const target = abs(repo, repo.spec.graphOut);
      const text = JSON.stringify(g, null, 2) + "\n";
      if (a.flags.check) {
        const cur = existsSync(target) ? readFileSync(target, "utf8") : "";
        if (!sameText(cur, text)) { out(`TASKGRAPH_STALE ${repo.spec.graphOut} — run: bun run ratchet graph`); return 1; }
        out(`graph fresh: ${g.tasks.length} tasks, source ${short(g.source.digest)}`);
        return 0;
      }
      writeFileSync(target, text);
      out(`wrote ${repo.spec.graphOut}: ${g.tasks.length} tasks`);
      return 0;
    },
  },

  probe: {
    help: "probe [--json]            run every gate in raw-truth mode; record the observation (never edits the lock)",
    run(repo, a) {
      const r = probe(repo);
      if (a.flags.json) out(r);
      else out(`probe ${short(r.digest)} @ ${r.head}: ${r.totals.pass}/${r.totals.gates} gates green, ${r.totals.fail} red${r.silentFiles.length ? `, ${r.silentFiles.length} silent file(s): ${r.silentFiles.join(", ")}` : ""}`);
      return 0;
    },
  },

  status: {
    help: "status [--probe] [--json] computed task states (uses the last probe unless --probe)",
    run(repo, a) {
      const pr = a.flags.probe ? probe(repo) : lastProbe(repo);
      const { views } = states(repo, pr);
      if (a.flags.json) { out({ summary: summarize(views), tasks: views }); return 0; }
      const s = summarize(views);
      const lock = readLock(abs(repo, repo.spec.lock), repo.spec.id);
      out(`${repo.spec.title}`);
      out(`probe: ${pr ? `${pr.head} (${pr.totals.pass}/${pr.totals.gates} green)` : "none — run: bun run ratchet probe"}`);
      if (pr && pr.head !== "unknown" && pr.head !== gitHead(repo.root)) out(`note: last probe was at ${pr.head} but HEAD is ${gitHead(repo.root)} — states may be stale; run: bun run ratchet probe`);
      out(`DONE ${s.DONE} · PROVEN ${s.PROVEN} · OPEN ${s.OPEN} · CLAIMED ${s.CLAIMED} · BLOCKED ${s.BLOCKED} · REGRESSED ${s.REGRESSED} · SUPERSEDED ${s.SUPERSEDED} · frontier ${s.frontier} · missing proof ${s.missingProof}`);
      // C4: keep the four interpretations separate; never let one imply another.
      out(`interpretation — ratchet-mode suite green ≠ deliverable works (open gates are expected failures). probe truth: ${pr ? `${pr.totals.pass}/${pr.totals.gates} gates actually pass` : "unprobed"}.`);
      out(`  semantic completion (all gates green): ${pr && pr.totals.gates > 0 && pr.totals.fail === 0 && pr.totals.skip === 0 && pr.silentFiles.length === 0 ? "yes" : "no"} · reviewed completion (completion record): ${lock.completion ? `yes @ ${lock.completion.head}` : "no"}`);
      for (const v of views.filter((x) => x.state === "REGRESSED")) out(`  REGRESSED ${v.id}: ${v.notes.join("; ")}`);
      for (const v of rankFrontier(views).slice(0, 8)) out(`  ★ ${v.id} ${v.outcome} (crit ${v.criticality})`);
      return 0;
    },
  },

  verify: {
    help: "verify <TASK>             probe and report one task's gates and artifacts (exit 0 iff all green)",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const pr = probe(repo, true);
      const v = findTask(states(repo, pr).views, id);
      out(`${v.id} ${v.state} — ${v.outcome}`);
      for (const g of v.gates) out(`  ${g.observed === "pass" ? "✓" : "✗"} ${g.promoted ? "[promoted] " : ""}${g.name}${g.message ? `\n      ${g.message.replace(/\s+/g, " ").slice(0, 200)}` : ""}`);
      for (const ar of v.artifacts) out(`  ${ar.ok ? "✓" : "✗"} artifact ${ar.proof.path}${ar.reason ? ` — ${ar.reason}` : ""}`);
      if (v.missingProof) { out("  ✗ no gate or artifact proves this task yet"); return 1; }
      const green = v.gates.every((g) => g.observed === "pass") && v.artifacts.every((x) => x.ok);
      return green ? 0 : 1;
    },
  },

  next: {
    help: "next [--json]             the single highest-value frontier task, as a packet",
    run(repo, a) {
      const { views } = states(repo, lastProbe(repo));
      const reg = views.find((v) => v.state === "REGRESSED");
      const pick = reg ?? rankFrontier(views)[0];
      if (!pick) { out("frontier empty: everything is claimed, blocked, proven or done"); return 0; }
      const p = buildPacket(pick, repo.spec);
      out(a.flags.json ? p : renderPacket(p, repo.spec));
      return 0;
    },
  },

  packet: {
    help: "packet <TASK> [--json]    the worker packet for one task",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const p = buildPacket(findTask(states(repo, lastProbe(repo)).views, id), repo.spec);
      out(a.flags.json ? p : renderPacket(p, repo.spec));
      return 0;
    },
  },

  fanout: {
    help: "fanout [--n 4] [--write DIR] parallel frontier tasks with disjoint write surfaces (optionally write packets)",
    run(repo, a) {
      const n = Number(str(a, "n") ?? 4);
      const { views } = states(repo, lastProbe(repo));
      const plan = planFanout(views, repo.spec, n);
      const dir = str(a, "write");
      for (const v of plan) {
        out(`${v.id}\t${v.outcome}\t${(repo.spec.tasks[v.id]?.surface ?? []).join(" ")}`);
        if (dir) {
          const target = join(repo.root, dir);
          mkdirSync(target, { recursive: true });
          writeFileSync(join(target, `${v.id}.md`), renderPacket(buildPacket(v, repo.spec), repo.spec));
        }
      }
      if (!plan.length) out("no parallelizable frontier tasks");
      return 0;
    },
  },

  claim: {
    help: "claim <TASK> --by LABEL [--ttl 4h] [--note TEXT]   lease a frontier task",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const by = need(a, "by");
      const { views } = states(repo, lastProbe(repo));
      const v = findTask(views, id);
      if (v.state !== "OPEN" && v.state !== "CLAIMED" && !a.flags.force) throw new Usage(`${id} is ${v.state}; only frontier tasks can be claimed (use --force to override with a reason in --note)`);
      const path = abs(repo, repo.spec.claims);
      const f = readClaims(path);
      const c = claim(f, id, by, new Date(), parseTtl(str(a, "ttl") ?? "4h"), str(a, "note"));
      writeClaims(path, f);
      appendLedger(ledgerPath(repo), "claim", gitHead(repo.root), c);
      out(`claimed ${id} for ${by} until ${c.expires}`);
      return 0;
    },
  },

  release: {
    help: "release <TASK> --by LABEL",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const path = abs(repo, repo.spec.claims);
      const f = readClaims(path);
      const c = release(f, id, need(a, "by"), new Date());
      writeClaims(path, f);
      appendLedger(ledgerPath(repo), "release", gitHead(repo.root), c);
      out(`released ${id}`);
      return 0;
    },
  },

  anchor: {
    help: "anchor --by LABEL [--add] | --force --reason R   record gate/spec digests (C1): initial; add new files (--add); re-authorize all (--force, needs --reason)",
    run(repo, a) {
      const by = need(a, "by");
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      const files = gateFileDigests(repo);
      const prev = authorizedDigests(lock);
      const at = new Date().toISOString();
      if (Object.keys(prev).length === 0) {
        lock.anchors = files;
        writeLock(lockPath, lock);
        appendLedger(ledgerPath(repo), "anchor", gitHead(repo.root), { by, mode: "init", files: Object.keys(files).length });
        out(`anchored ${Object.keys(files).length} gate/spec file(s)`);
        return 0;
      }
      if (a.flags.force) {
        const reason = need(a, "reason");
        let n = 0;
        for (const [f, to] of Object.entries(files)) {
          if (prev[f] !== to) { lock.specChanges.push({ file: f, by, reason, at, from: prev[f] ?? null, to }); n++; }
        }
        for (const [f, from] of Object.entries(prev)) {
          if (from !== null && !(f in files)) { lock.specChanges.push({ file: f, by, reason, at, from, to: null }); n++; }
        }
        writeLock(lockPath, lock);
        appendLedger(ledgerPath(repo), "anchor", gitHead(repo.root), { by, mode: "force", reason, reauthorized: n });
        out(`re-authorized ${n} gate/spec file(s) with recorded lineage`);
        return 0;
      }
      if (a.flags.add) {
        const reason = str(a, "reason") ?? "new gate/spec file added";
        let added = 0;
        for (const [f, to] of Object.entries(files)) {
          if (!(f in prev)) { lock.specChanges.push({ file: f, by, reason, at, from: null, to }); added++; }
        }
        writeLock(lockPath, lock);
        appendLedger(ledgerPath(repo), "anchor", gitHead(repo.root), { by, mode: "add", added });
        out(added ? `added ${added} new gate/spec file(s) to the anchor set` : "no new gate/spec files");
        return 0;
      }
      throw new Usage("anchors already exist: use `spec-change --file <F> --by <L> --reason <R>` to change a file, `anchor --add` for new files, or `anchor --force --reason <R>` to re-authorize all");
    },
  },

  "spec-change": {
    help: "spec-change --file F --by LABEL --reason TEXT [--deleted]   explicit, reasoned mutation of an anchored gate/spec file",
    run(repo, a) {
      const file = need(a, "file");
      const by = need(a, "by");
      const reason = need(a, "reason");
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      const to = fileDigest(repo)(file);
      if (to === null && !a.flags.deleted) throw new Usage(`${file} does not exist; to retire a gate file pass --deleted (a deletion is recorded, never silent)`);
      if (to !== null && a.flags.deleted) throw new Usage(`${file} exists; drop --deleted to record its current content`);
      const prev = authorizedDigests(lock)[file] ?? null;
      lock.specChanges.push({ file, by, reason, at: new Date().toISOString(), from: prev, to });
      writeLock(lockPath, lock);
      appendLedger(ledgerPath(repo), "spec-change", gitHead(repo.root), { file, by, reason, from: prev, to });
      out(`spec-change recorded for ${file}${to === null ? " (deleted)" : ""}`);
      return 0;
    },
  },

  promote: {
    help: "promote --by LABEL (--task T | --all)  ratchet gates that are green in a FRESH probe; red gates are refused",
    run(repo, a) {
      const by = need(a, "by");
      const task = str(a, "task");
      if (!task && !a.flags.all) throw new Usage("pass --task T or --all");
      const pr = probe(repo, true);
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      const now = new Date().toISOString();
      const fd = fileDigest(repo);
      const authorized = authorizedDigests(lock);
      const drifted = (file: string): boolean => Object.prototype.hasOwnProperty.call(authorized, file) && (fd(file) ?? null) !== authorized[file];
      const promoted: string[] = [];
      const refused: string[] = [];
      for (const g of pr.gates) {
        if (task && g.task !== task) continue;
        if (lock.promoted[g.key]) continue;
        if (drifted(g.file)) {
          refused.push(`${g.key} (SPEC_CHANGED_ANCHOR — record it: bun run ratchet spec-change --file ${g.file} --by ${by} --reason "...")`);
          continue;
        }
        if (g.status !== "pass") { if (task) refused.push(`${g.key} (${g.status})`); continue; }
        lock.promoted[g.key] = { task: g.task, name: g.name, file: g.file, specDigest: fd(g.file) ?? "missing", by, head: pr.head, at: now };
        promoted.push(g.key);
      }
      writeLock(lockPath, lock);
      appendLedger(ledgerPath(repo), "promote", pr.head, { by, promoted, refused, probe: pr.digest, dirty: gitDirty(repo.root) });
      for (const k of promoted) out(`promoted ${k}`);
      for (const k of refused) out(`refused  ${k}`);
      if (!promoted.length) out("nothing to promote");
      if (gitDirty(repo.root)) out("note: working tree is dirty; commit the code with the lock so the promotion is reproducible");
      return refused.length && (task || !promoted.length) ? 1 : 0;
    },
  },

  review: {
    help: "review <TASK> --by LABEL [--reject] [--note TEXT]   independent review; promoters/claimants are refused",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const by = need(a, "by");
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      const authors = authorsOf(lock, id, claimants(readClaims(abs(repo, repo.spec.claims)), id));
      if (authors.has(normalizeLabel(by))) throw new Usage(`${by} promoted or claimed ${id}; review must come from someone else (authors: ${[...authors].join(", ")})`);
      const { views } = states(repo, probe(repo, true));
      const v = findTask(views, id);
      const verdict = a.flags.reject ? "reject" : "accept";
      if (verdict === "accept" && v.state !== "PROVEN" && v.state !== "DONE") throw new Usage(`${id} is ${v.state}; only PROVEN tasks can be accepted`);
      // C1/D5: a task whose gate file drifted from its authorized digest cannot be accepted
      // until the change is recorded — a weakened gate must not reach DONE.
      const changed = v.gates.filter((g) => g.specChanged).map((g) => g.key);
      if (verdict === "accept" && changed.length) throw new Usage(`${id} has spec-changed gate(s) [${changed.join(", ")}]; record the change (`+"`bun run ratchet spec-change --file <F> --by <L> --reason <R>`"+`) and promote before review`);
      const r = { by, verdict, head: gitHead(repo.root), at: new Date().toISOString(), ...(str(a, "note") ? { note: str(a, "note")! } : {}) } as const;
      (lock.reviews[id] ??= []).push(r);
      writeLock(lockPath, lock);
      appendLedger(ledgerPath(repo), "review", r.head, { task: id, ...r });
      out(`${verdict} ${id} by ${by}`);
      return 0;
    },
  },

  supersede: {
    help: "supersede <TASK> --by LABEL --reason TEXT    retire a task (the reason is kept forever)",
    run(repo, a) {
      const id = a._[0] ?? need(a, "task");
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      findTask(states(repo, null).views, id);
      lock.superseded[id] = { by: need(a, "by"), reason: need(a, "reason"), at: new Date().toISOString() };
      writeLock(lockPath, lock);
      appendLedger(ledgerPath(repo), "supersede", gitHead(repo.root), { task: id, ...lock.superseded[id] });
      out(`superseded ${id}`);
      return 0;
    },
  },

  complete: {
    help: "complete --by LABEL       record the deliverable completion commit (only when every task is DONE/SUPERSEDED)",
    run(repo, a) {
      const { views } = states(repo, probe(repo, true));
      const exempt = new Set(repo.spec.completionTasks ?? []);
      const open = views.filter((v) => !exempt.has(v.id) && v.state !== "DONE" && v.state !== "SUPERSEDED");
      if (open.length) { out(`not complete: ${open.map((v) => `${v.id}=${v.state}`).join(", ")}`); return 1; }
      if (gitDirty(repo.root)) throw new Usage("commit first: completion must name an immutable commit");
      const lockPath = abs(repo, repo.spec.lock);
      const lock = readLock(lockPath, repo.spec.id);
      // C1/D5: unresolved anchor drift blocks completion, whatever the task states say.
      const drift = anchorDrift(repo, lock);
      if (drift.changed.length || drift.vanished.length) throw new Usage(`unresolved anchor drift: ${[...drift.changed, ...drift.vanished].join(", ")}; record a spec-change before completing`);
      lock.completion = { head: gitHead(repo.root), at: new Date().toISOString(), by: need(a, "by") };
      writeLock(lockPath, lock);
      out(`completion recorded at ${lock.completion.head}`);
      return 0;
    },
  },

  board: {
    help: "board                     regenerate the Markdown board from graph + lock + last probe",
    run(repo) {
      const pr = lastProbe(repo);
      const { graph, views } = states(repo, pr);
      const lock = readLock(abs(repo, repo.spec.lock), repo.spec.id);
      writeFileSync(abs(repo, repo.spec.board), renderBoard(repo.spec, graph, views, pr, lock, orphanGates(graph, pr, lock)));
      out(`wrote ${repo.spec.board}`);
      return 0;
    },
  },

  evidence: {
    help: "evidence                  regenerate the machine-readable evidence summary",
    run(repo) {
      writeEvidence(repo, undefined);
      out(`wrote ${repo.spec.evidence}`);
      return 0;
    },
  },

  baseline: {
    help: "baseline                  run the spec's named baseline commands and record their counts in evidence",
    run(repo) {
      const runs: BaselineRun[] = [];
      for (const b of repo.spec.baseline) {
        const argv = b.argv.map((x) => (x === "$BUN" ? process.execPath : x));
        process.stderr.write(`ratchet: baseline ${b.id}: ${b.argv.join(" ")}\n`);
        const r = Bun.spawnSync(argv, { cwd: abs(repo, b.cwd), stdout: "pipe", stderr: "pipe", env: { ...process.env, RATCHET_MODE: "" } });
        const text = r.stdout.toString() + r.stderr.toString();
        runs.push({ id: b.id, argv: b.argv, exitCode: r.exitCode ?? -1, ...parseBunSummary(text) });
      }
      writeEvidence(repo, runs);
      appendLedger(ledgerPath(repo), "baseline", gitHead(repo.root), runs);
      for (const r of runs) out(`${r.id}: exit ${r.exitCode}, ${r.pass ?? "?"} pass / ${r.fail ?? "?"} fail / ${r.expects ?? "?"} expect()`);
      return runs.every((r) => r.exitCode === 0) ? 0 : 1;
    },
  },

  drift: {
    help: "drift [--json]            check executable facts that project documents assert",
    run(repo, a) {
      if (!repo.spec.facts) { out("no facts file configured"); return 0; }
      const results = runFacts(repo.root, JSON.parse(readFileSync(abs(repo, repo.spec.facts), "utf8")) as FactsFile);
      if (a.flags.json) out(results);
      else for (const r of results) out(`${r.ok ? "✓" : "✗"} ${r.id}: observed ${r.observed}, expected ${r.expected}${r.ok ? "" : ` — update ${r.assertedBy.join(", ")} or the fact`}`);
      return results.every((r) => r.ok) ? 0 : 1;
    },
  },

  check: {
    help: "check [--strict] [--no-probe]  CI gate: graph fresh, no regressions/vanished gates, drift clean (strict: no pending promotions or changed specs)",
    run(repo, a) {
      const problems: string[] = [];
      const warnings: string[] = [];
      const g = graphOf(repo);
      const target = abs(repo, repo.spec.graphOut);
      if (!existsSync(target) || !sameText(readFileSync(target, "utf8"), JSON.stringify(g, null, 2) + "\n")) problems.push(`TASKGRAPH_STALE ${repo.spec.graphOut}`);
      const pr = a.flags["no-probe"] ? lastProbe(repo) : probe(repo, true);
      const { views } = states(repo, pr);
      const lock = readLock(abs(repo, repo.spec.lock), repo.spec.id);
      // C1: an anchored gate/spec file that changed without a recorded spec-change is drift, promoted or not.
      const drift = anchorDrift(repo, lock);
      for (const f of drift.changed) problems.push(`SPEC_CHANGED_ANCHOR ${f} — record: bun run ratchet spec-change --file ${f} --by <label> --reason "..."`);
      for (const f of drift.vanished) problems.push(`SPEC_FILE_VANISHED ${f} — record: bun run ratchet spec-change --file ${f} --by <label> --reason "..." --deleted`);
      for (const f of drift.unanchored) (a.flags.strict ? problems : warnings).push(`UNANCHORED_GATE_FILE ${f} — anchor it: bun run ratchet anchor --add --by <label>`);
      for (const v of views) {
        for (const g2 of v.gates) {
          if (g2.promoted && g2.observed === "absent") problems.push(`GATE_VANISHED ${g2.key}`);
          else if (g2.promoted && pr && g2.observed !== "pass") problems.push(`REGRESSED ${g2.key}`);
          if (g2.specChanged) (a.flags.strict ? problems : warnings).push(`SPEC_CHANGED ${g2.key}`);
        }
        for (const k of v.promotable) (a.flags.strict ? problems : warnings).push(`PROMOTE_PENDING ${k}`);
      }
      for (const o of orphanGates(g, pr, lock)) problems.push(`ORPHAN_GATE ${o}`);
      for (const f of pr?.silentFiles ?? []) problems.push(`SILENT_GATE_FILE ${f}`);
      if (repo.spec.facts) {
        for (const r of runFacts(repo.root, JSON.parse(readFileSync(abs(repo, repo.spec.facts), "utf8")) as FactsFile)) {
          if (!r.ok) problems.push(`DRIFT ${r.id}: observed ${r.observed}, expected ${r.expected} (${r.assertedBy.join(", ")})`);
        }
      }
      // Projections must reflect current state: a hand-edited board/evidence must not stand in as proof (D9).
      // The evidence file is the load-bearing one (spec.json binds D1-083/084/085 to it); compare its
      // state-bearing content with environment-volatile fields stripped, so a fresh checkout/commit at the
      // same state is not spuriously "stale".
      const boardText = renderBoard(repo.spec, g, views, pr, lock, orphanGates(g, pr, lock));
      const boardPath = abs(repo, repo.spec.board);
      // The header line embeds the probe HEAD/bun/platform; ignore it so a fresh checkout/commit is not "stale".
      const normBoard = (s: string) => s.replace(/\r\n/g, "\n").split("\n").filter((l) => !l.startsWith("Source task list:")).join("\n");
      if (!existsSync(boardPath) || normBoard(readFileSync(boardPath, "utf8")) !== normBoard(boardText)) warnings.push(`PROJECTION_STALE ${repo.spec.board} — run: bun run ratchet board`);
      const evPath = abs(repo, repo.spec.evidence);
      const prevEv = existsSync(evPath) ? (JSON.parse(readFileSync(evPath, "utf8")) as unknown) : null;
      const evExpected = buildEvidence(repo.spec, g, views, pr, lock, undefined, prevEv);
      const evCurrent = prevEv === null ? null : canonicalize(stripVolatile(prevEv));
      if (evCurrent === null || evCurrent !== canonicalize(stripVolatile(evExpected))) problems.push(`PROJECTION_STALE ${repo.spec.evidence} — run: bun run ratchet evidence`);
      for (const w of warnings) out(`warn ${w}`);
      for (const p of problems) out(`FAIL ${p}`);
      out(problems.length ? `check failed: ${problems.length} problem(s)` : `check ok (${warnings.length} warning(s))`);
      return problems.length ? 1 : 0;
    },
  },

  sync: {
    help: "sync                      probe + graph + board + evidence in one step",
    run(repo, a) {
      probe(repo);
      commands.graph!.run(repo, { _: [], flags: {} });
      commands.board!.run(repo, a);
      commands.evidence!.run(repo, a);
      return commands.status!.run(repo, { _: [], flags: {} });
    },
  },

  ledger: {
    help: "ledger [--verify]         show (or verify the hash chain of) the local run ledger",
    run(repo, a) {
      const entries = readLedger(ledgerPath(repo));
      if (a.flags.verify) {
        const v = verifyLedger(entries);
        out(v.ok ? `ledger ok: ${entries.length} entries` : `ledger BROKEN at seq ${v.badAt}`);
        return v.ok ? 0 : 1;
      }
      for (const e of entries.slice(-20)) out(`${e.seq}\t${e.at}\t${e.kind}\t${e.head}\t${short(e.digest)}`);
      return 0;
    },
  },
};

function writeEvidence(repo: Repo, baseline: BaselineRun[] | undefined): void {
  const pr = lastProbe(repo);
  const { graph, views } = states(repo, pr);
  const lock = readLock(abs(repo, repo.spec.lock), repo.spec.id);
  const path = abs(repo, repo.spec.evidence);
  const previous = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(buildEvidence(repo.spec, graph, views, pr, lock, baseline, previous), null, 2) + "\n");
}

function help(): string {
  return ["ratchet — executable build control (see .project/ratchet/OPERATING.md)", "", "usage: bun run ratchet <command> [--spec PATH]", "",
    ...Object.values(commands).map((c) => "  " + c.help)].join("\n");
}

export function main(argv: string[]): number {
  const a = parseArgs(argv);
  const name = a._.shift();
  if (!name || name === "help" || a.flags.help) { out(help()); return name ? 0 : 2; }
  const cmd = commands[name];
  if (!cmd) { out(`unknown command "${name}"\n\n${help()}`); return 2; }
  try {
    const repo = loadRepo(str(a, "spec") ? { spec: str(a, "spec")! } : {});
    return cmd.run(repo, a);
  } catch (e) {
    if (e instanceof Usage) { out(`ratchet ${name}: ${e.message}`); return 2; }
    throw e;
  }
}

if (import.meta.main) process.exit(main(process.argv.slice(2)));

export { gateKey };
