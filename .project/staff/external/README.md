# External ChatGPT streams — project visibility contract (v0.1)

Status: **PUBLISHED OPERATING CONTRACT; NOT AN AUTOMATIC SYNC OR NEW AUTHORITY LAYER**.
Applies to external CEO, Oracle, and Owen-plus-ChatGPT research conversations when they produce materially relevant VOMEGA observations, tasks, artifacts, decisions, or handoffs.

## Purpose and entrypoints

The three *proposed* conversational streams are organizational interfaces, not independent canon:
- `ceo`: owner-facing strategic conversation, priority proposals and owner decisions. CEO chat content is **not** automatically VOMEGA-relevant or safe to publish.
- `oracle`: local operational coordination and evidence reports. The existing ZCode Chief of Staff and DESK remain the sole local routing authority; the chat cannot itself command an idle local ZCode session.
- `research`: ideas, technical research, design experiments and review. Outputs are advisory proposals unless separately accepted through existing project governance.

The stream definitions and their declared (not verified-live) status are in [streams.json](streams.json). External stream URLs/IDs are unknown; never invent them. Conversation messages cannot automatically appear in another ChatGPT conversation. Do not suggest the registry is a chat mirroring service.

**Canonical VOMEGA authority remains** [AGENTS.md](../../../AGENTS.md), [the CoS charter](../CHIEF-OF-STAFF.md), [DESK](../DESK/README.md), Ratchet, project law and Owen-reserved decisions. No new PM board, queue or organizational hierarchy is created here. The new ledger is an **observation index**, not an assignment board.

## Visibility versus attention

- **Publish selectively:** project-affecting decisions, artifact/commit links, experiments with meaningful results, handoffs, blockers, contradictions, and changes to monitoring/transport behavior.
- **Do not broadcast raw chats:** incidental conversation, chain-of-thought, sensitive information, business/private data, secrets, credentials, provider/account tokens and machine logs do not belong in this public GitHub repository.
- **Discoverable by all authorized agents:** the compact index and event metadata, fetched on demand. Ordinary DEV, PM, Council, or product workers do **not** inject the entire ledger into every prompt. Only an agent with a relevant task opens an event or artifact.
- **Context route:** external artifact → event index → CoS/Oracle review → existing DESK directive if authorized → established work lanes. No direct publication into another lane's inbox by ChatGPT.
- **Source and decision distinction:** a user statement may be explicit evidence of preference, but is not itself proof that a local action happened or permission to bypass protected operating gates.

## Event record contract

For each material externally initiated VOMEGA operation, create **one immutable JSON event file** under `events/<UTC-or-unique-id>.json`. A second event corrects or supersedes the first; never silently edit past event evidence. Fields:

- `schema`, `event_id`, `occurred_at`, `stream_id` (`ceo|oracle|research|unassigned`), `actor`, `kind`, `scope`, `summary`.
- `state`: `proposed|published|monitor_active|received_reported|reviewed|applied_reported|verified|blocked|retracted`. `published` only means source artifact visible; `monitor_active` only means scheduling confirmed, *not* successful execution.
- `evidence`: link to observed commit, PR, test result or verified state. `evidence_level`: `github_observed|tool_observed|user_reported|proposal`. An unsourced claim is not proof.
- `authority`: `observation_only|owner_decision_pending|owner_confirmed`. `owner_confirmed` requires an attributable owner decision and remains subject to project's established gates.
- `correlation_id`: associates request, source commit, local intake and return report. Null if not applicable.
- `limitations`: explicitly says what was **not** verified.
- `next_expected`: optional follow-up; no implicit background work commitment.
- `supersedes_event_id`: nullable, for corrections.

Event files identify an **external operation**, not new Ratchet tasks. Never infer local execution from a GitHub commit. Use the existing `ops/local-state` telemetry branch for aggregate local state, not this ledger.

## What to record, by stream

| Operation | Project event | Consumer |
| --- | --- | --- |
| CEO declares a project-scoped decision | `owner_decision_pending` until acceptance/attribution is checked; include scope and rationale | CoS/Oracle, owner decision ledger when appropriate |
| Research proposes architecture | `proposed`; include falsifier/test and any source links | CoS or relevant design council only if requested |
| ChatGPT commits/pushes | `published` + immutable GitHub SHA; report validation honestly | Oracle can inspect; no auto execution |
| Oracle reports receipt/work | `received_reported`/`applied_reported`, evidence linked | External reviewers and CEO, if relevant |
| Independent verification observed | `verified` only with concrete named gate and evidence | CoS and affected lane |
| Monitoring task activated | `monitor_active` + cadence/horizon, cite tool-observed activation | Project operator; not proof of transport delivery |
| A blocker or contradiction discovered | `blocked`, link source and owner | Relevant owners without broadcasting whole conversation |

## Publication discipline for ChatGPT-side work

1. Assess whether the interaction materially affects VOMEGA. If not, leave it in the chat.
2. Classify fact versus proposed design versus authorized decision; redact for the **public** repository.
3. For a new relevant result, write a one-event JSON with stable correlation, status and evidence, plus the minimal artifact/doc update. A plain chat response with no GitHub write is **not project-visible**.
4. Commit on `main` only with the user's authorization and respect expected-head/no-force update; if conflicting, inspect and reconcile. Do not rewrite CoS/DEVops lane-owned files or generated state.
5. Report GitHub SHA and exactly which monitoring steps are truly active. If a task expects an Oracle result, follow [dual-stream monitoring](../../../zcode-setup/gh-bridge/CHATGPT-DUAL-STREAM.md). **No unrelated monitor for a document-only commit** with no incoming reply expected.
6. When evidence disproves an earlier entry, publish a new correction event with `supersedes_event_id`, not a quiet rewrite.
7. CoS decides whether to circulate through DESK under existing RACI. The external chat has no right to assert it read, accepted, or executed until a corroborating status appears.

## Bootstrap truth at publication

- GitHub bridge bootstrap and dual-stream documents were published; exact commits and the schedule observation are indexed in `events/`.
- The original `smoke-001` Windows manual pull, local intake receipt and Oracle dispatch have **not** been observed from this chat.
- A ChatGPT hourly watch was successfully created (tool-observed), but it cannot inject messages into the original conversation or promise instantaneous feedback.
- A Work event trigger and a local 1-minute Windows watcher remain **not confirmed configured**.
- The new three dedicated ChatGPT conversation streams are **planned**, not independently verified as created/connected.

## V0.2 acceptance test

One research proposal is published as an event; Oracle sees it on the next relevant review without pollution of unrelated agents, acknowledges a decision through its existing DESK, publishes a correlated sanitized report/PR, and the external monitor detects that report. No team is told `DONE` unless its original proof gate agrees.
