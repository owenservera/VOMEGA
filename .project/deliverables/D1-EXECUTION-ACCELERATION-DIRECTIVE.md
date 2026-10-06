# D1 Execution Acceleration Directive

Claim class: **coordination mechanism**  
Status: **ACTIVE, BOUNDED TO D1 EXECUTION**  
Date: 2026-10-06  
Grounded at `main` commit: `c0dd6c035ecf6d013f5a2f5b23dc9ef1bebfee52`

This directive incorporates the useful findings from the 2026-10-06 VOMEGA acceleration review into the project structures that already own planning, execution, proof and agent coordination.

It deliberately does **not** create a new `.project/acceleration/` organization, a new role hierarchy, a second task system, a scheduler, or a second source of project truth.

The rule is:

> accelerate through the existing PM → Ratchet → claim → evidence chain; do not wrap that chain in another management system.

## 1. Authority placement

The existing layers remain authoritative for their own concerns:

```text
protected invariants / proof boundaries
        ↓
owner mission + owner decisions
        ↓
META-TRACKER canonical program meaning
        ↓
PM — five owner-selected accelerator programs only
        ↓
owner build plan — selected waves/holds for those five
        ↓
D1 deliverable — bounded product integration slice
        ↓
Ratchet — D1 tasks, gates, claims, promotions, regressions, review
        ↓
dev-agent registration — who is doing what and where
        ↓
source + tests + evidence — whether the claim is true
```

This directive may improve execution discipline inside those layers. It may not override them.

In particular:

- PM still manages only MP-21, MP-54, MP-55, MP-56 and MP-60.
- PM still has no authority to select, rank, add, remove or prioritize programs.
- Ratchet remains the owner of D1 atomic task/proof state.
- agent registration remains an operational visibility layer, not permission or proof.
- source, tests and evidence outrank this directive.

## 2. What is being adopted

The acceleration review identified five real bottlenecks:

1. executable evidence is advancing more slowly than design/documentation;
2. D1 has a narrow, file-contended critical path;
3. existing mechanisms are at risk of being reimplemented rather than harvested;
4. workers pay avoidable orientation/context cost;
5. several D1 gates are weaker than the claims they appear to support.

All five findings are adopted.

The review's proposed **organizational wrapper** is not adopted. There are no permanent "proof velocity", "flow", "harvest", "context" or "truth-at-speed" departments, no standing scorekeeper role, and no eight-role dispatch taxonomy. Those are functions existing agents may perform when needed.

## 3. Default execution rule: every coding session must leave a falsifier

For D1, the normal implementation loop is:

```text
self-checkout
→ session registration
→ Ratchet packet / task claim
→ verify the named task while red
→ implement one bounded outcome
→ verify green
→ probe
→ promote
→ independent review
→ sync
→ coherent commit
→ release task claim
→ evidence-based session close
```

Do not start a D1 implementation task by writing another design document when the task already has an executable acceptance gate.

A code-changing session should normally leave at least one of:

- a task gate moved red → green for the intended reason;
- a regression test that falsifies a previously possible defect;
- a strengthened gate that kills a known false positive;
- a measured negative result that retires a proposed accelerator or implementation path.

A design-cycle deliverable is an exception only when the design-intensity system says real design is required. Even then, the design cycle should end in a discriminating prototype, test, interface, or explicit falsifier rather than prose alone.

## 4. Documentation budget

D1 execution is not an excuse for another documentation layer.

Prefer, in order:

1. existing Ratchet task/gate/spec;
2. existing source-adjacent interface/test;
3. existing session claim;
4. existing Commons handoff;
5. an existing design/decision document that genuinely needs amendment.

Create a new prose document only when it is itself the required durable artifact: an owner decision, a proof protocol, a failure/reproduction capsule that cannot live safely in the claim, or a required release/evidence record.

Generated projections remain generated and must not be hand-edited.

## 5. Flow and critical path

