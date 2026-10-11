// Round integrity: commitments, protocol-order lint, recovery status, and the closure check that COMPUTES the
// first-screen labels from files (the agent copies them; it does not choose them).
//
//   node team/tools/round.mjs order   <roundNumber> <armId...>          # counterbalanced run order (Williams design)
//   node team/tools/round.mjs freeze  <workspace> R<n>                  # validate + commit manifest/acceptance/oracle -> GATE MANIFEST_FROZEN
//   node team/tools/round.mjs seal-arms <workspace> R<n>                # hash evidence/R<n> -> GATE ARMS_SEALED (before any oracle unseal)
//   node team/tools/round.mjs status  <workspace> [R<n>]                # read-only: where are we, what is next, lint findings
//   node team/tools/round.mjs check   <workspace> R<n> [--closure <report.md>]   # deliverables + labels -> reports/R<n>-firstscreen.{md,json}
//   node team/tools/round.mjs tree-hash <dir>                           # sha256 over sorted (path, sha256) pairs
//
// Workspace layout (team/03 §1): ledger/  rounds/R<n>/  evidence/R<n>/  track-a/  track-b/  consolidated/  cockpit/  reports/
// Every subcommand except freeze/seal-arms is read-only.
import { readFileSync, writeFileSync, existsSync, readdirSync, lstatSync, mkdirSync } from 'node:fs';
import { join, relative, sep, dirname, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verify as verifyLedger, readLedger, emit } from './ledger.mjs';
import { select } from './select.mjs';
import { validate } from './validate.mjs';
import { deriveFrom } from './census.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const sha = b => createHash('sha256').update(b).digest('hex');
const readJSON = (p, d = undefined) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : d);
const roundNum = r => Number(String(r).replace(/^R/, ''));

// ---------------------------------------------------------------------------------------------------------------
// tree hash
export function treeHash(dir) {
  const rows = [];
  const walk = d => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d).sort()) {
      if (name === 'node_modules' || name === '.git') continue;
      const full = join(d, name); const st = lstatSync(full);
      const p = relative(dir, full).split(sep).join('/');
      if (st.isSymbolicLink()) rows.push(`${p}\0SYMLINK`);
      else if (st.isDirectory()) walk(full);
      else rows.push(`${p}\0${sha(readFileSync(full))}`);
    }
  };
  walk(dir);
  rows.sort();
  return { sha256: sha(rows.join('\n')), files: rows.length };
}

// ---------------------------------------------------------------------------------------------------------------
// counterbalanced order: Williams design (balances first-order carry-over for even n); arms interleaved by track.
export function williamsRow(n, r) {
  const first = [0];
  for (let i = 1, lo = 1, hi = n - 1; first.length < n; i++) first.push(i % 2 ? lo++ : hi--);
  if (n % 2) return first.map((_, i) => (i + r) % n); // odd n: cyclic rotation (only partially balanced; stated)
  return first.map(x => (x + r) % n);
}
export function runOrder(round, armIds) {
  const byTrack = {};
  for (const id of [...armIds].sort()) { const t = /-([A-Z])\d+$/.exec(id)?.[1] ?? '?'; (byTrack[t] ??= []).push(id); }
  const tracks = Object.keys(byTrack).sort();
  const canonical = [];
  for (let i = 0; canonical.length < armIds.length; i++) for (const t of tracks) if (byTrack[t][i]) canonical.push(byTrack[t][i]);
  const row = williamsRow(canonical.length, roundNum(round) % canonical.length);
  return row.map(i => canonical[i]);
}

// ---------------------------------------------------------------------------------------------------------------
// protocol lint over the ledger
const ORDER = ['ROUND_OPENED', 'CENSUS_RECORDED', 'GATE:CENSUS_OK', 'GATE:MANIFEST_FROZEN', 'ARMS', 'ISOLATION_CHECKED', 'GATE:ARMS_SEALED',
  'ORACLE_UNSEALED', 'GATE:PROBES_COMMITTED', 'EVAL_RECORDED', 'SELECTION_RECORDED', 'ASSIMILATED', 'CONSOLIDATED', 'GATE:COCKPIT_INGEST', 'ROUND_CLOSED'];

