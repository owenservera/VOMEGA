#!/usr/bin/env node
// SECTION 18 (S1) + DECISION 2 — claim-vs-code verification of the 17-family
// symbolic lexer, run as an EXISTING-CONTROL REPLAY against real repo source.
//
// Why this exists: the Round-0 synthesis marked L02 (pure TS NLCL) UNOBSERVED
// and Decision 2 "PARTIAL at best — no arm established that a new instrument
// beats an existing control". No arm ran the NLCL. Section 18 of the master
// makes specific, checkable CLAIMS about that code. This script tests whether
// the claims are true by executing the real module, not by reading it.
//
// ANTI-L11 DESIGN: a suite that has only ever returned PASS proves nothing, and
// a silent loader failure would render every assertion as a false "negative
// finding" (exactly the failure that hit three Round-0 arms). So:
//   - POSITIVE controls  : things that MUST be found (proves the loader works)
//   - NEGATIVE controls  : things that MUST NOT be found (proves discrimination)
//   - MUTATION control   : a real source copy with one family REMOVED must make
//                          the same detector report FAIL. Without this, a green
//                          run is unfalsifiable.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..', '..', '..', '..');
const SRC = path.join(repo, 'omega-baseline', 'plugins', 'vivim-nlcl-pure', 'src');

const imp = (p) => import(pathToFileURL(p).href);

const results = [];
const rec = (id, kind, claim, expected, observed, pass) =>
  results.push({ id, kind, claim, expected, observed, pass });

