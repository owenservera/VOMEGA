# Claude v0.2 Upload Import Report

**Original archive:** `greenfield-omega-team-pack-v0.2.zip`

**SHA-256:** `555078ed3cd76b75558e809fa662e24b30ccb0b491d85f6b72833953bc1faba2`

**Original submission date claim:** 2026-10-11 (from source; exact author-session clock unverified).

**Layout:** Architecture ECP v0.2 in `02_ARCHITECTURE_PROPOSALS/claude/`; Z.ai/team process and runner in `03_DEVELOPMENT_SYSTEMS/proposal-specific/claude-zai/runtime/pack/`. Both are relocated from source paths without changing the original source contents. The development runtime contains a duplicate of the architecture reference code strictly to preserve its original internal import paths (`team/tools/consult.mjs` imports from `../../outputs/claude/kernel`).

**Integrity:** source `team/TEAM-MANIFEST.json` matches all 146 listed file hashes; source `outputs/claude/MANIFEST.json` matches 32/33 listed hashes. Mismatches: `[{"path": "outputs/claude/kernel/journal.mjs", "expected": "cc353e21557401f536271578a0a0f427abce3f14f1ae1f218fe6baf945e0c3b3", "actual": "4616bc78ff06882e209a76d905400a4804acac72610835ac544219429b810bcb"}]`. The source PACK-MANIFEST is retained for historical attribution but describes the larger original ZIP; do not use it as a current relocation manifest.

**Live tests performed in isolated Linux working copy, Node 22.16.0, 2026-10-11:** 32/32 architecture kernel tests pass; 29/29 team process tests pass. These are scripted mechanical tests, not real Z.ai child sessions or accepted software throughput.

**Missing dependency:** owner-only oracle decryption keys are intentionally not in ZIP, so original two-turn human-unseal branch is BLOCKED until actual owner key(s) or independent fresh holdouts exist.

**Archived materials:** all original `team/` files including synthetic fixtures and ciphertext oracles retained; original README and machine submission kept as architectural provenance, author-specific BUILD_SEQUENCE preserved on development side.

**Targeted shared reuse:** see `03_DEVELOPMENT_SYSTEMS/SHARED_EVIDENCE_PRACTICES_FROM_CLAUDE.md` and this directory's `ASSESSMENT_AND_MIGRATION.md`.

**No live agents started** by this import. The new `claude-zai` folder is a launchable isolated proposal-specific development candidate, not evidence of running session.
