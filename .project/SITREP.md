# VOMEGA SITREP — start here

As of 2026-10-06, source HEAD `35e5e7d` plus the meta-coherence pass recorded in [META-REVIEW-2026-10-06.md](META-REVIEW-2026-10-06.md).

This top section is current. Everything under "History" is a dated record: accurate when written, not a list of instructions.

## Orientation

**What VOMEGA is for.** A sovereign personal operating environment: a person expresses what they want in ordinary language, that meaning becomes explicit governed operations over their real digital world, and the knowledge and evidence stay theirs across changes of model, provider and surface. Source: `../seed-docs/VISION.md`.

**Current first product mission (owner decision, 2026-10-05).** A small floating Windows command box in which registering Provider Accounts, help and the first external capability, `prompt.send`, all travel one deterministic semantic command system. Source: `../seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`. This is the mission, not constitutional architecture. Owen may change it; how to build it is open.

**What is protected.** The hard boundaries are the invariants and proof boundaries: the semantic separations in `../seed-docs/INVARIANTS.md` (Provider ≠ Account ≠ Model ≠ Session, Capability ≠ Realization, evidence ≠ authority, consequence ≠ authority, description ≠ authority, natural language ≠ authorization, World ≠ surface, confidence ≠ proof) and the evidence ladder in `../seed-docs/PROOF-AND-MATURITY.md` (fixture ≠ live, simulation ≠ live provider behavior). Beside them sit one standing owner constraint (auth, provider and model configuration is read-only), the current owner-selected first-release mission until Owen explicitly changes it, and the **existence/purpose of the major Labs as proving environments**. Protecting a Lab does not protect any particular architecture inside it.

**What is only hypothesis.** Everything below those protected boundaries, including: the meta-program decomposition, lanes (SDW/LNC/VFX/SKW/EXP/PRV/RTE/DEV/TRU), Locks A–E, roadmap milestones M0–M10 and their 74 task IDs, waves, model routing tiers, Lab-internal designs (Lab kernel, Profiles, Reflection ABI, VisualSpec vNext, Provider Lab extension form), sequencing and every development habitat. The full ladder is in [META-TRACKER.md §0](META-TRACKER.md).

**What is proven.**

| Claim | Level | Evidence |
| --- | --- | --- |
| Local records survive process exit; selected vaults stay isolated; real law refuses unconsented external copy | verified-local | `evidence/bootstrap.json`; `omega:quick` 62 pass / 0 fail / 1,622 assertions, rerun on Windows Bun 1.4.2 on 2026-10-06 |
| The deterministic interpreter already holds explicit-target precedence, ambiguity preservation, replay and consent-gate projection on the release corpus | verified-local | `bun test plugins/vivim-nlcl` 49 pass / 0 fail, rerun on Windows Bun 1.4.2 on 2026-10-06; 9 of 17 corpus cases pass, 8 are pinned known gaps |
| Six bounded ZCode workers can each produce a design artifact and handoff concurrently | observed once | `agentic-launch/STATUS.md`; raw preflight log is local-only |

**What is not proven.** No live provider evidence of any kind exists. Browser behavior is fixture replay. `prompt.send` is absent from all 24 plugin manifests and from plugin source; it exists only as design text and corpus expectation. There is no Account concept in contracts or plugins. The validator has a known false-READY defect (corpus `U1`), pinned as a failing baseline, not fixed. Locks A–D are design candidates, Lock E is reconnaissance, none is frozen. There is no executable Lab, simulator, sandbox, Reflection extractor, Wiki, shell, installer or durable Work. `contentHash` is empty in all 24 manifests. The broad suite is blocked on omitted historical inputs. Detail: [REALITY.md](REALITY.md), `agentic-launch/handoffs/TRU-L1.md`.

**Which Labs are protected.** Semantic Runtime Lab / Ω Simulator, MVP Visualization Sandbox, Provider Lab, Reflection / self-knowledge, and development-system acceleration are retained as owner-directed proving environments. Their questions and truth boundaries are in the Labs table in [META-TRACKER.md §0](META-TRACKER.md). Their **existence and purpose** are protected; their internal architecture and mechanisms are not. All five are designs or reconnaissance today.

**Which programs must stay visible.** All 67 in [META-TRACKER.md](META-TRACKER.md), plus the 31 acceleration hypotheses, whether or not anything is working on them.

