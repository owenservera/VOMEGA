// Evaluation kit: makes the rubric mostly MECHANICAL so that a degraded (same-agent) evaluator has little room to steer.
//
// Sequence (team/04 §1–§3). Each step refuses to run out of order.
//   1 node team/tools/evalkit.mjs commit-probes <ws> R<n> <probesFile...>   # evaluator writes probes FROM THE CONTRACT, before seeing code
//   2 node team/tools/evalkit.mjs stage  <ws> R<n>                          # evidence -> controller/eval-staging/<blind_id>/ (redacted)
//   3 node team/tools/evalkit.mjs run    <ws> R<n> <C> --acceptance <f> [--oracle <f>] [--probes <f>]
//                                                                           # runs suites per entrant; writes evals/<blind>.<C>.json
//   4 (evaluator) fill criteria.maintainability (0..10), penalties[], notes in each evals/<blind>.<C>.json
//   5 node team/tools/evalkit.mjs commit <ws> R<n>                          # freezes evals/ (hash -> ledger EVAL_RECORDED phase=committed)
//   6 node team/tools/evalkit.mjs join   <ws> R<n>                          # de-blind, audit ARM_RESULTs, simplicity, totals -> evaluation.json
//   * node team/tools/evalkit.mjs audit  <armEvidenceDir>                   # evidence-quality points for one arm (used by join)
//   * node team/tools/evalkit.mjs loc    <dir> [subpath...]                 # non-test, non-blank, non-comment source lines
//
// Rubric points (team/04 §2):  acceptance 30 · oracle 25 · edge 15 · simplicity 10 · evidence 10 · maintainability 10
//   MECHANICAL (computed here): acceptance, oracle, simplicity, evidence  -> score_mechanical (max 75)
//   EVALUATOR-AUTHORED:         edge (probes are written by the evaluator), maintainability (judgment)
// selection_basis "mechanical" (DEGRADED independence) selects on score_mechanical only.
import { readFileSync, writeFileSync, existsSync, readdirSync, lstatSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, relative, sep, dirname, extname, isAbsolute, resolve } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { emit, readLedger } from './ledger.mjs';
import { validate } from './validate.mjs';
import { treeHash } from './round.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const sha = b => createHash('sha256').update(b).digest('hex');
const readJSON = (p, d = undefined) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d);
const writeJSON = (p, o) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, `${JSON.stringify(o, null, 2)}\n`); };
const clamp = (lo, hi, x) => Math.max(lo, Math.min(hi, x));
export const POINTS = { acceptance: 30, oracle: 25, edge: 15, simplicity: 10, evidence: 10, maintainability: 10 };
const STRIP = new Set(['BRIEF.md', 'ARM_RESULT.json', 'WRITES.json', '.canary']);
const STRIP_DIRS = new Set(['process', 'node_modules', '.git']);
const TEXT_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.tsx', '.jsx', '.json', '.md', '.txt', '.yml', '.yaml', '.toml', '.html', '.css', '.log', '.tap', '']);
const CODE_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.tsx', '.jsx']);

const events = ws => readLedger(join(ws, 'ledger')).events;
const gate = (ws, round, name) => events(ws).filter(e => e.type === 'GATE' && e.body.round === round && e.body.gate === name && e.body.status === 'PASSED').at(-1);
const paths = (ws, round) => {
  const rd = join(ws, 'rounds', round); const m = readJSON(join(rd, 'round-manifest.json'));
  if (!m) throw new Error(`no manifest for ${round}`);
  const ctl = join(rd, m.controller ?? 'controller');
  return { rd, m, ctl, staging: join(ctl, 'eval-staging'), mapFile: join(ctl, 'blind-map.json'), evals: join(rd, 'evals'), evidence: join(ws, 'evidence', round) };
};

