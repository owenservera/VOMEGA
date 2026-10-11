# Token, Latency, Quota, Context and Cost Observability

## Goal

An end-to-end **hierarchical accounting ledger**, not a decorative token number. It must explain what each master, round, arm, session, subagent, Elephant consultation, compaction, context pack, model call, tool call and verification step consumed; what was provider-reported versus estimated; and how each cost affected **verified outcomes**. Agentic systems otherwise reward hidden orchestration overhead.

## Mandatory attribution dimensions

Every metering record has experiment/round/arm/master, task identifier and immutable benchmark ID, source commit and epoch, parent session and child session IDs, agent role, provider/model/runtime, operation type, event timestamp with clock source, execution phase, tool-call identity and billing route when disclosed. Track input, output, reasoning, cache-read/cache-write tokens as separately available categories; do not assume every vendor reports all categories or that categories sum identically. Preserve raw usage payload securely/redacted alongside a normalized interpretation and a `provider_reported`, `gateway_reported`, `locally_counted`, `estimated`, or `unknown` status per field.

## Additional metrics

Wall-clock start/end, queued wait, model call latency, tool latency, source load time, snapshot build time, refresh time, flush/rotate time, retries, cancellations, timeout rate, context occupancy/declared max and vendor auto-compaction events, throughput, API quotas consumed, estimated cost in currency and its dated price assumptions, memory/CPU/process counts where measured, test duration, accepted defects found, false-positive reviews and independent verification cost.

## Crucial accounting distinctions

A web UI may report daily global token usage, while experiment-attributable usage requires a child-level event ledger. Count parent-controller inference separately from four child agents; never double-count the same provider event in master and child rollups. Compute inclusive totals hierarchically and exclusive totals by removing child spending. Do not report missing usage as zero. Track hard spend cap, 5-hour/weekly quota (if applicable), provider failures and account pool as a budget constraint, not a guessed monetary saving.

Context length is **not** total billed tokens. Context residence is effective prompt capacity per call; cumulative tokens across rounds can greatly exceed any individual model window. A 1M advertised window is not a guarantee of persistent model memory, stable 1M usable capacity, or free repeated prompt ingestion. Benchmark cache effects separately. ZCode's documented automatic compaction buffer and local context-meter estimation differences are relevant—measure rather than trusting the display blindly.

## Scorecard: useful work economics

Primary measure = independently accepted task units / total end-to-end elapsed wall-hour, with parallel utilization and critical-path latency both reported. Include human interventions, source/context bootstrap, coordination, replay and flush costs. Complement with accepted task units per million consumed tokens, verified defect recall per review, mean/median latency, false-positive hours, confidence/reproducibility and budget use. Do not allow quality regressions to disappear inside a “speedup” number.

Compare E0, E1 and E2 on matched seeds, tasks and model classes. Report absolute values plus ratios when denominators exist; no percentage when baseline zero or unknown. Break-even criterion: expected saved fresh-context consultation cost multiplied by real task volume must exceed Elephant loading, reconciliation, invocation, maintenance and congestion cost **without reducing verified quality**. Calculate uncertainty bands and treat small samples as exploratory.

## UI minimum proof

A live token-cost timeline with per-round arm breakdown; parent/child tree; measured/estimated/unknown provenance; context occupancy and refresh markers; provider quota state; wall-clock trace of four simultaneous agents; cost per accepted outcome; and warnings when aggregation is incomplete. Clicking a number should reveal the source record and exact provenance basis, not a model-generated narrative. Every emitted telemetry record must be validated for schema completeness and scrubbed for secrets.

## Required instrumentation tests

- One parent launching four independent children produces four child IDs, separate consumption entries and a correct parent aggregate without duplicate attribution.
- A failing/timeout call still records latency and whatever usage is actually available.
- Cache tokens and reasoning tokens remain distinct rather than silently folded into input/output.
- A model call without usage data appears as `unknown/estimated` with disclosed estimator and bounds.
- A restart reconstructs totals identically from the immutable event journal.
- A sampled provider dashboard total is used as an external cross-check; unexplained discrepancy is prominently flagged.
