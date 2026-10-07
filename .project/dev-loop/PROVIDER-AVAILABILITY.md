# Provider availability ledger — ZCode-wired providers and models

Status: **ACTIVE** (owner directive, 2026-10-07: full current awareness of all ZCode-wired providers + models, and a daily availability test)
Claim: [`../agentic-launch/claims/20261007-0942-provider-awareness-zcode.md`](../agentic-launch/claims/20261007-0942-provider-awareness-zcode.md)
Companions: [DEVOPS-TEAM.md](DEVOPS-TEAM.md) (daily probe carrier) · [DESIGN-COUNCIL.md](DESIGN-COUNCIL.md) (voice routing) · [PM-TEAM.md](PM-TEAM.md)

## 1. What this ledger is

The single authoritative view of **which providers/models are actually wired into ZCode on this
machine and whether they are actually available**. Two different facts, never conflated:

- **Wired** = declared in `~/.zcode/v2/provider_config.json` (15 providers). Wired ≠ available.
- **Served** = the endpoint itself lists/routes the model. Only a live probe proves served.

This is observation, never authority: the ledger reports state; it never edits provider
configuration (owner-reserved) and never repairs endpoints. Probe failures route to the owner
via Commons, exactly like the devops sweep routes other environment facts.

Secrets stay out of the repo: keys are referenced by 10-char prefix only; the full keys live in
the config file, which is outside version control.

## 1a. Currently dark — read this first (measured 2026-10-07 09:43–09:46Z)

Do not dispatch anything in this list. Every entry carries route · model · status ·
measured · failure mode.

| Route | Model | Status | Measured | Failure mode |
| --- | --- | --- | --- | --- |
| claude-code-oauth | claude-fable-5-1, claude-fable-5 | DARK | 2026-10-07 09:46Z | 429 — account has no usage credits |
| claude-code-oauth | claude-opus-4-1-20250805, claude-opus-4-20250514, claude-sonnet-4-20250514, claude-3-7-sonnet-20250219, claude-3-5-haiku-20241022 | DARK | 2026-10-07 09:46Z | 404 — listed by the proxy, not routable at generation |
| grok-build-oauth | grok-build-0.1, grok-4.6, grok-4.3 | DARK | 2026-10-07 09:43Z | no proxy routing (400 "unknown provider for model") |
| kilocode-free | (all) | DARK | 2026-10-07 09:43Z | endpoint unreachable (provider disabled in config) |
| opencode-zen-chat-2, opencode-zen-responses, opencode-zen-responses-2, zai-standard-api, openai | (all) | OFF | 2026-10-07 | disabled in `provider_config.json` — owner-reserved, never probed while off |

Live and verified at the same timestamp: **codex-oauth 9/9** (gpt-6-sol, gpt-6.1-sol,
gpt-6-luna, gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5,
codex-auto-review), **claude-code-oauth 11/18**, openrouter PASS, and the five
opencode/new-provider free routes (`space-bunny-free` on new-provider + acct-2..5) PASS.

## 1b. Model routing — what is actually controllable (corrected 2026-10-07, DESK D-20261007-013)

D-20261007-010 asked every subagent dispatch to choose a model from a fallback ladder.
**D-013 superseded it: the standard Agent tool has no model argument.** Its schema
(checked by the DEVops thread) exposes only `description`, `prompt`,
`run_in_background` and `subagent_type`. A persona or prompt instruction does not
select a model. So:

- **Subagents inherit their model from the harness.** No per-dispatch fallback exists
  through the Agent tool, and none has been tested.
- **Thread session models are owner-selected and have no automatic fallback.** If a
  thread's model goes dark, that thread fails until Owen re-picks. Preserve his
  selections; never re-pin or change provider/model configuration.
- **Workflow runs** (`CreateWorkflow` / `AmendWorkflow`) do accept a `subagent_model`.
  That is the only explicit routing control seen in the tool schemas so far. It has
  not been tested as a fallback, and using it is the owner's call.

