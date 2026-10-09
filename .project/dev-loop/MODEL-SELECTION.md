# Model selection protocol — chatgpt (codex) and claude families

Status: **ACTIVE** (owner-directed, 2026-10-07)
Claim: [`../agentic-launch/claims/20261007-0955-model-selection-zcode.md`](../agentic-launch/claims/20261007-0955-model-selection-zcode.md)
Availability evidence: [PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) §3b (per-model sweep, refreshed daily by the devops probe)
Companions: [DESIGN-COUNCIL.md](DESIGN-COUNCIL.md) (voices) · [DEVOPS-TEAM.md](DEVOPS-TEAM.md) (probe carrier) · [PM-TEAM.md](PM-TEAM.md)

## 1. What this protocol decides (and what it never decides)

When a lane, council voice, or subagent needs a **chatgpt** (`codex-oauth`) or **claude**
(`claude-code-oauth`) model from the local proxy (`127.0.0.1:8317`), this protocol picks the
model deterministically. It never decides *whether* the work should happen, never rewrites the
provider configuration, and never invents capability rank — the ladder below is the
**owner-authored `modelOrder`** from `~/.zcode/v2/provider_config.json`, read at selection time
and never edited by the protocol. If the owner reorders it, the ladder changes with it.

## 2. The ladders (owner-authored order; read from the config, never rewritten)

- **claude** (`claude-code-oauth`): `claude-fable-5-1 · claude-fable-5 · claude-opus-5-5 ·
  claude-opus-5 · claude-opus-4-8 · claude-opus-4-7 · claude-opus-4-6 ·
  claude-opus-4-5-20251101 · claude-opus-4-1-20250805 · claude-opus-4-20250514 ·
  claude-sonnet-5-5 · claude-sonnet-5 · claude-sonnet-4-6 · claude-sonnet-4-5-20250929 ·
  claude-sonnet-4-20250514 · claude-haiku-4-5-20251001 · claude-3-7-sonnet-20250219 ·
  claude-3-5-haiku-20241022`
- **chatgpt** (`codex-oauth`): `gpt-6-sol · gpt-6.1-sol · gpt-6-luna · gpt-6-astra ·
  gpt-5.6-sol · gpt-5.6-terra · gpt-5.6-luna · gpt-5.5 · codex-auto-review`

Capability bands are coarse family naming only (fable/opus = heavy, sonnet = mid, haiku = light;
gpt-6.x/5.6 = heavy, gpt-5.5 = mid, `codex-auto-review` = special-purpose review only). The band
never overrides the ladder — it only sets class floors (§4).

## 3. Availability gate (a model is selectable only if ALL hold)

1. **Served + generation-PASS** in the latest per-model sweep
   ([PROVIDER-AVAILABILITY.md](PROVIDER-AVAILABILITY.md) §3b). Being listed in `/v1/models` is
   **not** availability: the 2026-10-07 sweep found 5 claude models that are listed but 404 at
   generation, and the 2 fable models credits-blocked (429). Only a live generation PASS counts.
2. **Fresh**: that PASS is < 24 h old (the daily devops probe refreshes it). If the record is
   stale, re-run `bun .project/dev-loop/provider-probe.mjs` before selecting — never select on
   an unprobed model.
3. **Errors mid-task**: if a selected model fails during real work (5xx / 429 / timeout), the
   caller falls to the next ladder entry that passes the gate and **records the fallback
   one-liner** in the task artifact. Never retry silently more than twice before falling.

## 4. Purpose classes (the only three the teams need)

