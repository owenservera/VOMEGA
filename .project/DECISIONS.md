# Decisions and owner boundaries

Date: 2026-10-06. Historical bootstrap decisions are preserved in the documentation archive. This file contains only current owner decisions/corrections and open boundaries that must not be settled by drift.

Nothing here is an invariant; invariants live in `seed-docs/INVARIANTS.md`.

## Owner-selected first public product

The first public release target is the floating Windows command box defined in `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`.

Setup, routing, contextual help and the first external capability (`prompt.send`) should use one explicit semantic command system. This is the current mission, not permanent surface architecture.

## Owner corrections about project structure

- The 67-program Meta Tracker preserves whole-program visibility; it is not a backlog or execution order.
- PM manages only the five owner-selected accelerator programs in `pm/scope.json`; PM has no program-selection/ranking authority.
- D1/Ratchet is the current bounded implementation/proof system; the old release roadmap is reference history.
- Lanes/Locks/waves/harnesses are temporary coordination mechanisms, not permanent organization or architecture.
- The map preserves possibilities; execute only the next evidence-bearing slice.
- No model, harness or habitat is permanent project authority.
- Daintree and ZCode are separate habitats; neither is assumed to control the other.
- Auth/provider/model configuration remains read-only unless Owen explicitly directs otherwise.

## Still needs Owen

The live Provider decision brief is canonical for the first three items:
`live-proof/OWEN-DECISION-BRIEF.md`.

1. **R-2 — Provider terms / web-UI automation position.**
   Current stop: no live submission.
2. **RD-8 — prompt/response content retention.**
   Current conservative default: structural receipts only.
3. **RD-10 — consent scope for `prompt.send`.**
   Current conservative default: per-send consent.
4. Whether **"If Ω can load it, Ω can explain it"** becomes an adopted product invariant with a core Reflection obligation or remains a design direction.
5. What **Chrome master/slave** commits to beyond browser-mediated/no-AI-API-leg intent while transport family remains open.
6. Whether **Model routing** is required in first-release product scope or merely supported by the semantic model.

Until Owen decides otherwise, conservative defaults constrain experiments but do not become permanent product law.
