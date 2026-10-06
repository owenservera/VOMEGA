[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('setup', 'quick', 'test', 'cli', 'host', 'status')]
    [string]$Action = 'status',
    [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
    [string[]]$OmegaArguments = @()
)

$ErrorActionPreference = 'Stop'
$runtimeCandidates = @()
$pathRuntime = Get-Command bun.exe -ErrorAction SilentlyContinue
if ($pathRuntime) { $runtimeCandidates += $pathRuntime.Source }
if ($env:USERPROFILE) { $runtimeCandidates += Join-Path $env:USERPROFILE '.bun\bin\bun.exe' }
$runtimePath = $runtimeCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
if (-not $runtimePath) { throw 'Bun executable unavailable. Use an existing Bun installation; this script does not install or reconfigure tools.' }

$baselineRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'omega-baseline'
$originalPath = $env:PATH
$resultCode = 1
Push-Location -LiteralPath $baselineRoot
try {
    # Children must find this executable too, instead of a stale package-manager shim.
    $env:PATH = (Split-Path -Parent $runtimePath) + [IO.Path]::PathSeparator + $originalPath
    & $runtimePath run "omega:$Action" @OmegaArguments
    $resultCode = $LASTEXITCODE
} finally {
    $env:PATH = $originalPath
    Pop-Location
}
exit $resultCode
