# KMem architecture for the VOMEGA fleet

## Layering

~~~text
Owner decisions / VOMEGA invariants
                ↓
Git + source docs + tests + evidence
                ↓
     KMem shared memory plane
                ↓
Context Bundle / Working Memory / search / Threads / Memories
                ↓
OpenCode | Codex | Claude Code | Grok Build | ZCode
                ↑
        Orca coordination
~~~

Orca and KMem solve different problems:

- **Orca:** project/worktree/worker orchestration, Dispatch attribution, runtime coordination.
- **KMem:** cross-tool continuity, startup context, searchable history, durable distilled knowledge.
- **Git/VOMEGA evidence:** canonical authority.

Never collapse these layers.

## KMem object model

### Threads

Exact or normalized conversation history. Use for provenance, reconstruction, and "what was actually said."

### Memories

Durable standalone takeaways: facts, preferences, decisions, plans, procedures, learnings, events, or important context.

A Thread is evidence/history. A Memory is a distilled claim. Do not substitute one for the other.

### Context Bundle

Startup payload for supported tools. It can contain owner/profile context, selected AI profile, standing Rules, active Space, Working Memory, and paths/interfaces.

### Working Memory

A compact current briefing generated from recent/important activity. It is intentionally lightweight and should not be treated as complete history.

### Spaces

Optional retrieval/write lanes. VOMEGA should begin with one shared VOMEGA lane unless real cross-project interference appears. Spaces change the default memory surface; the entity graph remains global.

### AI Profiles

Use only for stable roles that persist over time. Tool names such as codex or claude-code are provenance, not automatically unique identities.

### Rules and Skills

Rules are standing guidance injected through context. Skills are reusable procedures/behavior packages. Host-owned instructions should carry VOMEGA-specific customization so plugin upgrades do not erase it.

## Truth boundary

KMem supports knowledge evolution, graph links, search confidence, decay, and background synthesis. These mechanisms improve retrieval; they do not confer authority.

VOMEGA rule:

~~~text
retrieved memory ≠ canonical truth
confidence ≠ proof
thread capture ≠ acceptance
distillation ≠ evidence
context ≠ authorization
~~~

Where consequential, a worker must follow the memory back to repository/source evidence before acting.

## Persistence rule

Treat automatic capture as a convenience, not proof.

For important durable writes:

~~~text
decide → save → obtain identity/result → search/read back → retain source/provenance
~~~

For critical project decisions, the canonical copy must also live in the project authority surface.
