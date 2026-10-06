#!/usr/bin/env python3
"""Select bounded unblocked tasks from STATUS + optional candidates JSON. No LLM. Secret-free."""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

LANES = ["SDW", "LNC", "VFX", "SKW", "EXP", "PRV", "RTE", "DEV", "TRU"]

def parse_status(text: str) -> dict:
    """Extract lane -> next gate snippet from STATUS markdown table."""
    out = {}
    for line in text.splitlines():
        if not line.startswith("|"):
            continue
        cols = [c.strip() for c in line.strip("|").split("|")]
        if len(cols) < 4:
            continue
        lane = cols[0]
        if lane in LANES:
            out[lane] = {
                "first_task": cols[1],
                "state": cols[2],
                "next": cols[3],
            }
    return out

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    ap.add_argument("--max", type=int, default=2)
    ap.add_argument("--candidates", type=Path, default=None)
    ap.add_argument("--platform-only", action="store_true",
                    help="Only emit DEV platform smoke tasks (no product lanes)")
    args = ap.parse_args()
    status_path = args.root / ".project/agentic-launch/STATUS.md"
    status = parse_status(status_path.read_text(encoding="utf-8")) if status_path.exists() else {}

    cand_path = args.candidates or (Path(__file__).resolve().parent / "bootstrap/first-wave-candidates.REFERENCE.json")
    candidates = []
    if cand_path.exists():
        candidates = json.loads(cand_path.read_text(encoding="utf-8"))

    selected = []
    if args.platform_only:
        selected.append({
            "id": "DEV-SMOKE-01",
            "lane": "DEV",
            "title": "Platform smoke: health-check + dry worktree create/remove (no product code)",
            "harness_prefer": "script",
            "reviewer_prefer": "none",
            "paths": [
                ".project/dev-machine/health-check.sh",
                ".project/dev-machine/worktree-dispatch.sh",
                ".project/agentic-launch/STATUS.md",
            ],
        })
    else:
        # Prefer reference candidates whose lane next-gate looks open; else synthesize from STATUS next text
        for c in candidates:
            if len(selected) >= args.max:
                break
            lane = c.get("lane")
            # Skip wave-2 explicit blockers in notes
            why = (c.get("why_unblocked") or "")
            if "NOT yet" in why:
                continue
            # harness_prefer / reviewer_prefer are placeholders that were reachable on the
            # Linux box, not routing policy. Route from current capacity and evidence.
            selected.append({
                "id": c["id"],
                "lane": lane,
                "title": c["title"],
                "harness_prefer": "claude",
                "reviewer_prefer": "grok",
                "paths": [
                    ".project/agentic-launch/STATUS.md",
                    ".project/META-TRACKER.md",
                    f".project/agentic-launch/handoffs/",
                ],
                "acceptance": c.get("acceptance"),
            })

    print(json.dumps({"status_lanes": status, "selected": selected[: args.max]}, indent=2))
    return 0

if __name__ == "__main__":
    sys.exit(main())
