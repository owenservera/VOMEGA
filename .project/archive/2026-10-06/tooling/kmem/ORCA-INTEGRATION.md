# Orca × KMem integration model

Orca and KMem are complementary.

~~~text
VOMEGA objective
    ↓
Orca Run / Task / Dispatch
    ↓
parent harness session
    ↕
KMem shared memory plane
    ↓
Git/tests/evidence → VOMEGA acceptance
~~~

## Ownership

Orca owns:
- worker launch;
- worktree/project context;
- top-level task/dispatch attribution;
- runtime coordination.

KMem owns:
- startup memory context;
- cross-harness retrieval;
- exact captured Threads where supported;
- durable distilled Memories;
- shared long-lived knowledge.

VOMEGA/Git owns:
- canonical decisions;
- acceptance;
- evidence;
- source truth.

## Identity mapping

Do not automatically map every Orca Dispatch to a permanent KMem AI Profile.

Use three levels:

1. **Source app provenance** — always preserve the harness source: opencode, codex, claude-code, grok, zcode.
2. **Stable KMem AI Profile** — only for a durable role that should accumulate identity/experience over time.
3. **Orca Task/Dispatch identity** — runtime execution identity; keep in task metadata/evidence and optionally in memory labels/context, but do not pretend it is a permanent persona.

## Space strategy

Initial recommendation:
- one VOMEGA project lane;
- no per-harness spaces;
- no per-worktree spaces;
- no per-dispatch spaces.

Introduce additional Spaces only after observed retrieval interference or a genuinely durable specialist lane.

## Launch inheritance test

For every harness launched through Orca, prove:
- plugin/extension is visible;
- nmem is resolvable in PATH;
- local endpoint is reachable;
- any user/global host config is inherited;
- hooks fire;
- correct source is written;
- no API key or credential is exposed in Orca logs;
- one worker stable identity/space settings do not leak into another.

## Elephant relationship

KMem can supply the persistent substrate underneath retained long-context/Elephant sessions:
- KMem = durable shared memory fabric;
- Elephant = high-context active cognition;
- repo = authority.

Elephant sessions may query KMem and write candidate learnings back, but promotion to project truth still requires normal VOMEGA proof/authority.
