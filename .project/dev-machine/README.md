# VOMEGA development machine

Press-go habitat for advancing VOMEGA with minimal Grok Bot token use.

**Primary habitat (Linux):** [Daintree](https://daintree.org) 0.41.0 — worktrees, agent PTY launch, Review Hub.  
**Fallback (Linux):** disposable `git worktree` + `claude` / `grok` / `codex` one-shots.  
**Primary habitat (Windows):** ZCode (proven ≥6 concurrent workers) + Daintree if installed; Windows pack = [`windows-mirror/`](windows-mirror/) (`press-go-vomega.ps1`). Windows paths are **UNVERIFIED_ON_WINDOWS** until Owen runs the verify procedure.

## Quick start (Linux box)

```bash
cd /workspace/VOMEGA
./.project/dev-machine/health-check.sh
./.project/dev-machine/press-go.sh --dry-run   # plan only
./.project/dev-machine/press-go.sh            # health → enqueue → launch (Daintree-preferring)
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
| [ARCHITECTURE.md](ARCHITECTURE.md) | Why Daintree-primary + thin git fallback |
| [PROCESS.md](PROCESS.md) | Control plane, freeze/token rules, implementer≠reviewer, STATUS rules |
| [HARNESS-MATRIX.md](HARNESS-MATRIX.md) | Invoke each CLI; auth symbolic; repair-required |
| [META-WORKSTREAM-DISPATCH.md](META-WORKSTREAM-DISPATCH.md) | How SDW..TRU tasks are discovered and enqueued (procedure only) |
| [RUN-LOG-SCHEMA.md](RUN-LOG-SCHEMA.md) | `runs.jsonl` fields |
| `health-check.sh` | Deterministic environment gate |
| `worktree-dispatch.sh` | Create disposable worktree + task prompt stub |
| `integrate.sh` | Test → review gate → merge/PR → remove worktree |
| `press-go.sh` | Health → read STATUS → enqueue first unblocked → launch |
| `select-tasks.py` | Parse STATUS / candidates → JSON task queue (no LLM) |
| `templates/` | Bounded task prompt templates (paths only, no pasted corpora) |
| `bootstrap/` | Restore notes, live harness probe, reference digests |
| `runs.jsonl` | Append-only ledger (created on first run) |
| `HANDOFF-NEEDED.md` | Asks for CoS / specialists (do not wake bots from here) |
| [WINDOWS-PARITY.md](WINDOWS-PARITY.md) | LIVE_ON_LINUX vs UNVERIFIED_ON_WINDOWS vs REPAIR_REQUIRED |
| [windows-mirror/](windows-mirror/) | Windows pack snapshot: `desired-state.json`, `bootstrap-vomega-dev.ps1`, `verify-vomega-dev.ps1`, `press-go-vomega.ps1` |
| `sync-windows-mirror.sh` | Sync box mirror `/workspace/mirror-to-windows/VOMEGA-dev-machine/` ↔ `windows-mirror/` |
| `bootstrap/open-in-daintree.sh` | Open repo in running Daintree (`:16`) |

## Truth boundaries

- Git `main` + repo artifacts + tests = durable project truth.
- Daintree / ZCode = execution habitat, **not** project truth.
- Simulated evidence ≠ live provider evidence.
- `HARNESS ≠ ROUTER ≠ MODEL ≠ ACCOUNT`.

## Secrets

Never store passwords, API keys, OAuth tokens, cookies, or CLI session contents here. Auth requirements are symbolic (`existing-login` / `MANUAL_AUTH`).