Preference order if a supported selector is ever used (the original ladder, kept for
reference): GPT/Codex family (9/9 live) → Claude family (11/18 live) → free routes. Never
the §1a dark models.

**Routing entrypoint (owner directive 2026-10-07).** Model routing goes through the single
entrypoint `~/.agents/skills/cliproxy-router/cliproxy.mjs`; this project's overlay is
`.zcode/cliproxy-router.json` (profiles fast / build / reason / review / long-context).
The `claude-*`, `gpt-*`, `grok-*` and `codex-*` ids are CPA-routed and their live
selection is decided by that entrypoint. Port 6446 (`new-provider`, `opencode-acct-2..5`)
and `openrouter` are **not** CPA and stay outside that entrypoint.

**The §1a dark list is a RECORD, not the router's decision input.** The router excludes
cooled and unroutable models itself; this ledger reports only what was measured.

This file reports liveness only. A passing probe here does **not** prove that any
session or subagent fallback works.

## 1c. Reserve tier (non-CPA) — measured 2026-10-07 19:14Z (DESK D-20261007-018)

These routes sit outside the CPA overlay by construction: the router enumerates CPA
`/v1/models`, and `providerFor()` maps only `claude-*`, `gpt-*`, `codex-*` and `grok-*`.
They are tracked here as an explicit reserve. Each was probed with one tiny generation
(≤8 tokens); the full family sweep was not run.

| Route | Endpoint | Model | Status | Measured | Latency | Failure mode / state |
| --- | --- | --- | --- | --- | --- | --- |
| new-provider | localhost:6446 | space-bunny-free | PASS | 2026-10-07 19:14Z | 1.5s | — |
| opencode-acct-2 | localhost:6446 | space-bunny-free | PASS | 2026-10-07 19:14Z | 1.1s | — |
| opencode-acct-3 | localhost:6446 | space-bunny-free | PASS | 2026-10-07 19:14Z | 0.9s | — |
| opencode-acct-4 | localhost:6446 | space-bunny-free | PASS | 2026-10-07 19:14Z | 0.9s | — |
| opencode-acct-5 | localhost:6446 | space-bunny-free | PASS | 2026-10-07 19:14Z | 0.7s | — |
| openrouter | openrouter.ai | openrouter/free (+ nemotron-3.5-lightning:free) | PASS | 2026-10-07 19:14Z | 0.8s / 6.2s | **Not at 0.** Key status: usage 9.57 of a 50 limit, **40.43 credits remaining**, `is_free_tier=false`, no rate limit reported. Free models generate. |

The report that OpenRouter was "at 0" did not reproduce at 19:14Z: credits are not
exhausted, there is no rate limit, and free models are still served. If a dashboard shows
0, it is not this key's measured state.

**Counting rule.** The five 6446 accounts all serve the **same model**
(`space-bunny-free`). They give concurrency (parallel breadth), not quorum independence,
so they count as **one family**. A council ruling still needs two independent families
from the CPA tier.

## 2. How to re-derive (every sweep)

```sh
bun .project/dev-loop/provider-probe.mjs   # from the VOMEGA repo root
```

