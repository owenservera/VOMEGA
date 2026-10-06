# Orca Development Factory — Autonomous Bootstrap Prompt

Use this prompt in the agent session that will take responsibility for setting up the VOMEGA Orca development factory on Owen's Windows machine.

Known owner state and intent:
- Orca is already installed. Inspect it; do not reinstall it by default.
- OpenCode is the preferred/default general-purpose harness.
- You may adjust Orca settings, Orca/OpenCode integration, launch conventions, PATH/shims, and install missing local CLI tooling needed for this mission.
- Existing provider, account, authentication, subscription, and model/provider wiring is read-only unless Owen explicitly authorizes a change.

Your mission is to turn the documented Orca design into a working, evidenced Windows development factory. Do not stop at a proposal. Inspect reality, install or repair what is actually missing, configure safely, prove the integrations, update durable documentation, and leave the environment usable.

## Gate 0 — mandatory complete-read gate

Before changing the machine, repository configuration, Orca settings, harness installations, PATH, hooks, plugins, worktrees, or runtime state:

1. locate the VOMEGA repo;
2. record local HEAD, origin/main, current branch, dirty state, and existing worktrees;
3. if clean and behind, fast-forward safely; if dirty/diverged, preserve work and do not pull blindly;
4. recursively enumerate every file under .project/orca/;
5. read every file under .project/orca/ completely — not snippets, headings, search hits, or summaries;
6. then read the project-authority files below;
7. produce a temporary comprehension ledger before setup begins.

For every file under .project/orca/, the ledger must record:

~~~text
path
current SHA/hash if available
purpose
key decisions/constraints
local-proof requirements
what this bootstrap must obey
~~~

Do not begin setup until this ledger proves the whole Orca corpus has been consumed. If new files were added after this prompt, they are automatically in scope. The directory defines the corpus.

Also read completely:
- AGENTS.md
- .project/SITREP.md
- .project/ENVIRONMENT.md
- .project/REALITY.md
- .project/DECISIONS.md
- .project/META-TRACKER.md
- .project/meta-tracker.json
- .project/agentic-launch/STATUS.md
- .project/dev-machine/README.md
- .project/dev-machine/ARCHITECTURE.md
- .project/dev-machine/HARNESS-MATRIX.md
- .project/dev-machine/PROCESS.md
- seed-docs/VISION.md
- seed-docs/INVARIANTS.md
- seed-docs/PROOF-AND-MATURITY.md
- seed-docs/AUTONOMY.md
- seed-docs/ELEPHANT-CONTEXT-NETWORK.md

If a file moved, find its current equivalent rather than skipping it.

## Authority and safety

Authority order:

~~~text
Owen / protected owner decisions
  > invariants + proof boundaries
  > repo/tests/evidence/current observations
  > PM/task decomposition
  > Orca runtime state
  > harness/session self-report
~~~

Orca is replaceable development machinery, not VOMEGA product truth.

Never collapse:
HARNESS ≠ ROUTER ≠ PROVIDER ≠ ACCOUNT ≠ MODEL ≠ SESSION ≠ WORKER ROLE.
WORKTREE ≠ SECURITY SANDBOX.
HEARTBEAT ≠ COMPLETION.
WORKER_DONE ≠ VOMEGA ACCEPTANCE.
CONFIGURED ≠ LIVE.
CONTEXT ≠ AUTHORITY.

Protected/read-only by default:
- credentials, API keys, tokens;
- provider/account identities and wiring;
- OpenRouter configuration;
- existing OpenCode provider/model/account configuration;
- existing ZCode provider/account configuration;
- existing Claude/Codex/Grok auth;
- subscriptions/spend settings.

You may safely change:
- Orca project/runtime/integration settings;
- Orca agent defaults;
- Orca's general/default harness behavior;
- PATH or reversible launch shims;
- missing local harness binaries/CLIs;
- repo-local Orca development config when justified;
- ignored local evidence/logs;
- documentation reflecting observed setup.

Set Orca Agent Permissions to MANUAL first. Do not bootstrap with global yolo/dangerous bypass flags. A worktree is not a security sandbox.

## Starting state

Orca is already installed. First identify its exact version and runtime/CLI path.

