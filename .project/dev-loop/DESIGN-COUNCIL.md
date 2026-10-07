# Design council — multi-model planning and design deliberation

Status: **ACTIVE** (owner-directed, 2026-10-06; five-protocol redesign owner-directed 2026-10-07, D-20261007-009 — defaults below await Owen's confirmation)
Claim: [`../agentic-launch/claims/20261006-1641-design-council-zcode.md`](../agentic-launch/claims/20261006-1641-design-council-zcode.md)
Companions: [DEVOPS-TEAM.md](DEVOPS-TEAM.md) (provider darkness is a routing input) · [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) (live provider/model ledger) · [MODEL-SELECTION.md](MODEL-SELECTION.md) (which model answers) · [24X7-DEV-LOOP.md](24X7-DEV-LOOP.md) (the loop that convenes this council)

## 1. What the council is

A standing **mechanism**, not a standing organization: when a genuine contested
planning/design question appears, the chair (this thread, the COUNCIL lane)
selects a **protocol** (§4), convenes independent voices from **different model
families** (§3.2) with tunable participation variables (§3.1), watches five
**circuit breakers** (§6), and gets a ruling that records disagreements instead of
smoothing them. It exists because same-model, same-prompt reviewers share blind
spots; cross-family voices do not, and several models behind one provider share a
failure mode.

Outputs are **hypotheses and recommendations, never authority**. A council ruling
ranks changes by value-per-risk, names what is contested, and says what evidence
would settle it — it does not authorize work, change an invariant, or decide an
owner-reserved question. No protocol changes that, least of all VOTE (§4.4).
Authority boundaries live in `AGENTS.md`, `META-TRACKER.md §0` and
`../deliverables/D1-START-HERE.md`.

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
defining the answer. Those are **ABSTAIN-and-queue** (router row 4, §5), not a ruling.

## 3. Runtime

### 3.1 Participation variables (tunable per convening)

| Variable | Meaning | Proposed default | Notes |
| --- | --- | --- | --- |
| `#models` | how many distinct models answer | **3** | Same-family extras may fill this; they add breadth, never independence. |
| `#providers` | how many **independent providers** answer | **2** (live-provider floor; see §6 QUORUM-LOSS) | Diversity is measured in providers. Several models behind one provider share a failure mode. |
| `#concurrent` | same-prompt parallel width | **3** | Same as `#models` at the default; lower it when rate limits bite. |
| `#challenge-prompt` | enable the adversarial second pass (CHALLENGE, §4.2) | **on** for contested routing | Off for routine PANELs. |
| `#rounds` | round-robin depth; **1 rebuttal is the default floor** | **2** (PANEL + 1 rebuttal) | Rounds beyond the cap are a LOOP-BREAKER trip (§6). |
| `#supermajority` | VOTE threshold (§4.5) | **2/3** | Of voices that vote; abstainers count toward the denominator but not the numerator. |

Defaults are a **recommendation awaiting Owen's confirmation** (owner directive
D-20261007-009 asked for exactly this set). Until confirmed they are the chair's
working defaults.

### 3.2 Voices, families, and diversity accounting

Voice mechanisms (read-only, scratch cwd `.local/dev-loop/scratch/`, git-ignored):

| Slot | Mechanism | Family id |
| --- | --- | --- |
| V1 — in-session voice | ZCode subagent (`general-purpose`, read-only brief) | `session` (whatever the thread model is — see §3.3) |
| V2 — Codex voice | `codex.cmd exec -s read-only -C <scratch> "<brief>"` | `codex` (ChatGPT Codex account) |
| V3 — Claude voice | `.local/dev-loop/claude-voice.mjs <brief> [model]` — authorized proxy route, key read-only in memory | `claude` (Claude Code OAuth) |
| V4 — Grok voice | `grok.cmd -p "<brief>" --max-tool-rounds 1` | `grok` |

Third-family reserve rung (free routes, added to the known-live reserve in D-20261007-009;
family ids from the provider routes in [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) §4):
`new-provider`/`space-bunny-free` → family `opencode`; `opencode-acct-2..5` → same family
`opencode`; `openrouter/auto` → family `openrouter`.

