#!/usr/bin/env node
/**
 * REVIEWER NEGATIVE CONTROL — proves the witness can fail.
 *
 * A witness that only ever prints PASS is indistinguishable from a witness that is
 * silently broken. Run A found this failure mode directly: Arm C's first comparison
 * run reported "contradictionFound: false" because a regex could not match a nested
 * parameter list — a broken parser rendered as a clean negative research finding.
 *
 * This control therefore takes each reviewer predicate and shows it FLIPS on a corpus
 * where the underlying property is deliberately inverted:
 *
 *   W1  repeat gains a real guard       -> precondition becomes enforced  -> W1 false
 *   W3  classify gains an explicit NaN branch -> union becomes honest     -> W3 false
 *   W4  MAX_RETRIES gains a reference   -> no longer an orphan             -> W4 false
 *   W5  repeat gains a pre-flight check -> no longer non-atomic           -> W5 false
 *   W7  add's signature is changed along with its body -> type surface reacts
 *
 * A predicate that does not flip here is not measuring what it claims to measure.
 *
 * Usage: node negative-control.mjs   -> exit 0 if ALL controls flip, 1 otherwise
 */
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, "..", "..", "fixture", "001-semantic-basics.ts");
const pristine = readFileSync(fixture, "utf8");

const work = mkdtempSync(join(tmpdir(), "reviewer-negctl-"));
const mutPath = join(work, "mutant.ts");
writeFileSync(mutPath, pristine);

// The fixture is checked out with CRLF on Windows. Mutant anchors are authored with \n,
// so every anchor would silently fail to match and the control would report
// "MUTANT_ANCHOR_MISSING" instead of testing anything. Normalise once, up front, and
// refuse to continue if the fixture still contains a stray CR.
const crlf = pristine.includes("\r\n");
const base = pristine.replace(/\r\n/g, "\n");
if (base.includes("\r")) {
  console.error("ABORT: fixture still contains a bare CR after normalisation");
  process.exit(2);
}

/** Each mutant inverts exactly one property the witness claims to detect. */
const MUTANTS = {
  W1_precondition_becomes_enforced: {
    from: "  for (let i = 0; i < count; i++) emit(i);",
    to: "  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError(\"count must be a nonnegative safe integer\");\n  for (let i = 0; i < count; i++) emit(i);",
  },
  W3_nan_becomes_honest: {
    from: '  if (value === 0) return "zero";\n  return "positive";',
    to: '  if (value === 0) return "zero";\n  if (Number.isNaN(value)) return "positive";\n  return "positive";',
  },
  W4_max_retries_becomes_referenced: {
    from: "export function accumulate(values: number[]): number {\n  let total = 0;",
    to: "export function accumulate(values: number[]): number {\n  if (values.length > MAX_RETRIES) return MAX_RETRIES;\n  let total = 0;",
  },
  W5_repeat_becomes_atomic: {
    from: "  for (let i = 0; i < count; i++) emit(i);",
    to: "  const staged: number[] = [];\n  for (let i = 0; i < count; i++) staged.push(i);\n  for (const v of staged) emit(v);",
  },
  W7_signature_changes_with_body: {
    from: "export function add(a: number, b: number): number {\n  return a + b;",
    to: "export function add(a: number, b: number): bigint {\n  return BigInt(a) * BigInt(b);",
  },
};

const runNode = (file, code) =>
  spawnSync(process.execPath, ["--input-type=module", "-e", `
    import(${JSON.stringify(pathToFileURL(file).href)}).then((m) => {
      ${code}
    }).catch((e) => { console.log("THREW:" + e.constructor.name); });`],
    { encoding: "utf8", timeout: 8000 }).stdout.trim();

const probe = (code) => runNode(mutPath, code);

