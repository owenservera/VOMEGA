# Ω Proof Ratchet — design

Status: **seed implementation, development-system acceleration experiment** (Meta Tracker MP-41, MP-46, MP-54, MP-67; accelerator hypotheses DA-02, DA-13, DA-15, DA-23). It is a coordination tool under layer 5–6 of the authority ladder. It is not Ω architecture, it is not a scheduler, and it must earn its keep under the acceleration rule in `seed-docs/DEVELOPMENT-ACCELERATION-HYPOTHESES.md`.

Date: 2026-10-06 · Source HEAD at design: `bddb8cb`. **Hardened 2026-10-06** on `work/d1-ratchet-integration` per `.project/RATCHET-ROUND1-INTEGRATION-DIRECTIVE.md` §6: pre-promotion spec anchoring (§3.1, C1), honest reviewer-identity limits (§3.7, C2), an explicit authority boundary (§6.1, C3), and separated readings of "green" (§3.8, C4).

## 1. The problem it answers

The question asked was: which single deliverable would most help automate the build of VOMEGA?

Reading the whole corpus gives a consistent picture:

| Observation | Evidence |
| --- | --- |
| Coordination cost dominates. | 49 of the last 51 commits are `docs:` reconciliations. A full meta-coherence pass (`META-REVIEW-2026-10-06.md`) was needed to restore consistent status labels. |
| "Done" is self-reported prose. | D1 has 77 atomic tasks whose acceptance criteria are sentences. `TASKS.md` lists 74 roadmap tasks as `open` with partial evidence noted by hand. |
| Status surfaces disagree. | At HEAD, `STATUS.md` said D1 was CLAIMED by Codex while `SITREP.md` said no executor was running and `COMMONS.md` said paused. |
| Agents cannot verify themselves. | The first fan-out produced six design documents and no executable artifact. The meta-review's top observation: "long on design and short on executable evidence". |
| The project already had the right primitive. | The release-use corpus runs known gaps as `test.failing`: green while the gap is open, red the moment it closes, forcing promotion. |

The constraint on automation is therefore not worker capacity (six concurrent ZCode workers were measured). It is that no worker — human or model — can find out mechanically what the next task is, whether it finished it, or whether it broke someone else's work. Every answer is reconstructed by reading prose.

So the deliverable is the thing that makes D1's definition of done executable and makes project status a projection of tests, before D1 itself is built: **the ratchet engine plus the D1 specification written as gates.**

This deliberately does not follow the D1 build order. D1's own plan writes its tests task by task and its evidence summary last (D1-083..089). Putting the complete gate suite first turns the remaining 62 tasks into "make these named tests pass without breaking promoted ones", which any capable worker can do and any reviewer can check.

## 2. What it is, in one picture

```
D1-ATOMIC-TASKS.md ──parse──▶ task graph (deps, critical path)
                                   │
experimental/d1/test/gates/*  ─────┤  gate("D1-xxx", name, body)
   (the executable D1 spec)        │
                                   ▼
             probe (raw truth) ──▶ computed task state ◀── lock (promotions, reviews)
                                   │                  ◀── claims (leases)
                                   │                  ◀── artifacts (meta tasks)
                 ┌─────────────────┼──────────────────┬────────────────┐
                 ▼                 ▼                  ▼                ▼
          next / packet        fanout             board.md        evidence.json
       (one worker brief)  (disjoint parallel)  (generated)       (generated)

facts.json ──▶ drift (doc claims as probes)        check = CI gate over all of it
```

## 3. Core mechanisms

### 3.1 Gates and the ratchet

`gate(task, name, body)` wraps `bun:test`:

- An open gate runs as `test.failing`. A red body keeps the suite green, so unfinished work never breaks CI. A green body turns the suite red with "did not throw", which means: promote me.
- A promoted gate runs as `test`. It must pass forever; red is a regression.
- In probe mode (`RATCHET_MODE=probe`, set by the CLI) every gate runs as a plain test, so the JUnit report is raw truth.

Promotion is an explicit act (`ratchet promote`) that re-probes first and refuses red gates. The lock records who promoted, at which HEAD, and the digest of the gate file. If a promoted gate's file later changes, `check` reports `SPEC_CHANGED`. If a promoted gate disappears, it reports `GATE_VANISHED`. A worker cannot get to green by quietly deleting or weakening a test — the Lab falsifier "self-evolution can delete a regression that blocks promotion", made mechanical.

**Pre-promotion anchoring (C1).** Protection by promotion alone leaves an open gate unguarded: a worker could weaken it before it is ever promoted and then promote the weakened form. So `ratchet anchor --by <label>` runs once, at initialization, and records the digest of **every** gate file in `lock.anchors`. After that, any anchored file whose on-disk digest differs from its authorized digest is drift — whether or not any gate in it was promoted. `check` fails with `SPEC_CHANGED_ANCHOR`, and `promote` refuses gates in that file. The only way to change an anchored file is `ratchet spec-change --file F --by <label> --reason <text>`, which records the from/to digests and the reason as permanent lineage and re-authorizes the new content (or records an intentional deletion with `--deleted`). A gate file deleted without that record is `SPEC_FILE_VANISHED`, never a completion. Mutation is explicit and lineage-bearing; architecture is not frozen.

