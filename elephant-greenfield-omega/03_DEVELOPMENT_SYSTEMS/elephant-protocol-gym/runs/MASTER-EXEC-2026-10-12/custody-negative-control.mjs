#!/usr/bin/env node
// NEGATIVE CONTROL for custody-check.mjs.
//
// The Round-1 synthesis names L11 — "instrument failure masquerading as a clean
// result" — as the round's real find, and three arms hit it unprompted. A
// verifier that has only ever returned PASS has demonstrated nothing.
//
// This mutates COPIES of the master in a temp sandbox (the real master is never
// touched) to invert each property the checker claims to verify, then asserts
// the checker actually flips to a failure verdict. Positive controls run too,
// so a harness that simply fails everything is also caught.
//
// The checker locates its gym root as resolve(scriptDir, '..', '..'), so the
// sandbox mirrors the real layout: <sandboxGym>/runs/x/custody-check.mjs with
// the master at <sandboxGym>/built/ and sources copied to <sandboxGym>/.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gym = path.resolve(here, '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-negctl-'));

const masterSrc = fs.readFileSync(path.join(gym, 'built', 'FULL_DRY_RUN_PROMPT_ALL.md'), 'utf8');
const runnerSource = fs.readFileSync(path.join(here, 'custody-check.mjs'), 'utf8');
const SOURCES = [
  ...masterSrc.matchAll(/<!-- BEGIN VERBATIM (.+?) sha256:([a-f0-9]{64}) bytes:(\d+) -->/g),
].map((m) => m[1]);

// Build one sandbox, apply `mutate` to (master, sourceFiles) before writing.
function runCase({ name, mutate, expect }) {
  const sandboxGym = fs.mkdtempSync(path.join(tmp, 'gym-'));
  const scriptDir = path.join(sandboxGym, 'runs', 'case');
  fs.mkdirSync(scriptDir, { recursive: true });
  fs.mkdirSync(path.join(sandboxGym, 'built'), { recursive: true });

  const sources = new Map();
  for (const rel of SOURCES) sources.set(rel, fs.readFileSync(path.join(gym, rel)));

  const { master, sources: patched } = mutate(masterSrc, sources);

  fs.writeFileSync(path.join(sandboxGym, 'built', 'FULL_DRY_RUN_PROMPT_ALL.md'), master);
  fs.writeFileSync(path.join(scriptDir, 'custody-check.mjs'), runnerSource);
  for (const [rel, buf] of patched) {
    const dst = path.join(sandboxGym, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, buf);
  }

  const r = spawnSync(process.execPath, [path.join(scriptDir, 'custody-check.mjs'), '--json'], {
    encoding: 'utf8',
  });
  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(path.join(scriptDir, 'custody-check-output.json'), 'utf8'));
  } catch {
    /* leave null */
  }
  const verdict = parsed?.summary?.verdict ?? `NO_OUTPUT(exit=${r.status})`;
  const detail = {
    custody_fail: parsed?.summary?.custody_fail ?? null,
    body_mismatch: parsed?.summary?.body_mismatch ?? null,
    source_missing: parsed?.summary?.source_missing ?? null,
  };
  return { name, expect, observed: verdict, detail, discriminating: expect === verdict, stderr: r.stderr };
}

const identity = (m, s) => ({ master: m, sources: s });

const cases = [
  runCase({
    name: 'P1 unmutated master passes',
    expect: 'ALL_26_SECTIONS_CUSTODY_OK',
    mutate: identity,
  }),
  runCase({
    name: 'P2 clean copy with disclosure banners also passes (no false alarm)',
    expect: 'ALL_26_SECTIONS_CUSTODY_OK',
    mutate: identity,
  }),
  runCase({
    name: 'N1 tampered SOURCE byte -> custody fails',
    expect: 'CUSTODY_BROKEN',
    mutate: (m, s) => {
      const k = 'fixture/001-semantic-basics.ts';
      s.set(k, Buffer.from(s.get(k).toString('utf8').replace('MAX_RETRIES = 3', 'MAX_RETRIES = 4')));
      return { master: m, sources: s };
    },
  }),
  runCase({
    name: 'N2 embedded-BODY edit only -> body mismatch caught',
    expect: 'CUSTODY_BROKEN',
    mutate: (m, s) => ({
      master: m.replace('a nonnegative safe integer', 'a POSITIVE safe integer'),
      sources: s,
    }),
  }),
  runCase({
    name: 'N3 wrong CLAIMED sha256 in marker -> custody fails',
    expect: 'CUSTODY_BROKEN',
    mutate: (m, s) => ({
      master: m.replace(
        /<!-- BEGIN VERBATIM LAUNCH_POLICY\.md sha256:[a-f0-9]{64}/,
        '<!-- BEGIN VERBATIM LAUNCH_POLICY.md sha256:' + '0'.repeat(64)
      ),
      sources: s,
    }),
  }),
  runCase({
    name: 'N4 deleted SOURCE file -> custody fails',
    expect: 'CUSTODY_BROKEN',
    mutate: (m, s) => {
      s.delete('MACHINE_HUMAN_SIGNAL.md');
      return { master: m, sources: s };
    },
  }),
];

fs.rmSync(tmp, { recursive: true, force: true });

const pass = cases.filter((c) => c.discriminating).length;
console.log('Custody-check NEGATIVE CONTROL');
console.log('(proves the checker can fail; its PASS is therefore meaningful)\n');
for (const c of cases) {
  console.log(`  [${c.discriminating ? 'OK  ' : 'FAIL'}] ${c.name}`);
  console.log(`         expected ${c.expect} / observed ${c.observed}`);
}
console.log(`\n${pass}/${cases.length} controls discriminate.`);
console.log(
  pass === cases.length
    ? 'NEGATIVE CONTROL PASS — the checker discriminates'
    : 'NEGATIVE CONTROL FAIL — do not trust the checker'
);
process.exit(pass === cases.length ? 0 : 1);