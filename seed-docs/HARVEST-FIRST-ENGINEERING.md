# Harvest-First Engineering — Evidence Before Reinvention

## Status

**PROGRAM-WIDE DEVELOPMENT DOCTRINE**

Before substantial invention, determine whether the problem has already been solved, partially solved, characterized, tested, or failed elsewhere in a form that can materially accelerate VIVIM-Ω.

The objective is not maximum reuse.

The objective is:

> **reach the best verified solution faster by harvesting existing working evidence before paying the full cost of invention.**

This doctrine applies across the program: Provider Lab, browser automation, storage, Work/agency, plugins, Forge, Windows integration, observability, testing, orchestration, local search, UI infrastructure, security, recovery, and other substantial engineering domains.

## Core loop

Prefer:

**define problem → search → inspect → assay → harvest → adapt → falsify → integrate → prove**

before:

**guess → design from scratch → implement → debug → discover later that working solutions already existed**

A harvest pass is not a substitute for engineering judgment. It is a way to begin from more evidence.

## What counts as a harvest source

Potential sources include:

- existing VIVIM / BCP / Ω implementations and historical branches;
- GitHub and other open-source repositories;
- package ecosystems such as npm/Bun and relevant language registries;
- browser-extension marketplaces and locally installed extension source where legitimately accessible for inspection;
- public browser extensions with source repositories;
- developer tools and DevTools extensions;
- research prototypes and papers with runnable artifacts;
- reference applications and SDK examples;
- standards/reference implementations;
- public test suites, fixtures, protocol traces, schemas, parsers, compatibility data, and benchmarks;
- working commercial/free tools whose externally observable behavior can inform requirements even when their code cannot be reused.

Search broadly enough to discover different solution families rather than merely finding the first project that confirms the team's initial idea.

## Harvest is broader than code reuse

A source may be valuable even when none of its code should enter Ω.

Harvestable assets include:

- proven behavior;
- protocol or provider knowledge;
- semantic capability maps;
- API/DOM/accessibility interaction techniques;
- selectors or discovery strategies;
- state machines;
- recovery logic;
- edge cases;
- failure modes;
- compatibility constraints;
- data models;
- test cases;
- fixtures;
- benchmarks;
- architecture patterns;
- negative results;
- operational gotchas;
- security lessons;
- UX patterns;
- setup/installation mechanics;
- evidence that a seemingly attractive approach does not work.

The highest-value harvest may be a test or failure lesson rather than implementation code.

## Required harvest decision

A meaningful harvest pass should end with an explicit disposition for each serious candidate:

- **REUSE DIRECTLY** — suitable code/artifact can be adopted with acceptable provenance, fit, license, security, and maintenance burden.
- **ADAPT** — mechanism is useful but needs modification to satisfy Ω semantics or environment.
- **WRAP** — preserve the working implementation behind an Ω-compatible boundary.
- **PORT** — re-express the implementation in the target runtime/language while preserving proven behavior.
- **BEHAVIORAL REIMPLEMENTATION** — code cannot or should not be reused, but observed behavior/tests/specification provide a valid target.
- **RESEARCH / EVIDENCE ONLY** — useful knowledge, tests, constraints, or design evidence without implementation reuse.
- **REJECT** — poor fit, unsafe, stale, unmaintainable, architecturally harmful, legally unusable, or disproven.

A candidate should not become architecture merely because it already works somewhere else.

## Assay dimensions

Depth should scale with the importance and cost of the target problem, but relevant dimensions include:

- does it actually solve the same problem?
- does it work now?
- when was it last meaningfully maintained?
- is the source complete enough to understand?
- what assumptions does it make?
- what external/provider/version dependencies exist?
- how much special-case coupling does it contain?
- what tests or live evidence exist?
- what failure/recovery paths exist?
- what security or privacy implications exist?
- what credentials or privileges does it require?
- what is its license and what does that permit?
- what transitive dependency/licensing obligations follow?
- what provenance must be retained?
- what would be difficult to replace later?
- which parts conflict with Ω invariants?
- can the useful behavior be isolated behind a replaceable boundary?
- does using it make the second implementation/provider easier or harder?
- what evidence would falsify the assumption that harvesting it is faster?

Do not turn this into paperwork for trivial dependencies. Apply the dimensions proportional to risk.

## Licensing, provenance, and source-access discipline

Publicly visible or locally accessible source code is not automatically reusable code.

Before copying or adapting source into the project, establish enough provenance and licensing information to understand whether reuse is permitted and what obligations follow.

For browser marketplace extensions in particular:
- marketplace availability does not imply an open-source license;
- locally installed/unpacked code may be useful for inspection, interoperability research, behavior characterization, testing ideas, and identifying public upstream repositories;
- do not silently copy proprietary source into Ω;
- when license or ownership is unclear, prefer behavior/test harvesting or independently developed interoperable implementation;
- preserve source URL/repository, version/commit where available, license, relevant files, and what was actually harvested.

The project should be able to explain where a meaningful harvested mechanism or behavior came from.

## Security and supply-chain discipline

A working third-party solution can also import risk.

Before direct reuse or execution, consider:
- suspicious install/build scripts;
- secrets/credential handling;
- remote telemetry;
- arbitrary code execution;
- unexpected network access;
- excessive browser permissions;
- extension host permissions;
- dependency health;
- abandoned packages;
- binary blobs;
- obfuscated/minified source;
- update channels;
- known security issues.

Research copies and experiments should be isolated appropriately.

A successful demo does not waive supply-chain scrutiny.