export function lintEvents(events) {
  const rounds = {}; const violations = [];
  const R = id => (rounds[id] ??= { round: id, opened: null, closed: null, arms: {}, gates: [], incidents: [], decisions: [], seen: new Set(), oracle_mode: null, assimilated: new Set(), eval_seq: null });
  let openRound = null;
  const v = (ev, code, detail = '') => violations.push({ seq: ev.seq, round: ev.body?.round, code, detail });
  for (const ev of events) {
    const id = ev.body?.round; if (!id) continue;
    const r = R(id);
    if (['STALE_LOCK_BROKEN', 'TORN_TAIL_DISCARDED'].includes(ev.type)) continue;
    if (ev.type === 'HUMAN_DECISION') {
      r.decisions.push({ seq: ev.seq, ...ev.body });
      if (ev.body.margin !== undefined && r.eval_seq) v(ev, 'MARGIN_CHANGED_AFTER_SCORING', 'a margin decision must precede EVAL_RECORDED');
      continue;
    }
    if (ev.type === 'ROUND_OPENED') {
      if (r.opened) v(ev, 'DUPLICATE_OPEN');
      if (openRound && openRound !== id) v(ev, 'OVERLAPPING_ROUNDS', `${openRound} not closed`);
      r.opened = ev.seq; openRound = id; r.seen.add('ROUND_OPENED'); continue;
    }
    if (!r.opened) v(ev, 'EVENT_BEFORE_OPEN', ev.type);
    if (r.closed) v(ev, 'EVENT_AFTER_CLOSE', ev.type);
    const key = ev.type === 'GATE' ? `GATE:${ev.body.gate}` : ev.type;
    switch (ev.type) {
      case 'GATE':
        r.gates.push({ seq: ev.seq, gate: ev.body.gate, status: ev.body.status });
        if (ev.body.gate === 'MANIFEST_FROZEN' && ev.body.status === 'PASSED') r.oracle_mode = ev.body.oracle_mode ?? null;
        if (ev.body.gate === 'ARMS_SEALED' && !r.seen.has('ISOLATION_CHECKED')) v(ev, 'ARMS_SEALED_BEFORE_VERIFY');
        break;
      case 'ARM_STARTED': {
        if (!r.gates.some(g => g.gate === 'MANIFEST_FROZEN' && g.status === 'PASSED')) v(ev, 'ARM_BEFORE_FREEZE', ev.body.arm);
        const a = (r.arms[ev.body.arm] ??= {});
        if (a.started) v(ev, 'DUPLICATE_ARM_EVENT', `ARM_STARTED ${ev.body.arm}`);
        a.started = ev.seq; a.track = ev.body.track; break;
      }
      case 'ARM_FINISHED': {
        const a = (r.arms[ev.body.arm] ??= {});
        if (!a.started && ev.body.status !== 'NOT_RUN') v(ev, 'FINISH_WITHOUT_START', ev.body.arm);
        if (a.finished) v(ev, 'DUPLICATE_ARM_EVENT', `ARM_FINISHED ${ev.body.arm}`);
        a.finished = ev.seq; a.status = ev.body.status ?? 'FINISHED'; break;
      }
      case 'ISOLATION_CHECKED': {
        const open = Object.entries(r.arms).filter(([, a]) => a.started && !a.finished).map(([k]) => k);
        if (open.length) v(ev, 'VERIFY_BEFORE_ALL_FINISHED', open.join(','));
        break;
      }
      case 'ORACLE_UNSEALED':
        if (!r.gates.some(g => g.gate === 'ARMS_SEALED' && g.status === 'PASSED')) v(ev, 'UNSEAL_BEFORE_ARMS_SEALED', ev.body.component ?? '');
        break;
      case 'EVAL_RECORDED':
        if (!r.seen.has('ISOLATION_CHECKED')) v(ev, 'EVAL_BEFORE_VERIFY');
        r.eval_seq ??= ev.seq; break;
      case 'SELECTION_RECORDED':
        if (!r.seen.has('EVAL_RECORDED')) v(ev, 'SELECTION_BEFORE_EVAL'); break;
      case 'ASSIMILATED':
        if (!r.seen.has('SELECTION_RECORDED')) v(ev, 'ASSIMILATION_BEFORE_SELECTION');
        if (ev.body.track) r.assimilated.add(ev.body.track); break;
      case 'INCIDENT': r.incidents.push({ seq: ev.seq, kind: ev.body.kind, note: ev.body.note }); break;
      case 'ROUND_CLOSED': {
        if (r.closed) v(ev, 'DUPLICATE_CLOSE');
        r.closed = { seq: ev.seq, status: ev.body.status };
        if (ev.body.status === 'CLOSED') {
          const missing = ['EVAL_RECORDED', 'SELECTION_RECORDED'].filter(k => !r.seen.has(k));
          if (!r.assimilated.size) missing.push('ASSIMILATED');
          if (missing.length) v(ev, 'CLOSED_INCOMPLETE', `missing ${missing.join(',')} — must be ABORTED or FROZEN`);
        }
        if (openRound === id) openRound = null;
        break;
      }
      default: break;
    }
    r.seen.add(key);
    if (ev.type === 'ARM_STARTED' || ev.type === 'ARM_FINISHED') r.seen.add('ARMS');
  }
  const summary = {};
  for (const [id, r] of Object.entries(rounds)) {
    const unknownTerminal = Object.entries(r.arms).filter(([, a]) => a.started && !a.finished).map(([k]) => k);
    let next = r.closed ? 'STOPPED (round closed): wait for the human' : null;
    if (!next) {
      const sealedMode = r.oracle_mode && r.oracle_mode.startsWith('SEALED');
      if (r.seen.has('GATE:ARMS_SEALED') && sealedMode && !r.seen.has('ORACLE_UNSEALED')) next = 'AWAITING ORACLE KEY — end of turn A; the human pastes: unseal <component> <key>';
      else if (unknownTerminal.length) next = `ARMS still open: ${unknownTerminal.join(', ')} (on recovery emit ARM_FINISHED{status:"UNKNOWN"})`;
      else next = ORDER.find(k => !r.seen.has(k) && !(k === 'ORACLE_UNSEALED' && !sealedMode)) ?? 'ROUND_CLOSED';
    }
    summary[id] = {
      opened_seq: r.opened, closed: r.closed, oracle_mode: r.oracle_mode, next,
      arms: r.arms, unknown_terminal: unknownTerminal, gates: r.gates, incidents: r.incidents, human_decisions: r.decisions,
      assimilated_tracks: [...r.assimilated].sort(),
    };
  }
  return { rounds: summary, violations };
}

