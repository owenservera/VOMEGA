# First Product Release Design — Floating Command Box

## Status

**OWNER-DIRECTED FIRST PRODUCT RELEASE DESIGN**

This document is dedicated to the shape, behavior, proof, and interaction model of the first VIVIM-Ω product release.

It is more concrete than `PRODUCT-ANCHOR.md`.

It does **not** make the Windows surface, browser realization, current providers, or current visual treatment permanent Ω architecture.

The product target is:

> **A small floating Windows command box through which a person can register their providers and accounts, see the capabilities those relationships make available, and use those capabilities in natural language through a deterministic semantic command system.**

The first externally useful capability is deliberately small:

> **Send a prompt to any known supported provider Account.**

The product is not “a launcher for AI websites.”

The release exists to prove that ordinary language can drive a deterministic, inspectable, governed capability system over real user-owned provider relationships.

---

# 1. The release promise

A new user should be able to install VIVIM, summon a small floating command box, and begin naturally:

> Add my ChatGPT account.

> Connect Claude.

> What accounts do I have?

> What can I do with my Gemini account?

> Ask my personal Claude account to explain this.

> Send this prompt using ChatGPT.

The user should not need to learn an internal command language.

VIVIM should interpret ordinary language, resolve it into an explicit semantic command, show the user what it understands in real time, resolve ambiguity when necessary, execute only a valid governed command, observe the real result, and preserve truthful local evidence/state.

The deeper proof is:

**natural language → explicit deterministic command → governed realization → observed external result**

---

# 2. The visible product

The primary release surface is a **small floating Windows text box**.

It should be:
- quick to summon;
- easy to dismiss;
- visually quiet;
- usable without opening a large application window;
- capable of expanding when explanation, choices, help, or results require more room;
- persistent enough to show current provider/account/capability context;
- not visually branded as an “AI chatbot.”

A conceptual compact state:

```
┌────────────────────────────────────────────────────┐
│ VIVIM                                              │
│ Ask or tell VIVIM what you want…                   │
│                                                    │
│ ChatGPT · personal    Claude · work    Gemini      │
└────────────────────────────────────────────────────┘
```

While the user types, the box may expand:

```
┌──────────────────────────────────────────────────────────────┐
│ Ask my work Claude account to summarize this                 │
│                                                              │
│ UNDERSTOOD                                                   │
│ Use: Claude → work → prompt.send                             │
│                                                              │
│ Available options                                            │
│ [Claude / work] [Claude / personal]                          │
│                                                              │
│ Help                                                         │
│ prompt.send · account selection · provider availability      │
└──────────────────────────────────────────────────────────────┘
```

The exact pixels, layout, framework, animation, and Windows implementation are discoverable.

The functional interaction model is the important part.

---

# 3. One surface, one command system

The first release should aggressively dogfood the Ω semantic command model.

A critical product rule is:

> **Every meaningful product-state-changing action the user can perform through visible UI must have an equivalent semantic command and should invoke the same underlying command machinery.**

Do not build:
- one settings architecture;
- another button/action architecture;
- another natural-language architecture;
- another agent architecture.

Provider registration, Account registration, selection, capability discovery, configuration, help, and capability invocation should converge on the same semantic command system.

A visual button may be a convenient projection of a command.

It must not be a privileged alternate execution path.

Pure representation gestures such as physically dragging or resizing the floating box need not become semantic Work unless they alter meaningful product state.

---

# 4. The deterministic USE command system

The user does **not** need to type formal syntax.

Internally, however, every consequential interaction should resolve into an explicit canonical operation.

Call the release-level abstraction the **USE command system**.

“USE” here means:

> use an addressable capability, under explicit context and authority, through a selected realization.

A canonical command may need fields conceptually equivalent to:

```
USE
  address / target
  intent
  capability
  provider
  account
  parameters
  context
  routing choice
  authority requirement
  realization
  evidence expectation
```

This is conceptual.

Do not prematurely freeze a JSON schema or grammar merely because this document shows the fields.

The important property is that execution never occurs directly from an unconstrained model completion.

---

# 5. Probabilistic interpretation, deterministic execution

Natural language is inherently ambiguous.

VIVIM may use probabilistic intelligence to interpret what the user means.

That interpretation is **not authority and is not execution**.

The first-release interaction path should be:

```
human expression
    ↓
candidate interpretation
    ↓
canonical command candidate
    ↓
deterministic normalization / validation
    ↓
address + capability + account resolution
    ↓
ambiguity check
    ↓
authority / consent
    ↓
selected realization
    ↓
execution
    ↓
observation
    ↓
evidence + local state
```

After a canonical command has been resolved, the remainder of the path should be as deterministic, replayable, inspectable, and testable as the capability permits.

Where interpretation remains materially ambiguous, **do not guess invisibly**.

Ask or present choices.

---

# 6. Real-time interpretation feedback

The text box should show the user what VIVIM currently thinks the command means while the user is composing it.

Useful feedback may include:

- detected intent;
- selected Provider;
- selected Account;
- candidate capability;
- model/mode if materially relevant;
- missing required information;
- available alternatives;
- whether authority/consent will be required;
- whether provider/account knowledge is stale;
- whether the capability is currently available;
- whether VIVIM is uncertain.

Example:

User types:

> ask Claude to review this

VIVIM might show:

```
Intent: send prompt
Provider: Claude
Account: ambiguous

Choose:
[Claude · personal]
[Claude · work]

Capability: prompt.send
```

If only one Claude Account is valid and the user's standing configuration allows defaulting, VIVIM may resolve it automatically while still showing the selection.

The user should not have to wonder which Account was silently chosen.

---

# 7. Progressive capability UI

The product should begin almost empty.

Capabilities should appear as the user establishes real Provider and Account relationships.

The UI is therefore a projection of current known capability reality.

Conceptually:

```
install
  ↓
no providers known
  ↓
register ChatGPT account
  ↓
ChatGPT Account appears
  ↓
verified capabilities appear
  ↓
register Claude account
  ↓
Claude Account appears
  ↓
its verified capabilities appear
```

Do not populate the interface with capabilities merely because a provider theoretically supports them.

Distinguish:
- provider-known capability;
- Account-available capability;
- observed capability;
- verified realization;
- currently healthy capability;
- stale/unknown capability.

The first public capability is:

**prompt.send**

Future capabilities may include attachments, model selection, projects, search, conversation navigation, stop/regenerate, tool use, and other provider-specific or generalized operations.

Those are not required merely because the Provider Lab can observe them.

---

# 8. Provider and Account registration must itself use the command system

Setup is one of the most important tests of the product architecture.

The user should be able to type:

> Add ChatGPT.

> Register my Claude work account.

> I have another Gemini account.

> Which account is this browser logged into?

These should resolve through ordinary semantic commands rather than a separate hidden setup wizard architecture.

A conceptual onboarding sequence:

```
user: "add my ChatGPT account"
        ↓
candidate command: provider/account registration
        ↓
VIVIM identifies supported registration realization(s)
        ↓
user chooses/uses existing browser relationship where necessary
        ↓
VIVIM observes Provider + Account evidence
        ↓
ambiguity/identity is resolved
        ↓
local Provider/Account relationship is recorded
        ↓
capability discovery / verification runs
        ↓
new capabilities appear in the command box
```

The exact authentication flow is provider-specific and must respect provider/browser reality.

VIVIM should not ask the user to hand it provider passwords when the browser relationship can be used.

Credentials are not product knowledge merely because the machine can observe them.

---

# 9. Initial semantic command families

The exact command ontology remains discoverable, but the first release will likely need a minimal semantic surface equivalent to:

### Product orientation
- show what VIVIM knows;
- show Providers;
- show Accounts;
- show available capabilities;
- explain current state.

### Provider / Account
- discover/register Provider;
- discover/register Account;
- list Accounts;
- select/default Account where appropriate;
- refresh/revalidate Provider or Account evidence;
- disconnect/remove a local relationship.

### Capability
- list capabilities;
- describe a capability;
- explain why a capability is unavailable;
- invoke a capability.

### Help
- explain what can be done;
- explain a command interpretation;
- explain a Provider/Account/capability;
- show examples relevant to current state.

### First external capability
- **prompt.send**

Do not expand the command inventory until a real user journey requires it.

---

# 10. First capability: prompt.send

The first meaningful external capability is simple:

> Send this prompt through a selected known Provider Account.

Examples of natural expressions:

> Ask ChatGPT what this error means.

> Send this to my work Claude.

> Use Gemini for this question.

> Ask my usual ChatGPT account: why did this test fail?