## Depth should scale with expected reinvention cost

Harvesting should accelerate development, not become an infinite research phase.

Use proportional effort.

For a tiny reversible utility, a quick ecosystem check may be enough.

For a mechanism expected to consume days or weeks, affect a high-leverage boundary, interact with external providers, or become difficult to replace, deep harvest research may have exceptional return.

A useful question is:

> **How much engineering cost are we about to commit while still ignorant of existing working solutions?**

The larger the answer, the stronger the case for a deeper harvest pass.

## Parallel harvest

The heterogeneous development pool makes harvest work especially suitable for fan-out.

Independent workers can search different source classes or solution families:
- GitHub repositories;
- marketplace extensions;
- packages;
- research/prototypes;
- historical VIVIM/BCP;
- competing architectures;
- tests/security/failure reports.

Fan-in should compare candidates against one shared problem statement and evidence rubric rather than producing disconnected link lists.

Deliberate independent duplication is useful when verifying whether a supposedly best candidate survives different search strategies.

## Harvest bench

For sufficiently important domains, create a temporary or persistent **Harvest Bench**: an environment in which several candidate solutions can be inspected, run, compared, instrumented, and tested against the same target behavior.

The bench should make comparison cheap.

Useful outputs can include:
- capability matrix;
- implementation-family map;
- live behavior notes;
- reusable test vectors;
- security/license notes;
- integration complexity;
- observed strengths/failures;
- recommended disposition;
- experiments needed before adoption.

The bench is development infrastructure, not Ω product architecture.

## Provider Lab application

Provider Lab is a particularly strong harvest environment.

Before inventing a provider capability realization, search for working browser extensions, integrations, automation tools, wrappers, libraries, and historical implementations that already exercise the target provider behavior.

For example, for a capability such as attachment upload or model selection, harvested sources may reveal:
- control discovery techniques;
- DOM/accessibility patterns;
- provider-native state transitions;
- network/protocol clues;
- completion detection;
- account/session signals;
- retry/recovery behavior;
- provider drift history;
- test cases.

Candidate techniques can then be tested immediately against the real provider in the Lab.

The preferred flow becomes:

**capability need → harvest search → candidate mechanisms/evidence → live Lab assay → Ω-compatible realization candidate → conformance proof**

This can dramatically reduce blind selector/protocol experimentation.

## Harvest versus abstraction

Do not copy the architecture surrounding a useful mechanism unless that architecture independently earns adoption.

Separate:
- the capability/behavior worth harvesting;
- the implementation technique;
- the source system's architecture;
- the source system's authority model;
- the source system's data model;
- the source system's UX.

A project can contain an excellent solution to one narrow problem while embodying assumptions that are wrong for Ω.

Harvest the ore, not the mine.

## Harvest versus generalization

Existing implementations are also useful as variation evidence.

If five provider extensions solve the same problem five different ways, that is evidence about where provider specificity lives.

If several independent systems converge on the same mechanism, that is evidence worth investigating—not proof that Ω must use it.

Use harvested diversity to improve the second-use/second-realization tests and to avoid designing abstractions from a single example.

## Evidence and promotion

No harvested mechanism is promoted merely because:
- it is popular;
- it has many GitHub stars;
- it works in its original project;
- a model recommends it;
- its code looks elegant;
- it appears in several extensions.

Promotion requires evidence relevant to Ω's actual environment and claim.

Depending on the target, that may include:
- local tests;
- compatibility checks;
- live provider behavior;
- failure/recovery cases;
- security review;
- license/provenance confirmation;
- second-realization testing;
- performance measurement;
- architectural boundary review.

**Existing success is prior evidence, not Ω proof.**

## Preserve negative knowledge

Record meaningful rejected candidates and why they were rejected when rediscovery would be expensive.

Examples:
- incompatible license;
- stale provider behavior;
- insecure credential model;
- hidden SaaS dependency;
- browser permission overreach;
- architecture too coupled;
- poor Windows support;
- abandoned upstream;
- failure under second-provider testing.

This prevents future agents from paying the same archaeology cost again.

## Anti-patterns

Do not:
- begin a large subsystem with no serious search for existing solutions;
- search only for libraries matching the architecture already imagined;
- judge candidates by stars/downloads alone;
- copy code whose provenance/license is unclear;
- inherit a source architecture merely to reuse one mechanism;
- spend more time building a reusable harvest bureaucracy than the target problem warrants;
- collect hundreds of links without assaying the strongest candidates;
- confuse a marketplace extension's working behavior with legal permission to copy its code;
- claim a harvested mechanism is proven in Ω before testing it in Ω's actual environment;
- reject a useful source because it is architecturally ugly if its behavior/tests can still teach the project something;
- reinvent for prestige.

## Program trigger

Before committing substantial engineering effort to a new mechanism, the responsible workstream should be able to answer:

1. What exact problem are we solving?
2. What existing implementations/evidence did we inspect?
3. What did we learn or harvest?
4. What candidates were rejected and why, if material?
5. Why is the selected path reuse, adaptation, wrapping, porting, behavioral reimplementation, or new invention?
6. What evidence will prove the resulting Ω mechanism works?

For trivial or highly reversible work, this can be implicit and brief.

For expensive, risky, externally coupled, or architecturally load-bearing work, it should be explicit and durable.

## Strategic principle

VIVIM-Ω is not rewarded for originality of mechanism.

It is rewarded for reaching a sovereign, trustworthy, useful, evolvable product faster.

**Harvest before build. Prove reuse before invention.**
