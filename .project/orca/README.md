# Orca execution substrate — VOMEGA

**Status:** evidence-backed design; local setup/proof pending.  
**Owner direction:** replace Daintree as the intended primary execution/control habitat with Orca.  
**Pinned first baseline:** Orca v1.4.220.

## What changed after research

The first seed correctly identified Orca as a candidate heterogeneous control plane, but primary-source research materially sharpened the design:

1. Orca v1.4.220 already has structured **Run → Task → Dispatch → worker** orchestration, explicit `worker_done`, questions, decision gates and dependencies. It is marked Experimental.
2. ZCode is a deep Orca integration, but Orca requires a **standalone TUI-capable `zcode` CLI**. Owen's currently recorded desktop-bundled CLI is not sufficient proof.
3. Orca defaults supported agents toward their permission-bypass mode. VOMEGA will bootstrap **Manual-first**.
4. Worktrees isolate Git writes, not machine security.
5. Claude and Codex have the deepest stable account integrations.
6. OpenCode stable support is real, but some deeper OpenCode launch/model features live only on newer Orca `main`; the design does not depend on them.
7. Every harness has or can have its own internal agent system. Orca therefore owns **top-level cross-harness provenance**, while harness subagents remain children of one Orca Dispatch.
8. Orca's website/main can run ahead of stable. First deployment is pinned to v1.4.220 and upgraded deliberately.

## Target stack

```text
VOMEGA decides / constrains / accepts
               ↓
Orca coordinates top-level work
               ↓
Run → Task → Dispatch → parent worker
               ↓
ZCode | OpenCode | Codex | Grok Build | Claude Code
               ↓
optional harness-local subagents
               ↓
Git + tests + evidence
               ↓
VOMEGA acceptance / fan-in
```

## Truth boundary

- Orca state proves runtime coordination state, not product truth.
- harness output is a claim until checked.
- heartbeat proves liveness, not completion.
- `worker_done` settles an Orca attempt, not VOMEGA acceptance.
- a worktree is isolation, not sandbox.
- context is cognition, not authority.

## Current known blocker

Before ZCode becomes an Orca worker, provide a TUI-capable standalone ZCode CLI on PATH and prove it interactively.

Do **not** replace the ZCode desktop app or mutate provider/account settings merely to satisfy Orca.

## Read order

1. [CAPABILITY-MATRIX.md](CAPABILITY-MATRIX.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [HARNESS-ROUTING.md](HARNESS-ROUTING.md)
4. [BOOTSTRAP.md](BOOTSTRAP.md)
5. [ORCA-BOOT-01.md](ORCA-BOOT-01.md)
6. [CONTEXT-AND-ELEPHANTS.md](CONTEXT-AND-ELEPHANTS.md)
7. [MIGRATION-FROM-DAINTREE.md](MIGRATION-FROM-DAINTREE.md)
8. [research/README.md](research/README.md)

## Relationship to project truth

Unchanged:
- `../META-TRACKER.md` = whole program map;
- `../pm/` = first-five-only PM design;
- `../agentic-launch/` = historical/reusable execution vocabulary;
- `../dev-machine/` + `../ENVIRONMENT.md` = machine evidence;
- `../evidence/` + tests = proof;
- `../../seed-docs/` = product/architecture intent/invariants.

Orca is below all of those in authority.

## Daintree

Daintree is no longer the intended primary runtime dependency.

Keep its dated evidence and useful design ideas. Reconcile global Daintree operational guidance only after Orca passes ORCA-BOOT-01, so history is not rewritten as if the switch had already been proven.
