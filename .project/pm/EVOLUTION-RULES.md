# PM Evolution Rules

Status: **OPERATING DESIGN (revised 2026-10-06 under the owner correction)**.
Authority: [PM-CORRECTION-FIRST-FIVE-ONLY.md](PM-CORRECTION-FIRST-FIVE-ONLY.md) is definitive.

Superseded: the earlier version of this document governed a 67-program map and included a
"Portfolio ranking" section. That section is removed. Ranking programs, scoring them, choosing the
next set, or prioritizing across the 67 is **forbidden**; it is not this system's job.

## 1. Deepen on demand, within the five

Only MP-21, MP-54, MP-55, MP-56 and MP-60 are in scope. Deepen a phase when planning resolution
creates leverage — more evidence, a decision pending, a consumer waiting. Otherwise leave it.

## 2. Uneven depth is intentional

The five need not be equally deep. A phase that is ready to execute gets tasks and proof; a phase
that is a hypothesis stays a hypothesis. Do not equalize depth for symmetry.

## 3. Meaning comes from canonical sources

Program identity, name, purpose, state and priority are read from `.project/meta-tracker.json`. PM
summarizes in its dossiers but never forks meaning. If meaning changes, the canonical source changes
first, with rationale and lineage; PM is refreshed after.

## 4. Dossier before phases

No phase design until the program has an explanation, a problem statement, 4–8 objectives, a vision
contribution, boundaries, success conditions and falsifiers. The dossier is the reason the roadmap
is trustworthy.

## 5. Gates before serialization

Prefer `MP54-P2 ← MP21-G3` to "wait for MP-21". A consumer starts when its named gate is satisfied.
External programs are referenced, never gated on as if managed.

## 6. Estimate uncertainty explicitly

Every LOC band carries LOW/MEDIUM/HIGH confidence. Revise estimates when source is inspected, a
prototype lands, or a dependency changes. Never grade a worker by LOC delivered versus estimate.
Never grade the PM system by estimate accuracy alone.

## 7. Decompose E5 and XXL work

An E5 phase (or >10k LOC) requires a decomposition review before execution: narrower outcomes,
explicit gates, or an experiment instead of premature implementation. MP-60 P5 currently carries
this flag.

## 8. Descend to tasks only when execution is selected

A phase becomes work packages and tasks only when it is selected for execution, acceptance is
stateable, and proof is observable. That layer belongs to the Ratchet. PM stores a foreign key
only; it never mints task IDs or holds editable task status.

## 9. Computed state over duplicated prose

Execution and proof are computed by the Ratchet and referenced live at check time. PM derives its
plan resolution and evidence coverage; it never stores a copy.

## 10. Re-plan from evidence, with lineage

A phase may split, merge, reorder or be superseded. Record the prior plan, the reason, the evidence
that triggered it, and the downstream dependencies affected. Never rewrite history silently.

## 11. Scope expansion is owner-only

PM scope changes only when Owen edits `scope.json` to add a program, and only then may that program
get a dossier, phases, gates and estimates. No PM code, view, score or suggestion may change scope;
`pm:check` fails if scope and files disagree. Widening scope is procedural (scope.json + git
history), not machine-decidable — that limitation is deliberate.

## 12. The four dimensions stay separate

Canonical state · PM plan resolution · execution state · PM evidence coverage. Never collapse them
into one percentage, and never let a PM cell outrank source, tests or evidence.

## 13. PM-system falsifier (MP-67)

If maintaining the tracker costs more effort than the coordination and reconstruction it removes,
simplify or retire it. Concretely: if a fresh worker cannot answer the fifteen orientation questions
from the generated views alone, or if the validator and views stop paying for themselves, the system
fails regardless of how complete the dossiers look.