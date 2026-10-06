# Elephant Context Network — Architecture Plan

Drafted 2026-10-05 by a Claude Code architecture session. Source:
`seed-docs/ELEPHANT-CONTEXT-NETWORK.md` (the "seed" below; `§n` refers to its sections).

**Status: plan for an optional experiment. Nothing here is built, activated or
reserved.** No elephant has been instantiated, no provider lane has been probed
or assigned, and no code was written. The seed leaves topology, protocol,
refresh method, representation, model, node count, service catalog and substrate
to experiment; this plan keeps them as variables and fixes only what is needed
to run the first comparison honestly. Every schema and name below is a
candidate v0 and may be replaced.

## 1. The plan in brief

An elephant is a long-context session that holds a maintained model of one
project domain and answers worker requests (questions, patch reviews, impact
analysis) from that model. The hypothesis is that this beats a fresh worker
that has to rebuild the same understanding each time.

The architecture rests on five commitments:

1. **The durable asset is a manifest, not a chat.** A node is defined by a
   committed domain manifest and a deterministic pack built from Git at a known
   commit. Any session can be discarded and rebuilt from those two things. This
   is what makes the hypothesis survivable if long-lived sessions turn out to be
   unreliable (§25 falsifier 6).
2. **Staleness is computed outside the model.** A small deterministic wrapper
   stamps every response with the node's basis and the in-domain changes it has
   not incorporated, using `git diff`. The model is never the source of its own
   freshness claim (§6).
3. **Elephants advise and never mutate.** Sessions run read-only. Output is
   always a proposal with an attached check; tests and evidence adjudicate (§2, §11).
4. **Files and a wrapper script first; no service.** Phase 1 needs a pack
   builder, a manifest, one resumable session and a place to log transactions.
   A router, queue or messaging layer is built only if measurements demand it (§27).
5. **Every phase has an entry gate and a kill criterion.** The work stops, narrows
   or retires as soon as a §25 falsifier fires.

The first gate is not technical: the project has decided to test this only when
reconstruction or context-poor review is a *measured* bottleneck (SITREP,
`seed-docs/AGENTS.md`). Phase 0 is that measurement.

## 2. Grounding facts

Measured in this session on the working tree (bytes of all files, `node_modules`
excluded). Token figures are a rough range of bytes/4 to bytes/3, not tokenizer
counts; Phase 1 must replace them with real counts.

| Corpus | Bytes | Est. tokens |
| --- | --- | --- |
| `omega-baseline/` source, tests, fixtures | 2.65 MB | 0.66–0.88 M |
| `seed-docs/` | 0.29 MB | 72–95 k |
| `.project/` | 0.13 MB | 32–42 k |
| **Whole project** | **3.06 MB** | **0.77–1.02 M** |

Consequences:

- The whole project does not fit a 1M-token window with useful reserve. A single
  whole-repo elephant is at best a saturated configuration, which the seed warns
  against (§14). Partitioning is forced by size, not chosen by taste.
- Any single domain below is 50–230k tokens. A fresh worker on a large-context
  model can load one domain in a single shot. That one-shot load is the baseline
  the elephant must beat, and it isolates *persistence* from mere *capacity*.

Environment state that constrains the plan (`.project/ENVIRONMENT.md`,
`.project/DECISIONS.md`):

- The five Space Bunny lanes are **configured; live reachability unknown**.
  Roadmap task OPS-03 (verify lanes) is open. Claude Code model execution is
  also untested on the Windows machine.
- ZCode headless prompts default to yolo permission mode. An elephant session
  must be launched in an explicit read-only mode.
- Provider and auth configuration is read-only infrastructure.
- Git history is short, so real historical patches are scarce as test material.

## 3. Architecture overview

