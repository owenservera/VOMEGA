# ZCode setup — routing, threads, automations

Written 2026-10-07 for the VOMEGA setup. This records what is installed on this machine, what
works, what is still undecided, and what a rebuild would look like. Nothing here was assumed:
every claim below was read from the installed files or observed in a run, and dated.

Companion: [TEAM-AND-COMMS.md](TEAM-AND-COMMS.md) — the team shape and the message desk.

## 1. Model routing — the single entrypoint

One command answers "which model is live for this kind of work":

```text
node ~/.agents/skills/cliproxy-router/cliproxy.mjs status
node ~/.agents/skills/cliproxy-router/cliproxy.mjs route review --project C:/0-BlackBoxProject-0/VOMEGA
```

Profiles: `fast`, `build`, `reason`, `review`, `long-context`.

### How it decides (read from `cliproxy.mjs`, 174 lines)

- Candidate models come from CLIProxyAPI's `/v1/models` on `127.0.0.1:8317`.
- `providerFor()` maps only four prefixes: `claude-*` → `claude-code-oauth` (Anthropic messages),
  `gpt-*`/`codex-*` → `codex-oauth` (Responses), `grok-*` → `grok-build-oauth` (Responses).
  Anything else gets a null provider.
- `score()`: an `avoid_patterns` match is a **hard drop**; each `prefer_patterns` match is **+10**;
  an 8-digit dated id gets **−5**.
- Cooled models (parsed from the proxy log) are removed **before** scoring.
- Sort: score desc, then version tuple desc, then id asc. First entry wins.
- Policy merge: global `~/.zcode/cliproxy-router/policy.json`, then the project overlay
  `<repo>/.zcode/cliproxy-router.json` **replaces** each named profile wholesale. It cannot add a
  new profile name (silently ignored) and cannot override a hard drop.

### Project overlay (VOMEGA)

`.zcode/cliproxy-router.json` was commissioned to DEVops as `D-20261007-017` with this content:

| Profile | prefer | avoid | Reason |
| --- | --- | --- | --- |
| `fast` | `haiku`, `flash`, `build-fast` | `imagine`, `video`, `mini`, `opus-5` | sweeps and probes stay cheap |
| `build` | `gpt-`, `opus`, `sonnet` | `imagine`, `video`, `mini` | D1 red→green needs instruction-following families |
| `review` | `opus`, `sonnet` | `imagine`, `video` | **the substantive change** — reviewer defaults to a family different from a GPT implementer |
| `reason` | `opus`, `sol` | `imagine`, `video`, `mini`, `fast` | chair + gate-law debugging |
| `long-context` | `opus`, `gpt-6`, `sol` | `imagine`, `video`, `mini` | reading the D1 codebase |

Verification (`D-20261007-017`): all five report `"policy": "project"`; `review` selects a
`claude-*` id; no selection matches an avoid pattern.

### What the entrypoint cannot see — and why

Port **6446** (`new-provider`, `opencode-acct-2` … `-5` on `space-bunny-free`) and **openrouter**
are not CLIProxyAPI. The router never lists them and `providerFor()` returns null for them, so no
profile can select them. This is structural, not a scoring choice.

Two things follow:

- **Concurrency is not independence.** Five accounts serving the same model give five parallel
  answers on **one** family. A council ruling still needs two independent families from the CPA
  tier (GPT / Claude / Grok).
- Council therefore records `tier=cpa|reserve`, `profile`, `id`, `provider/account`, `family`,
  `explicit=yes/no` per voice (`D-20261007-012`).

### The fix nobody had tried — verified feasible, not yet authorised

CLIProxyAPI's own README line 134: *"OpenAI-compatible upstream providers via config (e.g.,
OpenRouter)"*, and `config.example.yaml` shows the `base-url` + key shape per upstream. Port 6446
speaks exactly that protocol.

So **port 6446 and openrouter can be added as CPA upstreams**, after which they appear in
`/v1/models` like any other model and flow through the one entrypoint — the model list, cooldown
exclusion, scoring and fall-through all work unchanged. Only `providerFor()` would need a prefix
mapping for correct labelling.

Status: **feasible and evidenced, deliberately not done.** Three reasons it was held:

1. It is a **global** config change affecting every project on this machine, not VOMEGA only.
2. Account keys would move into the proxy config. Keys are never read, printed or moved by the
   desk or any team without explicit authorisation.
3. The skill's own rule: this skill does not edit `config.yaml`, auth files or `provider_config.json`.

The earlier line in the skill — "Port 6446 … are not CPA. Do not route them through this script" —
is a **design decision, not a proven impossibility.**

Open questions for Owen: authorise the upstream wiring, or keep two-tier? If OpenRouter is "at 0",
the upstream form makes the cause legible (credits vs rate limit vs empty free pool) instead of a
probe guessing.

## 2. Measured model state (dated — re-measure, never assume)

Probe of 2026-10-07, `.project/dev-loop/provider-probe.mjs` (committed `74edbd8`, dark-list
follow-up `3113386`):

