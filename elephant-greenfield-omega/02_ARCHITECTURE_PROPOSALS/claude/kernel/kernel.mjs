// ECP v0.2 switchboard kernel: one process per experiment arm, single journal writer.
// Responsibilities: validate, dedupe, route (deterministic), stamp basis, dispatch with deadlines,
// re-stamp on arrival, verify citations, record disagreements, escrow patches, guard the epoch.
// It never writes product source and never merges. Claim level: SIMULATED_TEST (scripted adapters only).
import { randomBytes } from 'node:crypto';
import { Journal } from './journal.mjs';
import { Git } from './git.mjs';
import { computeBasis, verifyFinding, inManifest } from './capsule.mjs';
import { validatePatch, storeEscrow } from './escrow.mjs';
import { sha256, canon, EcpError, FULL_SHA, isAllowedSourcePath, scanSecrets, matchAny } from './util.mjs';

export const KINDS = ['ASK', 'REVIEW', 'IMPACT', 'PROPOSE_PATCH'];
export const SENSITIVE = new Set(['REVIEW', 'IMPACT', 'PROPOSE_PATCH']);
export const TOPOLOGY = { e0: 0, e1: 1, e2: 2 };
const VERDICTS = new Set(['OK', 'DEFECT', 'RISK', 'UNKNOWN']);
const OK_NODE = new Set(['COMPLETED', 'STALE_ADVISORY']);
const FINDING_FIELDS = ['id', 'subject', 'verdict', 'claim', 'check', 'confidence', 'anchors', 'kind'];

export function validateEnvelope(r) {
  const bad = why => { throw new EcpError('INVALID_ENVELOPE', why); };
  if (!r || typeof r !== 'object') bad('not an object');
  if (r.version !== 'ecp/0.2') bad('version');
  for (const k of ['id', 'idempotency_key', 'task_id', 'trace_id', 'from']) if (!/^[\w:.\-]{2,128}$/.test(r[k] ?? '')) bad(k);
  if (/^elephant:/i.test(r.from)) bad('from: Elephants cannot originate requests (hop limit 0)');
  if (!(r.arm in TOPOLOGY)) bad('arm');
  if (!KINDS.includes(r.kind)) bad('kind');
  if (!FULL_SHA.test(r.base_sha ?? '')) bad('base_sha must be a full commit SHA');
  if (typeof r.question !== 'string' || !r.question.trim() || r.question.length > 20000) bad('question');
  if (r.domains !== undefined && (!Array.isArray(r.domains) || r.domains.length < 1 || r.domains.length > 2 || new Set(r.domains).size !== r.domains.length)) bad('domains');
  if (r.epoch_policy !== undefined && !['any', 'same'].includes(r.epoch_policy)) bad('epoch_policy');
  if (r.accept_stale !== undefined && !['none', 'peripheral', 'contract'].includes(r.accept_stale)) bad('accept_stale');
  if (r.artifacts !== undefined) {
    if (!Array.isArray(r.artifacts) || r.artifacts.length > 20) bad('artifacts');
    for (const a of r.artifacts) if (!a || !isAllowedSourcePath(a.path) || typeof a.content !== 'string' || a.content.length > 200_000) bad('artifact');
  }
  if (r.kind === 'PROPOSE_PATCH' && !(r.patch && Array.isArray(r.patch.allowlist) && r.patch.allowlist.length)) bad('PROPOSE_PATCH requires patch.allowlist');
  if (r.kind !== 'PROPOSE_PATCH' && r.patch !== undefined) bad('patch only valid for PROPOSE_PATCH');
  if (r.deadline_ms !== undefined && !(Number.isInteger(r.deadline_ms) && r.deadline_ms > 0 && r.deadline_ms <= 600_000)) bad('deadline_ms');
  return r;
}

