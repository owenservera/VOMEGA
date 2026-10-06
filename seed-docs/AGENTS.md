# Ω Autonomous Build — Project Instructions

Read `START-HERE.md`, `VISION.md`, `PRODUCT-ANCHOR.md`, `INVARIANTS.md`, `PROJECT-CONTEXT.md`, `BUILD-FOCUS.md`, `AUTONOMY.md`, and `ZCODE-CAPABILITY-SPACE.md` before making major architectural commitments or designing the development system.

This is a fresh autonomous build project seeded with the current VIVIM-Ω implementation baseline. The baseline is a starting implementation and evidence source, not a frozen architecture and not a prewritten roadmap.

## Current program-map grounding

Bootstrap has run. The canonical map of important work now lives in `../.project/META-TRACKER.md`: **67 major meta programs plus 31 named development-acceleration hypotheses**. The broad domains in `WORKSTREAM-LANDSCAPE.md`, the bootstrap rooms below, the nine launch lanes, the nine roadmap workstreams, and D1 tasks are narrower execution/coverage views. They may help route work but do not define the whole project.

Current state starts at `../.project/SITREP.md`; current claims/running work are in `../.project/agentic-launch/STATUS.md`; proof comes from code/tests/evidence.

## Operating mandate

Build the best shippable VIVIM-Ω implementation that expresses the durable product vision and produces a working beta.

Start by understanding reality.

Then decide what the product needs, what architecture best expresses it, and what development machinery will increase throughput and quality.

You may create whatever development structure the work requires: agents, subagents, departments, workstreams, workflows, task systems, memory/context systems, test harnesses, research tracks, or other tooling.

None of those structures are preinstalled here on purpose.

Do not import or recreate the old BCP-dev ZCode/OpenCode team architecture merely because it existed before. Re-derive your development organization from the work.

You have explicit authority to change Ω itself, including implementation, contracts, plugin boundaries, runtime choices, schemas, architecture, surfaces, and—when evidence demonstrates that the current direction is wrong—the project's vision or assumptions.

## Bootstrap first pass

Before major product work, establish repository reality and seed hygiene: confirm the clean seed root, keep the Product Release Gym canonical in `BUILD-FOCUS.md`, classify omitted historical decision IDs as claims rather than law, and verify which browser/provider paths are fixture-only versus live.

## Multi-provider execution pool

> **Local-machine environment fact, with a narrower operational correction (2026-10-05):** the five configured accounts below remain valid census information unless a later machine census proves otherwise. What is superseded is the assumption that five configured accounts equal five currently live worker slots or define the current ZCode route. ZCode was later observed routing through `openrouter/auto`; provider configuration remains read-only and safe concurrency is measured rather than assumed. Current runtime state is in `../.project/agentic-launch/STATUS.md`.

The owner's Windows environment was observed with five independently configured ZCode model-provider accounts/lanes. Preserve them as local environment configuration; use them for parallel work only when current reachability/routing confirms that they are actually available:

- **Owen** — 1M-context **Space Bunny Free**
- **OpenCode acct 2** — 1M-context **Space Bunny Free**
- **OpenCode acct 3** — 1M-context **Space Bunny Free**
- **OpenCode acct 4** — 1M-context **Space Bunny Free**
- **OpenCode acct 5** — 1M-context **Space Bunny Free**

These are five separate configured provider/account entries, not five configuration profiles to redesign and not automatically five proven concurrent API-call lanes. **Do not modify, rotate, replace, merge, reset, or “optimize” the provider configurations, credentials, endpoints, model mappings, or account wiring unless the owner explicitly requests configuration work.** The project's job is to schedule work across the already-wired pool.

Default to high fan-out when the work is genuinely independent. Split large objectives into independent research, implementation, test, review, exploration, and verification units and distribute those units across the five lanes. Keep dependent work ordered, avoid duplicate work unless duplication is deliberately used for independent verification, and prefer isolated branches/worktrees or other safe change boundaries when multiple lanes may edit concurrently.

Use the full pool when useful rather than serializing work through one provider. A single lane should not become the accidental coordinator bottleneck. Heads of workstreams should be able to dispatch work to available lanes, reclaim idle capacity, and rebalance assignments as work completes or blocks.

