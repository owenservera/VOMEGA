# Shared Seed — Elephant Protocol Gym

> **First interview decision:** Include *both* the simple TypeScript fixture and real available Elephant sources; reuse the [existing source feeder and custody contracts](FEEDER_REUSE.md). Read its availability checks before selecting real code. Do not invent another ingestion pipeline. When private artifacts cannot be supplied, use repository-available code or mark the real-source cohort unavailable. Maintain the plain-source control.

**Feed this document unchanged to every independent dry-run agent.**
**Run scope:** bounded first training/conditioning exercise. **Status:** owner-guided goals + open technical mechanisms.

## Why this work exists

We want the Elephant development system and the foundational semantic SDK to **learn together** how source code can describe its own meaning, support a source-grounded human wiki and machine knowledge view, and improve how AI agents understand and change real projects. Existing programming languages already provide familiar objects (files, functions, variables, types, conditions, loops). Do not reinvent them.

The first experiment starts from one boring TypeScript file. In one research track we describe its semantics *deliberately and excessively*, while saying what is demonstrated and what is only claimed. In competing tracks we question, compress, restructure or regenerate that meaning. The same experiments should reveal how best to construct an Elephant's context, memory, handoff, self-knowledge and development toolkit. There is a vast space of possible solutions; exploration is not a failure to adhere to a plan.

We want **correct behavior and learning per full-loop time/cost**, not a maximal framework, one favored ontology or the shortest code.

## The outcomes to aim at (illustrative canonical behavioral vectors)

A useful version would (1) inspect ordinary source, (2) explain its capabilities and limits, (3) generate an accurate wiki, (4) navigate cross-file relationships, (5) detect contradictions/staleness, (6) preserve meaning across human/machine projections, (7) ground ambiguous human intent, (8) know what is actually available vs merely declared, (9) improve representations through measured experiments, and (10) enable reliable Elephant knowledge transfer. These are **outcomes**; no mandated ten-method API follows. See the [living behavioral proposals](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/09_EXPECTED_BEHAVIORS.md).

## Seven research rules

1. **Observe before prescribing.** Start with real, ordinary source and the most relevant existing assets. Form small falsifiable hypotheses; don't freeze syntax, logical IR, storage or architecture before evidence.
2. **One joined Machine ↔ Human learning loop.** Source, compiler/semantic meaning, wiki/plain reading/agent view and experiment feedback must inform each other from the beginning. Contradictions are signals, not material to conceal.
3. **Saturate deliberately, then test subtraction.** The verbose description is a research instrument, not final syntax and not automatically ground truth. Compare against a plain-source control. Keep source/compiler/test truth separate from declarations or model prose.
4. **Make unknowns explicit.** Record source and evidence, method, model/tool environment, uncertainties, failed trials and facts you cannot verify. Never present an agent's self-report as independent proof.
5. **Protect the effect boundary.** Reading, describing, compiling and publishing are different from executing arbitrary source or affecting accounts, devices and services. Human intent and fresh permissions remain necessary for effects. No tool is allowed to silently self-authorize.
6. **Keep the experiment small and reversible.** First run: narrow example, minimal test and a readable report. Avoid unnecessary frameworks, databases, mandatory browsers, permanent agent branches or provider/account changes.
7. **Publish portable learning, not just winning code.** Hand off evidence, even failed/rejected hypotheses, in a form another fresh agent can inspect. Actual Elephant development turns retain the existing all-maturity release/publication contract.

## Conceptual architecture — a hypothesis, not a topology mandate

Ordinary source and human intent can be observed as **source-bound claims**. A semantic compiler/checker may create a versioned **meaning publication** and several views: machine knowledge, human reading/wiki, and agent context. Disagreements among the source, intent, claims, rendered views and observed behavior form feedback cases. Agents propose improvements to interpretation, encoding, representation and tooling; independent replay judges them. A **self-runtime** is a candidate introspection layer that tells the system what it actually supports and what it doesn't. A **WikiCore** method family is a candidate vocabulary for querying/relating/explaining knowledge. Neither has a finalized protocol.

**Always separate**: executable source, proposed meaning, compiled publication, derived indexes/views, observed environment, user authority, and experiment evidence.

## Readings and budget

**Required:** this seed + the common TypeScript fixture + your assigned RUN file. Read-only deeper context **as needed**, not wholesale:
- Current [shared design](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/01_AGREED_STATE.md)
- [Source file to meaning](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/02_SOURCE_TO_MEANING.md)
- [Elephant co-evolution](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/design-record/04_ELEPHANT_COEVOLUTION.md)
- [Rule 1](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/RULE_1_MACHINE_HUMAN_COEVOLUTION.md)
- [Experimental reference](../../07_OMEGA_SEMANTIC_SOURCE_ARCHITECTURE/SOURCE_FIRST_SEMANTIC_SATURATION_LAB_2026-10-11.md)

All paths above are relative to this folder. GitHub root: https://github.com/owenservera/VOMEGA/tree/main/elephant-greenfield-omega/03_DEVELOPMENT_SYSTEMS/elephant-protocol-gym . In a hosted Z.ai session, use absolute GitHub links derived directly from this root if relative links cannot be followed; pin the commit SHA actually used.

## One-run response — keep it short

Write a **RUN NOTE** using [REVIEW.md](REVIEW.md): what you tried, what surprised you, actual evidence and limits, one falsifiable next test, and what (if anything) should become SDK/Elephant protocol candidate. Label all claims PROPOSED / OBSERVED / TESTED / UNKNOWN. An output may be a tiny executable artifact with test and README, or an evidence-backed design comparison. Do not claim a live system was launched without real execution evidence.

This is a shared seed, not a script to copy every sentence into output. Your goal is to **discover**.