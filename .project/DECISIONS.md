# Decisions and uncertainty

This file holds three different kinds of entry. They do not carry the same weight.

| Class | Entries | Who may change it |
| --- | --- | --- |
| Owner product decision | "Owner product decision" and "Owner corrections" sections below | Owen |
| Bootstrap implementation decision | Items 1–7 | Anyone, on evidence, recorded here |
| Open question | The table, plus RD-1…RD-11 in `roadmap/ROADMAP.md` | Closed by evidence, a falsifier, or an owner decision where marked |

Nothing in this file is an invariant. Invariants live in `../seed-docs/INVARIANTS.md`.

## Bootstrap implementation decisions

Decisions made 2026-10-05 from current evidence; all may be superseded explicitly.

1. **Keep the two-part seed layout.** No move of omega-baseline/ or reconstruction
   of old BCP project management. Evidence: baseline contains useful mechanisms
   but omits historical supporting infrastructure.
2. **Restore executable truth first.** Remove absent required workspaces and old
   nonexecutable tooling commands; retain honest broad-suite failures. The lock
   change prunes missing workspace entries without upgrading external packages.
   Reconsider if corresponding sources are intentionally restored with provenance.
3. **Select local continuity/isolation.** Real-law + Vault is a complete bounded
   local journey and prerequisite for provider evidence. Falsifier: A and B
   sharing data, or inability to recover A after complete child-process exit.
4. **Bind explicit ${VAULT} config before signing.** For the new local composition,
   canonical data lives under the selected absolute vault. The signed recipe
   identifies the resolved data path; booting it does not silently inject another
   store. This locally compiled recipe is instance-bound, not a portable full
   product backup. Existing ${TMP}/absolute/custom configs keep their semantics.
   Relocation and whole-instance export remain separate experiments.
5. **Use CLI for this proof.** Existing web endpoints need trust/access-boundary
   work; no polished frontend is required to falsify storage. CLI remains a
   trusted root-principal developer surface, not a complete human-language UX.
6. **Keep provider evidence honest.** Fixture parsing, localhost HTTP, local file
   messages and simulated LLM responses do not establish authenticated browser
   action, selected Account, or durable Work. No authentication/provider changes.
7. **Minimal Commons plus available specialists.** Four accountable coverage rooms
   and session-event routing suffice; no scheduler/dashboard/orchestration daemon
   is being claimed or built. Retain machinery only when it improves validated
   progress. Executors and heads are replaceable.

Open questions and evidence that would change the plan:

| Question | Status / discriminating evidence |
| --- | --- |
| Can an existing browser tool expose a usable authenticated provider session? | untested; transport inventory and metadata-only read before new profile/extension |
| What proves selected Account identity? | open; provider-specific observation plus binding/expiry/switch falsifier |
| Can all five Space Bunny lanes actually run now? | superseded 2026-10-05: ZCode now routes through `openrouter/auto`, and ≥6 concurrent bounded workers were measured on that route. The five accounts are historical configuration, never individually probed. Capacity is measured per launch, not assumed |
| Which historical test inputs deserve restoration? | missing support classified; restore only when needed by a selected capability with provenance/license clarity |
| Can owner exports become useful continuity earlier than browser control? | pure parsers present, writer absent; scoped source/identity/idempotency proof needed |
| What survives relocation/export of a whole instance? | Vault data copy exists; signing root, recipe and account relation continuity remain unknown |
| Does background Work survive interruption? | no implementation proof; transient scheduler is insufficient |

Historical D-ids in comments remain archaeology references. No constitution or
durable product invariant was changed by these bootstrap implementation decisions.

## Owner product decision — first public release shape

On 2026-10-05 the owner selected the concrete first-release product design documented in `seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`.

The target is a small floating Windows command box through which the user can:
- register Provider Accounts in natural language;
- see evidence-backed capabilities appear as those relationships are established;
- use the same deterministic semantic command machinery for setup and capability invocation;
- receive real-time visual interpretation/disambiguation feedback;
- access contextual Wiki/help grounded in current system capability/account truth;
- first, send a prompt through any known supported Provider Account.

This supersedes the bootstrap Release Gym treatment of the floating control center as merely a deferred speculative candidate.

It does **not** supersede the current evidence ordering: real browser transport and Account evidence remain immediate blockers to a truthful `prompt.send` release path.

## Owner corrections — 2026-10-05 and 2026-10-06

These are owner statements about how to read the project. They constrain the documents, not the product.

1. **The nine launch lanes are not the program.** SDW/LNC/VFX/SKW/EXP/PRV/RTE/DEV/TRU are temporary coordination vocabulary. `META-TRACKER.md` is the whole-program coverage map, and it is not a backlog either.
2. **The map preserves possibilities; it does not prescribe the path.** Track the whole destination; execute only the next evidence-bearing slice.
3. **Locks are temporary interoperability agreements.** Stable enough for parallel work, explicitly falsifiable, replaceable when better evidence appears. A Lock is not an architectural freeze.
4. **Daintree cannot launch, supervise or manage ZCode.** They are separate execution habitats. If both are used, they coordinate through Git, task artifacts, tests, evidence, STATUS and handoffs. No document may describe a Daintree → ZCode control hierarchy.
5. **No permanent agent organization.** Harnesses, models and habitats are resources routed by difficulty, capacity, evidence, independence value, context, cost and observed performance.

## Still needs Owen

Recorded here so they are not settled by drift. Detail and reasoning are in `META-REVIEW-2026-10-06.md`.

- RD-8: whether prompt and response content is ever retained (default today: structural receipts only).
- RD-10: consent scope for `prompt.send` (default today: per send).
- R-2: provider terms-of-service position on web-UI automation, before any live submission.
- Whether "If Ω can load it, Ω can explain it" becomes an adopted invariant with a core Reflection obligation, or stays a direction.
- What "Chrome master/slave" commits to beyond "browser-mediated, no AI-API leg", given that the transport family (RD-1) is still open.
- Whether Model routing is in first-release scope or only admitted by the semantic design.

