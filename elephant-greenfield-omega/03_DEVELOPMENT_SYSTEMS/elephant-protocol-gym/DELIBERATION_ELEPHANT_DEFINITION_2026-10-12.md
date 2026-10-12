# DELIBERATION — What is an Elephant? Four incompatible definitions, side by side

**Path: `DELIBERATION`. Advisory. This document decides nothing.**
**Status: OPEN. No definition is ratified. Every candidate below remains available.**
**Date:** 2026-10-12 · **Author:** lab-ops (head of Elephant Labs) · **Authority to decide:** Owen, via [`../DECISION_PROCESS_TRACKER.md`](../DECISION_PROCESS_TRACKER.md)

---

## Why this exists

Managing the labs means dispatching and adjudicating runs. Doing that safely requires knowing what an Elephant *is* — because every question downstream depends on it: what persists between sessions, what an "independent context" is, whether a cold reader is an Elephant or a worker, what authority an instance ever has, and what a run receipt is attesting.

Across roughly 6.5 MB of Elephant corpus there are **four incompatible definitions**. Nothing in the tree adjudicates between them. This document lays them side by side and states what each *implies* operationally. It is deliberately not a recommendation, because picking one is an owner decision with real consequences.

---

## The four candidates

### A. Cognitive **role** — `05_UNIVERSAL_ELEPHANT_DNA/01_GENOME_SEED.md:5`

> "a durable, bounded cognitive *role* whose knowledge basis, operating self-model, competencies and communications can be inspected and reconstructed independently of any single model conversation. It has no inherent code-writing, account-spending or governance authority"

**Implies:** an Elephant is a *position* — a job description with genes — not an instance. Many Elephants can occupy the same role; the role persists; a specific conversation is disposable. Reconstruction means re-instantiating the role from its genome. The 20 genes in `genome.operational.json` are the substantive content, and their fitness harness scores only synthetic fixtures today (6 of 20 genes `HARNESS_ONLY`, the rest `NOT_RUN`).

### B. **Entity** — `05_UNIVERSAL_ELEPHANT_DNA/README.md:7`

> "a persistent, reconstructable, bounded cognitive *entity* with an operationally inspectable self-model… No claim of subjective self-awareness is intended"

**Implies:** nearly the same as A, but reifies the role into an entity with continuity and a self-model. The practical difference from A is small; the difference from C and D is not.

### C. **Reloadable node** — `01_MASTER_CHARTER.md:7`

> "domain-scoped, long-context reasoning node with: (a) exact source/commit basis; (b) reloadable snapshot; (c) traceable memory promotion; (d) request/response contract; (e) versioned freshness/contamination state; (f) an explicit no-authority or tightly bounded patch-author mode. **A long chat alone is NOT an Elephant**"

**Implies:** an Elephant is a *runtime unit* with explicit state fields. This is the only candidate that specifies what actually persists (snapshot, promoted memory, contamination state) and what a request/response contract is. It is the most operationally complete — and the most expensive to build. Note its emphatic clause: under C, the four Round-0 arms were **not** Elephants, they were worker sessions.

### D. **Deterministic capsule + ledger** — `02_ARCHITECTURE_PROPOSALS/claude/README.md:7`

> "a **deterministic source capsule + model adapter + externally maintained source/epoch ledger**, not an immortal chat"

**Implies:** an Elephant is a *reproducible construction*: given the same capsule and epoch ledger, a specific behavior is reproducible. Identity lives in the capsule and the ledger, not in the session. This is the definition that makes "independent context" checkable — but it inherits Claude's framing, and its enforcement (kernel F23/F24) exists only inside a simulated kernel nobody runs.

---

## Where they actually disagree

| Question | A (role) | B (entity) | C (node) | D (capsule) |
|---|---|---|---|---|
| Does it persist across sessions? | the role does | yes, via self-model | yes, via snapshot + promoted memory | yes, via capsule + ledger |
| Is one conversation an Elephant? | no | unclear | **explicitly no** | **explicitly no** |
| What is the unit being built? | a job description | a bounded identity | a runtime with state fields | a reproducible construction recipe |
| Where does authority live? | nowhere; inherited constraints | nowhere | external, per-mode | external ledger |
| Reproducibility requirement | none stated | none stated | basis + snapshot | **deterministic** |
| Was a Round-0 arm an Elephant? | arguably yes | arguably yes | **no** | no |

**The sharpest conflict is C/D vs A/B.** C and D both say a single session is not an Elephant. A and B can be read as making the role itself the Elephant. Under the first reading, the labs have run *workers*, never Elephants — which matters for how the results are described.

