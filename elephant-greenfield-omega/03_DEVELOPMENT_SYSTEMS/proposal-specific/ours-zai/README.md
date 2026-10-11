# Dedicated Z.ai for Proposal O1 (ours)

**Launch status: NOT STARTED IN THIS REPOSITORY.** Documentation is ready. A new real Z.ai top-level session/workspace must be explicitly created by the operator; the repo cannot claim one has been launched.

- [Full launch prompt](BOOTSTRAP_PROMPT.md)
- [O1 design brief](../../../02_ARCHITECTURE_PROPOSALS/ours/01_INITIAL_ECP_ARCHITECTURE_PROPOSAL.md)
- [O1 falsifiers](../../../02_ARCHITECTURE_PROPOSALS/ours/02_ASSUMPTIONS_FALSIFIERS_AND_BENCHMARKS.md)
- [Shared baseline](../../../00_CORE_BASELINE/README.md)
- [Output/publication standard](../../../01_EXPECTED_OUTPUTS/02_EVERY_TURN_PUBLICATION_CONTRACT.md)

Unlike the **general Z.ai** lab, this agent runs its own internal four-arm experiments **specifically grounded in O1's Git-epoch/context-resident hypothesis**. It may vary implementations and falsify assumptions, but every departure is source/version/experiment-attributable. It must release all owned packs after every turn, including immature and failed ones. No actual session ID, token usage or Z.ai capability is asserted until probed and logged.

## Current fresh-launch entry (2026-10-11)

**[FRESH_O1_ZAI_STARTER.md](FRESH_O1_ZAI_STARTER.md)** is the fully updated, full-GitHub-URL reading-order bootstrap for a separate O1-only Full-Stack Z.ai session. It supersedes older generic launch wording in `BOOTSTRAP_PROMPT.md` when starting a NEW dedicated O1 session. The independent general Z.ai and Claude sessions are not part of this runtime. This repository does not claim O1 has been launched merely because a bootstrap file exists.