async function exercise(srcDir, label) {
  const symbols = await imp(path.join(srcDir, 'symbols.ts'));
  const lexer = await imp(path.join(srcDir, 'lexer.ts'));
  const { SYMBOL_FAMILIES, FAMILY_GLYPHS, FAMILY_BY_CHAR, normalizeFamilyGlyph } = symbols;
  const { lex } = lexer;

  // ---- C1: the source declares exactly 17 family identities -------------
  rec(
    `${label}/C1`,
    'claim',
    'Section 18: "symbols.ts declares the 17 families"',
    '17',
    String(SYMBOL_FAMILIES.length),
    SYMBOL_FAMILIES.length === 17
  );

  // ---- C2: the doc's explicit warning about naive counting -------------
  // "code should not determine '17' by naively counting FAMILY_GLYPHS"
  rec(
    `${label}/C2`,
    'claim',
    'Section 18: counting FAMILY_GLYPHS does NOT yield 17 (aliases inflate it)',
    '!=17 (expect 18)',
    String(FAMILY_GLYPHS.length),
    FAMILY_GLYPHS.length !== 17
  );

  // ---- C3: every declared family glyph lexes to its own family ----------
  const lost = [];
  for (const f of SYMBOL_FAMILIES) {
    const toks = lex(f.char).tokens;
    const hit = toks.find((t) => t.family === f.char);
    if (!hit) lost.push(`${f.char}(${f.name}) -> ${JSON.stringify(toks.map((t) => t.text))}`);
  }
  rec(
    `${label}/C3`,
    'claim',
    'Every one of the 17 family glyphs is recognised by the lexer',
    '0 lost',
    `${lost.length} lost${lost.length ? ': ' + lost.join('; ') : ''}`,
    lost.length === 0
  );

  // ---- C3b: the OTHER direction -----------------------------------------
  // C3 above is self-referential: it walks SYMBOL_FAMILIES and asks "is each
  // declared family lexable?". It therefore CANNOT detect a family that was
  // REMOVED — proven by the mutation control, where mutant/C3 stayed green.
  // C3b closes that blind spot: every glyph the lexer advertises in
  // FAMILY_GLYPHS must (a) belong to a declared family and (b) lex to that
  // declared family. A removed family now breaks this too.
  {
    const declared = new Set(SYMBOL_FAMILIES.map((f) => f.char));
    const orphanGlyphs = FAMILY_GLYPHS.filter((g) => !declared.has(normalizeFamilyGlyph(g) ?? g));
    const unlexable = [];
    for (const g of FAMILY_GLYPHS) {
      const want = normalizeFamilyGlyph(g);
      const t = lex(g).tokens[0];
      if (!t || !t.family || !declared.has(t.family)) unlexable.push(`${g}->${t?.family ?? 'none'}`);
    }
    const bad = [...orphanGlyphs.map((g) => `orphan:${g}`), ...unlexable.map((u) => `unlexable:${u}`)];
    rec(
      `${label}/C3b`,
      'claim',
      'Every advertised FAMILY_GLYPHS member maps to a DECLARED family (removal-detecting)',
      '0 orphan, 0 unlexable',
      bad.length ? bad.join('; ') : '0 orphan, 0 unlexable',
      bad.length === 0
    );
  }

  // ---- C4: Unicode aliases normalise to the canonical family ------------
  const aliasCases = [
    ['Δ', '∆'],
    ['∆', '∆'],
    ['✔', '✓'],
    ['✓', '✓'],
  ];
  const aliasBad = [];
  for (const [input, want] of aliasCases) {
    const got = normalizeFamilyGlyph(input);
    const tok = lex(input).tokens[0];
    if (got !== want || tok?.family !== want) {
      aliasBad.push(`${input}: normalize=${got} token=${tok?.family} want=${want}`);
    }
  }
  rec(
    `${label}/C4`,
    'claim',
    'Section 18: "aliases both delta glyphs ∆/Δ and check marks ✓/✔"',
    'all 4 alias cases normalise',
    aliasBad.length ? aliasBad.join('; ') : 'all 4 ok',
    aliasBad.length === 0
  );

  // ---- C5: arrow forms ---------------------------------------------------
  const arrowCases = ['->', '=>', '→', '>'];
  const arrowBad = arrowCases.filter((a) => {
    const t = lex(a).tokens[0];
    return !(t && t.kind === 'arrow' && t.family === '→');
  });
  rec(
    `${label}/C5`,
    'claim',
    'Section 18: lexer "recognizes -> => → > as arrow tokens"',
    'all 4 forms are arrow/→',
    arrowBad.length ? 'failed: ' + arrowBad.join(',') : 'all 4 ok',
    arrowBad.length === 0
  );

  // ---- C6: attach glyphs -------------------------------------------------
  const attachCases = [
    ['@peter', 'ref', '@'],
    ['/send', 'cmd', '/'],
    ['#urgent', 'tag', '#'],
    ['$draft', 'var', '$'],
  ];
  const attachBad = [];
  for (const [input, kind, family] of attachCases) {
    const t = lex(input).tokens[0];
    if (!(t && t.kind === kind && t.family === family)) {
      attachBad.push(`${input} -> ${JSON.stringify(t && [t.kind, t.family])} want ${kind}/${family}`);
    }
  }
  rec(
    `${label}/C6`,
    'claim',
    'Section 18: lexer "attaches @name, /cmd, #tag, $var"',
    'all 4 attach forms correct',
    attachBad.length ? attachBad.join('; ') : 'all 4 ok',
    attachBad.length === 0
  );

  // ---- C7: quoted glyphs stay literal (no silent meaning shift) ---------
  {
    const toks = lex("'✓ /send'").tokens;
    const fam = toks.filter((t) => t.family).map((t) => `${t.text}:${t.family}`);
    rec(
      `${label}/C7`,
      'claim',
      'A quoted glyph is preserved literally and gains no family (S1 falsifier)',
      '0 families inside quotes',
      fam.length ? 'LEAKED ' + fam.join(',') : '0 families (quote token only)',
      fam.length === 0
    );
  }

  // ---- C8: the D-217 source label the doc cites -------------------------
  {
    const text = fs.readFileSync(path.join(srcDir, 'symbols.ts'), 'utf8');
    rec(
      `${label}/C8`,
      'claim',
      'Section 18: symbols.ts is "labelled D-217 by source comment"',
      'D-217 present in header comment',
      text.includes('D-217') ? 'present' : 'ABSENT',
      text.includes('D-217')
    );
  }

  // ================= NEGATIVE CONTROLS (must hold) =======================
  // N1: a glyph outside the family set must NOT acquire a family.
  {
    const t = lex('§').tokens[0];
    rec(
      `${label}/N1`,
      'negative-control',
      'A non-family glyph (§) must not be assigned a family',
      'no family',
      t?.family === undefined ? 'no family (punct)' : `LEAKED family=${t.family}`,
      t?.family === undefined
    );
  }
  // N2: an alias must not exist as its own family identity.
  {
    const isOwnFamily = FAMILY_BY_CHAR.has('Δ') || FAMILY_BY_CHAR.has('✔');
    rec(
      `${label}/N2`,
      'negative-control',
      'Aliases Δ/✔ must not be independent family identities',
      'not in FAMILY_BY_CHAR',
      isOwnFamily ? 'PRESENT as own family (would double-count)' : 'absent (correct)',
      !isOwnFamily
    );
  }
  // N3: loader liveness — empty input and a plain word must behave sanely.
  //     Without this, a failed import would look like "no families found".
  {
    const empty = lex('');
    const word = lex('hello').tokens[0];
    const ok = Array.isArray(empty.tokens) && empty.tokens.length === 0 && word?.kind === 'word';
    rec(
      `${label}/N3`,
      'negative-control',
      'Loader liveness: empty input and a plain word lex sanely',
      '0 tokens for "", kind=word for "hello"',
      `empty=${empty.tokens.length} word=${word?.kind}`,
      ok
    );
  }
  // N4: discrimination self-test — an INVERTED assertion must fail.
  {
    const inverted = SYMBOL_FAMILIES.length === 18; // deliberately wrong
    rec(
      `${label}/N4`,
      'negative-control',
      'An inverted count assertion (families === 18) must FAIL',
      'false',
      String(inverted),
      inverted === false
    );
  }
}

