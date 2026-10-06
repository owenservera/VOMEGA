// gate(): the bridge between a prose acceptance criterion and an executable test.
//
// Harvested from the release-use corpus (plugins/vivim-nlcl/test/release-use-corpus.test.ts):
// a known gap runs as `test.failing`, so the suite stays green while the gap is
// open and turns red the moment the gap closes — forcing an explicit promotion
// instead of silent drift. The ratchet generalizes that pattern to every task.
//
//   ratchet mode (default)   promoted gate → test()          (must pass; red = REGRESSION)
//                            open gate     → test.failing()  (red body = expected; green body = PROMOTE ME)
//   probe mode               every gate    → test()          (raw truth, read by `ratchet probe`)
//
// Set RATCHET_MODE=probe to observe raw truth. The ratchet CLI does this itself.
import { test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { gateKey } from "./lock.ts";

export type GateBody = () => void | Promise<void>;
export type GateFn = (task: string, name: string, body: GateBody, timeoutMs?: number) => void;

const TASK_RE = /^[A-Z][A-Z0-9]*-\d{3}[A-Z]?$/;

export function createGate(lockPath: string): GateFn {
  const promoted = new Set<string>();
  if (existsSync(lockPath)) {
    const lock = JSON.parse(readFileSync(lockPath, "utf8")) as { promoted?: Record<string, unknown> };
    for (const k of Object.keys(lock.promoted ?? {})) promoted.add(k);
  }
  const mode = process.env.RATCHET_MODE === "probe" ? "probe" : "ratchet";
  const seen = new Set<string>();
  let warnedExpectedFailure = false;

  return (task, name, body, timeoutMs) => {
    if (!TASK_RE.test(task)) throw new Error(`gate: "${task}" is not a task id`);
    if (name.includes("::")) throw new Error(`gate: name must not contain "::" (${name})`);
    const key = gateKey(task, name);
    if (seen.has(key)) throw new Error(`gate: duplicate gate ${key}`);
    seen.add(key);
    const title = `[${task}] ${name}`;
    if (mode === "probe" || promoted.has(key)) test(title, body, timeoutMs);
    else {
      // C4: a green ratchet-mode run means "open gaps are represented honestly",
      // not "the deliverable works". Say so once per process, loudly.
      if (!warnedExpectedFailure) {
        warnedExpectedFailure = true;
        console.warn(
          "ratchet: RATCHET-MODE suite — open gates run as expected failures, so this suite passing does NOT mean the deliverable is done.\n" +
          "ratchet: raw truth: `bun run ratchet probe`;  independent acceptance: `bun run ratchet status`.",
        );
      }
      test.failing(title, body, timeoutMs);
    }
  };
}

/** Parse a test title produced by gate(). Returns null for ordinary tests. */
export function parseGateTitle(title: string): { task: string; name: string } | null {
  const m = /^\[([A-Z][A-Z0-9]*-\d{3}[A-Z]?)\]\s+(.+)$/.exec(title);
  return m ? { task: m[1]!, name: m[2]! } : null;
}
