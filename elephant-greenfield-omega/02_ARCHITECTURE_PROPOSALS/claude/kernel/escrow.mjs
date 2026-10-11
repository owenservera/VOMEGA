// Patch escrow: Elephant-authored code is DATA. It is validated, content-addressed and stored immutably;
// only a worker applies it, in the worker's own worktree. Claim level: SIMULATED_TEST.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { sha256, isAllowedSourcePath, matchAny, scanSecrets } from './util.mjs';

// Paths an Elephant patch may not touch unless the request explicitly scopes them.
export const PROTECTED = ['**/*.test.*', 'tests/**', '**/tests/**', '.github/**', 'ci/**', 'ecp/**', '**/package.json', '**/Cargo.toml', '**/tauri.conf.json'];

export function validatePatch(diff, { allowlist = [], scopeProtected = false, maxBytes = 64_000 } = {}) {
  const violations = [];
  if (typeof diff !== 'string' || !diff.trim()) return { ok: false, violations: ['empty_patch'], files: [] };
  if (Buffer.byteLength(diff) > maxBytes) violations.push('oversized');
  if (/^GIT binary patch|^Binary files /m.test(diff)) violations.push('binary_content');
  if (/^(old|new) mode |^(new|deleted) file mode 120000/m.test(diff)) violations.push('mode_or_symlink_change');
  if (/^(rename|copy) (from|to) /m.test(diff)) violations.push('rename_or_copy');
  const files = new Set();
  for (const m of diff.matchAll(/^(?:---|\+\+\+) (?:[ab]\/)?(.+)$/gm)) if (m[1] !== '/dev/null') files.add(m[1].trim());
  for (const m of diff.matchAll(/^diff --git a\/(\S+) b\/(\S+)$/gm)) { files.add(m[1]); files.add(m[2]); }
  if (!files.size) violations.push('no_file_headers');
  for (const f of files) {
    if (!isAllowedSourcePath(f)) violations.push(`path_policy:${f}`);
    else if (!matchAny(allowlist, f)) violations.push(`outside_allowlist:${f}`);
    else if (!scopeProtected && matchAny(PROTECTED, f)) violations.push(`protected_path:${f}`);
  }
  const added = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).join('\n');
  for (const s of scanSecrets(added)) violations.push(`secret:${s}`);
  return { ok: violations.length === 0, violations, files: [...files].sort(), escrow_id: sha256(diff) };
}

/** Store immutably; `wx` makes a second write of the same id fail instead of overwriting. */
export function storeEscrow(dir, diff) {
  mkdirSync(dir, { recursive: true });
  const id = sha256(diff);
  try { writeFileSync(join(dir, `${id}.diff`), diff, { flag: 'wx' }); } catch (e) { if (e.code !== 'EEXIST') throw e; }
  return id;
}
