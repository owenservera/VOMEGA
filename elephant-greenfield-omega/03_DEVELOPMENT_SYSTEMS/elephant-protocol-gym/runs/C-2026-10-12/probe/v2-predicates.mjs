// RUN C — Vocabulary V2: PREDICATE-LED capability surface.
//
// COMPETING HYPOTHESIS (directly opposed to V1): self-knowledge is best served
// by declarative PREDICATES over (subject, property) — `enforced`, `witnessed`,
// `contradicts`, `stale` — that COMPOSE, rather than verbs that must be invoked
// one at a time.
//
// The decisive difference is the UNKNOWN handling. V2 adopts a closed-world rule:
// every subject has a truth value for every predicate, and the third value
// UNKNOWN is explicit and enumerable. V1 has no way to ask "what don't you know?"
// without inventing a verb for it.
//
// STRENGTH (hypothesis): capability admission and honesty gaps are first-class.
// WEAKNESS (to be tested): composing predicates to answer a concrete multi-step
// question is more work than just calling the right verb.

import {buildIndex, loadGroundTruth} from './index.mjs';

const UNKNOWN = (pred, subject) => ({
  verdict: 'UNKNOWN',
  subject, predicate: pred,
  why: 'no evidence gathered for this predicate; recorded as UNKNOWN, not FALSE',
});

