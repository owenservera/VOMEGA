// Durable, append-only, hash-chained JSONL journal (one per experiment arm, single writer).
// Each append is written and fsync'd before the caller may claim the transition happened.
// Claim level: SIMULATED_TEST. Torn-tail recovery is tested by truncating the file, not by real power loss.
import { openSync, writeSync, fsyncSync, closeSync, existsSync, readFileSync, ftruncateSync, writeFileSync, rmSync } from 'node:fs';
import { sha256, canon, EcpError } from './util.mjs';

const GENESIS = '0'.repeat(64);

export class Journal {
  constructor(path, { now = () => new Date().toISOString() } = {}) {
    this.path = path; this.now = now; this.events = [];
    const brokeLock = this._lock();
    try { this._open(brokeLock); } catch (e) { rmSync(this.lockPath, { force: true }); throw e; }
  }

  _open(brokeLock) {
    const path = this.path;
    let torn = null;
    if (existsSync(path)) {
      const buf = readFileSync(path);
      const lastNl = buf.lastIndexOf(0x0a);
      if (lastNl !== buf.length - 1) {
        // A partial final line is an uncommitted write (crash mid-append). Discard it, record that we did.
        const tail = buf.subarray(lastNl + 1);
        torn = { bytes: tail.length, sha256: sha256(tail) };
        const fd = openSync(path, 'r+'); ftruncateSync(fd, lastNl + 1); fsyncSync(fd); closeSync(fd);
      }
      const text = buf.subarray(0, lastNl + 1).toString('utf8');
      for (const line of text.split('\n')) if (line) this.events.push(JSON.parse(line));
      const v = this.verify();
      if (!v.ok) throw new EcpError('JOURNAL_CORRUPT', `seq ${v.seq}: ${v.reason}`);
    }
    this.fd = openSync(path, 'a');
    if (brokeLock) this.append('STALE_LOCK_BROKEN', brokeLock);
    if (torn) this.append('TORN_TAIL_DISCARDED', torn);
  }

  // Single-writer guarantee across processes: <journal>.lock holds the owner pid.
  // A lock whose pid is no longer alive is a crash remnant and is taken over (and journaled).
  _lock() {
    this.lockPath = `${this.path}.lock`;
    const mine = JSON.stringify({ pid: process.pid });
    try { writeFileSync(this.lockPath, mine, { flag: 'wx' }); return null; } catch (e) { if (e.code !== 'EEXIST') throw e; }
    let owner = null;
    try { owner = JSON.parse(readFileSync(this.lockPath, 'utf8')).pid; } catch { /* unreadable lock: treat as stale */ }
    let alive = false;
    if (Number.isInteger(owner)) { try { process.kill(owner, 0); alive = true; } catch (e) { alive = e.code === 'EPERM'; } }
    if (alive) throw new EcpError('JOURNAL_LOCKED', `held by pid ${owner}`);
    writeFileSync(this.lockPath, mine);
    return { previous_pid: owner };
  }

  get head() { return this.events.length ? this.events[this.events.length - 1].hash : GENESIS; }

  append(type, body = {}) {
    // Normalise through JSON first: what is hashed must be exactly what is stored and re-read. Without this, a body
    // holding a Date, an undefined array element or a toJSON() object hashes differently from its serialised form,
    // and the journal fails its own verify on the next open (found by the team program v0.2; see team/CHANGELOG.md).
    body = JSON.parse(JSON.stringify(body ?? {}));
    const ev = { seq: this.events.length + 1, ts: this.now(), type, prev: this.head, body };
    ev.hash = sha256(canon({ seq: ev.seq, ts: ev.ts, type, prev: ev.prev, body }));
    writeSync(this.fd, `${JSON.stringify(ev)}\n`);
    fsyncSync(this.fd);
    this.events.push(ev);
    return ev;
  }

  verify() {
    let prev = GENESIS;
    for (const [i, ev] of this.events.entries()) {
      if (ev.seq !== i + 1) return { ok: false, seq: ev.seq, reason: 'sequence gap' };
      if (ev.prev !== prev) return { ok: false, seq: ev.seq, reason: 'broken chain' };
      const h = sha256(canon({ seq: ev.seq, ts: ev.ts, type: ev.type, prev: ev.prev, body: ev.body }));
      if (h !== ev.hash) return { ok: false, seq: ev.seq, reason: 'hash mismatch' };
      prev = ev.hash;
    }
    return { ok: true, head: prev, count: this.events.length };
  }

  close() {
    if (this.fd !== undefined) { closeSync(this.fd); this.fd = undefined; rmSync(this.lockPath, { force: true }); }
  }
}
