# Agentic Team Launch Status

Launch rows as of 2026-10-05; wording and evidence notes reconciled 2026-10-06.

This file is the compact launch-state surface for fresh local sessions. It is the only place that says what is claimed, running or done.

**Right now: no D1 executor is running. The PM roadmap-system workstream is claimed by the ZCode PM team (recon wave).** D1 is selected and incomplete; the earlier Codex claim (`work/d1-semantic-twin` at `26ec6df`) stopped before substantive implementation and was consolidated into `main` (see SITREP and COMMONS). D1 task state is now computed, not written here: `cd omega-baseline && bun run ratchet status` (board: `.project/ratchet/D1-BOARD.md`). Claim D1 tasks with `bun run ratchet claim <TASK> --by <label>`. _Corrected 2026-10-06: the drift fact F-ACTIVE-EXECUTOR-CONSISTENT found this line contradicting SITREP._

Ratchet hardening + independent review completed 2026-10-06 on branch `work/d1-ratchet-integration` (not yet merged to `main`): recommendation **ADOPT WITH REMAINING LIMITATIONS**, findings in `.project/ratchet/REVIEW-2026-10-06.md`. Probe truth is 15/80 D1 gates green; a green `d1:gates` run is not D1 completion.

**Orca execution-substrate bootstrap: Gates 1 and 3 PASS; Gate 2 incomplete (GUI-only, blocks agent launch); Gate 4 blocked.** Census and results: [../orca/CENSUS-2026-10-06.md](../orca/CENSUS-2026-10-06.md). Owner decided to amend the pin to **1.4.221** and to leave the already-duplicated Codex credential in place (recorded, not mutated). Gate 1 verified the CLI and desktop share one runtime and the repo base ref is `origin/main` (it was unset). Gate 3 proved Orca worktree mechanics end to end **without launching an agent**, including external Git visibility and clean removal.

**Do not launch agents through Orca yet.** Gate 2's Agent Permissions → Manual has no CLI path, and Orca's shipped defaults are bypass/auto-approve for every agent (`codex: --dangerously-bypass-approvals-and-sandbox`, `claude: --dangerously-skip-permissions`) with no per-call override. Gates 5–9 are blocked on Owen setting that in the GUI. Separately, Gate 4 is blocked: the bundled ZCode CLI ships **no TUI** (`Cannot find package '@zcode/tui'`) despite advertising one in `--help`.

Detailed topology: [README.md](README.md). Program map and authority ladder: [../META-TRACKER.md](../META-TRACKER.md).

## Objective

Advance the smallest evidence-bearing slices of the 67-program meta map. The selected D1 convergence builds the semantic MVP twin including minimal Reflection/Wiki/Migrator; the live Provider-reality path remains an independent parallel evidence stream. Neither is the complete program.

## Program-map relationship

The table below is a dated launch-overlay view, not the VOMEGA workstream list. The canonical whole-program map is `../META-TRACKER.md` (67 major programs + 31 accelerator hypotheses). SDW/LNC/VFX/SKW/EXP/PRV/RTE/DEV/TRU are temporary coordination labels that may be ignored, merged, split, or replaced.

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

## PM roadmap-system claim — 2026-10-06

Claimant: **ZCode PM team** (ZCode session, main worktree, route `openrouter/auto`). Source HEAD at claim: `93075cf` (local == `origin/main`).

Scope: implement and maintain the PM planning layer for the **five owner-selected programs only** (MP-21, MP-54, MP-55, MP-56, MP-60), per the owner-directed correction [PM-CORRECTION-FIRST-FIVE-ONLY.md](../pm/PM-CORRECTION-FIRST-FIVE-ONLY.md). This is development machinery, not Ω product architecture. It does **not** claim any D1 task, roadmap task or provider/auth/model configuration, and it holds **no decisioning authority** over program selection, ranking or scope.

State: v0 shipped (`56fe9c4`, review fixes `b4ed79d`); **owner correction being applied 2026-10-06** — managed scope is declared in `.project/pm/scope.json` and enforced by `pm:check`; v0.1 feature expansion is frozen.

Handoff: team instance in `.project/pm/TEAM-INSTANCE.md`; recon findings in `.project/pm/recon/WAVE-A.md`; proposal + review in `.project/pm/recon/V0-PROPOSAL.md` and `recon/REVIEW-V0.md`. Truth boundary: META-TRACKER remains canonical; every PM state cell is a projection, and no PM document outranks source/tests/evidence.

## ACCEL-W1 execution claims — 2026-10-06

Execution of the owner-selected Wave 1 in [../pm/build-plan.json](../pm/build-plan.json) (view: [../pm/generated/BUILD-PLAN.md](../pm/generated/BUILD-PLAN.md)). One row per claimed wave entry; add a row rather than editing someone else's. Gate status stays in the PM program files and is changed only on evidence.

| Wave entry | Phase range → target gate | Claimant | Source HEAD | Write surface | State |
| --- | --- | --- | --- | --- | --- |
| MP-21 (PRIMARY) | MP21-P1 → MP21-P3 → MP21-G3 | `claude-code-opus-mp21` (Claude Code, Opus 5.5, main worktree) | `10a8beb` (local == `origin/main`) | `omega-baseline/experimental/reflection-migrator/**`; in `omega-baseline/package.json` the `reflect*` script lines and the `typescript` dev dependency (with its `bun.lock` entry) | **claimed — MP21-P1 implemented, awaiting independent review; MP21-G1 still TBD; P2 not started** |
| MP-56 (HIGH) | MP56-P1 → MP56-P4 → MP56-G4 | unclaimed | — | — | open |
| MP-55 | MP55-P1 → MP55-P2 → MP55-G2, then HOLD | unclaimed | — | — | open |
| MP-54 | MP54-P1 → MP54-G1, then HOLD | unclaimed | — | — | open |
| MP-60 | MP60-P1 → MP60-G1, then HOLD | unclaimed | — | — | open |

MP-21 claim notes: read-only over product source (nothing under `plugins/`, `contracts/`, `host/` is edited); no auth, provider or model configuration touched; no D1 or roadmap task claimed. The existing D1 Reflection stub (`experimental/d1/src/reflection.ts`, D1-055..059B) is a separate, declaration-scoped slice and is not modified. Expected handoff: one evidence-bearing increment per gate (G1, G2, G3), each needing a reviewer who did not write it before its gate is marked SATISFIED. The MP-60 P1 claimant should send impact-query requirements before MP21-P3 freezes a graph shape.

**Nothing else is claimed; no other executor is running.**
