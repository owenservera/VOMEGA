// node --test team/tools/e2e.test.mjs
// END-TO-END dress rehearsal of one round, driven ONLY through the tools' command lines — the same commands the
// controller runs (team/02_ROUND_PROTOCOL.md). Toy component C9 (`add`) with a toy contract, a public acceptance
// suite, and an oracle sealed in-test with a throwaway key. Four arms: two good, one verbose, one with a defect that
// only the hidden oracle catches. This file is the executable form of the round protocol: if a step's order or
// arguments change, this test must change with it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { childEnv } from './evalkit.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const T = name => join(here, `${name}.mjs`);
function cli(tool, args, { ok = true, cwd } = {}) {
  const r = spawnSync(process.execPath, [T(tool), ...args], { encoding: 'utf8', cwd, env: childEnv() });
  if (ok && r.status !== 0) throw new Error(`${tool} ${args.join(' ')} -> exit ${r.status}\n${r.stdout}\n${r.stderr}`);
  return { ...r, json: (() => { try { return JSON.parse(r.stdout); } catch { return null; } })() };
}
const L = (ws, type, body) => cli('ledger', ['emit', join(ws, 'ledger'), type, JSON.stringify({ round: 'R0', ...body })]);
const git = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'ignore' });
const gitInit = dir => { git(dir, 'init', '-q'); git(dir, 'add', '-A'); git(dir, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'init', '--allow-empty'); };

const ACCEPTANCE = `import { test } from 'node:test'; import assert from 'node:assert/strict';
import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const { add } = await import(pathToFileURL(join(process.env.PFM_PRODUCT, 'src/c9/add.mjs')).href);
test('A1 adds small integers', () => assert.equal(add(2, 3), 5));
test('A2 rejects non-numbers', () => assert.throws(() => add('2', 3)));
`;
const ORACLE = `// ORACLE-MARKER-00aa11bb22cc33dd44
import { test } from 'node:test'; import assert from 'node:assert/strict';
import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const { add } = await import(pathToFileURL(join(process.env.PFM_PRODUCT, 'src/c9/add.mjs')).href);
test('O1 negative numbers', () => assert.equal(add(-2, -3), -5));
test('O2 rejects NaN', () => assert.throws(() => add(NaN, 1)));
test('O3 rejects Infinity', () => assert.throws(() => add(Infinity, 1)));
`;
const PROBES = `import { test } from 'node:test'; import assert from 'node:assert/strict';
import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const { add } = await import(pathToFileURL(join(process.env.PFM_PRODUCT, 'src/c9/add.mjs')).href);
test('P1 zero identity', () => assert.equal(add(0, 7), 7));
test('P2 commutative', () => assert.equal(add(4, 9), add(9, 4)));
`;
const GOOD = `export function add(a, b) {\n  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new TypeError('numbers only');\n  return a + b;\n}\n`;
const VERBOSE = `// verbose but correct\nfunction check(x) {\n  if (typeof x !== 'number') throw new TypeError('n');\n  if (Number.isNaN(x)) throw new TypeError('n');\n  if (!Number.isFinite(x)) throw new TypeError('n');\n  return x;\n}\nexport function add(a, b) {\n  const x = check(a);\n  const y = check(b);\n  const s = x + y;\n  return s;\n}\n`;
const BUGGY = `export function add(a, b) {\n  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('numbers only');\n  return a + b;\n}\n`; // misses NaN/Infinity: passes acceptance, fails oracle