**What is active right now.** Nothing is claimed or running. The first bounded fan-out and its independent review are complete. The convergence candidates are in [META-TRACKER.md §5](META-TRACKER.md): the semantic simulator and product-twin path, a minimal Reflection slice, and the independent live Provider/Account path. Pick the next slice from evidence; do not replay the first wave.

**Where state lives.**

| Question | Surface |
| --- | --- |
| What programs exist | [META-TRACKER.md](META-TRACKER.md), `meta-tracker.json` |
| What is claimed, running or done | `agentic-launch/STATUS.md` |
| What the code proves | [REALITY.md](REALITY.md), `evidence/bootstrap.json`, tests |
| Decisions and open questions | [DECISIONS.md](DECISIONS.md) |
| Handoffs and history | [COMMONS.md](COMMONS.md), `agentic-launch/handoffs/` |
| First-release task cards and proof obligations | `roadmap/` |
| Machine and harness facts | [ENVIRONMENT.md](ENVIRONMENT.md), `dev-machine/` |

**What may be reconsidered.** Anything below layer 3 of the ladder, on evidence and with a recorded reason: lanes, Locks, milestones, task IDs, sequencing, provider order, transport family, shell framework, VisualSpec extend-versus-replace, Lab internals, model routing, habitats. Invariants may also be revisited, but only through explicit reasoning with preserved lineage (`../seed-docs/AUTONOMY.md`), never by drift.

**How a team may reorganize.** Freely. Lanes may be merged, split, renamed, left unused or replaced. No model, harness or habitat owns a domain. ZCode, Claude Code, Codex, Grok Build, OpenCode, Daintree, Git worktrees and subagents are resources to route by task difficulty, capacity, evidence, independence value, context needs, cost and observed performance. Daintree and ZCode are separate habitats: Daintree does not launch, supervise or manage ZCode. When both are in use they meet only through Git, task artifacts, tests, evidence, STATUS and handoffs.

**What needs Owen.** Product direction and scope; changing an invariant; anything touching auth, credentials, provider or model configuration, spend or subscriptions; irreversible or destructive actions; legal and terms-of-service questions about browser automation; privacy and retention tradeoffs such as RD-8. Everything else is decided by evidence, with independent challenge where the consequence warrants it.

## History

The sections below were written during bootstrap and the first launch on 2026-10-05. They are kept as the record of how the project got here. Where they say "next" or "immediate", read that as of their date.

### Bootstrap status (2026-10-05)

As of 2026-10-05. Seed commit: `f03905e`. Start here on a fresh session.

The initially empty workspace now contains the cloned VOMEGA seed. Bootstrap
reconnaissance read the complete seed corpus at bootstrap and traced executable baseline seams.
The first local continuity/isolation slice is implemented and verified; it is not
yet a provider-webapp beta.

Current objective: advance the smallest evidence-bearing slices of the current release mission while keeping strategy open. The active convergence is the semantic Lab/product-twin path plus the independent live Provider/Account path; select concrete next work from current evidence, META-TRACKER and agentic-launch/STATUS rather than replaying an old launch sequence.

Installation is repaired: the manifest no longer requires omitted workspaces;
the lockfile prunes only absent workspace records. Global tool/auth settings were
not changed. Supported scripts now invoke present entry points.

Supported verification passes: 62 tests, zero failures, 1,622 assertions across
seven files on Bun 1.4.2. Actual launcher append/read/verify/status commands pass
in separate processes, including relative Windows paths. Independent code review
approved the final diff; the TS specialist's full review stopped on absent lint
tooling, and no full static typecheck is claimed. Evidence and limitations are in
evidence/bootstrap.json.

Browser behavior is fixture replay. Provider sessions have no durable account
binding. Durable Work is absent despite stale composition grants. Broad tests
and old architectural gates depend on omitted tooling/examples/fixtures. The web
surface is an API backend with unguarded root endpoints, not a productized UI.

Codex, Git, Node, Bun, Chrome, Claude and ZCode are present in the recorded environments. The later DEV-L1 launch proved at least six bounded ZCode workers on `openrouter/auto`; the five Space Bunny lanes remain historical/configuration evidence rather than fixed scheduling slots. Use [ENVIRONMENT.md](ENVIRONMENT.md) and current launch status for machine-specific truth.

Next actions are deliberately selected from evidence rather than fixed here: preserve honest blockers, close whichever current semantic/Lab or live Provider/Account dependency yields the highest validated progress, and re-rank when new evidence changes the problem.

