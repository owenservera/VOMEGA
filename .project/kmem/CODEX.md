# Codex × KMem

## Recommended architecture

Modern Codex uses a hybrid connector:

~~~text
Codex plugin
 + bundled KMem MCP
 + SessionStart/UserPromptSubmit/Stop hooks
 + nmem CLI
~~~

This applies to Codex desktop and CLI because they share ~/.codex configuration/plugin state.

## Install

Preferred sparse marketplace path:

~~~text
codex plugin marketplace add nowledge-co/community --sparse .agents --sparse nowledge-mem-codex-plugin
codex plugin add nowledge-mem@nowledge-community
~~~

Enable plugin + hooks in ~/.codex/config.toml:

~~~toml
[features]
plugins = true
hooks = true

[plugins."nowledge-mem@nowledge-community"]
enabled = true
~~~

Restart Codex.

## Hook setup

The plugin includes an install_hooks.py setup. On Windows PowerShell, locate the installed script under the Codex plugin cache and run it with py -3, then restart Codex.

Codex may separately require the user to trust the SessionStart, UserPromptSubmit, and Stop hooks. Enabled is not the same as trusted.

## Behavior

- SessionStart injects Context Bundle, falling back to Working Memory.
- UserPromptSubmit biases continuation/history work toward KMem retrieval.
- MCP provides direct retrieval/write tools.
- Stop saves the real Codex transcript using nmem t save --from codex.

## Codex local Memory coexistence

Codex own Memory and KMem are separate stores.

To avoid a stale duplicate-learning loop, Nowledge recommends disabling memory generation from externally/tool-assisted context when Codex local Memory remains enabled:

~~~toml
[memories]
disable_on_external_context = true
~~~

This prevents a KMem-derived answer from becoming a separate older Codex-local summary that later bypasses KMem.

Do not change this setting silently during bootstrap; inspect and record it, then apply according to the approved setup plan.

## Historical import

~~~text
nmem t sync --from codex --all-projects --limit 20
nmem t sync --from codex --all-projects --apply
~~~

## Safe project customization

Merge KMem guidance into the repository existing AGENTS.md; never overwrite VOMEGA AGENTS.md wholesale and never edit the installed plugin cache.

## Verification

After one distinctive turn:
nmem t search "distinctive phrase" --source codex

Source: https://mem.nowledge.co/docs/integrations/codex-cli
