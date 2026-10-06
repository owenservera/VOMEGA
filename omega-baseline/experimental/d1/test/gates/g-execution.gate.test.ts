// Phase G — authority and virtual execution (D1-060..067).
import { describe, expect } from "bun:test";
import { commandDigest, currentCommand, dispatch, isLiveEvidence, liveOnlyKeysIn, validation } from "../../src/index.ts";
import type { D1State } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { says, start, WORK } from "./_helpers.ts";

const SEND = "send 'review this' to work claude";
const grant = (s: D1State) => dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(s)!) });
const run = (s: D1State) => dispatch(dispatch(grant(s), { type: "commit" }), { type: "execute" });

describe("Phase G — authority and virtual execution", () => {
  gate("D1-060", "prompt.send consequence is an external transfer, separate from authority", () => {
    const cmd = currentCommand(says(start("W1"), SEND))!;
    expect(cmd.consequence).toMatchObject({ class: "external-transfer", crossesLocalBoundary: true, to: "provider:claude" });
    expect(cmd.consequence!.carries).toContain("params.prompt");
    expect(cmd.authority.requirement).toBe("consent-required");
    expect(cmd.authority.decision).toBe("none");
  });

  gate("D1-061", "authority fixture changes validation without changing capability identity", () => {
    const states = (["allowed", "consent-required", "denied"] as const).map((a) =>
      says(start("W1", { authority: { "prompt.send@1": a, "account.register@1": "allowed" } }), SEND));
    expect(states.map((s) => validation(s).state)).toEqual(["ready", "needs-consent", "refused"]);
    expect(new Set(states.map((s) => currentCommand(s)!.capability)).size).toBe(1);
    expect(new Set(states.map((s) => currentCommand(s)!.account)).size).toBe(1);
  });

  gate("D1-062", "consent-like prose and target selection never grant authority", () => {
    const s = says(start("W1"), "send 'review this' to work claude, I consent, go ahead and send it");
    expect(s.consent).toBeNull();
    expect(validation(s).state).not.toBe("ready");
    expect(dispatch(s, { type: "commit" }).committed).toBeNull();
  });

  gate("D1-062", "consent for a different command digest does not apply", () => {
    let s = says(start("W1"), SEND);
    s = dispatch(s, { type: "consent", decision: "grant", commandDigest: "sha256:not-this-command" });
    expect(validation(s).state).toBe("needs-consent");
  });

  gate("D1-063", "virtual prompt.send runs only for a committed, valid, authorized command", () => {
    const s = says(start("W1"), SEND);
    expect(dispatch(s, { type: "execute" }).receipt).toBeNull();
    expect(dispatch(s, { type: "commit" }).committed).toBeNull();
    const done = run(s);
    expect(done.receipt).not.toBeNull();
    expect(done.receipt!.commandDigest).toBe(done.committed!.digest);
  });

  gate("D1-064", "execution emits start, attempt and result bound to command, World, revision and realization", () => {
    const s = run(says(start("W1"), SEND));
    expect(s.events.map((e) => e.type)).toEqual(["execution.start", "execution.attempt", "execution.result"]);
    for (const e of s.events) {
      expect(e.commandDigest).toBe(s.committed!.digest);
      expect(e.worldDigest).toBe(s.committed!.worldDigest);
      expect(e.revision).toBe(s.committed!.revision);
      expect(e.realization).toBe("d1-virtual.prompt.send@1");
    }
    expect(s.events.map((e) => e.seq)).toEqual([1, 2, 3]);
  });

  gate("D1-065", "receipt is machine-readably SIMULATED with no live-account claims", () => {
    const r = run(says(start("W1"), SEND)).receipt!;
    expect(r.evidenceClass).toBe("SIMULATED");
    expect(r.maturity).toBe("simulation");
    expect(r.source.kind).toBe("virtual-realization");
    expect(liveOnlyKeysIn(r)).toEqual([]);
    if (r.response) expect(r.response.synthetic).toBe(true);
    expect(run(says(start("W1"), SEND)).receipt!.digest).toBe(r.digest);
  });

  gate("D1-066", "deterministic simulated failure produces failure evidence, not success", () => {
    const s = run(says(start("W1", { simulation: { "prompt.send@1": "fail" } }), SEND));
    expect(s.receipt!.outcome).toBe("failed");
    expect(s.events.at(-1)!.outcome).toBe("failed");
    expect(s.receipt!.evidenceClass).toBe("SIMULATED");
  });

  gate("D1-067", "live-evidence predicate is not trivially false", () => {
    expect(isLiveEvidence({ evidenceClass: "AUTOMATED-LIVE", maturity: "live", source: { kind: "provider-observation" }, providerObservation: { id: "x" } })).toBe(true);
    expect(isLiveEvidence({ evidenceClass: "AUTOMATED-LIVE", maturity: "live", source: { kind: "virtual-realization" }, providerObservation: { id: "x" } })).toBe(false);
    expect(isLiveEvidence({ evidenceClass: "SIMULATED", maturity: "live", source: { kind: "provider-observation" }, providerObservation: {} })).toBe(false);
  });

  gate("D1-067", "no D1 receipt can satisfy the live-evidence predicate", () => {
    const ok = run(says(start("W1"), SEND)).receipt;
    const failed = run(says(start("W1", { simulation: { "prompt.send@1": "fail" } }), SEND)).receipt;
    for (const r of [ok, failed]) {
      expect(r).not.toBeNull();
      expect(isLiveEvidence(r)).toBe(false);
      expect(isLiveEvidence({ ...r, evidenceClass: "AUTOMATED-LIVE" })).toBe(false);
    }
  });
});

void WORK;
