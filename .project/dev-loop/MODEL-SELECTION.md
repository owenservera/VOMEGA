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
