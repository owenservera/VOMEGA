# VOMEGA development machine

Reproducible **development-system experiment snapshot** for advancing VOMEGA. It is subordinate to `.project/META-TRACKER.md` and is not the project's permanent operating architecture.

**Linux observed habitat:** [Daintree](https://daintree.org) 0.41.0 for Git worktrees, Review Hub and supported CLI-agent PTY panels.  
**Linux fallback:** disposable `git worktree` + direct `claude` / `grok` / `codex` one-shots.  
**Windows observed/candidate habitats:** ZCode and Daintree are **separate** tools. ZCode has proven ≥6 bounded workers historically; Daintree can independently manage Git worktrees and supported CLI agents if installed. **Daintree does not launch or manage ZCode.** Windows pack = [`windows-mirror/`](windows-mirror/) (`press-go-vomega.ps1`). Windows paths are **UNVERIFIED_ON_WINDOWS** until Owen runs the verify procedure.

## Quick start (Linux box)

```bash
cd /workspace/VOMEGA
./.project/dev-machine/health-check.sh
./.project/dev-machine/press-go.sh --dry-run   # plan only
./.project/dev-machine/press-go.sh            # health → suggest → open Daintree if it is running (a Linux-box convenience, not a policy)
./.project/dev-machine/press-go.sh --no-daintree   # force git-worktree + CLI fallback
```

## Quick start (Windows, UNVERIFIED_ON_WINDOWS)

```powershell
cd <repo>\.project\dev-machine\windows-mirror
.\bootstrap-vomega-dev.ps1 ; .\verify-vomega-dev.ps1 -Full ; .\press-go-vomega.ps1 -DryRun
```

## Layout

| Path | Purpose |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Observed tools, the Daintree/ZCode boundary, and the thin tool-neutral machinery |
| [PROCESS.md](PROCESS.md) | Roles as functions, current safe defaults, escalation to Owen |
| [HARNESS-MATRIX.md](HARNESS-MATRIX.md) | Invoke each CLI; auth symbolic; repair-required |
| [META-WORKSTREAM-DISPATCH.md](META-WORKSTREAM-DISPATCH.md) | How SDW..TRU tasks are discovered and enqueued (procedure only) |
| [RUN-LOG-SCHEMA.md](RUN-LOG-SCHEMA.md) | `runs.jsonl` fields |
| `health-check.sh` | Deterministic environment gate |
| `worktree-dispatch.sh` | Create disposable worktree + task prompt stub |
| `integrate.sh` | Test → review gate → merge/PR → remove worktree |
| `press-go.sh` | Health → advisory task suggestion → optionally open Daintree or create worktrees. Platform smoke by default; product launches only with `--product` |
| `select-tasks.py` | Parse STATUS / candidates → JSON task queue (no LLM) |
| `templates/` | Bounded task prompt templates (paths only, no pasted corpora) |
| `bootstrap/` | Restore notes, live harness probe, reference digests |
| `runs.jsonl` | Append-only ledger (created on first run) |
| `HANDOFF-NEEDED.md` | Open asks for whoever is coordinating the Linux box |
| [WINDOWS-PARITY.md](WINDOWS-PARITY.md) | LIVE_ON_LINUX vs UNVERIFIED_ON_WINDOWS vs REPAIR_REQUIRED |
| [windows-mirror/](windows-mirror/) | Windows pack snapshot: `desired-state.json`, `bootstrap-vomega-dev.ps1`, `verify-vomega-dev.ps1`, `press-go-vomega.ps1` |
| `sync-windows-mirror.sh` | Sync box mirror `/workspace/mirror-to-windows/VOMEGA-dev-machine/` ↔ `windows-mirror/` |
| `bootstrap/open-in-daintree.sh` | Open repo in running Daintree (`:16`) |

## Truth boundaries

- Git `main` + repo artifacts + tests = durable project truth.
- Daintree / ZCode = separate, replaceable execution habitats, **not** project truth and not a parent/child control stack.
- Simulated evidence ≠ live provider evidence.
- `HARNESS ≠ ROUTER ≠ MODEL ≠ ACCOUNT`.

## Secrets

Never store passwords, API keys, OAuth tokens, cookies, or CLI session contents here. Auth requirements are symbolic (`existing-login` / `MANUAL_AUTH`).
