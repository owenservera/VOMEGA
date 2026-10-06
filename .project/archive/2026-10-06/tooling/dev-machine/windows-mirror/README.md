# VOMEGA-dev-machine — Windows reconstruction pack

**Status: UNVERIFIED_ON_WINDOWS.** Scripts were generated on the Linux box, parse-checked with PowerShell 7.4.6, and smoke-run under pwsh-on-Linux (verify + press-go `-DryRun`, exit 0). Nothing here has run on Windows yet.

## Authority hierarchy

| What | Where |
| --- | --- |
| **Program map / openness rule** | `.project/META-TRACKER.md` |
| **Current launch state** | `.project/agentic-launch/STATUS.md` |
| **Dev-machine operating snapshot** | `.project/dev-machine/` |
| **Windows reconstruction snapshot** | this folder |

The dev-machine and Windows pack reproduce a useful current setup; they do not define VOMEGA strategy. If an operating file conflicts with META-TRACKER's authority/openness rule, the meta layer wins.

## Files

| File | Purpose |
| --- | --- |
| `desired-state.json` | Machine-readable spec: tools, versions, install methods, env var **names**, symbolic auth, habitats, worktree policy, health checks, Linux vs Windows status |
| `bootstrap-vomega-dev.ps1` | Safe to re-run: installs the toolchain and CLIs, clones the repo or fast-forwards `main`, runs `bun install`, creates the worktree root, finds ZCode and Daintree, prints the MANUAL_AUTH list, then runs verify |
| `verify-vomega-dev.ps1` | Fixed-order checks. Writes a secret-free `verify-report.json`. Add `-Full` to run `omega:quick` and `-ProbeModels` for live claude/grok pings |
| `press-go-vomega.ps1` | Windows helper: verify → suggest tasks → optional disposable worktrees → open one selected UI (ZCode or Daintree) or print CLI commands. Selecting a UI does not make it manager of the other. |

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
