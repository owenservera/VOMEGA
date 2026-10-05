# First Wave — Local Agentic Team Dispatch

Status: **READY FOR LOCAL BOOTSTRAP EXECUTION**  
Parent: [README.md](README.md)

This is the first bounded dispatch for the local VOMEGA agentic team.

It is intentionally designed to:

- use the available heterogeneous execution pool;
- maximize independent work;
- avoid write collisions;
- produce the five interface locks in `DEPENDENCY-GRAPH.md`;
- transition quickly from architecture into executable semantic/sandbox evidence.

## 1. Preflight — DEV

Before dispatching write-capable workers:

1. Record current:
   - Git HEAD;
   - status;
   - worktrees;
   - Bun version/path actually used;
   - ZCode version;
   - Codex version;
   - Claude Code version.

2. Verify, read-only:
   - Owen ZCode lane reachable;
   - OpenCode acct 2 reachable;
   - OpenCode acct 3 reachable;
   - OpenCode acct 4 reachable;
   - OpenCode acct 5 reachable;
   - named `space bunny free` model resolves on each.

3. Do not modify:
   - provider configuration;
   - API keys;
   - endpoints;
   - auth;
   - model mapping.

4. Create short-lived worktrees only for workers that will write concurrently.

5. Establish one integration/merge queue.

If a lane fails, mark it unavailable and continue with the healthy pool.

### Grok Build candidate lane

The owner is installing Grok Build. Treat it as a candidate additional local harness, not as available capacity until DEV verifies `grok version` and `grok inspect`.

If healthy, add Grok Build to the pool for one bounded comparative task before giving it persistent ownership. Prefer a first task in EXP, TRU, SKW audit, or a bounded implementation worktree where its headless/workflow/worktree capabilities can be measured.

Do not run `grok setup` or rewrite user/global Grok configuration during preflight.

Do not repair provider configuration automatically.

## Frontier model routing

Before dispatch, read [MODEL-ROUTING.md](MODEL-ROUTING.md).

Do not assign Astra or Fable as permanent workers. Use GPT-6.1 Sol / Opus 5.5 for serious premium work, Sonnet 5.5 / GPT-6 Luna / Space Bunny for bounded execution, and reserve Astra/Fable for adjudication, hard debugging, browser/computer-use escalation and independent review.

## 2. Default initial allocation

This allocation is a launch default, not a permanent hierarchy.

If observed tool capability suggests a better allocation, DEV may reroute while preserving task ownership.

### ZCode lane 1 — SDW

**Task:** SDW-L1 — MVP semantic contract + fixture Worlds

Read:

- `seed-docs/SEMANTIC-DATA-ENGINE.md`
- `seed-docs/MVP-VISUALIZATION-SANDBOX.md`
- `seed-docs/CONCEPTUAL-MODEL.md`
- `seed-docs/INVARIANTS.md`
- `.project/roadmap/workstreams/WS-REG-registry-capability-state.md`
- current Provider registry and NLCL WorldModel types
- external OS-taxonomy candidate as evidence only

Deliver:

- exact current-code gap map;
- candidate semantic record/interfaces for Provider/Account/Model/Capability/Realization;
- synthetic World fixture schema;
- six named MVP Worlds;
- compatibility/adaptation plan from current WorldModel;
- tests/falsifiers that would prove identity separation.

Do not:

- implement provider browser behavior;
- encode current risk class into semantic ID;
- claim fixture Models are real provider offerings.

**Primary handoff:** Lock A.

### ZCode lane 2 — LNC

**Task:** LNC-L1 — compiler/UseCommand/InterpretationSession nucleus

Read:

- `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`
- `seed-docs/SEMANTIC-DATA-ENGINE.md`
- `seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md`
- existing `vivim-nlcl-pure` implementation
- release-use corpus
- CMD workstream

Deliver:

- exact current NLP/NLCL gap map;
- candidate `UseCommand` v0;
- Provider/Account/Model route semantics;
- validation outcomes;
- revision/session contract;
- proposed corpus additions for:
  - addressee-first;
  - Model routing;
  - explicit-target precedence;
  - quoted Provider/Model names;
  - orientation;
  - correction.

Prefer a bounded implementation spike where interfaces are clear.

Do not wait for a complete SDW implementation; use an adapter/fixture against the Lock A proposal.

**Primary handoff:** Lock B.

### ZCode lane 3 — VFX

**Task:** VFX-L1 — VisualSpec vNext + sandbox scaffold

Read:

