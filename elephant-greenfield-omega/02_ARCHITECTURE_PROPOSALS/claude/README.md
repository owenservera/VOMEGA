# Claude — Independent Elephant Architecture Proposal (ECP v0.2)

**Status: actual received submission, 2026-10-11.** This is the substantive Claude-authored architecture extracted from the user-supplied `greenfield-omega-team-pack-v0.2.zip`. It supersedes the earlier **NOT SUBMITTED** placeholder. Its evidence level is **DESIGN + locally simulated mechanical tests**; the ZIP and the tests do not establish a real Z.ai model run, independent child agents, prompt-token economics, or faster accepted software development.

## Architectural claim

An Elephant is a **deterministic source capsule + model adapter + externally maintained source/epoch ledger**, not an immortal chat. Stateless fresh invocation/cached prefix is the default; a long-lived append session is a competing experiment, not required for identity. The wrapper verifies source quote anchors against Git, rejects significant stale contracts at dispatch and result use, keeps source/write authority separated, records durable hash-chain events, and carries separate disagreements rather than manufacturing consensus. See `ARCHITECTURE.md`, `ECP_SPEC.md`, `FLUSH_RECOVERY.md`, `WRITING_AND_TRUTH.md`, `TRADEOFFS.md`, `FAULT_MATRIX.md`, and the evidence-focused `EXPERIMENT.md`.

## Architecture-contained artifacts

The folder contains Claude's source-preserved architecture documents, proposal schemata, six simulated event traces, and its small kernel prototype. The kernel belongs here because it is a directly executable **architecture claim/proof-of-mechanics**, not a generic Z.ai team-management protocol. It stays clearly marked as local simulation. Original paths inside source files refer to `outputs/claude/`; when running this relocated version, use this directory as your working package root (with Node 20+); the `kernel/` relative modules are preserved. The original source manifest is retained in `SOURCE_MANIFEST_FROM_ARCHIVE.json` for forensic comparison; it is **not** a current-path Git manifest.

The `BUILD_SEQUENCE.md` development plan, Z.ai team protocol, toolchain, controller instructions, scoring, sealed oracles, fixtures, and role prompts deliberately **do NOT live here**. They are under `../../03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/`. Architecture-critical ECP message/lifecycle, source citation, and trust-boundary protocols correctly remain here.

## Provenance and verification

- Uploaded source: `greenfield-omega-team-pack-v0.2.zip`, original SHA-256 recorded in the development import report.
- Original source locus: `elephant-greenfield-omega/outputs/claude/`.
- Full independent Claude proposal identity: `claude-ecp-0.2-capsule-first` (`submission.json`).
- Locally executed source tests (Node 22.16.0, Linux sandbox): **32 passed, 0 failed**, using `node --test outputs/claude/kernel/kernel.test.mjs` from the source package root.
- **Source manifest defect:** of 33 `outputs/claude/MANIFEST.json` listed entries, 32 match hashes; `outputs/claude/kernel/journal.mjs` does not match its listed SHA. Preserve the mismatch as an integrity issue; do not assert a clean original architecture manifest. The independent team tooling manifest had 146 matching entries, but it proves only file integrity, not runtime agent operations.
- Live Claude/Z.ai session runs: **not verified**. No speedup or provider-cache claim is demonstrated.

## Next step

Use the dedicated Claude Z.ai project charter in `../../03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/` when launching a fresh independent full Z.ai session. This is NOT the same as the unrestricted existing general Z.ai lab. Give it the neutral `00_CORE_BASELINE`, mandatory `01_EXPECTED_OUTPUTS`, and this proposal alone; publish **all packs after every development turn**, including immature and failed entries.
