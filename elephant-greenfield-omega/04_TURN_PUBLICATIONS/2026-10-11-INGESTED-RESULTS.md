# Elephant research ingestion — 2026-10-11

**Scope:** Elephant research intelligence and reusable experimental machinery only. **Not an MVP implementation assignment.**

Two user-supplied workspace archives were inspected independently. Their original archives are the primary source; the following is an evidence-tiered digest, **not independent re-execution**. All claims are local-to-lab or reported by their authors until independently reproduced in the VOMEGA environment.

## ZAI semantic factory — one completed publication turn

- Source: `workspace-2f993dc5-7532-422d-add2-ea23c8507dcc.zip`, inner `worklog.md`.
- Pinned sources as reported: VOMEGA 3f3ccd4757f62660a959d24222efff710867dcb2; historical vivim-final 8a798f9, edge-pwa b788dd9, vivim-omega 79ee558.
- **Reusable toolkit:** `src/lib/factory/{lexer,declarations,ground,interpret,extract,corpus,bootstrap,record-types,worlds,ecp}.ts`; `src/app/api/{interpret,commands,library/*,wiki,packs,gates,journal,world,factory/*}`; `src/components/factory/*`. Uploaded original also contains `upload/elephant_semantic_factory_v2_extracted/elephant_semantic_factory_v2/` with schemas, examples and manifest.
- **Reported local evidence:** pinned corpus receipt and anchored query machinery; 17 symbol families; canonical-command interpretation with declaration-derived READY validation; consent not bypassed by force; ambiguity preserved; 34/1189 VOMEGA hot-set files ingested (2.86%), 39 semantic records; journaled simulated command path. Lint/browser/API checks author-reported.
- **Limitations:** provider/browser action simulated; actual independently running Elephants not established; partial corpus coverage is not general comprehension; no live Windows/Tauri evidence.
- **Potentially portable:** source-anchored semantic records; origin/epoch provenance; query abstention; negative-knowledge registry; explicit command/consent/evidence separation. **Do not replace the existing D1 compiler wholesale**; compare as a candidate adapter and experiment.

## Claude capsule-first ECP v0.2 lab — Round 1, turns 1–3

- Source: `workspace-a02a20e7-5def-4484-9e94-39e1dd2fcc12 (1).tar`; inner `claude-ecp-lab/publications/turn-{1,2,3}/PORTFOLIO.json`, `claude-ecp-lab/runs/*`, `worklog.md`, `src/lib/ecp/*`.
- This is **three turns in Round 1**, not necessarily three completed rounds.
- **Reusable toolkit:** `src/lib/ecp/kernel/{kernel,journal,capsule,escrow,adapters,git,util}.mjs`, `src/lib/ecp/{session-store,append-adapter,live-adapter,consult,omega-repo}.mjs`; `claude-ecp-lab/runs/*` contains probes, fixtures, findings, timestamps, journals and machine results.
- **Reported local evidence:** SQLite independent-process persistence; SDK response usage metadata observed (17 prompt + 5 completion tokens in specific probe); capsule and epoch handling; generation-aware stale-basis refusal; durable APPEND session without capsule reinjection across a process restart and simulated server restart; kernel reattachment checks; code/fixture-sourced citation verification.
- **Critical negative results:** preregistered hidden-defect recall **0/10** over accumulated battery, while annotated defects often surfaced; apparent multiagent parallelism **not proven**; some E0 controls were no-dispatch/null-cost and cannot support apples-to-apples cost conclusions; invalid citation anchors occurred; single-writer journal prev-hash state and empty-review COMPLETED surfaced as defects or design caveats.
- **Takeaway:** infrastructure-level persistence and mechanical citation verification do not yet demonstrate robust independent cognitive recall or parallel throughput.

## Cross-track reusable intelligence

1. Store **knowledge provenance, source blob/epoch, expiry/freshness and evidence level** with every semantic record or capsule.
2. **Capability ≠ realization ≠ proof.** Separately register available toolkit source, reproducible tests and demonstrated live behavior.
3. Retain **negative evidence**, especially undiscovered hidden defects, false-ready cases, concurrency illusions and invalid anchors.
4. Measure context residency and knowledge recall with **blind holdout probes**, not successful retrieval of preannotated facts.
5. Distinguish **rounds, turns, process restarts and session preservation**; never count one as another.
6. Reuse ports/adapters **by explicit compatibility test**, not by copying rival interpreter, ECP or truth stores into main.

## Research direction correction

**Do not require ten rounds for any current ZAI stream.** Treat each bounded published turn as a legitimate stopping point. Subsequent rounds occur only if a specific unresolved high-information falsifier justifies the cost. Catalogue every artifact and mark each candidate as REUSABLE, EVALUATE, BLOCKED, SUPERSEDED or UNKNOWN independently of round count.

## Artifact retrieval

See `ARTIFACT-CATALOG.md` for original archive identities and concrete internal toolkit paths. The original uploaded archives are not silently asserted to be hosted by GitHub; the directory names and code pointers in the catalog refer to their **extracted submission trees** until source code is separately imported. Preserve raw archives and full run evidence before pruning; do not commit private environment files, session data or unrelated `vomega-source` snapshots.
