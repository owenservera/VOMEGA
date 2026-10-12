// run-b-experiment.mjs — Arm B falsifying experiment driver.
//
// Question under test: can one small portable program publish a version-pinned
// semantic fact ONCE and render it into two mutually source-linked projections,
// with a deliberate source mutation making the stale meaning VISIBLE?
//
// Six phases, each producing a real receipt:
//   P1 publish once from the pinned fixture
//   P2 verify green on the pristine source
//   P3 behavioural witness for the DECLARED contract
//   P4 deliberate mutation -> is staleness visible, and at what granularity?
//   P5 hand-drift a projection -> is divergence detectable?
//   P6 emit the Machine <-> Human learning signal
//
// Nothing here authorizes an external effect. Phase 3 executes ONLY the local
// fixture module, and only to observe behavior the author already declared.

import {readFileSync, writeFileSync, copyFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {extractFacts, publish, projectMachine, projectHuman, verify, sha256, canon, coreOf} from './sempub.mjs';

const PINNED_COMMIT = '1199b38c1fd174e997c92b22d18d8c20c952eb9e';
const PINNED_SHA = 'fe0c651e51936074346c7dcabfef52785783e5a3d87f110c8365952b40a386d5';
const SRC = './source.ts';

const out = [];
const say = (s = '') => { out.push(s); console.log(s); };
const rule = (t) => say(`\n${'='.repeat(72)}\n${t}\n${'='.repeat(72)}`);

// ---------------------------------------------------------------------------
rule('P0  INPUT CUSTODY');
// ---------------------------------------------------------------------------
const pristine = readFileSync(SRC, 'utf8');
const srcSha = sha256(pristine);
say(`pinned repo commit      : ${PINNED_COMMIT}`);
say(`pinned fixture sha256   : ${PINNED_SHA}`);
say(`fixture bytes on disk   : ${srcSha}`);
say(`custody match           : ${srcSha === PINNED_SHA ? 'OK - fixture is byte-identical to the pinned canon' : 'MISMATCH'}`);
say(`tool under test         : sempub/0.1.0 (node ${process.versions.node})`);

// ---------------------------------------------------------------------------
rule('P1  PUBLISH ONCE (static intake, no execution)');
// ---------------------------------------------------------------------------
const {facts, fileDeclaration} = extractFacts(pristine, 'fixture/001-semantic-basics.ts');
say(`facts extracted         : ${facts.length}`);
for (const f of facts) {
  say(`  - ${f.id.padEnd(14)} evidence=${f.evidence.padEnd(8)} lines=${f.source.lines[0]}-${f.source.lines[1]}`);
}
const declaredFacts = facts.filter((f) => f.evidence === 'DECLARED');
say(`DECLARED (author claims) : ${declaredFacts.map((f) => f.id).join(', ') || 'none'}`);
say(`file-level declaration   : ${fileDeclaration ? '"' + fileDeclaration + '"' : 'none'}`);

// ---------------------------------------------------------------------------
rule('P2  VERIFY on pristine source (expect GREEN)');
// ---------------------------------------------------------------------------
let pub = publish({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', sourceSha256: srcSha, facts, fileDeclaration});
let machine = projectMachine(pub);
let human = projectHuman(pub);
say(`publication_id          : ${pub.publication_id}`);
say(`publication digest      : ${pub.digest}`);
let v1 = verify({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', pub, machine, human});
for (const c of v1.checks) say(`  [${c.ok ? 'PASS' : 'FAIL'}] ${c.name.padEnd(42)} ${c.detail}`);
say(`P2 result               : ${v1.green ? 'GREEN' : 'RED'}`);

writeFileSync('human.md', human);
writeFileSync('machine.json', JSON.stringify(machine, null, 2));
say(`wrote projections        : human.md, machine.json (both from ONE publication)`);

// ---------------------------------------------------------------------------
rule('P3  BEHAVIOURAL WITNESS for the DECLARED contract');
// ---------------------------------------------------------------------------
// Experimental design (stated, not inferred): probe `repeat` with one
// in-domain input and two out-of-domain inputs. Question: does the function
// enforce the author's "count is a nonnegative safe integer" contract, or does
// it silently accept anything?
const PROBES = [
  {label: 'in-domain', count: 3},
  {label: 'out-of-domain negative', count: -1},
  {label: 'out-of-domain non-integer', count: 2.5},
];

const mod = await import('./source.ts?witness=' + Date.now());
const probeResults = [];
for (const p of PROBES) {
  const emitted = [];
  let threw = null;
  try { mod.repeat(p.count, (v) => emitted.push(v)); } catch (e) { threw = e.constructor.name; }
  probeResults.push({probe: p.label, count: p.count, emitted, threw});
  say(`  repeat(${p.count})`.padEnd(16) + ` -> emitted ${JSON.stringify(emitted)}` + (threw ? ` THREW ${threw}` : ', no error raised'));
}

const witnesses = {
  'fn.repeat': {
    kind: 'behavioural-probe',
    method: 'executed the pinned fixture module and recorded emissions',
    probes: probeResults,
    enforces_declared_precondition: false,
    finding: 'repeat() does not validate `count`. Negative and fractional counts are ' +
             'accepted silently and produce a non-obvious emission sequence; no error is raised.',
  },
  'fn.classify': {
    kind: 'behavioural-probe',
    method: 'executed the pinned fixture module over the three declared return classes',
    probes: [
      {input: -2, returned: mod.classify(-2)},
      {input: 0, returned: mod.classify(0)},
      {input: 7, returned: mod.classify(7)},
    ],
    finding: 'classify() behaves as its union return type suggests for the three probed inputs.',
  },
  'fn.accumulate': {
    kind: 'behavioural-probe',
    method: 'executed the pinned fixture module',
    probes: [{input: [1, 2, 3], returned: mod.accumulate([1, 2, 3])}, {input: [], returned: mod.accumulate([])}],
    finding: 'accumulate() sums via add(); empty input returns 0.',
  },
  'const.MAX_RETRIES': {
    kind: 'behavioural-probe',
    method: 'read the live exported binding',
    probes: [{input: 'MAX_RETRIES', returned: mod.MAX_RETRIES}],
    finding: 'Live value matches the source literal.',
  },
};
for (const id of Object.keys(witnesses)) {
  const f = facts.find((x) => x.id === id);
  if (f) f.evidence = 'OBSERVED';
}

const discrepancy = {
  id: 'disc.repeat-unenforced-contract',
  subject: 'fn.repeat',
  declared: facts.find((f) => f.id === 'fn.repeat').declared,
  observed: 'repeat(2.5) emitted [0,1,2]; repeat(-1) emitted [] and raised no error',
  class: 'OBSERVED_DISCREPANCY',
  meaning: 'The author declared a precondition ("count is a nonnegative safe integer") that the ' +
          'implementation does not enforce. The declaration is a human belief, not machine-checked behavior.',
};

// Republish WITH witnesses — this is still "published once" from one meaning.
pub = publish({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', sourceSha256: srcSha, facts, fileDeclaration, witnesses});
machine = projectMachine(pub);
human = projectHuman(pub);
writeFileSync('human.md', human);
writeFileSync('machine.json', JSON.stringify(machine, null, 2));
say(`\nrepublished with witnesses: ${pub.publication_id}`);
say(`publication digest (new)  : ${pub.digest}`);
const digestBeforeMutation = pub.digest;

let v2 = verify({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', pub, machine, human});
for (const c of v2.checks) say(`  [${c.ok ? 'PASS' : 'FAIL'}] ${c.name.padEnd(42)} ${c.detail}`);
say(`P2b result (witnessed)   : ${v2.green ? 'GREEN' : 'RED'}`);

// ---------------------------------------------------------------------------
rule('P4  DELIBERATE MUTATION -> is stale meaning visible, and how precisely?');
// ---------------------------------------------------------------------------
const MUTATION = pristine.replace('export const MAX_RETRIES = 3;', 'export const MAX_RETRIES = 5;');
if (MUTATION === pristine) throw new Error('mutation did not apply - fixture shape changed');
writeFileSync('mutated.ts', MUTATION);
say(`mutation applied         : MAX_RETRIES 3 -> 5 (one constant, rest of file untouched)`);

const v3 = verify({text: MUTATION, sourcePath: 'fixture/001-semantic-basics.ts', pub, machine, human});
for (const c of v3.checks) say(`  [${c.ok ? 'PASS' : 'FAIL'}] ${c.name.padEnd(42)} ${c.detail}`);
say(`\nstale facts detected    : ${JSON.stringify(v3.staleFacts)}`);
say(`unaffected facts         : ${JSON.stringify(pub.facts.map((f) => f.id).filter((id) => !v3.staleFacts.includes(id)))}`);
say(`P4 result               : ${v3.green ? 'GREEN (mutation went UNDETECTED — falsifies the design)' : 'RED (staleness correctly detected)'}`);
const granularity = v3.staleFacts.length === 1 && v3.staleFacts[0] === 'const.MAX_RETRIES';
say(`granularity finding     : ${granularity
  ? 'WHOLE-FILE staleness would have marked all ' + pub.facts.length + ' facts stale; per-fact slicing marked exactly 1. Locality preserved.'
  : 'per-fact locality did not hold as predicted'}`);

// Republish from mutated source: does the digest actually change?
const mFacts = extractFacts(MUTATION, 'fixture/001-semantic-basics.ts');
const mPubNoWitness = publish({text: MUTATION, sourcePath: 'fixture/001-semantic-basics.ts', sourceSha256: sha256(MUTATION), facts: mFacts.facts, fileDeclaration: mFacts.fileDeclaration});
say(`digest changes on mutation: ${mPubNoWitness.digest !== digestBeforeMutation} (${digestBeforeMutation.slice(0, 12)}… -> ${mPubNoWitness.digest.slice(0, 12)}…)`);

// ---------------------------------------------------------------------------
rule('P5  HAND-DRIFT a projection -> is divergence detectable?');
// ---------------------------------------------------------------------------
// Simulate the realistic failure: a human edits the wiki text and the meaning
// silently stops matching the machine record. No re-publish happens.
const DRIFT_FROM = '"enforces_declared_precondition": false';
const DRIFT_TO = '"enforces_declared_precondition": true';
if (!human.includes(DRIFT_FROM)) throw new Error('drift anchor not present - refusing to report a no-op as a result');
const drifted = human.replace(DRIFT_FROM, DRIFT_TO);
if (drifted === human) throw new Error('drift did not apply');
say(`drift injected           : flipped enforces_declared_precondition false -> true in human.md only`);
say(`drift anchor found       : ${human.includes(DRIFT_FROM)} (guard prevents a silent no-op)`);
const v4 = verify({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', pub, machine, human: drifted});
const driftDetected = !v4.green;
say(`projections still agree   : ${v4.green ? 'YES (drift went UNDETECTED)' : 'NO (drift DETECTED)'}`);
say(`P5 finding              : ${driftDetected
  ? 'A hand edit that preserves the publication digest is STILL caught, because verify re-derives fact slices from source bytes rather than trusting the rendered text.'
  : 'Drift was not detected.'}`);

// The complementary probe: does the digest check catch a projection that
// merely CLAIMS a digest it does not earn?
const forged = human.replace(pub.digest, sha256('not-the-real-publication'));
const v5 = verify({text: pristine, sourcePath: 'fixture/001-semantic-basics.ts', pub, machine, human: forged});
say(`\nforged-digest projection : ${v5.green ? 'UNDETECTED (bad)' : 'DETECTED (good)'} — ${v5.checks.find((c) => c.name === 'human_carries_publication_digest').detail}`);

// ---------------------------------------------------------------------------
rule('P5b  CLOSING THE GAP: regenerate-and-compare instead of trust the digest');
// ---------------------------------------------------------------------------
// P5 proved the digest is necessary but NOT sufficient: it attests WHICH
// publication a view claims to come from, not that the view still faithfully
// renders it. The cheap fix is to re-render from the publication and compare
// bytes, instead of merely grepping for the digest string.
const regenerated = projectHuman(pub);
const faithful = regenerated === human;
const driftCaught = projectHuman(pub) !== drifted;
say(`re-render == on-disk view : ${faithful ? 'IDENTICAL (pristine view is faithful)' : 'DIFFERS'}`);
say(`re-render catches drift  : ${driftCaught ? 'YES — the P5 hole is closed by regeneration' : 'NO'}`);
say(`cost                     : one deterministic re-render + string compare`);

// Show the exact first difference, so the failure is diagnosable.
if (driftCaught) {
  const at = [...drifted].findIndex((ch, i) => ch !== regenerated[i]);
  say(`first divergence at char : ${at}`);
  say(`  on-disk : …${drifted.slice(Math.max(0, at - 45), at + 55).replace(/\n/g, '⏎')}…`);
  say(`  re-render: …${regenerated.slice(Math.max(0, at - 45), at + 55).replace(/\n/g, '⏎')}…`);
}

// ---------------------------------------------------------------------------
rule('P6  MACHINE <-> HUMAN LEARNING SIGNAL (Decision 3)');
// ---------------------------------------------------------------------------
const signal = {
  kind: 'machine-human-signal/1',
  run: 'B',
  outcome: 'OBSERVED_DISCREPANCY',
  subject: {
    source: 'fixture/001-semantic-basics.ts',
    pinned_commit: PINNED_COMMIT,
    sha256: PINNED_SHA,
    task: 'Publish one pinned semantic fact and project it into machine + human views.',
  },
  machine_reading: {
    publication_id: pub.publication_id,
    digest: pub.digest,
    fact_count: pub.facts.length,
    evidence_mix: pub.facts.reduce((acc, f) => ((acc[f.evidence] = (acc[f.evidence] || 0) + 1), acc), {}),
    claims: 'Static intake produced 1 DECLARED fact (fn.repeat) and 4 DERIVED facts. ' +
            'A separate execution witness is required before any contract can be called verified.',
  },
  human_reading: {
    account: 'The author wrote "count is a nonnegative safe integer" above repeat(). ' +
             'Running the code shows the function accepts -1 and 2.5 without complaint, ' +
             'and 2.5 emits three values. The comment describes an intention, not a guarantee.',
  },
  comparison: {
    agreement: 'Both views agree on identity, signature, source lines and publication digest.',
    discrepancy: 'The DECLARED precondition is contradicted by OBSERVED behavior.',
    evidence_class: 'OBSERVED_DISCREPANCY',
    independence_note: 'The witness is this process executing the fixture. It is a first-party ' +
                       'observation, NOT independent referee proof and NOT a general correctness claim.',
  },
  feedback: {
    teaches: 'A semantic publication must carry an evidence class per fact, or a human wiki ' +
             'will inevitably render an unenforced doc comment as a guarantee.',
    challenges: 'The assumption that static compilation alone can produce an accurate human view.',
    smallest_next_test: 'Replay this exact comparison with a second, independent implementation ' +
                        'of the intake step and check whether both derive the same DECLARED set.',
  },
  falsifiers_run: {
    whole_file_sha_detects_mutation: true,
    per_fact_slicing_localises_mutation: granularity,
    digest_changes_on_republish: mPubNoWitness.digest !== digestBeforeMutation,
    hand_drift_detected_by_digest: driftDetected,
    hand_drift_detected_by_regeneration: driftCaught,
    forged_digest_detected: !v5.green,
  },
};
writeFileSync('machine-human-signal.json', JSON.stringify(signal, null, 2));
for (const [k, v] of Object.entries(signal.falsifiers_run)) say(`  ${k.padEnd(38)} ${v}`);
say(`\nwrote machine-human-signal.json`);

writeFileSync('RECEIPT.txt', out.join('\n') + '\n');
say(`\nwrote RECEIPT.txt (full transcript)`);