The design docs were researched against Orca v1.4.220. If installed Orca is newer:
- inspect the installed binary's help and "orca skills get orchestration --full";
- compare material differences;
- use the installed binary's own command contract when syntax differs;
- do not downgrade merely to match the docs.

If older and a required feature is missing, upgrade to a stable release only after preserving state and confirming the path.

## Default harness rule

OpenCode is the default general-purpose worker.

When no stronger task-specific reason exists, use OpenCode for:
- implementation;
- tests;
- documentation;
- bounded research;
- routine worker tasks.

Route to ZCode, Codex, Claude Code, or Grok Build when capability, task risk, independence, context, quality, quota, or observed performance justifies it.

If Orca exposes a safe default-agent/default-harness setting, set it to OpenCode. If it does not, encode this operational default in routing/coordinator instructions and launch conventions rather than hacking Orca internals.

Do not modify OpenCode provider/model/account wiring merely to make it the default.

## Required harness pool

The finished factory must support:
1. OpenCode — default general worker.
2. ZCode.
3. Codex.
4. Grok Build.
5. Claude Code.

Top-level ownership:

~~~text
VOMEGA Task
  → Orca Dispatch
  → one parent harness session
  → optional harness-local subagents/team
  → parent returns evidence + one authoritative worker_done
~~~

Harness-internal child agents are nested compute. They do not become top-level VOMEGA owners unless Orca gives them a separate Task/Dispatch.

## Phase A — machine census

Before installing anything, record:

~~~text
Windows version
PowerShell version
git / gh
node / bun
Orca desktop version + path
Orca CLI version + path
OpenCode version + path
ZCode desktop version + path
standalone zcode version + path if present
Codex version + path
Grok Build version + path
Claude Code version + path
Git Bash presence
WSL presence only
repo path + HEAD
existing worktrees
~~~

For each harness inspect:
- exact executable resolution;
- version;
- launch outside Orca;
- auth/login presence without exposing secrets;
- provider/model/router metadata only when safely observable;
- permission/config location;
- session/resume behavior relevant to Orca;
- conflicting multiple installs.

Raw sensitive/local detail belongs in ignored local state. Commit sanitized observations only.

## Phase B — prove installed Orca

Because Orca already exists:

1. start/locate the running runtime;
2. prove "orca status --json";
3. ensure CLI and desktop refer to the intended runtime;
4. inspect current help and installed skills;
5. set Agent Permissions = Manual;
6. keep Experimental orchestration disabled until basic harness launches work;
7. register the existing VOMEGA checkout if needed;
8. set/verify origin/main as repo default base;
9. do not create duplicate long-lived clones.

## Phase C — prove worktree mechanics

Before harness complexity, create a disposable independent worktree from the default base and prove:
- creation;
- correct branch/base;
- harmless file/status operation;
- terminal launch;
- inspection;
- clean archive/remove;
- no effect on unrelated worktrees.

Inspect whether VOMEGA already has orca.yaml. Do not invent a setup hook.

If a setup script becomes necessary:
- validate the real VOMEGA install/bootstrap command first;
- native Windows Orca setup uses .cmd syntax by default;
- PowerShell terminal selection does not change setup-script syntax;
- only use a POSIX shebang when deliberately relying on Git Bash;
- prefer setupAgentStartupPolicy: wait-for-setup when the agent depends on successful setup.

Do not blindly share node_modules, caches, Vault/state, or credentials between worktrees.

## Phase D — OpenCode first

Prove OpenCode first because it is the owner's default.

1. locate the exact executable Orca will launch;
2. record version;
3. inspect current auth/provider/model config read-only;
4. launch outside Orca;
5. launch via Orca in Manual mode;
6. run a read-only bounded task;
7. run a disposable-worktree edit + deterministic test;
8. verify Orca status/agent tracking;
9. run one supervised Orca Dispatch with OpenCode;
10. run two concurrent OpenCode workers and verify session/task attribution;
11. if shared service state causes attribution problems, investigate a per-worker/private mode supported by the actual installed version;
12. do not upgrade OpenCode merely because newer public docs exist unless the installed version cannot satisfy required integration.

After proof, make OpenCode the operational default.

## Phase E — ZCode

This has a known prerequisite.

The recorded ZCode desktop-bundled runtime may not contain the interactive TUI Orca requires. Version/doctor alone does not prove TUI compatibility.

