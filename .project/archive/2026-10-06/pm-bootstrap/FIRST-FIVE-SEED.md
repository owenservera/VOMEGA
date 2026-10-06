# First Five Development-Accelerator Roadmaps

Status: **SEEDED PHASE DESIGN — ESTIMATES ARE HYPOTHESES**

These five were chosen because they can accelerate many other VOMEGA programs rather than merely satisfy one product dependency.

## Shared strategy

Start in parallel:
- MP-21 Phase 1;
- MP-55 Phase 1;
- MP-56 Phase 1;
- MP-54 Phase 1;
- MP-60 Phase 1 query design.

The two strongest cross-program gates are:

- **MP21-G3 — Queryable Reflection Graph / stable structural identities.** Unlocks serious MP-54 source-aware bundles and MP-60 impact graph work.
- **MP56-G4 — Trace → fixture → deterministic replay.** Unlocks observed-runtime enrichment of MP-60 and later continuous regression harvesting.

### LOC interpretation

Ranges include implementation plus directly associated test/support code unless separated. They exclude generated fixture payloads and broad documentation. Confidence is initially LOW–MEDIUM.

---

# MP-21 — Self-Knowledge Reflection Migrator

## Explanation

A read-first utility that inspects the existing Ω repository, extracts what source structure actually proves, binds facts to source anchors/digests, builds a queryable Reflection Graph, reports missing self-description and proposes safe source-native migrations without fabricating semantic proof.

## Objectives

1. Give every structurally knowable public behavior a stable source-bound identity.
2. Extract facts deterministically from manifests, contracts, schemas, operation registration, config, language/visual contributions and tests.
3. Build a read-only graph usable by humans, agents and other accelerators.
4. Separate extracted facts from inferred/suggested meaning.
5. Turn missing self-description into explicit actionable gaps.
6. Eventually enforce incremental Reflection completeness without requiring a rewrite of the entire baseline.

## Final-vision mapping

Ω's final vision requires a system that can explain what it can do, where that ability comes from and what evidence supports the description. MP-21 is the development bridge from today's heterogeneous codebase to that source-native self-knowledge. It reduces dependence on stale prose and enables future Wiki/help, agent reasoning, context bundles and impact analysis to derive from the same underlying structural truth.

| Phase | Outcome | Effort | Estimated LOC | Dependency / gate |
| --- | --- | --- | --- | --- |
| **P1 — Source inventory + identity** | SourceAnchor, content digest, file/symbol/plugin/schema/test identities, provenance classes | **E2** | **600–1,100** | 🟩 no hard cross-program dependency. **MP21-G1:** repeated scan yields stable deterministic identities |
| **P2 — Structural extraction** | Deterministic extractors over priority source surfaces; explicit unknown/gap output | **E4** | **1,800–3,500** | MP21-G1. **MP21-G2:** same HEAD → same extracted fact set; no invented facts |
| **P3 — Reflection Graph + query API** | Read-only nodes/edges, source anchors, relation/query primitives | **E3** | **900–1,800** | MP21-G2. **MP21-G3:** external consumer can resolve stable entity refs and relations |
| **P4 — Gap + migration proposals** | Missing self-description, duplicates/mismatches, safe candidate source-native upgrades | **E3** | **800–1,700** | MP21-G3. **MP21-G4:** extracted vs suggested meaning mechanically distinct |
| **P5 — Continuous compliance** | Incremental scan/check integration, changed-public-behavior gap detection, Ratchet/CI hooks where useful | **E3** | **700–1,500** | MP21-G4 + observed developer workflow. **MP21-G5:** compliance catches a seeded structural drift without becoming source authority |

**Rough total:** 4,800–9,600 LOC.  
**Main consumers:** MP-18/19/20/22/23, MP-54, MP-55 enrichment, MP-60.

---

# MP-55 — Failure Capsules

## Explanation

A portable, reproducible development-failure package: exact invocation, environment, input, observed/expected result, relevant state and reproduction path so another worker/model receives the failure itself rather than a narrative about it.

## Objectives

1. Capture failures without relying on agent memory.
2. Make meaningful failures reproducible from another worktree/session.
3. Bind failures to task, commit, tests and later Reflection entities.
4. Enable cross-model diagnosis with compact evidence.
5. Feed minimized traces into regression/fixture harvesting.

## Final-vision mapping

