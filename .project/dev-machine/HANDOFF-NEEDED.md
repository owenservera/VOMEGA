# HANDOFF-NEEDED (for Chief Of Staff)

Do **not** wake specialists from workers. CoS decides.

## Open asks

### 1. ~~Runtime Master — nvm / OpenCode / Kilo restore~~ RESOLVED 2026-10-06 00:05 CEST
- Done by the platform worker: nvm 0.40.3 + Node 22.23.3, `npm i -g` opencode-ai (1.18.34) + @kilocode/cli (7.8.3) under the nvm prefix. No auth/config mutation. Residual: provider routes not re-probed.
- **Why:** post-reboot wipe; `~/.local/bin/opencode` and `kilo` are dangling symlinks into missing `~/.nvm/versions/node/v22.23.3/`.
- **Ask:** restore nvm + Node 22.23.3 (or current intended version), reinstall/relink `opencode` and `kilo`, verify `--version`, do **not** mutate unrelated auth.
- **Priority:** medium (press-go works without them via Daintree + claude/grok).

### 2. AUTH-MASTER / Owen — Codex usage limit
- **Why:** live probe hit Codex usage limit until ~2026-10-06 00:19 CEST (model `gpt-6.1-sol` was selected before refusal).
- **Ask:** wait for window or owner spend decision; no auth file edits from workers.
- **Priority:** low-medium (claude + grok live).

### 3. Owen — Windows verify
- **Why:** all Windows steps UNVERIFIED_ON_WINDOWS.
- **Ask:** run `.project/dev-machine/windows-mirror/bootstrap-vomega-dev.ps1` (same as `mirror-to-windows/VOMEGA-dev-machine/`) then `verify-vomega-dev.ps1 -Full -ProbeModels`; return `verify-report.json`.
- **Priority:** high for plug-and-play claim.

### 4. Daintree Master — only if install breaks again
- **Why:** restore already documented and verified 2026-10-05.
- **Ask:** none unless `daintree-cli.sh --status` fails after following `bootstrap/DAINTREE-RESTORE.md`.
