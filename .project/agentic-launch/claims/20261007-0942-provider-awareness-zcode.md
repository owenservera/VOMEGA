# Development Agent Claim

Claim ID: 20261007-0942-provider-awareness-zcode
Status: COMPLETE
Registered at: 2026-10-07T09:42:07Z
Last updated: 2026-10-07T09:50:00Z
Agent / harness: ZCode main session — PM team standing thread 4 (owner-directed expansion: provider/model awareness + daily availability testing)
Model: session model (router-selected)
Source HEAD: 138b82a (main, ahead 19 of origin/main — push is owner's call)
Branch / worktree: main / C:/0-BlackBoxProject-0\VOMEGA
Work: Owner directive (auth/provider read-only boundary explicitly lifted for awareness + testing): build full, current awareness of ALL ZCode-wired providers and their models, live-probe availability, publish a durable ledger the team can discover (claude voice route via local proxy), and wire a daily availability probe into the devops sweep / governor automation.
Program / phase / task refs: `.project/dev-loop/` (council §6, devops §3/§7, PROVIDER-AVAILABILITY.md, provider-probe.mjs)
Expected write surface: `.project/dev-loop/PROVIDER-AVAILABILITY.md` (new), `.project/dev-loop/provider-probe.mjs` (new), `.project/dev-loop/DESIGN-COUNCIL.md` (§6 voice rows), `.project/dev-loop/DEVOPS-TEAM.md` (sweep spec + §7 facts), `.local/**` probe log (ignored), governor automation prompt (step 3b), `.project/agentic-launch/claims/**`, `.project/COMMONS.md`
Expected handoff / proof: live probe results per enabled provider with timestamps; ledger enumerating all providers + models; council/devops docs updated; automation step 3b carries the daily probe
Dependencies / blockers: local proxy (127.0.0.1:8317) and opencode proxy (localhost:6446) liveness is owner infrastructure — probe reports state, never repairs; API keys stay out of repo docs (reference the config file path only)

## Closeout

Final status: COMPLETE
Delivered:
- **Awareness**: `~/.zcode/v2/provider_config.json` read in full — 15 providers (9 enabled: openrouter, new-provider "owen", opencode-acct-2..5, claude-code-oauth, codex-oauth, grok-build-oauth; 6 disabled: opencode-zen-chat-2, opencode-zen-responses, opencode-zen-responses-2, zai-standard-api, kilocode-free, openai). Full verbatim model inventory generated into `.project/dev-loop/PROVIDER-AVAILABILITY.md` §4 (regenerate whenever the config changes). Wiring already matched the owner-provided claude values exactly (claude-code-oauth: anthropic-messages @ 127.0.0.1:8317, key prefix cpa-local-1…) — no config edit needed or made.
- **Live probe (2026-10-07 09:43Z, real requests)**: claude-code-oauth PASS (200, 1.1s, haiku-4-5; proxy serves all 18 wired claude models), codex-oauth PASS (200, 2.0s, gpt-5.5), opencode 6446 PASS ×5 keys (space-bunny-free, 12–13.7s), openrouter PASS (models list + free-model generation). FAIL: grok-build-oauth — proxy returns 400 "unknown provider for model" for all three wired grok models and serves no grok models at all (routed to Owen, report-only). kilocode 5380 unreachable (disabled, consistent). Proxy 8317 serves 32 models including 5 gpt-image models wired to no provider.
- **Daily test**: `.project/dev-loop/provider-probe.mjs` (reads keys from config, never prints them, JSONL to git-ignored `.local/ops/provider-probe.log`, non-zero exit on any fail) folded into governor automation step 3b via CronUpdate — 24h throttle from the log's last timestamp, NEW-fail = Truth AND Product + Commons, known-fail = recorded standing state (YELLOW class). Verified in the live prompt; automation title updated. Runs ~daily with the devops sweep without a new automation.
- **Discoverability**: DESIGN-COUNCIL.md §6 claude row → LIVE at API level via the wired provider (CLI probe stays Owen-reserved), grok row → UNAVAILABLE with both failure modes recorded, codex row gains the API-route note; DEVOPS-TEAM.md §3 gains the probe step, §7 gains a providers facts row and the voice note corrected; Commons row recorded.
Known gaps / failures: grok has no routing at the local proxy despite the provider being enabled — Owen-reserved (routing or key route needed); `claude -p` CLI OAuth still expired (irrelevant to provider-routed voices; re-auth Owen-reserved); the probe's first grok row in the log is a 400-class fail recorded verbatim.
Next handoff: the daily probe now runs with the devops sweep (24h throttle); any previously-passing route that fails routes to Truth AND Product; this thread keeps the ledger current on provider/model changes.
