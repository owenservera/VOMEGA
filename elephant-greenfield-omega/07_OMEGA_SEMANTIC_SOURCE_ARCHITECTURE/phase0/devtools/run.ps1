param([int]$Port = 8770)
$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
  if (Get-Command py -ErrorAction SilentlyContinue) { & py -3 -X utf8 -m devtools.app --port $Port }
  elseif (Get-Command python -ErrorAction SilentlyContinue) { & python -X utf8 -m devtools.app --port $Port }
  else { throw 'Python 3.10+ required.' }
  if ($LASTEXITCODE -ne 0) { throw "Development tools exited with $LASTEXITCODE" }
} finally { Pop-Location }
