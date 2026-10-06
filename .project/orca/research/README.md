# Orca + harness research index

**Research pass:** 2026-10-06  
**Orca stable baseline:** `v1.4.220` (released 2026-10-04)  
**Method:** primary Orca docs/source at the stable tag first; current `main` only when explicitly marked. Official harness docs/source are secondary inputs.  
**Rule:** this folder summarizes sources; it does not vendor/copy third-party documentation.

## Why the stable tag matters

Orca ships rapidly and its website generally reflects `main`. VOMEGA should not build its operating assumptions from a feature that exists only on `main` while the installed stable binary does not yet contain it.

For this design:
- **STABLE** = present/documented at Orca `v1.4.220`;
- **MAIN-ONLY / NEWER** = observed on Orca `main` but not relied upon;
- **LOCAL-PROOF-REQUIRED** = documentation/source support exists but VOMEGA has not demonstrated it on Owen's machine.

## Research notes

- [ORCA-STABLE-1.4.220.md](ORCA-STABLE-1.4.220.md)
- [HARNESS-ZCODE.md](HARNESS-ZCODE.md)
- [HARNESS-OPENCODE.md](HARNESS-OPENCODE.md)
- [HARNESS-CODEX.md](HARNESS-CODEX.md)
- [HARNESS-GROK-BUILD.md](HARNESS-GROK-BUILD.md)
- [HARNESS-CLAUDE-CODE.md](HARNESS-CLAUDE-CODE.md)

## Primary Orca sources

Stable-tag sources used in this pass:

- https://github.com/stablyai/orca/tree/v1.4.220
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/agents/supported.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/cli/orchestration.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/skill-guides/orchestration.md
- https://github.com/stablyai/orca/blob/v1.4.220/skill-guides/orca-cli.md
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/model/worktrees.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/model/orca-yaml.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/docs/reference/windows-setup-shell.md
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/agents/usage-tracking.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/agents/claude-code.mdx
- https://github.com/stablyai/orca/blob/v1.4.220/docs/site/content/docs/agents/codex.mdx

Source-level integration evidence was inspected for ZCode, OpenCode and Grok in addition to the public docs.

## Cross-cutting conclusions

1. Orca **does** have a real structured orchestration runtime in stable: Run, Task, Dispatch, supervised worker, message, question/reply, decision gate, heartbeat and explicit `worker_done`.
2. The orchestration layer is marked **Experimental** in stable. VOMEGA should use it as replaceable runtime machinery, not architecture law.
3. Orca's worktrees are isolation of Git checkouts, **not a security sandbox**.
4. Orca's default supported-agent launch posture tends toward permission-bypass/autonomous flags. VOMEGA bootstrap must explicitly choose **Manual first**.
5. ZCode is a first-class/deep integration in Orca stable, but it requires a **TUI-capable standalone `zcode` CLI**. The ZCode desktop-bundled runtime shape recorded on Owen's machine is not sufficient evidence of that.
6. Claude Code and Codex have the deepest stable account integration.
7. OpenCode is supported in stable with auto-setup/status and as an orchestration worker. Newer `main` contains deeper OpenCode launch/prompt plumbing that stable does not yet have.
8. Grok is a built-in Orca agent with auto-setup and stable model/effort catalog code, but VOMEGA still needs local proof of exactly which Grok Build behaviors are visible to Orca.
9. Harness-internal subagents/teams should be **nested compute within one Orca Dispatch**, not independent top-level VOMEGA authorities.
10. The first setup should be pinned to stable and upgraded only when a newer capability is needed and tested.
