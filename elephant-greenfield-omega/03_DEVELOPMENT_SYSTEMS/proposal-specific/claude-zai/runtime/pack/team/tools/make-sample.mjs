// Generates the SYNTHETIC, deterministic fixtures used to test the Cockpit (K1–K8) and its TypeScript ports.
// Nothing here was produced by real arms. Every ledger body carries synthetic:true.
//
//   node team/tools/make-sample.mjs [<outDir>]        # default: team/fixtures (maintainers only — the pack copy is READ-ONLY;
//                                                    #   controllers write to e.g. ./omega-lab/fixtures instead)
// Writes, under <outDir>:
//   sample-round/          K1: 18 events, chain OK, 1 flagged claim (R0-B2), 3 selections reproduced
//   sample-round-k2/       K2: one byte of one ledger body changed            -> chain breaks at seq 9
//   sample-round-k3/       K3: an evidence file behind a LIVE_RUN claim gone  -> 2 flagged claims
//   sample-round-k4/       K4: one score changed in evaluation.json           -> 1 selection NOT reproduced
//   vectors/canon.vectors.json   canonical-JSON + sha256 cases (the TS `canon` must match byte for byte)
//   vectors/chain.vectors.json   ledgers (as JSONL text) with the exact verdict {ok, seq, reason, head|head_before_break}
//   vectors/select.vectors.json  evaluation + margin + basis -> decisions (the TS `select` must match exactly)
//   EXPECTED.json                what each fixture must produce, for automated Cockpit tests
import { mkdirSync, writeFileSync, rmSync, readFileSync, cpSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Journal } from './lib/journal.mjs';
import { canon, sha256 } from './lib/util.mjs';
import { select } from './select.mjs';
import { verify, verifyEvents } from './ledger.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(process.argv[2] ?? join(here, '..', 'fixtures'));
const OUT = join(ROOT, 'sample-round');
for (const d of ['sample-round', 'sample-round-k2', 'sample-round-k3', 'sample-round-k4', 'vectors']) rmSync(join(ROOT, d), { recursive: true, force: true });
const w = (base, rel, text) => { const p = join(base, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, typeof text === 'string' ? text : `${JSON.stringify(text, null, 2)}\n`); };

// ------------------------------------------------------------------ K1 sample round
let t = Date.parse('2026-10-11T08:00:00Z');
mkdirSync(join(OUT, 'ledger'), { recursive: true });
const j = new Journal(join(OUT, 'ledger', 'ledger.jsonl'), { now: () => new Date(t += 60_000).toISOString() });
const ev = (type, body) => j.append(type, { round: 'R0', synthetic: true, ...body });

ev('ROUND_OPENED', { claim: 'SIMULATED', note: 'SAMPLE round for Cockpit tests' });
ev('CENSUS_RECORDED', { claim: 'SIMULATED', isolation: 'SIMULATED', evidence: [] });
ev('GATE', { gate: 'MANIFEST_FROZEN', status: 'PASSED' });
const arms = [
  { id: 'R0-A1', track: 'A', variant: 'declarative-validation', wall: 21, loc: 180 }, { id: 'R0-A2', track: 'A', variant: 'imperative-guards', wall: 27, loc: 240 },
  { id: 'R0-B1', track: 'B', variant: 'plan-review consults', wall: 31, loc: 205 }, { id: 'R0-B2', track: 'B', variant: 'diff-review consults', wall: 33, loc: 210 },
];
for (const a of arms) ev('ARM_STARTED', { arm: a.id, track: a.track });
for (const a of arms) ev('ARM_FINISHED', { arm: a.id, track: a.track, claim: 'LIVE_RUN', evidence: [`evidence/R0/${a.id}/out/test.txt`] });
ev('ISOLATION_CHECKED', { clean: true, strength: 'SIMULATED' });

