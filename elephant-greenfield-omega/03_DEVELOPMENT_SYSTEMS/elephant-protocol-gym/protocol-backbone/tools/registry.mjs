// Dependency-free lab registry validator.
//
// WHAT THIS IS: it checks that the registered protocol/run index agrees with what is
// actually on disk — that every registered run exists, that every receipt parses and
// carries the schema's required fields, that registry status and receipt status agree,
// that every artifact hash in a receipt still matches its file, and that every declared
// entry point still exists.
//
// WHAT THIS IS NOT: it is not a JSON-Schema interpreter, not a correctness oracle, not an
// executor, and not a judge of whether any claim is true. It cannot tell a false claim
// from a true one — only whether the record is internally consistent with the filesystem.
//
// It ships with negative controls (`--negative-control`) because a validator that has
// only ever returned green has demonstrated nothing.
//
// Usage (from protocol-backbone/):
//   node tools/registry.mjs
//   node tools/registry.mjs --json
//   node tools/registry.mjs --negative-control
import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const backbone = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gymRoot = resolve(backbone, '..');
const sha256 = buf => createHash('sha256').update(buf).digest('hex');
const readJSON = p => JSON.parse(readFileSync(p, 'utf8'));

const RUN_STATUS = new Set(['NOT_RUN', 'BLOCKED', 'RUNNING', 'SEALED', 'EVALUATED', 'CLOSED', 'UNKNOWN_TERMINAL']);
const ROUND = new Set(['R0_ARM', 'R1_REVIEWER', 'PASS']);
const INDEPENDENCE = new Set(['BLIND_DISCOVERY', 'LEGACY_SEEDED', 'PARTIAL_CONTAMINATION', 'PROCESS_REHEARSAL', 'ADJUDICATION']);
const RECEIPT_REQUIRED = ['schema', 'run_id', 'protocol_id', 'protocol_version', 'status', 'basis', 'claims', 'events', 'artifacts', 'metrics', 'publication'];
const BASIS_REQUIRED = ['git_sha', 'protocol_sha256', 'requirement_epoch', 'fixture_sha256'];

// An entry point is a command line ("node oracle.mjs --check"). We care whether the FILE it
// invokes still exists, so drop any interpreter prefix and everything from the first flag on.
const INTERPRETERS = new Set(['node', 'bash', 'sh', 'pwsh', 'powershell', 'bun', 'python', 'python3']);
function entryPointFile(cmd) {
  const parts = String(cmd).trim().split(/\s+/).filter(Boolean);
  while (parts.length && INTERPRETERS.has(parts[0])) parts.shift();
  const first = parts[0] ?? '';
  // stop at the first token that is itself a flag (e.g. a bare "-c" script)
  return first.startsWith('-') ? '' : first;
}

