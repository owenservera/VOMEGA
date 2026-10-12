/**
 * Run D second fixture — a small cross-file consumer.
 *
 * AUTHORED BY RUN D, 2026-10-12. NOT canonical Gym source. Created only to give the
 * cold-reader trial a genuine cross-file dependency to retrieve and a second,
 * independent declared-vs-actual gap that no other Gym arm has previously exploited.
 *
 * Two traps are present and BOTH are findable only by executing and comparing across
 * files. Do not read this comment; it names no trap and settles nothing.
 */

import { MAX_RETRIES, accumulate, classify } from "./001-semantic-basics.ts";

/**
 * Declared expectation: retryBudget(attempts) always returns an integer >= 1
 * and <= MAX_RETRIES. Not enforced.
 */
export function retryBudget(attempts: number): number {
  return Math.min(attempts, MAX_RETRIES);
}

/**
 * Declared expectation: summarizeBuckets(values) returns exactly the three buckets
 * "negative", "zero", "positive", each present exactly once. Not enforced.
 */
export function summarizeBuckets(values: number[]): string[] {
  const seen = new Set<string>();
  for (const value of values) seen.add(classify(value));
  return [...seen];
}

/** Declared expectation: mean(values) equals the arithmetic mean of values. */
export function mean(values: number[]): number {
  const total = accumulate(values);
  return total / values.length;
}

/**
 * Declared expectation: fastClassify is equivalent to the fixture's classify(),
 * duplicated locally for speed. Not enforced.
 */
export function fastClassify(value: number): string {
  return value <= 0 ? "negative" : "positive";
}