// ---------------------------------------------------------------- LOC
export function loc(dir, subpaths = []) {
  const roots = subpaths.length ? subpaths.map(s => join(dir, s)) : [dir];
  let n = 0; const files = [];
  const walk = d => {
    if (!existsSync(d)) return;
    const st = lstatSync(d);
    if (st.isFile()) return count(d);
    for (const name of readdirSync(d)) {
      if (name === 'node_modules' || name === '.git') continue;
      const full = join(d, name); const s = lstatSync(full);
      if (s.isSymbolicLink()) continue;
      if (s.isDirectory()) { if (!/^(tests?|__tests__|spec)$/.test(name)) walk(full); } else count(full);
    }
  };
  const count = f => {
    if (!CODE_EXT.has(extname(f)) || /\.(test|spec)\.[a-z]+$/.test(f)) return;
    let inBlock = false; let c = 0;
    for (const raw of readFileSync(f, 'utf8').split('\n')) {
      const l = raw.trim();
      if (!l) continue;
      if (inBlock) { if (l.includes('*/')) inBlock = false; continue; }
      if (l.startsWith('//')) continue;
      if (l.startsWith('/*')) { if (!l.includes('*/')) inBlock = true; continue; }
      c++;
    }
    n += c; files.push({ file: relative(dir, f).split(sep).join('/'), loc: c });
  };
  roots.forEach(walk);
  return { loc: n, files };
}

// ---------------------------------------------------------------- probes commitment
export function commitProbes(ws, round, files) {
  if (!files.length) throw new Error('give at least one probes file');
  if (existsSync(paths(ws, round).staging)) throw new Error('eval-staging already exists: probes must be committed BEFORE staging (evaluator writes them from the contract)');
  const list = files.map(f => ({ path: f, sha256: sha(readFileSync(f)) }));
  const ev = emit(join(ws, 'ledger'), 'GATE', { round, gate: 'PROBES_COMMITTED', status: 'PASSED', probes: list });
  return { ok: true, ledger_seq: ev.seq, probes: list };
}

// ---------------------------------------------------------------- staging
function redact(text, needles) {
  let n = 0; let out = text;
  for (const [re, rep] of needles) out = out.replace(re, () => { n++; return rep; });
  return { out, n };
}
export function stage(ws, round) {
  const p = paths(ws, round);
  if (!gate(ws, round, 'ARMS_SEALED')) throw new Error('GATE ARMS_SEALED missing: seal evidence before staging');
  if (!gate(ws, round, 'PROBES_COMMITTED')) throw new Error('GATE PROBES_COMMITTED missing: the evaluator commits probes before seeing entrants');
  if (existsSync(p.staging)) throw new Error('eval-staging exists; staging is one-shot');
  const salt = randomBytes(16).toString('hex');
  const map = {}; const index = [];
  for (const arm of p.m.arms) {
    const src = join(p.evidence, arm.id);
    if (!existsSync(src)) continue;
    const blind = `b-${sha(`${round}|${arm.id}|${salt}`).slice(0, 8)}`;
    const dst = join(p.staging, blind);
    const needles = [
      [new RegExp(`arms/${arm.id}\\b`, 'g'), `entrants/${blind}`],
      ...p.m.arms.map(a => [new RegExp(`\\b${a.id}\\b`, 'g'), 'ENTRANT']),
      [/\btrack[ _-]?[ab]\b/gi, 'TRACK'],
    ];
    let redactions = 0; let files = 0;
    const walk = d => {
      for (const name of readdirSync(d)) {
        const full = join(d, name); const s = lstatSync(full);
        const r = relative(src, full).split(sep).join('/');
        if (s.isSymbolicLink()) continue;
        if (s.isDirectory()) { if (!STRIP_DIRS.has(name)) walk(full); continue; }
        if (!r.includes('/') && STRIP.has(name)) continue;
        const out = join(dst, r); mkdirSync(dirname(out), { recursive: true });
        const buf = readFileSync(full);
        if (TEXT_EXT.has(extname(name)) && !buf.includes(0)) { const x = redact(buf.toString('utf8'), needles); redactions += x.n; writeFileSync(out, x.out); }
        else copyFileSync(full, out);
        files++;
      }
    };
    walk(src);
    map[blind] = { arm: arm.id, track: arm.track, redactions, files };
    index.push(blind);
  }
  index.sort();
  writeJSON(p.mapFile, { round, salt, map, note: 'CONTROLLER ONLY. The evaluator must not open this file before `evalkit commit`.' });
  writeJSON(join(p.staging, 'STAGING.json'), { round, entrants: index, stripped: [...STRIP, ...STRIP_DIRS].sort(), redacted: 'arm ids, arms/<id> paths, track-a/b words' });
  return { ok: true, entrants: index.length, staging: relative(ws, p.staging) };
}