```
              Git / tests / runtime evidence / .project truth      (canonical)
                                   │
                    ┌──────────────┴───────────────┐
                    │  Epoch ledger (git-derived)  │   deterministic
                    └──────────────┬───────────────┘
                                   │
   Domain manifest ──► Pack builder ──► Resident pack + wave delta   (derived, on disk)
   (committed)          deterministic        │
                                             ▼
                                   ┌──────────────────┐
                                   │   Elephant node  │  long-context session,
                                   │   (read-only)    │  rebuildable, disposable
                                   └────────┬─────────┘
                                            │ forked or bounded per transaction
        Worker ──► Request envelope ──► Wrapper ──► node ──► Response
                                          │                     │
                                          │   basis stamp, citation check, timeout
                                          ▼                     ▼
                               Fallback: fresh worker    Transaction log (.local)
                               or context bundle                │
                                                                ▼
                                                     Scorecard (sanitized, committed)
```

| Component | Job | Kind | First needed |
| --- | --- | --- | --- |
| Domain manifest | Declares what a node holds: path globs, exclusions, boundary overlap, priority hints | Committed data file | Phase 1 |
| Pack builder | Turns manifest + commit into an ordered, hashed text pack | Deterministic script | Phase 1 |
| Epoch ledger | Records each node's base commit, pack hash, incorporated range | Small local JSON | Phase 1 (manual), Phase 3 (automated) |
| Elephant node | Session holding resident + wave context | Model session | Phase 1 |
| Wrapper | Sends a request, stamps basis, checks citations, enforces timeout, logs | Deterministic script | Phase 2 |
| Reconciler | Feeds verified deltas or triggers rebuild | Script + node turn | Phase 3 |
| Evaluation harness | Runs the same task against node and baselines; blind grading sheet | Script + human/Truth grading | Phase 1 |
| Scorecard | Per-service, per-phase metrics and disposition | Committed summary | Phase 1 |
| Router | Chooses node(s) for a request | Starts as a worker reading a table | Phase 5, only if needed |
| Admission control | Queue, priority, dedupe, circuit breaker | Starts as a timeout | Phase 6, only if needed |

All of this is development infrastructure. It lives outside `omega-baseline/`
and must not become a product dependency or a second authority system
(`DEVELOPMENT-ACCELERATION-HYPOTHESES.md`, "Relationship to Ω").

## 4. Components

### 4.1 Domain manifest

One small file per candidate domain, reviewable in a diff. Candidate fields:

```yaml
id: command
description: Semantic command system and interaction
resident:
  include: [omega-baseline/plugins/vivim-nlcl/**, omega-baseline/plugins/vivim-nlcl-pure/**, ...]
  exclude: ["**/node_modules/**", "**/fixtures/**/*.bin"]
  reference_only: []          # large files listed by path and hash, not loaded
boundary:                      # selective overlap at high-risk seams (§4)
  include: [omega-baseline/contracts/**]
truth: [.project/SITREP.md, .project/REALITY.md, seed-docs/INVARIANTS.md]
order: stable-first            # least-changing files first, for prefix-cache stability
reserve_tokens: 300000         # capacity kept free for wave + transactions (§14)
never: [.local/**, .incoming/**, dev-vault/**, "**/*.key", "**/*.pem"]
```

The `never` list is enforced by the pack builder and is not overridable per
domain: vaults, signing keys, credentials, browser state and raw captures never
enter a pack (root `AGENTS.md`).

**Candidate partitions**, from directory names and sizes only. I did not read
plugin internals, so the grouping is a starting guess to be corrected by whoever
runs Phase 1.

| Candidate domain | Contents (by directory) | Bytes | Est. tokens |
| --- | --- | --- | --- |
| core | contracts, genome, host, platform, sdk, shim(s), compositions, vivim-law, law-stub, vivim-kernel-lens | 692 KB | 173–231 k |
| provider | provider-browser, provider-email-file, provider-llm, vivim-providers, vivim-credentials, discovery-* | 599 KB | 150–200 k |
| command | vivim-nlcl, vivim-nlcl-pure, vivim-intent, vivim-chat, vivim-director, vivim-agent, vivim-mind | 627 KB | 157–209 k |
| vault-work | vivim-vault, vivim-run, vivim-steward | 201 KB | 50–67 k |
| surface | surfaces, packs, forge-author | 420 KB | 105–140 k |
| truth-devops | testkit, seed-docs, .project, scripts | 525 KB | 131–175 k |