There is also an unresolved internal contradiction: `02_ARCHITECTURE_PROPOSALS/ours/01_INITIAL_ECP_ARCHITECTURE_PROPOSAL.md:5` says "Treat an Elephant **not** as a chatbot persona", while gene D-02 treats "purpose / purpose-bound domain" as inherited DNA.

---

## A second, separable conflict: two ECP grammars

Both claim design-of-record:

- `protocol/02_ECP_V0_SPEC.md` — **ECP v0.1**, transport-neutral, 14 commands, envelope/basis/failure taxonomy. Named canonical by `05_UNIVERSAL_ELEPHANT_DNA/README.md:37`.
- `02_ARCHITECTURE_PROPOSALS/claude/ECP_SPEC.md` — **ECP v0.2**, "Elephant Consult Protocol", 15→4 model-facing kinds, `FLUSH` deleted, hop limit 0, anchors verified against the blob by quoted text rather than line number, artifacts passed by value, and machine-readable schemas. Status `DESIGN + SIMULATED_TEST` (32 kernel tests). It claims to supersede v0.1 **"for this submission only"**.

Recorded drift: v0.2's change table says v0.1 had **15** commands; `protocol/02` actually lists **14**.

The single most valuable idea in v0.2 is that an `anchors[].quote` can be verified against the blob — "a line number alone cannot be checked for meaning; a quote can". That is directly relevant to the Elephant↔Elephant comms layer, and it is currently trapped in a submission-scoped document.

---

## A third conflict that blocks swarm launch

`01_MASTER_CHARTER.md:31` excludes **"unbounded 24/7 unattended execution"** from the safety target. `ADAPTIVE_SWARM.md` and `adaptive-swarm/launch-manifest.json` prepare exactly elastic, always-on, self-reorganizing streams.

**These cannot both stand if unattended fan-out is ever launched.** This is not a research question — it is a permission question, and it is Owen's to answer. Until it is answered, the adaptive swarm stays `PREPARED_NOT_LAUNCHED`.

---

## What is *not* in dispute

Across all four candidates, and stated repeatedly, these hold:

- An Elephant **cannot generate consent or grant itself write access** (`05_UNIVERSAL_ELEPHANT_DNA/README.md:38`).
- **Identity and introspection never grant rights** (`02_SELF_MODEL_AND_INTROSPECTION.md:40`).
- **Universal cognition does not confer filesystem rights** (`04_ECOSYSTEM_CROSSWALK.md:36`); OS-enforced scopes and reviewed integration are external governance.
- Acceptance as a constitutional invariant **requires explicit owner decision** (`03_FITNESS_AND_ROUND0_EVIDENCE.md:36`).

The gap is that **all of this is prose in Markdown**. The only machine-enforced authority constraint anywhere is Claude's simulated kernel F23/F24. DNA-20 ("0 unauthorized mutations") is `NOT_RUN`.

---

## What each choice would cost

- **Adopt A/B (role/entity):** cheapest; lets any well-briefed session be an Elephant; loses the ability to prove independence, because a session with a fresh context and a fresh transcript still cannot show it carried no prior knowledge.
- **Adopt C (node):** the only option that makes snapshot, contamination state and reconstruction first-class; requires defining what a snapshot *is* and where it lives; makes the Round-0 arms retrospectively workers, which is honest but discards the framing the labs were built on.
- **Adopt D (capsule+ledger):** gives reproducibility and a checkable "independent context" notion; risks inheriting a submission's framing as if it were settled architecture, and its enforcement is simulated today.

## Recommendation, offered for challenge

**Hold all four open, and operate on the most conservative reading meanwhile:** an Elephant is *at least* a bounded cognitive role (A) and *never* holds authority; a session is an Elephant only when its capsule/epoch basis and contamination state are declared (D's requirement); and reconstruction must be demonstrable (C's requirement). That reading is compatible with all four and blocks nothing.

**This is not a decision and must not be treated as one.**

---

## Routing

| Item | Path | Note |
|---|---|---|
| Which definition governs | `OWEN_GUIDANCE` | Real owner choice with architectural consequence |
| Which ECP grammar is design-of-record | `OWEN_GUIDANCE` | Currently two documents claim it |
| Unattended / elastic swarm execution | `OWEN_GUIDANCE` | Blocks the adaptive swarm; safety-scoped |
| Whether any of this needs the operating definition before R1 | `OWEN_GUIDANCE` | R1 measures recall, so arguably not |
| Consolidating the four descriptions | `DOCUMENTARY_RECONCILIATION` | Do **not** delete alternatives; preserve provenance |