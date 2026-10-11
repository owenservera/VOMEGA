// node --test team/tools/team.test.mjs
// Unit + regression tests for the team tools. IDs: L ledger · I isolation · S select · V validate · C census ·
// X seal · R round · E evalkit · P portability/pack hygiene. "REG" marks a regression test for a v0.1 defect.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, symlinkSync, appendFileSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { emit, verify, show, verifyEvents } from './ledger.mjs';
import { plant, scan, fenceSnapshot, fenceCheck, fenceStep, report, scanOracle } from './isolation.mjs';
import { select, resolveParams } from './select.mjs';
import { validate } from './validate.mjs';
import { deriveFrom, record, nonceNew, nonceCheck, overlap } from './census.mjs';
import { sealDir, unseal, info, unsealToMemory } from './seal.mjs';
import { lintEvents, runOrder, williamsRow, treeHash } from './round.mjs';
import { loc, audit, parseTap } from './evalkit.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pack = join(here, '..', '..');
const tmp = () => mkdtempSync(join(tmpdir(), 'team-'));
const inPack = existsSync(join(pack, 'PACK-MANIFEST.json')); // false when the tools run from consolidated/
const sha = b => createHash('sha256').update(b).digest('hex');

// ------------------------------------------------------------------ ledger
test('L1 ledger: emit/verify/show; tamper -> structured verdict with first bad seq', () => {
  const d = tmp();
  try {
    emit(d, 'ROUND_OPENED', { round: 'R0', claim: 'DESIGN' });
    emit(d, 'ARM_STARTED', { round: 'R0', arm: 'R0-A1', track: 'A' });
    assert.equal(verify(d).ok, true);
    assert.equal(show(d, 'ARM_STARTED').length, 1);
    const p = join(d, 'ledger.jsonl');
    writeFileSync(p, readFileSync(p, 'utf8').replace('R0-A1', 'R0-B1'));
    const v = verify(d);
    assert.deepEqual([v.ok, v.seq, v.reason], [false, 2, 'hash mismatch']);
    assert.match(v.head_before_break, /^[0-9a-f]{64}$/);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('L2 ledger refuses: unknown type, bad round, LIVE_RUN without evidence, secrets', () => {
  const d = tmp();
  try {
    assert.throws(() => emit(d, 'NOPE', { round: 'R0' }), /unknown ledger type/);
    assert.throws(() => emit(d, 'GATE', { round: 'zero' }), /round/);
    assert.throws(() => emit(d, 'ARM_FINISHED', { round: 'R1', claim: 'LIVE_RUN' }), /evidence/);
    assert.throws(() => emit(d, 'INCIDENT', { round: 'R1', note: 'key AKIAABCDEFGHIJKLMNOP' }), /secret/);
    assert.throws(() => emit(d, 'STALE_LOCK_BROKEN', { round: 'R1' }), /unknown ledger type/); // journal-only types
    emit(d, 'ARM_FINISHED', { round: 'R1', claim: 'LIVE_RUN', evidence: ['arms/R1-A1/test.log'] });
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('L3 REG verify is read-only: stale lock + torn tail are reported, never repaired or appended', () => {
  const d = tmp();
  try {
    emit(d, 'ROUND_OPENED', { round: 'R0' });
    const p = join(d, 'ledger.jsonl');
    writeFileSync(`${p}.lock`, JSON.stringify({ pid: 999999 }));
    appendFileSync(p, '{"seq":2,"ts":"x"');
    const before = readFileSync(p);
    const v = verify(d);
    assert.equal(v.ok, true); assert.equal(v.count, 1);
    assert.equal(v.torn_tail.bytes, 17); assert.equal(v.lock_present.pid, 999999);
    assert.deepEqual(readFileSync(p), before, 'verify must not modify the ledger');
    assert.ok(existsSync(`${p}.lock`), 'verify must not touch the lock');
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('L4 REG bodies are normalised through JSON before hashing (Date / undefined in arrays no longer self-corrupt)', () => {
  const d = tmp();
  try {
    emit(d, 'INCIDENT', { round: 'R0', at: new Date(0), list: [undefined, 1] });
    emit(d, 'INCIDENT', { round: 'R0', note: 'second append reopens and re-verifies' });
    assert.equal(verify(d).ok, true);
    assert.deepEqual(show(d)[0].body.list, [null, 1]);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ isolation
function roundDir({ git = false } = {}) {
  const root = tmp();
  for (const dir of ['seed', 'controller', 'arms/R1-A1', 'arms/R1-B1']) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'seed/readme.txt'), 'seed');
  if (git) {
    const g = (...a) => execFileSync('git', ['-C', join(root, 'seed'), ...a], { stdio: 'ignore' });
    g('init', '-q'); g('add', '-A'); g('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'seed');
  }
  for (const a of ['R1-A1', 'R1-B1']) { writeFileSync(join(root, `arms/${a}/BRIEF.md`), `brief ${a}`); writeFileSync(join(root, `arms/${a}/base.mjs`), 'baseline'); }
  writeFileSync(join(root, 'round-manifest.json'), JSON.stringify({
    round: 'R1', seed: 'seed', controller: 'controller', isolation_strength: 'SHARED_FS_HONOR_SYSTEM',
    arms: [{ id: 'R1-A1', track: 'A', dir: 'arms/R1-A1' }, { id: 'R1-B1', track: 'B', dir: 'arms/R1-B1' }],
  }));
  return root;
}
const armDone = (root, arm, files) => {
  for (const f of files) { mkdirSync(dirname(join(root, `arms/${arm}`, f)), { recursive: true }); writeFileSync(join(root, `arms/${arm}`, f), `content ${f}`); }
  writeFileSync(join(root, `arms/${arm}/WRITES.json`), JSON.stringify({ files }));
  writeFileSync(join(root, `arms/${arm}/ARM_RESULT.json`), '{}');
};

test('I1 canary: clean run passes; copying another arm\'s canary (or just its hex) is detected', () => {
  const root = roundDir();
  try {
    plant(root);
    assert.equal(scan(root).ok, true);
    const token = readFileSync(join(root, 'arms/R1-B1/.canary'), 'utf8').trim();
    writeFileSync(join(root, 'arms/R1-A1/notes.md'), `copied ${token} by accident`);
    writeFileSync(join(root, 'arms/R1-B1/x.txt'), `hex only ${readFileSync(join(root, 'arms/R1-A1/.canary'), 'utf8').trim().slice(-24)}`);
    const r = scan(root);
    assert.equal(r.ok, false);
    assert.deepEqual(r.leaks.map(l => [l.finder, l.owner, l.match]), [['R1-A1', 'R1-B1', 'token'], ['R1-B1', 'R1-A1', 'hex']]);
    assert.deepEqual(r.tainted, ['R1-A1', 'R1-B1']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('I2 canary: tampering with own canary and symlinks are flagged', () => {
  const root = roundDir();
  try {
    plant(root);
    writeFileSync(join(root, 'arms/R1-A1/.canary'), 'edited');
    symlinkSync(join(root, 'arms/R1-B1'), join(root, 'arms/R1-A1/peek'));
    const r = scan(root);
    assert.deepEqual(r.tampered_own_canary, ['R1-A1']); assert.equal(r.symlinks.length, 1); assert.equal(r.ok, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('I3 REG fence: snapshot refuses before provisioning; BRIEF.md/ARM_RESULT.json no longer false-taint', () => {
  const root = roundDir();
  try {
    rmSync(join(root, 'arms/R1-B1/BRIEF.md'));
    plant(root);
    assert.throws(() => fenceSnapshot(root), /provision before snapshot/);
    writeFileSync(join(root, 'arms/R1-B1/BRIEF.md'), 'brief');
    fenceSnapshot(root);
    armDone(root, 'R1-A1', ['product/src/c1.mjs', 'out/t.txt']);
    armDone(root, 'R1-B1', ['product/src/c1.mjs']);
    const r = fenceCheck(root);
    assert.equal(r.ok, true, JSON.stringify(r));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('I4 REG fence: round-root stray files, seed edits, seed Git moves, brief edits, undeclared and glob writes', () => {
  const root = roundDir({ git: true });
  try {
    plant(root); fenceSnapshot(root);
    armDone(root, 'R1-A1', ['product/a.mjs']);
    writeFileSync(join(root, 'arms/R1-B1/WRITES.json'), JSON.stringify({ files: ['**'] }));
    writeFileSync(join(root, 'arms/R1-B1/sneaky.mjs'), 'x');
    appendFileSync(join(root, 'arms/R1-A1/BRIEF.md'), ' edited');
    writeFileSync(join(root, 'stray.txt'), 'x'); // v0.1: invisible
    execFileSync('git', ['-C', join(root, 'seed'), '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'moved'], { stdio: 'ignore' }); // v0.1: invisible (.git skipped)
    const r = fenceCheck(root);
    assert.equal(r.ok, false);
    assert.deepEqual(r.escapes.map(e => e.kind).sort(), ['BRIEF_MODIFIED', 'OUTSIDE_ARMS', 'SEED_GIT_CHANGED']);
    assert.deepEqual(r.unattributed, [{ arm: 'R1-B1', file: 'arms/R1-B1/sneaky.mjs' }]);
    assert.match(r.writes_problems[0].problem, /globs/);
    assert.deepEqual(r.tainted, ['R1-A1', 'R1-B1']); // unattributable escapes taint everyone (fail closed)
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('I5 fence step (sequential): escapes and cross-arm writes are attributed to the arm that just ran', () => {
  const root = roundDir();
  try {
    plant(root); fenceSnapshot(root);
    armDone(root, 'R1-A1', ['product/a.mjs']);
    assert.equal(fenceStep(root, 'R1-A1').ok, true);
    armDone(root, 'R1-B1', ['product/b.mjs']);
    writeFileSync(join(root, 'arms/R1-A1/product/a.mjs'), 'overwritten by B1');
    writeFileSync(join(root, 'seed/readme.txt'), 'edited by B1');
    const s = fenceStep(root, 'R1-B1');
    assert.equal(s.ok, false);
    assert.deepEqual(s.escapes.map(e => [e.kind, e.by]).sort(), [['CROSS_ARM_WRITE', 'R1-B1'], ['SEED_MODIFIED', 'R1-B1']]);
    const r = fenceCheck(root);
    assert.deepEqual(r.tainted, ['R1-B1']); assert.deepEqual(r.victims, ['R1-A1']); assert.equal(r.mode, 'sequential-steps');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('I6 report + scan-oracle: isolation-report.json carries strength, blind spots, per-arm isolation_ok; oracle copies caught', () => {
  const root = roundDir();
  try {
    plant(root); fenceSnapshot(root);
    armDone(root, 'R1-A1', ['product/a.mjs']); armDone(root, 'R1-B1', ['product/b.mjs']);
    const rep = report(root);
    assert.equal(rep.ok, true); assert.deepEqual(rep.isolation_ok, { 'R1-A1': true, 'R1-B1': true });
    assert.match(rep.strength_statement, /instruction/); assert.ok(rep.blind_spots.length >= 5);
    const od = join(root, 'controller/oracle'); mkdirSync(od, { recursive: true });
    writeFileSync(join(od, 'o.test.mjs'), '// ORACLE-MARKER-0123456789abcdef01\n');
    writeFileSync(join(root, 'arms/R1-B1/product/b.mjs'), 'copied // ORACLE-MARKER-0123456789abcdef01');
    const o = scanOracle(root, od);
    assert.equal(o.ok, false); assert.deepEqual(o.tainted, ['R1-B1']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ select
const res = (track, arm, component, score, over = {}) => ({ track, arm, component, score, score_mechanical: score - 20, tests_passed: true, isolation_ok: true, evidence: ['e.json'], ...over });

test('S1 select: clear winner, tie carries both, single entrant, disqualification, never across tracks', () => {
  const out = select({ round: 'R1', results: [
    res('A', 'R1-A1', 'C1', 90), res('A', 'R1-A2', 'C1', 70),
    res('A', 'R1-A1', 'C2', 80), res('A', 'R1-A2', 'C2', 78),
    res('B', 'R1-B1', 'C1', 60), res('B', 'R1-B2', 'C1', 99, { isolation_ok: false }),
    res('B', 'R1-B1', 'C2', 50, { tests_passed: false }), res('B', 'R1-B2', 'C2', 55, { evidence: [] }),
  ] });
  const d = Object.fromEntries(out.decisions.map(x => [`${x.track}${x.component}`, x]));
  assert.equal(d.AC1.status, 'SELECTED'); assert.equal(d.AC1.winner, 'R1-A1');
  assert.equal(d.AC2.status, 'TIE_CARRY_BOTH'); assert.deepEqual(d.AC2.carry, ['R1-A1', 'R1-A2']);
  assert.equal(d.BC1.status, 'SINGLE_ENTRANT'); assert.deepEqual(d.BC1.disqualified, [{ arm: 'R1-B2', why: ['isolation_not_ok'] }]);
  assert.equal(d.BC2.status, 'NO_ELIGIBLE');
  assert.equal(out.decisions.length, 4); assert.match(out.input_sha256, /^[0-9a-f]{64}$/);
});

test('S2 select: margin boundary inclusive; NaN score ineligible; mechanical basis uses score_mechanical', () => {
  const r = { round: 'R2', results: [res('A', 'R2-A1', 'C1', 85), res('A', 'R2-A2', 'C1', 80)] };
  assert.equal(select(r, { margin: 5 }).decisions[0].status, 'SELECTED');
  assert.equal(select(r, { margin: 6 }).decisions[0].status, 'TIE_CARRY_BOTH');
  const bad = select({ round: 'R2', results: [res('A', 'R2-A1', 'C1', NaN), res('A', 'R2-A2', 'C1', 70)] });
  assert.equal(bad.decisions[0].status, 'SINGLE_ENTRANT'); assert.deepEqual(bad.decisions[0].disqualified[0].why, ['bad_score']);
  const flip = { round: 'R1', results: [res('A', 'R1-A1', 'C1', 90, { score_mechanical: 60 }), res('A', 'R1-A2', 'C1', 80, { score_mechanical: 70 })] };
  assert.equal(select(flip, { margin: 5, basis: 'total' }).decisions[0].winner, 'R1-A1');
  assert.equal(select(flip, { margin: 5, basis: 'mechanical' }).decisions[0].winner, 'R1-A2');
});

test('S3 REG select refuses structural errors instead of deciding: NaN margin, duplicates, wrong track/round', () => {
  assert.throws(() => select({ round: 'R1', results: [] }, { margin: NaN }), /margin/);
  assert.throws(() => select({ round: 'R1', results: [res('A', 'R1-A1', 'C1', 90), res('A', 'R1-A1', 'C1', 40)] }), /duplicate/);
  assert.throws(() => select({ round: 'R1', results: [res('A', 'R1-B1', 'C1', 90)] }), /track A/);
  assert.throws(() => select({ round: 'R1', results: [res('A', 'R0-A1', 'C1', 90)] }), /round R1/);
  assert.throws(() => resolveParams(['e.json', '--margin']), /needs a value/);
});

test('S4 REG margin comes from the frozen manifest; a CLI deviation needs --override and is recorded', () => {
  const d = tmp();
  try {
    const m = join(d, 'm.json'); writeFileSync(m, JSON.stringify({ margin: 5, selection_basis: 'mechanical' }));
    assert.deepEqual(resolveParams(['e.json', '--manifest', m]), { margin: 5, basis: 'mechanical', margin_source: 'manifest' });
    assert.throws(() => resolveParams(['e.json', '--manifest', m, '--margin', '8']), /--override/);
    assert.deepEqual(resolveParams(['e.json', '--manifest', m, '--margin', '8', '--override', 'human decision #3']), { margin: 8, basis: 'mechanical', margin_source: 'override', override_reason: 'human decision #3' });
  } finally { rmSync(d, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ validate
test('V1 validator: team schemas accept good docs, reject bad ones, and refuse unknown keywords', () => {
  const s = JSON.parse(readFileSync(join(here, '../schemas/learning.schema.json'), 'utf8'));
  const good = { id: 'L-A-001', track: 'A', round: 'R0', statement: 'x', kind: 'technique', evidence: ['e'], applies_to: ['C1'], status: 'ACTIVE', revisit_if: 'y' };
  assert.deepEqual(validate(s, good), []);
  const errs = validate(s, { ...good, id: 'L-C-1', extra: 1, evidence: [] });
  assert.ok(errs.some(e => /does not match/.test(e)) && errs.some(e => /unexpected property extra/.test(e)) && errs.some(e => /fewer than 1/.test(e)));
  assert.ok(validate({ type: 'object', patternProperties: {} }, {}).some(e => /UNSUPPORTED_KEYWORD/.test(e)));
  for (const f of readdirSync(join(here, '../schemas'))) {
    const sch = JSON.parse(readFileSync(join(here, '../schemas', f), 'utf8'));
    assert.ok(!JSON.stringify(validate(sch, {})).includes('UNSUPPORTED_KEYWORD'), `${f} uses a keyword the validator does not support`);
  }
});

// ------------------------------------------------------------------ census
test('C1 census derivation: labels follow the fixed rules; unbacked "verified" counts as unknown', () => {
  const items = caps => ({ items: Object.entries(caps).map(([capability, status]) => ({ capability, status, evidence: null })) });
  assert.equal(deriveFrom(items({})).label, 'PROCESS REHEARSAL');
  const full = deriveFrom(items({ subagents: 'verified', subagent_separate_context: 'verified', cross_read_denied: 'verified', evaluator_fresh_context: 'verified', parallel_subagents: 'verified' }));
  assert.deepEqual([full.isolation_strength, full.independence, full.label, full.selection_basis, full.arms_execution, full.track_b_adapter], ['PROCESS_SEPARATED', 'FULL', 'MEASURED-CAPABLE', 'total', 'parallel', 'SUB-AGENT']);
  const shared = deriveFrom(items({ subagents: 'verified', subagent_separate_context: 'verified' }));
  assert.deepEqual([shared.isolation_strength, shared.independence, shared.label, shared.selection_basis], ['SHARED_FS_HONOR_SYSTEM', 'DEGRADED', 'PROCESS REHEARSAL', 'mechanical']);
  const d = tmp();
  try { // with a roundDir, verified items need their evidence file to exist
    assert.equal(deriveFrom({ items: [{ capability: 'subagents', status: 'verified', evidence: 'census/missing.txt' }, { capability: 'subagent_separate_context', status: 'verified', evidence: 'census/missing.txt' }] }, d).isolation_strength, 'SIMULATED');
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('C2 census protocols: nonce test, overlap, record refuses verified without evidence', () => {
  const r = tmp();
  try {
    const { nonce } = nonceNew(r, 'subagent_separate_context');
    assert.ok(!readFileSync(join(r, 'census/nonce-subagent_separate_context.sha256'), 'utf8').includes(nonce), 'nonce must not be on disk');
    writeFileSync(join(r, 'a1.txt'), 'I know nothing');
    assert.equal(nonceCheck(r, 'subagent_separate_context', 'a1.txt').verdict, 'SEPARATE_CONTEXT');
    writeFileSync(join(r, 'a2.txt'), `the nonce is ${nonce}`);
    assert.equal(nonceCheck(r, 'subagent_separate_context', 'a2.txt').verdict, 'SHARED_CONTEXT');
    writeFileSync(join(r, 'p1.json'), JSON.stringify({ start: '2026-10-11T10:00:00Z', end: '2026-10-11T10:00:20Z' }));
    writeFileSync(join(r, 'p2.json'), JSON.stringify({ start: '2026-10-11T10:00:10Z', end: '2026-10-11T10:00:30Z' }));
    assert.equal(overlap(r, 'p1.json', 'p2.json').parallel, true);
    assert.throws(() => record(r, 'subagents', 'verified', 'census/nothing.txt'), /evidence/);
    assert.throws(() => record(r, 'telepathy', 'unknown', null), /unknown capability/);
  } finally { rmSync(r, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ seal
test('X1 seal: roundtrip; wrong key fails fast; tampering and relabelling fail authentication', () => {
  const d = tmp();
  try {
    mkdirSync(join(d, 'in/sub'), { recursive: true });
    writeFileSync(join(d, 'in/a.mjs'), 'export const a = 1;'); writeFileSync(join(d, 'in/sub/b.txt'), 'b');
    const s = sealDir(join(d, 'in'), join(d, 'x.sealed'), { label: 'C1 oracle' });
    assert.equal(info(join(d, 'x.sealed')).sha256, s.sha256);
    const u = unseal(join(d, 'x.sealed'), join(d, 'out'), s.key);
    assert.equal(u.files, 2); assert.equal(readFileSync(join(d, 'out/sub/b.txt'), 'utf8'), 'b');
    assert.throws(() => unsealToMemory(join(d, 'x.sealed'), 'ab'.repeat(32)), /WRONG_KEY/);
    const j = JSON.parse(readFileSync(join(d, 'x.sealed'), 'utf8'));
    writeFileSync(join(d, 'relabel.sealed'), JSON.stringify({ ...j, label: 'C3 oracle' }));
    assert.throws(() => unsealToMemory(join(d, 'relabel.sealed'), s.key), /TAMPERED/);
    const ct = Buffer.from(j.ct, 'base64'); ct[0] ^= 1;
    writeFileSync(join(d, 'flip.sealed'), JSON.stringify({ ...j, ct: ct.toString('base64') }));
    assert.throws(() => unsealToMemory(join(d, 'flip.sealed'), s.key), /TAMPERED/);
    assert.throws(() => unseal(join(d, 'x.sealed'), join(d, 'out'), s.key), /not empty/);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ round
const E = (seq, type, body) => ({ seq, type, body: { round: 'R0', ...body } });
test('R1 lint: protocol-order violations are named; status gives the next step and UNKNOWN arms', () => {
  const good = [
    E(1, 'ROUND_OPENED', {}), E(2, 'CENSUS_RECORDED', {}), E(3, 'GATE', { gate: 'CENSUS_OK', status: 'PASSED' }),
    E(4, 'GATE', { gate: 'MANIFEST_FROZEN', status: 'PASSED', oracle_mode: 'SEALED_KEY_WITHHELD' }),
    E(5, 'ARM_STARTED', { arm: 'R0-A1' }), E(6, 'ARM_FINISHED', { arm: 'R0-A1' }), E(7, 'ISOLATION_CHECKED', {}),
    E(8, 'GATE', { gate: 'ARMS_SEALED', status: 'PASSED' }),
  ];
  const l = lintEvents(good);
  assert.deepEqual(l.violations, []);
  assert.match(l.rounds.R0.next, /AWAITING ORACLE KEY/);
  const bad = [
    E(1, 'ARM_STARTED', { arm: 'R0-A1' }), E(2, 'ROUND_OPENED', {}), E(3, 'ARM_STARTED', { arm: 'R0-A2' }),
    E(4, 'ARM_FINISHED', { arm: 'R0-B1' }), E(5, 'ORACLE_UNSEALED', { component: 'C1' }), E(6, 'ISOLATION_CHECKED', {}),
    E(7, 'EVAL_RECORDED', {}), E(8, 'HUMAN_DECISION', { margin: 8 }), E(9, 'ROUND_CLOSED', { status: 'CLOSED' }), E(10, 'GATE', { gate: 'X', status: 'PASSED' }),
  ];
  const codes = lintEvents(bad).violations.map(v => v.code);
  for (const c of ['EVENT_BEFORE_OPEN', 'ARM_BEFORE_FREEZE', 'FINISH_WITHOUT_START', 'UNSEAL_BEFORE_ARMS_SEALED', 'VERIFY_BEFORE_ALL_FINISHED', 'MARGIN_CHANGED_AFTER_SCORING', 'CLOSED_INCOMPLETE', 'EVENT_AFTER_CLOSE']) assert.ok(codes.includes(c), `missing ${c} in ${codes}`);
  assert.deepEqual(lintEvents(bad).rounds.R0.unknown_terminal, ['R0-A1', 'R0-A2']);
});

test('R2 counterbalanced order: Williams rows are permutations; each arm leads once and follows each other arm once over 4 rounds', () => {
  for (const n of [2, 4, 6]) for (let r = 0; r < n; r++) assert.deepEqual([...williamsRow(n, r)].sort((a, b) => a - b), [...Array(n).keys()]);
  const arms = ['R0-A1', 'R0-A2', 'R0-B1', 'R0-B2'];
  const orders = [0, 1, 2, 3].map(r => runOrder(`R${r}`, arms.map(a => a.replace('R0', `R${r}`))).map(a => a.slice(a.indexOf('-') + 1)));
  assert.deepEqual(orders[0], ['A1', 'B1', 'B2', 'A2']);
  assert.deepEqual(new Set(orders.map(o => o[0])).size, 4);
  const pairs = new Set(); for (const o of orders) for (let i = 1; i < 4; i++) pairs.add(`${o[i - 1]}>${o[i]}`);
  assert.equal(pairs.size, 12); // every ordered pair exactly once: first-order carry-over balanced
});

test('R3 tree hash is order-independent and content-sensitive', () => {
  const d = tmp();
  try {
    mkdirSync(join(d, 'a/b'), { recursive: true }); writeFileSync(join(d, 'a/b/x'), '1'); writeFileSync(join(d, 'y'), '2');
    const h1 = treeHash(d); writeFileSync(join(d, 'y'), '3'); const h2 = treeHash(d);
    assert.equal(h1.files, 2); assert.notEqual(h1.sha256, h2.sha256);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

// ------------------------------------------------------------------ evalkit
test('E1 loc counts non-test, non-blank, non-comment lines', () => {
  const d = tmp();
  try {
    mkdirSync(join(d, 'src/tests'), { recursive: true });
    writeFileSync(join(d, 'src/a.mjs'), '// c\n\nconst a = 1;\n/* block\n still */\nexport { a };\n');
    writeFileSync(join(d, 'src/a.test.mjs'), 'x\ny\n'); writeFileSync(join(d, 'src/tests/t.mjs'), 'z\n');
    assert.equal(loc(d, ['src']).loc, 2);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('E2 audit: evidence points are mechanical; contradiction with evaluator-run acceptance zeroes them', () => {
  const d = tmp();
  try {
    mkdirSync(join(d, 'out'));
    writeFileSync(join(d, 'out/t.txt'), '# pass 3');
    writeFileSync(join(d, 'WRITES.json'), JSON.stringify({ files: ['product/src/a.mjs'] }));
    const base = { round: 'R0', arm: 'R0-A1', track: 'A', components_attempted: ['C1'], commands_run: [{ cmd: 'node --test', exit_code: 0, output_file: 'out/t.txt' }],
      files_changed: ['product/src/a.mjs'], claims: [{ component: 'C1', statement: 'All C1 acceptance tests pass', level: 'LIVE_RUN', evidence: ['out/t.txt'] }], limitations: ['x'], learnings: [] };
    writeFileSync(join(d, 'ARM_RESULT.json'), JSON.stringify(base));
    assert.equal(audit(d).points, 10);
    assert.equal(audit(d, { acceptanceAllPassed: { C1: false } }).points, 0);
    writeFileSync(join(d, 'ARM_RESULT.json'), JSON.stringify({ ...base, limitations: [], claims: [{ component: 'C1', statement: 's', level: 'MEASURED', evidence: ['out/none.txt'] }] }));
    const a = audit(d); assert.equal(a.points, 5); assert.ok(a.flags[0].startsWith('UNBACKED_CLAIM'));
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('E3 parseTap reads node --test summaries', () => {
  assert.deepEqual(parseTap('ok 1\n# tests 7\n# suites 0\n# pass 6\n# fail 1\n'), { passed: 6, total: 7, parsed: true });
  assert.deepEqual(parseTap('garbage'), { passed: 0, total: 0, parsed: false });
});

// ------------------------------------------------------------------ portability & pack hygiene
test('P1 REG tools run standalone after being copied (consolidated/ step); vendored lib == kernel (drift check)', () => {
  const d = tmp();
  try {
    cpSync(here, join(d, 'tools'), { recursive: true });
    spawnSync(process.execPath, [join(here, 'make-sample.mjs'), join(d, 'fx')]);
    const r = spawnSync(process.execPath, [join(d, 'tools', 'ledger.mjs'), 'verify', join(d, 'fx/sample-round/ledger')], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); assert.equal(JSON.parse(r.stdout).count, 18);
    for (const f of ['journal.mjs', 'util.mjs']) {
      const k = join(pack, 'outputs/claude/kernel', f);
      if (existsSync(k)) assert.equal(sha(readFileSync(join(here, 'lib', f))), sha(readFileSync(k)), `team/tools/lib/${f} drifted from the kernel`);
    }
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('P2 REG make-sample writes where told (pack stays read-only) and is deterministic; vectors self-consistent', () => {
  const d = tmp();
  try {
    const run = out => spawnSync(process.execPath, [join(here, 'make-sample.mjs'), out], { encoding: 'utf8' });
    assert.equal(run(join(d, 'one')).status, 0); assert.equal(run(join(d, 'two')).status, 0);
    assert.equal(treeHash(join(d, 'one')).sha256, treeHash(join(d, 'two')).sha256, 'fixtures must be deterministic');
    if (inPack) assert.equal(treeHash(join(d, 'one')).sha256, treeHash(join(pack, 'team/fixtures')).sha256, 'committed team/fixtures are stale: run node team/tools/make-sample.mjs');
    const ch = JSON.parse(readFileSync(join(d, 'one/vectors/chain.vectors.json'), 'utf8'));
    for (const c of ch.cases) assert.deepEqual(verifyEvents(c.lines.map(l => JSON.parse(l))), c.expected, c.name);
    const sv = JSON.parse(readFileSync(join(d, 'one/vectors/select.vectors.json'), 'utf8'));
    for (const c of sv.cases) assert.deepEqual(select(c.evaluation, { margin: c.margin, basis: c.basis }), c.expected, c.name);
    for (const c of sv.must_throw) assert.throws(() => select(c.evaluation, { margin: c.margin ?? NaN, basis: c.basis }), c.name);
    const ex = JSON.parse(readFileSync(join(d, 'one/EXPECTED.json'), 'utf8'));
    assert.equal(verify(join(d, 'one/sample-round-k2/ledger')).seq, ex['sample-round-k2'].chain.seq);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('P3 the first prompt exists once in substance: ZAI_FIRST_PROMPT.txt == the fenced block in team/00_START_PROMPT_ZAI.md', { skip: !inPack && 'not inside the pack' }, () => {
  const txt = readFileSync(join(pack, 'ZAI_FIRST_PROMPT.txt'), 'utf8').trim();
  const md = readFileSync(join(pack, 'team/00_START_PROMPT_ZAI.md'), 'utf8');
  const block = /```text\n([\s\S]*?)\n```/.exec(md)?.[1]?.trim();
  assert.ok(block, 'no ```text block in 00_START_PROMPT_ZAI.md');
  assert.equal(block, txt);
});

// ------------------------------------------------------------------ consult (Track B harness over the kernel)
test('K1 consult harness: kernel-verified citations, outcomes, staleness at use, stats for ecp_usage', { skip: !existsSync(join(pack, 'outputs/claude/kernel/journal.mjs')) && 'Track B harness needs the kernel (not part of consolidated/)' }, async () => {
  const { init, commit, log, outcome, stats } = await import('./consult.mjs');
  const arm = tmp();
  try {
    mkdirSync(join(arm, 'product/src/c1'), { recursive: true });
    writeFileSync(join(arm, 'product/src/c1/plan.mjs'), 'export function plan(input) {\n  if (!input) throw new Error("x");\n  return input;\n}\n');
    init(arm);
    const r = log(arm, { regime: 'plan-review', kind: 'REVIEW', adapter: 'SCRIPTED', question: 'Does plan() validate input?', findings: [
      { id: 'F1', verdict: 'DEFECT', claim: 'falsy check only', anchors: [{ path: 'src/c1/plan.mjs', start_line: 2, end_line: 2, quote: 'if (!input) throw' }] },
      { id: 'F2', verdict: 'RISK', claim: 'misquoted', anchors: [{ path: 'src/c1/plan.mjs', start_line: 3, quote: 'return output' }] },
      { id: 'F3', verdict: 'OK', claim: 'no anchor' },
    ] });
    assert.deepEqual(r.citations, ['F1:VERIFIED', 'F2:INVALID', 'F3:UNANCHORED']);
    assert.throws(() => log(arm, { regime: 'x', kind: 'REVIEW', adapter: 'SCRIPTED', question: 'q', findings: [] }), /regime/);
    writeFileSync(join(arm, 'product/src/c1/plan.mjs'), 'export function plan(input) {\n  if (typeof input !== "object") throw new Error("x");\n  return input;\n}\n');
    commit(arm, 'fix F1');
    assert.equal(outcome(arm, 'F1', 'acted', 'replaced falsy check').stale_at_use, true); // anchored file changed since the consult's basis
    outcome(arm, 'F2', 'false_positive');
    const s = stats(arm);
    assert.deepEqual([s.consults, s.findings, s.findings_acted_on, s.false_positives, s.stale_warnings, s.invalid_citations, s.findings_without_outcome, s.adapter, s.journal_ok], [1, 3, 1, 1, 2, 1, 1, 'SCRIPTED', true]);
    assert.equal(s.verified_citation_rate, 0.5);
  } finally { rmSync(arm, { recursive: true, force: true }); }
});
