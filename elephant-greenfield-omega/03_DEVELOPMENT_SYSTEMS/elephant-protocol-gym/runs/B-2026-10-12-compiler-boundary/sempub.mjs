// sempub.mjs — Arm B minimal semantic compiler: publish once, project twice.
//
// SCOPE (deliberately small, per the Arm B brief):
//   It answers exactly one question with executable evidence — can a
//   version-pinned semantic fact be published ONCE and rendered into two
//   mutually source-linked projections (machine + human), with a deliberate
//   source mutation making the stale meaning VISIBLE?
//
// WHAT IT IS NOT:
//   - not a general TypeScript parser (see LIMITATIONS below)
//   - not a self-certifying oracle; OBSERVED means "this process ran it",
//     never "this is correct in general"
//   - not authorized to execute anything except the fixture it was pointed at,
//     and only to probe declared behavior, never to cause external effects
//
// EVIDENCE CLASSES (the whole point of the exercise):
//   DECLARED - asserted in a source doc comment. A human believed this.
//   DERIVED  - mechanically extracted from source structure by this tool.
//   OBSERVED - actually executed in this process, with a recorded receipt.
//   A DECLARED fact is never silently rendered as OBSERVED.

import {createHash} from 'node:crypto';

export const TOOL = 'sempub/0.1.0';
export const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

// Deterministic canonical serialization: sorted keys, no incidental whitespace.
// The publication digest must not depend on JS object key insertion order.
export function canon(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
}

// ---------------------------------------------------------------------------
// SOURCE INTAKE — static, deterministic, no external deps.
// ---------------------------------------------------------------------------

// Split a source text into 1-indexed lines while remembering exact offsets,
// so every derived fact can carry the precise byte range it came from.
function lineIndex(text) {
  const lines = text.split('\n');
  const starts = [];
  let off = 0;
  for (const l of lines) { starts.push(off); off += l.length + 1; }
  return {lines, starts};
}

const sliceOf = (idx, a, b) => idx.lines.slice(a - 1, b).join('\n');

// Find the line where a brace opened on `from` closes again.
function endOfBlock(idx, from) {
  let depth = 0;
  for (let i = from; i <= idx.lines.length; i++) {
    for (const ch of idx.lines[i - 1]) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) return i; }
    }
  }
  return idx.lines.length;
}

// Split a parameter list at top-level commas only, so a callback type like
// `(value: number) => void` stays in one piece.
function splitParams(s) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if ('([{<'.includes(ch)) depth++;
    else if (')]}>'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((p) => p.trim()).filter(Boolean);
}

