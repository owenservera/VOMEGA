// Claims are leases, not ownership. An expired lease is simply absent: no
// agent has to remember to release, and no document can keep a dead claim
// alive (the failure STATUS.md shows today). History is kept so review
// independence can be checked against implementers.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export interface Claim {
  task: string;
  by: string;
  at: string;          // ISO
  expires: string;     // ISO
  note?: string;
  releasedAt?: string; // ISO; present ⇒ inactive
}

export interface ClaimsFile { schema: "ratchet.claims/0"; claims: Claim[] }

export function readClaims(path: string): ClaimsFile {
  if (!existsSync(path)) return { schema: "ratchet.claims/0", claims: [] };
  const f = JSON.parse(readFileSync(path, "utf8")) as ClaimsFile;
  if (f.schema !== "ratchet.claims/0") throw new Error(`ratchet: ${path} is not a ratchet.claims/0 file`);
  return f;
}

export function writeClaims(path: string, f: ClaimsFile): void {
  writeFileSync(path, JSON.stringify(f, null, 2) + "\n");
}

export function isActive(c: Claim, now: Date): boolean {
  return c.releasedAt === undefined && Date.parse(c.expires) > now.getTime();
}

export function activeClaim(f: ClaimsFile, task: string, now: Date): Claim | null {
  for (let i = f.claims.length - 1; i >= 0; i--) {
    const c = f.claims[i]!;
    if (c.task === task && isActive(c, now)) return c;
  }
  return null;
}

export function claimants(f: ClaimsFile, task: string): string[] {
  return [...new Set(f.claims.filter((c) => c.task === task).map((c) => c.by))];
}

/** Parse "90m", "4h", "2d" (default hours). */
export function parseTtl(s: string): number {
  const m = /^(\d+(?:\.\d+)?)([mhd]?)$/.exec(s.trim());
  if (!m) throw new Error(`ratchet: bad ttl "${s}" (use 90m, 4h, 2d)`);
  const n = Number(m[1]);
  const unit = m[2] || "h";
  return n * (unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000);
}

export function claim(f: ClaimsFile, task: string, by: string, now: Date, ttlMs: number, note?: string): Claim {
  const cur = activeClaim(f, task, now);
  if (cur && cur.by !== by) throw new Error(`ratchet: ${task} is claimed by ${cur.by} until ${cur.expires}`);
  if (cur) { // renewal
    cur.expires = new Date(now.getTime() + ttlMs).toISOString();
    if (note !== undefined) cur.note = note;
    return cur;
  }
  const c: Claim = { task, by, at: now.toISOString(), expires: new Date(now.getTime() + ttlMs).toISOString() };
  if (note !== undefined) c.note = note;
  f.claims.push(c);
  return c;
}

export function release(f: ClaimsFile, task: string, by: string, now: Date): Claim {
  const cur = activeClaim(f, task, now);
  if (!cur) throw new Error(`ratchet: ${task} has no active claim`);
  if (cur.by !== by) throw new Error(`ratchet: ${task} is claimed by ${cur.by}, not ${by}`);
  cur.releasedAt = now.toISOString();
  return cur;
}
