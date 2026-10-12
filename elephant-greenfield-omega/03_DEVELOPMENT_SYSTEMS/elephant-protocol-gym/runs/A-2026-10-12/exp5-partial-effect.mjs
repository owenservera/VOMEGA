// EXPERIMENT 5 — does repeat() fail atomically?
//
// SATURATION_DESCRIPTION.md left this UNKNOWN: `repeat` invokes the caller's
// callback inside its loop, so a callback that throws might leave the caller
// with a PARTIAL effect — some emissions delivered, then an exception. That is
// the property most relevant to the launch policy's non-negotiable boundary
// ("preserve human intent and authorization for external effects"), because a
// partial effect is a side effect that happened without ever completing.
//
// This probe closes the UNKNOWN rather than leaving it as inference.
//
// Evidence class: OBSERVED.
// Usage: node exp5-partial-effect.mjs
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
const dir = mkdtempSync(join(tmpdir(), 'runa-e5-'));
writeFileSync(join(dir, 'm.ts'), src);
execFileSync(process.execPath, [TSC, join(dir, 'm.ts'), '--outDir', dir, '--module', 'commonjs', '--target', 'es2020', '--strict']);
const {repeat} = require(join(dir, 'm.js'));

const rows = [];
for (const failAt of [0, 1, 2, 99]) {
  const delivered = [];
  let threw = null;
  try {
    repeat(100, (v) => {
      if (v === failAt) throw new Error(`callback refused value ${v}`);
      delivered.push(v);
    });
  } catch (e) {
    threw = e.message;
  }
  rows.push({
    callbackThrowsAtValue: failAt,
    requestedCount: 100,
    valuesActuallyDelivered: delivered.length,
    deliveredTail: delivered.slice(-3),
    threw,
    partialEffect: threw !== null && delivered.length > 0,
    callerRegainedControl: true,
  });
}

const partials = rows.filter((r) => r.partialEffect);

console.log(JSON.stringify({
  experiment: 'EXP5 — does repeat() fail atomically under a throwing callback?',
  evidenceClass: 'OBSERVED',
  sourceSha256: createHash('sha256').update(src).digest('hex'),
  compiler: `typescript@${TSC_VERSION}`,
  rows,
  summary: {
    partialEffectsObserved: partials.length,
    detail: partials.map((r) => `callback threw at value ${r.callbackThrowsAtValue}, yet ${r.valuesActuallyDelivered} values had already been delivered`),
    verdict: partials.length > 0 ? 'NOT ATOMIC' : 'ATOMIC',
  },
  consequence:
    'repeat() has no rollback. A caller that supplies a partially-rejecting callback receives a ' +
    'partial effect and an exception, with no way to tell from the return path which values landed. ' +
    'Nothing in the file declares this, so a description built from comments or types alone will ' +
    'not warn a caller.',
}, null, 2));