#!/usr/bin/env bun
// provider-probe.mjs — daily availability probe for the ZCode-wired providers.
// Reads ~/.zcode/v2/provider_config.json for endpoints/keys (keys are never printed;
// only a 12-char prefix is logged). Appends one JSONL record to .local/ops/provider-probe.log.
// Run: bun .project/dev-loop/provider-probe.mjs   (from the VOMEGA repo root)
// Carrier: devops sweep (daily, 24h throttle) — see .project/dev-loop/PROVIDER-AVAILABILITY.md
//          and .project/dev-loop/MODEL-SELECTION.md (selection protocol uses these results).

import { readFileSync, appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const CFG = join(homedir(), ".zcode", "v2", "provider_config.json");
const REPO = process.env.VOMEGA_REPO ?? process.cwd();
const LOG = join(REPO, ".local", "ops", "provider-probe.log");
const B = (s) => s.slice(0, 12) + "…";

const cfg = JSON.parse(readFileSync(CFG, "utf8")).config;
const byId = Object.fromEntries(
  cfg.providerConfigRules.providerRules.map((p) => [p.providerId, p])
);

function probe(name, url, init, model, keyPrefix, timeoutMs = 45000) {
  const t0 = Date.now();
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
    .then(async (r) => {
      const text = await r.text();
      return {
        provider: name, endpoint: url, model, httpStatus: r.status,
        latencyMs: Date.now() - t0, keyPrefix, key: keyPrefix,
        ok: r.status === 200,
        snippet: text.replace(/\s+/g, " ").slice(0, 140),
      };
    })
    .catch((e) => ({
      provider: name, endpoint: url, model, httpStatus: 0,
      latencyMs: Date.now() - t0, keyPrefix, key: keyPrefix, ok: false,
      snippet: String(e?.cause?.message ?? e?.message ?? e).slice(0, 140),
    }));
}

const json = (body, headers = {}, auth) => ({
  method: "POST",
  headers: { "content-type": "application/json", ...headers, ...(auth ? { authorization: `Bearer ${auth}` } : {}) },
  body: JSON.stringify(body),
});

const cc = byId["claude-code-oauth"]?.config?.access?.apiKey ?? "";
const cx = byId["codex-oauth"]?.config?.access?.apiKey ?? "";
const gk = byId["grok-build-oauth"]?.config?.access?.apiKey ?? "";
const owen = byId["new-provider"]?.config?.access?.apiKey ?? "";
const acctKeys = ["opencode-acct-2", "opencode-acct-3", "opencode-acct-4", "opencode-acct-5"]
  .map((id) => [id, byId[id]?.config?.access?.apiKey ?? ""]);
const orKey = byId["openrouter"]?.config?.access?.apiKey ?? "";

// --- per-model family sweep (8317): wired order from the config, served set from the endpoint ---
async function familySweep(providerId, api, modelOf) {
  const entry = byId[providerId];
  const key = entry?.config?.access?.apiKey ?? "";
  const wired = entry?.config?.modelOrder ?? [];
  const t0 = Date.now();
  let servedIds = [];
  try {
    const r = await fetch("http://127.0.0.1:8317/v1/models", {
      headers: { authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000),
    });
    servedIds = (await r.json()).data.map((m) => m.id);
  } catch (e) {
    return { providerId, error: String(e?.message ?? e).slice(0, 140), models: [] };
  }
  const models = [];
  for (const model of wired) {
    const served = servedIds.includes(model);
    if (!served) {
      models.push({ model, served: false, probed: false, httpStatus: 0, latencyMs: 0, ok: false, note: "wired but NOT served by endpoint" });
      continue;
    }
    const r = await probe(providerId, api,
      modelOf(model, key), model, B(key), 45000);
    models.push({ model, served: true, probed: true, httpStatus: r.httpStatus, latencyMs: r.latencyMs, ok: r.ok, note: r.ok ? "" : r.snippet });
  }
  return { providerId, servedCount: servedIds.length, elapsedMs: Date.now() - t0, models };
}

const [claudeSweep, gptSweep, ...providerRoutes] = await Promise.all([
  familySweep("claude-code-oauth", "http://127.0.0.1:8317/v1/messages",
    (model, key) => json({ model, max_tokens: 8, messages: [{ role: "user", content: "Reply with exactly: OK" }] },
      { "x-api-key": key, "anthropic-version": "2023-06-01" })),
  familySweep("codex-oauth", "http://127.0.0.1:8317/v1/responses",
    (model, key) => json({ model, max_output_tokens: 16, input: "Reply with exactly: OK" }, {}, key)),
  // grok route (provider-level; models already known absent — one representative request)
  probe("grok-build-oauth", "http://127.0.0.1:8317/v1/responses",
    json({ model: "grok-build-0.1", max_output_tokens: 16, input: "Reply with exactly: OK" }, {}, gk),
    "grok-build-0.1", B(gk)),
  // opencode 6446 route — owner key ("owen") + 4 accounts
  ...[["new-provider (owen)", owen], ...acctKeys].map(
    ([n, k]) => probe(n, "http://localhost:6446/v1/chat/completions",
      json({ model: "space-bunny-free", max_tokens: 8, messages: [{ role: "user", content: "Reply with exactly: OK" }] }, {}, k),
      "space-bunny-free", B(k))),
  // openrouter: key check (model list) + free-model generation
  fetch("https://openrouter.ai/api/v1/models", { headers: { authorization: `Bearer ${orKey}` }, signal: AbortSignal.timeout(30000) })
    .then(async (r) => ({ provider: "openrouter (models)", endpoint: "https://openrouter.ai/api/v1/models", model: "(list)", httpStatus: r.status, latencyMs: 0, keyPrefix: B(orKey), key: B(orKey), ok: r.status === 200, snippet: r.status === 200 ? "model list ok" : (await r.text()).slice(0, 140) }))
    .catch((e) => ({ provider: "openrouter (models)", endpoint: "list", model: "(list)", httpStatus: 0, latencyMs: 0, keyPrefix: B(orKey), key: B(orKey), ok: false, snippet: String(e?.message ?? e).slice(0, 140) })),
  probe("openrouter (free gen)", "https://openrouter.ai/api/v1/chat/completions",
    json({ model: "openrouter/free", max_tokens: 8, messages: [{ role: "user", content: "Reply with exactly: OK" }] }, {}, orKey),
    "openrouter/free", B(orKey)),
]);

const record = { at: new Date().toISOString(), providerRoutes, familySweeps: { claude: claudeSweep, gpt: gptSweep } };
mkdirSync(dirname(LOG), { recursive: true });
appendFileSync(LOG, JSON.stringify(record) + "\n");

for (const r of providerRoutes) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.provider.padEnd(24)} ${String(r.httpStatus).padEnd(4)} ${String(r.latencyMs).padStart(6)}ms  key=${r.keyPrefix}  ${r.snippet}`);
}
for (const sweep of [claudeSweep, gptSweep]) {
  if (sweep.error) { console.log(`FAIL  ${sweep.providerId} family sweep error: ${sweep.error}`); continue; }
  const ok = sweep.models.filter((m) => m.ok).length;
  console.log(`\n== ${sweep.providerId} family: ${ok}/${sweep.models.length} models PASS (endpoint serves ${sweep.servedCount} models, ${sweep.elapsedMs}ms) ==`);
  for (const m of sweep.models) {
    console.log(`${m.ok ? "PASS" : m.served ? "FAIL" : "----"}  ${m.model.padEnd(32)} ${String(m.httpStatus).padEnd(4)} ${String(m.latencyMs).padStart(6)}ms  ${m.note}`);
  }
}
console.log(`\nlogged: ${LOG}`);
const allOk =
  providerRoutes.every((r) => r.ok) &&
  [claudeSweep, gptSweep].every((s) => !s.error && s.models.every((m) => m.ok));
process.exit(allOk ? 0 : 1);
