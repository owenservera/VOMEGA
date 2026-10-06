# 24/7 development loop — governor + dev team

Status: **ACTIVE** (owner-directed, 2026-10-06; re-cadenced same day from hourly to a continuous drain)
Governor: the ZCode main session ("governor") that runs this loop.
Cadence: **every 10 minutes**; each run drains up to **8 governed cycles back-to-back**, pipelines the reviewer, and ends early only when no real bounded work remains. Owner direction: the team is never left idle while claimable work exists.
Claim: [`../agentic-launch/claims/20261006-1617-devloop-24x7-zcode.md`](../agentic-launch/claims/20261006-1617-devloop-24x7-zcode.md) (setup) · council: [`../agentic-launch/claims/20261006-1641-design-council-zcode.md`](../agentic-launch/claims/20261006-1641-design-council-zcode.md)

This file is the reconstructable record of the loop: what it is, who is on the team,
what each cycle must do, and the boundaries it must not cross. If the automation is
lost (new machine, cleared workspace), recreate it from §6 and this file.

## 1. What this loop is

A recurring ZCode automation fires on a fixed interval. Each run is one **governed
cycle**: the governor checks real state, verifies the dev team is launched and
running, routes events, and drives **one bounded Ratchet red→green cycle** through
the team. It is not a standing organization — the team exists only inside a run and
leaves its state in Git, Ratchet, STATUS and Commons.

Design constraints taken from the project (not invented here):

- `AGENTS.md`: claim bounded work before editing; disjoint write surfaces; code
  changes need a reviewer who did not write them; route events (Coordination /
  Research / Product / Truth); never infer a worker is alive from a document.
- `.project/ratchet/OPERATING.md`: one implementation worker holds one active task
  claim; stop after one bounded red→green cycle; never weaken a gate; hand off via
  the ratchet.
- `../agentic-launch/STATUS.md`: historical lanes/prompts/manifests are archived —
  **do not recreate them as a standing organization.** This loop is a mechanism, not
  a roster resurrection.

## 2. Team roster (per cycle, launched fresh)

| Slot | ZCode subagent | Role | Write surface |
| --- | --- | --- | --- |
| GOV | governor session itself | state check, routing, arbitration, evidence discipline, close-out | `.project/agentic-launch/**`, `.project/COMMONS.md`, `.project/dev-loop/**` |
| IMPL | `fixer` (or `general-purpose`) | one bounded red→green cycle on the packet's task | exactly the packet's write surface |
| TRV | `verifier` (or a second `general-purpose`) | independent review of the cycle; must not have written the change | read-only + `ratchet review` |

Rules:

- IMPL and TRV are **separate subagent invocations with separate contexts**. A
  reviewer that promoted or claimed the task is rejected by the tool — keep it that
  way in fact, not just label.
- Review by a subagent is **automated review, not independent human review**. Every
  record this loop writes must say so explicitly. The review-hold slice (MP-21 P1–P3)
  still needs a human/independent reviewer; this loop does not satisfy that.
- Capacity beyond one disjoint cycle goes to: regressions first, then independent
  review of held work, then failure reproduction. Do not manufacture planning work
  to keep agents busy (`ratchet/OPERATING.md`).

## 3. Governor duties (every cycle, in order)

0. **Stampede guard.** If `.local/dev-loop/governor.lock` exists and was modified in
   the last 20 minutes, another governor run is likely active — exit immediately
   with a one-line report. Otherwise take the lock (run id + UTC timestamp) and
   remove it in the final step, even on failure.
1. **Checkout truth.** Record local `HEAD`; `git fetch origin`; fast-forward a clean
   checkout that is behind; if dirty or diverged, preserve work and surface it —
   never reset/pull over someone else's changes.
2. **Read real state.** `bun run ratchet status` (probe if stale), `ratchet next`,
   active claims in `.project/agentic-launch/claims/`, last cycle's closeout. Do not
   trust any agent's claimed aliveness; read evidence and timestamps.
