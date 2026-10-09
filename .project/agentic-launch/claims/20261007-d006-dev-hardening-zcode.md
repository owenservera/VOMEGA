# Development Agent Claim

Claim ID: dev-d006-hardening
Status: CLAIMED
Registered at: 2026-10-07
Agent / harness: DEV / ZCode
Model: claude-code-oauth/claude-opus-5-5 (session, per environment; earlier entry naming codex-oauth/gpt-6.1-sol was an error); subagent model is not exposed by Agent
Source HEAD: 5498fa55f866da985b696790b1cf986e9dccf008 (other threads can commit concurrently)
Branch / worktree: main / C:\0-BlackBoxProject-0\VOMEGA
Work: Execute D-20261007-006: strengthen D1-016/D1-017 falsifiers, enforce freshness in the single READY law, preserve unknown explicit route intent rather than select a default.
Task refs: D1-016, D1-017
Expected write surface: b-world.gate.test.ts (actual gate file, not c-command as directive states), compile.ts, validate.ts; Ratchet spec-change/promote/review and generated projections. D-006 explicitly expands the task packet surface.
Expected proof: strengthened gates red before fixes, green after; independent automated adversarial re-review.
Dependencies/blockers: supersede semantics being checked; no hand-editing locks; Agent has no model parameter, so D-007 cannot configure fallback as requested.

## Disposition
D-007 automation updated with the requested ladder and explicit tooling limitation; no provider/model config changed. D-008 acknowledged without selecting a session route on the owner's behalf.

## Closeout

Final status: COMPLETE (D-006), PARTIAL (D-007 tooling limit)
Final commits: d20d605 (gates + spec-change), f6c603d (validate.ts freshness; compile.ts no-retarget), 76fe02b (promote), bd241e2 (TRV accept)
Tests / evidence: RATCHET_MODE=probe verify D1-016 (4/4) and D1-017 (5/5) green; status --probe 45/85, REGRESSED 0; check ok. TRV dev-trv-d006 (separate automated subagent, not human) mutation-tested: each hardened gate goes red on its targeted mutant; at d20d605 the old code compiled stale W3 and Gemini READY + COMMITTED.
Deviation from directive: did NOT supersede D1-016/017 — supersede is permanent retirement with no inverse (cli.ts:453), would unblock dependents, and promote skips existing keys (cli.ts:401). Instead kept gate names, recorded spec-change, promoted the new gates, re-reviewed. Gates are in b-world.gate.test.ts, not c-command as the directive said.
Known gaps: (1) unquoted "send hello to Gemini" still retargets to claude-work and compiles READY — fix is quoted-payload only; gate name overstates scope. (2) unheldRoute treats "send 'x' about/for/into ..." as unknown target (fails safe, ungated). (3) no gate pins freshness-before-authority order. (4) spec.json surface for D1-016/017 says world.ts/worlds; code is in validate.ts/compile.ts. (5) lock.promoted keeps old vacuous promotion metadata (by/at/head) — ratchet lineage gap.
Next handoff: CoS/COUNCIL for gaps 1, 4, 5; owner-reserved residue untouched.

## D-20261007-14329 (unquoted Gemini retarget)
Commits: 46de059 gate (unquoted form) · cc2e96f fix v1 · 70b68d5 projections · dev-trv-d14329 REJECT (6 variants still retargeted: ! ? -, trailing clause, quote after route) · 2aabfed gate iterates the class + spec-change · f0f30a0 fix v2 · 3917d73 projections · ff3e3f9 TRV dev-trv-d14329b ACCEPT.
Evidence: mutants (revert fix / require quote / disable) all red; REGRESSED 0; ratchet check exit 0.
Open: (R2) compile.ts:155 multi-recipient "send hello to Gemini via work claude" still ready on claude-work — unheld target dropped; gate name broader than behaviour. (R1) pre-existing payloadOf contiguous slice keeps route words when a terminator follows (compile.ts:525). (R3) "on" as target prep: "send hello on Monday" refused (fail-safe). (R4) gate does not pin mention text.

## D-20261008-013 (multi-recipient unheld target) — IN PROGRESS
New gate "an unheld recipient named beside a held one is never dropped" (D1-017; separate gate, nothing widened or renamed): bc39ae1 (red, spec-change). Fix 79c204d: routeChain/unheldLink in compile.ts — trailing recipient chain read right-to-left; any unheld link keeps the route unresolved. "on" excluded from chain preps so "send note on Monday to work claude" stays READY. Promoted 880ea58. Probe 46/86, REGRESSED 0; ratchet check exit 0.
Not in scope (did not fall out of this change): payloadOf contiguous slice still keeps route words in some prompts ("hello to Gemini, then", compile.ts payloadOf).
Pending: separate-verifier review, held until the DEVops model-allocation directive arrives (D-013 instruction). No reply sent yet; D-013 stays open.
D-013 closed (D-014 lifted the allocation wait): TRV dev-trv-d013 ACCEPT 5da811e, mutants all red, check exit 0. Residual: preposition ellipsis ("to Gemini and work claude") pre-existing, needs its own task.

## D-20261008-015 (preposition ellipsis) — DONE
Gate 3526b5b (new, separate) · fix d92ed41 · promote d7cd86b · TRV dev-trv-d015 ACCEPT 1b958fd (mutants all red). check exit 0, REGRESSED 0, 47/87.
Open: connector after the route over-refuses (fail-safe, introduced, ungated); "to work claude, Gemini" and "and personal claude" still dropped (pre-existing); payloadOf leak.

## D-20261008-016/017 — BLOCKED (design question for COUNCIL)
Gates 5946a5c (3 gates) + 0a295e4 (send-verb gate), fixes 7535f11 + 3a46298, promoted a5df76c/f1f306f. check exit 0, REGRESSED 0, 51/91.
Reviews: dev-trv-d016 REJECT (e154212: "and tell Gemini" READY, introduced); dev-trv-d016b REJECT (e62e67e: "and please tell Gemini" READY, introduced by 7535f11; same class also open as ". tell Gemini", "tell Gemini to work claude", pre-existing).
Escalation: each word-list patch leaks a new phrasing. The question is a design rule, not a patch: when text follows a held route and contains a name that grounds nothing, should the command be refused outright (fail-safe), rather than guessing payload vs recipient? DEV stops patching this class until COUNCIL rules.

## D-20261008-018 — holding D1-017 class; took D1-042
Renderer 6a19fe0 (ui.ts), promoted 51a60c1. TRV dev-trv-d042 (a4ed4d1): ACCEPT D1-042, D1-044; REJECT D1-043 (gate blind to slot identity, e-projection.gate.test.ts:49-50) and D1-047 (regex matches stays-local, :84). Code upheld. Next: tighten those two gates via spec-change.

## D-20261008-019 — DONE
Gates 961bf48 (stricter, spec-change), ui.ts fix ebbd15d, TRV dev-trv-d019 ACCEPT 87f6737. Follow-ups: D1-047 local branch absence-only; D1-043 Model slot unpinned.
