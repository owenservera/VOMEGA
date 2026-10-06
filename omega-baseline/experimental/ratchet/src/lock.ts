// The ratchet lock: the only place that records which gates are promoted
// (must stay green forever), which tasks passed independent review, and which
// were superseded. It only ever moves forward through `promote`, `review` and
// `supersede`; nothing in the lock is inferred from self-report.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export interface Promotion {
  task: string;
  name: string;
  file: string;          // repo-relative gate test file
  specDigest: string;    // digest of the gate file content when promoted
  by: string;            // who ran promote (agent/harness/human label)
  head: string;          // source HEAD at promotion
  at: string;            // ISO timestamp
}

export interface Review {
  by: string;
  verdict: "accept" | "reject";
  head: string;
  at: string;
  note?: string;
}

export interface Supersession { by: string; reason: string; at: string }

/**
 * An explicit, reasoned mutation of an anchored gate/spec file. This is the
 * only path by which a gate may be weakened, split or deleted after the
 * initial anchor: the reason is kept forever and the from/to digests give
 * lineage. Absent a spec-change, a changed anchor is drift (C1).
 */
export interface SpecChange { file: string; by: string; reason: string; at: string; from: string | null; to: string | null }

export interface Lock {
  schema: "ratchet.lock/0";
  spec: string;
  /** Gate/spec file digest recorded at ratchet initialization — the pre-implementation anchor (C1). */
  anchors: Record<string, string>;
  /** Explicit, reasoned mutations of anchored files. Lineage for every post-anchor gate change. */
  specChanges: SpecChange[];
  promoted: Record<string, Promotion>;
  reviews: Record<string, Review[]>;
  superseded: Record<string, Supersession>;
  completion: { head: string; at: string; by: string } | null;
}

export function gateKey(task: string, name: string): string {
  return `${task}::${name}`;
}

/** Coordination labels are compared normalized (trimmed, case-folded) so `Impl` ≠ evasion of `impl`. */
export const normalizeLabel = (s: string): string => s.trim().toLowerCase();

export function emptyLock(spec: string): Lock {
  return { schema: "ratchet.lock/0", spec, anchors: {}, specChanges: [], promoted: {}, reviews: {}, superseded: {}, completion: null };
}

export function readLock(path: string, spec = "unknown"): Lock {
  if (!existsSync(path)) return emptyLock(spec);
  const lock = JSON.parse(readFileSync(path, "utf8")) as Lock;
  if (lock.schema !== "ratchet.lock/0") throw new Error(`ratchet: ${path} is not a ratchet.lock/0 file`);
  lock.anchors ??= {};
  lock.specChanges ??= [];
  lock.reviews ??= {};
  lock.superseded ??= {};
  lock.promoted ??= {};
  lock.completion ??= null;
  return lock;
}

/**
 * The digest each anchored file is allowed to have right now: the initial
 * anchor, overridden by the newest explicit spec-change for that file. A
 * `null` value means the file is authorized to be deleted. Any current digest
 * differing from this (including an unexpected presence or absence) is
 * unacknowledged drift.
 */
export function authorizedDigests(lock: Lock): Record<string, string | null> {
  const out: Record<string, string | null> = { ...lock.anchors };
  for (const sc of lock.specChanges) out[sc.file] = sc.to;
  return out;
}

/** Stable on-disk form: sorted keys so concurrent promotions merge with small diffs. */
export function writeLock(path: string, lock: Lock): void {
  const sorted = <T>(o: Record<string, T>) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]!]));
  const out: Lock = {
    schema: lock.schema,
    spec: lock.spec,
    anchors: sorted(lock.anchors),
    specChanges: lock.specChanges,
    promoted: sorted(lock.promoted),
    reviews: sorted(lock.reviews),
    superseded: sorted(lock.superseded),
    completion: lock.completion,
  };
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
}

/** The latest review decides; independence is checked against everyone who promoted the task's gates. */
export function acceptedIndependentReview(lock: Lock, task: string, otherAuthors: string[] = []): Review | null {
  const list = lock.reviews[task] ?? [];
  const latest = list[list.length - 1];
  if (!latest || latest.verdict !== "accept") return null;
  return authorsOf(lock, task, otherAuthors).has(normalizeLabel(latest.by)) ? null : latest;
}

/** Everyone who promoted a gate of the task, plus anyone who claimed it (implementers). Labels normalized. */
export function authorsOf(lock: Lock, task: string, otherAuthors: string[] = []): Set<string> {
  const promoters = Object.values(lock.promoted).filter((p) => p.task === task).map((p) => p.by);
  return new Set([...promoters, ...otherAuthors].map(normalizeLabel));
}