export function validateRegistry({root = backbone, registry = null, receiptOverrides = {}} = {}) {
  const errors = [], warnings = [], checked = {protocols: 0, assets: 0, runs: 0, artifacts: 0, receipts: 0};
  const regPath = join(root, 'registry.json');
  if (!registry && !existsSync(regPath)) return {ok: false, errors: ['registry.json not found'], warnings, checked};
  const reg = registry ?? readJSON(regPath);

  if (reg.schema !== 'epg.registry/0.2') errors.push(`registry schema mismatch: ${reg.schema} (expected epg.registry/0.2)`);
  for (const k of ['schema', 'version', 'protocols', 'assets', 'runs']) {
    if (reg[k] === undefined) errors.push(`registry missing required field ${k}`);
  }

  // --- protocols: every declared card must exist and be internally consistent ---
  const cardIds = new Set();
  for (const [i, p] of (reg.protocols ?? []).entries()) {
    checked.protocols++;
    if (cardIds.has(p.id)) errors.push(`protocol duplicate id ${p.id} at ${i}`);
    cardIds.add(p.id);
    if (!p.path || p.path.startsWith('/') || p.path.split('/').includes('..')) { errors.push(`unsafe protocol path ${p.path}`); continue; }
    const full = join(root, p.path);
    if (!existsSync(full)) { errors.push(`missing protocol card ${p.path}`); continue; }
    const card = readJSON(full);
    if (card.id !== p.id) errors.push(`${p.path}: ID mismatch (registry ${p.id} vs card ${card.id})`);
  }

  // --- assets: duplicate ids are a real loss risk, not a style issue ---
  const assetIds = new Set();
  for (const [i, a] of (reg.assets ?? []).entries()) {
    checked.assets++;
    if (assetIds.has(a.id)) errors.push(`asset duplicate id ${a.id} at ${i}`);
    assetIds.add(a.id);
    for (const pid of a.mapped_to ?? []) {
      if (!cardIds.has(pid)) warnings.push(`asset ${a.id} maps to unknown protocol ${pid}`);
    }
  }

  // --- runs: this is the fleet layer. Every claim here is cross-checked against disk. ---
  const seenRunIds = new Set();
  for (const [i, r] of (reg.runs ?? []).entries()) {
    checked.runs++;
    const at = `runs[${i}] ${r.id ?? '<no id>'}`;
    if (!r.id || seenRunIds.has(r.id)) errors.push(`${at}: missing or duplicate run id`);
    seenRunIds.add(r.id);
    for (const k of ['id', 'dir', 'status', 'round', 'role', 'receipt']) {
      if (r[k] === undefined || r[k] === '') errors.push(`${at}: missing required field ${k}`);
    }
    if (!RUN_STATUS.has(r.status)) errors.push(`${at}: invalid status ${r.status}`);
    if (!ROUND.has(r.round)) errors.push(`${at}: invalid round ${r.round}`);
    if (r.independence && !INDEPENDENCE.has(r.independence)) errors.push(`${at}: invalid independence ${r.independence}`);

    const dir = join(gymRoot, r.dir ?? '');
    if (!r.dir || !existsSync(dir)) { errors.push(`${at}: run directory not found (${r.dir})`); continue; }

    // entry points must still exist — a receipt pointing at a deleted script is a broken promise
    for (const cmd of r.entry_points ?? []) {
      const file = entryPointFile(cmd);
      if (file && !existsSync(join(dir, file))) errors.push(`${at}: entry point missing: ${file} (from "${cmd}")`);
    }

    const receiptPath = join(gymRoot, r.receipt ?? '');
    let receipt;
    // receiptOverrides lets a caller swap one receipt in memory. Tests use it to falsify a
    // single field without touching disk, so concurrent tests cannot corrupt each other.
    if (Object.prototype.hasOwnProperty.call(receiptOverrides, r.receipt)) {
      receipt = receiptOverrides[r.receipt];
    } else {
      if (!existsSync(receiptPath)) { errors.push(`${at}: receipt not found (${r.receipt})`); continue; }
      try { receipt = readJSON(receiptPath); } catch (e) { errors.push(`${at}: receipt is not valid JSON (${e.message})`); continue; }
    }
    checked.receipts++;

    for (const k of RECEIPT_REQUIRED) if (receipt[k] === undefined) errors.push(`${at}: receipt missing ${k}`);
    if (receipt.schema !== 'epg.run/0.1') errors.push(`${at}: receipt schema mismatch ${receipt.schema}`);
    // The registry and the receipt must not disagree about status. Disagreement is an error, not a preference.
    if (receipt.status !== r.status) errors.push(`${at}: status disagreement — registry says ${r.status}, receipt says ${receipt.status}`);

    for (const k of BASIS_REQUIRED) {
      if (receipt.basis?.[k] === undefined) errors.push(`${at}: receipt basis.${k} missing`);
    }
    if (r.git_sha && receipt.basis?.git_sha && r.git_sha !== receipt.basis.git_sha) {
      errors.push(`${at}: git_sha disagreement — registry ${r.git_sha} vs receipt ${receipt.basis.git_sha}`);
    }

    // Every non-DESIGN claim must declare how it was witnessed. This is the whole point
    // of witness_provenance: "executed:true" in an artifact is otherwise unfalsifiable.
    for (const [ci, c] of (receipt.claims ?? []).entries()) {
      if (!c.statement) errors.push(`${at}: claim ${ci} has no statement`);
      if (c.evidence_class !== 'DESIGN' && !c.witness_provenance) {
        errors.push(`${at}: claim ${ci} is ${c.evidence_class} with no witness_provenance`);
      }
    }

    // Artifact custody: re-hash every file the receipt attests. This is the check that
    // makes a receipt worth anything — it detects silent artifact mutation.
    for (const [ai, a] of (receipt.artifacts ?? []).entries()) {
      if (!a.uri) { errors.push(`${at}: artifact ${ai} has no uri`); continue; }
      const full = join(gymRoot, a.uri);
      if (!existsSync(full)) { errors.push(`${at}: artifact ${ai} missing on disk: ${a.uri}`); continue; }
      checked.artifacts++;
      const buf = readFileSync(full);
      if (a.sha256 && sha256(buf) !== a.sha256) errors.push(`${at}: artifact ${ai} HASH CHANGED: ${a.uri}`);
      if (typeof a.bytes === 'number' && buf.length !== a.bytes) errors.push(`${at}: artifact ${ai} size changed: ${a.uri}`);
    }

    // Every run directory must be registered. An unregistered run is invisible to the fleet.
    if (!existsSync(join(dir, 'run.json'))) errors.push(`${at}: run directory has no minted receipt (run tools/mint-receipt.mjs)`);
  }

  return {ok: errors.length === 0, errors, warnings, checked};
}

