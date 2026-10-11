# Operator Playbook — Hosted Z.ai First, Verified Local Runner When Necessary

## Path A: Z.ai Full-Stack native

Create a new isolated Full-Stack project at https://chat.z.ai/?mode=agent . Provide the seed brief, this pack if the web interface accepts reference/project files, and the single primary prompt in `01_PRIMARY_BOOTSTRAP_PROMPT.md`. Instruct the agent to first inventory what it can actually execute in this environment. Demand live proof of terminal/build/test access, persistent backend state, working exported artifacts, real independently contextualized child agents, four-way concurrency, and per-call usage capture. Reject screenshots/textual assertions as proof.

If it proves all required execution capabilities, commission a Round 0 cockpit and four child utilities within the same hosted environment. Confirm the built UI is connected to real services/data and verify outputs after reload/restart.

If Full-Stack can only build a site but cannot meet the execution gate, **do not discard its value**: let it build the front-end/control room and a documented adapter contract, then execute research on a local real agent runner. Source exportability and backend connectivity must be proven before choosing this split. Avoid a hosted front-end with no real runner connection being presented as functional.

## Path B: ZCode for real local execution

ZCode has documented isolated subagents and foreground parallelism, along with workspaces, terminal, Git and browser testing. Create a dedicated cloned workspace, keep the original seed read-only, and have the **parent** launch four separate general-purpose or controlled custom subagents. ZCode's Explore subagent is read-only and unsuitable for tasks that need file modifications; subagents cannot themselves launch subagents. Confirm model/account configuration without reading secrets. Use independent execution traces plus worktree/sandbox separation (ZCode context isolation alone does not guarantee OS filesystem isolation).

Verify that the platform's actual context limits, auto-compaction, memory behavior, and token usage match your run. ZCode provides overall usage stats but does not by itself establish the child-level accounting contract. If per-child provider usage is unavailable, explicitly mark it as unknown and instrument other measurable proxies; investigate a supported low-level call adapter rather than manufacturing token counts. Never change auth/provider configuration merely to simplify experiments.

Optional local runners such as OpenCode, Codex or Claude Code may execute arms only after their isolation, session persistence, permissions, usage accounting and actual installed availability are verified. Do not assume connector availability or a user's currently authenticated account proves the local binary can run.

## Before clicking Start

Confirm project seed is an immutable clone; source license/data privacy understood; model/provider access verified; four writable isolated workspaces assigned; budget and concurrency ceilings set; default E0 fallback defined; evaluator holdouts sealed; four theories preregistered; no secrets will be sent to web app; cancellation and cleanup are testable.

## A full Round 0 operation

Use the primary bootstrap prompt to request inventory and the four utility probes. Require one real completed child artifact per arm. Let the evaluator independently inspect test output and provenance. Observe the cockpit or console demonstrate a live backend persistence roundtrip. Ask each master separately to incorporate accepted results and produce the next version. Verify both candidates remain runnable and two distinct next hypotheses each are registered. Freeze and version the common utilities, then proceed to E0 baseline trials.

## Moving from E0 to E1 to E2

E0: demonstrate useful work without an Elephant; baseline must be truthful and complete. E1: provision one contextualized node and compare it on precisely matched tasks. E2: provision two separate nodes and deliberately test seam dependencies, competing advice, timing and flush. Do not skip an E-level solely because the UI supports adding another agent card. Record actual session handles and source basis.

## Routine day-to-day operating loop

Review previous round scorecard, master decisions and unresolved falsifiers; ensure seed/fixture change control; preregister four new theories; launch four independent child contexts; watch concurrency, token usage and test artifacts; intervene only through logged controls; grade blind; obtain independent A/B assimilations; integrate verified changes; prepare next four experiments. Repeat under explicit run/usage budget, not an uncontrolled “never stop” instruction.

## If the provider cannot perform true subagent dispatch

Stop and publish the demonstrated limitation. Possible supported choices: use four distinct independent top-level sessions launched by a local harness; retain Z.ai Full-Stack as a frontend-only dashboard; or conduct an explicitly labeled **simulated protocol rehearsal** that is not credited as the required real four-arm round. Do not bypass tool permissions or access accounts/tokens not available to the user.

## Definition of the first genuinely useful milestone

A seed mini-product feature is accepted by independent test, four isolated agents actually attempted four distinct experiments, a source-backed event/token ledger and persisted cockpit show their outcomes, context refresh validity was exercised, and two runnable competing masters have each evolved based on all four results. Anything short is a valuable partial result but not completed operationalization.
