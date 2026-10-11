# Symbolic Command Language — Recovered Asset and Gym Experimental Intake

**Status:** REAL LEGACY SOURCE VERIFIED IN GIT; 17 lexer families are implemented in TypeScript, complete semantic composition and integration with today's Gym are NOT VERIFIED. **Last reviewed:** 2026-10-11. **Disposition:** preserve as first-class **research seed, reusable code/control, and optional development booster**; neither treat a previous implementation as the new SDK canon nor invent an alternative grammar without comparing it.

## Why this belongs here

The Gym is intended to discover a fast and truthful **human ↔ machine ↔ spatial** semantic language and learn how to build its own protocols. The original VIVIM/Ω code already supplies a compact symbol alphabet, lexical scanner, deterministic natural-language interpreter, mixed symbolic and natural input, typed world-grounding, candidate alternatives, explanatory traces and visual projections. This is a much better experimental starting point than proposing 17 new operators without reading the existing software.

Source-of-truth boundaries: (a) the **current implementation** proves what this repository's source actually declares, not that its behavior has passed new tests; (b) the **historical symbol and SVG documents** describe intended meanings and visualization proposals; (c) the [Semantic Factory](../semantic-factory-zai/03_UNIFIED_SEMANTIC_PRODUCT_GROUP.md) already warns that complete compositional semantics are unproven; (d) [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md) and the [Gym launch policy](LAUNCH_POLICY.md) govern publication/effect/feedback and experiment freedom.

## Source custody — read the real files

