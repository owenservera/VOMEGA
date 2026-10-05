#!/usr/bin/env bash
# Idempotent: create disposable worktree + task prompt stub. Args: task-id lane title [harness]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DM="$(cd "$(dirname "$0")" && pwd)"
TASK_ID="${1:?task-id}"
LANE="${2:?lane}"
TITLE="${3:?title}"
HARNESS="${4:-claude}"
WT_ROOT="${VOMEGA_WORKTREE_ROOT:-/workspace/vomega-worktrees}"
BRANCH="task/${TASK_ID}"
WT_PATH="${WT_ROOT}/${TASK_ID}"
LOG="${DM}/runs.jsonl"
mkdir -p "$WT_ROOT" "$DM"
cd "$ROOT"
HEAD=$(git rev-parse HEAD)
SHORT=$(git rev-parse --short HEAD)
TS=$(date -Iseconds)

if [[ -d "$WT_PATH" ]]; then
  echo "worktree exists: $WT_PATH"
else
  # Prefer branching from main
  git fetch origin main 2>/dev/null || true
  if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
    git worktree add "$WT_PATH" "$BRANCH"
  else
    git worktree add -b "$BRANCH" "$WT_PATH" main
  fi
fi

PROMPT_DIR="${WT_PATH}/.dev-machine"
mkdir -p "$PROMPT_DIR"
TEMPLATE="${DM}/templates/bounded-task.md"
PROMPT_OUT="${PROMPT_DIR}/TASK.md"
if [[ -f "$TEMPLATE" ]]; then
  sed -e "s|{{TASK_ID}}|${TASK_ID}|g" \
      -e "s|{{LANE}}|${LANE}|g" \
      -e "s|{{TITLE}}|${TITLE}|g" \
      -e "s|{{HARNESS}}|${HARNESS}|g" \
      -e "s|{{HEAD}}|${SHORT}|g" \
      -e "s|{{WORKTREE}}|${WT_PATH}|g" \
      "$TEMPLATE" > "$PROMPT_OUT"
else
  printf '# %s (%s)\n\n%s\n' "$TASK_ID" "$LANE" "$TITLE" > "$PROMPT_OUT"
fi

python3 - <<PY
import json
rec={
  "ts":"$TS","task_id":"$TASK_ID","lane":"$LANE","role":"dispatch",
  "harness":"$HARNESS","router":"none","model_or_unknown":"n/a",
  "account_or_unknown":"n/a","source_head":"$SHORT",
  "worktree":"$WT_PATH","branch":"$BRANCH","outcome":"ok",
  "tests":"n/a","reviewer":"none","duration_s":0,
  "notes":"worktree ready; prompt at $PROMPT_OUT"
}
open("$LOG","a").write(json.dumps(rec)+"\n")
print(json.dumps({"worktree":"$WT_PATH","branch":"$BRANCH","prompt":"$PROMPT_OUT","head":"$SHORT"}))
PY
