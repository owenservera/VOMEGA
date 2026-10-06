# VOMEGA session entry

Read `.project/SITREP.md` first. Its Orientation section says what VOMEGA is
for, what the current mission is, what is fixed, what is proven and where each
kind of state lives. `.project/META-TRACKER.md` holds the authority ladder, the
Labs and the full program map.

The hard boundaries are the invariants in `seed-docs/INVARIANTS.md` and the
proof boundaries in `seed-docs/PROOF-AND-MATURITY.md`. Owen's current
first-release mission is also protected until he explicitly changes it. The
project also preserves the **existence and purpose** of its major Labs as
owner-directed proving environments; their internal architecture, mechanisms and
outputs remain hypotheses. Everything below those boundaries — candidate designs,
Locks, lanes, roadmap milestones, task IDs, model routing, dev-machine topology,
and implementation strategy — is a hypothesis or coordination aid. Read the complete seed
before a major commitment, and treat the seed's design documents as candidates.
Historical decision numbers in baseline comments are evidence leads, not
inherited project authority.

Bootstrap is complete. `seed-docs/CODEX-BOOTSTRAP-START-HERE.md` is the record
of how it was run, not a current procedure.

Before interpreting any contradiction between documents, record local `HEAD`,
compare with `origin/main`, and fast-forward a clean checkout that is behind.

Before substantive repository work, follow
`.project/agentic-launch/DEV-AGENT-REGISTRATION.md`: self-checkout, then create
or verify one bounded session claim under `.project/agentic-launch/claims/`.
If the work is Ratchet-tracked, also use the Ratchet's own task claim/lease.
These two claims answer different questions and neither is proof.

Do **not** duplicate every short-lived task into STATUS and COMMONS. Update
`.project/agentic-launch/STATUS.md` when a major execution slice materially
starts, changes or ends. Append to `.project/COMMONS.md` when there is a
material result, blocker, request or cross-session handoff. Independent research
and review may run in parallel; give editing workers explicit write surfaces and
preserve other workers' changes. Code changes need a reviewer who did not write
them.

For D1 implementation, read
`.project/deliverables/D1-EXECUTION-ACCELERATION-DIRECTIVE.md` and
`.project/ratchet/OPERATING.md`. Default to the Ratchet packet + red gate +
directly named source rather than rereading the entire project. If an executable
gate already defines the task, implementation should normally move that
falsifier rather than create another design document. Genuinely D4/D5 design work
still gets a real design cycle under the PM design-intensity rules.

Route events as part of normal work: new objectives to Coordination; research
questions to Research; implementation or setup failures to Product; verification
gaps or failed checks to Truth plus Product. Record material requests, owners,
evidence and next actions in the existing claim/Commons surfaces rather than
creating another tracker. Never infer that an agent, lane, habitat, background
service or named provider is alive because a document names it.

Use `scripts/omega.ps1` on Windows or the documented Bun commands.
`omega:quick` proves only its named local slice. `omega:test`/`omega:gate` run the
broad suite and currently expose missing historical inputs. Do not silently skip
those failures or claim the historical architectural gates have been restored.

Auth, provider and model configuration is read-only. Local evidence logs belong
in ignored `.local/`; commit sanitized claim and evidence summaries. Fixture and
simulated results are never reported as live.

Update project truth after proof or a material contradiction, and leave a
reconstructable handoff. No executor, model, harness or habitat is the permanent
project authority.
