# Importing the submitted Round 0 / Initial Lab Workspaces

The three submission README records under `general-zai-lab/submissions/` and `proposal-specific/claude-zai/submissions/` are **custody records, not claims that the entire original workspace is in GitHub**.

The originals include embedded Git history, a `.env` file, database state, generated build material, and an independent Next.js application. Do **not** extract those workspaces over the VOMEGA checkout or rewrite VOMEGA's `main` with their original commits.

## Prepared sanitized source bundles (available from the associated ChatGPT handoff)

| Bundle | Files | SHA-256 |
| --- | ---: | --- |
| `general-fresh-turn001.tar.gz` | 158 | `64ab4369e26b49dcbd4575b3b739c4761f1534ebb9019fd96f01d82b2df12ebf` |
| `general-round0-to-round1.tar.gz` | 575 | `daec5e088c714798413fc53cfbacfe2f9acbb7981737d51bcaf37fe27e0f7718` |
| `claude-ecp-turns1-2.tar.gz` | 173 | `b188cc9bdfc5ad9cdefb63b9d446d34a2db36c8c81914fae7c541f99ea82be7b` |

Each bundle contains a `TRANSFER-MANIFEST.json` listing the original paths and SHA-256 of all retained files. It excludes private environment state, Git internals, duplicate source snapshots and detected secret-bearing material. This intentionally does **not** preserve a runnable copy of the original hosted environment.

**Selected evidence capsules** were also prepared separately to support quick evaluation, but do not replace the full sanitized bundle.

## Placement

All files must remain below their own `artifacts/` subtree:

- `general-zai-lab/submissions/2026-10-11-fresh-round0/artifacts/`
- `general-zai-lab/submissions/2026-10-11-r0-r1-continuing/artifacts/`
- `proposal-specific/claude-zai/submissions/2026-10-11-turns1-2/artifacts/`

Archive-internal paths are relative to the respective `artifacts/` subtree. Their included `src/` trees are hosted *experiment UI source*, not VOMEGA production source. Never overwrite the actual `omega-baseline/`, `.project/` or `src/` in repository root.

## Preservation versus adoption

A lab pack being archived does not mean its claims are verified, merged, independently reproduced or product-approved. Preserve submitted maturity labels and negative findings; verify before reuse. Independent evaluation of functionality happens after exact source preservation.

Use the accompanying `import_round0_to_vomega.py` tool from the ChatGPT handoff on a **clean local main**. By default it performs a dry run; `--apply --push` is an explicit safe, non-force push. If remote main advances, re-fetch and re-run; do not force update.
