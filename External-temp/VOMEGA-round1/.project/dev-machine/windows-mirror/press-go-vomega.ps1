<#
  press-go-vomega.ps1 — Windows helper: verify -> suggest bounded tasks -> optionally create disposable worktrees
  -> open one selected UI (ZCode or Daintree) or print CLI one-shot commands.
  ZCode and Daintree are independent; selecting one here does not make it manager of the other.
  Mirrors <repo>\.project\dev-machine\press-go.sh. STATUS: UNVERIFIED_ON_WINDOWS.

  Usage: .\press-go-vomega.ps1 [-DryRun] [-Product] [-Max 2] [-Habitat auto|zcode|daintree|cli]
  Default scope = platform-only DEV smoke (no product code). -Product uses select-tasks.py as an advisory queue; current evidence/META-TRACKER may justify different work.
  Never launches model workers unattended; in cli mode it prints the exact commands to run.
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = 'C:\0-BlackBoxProject-0\VOMEGA',
  [string]$WorktreeRoot = 'C:\0-BlackBoxProject-0\vomega-worktrees',
  [switch]$DryRun, [switch]$Product, [int]$Max = 2,
  [ValidateSet('auto','zcode','daintree','cli')][string]$Habitat = 'auto'
)
$ErrorActionPreference = 'Stop'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$spec = Get-Content (Join-Path $Here 'desired-state.json') -Raw | ConvertFrom-Json

& (Join-Path $Here 'verify-vomega-dev.ps1') -RepoRoot $RepoRoot -WorktreeRoot $WorktreeRoot
if ($LASTEXITCODE -ne 0) { throw 'verify failed; fix FAIL items before press-go' }

$dm = Join-Path $RepoRoot '.project\dev-machine'
$selArgs = @((Join-Path $dm 'select-tasks.py'), '--root', $RepoRoot, '--max', $Max)
if (-not $Product) { $selArgs += '--platform-only' }
$py = @('python','python3','py') | Where-Object { Get-Command $_ -ErrorAction SilentlyContinue } | Select-Object -First 1
if (-not $py) { throw 'python not found' }
$queue = (& $py @selArgs) | Out-String | ConvertFrom-Json

$zexe = $spec.tools | Where-Object name -eq 'zcode' | ForEach-Object { $_.windows.executable_candidates } |
  ForEach-Object { [Environment]::ExpandEnvironmentVariables($_) } | Where-Object { Test-Path $_ } | Select-Object -First 1
$dexe = @("$env:LOCALAPPDATA\Programs\Daintree\Daintree.exe","$env:ProgramFiles\Daintree\Daintree.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($Habitat -eq 'auto') { $Habitat = if ($zexe) {'zcode'} elseif ($dexe) {'daintree'} else {'cli'} }
Write-Host "HABITAT=$Habitat tasks=$($queue.selected.Count) dry=$([bool]$DryRun)"

$ledger = Join-Path $dm 'runs.jsonl'
$head = (git -C $RepoRoot rev-parse --short HEAD).Trim()
foreach ($t in $queue.selected) {
  $wt = Join-Path $WorktreeRoot $t.id
  Write-Host "- $($t.id) [$($t.lane)] $($t.title) -> $wt"
  if ($DryRun) { continue }
  if (-not (Test-Path $wt)) {
    $br = "task/$($t.id)"
    git -C $RepoRoot show-ref --verify --quiet "refs/heads/$br"
    if ($LASTEXITCODE -eq 0) { git -C $RepoRoot worktree add $wt $br } else { git -C $RepoRoot worktree add -b $br $wt main }
  }
  $pd = Join-Path $wt '.dev-machine'; New-Item -ItemType Directory -Force $pd | Out-Null
  $tpl = Get-Content (Join-Path $dm 'templates\bounded-task.md') -Raw
  $tpl.Replace('{{TASK_ID}}',$t.id).Replace('{{LANE}}',$t.lane).Replace('{{TITLE}}',$t.title).Replace('{{HARNESS}}',$Habitat).Replace('{{HEAD}}',$head).Replace('{{WORKTREE}}',$wt) |
    Set-Content -Encoding UTF8 (Join-Path $pd 'TASK.md')
  $rec = [ordered]@{ ts=(Get-Date -Format o); task_id=$t.id; lane=$t.lane; role='dispatch'; harness=$Habitat; router=$(if ($Habitat -eq 'zcode') {'openrouter/auto'} else {'none'});
    model_or_unknown=$(if ($Habitat -eq 'zcode') {'router-selected/unknown'} else {'n/a'}); account_or_unknown='existing-login'; source_head=$head; worktree=$wt; branch="task/$($t.id)";
    outcome='ok'; tests='n/a'; reviewer='none'; duration_s=0; notes='press-go-vomega.ps1 (windows)' }
  ($rec | ConvertTo-Json -Compress) | Add-Content -Encoding UTF8 $ledger
  if ($Habitat -eq 'cli') { Write-Host "    run: cd `"$wt`"; claude -p `"Read .dev-machine/TASK.md and execute only what it allows.`"" }
}
if (-not $DryRun) {
  switch ($Habitat) {
    'zcode'    { Start-Process $zexe -ArgumentList "`"$RepoRoot`"" ; Write-Host 'ZCode opened independently. Start bounded ZCode workers as useful; Daintree is not their manager (>=6 measured historically, not a fixed cap).' }
    'daintree' { Start-Process $dexe -ArgumentList "`"$RepoRoot`"" ; Write-Host 'Daintree opened independently: attach supported CLI-agent panels/worktrees as useful. It does not launch/manage ZCode.' }
    default    { Write-Host 'CLI mode: run the printed commands; reviewer must be a different harness (writes .dev-machine/REVIEW_OK).' }
  }
}
