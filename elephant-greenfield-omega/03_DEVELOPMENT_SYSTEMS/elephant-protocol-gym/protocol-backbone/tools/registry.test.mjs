// Dependency-free tests for the lab registry validator.
//
// The theme of Round 0 was that instruments fail silently and produce clean-looking
// negative results. So these tests are mostly about DISCRIMINATION: a validator that has
// only ever returned green demonstrates nothing. Each test either asserts the real registry
// is consistent, or mutates one property in memory and asserts the validator notices.
//
// These tests NEVER write to disk. They pass a mutated registry/receipt straight into
// validateRegistry(), so concurrent tests cannot corrupt each other or the real registry.
//
// Run: node --test tools/registry.test.mjs   (from protocol-backbone/)
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateRegistry} from './registry.mjs';

const backbone = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gymRoot = resolve(backbone, '..');

const baseRegistry = () => JSON.parse(readFileSync(join(backbone, 'registry.json'), 'utf8'));
const baseReceipt = i => JSON.parse(readFileSync(join(gymRoot, baseRegistry().runs[i].receipt), 'utf8'));

const clone = o => JSON.parse(JSON.stringify(o));

// Mutate a copy of the registry and/or one run's receipt, entirely in memory.
function withMutations({mutateRegistry, mutateReceipt, receiptIndex = 0}, fn) {
  const reg = baseRegistry();
  if (mutateRegistry) mutateRegistry(reg);
  const overrides = {};
  if (mutateReceipt) overrides[reg.runs[receiptIndex].receipt] = mutateReceipt(baseReceipt(receiptIndex), reg);
  return fn(validateRegistry({registry: reg, receiptOverrides: overrides}));
}

test('the real lab registry agrees with disk', () => {
  const r = validateRegistry();
  assert.equal(r.ok, true, `registry should validate, got:\n${r.errors.join('\n')}`);
  assert.ok(r.checked.runs >= 6, `expected at least the six Round-0/1 runs, saw ${r.checked.runs}`);
  assert.equal(r.checked.receipts, r.checked.runs, 'every registered run needs a parsed receipt');
  assert.ok(r.checked.artifacts > 0, 'artifacts must actually be re-hashed');
});

test('P1 — an unmutated in-memory copy also passes (the control set needs a clean case)', () => {
  const r = validateRegistry({registry: baseRegistry()});
  assert.equal(r.errors.length, 0, r.errors.join('|'));
});

test('N1 — a missing run directory is detected', () => {
  withMutations({mutateRegistry: r => { r.runs[0].dir = 'runs/DOES-NOT-EXIST'; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('run directory not found')), `expected a directory error, got: ${v.errors.join('|')}`);
  });
});

test('N2 — registry/receipt status disagreement is detected', () => {
  withMutations({mutateRegistry: r => { r.runs[0].status = 'NOT_RUN'; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('status disagreement')), `expected a status error, got: ${v.errors.join('|')}`);
  });
});

test('N3 — an artifact hash that no longer matches its file is detected', () => {
  withMutations({mutateReceipt: rec => { rec.artifacts[0].sha256 = '0'.repeat(64); return rec; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('HASH CHANGED')), `expected a hash error, got: ${v.errors.join('|')}`);
  });
});

test('N4 — a measured claim stripped of witness_provenance is detected', () => {
  withMutations({mutateReceipt: rec => {
    const i = rec.claims.findIndex(c => c.evidence_class !== 'DESIGN');
    delete rec.claims[i].witness_provenance;
    return rec;
  }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('witness_provenance')), `expected a provenance error, got: ${v.errors.join('|')}`);
  });
});

test('N5 — an entry point that no longer exists is detected', () => {
  withMutations({mutateRegistry: r => { r.runs[0].entry_points = ['node no-such-script.mjs']; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('entry point missing')), `expected an entry-point error, got: ${v.errors.join('|')}`);
  });
});

test('N6 — a duplicated run id is detected (a fleet must not index one run twice)', () => {
  withMutations({mutateRegistry: r => { r.runs.push(clone(r.runs[0])); }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('duplicate run id')), `expected a duplicate error, got: ${v.errors.join('|')}`);
  });
});

test('N7 — a protocol card that no longer exists on disk is detected', () => {
  withMutations({mutateRegistry: r => { r.protocols[0].path = 'protocols/deleted-card.json'; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('missing protocol card')), `expected a missing-card error, got: ${v.errors.join('|')}`);
  });
});

test('N8 — an invalid status enum is rejected rather than silently accepted', () => {
  withMutations({mutateRegistry: r => { r.runs[0].status = 'DEFINITELY_DONE'; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('invalid status')), `expected an enum error, got: ${v.errors.join('|')}`);
  });
});

test('N9 — an artifact deleted from disk is detected', () => {
  withMutations({mutateReceipt: rec => { rec.artifacts[0].uri = 'runs/A-2026-10-12/definitely-not-here.json'; return rec; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('missing on disk')), `expected a missing-artifact error, got: ${v.errors.join('|')}`);
  });
});

test('the guard does not over-reach: DESIGN claims may omit witness_provenance', () => {
  // A design idea has no witness to declare. Requiring provenance everywhere would turn the
  // vocabulary into a box-ticking ritual that records nothing.
  withMutations({mutateReceipt: rec => {
    rec.claims.push({statement: 'a pure design proposal', evidence_class: 'DESIGN'});
    return rec;
  }}, v => {
    assert.ok(!v.errors.some(e => e.includes('witness_provenance')), `DESIGN claim should not require provenance, got: ${v.errors.join('|')}`);
  });
});

test('a stale registry schema version is rejected', () => {
  withMutations({mutateRegistry: r => { r.schema = 'epg.registry/0.1'; }}, v => {
    assert.equal(v.ok, false);
    assert.ok(v.errors.some(e => e.includes('schema mismatch')), `expected a schema error, got: ${v.errors.join('|')}`);
  });
});