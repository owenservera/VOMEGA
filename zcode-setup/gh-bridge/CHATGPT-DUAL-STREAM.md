# ChatGPT ↔ Oracle: dual-stream monitoring protocol (v0.1)

Status: **DESIGNED AND PUBLISHED, NOT AN AUTOMATIC CALLBACK TO A CHAT**. Complements [README.md](README.md); does not replace ZCode's Chief/Desk or the existing local bridge.

## The three clocks (do not conflate them)

| Mechanism | Trigger | Minimum/target delay | Can read a plain push? | Setup |
|---|---|---|---|---|
| Local Windows intake | Windows Task Scheduler invokes `bridge.mjs once` | Target every 1 minute while Windows is awake | Yes, via `git fetch` | [Install-Watcher.ps1](Install-Watcher.ps1) with `-Apply`, opt-in |
| ChatGPT Work event | Supported GitHub pull-request activity | Event-driven, not a promised SLA | **No documented raw-push trigger** | Must be configured and authorized in Work by the user |
| ChatGPT ordinary scheduled task | Timer + read-only GitHub lookup | **At most once hourly** | Yes, can inspect public GitHub state when run | ChatGPT must explicitly create a timer for the monitored commit |

ChatGPT does **not** receive inbound arbitrary webhooks into a pinned normal chat. A scheduled task is a separate future run; it may notify the user but does not guarantee changing an earlier chat. Work credits/entitlements are not guaranteed. Scheduled ChatGPT tasks cannot check every minute. The 1-minute interval belongs to the **Windows local receiver**, not to ChatGPT.

## Contract: every ChatGPT-authored bridge push in a communication session

1. Commit scoped docs/tasks; verify the **actual** pushed commit SHA and canonical GitHub URL.
2. Identify a correlation ID (usually task ID) and expected evidence source, such as a specifically labeled `oracle-report:` pull request or `ops/local-state` snapshot. Never treat a local-only ACK as remotely visible.
3. **If this commit creates a task expecting an Oracle reply**, create a **dedicated hourly, condition-based ChatGPT watch** for that task if scheduled tasks are available. For documentation-only commits with no expected Oracle reply, record monitoring as not applicable instead of creating a redundant watch. Prefer a finite 24- or 48-run horizon; no blanket forever monitors. If unsupported, explicitly report that monitoring was *not* armed. Never claim it was configured without a successful scheduling response.
4. Where available, link to a separately configured Work event-trigger task for GitHub PRs; if Work credits are exhausted, hourly scheduled monitoring remains the fallback.
5. Publish the monitor ID, commit SHA, expected signal, maximum watch duration, and what remains manual in the user-facing response.
6. On a later run, check the repository/report evidence, not just the task's own published files. Notify only for **new, correlated, meaningful** evidence, a confirmed failure, or a deadline breach. Do not repeatedly send identical no-change notifications.

Monitoring is an observation right, **not execution authority**. A PR is a report, not proof by itself. The bridge only delivers `review_only` task manifests and never runs arbitrary commands from GitHub.

## Correlation and result states

Use `request_id` + `source_commit` as a stable monitor key. Reports may have a monotonic `revision`; dedupe on key + revision + evidence commit.

- `PUBLISHED`: request committed to GitHub (ChatGPT can verify).
- `RECEIVED`: Windows intake created a local inbox record (not visible from GitHub until explicitly reported).
- `REVIEWED`: Oracle/Chief evaluated whether the proposal is authorized.
- `APPLIED`: approved instructions were acted on, with a change list.
- `VERIFIED`: independent gates/evidence support claimed outcome.
- `BLOCKED`: explicit blocker, failed validation, or unavailable receiver.
- `EXPIRED`: monitoring horizon ended without attributable completion evidence.

`RECEIVED` never implies `APPLIED`; `APPLIED` never implies `VERIFIED`. Treat unknown as unknown, not a hidden success.

## Work stream setup, optional

In ChatGPT Work, create an event-triggered task for supported GitHub PR events on `owenservera/VOMEGA`. Proposed task text:

> For authorized pull-request events on owenservera/VOMEGA, review only PRs explicitly labeled in their title or body as `oracle-report:` and containing a known `request_id` and `source_commit`. Check linked evidence and commits; distinguish self-reported progress from independent test proof. Report changed state, blocker, and next action. Do not merge, run untrusted code, alter permissions, or change provider credentials. Avoid repeating unchanged reports.

A connected GitHub app alone does not arm the Work event. User must review its event, condition, prompt, and authorization in Work. PRs and details in a public repository must contain **no secrets, private customer data or sensitive machine state**.

## Hourly fallback task template (one watch per pushed bridge request)

Use a finite hourly `condition_watch`, normally `RRULE:FREQ=HOURLY;COUNT=48` (48 checks, not a guaranteed 48-hour precise SLA).

> Check GitHub repo owenservera/VOMEGA for a new `oracle-report:` pull request, commits, or sanitized `ops/local-state` report directly correlated to request <REQUEST_ID> sent at commit <SOURCE_SHA>. Compare with existing reported evidence; notify only on new meaningful progress, verified outcome, blocker, or if the finite watch expires without proof. Never present an unobserved local receipt as completed work. If no new evidence, do not notify. No merging or executing code.

ChatGPT scheduled tasks have a **maximum once-hourly frequency**; an hourly watch is an imperfect fallback, not a minute-level webhook.

## Bootstrap and safety gates

- First validate with `smoke-001`: local inbox entry and local receipt from [README.md](README.md); actual PC result is **not yet verified here**.
- Only after local success, consider a PR reporting adapter. Use the existing Chief/Desk authority and redaction checks.
- Public `main` cannot command execution on Windows. Autonomous execution requires private authenticated control-plane design, replay protection, scope ACLs and owner-approved policies.
- A PC that is sleeping/offline cannot run the minute watcher. Do not confuse a successful GitHub commit with delivery.
- Do not broaden current VOMEGA worktree ownership, silently run setup, or modify auth/model/provider configuration.