// ---------------------------------------------------------------- running suites
export function parseTap(text) {
  const g = k => { const m = new RegExp(`^# ${k} (\\d+)$`, 'm').exec(text); return m ? Number(m[1]) : null; };
  const pass = g('pass'); const fail = g('fail'); const cancelled = g('cancelled') ?? 0; const tests = g('tests');
  if (pass === null || fail === null) return { passed: 0, total: 0, parsed: false };
  return { passed: pass, total: tests ?? pass + fail + cancelled, parsed: true };
}
// A child `node --test` inherits NODE_TEST_CONTEXT from any parent test runner and then SKIPS every test (exit 0,
// empty output). Strip it, or an evaluator running inside a harness scores every entrant 0/0 without noticing.
export function childEnv(extra = {}) {
  const env = { ...process.env, NO_COLOR: '1', ...extra };
  delete env.NODE_TEST_CONTEXT;
  return env;
}
function runSuite(file, productDir, outFile, timeout = 180_000) {
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', resolve(file)], {
    env: childEnv({ PFM_PRODUCT: resolve(productDir) }), encoding: 'utf8', timeout, cwd: dirname(resolve(file)),
  });
  const parsed = parseTap(r.stdout ?? '');
  const text = `$ PFM_PRODUCT=<entrant>/product node --test --test-reporter=tap ${resolve(file)}\n[exit ${r.status}${r.signal ? ` signal ${r.signal}` : ''}${parsed.parsed ? '' : ' UNPARSEABLE: no "# pass/# fail" summary — counted as 0/0'}]\n${r.stdout ?? ''}${r.stderr ? `\n[stderr]\n${r.stderr}` : ''}`;
  writeFileSync(outFile, text);
  return { ...parsed, exit: r.status, timed_out: r.signal === 'SIGTERM' };
}

function committedSha(ws, round, kind, file) {
  const want = sha(readFileSync(file));
  if (kind === 'acceptance') {
    const g = gate(ws, round, 'MANIFEST_FROZEN');
    if (!g) throw new Error('no MANIFEST_FROZEN gate');
    if (!(g.body.acceptance ?? []).some(a => a.sha256 === want)) throw new Error(`acceptance file ${file} is not one committed at MANIFEST_FROZEN`);
  }
  if (kind === 'probes') {
    const g = gate(ws, round, 'PROBES_COMMITTED');
    if (!g || !g.body.probes.some(x => x.sha256 === want)) throw new Error(`probes file ${file} was not committed (GATE PROBES_COMMITTED)`);
  }
  return want;
}