The 1M context capacity should be treated as a scarce execution resource: give each lane a coherent problem with enough local context to reason independently, but do not stuff unrelated work into one context merely because capacity exists. Preserve concise artifacts, contracts, paths, findings, and handoff state so completed work can be recombined without replaying entire sessions.

At bootstrap, verify that these five lanes and the named model are actually reachable from the current ZCode runtime, but treat the existing configuration as read-only infrastructure. If a lane is unavailable, diagnose the runtime condition and route around it; do not silently rewrite the configuration.

Before building a large feature:

1. Read the seed documents.
2. Inspect the whole seeded Ω baseline and its source documentation, tests, fixtures, gates, contracts, build artifacts, and executable behavior.
3. Establish what is actually working, what is partial, what is aspirational, and what is historical.
4. Identify the smallest complete product journey that creates real value and learning.
5. Identify the few load-bearing gaps and risks around that journey.
6. Create the development organization and execution model that the evidence warrants.
7. Begin implementation and proof.

## Required development organization at bootstrap

> **Bootstrap-time guidance; satisfied on 2026-10-05.** The four coverage areas below exist as routing vocabulary in `../.project/COMMONS.md`. They are not a permanent department structure, and this section's own last paragraph already lets the project split, merge, replace or retire them.

The fresh project is not expected to begin as a flat collection of agents. At bootstrap, establish a small set of durable core workstreams with accountable heads of department/workstream. The exact organization is deliberately discoverable, but the coverage should normally include:

- R&D / Research & Architecture Discovery — investigates uncertain technical, architectural, model, provider, and capability questions and turns useful findings into actionable proposals or experiments.
- Product Development / DevOps Efficiency — owns implementation throughput, developer experience, automation, build/test performance, tooling leverage, and the continuous reduction of development friction.
- Project Management / Governance — owns cross-workstream coordination, priorities, dependencies, delivery state, decisions, escalation, and project-level operating integrity.
- Truth / Quality / Verification — independently challenges claims, validates work, tracks proof gaps, and prevents “implemented” or “green” from being mistaken for “correct”.

Create additional heads only where the work demonstrates a persistent need. A head is accountable for the health and throughput of its workstream; it is not a constitutional authority over the project. The project may split, merge, replace, or retire workstreams as evidence changes.

Every head should have a clear communication home in a shared project **Commons** system. At minimum, provide a project-wide commons plus durable workstream rooms, with mechanisms for requests, handoffs, blockers, decisions, escalations, and cross-workstream coordination. Important communication should be discoverable and reconstructable rather than trapped in ephemeral agent context.

Development work should be able to trigger the appropriate head/workstream automatically when defined conditions occur: a new user objective, detected failure, verification gap, research question, dependency or integration conflict, stale or blocked work, scheduled maintenance, or another condition the project explicitly chooses to automate. Automatic triggering must route work to accountable owners; it must not grant hidden authority. Human-authority boundaries, consequential external effects, and constitutional changes remain governed.

## Bootstrap from available capability, not repeated rediscovery

Do not spend the opening phase manually rebuilding knowledge that is already available through the seeded ZCode capability map, installed project skills, available plugins, accessible MCP servers, ZCode-native documentation or help, and reusable development capabilities already present in the runtime.

At bootstrap, inventory those capabilities, map them to the development organization's needs, and use them as prior knowledge. Re-verify facts that are runtime-specific, version-sensitive, permission-sensitive, or materially uncertain. The goal is rapid capability leverage, not blind trust: exploit what is already known, then spend investigation effort where uncertainty actually matters.

Before creating a new skill, plugin, MCP integration, workflow, dashboard, agent role, or automation, check whether an adequate capability already exists. Prefer composing existing capabilities over recreating them.

Do not ask the owner to supply a roadmap that the repository and the product anchor can derive.

Ask only when a genuinely external, destructive, legal, financial, security-sensitive, or product-authority decision cannot be resolved by evidence and reversible experimentation.

## Strategic design mandate