export class Kernel {
  constructor({ journalPath, repo, arm, mainSha, manifests, now, queueCap = 2, txnBudget = 20, escrowDir, rng = n => randomBytes(n).toString('hex') }) {
    this.git = new Git(repo); this.manifests = new Map(manifests.map(m => [m.domain, m]));
    this.queueCap = queueCap; this.txnBudget = txnBudget; this.escrowDir = escrowDir; this.rng = rng;
    this.journal = new Journal(journalPath, { now });
    this.nodes = new Map(); this.requests = new Map(); this.adapters = new Map(); this.runtime = new Map();
    this.canaries = new Map(); this.lease = null; this.arm = arm; this.main = mainSha;
    if (!this.journal.events.some(e => e.type === 'ARM_INIT')) {
      if (!(arm in TOPOLOGY)) { this.journal.close(); throw new EcpError('INVALID_ARM', arm); }
      if (!this.git.hasCommit(mainSha)) { this.journal.close(); throw new EcpError('BASE_UNKNOWN', mainSha); }
      this.journal.append('ARM_INIT', { arm, main_sha: mainSha, manifests: [...this.manifests.values()].map(m => ({ domain: m.domain, version: m.version, hash: sha256(canon(m)) })) });
    }
    this._fold();
  }

  // ---------- state = fold(journal) ----------
  _fold() {
    const recordedOnly = new Map();
    for (const { type, body } of this.journal.events) {
      switch (type) {
        case 'ARM_INIT': this.arm = body.arm; this.main = body.main_sha; break;
        case 'NODE_REGISTERED': this.nodes.set(body.id, { ...body, txn_count: 0, isolation: 'UNTESTED' }); break;
        case 'NODE_ROTATED': Object.assign(this.nodes.get(body.id), { pack_sha: body.pack_sha, incorporated_sha: body.incorporated_sha, generation: body.generation, status: 'READY', txn_count: 0, isolation: 'UNTESTED' }); break;
        case 'NODE_STATUS': Object.assign(this.nodes.get(body.id), { status: body.status, ...(body.isolation ? { isolation: body.isolation } : {}) }); break;
        case 'NODE_RETIRED': this.nodes.get(body.id).status = 'RETIRED'; break;
        case 'DISPATCHED': for (const n of body.nodes) { const x = this.nodes.get(n.id); if (x) x.txn_count++; } break;
        case 'REQUEST_RECORDED': recordedOnly.set(body.key, body); this.requests.set(body.key, { fingerprint: body.fingerprint, id: body.id, terminal: null }); break;
        case 'TERMINAL': recordedOnly.delete(body.key); this.requests.get(body.key).terminal = body.result; break;
        case 'LEASE_GRANTED': this.lease = { token: body.token, holder: body.holder, held: true }; break;
        case 'LEASE_RELEASED': if (this.lease) this.lease.held = false; break;
        case 'COMMIT_ACCEPTED': this.main = body.sha; break;
      }
    }
    // Recovery: anything recorded but not terminal was in flight when the previous process died.
    // We do NOT re-dispatch and do NOT assume success: it becomes UNKNOWN_TERMINAL (a terminal state).
    for (const [key, rec] of recordedOnly) {
      const result = { request_id: rec.id, status: 'UNKNOWN_TERMINAL', reason: 'kernel_restart_before_terminal', authority: 'advisory_unverified', responses: [] };
      this.journal.append('TERMINAL', { key, request_id: rec.id, result });
      this.requests.get(key).terminal = result;
    }
    for (const n of this.nodes.values()) if (['READY', 'BUSY'].includes(n.status)) n.status = 'DETACHED'; // adapters are process-local
  }

