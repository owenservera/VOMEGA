# Meta-coherence review — 2026-10-06

A documentation and project-control pass. No product code was changed and no product work was started.

The pass found the corpus sound in intent and mostly careful about evidence. Its main defects were of one kind: lower layers written in the voice of higher ones, and dated instructions still phrased as current. The fixes change authority and status labels far more often than they change content.

## 1. Source reviewed

- Repository: `https://github.com/owenservera/VOMEGA`, branch `main`.
- Source HEAD: `35e5e7d44e807e5ed594738502ce48c4f3ccb9ea` (`origin/main` on 2026-10-06).
- The existing local checkout was used instead of a new clone. It was clean and 31 commits behind at `71cb96c`; it was fast-forwarded to `35e5e7d` before any reading. One untracked local file was present and left untouched (see §5, item 1).
- Checks run on Windows, Bun 1.4.2, at this HEAD: `omega:quick` 62 pass / 0 fail / 1,622 assertions; `bun test plugins/vivim-nlcl` 49 pass / 0 fail / 205 assertions.
- Facts re-checked against code: 24 plugin manifests; `contentHash` empty in all 24; `prompt.send` occurs in no manifest and no plugin source, only in the corpus fixture; corpus has 17 cases, 9 passing and 8 pinned as known gaps, including the false-READY defect `U1`.

## 2. Corpus reviewed

Read in full:

- Root: `AGENTS.md`, `README.md`, `SETUP-STATUS.md`, `INCORPORATION-NOTES.md`.
- `.project/`: all eight top-level files, `evidence/bootstrap.json`, and `meta-tracker.json` (compared field by field against `META-TRACKER.md`: 67 programs, no differences before this pass).
- `.project/agentic-launch/`: all seven documents, `launch-manifest.json`, and all seven handoffs.
- `.project/roadmap/`: all five documents and all nine workstream charters.
- `.project/dev-machine/`: every Markdown file, both JSON files, `select-tasks.py`, all six shell scripts, `press-go-vomega.ps1`, `desired-state.json`.
- `seed-docs/`: 26 of 31 documents, including every Lab design.
- Lock candidates A, B and C.

Read for status, structure and authority-bearing statements, not line by line: `COMMAND-VISUAL-LANGUAGE-DESIGN.md`, `ELEPHANT-CONTEXT-NETWORK.md`, `ZCODE-CAPABILITY-SPACE.md`, `HARVEST-FIRST-ENGINEERING.md`, `BENCHMARKS.md`, `docs/architecture/ELEPHANT-CONTEXT-NETWORK-PLAN.md`, the bodies of Lock D, Lock E and `EXP-BASELINE.md`, and the two remaining PowerShell scripts.

Not reviewed: `omega-baseline/` source beyond the targeted checks above, `External-temp/files/` (the OS-taxonomy pack), and `harvests/`.

## 3. Principal contradictions found

1. **Dated instructions phrased as current.** `FIRST-WAVE.md` carried a "historical" banner above a status of "READY FOR LOCAL BOOTSTRAP EXECUTION". The launch README still told a coordinator to run the preflight and dispatch. `STATUS.md` said concurrency was "not yet a verified measurement" two paragraphs above the measurement. The launch manifest said Grok Build was "owner installing" and the ZCode route was "owner-reported; verify in DEV-L1".
2. **A dead topology kept alive in several places.** "Five Space Bunny lanes" was still the bulk pool in `MODEL-ROUTING.md` (§3, §10 and two benchmarks), a top-level field in the launch manifest, an open question in `DECISIONS.md`, a sentence in `ROADMAP.md`, and the execution pool throughout the seed.
3. **Evidence stated more strongly than it is.**
   - MP-46 was "PROVEN first launch slice". What was observed: six bounded workers each wrote one design document in 28–49 seconds; none wrote code or committed.
   - Lock D was described as a "24-manifest inventory". It lists 24 paths and deep-read three; 21 rows say "not read".
   - The fan-in condition "EXP can replay/diff the current corpus" was treated as satisfied. EXP-L1 defined a runner shape; no runner exists.
   - `PROOF-TRACEABILITY.md` said the machine-readable ledger "is" `evidence/release.json`. That file does not exist.