| Class | When | Walk direction | Class floor (below this = class unmet → report honestly, don't downgrade) | Current effective pick (2026-10-07 sweep) |
| --- | --- | --- | --- | --- |
| **REVIEW / VOICE** | independent review, council voices, adversarial checks, long synthesis | top-down (first PASS wins) | claude: `claude-sonnet-5`; chatgpt: `gpt-5.6-luna` | claude → `claude-opus-5-5` (fable-5-1/5 are 429 credits-blocked); chatgpt → `gpt-6-sol` |
| **QUICK** | one-shot spot checks, tiny confirmations, probe probes | bottom-up (cheapest PASS wins; skip `codex-auto-review` outside its purpose) | claude: any PASS; chatgpt: any PASS except `codex-auto-review` | claude → `claude-haiku-4-5-20251001`; chatgpt → `gpt-5.5` |
| **REVIEW-DEV** | `codex-auto-review` only, for code-review purposes | exact model | n/a (purpose-specific) | `codex-auto-review` (PASS 2026-10-07) |

If no model in a family meets the class floor, the lane reports `<family> <class> UNAVAILABLE`
and skips truthfully (the grok pattern) — it never quietly uses a weaker model and never
represents the substitution as equivalent.

## 5. Selection recording (mandatory)

Every model-routed task writes one line into its artifact/claim/log:

```
model-selection: <family>:<model> class=<CLASS> ladder-pos=<n> probe=<date> [fallback-from=<model>]
```

Example: `model-selection: claude:claude-opus-5-5 class=REVIEW ladder-pos=3 probe=2026-10-07 fallback-from=claude-fable-5-1`

No silent downgrades: an auditor must be able to reconstruct why a voice answered on opus-5-5
instead of fable-5-1 from one line.

## 6. Boundaries

- The protocol reads the config; it never writes it. Ladder/credential changes are owner action.
- A probe PASS proves reachable-and-responsive; it does **not** certify capability beyond the
  coarse bands — evidence ≠ authority.
- Council independence still requires **different model families** where possible (claude voice
  AND gpt voice), not two models of one family.
- The devops probe and this protocol report and select; they never repair endpoints, credits,
  or auth (Owen-reserved).
- Spend stays minimal: probes are ≤16 output tokens; class walks prefer the ladder position
  stated by the class, not the largest model that could be justified.

## Lane allocation — all lanes on space-bunny-free (owner directive 2026-10-09, DESK D-20261009-023)

This supersedes the per-lane build / reason / review / fast allocation. Every lane runs the
same model, `space-bunny-free`, and each lane uses a different opencode account so that its
credentials are independent. Probed 2026-10-09 06:20Z with one tiny generation per account
on port 6446:

| Lane | ZCode provider (label) | Provider id | Model | Probe |
| --- | --- | --- | --- | --- |
| DEV | opencode acct 2 | opencode-acct-2 | space-bunny-free | PASS 0.7s |
| DEVops | opencode acct 3 | opencode-acct-3 | space-bunny-free | PASS 0.9s |
| PM | opencode acct 4 | opencode-acct-4 | space-bunny-free | PASS 1.3s |
| COUNCIL chair | opencode acct 5 | opencode-acct-5 | space-bunny-free | PASS 0.7s |
| COUNCIL second voice | owen | new-provider | space-bunny-free | PASS 1.5s |

**This is applied in the ZCode UI, not by project config.** A thread's session model is
chosen per thread in the ZCode client. Nothing in this repo selects it: the Agent tool has
no model argument, and the project overlay `.zcode/cliproxy-router.json` is read only by
`cliproxy.mjs route`, which nothing uses to set a session model. Owen applies the table above
by hand in each thread's model picker. DEVops does not edit auth or `provider_config.json`.

Two honest consequences:

- **Quorum.** All five lanes run the same model, so for council quorum they are **one
  family**. Independence is now at the credential level only. The CPA tier is no longer the
  lane path, so a council ruling that needs two independent families must still get the
  second family from a CPA voice (GPT or Claude).
- **Router.** The CPA router cannot express these routes: `providerFor()` maps only
  `claude-*`, `gpt-*`, `codex-*` and `grok-*`, and `cliproxy.mjs` is still broken on the
  missing `../model-profile.mjs`. Lane routing bypasses the cliproxy entrypoint until it is
  repaired. The overlay does not govern these lanes.

### Router verification 2026-10-09 (D-20261009-023 closure)

The repaired entrypoint answers again. `cliproxy.mjs resolve <role> --probe` returns the
owner-mandated lane account for every role, each probed live, none falling back:

| Role | Lane | Model id | fellBack |
| --- | --- | --- | --- |
| build | opencode-acct-2 | opencode-2/space-bunny-free | false |
| ops | opencode-acct-3 | opencode-3/space-bunny-free | false |
| pm | opencode-acct-4 | opencode-4/space-bunny-free | false |
| reason | opencode-acct-5 | opencode-5/space-bunny-free | false |
| review | new-provider | owen/space-bunny-free | false |

`status` reports proxy up (management 200). Two cautions from the router doc, recorded
rather than glossed: these ids are CPA-side aliases, which does **not** mean ZCode provider
entries were migrated (the port-6446 providers still exist as direct ZCode providers), and
whether a lane truly isolates its upstream account is **unverified**. Selecting a lane is
not a claim of isolation.
