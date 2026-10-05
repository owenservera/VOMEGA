# Bootstrap SITREP

As of 2026-10-05. Seed commit: `f03905e`. Start here on a fresh session.

The initially empty workspace now contains the cloned VOMEGA seed. Bootstrap
reconnaissance read all 22 seed documents and traced executable baseline seams.
The first local continuity/isolation slice is implemented and verified; it is not
yet a provider-webapp beta.

Current objective: make selected local Vault state persistent, isolated and
verifiable through the existing governed CLI, then prove one live browser/account
observation without confusing fixture captures with provider evidence.

Installation is repaired: the manifest no longer requires omitted workspaces;
the lockfile prunes only absent workspace records. Global tool/auth settings were
not changed. Supported scripts now invoke present entry points.

Supported verification passes: 62 tests, zero failures, 1,622 assertions across
seven files on Bun 1.4.2. Actual launcher append/read/verify/status commands pass
in separate processes, including relative Windows paths. Independent code review
approved the final diff; the TS specialist's full review stopped on absent lint
tooling, and no full static typecheck is claimed. Evidence and limitations are in
evidence/bootstrap.json.

Browser behavior is fixture replay. Provider sessions have no durable account
binding. Durable Work is absent despite stale composition grants. Broad tests
and old architectural gates depend on omitted tooling/examples/fixtures. The web
surface is an API backend with unguarded root endpoints, not a productized UI.

Codex, Git, Node, Bun, Chrome, alternate Claude and bundled ZCode are installed.
Five Space Bunny lanes are configured; no live model execution was established.
Use explicit executable routes in [ENVIRONMENT.md](ENVIRONMENT.md).

Next actions: preserve honest broad-suite blockers; probe the available browser
transport and Account evidence read-only; compare a
scoped export-import alternative if browser access cannot be proven.

Detailed truth: [REALITY.md](REALITY.md), [RELEASE-GYM.md](RELEASE-GYM.md),
[DECISIONS.md](DECISIONS.md), [COMMONS.md](COMMONS.md), and
[evidence/bootstrap.json](evidence/bootstrap.json). Seed intent constrains the
work; these operational artifacts are revisable evidence, not product law.