Detailed truth: [REALITY.md](REALITY.md), [RELEASE-GYM.md](RELEASE-GYM.md),
[DECISIONS.md](DECISIONS.md), [COMMONS.md](COMMONS.md), and
[evidence/bootstrap.json](evidence/bootstrap.json). Seed intent constrains the
work; these operational artifacts are revisable evidence, not product law.

### Product target update (2026-10-05)

The owner has now selected the first public product shape: a floating Windows command box defined in `../seed-docs/FIRST-PRODUCT-RELEASE-DESIGN.md`.

The first release should let a user register Provider Accounts through natural language, see evidence-backed capabilities appear, receive real-time command interpretation/options/help, and invoke the same deterministic semantic command system used by visible UI actions.

The first external capability is `prompt.send`.

Immediate next technical work should still prove real browser transport and Account identity, because the product cannot truthfully register or target an Account until that seam is evidenced.


### DevOps acceleration hypothesis update (2026-10-05)

The seed now includes `../seed-docs/ELEPHANT-CONTEXT-NETWORK.md`, preserving the distributed large-context “elephant” cognitive-memory concept as an optional experiment-driven DevOps acceleration hypothesis.

No elephant network has been instantiated and no provider lane has been reserved by this decision. Test it only when context reconstruction/review becomes a measured bottleneck; repository/test/runtime evidence remains authoritative.

### First-release roadmap update (2026-10-05)

The owner's first-release roadmap pack is on disk at [roadmap/README.md](roadmap/README.md): milestones M0–M10, 74 tasks across nine workstreams, a baseline harvest assay and a proof-traceability matrix. It is an operational plan and revisable evidence, not product law; the seed still constrains it.

It is placed but not yet adopted: no roadmap task is claimed, and the "Next actions" above are unchanged until someone claims OPS-01. The seed determinism corpus (task CMD-02) runs under `bun test plugins/vivim-nlcl` and is not part of `omega:quick`. What landed where, and what was deferred, is in `../INCORPORATION-NOTES.md`.


### Local agentic team launch update (2026-10-05, corrected 2026-10-06)

The first bounded fan-out has already completed. It produced candidate Locks A–D, an EXP baseline, Provider-reality reconnaissance and an independent TRU review. Those artifacts are evidence and interoperability hypotheses, not architecture to freeze.

Future launches are derived from the current meta-program state and evidence. There is **no permanent executor topology** and no requirement to recreate the original five-lane first wave.

Daintree and ZCode are separate habitats:

- Daintree may manage Git worktrees, Review Hub and supported CLI-agent panels such as Claude Code/Codex/Grok where locally available.
- Daintree does **not** launch, supervise or manage ZCode.
- ZCode runs its own worker/session system and may be used as a high-throughput workhorse independently.
- When both are active, coordination occurs through Git/worktrees, task artifacts, STATUS and durable evidence — not through Daintree controlling ZCode.

The SDW/LNC/VFX/SKW/EXP/PRV/RTE/DEV/TRU lanes remain useful temporary ownership vocabulary. They may be merged, split or bypassed when a different decomposition better serves the current evidence-bearing goal. Likewise, Locks are temporary compatibility points: stabilize enough to let teams interact, then keep them falsifiable.

No agent, lane, worktree or habitat is implied active unless current STATUS/evidence says so.

### Complete meta-program map (2026-10-05)

The canonical whole-program index is now [META-TRACKER.md](META-TRACKER.md), with a machine-readable companion at [meta-tracker.json](meta-tracker.json).

This corrects an important scope ambiguity: the nine agentic-launch workstreams are only low-handoff **execution ownership lanes**, and the 74 first-release roadmap tasks are only the **release slice**. Neither is the complete VOMEGA program.

The meta tracker currently preserves 67 major programs across product/release, semantic runtime/simulation, Reflection/Wiki migration, provider reality, authority/Work/runtime/extensibility, truth/research, and the local agent-development factory. It also preserves all 31 named development-acceleration hypotheses.

Current convergence is deliberately narrower than the complete map: executable Ω Simulator + semantic product twin, minimal Reflection/Wiki/Migrator slice, validator/revision/experiment truth, and the independent real Provider/Account path. Major destination programs such as durable Work, Forge/evolution, full sovereign exit, Canvas, Elephant context and optional DevOps accelerators remain visible without blocking the current release.
