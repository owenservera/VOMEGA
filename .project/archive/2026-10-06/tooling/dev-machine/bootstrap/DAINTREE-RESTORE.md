# Daintree restore — shared Linux box (VOMEGA habitat)

**Owner:** Daintree Master · **Written:** 2026-10-05 ~23:58 CEST · **Scope:** install/verify + launch agents / worktrees / Review Hub only. No VOMEGA product coding.

## Version observed

| Item | Value |
| --- | --- |
| Package | `daintree` **0.41.0** amd64 (`dpkg-query -W daintree`) |
| Installer on disk | `/workspace/downloads/daintree_0.41.0_amd64.deb` (~313 MB) |
| App binary | `/opt/Daintree/daintree` |
| Packaged CLI script | `/opt/Daintree/resources/daintree-cli.sh` |
| PATH symlink | `/usr/bin/daintree` → `/opt/Daintree/daintree` |
| Config / DB (preserved across wipe) | `/home/box/.config/Daintree` |
| Preferred display for this agent | `DISPLAY=:16` (`DAINTREE_DISPLAY=:16`) |
| CLI `--version` quirk | prints `daintree unknown` — trust **dpkg** version `0.41.0` |

## Exact restore commands (idempotent)

After reboot the DEB was gone from `/opt/Daintree` while `~/.config/Daintree` remained. Apt metadata was stale until `apt-get update`, so `libsecret-1-0` briefly had no candidate.

```bash
# 1) Refresh apt indexes (needed after some reboots on this box)
sudo DEBIAN_FRONTEND=noninteractive apt-get update

# 2) Secret-store dependency (DEB Depends: libsecret-1-0)
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y libsecret-1-0 libsecret-common

# 3) Install / reinstall packaged app
sudo DEBIAN_FRONTEND=noninteractive dpkg -i /workspace/downloads/daintree_0.41.0_amd64.deb
# If configure still fails:
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -f

# 4) Verify
dpkg-query -W -f='${Package} ${Version} ${Status}\n' daintree
test -x /opt/Daintree/daintree && test -x /opt/Daintree/resources/daintree-cli.sh
```

**Do not** mutate unrelated auth (`~/.codex`, Claude OAuth, etc.). Config under `~/.config/Daintree` was left intact.

**Runtime Master:** not required for this restore (system `apt` deps only, not nvm/Node toolchain). Node `v20.19.2` and Git `2.47.3` were already present.

### Re-download if the DEB is missing

```bash
mkdir -p /workspace/downloads
curl -L --continue-at - --retry 5 --retry-delay 2 \
  -o /workspace/downloads/daintree_0.41.0_amd64.deb \
  "https://updates.daintree.org/releases/daintree_0.41.0_amd64.deb"
```

## How to launch

### Open the app / a project

```bash
export DISPLAY=:16   # this Daintree Master's desktop

# Preferred helper (uses daintree-cli.sh when present)
/workspace/daintree-master-automation/scripts/open-in-daintree.sh /workspace/VOMEGA

# Or packaged CLI / binary
bash /opt/Daintree/resources/daintree-cli.sh /workspace/VOMEGA
# Fallback:
# /opt/Daintree/daintree /workspace/VOMEGA

# Status / running check
bash /opt/Daintree/resources/daintree-cli.sh --status
/workspace/daintree-master-automation/scripts/daintree-status.sh
```

Single-instance: a second launch focuses the existing window and can pass `--cli-path=…`.

Spanish box docs: `/workspace/daintree-docs/` (esp. `01-instalacion.md`, `04-como-usar.md`, `05-agentes.md`, `08-worktrees-y-review.md`).

### Launch agents (CLI panels)

Daintree does **not** ship agent binaries. It detects CLIs on `PATH` and runs them in PTY panels.

1. Open a Git project folder in Daintree.
2. Use the agent launcher / Command Palette / toolbar pins (Settings → CLI Agents to pin / run Setup Wizard).
3. Common shortcuts (from docs): **Ctrl+N** new panel; Claude often **Ctrl+Alt+C**; **Ctrl+Shift+E** send selection to another agent.

**CLIs seen on PATH this restore (2026-10-05):**

| CLI | Path |
| --- | --- |
| Claude | `/home/box/.local/bin/claude` |
| Codex | `/home/box/.local/bin/codex` |
| Grok | `/home/box/.local/bin/grok` |
| Goose | `/home/box/.local/bin/goose` |
| OpenCode / Kilo / Gemini | **MISSING** on PATH right now |

