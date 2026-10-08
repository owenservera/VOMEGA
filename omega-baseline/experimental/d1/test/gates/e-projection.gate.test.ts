// Phase E — projection and product twin (D1-040..048).
import { describe, expect } from "bun:test";
import { commandDigest, currentCommand, dispatch, project, renderHtml } from "../../src/index.ts";
import type { D1State } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { ambiguous, PERSONAL, says, start, WORK } from "./_helpers.ts";

function grant(s: D1State): D1State {
  return dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(currentCommand(s)!) });
}
function clickWork(s: D1State): D1State {
  const opt = project(s).unresolved.find((u) => u.field === "account")!.options.find((o) => o.id === WORK)!;
  return dispatch(s, opt.action);
}

describe("Phase E — projection and twin", () => {
  gate("D1-040", "projection exposes interpretation, route, validation, unresolved, consequence, help and actions", () => {
    const p = project(ambiguous());
    for (const k of ["revision", "worldDigest", "input", "lifecycle", "reading", "route", "unresolved", "consequence", "help", "actions", "commandDigest", "evidenceClass", "treatment", "presentation"]) {
      expect(Object.prototype.hasOwnProperty.call(p, k)).toBe(true);
    }
    expect(p.evidenceClass).toBe("SIMULATED");
    for (const k of ["capability", "provider", "account", "model", "realization"] as const) expect(p.route[k]).toBeDefined();
  });

  gate("D1-041", "projection is pure: same state gives the same projection", () => {
    const s = ambiguous();
    expect(project(s)).toEqual(project(s));
    expect(project(s)).toEqual(project(structuredClone(s)));
  });

  gate("D1-041", "visual treatment cannot change command meaning (projection purity)", () => {
    const s = says(ambiguous(), "use Work");
    const a = project(s, { treatment: "compact" }), b = project(s, { treatment: "detailed" });
    const { presentation: _pa, treatment: _ta, ...sa } = a;
    const { presentation: _pb, treatment: _tb, ...sb } = b;
    expect(sa).toEqual(sb);
  });

  gate("D1-042", "twin renders the text input and current reading", () => {
    const s = ambiguous();
    const html = renderHtml(project(s));
    expect(html).toMatch(/<input|<textarea/i);
    expect(html).toContain(project(s).reading ?? "\u0000");
  });

  gate("D1-043", "twin renders Provider, Account and Model as separately labelled route parts", () => {
    const p = project(says(ambiguous(), "use Work"));
    const html = renderHtml(p);
    for (const label of ["Provider", "Account", "Model"]) expect(html).toContain(label);
    expect(html).toContain("Claude · Work");
    // Each value is rendered in its own slot: swapping Provider and Account must be visible.
    const slot = (name: string) => html.match(new RegExp(`data-slot="${name}"[^]*?</div>`))?.[0] ?? "";
    expect(slot("account")).toContain(p.route.account.label!);
    expect(slot("provider")).toContain(p.route.provider.label!);
    expect(slot("provider")).not.toContain(p.route.account.label!);
  });

  gate("D1-044", "unresolved Account chooser shows both Accounts with none selected", () => {
    const p = project(ambiguous());
    const u = p.unresolved.find((x) => x.field === "account")!;
    expect(u.options.map((o) => o.id).sort()).toEqual([PERSONAL, WORK].sort());
    expect(p.route.account.state).toBe("unresolved");
    expect(p.route.account.id).toBeNull();
    const html = renderHtml(p);
    expect(html).toContain("Claude · Work");
    expect(html).toContain("Claude · Personal");
    expect(html).not.toMatch(/(selected|checked|aria-pressed="true")/);
  });

  gate("D1-045", "chooser options carry semantic edit actions only", () => {
    const u = project(ambiguous()).unresolved.find((x) => x.field === "account")!;
    for (const o of u.options) {
      expect(o.action.type).toBe("edit");
      if (o.action.type === "edit") expect(o.action.edit).toMatchObject({ kind: "select", field: "account", value: o.id, via: "clicked" });
    }
    expect(currentCommand(clickWork(ambiguous()))!.account).toBe(WORK);
  });

  gate("D1-046", "typed and clicked Work produce the same canonical command digest", () => {
    const typed = currentCommand(says(ambiguous(), "use Work"))!;
    const clicked = currentCommand(clickWork(ambiguous()))!;
    expect(commandDigest(typed)).toBe(commandDigest(clicked));
  });

  gate("D1-047", "external-transfer consequence is visible before execution", () => {
    const p = project(says(ambiguous(), "use Work"));
    expect(p.consequence).toMatchObject({ class: "external-transfer", crossesLocalBoundary: true });
    expect(p.consequence!.carries).toContain("params.prompt");
    expect(renderHtml(p)).toMatch(/leave|crosses|sent to/i);
    // The preview must tell the two outcomes apart: a local-only consequence may not
    // read as a transfer, so an understated or overstated boundary is caught.
    const local = renderHtml({ ...p, consequence: { ...p.consequence!, class: "local-only", crossesLocalBoundary: false, to: null } });
    expect(local).not.toMatch(/leave|crosses|sent to/i);
  });

  gate("D1-048", "lifecycle moves needs-choice → needs-consent → ready → completed-simulated", () => {
    let s = ambiguous();
    expect(project(s).lifecycle).toBe("needs-choice");
    s = says(s, "use Work");
    expect(project(s).lifecycle).toBe("needs-consent");
    s = grant(s);
    expect(project(s).lifecycle).toBe("ready");
    s = dispatch(dispatch(s, { type: "commit" }), { type: "execute" });
    expect(project(s).lifecycle).toBe("completed-simulated");
    expect(renderHtml(project(s))).toContain("SIMULATED");
  });

  gate("D1-048", "failure lifecycle renders failed-simulated", () => {
    let s = says(start("W1", { simulation: { "prompt.send@1": "fail" } }), "send 'x' to work claude");
    s = grant(s);
    s = dispatch(dispatch(s, { type: "commit" }), { type: "execute" });
    expect(project(s).lifecycle).toBe("failed-simulated");
  });
});
