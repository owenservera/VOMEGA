// EXPERIMENT 1 (Run A primary falsifier) — BOUNDED, ISOLATED EXECUTION
//
// Challenge the precondition that repeat()'s doc comment ASSERTS but does not ENFORCE.
// The comment says: "Declared expectation: count is a nonnegative safe integer. Not enforced."
//
// TWO CORRECTIONS are recorded here rather than hidden, because both produced a
// wrong result first time and both are the same mistake the fixture is testing —
// mistaking a probe's own limitation for a fact about the source:
//
//  v1 collected emissions into a JS array. At count=2^53 the COLLECTOR threw
//     "RangeError: Invalid array length" after ~67M emissions. That reads like a
//     failure of repeat(); it is a failure of the probe. FALSE ATTRIBUTION.
//  v2 swapped the array for an integer counter. The RangeError vanished and the
//     probe simply never finished. Different wrong conclusion in the other
//     direction — it now implied the fixture "runs forever" without ever being
//     allowed to demonstrate it.
//
// v3 runs every case in an isolated child process with a hard wall-clock bound,
// and reports DID_NOT_RETURN as a witnessed fact rather than inferring it.
//
// Evidence class: OBSERVED (real execution of the pinned fixture, compiled by tsc).
// Usage: node exp1-precondition.mjs
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const TS_PKG = 'C:/Users/VIVIM.inc/AppData/Local/npm-cache/_npx/da912b5ea09ad757/node_modules/typescript';
const TSC = `${TS_PKG}/lib/tsc.js`;
const TSC_VERSION = JSON.parse(readFileSync(`${TS_PKG}/package.json`, 'utf8')).version;

const src = readFileSync('baseline.ts', 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'runa-e1-'));
const tsPath = join(dir, 'baseline.ts');
const jsPath = join(dir, 'baseline.js');
writeFileSync(tsPath, src);
execFileSync(process.execPath, [TSC, tsPath, '--outDir', dir, '--module', 'commonjs', '--target', 'es2020', '--strict']);
// Sanity: the compiled module must exist before we trust any observation about it.
if (!readFileSync(jsPath, 'utf8').includes('function repeat')) throw new Error('compile did not produce expected JS');

// Each case runs in its own process with a hard bound, so a non-terminating
// repeat() is recorded as DID_NOT_RETURN instead of hanging the whole probe.
const WORKER = `
const {repeat} = require(${JSON.stringify(jsPath)});
// The count arrives via env, not argv: with \`node -e\`, a value like "-1" is
// parsed as an option and the probe dies before reaching the code under test.
const count = Number(process.env.COUNT);
let n = 0; const sample = [];
const t0 = process.hrtime.bigint();
try {
  repeat(count, (v) => { n += 1; if (sample.length < 5) sample.push(v); });
  console.log(JSON.stringify({
    outcome: 'RETURNED', emissions: n, sample,
    elapsedMs: Number((Number(process.hrtime.bigint() - t0) / 1e6).toFixed(2)),
  }));
} catch (e) {
  console.log(JSON.stringify({
    outcome: 'THREW', error: e.constructor.name + ': ' + e.message, emissions: n, sample,
    elapsedMs: Number((Number(process.hrtime.bigint() - t0) / 1e6).toFixed(2)),
  }));
}
`;

const CASES = [
  {label: 'count = 3 (happy path)', count: 3, legal: true},
  {label: 'count = 0', count: 0, legal: true},
  {label: 'count = -1 (NEGATIVE)', count: -1, legal: false},
  {label: 'count = -5 (NEGATIVE)', count: -5, legal: false},
  {label: 'count = 2.7 (FRACTIONAL)', count: 2.7, legal: false},
  {label: 'count = 0.4 (FRACTIONAL < 1)', count: 0.4, legal: false},
  {label: 'count = NaN', count: NaN, legal: false},
  {label: 'count = 1e7 (large, finite, legal)', count: 1e7, legal: true},
  {label: 'count = 1e9 (large, finite, legal)', count: 1e9, legal: true},
  {label: 'count = 2^53 (beyond MAX_SAFE_INTEGER)', count: Number.MAX_SAFE_INTEGER + 2, legal: false},
  {label: 'count = Infinity', count: Infinity, legal: false},
];

const BOUND_MS = 4000;
const results = [];
for (const c of CASES) {
  const t0 = process.hrtime.bigint();
  let out;
  try {
    out = execFileSync(process.execPath, ['-e', WORKER], {
      encoding: 'utf8', timeout: BOUND_MS, killSignal: 'SIGKILL',
      env: {...process.env, COUNT: String(c.count)},
    });
    const r = JSON.parse(out);
    results.push({
      label: c.label,
      satisfiesStatedPrecondition: c.legal,
      outcome: r.outcome,
      emissionsObserved: r.emissions,
      firstFiveEmitted: r.sample,
      detail: r.error || null,
      elapsedMs: r.elapsedMs,
      // The core question: when the contract is violated, does the code SAY so?
      violationIsSilent: c.legal ? null : r.outcome === 'RETURNED',
    });
  } catch (e) {
    const timedOut = e.killed || e.signal === 'SIGKILL';
    results.push({
      label: c.label,
      satisfiesStatedPrecondition: c.legal,
      outcome: timedOut ? 'DID_NOT_RETURN' : 'HARNESS_ERROR',
      emissionsObserved: null,
      firstFiveEmitted: [],
      detail: timedOut
        ? `no return within ${BOUND_MS}ms wall-clock bound (process killed)`
        : String(e.message).slice(0, 160),
      elapsedMs: Number((Number(process.hrtime.bigint() - t0) / 1e6).toFixed(2)),
      violationIsSilent: c.legal ? null : timedOut ? null : null,
    });
  }
}

console.log(JSON.stringify({
  experiment: 'EXP1 — repeat() stated precondition vs actual behavior',
  evidenceClass: 'OBSERVED',
  sourceSha256: createHash('sha256').update(src).digest('hex'),
  compiler: `typescript@${TSC_VERSION}`,
  executionModel: `each case in an isolated child process, ${BOUND_MS}ms hard bound, SIGKILL on overrun`,
  corrections: [
    'v1 array collector -> false RangeError attributed to repeat() (it was the probe)',
    'v2 integer counter -> RangeError vanished, probe never finished, implied non-termination without witnessing it',
    'v3 isolated bounded child processes -> non-termination is now a witnessed DID_NOT_RETURN',
  ],
  results,
}, null, 2));
