# VOMEGA-dev-machine — index

| Need | In git (`.project/dev-machine/windows-mirror/`) | In box mirror (`mirror-to-windows/VOMEGA-dev-machine/`) |
| --- | --- | --- |
| Pack overview | [README.md](README.md) | README.md |
| Desired-state spec | [desired-state.json](desired-state.json) | desired-state.json |
| Windows bootstrap / verify / press-go | `*.ps1` | `*.ps1` |
| Process (roles as functions, safe defaults, escalation) | [../PROCESS.md](../PROCESS.md) | `process/PROCESS.md` (snapshot) |
| Architecture | [../ARCHITECTURE.md](../ARCHITECTURE.md) | `process/ARCHITECTURE.md` |
| Harness matrix | [../HARNESS-MATRIX.md](../HARNESS-MATRIX.md) | `process/HARNESS-MATRIX.md` |
| Lane dispatch procedure | [../META-WORKSTREAM-DISPATCH.md](../META-WORKSTREAM-DISPATCH.md) | `process/META-WORKSTREAM-DISPATCH.md` |
| Linux / Windows parity | [../WINDOWS-PARITY.md](../WINDOWS-PARITY.md) | `process/WINDOWS-PARITY.md` |
| Run ledger schema | [../RUN-LOG-SCHEMA.md](../RUN-LOG-SCHEMA.md) | `process/RUN-LOG-SCHEMA.md` |
| Task templates | [../templates/](../templates/) | `process/templates/` |

Refresh from the box: `.project/dev-machine/sync-windows-mirror.sh`. It copies box mirror → git snapshot and repo process docs → `process/`.