4. **Lab hypotheses written as constitution.** `SEMANTIC-RUNTIME-LAB.md` §4 defines "the constitutional kernel". `SELF-DESCRIBING-RUNTIME-WIKI.md` says a plugin "may not opt out" and that "the reflective obligation is constitutional", under a status of ACTIVE HYPOTHESIS, while `INVARIANTS.md` records the same idea only as a direction.
5. **Coordination vocabulary written as ownership.** Tracker columns titled "Execution owner(s)", manifest Locks with an `owner`, `WORKSTREAMS.md` "Owns" lists with no grounding banner (the only launch document without one), and per-workstream model tables in `MODEL-ROUTING.md` read as assignments.
6. **The tracker's "what is actually active now" was not about activity.** It listed eleven numbered threads under "NOW" while `STATUS.md` shows nothing claimed.
7. **Residual hierarchy in the dev-machine pack.** After the Daintree/ZCode correction, the README index still said "Why Daintree-primary", "Control plane, freeze/token rules" and "enqueue first unblocked → launch". `desired-state.json` marked both Daintree and ZCode `required: true` next to "independent optional habitats", called Daintree the Windows "secondary habitat" and the Linux box a "control-plane box". `HANDOFF-NEEDED.md` was addressed to a "Chief Of Staff" that `PROCESS.md` says the project does not depend on.
8. **Task-ID namespaces collide.** The dev-machine reference queue invented `PRV-02`, `EXP-02` and `EXP-03`, which already mean different things in the roadmap and in the seed's experiment backlog.
9. **The roadmap's self-adoption steps contradict the later meta rule.** The pack asks for SITREP to list task IDs instead of prose; the owner correction makes task IDs a non-mandatory decomposition. `TASKS.md` still shows all 74 tasks as `open` with no note of partial evidence.
10. **No single answer to "what is fixed?"** The answer existed, spread across the tracker, the seed README, `START-HERE.md` and `INVARIANTS.md`. `SITREP.md`, the declared entry point, opened with bootstrap narrative.

## 4. Changes made

37 files changed and this report added. Everything is a label, a status correction, a cross-link, or a short added section.

**Orientation and authority**

- `SITREP.md`: new Orientation section answering what VOMEGA is for, the current mission, what is fixed, what is hypothesis, what is proven and unproven, which Labs and programs exist, what is active, where state lives, what may be reconsidered, how a team may reorganize, and what needs Owen. All earlier content is kept under "History" with dates.
- `META-TRACKER.md` and `meta-tracker.json`: status renamed to "program coverage map"; an authority ladder; a claim-class vocabulary; a Labs table (questions each Lab may explore, its non-negotiable boundary, what it must not become); §5 retitled "Current convergence candidates" with the numbering marked as non-sequential; §6 marked as a target hypothesis; an evidence-wins rule. Rows MP-19, MP-30 and MP-46 corrected. The JSON gained the same row text plus `labs`, `ladder` and field-meaning notes.
- Root `AGENTS.md` rewritten to the same length: bootstrap is complete, two things are fixed, claim in STATUS and Commons.
- `DECISIONS.md`: entries classified (owner decision, bootstrap implementation decision, open question); owner corrections recorded, including the Daintree/ZCode boundary; a short "Still needs Owen" list; the Space Bunny question closed with the evidence.
- `README.md`: pointer to the tracker; the release paragraph now says nothing of the release exists yet.

**Launch overlay**

- `STATUS.md`: "nothing is claimed and nothing is running"; an Evidence precision section; routing facts stated as measured; fan-in conditions marked met or not met. The lane table keeps its shape, so `select-tasks.py` still parses it.
- `FIRST-WAVE.md`, launch `README.md`, `WORKSTREAMS.md`, `DEPENDENCY-GRAPH.md`, `TEAM-PROMPTS.md`: status corrected to executed or historical; a grounding banner added where missing; Lock meaning stated; resources listed as resources.
- `MODEL-ROUTING.md`: a note that the document is desk research with no measured task evidence; the per-workstream and per-Lock tables retitled as heuristics; five-lane references corrected.
- `launch-manifest.json`: status, measured ZCode state, Grok Build state, historical lanes moved under `resources.historical`, each Lock given a `status` and `proposedBy` in place of `owner`, `lockMeaning`, `waveStatus`.

**Roadmap**

- `roadmap/README.md`: adoption marked optional; a "State of this roadmap" section (unmaintained status column, partial evidence for CMD-02, OPS-03 and PRV-01, the two missing evidence files, the ID collisions); Windows re-verification recorded.
- `ROADMAP.md`, `TASKS.md`, `PROOF-TRACEABILITY.md`, `WS-OPS`: five-lane wording; a note that executor profiles assign nothing; the missing ledger stated; proof obligations separated from the task decomposition that currently carries them.

**Dev-machine pack**

