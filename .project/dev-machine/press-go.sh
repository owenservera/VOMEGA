#!/usr/bin/env bash
# Press-go: health → select tasks → prefer Daintree habitat → fallback worktree+CLI.
# Default: --platform-only (no VOMEGA product implementation). Pass --product to enqueue product lanes.
# Habitat preference: Daintree (if cli --status reports running) > git-worktree + one-shot CLI fallback.
# Windows: ZCode is the press-go habitat; see .project/dev-machine/windows-mirror/ (UNVERIFIED_ON_WINDOWS).
# Flags: --dry-run (plan only, no worktrees, no model calls)  --product  --max=N  --no-daintree
set -euo pipefail
DM="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DM/../.." && pwd)"
LOG="${DM}/runs.jsonl"
DRY=0
PRODUCT=0
NO_DAINTREE=0
MAX="${VOMEGA_MAX_PARALLEL:-2}"
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    --product) PRODUCT=1 ;;
    --max=*) MAX="${a#--max=}" ;;
    --no-daintree) NO_DAINTREE=1 ;;
    -h|--help) sed -n '2,6p' "$0"; exit 0 ;;
  esac
done
TS=$(date -Iseconds)
cd "$ROOT"

echo "== press-go =="
"$DM/health-check.sh"

SELECT_ARGS=(--root "$ROOT" --max "$MAX")
if [[ "$PRODUCT" -eq 0 ]]; then
  SELECT_ARGS+=(--platform-only)
fi
QUEUE=$("$DM/select-tasks.py" "${SELECT_ARGS[@]}")
echo "$QUEUE" | tee /tmp/vomega-press-go-queue.json >/dev/null

DAINTREE_OK=0
if [[ "$NO_DAINTREE" -eq 0 && -x /opt/Daintree/resources/daintree-cli.sh ]] && bash /opt/Daintree/resources/daintree-cli.sh --status 2>/dev/null | grep -qi running; then
  DAINTREE_OK=1
fi

python3 - <<PY
import json, os, subprocess, time
from pathlib import Path
q=json.load(open("/tmp/vomega-press-go-queue.json"))
dry=$DRY
daintree=$DAINTREE_OK
root=Path("$ROOT")
dm=Path("$DM")
log=dm/"runs.jsonl"
ts="$TS"
selected=q.get("selected") or []
print(f"tasks={len(selected)} daintree_ok={daintree} dry={dry}")

def logrec(rec):
    with log.open("a") as f:
        f.write(json.dumps(rec)+"\n")

if daintree:
    openers=[
        dm/"bootstrap/open-in-daintree.sh",
        Path("/workspace/daintree-master-automation/scripts/open-in-daintree.sh"),
    ]
    opened=False
    if not dry:
        for o in openers:
            if o.exists():
                subprocess.run([str(o), str(root)], check=False)
                opened=True
                break
        if not opened and Path("/opt/Daintree/resources/daintree-cli.sh").exists():
            subprocess.run(["bash","/opt/Daintree/resources/daintree-cli.sh", str(root)], check=False)
    logrec({"ts":ts,"task_id":"press-go","lane":"DEV","role":"press-go","harness":"daintree",
            "router":"none","model_or_unknown":"n/a","account_or_unknown":"n/a",
            "source_head":subprocess.check_output(["git","rev-parse","--short","HEAD"],cwd=root,text=True).strip(),
            "worktree":str(root),"branch":"main","outcome":"ok" if not dry else "dry-run",
            "tests":"n/a","reviewer":"none","duration_s":0,
            "notes":("would open" if dry else "opened")+" VOMEGA in Daintree; create worktrees+agents in UI per PROCESS.md"})
    print("HABITAT=daintree — create worktrees in UI; task queue printed below")
else:
    print("HABITAT=fallback-worktree")

for t in selected:
    tid=t["id"]; lane=t["lane"]; title=t["title"]; harness=t.get("harness_prefer","claude")
    print(f"- {tid} [{lane}] {title} (harness={harness})")
    if dry:
        continue
    # Always materialize worktree+prompt so Daintree or CLI can pick it up
    subprocess.run([str(dm/"worktree-dispatch.sh"), tid, lane, title, harness], check=True)
    wt=os.path.join(os.environ.get("VOMEGA_WORKTREE_ROOT","/workspace/vomega-worktrees"),tid)
    prompt=f"{wt}/.dev-machine/TASK.md"
    if tid.startswith("DEV-SMOKE") or (not daintree and harness in ("claude","grok","codex")):
        if tid.startswith("DEV-SMOKE"):
            # platform smoke: do not call models
            logrec({"ts":ts,"task_id":tid,"lane":lane,"role":"implementer","harness":"script",
                    "router":"none","model_or_unknown":"n/a","account_or_unknown":"n/a",
                    "source_head":subprocess.check_output(["git","rev-parse","--short","HEAD"],cwd=root,text=True).strip(),
                    "worktree":wt,"branch":f"task/{tid}","outcome":"ok",
                    "tests":"n/a","reviewer":"none","duration_s":0,
                    "notes":"platform smoke worktree created; no model call"})
        else:
            cmd={"claude":["claude","-p",f"Read {prompt} and execute only what it allows. Stop when acceptance met."],
                 "grok":["grok","-p",f"Read {prompt} and execute only what it allows. Stop when acceptance met.","--output-format","plain","--max-turns","8"],
                 "codex":["codex","exec","-C",wt,"-s","workspace-write",f"Read {prompt} and execute only what it allows."]}[harness]
            print("launch", " ".join(cmd))
            # Product launches only with --product; still gated
            subprocess.run(cmd, check=False)

print(json.dumps(q["selected"], indent=2))
PY
