# Orca execution substrate — VOMEGA

**Status:** conversation-derived design seed; external Orca research and local proof still pending.  
**Owner decision:** replace Daintree as the intended VOMEGA execution/control habitat with Orca.  
**Created:** 2026-10-06  
**Source basis:** prior VOMEGA conversations plus repository state at `748d918358d930c4a711ba3353e03b1c62cc3ada`.

## Purpose

This folder captures the operating design for adopting Orca as VOMEGA's heterogeneous agent execution substrate.

It does **not** make Orca project truth, product architecture, or permanent infrastructure. Orca is replaceable development machinery whose value must be proven by useful, validated product progress.

The intended boundary is:

```text
VOMEGA project/product truth
        ↓
goals + task contracts + evidence obligations
        ↓
ORCA
execution coordination / workspaces / worktrees / lifecycle / visibility
        ↓
ZCode | OpenCode | Codex | Grok Build | Claude Code
        ↓
models / accounts / routers / subscriptions
        ↓
Git + tests + evidence
```

## Settled owner direction from conversation

1. VOMEGA, not Orca, owns product direction, invariants, program truth, priorities and acceptance.
2. Orca is intended to replace Daintree as the primary execution/control habitat before VOMEGA invests further in Daintree.
3. The worker pool is heterogeneous: **ZCode, OpenCode, Codex, Grok Build and Claude Code** all remain independently valuable execution harnesses.
4. Harness, router, model, account, session and worker role are separate concepts and must never be silently collapsed.
5. Existing provider/account/auth configuration is read-only unless Owen explicitly authorizes a change.
6. The five configured OpenCode lanes — Owen and OpenCode acct 2–5 — are capacity candidates, not permanent organizational roles. Their configured Space Bunny Free 1,048,576-context settings are machine facts, not proof of five live simultaneous routes.
7. Workers should be routed by task requirements, context, risk, cost, current availability and observed performance rather than fixed departmental ownership.
8. Git/repository state, tests and evidence outrank agent self-report.
9. Long-context “Elephant” sessions are optional derived cognition. They advise, compare and preserve bounded context; they are not authorities and should not directly own source truth.
10. Maximum useful parallelism is the target, not maximum agent count.

## Truth discipline

This folder intentionally separates three classes of statement:

- **OWNER DECISION** — direction Owen has explicitly chosen.
- **CURRENT REPO FACT** — already evidenced by VOMEGA's machine/runtime documents.
- **RESEARCH / PROOF REQUIRED** — a working assumption about Orca or an intended integration that must be verified before being treated as real.

Earlier conversation statements about Orca features are not promoted to proof here. The next phase is explicit research followed by local validation.

## Relationship to existing VOMEGA surfaces

- `../META-TRACKER.md` remains the whole-program map.
- `../pm/` remains the first-five-only PM design and must not become an execution authority.
- `../agentic-launch/` remains historical/reusable execution vocabulary, not the permanent topology.
- `../dev-machine/` remains the machine/harness evidence surface.
- `../evidence/`, tests and runtime observations remain the proof surfaces.
- `../../seed-docs/` remains product/architecture intent and invariants.

Existing Daintree-specific text elsewhere is **not silently rewritten by this seed**. It should be reconciled after Orca research and ORCA-BOOT-01 establish what Orca actually does in this environment.

## Documents

1. [ARCHITECTURE.md](ARCHITECTURE.md) — ownership boundaries and target runtime topology.
2. [HARNESS-ROUTING.md](HARNESS-ROUTING.md) — heterogeneous worker pool, routing dimensions and non-equivalence rules.
3. [BOOTSTRAP.md](BOOTSTRAP.md) — safe adoption/setup sequence without disturbing existing configuration.
4. [ORCA-BOOT-01.md](ORCA-BOOT-01.md) — first proof required before Orca is treated as the validated execution substrate.
5. [CONTEXT-AND-ELEPHANTS.md](CONTEXT-AND-ELEPHANTS.md) — context bundles and retained long-context advisory sessions.
6. [MIGRATION-FROM-DAINTREE.md](MIGRATION-FROM-DAINTREE.md) — what is replaced, what is retained as reference, and what must not be copied blindly.
7. [RESEARCH-AGENDA.md](RESEARCH-AGENDA.md) — questions for the next external-research phase.

## Immediate next step

Do **not** install, reconfigure or migrate anything merely because these documents exist.

Next:
1. research current Orca capabilities and Windows behavior;
2. compare research against these requirements;
3. revise this design where evidence falsifies assumptions;
4. run ORCA-BOOT-01;
5. only then update global VOMEGA runtime documentation to describe Orca as proven infrastructure.
