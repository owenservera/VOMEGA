// Capability census with direct proof. Labels on page one of every report are DERIVED here from evidence by fixed
// rules — never chosen by the agent ("wrapper-computed basis, not model-asserted", applied to the team itself).
//
//   node team/tools/census.mjs probe        <roundDir>                         # scriptable probes -> census/*.txt + CENSUS.json
//   node team/tools/census.mjs record       <roundDir> <cap> <verified|unsupported|unknown> <evidenceFile> ["note"]
//   node team/tools/census.mjs nonce-new    <roundDir> <label>                 # prints a nonce ONCE; stores only its sha256
//   node team/tools/census.mjs nonce-check  <roundDir> <label> <answerFile>    # did the other context know the nonce?
//   node team/tools/census.mjs overlap      <roundDir> <a.json> <b.json>       # {start,end} ISO times from two sub-agents
//   node team/tools/census.mjs persist-check <roundDir> [<previousRoundDir>]   # next turn: did the marker survive?
//   node team/tools/census.mjs derive       <roundDir>                         # computes the labels into CENSUS.json
//
// Protocols for what a script cannot probe (the agent runs them and records the evidence files):
//  * SUB-AGENT SEPARATE CONTEXT: `nonce-new <r> subagent_separate_context` (the nonce is now only in YOUR context),
//    spawn a sub-agent, ask it to write any nonce/secret it knows to census/answer-subagent.txt, then
//    `nonce-check <r> subagent_separate_context census/answer-subagent.txt`. Knowing the nonce = shared context.
//  * EVALUATOR FRESH CONTEXT: same with label evaluator_fresh_context, using the context that will evaluate.
//  * PARALLELISM: start two sub-agents at once; each writes {"start":<ISO>, ... sleeps ~20s ..., "end":<ISO>} to its
//    own file; `overlap <r> a.json b.json`. Overlapping intervals = parallel_subagents verified.
//  * CROSS-READ DENIAL: from inside a sub-agent, try to read a file in a sibling directory; save the raw output;
//    `record <r> cross_read_denied verified|unsupported <file>`.
import { writeFileSync, readFileSync, mkdirSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const sha = s => createHash('sha256').update(s).digest('hex');
export const CAPABILITIES = [
  'shell', 'node', 'npm', 'git', 'sqlite', 'package_install', 'local_web_server', 'headless_browser',
  'rust_toolchain', 'tauri_cli', 'fullstack_template',
  'subagents', 'subagent_separate_context', 'parallel_subagents', 'cross_read_denied',
  'evaluator_fresh_context', 'live_model_session', 'state_persists_between_turns',
];
const STATUSES = ['verified', 'unsupported', 'unknown'];

const censusPath = r => join(r, 'CENSUS.json');
function load(r) {
  if (existsSync(censusPath(r))) return JSON.parse(readFileSync(censusPath(r), 'utf8'));
  return { round: r.split(/[\\/]/).filter(Boolean).at(-1), items: CAPABILITIES.map(c => ({ capability: c, status: 'unknown', evidence: null, note: 'not probed' })) };
}
function save(r, c) { writeFileSync(censusPath(r), `${JSON.stringify(c, null, 2)}\n`); }
function setItem(c, capability, status, evidence, note = '') {
  if (!STATUSES.includes(status)) throw new Error(`status must be ${STATUSES.join('|')}`);
  const i = c.items.findIndex(x => x.capability === capability);
  const item = { capability, status, evidence, note };
  if (i >= 0) c.items[i] = item; else c.items.push(item);
}

function run(cmd, { timeout = 30_000, cwd } = {}) {
  const r = spawnSync('sh', ['-c', cmd], { encoding: 'utf8', timeout, cwd });
  return { cmd, exit: r.status, signal: r.signal, stdout: r.stdout ?? '', stderr: r.stderr ?? '', error: r.error?.message };
}
function rawFile(r, name, results) {
  mkdirSync(join(r, 'census'), { recursive: true });
  const rel = `census/${name}.txt`;
  const text = results.map(x => `$ ${x.cmd}\n[exit ${x.exit}${x.signal ? ` signal ${x.signal}` : ''}${x.error ? ` error ${x.error}` : ''}]\n${x.stdout}${x.stderr ? `\n[stderr]\n${x.stderr}` : ''}`).join('\n----\n');
  writeFileSync(join(r, rel), `# census probe: ${name} @ ${new Date().toISOString()}\n${text}\n`);
  return rel;
}

export async function probe(r) {
  mkdirSync(join(r, 'census'), { recursive: true });
  const c = load(r);
  const simple = [
    ['shell', 'uname -a; echo "shell=$0"; id -u'],
    ['node', 'node --version'],
    ['npm', 'npm --version'],
    ['git', 'git --version'],
    ['rust_toolchain', 'cargo --version && rustc --version'],
    ['tauri_cli', 'cargo tauri --version'],
  ];
  for (const [cap, cmd] of simple) {
    const x = run(cmd); const ev = rawFile(r, cap, [x]);
    setItem(c, cap, x.exit === 0 ? 'verified' : 'unsupported', ev, x.exit === 0 ? x.stdout.trim().split('\n')[0] : 'command failed');
  }
  { // sqlite: CLI or node:sqlite
    const a = run('sqlite3 --version');
    const b = run(`node -e "const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync(':memory:');console.log('node:sqlite', d.prepare('select 41+1 as x').get().x)"`);
    const ok = a.exit === 0 || (b.exit === 0 && b.stdout.includes('42'));
    setItem(c, 'sqlite', ok ? 'verified' : 'unsupported', rawFile(r, 'sqlite', [a, b]), a.exit === 0 ? 'sqlite3 CLI' : b.exit === 0 ? 'node:sqlite' : 'none');
  }
  { // package install from the standard registry
    const tmp = mkdtempSync(join(tmpdir(), 'census-npm-'));
    const x = run(`npm install --no-save --no-audit --no-fund --prefix "${tmp}" is-number@7.0.0 && node -e "console.log(require('${tmp}/node_modules/is-number')(5))"`, { timeout: 120_000 });
    rmSync(tmp, { recursive: true, force: true });
    setItem(c, 'package_install', x.exit === 0 && x.stdout.includes('true') ? 'verified' : 'unsupported', rawFile(r, 'package_install', [x]), 'npm install is-number@7.0.0 into a temp prefix');
  }
  { // local web server + fetch
    const lines = [];
    try {
      const srv = createServer((q, s) => { s.end('census-ok'); });
      await new Promise(res => srv.listen(0, '127.0.0.1', res));
      const port = srv.address().port;
      const body = await (await fetch(`http://127.0.0.1:${port}/`)).text();
      srv.close();
      lines.push({ cmd: `http.createServer on 127.0.0.1:${port}; fetch /`, exit: body === 'census-ok' ? 0 : 1, stdout: body, stderr: '' });
    } catch (e) { lines.push({ cmd: 'http.createServer + fetch', exit: 1, stdout: '', stderr: e.message }); }
    setItem(c, 'local_web_server', lines[0].exit === 0 ? 'verified' : 'unsupported', rawFile(r, 'local_web_server', lines));
  }
  { // headless browser: find an executable and render a data: URL
    const find = run('for b in chromium chromium-browser google-chrome google-chrome-stable; do command -v $b; done; ls -d ${PLAYWRIGHT_BROWSERS_PATH:-/nonexistent}/*/chrome-linux/chrome 2>/dev/null; ls -d /opt/pw-browsers/*/chrome-linux/chrome 2>/dev/null; true');
    const exe = find.stdout.split('\n').map(s => s.trim()).filter(Boolean)[0];
    const results = [find];
    let ok = false;
    if (exe) {
      const x = run(`"${exe}" --headless=new --no-sandbox --disable-gpu --dump-dom "data:text/html,<p>census-dom-ok</p>"`, { timeout: 30_000 });
      results.push(x); ok = x.stdout.includes('census-dom-ok');
    }
    setItem(c, 'headless_browser', ok ? 'verified' : 'unsupported', rawFile(r, 'headless_browser', results), exe ? `executable ${exe}` : 'no browser executable found; drive Cockpit E2E over HTTP');
  }
  { // same-user filesystem: can one process read a sibling directory? (default expectation: yes)
    const base = mkdtempSync(join(tmpdir(), 'census-xread-'));
    mkdirSync(join(base, 'armX')); mkdirSync(join(base, 'armY'));
    writeFileSync(join(base, 'armY', 'secret.txt'), 'sibling-content');
    const x = run(`node -e "console.log(require('fs').readFileSync('../armY/secret.txt','utf8'))"`, { cwd: join(base, 'armX') });
    rmSync(base, { recursive: true, force: true });
    const readOk = x.exit === 0 && x.stdout.includes('sibling-content');
    setItem(c, 'cross_read_denied', readOk ? 'unsupported' : 'unknown', rawFile(r, 'cross_read_denied', [x]),
      readOk ? 'sibling read SUCCEEDED from a child process of this agent; re-test from inside an arm sub-agent if sub-agents exist' : 'script-level read failed for another reason; test from an arm context');
  }
  { // persistence marker for the next turn
    const marker = { nonce: randomBytes(8).toString('hex'), written_at: new Date().toISOString() };
    writeFileSync(join(r, 'census', 'persist-marker.json'), JSON.stringify(marker));
    setItem(c, 'state_persists_between_turns', 'unknown', 'census/persist-marker.json', 'next turn: census.mjs persist-check <newRoundDir> <thisRoundDir>');
  }
  for (const cap of ['fullstack_template', 'subagents', 'subagent_separate_context', 'parallel_subagents', 'evaluator_fresh_context', 'live_model_session']) {
    const it = c.items.find(i => i.capability === cap);
    if (!it || it.note === 'not probed') setItem(c, cap, 'unknown', null, 'not scriptable — run the protocol in census.mjs header and `record` the evidence');
  }
  save(r, c);
  return { ok: true, items: c.items.map(i => `${i.capability}=${i.status}`) };
}

export function record(r, cap, status, evidence, note = '') {
  if (!CAPABILITIES.includes(cap)) throw new Error(`unknown capability ${cap}; known: ${CAPABILITIES.join(', ')}`);
  if (status === 'verified') {
    const p = isAbsolute(evidence) ? evidence : join(r, evidence);
    if (!evidence || !existsSync(p) || statSync(p).size === 0) throw new Error(`verified needs an existing, non-empty evidence file (got ${evidence})`);
  }
  const c = load(r); setItem(c, cap, status, evidence, note); save(r, c);
  return { ok: true, capability: cap, status };
}

export function nonceNew(r, label) {
  if (!CAPABILITIES.includes(label)) throw new Error(`label must be a capability name (e.g. subagent_separate_context, evaluator_fresh_context)`);
  const nonce = randomBytes(16).toString('hex');
  mkdirSync(join(r, 'census'), { recursive: true });
  writeFileSync(join(r, 'census', `nonce-${label}.sha256`), `${sha(nonce)}\n`);
  return { label, nonce, note: 'Keep this ONLY in your context. Do not write it to disk. Ask the other context what nonce it knows.' };
}

export function nonceCheck(r, label, answerFile) {
  const want = readFileSync(join(r, 'census', `nonce-${label}.sha256`), 'utf8').trim();
  const answer = readFileSync(isAbsolute(answerFile) ? answerFile : join(r, answerFile), 'utf8');
  const known = (answer.match(/[0-9a-f]{32}/gi) ?? []).some(t => sha(t.toLowerCase()) === want);
  const verdict = known ? 'SHARED_CONTEXT' : 'SEPARATE_CONTEXT';
  const ev = `census/nonce-${label}.result.txt`;
  writeFileSync(join(r, ev), `label=${label}\nanswer_file=${answerFile}\nanswer_sha256=${sha(answer)}\ncommitted_nonce_sha256=${want}\nverdict=${verdict}\n`);
  const c = load(r); setItem(c, label, known ? 'unsupported' : 'verified', ev, verdict); save(r, c);
  return { ok: true, label, verdict };
}

export function overlap(r, a, b) {
  const rd = p => JSON.parse(readFileSync(isAbsolute(p) ? p : join(r, p), 'utf8'));
  const A = rd(a), B = rd(b);
  const [s1, e1, s2, e2] = [A.start, A.end, B.start, B.end].map(Date.parse);
  if ([s1, e1, s2, e2].some(Number.isNaN)) throw new Error('both files need ISO start/end');
  const ov = Math.min(e1, e2) - Math.max(s1, s2);
  const ev = 'census/parallel-overlap.txt';
  writeFileSync(join(r, ev), `a=${a} ${A.start}..${A.end}\nb=${b} ${B.start}..${B.end}\noverlap_ms=${ov}\n`);
  const c = load(r); setItem(c, 'parallel_subagents', ov > 0 ? 'verified' : 'unsupported', ev, `overlap ${ov} ms`); save(r, c);
  return { ok: true, overlap_ms: ov, parallel: ov > 0 };
}

export function persistCheck(r, prev) {
  const p = join(prev ?? r, 'census', 'persist-marker.json');
  const ok = existsSync(p);
  const ev = 'census/persist-check.txt';
  mkdirSync(join(r, 'census'), { recursive: true });
  writeFileSync(join(r, ev), `marker=${p}\nexists=${ok}\n${ok ? readFileSync(p, 'utf8') : ''}\n`);
  const c = load(r); setItem(c, 'state_persists_between_turns', ok ? 'verified' : 'unsupported', ev); save(r, c);
  return { ok: true, persists: ok };
}

/** Fixed derivation rules. A `verified` item whose evidence file is missing/empty counts as unknown. */
export function deriveFrom(census, roundDir = null) {
  const status = cap => {
    const it = census.items.find(i => i.capability === cap);
    if (!it) return 'unknown';
    if (it.status === 'verified' && roundDir) {
      const p = it.evidence && (isAbsolute(it.evidence) ? it.evidence : join(roundDir, it.evidence));
      if (!p || !existsSync(p) || statSync(p).size === 0) return 'unknown';
    }
    return it.status;
  };
  const v = cap => status(cap) === 'verified';
  const subagentsOk = v('subagents') && v('subagent_separate_context');
  const isolation = subagentsOk && v('cross_read_denied') ? 'PROCESS_SEPARATED' : subagentsOk ? 'SHARED_FS_HONOR_SYSTEM' : 'SIMULATED';
  const independence = v('evaluator_fresh_context') ? 'FULL' : 'DEGRADED';
  const adapter = v('live_model_session') ? 'LIVE' : subagentsOk ? 'SUB-AGENT' : 'SCRIPTED';
  const parallel = subagentsOk && v('parallel_subagents') ? 'parallel' : 'sequential';
  const label = isolation !== 'SIMULATED' && independence === 'FULL' ? 'MEASURED-CAPABLE' : 'PROCESS REHEARSAL';
  return {
    isolation_strength: isolation, independence, track_b_adapter: adapter, arms_execution: parallel,
    selection_basis: independence === 'FULL' ? 'total' : 'mechanical',
    track_b_cognitive_hypothesis: adapter === 'SCRIPTED' ? 'UNTESTED (scripted consults measure protocol overhead only)' : 'TESTABLE',
    cockpit_e2e_mode: v('headless_browser') ? 'browser-or-http' : 'http-only',
    c4_surface: v('rust_toolchain') && v('tauri_cli') ? 'tauri-possible' : 'web-panel (UI_BLOCKED:tauri)',
    label,
    rules: 'PROCESS_SEPARATED needs subagents+separate_context+cross_read_denied; SHARED_FS needs subagents+separate_context; FULL independence needs evaluator_fresh_context; MEASURED-CAPABLE needs isolation!=SIMULATED and FULL.',
  };
}

export function derive(r) {
  const c = load(r); c.derived = deriveFrom(c, r); c.derived_at = new Date().toISOString(); save(r, c);
  return { ok: true, ...c.derived };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [cmd, r, a, b, d] = process.argv.slice(2);
  try {
    let out;
    if (cmd === 'probe') out = await probe(r);
    else if (cmd === 'record') out = record(r, a, b, d, process.argv[7] ?? '');
    else if (cmd === 'nonce-new') out = nonceNew(r, a);
    else if (cmd === 'nonce-check') out = nonceCheck(r, a, b);
    else if (cmd === 'overlap') out = overlap(r, a, b);
    else if (cmd === 'persist-check') out = persistCheck(r, a);
    else if (cmd === 'derive') out = derive(r);
    else { console.error('usage: census.mjs probe|record|nonce-new|nonce-check|overlap|persist-check|derive <roundDir> ...'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2));
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
