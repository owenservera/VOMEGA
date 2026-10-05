#!/usr/bin/env bash
# From a worktree path: run tests, optionally require REVIEW_OK file, ff-merge or PR, remove worktree.
# Usage: integrate.sh <worktree-path> [--pr] [--skip-tests]
set -euo pipefail
DM="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DM/../.." && pwd)"
WT="${1:?worktree path}"
shift || true
USE_PR=0
SKIP_TESTS=0
for a in "$@"; do
  case "$a" in
    --pr) USE_PR=1 ;;
    --skip-tests) SKIP_TESTS=1 ;;
  esac
done
LOG="${DM}/runs.jsonl"
TS=$(date -Iseconds)
cd "$WT"
[[ -d omega-baseline ]] || { echo "not a VOMEGA worktree: $WT"; exit 1; }
BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHORT=$(git rev-parse --short HEAD)
TASK_ID=$(basename "$WT")
START=$(date +%s)

if [[ ! -f "${WT}/.dev-machine/REVIEW_OK" && "${VOMEGA_ALLOW_UNREVIEWED:-0}" != "1" ]]; then
  echo "REFUSE: missing ${WT}/.dev-machine/REVIEW_OK (set VOMEGA_ALLOW_UNREVIEWED=1 to override)"
  exit 2
fi

TESTS="skipped"
if [[ "$SKIP_TESTS" -eq 0 ]]; then
  if (cd omega-baseline && bun test plugins/vivim-nlcl) >/tmp/integrate-nlcl.txt 2>&1; then
    TESTS="vivim-nlcl ok"
  else
    echo "tests failed"; tail -40 /tmp/integrate-nlcl.txt; exit 1
  fi
  if [[ "${VOMEGA_INTEGRATE_QUICK:-0}" == "1" ]]; then
    (cd omega-baseline && bun run omega:quick) >/tmp/integrate-quick.txt 2>&1 && TESTS="$TESTS; omega:quick ok" || { echo "omega:quick failed"; exit 1; }
  fi
fi

cd "$ROOT"
git checkout main
git pull --ff-only origin main 2>/dev/null || true
if [[ "$USE_PR" -eq 1 ]]; then
  git push -u origin "$BRANCH"
  gh pr create --fill --base main --head "$BRANCH" || true
  OUTCOME="pr_opened"
else
  git merge --ff-only "$BRANCH"
  OUTCOME="merged_ff"
fi

git worktree remove --force "$WT" 2>/dev/null || true
git branch -D "$BRANCH" 2>/dev/null || true
END=$(date +%s)
DUR=$((END-START))
python3 - <<PY
import json
rec={
  "ts":"$TS","task_id":"$TASK_ID","lane":"unknown","role":"integrate",
  "harness":"script","router":"none","model_or_unknown":"n/a",
  "account_or_unknown":"n/a","source_head":"$SHORT",
  "worktree":"$WT","branch":"$BRANCH","outcome":"$OUTCOME",
  "tests":"$TESTS","reviewer":"REVIEW_OK file","duration_s":$DUR,
  "notes":"integrate.sh"
}
open("$LOG","a").write(json.dumps(rec)+"\n")
print(rec["outcome"])
PY
