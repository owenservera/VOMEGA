# Linux ↔ Windows parity

Updated 2026-10-06 ~00:10 CEST. Machine-readable version: `windows-mirror/desired-state.json`.

Status legend:
- **LIVE_ON_LINUX**: executed and passed on the shared Linux box this session.
- **UNVERIFIED_ON_WINDOWS**: generated, and at most parse-checked or smoke-run under pwsh-on-Linux.
- **REPAIR_REQUIRED**: known broken or limited.
- **MANUAL_AUTH**: a human has to sign in.

## LIVE_ON_LINUX

| Item | Evidence |
| --- | --- |
| git 2.47.3 · gh 2.46.0 (owenservera) · bun 1.4.2 · python 3.13.5 · node 20.19.2 | `health-check.sh` pass=16 warn=0 fail=0 |
| Daintree 0.41.0, running on `:16` | `daintree-cli.sh --status`; `bootstrap/DAINTREE-RESTORE.md` |
| claude 2.1.289 | live probe `CLAUDE_OK` (`bootstrap/harness-live-probe.json`) |
| grok 1.0.46 (grok-4.7) | live probe `GROK_OK` |
| nvm 0.40.3 + Node 22.23.3 → opencode 1.18.34, kilo 7.8.3 | **restored 2026-10-06 00:05 CEST** by binary reinstall only. Existing `~/.config/opencode` and `~/.local/share/opencode` were not touched. Provider routes not re-probed. |
| `omega:quick` | `VOMEGA_HEALTH_FULL=1 health-check.sh`, passed |
| `press-go.sh --dry-run` (Daintree habitat and `--no-daintree`) | exit 0 |
| Fallback worktree smoke (`DEV-SMOKE-01`: create → ledger → remove) | `runs.jsonl` records; worktree and branch removed |
| Windows `.ps1` parse check (pwsh 7.4.6) + `verify-vomega-dev.ps1` / `press-go-vomega.ps1 -DryRun` smoke under pwsh-on-Linux | 0 parse errors; verify failures=0; press-go exit 0 |

## UNVERIFIED_ON_WINDOWS

| Item | How Owen verifies |
| --- | --- |
| `bootstrap-vomega-dev.ps1` (winget / npm / install scripts, clone to `C:\0-BlackBoxProject-0\VOMEGA`) | run it, then `verify-vomega-dev.ps1 -Full -ProbeModels` |
| ZCode 3.14.4 as the primary press-go habitat (`C:\Program Files\ZCode`) | verify `habitat:zcode` PASS; `press-go-vomega.ps1` opens it |
| ZCode ≥6 concurrent bounded workers on `openrouter/auto` | historical measurement; re-measure after press-go |
| Daintree 0.41.0 Windows installer (secondary habitat) | verify `habitat:daintree` |
| Windows config locations (`%USERPROFILE%\.claude` etc.) | verify `auth:*` presence rows |
| Worktree roundtrip on NTFS | verify `worktree:roundtrip` |

**Single verification procedure:** `windows-mirror/verify-vomega-dev.ps1 -Full -ProbeModels`, then send back `verify-report.json`. It contains no secrets.

## REPAIR_REQUIRED

| Item | State | Action / owner |
| --- | --- | --- |
| Codex 0.160.0 | auth OK, **usage limit** until ~2026-10-06 00:19 CEST (model seen `gpt-6.1-sol`) | Re-probe after the window. Spend decision = Owen. No auth edits. |
| OpenRouter on Linux | no local CLI route; `:6446` proxy not listening | Optional: OpenCode provider re-probe. Windows path is ZCode. |
| opencode / kilo provider auth | binaries fixed; auth/routes not re-probed | `opencode auth list` probe when needed (read-only) |
| Windows execution of everything above | never run | Owen runs verify (HANDOFF-NEEDED #3) |

## MANUAL_AUTH (never automated, never exported)

`gh auth login` · `claude` → `/login` · `grok login` · `codex login` · `opencode auth login` (optional) · ZCode app sign-in, with the OpenRouter key entered only in the ZCode UI.

## Known Linux-only deviations

- Daintree runs under X `DISPLAY=:16`. Open it with `bootstrap/open-in-daintree.sh`.
- `NPM_CONFIG_PREFIX=~/.local` conflicts with nvm. Unset it when running nvm, and install opencode/kilo with `--prefix ~/.nvm/versions/node/v22.23.3`.
- Paths: `/workspace/VOMEGA`, `/workspace/vomega-worktrees`.

## Where the box docs live

- **Product/process truth:** this folder (`.project/dev-machine/`) in VOMEGA `main`.
- **Linux-box docs snapshot:** private repo `owenservera/grokbot-linux-box` (docs/configs only, never secrets). It collects `/workspace/GROK-BOT-TEAM-AND-LINUX-SETUP.md`, `/workspace/VOMEGA-BOOTSTRAP/` and `/workspace/mirror-to-windows/`. Those box paths are plain directories and are **not** nested git repos.
