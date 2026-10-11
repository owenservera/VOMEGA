param([ValidateSet('demo','verify','test','status','baseline','goldens','candidate','B1','B2','B3','B4')][string]$Command = 'demo')
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        & py -3 -X utf8 lab.py $Command
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        & python -X utf8 lab.py $Command
    } else {
        throw 'Install Python 3.10 or newer with the Windows Python launcher, then run this script again.'
    }
    if ($LASTEXITCODE -ne 0) { throw "Phase 0 failed with exit code $LASTEXITCODE" }
} finally { Pop-Location }
