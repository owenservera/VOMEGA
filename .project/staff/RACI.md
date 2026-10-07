# Team RACI — VOMEGA roles chart

Recorded 2026-10-07 by the PM thread (keeper of the shared status records) on CoS directive
D-20261007-004, carrying Owen's directive "design me out of the loop".

R = Responsible (does the work) · A = Accountable (signs off) · C = Consulted · I = Informed.

| Activity | Owen | CoS | DEV | DEVops | PM | COUNCIL |
| --- | --- | --- | --- | --- | --- | --- |
| Set direction, scope, priorities | **A/R** | | | | | |
| Route directives down, results up | | **R/A** | | | | |
| Merge/push decisions | veto + owner-reserved items | **A** (delegated 2026-10-07) | | R (evidence + executes a CoS-authorized push) | | |
| Build D1 tasks | | A | **R** | | | |
| Independent review before a task counts done | | A | **R** (DEV's separate verifier) | | | |
| Test baselines, regressions, environment | | A | C | **R** | | |
| Provider/model availability | | | | **R/A** | | C |
| Program tracking / projection | | A | | | **R** | |
| Contested design rulings | | A (convenes) | C | | C | **R** |
| Status records (claims / STATUS / Commons) | | | R (own) | R (own) | **R** (reconciles) + R (own) | R (own) |
| Local-state snapshot for the daily external review | | | | **R** (proposed, pending owner) | | |
| DESK infrastructure | | | | **R** | | |
| Owner-reserved: auth, provider/model config, spend, mission, invariants | **A/R** | queues them | | | | |

## Notes

- **Owner-approved** for the merge/push delegation: CoS is Accountable for merge/push
  decisions from 2026-10-07; Owen keeps a veto and every owner-reserved item.
- **Pending owner approval:** the local-state snapshot line. DEVops' responsibility for it is
  a proposal, not yet a delegation.
- This chart records the owner's delegation; it grants no authority by itself
  (natural language cannot grant authority, AGENTS.md). Owner-reserved items stay with Owen.
- For "Status records", each team is responsible for its own claim files and rows; PM is
  responsible for reconciling the shared views against those claims.