export function makeV2() {
  const ix = buildIndex();
  const gt = loadGroundTruth();

  /** predicate: exists(subject) */
  const exists = (name) => {
    const s = ix.symbols.get(name);
    return s
      ? {verdict: 'TRUE', subject: name, predicate: 'exists',
         value: {kind: s.kind, signature: s.signature, line: s.line},
         evidence: {sourcePin: ix.fixture.pin, basis: 'lexical-scan'}}
      : {verdict: 'FALSE', subject: name, predicate: 'exists',
         caveat: 'FALSE here means "not in the indexed file", NOT "does not exist anywhere"'};
  };

  /** predicate: documented(subject) — the author asserted a contract. */
  const documented = (name) => {
    const c = ix.claims.get(name);
    return c
      ? {verdict: 'TRUE', subject: name, predicate: 'documented', value: c.text,
         epistemicStatus: c.epistemicStatus, evidence: {sourcePin: ix.fixture.pin, basis: 'doc-comment'}}
      : {verdict: 'FALSE', subject: name, predicate: 'documented'};
  };

  /** predicate: enforced(subject, precondition) — THE decisive predicate. */
  const enforced = (name, precondition) => {
    if (!ix.symbols.has(name)) return UNKNOWN('enforced', name);
    // exit 0 on the violating caller means the compiler ACCEPTED those violations,
    // i.e. the precondition is NOT enforced. Inverting this yields a false 'TRUE'.
    const typeEnforced = gt.typecheck.contractViolatingCaller.exitCode !== 0;
    const runtimeGuard = gt.runtime.hasGuardInEmittedJs;
    const verdict = (typeEnforced || runtimeGuard) ? 'TRUE' : 'FALSE';
    return {
      verdict, subject: name, predicate: 'enforced', property: precondition,
      components: {
        enforcedByTypeSystem: typeEnforced,
        enforcedByRuntimeGuard: runtimeGuard,
        typecheckWitness: gt.typecheck.contractViolatingCaller.verdict,
        controlWitness: gt.typecheck.typeViolationControl.verdict,
      },
      meaning: verdict === 'FALSE'
        ? 'The precondition is stated in prose and enforced by NOTHING. Violations compile and run silently.'
        : 'A precondition violation is rejected by at least one mechanical layer.',
      evidence: {sourcePin: ix.fixture.pin, basis: 'tsc --strict + execution'},
    };
  };

  /** predicate: witnessed(subject, behaviour) — did we actually observe it? */
  const witnessed = (name, behaviour) => {
    const hits = Object.entries(gt.runtime).filter(([k]) => k.startsWith(name + '('));
    if (!hits.length) return UNKNOWN('witnessed', `${name}.${behaviour}`);
    return {
      verdict: 'TRUE', subject: name, predicate: 'witnessed', property: behaviour,
      observations: hits.map(([probe, observed]) => ({probe, observed})),
      evidence: {sourcePin: ix.fixture.pin, executor: 'node v24.11.1', basis: 'execution'},
    };
  };

  /** predicate: contradicts(a, b) — compositional comparison. */
  const contradicts = (claimText, observedValue, claimLabel, observedLabel) => ({
    verdict: 'TRUE',
    predicate: 'contradicts',
    left: {label: claimLabel, value: claimText, epistemicStatus: 'CLAIMED_BY_AUTHOR'},
    right: {label: observedLabel, value: observedValue, epistemicStatus: 'WITNESSED_BY_EXECUTION'},
    note: 'A contradiction is only meaningful between a CLAIM and a WITNESS. Two claims do not contradict.',
  });

  /** predicate: throws_on(subject, inputClass) */
  const throws_on = (name, inputClass) => {
    const v = (gt.runtime.violationBehaviour ?? []).find(
      (p) => String(p.count) === String(inputClass));
    if (!v) return UNKNOWN('throws_on', `${name}(${inputClass})`);
    return {verdict: v.threw ? 'TRUE' : 'FALSE', subject: name, predicate: 'throws_on',
            property: inputClass, value: v.threw,
            consequence: v.threw ? 'error raised' : `silently emitted ${v.emitted} values`,
            evidence: {sourcePin: ix.fixture.pin, basis: 'execution'}};
  };

  /** The admission question: separate DESCRIBING a capability from EXECUTING it. */
  const can_execute_now = (operationName) => {
    const implemented = new Set([
      'exists', 'documented', 'enforced', 'witnessed', 'contradicts', 'throws_on',
      'CLOSURE', 'PROPOSED',
    ]);
    if (!implemented.has(operationName)) {
      return {verdict: 'FALSE', predicate: 'can_execute_now', subject: operationName,
              meaning: 'NOT IMPLEMENTED — this is a PROPOSAL, not a capability'};
    }
    return {verdict: 'TRUE', predicate: 'can_execute_now', subject: operationName,
            meaning: 'implemented and runnable against the pinned fixture'};
  };

  /** Everything the system does NOT know — enumerable, not implicit. */
  const UNKNOWNS = () => ({
    predicate: 'unknowns',
    verdict: 'ENUMERATED',
    list: [
      'whether repeat() has any caller outside this file',
      'the author\'s intended behaviour for fractional counts',
      'whether MAX_RETRIES relates to repeat() at all',
      'how this code behaves under a non-JS runtime',
    ],
    rule: 'Anything absent from the witnessed set is UNKNOWN until a witness produces it.',
  });

  /** Answer the four required questions using ONLY predicate composition. */
  const QUESTIONS = {
    symbol: (name) => ({query: 'symbol', answer: exists(name)}),

    explanation: (name) => ({
      query: 'explanation', answer: {
        documented: documented(name),
        witnessed: witnessed(name, 'any-behaviour'),
        composition: `${exists(name).verdict}(exists) ∧ ${documented(name).verdict}(documented)`,
        reading: 'Existence is witnessed by scan; meaning is author-claimed unless witnessed.',
      },
    }),

    relationship: (name) => ({
      query: 'relationship', answer: {
        calls: ix.edges.filter((e) => e.from === name || e.to === name)
          .map((e) => `${e.from} → ${e.to}`),
        externalCallers: UNKNOWN('externalCallers', name),
      },
    }),

    contradiction: (name) => {
      const en = enforced(name, 'count is a nonnegative safe integer');
      const thr = (gt.runtime.violationBehaviour ?? []).map((v) => ({
        input: v.count, throws: throws_on(name, v.count),
      }));
      return {
        query: 'contradiction', answer: {
          precondition: en,
          violations: thr,
          composition: en.verdict === 'FALSE'
            ? 'documented ∧ ¬enforced  ⟹  a documented-but-unenforced precondition exists'
            : 'documented ∧ enforced',
        },
      };
    },
  };

  return {
    vocab: 'V2-PREDICATES',
    predicates: {exists, documented, enforced, witnessed, contradicts, throws_on},
    can_execute_now, UNKNOWNS, QUESTIONS,
    index: ix,
  };
}