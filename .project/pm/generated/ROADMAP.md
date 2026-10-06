# PM — Roadmap (managed five)

All 25 phases across the managed five. Effort is engineering complexity, not calendar time; LOC is a planning prior, never a productivity target.

## MP-21 — Self-Knowledge Reflection Migrator / auto-Wiki migration tool

| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP21-P1 | Source inventory + identity | Establish deterministic identity over the existing Ω source tree: classify input surfaces (manifests, contracts, op registration, schemas, config, language, visual, tests, structured comments) and mint stable SourceAnchor identities (repository, commit, contentHash, path, symbol, line-range navigation hint, extractionKind) plus content digests, so repeated scans at the same HEAD are stable. | E2 | 600-1100 (M, LOW) | — | MP21-G1 | — |  |
| MP21-P2 | Structural extraction | Build deterministic extractors over the priority source surfaces — PluginManifest, TypeScript contracts, operation registration, schemas, config parsing, language contributions, visual contracts, tests — emitting claim-classed structural facts with explicit unknown/gap output, and computing manifest↔runtime op parity. | E4 | 1800-3500 (L, LOW) | MP21-G1 | MP21-G2 | — |  |
| MP21-P3 | Reflection Graph + query API | Assemble extracted facts into a read-only Reflection Graph — nodes, edges, source anchors and relation/query primitives per the ExtractedReflection shape — with stable entity references that external programs can resolve without reparsing source. | E3 | 900-1800 (M, LOW) | MP21-G2 | MP21-G3 | — |  |
| MP21-P4 | Gap + migration proposals | Analyze the graph for missing self-description, manifest↔runtime mismatches, duplicate semantic truth, prose-only claims and source conflicts; produce severity-ranked gaps and source-native migration proposals that remain mechanically separate from extracted facts. | E3 | 800-1700 (M, LOW) | MP21-G3 | MP21-G4 | — |  |
| MP21-P5 | Continuous compliance | Integrate incremental scan and completeness checks into the normal development loop (build/CI hooks) so new or modified public behavior must remain structurally transparent, while the check itself claims no authority over source and stays read-only by default. | E3 | 700-1500 (M, LOW) | MP21-G4 | MP21-G5 | observed developer workflow |  |

## MP-54 — Automatic Context Bundles

| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP54-P1 | Thin task/Git bundle | Compose a thin per-task bundle for a fresh worker from Ratchet/task state and Git: task acceptance criteria, dependencies, failing gate names and current failure messages, write surface, HEAD/diff, and files to read (paths only) - by extending or reusing the existing Ratchet packet mechanism, not a new composer. | E1-E2 | 300-700 (M, LOW) | — | MP54-G1 | Reuse of the Ratchet packet mechanism (ratchet next / ratchet packet, .project/ratchet/DESIGN.md §3.4) |  |
| MP54-P2 | Source-aware bundle | Resolve the task's relevant symbols, contracts, schemas, and tests through MP-21 Reflection identities (stable entity refs, MP21-G3) and turn them into a source-aware bundle with a deterministic file set - no independent repo reparsing. | E2-E3 | 550-1100 (M, LOW) | MP21-G3 | MP54-G2 | — |  |
| MP54-P3 | Evidence/failure enrichment | Enrich bundles with task-relevant evidence and failure history: MP-55 capsules, recent attempts, proof state, traces, and unresolved questions - filtered to relevance with a hard size bound, never an indiscriminate dump. | E2 | 450-950 (M, LOW) | MP54-G2 | MP54-G3 | MP55-G2 |  |
| MP54-P4 | Adaptive context selection | Rank and trim bundle content using impact and observed relevance (soft: MP60-P3 runtime/test-observed edges) instead of fixed templates, and prove the ranking wins on a stated metric over a measured task set. | E3 | 800-1700 (M, LOW) | MP54-G3 | MP54-G4 | MP60-P3 |  |
| MP54-P5 | Measured optimization | A/B compare bundle-aided work against ordinary repo reading on real tasks under the acceleration-scorecard measurement discipline (external reference MP-67), then tune, keep, or retire weak bundle components. | E2 | 450-1000 (M, LOW) | MP54-G4 | MP54-G5 | MP67 measurement discipline |  |