### 5.1 Maximum useful parallelism, not maximum agents

Use `bun run ratchet fanout --n <k> --write .local/ratchet/packets` for D1 parallelism. One packet goes to one isolated worker/worktree when practical.

Available model capacity is not itself a reason to create more work.

When the frontier is narrower than available workers, use the excess capacity for bounded work that reduces future execution cost:

- independent review;
- gate hardening;
- harvest assays against an already selected task;
- a measured context-bundle experiment;
- a failure reproduction.

Do not fill idle capacity with speculative planning.

### 5.2 Keep the D1 spine low-contention

At any moment, one worker should own the currently active D1 critical-spine task. This is a temporary claim-level convention, not a permanent role.

Other workers should take disjoint off-spine packets. Do not parallel-edit the same semantic boundary merely because more agents are available.

### 5.3 Speculative work is allowed only under Ratchet truth

A BLOCKED D1 task may be implemented on an isolated branch when:

- it depends only on behavior already PROVEN or present on current `main`;
- its own gates can genuinely go green;
- it does not collide with the active spine surface;
- the worker accepts rework if upstream contracts change.

Promotion still requires current probe truth. A regression outranks new frontier work.

### 5.4 Merge small and re-check

Prefer one coherent D1 task per commit. Re-integrate quickly. Run `ratchet check` after merge/integration and resolve regressions before opening more work.

## 6. Runway defect: cross-platform Ratchet graph freshness

The acceleration review reproduced a clean-checkout `TASKGRAPH_STALE` failure caused by line-ending-sensitive taskgraph digesting.

Treat this as a **Ratchet runway defect**, not as a new PM program and not as a D1 product requirement.

Required engineering disposition:

- normalize CRLF/LF consistently in the taskgraph source digest;
- regenerate the graph;
- add a Ratchet unit test proving equivalent CRLF/LF task sources produce the same digest;
- verify on Windows and at least one non-Windows environment if available.

This should be fixed before scaling D1 fan-out across mixed environments.

## 7. Harvest before inventing

For every D1 task, inspect the task packet and relevant existing implementation before designing a replacement.

Two immediate harvest rules are binding for the current D1 slice:

### 7.1 Interpreter / compiler work

D1 compile and interpretation work must assay and adapt `plugins/vivim-nlcl-pure` before creating another interpreter path.

Reuse may be REUSE, ADAPT, WRAP, PORT, BEHAVIORAL REIMPLEMENTATION or REJECT, but the disposition must be explicit when material.

### 7.2 Reflection / contextual-help work

As of the grounding commit, ACCEL-W1 MP-21 P1/P2/P3 has produced a provisional `experimental/reflection-migrator/` substrate and PM's independent assessment says to adopt it provisionally while holding MP21-G1/G2/G3 for independent review and real-consumer evidence.

Therefore D1-055…059B must not silently build a second general Reflection parser/identity universe.

The D1 Reflection slice should:

- consume, adapt or wrap the Reflection Migrator where its bounded contracts fit;
- preserve the D1 release's narrower declaration/help requirements;
- make semantic mismatches explicit;
- add a new mechanism only for a demonstrated gap;
- feed useful D1 consumer requirements back into the shared Reflection contract rather than forking identities.

Harvest is not permission to collapse distinct concepts just to maximize reuse.

## 8. Context economy

### 8.1 Packet-first default

For a bounded D1 implementation worker, the default context is:

- the Ratchet packet;
- the task's red gate(s);
- the D1 non-negotiable boundaries;
- the directly named `readFirst` / write surface.

Escalate context only when the packet is insufficient.

When a worker needs broader context, record exactly what was missing. Repeated missing context is evidence for improving packets; it is not evidence for making every worker reread the full project.

### 8.2 No Elephant implementation yet

The large-context / Elephant hypothesis remains preserved, but it is not an execution prerequisite.

Do not build an Elephant/context-network platform until context reconstruction or review is measured as a bottleneck on real work. The first test should be a bounded comparison against a fresh-worker packet workflow, not a platform rollout.