3. **Verify the team is launched and running — the never-idle rule.** Each run
   drains up to 8 governed cycles back-to-back; while IMPL of cycle N+1 starts, TRV
   reviews cycle N's committed diff (pipeline — no agent sits idle waiting). A run
   that governs without launching the team is a failed run. The only legitimate
   idle: no claimable task AND no real review/hardening/harvest/failure-reproduction
   work remains — recorded factually, never padded with manufactured planning work.
4. **Route events** per AGENTS.md: new objectives → Coordination (Commons); research
   questions → Research; implementation/setup failures → Product; verification gaps
   or failed checks → Truth **and** Product. Record request, owner, evidence, next
   action in Commons.
5. **Drive one bounded cycle** (§4), then immediately the next.
6. **Convene the council** ([DESIGN-COUNCIL.md](DESIGN-COUNCIL.md)) when a cycle
   uncovers a genuine contested design question — not on every task.
7. **Close out**: truthful closeout in the cycle record; update STATUS/Commons on
   material outcomes; leave a reconstructable handoff.

## 4. One bounded cycle

```sh
cd omega-baseline
bun run ratchet next                          # packet = default context
bun run ratchet claim <TASK> --by gov-impl-<n>   # 4h lease
bun run ratchet verify <TASK>                 # raw truth; exit 0 iff green
# … IMPL implements inside the packet write surface …
bun run ratchet promote --task <TASK> --by gov-impl-<n>
bun run ratchet sync
git add -A && git commit -m "D1-xxx: <what>"
bun run ratchet review <TASK> --by gov-trv-<n>   # TRV, never IMPL's label
```

- One task per cycle. If the cycle finishes early, stop — the next run picks up the
  next frontier task.
- Regressions outrank new frontier work: if a promoted gate went red, `next` hands
  it out first; IMPL fixes the regression before any new task.
- Never weaken, skip or delete a gate to pass it. A wrong gate changes in its own
  commit with the reason in the message, and expects `SPEC_CHANGED` re-review.
- Fixture/simulated results are never reported as live. Local evidence logs stay in
  ignored `.local/`; only sanitized summaries are committed.
- Stop conditions (surface, do not work around): live provider/browser action,
  auth/provider/model configuration, unresolved owner decision, destructive history,
  weakening an invariant/proof boundary, representing simulated behavior as live.

## 5. What this loop must not do

- Do not touch auth, credentials, provider or model configuration, spend or
  subscriptions.
- Do not recreate archived lanes, model routing, prompts, handoffs or launch
  manifests as standing entities.
- Do not claim a human reviewed anything a subagent reviewed.
- Do not run unbounded/background-heavy subagents on this machine's evidence: the
  measured harness note is that unbounded heavy background subagents stall and
  bounded workers complete — keep each subagent's task bounded and specific.
- Do not merge to `main` on behalf of Owen without the review the change needs;
  the loop commits cycle results but the owner decides promotion of contested work.

## 6. Automation registration (recreate from here)

Tool: ZCode workspace automation (CronCreate/CronUpdate), recurring, **every 10
minutes** (`*/10 * * * *`), prompt = the continuous drain in §3–§4, self-contained
(no conversation context), must never create/schedule/configure another automation.
Verify with CronList. Unattended runs must never block on an interactive
confirmation — that is why the council has a direct (no-dialog) convening path.

Owner controls: change cadence or delete the automation at any time; the loop is
subordinate to Owen's decisions. If the owner says stop, stop and leave the
reconstructable handoff.

## 7. Companion mechanism — design council

Contested planning/design questions are not decided by a single worker or a single
model: the governor convenes the multi-model design council per
[DESIGN-COUNCIL.md](DESIGN-COUNCIL.md) — independent voices across model families
(in-session voice + external harness CLI one-shots), a chair that records
contradictions verbatim, and rulings that are recommendations, never authority.
Surfaces: saved workflow `design-council`, `/council` command, and the §4 direct
procedure for unattended cycles.
