# Dogfooding: Build the Experiment Laboratory by Using It

## Two intertwined products

**Product P:** the greenfield Ω prompt-fanout mini-app used for objective E0/E1/E2 development tasks. **Product L:** the Elephant experimentation laboratory itself—controller, adapters, runner, event store, ECP, dashboards, metrics, artifact review and management. The lab's development should use the same tools it evaluates; when it finds a failure (e.g., lost child session, wrong token attribution), create a new test fixture, fix it under one experimental approach, and validate the fix in a later independent round. This is real dogfooding, not simply demonstrating a UI generated from a prompt.

## Minimal vertical slice before breadth

One controller creates a round and four isolated arms; four real AI workers build/test four small components or probes; results flow into a durable backend store; the webapp shows a live status/evidence feed; an independent reviewer grades; two masters each integrate accepted lessons; another round starts with both still alive. A user should be able to stop, reload, examine what happened and resume without losing the ledger. The lab itself needs browser-run, backend and persistence tests.

## Full-stack acceptance

A functional web UI alone is not full stack. Require an actual backend handler with validated input/output, durable database storage, append-only event journal or equivalent, artifact references by hash, a working executor transport, and verified end-to-end UI ↔ backend ↔ executor ↔ tests ↔ persisted evidence loop. Real-time updates may use native supported streaming/WebSockets/polling, measured for correctness. If a hosted platform restricts server/database/process control, report those constraints and move missing responsibility into the external lab runner; do not present fabricated server events.

## Growth stages

**Stage 0:** Round 0 proven utilities and truthfully displayed runs. **Stage 1:** E0 benchmark passes through the lab as a complete four-arm round with no Elephant. **Stage 2:** E1 one real context-resident or clearly stateless-prefix alternative; prove consult, stale detection, proposed patch review and recovery. **Stage 3:** E2 two real concurrent Elephant sessions; cross-domain questions, contradiction logs, dependency analysis and synchronization. **Stage 4:** automated result-driven experimental selection, failure harvesting, history visualization and limited dynamic domain allocation; each feature must earn its complexity.

## Dogfood loop in every round

Run product work through laboratory; capture friction and uncertainty; register a falsifiable improvement hypothesis; allocate one or more of four child experiments; score using withheld tests and real agent/time data; let both masters independently adopt, reject or modify; integrate verified common infrastructure; repeat. No invisible “continuous self-improvement” claim—each improvement must have a before/after trace and known evaluation cost.

## User-facing experience benchmark

Demonstrate that a non-programmer can see: what was dispatched; which AI and model each child used; whether four really ran; which source files changed; whether an Elephant's advice was stale; token and time consumption; tests actually executed; disagreements; which approach won on which measure; why both master approaches evolved as they did; and what the next concrete experiment will test. The interface must openly expose unknown/unavailable data.

## No external-provider magic in the seed

Alpha/Beta/Gamma provider targets in the greenfield Ω mini-app are simulations. Do not require automatic control of OpenAI, Anthropic or Gemini webapps in Round 0. External account integration, rate limits, consent and provider-specific UI protocols are follow-on experiments after deterministic seed functionality, safety boundaries and measurable Elephant value have been proven.
