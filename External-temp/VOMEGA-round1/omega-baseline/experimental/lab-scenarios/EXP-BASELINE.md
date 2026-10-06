# EXP-BASELINE — Semantic Experiment Baseline (first increment)

Status: **EXP-L1 DRAFT / lab evidence — NOT product authority.**
Source design: `seed-docs/AUTOMATED-SEMANTIC-EXPERIMENTS.md` (§3–13, 19, 26, 27).
Release corpus under test: `omega-baseline/plugins/vivim-nlcl/test/fixtures/release-use-corpus.json`
Runner (existing release test): `omega-baseline/plugins/vivim-nlcl/test/release-use-corpus.test.ts`
Interpretation engine: `omega-baseline/plugins/vivim-nlcl-pure` (`interpret`, `emptyWorld`, `DEFAULT_FRAMES`).
This increment defines the reusable shape only. It does **not** promote grammar or mutate the corpus.

---

## (a) Reusable scenario-runner shape

A deterministic runner that, per scenario, (1) resolves a pinned profile, (2) builds the world,
(3) runs `interpret` twice for replay, (4) serializes a structured result. No UI, no network.

```ts
interface ScenarioRunnerInput {
  profileId: string;                 // pinned Lab Profile name
  scenarioSetId: string;             // corpus id + version
  seed?: number;                     // for any stochastic mutation selection
}

interface ScenarioResult {
  scenarioId: string;
  profileId: string;
  revisions: RevisionResult[];       // one per scenario.revisions entry
  replay: { deterministic: boolean; digest: string };
}

interface RevisionResult {
  revision: number;
  text: string;
  interpretation: {                  // raw engine output (nlcl-pure)
    intent: string | null;
    status: string;                  // ok | ambiguous | unknown | ...
    slots: Record<string, { entityId: string | null; matches: { entityId: string }[] }>;
    payload: Record<string, unknown>;
    effects: { gate: string }[];
  };
  handles: SemanticHandle[];         // normalized, diff-stable view
}

interface SemanticHandle {           // stable projection used by diffs/metrics
  id: string;                        // e.g. "acct:account:claude-work"
  role: string;                      // provider | account | model | payload
  state: "resolved" | "ambiguous" | "unresolved" | "forbidden";
  value: string | null;
}
```

Pinned profile (the unit of comparison, per §2) — candidate must be replayable from this:

```json
{
  "profileId": "baseline-nlcl-pure-0.1.0",
  "semanticRegistry": "omega-baseline/plugins/vivim-nlcl-pure",
  "frames": "release-use-corpus.candidateFrames (injected, restored in afterAll)",
  "interpretationPipeline": "interpret@nlcl-pure",
  "groundingPolicy": "explicit > prior-rank > ambiguous (prior never decides)",
  "validator": "nlcl-pure status (KNOWN WEAK: U1)",
  "visualProjector": null,
  "wikiProjector": null,
  "evaluator": "EXP-BASELINE metrics (this doc)"
}
```

