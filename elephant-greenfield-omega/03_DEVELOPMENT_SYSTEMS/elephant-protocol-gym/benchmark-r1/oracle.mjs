// Benchmark R1 — executable oracle. PRELIMINARY: prepared, NOT RUN as a benchmark.
//
// WHAT THIS IS: ground truth for R1, derived by EXECUTING the real pinned source rather
// than by reading it or by trusting any cold reader's report. R1's whole point is
// measuring declared-vs-actual divergence recall, so the scoring authority has to be
// independent of the agents being scored. Arm D established in Round 0 that
// self-reported "executed: true" cannot be falsified from an artifact.
//
// WHAT THIS IS NOT: it does not run cold readers, it does not score them, and it does not
// produce a recall number. Nothing here is a result. R1 remains BLOCKED on owner budget.
//
// MEASUREMENT DISCIPLINE (Round 1, mandatory): timing and token subscores are
// DESCRIPTIVE ONLY in a first run. Only recall and false-attribution may gate, because
// those are deterministic. A wall-clock gate needs a re-verified calibration envelope or
// it is a fact about the machine, not about the source — that exact mistake produced a
// 4000 ms "did not return" claim about the fixture that was really about the machine.
//
// Usage:
//   node oracle.mjs            # print derived ground truth
//   node oracle.mjs --check    # self-check: ground truth still holds
//   node oracle.mjs --negative-control   # prove the detectors discriminate
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const gymRoot = resolve(here, '..');
// benchmark-r1 -> elephant-protocol-gym -> 03_DEVELOPMENT_SYSTEMS -> elephant-greenfield-omega -> VOMEGA
const repoRoot = resolve(here, '..', '..', '..', '..');
const cohortRel = 'omega-baseline/plugins/vivim-nlcl-pure';
const cohort = join(repoRoot, cohortRel);
const sha256 = b => createHash('sha256').update(b).digest('hex');

// --- custody ----------------------------------------------------------------
// Truth about WHICH bytes this ground truth describes. Read from the git blob rather than
// the working tree, because a working tree can differ from the commit and a path-filtered
// diff can print nothing while a file has changed.
function cohortCustody() {
  const files = execFileSync('git', ['ls-files', cohortRel], {cwd: repoRoot, encoding: 'utf8'})
    .split('\n').filter(Boolean);
  const rows = files.map(rel => {
    const blob = execFileSync('git', ['cat-file', '-p', ':' + rel], {cwd: repoRoot, maxBuffer: 64 * 1024 * 1024});
    return {path: rel.replace(cohortRel + '/', ''), sha256: sha256(blob), bytes: blob.length};
  });
  const fingerprint = sha256(rows.map(r => `${r.path}:${r.sha256}`).sort().join('\n'));
  return {files: rows.length, fingerprint, rows};
}