> I want Claude personal, not work.

These different expressions should converge on a small semantic capability rather than separate UI handlers.

The capability should establish, where relevant:

- prompt payload;
- Provider;
- Account;
- browser/session realization;
- optional model/mode choice if exposed and supported;
- authority;
- execution attempt;
- submission observation;
- result/receipt observation;
- evidence freshness.

The first release does not need to understand every provider feature.

It needs to make **one operation deeply truthful**.

---

# 11. Account identity is part of correctness

“Prompt sent to Claude” is insufficient proof.

The product should be able to distinguish:

- Claude Provider;
- Account A;
- Account B;
- active browser session;
- stale/unknown Account evidence;
- realization used.

A selected Account must not silently become another Account.

If Account identity cannot be established confidently enough for a consequential operation, VIVIM should surface that uncertainty rather than pretending the target is known.

For the first release, Account correctness is part of the product result.

---

# 12. Capability availability is evidence-backed

A registered Provider is not the same thing as a working capability.

A registered Account is not the same thing as a currently valid session.

The floating interface should be able to represent states such as:

- available;
- available but stale;
- verification in progress;
- needs login;
- Account ambiguous;
- temporarily unavailable;
- realization drifted;
- unsupported;
- unknown.

The user should be guided toward the smallest action that resolves the problem.

Example:

> Claude work is known, but VIVIM can no longer verify the active session.  
> [Reconnect] [Use Claude personal] [Why?]

---

# 13. The contextual Wiki / Help surface

The first release should include a **live contextual help surface**.

This is not a generic chatbot-help panel.

It is a projection of what the product currently knows about:

- VIVIM concepts;
- current Providers;
- current Accounts;
- currently available capabilities;
- valid command patterns;
- current command interpretation;
- missing information;
- authority/consent requirements;
- relevant examples;
- known limitations;
- provider-specific guidance where appropriate.

The Wiki should become relevant automatically as the user types or encounters a problem.

Examples:

If the user types:

> add another Claude

the Help surface can show:
- what “Provider” and “Account” mean;
- detected Claude Accounts;
- how registration works;
- what will and will not be captured;
- what capabilities can become available.

If the user types:

> what can I do?

the Help surface should derive the answer from the actual capability registry and current Account state.

### Help-grounding rule

The contextual Wiki should be grounded in deterministic product/capability metadata and current evidence.

Architecture refinement: see [Self-Describing Runtime & Source-Native Contextual Wiki](SELF-DESCRIBING-RUNTIME-WIKI.md). The long-term source of that metadata should be the same source-native declarations, schemas, manifests and reflection records that make the capability real. A plugin should not require a separately authored Wiki/help file in order to become explainable.

A model may summarize or phrase help naturally.

It must not invent capabilities, Account state, authority, or provider facts.

---

# 14. Visual UI and natural language reinforce one another

Natural language should not mean an empty box with invisible magic behind it.

The UI should teach the system as the person uses it.

Useful projections may include:
- Provider chips;
- Account chips;
- capability chips;
- command interpretation;
- autocomplete;
- recent targets;
- missing-field prompts;
- disambiguation choices;
- command preview;
- execution state;
- result/evidence state;
- contextual help.

Clicking one of those elements should feed the same semantic command system.

Typing the equivalent request should produce the same underlying operation.

This creates a bidirectional learning loop:

**type naturally → see explicit semantics → learn available possibilities → refine naturally**

---

# 15. Command completeness rule

The first release should mechanically test an important property:

> **No meaningful product action exists only as hidden UI code.**

For each user-facing state-changing action, the system should be able to identify:
- semantic command/capability;
- parameters;
- authority requirement;
- realization;
- evidence/result.

Where practical, maintain a command/action registry that allows tests to compare UI-exposed actions with semantic operations.

This is one of the most important first-release architecture tests.

The product should not become “natural language pasted over ordinary app callbacks.”

---

# 16. Determinism tests

The first release should build an unusually strong test corpus around command resolution.

Test categories should include:

### Paraphrase equivalence
Different natural expressions with the same meaning should resolve to the same canonical command where state is the same.

Example set:

> ask Claude this  
> send this to Claude  
> use Claude for this  
> have Claude answer this

All may resolve to the same `prompt.send` capability with the same Provider/Account target.