Autonomous implementation should optimize for more than immediate correctness.

Prefer **capability multipliers**: solutions that make future capabilities, providers, surfaces, or realizations easier to add, replace, repair, and govern.

When a concern repeatedly appears across independent product areas, consider whether it deserves an **upgradeable engine boundary**. Candidate engine status is earned by evidence of cross-cutting leverage; it does not imply constitutional-core status.

Never treat the first successful mechanism as the final architecture. A first provider adapter, protocol manager, browser realization, selector repair path, self-healer, worker, or model integration is a proving implementation. It should be challenged by a second materially different use case or realization before being allowed to shape durable abstractions.

In particular:

- provider/protocol infrastructure should generalize across providers, protocols, versions, accounts, and realizations rather than encode one provider's quirks;
- self-healing should be a general recovery capability with observation, diagnosis, governed change, verification, evidence, and bounded learning, with provider-specific repair strategies kept inside that boundary;
- semantic contracts should remain separable from replaceable realizations;
- mechanism, capability, policy, authority, evidence, and learning should remain distinguishable;
- important engines should have an upgrade/replacement path;
- claimed architectural improvement should show measurable leverage where feasible.

Use the progression:

**concrete case → repeated pattern → reusable capability → engine candidate → validated upgradeable engine**

Do not manufacture abstraction for hypothetical futures, but do not allow the first working integration to silently become the future architecture.

## Product direction

The following are current product direction:

- VIVIM-Ω is a personal operating environment for a person's digital world, not a conventional SaaS application.
- The long-term differentiation is the combination of human semantic control, a persistent personal semantic world, governed action, durable Work/proof/continuity, and governed evolution.
- The first tangible product anchor is a persistent VIVIM environment in which real provider webapps can be used as external capabilities through the user's local environment.
- The user's durable data, state, accounts, interaction, evidence, and memory belong in the local sovereign environment, subject to the external authority of the services they interact with.
- Vault is durable canonical local truth; World and other views are derived/organized representations.
- Authority, provenance, consent, refusal, and evidence are first-class concerns.
- Natural-language interaction must separate probabilistic perception from explicit semantic meaning and governed/deterministic execution.
- Raw model output is never constitutional authority.
- Work is more durable than the worker performing it.
- Provider, Account, Session, Capability, Realization, Routing, and Authority are distinct concepts.
- Plugins and compositions are the primary extensibility mechanism for replaceable capability/product behavior.
- Forge is part of the product's ability to extend itself; generated artifacts need proof, provenance, and ordinary governance.
- The intended V1 provider realization is Chrome master/slave and browser-mediated execution, subject to live-runtime proof. Do not casually reintroduce an AI-API execution path merely because it is easier to demo.
- The canvas and provider webapp surfaces are representations/interaction boundaries, not constitutional authority.
- Fail closed when authority, provenance, capability, or execution guarantees cannot be established.

These statements may change, but not silently and not merely for implementation convenience.

## Product-anchor discipline

Keep the product tangible.

When choosing substantial work, ask whether it advances or validates a real end-to-end path through the product anchor.

A provider-webapp surface is a functional wedge, not a permanent architectural commitment.

Do not hard-wire the architecture to today's provider list, browser protocol, visual layout, or model landscape.

The durable test is whether semantic meaning, authority, Work, evidence, and user continuity survive replacement of the realization.

Do not allow the product to regress into a simulated demo when real external execution is the relevant proof.

## Semantic guardrails

Use `INVARIANTS.md` as the seed-level reference.

Especially protect these distinctions:

- reality ≠ representation;
- evidence ≠ authority;
- intent ≠ execution;
- capability ≠ realization;
- provider ≠ account;
- account ≠ session;
- discovery ≠ routing;
- routing ≠ authority;
- memory ≠ context;
- Work ≠ worker;
- World ≠ surface;
- confidence ≠ proof;
- activity ≠ progress.

Fundamental to VIVIM does not automatically mean fundamental to K0.

Keep the constitutional kernel minimal unless a concrete, non-bypassable, domain-neutral need proves otherwise.

## Evidence and learning discipline

Treat execution evidence as a first-class product and engineering concern.

