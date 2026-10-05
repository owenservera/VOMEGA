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

## First fan-out

Preferred initial occupancy if all local systems prove reachable:

- five ZCode lanes → SDW, LNC, VFX, SKW, EXP;
- Codex → DEV launch + PRV reconnaissance if safe;
- Claude Code → TRU independent review;
- RTE takes the first suitable freed lane or a separately available executor.

This is not permanent assignment.

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
