# Every-Turn Publication Receipt — Required Semantics

No prescribed JSON schema or file naming; each controller can discover an efficient artifact layout. The full release must nevertheless provide:

- **Origin:** real lab session, proposal ID/version, A/B/C or local refiner identity, verified or UNKNOWN model and worker IDs.
- **Identity:** immutable publication ID/hash, previous publication, UTC time, research round and controller turn.
- **Source basis:** frozen Ω cohort/test SHA, candidate source/commit SHA and allowed evidence-input epoch, with one-round-lag origin for general Track C.
- **Complete catalog:** every current pack ID, version/content SHA, purpose, maturity plus execution status (e.g. EXPERIMENTAL and BLOCKED), actual artifact locations and accessible hashes, dependency/permission/method or runtime contract, prior versions and reason for change.
- **Experimental evidence:** true model/tool actions, test commands and passed/failed/not-run states, subagent workspace IDs where proven, source-staleness/flush evidence when claimed.
- **Economics:** observed vs estimated vs UNKNOWN tokens, cache/reasoning subdivisions, latency, full setup/refresh/retry/install and integration costs.
- **Review:** external evaluation result and test fixture reference, or PENDING/PROVISIONAL—lack of a judge must not suppress immature pack publication.
- **Changes:** newly discovered, modified, unchanged, blocked, retired/rejected, merged, split and superseded packs, all carrying lineage.
- **Security:** sanitized publicly portable material; hashes and access-controlled pointers for private raw evidence, no provider secrets.
- **Recovery:** how an outside agent obtains the exact portfolio, and what cannot currently be reconstructed.

## Completion sequence
Freeze actual turn and source evidence → harvest child evidence deltas and failed-arm tombstones → enumerate ALL registered packs → persist pack contents and full snapshot with immutable previous-version references → independently verify retrieval and hashes → publish readable summary and machine-inspectable inventory → report PUBLISHED only on success. Otherwise maintain local durable staged data with UNPUBLISHED status; do not pretend remote success.

A versioned catalog of only pack *deltas* is insufficient without a reconstructable full inventory. Publication of a failed/partial pack is correct when limitations are explicit. Retirement never erases earlier artifacts or negative findings.

A separate clean-room agent should receive only the current release and listed public dependencies and be able to enumerate, retrieve, inspect and attempt reproduction for both mature and immature packs.
