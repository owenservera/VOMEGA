# TEAM CHARTER — turn-based full-stack team, two tracks, dogfooded

**Status:** `DESIGN` (the tools in `team/tools/` are `SIMULATED_TEST`). Written for a z.ai-style full-stack web-app agent, but nothing here depends on a vendor; every capability is proven by a census before it is relied on.

## 1. Purpose

Use the Greenfield Ω pack on **itself**. A team of agents builds Prompt Fanout Mini and the instruments that measure it, in **turns (rounds)**. In every round several **arms** try different approaches to the same components in isolation; an independent evaluator grades them blind; each **track** keeps its best-of-breed result and writes down what it learned. After the last round we hold **two track mains**, each the product of its own selection history, plus an evidence-backed comparison of the two.

The deliverable is not only code. It is **trustworthy evidence about which way of working produces better validated software**, produced by the same protocol the pack proposes (ledger, basis stamps, advisory-only cognition, independent verification).

## 2. The two tracks

| | **Track A — Lean** | **Track B — Network** |
|---|---|---|
| Hypothesis | Capsule + citation checks + epoch guard are enough; no resident Elephant | Consulting maintained, source-anchored cognitive nodes adds validated value beyond A |
| Allowed machinery | Capsule builder, citation verifier, epoch guard, plain context bundles, static analysis, ordinary tests | Everything in A **plus** ECP v0.2 switchboard consults (E1-S; E2-S from the round the roadmap enables it) |
| Maps to pack arms | A / B / F in `outputs/claude/EXPERIMENT.md` | E1-S, E1-P (when verified), E2-S |
| Wins by | Smaller, faster, equal-or-better validated output | Finds defects or saves reconstruction that A cannot, net of its overhead |
| Never allowed | Calling a consult an "Elephant" (there are none) | Counting advisory output as evidence; counting scripted/role-played nodes as live Elephants |

Tracks **never share code during a round** and are **never merged**. Only *neutral utilities* (§6) cross, and only through the consolidated main after independent vetting.

## 3. Roles

| Role | Count | Does | Must not |
|---|---|---|---|
| **Controller** | 1 | Runs the round: census, manifest, launch, verification, ledger, closure, stops at the end of the turn | Write arm code; grade arms; promote learnings |
| **Arm** | 2 per track per round (default 4) | Implements/experiments on assigned components in its own directory; writes `ARM_RESULT.json`, `WRITES.json` | Read other arms, the controller dir, hidden oracles; edit seed; self-grade |
| **Evaluator** | 1 fresh context per round | Runs frozen acceptance + hidden oracle tests; scores blind (arm ids hashed); writes evaluation files | See arm transcripts or arm self-reports before scoring; know track identity |
| **Track master** | 1 per track | Assimilates its own arms' selected components into the track main; promotes learnings; proposes next-round variants | Read the other track's code or learnings before its assimilation is ledgered |
| **Integrator** | the Controller, acting in a separate step | Merges vetted neutral utilities into `consolidated/` | Merge track code across tracks |
| **Human (owner)** | you | Decides at marked HUMAN_DECISION points; may stop any round | – |

In a single-agent tool these roles are **modes the same agent enters in separate, labelled phases**. Independence is then `DEGRADED` and must be reported as such (`03_ARMS_AND_ISOLATION.md` §4). It is never silently assumed.

## 4. Principles (inherited from the pack, restated as team rules)

1. **Repo + tests + raw command output are truth.** Reports, summaries and arm self-assessments are claims.
2. **Claim levels on every statement:** `DESIGN`, `SIMULATED`, `LIVE_RUN`, `MEASURED`, `SPECULATION`. `LIVE_RUN` and `MEASURED` require evidence file paths (enforced by `ledger.mjs`).
3. **No fake parallelism, no fake independence, no fake Elephants.** If something is sequential, role-played or shared-filesystem, the report says so in the first screen.
4. **Selection is per track, per component, with a margin.** Close results carry both variants forward; nothing is discarded on noise.
5. **Learnings need evidence and a refutation condition.**
6. **One round per turn.** The controller stops after closing the round and waits for the human.
7. **Fail closed on secrets, isolation incidents and broken ledger chains.** Freeze the round, record an INCIDENT, ask the human.
8. **Smallest slice that proves the point.** A round that adds machinery without a measured reason is a failed round.

## 5. What "best of breed" means here

For each `(track, component)`, the winner is the eligible arm with the highest independent score **that beats the runner-up by the margin**. Eligible means: acceptance tests passed (evaluator-run), isolation clean, evidence present. "Breed" is the variant (approach, library, regime, session mode). The selection history is itself an output: a table of which variants won which components and why.

At the end of the roadmap each track main contains, per component, either the selected winner, a `SINGLE_ENTRANT` (flagged untested), or both carried variants with an explicit note. No track main may claim "best of breed" for a component that never faced an alternative.

## 6. Neutral utilities

Code that has no opinion on the tracks' hypotheses (ledger tool, isolation tool, selection tool, schema validators, fixture generators, test harnesses, Cockpit app) lives in `consolidated/`. A utility enters only if: (a) an arm or controller produced it, (b) the evaluator ran its tests, (c) it contains no track-specific policy. Tracks consume it by copy at round start, never by live link.

## 7. Outputs of the whole program

1. `track-a/main` and `track-b/main` (two Git repos or tags) with per-component provenance.
2. `consolidated/` neutral utilities and the Cockpit app.
3. `ledger/` full hash-chained history, verified.
4. `learnings/` two learning books (one per track) plus a cross-track comparison written only after both are frozen.
5. `reports/R0…Rn-closure.md` and `FINAL-COMPARISON.md` with claim levels and uncertainty.
6. A decision recommendation under the pack's pre-registered rules (`outputs/claude/EXPERIMENT.md` §7), or an explicit statement that evidence is insufficient.
