// Dependency-free receipt minter for Elephant Gym runs.
//
// WHAT THIS IS: it converts a run's editorial declaration into an immutable run
// receipt, computing every artifact sha256 and byte count FROM DISK. A hash in a
// receipt therefore cannot be invented — if the file is absent or changed, minting
// fails or the hash changes.
//
// WHAT THIS IS NOT: it does not judge whether a claim is true, does not promote
// anything to canon, does not infer status from prose, and does not re-run the run.
// A claim's `evidence_class` and `witness_provenance` are asserted by the run's own
// declaration; minting records them, it does not upgrade them.
//
// Usage:
//   node tools/mint-receipt.mjs                 # mint every declared run
//   node tools/mint-receipt.mjs --run A-2026-10-12
//   node tools/mint-receipt.mjs --check         # verify existing receipts, write nothing
import {readFileSync, writeFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {resolve, dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const home = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const runsDir = join(home, 'runs');
const repoRoot = resolve(home, '..', '..', '..');
const fixturePath = join(home, 'fixture', '001-semantic-basics.ts');

const sha256 = buf => createHash('sha256').update(buf).digest('hex');
const readBytes = p => readFileSync(p);

// A run directory is only eligible for a receipt once it carries a declaration.
// run.json itself is excluded from hashing: it is the output, not an input.
function walk(dir, base = dir, acc = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, base, acc);
    else acc.push(relative(base, full).split('\\').join('/'));
  }
  return acc;
}

const EVIDENCE = new Set(['DESIGN', 'SIMULATED', 'AUTHOR_REPORTED', 'LIVE_RUN', 'MEASURED', 'UNKNOWN']);
// Units that measure elapsed time. A value in one of these without a stated bound is a
// number detached from the conditions that produced it.
const DURATION_UNITS = /^(seconds?|milliseconds?|ms|minutes?|hours?|s)$/i;
const isDuration = unit => typeof unit === 'string' && DURATION_UNITS.test(unit.trim());
const PROVENANCE = new Set(['NONE', 'SELF_WITNESSED', 'CAPSULE_ATTRIBUTED', 'INDEPENDENTLY_REPRODUCED']);
const STATUS = new Set(['NOT_RUN', 'BLOCKED', 'RUNNING', 'SEALED', 'EVALUATED', 'CLOSED', 'UNKNOWN_TERMINAL']);

function validate(receipt, errors) {
  const e = errors;
  for (const k of ['schema', 'run_id', 'protocol_id', 'protocol_version', 'status', 'basis', 'claims', 'events', 'artifacts', 'metrics', 'publication']) {
    if (receipt[k] === undefined) e.push(`${receipt.run_id}: missing required field ${k}`);
  }
  if (receipt.schema !== 'epg.run/0.1') e.push(`${receipt.run_id}: schema mismatch`);
  if (STATUS.has(receipt.status) === false) e.push(`${receipt.run_id}: invalid status ${receipt.status}`);
  for (const k of ['git_sha', 'protocol_sha256', 'requirement_epoch', 'fixture_sha256']) {
    if (!receipt.basis || receipt.basis[k] === undefined) e.push(`${receipt.run_id}: basis.${k} missing`);
  }
  if (!Array.isArray(receipt.claims)) e.push(`${receipt.run_id}: claims not an array`);
  else for (const [i, c] of receipt.claims.entries()) {
    if (typeof c.statement !== 'string' || !c.statement) e.push(`${receipt.run_id}: claim ${i} has no statement`);
    if (!EVIDENCE.has(c.evidence_class)) e.push(`${receipt.run_id}: claim ${i} invalid evidence_class ${c.evidence_class}`);
    // The whole point of witness_provenance: a non-DESIGN claim must say how it was seen.
    if (c.evidence_class !== 'DESIGN' && !PROVENANCE.has(c.witness_provenance)) {
      e.push(`${receipt.run_id}: claim ${i} is ${c.evidence_class} but declares no witness_provenance (see run.schema.json allOf)`);
    }
    if (c.witness_provenance && !PROVENANCE.has(c.witness_provenance)) e.push(`${receipt.run_id}: claim ${i} invalid witness_provenance`);
  }
  if (!Array.isArray(receipt.artifacts)) e.push(`${receipt.run_id}: artifacts not an array`);
  else for (const [i, a] of receipt.artifacts.entries()) {
    if (typeof a.uri !== 'string' || !a.uri) e.push(`${receipt.run_id}: artifact ${i} has no uri`);
    if (!['SOURCE', 'RUN_OUTPUT', 'PROPOSED', 'NOT_AVAILABLE'].includes(a.state)) e.push(`${receipt.run_id}: artifact ${i} invalid state ${a.state}`);
  }
  for (const [k, m] of Object.entries(receipt.metrics ?? {})) {
    for (const f of ['value', 'status', 'unit']) if (m[f] === undefined) e.push(`${receipt.run_id}: metric ${k} missing ${f}`);
    if (!['MEASURED', 'ESTIMATED', 'UNKNOWN', 'NOT_APPLICABLE'].includes(m.status)) e.push(`${receipt.run_id}: metric ${k} invalid status ${m.status}`);
    // Bound-before-reporting (Round 1 CORE_SEED fix 3). A measured DURATION is only a
    // measurement if it states the envelope it was taken under. Round 0 produced a
    // wall-clock threshold that reported a property of the source when it was a property
    // of the machine, so a bare timing number is treated as an uncalibrated claim.
    if (isDuration(m.unit) && m.status === 'MEASURED' && !m.bound) {
      e.push(`${receipt.run_id}: metric ${k} is a MEASURED duration with no stated bound — add "bound" or downgrade its status`);
    }
    // Anything gating on wall clock needs its calibration envelope declared, or it is
    // descriptive rather than a gate.
    if (m.gates_on_wall_clock === true && !m.calibration_envelope) {
      e.push(`${receipt.run_id}: metric ${k} gates on wall clock but declares no calibration_envelope — it may not be used as a gate`);
    }
  }
  if (!receipt.publication || !['NOT_STARTED', 'PUBLISHED', 'BLOCKED', 'UNPUBLISHED'].includes(receipt.publication.status)) {
    e.push(`${receipt.run_id}: publication.status missing/invalid`);
  }
  return e;
}

