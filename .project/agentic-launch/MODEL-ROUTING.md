# Frontier Model Routing — OpenAI + Anthropic

> **Routing status:** heuristic and revisable. Harness ≠ router ≠ model ≠ account, and no model family permanently owns a workstream. Route from current availability, measured task fit, cost/capacity and independent-review value.

Status: **CURRENT EXTERNAL RESEARCH / LOCAL-TEAM ROUTING POLICY**  
Research date: 2026-10-05

Purpose: allocate scarce ChatGPT Plus / Claude Pro frontier-model usage to the local VOMEGA agentic team where it has the highest marginal value.

This document is development routing policy, not Ω product architecture.

### What here is researched, and what is measured

Everything in this document is desk research about model positioning and subscription limits as of 2026-10-05, plus heuristics derived from it. The project has **no measured evidence** yet that any model or harness is better at any VOMEGA task class: the only routed work so far ran through ZCode on `openrouter/auto`, where the underlying model is hidden. The per-workstream and per-Lock tables in §5 and §6 are therefore starting suggestions for a first comparison. They assign nothing. Replace them with measured results as soon as section 9 has data.

## 1. Current model reality

The lineup below was checked against current official OpenAI and Anthropic material on 2026-10-05.

### OpenAI — practical top five for this project

| Rank / role | Model | Current positioning | VOMEGA use |
| --- | --- | --- | --- |
| O1 | **GPT-6 Astra** | OpenAI's highest-capability model for demanding reasoning, coding, computer use, browsing and professional work; ~1.05M context | scarce architectural adjudication, hardest cross-domain review, difficult browser/computer-use reasoning |
| O2 | **GPT-6.1 Sol** | near-Astra performance for complex coding/computer use/professional work at materially lower usage/cost | primary premium OpenAI workhorse |
| O3 | **GPT-6 Luna** | GPT-6 high-volume/efficient model, ~1.05M context | high-volume bounded analysis, transformations, test generation, classification |
| O4 | **GPT-5.6 Sol** | previous flagship professional-work model; strong coding/reasoning, ~1.05M context | fallback serious work / second opinion where 6.1 Sol unavailable |
| O5 | **GPT-5.6 Terra** | balanced intelligence/cost, ~1.05M context | routine bounded engineering/research when available |

GPT-6 Sol (Sep 22) remains a current-family model but GPT-6.1 Sol (Sep 29) is the direct practical successor for the complex-work role, so it is treated as a fallback rather than consuming a separate primary routing slot.

Official sources:
- https://openai.com/index/gpt-6-astra/
- https://developers.openai.com/api/docs/models
- https://developers.openai.com/api/docs/models/gpt-6.1-sol
- https://developers.openai.com/api/docs/models/gpt-5.6-sol
- https://developers.openai.com/api/docs/models/gpt-5.6-terra
- https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex

### Anthropic — practical top five for this project

| Rank / role | Model | Current positioning | VOMEGA use |
| --- | --- | --- | --- |
| A1 | **Claude Fable 5.1** | Anthropic's most capable generally available coding/knowledge-work model; 1M context | rare frontier architecture/review/adjudication |
| A2 | **Claude Opus 5.5** | Anthropic's new leading Opus; stated to perform at Fable 5.1 level on most work; 1M context | primary premium Anthropic planner/reviewer/complex implementer |
| A3 | **Claude Sonnet 5.5** | faster/lower-cost complement to Opus 5.5; strong scoped coding, bug fixing and design; 1M context | default Claude implementation/UI workhorse |
| A4 | **Claude Opus 5** | previous frontier daily model; 1M context | fallback deep work / independent review |
| A5 | **Claude Sonnet 5** | prior workhorse generation; 1M context | fallback bounded coding/research |

Fable 5 remains accessible but is superseded for practical frontier routing by Fable 5.1. Mythos 5.1 is excluded because it is not generally available; it belongs to trusted-access programs.

Official sources:
- https://www.anthropic.com/claude-fable-and-mythos-5-1
- https://www.anthropic.com/claude-opus-5-5
- https://www.anthropic.com/claude-sonnet-5-5
- https://support.claude.com/en/articles/11940350-claude-code-model-configuration
- https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans
- https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan

## 2. Important subscription reality

### ChatGPT Plus

OpenAI currently says Plus includes Astra in Work/Codex but with limited allowance.

Current estimated local-message ranges per five-hour window:

- GPT-6 Astra: **5–45**
- GPT-6.1 Sol: **15–160**
- GPT-6 Sol: **15–150**
- GPT-6 Luna: **350–3,000**

These are estimates, not guaranteed counts, and weekly allowance may also apply.

Therefore:

> Astra is too scarce to be a general implementation worker on Plus.

### Claude Pro

Anthropic currently says Fable 5 and Fable 5.1 are accessible on Pro but **not included in the ordinary Pro subscription usage limit**; on Pro they use pay-as-you-go usage credits.

Therefore:

> Treat Fable as an exceptional escalation even if the owner has enabled access.

Opus 5.5 and Sonnet 5.5 are the practical Claude Pro working pair.

Anthropic's own Claude Code guidance recommends a useful pattern:

> plan with Opus, execute with Sonnet.

VOMEGA should generalize that principle rather than hard-code the exact models forever.

## 3. Routing tiers

### Tier F — Frontier / scarce judge

Models:
- GPT-6 Astra
- Claude Fable 5.1

Use only when at least one is true:

1. a load-bearing semantic/core contract is about to be adopted;
2. two capable teams/models disagree on architecture;
3. a hard defect survived two serious lower-tier attempts;
4. a cross-workstream change has large hidden-impact risk;
5. live Provider/Account/security evidence is ambiguous;
6. a release/milestone claim deserves frontier adversarial review;
7. a large whole-repo synthesis genuinely benefits from frontier reasoning;
8. the owner asks for a frontier pass.

Default: **do not implement routine code with Tier F.**

Preferred output:
- decision memo;
- adversarial review;
- architecture correction;
- minimal discriminating experiment;
- patch review;
- root-cause diagnosis.

### Tier P — Premium workhorse

Models:
- GPT-6.1 Sol
- Claude Opus 5.5

Use for:
- serious architecture;
- multi-file implementation;
- complex refactors;
- contract design;
- repo-scale analysis;
- difficult debugging;
- integration;
- independent review.

These should carry most premium-model work.

### Tier W — Fast strong worker

Models:
- Claude Sonnet 5.5
- GPT-6 Luna
- GPT-5.6 Sol
- GPT-5.6 Terra
- older Opus/Sonnet fallbacks

Use for:
- bounded implementation;
- UI work;
- tests;
- corpus expansion;
- extraction;
- routine research;
- repetitive transformations;
- documentation;
- scenario generation;
- first-pass review.

The measured bulk parallel pool is ZCode on `openrouter/auto` (≥6 bounded workers on 2026-10-05). Earlier text named "the five ZCode / Space Bunny lanes" here; those accounts are historical configuration that was never individually probed. Where "Space Bunny" appears below as a routing option, read it as "whatever abundant bulk route is currently measured".

## 4. Cross-provider diversity rule

For load-bearing decisions, diversity is more valuable than asking the same provider twice.

Preferred pattern:

```
primary proposal:        GPT-6.1 Sol OR Opus 5.5
independent challenge:   the other provider
deterministic evidence:  tests / corpus / runtime
frontier adjudication:   Astra OR Fable only if disagreement remains
```

Do not routinely spend both Astra and Fable on the same question.

Use both only for:
- constitutional/core-boundary decisions;
- very high-cost irreversible architecture choices;
- final release-critical adversarial review.

## 5. Workstream routing — starting heuristics, not assignments

### SDW — Semantic Data & World

Primary:
1. **Opus 5.5** — conceptual object/relationship design and long-context consistency.
2. **GPT-6.1 Sol** — TypeScript contracts, implementation and cross-code impact.

Routine:
- Space Bunny lanes / Sonnet 5.5 for fixtures/tests.

Frontier escalation:
- **Fable 5.1** for ontology/semantic-boundary review.
- **Astra** for final cross-system contract challenge if unresolved.

Use frontier on **Lock A once**, not every iteration.

### LNC — Language & Command Compiler

Primary:
1. **GPT-6.1 Sol** — deterministic compiler/parser/validator implementation.
2. **Opus 5.5** — ambiguity semantics, grammar review and adversarial language reasoning.

Routine:
- Sonnet 5.5 / Space Bunny / Luna for corpus generation, counterexamples and test implementation.

Frontier escalation:
- **Fable 5.1** for hard natural-language/semantic ambiguity cases.
- **Astra** for compiler architecture or difficult coding failure.

Lock B should receive one cross-provider premium review before adoption.

### VFX — Visual Feedback & Sandbox

