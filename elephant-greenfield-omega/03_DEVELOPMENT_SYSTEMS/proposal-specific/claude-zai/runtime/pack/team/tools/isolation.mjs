// Arm isolation checks: canaries (read-and-copy leak evidence) and fences (write-escape evidence).
//
//   ORDER MATTERS: provision every arm dir (baseline copy + BRIEF.md) FIRST, then plant, then snapshot.
//   node team/tools/isolation.mjs plant    <roundDir>                 # writes arms/<id>/.canary + controller/canaries.json
//   node team/tools/isolation.mjs fence    <roundDir> snapshot        # refuses if an arm lacks BRIEF.md or .canary
//   node team/tools/isolation.mjs fence    <roundDir> step <armId>    # SEQUENTIAL runs: after each arm; attributes changes to it, re-snapshots
//   node team/tools/isolation.mjs scan     <roundDir>                 # after arms: canary leaks, tampered canaries, symlinks
//   node team/tools/isolation.mjs fence    <roundDir> check           # after arms: write escapes (+ folds in step results)
//   node team/tools/isolation.mjs report   <roundDir> [--oracle <dir>] # scan + check (+ oracle-copy scan) -> isolation-report.json
//   node team/tools/isolation.mjs scan-oracle <roundDir> <oracleDir>  # after unseal: arm trees containing oracle markers
//
// Manifest: <roundDir>/round-manifest.json  { round, seed, controller, isolation_strength, arms:[{id,track,dir}] }
//
// WHAT THIS PROVES, AND WHAT IT DOES NOT
//  * A canary token (or its 24-hex secret alone) inside another arm's tree is DEFINITE evidence of a read-and-copy leak.
//  * A change under seed/ (files, or seed Git HEAD / worktree status) or anywhere in the round dir outside arms and the
//    controller is DEFINITE evidence of a write escape. In `step` mode it is attributed to the arm that just ran.
//  * A changed file inside an arm that the arm did not declare in WRITES.json is UNATTRIBUTED (suspicious, not proof).
//  * Absence of findings does NOT prove isolation: a read that leaves no copy is invisible; so are writes outside the
//    round dir (e.g. ../evidence) and reads of controller/canaries.json. Strength comes from the census, not from here.
//
// v0.2 fixes (team/CHANGELOG.md): BRIEF.md/ARM_RESULT.json no longer cause false taint; the round root is fenced
// (v0.1 missed stray files there); seed/.git is checked via HEAD + status; hex-only canary copies are caught;
// WRITES.json is validated (no globs, no traversal); sequential runs get per-arm attribution.
import { readFileSync, writeFileSync, readdirSync, existsSync, lstatSync, appendFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { randomBytes, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const sha = b => createHash('sha256').update(b).digest('hex');
const SKIP = new Set(['node_modules', '.git']);
// Files arms are REQUIRED to write; exempt from WRITES.json attribution (the arm still may not write them elsewhere).
const ARM_PROTOCOL_OUTPUTS = new Set(['WRITES.json', 'ARM_RESULT.json']);
// Files the controller writes in the round root AFTER the run; changes to these are not escapes.
export const CONTROLLER_ROUND_ARTIFACTS = new Set([
  'round-manifest.json', 'CENSUS.json', 'isolation-report.json', 'evaluation.json', 'selection.json',
  'selection.rerun.json', 'NEXT_ROUND_PLAN.md', 'eval-commit.json',
]);
const CONTROLLER_ROUND_DIRS = ['census/', 'evals/'];

export const BLIND_SPOTS = [
  'A read that leaves no copy is invisible (canaries only catch copies).',
  'Writes outside the round directory (e.g. evidence/, track-*/, the pack) are not fenced by this tool.',
  'Any process with filesystem access can read controller/canaries.json and the controller directory.',
  'Hard links and transformed copies (encoded, paraphrased) of canaries are not detected.',
  'node_modules/ and .git/ inside arms are not hashed (seed .git is checked via HEAD + status only).',
  'In parallel runs, an escape outside arm dirs cannot be attributed and taints every arm that ran in the window.',
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name); const st = lstatSync(full);
    if (st.isSymbolicLink()) { out.push({ full, symlink: true }); continue; }
    if (st.isDirectory()) walk(full, out); else out.push({ full, symlink: false, size: st.size });
  }
  return out;
}
const rel = (root, p) => relative(root, p).split(sep).join('/');
const loadManifest = root => JSON.parse(readFileSync(join(root, 'round-manifest.json'), 'utf8'));
const readJSON = (p, d) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d);