- `seed-docs/COMMAND-VISUAL-LANGUAGE-DESIGN.md`
- `seed-docs/MVP-VISUALIZATION-SANDBOX.md`
- historical symbolic/SVG harvest as research evidence;
- current `VisualSpec` declarations;
- current `project.ts`;
- SHL workstream.

Deliver:

- current projector gap map;
- VisualSpec vNext candidate;
- semantic-handle model;
- renderer scaffold;
- three visual variants using a frozen fixture:
  - annotated sentence;
  - semantic strip;
  - hybrid;
- clear separation of:
  - Provider;
  - Account;
  - Model;
  - capability;
  - payload;
  - unresolved choice;
  - consequence.

Do not parse raw language in UI.

Do not hide routing state inside React/component state.

**Primary handoff:** Lock C.

### ZCode lane 4 — SKW

**Task:** SKW-L1 — Reflection Migrator audit + minimal graph

Read:

- `seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md`
- `seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md`
- `seed-docs/SEMANTIC-DATA-ENGINE.md`
- current `PluginManifest`;
- current plugin manifests;
- current registered op patterns;
- `vivim.mind` / `control.describe`.

Deliver:

- deterministic read-only inventory of:
  - plugins;
  - declared ops;
  - implemented ops;
  - schemas;
  - source anchors;
- proposed Reflection node/edge representation;
- manifest↔implementation parity findings;
- MVP `prompt.send` graph fixture;
- completeness gaps.

Do not rewrite source in this task.

Do not treat comments/README prose as structural truth.

**Primary handoff:** Lock D.

### ZCode lane 5 — EXP

**Task:** EXP-L1 — scenario runner + semantic diff baseline

Read:

- `seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md`
- `seed-docs/SEMANTIC-RUNTIME-LAB.md`
- current release-use corpus/tests;
- current NLCL interpreter;
- proof/maturity rules.

Deliver:

- reusable scenario-runner shape;
- execution of current release corpus through it;
- semantic diff format;
- baseline metrics:
  - wrong target;
  - false ready;
  - ambiguity honesty;
  - deterministic replay;
- metamorphic test candidates;
- format for consuming VFX VisualSpec later.

Do not define “accuracy” as the single success metric.

Do not auto-promote candidate grammar.

**Primary handoff:** EXP baseline + contract tests for Locks A/B/C/D.

### Additional verified Grok Build capacity

If Grok Build preflight succeeds before first fan-out, DEV may either:

- assign Grok Build a bounded independent TRU/EXP/SKW task for comparative evidence; or
- use it as an additional implementation worker where write-set isolation is clear.

Do not displace a healthy existing worker solely because Grok 4.7 is newer. Measure task quality and SuperGrok weekly-pool consumption first.

## 3. Codex — DEV launch + PRV reconnaissance

The first Codex session is a bootstrap/integration executor, not permanent master.

After DEV preflight:

### DEV-L1

- instantiate task isolation;
- create/update launch status;
- ensure each worker has bounded write set;
- keep merge queue;
- collect handoffs.

### PRV-L1

In parallel where tool access allows:

- run PRV-01 read-only transport inventory;
- inspect existing Chrome/provider paths before installing anything;
- perform Harvest-First comparison of:
  - attachable CDP/dedicated-profile path;
  - MV3 `chrome.debugger`;
  - extension/native-messaging candidates;
  - existing VIVIM/BCP transport evidence.

Do not submit prompts.

Do not change login/account state.

Do not install/configure a new extension merely to satisfy the task if existing evidence has not been assayed.

Deliver a transport/account-evidence experiment plan.

If Codex cannot safely do PRV concurrently with launch coordination, queue PRV-L1 for the first available suitable worker.

## 4. Claude Code — TRU independent review

Default first role:

### TRU-L1

Independently read:

- semantic design docs;
- current source seams;
- release proof matrix;
- the five Lock definitions.

Prepare adversarial falsifiers for:

- Provider/Account/Model collapse;
- semantic ID tied to risk/policy;
- fixture state presented as live;
- unresolved required field marked ready;
- prior/default silently overriding explicit target;
- quoted payload altering route;
- visual interaction creating UI-only meaning;
- late revision overwrite;
- Wiki unsupported claim;
- Reflection record not traceable to source.

As first-wave outputs arrive, review them independently.

Claude Code is not permanently assigned to TRU. This is a diversity choice for the launch wave.

## 5. RTE queue — start when a suitable lane frees

RTE-L1 contains independent research/spike work and should take the first healthy lane released from initial deliverables.

Tasks:

