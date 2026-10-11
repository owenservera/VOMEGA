param([string]$Destination = "$env:LOCALAPPDATA\OmegaSemanticPhase0")
$ErrorActionPreference = 'Stop'
if (Test-Path $Destination) { throw 'Destination exists. Choose a new directory to avoid overwriting local work.' }
New-Item -ItemType Directory -Path $Destination | Out-Null
# Copy this bounded, dependency-free lab; exclude private scratch and interpreter caches.
Get-ChildItem -LiteralPath $PSScriptRoot -Force | Where-Object { $_.Name -notin @('.replay','.local','__pycache__') } | Copy-Item -Destination $Destination -Recurse
& "$Destination\run.ps1" verify
Write-Host "Installed and verified. Start with: & '$Destination\run.ps1' demo"
