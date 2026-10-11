# Proposal O1 — What Would Disprove It?

1. **Resident session vs static pack:** under matched task/model budgets, long-context residency adds more total overhead than it saves; fresh workers with source tools equal or beat correctness. In that case retain useful pack builders, drop always-on residency.
2. **Two-node advantage vs overhead:** two true independent nodes fail to find additional cross-domain defects or cost more than one larger node or two fresh readers. Reject a two-node topology for that task class.
3. **Flush semantics:** provider compaction cannot prove transaction isolation; testing reveals contamination. Rotate/reconstruct rather than claiming soft flush works.
4. **Epoch consistency:** source changed but resident evidence remains stale and error is not detected mechanically. Quarantine the node until repaired.
5. **Routing complexity:** the coordinator infers a domain incorrectly and review defects increase; simplify routing or use direct source baseline.
6. **Proposal-patch safety:** Elephant code proposals induce more reviewer work or misaligned patches than ordinary worker-written code. Keep advisory mode.
7. **Conventional standards win:** a smaller A2A/MCP/OTel-compatible boundary or an existing durable runtime outperforms a custom implementation while preserving the Git-truth requirements. Adopt a minimal verified standard integration.
8. **Portability fails:** an external agent cannot rebuild and operate a released pack without original chat/context. The pack is immature and must stay published with known failure.
9. **No delivery gain:** technical elegance increases coordination but not accepted output, or improves raw throughput at the price of hidden defects. Publish the negative result rather than changing benchmark weights after seeing outcomes.

The plan must include authentic separate subagents, per-model/tool tokens/cost (or UNKNOWN), source/evidence hashes, suitable E0 controls, a real Ω product deliverable, and independently reproduced tests. Do not prescribe a list of resulting capability components. Maintain both positive and negative pack artifacts and release all at every bounded turn.