1. check whether standalone zcode exists;
2. prove bare zcode opens an interactive TUI outside Orca;
3. if missing, obtain/install/build a TUI-capable standalone ZCode CLI using official/current sources;
4. do not uninstall or replace ZCode desktop;
5. do not copy/migrate provider secrets automatically;
6. put the compatible standalone CLI on PATH or configure Orca to resolve it safely;
7. verify which existing ZCode/provider config it sees;
8. if config inheritance is unclear, preserve state and document the boundary instead of copying secrets;
9. launch through Orca;
10. prove read-only task;
11. prove disposable-worktree edit/test;
12. prove supervised Orca Dispatch;
13. prove one ZCode internal subagent while the parent retains Dispatch ownership.

Document desktop/standalone coexistence precisely.

## Phase F — Codex

Use the existing/system-default Codex account first.

1. verify version/login outside Orca;
2. confirm Orca recognizes it without copying credentials;
3. Manual read-only task;
4. bounded workspace-write task in disposable worktree;
5. supervised Orca worker-start with Codex;
6. explicit succeeded and failed completion semantics;
7. usage/account display is informational only;
8. one Codex subagent under the parent Dispatch;
9. retain/release/restart if useful;
10. remain native Windows unless a concrete blocker justifies WSL.

Do not create extra Codex accounts during bootstrap merely because Orca can.

## Phase G — Claude Code

1. find actual Windows executable/version;
2. confirm existing login;
3. confirm Orca sees existing Claude state;
4. Manual read-only task;
5. disposable-worktree edit/test;
6. supervised Orca Dispatch;
7. blocking question/reply;
8. one ordinary Claude subagent under parent Dispatch;
9. inspect usage/status;
10. keep Claude Agent Teams disabled during core bootstrap.

Only test Agent Teams later after normal cross-harness provenance works.

## Phase H — Grok Build

1. locate grok and version/auth presence;
2. inspect non-secret model metadata using current supported commands;
3. launch through Orca in Manual/approval-safe posture;
4. read-only task;
5. disposable-worktree edit/test;
6. supervised Orca Dispatch;
7. question/failure/status lifecycle;
8. verify current model/effort controls where supported;
9. one Grok subagent under parent Dispatch;
10. verify Windows hook behavior before relying on it.

Do not force global always-approve/autonomous Grok settings initially.

## Phase I — pairwise concurrency

Do not jump to 20 sessions.

At minimum prove:
- OpenCode + Codex;
- OpenCode + Claude;
- Grok + OpenCode;
- ZCode + OpenCode.

Use separate worktrees/write sets for writers.

Verify:
- prompts go to correct workers;
- terminal/session attribution stays correct;
- no provider/account crossover;
- Git ownership stays clean;
- CPU/RAM remains acceptable;
- Orca status is understandable;
- cleanup works.

If a pair fails, isolate the cause before scaling.

## Phase J — structured Orca orchestration

Only after basic launches work:

1. enable Experimental orchestration;
2. run "orca skills get orchestration --full";
3. treat that installed guide as the command contract;
4. create a minimal Run;
5. create two self-contained Tasks on different harnesses;
6. prove:
   - Task IDs;
   - Dispatch IDs;
   - ask/reply;
   - heartbeat/liveness;
   - one worker_done succeeded;
   - one deliberate worker_done failed;
   - coordinator inbox processing;
   - retain/release;
   - durable result/evidence.

Do not use retired commands just because older docs mention them.

## Phase K — full ORCA-BOOT-01

Execute .project/orca/ORCA-BOOT-01.md as the acceptance campaign.

All five harness families must participate in one real but bounded VOMEGA objective. Do not use five artificial hello-world prompts.

Require:
- self-contained Tasks;
- real dependency or decision gate;
- parallel work;
- explicit blocker/failure;
- independent review;
- context consultation;
- coherent fan-in;
- evidence;
- config-integrity check.

Do not mark it passed unless every required criterion is evidenced.

## Routing after bootstrap

Default: OpenCode.

Route away from it when:
- task risk/quality warrants;
- another harness has uniquely useful capabilities;
- independent review diversity matters;
- context needs differ;
- OpenCode is rate-limited/unavailable;
- observed performance favors another harness;
- harness-local subagents materially help.

Initial priors, not permanent roles:

| Harness | Starting prior |
| --- | --- |
| OpenCode | default implementation/tests/docs/research worker |
| ZCode | complex autonomous/team tasks and internal fan-out |
| Codex | difficult implementation/debug/refactor/test work |
| Claude Code | architecture-sensitive reasoning, critique, cross-cutting work |
| Grok Build | independent builder/reviewer/research lane |

## Concurrency and Elephant policy

Do not instantiate the full Elephant network during core bootstrap.

After ORCA-BOOT-01:
1. measure 1 → 2 → 3–5 → 5+ workers;
2. record RAM/CPU, latency, throttling, Git contention, attribution, coordinator overhead;
3. then test retained long-context sessions;
4. follow .project/orca/CONTEXT-AND-ELEPHANTS.md and seed-docs/ELEPHANT-CONTEXT-NETWORK.md;
5. treat Elephant sessions as advisory cognition, never authority.

No fixed 20-session target is required.

## Installation authority

You are authorized to install missing local development tooling needed for this bootstrap, including compatible CLI binaries for these five harnesses and non-secret support tooling.

Rules:
- inspect first;
- prefer official installation methods/current docs;
- avoid replacing working installs unnecessarily;
- keep changes reversible;
- record exact version/path/source;
- do not make unrelated global configuration changes;
- never put secrets in commands, logs, or committed files;
- do not purchase subscriptions or incur new paid plans;
- do not change provider/account credentials without Owen.

If an interactive login/consent step requires Owen, complete every independent non-interactive step, record the exact blocker, and continue the rest of the bootstrap.

## Git discipline

Before edits, follow the repo's current claim/Commons process.

During work:
- preserve other workers' changes;
- bounded coherent commits;
- no history rewrite;
- no force-push;
- no secrets/local raw logs in Git;
- independent review for consequential code/config changes.

Commit useful documentation/evidence at meaningful milestones so setup work is not lost.

## Required durable outputs

At completion:
1. update .project/orca/ where local evidence corrected assumptions;
2. create a sanitized bootstrap execution report under .project/orca/ or an evidence subfolder;
3. refresh .project/ENVIRONMENT.md;
4. refresh relevant .project/dev-machine/ current-runtime guidance;
5. update .project/DECISIONS.md only for genuine decisions;
6. update STATUS / Commons as current process requires;
7. record ORCA-BOOT-01 pass/fail with evidence refs;
8. preserve Daintree history; mark operational guidance superseded only if Orca proof supports it.

The final bootstrap report must contain:

~~~text
source HEAD
Orca version + runtime/CLI path
OpenCode version/path/status/default decision
ZCode desktop + standalone CLI versions/paths/status
Codex version/path/status
Claude Code version/path/status
Grok Build version/path/status
permission posture
worktree proof
orchestration proof
pairwise concurrency results
ORCA-BOOT-01 result
known blockers
config-integrity result
what changed
what was deliberately not changed
next recommended experiment
~~~

## Definition of done

Bootstrap is complete only when:
- the complete recursive Orca read gate passed;
- Orca runtime/CLI are operational;
- VOMEGA is correctly registered;
- OpenCode is operationally the default;
- all five harnesses are proven through Orca or have a precise external blocker that only Owen can resolve;
- the ZCode TUI issue is resolved or precisely blocked;
- worktree creation/cleanup is proven;
- pairwise concurrency is tested;
- structured orchestration is tested;
- ORCA-BOOT-01 has an honest result;
- provider/auth config integrity is checked;
- durable docs/evidence are committed;
- the environment is left usable rather than half-migrated.

## Autonomous behavior

Do not ask Owen to choose ordinary implementation details already delegated here. Decide by evidence.

Escalate only for:
- destructive/irreversible action;
- credential/provider/auth mutation;
- spend/subscription change;
- material security/privacy tradeoff;
- product-authority decision;
- interactive login/consent only Owen can perform.

A blocker in one harness does not stop unrelated work.

## First execution behavior

Do not begin with an architecture essay.

Begin by:
1. recording Git/runtime freshness;
2. recursively reading all of .project/orca/ completely;
3. reading required authority/context files;
4. producing the comprehension/census ledger;
5. inspecting installed Orca and harnesses;
6. executing the gates in dependency order.

The objective is a working, evidenced Orca development factory — not another setup proposal.
