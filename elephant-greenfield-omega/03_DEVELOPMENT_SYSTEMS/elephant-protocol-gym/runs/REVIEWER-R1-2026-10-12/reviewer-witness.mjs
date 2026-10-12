#!/usr/bin/env node
/**
 * REVIEWER INDEPENDENT WITNESS — Round 1.
 *
 * Written by the reviewer, not by any arm. It re-executes the claims that arms A, B and C
 * all reported, using a fresh implementation, so the cross-arm convergence claim is
 * witnessed by a party that wrote none of the arm harnesses.
 *
 * It deliberately does NOT import exp1/exp2/exp4/sempub/compare/oracle. Every predicate
 * here is executable and derives its expected value from the source or from execution,
 * never from an agent's self-report.
 *
 * Usage:  node reviewer-witness.mjs          -> print JSON
 *         node reviewer-witness.mjs --check  -> exit 1 if any reviewer predicate disagrees
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, "..", "..", "fixture", "001-semantic-basics.ts");
const src = readFileSync(fixture, "utf8");
const sha = createHash("sha256").update(src).digest("hex");

const m = await import(pathToFileURL(fixture).href);

/* --- W1: the declared precondition of `repeat` is unenforced, silently --- */
const callRepeat = (count) => {
  const emitted = [];
  let threw = null;
  try {
    m.repeat(count, (v) => emitted.push(v));
  } catch (e) {
    threw = e.constructor.name;
  }
  return { emitted: emitted.length, values: emitted.slice(0, 5), threw };
};
const w1 = {
  neg1: callRepeat(-1),
  nan: callRepeat(NaN),
  frac25: callRepeat(2.5),
  frac05: callRepeat(0.5),
  frac37: callRepeat(3.7),
  zero: callRepeat(0),
  good3: callRepeat(3),
};
// Predicate: a violating input is accepted without any diagnostic, and a fractional count
// is answered with ceil(count) emissions rather than an error.
const W1 = [w1.neg1, w1.nan, w1.frac25, w1.frac05, w1.frac37].every((r) => r.threw === null) &&
           w1.frac25.emitted === 3 && w1.frac05.emitted === 1 && w1.frac37.emitted === 4 &&
           w1.neg1.emitted === 0 && w1.nan.emitted === 0 &&
           w1.zero.emitted === 0 /* indistinguishable from neg1/NaN */;

/* --- W2: a violating caller typechecks clean under --strict (the type layer is silent) --- */
const W2 = { note: "established by the emitted .d.ts and by tsc; see W3/W4 witnesses" };

/* --- W3: classify(NaN) returns a member of the declared union that is semantically false --- */
const w3 = { nan: m.classify(NaN), zero: m.classify(0), negzero: m.classify(-0), neg1: m.classify(-1), pos1: m.classify(1) };
const W3 = w3.nan === "positive" && w3.zero === "zero" && w3.neg1 === "negative";

/* --- W4: MAX_RETRIES is the most rigidly typed symbol and is referenced nowhere --- */
const refs = [...src.matchAll(/\bMAX_RETRIES\b/g)].length;
const W4 = refs === 1 /* its own declaration only */ && /export const MAX_RETRIES = 3;/.test(src);

/* --- W5: repeat is not atomic — a throwing callback leaves a partial effect --- */
const partialAt = (throwAt) => {
  const delivered = [];
  let threw = null;
  try {
    m.repeat(10, (v) => {
      delivered.push(v);
      if (v === throwAt) throw new Error("callback-failed");
    });
  } catch (e) {
    threw = e.message;
  }
  return { delivered: delivered.length, threw };
};
const w5 = { at0: partialAt(0), at1: partialAt(1), at2: partialAt(2), at99: partialAt(99) };
// CORRECTION 2026-10-12 (automation pass, independently re-derived before editing):
// the original predicate asserted `at1.delivered === 1` and `at99.delivered === 99`.
// Both were wrong about the probe, not about the source.
//   - partialAt PUSHES v and then throws, so delivered is throwAt+1, never throwAt.
//   - repeat(10) emits 0..9, so throwAt=99 is never reached: nothing throws and all
//     10 values are delivered. That is a fact about the probe's range, not a defect.
// The honest claim is: a throwing callback leaves delivered values already emitted,
// with no rollback — and a throw outside the emitted range is a no-op.
const W5 = w5.at1.threw !== null && w5.at1.delivered === 2 &&
           w5.at2.delivered === 3 &&
           w5.at0.delivered === 1 &&
           w5.at99.threw === null && w5.at99.delivered === 10;

/* --- W6: cost is linear and UNBOUNDED in count; there is no upper guard ---
 * THREE successive corrections, because this is the exact failure the fixture exists
 * to expose — an instrument's behaviour being reported as a fact about the source:
 *
 *  1. The original probe called 1e9 "non-terminating". False. It returns, in ~3.2 s.
 *  2. The second probe tried to bound it with Promise.race + AbortController. Also
 *     false: the event loop never reaches the abort callback while a synchronous
 *     loop is running, so that instrument measured its own 200M guard counter.
 *     A time bound on a synchronous call has to be process-level.
 *  3. Even a correct process-level bound produced a THRESHOLD ARTEFACT: 1e9 measures
 *     3189 ms against a 4000 ms bound — it returns, but only just. Arm A exp1 recorded
 *     1e9 as "did not return" within 4000 ms. On this machine that is a near-miss
 *     against an arbitrary cutoff, i.e. a machine-load artefact, NOT a source fact.
 *
 * The defensible claim is the SHAPE, not any one threshold: emission count equals the
 * integer count exactly, cost is linear at ~3.2 ns per emission, and no value of count
 * is ever refused. So 1e9 costs ~3.2 s, 2^53 would cost ~8 hours, and Infinity never
 * returns. Perfect enforcement of the author's declared contract would not change this,
 * because every one of these values SATISFIES that contract. */