This is domain-first, the seed's stated preference (§4). Function-first is kept
as a comparison arm in Phase 6, not built up front.

### 4.2 Pack builder and the three context layers

The seed's three layers (§5) map onto three inputs with different lifetimes:

| Layer | Representation | Lifetime | Enters the node by |
| --- | --- | --- | --- |
| Resident | Pack: ordered files at one commit, each with a path + blob-hash header, preceded by a context manifest (file list, hashes, commit) | Until rebuild | Initial load |
| Wave | Delta file: in-domain diffs of verified commits since the pack's commit, plus a short list of active concerns | Until next rebuild | Appended after the pack |
| Transaction | The request envelope and its artifacts | One request | Appended in a fork or bounded turn, then discarded |

The pack is deterministic: same manifest and commit produce the same bytes and
hash. Stable ordering keeps the prefix cacheable on substrates that cache.

**Representation is an experiment variable (§13).** Phase 1 starts with full
source because it is the simplest arm. The builder should allow alternates
without redesign: source plus a generated dependency map, summaries plus exact
hot files, and source plus a notes file (below).

**Domain notes (optional arm).** After contextualization the node can be asked
for the seed's Knowledge Extraction service (§8): a compact, evidence-linked
notes file (invariants, cross-file dependencies, known failure cases, each cited
to path and line at the pack commit). Notes are stored with their commit and
re-injected on rebuild, which is the only way reasoning survives a session
rotation. They are also the likeliest carrier of stale belief, so they are an
arm to test, and every note whose cited lines changed is dropped at rebuild.

### 4.3 Epoch ledger

The epoch is the Git commit of the integration branch. Per node the ledger holds:

```json
{ "node": "command-1", "manifest": "command@3", "pack_commit": "94a3bb0",
  "pack_sha256": "…", "incorporated": ["94a3bb0..c1d2e3f"],
  "loaded_at": "2026-10-05T19:40Z", "substrate": "…", "tokens_resident": 0,
  "tokens_wave": 0, "transactions_since_rotate": 0 }
```

Staleness for a request is then mechanical:

- `unincorporated = git diff --name-only <last incorporated>..HEAD -- <manifest paths>`
- `out_of_domain = request paths not matched by the manifest`
- `base_mismatch = request.epoch is not an ancestor of, or equal to, the node's last incorporated commit`

Uncommitted worker changes are not an epoch. They arrive only as transaction
artifacts.

### 4.4 Elephant node

A node is a session on some large-context substrate, launched read-only with a
fixed charter: answer from resident and wave context, cite path and line for
every factual claim, state what was not checked, never claim proof.

The substrate is unresolved (section 12). The node contract is deliberately thin
so that any of these can implement it: a resumable ZCode session on a Space
Bunny lane, a resumable Claude Code session, or no persistent session at all,
with the pack re-sent as a cached prefix on each call. The seed explicitly
allows the last form (§3).

**Transaction isolation** is the main defence against pollution (§12) and is an
experiment variable with three arms:

| Arm | Mechanism | Trade-off |
| --- | --- | --- |
| Fork | Each request runs in a fork of the resident checkpoint; the fork is discarded | Cleanest; needs substrate fork support and cheap prefix reuse |
| Append and rotate | Requests accumulate; node is rebuilt after N transactions or T transaction tokens | Works anywhere; pollution grows between rotations |
| Stateless prefix | Pack + wave re-sent per request | No session to maintain; cost depends entirely on caching |

### 4.5 Wrapper

The wrapper is the only path between worker and node once Phase 2 begins. It does
five deterministic things and no reasoning:

1. Validates the envelope and applies the `never` filter to attached artifacts.
2. Computes the basis stamp (4.3).
3. Sends the request with a timeout; on timeout or failure returns a fallback
   pointer so the worker proceeds without the elephant (§16).
