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
| V1 — in-session voice | ZCode subagent (`general-purpose`, read-only brief) | `session` (whatever the thread model is — see §3.2) |
| V2 — Codex voice | `codex.cmd exec -s read-only -C <scratch> "<brief>"` | `codex` (ChatGPT Codex account) |
| V3 — Claude voice | `node .local/dev-loop/claude-voice.mjs <brief> [model]` — authorized proxy route, key read-only in memory | `claude` (Claude Code OAuth) |
| V4 — Grok voice | `node .local/dev-loop/grok-voice.mjs <brief> [model]` — proxy route (LIVE, D-20261007-011); the `grok` CLI is not a voice route | `grok` (grok-build-oauth) |

**Primary lanes since 2026-10-09 (owner directive, relayed as D-20261009-015).** Every lane,
council voices included, moves to model `space-bunny-free`, each on a different opencode account
(chair: `opencode-acct-5`; second voice: `new-provider`). Owen selects the thread model in the
ZCode UI; the council never re-pins anything. The accounts are reached with
`node .local/dev-loop/reserve-voice.mjs <brief> <account> [model]`:

| Account | Endpoint | Tier | Family |
| --- | --- | --- | --- |
| `opencode-acct-5` (chair), `new-provider` (second voice), `opencode-acct-2` … `opencode-acct-4` | localhost:6446, `space-bunny-free` | **primary** | **`space-bunny`** — all accounts are **one** family |
| `openrouter` | openrouter.ai, `openrouter/auto` | reserve | `openrouter(<routed model>)` — the routed model's family, as reported by the response |

#### 3.2a What independence means now, and the quorum rule (D-20261009-015)

- **Distinct credentials on one model are breadth, not independence.** Five accounts on
  `space-bunny-free` are five samples of **one** model: same weights, same training, same blind
  spots. Separate accounts remove shared rate limits and shared session state; they do not
  remove shared reasoning errors. Every primary-lane voice is recorded with
  `independence=none`.
- **Independence requires a different model family.** Quorum means at least **two distinct model
  families** among the answering voices, as before. `space-bunny` is one family no matter how
  many accounts answer, so the primary lanes on their own contribute **one** family.
- **The reserve tier never satisfies quorum.** `openrouter` (and any future reserve route)
  adds breadth only, even when its routed model is a different family. This rule is unchanged.
- **A true second family** today could only come from a CPA family (GPT, Claude, Grok) running
  as a council voice. The owner directive moves every lane to `space-bunny-free`, so using a CPA
  voice as the second family is an **owner decision**, queued for Owen via CoS. The council
  does not reintroduce it by itself.
- **Choice, as amended by owner exception (D-20261009-004, 2026-10-09): the council produces a
  ruling from two answering voices, labelled an exception.** The definition above is unchanged and
  stays visible: quorum is two distinct model families. What the owner exception changes is the
  **outcome** while no second family is routable — see §3.2b. In the default configuration without
  that exception the record carries `quorum: unavailable (one family: space-bunny)` and the
  convening ends BLOCKED by §6 QUORUM-LOSS.
- **The definition and the family accounting are never changed by this.** §3.2a and the route-line
  `independence=none` marker stand; only the recorded outcome moves, and only under the dated,
  expiring exception in §3.2b.
- **The two-voice requirement is never relaxed.** The exception lowers the *family* requirement
  only; a convening with fewer than **two answering voices** still blocks (§6 QUORUM-LOSS).

#### 3.2b Owner-granted single-family exception (D-20261009-004, 2026-10-09) — OPEN

Recorded as an **exception to the outcome rule, not a change to the quorum definition.**

- **Owner decision, 2026-10-09.** Both council voices run on the family the council already uses:
  chair on `opencode-acct-5` (router role `reason`), challenger/reviewer on `new-provider` (role
  `review`), both model `space-bunny-free`. Reason given: **routing repair in progress, so no
  genuine second family is available.**
- **What stays.** §3.2a's definition is intact and visible: quorum is at least **two distinct
  model families**. `independence=none` stays on every primary route line. No ruling may be
  labelled multi-model or claim independence.
- **What changes — the outcome.** A convening with **two or more answering voices** produces a
  ruling instead of a block, labelled verbatim:

  ```text
  quorum: OWNER-EXCEPTION (single family, space-bunny) - not independently corroborated
  ```

- **Confidence stays honest.** Default confidence under this exception is capped at **low**, and
  the ruling states plainly that **two copies of one model agreeing is not independent
  corroboration**. A reviewer may still record `refused`, or the chair may set `medium` only by
  naming what independent evidence (a test, a measurement, a source outside both lanes) supports
  it; `high` is unavailable under this exception.
