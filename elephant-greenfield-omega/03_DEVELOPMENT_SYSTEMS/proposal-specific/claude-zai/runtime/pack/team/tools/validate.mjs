// Minimal JSON Schema (draft 2020-12 subset) validator — standard library only, so gates like MANIFEST_FROZEN can be
// checked mechanically on platforms without network installs.
//   node team/tools/validate.mjs <schema.json> <doc.json|doc.jsonl>     # exit 0 iff every document is valid
//
// Supported keywords (everything the team schemas use): type (incl. arrays of types, "integer"), enum, const,
// required, properties, additionalProperties (boolean | schema), items, minItems, maxItems, minLength, maxLength,
// pattern, minimum, maximum, oneOf, anyOf, allOf, $ref to "#/$defs/<name>". `format` and `default` are ignored.
// Anything else is reported as UNSUPPORTED_KEYWORD so a schema can never silently pass because of a gap here.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const IGNORED = new Set(['$schema', '$id', 'title', 'description', 'format', 'default', '$defs', 'examples', '$comment']);
const KNOWN = new Set(['type', 'enum', 'const', 'required', 'properties', 'additionalProperties', 'items', 'minItems', 'maxItems',
  'minLength', 'maxLength', 'pattern', 'minimum', 'maximum', 'oneOf', 'anyOf', 'allOf', '$ref']);

const typeOf = v => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const typeMatches = (v, t) => t === typeOf(v) || (t === 'number' && typeof v === 'number' && Number.isFinite(v));

export function validate(schema, doc, root = schema, path = '$', errors = []) {
  if (schema === true) return errors;
  if (schema === false) { errors.push(`${path}: not allowed`); return errors; }
  for (const k of Object.keys(schema)) if (!IGNORED.has(k) && !KNOWN.has(k)) errors.push(`${path}: UNSUPPORTED_KEYWORD ${k}`);
  if (schema.$ref) {
    const m = /^#\/\$defs\/(.+)$/.exec(schema.$ref);
    if (!m || !root.$defs?.[m[1]]) { errors.push(`${path}: unresolvable $ref ${schema.$ref}`); return errors; }
    validate(root.$defs[m[1]], doc, root, path, errors);
  }
  if (schema.type !== undefined) {
    const types = [].concat(schema.type);
    if (!types.some(t => typeMatches(doc, t))) { errors.push(`${path}: expected ${types.join('|')}, got ${typeOf(doc)}`); return errors; }
  }
  if (schema.enum && !schema.enum.some(e => JSON.stringify(e) === JSON.stringify(doc))) errors.push(`${path}: ${JSON.stringify(doc)} not in enum`);
  if ('const' in schema && JSON.stringify(schema.const) !== JSON.stringify(doc)) errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  if (typeof doc === 'string') {
    const len = [...doc].length;
    if (schema.minLength !== undefined && len < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && len > schema.maxLength) errors.push(`${path}: longer than ${schema.maxLength}`);
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, 'u').test(doc)) errors.push(`${path}: does not match ${schema.pattern}`);
  }
  if (typeof doc === 'number') {
    if (schema.minimum !== undefined && doc < schema.minimum) errors.push(`${path}: < ${schema.minimum}`);
    if (schema.maximum !== undefined && doc > schema.maximum) errors.push(`${path}: > ${schema.maximum}`);
  }
  if (Array.isArray(doc)) {
    if (schema.minItems !== undefined && doc.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.maxItems !== undefined && doc.length > schema.maxItems) errors.push(`${path}: more than ${schema.maxItems} items`);
    if (schema.items !== undefined) doc.forEach((d, i) => validate(schema.items, d, root, `${path}[${i}]`, errors));
  }
  if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
    for (const r of schema.required ?? []) if (!Object.hasOwn(doc, r)) errors.push(`${path}: missing required ${r}`);
    const props = schema.properties ?? {};
    for (const [k, v] of Object.entries(doc)) {
      if (Object.hasOwn(props, k)) validate(props[k], v, root, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property ${k}`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') validate(schema.additionalProperties, v, root, `${path}.${k}`, errors);
    }
  }
  for (const s of schema.allOf ?? []) validate(s, doc, root, path, errors);
  if (schema.anyOf && !schema.anyOf.some(s => validate(s, doc, root, path, []).length === 0)) errors.push(`${path}: matches none of anyOf`);
  if (schema.oneOf) {
    const n = schema.oneOf.filter(s => validate(s, doc, root, path, []).length === 0).length;
    if (n !== 1) errors.push(`${path}: matches ${n} of oneOf (need exactly 1)`);
  }
  return errors;
}

export function validateFile(schemaPath, docPath) {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const text = readFileSync(docPath, 'utf8');
  const docs = docPath.endsWith('.jsonl') ? text.split('\n').filter(Boolean).map(l => JSON.parse(l)) : [JSON.parse(text)];
  const results = docs.map((d, i) => ({ index: i, errors: validate(schema, d) }));
  return { ok: results.every(r => r.errors.length === 0), documents: docs.length, invalid: results.filter(r => r.errors.length) };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const [schemaPath, docPath] = process.argv.slice(2);
  if (!schemaPath || !docPath) { console.error('usage: validate.mjs <schema.json> <doc.json|doc.jsonl>'); process.exit(2); }
  try { const r = validateFile(schemaPath, docPath); console.log(JSON.stringify(r, null, 2)); process.exit(r.ok ? 0 : 1); }
  catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
}