  // ---------- topology ----------
  registerNode({ id, domain, mode, capsule, calibration, adapter }) {
    const live = [...this.nodes.values()].filter(n => n.status !== 'RETIRED');
    if (live.length >= TOPOLOGY[this.arm]) throw new EcpError('TOPOLOGY_VIOLATION', `arm ${this.arm} allows ${TOPOLOGY[this.arm]} Elephant(s)`);
    if (this.nodes.has(id)) throw new EcpError('DUPLICATE_NODE', id);
    if (!this.manifests.has(domain) || live.some(n => n.domain === domain)) throw new EcpError('BAD_DOMAIN', domain);
    if (!['FORK', 'PREFIX', 'APPEND'].includes(mode)) throw new EcpError('BAD_MODE', mode);
    if (!this.git.isAncestor(capsule.commit, this.main)) throw new EcpError('BASE_DIVERGED', 'capsule commit not on arm main');
    const status = calibration?.passed ? 'READY' : 'QUARANTINED';
    this.journal.append('NODE_REGISTERED', { id, domain, mode, pack_sha: capsule.pack_sha, nonce_sha: capsule.nonce_sha, incorporated_sha: capsule.commit, generation: 1, status, calibration_score: calibration?.score ?? null });
    this.nodes.set(id, { id, domain, mode, pack_sha: capsule.pack_sha, incorporated_sha: capsule.commit, generation: 1, status, txn_count: 0, isolation: 'UNTESTED' });
    if (adapter) this.adapters.set(id, adapter);
    return this.nodes.get(id);
  }
  /** Re-attach an adapter after a kernel restart. Callers must have re-verified residency (nonce) first. */
  attach(id, adapter, { residencyVerified = false } = {}) {
    const n = this._node(id);
    if (!residencyVerified) throw new EcpError('RESIDENCY_UNVERIFIED', 'rotate (rebuild + calibrate) instead');
    this.adapters.set(id, adapter);
    if (n.status === 'DETACHED') this._setStatus(id, 'READY');
  }
  rotateNode(id, { capsule, calibration, adapter }) {
    const n = this._node(id);
    if (!calibration?.passed) throw new EcpError('CALIBRATION_REQUIRED', 'never route to an uncalibrated replacement');
    if (!this.git.isAncestor(capsule.commit, this.main)) throw new EcpError('BASE_DIVERGED', 'capsule commit not on arm main');
    this.journal.append('NODE_ROTATED', { id, pack_sha: capsule.pack_sha, nonce_sha: capsule.nonce_sha, incorporated_sha: capsule.commit, generation: n.generation + 1, previous_generation: n.generation, calibration_score: calibration.score });
    Object.assign(n, { pack_sha: capsule.pack_sha, incorporated_sha: capsule.commit, generation: n.generation + 1, status: 'READY', txn_count: 0, isolation: 'UNTESTED' });
    if (adapter) this.adapters.set(id, adapter);
    for (const k of [...this.canaries.keys()]) if (k.startsWith(`${id}#`)) this.canaries.delete(k);
    return n;
  }
  retire(id, reason = 'operator') { this._node(id); this.journal.append('NODE_RETIRED', { id, reason }); this.nodes.get(id).status = 'RETIRED'; }
  _node(id) { const n = this.nodes.get(id); if (!n) throw new EcpError('UNKNOWN_NODE', id); return n; }
  _setStatus(id, status, extra = {}) { this.journal.append('NODE_STATUS', { id, status, ...extra }); Object.assign(this._node(id), { status, ...extra }); }
  status() { return [...this.nodes.values()].map(n => ({ ...n, basis: this._basis(n) })); }
  _basis(n) { return computeBasis(this.git, { nodeSha: n.incorporated_sha, mainSha: this.main, manifest: this.manifests.get(n.domain) }); }

  // ---------- epoch guard: serialized main lease with fencing token ----------
  acquireMainLease(holder) {
    if (this.lease?.held) throw new EcpError('LEASE_HELD', this.lease.holder);
    const token = (this.lease?.token ?? 0) + 1;
    this.journal.append('LEASE_GRANTED', { holder, token });
    this.lease = { holder, token, held: true };
    return token;
  }
  releaseMainLease(token) {
    if (!this.lease?.held || this.lease.token !== token) throw new EcpError('STALE_FENCING_TOKEN');
    this.journal.append('LEASE_RELEASED', { token }); this.lease.held = false;
  }
  /** Advance the arm epoch. Fast-forward only, fenced, with author/reviewer separation evidence. */
  acceptCommit({ sha, token, evidence }) {
    if (!this.lease?.held || this.lease.token !== token) throw new EcpError('STALE_FENCING_TOKEN');
    if (!this.git.hasCommit(sha) || sha === this.main || !this.git.isAncestor(this.main, sha)) throw new EcpError('NOT_FAST_FORWARD');
    const e = evidence ?? {};
    if (e.head_sha !== sha || e.tests_passed !== true) throw new EcpError('EVIDENCE_INCOMPLETE', 'head_sha and passing tests required');
    if (!e.worker || !e.reviewer || e.reviewer === e.worker) throw new EcpError('REVIEW_INDEPENDENCE', 'reviewer must differ from author');
    if ((e.patch_authors ?? []).includes(e.reviewer) || this.nodes.has(e.reviewer)) throw new EcpError('REVIEW_INDEPENDENCE', 'an Elephant cannot review or approve');
    const parent = this.main;
    const stale = [...this.nodes.values()].filter(n => n.status !== 'RETIRED')
      .map(n => ({ id: n.id, ...computeBasis(this.git, { nodeSha: n.incorporated_sha, mainSha: sha, manifest: this.manifests.get(n.domain) }) }))
      .filter(b => b.staleness !== 'NONE').map(b => ({ id: b.id, staleness: b.staleness }));
    this.journal.append('COMMIT_ACCEPTED', { sha, parent, token, task_id: e.task_id ?? null, worker: e.worker, reviewer: e.reviewer, patch_authors: e.patch_authors ?? [], diff_sha: e.diff_sha ?? null, stale_nodes: stale });
    this.main = sha;
    return { epoch: sha, parent, stale_nodes: stale };
  }