## 9. Claims and handoffs: one source per question

For D1 implementation:

- the **session claim file** says who is working, from which HEAD/worktree, on what bounded slice, and where they expect to write;
- the **Ratchet task claim** says which D1 atomic task is leased;
- **STATUS** summarizes major execution slices, not every short-lived task;
- **COMMONS** records material cross-session results, blockers and handoffs;
- tests/evidence/review say whether the work is true.

Do not duplicate the same task status into all four surfaces.

A single agent session may list the sequential D1 task IDs it expects to work through, but the worker should hold only one active Ratchet implementation claim at a time unless the task system explicitly requires otherwise.

## 10. Truth at speed

### 10.1 Never weaken a gate to make progress appear faster

If a gate is wrong, use the Ratchet `spec-change` path with a reason, isolated change, and re-review.

Gate strengthening is first-class execution work.

### 10.2 Independent review reads evidence, not summaries

A reviewer must:

- run the task verification independently;
- read the changed implementation and the actual gate source;
- confirm the gate asserts the intended behavior rather than a proxy;
- record harness/model when exposed;
- state independence limits honestly.

Contract/digest/authority/proof-boundary/gate changes receive adversarial review depth. A different harness/model family is preferred where practical, but model diversity is not itself proof of independence.

### 10.3 Cheap sabotage is encouraged

When a phase or consequential task is green, a different reviewer should try at least one plausible defect in a disposable worktree when cheap.

Examples include:

- remove a required-field check;
- let a stale revision win;
- let a click bypass the semantic reducer;
- collapse Provider/Account/Model/Session identity;
- emit an execution receipt without `SIMULATED`;
- let Reflection satisfy authority or availability.

If the mutation survives, the gate is weaker than the claim. Strengthen it.

## 11. Concrete D1 hardening obligations

These are execution requirements discovered by the acceleration review. They do not become a second backlog; they attach to the existing task/gate system.

### 11.1 D1-002 — reusable interpreter code map

The acceptance artifact must be substantive, not substring-satisfiable.

The corresponding gate should verify structure such as:

- multiple named source paths that actually exist;
- named exported symbols that actually exist in those files;
- the scan → ground → resolve/project path;
- the relevant `WorldModel`/compile boundary;
- the source of corpus U1 false-READY behavior.

If the current gate can be passed by a one-line placeholder, harden it through `spec-change`.

### 11.2 D1-004 → D1-005 → D1-006 — false READY

This remains the highest-value near-term D1 semantic spine:

- declare required-field metadata for `prompt.send`;
- make READY validation consume it correctly;
- preserve regression tests for missing/incompatible Account and missing payload.

Do not solve the symptom with a special-case U1 patch.

### 11.3 D1-016 / D1-017 — finish the World edge cases

Close the stale-account and unknown/incompatible-target cases with deterministic evidence. These are small bounded off-spine tasks and should not wait behind prose work.

### 11.4 D1-020 → D1-023 — registration through the command path

Registration must exercise the same semantic command machinery rather than a hidden UI mutation path.

### 11.5 D1-074…077 — metrics must be recomputed

`falseReadyRate`, `wrongTargetRate`, ambiguity honesty and revision stability must be recomputed from the actual scenario/replay corpus at gate time.

A constant or hard-coded "0" is not evidence.

Each metric mechanism should have at least one deliberately failing scenario proving the metric can move.

### 11.6 Missing coverage discovered by the review

Before D1 completion, ensure executable coverage exists for:

- explicit target overriding any default/prior route;
- Session remaining distinct from Provider/Account/Model where Session identity is in play;
- Reflection granting no authority, availability, authenticity or maturity;
- realization/source drift invalidating or changing dependent contextual-help claims.

Attach each obligation to the nearest existing D1 task/gate when that remains semantically clear. If not, split/add a Ratchet task through the existing "Changing the plan" procedure. Do not invent an external tracker.

