# Development Agent Claim

Claim ID: 20261006-1932-pm-team-always-on-zcode
Status: CLAIMED
Registered at: 2026-10-06T19:32:53Z
Last updated: 2026-10-06T19:32:53Z
Agent / harness: ZCode main session (PM-LEAD) + bounded PM subagents
Model: session model (router-selected); no provider/model configuration read or written
Source HEAD: d17c7d3 (local main; 10 commits ahead of origin 412c505 — owner decides push)
Branch / worktree: main / C:/0-BlackBoxProject-0/VOMEGA
Work: Set up the always-on PM team: a recurring PM cycle that keeps the PM projection synchronized with truth (Ratchet board, claims, evidence), runs the PM self-checks, maintains the five owner-scoped programs' dossier state from evidence, and routes discrepancies to Truth — under the standing rule that PM is projection, not truth, and never decisioning.
Program / phase / task refs: `.project/pm/` (scope.json, build-plan.json, data/programs/*.json, generated/); MP-21/54/55/56/60
Expected write surface: `.project/dev-loop/PM-TEAM.md`, `.project/pm/team.json` (measured/runtimeVerified facts only), `.local/pm/**` (ignored), `.project/agentic-launch/STATUS.md`, `.project/agentic-launch/claims/**`, `.project/COMMONS.md`
Expected handoff / proof: design doc; PM automation registered (or exact registration spec recorded if this session cannot host a second automation); first live sweep with real `bun run pm:check`/`pm:test` results; STATUS/Commons updated
Dependencies / blockers: preserved in-flight D1-026 work (compile.ts, d1-claims.json) belongs to the interrupted dev-loop cycle — not touched by this claim; cron-in-session limit may force registration spec instead of live automation