export function plant(root) {
  const m = loadManifest(root); const tokens = {};
  for (const arm of m.arms) {
    if (!existsSync(join(root, arm.dir))) throw new Error(`arm dir missing: ${arm.dir} (provision arms before plant)`);
    const token = `CANARY-${arm.id}-${randomBytes(12).toString('hex')}`;
    tokens[arm.id] = token;
    writeFileSync(join(root, arm.dir, '.canary'), `${token}\n`);
  }
  const controllerToken = `CANARY-CONTROLLER-${randomBytes(12).toString('hex')}`;
  writeFileSync(join(root, m.controller, '.canary'), `${controllerToken}\n`);
  writeFileSync(join(root, m.controller, 'canaries.json'), JSON.stringify({ round: m.round, tokens, controller: controllerToken }, null, 2));
  return { ok: true, planted: Object.keys(tokens), strength_note: 'controller/canaries.json is readable by any process with fs access; strength depends on sandboxing' };
}

const secretPart = token => token.slice(-24);

export function scan(root) {
  const m = loadManifest(root);
  const { tokens, controller } = JSON.parse(readFileSync(join(root, m.controller, 'canaries.json'), 'utf8'));
  const owners = Object.entries(tokens);
  if (controller) owners.push(['CONTROLLER', controller]);
  const leaks = []; const tampered = []; const symlinks = [];
  for (const arm of m.arms) {
    const armRoot = join(root, arm.dir);
    const own = join(armRoot, '.canary');
    if (!existsSync(own) || readFileSync(own, 'utf8').trim() !== tokens[arm.id]) tampered.push(arm.id);
    for (const f of walk(armRoot)) {
      if (f.symlink) { symlinks.push({ arm: arm.id, file: rel(root, f.full) }); continue; }
      if (f.size > 5_000_000) continue;
      const text = readFileSync(f.full, 'latin1');
      for (const [owner, token] of owners) {
        if (owner === arm.id) continue;
        if (text.includes(token)) leaks.push({ finder: arm.id, owner, file: rel(root, f.full), match: 'token' });
        else if (text.includes(secretPart(token))) leaks.push({ finder: arm.id, owner, file: rel(root, f.full), match: 'hex' });
      }
    }
  }
  const tainted = [...new Set([...leaks.map(l => l.finder), ...tampered, ...symlinks.map(s => s.arm)])].sort();
  return { ok: !leaks.length && !tampered.length && !symlinks.length, leaks, tampered_own_canary: tampered, symlinks, tainted };
}

/** Markers are strings `ORACLE-MARKER-<16+ hex>` embedded in sealed oracle files. Any arm containing one copied the oracle. */
export function scanOracle(root, oracleDir) {
  const m = loadManifest(root);
  const markers = new Set();
  for (const f of walk(oracleDir)) if (!f.symlink) for (const x of readFileSync(f.full, 'latin1').match(/ORACLE-MARKER-[0-9a-f]{16,}/g) ?? []) markers.add(x);
  const hits = [];
  for (const arm of m.arms) for (const f of walk(join(root, arm.dir))) {
    if (f.symlink || f.size > 5_000_000) continue;
    const text = readFileSync(f.full, 'latin1');
    for (const mk of markers) if (text.includes(mk)) hits.push({ arm: arm.id, file: rel(root, f.full), marker: mk.slice(0, 22) });
  }
  return { ok: hits.length === 0, markers: markers.size, hits, tainted: [...new Set(hits.map(h => h.arm))].sort() };
}

