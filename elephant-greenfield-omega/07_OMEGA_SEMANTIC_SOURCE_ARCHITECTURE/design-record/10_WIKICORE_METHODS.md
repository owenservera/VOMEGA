# WikiCore — A Candidate Method and Verb Research Program

> **Research inventory only:** the candidate verbs are hypotheses, not an approved WikiCore API. Independent [Elephant Protocol Gym](../../03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym/README.md) runs should discover methods without being instructed to implement this table.

**Role:** evergreen method-language inquiry, not an adopted external or internal protocol.
**Status:** CANDIDATE / OPEN_LAB. **Last edited:** 2026-10-11. **Question:** what is the smallest useful vocabulary of semantic operations that can serve source, wiki, runtime, user intent and Elephants?

## A useful name, but not yet a standardized thing

“WikiCore” is our **working name** for the proposed meaning-and-knowledge protocol layer. We have not identified a widely accepted public standard of this name that would justify copying a supposed canonical method list. A GitHub project named WikiCore exists as an archived small .NET wiki, but it is unrelated to the proposed universal source-semantic compiler. Therefore **do not represent WikiCore as an established external protocol**.

The research task is to find what existing tools and standards already do well and decide which ideas can be adapted. This is not an invitation to implement MediaWiki inside the compiler or impose RDF as the physical storage model. The first WikiCore can be a very small, source-first logical interface with ordinary TypeScript inputs and typed outputs.

## Why we need a method vocabulary

A wiki is more than pages of prose. Its essential behavior includes identifying a subject, showing its attributes, following links to related subjects, recording statements, retrieving versions, comparing revisions and communicating what changed. Our ambition adds source-code inspection, typed claims, evidence and contradiction analysis, automatic wiki generation, intent interpretation and guarded runtime state.

A coherent vocabulary makes the behaviors discussable without choosing implementation architecture prematurely. A method such as “trace” should mean something testable to a reader, compiler, human interface and agent, regardless of whether its current implementation is a JSON lookup, TypeScript AST walk, graph traversal or a composite of those.

## Research seams and external precedents

**MediaWiki Action API:** methods for querying, searching, parsing wiki content, editing pages and retrieving revisions provide a mature vocabulary for page/lifecycle operations. These are useful precedents for revision awareness and accessible content views, but page editing is not equivalent to verified code semantics. Official tutorial: https://www.mediawiki.org/wiki/API:Tutorial/en; revisions: https://www.mediawiki.org/wiki/API:Revisions; parse: https://www.mediawiki.org/wiki/API:Parsing_wikitext.

**Wikibase:** entities, properties, statements, qualifiers and references provide a disciplined model of structured claims. We should test whether its qualified-statement ideas help represent assertions with environment, version and evidence without locking ourselves into its JSON format or identifiers. Documentation: https://doc.wikimedia.org/Wikibase/master/php/docs_topics_json.html and https://doc.wikimedia.org/Wikibase/master/php/repo_domains_statements_README.html.

**Language Server Protocol (LSP):** established verbs include symbols, hover, definition, references, rename, code actions and diagnostics; its published capabilities are a strong precedent for editor-facing discoverability and incremental source awareness. Its protocol is not an ontology or a semantic truth system. https://microsoft.github.io/language-server-protocol/ and https://github.com/microsoft/language-server-protocol/blob/gh-pages/_specifications/lsp/3.18/specification.md.

**W3C PROV-O:** Entity, Activity, Agent, used/wasGeneratedBy/wasDerivedFrom/wasAttributedTo provide precedents for provenance and source lineage. https://www.w3.org/TR/prov-o/.

**W3C SHACL:** shape-based graph constraint checking and validation reports provide a research basis for validating structured knowledge. SHACL is not a proof of arbitrary application behavior and does not imply RDF is mandatory. https://www.w3.org/TR/shacl/. A SHACL 1.2 Core Working Draft existed on 2026-10-08; it is a draft, not a ratified replacement standard for this SDK: https://www.w3.org/TR/shacl-core/all/.

