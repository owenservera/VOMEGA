# runs.jsonl schema

Append-only JSON Lines at `.project/dev-machine/runs.jsonl`.

```json
{
  "ts": "2026-10-05T23:59:00+02:00",
  "task_id": "DEV-02",
  "lane": "DEV",
  "role": "implementer|reviewer|dispatch|integrate|health|press-go",
  "harness": "daintree|claude|codex|grok|zcode|script",
  "router": "none|openrouter/auto|unknown",
  "model_or_unknown": "grok-4.7|gpt-6.1-sol|router-selected/unknown|unknown",
  "account_or_unknown": "existing-login|unknown",
  "source_head": "325be89",
  "worktree": "/workspace/vomega-worktrees/DEV-02",
  "branch": "task/DEV-02",
  "outcome": "ok|fail|skipped|blocked",
  "tests": "omega:quick 62/0|n/a",
  "reviewer": "claude|none",
  "duration_s": 12.5,
  "notes": "free text, no secrets"
}
```

Never log tokens, cookies, or credential file contents.