4. **Checks citations**: each cited `path:line` must exist at HEAD and any quoted
   text must match. Failures are marked on the finding. This is a cheap detector
   for hallucination and stale memory.
5. Logs request, response, tokens and latency to the transaction log.

### 4.6 Reconciler

Triggered by a new verified commit touching a node's manifest paths. It chooses
between appending the delta to wave context and rebuilding the pack. Initial
rule of thumb, to be replaced by Phase 3 data: rebuild when wave tokens exceed a
set fraction of resident tokens, when a changed file is superseded more than
once in wave context, or when rotation is due anyway. Only changes that passed
normal verification are reconciled; unmerged worker attempts never enter
resident or wave context.

### 4.7 Router and admission control (deferred)

Until two nodes exist, routing is a table in the manifest directory that a
worker reads. With two nodes, the first cross-domain approach to try is the
cheapest one in §17: the worker queries each relevant node independently and a
disagreement record is produced when they conflict. Node-to-node consultation
and coordinator assembly are later arms.

Admission control starts as one rule: a request has a deadline, after which the
worker falls back. Queues, priority classes, dedupe, replicas and circuit
breakers (§16) are added only against a measured queue.

## 5. Data flow

**Contextualize.** Manifest + commit → pack builder → pack and context manifest
on disk → node loads pack → ledger entry written → (optional) node emits domain
notes → a short calibration set checks the node can answer known questions
before it is offered to workers.

**Transact (the §10 review loop).**

1. Worker builds an envelope: service, epoch, artifacts, intent, evidence.
2. Wrapper stamps basis and forwards.
3. Node answers against resident + wave context.
4. Wrapper checks citations, logs, returns the response with basis and warnings.
5. Worker revises. Deterministic tests and independent review decide. The
   elephant's response is not evidence for a `done` status.
6. Transaction context is discarded. Promotion into wave context happens only
   through reconciliation of the merged commit.

**Reconcile.** Verified commit lands → ledger marks affected nodes as having
unincorporated changes → reconciler appends delta or rebuilds → ledger updated.
Between those two moments the node is still usable; its responses carry the
warning.

**Disagree (§18).** When two sources conflict (node vs node, node vs fresh
reviewer, node vs worker) the output is a disagreement record routed to the
Truth room: both claims, the disputed dependency, and the falsifier that would
settle it. No averaging and no silent pick.

**Degrade.** Node unavailable, over deadline, or stale beyond a threshold →
worker gets a context bundle or proceeds as a fresh worker. The wrapper records
the fallback so that availability shows up in the scorecard.

## 6. Storage

| What | Where | In Git | Notes |
| --- | --- | --- | --- |
| This plan | `docs/architecture/` | yes | |
| Domain manifests, routing table, node charter | `.project/elephant/` (proposed) | yes | Small, reviewable, no content from packs |
| Scorecards, experiment summaries, dispositions | `.project/evidence/elephant-*.json` (proposed) | yes | Sanitized: counts, rates, costs, task IDs |
| Packs, wave deltas, domain notes | `.local/elephant/<node>/` | no | Rebuildable from manifest + commit |
| Epoch ledger, session handles | `.local/elephant/<node>/ledger.json` | no | Session IDs are machine-local |
| Transaction log, raw responses, grading sheets | `.local/elephant/tx/` | no | Bounded retention; delete after the phase summary is committed |
| Wrapper and builder scripts | `scripts/elephant/` (proposed) | yes | Dev tooling, not under `omega-baseline/` |

`.local/` is already ignored. Nothing in this layout stores credentials,
endpoints or lane configuration. Conversations are not kept indefinitely (§27):
the transaction log is the retained record and it expires.

## 7. Agents and roles

Roles map onto the existing Commons rooms rather than adding new standing agents.