- **Two answering voices are still required.** The exception relaxes the *family* requirement
  only. Fewer than two answering voices → BLOCKED by §6 QUORUM-LOSS. CONVERGENCE, DRIFT,
  LOOP-BREAKER and COST/TIME are unchanged.
- **Expiry condition — status OPEN.** The exception **lapses automatically the moment routing is
  repaired and a second model family is live**. When that happens, §3.2a governs again with no
  further decision: every convenience is either genuinely two-family (normal ruling) or blocked.
  Register: `quorum-exception-2026-10-09` · status **OPEN** · lapses when **"routing repaired and
  second family live"** · chair confirms at each convening and reports the lapse to CoS so this
  cannot quietly become permanent.

Reserve rules:

- **The reserve tier never satisfies quorum.** Neither does the primary `space-bunny` family on
  its own (§3.2a). A ruling with one counted family plus any number of primary or reserve
  voices is BLOCKED.
- **It is valid for breadth.** Five space-bunny accounts give five concurrent answers from **one**
  family. Record each as `family=space-bunny account=<acct>` so the chair never mistakes volume for
  independence.
- **It is a fallback, not a first choice.** When a CPA voice is blocked, re-ask the router first
  (it already excludes cooled and unroutable ids). Only if no CPA id is left for that slot, use a
  reserve voice and label it `tier=reserve` in the record.

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

### 3.3 Model choice within a family — the router entrypoint

Voice **selection** goes through one entrypoint, not hand-picked ids and not a hand-maintained
dark list (owner directive, D-20261007-011):

```sh
node ~/.agents/skills/cliproxy-router/cliproxy.mjs resolve <role> --probe --project C:/0-BlackBoxProject-0/VOMEGA
node ~/.agents/skills/cliproxy-router/cliproxy.mjs route reason --project C:/0-BlackBoxProject-0/VOMEGA
node ~/.agents/skills/cliproxy-router/cliproxy.mjs route review --project C:/0-BlackBoxProject-0/VOMEGA
```

- **Lane roles resolve through `resolve <role>`** (D-20261009-003; the entrypoint was repaired
  2026-10-09 and is live). Roles `build` / `ops` / `pm` / `reason` / `review` map to the five
  space-bunny lanes with an automatic fallback ladder; `reason` = `opencode-acct-5` (chair),
  `review` = `new-provider` (challenger). The `route` calls above remain for CPA-family selection.
- **The five lanes are ONE model family, and upstream isolation between them is UNVERIFIED**
  (D-20261009-003). Resolving a different role buys **breadth, never independence**; the council
  does not assume the lanes are isolated from each other upstream, so their agreement is not
  treated as independent of itself. This does not change the quorum rule (c6ab55e stands).

- `reason` for analysis voices (panel, round-robin, judge); `review` for the challenger. The
  router decides; it drops what is unroutable or in cooldown, so its selection **is** the
  availability measurement and the hand-kept dark list is no longer the council's input.
- **Independence overrides the router.** A ruling needs two *independent* families, so when the
  router's pick would leave the panel single-family, the chair passes an **explicit model id** to
  the family helper and records that it overrode the router and why. An override is a routing
  decision, not a silent one.
- Every ruling carries one line per voice (two tiers; D-20261007-012):

  ```text
  route: tier=cpa profile=<reason|review> id=<model> provider=<provider> family=<gpt|claude|grok> explicit=<yes|no> why=<router why | override reason>
  route: tier=reserve id=<model> provider=<account> family=<space-bunny|openrouter(<model>)> explicit=yes why=<which CPA voice was blocked>
  route: tier=primary id=space-bunny-free provider=<opencode-acct-5|new-provider|opencode-acct-N> family=space-bunny independence=none explicit=yes why=<chair|second voice|breadth>
  ```

  Every `tier=primary` line carries `independence=none` (§3.2a). Worked example (2026-10-09):
  `route: tier=primary id=space-bunny-free provider=opencode-acct-5 family=space-bunny independence=none explicit=yes why=chair` ·
  `route: tier=primary id=space-bunny-free provider=new-provider family=space-bunny independence=none explicit=yes why=second voice`.

  Worked examples (2026-10-07 ~14:5xZ):
  `route: tier=cpa profile=reason id=gpt-6-sol provider=codex-oauth family=gpt explicit=no why=prefer sol` ·
  `route: tier=cpa profile=reason id=grok-4.7 provider=grok-build-oauth family=grok explicit=yes why=independence; no grok candidate in the router profiles` ·
  `route: tier=reserve id=space-bunny-free provider=new-provider family=space-bunny explicit=yes why=claude family blocked (429)`.
