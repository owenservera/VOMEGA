// PUBLIC acceptance suite for C1 (team/contracts/C1_COMMAND_CORE.md). Arms run it; the evaluator runs THIS file
// (hash committed at MANIFEST_FROZEN), never an arm's copy.
//   PFM_PRODUCT=<arm>/product node --test team/acceptance/C1.acceptance.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadProduct } from './_load.mjs';
import { validate } from '../tools/validate.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const { plan, PlanError, DEFAULT_TARGETS } = await loadProduct('src/c1/plan.mjs');
const schema = JSON.parse(readFileSync(join(here, '..', 'contracts', 'C1.plan.schema.json'), 'utf8'));
const canon = v => (v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? `[${v.map(canon).join(',')}]` : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`);
const ok = (over = {}) => ({ command_id: 'cmd-1', prompt: 'Summarise the meeting notes', target_ids: ['alpha', 'gamma'], ...over });
const code = (fn, expected) => assert.throws(fn, e => e instanceof PlanError && e instanceof Error && e.code === expected, `expected PlanError ${expected}`);

test('C1-A01 exports: plan(), PlanError, DEFAULT_TARGETS = alpha,beta,gamma (frozen)', () => {
  assert.equal(typeof plan, 'function'); assert.equal(typeof PlanError, 'function');
  assert.deepEqual([...DEFAULT_TARGETS], ['alpha', 'beta', 'gamma']); assert.ok(Object.isFrozen(DEFAULT_TARGETS));
});

test('C1-A02 a valid input returns a plan that validates against C1.plan.schema.json', () => {
  assert.deepEqual(validate(schema, plan(ok())), []);
});

test('C1-A03 targets follow registry order, not input order', () => {
  assert.deepEqual([...plan(ok({ target_ids: ['gamma', 'alpha'] })).targets], ['alpha', 'gamma']);
});

test('C1-A04 steps: seq 1..n, action submit, idempotency_key command_id:target', () => {
  const p = plan(ok({ target_ids: ['beta', 'alpha', 'gamma'] }));
  assert.deepEqual(p.steps.map(s => ({ ...s })), [
    { seq: 1, target: 'alpha', action: 'submit', idempotency_key: 'cmd-1:alpha' },
    { seq: 2, target: 'beta', action: 'submit', idempotency_key: 'cmd-1:beta' },
    { seq: 3, target: 'gamma', action: 'submit', idempotency_key: 'cmd-1:gamma' },
  ]);
});

test('C1-A05 dry_run: absent -> false/submit; true -> preview', () => {
  assert.equal(plan(ok()).dry_run, false);
  const p = plan(ok({ dry_run: true }));
  assert.equal(p.dry_run, true); assert.ok(p.steps.every(s => s.action === 'preview'));
});

test('C1-A06 fingerprint = sha256(canon({schema, command_id, prompt, dry_run, targets}))', () => {
  const p = plan(ok());
  const want = createHash('sha256').update(canon({ schema: p.schema, command_id: p.command_id, prompt: p.prompt, dry_run: p.dry_run, targets: [...p.targets] })).digest('hex');
  assert.equal(p.fingerprint, want);
});

test('C1-A07 determinism: equal inputs give byte-identical JSON; input target order is irrelevant', () => {
  assert.equal(JSON.stringify(plan(ok())), JSON.stringify(plan(ok())));
  assert.equal(JSON.stringify(plan(ok({ target_ids: ['alpha', 'gamma'] }))), JSON.stringify(plan(ok({ target_ids: ['gamma', 'alpha'] }))));
  assert.deepEqual(Object.keys(plan(ok())), ['schema', 'command_id', 'prompt', 'dry_run', 'targets', 'steps', 'fingerprint']);
});

test('C1-A08 blank prompts are rejected', () => {
  code(() => plan(ok({ prompt: '' })), 'BLANK_PROMPT');
  code(() => plan(ok({ prompt: '   \t\n ' })), 'BLANK_PROMPT');
});

test('C1-A09 unknown target is rejected', () => code(() => plan(ok({ target_ids: ['alpha', 'delta'] })), 'UNKNOWN_TARGET'));
test('C1-A10 empty target list is rejected', () => code(() => plan(ok({ target_ids: [] })), 'NO_TARGETS'));

test('C1-A11 invalid command ids are rejected', () => {
  code(() => plan(ok({ command_id: '' })), 'INVALID_COMMAND_ID');
  code(() => plan(ok({ command_id: 'has space' })), 'INVALID_COMMAND_ID');
});

test('C1-A12 prompt is trimmed at the edges; inner whitespace is preserved', () => {
  assert.equal(plan(ok({ prompt: '  hello   world \n' })).prompt, 'hello   world');
});

test('C1-A13 input is not mutated', () => {
  const input = ok({ target_ids: ['gamma', 'alpha'] }); const before = JSON.stringify(input);
  plan(input);
  assert.equal(JSON.stringify(input), before);
});

test('C1-A14 non-object input and unknown fields are rejected', () => {
  code(() => plan(null), 'INVALID_INPUT');
  code(() => plan(['alpha']), 'INVALID_INPUT');
  code(() => plan(ok({ priority: 'high' })), 'UNKNOWN_FIELD');
});

test('C1-A15 the plan is frozen', () => {
  const p = plan(ok());
  assert.ok(Object.isFrozen(p) && Object.isFrozen(p.steps) && Object.isFrozen(p.targets));
});

test('C1-A16 custom registry replaces the default and sets the order', () => {
  assert.deepEqual([...plan(ok({ target_ids: ['x', 'y'] }), { registry: ['y', 'x'] }).targets], ['y', 'x']);
  code(() => plan(ok(), { registry: ['y', 'x'] }), 'UNKNOWN_TARGET');
});