| Role | Who | Responsibility | Must not |
| --- | --- | --- | --- |
| Elephant node | A reserved long-context session | Consult, review, impact, extraction, onboarding | Edit, commit, run tools with side effects, be cited as proof |
| Worker | Codex, Claude Code, ZCode lanes | Implement, submit envelopes, verify claims it acts on | Block past the deadline; treat a response as authority |
| Keeper | A bounded task under Research (later OPS) | Manifests, pack builds, reconcile, rotation, ledger | Become a permanent role before the hypothesis earns it |
| Evaluator | Truth room, independent of the worker | Task set, blind grading, scorecard, falsifier calls | Grade its own submissions |
| Gate owner | Coordination | Phase entry and exit decisions, lane reservation requests | Reserve lanes without OPS-03 evidence |
| Owner | Human | Data-handling decision for the substrate; lane allocation if contested | — |

Independent review of code changes (root `AGENTS.md`) is unchanged. An elephant
review is an additional input and does not satisfy that requirement by itself.

## 8. Interfaces

### 8.1 Node operations

| Operation | Input | Output | Maps to seed service |
| --- | --- | --- | --- |
| `load` | manifest, commit | ledger entry, token counts | — |
| `status` | node | basis, unincorporated paths, occupancy, age | Epoch validity §6 |
| `ask` | envelope | response | Consult, Review, Repair, Impact, Design Validation, Trace, Debugging, History, Onboarding |
| `extract` | node, scope | domain notes or a context bundle | Knowledge Extraction, §19 |
| `reconcile` | node, commit range | updated ledger | Reconciliation |
| `rotate` / `retire` | node | fresh node / removed ledger entry | §12, §15 |

Cross-Elephant Consultation is deliberately not an operation yet. It is `ask`
issued twice by the worker until Phase 5 shows that is insufficient.

### 8.2 Request envelope (candidate v0)

The seed asks for low transaction cost (§9). The envelope is one file a worker
can write by hand; only `service`, `epoch` and one of `question` or `artifacts`
are required. File paths, task IDs and test counts in the examples below are
illustrative, not references to real files or results.

```yaml
service: review                 # consult | review | repair | impact | design | trace | debug | history | onboard
domain: command                 # optional; omitted means "route me"
epoch: 94a3bb0                  # commit the worker's change is based on
objective: CMD-02               # task ID or one line
form: mixed                     # reference | patch | full | mixed
artifacts:
  - {kind: patch, path: change.diff}
  - {kind: full,  path: omega-baseline/plugins/vivim-nlcl/src/resolve.ts}
  - {kind: reference, path: omega-baseline/contracts/command.ts}
intent: "Resolve ambiguous verbs deterministically before provider lookup."
assumptions: ["contracts/command.ts unchanged"]
evidence: ["bun test plugins/vivim-nlcl: 41 pass, 0 fail"]
output: findings                # findings | answer | briefing | candidate-artifact
deadline_s: 300
```

### 8.3 Response (candidate v0)

```yaml
basis:                          # written by the wrapper, not the model
  node: command-1
  manifest: command@3
  pack_commit: 94a3bb0
  incorporated: 94a3bb0..c1d2e3f
  unincorporated_in_domain: [omega-baseline/plugins/vivim-intent/src/slots.ts]
  out_of_domain: [omega-baseline/contracts/command.ts]
  base_mismatch: false
status: advisory-unverified     # constant; a response is never proof
self_reported_basis: 94a3bb0    # what the model believes; mismatch is itself a logged defect
findings:
  - kind: missed-dependency     # contradiction | missed-dependency | invariant | test-gap | suggestion
    claim: "slots.ts reads the pre-resolution verb; this change reorders it."
    cites: ["omega-baseline/plugins/vivim-intent/src/slots.ts:88"]
    citation_check: pass        # written by the wrapper
    confidence: medium
    check: "bun test plugins/vivim-intent -t 'slot fill order'"
not_examined: ["runtime behaviour under provider timeout"]
suggest_consult: [core]         # boundary hint, not an automatic fan-out
cost: {tokens_in: 0, tokens_out: 0, latency_s: 0}
```

Two rules give the format its value. Every finding carries a `check`, which
turns advice into something a test or reviewer can settle. And the freshness
fields come from Git, so a persuasive stale answer still arrives labelled.

### 8.4 Command surface (proposed, not implemented)

