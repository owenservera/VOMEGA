# team/oracle/ — sealed hidden oracles

These files are **ciphertext**. They are authored outside the run, sealed with AES-256-GCM (header as AAD) and are decrypted only in turn B, after `GATE ARMS_SEALED`, with a key the **human** supplies (`unseal <C> <key>`). The keys are not in this pack. Never guess or derive one. Once unsealed, an oracle is **burned**: it becomes public regression for later rounds, and a fresh sealed oracle is needed for any new MEASURED claim.

| File | sha256 | key fingerprint | ciphertext bytes |
|---|---|---|---|
| `C1.oracle.sealed` | `218bcbdab5ca78408ed7dc38233fa9c87f684a641fa2db5e52c6b5af0183cb8a` | `f69a4b694110a343` | 16461 |
| `C3.oracle.sealed` | `debf754516ba9498ec4f638990485badd1486f159edd307696e12d09c4427fc9` | `70cf89d7fbfc7e2e` | 16213 |

Check without a key: `node team/tools/seal.mjs info team/oracle/C1.oracle.sealed`. Unseal: `node team/tools/seal.mjs unseal <file> <outdir> --key <key>`.

## How the oracles were validated (owner-side, DESIGN → LIVE_RUN)

Each oracle was run against an owner-written reference implementation and against deliberately wrong mutants. The reference implementations, mutants and plaintext oracles are **not** in this pack.

| Component | Reference: acceptance / oracle | Mutants | Killed by public acceptance | Killed only by the hidden oracle | Survived |
|---|---|---:|---:|---:|---:|
| C1 command core | 16/16 · 21/21 | 20 | 6 | 14 | 0 |
| C3 event journal | 12/12 · 23/23 | 18 | 1 | 17 | 0 |

Meaning: the hidden oracle adds discriminating power beyond the public acceptance suite. A mutant that passes acceptance but fails the oracle is exactly what an arm that "teaches to the test" would ship.

Limit: the mutant list is the owner's imagination of likely bugs. Zero survivors shows the oracle catches those, not that it catches all defects (`SPECULATION` beyond them).

## Isolation of the oracle

`isolation.mjs report … --oracle <dir>` scans every arm for `ORACLE-MARKER-…` strings from the unsealed oracle. A hit taints that arm (`ORACLE_COPY`). The oracle-unsealed directory lives under `controller/`, never in `pack/` or an arm.
