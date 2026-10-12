// RUN C — Ground-truth establishment for fixture/001-semantic-basics.ts
//
// PURPOSE: establish what is MECHANICALLY TRUE about the fixture, separately from
// what the fixture's doc comments CLAIM. Everything later in this run is compared
// against the output of this file. If this file is wrong, the whole run is wrong.
//
// SCOPE LIMIT (per RUN_C prompt): this is NOT a semantic compiler, NOT a production
// runtime, NOT an ontology. It compiles and executes one 32-line file with existing
// tools (tsc, node) and records raw observations.
//
// Usage: node groundtruth.mjs <fixture.ts>
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync, rmSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve, join, dirname, relative} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const gymRoot = resolve(here, '..', '..', '..');
const fixturePath = resolve(process.argv[2] ?? join(gymRoot, 'fixture/001-semantic-basics.ts'));

// Invoke the real TypeScript compiler through node directly. Avoids the Windows
// `npx` shell shim, and pins the exact compiler build used as evidence.
const TSC = process.env.TSC_JS
  ?? 'C:/Users/VIVIM.inc/AppData/Roaming/npm/node_modules/typescript/lib/tsc.js';
const tsc = (...args) => execFileSync(process.execPath, [TSC, ...args],
  {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});

const record = {fixture: {}, typecheck: {}, runtime: {}, git: {}};
const emit = (label, value) => { record.runtime[label] = value; };

// ---- 1. SOURCE CUSTODY -------------------------------------------------------
const sourceBytes = readFileSync(fixturePath);
record.fixture = {
  path: fixturePath,
  bytes: sourceBytes.length,
  sha256: createHash('sha256').update(sourceBytes).digest('hex'),
};

// ---- 2. WHAT THE COMPILER ACTUALLY KNOWS ------------------------------------
// Question: does tsc enforce the doc-comment claim "count is a nonnegative safe integer"?
// Answer by observation, not by assumption: ask tsc to typecheck a caller that violates it.
const buildDir = join(here, '.gt-build');
rmSync(buildDir, {recursive: true, force: true});
mkdirSync(buildDir, {recursive: true});

// A deliberately contract-violating caller. If the compiler enforced the declared
// precondition, THIS is where it would fail.
// NOTE: kept SEPARATE from the type-violation caller. Mixing both would make a
// single non-zero exit uninterpretable — we would not know WHICH violation was caught.
const violatingCaller = `
import {repeat} from './001-semantic-basics.js';
declare const sink: (v: number) => void;
repeat(-1, sink);        // negative count: violates declared "nonnegative"
repeat(2.5, sink);       // non-integer count: violates declared "safe integer"
repeat(NaN, sink);       // NaN count: violates declared "safe integer"
`;
const typeViolatingCaller = `
import {repeat} from './001-semantic-basics.js';
repeat(2, (v) => { const bad: string = v; void bad; });  // genuine TYPE violation
`;
writeFileSync(join(buildDir, 'caller.ts'), violatingCaller);
writeFileSync(join(buildDir, 'caller-type.ts'), typeViolatingCaller);
// The callers import './001-semantic-basics.js'. Place the fixture source beside
// them so the specifier resolves; otherwise tsc reports TS2307 (module not found),
// which is a harness artifact and NOT evidence about the declared precondition.
writeFileSync(join(buildDir, '001-semantic-basics.ts'), sourceBytes);

const tscVersion = execFileSync(process.execPath, [TSC, '--version'], {encoding: 'utf8'}).trim();
record.typecheck.tscVersion = tscVersion;
record.typecheck.compilerPath = TSC;

// 2a. Typecheck the fixture alone (does the file itself typecheck clean?)
let fixtureCheck = {exitCode: null, stdout: '', rejected: false};
try {
  fixtureCheck.stdout = tsc('--noEmit', '--strict',
    '--target', 'es2022', '--module', 'es2022', '--moduleResolution', 'bundler', fixturePath);
  fixtureCheck.exitCode = 0;
} catch (e) {
  fixtureCheck.exitCode = e.status;
  fixtureCheck.stdout = (e.stdout ?? '') + (e.stderr ?? '');
}
record.typecheck.fixtureAlone = {
  exitCode: fixtureCheck.exitCode,
  diagnostics: fixtureCheck.stdout.trim() || '(none)',
  verdict: fixtureCheck.exitCode === 0 ? 'FIXTURE TYPECHECKS CLEAN' : 'FIXTURE HAS TYPE ERRORS',
};

