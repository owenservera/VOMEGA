# VOMEGA agent entry

Start at [.project/SITREP.md](.project/SITREP.md). It contains current mission, proof state, active execution surfaces and unresolved owner boundaries.

## Default worker rule

For bounded implementation, **do not reread the full documentation corpus**.

- self-check `HEAD` / `origin/main` / worktree state;
- create one session claim under `.project/agentic-launch/claims/`;
- if Ratchet-tracked, claim one Ratchet task and start from its packet + red gate;
- implement one bounded falsifier/red→green cycle;
- run the named proof; promote/review through Ratchet where applicable;
- close the claim and leave a Commons handoff only for a material result/blocker.

D1 mechanics: [.project/ratchet/OPERATING.md](.project/ratchet/OPERATING.md). D1 mission: [.project/deliverables/D1-START-HERE.md](.project/deliverables/D1-START-HERE.md).

## When broader reading is required

If the task changes product/semantic/authority/proof architecture, read the relevant core documents from [seed-docs/README.md](seed-docs/README.md). The minimum protected set is VISION, PRODUCT-ANCHOR, INVARIANTS, PROOF-AND-MATURITY and the current first-release mission.

D4/D5 design work earns a real design cycle; ordinary implementation does not earn another prose layer merely because it is difficult.

## Hard operating boundaries

- Provider ≠ Account ≠ Model ≠ Session.
- Capability ≠ Realization; intent ≠ execution; evidence ≠ authority; confidence ≠ proof.
- Natural language cannot grant authority.
- Fixture/simulation cannot satisfy live proof.
- Auth/provider/model configuration is read-only unless Owen explicitly directs otherwise.
- Do not weaken a gate to pass it.
- Generated PM/Ratchet projections are not hand-edited.
- Historical material under `.project/archive/` is evidence only, never current instruction.

No model, harness, lane, worktree or habitat is permanent project authority.
