# MVP Visualization Sandbox — Full Semantic Simulation of the Floating Command Box

Status: **OWNER-DIRECTED DESIGN / ROADMAP SEED**  
Started: 2026-10-05

## 1. Goal

Build a development-only visualization sandbox that lets the team see, refine and falsify the exact intended first VOMEGA product interaction before wiring real provider execution.

The sandbox should behave like a **simulated full Ω semantic runtime** for the narrow MVP slice:

> **floating Windows text box → natural-language configuration and command input → deterministic interpretation → Provider / Account / Model routing → explicit visual feedback → contextual Wiki → validated `prompt.send` command → simulated pre-execution boundary**

It is not a decorative mockup.

It should exercise the same conceptual contracts intended for the product so visual experiments can test real semantic distinctions rather than fake UI state.

## 2. What the sandbox is for

The sandbox should answer questions such as:

- What should the user see while typing?
- When should Provider, Account, Model and capability become visible?
- How should ambiguity be represented?
- What is the highest-value plausible **wrong** interpretation at this revision, and is it worth exposing now?
- How does the user correct a wrong target?
- What happens visually when a Provider has two Accounts?
- How do defaults appear without becoming invisible magic?
- How is a Model shown differently from an Account?
- How do typed correction and clicked correction converge?
- What is the smallest useful expanded view?
- How should “Why?” expose the contextual Wiki?
- How much semantic feedback is enough before the UI becomes noisy?
- Which visual treatment makes uncertainty easiest to understand?
- Can a new icon pack replace the current one without changing meaning?
- Can every visible action be expressed as a semantic edit or command?

The sandbox exists to generate evidence for those decisions.

## 3. Scope lock

### In scope

The sandbox simulates:

- ChatGPT as a Provider;
- Claude as a Provider;
- Gemini as a Provider;
- user registration of one or more Accounts for those Providers;
- user-defined Account labels;
- Provider/Account defaults;
- Provider-scoped Model choices from fixture data;
- Model selection/defaulting;
- capability `prompt.send`;
- natural-language setup commands;
- natural-language prompt routing commands;
- per-keystroke interpretation;
- ambiguity;
- missing information;
- unavailable combinations;
- correction;
- deterministic validation;
- visual projection;
- contextual Wiki;
- simulated command confirmation/submission boundary;
- replay and experiment capture.

### Out of scope

The sandbox does not need:

- real browser automation;
- provider login;
- real Account discovery;
- real provider model discovery;
- external prompt submission;
- response reading;
- conversation history;
- attachments;
- projects/workspaces;
- fan-out;
- autonomous agents;
- durable Work;
- installer;
- production authority;
- production credentials.

A fixture may simulate those states only where needed to test UI semantics.

## 4. The sandbox is not a UI-only prototype

The sandbox should contain a narrow semantic runtime beneath the UI.

Preferred flow:

```
Fixture / synthetic World
          ↓
Source-native semantic registry
          ↓
Language contributions
          ↓
InterpretationSession
          ↓
deterministic NCL/NLCL pipeline
          ↓
candidate UseCommand + candidate intent manifold
          ↓
validator / defaulting policy
          ↓
negative-intent frontier evaluator
          ↓
VisualSpec vNext
        ↙       ↘
 floating UI    contextual Wiki
        ↓
semantic edit / confirm
        ↓
recompile + revalidate
        ↓
SIMULATED prompt.send boundary
```

The renderer must not invent Provider/Account/Model meaning.

## 5. Existing Ω material to reuse

The current baseline already provides important pieces.

### Existing language contract

`omega-baseline/plugins/vivim-nlcl-pure/src/types.ts` already defines:

- WorldModel;
- IR;
- IRSlot;
- token annotations;
- effects;
- suggestions;
- gaps;
- StageTrace;
- preliminary VisualSpec types.

### Existing projector

`project.ts` currently implements:

- token annotation;
- coarse effect projection.

It does **not** yet implement the richer VisualSpec declared in types.

### Existing web semantic service

`surfaces/web` already demonstrates:

- snapshot;
- interpretation;
- execute path;
- socket updates;
- authoritative server interpretation.

The sandbox should learn from this path but should not inherit its production execution behavior.

### Existing product design

`FIRST-PRODUCT-RELEASE-DESIGN.md` already fixes:

- floating Windows box;
- Provider/Account registration through the command system;
- ChatGPT / Claude / Gemini target set;
- `prompt.send`;
- live interpretation;
- contextual Wiki;
- UI/typed-command parity.

