// PUBLIC acceptance suite for C3 (team/contracts/C3_EVENT_JOURNAL.md).
//   PFM_PRODUCT=<arm>/product node --test team/acceptance/C3.acceptance.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, appendFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadProduct } from './_load.mjs';

const { EVENT_TYPES, JournalError, openJournal, replay } = await loadProduct('src/c3/journal.mjs');
const dir = () => mkdtempSync(join(tmpdir(), 'c3-acc-'));
const code = (fn, expected) => assert.throws(fn, e => e instanceof JournalError && e.code === expected, `expected JournalError ${expected}`);
const E = (type, command_id = 'c1', target = 'alpha') => ({ type, command_id, target });

test('C3-A01 exports and event types', () => {
  assert.deepEqual([...EVENT_TYPES], ['submitted', 'accepted', 'rejected', 'cancelled', 'timed_out']);
  assert.ok(Object.isFrozen(EVENT_TYPES)); assert.equal(typeof openJournal, 'function'); assert.equal(typeof replay, 'function');
});

test('C3-A02 append assigns seq from 1 and returns the record', () => {
  const d = dir(); const j = openJournal(join(d, 'j.jsonl'));
  try {
    assert.deepEqual({ ...j.append(E('submitted')) }, { seq: 1, type: 'submitted', command_id: 'c1', target: 'alpha' });
    assert.equal(j.append(E('accepted')).seq, 2); assert.equal(j.lastSeq, 2);
  } finally { j.close(); rmSync(d, { recursive: true, force: true }); }
});

test('C3-A03 on-disk line format is exact', () => {
  const d = dir(); const p = join(d, 'j.jsonl'); const j = openJournal(p);
  try { j.append(E('submitted', 'c9', 'beta')); } finally { j.close(); }
  assert.equal(readFileSync(p, 'utf8'), '{"seq":1,"type":"submitted","command_id":"c9","target":"beta"}\n');
  rmSync(d, { recursive: true, force: true });
});

test('C3-A04 replay reproduces per-key state', () => {
  const d = dir(); const p = join(d, 'j.jsonl'); const j = openJournal(p);
  j.append(E('submitted', 'c1', 'alpha')); j.append(E('submitted', 'c1', 'beta')); j.append(E('accepted', 'c1', 'alpha')); j.close();
  assert.deepEqual(replay(p), { last_seq: 3, torn: false, entries: { 'c1:alpha': { status: 'accepted', seq: 3 }, 'c1:beta': { status: 'pending', seq: 2 } } });
  rmSync(d, { recursive: true, force: true });
});

test('C3-A05 restart: reopening continues the sequence', () => {
  const d = dir(); const p = join(d, 'j.jsonl');
  let j = openJournal(p); j.append(E('submitted')); j.close();
  j = openJournal(p); assert.equal(j.lastSeq, 1); assert.equal(j.append(E('timed_out')).seq, 2); j.close();
  assert.equal(replay(p).entries['c1:alpha'].status, 'timed_out');
  rmSync(d, { recursive: true, force: true });
});

test('C3-A06 an event for an unknown key that is not "submitted" is illegal and writes nothing', () => {
  const d = dir(); const p = join(d, 'j.jsonl'); const j = openJournal(p);
  try { code(() => j.append(E('accepted')), 'ILLEGAL_TRANSITION'); } finally { j.close(); }
  assert.equal(readFileSync(p, 'utf8'), '');
  rmSync(d, { recursive: true, force: true });
});

test('C3-A07 terminal states are absorbing', () => {
  const d = dir(); const j = openJournal(join(d, 'j.jsonl'));
  try { j.append(E('submitted')); j.append(E('accepted')); code(() => j.append(E('cancelled')), 'ILLEGAL_TRANSITION'); } finally { j.close(); rmSync(d, { recursive: true, force: true }); }
});

test('C3-A08 reordered lines are detected on replay', () => {
  const d = dir(); const p = join(d, 'j.jsonl'); const j = openJournal(p);
  j.append(E('submitted')); j.append(E('submitted', 'c2')); j.close();
  const [a, b] = readFileSync(p, 'utf8').trim().split('\n'); writeFileSync(p, `${b}\n${a}\n`);
  code(() => replay(p), 'CORRUPT');
  rmSync(d, { recursive: true, force: true });
});

test('C3-A09 a torn tail is reported and ignored by replay', () => {
  const d = dir(); const p = join(d, 'j.jsonl'); const j = openJournal(p);
  j.append(E('submitted')); j.close(); appendFileSync(p, '{"seq":2,"type":"acc');
  assert.deepEqual(replay(p), { last_seq: 1, torn: true, entries: { 'c1:alpha': { status: 'pending', seq: 1 } } });
  rmSync(d, { recursive: true, force: true });
});

test('C3-A10 replay of a missing file is the empty state', () => {
  assert.deepEqual(replay(join(tmpdir(), `nope-${process.pid}-${Date.now()}.jsonl`)), { last_seq: 0, torn: false, entries: {} });
});

test('C3-A11 invalid event types are rejected', () => {
  const d = dir(); const j = openJournal(join(d, 'j.jsonl'));
  try { code(() => j.append(E('exploded')), 'INVALID_EVENT'); } finally { j.close(); rmSync(d, { recursive: true, force: true }); }
});

test('C3-A12 append after close throws CLOSED', () => {
  const d = dir(); const j = openJournal(join(d, 'j.jsonl')); j.close();
  code(() => j.append(E('submitted')), 'CLOSED');
  rmSync(d, { recursive: true, force: true });
});
