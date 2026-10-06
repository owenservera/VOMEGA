# Agentic Team Launch Status

Launch rows as of 2026-10-05; wording and evidence notes reconciled 2026-10-06.

This file is the compact launch-state surface for fresh local sessions. It is the only place that says what is claimed, running or done.

**Right now: D1 is CLAIMED by Codex / Coordination + Product + Truth.** Source `26ec6dfc6cbe301b6c48ee04c7a0d35a23c52468`; isolated clone `/workspace/scratch/b6f4221be35c/VOMEGA`, branch `work/d1-semantic-twin`. Scope: D1-001..089, synthetic only. Independent bounded implementation and review workers have explicit ownership; no auth/provider/model configuration changes. Next gate: baseline, red-to-green U1 and semantic World contracts.

Detailed topology: [README.md](README.md). Program map and authority ladder: [../META-TRACKER.md](../META-TRACKER.md).

## Objective

Run the semantic MVP twin and live Provider-reality work in parallel.

## Launch state

Lane names are temporary coordination vocabulary. A claimant may use a different decomposition; if so, add rows rather than forcing the work into these.

| Workstream | First task | State | Current handoff / next gate |
| --- | --- | --- | --- |
| DEV | DEV-L1 preflight/dispatch | **completed / handed off** | >=6 bounded ZCode workers verified on `openrouter/auto`; keep integration/status current |
| TRU | TRU-L1 launch review | **completed** | all first-wave artifacts safe as candidates; none frozen |
| SDW | SDW-L1 semantic contract + Worlds | **candidate increment complete** | Lock A candidate; next materialize W1–W6 and close validator/default/source prerequisites |
| LNC | LNC-L1 compiler/UseCommand nucleus | **candidate increment complete** | Lock B candidate; CMD-06 false-READY is immediate choke point |
| VFX | VFX-L1 VisualSpec/sandbox scaffold | **candidate increment complete** | Lock C candidate; decide extend-vs-replace and implement pure projector |
| SKW | SKW-L1 Reflection audit | **candidate increment complete** | Lock D candidate; source digest/contentHash path and Migrator implementation next |
| EXP | EXP-L1 scenario runner/diff | **baseline candidate complete** | add required-field metadata, multi-revision scenarios and executable Lab runner |
| PRV | PRV-L1 transport/account assay | **recon complete** | no live observation until TRU-05 + consent/evidence boundary |
| RTE | RTE-L1 runtime assays | **ready / queued** | authority/execution-envelope work can proceed without waiting for live provider send |

The first fan-out is therefore **complete**. These rows describe the current state; historical claim/dispatch details remain below and in the handoff files.

### Evidence precision

"Complete" above means a bounded worker wrote a design artifact. Read the rows with these limits:

- Every first-wave artifact is a design document. No worker wrote executable code, changed product code or committed.
- Lock D lists 24 manifest paths but deep-read only three manifests (`vivim-nlcl`, `vivim-providers`, `vivim-mind`); the other 21 rows are marked "not read". The two load-bearing facts (empty `contentHash` in all 24, `prompt.send` absent) were checked independently by TRU-L1 and re-checked on 2026-10-06.
- EXP-L1 defined a scenario-runner shape. No runner exists, so nothing can yet replay or diff the corpus beyond the existing `bun test plugins/vivim-nlcl`.
- LNC-L1 reported that it could not find the release corpus. It exists at `omega-baseline/plugins/vivim-nlcl/test/fixtures/release-use-corpus.json`.
- Two handoffs expand lane abbreviations differently from this overlay (for example "SDW (Shadow Observation)", "SKW (skill/wiki)"). Follow the artifact content, not the abbreviation.
- Locks A–D are candidates and Lock E is reconnaissance. None is frozen, and a Lock is a temporary interoperability agreement, not architecture.

## Runtime pool status

Runtime capacity is discovered, not assumed.

Routing facts, as measured by DEV-L1 (table below):

- ZCode routes through **OpenRouter Auto** (`openrouter/auto`). The concrete underlying model is not exposed, so every first-wave result is attributed to "router-selected / unknown".
- The five previously configured Space Bunny provider accounts are historical configuration evidence. They were never individually probed and are not a scheduling topology.
- Grok Build's binary runs; it was not configured or benchmarked on the Windows machine.
- These are point-in-time observations. Re-measure before a new launch instead of reusing the number 6.

