# Orca research agenda — post primary-source pass

**Status:** first documentation/source pass completed 2026-10-06. Remaining work is primarily local validation, recent issue mining and performance characterization.

## Completed in first pass

### Orca stable baseline
- canonical repo/license/platform;
- v1.4.220 pin;
- structured orchestration model;
- experimental status;
- worktree model;
- orca.yaml + Windows setup-shell semantics;
- permission default warning;
- account/usage behavior;
- stable-vs-main OpenCode distinction.

### Harnesses
- ZCode deep-integration + TUI requirement;
- OpenCode stable integration and version boundary;
- Codex deep account/session integration;
- Grok built-in integration/model-effort source evidence;
- Claude deep integration + optional Agent Teams;
- official harness subagent/hooks/MCP/permission surfaces.

## Remaining research

### A. Local Windows validation — highest priority

1. Exact Orca v1.4.220 Windows install/CLI behavior.
2. Standalone TUI-capable ZCode CLI acquisition/build path that coexists with ZCode desktop.
3. Which config/provider state standalone ZCode inherits.
4. Current Windows OpenCode version and whether v1/v2 coexist.
5. Grok Build Windows hook/status behavior.
6. Claude/Codex account detection without mutation.
7. Orca structured worker-start support for ZCode specifically.
8. Exact launch receipts/telemetry for all five harnesses.

### B. Multi-account / five-lane reality

Determine precisely what Owen / OpenCode acct 2–5 represent:
- ZCode provider profiles?
- OpenCode credentials?
- OpenRouter accounts/routes?
- selectable per session?
- concurrently reachable?

No scheduler design should assume the answer.

### C. Concurrency/resource behavior

Measure:
- 1, 2, 5, 10, 20 sessions;
- RAM/CPU;
- provider throttling;
- session attribution;
- coordinator message pressure;
- Git/worktree overhead;
- context/Elephant congestion.

### D. Recent Orca issues

Mine recent issues/releases for:
- Windows regressions;
- worker-start/orchestration bugs;
- Codex session attribution;
- OpenCode status/prompt delivery;
- Grok hooks;
- ZCode TUI/session resume;
- worktree cleanup;
- multi-account errors.

### E. Context and Elephant fit

After basic substrate passes:
- retained worker semantics;
- session search/history;
- worker-to-worker/context transfer;
- Context Bundle injection;
- Elephant latency/value experiments.

## Decision gates

### Gate 1 — install
Proceed if stable Windows runtime/CLI works.

### Gate 2 — five harnesses
Proceed if all five can be launched without provider/auth damage. ZCode TUI prerequisite must be solved.

### Gate 3 — supervised orchestration
Proceed if two heterogeneous workers can complete a controlled Run with explicit lifecycle semantics.

### Gate 4 — full adoption
Promote Orca to “validated current execution substrate” only after ORCA-BOOT-01.

### Gate 5 — high autonomy
Increase permission bypass/concurrency only after safety, attribution and resource behavior are measured.
