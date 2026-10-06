# ZCode × KMem

ZCode has a dedicated standalone Nowledge plugin repository.

## Install

In ZCode:
Settings → Plugins → Create → Add marketplace

Marketplace source:
https://github.com/nowledge-co/zcode-plugin

Install and enable:
nowledge-mem-zcode

Reload/restart the ZCode Agent runtime.

## Package contents

The package includes:
- .zcode-plugin/plugin.json
- .mcp.json
- Skills
- commands
- lifecycle hooks
- marketplace metadata

Default local MCP endpoint:
http://127.0.0.1:14242/mcp/

## Hook behavior

Current plugin behavior:
- SessionStart: inject Context Bundle / Working Memory.
- UserPromptSubmit: records the prompt and performs bounded recall for prompts that clearly need prior work/history.
- Stop: pairs captured prompts with ZCode temporary hook transcript and invokes nmem t sync --from zcode.

## Important limitation

ZCode is the harness where automatic capture needs the most explicit proof.

The plugin does **not** claim:
- pre-compaction capture;
- general historical ZCode archive import;
- lossless transcript import when no hook transcript is provided.

Some ZCode builds have had reports of Stop hooks not firing. After installation, run a short real session and verify the Thread appears.

Fallback command when a hook context exposes transcript_path:
nowledge-mem-sync-now

A handoff summary is not an exact transcript.

## Skills

- read-working-memory
- search-memory
- distill-memory
- save-handoff
- status
- check-integration

## Commands

- nowledge-mem-status
- nowledge-mem-sync-now
- nowledge-mem-save-handoff

## Remote mode

For a remote/self-hosted/Access Anywhere Mem endpoint, generate host-owned MCP config:

nmem config mcp show --host zcode

Paste the generated configuration into ZCode MCP settings. Do not put API keys into committed files, shell history, or plugin source.

## Windows note

The official plugin repository documents a Windows PowerShell local-marketplace development fallback, but the normal path is the GitHub marketplace URL above. Prefer the normal marketplace unless investigating/plugin-developing.

## Orca interaction

The separate Orca requirement for a TUI-capable standalone ZCode worker is independent of this KMem plugin. Prove:
1. ZCode itself can run as the Orca worker;
2. the KMem plugin is loaded in that runtime;
3. SessionStart fires;
4. Stop fires;
5. the resulting Thread has source=zcode.

Source: https://github.com/nowledge-co/zcode-plugin
Integration page: https://mem.nowledge.co/integrations/zcode