`elephant pack <domain> [--commit]`, `elephant status [node]`,
`elephant ask <envelope>`, `elephant reconcile <node> [range]`,
`elephant rotate <node>`, `elephant score <phase>`. A thin script over the
substrate's own resume or prompt command, invoked through `scripts/omega.ps1`
conventions on the Windows machine.

## 9. Measurement design

The hypothesis is only as good as its comparison. Each evaluated task runs
against the node and these baselines, on the same model where possible:

| Arm | What it isolates |
| --- | --- |
| A. Fresh worker with repo tools (ordinary retrieval) | The default the elephant must beat (§25 falsifier 1) |
| B. Fresh worker with a compact context bundle | Bundles vs residency (falsifier 8) |
| C. Fresh session given the same pack one-shot | Capacity vs persistence |
| D. Elephant node | The hypothesis |
| E. Static analysis / tests alone | What needs no model at all |

**Task set.** Because Git history is short, the set mixes real in-flight patches
with seeded defects: take a correct change in the domain and inject a known
cross-file or invariant violation, so recall is measurable against ground truth.
Add consult questions with answers verifiable in source, and onboarding tasks
scored by time to first correct edit. Fix the set before running any arm.

**Grading.** The Truth room grades blind to arm. A finding counts only if it
survives verification against source or a test.

**Metrics** (from §23, reduced to what Phase 1–2 can actually collect):

- validated findings per review; recall on seeded defects; false-positive rate
- tokens and wall time to a correct answer or first correct edit
- stale-answer incidents (response contradicted by HEAD) and whether the stamp
  warned
- citation-check failure rate
- maintenance cost: load, reconcile and rotate tokens and time
- fallback rate and latency

**Break-even.** The node earns its keep in an epoch only if

`transactions × (cost_fresh − cost_transaction) > cost_load + cost_reconcile`

with cost in tokens or time, and with quality at least equal. Report the
break-even transaction count per domain; it decides whether low-traffic domains
should have nodes at all. On free lanes the cost is latency and rate limits
rather than money, and those are what get measured.

**Dispositions.** Each service ends each phase with one of the §23 labels:
default, high-risk only, domain-specific, redundant, too expensive, harmful.

## 10. Build phases

Sizes use the roadmap convention (S ≤ 1 day, M 2–4 days). The order follows the
seed's ladder (§24) with context pressure moved ahead of the two-node test,
because its result decides whether and where to split.

| Phase | Seed exp. | Goal | Build | Size | Exit / continue if | Stop if (falsifier) |
| --- | --- | --- | --- | --- | --- | --- |
| 0. Gate | — | Decide whether to test at all | Nothing. Record reconstruction cost in normal handoffs for a few sessions: tokens and time before first useful edit, review misses caught late. Complete OPS-03 for at least one large-context lane. Owner answers Q1 | S | Reconstruction or review misses are a visible share of session cost, and one substrate is verified live | No measurable bottleneck → shelve, revisit at next Release Gym cycle |
| 1. One elephant | A | Does a resident node beat arms A–C on consult and onboarding? | One manifest, pack builder, manual session, hand-kept ledger, fixed task set, grading sheet | M | Node beats arm A and is not worse than arm C on quality at tolerable cost | Arm A or C matches it at lower cost (1, 8) |
| 2. Review loop | B | Does contextualized review find more real defects? | Envelope v0, wrapper with basis stamp and citation check, transaction log | M | Higher validated-finding recall than arm A at an acceptable false-positive rate | False positives cost more worker time than findings save (10) |
| 3. Epoch refresh | C | Is staleness visible, and what does refresh cost? | Automated ledger, reconciler, compare delta-append / rebuild / fork arms | M | Stamp flags every stale case in the test; refresh cost is well under the savings measured in 1–2 | Stale answers escape the stamp, or refresh eats the savings (2, 3) |
| 4. Context pressure | F | Find the useful occupancy range | No new parts. Grow resident and transaction load; rerun the fixed set; test isolation arms | S | A reserve figure and a rotation rule backed by data | Quality degrades at occupancy the domain needs (4) |
| 5. Two elephants | D | Do boundaries hide consequences? | Second manifest, boundary overlap, routing table, disagreement record | M | Cross-boundary seeded defects are caught by at least one node or by the overlap | Boundary defects are missed, or coordination dominates latency (5, 9) |
| 6. Wave and ranking | E, G | Whole-cycle cost vs benefit; rank services | Run a real wave: several workers on one epoch, reconcile, refresh. Optionally one function-first node as comparison | M | Net validated throughput gain over the same wave without nodes | Orchestration overhead exceeds the gain (10) |
| 7. Operate | — | Keep only what earned a disposition | Router, queue, replicas, bundle generation — each only against a measured need | open | Reviewed at each Release Gym cycle | Any accelerator that stops paying is removed |

