# PM — Dependency gates (managed five)

Narrow gates, not whole-program serialization. A consumer is unlocked when its named gate is satisfied — the producing program does not have to be complete.

| Gate | Program | Producing phase | Status | Statement | Consumers |
| --- | --- | --- | --- | --- | --- |
| MP21-G1 | MP-21 | MP21-P1 | TBD | repeated scan yields stable deterministic identities | MP21-P2 |
| MP21-G2 | MP-21 | MP21-P2 | TBD | same HEAD produces the same extracted structural fact set | MP21-P3 |
| MP21-G3 | MP-21 | MP21-P3 | TBD | stable queryable Reflection identities / graph exists | MP54-P2, MP55-P3, MP60-P2 |
| MP21-G4 | MP-21 | MP21-P4 | TBD | extracted fact and suggested meaning remain mechanically distinct | MP21-P5 |
| MP21-G5 | MP-21 | MP21-P5 | TBD | structural drift/completeness check works without becoming source authority |  |
| MP54-G1 | MP-54 | MP54-P1 | TBD | fresh worker begins a bounded task without broad project reread | MP54-P2 |
| MP54-G2 | MP-54 | MP54-P2 | TBD | entity-driven bundle reproducibly selects relevant sources | MP54-P3 |
| MP54-G3 | MP-54 | MP54-P3 | TBD | bundle carries only task-relevant evidence/failure refs (no indiscriminate dump) | MP54-P4 |
| MP54-G4 | MP-54 | MP54-P4 | TBD | adaptive selection beats fixed template on a measured task set | MP54-P5 |
| MP54-G5 | MP-54 | MP54-P5 | TBD | measurable improvement in a validated work metric |  |
| MP55-G1 | MP-55 | MP55-P1 | TBD | another worker can identify the exact failing invocation | MP55-P2 |
| MP55-G2 | MP-55 | MP55-P2 | TBD | fresh worktree reproduces the selected failure under declared prerequisites | MP55-P3, MP54-P3 |
| MP55-G3 | MP-55 | MP55-P3 | TBD | capsule references Reflection entities/tests, not only paths/text | MP55-P4 |
| MP55-G4 | MP-55 | MP55-P4 | TBD | a fresh agent diagnoses from the packet without reading the repo | MP55-P5 |
| MP55-G5 | MP-55 | MP55-P5 | TBD | automatic capsule preserves the seeded failure signature |  |
| MP56-G1 | MP-56 | MP56-P1 | TBD | equivalent trace canonicalizes deterministically | MP56-P2 |
| MP56-G2 | MP-56 | MP56-P2 | TBD | sanitized trace retains target behavior and removes forbidden data | MP56-P3 |
| MP56-G3 | MP-56 | MP56-P3 | TBD | a synthetic trace yields a byte-stable replayable fixture | MP56-P4 |
| MP56-G4 | MP-56 | MP56-P4 | TBD | trace -> fixture -> replay reproduces the pinned property | MP56-P5, MP60-P3 |
| MP56-G5 | MP-56 | MP56-P5 | TBD | an observed failure becomes a candidate fixture whose regression gate promotes |  |
| MP60-G1 | MP-60 | MP60-P1 | TBD | the impact question set has a named acceptance corpus | MP60-P2 |
| MP60-G2 | MP-60 | MP60-P2 | TBD | a known source change resolves the expected downstream structural set | MP60-P4 |
| MP60-G3 | MP-60 | MP60-P3 | TBD | observed test execution joins to structural entities | MP60-P4 |
| MP60-G4 | MP-60 | MP60-P4 | TBD | shadow/full-suite comparison catches seeded dependency classes | MP60-P5 |
| MP60-G5 | MP-60 | MP60-P5 | TBD | decomposition review completed and blast-radius estimate validated against accumulated history |  |

## Cross-program unlocks

- **MP21-G3** (MP-21) → MP54-P2, MP55-P3, MP60-P2 — stable queryable Reflection identities / graph exists
- **MP55-G2** (MP-55) → MP55-P3, MP54-P3 — fresh worktree reproduces the selected failure under declared prerequisites
- **MP56-G4** (MP-56) → MP56-P5, MP60-P3 — trace -> fixture -> replay reproduces the pinned property

## External references (outside PM scope — never managed here)

- MP-54 → `MP-67`: P5 needs the acceleration-scorecard measurement discipline; MP-67 is outside PM scope and is referenced only.
- MP-56 → `MP-25`: P3/P5 live-trace variants need an actual live provider trace source; blocked until the TRU-05 live-proof protocol and consent/evidence envelope exist. Referenced only, not managed.
- MP-60 → `MP-67`: P5 predictive impact must earn its continuation under the acceleration scorecard; MP-67 is outside PM scope and is referenced only.