Primary:
1. **Sonnet 5.5** — frontend/design implementation; Anthropic explicitly highlights its design strength.
2. **GPT-6.1 Sol** — semantic UI contracts, state architecture and complex code.

Routine:
- Space Bunny / Luna for variant implementation and regression work.

Frontier escalation:
- **Astra** for multimodal/computer-use critique of the actual interactive sandbox.
- **Fable 5.1** only for a difficult cross-system UX/semantics conflict.

Do not spend Fable on CSS or normal React work.

### SKW — Self-Knowledge & Wiki

Primary:
1. **Opus 5.5** — Reflection architecture, source/claim distinctions, large-repo synthesis.
2. **GPT-6.1 Sol** — AST/extractor implementation and codebase migration.

Routine:
- Sonnet 5.5 / Space Bunny / Luna for extraction coverage and tests.

Frontier escalation:
- **Fable 5.1** for Reflection/core-boundary audit.
- Astra only if the migration crosses complex code/tooling and a second frontier view is justified.

### EXP — Semantic Lab & Experiments

Primary:
- **GPT-6 Luna / Sonnet 5.5 / Space Bunny lanes**.

Why:
This stream is high-volume and machine-refereed.

Use premium:
- GPT-6.1 Sol / Opus 5.5 to design metrics/evaluators.

Frontier:
- normally **none**.

Astra/Fable may review an experiment conclusion only when it would promote a load-bearing architecture change.

### PRV — Provider Reality Lab

Primary:
1. **GPT-6.1 Sol** — browser/automation implementation and tool-heavy work.
2. **Sonnet 5.5 / Opus 5.5** — provider-specific analysis and code.

Special frontier:
- **Astra** is the preferred scarce escalation for the hardest browser/computer-use task because OpenAI specifically positions it at the frontier for computer/browser use.
- **Fable 5.1** is useful for deep evidence reasoning, Account-identity contradictions and provider architecture review.

Do not burn Astra merely observing DOM or writing selectors.

### RTE — Runtime, Authority & Release

Primary:
1. **GPT-6.1 Sol** — runtime/security-sensitive code and Windows integration.
2. **Opus 5.5** — authority/execution/evidence design and complex review.

Routine:
- Sonnet 5.5 / Space Bunny for packaging scripts/tests.

Frontier:
- **Fable 5.1 or Astra** for one final review of major authority/core changes.
- Prefer cross-provider reviewer different from implementer.

### DEV — Development System & Integration

Primary:
- Space Bunny lanes / GPT-6 Luna / Sonnet 5.5.

Premium:
- GPT-6.1 Sol or Opus 5.5 only for orchestration bugs or difficult merge/impact analysis.

Frontier:
- **none by default**.

Do not spend scarce intelligence generating SITREPs, moving tasks or maintaining Commons.

### TRU — Truth & Independent Verification

Primary:
1. **Opus 5.5**
2. **GPT-6.1 Sol**

Use cross-provider review deliberately.

Frontier:
- **Fable 5.1 / Astra are most valuable here**, selectively:
  - final challenge to Lock A/B/C/D/E;
  - release-critical review;
  - unresolved architecture disagreement;
  - false proof / evidence-semantics risks.

The project should get more value from one frontier review of a mature artifact than five frontier attempts to create it.

## 6. Interface-lock model allocation — suggestions for a first review pairing

| Lock | Builder | Independent premium reviewer | Frontier escalation |
| --- | --- | --- | --- |
| A — semantic IDs | Opus 5.5 / GPT-6.1 Sol | opposite provider | Fable 5.1 preferred |
| B — UseCommand | GPT-6.1 Sol | Opus 5.5 | Astra or Fable if semantic dispute remains |
| C — VisualSpec | Sonnet 5.5 + GPT-6.1 Sol | Opus 5.5 | Astra for live UI critique |
| D — Reflection Graph | Opus 5.5 + GPT-6.1 Sol | opposite provider | Fable 5.1 |
| E — Account evidence | GPT-6.1 Sol + provider tools | Opus 5.5 | Astra for browser complexity; Fable for epistemic review |

## 7. Scarce-use budget heuristic

Do not treat this as a fixed quota; actual account usage state wins.

For each weekly development cycle, think in percentages of **frontier allowance**:

### Astra

- 30% — PRV browser/computer-use hard cases
- 25% — LNC/RTE hard coding and root-cause escalation
- 20% — integrated sandbox/product critique
- 15% — TRU release/contract review
- 10% — reserve for unexpected blocker

