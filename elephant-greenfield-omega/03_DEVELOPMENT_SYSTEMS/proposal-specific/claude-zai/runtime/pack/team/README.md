# team/ — turn-based two-track program (dogfooding the Ω Elephant pack), v0.2

**Start:** paste `ZAI_FIRST_PROMPT.txt` (repo root; identical text to `00_START_PROMPT_ZAI.md`, enforced by test P3) into the z.ai agent and attach the zip. Round 0 is **two turns**: turn A stops at `AWAITING ORACLE KEY`; you then send `unseal C1 <key>` (and `unseal C3 <key>` if asked) and turn B finishes the round. Keys come from `OWNER_ONLY_ORACLE_KEYS.txt`, which is **never** attached.

| File / dir | What it is |
|---|---|
| `00_START_PROMPT_ZAI.md` | The starting prompt |
| `01_TEAM_CHARTER.md` | Why, the two tracks, roles, principles |
| `02_ROUND_PROTOCOL.md` | Two-turn round pipeline, gates, budgets, incidents, roadmap R0–R6 |
| `03_ARMS_AND_ISOLATION.md` | Arm layout/rules, derived isolation levels, provision→plant→snapshot→step fence, blind spots, Track B consult harness |
| `04_EVALUATION_AND_SELECTION.md` | Mechanical-first rubric, blinding, margin selection, assimilation, learnings, R6 pre-registered comparison |
| `05_TRACKS_AND_COMPONENTS.md` | Track A vs B, components C1–C8 |
| `06_COCKPIT_APP_SPEC.md` | Operator app: independent re-implementation of canon/chain/select, conformance vectors (K0), acceptance K1–K8 |
| `07_DOGFOOD_BINDING.md` | ECP mechanism → team mapping, drills D1–D9 |
| `08_CLOSURE_REPORT_TEMPLATE.md` | Closure format; first screen pasted verbatim from `round.mjs check` |
| `contracts/` | C1 command core, C3 event journal (what "correct" means) |
| `acceptance/` | Public frozen acceptance tests (C1: 16, C3: 12) |
| `oracle/` | **Sealed** hidden oracles (ciphertext only); see its README |
| `templates/` | Arm brief, evaluator, master, controller prompts; R0 manifest template |
| `schemas/` | round-manifest, arm-result, eval, ledger-event, learning |
| `tools/` | See below |
| `fixtures/` | Generated sample round, K2–K4 variants, `EXPECTED.json`, conformance vectors |
| `CHANGELOG.md` | v0.1 → v0.2 defects, reproductions, fixes |

## Tools (Node ≥ 20, no dependencies)

| Tool | Purpose |
|---|---|
| `ledger.mjs` | hash-chained team ledger: `init`, `emit`, read-only `verify`/`show`, `lint` |
| `census.mjs` | capability probe, nonce/overlap/persistence tests, **derive** labels from evidence |
| `round.mjs` | `order` (Williams), `tree-hash`, `freeze`, `seal-arms`, `status`, `check` (+ `--closure`) |
| `isolation.mjs` | `plant`, `scan`, `fence snapshot/step/check`, `report [--oracle]` |
| `seal.mjs` | seal/unseal/info for oracles (AES-256-GCM) |
| `evalkit.mjs` | `commit-probes`, `stage` (blind), `run`, `commit`, `join` (+ evidence audit), `loc` |
| `select.mjs` | deterministic margin selection from the frozen manifest |
| `consult.mjs` | Track B consult harness over the ECP kernel (arm-side only) |
| `validate.mjs` | JSON Schema subset validator |
| `make-sample.mjs` | regenerates fixtures and conformance vectors |

## Verify

```
node --test team/tools/team.test.mjs    # 28 tests
node --test team/tools/e2e.test.mjs     # full-round CLI test
node --test outputs/claude/kernel/*.test.mjs
```

## Claim levels

The tools are `SIMULATED`/`LIVE_RUN` evidence of **mechanics** only. They do not prove that any agent was isolated or independent; the census-derived labels do that, case by case. Under SIMULATED isolation, DEGRADED independence or a SCRIPTED adapter, a round is a **PROCESS REHEARSAL** and Track B's cognitive hypothesis is untested.

Dependencies: `tools/lib/` holds vendored copies of the kernel's `journal.mjs`/`util.mjs` (drift is tested, P1).
