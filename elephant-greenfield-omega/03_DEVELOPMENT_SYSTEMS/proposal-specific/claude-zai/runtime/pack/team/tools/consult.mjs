// TRACK B ONLY — consult harness over the ECP v0.2 kernel (journal + citation verification against Git blobs).
// Not a neutral utility (it embodies Track B's method), so it is never copied into consolidated/.
// Everything it writes lives under <armDir>/process/, which evaluator staging strips (the evaluator stays track-blind).
//
//   node pack/team/tools/consult.mjs init    <armDir>                       # make product/ a Git repo + baseline commit
//   node pack/team/tools/consult.mjs commit  <armDir> "<message>"           # commit product/ (anchors are verified at a commit)
//   node pack/team/tools/consult.mjs log     <armDir> '<consult json>'      # record one consult; citations verified at HEAD
//   node pack/team/tools/consult.mjs outcome <armDir> <findingId> acted|false_positive|ignored "<note>"
//   node pack/team/tools/consult.mjs stats   <armDir>                       # -> ecp_usage block for ARM_RESULT.json
//
// consult json: { regime:"plan-review"|"diff-review", kind:"ASK"|"REVIEW"|"IMPACT", adapter:"SCRIPTED"|"SUB-AGENT"|"LIVE",
//                 question:"...", findings:[{ id:"F1", verdict:"OK"|"DEFECT"|"RISK"|"UNKNOWN", claim:"...",
//                 anchors:[{ path:"src/c1/plan.mjs", start_line:10, end_line:12, quote:"..." }] }] }
// Adapter honesty: SCRIPTED = the arm wrote the "consultant's" answer itself (protocol mechanics only, no cognitive
// claim); SUB-AGENT = a separate context proven by the census nonce test; LIVE = a separate model session (census).
// Anchor paths are relative to product/. Citations are checked by the kernel's verifyFinding at the logged commit:
// VERIFIED (quote matches) | LOCATED (lines exist, no quote) | INVALID | UNANCHORED.
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const kernel = p => pathToFileURL(join(here, '..', '..', 'outputs', 'claude', 'kernel', p)).href;
const { Journal } = await import(kernel('journal.mjs'));
const { Git } = await import(kernel('git.mjs'));
const { verifyFinding } = await import(kernel('capsule.mjs'));

const REGIMES = ['plan-review', 'diff-review'];
const KINDS = ['ASK', 'REVIEW', 'IMPACT'];
const ADAPTERS = ['SCRIPTED', 'SUB-AGENT', 'LIVE'];
const VERDICTS = ['OK', 'DEFECT', 'RISK', 'UNKNOWN'];
const OUTCOMES = ['acted', 'false_positive', 'ignored'];
const g = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const product = arm => join(arm, 'product');
const journal = arm => { mkdirSync(join(arm, 'process'), { recursive: true }); return new Journal(join(arm, 'process', 'consults.jsonl')); };
const withJ = (arm, fn) => { const j = journal(arm); try { return fn(j); } finally { j.close(); } };

export function init(arm) {
  const p = product(arm);
  if (!existsSync(p)) throw new Error(`${p} missing: the controller provisions product/ from the baseline`);
  if (!existsSync(join(p, '.git'))) g(p, 'init', '-q');
  g(p, 'add', '-A');
  try { g(p, '-c', 'user.email=arm@omega.local', '-c', 'user.name=arm', 'commit', '-qm', 'baseline', '--allow-empty'); } catch { /* nothing to commit */ }
  return { ok: true, head: g(p, 'rev-parse', 'HEAD') };
}

export function commit(arm, message) {
  const p = product(arm); g(p, 'add', '-A');
  try { g(p, '-c', 'user.email=arm@omega.local', '-c', 'user.name=arm', 'commit', '-qm', message || 'work'); } catch { /* clean tree */ }
  return { ok: true, head: g(p, 'rev-parse', 'HEAD') };
}

