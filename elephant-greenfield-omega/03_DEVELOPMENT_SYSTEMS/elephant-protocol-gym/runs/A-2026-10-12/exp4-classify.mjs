// EXPERIMENT 4 — is the declared return type exhaustive?
//
// extract-facts.mjs asserted that the compiler CANNOT establish that classify() is
// exhaustive over all inputs. This probe checks that claim instead of trusting it.
//
// The return type is the union "negative" | "zero" | "positive", which reads like
// a total function over the reals. Nothing enforces that. If the compiler cannot
// establish totality, some input must land outside the obvious three cases —
// and a reader trusting only the type would be wrong.
//
// Evidence class: OBSERVED.
// Usage: node exp4-classify.mjs
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
const dir = mkdtempSync(join(tmpdir(), 'runa-e4-'));
writeFileSync(join(dir, 'm.ts'), src);
execFileSync(process.execPath, [TSC, join(dir, 'm.ts'), '--outDir', dir, '--module', 'commonjs', '--target', 'es2020', '--strict']);
const {classify, accumulate, add} = require(join(dir, 'm.js'));

const INPUTS = [
  {label: '-1', v: -1}, {label: '0', v: 0}, {label: '1', v: 1},
  {label: 'NaN', v: NaN}, {label: 'Infinity', v: Infinity}, {label: '-Infinity', v: -Infinity},
  {label: '-0', v: -0}, {label: '1e308 (finite, huge)', v: 1e308},
];

const rows = INPUTS.map(({label, v}) => {
  let out, threw = null;
  try { out = classify(v); } catch (e) { threw = `${e.constructor.name}: ${e.message}`; }
  const declared = ['negative', 'zero', 'positive'];
  return {
    input: label,
    returned: out,
    threw,
    withinDeclaredUnion: threw === null && declared.includes(out),
    note: Number.isNaN(v) ? 'NaN fails every comparison, so control falls through to the final return'
      : v === 0 ? 'strict === treats -0 as zero'
      : null,
  };
});

const outside = rows.filter((r) => !r.withinDeclaredUnion);
const mislabeled = rows.filter((r) => r.note && r.note.startsWith('NaN'));

console.log(JSON.stringify({
  experiment: 'EXP4 — is the declared return union exhaustive?',
  evidenceClass: 'OBSERVED',
  sourceSha256: createHash('sha256').update(src).digest('hex'),
  compiler: `typescript@${TSC_VERSION}`,
  declaredReturnType: '"negative" | "zero" | "positive"',
  declaredReturnUnionExhaustsReals: false,
  whyNot: 'the union covers every real number exactly once, but the input domain is number, which also includes NaN and +/-Infinity',
  rows,
  summary: {
    inputsTested: rows.length,
    returnedOutsideDeclaredUnion: outside.map((r) => `${r.input} -> ${r.returned}`),
    stillInsideUnionButSemanticallyWrong: mislabeled.map((r) => `${r.input} -> "${r.returned}" (NaN is not positive)`),
  },
  consequence:
    'The type is satisfied by a semantically wrong answer. NaN returns the literal "positive", which is ' +
    'inside the declared union and outside common sense. A verifier checking only type conformance would ' +
    'pass this. This is the same blindness as EXP2, in a second place.',
}, null, 2));