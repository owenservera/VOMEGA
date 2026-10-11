# COCKPIT — the operator's instrument (full-stack web app, v0.2)

**Why it exists.** The program produces many files. The Cockpit makes the evidence legible and — more importantly — **re-verifies it independently of the agents that produced it**: it recomputes the ledger hash chain, checks claim levels against evidence, and reproduces selection from the evaluation inputs.

**Who builds it.** The **Controller**, not the arms, so arms never build the instrument that grades them. It grows each round and is a neutral utility in `consolidated/`.

**Independence of the re-verification.** The Cockpit's chain verifier, claim audit and selection reproduction must be **its own TypeScript implementations**. It must not import the pack's `.mjs` tools. A second implementation that agrees with the first is evidence; one implementation called twice is not. Agreement is proven against the conformance vectors (§5, K0), not assumed.

**Stack (assumed, verify in census):** Next.js (App Router) + TypeScript + Prisma + SQLite, run locally. If the template differs, keep the data model and routes, change the framework.

## 1. Data model (Prisma, SQLite)

```prisma
model Round        { id String @id            // "R0"
                     openedAt DateTime?; closedAt DateTime?; status String   // OPEN|CLOSED|ABORTED|FROZEN
                     isolation String; independence String; margin Float
                     label String?; oracleMode String?; selectionBasis String?; packTreeSha String?   // from CENSUS derived + MANIFEST_FROZEN body
                     arms Arm[]; evaluations Evaluation[]; selections Selection[]; gates Gate[]; incidents Incident[] }
model Arm          { id String @id            // "R1-A2"
                     roundId String; round Round @relation(fields:[roundId],references:[id])
                     track String; variant String; status String; isolationOk Boolean?
                     wallMinutes Float?; tokens Int?; locNonTest Int?; resultPath String?
                     claims Claim[]; evaluations Evaluation[] }
model Component   { id String @id; title String; evaluations Evaluation[]; selections Selection[] }
model Evaluation  { id Int @id @default(autoincrement())
                     roundId String; armId String; componentId String; blindId String
                     score Int; scoreMechanical Int?; testsPassed Boolean; acceptancePassed Int; acceptanceTotal Int
                     oraclePassed Int; oracleTotal Int; evidencePath String }
model Selection   { id Int @id @default(autoincrement())
                     roundId String; track String; componentId String
                     status String; winnerArmId String?; carry String; marginUsed Float; basis String; inputSha String?; reproduced Boolean }
model Claim       { id Int @id @default(autoincrement()); armId String; componentId String
                     statement String; level String; evidence String; evidenceExists Boolean; flagged Boolean }
model Learning    { id String @id             // "L-A-007"
                     track String; roundId String; statement String; kind String; status String
                     evidence String; revisitIf String; supersededBy String? }
model LedgerEvent { seq Int @id; ts DateTime; type String; roundId String; prev String; hash String; body String; chainOk Boolean }
model Gate        { id Int @id @default(autoincrement()); roundId String; name String; status String; ledgerSeq Int }
model Incident    { id Int @id @default(autoincrement()); roundId String; kind String; note String; ledgerSeq Int }
model CensusItem  { id Int @id @default(autoincrement()); roundId String; capability String; status String; evidencePath String; evidenceExists Boolean }
model FirstScreen { roundId String @id; json String; generatedAt DateTime }   // reports/R<n>-firstscreen.json, shown verbatim
```

## 2. Ingestion (`POST /api/ingest`)

Input: a workspace path (default `./omega-lab`). Reads, **never writes**, workspace files:
`ledger/ledger.jsonl`, `rounds/*/round-manifest.json`, `rounds/*/CENSUS.json`, `rounds/*/isolation-report.json`, `rounds/*/evaluation.json`, `rounds/*/selection.json`, `rounds/*/evals/*.json`, `evidence/**/ARM_RESULT.json`, `track-*/learnings.jsonl`, `reports/*-firstscreen.json`. **Evidence paths** in `ARM_RESULT.json` (`claims[].evidence`, `commands_run[].output_file`) are resolved against `evidence/R<n>/<arm>/` first, then the workspace root (`fixtures/EXPECTED.json` states this too).

