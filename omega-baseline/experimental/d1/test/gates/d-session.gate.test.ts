// Phase D — realtime session semantics (D1-030..034).
// The reducer-only gates use synthetic interpretation results on purpose: they
// prove revision safety without depending on the interpreter.
import { describe, expect } from "bun:test";
import { commandDigest, currentCommand, dispatch } from "../../src/index.ts";
import { gate } from "./_gate.ts";
import { ambiguous, deliver, says, start, synthetic, WORK } from "./_helpers.ts";

const draft = { capability: "prompt.send@1", provider: "provider:claude", account: null, model: null, params: { prompt: "x" }, alternatives: {}, contextRefs: [] };

describe("Phase D — realtime session", () => {
  gate("D1-030", "every input edit gets a monotonic revision identity", () => {
    let s = start("W2");
    for (const t of ["s", "se", "sen", "send"]) s = dispatch(s, { type: "input", text: t });
    expect(s.revisions.map((r) => r.n)).toEqual([1, 2, 3, 4]);
    expect(s.active).toBe(4);
    expect(s.revisions[3]!.text).toBe("send");
  });

  gate("D1-031", "results are bound to their revision and World basis", () => {
    let s = dispatch(start("W2"), { type: "input", text: "send 'x'" });
    const wrongWorld = { ...synthetic(s, "command", { draft }), worldDigest: "sha256:other" };
    s = deliver(s, wrongWorld);
    expect(s.interpretation).toBeNull();
    expect(s.rejected.at(-1)!.reason).toMatch(/WORLD_CHANGED/);
    s = deliver(s, synthetic(s, "command", { draft }));
    expect(s.interpretation!.revision).toBe(1);
    expect(s.interpretation!.worldDigest).toBe(s.world.digest);
  });

  gate("D1-032", "a late result for revision N cannot overwrite active N+1", () => {
    let s = dispatch(start("W2"), { type: "input", text: "send 'a' to work claude" });
    const late = synthetic(s, "command", { draft: { ...draft, params: { prompt: "a" } } });
    s = dispatch(s, { type: "input", text: "send 'b' to claude personal" });
    s = deliver(s, synthetic(s, "command", { draft: { ...draft, params: { prompt: "b" } } }));
    s = deliver(s, late);
    expect(s.interpretation!.revision).toBe(2);
    expect(s.draft!.result.draft!.params["prompt"]).toBe("b");
    expect(s.rejected.at(-1)!.reason).toMatch(/STALE_REVISION/);
  });

  gate("D1-033", "an Account choice is an explicit semantic edit bound to a revision", () => {
    let s = dispatch(start("W2"), { type: "input", text: "send 'x' to claude" });
    s = deliver(s, synthetic(s, "command", { draft }));
    s = dispatch(s, { type: "edit", revision: s.active, edit: { kind: "select", field: "account", value: WORK, via: "clicked" } });
    expect(s.edits).toEqual([{ revision: 1, edit: { kind: "select", field: "account", value: WORK, via: "clicked" } }]);
    const stale = dispatch(s, { type: "edit", revision: 0, edit: { kind: "select", field: "account", value: WORK, via: "clicked" } });
    expect(stale.rejected.at(-1)!.reason).toMatch(/STALE_REVISION/);
  });

  gate("D1-033", "typed correction produces the same kind of semantic edit", () => {
    const s = says(ambiguous(), "use Work");
    expect(s.edits.at(-1)!.edit).toMatchObject({ kind: "select", field: "account", value: WORK, via: "typed" });
  });

  gate("D1-034", "later draft editing cannot retarget a committed command", () => {
    let s = says(ambiguous(), "use Work");
    const cmd = currentCommand(s)!;
    s = dispatch(s, { type: "consent", decision: "grant", commandDigest: commandDigest(cmd) });
    s = dispatch(s, { type: "commit" });
    expect(s.committed).not.toBeNull();
    const committed = structuredClone(s.committed);
    s = says(s, "use Personal");
    expect(s.committed).toEqual(committed);
    expect(s.committed!.command.account).toBe(WORK);
  });
});

