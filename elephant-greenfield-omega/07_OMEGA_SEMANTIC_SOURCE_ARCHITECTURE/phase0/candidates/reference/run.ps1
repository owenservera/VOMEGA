Push-Location "$PSScriptRoot/../.."
try { py -3 lab.py candidate; if ($LASTEXITCODE -ne 0) { throw "Candidate generation failed" } } finally { Pop-Location }
