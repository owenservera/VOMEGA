// Round ledger: the team's dogfood use of the ECP v0.2 journal (hash chain, fsync, single-writer lock).
//
//   node team/tools/ledger.mjs init   <ledgerDir>
//   node team/tools/ledger.mjs emit   <ledgerDir> <TYPE> '<json object body>'
//   node team/tools/ledger.mjs verify <ledgerDir|ledger.jsonl>      # READ-ONLY. JSON verdict on stdout; exit 0 iff ok
//   node team/tools/ledger.mjs show   <ledgerDir> [TYPE]            # READ-ONLY
//
// v0.2 changes (see team/CHANGELOG.md):
//  * verify/show never open the writable Journal. In v0.1 `verify` took the lock, truncated a torn tail and APPENDED
//    STALE_LOCK_BROKEN / TORN_TAIL_DISCARDED events — i.e. checking a ledger changed it. Now they parse the file
//    read-only and REPORT a torn tail or a stale lock instead of repairing it. Only `emit` repairs (and journals it).
//  * verify prints a JSON verdict on failure too: {ok:false, seq, reason, count, head_before_break}. The Cockpit's
//    TypeScript verifier must produce the same {ok, seq, reason} and the same head (Cockpit K2/K7, drill D2).
//  * The journal/util code is vendored in team/tools/lib/ (byte-identical to outputs/claude/kernel/, drift-tested),
//    so the tools work after being copied into consolidated/ on their own.
//
// Claim level: SIMULATED_TEST (team/tools/*.test.mjs). Nothing here proves that an agent actually ran.
import { mkdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Journal } from './lib/journal.mjs';
import { scanSecrets, sha256, canon } from './lib/util.mjs';

export const GENESIS = '0'.repeat(64);
export const LEDGER_TYPES = [
  'ROUND_OPENED', 'CENSUS_RECORDED', 'GATE', 'ARM_STARTED', 'ARM_FINISHED', 'ISOLATION_CHECKED',
  'EVAL_RECORDED', 'SELECTION_RECORDED', 'ASSIMILATED', 'CONSOLIDATED', 'LEARNING_RECORDED',
  'INCIDENT', 'ROUND_CLOSED', 'HUMAN_DECISION',
  // v0.2
  'PHASE',            // a role boundary in a single-agent run: {role, track?, will_not_read[], reset_statement}
  'ORACLE_UNSEALED',  // {component, sealed_sha256, key_fingerprint} — must follow GATE ARMS_SEALED
];
// Events the journal itself writes when `emit` repairs a crash remnant. Valid in a ledger, never emitted by hand.
export const JOURNAL_TYPES = ['STALE_LOCK_BROKEN', 'TORN_TAIL_DISCARDED'];
export const CLAIMS = ['DESIGN', 'SIMULATED', 'LIVE_RUN', 'MEASURED', 'SPECULATION'];

const ledgerPath = p => (p.endsWith('.jsonl') ? p : join(p, 'ledger.jsonl'));

export function openLedger(dir) {
  mkdirSync(dir, { recursive: true });
  return new Journal(join(dir, 'ledger.jsonl'));
}

export function emit(dir, type, body) {
  if (!LEDGER_TYPES.includes(type)) throw new Error(`unknown ledger type: ${type}`);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('body must be a JSON object');
  if (typeof body.round !== 'string' || !/^R\d+$/.test(body.round)) throw new Error('body.round must look like R0, R1, ...');
  if (body.claim !== undefined && !CLAIMS.includes(body.claim)) throw new Error(`claim must be one of ${CLAIMS.join(',')}`);
  if (['LIVE_RUN', 'MEASURED'].includes(body.claim) && !(Array.isArray(body.evidence) && body.evidence.length)) {
    throw new Error(`${body.claim} claims require evidence[] (file paths)`);
  }
  const secrets = scanSecrets(JSON.stringify(body));
  if (secrets.length) throw new Error(`secret pattern in ledger body: ${secrets.join(',')}`);
  const j = openLedger(dir);
  try { return j.append(type, body); } finally { j.close(); }
}