1. GOV-06 web-surface trust-boundary assay.
2. SHL-01 Windows shell-framework harvest.
3. REL-02 packaging/runtime spike plan.
4. Consequence→current-law risk mapping analysis.

Do not wire native shell to unstable VisualSpec yet.

## 6. Required first response from every team head

Every workstream head starts with a compact durable status:

```
WORKSTREAM:
OBJECTIVE:
SOURCE HEAD:
CURRENT REALITY:
TODO:
DEPENDENCIES:
WRITE SET:
PROOF PLAN:
BLOCKERS:
FIRST ACTION:
```

Then execute.

Do not respond only with a proposed plan if a bounded task can already be performed.

## 7. Write-set isolation for the first wave

The exact implementation paths may change after assay.

Initial intent:

### SDW

Primary edits, if implementation begins:

- new MVP semantic/fixture module;
- REG-focused files;
- tests adjacent to that module.

Avoid LNC/VFX source files.

### LNC

- `plugins/vivim-nlcl-pure/`;
- `plugins/vivim-nlcl/`;
- command-specific new module/tests.

Avoid central manifest contracts until Lock A coordination.

### VFX

Prefer a new sandbox/visual package or development surface.

Avoid modifying NLCL parser logic.

### SKW

First task read-only.

If artifacts are generated, place them in a dedicated experimental/tooling path rather than modifying product manifests.

### EXP

Dedicated Lab/scenario/test tooling.

Do not rewrite product code in the baseline-metrics task.

### PRV

Provider Lab/research artifacts only until transport decision.

### TRU

Tests/evidence/review files only unless separately assigned a repair.

## 8. Fan-in checkpoint

Do not wait for all teams to “finish.”

Fan-in when the first versions of Locks A–D and EXP baseline exist.

The integration review asks:

1. Do semantic IDs line up?
2. Can UseCommand reference them without provider-specific hacks?
3. Can VisualSpec render them without raw-language parsing?
4. Can Reflection resolve the same handles?
5. Can EXP replay/diff the combined state?
6. What contradictions exist?
7. Which contradiction is best resolved by a small experiment?

Produce one integrated MVP fixture flow.

## 9. First integrated scenario

Use:

> Ask Claude Work using Model B: explain this error

in a World with:

- ChatGPT Personal;
- Claude Work;
- Claude Personal;
- Gemini Personal;
- fixture Models;
- one incompatible Account/Model case.

The integrated flow must show:

```
input revisions
→ recognized command
→ Provider
→ Account
→ Model
→ prompt payload
→ validation
→ consequence
→ VisualSpec
→ contextual Wiki topics
→ SIMULATED prompt.send envelope
```

Then run:

> Ask Claude: explain this error

and preserve the two-Account ambiguity.

## 10. Merge/review policy

A first-wave patch is mergeable when:

- task acceptance is met;
- deterministic targeted tests are green;
- relevant consumers are searched;
- handoff is written;
- TRU or another independent reviewer has challenged material semantic changes;
- no fixture/live claim is blurred.

Do not wait for full broad historical suites that are already blocked by known missing inputs unless the touched code affects those blockers.

Preserve known broad-suite failures honestly.

## 11. Automatic next-task routing

When a first-wave worker completes:

### SDW completes Lock A

Trigger:

- LNC integration;
- VFX handle alignment;
- SKW node-ID alignment;
- EXP Lock-A tests.

### LNC completes Lock B

Trigger:

- VFX projector implementation;
- EXP false-ready/wrong-target suite;
- RTE command-boundary design.

### VFX completes Lock C

Trigger:

- EXP visual variants;
- SKW Wiki-handle integration;
- owner-facing sandbox review.

### SKW completes Lock D

Trigger:

- contextual Wiki;
- REF completeness tests;
- EXP Wiki falsifier.

### PRV completes Lock E

Trigger:

- SDW durable Account binding;
- REG availability design;
- RTE live command envelope;
- TRU live-proof review.

## 12. Stop conditions

Stop and escalate to owner only for:

- provider/legal/ToS issue that materially constrains browser automation;
- credential/auth configuration change;
- destructive external action;
- material privacy capture tradeoff;
- product-authority choice that cannot be resolved by reversible experiments.

Ordinary architecture choices should be resolved through evidence and falsifiers.

## 13. What not to launch yet

Do not reserve a lane permanently for an Elephant.

Do not build a dashboard.

Do not build full self-healing.

Do not build all OS capabilities.

Do not implement real fan-out prompting.

Do not build Canvas.

Do not build full Forge.

Those are not required to prove the first semantic product loop.
