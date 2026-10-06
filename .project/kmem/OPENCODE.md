# OpenCode × KMem

## Official integration

OpenCode uses the native opencode-nowledge-mem plugin.

Check version first:

~~~text
opencode --version
~~~

OpenCode 2.x:

~~~text
opencode plugin add opencode-nowledge-mem
~~~

OpenCode 1.x:

~~~text
opencode plugin opencode-nowledge-mem@0.3.10 --global
~~~

The 1.x line uses the old plugin API and should remain pinned to 0.3.10.

## Capabilities

The native plugin exposes tools for:
- Context Bundle;
- Working Memory;
- memory search;
- memory save/update;
- Thread search;
- explicit Thread save;
- handoff save;
- status.

New sessions can capture automatically when OpenCode reports idle. Long sessions also flush before compaction.

## Historical import

Preview:
nmem t sync --from opencode --all-projects --limit 20

Apply:
nmem t sync --from opencode --all-projects --apply

Use a project path instead of all-projects when limiting scope.

## Safe customization

Put project behavior in:
- repo AGENTS.md;
- personal ~/.config/opencode/AGENTS.md;
- OpenCode own instruction config.

Do not patch the installed KMem plugin.

## VOMEGA-specific proof

Because OpenCode is the default Orca worker:
1. prove plugin in ordinary OpenCode;
2. prove nmem resolution;
3. prove automatic idle capture;
4. launch OpenCode through Orca;
5. repeat retrieval + capture;
6. run two concurrent OpenCode workers and verify Threads do not become misattributed.

Source: https://mem.nowledge.co/docs/integrations/opencode
