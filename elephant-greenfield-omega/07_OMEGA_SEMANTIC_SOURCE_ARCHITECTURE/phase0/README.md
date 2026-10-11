# Ω Semantic SDK · Phase 0 integration lab


## Three-tool development loop — installed v0.1.1

[Ω Live Lab · Experiment Runner · Change Lab](devtools/README.md) is an additive Phase 0 extension with complete [PRD / benchmark definitions](devtools/PRD_AND_DESIGN.md), [implementation and local test evidence](devtools/EVIDENCE.md), and [source/tests](devtools/). Start from this directory with `python -m devtools.app --port 8770` or `./devtools/run.ps1` on Windows, then open http://127.0.0.1:8770. This is local MOCK-ONLY; the existing interpreter/approval gate remains authoritative. Eight unit tests passed with the original Run A engine through a test adapter, and a local HTTP smoke used that adapter; fully integrated Phase 0 HTTP/visual/Windows execution has not been independently rerun. Five Z.ai prompts are still provisional.

**EXPERIMENTAL / MOCK ONLY.** A runnable local slice built from the exact operator archive. No real provider integration, prompt submission or account configuration changes. Five-computer prompts remain **NOT_FROZEN**.

## Start

Python 3.10+ standard library only; no package installation needed. From this directory:

```sh
python3 lab.py verify
python3 lab.py demo
```

Open `http://127.0.0.1:8765`. Type `ask claude work to explain this error`, inspect the reading, and press **Confirm mock action**. A server-validated mock receipt appears. Try `ask claude to hello` to choose an account, or `tell chatgpt personal account balance please` to inspect competing meanings. An unresolved interpretation has no executable preview.

Windows PowerShell:

```powershell
& .\run.ps1 verify
& .\run.ps1 demo
# Optional install to a fresh local directory, with verification:
& .\setup.ps1
```

Windows execution is **NOT_RUN** in this Linux environment. `setup.ps1` copies the bounded lab to LocalAppData; it does not install Python, alter PATH, configure providers, register startup tasks or overwrite an existing installation. Keep the console running for the demo; Ctrl+C stops it. State is ephemeral and isolated per server process.

The browser client is TypeScript over a **Python semantic bridge**, not a TS core port. `web/app.js` is checked in. Optional rebuild: `node build-web.mjs` with Node 22.13+; this strips types, not a typecheck. `node canonical-check.mjs` independently checks JavaScript/Python canonical hashes. No Node dependency is needed to run the demo.

## Actual results

The reproducible logs are in `evidence/`; use `python lab.py status` for current source freshness and counts. Measured on the recorded Linux/Python environment:

| Check | Result |
|---|---:|
| Frozen fixture corpus, original Run A | 39 / 39 |
| Original Run A READY round trips | 140 / 140 |
| Source-derived reachable states | 417 |
| Generated frozen utterances | 20,556 |
| Generated extra hostile utterances | 49,545 |
| Total generated utterances | 70,101 |
| Run A extra mismatches | 803 |
| Of those, wrong-but-READY | 758 |
| Wrong-but-READY without ambiguity flag, this generated set | 0 |
| Run B wrong-but-READY, frozen / extra | 2,440 / 10,757 |
| Reference response candidate | 179 / 179 public vectors |
| Rechecksummed candidate missing consequence | FAIL, as required |
| Gate + real loopback HTTP test methods | 25 passing |

Run B also passes its own initial 39-case/140-command scorer. The cross-test uses **Run A's grammar-generated cohort**, so it is not an unbiased competition or a B1 victory. The original scorer counts 803 mismatches across statuses; only 758 are READY. Raw witnesses remain in `goldens/false-ready-regressions.jsonl.gz`. Wrong parser output is not a dispatched effect.

## What is implemented

- Immutable selected Run A and Run B source, byte-matched to the archive manifest. The archive and historical patches remain in operator custody; patches were not applied.
- Actual baseline replay. Run B's missing fixture is copied into `.replay/runB/`, never its vendor source.
- 179 public vectors, all 417 observed states and a compressed 70,101-row generated comparison, with checksums and provenance.
- `oracle.py` independently spells out six fixture-specific READY meanings; `checker.py` imports neither author implementation. Non-READY renderings are **source-derived**, not independently certified.
- Trusted mock preview / explicit choice / authorization / dispatch, including source, input, display, target account/session, policy and expiry bindings. Semantic digest and opaque execution permit are separate.
- Real HTTP acceptance, replay, stale-input, CSRF and host tests. Runtime negative tests assert no new receipt on each rejected attempt; concurrent replay yields one receipt.
- Data-only candidate intake, independent scoring and corruption witnesses. It never runs candidate installation or evaluation commands.

## Evaluation and benchmark entry points

```sh
python checker.py
node canonical-check.mjs
python evaluator.py candidates/reference --output evidence/candidate-reference.json
python lab.py B1
python lab.py B2
python lab.py B3
python lab.py B4
```

Each B1–B4 entry writes an explicit **NOT_RUN** record with missing prerequisites. Original benchmark scaffolds are preserved under `vendor/benchmarks/`. No external provider arm was run.

`python lab.py candidate` regenerates an actual Run A response bundle, evaluates it and evaluates a rechecksummed bad variant. Candidate `PASS/ACCEPT` means only public response conformance. Arbitrary candidate execution is **BLOCKED_NO_ISOLATED_RUNNER**; do not run a submitted `run_commands` value on a trusted machine. An independent computer may export responses and use this intake path, but their self-report is never execution proof.

## Limits and next work

- Browser assets are served and JavaScript syntax checked. **Visual rendering/browser interaction NOT_VERIFIED:** Playwright's browser binary was absent and download produced an invalid archive. HTTP tests are not browser tests.
- No human comprehension trial, blinded holdout evaluation, TS core equivalence, full declarative extensibility, or B1–B4 competition. These are not represented as passed.
- Partial single-account choices work when all other required fields are present. Partial fanout needs a clearer new input. Account registration can be interpreted but is never executable in this read-only-config lab.
- Dispatch uses the original parser plus a fixture-specific independent validator. It does not prove semantic correctness for unrestricted language. Source traces preserve author spans where present; complete per-field provenance is unfinished.
- NFC strings only; control, format (including bidi), surrogate characters, non-ASCII JSON keys, floats and unsafe integers are rejected. Confusables are not generally detected. No normalization silently rewrites a payload.
- The server trusts its local frontend and host. It binds what the frontend submits as shown text; it cannot prove that a human saw a pixel or resist a compromised local browser/OS. In-memory one-use permits are not a durable distributed execution system.
- Resource budgets, persistence, private candidate isolation and sealed evaluator custody remain open. Model tokens, monetary cost and human readability are UNKNOWN.

Read `INTERFACE_V1.md`, `DECISIONS.md`, `HOLDOUT_PROTOCOL.md`, and `PHASE0_OPPORTUNITY_MAP.md`. The latter recommends five next experiments; it does not finalize or launch the five master prompts.

## Reproducibility and publication

`SOURCE_MANIFEST.json` inventories every original archive entry and records the archive SHA. `goldens/manifest.json` binds the generated files. `PUBLICATION.json` enumerates all packs, including blocked work, with file hashes. The original archive is not republished wholesale. Selected original files have no supplied upstream license; no license was invented or attached to them.

`verify` regenerates timing logs and artifacts; timings vary. Deterministic corpus hashes can be compared across clean runs. A source change requires restarting the server and regenerating evidence. No frozen fixture or global DNA policy is changed.
