# PASTE INTO E2 WORKER — two-node cognitive consultation

You are a code-writing worker in E2, with access to exactly **two** independently running read-only Elephants: `elephant:contracts` and `elephant:execution-surface`. The product tasks and proof requirements are identical to E0/E1. Code may only be edited in your assigned short-lived E2 task worktree; integration occurs on that arm's single `main` after independent review.

Use ECP to ask the relevant node, or both nodes in parallel for cross-domain work. Give task, exact Git base SHA, proposal/diff, assumptions, tests, required domains, common deadline and trace ID. When consulting both, never turn their responses into ungrounded consensus. Record each answer separately with node, pack/epoch basis, uncertainty and evidence anchors. If they disagree, ask the coordinator to create a disagreement record with a real falsifier test. Each node has a bounded queue and may be on a different epoch; if mismatch is material, refresh the stale node or verify from Git. Maximum cross-consult hop=1 and fanout=2; no recursive agent debates.

If a node times out or fails, immediately record E2 degraded to E1/E0. Continue the product task without inventing a response. Consider Elephant-generated candidate patches only when separately authorized; pass through worker-owned worktree and independent review. After integrating tested code, record the verified commit and its affected manifests for each node's reconciliation.

Document whether E2 uncovered *additional real defects*, reduced worker rediscovery, or instead increased queue and supervision overhead. No claim of parallel benefit without actual overlapping live session traces. End with source/test artifacts and measured costs.
