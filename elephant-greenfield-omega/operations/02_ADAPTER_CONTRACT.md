# Real session adapter checklist and operator evidence

An adapter must expose:

```
probe() -> capability_record
open(snapshot, read_only_policy) -> session_handle
resume(handle) -> verified_same_session | unsupported | unknown
request(handle, envelope, deadline) -> ack/progress/terminal
cancel(request_id) -> confirmed | attempted | unsupported
checkpoint(handle) -> opaque_token | unsupported
fork(handle) -> new_handle | unsupported
close(handle) -> confirmed | uncertain
metrics(handle) -> token_usage / context / caching | unknown
```

**No assumptions** about Claude Code, Codex, OpenCode, ZCode or Grok shell flag support. Map real CLI/ACP/MCP endpoints only after local `--help` and a safe smoke test. Auth stays in each tool's existing private configuration. Use a local wrapper with strict input/output, not auto-rewrite of user configs.

## Proof for a genuine Elephant

1. Obtain provider/model identity and per-session unique stable handle if available.
2. Load a source snapshot and ask a calibration question unique to the pack.
3. Terminate and **resume** the same session (or test cached-prefix stateless alternative); verify the reloaded source can be referenced without full injection.
4. Prove code tools blocked (OS permission sandbox and working-tree status), not merely told to be read-only.
5. Change one source file in verified Git history, show the wrapper (not model) reports the affected node stale.
6. Flush/rotate and demonstrate old transaction content does not reappear as promoted knowledge; if impossible to prove, record the weaker guarantee.
7. Issue two requests with distinct IDs; confirm correct correlation, bounded timeout and stable journal.

## Potential interoperability

ACP provides coding-agent client/session messages; MCP provides tools/resources where configured. Neither automatically supplies ECP's epoch-aware cognition semantics. Use adapter translation for `session/new`, `session/prompt`, `session/resume` (only if supported). Protocol version/capability negotiation is mandatory; ACP specifications can change. An initial `exec`/CLI transport may be faster than a full long-lived server.

## Capacity and account fairness

Capture configured model labels, actual reachability, context limit if verifiable, usage, token accounting, rate-limit errors, reconnect reliability and session cost. Configured lanes are not proof of 1M usable context. Avoid assuming five account lanes may be freely pooled or support parallel access. Respect provider rules and local machine resource limits.
