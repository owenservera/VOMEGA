# Research Frontier — Questions Worth Deep Attention
These areas are likely to reward research, competing proposals, experiments, external evidence, and red-team attention. They do not prescribe answers.

- **External provider reality:** account identity, auth/session semantics, profile isolation, concurrency, expiry/reconnect, UI/network evidence, protocol discovery, parsers, drift, healing, promotion and materially different provider classes.
- **Routing/intelligence choice:** policy precedence, negative constraints, overrides, capability/model knowledge, staleness, cost/performance/reliability, fan-out/fallback, learned recommendations, hidden-policy risks.
- **World/canonical data:** source identity, object envelopes, relationships, conflict/contest, temporal semantics, content storage, external mutation, delete/archive/restore, import/merge, projection invalidation, reconstruction.
- **Memory/context/self-knowledge:** epistemic kinds, provenance, freshness, dependency/basis digests, retrieval, contradiction, invalidation/recompute, privacy, preventing summaries/inferences becoming facts.
- **Durable Work/agency:** identity, attempts, plans, checkpoints, leases, crash recovery, idempotency, duplicate effects, cancellation/compensation, timers, suspend/clock changes, long-running accounting, replay safety.
- **Authority/evolution:** action versus evolution versus constitutional change, impact, compatibility, promotion/admission, rollback, attenuation, generated behavior, repair, user-governed self-improvement.
- **Plugin/core boundary:** minimum trusted core, protocol versus implementation, first-party privilege, zero-plugin behavior, resource enforcement, extension trust, contract evolution.
- **Human experience/surfaces:** first minute, empty world, universal prompt, spatial/2D/3D, workspace continuity, inspectability, routing controls, attention/return, ordinary-user Forge.
- **Product instance/lifecycle:** Windows install/integration, durable local location, update, replacement, migration, backup/export/restore, reconnect, product identity, corruption recovery, sovereign exit.
- **Autonomous development:** multi-agent fan-out/fan-in, context allocation, durable development memory, truth layers, independent review, triggers, workflow economics, congestion, model escalation, telemetry, whether orchestration improves delivery.

Prefer questions with falsifiers. Preserve competing hypotheses. Historical BCP-dev is evidence/search lead, not authority. Refresh time-sensitive external facts.

## Provider Lab research questions

The Provider Lab itself creates a useful research frontier:
- Which browser observations are sufficient to infer semantic state without over-capturing user content?
- How should manual interaction traces be clustered into capability candidates?
- Which differences between manual and automated traces matter semantically?
- How can drift be detected before a realization fails?
- What evidence is sufficient to promote a repaired realization?
- Which provider knowledge belongs in shared substrate versus provider-specific packs?
- How should usage frequency influence capability prioritization without becoming hidden product policy?
- How can continuous Shadow mode remain locally private, bounded, and cheap enough to leave enabled?
- Which extension/browser boundaries are too weak and require external local instrumentation?
- What second/third provider best falsifies the current abstraction?

Treat these as experiment targets, not requirements for a particular extension architecture.

## Harvest research frontier

For each major research domain, include an **existing-solution archaeology** question:

- What working implementations already exist?
- Which solution families differ materially?
- What have others already proven or failed to prove?
- What tests, fixtures, protocols, state machines, recovery paths, or operational lessons can be harvested?
- Which candidates are reusable, adaptable, wrappable, portable, behaviorally reproducible, or evidence-only?
- What licensing, provenance, security, maintenance, or dependency constraints change the answer?

Use the heterogeneous development pool to fan out across distinct source classes rather than having every worker search the same GitHub keywords.

## Development acceleration frontier

Potential research questions include:
- What minimum local activity signals provide enough development reality without invasive capture?
- Can a shared event stream reliably align Git, shell, browser, tests, and agent activity?
- How much can automatic context bundles reduce fresh-worker onboarding?
- Can failure capsules materially improve cross-model debugging?
- Can real successful episodes be converted into useful tests/workflows with low correction cost?
- What evidence is sufficient to route work empirically among ZCode, Codex, and Claude Code?
- When does independent multi-model review pay for itself?
- What isolation primitive makes parallel experiment universes cheap on Windows?
- Can runtime traces identify architecture violations that static analysis misses?
- How much build/test latency can be removed without weakening release gates?
- Which captured development data deserves promotion and which should expire?
- What privacy/retention boundary makes a Development Reality Layer safe to leave enabled?
- Which accelerator measurably changes validated throughput rather than merely increasing activity?

Use `HARVEST-FIRST-ENGINEERING.md` before implementing any substantial acceleration substrate.

## Elephant context network frontier

`ELEPHANT-CONTEXT-NETWORK.md` preserves a rich hypothesis for distributed large-context cognitive project memory.

Key research questions include:
- Does persistent domain context outperform fresh workers plus retrieval/context bundles?
- Should partitioning follow code/product domains, cognitive functions, or a hybrid?
- How much deliberate overlap is useful at high-risk boundaries?
- What context occupancy preserves room for large worker submissions and good reasoning?
- How should resident, wave, and transaction context be separated?
- What epoch/staleness protocol is sufficient?
- What refresh strategy minimizes cost without silently serving stale answers?
- Which services—consult, artifact review, impact analysis, debugging, reconciliation, onboarding, etc.—actually create measurable value?
- When should an elephant split, merge, rotate, or replicate?
- How much cross-elephant consultation is useful before congestion dominates?
- Does literal full-source residency outperform compressed/hierarchical alternatives?
- Which model/provider characteristics matter most for a resident cognitive node?
- Can context pollution and abandoned-history salience be bounded reliably?

Treat the answers as empirical. Do not encode a fixed elephant architecture before testing.