Diversity rules:

- **Quorum counts families, not models.** A ruling needs at least **two distinct family ids**
  among its answering voices (§6 QUORUM-LOSS). `claude-opus-5-5` + `claude-sonnet-5-5` is **one**
  family.
- **Extra models on one family add breadth, never independence.** For a PANEL they can widen the
  position spread (same blind spots, different samples). For CHALLENGE they add attack angles. For
  JUDGE they add **nothing** unless the judge is a different family from the whole panel — otherwise
  the judge is reviewing its own family's reasoning.
- **The thread's own session model** (V1 when the in-session subagent runs on it) takes the family
  of its provider: a GPT session (`codex-oauth/...`) and the Codex CLI are **one** family; a Claude
  session and the Claude proxy voice are **one** family. It counts only when the harness exposes
  its identity; the record must name the observed model, never a remembered one. Earlier council
  records labeled the session Claude; this thread was later observed on `codex-oauth/gpt-6.1-sol`,
  so those records' family counts are unverified provenance.
- **Provider darkness is a routing input.** Read the dark list in
  [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) §1a before convening; a dark provider's
  voices are excluded, and the chair's own failed calls during a convening are reported to CoS so
  DEVops can update that list.

### 3.3 Model choice within a family

Which model answers is governed by [MODEL-SELECTION.md](MODEL-SELECTION.md) (owner ladder,
generation-PASS only, class floors, mandatory `model-selection:` line). The family id comes from
the provider route, not the model name. Never repair, reorder or write auth/provider/model
configuration to make a voice available — report it to CoS.

## 4. The five protocols

Every protocol: the chair writes the brief, every voice answers the **same brief** with
**Position / Reasoning / Strongest self-objection / Falsifier**, and the full transcript is recorded.
A ruling is never reported as multi-model unless ≥2 families answered (§6).

### 4.1 PANEL — position spread

One question, `#models` independent answers, **no cross-talk**. Output: the set of distinct
positions, how sharply they split, and the evidence each rests on. Default for routine questions.
Confidence comes from agreement across families; unanimity among one family is not agreement.

### 4.2 CHALLENGE — what consensus missed

Each voice sees the others' answers and attacks the **weakest claim** in each (one attack, one
response — the `#challenge-prompt`). Output: which consensus collapses under scrutiny and which
survives. Default second pass for contested questions (`#challenge-prompt` on). Still capped at
`#rounds`.

### 4.3 ROUND-ROBIN — convergence

Sequential: voice 1 answers, voice 2 sees voice 1, voice 3 sees both; each takes **one position**.
Output: does the position converge as priors accumulate? Record where it moved and why.

### 4.4 VOTE — confidence, not authority

Every model votes **yes / no / abstain** on the proposed ruling. The tally sets the ruling's
**confidence** (`high` at or above supermajority of non-abstain, `low` at or below 1/3,
`medium` otherwise) and **nothing else**. VOTE cannot grant authority, authorize work, change an
invariant, or satisfy a gate: the ruling remains a recommendation routed to the DEV lane or CoS.
A supermajority on a contested semantic question is recorded as *the panel was confident*, never
as *the question is settled*.

### 4.5 JUDGE — one voice rules

One model **not in the panel** (prefer a different family) reads everything, including raw
contradictions, and rules. The ruling is the judge's, with every contradiction recorded verbatim and
the panel's spread preserved beside it. A judge that cannot decide records **"refusing to decide"**
as its ruling.

## 5. Protocol router

The chair picks the protocol by **stakes**, read from the question, not from how much time is left:

| Stakes | Protocol(s) | Why |
| --- | --- | --- |
| **Routine** — one defensible reading; a red gate or the spec already implies the answer | **PANEL** alone | Cheap; the point is to catch blind spots, not to stage a debate. |
| **Contested** — two or more defensible answers, or a disagreement between workers | **PANEL + CHALLENGE** | The disagreement itself is the object; attack it before ruling. |
| **Real dispute** — workers still disagree after challenge, or a ranking/architecture choice with wide blast radius | **ROUND-ROBIN + JUDGE** | Convergence and a disinterested ruling beat one more opinion. |
| **Owner-reserved ground** — auth, provider/model config, spend, mission, invariants | **ABSTAIN** — no ruling; queue for Owen via CoS | The council has no standing to decide these. |

