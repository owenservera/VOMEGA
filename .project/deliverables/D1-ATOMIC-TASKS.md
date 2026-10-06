# D1 — Atomic Build Tasks

Status: **EXECUTION BACKLOG FOR D1 ONLY**  
Namespace: `D1-xxx` is local to this deliverable and intentionally avoids existing roadmap/launch IDs.

## Operating rules

Each task should leave one independently reviewable outcome. Do not mark a task complete because code exists; mark it complete only when its acceptance check passes.

State vocabulary: `OPEN | CLAIMED | BLOCKED | DONE | SUPERSEDED`.

A builder may split a task further, but should not combine tasks in ways that erase their individual proof obligations.

## Phase A — establish executable truth

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-001 | Pin D1 baseline and test commands | — | Record HEAD, Windows/Bun facts if available, `bun test plugins/vivim-nlcl`, `omega:quick`; preserve pre-existing failures honestly |
| D1-002 | Map exact reusable interpreter entry points | D1-001 | Short code map names source files/functions for scan→ground→resolve/project; no design invention |
| D1-003 | Reproduce corpus U1 false-READY in an isolated test | D1-001 | One focused test demonstrates current defect before fix |
| D1-004 | Define required-field metadata for `prompt.send` | D1-002 | Machine-readable rule distinguishes required Account/payload from optional route fields |
| D1-005 | Fix required-field/READY validation | D1-003,D1-004 | U1 becomes a normal passing expectation; unresolved required fields cannot be READY |
| D1-006 | Add regression tests for every required-field unresolved case | D1-005 | Missing/incompatible Account and missing payload are covered |

## Phase B — minimal semantic World

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-010 | Define D1 semantic IDs/record shapes | D1-002 | Provider, Account, Model(optional), Capability, Realization and source class represented without identity collapse |
| D1-011 | Implement deterministic World snapshot loader | D1-010 | Same fixture bytes produce same World identity/digest |
| D1-012 | Enforce fixture provenance | D1-011 | Loader rejects D1 World fixture lacking explicit synthetic/fixture source |
| D1-013 | Add World W0: no Accounts | D1-011 | Loads/validates deterministically |
| D1-014 | Add World W1: Claude Work only | D1-011 | `prompt.send` has exactly one compatible Account |
| D1-015 | Add World W2: Claude Work + Personal | D1-011 | target remains ambiguous without explicit/default rule |
| D1-016 | Add World W3: stale Claude Work | D1-011 | capability availability is not reported fresh/READY |
| D1-017 | Add World W4: unknown/incompatible target | D1-011 | cannot compile executable READY command |
| D1-018 | Add World W5: optional Provider/Model route stress case | D1-011 | Provider/Account/Model remain distinct |

## Phase C — registration and command nucleus

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-020 | Add semantic registration operation for synthetic Provider/Account relation | D1-010 | operation uses same command path, not special UI mutation |
| D1-021 | Interpret “add my Claude work account” | D1-020 | resolves to registration candidate with explicit synthetic target metadata |
| D1-022 | Interpret “add another Claude account and call it Personal” | D1-020 | second distinct Account relation produced |
| D1-023 | Persist D1 synthetic registration in session World state | D1-021,D1-022 | subsequent interpretation sees both Accounts |
| D1-024 | Define candidate canonical `prompt.send` UseCommand | D1-004,D1-010 | explicit capability/provider/account/params/world/revision/consequence/authority/evidence refs |
| D1-025 | Compile direct `prompt.send` utterance | D1-024 | canonical journey phrase recognizes capability and payload |
| D1-026 | Preserve two-Account ambiguity | D1-015,D1-025 | no silent Account choice; both alternatives inspectable |
| D1-027 | Apply explicit text correction “use Work” | D1-026 | only required semantic fields/dependencies change |
| D1-028 | Protect quoted payload from routing | D1-025 | Provider/Account words inside quoted payload do not retarget |
| D1-029 | Implement deterministic command digest | D1-024 | semantically equivalent pinned command serializes/digests identically |

