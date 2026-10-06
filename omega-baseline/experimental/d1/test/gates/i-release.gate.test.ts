// Phase I — integrated release (D1-080..082). D1-083..089 are artifact-proven (see spec.json).
import { describe, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bundle, commandDigest, currentCommand, dispatch, help, isLiveEvidence, project, replay, startTwinModule, validation } from "./_release.ts";
import { gate } from "./_gate.ts";
import { PROMPT, says, start, WORK } from "./_helpers.ts";

describe("Phase I — integrated release", () => {
  gate("D1-080", "canonical journey: blank World → two registrations → ambiguity → typed choice → consent → SIMULATED receipt → replay", () => {
    let s = says(start("W0"), "add my Claude work account", "add another Claude account and call it Personal", PROMPT);
    expect(validation(s).state).toBe("needs-choice");
    s = says(s, "use Work");
    const work = s.world.accounts.find((a) => a.label.toLowerCase().includes("work"))!;
    expect(currentCommand(s)!.account).toBe(work.id);
    expect(help(s, "why-ready").claims.length).toBeGreaterThan(0);
    s = dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(s)!) });
    s = dispatch(dispatch(s, { type: "commit" }), { type: "execute" });
    expect(s.receipt!.evidenceClass).toBe("SIMULATED");
    expect(isLiveEvidence(s.receipt)).toBe(false);
    expect(project(s).lifecycle).toBe("completed-simulated");
    const b = bundle(s);
    expect(replay(b).evidenceDigest).toBe(b.expected.evidenceDigest);
  });

  gate("D1-081", "stale Account journey refuses honestly; fixture failure fails honestly", () => {
    const stale = says(start("W3"), "send 'review this' to work claude");
    expect(validation(stale).state).not.toBe("ready");
    expect(dispatch(stale, { type: "commit" }).committed).toBeNull();
    let f = says(start("W1", { simulation: { "prompt.send@1": "fail" } }), "send 'review this' to work claude");
    f = dispatch(f, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(f)!) });
    f = dispatch(dispatch(f, { type: "commit" }), { type: "execute" });
    expect(f.receipt!.outcome).toBe("failed");
    expect(project(f).lifecycle).toBe("failed-simulated");
    void WORK;
  });

  gate("D1-082", "one documented command launches the twin and it serves a SIMULATED page", async () => {
    const pkg = JSON.parse(readFileSync(join(import.meta.dir, "../../../../package.json"), "utf8")) as { scripts: Record<string, string> };
    expect(pkg.scripts["d1"]).toContain("experimental/d1/src/launch.ts");
    const twin = (await startTwinModule()).startTwin({ port: 0 });
    try {
      const html = await (await fetch(twin.url)).text();
      expect(html).toContain("SIMULATED");
      expect(html).toMatch(/<input|<textarea/i);
    } finally { twin.stop(); }
  }, 15_000);
});
