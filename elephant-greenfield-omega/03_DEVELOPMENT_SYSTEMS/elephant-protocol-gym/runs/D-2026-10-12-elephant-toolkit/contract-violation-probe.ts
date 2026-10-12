// Probe: do the DECLARED contracts get any compile-time enforcement?
import { repeat } from "./source/001-semantic-basics.ts";
import { retryBudget, summarizeBuckets, mean, fastClassify } from "./source/002-consumer.ts";

const bad1: number[] = repeat(-1);        // declared: count must be nonnegative int
const bad2: string = repeat(3);            // declared: returns void
const bad3: number = retryBudget(-5);      // declared: integer >= 1
const bad4: string[] = summarizeBuckets([]); // declared: exactly three buckets
const bad5: number = mean([]);             // declared: arithmetic mean
const bad6: string = fastClassify(0);      // declared: equivalent to classify()
console.log(bad1, bad2, bad3, bad4, bad5, bad6);
