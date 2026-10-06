# PM Roadmap Evolution Rules

Status: **OPERATING DESIGN**

## 1. Expand on demand

Every MP is registered. Only deepen a program when planning resolution creates leverage.

Allowed progression:

```text
REGISTERED
→ SEEDED
→ PHASED
→ DECOMPOSED
→ EXECUTABLE
→ PROVEN-SLICE
```

Skipping levels is allowed when evidence already exists.

## 2. Never plan all 67 to atomic depth

The program map is a possibility map, not a backlog.

Atomic decomposition across all 67 would create:
- stale tasks;
- fake dependencies;
- coordination overhead;
- false precision;
- pressure to execute a plan after reality changes.

The PM team should maintain **uneven resolution intentionally**.

## 3. Program meaning comes from canonical sources

The PM tracker may summarize or project META-TRACKER meaning, but may not silently fork it.

If program meaning changes:
1. update the canonical source with rationale/evidence;
2. preserve lineage;
3. refresh the PM projection.

## 4. Objectives before phases

No phase design until the program has:
- clear explanation;
- concrete objectives;
- final-vision contribution;
- current evidence/state;
- known major boundaries/falsifiers.

## 5. Gates before serial dependency

Prefer a narrow gate dependency to “wait until program X is done.”

Example:

`MP54-P2 ← MP21-G3`

not:

`MP54 ← MP21`.

This preserves parallelism.

## 6. Estimate uncertainty explicitly

Effort and LOC must carry confidence.

Estimates should be revised when:
- relevant source is inspected;
- a prototype lands;
- dependency scope changes;
- another program provides reusable primitives.

Never grade an agent by LOC delivered versus estimate.

## 7. Decompose E5/XXL work

If a phase is E5 or >10k estimated implementation LOC, require a decomposition review before direct execution.

The likely result is:
- narrower phase outcomes;
- multiple work packages;
- explicit gates;
- experiments replacing premature implementation.

## 8. Atomic task promotion

A phase should only descend to atomic tasks when:
- the outcome is selected for execution;
- acceptance can be stated;
- dependencies/gates are sufficiently known;
- write surfaces can be bounded enough to reduce collisions;
- proof can be observed.

Prefer handing this layer to Ratchet or an equivalent executable task/proof engine.

## 9. Computed state over duplicated prose

Where a lower-level system can compute state, the PM tracker should reference/project it rather than maintain a second editable status.

Examples:
- Ratchet gate state;
- Git HEAD;
- test results;
- evidence manifests.

## 10. Re-plan from evidence

A program/phase may be split, merged, reordered, superseded or retired.

The system should preserve:
- prior plan;
- reason for change;
- evidence that triggered it;
- downstream dependencies affected.

## 11. Portfolio ranking

Future ranking should distinguish:
- product criticality;
- acceleration leverage;
- uncertainty reduction;
- dependency-unlock value;
- proof maturity;
- effort;
- owner priority.

Do not collapse these into one opaque score.

## 12. PM-system falsifier

If maintaining the tracker requires more human/agent effort than the coordination/reconstruction it removes, simplify or retire machinery.

The PM system must earn its keep under MP-67.
