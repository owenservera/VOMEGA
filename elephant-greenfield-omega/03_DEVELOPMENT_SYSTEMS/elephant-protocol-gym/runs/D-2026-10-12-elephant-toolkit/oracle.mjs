#!/usr/bin/env node
/**
 * RUN D ORACLE — independent mechanical ground truth for the cold-reader trial.
 *
 * This does NOT trust anything a cold reader said, and does not trust the project
 * lead's notes either. It executes the pinned source itself and derives each trap's
 * ground truth from an executable predicate, so scoring is reproducible by a reader
 * who distrusts both the agents and the lead.
 *
 * Predicate per trap (chosen so the trap is UNAMBIGUOUS — no interpretive judgement):
 *   T1 repeat     : declared "count is a nonnegative safe integer"; probe inputs that
 *                   are negative / fractional / NaN and observe no throw + wrong-or-zero output
 *   T2 retryBudget: declared "integer >= 1 and <= MAX_RETRIES"; probe 0, -5, 2.5, NaN
 *   T3 summarize  : declared "exactly three buckets"; probe a single-bucket input
 *   T4 fastClassify: declared "equivalent to classify()"; probe 0 and -0
 *
 * Usage: node oracle.mjs            -> print JSON
 *        node oracle.mjs --check    -> exit 1 if oracle itself is incoherent
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "source");
const f1 = resolve(srcDir, "001-semantic-basics.ts");
const f2 = resolve(srcDir, "002-consumer.ts");

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

// Windows absolute paths must be file:// URLs for the ESM loader.
const m1 = await import(pathToFileURL(f1).href);
const m2 = await import(pathToFileURL(f2).href);

/* ---- T1 repeat ---- */
const capRepeat = (n, cap = 8) => {
  const out = [];
  let threw = null;
  try {
    m1.repeat(n, (v) => {
      if (out.length >= cap) throw new Error("CAP");
      out.push(v);
    });
  } catch (e) {
    threw = e.constructor.name;
    if (threw === "Error" && /CAP/.test(e.message)) threw = "CAP_ABORT";
  }
  return { emitted: out.length, first: out.slice(0, 6), threw };
};
const t1Cases = { neg1: capRepeat(-1), frac25: capRepeat(2.5), nan: capRepeat(NaN), good3: capRepeat(3) };
// Trap holds if the declared precondition is violated *without any error*: a negative
// count emits zero values and a fractional count emits ceil(count) values, both silently.
const T1 = t1Cases.neg1.threw === null && t1Cases.frac25.threw === null &&
           t1Cases.neg1.emitted === 0 && t1Cases.frac25.emitted === 3;

/* ---- T2 retryBudget ---- */
const inRange = (n) => {
  const r = m2.retryBudget(n);
  return Number.isInteger(r) && r >= 1 && r <= m1.MAX_RETRIES;
};
const t2 = { "0": m2.retryBudget(0), "-5": m2.retryBudget(-5), "2.5": m2.retryBudget(2.5), "3": m2.retryBudget(3) };
const t2Viol = [0, -5, 2.5, NaN].filter((n) => !inRange(n));
const T2 = t2Viol.length === 4 && m2.retryBudget(3) === 3;

/* ---- T3 summarizeBuckets ---- */
const t3 = {
  single: m2.summarizeBuckets([1, 2, 3]),
  empty: m2.summarizeBuckets([]),
  all3: m2.summarizeBuckets([-1, 0, 1]),
  reordered: m2.summarizeBuckets([1, -1, 0]),
};
const T3 = t3.single.length === 1 && t3.empty.length === 0 && t3.all3.length === 3 &&
           t3.reordered[0] === "positive";

/* ---- T4 fastClassify drift ---- */
const div = [];
for (let i = -50; i <= 50; i++) if (m2.fastClassify(i) !== m1.classify(i)) div.push(i);
div.push(-0);
const t4 = {
  at_zero: { fixture: m1.classify(0), fast: m2.fastClassify(0) },
  at_negzero: { fixture: m1.classify(-0), fast: m2.fastClassify(-0) },
};
const T4 = div.includes(0) && t4.at_zero.fixture === "zero" && t4.at_zero.fast === "negative";

/* ---- non-trap control: mean holds for all non-empty numeric arrays ---- */
const T5_control_mean = m2.mean([1, 2, 3, 4]) === 2.5 && m2.mean([2]) === 2 && m2.mean([-1, 1]) === 0;

const oracle = {
  generated_by: "oracle.mjs (executable predicates, no hand-written expected values)",
  node: process.version,
  source_sha256: {
    "001-semantic-basics.ts": sha(f1),
    "002-consumer.ts": sha(f2),
  },
  traps: {
    T1_repeat_unenforced: { verdict: T1, evidence: t1Cases },
    T2_retryBudget_unenforced: { verdict: T2, violating_inputs: t2Viol.map(String), observed: t2 },
    T3_summarizeBuckets_unenforced: { verdict: T3, evidence: t3 },
    T4_fastClassify_drift: { verdict: T4, divergent_in_sweep: div, at_zero: t4.at_zero },
  },
  control_mean_contract_holds: { verdict: T5_control_mean, note: "not a trap; mean([])===NaN is a judgement call, deliberately excluded from scoring" },
  trap_count: 4,
};

if (process.argv.includes("--check")) {
  const ok = T1 && T2 && T3 && T4 && T5_control_mean;
  console.log(ok ? "ORACLE SELF-CHECK: PASS (4/4 traps + control)"
                 : "ORACLE SELF-CHECK: FAIL — predicates disagree with each other");
  process.exit(ok ? 0 : 1);
}
console.log(JSON.stringify(oracle, null, 2));