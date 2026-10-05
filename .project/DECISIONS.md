# Decisions and uncertainty

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
| Can all five Space Bunny lanes actually run now? | configuration present; bounded evidenced-free request/health proof needed; configuration never rewritten |
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