### Fable 5.1

Because Pro currently requires usage credits, default even more aggressively toward scarcity:

- 30% — semantic/core architecture adjudication (SDW/SKW)
- 25% — TRU adversarial review
- 20% — LNC ambiguity/semantic-hard-case review
- 15% — difficult whole-repo impact synthesis
- 10% — reserve

If Fable usage credits are not intended to incur spend, set the effective Fable budget to **zero** and route its planned work to Opus 5.5.

## 8. Escalation protocol

A worker requests frontier escalation with:

```
TASK:
CURRENT MODEL:
ATTEMPTS:
WHAT FAILED / REMAINS UNCERTAIN:
FILES / ARTIFACT:
EXACT QUESTION FOR FRONTIER MODEL:
EXPECTED DECISION VALUE:
```

Reject escalation when the real problem is:

- missing files/context;
- failing environment/tool;
- unrun tests;
- unclear owner requirement already answered in docs;
- mechanical implementation;
- routine review.

Higher intelligence cannot compensate for missing evidence.

## 9. Model-result evidence

Record, for meaningful routed tasks:

- task class;
- model;
- effort level when visible;
- artifact produced;
- deterministic review result;
- correction rounds;
- whether escalation changed the decision;
- human intervention.

After enough episodes, DEV should replace this hand-designed router with measured routing recommendations.

## 10. Initial launch revision (historical reasoning, 2026-10-05)

The topology below was written before the first wave. The wave actually ran as six bounded ZCode workers on `openrouter/auto` plus one independent review. Neither sketch is a standing organization.

The first-wave launch should therefore evolve from:

```
five ZCode lanes = five workstreams
Codex = coordinator
Claude Code = reviewer
```

to:

```
bulk parallelism:
  5× Space Bunny lanes

premium OpenAI:
  GPT-6.1 Sol = serious coding / integration
  Astra = scarce escalation / browser / adjudication

premium Anthropic:
  Sonnet 5.5 = scoped implementation / UI
  Opus 5.5 = planning / architecture / review
  Fable 5.1 = rare frontier adjudication

truth:
  cross-provider review + deterministic evidence
```

The tool/harness should choose tasks by model capability and remaining allowance rather than assigning one permanent model to one department.

## 11. Strategic rule

> **Use frontier intelligence to improve decisions and unblock hard failures; use abundant intelligence to perform the work.**

The scarce model should usually see a mature proposal, conflict, failing patch, or integrated artifact—not an empty task.

## 12. Change record

- **2026-10-05:** Current OpenAI/Anthropic model research incorporated into local agentic launch routing.


# xAI / SuperGrok / Grok Build integration — 2026-10-05

## Current SuperGrok plan reality

Official xAI pricing currently exposes these individual tiers:

- **Free**
- **SuperGrok Lite**
- **SuperGrok — $30/month**
- **SuperGrok Plus — $100/month**
- **SuperGrok Heavy**

The public pricing page currently publishes the numeric monthly price for SuperGrok and SuperGrok Plus. Lite and Heavy exist in the plan comparison, but their current numeric prices are not exposed in the server-rendered pricing material used for this research; use the signed-in Grok billing page as the account-specific price authority.

SuperGrok currently includes higher limits and frontier-model access. SuperGrok Plus adds materially higher usage across Chat / Imagine / Voice / Build, faster replies, peak-time priority, early features and 1080p video. Heavy is positioned as the highest-usage / fastest individual tier for the hardest work.

Important: xAI's public pricing page still names Grok 4.6 in the plan summary, while current Grok docs and Grok Build identify **Grok 4.7** as the newest/current model. Treat the live signed-in model picker / `grok inspect` as runtime truth.

## Weekly usage economics

Paid SuperGrok now uses a **shared weekly usage allowance** rather than independent daily quotas for Chat, Build, Voice, Imagine, etc.

Implications for development:

- long Grok Build coding sessions consume from the same weekly pool;
- large workflow fan-outs can consume substantial pool capacity;
- the current account UI exposes remaining usage as a percentage and breakdown by product;
- once included weekly usage is exhausted, paid features pause until reset unless Extra Usage Credits are used or the plan is upgraded;
- Extra Usage Credits are a spillover mechanism, not the default team budget.

Therefore do not treat Grok Build subagent count as free parallelism.

## Grok model/harness distinction

