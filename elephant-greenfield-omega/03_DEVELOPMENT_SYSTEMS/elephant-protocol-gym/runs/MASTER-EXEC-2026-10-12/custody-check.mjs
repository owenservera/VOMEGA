#!/usr/bin/env node
// Custody verification for built/FULL_DRY_RUN_PROMPT_ALL.md.
//
// The master embeds each canonical source between
//   <!-- BEGIN VERBATIM <relpath> sha256:<hex> bytes:<n> -->
//   ...section title + "*Source: `relpath`*" wrapper...
//   <!-- END VERBATIM <relpath> -->
//
// For each section this re-hashes the ON-DISK source file and compares it to the
// sha256 the master claims. It also byte-compares the embedded fenced/extracted
// body against the source where the master fenced it, so a master that merely
// *claims* a correct hash is caught.
//
// This script imports nothing from any arm. It is a custody instrument only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gym = path.resolve(here, '..', '..');
const masterPath = path.join(gym, 'built', 'FULL_DRY_RUN_PROMPT_ALL.md');

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const master = fs.readFileSync(masterPath, 'utf8');
const lines = master.split(/\r?\n/);

const report = {
  schema: 'elephant-gym.master-exec.custody.v1',
  master: path.relative(gym, masterPath).split(path.sep).join('/'),
  master_sha256: sha(fs.readFileSync(masterPath)),
  master_bytes: fs.statSync(masterPath).size,
  method: 're-hash on-disk source; compare to master claim; also compare embedded body when extractable',
  sections: [],
  summary: {},
};

const BEGIN = /^<!-- BEGIN VERBATIM (.+?) sha256:([a-f0-9]{64}) bytes:(\d+) -->$/;

for (let i = 0; i < lines.length; i++) {
  const m = BEGIN.exec(lines[i]);
  if (!m) continue;
  const [, rel, claimedSha, claimedBytes] = m;

  // find the matching END marker, tolerating both `X` and `X.md` spellings
  let endIdx = -1;
  for (let j = i + 1; j < lines.length; j++) {
    if (new RegExp(`^<!-- END VERBATIM ${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} -->$`).test(lines[j])) {
      endIdx = j;
      break;
    }
  }

  const sec = {
    n: report.sections.length + 1,
    rel,
    claimed_sha256: claimedSha,
    claimed_bytes: Number(claimedBytes),
    begin_line: i + 1,
    end_line: endIdx === -1 ? null : endIdx + 1,
    end_marker_found: endIdx !== -1,
  };

  const abs = path.resolve(gym, rel);
  sec.resolved_path = path.relative(gym, abs).split(path.sep).join('/');
  sec.source_exists = fs.existsSync(abs) && fs.statSync(abs).isFile();

  if (!sec.source_exists) {
    sec.verdict = 'SOURCE_MISSING';
  } else {
    const buf = fs.readFileSync(abs);
    sec.actual_sha256 = sha(buf);
    sec.actual_bytes = buf.length;
    sec.sha_match = sec.actual_sha256 === claimedSha;
    sec.bytes_match = sec.actual_bytes === sec.claimed_bytes;
    sec.verdict = sec.sha_match && sec.bytes_match ? 'CUSTODY_OK' : 'CUSTODY_FAIL';
  }

  // Body comparison. Two embedding shapes, both produced by the assembler:
  //   fenced  — ```lang\n<raw source>\n```
  //   inline  — [blank][## <display title>][blank][*Source: `rel` ...*][blank]<raw source>
  // The inline prefix length is NOT assumed: we locate the "*Source:" line and
  // take everything after the single blank line that follows it.
  if (endIdx !== -1 && sec.source_exists) {
    const src = fs.readFileSync(abs, 'utf8');
    const bodyLines = lines.slice(i + 1, endIdx);
    const body = bodyLines.join('\n');
    const normalised = (s) => s.replace(/\r\n/g, '\n').replace(/\s+$/, '');

    // Uniform rule, learned the hard way. Both shapes carry the assembler's
    // "*Source:" wrapper. After it, the remainder is EITHER the raw source
    // (inline .md) OR a fenced block. A .md source may itself contain code
    // fences, so a lazy "first fence anywhere" regex is wrong in both
    // directions: it grabs inner blocks for inline docs and misses the wrapper
    // for fenced ones. Detect the wrapper first, then strip exactly one fence.
    const srcLineIdx = bodyLines.findIndex((l) => /^\*Source:\s*`/.test(l));
    if (srcLineIdx === -1) {
      sec.body_embedded = 'unrecognised';
      sec.body_matches_source = false;
      sec.body_note = 'no *Source:* wrapper line found';
    } else {
      let start = srcLineIdx + 1;
      // Skip ALL blank separator lines: fenced bodies are separated by one
      // blank, inline bodies by two. Assuming a fixed count mis-parses one shape.
      while (start < bodyLines.length && bodyLines[start].trim() === '') start++;
      let rest = bodyLines.slice(start);
      // Drop trailing blank lines BEFORE testing for a closing fence: the
      // assembler leaves one before the END marker.
      while (rest.length && rest[rest.length - 1].trim() === '') rest.pop();
      let fenced = false;
      if (
        rest.length >= 2 &&
        /^```[a-zA-Z0-9]*$/.test(rest[0].trim()) &&
        rest[rest.length - 1].trim() === '```'
      ) {
        rest = rest.slice(1, rest.length - 1);
        fenced = true;
      }
      sec.body_embedded = fenced ? 'fenced' : 'inline';
      sec.body_prefix_lines = start;
      sec.body_matches_source = normalised(rest.join('\n')) === normalised(src);

      // Documented deviation: the assembler prepends a DISCLOSURE banner to
      // sections declared `disclose: true` (tools/build-full-dry-run-prompt.mjs:96).
      // That makes the embedded body NOT byte-identical to the attested source,
      // while the sha256 still correctly describes the source file. Classify it
      // explicitly rather than loosening the comparison.
      if (!sec.body_matches_source) {
        const banner =
          '> **DISCLOSURE RULE:** if your run reads this document, the run note must say so and mark the affected result **LEGACY-SEEDED REUSE**, not a blind discovery.';
        const body = normalised(rest.join('\n'));
        if (body.startsWith(banner + '\n\n') && body.slice(banner.length + 2) === normalised(src)) {
          sec.body_matches_source = true;
          sec.body_deviation = 'DISCLOSURE_BANNER_PREPENDED_BY_ASSEMBLER';
          sec.body_deviation_source =
            'tools/build-full-dry-run-prompt.mjs:96 (section declared disclose:true)';
        }
      }

      if (!sec.body_matches_source) {
        const a = normalised(rest.join('\n')).split('\n');
        const b = normalised(src).split('\n');
        let k = 0;
        while (k < a.length && k < b.length && a[k] === b[k]) k++;
        sec.first_diff_line = k + 1;
        sec.first_diff_embedded = (a[k] ?? '<eof>').slice(0, 90);
        sec.first_diff_source = (b[k] ?? '<eof>').slice(0, 90);
      }
    }
  }

  report.sections.push(sec);
}