function mint(decl, {check}) {
  const errors = [];
  const dir = join(runsDir, decl.run_dir);
  if (!existsSync(dir)) throw new Error(`run directory not found: runs/${decl.run_dir}`);

  // Artifacts hashed from disk. `exclude` lets the declaration skip build scratch.
  // Build output is excluded wherever it appears: a .gt-build/ directory in the middle of
  // a path is still compiler output, not evidence, and it is gitignored anyway.
  const excluded = new Set(['run.json', ...(decl.exclude ?? [])]);
  const isBuildScratch = rel => rel.split('/').some(seg => seg === '.gt-build' || seg === 'node_modules' || seg === '.cache');
  const artifacts = [];
  for (const rel of walk(dir)) {
    if (excluded.has(rel) || isBuildScratch(rel)) continue;
    const buf = readBytes(join(dir, rel));
    artifacts.push({
      uri: `runs/${decl.run_dir}/${rel}`,
      sha256: sha256(buf),
      bytes: buf.length,
      state: decl.proposed_only?.includes(rel) ? 'PROPOSED' : 'RUN_OUTPUT',
    });
  }
  for (const rel of decl.proposed_only ?? []) {
    if (!artifacts.some(a => a.uri.endsWith(`/${rel}`))) errors.push(`${decl.run_id}: proposed_only entry not found: ${rel}`);
  }
  artifacts.sort((a, b) => a.uri.localeCompare(b.uri));

  // The fixture hash is computed, never asserted — this is how a receipt proves which
  // corpus it actually ran against.
  const fixtureSha = existsSync(fixturePath) ? sha256(readBytes(fixturePath)) : null;
  if (decl.basis.fixture_sha256 !== fixtureSha) {
    errors.push(`${decl.run_id}: declared fixture_sha256 does not match the fixture on disk (declared ${decl.basis.fixture_sha256}, actual ${fixtureSha})`);
  }

  const receipt = {
    schema: 'epg.run/0.1',
    run_id: decl.run_id,
    protocol_id: decl.protocol_id,
    protocol_version: decl.protocol_version,
    status: decl.status,
    basis: {...decl.basis, fixture_sha256: fixtureSha},
    claims: decl.claims,
    events: decl.events ?? [],
    artifacts,
    metrics: decl.metrics ?? {},
    publication: decl.publication,
    ...(decl.gate_results ? {gate_results: decl.gate_results} : {}),
    ...(decl.extensions ? {extensions: decl.extensions} : {}),
  };

  validate(receipt, errors);
  const out = join(dir, 'run.json');
  if (check) {
    if (!existsSync(out)) errors.push(`${decl.run_id}: --check but runs/${decl.run_dir}/run.json does not exist`);
    else {
      const prior = JSON.parse(readFileSync(out, 'utf8'));
      // Custody of the receipt itself: re-minting must be deterministic.
      if (JSON.stringify(prior) !== JSON.stringify(receipt)) errors.push(`${decl.run_id}: existing run.json differs from a fresh mint (artifact changed or receipt hand-edited)`);
    }
  } else if (errors.length === 0) {
    writeFileSync(out, JSON.stringify(receipt, null, 2) + '\n');
  }
  return {run_id: decl.run_id, dir: decl.run_dir, artifacts: artifacts.length, status: decl.status, errors};
}

function main() {
  const argv = process.argv.slice(2);
  const check = argv.includes('--check');
  const only = argv.includes('--run') ? argv[argv.indexOf('--run') + 1] : null;
  const declDir = join(runsDir, 'receipts');
  if (!existsSync(declDir)) {
    console.error('no runs/receipts/ directory — nothing declared yet');
    process.exitCode = 1;
    return;
  }
  const decls = readdirSync(declDir).filter(f => f.endsWith('.decl.json')).sort()
    .map(f => JSON.parse(readFileSync(join(declDir, f), 'utf8')))
    .filter(d => !only || d.run_dir === only || d.run_id === only);

  let failed = 0;
  for (const d of decls) {
    let r;
    try {
      r = mint(d, {check});
    } catch (err) {
      r = {run_id: d.run_id ?? d.run_dir, dir: d.run_dir, artifacts: 0, status: '?', errors: [String(err.message)]};
    }
    if (r.errors.length) {
      failed++;
      console.log(`[FAIL] ${r.run_id} (${r.dir})`);
      for (const e of r.errors) console.log(`       ${e}`);
    } else {
      console.log(`[ OK ] ${r.run_id} — ${r.artifacts} artifacts hashed, status ${r.status}${check ? ' (verified, byte-identical)' : ''}`);
    }
  }
  console.log(`\n${decls.length - failed}/${decls.length} receipts ${check ? 'verified' : 'minted'} from disk.`);
  if (failed) {
    console.log('A receipt that cannot be minted is a finding, not a nuisance: it means a declared artifact is missing or a recorded hash no longer matches the file.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();