## Phase D — realtime session semantics

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-030 | Add InterpretationSession/revision identity | D1-025 | each input edit gets monotonic/stable revision identity |
| D1-031 | Bind interpretation result to originating revision | D1-030 | result carries revision and World basis |
| D1-032 | Suppress obsolete late results | D1-031 | automated test proves N result cannot overwrite active N+1 |
| D1-033 | Represent semantic edits explicitly | D1-027,D1-030 | Account choice is a semantic edit/recompile event |
| D1-034 | Bind committed command to immutable revision | D1-033 | later draft editing cannot retarget committed command |

## Phase E — projection and product twin

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-040 | Define minimal deterministic D1 projection contract | D1-024,D1-030 | exposes interpretation, route, validation, unresolved, consequence, help refs, actions |
| D1-041 | Implement pure semantic projector | D1-040 | same semantic state → same projection; no raw-language parsing in renderer |
| D1-042 | Render text input + interpretation state | D1-041 | developer can type canonical journey and see current reading |
| D1-043 | Render Provider/Account/Model route | D1-041 | route identities visible and separately labelled |
| D1-044 | Render unresolved Account chooser | D1-026,D1-041 | two Accounts shown without implied selection |
| D1-045 | Route chooser click through semantic edit reducer | D1-033,D1-044 | click does not directly mutate private routing state |
| D1-046 | Prove typed/clicked parity | D1-027,D1-029,D1-045 | both paths produce same canonical command digest |
| D1-047 | Render consequence/external-transfer preview | D1-041 | payload transfer is visible before execution |
| D1-048 | Render lifecycle states | D1-041 | at least needs-choice, READY, needs-consent, executing, completed-simulated, failed-simulated |

## Phase F — grounded contextual help

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-050 | Expose minimal semantic help metadata from same source records | D1-010,D1-024 | no duplicate hand-authored parameter/capability truth |
| D1-051 | Map active semantic handles to help topics | D1-041,D1-050 | active Account ambiguity ranks relevant help |
| D1-052 | Render help for Provider/Account/capability/consequence | D1-051 | canonical journey questions answer from current state |
| D1-053 | Add help-grounding removal test | D1-052 | remove capability/state → current help stops claiming it |
| D1-054 | Add SIMULATED explanation | D1-052 | user can inspect exactly why current execution is not live proof |
| D1-055 | Define minimal D1 Reflection extraction boundary | D1-010,D1-024 | exact D1 structural inputs and allowed claim classes documented/tested |
| D1-056 | Add source anchor/content digest mechanism for D1 reflected items | D1-055 | same source produces stable binding; changed source invalidates/changes binding |
| D1-057 | Implement read-only D1 Reflection extractor/Migrator slice | D1-055,D1-056 | extracts D1 capability/parameter/realization/action facts; no fabricated claims |
| D1-058 | Materialize minimal Reflection Graph | D1-057 | D1 semantic structures and source anchors queryable/read-only |
| D1-059 | Drive contextual Wiki/help from Reflection + World + active semantic handles | D1-051,D1-058 | no parallel authoritative capability/parameter truth |
| D1-059A | Add source-removal/structural-drift grounding test | D1-059 | removing/changing reflected structure changes/fails help honestly |
| D1-059B | Record extraction gaps explicitly | D1-057 | missing structural facts appear as missing/unknown, not model inference |

## Phase G — authority and virtual execution

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-060 | Define D1 consequence record for `prompt.send` | D1-024 | externality/data-transfer distinct from authority |
| D1-061 | Add deterministic authority fixture | D1-060 | state can be allowed/consent-required/denied without changing capability identity |
| D1-062 | Prevent interpretation from granting authority | D1-061 | choosing target/typing consent-like prose alone cannot bypass authority gate |
| D1-063 | Implement virtual `prompt.send` realization | D1-024,D1-061 | accepts only committed validated authorized command |
| D1-064 | Emit execution-start/attempt/result events | D1-063 | events bind command/world/revision/realization |
| D1-065 | Emit machine-readable SIMULATED receipt | D1-064 | receipt carries simulation source/maturity and no live-account claims |
| D1-066 | Implement deterministic simulated failure path | D1-063 | failure produces explicit failure evidence, not success |
| D1-067 | Add “simulated can never satisfy live proof” predicate/test | D1-065 | live-evidence check rejects all D1 receipts |