When the system makes a consequential claim about work, prefer durable evidence that can distinguish completion, active work, interruption, deliberate stop, never-started work, and uncertainty where those distinctions are knowable.

Do not infer completion merely because a process disappeared, a session ended, or an error was absent.

Preserve evidence for as long as the claim depends on it.

Prefer measured behavior over prose claims.

A measurement, hypothesis, caveat, rule, and proof are different things.

Promote an observation into a governing rule only when it is actionable, testable/falsifiable, and tied to behavior the system can actually change.

Retire or supersede rules when evidence shows they are inert, unreachable, contradicted, or obsolete.

When changing a load-bearing invariant, add the smallest useful falsifier or measurement that could prove the assumption wrong.

When changing a mechanism intended to improve behavior, measure whether the intervention actually changed the target behavior.

Do not equate more agents, more tasks, more executions, more rules, more code, or greener dashboards with product progress.

## Evolution discipline

The environment may evolve itself, but self-improvement is not self-authorized sovereignty.

For consequential change, maintain enough lineage to answer what changed, why, what was affected, what authority applied, what was verified, and what remains uncertain.

Replacement should preserve user-owned canonical state and history where compatibility permits.

Unresolved impact or compatibility is not the same as zero impact or compatibility.

## Development discipline

Prefer:

**measure → understand → experiment → falsify → choose → implement → verify**

over:

**assume → organize → plan extensively → build the plan → rationalize the result**

Keep internal complexity underneath the user mental model.

Do not create a second semantic or authority system to make a feature convenient.

Do not preserve a mechanism merely because it is already implemented.

The goal is a trustworthy, tangible product, not a monument to the current architecture.

## Continuous Product Release Gym

The canonical Product Release Gym is defined in `BUILD-FOCUS.md`. It is a product-discovery and release mechanism, not a predetermined roadmap.

## A priori knowledge discipline

Before major architecture, roadmap, or organization decisions, incorporate the expanded seed context in `CONCEPTUAL-MODEL.md`, `KNOWN-REALITY-AND-OPEN-FRONTIER.md`, `PRODUCT-JOURNEYS.md`, `WORKSTREAM-LANDSCAPE.md`, `RESEARCH-FRONTIER.md`, `PROOF-AND-MATURITY.md`, and `HISTORICAL-KNOWLEDGE-MAP.md`.

Treat this knowledge as a map of intent, knowns, evidence, likely problem domains, and open questions—not as a hidden implementation specification. Preserve explicit uncertainty. When a high-risk frontier becomes relevant, use research, competing hypotheses, experiments, and independent verification rather than silently selecting the historical answer.

The expected workstream landscape is coverage guidance only. The project owns its organization and may structure the work differently if it can show better validated throughput and coverage.

## Heterogeneous local development pool

In addition to the five existing ZCode/Space Bunny Free lanes, the owner has **OpenAI Codex locally installed with ChatGPT Plus access** and **Claude Code locally installed with Claude Pro access**. Both are expected to be active participants in this project.

At bootstrap, discover their actual installed versions, reachable capabilities, modes, permissions, context/session behavior, concurrency, noninteractive/orchestration surfaces, and practical constraints. Do not infer capabilities from subscription names alone.

Treat ZCode, its five provider lanes, Codex, Claude Code, and deterministic local tools as a heterogeneous execution pool. The project may allocate implementation, research, review, testing, architecture exploration, and verification among them according to measured task fit.

Do not impose a permanent master/worker hierarchy a priori. In particular, exploit independent cross-system review where it improves confidence: an implementation produced by one model/tool can be challenged by another, with repository reality and deterministic evidence adjudicating wherever possible.

Do not modify the owner's Codex, ChatGPT, Claude, Claude Code, ZCode, or provider authentication/configuration unless explicitly asked. These tools are development infrastructure, not VIVIM product dependencies or sources of architectural authority.

## Provider Lab mandate

For substantial Provider / Account / Browser / Routing / Healing work, treat `PROVIDER-LAB-STRATEGY.md` as a preferred experimental environment unless current evidence shows a faster or better route.

