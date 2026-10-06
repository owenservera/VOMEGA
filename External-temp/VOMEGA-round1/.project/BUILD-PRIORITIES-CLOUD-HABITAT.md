# Build priorities — cloud habitat adaptation (Round 1)

Recorded 2026-10-06 by the first cloud-habitat session ("Super Z", GLM agent).

This document adapts the documented VOMEGA operating protocol to a new
development habitat and states the current build priorities for it. It is an
operational claim under the authority ladder (layer 4): coordination evidence,
not architecture, not law.

## What this habitat is

A Linux cloud sandbox with a single externally visible web port behind a
gateway. Observed substrate, 2026-10-06:

| Capability | Observed | Notes |
| --- | --- | --- |
| OS | Linux (Debian family) | no Windows shell; `scripts/omega.ps1` unusable here |
| Bun | 1.3.14 | runs `omega:setup` / `omega:quick` / plugins and surfaces unmodified |
| Node | v24.21.0 | present; not needed by the quick slice |
| Git | 2.47.3 | clean clone of `owenservera/VOMEGA` at `6de8768` == `origin/main` |
| Web preview | one gateway port; cross-port via `?XTransformPort=` query | matches the Ω13 console's documented `/?EIO=` gateway shim |
| Local harnesses | none of ZCode / Codex / Claude Code / Daintree | agent work runs in-session; bounded subagents replace worker fan-out |

Auth, provider and model configuration: none exists here and none was added.
The standing owner constraint (read-only auth/provider/model configuration) is
trivially honored.

## Baseline proof reproduced in this habitat

| Claim | Result | Date |
| --- | --- | --- |
| `omega:quick` (7 files) | 62 pass / 0 fail / 1,622 assertions — identical to the recorded Windows Bun 1.4.2 run | 2026-10-06 |
| `bun test plugins/vivim-nlcl` (release USE corpus) | 49 pass / 0 fail | 2026-10-06 |
| Ω13 console service boots (`surfaces/web/src/server.ts`) | health OK, world seeded, `/api/interpret` returns full deterministic IR with slots, confidence, alternatives and suggestions; `/api/execute` returns governed outcome with consent gates | 2026-10-06 |

No product source was modified to achieve any of the above. The only local
step required was a clean `bun install --frozen-lockfile`; a partially
completed install reproduces one misleading `ENOENT` against
`sdk/node_modules/zod` (isolated-linker layout), which resolves on a clean
install. Treat "tests fail with ENOENT under `sdk/node_modules`" as an
environment symptom, not a product defect.

## Protocol adaptation (documented → this habitat)

| Documented practice | Adaptation here |
| --- | --- |
| `scripts/omega.ps1` launcher | documented Bun commands run directly (`omega:setup`, `omega:quick`, `omega:cli`) |
| ZCode/Daintree bounded worker fan-out | bounded in-session subagents with the same claim/evidence/review discipline; fan-out stays capacity-driven |
| Daintree Review Hub / independent reviewer | independent subagent review before any product-code commit; documentation-only commits follow the meta-coherence precedent |
| Local Windows command box previews | the sandbox web gateway serving the Ω13 console (its shim already targets this exact gateway pattern) |
| `.local/` evidence logs | same rule: raw logs stay uncommitted; sanitized summaries land in `.project/` |

## First build priorities (this habitat)

Ordered by evidence leverage, consistent with SITREP convergence (semantic
simulator / product-twin path first; no live provider work without the TRU-05
consent envelope):

1. **P0 — reproduce the recorded proof here** (done; table above). A habitat
   that cannot reproduce `omega:quick` cannot claim anything else.
2. **P1 — make the proven local slice user-visible.** Productize the Ω13
   console into the two-section web surface the owner asked for:
   - **Mission control** (project management): SITREP orientation, proof
     status, launch lanes, roadmap, build priorities and commit truth — read
     from `.project/` and Git at request time so the UI cannot drift from
     repository truth.
   - **Live console** (demos): the semantic command box as a web twin —
     natural language → deterministic interpretation (IR, slots, confidence,
     alternatives, suggestions) → governed execution → consent decisions →
     world/journal, all served by the real console service, not a mock.
   - **Truth labeling:** every demo surface states what is proven
     (verified-local, simulated provider transport) and what does not exist
     (live provider evidence, Account binding, `prompt.send`). Fixture and
     simulated results are never reported as live — `seed-docs/PROOF-AND-MATURITY.md`.
3. **P2 — keep `.project` truth current while working** (this document,
   `agentic-launch/STATUS.md`, `COMMONS.md`, `ENVIRONMENT.md`).
4. **P3 — next-round code candidates**, in the order SITREP/STATUS name them,
   each claimed bounded before work and independently reviewed after:
   - fix or pin the CMD-06 validator false-READY defect (corpus `U1`);
   - materialize world fixtures W1–W6 with a source-tagged loader (SDW next gate);
   - resolve Account `defaultFor` vs world `defaults` precedence;
   - simulated `prompt.send` capability registration path (product twin first — no live send);
   - `contentHash` anchoring for the 24 manifests (SKW/Lock D blocker).

## Non-goals for this round

- No live provider/browser evidence, no auth/credential work, no new
  subscriptions or harness installs.
- No attempt to restore the historical broad suite (`omega:test` blockers stay
  visible, not silently skipped).
- No freezing of any Lock, lane, milestone or model routing.
- Do not replay the first wave; new slices come from current evidence.

## Round deliverable

The owner asked for the full repository as a Git bundle at the end of each
round, downloadable from the web surface. Round 1 ships
`VOMEGA-round1.bundle` (created from this repo's `main`) via the mission
control section.
