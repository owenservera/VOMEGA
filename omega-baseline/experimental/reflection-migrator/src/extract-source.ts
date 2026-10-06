// TypeScript source extractors (MP21-P2): what one module's syntax states, with spans.
// Nothing here knows about plugins or manifests — extract.ts joins these per-file results
// to the rest. Anything that is not a literal (or reducible to one by a named rule) is
// returned as `dynamic`, so opacity is always visible.
import ts from "typescript";
import type { Json } from "../../ratchet/src/canonical.ts";
import type { RuleName } from "./facts.ts";
import { scriptKindOf } from "./symbols.ts";

export interface Span { start: number; end: number }
export interface Resolved { value: string; rule?: RuleName }

export interface OpSite extends Span { op: string; rule?: RuleName }
export interface DynamicSite extends Span { what: string }
/** A port-call op that names an imported binding; extract.ts resolves it across files. */
export interface PendingSite extends DynamicSite { specifier: string; imported: string; member?: string }

export interface ImportSite { specifier: string; typeOnly: boolean }

export interface Vocabulary { symbol: string; members: string[] }
export interface Shape { symbol: string; fields: Array<{ name: string; optional: boolean; type: string }> }
export interface Frame extends Span { op: string; value: Json }

export interface SourceFacts {
  sf: ts.SourceFile;
  hasDefinePlugin: boolean;
  registeredOps: OpSite[];
  portCalls: OpSite[];
  dynamic: DynamicSite[];
  pending: PendingSite[];
  /** Top-level `const` bindings whose initializer is a pure literal. */
  consts: Map<string, Json>;
  imports: ImportSite[];
  vocabularies: Vocabulary[];
  shapes: Shape[];
  frames: Frame[];
  stringLiterals: Array<Span & { text: string }>;
}

const isString = (n: ts.Node): n is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral =>
  ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);

function unwrap(e: ts.Expression): ts.Expression {
  while (ts.isAsExpression(e) || ts.isParenthesizedExpression(e) || ts.isSatisfiesExpression(e) || ts.isNonNullExpression(e)) e = e.expression;
  return e;
}

function propName(name: ts.PropertyName | undefined): string | undefined {
  return name && (ts.isIdentifier(name) || isString(name)) ? name.text : undefined;
}

function prop(obj: ts.ObjectLiteralExpression, key: string): ts.Expression | undefined {
  for (const p of obj.properties) if (ts.isPropertyAssignment(p) && propName(p.name) === key) return p.initializer;
  return undefined;
}

