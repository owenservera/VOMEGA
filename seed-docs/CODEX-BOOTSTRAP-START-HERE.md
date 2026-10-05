# Codex Bootstrap — Start Here

## Role

You are the **first bootstrap executor** for this fresh local VIVIM-Ω project.

You are running from the local VOMEGA repository checkout.

Your job is not to become the permanent project manager, permanent architecture authority, or permanent master agent.

Your job is to:

> **turn this clean seed into a durable, reality-grounded, self-continuing development project and then begin real product work.**

Codex is the first bootstrap executor because it is locally installed and available now. That is an execution fact, not a constitutional hierarchy.

## Repository shape at bootstrap

Expect the clean repository root to contain:

- `omega-baseline/` — current Ω implementation baseline and evidence source;
- `seed-docs/` — product, architecture, research, DevOps, and bootstrap guidance.

Do not assume omitted historical folders or old project-management machinery exist locally.

Historical BCP-dev material is an external knowledge mine referenced by the seed docs.

Do not modify `omega-baseline/` merely to make the repository look like a normal application root before you understand it.

Do not reorganize the seed for aesthetic reasons.

First establish reality.

## Read before major action

Read the complete `seed-docs/` corpus before making major architectural, organizational, or product commitments.

At minimum, understand the roles of:

- `START-HERE.md`
- `VISION.md`
- `PRODUCT-ANCHOR.md`
- `INVARIANTS.md`
- `PROJECT-CONTEXT.md`
- `CONCEPTUAL-MODEL.md`
- `KNOWN-REALITY-AND-OPEN-FRONTIER.md`
- `PRODUCT-JOURNEYS.md`
- `WORKSTREAM-LANDSCAPE.md`
- `BUILD-FOCUS.md`
- `PROOF-AND-MATURITY.md`
- `HARVEST-FIRST-ENGINEERING.md`
- `PROVIDER-LAB-STRATEGY.md`
- `DEVELOPMENT-ACCELERATION-HYPOTHESES.md`
- `RESEARCH-FRONTIER.md`
- `HISTORICAL-KNOWLEDGE-MAP.md`
- `AGENTS.md`
- `AUTONOMY.md`
- `ZCODE-CAPABILITY-SPACE.md`

Do not treat document volume as authority.

Use the hierarchy expressed by the seed itself:
- durable product intent and invariants constrain;
- current implementation and historical material provide evidence;
- strategies and accelerators are hypotheses;
- the current build plan must be derived from present reality.

## First rule: establish machine and repository reality

Before designing a large development system, inspect the actual local environment.

Determine, without rewriting configuration:

### Repository reality
- current Git branch, remotes, status, worktrees, and recent history;
- actual contents of `omega-baseline/`;
- package/runtime requirements;
- tests, fixtures, gates, scripts, and executable entry points;
- what currently builds;
- what currently runs;
- what currently fails;
- which browser/provider paths are fixture-only;
- which claims have live evidence;
- what is missing from the clean seed.

Classify meaningful product/runtime capabilities as:
- working/live;
- verified but not live;
- partial;
- fixture/simulated;
- historical only;
- aspirational;
- broken;
- unknown/blocked.

Do not infer readiness from filenames, test names, documentation claims, or historical decision IDs.

### Development environment reality
Inspect what is actually installed and reachable locally, including where safe:

- Codex itself;
- Claude Code;
- ZCode;
- the five existing ZCode provider lanes:
  - Owen;
  - OpenCode acct 2;
  - OpenCode acct 3;
  - OpenCode acct 4;
  - OpenCode acct 5;
- Space Bunny Free availability on those lanes;
- Git and available worktree support;
- Bun/Node/TypeScript/runtime versions relevant to the repo;
- Chrome/browser development capability;
- existing extensions relevant to provider work;
- available skills, plugins, MCPs, hooks, workflows, browser tools, and other development capabilities exposed by the installed systems.

Treat authentication, subscription, provider, endpoint, model mapping, and credential configuration as **read-only infrastructure** unless the owner explicitly asks you to change it.

If something is unavailable, record it and route around it.

Do not silently repair configuration.