Runner contract: the candidate profile is loaded into `DEFAULT_FRAMES` in `beforeAll` and
spliced back out in `afterAll` (mirrors the existing release test). The baseline is never
overwritten (§27 #8).

---

## (b) Running the current release corpus through it

The corpus already encodes the needed fields. Mapping is direct, no corpus edit required:

| Runner concept | Corpus source |
|---|---|
| `scenarioId` | `cases[].id` |
| tags | `cases[].category` |
| `initialWorld` | `worlds[cases[].world]` (+ `extends` resolved recursively) |
| `revisions[0].text` | `cases[].input` |
| `expected` | `cases[].expect` |
| profile disposition | `cases[].baseline` (`pass` \| `fail`) |
| run disposition | `test.failing` when `baseline=fail` |

Existing corpus coverage (17 cases across 9 categories): paraphrase-equivalence (P1–P5),
explicit-target-precedence (E1–E2), ambiguity-preservation (A1–A2), unknown-capability (U1–U2),
authority-separation (S1), replay (R1), orientation (O1–O2), registration (G1), help (H1).

Seeded baseline expectations already observable without product edits:
- `U1` `send 'x' to Gemini` → engine returns `status:"ok"` with required account unresolved
  → **false-ready** positive (defect, task CMD-06).
- `A2` with `three-accounts-personal-prior` → priors rank but do not decide → ambiguity preserved.
- `O1` `what accounts do I have?` → verb `have` collides with `prompt.send` (task CMD-07).
- `P1/P3/P4/P5` → addressee-first phrasing unresolved (task CMD-04).
- `G1` → no registration family (task CMD-07).
- `R1`, `S1` → deterministic replay and consent-gate projection hold.

---

## (c) Semantic diff format

Diff **structured handles before text/pixels** (§19, §27 #6). Two revisions or two profiles.

```json
{
  "diffKind": "semantic",
  "from": { "scenarioId": "A2", "profileId": "baseline-nlcl-pure-0.1.0", "revision": 1 },
  "to":   { "scenarioId": "A2", "profileId": "candidate-addressee-first", "revision": 1 },
  "handles": {
    "stable":      ["acct:account:claude-work"],
    "new":         [],
    "resolved":    [],
    "invalidated": [],
    "unexpectedFlips": ["acct:account:claude-personal"]
  },
  "targetChanged": true,
  "readinessChanged": false,
  "ambiguityDelta": "removed",
  "consequenceChanged": false,
  "classification": "REGRESSION"
}
```

Classification rule: any `unexpectedFlips` or `targetChanged` where the change was not the
hypothesis → `REGRESSION`; otherwise `IMPROVEMENT` or `NEUTRAL`. Pixel diffs are attached
separately (`diffKind:"pixel"`) and never substitute for this.

---

## (d) Baseline metric definitions

All four are computed over `ScenarioResult[]` for a pinned profile.

1. **wrong-target rate** — fraction of consequential commands where any of: explicit Provider
   ignored, explicit Account ignored, explicit Model ignored, payload text misread as route,
   prior/default overriding an explicit choice (§13). Target: 0.
   ```
   wrongTargetRate = |{cases with explicit expectation violated}| / |{consequential cases}|
   ```
   Explicit expectation detected when `expect.account`/`expect.op` is set and the observed
   target differs.

2. **false-ready rate** — fraction of commands reported READY (`status:"ok"`, no blocking
   effect) while a *required* field is unresolved or unsupported (§12, §27 #4). `U1` is the
   canonical positive. Target: effectively 0 for consequential commands.
   ```
   falseReadyRate = |{status:"ok" ∧ ∃ required slot unresolved}| / |{consequential cases}|
   ```

3. **ambiguity honesty** — fraction of genuinely ambiguous cases where the system represents
   uncertainty (`status:"ambiguous"`) instead of silently guessing (§11, §27 #5). Also record
   **time-to-honesty**: earliest revision index where `state:"ambiguous"` appears.
   ```
   ambiguityHonesty = |{expect.status:"ambiguous" ∧ observed.status:"ambiguous"}| /
                      |{expect.status:"ambiguous"}|
   ```
   A case where ambiguity is the correct state is NOT counted as a failure.

4. **deterministic replay** — `interpret(text, world)` run twice must produce byte-identical
   serialized results (§19, R1).
   ```
   replayDeterminism = |{scenario: digest(run1) === digest(run2)}| / |{scenarios}|
   ```

Secondary (record, do not gate on): semantic churn per revision (`stable/new/resolved/
invalidated/unexpected flips`, §10).

---

## (e) Metamorphic test candidates

Each transformation pairs with a source case and an invariant (§6). These are **proposals**,
not corpus truth — labeling is a separate review step (§16).

```json
[
  { "id": "MM-01", "source": "P2", "transform": "benign-paraphrase",
    "invariant": "command digest unchanged when only politeness/filler changes" },
  { "id": "MM-02", "source": "E1", "transform": "add-explicit-account",
    "invariant": "adding an explicit Account never resolves to a different Account" },
  { "id": "MM-03", "source": "P2", "transform": "quoted-payload",
    "invariant": "provider/model words inside quoted payload must not change routing" },
  { "id": "MM-04", "source": "A1", "transform": "remove-account-qualifier",
    "invariant": "removing a disambiguator may increase uncertainty; must not silently produce a different specific target" },
  { "id": "MM-05", "source": "E2", "transform": "correction",
    "invariant": "a correction changes only the addressed field unless dependency invalidation requires more" },
  { "id": "MM-06", "source": "S1", "transform": "icon-pack-swap",
    "invariant": "changing icon pack must not change command digest" },
  { "id": "MM-07", "source": "R1", "transform": "prose-renderer-swap",
    "invariant": "changing prose renderer must not change reflected source facts" }
]
```

---

## (f) VisualSpec consume format

Visual layers **consume** the semantic result and never introduce semantics (§8, §27 #2).
The semantic input is frozen while presentation varies. Format:

```json
{
  "semanticInputDigest": "sha256:...",
  "profileId": "baseline-nlcl-pure-0.1.0",
  "scenarioId": "A2",
  "revision": 1,
  "handles": [
    { "id": "acct:account:claude-work", "role": "account", "state": "ambiguous",
      "affordance": "dashed-chip", "visibleInCompact": true },
    { "id": "acct:account:claude-personal", "role": "account", "state": "ambiguous",
      "affordance": "dashed-chip", "visibleInCompact": true },
    { "id": "payload:review this", "role": "payload", "state": "resolved",
      "affordance": "phrase-underline", "visibleInCompact": true }
  ],
  "routeStrip": { "provider": null, "account": "?", "model": null },
  "consequenceFacets": [],
  "readyState": "AMBIGUOUS",
  "iconPackId": "pack-a",
  "wikiPrimary": []
}
```

Projector contract: given the same `semanticInputDigest`, any variant (`annotated-sentence`,
`semantic-strip`, `hybrid`; any icon pack) must produce the same `handles[].id/role/state`
set. Only `affordance`/layout/pixels may differ. Metrics fed back (§9): visible semantic
object count, semantic coverage, unresolved-ambiguity visibility, route completeness,
consequence completeness, accessible (non-color-only) distinctions, Wiki topic presence,
avoidable flicker, layout overflow, duplicate labels.

---

## Falsifiers carried forward (§27)

Any run is invalid if: candidate overwrites baseline; pixel diff substitutes for semantic
diff; LLM mutations become truth without labeling; ambiguity counted as failure when it is the
correct state; a single accuracy score hides wrong-target errors; runs are not replayable from
the pinned profile. No auto-promotion from heuristics.
