// ECP v0.2 kernel — shared utilities. Node >= 20 standard library only.
// Claim level: SIMULATED_TEST (exercised by kernel.test.mjs; no live provider).
import { createHash } from 'node:crypto';

export const sha256 = data => createHash('sha256').update(data).digest('hex');

/** Canonical JSON: sorted keys, no whitespace. Used for fingerprints and the journal hash chain. */
export function canon(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canon).join(',')}]`;
  const keys = Object.keys(value).filter(k => value[k] !== undefined).sort();
  return `{${keys.map(k => `${JSON.stringify(k)}:${canon(value[k])}`).join(',')}}`;
}

export class EcpError extends Error {
  constructor(code, detail = '') { super(`${code}${detail ? `: ${detail}` : ''}`); this.code = code; }
}

export const FULL_SHA = /^[a-f0-9]{40}([a-f0-9]{24})?$/i;

// Hard path policy: relative, forward-slash, no traversal, no secret-bearing or binary locations.
const DENY_SEGMENT = /(^|\/)(\.git|\.env(\..*)?|node_modules|\.local|local|secrets?|credentials?|cookies?|browser-profile|dev-vault|\.ssh|\.aws|\.azure|\.config)(\/|$)/i;
const DENY_SUFFIX = /\.(pem|key|p12|pfx|kdbx|sqlite|db|zip|7z|bin|exe|dll|so|dylib|png|jpe?g|gif|ico|pdf)$/i;
export function isAllowedSourcePath(p) {
  return typeof p === 'string' && p.length > 0 && p.length < 512 && !p.includes('\\') && !p.includes('\0') &&
    !p.startsWith('/') && !/^[a-z]:/i.test(p) && !p.split('/').some(s => s === '..' || s === '.' || s === '') &&
    !DENY_SEGMENT.test(p) && !DENY_SUFFIX.test(p);
}

// Heuristic secret scan. Fail-closed on match. NOT a substitute for a dedicated scanner (gitleaks etc.).
const SECRET_PATTERNS = [
  ['private_key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['aws_access_key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github_token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['api_key_sk', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['slack_token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['assigned_secret', /\b(api[_-]?key|secret|passw(or)?d|auth[_-]?token)\s*[:=]\s*['"][^'"\s]{8,}['"]/i],
];
export function scanSecrets(text) {
  const hits = [];
  for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) hits.push(name);
  return hits;
}

/** Minimal glob: `**` spans segments, `*` and `?` stay within one segment. */
export function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      if (glob[i + 2] === '/') { re += '(?:.*/)?'; i += 2; } else { re += '.*'; i += 1; }
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}
export const matchAny = (globs = [], path) => globs.some(g => globToRegex(g).test(path));