Keep separate:

### Grok 4.7 — model resource

Current xAI flagship for coding and knowledge work.

Best VOMEGA uses:

- premium implementation;
- long-running difficult coding;
- repository-scale analysis;
- independent third-provider architecture review;
- provider/browser implementation;
- integrated agentic tasks.

Routing tier:

**Tier P+ — premium/frontier-quality workhorse**

It sits alongside GPT-6.1 Sol and Claude Opus 5.5 for serious work.

Do not assume it has the same scarcity as Astra/Fable until observed SuperGrok usage economics are measured.

### Grok Build — execution harness

Grok Build is now a first-class local development participant alongside:

- ZCode;
- Codex;
- Claude Code;
- deterministic local tools.

Current useful capabilities include:

- interactive TUI;
- headless `grok -p` with JSON / streaming JSON;
- ACP via `grok agent stdio`;
- Plan mode;
- `/goal` long-running autonomous execution;
- sessions/resume/fork;
- Git worktrees;
- subagents;
- workflows;
- Agent Dashboard;
- skills;
- plugins;
- hooks;
- MCP;
- AGENTS.md support;
- Claude Code configuration/ecosystem compatibility;
- project/global memory;
- custom model support.

Grok Build is an execution substrate. Its memory, dashboard, workflow state and notes are not repository truth.

## Grok Build workflow caution

Grok Build workflows can fan out large jobs to many clean-context agents.

This is strategically attractive for:

- EXP corpus/mutation work;
- TRU adversarial review;
- repo-wide Reflection audit;
- Harvest-First research;
- large PR/codebase review;
- test/falsifier generation.

But workflow fan-out consumes SuperGrok usage.

Initial VOMEGA policy:

1. begin with **small explicit agent budgets**;
2. measure weekly-pool cost;
3. compare useful findings / merged work per unit of usage;
4. expand only when measured leverage justifies it;
5. never launch a 128/1024-agent workflow merely because the harness supports it.

## Updated model tiers

### Tier F — scarce frontier adjudicators

- GPT-6 Astra
- Claude Fable 5.1

### Tier P+ — premium/frontier-quality workhorses

- GPT-6.1 Sol
- Claude Opus 5.5
- **Grok 4.7**

### Tier W — strong/high-volume workers

- Claude Sonnet 5.5
- GPT-6 Luna
- GPT-5.6 Sol
- GPT-5.6 Terra
- Space Bunny Free lanes
- Grok Build's faster coding model/options when selected for throughput rather than frontier reasoning

Grok 4.7 adds valuable **third-provider diversity**.

For load-bearing decisions, a strong pattern is now:

```
primary implementation:
  GPT-6.1 Sol / Opus 5.5 / Grok 4.7

independent review:
  choose a different provider

deterministic evidence:
  tests / corpus / runtime

scarce frontier adjudication:
  Astra / Fable only if material uncertainty remains
```

## Updated workstream routing with Grok

### SDW

Grok 4.7:
- independent third-provider review of semantic contracts;
- implementation when Opus/GPT output needs a fresh architecture perspective.

Do not spend a Grok workflow on routine fixture creation.

### LNC

Grok 4.7:
- alternate compiler implementation/review;
- difficult multi-file language-system coding;
- counterexample/root-cause analysis.

Grok workflows:
- corpus clustering/mutation only with bounded agent budgets.

### VFX

Grok 4.7:
- full-stack sandbox implementation;
- interactive/visual coding alternative to Sonnet 5.5;
- independent implementation comparison.

Grok Build itself is useful for running a long-lived sandbox implementation goal in an isolated worktree.

### SKW

Grok 4.7:
- AST/reflection extractor implementation;
- repo-scale cross-check against GPT/Claude proposals.

Grok workflows:
- particularly promising for parallel plugin-by-plugin Reflection audits.

### EXP

This is the best first test of Grok Build workflows.

Candidate first experiment:

```
one bounded workflow
→ fan out semantic corpus review across a small number of agents
→ independent verify phase
→ one structured report
```

Start with a small agent budget, measure usage and compare against the currently measured bulk ZCode route.

### PRV

Grok 4.7:
- strong candidate for provider/browser coding and long-running implementation;
- useful third-provider reviewer for Account identity and realization boundaries.

Do not use a large workflow against one shared browser profile.

### RTE

Grok 4.7:
- complex implementation / packaging / integration;
- independent review of GPT/Claude runtime patches.

