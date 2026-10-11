// Read-only Git access with argument arrays (no shell). The kernel never writes to the repo;
// patch apply-checks use a throwaway index file, not the working tree.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EcpError, FULL_SHA } from './util.mjs';

export class Git {
  constructor(repo) { this.repo = repo; }
  _run(args, { input, env, allowFail = false, buffer = false } = {}) {
    const p = spawnSync('git', ['-C', this.repo, ...args], {
      input, env: env ? { ...process.env, ...env } : process.env, timeout: 15000,
      encoding: buffer ? 'buffer' : 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
    if (p.error) throw new EcpError('GIT_UNAVAILABLE', p.error.message);
    if (p.status !== 0 && !allowFail) throw new EcpError('GIT_FAILED', `${args[0]}: ${String(p.stderr).slice(0, 300)}`);
    return p;
  }
  revParse(ref) {
    const out = this._run(['rev-parse', '--verify', `${ref}^{commit}`]).stdout.trim();
    if (!FULL_SHA.test(out)) throw new EcpError('GIT_FAILED', 'unexpected rev-parse output');
    return out;
  }
  hasCommit(sha) { return FULL_SHA.test(sha) && this._run(['cat-file', '-e', `${sha}^{commit}`], { allowFail: true }).status === 0; }
  /** true iff a == b or a is an ancestor of b */
  isAncestor(a, b) {
    if (a === b) return true;
    const p = this._run(['merge-base', '--is-ancestor', a, b], { allowFail: true });
    if (p.status === 0) return true;
    if (p.status === 1) return false;
    throw new EcpError('GIT_FAILED', 'merge-base failed');
  }
  diffNames(a, b) {
    const out = this._run(['diff', '--name-only', '--no-renames', `${a}..${b}`]).stdout.trim();
    return out ? out.split(/\r?\n/) : [];
  }
  lsTree(sha) {
    const out = this._run(['ls-tree', '-r', '--full-tree', sha]).stdout.trim();
    if (!out) return [];
    return out.split(/\r?\n/).map(line => {
      const [meta, path] = line.split('\t');
      const [mode, type, blob] = meta.split(' ');
      return { mode, type, blob, path };
    });
  }
  /** File bytes at a commit, or null if absent. */
  show(sha, path) {
    const p = this._run(['cat-file', 'blob', `${sha}:${path}`], { allowFail: true, buffer: true });
    return p.status === 0 ? p.stdout : null;
  }
  /** `git apply --check` against <base> using a temporary index; touches no worktree. */
  applyCheck(base, diffText) {
    const dir = mkdtempSync(join(tmpdir(), 'ecp-idx-'));
    try {
      const env = { GIT_INDEX_FILE: join(dir, 'index') };
      this._run(['read-tree', base], { env });
      const patch = join(dir, 'p.diff'); writeFileSync(patch, diffText);
      const p = this._run(['apply', '--cached', '--check', patch], { env, allowFail: true });
      return { applies: p.status === 0, detail: String(p.stderr).trim().slice(0, 300) };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
}
