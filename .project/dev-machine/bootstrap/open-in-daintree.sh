#!/usr/bin/env bash
# Open the VOMEGA repo (or $1) in the installed Daintree app on DISPLAY=:16.
set -euo pipefail

TARGET="${1:-$(cd "$(dirname "$0")/../../.." && pwd)}"
CLI="/opt/Daintree/resources/daintree-cli.sh"
APP="/opt/Daintree/daintree"
DISPLAY_NUM="${DAINTREE_DISPLAY:-:16}"

if [[ ! -d "$TARGET" ]]; then
  echo "open-in-daintree: not a directory: $TARGET" >&2
  exit 1
fi

ABS="$(cd -- "$TARGET" && pwd -P)"

export DISPLAY="$DISPLAY_NUM"

if [[ -x "$CLI" ]]; then
  # Hands path to running instance via --cli-path= (single-instance friendly).
  exec bash "$CLI" "$ABS"
fi

# Fallback: launch Electron binary with the folder as arg.
if [[ -x "$APP" ]]; then
  setsid bash -lc "$APP \"$ABS\"" &
  exit 0
fi

echo "open-in-daintree: Daintree not found under /opt/Daintree" >&2
exit 1