// --- ground truth, derived by execution -------------------------------------
export async function derive() {
  const symbols = await import(pathToFile(cohort, 'src/symbols.ts'));
  const lexer = await import(pathToFile(cohort, 'src/lexer.ts'));
  const types = await import(pathToFile(cohort, 'src/types.ts'));

  const truth = [];

  // GT1 — the advertised glyph LIST and the declared family COUNT disagree, because the
  // glyph list carries alias entries. Anyone counting glyphs gets 18, not 17.
  // Precise composition, measured rather than assumed. My first attempt asserted a surplus
  // of 2 on the reasoning "Δ/∆ and ✔/✓ are both alias pairs" — that was WRONG, and the N4
  // control caught it. The real shape:
  //   18 glyph entries, 17 declared families
  //   16 glyphs ARE declared families (14 punctuation + the two canonical ∆ and ✓)
  //    2 glyphs (Δ, ✔) are aliases that lex to ∆ and ✓
  //    1 declared family (→) has NO single-glyph entry; it is spelled multi-character
  // The invariant that actually holds is: glyphs-that-are-declared + families-without-a-glyph
  // === declared count. Asserting the raw counts instead would let the composition drift.
  const declaredChars = symbols.SYMBOL_FAMILIES.map(f => f.char);
  const declaredSet = new Set(declaredChars);
  const glyphIsDeclared = symbols.FAMILY_GLYPHS.filter(g => declaredSet.has(g));
  const aliasGlyphs = symbols.FAMILY_GLYPHS.filter(g => !declaredSet.has(g));
  const withoutGlyph = declaredChars.filter(c => !symbols.FAMILY_GLYPHS.includes(c));
  truth.push({
    id: 'GT1',
    kind: 'declared_vs_actual',
    statement: `SYMBOL_FAMILIES declares ${declaredChars.length} families while FAMILY_GLYPHS lists ${symbols.FAMILY_GLYPHS.length} entries, but only ${glyphIsDeclared.length} of those glyphs ARE declared families: ${aliasGlyphs.length} are aliases (${aliasGlyphs.join(' ')}) and ${withoutGlyph.length} declared family has no single-glyph entry (${withoutGlyph.join(' ')}). Neither 18 nor 17 is the family count; the invariant is ${glyphIsDeclared.length} + ${withoutGlyph.length} = ${declaredChars.length}.`,
    expected_value: {families: 17, glyph_entries: 18, glyphs_that_are_declared: 16, aliases: ['Δ', '✔'], declared_without_glyph: ['→']},
    observed: {
      families: declaredChars.length,
      glyph_entries: symbols.FAMILY_GLYPHS.length,
      glyphs_that_are_declared: glyphIsDeclared.length,
      aliases: aliasGlyphs,
      declared_without_glyph: withoutGlyph,
    },
  });

  // GT2 — types.ts declares type-level guarantees ("never executes, never bypasses a law
  // gate", "every defaulted field so an empty world is debuggable") but exports ZERO
  // runtime values. Those guarantees are therefore not observable by executing anything.
  truth.push({
    id: 'GT2',
    kind: 'declared_vs_actual',
    statement: `src/types.ts exports ${Object.keys(types).length} runtime values, so its declared guarantees are type-level only and cannot be confirmed or refuted by execution.`,
    expected_value: 0,
    observed: {runtime_exports: Object.keys(types).length},
  });

  // GT3 — every advertised glyph must lex to a symbol whose family is a DECLARED family.
  // This is the removal-detecting twin of "is each declared family lexable?", which can only
  // fail when a family is unlexable and never when one is REMOVED. Round 0's master-exec
  // pass produced exactly that unfalsifiable green before adding this check.
  // Two directions are checked, because one alone is the original mistake:
  //   forward  — does every advertised glyph reach a declared family?
  //   reverse  — is every declared family reachable from some advertised glyph?
  const declared = new Set(symbols.SYMBOL_FAMILIES.map(f => f.char));
  const lost = [];
  const reachable = new Set();
  for (const g of symbols.FAMILY_GLYPHS) {
    const t = lexer.lex(g).tokens?.[0];
    if (!t || t.kind !== 'symbol' || !declared.has(t.family)) { lost.push(g); continue; }
    reachable.add(t.family);
  }
  const unreachable = [...declared].filter(c => !reachable.has(c));
  truth.push({
    id: 'GT3',
    kind: 'integrity',
    statement: `every advertised glyph lexes to a declared family (${symbols.FAMILY_GLYPHS.length - lost.length}/${symbols.FAMILY_GLYPHS.length}). SEPARATELY: ${unreachable.length} declared family/families have NO single-glyph representative in FAMILY_GLYPHS (${unreachable.join(', ') || 'none'}) — the glyph list cannot enumerate the whole family set, which is the substance of GT1.`,
    expected_value: 0,
    // Only the forward direction is an integrity gate. The reverse direction is a genuine
    // property of this source, not corruption: `→` is declared and lexes, but is spelled
    // multi-character (`->`, `=>`, `→`, `>`), so it has no single-glyph entry. Turning that
    // into a failure would be the same error in reverse — calling a real finding a defect
    // so a gate could go green.
    observed: {unlexable_or_orphan: lost, unreachable_families: unreachable},
  });

  // GT4 — a quoted glyph stays literal and must NOT gain a family. A reader that treats a
  // quoted glyph as live syntax is wrong in a way that prose alone will not reveal.
  const probe = symbols.FAMILY_GLYPHS[0];
  const quoted = lexer.lex(`"${probe}"`).tokens?.[0];
  truth.push({
    id: 'GT4',
    kind: 'declared_vs_actual',
    statement: `a quoted glyph stays a quote token and gains no family (probe ${JSON.stringify(probe)} -> kind ${quoted?.kind}, family ${quoted?.family ?? 'none'})`,
    expected_value: 'quote',
    observed: {kind: quoted?.kind, family: quoted?.family ?? null},
  });

  // GT5 — alias pairs normalise to one family, so a literal string comparison on the
  // glyph list under-counts the distinct families that actually lex.
  const aliases = symbols.FAMILY_GLYPHS.filter(g => {
    const t = lexer.lex(g).tokens?.[0];
    return t?.kind === 'symbol' && !symbols.FAMILY_GLYPHS.includes(t.family);
  });
  truth.push({
    id: 'GT5',
    kind: 'declared_vs_actual',
    statement: `alias glyphs normalise to a canonical family on lexing (${aliases.length} glyphs map to a family not present in the glyph list itself: ${aliases.join(' ') || 'none'})`,
    observed: {aliases},
  });

  return truth;
}

