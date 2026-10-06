# Integration Directive — Round1 Evidence + Ω Proof Ratchet / D1

Status: **OWNER-DIRECTED INTEGRATION INSTRUCTION**  
Date: 2026-10-06  
Current main at assessment: `bddb8cb856f1c5e97bd7abf2161f5819cf75e8cb`  
External source branch assessed: `meta-coherence-pass-2026-10-06` at `1da0d61e879475fb2a18fd95c3b9b36629c28f05`

This document tells the next implementation/review team exactly what to do with two newly supplied external artifacts:

1. `External-temp/VOMEGA-round1/` — an independent development/environment round.
2. `External-temp/vomega-ratchet-d1.patch` — the Ω Proof Ratchet + executable D1 specification patch.

This directive is subordinate to `.project/META-TRACKER.md`, `seed-docs/INVARIANTS.md`, `seed-docs/PROOF-AND-MATURITY.md`, and the current owner-selected D1 mission. It does not turn Ratchet into product architecture or Round1 into project truth.

---

## 1. Executive disposition

### Round1

**Disposition: HARVEST EVIDENCE; DO NOT MERGE THE NESTED REPOSITORY.**

The Round1 snapshot is not a distinct product-code implementation relative to current `main`.

A full tree comparison of:

`External-temp/VOMEGA-round1/omega-baseline/`

against:

`main:omega-baseline/`

found:

- 431 executable/source files on each side;
- 0 added files;
- 0 changed files;
- 0 removed files.

Therefore Round1's value is primarily **independent reproduction evidence and environment characterization**, not code to integrate.

Its strongest useful observations are:

- `omega:quick` reproduced at 62 pass / 0 fail / 1,622 assertions in a separate Linux cloud habitat;
- `bun test plugins/vivim-nlcl` reproduced at 49 pass / 0 fail;
- the existing Ω13 web service booted in that habitat;
- `/api/interpret` returned deterministic interpretation structures;
- `/api/execute` returned governed outcomes with consent behavior;
- no auth/provider/model configuration was introduced.

Round1 also proposed a cloud-oriented “Mission Control + Live Console” surface. Treat that as a **developer-surface hypothesis**, not D1 architecture and not the first-product surface.

### Ω Proof Ratchet / D1 patch

**Disposition: INTEGRATE AFTER A SHORT INDEPENDENT HARDENING PASS.**

The patch is materially valuable and aligned with VOMEGA's evidence model.

At assessment it proposed approximately:

- 69 touched files;
- ~7,670 added lines;
- 65 new files;
- 4 modifications to existing files;
- 0 base-SHA mismatches against current `main`;
- 80 executable D1 gates across 9 gate suites;
- 18 Ratchet-engine unit-test declarations;
- a partial D1 implementation with 7 substantive source modules and 11 intentionally stubbed modules.

The patch must **not** be treated as “D1 complete.” It is an executable specification, proof/control layer, and partial D1 substrate.

---

# 2. Non-negotiable boundaries

Do not integrate either artifact by weakening the existing authority hierarchy.

The following remain true:

- fixture ≠ live;
- simulation ≠ live provider behavior;
- claim ≠ proof;
- status ≠ evidence;
- confidence ≠ proof;
- description ≠ authority;
- consequence ≠ authority;
- natural language ≠ authorization;
- Provider ≠ Account ≠ Model ≠ Session;
- Capability ≠ Realization;
- World ≠ surface;
- evidence ≠ representation ≠ description ≠ authority.

The current first-release mission remains D1 / the executable semantic twin as defined in `.project/deliverables/`.

The major Labs remain protected proving environments; Ratchet is a development-system experiment inside that broader development-acceleration space.

**Ratchet must not become:**

- product runtime architecture;
- a permanent organization chart;
- a universal scheduler;
- a replacement for `META-TRACKER.md`;
- a replacement for source/tests/evidence;
- an authorization system;
- a reason to promote simulated results to live evidence.

---

# 3. Source acquisition and fresh-check procedure

Perform this work from a fresh or clean clone.

