# FIRST: launch the independent design round-robin

The user wants a **genuinely greenfield Ω** with a measured zero/one/two-Elephant protocol. Begin by sending the *same shared challenge* to independent sessions and asking each to optimize a different dimension. **Do not let them see each other's solutions until after first submissions.** Use `prompts/CLAUDE_ARCHITECT.md`, `CODEX_IMPLEMENTER.md`, `ZCODE_OPERATOR.md`, `OPENCODE_PROTOCOL.md`, and `GROK_FALSIFIER.md` as the actual paste-ready task prompts. Each repeats the critical constraints, so each is usable alone.

## Order of operations

1. Start five new design-only sessions, one each for Claude, Codex, ZCode, OpenCode, Grok. Give each only its own prompt and the **identical charter, product brief, and v0.1 protocol draft** from this pack. Keep prompts isolated from the other models' answers.
2. Request structured design submissions in `outputs/<model>/` under the contract in `prompts/RESPONSE_CONTRACT.md`. No design session gets authority to rewrite the original pack or another session's files.
3. Use `prompts/JUDGE_SYNTHESIS.md` to compare contradictions, tradeoffs, viable novel mechanisms, costs, and executable smallest trial. A reviewer must not accept consensus as proof.
4. Pick one operational design from the evidence; stage E0 baseline, then E1, then E2. Run exactly the same product tasks and controlled injections.
5. Keep measured factual conclusions separate from theoretical improvement targets and speculative IP claims.

## Essential challenge, to prepend when needed

> Design and operationalize a **fresh, standalone Greenfield Ω experiment** to test whether zero, one, or two concurrent, high-context Elephant sessions improve *validated development velocity*. An Elephant is a live or reconstructable contextual cognition service, with explicit Git/epoch basis and resident/wave/transaction memory layers. Workers actually write and test code. An Elephant normally advises but may author candidate patches only through a bounded, provenance-tagged, independently verified artifact path. Build concrete contracts for request/response, routing, inter-Elephant consultations, refresh, flushing, recovery, isolation, contradiction handling, task-scoped code work and evidence. No undeclared source truth, no secret ingestion, no assumed provider features. Design one immediately executable experiment against the frozen Prompt Fanout Mini greenfield product. Account for real wall-time, tokens, model quality, false positives, and context-loading costs. Seek technically novel, prior-art-checkable methods. Distinguish implemented, simulated and hypothetical behavior. Output a runnable small slice and falsification tests, not an elaborate untested platform.

## Deliverables every session must submit

Architecture decision record; E0/E1/E2 sequence diagrams; exact event/envelope schema; session flush/restore algorithm; code-authority matrix; failure recovery; Windows/CLI feasibility audit; build order; test cases; cost/benefit model; differentiators and prior art questions; numbered risks; objections to the master charter; first vertical-slice patch or executable harness, subject to its assigned role.

## Using the prompts

- If one session supports files, attach `README.md`, `01_MASTER_CHARTER.md`, `02_GREENFIELD_OMEGA_PRODUCT.md`, and files under `protocol/`.
- If not, paste the relevant file contents; **do not substitute vague references the agent cannot read**.
- Require factual provider capability assertions to be checked against installed CLI help/source on the user's machine. Never expose credential contents.
- Save raw first-pass replies and machine-readable scorecards before round-robin debate begins.
