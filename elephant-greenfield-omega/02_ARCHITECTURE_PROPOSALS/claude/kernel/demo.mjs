// Generates the six SIMULATED event traces referenced by ARCHITECTURE.md into outputs/claude/traces/.
// Deterministic: fixed clock, fixed RNG, fixed Git dates. No provider is called.
// Run: node outputs/claude/kernel/demo.mjs
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Kernel } from './kernel.mjs';
import { Git } from './git.mjs';
import { buildCapsule, calibrate } from './capsule.mjs';
import { ScriptedAdapter } from './adapters.mjs';
import { makeRepo, MANIFESTS, goodFinding } from './fixture.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'traces');
mkdirSync(OUT, { recursive: true });

const short = v => (typeof v === 'string' && /^[a-f0-9]{40,64}$/.test(v) ? v.slice(0, 7) : v);
function fmt(ev) {
  const b = ev.body; const pick = {};
  const keep = ['arm', 'main_sha', 'id', 'domain', 'mode', 'status', 'generation', 'incorporated_sha', 'key', 'kind', 'from', 'request_id', 'nodes', 'sha', 'parent', 'token', 'holder', 'worker', 'reviewer', 'patch_authors', 'stale_nodes', 'isolation', 'leaked', 'note', 'previous_generation'];
  for (const k of keep) if (b[k] !== undefined) pick[k] = b[k];
  if (b.result) {
    const r = b.result;
    pick.result = { status: r.status, topology: r.topology_effective, fallback: r.fallback, disagreements: r.disagreements?.length ?? 0,
      nodes: (r.responses ?? []).map(x => `${x.node_id}=${x.status}${x.basis ? `@${short(x.basis.incorporated_sha)}/${x.basis.staleness}${x.basis.stale_on_arrival ? '+STALE_ON_ARRIVAL' : ''}` : ''}${x.patch ? ` patch:${x.patch.status}` : ''}`) };
  }
  const s = JSON.stringify(pick, (k, v) => short(v));
  return `#${String(ev.seq).padStart(2, '0')} ${ev.ts.slice(11, 19)} ${ev.type.padEnd(20)} ${s}`;
}

async function scenario(name, arm, fn) {
  const fx = makeRepo('ecp-demo-'); const dir = mkdtempSync(join(tmpdir(), 'ecp-demo-j-'));
  let clock = Date.parse('2026-10-11T03:00:00Z'); let n = 0;
  const k = new Kernel({ journalPath: join(dir, 'j.jsonl'), repo: fx.repo, arm, mainSha: fx.base, manifests: MANIFESTS,
    now: () => new Date(clock += 1000).toISOString(), rng: () => `${String(++n).padStart(4, '0')}cc`, escrowDir: join(dir, 'escrow') });
  const git = new Git(fx.repo);
  const add = async (id, domain, opts) => {
    const capsule = buildCapsule(git, { sha: k.main, manifest: MANIFESTS.find(m => m.domain === domain), nonce: `nonce-${id}` });
    const adapter = new ScriptedAdapter({ nonce: capsule.nonce, ...opts });
    k.registerNode({ id, domain, mode: adapter.mode, capsule, calibration: await calibrate(adapter, capsule), adapter });
    return { adapter, capsule };
  };
  let i = 0;
  const req = over => ({ version: 'ecp/0.2', id: `${name}-r${++i}`, idempotency_key: `${name}-k${i}`, arm, kind: 'REVIEW', from: 'worker:w1', task_id: 'T2', trace_id: `${name}-trace`, base_sha: k.main, question: 'Review the retry path against the command contract.', domains: ['contracts'], ...over });
  const integrate = (files, extra = {}) => {
    const sha = fx.commit(files, 'accepted change'); const token = k.acquireMainLease('integrator:i1');
    k.acceptCommit({ sha, token, evidence: { head_sha: sha, tests_passed: true, worker: 'worker:w1', reviewer: 'reviewer:r1', ...extra } });
    k.releaseMainLease(token); return sha;
  };
  try {
    const note = await fn({ k, fx, git, add, req, integrate, dir });
    const lines = [`# Trace: ${name}  (arm=${arm})  CLAIM LEVEL: SIMULATED — scripted adapters, real Git, real journal`, ...(note ? [`# ${note}`] : []), ...k.journal.events.map(fmt)];
    writeFileSync(join(OUT, `${name}.trace.txt`), `${lines.join('\n')}\n`);
    console.log(lines.join('\n'), '\n');
  } finally { k.close(); fx.cleanup(); rmSync(dir, { recursive: true, force: true }); }
}

