# SKW-L1 handoff — Lock D read-only reflection audit

Status: COMPLETE (bounded increment). Source read-only; no source edits, no git writes, no config changes.

## Artifacts
- `omega-baseline/experimental/reflection-audit/LOCK-D-CANDIDATE.md` — plugin/op inventory,
  proposed Reflection node/edge mapping, manifest↔implementation parity findings, `prompt.send`
  fixture, §11 completeness gaps.
- `.project/agentic-launch/handoffs/SKW-L1.md` — this handoff.

## Evidence base (read this increment)
- `seed-docs/SELF-DESCRIBING-RUNTIME-WIKI.md` (§6 ABI, §7 graph, §8 anchors, §11 gate, §23 phases, §26 proof).
- `omega-baseline/plugins/*/plugin.json` (24 manifests; `vivim-nlcl-pure/` has none).
- Deep reads: `vivim-nlcl`, `vivim-providers`, `vivim-mind` manifests.

## Key results
- Baseline contribution kinds = `engine` | `contract` | `schema`.
- `contentHash` empty in all deep-read manifests → source-anchor/content-digest binding UNMET.
- Dual port channel: `dependencies[]` (`ref:"contract:..."`) vs `capabilities.requested[]`
  (`"port:..."`); `vivim.mind` has non-empty `requested` but `dependencies: []` while
  `vivim.providers` mirrors both → drift risk.
- `prompt.send` (design's canonical example) has NO occurrence in any baseline plugin.json →
  CANDIDATE_SEMANTIC, not present in manifests.
- Engines declare no risk by kind (risk is Contract data) — DECLARED in `doc`, not enforced here.

## Open questions
1. Where (if anywhere) does a real `prompt.send` capability live in source? Needs an out-of-budget
   grep across `src/` and contracts, not just plugin.json.
2. Which channel is authoritative for consumed ports — `dependencies` or `capabilities.requested`?
   No manifest schema appears to reconcile them.
3. Is `contentHash` filled at build/install time outside baseline? Baseline store has it empty.
4. Which of the 21 unread manifests declare `surface`/`interaction`/`configuration` kinds relevant to
   §11 UI/config completeness?

## Downstream triggers
- VFX: consume taxonomy + graph fixture (section b/d) to prototype Reflection Graph assembly against
  real manifests; do not claim `prompt.send` exists until a source anchor is found.
- EXP: instantiate the §26 experiment (existing + synthetic `audio.volume.set` in
  `seed-docs/SEMANTIC-RUNTIME-LAB.md`) using LOCK-D-CANDIDATE as the parity baseline; measure §11
  completeness on synthetic plugin with zero Wiki files.
- RTE: treat `dependencies` vs `capabilities.requested` reconciliation and empty `contentHash` as
  blocking inputs for the Phase B content-hash-bound SourceAnchor and §24 core primitives.

## Constraints honored
Read-only source; <=8 tool calls; no repo/config writes; only the two mandated files created.
