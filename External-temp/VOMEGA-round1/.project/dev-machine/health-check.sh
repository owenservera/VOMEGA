#!/usr/bin/env bash
# Deterministic environment gate for VOMEGA press-go. Secret-free. Exit 0 = healthy enough to dispatch.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
PASS=0; FAIL=0; WARN=0
ok()  { echo "OK   $*"; PASS=$((PASS+1)); }
bad() { echo "FAIL $*"; FAIL=$((FAIL+1)); }
warn(){ echo "WARN $*"; WARN=$((WARN+1)); }

echo "== VOMEGA health-check =="
echo "root=$ROOT"
echo "time=$(date -Iseconds)"

command -v git >/dev/null && ok "git $(git --version | awk '{print $3}')" || bad "git missing"
command -v bun >/dev/null && ok "bun $(bun --version)" || bad "bun missing"
command -v gh >/dev/null && ok "gh present" || warn "gh missing (PR integrate degraded)"
command -v claude >/dev/null && ok "claude present" || warn "claude missing"
command -v grok >/dev/null && ok "grok present" || warn "grok missing"
command -v codex >/dev/null && ok "codex present" || warn "codex missing"

if [[ -x /opt/Daintree/resources/daintree-cli.sh ]]; then
  if bash /opt/Daintree/resources/daintree-cli.sh --status 2>/dev/null | grep -qi running; then
    ok "daintree running (cli --status)"
  elif pgrep -f '/opt/Daintree/daintree' >/dev/null; then
    ok "daintree process present"
  else
    warn "daintree installed but not running (press-go can start it or use worktree fallback)"
  fi
  dpkg-query -W -f='daintree ${Version} ${Status}\n' daintree 2>/dev/null | grep -q "install ok installed" \
    && ok "daintree package configured" || warn "daintree package not fully configured"
else
  warn "daintree-cli.sh missing — fallback = git worktree + CLI"
fi

command -v opencode >/dev/null 2>&1 && opencode --version >/dev/null 2>&1 \
  && ok "opencode" || warn "opencode REPAIR_REQUIRED (nvm)"

command -v kilo >/dev/null 2>&1 && kilo --version >/dev/null 2>&1 \
  && ok "kilo" || warn "kilo REPAIR_REQUIRED (nvm)"
[[ -s "$HOME/.nvm/nvm.sh" ]] && ok "nvm present" || warn "nvm missing (REPAIR_REQUIRED for opencode/kilo)"
command -v zcode >/dev/null 2>&1 && ok "zcode present" || echo "INFO zcode absent on Linux (independent Windows ZCode habitat; expected)"
[[ -d omega-baseline/node_modules ]] && ok "omega-baseline/node_modules present" || warn "omega-baseline deps not installed (cd omega-baseline && bun install)"
git diff --quiet HEAD -- . ':(exclude).project/dev-machine/runs.jsonl' 2>/dev/null && ok "tracked tree clean" || warn "tracked tree has local modifications"

HEAD=$(git rev-parse --short HEAD 2>/dev/null || echo unknown)
ok "repo HEAD $HEAD"
git rev-parse --abbrev-ref HEAD | grep -qx main && ok "on main" || warn "not on main ($(git rev-parse --abbrev-ref HEAD))"

# Smoke: omega:quick can start (do not full-run unless VOMEGA_HEALTH_FULL=1)
if [[ "${VOMEGA_HEALTH_FULL:-0}" == "1" ]]; then
  if (cd omega-baseline && bun run omega:quick) >/tmp/omega-quick-health.txt 2>&1; then
    ok "omega:quick passed"
  else
    bad "omega:quick failed (see /tmp/omega-quick-health.txt)"
  fi
else
  if grep -q '"omega:quick"' omega-baseline/package.json 2>/dev/null; then
    ok "omega:quick script present (set VOMEGA_HEALTH_FULL=1 to execute)"
  else
    warn "omega:quick script not found in omega-baseline/package.json"
  fi
fi

echo "-- summary pass=$PASS warn=$WARN fail=$FAIL --"
# Healthy enough if no hard fails
[[ "$FAIL" -eq 0 ]]