// ---- Run against the real, unmodified source ------------------------------
await exercise(SRC, 'real');

// ---- MUTATION CONTROL: remove one family, detector must flip to FAIL ------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nlcl-mutant-'));
const copyDir = path.join(tmp, 'src');
fs.cpSync(SRC, copyDir, { recursive: true });
{
  const p = path.join(copyDir, 'symbols.ts');
  let text = fs.readFileSync(p, 'utf8');
  // delete the "~" (approximate) family entry entirely
  const before = text.length;
  text = text.replace(/\n\s*\{ char: "~", name: "approximate"[\s\S]*?\n\s*examples: \[[^\]]*\], colorHint: "orange" \},/, '');
  if (text.length === before) throw new Error('mutation did not apply — control is not testing anything');
  fs.writeFileSync(p, text);
}
await exercise(copyDir, 'mutant');
fs.rmSync(tmp, { recursive: true, force: true });

// ---- Verdict --------------------------------------------------------------
const byLabel = (l) => results.filter((r) => r.id.startsWith(l + '/'));
const real = byLabel('real');
const mutant = byLabel('mutant');
const mutantClaims = mutant.filter((r) => r.kind === 'claim');
const realClaims = real.filter((r) => r.kind === 'claim');
const realNeg = real.filter((r) => r.kind === 'negative-control');
const mutantNeg = mutant.filter((r) => r.kind === 'negative-control');

const discrimination = {
  real_all_claims_pass: realClaims.every((r) => r.pass),
  real_all_negative_controls_hold: realNeg.every((r) => r.pass),
  mutant_must_fail: mutantClaims.filter((r) => !r.pass).length,
  mutant_must_fail_expectation: '>=1 (C1 and C3 must both break when a family is removed)',
  mutant_controls_still_hold: mutantNeg.filter((r) => r.pass).length,
  mutant_controls_total: mutantNeg.length,
};
discrimination.mutant_detector_discriminates =
  discrimination.mutant_must_fail >= 1 &&
  discrimination.real_all_claims_pass &&
  discrimination.real_all_negative_controls_hold;

const failed = results.filter((r) => !r.pass && r.id.startsWith('real/'));
const verdict = failed.length === 0 && discrimination.mutant_detector_discriminates
  ? 'S1_CLAIMS_VERIFIED_AND_DETECTOR_DISCRIMINATES'
  : failed.length
    ? 'S1_CLAIM_FALSIFIED'
    : 'S1_UNPROVEN_DETECTOR_NOT_DISCRIMINATING';

const out = {
  schema: 'elephant-gym.master-exec.symbolic-s1.v1',
  source_root: path.relative(repo, SRC).split(path.sep).join('/'),
  disclosure: 'LEGACY-SEEDED REUSE — Section 18 (SYMBOLIC_LANGUAGE_INTAKE.md) was read; its claims are under test, not independently discovered.',
  results,
  discrimination,
  verdict,
};
fs.writeFileSync(path.join(here, 'symbolic-s1-output.json'), JSON.stringify(out, null, 2) + '\n');

console.log('SECTION 18 / S1 — claim-vs-code replay of the real NLCL lexer\n');
console.log('REAL SOURCE');
for (const r of real) console.log(`  [${r.pass ? 'PASS' : 'FAIL'}] ${r.id.padEnd(9)} ${r.claim}\n            ${r.observed}`);
console.log('\nMUTANT SOURCE (one family deleted — detector must break)');
for (const r of mutant.filter((r) => r.kind === 'claim')) {
  console.log(`  [${r.pass ? 'PASS' : 'FAIL'}] ${r.id.padEnd(11)} ${r.observed}`);
}
console.log('\n' + JSON.stringify(discrimination, null, 2));
console.log(`\nVERDICT: ${verdict}`);
process.exit(verdict === 'S1_CLAIMS_VERIFIED_AND_DETECTOR_DISCRIMINATES' ? 0 : 1);