  // ---------- consult ----------
  consult(request, { deadlineMs } = {}) {
    validateEnvelope(request);
    const fingerprint = sha256(canon(request));
    const prior = this.requests.get(request.idempotency_key);
    if (prior) {
      if (prior.fingerprint !== fingerprint) return Promise.reject(new EcpError('IDEMPOTENCY_KEY_CONFLICT', request.idempotency_key));
      return prior.promise ?? Promise.resolve(prior.terminal); // includes UNKNOWN_TERMINAL after restart
    }
    // Write-ahead: the request exists durably before any dispatch.
    this.journal.append('REQUEST_RECORDED', { key: request.idempotency_key, id: request.id, fingerprint, kind: request.kind, arm: request.arm, task_id: request.task_id, trace_id: request.trace_id, parent_id: request.parent_id ?? null, from: request.from });
    const entry = { fingerprint, id: request.id, terminal: null };
    this.requests.set(request.idempotency_key, entry);
    entry.promise = this._run(request, deadlineMs ?? request.deadline_ms ?? 120_000)
      .catch(err => ({ request_id: request.id, status: 'ERROR', reason: String(err.code ?? err.message), authority: 'advisory_unverified', responses: [] }))
      .then(result => { this._terminal(request, result); entry.terminal = result; delete entry.promise; return result; });
    return entry.promise;
  }
  _terminal(r, result) { if (this.closed) return; /* a closed kernel models a dead process */ this.journal.append('TERMINAL', { key: r.idempotency_key, request_id: r.id, result }); }
  cancel(requestId) {
    const rt = this.runtime.get(requestId);
    if (!rt) return false;
    rt.controller.abort('CANCELLED');
    return true;
  }

