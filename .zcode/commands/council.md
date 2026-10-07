---
description: Convene the multi-model planning/design council on a question. Follows .project/dev-loop/DESIGN-COUNCIL.md.
---

# /council — multi-model design council

Question before the council: $ARGUMENTS

Convene the council per [.project/dev-loop/DESIGN-COUNCIL.md](../../.project/dev-loop/DESIGN-COUNCIL.md). Rules that must not be skipped:

1. **Gate the question first.** Refuse to convene (say why, in one sentence) if the question is: task selection (the Ratchet already decides), re-litigating a decision Owen made, or owner-reserved (auth/credentials/provider/model configuration, spend, subscriptions, mission, invariants) — the router's ABSTAIN row (DESIGN-COUNCIL.md §5). A council ruling is a recommendation, never authority.
2. **Grade and route.** Pick the protocol by stakes (DESIGN-COUNCIL.md §5): routine → PANEL; contested → PANEL+CHALLENGE; real dispute → ROUND-ROBIN+JUDGE. Record the grade, the reason and the variables (§3.1).
3. **Probe voices.** Read the dark list in PROVIDER-AVAILABILITY.md §1a, then availability-check each voice once with a tiny one-shot (`codex.cmd exec -s read-only -C .local/dev-loop/scratch`, `node .local/dev-loop/claude-voice.mjs -t "Reply OK" <model>`, `grok.cmd -p`). The `claude -p` CLI is not a voice route (its sign-in is Owen-reserved). Record skipped voices as skipped — never simulate a voice.
4. **Two-family minimum.** Proceed only with at least two live **independent families** (DESIGN-COUNCIL.md §3.2): models behind one provider, and a session model plus its own provider's CLI, count once. With fewer, the QUORUM-LOSS breaker trips (§6): report BLOCKED and route it.
5. **Run the engine** when a full interactive pipeline is wanted: saved workflow `design-council` (CreateWorkflow, `saved: { name: "design-council", args: { question, context } }`). For a faster direct convening, follow DESIGN-COUNCIL.md §7 with Bash CLI one-shots and a subagent chair. Watch the five circuit breakers (§6).
6. **Brief discipline.** Same brief for every voice: question, competing options, evidence with `path:line` cites, constraints (invariants), owner-reserved items. Each voice answers: position / reasoning / self-objection / falsifier.
7. **Ruling.** Chair records contradictions verbatim, never smooths them; "refusing to decide" is a valid ruling. Classify: `evidence-decidable` / `owner-decision` / `hypothesis`. Name every breaker that tripped. Full record to `.local/dev-loop/council/<ts>-ruling.md` (git-ignored); sanitized summary to Commons only if material.
8. **Report** the ruling, the voices heard/skipped with their families, any tripped breakers, and the decider experiment. Do not start implementation on the ruling's word alone — evidence still gates work.
