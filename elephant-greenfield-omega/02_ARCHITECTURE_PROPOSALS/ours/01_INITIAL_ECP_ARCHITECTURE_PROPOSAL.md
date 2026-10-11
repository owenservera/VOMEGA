# Proposal O1 — Git-Epoch-Bound Cognitive Elephant Network

## Authored thesis
Treat an Elephant not as a chatbot persona but as a **read-only or strictly bounded cognitive service** that holds source-context at a declared repository epoch and can answer a coding worker's consultation, architecture impact, trace, review or patch-proposal requests. Its *cognition can persist or be reconstructed* but never becomes stronger evidence than actual Git source, tests and observed behavior. Workers stay responsible for isolated edits, explicit verification and merge decisions.

The architecture explores a **deterministic source/context substrate paired with model-based specialist reasoning**. A controller binds questions and artifacts to exact commits and context manifests; it routes bounded requests to verified source-aware cognitive nodes, verifies returned anchors or flags uncertainty, and records costs and latency. The usefulness of having a context resident rather than reconstructing a pack each call is **the central empirical hypothesis**, not an axiom.

## Intended E0 → E1 → E2 progression
**E0:** direct fresh worker uses Git/source, task-specific static retrieval, builds/tests in an isolated workspace; instrument reconstruction overhead and accepted results. No Elephant service claimed.

**E1:** one actually distinct high-context cognition session bootstrapped from deterministic, secret-filtered source pack and versioned domain manifest. A wrapper tracks source epoch/freshness, consult/review/impact operations, timeouts, optional proposed diff output, result provenance, fallback and context reload. Worker continues to write in own worktree.

**E2:** two genuine independently contextualized and simultaneously usable specialists partition domains with known seam overlap. The controller may ask both independently, correlate versions, surface contradictions rather than voting away disagreements, and use evidence-driven recovery/congestion policy. Two labels on one model state do not qualify.

## Communications
Initial transport-neutral ECP command envelope: identity + role/capability, operation, request/correlation/idempotency, Git base and domain manifest, bounded artifacts, deadline/permissions, verified or unknown usage. Response includes actual basis, source anchors, tested/rejected uncertainty, out-of-domain and stale flags, and reproducible suggested checks. Candidate transport could be native local IPC/CLI, MCP tool exposure, A2A extension or another demonstrably better protocol—**do not mandate initial transport before experiment**.

## Cognitive context and flushing
Deterministic canonical context pack from source + approved notes; resident / verified wave delta / isolated transaction conceptual layers. Worker proposals are transaction-scoped until merged, never silently promoted to Elephant truth. Changed relevant commits produce stale state and reconciliation or full rebuild; soft compaction alone must not be called a lossless flush. A hard context rotation is successful only when new effective context, Git epoch, calibration, and ability to recover without original session history are observed.

## Code writing and authority
Initial safety-first operating mode: Elephant provides advice/review and optional **quarantined candidate patch**, not direct edits to main or a worker's worktree. Worker executes writes/tests only in its own authorized workspace; independent reviewer checks accepted work, integrator serializes Git publication. We can experiment with Elephant-as-worker in a separate disposable context to see whether contextual code creation outperforms advisory mode, but it does not automatically inherit unrestricted permissions.

## State/operational assumptions to test
- The selected provider can actually resume, hold or rebuild meaningful context at useful token/latency cost.
- Git manifests and bounded source packs can capture enough domain knowledge without overwhelming windows.
- Cross-domain specialist partitions improve defect recall enough to pay communication overhead.
- Stale-state detection is objective and source-derived, not a model's self-report.
- The combination improves **quality-adjusted validated feature throughput** over simpler E0 controls.
- Model call counters and full lifecycle setup/flush/coordination costs are observable with explicit unknowns.

## Seed/product demonstration
Use frozen Greenfield Ω Prompt Fanout Mini: deterministic command parsing, three local fake provider recipients, idempotent dispatch and cancel, event evidence and an actual UI or honest staged fallback. The **same product tests and fixture cohort** apply to fresh, one-Elephant and two-Elephant variants. Defer all real browser credential/provider automation.

## Architecture freedom inside proposal-specific build
This is a **seed design to optimize, not a package manifest**. The dedicated development lab chooses its own actual pack boundaries, libraries, interfaces, details, implementation sequence and hypotheses. It may replace an assumed approach when experiments contradict it, but **must preserve a reference variant identifiable as O1** and mark severe departures as a different derivation, not falsely label them validation of the unchanged design.

## Expected end state
A suite of independently portable, source-verifiable capability packs with a working reference composition, not a giant chat-based proprietary control plane. No predeclared count of packs, frameworks, services or tools. Package all results—even immature and rejected—at the end of **every** development turn, then run independent clean-room handoff and system composition experiments.

## Existing source-level supporting proposal materials
See ../../protocol/01_TOPOLOGY_AND_FLOW.md, 02_ECP_V0_SPEC.md, 03_MEMORY_FLUSH_AND_RECOVERY.md, 04_CODE_WRITING_AND_GIT.md, 05_FAILURE_CONSISTENCY_AND_SECURITY.md. Those are proposed details subject to falsification by the builder, not constraints on other architectures.
