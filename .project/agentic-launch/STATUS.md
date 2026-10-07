# Development execution status

Date: 2026-10-06. This is an aggregate view only. Per-worker truth lives in `claims/`; D1 task/proof truth lives in Ratchet.

## Active claims

| Claim | Worker | Work |
| --- | --- | --- |
| [20261006-1701-devops-team-zcode.md](claims/20261006-1701-devops-team-zcode.md) | ZCode governor (OPS-LEAD) + bounded OPS subagents | Design + set up the devops team: ops-sweep design doc, recurring automation, first sweep evidence |

Closed 2026-10-06: [20261006-1641-design-council-zcode.md](claims/20261006-1641-design-council-zcode.md) — multi-model design council (protocol + saved workflow + `/council`; codex LIVE, GLM LIVE, claude/grok unavailable pending owner auth) and the loop upgrade to a 10-minute continuous drain; [20261006-1617-devloop-24x7-zcode.md](claims/20261006-1617-devloop-24x7-zcode.md) — loop setup + first governed cycle (D1-004 DONE at `fc1ef89`; review by separate automated subagent context, not independent human review). The recurring loop opens and closes its own cycle claims per run.

## Major slices

| Slice | State | Evidence / next |
| --- | --- | --- |
| D1 executable semantic twin | selected, incomplete | `../deliverables/D1-START-HERE.md`; use `bun run ratchet status/next` |
| MP-21 Wave-1 P1–P3 | implementation landed, review hold | Reflection Migrator verified-local; independent gate review/consumer evidence needed |
| MP-54 / MP-55 / MP-56 / MP-60 Wave-1 entries | owner-selected; implementation status must be read from current claims/PM evidence | `../pm/build-plan.json` and generated views |
| live Provider/Account path | protocol candidate ready; live proof unproven | `../live-proof/LIVE-PROOF-PROTOCOL.md`; owner boundaries in decision brief |
| negative-intent frontier | D5 design hypothesis | experiment defined; not a D1 blocker |

Historical first-wave lanes, model routing, prompts, handoffs and launch manifest are archived. Do not recreate them as a standing organization.