### Explicit-target precedence
If the user says “work Claude,” a default personal Account must not override it.

### Ambiguity preservation
If two valid Accounts are equally plausible and no policy resolves them, the system asks rather than silently choosing.

### Unknown capability
If the user requests an unavailable operation, VIVIM must not fabricate it.

It should explain what is known and offer valid alternatives.

### Replay
A canonical command and its relevant state/context should be inspectable enough to explain why a target/realization was chosen.

### Authority separation
Natural-language interpretation must not create permission.

### Deterministic UI parity
Typing an operation and clicking the equivalent visible action should reach the same semantic command path.

---

# 17. Real-time command state

The floating box should make command lifecycle visible without overwhelming the user.

Candidate states:

```
interpreting
↓
understood
↓
needs choice
↓
ready
↓
needs consent
↓
executing
↓
observing result
↓
completed / refused / failed / uncertain
```

The exact labels are product-design choices.

The important point is that the user sees meaningful progress and uncertainty rather than a generic spinner.

---

# 18. First-release Provider target

The intended early Provider set is:

- ChatGPT Web;
- Claude Web;
- Gemini Web.

This is a release target, not permission to fake nominal support.

Development should prove one provider first, then use a materially different second provider to falsify shared abstractions, then a third where it materially improves confidence.

A public release should represent provider/account/capability support honestly.

Provider count is secondary to correctness.

---

# 19. Provider Lab relationship

Provider Lab is the development environment for learning how the external Provider actually behaves.

The floating command box is the product.

The Lab can:
- discover Account signals;
- map provider-native capabilities;
- observe normal human use;
- characterize `prompt.send`;
- test browser realizations;
- compare manual versus automated outcomes;
- detect drift;
- develop repairs.

The product should harvest:
- semantic capability knowledge;
- Account/session evidence;
- verified realizations;
- failure semantics;
- drift/recovery behavior.

It should **not** inherit the Provider Lab mirror UI wholesale.

---

# 20. First-release lifecycle

A successful first-run journey should feel approximately like:

```
install
↓
launch / summon floating box
↓
"add my ChatGPT account"
↓
guided provider/account registration
↓
Account identity shown
↓
verified capabilities appear
↓
"user types a normal request"
↓
live interpretation shows target + capability
↓
user resolves ambiguity if any
↓
deterministic command becomes ready
↓
governed browser realization runs
↓
real external submission/result is observed
↓
local evidence/state is preserved
↓
later restart
↓
Provider/Account relationship and truthful capability state remain
```

This is the first product story.

---

# 21. What the first release does not need

Do not make the first release wait for:

- full agent autonomy;
- background delegated Work;
- Canvas / spatial UI;
- full Provider Lab semantic mirrors;
- every provider capability;
- attachments;
- provider project/workspace support;
- fan-out to many providers at once;
- automatic provider repair without human review;
- Forge self-extension;
- 3D UI;
- generalized workflow orchestration;
- a huge settings application;
- a complete personal knowledge graph.

Any of these may become valuable later.

They are not prerequisites for proving the first product promise.

---

# 22. Release-critical architecture boundaries

The first release should pressure-test these boundaries:

**Natural language ≠ canonical command**

**Canonical command ≠ authority**

**Provider ≠ Account**

**Account ≠ Session**

**Capability ≠ realization**

**Capability known ≠ capability currently available**

**UI action ≠ privileged implementation path**

**Help text ≠ capability truth**

**Observed submission ≠ correct result unless target identity/evidence is sufficient**

These distinctions are product quality, not abstract architecture.

---

# 23. Release proof matrix

A first public release should not be called complete until the following claims are supported with relevant evidence:

### Installation / invocation
- installs on the intended Windows target;
- launches reliably;
- floating command box can be summoned and dismissed;
- no global development configuration is required for ordinary use.

### Command system
- ordinary-language input resolves into explicit semantic commands;
- material ambiguity is shown;
- invalid/unavailable requests do not silently execute;
- setup operations use the same command system;
- UI actions and typed equivalents converge on the same semantics.

### Provider / Account
- user can register at least the release-supported Provider Accounts;
- Account identity is explicit enough to prevent silent target switching;
- credentials are not unnecessarily captured;
- stale/unavailable relationships are represented honestly.

### Capability projection
- capabilities appear because they are known/available, not because the UI has a hard-coded decorative list;
- unavailable capability state is explainable;
- `prompt.send` is represented consistently across supported Providers.