### DEV

Grok Build itself is especially relevant here.

Potential uses:

- `grok dashboard` as a local session visibility surface;
- headless JSON runs as dispatchable workers;
- worktree sessions;
- ACP integration;
- workflow fan-out/fan-in.

Do not immediately replace ZCode as coordinator. Run a measured **ZCode vs Grok Build orchestration experiment** on real first-wave work.

### TRU

Grok 4.7 provides useful third-provider independence.

Grok workflows are promising for:
- multi-specialist code review;
- verify-each-finding patterns;
- repository-wide architecture falsifier scans.

Again, use bounded budgets.

## Grok Build onboarding experiment

When installation completes, DEV should run read-only preflight:

```
grok version
grok inspect
```

Then determine:

- authenticated plan/tier if safely observable;
- available models in `/model`;
- whether Grok 4.7 is selectable;
- remaining weekly-usage visibility;
- current Grok Build version;
- project instructions detected;
- skills/plugins/hooks/MCPs detected;
- worktree behavior;
- headless mode;
- ACP availability;
- workflow availability;
- memory state.

Do not run `grok setup`, alter `~/.grok/config.toml`, or import/change global plugins automatically merely to make VOMEGA work.

The owner's existing configuration remains read-only infrastructure until explicitly changed.

## First comparative benchmark

Use the same bounded task on:

- one bulk ZCode worker on the currently measured route;
- GPT-6.1 Sol/Codex;
- Claude Opus/Sonnet via Claude Code as appropriate;
- Grok 4.7 via Grok Build.

Good benchmark task:

> Review Lock B / the candidate UseCommand contract against the current NLCL source and identify semantic defects, missing consumers and the smallest required tests. Do not edit code.

Measure:

- useful defects found;
- false findings;
- relevant files found;
- architectural-context errors;
- time / usage;
- amount of correction needed.

This gives DEV evidence for future routing instead of treating Grok 4.7 as automatically superior or inferior.


# OpenRouter Auto in ZCode — runtime routing note

The owner currently reports ZCode is using **OpenRouter Auto** (`openrouter/auto`).

OpenRouter documents Auto as a task-aware model router. Its current selection uses aggregate recent market/spend behavior and can change as models and usage patterns change. It can therefore select different underlying models for different tasks even though the ZCode-facing model name remains `openrouter/auto`.

Official reference:
- https://openrouter.ai/openrouter/auto/api
- https://openrouter.ai/blog/announcements/introducing-the-new-auto-router/

## Consequence for VOMEGA development evidence

Do not treat:

```
harness = ZCode
configured model = openrouter/auto
```

as sufficient model-attribution evidence.

Where the runtime/API exposes the selected underlying model, record:

```
harness
router
actual routed model
task class
source HEAD
result/review
```

If the selected model is not exposed, record it as **router-selected / unknown concrete model** rather than guessing.

This matters for the dynamic-worker-routing experiment: otherwise the project could mistakenly credit or blame ZCode/OpenRouter Auto as one model when it is actually a moving ensemble.

## Role of OpenRouter Auto

OpenRouter Auto is useful for:

- bulk/bounded ZCode work;
- tasks where dynamic cost/quality routing is acceptable;
- empirical comparison against fixed premium models;
- reducing manual model selection.

It should not automatically replace explicit fixed-model selection when the experiment requires:

- reproducibility;
- independent cross-provider review;
- a named frontier adjudicator;
- exact model capability attribution;
- controlled A/B comparison.

For a load-bearing contract review, DEV/TRU may deliberately request a fixed named model through an already-approved route if available. Do not alter owner provider configuration solely to satisfy this preference.

## Scheduling implication

The launch scheduler should classify **worker capacity** independently from **model identity**.

For example:

```
worker:
  harness = ZCode
  route = openrouter/auto
  actualModel = observed-per-run-or-unknown

task:
  workstream = EXP
  requiredTier = W
  reproducibility = low

→ suitable
```

versus:

```
task:
  workstream = TRU
  purpose = independent Lock A adjudication
  requiredModel = Claude Fable 5.1
  reproducibility = high

→ use explicit frontier route, not Auto
```

## Cost-tier note

OpenRouter Auto supports a cost-tier control. The owner/runtime's existing setting should be treated as read-only configuration during launch preflight.

Do not silently raise cost tier in order to get a stronger model.

Any future cost-tier policy belongs in DEV routing policy and requires explicit owner budget intent.