## 12. Future negative-intent compatibility — preserve, do not block

The owner-directed [Negative Intent Signal Engine](../../seed-docs/NEGATIVE-INTENT-SIGNAL-ENGINE.md) is a D5 semantic design concept, not a new D1 completion requirement.

D1 should preserve the smallest evidence needed to test it later:

- revision identity and late-result suppression;
- candidate/unresolved alternatives where the interpreter already exposes them;
- explicit semantic edits and typed/clicked convergence;
- semantic diff/replay;
- provenance for selected/defaulted fields;
- enough dependency/invalidation information to estimate late-correction cost.

Do **not** build a second parser, generalized evolutionary optimizer or permanent negative-intent subsystem merely to finish D1.

D1-026/027/033/046/073/076/077 provide useful seed scenarios for the later experiment. If implementation naturally exposes the candidate manifold, retain it rather than collapsing irreversibly to top-1.

## 13. Current dated execution emphasis

As of `c0dd6c0`:

- the owner-selected PM ACCEL-W1 plan exists;
- MP-21 P1/P2/P3 implementation exists provisionally and is awaiting independent gate review/consumer evidence;
- MP-56, MP-55, MP-54 and MP-60 Wave-1 entries remain open in the current STATUS;
- D1 remains a separate bounded execution backlog with a narrow semantic spine.

For D1 specifically, the current execution bias is:

1. clear Ratchet runway defects that impair mixed-environment execution;
2. harden D1-002 enough that its green is meaningful;
3. drive D1-004/005/006 on the spine;
4. use off-spine capacity on D1-016/017 and D1-020…023;
5. harvest Reflection Migrator before D1 Phase F duplicates it;
6. harden weak metric/artifact gates before the release tail depends on them.

This is a dated execution emphasis, not a timeless program priority and not authority to change PM waves.

## 14. Measuring acceleration without creating a scorekeeping bureaucracy

Measure interventions where the work already lives: the session claim, review note, Ratchet evidence, or material Commons handoff.

Useful before/after measures include:

- D1 probe green count;
- disjoint fan-out width;
- remaining critical-path depth;
- time from claim to first task verification;
- claim → promotion cycle time;
- promotion → independent-review time;
- escaped/regressed gates;
- mutation kill/survival for hardened gates;
- amount of context a worker required beyond its packet.

A new persistent scorecard, daemon or accelerator tracker is justified only if repeated manual measurement becomes a demonstrated coordination bottleneck.

Any accelerator intervention that does not improve its named bottleneck should be simplified or removed.

## 15. Functions, not permanent roles

The following functions may be assigned temporarily:

- spine implementation;
- off-spine implementation;
- independent review;
- harvest assay;
- gate hardening/sabotage;
- live-proof protocol design;
- accelerator experiment measurement.

They are not departments, standing agents or permanent owners. Existing DEV/TRU/PM/worker structures may perform them.

## 16. Retirement

This directive is temporary D1 execution machinery.

When D1 is independently reviewed and its completion commit is recorded:

- retain any rule that proved generally useful by moving it into the smallest existing permanent operating document;
- mark D1-specific sequencing/history as historical;
- remove or supersede instructions that no longer earn their maintenance cost.

Do not let a D1 acceleration directive become a permanent project organization.

## 17. Acceptance of this documentation/PM integration

This integration is correct only if:

- no new acceleration hierarchy or scheduler is created;
- PM scope remains exactly the five owner-selected programs;
- PM decisioning remains forbidden;
- Ratchet remains the D1 task/proof authority;
- agent claims remain lightweight and non-authoritative;
- D1 hardening findings are attached to existing tasks/gates rather than tracked in a second backlog;
- design-intensity rules still protect genuinely hard design work;
- ordinary implementation work defaults to executable falsifiers rather than more prose;
- generated PM/Ratchet projections are not hand-edited;
- the directive can be retired after D1.