## Heterogeneous development pool

The development environment includes at least these potential participants:

- local Codex;
- local Claude Code;
- ZCode;
- five separately configured ZCode / Space Bunny Free provider lanes;
- deterministic local tools, tests, scripts, Git, browser instrumentation, and other installed capabilities.

You may use these resources when useful.

Do not assume Codex should remain coordinator simply because Codex is bootstrapping the project.

Do not assume every tool needs to be activated immediately.

Discover practical strengths and limitations.

Use independent systems for:
- parallel repository archaeology;
- competing architecture hypotheses;
- implementation;
- independent review;
- test/falsifier generation;
- research;
- long-context synthesis;
- cross-model verification;

when the expected information gain or speedup justifies the coordination cost.

Repository reality and reproducible evidence should adjudicate disagreements wherever possible.

## Harvest before inventing

Before substantial new implementation, apply `HARVEST-FIRST-ENGINEERING.md`.

Look first for working solutions and evidence in:
- the current Ω baseline;
- historical VIVIM/BCP material;
- GitHub/open source;
- packages;
- browser extensions and public upstream source;
- existing installed development tools;
- research prototypes;
- tests, fixtures, protocols, failure reports, and reference implementations.

Do not merely collect links.

For serious candidates, decide whether to:
- reuse directly;
- adapt;
- wrap;
- port;
- behaviorally reimplement;
- use as research evidence only;
- reject.

Preserve provenance and licensing/security awareness.

## Do not overbuild DevOps before product work

Bootstrap only enough development machinery to make the project:
- reconstructable by a fresh session;
- able to coordinate concurrent work safely;
- able to track objective/work/blocker/decision/evidence state;
- able to verify claims;
- able to use the heterogeneous development pool;
- able to continue after this Codex session ends.

Avoid building a large autonomous-development platform before there is measured need.

The seed contains many acceleration hypotheses.

They are an experiment menu, not bootstrap requirements.

Provider Lab is a preferred experiment for provider/browser work, not an excuse to delay all product progress.

## Durable bootstrap outputs

Create durable repository artifacts sufficient for a fresh Codex, Claude Code, or ZCode session to reconstruct the project without this conversation.

Choose the exact file/folder structure yourself.

Do not cargo-cult old BCP-dev project-management trees.

At minimum, durable project truth should make it possible to discover:

### 1. Environment / capability census
What local development systems and important capabilities are actually available now.

### 2. Repository reality
What the seeded Ω implementation actually proves today, including live/fixture/partial/unknown classifications.

### 3. Current project objective
What the project is trying to make real now and why.

### 4. Work ownership / coordination
Enough durable structure to know:
- active work;
- owner/worker;
- status;
- dependencies;
- blockers;
- requests/handoffs;
- verification state.

Use Commons/workstream rooms or another mechanism if useful.

The seed expects coverage of research/architecture, product/DevOps efficiency, coordination/governance, and independent truth/verification, but the exact organization is yours to derive.

### 5. Decision and uncertainty state
Important current decisions, hypotheses, unresolved questions, assumptions, and what evidence would change them.

### 6. Verification / evidence state
What claims are proven, what remain fixture-only, what needs live proof, and what falsifiers/gates matter now.

### 7. Product Release Gym result
Run the current product-discovery/release mechanism in `BUILD-FOCUS.md`.

Generate serious candidates, compare them against real current-code readiness and user value, and choose the strongest first product experiment or unblocker.

Do not treat the existing floating control-center idea as mandatory if current evidence produces a stronger candidate.

### 8. Bootstrap SITREP
Create a concise durable bootstrap status artifact that a fresh session can read first.

It should state:
- current reality;
- current objective;
- active work;
- key risks/unknowns;
- what is proven;
- what is not;
- next highest-value actions;
- where the detailed truth lives.

## Then begin real work

The bootstrap is not complete when the organization exists.

The bootstrap is complete when the project can continue without this session **and has transitioned into real product execution**.

After the minimum durable project system is in place:

