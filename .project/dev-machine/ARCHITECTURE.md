# Development-machine architecture

**Chosen topology (2026-10-05):** Daintree-primary press-go on Linux; git-worktree + CLI fallback; ZCode-primary on Windows (UNVERIFIED until Owen runs verify).

## Why this shape

1. **Daintree is restored and running** on the shared Linux box (`daintree 0.41.0`, `DISPLAY=:16`). It already provides worktree lifecycle, agent PTY panels, Review Hub, and project open — machinery VOMEGA would otherwise reinvent. Evidence: `.project/dev-machine/bootstrap/DAINTREE-RESTORE.md`.
2. **ZCode is Windows-native** and already proved ≥6 concurrent bounded workers on `openrouter/auto` (router-selected/unknown). It is **not** on the Linux PATH; do not fake a Linux ZCode install.
3. **Thin scripts remaining outside Daintree:** health-check, task selection from STATUS, worktree naming convention, run ledger (`runs.jsonl`), integrate helper, and Windows mirror desired-state. These survive when Daintree is down (post-reboot half-remove happened once).
4. **Grok Bots are control plane only** (Chief Of Staff). Coding workers are Claude / Codex / Grok (and ZCode on Windows), launched inside Daintree PTYs or via one-shot CLI in a worktree.

## Isolation

```
bounded task → disposable worktree (Daintree UI or git worktree)
            → implementer harness
            → tests
            → independent reviewer (different harness/provider when possible)
            → integrate to main
            → delete worktree
```

No permanent branch-per-lane. Lanes (SDW..TRU) are ownership labels on tasks, not long-lived directories.

## What Daintree does vs what scripts do

| Concern | Daintree | Scripts / git |
| --- | --- | --- |
| Project open | yes | `open-in-daintree.sh` / `daintree-cli.sh` |
| Worktree create/switch | yes (UI) | `worktree-dispatch.sh` fallback |
| Agent launch / PTY | yes | `claude -p` / `grok -p` / `codex exec` one-shot |
| Review Hub | yes | `integrate.sh` + `gh pr` fallback |
| Task discovery from META-TRACKER/STATUS | no | `select-tasks.py` + `press-go.sh` |
| Run ledger | no | `runs.jsonl` |
| Windows parity | install via mirror pack | desired-state + `bootstrap-vomega-dev.ps1` |

## Concurrency

- Start from measured evidence, not reputation: Windows ZCode ≥6; Linux Daintree playground previously ran 2–3 worktrees.
- Default press-go concurrency: **2** implementers + **1** reviewer slot unless health-check / prior runs say otherwise.
- Never two writers on the same contract file without an explicit claim in STATUS.

## Non-goals

- Not a general-purpose scheduler.
- Not a replacement for META-TRACKER / STATUS / roadmap.
- Not automatic frontier-model spend.