const ok = (subject, verdict) => () => ({ findings: [goodFinding(subject, verdict)], not_examined: ['UI lifetime'] });

await scenario('01-e0-normal', 'e0', async ({ k, req }) => { await k.consult(req()); return 'E0: consult is answered by the kernel itself with FALLBACK_DIRECT_SOURCE; the worker reads source.'; });

await scenario('02-e1-review', 'e1', async ({ k, add, req }) => {
  await add('elephant:command-execution', 'contracts', { respond: ok('C-IDEMPOTENCY', 'OK') });
  await k.consult(req());
  return 'E1: one calibrated node; basis stamped by wrapper; citation verified against blob.';
});

await scenario('03-e2-conflicting-reviews', 'e2', async ({ k, add, req }) => {
  await add('elephant:contracts', 'contracts', { respond: ok('C-TARGET-STATUS', 'OK'), delayMs: 5 });
  await add('elephant:execution-surface', 'execution-surface', { respond: ok('C-TARGET-STATUS', 'DEFECT'), delayMs: 10 });
  await k.consult(req({ domains: ['contracts', 'execution-surface'] }));
  return 'E2: two independent verdicts on one subject -> OPEN disagreement record (see TERMINAL disagreements=1). No consensus.';
});

await scenario('04-e2-node-crash', 'e2', async ({ k, add, req }) => {
  await add('elephant:contracts', 'contracts', { respond: ok('C-IDEMPOTENCY', 'OK') });
  await add('elephant:execution-surface', 'execution-surface', { fail: true });
  await k.consult(req({ domains: ['contracts', 'execution-surface'] }));
  return 'E2 node B lost mid-request -> PARTIAL, topology_effective=e1, B contributes nothing.';
});

await scenario('05-epoch-change-in-flight', 'e1', async ({ k, add, req, integrate }) => {
  let fire;
  await add('elephant:command-execution', 'contracts', { delayMs: 20, respond: () => { fire(); return ok('C-IDEMPOTENCY', 'OK')(); } });
  fire = () => integrate({ 'product/core/plan.ts': '// changed while the Elephant was thinking\n' });
  await k.consult(req());
  return 'A verified commit lands between DISPATCHED and the answer -> STALE_ADVISORY + STALE_ON_ARRIVAL.';
});

await scenario('06-patch-proposal-accepted', 'e1', async ({ k, fx, add, req, integrate, dir, git }) => {
  const diff = 'diff --git a/product/ui/panel.ts b/product/ui/panel.ts\n--- a/product/ui/panel.ts\n+++ b/product/ui/panel.ts\n@@ -1 +1 @@\n-export const LABELS = { timed_out: "Timed out" };\n+export const LABELS = { timed_out: "Timed out", cancelled: "Cancelled" };\n';
  const { capsule, adapter } = await add('elephant:command-execution', 'execution-surface', { respond: () => ({ findings: [], patch: diff }) });
  const res = await k.consult(req({ kind: 'PROPOSE_PATCH', domains: ['execution-surface'], patch: { allowlist: ['product/ui/**'] } }));
  const p = res.responses[0].patch;
  writeFileSync(join(dir, 'p.diff'), diff); fx.git('apply', join(dir, 'p.diff')); // the WORKER applies it, in its own tree
  integrate({}, { patch_authors: [p.author], diff_sha: p.escrow_id });
  const fresh = buildCapsule(git, { sha: k.main, manifest: MANIFESTS[1], nonce: 'nonce-gen2' });
  adapter.nonce = fresh.nonce;
  k.rotateNode('elephant:command-execution', { capsule: fresh, calibration: await calibrate(adapter, fresh) });
  return `Elephant patch escrowed (${p.escrow_id.slice(0, 12)}), applied by worker, reviewed by reviewer:r1, integrated, node rebuilt+recalibrated.`;
});
