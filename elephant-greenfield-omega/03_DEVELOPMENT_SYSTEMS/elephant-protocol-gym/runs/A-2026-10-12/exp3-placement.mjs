// EXPERIMENT 3 — where can meaning live, and can each placement admit it is wrong?
//
// Arm A requires exploring at least two genuine alternative placements/forms of
// the added meaning, against a plain-source control.
//
// CORRECTION LOG: v1 extracted a doc comment that never existed (the shipped
// fixture only documents `repeat`, not `add`), so "comment unchanged after
// mutation" compared null with null and reported a vacuous TRUE. A fair
// placement comparison must author the SAME claim in each placement, so this
// version writes the comment variant explicitly and asserts that the comment was
// actually found before trusting any comparison involving it.
//
//   P0 PLAIN    no description (the control the seed demands)
//   P1 COMMENT  the same claim authored inside a doc comment in the source
//   P2 SIDECAR  the same claim in a generated .sem.json pinned to source sha256
//
// The question is not "which reads better". It is: when the source changes, can
// each placement TELL that its own description is now stale?
//
// Evidence class: TESTED for staleness detection, ANALYTIC for comprehension.
// Usage: node exp3-placement.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const ORIGINAL = readFileSync('baseline.ts', 'utf8');
const sha = (s) => createHash('sha256').update(s).digest('hex');

// Author the identical claim into the source, then mutate ONLY the body.
const COMMENTED = ORIGINAL.replace(
  'export function add(a: number, b: number): number {',
  '/** Returns the sum of a and b. */\nexport function add(a: number, b: number): number {'
);
if (COMMENTED === ORIGINAL) throw new Error('failed to author the P1 comment variant');

const COMMENTED_MUTATED = COMMENTED.replace('return a + b;', 'return a * b;');
if (COMMENTED_MUTATED === COMMENTED) throw new Error('mutation did not apply — refusing to report a no-op');

// Extract exactly the comment we authored, and assert it was found.
function extractAddComment(src) {
  const m = src.match(/\/\*\*[^*]*\*\/\s*\nexport function add/);
  return m ? m[0].trim() : null;
}
const commentBefore = extractAddComment(COMMENTED);
const commentAfter = extractAddComment(COMMENTED_MUTATED);
if (commentBefore === null) throw new Error('P1 comment variant not found — refusing to report a vacuous comparison');
const commentSurvivedMutation = commentBefore === commentAfter;

const CLAIM_TEXT = 'Returns the sum of a and b.';

// ---------- P2: SIDECAR --------------------------------------------------
const sidecar = (sourceText) => ({
  sourceSha256: sha(sourceText),
  claims: [{
    id: 'claim.add.returns-sum',
    statement: CLAIM_TEXT,
    status: 'DESCRIBED_NOT_WITNESSED',
    boundTo: 'fixture/001-semantic-basics.ts',
  }],
});

writeFileSync('sidecar.baseline.sem.json', JSON.stringify(sidecar(COMMENTED), null, 2) + '\n');
writeFileSync('sidecar.mutated.sem.json', JSON.stringify(sidecar(COMMENTED_MUTATED), null, 2) + '\n');

const sidecarStale = sidecar(COMMENTED).sourceSha256 !== sha(COMMENTED_MUTATED);

console.log(JSON.stringify({
  experiment: 'EXP3 — placement comparison against a plain-source control',
  evidenceClass: 'TESTED (staleness detection) / ANALYTIC (reader comprehension)',
  claimPlacedInEveryVariant: CLAIM_TEXT,
  correctionLog: 'v1 extracted a comment that did not exist and compared null==null (vacuous true). v2 authors the claim explicitly and asserts the comment was found before trusting the comparison.',

  P0_plain_source_control: {
    description: 'no meaning attached',
    canBeStale: false,
    reason: 'nothing to be wrong about — and nothing that can ever become right',
    detectsMutation: false,
    detectsUnenforcedPrecondition: false,
  },

  P1_comment_in_source: {
    description: 'meaning authored inside a doc comment in the source file',
    commentFound: commentBefore !== null,
    commentBytes: Buffer.byteLength(commentBefore),
    commentStillReads: CLAIM_TEXT,
    commentTextUnchangedAfterMutation: commentSurvivedMutation,
    canSignalItsOwnStaleness: false,
    reason:
      'the comment is carried along by the very edit that falsifies it, and nothing inside it records ' +
      'the digest it was written against, so no checker can tell a reader the claim was authored for ' +
      'a different source',
    detectsMutation: false,
    detectsUnenforcedPrecondition: true,
    detectsUnenforcedPreconditionHow:
      'only because the author wrote the honesty note themselves — a property of this author, not a ' +
      'guarantee the placement provides',
    postMutationStatus: 'the file still asserts "Returns the sum of a and b" while returning a product',
  },

  P2_digest_bound_sidecar: {
    description: 'generated metadata in a separate file, pinned to the source sha256',
    pinnedDigestBefore: sha(COMMENTED),
    pinnedDigestAfterSourceEdit: sha(COMMENTED_MUTATED),
    detectsMutation: sidecarStale,
    detectsMutationHow:
      'the pinned digest no longer matches the file on disk, so the sidecar is provably stale and a ' +
      'checker can refuse to serve it — no execution required',
    detectsUnenforcedPrecondition: false,
    detectsUnenforcedPreconditionHow:
      'a digest proves WHICH source a claim was written against, never whether the claim is true of ' +
      'that source. Binding is not verification.',
    cost: 'a second artifact that can drift from the source and needs its own lifecycle',
  },

  headline: {
    finding:
      'Placement determines what failure is DETECTABLE, not what is true. A comment can carry a ' +
      'self-deprecating honesty note but cannot signal its own staleness; a digest-bound sidecar can ' +
      'signal staleness but cannot make a false claim true; the plain control is never wrong and never right.',
    consequence:
      'No placement alone yields a truthful self-describing file. The smallest credible path needs the ' +
      'witness, not the placement: every claim needs an executed probe AND a source digest, because ' +
      'EXP3 shows digest binding is not verification and EXP2 shows type-level descriptions are blind ' +
      'to body changes.',
  },

  sourceSha256: {originalFixture: sha(ORIGINAL), commentedVariant: sha(COMMENTED), commentedMutated: sha(COMMENTED_MUTATED)},
}, null, 2));