# Agentic Team Launch Status

As of 2026-10-05.

This file is the compact launch-state surface for fresh local sessions.

Detailed topology: [README.md](README.md)

## Objective

Run the semantic MVP twin and live Provider-reality work in parallel.

## Launch state

| Workstream | First task | State | Dependency needed to start | First major handoff |
| --- | --- | --- | --- | --- |
| DEV | DEV-L1 preflight/dispatch | claimed 2026-10-05 (ZCode session sess_673eb8fa) | none | healthy pool + merge queue |
| TRU | TRU-L1 launch falsifiers | ready / unclaimed | none | independent review framework |
| SDW | SDW-L1 semantic contract + Worlds | ready / unclaimed | none | Lock A |
| LNC | LNC-L1 compiler/UseCommand nucleus | ready / unclaimed | none; adapter until Lock A | Lock B |
| VFX | VFX-L1 VisualSpec/sandbox scaffold | ready / unclaimed | fixture contract sufficient | Lock C |
| SKW | SKW-L1 Reflection audit | ready / unclaimed | none | Lock D |
| EXP | EXP-L1 scenario runner/diff | ready / unclaimed | existing corpus | experiment baseline |
| PRV | PRV-L1 transport/account assay | ready / unclaimed | safe browser access | Lock E |
| RTE | RTE-L1 independent runtime assays | ready / queued | none for assay; A/B/C/E for integration | trust/shell/packaging findings |

## Runtime pool status

Runtime capacity is discovered, not assumed.

Current owner-reported routing change:

- ZCode is now using **OpenRouter Auto** (`openrouter/auto`) rather than treating the previously configured five Space Bunny provider accounts as the fixed scheduling topology.
- This is a routing/input fact, not yet a verified local capability measurement.
- DEV-L1 must record the effective routed model where the harness exposes it and the actual safe concurrency before dispatch.
- Previously documented Space Bunny accounts remain historical/configuration evidence only until live preflight shows they are relevant to the current route.
- Grok Build remains candidate capacity until local preflight succeeds.

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

## First fan-out

Preferred initial occupancy is now **capacity-driven**, not account-driven.

DEV-L1 measured >=6 concurrent ZCode workers on `openrouter/auto`, so the full natural first five (SDW/LNC/VFX/SKW/EXP) plus PRV-L1 reconnaissance is supportable in parallel; TRU-L1 independent review takes the first freed slot (or a separate harness) rather than exceeding measured capacity. These are logical task slots on one router, not six provider accounts or six distinct underlying models.

Codex remains a strong DEV/integration + PRV candidate, Claude Code a strong independent TRU candidate, and Grok Build an additional candidate once verified.

This is not permanent assignment, and no provider-account count is itself proof of usable concurrency.

## Fan-in condition

Begin first integration review when:

- Lock A candidate exists;
- Lock B candidate exists;
- Lock C candidate exists;
- Lock D candidate exists;
- EXP can replay/diff the current corpus.

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
