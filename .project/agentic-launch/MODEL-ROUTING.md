# Frontier Model Routing — OpenAI + Anthropic

Status: **CURRENT EXTERNAL RESEARCH / LOCAL-TEAM ROUTING POLICY**  
Research date: 2026-10-05

Purpose: allocate scarce ChatGPT Plus / Claude Pro frontier-model usage to the local VOMEGA agentic team where it has the highest marginal value.

This document is development routing policy, not Ω product architecture.

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

The five ZCode / Space Bunny lanes remain the project's **bulk parallel pool** where they perform adequately.

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

## 5. Workstream routing

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

## 6. Interface-lock model allocation

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

## 10. Initial launch revision

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
