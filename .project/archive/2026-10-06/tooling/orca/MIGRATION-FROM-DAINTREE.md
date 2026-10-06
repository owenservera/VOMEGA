# Migration from Daintree to Orca

**Status:** owner-selected direction; implementation/reconciliation waits for Orca research and proof.

## Decision

VOMEGA intends to switch to Orca **before meaningful Daintree adoption**.

This is favorable because Daintree has not become an embedded project dependency on the primary Windows environment. The migration is therefore mainly a change in intended execution habitat, documentation and future setup—not a large runtime data migration.

## What Orca is intended to replace

Subject to research/proof, Orca should replace Daintree's intended role as the primary surface for:
- multi-agent execution visibility;
- worktree/workspace coordination;
- supported CLI-agent launch/control;
- operator steering;
- fan-out/fan-in;
- review/integration workflow where useful.

## What Orca does not replace

Orca does not replace:
- VOMEGA product/project truth;
- Meta Tracker;
- PM design;
- Git;
- tests/evidence;
- ZCode;
- OpenCode;
- Codex;
- Grok Build;
- Claude Code;
- model/provider/account configuration;
- Context Bundle or Elephant research.

## Daintree ideas worth retaining as references

Even after dropping it as a dependency, keep these design themes available for comparison:

- orchestration/control-plane rather than product truth;
- fleet state visibility;
- context injection;
- calm exception-driven operator UX;
- permissioned actions/auditing;
- resource/concurrency governance;
- worktree isolation;
- review-centric fan-in.

These are reference ideas, not requirements to copy.

## Historical documentation

Current files in `../dev-machine/`, `../agentic-launch/`, `../DECISIONS.md` and `../ENVIRONMENT.md` contain evidenced Daintree observations and an earlier Daintree↔ZCode boundary.

Do not erase that history.

After Orca is validated:
- mark old Daintree operating assumptions historical/superseded;
- preserve dated evidence that Daintree existed/worked where observed;
- update only current-runtime guidance;
- keep the rule that no habitat becomes permanent project authority.

## Important correction to earlier architecture

The older system needed a hard statement:

> Daintree does not launch, supervise or manage ZCode.

The new Orca design should **not automatically inherit or invert** that statement.

Whether Orca can directly launch/control ZCode is a research and local-proof question. Until verified, write:

> Orca is intended to coordinate the heterogeneous execution pool. The exact integration depth for each harness is unknown until researched and proven.

This prevents another documentation drift from assumption into “fact”.