### Existing historical visual research

`harvests/old-vivim/symbolic/chat-SVG Symbolic Communication Design.txt` contains useful research candidates:

- inline semantic chips;
- ambiguity as an interactive handle;
- object binding;
- slot/socket representation;
- expandable command circuit;
- progressive disclosure;
- distinct confidence/proof representations;
- explicit risk/consequence markers.

The sandbox should test these ideas, not accept them as product law.

## 6. Fixture World

The initial sandbox should ship several named Worlds rather than one hard-coded state.

### World A — blank

No registered Accounts.

Providers are known semantic concepts but `prompt.send` is not available through an Account.

Useful for registration and orientation.

### World B — one account each

```
ChatGPT
  Personal

Claude
  Work

Gemini
  Personal
```

Useful for straightforward target resolution.

### World C — ambiguous Claude

```
ChatGPT
  Personal

Claude
  Work
  Personal

Gemini
  Personal
```

Useful for ambiguity.

### World D — models

Each Provider exposes a synthetic fixture Model catalog.

The actual names should be fixture labels, not claims about current provider offerings.

Example:

```
ChatGPT
  default
  model-a

Claude
  default
  model-b

Gemini
  default
  model-c
```

The fixture file should make it trivial to change these.

### World E — unavailable combination

A known Account exists but a selected Model is unavailable for that Account.

Useful for validation and repair UI.

### World F — stale relationship

Account exists but availability is stale/unknown.

Useful for visual distinction without real login logic.

## 7. Registration should use the same semantic system

The sandbox should not have a hidden settings form as its primary setup path.

Example expressions:

> add my Claude account

> add another Claude account and call it Work

> this is my personal ChatGPT

> rename this Claude account to Client Work

> make Claude Work my default Claude account

> use this model by default for Gemini

The sandbox may open a structured chooser when required.

That chooser performs explicit semantic edits.

It does not become a separate configuration architecture.

## 8. MVP semantic entities

The visible product should distinguish:

### Provider

External service identity.

Visual role example: provider emblem / semantic provider icon.

### Account

The user's relationship with that Provider.

Visual role example: Provider icon + user-owned label.

### Model

A Provider-scoped routing choice.

Visual role example: small model chip nested beneath or adjacent to Account.

### Capability

What Ω is being asked to do.

For MVP:

`prompt.send`

### Prompt payload

The literal content being sent.

The visual system should make the boundary between instruction and payload inspectable.

### Realization

The implementation route.

The sandbox may show it only in expanded/expert mode.

## 9. Defaulting policy

The sandbox should implement the intended deterministic policy:

```
explicit user choice
>
standing user default
>
single valid candidate
>
ask
```

Priors may rank choices.

They do not decide between materially valid ambiguous Accounts.

Model selection should follow the same principle.

Every automatic choice should be visually discoverable.

## 10. The visible shell

The sandbox should render the product as a compact floating Windows-style command surface.

This is a design simulation, not the final native shell framework.

### Compact state

Primary visible elements:

- text entry;
- semantic annotations on the text;
- concise compiled route/effect strip;
- one-line state;
- small affordance to expand explanation.

Conceptually:

```
┌─────────────────────────────────────────────────────────────┐
│ Ask Claude Work using Model B: explain this error          │
│ ─── ─────────── ─────────────   ─────────────────          │
│  /   [Claude][Work][Model B] → prompt.send                 │
│                         Ready · sends prompt externally  ›   │
└─────────────────────────────────────────────────────────────┘
```

This is illustrative.

### Expanded state

Adds:

- route breakdown;
- unresolved slots;
- candidate choices;
- consequence details;
- defaulting explanation;
- contextual Wiki;
- canonical symbolic form;
- optional source/expert detail.

Expanded UI must remain a projection of the same VisualSpec.

## 11. Text annotation language

Text annotation should carry semantic meaning without turning every word into a box.

Candidate rules:

### Solid underline

Phrase has a stable interpreted semantic role.

### Dashed underline / enclosure

Materially unresolved.

### Light bracket / region

Payload or scope boundary.

### Small inline identity marker

Provider / Account / Model recognized.

### Temporary focus outline

The semantic object currently being explained or corrected.

### Muted unclaimed text

Not currently semantically consumed.

The exact styling is experimental.

The semantic roles are not.

## 12. Semantic handles

Every meaningful visual object should have a stable semantic handle.

Candidate:

```ts
type SemanticHandle = {
  id: string
  kind:
    | "provider"
    | "account"
    | "model"
    | "capability"
    | "parameter"
    | "payload"
    | "consequence"
    | "validation"
    | "realization"
  label: string
  sourceRefs: string[]
}
```

The user can interact with the handle.

The renderer cannot silently invent a replacement ID.

## 13. VisualSpec vNext

The sandbox should be the proving environment for a replacement/extension of the current preliminary VisualSpec.

Candidate shape:

```ts
type VisualSpecVNext = {
  schemaVersion: string

  session: {
    id: string
    revision: number
    worldVersion: string
  }

  input: {
    text: string
    annotations: Annotation[]
  }

  interpretation: {
    status: string
    canonical: string | null
    reading: string | null
    confidence: number
    stageSummary: string[]
  }

  command: {
    capability?: Handle
    provider?: Handle
    account?: Handle
    model?: Handle
    parameters: VisualParameter[]
    payload?: VisualPayload
    realization?: Handle
  }

  validation: {
    state: string
    unresolved: Choice[]
    warnings: VisualNotice[]
  }

  consequences: ConsequenceProjection[]
  evidenceExpectation: EvidenceProjection[]

  wiki: {
    primary?: WikiTopicRef
    related: WikiTopicRef[]
  }

  interactions: SemanticInteraction[]
}
```

This is a sandbox hypothesis, not a frozen contract.

## 14. Visual consequence model

Do not display one generic red/green risk badge.

Visual projection should be able to distinguish:

- data leaves the machine;
- external Provider target;
- destructive local change;
- secret reveal;
- session-ending action;
- physical effect;
- authority/confirmation requirement;
- realization fidelity;
- evidence maturity.

For MVP `prompt.send`, the important consequence is:

> user prompt content will be transferred to Provider X through Account Y using Model Z if applicable.

The sandbox does not need to simulate actual consent law to test this explanation.

## 15. Icon architecture

Icons are replaceable presentation resources.

Semantic roles should look like:

```
entity.provider.chatgpt
entity.provider.claude
entity.provider.gemini
entity.account
entity.model
capability.prompt-send
consequence.external-transfer
state.needs-choice
state.ready
state.unavailable
help.why
```

A Visual Theme maps roles to:

- icon component;
- line style;
- typography;
- badge shape;
- optional animation.

Changing the icon library cannot change semantics.

At least two materially different icon treatments should be tested.

## 16. Provider / Account / Model visual grammar

### Provider

Strongest brand/identity-level visual.

### Account

Must remain visibly subordinate to Provider but individually identifiable.

User label is primary.

Examples:

```
Claude · Work
Claude · Personal
```

### Model

Should read as a route option, not a separate Provider identity.

Example compact sequence:

```
[Claude] [Work] [Model B]
```

Do not merge these into one opaque string in the underlying data.

## 17. Ambiguity interaction

Example:

> ask Claude to review this

World contains Claude Work and Claude Personal.

The visual system should show:

```
[Claude] [Account ?]
```

Expanding/clicking Account reveals:

```
Work
Personal
```

Selecting Work creates:

```
semantic edit:
route.account = account:claude-work
```

Then the command is recompiled.

The chooser does not directly set a hidden UI destination.

## 18. Model ambiguity

Example:

> ask Claude with Model B ...

If Model B exists under multiple fixture Accounts or is incompatible with selected Account, the UI should preserve the conflict.

Do not silently switch Accounts to satisfy a Model unless explicit routing policy allows it and the choice is shown.

## 19. Correction model

The user should be able to correct interpretation through either text or visual manipulation.

Examples:

### Text

> personal, not work

### Click

Select Personal Account chip.

Both should produce equivalent semantic edits.

The sandbox should compare resulting command digests.

## 20. Realtime revision law

Each text edit creates a monotonic revision:

```
rev 41: Ask C
rev 42: Ask Cl
rev 43: Ask Claude
rev 44: Ask Claude Work
```

A result computed for rev 42 may never overwrite rev 44.

The UI should visually minimize flicker when semantic identity remains stable across revisions.

This should be tested automatically.

## 21. Per-keystroke walkthrough

Input:

> Ask Claude Work using Model B: explain this error

Possible evolution:

### “Ask”

Recognize a command family candidate.

No Provider yet.

Wiki: “What can I ask?”

### “Ask Claude”

Provider recognized.

Two Accounts exist.

State: needs choice.

Visual:

```
[Claude] [Account ?]
```

Wiki primary: “Which Claude Account?”

### “Ask Claude Work”

Account grounded.

If one compatible Model default exists, it is selected but visibly marked as defaulted.

### “Ask Claude Work using Model”

Model slot recognized but unresolved.

### “Ask Claude Work using Model B”

Model grounded.

Command route is complete.

### Payload appears

Text after the command/address boundary becomes prompt payload.

### Ready

Projection shows:

```
prompt.send
Provider: Claude
Account: Work
Model: Model B
Payload: "explain this error"
Consequence: sends prompt externally
State: READY
```

No external send occurs in the sandbox.

## 22. Contextual Wiki

The Wiki is not a separate panel full of generic documentation.

It is a ranked projection from active semantic handles.

For the example above, candidate topics:

1. Claude Work Account
2. Model B
3. prompt.send
4. Provider vs Account
5. Why this target was selected
6. External transfer
7. How defaults work

When the user clicks Account, Account becomes the primary context.

When ambiguity appears, “Why Ω needs a choice” should outrank generic Provider information.

## 23. Wiki depth modes

The sandbox should test progressive explanation depth.

### Glance

One sentence.

### Explain

Structured facts and relevant relationships.

### Inspect

Source/evidence/Reflection details.

The user should not need expert mode to understand ordinary choices.

## 24. Self-knowledge source in the sandbox

The sandbox should construct its Wiki from:

- semantic fixture declarations;
- capability schema;
- language frames;
- current synthetic World;
- validation;
- Reflection source anchors;
- consequence semantics.

It should not load hand-authored Wiki pages.

A small amount of source-native explanatory text is acceptable inside declarations.

## 25. Semantic UI interactions

Every clickable semantic UI action should be expressible as one of:

- set semantic field;
- clear semantic field;
- choose candidate;
- request explanation;
- request expansion;
- submit semantic command;
- cancel semantic command.

Pure presentation gestures such as move/resize are outside command semantics.

## 26. Sandbox state inspector

The development UI should include an optional inspector outside the simulated product shell.

It can display:

- World fixture;
- current input revision;
- tokens;
- recognizers;
- frame;
- grounding candidates;
- candidate command;
- validation;
- VisualSpec;
- Wiki topic ranking;
- semantic edits;
- experiment ID.

This inspector is for developers.

It is not the MVP product surface.

## 27. Time travel

The sandbox should record each revision and semantic state.

Developers should be able to scrub through:

```
input revision
→ interpretation
→ validation
→ visual projection
→ selected Wiki context
```

This makes visual regressions diagnosable.

## 28. Scenario library

Minimum scenario families:

- blank-world orientation;
- register first ChatGPT Account;
- register first Claude Account;
- register second Claude Account;
- label/rename Account;
- set default Account;
- select explicit Provider;
- select explicit Account;
- select explicit Model;
- implicit single Account;
- ambiguous Account;
- ambiguous Model;
- invalid Provider/Model combination;
- change target mid-sentence;
- “personal, not work” correction;
- quoted prompt payload;
- provider name inside payload;
- model name inside payload;
- unknown Provider;
- unknown capability;
- stale Account;
- visual-click vs typed-equivalent parity;
- late revision suppression;
- contextual Wiki relevance;
- icon-pack replacement.

## 29. Product simulation boundary

The final action in the sandbox is:

```
SIMULATED prompt.send
```

It should display the fully compiled command and what would happen.

Example:

```
Capability  prompt.send
Provider    Claude
Account     Work
Model       Model B
Prompt      explain this error
Realization simulated-provider
Effect      external user-content transfer
Status      WOULD SUBMIT
```

The simulation must clearly label itself.

No real network/provider call should be made.

## 30. Experiment hooks

Every scenario run should make it possible to capture:

- semantic correctness;
- ambiguity honesty;
- unresolved-field timing;
- number of visual changes;
- semantic flicker;
- correction interactions;
- Wiki topic relevance;
- UI parity;
- accessibility labels;
- projection latency;
- screenshot/render state;
- selected visual treatment.

The automatic experiment program is defined in [AUTOMATED-SEMANTIC-EXPERIMENTS.md](AUTOMATED-SEMANTIC-EXPERIMENTS.md).

## 31. Initial visual variants

The sandbox should support at least three deliberately different projection treatments over the same VisualSpec.

### Variant A — annotated sentence

Most meaning remains in/under the natural-language line.

### Variant B — compact semantic strip

