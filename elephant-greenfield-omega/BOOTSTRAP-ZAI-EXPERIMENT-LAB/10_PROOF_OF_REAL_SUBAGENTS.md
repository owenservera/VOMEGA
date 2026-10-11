# Authenticity: How to Prove Four Real, Context-Segregated Subagents

## There must be four real jobs, not four paragraphs

A qualifying experimental arm must have a unique invocation ID, distinct conversation/context handle (or provably independent stateless context), individually constrained workspace, visible tool/model activity, durable source/task output, start/end timestamps, a supervisor relationship, consumed resources and pass/fail evidence. Do not infer independence because a master says “I delegated” or generates subagent-like text. The experiment controller must retain inspectable raw child execution metadata when the substrate exposes it.

## Multi-layer isolation: independently verify each

**Context isolation:** each executor receives common public contract and its own private challenge, not the other three arm hypotheses, hidden evaluator rubrics or private canaries. Test whether it can reproduce another child's secret canary phrase without receiving it through permitted messages; if so investigate contamination. Do not use model claims of non-sharing as proof. A clean isolated subagent can share global system instructions by design; that is acceptable if logged.

**Workspace isolation:** each gets an independently writable ephemeral clone/worktree/container; run an allowed write and a forbidden write probe. Same-filesystem separation alone is not a security sandbox. Where OS confinement is absent, report `logical isolation only` and enforce post-run diff/permission audit. Do not grant provider credentials to a child not needing them.

**Process/tool isolation:** prove separate runtime child handles or separate model requests with bounded tools. Evidence may be process IDs, agent-subsystem invocation IDs, response IDs, tool log correlation and overlapping live task durations. A single parent asking one LLM to internally roleplay four analysts fails the requirement.

**Evaluation isolation:** hidden tests and grading notes remain outside child workspaces and prompts until the judge has locked results. Evaluator can query git/test outputs directly; it does not accept self-graded claims.

## Required adversarial challenges

- **Canary separation:** each child receives a private benign random marker; another child must not know it unless an allowed exchange explicitly occurred.
- **Cross-write attempt:** in safe test directories, ask one child to write a sibling file; must fail/trigger alarm or be clearly labeled unconfined.
- **Concurrency proof:** instrument start and finish of all four, capture overlapping intervals and live tool activity. A sequence of four execution episodes is not concurrency.
- **Cancellation:** cancel one child while others finish; verify resource cleanup, no continued source writes, and truthful statuses.
- **Identity continuity:** resume a known child when supported; restart a fresh one when not. Clearly distinguish resumed and reconstructed contexts.
- **Parent-summary fidelity:** compare child raw output hash/artifact to what parent reports; omissions/rewrites are flagged.

## ZCode-specific nuance

Official ZCode docs describe independently contextualized general-purpose and Explore subagents, foreground parallelism and background support. They also state subagents cannot themselves spawn subagents. Launch all four directly from the primary/controller task or use four separately managed top-level sessions, and verify child identity/usage using actual tool/log outputs. The default `general-purpose` has powerful tools; configure permissions and scope. Explore is read-only and unsuitable for code-writing experiments. Custom subagents are beta and often user-level; don't rely on unverified workspace-scoped agent definitions. See https://zcode.z.ai/en/docs/subagents .

## Result statuses

PROVEN = live session/job evidence, distinct context, actual artifact/run, reproducible tests and bounded workspace. LIMITED = real child but partial isolation/telemetry, with exact limits disclosed. FAILED = probe contradicts promised property. UNKNOWN = not executed or instrument unavailable. SIMULATED = mock/test, explicitly never counted as real agent execution. If isolation is LIMITED, the controller may conduct exploratory tests but must not claim the full four-real-concurrent-experiment milestone until essential conditions are met.

## Anti-fraud and anti-circularity

A screenshot of four animated cards is insufficient. A parent response saying “I used four agents” is insufficient. Four sets of output text with fabricated worker names is insufficient. A judge controlled by the same child is insufficient. Four distinct API usage events alone do not prove independent context if all received the same accumulated history. Demand runtime identity, prompt boundaries, independent changed artifacts, concurrency and external reproducible tests.
