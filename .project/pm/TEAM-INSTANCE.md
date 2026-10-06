# ZCode PM Team — Instance

Status: **ACTIVE (recon wave)** — this is the concrete instantiation of the charter in
[ZCODE-PM-TEAM.md](ZCODE-PM-TEAM.md). The charter owns the *functions*; this file records
*how those functions are actually staffed, bounded and coordinated right now*.

Claimed: 2026-10-06 · Source HEAD at claim: `93075cf` (local == `origin/main`, tree clean)
Claim surface: `.project/agentic-launch/STATUS.md` §"PM roadmap-system claim", `.project/COMMONS.md`.

This is development machinery, not Ω product architecture. It claims no D1 / roadmap task and
touches no auth, provider or model configuration.

## 1. Measured reality at startup (not assumed from seed docs)

| Fact | Value | How measured |
| --- | --- | --- |
| Repo HEAD | `93075cf` | `git rev-parse HEAD` |
| Sync | local == `origin/main`, 0 ahead / 0 behind, tree clean | `git rev-list --count` |
| Route (current) | `openrouter/openrouter/auto` | ZCode `ListModels` `[current]` |
| Deterministic substrate | Bun 1.4.2, Node v24.11.1 | `bun --version`, `node --version` |
| Canonical program count | 67 (`MP-01`…`MP-67`) | `meta-tracker.json` |
| First-release roadmap tasks | 74 across 9 workstreams, status column unmaintained | `.project/roadmap/TASKS.md` |
| Executable task/proof engine | Ratchet — spec-driven (`--spec`), 80 D1 gates, 15/80 green at last probe | `.project/ratchet/DESIGN.md` |
| ZCode CLI on bash PATH | **not found** this session | `zcode --version` → command not found |

**Harness behaviour we must respect (evidence, not guess).** The first fan-out recorded that
*unbounded heavy background subagents stalled (no artifacts, calls ceased), while bounded
(≤8 tool-call) workers on the same route all completed.* Every subagent this team dispatches is
therefore **explicitly budgeted and bounded**. This is the single most load-bearing operational
constraint on the team's speed.

## 2. Roster (instantiated)

Functions are from the charter; slots are the actual staffing. A slot is a *bounded mandate*,
not a permanent agent.

| Slot | Charter function | Runtime | Wave A mandate | Write surface |
| --- | --- | --- | --- | --- |
| `PMC-LEAD` | PM Systems Lead / Integrator | main ZCode session | hold coherence; arbitrate duplication; integrate reviewed changes; keep the core small | `.project/pm/**` (integrator only) |
| `PMC-CUR` | Program Curator / Vision Mapper | bounded subagent | validate the 67-program register against canonical META-TRACKER / `meta-tracker.json`; find drift and missing fields | read-only → returns findings |
| `PMC-AUT` | PM Automation Engineer + Execution Decomposer / Ratchet Bridge | bounded subagent | map duplication risks across PM / META-TRACKER / roadmap `TASKS.md` / Ratchet `specs/` / `D1-ATOMIC-TASKS.json`; propose the smallest substrate | read-only → returns findings |
| `PMC-DEP` | Dependency & Estimation Analyst | bounded subagent | audit the first-five seeded gates/estimates for internal consistency and gate-reference validity | read-only → returns findings |
| `PMC-TRU` | Truth / Independent Reviewer | bounded subagent | adversarially challenge the PM design and the other findings; propose falsifiers | read-only → returns findings |

The recon wave is **read-only by construction**: no subagent writes to the repo. The integrator
(`PMC-LEAD`) is the only writer in this wave, which keeps write surfaces disjoint and means recon
findings need no per-artifact reviewer (they are research, not edits).

### Standing vs on-demand (revised after Wave A)

