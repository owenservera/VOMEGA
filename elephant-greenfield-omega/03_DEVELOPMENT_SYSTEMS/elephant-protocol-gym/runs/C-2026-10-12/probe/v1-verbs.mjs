// RUN C — Vocabulary V1: VERB-LED introspection.
//
// COMPETING HYPOTHESIS: self-knowledge is best served by a small set of verbs
// mirroring what a developer already does by hand (look up, explain, trace,
// challenge). Each verb corresponds to exactly one operation and one evidence
// source.
//
// STRENGTH (hypothesis): procedural familiarity. A reader who knows how to grep
// and read a stack trace already knows these verbs.
//
// WEAKNESS (to be tested): a verb menu can only surface what it has an operation
// for. Anything the author did not think to make a verb is invisible to a user who
// thinks in verbs. This is the risk of freezing a method list.

import {buildIndex, loadGroundTruth} from './index.mjs';

export function makeV1() {
  const ix = buildIndex();
  const gt = loadGroundTruth();

  /** VERB: SYMBOL — what declarations exist, and how they are pinned. */
  const SYMBOL = (name) => {
    const s = ix.symbols.get(name);
    if (!s) return {status: 'NOT_FOUND', queried: name, known: false};
    return {
      status: 'OK', queried: name, known: true,
      kind: s.kind,
      signature: s.signature,
      line: s.line,
      evidence: {sourcePin: ix.fixture.pin, file: ix.fixture.path, basis: 'lexical-scan'},
    };
  };

  /** VERB: EXPLAIN — author meaning vs mechanically witnessed behaviour. */
  const EXPLAIN = (name) => {
    const s = ix.symbols.get(name);
    if (!s) return {status: 'NOT_FOUND', queried: name, known: false};
    const claim = ix.claims.get(name) ?? null;
    const observed = Object.entries(gt.runtime)
      .filter(([k]) => k.startsWith(name + '('))
      .map(([k, v]) => ({probe: k, observed: v}));
    return {
      status: 'OK', queried: name, known: true,
      claimed: claim ? {text: claim.text, epistemicStatus: claim.epistemicStatus} : null,
      observed,
      epistemicWarning: claim
        ? 'The claim above is AUTHOR-ASSERTED. Only `observed` entries are witnessed by execution.'
        : 'No author claim; nothing asserted either way.',
      evidence: {sourcePin: ix.fixture.pin, executor: 'node v24.11.1', basis: 'compiled-and-executed'},
    };
  };

  /** VERB: RELATE — call relationships inside this file. */
  const RELATE = (name) => ({
    status: ix.symbols.has(name) ? 'OK' : 'NOT_FOUND',
    queried: name,
    known: ix.symbols.has(name),
    outgoing: ix.edges.filter((e) => e.from === name),
    incoming: ix.edges.filter((e) => e.to === name),
    caveat: 'edges are lexical within ONE file; cross-file callers are UNKNOWN, not zero',
    evidence: {sourcePin: ix.fixture.pin, basis: 'lexical-scan'},
  });

  /** VERB: CHALLENGE — declared contract vs enforced behaviour. */
  const CHALLENGE = (name) => {
    const s = ix.symbols.get(name);
    if (!s) return {status: 'NOT_FOUND', queried: name, known: false};
    const claim = ix.claims.get(name);
    if (!claim) {
      return {status: 'NO_CLAIM_TO_CHALLENGE', queried: name,
              note: 'no doc comment asserts a contract, so there is nothing to falsify'};
    }
    const violations = gt.runtime.violationBehaviour ?? [];
    // exit 0 on the violating caller means the compiler ACCEPTED those violations,
    // i.e. the precondition is NOT enforced. Inverting this yields a false 'upheld'.
    const typeEnforced = gt.typecheck.contractViolatingCaller.exitCode !== 0;
    const findings = [];
    for (const v of violations) {
      findings.push({
        violatedInput: `count = ${v.count}`,
        threw: v.threw,
        emissions: v.emitted,
        contradictsClaim: true,
        detail: v.emitted === null
          ? 'raised an error (claim upheld at boundary)'
          : `silently produced ${v.emitted} emissions instead of rejecting`,
      });
    }
    return {
      status: 'CONTRADICTION_FOUND', queried: name, known: true,
      claim: claim.text,
      claimEpistemicStatus: claim.epistemicStatus,
      typeSystemEnforcesPrecondition: typeEnforced,
      runtimeHasGuard: gt.runtime.hasGuardInEmittedJs,
      findings,
      verdict: typeEnforced || gt.runtime.hasGuardInEmittedJs
        ? 'claim appears enforced'
        : 'claim is DOCUMENTATION ONLY — unenforced at type level and at runtime',
      evidence: {
        sourcePin: ix.fixture.pin,
        typecheckWitness: gt.typecheck.typeViolationControl.verdict,
        basis: 'tsc 7.0.2 --strict + node execution',
      },
    };
  };

  /** VERB: CAPABILITY — what this system can actually DO right now. */
  const CAPABILITY = () => ({
    status: 'OK',
    vocabulary: 'V1-VERBS',
    executableNow: [
      'SYMBOL(name)', 'EXPLAIN(name)', 'RELATE(name)', 'CHALLENGE(name)', 'CAPABILITY()',
    ],
    substrate: {file: ix.fixture.path, pin: ix.fixture.pin, sha256: ix.fixture.sha256},
    notImplemented: [
      'cross-file call resolution', 'type inference', 'staleness detection',
      'any operation not listed in executableNow',
    ],
    epistemicRule: 'A verb not in executableNow is UNKNOWN, not absent.',
  });

  return {SYMBOL, EXPLAIN, RELATE, CHALLENGE, CAPABILITY, vocab: 'V1-VERBS', index: ix};
}