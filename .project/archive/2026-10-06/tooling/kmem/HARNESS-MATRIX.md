# KMem harness capability matrix

| Harness | Native path | Startup context | Retrieval | Automatic thread capture | Pre-compaction | Historical backfill | Important caveat |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OpenCode | opencode-nowledge-mem plugin | Context Bundle / Working Memory | direct native tools | idle-event capture | yes | nmem t sync --from opencode | OpenCode 1.x must pin plugin 0.3.10; 2.x uses new plugin API |
| Codex | native Codex plugin + bundled MCP + hooks | SessionStart | MCP + routed search skills | Stop hook via nmem t save --from codex | lifecycle path | nmem t sync --from codex | plugin, hooks, and hook trust are separate; Codex local Memory can duplicate learning |
| Claude Code | native plugin | SessionStart / resume / clear | skills + commands | Stop after response | yes, PreCompact | nmem t sync --from claude-code | customize via CLAUDE.md/CLAUDE.local.md, not plugin files |
| Grok Build | shared Claude-compatible plugin, Grok-aware runtime | Context Bundle / Working Memory | guided skills + commands | Stop via nmem t save --from grok | yes | nmem t sync --from grok | shared package filenames may say Claude; runtime source remains grok |
| ZCode | dedicated nowledge-mem-zcode marketplace plugin | SessionStart | MCP + Skills + bounded UserPromptSubmit recall | Stop hook transcript import | **no** | no general historical archive import | depends on ZCode hook behavior; verify Stop actually fires |

## Recommended priority

1. OpenCode — default VOMEGA general worker, so prove first.
2. Codex — hybrid plugin/MCP/hooks requires the most deliberate configuration.
3. Claude Code — strong lifecycle coverage and clean proof path.
4. Grok Build — shared plugin package but separate source semantics.
5. ZCode — highest need for explicit runtime verification because capture depends on ZCode hook transcript contract.

## Common verification

For every harness:
1. prove nmem status;
2. start a fresh session;
3. verify startup context;
4. ask a prior-work question that requires retrieval;
5. create one distinctive test phrase;
6. finish/stop the session;
7. search KMem for that phrase using the correct source;
8. verify a durable memory can be saved and read back;
9. verify no provider/account/model configuration changed.