- `README.md`, `HARNESS-MATRIX.md`, `HANDOFF-NEEDED.md`, `META-WORKSTREAM-DISPATCH.md`, `templates/bounded-task.md`, `PROJECT-TRUTH-DIGEST.REFERENCE.md`, `windows-mirror/INDEX.md`: stale index labels, "Windows-primary", the Chief-of-Staff addressing, the reviewer rule, the ID-collision warning and a historical banner.
- `desired-state.json`: Daintree and ZCode set to `required: false`; "secondary habitat" and "control-plane" removed. `verify-vomega-dev.ps1` skips both tools in its required-tool loop, so behavior is unchanged.
- `select-tasks.py`: one comment. No behavior change.

**Seed and registers**

- `seed-docs/README.md`: a "Reading the seed after bootstrap" section that classifies every seed document by standing and lists the bootstrap-era facts that evidence superseded.
- `seed-docs/AGENTS.md`, `CODEX-BOOTSTRAP-START-HERE.md`: supersession notes on the five-lane pool, the bootstrap organization and the bootstrap guide. The original text is untouched.
- `SEMANTIC-RUNTIME-LAB.md` §4, `SELF-DESCRIBING-RUNTIME-WIKI.md` §2: authority notes scoping "constitutional" to the Lab and marking the Reflection obligation as a proposed constitutional change.
- `COMMONS.md`, `ENVIRONMENT.md`, `SETUP-STATUS.md`, `INCORPORATION-NOTES.md`: how-to-read headers, two stale register rows corrected, later observations linked.

**Validation**

All four edited or adjacent JSON files parse. `select-tasks.py` runs. The three PowerShell scripts parse with zero errors. All relative links in changed Markdown files resolve. A search for the superseded terms finds them only inside dated history or explicit supersession notes. No tracked file states a Daintree → ZCode control relationship. No secrets or credentials were added.

## 5. Contradictions deliberately left unresolved

1. **`External-temp/META-WORKSTREAM-GROUNDING.md` (untracked, local, dated 2026-10-06).** It states that "Daintree is the outer worktree/workspace authority" with ZCode as a worker beneath it. That contradicts the correction now recorded in `DECISIONS.md`. It is not in the repository, so it was neither edited nor committed. If it is committed later, it should be marked superseded first.
2. **Simulator-first or transport-first.** `ROADMAP.md` puts real transport and Account evidence (M1) on the critical path from day one. `META-TRACKER.md` §5 leads with the simulator and product twin and runs the live path alongside. Both are hypotheses about sequencing; neither was promoted.
3. **Default precedence.** Lock A carries `Account.defaultFor` and a separate world-level `defaults` block with no stated precedence. TRU-L1 flagged it. It needs a small experiment or a decision by whoever builds the fixtures.
4. **Three validation vocabularies.** The roadmap's CMD-06 outcomes (ready / needs-choice / needs-info / unknown / unavailable / refused), Lock B's interpreter statuses (ok / partial / ambiguous), and VisualSpec vNext's states do not line up yet.
5. **Four maturity ladders.** `PROOF-AND-MATURITY.md` (Idea → … → Sovereign), the roadmap's evidence levels (fixture, verified-local, manual-live, automated-live, differential), `DEPENDENCY-GRAPH.md` §12 labels, and the tracker's status vocabulary. They agree on the distinctions that matter. `SEMANTIC-DATA-ENGINE.md` §5 also omits `automated-live` from a type that its own §7 includes.
6. **VisualSpec: extend or replace.** Open; it needs evidence from a projector spike.
7. **Seed text about five Space Bunny lanes** remains in seven seed documents. It is listed as superseded in the seed README but not rewritten.
8. **First-wave handoffs** expand lane abbreviations inconsistently, and LNC-L1 says the corpus could not be found. They are historical records; the limits are noted in `STATUS.md`.
9. **`evidence/bootstrap.json`** still carries its dated claim about five lanes. Evidence records were not edited.
10. **Dev-machine scripts keep their behavior.** `press-go.sh` still opens Daintree when it is running on the Linux box; `select-tasks.py` still emits `claude` and `grok` as placeholder preferences; `integrate.sh` still requires a `REVIEW_OK` file. These are now documented as conveniences and placeholders.
11. **`windows-mirror/` may be overwritten.** `sync-windows-mirror.sh` copies an out-of-repository box mirror over this folder. The edits to `INDEX.md` and `desired-state.json` will be lost on the next sync unless the box copy is updated too.
12. **Small numeric drift in historical notes.** The CMD-02 card says "8 pass / 7 known gaps + 1 defect"; the corpus is 9 pass / 8 pinned. Two historical notes disagree on which Bun version ran on Linux. The roadmap cites a commit, `769544e`, that is not in this repository.
13. **External model and pricing claims in `MODEL-ROUTING.md`** were not verified in this pass.

## 6. Downgraded from decision to hypothesis