// 2b. Typecheck the contract-violating caller.
let callerCheck = {exitCode: null, out: ''};
try {
  callerCheck.out = tsc('--noEmit', '--strict',
    '--target', 'es2022', '--module', 'es2022',
    '--moduleResolution', 'bundler', join(buildDir, 'caller.ts'));
  callerCheck.exitCode = 0;
} catch (e) {
  callerCheck.exitCode = e.status;
  callerCheck.out = ((e.stdout ?? '') + (e.stderr ?? '')).trim();
}
// Control: a caller with a REAL type error, to prove the typechecker is actually
// running and would have reported a genuine mismatch. Without this, "exit 0" on the
// precondition caller could mean "clean" or "typechecker silently did nothing".
let typeCheck = {exitCode: null, out: ''};
try {
  typeCheck.out = tsc('--noEmit', '--strict', '--target', 'es2022', '--module', 'es2022',
    '--moduleResolution', 'bundler', join(buildDir, 'caller-type.ts'));
  typeCheck.exitCode = 0;
} catch (e) {
  typeCheck.exitCode = e.status;
  typeCheck.out = ((e.stdout ?? '') + (e.stderr ?? '')).trim();
}

// A TS2307 means the harness could not resolve the import — that is our bug, not a
// finding about the fixture. Never let it be counted as a rejection.
const harnessError = (out) => /TS2307|error TS1[0-9]{3}: Cannot find/.test(out ?? '');
const summarise = (name, res, expectRejection) => {
  const broken = harnessError(res.out);
  return {
    exitCode: res.exitCode,
    diagnostics: res.out || '(none)',
    harnessResolutionError: broken,
    verdict: broken
      ? 'HARNESS ERROR — module did not resolve; result is INVALID, re-run required'
      : expectRejection
        ? (res.exitCode !== 0
            ? 'CONTROL OK — typechecker is live and reported the real type error'
            : 'CONTROL FAILED — typechecker missed a real type error; other exit-0 results are meaningless')
        : (res.exitCode === 0
            ? 'COMPILER ACCEPTED ALL PRECONDITION VIOLATIONS (-1, 2.5, NaN) — declared precondition is NOT type-enforced'
            : `compiler rejected: ${res.out}`),
  };
};
record.typecheck.contractViolatingCaller = summarise('precondition', callerCheck, false);
record.typecheck.typeViolationControl = summarise('type', typeCheck, true);

