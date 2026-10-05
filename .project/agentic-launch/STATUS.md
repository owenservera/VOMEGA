# Agentic Team Launch Status

As of 2026-10-05.

This file is the compact launch-state surface for fresh local sessions.

Detailed topology: [README.md](README.md)

## Objective

Run the semantic MVP twin and live Provider-reality work in parallel.

## Launch state

| Workstream | First task | State | Dependency needed to start | First major handoff |
| --- | --- | --- | --- | --- |
| DEV | DEV-L1 preflight/dispatch | ready / unclaimed | none | healthy pool + merge queue |
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

| Harness / route | Current state | Evidence needed |
| --- | --- | --- |
| ZCode + `openrouter/auto` | owner-reported current route; live task capacity unverified in repo | bounded read-only/task probe, effective routed-model capture where exposed, concurrency observation |
| Codex | installed previously; current task capacity to re-check | version/mode + bounded probe |
| Claude Code | installed/authenticated previously; model execution previously untested | current version/model/mode + bounded probe |
| Grok Build | owner installing / candidate | `grok version`, `grok inspect`, bounded comparison task |
| deterministic local tools | known substrate; versions may drift | record exact versions with proof |

## First fan-out

Preferred initial occupancy is now **capacity-driven**, not account-driven.

If ZCode/OpenRouter Auto safely supports five independent workers, SDW/LNC/VFX/SKW/EXP remain the natural first five tasks. If actual concurrency is lower, DEV dispatches the highest-unlocking tasks first: SDW → LNC → SKW/EXP/VFX as adapters permit.

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