const results = [
  { track: 'A', arm: 'R0-A1', component: 'C1', score: 90, score_mechanical: 68 }, { track: 'A', arm: 'R0-A2', component: 'C1', score: 70, score_mechanical: 66 },
  { track: 'A', arm: 'R0-A1', component: 'C3', score: 80, score_mechanical: 60 },
  { track: 'B', arm: 'R0-B1', component: 'C1', score: 75, score_mechanical: 61 }, { track: 'B', arm: 'R0-B2', component: 'C1', score: 73, score_mechanical: 50 },
].map(r => ({ ...r, tests_passed: true, isolation_ok: true, evidence: [`evidence/R0/${r.arm}/evals/${r.component}.json`] }));
const evaluation = { round: 'R0', results };
const selection = { ...select(evaluation, { margin: 5, basis: 'total' }), margin_source: 'manifest' };
ev('EVAL_RECORDED', { claim: 'SIMULATED', results: results.length });
ev('SELECTION_RECORDED', { decisions: selection.decisions.map(d => `${d.track}${d.component}:${d.status}`) });
ev('ASSIMILATED', { track: 'A', tag: 'track-a-R0' });
ev('ASSIMILATED', { track: 'B', tag: 'track-b-R0' });
ev('LEARNING_RECORDED', { id: 'L-A-001', track: 'A' });
ev('ROUND_CLOSED', { status: 'CLOSED', independence: 'DEGRADED' });
j.close();

w(OUT, 'rounds/R0/round-manifest.json', {
  round: 'R0', seed: 'seed', controller: 'controller', isolation_strength: 'SIMULATED', margin: 5, selection_basis: 'total', frozen_at_ledger_seq: 1,
  oracle: { mode: 'CONTROLLER_AUTHORED', note: 'synthetic sample' },
  components: [{ id: 'C1', title: 'Command core + contract', acceptance: ['node --test tests/c1.test.mjs => all pass'], hidden_oracle: true },
               { id: 'C3', title: 'Event stream, journal, replay', acceptance: ['node --test tests/c3.test.mjs => all pass'], hidden_oracle: true }],
  arms: arms.map(a => ({ id: a.id, track: a.track, dir: `arms/${a.id}`, variant: a.variant, components: a.id === 'R0-A1' ? ['C1', 'C3'] : ['C1'], inherits_from: null })),
});
w(OUT, 'rounds/R0/CENSUS.json', { round: 'R0', synthetic: true, items: [{ capability: 'parallel_subagents', status: 'unsupported', evidence: 'census/parallel.txt', note: '' }, { capability: 'sqlite', status: 'verified', evidence: 'census/sqlite.txt', note: '' }] });
w(OUT, 'rounds/R0/evaluation.json', evaluation);
w(OUT, 'rounds/R0/selection.json', selection);

for (const a of arms) {
  w(OUT, `evidence/R0/${a.id}/out/test.txt`, `SYNTHETIC raw output for ${a.id}\n# pass 11\n# fail 0\n`);
  for (const c of ['C1', 'C3']) w(OUT, `evidence/R0/${a.id}/evals/${c}.json`, { synthetic: true, component: c, arm: a.id });
  // Evidence paths are ARM-RELATIVE (v0.2 convention); the Cockpit resolves them under evidence/R<n>/<arm>/ first.
  const claims = [{ component: 'C1', statement: 'C1 acceptance suite ran with 11 passing tests', level: 'LIVE_RUN', evidence: ['out/test.txt'] }];
  // The one deliberately bad claim in the sample: LIVE_RUN pointing at a file that does not exist.
  if (a.id === 'R0-B2') claims.push({ component: 'C1', statement: 'Consults reduced rework by 40%', level: 'LIVE_RUN', evidence: ['out/consult-metrics.txt'] });
  w(OUT, `evidence/R0/${a.id}/ARM_RESULT.json`, {
    round: 'R0', arm: a.id, track: a.track, components_attempted: a.id === 'R0-A1' ? ['C1', 'C3'] : ['C1'],
    commands_run: [{ cmd: 'node --test tests', exit_code: 0, output_file: 'out/test.txt' }],
    files_changed: ['product/src/c1/plan.mjs'], claims, limitations: ['synthetic sample'], learnings: ['sample learning'],
    cost: { wall_minutes: a.wall, tokens: 'unknown' },
    ...(a.track === 'B' ? { ecp_usage: { consults: 4, fallbacks: 0, stale_warnings: 0, findings_acted_on: 2, false_positives: 1, adapter: 'SCRIPTED' } } : {}),
  });
}
w(OUT, 'track-a/learnings.jsonl', `${JSON.stringify({ id: 'L-A-001', track: 'A', round: 'R0', statement: 'Declarative validation tables made the C1 error-precedence rule directly testable.', kind: 'technique', evidence: ['evidence/R0/R0-A1/evals/C1.json'], applies_to: ['C1'], status: 'ACTIVE', revisit_if: 'an imperative variant passes the same oracle with fewer lines' })}\n`);
w(OUT, 'track-b/learnings.jsonl', '');
w(OUT, 'SAMPLE-README.md', '# SAMPLE round (synthetic)\n\nGenerated by `team/tools/make-sample.mjs`. Contains **no real arm output**. Used only for Cockpit tests K1–K8.\n\nExpected ingest: 18 ledger events, chain OK, 1 flagged claim (R0-B2 LIVE_RUN with a missing evidence file), 3 selections reproduced (A·C1 SELECTED, A·C3 SINGLE_ENTRANT, B·C1 TIE_CARRY_BOTH). Negative variants and their expected outcomes: `../EXPECTED.json`.\n');

