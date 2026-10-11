# 02 — Target semantic product architecture, harvest anchors and actual utility

## The user-facing target: human-programmable executable semantics

The first use case is not an AI free-form shell and not converting prose directly to arbitrary executable OS code. It is **a programmable, inspectable semantic command system** in which natural language and symbolic notation refer to deterministic capability declarations. The compiler can use probabilistic suggestions, but no guessed meaning, confidence or model output grants execution authority.

```
Original utterance / explicit symbols / UI semantic edit
  → lexical tokens + token spans + family normalization
  → versioned language frames and candidate meanings
  → grounding against revisioned World and entities
  → alternatives + unresolved/negative-intent frontier
  → candidate canonical command / stable semantic identity
  → declaration-derived required fields, compatibility and readiness
  → effect, risk and authority preview; consent as explicit action
  → immutable committed command bound to World+revision
  → selected realization / virtual first
  → evidence events and truthful observed outcome
  → new World/Work state + source-grounded contextual Wiki
  → matching visual projection and correction controls
```

**Human feedback** is part of the language: intermediate annotation is bound to a revision and token span; choices and clicks emit semantic edits through the same reducer; UI never privately reparses the sentence or bypasses authorization. Show understood action, exact Provider and Account, alternatives, unresolved words, consequence, permission, stale evidence and result. The Negative Intent Signal Engine may reveal plausible consequential counterfactuals at the first useful moment; it derives them from the *same* candidate space rather than a second interpreter.

## Existing symbolic families to assay

The VOMEGA symbolic harvest records 17 lexical families, and the current `vivim-nlcl-pure` lexer supports attached tokens such as `/send`, `@peter`, `#tag`, `$var`. **The glyph family is an anchor to investigate, not evidence that every compositional semantic is already implemented.**

| Glyph | Historically proposed family | Harvest focus | Example candidate to falsify |
|---|---|---|---|
| `/` | command | explicit capability trigger; mixed natural syntax | `/send @this → @work` |
| `@` | reference | resolved entity, scope, context binding; Account vs Provider | `@claude-work` |
| `#` | tag | taxonomy, label or contextual constraint | `#urgent` should not become authority |
| `!` | force | risk/force semantics; must never bypass consent | `!` alone cannot authorize |
| `?` | query | self-knowledge and grounded help | `? dependencies @prompt.send` |
| `+` | add | registering relationships and adding objects | `+ @account` |
| `-` | remove | destructive consequence and gating | `- @account` |
| `&` | combine | composition and fan-out of operations | `&` fan-out requires distinct targets |
| `$` | value/binding | typed parameters and variables | `$prompt` binds data not authority |
| `*` | wildcard | safe bounded expansion | wildcard cannot invent target Accounts |
| `%` | configuration | observable configuration intent | `%` does not silently rewrite auth |
| `∆` | change | diff/update semantics | delta has explicit original and new |
| `✓` | confirm | explicit semantic acknowledgement | confirmation still tied to command digest |
| `=` | assert/teach | principal-owned language rules | taught synonyms don't grant authority |
| `^` | priority | precedence/ranking, not secret privilege | ranking must not silently pick Accounts |
| `~` | approximate | uncertainty/fuzzy matches | fuzzy target isn't execution-ready |
| `→` | direction | source/target routing | route tokens cannot be swallowed as payload |

These example forms are **test hypotheses**, not frozen product grammar. Symbols and ordinary sentences should converge on one semantic IR when equivalent. The parser must report unmatched spans and ambiguities rather than manufacturing resolved commands.

## Eight mandatory harvest lenses

1. **Language and symbols:** lexers, token spans, operator families, aliases, natural phrases, teaching rules, grammar, canonical paraphrases; historical tests and negative examples.
2. **Semantic identities:** Provider, Account, Model, Session, entity references, stable capability ID, realization; risk cannot define semantic identity.
3. **Executable command contracts:** parameters, types, required fields, preconditions, compatibility, effects, deterministic digest, revision/World basis, replay semantics.
4. **Ambiguity and correction:** tie sets, unrecognized words, stale mentions, unknown recipient, negative-intent candidates, early correction point, typed/clicked parity.
5. **Visual language:** underlines, scopes, brackets, icons/device-vs-AI/provider, explainable status, consequences, latency and caret preservation, semantic handles and customizable icon roles.
6. **Realization and observation:** provider bindings, lifecycle, attempt/outcome distinctions, error recovery, account/session drift and no fabricated success.
7. **Self-description and contextual assistance:** source-native Reflection metadata, symbol-to-source links, Wiki as projection, gaps and evidence freshness.
8. **Failure inheritance:** failed tests, routing bugs, false READY, stale UI, known impossible assumptions, unusable experiments, conflicts with current invariants.

## Highest-value code discovery starting points

- `vivim-final/src/engines/unified-registry.ts` + `tests/e2e/nlcl-golden.test.ts`: capability identity, language mappings and golden interpretations.
- `edge-pwa/cap-store/` taxonomy→provider binding→action program + protocol lab: execution prerequisites, outcomes, repairs, discoverability and candidate scoring.
- `vivim-omega/docs/migration/FACT-BASE-2026-09-16.md`, migration triage and vision atoms: constitutional lessons, rejected designs, intent lineage.
- Current `VOMEGA/omega-baseline/plugins/vivim-nlcl-pure/src/{symbols,lexer,grammar,ground,interpret,project}.ts`: code-level real compiler seams.
- Current `VOMEGA/omega-baseline/experimental/d1/src/`: command validation, session/revision identity, projection and still incomplete virtual realization/help/launch. Use actual tests, not prose assertions.

## Semantic Harvest Offer (the minimal useful output)

A unit is valuable only if it moves toward *current product decision or reproducible test*. Every offer must include:

`offer_id`, `historical_source_refs` (repo/commit/blob/symbol/span), `observed_behavior_or_claim`, `operator_families`, `utterance_examples`, `canonical_intent_candidate`, `world_preconditions`, `unresolved_cases`, `current_omega_target_symbols`, `proposed_feedback_signal`, `negative_cases`, `historic_evidence_class`, `freshness`, `confidence_not_proof`, `falsifier`, `consumer_response`, `lineage`.

Offer lifecycle: `EXTRACTED → OFFERED → CHALLENGED → {ACCEPTED_AS_TEST_CANDIDATE | REJECTED | DEFERRED | NEEDS_MORE_SOURCE} → {PRODUCT_TESTED | NOT_TESTED}`. **ACCEPTED_AS_TEST_CANDIDATE is not PRODUCT_IMPLEMENTED**.

Illustration: a legacy symbolic command `/send @this → @peter` may share intent with an ordinary-language send frame; the harvester cites the legacy lexer, grammar and tests; the Product Elephant checks `prompt.send` required Account, quote protection, explicit-target precedence and visual revision scope; a proposed regression asserts that `@work` missing from World remains unresolved and no false READY occurs. Never claim `@peter` is a valid `prompt.send` Account in the current product without evidence.

## Functional utility outputs

Produce candidate versioned `LanguageFramePack`, `SymbolicFamilyPack`, `EntityGroundingPack`, `CommandContractCrosswalkPack`, `VisualFeedbackPack`, `NegativeIntentFalsifierPack`, `SourceReflectionPack`, and `RegressionCapsulePack`. Their evidence/proof flags remain separate from the reusable *Elephant infrastructure* packs in `07_PACK_PORTFOLIO.md`.

The initial harvest explicitly does **not** import whole legacy registries, duplicate canonical VOMEGA parser stores, rewrite owner scope, or publish unverified historical behavior as live execution.