- Codex/GPT family: **9/9** live
- Claude family: **11/18** live. `claude-fable-5-1` and `claude-fable-5` → 429 (out of credits).
  Five legacy ids → 404 (listed, unroutable): `claude-opus-4-1-20250805`, `claude-opus-4-20250514`,
  `claude-sonnet-4-20250514`, `claude-3-7-sonnet`, `claude-3-5-haiku-20241022`.
- Port 6446: five `space-bunny-free` accounts live (free OpenCode Zen tier; other Zen "free"
  models fail outside OpenCode — measured and deterministic, not transient).
- OpenRouter: free route live at 09:43Z; reported "at 0" later the same day — cause not yet
  measured (`D-20261007-018` asked for the mode).
- Grok: dark through the morning (no key, no proxy route); the 8317 catalog later listed
  `grok-4.7`, `grok-4.6`, `grok-3-mini`, `grok-4.20-*`. Re-probe before relying on it.

Darkness is **per model**, not per login (`upstream.*.model-level-cooling`), and survives a proxy
restart (`cooldown.save-cooldown-status`). A dark lane is a normal event, not a fault.

## 3. Threads, automations, watchers

Four team threads — DEV, DEVops, PM, COUNCIL — plus this Chief of Staff thread. Each team thread
owns **one** automation; a thread cannot own a second (the client refuses to create a scheduled task
inside a session that already belongs to one).

| Thread | Automation | Cadence |
| --- | --- | --- |
| DEV | `automation-b1ca7c15-f333-44e7-bbbc-369485130454` | 2 min |
| DEVops | `automation-6a2b7413-a602-4427-89eb-a59bd5d2ed1b` | 5 min |
| PM | `automation-a081625c-968d-40df-876d-69a75113ddfe` | 5 min |
| COUNCIL | `automation-31b1e625-9a3a-4c58-a0b7-bfa9bb7ac085` | 5 min |
| CoS desk | `automation-60ceab66-07ed-4729-b9ca-bc5fdcb39459` | 15 min, fallback |

Each thread also runs a background watcher (3-second poll, 570-second window, re-armed on exit) —
that is the instant path; the automation is the fallback that survives an app restart. The old
10-minute governor was deleted so the desk could own its slot; its commits remain in git.

### Session-model fallback — what is actually true

- The standard `Agent` tool schema is `description`, `prompt`, `subagent_type`,
  `run_in_background`. **No model argument.** Four teams verified this independently. Do not
  document a per-dispatch fallback ladder; persona text cannot select a model.
- One pin **does** work when the dispatcher supplies it: a subagent dispatched as
  `opencode-acct-2/space-bunny-free` reported that id back (`SPACE-BUNNY-ROUTING-OK`).
- Thread session-model rotation was **observed once** in the desk thread
  (`space-bunny-free` → `claude-opus-5-5`). Observed-once, not a guarantee, and not a
  configuration field.
- `CreateWorkflow`/`AmendWorkflow` expose `subagent_model` for workflow subagents. It does not
  apply to threads, cron runs, or the Agent tool.

## 4. Global configuration facts

- ZCode reads models from `~/.zcode/v2/provider_config.json` (not `v2/config.json`). A model needs
  three registrations: `personalModelIds`, `modelOrder`, and a `modelConfigRules` entry. The file
  is schema-validated on load — a malformed rule takes out the whole model list. Backups are named
  `provider_config.json.bak-<timestamp>`.
- Three global skills load in every project: `cliproxy-router`, `oauth-usage`
  (`node ~/.agents/skills/oauth-usage/usage.mjs`, read-only), `zcode-comms`.
- `provider_config.json` holds inline credentials. Never quote it. The availability ledger keeps
  **no** key material — PM removed even 10-char prefixes in `74edbd8`.
- The proxy management key is not in the config and must never be printed.

## 5. Rebuild checklist

1. `node ~/.agents/skills/cliproxy-router/cliproxy.mjs status` — proxy up, catalog listed.
2. Copy `.zcode/cliproxy-router.json` from this repo (it is committed).
3. For each profile, run `route <profile> --project <repo>` and confirm `"policy": "project"`.
4. Re-measure the reserve tier (6446 ×5, openrouter) and record status + failure mode.
5. Open the four team threads in `C:\0-BlackBoxProject-0\VOMEGA`, paste the standing prompts from
   `TEAM-AND-COMMS.md` §5, confirm one automation each.
6. Start one watcher per thread; start the desk watcher; keep the desk automation.
7. Post one directive per team; confirm one reply line each with a matching `in-reply-to`.

## 6. Open items

- Authorise 6446 + openrouter as CPA upstreams, or keep two-tier (Owen).
- OpenRouter "at 0": measure the failure mode (`D-20261007-018`).
- Grok re-probe as a third council family (COUNCIL, `D-20261007-011`).
- Owner decision: whether a dark lane re-pick is manual every time, or whether lanes get pinned to
  the most reliable family (GPT measured 9/9 both times today).