**Historical concepts**
- [Command Symbol System](https://github.com/owenservera/VOMEGA/blob/main/harvests/old-vivim/symbolic/COMMAND-SYMBOL-SYSTEM.md)
- [Personal Agent, Self-Knowledge and Command Language](https://github.com/owenservera/VOMEGA/blob/main/harvests/old-vivim/symbolic/PERSONAL-AGENT-SELF-KNOWLEDGE-AND-COMMAND-LANGUAGE.md)
- [Historical large-scale visual symbolic communication research](https://github.com/owenservera/VOMEGA/blob/main/harvests/old-vivim/symbolic/chat-SVG%20Symbolic%20Communication%20Design.txt): extensive dialogue and ideas, NOT independent experiment evidence or a mandatory visual spec. Some meanings differ from the actual code.

**Existing TypeScript implementation**
- [symbols.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/symbols.ts): `SYMBOL_FAMILIES`, normalization and lexical aliases, labelled **D-217** by source comment.
- [lexer.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/lexer.ts): deterministic, span-tracked lexing; recognizes `->`, `=>`, `→`, `>` as arrow tokens, attaches `@name`, `/cmd`, `#tag`, `$var`; aliases both delta glyphs `∆/Δ` and check marks `✓/✔`.
- [types.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/types.ts): exact 17-char `FamilyChar` union, `WorldModel`, typed interpretation and token/trace shapes.
- [frames.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/frames.ts): command-frame/slot definitions; source notes **D-218** separates language data from core glyphs.
- [grammar.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/grammar.ts), [interpret.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/interpret.ts), [index.ts](https://github.com/owenservera/VOMEGA/blob/main/omega-baseline/plugins/vivim-nlcl-pure/src/index.ts): mixed source inputs use common frame/ground/interpret path; raw input, canonical symbol reading, Plain Reading, status, gaps, candidate alternatives, and source/interpretation stage traces. `interpret(input, world)` is designed to be pure (N1), but no new live execution/fuzz/coverage proof has been run in this intake.
- [USPEG synthesis](https://github.com/owenservera/VOMEGA/blob/main/elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/semantic-factory-zai/03_UNIFIED_SEMANTIC_PRODUCT_GROUP.md): already specifies old symbol families, integrated command + self-knowledge + UI and explicit lack of guaranteed complete semantics.

No outside source archive is required to **inspect** the above Git files. The separate sanitized [191-file Dogfood bundle](FEEDER_REUSE.md) remains private and must be supplied independently for its distinct code families. Reuse the existing feeder/custody chain; no additional symbol feeder or authoritative language registry is warranted.

## Exact 17 lexer family map — as implemented, not as universally proved meaning

| Glyph | Family in `symbols.ts` | Current illustrative meaning |
|---|---|---|
| `/` | command | invoke an operation |
| `@` | reference | refer to a grounded person/message/rule |
| `#` | tag | categorization |
| `!` | force | urgency/skip confirmation **card** as historically labelled; **never** bypass required consent or policy |
| `?` | query | interrogate/inspect |
| `+` | add | include/create |
| `-` | remove | exclude/delete/disable |
| `&` | combine | join/chain |
| `$` | value | variable binding and reuse |
| `*` | wildcard | all/every |
| `%` | config | tune capability parameters |
| `∆` | delta | change existing state |
| `✓` | confirm | accept a pending consent/action **card**, NOT proof of verified behavior |
| `=` | assert | define/teach a word or mapping |
| `^` | priority | prioritize queued work |
| `~` | approximate | fuzzy matching mode; never resolve uncertainty by force |
| `→` | direction | route source to target |

**Important mismatches to investigate, not erase:** the historical SVG exploration also depicts `$` as economic resource, `%` as transform/modulation, `✓` as verification/proof, `^` as hierarchy and `!` as more general imperative. Current source uses the narrower definitions above. This is an excellent falsifiable case of **symbol reuse/context ambiguity**, especially when the same glyph is displayed in a 3D canvas. These meanings must be scoped; do not conflate a *glyph family*, a *lexical token*, an *operation*, an *evidence status*, a *UI mark* and an *execution authorization*. For example, the same visible checkmark must not equate consent with passing an independent referee test.

The literal set contains 17 family identities, while the lexer separately handles glyph aliases and multi-character direction tokens; code should not determine “17” by naïvely counting `FAMILY_GLYPHS`.

## What is actually known and unknown

**Source-inspected:** the files exist; `symbols.ts` declares the 17 families; `lexer.ts` recognizes glyph variants and source offsets; `interpret.ts` has scanner → lex → modifier parse → recognizers → frame match → ground/resolve → projection, with trace and alternatives. `index.ts` exports the library and `emptyWorld()`; no external imports are exposed in this entry file. Its `package.json` declares version `0.1.0` and a pure, zero-external-import design.

**Not established by this inspection:** all 17 operators participate in complete valid composition; every combination has correct precedence and effect semantics; the browser can import the TS source without build preparation; a human-language phrase always roundtrips to exactly one symbolic form; real account grounding is available; effects or permissions are enforced by this pure interpreter; timing meets real-time target; canvas glyphs have semantic parity; new benchmarks or tests pass. Treat source comments like “zero allocations” as design assertions until measured.

**Security discrepancy worth explicit study:** the implementation declares `!` as “skip the confirmation card,” but the current Gym [effect boundary](LAUNCH_POLICY.md) prohibits a symbol from granting external execution authority. A valid lab must prove that routing/consent gates are independent and cannot be bypassed by `!`. Similarly `✓` may represent a consent proposal only when independently validated against the correct outstanding authorization state; `~` must never manufacture a grounded target or READY status.

## Integration into the existing Rule 1 / 3D manifold

Use the source as an **optional input language and comparative implementation**, not a second canonical interpreter:

```text
human language / glyph notation / canvas semantic manipulation
            ↓
  candidate token + frame + grounded-identity interpretation
            ↓
  versioned semantic snapshot with ambiguity and evidence
        ┌─────────┼───────────┐
      MACHINE    HUMAN      SPATIAL
    structured   Plain      3D nodes,
      meaning  Reading/Wiki relationships
        └─────────┼───────────┘
             PARITY + CORRECTION
                  ↓
     shared Rule 1 experiment / independent adjudication
```

Test if existing `interpret` offers a useful control for the new TypeScript semantic SDK; if its IR, naming, world model or scope is unsuitable, write an **adapter or independent competing version** with a fidelity test rather than silently adopting the old runtime into the new kernel. Compare human→symbols, symbols→human, source/intent→IR, and canvas semantic action→IR **against the same pinned source/revision**. Preserve alternative interpretations, missing entities, context gaps and provenance. Glyph-based visual elements must correspond to the same canonical meaning publication as textual projections, and never create effects just by being clicked.

## First Gym microexperiments — candidate prompts, not a mandated implementation

**S1 — Lexical truth and collisions:** enumerate all 17 families directly from the TypeScript declaration; test normal and alias Unicode (`∆` vs `Δ`, `✓` vs `✔`) plus multi-character arrows, quoted literal symbols, mixed command/NL input, and empty/stray input. Show token spans and invalid/unknowns. Falsifier: a claimed operator is silently lost, recognized under a different family or changes meaning inside quoted content.

**S2 — Symbolic/NL parity:** compare `/send @this → @peter` to “send this to Peter” under the **same pinned** `WorldModel`. Extract canonical IR/reading, alternatives and gaps; do not assume both are fully grounded or equal. Falsifier: same claimed intent differs in target/effects/status without a disclosed reason. Plain reading and symbolic view must be explained through one semantic publication rather than asserting the glyph string is authoritative.

**S3 — Dangerous modifiers and overloads:** build ambiguous account/entity fixtures for `!`, `~`, `✓`, `*`, `∆` and `^`. Verify independent permission/refusal, status and changed-source behavior; compare the literal tokenizer role with SVG/rendering role. Falsifier: `!` or `✓` silently authorizes an unrelated external effect, or `~` converts an ambiguous target to READY.

**S4 — 3D / Human–Machine / Wiki parity:** for one versioned command, draw candidate glyph chips/relations in the **infinite 3D canvas** with its visible Plain Reading, machine record and source wiki. Mutate the target or source epoch, ensure any stale glyph/node/arrow is exposed. Falsifier: spatial representation communicates different authority/effects/target or history from canonical publication.

**S5 — Self-knowledge query:** experiment with `?` querying capabilities, dependency, authority or history with proof labels and missing-link reports. Read directly from source/World/evidence projections; a query does not magically create a functioning self-runtime.

**S6 — Competitor controls:** compare plain NL, 17-family symbolic, hybrid NL+symbols and a small alternative representation on the same held-out scenarios, measuring fidelity, coverage, fresh-reader comprehension, repair steps, parity discrepancies, edit→reading latency, correction→adjudicated improvement and full lifecycle cost. Discovered failure vectors count as useful results. Don't let the 17-family research dictate all competitor encodings.

Every microexperiment must publish a [Machine ↔ Human signal](MACHINE_HUMAN_SIGNAL.md) and use the existing [review/all-maturity release](REVIEW.md). No new standalone evaluation backend is necessary.

## What should enter the SDK canon, and what should not yet

**Immediately include as discoverable candidate knowledge:** the symbol-family IDs, versioned source linkage, existing code paths, lexical variants, documented differences, and the above named falsifiers. Treat the history as historical knowledge, not as proof of a current SDK parser. This research result itself can be a source-grounded wiki entry, not a mandatory runtime module.

**Do not yet ratify:** 17 mandatory grammar operations, old `WorldModel` as the new SDK's canonical reality, `!` confirmation bypass semantics, blanket SVG iconography, old confidence thresholds, a required symbol view in every product interface, or proof claims about bidirectional roundtrips.

The [existing source feeder](FEEDER_REUSE.md) and [replaceable automation](AUTOMATION_REUSE.md) supply the experiment; [initial 3D canvas/parity design](INITIAL_STATE.md) supplies the shared intended experience; [Wasm](WASM_BOOSTER.md) remains an optional implementation booster. Any change to shared owner-approved [launch canon](LAUNCH_POLICY.md) must be reviewed.
