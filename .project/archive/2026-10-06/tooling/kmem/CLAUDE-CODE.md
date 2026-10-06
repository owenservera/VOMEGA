# Claude Code × KMem

## Native plugin

Install:

~~~text
claude plugin marketplace add https://github.com/nowledge-co/community
claude plugin install nowledge-mem@nowledge-community
~~~

The plugin requires nmem.

## Lifecycle coverage

- SessionStart on startup/resume/clear: Context Bundle, with Working Memory fallback.
- SessionStart after compaction: reloads context.
- UserPromptSubmit: keeps search/save behavior visible.
- PreCompact: saves the exact session before compression.
- Stop: captures the session after a response with bounded retry behavior.

## Commands

- /save — save current session.
- /sum — distill durable insights.
- /search <query> — search knowledge.
- /status — connection diagnostics.

## Historical import

~~~text
nmem t sync --from claude-code --all-projects --limit 20
nmem t sync --from claude-code --all-projects --apply
~~~

## Spaces and identity

The plugin does not infer a Mem Space from folder/repo/branch. Without an explicit override it stays in the default lane.

Use NMEM_AGENT_ID for a stable long-running identity. Use NMEM_SPACE only when the whole process should deliberately use one existing space.

## Safe customization

Use:
- CLAUDE.md for shared repository guidance;
- CLAUDE.local.md for user-specific behavior.

Do not edit the installed plugin package.

## VOMEGA proof

Verify ordinary Claude Code first, then verify the same lifecycle behavior when Claude Code is launched as an Orca worker. PreCompact capture is particularly valuable for long-context/high-judgment sessions.

Source: https://mem.nowledge.co/docs/integrations/claude-code
