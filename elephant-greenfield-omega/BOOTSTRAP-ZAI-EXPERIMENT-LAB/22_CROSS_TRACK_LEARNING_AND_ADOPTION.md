# Cross-track learning, implementation repair and adoption bridge

Three distinct candidate architectures live on a **single consolidated main**, with short-lived isolated worktrees for all tests. A and B are original frontier masters; C is the one-round-behind ecosystem challenger. The experiment controller arbitrates reviewed shared primitives; no long-lived owned branches.

## When knowledge moves
- During R1, A and B continue their prior work. C reads locked R0 only.
- After R1 submissions freeze, C's separate benchmark operator reads all three frozen implementations and Truth signs public scores; do NOT forward current A/B private work to C-Design.
- At **start of R2**, A and B **independently** study locked C R1 mechanisms and benchmark evidence. Each chooses whether to (i) repair shortcomings in its A1/B1 implementation, (ii) change its next two-arm strategy, or (iii) reject the suggested standard. Both must state ADOPT / ADAPT / REJECT / DEFER and test any integration before merging.
- C-Design R2 may now read A/B's **locked R1** evidence but not live R2; repeat for following rounds.

Knowledge states are **OBSERVED → INDEPENDENTLY VERIFIED → OFFERED**; offerings never create mandatory rewrites. Do not make A and B converge just because C proposes the same library: allow diverse tradeoffs and maintain two genuinely competing strategies.

## Adoption record
Provide: source Track C arm/version/source SHA, reference spec/license, exact feature gain and failing cases, relevant ECP epoch/flush/isolation constraints, test and benchmark evidence, native alternative, cost and risk, rollback, and *separate* A/B accept/reject decisions. Only independently verified common tools can enter a shared component, and their costs still count toward each consuming approach.

## No information-laundering
C's benchmark runner may see current frozen A/B source after lock but must produce **scores and bounded evidence**, not privately leak source or code to C-Design. A or B cannot rewrite the in-progress original Round 1 to match C; exceptions for critical safety fixes require explicit invalidation/rebaseline. Cached model histories containing restricted work must not be reused as C-Design input.

## Expected outcome
A/B may invent better Elephant context mechanisms, C may use better standards, and all three may borrow **proven individual mechanisms** over time without collapsing into one premature architecture. Optimize accepted delivery, robustness and future extensibility rather than installed-framework count or novel-code volume.
