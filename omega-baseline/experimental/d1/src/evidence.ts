// The live-evidence predicate (D1-067). IMPLEMENTED in the seed because it is
// the boundary every later provider path must pass through, and it must be
// impossible for a D1 receipt to satisfy it. Live evidence is a positive claim
// that requires a provider observation; absence of the SIMULATED label is not
// enough to make something live.
export const LIVE_EVIDENCE_CLASSES = ["MANUAL-LIVE", "AUTOMATED-LIVE"] as const;

/** Keys a simulated receipt must never carry: they imply authenticated provider observation. */
export const LIVE_ONLY_KEYS = ["providerObservation", "observedAt", "authenticatedAccount", "accountVerified", "liveSession", "providerResponseId"] as const;

export function isLiveEvidence(x: unknown): boolean {
  if (x === null || typeof x !== "object") return false;
  const r = x as { evidenceClass?: unknown; maturity?: unknown; source?: { kind?: unknown }; providerObservation?: unknown };
  return (
    typeof r.evidenceClass === "string" && (LIVE_EVIDENCE_CLASSES as readonly string[]).includes(r.evidenceClass) &&
    r.maturity === "live" &&
    r.source?.kind === "provider-observation" &&
    r.providerObservation !== undefined && r.providerObservation !== null
  );
}

/** Deep scan for live-only keys anywhere in a value. */
export function liveOnlyKeysIn(x: unknown, path = "$"): string[] {
  if (x === null || typeof x !== "object") return [];
  const found: string[] = [];
  for (const [k, v] of Object.entries(x as Record<string, unknown>)) {
    if ((LIVE_ONLY_KEYS as readonly string[]).includes(k)) found.push(`${path}.${k}`);
    found.push(...liveOnlyKeysIn(v, `${path}.${k}`));
  }
  return found;
}
