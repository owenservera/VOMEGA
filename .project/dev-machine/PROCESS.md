# Operating process (control plane + workers)

## Roles

| Role | Who | Does |
| --- | --- | --- |
| Owner | Owen | Product authority, auth mutation, spend, irreversible actions |
| Control plane | Chief Of Staff (Grok Bot) | Bootstrap, health, wake specialists sparingly, escalate owner decisions |
| Habitat | Daintree (Linux) / ZCode (Windows) | Worktrees, agent panels, review UX |
| Implementer | Claude / Codex / Grok / ZCode worker | Bounded task in isolated worktree |
| Reviewer | Different harness/provider when possible | Accept/reject consequential work; never final-signoff own implementation |
| Truth surfaces | `.project/META-TRACKER.md`, `agentic-launch/STATUS.md`, tests | Durable state |

## Freeze / token rules

1. Do **not** wake the whole Grok Bot fleet.
2. Activate specialists only for a concrete setup failure (write ask into `HANDOFF-NEEDED.md` for CoS — do not self-wake).
3. No recurring 5-minute status chatter from bots.
4. Prefer CLI workers over Grok Bots for coding.
5. Bounded tasks: explicit artifacts, stop conditions, path references (not pasted corpora).
6. Persist context in repo files; pass task IDs + paths in prompts.
7. Shut/freeze supervisory bots when their job is done.
8. Do not use scarce frontier models for routine setup, boilerplate, or status prose.

## HARNESS ≠ ROUTER ≠ MODEL ≠ ACCOUNT

Record all four when observable. If a router hides the underlying model, write `model_or_unknown: router-selected/unknown`. Never guess.

Routing policy (consume what is actually available; see HARNESS-MATRIX):

- **Abundant / high-volume:** Claude Sonnet-class, GPT mid-tier, OpenRouter routes, Grok default when live.
- **Premium workhorses:** stronger Claude / GPT / Grok variants for hard implementation and serious review.
- **Scarce frontier:** mature high-impact adjudication only.

Prefer **cross-provider** implementer vs reviewer for consequential changes.

## Implementer ≠ reviewer

For consequential code or contract changes:

1. Implementer lands patch + tests in a worktree.
2. Reviewer (other harness, or same harness with explicit `ROLE=REVIEWER` prompt and no write to the same files until verdict) records accept/reject in handoff or `runs.jsonl`.
3. Integrate only if tests green **and** review accepts.

Docs-only / obviously trivial typos may use a lighter review, but still log who signed.

## Isolation

- Concurrent writers → disposable worktrees under `/workspace/vomega-worktrees/<task-id>` (or Daintree-managed paths).
- Branch name: `task/<task-id>`.
- Main is the durable integration branch.
- Protect shared contracts: one claimed writer in STATUS.

## STATUS update rules

File: `.project/agentic-launch/STATUS.md`

On claim: owner/session/tool, source HEAD, worktree path, expected handoff.  
On completion: commit SHA, tests run, reviewer, proof level (`fixture` | `simulated` | `live`), downstream trigger.  
Never claim simulated/fixture evidence as live provider proof.

## When to escalate to Owen

- Destructive/irreversible action
- Credential / auth mutation
- Spend / subscription change
- Material security/privacy tradeoff
- Product-authority choices not resolvable by evidence
