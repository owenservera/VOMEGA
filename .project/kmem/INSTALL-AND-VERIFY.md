# KMem installation and verification plan

This is a research-backed setup sequence, not yet evidence that Owen's machine is configured.

## Phase 0 — protect existing configuration

Read-only by default:
- provider/account/model/router configuration;
- OpenCode provider wiring;
- ZCode providers/accounts;
- Codex/Claude/Grok authentication;
- Orca routing/account configuration;
- credentials and API keys.

KMem setup should only add memory integrations unless an observed blocker requires more.

## Phase 1 — base Mem + CLI

1. Confirm Nowledge Mem desktop/app installation and version.
2. Install or expose nmem through the desktop Developer Tools path when possible.
3. Run nmem status.
4. Save one harmless test memory and read/search it back.
5. Confirm local endpoint behavior before connecting any harness.

Do not turn on broad background automation until the basic store is proven.

## Phase 2 — one shared VOMEGA lane

Start with Default or one explicit VOMEGA Space. Do not create a space per harness or per disposable worker.

Use AI Profiles only for durable identities. Harness name is provenance; it is not automatically a stable role.

## Phase 3 — harness installation order

1. OpenCode
2. Codex
3. Claude Code
4. Grok Build
5. ZCode

After each connector, prove it independently before moving on.

## Phase 4 — cross-harness handoff proof

Create one real bounded VOMEGA task:
- begin in OpenCode;
- save/capture the session;
- continue in Codex or Claude Code without manually pasting the history;
- retrieve an exact prior decision;
- modify/refine it;
- finish in another harness;
- verify all Threads retain correct source provenance.

## Phase 5 — Orca proof

Launch the same connected harnesses through Orca and prove the connector behavior still occurs inside Orca-spawned sessions.

Key question: do user/global plugin configs, hooks, PATH, nmem, and any required environment variables survive Orca launch boundaries?

## Acceptance conditions

KMem is not considered operational until:
- all five harnesses can retrieve shared context;
- automatic capture is proven where claimed;
- ZCode Stop-hook behavior is explicitly observed;
- exact source attribution is preserved;
- at least one cross-harness continuation works without manual context paste;
- important writes can be read back;
- provider/auth settings are unchanged;
- repository truth remains the higher authority.
