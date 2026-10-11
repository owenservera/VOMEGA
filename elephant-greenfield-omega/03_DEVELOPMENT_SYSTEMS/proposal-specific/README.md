# Dedicated Z.ai Development Instance — One Per Architecture Proposal

## Fundamental rule
Every **accepted distinct authorial architecture proposal** gets its own **fresh top-level Z.ai Full-Stack session**, separate project/workspace, own child-agent dispatcher, own token/event ledger, own evidence/portfolio versions and published packs. It receives a frozen architecture dossier and explores that proposal's design space. General Z.ai exploration remains separate and may discover unrelated architectures.

The number of Z.ai builders is therefore **dynamic, equal to the number of independently launched proposal experiments**, not limited to three. Do not spawn an empty model session for a not-yet-submitted Claude design or claim an unlaunched agent exists.

## Session seed = three immutable inputs
1. **Common baseline** — ../../00_CORE_BASELINE/ vision and frozen Ω seed.
2. **Required outputs** — ../../01_EXPECTED_OUTPUTS/ especially mandatory every-turn portfolio publication and external handoff.
3. **Exactly one anchored proposal** — ../../02_ARCHITECTURE_PROPOSALS/<proposal-id>/ authored text, version/hash and declared assumptions. Do not expose other current architectures by default.

Store a machine-inspectable launch manifest with proposal/source SHA, runner/model version, isolated workspace location, actual Z.ai session identity, child/subagent capabilities, permissions, budget and source/fixture epoch. An author/model name is NOT a session ID.

## Internal experimentation
Within each dedicated proposal session, the controller must **genuinely launch at least four separate context-isolated child experiments per round**, e.g. two competing local refiners R1/R2 with two different falsifiable arms each (P1/P2 and Q1/Q2). These internal strategy names are disposable research orientations, not a new architecture author list or a preordained component list.

- Refiner P favors a direct minimal viable manifestation of the proposed design.
- Refiner Q favors stress-testing, alternative implementation tactics or reduced complexity **inside the same proposal hypothesis**.
- Both independently absorb published evaluated results and keep separate candidate lineages while useful. They can reject parts of the design; they cannot silently re-label an unrelated architecture as successful validation.
- Different experiment arms must test different uncertainties: context behavior, correctness, resource economics, failure/recovery, communication and integration as relevant to the proposal; do not precommit to a fixed feature or pack list.
- Optionally add a lagged standards/reuse challenger (two more truly isolated arms) like general Track C when the cost is justified. It can benchmark but never self-certifies. **Do not label it active until actually executed.**
- Evidence includes actual code/tool calls, child IDs, isolated worktrees, model usage or UNKNOWN, tests, timestamps and independent judge.
- Keep frozen Ω E0 baseline and compare E1/E2 when genuinely supported, recording full refresh/coordination costs.

## Research boundary and honest drift
At launch freeze the proposal's **core causal thesis** and chosen invariants as an architecture anchor. An experiment may revise transport, libraries, context-flush method or interfaces and publish accepted changes. A substantial change to the core explanatory architecture is a **derived proposal** with lineage and separately measured performance, not silent confirmation of the original author. Do not ban fruitful discoveries; make them inspectable.

## Release rhythm
**Each top-level turn**: publish a complete indexed portfolio of every discovered/failed/in-progress/unchanged/mature pack from each internal refiner and the lab aggregate, with actual content or hashed retrievable immutable references. **Each round**: compare true arms, independently assimilate evidence, publish pack-level/portfolio-level/systems-level results, and propose next four real experiments. No minimum number of accepted packs per round.

## Isolation between proposal labs
Separate full Z.ai sessions are a research requirement. Different proposals do not share chat histories, mutable worktrees, child queues or hidden evaluator fixtures. They may read **released** pack exports and public standards only according to explicitly recorded experiments and fair contamination policy. They may share vetted substrate utilities with attribution, never falsely call the same controller three independent sessions.

## Delivery and verification
A proposal instance should eventually export a runnable/reference implementation of its architecture, reproducible context reset/source basis, independently verifiable useful Ω product behavior, complete portable pack portfolio and a calibrated claim for E0/E1/E2 speed vs cost. If the substrate cannot actually launch independent subagents, report blocked evidence and use a verified external runner or stop; never roleplay fan-out.
