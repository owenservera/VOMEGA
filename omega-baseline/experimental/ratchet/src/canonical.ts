// Canonical JSON + content digests. Zero dependencies beyond node:crypto.
// Every identity the ratchet records (task graph, spec files, gate keys,
// evidence summaries) goes through here so that equal content ⇒ equal digest.
import { createHash } from "node:crypto";

export type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/** Deterministic JSON: sorted object keys, absent-not-undefined, finite numbers only. */
export function canonicalize(value: unknown): string {
  return JSON.stringify(normalize(value, "$"));
}

function normalize(v: unknown, path: string): Json {
  if (v === null) return null;
  switch (typeof v) {
    case "boolean":
    case "string":
      return v;
    case "number":
      if (!Number.isFinite(v)) throw new TypeError(`canonicalize: non-finite number at ${path}`);
      return Object.is(v, -0) ? 0 : v;
    case "undefined":
      throw new TypeError(`canonicalize: undefined at ${path} (omit the key instead)`);
    case "object": {
      if (Array.isArray(v)) return v.map((x, i) => normalize(x, `${path}[${i}]`));
      const out: { [k: string]: Json } = {};
      for (const k of Object.keys(v as object).sort()) {
        const x = (v as Record<string, unknown>)[k];
        if (x === undefined) continue; // an absent optional field
        out[k] = normalize(x, `${path}.${k}`);
      }
      return out;
    }
    default:
      throw new TypeError(`canonicalize: unsupported ${typeof v} at ${path}`);
  }
}

export function digestText(text: string): string {
  return "sha256:" + createHash("sha256").update(text, "utf8").digest("hex");
}

export function digest(value: unknown): string {
  return digestText(canonicalize(value));
}

/** Short form for human tables only. Never use as an identity. */
export function short(d: string, n = 12): string {
  return d.replace(/^sha256:/, "").slice(0, n);
}