  async _run(r, deadlineMs) {
    const base = { request_id: r.id, trace_id: r.trace_id, authority: 'advisory_unverified', topology_planned: r.arm };
    // 1. Policy: untrusted payload scan. No bypass retry.
    const hits = scanSecrets([r.question, ...(r.artifacts ?? []).map(a => a.content)].join('\n'));
    if (hits.length) return { ...base, status: 'POLICY_DENIED', reason: `secret_pattern:${hits.join(',')}`, responses: [] };
    // 2. Worker base must lie on arm main lineage.
    if (!this.git.hasCommit(r.base_sha) || !this.git.isAncestor(r.base_sha, this.main)) return { ...base, status: 'BASE_DIVERGED', reason: 'request.base_sha not on arm main', responses: [], fallback: 'E0_DIRECT_SOURCE' };
    // 3. E0 has no Elephant by construction.
    if (r.arm === 'e0') return { ...base, status: 'FALLBACK_DIRECT_SOURCE', topology_effective: 'e0', responses: [], fallback: 'E0_DIRECT_SOURCE' };
    // 4. Deterministic routing: explicit domains, else owners of artifact paths. No LLM router.
    const domains = r.domains ?? [...new Set((r.artifacts ?? []).map(a => this._owner(a.path)).filter(Boolean))];
    if (!domains.length) return { ...base, status: 'UNROUTABLE', responses: [], fallback: 'E0_DIRECT_SOURCE' };
    if (domains.length > TOPOLOGY[r.arm]) return { ...base, status: 'POLICY_DENIED', reason: `arm ${r.arm} cannot consult ${domains.length} domains`, responses: [] };
    const planned = domains.map(d => [...this.nodes.values()].find(n => n.domain === d && n.status !== 'RETIRED') ?? { id: `missing:${d}`, domain: d, status: 'ABSENT' });
    // 5. Stamp basis at dispatch (wrapper-computed, never model-asserted).
    const acceptStale = r.accept_stale ?? 'peripheral';
    const slots = planned.map(live => {
      const n = live.status === 'ABSENT' ? live : { id: live.id, domain: live.domain, status: live.status, generation: live.generation, pack_sha: live.pack_sha, incorporated_sha: live.incorporated_sha, live };
      if (n.status === 'ABSENT' || !this.adapters.has(n.id) || !['READY'].includes(n.status)) return { n, pre: n.status === 'QUARANTINED' || n.status === 'ROTATION_DUE' ? n.status : 'UNAVAILABLE' };
      const basis = this._basis(n);
      if (basis.staleness === 'DIVERGED') return { n, basis, pre: 'BASE_DIVERGED' };
      const tolerated = basis.staleness === 'NONE' || (basis.staleness === 'PERIPHERAL' && acceptStale !== 'none') || (basis.staleness === 'CONTRACT' && (acceptStale === 'contract' || !SENSITIVE.has(r.kind)));
      return tolerated ? { n, basis, mainAtDispatch: this.main } : { n, basis, pre: 'STALE_BASIS', mainAtDispatch: this.main };
    });
    const runnable = slots.filter(s => !s.pre);
    if ((r.epoch_policy ?? 'any') === 'same' && new Set(runnable.map(s => s.n.incorporated_sha)).size > 1) {
      return { ...base, status: 'MIXED_EPOCH', reason: 'epoch_policy=same but nodes are on different incorporated commits; sync first', responses: slots.map(s => this._stub(s, 'MIXED_EPOCH')) };
    }
    const controller = new AbortController();
    this.runtime.set(r.id, { controller });
    const timer = setTimeout(() => controller.abort('DEADLINE_EXCEEDED'), deadlineMs);
    const deadline_at = new Date(Date.parse(this.journal.now()) + deadlineMs).toISOString();
    if (runnable.length) {
      this.journal.append('DISPATCHED', { request_id: r.id, deadline_at, nodes: runnable.map(s => ({ id: s.n.id, generation: s.n.generation, incorporated_sha: s.n.incorporated_sha, pack_sha: s.n.pack_sha, staleness: s.basis.staleness })) });
      for (const s of runnable) s.n.live.txn_count++;
    }
    let terminalWritten = false;
    try {
      const responses = await Promise.all(slots.map(s => s.pre ? this._stub(s, s.pre) : this._dispatch(r, s, controller.signal, () => terminalWritten)));
      return this._aggregate(r, base, responses, controller.signal.reason);
    } finally {
      terminalWritten = true; clearTimeout(timer); this.runtime.delete(r.id);
    }
  }
  _owner(path) { for (const m of this.manifests.values()) if (matchAny(m.include, path) && !matchAny(m.exclude, path)) return m.domain; return null; }
  _stub(s, status) {
    return { node_id: s.n.id, status, generation: s.n.generation ?? null, basis: s.basis ? this._basisOut(s.n, s.basis, s.mainAtDispatch) : null, findings: [], fallback: 'E0_DIRECT_SOURCE' };
  }
  _basisOut(n, b, mainAtDispatch = this.main) { return { pack_sha: n.pack_sha, incorporated_sha: n.incorporated_sha, arm_main_at_dispatch: mainAtDispatch, staleness: b.staleness, unincorporated_paths: b.unincorporated_paths, contract_paths: b.contract_paths }; }

  _slot(n) { // per-node serialized queue with a hard cap
    let rt = this.runtime.get(`node:${n.id}`);
    if (!rt) { rt = { tail: Promise.resolve(), pending: 0 }; this.runtime.set(`node:${n.id}`, rt); }
    return rt;
  }