function pathToFile(base, rel) {
  // Absolute .ts dynamic import needs a file:// URL on Windows, or it throws
  // ERR_UNSUPPORTED_ESM_URL_SCHEME. Several cold readers hit exactly this. Use the stdlib
  // rather than hand-rolling the triple slash: a hand-rolled version produced
  // "file://C:/...", which parses but is not a usable file URL.
  return pathToFileURL(join(base, rel)).href;
}

// --- checks -----------------------------------------------------------------
export function checkTruth(truth) {
  const failures = [];
  const by = Object.fromEntries(truth.map(t => [t.id, t]));
  const g1 = by.GT1.expected_value, o1 = by.GT1.observed;
  if (o1.families !== g1.families) failures.push(`GT1 declared families: expected ${g1.families}, saw ${o1.families}`);
  if (o1.glyph_entries !== g1.glyph_entries) failures.push(`GT1 glyph entries: expected ${g1.glyph_entries}, saw ${o1.glyph_entries}`);
  if (o1.glyphs_that_are_declared !== g1.glyphs_that_are_declared) failures.push(`GT1 glyphs-that-are-declared: expected ${g1.glyphs_that_are_declared}, saw ${o1.glyphs_that_are_declared}`);
  if (JSON.stringify(o1.aliases) !== JSON.stringify(g1.aliases)) failures.push(`GT1 alias set changed: expected ${g1.aliases.join(' ')}, saw ${o1.aliases.join(' ') || 'none'}`);
  if (JSON.stringify(o1.declared_without_glyph) !== JSON.stringify(g1.declared_without_glyph)) failures.push(`GT1 declared-without-glyph changed: expected ${g1.declared_without_glyph.join(' ')}, saw ${o1.declared_without_glyph.join(' ') || 'none'}`);
  // The structural invariant, which is what actually binds the three numbers together.
  if (o1.glyphs_that_are_declared + o1.declared_without_glyph.length !== o1.families) {
    failures.push(`GT1 invariant broken: ${o1.glyphs_that_are_declared} declared glyphs + ${o1.declared_without_glyph.length} glyph-less families != ${o1.families} families`);
  }
  if (by.GT3.observed.unlexable_or_orphan.length !== 0) failures.push(`GT3 ${by.GT3.observed.unlexable_or_orphan.length} glyphs do not reach a declared family`);
  // unreachable_families is deliberately NOT a failure — see the note at GT3.
  if (by.GT4.observed.kind !== 'quote') failures.push(`GT4 quoted glyph became kind ${by.GT4.observed.kind}`);
  return failures;
}

// --- negative controls ------------------------------------------------------
// Each mutates one property of the source and asserts the detector flips. A ground-truth
// extractor that has only ever agreed with itself has demonstrated nothing.
//
// Every probe runs in a CHILD PROCESS. That is not tidiness: Node caches ES modules, so a
// mutated file re-imported in the same process returns the ORIGINAL module and the
// mutation silently never executes — which makes the control report PASS and proves
// nothing. The first version of this suite had exactly that bug, and the controls looked
// like they were working while testing nothing.
const PROBE = 'import(process.argv[1]).then(m => m.derive().then(t => { console.log(JSON.stringify({failures: m.checkTruth(t)})); }));';

async function probeInChild() {
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', PROBE, pathToFile(here, 'oracle.mjs')], {encoding: 'utf8'});
  return JSON.parse(out.trim().split('\n').pop()).failures;
}

