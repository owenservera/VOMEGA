# Vision — Context-Resident Cognition as Development Infrastructure

## Foundational vision

Modern software-agent teams repeatedly reconstruct the same understanding: implementation architecture, semantic invariants, provider limitations, historical reasoning, known failures, dependencies, tests and the why behind decisions. An Elephant is an active, long-context, potentially persistent **cognitive consult service** that maintains a deep, time-bounded project-domain model. Other agents ask it questions, submit artifacts, receive critiques and candidate corrections, and continue implementing. The purpose is to reduce repeated reconstruction while improving grounded architectural decisions.

The product we are actually researching is not “a group chat of AI personas.” It is a **measurable, reconstructable, version-aware cognitive execution fabric** spanning real agent sessions, source snapshots, verified evidence, context lifecycle, work scheduling, concurrency and cost accounting. Its public interface should be independent of providers: one worker asks for context, the system obtains the best available grounded answer and discloses basis, staleness and uncertainty. Later, the network can allocate cognition dynamically rather than pinning domains to permanent agents.

## Why E0→E1→E2

E0 (no Elephant) is a serious baseline: workers with ordinary repository read, focused context bundles, standard tools, tests and fresh sessions. E1 adds one domain-context Elephant capable of consult, patch review, dependency-trace and historical reasoning; the Elephant does not silently write shared source. E2 adds two *actual concurrent* Elephant sessions holding partially distinct domains or orthogonal context strategies, using explicit cross-domain consultation and contradiction records. E2 must earn its additional complexity compared with E1 and E0.

E0, E1, E2 describe the **number of active Elephant cognitive nodes**, not the number of master development teams. In each round two persistent masters compete over the best way to implement and operate the protocol at the chosen level(s).

## Primary hypotheses

H1 — A resident contextual model produces faster **verified** progress than fresh workers paying a reconstruction tax on repeated tasks. H2 — The benefit is larger on cross-cutting changes, historical design questions, and hard reviews than on simple edits. H3 — Explicit Git epoch awareness and deterministic citation checking prevent much of the stale-memory failure risk. H4 — Two complementary Elephant nodes catch contradictions and missed dependencies the single node overlooks, but coordination may erase the benefit. H5 — A bounded, rebuildable context representation outperforms naively appending entire dialogues indefinitely. H6 — Observability and task-specific routing can allocate a scarce 1M-token capability by measured marginal value. H7 — Competition between two independently evolving operating approaches yields better systems than converging all experimentation into one favored method after every round.

## Development speed: expectations, not advertised multipliers

Measure **accepted useful work per end-to-end wall hour**: completed tasks passing independent checks and user-visible functionality, with time spent bootstrapping, loading contexts, consulting, reconciling, debugging and integrating included. Secondary measures: first-correct-edit latency, retries, useful accepted tests, verified defects found per review, architectural regression rate, token expenditure and result reproducibility. Report medians and distributions, uncertainty and total sample counts—not unqualified “X times faster” numbers. Do not count generated lines, agent messages, or task completions with unverified behavior as speed.

The research program may set *aspirational* success bands (e.g. 20–40% faster verified delivery on representative repeated work), but no band is established performance. E0 may win. An Elephant that reduces tokens but raises hallucinated constraints, queue times or synchronization overhead should be retired.

## Novel intellectual property (IP) objective

Capture potentially novel mechanisms along the way: epoch-bounded response validity, cognitive partition adaptation, flush/reconstitution proofs, cross-context contradictory-dependency tests, token-adjusted dynamic routing, causal attribution of team productivity, knowledge promotion with executable falsifiers, adaptive split/merge and competition-preserving research operations. Every novelty entry must contain mechanism, prior-art candidates, distinguishing evidence, measurable advantage, implementation trace, owner, contradictory results, and whether the claim remains speculative. We are building defensible research artifacts, not presuming patentability or exclusivity.

## Operating values

Truth outranks persuasive memory. Auditability outranks attractive dashboards. Small observable capabilities outrank unbounded scaffolding. Real isolated agents outrank theatrical role labels. Two genuine competing implementations outrank artificial consensus. Visible failures outrank hidden fallbacks. A system that can recover after power loss and rotate every context without losing canonical state outranks an impressive but irreproducible session.

## Relationship to Omega seed

Greenfield Ω is a controlled product challenge, not a mandate to reproduce legacy VOMEGA. Start with a tiny deterministic prompt-fanout tool, three simulated provider adapters and visible actions. Add complexity only when the lab earns the ability to measure it. This allows the lab to test itself while building something useful, without requiring live provider credentials, scraping, or third-party service actions at the outset.
