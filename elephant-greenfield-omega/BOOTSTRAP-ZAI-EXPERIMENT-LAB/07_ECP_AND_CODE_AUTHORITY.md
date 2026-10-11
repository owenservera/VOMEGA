# Elephant Context Protocol — Operational Semantics and Code Authority

## Participants

Controller owns work scheduling, experiment registration, routing, budgets and durable logs. Master A/B independently design, integrate and evolve competing approaches. Workers write product and lab implementation inside task-isolated workspaces. Elephants are active contextual model sessions capable of consult/review/explanation/critique; they may optionally generate **candidate code artifacts**, but they do not secretly mutate worker workspaces. An independent evaluator verifies behavior. The keeper maintains snapshot/context hygiene and can be a bounded task, not a permanent extra hierarchy until proven valuable.

## Minimum request identity and lifecycle

Every message carries experiment round/arm, master approach, task ID, parent-child invocation chain, target Elephant if known, requested service, request ID, idempotency key, model/runtime identity, source epoch, artifact references (hashes), intent and assumptions, deadline, permissions/budget and requested response format. Messages are typed: CONSULT, REVIEW, IMPACT, TRACE, DEBUG, DESIGN, EXPLAIN, PROPOSE_PATCH, RECONCILE, STATUS, FLUSH, ROTATE, CANCEL and DISAGREEMENT. Unknown operations fail explicitly; no unbounded implicit recursive routing.

Every response carries correlated ID, status, evidence basis and incorporated epoch, declared gaps/out-of-domain fields, findings with source anchors and suggested test/falsifier, generated artifact identities if any, reason for non-answer, and measured or missing usage/latency. A status of `ADVISORY_UNVERIFIED` is mandatory until a separate test/review establishes acceptance. The wrapper should mechanically compute source epoch/staleness and validate cited paths/lines; an Elephant's self-reported freshness is informative but never dispositive.

## State transitions and exactly-once limits

Request states: CREATED → VALIDATED → QUEUED/DISPATCHED → RUNNING → COMPLETED/FAILED/TIMED_OUT/CANCELLED → REVIEWED/ARCHIVED. A retry with the same idempotency key must not silently duplicate external side effects. Exactly-once network calls cannot be presumed; use idempotent operations, durable event sequencing and at-least-once replay-safe processing. Persist an audit event at every state boundary. Cancellation must be acknowledged and follow process cleanup; cancelled children cannot continue writing authoritative artifacts.

## Worker writes; Elephant may propose

Normal code path: worker requests domain advice → Elephant returns review/impact → worker writes in its isolated branch/worktree → tests run → independent review checks relevant evidence → merge accepted changes into consolidated main. Optional advanced path: Elephant responds with a patch/full proposed artifact, but the controller stages it as **untrusted proposal** in a fresh scratch path, performs syntactic/security checks and assigns a worker to apply/verify it. The Elephant does not hold main-branch write credentials. This lets us experimentally compare “advisory only” against “advisory + candidate artifact” without conflating their permissions.

No code output, agent prose or mock screenshot counts as a feature delivered. Product changes require executable tests, expected behavior evidence, and independent review. Avoid unapproved deployment, financial actions, communications, credential changes, or external provider interactions in initial rounds.

## Concurrency and multi-Elephant behavior

At E0 there is no Elephant call: contextual questions use standard repo inspection/context bundles. At E1 a worker can query one resident domain. At E2 a worker may independently query both Elephants when the task crosses domain boundaries, or receive one node's suggestion to consult the other; these are two real distinct context/session identities. Store disagreement records containing both arguments, citations, claimed assumptions and a proposed deciding test. A consensus summary must never erase an unresolved contradiction. Add batching, queues and replication only if latency/cost metrics show they are warranted.

## Recovery, timeout and freshness

On deadline expiry return a structured fallback to context-bundle or E0, record it, and continue safely; do not pretend Elephant success. If source files changed since the Elephant's incorporated basis, return staleness data computed outside the model and either refresh, narrow the answer or forbid high-confidence claims. If a worker sends an uncommitted patch, keep it in transaction context only; verified accepted changes are promoted via Git epoch reconciliation.

## Transport neutrality

The wire contract must not depend on Z.ai internals. An adapter may use CLI session resume, API calls, local queue/IPC or a hosted platform's supported agent tool. Unsupported session fork, persistent context, token streams or background execution are marked unavailable. The same abstract operations must be exercised by deterministic mock tests and at least one **real AI invocation** before protocol operation is claimed.
