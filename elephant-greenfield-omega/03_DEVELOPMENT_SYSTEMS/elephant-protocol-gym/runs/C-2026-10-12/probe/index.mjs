// RUN C — Shared substrate: a source-pinned index over the fixture.
//
// This is the "source-pinned index" the RUN_C prompt describes as a possible
// no-protocol control. Both competing vocabularies (V1 verbs, V2 predicates)
// sit on top of THIS SAME substrate, so any difference between them is a
// difference in the OPERATION SURFACE, not in the underlying data.
//
// HONEST LIMITATION: the symbol scan below is lexical regex, not a TypeScript
// AST. That is a deliberate scope limit for a 32-line file, not a parser claim.
// Recorded in `index.limits` so downstream consumers can discount it.

import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const gymRoot = resolve(here, '..', '..', '..');

export function buildIndex(fixtureArg) {
  const fixturePath = resolve(fixtureArg ?? join(gymRoot, 'fixture/001-semantic-basics.ts'));
  const raw = readFileSync(fixturePath);
  const text = raw.toString('utf8');
  const sha256 = createHash('sha256').update(raw).digest('hex');

  // --- symbols: name -> {kind, line, signature, doc} -----------------------
  const symbols = new Map();
  const add = (name, data) => symbols.set(name, {name, sha256, ...data});

  const lineOf = (idx) => text.slice(0, idx).split('\n').length;

  // Find the matching ')' for the '(' at `open`, honouring nesting. Needed because
  // `repeat(count: number, emit: (value: number) => void)` contains a nested paren;
  // a non-greedy [^)]* pattern silently fails to index that declaration.
  const matchParen = (open) => {
    let depth = 0;
    for (let i = open; i < text.length; i++) {
      const c = text[i];
      if (c === '(') depth++;
      else if (c === ')') { depth--; if (depth === 0) return i; }
    }
    return -1;
  };

  // exported functions
  const fnRe = /^export\s+function\s+(\w+)\s*\(/gm;
  for (const m of text.matchAll(fnRe)) {
    const parenOpen = m.index + m[0].length - 1;
    const parenClose = matchParen(parenOpen);
    if (parenClose === -1) continue;
    const params = text.slice(parenOpen + 1, parenClose).trim();
    // return type runs from ':' after the parens to the body '{'
    const braceOpen = text.indexOf('{', parenClose);
    const between = text.slice(parenClose + 1, braceOpen === -1 ? undefined : braceOpen);
    const retMatch = between.match(/:\s*([^{]*)$/);
    const ret = retMatch ? retMatch[1].trim() : '(inferred)';
    add(m[1], {
      kind: 'function',
      line: lineOf(m.index),
      signature: `${m[1]}(${params}): ${ret}`,
      params: splitTopLevel(params).map((s) => s.trim()).filter(Boolean),
    });
  }

  // Split a parameter list on top-level commas only (ignores commas nested in
  // function types, generics, or object literals).
  function splitTopLevel(s) {
    const out = [];
    let depth = 0, cur = '';
    for (const ch of s) {
      if ('([{<'.includes(ch)) depth++;
      else if (')]}>'.includes(ch)) depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }
  // exported consts
  const constRe = /^export const (\w+)\s*(?::\s*([^=]+))?=\s*([^;]+);/gm;
  for (const m of text.matchAll(constRe)) {
    add(m[1], {
      kind: 'const',
      line: text.slice(0, m.index).split('\n').length,
      signature: `${m[1]}${m[2] ? `: ${m[2].trim()}` : ''} = ${m[3].trim()}`,
    });
  }

  // --- doc comments: what the SOURCE CLAIMS (kept strictly separate) --------
  // A doc comment immediately preceding a declaration is a CLAIM, never a fact.
  const lines = text.split('\n');
  const claims = new Map();
  for (const [name, sym] of symbols) {
    const start = sym.line - 2; // 0-indexed line above the declaration
    const block = [];
    for (let i = start; i >= 0 && i >= start - 4; i--) {
      const l = lines[i] ?? '';
      const t = l.trim();
      if (t === '') continue;
      if (t.endsWith('*/')) { block.unshift(t); break; }
      block.unshift(t);
    }
    if (block.length) {
      claims.set(name, {
        text: block.join(' ')
          .replace(/^\/\*+/, '').replace(/\*\/$/, '')
          .replace(/^\s*\*\s?/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
        line: start + 1,
        epistemicStatus: 'CLAIMED_BY_AUTHOR_NOT_MECHANICALLY_VERIFIED',
      });
    }
  }

  // --- relationships: who calls whom (lexical, within this file) ------------
  const edges = [];
  for (const [name, sym] of symbols) {
    if (sym.kind !== 'function') continue;
    const body = bodyOf(text, sym);
    for (const [other] of symbols) {
      if (other === name) continue;
      if (new RegExp(`\\b${other}\\s*\\(`).test(body)) {
        edges.push({from: name, to: other, kind: 'calls', basis: 'lexical-match'});
      }
    }
  }

  // --- external references: anything in the repo that names these symbols ---
  const externalRefs = [];
  for (const name of symbols.keys()) {
    const re = new RegExp(`\\b${name}\\b`, 'g');
    let count = 0;
    for (const l of lines) if (re.test(l) && !l.includes('export function') && !l.includes('export const')) count++;
    externalRefs.push({symbol: name, inFileNonDeclarationMentions: count});
  }

  return {
    fixture: {
      path: fixturePath,
      sha256,
      bytes: raw.length,
      pin: `${sha256.slice(0, 16)}`,
    },
    symbols,
    claims,
    edges,
    externalRefs,
    limits: {
      parsing: 'lexical regex, NOT a TypeScript AST',
      scope: 'single file; no cross-file resolution, no type inference',
      whatThisCannotDo: [
        'infer types beyond what is written in the signature',
        'know whether a declaration has any caller outside this file',
        'distinguish an enforced precondition from a documented one',
      ],
    },
  };
}

function bodyOf(text, sym) {
  const lines = text.split('\n');
  const start = sym.line;             // 1-indexed declaration line
  let out = '';
  for (let i = start; i < lines.length; i++) {
    if (i > start && /^\}/.test(lines[i])) break;
    out += lines[i] + '\n';
  }
  return out;
}

// Load the executed ground truth produced by groundtruth.mjs. This is the ONLY
// source of witnessed facts. A vocabulary may not invent behaviour.
export function loadGroundTruth() {
  const p = join(here, '..', 'evidence', 'groundtruth.json');
  if (!existsSync(p)) {
    throw new Error('groundtruth.json missing — run `node probe/groundtruth.mjs` first');
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}