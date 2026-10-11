# Elephant Gym — Protocol Backbone v0.1

**State: CANDIDATE DATA MODEL; not a ratified Gym runtime, not authorization to launch, not a completed migration.** Prepared 2026-10-11.

## Why this exists

A Gym should not need a 30-page protocol prompt each time it starts an experiment. We need a **small composable machine contract** that preserves exact source/decision/evidence lineage while letting an execution controller understand **what a protocol needs, when it may run, how it is checked, what happened, and where its original full rationale/implementation lives**.

This backbone is an **index + contract normalization**, not an attempt to convert every idea into one forced architecture. A card is a structured *view of a source*, and a source can have multiple competing cards. Core design records, executable code, detailed safety analysis and withheld oracle custody cannot be losslessly replaced with a few JSON keys; the source refs and a completeness flag preserve what was deliberately not transcribed.

## File map

- `schemas/protocol.schema.json` — normalized **Protocol Card**: identity, original sources, scope/authority, typed input/output slots, environment capability dependencies, phase transition conditions, evaluation gates, metrics, hypotheses, alternatives, governance status and named extension modules.
- `schemas/run.schema.json` — immutable **Run Receipt** separate from proposed protocol; source/requirements/test epoch, host-proven events, artifact hashes, evidence types, measured/unknown costs and actual published pack status.
- `schemas/registry.schema.json` and `registry.json` — source/proposal provenance and links to concrete card files; original research is not removed by an integration experiment.
- `protocols/*.json` — eight **candidate** normalized protocol cards, including the new Claude attached Time-Credit proposal, Claude v0.2 executor, general Z.ai A/B/C, R0 five Gyms, all-turn publication, source/knowledge/visual/self-governance contracts.
- `examples/not-run.json` — intentionally truthful example; no fake benchmark clock, published pack or SDK success.
- `tools/validate.mjs` + `tools/validate.test.mjs` — dependency-free **structural and cross-reference** checks, not a full JSON-Schema, executable gate or security auditor.

Run from this directory with Node 20+:

```bash
node tools/validate.mjs
node --test tools/validate.test.mjs
```

All protocol file paths are relative to this directory. Registry `assets[].uri` paths are repository-relative or exact `attachment://` references; attachment URIs require the user-supplied ZIP outside public Git, and are not network fetch instructions.

## The normalized experiment contract

```text
registry.json ──> Protocol Card (research hypothesis and constraints)
      │                 │
      │       composes modules by stable protocol ID
      │                 ↓
      └──> Original source/docs/tools ◀── executor/capability census
                                        │
                                 FROZEN task/source/gates
                                        │
                              independent actual execution
                                        │
                               Run Receipt (NOT claims)
                                        │
                       evaluator + raw witness + honest unknowns
                                        │
                       all-turn capability pack publication
                                        │
                   candidate reuse, versioned promotion / rejection
```

An experiment can compose several protocols without copying all their text. For example, the proposed five-Gym launch uses `epg.r0.five` plus `epg.semantic.selfhosting`, `epg.visual.parity`, `epg.publication.allturn`, `epg.research.library`, and a *selected independently evaluated* executor/economy module. Modules describe requirements; only verified adapters perform actions.

**Protocol Card fields are typed research obligations, not runtime permissions.** `authority:"research_only"` is intentionally true even when it references a source with an owner-level requirement; the owner governance card itself is `owner_direction`. Neither an extension nor a card changes host entitlements or owners' decisions.

## Example: reuse Time Credits without importing its entire organization

Open `protocols/claude-time-credit.json`. It retains:
- `T0–T6` paying vs observational gates and the original `config/gates.json` ref.
- Time Credit accounting with explicit worker/referee/human components, `NULL/UNKNOWN` semantics and versioned rate card.
- `E0 / PROTO / SEEDED` alternatives and genuine preregistration, oracle and sealed evidence requirements.
- The explicit **`SDK-FAIL-01 runnable:false`** blocker, avoiding a false claim that the current R0 SDK story can be launched and scored today.
- Complete source pointer and ZIP SHA-256. The ZIP is preserved in the user's supplied attachment; it is **not automatically uploaded publicly**.
- Test scope: the locally executed attached `tools/credits.test.mjs` suite passed **26/26 on synthetic ledger mechanics**. **No real Elephant classes or economic advantage were measured**.