Standing constraints across all phases:

- Phases 1–2 use one lane and one keeper task. No lane is reserved beyond the
  phase that needs it, and the five lanes are never mapped one-to-one to nodes
  by default (§22).
- Elephant work yields to first-release work. If it competes for the same
  executor time as PRV or CMD tasks on the critical path, it waits (§27).
- A phase that ends without a committed scorecard summary did not happen.

**Suggested first domain: `command`.** It is mid-sized, coherent by name, and
it is where work is currently moving (uncommitted NLCL test corpus in the
working tree), which supplies real patches for Phase 2 and real epoch movement
for Phase 3. `provider` is the alternative if browser-transport work becomes the
bottleneck first. This is a recommendation for the Phase 1 claimant, not a
topology decision.

## 11. Risks

| Risk | Why it matters | Mitigation in this design | Signal to watch |
| --- | --- | --- | --- |
| Persuasive stale answers | The seed's central danger (§6) | Git-computed basis stamp; reconcile on verified commits; self-reported basis compared to actual | Stale incidents not flagged by the stamp |
| Over-trust by workers | Advice becomes de facto authority (falsifier 7) | `advisory-unverified` constant; every finding has a check; elephant output barred as `done` evidence | Findings acted on without the check being run |
| Context pollution | Abandoned approaches stay salient (§12) | Transaction isolation; only verified commits enter wave context; rotation rule from Phase 4 | Quality drift on the fixed set as transactions accumulate |
| Session fragility | Long sessions may not survive restarts, limits or provider changes (falsifier 6) | Node is rebuildable from manifest + commit; stateless-prefix arm needs no session | Rebuild frequency; load failures |
| Substrate unknowns | Lane liveness, rate limits, caching and fork support are all unverified | Phase 0 lane proof; thin node contract with three implementations | Phase 0 cannot verify any large-context lane |
| Data exposure | Packs send large parts of the repo to a third-party free lane | Hard `never` list in the builder; owner decision Q1 before first load; domain notes and logs stay local | Any pack containing an excluded path (builder must fail closed) |
| Unintended mutation | Headless default is yolo on ZCode | Explicit read-only launch; verify with `git status` after each session in Phases 1–2 | Any working-tree change after a node session |
| Unfair comparison | Wrong conclusion in either direction | Arm C separates capacity from persistence; fixed task set; blind grading | Arms run on different models without noting it |
| Thin ground truth | Short history limits real patches | Seeded defects with known answers; label real vs seeded in results | Results driven only by synthetic tasks |
| Boundary blindness | Partitioning hides cross-cutting effects (falsifier 9) | `out_of_domain` flag; selective overlap; Phase 5 cross-boundary seeds | Defects living in files no node holds |
| Bottleneck and congestion | Workers queue behind one node (§16) | Deadline with fallback from the first request; queueing built only on evidence | Fallback rate, wait time |
| Orchestration creep | Building a platform before one node proves value (§27) | Scripts and files through Phase 4; router and queue deferred to Phase 7 | Tooling effort exceeding experiment effort |
| Delay to first release | Explicit anti-pattern (§27) | Phase 0 gate; elephant work yields to critical path; small phase sizes | Critical-path tasks waiting on elephant tasks |