// ------------------------------------------------------------------ K2–K4 negative variants (copies; K1 stays pristine)
const variant = name => { const d = join(ROOT, name); cpSync(OUT, d, { recursive: true }); return d; };
const k2 = variant('sample-round-k2');
{ // flip one character inside the body of seq 9 (an ARM_FINISHED) without touching its stored hash
  const p = join(k2, 'ledger', 'ledger.jsonl');
  const lines = readFileSync(p, 'utf8').split('\n');
  lines[8] = lines[8].replace('"arm":"R0-A2"', '"arm":"R0-A3"');
  writeFileSync(p, lines.join('\n'));
}
const k3 = variant('sample-round-k3');
unlinkSync(join(k3, 'evidence', 'R0', 'R0-A1', 'out', 'test.txt'));
const k4 = variant('sample-round-k4');
{
  const p = join(k4, 'rounds', 'R0', 'evaluation.json'); const e = JSON.parse(readFileSync(p, 'utf8'));
  e.results.find(r => r.arm === 'R0-B1').score = 85; // B·C1 would now be SELECTED (85 vs 73), but selection.json says TIE
  writeFileSync(p, `${JSON.stringify(e, null, 2)}\n`);
}
const v1 = verify(join(OUT, 'ledger')); const v2 = verify(join(k2, 'ledger'));
const EXPECTED = {
  'sample-round': { K: 'K1', events: 18, chain: { ok: true, head: v1.head }, flagged_claims: [{ arm: 'R0-B2', evidence: 'out/consult-metrics.txt' }], selections: { reproduced: 3, mismatched: 0 } },
  'sample-round-k2': { K: 'K2', events: 18, chain: { ok: false, seq: v2.seq, reason: v2.reason, head_before_break: v2.head_before_break } },
  'sample-round-k3': { K: 'K3', events: 18, chain: { ok: true, head: v1.head }, flagged_claims: [{ arm: 'R0-A1', evidence: 'out/test.txt' }, { arm: 'R0-B2', evidence: 'out/consult-metrics.txt' }] },
  'sample-round-k4': { K: 'K4', events: 18, chain: { ok: true, head: v1.head }, selections: { reproduced: 2, mismatched: 1, mismatched_groups: ['B·C1'] } },
  evidence_path_resolution: 'claims[].evidence and commands_run[].output_file are resolved against evidence/R<n>/<arm>/ first, then the workspace root',
};
w(ROOT, 'EXPECTED.json', EXPECTED);