Ω requires a development organization capable of learning from failure faster than complexity grows. Failure Capsules make debugging evidence durable and transferable, reducing reconstruction cost and allowing different agents/tools to independently diagnose the same observed problem.

| Phase | Outcome | Effort | Estimated LOC | Dependency / gate |
| --- | --- | --- | --- | --- |
| **P1 — Failure envelope** | Task/HEAD/command/exit/stdout/stderr/env/diff/input/signature capture | **E1–E2** | **300–650** | 🟩 independent. **MP55-G1:** another worker can identify exact failing invocation |
| **P2 — Reproducible capsule** | Content refs/snapshot rules + one-command or deterministic reproduction recipe | **E2** | **600–1,200** | P1. **MP55-G2:** fresh worktree reproduces selected failure under declared prerequisites |
| **P3 — Structural enrichment** | Attach Reflection entity/source/test refs instead of only paths/text | **E2** | **350–750** | 🟥 **MP21-G3** |
| **P4 — Cross-agent diagnostic packet** | Compact handoff optimized for independent diagnosis and context composition | **E2** | **450–900** | P2; 🟧 MP54 source-aware bundle useful but not mandatory |
| **P5 — Automatic capture/minimization** | Trigger meaningful capsule creation; minimize irrelevant events/files/input | **E3** | **800–1,600** | 🟧 MP56 normalization primitives strongly preferred. **MP55-G5:** automatic capsule preserves seeded failure signature |

**Rough total:** 2,500–5,100 LOC.

---

# MP-56 — Trace → Fixture / Regression Harvesting

## Explanation

A pipeline that takes observed simulator/runtime/provider traces, removes irrelevant or sensitive variability, turns the behavior into deterministic fixtures and proves that replay/regression tests preserve the property that mattered.

## Objectives

1. Define a provider-neutral trace/event envelope.
2. Redact/minimize safely while preserving behavioral meaning.
3. Generate deterministic fixtures from synthetic traces first and live traces later.
4. Replay fixtures in tests/conformance suites.
5. Convert repeated discoveries into permanent regression assets.

## Final-vision mapping

Ω must operate against a changing external world without relearning the same provider/runtime behavior every time. MP-56 converts ephemeral observation into reusable deterministic knowledge, bridging live reality and the Labs while preserving fixture ≠ live truth.

| Phase | Outcome | Effort | Estimated LOC | Dependency / gate |
| --- | --- | --- | --- | --- |
| **P1 — Trace/event contract** | Canonical event identity/order/source/evidence/privacy fields | **E1–E2** | **250–550** | 🟩 independent. **MP56-G1:** equivalent trace canonicalizes deterministically |
| **P2 — Normalize + privacy reduce** | Remove unstable/sensitive fields; explicit redaction rules and loss report | **E3** | **700–1,500** | P1. **MP56-G2:** sanitized trace retains target behavior and removes forbidden data |
| **P3 — Fixture generation** | Generate replayable deterministic fixture; synthetic path first | **E3** | **700–1,500** | P2. 🟥 live-provider variant requires actual live trace source |
| **P4 — Replay + regression** | Fixture executes and reproduces selected property/failure | **E3** | **800–1,700** | P3. **MP56-G4:** trace → fixture → replay reproduces pinned property |
| **P5 — Continuous harvesting** | Failures/manual successes/provider observations become candidate fixtures | **E3–E4** | **900–2,000** | MP56-G4 + 🟧 MP55 + live trace sources |

**Rough total:** 3,350–7,250 LOC excluding fixture data.

---

# MP-54 — Automatic Context Bundles

## Explanation

A task-context composer that assembles the smallest useful current package for a fresh worker from Ratchet/task state, Git, Reflection, failures and evidence—without creating its own competing repository-analysis system.

## Objectives

1. Reduce repeated repo/context reconstruction by fresh workers.
2. Start from durable task/Git/evidence state, not agent self-summary.
3. Use MP-21 structural identities rather than reparsing the repo independently.
4. Add relevant failure/evidence history without indiscriminate context dumping.
5. Measure whether bundles improve first-pass correctness, latency and token efficiency.

## Final-vision mapping

Building Ω requires many replaceable workers over time. MP-54 makes worker replacement cheap by reconstructing the exact task-relevant truth from durable project state, supporting the broader vision of continuity without depending on one model/session's memory.

