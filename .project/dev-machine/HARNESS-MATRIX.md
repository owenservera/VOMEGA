# Harness / tooling matrix

Live probe: `bootstrap/harness-live-probe.json` (2026-10-05 ~23:57 CEST).  
Daintree restore: `bootstrap/DAINTREE-RESTORE.md`.

Legend: **LIVE** = verified on this Linux box this session · **REPAIR_REQUIRED** · **UNVERIFIED_ON_WINDOWS** · **MANUAL_AUTH**.

| Tool | Linux status | Invoke (one-shot / habitat) | Auth (symbolic) | Notes |
| --- | --- | --- | --- | --- |
| **Daintree 0.41.0** | **LIVE** (`ii`, running `:16`) | `bash /opt/Daintree/resources/daintree-cli.sh /workspace/VOMEGA` · `--status` · helpers in `/workspace/daintree-master-automation/scripts/` | existing-login / local config under `~/.config/Daintree` (NEVER_EXPORT) | Linux habitat for Git worktrees + supported CLI-agent PTYs + Review Hub. **Does not launch/manage ZCode.** |
| **claude** (Claude Code 2.1.289) | **LIVE** (`CLAUDE_OK`) | `claude -p "<prompt>" --output-format text\|json` · in Daintree: pin CLI Agents / Ctrl+Alt+C | `~/.claude/.credentials.json` existing-login | Preferred implementer/reviewer while Codex limited. |
| **grok** (Grok Build 1.0.46) | **LIVE** (`GROK_OK`, model grok-4.7) | `grok -p "<prompt>" --output-format plain --max-turns N` | `~/.grok/auth.json` existing-login (grok.com) | Usable one-shot; also Daintree PTY. |
| **codex** (0.160.0) | **LIMITED** | `codex exec -s read-only\|workspace-write -C <dir> -o last.txt "<prompt>"` | `~/.codex/auth.json` existing-login | Auth OK; **usage limit** observed until ~2026-10-06 00:19 CEST; model seen `gpt-6.1-sol`. Retry after window. |
| **bun** 1.4.2 | **LIVE** | `bun test …` · `bun run omega:quick` | n/a | Deterministic tests. |
| **git** 2.47.3 | **LIVE** | worktrees via script or Daintree | n/a | |
| **gh** 2.46.0 | **LIVE** (owenservera) | `gh pr create` etc. | `~/.config/gh/hosts.yml` existing-login | |
| **opencode** 1.18.34 | **LIVE** (binary; restored 2026-10-06 00:05) | `opencode run "<prompt>"` | `~/.local/share/opencode/auth.json` existing-login (NEVER_EXPORT) | nvm Node 22.23.3 restored; provider routes not re-probed. |
| **kilo** 7.8.3 | **LIVE** (binary) | `kilo` | not probed | Restored with opencode. |
| **OpenRouter** | indirect | via ZCode (Windows) / opencode (broken) | symbolic `OPENROUTER_API_KEY` NEVER_EXPORT | No local CLI on Linux; `:6446` proxy not listening. |
| **ZCode** | absent on Linux | Windows app + bundled CLI | existing-login | **Windows-primary** habitat; ≥6 concurrency measured historically. |
| **nvm / Node 22** | **LIVE** (nvm 0.40.3, Node 22.23.3) | `. ~/.nvm/nvm.sh` (unset NPM_CONFIG_PREFIX first) | n/a | Restored 2026-10-06 00:05 CEST; system Node v20.19.2 remains default. |

## Windows column (all UNVERIFIED_ON_WINDOWS until Owen runs verify; spec: `windows-mirror/desired-state.json`, parity: `WINDOWS-PARITY.md`)

| Tool | Desired Windows path | Install hint (mirror pack) |
| --- | --- | --- |
| ZCode | independent ZCode worker/session habitat | Vendor installer / existing Owen install; document version after verify |
| Daintree 0.41.0 | independent Git-worktree / supported-CLI habitat; not a ZCode manager | `https://updates.daintree.org/releases/Daintree-0.41.0-x64-setup.exe` (SmartScreen → More info → Run anyway) |
| claude / codex / grok | PATH | `PACKAGES/install-stack.ps1` + `PLAYBOOKS/02-auth-checklist.md` |
| bun / git / gh | PATH | winget via install-stack |
| OpenRouter | ZCode route `openrouter/auto` | MANUAL_AUTH in ZCode; never put key in repo |

## Repair-required cheat sheet (Linux)

```bash
# Daintree (if wiped again) — see bootstrap/DAINTREE-RESTORE.md
sudo DEBIAN_FRONTEND=noninteractive apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y libsecret-1-0 libsecret-common
sudo DEBIAN_FRONTEND=noninteractive dpkg -i /workspace/downloads/daintree_0.41.0_amd64.deb

# nvm + OpenCode/Kilo (performed 2026-10-06 00:05 CEST; no auth/config touched)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | PROFILE=/dev/null bash
( unset NPM_CONFIG_PREFIX; . ~/.nvm/nvm.sh; nvm install 22.23.3
  npm i -g --prefix ~/.nvm/versions/node/v22.23.3 opencode-ai @kilocode/cli )
# ~/.local/bin/{opencode,kilo} symlinks then resolve
```