test('E2E one full round through the CLIs: census -> freeze -> arms -> verify -> seal -> blind eval -> select -> close', () => {
  const ws = mkdtempSync(join(tmpdir(), 'omega-lab-'));
  try {
    const rd = join(ws, 'rounds/R0');
    // ---- setup: pack-side files (acceptance) and the sealed oracle, authored "outside the run"
    mkdirSync(join(ws, 'pack/acceptance'), { recursive: true });
    writeFileSync(join(ws, 'pack/acceptance/C9.acceptance.test.mjs'), ACCEPTANCE);
    mkdirSync(join(ws, 'oracle-src')); writeFileSync(join(ws, 'oracle-src/C9.oracle.test.mjs'), ORACLE);
    const sealed = cli('seal', ['seal', join(ws, 'oracle-src'), join(ws, 'pack/C9.oracle.sealed'), '--label', 'C9 oracle']).json;
    rmSync(join(ws, 'oracle-src'), { recursive: true }); // the run never sees the plaintext

    // ---- OPEN + CENSUS
    cli('ledger', ['init', join(ws, 'ledger')]);
    L(ws, 'ROUND_OPENED', { note: 'e2e' });
    mkdirSync(join(rd, 'census'), { recursive: true });
    writeFileSync(join(rd, 'CENSUS.json'), JSON.stringify({ round: 'R0', items: [{ capability: 'node', status: 'verified', evidence: 'census/node.txt', note: '' }] }));
    writeFileSync(join(rd, 'census/node.txt'), process.version);
    const derived = cli('census', ['derive', rd]).json;
    assert.equal(derived.label, 'PROCESS REHEARSAL'); assert.equal(derived.selection_basis, 'mechanical');
    L(ws, 'CENSUS_RECORDED', { claim: 'LIVE_RUN', evidence: ['rounds/R0/CENSUS.json'], derived });
    L(ws, 'GATE', { gate: 'CENSUS_OK', status: 'PASSED' });

    // ---- FREEZE (manifest must match the census-derived labels; run order from the tool)
    const arms = ['R0-A1', 'R0-A2', 'R0-B1', 'R0-B2'];
    const order = cli('round', ['order', 'R0', ...arms]).json.run_order;
    const accSha = sha(readFileSync(join(ws, 'pack/acceptance/C9.acceptance.test.mjs')));
    const manifest = {
      round: 'R0', seed: 'seed', controller: 'controller', isolation_strength: 'SIMULATED', margin: 5, selection_basis: 'mechanical',
      run_order: order, oracle: { mode: 'SEALED_KEY_WITHHELD', sealed: [{ component: 'C9', path: 'pack/C9.oracle.sealed', sha256: sealed.sha256, key_fingerprint: sealed.key_fingerprint }] },
      components: [{ id: 'C9', title: 'add', acceptance: ['C9 acceptance suite passes'], acceptance_files: [{ path: 'pack/acceptance/C9.acceptance.test.mjs', sha256: accSha }], hidden_oracle: true, paths: ['src/c9'] }],
      arms: arms.map(id => ({ id, track: id[3], dir: `arms/${id}`, variant: id.endsWith('1') ? 'v1' : 'v2', components: ['C9'], inherits_from: null })),
    };
    mkdirSync(join(rd, 'seed/src'), { recursive: true }); writeFileSync(join(rd, 'seed/BRIEF_PRODUCT.md'), 'toy'); gitInit(join(rd, 'seed'));
    mkdirSync(join(rd, 'controller'), { recursive: true });
    writeFileSync(join(rd, 'round-manifest.json'), JSON.stringify(manifest, null, 2));
    const bad = { ...manifest, isolation_strength: 'PROCESS_SEPARATED' };
    writeFileSync(join(rd, 'round-manifest.json'), JSON.stringify(bad));
    assert.match(cli('round', ['freeze', ws, 'R0'], { ok: false }).stdout, /no aspirational labels/); // aspirational label refused + BLOCKED gate
    writeFileSync(join(rd, 'round-manifest.json'), JSON.stringify(manifest, null, 2));
    assert.equal(cli('round', ['freeze', ws, 'R0']).json.ok, true);

    // ---- LAUNCH: provision (baseline + BRIEF) -> plant -> snapshot ; arms run sequentially in run_order
    for (const id of arms) { cpSync(join(rd, 'seed'), join(rd, `arms/${id}/product`), { recursive: true, filter: s => !s.includes('.git') }); writeFileSync(join(rd, `arms/${id}/BRIEF.md`), `brief ${id}`); }
    cli('isolation', ['plant', rd]); cli('isolation', ['fence', rd, 'snapshot']);
    const code = { 'R0-A1': GOOD, 'R0-A2': VERBOSE, 'R0-B1': GOOD, 'R0-B2': BUGGY };
    for (const id of order) {
      L(ws, 'ARM_STARTED', { arm: id, track: id[3] });
      const a = join(rd, `arms/${id}`);
      mkdirSync(join(a, 'product/src/c9'), { recursive: true }); writeFileSync(join(a, 'product/src/c9/add.mjs'), code[id]);
      mkdirSync(join(a, 'out'));
      const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', join(ws, 'pack/acceptance/C9.acceptance.test.mjs')], { env: childEnv({ PFM_PRODUCT: join(a, 'product') }), encoding: 'utf8' });
      writeFileSync(join(a, 'out/c9-acceptance.txt'), r.stdout);
      assert.match(r.stdout, /^# pass 2$/m, `acceptance must really run in ${id}`);
      const files = ['product/src/c9/add.mjs', 'out/c9-acceptance.txt'];
      if (id[3] === 'B') { mkdirSync(join(a, 'process')); writeFileSync(join(a, 'process/consults.jsonl'), `{"arm":"${id}","kind":"REVIEW","adapter":"SCRIPTED"}\n`); files.push('process/consults.jsonl'); }
      writeFileSync(join(a, 'WRITES.json'), JSON.stringify({ files }));
      writeFileSync(join(a, 'ARM_RESULT.json'), JSON.stringify({ round: 'R0', arm: id, track: id[3], components_attempted: ['C9'], commands_run: [{ cmd: 'node --test C9', exit_code: r.status, output_file: 'out/c9-acceptance.txt' }], files_changed: files,
        claims: [{ component: 'C9', statement: `All C9 acceptance tests pass in ${id}`, level: 'LIVE_RUN', evidence: ['out/c9-acceptance.txt'] }], limitations: ['toy component'], learnings: [] }));
      assert.equal(cli('isolation', ['fence', rd, 'step', id]).json.ok, true, `fence step ${id}`);
      cpSync(a, join(ws, `evidence/R0/${id}`), { recursive: true });                        // COLLECT: copy, not move
      L(ws, 'ARM_FINISHED', { arm: id, claim: 'LIVE_RUN', evidence: [`evidence/R0/${id}/out/c9-acceptance.txt`] });
    }
    // ---- VERIFY + seal evidence (end of turn A when the oracle key is withheld)
    const rep = cli('isolation', ['report', rd]).json;
    assert.equal(rep.ok, true); assert.equal(rep.isolation_strength, 'SIMULATED');
    L(ws, 'ISOLATION_CHECKED', { ok: rep.ok, tainted: rep.tainted });
    cli('round', ['seal-arms', ws, 'R0']);
    assert.match(cli('round', ['status', ws]).json.round.next, /AWAITING ORACLE KEY/);

    // ---- turn B: probes committed from the contract BEFORE staging; then stage, unseal, run
    mkdirSync(join(rd, 'controller/probes'), { recursive: true }); writeFileSync(join(rd, 'controller/probes/C9.probes.test.mjs'), PROBES);
    assert.match(cli('evalkit', ['stage', ws, 'R0'], { ok: false }).stderr, /PROBES_COMMITTED/);
    cli('evalkit', ['commit-probes', ws, 'R0', join(rd, 'controller/probes/C9.probes.test.mjs')]);
    cli('evalkit', ['stage', ws, 'R0']);
    const staged = readdirSync(join(rd, 'controller/eval-staging')).filter(d => d.startsWith('b-'));
    assert.equal(staged.length, 4);
    for (const b of staged) {
      assert.ok(!existsSync(join(rd, 'controller/eval-staging', b, 'process')), 'process/ (consult logs) must be stripped — it would reveal the track');
      assert.ok(!existsSync(join(rd, 'controller/eval-staging', b, 'ARM_RESULT.json')));
      const raw = readFileSync(join(rd, 'controller/eval-staging', b, 'out/c9-acceptance.txt'), 'utf8');
      assert.ok(!/R0-[AB]\d/.test(raw), 'arm ids must be redacted from raw outputs');
    }
    const oracleDir = join(rd, 'controller/oracle-unsealed/C9');
    assert.match(cli('evalkit', ['run', ws, 'R0', 'C9', '--acceptance', join(ws, 'pack/acceptance/C9.acceptance.test.mjs'), '--oracle', join(oracleDir, 'C9.oracle.test.mjs')], { ok: false }).stderr, /ORACLE_UNSEALED/);
    cli('seal', ['unseal', join(ws, 'pack/C9.oracle.sealed'), oracleDir, '--key', sealed.key]);
    L(ws, 'ORACLE_UNSEALED', { component: 'C9', sealed_sha256: sealed.sha256, key_fingerprint: sealed.key_fingerprint });
    assert.equal(cli('isolation', ['scan-oracle', rd, oracleDir]).json.ok, true);
    cli('evalkit', ['run', ws, 'R0', 'C9', '--acceptance', join(ws, 'pack/acceptance/C9.acceptance.test.mjs'), '--oracle', join(oracleDir, 'C9.oracle.test.mjs'), '--probes', join(rd, 'controller/probes/C9.probes.test.mjs')]);
    assert.throws(() => cli('evalkit', ['commit', ws, 'R0']), /maintainability/); // the judgment field is mandatory
    for (const f of readdirSync(join(rd, 'evals')).filter(f => f.endsWith('.C9.json'))) {
      const e = JSON.parse(readFileSync(join(rd, 'evals', f), 'utf8')); e.criteria.maintainability = 7; writeFileSync(join(rd, 'evals', f), JSON.stringify(e, null, 2));
    }
    cli('evalkit', ['commit', ws, 'R0']);
    const evf = readdirSync(join(rd, 'evals')).find(f => f.endsWith('.C9.json'));
    const orig = readFileSync(join(rd, 'evals', evf), 'utf8');
    writeFileSync(join(rd, 'evals', evf), orig.replace('"maintainability": 7', '"maintainability": 10'));
    assert.match(cli('evalkit', ['join', ws, 'R0'], { ok: false }).stderr, /changed after commit/); // scores are frozen at commit
    writeFileSync(join(rd, 'evals', evf), orig);
    cli('evalkit', ['join', ws, 'R0']);
    const evaluation = JSON.parse(readFileSync(join(rd, 'evaluation.json'), 'utf8'));
    const byArm = Object.fromEntries(evaluation.results.map(r => [r.arm, r]));
    assert.equal(byArm['R0-B2'].criteria.oracle < byArm['R0-B1'].criteria.oracle, true, 'the oracle must separate B2 from B1');
    assert.equal(byArm['R0-A2'].criteria.simplicity < byArm['R0-A1'].criteria.simplicity, true, 'verbose variant scores lower on simplicity');
    assert.equal(byArm['R0-A1'].criteria.evidence, 10);

    // ---- SELECT (margin + basis from the frozen manifest), reproduce, assimilate, close
    const sel = cli('select', [join(rd, 'evaluation.json'), '--manifest', join(rd, 'round-manifest.json')]);
    writeFileSync(join(rd, 'selection.json'), sel.stdout);
    assert.equal(cli('select', [join(rd, 'evaluation.json'), '--manifest', join(rd, 'round-manifest.json')]).stdout, sel.stdout, 'SELECTION_APPLIED: bit-for-bit');
    const d = Object.fromEntries(sel.json.decisions.map(x => [`${x.track}${x.component}`, x]));
    assert.equal(sel.json.basis, 'mechanical');
    assert.equal(d.BC9.status, 'SELECTED'); assert.equal(d.BC9.winner, 'R0-B1');
    L(ws, 'EVAL_RECORDED', { phase: 'note', note: 'joined above' });
    L(ws, 'SELECTION_RECORDED', { input_sha256: sel.json.input_sha256, decisions: sel.json.decisions.map(x => `${x.track}${x.component}:${x.status}`) });
    for (const t of ['a', 'b']) {
      const main = join(ws, `track-${t}/main`); mkdirSync(main, { recursive: true }); writeFileSync(join(main, 'PROVENANCE.md'), 'x');
      gitInit(main); git(main, 'tag', `track-${t}-R0`);
      L(ws, 'PHASE', { role: `master-${t}`, will_not_read: [`track-${t === 'a' ? 'b' : 'a'}`] });
      L(ws, 'ASSIMILATED', { track: t.toUpperCase(), tag: `track-${t}-R0` });
    }
    mkdirSync(join(ws, 'track-a'), { recursive: true }); writeFileSync(join(ws, 'track-a/learnings.jsonl'), ''); writeFileSync(join(ws, 'track-b/learnings.jsonl'), '');
    mkdirSync(join(ws, 'cockpit')); writeFileSync(join(ws, 'cockpit/e2e-R0.txt'), 'K1..K8 (toy)');
    writeFileSync(join(rd, 'NEXT_ROUND_PLAN.md'), 'R1: ...');
    const chk = cli('round', ['check', ws, 'R0']).json;
    assert.equal(chk.allowed_status, 'CLOSED', JSON.stringify(chk, null, 2));
    assert.equal(chk.selection_reproduced, true); assert.deepEqual(chk.integrity_findings, []); assert.deepEqual(chk.lint_violations, []);
    const fs = readFileSync(join(ws, 'reports/R0-firstscreen.md'), 'utf8');
    writeFileSync(join(ws, 'reports/R0-closure.md'), `# Round R0 closure\n\n${fs}\n## rest of report\n`);
    assert.equal(cli('round', ['check', ws, 'R0', '--closure', join(ws, 'reports/R0-closure.md')]).json.closure_first_screen_verbatim, true);
    writeFileSync(join(ws, 'reports/R0-closure.md'), `# Round R0 closure\n\n${fs.replace('PROCESS REHEARSAL', 'MEASURED-CAPABLE')}`);
    assert.equal(cli('round', ['check', ws, 'R0', '--closure', join(ws, 'reports/R0-closure.md')], { ok: false }).json.closure_first_screen_verbatim, false, 'an edited label must be caught');
    L(ws, 'ROUND_CLOSED', { status: 'CLOSED' });
    const st = cli('round', ['status', ws]).json;
    assert.equal(st.ok, true); assert.match(st.round.next, /STOPPED/);
    // ---- integrity after the fact: tampering with evidence is detected by check
    writeFileSync(join(ws, 'evidence/R0/R0-B2/product/src/c9/add.mjs'), GOOD);
    assert.ok(cli('round', ['check', ws, 'R0'], { ok: false }).json.integrity_findings.includes('EVIDENCE_CHANGED_AFTER_ARMS_SEALED'));
    assert.equal(cli('ledger', ['verify', join(ws, 'ledger')]).json.ok, true);
  } finally { if (process.env.KEEP_E2E) console.error(`kept workspace: ${ws}`); else rmSync(ws, { recursive: true, force: true }); }
});

import { createHash } from 'node:crypto';
function sha(b) { return createHash('sha256').update(b).digest('hex'); }