| Was written as | Now reads as |
| --- | --- |
| "What is actually active now": eleven numbered NOW threads | Current convergence candidates; unordered; nothing active unless STATUS says so |
| The first integration checkpoint's exact scripted journey | A target hypothesis; the proof obligation is what matters |
| "Execution owner(s)" per program; Lock `owner` | A routing hint dated 2026-10-05; `proposedBy` |
| Per-workstream and per-Lock model allocation | Starting heuristics from desk research, with no measured basis yet |
| "Claude second; Gemini conditional" | The roadmap's proposed provider order |
| The Lab "constitutional kernel" | A Lab-internal candidate, not the product kernel |
| "The reflective obligation is constitutional"; "a plugin may not opt out" | A proposed constitutional change, awaiting evidence and an owner decision |
| Roadmap adoption steps (task IDs replace SITREP prose) | Optional |
| "Consequential changes require a different harness/provider reviewer" | Independence is required; a different harness is one way to get it |
| Bounded tasks of at most eight tool calls | One observation about one route, not a ceiling |
| Daintree and ZCode as required tools | Optional, independent habitats |
| "≥6" as the concurrency figure | A single measurement; re-measure per launch |
| MP-46 "PROVEN first launch slice" | A narrow proven slice: parallel design artifacts only |
| The five-lane execution pool | Historical configuration |

## 7. What I believe is genuinely constitutional

Short, and all of it already in `seed-docs/INVARIANTS.md` or `PROOF-AND-MATURITY.md`:

- The user's local environment is sovereign; providers stay external; the person can leave with their meaning intact.
- There is one answer to "what is the source of truth"; a projection, cache, summary, session, model context or surface never becomes canonical by convenience.
- The semantic separations: Provider ≠ Account ≠ Model ≠ Session; Capability ≠ Realization; intent ≠ execution; evidence ≠ authority; consequence ≠ authority; routing ≠ authority; description ≠ authority; semantic identity ≠ current policy; fidelity ≠ evidence maturity; World ≠ surface; Work ≠ worker; memory ≠ context.
- Natural language and model output never authorize anything; material ambiguity is shown, narrowed or refused.
- The proof boundary: fixture ≠ live; simulation ≠ live provider behavior; confidence ≠ proof; promotion is proof.
- One semantic operation behind many surfaces, with no privileged path for a UI, a first party or generated code.
- Unknown, historical, hypothesis and contradicted are valid states that must stay representable.
- Self-improvement cannot grant itself authority; constitutional change is a separate category from ordinary evolution.

Even these are, in the seed's own words, "inherited working invariants" that may change through explicit reasoning with preserved lineage. Nothing else in the repository has this standing.

## 8. What still needs Owen's product decision

Also listed in `DECISIONS.md`:

1. RD-8: whether prompt or response content is ever retained. Default today: structural receipts only.
2. RD-10: consent scope for `prompt.send`. Default today: per send.
3. R-2: the position on provider terms of service for web-UI automation, before any live submission.
4. Whether "If Ω can load it, Ω can explain it" becomes an adopted invariant with a core Reflection obligation, or stays a direction.
5. What "Chrome master/slave" commits to beyond "browser-mediated, no AI-API leg", given that the transport family (RD-1) is open.
6. Whether Model routing is in first-release scope or only something the semantic design must admit.
7. Whether the untracked grounding pack (§5, item 1) should enter the repository, and in what corrected form.

## 9. Suggested next launch posture

No team shape or plan is proposed here. These are observations about where evidence is thin:

- **The project is long on design and short on executable evidence.** The first wave produced six design documents and no executable artifact. The next slices are worth more if each leaves something that runs and can fail: a test, a fixture loader, a runner, a recorded observation.
- **The false-READY defect is the cheapest real red-to-green in the repository.** It is pinned in the corpus, several Lock falsifiers depend on it, and it needs a notion of "required field" that other candidates also lack.
- **Nothing may be called live until a live-proof protocol exists.** That protocol is a document, has no dependencies, and gates every provider observation. The live path and the simulated path can proceed independently; the simulated one must never be reported as the live one.
- **The first parallel code change is itself an experiment.** Concurrent code edits, worktree merges and coordination across habitats are unproven. Whoever runs the first one should record what it cost and what broke.
- **Measure capacity and routing at the time.** One concurrency measurement exists, and no model-performance evidence at all. A small comparison on a real bounded task would replace a document of heuristics.
- **Cite IDs with their source.** Until the namespaces are reconciled, a bare `PRV-02` or `EXP-02` is ambiguous.
- **Keep claims in two places only.** STATUS for what is claimed or done, evidence files for what is proven. Every other document can then stay a description.
