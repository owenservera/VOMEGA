// SourceAnchor — the source-bound identity every Reflection fact hangs from (MP21-P1).
//
// Shape follows seed-docs/SELF-KNOWLEDGE-REFLECTION-MIGRATOR.md §7, with two rules made
// explicit because they decide whether identities survive ordinary edits:
//   - `id` is the identity. It is built only from extraction kind, path and symbol, so it
//     does not move when lines shift, when the file changes elsewhere, or between commits.
//   - `commit`, `contentHash`, `spanHash` and `range` say WHICH VERSION of that identity
//     was observed. `range` is a navigation hint and never part of identity.
import { digestText } from "../../ratchet/src/canonical.ts";

/** file, manifest and declaration are minted by the P1 inventory; the rest by P2 extractors. */
export const ANCHOR_KINDS = ["file", "manifest", "declaration", "op-registration", "port-call", "language"] as const;
export type AnchorKind = (typeof ANCHOR_KINDS)[number];

export interface SourceAnchor {
  id: string;
  extractionKind: AnchorKind;
  repository: string;
  commit: string;
  path: string;
  /** sha256 of the whole file blob at `commit`. */
  contentHash: string;
  symbol?: string;
  /** sha256 of the symbol's own source text; unchanged by edits elsewhere in the file. */
  spanHash?: string;
  range?: { startLine: number; endLine: number };
}

export function anchorId(kind: AnchorKind, path: string, symbol?: string): string {
  return symbol === undefined ? `${kind}:${path}` : `${kind}:${path}#${symbol}`;
}

export function hashBytes(bytes: Uint8Array): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(bytes);
  return "sha256:" + hasher.digest("hex");
}

export const hashText = digestText;

/** Codepoint order. localeCompare depends on the machine's locale, so it is never used. */
export function byString(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
