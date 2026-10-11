# From One Ordinary File to a Self-Describing System

**Role:** conceptual walkthrough and first teaching document. **Status:** design narrative; all shown syntax is CANDIDATE. **Last reviewed:** 2026-10-11.

## Start from what already exists

Imagine we have a TypeScript file that could have been written in any normal software project. It declares a constant, takes two numbers, adds them, loops over a collection and branches based on a condition. None of these are new constructs. A compiler already recognizes their syntax and types; standard tools can find function definitions, imports and references. The challenge is that those tools do not inherently know why the author wrote a function, how the user describes its purpose, whether a separate service makes it usable or which claim about the code is trustworthy.

A person looking at a very small function can often infer much of its behavior. A model can usually describe it too. As the codebase grows, however, those descriptions are rebuilt repeatedly by different readers and models, sometimes inconsistently. The purpose of the semantic layer is to make that understanding explicit where needed, attributable to source evidence and reusable without turning the code into a nonstandard language.

## The first fixture in plain terms

Our first fixture, provisionally called “001 — semantic basics,” is not an application. It is a small teaching and measurement artifact whose scope can be understood in minutes. It contains ordinary arithmetic, state, iteration, branching, errors and dependencies. For each example, we document what a novice would need to understand, what a static compiler can establish, what must be declared by the developer and what remains uncertain until execution or external observation.

For example, “add” takes two numeric arguments and returns their sum. The TypeScript signature supplies parameter and return shapes; the function body shows addition. A semantic comment might declare that its intention is “combine two numbers.” We should never require the user to retype the signature in prose if the compiler can accurately recover it. Yet in the initial saturation track we deliberately try that duplication so that experiments can measure whether the extra words increase comprehension, reduce mistakes or just consume context.

A more revealing example is “repeat.” A developer might annotate it with the claim “runs the operation exactly N times for any integer N.” The actual loop may behave differently when N is negative, non-integral or exceeds safe numerical bounds. Instead of treating an annotation as law, the system should say: this behavior was DECLARED; these types were MECHANICALLY_EXTRACTED; these edge cases were NOT_TESTED; the assertion is CONTRADICTED if a suitable test fails. The system is useful precisely because it can surface differences between claimed meaning and reality.

## Visualizing one source file

Picture three linked panes. On the left is the normal source file, with a file header, contextual comments, inline annotations, perhaps a footer, and ordinary executable statements. In the center is a machine interpretation: stable source anchors, symbols, types, relationships, provenance, effect claims and uncertainty. On the right is a human explanation, assembled as an intelligible wiki with examples and why-it-matters descriptions.

The panes must not independently invent the truth. They point to a compatible source revision and semantic publication. As someone types, the views may show a draft preview; a stable committed publication should be versioned and never silently mutate after it is referenced by other agents or tests. This distinction matters when a model is reasoning about changing code: its explanation must not accidentally mix an old function definition with a new input signature.

What lives in a header, inline comment, footer or external manifest is **not decided**. We will experimentally compare these placements because they change both human readability and parsing cost. The compiler should distinguish recognized syntax from semantically meaningful declarations and incidental comments; parsing a comment is not equivalent to importing and executing the file.

## What a semantic claim contains

Conceptually, the smallest meaningful claim names something, states something about it, gives its source/scope and classifies the evidence. A richer candidate envelope might carry a symbol reference, a stable semantic identity, definition and source revision, the predicate and its typed value, derived/declared/observed status, source location, dependencies, associated tests, incompatible claims, last verification and the consumers that depend on it.

One source line can support many claims, and a claim can involve multiple functions or files. For that reason, there may ultimately be graph-like relationships even if the first implementation stores plain JSON. We do not need to adopt a physical graph database to establish useful relationships. The initial priority is that an agent or reader can trace a statement back to where it came from and distinguish missing evidence from evidence that something does not exist.

The “same file describes itself” ambition eventually extends to compiler passes, indexers, source adapters and even the rules defining semantic annotations. It cannot mean the system certifies its own correctness merely by asserting it. A small independent bootstrap checker and hostile mutation tests remain necessary.

## What happens when a file changes

Suppose the arithmetic function changes from addition to multiplication while retaining its old description. A source hash changes. The parser observes a different operation. Source-linked claims about addition become suspect; the generated wiki, symbol index, agent context packets and prior explanations should become stale or be regenerated under a new publication. We want a measured dependency impact chain, not simply an LLM rewriting a page that “looks right.”

Different kinds of changes matter differently. Renaming a private local variable might preserve semantic meaning; altering a return type or a side effect might not. Moving a function to another file could change a source anchor without changing its conceptual identity. These examples teach why identity, revision, dependency and meaning must be modeled separately. The exact identity/normalization rules remain candidates subject to adversarial tests.

## From local meaning to system intelligence

A second file imports the first. A third calls a function with domain-specific intent. A fourth supplies a UI surface. As these are linked, the system can explain which symbols are locally defined, which are imported, what consumes them and which dependencies are unknown or stale. It can generate a wiki entry for a feature, not merely one function. In time, a user might ask, “Where does this behavior originate?”, “What breaks if I change it?” or “Which capabilities relate to this request?” and receive answers with exact evidence and explicit uncertainty.

This is different from a preloaded encyclopedia or a free-standing documentation site. New files should become **discoverable** when conforming source is admitted, but discoverability never means a new function is safe to execute. A compiled declaration of an API method cannot prove that the API is installed, available, authenticated or authorized.

## First meaningful demonstration

A credible first demonstration loads the simple TypeScript fixture, statically inspects it, displays maximal source-grounded explanation, builds a minimal machine interpretation and human wiki, and then makes one deliberate mutation. It should show what became stale and why. Follow that with a compressed or zero-annotation candidate and compare whether independent readers/agents can reconstruct required meaning.

The first version does not need a complex desktop app, cloud server, graph database, browser dependency or custom compiler technology. Those may be valuable later. The early demonstration should be small enough to repeat without hidden environment state, and rich enough to distinguish a useful semantic layer from decoration.

**Follow-up:** [03 — The feedback laboratory](03_FEEDBACK_AND_EXPERIMENTS.md), [05 — Logical contracts](05_PRINCIPLES_AND_CONTRACTS.md), and [06 — The unresolved encoding questions](06_DECISION_BOARD.md).