// ------------------------------------------------------------------ conformance vectors for the TypeScript ports
const canonCases = [
  null, true, 0, -0, 1.5, 1e21, 'plain', 'ünïcødé ✓ 😀', 'quote " backslash \\ newline \n tab \t', '  ', [], {},
  { b: 1, a: 2 }, { z: { y: [3, { d: 1, c: null }] }, a: [] }, { undef: undefined, keep: 1 }, { 'é': 1, 'e': 2, 'E': 3, '10': 4, '9': 5 },
];
w(ROOT, 'vectors/canon.vectors.json', {
  note: 'canon(): keys sorted by UTF-16 code unit order (JS default sort) at every depth; undefined object members dropped; primitives via JSON.stringify. Inputs are JSON-parsed data, so Dates/undefined array elements never reach canon (the journal normalises bodies through JSON before hashing). sha256 is over the UTF-8 bytes of canon.',
  cases: canonCases.map(input => ({ input_js: input === undefined ? 'undefined' : JSON.stringify(input, (k, v) => (v === undefined ? '__undefined__' : v)), canon: canon(input), sha256: sha256(canon(input)) })),
});
const okLedger = readFileSync(join(OUT, 'ledger', 'ledger.jsonl'), 'utf8');
const L = okLedger.split('\n').filter(Boolean);
const chainCases = [
  ['intact sample', L],
  ['body changed at seq 9', L.map((l, i) => (i === 8 ? l.replace('"arm":"R0-A2"', '"arm":"R0-A3"') : l))],
  ['line 5 deleted (sequence gap)', L.filter((_, i) => i !== 4)],
  ['lines 3 and 4 swapped', [...L.slice(0, 2), L[3], L[2], ...L.slice(4)]],
  ['prev of seq 12 rewritten', L.map((l, i) => (i === 11 ? l.replace(/"prev":"[0-9a-f]{64}"/, `"prev":"${'f'.repeat(64)}"`) : l))],
  ['empty ledger', []],
];
w(ROOT, 'vectors/chain.vectors.json', {
  note: 'Each case is a list of JSONL lines. The Cockpit verifier must return exactly {ok, seq?, reason?} and the same head (ok) or head_before_break (fail). GENESIS prev = 64 zeros. hash = sha256(canon({seq,ts,type,prev,body})).',
  cases: chainCases.map(([name, lines]) => ({ name, lines, expected: verifyEvents(lines.map(l => JSON.parse(l))) })),
});
const R = (track, arm, component, score, over = {}) => ({ track, arm, component, score, score_mechanical: Math.max(0, score - 20), tests_passed: true, isolation_ok: true, evidence: ['e.json'], ...over });
const selCases = [
  ['clear winner', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 90), R('A', 'R1-A2', 'C1', 70)] }, 5, 'total'],
  ['tie within margin', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 80), R('A', 'R1-A2', 'C1', 78)] }, 5, 'total'],
  ['boundary inclusive', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 85), R('A', 'R1-A2', 'C1', 80)] }, 5, 'total'],
  ['equal scores: arm id breaks order, still a tie', { round: 'R1', results: [R('B', 'R1-B2', 'C1', 77), R('B', 'R1-B1', 'C1', 77)] }, 5, 'total'],
  ['disqualifications', { round: 'R1', results: [R('B', 'R1-B1', 'C1', 60), R('B', 'R1-B2', 'C1', 99, { isolation_ok: false }), R('B', 'R1-B1', 'C2', 50, { tests_passed: false }), R('B', 'R1-B2', 'C2', 55, { evidence: [] })] }, 5, 'total'],
  ['three entrants, carry only those within margin', { round: 'R2', results: [R('A', 'R2-A1', 'C2', 90), R('A', 'R2-A2', 'C2', 86), R('A', 'R2-A3', 'C2', 84)] }, 5, 'total'],
  ['mechanical basis flips the outcome', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 90, { score_mechanical: 60 }), R('A', 'R1-A2', 'C1', 80, { score_mechanical: 70 })] }, 5, 'mechanical'],
  ['never across tracks', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 90), R('B', 'R1-B1', 'C1', 50)] }, 5, 'total'],
  ['margin zero', { round: 'R1', results: [R('A', 'R1-A1', 'C1', 80), R('A', 'R1-A2', 'C1', 80)] }, 0, 'total'],
];
w(ROOT, 'vectors/select.vectors.json', {
  note: 'select(evaluation, {margin, basis}) — compare `decisions` and `input_sha256` exactly. Sorting uses code-unit comparison, NOT localeCompare.',
  cases: selCases.map(([name, evaluation, margin, basis]) => ({ name, evaluation, margin, basis, expected: select(evaluation, { margin, basis }) })),
  must_throw: [
    { name: 'NaN margin', evaluation: { round: 'R1', results: [] }, margin: null, basis: 'total' },
    { name: 'duplicate arm/component', evaluation: { round: 'R1', results: [R('A', 'R1-A1', 'C1', 90), R('A', 'R1-A1', 'C1', 40)] }, margin: 5, basis: 'total' },
    { name: 'arm under wrong track', evaluation: { round: 'R1', results: [R('A', 'R1-B1', 'C1', 90)] }, margin: 5, basis: 'total' },
    { name: 'arm from another round', evaluation: { round: 'R1', results: [R('A', 'R0-A1', 'C1', 90)] }, margin: 5, basis: 'total' },
  ],
});
console.log('fixtures written to', ROOT);