- **Never repair** `config.yaml`, auth files or provider configuration to make a voice available
  (Owen-reserved). Report it to CoS.

Transport per family: GPT through `codex.cmd exec -s read-only -C <scratch>`; Claude and Grok
through the proxy helpers `.local/dev-loop/claude-voice.mjs` / `.local/dev-loop/grok-voice.mjs`,
which resolve the key read-only in memory and never print it. Which model a helper gets comes from
the router (or an explicit override), not from a fixed list.

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
| **QUORUM-LOSS** | fewer than **two answering voices**, **or** fewer than **two live independent families** with no §3.2b owner exception in force | **BLOCKED**, no ruling. Record every voice tried and its error. Under the §3.2b exception, two answering voices on one family do **not** trip this breaker, but the ruling is labelled `quorum: OWNER-EXCEPTION (single family, space-bunny) - not independently corroborated` with confidence capped at low. Never call any such ruling multi-model. |
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

## 7a. Owner-ratified semantics decisions (record, not authority)

The council records owner decisions that change semantics it depends on, so a later convening cites
the decision instead of a memory. Recording is not enforcement: the implementing gate is DEV's, and
the council never edits gates or product code.

### 7a.1 Trailing text after a held route — option A, 2026-10-09 (D-20261009-005)

- **Owner decision: option A is APPROVED.** After a held route resolves, a command is READY **only
  if the unquoted remainder is empty**.
- **The three courtesy forms are REVOKED** as exemptions: `and say thanks`, `, thanks` and
  `, please` are now trailing text like any other, so they yield NEEDS-INFO rather than READY. The
  earlier rule from the D-014 ruling (remainder empty **or** exactly one of those three forms)
  no longer holds anywhere.