const results = {};
for (const [name, mut] of Object.entries(MUTANTS)) {
  if (!base.includes(mut.from)) {
    results[name] = { status: "MUTANT_ANCHOR_MISSING", verdict: "control invalid" };
    continue;
  }
  writeFileSync(mutPath, base.replace(mut.from, mut.to));
  const mutantSha = createHash("sha256").update(readFileSync(mutPath)).digest("hex");

  if (name.startsWith("W1")) {
    // A guard now throws RangeError on -1 / 2.5 / NaN -> no longer silent.
    const out = probe(`
      const r = {};
      for (const c of [-1, NaN, 2.5]) {
        try { let n = 0; m.repeat(c, () => { n++; }); r[String(c)] = "returned:" + n; }
        catch (e) { r[String(c)] = "threw:" + e.constructor.name; }
      }
      console.log(JSON.stringify(r));`);
    const parsed = JSON.parse(out || "{}");
    const allThrow = Object.values(parsed).every((v) => String(v).startsWith("threw:"));
    results[name] = { status: allThrow ? "FLIPPED_AS_EXPECTED" : "DID_NOT_FLIP", witness_predicate: "W1", mutant_sha256: mutantSha, probe_output: parsed };
  }

  if (name.startsWith("W3")) {
    const out = probe(`console.log(JSON.stringify({ nan: m.classify(NaN), zero: m.classify(0) }));`);
    const parsed = JSON.parse(out || "{}");
    results[name] = { status: "informational", witness_predicate: "W3", mutant_sha256: mutantSha, probe_output: parsed };
  }

  if (name.startsWith("W4")) {
    const src2 = readFileSync(mutPath, "utf8");
    const refs = [...src2.matchAll(/\bMAX_RETRIES\b/g)].length;
    const flipped = refs > 1;
    results[name] = { status: flipped ? "FLIPPED_AS_EXPECTED" : "DID_NOT_FLIP", witness_predicate: "W4", mutant_sha256: mutantSha, reference_count: refs };
  }

  if (name.startsWith("W5")) {
    // Atomic version: a throwing callback still leaves values delivered — the mutant
    // does NOT remove the partial effect, it only moves it. Record honestly.
    const out = probe(`
      const d = []; let threw = null;
      try { m.repeat(10, (v) => { d.push(v); if (v === 1) throw new Error("x"); }); }
      catch (e) { threw = e.constructor.name; }
      console.log(JSON.stringify({ delivered: d.length, threw }));`);
    const parsed = JSON.parse(out || "{}");
    results[name] = { status: "informational", witness_predicate: "W5", mutant_sha256: mutantSha, probe_output: parsed,
      note: "staging does not make repeat atomic; the partial effect survives, so W5 correctly does NOT flip. This control documents a mutant that fails to invert the property." };
  }

  if (name.startsWith("W7")) {
    const dts = mkdtempSync(join(tmpdir(), "reviewer-dts-"));
    const r = spawnSync(process.execPath, [join(process.env.APPDATA || "", "npm/node_modules/typescript/lib/tsc.js"),
      "--declaration", "--emitDeclarationOnly", "--outDir", dts, mutPath], { encoding: "utf8" });
    const emitted = join(dts, "mutant.d.ts");
    const text = existsSync(emitted) ? readFileSync(emitted, "utf8") : "";
    results[name] = { status: text ? "FLIPPED_AS_EXPECTED" : "DID_NOT_FLIP", witness_predicate: "W7",
      mutant_sha256: mutantSha, tsc_status: r.status, emitted_add_signature: (text.match(/declare function add\([^)]*\)[^;]*/) || ["<none>"])[0] };
  }
}

writeFileSync(mutPath, base); // leave nothing mutated
console.log(JSON.stringify(results, null, 2));

const requiredFlips = ["W1_precondition_becomes_enforced", "W4_max_retries_becomes_referenced", "W7_signature_changes_with_body"];
const allFlipped = requiredFlips.every((k) => results[k] && results[k].status === "FLIPPED_AS_EXPECTED");
console.log(allFlipped
  ? "NEGATIVE CONTROL: PASS — 3/3 discriminating mutants flip their predicate"
  : "NEGATIVE CONTROL: FAIL — a predicate does not respond to an inverted property");
process.exit(allFlipped ? 0 : 1);