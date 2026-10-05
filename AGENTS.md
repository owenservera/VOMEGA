# VOMEGA session entry

Read `.project/SITREP.md` first, then `.project/COMMONS.md` for ownership and handoffs.
The operational bootstrap is `seed-docs/CODEX-BOOTSTRAP-START-HERE.md`; the seed's
`AGENTS.md`, vision and invariants guide this repository. Read the complete seed
before major commitments. Historical decision numbers in baseline comments are
evidence leads, not inherited project authority.

Claim a bounded task in Commons before editing. Independent research and review
may run in parallel; assign explicit file ownership to editing workers. Preserve
other workers' changes. Independent review is required for code changes.

Route events as part of normal session execution: new objectives to Coordination;
research questions to Research; implementation/setup failures to Product;
verification gaps or failed checks to Truth plus Product. Record the request,
owner, evidence and next action in the appropriate Commons room. Dispatch an
existing available specialist when useful; never infer that a background service
or a named provider is alive from these routing instructions.

Use `scripts/omega.ps1` on this Windows machine or the documented Bun commands.
`omega:quick` proves only its named local slice. `omega:test`/`omega:gate` run the
broad suite and currently expose missing historical inputs. Do not silently skip
those failures or claim the historical architectural gates have been restored.

Auth/provider configuration is read-only. Local evidence logs belong in ignored
`.local/`; commit sanitized claim/evidence summaries.
Update project truth after proof or a material contradiction, and leave a
reconstructable handoff. No executor is the permanent project authority.