export function runComponent(ws, round, component, { acceptance, oracle, probes } = {}) {
  const p = paths(ws, round);
  if (!existsSync(p.staging)) throw new Error('stage first');
  if (!p.m.components.some(c => c.id === component)) throw new Error(`component ${component} not in manifest`);
  if (!acceptance) throw new Error('--acceptance required');
  committedSha(ws, round, 'acceptance', acceptance);
  if (probes) committedSha(ws, round, 'probes', probes);
  const mode = gate(ws, round, 'MANIFEST_FROZEN')?.body.oracle_mode;
  if (oracle && mode?.startsWith('SEALED') && !events(ws).some(e => e.type === 'ORACLE_UNSEALED' && e.body.round === round && e.body.component === component)) {
    throw new Error(`oracle mode ${mode}: emit ORACLE_UNSEALED for ${component} (after ARMS_SEALED) before running it`);
  }
  const comp = p.m.components.find(c => c.id === component);
  const { entrants } = readJSON(join(p.staging, 'STAGING.json'));
  mkdirSync(p.evals, { recursive: true });
  const rows = [];
  for (const b of entrants) {
    const product = join(p.staging, b, 'product');
    const base = join(p.evals, `${b}.${component}`);
    const acc = runSuite(acceptance, product, `${base}.acceptance.txt`);
    const orc = oracle ? runSuite(oracle, product, `${base}.oracle.txt`) : { passed: 0, total: 0, skipped: true };
    const prb = probes ? runSuite(probes, product, `${base}.probes.txt`) : { passed: 0, total: 0, skipped: true };
    const l = loc(product, comp.paths ?? ['src']);
    const ratio = x => (x.total ? x.passed / x.total : 0);
    const evalFile = {
      round, blind_id: b, component,
      acceptance: { passed: acc.passed, total: acc.total, output_file: rel(ws, `${base}.acceptance.txt`) },
      oracle: oracle ? { passed: orc.passed, total: orc.total, output_file: rel(ws, `${base}.oracle.txt`) } : { passed: 0, total: 0, output_file: null, note: 'no oracle run' },
      edge_probes: probes ? { passed: prb.passed, total: prb.total, output_file: rel(ws, `${base}.probes.txt`) } : { passed: 0, total: 0, output_file: null, note: 'no committed probes' },
      loc_non_test: l.loc,
      criteria: {
        acceptance: Math.round(ratio(acc) * POINTS.acceptance),
        oracle: Math.round(ratio(orc) * POINTS.oracle),
        edge: Math.round(ratio(prb) * POINTS.edge),
        maintainability: null, // EVALUATOR fills 0..10 before `commit`
      },
      tests_passed: acc.total > 0 && acc.passed === acc.total,
      penalties: [], notes: [acc, orc, prb].some(x => x.parsed === false) ? 'WARNING: a suite produced no parseable TAP summary (see *.txt); counted as 0/0' : '', independence_notes: '',
    };
    writeJSON(`${base}.json`, evalFile);
    rows.push({ blind: b, acceptance: `${acc.passed}/${acc.total}`, oracle: oracle ? `${orc.passed}/${orc.total}` : '-', probes: probes ? `${prb.passed}/${prb.total}` : '-', loc: l.loc });
  }
  return { ok: true, component, rows };
}
const rel = (ws, p) => relative(ws, p).split(sep).join('/');

// ---------------------------------------------------------------- commit (evaluator's scores become immutable)
export function commit(ws, round) {
  const p = paths(ws, round);
  const schema = readJSON(join(here, '..', 'schemas', 'eval.schema.json'));
  const files = existsSync(p.evals) ? readdirSync(p.evals).filter(f => /^b-[0-9a-f]{8}\.C\d+\.json$/.test(f)) : [];
  if (!files.length) throw new Error('no eval files');
  const problems = [];
  for (const f of files) {
    const e = readJSON(join(p.evals, f));
    for (const err of validate(schema, e)) problems.push(`${f}: ${err}`);
    if (!Number.isInteger(e.criteria?.maintainability)) problems.push(`${f}: criteria.maintainability must be an integer 0..10 (evaluator judgment)`);
  }
  if (problems.length) throw new Error(`cannot commit:\n  ${problems.slice(0, 12).join('\n  ')}`);
  const t = treeHash(p.evals);
  writeJSON(join(p.rd, 'eval-commit.json'), { round, evals_tree_sha256: t.sha256, files: t.files, at: new Date().toISOString() });
  const ev = emit(join(ws, 'ledger'), 'EVAL_RECORDED', { round, phase: 'committed', evals_tree_sha256: t.sha256, eval_files: files.length, claim: 'SIMULATED' });
  return { ok: true, ledger_seq: ev.seq, ...t };
}