const ok = report.sections.filter((s) => s.verdict === 'CUSTODY_OK');
const fail = report.sections.filter((s) => s.verdict === 'CUSTODY_FAIL');
const missing = report.sections.filter((s) => s.verdict === 'SOURCE_MISSING');
const bodyBad = report.sections.filter((s) => s.body_matches_source === false);
const bodyUnchecked = report.sections.filter((s) => s.body_matches_source === undefined);

report.summary = {
  sections_total: report.sections.length,
  custody_ok: ok.length,
  custody_fail: fail.length,
  source_missing: missing.length,
  body_verified: report.sections.length - bodyBad.length - bodyUnchecked.length,
  body_mismatch: bodyBad.length,
  body_not_comparable: bodyUnchecked.length,
  all_end_markers_found: report.sections.every((s) => s.end_marker_found),
  verdict:
    fail.length || missing.length || bodyBad.length
      ? 'CUSTODY_BROKEN'
      : report.sections.length === 26
        ? 'ALL_26_SECTIONS_CUSTODY_OK'
        : 'UNEXPECTED_SECTION_COUNT',
};

const out = process.argv.includes('--json')
  ? path.join(here, 'custody-check-output.json')
  : null;
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');

const line = (s) =>
  `${String(s.n).padStart(2)}  ${s.verdict.padEnd(14)} ${String(s.actual_sha256 ?? '-').slice(0, 12)}  ${String(
    s.actual_bytes ?? '-'
  ).padStart(6)}  ${s.rel}${s.body_matches_source === false ? '   [BODY MISMATCH]' : ''}${
    s.body_matches_source === true ? '  [body ok]' : ''
  }`;

console.log(`master: ${report.master}`);
console.log(`sha256: ${report.master_sha256}  bytes: ${report.master_bytes}\n`);
for (const s of report.sections) console.log(line(s));
console.log('\n' + JSON.stringify(report.summary, null, 2));
if (out) console.log(`\nwrote ${path.relative(gym, out)}`);
process.exit(report.summary.verdict === 'ALL_26_SECTIONS_CUSTODY_OK' ? 0 : 1);