### 3.2 Computed state

| State | Rule |
| --- | --- |
| REGRESSED | A promoted gate is red or missing in the latest probe. |
| DONE | Every gate promoted and green, every artifact present, and the latest review is an accept by someone who neither promoted nor claimed the task. |
| PROVEN | As DONE, awaiting independent review. |
| BLOCKED | Some dependency is not PROVEN, DONE or SUPERSEDED. Artifact-only tasks are also BLOCKED until their dependencies are satisfied. |
| CLAIMED | Dependencies satisfied; an unexpired lease exists. |
| OPEN | Dependencies satisfied; unclaimed. This is the frontier. |
| SUPERSEDED | Recorded in the lock with a reason. |

`PROVEN` and `REGRESSED` extend D1's vocabulary because "green but unreviewed" and "was green, now red" are exactly the states prose status could not represent. A dependency counts as satisfied at PROVEN so that review lag does not stall the critical path; DONE still requires independence.

The independence rule from `AGENTS.md` ("code changes need a reviewer who did not write them") is enforced by the tool. `review` refuses a reviewer who promoted or claimed the task, and state computation ignores such an accept even if it is written into the lock by hand.

### 3.3 Claims are leases

A claim expires on its own (default 4h). No document can keep a dead claim alive, which is the failure `STATUS.md` exhibited. History is kept so that independence can be checked against implementers.

### 3.4 Packets and fan-out

`next` and `packet <TASK>` produce the brief a fresh worker needs: acceptance text, failing gate names and current failure messages, write surface, files to read (paths only), the verify and promote commands, stop conditions and protected distinctions. This is accelerator DA-02 (automatic context bundles), derived from repository state instead of a coordinator's summary.

`fanout --n N` chooses up to N frontier tasks with pairwise-disjoint write surfaces, ranked by critical-path length and then by how many tasks each unblocks. Write surfaces are declared per task in `specs/d1/spec.json`; an unspecified surface conflicts with everything. The D1 port is split into one module per phase precisely so that phases can be built in parallel.

### 3.5 Projections

`D1-BOARD.md` and `.project/evidence/d1-ratchet.json` are regenerated by `ratchet sync`. Neither is edited by hand. The evidence summary carries the SIMULATED banner, the probe digest, baseline counts, per-task state, and two keys that exist only when true: `semanticGate` (every gate green) and `baselineGreen` (both baseline commands exit 0). D1-083 and D1-084 are proven by those keys.

The local run ledger (`.local/ratchet/ledger.jsonl`) is append-only and hash-chained. Raw observations stay on the machine; sanitized summaries are committed, as `AGENTS.md` requires.

### 3.6 Drift

`specs/facts.json` turns claims made in project documents into probes: manifest counts, empty `contentHash`, absence of `prompt.send`, corpus pass/gap counts, and mutual consistency between STATUS and SITREP. When code changes a fact, `drift` names the documents that are now wrong. The first run found the STATUS/SITREP contradiction; this patch corrects that line in `STATUS.md`.

### 3.7 Reviewer identity is a coordination claim, not proof of independence (C2)

`--by codex-1`, `--by claude-review` and similar are **auditable coordination labels**. The engine enforces *label* separation: a reviewer whose label matches any promoter or claimant of a task is refused, and state computation ignores such an accept even if written by hand. That is the whole guarantee. It is not cryptographic proof, and it is not proof that two labels are two distinct underlying actors (the same person or process can hold two labels). The evidence summary states this limitation in every record; do not read `DONE` as "independently established by two real parties" without a separate, out-of-band identity check.

### 3.8 Reading "green" (C4)

Four different states all look like success and must never be collapsed:

| Reading | Meaning | How to see it |
| --- | --- | --- |
| **ratchet-mode green** | open gates run as expected failures; promoted gates have not regressed. Means "open gaps represented honestly", **not** "the deliverable works". | `bun run d1:gates` (prints a notice; board and evidence say so) |
| **probe truth** | which gates actually pass right now | `bun run ratchet probe` / `status` |
| **semantic completion** | every gate green in probe, no silent files | evidence `interpretation.semanticCompletion` |
| **reviewed completion** | the committed completion record exists | evidence `interpretation.reviewedCompletion`, `lock.completion` |

The gate factory warns once per process in ratchet mode, and the generated board, status output and evidence summary each carry the distinction. No projection may report "80 gates passed" when most are open expected failures.

## 4. The D1 executable specification

`omega-baseline/experimental/d1/` holds:

- **`src/contract.ts` — D1 Port v0.** An interface hypothesis (a Lock, in the project's own terms), not architecture. Its central choice is a pure reducer, `state × Action → state`. Typed and clicked corrections become the same `edit` action, the UI has no other path into state, consent is its own action that no interpretation can produce, and replay is a fold over the action log. The gates test observable behavior through this port; the port may change, with the gates, under `SPEC_CHANGED` re-review.
- **Implemented in the seed (domain-neutral, load-bearing for every gate):** canonical digests; the World loader with synthetic-provenance enforcement and identity separation; the session reducer (revision identity, binding to revision and World, stale-result suppression, explicit edits); and the live-evidence predicate.
- **Stubs:** validator, compiler, projector, renderer, Reflection extractor, help, virtual executor, replay and metrics. Each throws `NotImplemented[D1-xxx]`, so every red gate names its owner.
- **Inputs:** four source-native declarations (`prompt.send@1`, `account.register@1`, the virtual realization, `account.select@1`), six synthetic Worlds W0–W5, and a 13-scenario metrics corpus.
- **80 gates across 9 files**, covering all 13 release gates of `D1-FIRST-RELEASE-SPEC.md` §13. Meta tasks (D1-001, 002, 083–089) are proven by artifact checks.

Seed state at HEAD `bddb8cb`: 15 of 80 gates green and promoted, by `claude-opus-5.5-seed`. That makes 11 tasks PROVEN (none DONE: no independent review yet), 4 OPEN and 62 BLOCKED. The critical path begins at D1-001, which the tool performs itself (`ratchet baseline`).

## 5. What was harvested, adapted, invented

| Piece | Disposition |
| --- | --- |
| `test.failing` promotion pattern | **Reused** from `plugins/vivim-nlcl/test/release-use-corpus.test.ts`, generalized to every task. |
| `vivim-nlcl-pure` interpreter | **Reused untouched**; Phase C is expected to adapt it rather than replace it. The candidate `prompt.send@1` frame comes from the corpus. |
| Hash-chained local ledger, "law committed, memory local" | **Adapted** from the baseline's D-430/D-431 discipline. |
| Lease-based claims, depth-limited bounded tasks | **Adapted** from patterns in the owner's separate build-control work; no code or format was imported. |
| `dev-machine/select-tasks.py` | **Left in place.** It parses lane rows in STATUS; the ratchet parses the D1 task list. They do not conflict. |
| Computed state, packets, fan-out by write surface, drift facts, artifact proofs | **New.** |

## 6. Truth boundaries

- Every D1 gate is SIMULATED evidence by construction. The spec's `evidenceClass` is the literal `"SIMULATED"`, and the board and evidence banners say so.
- A green gate is a claim about the code at the probed HEAD only.
- The ratchet never mutates auth, provider or model configuration and never calls a provider.
- The tool does not decide product direction. A task can be superseded only with a recorded reason, and changing a gate is visible.

### 6.1 Authority — where the ratchet sits in the ladder (C3)

The ratchet is authoritative for **computed D1 gate/task/proof state, and nothing else**:

```text
source + tests + evidence   →  truth of observed claims
META-TRACKER.md             →  whole-program coverage / authority map
experimental/ratchet        →  computed D1 task / gate / proof projection
STATUS.md                   →  current execution / claim summary
```

It may generate and update the D1 board and evidence projection. It must **not** decide product direction, invariant changes, Lab promotion, live-evidence classification outside explicit rules, provider/auth/model configuration, or irreversible actions. It is a development-system acceleration experiment (Meta Tracker MP-41/46/54/67; accelerator hypotheses DA-02/13/15/23), classified at the coordination layer of `seed-docs/INVARIANTS.md` — not Ω architecture, not a scheduler, not a replacement for `META-TRACKER.md` or for source/tests/evidence, and never an authorization system. It earns its keep under the acceleration rule in `seed-docs/DEVELOPMENT-ACCELERATION-HYPOTHESES.md`, and the falsifiers in §7 retire it if it does not.

## 7. Falsifiers — retire or rework the ratchet if

- workers spend more time satisfying the tool than building D1 (measure: time from claim to promote);
- gates are routinely rewritten to pass (measure: `SPEC_CHANGED` frequency);
- fan-out picks produce merge conflicts anyway (the write surfaces are wrong);
- the board diverges from what reviewers believe (projection is not trusted);
- docs reconciliation commits do not fall after adoption.

## 8. Open questions

1. Should the corpus U1 check switch to the D1 validator, or should `nlcl` itself stop reporting `ok` with unresolved required slots? D1-005 requires the corpus promotion either way; the gate does not choose.
2. Default precedence (`Account.defaultFor` versus World `defaults`) is still unresolved (`META-REVIEW` §5.3). W0–W5 carry no defaults so the canonical journey does not depend on it; a dedicated gate should be added when it is decided.
3. Three validation vocabularies (CMD-06, Lock B, VisualSpec) remain unreconciled. The port uses the roadmap's CMD-06 outcomes plus `needs-consent`.
4. Whether to extend the ratchet to the 74-task roadmap or the Provider-reality path. It is spec-driven (`--spec`), so a second spec costs a JSON file and its gates.