Also study compiler ASTs, TypeScript typechecker, incremental compiler cache/invalidations, SCIP/LSIF, ECP/A2A/MCP exchanges, and code/wiki autogeneration designs already inventoried in the master blueprint. Independently evaluate compatibility, cost, loss of nuance, and no-dependency prototype viability.

## Candidate verbs, grouped by observable purpose

The following names are **illustrative semantics**, not final SDK endpoints. Each must define input, output, failure cases, side effects, provenance, snapshot binding and minimum test before promotion.

| Method family | Candidate verbs | What it should mean |
| --- | --- | --- |
| Locate / identify | \`identify\`, \`resolve\`, \`locate\` | Attach scoped identities and find subjects/anchors without guessing identity |
| Observe source | \`inspect\`, \`extract\`, \`parse\` | Read ordinary source and extract mechanically supported structures |
| State meaning | \`declare\`, \`describe\`, \`qualify\` | Express purpose, claims, scope and degree of certainty |
| Relate knowledge | \`link\`, \`relate\`, \`dependOn\` | Connect subjects with typed direction, context and evidence |
| Check meaning | \`validate\`, \`verify\`, \`contradict\` | Test constraints and reveal unsupported or conflicting claims |
| Reconstruct / retrieve | \`query\`, \`trace\`, \`explain\` | Answer with source/evidence pointers and explicit coverage gaps |
| Publish views | \`project\`, \`renderWiki\`, \`publish\` | Emit different human/machine views tied to one versioned semantic snapshot |
| Observe evolution | \`diff\`, \`invalidate\`, \`refresh\` | Detect changes, stale dependents and affected context |
| Learn / compare | \`propose\`, \`compare\`, \`replay\` | Run candidate alternatives against pinned discrepancy cases |
| Interface with action | \`interpret\`, \`simulate\`, \`requestAuthorization\` | Show intended consequence and separately handle permission/effects |

The verbs may collapse into fewer methods or expand into layered namespaces after experiments. A candidate primitive should never secretly execute source during metadata inspection. “Declare” does not mean “prove.” “Publish” does not mean “authorize.” “Verify” must state *what was actually checked*. “Explain” must reveal when something is unknown.

## The smallest possible WikiCore exercise

Write \`add(a, b)\`, a mutable counter and a deliberately false comment inside the first TypeScript fixture. An introspection method returns symbols and exact source anchors. A description method supplies candidate intent and evidence. A checker catches at least the mechanically accessible mismatch. A wiki projector displays source-grounded claims and UNKNOWN. A query or trace method links to caller. Finally an edit invalidates the previous publication.

Compare one combined \`inspect\` command, a modular verb API, and generated JSON with a thin query wrapper. Which variant is easiest for humans, models and conventional tooling to adopt? Does a canonical verb layer actually help—or merely duplicate LSP and AST APIs? Use held-out tasks, not API aesthetic preference.

## Contract pattern for each verb

**Stable candidate verb ID; intent; inputs and types; source/snapshot scope; output shape; derivation and evidence class; version compatibility; allowed side effects; ambiguity/unknown behavior; failure modes; human rendering; consumer set; performance cost; tests and independent oracle.** Keep it in one record. This becomes method-level documentation, introspection material and benchmark contract, not necessarily a new runtime class.

## Open questions and routing

Is WikiCore primarily a set of **semantic verbs** or a broad protocol encompassing schema, transport, storage and authorization? Which methods already exist in LSP/TypeScript and should be reused? Which descriptions should be pure projections rather than writable assertions? What makes links version-aware and n-ary? Can the same vocabulary express a wiki query and a program effect safely? What is the minimum method set for one source file? The decision board should keep these questions open until small tests discriminate them. See [14](14_INTERVIEW_ROUND_01.md), [05](05_PRINCIPLES_AND_CONTRACTS.md), [12](12_AUTOMATION_TOOLKIT.md) and [13](13_RESEARCH_ARM.md).