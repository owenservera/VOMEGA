<#
  bootstrap-vomega-dev.ps1 — idempotent Windows reconstruction of the VOMEGA development machine.
  Spec: desired-state.json (same folder). Process source of truth: <repo>\.project\dev-machine\
  STATUS: UNVERIFIED_ON_WINDOWS (generated + parse-checked on Linux with pwsh 7; never executed on Windows).

  What it does (each step checks first, skips if already satisfied, never deletes):
    1. Install base toolchain via winget (git, gh, node LTS, bun, python)
    2. Install agent CLIs (claude, grok, codex, opencode, kilo) via official script / npm
    3. Clone VOMEGA to -RepoRoot, or fetch + fast-forward main (never reset/force)
    4. bun install in omega-baseline
    5. Create worktree root
    6. Detect ZCode / Daintree (installs nothing for ZCode; prints Daintree installer URL)
    7. Print MANUAL_AUTH checklist (never touches credentials)
    8. Run verify-vomega-dev.ps1

  Usage (PowerShell 7 or 5.1):
    Set-ExecutionPolicy -Scope Process Bypass
    .\bootstrap-vomega-dev.ps1 [-RepoRoot C:\0-BlackBoxProject-0\VOMEGA] [-SkipInstall] [-SkipAgents] [-WhatIf]
#>
[CmdletBinding(SupportsShouldProcess)]
param(
  [string]$RepoRoot = 'C:\0-BlackBoxProject-0\VOMEGA',
  [string]$WorktreeRoot = 'C:\0-BlackBoxProject-0\vomega-worktrees',
  [string]$RepoUrl = 'https://github.com/owenservera/VOMEGA.git',
  [switch]$SkipInstall,
  [switch]$SkipAgents,
  [switch]$SkipVerify
)
$ErrorActionPreference = 'Stop'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Write-Skip($m) { Write-Host "    skip: $m" -ForegroundColor DarkGray }
function Test-Cmd($name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }
function Update-SessionPath {
  $env:Path = [Environment]::GetEnvironmentVariable('Path','User') + ';' + [Environment]::GetEnvironmentVariable('Path','Machine')
}

function Install-Winget([string]$Id, [string]$Cmd) {
  if (Test-Cmd $Cmd) { Write-Skip "$Id ($Cmd on PATH)"; return }
  if (-not (Test-Cmd 'winget')) { Write-Warning "winget missing; install '$Id' manually"; return }
  if ($PSCmdlet.ShouldProcess($Id, 'winget install')) {
    Write-Step "winget install $Id"
    winget install --id $Id -e --accept-source-agreements --accept-package-agreements --silent
    Update-SessionPath
  }
}
function Install-Npm([string]$Pkg, [string]$Cmd) {
  if (Test-Cmd $Cmd) { Write-Skip "$Pkg ($Cmd on PATH)"; return }
  if (-not (Test-Cmd 'npm')) { Write-Warning "npm missing; cannot install $Pkg"; return }
  if ($PSCmdlet.ShouldProcess($Pkg, 'npm install -g')) { Write-Step "npm i -g $Pkg"; npm install -g $Pkg; Update-SessionPath }
}
function Install-Script([string]$Name, [string]$Cmd, [string]$Url, [string]$NpmAlt) {
  if (Test-Cmd $Cmd) { Write-Skip "$Name ($Cmd on PATH)"; return }
  if ($PSCmdlet.ShouldProcess($Name, "irm $Url | iex")) {
    Write-Step "install $Name from $Url"
    try { Invoke-RestMethod $Url | Invoke-Expression } catch { Write-Warning "$Name script install failed: $_" }
    Update-SessionPath
    if (-not (Test-Cmd $Cmd) -and $NpmAlt) { Install-Npm $NpmAlt $Cmd }
  }
}

$spec = Get-Content (Join-Path $Here 'desired-state.json') -Raw | ConvertFrom-Json
Write-Host "VOMEGA dev-machine bootstrap — spec $($spec.schema) generated $($spec.generated_at)"

