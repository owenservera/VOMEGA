// Canonical JSON digest for D1 semantic identity (World, command, evidence).
// Deliberately independent of the ratchet's copy: D1 must run with no dev tooling.
import { createHash } from "node:crypto";

export function canonicalize(value: unknown): string {
  const norm = (v: unknown, path: string): unknown => {
    if (v === null || typeof v === "boolean" || typeof v === "string") return v;
    if (typeof v === "number") {
      if (!Number.isFinite(v)) throw new TypeError(`canonicalize: non-finite number at ${path}`);
      return Object.is(v, -0) ? 0 : v;
    }
    if (Array.isArray(v)) return v.map((x, i) => norm(x, `${path}[${i}]`));
    if (typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v as object).sort()) {
        const x = (v as Record<string, unknown>)[k];
        if (x !== undefined) out[k] = norm(x, `${path}.${k}`);
      }
      return out;
    }
    throw new TypeError(`canonicalize: unsupported ${typeof v} at ${path}`);
  };
  return JSON.stringify(norm(value, "$"));
}

export function digestText(text: string): string {
  return "sha256:" + createHash("sha256").update(text, "utf8").digest("hex");
}

export function digest(value: unknown): string {
  return digestText(canonicalize(value));
}