## MP-55 — Failure Capsules / reproducible debugging packets

| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP55-P1 | Failure envelope | Capture the failure's observable envelope — invocation, environment, input, output and signature — without relying on agent memory. | E1-E2 | 300-650 (S, LOW) | — | MP55-G1 | — |  |
| MP55-P2 | Reproducible capsule | Turn an envelope into a capsule another worktree can replay under declared prerequisites. | E2 | 600-1200 (M, LOW) | MP55-G1 | MP55-G2 | — |  |
| MP55-P3 | Structural enrichment | Bind capsules to Reflection entities and test refs instead of bare paths and prose. | E2 | 350-750 (M, LOW) | MP21-G3 | MP55-G3 | — |  |
| MP55-P4 | Cross-agent diagnostic packet | Compress a capsule into a diagnostic packet a fresh agent can reason from alone. | E2 | 450-900 (M, LOW) | MP55-G3 | MP55-G4 | MP54 source-aware bundle useful but not mandatory |  |
| MP55-P5 | Automatic capture/minimization | Capture and minimize capsules automatically while preserving the failure signature. | E3 | 800-1600 (M, LOW) | MP55-G4 | MP55-G5 | MP56-G3 normalization/fixture primitives strongly preferred |  |

## MP-56 — Trace → Fixture / regression harvesting

| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP56-P1 | Trace/event contract | Define the canonical trace/event envelope: event identity, order, source, evidence class and privacy fields. | E1-E2 | 250-550 (S, LOW) | — | MP56-G1 | — |  |
| MP56-P2 | Normalize + privacy reduce | Remove unstable and sensitive fields through explicit redaction rules while preserving the behavioral property being pinned. | E3 | 700-1500 (M, LOW) | MP56-G1 | MP56-G2 | — |  |
| MP56-P3 | Fixture generation | Generate replayable deterministic fixtures from sanitized traces, synthetic path first. | E3 | 700-1500 (M, LOW) | MP56-G2 | MP56-G3 | live-provider variant requires an actual live trace source (external, see externalDependencies) |  |
| MP56-P4 | Replay + regression | Execute generated fixtures in the project's own test/conformance suites and pin the property they must reproduce. | E3 | 800-1700 (M, LOW) | MP56-G3 | MP56-G4 | — |  |
| MP56-P5 | Continuous harvesting | Make observed failures, manual successes and provider observations flow into candidate fixtures and promoted regression gates automatically. | E3-E4 | 900-2000 (M, LOW) | MP56-G4 | MP56-G5 | MP-55 capsules as failure inputs |  |

## MP-60 — Runtime dependency / impact graph + test selection

| Phase | Name | Objective | Effort | LOC | Blocked by | Exit gates | Soft deps | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP60-P1 | Impact query model | Define the impact questions developers and agents actually need, with an acceptance corpus that can grade answers. | E1 | 200-450 (S, LOW) | — | MP60-G1 | should influence MP-21 design (informational) |  |
| MP60-P2 | Static structural impact graph | Build the static structural impact projection over MP-21 entities and selected code/test edges. | E3-E4 | 1200-2800 (L, LOW) | MP60-G1, MP21-G3 | MP60-G2 | — |  |
| MP60-P3 | Runtime/test-observed edges | Join observed traces, fixtures and test execution to the structural graph without a second parser. | E4 | 1200-2800 (L, LOW) | MP60-G2 | MP60-G3 | MP56-G4 |  |
| MP60-P4 | Affected-test selection | Rank the smallest high-confidence local test set while preserving full merge/release gates. | E3 | 900-1900 (M, LOW) | MP60-G3 | MP60-G4 | — |  |
| MP60-P5 | Predictive impact/concurrency | Estimate blast radius and parallel-work risk from accumulated history, after the E5 decomposition review. | E4-E5 | 1800-4500 (L, LOW) | MP60-G4 | MP60-G5 | MP67 scorecard, accumulated history | **decomposition review** |

