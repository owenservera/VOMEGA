// Probe: run the gate suites in raw-truth mode and turn Bun's JUnit report into
// per-gate observations. A probe is an observation, not a decision: it never
// edits the lock. Promotion is a separate, explicit act.
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { digest } from "./canonical.ts";
import { parseGateTitle } from "./gate.ts";
import { gateKey } from "./lock.ts";
import type { Repo } from "./spec.ts";

export type Observed = "pass" | "fail" | "skip";

export interface TestCase { name: string; classname: string; file: string; line: number; status: Observed; message?: string }

export interface GateObservation {
  key: string;
  task: string;
  name: string;
  file: string;        // repo-relative
  status: Observed;
  message?: string;
}

export interface ProbeResult {
  schema: "ratchet.probe/0";
  spec: string;
  head: string;
  bun: string;
  platform: string;
  exitCode: number;
  totals: { tests: number; gates: number; pass: number; fail: number; skip: number };
  gates: GateObservation[];
  /** Files under the gate dirs that produced no test cases (usually import/load errors). */
  silentFiles: string[];
  outputTail: string;
  digest: string;      // digest of (gates, silentFiles) — identical truth ⇒ identical digest
}

const ENTITIES: Record<string, string> = { "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&amp;": "&" };
function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&(quot|apos|lt|gt|amp);/g, (m) => ENTITIES[m]!);
}

function attr(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? decode(m[1]!) : undefined;
}

/** Minimal JUnit reader for Bun's reporter: testcase elements with optional failure/skipped children. */
export function parseJUnit(xml: string): TestCase[] {
  const out: TestCase[] = [];
  const re = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const head = m[1]!;
    const body = m[3] ?? "";
    const failure = /<(failure|error)\b([^>]*)/.exec(body);
    const skipped = /<skipped\b/.test(body);
    const status: Observed = failure ? "fail" : skipped ? "skip" : "pass";
    const tc: TestCase = {
      name: attr(head, "name") ?? "",
      classname: attr(head, "classname") ?? "",
      file: attr(head, "file") ?? "",
      line: Number(attr(head, "line") ?? 0),
      status,
    };
    if (failure) {
      const msg = attr(failure[2] ?? "", "message");
      if (msg !== undefined) tc.message = msg.slice(0, 400);
    }
    out.push(tc);
  }
  return out;
}

export function observationsFrom(cases: TestCase[], fileToRepoRel: (f: string) => string): GateObservation[] {
  const gates: GateObservation[] = [];
  for (const c of cases) {
    const g = parseGateTitle(c.name);
    if (!g) continue;
    const o: GateObservation = { key: gateKey(g.task, g.name), task: g.task, name: g.name, file: fileToRepoRel(c.file), status: c.status };
    if (c.message !== undefined) o.message = c.message;
    gates.push(o);
  }
  return gates.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

export function gitHead(root: string): string {
  try {
    const r = Bun.spawnSync(["git", "rev-parse", "--short=12", "HEAD"], { cwd: root, stdout: "pipe", stderr: "pipe" });
    const s = r.stdout.toString().trim();
    return r.exitCode === 0 && s ? s : "unknown";
  } catch {
    return "unknown";
  }
}

export function gitDirty(root: string): boolean {
  try {
    const r = Bun.spawnSync(["git", "status", "--porcelain"], { cwd: root, stdout: "pipe", stderr: "pipe" });
    return r.exitCode === 0 && r.stdout.toString().trim().length > 0;
  } catch {
    return false;
  }
}

/** Gate files currently on disk under the spec's gate dirs (repo-relative, sorted). */
export function gateFiles(repo: Repo): string[] {
  const files: string[] = [];
  for (const dir of repo.spec.gateDirs) {
    for (const f of new Bun.Glob("**/*.test.ts").scanSync({ cwd: join(repo.root, dir) })) {
      files.push(`${dir}/${f.replaceAll("\\", "/")}`);
    }
  }
  return files.sort();
}

export function runProbe(repo: Repo, opts: { only?: string[] } = {}): ProbeResult {
  const cwd = join(repo.root, repo.spec.testCwd);
  const outDir = join(repo.root, repo.spec.ledgerDir, "tmp");
  mkdirSync(outDir, { recursive: true });
  const report = join(outDir, `probe-${process.pid}-${Date.now()}.xml`);
  const targets = (opts.only ?? repo.spec.gateDirs).map((d) => relative(cwd, join(repo.root, d)).replaceAll("\\", "/"));
  const proc = Bun.spawnSync(
    [process.execPath, "test", "--reporter=junit", `--reporter-outfile=${report}`, ...targets.map((t) => (t.startsWith(".") ? t : `./${t}`))],
    { cwd, stdout: "pipe", stderr: "pipe", env: { ...process.env, RATCHET_MODE: "probe" } },
  );
  let xml = "";
  try { xml = readFileSync(report, "utf8"); } catch { /* no report: load failure, recorded below */ }
  rmSync(report, { force: true });
  const output = proc.stdout.toString() + proc.stderr.toString();
  const toRepoRel = (f: string) => relative(repo.root, join(cwd, f)).replaceAll("\\", "/");
  const cases = parseJUnit(xml);
  const gates = observationsFrom(cases, toRepoRel);
  const seenFiles = new Set(cases.map((c) => toRepoRel(c.file)));
  const silentFiles = gateFiles(repo).filter((f) => !seenFiles.has(f));
  const count = (s: Observed) => gates.filter((g) => g.status === s).length;
  return {
    schema: "ratchet.probe/0",
    spec: repo.spec.id,
    head: gitHead(repo.root),
    bun: Bun.version,
    platform: `${process.platform}-${process.arch}`,
    exitCode: proc.exitCode ?? -1,
    totals: { tests: cases.length, gates: gates.length, pass: count("pass"), fail: count("fail"), skip: count("skip") },
    gates,
    silentFiles,
    outputTail: output.split(/\r?\n/).slice(-25).join("\n"),
    digest: digest({ gates: gates.map(({ message: _m, ...g }) => g), silentFiles }),
  };
}
