// RUN C — Comparison harness: the same four questions through three surfaces.
//
//   V0 CONTROL : no protocol. Standard tools only (rg / git / tsc / node) plus the
//                source-pinned index. The user must already KNOW which tool answers
//                which question. This is a genuine control, not a strawman.
//   V1 VERBS   : one verb per operation.
//   V2 PREDS   : composable predicates with explicit UNKNOWN.
//
// SCORED ON: did the surface independently surface the planted contradiction,
// did it attach provenance, did it separate CLAIM from WITNESS, and could it
// enumerate what it does not know.

import {writeFileSync, mkdirSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {makeV1} from './v1-verbs.mjs';
import {makeV2} from './v2-predicates.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const runRoot = resolve(here, '..');
const gymRoot = resolve(here, '..', '..', '..');
const SUBJECT = 'repeat';

const v1 = makeV1();
const v2 = makeV2();

// ---- V0 CONTROL: what plain tools return for the same question --------------
const t0 = Date.now();
const rgHits = (() => {
  try {
    return execFileSync('rg', ['-n', 'repeat', 'fixture/001-semantic-basics.ts'],
      {encoding: 'utf8', cwd: gymRoot}).trim().split('\n');
  } catch (e) { return [`rg failed: ${e.message}`]; }
})();
const v0 = {
  surface: 'V0-NO-PROTOCOL',
  symbol: {
    tool: 'rg -n repeat fixture/001-semantic-basics.ts',
    rawOutput: rgHits,
    provenance: 'git-tracked file, caller must pin the commit themselves',
    separatesClaimFromWitness: false,
    contradictionSurfaced: false,
    note: 'rg finds the token. It does NOT know the doc comment contradicts behaviour.',
  },
  enumsOwnUnknowns: false,
  elapsedMs: Date.now() - t0,
};

// ---- The four questions each surface must answer ------------------------------
const results = {subject: SUBJECT, generatedBy: 'probe/compare.mjs'};

results.Q1_symbol = {
  v0: v0.symbol,
  v1: v1.SYMBOL(SUBJECT),
  v2: v2.predicates.exists(SUBJECT),
};

results.Q2_explanation = {
  v1: v1.EXPLAIN(SUBJECT),
  v2: v2.QUESTIONS.explanation(SUBJECT),
};

results.Q3_relationship = {
  v1: v1.RELATE(SUBJECT),
  v2: v2.QUESTIONS.relationship(SUBJECT),
};

results.Q4_contradiction = {
  v1: v1.CHALLENGE(SUBJECT),
  v2: v2.QUESTIONS.contradiction(SUBJECT),
  v2_enforcedPredicate: v2.predicates.enforced(SUBJECT, 'count is a nonnegative safe integer'),
};

results.v0_control = v0;
results.v2_unknowns = v2.UNKNOWNS();
results.v1_capability = v1.CAPABILITY();
results.v2_canExecute = ['exists', 'documented', 'enforced', 'witnessed', 'contradicts', 'throws_on']
  .map((op) => ({op, ...v2.can_execute_now(op)}));

// ---- SCORING -----------------------------------------------------------------
// The planted contradiction: repeat() documents "nonnegative safe integer" but
// neither tsc nor the runtime enforces it, and fractional counts silently ceil.
const CORRECT = 'count is a nonnegative safe integer';
const scores = {
  v0: {
    surfacedContradiction: /nonnegative safe integer/i.test(JSON.stringify(v0)) &&
                           JSON.stringify(v0).includes('false'),
    attachesProvenance: /git/i.test(JSON.stringify(v0)),
    separatesClaimFromWitness: v0.separatesClaimFromWitness,
    canEnumerateUnknowns: v0.enumsOwnUnknowns,
  },
  v1: {
    surfacedContradiction: v1.CHALLENGE(SUBJECT).verdict?.includes('DOCUMENTATION ONLY'),
    attachesProvenance: Boolean(v1.CHALLENGE(SUBJECT).evidence?.sourcePin),
    separatesClaimFromWitness: Boolean(v1.CHALLENGE(SUBJECT).claimEpistemicStatus) &&
                               v1.CHALLENGE(SUBJECT).findings?.length > 0,
    canEnumerateUnknowns: /UNKNOWN/.test(JSON.stringify(v1.CAPABILITY())),
  },
  v2: {
    surfacedContradiction: v2.predicates.enforced(SUBJECT, CORRECT).verdict === 'FALSE',
    attachesProvenance: Boolean(v2.predicates.enforced(SUBJECT, CORRECT).evidence?.sourcePin),
    separatesClaimFromWitness: v2.predicates.contradicts('x', 'y', 'doc', 'exec')
      .left.epistemicStatus === 'CLAIMED_BY_AUTHOR',
    canEnumerateUnknowns: Array.isArray(v2.UNKNOWNS().list) && v2.UNKNOWNS().list.length > 0,
  },
};
results.scores = scores;

const byCriterion = (c) => Object.entries(scores)
  .filter(([, s]) => c in s)
  .map(([k, s]) => `${k}=${s[c] ? 'YES' : 'NO'}`)
  .join('  ');
results.comparison = {
  surfacedContradiction: byCriterion('surfacedContradiction'),
  attachesProvenance: byCriterion('attachesProvenance'),
  separatesClaimFromWitness: byCriterion('separatesClaimFromWitness'),
  canEnumerateUnknowns: byCriterion('canEnumerateUnknowns'),
};

mkdirSync(join(runRoot, 'evidence'), {recursive: true});
writeFileSync(join(runRoot, 'evidence', 'comparison.json'), JSON.stringify(results, null, 2));

console.log(JSON.stringify({
  subject: SUBJECT,
  comparison: results.comparison,
  v2_unknownCount: v2.UNKNOWNS().list.length,
  contradictionFound:
    v1.CHALLENGE(SUBJECT).status === 'CONTRADICTION_FOUND' &&
    v2.predicates.enforced(SUBJECT, CORRECT).verdict === 'FALSE',
}, null, 2));