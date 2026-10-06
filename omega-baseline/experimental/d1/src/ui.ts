// Developer product-twin renderer (D1-042..048). STUB.
// renderHtml is a pure function of a Projection (no language parsing, no
// private routing state). Clicking a chooser option must dispatch the option's
// `action` exactly as given in the projection. Every page must show SIMULATED.
import type { Projection } from "./contract.ts";
import { notImplemented } from "./not-implemented.ts";

export function renderHtml(p: Projection): string {
  return notImplemented("D1-042", `renderHtml(revision ${p.revision})`);
}
