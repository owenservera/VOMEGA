// pack.os-taxonomy — manifest.ts
// The plugin manifest and the shipped composition are DERIVED from the
// database: one contract per capability, risk copied from the capability.
// scripts/generate.ts writes them; test/manifest.test.ts fails on drift.
import { CAPABILITIES, TAXONOMY } from "./db.ts";

export const PACK_ID = "pack.os-taxonomy";
export const CATALOG_OPS = ["os.catalog.list", "os.catalog.describe", "os.catalog.plan", "os.catalog.frames", "os.catalog.coverage"];

export function buildManifest(): Record<string, unknown> {
  const catalog = CATALOG_OPS.map((id) => ({ kind: "contract", id, version: "1", risk: "READ", doc: catalogDoc(id) }));
  const caps = CAPABILITIES.map((c) => ({
    kind: "contract", id: c.op.replace(/@1$/, ""), version: "1", risk: c.risk,
    doc: `${c.title} — capability ${c.id} (${c.effect}${c.consent === "confirm" ? ", consent" : ""}). Payload {params?, dryRun?}; params: ${c.params.map((p) => `${p.name}${p.required ? "" : "?"}:${p.type}`).join(", ") || "none"}.`,
  }));
  return {
    manifestVersion: "1",
    id: PACK_ID,
    version: "0.1.0",
    description: `VIVIM OS capability taxonomy ${TAXONOMY.taxonomyVersion} — a platform-neutral, human-friendly library of ${CAPABILITIES.length} everyday operating-system capabilities (power, display, sound, network, devices, files, apps, windows, input, personalization, accessibility, privacy, security, accounts, time, notifications, capture, web, updates, system, maintenance) with per-platform realizations (Windows first). Every capability is its own routed contract so the law gates and consents per capability. Plans are pure and inspectable; execution only when the composition config sets execute:true; non-READ attempts are ledgered in vault ns 'os' before the effect.`,
    entry: "src/index.ts",
    publisher: { keyId: "", signature: "" },
    contributions: { contract: [...catalog, ...caps] },
    dependencies: [],
    capabilities: {
      requested: ["port:vault.append@1"],
      justification: "Attempt/outcome ledger rows for non-READ capability executions persist in the USER'S VAULT (ns 'os') via port:vault.append@1 — written before any OS effect so an interrupted action is reconstructable. Rows carry parameter names and digests, not raw values. Process creation rides @vivim/omega-platform's platformSpawn (the sole OS seam).",
    },
    runtime: { tier: "worker-thread", budget: { cpuMs: 2000, memMB: 128 } },
    contentHash: "",
  };
}

function catalogDoc(id: string): string {
  return {
    "os.catalog.list": "list {domain?, tier?, query?} → {count, domains, capabilities[]} — browse the taxonomy.",
    "os.catalog.describe": "describe {capability} → {capability, realizations[]} for the configured platform; unknown → outcome unknown.",
    "os.catalog.plan": "plan {capability, params?} → {plan} — validated parameters, chosen realization, exact script and argv. Never executes.",
    "os.catalog.frames": "frames {} → {frames[]} — nlcl-compatible language frames for every capability (command-box grounding data).",
    "os.catalog.coverage": "coverage {} → realization fidelity, inventory coverage and evidence counts for the configured platform.",
  }[id]!;
}

export function buildComposition(): Record<string, unknown> {
  const m = buildManifest() as { contributions: { contract: Array<{ id: string; version: string }> } };
  return {
    name: "os",
    entries: [
      {
        id: "vivim.law", source: "../plugins/vivim-law", bootPhase: 0,
        grant: { capabilities: ["host.journal.append", "host.tokens.revoke"], contracts: ["law.check@1", "law.registry@1", "law.consent.grant@1", "law.tokens.revoke@1", "law.amendment@1", "law.describe@1"] },
      },
      {
        id: "vivim.vault", source: "../plugins/vivim-vault", bootPhase: 1,
        grant: { capabilities: [], contracts: ["vault.append@1", "vault.get@1", "vault.getmany@1", "vault.query@1", "vault.search@1", "vault.verify@1", "vault.compact@1", "vault.roundtrip@1"] },
        config: { dataDir: "${VAULT}/vault-data" },
      },
      {
        id: PACK_ID, source: "../packs/os-taxonomy", bootPhase: 1,
        grant: { capabilities: ["port:vault.append@1"], contracts: m.contributions.contract.map((c) => `${c.id}@${c.version}`) },
        config: { platform: "windows", execute: false, allowElevation: false, timeoutMs: 60000, verify: true },
      },
    ],
  };
}