## Phase H — replay and experiments

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-070 | Define replay bundle | D1-029,D1-034,D1-065 | captures World, registry/interpreter basis, revisions, edits, authority, realization and events |
| D1-071 | Implement replay runner | D1-070 | bundle runs without interactive reconstruction |
| D1-072 | Prove complete-journey deterministic replay | D1-071 | same command/evidence digest on repeated pinned runs |
| D1-073 | Add semantic diff output | D1-071 | differences identify semantic IDs/fields before prose/pixels |
| D1-074 | Add falseReadyRate metric | D1-005,D1-071 | canonical D1 suite reports zero false READY |
| D1-075 | Add wrongTargetRate metric | D1-026,D1-071 | explicit-target suite reports zero wrong target |
| D1-076 | Add ambiguity-honesty scenarios | D1-026,D1-071 | ambiguity is scored correct where expected |
| D1-077 | Add revision-stability scenario | D1-032,D1-071 | stale async overwrite is impossible/tested |

## Phase I — integrated release

| ID | Atomic outcome | Depends on | Acceptance |
| --- | --- | --- | --- |
| D1-080 | Wire canonical journey end to end | D1-023,D1-046,D1-052,D1-065,D1-071 | one launchable flow reaches SIMULATED receipt |
| D1-081 | Add second end-to-end failure journey | D1-066,D1-080 | unavailable/stale path refuses/fails honestly |
| D1-082 | Add one-command developer launcher | D1-080 | fresh repo setup has documented single D1 launch command after normal install |
| D1-083 | Run D1 semantic gate | D1-080,D1-081 | all D1 tests pass |
| D1-084 | Re-run existing baseline gates | D1-083 | `bun test plugins/vivim-nlcl` and `omega:quick` remain green |
| D1-085 | Produce machine-readable D1 evidence summary | D1-083,D1-084 | claims, commands, environment, test results, digests and limitations recorded; marked SIMULATED |
| D1-086 | Write implementation/harvest note | D1-085 | states reused/adapted/new pieces, rejected alternatives if material, unresolved architecture |
| D1-087 | Independent review of D1 claims | D1-085,D1-086 | reviewer verifies evidence supports exactly the D1 claim and no live/provider overclaim |
| D1-088 | Update SITREP/current status | D1-087 | current truth points to executable D1 and its evidence |
| D1-089 | Tag/identify D1 completion commit | D1-088 | immutable commit SHA recorded in evidence/status |

## Parallelization map

Safe early fan-out after D1-001:

```
A: D1-002 → D1-003/004/005/006
B: D1-010 → D1-011 → D1-012..018
```

After the semantic records and validator converge:

```
C: registration / command nucleus (020..029)
D: revision runner (030..034)
E: projection shell (040..048)
F: Reflection / Wiki / help (050..059B)
G: authority/virtual execution (060..067)
```

Then converge through replay (070..077) and integrated release (080..089).

Do not parallel-edit the same command/schema boundary without an explicit integration owner or isolated worktree.

## Critical path

The shortest path to a visible D1 proof is approximately:

```
001
→ 002
→ 004
→ 005
→ 010
→ 011
→ 015
→ 024
→ 025
→ 026
→ 029
→ 030
→ 033
→ 040
→ 041
→ 044
→ 045
→ 046
→ 060
→ 061
→ 063
→ 065
→ 070
→ 071
→ 080
→ 083
→ 085
→ 087
→ 089
```

Registration, help, failure behavior and the remaining gates are still required for completion even when they are not on this shortest visible path.

## Whole-program relationship

These tasks are a bounded D1 execution decomposition crossing multiple meta programs (including MP-06…21 and simulated aspects of MP-31/32/41). They are **not** the VOMEGA workstream list. The canonical whole-program context is `../META-TRACKER.md` (67 major programs + 31 accelerator hypotheses). The live Provider-reality path may advance independently in parallel and should not be inserted into D1 merely to make this task list look sequentially complete.

## D1 task-board rule

If execution tooling needs a machine-readable queue, derive it from this file or create a sibling `D1-ATOMIC-TASKS.json`. Do not mutate the global 74-task roadmap merely to run D1.

This task list is a bounded implementation plan and may be superseded after D1; it is not a new permanent VOmega project-management system.