1. select the first evidence-backed product experiment or critical unblocker;
2. perform the harvest pass appropriate to its cost/risk;
3. implement the smallest meaningful slice;
4. run deterministic verification;
5. run live verification where the claim crosses external reality and the environment permits;
6. preserve evidence;
7. update durable project truth;
8. commit useful completed work.

If a blocker prevents implementation, execute the smallest experiment that reduces the blocker rather than producing more planning prose.

## Provider/browser work

If the first selected experiment materially involves provider/browser realization, read and use `PROVIDER-LAB-STRATEGY.md`.

The Provider Lab is a strong development hypothesis because it can combine:
- live provider interaction;
- semantic mirror/control;
- Shadow observation of normal human use;
- conformance testing;
- drift detection;
- harvesting of existing provider extensions/tools;
- healing experiments.

Do not build a polished extension before proving the smallest useful capability.

The first provider implementation is evidence for one case, not proof of a universal abstraction.

Use second-provider pressure when it becomes decision-relevant.

## Development acceleration

Use `DEVELOPMENT-ACCELERATION-HYPOTHESES.md` only against measured bottlenecks.

Possible accelerators include:
- Development Reality Layer / Dev Black Box;
- context bundles;
- failure capsules;
- trace-to-test/fixture;
- regression harvesting;
- disposable experiment universes;
- dynamic worker routing;
- hypothesis arenas;
- automatic harvest triggers;
- session chronicles;
- runtime impact analysis.

Do not bootstrap all of them.

An accelerator earns permanence by improving validated product progress.

## Git and change discipline

Protect the clean seed and make changes reconstructable.

Before parallel modification:
- inspect current Git state;
- use safe branches/worktrees or another isolation mechanism where useful;
- avoid multiple workers editing the same files without coordination;
- keep commits coherent;
- do not rewrite shared history casually;
- preserve provenance for harvested code/artifacts.

Do not create branch proliferation as a project-management substitute.

If the repository remote and permissions permit normal pushes, push completed coherent commits so durable project truth is not trapped only on the local machine.

Do not expose or commit credentials, tokens, private browser state, or secrets.

## Owner interaction

Do not ask the owner to provide a roadmap that can be derived from repository reality, seed intent, experimentation, or research.

Escalate when genuinely necessary for:
- irreversible/destructive action;
- credentials/auth configuration changes;
- legal/licensing ambiguity that affects reuse;
- financial consequences;
- material security/privacy tradeoffs;
- product-authority decisions that cannot be falsified or derived;
- external facts unavailable to the development environment.

When uncertain but a reversible experiment can resolve the issue, prefer the experiment.

## Anti-patterns for the first bootstrap

Do not:
- recreate an old BCP-dev agent organization;
- spend the entire session writing governance documents;
- make Codex the permanent master by default;
- treat every seed idea as something to implement;
- install or build tools before checking what already exists;
- build an elaborate dashboard before concurrency creates a real need;
- call fixture/browser mocks “live provider proof”;
- treat a successful process exit as product completion;
- copy marketplace/GitHub source with unclear reuse rights;
- rewrite ZCode/Codex/Claude authentication or provider configuration;
- port the old VIVIM system wholesale;
- invent architecture around ChatGPT alone and call it universal;
- optimize for agent activity instead of validated product progress.

## Initial response to the owner

Once you have performed enough reconnaissance to be grounded, give the owner a concise initial SITREP containing:

- what you found;
- what is actually working versus fixture/partial;
- the development capabilities available;
- the minimum development organization/coordination you established;
- the first selected product experiment or blocker;
- what you have already started or completed;
- the next few actions and why.

Do not make the response a substitute for writing durable repo truth.

## Success condition for this first Codex bootstrap

A successful bootstrap leaves behind a project that:

- understands its current implementation reality;
- understands its available local development resources;
- has durable, minimal coordination and truth;
- can survive a fresh session;
- has selected an evidence-backed first product direction;
- has begun real implementation or the smallest critical unblocker;
- can verify progress;
- can exploit Codex, Claude Code, ZCode, and the five Space Bunny lanes without depending constitutionally on any of them;
- knows that Harvest-First, Provider Lab, and development accelerators are tools for speed, not replacements for product proof.

**Bootstrap enough to move fast. Then build.**
