# D1 — executable first-release semantic twin

Status: **OWNER-SELECTED FIRST BUILD DELIVERABLE — INCOMPLETE**  
Date: 2026-10-06  
Scope: development release / simulated semantic twin; **not** the public Windows beta.

## Mission

Build one runnable synthetic journey:

```text
blank synthetic Ω
→ register Claude Work + Personal through ordinary language
→ issue prompt.send intent
→ preserve Account ambiguity
→ resolve by text OR click through the same semantic edit path
→ READY only when structurally valid
→ grounded contextual help
→ governed virtual execution
→ explicitly SIMULATED receipt
→ deterministic replay
```

## Fresh implementation session

Do not read the full documentation corpus.

1. Read `../SITREP.md`.
2. Read `../ratchet/OPERATING.md`.
3. From `omega-baseline/`, run `bun run ratchet status` / `bun run ratchet next`.
4. Claim the task and use its generated packet + red gate as the default context.
5. Read `D1-FIRST-RELEASE-SPEC.md` only when the task needs whole-deliverable acceptance context.

The Ratchet packet already supplies the core invariants and task-specific files.

## Task-specific documentation already complete

- D1-002 / interpreter work: [D1-CODE-MAP.md](D1-CODE-MAP.md).
- D1-055…059B / Reflection-help work: [D1-REFLECTION-HARVEST-MAP.md](D1-REFLECTION-HARVEST-MAP.md).
- execution/throughput/gate-hardening rules are embedded in `../ratchet/OPERATING.md` and the executable Ratchet gates/spec; no separate acceleration layer is required.
- live Provider work is **outside D1** and uses `../live-proof/`.

No additional design/PM pass is required for ordinary D1 tasks. If implementation uncovers a genuine D4/D5 semantic choice, use the existing design-intensity rule and produce an executable discriminator/prototype rather than another general roadmap.

## Build rule

One bounded claim → one red gate/falsifier → implementation → verify/probe → promotion → independent review → coherent commit/release.

Parallelize only disjoint write surfaces. Regressions outrank new work. Never weaken a gate to create progress.

## Definition of done

D1 is done only when Ratchet completion proves all D1 tasks/gates and independent review supports exactly the D1 claim, including:

- no false READY for unresolved required fields;
- truthful two-Account ambiguity;
- typed/clicked correction convergence;
- obsolete revisions cannot overwrite current state;
- contextual help grounded in source-bound Reflection + current semantic state;
- interpretation cannot grant authority;
- virtual `prompt.send` only;
- SIMULATED receipts cannot satisfy live proof;
- deterministic replay + scenario-derived metrics;
- one-command developer launch;
- baseline regression checks remain honest.

## Stop conditions

Stop and surface evidence if the task requires live Provider/browser action, auth/provider/model configuration, an unresolved owner decision, destructive history, weakening an invariant/proof boundary, or representing simulated behavior as live.

Otherwise continue autonomously through the executable task system.
