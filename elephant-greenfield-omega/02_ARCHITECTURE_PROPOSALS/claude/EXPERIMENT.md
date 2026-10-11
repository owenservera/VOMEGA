# EXPERIMENT — baselines, controls, metrics, falsifiers

**Status:** `DESIGN`. Nothing here has been run. All thresholds are pre-registration proposals, to be frozen at G0 before any arm starts.

## 1. What the charter's design can and cannot show (objections first)

1. **Scale.** Prompt Fanout Mini will be roughly 1.5–5 kLOC at completion (estimate). Any current frontier worker can read all of it in one pass. The Elephant premise — "rebuilding context is expensive" — is weakest exactly here. **Prediction: on Mini, E1/E2 throughput gains are small or negative; defect-recall gains on T5/T7 are the only plausible win.** The trial on Mini therefore validates *mechanics* (G2/G3) and *defect detection*, and should not be used to accept or reject the throughput hypothesis.
2. **Persistence is confounded with capsule content.** The charter's E1 bundles three things: a curated domain pack, protocol machinery, and a persistent session. Control C separates one of them. This design separates all three (§2).
3. **Compute is not matched.** An Elephant adds model tokens. Without an E0 arm given the same extra budget (e.g. a fresh reviewer), any E1 gain may just be "more compute".
4. **n is tiny.** 8 task classes × 3 arms × 1–3 replications cannot support "≥ 25%" as a statistical claim. Report effect sizes with bootstrap intervals and say "descriptive" when intervals cross zero.
5. **Operator time dominates at this scale.** Operator minutes must be a first-class cost, or the network wins on paper and loses at the desk.

## 2. Arms and controls

| Code | Name | What the worker gets | Isolates |
|---|---|---|---|
| **A** | E0 | Source, tests, ordinary tools | baseline |
| **B** | E0 + capsule bundle | Same capsule text an Elephant would get, handed to the worker at task start | value of *curated context* alone |
| **R** | E0 + matched reviewer | A fresh reviewer session (no capsule) with token budget = median Elephant spend in E1-S | value of *extra compute* |
| **C** | Fresh same-pack consult (raw) | Worker pastes capsule + question into a fresh session; no switchboard | value of *consulting* without protocol |
| **E1-S** | One Elephant, PREFIX/FORK | Full ECP v0.2 | protocol value = E1-S − C |
| **E1-P** | One Elephant, APPEND | Full ECP v0.2, persistent session, rotation by budget | persistence value = E1-P − E1-S |
| **E2-S** | Two Elephants, PREFIX/FORK | Full ECP v0.2, two domains | second-node value = E2-S − E1-S |
| **F** | Static baseline | `tsc --strict`, lint, import-graph dependents script | floor for defect detection (no model) |

Minimum viable set for the pilot: **A, B, E1-S, E1-P, E2-S** (+ F, which is free). R and C are added in the confirmatory stage only if E1-S beats B.

All arms: same seed commit, same task cards, same worker harness/model per matched task, same acceptance graders, separate clones and caches (A8).

## 3. Task bank (executable version required at G0)

Uses the pack's T1–T8. Additions required to make them measurable:
* **Seeded defects with hidden oracles**, 2 per task class from T4 onward (e.g. retry builds a new idempotency key; cancellation marks `cancelled` before adapter confirms; UI shows `accepted` for `timed_out` after the T5 rename). Graders hold the oracle; workers and Elephants never see it.
* **Variants**: each class has 2 isomorphic variants (different symbol names/files) so replications don't reuse memorized answers.
* **T7 protocol**: ask the Elephant the same IMPACT question before and after the contract commit; the stamped answer must show CONTRACT staleness before rebuild and correct new semantics after.
* **T8**: the injected instruction is in a committed source comment inside the capsule, so it reaches the model as capsule content, not as an artifact.

## 4. Procedure

* **Order:** Latin-square across arms per replication; within an arm, tasks run in dependency order (T1→T6), T7/T8 after.
* **Pilot (stage 1):** 1 replication, arms A/B/E1-S/E1-P/E2-S. Goal: G1–G3 mechanics + effect-size estimates.
* **Confirmatory (stage 2):** only if pilot shows E1-S ≥ B on accepted-value throughput *or* ≥ +2 seeded defects found on T4–T7. 3 replications, add R and C. Pre-register the primary comparison before starting.
* **Context-pressure stage (stage 3, recommended):** repeat the best Elephant arm vs A and B on a larger frozen codebase (30–80 kLOC real TypeScript project pinned at a commit, with its own seeded task bank). This is the only stage that can test the throughput premise fairly. Choice of codebase is an operator decision.
* Blind grading: graders see diffs, tests, product behaviour and evidence bundles with ECP ids, arm names and Elephant attributions **redacted**.

