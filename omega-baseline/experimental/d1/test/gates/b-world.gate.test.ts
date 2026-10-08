// Phase B — minimal semantic World (D1-010..018).
import { describe, expect } from "bun:test";
import { compatibleAccounts, currentCommand, loadNamedWorld, loadWorld, readWorldFile, say, initialState, validation, WorldError } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { PERSONAL, reversedKeys, WORK } from "./_helpers.ts";

const raw = (id: string) => readWorldFile(id) as Record<string, unknown>;

/**
 * D-006 hardening: a World that differs from its fixture ONLY in authority.
 * "allowed" removes the consent stop, so the verdict is decided by structure —
 * freshness (D1-016) or realization/route (D1-017) — and not by needs-consent.
 * Every change beyond this one field would be a second variable.
 */
const allowedAuthority = (id: string, patch: Record<string, unknown> = {}) =>
  loadWorld({ ...(readWorldFile(id) as object), ...patch, authority: { ...((readWorldFile(id) as { authority?: object }).authority ?? {}), "prompt.send@1": "allowed" } });

describe("Phase B — semantic World", () => {
  gate("D1-010", "Provider, Account, Model, Capability and Realization stay distinct records", () => {
    const w = loadNamedWorld("W5");
    const ids = [...w.providers, ...w.accounts, ...w.models].map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of w.accounts) expect(w.providers.some((p) => p.id === a.provider)).toBe(true);
    for (const m of w.models) expect(w.accounts.some((a) => a.id === m.id)).toBe(false);
    expect(w.realizations.every((r) => !w.capabilities.includes(r.id))).toBe(true);
    expect(() => loadWorld({ ...raw("W1"), models: [{ id: "account:claude-work", provider: "provider:claude", label: "x", names: [] }] })).toThrow(WorldError);
  });

  gate("D1-011", "same fixture bytes give the same World digest; key order is irrelevant", () => {
    const a = loadWorld(raw("W2"));
    const b = loadWorld(reversedKeys(raw("W2")));
    expect(a.digest).toBe(b.digest);
    expect(a.digest).not.toBe(loadNamedWorld("W1").digest);
  });

  gate("D1-012", "loader rejects a World without explicit synthetic provenance", () => {
    const { provenance: _p, ...rest } = raw("W1");
    expect(() => loadWorld(rest)).toThrow(/PROVENANCE_MISSING/);
    expect(() => loadWorld({ ...raw("W1"), provenance: { class: "observed", label: "live capture", author: "x" } })).toThrow(/PROVENANCE_NOT_SYNTHETIC/);
    expect(() => loadWorld({ ...raw("W1"), provenance: { class: "synthetic-fixture", label: "accounts", author: "x" } })).toThrow(/PROVENANCE_LABEL/);
  });

  gate("D1-013", "W0 loads deterministically with no Accounts", () => {
    const w = loadNamedWorld("W0");
    expect(w.accounts).toEqual([]);
    expect(compatibleAccounts(w, "prompt.send@1")).toEqual([]);
    expect(loadNamedWorld("W0").digest).toBe(w.digest);
  });

  gate("D1-014", "W1 has exactly one compatible Account for prompt.send", () => {
    expect(compatibleAccounts(loadNamedWorld("W1"), "prompt.send@1").map((a) => a.id)).toEqual([WORK]);
  });

  gate("D1-015", "W2 has two compatible Claude Accounts and no default rule", () => {
    const w = loadNamedWorld("W2");
    expect(compatibleAccounts(w, "prompt.send@1").map((a) => a.id).sort()).toEqual([PERSONAL, WORK].sort());
    expect(w.defaults["prompt.send@1"]).toBeUndefined();
  });

  gate("D1-016", "W3 stale Account is not reported as available", () => {
    const w = loadNamedWorld("W3");
    expect(w.accounts[0]!.freshness).toBe("stale");
    expect(compatibleAccounts(w, "prompt.send@1")).toEqual([]);
  });

  gate("D1-016", "W3 stale Account can never yield a READY command", () => {
    const s = say(initialState(loadNamedWorld("W3")), "send 'review this' to work claude");
    expect(validation(s).state).not.toBe("ready");
  });

  // --- D-006 strengthening (non-vacuous): consent must not be what blocks a stale target.
  gate("D1-016", "W3 stale Account is refused for freshness even when authority allows it", () => {
    const s = say(initialState(allowedAuthority("W3")), "send 'review this' to work claude");
    const v = validation(s);
    expect(v.state).not.toBe("ready");
    // The blocker is freshness, named on the record — not prose, not an authority state.
    expect(v.missing).toContain("account");
    expect(v.reasons.join(" ")).toMatch(/stale/);
    expect(v.state).not.toBe("needs-consent");
  });

  gate("D1-016", "W3 with a fresh Account and authority allowed is the one-factor positive control", () => {
    const w = loadWorld({ ...(readWorldFile("W3") as object), accounts: [{ ...(readWorldFile("W3") as { accounts: object[] }).accounts[0], freshness: "fresh" }] as never, authority: { "prompt.send@1": "allowed" } });
    const s = say(initialState(w), "send 'review this' to work claude");
    expect(validation(s).state).toBe("ready");
  });

  gate("D1-017", "W4 mailbox Account has no prompt.send realization", () => {
    const w = loadNamedWorld("W4");
    expect(compatibleAccounts(w, "prompt.send@1").map((a) => a.id)).toEqual([WORK]);
  });

  gate("D1-017", "W4 unknown and incompatible targets cannot compile READY", () => {
    for (const text of ["send 'x' to Gemini", "send 'x' to mailbox home"]) {
      const s = say(initialState(loadNamedWorld("W4")), text);
      expect(validation(s).state).not.toBe("ready");
    }
  });

  // --- D-006 strengthening (non-vacuous): an explicit unknown target must never retarget.
  gate("D1-017", "an explicit unknown target never resolves to another Account, even with authority allowed", () => {
    // "Never" must hold across the class, not two exact strings: quoted and unquoted
    // payloads, sentence terminators, a trailing clause, and a quote after the route.
    for (const text of [
      "send 'x' to Gemini", "send hello to Gemini", "send hello to Gemini!", "send hello to Gemini?",
      "send hello to Gemini - thanks", "send hello to Gemini 'x'", "send hello to the team!",
    ]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      const cmd = currentCommand(s)!;
      expect(validation(s).state).not.toBe("ready");
      // The named target survives as an unresolved record; it is not silently dropped.
      const u = cmd.unresolved.find((x) => x.field === "account");
      expect(u).toBeDefined();
      expect(u!.reason).toBe("unknown");
      expect(u!.options).not.toContain(WORK);
      expect(cmd.account).not.toBe(WORK);
      expect(cmd.provider).not.toBe("provider:gemini");
    }
  });

  gate("D1-017", "an Account no realization serves is unavailable even when authority allows it", () => {
    const s = say(initialState(allowedAuthority("W4")), "send 'x' to mailbox home");
    const v = validation(s);
    expect(v.state).toBe("unavailable");
    expect(v.reasons.join(" ")).toMatch(/realization|provider:mailbox/);
    expect(v.state).not.toBe("needs-consent");
  });

  gate("D1-017", "W4 'work claude' with authority allowed is the one-factor positive control", () => {
    const s = say(initialState(allowedAuthority("W4")), "send 'x' to work claude");
    expect(validation(s).state).toBe("ready");
  });

  // D-20261008-013: a held recipient named beside an unheld one must not absorb the
  // command — the unheld target survives and blocks, whichever order they come in.
  gate("D1-017", "an unheld recipient named beside a held one is never dropped", () => {
    for (const text of [
      "send hello to Gemini via work claude", "send 'x' to Gemini via work claude",
      "send hello to work claude and to Gemini", "send hello to Gemini, then to work claude",
    ]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      const cmd = currentCommand(s)!;
      expect(validation(s).state).not.toBe("ready");
      expect(cmd.account).not.toBe(WORK);
      const u = cmd.unresolved.find((x) => x.field === "account");
      expect(u).toBeDefined();
      expect(u!.reason).toBe("unknown");
    }
    // Control: a non-recipient clause beside a held recipient is not a second target.
    const ok = say(initialState(allowedAuthority("W4")), "send note on Monday to work claude");
    expect(validation(ok).state).toBe("ready");
    expect(currentCommand(ok)!.account).toBe(WORK);
  });

  // D-20261008-015: one preposition can introduce several recipients ("to A and B");
  // an unheld one among them survives and blocks, in either position.
  gate("D1-017", "an unheld recipient sharing a preposition with a held one is never dropped", () => {
    for (const text of [
      "send hello to Gemini and work claude", "send hello to work claude and Gemini",
      "send hello to Gemini or work claude", "send 'x' to work claude and Gemini",
    ]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      const cmd = currentCommand(s)!;
      expect(validation(s).state).not.toBe("ready");
      expect(cmd.account).not.toBe(WORK);
      const u = cmd.unresolved.find((x) => x.field === "account");
      expect(u).toBeDefined();
      expect(u!.reason).toBe("unknown");
    }
    // Control: "and" inside the payload, before the route, is not a recipient.
    const ok = say(initialState(allowedAuthority("W4")), "send hello and goodbye to work claude");
    expect(validation(ok).state).toBe("ready");
    expect(currentCommand(ok)!.account).toBe(WORK);
  });

  // D-20261008-016 (1): a name that only partly matches a Provider ("personal claude"
  // where no Personal Account exists) is not a recipient the World holds.
  gate("D1-017", "a recipient that only partly matches a Provider is not held", () => {
    for (const text of ["send hello to work claude and personal claude", "send hello to personal claude and work claude"]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      expect(validation(s).state).not.toBe("ready");
      expect(currentCommand(s)!.account).not.toBe(WORK);
    }
    // Control: in W2 both Accounts exist, so naming both is a choice, never a silent pick.
    const both = say(initialState(allowedAuthority("W2")), "send hello to work claude and personal claude");
    expect(validation(both).state).not.toBe("ready");
  });

  // D-20261008-016 (2): a bare name joined by a comma or semicolon is still a recipient.
  gate("D1-017", "an unheld recipient joined by punctuation is never dropped", () => {
    for (const text of ["send hello to work claude, Gemini", "send hello to work claude; Gemini", "send 'x' to work claude, Gemini"]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      const cmd = currentCommand(s)!;
      expect(validation(s).state).not.toBe("ready");
      expect(cmd.account).not.toBe(WORK);
      expect(cmd.unresolved.find((x) => x.field === "account")?.reason).toBe("unknown");
    }
  });

  // D-20261008-016 (3): a clause after the route is payload, not a recipient — pinned
  // both ways: it must not block a held route, and it must not hide an unheld one.
  gate("D1-017", "a clause after a held recipient is not a second recipient", () => {
    for (const text of ["send hello to work claude and say thanks", "send hello to work claude, thanks", "send hello to work claude, please"]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      expect(validation(s).state).toBe("ready");
      expect(currentCommand(s)!.account).toBe(WORK);
    }
    const unheld = say(initialState(allowedAuthority("W4")), "send hello to work claude and Gemini");
    expect(validation(unheld).state).not.toBe("ready");
  });

  // dev-trv-d016 reject: a send verb after a held recipient opens a second send, so the
  // name it governs is a recipient and an unheld one must still block.
  gate("D1-017", "a send verb after a held recipient does not hide an unheld one", () => {
    for (const text of ["send hello to work claude and tell Gemini", "send hello to work claude, then ask Gemini", "send hello to work claude and send Gemini"]) {
      const s = say(initialState(allowedAuthority("W4")), text);
      expect(validation(s).state).not.toBe("ready");
      expect(currentCommand(s)!.account).not.toBe(WORK);
    }
  });

  gate("D1-018", "W5 keeps Provider, Account and Model as separate route records", () => {
    const w = loadNamedWorld("W5");
    expect(w.providers.length).toBe(2);
    expect(w.models.every((m) => m.provider === "provider:claude")).toBe(true);
    expect(w.accounts.some((a) => a.names.includes("opus"))).toBe(false);
  });
});
