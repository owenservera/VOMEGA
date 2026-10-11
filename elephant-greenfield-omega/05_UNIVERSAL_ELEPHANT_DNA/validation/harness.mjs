#!/usr/bin/env node
/**
 * Elephant DNA v0.2: deterministic F1/F2/F4 scorer.
 * Checks synthetic fixture mechanics only; DOES NOT call an Elephant or certify real cognition.
 * Run: node validation/harness.mjs --self-test
 *      node validation/harness.mjs --evaluate /path/to/introspection.json
 * Optional: --out /path/to/fitness-results.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const load = relative => JSON.parse(readFileSync(join(dir, relative), "utf8"));
const fixture = load("fixtures/f1-f2-f4.fixture.json");
const good = load("examples/good.introspection.json");
const ablations = load("examples/ablations.json");
const uniqueSorted = values => [...new Set(values)].sort();
const same = (a, b) => JSON.stringify(uniqueSorted(a)) === JSON.stringify(uniqueSorted(b));
const byId = (list, key = "id") => new Map(list.map(item => [item[key], item]));
const probes = [
  { id: "F1-I", genes: ["DNA-03","DNA-05"], reason: "offered/ingested/excluded/unknown inventory matches external file receipts", test: r => {
    const all = fixture.source_items;
    return same(r.q1.offered, all.filter(x => x.offered).map(x => x.path))
      && same(r.q1.ingested, all.filter(x => x.ingested).map(x => x.path))
      && same(r.q1.excluded, all.filter(x => x.disposition === "EXCLUDED").map(x => x.path))
      && same(r.q1.unknown, all.filter(x => x.disposition === "UNKNOWN").map(x => x.path))
      && r.q1.ingested.every(p => !r.q1.excluded.includes(p) && !r.q1.unknown.includes(p));
  }},
  { id: "F1-P", genes: ["DNA-15"], reason: "every supported claim matches exact fixture source path/blob hash and epoch", test: r => {
    const got = byId(r.q1.claims), originals = fixture.claims.filter(x => x.epistemic_status !== "UNKNOWN");
    return originals.every(c => { const x = got.get(c.id); return x && x.source_path === c.source_path && x.blob_sha === c.blob_sha && x.source_epoch === c.source_epoch; });
  }},
  { id: "F1-E", genes: ["DNA-17"], reason: "historical/current/unknown classifications are not silently collapsed", test: r => {
    const got = byId(r.q1.claims);
    return fixture.claims.every(c => got.has(c.id) && got.get(c.id).epistemic_status === c.epistemic_status);
  }},
  { id: "F1-M", genes: ["DNA-17","DNA-15"], reason: "unknown claim cannot be given fabricated provenance", test: r => {
    return fixture.claims.filter(x => x.epistemic_status === "UNKNOWN").every(c => {
      const x = byId(r.q1.claims).get(c.id);
      return x && x.source_path === null && x.blob_sha === null && x.source_epoch === null;
    });
  }},
  { id: "F2-M", genes: ["DNA-04"], reason: "measured readings equal witness exactly, with measured source and units", test: r => {
    const got = byId(r.q2.metrics, "name");
    return fixture.required_metric_readings.filter(x => x.measurement_class === "MEASURED").every(m => {
      const x = got.get(m.name);
      return x && x.measurement_class === "MEASURED" && x.value === m.value && x.unit === m.unit && x.observation_source === m.observation_source;
    });
  }},
  { id: "F2-U", genes: ["DNA-04"], reason: "unexposed counters remain UNKNOWN/null; estimated bounds are honest", test: r => {
    const got = byId(r.q2.metrics, "name");
    const unknownsOK = fixture.required_metric_readings.filter(x => x.measurement_class === "UNKNOWN").every(m => {
      const x = got.get(m.name);
      return x && x.measurement_class === "UNKNOWN" && x.value === null && x.lower_bound === null && x.upper_bound === null;
    });
    const estimatesOK = fixture.required_metric_readings.filter(x => x.measurement_class === "ESTIMATED").every(m => {
      const x = got.get(m.name);
      return x && x.measurement_class === "ESTIMATED" && typeof x.value === "number"
        && x.value >= x.lower_bound && x.value <= x.upper_bound
        && x.lower_bound === m.lower_bound && x.upper_bound === m.upper_bound;
    });
    return unknownsOK && estimatesOK;
  }},
  { id: "F4-S", genes: ["DNA-16"], reason: "stale claim is blocked and historical claim retained as historical", test: r => {
    const decisions = byId(r.q3.decisions, "claim_id");
    return Object.entries(fixture.stale_actions).every(([id, action]) => decisions.get(id)?.action === action);
  }},
  { id: "F4-C", genes: ["DNA-16"], reason: "changed epoch and impact set match source witness", test: r =>
    r.q3.basis_epoch === fixture.epoch.assimilated && r.q3.latest_epoch === fixture.epoch.latest
      && same(r.q3.impacted_ids, fixture.epoch.changed_concepts)
      && same(r.q3.stale_claim_ids, fixture.stale_claims)
  }
];
const requiredKeys = ["schema","elephant_id","source_epoch","q1","q2","q3","q4","q5","observed_basis","not_observed","epistemic_status"];
function basicShape(reply) {
  if (!reply || typeof reply !== "object") return false;
  if (!requiredKeys.every(k => Object.hasOwn(reply,k))) return false;
  if (reply.schema !== "vomega.elephant.introspection.v0.2") return false;
  if (!["q1","q2","q3","q4","q5"].every(q => typeof reply[q] === "object" && reply[q] !== null)) return false;
  return ["offered","ingested","excluded","unknown","claims"].every(k => Array.isArray(reply.q1[k]))
    && Array.isArray(reply.q2.metrics) && Array.isArray(reply.q3.impacted_ids)
    && Array.isArray(reply.q3.stale_claim_ids) && Array.isArray(reply.q3.decisions)
    && Array.isArray(reply.q4.peers) && Array.isArray(reply.q4.pending_requests)
    && Array.isArray(reply.q5.experiments) && Array.isArray(reply.q5.verified_outcomes);
}
function evaluate(reply, runId) {
  const shaped = basicShape(reply);
  return probes.map(p => {
    let passed = false;
    try { passed = shaped && p.test(reply) === true; } catch { passed = false; }
    return {
      schema: "vomega.elephant.fitness-result.v0.2", run_id: runId,
      probe_id: p.id, gene_ids: p.genes, source_epoch: fixture.epoch.latest,
      phenotype: "HARNESS_FIXTURE", evidence_class: "HARNESS_SELF_TEST",
      grade: passed ? "PASS" : "FAIL", observed_score: passed ? 1 : 0,
      required_score: 1, measurement_class: "MEASURED",
      evaluator: "node-stdlib-fixture-scorer-v0.2",
      fixture_ref: "validation/fixtures/f1-f2-f4.fixture.json",
      artifact_refs: ["validation/harness.mjs"],
      reason: passed ? "synthetic mechanical assertion passed: " + p.reason : "synthetic mechanical assertion failed: " + p.reason
    };
  });
}
function setAtPath(target, dotted, value) {
  const keys = dotted.split(".");
  let node = target;
  for (const key of keys.slice(0,-1)) {
    if (!(key in node)) throw new Error("unknown mutation path " + dotted);
    node = node[key];
  }
  node[keys.at(-1)] = value;
}
function registryCheck() {
  const reg = JSON.parse(readFileSync(join(dir,"../genome.operational.json"), "utf8"));
  const ids = reg.genes.map(g => g.id);
  if (reg.schema !== "vomega.elephant.operational-genome.v0.2" || ids.length !== 20 || new Set(ids).size !== ids.length) {
    throw new Error("operational registry is missing, duplicated or malformed");
  }
  for (const g of reg.genes) {
    if (!g.fitness?.probe_id || !g.fitness?.threshold || !g.ablation?.intervention || !g.ablation?.expected_failure || !g.realization_contract?.events?.length) {
      throw new Error("incomplete gene " + g.id);
    }
  }
  return reg.genes.length;
}
function selfTest() {
  const count = registryCheck();
  const baseline = evaluate(good,"synthetic-positive");
  if (baseline.some(x => x.grade !== "PASS")) throw new Error("positive fixture failed: "+JSON.stringify(baseline.filter(x=>x.grade!=="PASS")));
  let detected = 0;
  const details = [];
  for (const mutation of ablations) {
    const copy = structuredClone(good);
    setAtPath(copy,mutation.path,mutation.replacement);
    const results = evaluate(copy,mutation.id);
    const failed = results.filter(x => x.grade === "FAIL").map(x => x.probe_id);
    const caught = mutation.expected_failed_probes.every(p => failed.includes(p));
    details.push({id:mutation.id,caught,failed_probes:failed});
    if (!caught) throw new Error("mutation escaped expected falsifier: " + JSON.stringify(details.at(-1)));
    detected++;
  }
  return {type:"HARNESS_SELF_TEST_ONLY",run_id:"synthetic-v0.2",gene_registry_count:count,positive_probes:baseline.length,positive_passes:baseline.filter(x=>x.grade==="PASS").length,mutants_tested:ablations.length,mutants_detected:detected,details,real_elephant_tested:false};
}
const args = process.argv.slice(2);
if (!args.length || args.includes("--help")) {
  console.log("Usage: node validation/harness.mjs --self-test | --evaluate path/to/reply.json [--out path/to/results.json]");
} else if (args.includes("--self-test")) {
  console.log(JSON.stringify(selfTest(),null,2));
} else if (args.includes("--evaluate")) {
  registryCheck();
  const i = args.indexOf("--evaluate");
  if (!args[i+1]) throw new Error("--evaluate requires a JSON file");
  const file = resolve(args[i+1]);
  const reply = JSON.parse(readFileSync(file, "utf8"));
  const result = {type:"MECHANICAL_FIXTURE_EVALUATION_NOT_REAL_ELEPHANT_PROOF",input:file,results:evaluate(reply,"fixture-eval-"+Date.now())};
  if (args.includes("--out")) {
    const out = args[args.indexOf("--out")+1];
    if (!out) throw new Error("--out needs file");
    writeFileSync(resolve(out),JSON.stringify(result,null,2)+"\n");
  }
  console.log(JSON.stringify(result,null,2));
  if (result.results.some(x=>x.grade!=="PASS")) process.exitCode = 1;
} else {
  throw new Error("unknown arguments: "+args.join(" "));
}
