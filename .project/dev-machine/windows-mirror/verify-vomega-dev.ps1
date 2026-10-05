<#
  verify-vomega-dev.ps1 — deterministic Windows verification of the VOMEGA dev machine.
  Reads desired-state.json; probes PATH tools, versions, repo, worktree roundtrip, habitats, auth PRESENCE only.
  Writes verify-report.json (secret-free) next to this script. Exit 0 = no required item failed.
  STATUS: UNVERIFIED_ON_WINDOWS until Owen runs it and returns verify-report.json.

  Usage: .\verify-vomega-dev.ps1 [-RepoRoot C:\0-BlackBoxProject-0\VOMEGA] [-Full] [-ProbeModels]
    -Full         also runs `bun run omega:quick`
    -ProbeModels  sends a one-line "reply OK" prompt to claude/grok (uses a little quota)
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = 'C:\0-BlackBoxProject-0\VOMEGA',
  [string]$WorktreeRoot = 'C:\0-BlackBoxProject-0\vomega-worktrees',
  [switch]$Full,
  [switch]$ProbeModels
)
$ErrorActionPreference = 'Continue'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$spec = Get-Content (Join-Path $Here 'desired-state.json') -Raw | ConvertFrom-Json
$results = New-Object System.Collections.Generic.List[object]
$fail = 0

function Add-Result($item, $status, $observed, $required, $note) {
  $script:results.Add([pscustomobject]@{ item=$item; status=$status; observed=$observed; required=[bool]$required; note=$note })
  $color = @{ PASS='Green'; WARN='Yellow'; FAIL='Red'; INFO='Gray' }[$status]
  Write-Host ("{0,-5} {1,-22} {2} {3}" -f $status, $item, $observed, $note) -ForegroundColor $color
  if ($status -eq 'FAIL') { $script:fail++ }
}
function Get-Ver([string]$cmd) {
  try { $o = & $cmd --version 2>&1 | Select-Object -First 1; if ($o -match '(\d+\.\d+(\.\d+)?)') { return $Matches[1] } return "$o" } catch { return $null }
}

Write-Host "== verify-vomega-dev ($($spec.schema)) $(Get-Date -Format o) =="

foreach ($t in $spec.tools) {
  if ($t.name -in @('zcode','daintree')) { continue }   # GUI habitats: presence-checked below, never launched
  $cmd = $t.command
  if ($t.command -eq 'python3') { $cmd = @('python','python3','py') | Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } | Select-Object -First 1; if (-not $cmd) { $cmd = 'python' } }
  if (Get-Command $cmd -ErrorAction SilentlyContinue) {
    Add-Result $t.name 'PASS' (Get-Ver $cmd) $t.required "desired $($t.desired.version)"
  } else {
    Add-Result $t.name ($(if ($t.required) {'FAIL'} else {'WARN'})) 'missing' $t.required 'not on PATH'
  }
}

# Auth PRESENCE only (file exists?) — contents never read
$authFiles = @{ claude="$env:USERPROFILE\.claude\.credentials.json"; grok="$env:USERPROFILE\.grok\auth.json"; codex="$env:USERPROFILE\.codex\auth.json" }
foreach ($k in $authFiles.Keys) {
  $p = Test-Path $authFiles[$k]
  Add-Result "auth:$k" ($(if ($p) {'PASS'} else {'WARN'})) ($(if ($p) {'present'} else {'absent'})) $false 'presence only; MANUAL_AUTH if absent'
}
if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh auth status *> $null
  Add-Result 'auth:gh' ($(if ($LASTEXITCODE -eq 0) {'PASS'} else {'WARN'})) ($(if ($LASTEXITCODE -eq 0) {'logged-in'} else {'not-logged-in'})) $false 'gh auth status'
}

