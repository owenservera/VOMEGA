# R1AB combined intake — source/custody status

**Date:** 2026-10-11 · **Authority:** provisional research record.

## Items received in the conversation

- R0: initial semantic architecture/design seed package; original archive preserved in the local handoff ZIP.
- R1A: grammar-first executable prototype and replay outputs; preserved in the local handoff ZIP.
- R1AB: `OMEGA_CONTEXT_PACK_v2.md`, superseding RUN_B_CONTEXT_PACK v1; includes Run A and Run B design/results synthesis, fixture and ΩSL-mini grammar text, and T1–T4 next research tasks.

**Frozen fixture reported:** `omega-core-fixture-v1`; SHA-256 `16e242c5f56cc1015d51279320d6015de9e871a8ab88b1cc2de1c3f633ec4b7f`. No cohort rewrite is authorized.

## Findings and qualification

- **Run A:** grammar-first, bidirectional say/hear templates, derivation tracing and Plain Reading; earlier work reports replay on Python. No code from that package has been committed under this R&D path by this staging commit.
- **Run B:** search-first exploration; new context pack reports 2,440 wrong-and-READY parses over 20,556 frozen utterances and 10,757 over 49,545 hostile utterances; these are *author-reported cross-test figures*, not independently replayed here.
- **Merge disposition:** Run A as experimental base; retain Run B optimization/search ideas as challengers. Neither is approved for production execution.
- **Critical gate:** a status of READY with known alternative parses must NOT result in execution solely because ambiguity was logged. Runtime binding needs fixture/declaration/environment revisions plus authorization and consent checks.

## Important non-claims

This staging commit does NOT import the complete 88-file R1AB ZIP, certify code, reproduce Run B, run a new lab session, publish every pack, or amend the parent Ω MVP product north star.

Source material must be staged in immutable `intake/` and separately reviewed before promotion to `sdk/`. Preserve original bytes and their hashes; do not upload sensitive/private archives by default.