Before changing anything:

```bash
git fetch origin
git checkout main
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

If clean and behind, fast-forward.

Do not discard local work.

Record the exact `main` source SHA used for integration.

The two external artifacts currently live on:

`origin/meta-coherence-pass-2026-10-06`

Do **not** merge that whole branch merely to obtain them.

Fetch the branch and materialize only the external inputs:

```bash
git fetch origin meta-coherence-pass-2026-10-06

mkdir -p .local/external-assay

git show origin/meta-coherence-pass-2026-10-06:External-temp/vomega-ratchet-d1.patch \
  > .local/external-assay/vomega-ratchet-d1.patch

git show origin/meta-coherence-pass-2026-10-06:External-temp/VOMEGA-round1/.project/BUILD-PRIORITIES-CLOUD-HABITAT.md \
  > .local/external-assay/ROUND1-CLOUD-HABITAT.md
```

Keep `.local/` uncommitted unless an existing repo rule explicitly says otherwise.

---

# 4. Phase A — harvest Round1 correctly

Do not copy the nested `VOMEGA-round1` repository into the product tree.

Do not merge its stale copies of:

- `.project/*`;
- `seed-docs/*`;
- `README.md`;
- roadmap or launch files.

Those are snapshots from an earlier state and would overwrite newer project truth.

Instead create one compact durable evidence record, for example:

`.project/evidence/round1-cloud-habitat.json`

It should record only evidence actually supported by the Round1 artifact.

Minimum fields:

```json
{
  "schema": "vomega.external-assay/0",
  "assay": "round1-cloud-habitat",
  "sourceBranch": "meta-coherence-pass-2026-10-06",
  "sourceCommit": "1da0d61e879475fb2a18fd95c3b9b36629c28f05",
  "observedEnvironment": {
    "os": "Linux / Debian-family",
    "bun": "1.3.14",
    "node": "24.21.0",
    "git": "2.47.3"
  },
  "claims": [
    {
      "claim": "omega:quick reproduced",
      "level": "externally-reported-observation",
      "result": "62 pass / 0 fail / 1622 assertions"
    },
    {
      "claim": "vivim-nlcl suite reproduced",
      "level": "externally-reported-observation",
      "result": "49 pass / 0 fail"
    },
    {
      "claim": "existing Ω13 service booted and interpret/execute endpoints responded",
      "level": "externally-reported-observation"
    }
  ],
  "notClaimed": [
    "No new Round1 product implementation relative to current main",
    "No live provider evidence",
    "No Account binding proof",
    "No prompt.send live realization"
  ]
}
```

Use the project's existing evidence vocabulary if a current schema already exists; do not invent a parallel evidence authority merely to match this example.

Also record the important negative result:

> The Round1 executable tree was content-identical to current `main`; Round1 is therefore evidence/assay input, not a code merge candidate.

The cloud “Mission Control + Live Console” idea may be added to the appropriate hypothesis/accelerator notes if useful, but it must remain explicitly a developer-surface candidate.

**Phase A completion condition:** the independent reproduction evidence is durably preserved without importing stale project-control state.

---

# 5. Phase B — create an isolated Ratchet integration branch

Create a dedicated integration branch from fresh `main`.

Suggested name:

```bash
git checkout -b work/d1-ratchet-integration
```

Before applying:

```bash
git apply --check .local/external-assay/vomega-ratchet-d1.patch
```

At the time of this directive the patch's four existing-file base SHAs matched `main` with zero mismatches. Re-check; do not assume this remains true after later commits.

If `git apply --check` fails because `main` advanced, reconcile semantically. Do not force-apply stale hunks over newer truth.

Apply only after the check:

```bash
git apply .local/external-assay/vomega-ratchet-d1.patch
```

Immediately inspect:

```bash
git status --short
git diff --stat
git diff -- .project/COMMONS.md .project/agentic-launch/STATUS.md omega-baseline/package.json
```

No unrelated file should change.

---

# 6. Phase C — harden the Ratchet before adopting its status projections

The patch's direction is good, but four hardening requirements must be satisfied before Ratchet is allowed to become the normal D1 execution-control layer.

## C1. Anchor the initial executable specification before implementation

Current design strongly protects **promoted** gates:

- promoted gate turns red → regression;
- promoted gate vanishes → `GATE_VANISHED`;
- promoted gate file changes → `SPEC_CHANGED`.

That is not enough for an **unpromoted** gate.

Without an initial anchor, a worker could theoretically weaken an open gate before promotion and then promote the weakened form.

Add an explicit pre-implementation gate/spec anchor.

Acceptable implementation:

- compute and persist the digest of every D1 gate/spec file at Ratchet initialization; or
- compute a signed/locked spec-set digest in `ratchet.lock.json`; or
- equivalent mechanism with the same observable property.

Required behavior:

1. initial gate/spec digest is recorded before implementation claims begin;
2. a changed unpromoted gate becomes `SPEC_CHANGED` or equivalent;
3. changing a gate requires an explicit spec-change event/reason;
4. the changed gate/spec requires independent review before normal promotion;
5. gate deletion is never interpreted as completion.

Do not make the initial spec immutable forever. The point is **explicit mutation with lineage**, not freezing architecture.

## C2. Be honest about reviewer identity

Ratchet currently uses labels such as:

`--by codex-1`  
`--by claude-review`

These are useful coordination identities but not cryptographic or account-proven identities.

Document and, where appropriate, surface this explicitly:

> Ratchet reviewer identity is an auditable coordination claim, not cryptographic proof that two labels represent independent underlying actors.

The engine may enforce label separation, but the evidence summary must not overclaim stronger independence than is observed.

## C3. Keep Ratchet in the authority hierarchy

Ratchet may become authoritative for **computed D1 gate/task state**.

It must not become authoritative for the whole project.

Use this boundary:

```text
source + tests + evidence
        ↓
truth of observed claims

META-TRACKER
        ↓
whole-program coverage / authority map

Ratchet
        ↓
computed D1 task/gate/proof projection

STATUS
        ↓
current execution/claim summary
```

Ratchet may generate or update a D1 board and evidence projection.

Do not make Ratchet decide:

- product direction;
- invariant changes;
- Lab promotion;
- live-evidence classification outside explicit rules;
- provider/auth/model configuration;
- irreversible actions.

## C4. Prevent “green Ratchet suite” from meaning “D1 works”

The default Ratchet-mode gate suite deliberately uses expected-failure semantics for open gates.

Therefore:

> A green `d1:gates` run does **not** mean D1 is complete.

The CLI/documentation must make the distinction obvious between:

- **ratchet-mode green** — current open gaps are represented honestly and promoted gates have not regressed;
- **probe truth** — which gates actually pass;
- **D1 semantic completion** — every required release gate actually green/promoted;
- **D1 reviewed completion** — required tasks/gates independently reviewed under the project's review rule.

No generated board/evidence artifact may collapse those distinctions.

---

# 7. Phase D — independently review the Ratchet engine itself

Before using Ratchet to govern D1, review Ratchet as code.

At minimum review:

- `experimental/ratchet/src/gate.ts`;
- `claims.ts`;
- `state.ts`;
- `lock.ts`;
- `drift.ts`;
- `taskgraph.ts`;
- `project.ts`;
- `probe.ts`;
- `packet.ts`;
- `cli.ts`;
- `specs/d1/*`;
- `experimental/ratchet/test/ratchet.test.ts`.

The review should try to falsify these claims:

1. An open gate cannot silently become “proved” merely because expected-failure mode is green.
2. A promoted gate cannot be deleted without detection.
3. A promoted gate cannot be changed without detection.
4. After C1, an unpromoted anchored gate cannot be silently weakened.
5. A regressed promoted gate outranks ordinary frontier work.
6. Expired claims disappear from active state without deleting history.
7. Two concurrently selected fan-out tasks do not have overlapping declared write surfaces.
8. Unknown/undeclared write surfaces conflict conservatively.
9. Independent-review state cannot be satisfied by the same coordination identity that implemented/promoted the task.
10. Generated board/evidence files are projections, not manually authoritative state.
11. Drift probes report disagreement; they do not silently rewrite product truth.
12. The engine never treats SIMULATED evidence as live evidence.

Any failure is a Ratchet defect, not a reason to weaken the corresponding claim.

---

# 8. Phase E — validate the D1 executable specification

The patch defines 80 gates across:

- truth;
- World;
- command;
- session;
- projection;
- help;
- execution;
- replay;
- integrated release.

Review the gates against:

- `.project/deliverables/D1-FIRST-RELEASE-SPEC.md`;
- `.project/deliverables/D1-ATOMIC-TASKS.md`;
- current D1 corrections/addenda;
- `seed-docs/INVARIANTS.md`;
- `seed-docs/PROOF-AND-MATURITY.md`;
- the relevant Lab documents.

Do not require the D1 port types to become Ω product architecture.

The port is an **interoperability hypothesis for D1**.

Specifically verify that the gates preserve:

- Provider / Account / Model / Session separation;
- Capability / Realization separation;
- explicit fixture provenance;
- no silent Account selection;
- typed and clicked semantic corrections converging on the same semantic edit;
- stale async interpretation suppression;
- command digest stability where presentation differs;
- consent as its own action, never inferred from natural language;
- Reflection as descriptive/read-only;
- Wiki/help claims grounded in source-bound Reflection/World state;
- virtual `prompt.send` receipts explicitly `SIMULATED`;
- failure simulation producing failure, not success;
- deterministic replay.

If a gate is wrong, change it explicitly under the C1 spec-change protocol. Do not retain a bad gate merely because it arrived in the patch.

---

# 9. Phase F — run the full validation set before adoption

From `omega-baseline/`, run the patch's own checks plus existing project checks.

At minimum:

```bash
bun run ratchet:test
bun run d1:gates
bun run ratchet probe
bun run ratchet check
bun test plugins/vivim-nlcl
bun run omega:quick
```

If current command names differ after reconciliation, use the equivalent documented commands and record them.

Interpret results carefully.

The patch intentionally begins with many D1 gates genuinely failing in probe mode because D1 is incomplete.

Expected initial state is therefore something like:

- Ratchet engine tests green;
- baseline suites green at their previously proven level;
- Ratchet-mode D1 gate suite green because open gaps are represented as expected failures;
- probe mode reports the actual partial pass/fail frontier;
- no promoted gate regressed;
- no drift contradiction remains unexplained.

Do not report “80 gates passed” if most are open expected failures.

Report:

- total gates;
- actually green gates in probe mode;
- promoted gates;
- open/red gates;
- regressions;
- spec-changed gates;
- baseline status.

---

# 10. Phase G — adopt Ratchet as the D1 control layer only if these acceptance gates pass

Ratchet can be adopted for D1 when all of the following are true:

### Engine integrity

- Ratchet engine unit tests pass.
- C1 initial spec/gate anchoring is implemented and tested.
- promoted gate deletion/change detection is proven.
- regression prioritization is proven.
- claim leases/expiry are proven.
- fan-out write-surface collision behavior is proven.
- reviewer-label limitation is documented honestly.

### Authority integrity

- Ratchet is explicitly classified as a development-system acceleration experiment.
- `META-TRACKER.md` remains the whole-program map.
- source/tests/evidence remain higher-order truth.
- Ratchet only computes D1 task/gate state.
- SIMULATED/live distinction is structurally preserved.

### D1-spec integrity

- the 80-gate executable specification has been independently reviewed against D1 and the invariants;
- any gate changes are explicit and lineage-preserving;
- the seven implemented D1 modules are reviewed as candidate D1 substrate;
- the eleven stubs remain honestly incomplete.

### Compatibility

- `omega:quick` does not regress;
- `vivim-nlcl` does not regress;
- existing product/project state is not overwritten by stale external snapshot files.

If these pass, commit Ratchet integration as its own bounded change.

Suggested commit message:

`dev: integrate hardened D1 proof ratchet and executable gate spec`

---

# 11. Phase H — after adoption, use Ratchet to build D1

Only after Phase G should a larger D1 worker fan-out begin.

The worker loop should become approximately:

```bash
bun run ratchet next
bun run ratchet claim <TASK> --by <label>

# implement only the bounded packet / declared surface

bun run ratchet verify <TASK>
bun run ratchet promote --task <TASK> --by <label>
bun run ratchet sync

# independent review
bun run ratchet review <TASK> --by <independent-label>
```

Use separate worktrees when concurrent writes can collide.

Workers must not “fix the test” to satisfy themselves.

If implementation demonstrates that the spec itself is wrong, stop the task and use the explicit spec-change path.

The goal is not maximum workers.

The goal is maximum **independent evidence-bearing progress without semantic collisions**.

---

# 12. What to build next inside D1

Do not let Ratchet become a reason to delay D1.

The patch already gives a partial substrate.

At assessment:

### Substantially implemented

- `contract.ts`;
- source declarations;
- deterministic digest support;
- evidence predicates;
- session reducer;
- World model/loader;
- module exports.

### Still intentionally stubbed / incomplete

- compiler;
- validation;
- projection;
- UI;
- contextual help;
- Reflection extraction;
- virtual execution;
- replay;
- metrics;
- launcher;
- supporting not-implemented paths.

After the Ratchet itself is hardened, the next implementation work should be selected mechanically from the executable frontier.

The desired integrated D1 journey remains:

```text
blank synthetic World
→ register Claude Work
→ register Claude Personal
→ issue prompt.send command
→ preserve Account ambiguity
→ choose Work by text or click
→ same semantic command meaning
→ contextual help explains the state
→ explicit consent
→ committed command
→ virtual prompt.send
→ SIMULATED receipt
→ deterministic replay
```

That journey, not Ratchet itself, is the deliverable.

Ratchet is the machinery that makes progress toward it inspectable and difficult to fake.

---

# 13. Round1 and Ratchet must remain separate in interpretation

Do not conflate the two external artifacts.

Round1 answers:

> Can the existing repository/proof slice reproduce in an independent cloud habitat, and what developer-surface ideas emerged there?

Ratchet answers:

> Can D1's definition of done and worker frontier become mechanically inspectable, promotable, regressible and reviewable?

Round1 is **evidence input**.

Ratchet is a **candidate development-control mechanism + executable D1 spec**.

Neither is product authority.

---

# 14. Required durable outputs from this integration effort

The team executing this directive must leave:

1. a compact Round1 external-assay evidence record;
2. a hardened Ratchet implementation on an isolated branch;
3. explicit tests for pre-promotion spec anchoring;
4. independent Ratchet-engine review findings;
5. a reviewed 80-gate D1 executable spec;
6. baseline comparison results;
7. current probe counts: actually green / open-red / promoted / regressed / spec-changed;
8. updated D1 board/evidence projections;
9. a concise update to `.project/COMMONS.md` and current STATUS;
10. a final recommendation:
   - ADOPT;
   - ADOPT WITH REMAINING LIMITATIONS;
   - REJECT / HARVEST ONLY.

Do not merge the nested Round1 snapshot.

Do not merge Ratchet until the hardening gates above pass.

---

# 15. Success criterion

This integration succeeds when a fresh worker can enter the repository and mechanically determine:

- which D1 work is currently unblocked;
- what proof must become true;
- what files it may touch;
- whether it actually made the proof green;
- whether it weakened the specification;
- whether it regressed an already promoted claim;
- whether another independent reviewer accepted the result;
- what the next evidence-bearing task is;

while the repository still truthfully distinguishes:

> **project truth, owner direction, executable proof, temporary coordination, and simulation.**

The desired end state is not “Ratchet runs.”

The desired end state is:

> **D1 can be advanced by many workers without requiring a human coordinator to continuously reconstruct truth from prose, while no tool is allowed to promote claims beyond the evidence it actually has.**