  async _dispatch(r, s, signal, isLate) {
    const { n, basis } = s; const adapter = this.adapters.get(n.id); const q = this._slot(n.live);
    if (q.pending >= 1 + this.queueCap) return { ...this._stub(s, 'OVER_CAPACITY') };
    q.pending++;
    const canary = `TXN-${this.rng(6)}`;
    this.canaries.set(`${n.id}#${r.id}`, canary);
    const generation = n.generation; const t0 = Date.now();
    const envelope = {
      request_id: r.id, kind: r.kind, question: r.question, base_sha: r.base_sha, txn_canary: canary,
      basis: { incorporated_sha: n.incorporated_sha, staleness: basis.staleness, unincorporated_paths: basis.unincorporated_paths },
      // Artifacts are DATA. Adapters must render them inside a quoted data block, never as instructions.
      untrusted_artifacts: (r.artifacts ?? []).map(a => ({ path: a.path, sha256: sha256(a.content), content: a.content })),
      patch_allowlist: r.patch?.allowlist ?? null,
    };
    const work = q.tail.then(() => {
      if (signal.aborted) throw new EcpError(String(signal.reason));
      return adapter.consult({ node: { id: n.id, domain: n.domain, generation }, envelope, signal });
    });
    q.tail = work.catch(() => {}).finally(() => { q.pending--; });
    const aborted = new Promise(resolve => {
      if (signal.aborted) resolve(signal.reason);
      signal.addEventListener('abort', () => resolve(signal.reason), { once: true });
    });
    const outcome = await Promise.race([work.then(raw => ({ raw }), err => ({ err })), aborted.then(reason => ({ abort: reason }))]);
    if (outcome.abort) {
      work.then(raw => { if (isLate() && !this.closed) this.journal.append('LATE_RESULT', { request_id: r.id, node_id: n.id, usage: raw?.usage ?? null, note: 'discarded; terminal already recorded' }); }, () => {});
      const remote = outcome.abort === 'CANCELLED' ? await Promise.resolve(adapter.cancel?.(r.id) ?? 'unsupported').catch(() => 'attempted') : 'not_requested';
      return { ...this._stub(s, outcome.abort === 'CANCELLED' ? 'CANCELLED' : 'DEADLINE_EXCEEDED'), remote_stop: remote };
    }
    if (outcome.err) return { ...this._stub(s, outcome.err.code === 'CANCELLED' ? 'CANCELLED' : 'MODEL_ERROR'), error: String(outcome.err.message).slice(0, 200) };
    return this._accept(r, s, outcome.raw, generation, Date.now() - t0);
  }