Router discipline:

- **R0 (owner-reserved test) runs first.** If any point of the question touches the reserved list,
  the whole ruling is ABSTAIN. A question with one owner-reserved corner is owner-reserved.
- **The common failure is misgrading stakes.** Calling a contested question "routine" because it
  looks small is how the council rubber-stamps. When unsure, grade one level up: grading too high
  costs one extra round; grading too low lets an unchallenged answer through as a ruling. Record
  the stakes grade and the reason in the ruling.
- **Dark families route first.** If fewer than two families are live for the graded protocol, see
  §6 QUORUM-LOSS (block or wait for DEVops), do not silently downgrade to a single family.

## 6. Circuit breakers (abort, do not grind)

Five breakers abort a ruling before it wastes the thread. A tripped breaker is **recorded in the
ruling file and reported to CoS** — a blocked quorum is a routed event, not a hidden one.

| Breaker | Trips when | Action |
| --- | --- | --- |
| **QUORUM-LOSS** | fewer than **two live independent families** for the chosen protocol | **BLOCKED**, no ruling. Record every voice tried and its error. Wait or request a reserve rung (§3.2); never rule single-family and never call it multi-model. |
| **CONVERGENCE** | a PANEL is **unanimous on a high-stakes question** (real-dispute grade or above) | **Escalate**, never rubber-stamp: run CHALLENGE (or ROUND-ROBIN+JUDGE) before ruling, or record that the ruling rests on unanimous-but-unverified agreement. |
| **LOOP-BREAKER** | **three** rounds with **no change** in any voice's position (including `#rounds` beyond the cap) | **STOP**: the council is stuck, not converging. Rule with the spread as-is and name the decider experiment, or record "refusing to decide". |
| **DRIFT** | a voice answers **outside the brief's constraints** (touches owner-reserved ground, ignores the question, invents evidence) | **Drop that voice's answer**, record the drop and the reason; recompute quorum with the remaining families. Two drifts from one voice → drop the voice. |
| **COST/TIME** | hard ceiling exceeded — default: **> `#models` + 3 voice calls** for one ruling (PANEL+CHALLENGE), or **> 5 minutes** wall time | **STOP** and rule with what is in hand, recording that the ceiling was hit; if quorum is also lost, BLOCKED. Raise the ceiling only with a recorded reason. |

## 7. Procedure (one convening)

1. **Grade.** Router (§5): stakes grade + protocol(s) + variables (§3.1). Record it.
2. **Brief.** The chair writes a bounded dossier into `.local/dev-loop/council/<ts>-brief.md`: the
   question in one sentence, the competing options, the evidence already held (with `path:line`
   cites), the invariants that bound the answer, and what is explicitly **not** decidable here
   (owner-reserved items).
3. **Voices.** Every live voice receives the same brief and answers independently (§3.2, §4).
   Record each voice's family id and `model-selection:` line. Never paste credentials, `.env`
   content, or auth/provider/model configuration into a brief.
4. **Cross-examination.** Per protocol: CHALLENGE attacks, ROUND-ROBIN reveals priors, or one
   rebuttal round in PANEL. Capped at `#rounds`; the chair may run **at most one** rebuttal round by
   default — more is debate club, not council.
5. **Ruling.** The chair collapses the sources into a weighted conclusion:
   - the ruling, and the confidence in it (`high` / `medium` / `low` / `refused`);
   - **contradictions recorded verbatim**, not smoothed — if voices genuinely
     disagree and the disagreement changes the answer, the ruling says so and names
     the experiment that would decide it;
   - **"refusing to decide" is a valid ruling** when evidence is insufficient;
   - classification: `evidence-decidable` (next bounded task) vs
     `owner-decision` (routes to Owen via Commons/DECISIONS) vs
     `hypothesis` (recorded, no work authorized).