// ---------------------------------------------------------------- evidence audit (after commit: narratives may now be read)
export function audit(armDir, { acceptanceAllPassed = {} } = {}) {
  const schema = readJSON(join(here, '..', 'schemas', 'arm-result.schema.json'));
  const r = readJSON(join(armDir, 'ARM_RESULT.json'));
  const checks = {}; let pts = 0; const flags = [];
  if (!r) return { points: 0, checks: { arm_result: 'missing' }, flags: ['NO_SELF_REPORT'] };
  const errs = validate(schema, r);
  if (errs.length) return { points: 0, checks: { arm_result: `schema invalid: ${errs.slice(0, 3).join('; ')}` }, flags: ['ARM_RESULT_INVALID'] };
  const exists = f => { if (typeof f !== 'string' || !f) return false; const a = join(armDir, f); return existsSync(a) && statSync(a).isFile() && statSync(a).size > 0; };
  const cmds = r.commands_run ?? [];
  const cmdOk = cmds.filter(c => exists(c.output_file)).length;
  checks.commands = `${cmdOk}/${cmds.length} output files exist`;
  pts += cmds.length ? (cmdOk / cmds.length) * 3 : 0;
  const high = (r.claims ?? []).filter(c => c.level === 'LIVE_RUN' || c.level === 'MEASURED');
  const highOk = high.filter(c => (c.evidence ?? []).some(exists)).length;
  checks.claims = `${highOk}/${high.length} LIVE_RUN/MEASURED claims backed by an existing file`;
  pts += high.length ? (highOk / high.length) * 3 : (r.claims?.length ? 3 : 0);
  for (const c of high) if (!(c.evidence ?? []).some(exists)) flags.push(`UNBACKED_CLAIM: ${c.component} "${String(c.statement).slice(0, 60)}"`);
  const writes = readJSON(join(armDir, 'WRITES.json'), { files: [] }).files ?? [];
  const same = JSON.stringify([...new Set(r.files_changed)].sort()) === JSON.stringify([...new Set(writes)].sort());
  checks.writes = same ? 'files_changed == WRITES.json' : 'files_changed != WRITES.json';
  pts += same ? 2 : 0;
  const lim = (r.limitations ?? []).filter(x => typeof x === 'string' && x.trim()).length;
  checks.limitations = `${lim} stated`;
  pts += lim ? 2 : 0;
  for (const c of r.claims ?? []) {
    if (/\ball\b.*\btests?\b.*\bpass/i.test(c.statement) && acceptanceAllPassed[c.component] === false) flags.push(`CONTRADICTED_CLAIM: ${c.component} "${String(c.statement).slice(0, 60)}" but frozen acceptance failed`);
  }
  if (flags.some(f => f.startsWith('CONTRADICTED_CLAIM'))) { checks.contradiction = 'claim contradicted by evaluator-run acceptance -> evidence points 0'; pts = 0; }
  return { points: Math.round(pts), checks, flags };
}