export function status(ws, round) {
  const v = verifyLedger(join(ws, 'ledger'));
  const { events } = readLedger(join(ws, 'ledger'));
  const lint = lintEvents(events);
  const ids = Object.keys(lint.rounds).sort((a, b) => roundNum(a) - roundNum(b));
  const current = round ?? ids.at(-1) ?? null;
  return {
    ok: v.ok && lint.violations.length === 0,
    ledger: { ok: v.ok, count: v.count, head: v.head ?? null, ...(v.ok ? {} : { first_bad_seq: v.seq, reason: v.reason }) },
    current_round: current, round: current ? lint.rounds[current] : null,
    violations: lint.violations, rounds_seen: ids,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// freeze: validate and commit
function manifestSchema() { return readJSON(join(here, '..', 'schemas', 'round-manifest.schema.json')); }
function hashFileList(ws, list = []) {
  return list.map(f => {
    const p = isAbsolute(f.path) ? f.path : join(ws, f.path);
    const actual = existsSync(p) ? sha(readFileSync(p)) : null;
    return { path: f.path, declared: f.sha256 ?? null, actual };
  });
}

export function freezeCheck(ws, round) {
  const rd = join(ws, 'rounds', round);
  const errors = [];
  const m = readJSON(join(rd, 'round-manifest.json'));
  if (!m) return { ok: false, errors: ['round-manifest.json missing'] };
  for (const e of validate(manifestSchema(), m)) errors.push(`schema: ${e}`);
  if (m.round !== round) errors.push(`manifest.round ${m.round} != ${round}`);
  const census = readJSON(join(rd, 'CENSUS.json')) ?? readJSON(join(ws, 'rounds', 'R0', 'CENSUS.json'));
  const derived = census ? deriveFrom(census, existsSync(join(rd, 'CENSUS.json')) ? rd : join(ws, 'rounds', 'R0')) : null;
  if (!derived) errors.push('CENSUS.json missing — run census.mjs probe/derive first');
  else {
    if (m.isolation_strength !== derived.isolation_strength) errors.push(`isolation_strength ${m.isolation_strength} != census-derived ${derived.isolation_strength} (no aspirational labels)`);
    if ((m.selection_basis ?? 'total') !== derived.selection_basis) errors.push(`selection_basis ${m.selection_basis ?? 'total'} != census-derived ${derived.selection_basis}`);
    if (derived.arms_execution === 'sequential' && m.run_order) {
      const want = runOrder(round, m.arms.map(a => a.id));
      if (JSON.stringify(want) !== JSON.stringify(m.run_order)) errors.push(`run_order must be ${JSON.stringify(want)} (round.mjs order)`);
    }
    if (derived.arms_execution === 'sequential' && !m.run_order) errors.push('sequential execution needs run_order (round.mjs order)');
  }
  for (const c of m.components ?? []) {
    const files = hashFileList(ws, c.acceptance_files);
    for (const f of files) {
      if (!f.actual) errors.push(`${c.id}: acceptance file missing ${f.path}`);
      else if (f.declared && f.declared !== f.actual) errors.push(`${c.id}: acceptance file ${f.path} sha mismatch`);
    }
  }
  const o = m.oracle ?? { mode: 'NONE' };
  let oracleCommit = null;
  if (o.mode?.startsWith('SEALED')) {
    oracleCommit = hashFileList(ws, o.sealed);
    for (const f of oracleCommit) { if (!f.actual) errors.push(`sealed oracle missing ${f.path}`); else if (f.declared !== f.actual) errors.push(`sealed oracle ${f.path} sha mismatch (declared ${f.declared})`); }
    const covered = new Set((o.sealed ?? []).map(s => s.component));
    for (const c of m.components ?? []) if (c.hidden_oracle && !covered.has(c.id)) errors.push(`${c.id}: hidden_oracle true but no sealed oracle listed`);
  } else if (o.mode === 'CONTROLLER_AUTHORED') {
    const t = treeHash(join(rd, m.controller ?? 'controller', 'oracle'));
    if (!t.files) errors.push('CONTROLLER_AUTHORED oracle: controller/oracle/ is empty');
    oracleCommit = t;
  } else errors.push('manifest.oracle.mode must be SEALED_KEY_WITHHELD | SEALED_KEY_IN_PROMPT | CONTROLLER_AUTHORED');
  const lv = verifyLedger(join(ws, 'ledger'));
  if (!lv.ok) errors.push(`ledger does not verify (seq ${lv.seq}: ${lv.reason})`);
  const { events } = readLedger(join(ws, 'ledger'));
  if (!events.some(e => e.type === 'ROUND_OPENED' && e.body.round === round)) errors.push(`no ROUND_OPENED for ${round} in the ledger`);
  return {
    ok: errors.length === 0, errors,
    commit: {
      manifest_sha256: sha(readFileSync(join(rd, 'round-manifest.json'))),
      acceptance: (m.components ?? []).flatMap(c => hashFileList(ws, c.acceptance_files).map(f => ({ component: c.id, path: f.path, sha256: f.actual }))),
      oracle_mode: o.mode ?? 'NONE', oracle: oracleCommit,
      margin: m.margin, selection_basis: m.selection_basis ?? 'total', isolation_strength: m.isolation_strength,
      run_order: m.run_order ?? null, derived_label: derived?.label ?? null,
    },
  };
}

export function freeze(ws, round) {
  const r = freezeCheck(ws, round);
  const body = r.ok ? { round, gate: 'MANIFEST_FROZEN', status: 'PASSED', ...r.commit } : { round, gate: 'MANIFEST_FROZEN', status: 'BLOCKED', errors: r.errors.slice(0, 20) };
  const ev = emit(join(ws, 'ledger'), 'GATE', body);
  return { ...r, ledger_seq: ev.seq };
}

export function sealArms(ws, round) {
  const { events } = readLedger(join(ws, 'ledger'));
  if (!events.some(e => e.type === 'ISOLATION_CHECKED' && e.body.round === round)) throw new Error('ISOLATION_CHECKED must precede ARMS_SEALED');
  if (events.some(e => e.type === 'ORACLE_UNSEALED' && e.body.round === round)) throw new Error('an oracle was already unsealed in this round; ARMS_SEALED would be meaningless');
  const t = treeHash(join(ws, 'evidence', round));
  if (!t.files) throw new Error(`evidence/${round} is empty — COLLECT first`);
  const ev = emit(join(ws, 'ledger'), 'GATE', { round, gate: 'ARMS_SEALED', status: 'PASSED', evidence_tree_sha256: t.sha256, files: t.files });
  return { ok: true, ledger_seq: ev.seq, ...t };
}

// ---------------------------------------------------------------------------------------------------------------
// closure check
function gitTagExists(dir, tag) {
  try { return execFileSync('git', ['-C', dir, 'tag', '-l', tag], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === tag; } catch { return false; }
}
const stripSelection = s => ({ round: s.round, basis: s.basis, margin: s.margin, input_sha256: s.input_sha256, decisions: s.decisions });

export function check(ws, round, { closure } = {}) {
  const rd = join(ws, 'rounds', round);
  const ev = join(ws, 'evidence', round);
  const st = status(ws, round);
  const rs = st.round ?? {};
  const gates = rs.gates ?? [];
  const frozen = [...gates].reverse().find(g => g.gate === 'MANIFEST_FROZEN' && g.status === 'PASSED');
  const { events } = readLedger(join(ws, 'ledger'));
  const bodyAt = seq => events.find(e => e.seq === seq)?.body ?? {};
  const findings = [];
  const m = readJSON(join(rd, 'round-manifest.json'));
  const census = readJSON(join(rd, 'CENSUS.json'));
  const derived = census ? deriveFrom(census, rd) : null;

  // integrity: manifest unchanged since freeze; evidence unchanged since ARMS_SEALED
  if (frozen && m) {
    const now = sha(readFileSync(join(rd, 'round-manifest.json')));
    if (bodyAt(frozen.seq).manifest_sha256 !== now) findings.push('MANIFEST_CHANGED_AFTER_FREEZE');
  }
  const packCommit = events.find(e => e.type === 'ROUND_OPENED' && e.body.pack_tree_sha256)?.body.pack_tree_sha256;
  if (packCommit && existsSync(join(ws, 'pack')) && treeHash(join(ws, 'pack')).sha256 !== packCommit) findings.push('PACK_MODIFIED (the pack copy is read-only reference)');
  const sealed = [...gates].reverse().find(g => g.gate === 'ARMS_SEALED' && g.status === 'PASSED');
  if (sealed && treeHash(ev).sha256 !== bodyAt(sealed.seq).evidence_tree_sha256) findings.push('EVIDENCE_CHANGED_AFTER_ARMS_SEALED');

  // selection reproduction
  let selectionReproduced = null;
  const evaluation = readJSON(join(rd, 'evaluation.json'));
  const selection = readJSON(join(rd, 'selection.json'));
  if (evaluation && selection && m) {
    try {
      const again = select(evaluation, { margin: m.margin, basis: m.selection_basis ?? 'total' });
      selectionReproduced = JSON.stringify(stripSelection(again)) === JSON.stringify(stripSelection(selection));
    } catch (e) { selectionReproduced = false; findings.push(`SELECTION_ERROR ${e.message}`); }
    if (selectionReproduced === false) findings.push('SELECTION_NOT_REPRODUCED');
  }
  const iso = readJSON(join(rd, 'isolation-report.json'));
  const armIds = (m?.arms ?? []).map(a => a.id);
  const ran = armIds.filter(a => existsSync(join(ev, a, 'ARM_RESULT.json')) || existsSync(join(ev, a)));
  const notRun = Object.entries(rs.arms ?? {}).filter(([, a]) => a.status === 'NOT_RUN').map(([k]) => k);
  const tagA = `track-a-${round}`; const tagB = `track-b-${round}`;
  const tags = { A: gitTagExists(join(ws, 'track-a', 'main'), tagA), B: gitTagExists(join(ws, 'track-b', 'main'), tagB) };
  const learnings = ['track-a', 'track-b'].map(t => join(ws, t, 'learnings.jsonl')).filter(existsSync).length;
  const e2e = join(ws, 'cockpit', `e2e-${round}.txt`);
  const D = [
    ['1', 'Capability census with command proof', `rounds/${round}/CENSUS.json`, census ? (derived ? 'present, labels derived' : 'present, NOT derived') : 'MISSING'],
    ['2', 'Frozen manifest + hidden oracle', `rounds/${round}/round-manifest.json`, frozen ? `frozen at seq ${frozen.seq} (oracle ${rs.oracle_mode})` : 'MISSING (no MANIFEST_FROZEN PASSED)'],
    ['3', 'Ledger, verified', 'ledger/ledger.jsonl', st.ledger.ok ? `PASS ${st.ledger.count} events` : `FAIL at seq ${st.ledger.first_bad_seq}`],
    ['4', 'Arm results incl. NOT_RUN', `evidence/${round}/*/`, `${ran.length} with evidence, ${notRun.length} NOT_RUN, ${rs.unknown_terminal?.length ?? 0} UNKNOWN`],
    ['5', 'Isolation report', `rounds/${round}/isolation-report.json`, iso ? (iso.ok ? 'clean' : `tainted: ${iso.tainted.join(', ')}`) : 'MISSING'],
    ['6', 'Blind evaluation', `rounds/${round}/evaluation.json`, evaluation ? `${evaluation.results?.length ?? 0} rows` : 'MISSING'],
    ['7', 'Selection + assimilation', `rounds/${round}/selection.json`, selection ? `reproduced=${selectionReproduced} · A tag ${tags.A ? 'yes' : 'no'} · B tag ${tags.B ? 'yes' : 'no'}` : 'MISSING'],
    ['8', 'Learnings + next-round plan', 'track-*/learnings.jsonl, NEXT_ROUND_PLAN.md', `${learnings}/2 learning books · plan ${existsSync(join(rd, 'NEXT_ROUND_PLAN.md')) || existsSync(join(ws, 'reports', 'NEXT_ROUND_PLAN.md')) ? 'present' : 'MISSING'}`],
    ['9', 'Cockpit state + E2E', `cockpit/e2e-${round}.txt`, existsSync(e2e) ? 'present' : 'MISSING'],
  ];
  const mayClose = st.ledger.ok && !!evaluation && !!selection && (tags.A || tags.B) && !findings.length && !st.violations.length;
  const label = derived?.label ?? 'PROCESS REHEARSAL';
  const fs = {
    round, generated_at: new Date().toISOString(),
    ledger: st.ledger, lint_violations: st.violations,
    isolation_strength: derived?.isolation_strength ?? 'UNKNOWN', independence: derived?.independence ?? 'UNKNOWN',
    arms_execution: derived?.arms_execution ?? 'UNKNOWN', track_b_adapter: derived?.track_b_adapter ?? 'UNKNOWN',
    selection_basis: m?.selection_basis ?? 'total', oracle_mode: rs.oracle_mode ?? 'UNKNOWN',
    track_b_cognitive_hypothesis: derived?.track_b_cognitive_hypothesis ?? 'UNKNOWN',
    label, integrity_findings: findings, selection_reproduced: selectionReproduced,
    deliverables: D.map(([n, name, path, state]) => ({ n, name, path, state })),
    allowed_status: mayClose ? 'CLOSED' : 'ABORTED or FROZEN (CLOSED requires: ledger PASS, evaluation, selection, ≥1 tagged track main, no integrity/lint findings)',
  };
  const head8 = (st.ledger.head ?? '').slice(0, 8);
  const md = [
    `<!-- FIRST-SCREEN: generated by team/tools/round.mjs check — copy verbatim; do not edit -->`,
    `**Label:** ${label}   ·   **Allowed status:** ${mayClose ? 'CLOSED' : 'ABORTED or FROZEN'}`,
    `**Ledger:** ${st.ledger.count} events, head ${head8 || '-'}, verify: ${st.ledger.ok ? 'PASS' : `FAIL at seq ${st.ledger.first_bad_seq}`}   ·   **Lint:** ${st.violations.length ? st.violations.map(x => `${x.code}@${x.seq}`).join(', ') : 'clean'}`,
    `**Isolation strength:** ${fs.isolation_strength}   ·   **Independence:** ${fs.independence}   ·   **Arms executed:** ${fs.arms_execution}`,
    `**Track B adapter:** ${fs.track_b_adapter} — cognitive hypothesis ${fs.track_b_cognitive_hypothesis}`,
    `**Oracle:** ${fs.oracle_mode}   ·   **Selection basis:** ${fs.selection_basis}, margin ${m?.margin ?? '?'}   ·   **Selection reproduced:** ${selectionReproduced ?? 'n/a'}`,
    `**Integrity findings:** ${findings.length ? findings.join(', ') : 'none'}`,
    '',
    '| # | Deliverable | Path | State |', '|---|---|---|---|',
    ...D.map(([n, name, path, state]) => `| ${n} | ${name} | ${path} | ${state} |`),
    `<!-- /FIRST-SCREEN -->`,
  ].join('\n');
  mkdirSync(join(ws, 'reports'), { recursive: true });
  writeFileSync(join(ws, 'reports', `${round}-firstscreen.md`), `${md}\n`);
  writeFileSync(join(ws, 'reports', `${round}-firstscreen.json`), `${JSON.stringify(fs, null, 2)}\n`);
  let closureOk = null;
  if (closure) {
    const text = existsSync(closure) ? readFileSync(closure, 'utf8') : '';
    closureOk = text.includes(md);
    if (!closureOk) fs.integrity_findings.push('CLOSURE_REPORT_FIRST_SCREEN_MISSING_OR_EDITED');
  }
  return { ok: mayClose && closureOk !== false, ...fs, closure_first_screen_verbatim: closureOk };
}

// ---------------------------------------------------------------------------------------------------------------
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  const [cmd, a, b] = args;
  const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
  try {
    let out;
    if (cmd === 'order') out = { round: `R${roundNum(a)}`, run_order: runOrder(a, args.slice(2)) };
    else if (cmd === 'freeze') out = freeze(a, b);
    else if (cmd === 'seal-arms') out = sealArms(a, b);
    else if (cmd === 'status') out = status(a, b);
    else if (cmd === 'check') out = check(a, b, { closure: val('--closure') });
    else if (cmd === 'tree-hash') out = { ok: true, ...treeHash(a) };
    else { console.error('usage: round.mjs order|freeze|seal-arms|status|check|tree-hash ...'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2)); process.exit(out.ok === false ? 1 : 0);
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