Auth for CLIs is owned by **AUTH-MASTER** — do not re-login from this restore.

Logs after launch showed PTY spawn with `launchAgentId: claude` (agent panel start works).

### Worktrees

Requires a Git repo with at least one commit.

- UI: worktree sidebar **+** (not the agent launcher +) → New worktree / branch.
- Command Palette → **New worktree** if the sidebar still says “Open a Git repository” right after init.
- Official flow: [Worktrees](https://daintree.org/docs/worktrees), [First parallel task](https://daintree.org/docs/getting-started/first-parallel-task).

**Verified on disk this restore:**

```
/workspace/daintree-playground                               88f6959 [master]
/workspace/daintree-playground-worktrees/chore-beta-note     88f6959 [chore/beta-note]
/workspace/daintree-playground-worktrees/feature-alpha-note  a74c7ff [feature/alpha-note]
```

App logs: `Loading worktrees for project path` for `/workspace/VOMEGA` and `/workspace/daintree-playground`; playground switch reported `worktreeCount: 3`.

### Review Hub

- Action `worktree.openReviewHub`: worktree menu, right-click, or Command Palette → **Open Review Hub**.
- Scope: **one** worktree. Stage / read diff / write commit message / commit / push there.
- Docs: [Review Hub](https://daintree.org/docs/review-hub); local note `/workspace/daintree-docs/08-worktrees-y-review.md`.
- Prior demo commit on playground alpha: `a74c7ff` via Review Hub (documented earlier).

This restore did **not** re-drive a full Review Hub commit (out of scope / no product coding). Presence of worktrees + Review Hub entry points + prior successful Review Hub commit on playground = intact.

## What works / what fails (this restore)

| Check | Result |
| --- | --- |
| `dpkg` install `daintree 0.41.0` | **OK** after `apt-get update` + `libsecret-1-0` |
| `/opt/Daintree/daintree` + `daintree-cli.sh` | **OK** |
| `~/.config/Daintree` preserved | **OK** |
| Launch on `DISPLAY=:16` | **OK** (`daintree-cli.sh --status` → running) |
| Open project via `open-in-daintree.sh` | **OK** (playground / prior projects) |
| Worktree enumeration | **OK** (playground ×3; VOMEGA loads) |
| Agent PTY launch (Claude) | **OK** (spawn logged) |
| Review Hub surface | **Present** (docs + prior playground use); not re-exercised end-to-end this pass |
| `daintree-cli.sh --version` | **Weak** → `daintree unknown` (cosmetic) |
| System D-Bus errors in stderr | **Noisy but non-fatal** on this box (no `/run/dbus/system_bus_socket`) |
| OpenCode / Kilo / Gemini on PATH | **Missing** (not part of DEB; Runtime/AUTH if needed later) |
| Blind `apt-get install -f` before deps available | **Bad** — can **remove** half-configured `daintree`; always install `libsecret-1-0` first after `apt-get update` |

## Windows equivalent notes (for MIRROR pack)

| Linux | Windows hint |
| --- | --- |
| DEB `daintree_0.41.0_amd64.deb` → `/opt/Daintree` | Download Windows installer from [daintree.org/download](https://daintree.org/download); expect SmartScreen prompt |
| `libsecret-1-0` | N/A (OS credential store / different stack) |
| `DISPLAY=:16` + Electron | Native Windows desktop session; no X11 |
| `~/.config/Daintree` | typically under `%APPDATA%\Daintree` (confirm on first Windows install — do not invent if unverified) |
| `open-in-daintree.sh` / `daintree-cli.sh /path` | Install “Daintree Command Line Tool” from in-app Terminal menu if offered; otherwise open folder from GUI |
| Agent CLIs in `~/.local/bin` | Install Claude / Codex / Grok via official Windows installers or `npm -g` / winget as applicable; ensure user PATH; OAuth via AUTH checklist (no secrets in mirror pack) |
| Worktrees / Review Hub | Same product concepts; Git required; same UI flows |
| Spanish docs | Portable copy of `/workspace/daintree-docs/` or point at https://daintree.org/docs |

## Pointers

- Automation helpers: `/workspace/daintree-master-automation/scripts/`
- Playground: `/workspace/daintree-playground`
- Source reference clone (not used to install): `/workspace/daintree`
- Official site: https://daintree.org
