# Non-destructive Windows simulation. No provider/auth access.
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
Push-Location $PSScriptRoot
try {
  $node = Get-Command node -ErrorAction Stop
  Write-Host "Using Node: $($node.Source)"
  & node --test ./tools/ecp/ecp.test.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Mock protocol tests failed.' }
  & node ./tools/ecp/ecp.mjs demo
  if ($LASTEXITCODE -ne 0) { throw 'Mock demo failed.' }
} finally { Pop-Location }