## 12. Open questions

For the owner or Coordination:

1. **Data handling.** Is it acceptable to send full domain source to the Space
   Bunny Free lanes (or whichever substrate is chosen), given the exclusions in
   4.1? This blocks the first load.
2. **Gate threshold.** What level of measured reconstruction or review cost
   justifies Phase 1? The plan proposes "a visible share of session cost" and
   leaves the number to Coordination after Phase 0 data exists.
3. **Lane allocation.** Which single lane may be held for Phases 1–2, and for
   how long, without starving PRV and CMD work?

For Phase 0–1 to verify on the machine:

4. Which lanes are live, and what are their rate limits and real context limits?
5. Does the substrate support session resume, session fork, and prompt caching?
   The isolation arm and the cost model both depend on the answers.
6. Can ZCode and Claude Code sessions be launched read-only from a script, and
   is that mode reliable?
7. Real tokenizer counts per candidate domain, replacing the estimates in section 2.

For the experiments to answer:

8. Does persistence beat a one-shot pack (arm C)? If not, the useful artifact is
   the pack builder and manifests, and nodes can be dropped.
9. Do domain notes improve answers after rebuild, or mostly carry stale belief?
10. Delta-append, rebuild or fork: which refresh strategy is cheapest at equal
    quality, and at what wave size does it flip?
11. What occupancy and reserve give the best quality, per substrate?
12. Is the candidate partition in 4.1 right? In particular, where do
    `vivim-agent`, `vivim-mind`, `vivim-director` and `compositions` belong, and
    which boundary files deserve overlap?
13. Does model diversity across nodes improve disagreement value or just add noise?
14. Which services earn a default disposition, and which duplicate ordinary
    retrieval?
15. Should a node generate context bundles for fresh workers (§19), and is a
    bundle an adequate fallback when the node is stale?
16. Should Development Reality Layer signals (§20) feed wave context? Out of
    scope until that layer exists; the promotion filter would be the reconciler.

## 13. Seed coverage

| Seed section | Addressed in |
| --- | --- |
| §2 truth outside the elephant | 1 (commitments 2–3), 8.3 `status`, 7 |
| §3–4 topology, domain vs function | 2, 4.1, Phase 6 comparison arm |
| §5 three context layers | 4.2 |
| §6 epoch awareness | 4.3, 4.5, 8.3 `basis` |
| §7 waves | 4.6, 5 Reconcile, Phase 6 |
| §8 service model | 8.1, 9 dispositions |
| §9 submission protocol | 8.2 |
| §10 review loop | 5 Transact, Phase 2 |
| §11 elephants are not workers | 1, 4.4, 7 |
| §12 pollution and forgetting | 4.4 isolation arms, 4.6, Phase 4 |
| §13–14 residency and sizing | 2, 4.2 arms, Phase 4 |
| §15 dynamic topology | 4.1 manifests are data, Phase 5, Phase 7 |
| §16 admission control | 4.5 timeout, 4.7, 5 Degrade |
| §17 cross-elephant reasoning | 4.7, Phase 5 |
| §18 disagreement | 5 Disagree |
| §19–21 bundles, reality layer, harvest | 5 Degrade, 8.1 `extract`, Q15–16 |
| §22 heterogeneous pool | 2, 4.4, 7, standing constraints |
| §23–24 ranking and ladder | 9, 10 |
| §25 falsifiers | 10 stop conditions, 11 |
| §27 anti-patterns | 1, 10 standing constraints, 11 |

Harvest memory (§21) has no dedicated mechanism here: it would be a notes file
in a `truth-devops` node, subject to the same rule that remembered external
facts are not current evidence.

## 14. Next actions

1. **Truth** reviews this plan, in particular the comparison arms in section 9
   and the stop conditions in section 10.
2. **Coordination** decides whether to open Phase 0, and puts Q1–Q3 to the owner.
3. If Phase 0 opens: record reconstruction cost in the next few session
   handoffs, and complete OPS-03 for one large-context lane.
4. Nothing else is to be built until Phase 0 exits.
