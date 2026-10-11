# General Z.ai Lab — Fresh Round 0 Submission (2026-10-11)

**Status:** Uploaded workspace inspected; custody metadata committed. **Full source/evidence payload is not yet in this GitHub folder.** Do not interpret this index as a completed pack publication.

## Origin
- Uploaded archive: `workspace-746b5155-7dcf-4ae9-a8d8-d74162f00e50 (1).tar`
- SHA-256: `2b9f6cb22842f4a4fa02f6477de93858163b78500afd73caeba43eaec8dfbd16`
- Exported workspace's Git HEAD: `7709a31bb01f50e86997e173be6a01ec82ee9440` (not VOMEGA main).
- VOMEGA seed cited by submission: `98e413746afda5fa0190cbdb2684197c2b9cf24a`.
- Controller session: `web-43af1e84-871b-4be6-8f3c-e82ffa673257`.

## Evidence inventory from the uploaded archive
- `elephant-lab/BASELINE/READ-MANIFEST.md` and hash-verified 23-document frozen baseline.
- `elephant-lab/experiments/round0/PREREGISTRATION.md`: four preregistered arms A1/A2/B1/B2.
- `elephant-lab/workspaces/A1/`: isolation prover, canaries, overlap tests and negative controls.
- `elephant-lab/workspaces/A2/`: hash-chained ledger and recovery verification.
- `elephant-lab/workspaces/B1/`: source epoch, staleness, source-grounded consult and negative findings.
- `elephant-lab/workspaces/B2/fanout-core/`: typed fanout mini-product with verification tests.
- `elephant-lab/packs/PACK-REGISTRY.json`: complete 11-pack inventory, with experimental maturity labels.
- `elephant-lab/publications/TURN-001/TURN-001.md`: first-turn release staged by Z.ai; expressly flagged REMOTE_UNPUBLISHED in its original environment.
- Evidence includes controller verification, screenshots, per-arm tests, an unresolved B1 negative, and reported usage with unknown controller tokens.

## Trust and integration
Claims above describe *submitted artifacts*, not independent reruns by this importer. The submitted source is not integrated into Ω runtime. Keep experimental output under this lab, compare against other arms, and publish source/test payload separately before claiming a full release. Avoid importing `.git`, `.env`, `db` or runtime caches.
