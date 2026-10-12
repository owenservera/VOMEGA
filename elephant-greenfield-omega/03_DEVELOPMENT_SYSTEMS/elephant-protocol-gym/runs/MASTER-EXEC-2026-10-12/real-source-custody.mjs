#!/usr/bin/env node
// DECISION 1 EXECUTION — real-source cohort custody.
//
// All four Round-0 arms recorded REAL_SOURCE_UNAVAILABLE, and the Round-1
// synthesis recorded "Decision 1 was not exercised by anyone". That claim is
// about a *private* bundle. It is NOT true about the cohort Benchmark R1
// actually names: omega-baseline/plugins/vivim-nlcl-pure, which is in this repo.
//
// This establishes custody for that cohort before any experiment uses it:
//   - the files exist and are tracked by git;
//   - the working-tree bytes equal the bytes at the pinned commit
//     (compared by hashing `git show <sha>:<path>` output — NOT by a
//     path-filtered `git diff`, which can silently print nothing);
//   - a private/owner-held bundle is checked for and reported UNAVAILABLE
//     rather than assumed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gym = path.resolve(here, '..', '..');
const repo = path.resolve(gym, '..', '..', '..');

const PINNED = '1199b38c1fd174e997c92b22d18d8c20c952eb9e';

const COHORT = [
  'omega-baseline/plugins/vivim-nlcl-pure/src/symbols.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/lexer.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/types.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/index.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/interpret.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/frames.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/grammar.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/recognize.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/ground.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/project.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/src/text.ts',
  'omega-baseline/plugins/vivim-nlcl-pure/package.json',
];

const PRIVATE_ARTIFACTS = [
  'Elephant_Dogfood_Source_Seed_v2_2026-10-11.zip',
  'elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/dogfood-zai/source',
];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const git = (...args) =>
  spawnSync('git', ['-C', repo, ...args], { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });

const head = git('rev-parse', 'HEAD').stdout.toString().trim();
const headMatchesPin = head === PINNED;

const report = {
  schema: 'elephant-gym.master-exec.real-source-custody.v1',
  pinned_commit: PINNED,
  head_commit: head,
  head_matches_pin: headMatchesPin,
  repo_root: repo,
  cohort: [],
  private_artifacts: [],
  summary: {},
};

for (const rel of COHORT) {
  const abs = path.join(repo, rel);
  const entry = { rel, exists: fs.existsSync(abs) };

  if (entry.exists) {
    const wt = fs.readFileSync(abs);
    entry.working_tree_sha256 = sha(wt);
    entry.working_tree_bytes = wt.length;

    const tracked = git('ls-files', '--error-unmatch', '--', rel);
    entry.git_tracked = tracked.status === 0;

    // Byte-truth against the pinned commit, via `git show` (not a pathspec diff).
    const blob = git('show', `${PINNED}:${rel}`);
    if (blob.status === 0) {
      entry.pinned_blob_sha256 = sha(blob.stdout);
      entry.pinned_blob_bytes = blob.stdout.length;
      entry.matches_pinned_commit = entry.pinned_blob_sha256 === entry.working_tree_sha256;
    } else {
      entry.pinned_blob_sha256 = null;
      entry.matches_pinned_commit = null;
      entry.pinned_error = blob.stderr.toString().trim().slice(0, 200);
    }

    entry.custody =
      entry.exists &&
      entry.git_tracked &&
      entry.matches_pinned_commit === true
        ? 'CUSTODY_OK'
        : entry.matches_pinned_commit === false
          ? 'UNCOMMITTED_DRIFT'
          : 'CUSTODY_INCOMPLETE';
  } else {
    entry.custody = 'MISSING';
  }
  report.cohort.push(entry);
}

for (const rel of PRIVATE_ARTIFACTS) {
  const abs = path.join(repo, rel);
  report.private_artifacts.push({
    rel,
    present: fs.existsSync(abs),
    status: fs.existsSync(abs) ? 'PRESENT' : 'UNAVAILABLE_NOT_SUPPLIED',
  });
}

const ok = report.cohort.filter((c) => c.custody === 'CUSTODY_OK');
report.summary = {
  cohort_total: report.cohort.length,
  custody_ok: ok.length,
  uncommitted_drift: report.cohort.filter((c) => c.custody === 'UNCOMMITTED_DRIFT').length,
  missing: report.cohort.filter((c) => c.custody === 'MISSING').length,
  cohort_sha256_concat: sha(ok.map((c) => `${c.rel}:${c.working_tree_sha256}`).sort().join('\n')),
  real_source_available: ok.length > 0,
  private_seed_supplied: report.private_artifacts.some((p) => p.present),
  verdict:
    ok.length === report.cohort.length && headMatchesPin
      ? 'REAL_SOURCE_COHORT_CUSTODY_OK'
      : ok.length > 0
        ? 'REAL_SOURCE_COHORT_PARTIAL'
        : 'REAL_SOURCE_UNAVAILABLE',
};

fs.writeFileSync(path.join(here, 'real-source-custody-output.json'), JSON.stringify(report, null, 2) + '\n');

console.log(`pinned commit : ${PINNED}`);
console.log(`HEAD          : ${head}  ${headMatchesPin ? '(matches pin)' : '(DRIFTED FROM PIN)'}\n`);
for (const c of report.cohort) {
  console.log(
    `  ${c.custody.padEnd(22)} ${(c.working_tree_sha256 ?? '-').slice(0, 12)}  ${String(
      c.working_tree_bytes ?? '-'
    ).padStart(6)}  ${c.rel}`
  );
}
console.log('\nprivate artifacts (Decision 1 owner bundle):');
for (const p of report.private_artifacts) console.log(`  ${p.status.padEnd(24)} ${p.rel}`);
console.log('\n' + JSON.stringify(report.summary, null, 2));
process.exit(report.summary.verdict === 'REAL_SOURCE_COHORT_CUSTODY_OK' ? 0 : 1);