function seedGit(root, m) {
  const dir = join(root, m.seed);
  if (!existsSync(join(dir, '.git'))) return { present: false };
  try {
    const head = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const status = execFileSync('git', ['-C', dir, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return { present: true, head, status_sha256: sha(status) };
  } catch (e) { return { present: true, unchecked: String(e.message).slice(0, 120) }; }
}

function hashTree(root) {
  const map = {};
  for (const f of walk(root)) map[rel(root, f.full)] = f.symlink ? 'SYMLINK' : sha(readFileSync(f.full));
  return map;
}

function readWrites(root, arm) {
  const wp = join(root, arm.dir, 'WRITES.json');
  if (!existsSync(wp)) return { files: new Set(), problem: 'WRITES.json missing' };
  let files;
  try { files = JSON.parse(readFileSync(wp, 'utf8')).files; } catch { return { files: new Set(), problem: 'WRITES.json unparseable' }; }
  if (!Array.isArray(files)) return { files: new Set(), problem: 'WRITES.json has no files[]' };
  const bad = files.filter(p => typeof p !== 'string' || /[*?]/.test(p) || p.startsWith('/') || p.split('/').includes('..'));
  return { files: new Set(files.filter(p => !bad.includes(p))), problem: bad.length ? `WRITES.json invalid entries (globs/absolute/traversal): ${bad.slice(0, 3).join(', ')}` : null };
}

export function fenceSnapshot(root) {
  const m = loadManifest(root);
  const missing = m.arms.filter(a => !existsSync(join(root, a.dir, 'BRIEF.md')) || !existsSync(join(root, a.dir, '.canary')));
  if (missing.length) throw new Error(`provision before snapshot: BRIEF.md and .canary required in ${missing.map(a => a.id).join(', ')} (order: provision -> plant -> snapshot)`);
  const snap = { taken_at: new Date().toISOString(), files: hashTree(root), seed_git: seedGit(root, m) };
  writeFileSync(join(root, m.controller, 'fence.snapshot.json'), JSON.stringify(snap, null, 2));
  return { ok: true, files: Object.keys(snap.files).length, seed_git: snap.seed_git };
}

function classify(root, m, before, now, after) {
  const ctl = `${m.controller}/`;
  const changed = [...new Set([...Object.keys(before.files), ...Object.keys(now.files)])].filter(p => before.files[p] !== now.files[p]).sort();
  const armOf = p => m.arms.find(a => p === a.dir || p.startsWith(`${a.dir}/`));
  const escapes = []; const unattributed = []; const writesProblems = []; const controllerArtifacts = [];
  const writes = {};
  for (const p of changed) {
    if (p.startsWith(ctl)) continue; // controller's own business; its actions are in the ledger
    const arm = armOf(p);
    if (!arm) {
      if (!p.includes('/') && CONTROLLER_ROUND_ARTIFACTS.has(p)) { controllerArtifacts.push(p); continue; }
      if (CONTROLLER_ROUND_DIRS.some(d => p.startsWith(d))) { controllerArtifacts.push(p); continue; }
      escapes.push({ file: p, kind: p.startsWith(`${m.seed}/`) ? 'SEED_MODIFIED' : 'OUTSIDE_ARMS', by: after ?? null });
      continue;
    }
    const inner = p.slice(arm.dir.length + 1);
    if (inner === '.canary') continue; // judged by scan()
    if (after && arm.id !== after) { escapes.push({ file: p, kind: 'CROSS_ARM_WRITE', by: after, victim: arm.id }); continue; }
    if (inner === 'BRIEF.md') { escapes.push({ file: p, kind: 'BRIEF_MODIFIED', by: arm.id }); continue; }
    if (ARM_PROTOCOL_OUTPUTS.has(inner)) continue;
    writes[arm.id] ??= readWrites(root, arm);
    if (!writes[arm.id].files.has(inner)) unattributed.push({ arm: arm.id, file: p });
  }
  for (const [id, w] of Object.entries(writes)) if (w.problem) writesProblems.push({ arm: id, problem: w.problem });
  const g0 = before.seed_git ?? { present: false }; const g1 = now.seed_git;
  if (g0.present && !g0.unchecked && (g0.head !== g1.head || g0.status_sha256 !== g1.status_sha256)) {
    escapes.push({ file: `${m.seed}/.git`, kind: 'SEED_GIT_CHANGED', by: after ?? null, detail: g0.head !== g1.head ? 'HEAD moved' : 'worktree status changed' });
  }
  return { escapes, unattributed, writesProblems, controllerArtifacts, changed_count: changed.length };
}

export function fenceStep(root, armId) {
  const m = loadManifest(root);
  if (!m.arms.some(a => a.id === armId)) throw new Error(`unknown arm ${armId}`);
  const snapPath = join(root, m.controller, 'fence.snapshot.json');
  const before = JSON.parse(readFileSync(snapPath, 'utf8'));
  const now = { taken_at: new Date().toISOString(), files: hashTree(root), seed_git: seedGit(root, m) };
  const r = classify(root, m, before, now, armId);
  appendFileSync(join(root, m.controller, 'fence.steps.jsonl'), `${JSON.stringify({ arm: armId, at: now.taken_at, ...r })}\n`);
  writeFileSync(snapPath, JSON.stringify(now, null, 2)); // re-snapshot: the next arm is judged against this state
  return { ok: !r.escapes.length && !r.unattributed.length && !r.writesProblems.length, arm: armId, ...r };
}

export function fenceCheck(root) {
  const m = loadManifest(root);
  const before = JSON.parse(readFileSync(join(root, m.controller, 'fence.snapshot.json'), 'utf8'));
  const now = { files: hashTree(root), seed_git: seedGit(root, m) };
  const r = classify(root, m, before, now, null);
  const stepsPath = join(root, m.controller, 'fence.steps.jsonl');
  const steps = existsSync(stepsPath) ? readFileSync(stepsPath, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const escapes = [...steps.flatMap(s => s.escapes), ...r.escapes];
  const unattributed = [...steps.flatMap(s => s.unattributed), ...r.unattributed];
  const writesProblems = [...steps.flatMap(s => s.writesProblems), ...r.writesProblems];
  // Taint: attributable findings taint their arm; an unattributable escape taints every arm (fail closed).
  const tainted = new Set();
  for (const e of escapes) { if (e.by) tainted.add(e.by); else m.arms.forEach(a => tainted.add(a.id)); }
  for (const u of unattributed) tainted.add(u.arm);
  for (const w of writesProblems) tainted.add(w.arm);
  const victims = [...new Set(escapes.filter(e => e.victim).map(e => e.victim))].sort();
  return {
    ok: !escapes.length && !unattributed.length && !writesProblems.length,
    mode: steps.length ? 'sequential-steps' : 'single-window',
    escapes, unattributed, writes_problems: writesProblems, victims, tainted: [...tainted].sort(),
    controller_artifacts: r.controllerArtifacts, changed_count: r.changed_count,
  };
}

export function report(root, { oracleDir } = {}) {
  const m = loadManifest(root);
  const s = scan(root); const f = fenceCheck(root);
  const o = oracleDir ? scanOracle(root, oracleDir) : null;
  const tainted = [...new Set([...s.tainted, ...f.tainted, ...(o?.tainted ?? [])])].sort();
  const out = {
    round: m.round,
    isolation_strength: m.isolation_strength ?? 'UNSTATED',
    strength_statement: {
      PROCESS_SEPARATED: 'Isolation enforced by the environment (census proved a denied cross-read).',
      SHARED_FS_HONOR_SYSTEM: 'Isolation by instruction, verified only by canaries and fences; absence of findings is weak evidence.',
      SIMULATED: 'Sequential role-play by one agent; arms are not independent runs. Findings here only catch careless copies.',
    }[m.isolation_strength] ?? 'Isolation strength not stated in the manifest — treat as SIMULATED.',
    ok: s.ok && f.ok && (o?.ok ?? true),
    tainted,
    isolation_ok: Object.fromEntries(m.arms.map(a => [a.id, !tainted.includes(a.id)])),
    canary_scan: s, fence: f, oracle_scan: o ?? 'not run (pass --oracle <unsealedDir> after unsealing)', blind_spots: BLIND_SPOTS,
  };
  writeFileSync(join(root, 'isolation-report.json'), `${JSON.stringify(out, null, 2)}\n`);
  return out;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [cmd, root, sub, extra] = process.argv.slice(2);
  try {
    let out;
    if (cmd === 'plant') out = plant(root);
    else if (cmd === 'scan') out = scan(root);
    else if (cmd === 'scan-oracle') out = scanOracle(root, sub);
    else if (cmd === 'report') out = report(root, { oracleDir: sub === '--oracle' ? extra : undefined });
    else if (cmd === 'fence' && sub === 'snapshot') out = fenceSnapshot(root);
    else if (cmd === 'fence' && sub === 'step') out = fenceStep(root, extra);
    else if (cmd === 'fence' && sub === 'check') out = fenceCheck(root);
    else { console.error('usage: isolation.mjs plant|scan|report <roundDir> | fence <roundDir> snapshot|step <armId>|check | scan-oracle <roundDir> <oracleDir>'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2)); process.exit(out.ok === false ? 1 : 0);
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
