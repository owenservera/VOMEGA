// Sealed bundles: AES-256-GCM over a directory, so a hidden oracle can be AUTHORED by someone other than the agent
// that plays the arms, travel inside the pack, and be opened only at EVALUATE with a key the human withholds.
//
//   node team/tools/seal.mjs seal   <dir> <out.sealed> [--key <64 hex>] [--label "<text>"]   # prints the key ONCE if generated
//   node team/tools/seal.mjs info   <file.sealed>                                            # header + sha256, no decryption
//   node team/tools/seal.mjs unseal <file.sealed> <outDir> --key <64 hex>                    # refuses a non-empty outDir
//
// File format (JSON): { format:"omega-seal/1", alg:"aes-256-gcm", label, key_fingerprint, iv, tag, ct }
//  * key_fingerprint = first 16 hex of sha256("omega-seal-key:" + keyHex): lets a wrong key fail fast; reveals nothing usable.
//  * The header fields are bound as AAD, so relabelling a sealed file breaks authentication.
//  * Payload = canonical JSON {files:{<relpath>: <base64>}}; unseal writes exactly those files.
//
// What sealing proves: the content existed, unchanged, when the sha256 was recorded (e.g. in the MANIFEST_FROZEN gate),
// and decrypting it requires the key. What it does NOT prove: that nobody holding the key looked early. With the key
// withheld until after GATE ARMS_SEALED, an agent cannot have read the oracle while playing arms.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, lstatSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const sha = b => createHash('sha256').update(b).digest('hex');
export const fingerprint = keyHex => sha(`omega-seal-key:${keyHex.toLowerCase()}`).slice(0, 16);
const HEADER_KEYS = ['format', 'alg', 'label', 'key_fingerprint'];
const aad = h => Buffer.from(JSON.stringify(HEADER_KEYS.map(k => h[k])));

function checkKey(keyHex) {
  if (typeof keyHex !== 'string' || !/^[0-9a-f]{64}$/i.test(keyHex)) throw new Error('key must be 64 hex characters (32 bytes)');
  return Buffer.from(keyHex, 'hex');
}

function collect(dir) {
  const files = {};
  const walk = d => {
    for (const name of readdirSync(d).sort()) {
      const full = join(d, name); const st = lstatSync(full);
      if (st.isSymbolicLink()) throw new Error(`refusing to seal a symlink: ${full}`);
      if (st.isDirectory()) walk(full); else files[relative(dir, full).split(sep).join('/')] = readFileSync(full).toString('base64');
    }
  };
  walk(dir);
  return files;
}

export function sealDir(dir, outFile, { key = randomBytes(32).toString('hex'), label = '' } = {}) {
  const k = checkKey(key);
  const files = collect(dir);
  const payload = Buffer.from(JSON.stringify({ files: Object.fromEntries(Object.keys(files).sort().map(p => [p, files[p]])) }));
  const header = { format: 'omega-seal/1', alg: 'aes-256-gcm', label, key_fingerprint: fingerprint(key) };
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', k, iv); c.setAAD(aad(header));
  const ct = Buffer.concat([c.update(payload), c.final()]);
  const sealed = { ...header, iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), ct: ct.toString('base64') };
  const text = `${JSON.stringify(sealed)}\n`;
  writeFileSync(outFile, text);
  return { key, key_fingerprint: header.key_fingerprint, sha256: sha(text), files: Object.keys(files).length };
}

export function info(file) {
  const text = readFileSync(file, 'utf8'); const s = JSON.parse(text);
  return { format: s.format, alg: s.alg, label: s.label, key_fingerprint: s.key_fingerprint, sha256: sha(text), ct_bytes: Buffer.from(s.ct, 'base64').length };
}

export function unsealToMemory(file, key) {
  const k = checkKey(key);
  const s = JSON.parse(readFileSync(file, 'utf8'));
  if (s.format !== 'omega-seal/1' || s.alg !== 'aes-256-gcm') throw new Error(`unsupported sealed format ${s.format}/${s.alg}`);
  if (fingerprint(key) !== s.key_fingerprint) throw new Error(`WRONG_KEY: fingerprint ${fingerprint(key)} != ${s.key_fingerprint} (label: ${s.label})`);
  const d = createDecipheriv('aes-256-gcm', k, Buffer.from(s.iv, 'base64'));
  d.setAAD(aad(s)); d.setAuthTag(Buffer.from(s.tag, 'base64'));
  let pt;
  try { pt = Buffer.concat([d.update(Buffer.from(s.ct, 'base64')), d.final()]); } catch { throw new Error('TAMPERED: authentication failed (content or header changed)'); }
  return JSON.parse(pt.toString('utf8')).files;
}

export function unseal(file, outDir, key) {
  const files = unsealToMemory(file, key);
  if (existsSync(outDir) && readdirSync(outDir).length) throw new Error(`outDir not empty: ${outDir}`);
  for (const [p, b64] of Object.entries(files)) {
    if (p.startsWith('/') || p.split('/').includes('..')) throw new Error(`unsafe path in sealed bundle: ${p}`);
    const full = join(outDir, p); mkdirSync(dirname(full), { recursive: true }); writeFileSync(full, Buffer.from(b64, 'base64'));
  }
  return { ok: true, files: Object.keys(files).length, sealed_sha256: sha(readFileSync(file)), key_fingerprint: fingerprint(key), out: outDir };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
  try {
    const [cmd, a, b] = args; let out;
    if (cmd === 'seal') out = sealDir(a, b, { ...(val('--key') ? { key: val('--key') } : {}), label: val('--label') ?? '' });
    else if (cmd === 'info') out = info(a);
    else if (cmd === 'unseal') out = unseal(a, b, val('--key'));
    else { console.error('usage: seal.mjs seal <dir> <out> [--key hex] [--label t] | info <file> | unseal <file> <outDir> --key hex'); process.exit(2); }
    console.log(JSON.stringify(out, null, 2));
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
