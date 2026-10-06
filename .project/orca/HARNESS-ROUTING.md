# Harness routing — evidence-revised

**Baseline:** Orca v1.4.220.  
**Rule:** routing is dynamic; no harness/model/account permanently owns a domain.

## 1. Five first-class harness families

```text
ZCode | OpenCode | Codex | Grok Build | Claude Code
```

The integration depths differ.

| Harness | Orca stable integration | Immediate note |
| --- | --- | --- |
| Claude Code | deep | existing auth, usage, hot-swap, hooks/subagents |
| Codex | deep | existing auth, usage, account isolation, subagents |
| ZCode | deep | hard prerequisite: TUI-capable standalone CLI |
| OpenCode | built-in + auto-setup/status | model remains harness-configured in stable |
| Grok Build | built-in + auto-setup; model/effort source support | Windows/lifecycle proof required |

## 2. Harness-local orchestration is allowed but nested

Each harness has or can have its own agent/subagent facilities.

Policy:

```text
Orca Task/Dispatch
    ↓
one parent harness worker
    ↓
zero or more task-local subagents
    ↓
parent owns final result
```

Do not let an internal subagent silently become a cross-VOMEGA task owner.

## 3. Routing inputs

Score candidate routes on:

- required tools/capabilities;
- context size/shape;
- consequence/risk;
- write collision;
- model quality needed;
- independent-review value;
- current availability/quota;
- observed latency;
- cost/scarcity;
- harness reliability on this task class;
- ability to produce the required evidence;
- whether internal subagents materially help.

## 4. Initial priors

These are hypotheses to measure:

| Harness | Initial prior |
| --- | --- |
| ZCode | complex autonomous/team tasks, broad project context, internal parallel research/build |
| OpenCode | abundant general work, repetitive code/tests/docs/research, provider-flexible lanes |
| Codex | precision implementation, debugging, refactor/test-heavy changes |
| Grok Build | independent builder/research/review path, autonomous bounded work |
| Claude Code | architecture-sensitive reasoning/implementation, difficult critique, specification-heavy work |

## 5. Model/account routing reality

### Claude/Codex

Orca stable has the strongest direct account/model integration.

Use existing system-default account first. Add/hot-swap accounts only after baseline proof.

### ZCode

Provider/model/account routing is primarily a ZCode concern until Orca proves visibility/control for the standalone TUI build.

The five configured historical lanes are **not automatically five Orca accounts**.

### OpenCode

Stable Orca can dispatch OpenCode but should initially let OpenCode choose/use its configured model.

Do not require newer main-only per-launch model overrides.

### Grok

Stable source supports model discovery and model/effort choices, but verify them on the installed stable binary and current Grok Build.

## 6. Provider-lane correction

Earlier Orca seed wording was too strong when it called Owen / OpenCode acct 2–5 “five OpenCode lanes”.

Correct formulation:

> VOMEGA has five historically configured provider lanes named Owen and OpenCode acct 2–5, each previously configured with Space Bunny Free and a 1,048,576 context declaration. They were observed as configuration, not individually proven as five simultaneous live Orca/OpenCode routes.

Treat each as **candidate underlying capacity** until re-probed.

## 7. Frontier escalation

Start with cheapest/most abundant adequate capacity.

Escalate for:
- repeated bounded failure;
- high architectural consequence;
- difficult debugging;
- need for genuinely independent review;
- context/reasoning demand beyond current route;
- user-requested frontier model.

No automatic frontier spend.

## 8. Runtime telemetry

For every top-level Dispatch, record as many as are actually observable:

```text
task_id
dispatch_id
role
harness
harness_version
router
provider
account
model
session
worktree
branch
context_bundle
permission_mode
started_at
ended_at
outcome
files_modified
evidence_refs
review_refs
child_agent_summary
```

Unknown stays unknown.

## 9. Concurrency

Do not start with 20 sessions.

Ramp:
1 → 2 concurrent writers → 3–5 heterogeneous workers → 5+ → stress test.

Measure:
- completion rate;
- latency;
- memory/CPU;
- model/provider throttling;
- Git collisions;
- session attribution;
- coordinator overhead;
- context network congestion.

Only then size Elephant reservations and maximum worker pool.
