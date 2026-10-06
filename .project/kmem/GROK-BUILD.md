# Grok Build × KMem

This is for **Grok Build**, the coding agent with local ~/.grok/ sessions. It is not the consumer Grok web/Bot connector.

## Install

~~~text
grok plugin install nowledge-co/community#nowledge-mem-claude-code-plugin --trust
~~~

Restart Grok Build.

The package is shared with the Claude Code integration because Grok Build can load Claude-compatible plugin assets. Runtime detection changes the source and capture path to Grok.

## Capabilities

- Session-start Context Bundle / Working Memory.
- Guided memory search and distillation.
- /save, /search, /sum, /status.
- Stop and PreCompact hooks.
- Full session capture through nmem t save --from grok.
- Historical import.

## Historical import

Preview:
nmem t sync --from grok --all-projects --limit 20

Apply:
nmem t sync --from grok --all-projects --apply

The importer reads Grok Build local ~/.grok/sessions.

## Identity

For a multi-agent launcher, set NMEM_AGENT_ID=<agent-slug> only when that worker is a stable long-lived identity. Add NMEM_SPACE only when the whole run deliberately belongs to one Mem Space.

Do not generate a unique permanent identity for every disposable Orca Dispatch.

## Verification

After a normal turn:
nmem t search "distinctive phrase" --source grok

Shared package filenames may contain Claude wording; that is not evidence of wrong provenance. Confirm the resulting KMem Thread source.

## Safe customization

Use Grok Build own project rules/instruction files. Do not edit ~/.grok/installed-plugins.

Source: https://mem.nowledge.co/docs/integrations/grok
