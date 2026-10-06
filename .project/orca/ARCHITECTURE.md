# Orca execution architecture — evidence-revised

**Status:** target architecture after primary-doc/source research; local Windows proof still required.  
**Runtime baseline:** Orca v1.4.220.

## 1. Core control hierarchy

```text
                         OWEN
                           │
                           ▼
              VOMEGA authority/truth
        seed · meta · PM · repo · evidence
                           │
                 bounded objective/task
                           ▼
════════════════════════════════════════════════════════════
                   ORCA v1.4.220
        heterogeneous execution control plane
────────────────────────────────────────────────────────────
 Run namespace / coordinator inbox
 Task specs + real dependencies
 Dispatch = authoritative attempt
 worker lifecycle + ask/reply + gates
 worktrees / terminals / review / steering
════════════════════════════════════════════════════════════
         │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼
      ZCode     OpenCode      Codex    Grok Build  Claude Code
         │          │          │          │          │
      optional harness-local subagents / teams / tools
         │          │          │          │          │
         └──────────┴──────────┴──────────┴──────────┘
                           │
                  files/tests/evidence
                           ▼
                     VOMEGA fan-in
```

## 2. The key boundary: Orca is top-level runtime ownership

The research changes the design from “Orca launches different CLIs” to:

> **Orca owns cross-harness Task/Dispatch provenance; harness-native multi-agent systems are nested execution details of one Dispatch.**

This matters because ZCode, Claude, Grok, Codex and OpenCode can themselves fan out.

Without this rule, VOMEGA could accidentally have five independent schedulers creating invisible child ownership.

### Parent-worker contract

If a harness uses internal subagents:
- the parent Orca worker remains owner;
- the parent owns the write set;
- the parent resolves child conflicts;
- the parent collects tests/evidence;
- the parent sends one `worker_done` for its Dispatch;
- a child becomes a top-level VOMEGA worker only if Orca receives a separate Task/Dispatch for it.

## 3. Authority ladder

| Layer | Authority |
| --- | --- |
| Owen / protected VOMEGA surfaces | product decisions, invariant changes, spend/auth/security/irreversible choices |
| Repo/meta/PM/task artifacts | durable objective/decomposition/provenance |
| Orca Run/Task/Dispatch | execution ownership and lifecycle only |
| Harness session | execution of one Dispatch |
| Harness subagents/team | child compute only |
| Git/tests/evidence | observable result/proof |
| Elephant/context session | advisory cognition only |

## 4. Semantic separations

```text
HARNESS ≠ ROUTER ≠ PROVIDER ≠ ACCOUNT ≠ MODEL ≠ SESSION ≠ WORKER ROLE
WORKTREE ≠ SECURITY SANDBOX
HEARTBEAT ≠ COMPLETION
WORKER_DONE ≠ ACCEPTED PRODUCT TRUTH
ORCA TASK STATE ≠ VOMEGA PROOF
CONTEXT ≠ AUTHORITY
```

An Orca Dispatch can be marked complete while VOMEGA still rejects its artifact because acceptance evidence failed.

## 5. Coordinator design

The coordinator is a function, not a permanent frontier-model identity.

It should:
1. read the current VOMEGA task/proof obligations;
2. decompose only where parallelism reduces time or uncertainty;
3. create self-contained Task specs;
4. expose true dependencies;
5. route by current capability/capacity;
6. monitor questions/escalations/completion;
7. require evidence;
8. request independent review when consequence warrants it;
9. fan-in or refuse integration;
10. persist a reconstructable handoff.

The coordinator should not routinely edit product code when that sacrifices independence or creates a bottleneck.

## 6. Dispatch contract

Each Orca Task spec should carry VOMEGA's extended contract:

```text
TARGET
CHANGE
CONSTRAINTS
OWNERSHIP
DEPENDENCIES
OBSERVABLE ACCEPTANCE
AUTHORITY / PROVENANCE
HANDOFF
```

Orca's own stable task-spec guidance already aligns with most of these fields.

## 7. Worktree policy

Use a separate worktree when:
- concurrent writers can collide;
- the task is consequential enough to need isolated diff/review;
- an experimental solution should be disposable.

Do not create a worktree when:
- the task is read-only;
- one coordinator is only inspecting;
- isolation adds more overhead than protection.

Independent tasks should normally branch from the repo default base, not from a current feature branch.

## 8. Security/permission policy

Research exposed an important Orca default: supported agents are commonly launched with their permission-bypass/auto-approval mode unless changed in Settings.

VOMEGA bootstrap therefore starts:

> **Orca Settings → Agents → Agent Permissions = Manual**

Then autonomy is increased by task class after evidence.

A Git worktree is not a sandbox. Harness-native sandboxing/permissions remain in force and must be understood separately.

## 9. Version boundary

Pin the first proof to **Orca v1.4.220**.

Do not depend on main-only features. In particular, newer OpenCode startup/model plumbing on `main` is not required for bootstrap.

After any Orca upgrade, rerun the runtime/harness smoke matrix.

## 10. Known ZCode integration blocker

Existing VOMEGA Windows evidence records a desktop-bundled ZCode runtime invoked through Node and no standalone `zcode` on PATH.

Orca v1.4.220 requires an interactive TUI-capable `zcode`.

Therefore the setup must add/validate a standalone TUI-capable ZCode CLI **without replacing the desktop app or its provider/account configuration**.

Until then:
- ZCode remains independently usable in its current habitat;
- it is not yet a validated Orca worker.

## 11. Capacity topology

Do not encode the historical five configured lanes as five permanent workers.

Treat available capacity as dynamic:

```text
capacity registry
├── ZCode sessions + its configured provider routes
├── OpenCode sessions + providers
├── Codex account/session capacity
├── Grok Build account/session capacity
├── Claude Code account/session capacity
└── retained Context/Elephant sessions when proven valuable
```

The historical provider labels Owen / OpenCode acct 2–5 remain configured machine facts until live selection/reachability is re-proven.

## 12. Design success condition

The architecture works when Owen can issue or approve one VOMEGA objective and obtain:

```text
objective
→ explicit tasks/dependencies
→ heterogeneous routed Dispatches
→ isolated execution
→ visible blockers/questions
→ explicit outcomes
→ independent challenge where useful
→ tests/evidence
→ coherent fan-in
→ durable repo state
```

without needing to manually babysit every terminal and without Orca becoming the source of product truth.
