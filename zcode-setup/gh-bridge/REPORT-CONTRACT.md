# Oracle report PR contract (bootstrap)

The local bridge never automatically sends ChatGPT a notification. When Oracle is ready to report, publish a **sanitized** PR with title prefix `oracle-report:` (configured Work triggers may then react), referencing:

```json
{
  "schema": "vomega.oracle-bridge.report/1",
  "request_id": "smoke-001",
  "source_commit": "fb9f3f5d5c5e88c072d9a256289553e66a8e659c",
  "revision": 1,
  "status": "RECEIVED",
  "reported_at": "ISO-8601 UTC timestamp",
  "evidence": [
    {"kind":"local_intake", "summary":"Inbox entry observed; no execution claimed"}
  ],
  "verified": false
}
```

This is a **format example, not an assertion the local PC has received the task**. If a real report is posted, replace timestamp and summaries with observed facts; link commits/proofs as appropriate. A reported success does not replace independent verification. Do not publish secrets, credentials, sensitive paths, private logs, or raw prompts. Do not automatically merge reports into `main`.

While a PR publisher is not installed, a local operator or Oracle must create this report using existing authorized GitHub credentials and review policy. ChatGPT fallback checks remote evidence, not local-only `.local/gh-bridge/outbox` receipts.