  _accept(r, s, raw, generation, wallMs) {
    const { n, basis } = s;
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.findings)) return { ...this._stub(s, 'RESPONSE_INVALID') };
    const unrecognized = Object.keys(raw).filter(k => !['findings', 'not_examined', 'patch', 'notes', 'usage'].includes(k));
    // Re-stamp on arrival: did the epoch move under us in a way that touches this domain?
    const arrival = computeBasis(this.git, { nodeSha: n.incorporated_sha, mainSha: this.main, manifest: this.manifests.get(n.domain) });
    const findings = raw.findings.slice(0, 50).map((f, i) => {
      const clean = Object.fromEntries(FINDING_FIELDS.filter(k => f?.[k] !== undefined).map(k => [k, f[k]]));
      clean.id = typeof clean.id === 'string' ? clean.id : `f-${i + 1}`;
      clean.verdict = VERDICTS.has(clean.verdict) ? clean.verdict : 'UNKNOWN';
      return { ...clean, ...verifyFinding(this.git, n.incorporated_sha, clean) };
    });
    let patch = null;
    if (r.kind === 'PROPOSE_PATCH' && typeof raw.patch === 'string') {
      const v = validatePatch(raw.patch, { allowlist: r.patch.allowlist, scopeProtected: !!r.patch.scope_protected });
      const applies = v.ok ? this.git.applyCheck(r.base_sha, raw.patch) : { applies: false, detail: 'not checked: policy violations' };
      if (v.ok && applies.applies && this.escrowDir) storeEscrow(this.escrowDir, raw.patch);
      patch = { escrow_id: v.escrow_id, ok: v.ok && applies.applies, violations: v.violations, files: v.files, applies: applies.applies, apply_detail: applies.detail, author: n.id, base_sha: r.base_sha, status: v.ok && applies.applies ? 'ESCROWED_UNVERIFIED' : 'REJECTED' };
    }
    const staleNow = arrival.staleness !== basis.staleness || arrival.unincorporated_paths.length !== basis.unincorporated_paths.length;
    const status = basis.staleness === 'NONE' && !staleNow ? 'COMPLETED' : 'STALE_ADVISORY';
    return {
      node_id: n.id, status, generation, basis: { ...this._basisOut(n, basis, s.mainAtDispatch), stale_on_arrival: staleNow, arm_main_at_arrival: this.main, staleness_at_arrival: arrival.staleness },
      findings, not_examined: Array.isArray(raw.not_examined) ? raw.not_examined.slice(0, 20).map(String) : [],
      notes_candidates: Array.isArray(raw.notes) ? raw.notes.slice(0, 10).map(x => ({ ...x, status: 'CANDIDATE' })) : [],
      patch, unrecognized_fields: unrecognized,
      cost: { wall_ms: wallMs, input_tokens: raw.usage?.input_tokens ?? 'unknown', output_tokens: raw.usage?.output_tokens ?? 'unknown', cache_read_tokens: raw.usage?.cache_read_tokens ?? 'unknown' },
    };
  }

  _aggregate(r, base, responses, abortReason) {
    const ok = responses.filter(x => OK_NODE.has(x.status));
    let status;
    if (abortReason === 'CANCELLED' && ok.length < responses.length) status = 'CANCELLED';
    else if (ok.length === responses.length) status = ok.some(x => x.status === 'STALE_ADVISORY') ? 'STALE_ADVISORY' : 'COMPLETED';
    else if (ok.length > 0) status = 'PARTIAL';
    else status = new Set(responses.map(x => x.status)).size === 1 ? responses[0].status : 'UNAVAILABLE';
    const all = ok.flatMap(x => x.findings);
    if (ok.length && all.length && !all.some(f => f.citation === 'VERIFIED' || f.citation === 'LOCATED') && all.some(f => f.citation === 'INVALID')) status = 'CITATION_INVALID';
    // Disagreement: same subject, incompatible verdicts across nodes. Never merged into a consensus.
    const disagreements = [];
    const bySubject = new Map();
    for (const x of ok) for (const f of x.findings) if (f.subject && f.verdict !== 'UNKNOWN') {
      if (!bySubject.has(f.subject)) bySubject.set(f.subject, []);
      bySubject.get(f.subject).push({ node_id: x.node_id, finding_id: f.id, verdict: f.verdict, citation: f.citation, incorporated_sha: x.basis.incorporated_sha, check: f.check ?? null });
    }
    for (const [subject, positions] of bySubject) {
      const nodes = new Set(positions.map(p => p.node_id));
      const v = new Set(positions.map(p => (p.verdict === 'OK' ? 'OK' : 'NOT_OK')));
      if (nodes.size > 1 && v.size > 1) disagreements.push({
        id: `d-${sha256(`${r.id}|${subject}`).slice(0, 12)}`, subject, positions,
        mixed_epoch: new Set(positions.map(p => p.incorporated_sha)).size > 1,
        status: 'OPEN', resolution_requires: 'executable falsifier run by a worker; source/tests decide',
        proposed_falsifiers: positions.map(p => p.check).filter(Boolean),
      });
    }
    const effective = ok.length === 0 ? 'e0' : ok.length === 1 ? 'e1' : 'e2';
    const verified = all.filter(f => f.citation === 'VERIFIED').length;
    return {
      ...base, status, topology_effective: effective, degraded: effective !== r.arm, responses, disagreements,
      summary: { findings: all.length, verified_citations: verified, invalid_citations: all.filter(f => f.citation === 'INVALID').length },
      fallback: ok.length ? 'NONE' : 'E0_DIRECT_SOURCE',
    };
  }

  // ---------- transaction-isolation probe (one-sided) ----------
  /** Ask the node to report any TXN canaries. Recall proves leakage; silence does NOT prove isolation. */
  async probeIsolation(id) {
    const n = this._node(id); const adapter = this.adapters.get(id);
    const planted = [...this.canaries.entries()].filter(([k]) => k.startsWith(`${id}#`)).map(([, v]) => v);
    if (!planted.length) return { id, result: 'NO_CANARIES_PLANTED' };
    const answer = String(await adapter.probe({ question: 'List every TXN- canary value you can recall from earlier requests, or NONE.' }) ?? '');
    const leaked = planted.filter(c => answer.includes(c));
    const isolation = leaked.length ? 'LEAKY' : 'NO_LEAK_OBSERVED';
    const rotationDue = leaked.length > 0 && n.txn_count >= this.txnBudget;
    this._setStatus(id, rotationDue ? 'ROTATION_DUE' : n.status, { isolation });
    this.journal.append('ISOLATION_PROBE', { id, planted: planted.length, leaked: leaked.length, isolation, guarantee: leaked.length ? 'NONE' : 'NOT_PROVEN' });
    return { id, planted: planted.length, leaked: leaked.length, isolation, rotation_due: rotationDue };
  }

  close() { this.closed = true; this.journal.close(); }
}
