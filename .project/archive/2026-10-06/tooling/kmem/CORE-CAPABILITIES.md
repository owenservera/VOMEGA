# Core Nowledge Mem capabilities relevant to VOMEGA

## Shared memory primitives

- Memories: durable standalone facts/decisions/plans/procedures/learnings/context.
- Threads: exact conversation/session history.
- Context Bundle: profile + rules + space + Working Memory + related context for startup.
- Working Memory: daily/current briefing.
- Library/Sources: documents and imported source material.
- Knowledge Graph: entities and relationships across memories.
- Knowledge Evolution: newer material can replace, enrich, confirm, or challenge earlier memory.
- Skills: reusable agent procedures.
- Spaces: optional scoped lanes for recall and writes.
- AI Profiles: stable long-running agent identities.
- Rules: standing guidance scoped globally, by profile, or by space.
- Nowledge FS: path-oriented API/MCP/CLI view across memory objects.

## Retrieval

Nowledge search combines semantic similarity, BM25 keywords, labels, graph signals, recency/decay, importance, confidence, and optional temporal interpretation in deep mode.

For VOMEGA this means:
- fast search for routine lookup;
- deep search when date/evolution/ambiguous intent matters;
- exact Thread search when provenance matters;
- repository evidence check when correctness matters.

## Capture

Capture paths differ by host. Native connectors may provide:
- SessionStart context injection;
- prompt-time routed recall;
- automatic Thread capture;
- pre-compaction capture;
- explicit handoff;
- explicit distillation.

Do not assume every host implements every lifecycle event.

## Local API and CLI

Default local REST/API server:
http://127.0.0.1:14242

Default local MCP endpoint used by several packages:
http://127.0.0.1:14242/mcp/

The nmem CLI is the universal diagnostic and fallback surface for status, Working Memory, search, saves, thread capture, import/backfill, and host MCP configuration.

## Local-first posture

Local desktop mode keeps the primary store local. Remote/Access Anywhere/self-hosted use requires explicit endpoint/client configuration. Direct MCP clients do not necessarily inherit the nmem client config; host-specific generated MCP config may be required.

## VOMEGA interpretation

KMem is best treated as a **memory fabric**, not the repository database of record. Its highest-value role is reducing re-explanation and cross-harness context loss while preserving exact Threads and focused durable Memories.
