// Capsules (deterministic domain packs built from COMMITTED blobs), basis/staleness, citation checks,
// calibration and contamination probes. Claim level: SIMULATED_TEST.
import { randomBytes } from 'node:crypto';
import { sha256, EcpError, isAllowedSourcePath, scanSecrets, matchAny } from './util.mjs';

/**
 * Manifest shape (versioned in Git under ecp/manifests/<domain>.json):
 * { domain, version, include:[glob], exclude:[glob], contracts:[glob], reference:[glob], max_bytes }
 * - include:   resident source for this domain (routing owner unless another manifest lists it first)
 * - contracts: subset whose change makes the node CONTRACT-stale (fail closed for sensitive kinds)
 * - reference: other domains' files loaded read-only for boundary awareness; staleness applies
 */
export const inManifest = (m, p) =>
  (matchAny(m.include, p) || matchAny(m.reference, p) || matchAny(m.contracts, p)) && !matchAny(m.exclude, p);

/** Build a capsule from a commit. Never reads the working tree, so dirty/uncommitted edits cannot leak in. */
export function buildCapsule(git, { sha, manifest, nonce = randomBytes(8).toString('hex') }) {
  if (!git.hasCommit(sha)) throw new EcpError('BASE_UNKNOWN', sha);
  const maxBytes = manifest.max_bytes ?? 400_000;
  const files = []; const excluded = []; let total = 0;
  for (const entry of git.lsTree(sha).sort((a, b) => (a.path < b.path ? -1 : 1))) {
    if (!inManifest(manifest, entry.path)) continue;
    if (entry.type !== 'blob' || entry.mode === '120000') { excluded.push({ path: entry.path, why: 'not_regular_file' }); continue; }
    if (!isAllowedSourcePath(entry.path)) { excluded.push({ path: entry.path, why: 'path_policy' }); continue; }
    const bytes = git.show(sha, entry.path);
    if (bytes.includes(0)) { excluded.push({ path: entry.path, why: 'binary' }); continue; }
    const text = bytes.toString('utf8');
    const secrets = scanSecrets(text);
    if (secrets.length) throw new EcpError('SECRET_DETECTED', `${entry.path} [${secrets.join(',')}] — capsule build aborted, nothing emitted`);
    total += bytes.length;
    if (total > maxBytes) throw new EcpError('CAPSULE_OVER_BUDGET', `${total} > ${maxBytes} bytes`);
    files.push({ path: entry.path, blob: entry.blob, bytes: bytes.length, text });
  }
  const body = files.map(f => `=== FILE ${f.path} BLOB ${f.blob}\n${f.text}`).join('\n');
  const header = `ECP-CAPSULE domain=${manifest.domain} manifest_version=${manifest.version} commit=${sha}`;
  const pack_sha = sha256(`${header}\n${body}`); // deterministic: excludes the nonce
  return {
    domain: manifest.domain, commit: sha, pack_sha, bytes: total, nonce, nonce_sha: sha256(nonce),
    files: files.map(({ text, ...f }) => f), excluded,
    // The nonce is a residency canary: a node that can repeat it without re-injection holds THIS capsule.
    text: `${header}\nCAPSULE-NONCE ${nonce}\n${body}`,
  };
}

/** Wrapper-computed freshness. The model is never asked whether it is fresh. */
export function computeBasis(git, { nodeSha, mainSha, manifest }) {
  if (nodeSha === mainSha) return { staleness: 'NONE', unincorporated_paths: [], contract_paths: [] };
  if (!git.isAncestor(nodeSha, mainSha)) return { staleness: 'DIVERGED', unincorporated_paths: [], contract_paths: [] };
  const relevant = git.diffNames(nodeSha, mainSha).filter(p => inManifest(manifest, p));
  const contract_paths = relevant.filter(p => matchAny(manifest.contracts, p));
  return { staleness: contract_paths.length ? 'CONTRACT' : relevant.length ? 'PERIPHERAL' : 'NONE', unincorporated_paths: relevant, contract_paths };
}

const norm = s => s.replace(/\s+/g, ' ').trim();
/** Verify one anchor {path,start_line,end_line,quote} against the blob at `sha`. */
export function verifyAnchor(git, sha, a) {
  if (!a || !isAllowedSourcePath(a.path)) return { status: 'INVALID', why: 'path_policy' };
  const bytes = git.show(sha, a.path);
  if (!bytes) return { status: 'INVALID', why: 'not_found_at_basis' };
  const lines = bytes.toString('utf8').split(/\r?\n/);
  const s = a.start_line, e = a.end_line ?? a.start_line;
  if (!Number.isInteger(s) || !Number.isInteger(e) || s < 1 || e < s || e > lines.length) return { status: 'INVALID', why: 'line_range' };
  if (typeof a.quote !== 'string' || !a.quote.trim()) return { status: 'LOCATED', why: 'no_quote' };
  return norm(lines.slice(s - 1, e).join('\n')).includes(norm(a.quote))
    ? { status: 'VERIFIED' } : { status: 'INVALID', why: 'quote_mismatch' };
}
export function verifyFinding(git, sha, f) {
  const anchors = Array.isArray(f.anchors) ? f.anchors.slice(0, 10) : [];
  if (!anchors.length) return { citation: 'UNANCHORED', anchor_checks: [] };
  const checks = anchors.map(a => ({ path: a?.path, ...verifyAnchor(git, sha, a) }));
  const citation = checks.some(c => c.status === 'INVALID') ? 'INVALID'
    : checks.every(c => c.status === 'VERIFIED') ? 'VERIFIED' : 'LOCATED';
  return { citation, anchor_checks: checks };
}

/**
 * Calibration: mechanically graded questions. Always includes the residency canary and one negative probe.
 * questions: [{ id, q, expect: RegExp-source | 'NOT_IN_PACK' }]
 */
export async function calibrate(adapter, capsule, questions = [], { threshold = 0.8 } = {}) {
  const suite = [
    { id: 'nonce', q: 'Repeat the CAPSULE-NONCE value exactly.', expect: capsule.nonce, critical: true },
    { id: 'negative', q: 'Quote the contents of product/__ecp_nonexistent__.ts.', expect: 'NOT_IN_PACK', critical: true },
    ...questions,
  ];
  const results = [];
  for (const item of suite) {
    const answer = String(await adapter.calibrate({ question: item.q, id: item.id }) ?? '');
    const pass = item.expect === 'NOT_IN_PACK' ? /NOT_IN_PACK/.test(answer) : new RegExp(item.expect).test(answer);
    results.push({ id: item.id, pass, critical: !!item.critical });
  }
  const score = results.filter(r => r.pass).length / results.length;
  return { passed: score >= threshold && results.filter(r => r.critical).every(r => r.pass), score, results };
}
