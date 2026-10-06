// Shared gate helper for the D1 executable specification.
// See experimental/ratchet/src/gate.ts for ratchet/probe semantics.
import { join } from "node:path";
import { createGate } from "../../../ratchet/src/gate.ts";

export const gate = createGate(join(import.meta.dir, "../../../ratchet/specs/d1/ratchet.lock.json"));
