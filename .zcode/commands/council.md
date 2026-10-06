---
description: Convene the multi-model planning/design council on a question. Follows .project/dev-loop/DESIGN-COUNCIL.md.
---

# /council — multi-model design council

Question before the council: $ARGUMENTS

Convene the council per [.project/dev-loop/DESIGN-COUNCIL.md](../../.project/dev-loop/DESIGN-COUNCIL.md). Rules that must not be skipped:

1. **Gate the question first.** Refuse to convene (say why, in one sentence) if the question is: task selection (the Ratchet already decides), re-litigating a decision Owen made, or owner-reserved (auth/credentials/provider/model configuration, spend, subscriptions, mission). A council ruling is a recommendation, never authority.
2. **Probe voices.** Availability-check each external voice once (`codex exec -s read-only`, `claude -p`, `grok -p` with tiny one-shots) unless the standing table in DESIGN-COUNCIL.md §6 already has a same-session result. Record skipped voices as skipped — never simulate a voice.
3. **Two-voice minimum.** Proceed only with at least two live voices (in-session ZCode voice + at least one external voice). With fewer, report the blocker and route it (Product).
4. **Run the engine** when a full interactive pipeline is wanted: saved workflow `design-council` (CreateWorkflow, `saved: { name: "design-council", args: { question, context } }`). For a faster direct convening, follow DESIGN-COUNCIL.md §4 with Bash CLI one-shots and a subagent chair.
5. **Brief discipline.** Same brief for every voice: question, competing options, evidence with `path:line` cites, constraints (invariants), owner-reserved items. Each voice answers: position / reasoning / self-objection / falsifier.
6. **Ruling.** Chair records contradictions verbatim, never smooths them; "refusing to decide" is a valid ruling. Classify: `evidence-decidable` / `owner-decision` / `hypothesis`. Full record to `.local/dev-loop/council/latest-ruling.md` (git-ignored); sanitized summary to Commons only if material.
7. **Report** the ruling, the voices heard/skipped, and the decider experiment. Do not start implementation on the ruling's word alone — evidence still gates work.