- **Trade-off accepted:** **ask rather than guess.** Over-refusal is the permitted failure
  direction; under-acceptance (silently guessing at the operator's intent from trailing text) is
  the forbidden one. The cost is extra clarification rounds on polite phrasings; that cost is
  accepted on purpose.
- **Who implements it:** DEV rewrites the affected gate **stricter** — not weakened, not renamed —
  records this owner decision as the reason, and states the accepted over-refusal set. The council
  does not touch the gate.
- **Council surfaces unchanged.** The saved workflow `design-council` and the route-line template
  (§3.3) carry no trailing-text courtesy logic, so neither needs a change from this decision.

## 8. Invocation surfaces

| Surface | Use | Mechanism |
| --- | --- | --- |
| **This thread's DESK directive** | the standing unattended path (the COUNCIL lane automation + inbox watcher) | direct procedure of §7 via Bash CLI/proxy one-shots + subagent chair — no confirmation dialog can block an unattended run |
| **Saved workflow `design-council`** | interactive, full pipeline, typed report + published ruling artifact | `CreateWorkflow` `saved: { name: "design-council", args: { question, context?, stakes? } }`; `stakes` overrides the scout's grade (`routine` / `contested` / `dispute`) |
| **`/council <question>`** | interactive, same protocol from the input box | workspace command reading this doc |

This document is the single source of truth. **Sync status (2026-10-07, D-20261007-12162):** the
DESK direct procedure, `/council` and the saved workflow `design-council` all follow the
five-protocol design. The workflow implements: the owner-reserved ABSTAIN test first; the stakes
router (PANEL / PANEL+CHALLENGE / ROUND-ROBIN+JUDGE); QUORUM-LOSS (counts provider families, and
never counts the in-session voice, whose provider the script cannot see); DRIFT (chair flags
drifted voices, quorum recomputed); CONVERGENCE (unanimous on a dispute caps confidence at
medium); COST/TIME as a voice-call ceiling of `#models`+3 = 6; the Claude voice through the
authorized proxy with one fallback rung (`claude-opus-5-5` → `claude-sonnet-5-5`); Grok through the
proxy helper on `grok-4.7`; and the router entrypoint (§3.3) asked for `reason` and `review` before the
voices, with every voice's `route:` line (router pick or explicit override, and why) written into the
ruling record (D-20261007-011); and the reserve fallback (D-20261008-013): every voice dispatch goes
through one `askSlot`, so in every round a blocked CPA voice re-asks the router once, tries an
untried in-family id the router offers (Claude/Grok proxy helpers only), and otherwise falls back to
one `reserve-voice.mjs` call labelled `tier=reserve family=space-bunny|openrouter(<model>)`. Quorum
counts only `tier=cpa` families, so a reserve voice can never satisfy it. **Not in the workflow:** VOTE (the router never
selects it), a wall-clock limit (a workflow cannot read the clock), and LOOP-BREAKER (cannot trip at
`#rounds` 2). Verification so far: typechecked locally against the workflow API with a planted-error
control, and its metadata parses; it has **not** been run, so its first interactive use is its
first real test.

## 9. Standing multi-model status

Re-measure at each council convening; record date and result. Never infer a voice is
alive because this table says LIVE.

| Voice / family | Mechanism | Last measured | Result |
| --- | --- | --- | --- |
| `session` (in-session subagent) | ZCode subagent, read-only brief | harness-exposed identity, per run | LIVE while the thread model answers; record the observed model, never a remembered one |
| `codex` (GPT) | the D-009 panel brief, then `codex.cmd exec -s read-only "Reply OK"` | 2026-10-07 11:52–11:55Z dark; re-probed ~14:5xZ | **LIVE again** — `CODEX-VOICE-OK` on the re-probe after the ~4:08 PM local cap window. Router `status` still lists `gpt-6.1-sol` cooled for quota with ~32m remaining; the CLI resolves to `gpt-6.1-sol`, provider openai. Distinct from the `codex-oauth` API route. |
| `claude` (Claude) | the D-009 panel brief via `.local/dev-loop/claude-voice.mjs`, `claude-opus-5-5` then `claude-sonnet-5-5` | dark 2026-10-07 11:52Z–~14:5xZ; re-probed 2026-10-08 ~00:3xZ | **LIVE again** — `claude-opus-5-5` answered through the proxy (D-013 dry run; selection line now reports ladder-pos=1). Was DARK (429 on every rung) through the 2026-10-07 afternoon. The `claude -p` CLI remains broken (OAuth expired, Owen-reserved). |
| `grok` (Grok) | `node .local/dev-loop/grok-voice.mjs -t "Reply OK" <model>`; router `cliproxy.mjs status` catalog | 2026-10-07 ~14:5xZ | **LIVE via the proxy (CPA)** — `grok-4.7` answered through `grok-build-oauth` on 127.0.0.1:8317 (HTTP 200). The `grok` CLI itself is still broken ("API key required"); the CLI is not a voice route. Catalog holds ~18 grok ids (`grok-4.7`, `grok-4.6`, `grok-4.3`, `grok-4.5`, `grok-3-mini`, `grok-4.20-*`, image/video ids excluded). |
| `space-bunny` (reserve tier) | `node .local/dev-loop/reserve-voice.mjs -t "Reply OK" new-provider` | 2026-10-07 ~14:5xZ | **LIVE** — `RESERVE-VOICE-OK` on `new-provider`. Other four accounts not separately probed. **Never counts toward quorum.** |
| `openrouter` (reserve tier) | `openrouter/auto` | 2026-10-07 09:43Z (ledger) | PASS at last ledger probe; not yet exercised as a council voice. **Never counts toward quorum.** |

**Quorum verdict (2026-10-09): OWNER EXCEPTION IN FORCE.** The council's lanes are the
`space-bunny-free` primary accounts, one family (§3.2a); the definition of quorum is still two
distinct model families. Under §3.2b (owner decision 2026-10-09, reason: routing repair in
progress) a convening with **two or more answering voices** produces a ruling labelled
`quorum: OWNER-EXCEPTION (single family, space-bunny) - not independently corroborated`, with
confidence capped at **low**. Fewer than two answering voices still blocks. Exception
`quorum-exception-2026-10-09` is **OPEN** and lapses automatically when routing is repaired and a
second model family is live. **Router entrypoint repaired 2026-10-09** (D-20261009-003): lane
roles resolve through `resolve <role>`; upstream isolation between the five lanes is unverified.

**Earlier verdict (D-20261009-015, superseded on outcome only):** every convening recorded
`quorum: unavailable` and ended BLOCKED by §6 QUORUM-LOSS while no owner exception existed.

**Previous quorum verdict:** MET on GPT + Grok at 2026-10-07 ~14:5xZ (Claude then DARK). Claude answered again
at 2026-10-08 ~00:3xZ, so three CPA families were candidates at that point; GPT and Grok were not
re-probed in that pass. **Router entrypoint broken since 2026-10-08 01:00 local:** `cliproxy.mjs`
imports a missing `~/.agents/skills/model-profile.mjs` (ERR_MODULE_NOT_FOUND). The workflow degrades
safely (router pick reads as unknown, fallback goes straight to the reserve voice), but router-based
selection is unavailable until the skill owner fixes it; reported, not repaired. The reserve tier
(`space-bunny` LIVE) adds breadth but cannot replace a missing CPA family. A convening that reaches only one CPA family is BLOCKED by §6
QUORUM-LOSS. Re-measure with the router entrypoint (§3.3) at each convening; never trust a relayed
claim. The ledger
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