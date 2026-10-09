# Development Agent Claim

Claim ID: 20261007-0955-model-selection-zcode
Status: COMPLETE
Registered at: 2026-10-07T09:55:14Z
Last updated: 2026-10-07T10:02:00Z
Agent / harness: ZCode main session — PM team standing thread 4 (owner-directed: model availability + selection protocol for chatgpt/claude families)
Model: session model (router-selected)
Source HEAD: 138b82a (main, ahead 19 of origin/main — push is owner's call)
Branch / worktree: main / C:/0-BlackBoxProject-0\VOMEGA
Work: Per-model availability probing for the two local-proxy families (claude-code-oauth ×18 models, codex-oauth ×9 models @ 127.0.0.1:8317) and a deterministic selection protocol (MODEL-SELECTION.md).
Program / phase / task refs: `.project/dev-loop/` (MODEL-SELECTION.md new, PROVIDER-AVAILABILITY.md §3b/§2/§5, provider-probe.mjs extended, council §6, devops §3/§7)
Expected write surface: as registered; plus governor automation prompt step 3b (CronUpdate, provider + model probe)
Expected handoff / proof: per-model probe results (real HTTP outcomes for all 27 family models); protocol doc with owner ladder + classes; team docs referencing it; probe log rows

## Closeout

Final status: COMPLETE
Delivered:
- **Per-model availability evidence (real requests, 09:46Z)**: claude family **11/18 generation-PASS** — fable-5-1 and fable-5 are served but 429 "Usage credits are required" (credits-blocked, effective claude top = `claude-opus-5-5`), and 5 listed models (opus-4-1-20250805, opus-4-20250514, sonnet-4-20250514, 3-7-sonnet-20250219, 3-5-haiku-20241022) 404 at generation despite appearing in `/v1/models` — the endpoint list overstates availability. codex/gpt family **9/9 PASS** (gpt-6-sol, gpt-6.1-sol, gpt-6-luna, gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5, codex-auto-review). Results in PROVIDER-AVAILABILITY.md §3b.
- **Selection protocol**: `.project/dev-loop/MODEL-SELECTION.md` — deterministic selection over the **owner-authored `modelOrder` ladder** (read from the config at selection time, never rewritten by the protocol); three purpose classes (REVIEW/VOICE top-down, QUICK bottom-up, REVIEW-DEV = codex-auto-review purpose-only) with class floors (claude: sonnet-5; chatgpt: gpt-5.6-luna), availability gate (generation-PASS < 24h, stale → re-probe), mid-task fallback chains with mandatory recording, and one-line `model-selection:` records on every routed task; honest `<family> <class> UNAVAILABLE` instead of silent downgrade; council independence still requires different families, not two models of one family.
- **Probe extended**: provider-probe.mjs now sweeps every wired model of both 8317 families per run (served-set check + tiny generation), same JSONL log; the 24h-throttled daily run happens with the devops sweep.
- **Wired in**: governor automation step 3b updated via CronUpdate (provider + model probe; new-fail vs known-fail classification extended to models; MODEL-SELECTION.md referenced for lane routing); DESIGN-COUNCIL.md §6 gains the voice-model selection rule with current effective picks; DEVOPS-TEAM.md §3 probe step and §7 providers row updated; ledger §2/§5 consistent.
Known gaps / failures (routed to Owen, report-only): fable-5-1/fable-5 need usage credits on the proxy account; 5 claude models are listed by the proxy but unroutable (list vs routing stale — owner call which side to fix); grok still unrouted (previous claim); `claude -p` CLI OAuth still expired (irrelevant to provider-routed selection).
Next handoff: lanes/council write `model-selection:` lines from the next task on; the daily sweep refreshes per-model availability; any previously-passing model that fails routes Truth AND Product.