## 5. Primary metric and definitions

**Primary:** accepted-value throughput `AVT = Σ points(accepted tasks) / Σ wall-hours(task issue → acceptance)`, reported with **total cost** alongside: `tokens_total`, `$` where measurable, `operator_minutes`.

| Metric | Definition | Source |
|---|---|---|
| first-correct-edit latency | issue → first commit in the worktree that passes the task's targeted test | worktree git log + test runner |
| reconstruction time | issue → first edit of a target file, minus time waiting on consults | timestamps |
| seeded-defect recall | seeded defects found before acceptance / seeded | grader oracle |
| defect escape | seeded + discovered defects present after acceptance | grader post-run suite |
| finding precision | Elephant findings judged correct by reviewer / findings acted on | reviewer labels |
| verified-citation rate | VERIFIED / all findings | journal |
| stale-claim rate | findings later contradicted by a commit already on main at dispatch | journal + git |
| Elephant overhead | capsule builds + calibrations + rotations (tokens, wall-ms) per arm | journal |
| fallback rate | terminals with `fallback=E0_DIRECT_SOURCE` / consults | journal |
| operator minutes | logged manually per arm per day | run log |
| `rebuild_cost / consult_cost` | ADR-04 trigger | journal |

## 6. Cost model (variables, not forecasts)

Per arm, per epoch window with `n` consults:

```
net_saving ≈ n · (c_rec − c_cons) − L − r · (L_rebuild) − X_fp − X_ops

c_rec      worker reconstruction cost avoided per consult (wall-min or tokens)
c_cons     consult cost = queue + model time; tokens = capsule·(1−d)+question+answer (PREFIX)
d          provider prompt-cache discount on repeated prefix (0 ≤ d < 1; unknown until measured)
L          initial capsule build + calibration
r          rebuilds in window (≈ in-domain accepted commits / batch N)
X_fp       time spent on false-positive findings (precision × reviewer minutes)
X_ops      operator minutes × hourly value
```
Report in **both** wall-minutes and tokens; a wall-time gain bought with 2× tokens is reported as such. Break-even `n* = (L + r·L_rebuild + X_fp + X_ops) / (c_rec − c_cons)`; if `c_rec ≤ c_cons` there is no break-even — which is the expected outcome at Mini scale for single-file tasks.

## 7. Decision rules (pre-registration draft)

* **Keep E1** if, versus **B** (not A): AVT ≥ +15% at ≤ +50% tokens, **or** seeded-defect recall ≥ +25 points with AVT ≥ −10%; and zero safety-invariant breaches.
* **Keep APPEND (E1-P)** only if E1-P − E1-S ≥ +20% on verified findings per 1k tokens on T5–T7 with stale-claim rate not higher.
* **Keep E2** only if E2-S finds ≥ 1 additional seeded cross-domain defect per two T5/T7 runs that E1-S missed, with AVT ≥ E1-S − 10%.
* **Stretch** (charter): ≥ 25% AVT vs A. Reported, not used as a gate.

## 8. Falsifiers (each kills a specific layer)

| Result | Conclusion | Delete |
|---|---|---|
| B ≈ E1-S (within CI) on all metrics | Value is the capsule, not the consult | Elephant runtime; keep capsule builder |
| R ≥ E1-S | Gain was compute, not context | Elephant topology |
| E1-P ≤ E1-S | Persistence adds nothing | APPEND mode, resume plumbing |
| E2-S ≤ E1-S on cross-domain recall | Second node not worth it | E2; keep one node |
| Finding precision < 50% | Advice costs more than it saves | REVIEW kind (keep ASK) |
| Stale-claim rate > 5% despite stamps | Stamps not consulted by workers | worker workflow, or stamps |
| Capsule rebuild after crash fails calibration parity (|Δ| > 0.1) | Not reconstructable | "Elephant as a service" claim |
| Control-plane build time > measured savings over the pilot | Not worth it at this scale | everything except capsule + citation checker |

## 9. Threats to validity

Learning across replications (mitigated by variants + fresh workers); harness version drift (pin and record); provider-side caching differences (analyze separately); grader leakage via code style of a particular model (same worker model across arms); operator bias toward the hypothesis (operator ≠ grader; pre-registration).

## 10. Outputs (aligns with pack `experiments/02_SCORECARD.md`)

`G0-machine-census.json`, `G0-task-bank.json` (executable), `PREREG.md` (frozen §7 + §5), `G1-e0-report.md`, `G2-e1-report.md`, `G3-e2-report.md`, `G4-blind-scorecard.csv`, `G4-decision.md`, journals per arm (sanitized), evidence bundles.
