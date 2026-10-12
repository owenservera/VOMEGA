#!/usr/bin/env bash
# Reproduce every claim in RUN-NOTE.md.
#
# Read-only with respect to main, the master, the seed and every other run
# directory. Writes only into this directory. No network, no credentials.
set -uo pipefail
cd "$(dirname "$0")"

fail=0
run() {
  local label="$1"; shift
  local expect="$1"; shift
  echo "── $label"
  if "$@"; then
    echo "   ✓ $label"
  else
    echo "   ✗ $label (expected: $expect)"
    fail=1
  fi
  echo
}

echo "=== MASTER-EXEC-2026-10-12 — reproduction ==="
echo "node $(node --version)"
echo

run "master custody (26 sections)" \
    "ALL_26_SECTIONS_CUSTODY_OK"      node custody-check.mjs --json
run "custody checker negative control" \
    "NEGATIVE CONTROL PASS"           node custody-negative-control.mjs
run "Decision 1 real-source cohort" \
    "REAL_SOURCE_COHORT_CUSTODY_OK"   node real-source-custody.mjs
run "Decision 2 + Section 18 S1" \
    "S1_CLAIMS_VERIFIED_AND_DETECTOR_DISCRIMINATES" node symbolic-s1.mjs

echo "── prior-round custody (REVIEWER-R1)"
cd ../REVIEWER-R1-2026-10-12 || exit 1
if node reviewer-witness.mjs --check; then echo "   ✓ reviewer witness 6/6"; else echo "   ✗ reviewer witness"; fail=1; fi
if node negative-control.mjs >/dev/null; then echo "   ✓ reviewer negative control 3/3"; else echo "   ✗ reviewer negative control"; fail=1; fi
if node dts-mutation-check.mjs >/dev/null; then echo "   ✓ W7 VERIFIED"; else echo "   ✗ W7"; fail=1; fi

echo
echo "── sections 23-26 protocol backbone"
cd ../../protocol-backbone || exit 1
if node tools/validate.mjs | grep -q '"ok": true'; then echo "   ✓ backbone validates ok:true"; else echo "   ✗ backbone validation"; fail=1; fi
if node --test tools/validate.test.mjs >/dev/null 2>&1; then echo "   ✓ backbone tests 2/2"; else echo "   ✗ backbone tests"; fail=1; fi

echo
if [ "$fail" -eq 0 ]; then
  echo "ALL CHECKS PASS"
else
  echo "ONE OR MORE CHECKS FAILED — do not treat this run's claims as holding"
fi
exit "$fail"