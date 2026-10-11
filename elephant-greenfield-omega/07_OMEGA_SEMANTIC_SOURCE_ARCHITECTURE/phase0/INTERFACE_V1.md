# Phase 0 adapter contract v1 — bounded implementation

This is a lab-local boundary, not universal DNA or a ratified full SDK. `interface.json` declares what exists.

`Lab.interpret(session, text, revision)` returns original state, deterministic reading, alternatives, source hash, input revision and optional server-held preview. Revisions increase per session. Every edit invalidates the old display. Inputs over 2,048 characters or outside canonical Unicode constraints are rejected.

`Lab.choose(session, revision, exactReading)` accepts only an enumerated server alternative. It creates a new preview; it does not grant permission. Account-choice resolution covers prompt.send and browser show/hide when complete. Other partial states require re-entry.

`Lab.authorize(session, preview, true)` verifies the exact server-held preview and current world, then issues an opaque 15-second one-use permit. Preview expiry is 60 seconds; expiry uses a monotonic server clock. The preview cannot issue a second permit.

`Lab.dispatch(session, permit, preview)` repeats validation while holding a lock, consumes the permit and records one mock receipt. Foreign sessions, changed input/display/source/account/provider/session/policy/permission, ambiguity, missing consent, expiry, and replay reject. These are real execution-blocking errors before receipt creation. Real provider effects are unsupported.

HTTP routes: GET `/bootstrap`, `/status`, `/`; POST `/interpret`, `/choose`, `/authorize`, `/dispatch`. POST requires the bootstrap session and CSRF header. The local server binds only 127.0.0.1 and checks Host and Origin. A session is lab-local client state, distinct from the mock provider session in the world snapshot.

## Identity encoding

Canonical semantic identity is SHA-256 of UTF-8 `omega-semantic/1\n` followed by sorted-key, compact JSON `{capability,args}`. It never grants rights. Arrays retain order; target sets must already be sorted. The original legacy digest remains separately labelled in reachable vectors.

Supported canonical JSON is null, booleans, safe integers (±9,007,199,254,740,991), NFC strings, arrays, and ASCII-keyed objects. Floats, controls, format characters, surrogate code points and non-NFC strings fail. This is an intentionally restricted profile, **not a claim of full RFC 8785 compatibility**. Node and Python checks are independent.

Display identity uses `omega-display/1` over the full reading, semantic digest, input text/revision, unique display revision, selected alternative, snapshot and MOCK_ONLY mode. Server storage binds owner session and expiry. The execution permit is a random server-held capability scoped to this preview/session and consumed atomically. Hash knowledge is insufficient.

Source identity covers the loaded author engine, OSL reader, declarations, fixture, independent oracle and gate code. Modified source blocks new previews until restart and invalidates existing approvals. An actual runtime deployment must also attest binaries, UI, policy and environment; this local model is limited.

## Original source adapters and unsupported boundaries

`Omega(...)` compiles the original declarations; `recognize`, `render`, `parse_reading` are original Python implementations. They are not portable TypeScript endpoint implementations. `compileHelp` is NOT_IMPLEMENTED. Trace anchors from the original recognizer are preserved; span completeness is PARTIAL. READY render verification is independently implemented for six capabilities only. Arbitrary declarations do not automatically extend the oracle.

The UI shows the source's intended real-world consequence plus a persistent mock-only notice. The actual adapter performs no network effect and does not register accounts. Repeating a command produces a fresh revision, preview and confirmation.