# Habitats
$z = $spec.tools | Where-Object name -eq 'zcode'
$zexe = $z.windows.executable_candidates | ForEach-Object { [Environment]::ExpandEnvironmentVariables($_) } | Where-Object { Test-Path $_ } | Select-Object -First 1
Add-Result 'habitat:zcode' ($(if ($zexe) {'PASS'} else {'WARN'})) ($(if ($zexe) {$zexe} else {'not found'})) $false 'primary Windows habitat'
$dt = @("$env:LOCALAPPDATA\Programs\Daintree\Daintree.exe","$env:ProgramFiles\Daintree\Daintree.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
Add-Result 'habitat:daintree' ($(if ($dt) {'PASS'} else {'INFO'})) ($(if ($dt) {$dt} else {'not found'})) $false 'secondary habitat (optional)'

# Repo
$gitOk = Test-Path (Join-Path $RepoRoot '.git')
Add-Result 'repo' ($(if ($gitOk) {'PASS'} else {'FAIL'})) $RepoRoot $true 'VOMEGA clone'
if ($gitOk) {
  Push-Location $RepoRoot
  try {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim(); $head = (git rev-parse --short HEAD).Trim()
    Add-Result 'repo:branch' ($(if ($branch -eq 'main') {'PASS'} else {'WARN'})) "$branch@$head" $false ''
    $dm = Test-Path '.project\dev-machine\PROCESS.md'
    Add-Result 'repo:dev-machine' ($(if ($dm) {'PASS'} else {'FAIL'})) '.project\dev-machine' $true 'process source of truth'
    $hasNm = Test-Path 'omega-baseline\node_modules'
    Add-Result 'repo:deps' ($(if ($hasNm) {'PASS'} else {'WARN'})) 'omega-baseline\node_modules' $false 'bun install'
    # Worktree roundtrip (disposable)
    $id = "VERIFY-$(Get-Random)"; $wt = Join-Path $WorktreeRoot $id
    New-Item -ItemType Directory -Force -Path $WorktreeRoot | Out-Null
    git worktree add -q -b "task/$id" $wt HEAD 2>&1 | Out-Null
    $wtOk = Test-Path (Join-Path $wt '.project')
    git worktree remove --force $wt 2>&1 | Out-Null; git branch -D "task/$id" 2>&1 | Out-Null; git worktree prune
    Add-Result 'worktree:roundtrip' ($(if ($wtOk) {'PASS'} else {'FAIL'})) $WorktreeRoot $true 'create+remove disposable worktree'
    if ($Full -and (Get-Command bun -ErrorAction SilentlyContinue)) {
      Push-Location 'omega-baseline'; bun run omega:quick *> "$env:TEMP\vomega-omega-quick.txt"; $rc = $LASTEXITCODE; Pop-Location
      Add-Result 'tests:omega:quick' ($(if ($rc -eq 0) {'PASS'} else {'FAIL'})) "exit $rc" $true "$env:TEMP\vomega-omega-quick.txt"
    }
  } finally { Pop-Location }
}

if ($ProbeModels) {
  foreach ($h in @(@{n='claude'; a=@('-p','Reply with exactly: CLAUDE_OK','--output-format','text')}, @{n='grok'; a=@('-p','Reply with exactly: GROK_OK','--output-format','plain','--max-turns','1')})) {
    if (Get-Command $h.n -ErrorAction SilentlyContinue) {
      $out = & $h.n @($h.a) 2>&1 | Out-String
      Add-Result "probe:$($h.n)" ($(if ($out -match '_OK') {'PASS'} else {'WARN'})) ($out.Trim() -replace '\s+',' ').Substring(0,[Math]::Min(40,$out.Trim().Length)) $false 'live model probe'
    }
  }
}

$report = [pscustomobject]@{
  schema='vomega-dev-machine-verify-report/v1'; ran_at=(Get-Date -Format o); host=$env:COMPUTERNAME; os=[Environment]::OSVersion.VersionString
  spec_generated_at=$spec.generated_at; repo_root=$RepoRoot; failures=$fail; results=$results
  note='Secret-free: auth checked by file presence only.'
}
$report | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $Here 'verify-report.json')
Write-Host "== failures=$fail  report: $(Join-Path $Here 'verify-report.json') =="
exit ([int]($fail -gt 0))
