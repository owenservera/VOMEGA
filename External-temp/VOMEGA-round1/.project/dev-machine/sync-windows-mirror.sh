#!/usr/bin/env bash
# Keep the Windows pack in two places in step:
#   box mirror  : ${VOMEGA_WINDOWS_MIRROR:-/workspace/mirror-to-windows/VOMEGA-dev-machine}  (handout to Windows)
#   git snapshot: .project/dev-machine/windows-mirror/                                       (durable in git)
# Process docs are copied into the box mirror under process/ (the git snapshot links ../ instead).
# Secret-free: copies only spec/scripts/docs; refuses if a secret-looking file shows up.
set -euo pipefail
DM="$(cd "$(dirname "$0")" && pwd)"
MIRROR="${VOMEGA_WINDOWS_MIRROR:-/workspace/mirror-to-windows/VOMEGA-dev-machine}"
SNAP="$DM/windows-mirror"
[[ -d "$MIRROR" ]] || { echo "no mirror at $MIRROR"; exit 1; }
if find "$MIRROR" -type f \( -name '*.env' -o -name 'auth.json' -o -name '*.credentials*' -o -name '*.key' -o -name 'verify-report.json' \) | grep -q .; then
  echo "REFUSE: secret-looking or machine-local file in $MIRROR"; exit 2
fi
mkdir -p "$SNAP" "$MIRROR/process/templates"
for f in README.md INDEX.md desired-state.json bootstrap-vomega-dev.ps1 verify-vomega-dev.ps1 press-go-vomega.ps1; do
  cp "$MIRROR/$f" "$SNAP/$f"
done
for f in PROCESS.md ARCHITECTURE.md HARNESS-MATRIX.md META-WORKSTREAM-DISPATCH.md WINDOWS-PARITY.md RUN-LOG-SCHEMA.md README.md; do
  [[ -f "$DM/$f" ]] && cp "$DM/$f" "$MIRROR/process/$f"
done
cp "$DM"/templates/*.md "$MIRROR/process/templates/"
cp "$DM/select-tasks.py" "$MIRROR/process/select-tasks.py"
echo "synced: $MIRROR <-> $SNAP"