// ---- 3. WHAT ACTUALLY HAPPENS AT RUNTIME ------------------------------------
execFileSync(process.execPath, [TSC, '--target', 'es2022', '--module', 'es2022',
  '--moduleResolution', 'bundler', '--outDir', buildDir,
  fixturePath, '--rootDir', dirname(fixturePath)],
{encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
writeFileSync(join(buildDir, 'package.json'), '{"type":"module"}');

const m = await import(pathToFileURL(join(buildDir, '001-semantic-basics.js')).href);

const collect = (count) => { const out = []; m.repeat(count, (v) => out.push(v)); return out; };

emit('add(2,3)', m.add(2, 3));
emit('add(0.1,0.2)', m.add(0.1, 0.2));
emit('classify(-1/0/5)', [m.classify(-1), m.classify(0), m.classify(5)]);
emit('accumulate([1,2,3])', m.accumulate([1, 2, 3]));
emit('accumulate([])', m.accumulate([]));
emit('MAX_RETRIES', m.MAX_RETRIES);

// The decisive runtime probes against the DECLARED but UNENFORCED contract.
emit('repeat(3)', collect(3));
emit('repeat(0)', collect(0));
emit('repeat(-1)  [declared: nonnegative integer]', collect(-1));
emit('repeat(-5)  [declared: nonnegative integer]', collect(-5));
emit('repeat(2.5) [declared: safe integer]', collect(2.5));
emit('repeat(0.5) [declared: safe integer]', collect(0.5));
emit('repeat(NaN) [declared: safe integer]', collect(NaN));
emit('repeat(3.7) [declared: safe integer]', collect(3.7));

// Does a violation THROW, or silently produce output?
const silentVsThrow = (() => {
  const probes = [[-1, 'negative'], [2.5, 'fractional'], [NaN, 'NaN']];
  return probes.map(([c, kind]) => {
    try { return {count: String(c), kind, threw: false, emitted: collect(c).length, error: null}; }
    catch (e) { return {count: String(c), kind, threw: true, emitted: null, error: String(e.message)}; }
  });
})();
record.runtime.violationBehaviour = silentVsThrow;

// Surface probe: is there any runtime guard in the emitted JS?
const emittedJs = readFileSync(join(buildDir, '001-semantic-basics.js'), 'utf8');
record.runtime.hasGuardInEmittedJs = /throw|assert|if\s*\(\s*!|range|Number\.isInteger|Number\.isSafeInteger/.test(
  emittedJs.split('function repeat')[1]?.split('\nfunction ')[0] ?? '');
record.runtime.repeatEmittedBody =
  emittedJs.split('function repeat')[1]?.split('\nexport')[0]?.trim() ?? '(not found)';

// ---- 4. GIT CUSTODY ----------------------------------------------------------
// Resolve the real repo root and relativise against it, so a repo checkout at a
// different path (or nested deeper) still produces a valid `HEAD:<path>` spec.
try {
  const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'],
    {encoding: 'utf8', cwd: gymRoot}).trim();
  const relFixture = relative(repoRoot, fixturePath).replace(/\\/g, '/');
  record.git.repoRoot = repoRoot;
  record.git.fixturePathspec = relFixture;
  record.git.blobSha = execFileSync('git', ['rev-parse', `HEAD:${relFixture}`],
    {encoding: 'utf8', cwd: repoRoot}).trim();
  record.git.workingTreeClean =
    !execFileSync('git', ['status', '--porcelain', '--', relFixture],
      {encoding: 'utf8', cwd: repoRoot}).trim();
} catch (e) {
  record.git.blobSha = `(unavailable: ${e.message.split('\n')[0]})`;
  record.git.workingTreeClean = '(unknown)';
}

// ---- 5. DERIVE THE CONTRADICTION ---------------------------------------------
// Compare the DECLARED contract (line 17) against OBSERVED behaviour.
const declared = {subject: 'repeat(count, emit)', claim: 'count is a nonnegative safe integer',
                  enforcement: 'Not enforced'};
const observed = {
  'count=-1': {emitted: collect(-1).length, note: 'silently empty, no error'},
  'count=2.5': {emitted: collect(2.5).length, note: `ceiling-ward: asked fractionally, got ${collect(2.5).length} emissions`},
  'count=NaN': {emitted: collect(NaN).length, note: 'silently empty, no error'},
  'typeEnforced: false': {emitted: null, note: callerCheck.exitCode === 0 ? 'tsc accepted -1, 2.5, NaN' : 'tsc rejected'},
};
record.contradiction = {
  declared,
  observed,
  typeSystemEnforcesPrecondition: callerCheck.exitCode === 0,
  runtimeThrowsOnViolation: silentVsThrow.some((p) => p.threw),
  verdict: callerCheck.exitCode === 0 && !silentVsThrow.some((p) => p.threw)
    ? 'CONFIRMED: the declared precondition is documentation only. Neither tsc nor runtime enforces it, and no violation raises an error.'
    : 'NOT CONFIRMED — inspect record.typecheck and record.runtime.violationBehaviour',
};

// ---- WRITE EVIDENCE ----------------------------------------------------------
mkdirSync(join(here, '..', 'evidence'), {recursive: true});
writeFileSync(join(here, '..', 'evidence', 'groundtruth.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify({
  fixtureSha256: record.fixture.sha256,
  gitBlob: record.git.blobSha,
  fixtureAlone: record.typecheck.fixtureAlone.verdict,
  violatingCaller: record.typecheck.contractViolatingCaller.verdict,
  repeatMinus1: collect(-1).length, repeatTwoPointFive: collect(2.5).length, repeatNaN: collect(NaN).length,
  hasGuard: record.runtime.hasGuardInEmittedJs,
  verdict: record.contradiction.verdict,
}, null, 2));