// ---------------------------------------------------------------- join
export function join_(ws, round) {
  const p = paths(ws, round);
  const committed = readJSON(join(p.rd, 'eval-commit.json'));
  if (!committed) throw new Error('commit first');
  if (treeHash(p.evals).sha256 !== committed.evals_tree_sha256) throw new Error('evals/ changed after commit — scores are frozen; record an INCIDENT');
  if (!events(ws).some(e => e.type === 'EVAL_RECORDED' && e.body.round === round && e.body.phase === 'committed' && e.body.evals_tree_sha256 === committed.evals_tree_sha256)) throw new Error('no matching EVAL_RECORDED{phase:"committed"} in the ledger');
  const { map } = readJSON(p.mapFile);
  const iso = readJSON(join(p.rd, 'isolation-report.json'));
  if (!iso) throw new Error('isolation-report.json missing (isolation.mjs report)');
  const evalFiles = readdirSync(p.evals).filter(f => /^b-[0-9a-f]{8}\.C\d+\.json$/.test(f)).sort();
  const rows = evalFiles.map(f => ({ f, e: readJSON(join(p.evals, f)) }));
  const median = comp => { const xs = rows.filter(r => r.e.component === comp && r.e.loc_non_test > 0).map(r => r.e.loc_non_test).sort((a, b) => a - b); if (!xs.length) return 0; const h = xs.length >> 1; return xs.length % 2 ? xs[h] : (xs[h - 1] + xs[h]) / 2; };
  const accByArm = {};
  for (const { e } of rows) { const arm = map[e.blind_id]?.arm; (accByArm[arm] ??= {})[e.component] = e.tests_passed; }
  const auditDir = join(p.rd, 'audit');
  const audits = {};
  for (const arm of new Set(Object.values(map).map(x => x.arm))) {
    audits[arm] = audit(join(p.evidence, arm), { acceptanceAllPassed: accByArm[arm] ?? {} });
    writeJSON(join(auditDir, `${arm}.json`), audits[arm]);
  }
  const results = [];
  for (const { f, e } of rows) {
    const who = map[e.blind_id];
    if (!who) throw new Error(`eval ${f}: blind id not in blind-map`);
    const med = median(e.component);
    const simplicity = e.loc_non_test > 0 && med > 0 ? clamp(0, 10, Math.round(5 + (5 * (med - e.loc_non_test)) / med)) : 0;
    const crit = { ...e.criteria, simplicity, evidence: audits[who.arm].points };
    for (const pen of e.penalties ?? []) if (pen.criterion in crit) crit[pen.criterion] = 0;
    const testsPassed = e.tests_passed && !(e.penalties ?? []).some(x => x.criterion === 'acceptance');
    const score = Object.values(crit).reduce((s, x) => s + (Number(x) || 0), 0);
    const mech = crit.acceptance + crit.oracle + crit.simplicity + crit.evidence;
    results.push({
      track: who.track, arm: who.arm, component: e.component, blind_id: e.blind_id,
      score, score_mechanical: mech, criteria: crit, tests_passed: testsPassed,
      isolation_ok: iso.isolation_ok?.[who.arm] === true,
      loc_non_test: e.loc_non_test, loc_median: med,
      evidence: [rel(ws, join(p.evals, f)), e.acceptance.output_file].filter(Boolean),
      audit_flags: audits[who.arm].flags,
    });
  }
  results.sort((a, b) => (a.arm + a.component < b.arm + b.component ? -1 : 1));
  const evaluation = { round, basis_note: 'score = all criteria; score_mechanical = acceptance+oracle+simplicity+evidence (max 75)', results };
  writeJSON(join(p.rd, 'evaluation.json'), evaluation);
  const ev = emit(join(ws, 'ledger'), 'EVAL_RECORDED', { round, phase: 'joined', evaluation_sha256: sha(readFileSync(join(p.rd, 'evaluation.json'))), results: results.length, claim: 'SIMULATED' });
  return { ok: true, ledger_seq: ev.seq, results: results.map(r => `${r.arm}·${r.component}: ${r.score} (mech ${r.score_mechanical}) tests=${r.tests_passed} iso=${r.isolation_ok}`) };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  const [cmd, a, b, c] = args;
  const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
  try {
    let out;
    if (cmd === 'commit-probes') out = commitProbes(a, b, args.slice(3));
    else if (cmd === 'stage') out = stage(a, b);
    else if (cmd === 'run') out = runComponent(a, b, c, { acceptance: val('--acceptance'), oracle: val('--oracle'), probes: val('--probes') });
    else if (cmd === 'commit') out = commit(a, b);
    else if (cmd === 'join') out = join_(a, b);
    else if (cmd === 'audit') out = audit(a);
    else if (cmd === 'loc') out = loc(a, args.slice(2));
    else { console.error('usage: evalkit.mjs commit-probes|stage|run|commit|join|audit|loc ...'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2)); process.exit(out.ok === false ? 1 : 0);
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