const timed = (count) => {
  const t0 = process.hrtime.bigint();
  let c = 0;
  m.repeat(count, () => { c++; });
  return { emitted: c, ms: Number(process.hrtime.bigint() - t0) / 1e6 };
};
const hardBound = (expr, ms) => {
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", `
    import(${JSON.stringify(pathToFileURL(fixture).href)}).then((m) => {
      let n = 0; m.repeat(${expr}, () => { n++; }); console.log("returned:" + n);
    });`], { timeout: ms, encoding: "utf8" });
  if (r.error && r.error.code === "ETIMEDOUT") return "exceeded-4000ms-bound";
  return (r.stdout || "").trim() || "nonzero-exit";
};
const t7 = timed(1e7), t8 = timed(1e8);
const w6 = {
  "1e7": t7, "1e8": t8,
  slope_ms_per_1e8: +(t8.ms / t7.ms).toFixed(2),
  ns_per_emission: +(t8.ms * 1e6 / t8.emitted).toFixed(2),
  "2^53_within_4s": hardBound("2**53", 4000),
  "Infinity_within_4s": hardBound("Infinity", 4000),
};
/* CORRECTION 4 (reviewer) — and this one is the most instructive.
 * The previous version gated W6 on a TIMING SLOPE window (t(1e8)/t(1e7) between 8 and 12).
 * Calibrated on an idle machine it read 10.3 and passed. Under load the same code read
 * 12.6, 15.1 and 13.5 on three consecutive runs and failed — because the 1e7 sample is
 * short enough (30-90 ms) to be dominated by scheduler noise, while the 1e8 sample is
 * long enough to absorb it. The slope was not measuring the source.
 *
 * That is the SAME error as §2.3 in the synthesis, committed by the reviewer who wrote
 * §2.3. The general rule it yields: a predicate that gates on wall-clock must be
 * calibrated against a stated, re-verified envelope; anything short of that is DESCRIPTIVE.
 * So the predicates below are now only deterministic properties — exact emission counts,
 * and the two hard bounds, which are robust because the true costs are ~8 hours and
 * infinite, not minutes. Timing is reported, not gated. */
const W6 = t7.emitted === 1e7 && t8.emitted === 1e8 &&
           w6["2^53_within_4s"] === "exceeded-4000ms-bound" &&
           w6["Infinity_within_4s"] === "exceeded-4000ms-bound";

/* --- W7: add() body mutation leaves the emitted declaration byte-identical --- */
const declOf = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").split("export function").slice(1).join("export function");
const mutated = src.replace("return a + b;", "return a * b;");
const bodyChanged = mutated !== src;
// The type surface is textually derived from the *signature lines only*; show that the
// signature line of `add` is untouched by the body-only mutation.
const sigLine = (t) => (t.match(/export function add\([^)]*\): number/) || [""])[0];
const W7 = { body_changed: bodyChanged, signature_before: sigLine(src), signature_after: sigLine(mutated),
             identical: sigLine(src) === sigLine(mutated) };

/* --- W8: the whole file is closed — no default export, no class, no import, no I/O --- */
const W8 = {
  default_export: /export default/.test(src),
  imports: (src.match(/^\s*import\s/gm) || []).length,
  classes: (src.match(/\bclass\b/g) || []).length,
  async: /\basync\b/.test(src),
  generics: /</.test(src.replace(/\/\*[\s\S]*?\*\//g, "")),
};

const witness = {
  schema: "reviewer-independent-witness/1",
  written_by: "Round-1 reviewer (not arm A, B, C or D)",
  node: process.version,
  repo_commit_expected: "1199b38c1fd174e997c92b22d18d8c20c952eb9e",
  source_sha256: sha,
  predicates: {
    W1_repeat_precondition_unenforced_and_silent: W1,
    W2_type_layer_silent: W2,
    W3_classify_nan_type_conforming_but_false: W3,
    W4_max_retries_rigid_and_unreferenced: W4,
    W5_repeat_not_atomic_partial_effect: W5,
    W6_legal_precondition_exceeds_time_bound: W6,
    W7_type_surface_blind_to_body_mutation: W7,
    W8_fixture_is_closed: W8,
  },
  evidence: { w1, w3, w5, w6, w7: W7 },
};

const allTrue = W1 && W3 && W4 && W5 && W6 && W7.body_changed && W7.identical;
if (process.argv.includes("--check")) {
  console.log(allTrue ? "REVIEWER WITNESS SELF-CHECK: PASS (6/6 executable predicates)" : "REVIEWER WITNESS SELF-CHECK: FAIL");
  process.exit(allTrue ? 0 : 1);
}
console.log(JSON.stringify(witness, null, 2));