Text remains clean; compiled route appears beneath.

### Variant C — hybrid

Minimal inline annotation plus route chips beneath.

The purpose is not to pick a winner by taste.

Run the same scenarios through each.

## 32. Automatic design constraints

No variant may:

- hide unresolved material ambiguity;
- merge Provider and Account identity;
- imply verification from confidence;
- claim external execution;
- change canonical command;
- create a UI-only action;
- omit a consequential data-transfer marker;
- require a Wiki file for explanation.

## 33. Roadmap seed for local agents

The following is a proposed task family. Local Coordination should integrate it into the live roadmap rather than treat these IDs as constitutional.

### VSX-01 — Reality assay

Read current VisualSpec, project.ts, release corpus, shell roadmap and visual harvest. Produce gap map.

### VSX-02 — Sandbox fixture substrate

Implement named synthetic Worlds and source-native semantic declarations for three Providers, Accounts, Models and `prompt.send`.

### VSX-03 — InterpretationSession harness

Per-revision deterministic runner with late-result suppression and replay.

### VSX-04 — VisualSpec vNext candidate

Implement one pure projector from validated semantic state.

### VSX-05 — Floating-box simulator

Render the exact narrow MVP shell against VisualSpec only.

### VSX-06 — Semantic interaction reducer

Clicks/choices become explicit semantic edits and recompile.

### VSX-07 — Contextual Wiki projection

Generate/rank Wiki topics from semantic handles + Reflection graph.

### VSX-08 — Visual variant engine

Render multiple presentation packs over identical VisualSpec.

### VSX-09 — Scenario/replay console

Developer inspector, time travel and trace.

### VSX-10 — Experiment instrumentation

Capture metrics and comparisons defined by the experiment design.

### VSX-11 — Three-provider route suite

Prove ChatGPT/Claude/Gemini Provider/Account/Model scenarios without provider-specific UI logic.

### VSX-12 — Product design review

Use collected runs to update the product VisualSpec and interaction rules before native shell implementation.

## 34. Acceptance for the sandbox program

The design program is successful when the team can visually run the full simulated MVP journey:

```
blank Ω
→ "add my Claude account"
→ registered synthetic relationship appears
→ add/label second Account
→ select/default Account and Model
→ type ordinary prompt request
→ see Provider / Account / Model / prompt.send interpretation evolve per keystroke
→ resolve ambiguity by typing or clicking
→ inspect "Why?"
→ see contextual Wiki generated from semantic state
→ reach deterministic READY command
→ view SIMULATED prompt.send envelope
→ replay the entire interaction
→ compare multiple visual treatments
```

without:

- real provider execution;
- a hand-maintained Wiki;
- hidden UI routing state;
- UI-owned command logic;
- duplicated semantic schemas.

## 35. Falsifiers

The sandbox architecture is wrong if:

1. the UI has to parse provider/account/model names itself;
2. changing visual treatment changes command meaning;
3. typed and clicked correction produce different semantic outcomes without an explicit reason;
4. Account ambiguity disappears because of a prior/default not visible to the user;
5. a late parse result overwrites a newer revision;
6. Wiki relevance is derived from arbitrary text search when semantic handles already exist;
7. a Provider-specific UI branch is required for basic `prompt.send` routing;
8. fixture data is presented as live provider truth;
9. the developer inspector becomes a product requirement;
10. adding a fourth synthetic Provider requires changing the visual architecture rather than data.

## 36. Change record

- **2026-10-05:** Initial design. Consolidates the first-release floating box, current NLCL/VisualSpec substrate, visual-language design, old symbolic harvest, Reflection/Wiki architecture and the owner request for a realistic three-provider semantic visualization sandbox.


## Negative-intent projection experiment

The sandbox should support a bounded implementation of the [Negative Intent Signal Engine](NEGATIVE-INTENT-SIGNAL-ENGINE.md) without turning it into a release blocker.

Internally, preserve the full candidate manifold for inspection/replay. In the compact product surface, normally project only the single counterfactual with the highest early-correction value.

The sandbox must be able to demonstrate both of these cases:

- the compiler's second-ranked candidate is **not** shown because it is cheap to correct later and would only create noise;
- a lower-ranked candidate **is** shown because allowing it to remain implicit would create a large downstream target/scope/consequence correction.

Selecting the counterfactual must emit the same semantic edit as an equivalent typed correction. Dismissing it must not silently authorize the leading interpretation or erase material ambiguity.
