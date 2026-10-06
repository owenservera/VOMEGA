# Design council — multi-model planning and design deliberation

Status: **ACTIVE** (owner-directed, 2026-10-06)
Claim: [`../agentic-launch/claims/20261006-1641-design-council-zcode.md`](../agentic-launch/claims/20261006-1641-design-council-zcode.md)
Companion: [24X7-DEV-LOOP.md](24X7-DEV-LOOP.md) — the loop that convenes this council.

## 1. What the council is

A standing **mechanism**, not a standing organization: when a genuine contested
planning/design question appears, the governor convenes independent voices from
**different model families** and one chair, and gets a ruling that records
disagreements instead of smoothing them. It exists because same-model, same-prompt
reviewers share blind spots; cross-family voices do not.

Outputs are **hypotheses and recommendations, never authority**. A council ruling
ranks changes by value-per-risk, names what is contested, and says what evidence
would settle it — it does not authorize work, change an invariant, or decide an
owner-reserved question. Authority boundaries live in `AGENTS.md`,
`META-TRACKER.md §0` and `../deliverables/D1-START-HERE.md`.

## 2. When to convene (and when not)

Convene when:

- a task hits the **design-intensity rule** (D4/D5): implementation uncovered a
  genuine semantic choice with more than one defensible answer;
- the Ratchet hands out a **REGRESSED** task whose fix strategy is contested;
- two workers disagree on a write surface, a gate's meaning, or a promotion;
- a stop condition is adjacent and the only blocker is a design choice, not an
  owner decision.

Do **not** convene to: pick the next task (the Ratchet already does), re-litigate a
decision Owen made, choose between options only Owen may choose (auth, provider,
model configuration, spend, mission), or decorate work that already has a red gate
defining the answer.

## 3. Roster — voices across model families

| Slot | Mechanism | Model family | Status 2026-10-06 |
| --- | --- | --- | --- |
| V1 — in-session voice | ZCode subagent (`general-purpose`, read-only brief) | GLM-5.3-Flash (OpenRouter) | **LIVE** |
| V2 — Codex voice | `codex exec -s read-only -C <scratch>` (one-shot) | GPT-6.x (Codex OAuth) | **LIVE** (smoke: `CODEX-VOICE-OK`, 2026-10-06 16:40Z) |
| V3 — Claude voice | `claude -p "<brief>" --output-format text` (one-shot, workspace cwd, READ-ONLY instruction; no write permission is granted non-interactively) | Claude | **UNAVAILABLE** — OAuth session expired; re-auth is Owen-reserved |
| V4 — Grok voice | `grok -p "<brief>" --max-tool-rounds 1` (one-shot, workspace cwd, READ-ONLY instruction) | Grok | **UNAVAILABLE** — API key not configured; Owen-reserved |

Rules:

- A council runs with **whatever voices are live, minimum two** (one ZCode voice +
  one external voice). A single-voice "council" is not convened; the governor says
  why in the record.
- **Probe before convening**: each external voice is availability-checked once per
  session (one tiny one-shot); unavailable voices are recorded as skipped, never
  simulated. A failed voice is a routed event (Product), not a hidden one.
- External voice invocations are **read-only**: `-s read-only` for Codex, scratch
  cwd (`.local/dev-loop/scratch/`, git-ignored) for every CLI, and the brief is
  passed as the prompt. Never give a voice write access to the repository.
- Never paste credentials, `.env` content, or auth/provider/model configuration
  into a brief.

## 4. Procedure (one convening)

1. **Brief.** The governor (or a scout subagent) writes a bounded dossier into
   `.local/dev-loop/council/<ts>-brief.md`: the question in one sentence, the
   competing options, the evidence already held (with `path:line` cites), the
   invariants that bound the answer, and what is explicitly **not** decidable here
   (owner-reserved items).
2. **Voices.** Every live voice receives the same brief and answers, independently
   and without seeing the others:
   - **Position** — one sentence.
   - **Reasoning** — what in the evidence drives it.
   - **Strongest objection to its own position** — the steelman against itself.
   - **What evidence would change its mind** — falsifier, not vibes.
3. **Cross-examination.** The chair (a separate ZCode subagent, or the governor)
   sees all verdicts, identifies genuine disagreements, and may run **one** rebuttal
   round: each voice sees only the objections raised against its own position and
   responds once. Capped at one round — more is debate club, not council.
4. **Ruling.** The chair collapses the sources into a weighted conclusion:
   - the ruling, and the confidence in it;
   - **contradictions recorded verbatim**, not smoothed — if voices genuinely
     disagree and the disagreement changes the answer, the ruling says so and names
     the experiment that would decide it;
   - **"refusing to decide" is a valid ruling** when evidence is insufficient;
   - classification: `evidence-decidable` (next bounded task) vs
     `owner-decision` (routes to Owen via Commons/DECISIONS) vs
     `hypothesis` (recorded, no work authorized).
5. **Record.** Ruling goes to `.local/dev-loop/council/<ts>-ruling.md` (local,
   full fidelity). Sanitized summary goes to Commons/STATUS if material. The
   council never reports a simulated or single-voice result as a multi-model ruling.

## 5. Invocation surfaces

| Surface | Use | Mechanism |
| --- | --- | --- |
| **Saved workflow `design-council`** | interactive, full pipeline, typed report + published ruling artifact | `CreateWorkflow` `saved: { name: "design-council", args: { question, context? } }`; pin `subagent_model` to diversify the ZCode-side voice across runs |
| **`/council <question>`** | interactive, same protocol from the input box | workspace command reading this doc |
| **Unattended (cron governor)** | inside a dev-loop cycle | direct procedure of §4 via Bash CLI one-shots + subagent chair — **no workflow confirmation dialog** can block an unattended run |

The saved workflow and the direct procedure implement the same protocol; this
document is the single source of truth for both. Keep them in sync.

## 6. Standing multi-model status

Re-measure at each council convening; record date and result. Never infer a voice
is alive because this table says LIVE.

| Voice | Probe | Result |
| --- | --- | --- |
| codex (GPT-6.x) | `codex exec -s read-only "Reply OK"` 2026-10-06 16:40Z | LIVE — `CODEX-VOICE-OK` |
| claude (Claude) | `claude -p "Reply OK"` 2026-10-06 16:40Z | FAILED — "OAuth session expired and could not be refreshed" |
| grok (Grok) | `grok -p "Reply OK"` 2026-10-06 16:41Z | FAILED — "API key required" |
| ZCode GLM-5.3-Flash | this session | LIVE (the governor itself runs on it) |

## 7. Boundaries

- Council rulings do not weaken gates, change invariants, or authorize live
  provider/browser work.
- Voice transcripts with any repo content stay in `.local/`; only sanitized
  summaries are committed.
- A convened council that produced a ruling must be recorded — an unrecorded
  ruling is indistinguishable from an invented one.
- External harness CLIs are used with their **existing** logins; no key creation,
  no auth repair, no configuration writes (Owen-reserved).