The Lab should make it cheap to test provider hypotheses against real authenticated browser behavior. In particular, exploit four distinct evidence modes where useful: **Shadow** observation of normal user interactions, **Control** through a provider semantic mirror, deliberate **Conformance** testing, and **Healing Lab** break/repair experiments.

Real user interactions are an additional validation stream, not automatic ground truth. Preserve the distinction between observed browser events, inferred semantic capability, verified realization behavior, and Ω authority.

Default continuous observation toward structural/semantic metadata rather than indiscriminate capture of prompt text, responses, uploaded documents, credentials, or unrelated personal content.

Nothing important should exist only for the mirror if it is intended to graduate into Ω. Provider-Lab mechanisms earn promotion through proof and generalization pressure.

## Harvest-first engineering mandate

Before substantial new mechanism design or implementation, apply `HARVEST-FIRST-ENGINEERING.md`.

Search for existing working solutions and evidence across the current Ω baseline, historical VIVIM/BCP material, GitHub, relevant package ecosystems, browser-extension ecosystems, research prototypes, reference implementations, tests, and other appropriate sources.

Do not produce link dumps. Assay the strongest candidates and decide explicitly whether to reuse directly, adapt, wrap, port, behaviorally reimplement, use as research evidence only, or reject.

Preserve provenance and licensing/security awareness. Marketplace availability or locally accessible source does not imply permission to copy it into Ω.

Scale harvest effort with expected implementation cost, uncertainty, external coupling, and architectural leverage. The objective is faster validated progress, not research ceremony or originality.

## Optional development acceleration experiments

`DEVELOPMENT-ACCELERATION-HYPOTHESES.md` contains approved candidate ideas, not mandatory infrastructure.

When a repeated bottleneck appears, you may experiment with local development observation, automatic context reconstruction, failure capsules, demonstration-to-test conversion, regression harvesting, dynamic worker routing, isolated experiment universes, hypothesis arenas, runtime impact analysis, fault injection, development chronicles, interactive control surfaces, or other acceleration mechanisms.

Before building a substantial accelerator:
1. state the bottleneck;
2. establish a baseline where practical;
3. harvest existing solutions;
4. implement the smallest useful experiment;
5. measure whether validated throughput or reliability improved;
6. remove or simplify the accelerator if it does not earn its cost.

Do not turn development telemetry into uncontrolled capture of the owner's personal activity. Locality, minimization, explicit exclusion, bounded retention, and inspectability are default design expectations.


## First bootstrap executor

The first bootstrap run is expected to be performed by **local Codex from the local VOMEGA checkout** using `CODEX-BOOTSTRAP-START-HERE.md` as its operational entry point.

During that first run, Codex should establish machine/repository reality, discover the available heterogeneous development pool, create the minimum durable project truth/coordination needed for fresh-session continuity, run the first evidence-backed product-selection cycle, and begin real implementation or the smallest critical unblocker.

Do not let the bootstrap executor become the permanent master by inertia. Once durable project continuity exists, allocate work among Codex, Claude Code, ZCode, the five Space Bunny lanes, and deterministic tools according to task fit and evidence.

## First product release target

For first-release product work, read and follow `FIRST-PRODUCT-RELEASE-DESIGN.md`.

The floating Windows command box is now the owner-selected first-release design target. Do not continue treating it as merely one equal speculative Product Release Gym candidate.

The current implementation sequence remains evidence-driven: solve the smallest blockers needed to make that product truthful, especially deterministic semantic command resolution, real Provider/Account evidence, live `prompt.send`, evidence-backed capability projection, and contextual help grounded in actual system state.

Do not build UI polish ahead of those truths.

## Elephant context acceleration

`ELEPHANT-CONTEXT-NETWORK.md` is approved as an optional development acceleration hypothesis.

If context reconstruction or context-poor review becomes a measured bottleneck, the project may test persistent large-context domain sessions as cognitive services for workers.

Do not treat such sessions as truth or authority, and do not preassign the five Space Bunny lanes into a permanent elephant topology. Begin with the smallest experiment that can compare resident-context value against fresh-worker/context-bundle alternatives.