# 1-2. Tooling
if (-not $SkipInstall) {
  Install-Winget 'Git.Git'           'git'
  Install-Winget 'GitHub.cli'        'gh'
  Install-Winget 'OpenJS.NodeJS.LTS' 'node'
  Install-Winget 'Oven-sh.Bun'       'bun'
  Install-Winget 'Python.Python.3.13' 'python'
  if (-not $SkipAgents) {
    Install-Script 'Claude Code' 'claude' 'https://claude.ai/install.ps1' '@anthropic-ai/claude-code'
    Install-Script 'Grok CLI'    'grok'   'https://x.ai/cli/install.ps1'  '@xai-official/grok'
    Install-Npm '@openai/codex'  'codex'
    Install-Npm 'opencode-ai'    'opencode'
    Install-Npm '@kilocode/cli'  'kilo'
  }
} else { Write-Skip 'tool installation (-SkipInstall)' }

# 3. Repository
if (-not (Test-Cmd 'git')) { throw 'git not available; cannot continue' }
if (-not (Test-Path (Join-Path $RepoRoot '.git'))) {
  if ($PSCmdlet.ShouldProcess($RepoRoot, "git clone $RepoUrl")) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $RepoRoot) | Out-Null
    Write-Step "git clone $RepoUrl $RepoRoot"
    git clone $RepoUrl $RepoRoot
  }
} else {
  Push-Location $RepoRoot
  try {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    $dirty = git status --porcelain --untracked-files=no
    git fetch origin main
    if ($branch -eq 'main' -and -not $dirty) {
      if ($PSCmdlet.ShouldProcess($RepoRoot, 'git pull --ff-only origin main')) { git pull --ff-only origin main }
    } else {
      Write-Warning "Repo on '$branch' or has tracked changes; NOT pulling (preserving local work). Resolve manually."
    }
  } finally { Pop-Location }
}

# 4. Dependencies
$ob = Join-Path $RepoRoot 'omega-baseline'
if ((Test-Path $ob) -and (Test-Cmd 'bun')) {
  if (Test-Path (Join-Path $ob 'node_modules')) { Write-Skip 'omega-baseline node_modules present' }
  elseif ($PSCmdlet.ShouldProcess($ob, 'bun install')) { Push-Location $ob; try { bun install } finally { Pop-Location } }
}

# 5. Worktree root
if (-not (Test-Path $WorktreeRoot)) {
  if ($PSCmdlet.ShouldProcess($WorktreeRoot, 'create worktree root')) { New-Item -ItemType Directory -Force -Path $WorktreeRoot | Out-Null }
} else { Write-Skip "worktree root $WorktreeRoot exists" }

# 6. Habitats
$z = $spec.tools | Where-Object name -eq 'zcode'
$zexe = $z.windows.executable_candidates | ForEach-Object { [Environment]::ExpandEnvironmentVariables($_) } | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($zexe) { Write-Host "    ZCode found: $zexe (primary Windows habitat)" -ForegroundColor Green }
else { Write-Warning 'ZCode not found at known paths — install/locate ZCode (primary habitat). Fallback: Daintree or CLI worktrees.' }
$dt = @("$env:LOCALAPPDATA\Programs\Daintree\Daintree.exe","$env:ProgramFiles\Daintree\Daintree.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($dt) { Write-Host "    Daintree found: $dt (secondary habitat)" -ForegroundColor Green }
else { Write-Host '    Daintree not found. Optional: https://updates.daintree.org/releases/Daintree-0.41.0-x64-setup.exe (SmartScreen: More info -> Run anyway)' }

# 7. Manual auth checklist (never automated)
Write-Host ''
Write-Host 'MANUAL_AUTH (do these yourself; nothing here reads or writes credentials):' -ForegroundColor Yellow
foreach ($t in $spec.tools) { if ($t.auth.type -eq 'existing-login') { Write-Host ("  - {0}: {1}" -f $t.name, $t.auth.acquisition) } }

# 8. Verify
if (-not $SkipVerify -and -not $WhatIfPreference) {
  & (Join-Path $Here 'verify-vomega-dev.ps1') -RepoRoot $RepoRoot -WorktreeRoot $WorktreeRoot
}
