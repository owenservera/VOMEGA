# Repository reality and proof boundaries

Audited 2026-10-05 against seed f03905e and current local changes. A present source
or passing fixture is not a live external capability.

| Capability | Classification | Evidence / remaining gap |
| --- | --- | --- |
| Host verification, routing, policy | verified local slice | host/src/{recipe,boot,ports}.ts and real vivim-law; full historical gate inputs absent |
| Canonical local Vault | verified local integration | SQLite/CAS/changelog/search/verify; fresh-process restart and two-vault isolation pass |
| CLI | verified cold local slice; broader surface partial | real host public API, root principal; new local default and relative Windows path proof pass; warm path unverified |
| Browser/provider messages | fixture/simulated | provider-browser requires sim:true, parses supplied captures and appends local records; no live CDP/control path |
| LLM response | simulated by default | provider-llm simulator; optional HTTP leg not browser V1 and not proven with real credentials |
| Provider Account / Session | partial | providers.session.start returns INITIALIZED id without persisted binding; login/account identity not proven |
| Durable Work / return | aspirational in this seed | spine grants work.* but vivim-run implements run.* only; transient pools and intent/agent ledgers are narrower claims |
| Web environment | partial | HTTP/socket API, seeded fictional messages, no HTML app; root calls/consent without auth/origin restriction, listen host unspecified |
| Import owner conversation history | partial | three pure export parsers exist; no routable import writer with identity/idempotency/provenance |
| Sovereign exit | partial | Vault data roundtrip copies/verifies storage; signing root, product identity and provider relationships not fully reconstructed |
| Dev gates / benchmarks | historical only or broken here | scripts pointed at wholly absent tooling; old decision ids/benchmarks unratified |

Present entry points: host/src/main.ts, surfaces/{cli,mcp,web}/src entry scripts,
surfaces/daemon/src/daemon.ts, platform/src/containment.ts. Bun is the execution
runtime; the Vault imports its Bun SQLite driver. A Node driver exists without a
complete seeded Node distribution build.

The clean seed omits tooling/, examples/, root fixtures/ and baseline docs/.
Only five baseline Markdown files exist. Of 21 named compositions, nine reference
missing plugins: demo, kernel, law, notes, run, spine, forge-mine-capture,
forge-mine and forge-survey. Present sources in another composition do not prove
that it boots or is live.

Install originally failed on the required tooling workspace. The manifest and
lock now enumerate present workspaces, preserve external dependency versions,
and use existing scripts. Missing historical tooling commands were retired.
`omega:gate` now means broad tests only; it does not recreate former architecture,
OS-boundary, documentation or governance gates.

The broad baseline attempt exposed missing inputs and child-spawn PATH problems
and was interrupted; it has no valid completed-suite count. A second bounded
attempt with the executable on scoped PATH (`bun test --bail`) stopped at the
missing tooling/watchdog/watchdog.ts import in host/test/adversarial.test.ts.
These blockers remain visible through `omega:test`, not silently excluded.

The initial default storage flaw: --vault selected root keys/recipes while the
composition could choose shared ${TMP} or CWD storage. Existing integration
tests overrode dataDir, so they did not prove default CLI isolation. The new
local slice binds explicit ${VAULT} configuration before recipe signing and
uses real law + Vault. Existing fixture/custom configurations are unchanged;
do not use legacy shared-temp specs as isolated product instances.

Final named quick proof: 62 passed, zero failures, 1,622 assertions across seven
files. It covers compiler binding, Vault regression/integration and policy plus
new CLI process tests. Browser parser tests need omitted session captures; driver
cross-process/Node parity tests need omitted CI scripts. An initial wider quick
attempt recorded 63 passes, three failures including an import error; those
input-dependent claims were explicitly excluded from the final named local slice,
not declared passing. Full broad/static/live/warm proof remains unestablished.

Actual documented launcher append/read/verify/status commands now pass. They
initially exposed Windows Bun relative mkdir EEXIST; resolving --vault at CLI
entry fixed it, and the subprocess regression exercises relative paths with spaces.

Critical next falsifiers: independent vault roots cannot share records; unknown
ops and unconsented external copies refuse; missing blobs fail verification;
browser disconnection cannot produce fresh live evidence; selected provider
Account cannot silently change. Evidence is recorded per claim in
evidence/bootstrap.json. No beta/provider readiness claim is made.