Habitats: Daintree and ZCode are separate. Daintree does not launch, supervise or manage ZCode. Linux-box observations of Daintree and the direct CLIs are in `../dev-machine/HARNESS-MATRIX.md`; they are not launch state.

### Runtime observations

DEV-L1 preflight executed 2026-10-05 from source HEAD `dffbbe9` (read-only infra; no provider/model/auth change). Evidence: `.local/dev-l1-preflight-2026-10-05.json`.

| Harness / route | Current state | Preflight result |
| --- | --- | --- |
| ZCode + `openrouter/auto` | confirmed current route (ListModels `[current]`; cli `model_usage` provider=openrouter, model=openrouter/auto, mode=yolo) | reachable; **>=6 concurrent independent workers measured** on the route; concrete resolved model not exposed -> router-selected/unknown |
| Codex | installed | `codex-cli 0.160.0`, reachable |
| Claude Code | installed | `2.1.289 (Claude Code)` at `~/.local/bin/claude.exe`, reachable |
| Grok Build | installed | `grok 1.0.46` at `~/.grok/bin/grok.exe`, binary reachable; not set up or configured |
| deterministic local tools | known substrate | Bun 1.4.2, Node v24.11.1 |

Measured concurrency (>=6) already supersedes the historical five-lane assumption. Ceiling not established; no throttle observed at 6 concurrent workers.

## First fan-out (historical, 2026-10-05)

Initial occupancy was **capacity-driven**, not account-driven.

DEV-L1 measured >=6 concurrent ZCode workers on `openrouter/auto`, so the full natural first five (SDW/LNC/VFX/SKW/EXP) plus PRV-L1 reconnaissance is supportable in parallel; TRU-L1 independent review takes the first freed slot (or a separate harness) rather than exceeding measured capacity. These are logical task slots on one router, not six provider accounts or six distinct underlying models.

Codex remains a strong DEV/integration + PRV candidate, Claude Code a strong independent TRU candidate, and Grok Build an additional candidate once verified.

This is not permanent assignment, and no provider-account count is itself proof of usable concurrency.

## Fan-in condition

The first integration review was to begin when:

- Lock A candidate exists — met;
- Lock B candidate exists — met;
- Lock C candidate exists — met;
- Lock D candidate exists — met;
- EXP can replay/diff the current corpus — **not met**: only the runner shape is defined.

TRU-L1 reviewed the candidates individually. The integrated review (do the IDs line up across A–D, can one fixture flow compile end to end) has not happened and cannot until something executable exists.

Do not wait for live Provider proof to run this fan-in.

## Integrated scenario target

```
Ask Claude Work using Model B: explain this error
```

plus the ambiguous version:

```
Ask Claude: explain this error
```

The target output is a deterministic semantic/visual/Wiki trace ending at **SIMULATED prompt.send**.

## Live parallel target

PRV independently works toward a falsifiable Account-evidence contract without submitting a prompt during initial reconnaissance.

## Claiming

On claim, update this table and Commons with:

- owner/session/tool;
- source HEAD;
- worktree/path if applicable;
- status;
- expected handoff.

On completion, record:

- commit/artifact;
- tests;
- reviewer;
- proof level;
- downstream trigger.

No completed agent is implied to remain running after its task ends.

## First-wave results — 2026-10-05

DEV-L1 claimed and executed 2026-10-05 (ZCode `sess_673eb8fa`, source HEAD `dffbbe9`).

- Preflight: route `openrouter/auto`; measured **>=6 concurrent** workers; Codex/Claude Code/Grok Build reachable. No config changed.
- Dispatched 6 bounded first-wave workers; all produced candidate artifact + handoff: Locks A/B/C/D candidates, EXP baseline, Lock E recon.
- Independent **TRU-L1** review completed: all artifacts safe as candidates, **none safe to freeze**; headline blocker is the known false-READY validator defect (corpus U1 / CMD-06) under Lock A's own falsifiers; `prompt.send` verified absent from manifests+src; `contentHash` empty in all 24 manifests.
- Harness note: unbounded heavy background subagents stalled; bounded (<=8 tool-call) workers all completed on the same route.

Artifacts: `.project/agentic-launch/handoffs/*.md`, `omega-baseline/experimental/*/`. Next: fix/pin CMD-06 validator, materialize world fixtures, resolve default precedence, add multi-revision corpus; PRV stays recon-only until TRU-05.
