# Context Residence, Flush, Compaction and Recovery

## Context is a managed resource, not an unbounded transcript

Separate **resident context** (versioned domain knowledge, source, invariants, historical decisions), **wave context** (verified new changes and active concerns), and **transaction context** (one worker request, proposed files, traces, temporary hypotheses). Resident is reconstructable from a committed manifest and snapshot pack; wave from accepted Git deltas and provenance; transaction is disposable after response evidence is logged. Do not let failed worker drafts permanently change Elephant memory. Track occupancy and effective attention/retrieval quality instead of pursuing maximal token fill.

## Flushing is not compaction

Soft flush: after a transaction, retain only its source-grounded findings and accepted verified effects, discard temporary content from the *next transaction's effective context*. Hard rotation: retire current context/session and initialize a new session from a deterministic pack and verified delta, with a continuity test. Auto-compaction: provider/platform-controlled shortening that may silently alter context representation. Record all three separately. In ZCode the documented `/compact` command and automatic compaction are not a guaranteed explicit programmatic flush mechanism. Verify actual session-context behavior rather than asserting memory was cleared.

## Proposed admission and budgeting

Reserve context for incoming request, response, and growth; report exact declared context limit, unknown effective limit and measured/estimated occupancy. Trigger early warning near a measured quality threshold, not only near the vendor's hard maximum. Prefer splitting or rotating over indefinite append. Measure token and correctness costs of full-source residency, selective file residency, indexed bundles, deterministic rebuild and prompt-cached stateless calls under matched tasks.

## Validity and invalidation

Every Elephant basis includes manifest version, source commit, pack hash, incorporated accepted commit range, observed unincorporated changes and known missing domains. Compute change impact by path manifests and dependency graph; a changed interface may invalidate more than the changed file's owning domain. If a response cites an outdated line, flag it and propose direct source re-verification. If a question depends on a non-incorporated commit, return `STALE` or `SCOPE_LIMITED`; do not silently answer as if HEAD were loaded.

## Deterministic flush/rebuild procedure

1. Freeze the node's current accepted epoch and enter DRAINING; reject or queue incompatible new requests.
2. Finish or cancel bounded outstanding transactions and persist their provenance, metrics and unverified status.
3. Extract **candidate** domain notes with precise source anchors, changed-line validity checks and confidence; promote only notes whose evidence survives.
4. Build the next context pack deterministically with a manifest, source IDs, digests and an explicit exclusion list. Never pack secrets, credential files, personal data, browser cookies or arbitrary raw captures.
5. Launch a fresh, distinct Elephant session and load the pack; record new context/session ID and token size.
6. Run hidden calibration questions and stale-source traps. If quality fails, restore service through E0/context bundle, not by hiding the failure.
7. Mark the old session retired, update routing atomically, and record flush/rotation cost. Historical old session transcripts may be bounded and redacted; they are not the source of project truth.

## Resuming after interruption

Restart must rebuild task scheduler from durable event log, reconcile orphaned child process state, check active worktrees, and recover current master approach versions. Elephant context can be reconstructed from source manifest, pack snapshot, wave deltas and validated notes, even if the original AI session is gone. An unknown or expired session handle is not a reason to fabricate a resume. Preserve actual unfinished tasks for explicit re-dispatch and mark their previous attempts interrupted.

## Tests that specifically attack context integrity

- Multiple patched versions of the same file; ensure older variants stop influencing answers.
- A rejected or failed worker idea; ensure it is not promoted as a stable invariant.
- Change outside Elephant's resident domain that affects an exposed interface; ensure dependency-aware invalidation.
- Two Elephants trained from different epochs; ensure disagreement and freshness warnings surface.
- Rebuild after power-off; run the exact same hidden domain questions and compare anchored answers.
- Force automatic vendor compaction; verify any continuity quality claims empirically and record lost references.

## What “flush succeeded” means

Not that the model said “I forgot.” Success requires a new effective context/session boundary or other independently verified isolation method, correct recovered domain facts, absence of forbidden stale transient facts in blind tests, valid source citations, and a durable event record tying old and new epochs together.