### Live execution
- a prompt is sent through the intended real Provider webapp substrate;
- intended Provider and Account are evidenced;
- the external submission/result is observed;
- disconnected/stale realization cannot report fresh success.

### Continuity
- Provider/Account relationship and relevant local state survive restart;
- evidence from prior execution remains distinguishable from current live availability.

### Help
- contextual help reflects current command/capability/account truth;
- “what can I do?” is answered from actual available capability state;
- help cannot invent capabilities or silently grant authority.

---

# 24. Release falsifiers

The release design should be considered wrong or incomplete if any of these remain true:

1. The user must leave the command system and use a separate settings architecture for ordinary setup.
2. A UI button can do something that has no semantic command equivalent.
3. Natural-language model output directly causes consequential execution.
4. Two Accounts can be confused without the user seeing the ambiguity.
5. The UI advertises capabilities that have no current verified realization.
6. A disconnected browser/provider can still be shown as live.
7. Help claims capabilities or state not supported by the registry/evidence.
8. ChatGPT support requires semantics that cannot survive Claude/Gemini without parallel architecture.
9. The user cannot understand what VIVIM thinks their request means before or during consequential execution.
10. A successful provider click sequence is treated as sufficient evidence without target/result identity.

---

# 25. Build strategy

The current bootstrap has already proven selected local Vault continuity and isolation.

The next development work should now converge toward this release.

A sensible evidence-driven sequence is:

### A. Command nucleus
Prove the smallest canonical USE command representation and deterministic resolver sufficient for setup/help/`prompt.send`.

Do not design the full future language.

### B. Floating shell
Create the smallest Windows floating surface capable of:
- text entry;
- interpretation projection;
- choices;
- capability/account projection;
- contextual help.

The shell can initially use mocked/local command state only long enough to test the interaction contract.

### C. Real Provider/Account observation
Use Provider Lab / Harvest-First techniques to prove real browser transport and Account evidence.

### D. Registration through command
Make “add my <provider> account” travel through the same command machinery and persist the resulting relationship locally.

### E. First live `prompt.send`
Execute one real prompt through one real Account with explicit external evidence.

### F. Second Provider falsification
Add a materially different Provider and change shared semantics only where evidence requires it.

### G. Capability projection
Make the UI derive available actions from the actual Provider/Account capability state.

### H. Contextual Wiki
Ground help in the same command/capability registry and current state.

### I. Release hardening
Restart continuity, stale-session handling, Account switching, refusal, recovery, packaging, and ordinary-user first-run testing.

This is a learning sequence, not a frozen implementation roadmap.

If evidence shows a better ordering, change it while preserving the product proof target.

---

# 26. Product design principle

The first release should make one idea unmistakable:

> **You do not operate VIVIM by learning its software. You tell it what you want in ordinary language, and it shows you the explicit capability-level meaning before governed execution.**

The floating box is intentionally small.

The underlying semantic system is the product.

The release wins if the user experiences increasing power without increasing implementation vocabulary.

---

# 27. Definition of success

The first release succeeds when a normal user can:

1. install VIVIM on Windows;
2. summon the floating command box;
3. type naturally to register their real supported Provider Accounts;
4. see the capabilities those relationships actually make available;
5. ask VIVIM what it can do and receive grounded contextual help;
6. type a natural request to use a known Account;
7. see how VIVIM has interpreted the target/capability in real time;
8. resolve ambiguity without learning internal syntax;
9. send one real prompt through the correct Account;
10. receive truthful feedback/evidence about what happened;
11. restart VIVIM and continue without rebuilding the relationship.

If that works, VIVIM has proven far more than “AI prompt forwarding.”

It has proven the first useful instance of:

**human language → deterministic semantic control → governed external capability → durable local continuity.**

## Related interaction design — active proposal

[Command Visual Language — Real-Time Interpretation and Guidance](COMMAND-VISUAL-LANGUAGE-DESIGN.md) develops the owner's visual-feedback brief, including interactive icons for devices, applications, AI Providers and Accounts; phrase annotations; scope; assumptions; correction; and execution/evidence feedback.

It is an evolving interaction blueprint, not an implemented feature or a frozen visual specification. Windows-command and fan-out examples test future generalization and do not expand the first-release requirements above.
