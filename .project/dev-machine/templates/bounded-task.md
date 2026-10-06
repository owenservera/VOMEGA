# Task {{TASK_ID}} ({{LANE}})

**Title:** {{TITLE}}  
**Harness:** {{HARNESS}}  
**Source HEAD at dispatch:** {{HEAD}}  
**Worktree:** {{WORKTREE}}

## Role
You are the **IMPLEMENTER** unless the prompt file says ROLE=REVIEWER.

## Read first (paths only — do not assume pasted context)
- `.project/agentic-launch/STATUS.md`
- `.project/META-TRACKER.md`
- `.project/dev-machine/PROCESS.md`
- Any handoff under `.project/agentic-launch/handoffs/` named for this lane

## Acceptance
- Produce the artifacts named in STATUS / candidate card for this task id.
- Run the relevant `bun test` / `bun run omega:quick` checks listed there.
- Write a short handoff note under `.project/agentic-launch/handoffs/{{TASK_ID}}.md` with: commit intent, tests, proof level (`fixture|simulated|live`), residual risks.

## Stop conditions
- Stop after acceptance checks pass or after one bounded patch cycle.
- Do not mutate auth, credentials, provider accounts, or browser profiles.
- Do not claim simulated evidence as live.
- Do not edit unrelated lanes' contracts.
- Do not wake other agents or bots; record a handoff instead.

## Reviewer
Consequential changes need a reviewer who did not write them. A different harness or provider is one good way to get independence, not a requirement. The reviewer writes `.dev-machine/REVIEW_OK` after inspection.
