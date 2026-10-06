# KMem — cross-harness memory plane for VOMEGA

**Product:** Nowledge Mem  
**Project shorthand:** KMem  
**Status:** primary-source research seed; local installation and cross-harness proof pending.  
**Research date:** 2026-10-06.

## Decision being explored

Use Nowledge Mem as the shared memory plane beneath the VOMEGA development fleet:

~~~text
VOMEGA truth / Git / evidence
            ↓
      KMem (Nowledge Mem)
            ↓
OpenCode | Codex | Claude Code | Grok Build | ZCode
            ↑
          Orca
   coordination/control
~~~

KMem is not product truth. It may capture, retrieve, connect, summarize, distill, and hand off context. Canonical project claims still require repository/evidence authority.

## Why this folder exists

Nowledge integrations are host-specific. The correct installation is not "add the same MCP server everywhere":

- OpenCode has a native plugin with direct tools, idle capture, and pre-compaction flush.
- Codex uses a hybrid native plugin + MCP + lifecycle hooks.
- Claude Code uses a native lifecycle plugin with SessionStart, PreCompact, and Stop capture.
- Grok Build loads the shared Claude-compatible package but detects Grok at runtime and saves as source=grok.
- ZCode has a separate native marketplace plugin with MCP, Skills, commands, SessionStart/UserPromptSubmit/Stop hooks, and a specific transcript-capture caveat.

## Read order

1. [ARCHITECTURE.md](ARCHITECTURE.md)
2. [CORE-CAPABILITIES.md](CORE-CAPABILITIES.md)
3. [HARNESS-MATRIX.md](HARNESS-MATRIX.md)
4. [INSTALL-AND-VERIFY.md](INSTALL-AND-VERIFY.md)
5. [OPENCODE.md](OPENCODE.md)
6. [CODEX.md](CODEX.md)
7. [CLAUDE-CODE.md](CLAUDE-CODE.md)
8. [GROK-BUILD.md](GROK-BUILD.md)
9. [ZCODE.md](ZCODE.md)
10. [ORCA-INTEGRATION.md](ORCA-INTEGRATION.md)
11. [SOURCES.md](SOURCES.md)

## Initial policy

- Prefer native host integrations over generic MCP where available.
- KMem memory is advisory/derived unless backed by canonical source evidence.
- Do not modify provider/account/model/auth configuration to install KMem.
- Do not edit installed plugin caches; put VOMEGA behavior in host-owned instruction surfaces.
- Start with one VOMEGA memory lane. Add Spaces only when real interference justifies them.
- Assign a KMem AI Profile / NMEM_AGENT_ID only to a stable long-running identity, not every disposable Orca worker.
- Verify writes by reading/searching them back. A hook reporting success is not proof of persistence.
- Keep exact transcripts (Threads) distinct from distilled durable claims (Memories).

## Primary upstream

- Documentation: https://mem.nowledge.co/docs
- Connectors: https://mem.nowledge.co/integrations
- Community integrations: https://github.com/nowledge-co/community
- ZCode plugin: https://github.com/nowledge-co/zcode-plugin
