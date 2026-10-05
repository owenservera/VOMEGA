# VOMEGA-dev-machine — Windows reconstruction pack

**Status: UNVERIFIED_ON_WINDOWS.** Scripts were generated on the Linux box, parse-checked with PowerShell 7.4.6, and smoke-run under pwsh-on-Linux (verify + press-go `-DryRun`, exit 0). Nothing here has run on Windows yet.

## Two sources of truth

| What | Where |
| --- | --- |
| **Process** (architecture, roles, dispatch, review, integration, ledger) | VOMEGA repo `.project/dev-machine/`: start at `README.md`, `PROCESS.md`, `ARCHITECTURE.md`, `WINDOWS-PARITY.md` |
| **Windows reconstruction** (this folder) | `mirror-to-windows/VOMEGA-dev-machine/` on the box, with a git snapshot at `.project/dev-machine/windows-mirror/` |

If they disagree, the git copy on `main` wins.

## Files

| File | Purpose |
| --- | --- |
| `desired-state.json` | Machine-readable spec: tools, versions, install methods, env var **names**, symbolic auth, habitats, worktree policy, health checks, Linux vs Windows status |
| `bootstrap-vomega-dev.ps1` | Safe to re-run: installs the toolchain and CLIs, clones the repo or fast-forwards `main`, runs `bun install`, creates the worktree root, finds ZCode and Daintree, prints the MANUAL_AUTH list, then runs verify |
| `verify-vomega-dev.ps1` | Fixed-order checks. Writes a secret-free `verify-report.json`. Add `-Full` to run `omega:quick` and `-ProbeModels` for live claude/grok pings |
| `press-go-vomega.ps1` | Windows press-go: verify → select tasks → disposable worktrees → open **ZCode** (preferred), Daintree, or print CLI commands |

## Owen: plug and play on Windows

```powershell
# from a copy of this folder (or <repo>\.project\dev-machine\windows-mirror\)
Set-ExecutionPolicy -Scope Process Bypass
.\bootstrap-vomega-dev.ps1 -WhatIf          # preview
.\bootstrap-vomega-dev.ps1                  # default repo: C:\0-BlackBoxProject-0\VOMEGA
# do the MANUAL_AUTH sign-ins it prints (gh, claude, grok, codex; ZCode + OpenRouter key in the ZCode UI)
.\verify-vomega-dev.ps1 -Full -ProbeModels  # send verify-report.json back to the box
.\press-go-vomega.ps1 -DryRun
.\press-go-vomega.ps1                       # platform smoke; add -Product for lane tasks
```

Use `-RepoRoot` if the repo lives elsewhere. Running the scripts again won't reinstall tools that are already present, won't reset the repo, and won't touch credentials.

## Hard rules

- No secrets in this folder. Auth is checked by file presence only.
- `openrouter/auto` hides the actual model, so record `router-selected/unknown`.
- Fixture or simulated evidence is never live provider proof.
