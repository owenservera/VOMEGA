# Orca bootstrap design

**Status:** pre-research setup plan. Exact commands/install steps intentionally deferred until Orca is researched.

## Goal

Introduce Orca without disturbing the existing working development environment, then prove that it improves heterogeneous agent execution before promoting it to validated infrastructure.

## Non-negotiable bootstrap invariants

1. **Read-only auth/config by default.**
   Do not alter ZCode, OpenCode, Codex, Grok Build, Claude Code, OpenRouter or provider/account credentials as an incidental setup step.

2. **Inspect before changing.**
   Detect installed versions, executables, auth presence, invocation modes and currently working routes first.

3. **Preserve distinctions.**
   Harness ≠ router ≠ provider ≠ account ≠ model ≠ session.

4. **No capacity claims from configuration.**
   A configured lane becomes available capacity only after a bounded live probe succeeds.

5. **Git remains durable.**
   Orca workspace/session state may accelerate work but is not the only record of tasks, evidence or decisions.

6. **Native Windows is the primary target.**
   Do not introduce WSL or another host layer without a specific evidenced reason.

7. **No Daintree dependency.**
   Orca adoption is designed as a replacement path, not a nested Orca→Daintree or Daintree→Orca architecture.

8. **No permanent topology.**
   Bootstrap may use a conservative coordinator/worker layout, but it must not encode a permanent organization.

## Phase 0 — Freshness and safety

Before Orca setup:
- record VOMEGA `HEAD` and compare with `origin/main`;
- preserve local dirty/diverged work;
- read `AGENTS.md`, `.project/SITREP.md`, `.project/ENVIRONMENT.md`, `.project/dev-machine/`, and this folder;
- snapshot a secret-free harness inventory;
- record current working invocations without copying credentials into the repo.

Output:
- dated environment observation;
- no writes to auth/provider configuration.

## Phase 1 — Orca research fit check

Verify current Orca behavior against the requirements in `RESEARCH-AGENDA.md`.

Classify every important requirement:
- VERIFIED BY PRIMARY SOURCE;
- VERIFIED LOCALLY;
- PARTIAL;
- ABSENT;
- UNKNOWN.

Do not bend VOMEGA architecture to fit a missing Orca feature. Missing features become adapter/build/alternative decisions.

## Phase 2 — Minimal installation / registration

Install or open Orca using the least invasive path supported by current evidence.

Register VOMEGA as one project/repository.

Initial principle:
- existing repo is canonical;
- execution isolation uses disposable worktrees/workspaces where needed;
- no duplicate long-lived clones merely to represent agents.

## Phase 3 — Harness discovery

For each of:
- ZCode
- OpenCode
- Codex
- Grok Build
- Claude Code

record:
- executable/path;
- version;
- invocation mode;
- session/resume behavior if observable;
- auth state without secrets;
- permissions/mode;
- candidate model/router route if safely observable;
- bounded probe result;
- concurrency observations;
- integration limitations.

Do not repair a harness by mutating auth/provider configuration without explicit authorization.

## Phase 4 — Conservative routing

Start with small bounded concurrency.

The initial bootstrap should prefer:
- one coordinator function;
- a few independent workers;
- isolated writes;
- deterministic evidence;
- explicit fan-in.

It should **not** begin by trying to maximize the 20-session Elephant hypothesis.

Concurrency grows only from measured completion/latency/resource evidence.

## Phase 5 — ORCA-BOOT-01

Run the proof in `ORCA-BOOT-01.md`.

Until it passes, describe Orca as:
**selected replacement candidate / setup under validation**.

After it passes, Orca may be described as:
**validated current execution substrate**.

## Phase 6 — Reconciliation

Only after research + proof:
- update `../DECISIONS.md` with the evidenced operating decision if needed;
- update `../ENVIRONMENT.md` and `../dev-machine/`;
- mark Daintree-specific operational text as historical/superseded where appropriate;
- preserve Daintree lessons that remain useful;
- keep Orca below the project authority ladder.

## Secret handling

Never commit:
- API keys;
- auth tokens;
- session cookies;
- credential files;
- copied provider configs;
- private account identifiers beyond the already sanctioned symbolic lane names.

Commit sanitized capability/evidence summaries only.
