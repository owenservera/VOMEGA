# ECP v0.2 kernel (Claude architect submission)

**Claim level: `SIMULATED_TEST`.** Real Git, real fsync'd journal, real file locks, *scripted* model adapters. No AI provider is called. No product code is written. Passing these tests proves the kernel's contracts hold against scripted behaviour; it does **not** prove any live model will behave this way.

Node ≥ 20, standard library only. From the pack root:

```
node --test outputs/claude/kernel/kernel.test.mjs   # 32 fault-oracle tests (names start with FAULT_MATRIX ids)
node outputs/claude/kernel/demo.mjs                 # regenerates outputs/claude/traces/*.trace.txt
```

On Windows (PowerShell 7) the same commands work with backslashes. `git` must be on `PATH`. Status: **run on Linux (Node 22.22, Git 2.43) only; not yet run on Windows.**

## Files

| File | Responsibility | Lines (approx.) |
|---|---|---|
| `util.mjs` | canonical JSON, path policy, heuristic secret scan, glob matching | 60 |
| `journal.mjs` | per-arm append-only JSONL, SHA-256 hash chain, fsync per append, torn-tail recovery, cross-process lock | 75 |
| `git.mjs` | read-only Git via argument arrays; `applyCheck` uses a throwaway index, never a worktree | 65 |
| `capsule.mjs` | capsule build from **commit blobs**, wrapper-computed basis/staleness, citation verification, calibration | 95 |
| `escrow.mjs` | Elephant patch validation (allowlist, protected paths, binary/mode/rename/secret) and immutable storage | 40 |
| `kernel.mjs` | the switchboard: validate → dedupe → route → stamp → dispatch → re-stamp → verify → aggregate → journal; epoch guard; rotation; isolation probe | 350 |
| `adapters.mjs` | `ScriptedAdapter` for FORK / PREFIX / APPEND session modes (simulation only) | 35 |
| `fixture.mjs` | deterministic Prompt Fanout Mini-shaped Git repo and E2 manifests | 70 |
| `kernel.test.mjs` | fault oracles F01–F31 plus one E1 happy-path test | 460 |
| `demo.mjs` | the six event traces used in `ARCHITECTURE.md` §9 | 110 |

## The adapter seam (what a real harness adapter must implement)

```js
consult({ node, envelope, signal }) -> { findings[], not_examined[], patch?, notes?, usage? }   // throws on failure
calibrate({ question, id })         -> string
probe({ question })                 -> string
cancel(requestId)                   -> 'confirmed' | 'attempted' | 'unsupported'
```

`envelope.untrusted_artifacts` must be rendered to the model inside a quoted data block, never concatenated as instructions. `envelope.txn_canary` must be included in the prompt (it is how isolation is probed). See `ECP_SPEC.md` §9.

## What is deliberately NOT here

A worker-facing CLI and file-queue transport (`BUILD_SEQUENCE.md` S1), any real adapter, tokenizer-accurate budgets (bytes are used), OS-level read-only enforcement, notes promotion, the ROI router, Windows-specific path case folding (fault F35, open). Each is listed in `FAULT_MATRIX.md` or `BUILD_SEQUENCE.md` with its status.