async function negativeControls() {
  const results = [];
  const symbolsPath = join(cohort, 'src', 'symbols.ts');
  const lexerPath = join(cohort, 'src', 'lexer.ts');
  const origSymbols = readFileSync(symbolsPath, 'utf8');
  const origLexer = readFileSync(lexerPath, 'utf8');

  // A mutant that does not apply tests NOTHING. The first version of this suite used
  // single-quoted anchors against a double-quoted source, so three of four controls
  // silently mutated nothing, the detectors correctly reported PASS, and the controls
  // then reported "the detector is broken" when the detector was fine and the ANCHOR was
  // wrong. So: refuse to run a mutation that did not change the file.
  const mutate = (src, from, to, what) => {
    if (!src.includes(from)) throw new Error(`mutant anchor not found (${what}): ${JSON.stringify(from)}`);
    const out = src.replace(from, to);
    if (out === src) throw new Error(`mutant had no effect (${what})`);
    return out;
  };

  const probe = async (label, expectFail) => {
    try {
      const failures = await probeInChild();
      const observed = failures.length ? 'FAIL' : 'PASS';
      results.push({label, expected: expectFail ? 'FAIL' : 'PASS', observed, discriminated: (failures.length > 0) === expectFail});
    } catch (e) {
      results.push({label, expected: expectFail ? 'FAIL' : 'PASS', observed: 'ERROR', discriminated: false, note: String(e.message).slice(0, 140)});
    }
  };

  try {
    // P1: pristine source must PASS
    await probe('P1 pristine source passes', false);

    // N1: rename a declared family char so its advertised glyph becomes an orphan. Only
    // the FORWARD glyph->declared direction catches this, which is why it exists.
    {
      const m = mutate(origSymbols, '{ char: "/"', '{ char: "_"', 'orphan family');
      writeFileSync(symbolsPath, m);
      await probe('N1 declared family renamed -> glyph orphan FAIL', true);
      writeFileSync(symbolsPath, origSymbols);
    }

    // N2: break quote handling; GT4 must fire
    {
      const m = mutate(origLexer, 'kind: "quote"', 'kind: "symbol"', 'quote kind');
      writeFileSync(lexerPath, m);
      await probe('N2 quote handling broken -> GT4 FAIL', true);
      writeFileSync(lexerPath, origLexer);
    }

    // N3: change the declared family COUNT; GT1 must fire
    {
      const m = mutate(origSymbols, 'export const SYMBOL_FAMILIES: FamilyDef[] = [', 'export const SYMBOL_FAMILIES: FamilyDef[] = [{ char: "!!", name: "mutant", meaning: "m", nl: [], examples: [], colorHint: "x" },', 'extra family');
      writeFileSync(symbolsPath, m);
      await probe('N3 family count changed -> GT1 FAIL', true);
      writeFileSync(symbolsPath, origSymbols);
    }

    // N4: the aliases vanish, so FAMILY_GLYPHS can no longer over-count. GT1 must notice
    // that the glyph count changed rather than silently agreeing with a different source.
    {
      const m = mutate(origSymbols, '"∆", "Δ", "✓", "✔",', '"∆", "✓",', 'alias removal');
      writeFileSync(symbolsPath, m);
      await probe('N4 aliases removed -> GT1 glyph count FAIL', true);
      writeFileSync(symbolsPath, origSymbols);
    }
  } finally {
    writeFileSync(symbolsPath, origSymbols);
    writeFileSync(lexerPath, origLexer);
  }

  return {results, passed: results.filter(r => r.discriminated).length, total: results.length};
}

import {writeFileSync} from 'node:fs';

async function main() {
  const argv = process.argv.slice(2);
  const custody = cohortCustody();

  if (argv.includes('--negative-control')) {
    const truth = await derive();
    const r = await negativeControls();
    for (const c of r.results) console.log(`  [${c.discriminated ? 'OK  ' : 'FAIL'}] ${c.label} (expected ${c.expected}, observed ${c.observed})`);
    console.log(`\n${r.passed}/${r.total} negative controls discriminate.`);
    if (!r.passed) process.exitCode = 1;
    return;
  }

  const truth = await derive();
  if (argv.includes('--check')) {
    const failures = checkTruth(truth);
    console.log(`ORACLE SELF-CHECK: ${failures.length ? 'FAIL' : 'PASS'} (${truth.length} ground-truth items, cohort ${custody.files} files)`);
    for (const f of failures) console.log(`  [FAIL] ${f}`);
    if (failures.length) process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({
    status: 'PRELIMINARY — R1 NOT RUN. This is scoring apparatus, not a result.',
    cohort: {path: cohortRel, files: custody.files, fingerprint: custody.fingerprint},
    ground_truth: truth,
  }, null, 2));
}

// Compare via pathToFileURL, not a hand-rolled "file://"+argv string: that form throws
// Invalid URL when argv[1] is ALREADY a file URL (which is exactly what happens when
// this module is imported by a child process), so the guard itself became the bug.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();