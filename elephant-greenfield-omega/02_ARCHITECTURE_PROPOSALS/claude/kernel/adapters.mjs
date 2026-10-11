// Scripted adapters for SIMULATION ONLY. They implement the adapter seam the kernel uses:
//   consult({node, envelope, signal}) -> raw response | throws
//   calibrate({question, id}) -> string
//   probe({question}) -> string
//   cancel(requestId) -> 'confirmed' | 'attempted' | 'unsupported'
// A real adapter (CLI/ACP/MCP/HTTP) must be written per harness AFTER local capability probing.
const sleep = (ms, signal) => new Promise((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); reject(Object.assign(new Error('aborted'), { code: String(signal.reason) })); }, { once: true });
});

export class ScriptedAdapter {
  /**
   * mode: FORK (fresh fork per request), PREFIX (stateless cached prefix), APPEND (one growing session).
   * respond(envelope, node, adapter) -> raw response.  honorAbort=false simulates a remote that keeps running.
   */
  constructor({ mode = 'FORK', respond = () => ({ findings: [] }), delayMs = 0, fail = false, honorAbort = true, nonce = '', answers = {}, cancelResult = 'attempted' } = {}) {
    Object.assign(this, { mode, respond, delayMs, fail, honorAbort, nonce, answers, cancelResult });
    this.calls = 0; this.memory = [];
  }
  async consult({ node, envelope, signal }) {
    this.calls++;
    if (this.mode === 'APPEND') this.memory.push(envelope.txn_canary); // an append-mode session retains every turn
    await sleep(this.delayMs, this.honorAbort ? signal : undefined);
    if (this.fail) throw Object.assign(new Error('SIMULATED_SESSION_LOST'), { code: 'MODEL_ERROR' });
    return this.respond(envelope, node, this);
  }
  async calibrate({ id }) {
    if (id === 'nonce') return this.nonce;
    if (id === 'negative') return this.answers.negative ?? 'NOT_IN_PACK';
    return this.answers[id] ?? '';
  }
  async probe() { return this.mode === 'APPEND' ? this.memory.join(' ') : 'NONE'; }
  async cancel() { return this.cancelResult; }
}