// --- negative controls -------------------------------------------------------
// Each control mutates a property IN MEMORY and asserts the validator notices. Without
// these, the green result above would be unfalsifiable. Nothing here writes to disk.
function negativeControls() {
  const base = readJSON(join(backbone, 'registry.json'));
  const results = [];
  const clone = () => JSON.parse(JSON.stringify(base));
  const receiptOf = reg => readJSON(join(gymRoot, reg.runs[0].receipt));

  const probe = (label, {mutateRegistry, mutateReceipt}, expectFail) => {
    const reg = clone();
    if (mutateRegistry) mutateRegistry(reg);
    const overrides = {};
    if (mutateReceipt) overrides[reg.runs[0].receipt] = mutateReceipt(receiptOf(reg));
    const r = validateRegistry({registry: reg, receiptOverrides: overrides});
    const observed = r.ok ? 'PASS' : 'FAIL';
    const expected = expectFail ? 'FAIL' : 'PASS';
    results.push({label, expected, observed, discriminated: observed === expected});
  };

  // P1: an unmutated copy must PASS — a control set with no clean case proves nothing.
  probe('P1 unmutated registry passes', {}, false);

  // N1: a run directory that does not exist
  probe('N1 missing run directory -> FAIL', {mutateRegistry: r => { r.runs[0].dir = 'runs/DOES-NOT-EXIST'; }}, true);
  // N2: registry and receipt disagree about status
  probe('N2 status disagreement -> FAIL', {mutateRegistry: r => { r.runs[0].status = 'NOT_RUN'; }}, true);
  // N3: an artifact hash that no longer matches its file
  probe('N3 falsified artifact hash -> FAIL', {mutateReceipt: rec => { rec.artifacts[0].sha256 = '0'.repeat(64); return rec; }}, true);
  // N4: a non-DESIGN claim stripped of its witness_provenance
  probe('N4 measured claim without witness_provenance -> FAIL', {mutateReceipt: rec => {
    const i = rec.claims.findIndex(c => c.evidence_class !== 'DESIGN');
    delete rec.claims[i].witness_provenance;
    return rec;
  }}, true);
  // N5: an entry point that no longer exists
  probe('N5 missing entry point -> FAIL', {mutateRegistry: r => { r.runs[0].entry_points = ['node no-such-script.mjs']; }}, true);
  // N6: a run id duplicated — a fleet that indexes the same run twice is lying about its size
  probe('N6 duplicate run id -> FAIL', {mutateRegistry: r => { r.runs.push(clone().runs[0]); }}, true);
  // N7: a protocol card deleted from disk
  probe('N7 missing protocol card -> FAIL', {mutateRegistry: r => { r.protocols[0].path = 'protocols/deleted-card.json'; }}, true);
  // N8: an invalid enum value
  probe('N8 invalid status enum -> FAIL', {mutateRegistry: r => { r.runs[0].status = 'DEFINITELY_DONE'; }}, true);
  // N9: an artifact deleted from disk
  probe('N9 artifact missing on disk -> FAIL', {mutateReceipt: rec => { rec.artifacts[0].uri = 'runs/A-2026-10-12/definitely-not-here.json'; return rec; }}, true);
  // N10: a stale schema version
  probe('N10 stale registry schema -> FAIL', {mutateRegistry: r => { r.schema = 'epg.registry/0.1'; }}, true);
  // P2: the guard must NOT over-reach — a DESIGN claim legitimately has no witness.
  probe('P2 DESIGN claim without provenance still passes', {mutateReceipt: rec => {
    rec.claims.push({statement: 'a pure design proposal', evidence_class: 'DESIGN'});
    return rec;
  }}, false);

  const passed = results.filter(r => r.discriminated).length;
  return {results, passed, total: results.length, ok: passed === results.length};
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--negative-control')) {
    const r = negativeControls();
    for (const c of r.results) console.log(`  [${c.discriminated ? 'OK  ' : 'FAIL'}] ${c.label} (expected ${c.expected}, observed ${c.observed})`);
    console.log(`\n${r.passed}/${r.total} negative controls discriminate.`);
    if (!r.ok) process.exitCode = 1;
    return;
  }
  const r = validateRegistry();
  if (argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(`ok: ${r.ok}`);
    console.log(`  runs registered: ${r.checked.runs}`);
    console.log(`  receipts parsed: ${r.checked.receipts}`);
    console.log(`  artifacts rehashed: ${r.checked.artifacts}`);
    console.log(`  protocol cards: ${r.checked.protocols}   assets: ${r.checked.assets}`);
    console.log(`  errors: ${r.errors.length}   warnings: ${r.warnings.length}`);
    for (const e of r.errors) console.log(`  [ERROR] ${e}`);
    for (const w of r.warnings) console.log(`  [WARN] ${w}`);
    if (r.ok) console.log('\nRegistry agrees with disk. This says the record is CONSISTENT, not that any claim is true.');
  }
  if (!r.ok) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main();