/** A literal converted to JSON, or undefined if any part of it is not a literal. */
function literal(e: ts.Expression): Json | undefined {
  e = unwrap(e);
  if (isString(e)) return e.text;
  if (ts.isNumericLiteral(e)) return Number(e.text);
  if (e.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (e.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (e.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(e)) {
    const out: Json[] = [];
    for (const el of e.elements) {
      const v = literal(el);
      if (v === undefined) return undefined;
      out.push(v);
    }
    return out;
  }
  if (ts.isObjectLiteralExpression(e)) {
    const out: { [k: string]: Json } = {};
    for (const p of e.properties) {
      const key = ts.isPropertyAssignment(p) ? propName(p.name) : undefined;
      const v = key !== undefined && ts.isPropertyAssignment(p) ? literal(p.initializer) : undefined;
      if (key === undefined || v === undefined) return undefined;
      out[key] = v;
    }
    return out;
  }
  return undefined;
}

export function extractSource(path: string, text: string): SourceFacts {
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, scriptKindOf(path));
  const out: SourceFacts = {
    sf, hasDefinePlugin: false, registeredOps: [], portCalls: [], dynamic: [], pending: [], consts: new Map(), imports: [],
    vocabularies: [], shapes: [], frames: [], stringLiterals: [],
  };
  const span = (n: ts.Node): Span => ({ start: n.getStart(sf), end: n.end });

  // Top-level `const X = <initializer>` bindings: the only things the same-file-const rule may read.
  const consts = new Map<string, ts.Expression>();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st) || !(st.declarationList.flags & ts.NodeFlags.Const)) continue;
    for (const d of st.declarationList.declarations) {
      if (!ts.isIdentifier(d.name) || !d.initializer) continue;
      consts.set(d.name.text, unwrap(d.initializer));
      const value = literal(d.initializer);
      if (value !== undefined) out.consts.set(d.name.text, value);
    }
  }

  // Named imports: local name → where it comes from. Used only to hand an unresolved op to extract.ts.
  const imported = new Map<string, { specifier: string; imported: string }>();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !isString(st.moduleSpecifier)) continue;
    const bindings = st.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const el of bindings.elements) {
      imported.set(el.name.text, { specifier: st.moduleSpecifier.text, imported: (el.propertyName ?? el.name).text });
    }
  }
  /** Records an unresolved op: pending if it names an import, otherwise dynamic. */
  const unresolved = (site: ts.Node, arg: ts.Expression | undefined, what: string): void => {
    const e = arg && unwrap(arg);
    const root = e && ts.isIdentifier(e) ? e : e && ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) ? e.expression : undefined;
    const from = root && imported.get(root.text);
    if (from && e) out.pending.push({ ...span(site), what, ...from, member: ts.isPropertyAccessExpression(e) ? e.name.text : undefined });
    else out.dynamic.push({ ...span(site), what });
  };

  const resolve = (e: ts.Expression): Resolved | undefined => {
    e = unwrap(e);
    if (isString(e)) return { value: e.text };
    if (ts.isIdentifier(e)) {
      const bound = consts.get(e.text);
      return bound && isString(bound) ? { value: bound.text, rule: "same-file-const" } : undefined;
    }
    if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression)) {
      const bound = consts.get(e.expression.text);
      const member = bound && ts.isObjectLiteralExpression(bound) ? prop(bound, e.name.text) : undefined;
      return member && isString(unwrap(member)) ? { value: (unwrap(member) as ts.StringLiteral).text, rule: "same-file-const" } : undefined;
    }
    return undefined;
  };

  const isPortCall = (n: ts.CallExpression): boolean => {
    const callee = n.expression;
    if (!ts.isPropertyAccessExpression(callee) || callee.name.text !== "call") return false;
    const owner = unwrap(callee.expression);
    return ts.isPropertyAccessExpression(owner) && owner.name.text === "port";
  };

  // Pass 1 — port calls. A call whose op is a parameter of the enclosing named function
  // makes that function a wrapper; its own call sites are read in pass 2.
  const wrappers = new Map<string, number>();
  const enclosingFunction = (n: ts.Node): ts.FunctionLikeDeclaration | undefined => {
    for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p) && "parameters" in p) return p as ts.FunctionLikeDeclaration;
    return undefined;
  };
  const functionName = (f: ts.FunctionLikeDeclaration): string | undefined => {
    if (ts.isFunctionDeclaration(f)) return f.name?.text;
    const holder = f.parent;
    return holder && ts.isVariableDeclaration(holder) && ts.isIdentifier(holder.name) ? holder.name.text : undefined;
  };

  const walk = (n: ts.Node, visit: (n: ts.Node) => void) => {
    visit(n);
    ts.forEachChild(n, (c) => walk(c, visit));
  };

  walk(sf, (n) => {
    if (isString(n)) out.stringLiterals.push({ ...span(n), text: n.text });
    if (!ts.isCallExpression(n) || !isPortCall(n)) return;
    const arg = n.arguments[0];
    const resolved = arg && resolve(arg);
    if (resolved) {
      out.portCalls.push({ ...span(n), op: resolved.value, rule: resolved.rule });
      return;
    }
    const fn = arg && ts.isIdentifier(unwrap(arg)) ? enclosingFunction(n) : undefined;
    const name = fn && functionName(fn);
    const index = fn ? fn.parameters.findIndex((p) => ts.isIdentifier(p.name) && p.name.text === (unwrap(arg!) as ts.Identifier).text) : -1;
    if (name !== undefined && index >= 0) wrappers.set(name, index);
    else unresolved(n, arg, "port call whose op is not a literal");
  });

  // Pass 2 — definePlugin registrations and wrapper call sites.
  walk(sf, (n) => {
    if (!ts.isCallExpression(n) || !ts.isIdentifier(n.expression)) return;
    const callee = n.expression.text;
    const wrapperIndex = wrappers.get(callee);
    if (wrapperIndex !== undefined) {
      const arg = n.arguments[wrapperIndex];
      const resolved = arg && resolve(arg);
      if (resolved) out.portCalls.push({ ...span(n), op: resolved.value, rule: "local-wrapper-forwarding" });
      else unresolved(n, arg, `call to port wrapper ${callee}() whose op is not a literal`);
      return;
    }
    if (callee !== "definePlugin") return;
    out.hasDefinePlugin = true;
    const def = n.arguments[0] && unwrap(n.arguments[0]);
    if (!def || !ts.isObjectLiteralExpression(def)) {
      out.dynamic.push({ ...span(n), what: "definePlugin argument is not an object literal" });
      return;
    }
    for (const p of def.properties) {
      if (ts.isSpreadAssignment(p)) out.dynamic.push({ ...span(p), what: "definePlugin argument contains a spread" });
      if (propName(p.name) !== "ops") continue;
      const ops = ts.isPropertyAssignment(p) ? unwrap(p.initializer) : undefined;
      if (!ops || !ts.isObjectLiteralExpression(ops)) {
        out.dynamic.push({ ...span(p), what: "ops is not an object literal" });
        continue;
      }
      for (const member of ops.properties) {
        const name = member.name;
        const resolved = !name ? undefined
          : ts.isComputedPropertyName(name) ? resolve(name.expression)
          : isString(name) || ts.isIdentifier(name) ? { value: name.text } as Resolved : undefined;
        if (resolved) out.registeredOps.push({ ...span(member), op: resolved.value, rule: resolved.rule });
        else out.dynamic.push({ ...span(member), what: ts.isSpreadAssignment(member) ? "ops contains a spread" : "op key is not a literal" });
      }
    }
  });

  // Module-level statements: imports, vocabularies, shapes, language frames.
  for (const st of sf.statements) {
    if ((ts.isImportDeclaration(st) || ts.isExportDeclaration(st)) && st.moduleSpecifier && isString(st.moduleSpecifier)) {
      const typeOnly = ts.isImportDeclaration(st) ? st.importClause?.isTypeOnly === true : st.isTypeOnly;
      out.imports.push({ specifier: st.moduleSpecifier.text, typeOnly });
    } else if (ts.isTypeAliasDeclaration(st)) {
      const parts = ts.isUnionTypeNode(st.type) ? st.type.types : [st.type];
      const members = parts.map((t) => (ts.isLiteralTypeNode(t) && isString(t.literal) ? t.literal.text : undefined));
      if (members.every((m): m is string => m !== undefined)) out.vocabularies.push({ symbol: st.name.text, members });
    } else if (ts.isInterfaceDeclaration(st)) {
      const fields = st.members.flatMap((m) => {
        const name = ts.isPropertySignature(m) ? propName(m.name) : undefined;
        return name === undefined ? [] : [{ name, optional: !!(m as ts.PropertySignature).questionToken, type: (m as ts.PropertySignature).type?.getText(sf) ?? "" }];
      });
      out.shapes.push({ symbol: st.name.text, fields });
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (!ts.isIdentifier(d.name) || !d.initializer) continue;
        const init = unwrap(d.initializer);
        if (!ts.isArrayLiteralExpression(init)) continue;
        if (init.elements.length > 0 && init.elements.every(isString)) {
          out.vocabularies.push({ symbol: d.name.text, members: init.elements.map((e) => (e as ts.StringLiteral).text) });
        } else if (d.type?.getText(sf) === "OpFrame[]") {
          for (const el of init.elements) {
            const value = literal(el);
            const op = value && typeof value === "object" && !Array.isArray(value) ? value["op"] : undefined;
            if (typeof op === "string") out.frames.push({ ...span(el), op, value: value! });
            else out.dynamic.push({ ...span(el), what: "language frame is not a literal with a string op" });
          }
        }
      }
    }
  }
  return out;
}
