#!/usr/bin/env node
/**
 * REVIEWER W7 PROPER — the strongest claim any arm made, verified properly.
 *
 * Arm A exp2 claimed that mutating add()'s BODY from `a + b` to `a * b` leaves the
 * emitted declaration byte-identical, so "the entire machine-readable surface of this
 * file is unchanged by a change that inverts its arithmetic."
 *
 * That is the load-bearing claim of the whole fixture: the type layer is readable and
 * uninformative about behaviour. The arm established it textually; the reviewer
 * establishes it by actually invoking the TypeScript compiler on both versions and
 * byte-comparing the emitted .d.ts files.
 *
 * A negative control is included: mutate the SIGNATURE as well, and the .d.ts must
 * change. If it did not, the "identical" result would mean the compiler was not
 * emitting anything at all.
 */
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(here, "..", "..", "fixture", "001-semantic-basics.ts");
const tsc = join(process.env.APPDATA || "", "npm", "node_modules", "typescript", "lib", "tsc.js");

const work = mkdtempSync(join(tmpdir(), "reviewer-w7-"));
mkdirSync(work, { recursive: true });

const sha = (b) => createHash("sha256").update(b).digest("hex");
const pristine = readFileSync(fixture, "utf8");
const base = pristine.replace(/\r\n/g, "\n");

const emitDts = (sourceText, name) => {
  const srcPath = join(work, name);
  writeFileSync(srcPath, sourceText);
  const outDir = join(work, "dts-" + name);
  const r = spawnSync(process.execPath, [tsc, "--strict", "--declaration", "--emitDeclarationOnly", "--outDir", outDir, srcPath],
    { encoding: "utf8" });
  const dir = readdirSync(outDir);
  const file = dir.find((f) => f.endsWith(".d.ts"));
  return { text: file ? readFileSync(join(outDir, file), "utf8") : null, status: r.status, stderr: r.stderr || "", name: file };
};

const A = emitDts(base, "pristine.ts");
const B = emitDts(base.replace("return a + b;", "return a * b;"), "bodymut.ts");           // body only
const C = emitDts(base.replace("export function add(a: number, b: number): number {\n  return a + b;",
                               "export function add(a: number, b: number): bigint {\n  return BigInt(a) + BigInt(b);"), "sigmut.ts"); // signature too

const result = {
  schema: "reviewer-w7-declaration-surface/1",
  compiler: spawnSync(process.execPath, [tsc, "--version"], { encoding: "utf8" }).stdout.trim(),
  emitted: { pristine: A.status, body_mutation: B.status, signature_mutation: C.status },
  claims: {
    // The claim under test (Arm A exp2).
    body_mutation_leaves_dts_byte_identical: {
      dts_sha_pristine: A.text ? sha(A.text) : null,
      dts_sha_body_mutated: B.text ? sha(B.text) : null,
      identical: A.text !== null && B.text !== null && sha(A.text) === sha(B.text),
      verdict: A.text && B.text && sha(A.text) === sha(B.text) ? "CONFIRMED" : "REFUTED",
    },
    // Negative control: the compiler must react when the signature really changes,
    // otherwise "identical" would only mean nothing was emitted.
    signature_mutation_changes_dts: {
      dts_sha_signature_mutated: C.text ? sha(C.text) : null,
      changed: A.text !== null && C.text !== null && sha(A.text) !== sha(C.text),
      emitted_add_line: (C.text || "").match(/declare function add\([^)]*\)[^;]*/)?.[0] || "<none>",
      verdict: A.text && C.text && sha(A.text) !== sha(C.text) ? "CONTROL_OK" : "CONTROL_BROKEN",
    },
  },
  emitted_dts_text: A.text,
};
rmSync(work, { recursive: true, force: true });
console.log(JSON.stringify(result, null, 2));

const ok = result.claims.body_mutation_leaves_dts_byte_identical.verdict === "CONFIRMED" &&
           result.claims.signature_mutation_changes_dts.verdict === "CONTROL_OK";
console.log(ok ? "W7 VERIFIED: body-only mutation is invisible to the emitted type surface; signature mutation is not." : "W7 NOT VERIFIED");
process.exit(ok ? 0 : 1);