/**
 * Read-only parse. Never writes, never locks, never truncates.
 * Returns {events, torn, lock, parseError}. A torn tail (bytes after the last newline) is reported, not removed.
 */
export function readLedger(p) {
  const path = ledgerPath(p);
  if (!existsSync(path)) return { events: [], torn: null, lock: null, missing: true };
  const buf = readFileSync(path);
  const lastNl = buf.lastIndexOf(0x0a);
  const torn = lastNl === buf.length - 1 ? null : { bytes: buf.length - lastNl - 1, sha256: sha256(buf.subarray(lastNl + 1)) };
  const events = []; let parseError = null;
  const lines = buf.subarray(0, lastNl + 1).toString('utf8').split('\n');
  for (const [i, line] of lines.entries()) {
    if (!line) continue;
    try { events.push(JSON.parse(line)); } catch { parseError = { line: i + 1 }; break; }
  }
  const lockPath = `${path}.lock`;
  let lock = null;
  if (existsSync(lockPath)) { try { lock = { ...JSON.parse(readFileSync(lockPath, 'utf8')), mtime: statSync(lockPath).mtime.toISOString() }; } catch { lock = { unreadable: true }; } }
  return { events, torn, lock, parseError };
}

/** Pure chain check over parsed events. Same algorithm as Journal.verify, plus head_before_break on failure. */
export function verifyEvents(events) {
  let prev = GENESIS;
  for (const [i, ev] of events.entries()) {
    const fail = reason => ({ ok: false, seq: ev?.seq ?? i + 1, reason, count: events.length, head_before_break: prev });
    if (!ev || typeof ev !== 'object') return fail('not an object');
    if (ev.seq !== i + 1) return fail('sequence gap');
    if (ev.prev !== prev) return fail('broken chain');
    const h = sha256(canon({ seq: ev.seq, ts: ev.ts, type: ev.type, prev: ev.prev, body: ev.body }));
    if (h !== ev.hash) return fail('hash mismatch');
    prev = ev.hash;
  }
  return { ok: true, head: prev, count: events.length };
}

export function verify(p) {
  const r = readLedger(p);
  if (r.missing) return { ok: false, reason: 'no ledger', count: 0 };
  if (r.parseError) return { ok: false, seq: r.events.length + 1, reason: `unparseable line ${r.parseError.line}`, count: r.events.length, head_before_break: r.events.at(-1)?.hash ?? GENESIS };
  const v = verifyEvents(r.events);
  const notes = {};
  if (r.torn) notes.torn_tail = r.torn;               // uncommitted partial write; `emit` will discard + journal it
  if (r.lock) notes.lock_present = r.lock;            // a writer is active, or crashed; `emit` decides which
  return Object.keys(notes).length ? { ...v, ...notes } : v;
}

export function show(p, type) {
  const r = readLedger(p);
  return r.events.filter(e => !type || e.type === type);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [cmd, dir, a, b] = process.argv.slice(2);
  try {
    if (cmd === 'init') { openLedger(dir).close(); console.log(`ledger ready: ${join(dir, 'ledger.jsonl')}`); }
    else if (cmd === 'emit') { const ev = emit(dir, a, JSON.parse(b)); console.log(JSON.stringify({ seq: ev.seq, type: ev.type, hash: ev.hash })); }
    else if (cmd === 'verify') { const v = verify(dir); console.log(JSON.stringify(v)); process.exit(v.ok ? 0 : 1); }
    else if (cmd === 'show') { for (const e of show(dir, a)) console.log(`#${e.seq} ${e.ts} ${e.type} ${JSON.stringify(e.body)}`); }
    else { console.error('usage: ledger.mjs init|emit|verify|show <dir> ...'); process.exit(2); }
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