Steps (idempotent; keyed by ids/seq):
1. **Chain verification** — recompute every event hash in TypeScript: `sha256(canon({seq,ts,type,prev,body}))`, `prev` of seq 1 = 64 zeros. `canon` = JSON with object keys sorted by the default JS sort (UTF-16 code units) at every depth, `undefined` members dropped, no whitespace, primitives via `JSON.stringify`. The verdict has exactly the shape of `ledger.mjs verify`: `{ok:true, head, count}` or `{ok:false, seq, reason: 'sequence gap'|'broken chain'|'hash mismatch', count, head_before_break}`, checked in that order per event. Mark `chainOk` per event. A torn tail (bytes after the last newline) is reported, not parsed.
2. **Claim audit** — for every claim at `LIVE_RUN` or `MEASURED`, check each evidence path exists under the workspace; set `evidenceExists`; `flagged = true` if any missing or none listed.
3. **Selection reproduction** — port `select()` (see `04_…` §4) to TS, recompute from `evaluation.json` with the **manifest's** `margin` and `selection_basis`, and compare `decisions` and `input_sha256` with `selection.json`; set `reproduced` per (track, component).
4. **Counts** — ledger event count equals ingested row count; mismatch ⇒ ingest fails with a visible error.
5. Return a summary `{events, chainOk, firstBreak, flaggedClaims, selectionsReproduced, selectionsMismatched}`.

## 3. API routes

| Route | Purpose |
|---|---|
| `POST /api/ingest` | as above |
| `GET /api/overview` | two-track scoreboard: per round and per component winner/status per track; cumulative score, LOC, overhead; labels for isolation/independence |
| `GET /api/rounds` · `GET /api/rounds/[id]` | round list; detail with arms, gates, incidents, census |
| `GET /api/arms/[id]` | arm detail: claims vs evidence status, evaluation rows, ECP usage |
| `GET /api/compare?round=` | side-by-side Track A vs Track B (**hidden until R6 unless `?force=1`**, mirroring the learnings-independence rule) |
| `GET /api/learnings?track=` | learning book with status filters; cross-track view only after R6 |
| `GET /api/ledger?verify=1` | event list and live chain verification result |
| `GET /api/audit` | flagged claims, tainted arms (with the report's finding kinds), unreproduced selections, degraded independence, any `SIMULATED` isolation, `SCRIPTED` Track B adapter, lint violations and integrity findings from `reports/*-firstscreen.json` |

## 4. Screens

1. **Overview** — two columns (Track A, Track B). The top banner shows the **first screen of the latest closed round verbatim** (label, isolation, independence, oracle mode, Track B hypothesis status). The Cockpit never recomputes or restyles those labels. Rows per component with status chips: SELECTED / TIE / SINGLE / NO_ELIGIBLE.
2. **Round** — manifest summary, gates timeline, arms table (variant, score, LOC, isolation OK, cost), incidents.
3. **Arm** — what the arm *claimed* vs what the evidence *shows* (green/red per claim), eval breakdown by criterion, its limitations.
4. **Learnings** — per track, filter by kind/status; each shows evidence links and `revisit_if`.
5. **Ledger** — table with a chain-integrity bar; clicking an event shows its body; a broken chain turns the page red with the first bad seq.
6. **Audit** — one page of everything that should make a reader distrust a number.
7. **Compare** (R6) — final blind comparison, with claim-level labels and an explicit "insufficient evidence" outcome if applicable.

Design rules: no chart without its claim-level label; no number without its source file link; unknown stays "unknown", never 0.

## 5. Acceptance tests (the Controller writes and runs these; results go to `cockpit/e2e-R<n>.txt`)

| ID | Test | Expected |
|---|---|---|
| K0 | Conformance: the TS `canon`, chain verifier and `select` against `fixtures/vectors/{canon,chain,select}.vectors.json` | Every case identical (strings, verdict objects, decisions, `input_sha256`); every `must_throw` case throws |
| K1 | Ingest `fixtures/sample-round/` (synthetic, labelled SAMPLE; generated by `make-sample.mjs fixtures`) | As in `fixtures/EXPECTED.json`: 18 events, chain OK, 1 flagged claim (R0-B2), 3 selections reproduced |
| K2 | Ingest `fixtures/sample-round-k2/` (one ledger body changed) | `{ok:false, seq:9, reason:'hash mismatch'}` and the same `head_before_break` as `EXPECTED.json`; Ledger page red; banner "ledger invalid" |
| K3 | Ingest `fixtures/sample-round-k3/` (evidence behind a LIVE_RUN claim deleted) | 2 flagged claims (R0-A1, R0-B2); Audit lists both |
| K4 | Ingest `fixtures/sample-round-k4/` (one score changed) | Selection `reproduced=false` for B·C1 only; Audit lists it |
| K5 | Ingest twice | No duplicate rows |
| K6 | `/api/compare` before R6 | 403 with explanation unless `force=1` |
| K7 | Cockpit chain verifier vs `node pack/team/tools/ledger.mjs verify` on the same ledgers (K1, K2) | Same verdict object and same head / head_before_break |
| K8 | Real R0 ledger | K7 holds; ingested count = ledger count |

E2E may be driven by HTTP-level tests (fetch against the running server) if no browser is available; the census records which was possible. A UI screenshot alone is not acceptance.

## 6. Out of scope

Authentication, multi-user, deployment, editing evidence through the UI, charts beyond simple bars/tables, any call to an external service.
