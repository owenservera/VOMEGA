# WS-TRU — Truth & Verification

**Mission.** Independently keep every release claim honest: what level of evidence exists, what is fixture versus live, and which falsifiers still stand (PROOF-AND-MATURITY, design §23–24).

**Milestones touched:** M0 and every milestone exit  
**Falsifiers owned / served:** Owns the F1–F10 suite  
**First moves:** TRU-01, TRU-02 in M0.

## Scope

In scope:

- release.json ledger
- Named regression lanes
- Falsifier suite
- Live-proof protocol
- Independent reviews
- Readiness audit

Out of scope:

- Restoring historical gates without a release need (DECISIONS #2)

## Interfaces

- **Consumes** evidence from all workstreams
- **Provides** gate decisions to OPS-04

## Working principles

- Reviewer ≠ implementer.
- Fixture proof is never reported as live proof.
- Broad-suite failures stay visible; release lanes name their exclusions.

## Task list

| ID | Milestone | Task | Depends on | Size |
| --- | --- | --- | --- | --- |
| [TRU-01](#tru-01) | M0 | Release proof ledger | — | S |
| [TRU-02](#tru-02) | M0 | Named semantic regression lane | — | S |
| [TRU-03](#tru-03) | M0 | Falsifier suite skeleton F1–F10 | TRU-01 | M |
| [TRU-06](#tru-06) | M0 | Independent review at every milestone exit | — | S |
| [TRU-07](#tru-07) | M0 | Static typecheck lane for touched packages | — | M |
| [TRU-05](#tru-05) | M1 | Live-proof protocol | — | M |
| [TRU-04](#tru-04) | M2 | Determinism corpus gate | CMD-02 | S |
| [TRU-09](#tru-09) | M6 | Second-provider falsification report | PRV-09 | S |
| [TRU-08](#tru-08) | M10 | Release readiness audit | REL-07 | M |

## Task cards

### TRU-01

**Release proof ledger** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

Create `.project/evidence/release.json` mirroring bootstrap.json: one claim per FIRST-PRODUCT-RELEASE-DESIGN §23 row and one per §24 falsifier, each with status (unproven / fixture / verified-local / manual-live / automated-live / differential), evidence links and the task that owns it.

Acceptance:

- [ ] Every §23 claim and F1–F10 present with status 'unproven' and owning task ID
- [ ] Schema documented in PROOF-TRACEABILITY.md

Proof: JSON validates; reviewer cross-checks against §23/§24

### TRU-02

**Named semantic regression lane** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

Add `omega:semantic` running the suites observed passing in the roadmap review (nlcl incl. release corpus, mind, intent, providers, credentials, director, provider-llm, discovery-verification, surfaces/web). Re-verify on Windows Bun 1.4.2 before claiming. Keep `omega:quick` unchanged.

Acceptance:

- [ ] `bun run omega:semantic` passes on Windows with recorded counts
- [ ] Exclusions (provider-browser fixtures, chat import fixture, MCP timeout) named explicitly

Proof: Launcher run log hash in release.json

### TRU-03

**Falsifier suite skeleton F1–F10** · M0 Roadmap adoption & proof plumbing · size M · depends on TRU-01

Create a release falsifier test file (or directory) with one named test per §24 falsifier, each `test.failing`/`todo` until its owning task lands. Live-only falsifiers are tagged and excluded from offline lanes but listed.

Acceptance:

- [ ] 10 named falsifiers exist and run
- [ ] Each references its owning task ID and evidence type

Proof: Suite output lists F1–F10

### TRU-06

**Independent review at every milestone exit** · M0 Roadmap adoption & proof plumbing · size S · depends on nothing

Every code change merged for a milestone is reviewed by an executor that did not implement it; review findings and dispositions recorded in Commons before the milestone is closed.

Acceptance:

- [ ] Review record per milestone
- [ ] No milestone closed with unresolved material finding

Proof: Commons Truth room entries

### TRU-07

**Static typecheck lane for touched packages** · M0 Roadmap adoption & proof plumbing · size M · depends on nothing

Add a tsconfig and `tsc --noEmit` (or Bun-compatible equivalent) scoped to packages touched by the release work, starting with nlcl-pure, nlcl, providers and the new command module. No claim for untouched historical packages.

Acceptance:

- [ ] Typecheck lane passes for scoped packages
- [ ] Scope list documented

Proof: Lane log

### TRU-05

**Live-proof protocol** · M1 Transport & Account evidence (read-only) · size M · depends on nothing

Write the protocol for any claim crossing external reality: which owner-controlled test accounts, what is observed, what is never captured (raw prompt/response, credentials), redaction review, and the labels manual-live / automated-live / differential (PROOF-AND-MATURITY).

Acceptance:

- [ ] Protocol doc in .project/evidence/
- [ ] First live claim (PRV-03) recorded under it

Proof: Reviewer signs off before first live run

### TRU-04

**Determinism corpus gate** · M2 Command nucleus · size S · depends on CMD-02

Make the release USE corpus part of `omega:semantic`; require that no baseline=pass case regresses and that promoted cases are recorded. Track corpus size and category coverage per milestone.

Acceptance:

- [ ] Corpus runs in the lane
- [ ] Coverage report: cases per §16 category

Proof: Lane log

### TRU-09

**Second-provider falsification report** · M6 Second-provider falsification · size S · depends on PRV-09

Independent review of the abstraction-change ledger: which shared semantics changed for provider 2, whether any provider-specific behavior leaked into shared modules, and whether prompt.send is represented identically across both providers (§23, F8).

Acceptance:

- [ ] Report committed; F8 status set with evidence
- [ ] Any leaked provider logic filed as a task

Proof: Review report

### TRU-08

**Release readiness audit** · M10 Release hardening & RC · size M · depends on REL-07

Independent audit of release.json against §23/§24/§27; any claim without matching evidence blocks release; produce honest per-provider support statement.

Acceptance:

- [ ] All §23 claims at required evidence level
- [ ] Audit report committed

Proof: Audit report

---
Back to [roadmap index](../README.md) · [TASKS.md](../TASKS.md)