export function extractFacts(text, sourcePath) {
  const idx = lineIndex(text);
  const facts = [];
  let open = null;        // doc comment currently being accumulated
  let nextDoc = null;     // completed doc comment awaiting its declaration
  let fileDoc = null;     // comment seen before the first export = file header
  let sawExport = false;

  // Close an accumulated comment: decide whether it documents the file or the
  // next declaration. Only a comment BEFORE the first `export` is file-level.
  const close = () => {
    if (!open) return;
    if (!sawExport && !fileDoc) fileDoc = open.text.trim();
    else nextDoc = open;
    open = null;
  };

  for (let n = 1; n <= idx.lines.length; n++) {
    const line = idx.lines[n - 1];

    // `/** text */` on one line: opens and closes together.
    const oneLine = line.match(/^\s*\/\*\*\s*(.*?)\s*\*\/\s*$/);
    if (oneLine) { open = {text: oneLine[1], line: n}; close(); continue; }
    // `/**` opens a multi-line comment.
    const openMatch = line.match(/^\s*\/\*\*\s*(.*?)\s*$/);
    if (openMatch) { open = {text: openMatch[1], line: n}; continue; }
    // A bare `*`/`*/` line continues or terminates an open comment.
    if (open) {
      const cont = line.match(/^\s*\*\/?\s*(.*?)\s*$/);
      if (cont) {
        if (/\*\/\s*$/.test(line)) { open.text += ' ' + cont[1]; close(); }
        else open.text += ' ' + cont[1];
        continue;
      }
    }

    const konst = line.match(/^export\s+const\s+([A-Za-z_$][\w$]*)\s*(?::\s*([^=]+?))?\s*=\s*(.+?);?\s*$/);
    if (konst) {
      const [, name, type, value] = konst;
      facts.push({
        id: `const.${name}`,
        kind: 'constant',
        subject: name,
        machine: {kind: 'constant', name, type: (type || 'inferred').trim(), literal: value.trim()},
        declared: nextDoc ? nextDoc.text.trim() : null,
        evidence: nextDoc ? 'DECLARED' : 'DERIVED',
        source: {path: sourcePath, lines: [n, n], sha256: sha256(sliceOf(idx, n, n))},
      });
      sawExport = true;
      nextDoc = null;
      continue;
    }

    const fn = line.match(/^export\s+function\s+([A-Za-z_$][\w$]*)\s*\((.*)\)\s*(?::\s*([^{]+?))?\s*\{\s*$/);
    if (fn) {
      const [, name, rawParams, ret] = fn;
      const end = endOfBlock(idx, n);
      const params = splitParams(rawParams).map((p) => {
        const m = p.match(/^([A-Za-z_$][\w$]*)\s*(?::\s*(.+))?$/);
        return m ? {name: m[1], type: (m[2] || 'inferred').trim()} : {name: p, type: 'inferred'};
      });
      const fact = {
        id: `fn.${name}`,
        kind: 'function',
        subject: name,
        machine: {
          kind: 'function',
          name,
          params,
          returns: (ret || 'inferred').trim(),
          body_sha256: sha256(sliceOf(idx, n, end)),
          body_lines: end - n + 1,
        },
        // A doc comment on a function is a human ASSERTION, not a verified
        // property. It is carried as DECLARED and can never upgrade itself.
        declared: nextDoc ? nextDoc.text.trim() : null,
        evidence: nextDoc ? 'DECLARED' : 'DERIVED',
        source: {path: sourcePath, lines: [n, end], sha256: sha256(sliceOf(idx, n, end))},
      };
      facts.push(fact);
      sawExport = true;
      nextDoc = null;
      n = end;
      continue;
    }
  }
  return {facts, fileDeclaration: fileDoc};
}

// ---------------------------------------------------------------------------
// PUBLICATION — one immutable, version-pinned meaning. Published exactly once.
// ---------------------------------------------------------------------------

export function coreOf({kind, generator, source, file_declaration, facts}) {
  return {
    kind,
    generator,
    source,
    file_declaration,
    facts: facts.map((f) => ({
      id: f.id,
      // `kind` is structural, not meaning-bearing, but a projection that
      // drops it will render every function as a constant. Carry it.
      kind: f.kind,
      subject: f.subject,
      machine: f.machine,
      declared: f.declared ?? null,
      evidence: f.evidence,
      witness: f.witness,
      source: f.source,
    })),
  };
}

export function publish({text, sourcePath, sourceSha256, facts, fileDeclaration, witnesses = {}}) {
  const source = {path: sourcePath, sha256: sourceSha256, bytes: Buffer.byteLength(text, 'utf8')};
  const core = coreOf({
    kind: 'elephant.semantic-publication/1',
    generator: TOOL,
    source,
    file_declaration: fileDeclaration,
    facts: facts.map((f) => ({...f, witness: witnesses[f.id] ?? null})),
  });
  const digest = sha256(canon(core));
  return {...core, publication_id: `pub_${digest.slice(0, 16)}`, digest};
}

// ---------------------------------------------------------------------------
// PROJECTIONS — two renderings of the SAME publication. Neither re-reads source.
// ---------------------------------------------------------------------------

export function projectMachine(pub, {humanView = 'human.md', machineView = 'machine.json'} = {}) {
  return {
    kind: 'elephant.semantic-projection.machine/1',
    projection_of: pub.publication_id,
    publication_digest: pub.digest,
    human_view: humanView,          // mutual link, machine -> human
    self_view: machineView,
    source: pub.source,
    facts: pub.facts.map((f) => ({
      id: f.id,
      subject: f.subject,
      meaning: f.machine,
      evidence: f.evidence,
      declared: f.declared,
      witness: f.witness,
      source: f.source,
      human_anchor: `#${f.id}`,    // mutual link, per-fact machine -> human
    })),
  };
}

export function projectHuman(pub, {machineView = 'machine.json'} = {}) {
  const L = [];
  L.push(`# Meaning publication \`${pub.publication_id}\``);
  L.push('');
  L.push(`- **Source:** \`${pub.source.path}\``);
  L.push(`- **Source sha256:** \`${pub.source.sha256}\` (${pub.source.bytes} bytes)`);
  L.push(`- **Publication digest:** \`${pub.digest}\``);
  L.push(`- **Machine view:** [\`${machineView}\`](${machineView})`);
  L.push(`- **Generated by:** ${pub.generator}`);
  L.push('');
  L.push('> Every claim below is labelled with how it is known. A *declared*');
  L.push('> contract is something a human wrote; it is **not** evidence the code');
  L.push('> enforces it. Read the *observed* rows before trusting a contract.');
  L.push('');
  if (pub.file_declaration) {
    L.push('## What the source file claims about itself');
    L.push('');
    L.push(`> ${pub.file_declaration}`);
    L.push('');
  }
  for (const f of pub.facts) {
    L.push(`<a id="${f.id}"></a>`);
    L.push(`## ${f.subject}`);
    L.push('');
    L.push(`**Evidence:** ${f.evidence} · **Machine anchor:** \`${machineView}\` fact \`${f.id}\` · **Source:** \`${f.source.path}:${f.source.lines[0]}-${f.source.lines[1]}\``);
    L.push('');
    if (f.kind === 'function') {
      const sig = `${f.machine.name}(${f.machine.params.map((p) => `${p.name}: ${p.type}`).join(', ')}): ${f.machine.returns}`;
      L.push(`**Plain reading.** This is an exported function. Its declared signature is \`${sig}\`. Its body spans ${f.machine.body_lines} lines.`);
      L.push('');
    } else {
      L.push(`**Plain reading.** This is an exported constant named \`${f.machine.name}\`, declared with type \`${f.machine.type}\` and value \`${f.machine.literal}\`.`);
      L.push('');
    }
    if (f.declared) {
      L.push(`**Declared by the author (not enforced unless witnessed below).** ${f.declared}`);
      L.push('');
    }
    if (f.witness) {
      L.push('**Observed in this run.**');
      L.push('');
      L.push('```json');
      L.push(JSON.stringify(f.witness, null, 2));
      L.push('```');
      L.push('');
    } else if (f.evidence !== 'OBSERVED') {
      L.push('**Observed:** _not probed in this run — no behavioural evidence is claimed for this fact._');
      L.push('');
    }
  }
  return L.join('\n');
}

// ---------------------------------------------------------------------------
// VERIFICATION — can drift be detected without re-deriving meaning?
// ---------------------------------------------------------------------------

export function verify({text, sourcePath, pub, machine, human}) {
  const idx = lineIndex(text);
  const currentFileSha = sha256(text);
  const checks = [];
  const add = (name, ok, detail) => checks.push({name, ok, detail});

  add('publication_digest_recomputes', pub.digest === sha256(canon(coreOf(pub))),
      `recomputed ${sha256(canon(coreOf(pub))).slice(0, 16)}… vs pinned ${pub.digest.slice(0, 16)}…`);
  add('source_file_still_matches_pinned_sha', currentFileSha === pub.source.sha256,
      `pinned ${pub.source.sha256.slice(0, 16)}… vs current ${currentFileSha.slice(0, 16)}…`);

  // PER-FACT staleness: the discriminating check. A mutation to one function
  // must invalidate that fact only — not the whole publication.
  const staleFacts = [];
  for (const f of pub.facts) {
    const cur = sha256(sliceOf(idx, f.source.lines[0], f.source.lines[1]));
    if (cur !== f.source.sha256) staleFacts.push(f.id);
  }
  add('per_fact_slices_unchanged', staleFacts.length === 0,
      staleFacts.length ? `stale: ${staleFacts.join(', ')}` : `all ${pub.facts.length} fact slices match source bytes`);

  // Projection binding: both views must carry the same digest and reference each other.
  add('machine_carries_publication_digest', machine.publication_digest === pub.digest,
      machine.publication_digest === pub.digest ? 'machine projection bound to publication' : 'MACHINE DIGEST MISMATCH');
  add('human_carries_publication_digest', human.includes(pub.digest), 'human projection carries the digest');
  add('machine_links_human', typeof machine.human_view === 'string' && machine.human_view.length > 0, machine.human_view);
  add('human_links_machine', human.includes(machine.self_view), machine.self_view);

  // Per-fact mutual linkage.
  const linkOk = pub.facts.every((f) =>
    human.includes(`id="${f.id}"`) && machine.facts.some((mf) => mf.id === f.id && mf.human_anchor === `#${f.id}`));
  add('every_fact_mutually_linked', linkOk, `${pub.facts.length} fact anchors present in both views`);

  // Honesty invariant: a fact with no witness must never show an "Observed"
  // block in the human view. Checked per fact-section, not globally.
  const honestyViolations = [];
  for (const f of pub.facts) {
    if (f.witness) continue;
    const start = human.indexOf(`id="${f.id}"`);
    if (start < 0) continue;
    const next = human.indexOf('<a id="', start + 1);
    const section = human.slice(start, next < 0 ? undefined : next);
    if (/Observed in this run/.test(section)) honestyViolations.push(f.id);
  }
  add('no_unwitnessed_fact_presented_as_observed', honestyViolations.length === 0,
      honestyViolations.length ? `violations: ${honestyViolations.join(', ')}` : 'no fact claims observed evidence it lacks a witness for');

  const green = checks.every((c) => c.ok === true);
  return {green, checks, staleFacts, currentFileSha};
}