export function log(arm, c) {
  const errs = [];
  if (!REGIMES.includes(c.regime)) errs.push(`regime ∈ ${REGIMES}`);
  if (!KINDS.includes(c.kind)) errs.push(`kind ∈ ${KINDS}`);
  if (!ADAPTERS.includes(c.adapter)) errs.push(`adapter ∈ ${ADAPTERS}`);
  if (typeof c.question !== 'string' || !c.question.trim()) errs.push('question required');
  if (!Array.isArray(c.findings)) errs.push('findings[] required (may be empty)');
  for (const f of c.findings ?? []) if (!/^[A-Za-z0-9_-]{1,32}$/.test(f.id ?? '') || !VERDICTS.includes(f.verdict) || typeof f.claim !== 'string') errs.push(`finding ${f.id}: id, verdict ∈ ${VERDICTS}, claim required`);
  if (errs.length) throw new Error(`invalid consult: ${errs.join('; ')}`);
  const git = new Git(product(arm));
  const basis = git.revParse('HEAD');
  const findings = c.findings.map(f => ({ ...f, ...verifyFinding(git, basis, f) }));
  return withJ(arm, j => {
    const known = new Set(j.events.filter(e => e.type === 'CONSULT').flatMap(e => e.body.findings.map(f => f.id)));
    const dup = findings.find(f => known.has(f.id)); if (dup) throw new Error(`finding id ${dup.id} already used`);
    const ev = j.append('CONSULT', { regime: c.regime, kind: c.kind, adapter: c.adapter, question: c.question, basis_sha: basis, findings });
    return { ok: true, seq: ev.seq, basis_sha: basis, citations: findings.map(f => `${f.id}:${f.citation}`) };
  });
}

export function outcome(arm, id, what, note = '') {
  if (!OUTCOMES.includes(what)) throw new Error(`outcome ∈ ${OUTCOMES}`);
  return withJ(arm, j => {
    const consult = j.events.find(e => e.type === 'CONSULT' && e.body.findings.some(f => f.id === id));
    if (!consult) throw new Error(`unknown finding ${id}`);
    if (j.events.some(e => e.type === 'OUTCOME' && e.body.id === id)) throw new Error(`finding ${id} already has an outcome`);
    const git = new Git(product(arm)); const head = git.revParse('HEAD');
    const f = consult.body.findings.find(x => x.id === id);
    const touched = (f.anchors ?? []).map(a => a.path);
    const changed = consult.body.basis_sha === head ? [] : git.diffNames(consult.body.basis_sha, head);
    const stale = touched.some(p => changed.includes(p));
    const ev = j.append('OUTCOME', { id, outcome: what, note, head_sha: head, stale_at_use: stale });
    return { ok: true, seq: ev.seq, stale_at_use: stale };
  });
}

export function stats(arm) {
  if (!existsSync(join(arm, 'process', 'consults.jsonl'))) return { consults: 0, fallbacks: 0, stale_warnings: 0, findings_acted_on: 0, false_positives: 0, adapter: null, consult_log: 'process/consults.jsonl' };
  return withJ(arm, j => {
    const v = j.verify();
    const consults = j.events.filter(e => e.type === 'CONSULT');
    const outcomes = j.events.filter(e => e.type === 'OUTCOME');
    const findings = consults.flatMap(e => e.body.findings);
    const cited = findings.filter(f => f.citation !== 'UNANCHORED');
    const adapters = [...new Set(consults.map(e => e.body.adapter))];
    return {
      consults: consults.length, findings: findings.length,
      verified_citation_rate: cited.length ? Number((cited.filter(f => f.citation === 'VERIFIED').length / cited.length).toFixed(3)) : null,
      invalid_citations: findings.filter(f => f.citation === 'INVALID').length,
      findings_acted_on: outcomes.filter(o => o.body.outcome === 'acted').length,
      false_positives: outcomes.filter(o => o.body.outcome === 'false_positive').length,
      findings_without_outcome: findings.filter(f => !outcomes.some(o => o.body.id === f.id)).length,
      stale_warnings: outcomes.filter(o => o.body.stale_at_use).length,
      fallbacks: 0,
      adapter: adapters.length === 1 ? adapters[0] : adapters.join('+') || null,
      regimes: [...new Set(consults.map(e => e.body.regime))],
      journal_ok: v.ok, consult_log: 'process/consults.jsonl',
    };
  });
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [cmd, arm, a, b, c] = process.argv.slice(2);
  try {
    let out;
    if (cmd === 'init') out = init(arm);
    else if (cmd === 'commit') out = commit(arm, a);
    else if (cmd === 'log') out = log(arm, JSON.parse(a));
    else if (cmd === 'outcome') out = outcome(arm, a, b, c);
    else if (cmd === 'stats') out = stats(arm);
    else { console.error('usage: consult.mjs init|commit|log|outcome|stats <armDir> ...'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2));
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