`PMC-TRU` independently challenged the six-function standing team as ceremony at this scale
("six standing functions + a 5-way fan-out ... re-runs the 'long on design, short on executable
evidence' pattern" — see [recon/WAVE-A.md](recon/WAVE-A.md) §D). That challenge is **adopted**:

- **Standing slots:** `PMC-LEAD` (integrator, the only writer) and `PMC-TRU` (independent review
  step). Review is a step, not a standing agent.
- **On-demand bounded mandates:** `PMC-CUR`, `PMC-AUT`, `PMC-DEP` are invoked per wave with a
  written checklist when their judgment is actually needed — not staffed continuously. Their
  responsibilities fold into `PMC-LEAD`'s checklist between invocations.
- The team *functions* stay defined in [ZCODE-PM-TEAM.md](ZCODE-PM-TEAM.md); only the *staffing*
  is reduced. Re-instate a slot when workload, not design symmetry, justifies it.

## 3. Wave plan

Charter Waves A–E, instantiated:

- **Wave A — understand (current).** `PMC-CUR`, `PMC-AUT`, `PMC-DEP`, `PMC-TRU` in parallel;
  findings collide into [recon/WAVE-A.md](recon/WAVE-A.md).
- **Wave B — v0 design freeze.** `PMC-LEAD` converges the minimum schema, source references,
  maturity vocabulary, phase/gate model, effort/LOC representation, projection boundaries,
  migration/versioning. Output: [recon/V0-PROPOSAL.md](recon/V0-PROPOSAL.md). No long-term
  architecture is frozen.
- **Wave C — PM core implementation.** Only enough for the bootstrap prompt's required v0
  capability (ingest 67; explanation/objectives/vision; TBD-vs-phased; first-five phases/gates/
  estimates; reference validation; human + machine projections; Ratchet reference without
  duplication; HEAD provenance; independent review).
- **Wave D — dogfood.** The PM system plans its own next slice and one non-PM program.
- **Wave E — evolve.** Only if it earns its keep under MP-67.

## 4. Coordination rules

1. **Bounded dispatch.** Subagents get an explicit tool-call budget (≤8) and a stop condition.
   Concurrency stays within the measured ceiling; no unbounded background workers.
2. **Claim before edit.** `STATUS.md` + `COMMONS.md` first, then touch files.
3. **Disjoint write surfaces.** One writer per file; recon is read-only.
4. **Independent review** for any load-bearing schema/spec change, by a slot that neither wrote
   nor promoted it (mirrors the Ratchet independence rule).
5. **Projection, never a second truth.** Every PM state cell references META-TRACKER / Git /
   tests / evidence / Ratchet. No hand-invented status.
6. **Four dimensions never collapse.** Plan state ≠ execution state ≠ proof state ≠ evidence
   class. No single "percent complete".
7. **LOC is a size prior**, never progress. **Effort grade** is difficulty, not calendar time.
8. **Uneven resolution is intentional.** Most of the 67 stay REGISTERED. Deepen only when it
   creates leverage.
9. **Lineage on change.** Splits/merges/supersessions record prior plan, reason, evidence.

## 5. Truth boundaries

- META-TRACKER remains canonical for *which programs exist and their current meaning*; PM
  projects it and may never silently fork it.
- Source, tests and evidence outrank any PM status.
- Ratchet (or an equivalent) owns computed atomic execution/proof; PM references it.
- Nothing here is Ω architecture or an authorization system.

## 6. How to resume the team

1. Read this file, then [ZCODE-PM-TEAM.md](ZCODE-PM-TEAM.md) and the mission in
   [ZCODE-BOOTSTRAP-PROMPT.md](ZCODE-BOOTSTRAP-PROMPT.md).
2. Re-measure §1 (HEAD, sync, route, tool versions) — do not reuse the numbers above.
3. Read [recon/WAVE-A.md](recon/WAVE-A.md) for the last integrated state and open questions.
4. Check `.project/agentic-launch/STATUS.md` for what is currently claimed.
5. Continue at the lowest incomplete wave. Do not restart the recon wave unless reality changed.

## 7. Team falsifier (MP-67)

If maintaining this team and its artifacts costs more human/agent effort than the coordination
and reconstruction it removes, simplify or retire it. The team is not exempt from the rule it
applies to everything else.
