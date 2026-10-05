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