6. **Breakers.** Any breaker that tripped is named in the ruling and reported to CoS.
7. **Record.** Full transcript + ruling go to `.local/dev-loop/council/<ts>-ruling.md` (local, full
   fidelity; transcripts with repo content never leave `.local/`). Sanitized summary (ruling,
   confidence, classification, contradictions, decider, voices heard/skipped with families) goes to
   the DESK reply; a Commons/STATUS row only when material.

## 8. Invocation surfaces

| Surface | Use | Mechanism |
| --- | --- | --- |
| **This thread's DESK directive** | the standing unattended path (the COUNCIL lane automation + inbox watcher) | direct procedure of §7 via Bash CLI/proxy one-shots + subagent chair — no confirmation dialog can block an unattended run |
| **Saved workflow `design-council`** | interactive, full pipeline, typed report + published ruling artifact | `CreateWorkflow` `saved: { name: "design-council", args: { question, context? } }`; pin `subagent_model` to diversify the ZCode-side voice across runs |
| **`/council <question>`** | interactive, same protocol from the input box | workspace command reading this doc |

This document is the single source of truth. **Sync status (2026-10-07):** the DESK direct
procedure and `/council` follow the five-protocol design; the saved workflow `design-council`
still implements the earlier single procedure (independent voices + one rebuttal + chair ruling,
roughly PANEL with a JUDGE-style chair) and has no router or breakers. Until it is updated, use it
only for routine-graded questions and apply §5–§6 by hand.

## 9. Standing multi-model status

Re-measure at each council convening; record date and result. Never infer a voice is
alive because this table says LIVE.

| Voice / family | Mechanism | Last measured | Result |
| --- | --- | --- | --- |
| `session` (in-session subagent) | ZCode subagent, read-only brief | harness-exposed identity, per run | LIVE while the thread model answers; record the observed model, never a remembered one |
| `codex` (GPT) | `codex.cmd exec -s read-only "Reply OK"` | 2026-10-07 ~11:5xZ | **DARK** — "You've hit your usage limit … try again at 4:08 PM" (chatgpt Codex account cap; distinct from the `codex-oauth` API route, which is separate and PASS in the ledger) |
| `claude` (Claude) | `.local/dev-loop/claude-voice.mjs -t "Reply OK" [model]` | 2026-10-07 ~11:5xZ | **DARK (429)** — proxy rate_limit_error: credentials cooling down for both `claude-opus-5-5` and `claude-sonnet-5-5` at the moment of a real panel. The `claude -p` CLI remains broken (OAuth expired, Owen-reserved). |
| `grok` | `grok.cmd -p "Reply OK" --max-tool-rounds 1` | 2026-10-07 09:43Z | **UNAVAILABLE** — "API key required"; proxy serves no grok models (Owen-reserved) |
| `opencode` (free reserve) | `new-provider` / `opencode-acct-2..5` `space-bunny-free` | 2026-10-07 09:43Z (ledger) | PASS at last probe; not yet exercised as a council voice |
| `openrouter` (free reserve) | `openrouter/auto` | 2026-10-07 09:43Z (ledger) | PASS at last probe; not yet exercised as a council voice |

Quorum status: **DARK below two families** as of 2026-10-07 ~11:5xZ (see §6 QUORUM-LOSS; a
convening attempted in that window is BLOCKED, not single-family). The ledger
[PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) is the authority on what is live; this
table is the chair's last measurement, not a standing promise.

## 10. Boundaries

- Council rulings do not weaken gates, change invariants, or authorize live
  provider/browser work. VOTE cannot (see §4.4).
- Voice transcripts with any repo content stay in `.local/`; only sanitized
  summaries are committed.
- A convened council that produced a ruling must be recorded — an unrecorded
  ruling is indistinguishable from an invented one. Same for a tripped breaker.
- External harness CLIs and the authorized proxy route are used with their **existing**
  logins; no key creation, no auth repair, no configuration writes (Owen-reserved).
- Defaults in §3.1 are a recommendation until Owen confirms them; no protocol makes
  them permanent.