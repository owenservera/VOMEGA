# Orca capability matrix for VOMEGA

**Baseline:** Orca v1.4.220 + current official harness docs/source.  
**Legend:** STABLE = documented/source-backed in v1.4.220 · LOCAL = still must be proven on Owen's Windows machine · MAIN = observed only/newer on Orca main.

| Capability | Orca stable | VOMEGA status | Design consequence |
| --- | --- | --- | --- |
| Windows desktop | STABLE | LOCAL | native Windows is baseline |
| Git worktrees | STABLE | LOCAL | primary edit isolation |
| CLI-driven worktree/terminal control | STABLE | LOCAL | coordinator can drive runtime |
| structured Run/Task/Dispatch | STABLE, Experimental | LOCAL | top-level cross-harness lifecycle |
| task dependencies/DAG | STABLE, Experimental | LOCAL | map real dependency gates only |
| worker_done success/failure | STABLE, Experimental | LOCAL | completion != prose |
| heartbeat | STABLE | LOCAL | liveness != completion |
| ask/reply | STABLE | LOCAL | blocking worker questions |
| decision gates | STABLE | LOCAL | explicit dependency on decisions |
| worker retain/release | STABLE | LOCAL | useful for retained context/debug |
| Claude deep integration | STABLE | LOCAL | strong first proof lane |
| Codex deep integration | STABLE | LOCAL | strong first proof lane |
| Grok built-in/auto setup | STABLE | LOCAL | prove Windows status/model controls |
| OpenCode built-in/status | STABLE | LOCAL | stable model stays harness-owned |
| ZCode deep integration | STABLE | BLOCKED locally | requires TUI-capable zcode CLI |
| Claude/Codex usage + account switch | STABLE | LOCAL | capacity signal, not authority |
| OpenCode usage visibility | STABLE docs | LOCAL | informative only |
| per-launch model: Claude/Codex | STABLE | LOCAL | optional routing lever |
| per-launch OpenCode model | MAIN/newer conditional | NOT REQUIRED | keep model in OpenCode config |
| arbitrary provider/account routing across all harnesses | not established | NOT PROVEN | VOMEGA router must stay capability-aware |
| resource governor for 20 workers | not established | NOT PROVEN | grow concurrency experimentally |
| worktree = security sandbox | NO | N/A | explicit Manual/sandbox policy |
| remote/SSH execution | STABLE | DEFERRED | later expansion path |
| mobile monitoring/steering | STABLE | DEFERRED | optional operator surface |
| session search/history | STABLE with user enablement | DEFERRED | useful, not canonical truth |

## Harness integration tiers

| Harness | Orca v1.4.220 evidence | Initial VOMEGA posture |
| --- | --- | --- |
| Claude Code | deep: auth/account/usage/hooks/subagents | Tier A |
| Codex | deep: auth/account/usage/session/subagents | Tier A |
| ZCode | deep, but requires interactive TUI CLI | Tier A after blocker cleared |
| OpenCode | built-in, auto-setup/status/orchestration worker | Tier B until concurrency/session attribution proven |
| Grok Build | built-in/auto-setup + stable model/effort code | Tier B until Windows lifecycle proof |

Tier is integration confidence, not model quality.

## Top-level ownership rule

A VOMEGA task has exactly one top-level Orca Dispatch owner at a time.

Harness-internal agents may fan out, but they are children of that Dispatch:

```text
VOMEGA Task
   ↓
Orca Dispatch
   ↓
parent harness session
   ↓
optional harness subagents/team
   ↓
parent returns evidence + worker_done
```

This is the key provenance boundary for the heterogeneous factory.