The script reads the config for endpoints/keys (never prints them), fires one minimal live
request per enabled route **plus a per-model generation sweep of both local-proxy families**
(claude ×18, gpt ×9 — §3b), appends JSONL to the git-ignored
`.local/ops/provider-probe.log`, prints PASS/FAIL per route and per model, and exits non-zero
if any route or model fails. Daily cadence: the devops sweep (governor automation step 3b) runs
it **at most once per 24 h** (last-run date from the probe log's final line), same throttle
pattern as the council voice probe. Model selection from these results:
[MODEL-SELECTION.md](MODEL-SELECTION.md).

## 3. Latest probe — 2026-10-07 ~09:43Z (first run)

| Route | Endpoint / API | Model probed | Result |
| --- | --- | --- | --- |
| claude-code-oauth | 127.0.0.1:8317 anthropic-messages | claude-haiku-4-5-20251001 | **PASS** 200, 1.1s |
| codex-oauth | 127.0.0.1:8317 openai-responses | gpt-5.5 | **PASS** 200, 2.0s |
| grok-build-oauth | 127.0.0.1:8317 openai-responses | grok-build-0.1 (+ grok-4.6, grok-4.3) | **FAIL** 400 — proxy: "unknown provider for model …" (no grok routing at endpoint) |
| new-provider "owen" | localhost:6446 openai-chat-completions | space-bunny-free | **PASS** 200, 12.0s |
| opencode-acct-2 | localhost:6446 | space-bunny-free | **PASS** 200, 12.3s |
| opencode-acct-3 | localhost:6446 | space-bunny-free | **PASS** 200, 13.7s |
| opencode-acct-4 | localhost:6446 | space-bunny-free | **PASS** 200, 12.0s |
| opencode-acct-5 | localhost:6446 | space-bunny-free | **PASS** 200, 12.0s |
| openrouter (key) | openrouter.ai models list | (list) | **PASS** 200 |
| openrouter (gen) | openrouter.ai chat | openrouter/free | **PASS** 200, 1.3s (routed → nemotron-3.5-lightning:free) |
| kilocode-free (disabled) | 127.0.0.1:5380 | — | **UNREACHABLE** (consistent with disabled; not probed daily) |

Served-vs-wired deltas at the local proxy (8317, serves 32 models): all 18 wired claude models
served; all 9 wired codex/gpt models served; **3 wired grok models served by none**; the proxy
additionally serves 5 gpt-image models (`gpt-image-2.5`, `-2.5-flare`, `-2.5-sunburst`,
`gpt-image-2`, `gpt-image-1.5`) that are wired to no provider. The opencode proxy (6446) serves
exactly the 9 models wired to new-provider/acct-2..5.

Open items for the owner (routed, report-only): grok routing absent at the local proxy despite
`grok-build-oauth` being enabled — grok council voice stays UNAVAILABLE at API level until the
proxy gains routing or a key route exists; `claude` voice is now **LIVE** at API level (council
§6 updated accordingly).

## 3b. Per-model sweep — 8317 families, 2026-10-07 09:46Z (first run)

The daily probe sweeps every wired model of both local-proxy families with a tiny live
generation (≤16 output tokens). `/v1/models` listing is **not** availability — five listed
claude models 404 at generation and the two fable models are credits-blocked (429).

**claude-code-oauth: 11/18 PASS** (sweep 16.9s)

| Status | Models |
| --- | --- |
| PASS (11) | opus-5-5 (1.5s) · opus-5 (1.7s) · opus-4-8 (0.7s) · opus-4-7 (1.0s) · opus-4-6 (3.1s) · opus-4-5-20251101 (0.8s) · sonnet-5-5 (1.2s) · sonnet-5 (1.7s) · sonnet-4-6 (0.8s) · sonnet-4-5-20250929 (1.0s) · haiku-4-5-20251001 (0.5s) |
| 429 credits-blocked (2) | **fable-5-1, fable-5** — "Usage credits are required for this model" (served, not usable on this account) |
| 404 listed-but-not-routable (5) | opus-4-1-20250805 · opus-4-20250514 · sonnet-4-20250514 · 3-7-sonnet-20250219 · 3-5-haiku-20241022 — in `/v1/models`, "model: … not_found" at generation |

**codex-oauth: 9/9 PASS** (sweep 24.8s) — gpt-6-sol (1.6s) · gpt-6.1-sol (2.0s) · gpt-6-luna (1.4s) ·
gpt-6-astra (2.8s) · gpt-5.6-sol (1.5s) · gpt-5.6-terra (1.7s) · gpt-5.6-luna (6.2s) · gpt-5.5 (1.3s) ·
codex-auto-review (6.2s)

Model selection from these results follows [MODEL-SELECTION.md](MODEL-SELECTION.md) (owner
ladder, purpose classes, fallback chains, mandatory recording). Open item for Owen
(report-only): fable-5-1/fable-5 need usage credits on the proxy account; the 5 404 models are
listed by the proxy but unroutable — either the list or the routing is stale.

## 4. Full wired inventory (generated verbatim from the config file)

15 providers in `~/.zcode/v2/provider_config.json` (`providerOrder` matches the file order).
Generated 2026-10-07; regenerate this section whenever the config changes.

<!-- INVENTORY-START -->

### opencode-zen-chat-2 — OpenCode Zen (Chat) 2 (disabled)

- Route: template opencode-zen-chat (vendor API)
- Access: api-key (full key in config file; never committed)
- Models (16): kimi-k3, minimax-m3, deepseek-v4-pro, glm-5.2, big-pickle, mimo-v2.5-free, hy3-free, ling-3.0-flash-fin-free, nemotron-3-ultra-free, muse-spark-1.2-contributor-free, minimax-m2.7, deepseek-v4-flash, glm-5.1, nemotron-3.5-lightning-free, opencode/muse-spark-1.3-contributor-free, openrouter/free

### opencode-zen-responses — OpenCode Zen (Responses) (disabled)

- Route: template opencode-zen-responses (vendor API)
- Access: api-key (full key in config file; never committed)
- Models (16): gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5, gpt-5.5-pro, gpt-5.4, gpt-5.4-pro, gpt-5.4-mini, gpt-5.4-nano, gpt-5.3-codex, gpt-5.3-codex-spark, gpt-5.2, gpt-5.1, opencode/muse-spark-1.3-contributor-free, mimo-v2.5-free

### openrouter — OpenRouter (default)

- Route: template openrouter (vendor API)
- Access: api-key (full key in config file; never committed)
- Models (78): anthropic/claude-fable-5.1, openai/gpt-6-astra, openai/gpt-5.6-sol, anthropic/claude-opus-5, deepseek/deepseek-v4-pro, moonshotai/kimi-k3, z-ai/glm-5.3, qwen/qwen3.8-max, minimax/minimax-m3, xiaomi/mimo-v2.5-pro, x-ai/grok-4.6, deepseek/deepseek-v4.1-flash, qwen/qwen3.8-max-0902, openai/gpt-5.6-terra, openai/gpt-5.6-luna, openai/gpt-5.6, openai/gpt-5.4, openai/gpt-5.4-pro, openai/gpt-5.4-mini, openai/gpt-5.4-nano, openai/gpt-5.3-codex, anthropic/claude-sonnet-5, anthropic/claude-haiku-4.5, anthropic/claude-opus-4.8, anthropic/claude-opus-4.7, anthropic/claude-opus-4.6, anthropic/claude-opus-4.5, anthropic/claude-sonnet-4.6, anthropic/claude-sonnet-4.5, deepseek/deepseek-v4-flash, moonshotai/kimi-k2.7-code, moonshotai/kimi-k2.6, moonshotai/kimi-k2.5, z-ai/glm-5.3-flash, z-ai/glm-5.2, z-ai/glm-5.1, z-ai/glm-5v-turbo, z-ai/glm-5, z-ai/glm-5-turbo, z-ai/glm-4.7, z-ai/glm-4.7-flash, z-ai/glm-4.6, z-ai/glm-4.6v, z-ai/glm-4.5-air, z-ai/glm-4.5, qwen/qwen3.8-flash, qwen/qwen3.7-max, qwen/qwen3.7-plus, qwen/qwen3.7-flash, qwen/qwen3.6-plus, qwen/qwen3.6-flash, qwen/qwen3.5-plus-20260420, qwen/qwen3-vl-plus, qwen/qwen3-vl-flash, minimax/minimax-m2.7, minimax/minimax-m2.5, xiaomi/mimo-v2.5, x-ai/grok-build-0.1, x-ai/grok-4.3, openrouter/auto, stealth/space-bunny-alpha, anthropic/claude-opus-5.5, nvidia/nemotron-3-ultra-550b-a55b:free, thinkingmachines/inkling:free, thinkingmachines/inkling-small:free, nvidia/nemotron-3.5-lightning:free, nvidia/nemotron-3-super-120b-a12b:free, cohere/north-mini-code:free, poolside/laguna-s-2.1:free, poolside/laguna-xs-2.1:free, dots-studio/dots-3-note-preview:free, qwen/qwen3.8-27b:free, google/gemma-4-31b-it:free, google/gemma-4-26b-a4b-it:free, nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free, inclusionai/ling-3.0-flash-sante:free, liquid/lfm-2.5-2.6b:free, openrouter/free

### zai-standard-api — Z.ai API (disabled)

- Route: template zai-standard-api (vendor API)
- Access: OAuth/template-managed
- Models (24): GLM-5.3, GLM-5.3-Flash, GLM-5V-Turbo, GLM-5.1, GLM-5.1-Highspeed, GLM-5, GLM-5-Turbo, GLM-4.7, GLM-4.7-FlashX, GLM-4.7-Flash, GLM-4.6, GLM-4.5-Air, GLM-4.5, GLM-4.6V, GLM-4.6V-Flash, GLM-4.6V-FlashX, GLM-4.1V-Thinking-FlashX, GLM-4.1V-Thinking-Flash, GLM-4-FlashX-250414, GLM-4-Flash-250414, GLM-4V-Flash, codegeex-4, charglm-4, emohaa

### opencode-zen-responses-2 — OpenCode Zen (Responses) 2 (disabled)

- Route: template opencode-zen-responses (vendor API)
- Access: OAuth/template-managed
- Models (14): gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5, gpt-5.5-pro, gpt-5.4, gpt-5.4-pro, gpt-5.4-mini, gpt-5.4-nano, gpt-5.3-codex, gpt-5.3-codex-spark, gpt-5.2, gpt-5.1

### new-provider — owen

- Route: openai-chat-completions @ http://localhost:6446/v1
- Access: api-key (key oc-f5e2ba3…, full key in config file)
- Models (9): space-bunny-free, big-pickle, mimo-v2.6-flash-free, mimo-v2.5-free, longcat-2.5-preview-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, muse-spark-1.3-contributor-free, muse-spark-1.2-contributor-free

### kilocode-free — Kilocode (Free) (disabled)

- Route: openai-chat-completions @ http://127.0.0.1:5380/v1
- Access: api-key (key kilo-free-…, full key in config file)
- Models (12): kilo-auto/free, stealth/space-bunny-alpha, nvidia/nemotron-3-ultra-550b-a55b:free, stepfun/step-3.7-flash:free, qwen/qwen3.8-27b:free, dots-studio/dots-3-note-preview:free, inclusionai/ling-3.0-flash-sante:free, cohere/north-mini-code:free, nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free, nvidia/nemotron-3-super-120b-a12b:free, nvidia/nemotron-3.5-lightning:free, openrouter/free

### opencode-acct-2 — opencode acct 2

- Route: openai-chat-completions @ http://localhost:6446/v1
- Access: api-key (key oc-4393f4d…, full key in config file)
- Models (9): space-bunny-free, big-pickle, mimo-v2.6-flash-free, mimo-v2.5-free, longcat-2.5-preview-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, muse-spark-1.3-contributor-free, muse-spark-1.2-contributor-free

### opencode-acct-3 — opencode acct 3

- Route: openai-chat-completions @ http://localhost:6446/v1
- Access: api-key (key oc-a3cebc0…, full key in config file)
- Models (9): space-bunny-free, big-pickle, mimo-v2.6-flash-free, mimo-v2.5-free, longcat-2.5-preview-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, muse-spark-1.3-contributor-free, muse-spark-1.2-contributor-free

### opencode-acct-4 — opencode acct 4

- Route: openai-chat-completions @ http://localhost:6446/v1
- Access: api-key (key oc-6d4ad30…, full key in config file)
- Models (9): space-bunny-free, big-pickle, mimo-v2.6-flash-free, mimo-v2.5-free, longcat-2.5-preview-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, muse-spark-1.3-contributor-free, muse-spark-1.2-contributor-free

### opencode-acct-5 — opencode acct 5

- Route: openai-chat-completions @ http://localhost:6446/v1
- Access: api-key (key oc-75dc420…, full key in config file)
- Models (9): space-bunny-free, big-pickle, mimo-v2.6-flash-free, mimo-v2.5-free, longcat-2.5-preview-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, muse-spark-1.3-contributor-free, muse-spark-1.2-contributor-free

### openai — OpenAI (disabled)

- Route: template openai (vendor API)
- Access: OAuth/template-managed
- Models (10): gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.6, gpt-5.4, gpt-5.4-pro, gpt-5.4-mini, gpt-5.4-nano, gpt-5.3-codex

### claude-code-oauth — Claude Code (OAuth)

- Route: anthropic-messages @ http://127.0.0.1:8317/v1
- Access: api-key (key cpa-local-…, full key in config file)
- Models (18): claude-fable-5-1, claude-fable-5, claude-opus-5-5, claude-opus-5, claude-opus-4-8, claude-opus-4-7, claude-opus-4-6, claude-opus-4-5-20251101, claude-opus-4-1-20250805, claude-opus-4-20250514, claude-sonnet-5-5, claude-sonnet-5, claude-sonnet-4-6, claude-sonnet-4-5-20250929, claude-sonnet-4-20250514, claude-haiku-4-5-20251001, claude-3-7-sonnet-20250219, claude-3-5-haiku-20241022

### codex-oauth — Codex (OAuth)

- Route: openai-responses @ http://127.0.0.1:8317/v1
- Access: api-key (key cpa-local-…, full key in config file)
- Models (9): gpt-6-sol, gpt-6.1-sol, gpt-6-luna, gpt-6-astra, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-5.5, codex-auto-review

### grok-build-oauth — Grok Build (OAuth)

- Route: openai-responses @ http://127.0.0.1:8317/v1
- Access: api-key (key cpa-local-…, full key in config file)
- Models (3): grok-4.6, grok-build-0.1, grok-4.3

<!-- INVENTORY-END -->

## 5. Daily test — what "availability" means

- **Scope**: every provider with `enabled: true` (openrouter, new-provider, opencode-acct-2..5,
  claude-code-oauth, codex-oauth, grok-build-oauth), and every wired model of the two 8317
  families (claude ×18, gpt ×9). Disabled providers are recorded once here and probed only if
  the owner enables them (the probe script reads the flag each run).
- **Pass**: HTTP 200 from the real endpoint on a minimal generation (or model-list) request.
  For family models this is generation-PASS — a `/v1/models` listing alone is not availability.
- **Fail**: non-200, timeout, or connection refused — recorded verbatim with latency and snippet.
- **Cadence**: daily via the devops sweep (24h throttle on the probe log's last timestamp);
  the council voice probe (DESIGN-COUNCIL.md §9) and this probe share one rule: probes report,
  they never repair — auth/routing is Owen-reserved.
- **Escalation**: a NEW fail (previously-passing route or model) routes to Truth AND Product per
  AGENTS.md with a Commons row; a known fail (grok routing absent, fable credits, the 5
  unroutable claude models, kilocode unreachable) is recorded as YELLOW standing state, not
  re-reported as news.
- **Selection**: model choice within the chatgpt/claude families is governed by
  [MODEL-SELECTION.md](MODEL-SELECTION.md) — never improvised per task.