Crucial distinction: Time Credits are a proposed **optional accounting/incentive layer**. Their `yield_ratio` and payment rule do not overwrite the Gym's owner objectives, turn-pack duties, safety gates, or source-grounded visual/semantic experiments. Economies can incentivize hiding useful difficult work, chasing narrow easy test cards or shifting cost to integrators. Report independent accepted software outcomes, actual elapsed time, full integration labor, refusal/unknown counts and preserved exploratory learnings side by side; do not compress all into one reward.

**Existing C1/C3** tasks are provisional runnable benchmarks tied to Claude v0.2 contracts and acceptance files; their hidden-oracle custody must be verified in the actual launch habitat. **SDK-FAIL-01 is deferred**, since the real failing SDK test, executable acceptance and hidden oracle are not yet prepared. The controller may run a calibration on verified C1/C3 without pretending it is the final R0 SDK proof.

## Mapping and coverage contract

`registry.assets` is a *starter source crosswalk*, not a claim of exhaustively recovering every old artifact or all private workspaces. Each entry has classification, original source URI, mapped normalized protocol IDs and an explicit qualification. When expanding:
1. Pin original immutable blob/ZIP or Git commit SHA; preserve unrestricted raw original in its correct authorized storage.
2. Add an asset entry; do not silently erase duplicate or rejected past designs.
3. Reference an existing protocol card or create a new card if its **observable behavior, authority, evaluation or timing rules materially differ**.
4. Never override an upstream protocol source just to make the normalized card prettier. Mark `PARTIAL_MAPPING` until an independent source-to-contract fidelity check is complete; source text prevails for omitted nuance.
5. Make the run receipt record the exact frozen protocol version/hash and owner requirement epoch. Changed requirements, source, gates, rates or holdouts create a **new experiment cohort**, never rewritten past results.
6. Every actual agent turn publishes **complete all-maturity packs** under the existing contract. Registry entries alone are not publication/replay evidence.
7. Promote any machine governance coverage to U0–U5 only after the relevant real witness; a card cannot certify itself.

## Design constraints that must survive compaction

**Authority:** owner-approved direction ≠ executable authorization. Semantic publication (Enter) ≠ effect consent. Actual permission gates stay external.

**Observability:** source inspected ≠ tool ran; self-report ≠ host telemetry; headless visual assertion ≠ actual 3D comprehension; synthetic ledger pass ≠ independently isolated agent run.

**Time:** wall clock, worker active time, review/integration time and human intervention are separate metrics with distinct clocks. Missing tokens/costs stay UNKNOWN. A proposed 60-minute cap is not a measured expected duration.

**Independence:** prove fresh contexts, separation and parallel overlap in the target executor. Five sequential roles in one context must be labelled PROCESS_REHEARSAL, not a five-agent study.

**Fairness:** Claude's Time-Credit pack evaluates three **matched classes** `E0/PROTO/SEEDED` across tasks and seeds. Our R0 five-Gym proposal has five **different specialized roles**, so credit payments and class-relative medians are *not* statistically comparable until designs are balanced. Keep these separate cohorts and compare only defensible quantities.

**Minimality:** if a new contract/schema field has no independent consumer or falsifier, defer it. Do not build another data lake, orchestration service or global config runtime to maintain this registry. The schema is an experimental interface, replaceable after evidence.

## Next actual validations needed

- Independently run `node tools/validate.mjs` and `node --test tools/validate.test.mjs` in a cloned repo; the two tests validate structure and references only.
- Verify all source paths/commit SHA checks and rerun exact executable code from the attached Claude pack in any intended target runtime before claiming deployability.
- Conduct **roundtrip mapping audit** of one full original protocol to cards and back: independent reviewer must identify every material invariant, exception, failure condition, external authority and artifact from the original, or report missing mapping. Aim for high recall, not forced brevity.
- Choose one runnable **C1/C3** control to test whether the new compact cards can drive existing tooling without interpretation drift. The SDK-failure benchmark remains BLOCKED until deliberately failing SDK test and frozen acceptance/oracle are made available.
- Compare a full-original-brief arm vs compact-card-plus-refs arm on independent matched inputs; record comprehension, violations, wall time and tokens. This is the real proof that compact schemas can replace long repetitive instructions *for a specific experiment*.

## Proposal and migration boundaries

This does **not** supersede original R0 five-Gym documents, six-stream adaptive research, Claude's Time-Credit IP/docs/tools, the Claude v0.2 runner, general Z.ai A/B/C, or the original owner requirements. It is a reversible, transparent normalization layer. Additional YAML authoring may be added later if an actual parsing/workflow benefit appears; JSON remains the authoritative machine format for now, avoiding dual drift.

**Machine contracts are small; evidence remains rich; historical intelligence remains recoverable.**
