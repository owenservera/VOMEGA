// Best-of-breed selection within a track. Deterministic; no model involved.
//   node team/tools/select.mjs <evaluation.json> --manifest <round-manifest.json>     # normative: margin+basis from the FROZEN manifest
//   node team/tools/select.mjs <evaluation.json> --margin 5 [--basis total|mechanical] # ad-hoc / tests (margin_source:"cli")
//   ... --manifest m.json --margin 8 --override "<reason>"                             # deliberate deviation, recorded in output
//
// evaluation.json (produced by evalkit.mjs join):
//  { "round":"R1", "results":[
//     { "track":"A", "arm":"R1-A1", "component":"C1", "score":82, "score_mechanical":61, "tests_passed":true,
//       "isolation_ok":true, "evidence":["evals/b-1a2b3c4d.C1.json"] }, ... ] }
//
// Rules (normative, see team/04_EVALUATION_AND_SELECTION.md §4):
//  1. ELIGIBLE iff tests_passed && isolation_ok && evidence non-empty && the basis score is a finite number 0..100.
//  2. Selection happens per (track, component). NEVER across tracks.
//  3. The top eligible entry wins only if it beats the runner-up by >= margin points; otherwise TIE_CARRY_BOTH
//     (every entry within the margin of the top continues; nothing is discarded on noise).
//  4. One eligible entry => SINGLE_ENTRANT (selected, flagged as untested against an alternative).
//  5. Zero eligible => NO_ELIGIBLE (component is re-run next round; disqualification reasons are listed).
//  6. basis = "total" uses `score`; basis = "mechanical" uses `score_mechanical` (used when evaluator independence is
//     DEGRADED, so judgment criteria cannot decide a winner). The manifest fixes the basis before scoring.
//
// v0.2: structural errors THROW instead of producing a plausible-looking decision: missing/NaN margin (v0.1 silently
// produced TIE with an empty carry), duplicate (arm, component) rows (v0.1 let one arm compete with itself), an arm
// listed under the wrong track or round. Output carries input_sha256, basis and margin_source for reproduction.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { sha256, canon } from './lib/util.mjs';

export const BASES = ['total', 'mechanical'];
const ARM_ID = /^(R\d+)-([A-Z])(\d+)$/;

export function validateEvaluation(evaluation, { margin, basis }) {
  if (!Number.isFinite(margin) || margin < 0 || margin > 100) throw new Error(`margin must be a finite number 0..100 (got ${margin})`);
  if (!BASES.includes(basis)) throw new Error(`basis must be one of ${BASES.join('|')} (got ${basis})`);
  if (!evaluation || !Array.isArray(evaluation.results)) throw new Error('evaluation.results[] missing');
  const seen = new Set();
  for (const r of evaluation.results) {
    if (typeof r.arm !== 'string' || typeof r.track !== 'string' || typeof r.component !== 'string') throw new Error(`result needs arm, track, component strings: ${JSON.stringify(r).slice(0, 120)}`);
    const k = `${r.arm}::${r.component}`;
    if (seen.has(k)) throw new Error(`duplicate result for ${r.arm} / ${r.component}`);
    seen.add(k);
    const m = ARM_ID.exec(r.arm);
    if (m) {
      if (m[2] !== r.track) throw new Error(`arm ${r.arm} is listed under track ${r.track}`);
      if (evaluation.round && m[1] !== evaluation.round) throw new Error(`arm ${r.arm} does not belong to round ${evaluation.round}`);
    }
  }
}

export function select(evaluation, { margin = 5, basis = 'total' } = {}) {
  validateEvaluation(evaluation, { margin, basis });
  const field = basis === 'mechanical' ? 'score_mechanical' : 'score';
  const groups = new Map();
  for (const r of evaluation.results) {
    const key = `${r.track}::${r.component}`;
    if (!groups.has(key)) groups.set(key, { track: r.track, component: r.component, entries: [] });
    groups.get(key).entries.push(r);
  }
  const decisions = [];
  const order = (a, b) => (a.track < b.track ? -1 : a.track > b.track ? 1 : a.component < b.component ? -1 : a.component > b.component ? 1 : 0);
  for (const g of [...groups.values()].sort(order)) {
    const eligible = []; const disqualified = [];
    for (const e of g.entries) {
      const why = [];
      const s = e[field];
      if (e.tests_passed !== true) why.push('tests_not_passed');
      if (e.isolation_ok !== true) why.push('isolation_not_ok');
      if (!(Array.isArray(e.evidence) && e.evidence.length)) why.push('no_evidence');
      if (!(Number.isFinite(s) && s >= 0 && s <= 100)) why.push('bad_score');
      (why.length ? disqualified.push({ arm: e.arm, why }) : eligible.push({ arm: e.arm, score: s }));
    }
    eligible.sort((a, b) => b.score - a.score || (a.arm < b.arm ? -1 : 1));
    disqualified.sort((a, b) => (a.arm < b.arm ? -1 : 1));
    let status, winner = null, carry = [];
    if (eligible.length === 0) status = 'NO_ELIGIBLE';
    else if (eligible.length === 1) { status = 'SINGLE_ENTRANT'; winner = eligible[0].arm; }
    else if (eligible[0].score - eligible[1].score >= margin) { status = 'SELECTED'; winner = eligible[0].arm; }
    else { status = 'TIE_CARRY_BOTH'; carry = eligible.filter(e => eligible[0].score - e.score < margin).map(e => e.arm); }
    decisions.push({ track: g.track, component: g.component, status, winner, carry, margin_used: margin, scores: eligible, disqualified });
  }
  return { round: evaluation.round, basis, margin, input_sha256: sha256(canon(evaluation)), decisions };
}

/** Resolve margin/basis from CLI args + optional frozen manifest. Exported for tests. */
export function resolveParams(args) {
  const val = flag => { const i = args.indexOf(flag); if (i < 0) return undefined; const v = args[i + 1]; if (v === undefined || v.startsWith('--')) throw new Error(`${flag} needs a value`); return v; };
  const manifestPath = val('--manifest'); const cliMargin = val('--margin'); const cliBasis = val('--basis'); const override = val('--override');
  let margin, basis, source;
  if (manifestPath) {
    const m = JSON.parse(readFileSync(manifestPath, 'utf8'));
    margin = m.margin; basis = m.selection_basis ?? 'total'; source = 'manifest';
    const differs = (cliMargin !== undefined && Number(cliMargin) !== margin) || (cliBasis !== undefined && cliBasis !== basis);
    if (differs && !override) throw new Error(`CLI margin/basis differ from the frozen manifest (${margin}/${basis}); pass --override "<reason>" to deviate on record`);
    if (differs) { margin = cliMargin !== undefined ? Number(cliMargin) : margin; basis = cliBasis ?? basis; source = 'override'; }
  } else {
    margin = cliMargin !== undefined ? Number(cliMargin) : 5; basis = cliBasis ?? 'total'; source = cliMargin !== undefined ? 'cli' : 'default';
  }
  return { margin, basis, margin_source: source, ...(source === 'override' ? { override_reason: override } : {}) };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const args = process.argv.slice(2);
  try {
    const p = resolveParams(args);
    const out = select(JSON.parse(readFileSync(args[0], 'utf8')), p);
    console.log(JSON.stringify({ ...out, margin_source: p.margin_source, ...(p.override_reason ? { override_reason: p.override_reason } : {}) }, null, 2));
  } catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
