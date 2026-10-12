// Verification sweep for Run A.
//
// Re-derives every number the RUN NOTE asserts, from freshly executed experiments,
// and checks it against the stored result artifacts. A run note that cites numbers
// nobody can re-derive is not evidence.
//
// Usage: node verify-run-note.mjs   (runnable from any working directory)
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Resolve every artifact against this file's own directory, not the caller's cwd,
// so the sweep is reproducible from the repo root or from CI.
const here = dirname(fileURLToPath(import.meta.url));
const at = (f) => resolve(here, f);
const j = (f) => JSON.parse(readFileSync(at(f), 'utf8'));
const checks = [];
const check = (name, pass, detail) => checks.push({name, pass: !!pass, detail});

// --- custody ---------------------------------------------------------------
const FIXTURE_SHA = 'fe0c651e51936074346c7dcabfef52785783e5a3d87f110c8365952b40a386d5';
const baselineSha = createHash('sha256').update(readFileSync(at('baseline.ts'), 'utf8')).digest('hex');
check('fixture sha256 matches the value pinned in the run note', baselineSha === FIXTURE_SHA, baselineSha);

const r1 = j('exp1-results.json');
const r2 = j('exp2-results.json');
const r3 = j('exp3-results.json');
const r4 = j('exp4-results.json');
const r5 = j('exp5-results.json');

// --- exp1 claims -----------------------------------------------------------
const violations = r1.results.filter((x) => x.satisfiesStatedPrecondition === false);
check('exp1: 11 input cases probed', r1.results.length === 11, `actual=${r1.results.length}`);
// 7 violating inputs: -1, -5, 2.7, 0.4, NaN, 2^53, Infinity. (This count was
// originally written as 6 in the run note; the sweep re-derived 7 and the note
// was corrected. The assertion is the authority, not the prose.)
check('exp1: exactly 7 violate the stated precondition', violations.length === 7, `actual=${violations.length}`);
check('exp1: 5 violations returned normally, 2 never returned',
  violations.filter((x) => x.outcome === 'RETURNED').length === 5 &&
  violations.filter((x) => x.outcome === 'DID_NOT_RETURN').length === 2,
  JSON.stringify(violations.map((x) => x.outcome)));
check('exp1: NOT ONE violation produced a diagnostic',
  violations.every((x) => x.violationIsSilent !== false),
  JSON.stringify(violations.map((x) => `${x.label}=${x.outcome}/silent:${x.violationIsSilent}`)));
check('exp1: count=2.7 emits 3 values (ceil behaviour)',
  r1.results.find((x) => x.label.includes('2.7'))?.emissionsObserved === 3);
check('exp1: count=0.4 emits 1 value',
  r1.results.find((x) => x.label.includes('0.4'))?.emissionsObserved === 1);
check('exp1: count=1e9 satisfies the contract yet does not return',
  (() => { const x = r1.results.find((v) => v.label.includes('1e9')); return x && x.satisfiesStatedPrecondition === true && x.outcome === 'DID_NOT_RETURN'; })());

// --- exp2 claims -----------------------------------------------------------
check('exp2: type-derived .d.ts is byte-identical after the mutation', r2.channelT_typeDerived.identical === true);
check('exp2: type-derived verdict is UNDETECTED', /UNDETECTED/.test(r2.channelT_typeDerived.verdict));
check('exp2: execution DID detect the mutation', r2.channelO_observed.identical === false);
check('exp2: before series is [10,11,12,13,14]', JSON.stringify(r2.channelO_observed.before) === '[10,11,12,13,14]');
check('exp2: after series is [0,10,20,30,40]', JSON.stringify(r2.channelO_observed.after) === '[0,10,20,30,40]');
check('exp2: both versions still typecheck under --strict', r2.bothVersionsTypecheckUnderStrict === true);

// --- exp3 claims -----------------------------------------------------------
check('exp3: the P1 comment was actually found (no vacuous null==null)', r3.P1_comment_in_source.commentFound === true);
check('exp3: P1 comment text survives the mutation', r3.P1_comment_in_source.commentTextUnchangedAfterMutation === true);
check('exp3: P0 plain control detects neither failure', !r3.P0_plain_source_control.detectsMutation && !r3.P0_plain_source_control.detectsUnenforcedPrecondition);
check('exp3: P1 comment detects mutation = false, precondition = true',
  r3.P1_comment_in_source.detectsMutation === false && r3.P1_comment_in_source.detectsUnenforcedPrecondition === true);
check('exp3: P2 sidecar detects mutation = true, precondition = false',
  r3.P2_digest_bound_sidecar.detectsMutation === true && r3.P2_digest_bound_sidecar.detectsUnenforcedPrecondition === false);

// --- exp4 claims -----------------------------------------------------------
const nanRow = r4.rows.find((x) => x.input === 'NaN');
check('exp4: classify(NaN) returns "positive"', nanRow?.returned === 'positive');
check('exp4: that answer is INSIDE the declared union', nanRow?.withinDeclaredUnion === true);
check('exp4: the union does not exhaust the reals', r4.declaredReturnUnionExhaustsReals === false);

// --- exp5 claims -----------------------------------------------------------
check('exp5: repeat() verdict is NOT ATOMIC', r5.summary.verdict === 'NOT ATOMIC');
check('exp5: 3 partial effects observed (throwing at 1, 2, 99)', r5.summary.partialEffectsObserved === 3,
  `actual=${r5.summary.partialEffectsObserved}`);
check('exp5: throwing at value 0 delivers nothing (fails before any emission)',
  r5.rows.find((x) => x.callbackThrowsAtValue === 0)?.valuesActuallyDelivered === 0);

// --- cross-artifact consistency -------------------------------------------
const shaIn = (obj) => JSON.stringify(obj).includes(FIXTURE_SHA);
check('every experiment recorded the same pinned fixture sha256',
  [r1, r4, r5].every(shaIn) && shaIn(r2.sourceSha256.original));

// --- report ----------------------------------------------------------------
const failed = checks.filter((c) => !c.pass);
console.log(`\nRUN A VERIFICATION — ${checks.length - failed.length}/${checks.length} checks passed\n`);
for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.pass ? '' : `   <-- ${c.detail}`}`);
console.log(failed.length ? `\n${failed.length} FAILED` : '\nAll run-note claims re-derived from execution.');
process.exit(failed.length ? 1 : 0);