| Phase | Outcome | Effort | Estimated LOC | Dependency / gate |
| --- | --- | --- | --- | --- |
| **P1 — Thin task/Git bundle** | Ratchet task, acceptance, deps, failing gates, write surface, HEAD/diff, named files | **E1–E2** | **300–700** | 🟩 can start now. **MP54-G1:** fresh worker begins bounded task without broad project reread |
| **P2 — Source-aware bundle** | Resolve relevant symbols/contracts/schemas/tests from Reflection | **E2–E3** | **550–1,100** | 🟥 **MP21-G3**. **MP54-G2:** entity-driven bundle reproducibly selects relevant sources |
| **P3 — Evidence/failure enrichment** | Relevant capsules, attempts, proof state, traces, unresolved questions | **E2** | **450–950** | 🟧 MP55-G2 |
| **P4 — Adaptive context selection** | Rank/trim context using impact/observed relevance rather than fixed templates | **E3** | **800–1,700** | 🟧 MP60 P3 useful |
| **P5 — Measured optimization** | A/B compare bundle vs ordinary repo reading; tune/retire weak components | **E2** | **450–1,000** | MP67 measurement discipline. **MP54-G5:** measurable improvement in validated work metric |

**Rough total:** 2,550–5,450 LOC.

---

# MP-60 — Runtime Dependency / Impact Graph + Test Selection

## Explanation

A graph and query layer that combines structural dependencies with observed runtime/test participation to answer what a change can affect and which evidence loop is appropriate, eventually selecting a small high-confidence inner-loop test set without weakening merge/release gates.

## Objectives

1. Define the impact questions developers/agents actually need.
2. Reuse MP-21 structural identities/edges instead of building a second parser.
3. Add observed test/runtime edges from traces and fixtures.
4. Rank affected tests for fast local iteration.
5. Learn from history to predict blast radius and safe parallelism.

## Final-vision mapping

Ω will become too large for every change to require whole-repo reconstruction and full-suite reasoning. MP-60 makes architectural relationships operational: agents can see likely consequences before editing and can verify changes efficiently while retaining broader release truth.

| Phase | Outcome | Effort | Estimated LOC | Dependency / gate |
| --- | --- | --- | --- | --- |
| **P1 — Impact query model** | Define questions, graph requirements and acceptance corpus | **E1** | **200–450** | 🟩 independent; should influence MP-21 design |
| **P2 — Static structural impact graph** | Build impact projection over Reflection entities + selected code/test edges | **E3–E4** | **1,200–2,800** | 🟥 **MP21-G3**. **MP60-G2:** known source change resolves expected downstream structural set |
| **P3 — Runtime/test-observed edges** | Join traces/fixtures/test execution to structural graph | **E4** | **1,200–2,800** | 🟧 **MP56-G4** strongly preferred |
| **P4 — Affected-test selection** | Rank smallest high-confidence local test set; preserve full merge/release gates | **E3** | **900–1,900** | 🟥 P2 + representative coverage evidence. **MP60-G4:** shadow/full-suite comparison catches seeded dependency classes |
| **P5 — Predictive impact/concurrency** | Use historical changes/failures/traces to estimate blast radius and parallel-work risk | **E4–E5** | **1,800–4,500** | needs accumulated history. Must earn continuation under MP67 |

**Rough total:** 5,300–12,450 LOC.

---

# Cross-program parallelization

```text
TIME ─────────────────────────────────────────────────────>

MP-21  P1 → P2 → P3 ─────────────→ P4 → P5
                  │
                  ├─────────────── unlocks MP-54 P2
                  └─────────────── unlocks MP-60 P2
MP-55  P1 → P2 ─────────────────→ P3 → P4 → P5
MP-56  P1 → P2 → P3(synthetic) → P4 ─────────→ P5
                                      │
                                      └──────── enriches MP-60 P3
MP-54  P1 ───── WAIT MP21-G3 ─────→ P2 → P3 → P4 → P5
MP-60  P1 ───── WAIT MP21-G3 ─────→ P2 → P3 → P4 → P5
```

## Immediate strategic rule

Do not build five separate databases/parsers/identity schemes.

At minimum they should converge on shared concepts such as:
- SourceAnchor / SourceDigest;
- EntityRef / semantic handle;
- TaskRef / GateRef;
- TestRef;
- EvidenceRef;
- TraceRef;
- ArtifactRef;
- repository revision / HEAD;
- provenance/evidence class.

The exact schema is for the implementation team to design and test.
