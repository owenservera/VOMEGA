# One-time Windows Task Scheduler setup; dry run by default.
[CmdletBinding()]
param([switch]$Apply,[switch]$Remove)
$ErrorActionPreference='Stop'
$taskName='VOMEGA-Oracle-GitHub-Intake'
$repoRoot=(Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$script=Join-Path $PSScriptRoot 'bridge.mjs'
$node=(Get-Command node.exe -ErrorAction Stop).Source
$arguments='"'+$script.Replace('"','')+'" once'
if ($Remove) {
  if ($Apply) { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop; Write-Host "REMOVED $taskName" }
  else { Write-Host "DRY RUN: would remove $taskName" }
  return
}
Write-Host "Repository: $repoRoot"
Write-Host "Runs: $node $arguments"
Write-Host 'Frequency: every minute while machine is awake and task can run.'
Write-Host 'Effect: git fetch + validate + local inbox; NO remote command execution or git pull/reset.'
if (-not $Apply) { Write-Host 'DRY RUN. Re-run with -Apply to register task.'; return }
$action=New-ScheduledTaskAction -Execute $node -Argument $arguments -WorkingDirectory $repoRoot
$trigger=New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1)
$settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description 'Read-only GitHub task intake for Oracle' -Force | Out-Null
Write-Host "REGISTERED $taskName"
